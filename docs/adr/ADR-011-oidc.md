# ADR-011 Anmeldung über OpenID Connect

**Status:** akzeptiert (Entscheidung E-15 vom 24.09.2026), umgesetzt in Etappe 2

## Kontext
§13 verlangt rollenbasierte Zugriffssteuerung. Etappe 1 arbeitete mit Demo-Benutzern ohne echte Anmeldung.

## Entscheidung
- `AUTH_MODE=oidc`: Die API akzeptiert ausschließlich `Authorization: Bearer <JWT>` eines OIDC-Providers (Keycloak, Entra ID, Okta …). Geprüft werden Signatur (JWKS aus der Discovery oder `OIDC_JWKS_URI`), Aussteller, Zielgruppe (`OIDC_AUDIENCE`) und Ablaufzeit (30 s Toleranz). Keine Sitzungen, keine Cookies – die API bleibt zustandslos.
- Technische Berechtigungen kommen aus einem Claim (`OIDC_PERMISSIONS_CLAIM`, Punktnotation wie `realm_access.roles`) und werden über `OIDC_PERMISSION_MAP` abgebildet (Standard: Gruppen `onescm-reader/-editor/-reviewer/-approver/-admin`). Direkte Berechtigungsnamen (`edit`, `approve` …) werden ebenfalls anerkannt.
- Benutzer-ID im Audit: `oidc:<sub>`; Anzeigename und Berechtigungen werden bei jeder Anfrage in `users` aktualisiert.
- Web-UI: Authorization Code Flow mit PKCE (`oidc-client-ts`), Token im `sessionStorage`, stille Erneuerung. `GET /api/v1/auth/config` liefert Issuer und Client-ID. Downloads laufen per `fetch` mit Token.
- `AUTH_MODE=demo` (Standard für lokale Entwicklung): Demo-Benutzer über `X-User-Id`. Im OIDC-Modus werden keine Demo-Benutzer angelegt und der Header wird ignoriert.

## Alternativen
- Serverseitige Sitzung (BFF) mit Cookie: schützt Tokens besser vor XSS, erfordert aber Sitzungsspeicher und CSRF-Schutz. Da die UI kein fremdes HTML ausführt (ADR-005, CSP), wurde der schlankere Bearer-Ansatz gewählt; ein BFF kann ergänzt werden.

## Konsequenzen
- Für den Betrieb müssen beim IdP ein öffentlicher Client (Redirect-URI = App-URL) und die Gruppen angelegt werden.
- Die CSP erlaubt `connect-src` zum Issuer (Token-Endpunkt, Discovery).
