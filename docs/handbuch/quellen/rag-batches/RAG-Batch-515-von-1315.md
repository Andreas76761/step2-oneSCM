# Batch 515 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Edge Service**

Für alle vierundzwanzig Endpunkte des Edge Service werden einheitliche Konventionen festgelegt, die künftig jeder Endpunkt gemeinsam nutzt. Dazu gehören ein einheitliches Fehlerformat, eine einheitliche Verarbeitung von Datumswerten und ein konsistentes Verhalten, wenn ein nachgelagerter Dienst langsam oder nicht erreichbar ist. Diese Arbeiten sind noch offen und müssen abgeschlossen sein, bevor die Arbeiten an den einzelnen Endpunkten beginnen, damit diese die Konventionen übernehmen. Endpunktpfade und Antworten im Erfolgsfall bleiben unverändert.

Fehler werden künftig bei allen Endpunkten im Standardformat RFC 9457 ProblemDetail gemeldet, einschließlich Detailangaben zu einzelnen fehlerhaften Feldern bei Validierungsfehlern. Bisher unterscheidet sich die Form der Fehlermeldung je nach aufgerufenem Endpunkt, und Validierungsfehler nennen das betroffene Feld nur teilweise. Das neue Format ersetzt sechs separate Handler-Klassen mit neunzehn Handler-Methoden. Betroffen sind externe Partner, die den Edge-API-Zugang von OneSCM nutzen, das OneSCM-Frontend sowie Support- und Betriebsteams, die Störungen analysieren. Da Fehlerantworten Teil der externen Schnittstelle sind, kann es für Partner, die sich auf die bisherigen Formate stützen, Auswirkungen geben. Die Änderung muss angekündigt werden, und das bisherige Format muss gegebenenfalls für eine Übergangszeit weiter unterstützt werden.

Datumswerte werden künftig an der API-Grenze an einer zentralen Stelle gelesen und formatiert. Bisher geschieht dies an fünfunddreißig verschiedenen Stellen, sodass eine Korrektur an einer Stelle die anderen nicht erreicht. So wurde der Fehler „Vertragsstartdatum wird im API-Body ignoriert“ nach vierzehn Monaten ein zweites Mal gemeldet und behoben, weil die erste Korrektur nur eine der Stellen betraf.

Für alle dreizehn nachgelagerten Dienst-Clients werden Timeouts, eine Wiederholungsstrategie (Retry) und Circuit Breaker eingerichtet. Bisher ist bei keinem dieser Clients ein Timeout konfiguriert, sodass ein langsamer Dienst unbegrenzte Auswirkungen haben kann. Künftig führt ein langsamer oder nicht verfügbarer Dienst zu einer klaren, zeitlich begrenzten Fehlermeldung statt zu einer hängenden Anfrage. Abgedeckt sind die Dienste für Vertrag, Vertrags-Leasing, Vertragsverlängerung, Umsatzmanagement, Preis, Produktmanagement, verfügbare Produkte, Kunde, Kunde CAS, Dokumentenmanagement und Konfiguration sowie zwei interne Clients. Da dadurch bisher unbemerkt wartende, langsame Aufrufe sichtbar werden, kann sich das Verhalten unter Last ändern. Die Einführung soll daher mit Monitoring begleitet werden.

Vertragstests legen alle vierundzwanzig Anfrage- und Antwortformate fest und laufen im Build, sodass Änderungen an der externen Schnittstelle vor dem Release sichtbar werden. Die Prüfung erfolgt durch die Qualitätssicherung (AQA), indem die verbesserte Implementierung parallel zur bisherigen mit denselben Anfragen betrieben wird und Antworten, Statuscodes und Aufrufe an nachgelagerte Dienste verglichen werden.

**Benutzeroberfläche**

In den Markteinstellungen wurden mehrere Fehler behoben: Beim Bearbeiten lieferte der Datumsauswähler des Prüfprofils falsche Werte, die Einstellungen zum regulären Prüftyp wurden nicht gespeichert, und beim Wechsel zwischen Prüftypen verschwand das Produkt-Dropdown kurzzeitig. Ebenfalls behoben wurde in der Vertragsverwaltung, dass bei der Langzeitverlängerung die Familien-Tags der optionalen Deckungen automatisch ausgewählt wurden. Noch offen ist ein Fehler, bei dem beim Aufruf der Markteinstellungen in der ersten Tagessitzung falsche Symbolgrößen angezeigt werden.

**DevOps und Plattform**

Für die Anpassung an das Helios-One-Netzwerk soll die oneSCM-Plattform umgestellt werden. Vorgesehen sind ein geprüftes Verzeichnis der externen Partner und ihrer Endpunkte, ein wiederholbares Testverfahren für die Partneranbindung sowie die Migration der Plattform-Domäne in allen vier Umgebungen. Die Arbeit gilt als abgeschlossen, wenn das Partnerverzeichnis vollständig ist, das Testskript je Umgebung auf Abruf und nach Zeitplan läuft und die neue Domäne in Dev, Int, Preprod und Prod aktiv ist. Die alten Namen sind dann außer Betrieb genommen, und alle Partner sind angebunden.

Außerdem soll der Reporting-Bereich von der Plattform entkoppelt werden, sodass er unabhängig veröffentlicht werden kann. Seine Infrastruktur wird analog zur Hauptplattform auf Terragrunt umgestellt. Ziel ist, dass das Reporting ohne Plattform-Release ausgeliefert wird und die Reporting-Infrastruktur in allen vier Umgebungen über Terragrunt läuft, ohne dass Ressourcen neu erstellt werden.

Ferner soll bislang ungeprüfte Plattformautomatisierung verifiziert und Lücken bei den Qualitätsprüfungen sollen geschlossen werden. Den Anfang macht die Lambda-Funktion für die Versionierung im Secrets Manager. Aktuell ist unklar, ob sie funktioniert, und es gibt keine Warnung, falls sie unbemerkt ausfällt. Ziel ist, dass das Verhalten dokumentiert, per Test nachgewiesen und durch einen Alarm bei stillem Ausfall abgesichert ist.

Für das Thema „Support & Monitoring PI17“ liegen noch keine inhaltlichen Angaben vor, daher kann dazu kein Text formuliert werden.