-- Etappe 9: Handbuch-Assistent (ADR-026)
-- Vektoren freigegebener Passagen je Text-Hash und Modell (unabhängig von Blöcken wiederverwendbar)
CREATE TABLE passage_embeddings (
  text_hash TEXT NOT NULL,
  model TEXT NOT NULL,
  vector TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (text_hash, model)
);
-- Fragen, Antworten und Bewertungen (Wissenslücken für die Redaktion)
CREATE TABLE assistant_log (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  user_id TEXT NOT NULL,
  question TEXT NOT NULL,
  language TEXT NOT NULL,
  role_code TEXT,
  division_code TEXT,
  mode TEXT NOT NULL,                    -- llm | extractive | none
  answer TEXT NOT NULL,                  -- JSON: Sätze mit Quellen
  source_blocks TEXT NOT NULL DEFAULT '[]',
  answered INTEGER NOT NULL,             -- 0: keine passende Aussage im freigegebenen Handbuch
  provider TEXT,
  model TEXT,
  rating INTEGER,                        -- 1 hilfreich | -1 nicht hilfreich
  feedback TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_assistant_log_project ON assistant_log (project_id, created_at);
