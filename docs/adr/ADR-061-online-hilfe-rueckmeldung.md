# ADR-061 Rückmeldungen in der Online-Hilfe

**Status:** akzeptiert, umgesetzt in Etappe 20 (erweitert ADR-030, ADR-054)

## Entscheidung
- Die öffentliche Kontexthilfe (`/help/embed/{projekt}/{kontext}`) enthält ein Formular **„War das hilfreich?“** (Ja/Nein, optional „Was fehlt?“, max. 500 Zeichen) – ohne Skripte, CSP unverändert (`form-action 'self'`), in allen Sprachen der Einbettung.
- **Nur veröffentlichte Hilfe:** Projekt mit freigeschalteter Einbettung, Kontext-ID mit Kapitel im neuesten Release; Rückmeldung zur Kapitelversion des Releases.
- **Missbrauchsschutz:** höchstens `HELP_FEEDBACK_MAX` (Standard 10) Rückmeldungen je Stunde und Adresse (danach 429), unsichtbares Honigtopf-Feld (ausgefüllt → bestätigt, aber nicht gespeichert), Längenbegrenzung.
- Gespeichert als anonyme Rückmeldung (`chapter_feedback.source = 'online-help'`, Absender „online-hilfe“); jede Stimme zählt einzeln. Kritik erreicht die Redaktion wie in ADR-054 (Hinweis „(Online-Hilfe)“), die Auswertung (ADR-058) weist den Anteil aus der Online-Hilfe aus.

## Konsequenzen
- Die Grenze je Adresse gilt je Instanz (Speicher im Prozess); hinter einem Proxy ist `trustProxy` für die echte Adresse nötig.
