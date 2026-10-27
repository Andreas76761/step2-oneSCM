-- Etappe 41: Varianten einer Maske (F-22) und Klickstrecke aus Screenshots (F-24), ADR-093
-- Variantengruppe: alle Bilder derselben Maske tragen dieselbe Kennung (Basis-SHA des ersten Bildes der Gruppe)
ALTER TABLE media_meta ADD COLUMN variant_group TEXT;
CREATE INDEX idx_media_meta_variant ON media_meta (project_id, variant_group);

CREATE TABLE media_clickpaths (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  steps TEXT NOT NULL,                    -- JSON: [{ alternatives: [{ sha, caption }] }] – mehrere Alternativen = parallele Schritte 3a/3b
  per_row INTEGER NOT NULL DEFAULT 4,
  base_sha TEXT NOT NULL,                 -- erzeugtes Bild im Archiv (neue Fassung bei jeder Änderung)
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_media_clickpaths_project ON media_clickpaths (project_id, updated_at);
