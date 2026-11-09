# ADR-125 Übersetzungswunsch mit Begründung

**Status:** akzeptiert, umgesetzt in Etappe 27 (erweitert ADR-075)

## Kontext
Übersetzungswünsche aus der Leseransicht zeigten der Redaktion nur die Anzahl. Ob ein Kapitel für eine Schulung nächste Woche oder „irgendwann“ gebraucht wird, war nicht erkennbar.

## Entscheidung
- **Optionale Begründung** beim Anfordern (`reason`, höchstens 300 Zeichen, Leerraum zusammengefasst; Spalte `translation_requests.reason`, Migration 035). Die Leseransicht fragt sie in der Lesesprache erst nach dem Klick auf „Übersetzung anfordern“ ab („Wofür brauchen Sie die Übersetzung? (optional)“), damit der Hinweis kurz bleibt.
- Ein erneuter Wunsch derselben Person zählt nicht doppelt; eine neue Begründung ersetzt die bisherige, ein Wunsch ohne Begründung lässt sie stehen.
- **Redaktion:** „Gewünschte Übersetzungen“ zeigt je Kapitel und Sprache die Begründungen (aufklappbar, neueste zuerst) **ohne Namen** – die Redaktion sieht, wofür, nicht wer. Der erste Hinweis im Kapitel enthält die Begründung.

## Konsequenzen
- Bessere Priorisierung ohne zusätzliche Rückfragen.
- Begründungen sind Freitext von Lesern; sie werden nicht an KI-Dienste weitergegeben.
