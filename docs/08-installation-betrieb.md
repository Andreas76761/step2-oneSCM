# 08 Installation und Betrieb

Stand: Version 0.60 (24.10.2026). Diese Anleitung beschreibt, wie Sie oneSCM Handbook Studio auf einem Arbeitsplatzrechner oder Server installieren, starten, sichern und aktualisieren. Die Benutzung der Oberfläche steht in [09 Benutzerdokumentation](09-benutzerdokumentation.md).

## 1. Welche Installation passt?

| Weg | Für wen | Voraussetzung | Internet bei der Installation |
|---|---|---|---|
| **Windows-Paket (offline)** `onescm-studio-<Version>-windows-x64.zip` | Arbeitsplatz unter Windows 10/11 (x64), auch ohne Administratorrechte | keine – Node.js ist enthalten | nein |
| **Universelles Paket** `onescm-studio-<Version>.zip` | Linux, macOS oder Windows mit eigenem Node.js | Node.js 22 LTS (mindestens 20.16) | ja (npm-Registry) |
| **Container** (`docker compose`) | Server, Team-Betrieb mit PostgreSQL | Docker bzw. Podman | ja (Abbild bauen) |
| **Kubernetes** (Helm-Chart) | Produktivbetrieb, mehrere Instanzen | Cluster, PostgreSQL, S3-Speicher | ja |

Alle Wege nutzen dieselbe Anwendung. Daten bleiben lokal: Es gibt keine Cloud-KI, keine Cloud-Embeddings und keine Cloud-Transkription, solange Sie das nicht ausdrücklich konfigurieren (`LLM_PROVIDER`, `EMBEDDINGS_PROVIDER`).

## 2. Windows-Paket (offline)

1. ZIP herunterladen und entpacken – am besten mit PowerShell, damit Umlaute in Ordnernamen erhalten bleiben:
   ```powershell
   Expand-Archive -Path "$HOME\Downloads\onescm-studio-0.41.0-windows-x64.zip" -DestinationPath "C:\Users\<Name>\oneSCM"
   ```
2. Im Ordner `onescm-studio-0.41.0-windows-x64` **`start.cmd` doppelklicken**. Beim ersten Start werden die fiktiven Beispieldaten nach `daten\` kopiert; der Browser öffnet `http://localhost:3000`.
3. Oben links den Demo-Benutzer wählen (z. B. „u-admin“ für alle Rechte).
4. Beenden: im Konsolenfenster Strg+C.

Optionen (PowerShell im Paketordner):

```powershell
.\start.ps1 -Port 3100              # anderer Port
.\start.ps1 -OhneBeispieldaten      # beim ersten Start mit leerem Bestand beginnen
.\backup.ps1 -Ziel C:\Sicherung\onescm.zip
```

Hinweise:
- Blockiert die Ausführungsrichtlinie PowerShell-Skripte, nutzen Sie `start.cmd` (startet mit `-ExecutionPolicy Bypass` nur für diesen Aufruf).
- Die Windows-Firewall fragt beim ersten Start eventuell nach – „Private Netzwerke“ genügt; für die Nutzung nur am eigenen Rechner kann der Zugriff verweigert werden.
- Alle Daten liegen in `daten\` (SQLite-Datenbank `onescm.db` und Dateiablage `objects\`). Zum Umziehen den ganzen Paketordner kopieren.

## 3. Universelles Paket (Linux, macOS, Windows mit Node.js)

```bash
unzip onescm-studio-0.41.0.zip && cd onescm-studio-0.41.0
./install.sh            # npm ci --omit=dev (nur Laufzeit-Abhängigkeiten)
./start.sh              # http://localhost:3000, Port als Argument: ./start.sh 3100
```

Unter Windows mit eigenem Node.js: `.\install.ps1`, danach `start.cmd`.

Im Firmennetz ohne direkten Zugang zum npm-Registry den Proxy setzen:
`npm config set proxy http://<proxy>:<port>` und `npm config set https-proxy http://<proxy>:<port>`.

## 4. Container mit PostgreSQL

```bash
POSTGRES_PASSWORD=<geheim> docker compose up -d --build
# http://localhost:3000 – Daten im Volume der Datenbank und unter /data der App
```

Produktivbetrieb mit Anmeldung über den Firmen-Identity-Provider: `AUTH_MODE=oidc` und `OIDC_ISSUER`, `OIDC_CLIENT_ID`, `OIDC_AUDIENCE` setzen (Tabelle im [README](../README.md#betrieb)). Für mehrere Instanzen `OBJECT_STORE=s3`; Kubernetes über das Helm-Chart `deploy/helm/onescm`.

## 5. Wichtige Einstellungen

Alle Einstellungen sind Umgebungsvariablen; die vollständige Liste steht im README (Abschnitt „Betrieb“). Für den Einstieg genügen:

| Variable | Standard | Bedeutung |
|---|---|---|
| `PORT` | `3000` | Port der Web-Oberfläche |
| `DATA_DIR` | `./data` (in den Paketen `daten`) | Datenbank und Dateiablage |
| `DATABASE_URL` | – | PostgreSQL statt SQLite (Team-Betrieb) |
| `AUTH_MODE` | `demo` | `oidc` für echte Anmeldung; `demo` nur für Einzelplatz und Tests |
| `LLM_PROVIDER` | `none` | KI-Umformulierung und KI-Antworten: `openai` (auch lokale, OpenAI-kompatible Server wie Ollama oder vLLM), `anthropic`; ohne Angabe antwortet die App extraktiv aus den Belegen |
| `LLM_LOCAL` | `false` | `true`: der OpenAI-kompatible KI-Dienst unter `LLM_BASE_URL` läuft auf diesem Rechner oder im eigenen Netz (z. B. Ollama `http://localhost:11434/v1`) – gilt dann als intern, Datenschutz-Sperren für externe Dienste entfallen; wirkt nur mit lokaler Adresse (ADR-099) |
| `EMBEDDINGS_PROVIDER`, `EMBEDDINGS_BASE_URL`, `EMBEDDINGS_MODEL` | `local` | Vektoren für die Suche: `local` (eingebaut, ohne Modell) oder `openai` (OpenAI-kompatibel), z. B. ein mehrsprachiges Modell wie `bge-m3` über Ollama – verbessert englische Fragen auf deutsche Quellen |
| `EMBEDDINGS_LOCAL` | `false` | `true`: Embedding-Dienst unter `EMBEDDINGS_BASE_URL` ist lokal (wie `LLM_LOCAL`) |
| `TRANSCRIBE_CMD` | – | lokale Transkription von Videos, z. B. whisper.cpp |
| `FFMPEG_PATH` | – | ffmpeg für Standbilder aus Videos |
| `MEDIA_TRANSIENT_STILLS` | an | `false` schaltet die Zwischenbilder kurzer Zustände (Menü, Dialog) aus Videos ab (ADR-106) |
| `LANGUAGETOOL_URL` | – | lokale Grammatikprüfung mit LanguageTool (ADR-108), z. B. `http://localhost:8081`; nur lokale bzw. interne Adressen – Start und Einrichtung siehe `tools/languagetool/README.md` |
| `LANGUAGETOOL_TIMEOUT_MS` | 8000 | Zeitlimit je Prüfanfrage an LanguageTool |
| `OCR_CMD` | – | lokale Texterkennung gescannter PDF-Seiten, z. B. Tesseract |
| `OCR_BOXES_CMD` | aus `OCR_CMD` abgeleitet | Texterkennung mit Wortpositionen für den Datenschutz im Bild; bei Tesseract genügt `OCR_CMD` (die App hängt `tsv` an) |

Beispiel (PowerShell) für lokale Werkzeuge vor dem Start:

```powershell
$env:FFMPEG_PATH = "C:\Tools\ffmpeg\bin\ffmpeg.exe"
$env:OCR_CMD = '"C:\Program Files\Tesseract-OCR\tesseract.exe" {input} stdout -l deu+eng'
$env:TRANSCRIBE_CMD = 'C:\Tools\whisper\whisper-cli.exe -m C:\Tools\whisper\ggml-base.bin -l de -ovtt -of {output} -f {input}'
.\start.ps1
```

Die Seite „oneSCM_Metadaten › Einlesen“ zeigt, welche Werkzeuge eingerichtet sind – auch „Datenschutz im Bild“. Ohne Texterkennung markieren Sie Stellen in Bildern von Hand.

### LanguageTool (optional)

Die Grammatikprüfung mit LanguageTool läuft als eigener Java-Dienst neben der App (Java 17 oder neuer, rund 1 GB Arbeitsspeicher):

1. LanguageTool besorgen – offizielles Paket oder über Maven: im Ordner `tools/languagetool` `mvn -q dependency:copy-dependencies -DoutputDirectory=lib`.
2. Starten: `tools/languagetool/start-languagetool.sh` bzw. `start-languagetool.cmd` (lauscht nur auf `localhost:8081`).
3. In der App `LANGUAGETOOL_URL=http://localhost:8081` setzen und neu starten. Unter „Einstellungen“ und „Schreibstil“ steht dann „verbunden“.

Ohne LanguageTool prüft die App mit den eigenen Regeln.

## 6. Sicherung, Wiederherstellung, Aktualisierung

- **Sicherung:** `.\backup.ps1` (Windows-Paket) bzw. `node apps/server/dist/cli.js backup --out sicherung.zip` mit gesetztem `DATA_DIR`. Die ZIP enthält Datenbank-Inhalt und alle Dateien.
- **Wiederherstellung:** `node apps/server/dist/cli.js restore --in sicherung.zip` (`--force` ersetzt vorhandene Daten).
- **Aktualisieren:** neues Paket entpacken, den Ordner `daten\` aus dem alten Paket hineinkopieren, starten. Die Datenbank wird beim Start automatisch auf den neuen Stand gebracht (Migrationen); vorher eine Sicherung anlegen.

## 7. Leistung und Grenzen

Gemessen auf 4 Kernen mit SQLite ([Lasttest](lasttest-metadaten.md)): Import von 500 Dokumenten in 5 s, Frage an alle Quellen mit Belegen in 0,2–0,3 s bei 12 000 Abschnitten, 195 Leseanfragen je Sekunde bei 20 gleichzeitigen Nutzerinnen und Nutzern. Grenzen je Datei und Upload: `maxEntryBytes` 20 MB und `UPLOAD_MAX_BYTES` 50 MB (Einstellungen › Import). Ab etwa 20 gleichzeitig Fragenden mehrere Instanzen mit PostgreSQL betreiben.

## 8. Fehlerbehebung

| Meldung | Abhilfe |
|---|---|
| `Das Token "&&" ist in dieser Version kein gültiges Anweisungstrennzeichen` | Windows PowerShell 5: Befehle einzeln ausführen oder `start.cmd` nutzen |
| `EADDRINUSE` / Port belegt | anderen Port wählen: `.\start.ps1 -Port 3100` |
| `npm ci` scheitert (Netz, Zertifikat) | Proxy setzen (Abschnitt 3) oder das Windows-Paket (offline) verwenden |
| `Node.js nicht gefunden` | Windows-Paket verwenden oder Node.js 22 LTS installieren |
| Seite bleibt leer | Browser-Cache leeren (Strg+F5); `http://localhost:<Port>/api/v1/health` muss `"status":"ok"` liefern |
