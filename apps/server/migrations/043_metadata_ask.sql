-- Etappe 37 / M5: Fragen über alle Quellen mit Belegen (ADR-089)
CREATE TABLE metadata_ask_log (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  user_id TEXT NOT NULL,
  question TEXT NOT NULL,
  filters TEXT NOT NULL DEFAULT '{}',     -- JSON: format, documentId, heading, labelIds
  mode TEXT NOT NULL,                     -- llm | extractive | none
  answer TEXT NOT NULL DEFAULT '[]',      -- JSON: [{ text, sources: [n] }]
  sources TEXT NOT NULL DEFAULT '[]',     -- JSON: [{ n, snippetId, part, path, … }]
  provider TEXT,
  model TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_metadata_ask_log_project ON metadata_ask_log (project_id, created_at);

-- gespeicherte Fragen: Filter und Antwortart der Frage, damit „erneut fragen“ denselben Rahmen nutzt
ALTER TABLE metadata_qa ADD COLUMN filters TEXT;
ALTER TABLE metadata_qa ADD COLUMN ask_id TEXT;
