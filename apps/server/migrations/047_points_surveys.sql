-- Etappe 40: Punktmodell Muss/Soll im Anleitungs-Check (F-08) und Expertenbefragung zu Wissenslücken (F-16), ADR-092
ALTER TABLE projects ADD COLUMN guidance_levels TEXT;                        -- JSON: Abweichungen vom Standard, z. B. { "result": "must" }
ALTER TABLE projects ADD COLUMN guidance_require_must INTEGER NOT NULL DEFAULT 0; -- 1 = alle Muss-Punkte sind Bedingung für Einreichen und Freigabe

CREATE TABLE metadata_surveys (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  audience TEXT,                          -- Zielgruppe als Fachbereich bzw. Rolle (keine Personennamen nötig)
  options TEXT NOT NULL DEFAULT '[]',     -- JSON: Antwortoptionen für alle Fragen, z. B. Ja | Nein | Teilweise | Weiß nicht
  origin TEXT NOT NULL DEFAULT 'manual',  -- manual | catalog | eval
  origin_id TEXT,                         -- Fragenkatalog bzw. Prüflauf
  status TEXT NOT NULL DEFAULT 'open',    -- open | closed
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  closed_at TEXT
);
CREATE TABLE metadata_survey_items (
  id TEXT PRIMARY KEY,
  survey_id TEXT NOT NULL REFERENCES metadata_surveys(id),
  position INTEGER NOT NULL,
  question TEXT NOT NULL,
  context TEXT,                           -- Hintergrund, z. B. „keine Aussage in den Quellen“
  options TEXT,                           -- JSON: eigene Optionen dieser Frage (sonst die der Befragung)
  choice TEXT,                            -- gewählte Option
  answer_text TEXT,                       -- Freitext
  answered_by TEXT,
  answered_at TEXT,
  qa_id TEXT                              -- als Frage & Antwort übernommen (Label „Prüfen“)
);
CREATE INDEX idx_metadata_survey_items_survey ON metadata_survey_items (survey_id, position);
