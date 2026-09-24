-- Etappe 7: Handbuch-Releases (ADR-018). Unveränderlicher Stand aller freigegebenen Kapitel eines Projekts.
CREATE TABLE handbook_releases (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  version TEXT NOT NULL,                -- z. B. 2026.1
  title TEXT NOT NULL,
  notes TEXT,                           -- redaktionelle Einleitung
  chapters TEXT NOT NULL,               -- JSON: [{ chapterId, chapterVersionId, title, versionNo }]
  changes TEXT NOT NULL,                -- JSON: automatisch ermittelte Änderungen gegenüber dem Vorgänger-Release
  previous_release_id TEXT REFERENCES handbook_releases(id),
  site_key TEXT NOT NULL,               -- statische Online-Hilfe (ZIP) im Object-Store
  markdown_key TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (project_id, version)
);
