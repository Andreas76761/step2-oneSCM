-- Etappe 52 (ADR-105, W-12): Prüfungen einer Kapitelversion mit den Prüferprofilen fachlich, Redaktion, Compliance,
-- Endanwender – je Lauf und Profil eine Zeile mit Wert und Funden (Verlauf).
CREATE TABLE profile_reviews (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  chapter_id TEXT NOT NULL REFERENCES chapters(id),
  chapter_version_id TEXT NOT NULL,
  profile TEXT NOT NULL,                  -- domain | editorial | compliance | enduser
  method TEXT NOT NULL,                   -- rules | ai (Regeln und KI-Dienst)
  score INTEGER NOT NULL,                 -- 0–100
  findings TEXT NOT NULL DEFAULT '[]',    -- JSON: Schweregrad, Regel, Meldung, Absatz, Abschnitt, Zitat, Vorschlag, Herkunft
  note TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_profile_reviews_version ON profile_reviews (chapter_version_id, profile, created_at);
