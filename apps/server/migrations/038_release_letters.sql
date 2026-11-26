-- Etappe 31: Releaseletter aus Jira-Tickets (ADR-083, F-02)
CREATE TABLE release_letters (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  release_label TEXT NOT NULL,            -- Lösungsversion der Tickets oder „PI TBD“
  ticket_keys TEXT NOT NULL,              -- JSON-Array: Umfang des Letters
  language TEXT NOT NULL,                 -- de | en
  audience TEXT NOT NULL,                 -- mgmt | biz | it | end
  country TEXT NOT NULL,
  division TEXT NOT NULL,                 -- car | van | all
  origin TEXT NOT NULL,                   -- generated (aus Tickets erzeugt) | external (eingefügt, z. B. aus Dify)
  text TEXT NOT NULL,                     -- Markdown
  status TEXT NOT NULL,                   -- draft | approved
  verdict TEXT,                           -- block | cond | ok (letzte Prüfung)
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  approved_by TEXT,
  approved_at TEXT
);
CREATE INDEX idx_release_letters_project ON release_letters (project_id, created_at);
