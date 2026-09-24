# ADR-031 Release-Pipeline

**Status:** akzeptiert, umgesetzt in Etappe 10

## Kontext
Betriebe sollen geprüfte, nachvollziehbare Versionen beziehen: ein Container-Image mit Stückliste (SBOM), überprüfbarer Herkunft und Signatur, dazu das Helm-Chart (ADR-027) und Release-Notes.

## Entscheidung
- **Eine Version** für alle Pakete, `package-lock.json`, OpenAPI und Helm-Chart (`version`/`appVersion`). `npm run release -- check [--tag vX.Y.Z]` prüft Konsistenz, Tag und CHANGELOG-Abschnitt; `bump X.Y.Z` setzt die Version überall; `notes X.Y.Z` liefert die Release-Notes aus `CHANGELOG.md`. Die laufende Anwendung meldet ihre Version im Health-Endpunkt (`APP_VERSION`, im Image gesetzt).
- **Auslöser:** Tag `vX.Y.Z` (SemVer, Vorabversionen `-rc.N`) oder manuell für einen vorhandenen Tag (`.github/workflows/release.yml`).
- **Ablauf:** Prüfung (Version, Typen, Lint, Tests) → Multi-Arch-Image (`linux/amd64`, `linux/arm64`) nach `ghcr.io/<owner>/<repo>` mit Tags `X.Y.Z`, `X.Y`, `X` (ab 1.0), `latest` (nicht für Vorabversionen) und `sha-…`; BuildKit-SBOM und SLSA-Provenienz am Image; Smoke-Test des veröffentlichten Images (Health, Version) → SBOM als SPDX-JSON-Datei → **cosign keyless** (Sigstore, GitHub-OIDC) signiert den Digest und attestiert die SBOM; zusätzlich GitHub-Attestierung der Build-Provenienz → Helm-Chart als OCI-Artefakt `oci://ghcr.io/<owner>/charts/onescm` → GitHub-Release mit Notes aus dem CHANGELOG, SBOM, Chart und Prüfbefehl.
- **Prüfung vor jedem Merge:** CI-Job „Release-Pipeline prüfen“ – Versionen konsistent, Workflows mit actionlint, Image bauen und starten (Health mit Version, Widget-Skript).

## Konsequenzen
- Verifizieren: `cosign verify ghcr.io/<owner>/<repo>@<digest> --certificate-identity-regexp '^https://github.com/<owner>/<repo>/.github/workflows/release.yml@' --certificate-oidc-issuer https://token.actions.githubusercontent.com`.
- Ein Release erfordert einen CHANGELOG-Abschnitt; fehlt er, bricht die Pipeline vor dem Bau ab.
- Paketberechtigungen: Das Repository benötigt „Read and write permissions“ für `GITHUB_TOKEN` bzw. Paketzugriff in GHCR.
