# Handbuch-Arbeitsordner aus der Gliederung erzeugen

Erzeugt aus der Gliederung (Excel, Blatt „Matrix“ mit den Spalten Kapitel, Thema, Ebene …) einen lokalen Arbeitsordner als ZIP:

- `00_Dokumentation/` – Arbeitsweise, Gliederung (Excel, CSV mit Zielordnern, Markdown), Status, Entscheidungen, Begriffe, Input-Protokoll
- `01_Input/` – `01_Eingang`, `02_Zugeordnet`, `03_Ausgeschlossen`
- `02_Kapitel/<Kapitel>/` – `KAPITEL.md` (Unterkapitel, Übergangstexte), vier Arbeitsordner `01_Quellen`, `02_Entwurf`, `03_Bilder`, `04_Pruefung_Freigabe` und je Unterkapitel ein Ordner mit `UNTERKAPITEL.md` (Punkte der Ebene 3, Nachweisbedarf, Abschlusskriterium)
- `CLAUDE.md`, `.claude/agents/` (gliederungs-pfleger, input-sortierer, kapitel-redakteur, bild-redakteur, pruefer) und `.claude/settings.json` (WebFetch/WebSearch gesperrt – Daten bleiben lokal)

```bash
pip install openpyxl
python3 tools/handbuch-ordner/erzeuge_struktur.py Gliederung_oneSCM12102026.xlsx Handbuch_23102026.zip --stand 23102026
# optional: die vier Arbeitsordner auch in jedem Unterkapitel
python3 tools/handbuch-ordner/erzeuge_struktur.py … --unterkapitel-arbeitsordner
```

Entpacken unter Windows mit PowerShell (behält Umlaute in Ordnernamen):

```powershell
Expand-Archive -Path "$HOME\Downloads\Handbuch_23102026.zip" -DestinationPath "C:\Users\Azehnpf\2026\Handbuch"
```

Die Gliederung selbst liegt nicht im Repository; Vorlagen für CLAUDE.md, Agenten und Dokumentation unter `vorlagen/`.
