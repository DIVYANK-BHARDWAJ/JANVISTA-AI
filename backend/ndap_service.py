"""Server-side NDAP data connector.

Dataset URLs (and their API keys) remain in .env.  This module returns only
public NDAP data plus its field labels, dataset name, and reference year.
"""

import json
import os
from functools import lru_cache
from urllib import error, parse, request

from runtime_env import load_local_env

load_local_env()

DATASETS = {
    "demographics_development": "Demographics_Development",
    "population_baseline": "Population_Baseline",
    "infrastructure_amenities": "Infrastructure_Amenities",
    "roads": "roads",
}
MAX_PAGES_PER_DATASET = max(1, min(25, int(os.getenv("NDAP_MAX_PAGES", "5"))))


def _normalise(value: str) -> str:
    return " ".join((value or "").casefold().replace("-", " ").split())


@lru_cache(maxsize=4)
def _fetch(dataset: str) -> dict:
    env_name = DATASETS.get(dataset)
    url = os.getenv(env_name or "", "").strip()
    if not url:
        return {"status": "NOT_CONFIGURED", "records": []}
    try:
        parsed = parse.urlsplit(url)
        query = parse.parse_qs(parsed.query, keep_blank_values=True)
        all_records, headers, seen_pages = [], [], set()
        # NDAP returns a maximum page of records. Stop on the first short or
        # empty page; the cap prevents a malformed source from looping forever.
        complete = False
        for page in range(1, MAX_PAGES_PER_DATASET + 1):
            page_query = dict(query)
            page_query["pageno"] = [str(page)]
            page_url = parse.urlunsplit((parsed.scheme, parsed.netloc, parsed.path, parse.urlencode(page_query, doseq=True), parsed.fragment))
            with request.urlopen(page_url, timeout=30) as response:
                payload = json.loads(response.read().decode("utf-8"))
            if payload.get("IsError"):
                return {"status": "SOURCE_ERROR", "records": []}
            page_records = payload.get("Data", [])
            headers = payload.get("Headers", {}).get("Items", headers)
            if not isinstance(page_records, list) or not page_records:
                complete = True
                break
            # Some NDAP QA endpoints repeat their first page for page numbers
            # beyond the available range. Detect that response and stop.
            fingerprint = json.dumps(page_records, sort_keys=True, ensure_ascii=False)
            if fingerprint in seen_pages:
                complete = True
                break
            seen_pages.add(fingerprint)
            all_records.extend(page_records)
            if len(page_records) < 1000:
                complete = True
                break
        labels = {item.get("ID"): item.get("DisplayName") for item in headers if item.get("ID")}
        return {
            "status": "AVAILABLE" if complete else "PARTIAL_COVERAGE",
            "dataset_name": next((item.get("dataset_name") for item in headers if item.get("dataset_name")), "NDAP dataset"),
            "labels": labels,
            "records": all_records,
            "coverage_note": "All pages returned" if complete else f"First {MAX_PAGES_PER_DATASET} NDAP pages loaded; run a scheduled sync for full national coverage.",
        }
    except (error.URLError, error.HTTPError, json.JSONDecodeError, OSError):
        return {"status": "SOURCE_UNAVAILABLE", "records": []}


def _public_record(record: dict, labels: dict) -> dict:
    """Expose geography/year and labelled indicators; not credentials/URLs."""
    identity = {key: record.get(key) for key in ("StateCode", "StateName", "DistrictCode", "DistrictName", "BlockCode", "BlockName", "Year") if record.get(key) is not None}
    indicators = []
    for key, value in record.items():
        if key.startswith(("I", "D")) and value not in (None, ""):
            indicators.append({"id": key, "label": labels.get(key, key), "value": value})
    return {"geography": identity, "indicators": indicators}


def get_district_context(state: str, district: str) -> dict:
    """Fetch all configured NDAP measures that match a district by name."""
    result = {}
    wanted_state, wanted_district = _normalise(state), _normalise(district)
    for name in DATASETS:
        source = _fetch(name)
        matches = [row for row in source["records"] if _normalise(str(row.get("StateName", ""))) == wanted_state and _normalise(str(row.get("DistrictName", ""))) == wanted_district]
        result[name] = {
            "status": source["status"],
            "dataset_name": source.get("dataset_name"),
            "coverage_note": source.get("coverage_note"),
            "records": [_public_record(row, source.get("labels", {})) for row in matches],
        }
    return result


def _numeric_value(value):
    """NDAP aggregate values are often returned as {"avg": value, ...}."""
    if isinstance(value, dict):
        value = value.get("avg")
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def get_district_vulnerability(state: str, district: str) -> dict:
    """Return a documented NFHS-5 population-vulnerability score for a district."""
    source = _fetch("demographics_development")
    wanted_state, wanted_district = _normalise(state), _normalise(district)
    record = next((row for row in source.get("records", [])
                   if _normalise(str(row.get("StateName", ""))) == wanted_state
                   and _normalise(str(row.get("DistrictName", ""))) == wanted_district), None)
    if not record:
        return {"status": source.get("status", "SOURCE_UNAVAILABLE"), "score": None, "components": []}
    labels = source.get("labels", {})
    phrases = (
        "women age group 15 to 49 years who are anaemic",
        "children age group 6 to 59 months who are anaemic",
        "children under 5 years who are underweight",
    )
    components = []
    for field, value in record.items():
        label = labels.get(field, field)
        if any(phrase in _normalise(label) for phrase in phrases):
            numeric = _numeric_value(value)
            if numeric is not None:
                components.append({"label": label, "value": round(numeric, 1)})
    if not components:
        return {"status": "NO_USABLE_INDICATOR", "score": None, "components": []}
    return {
        "status": "AVAILABLE",
        "score": round(sum(item["value"] for item in components) / len(components), 1),
        "source": "NDAP NFHS-5 district demographics",
        "components": components,
    }


def get_district_service_gap(state: str, district: str, category: str) -> dict:
    """Return a category-specific NDAP service shortfall where one exists.

    The returned score is 100 minus an explicitly named coverage indicator.
    Categories without a matching public indicator return None instead of a
    made-up value.
    """
    source = _fetch("demographics_development")
    wanted_state, wanted_district = _normalise(state), _normalise(district)
    record = next((row for row in source.get("records", [])
                   if _normalise(str(row.get("StateName", ""))) == wanted_state
                   and _normalise(str(row.get("DistrictName", ""))) == wanted_district), None)
    target_by_category = {
        "drinking water": "population living in households with an improved drinking water source",
        "sanitation & waste": "population living in households that use an improved sanitation facility",
        "electricity & solar": "population living in households with electricity",
        "healthcare": "births attended by skilled health personnel",
        "education & schools": "children age 5 years who attended pre primary school",
    }
    target = target_by_category.get(_normalise(category))
    if not record or not target:
        return {"status": "NOT_AVAILABLE_FOR_CATEGORY", "score": None}
    labels = source.get("labels", {})
    for field, value in record.items():
        label = labels.get(field, field)
        if target in _normalise(label):
            coverage = _numeric_value(value)
            if coverage is not None:
                return {
                    "status": "AVAILABLE",
                    "score": round(max(0.0, min(100.0, 100.0 - coverage)), 1),
                    "source": f"NDAP NFHS-5: {label}",
                }
    return {"status": "NO_USABLE_INDICATOR", "score": None}


def integration_status() -> dict:
    return {name: _fetch(name)["status"] for name in DATASETS}
