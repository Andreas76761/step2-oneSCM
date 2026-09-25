-- Etappe 13 (ADR-038): Firmen-Layout je Projekt für PDF, HTML, Word und Online-Hilfe (JSON; Word-Vorlage im Object-Store)
ALTER TABLE projects ADD COLUMN layout TEXT;
