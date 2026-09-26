-- Etappe 23: verwandte Kapitel (ADR-069), Lesezeichen und Verlauf (ADR-070)
-- „Siehe auch“: manuell gesetzte Verweise (manual) und ausgeblendete automatische Vorschläge (hidden)
CREATE TABLE chapter_links (
  project_id TEXT NOT NULL REFERENCES projects(id),
  chapter_id TEXT NOT NULL REFERENCES chapters(id),
  target_chapter_id TEXT NOT NULL REFERENCES chapters(id),
  kind TEXT NOT NULL,                 -- manual | hidden
  position INTEGER NOT NULL DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (chapter_id, target_chapter_id)
);
-- Lesezeichen je Person
CREATE TABLE reader_bookmarks (
  project_id TEXT NOT NULL REFERENCES projects(id),
  user_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL REFERENCES chapters(id),
  created_at TEXT NOT NULL,
  PRIMARY KEY (project_id, user_id, chapter_id)
);
-- letzter Besuch je Person und Kapitel (gelesene Version) – für „Zuletzt gelesen“ und „Geändert seit Ihrem letzten Besuch“
CREATE TABLE reader_visits (
  project_id TEXT NOT NULL REFERENCES projects(id),
  user_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL REFERENCES chapters(id),
  version_id TEXT NOT NULL,
  version_no INTEGER NOT NULL,
  visited_at TEXT NOT NULL,
  first_visited_at TEXT NOT NULL,    -- erster Besuch des Kapitels (bleibt), Bezug für „neu seit dem ersten Lesen“
  PRIMARY KEY (project_id, user_id, chapter_id)
);
CREATE INDEX idx_reader_visits_user ON reader_visits (project_id, user_id, visited_at);
