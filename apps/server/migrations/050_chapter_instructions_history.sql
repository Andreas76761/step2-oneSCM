-- Etappe 43: Kapitelanweisung je Kapitel und Unterkapitel, Kapitel ergänzen, Version und Historie abgelöster
-- Funktionen (Labels, Kapitel, Unterkapitel), ADR-096
ALTER TABLE chapters ADD COLUMN instruction TEXT;                          -- kurze Anleitung: worauf es ankommt
ALTER TABLE chapters ADD COLUMN instruction_topics TEXT NOT NULL DEFAULT '[]';   -- JSON: wichtige Themen (müssen vorkommen)
ALTER TABLE chapters ADD COLUMN instruction_excluded TEXT NOT NULL DEFAULT '[]'; -- JSON: Themen, die nicht beschrieben werden
ALTER TABLE chapters ADD COLUMN valid_from TEXT;                           -- Version/Release, ab der das Kapitel gilt
ALTER TABLE chapters ADD COLUMN valid_until TEXT;                          -- bis wann (gesetzt beim Ablösen)
ALTER TABLE chapters ADD COLUMN replaced_by TEXT;                          -- Nachfolger (Kapitel-ID)
ALTER TABLE chapters ADD COLUMN history_at TEXT;                           -- in der Historie seit
ALTER TABLE chapters ADD COLUMN meta_updated_by TEXT;
ALTER TABLE chapters ADD COLUMN meta_updated_at TEXT;

ALTER TABLE subchapters ADD COLUMN instruction TEXT;
ALTER TABLE subchapters ADD COLUMN instruction_topics TEXT NOT NULL DEFAULT '[]';
ALTER TABLE subchapters ADD COLUMN instruction_excluded TEXT NOT NULL DEFAULT '[]';
ALTER TABLE subchapters ADD COLUMN valid_from TEXT;
ALTER TABLE subchapters ADD COLUMN valid_until TEXT;
ALTER TABLE subchapters ADD COLUMN replaced_by TEXT;
ALTER TABLE subchapters ADD COLUMN history_at TEXT;
ALTER TABLE subchapters ADD COLUMN meta_updated_by TEXT;
ALTER TABLE subchapters ADD COLUMN meta_updated_at TEXT;

ALTER TABLE metadata_labels ADD COLUMN valid_from TEXT;
ALTER TABLE metadata_labels ADD COLUMN valid_until TEXT;
ALTER TABLE metadata_labels ADD COLUMN replaced_by TEXT;
ALTER TABLE metadata_labels ADD COLUMN history_at TEXT;

-- Historie: abgelöste Funktionen (Label, Kapitel, Unterkapitel) mit Nachfolger; Titel zum Zeitpunkt der Ablösung
CREATE TABLE structure_history (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  kind TEXT NOT NULL,                     -- label | chapter | subchapter
  item_id TEXT NOT NULL,
  title TEXT NOT NULL,
  parent_title TEXT,                      -- Kapitel eines Unterkapitels bzw. Labelgruppe
  replaced_by_id TEXT,
  replaced_by_title TEXT,
  valid_from TEXT,
  valid_until TEXT,
  note TEXT,
  moved TEXT NOT NULL DEFAULT '{}',       -- JSON: übertragene Zuordnungen (z. B. chunks, qa, images)
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  restored_by TEXT,
  restored_at TEXT
);
CREATE INDEX idx_structure_history_project ON structure_history (project_id, created_at);
