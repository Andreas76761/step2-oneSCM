# ADR-048 Stilwert-Verlauf

**Status:** akzeptiert, umgesetzt in Etappe 17 (erweitert ADR-043)

## Entscheidung
- **Messpunkte** (Tabelle `style_scores`): je Kapitel Version, Stilwert, Sätze und Problemsätze mit Zeitpunkt. Ein neuer Eintrag entsteht nur, wenn sich Version, Stilwert oder Problemsätze gegenüber dem letzten Eintrag geändert haben – beim Aufruf der Stilwert-Übersicht (Dashboard) sowie nach Stapelkorrektur und KI-Stapelumformulierung.
- **API** `GET /style/history?days=90` (Projekt: je Tag der nach Sätzen gewichtete Durchschnitt der jeweils letzten Werte aller Kapitel; je Kapitel die Messpunkte und die Veränderung im Zeitraum) bzw. `?chapterId=` (Messpunkte eines Kapitels, mit Startwert vor dem Zeitraum).
- **Dashboard:** Linie des Projektdurchschnitts (eine Reihe, Achse 0–100, Endwert beschriftet, Fadenkreuz mit Tooltip, Werte zusätzlich als Tabelle) und Spalte „Veränderung (90 Tage)“ je Kapitel (▲ besser / ▼ schlechter, nicht nur farbig).

## Konsequenzen
- Der Verlauf beginnt mit dem ersten Dashboard-Aufruf nach dem Update; das Diagramm erscheint ab zwei Tagen mit Messwerten.
- Einzelkorrekturen in der Werkstatt erscheinen beim nächsten Dashboard-Aufruf im Verlauf.
