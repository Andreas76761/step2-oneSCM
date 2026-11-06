# ADR-097 Grammatik und Sprachstil: Hausregeln, Englisch, Lesbarkeit, Wortliste je Sprache, „nicht übersetzen“, Anweisung für Varianten

**Status:** akzeptiert, umgesetzt in Etappe 44 (Übersicht [docs/10](../10-offene-funktionen.md): G-01, G-02, G-03, G-06, S-01, S-03, S-04, S-08, W-01; erweitert ADR-040, ADR-044, ADR-083, ADR-096)

## Kontext
Der Abgleich mit den oneSCM-Artefakten (docs/10) zeigte Lücken bei Grammatik und Sprachstil:
- Die Hausregeln aus `GRAMMATIK.md` des Arbeitsordners standen nur auf Papier.
- Englische Texte (Übersetzungen, Releaseletter EN) wurden nicht geprüft.
- Es gab keinen Lesbarkeitswert mit Sollwerten je Zielgruppe.
- Eigene Regeln galten nur für Deutsch.
- Ein Begriff ließ sich nicht als „in jeder Sprache unverändert“ festlegen.
- Bildunterschriften wurden nicht geprüft.
- Kapitel der Handbuch-Varianten hatten keine eigene Kapitelanweisung.

## Entscheidung
- **Hausregeln als Prüfregeln** (regelbasiert, ohne Netz; Korrektur per Klick):
  - `typography`: deutsche Anführungszeichen „…“ statt "…"/“…”, Gedankenstrich „ – “ statt „ - “, Menüpfad mit „ › “ statt >, ->, →, kein Punkt nach Überschriften.
  - `numbers`:
    - Zahlen 2–12 im Fließtext ausschreiben – nicht mit Einheit, in Listen, Tabellen, Überschriften, nach „Kapitel/Schritt/Version …“.
    - Tausenderpunkt ab fünf Stellen (nicht bei Nummern und IDs).
    - englisches Zahlenformat → Dezimalkomma.
    - geschütztes Leerzeichen zwischen Zahl und Einheit bzw. %.
    - ISO-Datum → TT.MM.JJJJ.
    - Zeitraum 2023–2027 mit Halbgeviertstrich.
  - `product_name`: „oneSCM“ in allen Sprachen; Ticketschlüssel wie ONESCM-1234 bleiben.
  - Code (`…`), Links und URLs sind ausgenommen.
- **Leerzeichen und Satzzeichen (G-02):** waren bereits Teil der Regel „Zeichensetzung“ und bleiben unverändert.
- **Rechtschreibung:**
  - Die Fehlerliste wurde um gut 30 deutsche Einträge erweitert; dazu kommt eine englische Liste mit etwa 60 Einträgen.
  - **Erlaubte Begriffe** (Whitelist je Projekt, bis 1 000, Import als Textliste): Fundstellen mit genau diesem Wortlaut werden nie gemeldet.
- **Sprache des Textes:**
  - **Deutsch** prüft alle Regeln.
  - **Englisch** prüft zusätzlich die Regel `grammar`: a/an nach Laut (Ausnahmen wie „a user“, „an hour“, Abkürzungen nach Buchstabenname: „an MO“), „i“ → „I“, englische Rechtschreibung.
  - **Andere Sprachen** prüfen nur sprachneutrale Regeln: Zeichensetzung, doppelte Wörter, Satzanfang, Produktname und eigene Regeln der Sprache.
  - Terminologie und Anrede gelten nur für Deutsch.
  - Die Prüfung steht im Textfeld (Sprachwahl) und je Absatz einer Übersetzung (`style`).
- **Wortliste je Sprache:** eigene Formulierungen tragen eine Sprache (ohne Angabe Deutsch), z. B. Dealer → Händler (de), Händler → Dealer (en). CSV mit Spalte „sprache“; Import versteht auch „falsch;richtig;sprache“.
- **Lesbarkeit:**
  - Kennzahlen je Kapitel: LIX, Flesch-Amstad (180 − Ø Satzlänge − 58,5 × Ø Silben je Wort), Ø Wörter je Satz, Anteil der Sätze über 25 Wörter, Passivanteil. Silben werden angenähert über Vokalgruppen; Diphthonge zählen als eine Silbe.
  - Sollwerte je Zielgruppe (Projekteinstellung):
    - **Endanwender:** Flesch ≥ 60, LIX ≤ 50, Ø ≤ 15 Wörter, höchstens 10 % lange Sätze, höchstens 20 % Passiv.
    - **Fachanwender/Administration:** Flesch ≥ 40, LIX ≤ 55, Ø ≤ 20 Wörter, höchstens 20 % lange Sätze, höchstens 30 % Passiv.
  - Anzeige im Anleitungs-Check, in der Kapitelübersicht und im Schreibstil je Kapitel. Die Werte zählen nicht zum Punktwert und sperren keine Freigabe.
- **„Nicht übersetzen“ (Fix-Sprache):**
  - Ein Begriff der Terminologie kann so markiert werden; er gilt dann in jeder Projektsprache als feste Übersetzung = deutscher Begriff.
  - Die KI-Übersetzung erhält ihn als „X → X“, die Übersetzungsprüfung meldet Abweichungen.
  - Welche Begriffe so behandelt werden (z. B. „MO Checks“), entscheidet die Redaktion; die offenen Begriffe aus `SYNONYME.csv` bleiben offen (entschieden am 24.10.2026: „MO-Prüfungen“ im Fließtext, „MO Checks“ als UI-Begriff – ADR-110).
- **Bildunterschriften:** höchstens 200 Zeichen und zwei Sätze, ohne Füller wie „Hier sieht man“ (Prüfregeln `caption_long`, `caption_sentences`, `caption_filler` im Bildarchiv). Platzhalter sind ausgenommen.
- **Kapitelanweisung für Handbuch-Varianten:**
  - Variantenkapitel haben eine eigene Anweisung (Kapitelsteuerung, Auswahl „Gliederung“).
  - Beim Generieren gilt sie zusammen mit der Anweisung der Quellkapitel und -unterkapitel, aus denen die Absätze stammen.
  - Der Export `/structure/instructions/export` enthält die Varianten; `abgleich --app` schreibt sie nach `03_Varianten/<Name>/<Kapitel>/ANWEISUNG.md`.

## Folgen
- Migration `051_style_keep_terms.sql`; Tests T-296 … T-299, E2E T-300; Anforderungen NFR-104 … NFR-107.
- Mehr Hinweise in bestehenden Texten (vor allem `numbers` als Info, Anführungszeichen als Warnung). Wer eine Regel nicht will, schaltet sie unter Schreibstil › Regeln aus.
- Offen bleiben eine echte Grammatikprüfung (G-04, LanguageTool lokal – Entscheidung nötig), die Fehlerliste in der App (G-05) und Tonalität je Zielgruppe (S-02).
