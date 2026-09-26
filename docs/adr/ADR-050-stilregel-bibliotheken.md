# ADR-050 Stilregel-Bibliotheken

**Status:** akzeptiert, umgesetzt in Etappe 18 (erweitert ADR-044, ADR-047)

## Kontext
Mehrere Handbücher sollen dieselbe Sprache sprechen (Konzernbegriffe, verbotene Wendungen). Das Kopieren von Regeln zwischen Projekten (ADR-047) führt zu auseinanderlaufenden Ständen.

## Entscheidung
- **Bibliotheken** (Tabelle `style_libraries`, projektübergreifend): Name, Beschreibung, Formulierungsregeln (`avoid`/`use`/`note` wie bei den Projektregeln). Anlegen und Ändern aus einer Liste, einer CSV (gleiches Format wie der Projekt-Export, mit `mode: merge` ergänzend) oder aus den eigenen Regeln eines Projekts; Export als CSV. Pflege mit globaler Berechtigung „admin“ unter `/style-libraries` (keine API-Tokens); lesen dürfen alle angemeldeten Benutzer, damit Projekte eine Auswahl haben.
- **Abonnements** (`project_style_libraries`): die Projekt-Administration wählt Bibliotheken unter Schreibstil › Regeln; die Reihenfolge ist der Vorrang.
- **Wirksame Regeln:** zuerst die eigenen Formulierungen des Projekts, dann die Bibliotheken in Reihenfolge; eine schon vorhandene Formulierung (ohne Groß-/Kleinschreibung) wird übersprungen und als „überdeckt“ angezeigt. Prüfung, automatische Korrektur und KI-Umformulierung nutzen die wirksamen Regeln; Anrede, Satzlänge und aktive Prüfungen bleiben Projekteinstellung.
- Löschen einer Bibliothek nur ohne Abonnements (409), damit sich Projektregeln nicht unbemerkt ändern.

## Konsequenzen
- Änderungen einer Bibliothek wirken sofort in allen abonnierenden Projekten; der Stilwert-Verlauf (ADR-048) zeigt die Wirkung beim nächsten Aufruf.
- Eine Formulierung aus einer Bibliothek lässt sich im Projekt nur überschreiben (gleiche Formulierung mit anderer Aktion), nicht einzeln abschalten.
