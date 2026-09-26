-- Etappe 25: Übersetzungswünsche aus der Leseransicht (ADR-075) – je Person, Kapitel und Sprache höchstens einer
CREATE TABLE translation_requests (
  project_id TEXT NOT NULL REFERENCES projects(id),
  chapter_id TEXT NOT NULL REFERENCES chapters(id),
  language TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (project_id, chapter_id, language, user_id)
);
CREATE INDEX idx_translation_requests_chapter ON translation_requests (project_id, chapter_id, language);
