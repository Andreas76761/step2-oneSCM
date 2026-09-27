-- Etappe 26: Übersetzungen häufiger Fragen (ADR-077) – je deutschem FAQ-Eintrag und Sprache eine Übersetzung mit Freigabe
CREATE TABLE faq_translations (
  faq_id TEXT NOT NULL REFERENCES faq_entries(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  language TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  status TEXT NOT NULL,                 -- draft | approved
  mode TEXT NOT NULL,                   -- manual | machine
  source_hash TEXT NOT NULL,            -- Fingerabdruck der deutschen Frage und Antwort beim Übersetzen: abweichend = veraltet
  issues TEXT NOT NULL DEFAULT '[]',    -- Prüfbefunde (wie Kapitelübersetzungen)
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  approved_by TEXT,
  approved_at TEXT,
  PRIMARY KEY (faq_id, language)
);
CREATE INDEX idx_faq_translations_project ON faq_translations (project_id, language);
