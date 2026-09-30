"""Optional, dependency-free Gemini extraction client for the Flask intake API."""

import json
import os
from urllib import error, request

from runtime_env import load_local_env

load_local_env()

ALLOWED_CATEGORIES = {
    "Healthcare", "Drinking Water", "Roads & Bridges",
    "Electricity & Solar", "Sanitation & Waste", "Other",
}


def _fallback(description: str, declared_urgency: str) -> dict:
    """Return an explicit fallback result; never claim it came from Gemini."""
    tier = (declared_urgency or "MODERATE").strip().upper()
    value = {"CRITICAL": 95, "HIGH": 75, "MODERATE": 50, "LOW": 25}.get(tier, 50)
    return {"provider": "deterministic_fallback", "category": "Other", "severity": value,
            "immediacy": value, "language_detected": "und",
            "english_summary": description.strip()[:500], "used_for_priority": False}


def analyse_grievance(description: str, declared_urgency: str) -> dict:
    """Extract validated JSON using Gemini when GEMINI_API_KEY is configured."""
    fallback = _fallback(description, declared_urgency)
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        return fallback
    prompt = """Classify this Indian public-infrastructure grievance. Return JSON only with:
category (Healthcare|Drinking Water|Roads & Bridges|Electricity & Solar|Sanitation & Waste|Other),
severity (0-100), immediacy (0-100), language_detected (BCP-47 or ISO code),
english_summary (one concise sentence). Do not invent facts not present in the text.
Grievance: """ + description
    body = json.dumps({"contents": [{"parts": [{"text": prompt}]}],
                       "generationConfig": {"temperature": 0, "responseMimeType": "application/json"}}).encode("utf-8")
    # Gemini 2.0 Flash has been retired. Keep the model in one place so a
    # future provider migration does not silently route all intake to fallback.
    model = os.getenv("GEMINI_MODEL", "gemini-3.8-flash").strip()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key=" + api_key
    req = request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
    try:
        with request.urlopen(req, timeout=12) as response:
            payload = json.loads(response.read().decode("utf-8"))
        result = json.loads(payload["candidates"][0]["content"]["parts"][0]["text"])
        category = result.get("category", "Other")
        severity = max(0, min(100, float(result["severity"])))
        immediacy = max(0, min(100, float(result["immediacy"])))
        summary = str(result["english_summary"]).strip()[:500]
        language = str(result["language_detected"]).strip()[:20] or "und"
        if category not in ALLOWED_CATEGORIES or not summary:
            raise ValueError("invalid Gemini response")
        return {"provider": model, "category": category,
                "severity": round(severity, 1), "immediacy": round(immediacy, 1),
                "language_detected": language, "english_summary": summary,
                "used_for_priority": True}
    except (KeyError, TypeError, ValueError, json.JSONDecodeError, error.URLError, error.HTTPError):
        return fallback
