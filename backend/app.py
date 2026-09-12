import sys
from pathlib import Path

# Ensure backend directory is in python path regardless of where it is executed from
sys.path.insert(0, str(Path(__file__).resolve().parent))

from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from data import REGIONS, TOP_RECOMMENDATION, HOTSPOTS, PIPELINE_STAGES
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


if __name__ == "__main__":
    print("=" * 60)
    print("JANVISTA AI Flask Backend Starting (Zero API Key Mode)")
    print("Available at: http://127.0.0.1:5000")
    print("Dashboard Overview: http://127.0.0.1:5000/api/dashboard/overview")
    print("=" * 60)
    app.run(host="127.0.0.1", port=5000, debug=True)
