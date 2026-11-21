-- Etappe 32: Wissensnotizen als eigene Quelle (F-15) und Zielkapitel je Dopplung (F-18), ADR-084
CREATE TABLE knowledge_notes (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  question TEXT NOT NULL,                 -- Frage bzw. Titel der Notiz
  insight TEXT NOT NULL,                  -- Erkenntnis (Markdown)
  roles TEXT NOT NULL DEFAULT '[]',       -- JSON: Rollen der Front-Matter
  divisions TEXT NOT NULL DEFAULT '[]',   -- JSON: Sparten der Front-Matter
  confirmed INTEGER NOT NULL DEFAULT 0,   -- 1 = fachlich bestätigt (evidence_status source_confirmed)
  image_name TEXT,                        -- Dateiname des Screenshots in der Quelle
  image_alt TEXT,                         -- Pflicht-Alternativtext (ADR-029)
  document_path TEXT NOT NULL,            -- wissensnotizen/<id>.md
  status TEXT NOT NULL,                   -- active | removed
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_knowledge_notes_project ON knowledge_notes (project_id, created_at);

CREATE TABLE duplicate_targets (
  finding_id TEXT PRIMARY KEY REFERENCES quality_findings(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  outline_label_id TEXT NOT NULL REFERENCES metadata_labels(id),
  note TEXT,
  decided_by TEXT NOT NULL,
  decided_at TEXT NOT NULL
);
CREATE INDEX idx_duplicate_targets_project ON duplicate_targets (project_id);
