# ADR-034 Handbuch-Varianten: vom Draft Manual zu Freigabe, Export und Veröffentlichung

**Status:** akzeptiert, umgesetzt in Etappe 12

## Kontext
Mit Etappe 11 ordnet die Redaktion Textschnipsel im Draft Manual einer Gliederung je Variante zu (Rolle, Sparte, Blueprint/Märkte). Bisher endete dieser Weg beim Arbeitsstand; freigegeben und veröffentlicht wurden nur Kapitel aus der Kapitelstruktur der Quellen. Gewünscht ist, dass aus der Gliederung echte Kapitelversionen entstehen, die denselben Prüf- und Freigabeweg gehen und als eigenes Handbuch der Variante exportiert und veröffentlicht werden – mit Inhaltsverzeichnis, Abkürzungen, Glossar, Bildverzeichnis und FAQ.

## Entscheidung
- **Variantenkapitel sind normale Kapitel** (`chapters`) mit `outline_family_id` und `outline_node_key` (Migration `022`). Schlüssel `ol:<Gliederungsfamilie>:<Eintrag>`, Titel mit Nummer aus der Gliederung, Reihenfolge wie dort. Dadurch gelten Werkstatt, Qualitätsgate, mehrstufige Freigabe, Diskussion, Übersetzung und Versionsvergleich unverändert.
- **Stabile Eintragskennung:** `outline_nodes.node_key` bleibt über Gliederungsversionen gleich. Eine neue Gliederungsversion führt dieselben Variantenkapitel mit ihrer Versionshistorie fort; umbenannte oder verschobene Einträge ändern nur Titel und Position.
- **Inhalte:** Die Schnipsel eines Variantenkapitels sind die Zuordnungen des Kapitels und seiner Unterkapitel in der Gliederungsversion, aus der das Kapitel zuletzt erzeugt wurde (`chapters.outline_id`; ohne diese die aktive, sonst die neueste Version), in Gliederungsreihenfolge; nur aktuelle Revisionen. Generator, Befunde, Abdeckung und Qualitätsgate arbeiten auf dieser Menge.
- **Trennung:** Standardansichten, Analyse, Analytik-Kennzahlen, Gliederungen „aus der Kapitelstruktur“, Assistent und der Export ohne Auswahl bleiben bei den Kapiteln der Quellen (`outline_family_id IS NULL`). `GET /chapters?outline=<Familie>` liefert die Kapitel einer Variante, `?outline=all` beide (Werkstatt gruppiert nach Handbuch, Freigabe und Übersetzungen zeigen alle).
- **Ablauf:** Draft Manual → „Kapitel für Freigabe erzeugen“ (`POST /outlines/{id}/generate`: Kapitel anlegen/aktualisieren, Entwürfe erzeugen; Kapitel ohne Zuordnungen werden übersprungen, blockierte gemeldet) → Werkstatt → Freigabe.
- **Export und Veröffentlichung je Variante** (`outlineId`): freigegebene Kapitel der Gliederungsfamilie, die in der gewählten Version vorkommen, Filter aus der Variante (Rollen, Sparten; Blueprint ohne marktspezifische Absätze, sonst nur die gewählten Märkte), Titel = Name der Gliederung. Release-Änderungen werden gegen das letzte Release **derselben** Gliederung ermittelt; Kontexthilfe nutzt weiter nur Quellen-Releases.
- **Verzeichnisse** (Anhang): Abkürzungsverzeichnis, Glossar (aktive Begriffe mit Definition), nummeriertes Bildverzeichnis der enthaltenen Kapitel (Titel aus dem Bildverzeichnis, sonst Alternativtext) und veröffentlichte FAQ passend zu Rollen/Sparten der Variante. Markdown/HTML/PDF/JSON-Export (abschaltbar mit `appendices: false`) und in der Online-Hilfe als Seite `verzeichnisse.html` mit Sprungmarken.

## Konsequenzen
- Keine Sonderwege: jede Variante ist nach Freigabe revisionssicher wie die Quellenkapitel.
- Versionsnummern von Releases sind projektweit eindeutig; Varianten brauchen eigene Bezeichnungen (z. B. `haendler-2026.1`).
- Ändert sich die Zuordnung nach der Freigabe, entsteht erst mit einem neuen Entwurf eine neue Version; freigegebene Versionen bleiben unverändert.
