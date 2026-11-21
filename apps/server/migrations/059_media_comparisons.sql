-- Etappe 53 (ADR-106, W-05): Vorher/Nachher-Belege – zwei Bilder (meist Fassungen desselben Bildes) mit Anlass, Änderung
-- und Wirkung; optional als Gegenüberstellung (PNG) im Bildarchiv abgelegt.
CREATE TABLE media_comparisons (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  before_sha TEXT NOT NULL,
  after_sha TEXT NOT NULL,
  base_sha TEXT,                          -- gemeinsames Bild (media_versions.base_sha), wenn beide Fassungen eines Bildes sind
  reason TEXT,                            -- Anlass (z. B. Ticket, Release)
  change_text TEXT,                       -- Änderung
  effect TEXT,                            -- Wirkung für Anwender
  ticket TEXT,
  rendered_sha TEXT,                      -- Gegenüberstellung im Archiv (neue Fassung bei erneutem Erzeugen)
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_media_comparisons_project ON media_comparisons (project_id, updated_at);
