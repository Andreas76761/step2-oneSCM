-- Etappe 55 (ADR-108, O-09, Entscheidung 24.10.2026): Ansprechperson je Land/Markt für das Länderreview – ein Benutzer
-- der App mit Vertretung, optional je Sprache (leer = alle Sprachen des Marktes).
CREATE TABLE market_reviewers (
  project_id TEXT NOT NULL REFERENCES projects(id),
  market TEXT NOT NULL,                   -- Ländercode, z. B. CH
  language TEXT NOT NULL DEFAULT '',      -- '' = alle Sprachen, sonst z. B. fr-ch
  user_id TEXT NOT NULL,
  deputy_user_id TEXT,
  note TEXT,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (project_id, market, language)
);
ALTER TABLE translation_reviews ADD COLUMN deputy TEXT;
ALTER TABLE translation_reviews ADD COLUMN assigned_by TEXT;  -- manual | market
