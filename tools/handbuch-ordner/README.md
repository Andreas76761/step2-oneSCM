# Handbuch-Arbeitsordner aus Gliederungen erzeugen und abgleichen

`handbuch_struktur.py` erzeugt den lokalen Arbeitsordner für das oneSCM-Handbuch und hält ihn mit neuen Gliederungen aktuell – aus der Gesamtgliederung (Excel, Blatt „Matrix“) und aus den Gliederungen der App (Stammdaten › Inhaltsverzeichnis, JSON-Export).

Aufbau:

- `00_Dokumentation/` – Arbeitsweise, Gliederungen (Excel, CSV, Markdown, App-Exporte), Status, Entscheidungen, Begriffe, Gesamtlisten (Audit, FAQ, Ideen, Steuerung), `Werkzeuge/` (dieses Skript mit Vorlagen)
- `01_Input/` – `01_Eingang`, `02_Zugeordnet`, `03_Ausgeschlossen`
- `02_Kapitel/<Kapitel>/` – Gesamtgliederung; je Kapitel `KAPITEL.md`, acht Arbeitsordner und je Unterkapitel ein Ordner mit `UNTERKAPITEL.md`
- `03_Varianten/<Gliederung>/` – dieselbe Struktur je App-Gliederung, mit `VARIANTE.md` (Rollen, Sparten, Märkte)
- `04_Output/<Sprache>/<Kapitel>/` – freigegebene Fassung in Deutsch (Hauptsprache) und acht Landessprachen (EN, FR, IT, ES, CS, SK, KO, MS); Varianten unter `<Sprache>/Varianten/<Name>/`
- `CLAUDE.md`, `.claude/agents/` (11 Agenten) und `.claude/settings.json` (WebFetch/WebSearch gesperrt – Daten bleiben lokal)

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

Dazu `gliederungs-pfleger` für den Abgleich, `uebersetzer-de` (fremdsprachige Quellen → `dt_<Original>`) und `uebersetzer-ausgabe` (freigegebene Kapitel → `04_Output` in neun Sprachen).

```bash
pip install openpyxl
# vollständiger Arbeitsordner als ZIP
python3 tools/handbuch-ordner/handbuch_struktur.py zip Gliederung_oneSCM12102026.xlsx Handbuch_23102026.zip --stand 23102026
# bestehenden Ordner ergänzen: neue Gesamtgliederung und/oder alle Gliederungen der lokalen App
python3 handbuch_struktur.py abgleich <Ordner> --gliederung neue_Gliederung.xlsx
python3 handbuch_struktur.py abgleich <Ordner> --app http://localhost:3000 --projekt p_default --token <API-Token>
```

Der Abgleich legt nur Fehlendes an, löscht und überschreibt nichts und meldet Umbenanntes oder Entfallenes in `00_Dokumentation/GLIEDERUNG_ABGLEICH.md`. Agenten, die seit der Lieferung niemand geändert hat, bringt er auf den Stand der Vorlagen; geänderte bleiben, die neue Vorlage liegt als `<name>.md.neu` daneben. Der Ordner einer App-Gliederung bleibt über Umbenennungen und neue Versionen gleich (`Gliederung/App/zuordnung.json`).

Entpacken unter Windows mit PowerShell (behält Umlaute in Ordnernamen):

```powershell
Expand-Archive -Path "$HOME\Downloads\Handbuch_23102026.zip" -DestinationPath "C:\Users\Azehnpf\2026\Handbuch"
```

Die Gliederung selbst liegt nicht im Repository.
