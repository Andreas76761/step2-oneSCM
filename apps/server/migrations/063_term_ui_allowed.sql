-- Etappe 57 (ADR-110, S-04, Entscheidung 24.10.2026): zu vermeidende Begriffe, die als UI-Begriff in Menüpfaden und
-- Anführungszeichen erlaubt bleiben (z. B. „MO Checks“ – im Fließtext gilt „MO-Prüfungen“).
ALTER TABLE terminology_terms ADD COLUMN ui_allowed INTEGER NOT NULL DEFAULT 0;
