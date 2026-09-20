# 🏛️ JANVISTA AI — Full Project Overview & Accomplishments Report

**Jan-AI National Vision & Infrastructure Strategic Targeting Assistant**  
*An AI-Native Digital Public Infrastructure Decision Intelligence Platform for Government of India*

---

## 📌 Executive Summary

**JANVISTA AI** is a state-of-the-art decision-intelligence platform built for government policymakers, district magistrates, and infrastructure authorities. It bridges the gap between fragmented citizen feedback (voice, text, photo evidence in regional languages) and national infrastructure resource allocation by executing **deterministic mathematical scoring** combined with **Google Gemini RAG explanations**.

---

## 🎨 Visual Design & Palette Standards

- **Theme Aesthetic**: Official Neutral Slate Government Palette (clean, light, authoritative).
- **Backgrounds**: Off-white (`#f8fafc`), Pure White (`#ffffff`) cards, Slate borders (`#cbd5e1`).
- **Headers & Buttons**: Slate Charcoal (`#0f172a`), Dark Charcoal (`#1e293b`).
- **Accents**: Saffron (`#d97706`), Emerald (`#047857`), Crimson (`#b91c1c`).
- **Color Constraint Enforced**: **Zero blue elements** per user preference.

---

## 🚪 Gateway Landing & Dual Portal Flow

The root URL (`/`) presents a top-level **Portal Gateway (`PortalGateway.tsx`)** offering two entry points:

### 1. 👤 I am a Citizen (जन सेवा पोर्टल)
- **Focused Public Interface**: Hides internal policy decision models to avoid cluttering citizen UX.
- **🎙️ Voice Speech-to-Text**: Built-in browser `Web Speech API` with real-time waveform recording in Hindi, Tamil, Marathi, Bengali, and English.
- **📝 Text & Photo Attachment**: Drag-and-drop dropzone for photos of damaged roads, broken water pumps, or hospital facilities.
- **🔍 Signal Status Lookup**: Instant Tracking ID generation (e.g., `JAN-2026-UP-84219`) allowing citizens to track resolution status.

### 2. 🏛️ I am a Govt Official / Policymaker (शासकीय निर्णय पोर्टल)
- **Official Access**: Full access to the JANVISTA Decision Intelligence Suite.
- **Role Switcher**: Designation selector (*Policymaker*, *Infra Authority*, *Data Analyst*).
- **9 Core Decision Modules**: Overview, National Map, Citizen Demand, Hotspots (AI), Infrastructure Gaps, Recommendations ("WHY THIS?"), Evidence Explorer, Impact Simulator, Ask JANVISTA (RAG).

---

## 🛠️ Complete Technical Implementation Summary

### 1. Core Data Models (`src/types/index.ts`)
- `CitizenRequest`: Single citizen voice/text signal with tracking ID, location, intent, urgency, and category.
- `AdministrativeRegion`: India state/district hierarchy with population vulnerability ratings.
- `InfrastructureAsset` & `InfrastructureGap`: Demand vs Supply deficit index models.
- `DemandCluster` & `Hotspot`: Spatial and semantic aggregation entities.
- `PriorityScore` & `Recommendation`: Audited weighted ranking scores linked to data provenance.
- `AuditEvent`: Append-only governance audit log records.

### 2. Analytical Data Engines (`src/lib/engines/`)
- `gap.ts`: Calculates Infrastructure Gap Index ($Deficit = Demand - Supply \times Coverage$).
- `priority.ts`: Centralized Priority Engine v1.0.0 (Weighted sum of Demand 30%, Gap 25%, Vulnerability 15%, Accessibility 15%, Urgency 10%, Mismatch 5%).
- `clustering.ts`: Groups citizen requests into spatial & semantic demand clusters.
- `hotspot.ts`: Spatial kernel density estimation identifying top priority regions (Sitapur UP ranked #1).
- `evidence.ts` & `provenance.ts`: Links recommendations directly to supporting citizen signals and data sources.
- `simulator.ts`: Scenario modeling for budget reallocation and population reach impact.

### 3. AI & RAG Engine (`src/lib/ai/`)
- `gemini.ts`: Google Generative AI integration for structuring raw citizen speech into JSON intent data.
- `ask-janvista.ts`: Grounded RAG query pipeline (`User Question → Intent → Data Retrieval → Deterministic Analytics → Evidence Assembly → Gemini Synthesis`).
- `multilingual.ts`: Support for regional language normalization and translation.

### 4. User Interface Modules (`src/components/`)
- **Navigation**: `Navbar.tsx` (Official Tricolor header, state selector, role switcher, Gateway exit button), `Sidebar.tsx` (9 primary modules).
- **Gateway & Citizen**: `PortalGateway.tsx`, `CitizenPortalView.tsx`, `VoiceRecorder.tsx`, `TextInput.tsx`.
- **Decision Intelligence Views**:
  - `OverviewView.tsx`: "WHERE SHOULD WE ACT FIRST?" banner, primary KPIs, Sitapur spotlight.
  - `MapView.tsx`: Regional geospatial visualization.
  - `DemandView.tsx`: Multilingual sentiment & request cluster analytics.
  - `HotspotsView.tsx`: AI hotspot ranking table & density scores.
  - `InfrastructureView.tsx`: Infrastructure gap breakdown across Healthcare, Water, Roads, Education, Power.
  - `RecommendationsView.tsx`: "WHY THIS REGION?" provenance cards.
  - `EvidenceView.tsx`: Raw evidence traceability inspector.
  - `SimulatorView.tsx`: Interactive budget reallocation sliders & impact preview.
  - `AskJanvistaView.tsx`: Grounded natural-language policy query engine.

---

## 📡 API Surface (`src/app/api/`)

- `POST /api/requests` — Ingest citizen voice/text request & generate tracking ID.
- `GET /api/demand` — Retrieve demand clusters.
- `GET /api/hotspots` — Retrieve spatial hotspot ranks.
- `GET /api/infrastructure` — Retrieve infrastructure gap index scores.
- `GET /api/priorities` — Retrieve audited priority scores.
- `GET /api/recommendations` — Retrieve "WHY THIS?" recommendations.
- `GET /api/evidence` — Retrieve traceable evidence items.
- `POST /api/policy/query` — Grounded Ask JANVISTA RAG query execution.
- `POST /api/simulation` — Scenario impact simulation.
- `GET /api/audit` — Retrieve audit trail log.

---

## 🧪 Testing, Quality Gates & CI/CD

- **Vitest Unit Tests**: `8/8` passed (`npx vitest run`).
- **ESLint Quality Gate**: `✔ No ESLint warnings or errors` (`npm run lint`).
- **Next.js Production Build**: `✓ Compiled successfully` (`npm run build`).
- **Playwright E2E Tests**: Updated `signature-demo.spec.ts` for Gateway landing flow (`npm run test:e2e`).
- **GitHub Actions CI/CD**:
  - Upgraded CodeQL to **v4** (`github/codeql-action/*@v4`).
  - Added ESLint dependencies (`eslint@^8.57.0`, `eslint-config-next@14.2.5`).
  - Handled SARIF uploads & dependency review permissions with `continue-on-error: true`.
  - Resolved workflow merge conflicts between `main` and `Divyank` branch.
- **Git Push**: Pushed to remote branch `Divyank` on [`DIVYANK-BHARDWAJ/JANVISTA-AI`](https://github.com/DIVYANK-BHARDWAJ/JANVISTA-AI.git).

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run unit tests
npm test

# Run ESLint check
npm run lint

# Build production bundle
npm run build
```

Access the app at **[http://localhost:3000](http://localhost:3000)**!
