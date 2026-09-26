-- Etappe 18: Stilregel-Bibliotheken (ADR-050) – gemeinsame Formulierungsregeln, die Projekte abonnieren
CREATE TABLE style_libraries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  phrases TEXT NOT NULL DEFAULT '[]',      -- JSON-Array {avoid, use, note} wie bei den Projektregeln
  created_by TEXT,
  created_at TEXT NOT NULL,
  updated_by TEXT,
  updated_at TEXT
);
-- Abonnements: Reihenfolge bestimmt bei gleichen Formulierungen den Vorrang (Projektregeln gehen immer vor)
CREATE TABLE project_style_libraries (
  project_id TEXT NOT NULL REFERENCES projects(id),
  library_id TEXT NOT NULL REFERENCES style_libraries(id),
  position INTEGER NOT NULL,
  subscribed_by TEXT,
  subscribed_at TEXT NOT NULL,
  PRIMARY KEY (project_id, library_id)
);
