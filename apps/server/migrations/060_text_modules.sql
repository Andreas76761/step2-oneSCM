-- Etappe 54 (ADR-107, W-11): Textbausteine (Single Sourcing) – ein Absatz, der in mehreren Kapiteln gleich lautet,
-- wird einmal gepflegt; verknüpfte Absätze tragen Baustein und Fassung und werden auf Wunsch in Entwürfen aktualisiert.
CREATE TABLE text_modules (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  module_key TEXT NOT NULL,               -- Kennung, z. B. „hinweis-speichern“
  title TEXT NOT NULL,
  kind TEXT NOT NULL,                     -- Blocktyp wie content_blocks.kind (paragraph, note, warning …)
  current_version INTEGER NOT NULL,
  status TEXT NOT NULL,                   -- active | retired
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (project_id, module_key)
);
CREATE TABLE text_module_versions (
  module_id TEXT NOT NULL REFERENCES text_modules(id),
  version_no INTEGER NOT NULL,
  text TEXT NOT NULL,
  note TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (module_id, version_no)
);
ALTER TABLE content_blocks ADD COLUMN module_id TEXT;
ALTER TABLE content_blocks ADD COLUMN module_version INTEGER;
CREATE INDEX idx_content_blocks_module ON content_blocks (module_id);
