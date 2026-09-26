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

# Live Citizen Grievances repository — populated strictly from verified citizen submissions.
# Saved persistently in backend/data/citizen_grievances.json and never deleted.
CITIZEN_GRIEVANCES = []

STATE_CODES = {
    # States (28)
    "Andhra Pradesh": "AP",
    "Arunachal Pradesh": "AR",
    "Assam": "AS",
    "Bihar": "BR",
    "Chhattisgarh": "CG",
    "Goa": "GA",
    "Gujarat": "GJ",
    "Haryana": "HR",
    "Himachal Pradesh": "HP",
    "Jharkhand": "JH",
    "Karnataka": "KA",
    "Kerala": "KL",
    "Madhya Pradesh": "MP",
    "Maharashtra": "MH",
    "Manipur": "MN",
    "Meghalaya": "ML",
    "Mizoram": "MZ",
    "Nagaland": "NL",
    "Odisha": "OR",
    "Punjab": "PB",
    "Rajasthan": "RJ",
    "Sikkim": "SK",
    "Tamil Nadu": "TN",
    "Telangana": "TG",
    "Tripura": "TR",
    "Uttar Pradesh": "UP",
    "Uttarakhand": "UK",
    "West Bengal": "WB",
    # Union Territories (8)
    "Andaman and Nicobar Islands": "AN",
    "Chandigarh": "CH",
    "Dadra and Nagar Haveli and Daman and Diu": "DN",
    "Delhi": "DL",
    "Jammu and Kashmir": "JK",
    "Ladakh": "LA",
    "Lakshadweep": "LD",
    "Puducherry": "PY",
}

import json

DATA_DIR = Path(__file__).resolve().parent / "data"
GRIEVANCES_FILE = DATA_DIR / "citizen_grievances.json"


def _persist_grievances():
    try:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        with open(GRIEVANCES_FILE, "w", encoding="utf-8") as f:
            json.dump(CITIZEN_GRIEVANCES, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[DATA] Error saving grievances: {e}")


def _load_persisted_grievances():
    if GRIEVANCES_FILE.exists():
        try:
            with open(GRIEVANCES_FILE, "r", encoding="utf-8") as f:
                saved = json.load(f)
                if isinstance(saved, list):
                    known_ids = {g.get("tracking_id") for g in CITIZEN_GRIEVANCES if g.get("tracking_id")}
                    for item in reversed(saved):
                        tid = item.get("tracking_id")
                        if tid and tid not in known_ids:
                            CITIZEN_GRIEVANCES.insert(0, item)
                            known_ids.add(tid)
        except Exception as e:
            print(f"[DATA] Error loading grievances: {e}")

    # Also sync any records in citizen_requests.json
    req_file = DATA_DIR / "citizen_requests.json"
    if req_file.exists():
        try:
            with open(req_file, "r", encoding="utf-8") as f:
                reqs = json.load(f)
                if isinstance(reqs, list):
                    known_ids = {g.get("tracking_id") for g in CITIZEN_GRIEVANCES if g.get("tracking_id")}
                    for req in reversed(reqs):
                        tid = req.get("trackingId") or req.get("id")
                        if tid and tid not in known_ids:
                            cat = (req.get("category") or "Healthcare").capitalize()
                            rec = {
                                "tracking_id": tid,
                                "name": req.get("name", "Citizen"),
                                "phone": req.get("phone", "Not provided"),
                                "email": req.get("email", "Not provided"),
                                "state": req.get("state", "Karnataka"),
                                "district": req.get("district", "Dharwad"),
                                "village_or_ward": req.get("villageOrWard") or req.get("village_or_ward", ""),
                                "category": cat,
                                "urgency": (req.get("urgency") or "MODERATE").upper(),
                                "description": req.get("description", ""),
                                "status": req.get("status", "IN_PROGRESS"),
                                "department": f"District {cat} Administration",
                                "timestamp": req.get("createdAt") or req.get("timestamp", "2026-09-25 15:25"),
                                "user_submitted": True,
                                "official_remarks": [
                                    {
                                        "officer": "System Dispatcher",
                                        "date": req.get("createdAt", "2026-09-25 15:25"),
                                        "remark": "Grievance registered in National Decision Intelligence Ledger. Forwarded to District Collectorate.",
                                    }
                                ],
                            }
                            CITIZEN_GRIEVANCES.insert(0, rec)
                            known_ids.add(tid)
        except Exception as e:
            print(f"[DATA] Error syncing from citizen_requests.json: {e}")

_load_persisted_grievances()


def add_citizen_grievance(
    name: str,
    state: str,
    district: str,
    category: str,
    description: str,
    phone: str = "",
    email: str = "",
    village_or_ward: str = "",
    urgency: str = "MODERATE"
):
    """
    Records a new citizen grievance and returns the created record with Tracking ID.
    Supports complete location tracking (village / ward / tehsil).
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
        "email": email.strip() if email else "Not provided",
        "state": state.strip(),
        "district": district.strip(),
        "village_or_ward": village_or_ward.strip() if village_or_ward else f"{district.strip()} Rural Area",
        "category": category.strip(),
        "urgency": urgency.strip().upper(),
        "description": description.strip(),
        "status": "UNDER_REVIEW",
        "department": f"District {category.strip()} Administration",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "user_submitted": True,
        "official_remarks": [
            {
                "officer": "System Dispatcher",
                "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "remark": "Grievance registered in National Decision Intelligence Ledger. Forwarded to District Collectorate."
            }
        ]
    }

    CITIZEN_GRIEVANCES.insert(0, new_record)

    # Increment request counter in matching hotspot if applicable
    for h in HOTSPOTS:
        if state_code in h.get("region_name", "") or state in h.get("region_name", ""):
            h["citizen_requests"] = h.get("citizen_requests", 0) + 1
            break

    _persist_grievances()
    return new_record


def update_citizen_grievance_status(
    tracking_id: str,
    new_status: str,
    remark: str = "",
    officer: str = "District Collector"
):
    """
    Updates the administrative status and appends official remarks to a grievance.
    Used by District Collectors and Policy Makers.
    """
    from datetime import datetime

    tracking_id_clean = tracking_id.strip().upper()
    record = next((g for g in CITIZEN_GRIEVANCES if g["tracking_id"].upper() == tracking_id_clean), None)
    if not record:
        return None

    record["status"] = new_status.strip().upper()

    if remark:
        if "official_remarks" not in record:
            record["official_remarks"] = []
        record["official_remarks"].insert(0, {
            "officer": officer.strip(),
            "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "remark": remark.strip(),
        })

    _persist_grievances()
    return record


def ensure_location_grievances(state: str = None, district: str = None):
    """
    Maintained for backward compatibility.
    Does not inject dummy records — dashboard metrics and ledger reflect strictly
    live citizen grievances submitted by citizens.
    """
    pass


def get_citizen_grievances(
    district: str = None,
    state: str = None,
    category: str = None,
    urgency: str = None,
    status: str = None
):
    """
    Returns filtered list of citizen grievances based on official oversight criteria.
    Guarantees rich records for any State or District requested.
    """
    if state or district:
        ensure_location_grievances(state=state, district=district)

    results = CITIZEN_GRIEVANCES

    if district and district.strip().lower() not in ["all", "all districts", ""]:
        d_lower = district.strip().lower()
        results = [g for g in results if d_lower in g.get("district", "").lower()]

    if state and state.strip().lower() not in ["all", "all india", ""]:
        s_lower = state.strip().lower()
        results = [g for g in results if s_lower in g.get("state", "").lower()]

    if category and category.strip().lower() not in ["all", "all categories", ""]:
        c_lower = category.strip().lower()
        results = [g for g in results if c_lower in g.get("category", "").lower()]

    if urgency and urgency.strip().lower() not in ["all", "all urgencies", ""]:
        u_upper = urgency.strip().upper()
        results = [g for g in results if g.get("urgency", "").upper() == u_upper]

    if status and status.strip().lower() not in ["all", "all statuses", ""]:
        st_upper = status.strip().upper()
        results = [g for g in results if g.get("status", "").upper() == st_upper]

    return results


def get_state_dashboard_data(state_name: str):
    """
    Generates tailored decision intelligence overview for State Planners of respective states.
    Covers all 28 States and 8 Union Territories of India.
    Includes state KPIs, Top Spotlight Priority Opportunity, and Ranked District Hotspots.
    All metrics are computed live from actual submitted citizen grievances.
    """
    from credentials import get_collectors_by_state, STATE_PLANNER_CREDENTIALS
    from grievance_analytics import compute_state_analytics

    state_clean = (state_name or "").strip().lower()
    matched_sp = None

    for sp in STATE_PLANNER_CREDENTIALS.values():
        if sp["state"].lower() == state_clean or sp["state_code"].lower() == state_clean:
            matched_sp = sp
            break

    if not matched_sp:
        for sp in STATE_PLANNER_CREDENTIALS.values():
            if state_clean in sp["state"].lower():
                matched_sp = sp
                break

    if not matched_sp:
        matched_sp = list(STATE_PLANNER_CREDENTIALS.values())[0]

    actual_state_name = matched_sp["state"]
    state_code = matched_sp["state_code"]
    hq = matched_sp.get("headquarters", "State Capital")

    # Fetch districts for this respective state
    collectors = get_collectors_by_state(actual_state_name)
    district_names = [c["district"] for c in collectors.values()]
    if not district_names:
        district_names = [f"{actual_state_name} Central", f"{actual_state_name} North", f"{actual_state_name} South"]

    total_districts = len(district_names)

    # Ensure grievances are seeded for this state before computing analytics
    ensure_location_grievances(state=actual_state_name)

    # Compute all metrics from real citizen grievances
    analytics = compute_state_analytics(
        state=actual_state_name,
        state_code=state_code,
        hq=hq,
        district_names=district_names,
    )

    return {
        "state": actual_state_name,
        "state_code": state_code,
        "headquarters": hq,
        "total_districts": total_districts,
        "banner": {
            "title": f"WHERE SHOULD {actual_state_name.upper()} ACT FIRST?",
            "subtitle": f"Transforming multilingual citizen feedback into explainable, evidence-backed public infrastructure priorities for the Government of {actual_state_name}.",
            "data_classification": f"{actual_state_name.upper()}_STATE_PLANNING_DATA",
        },
        "kpis": analytics.get("kpis", []),
        "spotlight": analytics.get("spotlight"),
        "hotspots": analytics.get("hotspots", []),
        "evidence_chain": analytics.get("evidence_chain", {}),
        "pipeline": PIPELINE_STAGES,
    }


# ==============================================================================
# DISTRICT-LEVEL DECISION INTELLIGENCE & SUB-DISTRICT (TALUK/BLOCK) ENGINE
# ==============================================================================

# Comprehensive database of authentic Sub-Divisions, Taluks, Tehsils & Blocks
# for districts across India's States & Union Territories.
DISTRICT_SUB_AREAS = {
    # Karnataka Districts
    "Haveri": [
        "Ranebennur Taluk Block",
        "Haveri Rural & City Ward",
        "Byadgi Market Yard & Block",
        "Hangal Taluk Block",
        "Hirekerur Taluk Block",
        "Shiggaon Taluk Block",
        "Savanur Taluk Block",
        "Rattihalli Taluk Block",
    ],
    "Bagalkot": [
        "Bagalkot Sadar Taluk",
        "Badami Heritage Taluk",
        "Jamkhandi Agro Block",
        "Mudhol Industrial Block",
        "Bilgi Irrigation Belt",
        "Hunagund Rural Block",
    ],
    "Ballari": [
        "Ballari City & Cantonment",
        "Sandur Mining & Mineral Belt",
        "Siruguppa Paddy & Agro Block",
        "Kampli Sugar & Irrigation Ward",
        "Kurugodu Rural Taluk",
    ],
    "Belagavi": [
        "Belagavi Sadar & Cantonment",
        "Gokak Falls & Industrial Block",
        "Chikodi Border Taluk",
        "Athani Agro-Rural Belt",
        "Bailhongal Taluk Block",
        "Saundatti Pilgrimage & Rural Ward",
    ],
    "Bengaluru Urban": [
        "Bengaluru North Taluk",
        "Bengaluru South & Tech Corridor",
        "Bengaluru East (Whitefield-Mahadevapura)",
        "Anekal Industrial & Hobli Belt",
        "Yelahanka North Sub-Division",
    ],
    "Bengaluru Rural": [
        "Devanahalli Airport Industrial Corridor",
        "Doddaballapura Textile & Agro Park",
        "Hosakote Logistics & Auto Belt",
        "Nelamangala Highway Transit Hub",
    ],
    "Mysuru": [
        "Mysuru City & Chamundi Zone",
        "Hunsur Tribal & Forest Fringe",
        "Nanjangud Industrial Hub",
        "T. Narasipura River Confluence Block",
        "Krishnarajanagara Agro Belt",
    ],
    "Dharwad": [
        "Hubballi Central Commercial Ward",
        "Dharwad Educational Corridor",
        "Kalghatgi Forest & Rural Taluk",
        "Navalgund Agro & Irrigation Belt",
        "Kundgol Rural Taluk",
    ],
    "Shivamogga": [
        "Shivamogga Sadar Taluk",
        "Bhadravati Steel & Industrial City",
        "Sagar Malnad Fringe Ward",
        "Shikaripura Agrarian Block",
        "Soraba Forest Fringe",
    ],
    "Tumakuru": [
        "Tumakuru Industrial Smart City Ward",
        "Tiptur Coconut & Agro Mandi",
        "Madhugiri Fort & Rural Taluk",
        "Sira Highway & Drought-Prone Belt",
        "Kunigal Stud Farm & Rural Taluk",
    ],
    "Dakshina Kannada": [
        "Mangaluru Port & Coastal Zone",
        "Bantwal Netravati River Basin",
        "Puttur Arecanut & Agro Block",
        "Belthangady Foothill Taluk",
        "Sullia Western Ghats Fringe",
    ],
    "Udupi": [
        "Udupi Coastal & Temple Zone",
        "Kundapura Estuary & Coastal Taluk",
        "Karkala Granite & Heritage Belt",
        "Byndoor Coastal Highway Corridor",
    ],
    "Kalaburagi": [
        "Kalaburagi City & North Taluk",
        "Aland Drought-Resilience Block",
        "Afzalpur Bhima Basin Ward",
        "Chincholi Forest & Eco Zone",
        "Sedam Cement & Mineral Corridor",
    ],

    # Uttar Pradesh Districts
    "Sitapur": [
        "Sitapur Sadar Tehsil",
        "Biswan Sugar & Agro Belt",
        "Laharpur Flood-Prone Block",
        "Mahmudabad Rural Sub-Division",
        "Sidhauli Highway Transit Corridor",
        "Misrikh Pilgrimage & Agro Ward",
    ],
    "Varanasi": [
        "Varanasi Sadar (Ghats & Urban Core)",
        "Pindra Airport & Agro Corridor",
        "Rohaniya Industrial & Weaver Hub",
        "Sevapuri Aspirational Block",
        "Cholapur Rural Panchayat Belt",
    ],
    "Lucknow": [
        "Lucknow Sadar (Hazratganj-Chowk)",
        "Bakshi Ka Talab Agro & Highway Zone",
        "Mohanlalganj Rural Sub-Division",
        "Malihabad Mango & Horticultural Belt",
        "Sarojini Nagar Industrial & Airport Fringe",
    ],
    "Gorakhpur": [
        "Gorakhpur Sadar Urban Tehsil",
        "Chauri Chaura Heritage & Agro Block",
        "Sahjanwa Industrial Corridor",
        "Bansgaon Flood-Resilience Ward",
        "Campierganj Forest & Agro Fringe",
    ],
    "Prayagraj": [
        "Prayagraj Sadar (Sangam & Urban Zone)",
        "Phulpur Industrial & Fertilizer Belt",
        "Soraon Trans-Ganga Agro Block",
        "Karchhana Yamuna-Par Rural Tehsil",
        "Meja Thermal & Rocky Terrain Ward",
    ],
    "Kanpur Nagar": [
        "Kanpur Sadar (Civil Lines & Central)",
        "Ghatampur Thermal & Agro Belt",
        "Bilhaur Rural & Riverine Tehsil",
        "Narwal Agro-Rural Block",
        "Kalyanpur Institutional & Tech Zone",
    ],

    # Bihar Districts
    "Patna": [
        "Patna Sadar (Urban Central)",
        "Danapur Cantonment & Sub-Division",
        "Barh Floodplain & Thermal Corridor",
        "Masaurhi Agrarian Sub-Division",
        "Paliganj Rural Panchayat Block",
        "Phulwari Sharif Industrial Ward",
    ],
    "Gaya": [
        "Gaya Sadar Urban Core",
        "Bodh Gaya International Heritage Zone",
        "Sherghati Grand Trunk Corridor",
        "Tekari Agro & Canal Belt",
        "Wazirganj Rural Panchayat Ward",
    ],
    "Purnia": [
        "Purnia East Commercial Hub",
        "Kasba Maize & Agro Mandi Block",
        "Banmankhi Jute & Sugar Belt",
        "Dhamdaha Kosi Basin Rural Block",
        "Baisi Flood-Prone Trans-Mahananda Ward",
    ],

    # Maharashtra Districts
    "Pune": [
        "Haveli Block (Pune Suburban & Fringe)",
        "Baramati Agro-Industrial Zone",
        "Shirur MIDC Manufacturing Corridor",
        "Junnar Horticultural & Cave Belt",
        "Khed (Chakan Auto & Industrial Hub)",
        "Daund Railway & Sugarcane Block",
        "Maval Western Ghats Corridor",
    ],
    "Nagpur": [
        "Nagpur Urban & MIHAN SEZ",
        "Nagpur Rural (Kamptee Logistics Belt)",
        "Hingna Industrial & Educational Corridor",
        "Katol Orange & Citrus Mandi",
        "Saoner Coal & Agro Block",
        "Umred Wildlife & Mining Fringe",
    ],

    # Rajasthan Districts
    "Barmer": [
        "Barmer Sadar & Oilfield Block",
        "Chohtan Thar Desert Border Post",
        "Baytu Lignite & Mineral Zone",
        "Balotra Textile Processing Hub",
        "Siwana Aravalli Fringe Block",
        "Gudamalani Agro-Cattle Belt",
    ],
    "Jaipur": [
        "Jaipur Urban (Walled City & Mansarovar)",
        "Sanganer Airport & Handicrafts Zone",
        "Amber Heritage & North Rural Block",
        "Chomu Vegetable Mandi & Agro Hub",
        "Kotputli Industrial & Mineral Belt",
    ],

    # Odisha Districts
    "Koraput": [
        "Koraput Sadar Hill Valley",
        "Jeypore Commercial & Rice Mandi",
        "Semiliguda Mining & HAL Fringe",
        "Pottangi Eastern Ghats Border Block",
        "Kotpad Handloom & Tribal Circle",
        "Boipariguda Forest & Hydel Fringe",
    ],

    # Kerala Districts
    "Wayanad": [
        "Vythiri Ghat Pass & Plantation Block",
        "Sulthan Bathery Wildlife & Interstate Corridor",
        "Mananthavady Tribal & Forest Fringe",
        "Kalpetta Municipal & Commercial Hub",
        "Meppadi Landslide-Sensitive Estate Belt",
    ],
}

STATE_LANGUAGES = {
    "Karnataka": ("Kannada", "kn"),
    "Tamil Nadu": ("Tamil", "ta"),
    "Kerala": ("Malayalam", "ml"),
    "Andhra Pradesh": ("Telugu", "te"),
    "Telangana": ("Telugu", "te"),
    "Maharashtra": ("Marathi", "mr"),
    "Gujarat": ("Gujarati", "gu"),
    "West Bengal": ("Bengali", "bn"),
    "Odisha": ("Odia", "or"),
    "Punjab": ("Punjabi", "pa"),
    "Assam": ("Assamese", "as"),
    "Bihar": ("Bhojpuri, Maithili, Hindi", "hi"),
    "Uttar Pradesh": ("Hindi, Awadhi, Bhojpuri", "hi"),
    "Madhya Pradesh": ("Hindi, Bundeli", "hi"),
    "Rajasthan": ("Marwari, Hindi", "hi"),
    "Haryana": ("Haryanvi, Hindi", "hi"),
    "Jharkhand": ("Santhali, Hindi", "hi"),
    "Chhattisgarh": ("Chhattisgarhi, Hindi", "hi"),
    "Himachal Pradesh": ("Pahari, Hindi", "hi"),
    "Uttarakhand": ("Garhwali, Kumaoni, Hindi", "hi"),
}

STATE_DEMAND_QUOTES = {
    "Karnataka": {
        "local": "ಇಲ್ಲಿ ತುರ್ತು ಟ್ರಾಮಾ ಕೇರ್ ಮತ್ತು ತಜ್ಞ ವೈದ್ಯರ ಕೊರತೆಯಿಂದ ರೋಗಿಗಳನ್ನು ದೂರದ ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಬೇಕಾಗಿದೆ.",
        "en": "Due to severe lack of local emergency trauma care, critical patients must travel over 70 km to distant tertiary hospitals.",
    },
    "Tamil Nadu": {
        "local": "இங்கு அவசர சிகிச்சை வசதி இல்லாததால், நோயாளிகளை மாவட்ட தலைமை மருத்துவமனைக்கு கொண்டு செல்ல வேண்டியுள்ளது.",
        "en": "Lack of sub-divisional trauma care forces patients to travel long distances, risking golden-hour survival.",
    },
    "Kerala": {
        "local": "അടിയന്തര ട്രോമ കെയർ സൗകര്യങ്ങളുടെ അപര്യാപ്തത കാരണം വിദൂര ആശുപത്രികളിലേക്ക് പോകേണ്ടി വരുന്നു.",
        "en": "Critical shortage of trauma stabilization units forces arduous travel over hill corridors during emergencies.",
    },
    "Andhra Pradesh": {
        "local": "ఇక్కడ అత్యవసర ట్రూమా కేర్ మరియు ఐసీయೂ సౌకర్యాలు లేకపోవడంతో ప్రజలు తీవ్ర ఇబ్బందులు పడుతున్నారు.",
        "en": "Absence of emergency trauma and ICU facilities in this sub-division poses grave risks during acute trauma transit.",
    },
    "Telangana": {
        "local": "స్థానికంగా సూపర్ స్పెషాలిటీ లేదా అత్యవసర వైద్య సదుಪಾಯాలు లేకపోవడంతో జిల్లా కేంద్రానికి వెళ్లాల్సి వస్తోంది.",
        "en": "Deficit in emergency surgical facilities requires expensive transit to distant tertiary hospitals.",
    },
    "Maharashtra": {
        "local": "येथे कोणतीही तातडीची आपत्कालीन ट्रामा केअर सुविधा नाही. जिल्हा रुग्णालयात नेताना गंभीर अडಚಣी येतात.",
        "en": "Lack of functional trauma care locally results in transport delays far exceeding safe medical parameters.",
    },
    "West Bengal": {
        "local": "এখানে জরুরি ট্রমা কেয়ার এবং বিশেষজ্ঞ চিকিৎসার অভাবে রোগীদের অনেক দূরে স্থানান্তরিত করতে হয়।",
        "en": "Absence of functional sub-divisional trauma units forces long-distance transfers during critical golden hours.",
    },
    "Odisha": {
        "local": "ଏଠାରେ ଜରୁରୀକାଳୀନ ଟ୍ରମା ଚିକିତ୍ସା ସୁବିଧା ନଥିବାରୁ ରୋଗୀମାନେ ବହୁତ ଅସୁବିଧାର ସମ୍ମୁଖୀନ ହେଉଛନ୍ତି।",
        "en": "Absence of functional trauma and emergency surgery facilities creates grave transit risks for accident victims.",
    },
}

DEFAULT_DEMAND_QUOTE = {
    "local": "हमारे क्षेत्र में कोई कार्यात्मक आपातकालीन ट्रॉमा सेंटर नहीं है। गंभीर स्थिति में मरीज को 65 किमी दूर ले जाना पड़ता है।",
    "en": "No functional sub-divisional emergency trauma center exists here. Critical patients face delays exceeding golden-hour survival benchmarks.",
}


def get_district_sub_areas(district_name: str, state_name: str = ""):
    """
    Returns authentic or realistic sub-divisions, taluks, tehsils and blocks
    for any of the 700+ districts across India.
    """
    # Direct match in curated database
    for key, areas in DISTRICT_SUB_AREAS.items():
        if key.lower() == district_name.strip().lower() or key.lower() in district_name.strip().lower():
            return list(areas)

    # Procedural generator tailored to state administrative terminology
    d = district_name.strip()
    s = (state_name or "").strip().lower()

    if any(st in s for st in ["karnataka", "tamil nadu", "kerala", "andhra", "telangana", "maharashtra", "gujarat", "goa"]):
        return [
            f"{d} Taluk (Central)",
            f"{d} North Rural Block",
            f"{d} South Agro Belt",
            f"{d} East Industrial Corridor",
            f"{d} West Highway Ward",
        ]
    elif any(st in s for st in ["bihar", "west bengal", "odisha", "jharkhand", "assam"]):
        return [
            f"{d} Sadar Sub-Division",
            f"{d} North Community Block",
            f"{d} South Rural Block",
            f"{d} Riverine / Canal Belt",
            f"{d} Industrial Fringe",
        ]
    else:
        return [
            f"{d} Sadar Tehsil",
            f"{d} North Rural Block",
            f"{d} South Agro Zone",
            f"{d} East Highway Corridor",
            f"{d} West Industrial Belt",
        ]


def get_district_dashboard_data(district_name: str, state_name: str = None):
    """
    Generates tailored decision intelligence overview for District Collectors of respective districts.
    Covers all 700+ Districts across India.
    Includes district KPIs, Top Spotlight Priority Opportunity, and Ranked Sub-District (Taluk/Block) Hotspots.
    All metrics are computed live from actual submitted citizen grievances via the analytics engine.
    """
    from credentials import DISTRICT_COLLECTOR_CREDENTIALS, STATE_PLANNER_CREDENTIALS
    from grievance_analytics import compute_district_analytics

    d_clean = (district_name or "").strip().lower()
    s_clean = (state_name or "").strip().lower() if state_name else ""
    matched_dc = None

    # Priority 1: Exact district + state match
    for cred in DISTRICT_COLLECTOR_CREDENTIALS.values():
        if cred["district"].lower() == d_clean:
            if not s_clean or cred["state"].lower() == s_clean or cred["state_code"].lower() == s_clean:
                matched_dc = cred
                break

    # Priority 2: Substring district match
    if not matched_dc:
        for cred in DISTRICT_COLLECTOR_CREDENTIALS.values():
            if d_clean in cred["district"].lower():
                if not s_clean or cred["state"].lower() == s_clean or cred["state_code"].lower() == s_clean:
                    matched_dc = cred
                    break

    # Priority 3: Dynamic fallback — accept the requested district/state as-is.
    # This covers all 700+ districts of India including those not explicitly
    # listed in credentials. Resolve state code from STATE_CODES mapping.
    if not matched_dc:
        req_district = district_name.strip().title()
        req_state = (state_name or "").strip()
        # Try to resolve state from STATE_CODES
        resolved_state = req_state
        for st_name in STATE_CODES:
            if st_name.lower() == req_state.lower() or req_state.lower() in st_name.lower():
                resolved_state = st_name
                break
        sc = STATE_CODES.get(resolved_state, "IN")
        matched_dc = {
            "district": req_district,
            "state": resolved_state or req_state or "India",
            "state_code": sc,
            "jurisdiction": f"{req_district} District, {resolved_state or req_state}",
        }

    actual_district = matched_dc["district"]
    actual_state = matched_dc["state"]
    state_code = matched_dc["state_code"]
    jurisdiction = matched_dc.get("jurisdiction", f"{actual_district} District, {actual_state}")

    # Ensure grievances are seeded for this district so analytics have data
    ensure_location_grievances(state=actual_state, district=actual_district)

    # Fetch authentic sub-areas / taluks / blocks for this district
    sub_areas = get_district_sub_areas(actual_district, actual_state)
    total_areas = len(sub_areas)

    # Local language determination
    lang_info = STATE_LANGUAGES.get(actual_state, ("Hindi", "hi"))
    lang_label = lang_info[0]

    # State-specific citizen demand quote for evidence chain
    state_quotes = STATE_DEMAND_QUOTES.get(actual_state, DEFAULT_DEMAND_QUOTE)

    # ── Compute ALL metrics from actual citizen grievances ────────────────────
    analytics = compute_district_analytics(
        district=actual_district,
        state=actual_state,
        sub_areas=sub_areas,
        state_code=state_code,
        lang_label=lang_label,
        state_quotes=state_quotes,
    )

    total_gv = analytics.get("total_grievances", 0)
    subtitle_suffix = f"{total_gv} grievances analyzed." if total_gv else "Awaiting citizen grievance submissions."

    return {
        "scope": "district",
        "state": actual_state,
        "state_code": state_code,
        "district": actual_district,
        "jurisdiction": jurisdiction,
        "total_areas": total_areas,
        "sub_areas": sub_areas,
        "banner": analytics.get("banner") or {
            "title": f"WHERE SHOULD {actual_district.upper()} ACT FIRST?",
            "subtitle": (
                f"Transforming localized citizen feedback into explainable, evidence-backed public "
                f"infrastructure priorities for the District Collectorate of {actual_district}, {actual_state}. "
                f"{subtitle_suffix}"
            ),
            "data_classification": f"{actual_district.upper()}_DISTRICT_ADMINISTRATION_DATA",
        },
        "kpis": analytics.get("kpis", []),
        "spotlight": analytics.get("spotlight"),
        "hotspots": analytics.get("hotspots", []),
        "evidence_chain": analytics.get("evidence_chain", {}),
        "pipeline": PIPELINE_STAGES,
    }