# 22 Ausblick und Weiterentwicklung

Dieses Kapitel zeigt, welcher Funktionsstand in oneSCM heute verfügbar ist, welche Erweiterungen das Material beschreibt und welche Themen nicht als Funktion im Handbuch stehen. Ausblickpunkte sind keine Zusage für Umfang, Reihenfolge oder Termin. Eingestellte, geschlossene oder inhaltsleere Vorhabenmeldungen beschreibt das Kapitel nicht als Funktion. Sie stehen am Kapitelende unter „Klärungsbedarf“. Funktionen, die in anderen Kapiteln zu beschreiben sind, nennt der Abschnitt „Verschiebung in andere Kapitel“.

## 22.1 Bestätigter Funktionsstand

**Zweck.** Dieser Abschnitt legt fest, welcher Funktionsstand im Handbuch als verfügbar gilt. Maßgeblich ist das Verhalten, das die Quellen als bestehend beschreiben.

**Stand heute.**

- Batches im Administrationsbereich: Fehlgeschlagene oder abgebrochene Batches erscheinen für Benutzer mit Admin-Zugriff im Bereich „Batches“. Es erfolgt keine automatische E-Mail-Benachrichtigung. Die Überwachung erfolgt manuell. Batch 363.2.
- Zahlungsplan-Setup: Die Funktion „Dokumente anhängen“ im Zahlungsplan-Setup von Verträgen steht unverändert zur Verfügung. Batch 363.2.
- Vertragserstellung: Ein Ablauf der Vertragserstellung umfasst jeweils ein Produkt. Batch 966.3.
- Kundensignatur: Alle Produkte und Verträge erfordern eine Kundensignatur. Batch 966.2.
- Aktivierung: Die Aktivierung eines Vertrags erfolgt manuell. Batch 1092.5.
- Optionale Deckungen: In der Vertragserstellung werden optionale Deckungen angezeigt und sind auswählbar, auch wenn sie keinen Preis haben. Batch 1092.5.
- Industry und Veröffentlichung: Beim Verknüpfen einer Industry mit einem Produkt deaktiviert das System das Produkt und meldet „Product was successfully updated“. Das Veröffentlichen ist auch ohne Preise für die neu verknüpfte Industry möglich. Batch 1255.5.
- Startdatum von Preisversionen: Bei einem Produkt mit Status „published“ ändern Sie das Startdatum nur, wenn das Produkt deaktiviert ist. Ein deaktiviertes Produkt lässt sich nicht verkaufen. Batch 1255.5.
- Sonderfälle: Die Detailansicht eines Sonderfalls zeigt Produktname, Vertragsbeginn, voraussichtliches Vertragsende, Vertragsdauer, jährliche Fahrleistung und Gesamtlaufleistung, jeweils sofern vorhanden. Batch 1089.7.
- Reifenprodukte: Die Laufleistung trägt die aktuelle Beschriftung und die gültige Anzahl an Nachkommastellen. Verträge für Reifenprodukte lassen sich ohne die Fehlermeldung „Unauthorized“ erstellen. Batch 1185.3.
- Mercedes-me-Profil: Adressdaten lassen sich innerhalb eines Landes ändern. Die Telefonnummer lässt sich nicht ändern. Batch 614.4.
- Fahrzeugbereich eines Vertrags: Im Reiter „Vehicle“ ist das Feld „License Plate“ für das Kennzeichen editierbar. Eine Änderung übernimmt ein Scheduler samt Begründung in den Vertrag, und der permanente Header wird aktualisiert. Batch 846.1.
- Vertragstabellen und History: Die Tabellen sortieren nach „Created On“. Im Bereich „History“ heißt der zweite Abschnitt „Contract Status History“. Batch 846.1.
- Rückmeldedatei oneERP: Beim Import der Rückmeldedatei bleibt der Steuerbetrag der Rechnung unberücksichtigt. Batch 191.6.
- Sprache: Die Oberfläche unterstützt Sprachen über Sprachdateien. Regionale Varianten einer Sprache gibt es nicht. Batch 529.2.

**Schritt für Schritt: Job aktivieren.**

1. Öffnen Sie als Administrator die Jobliste.
2. Suchen Sie einen Job mit dem Status „Disabled“. Die Option „Enable“ steht ausschließlich für Jobs mit diesem Status zur Verfügung.
3. Wählen Sie in der Spalte „Action“ die Option „Enable“.
4. Bestätigen Sie den Dialog „Enable“ mit „Enable“. Mit „Cancel“ schließen Sie den Dialog ohne Änderung und kehren zur Jobtabelle zurück.

**Ergebnis und Systemstatus.** Der Status des Jobs lautet danach „Enabled“. Ein Job mit diesem Status läuft zum hinterlegten Datum und zur hinterlegten Uhrzeit. Batch 276.4.

**Ausblick.** Für den bestätigten Funktionsstand beschreibt das Material in den Bereichen Batches, Zahlungsplan und Vertragserstellung keine Erweiterungen. Die Erweiterungen stehen in 22.2. Batch 363.2, 966.3.

**Hinweise.** Die Angaben beschreiben den Stand, den die Quellen angeben. Abgebrochene Vorhaben im Umfeld dieser Funktionen stehen im Klärungsbedarf und sind nicht Teil dieses Abschnitts. Bekannte Fehler stehen in Kapitel 23.

Quellen: Batch 363.2, 966.3, 966.2, 1092.5, 1255.5, 1089.7, 1185.3, 614.4, 846.1, 191.6, 529.2, 276.4

## 22.2 Erweiterungen und offene Anforderungen

**Zweck.** Dieser Abschnitt beschreibt die Erweiterungen, die das Material aufführt und die im System nicht verfügbar sind. Die Angaben zeigen die beschriebene Richtung und den Umfang. Sie sind keine Funktionsbeschreibung und keine Anleitung.

**Stand heute.** Keine der nachfolgenden Erweiterungen ist im Funktionsumfang enthalten. Den verfügbaren Funktionsstand beschreibt Abschnitt 22.1, den Releasestand Abschnitt 22.4.

**Ausblick.** Das Material beschreibt folgende Erweiterungen.

**Vertragserstellung und Angebot**

- Die Weiterentwicklung umfasst eine Anzeige der Ablehnungsgründe ohne Wiederholung in jeder Zeile und ohne Kommentarspalte in der Contract Generation. Batch 866.2.
- Die Weiterentwicklung umfasst einen „Soft Reject“, bei dem keine automatische Ablehnung erfolgt, sondern eine manuelle Bestätigung durch den MO. Batch 866.2.
- Die Weiterentwicklung umfasst die Kostenstellenaufteilung als Aufschlüsselung des Verlängerungspreises im Reiter „Zahlung“, eine Kostenaufschlüsselung für den Sonderfall sowie die Anfrage eines Sonderfalls durch Marktnutzer. Batch 866.2.
- Die Weiterentwicklung umfasst eine Erweiterung der MO-Prüfung. Das Material nennt dazu keine konkreten Änderungen. Batch 866.2.
- Die Weiterentwicklung umfasst ein Aktivierungsdatum im Reiter „Contract“. Batch 866.2.
- Die Weiterentwicklung umfasst den Verkauf von Reifenprodukten über die Leasing-API sowie die Behandlung von Provisionen bei Leasingverträgen. Batch 866.2.
- Die Weiterentwicklung umfasst die Rückgabe der Modellbezeichnung aus dem Fahrzeugauftrag der Systeme AFAB und GO an die Vertragsgenerierung. Batch 1244.3.
- Die Weiterentwicklung umfasst die Übergabe der Quelle des Kilometerstands mit Datum und Zeitstempel bei der initialen Generierung und bei der Produktprüfung durch die MO-Seite. Batch 1244.3.
- Die Weiterentwicklung umfasst den Abruf von Kilometerständen aus VEGA-Claims im Zwei-Wochen-Rhythmus und deren Übergabe an die Tabelle für Fahrzeugkilometerstände. Batch 1244.3.
- Die Weiterentwicklung umfasst für Daten aus DSB den Servicetyp und die VEGA-Claim-Nummer in der Antwort an die Generierung. Die Produktverwaltung prüft den Servicetyp 12. Ist die Einstellung „Fahrzeuge zulassen, die ihren ersten Service erreicht haben“ nicht aktiviert, zeigt sie den Fehler E3 mit dem Text „Vehicle has a recorded service in DSB.“ an. Batch 1244.3.
- Die Weiterentwicklung umfasst die Erweiterung des Jobs SyncServiceHistoryOnVehicles um Claim-Informationen sowie die Speicherung des Servicetyps aus der hasClaim-Schnittstelle in der Datenbank. Batch 1244.3.
- Die Weiterentwicklung umfasst eine Kostenstelle für Management-Verträge, eine Kostenaufschlüsselung in der PV-Übersicht sowie eine erweiterte Logik und Tabellenstruktur der Preismatrix. Batch 1244.3.
- Die Weiterentwicklung umfasst das Feld „Salesman ID“ im Vertragserstellungsprozess für Reporting. Das Feld wird für bestehende Verträge initial befüllt. Batch 1082.6.
- Die Weiterentwicklung umfasst die Anzeige der gewählten Laufzeit in Monaten im Bereich „Produktoptionen“ bei Vorschlägen im Status „Created“, solange das Vertragsstartdatum nicht feststeht. Batch 1082.6.
- Die Weiterentwicklung umfasst eine Rücknahme einer früheren Änderung, mit der Ablehnungsbenachrichtigungen an Kunden und Händler wieder aktiviert werden. Das Material meldet diesen Punkt im BAT-Test. Batch 1082.6.
- Die Weiterentwicklung umfasst die Massenanlage für alle Kundentypen. Das Material führt den Punkt in der Klärung. Batch 1082.6.
- Die Weiterentwicklung umfasst in der Massenanlage einen aktiven Wechsel zum Zahlungsplan des letzten Fahrzeugs, sobald alle Fahrzeuge validiert sind. Batch 1086.3.
- Die Weiterentwicklung umfasst die Prolongation bei geänderten Deckungen auf Produktebene. Das Material beschreibt Szenarien für hinzugefügte und entfernte Deckungen sowie für Preise zum Verkaufs- oder zum Prolongationszeitpunkt. Ein Zielverhalten liegt nicht vor. Batch 772.2.
- Die Weiterentwicklung umfasst die exakte Kundensuche für über Edge erstellte Online-Sales-Verträge. Die Suche nutzt die API für Vorname, Nachname, E-Mail-Adresse und Telefonnummer. Für die IBAN ist eine weitere API vorgesehen. Der Vorgang ist pausiert. Batch 1098.5.

**Kunden und Stammdaten**

- Die Weiterentwicklung umfasst das Namensformat „Nachname, Vorname“ nur für Privatkunden und private staatliche Kunden. Gewerbliche Kunden mit Firmenname und zusätzlichem Firmennamen sind ausgenommen. Batch 754.8.
- Die Weiterentwicklung umfasst die Aktualisierung von Vor- und Nachname im Mercedes-me-Profil auf der Kundendetailseite. Die Telefonnummer bleibt nicht änderbar. Batch 614.4.
- Die Weiterentwicklung umfasst die Verwaltung des Impressums über eine API-Schnittstelle sowie einen Endpunkt für das Customer Account Center mit den zugehörigen Daten und UI-Anforderungen für die kundenseitige Website. Batch 1305.3.

**Verträge, Historie und Status**

- Die Weiterentwicklung umfasst eine überarbeitete Vertragshistorie mit antichronologischer Sortierung. Bei Zeiträumen ist das Startdatum maßgeblich. Unter „Geändert von“ erscheint nur ein Benutzer, der aktiv eine Handlung ausgeführt hat. Batch 754.8.
- Die Weiterentwicklung umfasst die Statusbezeichnungen „Cancelation by market“ mit dem Zusatz „Rejected“ und „Cancel“ sowie die Zuordnung von Datumswerten zu den Vertragsstatus, bei der Vertragsbeginn, Erstellungsdatum, Aktivierungsdatum und Verkaufsdatum betrachtet werden. Batch 835.6.
- Die Weiterentwicklung umfasst eine Versionierung je Vertrag mit dem geänderten Objekt, dem Attribut, dem alten und dem neuen Wert, der Art der Änderung, dem Änderungsdatum und der Person, die die Änderung vorgenommen hat. Batch 862.4.

**Dokumente, Vorlagen und Benachrichtigungen**

- Die Weiterentwicklung umfasst E-Mail-Vorlagen für Benachrichtigungen, die Anwender selbst erstellen, sowie Dokumentvorlagen für gewerbliche Kunden, kurz B2B. Batch 395.5.
- Die Weiterentwicklung umfasst Master-E-Mail-Vorlagen als Erinnerung 30 und 60 Tage vor dem vorgesehenen Vertragsende sowie eine Master-E-Mail-Vorlage für die Fälle der Vertragsprüfung: Der Kunde muss zahlen, der Kunde muss nicht zahlen oder dem Kunden wird ein Betrag gutgeschrieben. Batch 395.5.
- Die Weiterentwicklung umfasst eine Anpassung der Benachrichtigung beim Klick auf „E-Mail senden“ bei einer langfristigen Verlängerung. Batch 395.5.
- Die Weiterentwicklung umfasst eine Suche nach Namen in den Registerkarten für Dokumente und Benachrichtigungen. Batch 395.5.
- Die Weiterentwicklung umfasst Vorlagen zum Herunterladen und Hochladen in einheitlichem Erscheinungsbild mit Mercedes-Benz-Blau als Hintergrund und weißer Schrift in allen Domänen mit solchen Vorlagen. Batch 1253.8.
- Die Weiterentwicklung umfasst eine allgemeine Verbesserung der E-Mails, damit Benutzer E-Mails korrekt anzeigen können, etwa über einen Hinweis zur Anzeige im Browser. Batch 391.6.

**Produkte und Preise**

- Die Weiterentwicklung umfasst einen Warnhinweis nach dem Speichern, wenn eine Industry mit einem Produkt verknüpft wird, für das bereits Preise existieren: „Prices should be assigned to the Industry in order to use the Industry“. Beim Veröffentlichen eines Produkts mit Objekten ohne Preise erscheint eine Warnung. Batch 1255.5.
- Die Weiterentwicklung umfasst das Lösen einer Industry von einem veröffentlichten Produkt ab der aktuellen Preisversion. Die Preise der Industry in der aktuellen Preisversion bleiben erhalten. Batch 1255.5.
- Die Weiterentwicklung umfasst die Änderung des Startdatums von Preisversionen bei Produkten mit Status „published“, ohne das Produkt vorher zu deaktivieren. Batch 1255.5.
- Die Weiterentwicklung umfasst eine doppelte Bestätigung beim Bearbeiten von Produkten, deren Änderungen wie Kontingente oder Mindest- und Höchstgrenzen für Reifen die Preisgestaltung beeinflussen können. Eine rote Markierung kennzeichnet nicht zusammenpassende Minimal- und Maximalwerte. Batch 1254.5.
- Die Weiterentwicklung umfasst die Übermittlung der jährlichen Laufleistung an den Vertrag für den MBLD-Fall. Der Punkt befindet sich in der Testphase. Batch 1254.5.
- Die Weiterentwicklung umfasst einen Tooltip für Entwurfspreisversionen in der Produktverwaltung. Batch 1244.4.
- Die Weiterentwicklung umfasst die Umrechnung von Kilometern in Meilen, eine vollständige Integration von VerSO, eine ISP-Code-Prüfung für Modellcode und SA-Code sowie die manuelle Ergänzung der Fahrgestellnummer bei Verträgen, die über eine Deal-ID oder Order-ID erzeugt wurden. Batch 1.6.
- Die Weiterentwicklung umfasst die Anzeige eines Änderungsprotokolls für angelegte Fahrzeuggruppen mit Objekt, aktuellem und vorherigem Wert, Änderungsdatum, Benutzer und Grund. Außerdem umfasst sie das Umsortieren der Tabellenspalten und unterschiedliche Sortierarten je Spalte. Dieser Punkt betrifft den Zeitraum nach dem MVP. Batch 26.6.

**Betrieb, Administration und Reporting**

- Die Weiterentwicklung umfasst die Einsicht in Fehler- und Warnprotokolle eines Chargenjob-Laufs über die Option „See Logs“. Der Suchbereich filtert nach Zeitstempel, Kritikalität mit den Werten Error und Warning per Mehrfachauswahl und Nachricht. Die Ergebnisliste zeigt Zeitstempel, Kritikalität und Nachricht. Batch 264.2.
- Die Weiterentwicklung umfasst eine direkte Synchronisierung vom Glue-Repository der Entwickler bis zur Bereitstellung. Änderungen lassen sich für ein einzelnes Modul oder für die gesamte IAC ausrollen. Batch 336.1.
- Die Weiterentwicklung umfasst Logs, mit denen sich die Nutzung der Datenprodukte durch Plattformen wie DDX und AQUA sowie durch weitere Verbraucher analysieren lässt. Batch 336.1.
- Die Weiterentwicklung umfasst eine Oberfläche für den Reiter „Data Update“ mit mehreren Abschnitten. Der Zahlungsabschnitt erscheint nur bei vorliegenden Zahlungsdetails. Außerdem umfasst sie die Anbindung der Backend-Schnittstellen. Batch 336.1.
- Die Weiterentwicklung umfasst die Anbindung des Zahlungsdienstes mPAY in einer Voruntersuchung. Geprüft werden eine Verwaltungsansicht für vorhandene Zahlungsmittel und deren Status, die Erstellung und Weitergabe von Zahlungslinks, etwa als QR-Code oder per E-Mail oder SMS, sowie eine Schnittstelle zur Rechnungsstellung mit Transaktions-ID. Betrachtet werden Offline Sales und Online Sales, jeweils als Einmal- und als monatliche Zahlung. Ein verbindlicher Funktionsumfang oder Termin liegt nicht vor. Batch 1311.4.

**Qualitätssicherung und Testautomatisierung**

- Die Weiterentwicklung umfasst produktionsspezifische UI-Tests im Gherkin-Format mit Schwerpunkt auf rein lesenden Abläufen. Die Szenarien werden in Xray definiert, laufen nach jedem Produktions-Release automatisch, sind in Allure einsehbar und dokumentieren die Ergebnisse mit Report-Link in Confluence. Batch 1314.7.
- Die Weiterentwicklung umfasst die Testabdeckung für die Produktanlage der relevanten Servicevertragsvarianten in der automatisierten Qualitätssicherung der Vertragskalkulation. Außerdem umfasst sie einen wiederverwendbaren API-Schritt als Vorbedingung für UI-Tests. Batch 1126.3.
- Die Weiterentwicklung umfasst den Abgleich der in den Benutzerdetails hinterlegten Sprache mit der angezeigten Oberflächensprache, eine Prüfung der Schnittstellen externer Services je Fachdomäne sowie die Synchronisierung von Selenium-Testläufen mit Xray-Berichten. Batch 1297.3.
- Die Weiterentwicklung umfasst risikobasierte Hinweise für manuelle und automatisierte Tests unter dem Namen Predictive Quality Signals. Ein Hilfsprogramm analysiert die Änderungshistorie und historische Fehlerberichte und markiert Hot Spots. Ein Sprachmodell formuliert daraus Checklisten für explorative Tests. Batch 1292.1.

**Infrastruktur und Plattformbetrieb**

- Die Weiterentwicklung umfasst eine festgelegte Deployment-Strategie mit Rollback-Konzept für ECS-Deployments. Geprüft werden Canary- und Linear-Strategien für Fargate. Das Draining der Target Groups wird bewusst konfiguriert. Batch 516.1.
- Die Weiterentwicklung umfasst eine effizientere CI/CD-Pipeline mit Caching von Abhängigkeiten, Caching von Docker-Layern über ECR und einer präzisen Eingrenzung der Trigger. Batch 516.1.
- Die Weiterentwicklung umfasst die Migration auf AWS Graviton für Lambda, ECS Fargate und die selbst gehosteten GitHub-Runner. Als Zielwert gelten rund 20 Prozent geringere Rechenkosten. Batch 516.1.
- Die Weiterentwicklung umfasst KPI-basiertes Monitoring, eigene Alarme für Fehler in den DevOps-CI/CD-Pipelines, Synthetics mit echten Endpunkten und Payloads sowie geringere Kosten für die Log-Erfassung. Batch 516.1.
- Die Weiterentwicklung umfasst eine überprüfte DevOps-Dokumentation mit vollständigem Handbuch, einem Abgleich der dokumentierten Werte mit der AWS-Konfiguration und dem Schnittstellenkatalog in Version 1.0. Batch 516.1.
- Die Weiterentwicklung umfasst eine Lambda-Funktion, die den Zustand der GitHub-Runner überwacht und im Fehlerfall über Verwaltungszugriff verfügt. Außerdem umfasst sie eine näher an Echtzeit ausgerichtete Skalierung von ECS Fargate. Batch 541.1.
- Die Weiterentwicklung umfasst ein Production Maintenance Window für Änderungen außerhalb der üblichen Betriebszeiten. Batch 531.5.
- Die Weiterentwicklung umfasst die Härtung der Sonar-Sicherheit. Batch 525.1.
- Die Weiterentwicklung umfasst die Aktualisierung der GitHub-Pages-Dokumentation und das Vorhaben Infrastructure Security und Platform Hardening mit Upgrades, Patches und Erweiterungen der Sicherheitswerkzeuge. Batch 527.2.
- Die Weiterentwicklung umfasst den Ausbau von Support und Monitoring. Batch 520.2.
- Die Weiterentwicklung umfasst die OTR-Integration mit dem Abruf von Fahrzeugdaten als Teil 1. Die Infrastruktur dafür ist vorbereitet. Batch 532.1.
- Die Weiterentwicklung umfasst die zeitgesteuerte Aktualisierung von Images zur Verringerung der Schwachstellen sowie die automatische Aktualisierung von Workflows in allen Repositories außer den End-to-End-Repositories. Batch 544.1.
- Die Weiterentwicklung umfasst die Behebung kritischer ECR-Findings im Document-Management-Service, im Customer-Service und im Notification-Service. Batch 1305.3.

**Hinweise.** Die Ausblickpunkte haben einen unterschiedlichen Detailgrad. Einzelne Punkte nennen nur Titel oder Ziele ohne Funktionsbeschreibung. Solche Punkte stehen im Klärungsbedarf. Die Vermerke zu Status und Pausierung gelten nur für die genannten Punkte.

Quellen: Batch 866.2, 1244.3, 1082.6, 1086.3, 772.2, 1098.5, 754.8, 614.4, 1305.3, 835.6, 862.4, 395.5, 1253.8, 391.6, 1255.5, 1254.5, 1244.4, 1.6, 26.6, 264.2, 336.1, 1311.4, 1314.7, 1126.3, 1297.3, 1292.1, 516.1, 541.1, 531.5, 525.1, 527.2, 520.2, 532.1, 544.1, 1305.3, 1098.5

## 22.3 Auswirkungen auf Schulung und Handbuch

**Zweck.** Dieser Abschnitt beschreibt, wie das Handbuch mit dem Funktionsstand und den Ausblickpunkten umgeht.

**Stand heute.** Material: keine Quellen in den RAG-Batches. Zu Schulungsunterlagen, Schulungsinhalten und Schulungsterminen liegen keine Angaben vor.

**Ausblick.** Material: keine Quellen in den RAG-Batches. Auswirkungen der Ausblickpunkte auf Schulungsinhalte liegen nicht vor.

**Hinweise.** Die Quellen geben folgende redaktionelle Vorgaben vor:

- Texte zu abgebrochenen Vorhaben werden nicht als Funktion beschrieben. Mehrere Abschnitte verlangen die ausdrückliche Freigabe durch das Release-Team, bevor ein Text in ein Benutzerhandbuch übernommen wird. Batch 928.1, 473.1, 932.1, 987.1.
- Abschnitte ohne Funktionstext oder mit reinem Redaktionskommentar werden nicht übernommen. Batch 920.1, 900.1, 1015.1.
- Die Erstellung eines Handbuchtexts aus Vorhabenbeschreibungen setzt einen Zielzustand, Akzeptanzkriterien und betroffene Rollen voraus. Batch 866.2.
- Ausblickpunkte erscheinen im Handbuch ausschließlich in neutraler Form. Sie beschreiben kein Verhalten des Systems.

Quellen: keine Quellen in den RAG-Batches zu Schulung und Handbuchpflege. Redaktionelle Vorgaben aus Batch 672.1, 920.1, 928.1, 932.1, 473.1, 1015.1, 576.1, 987.1, 935.1, 678.1, 900.1, 866.2

## 22.4 Releaseinformationen und Änderungsübersicht

**Zweck.** Dieser Abschnitt fasst die Änderungen aus den Releases zusammen, soweit das Material sie beschreibt. Er trennt Änderungen am Funktionsumfang von Änderungen an Infrastruktur und Betrieb.

**Stand heute.**

*Anwendung und Fachfunktionen*

- Reporting: Der ETL-Workflow protokolliert Fehler mit Ursache. Bei Fehlern in Glue- und Lambda-Jobs werden Meldungen samt Stack-Trace erfasst. Zusammengehörige Jobs eines Laufzyklus sind über eine Trace-ID nachverfolgbar. Batch 336.1.
- Reporting: Die Workflows für das Reporting-Modul sind produktiv. Bei jeder neuen CFT-Eingabe wird das vollständige Datenprodukt aktualisiert, die Bereitstellung erfolgt monatlich. Batch 336.1.
- Reporting: Die Lambda-Funktion für Datenprodukte aus dem Unified Data Model löst die Kosten-Datenprodukte in der INT-Umgebung aus. DynamoDB verwendet keine veralteten Einträge mehr. Ein Jobfehler bei gleichzeitig abgelegten Markt-ZIP-Dateien im CFT-Ordner ist beseitigt. Batch 336.1.
- Reporting: Der CFT-Job läuft bei erneutem Eingang derselben Datei genau einmal. Quelldateien werden nach erfolgreicher Verarbeitung gelöscht. Duplikate in den Vertragsdaten sind für alle Märkte entfernt. Batch 337.1.
- Fahrzeuggruppen: Bei Filtern mit mehr als zwei Optionen sind nach erneutem Öffnen wieder alle Optionen sichtbar und auswählbar. Batch 337.1.
- Verträge und VEGA: Steht die I155-Datei nicht zur Verfügung, erhält VEGA die zuletzt vorgenommenen Änderungen an Verträgen nicht. Batch 862.4.
- Händlerdateien: Die Händlerdatei lässt sich hochladen. Batch 547.1.
- Sicherheit Edge Contract: Die in Black Duck gemeldeten Befunde im Bereich Edge Contract sind bearbeitet. Batch 531.1.
- Repositories: Die Maskierung von CodeArtifact-Token entspricht dem Sollverhalten, die GitHub-Übersichtsseiten sind aktualisiert und die Dokumentation für Terraform-Module wird automatisch erzeugt. GitHub Runners und die AWS-Integration sind im Release enthalten. Batch 531.3.
- Support und Monitoring sind im Release berücksichtigt. Batch 531.4, 527.2.
- Technische Verbesserungen im Backend: Der Optimistic Lock im Config Service entspricht dem Sollverhalten, die Performance des SyncEsCostJob ist verbessert, und die End-to-End-Tests sind überarbeitet. Eine Strategie zur Erstellung von Testdaten ist eingeführt. Batch 1309.3.

*Plattform und Betrieb, DevOps*

- Zertifikate: Für alle externen Systeme ist die Erneuerung von Zertifikaten vollständig abgedeckt. Batch 516.1.
- Sicherheitsüberwachung: Ein Confluence-Dashboard zeigt kritische und hohe Schwachstellen aus den ECR- und Sechub-Scans. Aktualisierung, Ausführung und Vergleich sind automatisiert. Batch 525.1, 531.1.
- Automatisierung: Das GitHub-Next-Agentics-Framework ist eingeführt. Eine zentrale Plattform aktiviert oder deaktiviert GitHub-Actions-Workflows organisationsweit. Batch 525.1.
- Kostensenkung: Der Abschaltmechanismus für ECS und RDS in den Nicht-Produktivumgebungen ist erweitert, die Auslöser laufen an Werktagen. Batch 525.1.
- Sicherheitsprüfung in der Pipeline: SecHub ist in die kontinuierliche Build-Pipeline integriert. Für Blackduck gilt die Zuordnung DEVELOPMENT zur Integrationsumgebung INT, PRERELEASE zur Vorproduktionsumgebung prePROD und RELEASED zur Produktionsumgebung PROD. Batch 543.1.
- Release-Prozess Reporting-Infrastruktur: Der Workflow für Infrastruktur-Releases ist neu aufgebaut. SonarQube prüft die Codequalität, Tags und Releases werden erzeugt, und Release-Notes entstehen mit semantischer Versionierung. Batch 521.2.
- Release-Prozess Produktivumgebung: Ein Continuous Release ist eingerichtet. Probleme mit Release-Tag, Image-Aktualisierung und Terraform-Formatter-Action sind beseitigt. Batch 544.1.
- Migration des Release-Prozesses: SonarQube ist migriert, ein PR-Kommentator erleichtert die Lesbarkeit in Pull Requests, und Branching-Regeln sind festgelegt. Batch 527.2.
- Plattformbetrieb: Die Wartungsfenster von Kafka, OpenSearch und RDS entsprechen den oneSCM-Wartungen. KPI-basierte Datadog-Dashboards zeigen Ausfallzeiten je Service und den Gesamtstatus der Umgebung in allen vier Umgebungen. Batch 520.2.
- Produktivreleases: Der Wartungsablauf ist mit verbindlichem Runbook, Checkliste nach dem Release und Neustart-Pipelines beschrieben und automatisiert. Batch 520.2.
- Infrastruktur-Repository: Die Komponenten laufen über Terragrunt in allen Umgebungen dev, int, preprod und prod. Der Zustand wurde ohne Neuerstellung von Ressourcen migriert. Batch 520.2.
- Terragrunt-Module: Mock-Outputs ermöglichen die Befehle init und plan für alle Module. Die Instanzvorlage für On-Demand-Runner nutzt Docker, und das Basis-Image für das Back-End ist verkleinert. Batch 532.1.
- Terraform: Die Bereitstellung der Umgebungen erfolgt über eine Terraform-basierte Deployment-Automatisierung. Die Konfigurationen sind im Rahmen einer Sicherheitshärtung überarbeitet, die Terraform-Version ist aktualisiert. Batch 539.1.
- Datadog Log Forwarder: Die Lambda-Funktion ist in allen Umgebungen außer der Produktionsumgebung auf die aktuelle Version gebracht. Der Schritt „Check-deployment“ berücksichtigt lange Befehle. Batch 539.1.
- Datenbanküberwachung: Die RDS- und Aurora-Instanzen werden über CloudWatch Database Insights überwacht. Batch 537.1.
- Messaging: Alle Amazon-MSK-Cluster in der Region EU-CENTRAL-1 laufen auf einer unterstützten Version. Der Speichertyp ist auf allen Umgebungen gp3. Batch 537.1.
- Geheimnisse und Zugangsdaten: Der Secrets Manager ist in die Module integriert. Bei der Bereitstellung entsteht ein Profil im Format „Anwendungsname-aws“. Batch 547.1, 537.1.
- Betrieb: Der AWS Fault Injection Service ist mit ECS integriert. Eine Pipeline skaliert die Runner manuell. Ein Request Router für MPay ist eingerichtet. Batch 537.1.
- Datenablage: Im Nemesis-S3-Bucket liegt ein CFT-Ordner, der mit Terraform angelegt ist. Ein Berechtigungsfehler beim Data Catalog ist beseitigt. Batch 537.1.
- Datadog und Jira: In den Umgebungen PREPROD und PROD legt Datadog bei einem Fehler oder beim Stoppen der Anwendung automatisch einen Bug-Eintrag in Jira an. Batch 547.1.
- Sicherheit und Infrastruktur: AWS-Best-Practices sind eingeführt, eine Begrenzung der Anfragerate ist implementiert, und die Ressourcen der DEV-Umgebung werden zeitgesteuert optimiert. Die Validierung von CFT-Ordnern ist erweitert. Batch 544.1.
- Docker: Das Docker-Image ist auf eine native Variante umgestellt. Die Dokumentation der FileScanner-App liegt vor. Batch 544.1.
- Datei i155: Die Erzeugung der Datei i155 entspricht dem Sollverhalten, und die Beobachtbarkeitsvalidierung ist durchgeführt. Batch 544.1.
- Dokumentation: Die Dokumentation der Anwendung ist aktualisiert und validiert. Batch 538.1.

**Hinweise.** Die Angaben zu Infrastruktur richten sich an Betrieb und Administration. Die Architekturbeschreibung steht in Kapitel 19. Release-Notes und Versionierung setzen Commit- und Pull-Request-Konventionen voraus. Schwellenwerte für Qualitäts- und Freigabeprüfungen sind bewusst zu wählen, damit sie die Arbeit nicht unnötig ausbremsen. Batch 521.2.

**Ausblick.** Die Weiterentwicklung umfasst die Anzeige der Release-Version in der Benutzeroberfläche. Der Status dieses Punktes ist im Klärungsbedarf vermerkt. Batch 1309.3. Die Weiterentwicklung umfasst die Bereinigung der automatisierten Tests, die sich laut Material in der Analyse befindet. Batch 1309.3. Die übrigen Ausblickpunkte aus den Releasehinweisen stehen in 22.2.

Quellen: Batch 336.1, 337.1, 862.4, 547.1, 531.1, 531.3, 531.4, 527.2, 1309.3, 516.1, 525.1, 543.1, 521.2, 544.1, 520.2, 532.1, 539.1, 537.1, 538.1

## Verschiebung in andere Kapitel

| Inhalt | Zielkapitel | Batch |
|---|---|---|
| Job aktivieren, Batch-Überwachung im Administrationsbereich | 14.5 Administrationsbereich und zulässige Aktionen | 276.4, 363.2 |
| Chargenjob-Protokolle und Batch-Fehlerbehandlung | 19.22 Schnittstellenbetrieb und Fehlerbehandlung | 264.2 |
| Sonderfall-Detailansicht mit Vertragsinformationen | 12.4 Sonderfallanfrage und Begründung | 1089.7 |
| Reifenprodukte: Laufleistung und Vertragserstellung | 13.2 Produkt, Reifentyp und Reifengröße und 13.3 Laufzeit, Laufleistung und Leistungsumfang | 1185.3 |
| Mercedes-me-Profil und Namensformat | 4.3 Kundendaten und Pflichtangaben prüfen | 614.4, 754.8 |
| Kennzeichen, Sortierung und Abschnitt „Contract Status History“ | 10.2 Vertrags-, Kunden- und Zahlungsdaten ändern und 10.8 Änderungshistorie | 846.1 |
| Vertragshistorie, Versionierung und Statusbezeichnungen | 10.8 Änderungshistorie und 8.2 Statusübersicht | 754.8, 862.4, 835.6 |
| Steuerbetrag bei der oneERP-Rückmeldedatei | 11.2 Rechnungsstatus und Zahlungsstatus unterscheiden | 191.6 |
| Sprachdateien und Oberflächensprache | 3.9 Persönlicher Arbeitskontext und Sprachen | 529.2, 1297.3 |
| Dokumente anhängen im Zahlungsplan-Setup | 7.1 Zahlungsarten und Zahlungsintervalle | 363.2 |
| Industry-Verknüpfung, Veröffentlichung und Startdatum von Preisversionen | 14.8 Produktdefinition, Anlage und Veröffentlichung und 14.9 Preisversionen, Cluster und Faktorgrenzen | 1255.5, 1254.5, 1244.4 |
| Ablehnungsbenachrichtigungen | 8.7 Ablehnung, Verzögerung und Wiederaufnahme | 1082.6 |
| Laufzeit in den Produktoptionen, Feld „Salesman ID“ | 5.5 Laufzeit, Laufleistung und Optionen und 6.2 Vertragsdaten und Pflichtfelder erfassen | 1082.6 |
| Massenanlage: Wechsel zum Zahlungsplan und Kundentypen | 12.9 Massenanlage und Validierung von Fahrzeuglisten | 1086.3, 1082.6 |
| Kachel der Markteinstellungen | 14.2 Marktspezifische Einstellungen | 1086.3 |
| Ablehnungsgrund, Soft Reject, Kostenstellen und Kostenaufschlüsselung | 8.7 Ablehnung, Verzögerung und Wiederaufnahme und 11.4 Kostenmanagement und Claims | 866.2, 1244.3 |
| MO-Prüfung der Contract Generation | 9.2 MO Checks innerhalb der Vertragsanlage | 866.2 |
| Modellbezeichnung, Quelle des Kilometerstands, VEGA-Claims und Servicetyp aus DSB | 19.6 DSB: Kilometerstandsinformationen und 19.9 VEGA: Vertrag, Coverage und Claim | 1244.3 |
| Kilometer in Meilen, VerSO-Integration, ISP-Code-Prüfung, Fahrgestellnummer bei Deal-ID oder Order-ID | 5.3 Fahrzeugdaten, Pflichtfelder und Validierungsregeln | 1.6 |
| Prolongation bei geänderten Deckungen, Verlängerung mit Deckungen | 10.5 Verlängerung, Folgeangebot und Folgevertrag | 772.2 |
| Kurzzeitverlängerung: monatliche Rate nach Langzeitverlängerungen | 10.5 Verlängerung, Folgeangebot und Folgevertrag und 23.2 Bekannte Fehler | 1086.3 |
| Fehler beim Fahrzeug-Batchjob mit doppeltem Schlüssel | 23.2 Bekannte Fehler mit Markt- und Releasebezug | 1244.3 |
| Health Check im Administrationsbereich | 23.2 Bekannte Fehler mit Markt- und Releasebezug | 1311.4, 532.1 |
| Fehler beim Ändern der Sprache im Benutzerprofil | 23.2 Bekannte Fehler mit Markt- und Releasebezug | 547.1 |
| Online-Sales-Kundensuche mit exakter Trefferprüfung | 4.2 Vorhandene Kunden suchen und zuordnen | 1098.5 |
| Namensformat, Impressum über API, Customer Account Center | 14.2 Marktspezifische Einstellungen und 4.3 Kundendaten und Pflichtangaben prüfen | 1305.3 |
| Reporting: Datenprodukte, Synchronisierung, Logs, Data Update, Fehlerbehandlung | 11.7 Reporting, Filter und Exporte und 19.19 Datenplattformen und Reporting | 336.1, 337.1 |
| Fahrzeuggruppen: Änderungsprotokoll und Spaltensortierung | 14.11 Fahrzeuggruppen und Van-Baumuster-Clustering | 26.6 |
| Vorlagen für E-Mails, Dokumente, Suche und Gestaltung | 14.4 Vorlagenverwaltung und Template Management | 395.5, 1253.8, 391.6 |
| Mercedes-me-Profil auf der Kundendetailseite | 4.3 Kundendaten und Pflichtangaben prüfen | 614.4 |
| Protokolle eines Chargenjob-Laufs im Administrationsbereich | 14.5 Administrationsbereich und zulässige Aktionen | 264.2 |
| Testautomatisierung, Produktionstests, Xray und Selenium | 16.4 Testnachweise und produktiver Funktionsstand | 1314.7, 1126.3, 1297.3, 1292.1 |
| Deployment-Strategie, CI/CD-Effizienz, Graviton, Observability, Dokumentation, Sicherheitsüberwachung und Betrieb | 19.1 Architekturüberblick und Systemlandkarte und 19.23 Architekturregister und offene Nachweise | 516.1, 541.1, 525.1, 527.2, 532.1, 537.1, 538.1, 539.1, 544.1, 520.2, 531.5, 531.1, 543.1, 1305.3 |
| Release-Prozess, Versionierung, Release-Notes und Release-Version | 16.6 Quellen und Versionsführung | 521.2, 547.1, 1309.3, 527.2 |
| MPay: Voruntersuchung und Request Router | 19.15 MPay: Zahlungsintegration | 1311.4, 537.1 |
| Predictive Quality Signals als Hinweis für manuelle Tests | 16.4 Testnachweise und produktiver Funktionsstand | 1292.1 |
| OTR-Integration, Teil 1 | 19.5 OTR: Auftrags- und Fahrzeugbezug | 532.1 |
| Produktwarnungen für Reifengrenzen und MBLD-Laufleistung | 14.8 Produktdefinition, Anlage und Veröffentlichung und 19.x MBLD-Anbindung | 1254.5 |
| Konditionen von Kampagnen und Sonderanfragen beim Zurückgehen | 5.6 Preise, Kampagnen und Rabatte im Angebot | 1093.8 |
| Zahlungsplan-Vorschau im Vertrag | 6.2 Vertragsdaten und Pflichtfelder erfassen | 273.4 |

## Klärungsbedarf

**Widersprüche**

- Health Check: Batch 1311.4 beschreibt eine Fehlermeldung beim Betätigen der Schaltfläche. Batch 532.1 meldet, dass die Seite Health Check nicht erreichbar war und dieser Fehler beseitigt ist. Der heutige Stand ist zu bestätigen. Batch 1311.4, 532.1
- Graviton: Batch 516.1 führt die Migration auf AWS Graviton als Ausblickpunkt. Batch 538.1 meldet die Migration als fertiggestellt. Der Abschnitt 22.2 folgt 516.1, bis der Stand bestätigt ist. Batch 516.1, 538.1
- Commercial Fleet: Batch 380.3 beschreibt Filter und Pflichtfeld für den Kundentyp Commercial Fleet als Erweiterung. Batch 380.1 meldet die Erweiterung für Dokumente und Benachrichtigungen als abgebrochen. Batch 380.2 meldet das Gleiche für Vorlagen. Der Punkt 380.3 ist deshalb nicht in 22.2 aufgenommen. Batch 380.3, 380.1, 380.2
- Delta-Verarbeitung: Batch 337.1 beschreibt die Vorbereitung eines Delta-Lake-Ansatzes. Batch 336.1 und Batch 337.1 im Abschnitt zu weiteren Vorhaben melden die Delta-Verarbeitung als abgebrochen. Stand heute beschreibt die vollständige Aktualisierung. Batch 336.1, 337.1
- Schwachstellen-Dashboard: Batch 527.2 beschreibt das Confluence-Dashboard als vorgesehen. Batch 525.1 und Batch 531.1 melden es als eingerichtet beziehungsweise fertiggestellt. Der Text folgt 525.1 und 531.1. Batch 527.2, 525.1, 531.1
- Aktivierungsvarianten: Gliederungspunkt 8.5 nennt automatische und manuelle Aktivierungsvarianten. Batch 1092.5 beschreibt die manuelle Aktivierung und den Abbruch der automatischen Aktivierung. Der Text folgt 1092.5. Batch 1092.5
- Request Router und mPAY: Batch 537.1 meldet einen eingerichteten Request Router für MPay. Batch 1311.4 meldet, dass mPAY nicht in oneSCM integriert ist. Der Text nennt nur den Router als Infrastrukturkomponente. Batch 537.1, 1311.4
- Provisionsrechnung: Batch 190.1 beschreibt die Provisionsrechnung als Gutschrift, die an SWT übermittelt wird. Die Erweiterung zur Übermittlung als eigener Rechnungstyp ist abgebrochen. Der heutige Stand der Übermittlung ist zu bestätigen. Batch 190.1
- Allgemeine Angaben: Batch 546.1 enthält nur die Aussage, dass Stabilität und Nachvollziehbarkeit verbessert sind. Konkrete Änderungen fehlen. Batch 546.1

**Unklarer Status**

- Rechnungsstellung nach Geschäftsjahr für VAN-Kunden: Batch 170.3 meldet die Erweiterung als nicht enthalten, ohne Angabe, ob der Punkt abgebrochen ist oder offen bleibt. Batch 170.3
- Zahlungsintervalle jährlich, halbjährlich und vierteljährlich für B2B-Kunden: Batch 1185.3 meldet die Erweiterung als nicht enthalten, ohne Angabe des Vorhabenstatus. Batch 1185.3
- Punkte ohne eindeutigen Status: Batch 819.5 nennt Anzeige der Vertragswährung, Prüfprofil, Übertragung aktiver Verträge auf bestehende Kunden, Aktualisierung der Zahlerinformationen bei Einmalzahlung und Korrekturen bei Vertragsübertragungen. Batch 391.6 nennt Kopf- und Fußzeilen, Systemvorlagen für MO-Benutzer, SEPA-Mandat im Servicevertrag sowie Darstellung in Safari und in der PDF-Vorschau. Batch 819.5, 391.6
- Anzeige der Release-Version: Batch 1309.3 meldet die Anzeige als nicht enthalten, ohne Angabe des Status. Batch 1309.3
- Redis, Elasticache und Artifactory: Batch 539.1 meldet Migrationen ohne Details. Die Beschreibungsfelder enthalten Vorlagentexte. Der Redaktionshinweis nennt die Formulierung „Artifactory wurde nach AWS migriert.“ Batch 539.1
- Offener Fehler beim Fahrzeug-Batchjob: Batch 1244.3 nennt einen fehlgeschlagenen Batchjob in der Produktivumgebung mit doppeltem Schlüssel. Ursache, Umfang und Status fehlen. Batch 1244.3
- Zielverhalten bei Prolongation mit Deckungen: Batch 772.2 beschreibt Szenarien, aber kein Zielverhalten. Batch 772.2
- Vorgänge und Bearbeitungskreislauf: Batch 439.4 nennt die Zuweisung von Vorgängen und den Abschluss des Bearbeitungskreislaufs ohne weitere Angaben. Batch 439.4
- Contract Generation: Die Einträge sind mit Status „Offen“ gekennzeichnet. Zielzustand, Akzeptanzkriterien und betroffene Rollen fehlen. Batch 866.2
- Statusbezeichnungen und Datumszuordnung: Batch 835.6 nennt die Statusbezeichnungen und die Zuordnung der Datumswerte ohne Festlegung. Batch 835.6

**Eingestellte Vorhaben**

- Benachrichtigung bei fehlgeschlagenen Batchjobs per E-Mail, Korrektur der Druckvariable in der Aktivierungs-E-Mail und Entfernen der Funktion „Dokumente anhängen“ im Zahlungsplan-Setup: Batch 363.2. Die Funktion „Dokumente anhängen“ bleibt verfügbar.
- Vorschau des Zahlungsplans bei der Vertragserstellung: Batch 273.4.
- Aktionen für Gewerbekundendaten in der Ergebnistabelle und Anpassung für inaktive Kunden in „Warten auf Aktivierung“: Batch 647.2.
- Link von Vertragsnummer und Schadencode im Reiter „Financial Control“: Batch 211.3.
- Zahlungen über MPay bei langfristiger Verlängerung, Financial-Control-Seite für SWT, HSN-Code 998714 für den GST-Satz, Steuersätze bei Paketverkäufen und Übermittlung von Provisionen: Batch 190.1.
- Kundenprüfung in externen Listen und Genehmigungsprozess für Kundenänderungen: Batch 677.4.
- Behördliche Kunden mit den Typen „Commercial Governmental“ und „Private Governmental“: Batch 920.2.
- Mehrere Produkte in einem Vorgang: Batch 966.3.
- Vertragssuche nach Fahrgestellnummer, Kundennummer und Vertragsnummer: Batch 860.2.
- Begrenzung der Zeichenanzahl bei Kundennamen auf 35 Zeichen: Batch 601.2.
- Marktspezifische Fristen für Angebotsgültigkeit und Stornierung: Batch 1001.2.
- Signatureinstellung je Markt und Produkt: Batch 966.2.
- Lokalisierung nach Regionen mit Locales: Batch 529.2.
- Änderungsanfrage-E-Mail an den Endkunden und Fehler beim AGB-Link: Batch 433.5.
- Managed Contracts und Anzeige importierter Lieferantenrechnungen: Batch 724.3.
- Übertragung von Einmalzahlungsverträgen, CAS-Prüfung des neuen Eigentümers, B2B-Transfer und Fehler im Reiter „History“: Batch 815.2.
- Automatische Aktivierung eines Vertrags, neue Behandlung optionaler Deckungen und Identifikator-Validierung in der Massenanlage: Batch 1092.5.
- Batch-Job-Routing über das Gateway, Vertragsstatus „Contract is suspended“: Batch 264.6.
- Test mit aktualisierten ASSET-Dateien, DCS-Logik für Nemesis-Revenue-Dateien, ADP-Sharing und Scheduler des Financials Data Product: Batch 305.6.
- Bündelung der Vertragsdaten-Ereignisse, Umstellung „VAN_Car“ auf „VAN“, Base Data Products für MBD Van und Datenqualitätsregeln im Unified Data Model: Batch 324.2.
- Datenprodukt für Deutschland und die Division Cars sowie Variante „Base SC“ und Sammelvorhaben für übrig gebliebene Aufgaben: Batch 341.3.
- UI-Tests gegen die lokale Entwicklungs-UI und Korrektur der Suche in der Edge-Service-API: Batch 524.4.
- Statische Fußzeilenvorlage und Master-Kopfzeile: Batch 507.3.
- Prolongation-API für Leasing und Tests der Online-Sale-API: Batch 1148.3.
- Anlage einer Fahrzeuggruppe über „Baumuster suchen“: Batch 25.2.
- Steuerbetrag der Rückmeldedatei beim Import und Anzeige von Materialnummern mit Gültigkeitsbeginn in der Zukunft: Batch 191.6.
- Anzeige der Industry im Angebotsdokument und Erinnerungs-E-Mail mit Hinweis auf Verlängerung: Batch 365.5.
- Einheitliche Benennung von Feldern in den Edge-Service-APIs, Konsolidierung von Assertions und Branch-Meldung: Batch 532.4.
- Commercial Fleet in Dokumenten, Benachrichtigungen und Vorlagen: Batch 380.1, 380.2.
- Kampagnen in der Nachfrist und automatische Anwendung: Batch 1253.8.
- Zahlungsintervall in der Produktkonfiguration, Zurücksetzen der Kampagnen und Händlerrabatte und Sonderanfrage-Bestätigung: Batch 1093.8.
- Importzeitraum CePrO, stündlicher Versand zu gesperrten Fahrzeugen, Langbeschreibung bei Coverage Codes, Filter unter „Weitere Filter“, Safari-Darstellung und täglicher 404-Fehlerbericht: Batch 7.7.
- Delta-Verarbeitung im Reporting, tägliche Bereitstellung, Auswahl des Kundentyps im Kundendetails-Dialog und LocalStack: Batch 336.1, 521.2.
- Divisionsbezogene Datenprodukte, Datenqualitätsregeln im UDM, Historisierung des Vertragsstatus und Delta im ETL-Ladevorgang: Batch 337.1.
- Zusammenführung der History-Tabellen zu „Contract History“: Batch 846.1.
- Anzeige von Deckungen in der Vertragsübersicht: Batch 994.3.
- Trennung von Kunden- und Zahlungsinformationen: Batch 590.4.
- Langzeitverlängerung für Reifen und komplexe Produkte: Batch 781.4.
- Upload unterschriebener Serviceverträge: Batch 990.2.
- Intranet-zu-Internet-Domäne, Sicherung und Wiederherstellung von Kafka: Batch 544.1.
- Untersuchung zu Wrapper-Modul-Inkompatibilität und Fehler beim Ändern der Sprache im Benutzerprofil: Batch 547.1. Der Sprachfehler ist als bekannter Fehler offen, siehe Verschiebung in Kapitel 23.2.
- Log-Bereinigung und Konverter-Fehler: Batch 520.2 meldet den Konverter als geschlossen und die Log-Bereinigung als abgebrochen.
- Fehlertolerantes Autoscaling: Batch 537.1.
- AWS-Health-Konfiguration, Zustellkanäle und Terraform-Modul: Batch 531.5.
- Änderung der Kontaktaktivierung im Edge Service: Batch 525.1.
- Behebung kritischer SecHub-Findings für ein Team: Batch 1305.4.
- Manuelle Rechnungserstellung im Backend: Batch 219.2.
- Abschnitte ohne Funktionstext mit abgebrochenem Status: Batch 576.1, 672.1, 920.1, 928.1, 473.1, 932.1, 678.1, 935.1, 987.1, 900.1. Die Aufnahme in das Handbuch erfolgt nur bei ausdrücklicher Freigabe durch das Release-Team. Batch 928.1
- Mileage Check Market Operations Interface: Batch 1015.1. Der Abschnitt enthält einen Redaktionskommentar statt eines Handbuchtexts.
- Übermittlung von Zahlungsbeginn und Zahlungsende an NEMESIS: Batch 253.5.
- Behandlung von Deferred Logic in SWT, Zahlungsart Banküberweisung für Behördenkunden mit Versand der Rechnungen an oneERP sowie Aktualisierung der Hauptnavigation für Revenue und Cost Management: Batch 196.3.

**Geschlossene Meldungen**

- Hinweisbanner für Wartungen und Systemausfälle: Batch 911.3. Die Meldung ist geschlossen. Der dokumentierte Zielzustand ist nicht als Funktion aufgenommen. Die Entscheidung über eine Aufnahme liegt bei der Redaktion. Batch 911.3
- Störung des Jobs SAPInvE169EXP im Backend: Batch 219.2. Die Störung ist geschlossen.
- Störung bei der Anmeldung von Benutzern der Marktoperation an der Produktivumgebung: Batch 537.1. Die Störung ist geschlossen.
- Meldungen zu Feldbenennung, Assertions und Branch: Batch 532.4. Die Meldungen sind geschlossen.

**Inhaltsleere Meldungen**

- Zuordnung des P.En-Codes zu einer Kampagne im Rahmen der VdZ-Integration: Batch 1176.4. Umfang und Verhalten fehlen.
- Pricing Engine P.EN: Batch 145.3. Umfang, Zielgruppe und Funktionsweise fehlen.
- Historisierung des erneuten Auslösens von Signaturen und systeminterne Benachrichtigung für neu importierte Baumuster aus CePrO: Batch 366.6. Nur Titel liegen vor.
- Übernahme der Reporting-Services: Batch 524.4. Details fehlen.
- Themen ohne Beschreibung: Batch 349.1 nennt nur Titel offener Punkte.
- Cleanup in der App nach Testläufen der automatisierten Qualitätssicherung: Batch 1305.4. Ziel und Umfang fehlen.
- Wiederverwendbarer API-Schritt als Vorbedingung und Anwendung der API-Vorbedingung in UI-Tests: Batch 1126.3. Nähere Angaben fehlen.
- Abgleich der Sprache, Prüfung externer Services und Xray-Synchronisierung: Batch 1297.3. Für diese Punkte fehlen weitere Details.
- Datenbanküberwachung, Terraform, Valkey und Elasticache mit Platzhaltertexten: Batch 539.1, 541.1. Die Beschreibungsfelder enthalten nur Vorlagentexte.
- WAF-Dashboard in Datadog: Batch 543.1. Inhalt und Umfang fehlen.
- Allgemeine Release-Aussage ohne konkrete Änderungen: Batch 546.1.
- Pauschale Angaben zu Release-Verbesserungen im Bereich Reporting und DevOps: Batch 541.1, 546.1.

## Vorschläge zur Gliederung

- Titel 22.2: Der Gliederungstitel enthält den Wortstamm „plan“ in einer Form, die die Stilregeln ausschließen. Vorschlag: „Erweiterungen und offene Anforderungen“.
- Titel 16.6: Der Gliederungstitel enthält einen Begriff aus der Verbotsliste der Stilregeln. Vorschlag: „Quellen und Versionsführung“.
- Abschnitt 22.3: Für Schulung und Handbuch liegen keine Quellen vor. Vorschlag: Inhalt aus den Schulungsunterlagen ergänzen oder den Abschnitt mit 22.4 zusammenlegen.
- Abschnitt 22.4: Anwendungsfunktionen und Plattformbetrieb sind vermischt. Vorschlag: Trennung in „Releaseinformationen Anwendung“ und „Releaseinformationen Plattform“. Die Plattformangaben gehören in Kapitel 19.
- Abschnitte ohne Unterkapitel, 43 Batches aus dem Material: Vorschlag: Unterkapitel 22.5 „Abgebrochene Vorhaben und Klärungsregister“ oder ein Verweis auf Anhang F.1. Der Entwurf ordnet die Abschnitte nach Inhalt zu.
- Klärungsbedarf: Die Liste gehört in Anhang F.1 und wird dort gepflegt. Das Kapitel 22 verweist auf diesen Anhang.
- Verweis auf Kapitel 8.5: Die Aussage zu automatischen Aktivierungsvarianten ist mit Batch 1092.5 abzustimmen.
