# JANVISTA AI — System Architecture & Design Specification

## System Layering Model

```text
JANVISTA
│
├── PRESENTATION (Overview, Map, Demand, Hotspots, Infrastructure, Recommendations, Evidence, Simulator, Ask JANVISTA)
├── APPLICATION (Request Processing, Recommendation Service, Policy Query Service, Simulation Service, Analytics Service)
├── AI (Gemini 1.5, Multilingual, Speech, Grounding, Fallback Engine)
├── INTELLIGENCE (Clustering, Hotspot, Gap Engine, Priority Engine v1.0.0, Evidence Engine, Simulation Engine)
├── DATA (Citizen Requests, Administrative Regions, Infrastructure Assets, Demographics, Investments, Evidence, Policies)
├── GOVERNANCE (Auth, Roles, Provenance Model, Audit Log, Data Classification, AI Safety Safeguards)
└── INFRASTRUCTURE (Docker, Cloud Run, Cloud Logging/Monitoring, Fallback / Demo Mode)
```

## Deterministic Priority Engine (v1.0.0)

Calculated formula:
`Priority Score` = `(Demand * 0.30) + (Gap * 0.25) + (Vulnerability * 0.15) + (Accessibility Deficit * 0.15) + (Urgency * 0.10) + (Investment Mismatch * 0.05)`

- **Citizen Demand (30%)**: Aggregated signals normalized by population.
- **Infrastructure Gap (25%)**: Gap Index = `(Demand * 0.40) + ((100 - Coverage) * 0.40) + (Vulnerability * 0.20)`.
- **Population Vulnerability (15%)**: Multidimensional Vulnerability Index (MVI).
- **Accessibility Deficit (15%)**: Spatial travel time deficit (100 - accessibilityIndex).
- **Urgency Signal (10%)**: Extracted urgency rating.
- **Investment Mismatch (5%)**: Discrepancy between regional capex allocation and citizen demand share.

## Provenance Model

Every recommendation links down to its original dataset source:
`Recommendation → PriorityScore → FeatureValues → Evidence[] → Dataset → Source`

## Grounded Ask JANVISTA RAG Pipeline

1. **User Question**
2. **Intent Detection**
3. **Query Planning**
4. **Retrieve JANVISTA Data**
5. **Run Deterministic Analytics**
6. **Evidence Assembly**
7. **Gemini Synthesis**
8. **Grounded Answer + Evidence References**

## Governance & Safety

- All records strictly tag Data Classification (`PUBLIC_REAL_DATA`, `SYNTHETIC_DATA`, `MODEL_OUTPUT`, `SIMULATION`).
- Audit Logger records all mutations (`AuditEvent`).
- Human Policymaker Review is enforced on all recommendations.
