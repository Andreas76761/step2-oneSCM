# ADR-014 Mandanten/Projekte

**Status:** akzeptiert, umgesetzt in Etappe 6 (Umfang vom Auftraggeber am 24.09.2026 festgelegt)

## Kontext
Bis Etappe 5 gab es ein einziges Standardprojekt `p_default`. Das Schema trug `project_id` bereits an den Kerntabellen (Importe, Quellen, Kapitel, Befunde, Cluster, Canonical Topics, Exporte, Terminologie). Gewünscht ist, mehrere Handbücher getrennt zu führen – mit eigener Berechtigungsvergabe.

## Entscheidung
- **Projekt je Anfrage** über den Header `X-Project-Id` (Standard `p_default`, damit bestehende Clients unverändert funktionieren). Der Server bildet daraus einen Anfragekontext `req.ctx` mit `projectId`; alle Dienste arbeiten nur darauf.
- **Wirksame Berechtigungen** (ADR-009 bleibt gültig):
  - globale Berechtigung `admin` → alle Projekte, alle Rechte;
  - Mitglied (`project_members`) → Berechtigungen der Mitgliedschaft (`read` immer enthalten);
  - Projekt mit Sichtbarkeit `open` → globale Berechtigungen des Benutzers;
  - sonst kein Zugriff (403). Neue Projekte sind standardmäßig `restricted`.
  - Archivierte Projekte sind für alle nur lesbar; das Standardprojekt ist nicht archivierbar.
- **Mandantentrennung:**
  - IDs in Pfaden (`chapterId`, `versionId`, `blockId`, `snippetId`, `revisionId`, `findingId`, `clusterId`, `importId`, `runId`, `exportId`, `termId`, `proposalId`, `batchId`) werden in einem `preHandler` auf das Projekt geprüft; fremde IDs gelten als nicht vorhanden (404, keine Preisgabe).
  - IDs in Nutzdaten (Quellen eines Absatzes, Snippets eines Canonical Topics, Kapitelauswahl beim Export, Cluster) werden ebenfalls geprüft (400).
  - Listen, Dashboard und Audit filtern nach Projekt; Audit-Einträge tragen `project_id` (systemweite Einträge wie Einstellungen: `NULL`, nur für die Administration sichtbar).
  - Hintergrundjobs laufen im Projekt ihres Imports, Analyselaufs bzw. Umformulierungsauftrags.
- **Projektverwaltung** (`/projects…`) arbeitet projektübergreifend mit globalen Berechtigungen; Anlegen, Ändern und Mitglieder nur mit `admin`. Jedes neue Projekt erhält den Terminologie-Startbestand.
- **Bewusst systemweit:** fachliche Einstellungen (Schwellenwerte, Regeln), Referenzdaten (Rollen, Sparten, Märkte, Releases), Benutzer. Laufende Nummern (`#seq`) sind projektübergreifend eindeutig.

## Konsequenzen
- Jede neue Route mit ID-Parameter muss ihren Parameter in `OWNER_SQL` (`services/projects.ts`) eintragen, sonst greift die Trennung nur über die Dienste.
- Die Web-UI speichert das gewählte Projekt im Browser und lädt beim Wechsel neu (alle geladenen Daten gehören zum bisherigen Projekt).

## Alternativen
- Getrennte Datenbanken je Mandant: stärkste Isolation, aber hoher Betriebsaufwand und keine projektübergreifende Administration.
- Row-Level-Security in PostgreSQL: wirksam, aber nicht mit SQLite (Demo/Test, ADR-003) vereinbar.
