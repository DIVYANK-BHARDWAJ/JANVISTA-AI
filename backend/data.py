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

# Initial Seed Citizen Grievances
CITIZEN_GRIEVANCES = [
    {
        "tracking_id": "JAN-2026-UP-84219",
        "name": "Ramesh Chandra",
        "phone": "+91 98765 43210",
        "state": "Uttar Pradesh",
        "district": "Sitapur",
        "category": "Healthcare",
        "urgency": "CRITICAL",
        "description": "Our local Community Health Centre has had no surgeon or functioning blood bank for 8 months. Patients must travel 68km to Lucknow in emergencies.",
        "status": "UNDER_REVIEW",
        "timestamp": "2026-09-12 11:20",
    },
    {
        "tracking_id": "JAN-2026-OR-84218",
        "name": "Sunita Majhi",
        "phone": "+91 91234 56789",
        "state": "Odisha",
        "district": "Koraput",
        "category": "Drinking Water",
        "urgency": "HIGH",
        "description": "Piped drinking water has stopped in 3 tribal hamlets since last month. Borewell water is yellow and causing stomach illness.",
        "status": "UNDER_REVIEW",
        "timestamp": "2026-09-12 09:45",
    },
    {
        "tracking_id": "JAN-2026-RJ-84217",
        "name": "Kailash Bishnoi",
        "phone": "+91 99887 76655",
        "state": "Rajasthan",
        "district": "Barmer",
        "category": "Electricity & Solar",
        "urgency": "MODERATE",
        "description": "Frequent power outages of 14 hours daily ruining crops and water pumps. Requesting solar feeder setup.",
        "status": "RECORDED",
        "timestamp": "2026-09-11 16:30",
    },
    {
        "tracking_id": "JAN-2026-BR-84216",
        "name": "Md. Aslam",
        "phone": "+91 97712 34567",
        "state": "Bihar",
        "district": "Purnia",
        "category": "Roads & Bridges",
        "urgency": "HIGH",
        "description": "Flood washed away culvert bridge on main block road. Over 4,000 villagers cannot reach hospital or market.",
        "status": "FIELD_AUDIT_REQUESTED",
        "timestamp": "2026-09-11 14:15",
    },
]

STATE_CODES = {
    "Uttar Pradesh": "UP",
    "Odisha": "OR",
    "Rajasthan": "RJ",
    "Bihar": "BR",
    "Kerala": "KL",
    "Maharashtra": "MH",
    "Madhya Pradesh": "MP",
    "Tamil Nadu": "TN",
    "Karnataka": "KA",
    "Andhra Pradesh": "AP",
    "West Bengal": "WB",
    "Punjab": "PB",
    "Gujarat": "GJ",
    "Assam": "AS",
    "Jharkhand": "JH",
}


def add_citizen_grievance(name: str, state: str, district: str, category: str, description: str, phone: str = "", urgency: str = "MODERATE"):
    """
    Records a new citizen grievance and returns the created record with Tracking ID.
    Zero external API key required.
    """
    import random
    from datetime import datetime

    state_code = STATE_CODES.get(state, "IN")
    random_num = random.randint(10000, 99999)
    tracking_id = f"JAN-2026-{state_code}-{random_num}"

    new_record = {
        "tracking_id": tracking_id,
        "name": name.strip(),
        "phone": phone.strip() if phone else "Not provided",
        "state": state.strip(),
        "district": district.strip(),
        "category": category.strip(),
        "urgency": urgency.strip().upper(),
        "description": description.strip(),
        "status": "UNDER_REVIEW",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
    }

    CITIZEN_GRIEVANCES.insert(0, new_record)

    # Increment request counter in Sitapur or matching hotspot if applicable
    for h in HOTSPOTS:
        if state_code in h.get("region_name", "") or state in h.get("region_name", ""):
            h["citizen_requests"] = h.get("citizen_requests", 0) + 1
            break

    return new_record


def get_citizen_grievances():
    return CITIZEN_GRIEVANCES

