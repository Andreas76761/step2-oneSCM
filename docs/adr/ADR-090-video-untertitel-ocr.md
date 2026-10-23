# ADR-090 Video, Untertitel und Texterkennung mit lokalen Werkzeugen

**Status:** akzeptiert, umgesetzt in Etappe 38 (M6 aus [docs/06](../06-plan-onescm-metadaten.md); nutzt ADR-029, ADR-086)

## Kontext
Schulungsvideos (MP4) und gescannte PDFs enthalten Wissen, das bisher nicht durchsuchbar war. Text aus Videos soll mit **Zeitmarke** als Fundstelle in die Chunks, sichtbare Änderungen im Bild sollen als **Standbilder mit rot markiertem Bereich** erscheinen (F-26), gescannte PDF-Seiten sollen per Texterkennung lesbar werden. Daten bleiben lokal (M-02, M-03): keine Cloud-Transkription, keine Cloud-Texterkennung.

## Entscheidung
- **Untertitel (.vtt, .srt)** sind eigene Quellen: Formatierungen und Sprecherkennungen entfallen; Abschnitte je Kapitelmarke (Kennung „Kapitel…“/„chapter…“ vor der Zeitangabe), sonst je 2 Minuten; Absätze aus aufeinanderfolgenden Einblendungen bis etwa 30 s bzw. 600 Zeichen, bevorzugt am Satzende. Fundstelle je Absatz: `{ "time": "mm:ss" }`.
- **Video (.mp4):** Text aus **mitgelieferten Untertiteln** mit gleichem Namen im ZIP (z. B. `schulung.mp4` + `schulung.vtt`, dann nicht doppelt eingelesen), sonst aus der **lokalen Transkription** (`TRANSCRIBE_CMD`, z. B. whisper.cpp, Ausgabe WebVTT/SRT); ohne beides wird das Video mit Hinweis übersprungen. Automatisch erstellter Text wird als „bitte prüfen“ gekennzeichnet.
- **Standbilder (F-26)** mit ffmpeg (`FFMPEG_PATH`): alle 2 s ein Bild (höchstens 600), verglichen auf 64×36 Graustufen; behalten werden das erste Bild und jedes mit mindestens 2 % geänderter Fläche gegenüber dem zuletzt behaltenen. Der geänderte Bereich wird rot umrahmt, bei einem Szenenwechsel (≥ 60 %) ohne Rahmen. Standbilder liegen als Bilder ab (ADR-029) und stehen an ihrer Zeitmarke im Text.
- **Texterkennung (OCR_CMD, z. B. Tesseract):** PDF-Seiten ohne Textebene werden mit pdf.js gerendert (Faktor 2) und erkannt; Hinweis „Seite per Texterkennung gelesen (bitte prüfen)“. Ohne Werkzeug bleibt es beim Hinweis aus ADR-086.
- **Werkzeuge** werden nur vom Betrieb über Umgebungsvariablen eingerichtet, nie über die Oberfläche; Befehle mit Platzhaltern `{input}`, `{output}`, `{lang}` laufen **ohne Shell** in einem eigenen temporären Verzeichnis mit Zeitlimit (`MEDIA_TOOL_TIMEOUT_MS`, Standard 30 Minuten). `GET /metadata/media-tools` zeigt nur, ob ein Werkzeug eingerichtet ist; die Seite „Einlesen“ zeigt den Status.
- Formatfilter: „Video“ (`mp4`) und „Untertitel“ (`subtitles`) in Chunks und Fragen.

## Folgen
- Migration `045_media_tools.sql` (Formatliste in gespeicherten Einstellungen); Tests T-270 … T-273, E2E T-274; Anforderungen NFR-90, NFR-91.
- Große Videos: Grenze je Datei ist weiterhin `maxEntryBytes` bzw. `maxUploadBytes` der Importeinstellungen.
- Die Qualität der Transkription hängt vom gewählten lokalen Modell ab; die Antwortqualität misst M7.
