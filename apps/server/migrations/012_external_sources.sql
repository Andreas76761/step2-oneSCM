-- Etappe 8: Import aus Fremdsystemen (ADR-022) – umgewandelte Formate und Git-Quellverbindungen.
-- Umgewandelte Revisionen: storage_key zeigt auf das erzeugte Markdown, original_key auf die Originaldatei.
ALTER TABLE source_revisions ADD COLUMN source_format TEXT NOT NULL DEFAULT 'markdown';  -- markdown | html | docx
ALTER TABLE source_revisions ADD COLUMN original_key TEXT;

CREATE TABLE source_connections (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  kind TEXT NOT NULL,                    -- git
  name TEXT NOT NULL,
  url TEXT NOT NULL,                     -- https (ohne Zugangsdaten in der URL)
  branch TEXT,                           -- leer: Standard-Branch
  sub_path TEXT NOT NULL DEFAULT '',     -- nur Dateien unterhalb dieses Ordners
  credential_env TEXT,                   -- Name einer Umgebungsvariable GIT_CREDENTIAL_* mit dem Token (nie in der Datenbank)
  interval_minutes INTEGER NOT NULL DEFAULT 0,  -- 0: nur manuell
  status TEXT NOT NULL,                  -- idle | queued | syncing | failed
  schedule_token TEXT,                   -- nur der zuletzt geplante Folgejob läuft (keine doppelten Ketten)
  next_sync_at TEXT,
  last_sync_at TEXT,
  last_commit TEXT,
  last_import_id TEXT REFERENCES imports(id),
  last_error TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_source_connections_project ON source_connections (project_id, name);
