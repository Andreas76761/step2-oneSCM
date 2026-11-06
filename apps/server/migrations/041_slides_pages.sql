-- Etappe 34 / M2: PowerPoint und PDF einlesen (ADR-086)
-- F-25: Herkunft eines Bildes aus einer Folie mit Gliederungs-Vorschlag aus dem Folientext; übernommen wird nur von Hand
CREATE TABLE media_context (
  project_id TEXT NOT NULL REFERENCES projects(id),
  sha TEXT NOT NULL,                      -- Bild (media_assets.sha256)
  source_path TEXT NOT NULL,              -- Quelldatei, z. B. schulung/vertraege.pptx
  slide INTEGER,                          -- Foliennummer
  slide_title TEXT,
  suggestions TEXT NOT NULL DEFAULT '[]', -- JSON: [{ labelId, code, name, score, matched }]
  updated_at TEXT NOT NULL,
  PRIMARY KEY (project_id, sha)
);
ALTER TABLE media_meta ADD COLUMN outline_label_id TEXT REFERENCES metadata_labels(id);

-- Neue Formate auch in gespeicherten Importeinstellungen erlauben, sofern dort die frühere Standardliste steht
UPDATE settings SET value = REPLACE(value, '".xml",".csv"]', '".xml",".csv",".pptx",".pdf"]')
  WHERE key = 'import' AND value LIKE '%"allowedExtensions":[".md",".markdown",".zip",".html",".htm",".docx",".xml",".csv"]%';
