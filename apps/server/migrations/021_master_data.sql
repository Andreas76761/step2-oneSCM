-- Etappe 11: Stammdaten und Draft Manual (ADR-032, ADR-033)

-- Märkte des Projekts für Gliederungsvarianten (konfigurierbar, Vorbelegung 6 Märkte)
ALTER TABLE projects ADD COLUMN markets TEXT NOT NULL DEFAULT '["DE","FR","IT","ES","GB","NL"]';

-- Gliederungen (Inhaltsverzeichnis-Versionen) je Variante: Rollen, Sparten, Blueprint oder Märkte
CREATE TABLE outlines (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  family_id TEXT NOT NULL,                 -- erste Version der Gliederung; alle Versionen teilen sie
  version_no INTEGER NOT NULL,
  based_on_id TEXT REFERENCES outlines(id),
  name TEXT NOT NULL,
  description TEXT,
  roles TEXT NOT NULL DEFAULT '[]',        -- JSON: dealer, market, hq … (leer = alle)
  divisions TEXT NOT NULL DEFAULT '[]',    -- JSON: car, van … (leer = alle)
  market_scope TEXT NOT NULL DEFAULT 'blueprint', -- blueprint | markets
  markets TEXT NOT NULL DEFAULT '[]',      -- JSON: Marktcodes bei market_scope = markets
  status TEXT NOT NULL DEFAULT 'draft',    -- draft | active | archived
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (family_id, version_no)
);
CREATE INDEX idx_outlines_project ON outlines (project_id, family_id, version_no);

CREATE TABLE outline_nodes (
  id TEXT PRIMARY KEY,
  outline_id TEXT NOT NULL REFERENCES outlines(id),
  parent_id TEXT REFERENCES outline_nodes(id),
  level INTEGER NOT NULL,                  -- 1 = Kapitel, 2 = Unterkapitel
  position INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT
);
CREATE INDEX idx_outline_nodes_outline ON outline_nodes (outline_id, level, position);

-- Zuordnung der Textschnipsel zu Knoten einer Gliederung (je Gliederung höchstens ein Knoten je Schnipsel)
CREATE TABLE outline_assignments (
  outline_id TEXT NOT NULL REFERENCES outlines(id),
  snippet_id TEXT NOT NULL REFERENCES text_snippets(id),
  node_id TEXT NOT NULL REFERENCES outline_nodes(id),
  position INTEGER NOT NULL,
  assigned_by TEXT NOT NULL,
  assigned_at TEXT NOT NULL,
  PRIMARY KEY (outline_id, snippet_id)
);
CREATE INDEX idx_outline_assignments_node ON outline_assignments (node_id, position);

-- Redaktionsplanung je Knoten
CREATE TABLE plan_items (
  node_id TEXT PRIMARY KEY REFERENCES outline_nodes(id),
  outline_id TEXT NOT NULL REFERENCES outlines(id),
  assignee TEXT,
  due_date TEXT,
  status TEXT NOT NULL DEFAULT 'open',     -- open | in_progress | review | done
  note TEXT,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE abbreviations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  abbreviation TEXT NOT NULL,
  expansion TEXT NOT NULL,
  description TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (project_id, abbreviation)
);

CREATE TABLE faq_entries (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  roles TEXT NOT NULL DEFAULT '[]',
  divisions TEXT NOT NULL DEFAULT '[]',
  language TEXT NOT NULL DEFAULT 'de',
  status TEXT NOT NULL DEFAULT 'draft',    -- draft | published
  source TEXT NOT NULL DEFAULT 'manual',   -- manual | assistant
  source_question TEXT,                    -- Frage aus dem Assistenten (Vorschlag)
  position INTEGER NOT NULL,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_faq_project ON faq_entries (project_id, position);

-- Bildverzeichnis: Bildtitel (Beschriftung) je Bild
ALTER TABLE media_assets ADD COLUMN title TEXT;
