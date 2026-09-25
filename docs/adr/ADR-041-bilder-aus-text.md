# ADR-041 Bilder aus Text: ASCII-Bild, Klickstrecke, Prozessbild, Infografik

**Status:** akzeptiert, umgesetzt in Etappe 14

## Kontext
Handbücher brauchen Abbildungen für Abläufe und Bedienwege; bisher mussten sie außerhalb der App gezeichnet und als Bild importiert werden. Vom Auftraggeber am 25.09.2026 festgelegt: Textstellen in ein Textfeld kopieren, daraus verschiedene Bilder erzeugen (Regeln + KI), Bilder auswählen und speichern.

## Entscheidung
- **Neuer Navigationspunkt „Bilder“**: Textfeld, Auswahl der Bildarten, optional „Struktur mit KI erkennen“, Vorschau aller Bilder nebeneinander, Auswahl per Kontrollkästchen, Alternativtext je Bild (Pflicht, ADR-029), „Ausgewählte speichern“, SVG herunterladen, ASCII kopieren, Markdown `![Alt](media:…)` zum Einfügen.
- **Struktur statt Freihandzeichnung** (`domain/diagrams.ts`): Aus dem Text werden Titel (Überschrift), Schritte (Listenpunkte bzw. Sätze), Entscheidungen („Wenn …, dann …; sonst …“ → Frage mit Ja/Nein-Zweig, Nebensatz in Frageform), Klickpfad (Menüpfade „A > B“, „A → B“ und **fett** gesetzte Bedienelemente) und Kennzahlen („Bezeichnung: Wert“, Zahlen mit Einheit) erkannt. Reine Aussagen mit Kennzahl erscheinen in der Infografik, nicht im Ablauf. Die Struktur ist in der Oberfläche bearbeitbar und wird neu gezeichnet (`structure`).
- **KI optional:** Mit `useAi` liefert der KI-Dienst dieselbe Struktur als JSON (Datenschutzsperre für externe Dienste, Audit nur mit Prüfsumme); die Antwort wird geprüft und begrenzt. Gezeichnet wird immer deterministisch – die KI erzeugt keine Grafik.
- **Zeichnen als SVG** in der Hausfarbe des Firmen-Layouts (ADR-038): ASCII-Bild (Kästen, Pfeile, Entscheidungsraute aus Textzeichen; als Text und als SVG in Festbreitenschrift), Klickstrecke (nummerierte Stationen mit Pfeilen, Umbruch nach vier), Prozessbild (Start/Ende, Schritte, Rauten mit Ja nach unten und Nein nach rechts), Infografik (Titelband, Kennzahl-Kacheln, nummerierte Schritte). Nur Elemente der SVG-Positivliste, Texte maskiert, `<title>` und `role="img"`.
- **Speichern** über die Bildablage (ADR-029/036): SVG wird bereinigt, inhaltsadressiert abgelegt, der Titel erscheint im Bildverzeichnis, das Bild ist in der Werkstatt über „Bild einfügen“ wählbar und wird in allen Exporten eingebettet.
- API: `POST /diagrams/generate` (speichert nichts), `POST /diagrams/save` (Berechtigung edit).

## Konsequenzen
- Die Erkennung ist regelbasiert und für typische Handbuchtexte ausgelegt; ungewöhnliche Texte liefern Hinweise („Kein Menüpfad erkannt“) und lassen sich über die Strukturbearbeitung oder die KI verbessern.
- In Word erscheinen SVG-Bilder weiterhin als Alternativtext (ADR-038); für Word-Handbücher sind Rastergrafiken eine spätere Erweiterung.
