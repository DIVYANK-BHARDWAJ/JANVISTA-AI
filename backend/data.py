import sys
from pathlib import Path

# Ensure backend directory is in python path regardless of where it is executed from
sys.path.insert(0, str(Path(__file__).resolve().parent))

from priority_engine import calculate_priority_score


REGIONS = [
    {
        "id": "reg-sitapur-up",
        "name": "Sitapur District",
        "state": "Uttar Pradesh",
        "population": 4483992,
        "vulnerability_index": 86.5,
        "coordinates": {"latitude": 27.57, "longitude": 80.66},
    },
    {
        "id": "reg-koraput-or",
        "name": "Koraput District",
        "state": "Odisha",
        "population": 1379647,
        "vulnerability_index": 82.0,
        "coordinates": {"latitude": 18.81, "longitude": 82.71},
    },
    {
        "id": "reg-barmer-rj",
        "name": "Barmer District",
        "state": "Rajasthan",
        "population": 2603751,
        "vulnerability_index": 74.5,
        "coordinates": {"latitude": 25.75, "longitude": 71.39},
    },
    {
        "id": "reg-purnia-br",
        "name": "Purnia District",
        "state": "Bihar",
        "population": 3264619,
        "vulnerability_index": 77.2,
        "coordinates": {"latitude": 25.78, "longitude": 87.47},
    },
    {
        "id": "reg-wayanad-kl",
        "name": "Wayanad District",
        "state": "Kerala",
        "population": 817420,
        "vulnerability_index": 52.3,
        "coordinates": {"latitude": 11.68, "longitude": 76.13},
    },
]

# Sitapur top spotlight priority score (computed with deterministic formula)
SITAPUR_PRIORITY = calculate_priority_score(
    demand=94.0,
    gap=91.2,
    vulnerability=86.5,
    accessibility_deficit=88.0,
    urgency=82.0,
    investment_mismatch=74.0,
)

TOP_RECOMMENDATION = {
    "id": "rec-sitapur-health-01",
    "region_id": "reg-sitapur-up",
    "region_name": "Sitapur District, Uttar Pradesh",
    "category": "Healthcare",
    "title": "Establish 100-Bed Sub-Divisional Hospital & Trauma Unit",
    "description": "High maternal & emergency transport deficit coupled with 94/100 citizen grievance density. Nearest tertiary trauma facility is 68 km away.",
    "estimated_cost_cr": 42.5,
    "impacted_population": 420000,
    "urgency_tier": "CRITICAL",
    "status": "PROPOSED",
    "priority_score": SITAPUR_PRIORITY["score"],
    "priority_breakdown": SITAPUR_PRIORITY,
    "key_metrics": {
        "existing_chc_beds": 30,
        "required_beds": 100,
        "average_transit_time_mins": 94,
        "target_transit_time_mins": 25,
    },
}

HOTSPOTS = [
    {
        "rank": 1,
        "region_id": "reg-sitapur-up",
        "region_name": "Sitapur District, UP",
        "category": "Healthcare",
        "gap_index": 91.2,
        "priority_score": 89.4,
        "citizen_requests": 2840,
        "status": "CRITICAL",
        "urgency": "High",
    },
    {
        "rank": 2,
        "region_id": "reg-koraput-or",
        "region_name": "Koraput District, Odisha",
        "category": "Drinking Water",
        "gap_index": 84.6,
        "priority_score": 82.1,
        "citizen_requests": 1950,
        "status": "HIGH",
        "urgency": "High",
    },
    {
        "rank": 3,
        "region_id": "reg-barmer-rj",
        "region_name": "Barmer District, Rajasthan",
        "category": "Solar Microgrids",
        "gap_index": 78.4,
        "priority_score": 76.5,
        "citizen_requests": 1420,
        "status": "MODERATE",
        "urgency": "Medium",
    },
    {
        "rank": 4,
        "region_id": "reg-purnia-br",
        "region_name": "Purnia District, Bihar",
        "category": "All-Weather Rural Roads",
        "gap_index": 75.0,
        "priority_score": 73.8,
        "citizen_requests": 1280,
        "status": "MODERATE",
        "urgency": "Medium",
    },
    {
        "rank": 5,
        "region_id": "reg-wayanad-kl",
        "region_name": "Wayanad District, Kerala",
        "category": "Landslide Resilient Bridges",
        "gap_index": 71.2,
        "priority_score": 70.4,
        "citizen_requests": 931,
        "status": "MODERATE",
        "urgency": "Low",
    },
]

PIPELINE_STAGES = [
    {"step": "01", "name": "Citizen Voice", "description": "Ingests unstructured citizen feedback"},
    {"step": "02", "name": "Extract & Classify", "description": "Structured demand parameter extraction"},
    {"step": "03", "name": "Demand Cluster", "description": "Spatial & semantic aggregation"},
    {"step": "04", "name": "Map Hotspot", "description": "Geospatial density anomaly mapping"},
    {"step": "05", "name": "Infra Gap", "description": "Asset coverage deficit calculation"},
    {"step": "06", "name": "Priority Score", "description": "Deterministic 6-factor decision engine"},
    {"step": "07", "name": "Evidence & Action", "description": "Full audit-backed policy recommendation"},
]
