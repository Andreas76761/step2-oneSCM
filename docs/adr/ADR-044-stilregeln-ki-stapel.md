# ADR-044 Eigene Stilregeln je Projekt und KI-Stapelumformulierung

**Status:** akzeptiert, umgesetzt in Etappe 16 (erweitert ADR-040, ADR-043)

## Kontext
Die Stilprüfung (ADR-040) hatte feste Regeln. Redaktionen haben eigene Vorgaben (Hauswörter, verbotene Wendungen, Du oder Sie, Satzlänge) und wollen einzelne Prüfungen abschalten. Die Stapelkorrektur (ADR-043) wandte nur Regelkorrekturen an; eine stilistische KI-Überarbeitung gab es nur je Text. Vom Auftraggeber am 25.09.2026 festgelegt.

## Entscheidung
- **Stilregeln je Projekt** (`projects.style_rules`, Migration `025_users_style`): ausgeschaltete Prüfungen (`disabled`), Anrede (`address`: sie/du/keine Prüfung), höchstens Wörter je Satz (`maxSentenceWords`, 8–60, sonst Lesbarkeitseinstellung), eigene Formulierungen (`phrases`: vermeiden → ersetzen / streichen / nur Hinweis, mit optionalem Hinweistext; höchstens 300).
- Neue Regeln **„Eigene Regel“** (`custom`) und **„Anrede“** (`address`): Sie-Anrede meldet du-Formen; du-Anrede meldet großgeschriebene Sie-Formen außerhalb des Satzanfangs (keine automatische Korrektur, da die Verbform mitgeändert werden muss).
- Die Regeln gelten überall: Prüfung, automatische Korrektur, Stapelkorrektur, Stilwert je Kapitel und KI-Umformulierung (Anrede, Satzlänge und Formulierungen werden dem KI-Dienst mitgegeben).
- API `GET/PUT /style/rules` (lesen für alle, ändern mit „admin“); Oberfläche: Schreibstil › Regeln.
- **KI-Stapelumformulierung** in der Werkstatt („🖋️ Stil korrigieren“ › „✨ KI: professionell umformulieren“ / „✨ KI: ins Präsens“): Die Oberfläche lässt jeden Absatz einzeln über `POST /style/rewrite` umformulieren (Fortschritt, Abbruch, Datenschutzsperre je Absatz), zeigt vorher/nachher; Vorschläge mit fehlenden Zahlen sind nicht vorausgewählt; Absätze mit Bildern und gesperrte Absätze werden ausgelassen. Übernahme mit `POST /style/chapter-versions/{versionId}/apply` (Versionsprüfung je Absatz, Konflikte werden übersprungen, Grund im Verlauf).
- **Suche:** Treffer werden je Bereich gewichtet (Kapitel ×2, Kapiteltexte ×1,5, FAQ/Terminologie/Abkürzungen leicht erhöht, Quellen ×0,5), damit Kapitel vor Quellen stehen, die nur über den Dateipfad passen.

## Konsequenzen
- Die Anrede-Prüfung „du“ erkennt „Sie“ am Satzanfang nicht (mehrdeutig mit „sie“).
- Die KI-Stapelumformulierung braucht je Absatz eine Anfrage an den KI-Dienst; bei großen Kapiteln dauert das entsprechend (Fortschritt sichtbar, abbrechbar).
