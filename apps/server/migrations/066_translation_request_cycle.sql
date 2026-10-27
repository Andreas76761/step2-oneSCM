-- Etappe 96 (Code-Review der Etappen 17–26): Übersetzungswünsche haben einen Zyklus. Mit der Freigabe einer aktuellen
-- Übersetzung gelten die offenen Wünsche als erfüllt; veraltet sie später, kann man erneut wünschen, und die Redaktion
-- erhält wieder einen Hinweis.
ALTER TABLE translation_requests ADD COLUMN fulfilled_at TEXT;
