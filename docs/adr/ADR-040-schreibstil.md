# ADR-040 Schreibstil: Prüfung, gelb markierte Sätze, Umformulierung und Präsens

**Status:** akzeptiert, umgesetzt in Etappe 14

## Kontext
Die Handbuchtexte stammen aus vielen Quellen und Federn: Vergangenheit und Futur statt Präsens, Passiv, „man“, Füllwörter, Umgangssprache, Tippfehler, lange Sätze. Die Lesbarkeitsprüfung der Qualitätsanalyse bewertet nur Kennzahlen; Redakteurinnen und Redakteure brauchen konkrete Stellen mit Korrekturvorschlag. Vom Auftraggeber am 25.09.2026 festgelegt: Regeln + KI; Textquellen freies Textfeld, Kapitel der Werkstatt und Textschnipsel der Quellen.

## Entscheidung
- **Neuer Navigationspunkt „Schreibstil“** mit drei Quellen: Textfeld (einfügen, prüfen, kopieren), Kapitel (Absätze der neuesten Version; im Entwurf korrigieren und als neue Absatzversion über `PATCH /content-blocks/:id` mit Versionsprüfung speichern) und Textschnipsel (nur prüfen – Quellen bleiben unverändert).
- **Regelprüfung ohne KI** (`domain/style.ts`, reine Fachlogik): Satzzerlegung mit Positionen (Abkürzungen wie „z. B.“ trennen nicht), Regeln für lange Sätze (Grenze aus den Lesbarkeitseinstellungen, höchstens 25 Wörter), Passiv, Futur, Vergangenheit, Füllwörter, Wortdopplungen, Zeichensetzung, Großschreibung am Satzanfang, „man“, Umgangssprache, Abschwächungen, Nominalstil, häufige Rechtschreibfehler, Abkürzungsschreibweise und die Terminologie des Projekts. Jeder Hinweis hat Position, Schwere (Problem/Hinweis) und – wo eindeutig – eine Korrektur. Stilwert 0–100.
- **Gelbe Markierung:** Sätze mit Problemen haben gelben Hintergrund (Kontrast geprüft, auch im Dunkelmodus) und sind Schaltflächen: Klick öffnet die Satzbearbeitung mit Einzelkorrekturen, „Alle Korrekturen im Satz“ und freier Bearbeitung. „Automatisch korrigieren“ wendet alle eindeutigen Korrekturen an.
- **Umformulierung:** „Professionell umformulieren“ (Präsens, aktiv, Sie-Anrede, kurze Sätze, Terminologie) und „In Präsens umwandeln“ über den eingerichteten KI-Dienst (ADR-013: Datenschutzsperre für externe Dienste, Text als Daten, Audit nur mit Prüfsumme). Ohne KI-Dienst werden die Regelkorrekturen angewendet (`method: rules`). Das Ergebnis ist ein Vorschlag mit Vorher/Nachher; fehlende Zahlen werden gemeldet; übernommen wird nur ausdrücklich.
- API: `POST /style/check`, `POST /style/rewrite` (Berechtigung edit), `GET /style/chapter-versions/:versionId`, `GET /style/snippets`.

## Konsequenzen
- Regeln sind heuristisch (keine vollständige Grammatik): Passiv wird erkannt, aber nicht automatisch aktiviert; Präsens-Korrekturen decken die häufigen Formen (wurde/wurden/war/waren/hatte, „wird … werden“) ab. Die KI-Umformulierung deckt den Rest ab.
- Freigegebene oder eingereichte Kapitel sind nur prüfbar; Korrekturen erfordern eine neue Entwurfsversion (Revisionssicherheit).
