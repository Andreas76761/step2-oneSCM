-- Etappe 100 (Wünsche vom 08.11.2026)
-- Regelwerk: Text-Regeln allgemein (chapter_id NULL) oder je Kapitel, geprüft in der Analyse und vor der Freigabe.
CREATE TABLE rulebook_rules (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  chapter_id TEXT REFERENCES chapters(id),  -- NULL = allgemein (jedes Kapitel)
  kind TEXT NOT NULL,                        -- required | forbidden | pattern
  term TEXT NOT NULL,                        -- Begriff bzw. regulärer Ausdruck (pattern)
  message TEXT,                              -- Erklärung für die Redaktion
  severity TEXT NOT NULL,                    -- low | medium | high | blocker (blocker sperrt die Freigabe)
  active INTEGER NOT NULL DEFAULT 1,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT,
  updated_at TEXT
);
CREATE INDEX ix_rulebook_rules_project ON rulebook_rules (project_id);

-- Kapitel „Intern“ und „In Planung“: vorgemerkte Textabschnitte wandern dorthin und fehlen ab der nächsten Version im Handbuch.
-- Herkunft merken (zurück ins Handbuch); die Vormerkung gilt je Datei und Text, damit sie einen erneuten Import überdauert.
ALTER TABLE text_snippets ADD COLUMN parked_from_chapter_id TEXT;
ALTER TABLE text_snippets ADD COLUMN parked_from_subchapter_id TEXT;
CREATE TABLE snippet_parking (
  project_id TEXT NOT NULL REFERENCES projects(id),
  document_id TEXT NOT NULL REFERENCES source_documents(id),
  norm_hash TEXT NOT NULL,
  target TEXT NOT NULL,                      -- intern | planning
  note TEXT,
  parked_by TEXT NOT NULL,
  parked_at TEXT NOT NULL,
  PRIMARY KEY (project_id, document_id, norm_hash)
);
