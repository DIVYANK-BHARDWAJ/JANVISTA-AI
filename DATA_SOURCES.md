# Data sources and evidence status

JANVISTA operates across all Indian States and Union Territories. It does not claim that every district has every dataset loaded.

| Signal | Current source | Status |
| --- | --- | --- |
| Citizen demand | Citizen records submitted through the JANVISTA intake ledger | Live and auditable |
| Severity, immediacy, language and English summary | Gemini API (`gemini-2.0-flash`) when `GEMINI_API_KEY` is configured; deterministic fallback otherwise | Live when configured; provider retained with each record |
| District population | [Census of India](https://censusindia.gov.in/census.website/data/population-finder) | Load a district record before displaying a population-impact figure |
| Facility coverage / beds | [Rural Health Statistics](https://main.mohfw.gov.in/?q=documents/publication) | Pending integration |
| Tap-water coverage | [Jal Jeevan Mission dashboard](https://ejalshakti.gov.in/jjmreport/JJMIndia.aspx) | Pending integration |
| Travel time, capex and beneficiary estimates | Validated facility, routing and DPR/financial datasets | Pending integration; never inferred from templates |

No capex, beneficiary, bed, or travel-time number is shown unless its source has been loaded and recorded for that district. Current and target transit metrics are reserved for a healthcare recommendation with a validated facility and travel-time baseline.
