-- Etappe 50 (ADR-103): Fehlerliste in der App (G-05), Abgleich mit FEHLERLISTE.csv des Arbeitsordners
CREATE TABLE language_errors (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  nr INTEGER NOT NULL,                    -- F-0001 …, je Projekt fortlaufend, nie neu vergeben
  found_at TEXT NOT NULL,                 -- Funddatum (ISO)
  location TEXT NOT NULL,                 -- Fundstelle: Kapitel › Abschnitt bzw. Datei aus dem Arbeitsordner
  chapter_id TEXT REFERENCES chapters(id),
  chapter_version_id TEXT,
  block_id TEXT,
  error_text TEXT NOT NULL,               -- Originaltext (kurz)
  correction TEXT,                        -- Vorschlag
  category TEXT NOT NULL,                 -- Kategorie laut FEHLERLISTE.md
  rule TEXT,                              -- Regel (Stilregel bzw. Kennung aus GRAMMATIK.md)
  status TEXT NOT NULL,                   -- open | fixed | rejected | rule_missing
  reason TEXT,                            -- Begründung bei „abgelehnt“
  origin TEXT NOT NULL,                   -- check (aus der Stilprüfung) | manual | import
  fingerprint TEXT,                       -- Kapitel + Regel + Text: dieselbe Fundstelle nur einmal
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (project_id, nr)
);
CREATE INDEX idx_language_errors_project ON language_errors (project_id, status);
CREATE UNIQUE INDEX uq_language_errors_fingerprint ON language_errors (project_id, fingerprint);
