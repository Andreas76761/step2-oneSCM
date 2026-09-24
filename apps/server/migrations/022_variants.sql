-- Etappe 12: Handbuch-Varianten aus Gliederungen (ADR-034) und Pflege (ADR-035)

-- Kapitel einer Gliederung (Variante); NULL = Kapitel aus den Quellen
ALTER TABLE chapters ADD COLUMN outline_family_id TEXT;
ALTER TABLE chapters ADD COLUMN outline_node_key TEXT;
CREATE INDEX idx_chapters_outline ON chapters (project_id, outline_family_id);

-- Stabile Kennung eines Gliederungseintrags über Versionen hinweg
ALTER TABLE outline_nodes ADD COLUMN node_key TEXT;
UPDATE outline_nodes SET node_key = id WHERE node_key IS NULL;

-- Releases je Variante
ALTER TABLE handbook_releases ADD COLUMN outline_id TEXT;
ALTER TABLE handbook_releases ADD COLUMN outline_family_id TEXT;

-- Aus der Quelle entfernte Dateien (Git, Confluence, ZIP-Abgleich)
ALTER TABLE source_documents ADD COLUMN removed_at TEXT;
ALTER TABLE source_documents ADD COLUMN removed_in_import TEXT;

-- Erinnerungen an überfällige Planungstermine
ALTER TABLE plan_items ADD COLUMN reminded_at TEXT;
