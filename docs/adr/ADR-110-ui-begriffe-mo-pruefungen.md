# ADR-110 UI-Begriffe in der Terminologie: „MO-Prüfungen“ im Fließtext, „MO Checks“ in der Oberfläche

**Status:** akzeptiert, umgesetzt in Etappe 57. Teilentscheidung zu S-04 aus docs/10. Erweitert ADR-097 (Terminologie, Wortlisten je Sprache) und ADR-036 (Stammdaten-Import).

## Kontext
In `SYNONYME.csv` standen neun Begriffe mit Status „offen“. Für einen gab es zwei Schreibweisen: den deutschen Handbuchbegriff „MO-Prüfungen“ und den UI-Begriff „MO Checks“ (Menü „Vertragserstellung › MO Checks“).

Die Terminologie der App kannte bisher nur „bevorzugt“ und „zu vermeiden“, und zwar überall. Ein Begriff der Oberfläche in einem Menüpfad wäre also als Fehler gemeldet worden.

Entscheidung vom 24.10.2026:
- „**MO-Prüfungen**“ im Fließtext;
- „MO Checks“ nur in Menüpfaden und als UI-Begriff in Anführungszeichen.

Weiter offen bleiben:
- Schreibweise der Systemnamen (Nemesis, VeDoc, CoFiCo, oneERP) – später nach der Oberfläche;
- deutscher Begriff für „Grace Period“ – später durch die Redaktion;
- U-07, weitere Sprachen – keine Auswahl.

## Entscheidung
- **Merkmal „UI-Begriff erlaubt“** je Terminologie-Eintrag (`uiAllowed`). Ist es gesetzt, meldet die Stilprüfung die zu vermeidenden Varianten nur im Fließtext. Erlaubt bleiben sie:
  - in Anführungszeichen („…“, "…", “…”, «…», ‚…‘);
  - in einem fett gesetzten Menüpfad (`**Vertragserstellung › MO Checks**`);
  - direkt am Trenner „›“ (Versand › MO Checks).

  Ein Menüpfad an anderer Stelle im Satz genügt nicht („Öffnen Sie Versand › Sendungen und starten Sie die MO Checks“ wird gemeldet).
- Die Korrektur per Klick ersetzt wie bisher durch den bevorzugten Begriff, nur an den gemeldeten Stellen.
- Die KI-Umformulierung erhält bei solchen Begriffen den Hinweis `avoidAllowedIn: "Menüpfade (›) und Anführungszeichen"`. Ohne das Merkmal bleibt die Anfrage unverändert.
- **Pflege:** Seite „Terminologie“ (Bearbeiten → „zu Vermeidendes als UI-Begriff in Menüpfaden (›) und Anführungszeichen erlaubt“), Kennzeichen „UI-Begriff erlaubt“ in der Liste; Schnittstelle `uiAllowed` bei `POST /terminology` und `PATCH /terminology/{id}`.
- **SYNONYME.csv übernehmen:** Der Glossar-Import der Stammdaten liest auch die Datei des Arbeitsordners:
  - Spalte „Bevorzugt“ als Begriff;
  - neue Spalte „UI-Begriff erlaubt“ (ja/x/1);
  - Zeilen mit Status „offen“ oder „Vorschlag“ werden übersprungen und so gekennzeichnet („übersprungen“) – nur entschiedene Begriffe gelangen in die App.
- **Vorlagen:**
  - `SYNONYME.csv`: Zeile „MO-Prüfungen; MO Checks, Marktprüfung“ mit Status „entschieden“ und „UI-Begriff erlaubt = ja“.
  - `BEGRIFFE.md`, `CLAUDE.md` und Agent `sprach-lektor` angepasst.
  - Bestehende Arbeitsordner werden beim Abgleich nicht überschrieben; die Redaktion übernimmt die Zeile dort selbst oder liest die Vorlage ein.

## Begründung
- Ein Merkmal am Begriff ist allgemeiner als eine Sonderregel für „MO Checks“: Dasselbe gilt für weitere Begriffe der Oberfläche, sobald die Redaktion sie entscheidet.
- Anführungszeichen und Menüpfade sind die Schreibweise der Hausregeln für UI-Elemente (GRAMMATIK.md, G-R2); sie lassen sich ohne Wörterbuch sicher erkennen.

## Folgen
- Migration 063: `terminology_terms.ui_allowed`.
- Die Gliederung behält den Kapitelnamen „09 MO Checks und fachliche Prüfungen“, weil die Ordnernamen der Arbeitsordner davon abhängen. Umbenennen ist auf Wunsch möglich, verlangt aber das Umbenennen der Ordner in bestehenden Arbeitsordnern.
- Weiter offen: Systemnamen, „Grace Period“ sowie FI-Beleg, Belegart und „Chassis Number“ (S-04, Redaktion); U-07.
