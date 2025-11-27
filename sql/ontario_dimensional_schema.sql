-- Ontario dimensional schema for HomeFlow (Postgres)
-- Dimensions and a fact table to map project types to required permits per municipality.

-- Enable extension for UUID generation if not already present
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Dimension: municipalities
CREATE TABLE IF NOT EXISTS dim_municipality (
  municipality_id SERIAL PRIMARY KEY,
  province_code TEXT NOT NULL,
  municipality_key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  canonical_url TEXT,
  open_data_url TEXT,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Dimension: project types
CREATE TABLE IF NOT EXISTS dim_project_type (
  project_type_id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Dimension: permits
CREATE TABLE IF NOT EXISTS dim_permit (
  permit_id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  issuing_authority TEXT,
  canonical_url TEXT,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Dimension: tax rates (provincial)
CREATE TABLE IF NOT EXISTS dim_tax_rate (
  tax_rate_id SERIAL PRIMARY KEY,
  province_code TEXT NOT NULL,
  tax_name TEXT NOT NULL,
  rate NUMERIC(6,4) NOT NULL,
  effective_from date DEFAULT '2020-01-01',
  notes TEXT,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Dimension: sources (data provenance)
CREATE TABLE IF NOT EXISTS dim_source (
  source_id SERIAL PRIMARY KEY,
  source_key TEXT NOT NULL UNIQUE,
  name TEXT,
  url TEXT,
  last_verified date,
  notes TEXT
);

-- Dimension: contractors (sparse, recommended to populate via CSV import)
-- Dimension: contractors
-- Use UUIDs to align with Supabase `contractors.id` (uuid) and allow optional linking.
CREATE TABLE IF NOT EXISTS dim_contractor (
  contractor_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_uuid uuid REFERENCES contractors(id),
  business_name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  province_code TEXT,
  municipalities_served TEXT[],
  trades TEXT[],
  license_numbers JSONB,
  insured BOOL DEFAULT FALSE,
  verified BOOL DEFAULT FALSE,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Staged import table for contractor CSV/ETL operations
CREATE TABLE IF NOT EXISTS staged_contractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  imported_at timestamptz DEFAULT timezone('utc'::text, now()),
  raw_record JSONB,
  status TEXT DEFAULT 'pending',
  notes TEXT
);

-- Fact: which permits apply to which project types in which municipality
CREATE TABLE IF NOT EXISTS fact_project_permit_requirement (
  requirement_id SERIAL PRIMARY KEY,
  project_type_id INT REFERENCES dim_project_type(project_type_id) ON DELETE CASCADE,
  municipality_id INT REFERENCES dim_municipality(municipality_id) ON DELETE CASCADE,
  permit_id INT REFERENCES dim_permit(permit_id) ON DELETE CASCADE,
  required BOOLEAN DEFAULT TRUE,
  typical_timeline_days INT,
  docs_required TEXT,
  condition TEXT,
  source_id INT REFERENCES dim_source(source_id),
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- =========================
-- Sample seed inserts (initial, authoritative values)
-- =========================

-- Municipalities (Toronto + Kawartha Lakes)
INSERT INTO dim_municipality (province_code, municipality_key, name, canonical_url, open_data_url)
VALUES
('ON', 'toronto', 'City of Toronto', 'https://www.toronto.ca', 'https://open.toronto.ca/'),
('ON', 'kawartha_lakes', 'City of Kawartha Lakes', 'https://www.kawarthalakes.ca', 'https://www.kawarthalakes.ca/en/doing-business/open-data.aspx')
ON CONFLICT (municipality_key) DO NOTHING;

-- Project types (ADU)
INSERT INTO dim_project_type (key, name, description)
VALUES
('adu', 'Accessory Dwelling Unit (ADU)', 'Secondary/supplemental dwelling unit such as basement apartment, laneway suite, or garden suite')
ON CONFLICT (key) DO NOTHING;

-- Permits
INSERT INTO dim_permit (key, name, category, issuing_authority, canonical_url)
VALUES
('building_permit', 'Building Permit', 'Building', 'Municipal Building Department', 'https://www.ontario.ca/page/permits-building'),
('electrical_permit', 'Electrical Permit', 'Electrical', 'Electrical Safety Authority (ESA)', 'https://www.esasafe.com/permit-information'),
('plumbing_permit', 'Plumbing Permit', 'Plumbing', 'Municipal Plumbing/Building Department', NULL),
('zoning_clearance', 'Zoning Clearance / Zoning Review', 'Zoning', 'Municipal Planning Department', NULL),
('heritage_review', 'Heritage Review / Heritage Permit', 'Heritage', 'Municipal Heritage / Conservation', NULL)
ON CONFLICT (key) DO NOTHING;

-- Tax: Ontario HST 13%
INSERT INTO dim_tax_rate (province_code, tax_name, rate, notes)
VALUES
('ON', 'HST', 0.13, 'Ontario HST (13%)')
ON CONFLICT DO NOTHING;

-- Source manifest entries (reference dim_source for provenance linking)
INSERT INTO dim_source (source_key, name, url, last_verified, notes)
VALUES
('obc', 'Ontario Building Code', 'https://www.ontario.ca/document/ontario-building-code', now(), 'OBC reference for building triggers'),
('toronto_permits', 'City of Toronto Permits', 'https://www.toronto.ca/services-payments/building-construction/', now(), 'City-specific permit guides and checklists'),
('toronto_open_data', 'Toronto Open Data', 'https://open.toronto.ca/', now(), 'Parcel, zoning, and permit record datasets'),
('kawartha_permits', 'City of Kawartha Lakes - Permits', 'https://www.kawarthalakes.ca/en/doing-business/permits.aspx', now(), 'Local permit guidance and planning pages'),
('cra_gst_hst', 'Canada Revenue Agency - GST/HST', 'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst.html', now(), 'Tax guidance for estimator')
ON CONFLICT (source_key) DO NOTHING;

-- Map ADU -> required permits for Toronto (initial, conservative mapping)
-- We resolve IDs via subqueries to avoid hardcoding serial IDs.

INSERT INTO fact_project_permit_requirement (project_type_id, municipality_id, permit_id, required, typical_timeline_days, docs_required, condition, source_id)
SELECT pt.project_type_id, m.municipality_id, p.permit_id, true, 20, 'Site plan, floor plans, elevations', 'If creating a new separate dwelling or changing occupancy', s.source_id
FROM dim_project_type pt, dim_municipality m, dim_permit p, dim_source s
WHERE pt.key='adu' AND m.municipality_key='toronto' AND p.key='building_permit' AND s.source_key='toronto_permits'
ON CONFLICT DO NOTHING;

INSERT INTO fact_project_permit_requirement (project_type_id, municipality_id, permit_id, required, typical_timeline_days, docs_required, condition, source_id)
SELECT pt.project_type_id, m.municipality_id, p.permit_id, true, 7, 'Electrical scope, licensed electrician info', 'When new electrical service or significant changes are required', s.source_id
FROM dim_project_type pt, dim_municipality m, dim_permit p, dim_source s
WHERE pt.key='adu' AND m.municipality_key='toronto' AND p.key='electrical_permit' AND s.source_key='toronto_permits'
ON CONFLICT DO NOTHING;

INSERT INTO fact_project_permit_requirement (project_type_id, municipality_id, permit_id, required, typical_timeline_days, docs_required, condition, source_id)
SELECT pt.project_type_id, m.municipality_id, p.permit_id, false, 7, 'Plumbing drawings if new plumbing fixtures added', 'Required if new plumbing fixtures or drainage changes', s.source_id
FROM dim_project_type pt, dim_municipality m, dim_permit p, dim_source s
WHERE pt.key='adu' AND m.municipality_key='toronto' AND p.key='plumbing_permit' AND s.source_key='toronto_permits'
ON CONFLICT DO NOTHING;

-- Map ADU -> required permits for Kawartha Lakes (initial mapping)
INSERT INTO fact_project_permit_requirement (project_type_id, municipality_id, permit_id, required, typical_timeline_days, docs_required, condition, source_id)
SELECT pt.project_type_id, m.municipality_id, p.permit_id, true, 14, 'Site plan, septic info if applicable', 'If adding a unit with new plumbing or on-site systems', s.source_id
FROM dim_project_type pt, dim_municipality m, dim_permit p, dim_source s
WHERE pt.key='adu' AND m.municipality_key='kawartha_lakes' AND p.key='building_permit' AND s.source_key='kawartha_permits'
ON CONFLICT DO NOTHING;

INSERT INTO fact_project_permit_requirement (project_type_id, municipality_id, permit_id, required, typical_timeline_days, docs_required, condition, source_id)
SELECT pt.project_type_id, m.municipality_id, p.permit_id, true, 7, 'Electrical scope, licensed electrician info', 'When new electrical service or significant changes are required', s.source_id
FROM dim_project_type pt, dim_municipality m, dim_permit p, dim_source s
WHERE pt.key='adu' AND m.municipality_key='kawartha_lakes' AND p.key='electrical_permit' AND s.source_key='kawartha_permits'
ON CONFLICT DO NOTHING;

-- Note: Contractor dimension is intentionally left for CSV import/ETL where you can perform verification steps.
-- Use a staged table and ETL to populate `dim_contractor`.

-- End of SQL file
