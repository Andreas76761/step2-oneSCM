# ADR-058 Rückmeldungen auswerten

**Status:** akzeptiert, umgesetzt in Etappe 20 (erweitert ADR-054)

## Entscheidung
- Seite **„Rückmeldungen“** (Menü „3 Prüfen“, `GET /feedback/insights?days=30|90|365`): Anzahl, Anteil „hilfreich“, offene Rückmeldungen; je Kapitel 👍/👎, Anteil „nicht hilfreich“ (als Balken, dringendste zuerst), Entwicklung (Anteil der letzten 30 Tage gegenüber den 30 Tagen davor, in Prozentpunkten mit ▲/▼ und Text), davon aus der Online-Hilfe; **häufige Begriffe** aus kritischen Kommentaren (ab zwei Nennungen, ohne Füllwörter); neueste Kommentare.
- **Aus Rückmeldung eine Aufgabe** (`POST /feedback/{id}/task`, Bearbeitungsrecht): Aufgabe (Kommentar vom Typ „Aufgabe“) am Kapitel mit zuständiger Person, die Rückmeldung gilt damit als erledigt. Daneben „In der Werkstatt öffnen“ und „Erledigt“.

## Konsequenzen
- Die Begriffsauswertung ist einfach (Wortzählung); Synonyme werden nicht zusammengefasst.
