# ADR-016 Barrierefreiheit (WCAG 2.2 AA) und responsive Oberfläche

**Status:** akzeptiert, umgesetzt in Etappe 6 (Masterprompt §15: „verbindliche Icons und Barrierefreiheit“)

## Entscheidung
- **Zielniveau WCAG 2.2 AA**, automatisch geprüft mit axe (`@axe-core/playwright`) in der E2E-Suite: alle Hauptseiten sowie Interaktionszustände (ausgewählter Absatz, KI-Vorschlag, Dialog, Versionsvergleich), in hellem und dunklem Farbschema (T-208). Neue Verstöße lassen die CI fehlschlagen.
- **Kontrast:** Statusfarben ≥ 4,5:1; getrennte Tokens für Linkfarbe (`--link`) und Flächenfarbe von Primärbuttons (`--primary`); Rollen- und Spartenfarben stammen aus den Stammdaten und sind für hellen Grund gewählt – im Dark Mode erscheint der Text in Schriftfarbe, die Farbe bleibt über Rahmen, Icon und Label erkennbar (US-010: Icon + Label + Farbe).
- **Tastatur und Fokus:** Sprunglink „Zum Inhalt springen“; nach jedem Seitenwechsel Fokus auf die Seitenüberschrift und Seitentitel `… – oneSCM Handbook Studio`; Dialoge setzen den Fokus hinein, halten ihn dort (Tab/Shift+Tab) und geben ihn beim Schließen an den Auslöser zurück; klickbare Tabellenzeilen und Absätze sind per Tab erreichbar und mit Enter/Leertaste bedienbar; scrollbare Bereiche sind fokussierbar; sichtbarer Fokusrahmen (`:focus-visible`) (T-209).
- **Responsiv:** unter 800 px Menü-Schalter statt dauerhafter Navigation, gestapelte Layouts, Tabellen scrollen innerhalb ihrer Karte; keine horizontale Scrollleiste der Seite (bei 390 px geprüft). `prefers-reduced-motion` wird beachtet.

## Konsequenzen
- Automatische Prüfungen finden etwa ein Drittel der WCAG-Probleme. Eine Prüfung mit Screenreader (NVDA/VoiceOver) durch Fachleute bleibt vor einem produktiven Einsatz empfohlen.
