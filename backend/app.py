import re
import sys
from pathlib import Path

# Ensure backend directory is in python path regardless of where it is executed from
sys.path.insert(0, str(Path(__file__).resolve().parent))

# Basic RFC-5322-style email validation pattern (good enough for form validation)
EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

# Basic mobile number validation pattern (allows optional +, digits, spaces, hyphens, 10-15 digits total)
PHONE_REGEX = re.compile(r"^[+]?[0-9\s-]{10,15}$")

from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from data import (
    REGIONS,
    TOP_RECOMMENDATION,
    HOTSPOTS,
    PIPELINE_STAGES,
    add_citizen_grievance,
    get_citizen_grievances,
    update_citizen_grievance_status,
    get_state_dashboard_data,
    get_district_dashboard_data,
    CITIZEN_GRIEVANCES,
)
from credentials import (
    authenticate,
    get_all_state_planners,
    get_all_district_collectors,
    get_collectors_by_state,
    get_credentials_by_state,
    get_states_hierarchy,
    lookup_credential,
)
from priority_engine import calculate_priority_score
from grievance_analytics import compute_national_analytics



app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static"
)

# Disable browser caching of static assets (JS/CSS) during development.
# Without this, browsers can keep serving an old cached copy of dashboard.js
# for hours after the file on disk has been updated, making fixes appear
# not to take effect.
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0


@app.after_request
def add_no_cache_headers(response):
    # Apply to EVERY response (not just /static/) — the dashboard HTML itself
    # is now the thing most likely to get stuck in a browser's cache, since
    # the JS is inlined directly into it rather than served as a separate file.
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

# Enable Cross-Origin Resource Sharing (CORS)
# Allows the frontend (running on http://localhost:3000) to fetch data from Flask (http://127.0.0.1:5000)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route("/", methods=["GET"])
@app.route("/dashboard", methods=["GET"])
def dashboard():
    """
    Renders the responsive Bootstrap Web Application Dashboard.
    """
    return render_template("dashboard.html")


@app.route("/api", methods=["GET"])
def api_index():
    """
    Returns REST API index documentation in JSON format.
    """
    return jsonify({
        "service": "JANVISTA AI - Dashboard Backend",
        "status": "online",
        "version": "1.0.0",
        "api_key_required": False,
        "mode": "deterministic_offline_mock",
        "endpoints": [
            "/api/dashboard/overview",
            "/api/dashboard/kpis",
            "/api/dashboard/spotlight",
            "/api/dashboard/hotspots",
            "/api/dashboard/pipeline",
            "/api/calculate-priority",
        ]
    })



@app.route("/api/dashboard/overview", methods=["GET"])
def get_dashboard_overview():
    """
    Main endpoint for the Dashboard view.
    Accepts optional ?state=... to return decision support for the respective state.
    """
    district_param = request.args.get("district", "").strip()
    state_param = request.args.get("state", "").strip()

    if district_param and district_param.lower() not in ["all", "all districts", "national"]:
        district_data = get_district_dashboard_data(district_name=district_param, state_name=state_param)
        return jsonify({
            "success": True,
            "scope": "district",
            "state": district_data["state"],
            "district": district_data["district"],
            "data": district_data
        })

    if state_param and state_param.lower() not in ["all", "all india", "national"]:
        state_data = get_state_dashboard_data(state_param)
        return jsonify({
            "success": True,
            "scope": "state",
            "state": state_data["state"],
            "data": state_data
        })

    # ── National scope: compute metrics live from CITIZEN_GRIEVANCES ─────────
    national = compute_national_analytics(HOTSPOTS)
    total_requests = national["total_citizen_requests"]
    # Fall back to static sum if no real grievances submitted yet
    if total_requests == 0:
        total_requests = sum(h["citizen_requests"] for h in HOTSPOTS)

    live_hotspots = national["hotspots"]
    cluster_count = national["cluster_count"]
    top_hotspot = live_hotspots[0] if live_hotspots else HOTSPOTS[0]

    # Recompute top priority score from the leading hotspot's live gap signal
    top_priority = calculate_priority_score(
        demand=TOP_RECOMMENDATION["priority_breakdown"]["factors"][0]["raw_score"],
        gap=top_hotspot.get("gap_index", HOTSPOTS[0]["gap_index"]),
        vulnerability=86.5,
        accessibility_deficit=88.0,
        urgency=82.0,
        investment_mismatch=74.0,
    )

    kpis = [
        {
            "id": "citizen-requests",
            "title": "Citizen Requests",
            "value": f"{total_requests:,}",
            "subtitle": f"Analyzed across {len(REGIONS)} states",
            "accent": "sky",
        },
        {
            "id": "demand-clusters",
            "title": "Demand Clusters",
            "value": f"{cluster_count} Clusters",
            "subtitle": "Spatial & semantic aggregation",
            "accent": "purple",
        },
        {
            "id": "hotspots-detected",
            "title": "Hotspots Detected",
            "value": f"{len(live_hotspots)} Regions",
            "subtitle": f"{top_hotspot['region_name']} ranked #1",
            "accent": "rose",
        },
        {
            "id": "max-gap-index",
            "title": "Max Gap Index",
            "value": f"{top_hotspot['gap_index']} %",
            "subtitle": f"{top_hotspot['region_name']} {top_hotspot['category']} Deficit",
            "accent": "amber",
        },
        {
            "id": "top-priority-score",
            "title": "Top Priority Score",
            "value": f"{top_priority['score']} / 100",
            "subtitle": "Model v1.0.0 (Audited)",
            "accent": "emerald",
        },
    ]

    return jsonify({
        "success": True,
        "scope": "national",
        "data": {
            "banner": {
                "title": "WHERE SHOULD WE ACT FIRST?",
                "subtitle": "JANVISTA transforms fragmented multilingual citizen feedback into explainable, evidence-backed public infrastructure priorities.",
                "data_classification": "LOCAL_SYNTHETIC_DATA",
            },
            "kpis": kpis,
            "spotlight": TOP_RECOMMENDATION,
            "hotspots": live_hotspots,
            "pipeline": PIPELINE_STAGES,
        }
    })


@app.route("/api/dashboard/kpis", methods=["GET"])
def get_kpis():
    """
    Returns only the 5 summary KPIs for fast dashboard updates.
    Accepts optional ?district=... or ?state=... for respective jurisdiction.
    """
    district_param = request.args.get("district", "").strip()
    state_param = request.args.get("state", "").strip()

    if district_param and district_param.lower() not in ["all", "all districts", "national"]:
        district_data = get_district_dashboard_data(district_name=district_param, state_name=state_param)
        return jsonify({
            "success": True,
            "scope": "district",
            "district": district_data["district"],
            "data": district_data["kpis"]
        })

    if state_param and state_param.lower() not in ["all", "all india", "national"]:
        state_data = get_state_dashboard_data(state_param)
        return jsonify({
            "success": True,
            "scope": "state",
            "data": state_data["kpis"]
        })

    total_requests = sum(h["citizen_requests"] for h in HOTSPOTS)
    return jsonify({
        "success": True,
        "scope": "national",
        "data": {
            "citizen_requests_total": total_requests,
            "analyzed_states_count": len(REGIONS),
            "demand_clusters_count": len(HOTSPOTS),
            "hotspots_detected_count": len(HOTSPOTS),
            "max_gap_index": HOTSPOTS[0]["gap_index"],
            "top_priority_score": TOP_RECOMMENDATION["priority_score"],
        }
    })


@app.route("/api/dashboard/spotlight", methods=["GET"])
def get_spotlight():
    """
    Returns the #1 Priority Opportunity with the explainability ('Why This?') breakdown.
    Accepts optional ?district=... or ?state=... for respective jurisdiction.
    """
    district_param = request.args.get("district", "").strip()
    state_param = request.args.get("state", "").strip()

    if district_param and district_param.lower() not in ["all", "all districts", "national"]:
        district_data = get_district_dashboard_data(district_name=district_param, state_name=state_param)
        return jsonify({
            "success": True,
            "scope": "district",
            "district": district_data["district"],
            "data": district_data["spotlight"]
        })

    if state_param and state_param.lower() not in ["all", "all india", "national"]:
        state_data = get_state_dashboard_data(state_param)
        return jsonify({
            "success": True,
            "scope": "state",
            "data": state_data["spotlight"]
        })

    return jsonify({
        "success": True,
        "scope": "national",
        "data": TOP_RECOMMENDATION
    })


@app.route("/api/dashboard/hotspots", methods=["GET"])
def get_hotspots():
    """
    Returns the ranked list of priority hotspots.
    Accepts optional ?district=... or ?state=... for respective jurisdiction.
    """
    district_param = request.args.get("district", "").strip()
    state_param = request.args.get("state", "").strip()

    if district_param and district_param.lower() not in ["all", "all districts", "national"]:
        district_data = get_district_dashboard_data(district_name=district_param, state_name=state_param)
        return jsonify({
            "success": True,
            "scope": "district",
            "district": district_data["district"],
            "count": len(district_data["hotspots"]),
            "data": district_data["hotspots"]
        })

    if state_param and state_param.lower() not in ["all", "all india", "national"]:
        state_data = get_state_dashboard_data(state_param)
        return jsonify({
            "success": True,
            "scope": "state",
            "count": len(state_data["hotspots"]),
            "data": state_data["hotspots"]
        })

    return jsonify({
        "success": True,
        "scope": "national",
        "count": len(HOTSPOTS),
        "data": HOTSPOTS
    })



@app.route("/api/dashboard/pipeline", methods=["GET"])
def get_pipeline():
    """
    Returns the 7 stages of the decision intelligence workflow.
    """
    return jsonify({
        "success": True,
        "data": PIPELINE_STAGES
    })


@app.route("/api/calculate-priority", methods=["POST"])
def dynamic_priority_calculation():
    """
    Dynamic endpoint to calculate priority scores based on custom scores or weights.
    Requires NO external APIs.
    """
    body = request.get_json(silent=True) or {}

    demand = float(body.get("demand", 50.0))
    gap = float(body.get("gap", 50.0))
    vulnerability = float(body.get("vulnerability", 50.0))
    accessibility_deficit = float(body.get("accessibility_deficit", 50.0))
    urgency = float(body.get("urgency", 50.0))
    investment_mismatch = float(body.get("investment_mismatch", 50.0))

    result = calculate_priority_score(
        demand=demand,
        gap=gap,
        vulnerability=vulnerability,
        accessibility_deficit=accessibility_deficit,
        urgency=urgency,
        investment_mismatch=investment_mismatch,
    )

    return jsonify({
        "success": True,
        "input": {
            "demand": demand,
            "gap": gap,
            "vulnerability": vulnerability,
            "accessibility_deficit": accessibility_deficit,
            "urgency": urgency,
            "investment_mismatch": investment_mismatch,
        },
        "calculation": result
    })


@app.route("/api/citizen/grievance", methods=["POST"])
def submit_grievance():
    """
    Public Citizen Grievance Submission Endpoint (Role: Citizen).
    Accepts: name, phone, email, state, district, village_or_ward, category, urgency, description.
    All fields are mandatory. Returns: generated tracking_id and created grievance record with
    complete audit trail. Zero external API key required.
    """
    body = request.get_json(silent=True) or request.form or {}

    name = body.get("name", "").strip()
    state = body.get("state", "").strip()
    district = body.get("district", "").strip()
    village_or_ward = body.get("village_or_ward", "").strip()
    category = body.get("category", "").strip()
    description = body.get("description", "").strip()
    phone = body.get("phone", "").strip()
    email = body.get("email", "").strip()
    urgency = body.get("urgency", "").strip()

    if not name:
        return jsonify({"success": False, "error": "Citizen Full Name is required."}), 400
    if not phone:
        return jsonify({"success": False, "error": "Mobile Number is required."}), 400
    if not PHONE_REGEX.match(phone):
        return jsonify({"success": False, "error": "Please enter a valid Mobile Number."}), 400
    if not email:
        return jsonify({"success": False, "error": "Email Address is required."}), 400
    if not EMAIL_REGEX.match(email):
        return jsonify({"success": False, "error": "Please enter a valid Email Address."}), 400
    if not state:
        return jsonify({"success": False, "error": "State / UT is required."}), 400
    if not district:
        return jsonify({"success": False, "error": "District is required."}), 400
    if not village_or_ward:
        return jsonify({"success": False, "error": "Village / Ward / Tehsil is required."}), 400
    if not category:
        return jsonify({"success": False, "error": "Infrastructure Category is required."}), 400
    if not urgency:
        return jsonify({"success": False, "error": "Urgency Level is required."}), 400
    if not description:
        return jsonify({"success": False, "error": "Grievance details are required."}), 400

    new_record = add_citizen_grievance(
        name=name,
        state=state,
        district=district,
        category=category,
        description=description,
        phone=phone,
        email=email,
        village_or_ward=village_or_ward,
        urgency=urgency,
    )

    return jsonify({
        "success": True,
        "message": "Grievance submitted successfully into National Decision Intelligence Intake.",
        "tracking_id": new_record["tracking_id"],
        "data": new_record,
    }), 201


@app.route("/api/citizen/grievances", methods=["GET"])
def list_grievances():
    """
    Returns list of citizen grievances.
    PRIVACY PROTECTION: Citizens cannot view grievances of other citizens.
    If role=citizen is provided, only grievances matching the citizen's own tracking_ids are returned.
    District Collectors and Policy Makers can access complete filtered oversight.
    """
    role = (request.args.get("role") or "").strip().lower()
    tracking_ids_param = request.args.get("tracking_ids")

    district = request.args.get("district")
    state = request.args.get("state")
    category = request.args.get("category")
    urgency = request.args.get("urgency")
    status = request.args.get("status")

    # Privacy enforcement for Citizen Role
    if role == "citizen":
        if not tracking_ids_param:
            return jsonify({
                "success": True,
                "count": 0,
                "privacy_restricted": True,
                "message": "Citizen privacy active: You can only view your own submitted grievances. Use your Tracking ID to track status.",
                "data": [],
            })

        allowed_ids = [t.strip().upper() for t in tracking_ids_param.split(",") if t.strip()]
        all_grievances = get_citizen_grievances()
        user_grievances = [g for g in all_grievances if g.get("tracking_id", "").upper() in allowed_ids]

        return jsonify({
            "success": True,
            "count": len(user_grievances),
            "privacy_restricted": True,
            "message": "Displaying only your submitted grievances.",
            "data": user_grievances,
        })

    # Government Officials (District Collector, Policymaker, State Planner)
    grievances = get_citizen_grievances(
        district=district,
        state=state,
        category=category,
        urgency=urgency,
        status=status,
    )

    return jsonify({
        "success": True,
        "count": len(grievances),
        "privacy_restricted": False,
        "filters_applied": {
            "district": district,
            "state": state,
            "category": category,
            "urgency": urgency,
            "status": status,
        },
        "data": grievances,
    })


@app.route("/api/citizen/grievance/<tracking_id>", methods=["GET"])
def get_grievance_detail(tracking_id):
    """
    Complete Citizen Grievance Inspection Endpoint.
    Returns complete grievance details including full narrative, citizen profile,
    assigned department, official remarks history, and status.
    Used by District Collectors and Policymakers.
    """
    tracking_id_clean = tracking_id.strip().upper()
    grievances = get_citizen_grievances()
    record = next((g for g in grievances if g["tracking_id"].upper() == tracking_id_clean), None)

    if not record:
        return jsonify({
            "success": False,
            "error": f"No grievance found with Tracking ID: {tracking_id}"
        }), 404

    return jsonify({
        "success": True,
        "data": record,
    })


@app.route("/api/citizen/grievance/<tracking_id>/status", methods=["POST", "PATCH"])
def update_grievance_status_endpoint(tracking_id):
    """
    Official Administrative Action Endpoint.
    Allows District Collectors and Policymakers to update grievance status
    and log official administrative remarks.
    """
    body = request.get_json(silent=True) or request.form or {}
    new_status = body.get("status", "").strip()
    remark = body.get("remark", "").strip()
    officer = body.get("officer", "District Collector").strip()

    if not new_status:
        return jsonify({"success": False, "error": "New status is required."}), 400

    updated_record = update_citizen_grievance_status(
        tracking_id=tracking_id,
        new_status=new_status,
        remark=remark,
        officer=officer,
    )

    if not updated_record:
        return jsonify({
            "success": False,
            "error": f"Grievance with Tracking ID '{tracking_id}' not found."
        }), 404

    return jsonify({
        "success": True,
        "message": f"Status updated to '{new_status}' successfully by {officer}.",
        "data": updated_record,
    })


@app.route("/api/citizen/track/<tracking_id>", methods=["GET"])
def track_grievance(tracking_id):
    """
    Citizen Tracking ID Status Lookup.
    """
    tracking_id = tracking_id.strip().upper()
    grievances = get_citizen_grievances()
    record = next((g for g in grievances if g["tracking_id"].upper() == tracking_id), None)

    if not record:
        return jsonify({
            "success": False,
            "error": f"No grievance found with Tracking ID: {tracking_id}"
        }), 404

    return jsonify({
        "success": True,
        "data": record,
    })


# ---------------------------------------------------------------------------
# AUTH ENDPOINTS
# ---------------------------------------------------------------------------

@app.route("/api/auth/login", methods=["POST"])
def login():
    """
    Official Login Endpoint for District Collectors and State Planners.
    Accepts:
      - Option A: {"username": "...", "password": "..."}
      - Option B: {"state": "...", "district": "...", "role": "..."} (Direct Governance Selector)
    Returns: user profile (role, state, district, display_name) without plain password in production.
    """
    body = request.get_json(silent=True) or request.form or {}
    username = body.get("username", "").strip()
    password = body.get("password", "").strip()
    state = body.get("state", "").strip()
    district = body.get("district", "").strip()
    role = body.get("role", "").strip()

    # If state + role or district is provided directly (interactive picker),
    # resolve the corresponding username — but the password must still be
    # supplied by the officer and is verified normally below (never auto-filled).
    # Policymaker is a single national-level account with no State/District,
    # so it's resolved from `role` alone.
    if not username and (state or district or role):
        role_clean = role.strip().lower().replace(" ", "_")
        if role_clean in ("state_planner", "planner"):
            state_info = next((s for s in get_states_hierarchy(include_passwords=False) if s["state"].lower() == state.lower() or s["state_code"].lower() == state.lower()), None)
            if state_info and not state_info["state_planner_allowed"]:
                return jsonify({
                    "success": False,
                    "error": f"{state_info['state']} is a centrally-administered Union Territory with no State "
                             f"Government — the State Planner role is not applicable here. Please choose "
                             f"District Collector, or select Delhi, Jammu & Kashmir or Puducherry for State Planner."
                }), 403

        cred = lookup_credential(state=state, district=district, role=role)
        if not cred:
            return jsonify({
                "success": False,
                "error": f"No officer credentials found for State: '{state}', District: '{district}', Role: '{role}'."
            }), 404
        username = cred["username"]

    if not username:
        return jsonify({"success": False, "error": "State and District or Official Username is required."}), 400

    if not password:
        return jsonify({"success": False, "error": "Official password / access key is required."}), 400

    user = authenticate(username, password)
    if not user:
        return jsonify({"success": False, "error": "Invalid official credentials. Check username or password."}), 401

    return jsonify({
        "success": True,
        "message": f"Welcome, {user['display_name']}!",
        "user": user,
    })


@app.route("/api/auth/hierarchy", methods=["GET"])
def get_auth_hierarchy():
    """
    Returns complete hierarchical directory of all 28 States and 8 Union Territories of India.
    Includes State Planners and District Collectors.
    Ideal for dynamic state/district selector and full national credentials directory.
    """
    include_passwords = request.args.get("include_passwords", "1").lower() in ["1", "true", "yes"]
    hierarchy = get_states_hierarchy(include_passwords=include_passwords)
    total_districts = sum(s["total_districts"] for s in hierarchy)
    return jsonify({
        "success": True,
        "total_states_and_uts": len(hierarchy),
        "total_state_planners": len(hierarchy),
        "total_district_collectors": total_districts,
        "data": hierarchy,
    })


@app.route("/api/auth/lookup", methods=["GET"])
def auth_lookup():
    """
    Looks up credentials for a specific State, District, and/or Role.
    Returns matched credential with username and password.
    """
    state = request.args.get("state", "").strip()
    district = request.args.get("district", "").strip()
    role = request.args.get("role", "").strip()

    cred = lookup_credential(state=state, district=district, role=role)
    if not cred:
        return jsonify({"success": False, "error": "No matching officer found."}), 404

    return jsonify({
        "success": True,
        "data": cred,
    })


@app.route("/api/auth/credentials/state-planners", methods=["GET"])
def list_state_planners():
    """
    Lists all State Planner accounts across all 28 States + 8 UTs.
    Passwords are redacted from the response.
    """
    planners = get_all_state_planners()
    return jsonify({
        "success": True,
        "count": len(planners),
        "data": list(planners.values()),
    })


@app.route("/api/auth/credentials/collectors", methods=["GET"])
def list_all_collectors():
    """
    Lists all District Collector accounts across India.
    Optional ?state=<state_name> filter supported.
    Passwords are redacted from the response.
    """
    state_filter = request.args.get("state", "").strip()
    if state_filter:
        collectors = get_collectors_by_state(state_filter)
    else:
        collectors = get_all_district_collectors()

    return jsonify({
        "success": True,
        "count": len(collectors),
        "filter": state_filter or "All India",
        "data": list(collectors.values()),
    })


@app.route("/api/auth/credentials/state/<path:state_name>", methods=["GET"])
def credentials_by_state(state_name):
    """
    Returns all credentials (State Planner + all District Collectors)
    for the specified state or UT.
    Passwords are redacted from the response.
    """
    result = get_credentials_by_state(state_name)
    if not result:
        return jsonify({
            "success": False,
            "error": f"No credentials found for state: {state_name}"
        }), 404

    return jsonify({
        "success": True,
        "state": state_name,
        "count": len(result),
        "data": list(result.values()),
    })


if __name__ == "__main__":

    print("=" * 60)
    print("JANVISTA AI Flask Backend Starting (Zero API Key Mode)")
    print("Available at: http://127.0.0.1:5000")
    print("Dashboard Overview: http://127.0.0.1:5000/api/dashboard/overview")
    print("=" * 60)
    app.run(host="127.0.0.1", port=5000, debug=True)