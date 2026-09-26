-- Etappe 20: eigene Kapitelvorlagen je Projekt (ADR-059) und Herkunft der Rückmeldungen (ADR-061)
CREATE TABLE chapter_templates (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  name TEXT NOT NULL,
  description TEXT,
  title_hint TEXT,
  purpose TEXT NOT NULL DEFAULT '',
  prerequisites TEXT NOT NULL DEFAULT '[]',   -- JSON-Array von Zeilen
  steps TEXT NOT NULL DEFAULT '[]',
  result TEXT NOT NULL DEFAULT '',
  hints TEXT NOT NULL DEFAULT '[]',
  source_version_id TEXT,                     -- Kapitelversion, aus der die Vorlage entstand
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT,
  updated_at TEXT
);
CREATE UNIQUE INDEX uq_chapter_templates_name ON chapter_templates (project_id, name);
-- app = angemeldet (Leseransicht), online-help = anonym aus der öffentlichen Online-Hilfe
ALTER TABLE chapter_feedback ADD COLUMN source TEXT NOT NULL DEFAULT 'app';
