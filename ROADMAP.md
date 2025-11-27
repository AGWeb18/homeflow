# HomeFlow — Ontario Pilot Roadmap

This roadmap focuses HomeFlow on an Ontario pilot (Toronto + Kawartha Lakes) and lays out the REAL MVP plus immediate data and engineering tasks required to author a canonical ADU (Accessory Dwelling Unit) checklist for those municipalities.

## 1. Vision (Ontario pilot)

To be Ontario homeowners' trusted project companion — guiding them from idea through permitting, design, and contractor connection with municipality-aware guidance and transparent data provenance.

Key Ontario considerations:

- Ontario Building Code (OBC) + municipal by-laws and zoning rules.
- Municipal processes vary — pilot will focus on municipality-granular rules for **Toronto** and **Kawartha Lakes**.
- Currency and payments in CAD; Ontario uses HST at 13% — estimator must reflect provincial tax.
- Bilingual support (English + Canadian French) remains a future priority for Québec-facing flows.

## 2. REAL MVP (Ontario-focused)

Goal: help a homeowner with an ADU idea get a clear, local next step and contact vetted contractors.

Minimum features (must-haves):

- **Authentication & Profiles:** Sign-up/sign-in, homeowner profiles, contractor profiles (claim flow later).
- **Create Project (Ontario-aware):** Project creation form with address lookup (Google Maps), province prefilled as Ontario, municipality resolution, and `Postal Code` input.
- **Permit Checklist (municipality templates, start with ADU):** Project Type (ADU) + Municipality -> prioritized permit checklist and next steps; author initial ADU checklists for Toronto and Kawartha Lakes.
- **Documents Upload & Storage:** Upload plans, permits, photos (Supabase Storage) attached to a project.
- **Contractor Directory (core):** Browse/search contractors by trade and municipality; contractors can express interest or be invited via CSV import.
- **Messaging (basic):** Secure 1:1 messaging between homeowner and contractor threads.
- **Rough Cost Estimator (CAD + HST):** Configurable estimator with materials, labour ranges and HST calculation (13% for Ontario).
- **Project Tasks & Timeline (simple):** Milestones, mark-complete, and a timeline overview in the Dashboard.
- **Data provenance & privacy:** Every checklist item links to a source; PII handled per best-practice and stored with clear opt-ins for sharing with contractors.

Reasoning: these items produce immediate value — actionable permit steps, document capture, and the ability to connect with contractors — while keeping scope minimal.

## 3. Phase 1 — Research & Data Foundations (immediate)

Focus: capture authoritative sources and create structured templates for ADU permit requirements.

- **Author ADU checklist (Toronto):** Use City of Toronto permit guides and Toronto Open Data as the canonical source; convert the guide into a structured JSON checklist.
- **Author ADU checklist (Kawartha Lakes):** Use City of Kawartha Lakes planning & permit pages to create a parallel structured checklist reflecting rural/seasonal differences (septic, shorelines, etc.).
- **Tax rules:** Hard-code Ontario HST (13%) in `data/ontario/taxes.json` for estimator and invoices.
- **Geocoding/address lookup:** Integrate Google Maps Geocoding API (use env var `VITE_GOOGLE_MAPS_API_KEY` or server-side `GOOGLE_MAPS_API_KEY`).
- **Data provenance file:** Add `data/ontario/sources.json` listing each source URL and last-verified date.

## 4. Phase 2 — Core MVP Build (priority order)

1. **Auth + Project creation + Documents** — address lookup -> municipality -> create project and upload files.
2. **ADU Permit Checklists** — implement checklist renderer using authored JSON templates for Toronto and Kawartha Lakes.
3. **Contractor Directory (seeded import + claim flow)** — CSV import for verified contractors; build a claim flow for contractors to claim and complete profiles.
4. **Messaging (1:1)** — lightweight messaging integrated with project pages.
5. **Rough Cost Estimator (CAD + HST)** — estimator component wired to project pages.
6. **Dashboard (project health + timeline + next permit step)**

Notes: avoid placeholder scraping of commercial directories; prefer opt-in CSV onboarding or trade association lists.

## 5. Phase 3 — Local Integrations & Trust Features

- **Contractor verification & reviews:** Add verification flags, insurance/license uploads, and reviews once users are onboarded.
- **Municipal integrations (pilot):** For Toronto, consume Open Data (permit records, zoning); for Kawartha Lakes, ingest municipal guides and any available open-data.
- **Payments & deposits (Canada-first):** Integrate Stripe for Canada; consider Moneris for additional payment options.

## 6. Phase 4 — Marketplace, Financing & Growth

- **Bid/broker marketplace:** Structured project posting and contractor responses (quotes).
- **Premium services:** Feasibility reports, paid reports, featured listings for contractors.

## 7. Phase 5 — Scale & Intelligence

- **Zoning & parcel intelligence:** Add parcel-level zoning lookups and build a "Can I build this?" feasibility check using parcel geometry.
- **AI assistant:** Provide context-aware answers using local rules and sources.

## Implementation notes & next steps (concrete)

- Pilot municipalities: **Toronto** and **Kawartha Lakes**.
- Project type to author first: **Accessory Dwelling Unit (ADU)** — author and store structured checklists for both municipalities in `data/ontario/permit_checklists/`.
- Geocoding: wire Google Maps Geocoding API via `VITE_GOOGLE_MAPS_API_KEY` (client) or `GOOGLE_MAPS_API_KEY` (server). Keep keys out of source control.
- Sources manifest: add `data/ontario/sources.json` with canonical links (OBC, City of Toronto, Kawartha Lakes, CRA HST guidance, ESA).
- Seed contractors via a verified CSV import process; the SQL schema below provides dimension tables to load these records.

---

Update log: set Ontario pilot (Toronto + Kawartha Lakes), ADU as the first checklist to author, and noted Google Maps integration (placeholder env var). Next: add dimensional SQL schema and sources file.
