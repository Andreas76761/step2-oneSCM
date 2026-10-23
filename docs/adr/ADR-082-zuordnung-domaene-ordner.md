# ADR-082 Zuordnung Fachdomäne → Gliederungspunkt → Ordner, Menüpunkte für Contract Management 3.1–3.5

**Status:** akzeptiert, umgesetzt in Etappe 30 (erweitert ADR-079, ADR-080, ADR-081); englische UI-Begriffe und Domänenzuordnung am 23.10.2026 vom Auftraggeber bestätigt

## Kontext
Auftrag vom 23.10.2026: Die Unterpunkte 3.1–3.5 von Contract Management hatten keinen eigenen Navigationscode (Zugriffsmatrix ADR-081). In der App soll eine Übersicht zeigen, welche Fachdomäne zu welchem Gliederungspunkt und zu welchem Ordner bzw. Unterordner des Handbuch-Arbeitsordners (`tools/handbuch-ordner`) gehört. Der Arbeitsordner erhält vier Hauptordner zur Steuerung: I Output, II Stil und Design, III Grammatik/Synonyme/Fehlerliste, IV Translation.

## Entscheidung
- **Navigation:** fünf neue Katalog-Labels unter `nav.contract-management.*` – `search-change` (3.1 Vertrag suchen und ändern), `suspend-reactivate` (3.2), `terminate-cancel` (3.3), `renewal` (3.4), `documents` (3.5). Deutsche Namen aus der Handbuch-Werkstatt V4; die englischen UI-Begriffe wurden am 23.10.2026 bestätigt. Gruppe Navigation 39, Katalog 158 Labels.
- **Zuordnung:** Tabelle `metadata_label_links` (Domänen-Label → Label der Gruppe Gliederung oder Navigation, Herkunft `catalog` oder `manual`, `active`). Der Katalog liefert einen Vorschlag (`DOMAIN_LINKS`), der einmal je Projekt angelegt wird; gelöste Vorschläge bleiben gelöst (`active = 0`), auch nach einem Neustart. Chunks, die ein Domänen- und ein Gliederungs- bzw. Menü-Label tragen, erscheinen als **Vorschlag aus Chunks** mit Anzahl. Pflege mit Berechtigung `edit`, Audit `domain_map.updated`.
- **Ordner:** Kapitelordner nach denselben Regeln wie `handbuch_struktur.py` (`ordnername`, Anhänge wie `GRUPPEN`): `02_Kapitel/<NN>_<Titel>`, Ausgabe `04_Output/<Sprache>/<Kapitel>`. Unterordner `<Kapitelnummer>.<n>_<Titel>` kommen aus einer wählbaren Gliederung der App, deren Kapitel per Titel den Gliederungs-Labels zugeordnet werden. Die acht Arbeitsordner je Kapitel und die vier Steuerungsordner (`05_I_Output`, `06_II_Stil_und_Design`, `07_III_Grammatik_Synonyme_Fehlerliste`, `08_IV_Translation`) zeigt die Seite als Legende. Änderungen an den Namensregeln erfolgen in beiden Dateien gemeinsam.
- **Seite** „oneSCM_Metadaten › Zuordnung“ (`/metadaten/zuordnung`) mit Karte je Domäne, Übernehmen/Lösen/Zuordnen, Liste der Gliederungspunkte ohne Domäne und CSV-Export (`GET /metadata/domain-map/export`) für den Arbeitsordner.

## Folgen
- Migration `037_domain_map.sql`; API `GET /metadata/domain-map`, `PUT /metadata/domain-map/links`, `GET /metadata/domain-map/export`; Tests T-240 (API), T-239 (E2E mit axe); Anforderung NFR-74.
- Die Importdatei `zugriffsmatrix.csv` enthält die Zeilen 3.1–3.5 (lokal, nicht im Repository).
- Die Zuordnung des Katalogs wurde am 23.10.2026 übernommen; Änderungen je Projekt auf der Seite „Zuordnung“.
