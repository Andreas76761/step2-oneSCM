# ADR-001 Monorepo mit React + TypeScript und Node.js + TypeScript

**Status:** akzeptiert · **Datum:** 24.09.2026

## Kontext
§11 empfiehlt React + TypeScript (Frontend) und Node.js + TypeScript (Backend). Alternativen müssen begründet werden.

## Entscheidung
npm-Workspaces-Monorepo: `apps/server`, `apps/web`, `e2e`. Eine Sprache über alle Schichten. Der Server liefert im Produktionsbetrieb das gebaute Frontend aus (ein Container).

## Alternativen
- *Java/Spring, .NET:* stärker in Enterprise-Umgebungen verbreitet, aber zweite Sprache neben dem Frontend → höhere Wartungskosten, keine Anforderung, die das rechtfertigt.
- *Getrennte Repositories:* erschwert atomare Änderungen an API + UI + Tests und damit die Traceability.

## Konsequenzen
Gemeinsame Toolchain (tsc, Vitest, Playwright). CI auf Node 20 und 22.
