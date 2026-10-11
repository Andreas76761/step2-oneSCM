# 19 IT Architektur

Dieses Kapitel beschreibt die technische Architektur von oneSCM aus Sicht der Fachanwendung. Es zeigt, welche Domänen und Dienste beteiligt sind, über welche Wege Daten mit angebundenen Systemen ausgetauscht werden, wie Batch-Jobs und Fehlerbehandlung arbeiten und welche Architekturnachweise vorliegen. Die fachlichen Abläufe, die diese Schnittstellen auslösen, beschreiben die Kapitel 2 bis 18.

## 19.1 Architekturüberblick und Systemlandkarte

**Zweck.** Dieser Abschnitt zeigt, aus welchen Domänen und Diensten oneSCM besteht und wie sie zusammenarbeiten. Sie erkennen daraus, welches System einen Vorgang auslöst, welches ihn verarbeitet und wo Rückmeldungen erscheinen. Die einzelnen Schnittstellen beschreiben die Unterkapitel 19.2 bis 19.31.

**Voraussetzungen.** Für den Überblick sind keine technischen Zugänge erforderlich. Welche Funktionen Ihre Rolle nutzen darf, beschreibt Kapitel 2.

**Rollen.** Die Systemlandkarte richtet sich an Fachverantwortliche, Administratoren und den Support. Market Operations MO prüft Rückmeldungen und Ausnahmen aus den Schnittstellen. Die Rollen Dealer, MPC und MO sehen Systembenachrichtigungen im Benachrichtigungscenter am rechten Bildschirmrand.

**Aufbau der Systemlandkarte.** oneSCM besteht aus fachlichen Diensten, die getrennt betrieben werden. Die Dienste tauschen Daten über REST-Aufrufe, Kafka-Ereignisse, Ablagen in S3 und Datenbankzugriffe aus. Das Material nennt folgende Bereiche:

- Vertragsservice, im Material Contract Service genannt: führt die Vertragsdaten und die Zustände der Verträge.
- Revenue-Service: Rechnungsstellung, Zahlungsplan, Exporte an das Finanzsystem, Ereignisse an NEMESIS und Zahlungstransaktionen über MPay. Die Kostenverwaltung ist in den Revenue-Service integriert, sodass die Finanzfunktionen eine einheitliche Domäne bilden.
- Kundenverwaltung: Kunden, Zahlungsinformationen sowie Abgleiche mit den Finanzsystemen und mit CAS.
- Edge Service: externe Schnittstelle für Online-Vertrieb, Leasing, Produktabfragen, Vertragsabfragen und Kilometerstände.
- Dokumenten- und Benachrichtigungsdienst: Vorlagen, erzeugte Dokumente und das Benachrichtigungscenter.
- Konfigurationsdienst: Markteinstellungen, Marktdokumente und Vorlagenverwaltung.
- Fahrzeugverwaltung, im Material Vehicle Management genannt: Fahrzeugdaten, Kilometerstände und Abrufe aus den Vorsystemen.
- Batch-Jobs: zeitgesteuerte und manuell gestartete Verarbeitungsläufe.

Die Dokumentation je Dienst enthält ein Anwendungskontext-Diagramm nach dem C4-Modell. Jeder Dienst hat einen eigenen Reiter, in dem alle internen Kommunikationswege erfasst sind, darunter REST, Kafka, S3 und Datenbank. Zur Anwendungsdokumentation gehören das Everybook, das Playbook sowie der Verantwortliche und dessen Vertretung je Dienst.

**Betrieb und Infrastruktur.** Die Infrastruktur ist versioniert, und die Rollenverwaltung im Identity Provider ist teambasiert organisiert. Der öffentliche Lastverteiler nimmt Anfragen aus dem Internet entgegen. Für interne Aufrufe besteht ein eigener Lastverteiler, bei dem jeder Mikroservice als Ziel registriert ist. Interne Endpunkte erreichen Sie daher nicht direkt, sondern über einen Pfad je Dienst. Die Skalierung richtet sich nach der Anzahl der Anfragen. Container-Images liegen in einem eigenen AWS-Konto. Der Abgleich der AWS-Umgebung mit dem Terraform-Stand erfolgt per Terraform Plan. Die AWS-Umgebung enthält keine ungenutzten Komponenten.

**Betriebsbereitschaft.** Jeder Dienst legt fest, welche Informationen auf den Log-Ebenen DEBUG, INFO, WARN und ERROR protokolliert werden. Die Alarme für den Betrieb werden über den Benachrichtigungsdienst SNS ausgelöst. Ein Datadog-Monitor sendet eine Benachrichtigung, wenn eine Anwendung nicht mehr läuft und keine aktive Instanz mehr verfügbar ist. Die Skalierbarkeit eines Dienstes berücksichtigt geplante Jobs und Caching. Externe Abrufe, die der Job E169 für die Verarbeitung benötigt, werden zwischengespeichert, sodass redundante Anfragen entfallen. Dies verbessert die Antwortzeiten, vor allem bei großen Rechnungsmengen und Sammelrechnungen. Die Wiederholung von Aufrufen und der Circuit Breaker beschreibt Abschnitt 19.22.

**Datenhaltung.**

- Vorlageninhalte für Dokumentenmanagement und Benachrichtigungsdienst werden im Datentyp bytea direkt in der Tabellenzeile gespeichert. Pro Wert gilt eine Obergrenze von 1 GB. Der Datentyp OID wird nicht mehr verwendet, und das Kopieren von Vorlagendaten zwischen Umgebungen erfordert keine Umwandlung mehr.
- Marktdokumente werden direkt aus dem Frontend in der Dokumentenverwaltung hochgeladen. Der Konfigurationsdienst speichert anschließend ID, Name und Version des Dokuments in der Tabelle der Marktdokumente.
- Die Zustimmungen zu den Nutzungsbedingungen unterliegen einem Löschkonzept auf Benutzerebene. Bei aktiven Benutzern erfolgt die Löschung drei Jahre nach der letzten Aktualisierung der Nutzungsbedingungen, gerechnet bis zum Ende des Jahres. Diese Benutzer stimmen den Nutzungsbedingungen daher erneut zu, auch wenn sich diese nicht geändert haben. Bei nicht mehr aktiven Benutzern erfolgt die Löschung drei Jahre nach der letzten Anmeldung.
- Ein Batch-Job erzeugt eine Protokolldatei zu den Zustimmungen. Sie liegt auf S3, ist ein Jahr lang verfügbar und enthält Benutzer-ID, Datum und Uhrzeit sowie die Version der Nutzungsbedingungen.
- Die Revenue-Anwendung schreibt keine Kafka-Debug-Logs, da diese Protokollierung ein sehr großes Volumen erzeugt.

**Oberfläche.** Im Customer Self Service steht im Fuß jeder Seite der Link „Licenses“ zur Verfügung. Er öffnet ein Fenster mit allen Lizenzen der Drittanbieter-Pakete, die in der Benutzeroberfläche verwendet werden. Für Märkte gibt es Sicherheitsbereiche.

**Ergebnis und Systemstatus.** Sie erkennen anhand der Systemlandkarte, welcher Dienst einen Vorgang verarbeitet. Rückmeldungen aus den Schnittstellen ordnen Sie dem Unterkapitel zu, das die jeweilige Schnittstelle beschreibt. Die Systemlandkarte gilt für alle Märkte und Sparten gleich.

**Besonderheiten je Sparte und Markt.** Das Finanzsystem eines Marktes bestimmt, welche Schnittstellen für Rechnungen und Kunden genutzt werden. oneERP, SWT und CoFiCo beschreiben die Unterkapitel 19.11, 19.12 und 19.14. Die Ordnerstruktur der Dateiübertragung je Markt beschreibt Abschnitt 19.21.

**Hinweise.** Die Architekturdokumentation ergänzt die fachlichen Abläufe. Sie beschreibt Systeme und Übergaben, nicht die Bedienung der Oberfläche.

**Fehlerbehebung.** Das Material enthält keine Schritte zur Fehlerbehebung für die Systemlandkarte selbst. Fehler in Schnittstellen behandelt Abschnitt 19.22.

Quellen: Batch 1302.1, 1303.1, 1301.1, 1306.1, 1291.1, 1290.1, 1312.1, 1313.1, 546.4, 1304.1, 1210.1

## 19.2 GO – Pkw-Auftragsinformationen

**Material:** Die RAG-Batches enthalten keine Abschnitte, die die Pkw-Auftragsinformationen selbst beschreiben. Der Batch-Job für GO ist im Abschnitt zur Einrichtung der Batch-Jobs beschrieben und wird hier übernommen.

**Batch-Job für GO.** Für das Vorsystem GO steht der Batch-Job „GetDeliveryDateGlobalOrder“ zur Verfügung. Sie legen ihn an der üblichen Stelle für Batch-Jobs an und terminieren ihn nach den bestehenden Regeln. Die Terminierung erfolgt über eine Cron-ähnliche Einstellung. Als automatischer Rhythmus ist ein Lauf pro Monat vorgesehen. Der Abruf von Lieferterminen aus GO ist in Abschnitt 19.31 beschrieben.

Quellen: Batch 1178.2

## 19.3 AFAB – Van-Auftragsinformationen

**Zweck.** AFAB liefert Stammdaten zu Van-Fahrzeugaufträgen aus dem van-spezifischen Bestellsystem. Die Abfrage unterstützt Vertriebsfälle, in denen zunächst nur eine Auftragsnummer vorliegt und noch keine Fahrgestellnummer.

**Voraussetzungen.** Für die Übergabe der Fahrzeugstammdaten an die Vertragserstellung ist ein verfügbares Produkt erforderlich. Die Auftragsnummer muss einem Van zugeordnet sein.

**Ablauf bei der Auftragsnummer eines Vans.**

1. Sie geben im Vertragsangebot eine Auftragsnummer für einen Van ein.
2. oneSCM ruft bei einer Auftragsnummer für Vans die AFAB-API auf. Für Pkw verwendet das System die Go-Order-API, siehe Abschnitt 19.2.
3. oneSCM ruft die Details zur Auftragsnummer ab und übergibt sie an die Generierung, so wie bei der Auftragsnummer eines Pkw.
4. Die Fahrzeugstammdaten stehen für die Kundentypen Gewerblich und Privat zur Verfügung.

**Batch-Job für den Liefertermin.** Der Job „GetDeliveryDateAFABOrder“ fragt AFAB entweder über die Auftragsnummer oder über die FIN/VIN ab. Den Liefertermin entnimmt das System dem dafür vorgesehenen Feld „GLT BAT Err EN: TDD-BAT calc.“ der AFAB-Antwort beziehungsweise der AFAB-Datei. Die Bezeichnung trägt die Sprachkennung EN. Ist das Feld befüllt, meldet das System den Termin an CONTRACT. Ist es leer, meldet das System für diesen Auftrag in diesem Lauf nichts. Bei den nächsten geplanten Läufen fragt es erneut ab, bis ein Termin vorliegt. Als Standardwert gilt ein zweimaliger Lauf pro Monat.

**Ergebnis und Systemstatus.** Die Fahrzeugstammdaten erscheinen in der Vertragserstellung, sobald die AFAB-Abfrage sie liefert. Ein Liefertermin erscheint erst, wenn das Feld in der AFAB-Antwort befüllt ist.

**Besonderheiten je Sparte und Markt.** AFAB gilt ausschließlich für Vans. Für Pkw wird die Auftragsnummer über die Go-Order-API abgerufen, siehe Abschnitt 19.2. Die Kundentypen Gewerblich und Privat werden gleich behandelt.

**Hinweise.** Der Abruf von Lieferterminen aus AFAB ist mit dem Abruf aus GO im Abschnitt 19.31 beschrieben. Die Einrichtung der beiden Batch-Jobs erfolgt an der üblichen Stelle für Batch-Jobs.

**Fehlerbehebung.** Fehlt ein Liefertermin, prüfen Sie zuerst, ob das Feld in der AFAB-Antwort befüllt ist. Solange das Feld leer ist, wird kein Termin gemeldet.

Quellen: Batch 1195.3, 1162.3, 1178.4, 1178.2

## 19.4 CEPRO – Van-Fahrzeugstammdaten

**Zweck.** CePro liefert die Fahrzeugstammdaten für Pkw und Vans. Die Fahrzeugverwaltung stellt diese Daten der Vertragserstellung und der Produktauswahl bereit. Die Schnittstelle für Produktgruppen dient der Prüfung und Anbindung durch Fachverantwortliche.

**Voraussetzungen.** Für die Abfrage der CePro-Stammdaten-API benötigen Sie ein Access Token. Für die Prüfung mit der Postman Collection muss die Collection auf dem lokalen Rechner installiert sein.

**Rollen.** Die Einrichtung über die Postman Collection richtet sich an Product Owner und Business Analysten, die die Schnittstelle selbst ausprobieren und nachvollziehen möchten.

**Ablauf der CePro-Stammdaten-API.**

1. Installieren Sie die Postman Collection auf dem lokalen Rechner.
2. Rufen Sie ein Access Token ab.
3. Rufen Sie die API mit dem Token auf und übergeben Sie eine Produktgruppen-Angabe, zum Beispiel die Produktgruppe mit dem Identifier „P“.
4. Die Antwort enthält alle Informationen, die die API für die Produktgruppe bereitstellt.

**Import der Fahrzeugdaten.** Der Import der Fahrzeugdaten über CePro für Pkw und Vans ist zusammengeführt und läuft marktübergreifend. Fahrzeuge mit 4Matic und Hybridmotor werden im Import korrekt übernommen. Der Job CePro-Import schlägt nicht mehr fehl. Die Marke AMG wird wie die Marke Maybach angezeigt, sodass sich AMG-Modelle ohne Performance-Motor gezielt von anderen Fahrzeugen unterscheiden lassen. Der Job CePro-Import ist ein globaler Job, der die Daten für alle Märkte aktualisiert, siehe Abschnitt 19.22.

**Drei Abgleich-Jobs.** Neben dem Import laufen drei weitere Jobs, die jeweils marktübergreifend arbeiten. Der Job zur Synchronisierung der Servicehistorie ruft DSB auf und prüft die Servicehistorie jedes Fahrzeugs. Der Job zur Synchronisierung von Fahrzeugbestellungen ruft AFAB oder GO auf, kontrolliert den Liefertermin und die Zuteilung der Fahrgestellnummer. Der Fahrzeugabgleich ruft für jedes Fahrzeug in der eigenen Datenbank VeDoc auf und speichert die Informationen erneut. Der Job zur vollständigen Synchronisierung der Produkte indiziert die Produkte in ElasticSearch neu und wird je Markt ausgeführt. Die abweichende Aussage zur marktübergreifenden Ausführung steht im Klärungsbedarf.

**Servicehistorie über DSB.** Die Abfrage der Servicehistorie übermittelt die FIN. Eine Abfrage über die VIN ist nicht möglich. Übergeben werden außerdem der Ländercode, die Sprache, die Anzahl der benötigten Services Ist das Feld leer, erhalten Sie alle durchgeführten Services, das aktuelle Datum und optional der aktuelle Kilometerstand. Die Antwort enthält, ob das Fahrzeug gewartet wurde und ob die regelmäßigen Services innerhalb der Toleranz liegen. Die Daten aus DSB speichert oneSCM 30 Tage lang im Cache. Der Vertrag kann so alle Phasen durchlaufen, ohne dass DSB erneut abgefragt wird. Die DSB-Schnittstelle ist in Abschnitt 19.6 eingeordnet. Die Kilometerstand-API für Systeme, die Kilometerstände austauschen, beschreibt Abschnitt 19.22.

**Ergebnis und Systemstatus.** Die Antwort an die Generierung enthält den Grund, wenn Produkte für ein Fahrzeug nicht angezeigt werden. Das ist der Fall, wenn das Fahrzeug bereits in Betrieb ist, die Daten in DSB aber noch nicht vorliegen.

**Besonderheiten je Sparte und Markt.** CePro betrifft Pkw und Vans. Der Job zur Synchronisierung von Fahrzeugbestellungen nutzt AFAB oder GO.

**Hinweise.** Die Validierung von Servicehistorie und Zulassung für Verträge beschreibt Kapitel 5.3.

**Fehlerbehebung.** Erscheint keine Produktliste, zeigt die Antwort den Grund. Ist das Fahrzeug bereits in Betrieb und liegen die Daten in DSB noch nicht vor, liefert die Antwort einen entsprechenden Hinweis.

Quellen: Batch 23.1, 8.5, 1165.2, 22.2, 1204.6, 1258.8, 516.2

## 19.5 OTR – Auftrags- und Fahrzeugbezug

**Zweck.** Dieser Abschnitt beschreibt, wie oneSCM Fahrzeuge aus One Touch Retail, kurz OTR, Auftragsnummern und Fahrgestellnummern miteinander verknüpft.

**Voraussetzungen.** Die Deal-ID stammt aus OTR. Ohne Deal-ID kann die Prüfung der Fahrzeuge im Deal nicht ausgeführt werden.

**Ablauf der Prüfung einer Deal-ID.**

1. Die Deal-ID aus OTR wird übergeben.
2. oneSCM ermittelt anhand der Deal-ID die Anzahl der Fahrzeuge im Deal.
3. Ist genau ein Fahrzeug vorhanden, ist die Prüfung erfolgreich, und das Produkt wird an die Generierung gesendet.
4. Sind mehr als ein Fahrzeug vorhanden, erscheint eine Fehlermeldung. Es wird kein Produkt an die Generierung gesendet.
5. Ist kein Fahrzeug zugeordnet, erscheint ein Fehler mit dem Hinweis, dass dem Deal kein Fahrzeug zugeordnet ist.

**Auftragsnummer zur Fahrgestellnummer.** Die Auftragsnummer eines Fahrgestells fragt oneSCM bei VeDoc an und übergibt sie an die Vertragserzeugung. Die Anfragen an VeDoc sind auf maximal 300 pro Minute begrenzt, damit keine Fehlermeldungen vom Typ 429 entstehen. oneSCM unterschreitet diesen Wert.

**Kilometerstandsdaten über MIC.** Der MIC-Dienst wird erst verwendet, nachdem der Kunde den Vertrag unterzeichnet hat, also im Status CONFIRMED. Bis dahin ist der Abruf von Kilometerstandsdaten für ein Fahrzeug untersagt. Die Antwort enthält deshalb keinen Kilometerstand aus MIC.

**Fahrgestellnummer bei Verträgen mit Auftragsnummer.** Bei Verträgen mit Auftragsnummer übernimmt oneSCM die Fahrgestellnummer nicht nur bei der ersten Zuordnung. Das gilt auch für Verträge, die zunächst mit einem Baumuster angelegt wurden und denen später eine Auftragsnummer als Identifikator hinzugefügt wurde. Die Berechtigung für diesen Ablauf beginnt in dem Moment, in dem die Auftragsnummer dem Vertrag als Identifikator zugewiesen wird. Ändert sich die Fahrgestellnummer in OTR, übermittelt der Fahrzeug-Microservice die aktuelle Nummer. Der Vertrag übernimmt sie im gesamten Vertrag. Die zuletzt gelieferte Fahrgestellnummer überschreibt frühere Werte, die nur vorläufige Arbeitswerte sind. Der Vertrag bildet daher stets das Fahrzeug ab, das in OTR zugeordnet ist. Diese Überschreibung ist nur möglich, bis das Erstzulassungsdatum, kurz FRD, hinzugefügt wird.

**Anzeige kompatibler Produkte.** Wird zum eingegebenen Identifier kein Ergebnis gefunden, erscheint die Meldung, dass der Identifier keine Ergebnisse geliefert hat. Die Eingabe ist zu prüfen und anzupassen. Je nach Fall wird ergänzt, dass eine gültige Fahrgestellnummer, Auftragsnummer oder ein gültiger Modellcode einzugeben ist. Betrifft der Fall Fahrzeuge ohne erfasste Services in DSB oder Fahrzeuge mit Services, die nicht den Mercedes-Benz-Standards entsprechen, verweist der Hinweis auf die durchgeführten Services und deren Reihenfolge. Bei einem falschen Identifier erscheinen keine Produkte, sondern ein Hinweis.

**Batch-Aufruf für Fahrgestellnummern.** Ein Batch-Aufruf ruft die Fahrgestellnummern für Pkw und Vans aus den Auftragsnummernsystemen GO und AFAB ab und stellt sie bereit. Dies ist erforderlich, weil BTO-Fälle mit Auftragsnummer in der Generierung angelegt werden. Ohne Fahrgestellnummer kann der Generierungsprozess nicht fortgesetzt werden.

**Ergebnis und Systemstatus.** Das System übernimmt die von OTR gelieferte Fahrgestellnummer in den Vertrag, solange das Erstzulassungsdatum nicht erfasst ist. Ab diesem Zeitpunkt bleibt die Fahrgestellnummer unverändert.

**Besonderheiten je Sparte und Markt.** Der Bezug zu OTR gilt für Pkw und Vans. Für Pkw ist GO und für Vans AFAB die Quelle der Auftragsdaten, siehe die Abschnitte 19.2 und 19.3.

**Hinweise.** Die Prüfungen auf Fahrzeugalter bei FRD-basierten Produkten, auf eine Laufleistung über dem zulässigen Höchstwert und auf eine einzige, abgelaufene Preisversion sind im Material nicht als Teil dieser Abläufe beschrieben. Sie stehen im Klärungsbedarf.

**Fehlerbehebung.** Bei mehr als einem Fahrzeug im Deal erscheint eine Fehlermeldung, und es wird kein Produkt an die Generierung gesendet. Die Deal-ID muss genau ein Fahrzeug abbilden. Bei einem falschen Identifier zeigt das System einen Hinweis statt Produkten.

Quellen: Batch 1263.4, 874.1, 1251.4, 1132.3
