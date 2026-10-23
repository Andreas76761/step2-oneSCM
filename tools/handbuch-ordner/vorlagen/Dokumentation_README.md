# Arbeitsweise – oneSCM-Benutzerhandbuch (Stand {{STAND}})

## In 6 Schritten zum Kapitel

1. **Dateien ablegen:** neue Unterlagen nach `01_Input/01_Eingang/` kopieren (DOCX, PPTX, PDF, HTML, XLSX, MP4 mit Untertitel, Bilder).
2. **Sortieren lassen:** in Claude Code im Projektordner: „Nutze den input-sortierer für den Eingang.“ Ergebnis im `INPUT_PROTOKOLL.md`; Datenschutzfunde und unsichere Zuordnungen stehen unter „Zu entscheiden“.
3. **Entwurf schreiben lassen:** „kapitel-redakteur: Unterkapitel 6.2“ – Entwurf in `02_Kapitel/06_…/02_Entwurf/`.
4. **Bilder pflegen:** „bild-redakteur: Kapitel 6“ – Bildverzeichnis `03_Bilder/BILDER.md`.
5. **Prüfen lassen:** „pruefer: Kapitel 6“ – Bericht in `04_Pruefung_Freigabe/`, Stand in `STATUS.md`.
6. **Freigeben:** ein Mensch legt den Freigabebeleg (Name, Datum, Version) in `04_Pruefung_Freigabe/` ab.

Neue Gliederung? Excel nach `Gliederung/` legen und „gliederungs-pfleger: neue Gliederung abgleichen“.

## Dateien in diesem Ordner

| Datei | Inhalt |
|---|---|
| `Gliederung/{{GLIEDERUNG}}` | Originalgliederung (Matrix mit Status- und Nachweisspalten) |
| `Gliederung/Gliederung.csv` | Gliederung mit Zielordner je Eintrag (für Agenten, Excel-tauglich, `;`-getrennt) |
| `Gliederung/Gliederung.md` | Gliederung zum Lesen |
| `STATUS.md` | Stand je Unterkapitel |
| `ENTSCHEIDUNGEN.md` | offene und getroffene Entscheidungen |
| `BEGRIFFE.md` | verbindliche Schreibweisen und UI-Begriffe |
| `INPUT_PROTOKOLL.md` | Protokoll aller eingelesenen Dateien |

## Voraussetzungen auf dem Rechner

- Claude Code (Desktop-App oder `claude` im Terminal) – im Ordner `{{STAND}}` starten, damit `CLAUDE.md` und die Agenten geladen werden.
- Zum Lesen von Office-/PDF-Dateien: Python 3 mit `python-docx`, `python-pptx`, `pypdf`, `openpyxl` (`pip install python-docx python-pptx pypdf openpyxl`).
- Optional für Videos: Untertiteldatei (SRT/VTT) neben das MP4 legen oder ein lokales Whisper installieren.
