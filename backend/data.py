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

# Initial Seed Citizen Grievances with rich details for District Collectors and Policy Makers
CITIZEN_GRIEVANCES = [
    {
        "tracking_id": "JAN-2026-UP-84219",
        "name": "Ramesh Chandra",
        "phone": "+91 98765 43210",
        "state": "Uttar Pradesh",
        "district": "Sitapur",
        "village_or_ward": "Khairabad Block, Rampur Kalan Village",
        "category": "Healthcare",
        "urgency": "CRITICAL",
        "description": "Our local Community Health Centre has had no surgeon or functioning blood bank for 8 months. Patients and pregnant mothers must travel 68km to Lucknow in critical emergencies over broken roads.",
        "status": "UNDER_REVIEW",
        "department": "District Health Society & CMO",
        "timestamp": "2026-09-12 11:20",
        "official_remarks": [
            {
                "officer": "District Collector (Sitapur)",
                "date": "2026-09-12 12:05",
                "remark": "Flagged as high-urgency maternal deficit. CMO directed to submit CHC staffing and trauma audit within 48 hours."
            }
        ]
    },
    {
        "tracking_id": "JAN-2026-UP-84220",
        "name": "Savitri Devi",
        "phone": "+91 94512 88341",
        "state": "Uttar Pradesh",
        "district": "Sitapur",
        "village_or_ward": "Maholi Tehsil, Ward 4",
        "category": "Drinking Water",
        "urgency": "HIGH",
        "description": "Jal Jeevan Mission overhead tank pipeline ruptured 3 weeks ago. Wastewater contamination has caused 24 cases of acute diarrhea in the primary school.",
        "status": "FIELD_AUDIT_SCHEDULED",
        "department": "Jal Nigam & Rural Water Sanitation",
        "timestamp": "2026-09-12 10:15",
        "official_remarks": [
            {
                "officer": "Executive Engineer (Jal Nigam)",
                "date": "2026-09-12 11:30",
                "remark": "Site inspection scheduled for 13th Sept morning. Alternative tanker deployment ordered."
            }
        ]
    },
    {
        "tracking_id": "JAN-2026-OR-84218",
        "name": "Sunita Majhi",
        "phone": "+91 91234 56789",
        "state": "Odisha",
        "district": "Koraput",
        "village_or_ward": "Semiliguda Block, Doliamba Hamlet",
        "category": "Drinking Water",
        "urgency": "HIGH",
        "description": "Piped drinking water has stopped in 3 tribal hamlets since last month. Borewell water is yellow with high fluoride and causing stomach illness among children.",
        "status": "UNDER_REVIEW",
        "department": "Rural Water Supply & Sanitation (RWSS)",
        "timestamp": "2026-09-12 09:45",
        "official_remarks": [
            {
                "officer": "District Collector (Koraput)",
                "date": "2026-09-12 10:40",
                "remark": "Referred to Koraput Gravity Filtration Project sanction committee."
            }
        ]
    },
    {
        "tracking_id": "JAN-2026-RJ-84217",
        "name": "Kailash Bishnoi",
        "phone": "+91 99887 76655",
        "state": "Rajasthan",
        "district": "Barmer",
        "village_or_ward": "Chohtan Tehsil, Sedwa Border Post",
        "category": "Electricity & Solar",
        "urgency": "MODERATE",
        "description": "Frequent power outages of 14 hours daily ruining cumin crops and tube-well operations. Requesting decentralized solar feeder setup.",
        "status": "ACTION_APPROVED",
        "department": "Jodhpur Vidyut Vitran Nigam & RREC",
        "timestamp": "2026-09-11 16:30",
        "official_remarks": [
            {
                "officer": "State Energy Planner",
                "date": "2026-09-12 09:10",
                "remark": "Included in PM-KUSUM Component C solar feeder microgrid priority allocation."
            }
        ]
    },
    {
        "tracking_id": "JAN-2026-BR-84216",
        "name": "Md. Aslam",
        "phone": "+91 97712 34567",
        "state": "Bihar",
        "district": "Purnia",
        "village_or_ward": "Baisi Block, Malharia Ghat",
        "category": "Roads & Bridges",
        "urgency": "HIGH",
        "description": "Mahananda river flood washed away wooden culvert bridge on main block road. Over 4,000 villagers completely cut off from district hospital and market.",
        "status": "FIELD_AUDIT_SCHEDULED",
        "department": "Rural Works Department (RWD)",
        "timestamp": "2026-09-11 14:15",
        "official_remarks": [
            {
                "officer": "District Magistrate (Purnia)",
                "date": "2026-09-11 17:00",
                "remark": "Temporary pontoon bridge deployed. Raised embankment proposal forwarded for PMGSY allocation."
            }
        ]
    },
    {
        "tracking_id": "JAN-2026-KL-84215",
        "name": "Ananya Nair",
        "phone": "+91 94471 20045",
        "state": "Kerala",
        "district": "Wayanad",
        "village_or_ward": "Meppadi Panchayat, Chooralmala Ward",
        "category": "Roads & Bridges",
        "urgency": "CRITICAL",
        "status": "UNDER_REVIEW",
        "department": "Public Works Department (PWD Roads)",
        "timestamp": "2026-09-11 11:00",
        "official_remarks": [
            {
                "officer": "District Collector (Wayanad)",
                "date": "2026-09-11 12:15",
                "remark": "Geotechnical team dispatched for retaining wall assessment; heavy vehicles diverted."
            }
        ]
    },
    {
        "tracking_id": "JAN-2026-JH-84221",
        "name": "Binod Kumar Mahato",
        "phone": "+91 94311 23456",
        "state": "Jharkhand",
        "district": "Giridih",
        "village_or_ward": "Tisri Block, Lokai Panchayat",
        "category": "Healthcare",
        "urgency": "CRITICAL",
        "description": "Primary Health Centre in Tisri block lacks a functional ultrasound unit and emergency obstetrician. 12 emergency delivery transfers to Dhanbad faced complications due to broken ghat roads.",
        "status": "UNDER_REVIEW",
        "department": "District Health Society & Civil Surgeon Giridih",
        "timestamp": "2026-09-12 14:30",
        "official_remarks": [
            {
                "officer": "District Collector (Giridih)",
                "date": "2026-09-12 15:10",
                "remark": "Civil Surgeon instructed to deploy mobile ultrasound medical van and audit emergency transport fleet."
            }
        ]
    },
    {
        "tracking_id": "JAN-2026-JH-84222",
        "name": "Sunita Murmu",
        "phone": "+91 98351 77890",
        "state": "Jharkhand",
        "district": "Giridih",
        "village_or_ward": "Pirtand Block, Madhuban Ward 2",
        "category": "Drinking Water",
        "urgency": "HIGH",
        "description": "Deep solar borewell water in 4 Santhal tribal tolas contaminated with high iron content and coal dust runoff. Over 60 children exhibiting skin rashes and gastrointestinal issues.",
        "status": "FIELD_AUDIT_SCHEDULED",
        "department": "Drinking Water and Sanitation Department (DWSD)",
        "timestamp": "2026-09-12 09:20",
        "official_remarks": [
            {
                "officer": "Executive Engineer (DWSD Giridih)",
                "date": "2026-09-12 10:45",
                "remark": "Technical team dispatched for Terafil water filtration installation; safe water tankers deployed."
            }
        ]
    },
    {
        "tracking_id": "JAN-2026-JH-84223",
        "name": "Arjun Soren",
        "phone": "+91 97092 11223",
        "state": "Jharkhand",
        "district": "Ranchi",
        "village_or_ward": "Kanke Block, Arsande Village",
        "category": "Roads & Bridges",
        "urgency": "HIGH",
        "description": "Main rural link road submerged during sudden storm runoff. Over 2,800 farmers unable to reach agricultural produce market committee yard in Ranchi.",
        "status": "UNDER_REVIEW",
        "department": "Rural Works Department (RWD Jharkhand)",
        "timestamp": "2026-09-11 16:00",
        "official_remarks": [
            {
                "officer": "State Infrastructure Planner",
                "date": "2026-09-12 08:30",
                "remark": "Elevated box culvert proposal shortlisted for State Road Fund (SRF) priority allocation."
            }
        ]
    },
    {
        "tracking_id": "JAN-2026-MH-84224",
        "name": "Santosh Deshmukh",
        "phone": "+91 98220 54321",
        "state": "Maharashtra",
        "district": "Pune",
        "village_or_ward": "Shirur Tehsil, Shikrapur Industrial Fringe",
        "category": "Drinking Water",
        "urgency": "HIGH",
        "description": "Industrial effluent infiltration into ground aquifer causing severe chemical contamination in drinking water wells serving 12,000 residents.",
        "status": "FIELD_AUDIT_SCHEDULED",
        "department": "Maharashtra Pollution Control Board & Zilla Parishad",
        "timestamp": "2026-09-12 13:15",
        "official_remarks": [
            {
                "officer": "District Collector (Pune)",
                "date": "2026-09-12 14:00",
                "remark": "Joint inspection team from MPCB and District Water Quality wing dispatched for sampling."
            }
        ]
    },
    {
        "tracking_id": "JAN-2026-KA-84225",
        "name": "Manjunath Gowda",
        "phone": "+91 94480 33445",
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "village_or_ward": "Anekal Taluk, Jigani Hobli",
        "category": "Roads & Bridges",
        "urgency": "MODERATE",
        "description": "Heavy industrial freight has damaged connecting arterial road to national highway. Severe dust pollution and transit delay for school buses.",
        "status": "ACTION_APPROVED",
        "department": "Public Works Department (Karnataka)",
        "timestamp": "2026-09-11 15:45",
        "official_remarks": [
            {
                "officer": "State Infrastructure Planner",
                "date": "2026-09-12 10:15",
                "remark": "Rigid white-topping package sanctioned under Chief Minister Grama Sadak Yojana."
            }
        ]
    },
    {
        "tracking_id": "JAN-2026-TN-84226",
        "name": "K. Senthil Kumar",
        "phone": "+91 98410 99887",
        "state": "Tamil Nadu",
        "district": "Chennai",
        "village_or_ward": "Sholinganallur Zone, Semmancheri Ward 197",
        "category": "Sanitation & Waste",
        "urgency": "HIGH",
        "description": "Stormwater drainage canal choked with silt and plastic debris leading to backwater inundation in residential colonies.",
        "status": "FIELD_AUDIT_SCHEDULED",
        "department": "Greater Chennai Corporation (GCC)",
        "timestamp": "2026-09-12 08:30",
        "official_remarks": [
            {
                "officer": "District Collector (Chennai)",
                "date": "2026-09-12 09:15",
                "remark": "GCC Zonal Officer directed to mobilize super-sucker machines and desilt canal within 72 hours."
            }
        ]
    },
]

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

    return record


def ensure_location_grievances(state: str = None, district: str = None):
    """
    Ensures that any queried state or district has realistic, high-impact grievances
    ready for District Collectors and State Planners to inspect and act upon.

    Resolves real districts from credentials.py – never defaults to out-of-state
    placeholder districts (e.g. Sitapur for Karnataka). Previously mis-seeded records
    (wrong district for a given state) are purged before re-seeding.
    """
    if not state and not district:
        return

    import random
    from datetime import datetime
    from credentials import get_collectors_by_state, STATE_PLANNER_CREDENTIALS

    s_clean = (state or "").strip().lower()
    d_clean = (district or "").strip().lower()

    target_state = state.strip() if state else "Jharkhand"
    state_code = STATE_CODES.get(target_state, "IN")

    # ── 1. Resolve real districts for this state ─────────────────────────────
    collectors_map = get_collectors_by_state(target_state)
    real_district_names = sorted(set(v["district"] for v in collectors_map.values()))

    # Fall back to a sensible placeholder only if credentials are missing
    if not real_district_names:
        # Try partial match (e.g. state name with different casing)
        for sp_key, sp_val in STATE_PLANNER_CREDENTIALS.items():
            if sp_val["state"].lower() == target_state.lower():
                hq = sp_val.get("headquarters", target_state)
                real_district_names = [hq]
                break
        if not real_district_names:
            real_district_names = [f"{target_state.split()[0]} Central"]

    # ── 2. Purge any grievances for this state whose district is NOT a real
    #       district of that state (cross-contamination from old Sitapur default)
    if real_district_names and s_clean:
        real_lower = {d.lower() for d in real_district_names}
        stale = [
            g for g in CITIZEN_GRIEVANCES
            if s_clean in g.get("state", "").lower()
            and g.get("district", "").lower() not in real_lower
        ]
        for g in stale:
            CITIZEN_GRIEVANCES.remove(g)

    # ── 3. Determine which districts still need seeding ──────────────────────
    #    If a specific district was requested, seed only that one.
    #    If a state-level overview is requested, seed the top 3 districts.
    if d_clean:
        # Find the exact matching real district (case-insensitive)
        matched = [d for d in real_district_names if d_clean in d.lower()]
        districts_to_seed = matched[:1] if matched else [real_district_names[0]]
    else:
        # Seed top 3 real districts (evenly spread: first, middle, last)
        n = len(real_district_names)
        indices = sorted(set([0, n // 3, (2 * n) // 3, n - 1]))
        districts_to_seed = [real_district_names[i] for i in indices][:3]

    # ── 4. For each district, check if we already have ≥ 2 valid records ─────
    category_templates = [
        {
            "category": "Healthcare",
            "urgency": "CRITICAL",
            "desc_fn": lambda d, s: (
                f"Sub-Divisional Hospital in {d} lacks a 24/7 trauma emergency unit. "
                f"Maternal and surgical emergencies face fatal delays – nearest tertiary "
                f"facility is over 60 km away in {s} capital."
            ),
            "dept_fn": lambda d: f"District Health Society & CMO ({d})",
            "remark_fn": lambda d: (
                f"Flagged to District Collector ({d}). CMO directed to submit facility "
                f"capacity audit and bed-strength enhancement proposal."
            ),
        },
        {
            "category": "Drinking Water",
            "urgency": "HIGH",
            "desc_fn": lambda d, s: (
                f"Deep groundwater borewells across 6 rural panchayats in {d} show "
                f"heavy fluoride & iron contamination. Villagers in {d} taluk travel "
                f"over 3 km for potable water, especially in summer months."
            ),
            "dept_fn": lambda d: f"District Jal Jeevan Mission Office ({d})",
            "remark_fn": lambda d: (
                f"Referred to State Water Planning Board. Jal Jeevan Mission pipeline "
                f"extension to {d} panchayats sanctioned under review."
            ),
        },
        {
            "category": "Roads & Bridges",
            "urgency": "HIGH",
            "desc_fn": lambda d, s: (
                f"Key agricultural feeder road and culvert washed out by seasonal floods "
                f"in {d}. Over 4,200 farmers in {d} sub-division are cut off from "
                f"mandis and block headquarters."
            ),
            "dept_fn": lambda d: f"Rural Works & PMGSY Division ({d})",
            "remark_fn": lambda d: (
                f"District Magistrate ({d}) inspected site; emergency culvert repair "
                f"under PMGSY-III forwarded to State Planner for fund sanction."
            ),
        },
        {
            "category": "Electricity & Solar",
            "urgency": "MODERATE",
            "desc_fn": lambda d, s: (
                f"Unscheduled 10–14 hour daily outages in {d} agricultural belt are "
                f"causing irrigation pump failures and crop loss. Farmers requesting "
                f"decentralized solar feeder installation under PM-KUSUM."
            ),
            "dept_fn": lambda d: f"State DISCOM & Renewable Energy Agency ({d})",
            "remark_fn": lambda d: (
                f"State Infrastructure Planner allocated {d} as priority site for "
                f"PM-KUSUM decentralized solar grid Phase-2 implementation."
            ),
        },
        {
            "category": "Sanitation & Waste",
            "urgency": "MODERATE",
            "desc_fn": lambda d, s: (
                f"Solid waste management breakdown in {d} ward areas – garbage vehicles "
                f"non-operational for 3 weeks. Stray animal menace and open burning "
                f"are creating public health risks in residential zones."
            ),
            "dept_fn": lambda d: f"Urban Local Body / District Panchayat ({d})",
            "remark_fn": lambda d: (
                f"ULB chief directed to repair compactor vehicles and restore daily "
                f"waste collection in {d} within 7 days. SWM plan to be submitted."
            ),
        },
    ]

    # ── 5. Seed missing records ───────────────────────────────────────────────
    for target_district in districts_to_seed:
        d_lower = target_district.lower()
        existing_for_dist = [
            g for g in CITIZEN_GRIEVANCES
            if s_clean in g.get("state", "").lower()
            and d_lower in g.get("district", "").lower()
        ]
        if len(existing_for_dist) >= 2:
            continue  # Already seeded for this district

        # Pick 3 random templates (varied per district)
        random.seed(hash(target_district + target_state) % (2**31))
        templates = random.sample(category_templates, k=min(3, len(category_templates)))

        for t in templates:
            r_num = random.randint(10000, 99999)
            desc = t["desc_fn"](target_district, target_state)
            dept = t["dept_fn"](target_district)
            remark = t["remark_fn"](target_district)

            rec = {
                "tracking_id": f"JAN-2026-{state_code}-{r_num}",
                "name": f"Local Resident, {target_district}",
                "phone": f"+91 {random.randint(70000,99999)} {random.randint(10000,99999)}",
                "state": target_state,
                "district": target_district,
                "village_or_ward": f"{target_district} Rural Panchayat Block",
                "category": t["category"],
                "urgency": t["urgency"],
                "description": desc,
                "status": "UNDER_REVIEW",
                "department": dept,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M"),
                "official_remarks": [
                    {
                        "officer": f"District Collector ({target_district})",
                        "date": datetime.now().strftime("%Y-%m-%d %H:%M"),
                        "remark": remark,
                    }
                ],
            }
            CITIZEN_GRIEVANCES.append(rec)


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
    """
    from credentials import get_collectors_by_state, STATE_PLANNER_CREDENTIALS

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

    # Deterministic categories & metrics for state hotspots
    categories = ["Healthcare", "Drinking Water", "Roads & Bridges", "Solar Microgrids", "Sanitation & Drainage"]
    gap_bases = [92.4, 86.8, 81.5, 76.2, 72.0]
    score_bases = [89.6, 84.2, 79.8, 75.4, 71.2]
    requests_bases = [2640, 1980, 1520, 1280, 940]

    top_5_districts = district_names[:5] if len(district_names) >= 5 else (district_names * 5)[:5]
    state_hotspots = []

    for idx, d_name in enumerate(top_5_districts):
        cat = categories[idx % len(categories)]
        gap = round(gap_bases[idx] - (idx * 0.4), 1)
        score = round(score_bases[idx] - (idx * 0.3), 1)
        reqs = requests_bases[idx] + (len(d_name) * 15)
        status = "CRITICAL" if idx == 0 else ("HIGH" if idx == 1 else "MODERATE")
        urgency = "High" if idx < 2 else "Medium"
        state_hotspots.append({
            "rank": idx + 1,
            "region_id": f"reg-{d_name.lower().replace(' ', '_')[:8]}-{state_code.lower()}",
            "region_name": f"{d_name} District, {actual_state_name}",
            "district": d_name,
            "category": cat,
            "gap_index": gap,
            "priority_score": score,
            "citizen_requests": reqs,
            "status": status,
            "urgency": urgency,
        })

    rank1 = state_hotspots[0]
    rank1_dist = rank1["district"]

    # Calculate deterministic spotlight priority MCA breakdown
    spotlight_priority = calculate_priority_score(
        demand=94.5,
        gap=rank1["gap_index"],
        vulnerability=86.0,
        accessibility_deficit=88.5,
        urgency=83.0,
        investment_mismatch=75.0,
    )

    spotlight = {
        "id": f"rec-{rank1_dist.lower().replace(' ', '_')[:8]}-{state_code.lower()}-01",
        "region_id": rank1["region_id"],
        "region_name": f"{rank1_dist} District, {actual_state_name}",
        "district": rank1_dist,
        "category": rank1["category"],
        "title": f"Establish 100-Bed Sub-Divisional Hospital & Emergency Trauma Unit in {rank1_dist}",
        "description": f"Critical infrastructure deficit in {rank1_dist} identified via {rank1['citizen_requests']:,} citizen demand signals. Nearest tertiary facilities are located over 65 km away at {hq}.",
        "estimated_cost_cr": 44.2,
        "impacted_population": 395000,
        "urgency_tier": rank1["status"],
        "status": "PROPOSED",
        "priority_score": spotlight_priority["score"],
        "priority_breakdown": spotlight_priority,
        "key_metrics": {
            "existing_chc_beds": 25,
            "required_beds": 100,
            "average_transit_time_mins": 90,
            "target_transit_time_mins": 25,
        }
    }

    total_reqs = sum(h["citizen_requests"] for h in state_hotspots)
    kpis = [
        {
            "id": "citizen-requests",
            "title": "Citizen Requests",
            "value": f"{total_reqs:,}",
            "subtitle": f"Analyzed across {total_districts} districts in {actual_state_name}",
            "accent": "sky",
        },
        {
            "id": "demand-clusters",
            "title": "Demand Clusters",
            "value": f"{len(state_hotspots)} Clusters",
            "subtitle": f"{actual_state_name} spatial & semantic grouping",
            "accent": "purple",
        },
        {
            "id": "hotspots-detected",
            "title": "Hotspots Detected",
            "value": f"{len(state_hotspots)} Districts",
            "subtitle": f"{rank1_dist} ranked #1 in {actual_state_name}",
            "accent": "rose",
        },
        {
            "id": "max-gap-index",
            "title": "Max Gap Index",
            "value": f"{rank1['gap_index']} %",
            "subtitle": f"{rank1_dist} {rank1['category']} Deficit",
            "accent": "amber",
        },
        {
            "id": "top-priority-score",
            "title": "Top Priority Score",
            "value": f"{spotlight_priority['score']} / 100",
            "subtitle": f"State Planning Model v1.0.0 ({actual_state_name})",
            "accent": "emerald",
        },
    ]

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
        "kpis": kpis,
        "spotlight": spotlight,
        "hotspots": state_hotspots,
        "pipeline": PIPELINE_STAGES,
    }