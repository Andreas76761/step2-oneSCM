# ADR-045 Benutzerverwaltung

**Status:** akzeptiert, umgesetzt in Etappe 16 (ergänzt ADR-009, ADR-014, E-15)

## Kontext
Benutzer entstanden bisher nur als Demo-Benutzer oder bei der ersten OIDC-Anmeldung; Mitgliedschaften wurden je Projekt gepflegt. Es fehlte ein Überblick über alle Benutzer, das Anlegen, Sperren und die Sicht „welche Projekte darf dieser Benutzer“.

## Entscheidung
- **Seite „Benutzer“** (nur Administration) und API `GET/POST /users`, `PATCH /users/{userId}`, `GET /users/{userId}/projects` – projektübergreifend wie die Projektverwaltung, nicht mit API-Tokens.
- **Anlegen:** lokale Benutzer `u-…` (Name, E-Mail, globale Berechtigungen; Lesen immer) oder Vorab-Anlage `oidc:<Subject>` (für Projektzugriffe und Sperre vor der ersten Anmeldung). Migration `025_users_style`: `users.disabled_at/disabled_by/created_at/created_by/origin`.
- **OIDC-Benutzer:** Name, E-Mail und Berechtigungen kommen weiter bei jeder Anmeldung vom Identity Provider und sind hier nicht änderbar; Projektzugriffe und Sperre schon.
- **Sperren:** gesperrte Benutzer werden im Demo-Modus und bei OIDC mit 403 abgewiesen, ihre API-Tokens gelten nicht mehr (401), in der Demo-Auswahl erscheinen sie nicht. Entsperren stellt alles wieder her.
- **Schutz:** das eigene Konto lässt sich nicht sperren und die eigene Administration nicht entziehen; der letzte aktive Administrator bleibt erhalten.
- **Projektzugriffe je Benutzer:** Übersicht aller Projekte mit Sichtbarkeit, Mitgliedschaft und wirksamen Berechtigungen; Mitgliedschaft hinzufügen, ändern, entfernen (bestehende API je Projekt).
- Demo-Benutzer werden nur noch beim ersten Start angelegt (Änderungen der Benutzerverwaltung bleiben erhalten).
- Alle Änderungen im Audit (`user.created`, `user.updated`, `user.disabled`, `user.enabled`).

## Konsequenzen
- Lokale Benutzer haben kein Passwort; im Produktivbetrieb (OIDC) dienen sie nur als Vorab-Einträge bzw. Ersteller von API-Tokens. Eine eigene Passwortanmeldung ist bewusst nicht vorgesehen (E-15).
