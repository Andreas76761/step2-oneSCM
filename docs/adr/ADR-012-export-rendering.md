# ADR-012 Sicherer Export als HTML und PDF

**Status:** akzeptiert, umgesetzt in Etappe 3 (US-014)

## Kontext
Das Handbuch soll außer als Markdown auch als druckfähiges HTML und als PDF ausgegeben werden. Die Quellen stammen aus Fremd-Markdown und können eingebettetes HTML oder Skripte enthalten (§13: nie ausführen).

## Entscheidung
- **Markdown → HTML** mit `marked` (GFM). HTML-Tokens aus Quellen werden als Text escaped, Links nur für `http(s)`, `mailto` und Anker, Bilder werden durch ihren Alternativtext ersetzt (keine externen Abrufe). Die HTML-Datei ist eigenständig, enthält kein JavaScript und setzt eine eigene CSP (`default-src 'none'`). Druck-CSS: Seitenumbruch je Kapitel.
- **PDF** mit `pdfmake` (reines JavaScript, kein Headless-Browser im Server). Die Markdown-Tokens werden in pdfmake-Knoten übersetzt (Überschriften, Absätze, Listen, Tabellen, Code, Zitate). Zugriffsrichtlinien: keine URL-Abrufe, lokal nur die mitgelieferten Roboto-Schriften.
- Rollen/Sparten erscheinen im PDF als Textlabel ohne Emoji (Schrift enthält keine Emojis). Icon + Label + Farbe bleibt für UI, Markdown und HTML erfüllt (US-010).
- Alle Formate nutzen dieselbe Filterlogik (`blockMatches`) und dieselbe Kapitelauswahl (nur freigegebene Versionen, Blocker verhindern den Export).

## Alternativen
- Headless Chromium (Playwright) für PDF: pixelgenaues HTML-Layout, aber schwere Laufzeitabhängigkeit und Sandbox-Anforderungen im Container.
- `pdfkit` direkt: mehr Kontrolle, aber deutlich mehr eigener Layoutcode.
