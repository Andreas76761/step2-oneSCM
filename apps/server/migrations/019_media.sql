-- Etappe 10b: Bilder & Medien (ADR-029). Inhaltsadressiert je Projekt: gleicher Inhalt = gleiches Objekt,
-- geänderte Screenshots erhalten einen neuen SHA-256 (Versionierung über die Quellrevisionen, die sie referenzieren).
CREATE TABLE media_assets (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  sha256 TEXT NOT NULL,
  mime TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  storage_key TEXT NOT NULL,
  original_name TEXT,
  import_id TEXT REFERENCES imports(id),
  created_at TEXT NOT NULL,
  UNIQUE (project_id, sha256)
);
CREATE INDEX idx_media_assets_project ON media_assets(project_id, created_at);
