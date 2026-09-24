-- Etappe 6: KI-Umformulierung ganzer Kapitel als Hintergrundjob (ADR-013, Nachtrag).
CREATE TABLE rewrite_batches (
  id TEXT PRIMARY KEY,
  chapter_version_id TEXT NOT NULL REFERENCES generated_chapter_versions(id),
  status TEXT NOT NULL,                 -- queued | processing | completed | cancelled | failed
  instructions TEXT,
  total INTEGER NOT NULL DEFAULT 0,     -- geeignete Absätze
  done INTEGER NOT NULL DEFAULT 0,      -- bearbeitete Absätze
  valid INTEGER NOT NULL DEFAULT 0,     -- gültige Vorschläge
  invalid INTEGER NOT NULL DEFAULT 0,   -- Vorschläge mit nicht bestandener Satzprüfung
  skipped INTEGER NOT NULL DEFAULT 0,   -- nicht übertragbar (z. B. Datenschutz)
  failed INTEGER NOT NULL DEFAULT 0,    -- Anbieterfehler
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  cancel_requested INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  finished_at TEXT
);
CREATE INDEX idx_rewrite_batches_version ON rewrite_batches (chapter_version_id, created_at);

ALTER TABLE rewrite_proposals ADD COLUMN batch_id TEXT;
