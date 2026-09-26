# ADR-069 „Siehe auch“ und passende häufige Fragen

**Status:** akzeptiert, umgesetzt in Etappe 23 (erweitert ADR-054, ADR-032)

## Kontext
Nach einer Anleitung wissen Leser oft nicht, wo es weitergeht (z. B. „Lieferschein drucken“ → „Lieferschein stornieren“), und gepflegte FAQ waren in der Leseransicht nicht zu finden.

## Entscheidung
- Unter jedem Kapitel **„Siehe auch“** (`GET /reader/related/{chapterId}`): zuerst **manuelle Verweise** der Redaktion in ihrer Reihenfolge, dann **automatische Vorschläge** bis zusammen höchstens fünf.
- Die Vorschläge berechnen sich aus **TF-IDF-Kosinusähnlichkeit** der gezeigten Fassungen (Titel dreifach gewichtet, grobe Wortstämme, ohne Füllwörter; Schwelle 0,08). Es gibt keine Abhängigkeit von Embeddings, die Berechnung erfolgt beim Abruf und berücksichtigt nur Kapitel, die der Leser öffnen kann (freigegeben bzw. mit Entwürfen die neueste Fassung).
- **Pflege** direkt in der Leseransicht („Verweise bearbeiten“, Bearbeitungsrecht): Kapitel hinzufügen, manuelle Verweise entfernen und Vorschläge ausblenden bzw. wieder zeigen (`PUT /chapters/{chapterId}/related`, Tabelle `chapter_links` mit `manual`/`hidden`, protokolliert). IDs werden gegen das Projekt geprüft, Selbstverweise und Widersprüche abgelehnt.
- **„Häufige Fragen dazu“:** bis zu drei veröffentlichte deutsche FAQ-Einträge mit derselben Ähnlichkeit (Schwelle 0,1), aufklappbar.
- **FAQ-Seite** `/lesen/faq` mit Filter; verlinkt aus Inhaltsverzeichnis und Kapitel.
