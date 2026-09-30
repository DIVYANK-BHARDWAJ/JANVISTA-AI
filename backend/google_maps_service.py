"""Google Maps API adapter for verifiable healthcare accessibility evidence."""

import json
import os
from datetime import datetime, timezone
from urllib import error, parse, request

from runtime_env import load_local_env

load_local_env()


def _api_key() -> str:
    return (os.getenv("GOOGLE_MAPS_API_KEY") or os.getenv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY") or "").strip()


def _json_request(url: str, payload: dict | None = None, headers: dict | None = None) -> dict:
    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = request.Request(url, data=body, headers=headers or {}, method="POST" if body else "GET")
    with request.urlopen(req, timeout=15) as response:
        return json.loads(response.read().decode("utf-8"))


def _geocode(address: str, key: str) -> dict | None:
    url = "https://maps.googleapis.com/maps/api/geocode/json?" + parse.urlencode({"address": address, "key": key})
    response = _json_request(url)
    if response.get("status") != "OK" or not response.get("results"):
        return None
    location = response["results"][0]["geometry"]["location"]
    return {"latitude": location["lat"], "longitude": location["lng"], "formatted_address": response["results"][0].get("formatted_address", address)}


def _nearby_hospitals(origin: dict, key: str) -> list[dict]:
    payload = {
        "textQuery": "hospital",
        "locationBias": {"circle": {"center": {"latitude": origin["latitude"], "longitude": origin["longitude"]}, "radius": 50000.0}},
        "maxResultCount": 10,
    }
    headers = {"Content-Type": "application/json", "X-Goog-Api-Key": key,
               "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location"}
    response = _json_request("https://places.googleapis.com/v1/places:searchText", payload, headers)
    hospitals = []
    for place in response.get("places", []):
        loc = place.get("location") or {}
        if "latitude" in loc and "longitude" in loc:
            hospitals.append({"place_id": place.get("id"), "name": (place.get("displayName") or {}).get("text", "Hospital"),
                              "address": place.get("formattedAddress"), "latitude": loc["latitude"], "longitude": loc["longitude"]})
    return hospitals


def _route(origin: dict, destination: dict, key: str) -> dict | None:
    payload = {"origin": {"location": {"latLng": {"latitude": origin["latitude"], "longitude": origin["longitude"]}}},
               "destination": {"location": {"latLng": {"latitude": destination["latitude"], "longitude": destination["longitude"]}}},
               "travelMode": "DRIVE", "routingPreference": "TRAFFIC_AWARE"}
    headers = {"Content-Type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"}
    response = _json_request("https://routes.googleapis.com/directions/v2:computeRoutes", payload, headers)
    routes = response.get("routes") or []
    if not routes:
        return None
    route = routes[0]
    seconds = int(str(route.get("duration", "0s")).removesuffix("s"))
    return {"minutes": round(seconds / 60, 1), "distance_meters": route.get("distanceMeters")}


def healthcare_accessibility(village_or_ward: str, district: str, state: str) -> dict:
    """Return live Google-derived route evidence; never synthesises unavailable data."""
    key = _api_key()
    if not key:
        return {"status": "NOT_CONFIGURED", "message": "GOOGLE_MAPS_API_KEY is not configured."}
    try:
        origin = _geocode(f"{village_or_ward}, {district}, {state}, India", key)
        if not origin:
            return {"status": "LOCATION_NOT_FOUND", "message": "Google could not geocode the submitted locality."}
        hospitals = _nearby_hospitals(origin, key)
        candidates = []
        for hospital in hospitals[:5]:
            route = _route(origin, hospital, key)
            if route:
                candidates.append({**hospital, **route})
        if not candidates:
            return {"status": "NO_ROUTE", "origin": origin, "message": "No drivable hospital route was returned."}
        nearest = min(candidates, key=lambda item: item["minutes"])
        return {"status": "AVAILABLE", "provider": "Google Maps Places + Routes", "retrieved_at": datetime.now(timezone.utc).isoformat(),
                "origin": origin, "nearest_hospital": nearest,
                "method_note": "Place listing and road-route duration; facility capacity is not inferred."}
    except (error.URLError, error.HTTPError, KeyError, TypeError, ValueError, json.JSONDecodeError) as exc:
        return {"status": "API_UNAVAILABLE", "message": f"Google Maps request failed: {type(exc).__name__}"}
