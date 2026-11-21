-- Etappe 36 / M4: Dubletten über alle Formate je Abschnitt (ADR-088)
-- Abschnitt = aufeinanderfolgende Chunks einer Datei unter derselben Überschrift (bei PowerPoint: Folie).
-- Wird nur für geänderte Dateien neu berechnet.
CREATE TABLE metadata_sections (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  document_id TEXT NOT NULL REFERENCES source_documents(id),
  revision_id TEXT NOT NULL REFERENCES source_revisions(id),
  position INTEGER NOT NULL,
  title TEXT NOT NULL,
  heading_path TEXT NOT NULL DEFAULT '[]', -- JSON
  locator TEXT,                            -- JSON: Fundstelle des ersten Chunks
  format TEXT NOT NULL,
  chunk_ids TEXT NOT NULL DEFAULT '[]',    -- JSON
  text TEXT NOT NULL,                      -- normalisiert: ohne Aufzählungszeichen, Formatierung, Bilder
  norm_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_metadata_sections_doc ON metadata_sections (project_id, document_id);
CREATE INDEX idx_metadata_sections_hash ON metadata_sections (project_id, norm_hash);

CREATE TABLE metadata_duplicates (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  a_section_id TEXT NOT NULL REFERENCES metadata_sections(id),
  b_section_id TEXT NOT NULL REFERENCES metadata_sections(id),
  score REAL NOT NULL,
  kind TEXT NOT NULL,                      -- exact | near
  cross_format INTEGER NOT NULL DEFAULT 0,
  shared TEXT NOT NULL DEFAULT '[]',       -- JSON: gemeinsame Begriffe
  created_at TEXT NOT NULL,
  UNIQUE (project_id, a_section_id, b_section_id)
);
CREATE INDEX idx_metadata_duplicates_project ON metadata_duplicates (project_id);

-- Entscheidung je Inhaltspaar (normalisierte Hashes, sortiert; bei exakt gleichen Abschnitten „Hash@Pfad“) – bleibt bei erneutem Einlesen erhalten
CREATE TABLE metadata_duplicate_decisions (
  project_id TEXT NOT NULL REFERENCES projects(id),
  hash_a TEXT NOT NULL,
  hash_b TEXT NOT NULL,
  decision TEXT NOT NULL,                  -- leading | not_duplicate
  leading_hash TEXT,                       -- bei „leading“: Schlüssel der führenden Fassung
  note TEXT,
  decided_by TEXT NOT NULL,
  decided_at TEXT NOT NULL,
  PRIMARY KEY (project_id, hash_a, hash_b)
);
