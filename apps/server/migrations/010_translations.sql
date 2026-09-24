-- Etappe 7: Mehrsprachigkeit (ADR-020). Übersetzungen freigegebener deutscher Kapitelversionen je Zielsprache.
ALTER TABLE projects ADD COLUMN languages TEXT NOT NULL DEFAULT '[]';   -- JSON: Zielsprachen, z. B. ["en","fr"]

CREATE TABLE translations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  chapter_id TEXT NOT NULL REFERENCES chapters(id),
  chapter_version_id TEXT NOT NULL REFERENCES generated_chapter_versions(id),  -- freigegebene deutsche Quelle
  language TEXT NOT NULL,
  title TEXT,                           -- übersetzter Kapiteltitel
  status TEXT NOT NULL,                 -- draft | approved
  job_status TEXT,                      -- queued | processing | completed | failed (KI-Übersetzung)
  job_error TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  approved_by TEXT,
  approved_at TEXT,
  approval_comment TEXT,
  UNIQUE (chapter_version_id, language)
);

CREATE TABLE translation_blocks (
  id TEXT PRIMARY KEY,
  translation_id TEXT NOT NULL REFERENCES translations(id),
  block_id TEXT NOT NULL REFERENCES content_blocks(id),
  source_text TEXT NOT NULL,
  text TEXT,                            -- NULL = noch nicht übersetzt
  sentences TEXT,                       -- JSON: [{ text, sources: [Index deutscher Satz] }] bei KI-Übersetzung
  issues TEXT NOT NULL DEFAULT '[]',    -- JSON: Prüfergebnisse
  mode TEXT NOT NULL,                   -- pending | machine | edited
  provider TEXT,
  model TEXT,
  updated_by TEXT,
  updated_at TEXT,
  UNIQUE (translation_id, block_id)
);
