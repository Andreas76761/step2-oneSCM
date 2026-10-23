-- Etappe 37: Fragenkatalog (Rückfragen) einlesen und mit Belegen beantworten (ADR-089)
CREATE TABLE metadata_question_sets (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  name TEXT NOT NULL,
  file_name TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  answered_at TEXT
);
CREATE TABLE metadata_question_items (
  id TEXT PRIMARY KEY,
  set_id TEXT NOT NULL REFERENCES metadata_question_sets(id),
  position INTEGER NOT NULL,
  chapter TEXT,
  question TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',    -- open | answered | no_answer | blocked
  mode TEXT,                              -- llm | extractive | none
  answer TEXT,                            -- JSON: [{ text, sources: [n] }]
  answer_text TEXT,
  sources TEXT,                           -- JSON: Belege
  notice TEXT,
  ask_id TEXT,
  qa_id TEXT,
  asked_at TEXT
);
CREATE INDEX idx_metadata_question_items_set ON metadata_question_items (set_id, position);
