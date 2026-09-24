# 2. Priorisierte Reihenfolge der P0-Stories

Die Reihenfolge folgt den technischen Abhängigkeiten des Zielworkflows (Abschnitt 3). Eine Story kann erst „fertig“ (DoD, Abschnitt 18) sein, wenn ihre Vorgänger stehen.

| Rang | Story | Begründung / Abhängigkeit | Etappe |
|---:|---|---|---|
| 1 | **US-020 Traceability** (Gerüst) | muss von Anfang an mitlaufen, sonst ist DoD „Traceability vollständig“ nicht prüfbar | 1 |
| 2 | **US-001 Quellen importieren** | Eingang aller Daten; Revisionen sind Basis für Unveränderlichkeit | 1 |
| 3 | **US-002 Struktur extrahieren** | liefert Kapitel/Unterkapitel/Snippets | 1 |
| 4 | **US-004 Sparten klassifizieren** | unabhängig von Rollen, benötigt nur Snippets | 1 |
| 5 | **US-003 Rollen klassifizieren** | wie US-004; zusätzlich Trennung Rolle ↔ Berechtigung | 1 |
| 6 | **US-010 Rollen-/Spartenhinweise darstellen** | Referenzdaten (Icons) werden ab UI-Beginn benötigt | 1 |
| 7 | **US-005 Semantisch clustern** | benötigt klassifizierte Snippets | 1 |
| 8 | **US-006 Globale Dopplungen** | baut auf Ähnlichkeitsverfahren aus US-005 auf | 1 |
| 9 | **US-007 Widersprüche klären** | baut auf Kandidatenpaaren aus US-005 auf; Blocker steuern US-008/012 | 1 |
| 10 | **US-008 Kapitel generieren** | benötigt bestätigte Snippets, Canonical Topics, blockerfreie Kapitel | 1 |
| 11 | **US-009 Manuell bearbeiten** | benötigt generierte Content Blocks | 1 |
| 12 | **US-012 Qualitätsgate** | prüft Ergebnis aus US-007/008/009; Voraussetzung für Freigabe und Export | 1 |
| 13 | **US-020 Traceability** (Vervollständigung, Export) | Abschluss jeder Etappe | 1 |

## Etappenplan

| Etappe | Inhalt | Abnahme |
|---|---|---|
| **1** ✅ | alle P0-Stories in erster, lauffähiger Ausprägung auf SQLite, Demo-Daten, Unit-/API-/E2E-Tests, CI, Doku | Tests grün, Traceability-Matrix vollständig, offene Entscheidungen sichtbar |
| **2** ✅ | P0-Entscheidungen übernommen (24.09.2026); PostgreSQL-Adapter; OIDC-Anmeldung; persistente Jobqueue | Tests grün auf SQLite und PostgreSQL, Entscheidungsprotokoll |
| **3** ✅ | P1: Freigabeworkflow (US-016, gemäß E-12 einstufig), Terminologieverwaltung (US-015), Evidenzansicht (US-011), Export HTML/PDF (US-014), Optimierungsübersicht (US-013) | 34 Server- und 3 E2E-Tests grün auf SQLite und PostgreSQL |
| **4** ✅ | P2: Vergleich ganzer Kapitelversionen (US-019); S3-kompatibler Object-Store für Mehrinstanzbetrieb | 36 Server- und 4 E2E-Tests grün auf SQLite und PostgreSQL; S3 gegen s3rver/moto |
| **5** ✅ | Optional: KI-gestützte Umformulierung je Absatz (E-16, ADR-013): Anthropic und OpenAI-kompatibel, Evidenz je Satz, Übernahme durch die Redaktion | 40 Server- und 5 E2E-Tests grün auf SQLite und PostgreSQL |
| **6** ✅ | Mandanten/Projekte (ADR-014), Betrieb & Härtung (ADR-015), KI-Umformulierung ganzer Kapitel, Barrierefreiheit WCAG 2.2 AA (ADR-016) | 45 Server- und 26 E2E-Tests (inkl. axe) grün auf SQLite und PostgreSQL; 0 Schwachstellen in Laufzeitabhängigkeiten |
| **7** ✅ | Semantische Suche (ADR-017), Handbuch-Releases & Online-Hilfe (ADR-018), Kollaboration (ADR-019), Mehrsprachigkeit (ADR-020) | 50 Server- und 33 E2E-Tests grün auf SQLite und PostgreSQL |
