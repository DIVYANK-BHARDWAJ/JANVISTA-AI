import sys
from pathlib import Path

# Ensure backend directory is in python path regardless of where it is executed from
sys.path.insert(0, str(Path(__file__).resolve().parent))

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
)
from priority_engine import calculate_priority_score



app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static"
)

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
    Combines KPIs, Top Spotlight Opportunity, Hotspots, and Pipeline.
    """
    total_requests = sum(h["citizen_requests"] for h in HOTSPOTS)

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
            "value": f"{len(HOTSPOTS)} Clusters",
            "subtitle": "Spatial & semantic aggregation",
            "accent": "purple",
        },
        {
            "id": "hotspots-detected",
            "title": "Hotspots Detected",
            "value": f"{len(HOTSPOTS)} Regions",
            "subtitle": f"{HOTSPOTS[0]['region_name']} ranked #1",
            "accent": "rose",
        },
        {
            "id": "max-gap-index",
            "title": "Max Gap Index",
            "value": f"{HOTSPOTS[0]['gap_index']} %",
            "subtitle": f"{HOTSPOTS[0]['region_name']} {HOTSPOTS[0]['category']} Deficit",
            "accent": "amber",
        },
        {
            "id": "top-priority-score",
            "title": "Top Priority Score",
            "value": f"{TOP_RECOMMENDATION['priority_score']} / 100",
            "subtitle": "Model v1.0.0 (Audited)",
            "accent": "emerald",
        },
    ]

    return jsonify({
        "success": True,
        "data": {
            "banner": {
                "title": "WHERE SHOULD WE ACT FIRST?",
                "subtitle": "JANVISTA transforms fragmented multilingual citizen feedback into explainable, evidence-backed public infrastructure priorities.",
                "data_classification": "LOCAL_SYNTHETIC_DATA",
            },
            "kpis": kpis,
            "spotlight": TOP_RECOMMENDATION,
            "hotspots": HOTSPOTS,
            "pipeline": PIPELINE_STAGES,
        }
    })


@app.route("/api/dashboard/kpis", methods=["GET"])
def get_kpis():
    """
    Returns only the 5 summary KPIs for fast dashboard updates.
    """
    total_requests = sum(h["citizen_requests"] for h in HOTSPOTS)
    return jsonify({
        "success": True,
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
    """
    return jsonify({
        "success": True,
        "data": TOP_RECOMMENDATION
    })


@app.route("/api/dashboard/hotspots", methods=["GET"])
def get_hotspots():
    """
    Returns the ranked list of priority hotspots.
    """
    return jsonify({
        "success": True,
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
    Accepts: name, state, district, village_or_ward, category, description, phone, urgency.
    Returns: generated tracking_id and created grievance record with complete audit trail.
    Zero external API key required.
    """
    body = request.get_json(silent=True) or request.form or {}

    name = body.get("name", "").strip()
    state = body.get("state", "").strip()
    district = body.get("district", "").strip()
    village_or_ward = body.get("village_or_ward", "").strip()
    category = body.get("category", "General Infrastructure").strip()
    description = body.get("description", "").strip()
    phone = body.get("phone", "").strip()
    urgency = body.get("urgency", "MODERATE").strip()

    if not name:
        return jsonify({"success": False, "error": "Citizen Name is required."}), 400
    if not state:
        return jsonify({"success": False, "error": "State is required."}), 400
    if not district:
        return jsonify({"success": False, "error": "District is required."}), 400
    if not description:
        return jsonify({"success": False, "error": "Grievance details are required."}), 400

    new_record = add_citizen_grievance(
        name=name,
        state=state,
        district=district,
        category=category,
        description=description,
        phone=phone,
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


if __name__ == "__main__":

    print("=" * 60)
    print("JANVISTA AI Flask Backend Starting (Zero API Key Mode)")
    print("Available at: http://127.0.0.1:5000")
    print("Dashboard Overview: http://127.0.0.1:5000/api/dashboard/overview")
    print("=" * 60)
    app.run(host="127.0.0.1", port=5000, debug=True)
