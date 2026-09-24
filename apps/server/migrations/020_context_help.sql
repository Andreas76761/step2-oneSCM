-- Etappe 10c: Kontexthilfe für oneSCM (ADR-030). Kontext-IDs (z. B. „order.create“) verweisen auf ein Kapitel,
-- optional auf einen Abschnitt; oneSCM ruft die Hilfe über die ID auf (API, Deep-Link oder eingebettetes Widget).
CREATE TABLE help_contexts (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  context_key TEXT NOT NULL,
  chapter_id TEXT NOT NULL REFERENCES chapters(id),
  section_code TEXT,
  description TEXT,
  origin TEXT NOT NULL DEFAULT 'manual',   -- manual | front_matter
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (project_id, context_key)
);
CREATE INDEX idx_help_contexts_chapter ON help_contexts (chapter_id);

-- Öffentliche Einbettung (ohne Anmeldung) nur für veröffentlichte Releases und nur, wenn die Administration sie freischaltet
ALTER TABLE projects ADD COLUMN help_public INTEGER NOT NULL DEFAULT 0;
