-- Etappe 19: Rückmeldungen aus der Leseransicht (ADR-054) und Anleitungs-Check als Freigabebedingung (ADR-057)
CREATE TABLE chapter_feedback (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  chapter_id TEXT NOT NULL,
  version_id TEXT,
  helpful INTEGER NOT NULL,                -- 1 = hilfreich, 0 = nicht hilfreich
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'open',     -- open | done
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  handled_by TEXT,
  handled_at TEXT
);
CREATE INDEX idx_chapter_feedback ON chapter_feedback (project_id, chapter_id, created_at);
-- Mindestwert des Anleitungs-Checks für Einreichen und Freigabe; NULL = keine Bedingung (nur Anzeige)
ALTER TABLE projects ADD COLUMN guidance_min_score INTEGER;
