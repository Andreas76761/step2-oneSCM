-- Etappe 21: wöchentliche Übersicht für die Redaktion (ADR-064)
-- Wochentag des Versands (1 = Montag … 7 = Sonntag, UTC), NULL = aus; Standard Montag
ALTER TABLE projects ADD COLUMN digest_weekday INTEGER DEFAULT 1;
-- einmal je Person und Kalenderwoche
CREATE TABLE digest_log (
  project_id TEXT NOT NULL REFERENCES projects(id),
  user_id TEXT NOT NULL,
  week TEXT NOT NULL,                 -- ISO-Woche, z. B. 2026-W39
  sent_at TEXT NOT NULL,
  PRIMARY KEY (project_id, user_id, week)
);
