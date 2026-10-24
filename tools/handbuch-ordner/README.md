# Handbuch-Arbeitsordner aus Gliederungen erzeugen und abgleichen

`handbuch_struktur.py` erzeugt den lokalen Arbeitsordner für das oneSCM-Handbuch und hält ihn mit neuen Gliederungen aktuell – aus der Gesamtgliederung (Excel, Blatt „Matrix“) und aus den Gliederungen der App (Stammdaten › Inhaltsverzeichnis, JSON-Export).

Aufbau:

- `00_Dokumentation/` – Arbeitsweise, Gliederungen (Excel, CSV, Markdown, App-Exporte), Status, Entscheidungen, Begriffe, Gesamtlisten (Audit, FAQ, Ideen, Steuerung), `App/` (Arbeit mit der App: `APP.md`, `TESTFRAGEN.csv`, `Befragungen/`, `Exporte/`), `Werkzeuge/` (dieses Skript mit Vorlagen)
- `01_Input/` – `01_Eingang`, `02_Zugeordnet`, `03_Ausgeschlossen`
- `02_Kapitel/<Kapitel>/` – Gesamtgliederung; je Kapitel `KAPITEL.md`, `ANWEISUNG.md` (Kapitelanweisung: worauf es ankommt, wichtige Themen, was nicht beschrieben wird – gilt mit Vorrang für alle Agenten), acht Arbeitsordner und je Unterkapitel ein Ordner mit `UNTERKAPITEL.md` und `ANWEISUNG.md`
- `03_Varianten/<Gliederung>/` – dieselbe Struktur je App-Gliederung, mit `VARIANTE.md` (Rollen, Sparten, Märkte)
- `04_Output/<Sprache>/<Kapitel>/` – freigegebene Fassung in Deutsch (Hauptsprache) und acht Landessprachen (EN, FR, IT, ES, CS, SK, KO, MS); Varianten unter `<Sprache>/Varianten/<Name>/`
- `05_I_Output/<Produkt>/` – **I Output**: fertige Produkte mit Screenshots (`01_Handbuch`, `02_Releaseletter`, `03_QuickGuide`, `04_Schulungsmaterial`, `05_Interne_Dokumente`, `06_Videos`, `07_Grafiken`, `08_Prozesse`), je Produkt `PRODUKT.md`, `01_Entwurf`, `02_Screens`, `03_Final/<Sprache>` (Master `01_Deutsch_DE`)
- `06_II_Stil_und_Design/` – **II**: `STIL_UND_DESIGN.md`, `01_Designvorschlaege`, `02_Tonalitaet/TONALITAET.md`, `03_Vorlagen`, `04_Bildsprache_Screenshots`
- `07_III_Grammatik_Synonyme_Fehlerliste/` – **III**: `01_Grammatik/GRAMMATIK.md`, `02_Synonyme/SYNONYME.csv` (mit offenen Terminologiefragen), `03_Fehlerliste/FEHLERLISTE.csv` und `FEHLERLISTE.md`
- `08_IV_Translation/` – **IV**: `TRANSLATION.md`, je Zielsprache `01_Glossar/GLOSSAR.csv`, `02_Uebersetzungsspeicher/SPEICHER.csv`, `03_Laenderreview/REVIEW.md`
- `CLAUDE.md`, `.claude/agents/` (14 Agenten) und `.claude/settings.json` (WebFetch/WebSearch gesperrt – Daten bleiben lokal)

Die acht Arbeitsordner je Kapitel:

| Ordner | Unterordner | Agent |
|---|---|---|
| `01_Quellen` | `Raw_2023` … `Raw_2027` | input-sortierer |
| `02_Entwurf` | | kapitel-redakteur |
| `03_Bilder` | | bild-redakteur |
| `04_Pruefung_Freigabe` | | pruefer |
| `05_Audit` | | auditor |
| `06_FAQ` | | faq-redakteur |
| `07_Ideenspeicher` | | ideen-sammler |
| `08_Steuerung` | `01_Dealer`, `02_MO`, `03_Markt`, `04_HQ`, `05_IT`, `06_Marktspezifisch`, `07_Spartenspezifisch` | steuerung |

Dazu `gliederungs-pfleger` für den Abgleich, `uebersetzer-de` (fremdsprachige Quellen → `dt_<Original>`) und `uebersetzer-ausgabe` (freigegebene Kapitel → `04_Output`, Produkte → `05_I_Output/<Produkt>/03_Final/<Sprache>`, mit Glossar, Übersetzungsspeicher und Länderreview aus `08_IV_Translation`) sowie für die Hauptordner `ausgabe-produzent` (I), `stil-designer` (II) und `sprach-lektor` (III).

`04_Output` und `05_I_Output`: `04_Output` enthält den Handbuchtext je Sprache und Kapitel, `05_I_Output` die fertigen Produkte nach Art mit deutschem Master. Übersetzt wird immer aus dem deutschen Master über `08_IV_Translation` – Kapitel nach `04_Output/<Sprache>/`, Produkte nach `05_I_Output/<Produkt>/03_Final/<Sprache>/`.

Die Hauptordner hängen nicht von der Gliederung ab; ihre Namen und Unterordner stehen als Konstanten im Skript (`AUSGABE`, `STIL`, `LEKTORAT`, `TRANSLATION`, `PRODUKTE`, …), die Textvorlagen in `vorlagen/`. Die Glossare starten mit der Tabelle „Fachbegriffe je Sprache“ aus `vorlagen/SPRACHEN.md`.

```bash
pip install openpyxl
# vollständiger Arbeitsordner als ZIP
python3 tools/handbuch-ordner/handbuch_struktur.py zip Gliederung_oneSCM12102026.xlsx Handbuch_23102026.zip --stand 23102026
# bestehenden Ordner ergänzen: neue Gesamtgliederung und/oder alle Gliederungen der lokalen App
python3 handbuch_struktur.py abgleich <Ordner> --gliederung neue_Gliederung.xlsx
python3 handbuch_struktur.py abgleich <Ordner> --app http://localhost:3000 --projekt p_default --token <API-Token>
```

Der Abgleich legt nur Fehlendes an – die Hauptordner `05`–`08` bei jedem Aufruf, auch ohne `--gliederung`/`--app` –, löscht und überschreibt nichts und meldet Umbenanntes oder Entfallenes in `00_Dokumentation/GLIEDERUNG_ABGLEICH.md`. Agenten, die seit der Lieferung niemand geändert hat, bringt er auf den Stand der Vorlagen; geänderte bleiben, die neue Vorlage liegt als `<name>.md.neu` daneben. Weichen `CLAUDE.md`, `00_Dokumentation/README.md` oder `04_Output/README.md` von der aktuellen Vorlage ab, liegt die neue Fassung als `<Datei>.neu` daneben. Der Ordner einer App-Gliederung bleibt über Umbenennungen und neue Versionen gleich (`Gliederung/App/zuordnung.json`).

Entpacken unter Windows mit PowerShell (behält Umlaute in Ordnernamen):

```powershell
Expand-Archive -Path "$HOME\Downloads\Handbuch_23102026.zip" -DestinationPath "C:\Users\Azehnpf\2026\Handbuch"
```

Die Gliederung selbst liegt nicht im Repository.

## Kapitelanweisung (`ANWEISUNG.md`)

Je Kapitel und Unterkapitel legt das Skript eine `ANWEISUNG.md` an (Abschnitte „Worauf es ankommt“, „Wichtige Themen“, „Nicht beschreiben“, leer mit `[offen]`). Alle Agenten lesen sie vor der Arbeit und befolgen sie mit Vorrang; nur die Grundregeln 1–4 in `CLAUDE.md` gehen vor. Gepflegt wird sie entweder direkt in der Datei oder in der App unter **2 Schreiben › Kapitelsteuerung**: `abgleich --app …` übernimmt die Anweisungen der App in `02_Kapitel` und – für die Kapitel der Handbuch-Varianten – in `03_Varianten/<Name>/` (Zuordnung über die Kapitel- bzw. Unterkapitelnummer). Eine Datei mit eigenen Angaben wird nie überschrieben – weicht die App ab, liegt deren Fassung als `ANWEISUNG.md.neu` daneben.
