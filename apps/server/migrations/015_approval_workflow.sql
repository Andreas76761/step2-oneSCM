-- Etappe 9: mehrstufige Freigabe (ADR-025)
-- Workflow je Projekt (JSON: Stufen, Vier-Augen-Prinzip); leer = einstufige Freigabe wie bisher (E-12)
ALTER TABLE projects ADD COLUMN approval_workflow TEXT NOT NULL DEFAULT '{}';
-- Stand einer eingereichten Version: Workflow-Schnappschuss zum Einreichzeitpunkt, aktuelle Stufe, Frist, Eskalation
ALTER TABLE generated_chapter_versions ADD COLUMN workflow TEXT;
ALTER TABLE generated_chapter_versions ADD COLUMN current_stage INTEGER;
ALTER TABLE generated_chapter_versions ADD COLUMN stage_started_at TEXT;
ALTER TABLE generated_chapter_versions ADD COLUMN stage_due_at TEXT;
ALTER TABLE generated_chapter_versions ADD COLUMN stage_escalated_at TEXT;
-- Entscheidungen je Stufe; final = 1 für Ablehnung und abschließende Freigabe (Grundlage der Analytik)
ALTER TABLE approvals ADD COLUMN stage TEXT;
ALTER TABLE approvals ADD COLUMN final INTEGER NOT NULL DEFAULT 1;
CREATE INDEX idx_versions_review_due ON generated_chapter_versions (status, stage_due_at);
