-- Etappe 49 (ADR-102): Ticket-Einstufung (W-03), Releaseletter aus dem Projektvergleich (W-04).
-- Die Tonalität je Produktart und Rolle (S-02) steht in projects.style_rules (JSON), Zukunfts-Inhalte (W-09) nutzen valid_from.

-- Einstufung je Ticket durch einen Menschen; ohne Eintrag gilt: Bug = intern, sonst „in Prüfung“
CREATE TABLE ticket_classifications (
  project_id TEXT NOT NULL REFERENCES projects(id),
  ticket_key TEXT NOT NULL,
  classification TEXT NOT NULL,           -- approved | review | internal | background
  note TEXT,
  set_by TEXT NOT NULL,
  set_at TEXT NOT NULL,
  PRIMARY KEY (project_id, ticket_key)
);

-- Releaseletter aus dem Vergleich zweier Handbuch-Releases: Herkunft und Umfang (JSON)
ALTER TABLE release_letters ADD COLUMN comparison TEXT;
