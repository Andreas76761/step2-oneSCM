# ADR-056 Einführung beim ersten Start

**Status:** akzeptiert, umgesetzt in Etappe 19 (ergänzt ADR-053)

## Entscheidung
- Kurze **Tour mit sechs Hinweisen**: Startseite, Menü nach Arbeitsablauf, Kapitel-Assistent, Anleitungs-Check, Leseransicht, Schaltfläche „Einführung“. Das jeweilige Ziel wird umrandet, der Hinweis erscheint daneben (schmaler Bildschirm: unten mittig).
- Erscheint beim ersten Aufruf der Startseite; danach nicht mehr (Merker je Browser, `onescm.tour.done`). Jederzeit neu startbar über „Einführung“ im Benutzerbereich.
- **Barrierefreiheit:** nicht modaler Dialog (`role="dialog"`, beschriftet), Fokus auf die Überschrift des Hinweises, Weiter/Zurück/Überspringen als Schaltflächen, Esc schließt; die Seite bleibt bedienbar.
- Automatisierte Browser (`navigator.webdriver`) starten die Tour nicht von selbst, damit Tests und Bildschirmfotos nicht verdeckt werden; über die Schaltfläche ist sie auch dort prüfbar.

## Konsequenzen
- Der Merker gilt je Browser, nicht je Benutzerkonto.
