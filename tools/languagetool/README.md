# LanguageTool lokal (ADR-108, G-04)

Die Stilprüfung von oneSCM Handbook Studio kann einen **selbst betriebenen** LanguageTool-Dienst nutzen: Grammatik
(Kongruenz, Fälle), Kommasetzung, Groß-/Kleinschreibung und Rechtschreibung für Deutsch und Englisch. Texte verlassen
das Haus nicht – die App spricht nur lokale bzw. interne Adressen an (localhost, 10.x, 172.16–31.x, 192.168.x, *.local).

Entscheidung des Auftraggebers (24.10.2026): **Java-Dienst ohne Docker.**

## Voraussetzungen

- Java 17 oder neuer (getestet mit OpenJDK 21)
- etwa 1 GB Arbeitsspeicher für den Dienst, rund 250 MB Plattenplatz

## LanguageTool besorgen (einmalig)

Variante A – offizielles Paket: `LanguageTool-6.x.zip` von languagetool.org herunterladen und entpacken. Der Dienst steckt
in `languagetool-server.jar`.

Variante B – über Maven Central (wenn die Download-Seite gesperrt ist): im Ordner dieses README

```
mvn -q dependency:copy-dependencies -DoutputDirectory=lib
```

Die mitgelieferte `pom.xml` holt LanguageTool 6.6 mit deutschem und englischem Sprachmodul nach `lib/`.

## Starten

- Linux/macOS: `./start-languagetool.sh` (Variante B) bzw. `LT_JAR=/pfad/languagetool-server.jar ./start-languagetool.sh` (Variante A)
- Windows: `start-languagetool.cmd` (entsprechend, `set LT_JAR=…` für Variante A)

Der Dienst lauscht nur auf `localhost:8081`. In der App:

```
LANGUAGETOOL_URL=http://localhost:8081
```

Prüfen: in der App unter „Schreibstil“ steht „LanguageTool: verbunden“, bzw. `GET /api/v1/style/language-tool`.

Ohne Dienst oder bei Fehlern prüft die App wie bisher nur mit den eigenen Regeln.
