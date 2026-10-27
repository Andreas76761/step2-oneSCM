-- Etappe 33: Bildarchiv – Merkmale, feste Bildnummer, Platzhalter und Versionen je Bild (ADR-085, F-20, F-21)
CREATE TABLE media_meta (
  project_id TEXT NOT NULL REFERENCES projects(id),
  base_sha TEXT NOT NULL,                 -- erste Fassung = Identität des Bildes
  image_no INTEGER NOT NULL,              -- feste Bildnummer je Projekt (B-0001 …), auch für Platzhalter reserviert
  language TEXT,                          -- de | en | … (Sprache der Oberfläche im Bild)
  roles TEXT NOT NULL DEFAULT '[]',       -- JSON: dealer, market, mo, hq, all
  divisions TEXT NOT NULL DEFAULT '[]',   -- JSON: car, van, all
  markets TEXT NOT NULL DEFAULT '[]',     -- JSON: Ländercodes
  release TEXT,                           -- Release bzw. Version der Oberfläche
  nav_label_id TEXT REFERENCES metadata_labels(id),  -- Reiter/Menüpunkt (Navigations-Label)
  placeholder INTEGER NOT NULL DEFAULT 0, -- 1 = Platzhalterbild, wartet auf die echte Fassung
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (project_id, base_sha),
  UNIQUE (project_id, image_no)
);

CREATE TABLE media_versions (
  project_id TEXT NOT NULL REFERENCES projects(id),
  sha TEXT NOT NULL,                      -- Fassung (media_assets.sha256)
  base_sha TEXT NOT NULL,                 -- erste Fassung
  version_no INTEGER NOT NULL,            -- 1 = Original
  note TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (project_id, sha),
  UNIQUE (project_id, base_sha, version_no)
);
CREATE INDEX idx_media_versions_base ON media_versions (project_id, base_sha);

-- Übergang „weiter zu Kapitel …“ (ADR-085, F-29): je Kapitel ein redaktioneller Übergangstext und optional ein anderes Folgekapitel
CREATE TABLE chapter_transitions (
  chapter_id TEXT PRIMARY KEY REFERENCES chapters(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  next_chapter_id TEXT REFERENCES chapters(id),   -- NULL = nächstes Kapitel der Reihenfolge
  text TEXT,                                      -- z. B. „Nach dem Anlegen prüft MO den Antrag.“
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_chapter_transitions_project ON chapter_transitions (project_id);
