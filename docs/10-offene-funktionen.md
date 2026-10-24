# 10. Offene Funktionen: Abgleich mit den oneSCM-Artefakten (Stand v0.44, 24.10.2026)

Abgeglichen wurden die zwölf oneSCM-Artefakte aus [docs/07](07-bestehende-artefakte.md). Vier davon wurden seit der ersten Auswertung geändert: Screenarchiv (23.10.), Ticket-Cockpit (v3.0, 19.10.), Releaseletter-Prüfer und Screenshot-Studio (18.10.). Grundlage ist der Stand der App v0.43.0 und des Arbeitsordners (`tools/handbuch-ordner`). Die Artefakte wurden nur gelesen.

Beispieldaten in DokuPress, im Screenarchiv (Belege) und im Screenshot-Studio sind **erfunden**. Personenbezogene Daten aus den Artefakten sind hier nicht übernommen.

- **Aufwand:** **S** ≤ 1 Tag · **M** 2–4 Tage · **L** ≥ 1 Woche
- **Empfehlung:** **übernehmen** · **optional** · **später** · **nein**

Alle Vorschläge gelten mit der Vorgabe „Daten bleiben lokal“. KI nur über einen lokalen bzw. selbst betriebenen Dienst, Prüfungen sonst regelbasiert.

## 10.1 Schon in der App (Grammatik, Stil, Übersetzung)

| Bereich | Vorhanden | Seit |
|---|---|---|
| Schreibstil, regelbasiert (Deutsch) | 17 Regeln:<br>• langer Satz, Passiv, Futur und Vergangenheit (Präsens-Pflicht)<br>• Füllwort, Umgangssprache, unklare Anweisung, Nominalstil, Unpersönlich<br>• doppeltes Wort, Zeichensetzung, Großschreibung<br>• Rechtschreibung (Fehlerliste), Abkürzung, Terminologie, Anrede Sie/du<br>• eigene Formulierungsregeln „vermeiden → ersetzen“ (= Negativliste)<br>Korrektur per Klick und für ganze Kapitel, Verlauf je Kapitel, Regelbibliotheken für mehrere Projekte | ADR-040, ADR-044 |
| Anleitungs-Check | zwölf Prüfpunkte als Muss/Soll mit Punkten, Warnhinweis-Schema (Signalwort, Gefahr, Folge, Vermeidung), Mindestwert als Freigabebedingung | ADR-051, ADR-083, ADR-092 |
| Kapitelanweisung | „wichtig“ und „nicht beschreiben“ mit Vorrang für Generator, KI und Check | ADR-096 |
| KI-Umformulierung | Beleg je Satz, Prüfung auf neue Zahlen und Datenschutz, Ton über Redaktionshinweis | ADR-013 |
| Terminologie | bevorzugt/vermeiden, Definition (Glossar), feste Übersetzung je Sprache, Begriffskandidaten aus Tickets | Grundfunktion, ADR-083 (F-12) |
| Übersetzung | 11 Zielsprachen (EN, FR, ES, IT, NL, PL, CS, PT, SK, KO, MS), KI-Übersetzung mit Satz-Zuordnung. Prüfungen:<br>• Zahlen, Struktur, Platzhalter, Formatierung<br>• Signalwörter, feste Begriffe<br>„veraltet“, sobald die deutsche Freigabe neuer ist; Freigabe je Sprache; FAQ-Übersetzungen; Übersetzungswünsche aus der Leseransicht | ADR-020, ADR-083 |
| Arbeitsordner | `GRAMMATIK.md` (Rechtschreibung, Zeichensetzung, Zahlen), `TONALITAET.md`, `SYNONYME.csv`, `FEHLERLISTE.csv`, Agent sprach-lektor, IV Translation mit Glossar, Übersetzungsspeicher (CSV) und Länderreview je Sprache | Etappe 27 ff. |

## 10.2 Grammatik – offen

| ID | Funktion | Herkunft | Stand in der App | Aufwand | Empfehlung |
|---|---|---|---|---|---|
| G-01 | **Hausregeln aus `GRAMMATIK.md` als Prüfregeln** – deutsche Anführungszeichen „…“ (G-Z1), Halbgeviertstrich mit Leerzeichen (G-Z2), Menüpfad mit › (G-Z3), kein Punkt nach Überschrift (G-Z4), Zahlen bis zwölf ausschreiben (G-N1), Tausenderpunkt/Dezimalkomma (G-N2), geschütztes Leerzeichen vor Einheit und % (G-N3), Datum TT.MM.JJJJ (G-N4), Zeitraum mit Halbgeviertstrich (G-N6), Produktname „oneSCM“ (G-R1) | Arbeitsordner, Wortliste Screenarchiv | nicht geprüft (nur im Arbeitsordner beschrieben) | M | **umgesetzt in Etappe 44 (ADR-097)** |
| G-02 | **Leerzeichen-Regeln:** mehrfache Leerzeichen, Leerzeichen vor Satzzeichen, wiederholte Satzzeichen, fehlendes Satzende | Releaseletter-Prüfer | teilweise (Zeichensetzung) | S | **war bereits vorhanden (Regel „Zeichensetzung“)** |
| G-03 | **Rechtschreib-Fehlerliste erweitern** (52 DE/EN-Einträge wie „Standart“) und **Fachbegriffe-Whitelist** (82 Begriffe: oneSCM, VIN, BTO …), Import/Export | Releaseletter-Prüfer | teilweise (eigene Liste, keine Whitelist, kein Import) | S | **umgesetzt in Etappe 44 (ADR-097)** |
| G-04 | **Lokale Grammatikprüfung mit LanguageTool** (selbst betrieben, Deutsch und Englisch): Kongruenz, Kommasetzung, Groß-/Kleinschreibung über Regeln hinaus | DokuPress-Konzept (F-11) | nicht vorhanden | M | **übernehmen**, sofern LanguageTool lokal betrieben werden darf (Java-Dienst oder Docker) |
| G-05 | **Fehlerliste in der App** – gefundene Sprachfehler mit Fundstelle, Korrektur, Kategorie, Status; Abgleich mit `FEHLERLISTE.csv` des Arbeitsordners | Arbeitsordner (sprach-lektor) | nicht vorhanden (nur als Datei) | M | optional |
| G-06 | **Englische Texte prüfen:** a/an, „i“ → „I“, Satzanfang, Tippfehler (für Releaseletter EN und Übersetzungen) | Releaseletter-Prüfer | nicht vorhanden – Schreibstil nur Deutsch | S | **umgesetzt in Etappe 44 (ADR-097)** |
| G-07 | **KI-Lektorat mit Diff:** Korrekturen gelb markiert, beim Überfahren das Original, Übernahme je Kapitel oder alle | Ticket-Cockpit v3.0 | teilweise (KI-Vorschlag je Absatz mit Vergleich, Stil-Korrektur je Kapitel) | S | optional – Anzeige vereinheitlichen |

## 10.3 Sprachstil – offen

| ID | Funktion | Herkunft | Stand in der App | Aufwand | Empfehlung |
|---|---|---|---|---|---|
| S-01 | **Lesbarkeitswerte je Kapitel und Rolle:** LIX (unter 40 leicht, 40–50 mittel, über 50 schwer), Flesch-Amstad (mindestens 60 für Endanwender, 40 für Admin/Service), Ø Wörter je Satz (höchstens 15), Anteil langer Sätze (> 25), Passivanteil; als Soll-Werte im Anleitungs-Check | Werkstatt V4, Checkliste (Multi-Agent-Gate) | teilweise (lange Sätze, Passiv einzeln; kein Lesbarkeitsindex) | S | **umgesetzt in Etappe 44 (ADR-097)** |
| S-02 | **Tonalität je Produktart bzw. Zielgruppe:** sachlich (Handbuch), freundlich, formell, knapp; sechs Rollenprofile mit eigener Tonalität; gilt für Prüfung und KI-Vorschläge | Ticket-Cockpit, Checkliste, `TONALITAET.md` | teilweise (nur Anrede Sie/du und freier Redaktionshinweis) | M | **umgesetzt in Etappe 49 (ADR-102)** |
| S-03 | **Wortliste je Sprache** „falsch → richtig (Sprache)“, z. B. Dealer→Händler (de), Händler→Dealer (en), OneSCM→oneSCM; Prüfung „Text passt nicht zur Sprache des Labels“ | Screenarchiv | teilweise (eigene Regeln nur Deutsch; feste Übersetzung je Sprache) | S | **umgesetzt in Etappe 44 (ADR-097) – ohne Prüfung „Text passt nicht zur Sprache“ (mit U-02)** |
| S-04 | **„Fix-Sprache“ je Begriff:** Begriff überall immer deutsch oder immer englisch (UI-Begriff), Anweisung an KI und Prüfung | Ticket-Cockpit v2.96 | teilweise (feste Übersetzung je Sprache; kein „immer so lassen“) | S | **umgesetzt in Etappe 44 (ADR-097) – welche Begriffe, entscheidet die Redaktion** |
| S-05 | **Textvarianten je Kapitel:** Endanwender, Fachtext, Kurzfassung (Management, ~¼ Länge) | Ticket-Cockpit | teilweise (Quick Guide, One Pager, Lesefassung) | M | optional |
| S-06 | **Regelbasiertes Schreiben (tekom), ASD-STE100, Vale** als zuschaltbare Regelsätze | Checkliste | nicht vorhanden | L | später |
| S-07 | **Kapitelbewertung mit fünf Kriterien** (Sprache, Ziel, Tonalität, Quellenabgleich, Fakten) und Ampel | Wissenssuche | teilweise (Anleitungs-Check, Schreibstil, Evidenz getrennt) | S | optional – Gesamtampel aus den vorhandenen Werten |
| S-08 | **Bildunterschriften-Regeln:** 1–2 Sätze, max. 200 Zeichen, UI-Begriffe wörtlich, keine Füller („Hier sieht man“) | Screenshot-Studio | teilweise (Bildunterschrift Pflicht, keine Stilprüfung) | S | **umgesetzt in Etappe 44 (ADR-097)** |

## 10.4 Übersetzung – offen

| ID | Funktion | Herkunft | Stand in der App | Aufwand | Empfehlung |
|---|---|---|---|---|---|
| U-01 | **Übersetzungsspeicher (Translation Memory):** bereits übersetzte und freigegebene Sätze wiederverwenden (100 % und ähnliche Treffer), Pflege und Export | DokuPress-Audit (F-31), Arbeitsordner (`SPEICHER.csv`) | nicht vorhanden | L | **umgesetzt in Etappe 48 (ADR-101)** |
| U-02 | **Weitere Prüfungen:** Längenverhältnis außerhalb 0,55–1,8 bzw. ±30 %, deutsche Wörter im Zieltext (Fehler), Werte/IDs/Daten nur auf einer Seite | Releaseletter-Prüfer, Checkliste | teilweise (Zahlen, Platzhalter, Struktur, Signalwörter, feste Begriffe) | S | **umgesetzt in Etappe 48 (ADR-101)** |
| U-03 | **Länderreview als Arbeitsschritt:** Prüferin bzw. Prüfer je Sprache/Markt, Kommentare, „zurück an Übersetzung“, Freigabe durch das Land; MQM-Fehlerpunkte (≤ 5 je 1 000 Wörter) | Checkliste, Arbeitsordner (`REVIEW.md`) | teilweise (eine Freigabe je Sprache) | M | **umgesetzt in Etappe 48 (ADR-101)** |
| U-04 | **Glossar je Sprache** als eigene Sicht und Export (CSV/Excel) für Übersetzer, Import zurück | Ticket-Cockpit, Releaseletter-Prüfer (287 EN→DE), Arbeitsordner (`GLOSSAR.csv`) | teilweise (feste Übersetzung im Begriff gespeichert) | S | **umgesetzt in Etappe 48 (ADR-101)** |
| U-05 | **XLIFF bzw. Excel hin und zurück** für externe Übersetzungsbüros (Segmente mit ID, Rückimport mit Prüfung) | DokuPress, Checkliste | nicht vorhanden | M | **umgesetzt in Etappe 48 (ADR-101)** |
| U-06 | **Rückübersetzung von Sicherheitshinweisen** (Stichprobe 10 %) | Checkliste | nicht vorhanden | S | **umgesetzt in Etappe 48 (ADR-101)** |
| U-07 | **Weitere Sprachen:** Hindi, Türkisch, Ungarisch, Rumänisch, Japanisch, Chinesisch, Arabisch, Schweizer Varianten de-CH/fr-CH | Screenarchiv (22 Sprach-Labels), Ticket-Cockpit (HI), Releaseletter-Prüfer (TR) | 11 Sprachen | S je Sprache | **teilweise umgesetzt in Etappe 48 (ADR-101): de-CH, fr-CH; weitere Märkte offen** |
| U-08 | **Übersetzung der Rahmentexte** in Export und Druck (Deckblatt, Kopf-/Fußzeile, Verzeichnisse, „Gültig ab“, „Historie“) | Screenarchiv | teilweise (Leseransicht und Abschnittstitel übersetzt) | S | **umgesetzt in Etappe 48 (ADR-101)** |
| U-09 | **Releaseletter DE↔EN** übersetzen und prüfen | Ticket-Cockpit, Releaseletter-Prüfer | teilweise (Releaseletter mit Prüfregeln, Übersetzung nicht angebunden) | S | **umgesetzt in Etappe 48 (ADR-101)** |
| U-10 | **Übersetzung von Bildern:** Hinweis, wenn für eine Sprache keine Bildvariante existiert | Screenarchiv | teilweise (Varianten, Deckungsmatrix) | S | **umgesetzt in Etappe 48 (ADR-101)** |

## 10.5 Weitere offene Funktionen

| ID | Funktion | Herkunft | Stand | Aufwand | Empfehlung |
|---|---|---|---|---|---|
| W-01 | **Kapitelanweisung für Handbuch-Varianten** (eigene Anweisung je Variantenkapitel bzw. Gliederungsknoten, zusätzlich zur Anweisung des Quellkapitels) | eigener Befund (ADR-096) | offen | S | **umgesetzt in Etappe 44 (ADR-097)** |
| W-02 | **Plausibilität Text ↔ Quellen je Aussage** (belegt, unbelegt, Widerspruch, fehlend) mit Wert 0–100 | Ticket-Cockpit v2.91 | teilweise (Beleg je Satz, Evidenz) | S | optional – Wert je Kapitel aus der Evidenz |
| W-03 | **Ticket-Einstufung** genehmigt / in Prüfung / intern / Background; intern und Background fließen nicht ins Handbuch, Background nur in die Lückenanalyse | Ticket-Cockpit | teilweise (Bug = intern im Release-Abgleich) | S | **umgesetzt in Etappe 49 (ADR-102)** |
| W-04 | **Releaseletter-Entwurf aus Projektvergleich** (geänderte Bilder, Kapitel und Funktionen eines Release) | Screenarchiv | teilweise (Releaseletter aus Tickets, Historie seit v0.43) | M | **umgesetzt in Etappe 49 (ADR-102)** |
| W-05 | **Vorher/Nachher-Belege** mit Schieberegler (Anlass, Änderung, Wirkung) | Screenarchiv | teilweise (Bildfassungen) | S | optional |
| W-06 | **Word zurücklesen:** in Word überarbeitete Exporte mit Kriterium „Fertig, wenn …“ wieder einlesen und als Änderung vorschlagen | Screenarchiv | teilweise (Word-Import als Quelle) | M | optional |
| W-07 | **Ausgabe als PowerPoint** und Klickstrecke als BPMN | Screenarchiv, Screenshot-Studio, Wissenssuche | nicht vorhanden | M | optional |
| W-08 | **Interne Kommentare**, die nie exportiert werden; Drei-Spalten-Editor (Stand, Verbesserungen, neu) | Ticket-Cockpit v3.0 | teilweise (Diskussion je Absatz, Versionsvergleich) | S | optional |
| W-09 | **Zukunfts-Inhalte:** eingebaut, aber erst ab Release X veröffentlicht | DokuPress | teilweise („gültig ab“ seit v0.43, ohne Ausblenden) | S | **umgesetzt in Etappe 49 (ADR-102)** |
| W-10 | **Zwischenbilder** für kurze Zustände (Menü, Dialog) aus Videos | Screenshot-Studio | teilweise (Standbilder bei Änderung) | S | optional |
| W-11 | **Textbausteine (Single Sourcing)** | Werkstatt V4 (F-19) | offen | L | später |
| W-12 | **Vier Prüferprofile** (fachlich, Redaktion, Compliance, Endanwender) mit lokalem Modell | Ticket-Cockpit (F-10) | teilweise | M | optional |

## 10.6 Vorschlag für die nächsten Etappen

1. **Etappe 44 – Grammatik und Sprachstil (✅ umgesetzt, ADR-097):**
   - G-01, G-02, G-03 und G-06 (Hausregeln, Leerzeichen, Fehlerliste/Whitelist, Englisch);
   - S-01 (Lesbarkeitswerte im Check), S-03, S-04 (Wortliste je Sprache, Fix-Sprache), S-08 (Bildunterschriften);
   - W-01 (Anweisung für Varianten).
2. **Etappe 45 – Pipeline, Backlog, Intern (✅ umgesetzt, ADR-098):** neuer Wunsch des Auftraggebers, vor der Übersetzung eingeschoben.
3. **Etappe 48 – Übersetzung (✅ umgesetzt, ADR-101):** U-01 … U-10; Sprachen de-CH und fr-CH, Austausch per XLIFF 1.2 und Excel (Entscheidungen 24.10.2026).
   Ursprünglich geplant:
   - U-02 (weitere Prüfungen), U-04 (Glossar je Sprache), U-08 (Rahmentexte), U-09 (Releaseletter EN);
   - U-03 (Länderreview);
   - danach U-01 (Übersetzungsspeicher).
4. **Etappe 49 – Tonalität, Ticket-Einstufung, Projektvergleich, Zukunfts-Inhalte (✅ umgesetzt, ADR-102):** S-02, W-03, W-04, W-09.
5. **Danach je nach Entscheidung:** G-04 (LanguageTool lokal), U-07 (weitere Märkte und Sprachen).

## 10.7 Offene Entscheidungen

1. **LanguageTool:** Darf LanguageTool lokal betrieben werden (G-04)? Es braucht Java oder Docker; Daten bleiben auf dem Rechner.
2. **Sprachen:** de-CH und fr-CH entschieden am 24.10.2026. Offen: weitere Märkte (Hindi und Türkisch stehen in den Artefakten).
3. **Übersetzungsbüros:** entschieden am 24.10.2026 – Austausch per XLIFF 1.2 und Excel (U-05, umgesetzt).
4. **Schreibweise:** Wie lautet die Schreibweise der offenen Begriffe in `SYNONYME.csv`, z. B. „MO Checks“ oder „MO-Prüfungen“? Davon hängt S-04 ab.
