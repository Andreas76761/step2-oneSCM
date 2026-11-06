-- Etappe 42: Datenschutz im Bild (Unkenntlichmachen von Namen, User-IDs, Adressen, FIN …) und mehrere Labels und
-- Kapitel je Bild, ADR-095
-- Unkenntlichmachung je Fassung: das Original bleibt unverändert, ausgeliefert wird bei enabled = 1 die verpixelte Kopie
CREATE TABLE media_redactions (
  project_id TEXT NOT NULL REFERENCES projects(id),
  sha TEXT NOT NULL,                      -- genau diese Fassung (Original)
  regions TEXT NOT NULL DEFAULT '[]',     -- JSON: [{ id, x, y, w, h (relativ 0–1), kind, label (maskiert), source: ocr | manual, active }]
  enabled INTEGER NOT NULL DEFAULT 1,     -- 1 = unkenntlich ausliefern, 0 = rückgängig (Original wird gezeigt)
  redacted_sha TEXT,                      -- verpixelte Kopie (nur bei enabled und mindestens einer aktiven Stelle)
  ocr_status TEXT NOT NULL DEFAULT 'none',-- none | done | unavailable | failed
  ocr_error TEXT,
  detected_at TEXT,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (project_id, sha)
);
CREATE INDEX idx_media_redactions_redacted ON media_redactions (project_id, redacted_sha);

-- mehrere Labels je Bild (Domäne, Rolle, Gliederung, …); bisheriger Gliederungspunkt wird übernommen
CREATE TABLE media_labels (
  project_id TEXT NOT NULL REFERENCES projects(id),
  base_sha TEXT NOT NULL,
  label_id TEXT NOT NULL REFERENCES metadata_labels(id),
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (project_id, base_sha, label_id)
);
CREATE INDEX idx_media_labels_label ON media_labels (project_id, label_id);
INSERT INTO media_labels (project_id, base_sha, label_id, created_by, created_at)
  SELECT project_id, base_sha, outline_label_id, updated_by, updated_at FROM media_meta WHERE outline_label_id IS NOT NULL;

-- mehrere Kapitel je Bild (Zuordnung, unabhängig davon, ob das Bild im Kapiteltext schon verwendet wird)
CREATE TABLE media_chapters (
  project_id TEXT NOT NULL REFERENCES projects(id),
  base_sha TEXT NOT NULL,
  chapter_id TEXT NOT NULL REFERENCES chapters(id),
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (project_id, base_sha, chapter_id)
);
CREATE INDEX idx_media_chapters_chapter ON media_chapters (project_id, chapter_id);
