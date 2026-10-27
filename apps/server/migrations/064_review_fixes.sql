-- Etappe 92 (Code-Review der Etappen 48–54)
-- Triage: höchstens ein laufender Lauf je Projekt (zwei Läufe in Teilschritten verdrängten sich gegenseitig die Vorschläge).
-- Abgebrochene Läufe (Neustart während des Laufs) gelten als fehlgeschlagen.
UPDATE triage_runs SET status = 'failed' WHERE status = 'running';
CREATE UNIQUE INDEX uq_triage_runs_running ON triage_runs (project_id) WHERE status = 'running';
-- Änderungsvorschläge: Absatz, der beim Übernehmen eines „neu“-Vorschlags entstand – weitere neue Absätze nach demselben
-- Absatz werden in der Reihenfolge der Word-Datei dahinter bzw. davor eingefügt.
ALTER TABLE revision_proposals ADD COLUMN applied_lineage_id TEXT;
-- Reihenfolge der Vorschläge wie in der Datei (gleiche Zeitstempel sortierten nach der zufälligen Kennung)
ALTER TABLE revision_proposals ADD COLUMN seq INTEGER;
