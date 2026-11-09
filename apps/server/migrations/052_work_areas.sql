-- Etappe 45: Arbeitsbereiche Pipeline, Backlog und Intern (ADR-098)
-- Pipeline: Jira-Tickets in Bearbeitung, noch nicht produktiv – je Kapitel/Unterkapitel der aktuellen Gliederung, mit
-- Erstelldatum, Stream, Produktionsdatum und der bereits geschriebenen Vorab-Dokumentation. Backlog: Tickets, deren
-- Bearbeitung noch nicht begonnen hat. Intern: interne Themen (Testing, Reporting, Systeme, Migration, Rollout, Other),
-- nie im Handbuch.
CREATE TABLE work_items (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  area TEXT NOT NULL,                     -- pipeline | backlog | intern
  topic TEXT,                             -- nur Intern: testing | reporting | systems | migration | rollout | other
  origin TEXT NOT NULL,                   -- jira (aus eingelesenen Jira-Tickets) | manual
  jira_key TEXT,                          -- Ticket, z. B. ONESCM-123
  document_id TEXT,                       -- Quelle des Tickets (Jira-Import)
  title TEXT NOT NULL,
  jira_status TEXT,                       -- Status laut letztem Import
  jira_type TEXT,
  stream TEXT,
  created_on TEXT,                        -- Erstelldatum des Tickets (bzw. des Eintrags)
  production_date TEXT,                   -- geplantes Produktionsdatum (TT.MM.JJJJ als ISO JJJJ-MM-TT)
  jira_production_date TEXT,              -- Produktionsdatum laut letztem Jira-Import (von Hand geändert → bleibt)
  chapter_id TEXT,                        -- Gliederung: Kapitel …
  subchapter_id TEXT,                     -- … und Unterkapitel
  chapter_source TEXT,                    -- handbook (Kapitel nutzt das Ticket) | suggested (Titelvergleich) | manual
  text TEXT NOT NULL DEFAULT '',          -- Vorab-Dokumentation (Markdown)
  state TEXT NOT NULL,                    -- open | documented | ready (produktiv, zu übernehmen) | live (ins Handbuch übernommen) | cancelled
  live_import_id TEXT,                    -- Import der übernommenen Dokumentation
  live_by TEXT,
  live_at TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_by TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_work_items_project ON work_items (project_id, area, topic);
CREATE UNIQUE INDEX idx_work_items_jira ON work_items (project_id, jira_key) WHERE jira_key IS NOT NULL;
