import datetime
import os
import re
import sys
from pathlib import Path

# Ensure backend directory is in python path regardless of where it is executed from
sys.path.insert(0, str(Path(__file__).resolve().parent))

# Basic RFC-5322-style email validation pattern (good enough for form validation)
EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

# Basic mobile number validation pattern (allows optional +, digits, spaces, hyphens, 10-15 digits total)
PHONE_REGEX = re.compile(r"^[+]?[0-9\s-]{10,15}$")

from flask import Flask, jsonify, request, render_template, Response
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
    reprocess_unvalidated_grievances,
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
from export_service import get_brief_data, generate_brief_csv, generate_brief_pdf
from gemini_service import analyse_grievance
from google_maps_service import healthcare_accessibility
from ndap_service import get_district_context, integration_status as ndap_integration_status



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
        "mode": "live_citizen_data",
        "endpoints": [
            "/api/dashboard/overview",
            "/api/dashboard/kpis",
            "/api/dashboard/spotlight",
            "/api/dashboard/hotspots",
            "/api/dashboard/pipeline",
            "/api/calculate-priority",
            "/api/export/csv",
            "/api/export/pdf",
        ]
    })


@app.route("/api/integrations/status", methods=["GET"])
def integration_status():
    """Safe configuration check: reports no keys or key material."""
    return jsonify({
        "success": True,
        "gemini_configured": bool(os.getenv("GEMINI_API_KEY", "").strip()),
        "google_maps_configured": bool((os.getenv("GOOGLE_MAPS_API_KEY") or os.getenv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY") or "").strip()),
        "ndap": ndap_integration_status(),
        "required_google_maps_apis": ["Places API (New)", "Routes API", "Geocoding API"],
    })


@app.route("/api/ndap/district-context", methods=["GET"])
def ndap_district_context():
    """Return labelled, source-backed NDAP measures for a selected district."""
    state, district = request.args.get("state", "").strip(), request.args.get("district", "").strip()
    if not state or not district:
        return jsonify({"success": False, "error": "state and district are required."}), 400
    return jsonify({"success": True, "state": state, "district": district, "sources": get_district_context(state, district)})



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
    live_hotspots = national["hotspots"]
    cluster_count = national["cluster_count"]

    if not live_hotspots:
        # No citizen grievances submitted yet — return an empty honest state
        return jsonify({
            "success": True,
            "scope": "national",
            "data": {
                "banner": {
                    "title": "WHERE SHOULD WE ACT FIRST?",
                    "subtitle": "JANVISTA transforms fragmented multilingual citizen feedback into explainable, evidence-backed public infrastructure priorities.",
                    "data_classification": "LIVE_CITIZEN_DATA",
                },
                "kpis": [
                    {"id": "citizen-requests", "title": "Citizen Requests", "value": f"{total_requests:,}", "subtitle": "Live submissions awaiting sufficient evidence", "accent": "sky"},
                    {"id": "demand-clusters", "title": "Demand Clusters", "value": "0 ranked clusters", "subtitle": "Need 3 Gemini-validated signals per district", "accent": "purple"},
                    {"id": "hotspots-detected", "title": "Hotspots Detected", "value": "0 Regions", "subtitle": "No evidence-qualified hotspots", "accent": "rose"},
                    {"id": "max-gap-index", "title": "Gap Index", "value": "N/A", "subtitle": "Insufficient evidence for a gap calculation", "accent": "amber"},
                    {"id": "top-priority-score", "title": "Top Priority Score", "value": "N/A", "subtitle": "Ranking begins after evidence threshold", "accent": "emerald"},
                ],
                "spotlight": None,
                "hotspots": [],
                "pipeline": PIPELINE_STAGES,
            }
        })

    top_hotspot = live_hotspots[0]

    # Recompute top priority score from the leading hotspot
    top_priority = calculate_priority_score(
        demand=top_hotspot.get("raw_factors", {}).get("demand"),
        gap=top_hotspot.get("gap_index"),
        vulnerability=top_hotspot.get("raw_factors", {}).get("vulnerability"),
        accessibility_deficit=top_hotspot.get("raw_factors", {}).get("accessibility_deficit"),
        urgency=top_hotspot.get("raw_factors", {}).get("urgency"),
        investment_mismatch=top_hotspot.get("raw_factors", {}).get("investment_mismatch"),
        custom_sources={
            "gap": "Citizen tier + Gemini severity (or marked deterministic fallback)",
            "vulnerability": "Pending district vulnerability dataset",
            "accessibility_deficit": "Pending validated travel-time dataset",
            "urgency": "Citizen tier + Gemini immediacy (or marked deterministic fallback)",
            "investment_mismatch": "Pending national capex ledger",
        },
    )

    kpis = [
        {
            "id": "citizen-requests",
            "title": "Citizen Requests",
            "value": f"{total_requests:,}",
            "subtitle": f"Live grievances across {len(live_hotspots)} district(s)",
            "accent": "sky",
        },
        {
            "id": "demand-clusters",
            "title": "Demand Clusters",
            "value": f"{cluster_count} Cluster{'s' if cluster_count != 1 else ''}",
            "subtitle": "Spatial & semantic aggregation",
            "accent": "purple",
        },
        {
            "id": "hotspots-detected",
            "title": "Hotspots Detected",
            "value": f"{len(live_hotspots)} Region{'s' if len(live_hotspots) != 1 else ''}",
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

    # Build a spotlight from the top live hotspot
    from data import CITIZEN_GRIEVANCES as CG
    top_ug = top_hotspot.get("citizen_grievance") or (CG[0] if CG else {})
    live_spotlight = {
        "id": f"rec-{top_hotspot['district'].lower().replace(' ', '_')[:8]}-nat-01",
        "region_id": top_hotspot["region_id"],
        "region_name": top_hotspot["region_name"],
        "district": top_hotspot["district"],
        "state": top_hotspot["state"],
        "area": top_hotspot.get("area", top_hotspot["district"]),
        "village": top_hotspot.get("village", top_hotspot["district"]),
        "tracking_id": top_hotspot.get("tracking_id"),
        "citizen_name": top_hotspot.get("citizen_name"),
        "citizen_grievance": top_hotspot.get("citizen_grievance"),
        "category": top_hotspot["category"],
        "title": top_hotspot["title"],
        "description": top_hotspot["description"],
        "estimated_cost_cr": top_hotspot["estimated_cost_cr"],
        "impacted_population": top_hotspot["impacted_population"],
        "urgency_tier": top_hotspot["status"],
        "status": "PROPOSED",
        "priority_score": top_priority["score"],
        "priority_breakdown": top_priority,
        "raw_factors": top_hotspot.get("raw_factors", {}),
        "key_metrics": {
            "existing_chc_beds": 0,
            "required_beds": 0,
            "average_transit_time_mins": top_hotspot.get("current_transit_mins", 75),
            "target_transit_time_mins": top_hotspot.get("target_transit_mins", 25),
        },
        "evidence_chain": {
            "state": top_hotspot["state"],
            "district": top_hotspot["district"],
            "area": top_hotspot.get("area", top_hotspot["district"]),
            "village": top_hotspot.get("village"),
            "citizen_name": top_hotspot.get("citizen_name"),
            "demand_records_count": total_requests,
            "real_grievance_count": total_requests,
            "citizen_quote_local": (top_ug.get("description") or ""),
            "citizen_quote_en": (top_ug.get("description") or ""),
            "facility_audit_title": "Facility dataset status",
            "facility_audit_finding": (
                f"No validated facility dataset is loaded for {top_hotspot['district']} yet. "
                f"{total_requests} citizen grievance(s) are the available demand evidence."
            ),
            "spatial_transit_title": "Travel-time dataset status",
            "spatial_transit_finding": (
                "Pending validated facility-routing baseline. Transit is displayed only for healthcare "
                "recommendations after this dataset is loaded."
            ),
            "official_endorsement": (
                f"National Planning Commission: Prioritized for in-principle administrative sanction "
                f"grounded in {total_requests} live citizen demand signals."
            ),
        },
    }

    return jsonify({
        "success": True,
        "scope": "national",
        "data": {
            "banner": {
                "title": "WHERE SHOULD WE ACT FIRST?",
                "subtitle": "JANVISTA transforms fragmented multilingual citizen feedback into explainable, evidence-backed public infrastructure priorities.",
                "data_classification": "LIVE_CITIZEN_DATA",
            },
            "kpis": kpis,
            "spotlight": live_spotlight,
            "hotspots": live_hotspots,
            "pipeline": PIPELINE_STAGES,
        }
    })


@app.route("/api/export/csv", methods=["GET", "POST"])
def export_brief_csv():
    """
    Exports a structured CSV ledger brief tailored to the requested governance role
    ('District Collector', 'State Planner', or 'Policymaker') and jurisdiction.
    """
    params = request.get_json(silent=True) or {}
    role = request.args.get("role") or params.get("role") or "Policymaker"
    state = request.args.get("state") or params.get("state")
    district = request.args.get("district") or params.get("district")
    officer = request.args.get("officer") or params.get("officer")

    brief_info = get_brief_data(role=role, state=state, district=district, officer_name=officer)
    csv_content = generate_brief_csv(brief_info)

    scope = brief_info["scope"]
    target_name = (brief_info["district"] or brief_info["state"] or "national").lower().replace(" ", "_")
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M")
    filename = f"janvista_{scope}_{target_name}_brief_{ts}.csv"

    return Response(
        csv_content,
        mimetype="text/csv; charset=utf-8",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "no-cache, no-store, must-revalidate",
        },
    )


@app.route("/api/export/pdf", methods=["GET", "POST"])
def export_brief_pdf():
    """
    Exports a high-resolution A4 Executive Briefing PDF tailored to the requested governance role
    ('District Collector', 'State Planner', or 'Policymaker') and jurisdiction.
    """
    params = request.get_json(silent=True) or {}
    role = request.args.get("role") or params.get("role") or "Policymaker"
    state = request.args.get("state") or params.get("state")
    district = request.args.get("district") or params.get("district")
    officer = request.args.get("officer") or params.get("officer")

    brief_info = get_brief_data(role=role, state=state, district=district, officer_name=officer)
    pdf_bytes = generate_brief_pdf(brief_info)

    scope = brief_info["scope"]
    target_name = (brief_info["district"] or brief_info["state"] or "national").lower().replace(" ", "_")
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M")
    filename = f"janvista_{scope}_{target_name}_brief_{ts}.pdf"

    return Response(
        pdf_bytes,
        mimetype="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "no-cache, no-store, must-revalidate",
        },
    )



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

    national = compute_national_analytics(HOTSPOTS)
    live_hotspots = national.get("hotspots", [])
    total_requests = national.get("total_citizen_requests", 0)
    top_spotlight = live_hotspots[0] if live_hotspots else None
    states_count = len(set(h["state"] for h in live_hotspots if h.get("state")))

    return jsonify({
        "success": True,
        "scope": "national",
        "data": {
            "citizen_requests_total": total_requests,
            "analyzed_states_count": states_count,
            "demand_clusters_count": national.get("cluster_count", 0),
            "hotspots_detected_count": len(live_hotspots),
            "max_gap_index": top_spotlight["gap_index"] if top_spotlight else 0.0,
            "top_priority_score": top_spotlight["priority_score"] if top_spotlight else 0.0,
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

    national = compute_national_analytics(HOTSPOTS)
    overview_data = get_dashboard_overview().get_json().get("data", {})
    live_spotlight = overview_data.get("spotlight")

    return jsonify({
        "success": True,
        "scope": "national",
        "data": live_spotlight
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

    national = compute_national_analytics(HOTSPOTS)
    live_hotspots = national.get("hotspots", [])
    return jsonify({
        "success": True,
        "scope": "national",
        "count": len(live_hotspots),
        "data": live_hotspots
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


@app.route("/api/citizen/grievances/reprocess-ai", methods=["POST"])
def reprocess_grievance_ai():
    """Explicitly retry Gemini for older fallback records."""
    result = reprocess_unvalidated_grievances()
    return jsonify({"success": True, **result})


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

    ai_analysis = analyse_grievance(description, urgency)
    map_accessibility = (
        healthcare_accessibility(village_or_ward, district, state)
        if category.strip().lower() == "healthcare" else {"status": "NOT_APPLICABLE", "message": "Routes are calculated only for healthcare requests."}
    )
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
        ai_analysis=ai_analysis,
        map_accessibility=map_accessibility,
    )

    return jsonify({
        "success": True,
        "message": "Grievance submitted successfully into National Decision Intelligence Intake.",
        "tracking_id": new_record["tracking_id"],
        "data": new_record,
        "ai_analysis": ai_analysis,
        "map_accessibility": map_accessibility,
    }), 201


@app.route("/api/healthcare/accessibility", methods=["POST"])
def get_healthcare_accessibility():
    """Calculate live Google Places + Routes evidence without storing a grievance."""
    body = request.get_json(silent=True) or {}
    required = ["village_or_ward", "district", "state"]
    if any(not str(body.get(field, "")).strip() for field in required):
        return jsonify({"success": False, "error": "village_or_ward, district and state are required."}), 400
    result = healthcare_accessibility(body["village_or_ward"].strip(), body["district"].strip(), body["state"].strip())
    return jsonify({"success": result.get("status") == "AVAILABLE", "data": result})


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
