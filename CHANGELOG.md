# Changelog

## 0.1.0 – Etappe 1 (24.09.2026)

### Hinzugefügt
- Projektpaket unverändert unter `reference/` abgelegt (Masterprompt, Start-Hinweise, Referenz-UI).
- Gap-Analyse, P0-Reihenfolge, Repository-Struktur, offene Entscheidungen (E-01 … E-15, W-01 … W-09), Datenmodell, 10 ADRs.
- Server (Node.js + TypeScript, Fastify, SQLite):
  - ZIP-/MD-Import als Hintergrundjob mit SHA-256, Revisionslogik, Teilfehlern, Zip-Bomb-Grenzen (US-001).
  - Nicht ausführender Markdown-Struktur-Parser, `Ohne Kapitel` (US-002).
  - Rollen-/Sparten-/Markt-/Release-Klassifikation mit Score, Methode, Modellversion, Evidenzstatus (US-003, US-004).
  - TF-IDF-Ähnlichkeit, Cluster, Dopplungsstufen 1–3, Canonical Topics (US-005, US-006).
  - Widerspruchsregeln inkl. aller zehn Entscheidungsoptionen (US-007).
  - Extraktiver Kapitelgenerator mit 10-teiliger Struktur und Quellen je Absatz (US-008).
  - Kapitelwerkstatt mit append-only Blockversionen, Sperren, Wiederherstellen, Schutz manueller Änderungen (US-009).
  - Qualitätsgate, protokollierte Freigabe, unveränderliche freigegebene Versionen (US-012).
  - Gefilterter Markdown-/JSON-Export, Datenschutzblocker (US-010, US-014, US-018).
  - Traceability-Matrix als JSON/CSV/Markdown/Excel (US-020).
- Web-UI (React + TypeScript) mit allen 14 Navigationspunkten aus §14.
- OpenAPI 3.1.1 mit `x-requirements` je Operation.
- 26 Unit-/API-Tests, 2 Playwright-E2E-Tests, CI (Node 20 + 22), Dockerfile, fiktive Demo-Daten.

### Offen (nächste Etappen)
- Klärung der P0-Entscheidungen (docs/04-offene-entscheidungen.md).
- PostgreSQL-Adapter, OIDC-Authentifizierung, persistente Jobqueue.
