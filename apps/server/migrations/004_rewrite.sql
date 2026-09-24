-- Etappe 5: KI-gestützte Umformulierung mit Quellenbindung je Satz (ADR-013, Entscheidung E-16).

-- Satz-Evidenz eines übernommenen Vorschlags: JSON [{ "text": …, "sourceIds": [snippetId, …] }]
ALTER TABLE content_blocks ADD COLUMN sentence_sources TEXT;

CREATE TABLE rewrite_proposals (
  id TEXT PRIMARY KEY,
  block_id TEXT NOT NULL REFERENCES content_blocks(id),
  block_version_no INTEGER NOT NULL,     -- Blockversion, auf die sich der Vorschlag bezieht (sonst veraltet)
  provider TEXT NOT NULL,                -- anthropic | openai | demo
  model TEXT NOT NULL,
  prompt_hash TEXT NOT NULL,             -- SHA-256 der übertragenen Anfrage (Nachvollziehbarkeit)
  sent_snippet_ids TEXT NOT NULL,        -- JSON: an den KI-Dienst übertragene Textabschnitte
  original_text TEXT NOT NULL,
  sentences TEXT NOT NULL,               -- JSON: Sätze mit Quellen, Abdeckung und Prüfergebnissen
  valid INTEGER NOT NULL,                -- 1 = alle Sätze belegt und geprüft
  raw_response TEXT,
  usage TEXT,                            -- JSON: Token-Verbrauch laut Anbieter
  status TEXT NOT NULL,                  -- proposed | invalid | accepted | rejected | stale
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  decided_by TEXT,
  decided_at TEXT,
  decision_reason TEXT
);
CREATE INDEX idx_rewrite_proposals_block ON rewrite_proposals (block_id, created_at);
