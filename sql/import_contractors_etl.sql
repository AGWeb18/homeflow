-- ETL script to import contractor records from `staged_contractors` into `contractors` (app table) and `dim_contractor` (analytics)
-- Run this in Supabase SQL Editor after `staged_contractors` has rows with `raw_record` JSONB.
-- Note: Ensure `pgcrypto` extension is enabled.

BEGIN;

-- Example: promote a single staged row to contractors + dim_contractor
-- This query finds staged rows with status = 'pending' and attempts to insert them.
-- Adjust validations as needed for your workflow.

WITH pending AS (
  SELECT id, raw_record
  FROM staged_contractors
  WHERE status = 'pending'
  LIMIT 100
), parsed AS (
  SELECT
    id,
    raw_record->> 'business_name' AS business_name,
    raw_record->> 'contact_name' AS contact_name,
    raw_record->> 'phone' AS phone,
    raw_record->> 'email' AS email,
    raw_record->> 'website' AS website,
    raw_record->> 'province_code' AS province_code,
    (raw_record->> 'municipalities_served')::text[] AS municipalities_served,
    (raw_record->> 'trades')::text[] AS trades,
    raw_record-> 'license_numbers' AS license_numbers,
    (raw_record->> 'insured')::boolean AS insured
  FROM pending
)
-- Insert into app contractors table and return generated id
, inserted_contractors AS (
  INSERT INTO contractors (id, created_at, name, role, rating, reviews, image, verified, specialist, licensed)
  SELECT gen_random_uuid(), timezone('utc'::text, now()), business_name, 'contractor', 0, 0, NULL, false, false, false
  FROM parsed
  RETURNING id, name
)
-- Map inserted app contractor IDs back to parsed rows by name (assumes name uniqueness in this import batch)
, to_dim AS (
  SELECT p.*, c.id AS app_contractor_id
  FROM parsed p
  JOIN inserted_contractors c ON c.name = p.business_name
)
-- Insert analytics dim_contractor rows linked to app contractor id
INSERT INTO dim_contractor (contractor_id, contractor_uuid, business_name, contact_name, phone, email, website, province_code, municipalities_served, trades, license_numbers, insured, verified, created_at)
SELECT gen_random_uuid(), app_contractor_id, business_name, contact_name, phone, email, website, province_code, municipalities_served, trades, license_numbers, insured, false, timezone('utc'::text, now())
FROM to_dim;

-- Mark staged records as imported
UPDATE staged_contractors
SET status = 'imported', notes = 'Promoted by import_contractors_etl.sql', imported_at = timezone('utc'::text, now())
WHERE status = 'pending';

COMMIT;

-- Important notes:
-- 1) This ETL is a simple example. In production you should validate emails/phones, deduplicate by business_name or license_numbers,
--    check for required fields, and handle failures per-row.
-- 2) If you run COPY / \\copy to load `staged_contractors`, load each CSV row as JSONB into `raw_record`, e.g.:
--    INSERT INTO staged_contractors (raw_record) VALUES (jsonb_build_object('business_name','Acme','email','a@b.c', ...));
-- 3) The script inserts minimal fields into the `contractors` app table. Expand columns as needed for your schema.
