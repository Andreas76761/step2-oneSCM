-- Etappe 15 (ADR-042): PNG-Fassung zu SVG-Bildern für Word; Diagramm-Vorlagen je Projekt
ALTER TABLE media_assets ADD COLUMN png_sha TEXT;           -- sha256 der PNG-Fassung (eigenes media_assets-Bild im selben Projekt)

CREATE TABLE diagram_templates (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  name TEXT NOT NULL,
  kinds TEXT NOT NULL DEFAULT '[]',        -- JSON: ascii, clickpath, process, infographic
  structure TEXT NOT NULL,                 -- JSON: title, steps, clicks, facts
  options TEXT NOT NULL DEFAULT '{}',      -- JSON: color, shape, textSize, perRow
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (project_id, name)
);
