# ADR-009 Trennung fachlicher Rollen und technischer Berechtigungen

**Status:** vorläufig – abhängig von E-03/E-15

## Entscheidung
- *Fachliche Rollen* (Dealer, Markt, MO, HQ, Alle) sind **Inhaltsklassifikation** (`snippet_roles`, `content_block_roles`).
- *Technische Berechtigungen* (`read`, `edit`, `decide`, `approve`, `admin`) hängen am Benutzer (`users.permissions`).
- Es gibt keine Ableitung zwischen beiden. Etappe 1: Demo-Benutzer per Header `X-User-Id`; Etappe 2: OIDC.
