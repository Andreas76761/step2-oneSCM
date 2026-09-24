# ADR-009 Trennung fachlicher Rollen und technischer Berechtigungen

**Status:** akzeptiert (Entscheidungen E-03, E-15 vom 24.09.2026)

## Entscheidung
- *Fachliche Rollen* (Dealer, Markt, MO, HQ, Alle) sind **Inhaltsklassifikation** (`snippet_roles`, `content_block_roles`).
- *Technische Berechtigungen* (`read`, `edit`, `decide`, `approve`, `admin`) hängen am Benutzer (`users.permissions`).
- Es gibt keine Ableitung zwischen beiden. Anmeldung: OIDC im Produktivbetrieb (ADR-011), Demo-Benutzer nur im Demo-Modus.
