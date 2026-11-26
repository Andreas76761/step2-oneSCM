-- Etappe 39 / M7: Antwortqualität messen – Testfragen mit erwarteten Quellen, Prüfläufe mit Kennzahlen (ADR-091)
CREATE TABLE metadata_eval_sets (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  name TEXT NOT NULL,
  origin TEXT NOT NULL DEFAULT 'manual',  -- manual | file | qa
  file_name TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE metadata_eval_items (
  id TEXT PRIMARY KEY,
  set_id TEXT NOT NULL REFERENCES metadata_eval_sets(id),
  position INTEGER NOT NULL,
  question TEXT NOT NULL,
  expected TEXT NOT NULL DEFAULT '[]',    -- JSON: [{ path, heading }] – erwartete Quelle (Teil des Pfads, optional Überschrift)
  keywords TEXT NOT NULL DEFAULT '[]',    -- JSON: Stichworte, die in der Antwort stehen sollen
  expect_no_answer INTEGER NOT NULL DEFAULT 0, -- 1 = Lückenfrage: richtig ist „keine Aussage in den Quellen“
  note TEXT,
  qa_id TEXT                              -- übernommen aus gespeicherter Frage & Antwort
);
CREATE INDEX idx_metadata_eval_items_set ON metadata_eval_items (set_id, position);
CREATE TABLE metadata_eval_runs (
  id TEXT PRIMARY KEY,
  set_id TEXT NOT NULL REFERENCES metadata_eval_sets(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  duration_ms INTEGER NOT NULL DEFAULT 0,
  config TEXT NOT NULL,                   -- JSON: Suchparameter, Embedding-Modell, KI-Dienst, Bestand
  metrics TEXT NOT NULL                   -- JSON: Kennzahlen des Laufs
);
CREATE INDEX idx_metadata_eval_runs_set ON metadata_eval_runs (set_id, created_at);
CREATE TABLE metadata_eval_results (
  id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES metadata_eval_runs(id),
  item_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  question TEXT NOT NULL,
  rank INTEGER,                           -- Rang der ersten erwarteten Quelle unter den gefundenen Stellen (1–6), sonst NULL
  cited INTEGER NOT NULL DEFAULT 0,       -- Antwort belegt mit einer erwarteten Quelle
  answered INTEGER NOT NULL DEFAULT 0,
  keyword_hits INTEGER NOT NULL DEFAULT 0,
  keyword_total INTEGER NOT NULL DEFAULT 0,
  passed INTEGER NOT NULL DEFAULT 0,
  mode TEXT,
  answer_text TEXT,
  notice TEXT,
  retrieved TEXT NOT NULL DEFAULT '[]',   -- JSON: gefundene Stellen in Rangfolge
  ms INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_metadata_eval_results_run ON metadata_eval_results (run_id, position);
