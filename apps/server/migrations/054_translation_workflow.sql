-- Etappe 48: Übersetzung (U-01 … U-10, ADR-101) – Übersetzungsspeicher, Länderreview mit MQM, Rückübersetzung,
-- XLIFF/Excel, Releaseletter DE↔EN

-- Übersetzungsspeicher (Translation Memory): freigegebene Segmente je Sprachpaar; 100 % über den normalisierten Quelltext
CREATE TABLE translation_memory (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  source_lang TEXT NOT NULL,
  target_lang TEXT NOT NULL,
  source_text TEXT NOT NULL,
  source_norm TEXT NOT NULL,
  target_text TEXT NOT NULL,
  origin TEXT NOT NULL,                   -- translation | release_letter | import | xliff | manual
  origin_ref TEXT,                        -- Datei bzw. Kapitel („Datei“ in SPEICHER.csv)
  origin_version TEXT,                    -- Ausgangsversion (z. B. Kapitelversion 3)
  status TEXT NOT NULL DEFAULT 'approved',-- approved | review (importiert, noch nicht bestätigt)
  uses INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_used_at TEXT
);
CREATE UNIQUE INDEX idx_tm_segment ON translation_memory (project_id, source_lang, target_lang, source_norm);
CREATE INDEX idx_tm_pair ON translation_memory (project_id, target_lang);

-- Herkunft eines Speichertreffers am Absatz (mode memory = 100 %, sonst Vorschlag)
ALTER TABLE translation_blocks ADD COLUMN tm_id TEXT;
ALTER TABLE translation_blocks ADD COLUMN tm_score REAL;

-- Länderreview je Übersetzung: Prüferin bzw. Prüfer je Sprache und Markt, MQM-Fehler, zurück an Übersetzung, Freigabe durch das Land
CREATE TABLE translation_reviews (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  translation_id TEXT NOT NULL REFERENCES translations(id),
  reviewer TEXT NOT NULL,                 -- Benutzer-ID
  market TEXT,                            -- Ländercode, z. B. CH
  status TEXT NOT NULL,                   -- open | returned | approved | dropped
  errors TEXT NOT NULL DEFAULT '[]',      -- JSON: [{ id, blockId, category, severity, note, by, at }]
  words INTEGER NOT NULL DEFAULT 0,
  comment TEXT,
  requested_by TEXT NOT NULL,
  requested_at TEXT NOT NULL,
  decided_by TEXT,
  decided_at TEXT
);
CREATE INDEX idx_translation_reviews ON translation_reviews (translation_id, status);

-- Rückübersetzung von Sicherheitshinweisen als Stichprobe (U-06)
CREATE TABLE translation_backchecks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  translation_id TEXT NOT NULL REFERENCES translations(id),
  sample TEXT NOT NULL,                   -- JSON: [{ blockId, source, text, back, similarity, ok }]
  candidates INTEGER NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_translation_backchecks ON translation_backchecks (translation_id, created_at);

-- Releaseletter DE↔EN (U-09): Übersetzung verweist auf den Ausgangsletter, Prüfbefunde je Segment
ALTER TABLE release_letters ADD COLUMN translation_of TEXT;
ALTER TABLE release_letters ADD COLUMN translation_issues TEXT;
