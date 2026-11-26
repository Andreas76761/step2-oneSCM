# oneSCM Handbook Studio – Installationspaket

**Windows-Paket (…-windows-x64):** `start.cmd` doppelklicken. Node.js und alle Abhängigkeiten sind enthalten, keine Installation, kein Internet nötig. Der Browser öffnet http://localhost:3000; oben links den Demo-Benutzer „u-admin“ wählen.

**Universelles Paket:** Node.js 22 LTS installieren, dann
- Windows: `.\install.ps1`, danach `start.cmd`
- Linux/macOS: `./install.sh`, danach `./start.sh`

Beim ersten Start werden die **fiktiven Beispieldaten** nach `daten/` kopiert (Demo-Handbuch, Screenshots mit Varianten, Klickstrecke, Testfragen, Befragung). Mit leerem Bestand beginnen: `.\start.ps1 -OhneBeispieldaten` bzw. `OHNE_BEISPIELDATEN=1 ./start.sh`.

- Daten: `daten/` (Datenbank `onescm.db`, Dateien `objects/`) – zum Umziehen den Ordner mitnehmen
- Sicherung: `.\backup.ps1`
- Beenden: Strg+C im Konsolenfenster
- Dokumentation: `Dokumentation/08-installation-betrieb.md` (Installation, Einstellungen, Fehlerbehebung) und `Dokumentation/09-benutzerdokumentation.md` (Funktionen und Arbeitsabläufe)

Daten bleiben lokal: keine Cloud-KI, keine Cloud-Embeddings, keine Cloud-Transkription.
