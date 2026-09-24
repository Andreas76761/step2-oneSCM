# ADR-035 Bedienkomfort: Drag & Drop, Gliederungsvergleich, globale Suche, Darstellung, mobile Ansicht

**Status:** akzeptiert, umgesetzt in Etappe 12

## Kontext
Mit wachsenden Gliederungen und Stammdaten werden Umsortieren über ↑/↓, das Wiederfinden von Inhalten und die Arbeit unterwegs mühsam.

## Entscheidung
- **Drag & Drop** (HTML5): Schnipsel im Draft Manual auf einen Eintrag ziehen (ans Ende) oder auf einen Schnipsel (davor, `beforeSnippetId`); auch aus der Liste nicht zugeordneter Schnipsel (markierte werden gemeinsam gezogen). Gliederungseinträge auf einen Eintrag ziehen ordnet davor ein und übernimmt dessen Ebene (`beforeId`). Die Tastatur-Alternativen (↑/↓, „Verschieben nach …“, ⇤) bleiben (WCAG 2.5.7).
- **Versionsvergleich** (`GET /outlines/{id}/compare?with=`): Einträge über `node_key` – neu, entfernt, geändert (umbenannt, verschoben, Ebene, Zuordnungen +/−), unverändert – plus Änderungen der Variante (Name, Rollen, Sparten, Märkte, Geltung).
- **Globale Suche** (`GET /search`): Teilwortsuche ohne Groß-/Kleinschreibung über Kapitel, Texte der neuesten Kapitelversion, aktuelle Schnipsel, Quellen, Gliederungen (Name und Einträge), Abkürzungen, Glossar, FAQ; gruppiert, mit Ausschnitt und Sprungziel. Platzhalter `%`/`_` werden wörtlich gesucht. Suchfeld oben in der Navigation, Tastenkürzel „/“. Die semantische Suche (ADR-017) bleibt für Bedeutungssuche.
- **Darstellung:** System, Hell oder Dunkel je Browser (`data-theme` am Wurzelelement, gleiche Farbwerte wie der System-Dunkelmodus; axe-geprüft).
- **Mobile Ansicht:** größere Bedienelemente (≥ 40 px), umbrechende Aktionszeilen, horizontal scrollbare Tabellen, begrenzte Kapitelliste in der Werkstatt.

## Konsequenzen
- Die Suche ist bewusst einfach (LIKE, je Bereich begrenzt); bei sehr großen Projekten ist ein Volltextindex der nächste Schritt.
- `LOWER` in SQLite behandelt nur ASCII; Umlaute werden daher in Groß-/Kleinschreibung unterschieden (PostgreSQL nicht).
