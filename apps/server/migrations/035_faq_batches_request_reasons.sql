-- Etappe 27: KI-Stapelübersetzung häufiger Fragen je Sprache (ADR-124) und Begründung zu Übersetzungswünschen (ADR-125)
CREATE TABLE faq_translation_batches (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  language TEXT NOT NULL,
  status TEXT NOT NULL,                 -- queued | processing | completed | cancelled | failed
  total INTEGER NOT NULL DEFAULT 0,
  done INTEGER NOT NULL DEFAULT 0,
  translated INTEGER NOT NULL DEFAULT 0, -- als Entwurf ohne Prüfbefund
  flagged INTEGER NOT NULL DEFAULT 0,    -- als Entwurf mit Prüfbefund
  skipped INTEGER NOT NULL DEFAULT 0,    -- inzwischen aktuell, gelöscht oder mit personenbezogenen Daten
  failed INTEGER NOT NULL DEFAULT 0,
  faq_ids TEXT NOT NULL DEFAULT '[]',    -- beim Start ausgewählte Einträge (fehlend oder veraltet)
  error TEXT,
  cancel_requested INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  finished_at TEXT
);
CREATE INDEX idx_faq_translation_batches_project ON faq_translation_batches (project_id, created_at);
-- je Projekt und Sprache höchstens ein laufender Auftrag
CREATE UNIQUE INDEX uq_faq_translation_batches_active ON faq_translation_batches (project_id, language) WHERE status IN ('queued', 'processing');
-- Begründung (optional) zu einem Übersetzungswunsch
ALTER TABLE translation_requests ADD COLUMN reason TEXT;
