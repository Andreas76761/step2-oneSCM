-- Etappe 27 / M1: oneSCM_Metadaten (ADR-079) – Fundstelle je Chunk, vordefinierte Labels, gespeicherte Fragen und Antworten
-- Fundstelle über die Zeilen hinaus (JSON): {"page": 3} | {"slide": 7} | {"time": "02:15"} | {"anchor": "abschnitt-2"}; NULL = nur Zeilen
ALTER TABLE text_snippets ADD COLUMN locator TEXT;

CREATE TABLE metadata_labels (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  code TEXT NOT NULL,                   -- stabil, z. B. outline.11-contract-create, role.dealer, nav.contracts.new
  label_group TEXT NOT NULL,            -- outline | role | navigation | content | division | quality
  name_de TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL,
  origin TEXT NOT NULL,                 -- catalog | custom
  archived_at TEXT,                     -- ausgeblendet: nicht mehr zuweisbar, bestehende Zuordnungen bleiben
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (project_id, code)
);
CREATE INDEX idx_metadata_labels_group ON metadata_labels (project_id, label_group, position);

CREATE TABLE metadata_chunk_labels (
  snippet_id TEXT NOT NULL REFERENCES text_snippets(id),
  label_id TEXT NOT NULL REFERENCES metadata_labels(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  assigned_by TEXT NOT NULL,
  assigned_at TEXT NOT NULL,
  PRIMARY KEY (snippet_id, label_id)
);
CREATE INDEX idx_metadata_chunk_labels_label ON metadata_chunk_labels (project_id, label_id);

CREATE TABLE metadata_qa (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  language TEXT NOT NULL,               -- de | en
  sources TEXT NOT NULL DEFAULT '[]',   -- [{snippetId, path, headingPath, locator, excerpt}] – Stand beim Speichern
  note TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_metadata_qa_project ON metadata_qa (project_id, created_at);

CREATE TABLE metadata_qa_labels (
  qa_id TEXT NOT NULL REFERENCES metadata_qa(id),
  label_id TEXT NOT NULL REFERENCES metadata_labels(id),
  PRIMARY KEY (qa_id, label_id)
);
CREATE INDEX idx_metadata_qa_labels_label ON metadata_qa_labels (label_id);
