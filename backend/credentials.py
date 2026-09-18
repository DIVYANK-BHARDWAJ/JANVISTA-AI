"""
JANVISTA AI - Official Login Credentials Registry
===================================================
Covers all 28 States + 8 Union Territories of India.
Roles:
  - district_collector : One per district (username = dc.<district_slug>.<state_code>)
  - state_planner      : One per state/UT  (username = sp.<state_code>)

Password convention
  - District Collector : DC@<StateCode><DistrictCode>2026
  - State Planner      : SP@<StateCode>PLAN2026

IMPORTANT: These are demonstration credentials for the JANVISTA AI platform.
           In production, replace plain-text passwords with hashed values (bcrypt/argon2).
"""

# ---------------------------------------------------------------------------
# STATE PLANNERS  (one per State / Union Territory)
# ---------------------------------------------------------------------------
# Format: username -> {role, state, state_code, password, display_name}

STATE_PLANNER_CREDENTIALS = {

    # ── 28 STATES ────────────────────────────────────────────────────────────

    "sp.ap": {
        "role": "state_planner",
        "state": "Andhra Pradesh",
        "state_code": "AP",
        "username": "sp.ap",
        "password": "SP@APPLAN2026",
        "display_name": "State Planner – Andhra Pradesh",
        "headquarters": "Amaravati",
    },
    "sp.ar": {
        "role": "state_planner",
        "state": "Arunachal Pradesh",
        "state_code": "AR",
        "username": "sp.ar",
        "password": "SP@ARPLAN2026",
        "display_name": "State Planner – Arunachal Pradesh",
        "headquarters": "Itanagar",
    },
    "sp.as": {
        "role": "state_planner",
        "state": "Assam",
        "state_code": "AS",
        "username": "sp.as",
        "password": "SP@ASPLAN2026",
        "display_name": "State Planner – Assam",
        "headquarters": "Dispur",
    },
    "sp.br": {
        "role": "state_planner",
        "state": "Bihar",
        "state_code": "BR",
        "username": "sp.br",
        "password": "SP@BRPLAN2026",
        "display_name": "State Planner – Bihar",
        "headquarters": "Patna",
    },
    "sp.cg": {
        "role": "state_planner",
        "state": "Chhattisgarh",
        "state_code": "CG",
        "username": "sp.cg",
        "password": "SP@CGPLAN2026",
        "display_name": "State Planner – Chhattisgarh",
        "headquarters": "Raipur",
    },
    "sp.ga": {
        "role": "state_planner",
        "state": "Goa",
        "state_code": "GA",
        "username": "sp.ga",
        "password": "SP@GAPLAN2026",
        "display_name": "State Planner – Goa",
        "headquarters": "Panaji",
    },
    "sp.gj": {
        "role": "state_planner",
        "state": "Gujarat",
        "state_code": "GJ",
        "username": "sp.gj",
        "password": "SP@GJPLAN2026",
        "display_name": "State Planner – Gujarat",
        "headquarters": "Gandhinagar",
    },
    "sp.hr": {
        "role": "state_planner",
        "state": "Haryana",
        "state_code": "HR",
        "username": "sp.hr",
        "password": "SP@HRPLAN2026",
        "display_name": "State Planner – Haryana",
        "headquarters": "Chandigarh",
    },
    "sp.hp": {
        "role": "state_planner",
        "state": "Himachal Pradesh",
        "state_code": "HP",
        "username": "sp.hp",
        "password": "SP@HPPLAN2026",
        "display_name": "State Planner – Himachal Pradesh",
        "headquarters": "Shimla",
    },
    "sp.jh": {
        "role": "state_planner",
        "state": "Jharkhand",
        "state_code": "JH",
        "username": "sp.jh",
        "password": "SP@JHPLAN2026",
        "display_name": "State Planner – Jharkhand",
        "headquarters": "Ranchi",
    },
    "sp.ka": {
        "role": "state_planner",
        "state": "Karnataka",
        "state_code": "KA",
        "username": "sp.ka",
        "password": "SP@KAPLAN2026",
        "display_name": "State Planner – Karnataka",
        "headquarters": "Bengaluru",
    },
    "sp.kl": {
        "role": "state_planner",
        "state": "Kerala",
        "state_code": "KL",
        "username": "sp.kl",
        "password": "SP@KLPLAN2026",
        "display_name": "State Planner – Kerala",
        "headquarters": "Thiruvananthapuram",
    },
    "sp.mp": {
        "role": "state_planner",
        "state": "Madhya Pradesh",
        "state_code": "MP",
        "username": "sp.mp",
        "password": "SP@MPPLAN2026",
        "display_name": "State Planner – Madhya Pradesh",
        "headquarters": "Bhopal",
    },
    "sp.mh": {
        "role": "state_planner",
        "state": "Maharashtra",
        "state_code": "MH",
        "username": "sp.mh",
        "password": "SP@MHPLAN2026",
        "display_name": "State Planner – Maharashtra",
        "headquarters": "Mumbai",
    },
    "sp.mn": {
        "role": "state_planner",
        "state": "Manipur",
        "state_code": "MN",
        "username": "sp.mn",
        "password": "SP@MNPLAN2026",
        "display_name": "State Planner – Manipur",
        "headquarters": "Imphal",
    },
    "sp.ml": {
        "role": "state_planner",
        "state": "Meghalaya",
        "state_code": "ML",
        "username": "sp.ml",
        "password": "SP@MLPLAN2026",
        "display_name": "State Planner – Meghalaya",
        "headquarters": "Shillong",
    },
    "sp.mz": {
        "role": "state_planner",
        "state": "Mizoram",
        "state_code": "MZ",
        "username": "sp.mz",
        "password": "SP@MZPLAN2026",
        "display_name": "State Planner – Mizoram",
        "headquarters": "Aizawl",
    },
    "sp.nl": {
        "role": "state_planner",
        "state": "Nagaland",
        "state_code": "NL",
        "username": "sp.nl",
        "password": "SP@NLPLAN2026",
        "display_name": "State Planner – Nagaland",
        "headquarters": "Kohima",
    },
    "sp.or": {
        "role": "state_planner",
        "state": "Odisha",
        "state_code": "OR",
        "username": "sp.or",
        "password": "SP@ORPLAN2026",
        "display_name": "State Planner – Odisha",
        "headquarters": "Bhubaneswar",
    },
    "sp.pb": {
        "role": "state_planner",
        "state": "Punjab",
        "state_code": "PB",
        "username": "sp.pb",
        "password": "SP@PBPLAN2026",
        "display_name": "State Planner – Punjab",
        "headquarters": "Chandigarh",
    },
    "sp.rj": {
        "role": "state_planner",
        "state": "Rajasthan",
        "state_code": "RJ",
        "username": "sp.rj",
        "password": "SP@RJPLAN2026",
        "display_name": "State Planner – Rajasthan",
        "headquarters": "Jaipur",
    },
    "sp.sk": {
        "role": "state_planner",
        "state": "Sikkim",
        "state_code": "SK",
        "username": "sp.sk",
        "password": "SP@SKPLAN2026",
        "display_name": "State Planner – Sikkim",
        "headquarters": "Gangtok",
    },
    "sp.tn": {
        "role": "state_planner",
        "state": "Tamil Nadu",
        "state_code": "TN",
        "username": "sp.tn",
        "password": "SP@TNPLAN2026",
        "display_name": "State Planner – Tamil Nadu",
        "headquarters": "Chennai",
    },
    "sp.tg": {
        "role": "state_planner",
        "state": "Telangana",
        "state_code": "TG",
        "username": "sp.tg",
        "password": "SP@TGPLAN2026",
        "display_name": "State Planner – Telangana",
        "headquarters": "Hyderabad",
    },
    "sp.tr": {
        "role": "state_planner",
        "state": "Tripura",
        "state_code": "TR",
        "username": "sp.tr",
        "password": "SP@TRPLAN2026",
        "display_name": "State Planner – Tripura",
        "headquarters": "Agartala",
    },
    "sp.up": {
        "role": "state_planner",
        "state": "Uttar Pradesh",
        "state_code": "UP",
        "username": "sp.up",
        "password": "SP@UPPLAN2026",
        "display_name": "State Planner – Uttar Pradesh",
        "headquarters": "Lucknow",
    },
    "sp.uk": {
        "role": "state_planner",
        "state": "Uttarakhand",
        "state_code": "UK",
        "username": "sp.uk",
        "password": "SP@UKPLAN2026",
        "display_name": "State Planner – Uttarakhand",
        "headquarters": "Dehradun",
    },
    "sp.wb": {
        "role": "state_planner",
        "state": "West Bengal",
        "state_code": "WB",
        "username": "sp.wb",
        "password": "SP@WBPLAN2026",
        "display_name": "State Planner – West Bengal",
        "headquarters": "Kolkata",
    },

    # ── 8 UNION TERRITORIES ──────────────────────────────────────────────────

    "sp.an": {
        "role": "state_planner",
        "state": "Andaman and Nicobar Islands",
        "state_code": "AN",
        "username": "sp.an",
        "password": "SP@ANPLAN2026",
        "display_name": "UT Planner – Andaman & Nicobar Islands",
        "headquarters": "Port Blair",
    },
    "sp.ch": {
        "role": "state_planner",
        "state": "Chandigarh",
        "state_code": "CH",
        "username": "sp.ch",
        "password": "SP@CHPLAN2026",
        "display_name": "UT Planner – Chandigarh",
        "headquarters": "Chandigarh",
    },
    "sp.dn": {
        "role": "state_planner",
        "state": "Dadra & Nagar Haveli and Daman & Diu",
        "state_code": "DN",
        "username": "sp.dn",
        "password": "SP@DNPLAN2026",
        "display_name": "UT Planner – Dadra & Nagar Haveli and Daman & Diu",
        "headquarters": "Daman",
    },
    "sp.dl": {
        "role": "state_planner",
        "state": "Delhi",
        "state_code": "DL",
        "username": "sp.dl",
        "password": "SP@DLPLAN2026",
        "display_name": "UT Planner – Delhi (NCT)",
        "headquarters": "New Delhi",
    },
    "sp.jk": {
        "role": "state_planner",
        "state": "Jammu & Kashmir",
        "state_code": "JK",
        "username": "sp.jk",
        "password": "SP@JKPLAN2026",
        "display_name": "UT Planner – Jammu & Kashmir",
        "headquarters": "Srinagar / Jammu",
    },
    "sp.la": {
        "role": "state_planner",
        "state": "Ladakh",
        "state_code": "LA",
        "username": "sp.la",
        "password": "SP@LAPLAN2026",
        "display_name": "UT Planner – Ladakh",
        "headquarters": "Leh",
    },
    "sp.ld": {
        "role": "state_planner",
        "state": "Lakshadweep",
        "state_code": "LD",
        "username": "sp.ld",
        "password": "SP@LDPLAN2026",
        "display_name": "UT Planner – Lakshadweep",
        "headquarters": "Kavaratti",
    },
    "sp.py": {
        "role": "state_planner",
        "state": "Puducherry",
        "state_code": "PY",
        "username": "sp.py",
        "password": "SP@PYPLAN2026",
        "display_name": "UT Planner – Puducherry",
        "headquarters": "Puducherry",
    },
}


# ---------------------------------------------------------------------------
# DISTRICT COLLECTOR CREDENTIALS
# All 28 States + 8 UTs of India with their districts
# Format: username -> {role, state, state_code, district, password, display_name}
# Username pattern: dc.<district_slug>.<state_code>
# Password pattern: DC@<StateCode><DISTRICTCODE>2026
# ---------------------------------------------------------------------------

DISTRICT_COLLECTOR_CREDENTIALS = {}

def _reg(state, state_code, districts):
    """Helper to bulk-register district collectors for a state."""
    for district in districts:
        slug = (district.lower()
                .replace(" ", "_").replace("-", "_")
                .replace("&", "and").replace("'", "")
                .replace("(", "").replace(")", "")
                .replace("/", "_"))
        dist_code = district.upper().replace(" ", "").replace("-", "")[:6]
        username = f"dc.{slug}.{state_code.lower()}"
        DISTRICT_COLLECTOR_CREDENTIALS[username] = {
            "role": "district_collector",
            "state": state,
            "state_code": state_code,
            "district": district,
            "username": username,
            "password": f"DC@{state_code}{dist_code}2026",
            "display_name": f"District Collector – {district}, {state}",
            "jurisdiction": f"{district} District, {state}",
        }

# ══════════════════════════════════════════════════════════════════════════════
# ANDHRA PRADESH  (25 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Andhra Pradesh", "AP", [
    "Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya",
    "Bapatla", "Chittoor", "East Godavari", "Eluru", "Guntur",
    "Kakinada", "Krishna", "Kurnool", "Nandyal", "NTR", "Palnadu",
    "Parvathipuram Manyam", "Prakasam", "Sri Potti Sriramulu Nellore",
    "Srikakulam", "Sri Sathya Sai", "Tirupati", "Visakhapatnam",
    "Vizianagaram", "West Godavari", "YSR Kadapa",
])

# ══════════════════════════════════════════════════════════════════════════════
# ARUNACHAL PRADESH  (26 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Arunachal Pradesh", "AR", [
    "Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang",
    "Itanagar Capital Complex", "Kamle", "Kra Daadi", "Kurung Kumey",
    "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley",
    "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang",
    "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap",
    "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang",
])

# ══════════════════════════════════════════════════════════════════════════════
# ASSAM  (35 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Assam", "AS", [
    "Bajali", "Baksa", "Barpeta", "Biswanath", "Bongaigaon",
    "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji",
    "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat",
    "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan",
    "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli",
    "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur",
    "South Salmara-Mankachar", "Tamulpur", "Tinsukia", "Udalguri",
    "West Karbi Anglong",
])

# ══════════════════════════════════════════════════════════════════════════════
# BIHAR  (38 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Bihar", "BR", [
    "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur",
    "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya",
    "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria",
    "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger",
    "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas",
    "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar",
    "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran",
])

# ══════════════════════════════════════════════════════════════════════════════
# CHHATTISGARH  (33 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Chhattisgarh", "CG", [
    "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara",
    "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg",
    "Gariaband", "Gaurela Pendra Marwahi", "Janjgir Champa", "Jashpur",
    "Kabirdham", "Kanker", "Khairagarh Chhui Khadan Gandai", "Kondagaon",
    "Korba", "Koriya", "Mahasamund", "Manendragarh Chirmiri Bharatpur",
    "Mohla Manpur Ambagarh Chowki", "Mungeli", "Narayanpur", "Raigarh",
    "Raipur", "Rajnandgaon", "Sarangarh Bilaigarh", "Shakti",
    "Sukma", "Surajpur", "Surguja",
])

# ══════════════════════════════════════════════════════════════════════════════
# GOA  (2 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Goa", "GA", [
    "North Goa", "South Goa",
])

# ══════════════════════════════════════════════════════════════════════════════
# GUJARAT  (33 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Gujarat", "GJ", [
    "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha",
    "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod",
    "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath",
    "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar",
    "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal",
    "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat",
    "Surendranagar", "Tapi", "Vadodara", "Valsad",
])

# ══════════════════════════════════════════════════════════════════════════════
# HARYANA  (22 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Haryana", "HR", [
    "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad",
    "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal",
    "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula",
    "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar",
])

# ══════════════════════════════════════════════════════════════════════════════
# HIMACHAL PRADESH  (12 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Himachal Pradesh", "HP", [
    "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur",
    "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur",
    "Solan", "Una",
])

# ══════════════════════════════════════════════════════════════════════════════
# JHARKHAND  (24 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Jharkhand", "JH", [
    "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka",
    "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla",
    "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar",
    "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi",
    "Sahebganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum",
])

# ══════════════════════════════════════════════════════════════════════════════
# KARNATAKA  (31 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Karnataka", "KA", [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban",
    "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru",
    "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad",
    "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar",
    "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara",
    "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada",
    "Vijayanagara", "Vijayapura", "Yadgir",
])

# ══════════════════════════════════════════════════════════════════════════════
# KERALA  (14 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Kerala", "KL", [
    "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod",
    "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
    "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad",
])

# ══════════════════════════════════════════════════════════════════════════════
# MADHYA PRADESH  (56 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Madhya Pradesh", "MP", [
    "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat",
    "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur",
    "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori",
    "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur",
    "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur",
    "Maihar", "Mauganj", "Morena", "Nagda", "Narsinghpur", "Neemuch",
    "Niwari", "Pandhurna", "Panna", "Raisen", "Rajgarh", "Ratlam",
    "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol",
    "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli",
    "Tikamgarh", "Ujjain", "Umaria", "Vidisha",
])

# ══════════════════════════════════════════════════════════════════════════════
# MAHARASHTRA  (36 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Maharashtra", "MH", [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed",
    "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli",
    "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur",
    "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded",
    "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani",
    "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
    "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal",
])

# ══════════════════════════════════════════════════════════════════════════════
# MANIPUR  (16 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Manipur", "MN", [
    "Bishnupur", "Chandel", "Churachandpur", "Imphal East",
    "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi",
    "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal",
    "Thoubal", "Ukhrul",
])

# ══════════════════════════════════════════════════════════════════════════════
# MEGHALAYA  (12 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Meghalaya", "ML", [
    "East Garo Hills", "East Jaintia Hills", "East Khasi Hills",
    "Eastern West Khasi Hills", "North Garo Hills", "Ri Bhoi",
    "South Garo Hills", "South West Garo Hills", "South West Khasi Hills",
    "West Garo Hills", "West Jaintia Hills", "West Khasi Hills",
])

# ══════════════════════════════════════════════════════════════════════════════
# MIZORAM  (11 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Mizoram", "MZ", [
    "Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib",
    "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip",
])

# ══════════════════════════════════════════════════════════════════════════════
# NAGALAND  (16 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Nagaland", "NL", [
    "Chumoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng",
    "Mokokchung", "Mon", "Niuland", "Noklak", "Peren",
    "Phek", "Shamator", "Tseminyu", "Tuensang", "Wokha", "Zunheboto",
])

# ══════════════════════════════════════════════════════════════════════════════
# ODISHA  (30 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Odisha", "OR", [
    "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak",
    "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati",
    "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi",
    "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput",
    "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada",
    "Puri", "Rayagada", "Sambalpur", "Sonepur", "Sundargarh",
])

# ══════════════════════════════════════════════════════════════════════════════
# PUNJAB  (23 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Punjab", "PB", [
    "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib",
    "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar",
    "Kapurthala", "Ludhiana", "Mansa", "Moga", "Mohali",
    "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sangrur",
    "Shaheed Bhagat Singh Nagar", "Tarn Taran", "Malerkotla",
])

# ══════════════════════════════════════════════════════════════════════════════
# RAJASTHAN  (50 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Rajasthan", "RJ", [
    "Ajmer", "Alwar", "Anupgarh", "Balotra", "Banswara",
    "Baran", "Barmer", "Beawar", "Bharatpur", "Bhilwara",
    "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa",
    "Deeg", "Dholpur", "Didwana Kuchaman", "Dudu", "Dungarpur",
    "Gangapur City", "Hanumangarh", "Jaipur", "Jaipur Rural",
    "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur",
    "Jodhpur Rural", "Karauli", "Kekri", "Kota", "Kotputli Behror",
    "Nagaur", "Neem Ka Thana", "Pali", "Pratapgarh", "Rajsamand",
    "Salumbar", "Sanchore", "Sawai Madhopur", "Shahpura", "Sikar",
    "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur",
    "Bundi", "Churu",
])

# ══════════════════════════════════════════════════════════════════════════════
# SIKKIM  (6 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Sikkim", "SK", [
    "East Sikkim", "North Sikkim", "Pakyong", "Soreng",
    "South Sikkim", "West Sikkim",
])

# ══════════════════════════════════════════════════════════════════════════════
# TAMIL NADU  (38 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Tamil Nadu", "TN", [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
    "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram",
    "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
    "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi",
    "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli",
    "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai",
    "Tiruvarur", "Vellore", "Villupuram", "Virudhunagar",
])

# ══════════════════════════════════════════════════════════════════════════════
# TELANGANA  (33 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Telangana", "TG", [
    "Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad",
    "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal",
    "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem Asifabad",
    "Mahabubabad", "Mahbubnagar", "Mancherial", "Medak", "Medchal Malkajgiri",
    "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal",
    "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy",
    "Sangareddy", "Siddipet", "Suryapet", "Vikarabad",
    "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri",
])

# ══════════════════════════════════════════════════════════════════════════════
# TRIPURA  (8 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Tripura", "TR", [
    "Dhalai", "Gomati", "Khowai", "North Tripura",
    "Sipahijala", "South Tripura", "Unakoti", "West Tripura",
])

# ══════════════════════════════════════════════════════════════════════════════
# UTTAR PRADESH  (75 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Uttar Pradesh", "UP", [
    "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha",
    "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich",
    "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly",
    "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr",
    "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah",
    "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar",
    "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur",
    "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur",
    "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj",
    "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur",
    "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura",
    "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar",
    "Pilibhit", "Pratapgarh", "Prayagraj", "Rae Bareli", "Rampur",
    "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur",
    "Shamli", "Shrawasti", "Siddharthnagar", "Sitapur", "Sonbhadra",
    "Sultanpur", "Unnao", "Varanasi",
])

# ══════════════════════════════════════════════════════════════════════════════
# UTTARAKHAND  (13 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("Uttarakhand", "UK", [
    "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun",
    "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh",
    "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi",
])

# ══════════════════════════════════════════════════════════════════════════════
# WEST BENGAL  (23 districts)
# ══════════════════════════════════════════════════════════════════════════════
_reg("West Bengal", "WB", [
    "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur",
    "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram",
    "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia",
    "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur",
    "Purba Bardhaman", "Purba Medinipur", "Purulia",
    "South 24 Parganas", "Uttar Dinajpur",
])

# ══════════════════════════════════════════════════════════════════════════════
# UNION TERRITORIES
# ══════════════════════════════════════════════════════════════════════════════

# Andaman & Nicobar Islands (3 districts)
_reg("Andaman and Nicobar Islands", "AN", [
    "Nicobar", "North and Middle Andaman", "South Andaman",
])

# Chandigarh (1 district)
_reg("Chandigarh", "CH", [
    "Chandigarh",
])

# Dadra & Nagar Haveli and Daman & Diu (3 districts)
_reg("Dadra & Nagar Haveli and Daman & Diu", "DN", [
    "Dadra and Nagar Haveli", "Daman", "Diu",
])

# Delhi NCT (11 districts)
_reg("Delhi", "DL", [
    "Central Delhi", "East Delhi", "New Delhi", "North Delhi",
    "North East Delhi", "North West Delhi", "Shahdara",
    "South Delhi", "South East Delhi", "South West Delhi", "West Delhi",
])

# Jammu & Kashmir (20 districts)
_reg("Jammu & Kashmir", "JK", [
    "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda",
    "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam",
    "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban",
    "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur",
])

# Ladakh (2 districts)
_reg("Ladakh", "LA", [
    "Kargil", "Leh",
])

# Lakshadweep (1 district)
_reg("Lakshadweep", "LD", [
    "Lakshadweep",
])

# Puducherry (4 districts)
_reg("Puducherry", "PY", [
    "Karaikal", "Mahe", "Puducherry", "Yanam",
])


# ---------------------------------------------------------------------------
# COMBINED LOOKUP  (used by auth endpoint)
# ---------------------------------------------------------------------------

# National Policymaker account (single, national-level office — not tied to
# any specific State/District). Requires a password like every other role.
POLICYMAKER_CREDENTIALS = {
    "policymaker.national": {
        "username": "policymaker.national",
        "password": "PM@NATIONAL2026",
        "role": "policymaker",
        "display_name": "Policymaker — National Decision Support",
        "state": "All India",
        "state_code": "IN",
        "headquarters": "New Delhi",
    }
}

ALL_CREDENTIALS = {}
ALL_CREDENTIALS.update(POLICYMAKER_CREDENTIALS)
ALL_CREDENTIALS.update(STATE_PLANNER_CREDENTIALS)
ALL_CREDENTIALS.update(DISTRICT_COLLECTOR_CREDENTIALS)

# UT State Codes for distinction
UT_CODES = {"AN", "CH", "DN", "DL", "JK", "LA", "LD", "PY"}

# Union Territories that have their own elected Legislative Assembly / CM
# (Delhi, Jammu & Kashmir, Puducherry). These behave like States for planning
# purposes, so a State Planner role is meaningful for them.
# All OTHER Union Territories are administered directly by the Centre via an
# Administrator/Lieutenant Governor and have no separate "state government" —
# so for those, only the Policymaker (National) and District Collector roles
# apply; the State Planner role is not applicable.
LEGISLATURE_UT_CODES = {"DL", "JK", "PY"}
STATE_PLANNER_RESTRICTED_UT_CODES = UT_CODES - LEGISLATURE_UT_CODES  # {AN, CH, DN, LA, LD}


def is_state_planner_allowed(state_code: str) -> bool:
    """True unless this is a centrally-administered UT with no State Planner role."""
    return (state_code or "").strip().upper() not in STATE_PLANNER_RESTRICTED_UT_CODES


def authenticate(username: str, password: str):
    """
    Validates credentials and returns the safe user record on success, else None.
    Case-insensitive username lookup.
    State Planner accounts are rejected for centrally-administered UTs (see
    STATE_PLANNER_RESTRICTED_UT_CODES) — those jurisdictions have no state
    government/legislature, so only Policymaker and District Collector apply.
    """
    user = ALL_CREDENTIALS.get(username.strip().lower())
    if user and user["password"] == password.strip():
        if user.get("role") == "state_planner" and not is_state_planner_allowed(user.get("state_code")):
            return None
        safe_user = {k: v for k, v in user.items() if k != "password"}
        return safe_user
    return None


def get_credentials_by_state(state: str):
    """Return all credentials (collectors + planner) for a given state (passwords redacted)."""
    state_lower = state.strip().lower()
    return {
        uname: {k: v for k, v in cred.items() if k != "password"}
        for uname, cred in ALL_CREDENTIALS.items()
        if cred.get("state", "").lower() == state_lower
    }


def get_all_state_planners():
    """Return all state planner accounts (passwords redacted)."""
    return {
        uname: {k: v for k, v in cred.items() if k != "password"}
        for uname, cred in STATE_PLANNER_CREDENTIALS.items()
    }


def get_all_district_collectors():
    """Return all district collector accounts (passwords redacted)."""
    return {
        uname: {k: v for k, v in cred.items() if k != "password"}
        for uname, cred in DISTRICT_COLLECTOR_CREDENTIALS.items()
    }


def get_collectors_by_state(state: str):
    """Return district collectors for a specific state (passwords redacted)."""
    state_lower = state.strip().lower()
    return {
        uname: {k: v for k, v in cred.items() if k != "password"}
        for uname, cred in DISTRICT_COLLECTOR_CREDENTIALS.items()
        if cred.get("state", "").lower() == state_lower
    }


def get_states_hierarchy(include_passwords: bool = True):
    """
    Returns an organized list of all 28 States and 8 UTs in India.
    Includes state planner info and list of all district collectors for each state.
    """
    states_dict = {}

    # Initialize from state planners
    for username, sp in sorted(STATE_PLANNER_CREDENTIALS.items(), key=lambda x: x[1]["state"]):
        state_name = sp["state"]
        state_code = sp["state_code"]
        states_dict[state_name] = {
            "state": state_name,
            "state_code": state_code,
            "is_ut": state_code in UT_CODES,
            "state_planner_allowed": is_state_planner_allowed(state_code),
            "planner": {
                "username": sp["username"],
                "display_name": sp["display_name"],
                "headquarters": sp.get("headquarters", ""),
                "password": sp["password"] if include_passwords else "********",
            },
            "districts": [],
            "total_districts": 0,
        }

    # Populate district collectors
    for username, dc in DISTRICT_COLLECTOR_CREDENTIALS.items():
        state_name = dc["state"]
        if state_name in states_dict:
            states_dict[state_name]["districts"].append({
                "district": dc["district"],
                "username": dc["username"],
                "display_name": dc["display_name"],
                "jurisdiction": dc.get("jurisdiction", ""),
                "password": dc["password"] if include_passwords else "********",
            })

    # Sort districts alphabetically within each state and update counts
    results = []
    for state_name, s_data in sorted(states_dict.items(), key=lambda x: (x[1]["is_ut"], x[0])):
        s_data["districts"].sort(key=lambda d: d["district"])
        s_data["total_districts"] = len(s_data["districts"])
        results.append(s_data)

    return results


def lookup_credential(state: str = None, district: str = None, role: str = None):
    """
    Look up specific credentials by State, District, and/or Role.
    Returns matched credential dict with password included for testing/simulation.
    """
    state_clean = (state or "").strip().lower()
    district_clean = (district or "").strip().lower()
    role_clean = (role or "").strip().lower().replace(" ", "_")

    if role_clean in ["policymaker", "national"]:
        # Single national-level account — no State/District needed.
        return POLICYMAKER_CREDENTIALS.get("policymaker.national")

    if role_clean in ["state_planner", "planner"]:
        # Centrally-administered UTs (Andaman & Nicobar, Chandigarh, Dadra &
        # Nagar Haveli and Daman & Diu, Ladakh, Lakshadweep) have no state
        # government, so no State Planner account should ever resolve here.
        for sp in STATE_PLANNER_CREDENTIALS.values():
            if not is_state_planner_allowed(sp["state_code"]):
                continue
            if state_clean and sp["state"].lower() == state_clean:
                return sp
            if state_clean and sp["state_code"].lower() == state_clean:
                return sp
        return None

    if role_clean in ["district_collector", "collector"]:
        for dc in DISTRICT_COLLECTOR_CREDENTIALS.values():
            state_match = (not state_clean) or (dc["state"].lower() == state_clean) or (dc["state_code"].lower() == state_clean)
            dist_match = (not district_clean) or (dc["district"].lower() == district_clean)
            if state_match and dist_match:
                return dc

    # General search
    for cred in ALL_CREDENTIALS.values():
        s_match = (not state_clean) or (cred.get("state", "").lower() == state_clean)
        d_match = (not district_clean) or (cred.get("district", "").lower() == district_clean)
        if s_match and d_match:
            return cred

    return None