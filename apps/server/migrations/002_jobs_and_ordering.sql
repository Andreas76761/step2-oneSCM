-- Etappe 2: persistente Jobqueue (ADR-008) und stabile Reihenfolge der Importprotokolle
-- (bisher über SQLite-rowid, das es in PostgreSQL nicht gibt).

ALTER TABLE import_items ADD COLUMN position INTEGER NOT NULL DEFAULT 0;

CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,                  -- import | analysis
  payload TEXT NOT NULL,               -- JSON
  status TEXT NOT NULL,                -- queued | running | completed | failed
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  run_after TEXT NOT NULL,
  locked_by TEXT,
  locked_at TEXT,
  error TEXT,
  created_at TEXT NOT NULL,
  finished_at TEXT
);
CREATE INDEX idx_jobs_status ON jobs(status, run_after);
