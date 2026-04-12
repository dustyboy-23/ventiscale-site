-- Add 'ads' to the valid report types for client_reports.type
ALTER TABLE client_reports
  DROP CONSTRAINT IF EXISTS client_reports_type_check;

ALTER TABLE client_reports
  ADD CONSTRAINT client_reports_type_check
  CHECK (type IN ('client', 'seo', 'baseline', 'internal', 'ads'));
