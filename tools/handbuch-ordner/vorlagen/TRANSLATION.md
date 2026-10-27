# IV Translation

Steuerung aller Übersetzungen – lokal, ohne externe Übersetzungsdienste. Hier liegen Glossare, Übersetzungsspeicher und Länderreviews; die übersetzten Texte selbst liegen in `04_Output` (Kapitel) bzw. `05_I_Output/<Produkt>/03_Final/<Sprache>/` (Produkte).

## Zwei Richtungen

| Richtung | Ausgang | Ergebnis | Agent |
|---|---|---|---|
| **Quellen → Deutsch** | englische und andere fremdsprachige Quellen in `01_Quellen/Raw_*` | `dt_<Original>` neben dem Original | uebersetzer-de |
| **Deutsch → Zielsprachen** | freigegebener deutscher Master | Kapitel: `04_Output/<Sprache>/<Kapitel>/<Nr>_<Code>.md` · Produkte: `05_I_Output/<Produkt>/03_Final/<Sprache>/` | uebersetzer-ausgabe |

Übersetzt wird immer aus dem deutschen Master, nie aus einer anderen Übersetzung.

## Je Zielsprache

| Ordner/Datei | Inhalt |
|---|---|
| `01_Glossar/GLOSSAR.csv` | Fachbegriffe Deutsch → Zielsprache (Deutsch;Zielsprache;Kontext;Status;Quelle); Englisch dient auch für die Richtung Quellen → Deutsch |
| `02_Uebersetzungsspeicher/SPEICHER.csv` | bestätigte Satzpaare (Nr;Deutsch;Zielsprache;Datei;Ausgangsversion;Datum;Status) – wiederkehrende Sätze gleich übersetzen |
| `03_Laenderreview/REVIEW.md` | Dateien im Review mit Reviewer-Land, Status, Datum, Anmerkung |
| `03_Laenderreview/` | Rückmeldungen der Länder als Datei `<Datei>_<Land>_<JJJJ-MM-TT>.<ext>` |

Glossarbegriffe werden erst nach Bestätigung durch einen Menschen verbindlich (Status `Vorschlag` → `bestätigt`). Die Gesamttabelle der Fachbegriffe bleibt in `04_Output/SPRACHEN.md`.

## Review

- **Englisch ist die internationale Fassung** – ohne marktspezifische Abschnitte. Review durch **alle Länder gemeinsam**: jedes Land gibt Anmerkungen in `02_Englisch_EN/03_Laenderreview/REVIEW.md`, Widersprüche zwischen Ländern entscheidet die Redaktion; die Redaktion gibt frei.
- **Alle anderen Sprachen:** Sprachreview durch das jeweilige Land (Märkte laut `04_Output/SPRACHEN.md`). Erst danach gilt eine Übersetzung als freigegeben.
- Status in `REVIEW.md`: `bereit` → `im Review` → `Korrektur` → `geprüft` (bzw. `veraltet`, wenn sich der deutsche Master geändert hat).
- **Offen (O-09):** Ansprechperson für das Sprachreview je Land. Bis zur Entscheidung steht in `REVIEW.md` nur das Reviewer-Land, keine Person.

## Ablauf

1. Mensch gibt das deutsche Kapitel bzw. Produkt frei.
2. „uebersetzer-ausgabe: Kapitel 6, alle Sprachen“ – nutzt Glossar und Übersetzungsspeicher, legt die Übersetzung ab und trägt sie in `REVIEW.md` mit Status `bereit` ein.
3. Das Land prüft; Korrekturen übernimmt der uebersetzer-ausgabe, bestätigte Sätze wandern in den Übersetzungsspeicher, neue Begriffe ins Glossar (Vorschlag).
4. Status `geprüft` mit Datum und Reviewer-Land; im Kopf der Übersetzung `geprüft durch Markt <Code>, <Datum>`.

## In der App (ab Version 0.48)

- **Übersetzungsspeicher:** Freigegebene Übersetzungen kommen je Absatz in den Speicher. 100-%-Treffer übernimmt die App beim Anlegen einer Übersetzung, ähnliche Treffer ab 75 % schlägt sie vor. `abgleich --app …` schreibt `SPEICHER.csv` und `GLOSSAR.csv` je Zielsprache hierher; eigene Änderungen bleiben, die App-Fassung liegt dann als `.neu` daneben. Umgekehrt lassen sich beide Dateien in der App einlesen (Übersetzung › Übersetzungsspeicher bzw. Glossar je Sprache).
- **Übersetzungsbüro:** XLIFF 1.2 (für CAT-Werkzeuge wie Trados, memoQ, Across) oder Excel je Übersetzung; der Rückimport prüft jede Einheit (ID, unveränderter deutscher Text, Prüfregeln).
- **Prüfungen:** Länge außerhalb 0,55–1,8 der deutschen Quelle, deutsche Wörter im Zieltext, Datum oder Kennung nur auf einer Seite – zusätzlich zu Zahlen, Platzhaltern, Struktur, Signalwörtern und festen Begriffen.
- **Länderreview mit MQM:** Prüferin bzw. Prüfer je Sprache und Markt, Fehler je Absatz (Genauigkeit, Sprachfluss, Terminologie, Stil, Landeskonventionen, Layout; gering 1, schwer 5, kritisch 10 Punkte). Bestanden bis 5 Punkte je 1 000 Wörter; sonst „zurück an Übersetzung“. Eine angeforderte Länderprüfung muss vor der Freigabe bestanden sein.
- **Rückübersetzung:** Stichprobe von 10 % der übersetzten Sicherheitshinweise (mindestens einer) zurück ins Deutsche, mit Vergleich zur Quelle.
- **Schweizer Varianten:** `10_Deutsch_DE-CH` entsteht nach Regeln aus dem deutschen Master (ss statt ß, «…»); `11_Französisch_FR-CH` beruht auf der freigegebenen französischen Fassung und wird vom Markt CH geprüft.
