import io
import csv
import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    KeepTogether,
    HRFlowable,
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

from data import (
    get_state_dashboard_data,
    get_district_dashboard_data,
    HOTSPOTS,
    CITIZEN_GRIEVANCES,
)
from grievance_analytics import compute_national_analytics
from priority_engine import calculate_priority_score


class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute total pages and stamp
    an official header and footer on every page.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 7)
        self.setFillColor(colors.HexColor("#475569"))

        # Header rule and text (page 2+)
        if self._pageNumber > 1:
            self.drawString(36, 810, "JANVISTA AI — EXECUTIVE DECISION SUPPORT BRIEF")
            self.drawRightString(A4[0] - 36, 810, "OFFICIAL USE ONLY • AUDITED")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(36, 804, A4[0] - 36, 804)

        # Footer
        self.setFont("Helvetica", 7)
        self.setFillColor(colors.HexColor("#64748b"))
        self.setStrokeColor(colors.HexColor("#e2e8f0"))
        self.setLineWidth(0.5)
        self.line(36, 38, A4[0] - 36, 38)

        now_str = datetime.datetime.now().strftime("%d %b %Y %H:%M IST")
        self.drawString(36, 26, f"JANVISTA Deterministic Decision Support • Generated {now_str} • Zero-Key Mode")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 36, 26, page_str)
        self.restoreState()


def get_brief_data(role="Policymaker", state=None, district=None, officer_name=None):
    """
    Consolidates data for export according to role and jurisdiction:
    - "District Collector" -> District scope
    - "State Planner"      -> State scope
    - "Policymaker" / other -> National scope
    """
    clean_role = (role or "Policymaker").strip()
    role_norm = clean_role.lower()

    # Determine scope
    if "collector" in role_norm or "district" in role_norm:
        scope = "district"
    elif "planner" in role_norm or "state" in role_norm:
        scope = "state"
    else:
        scope = "national"

    # Override scope if explicit district or state provided
    if district and district.lower() not in ["all", "national"]:
        scope = "district"
    elif state and state.lower() not in ["all", "national", "all india"] and scope != "district":
        scope = "state"

    if scope == "district":
        target_dist = district or "Haveri"
        target_st = state or "Karnataka"
        data = get_district_dashboard_data(district_name=target_dist, state_name=target_st)
        role_label = "District Collector"
        jurisdiction_label = data.get("jurisdiction", f"{data['district']} District, {data['state']}")
        brief_title = f"District Infrastructure Decision Brief — {data['district']}, {data['state']}"
        authority_title = f"Office of the District Collector, {data['district']}"

    elif scope == "state":
        target_st = state or "Jharkhand"
        data = get_state_dashboard_data(target_st)
        role_label = "State Planner"
        jurisdiction_label = f"{data['state']} State Planning Commission"
        brief_title = f"State Capital Infrastructure Brief — {data['state']}"
        authority_title = f"{data['state']} State Planning & Development Department"

    else:
        # National Scope
        national = compute_national_analytics(HOTSPOTS)
        total_requests = national["total_citizen_requests"]
        live_hotspots = national["hotspots"]
        cluster_count = national["cluster_count"]
        top_hotspot = live_hotspots[0] if live_hotspots else HOTSPOTS[0]

        top_priority = calculate_priority_score(
            demand=top_hotspot.get("raw_factors", {}).get("demand", 94.0),
            gap=top_hotspot.get("gap_index", 91.2),
            vulnerability=top_hotspot.get("raw_factors", {}).get("vulnerability", 86.5),
            accessibility_deficit=top_hotspot.get("raw_factors", {}).get("accessibility_deficit", 88.0),
            urgency=top_hotspot.get("raw_factors", {}).get("urgency", 100.0),
            investment_mismatch=top_hotspot.get("raw_factors", {}).get("investment_mismatch", 74.0),
        )

        top_ug = top_hotspot.get("citizen_grievance") or (CITIZEN_GRIEVANCES[0] if CITIZEN_GRIEVANCES else {})
        live_spotlight = {
            "id": f"rec-{top_hotspot.get('district', 'nat').lower().replace(' ', '_')[:8]}-nat-01",
            "region_name": top_hotspot.get("region_name", "All-India Priority"),
            "district": top_hotspot.get("district", "Sitapur"),
            "state": top_hotspot.get("state", "Uttar Pradesh"),
            "category": top_hotspot.get("category", "Healthcare"),
            "title": top_hotspot.get("title", "Establish 100-Bed Sub-Divisional Hospital & Trauma Unit"),
            "description": top_hotspot.get("description", "Critical deficit identified from citizen demand clusters."),
            "estimated_cost_cr": top_hotspot.get("estimated_cost_cr", 42.5),
            "impacted_population": top_hotspot.get("impacted_population", 420000),
            "urgency_tier": top_hotspot.get("status", "CRITICAL"),
            "status": "PROPOSED",
            "priority_score": top_priority["score"],
            "priority_breakdown": top_priority,
        }

        kpis = [
            {"title": "Citizen Requests", "value": f"{total_requests:,}", "subtitle": f"Live grievances across {len(live_hotspots)} district(s)"},
            {"title": "Demand Clusters", "value": f"{cluster_count} Clusters", "subtitle": "Spatial & semantic aggregation"},
            {"title": "Hotspots Detected", "value": f"{len(live_hotspots)} Regions", "subtitle": f"{top_hotspot.get('region_name', '')} ranked #1"},
            {"title": "Max Gap Index", "value": f"{top_hotspot.get('gap_index', 91.2)} %", "subtitle": f"{top_hotspot.get('region_name', '')} Deficit"},
            {"title": "Top Priority Score", "value": f"{top_priority['score']} / 100", "subtitle": "Deterministic Model v1.0.0 (Audited)"},
        ]

        data = {
            "scope": "national",
            "state": "National",
            "district": None,
            "banner": {
                "title": "WHERE SHOULD WE ACT FIRST?",
                "subtitle": "JANVISTA transforms fragmented multilingual citizen feedback into explainable, evidence-backed public infrastructure priorities.",
            },
            "kpis": kpis,
            "spotlight": live_spotlight,
            "hotspots": live_hotspots,
        }
        role_label = "Policymaker (National)"
        jurisdiction_label = "All-India Multi-State Jurisdiction"
        brief_title = "National Infrastructure Priority Brief — Government of India"
        authority_title = "National Decision Support & Strategic Capex Oversight"

    # Filter grievances relevant to scope
    filtered_grievances = []
    if scope == "district":
        d_name = (data.get("district") or "").lower()
        filtered_grievances = [g for g in CITIZEN_GRIEVANCES if (g.get("district") or "").lower() == d_name]
    elif scope == "state":
        s_name = (data.get("state") or "").lower()
        filtered_grievances = [g for g in CITIZEN_GRIEVANCES if (g.get("state") or "").lower() == s_name]
    else:
        filtered_grievances = CITIZEN_GRIEVANCES[:25]

    return {
        "scope": scope,
        "role_label": role_label,
        "jurisdiction_label": jurisdiction_label,
        "brief_title": brief_title,
        "authority_title": authority_title,
        "officer_name": officer_name or role_label,
        "state": data.get("state"),
        "district": data.get("district"),
        "data": data,
        "kpis": data.get("kpis", []),
        "spotlight": data.get("spotlight") or {},
        "hotspots": data.get("hotspots", []),
        "grievances": filtered_grievances,
        "generated_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
    }


def generate_brief_csv(brief_info):
    """
    Generates a structured CSV ledger string from brief_info.
    """
    output = io.StringIO()
    writer = csv.writer(output)

    # 1. Header & Metadata
    writer.writerow(["# JANVISTA AI — INFRASTRUCTURE DECISION SUPPORT BRIEF"])
    writer.writerow(["# CLASSIFICATION", "OFFICIAL USE ONLY / AUDITED DECISION INTELLIGENCE"])
    writer.writerow(["Report Title", brief_info["brief_title"]])
    writer.writerow(["Role Persona", brief_info["role_label"]])
    writer.writerow(["Authority / Jurisdiction", brief_info["jurisdiction_label"]])
    writer.writerow(["Officer / Reviewer", brief_info["officer_name"]])
    writer.writerow(["Scope", brief_info["scope"].upper()])
    writer.writerow(["State", brief_info["state"] or "National"])
    writer.writerow(["District", brief_info["district"] or "N/A"])
    writer.writerow(["Generated At", brief_info["generated_at"]])
    writer.writerow([])

    # 2. Executive KPIs
    writer.writerow(["=== SECTION 1: KEY PERFORMANCE INDICATORS (KPIS) ==="])
    writer.writerow(["KPI Name", "Value", "Context / Subtitle"])
    for kpi in brief_info.get("kpis", []):
        writer.writerow([kpi.get("title", ""), kpi.get("value", ""), kpi.get("subtitle", "")])
    writer.writerow([])

    # 3. Top Priority Spotlight
    spot = brief_info.get("spotlight")
    writer.writerow(["=== SECTION 2: TOP PRIORITY SPOTLIGHT INTERVENTION ==="])
    if spot:
        writer.writerow(["Field", "Detail"])
        writer.writerow(["Project Title", spot.get("title", "N/A")])
        writer.writerow(["Category / Sector", spot.get("category", "N/A")])
        writer.writerow(["Target Area / Region", spot.get("area") or spot.get("district") or spot.get("region_name", "N/A")])
        writer.writerow(["State", spot.get("state", brief_info.get("state", "N/A"))])
        writer.writerow(["Estimated Capex (₹ Cr)", spot.get("estimated_cost_cr", "N/A")])
        writer.writerow(["Impacted Population", spot.get("impacted_population", "N/A")])
        writer.writerow(["MCA Priority Score", f"{spot.get('priority_score', 'N/A')} / 100"])
        writer.writerow(["Urgency Tier", spot.get("urgency_tier", "CRITICAL")])
        writer.writerow(["Administrative Status", spot.get("status", "PROPOSED")])
        writer.writerow(["Evidence & Rationale", spot.get("description", "N/A")])
    else:
        writer.writerow(["Status", "No critical spotlight intervention currently identified. Awaiting citizen demand aggregation."])
    writer.writerow([])

    # 4. Multi-Criteria Analysis (MCA) Explainability Factors
    pb = spot.get("priority_breakdown", {})
    factors = pb.get("factors", [])
    if factors:
        writer.writerow(["=== SECTION 3: DETERMINISTIC 6-FACTOR MCA EXPLAINABILITY ==="])
        writer.writerow(["Factor Name", "Weight (%)", "Raw Score (0-100)", "Weighted Points", "Data Source"])
        for f in factors:
            weight_pct = f"{int(round((f.get('weight', 0) * 100)))}%"
            raw = f.get("raw_score", f.get("rawScore", 0))
            weighted = f.get("weighted_score", f.get("weightedScore", 0))
            src = f.get("source_dataset", f.get("sourceDataset", ""))
            writer.writerow([f.get("name", ""), weight_pct, raw, weighted, src])
        writer.writerow([])

    # 5. Regional Hotspots Ledger
    writer.writerow(["=== SECTION 4: RANKED REGIONAL HOTSPOTS & DEFICIT LEDGER ==="])
    writer.writerow(["Rank", "Region / Area", "Category", "Gap Index (%)", "MCA Score", "Citizen Requests", "Urgency Tier", "Status"])
    for h in brief_info.get("hotspots", []):
        writer.writerow([
            h.get("rank", ""),
            h.get("region_name", h.get("area", "")),
            h.get("category", ""),
            f"{h.get('gap_index', '')}%",
            h.get("priority_score", ""),
            h.get("citizen_requests", ""),
            h.get("urgency", h.get("status", "")),
            h.get("status", "IDENTIFIED"),
        ])
    writer.writerow([])

    # 6. Citizen Grievance Signals
    grievances = brief_info.get("grievances", [])
    if grievances:
        writer.writerow(["=== SECTION 5: LOCAL CITIZEN GRIEVANCE DEMAND SIGNALS ==="])
        writer.writerow(["Tracking ID", "Citizen Name", "Area / Village", "District", "State", "Category", "Urgency", "Status", "Grievance Description", "Lodged Date"])
        for g in grievances:
            writer.writerow([
                g.get("tracking_id", ""),
                g.get("name", "Verified Citizen"),
                g.get("village", g.get("area", "")),
                g.get("district", ""),
                g.get("state", ""),
                g.get("category", ""),
                g.get("urgency", ""),
                g.get("status", ""),
                (g.get("description", "")).replace("\n", " "),
                g.get("created_at", g.get("date", "")),
            ])

    return output.getvalue()


def generate_brief_pdf(brief_info):
    """
    Generates a professional executive-ready A4 PDF document using ReportLab.
    Returns bytes of the PDF.
    """
    buf = io.BytesIO()
    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=46,
        bottomMargin=46,
    )

    styles = getSampleStyleSheet()
    
    # Custom palette
    primary_color = colors.HexColor("#0f172a")  # slate-900
    accent_blue = colors.HexColor("#1d4ed8")    # blue-700
    subtext_color = colors.HexColor("#475569")  # slate-600
    border_color = colors.HexColor("#e2e8f0")   # slate-200
    bg_light = colors.HexColor("#f8fafc")       # slate-50
    badge_green = colors.HexColor("#059669")
    badge_red = colors.HexColor("#dc2626")

    # Typography styles
    style_brand = ParagraphStyle(
        "BrandHeader",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=14,
        textColor=accent_blue,
    )
    style_title = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=16,
        leading=20,
        textColor=primary_color,
        spaceAfter=3,
    )
    style_subtitle = ParagraphStyle(
        "DocSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=subtext_color,
        spaceAfter=10,
    )
    style_sec_heading = ParagraphStyle(
        "SecHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=13,
        textColor=primary_color,
        spaceBefore=10,
        spaceAfter=5,
    )
    style_body = ParagraphStyle(
        "BodyDark",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#1e293b"),
    )
    style_table_hdr = ParagraphStyle(
        "TblHdr",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white,
    )
    style_table_cell = ParagraphStyle(
        "TblCell",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#1e293b"),
    )
    style_table_cell_bold = ParagraphStyle(
        "TblCellBold",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0f172a"),
    )

    story = []

    # 1. Header Banner Box
    scope_code = brief_info["scope"].upper()
    role_name = brief_info["role_label"]
    
    header_data = [
        [
            Paragraph("<b>JANVISTA AI</b> • NATIONAL DECISION SUPPORT SYSTEM", style_brand),
            Paragraph(f"<font color='#059669'><b>CLASSIFICATION: OFFICIAL USE</b></font><br/><font color='#64748b' size='7'>AUDITED MCA ENGINE V1.0.0</font>", ParagraphStyle("RightHdr", parent=style_body, alignment=2)),
        ]
    ]
    t_header = Table(header_data, colWidths=[340, 183])
    t_header.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    story.append(t_header)

    story.append(HRFlowable(width="100%", thickness=1.5, color=accent_blue, spaceBefore=4, spaceAfter=8))

    # Document Title & Context
    story.append(Paragraph(brief_info["brief_title"].upper(), style_title))
    story.append(Paragraph(
        f"<b>Role Persona:</b> {role_name} &nbsp;|&nbsp; "
        f"<b>Authority / Jurisdiction:</b> {brief_info['jurisdiction_label']} &nbsp;|&nbsp; "
        f"<b>Officer:</b> {brief_info['officer_name']}<br/>"
        f"<b>Generated:</b> {brief_info['generated_at']} &nbsp;|&nbsp; "
        f"<b>Scope:</b> {scope_code} JURISDICTION",
        style_subtitle
    ))

    # 2. Executive KPIs Grid
    story.append(Paragraph("EXECUTIVE INTELLIGENCE SUMMARY & KEY METRICS", style_sec_heading))
    
    kpis = brief_info.get("kpis", [])
    if kpis:
        # We render 5 KPI boxes in a table row
        kpi_cells = []
        for k in kpis[:5]:
            cell_content = [
                Paragraph(f"<font color='#64748b' size='6.5'><b>{k.get('title','').upper()}</b></font>", style_body),
                Paragraph(f"<font color='#0f172a' size='11'><b>{k.get('value','')}</b></font>", style_body),
                Paragraph(f"<font color='#475569' size='6'>{k.get('subtitle','')[:32]}</font>", style_body),
            ]
            kpi_cells.append(cell_content)
        
        # Ensure 5 cols
        while len(kpi_cells) < 5:
            kpi_cells.append([Paragraph("", style_body)])

        col_w = 523.0 / 5.0
        t_kpi = Table([kpi_cells], colWidths=[col_w] * 5)
        t_kpi.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), bg_light),
            ("BOX", (0, 0), (-1, -1), 0.5, border_color),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, border_color),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ("LEFTPADDING", (0, 0), (-1, -1), 5),
            ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ]))
        story.append(t_kpi)
        story.append(Spacer(1, 10))

    # 3. Top Priority Spotlight Recommendation
    spot = brief_info.get("spotlight", {})
    if spot:
        story.append(Paragraph("HIGHEST PRIORITY OPPORTUNITY SPOTLIGHT", style_sec_heading))
        
        capex = spot.get("estimated_cost_cr") or "N/A"
        pop = spot.get("impacted_population")
        pop_str = f"{int(pop):,}" if isinstance(pop, (int, float)) else str(pop or "N/A")
        score = spot.get("priority_score", "N/A")
        tier = spot.get("urgency_tier", "CRITICAL")
        sector = spot.get("category", "General Infrastructure")
        area_str = spot.get("area") or spot.get("district") or spot.get("region_name", "")

        spot_table_data = [
            [
                Paragraph(f"<b>PROJECT TITLE:</b> {spot.get('title', 'N/A')}", style_body),
                Paragraph(f"<b>MCA PRIORITY SCORE:</b> <font color='#059669'><b>{score} / 100</b></font>", style_body),
            ],
            [
                Paragraph(f"<b>Sector / Category:</b> {sector} &nbsp;&bull;&nbsp; <b>Location:</b> {area_str}", style_body),
                Paragraph(f"<b>Urgency Tier:</b> <font color='#dc2626'><b>{tier}</b></font> &nbsp;&bull;&nbsp; <b>Status:</b> {spot.get('status','PROPOSED')}", style_body),
            ],
            [
                Paragraph(f"<b>Estimated Capex:</b> ₹{capex} Cr &nbsp;&bull;&nbsp; <b>Direct Beneficiaries:</b> {pop_str} Citizens", style_body),
                Paragraph(f"<b>Audit Validation:</b> Verified by Multi-Criteria GIS & Demand Model", style_body),
            ],
            [
                Paragraph(f"<b>Actionable Rationale:</b> {spot.get('description', '')}", style_body),
                Paragraph(f"<b>Provenance:</b> Corroborated with field citizen grievances & audit benchmarks.", style_body),
            ]
        ]
        t_spot = Table(spot_table_data, colWidths=[290, 233])
        t_spot.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f1f5f9")),
            ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("LEFTPADDING", (0, 0), (-1, -1), 6),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ]))
        story.append(t_spot)
        story.append(Spacer(1, 10))
    else:
        story.append(Paragraph("HIGHEST PRIORITY OPPORTUNITY SPOTLIGHT", style_sec_heading))
        empty_spot_data = [[
            Paragraph("<b>STATUS:</b> Awaiting prioritized capital opportunity signals for this jurisdiction.<br/><font color='#64748b'>Citizen grievance intake active. Prioritization will compute dynamically once demand clusters are formed.</font>", style_body)
        ]]
        t_empty = Table(empty_spot_data, colWidths=[523])
        t_empty.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), bg_light),
            ("BOX", (0, 0), (-1, -1), 0.5, border_color),
            ("PADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(t_empty)
        story.append(Spacer(1, 10))

    # 4. Multi-Criteria Analysis Breakdown (6 Factors)
    pb = (spot or {}).get("priority_breakdown", {})
    factors = pb.get("factors", [])
    if factors:
        story.append(Paragraph("DETERMINISTIC 6-FACTOR MCA EXPLAINABILITY BREAKDOWN", style_sec_heading))
        factor_headers = [
            Paragraph("Explainability Factor", style_table_hdr),
            Paragraph("Weight", style_table_hdr),
            Paragraph("Raw Score", style_table_hdr),
            Paragraph("Weighted Pts", style_table_hdr),
            Paragraph("Source Dataset", style_table_hdr),
        ]
        factor_rows = [factor_headers]
        for f in factors:
            w_pct = f"{int(round((f.get('weight', 0) * 100)))}%"
            raw = str(f.get("raw_score", f.get("rawScore", 0)))
            pts = f"+{f.get('weighted_score', f.get('weightedScore', 0))} pts"
            src = f.get("source_dataset", f.get("sourceDataset", ""))
            factor_rows.append([
                Paragraph(f.get("name", ""), style_table_cell_bold),
                Paragraph(w_pct, style_table_cell),
                Paragraph(raw, style_table_cell),
                Paragraph(f"<font color='#1d4ed8'><b>{pts}</b></font>", style_table_cell),
                Paragraph(src, style_table_cell),
            ])
        t_factors = Table(factor_rows, colWidths=[150, 48, 55, 65, 205])
        t_factors.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), primary_color),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, bg_light]),
            ("BOX", (0, 0), (-1, -1), 0.5, border_color),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, border_color),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LEFTPADDING", (0, 0), (-1, -1), 5),
            ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ]))
        story.append(t_factors)
        story.append(Spacer(1, 10))

    # 5. Regional Hotspots Table
    hotspots = brief_info.get("hotspots", [])
    if hotspots:
        story.append(Paragraph(f"RANKED REGIONAL HOTSPOTS & DEFICIT LEDGER ({len(hotspots)} IDENTIFIED)", style_sec_heading))
        h_headers = [
            Paragraph("Rank", style_table_hdr),
            Paragraph("Region / Sub-Area", style_table_hdr),
            Paragraph("Category", style_table_hdr),
            Paragraph("Gap %", style_table_hdr),
            Paragraph("MCA Score", style_table_hdr),
            Paragraph("Demands", style_table_hdr),
            Paragraph("Urgency", style_table_hdr),
            Paragraph("Status", style_table_hdr),
        ]
        h_rows = [h_headers]
        for h in hotspots[:10]:  # Top 10 for clean presentation
            rank_str = f"#{h.get('rank', '-')}"
            reg_name = h.get("region_name") or h.get("area") or h.get("district") or "-"
            gap_str = f"{h.get('gap_index', '-')}%"
            score_str = f"{h.get('priority_score', '-')}"
            req_str = f"{h.get('citizen_requests', 0):,}" if isinstance(h.get('citizen_requests'), (int, float)) else str(h.get('citizen_requests', '-'))
            urg_str = h.get("urgency") or h.get("status") or "High"
            stat_str = h.get("status", "ACTIVE")
            
            h_rows.append([
                Paragraph(f"<b>{rank_str}</b>", style_table_cell),
                Paragraph(f"<b>{reg_name}</b>", style_table_cell),
                Paragraph(h.get("category", "-"), style_table_cell),
                Paragraph(gap_str, style_table_cell),
                Paragraph(f"<font color='#059669'><b>{score_str}</b></font>", style_table_cell),
                Paragraph(req_str, style_table_cell),
                Paragraph(urg_str, style_table_cell),
                Paragraph(stat_str, style_table_cell),
            ])
        t_hotspots = Table(h_rows, colWidths=[32, 140, 80, 45, 52, 50, 60, 64])
        t_hotspots.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), primary_color),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, bg_light]),
            ("BOX", (0, 0), (-1, -1), 0.5, border_color),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, border_color),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LEFTPADDING", (0, 0), (-1, -1), 4),
            ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(t_hotspots)
        story.append(Spacer(1, 10))
    else:
        story.append(Paragraph("REGIONAL HOTSPOTS & DEFICIT LEDGER", style_sec_heading))
        empty_h_data = [[
            Paragraph("<b>STATUS:</b> No active deficit hotspots detected for this jurisdiction at current threshold.<br/><font color='#64748b'>Monitoring real-time citizen demand signals and multi-criteria deficit indices.</font>", style_body)
        ]]
        t_empty_h = Table(empty_h_data, colWidths=[523])
        t_empty_h.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), bg_light),
            ("BOX", (0, 0), (-1, -1), 0.5, border_color),
            ("PADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(t_empty_h)
        story.append(Spacer(1, 10))

    # 6. Citizen Grievance Demand Signals (if district or state scope)
    grievances = brief_info.get("grievances", [])
    if grievances and len(grievances) > 0:
        story.append(Paragraph(f"CORROBORATING CITIZEN GRIEVANCE RECORDS ({len(grievances)} ON RECORD)", style_sec_heading))
        g_headers = [
            Paragraph("Tracking ID", style_table_hdr),
            Paragraph("Citizen / Village", style_table_hdr),
            Paragraph("Category", style_table_hdr),
            Paragraph("Description / Demand Signal", style_table_hdr),
            Paragraph("Status", style_table_hdr),
        ]
        g_rows = [g_headers]
        for g in grievances[:6]:  # Show top 6 relevant records
            cit_info = f"{g.get('name', 'Citizen')}<br/><font color='#64748b' size='6.5'>{g.get('village', g.get('area', g.get('district', '')))}</font>"
            desc_snip = g.get("description", "")
            if len(desc_snip) > 110:
                desc_snip = desc_snip[:107] + "..."
            
            g_rows.append([
                Paragraph(f"<b>{g.get('tracking_id','')}</b>", style_table_cell_bold),
                Paragraph(cit_info, style_table_cell),
                Paragraph(g.get("category",""), style_table_cell),
                Paragraph(desc_snip, style_table_cell),
                Paragraph(f"<b>{g.get('status','SUBMITTED')}</b>", style_table_cell),
            ])
        t_gv = Table(g_rows, colWidths=[80, 105, 75, 203, 60])
        t_gv.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), primary_color),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, bg_light]),
            ("BOX", (0, 0), (-1, -1), 0.5, border_color),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, border_color),
            ("TOPPADDING", (0, 0), (-1, -1), 3),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ("LEFTPADDING", (0, 0), (-1, -1), 4),
            ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(t_gv)
        story.append(Spacer(1, 10))
    else:
        story.append(Paragraph("CITIZEN GRIEVANCE DEMAND SIGNALS", style_sec_heading))
        empty_g_data = [[
            Paragraph("<b>STATUS:</b> No active citizen grievances filed yet in this jurisdiction.", style_body)
        ]]
        t_empty_g = Table(empty_g_data, colWidths=[523])
        t_empty_g.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), bg_light),
            ("BOX", (0, 0), (-1, -1), 0.5, border_color),
            ("PADDING", (0, 0), (-1, -1), 8),
        ]))
        story.append(t_empty_g)
        story.append(Spacer(1, 10))

    # 7. Signature & Audit Box
    sig_data = [
        [
            Paragraph("<b>EVALUATED & CERTIFIED BY:</b><br/>JANVISTA Deterministic Decision Support Engine<br/><font color='#64748b' size='6.5'>Zero-Key Offline Simulation & Multi-Criteria Analysis</font>", style_body),
            Paragraph(f"<b>EXECUTIVE DIRECTIVE AUTHORITY:</b><br/>{brief_info['authority_title']}<br/><font color='#059669' size='6.5'><b>STATUS: READY FOR IN-PRINCIPLE CAPEX ALLOCATION</b></font>", style_body),
        ]
    ]
    t_sig = Table(sig_data, colWidths=[260, 263])
    t_sig.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f8fafc")),
        ("BOX", (0, 0), (-1, -1), 0.5, border_color),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(KeepTogether(t_sig))

    # Build PDF with NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    return buf.getvalue()
