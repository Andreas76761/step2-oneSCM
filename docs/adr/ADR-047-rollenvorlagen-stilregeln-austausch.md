# ADR-047 Rollenvorlagen und Austausch von Stilregeln

**Status:** akzeptiert, umgesetzt in Etappe 17 (erweitert ADR-044, ADR-045)

## Kontext
Berechtigungen wurden je Benutzer und Mitgliedschaft einzeln angekreuzt; gleiche Rollen mussten immer wieder gleich eingestellt werden. Stilregeln ließen sich nur je Projekt von Hand pflegen. Vom Auftraggeber am 26.09.2026 festgelegt.

## Entscheidung
- **Rollenvorlagen** (Tabelle `role_templates`, Migration `026_roles_style_history`): benannte Berechtigungssätze. Mitgeliefert: Lesen, Redaktion, Fachprüfung, Freigabe, Administration (anpassbar, nicht löschbar); eigene Vorlagen anlegen, ändern, löschen. API `GET/POST /role-templates`, `PATCH/DELETE /role-templates/{id}` (nur Administration).
- **Benutzer mit Vorlage** (`users.role_template_id`): erhalten die Berechtigungen der Vorlage; ändert sich die Vorlage, ändern sich alle zugeordneten lokalen Benutzer mit (OIDC-Benutzer ausgenommen). Einzelne Berechtigungen lösen die Verknüpfung. Eine Vorlagenänderung, die dem letzten aktiven Administrator die Administration entzöge, wird abgelehnt. Gelöschte eigene Vorlagen: Benutzer behalten ihre Berechtigungen.
- **Mitgliedschaften** lassen sich per Vorlage setzen (`roleTemplateId` statt `permissions`); in der Oberfläche füllt die Vorlagenauswahl die Kästchen vor.
- **Stilregeln austauschen:** Export als CSV (`vermeiden;aktion;ersetzen durch;hinweis`, UTF-8 mit BOM für Excel) oder JSON (alle Einstellungen); Import von CSV oder JSON – **zusammenführen** (gleiche Formulierungen werden aktualisiert, neue ergänzt) oder **ersetzen**; **Übernahme aus einem anderen Projekt**, sofern der Benutzer dort Zugriff hat (sonst „nicht gefunden“). API `GET /style/rules/export`, `POST /style/rules/import`, `POST /style/rules/copy` (Import/Übernahme nur Administration).

## Konsequenzen
- Vorlagen gelten global (projektübergreifend), wie die Benutzer selbst.
