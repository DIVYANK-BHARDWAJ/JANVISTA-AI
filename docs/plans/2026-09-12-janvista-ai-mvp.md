# JANVISTA AI MVP Implementation Plan (v2)

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** Build a production-grade, demonstrable, AI-native Digital Public Infrastructure decision-intelligence platform (**JANVISTA AI**) that transforms multilingual citizen requests into structured demand signals, calculates deterministic priorities, provides evidence-backed explanations via Google Gemini, and enables policy simulation.

**Architecture:** Full-stack Next.js 14 App Router, TypeScript, Tailwind CSS, modular backend API, pure deterministic math engines for Clustering/Gaps/Priorities (v1.0.0), Provenance Service (Recommendation -> PriorityScore -> FeatureValues -> Evidence[]), Audit Logger, Grounded Ask JANVISTA RAG, Google Gemini API integration with local fallback support, Google Maps JS API + Local SVG/GeoJSON India map fallback, Vitest + Playwright testing stack.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide React, Recharts, `@google/genai`, Zod, Vitest (unit/integration), Playwright (E2E).

---

### Task 1: Project Scaffolding & Configuration

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.env.example`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`

**Step 1: Write `package.json` and config files**
Initialize Next.js project with TypeScript, React, Tailwind, Lucide React, Recharts, `@google/genai`, Vitest, and Playwright.

**Step 2: Install dependencies**
Run: `npm install`

**Step 3: Commit Scaffolding**
`git add . && git commit -m "feat: initialize JANVISTA Next.js project with Vitest and Playwright setup"`

---

### Task 2: Core Data Models, Provenance Engine & Audit Architecture

**Files:**
- Create: `src/types/index.ts`
- Create: `src/config/priority-weights.ts`
- Create: `src/lib/governance/audit.ts`
- Create: `src/lib/governance/provenance.ts`
- Create: `src/lib/data/seed-data.ts`
- Create: `src/lib/data/store.ts`
- Test: `tests/unit/seed-data.test.ts`

**Step 1: Define canonical TypeScript models**
Define `CitizenRequest`, `AdministrativeRegion`, `InfrastructureAsset`, `InfrastructureGap`, `DemandCluster`, `Hotspot`, `PriorityScore`, `Recommendation`, `Evidence`, `SimulationResult`, and `AuditEvent`.

**Step 2: Implement Provenance Engine & Audit Logger**
Build `ProvenanceService` linking Recommendations → PriorityScores → FeatureValues → Evidence[] → Dataset → Source. Implement `AuditService` logging system mutations.

**Step 3: Create Sitapur Healthcare Demo Seed Dataset**
Create synthetic dataset with Sitapur scenario explicitly classified as `SYNTHETIC_DATA` (8,421 aggregated demand signals, 250 individual citizen request records).

**Step 4: Test seed data integrity using Vitest**
Run: `npx vitest run tests/unit/seed-data.test.ts`

**Step 5: Commit**
`git add . && git commit -m "feat: implement data models, provenance engine, audit logger, and seed dataset"`

---

### Task 3: Deterministic Intelligence Engines & Unit Tests

**Files:**
- Create: `src/lib/engines/clustering.ts`
- Create: `src/lib/engines/hotspot.ts`
- Create: `src/lib/engines/gap.ts`
- Create: `src/lib/engines/priority.ts`
- Create: `src/lib/engines/evidence.ts`
- Create: `src/lib/engines/simulator.ts`
- Test: `tests/unit/priority-engine.test.ts`
- Test: `tests/unit/gap-engine.test.ts`

**Step 1: Implement `PriorityEngine` (v1.0.0) and `GapEngine`**
Write deterministic functions calculating normalized gap scores and weighted priority scores.

**Step 2: Write unit tests for Priority & Gap Engine using Vitest**
Write tests verifying mathematical determinism and score bounds.

**Step 3: Run Vitest tests**
Run: `npx vitest run tests/unit/`

**Step 4: Commit**
`git add . && git commit -m "feat: implement deterministic Priority, Gap, Clustering, and Simulation engines"`

---

### Task 4: AI Layer & Grounded Ask JANVISTA Pipeline

**Files:**
- Create: `src/lib/ai/gemini.ts`
- Create: `src/lib/ai/multilingual.ts`
- Create: `src/lib/ai/fallback.ts`
- Create: `src/lib/ai/ask-janvista.ts`
- Test: `tests/unit/ask-janvista.test.ts`

**Step 1: Implement `GeminiService` and Local Fallbacks**
Build structured JSON extraction prompts with local fallback parsing when API keys are absent.

**Step 2: Implement Grounded Ask JANVISTA RAG Pipeline**
Implement User Question → Intent Detection → Query Planning → Data Retrieval → Deterministic Analytics → Evidence Assembly → Gemini Synthesis → Grounded Answer + Evidence References.

**Step 3: Test Grounded Ask JANVISTA with Vitest**
Run: `npx vitest run tests/unit/ask-janvista.test.ts`

**Step 4: Commit**
`git add . && git commit -m "feat: implement Gemini AI pipeline and grounded Ask JANVISTA RAG architecture"`

---

### Task 5: Backend API Layer & Audit Endpoints

**Files:**
- Create: `src/app/api/requests/route.ts`
- Create: `src/app/api/demand/route.ts`
- Create: `src/app/api/hotspots/route.ts`
- Create: `src/app/api/infrastructure/route.ts`
- Create: `src/app/api/priorities/route.ts`
- Create: `src/app/api/recommendations/route.ts`
- Create: `src/app/api/evidence/route.ts`
- Create: `src/app/api/policy/query/route.ts`
- Create: `src/app/api/simulation/route.ts`
- Create: `src/app/api/audit/route.ts`
- Test: `tests/integration/api.test.ts`

**Step 1: Implement API Route Handlers with Audit Logging**
Create route handlers for API endpoints, automatically recording audit logs on mutations.

**Step 2: Run integration tests with Vitest**
Run: `npx vitest run tests/integration/`

**Step 3: Commit**
`git add . && git commit -m "feat: add Next.js API route handlers with audit logging"`

---

### Task 6: UI Component Library, Map Fallback & Data Badges

**Files:**
- Create: `src/components/navigation/Navbar.tsx`
- Create: `src/components/navigation/Sidebar.tsx`
- Create: `src/components/ui/KpiCard.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/DataClassificationBadge.tsx`
- Create: `src/components/ui/WhyThisCard.tsx`
- Create: `src/components/map/IndiaMap.tsx`
- Create: `src/components/citizen/VoiceRecorder.tsx`
- Create: `src/components/citizen/TextInput.tsx`

**Step 1: Create UI components & Map Fallback**
Build header, role switcher, KPI indicators, explicit "DEMONSTRATION DATA" classification badges, "WHY THIS?" cards, voice audio recorder, and interactive SVG/GeoJSON India regional map fallback.

**Step 2: Commit**
`git add . && git commit -m "feat: create UI component library, map fallback, and classification badges"`

---

### Task 7: Primary Navigation Views & Application Integration

**Files:**
- Create: `src/components/views/OverviewView.tsx`
- Create: `src/components/views/MapView.tsx`
- Create: `src/components/views/DemandView.tsx`
- Create: `src/components/views/HotspotsView.tsx`
- Create: `src/components/views/InfrastructureView.tsx`
- Create: `src/components/views/RecommendationsView.tsx`
- Create: `src/components/views/EvidenceView.tsx`
- Create: `src/components/views/SimulatorView.tsx`
- Create: `src/components/views/AskJanvistaView.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Assemble all 9 primary application views**
Connect views to backend API handlers and state management.

**Step 2: Verify build**
Run: `npm run build`

**Step 3: Commit**
`git add . && git commit -m "feat: assemble 9 core navigation views for JANVISTA decision intelligence"`

---

### Task 8: End-to-End Playwright Tests, Docker & Architecture Specs

**Files:**
- Create: `tests/e2e/signature-demo.spec.ts`
- Create: `Dockerfile`
- Create: `.dockerignore`
- Modify: `README.md`
- Create: `docs/ARCHITECTURE.md`

**Step 1: Write Playwright E2E Test for Signature Demo Workflow**
Test complete 13-step citizen voice → request structuring → hotspot → gap → priority → evidence → recommendation → simulation → Ask JANVISTA flow.

**Step 2: Run Playwright test suite**
Run: `npx playwright test` (or `npx vitest run`)

**Step 3: Create Dockerfile & Architecture documentation**
Write container deployment spec and complete `ARCHITECTURE.md`.

**Step 4: Final commit**
`git add . && git commit -m "feat: add Playwright E2E signature demo test, Dockerfile, and architecture documentation"`
