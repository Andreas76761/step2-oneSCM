-- Etappe 56 (ADR-109, S-06): zuschaltbare Regelsätze je Projekt – mitgelieferte (Regelbasiertes Schreiben, Simplified
-- Technical English) und eingelesene Vale-Stile. Mitgelieferte Sätze stehen hier erst, wenn sie geändert wurden.
CREATE TABLE style_rule_sets (
  project_id TEXT NOT NULL REFERENCES projects(id),
  set_key TEXT NOT NULL,                  -- tekom | ste | vale:<name>
  name TEXT NOT NULL,
  kind TEXT NOT NULL,                     -- builtin | vale
  language TEXT NOT NULL,                 -- Sprache der Texte, für die der Satz gilt (de, en, …)
  enabled INTEGER NOT NULL DEFAULT 0,
  disabled_rules TEXT NOT NULL DEFAULT '[]',  -- JSON: ausgeschaltete Regeln des Satzes
  rules TEXT,                             -- JSON: Regeln eines Vale-Stils
  unsupported TEXT NOT NULL DEFAULT '[]', -- JSON: nicht übernommene Vale-Regeln mit Grund
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (project_id, set_key)
);
