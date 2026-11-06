# ADR-121 Prüfbericht Barrierefreiheit für den HTML-Export

**Status:** akzeptiert, umgesetzt in Etappe 69. Schließt die Reihe der Prüfberichte ab: PDF (ADR-118), Word und PowerPoint (ADR-120), jetzt HTML.

## Kontext
Der HTML-Export (Standard und Designvorlagen) war das einzige Ausgabeformat für Leserinnen und Leser ohne Prüfbericht. Beim Standard-HTML fehlte außerdem der Hauptbereich (`<main>`). Screenreader springen über diesen Bereich direkt zum Inhalt.

## Entscheidung
- **Standard-HTML mit Hauptbereich:** Die Kapitel stehen in `<main>`. Titel bzw. Deckblatt und Inhaltsverzeichnis (`<nav>`) liegen davor.
- **Prüfbericht** (`domain/htmlAccessibility.ts`) nach jedem HTML-Export, in der API als `accessibility` und auf der Seite „Export“ als Karte „Barrierefreiheit (HTML)“. Geprüft werden die Grundlagen nach WCAG 2.2:
  - Sprache der Seite, Seitentitel, Hauptbereich;
  - Überschriften: Die erste ist eine Hauptüberschrift, und keine Ebene wird übersprungen;
  - Bilder mit Alternativtext; Bilder mit `aria-hidden="true"` oder `role="presentation"` zählen als dekorativ;
  - Icons (Inline-SVG) für Screenreader ausgeblendet oder benannt;
  - Tabellen mit Kopfzellen, Layouttabellen mit `role="presentation"` ausgenommen;
  - Links mit erkennbarem Namen (Text, `aria-label` oder Alternativtext eines Bildes).
- Ein Bild mit leerem `alt` gilt als fehlender Alternativtext und nicht als dekorativ. In den Exporten entsteht es nur aus Markdown ohne Bildbeschreibung. Dekorative Grafiken der Vorlagen sind Inline-SVG mit `aria-hidden`.
- **Keine Vollprüfung:** Der Bericht liest das Markup, wie die App es schreibt, nach festen Mustern. Farbkontraste, Fokusreihenfolge und Lesereihenfolge prüft er nicht; dafür bleibt axe im Browser (E2E) bzw. ein Prüfwerkzeug zuständig.

## Begründung
- Ein einheitlicher Bericht für alle Ausgabeformate: Die Redaktion sieht Lücken sofort nach dem Export.
- Ohne neue Abhängigkeit und ohne Browser: Das Markup stammt aus der App selbst, die Muster bleiben überschaubar.

## Folgen
- Markdown und JSON bleiben ohne Bericht; sie sind Austauschformate.
- Tests T-384, T-385, E2E T-386 (mit axe); NFR-156. T-377 prüft „ohne Bericht“ jetzt mit Markdown statt HTML.
