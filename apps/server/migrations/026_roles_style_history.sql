-- Etappe 17: Rollenvorlagen (ADR-047) und Stilwert-Verlauf (ADR-048)
CREATE TABLE role_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions TEXT NOT NULL,               -- JSON-Array technischer Berechtigungen
  builtin INTEGER NOT NULL DEFAULT 0,      -- mitgelieferte Vorlage (nicht löschbar)
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT
);
ALTER TABLE users ADD COLUMN role_template_id TEXT;   -- Berechtigungen folgen der Vorlage, bis sie einzeln geändert werden

-- Stilwert je Kapitel über die Zeit: neuer Eintrag, sobald sich Wert oder Version ändert
CREATE TABLE style_scores (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  chapter_id TEXT NOT NULL,
  version_id TEXT NOT NULL,
  version_no INTEGER NOT NULL,
  score INTEGER NOT NULL,
  sentences INTEGER NOT NULL,
  problem_sentences INTEGER NOT NULL,
  recorded_at TEXT NOT NULL
);
CREATE INDEX idx_style_scores ON style_scores (project_id, chapter_id, recorded_at);
