-- Etappe 3: Freigabeworkflow (US-016) und Terminologieverwaltung (US-015).

-- Kapitelversionen: draft → in_review → approved | (abgelehnt →) draft; superseded
ALTER TABLE generated_chapter_versions ADD COLUMN submitted_by TEXT;
ALTER TABLE generated_chapter_versions ADD COLUMN submitted_at TEXT;
ALTER TABLE generated_chapter_versions ADD COLUMN submit_comment TEXT;

CREATE TABLE terminology_terms (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  preferred TEXT NOT NULL,
  avoid TEXT NOT NULL DEFAULT '[]',     -- JSON-Array zu vermeidender Begriffe
  definition TEXT,
  status TEXT NOT NULL,                 -- active | retired
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (project_id, preferred)
);
