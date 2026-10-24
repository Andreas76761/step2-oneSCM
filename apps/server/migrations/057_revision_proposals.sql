-- Etappe 51 (ADR-104): Änderungsvorschläge aus der Word-Prüffassung (W-06) und dem KI-Lektorat (G-07) mit internem
-- Kommentar (W-08); Übernahme in einen Entwurf des Kapitels.
CREATE TABLE revision_batches (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  origin TEXT NOT NULL,                   -- word | ai
  file_name TEXT,                         -- zurückgelesene Word-Datei
  export_id TEXT,                         -- Prüffassung, aus der die Datei stammt
  stats TEXT NOT NULL DEFAULT '{}',       -- JSON: Kapitel, Vorschläge, nicht zugeordnete Kapitel, Kriterien
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_revision_batches_project ON revision_batches (project_id, created_at);

CREATE TABLE revision_proposals (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  batch_id TEXT NOT NULL REFERENCES revision_batches(id),
  chapter_id TEXT NOT NULL REFERENCES chapters(id),
  chapter_version_id TEXT NOT NULL,       -- Version, gegen die verglichen wurde
  lineage_id TEXT,                        -- Absatz (stabil über Versionen); bei „added“ der Absatz davor
  section_code TEXT NOT NULL,
  change TEXT NOT NULL,                   -- changed | added | removed
  original_text TEXT,
  proposed_text TEXT,
  criterion TEXT,                         -- „Fertig, wenn …“ der Prüffassung
  status TEXT NOT NULL,                   -- open | accepted | rejected | stale
  internal_comment TEXT,                  -- nie im Export (W-08)
  applied_version_id TEXT,                -- Entwurf, in den übernommen wurde
  decided_by TEXT,
  decided_at TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_revision_proposals_batch ON revision_proposals (batch_id, status);
CREATE INDEX idx_revision_proposals_chapter ON revision_proposals (chapter_id, status);
