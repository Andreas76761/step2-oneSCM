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

**Betriebsbereitschaft.** Jeder Dienst legt fest, welche Informationen auf den Log-Ebenen DEBUG, INFO, WARN und ERROR protokolliert werden. Die Alarme für den Betrieb werden über den Benachrichtigungsdienst SNS ausgelöst. Ein Datadog-Monitor sendet eine Benachrichtigung, wenn eine Anwendung nicht mehr läuft und keine aktive Instanz mehr verfügbar ist. Die Skalierbarkeit eines Dienstes berücksichtigt terminierte Jobs und Caching. Externe Abrufe, die der Job E169 für die Verarbeitung benötigt, werden zwischengespeichert, sodass redundante Anfragen entfallen. Dies verbessert die Antwortzeiten, vor allem bei großen Rechnungsmengen und Sammelrechnungen. Die Wiederholung von Aufrufen und der Circuit Breaker beschreibt Abschnitt 19.22.

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

**Batch-Job für den Liefertermin.** Der Job „GetDeliveryDateAFABOrder“ fragt AFAB entweder über die Auftragsnummer oder über die FIN/VIN ab. Den Liefertermin entnimmt das System dem dafür vorgesehenen Feld „GLT BAT Err EN: TDD-BAT calc.“ der AFAB-Antwort beziehungsweise der AFAB-Datei. Die Bezeichnung trägt die Sprachkennung EN. Ist das Feld befüllt, meldet das System den Termin an CONTRACT. Ist es leer, meldet das System für diesen Auftrag in diesem Lauf nichts. Bei den nächsten terminierten Läufen fragt es erneut ab, bis ein Termin vorliegt. Als Standardwert gilt ein zweimaliger Lauf pro Monat.

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

## 19.6 DSB – Kilometerstandsinformationen

**Material:** keine Quellen in den RAG-Batches.

Zu dieser Schnittstelle liegen keine Abschnitte vor. Die Servicehistorie über DSB beschreibt Abschnitt 19.4, die Kilometerstand-Schnittstellen des Edge Service beschreibt Abschnitt 19.22.

Quellen: keine Quellen in den RAG-Batches

## 19.7 Warranty-and-Goodwill-API

**Material:** keine Quellen in den RAG-Batches.

Zu dieser Schnittstelle liegen keine Abschnitte vor. Die Servicehistorie aus dem System Warranty and Goodwill, die über DSB bereitgestellt wird, beschreibt Abschnitt 19.4.

Quellen: keine Quellen in den RAG-Batches

## 19.8 MIC – Fahrzeugdaten-API

**Material:** keine Quellen in den RAG-Batches.

Zu dieser Schnittstelle liegen keine Abschnitte vor. Den Abruf von Kilometerstandsdaten über MIC nach der Vertragsbestätigung beschreibt Abschnitt 19.5.

Quellen: keine Quellen in den RAG-Batches

## 19.9 VEGA – Vertrag, Coverage und Claim

**Zweck.** VEGA verarbeitet Vertrags-, Deckungs- und Schadendaten. oneSCM übermittelt Vertragsdaten und Deckungen an VEGA und empfängt von VEGA Schadenfälle, Kostendetails und Händlerdaten. Dieser Abschnitt beschreibt die Dateischnittstellen i155 und i156, die Vergabe der Coverage-IDs, die Statusübergänge, die Verlängerungs- und Kontingentabläufe sowie die Händlerdaten, die VEGA benötigt.

**Voraussetzungen.** Die Datei i155 entsteht bei der Aktivierung eines Vertrags und bei Änderungen am Vertrag oder an den Deckungen nach der Aktivierung. Für den Import der Datei i156 muss die Datei in AWS verfügbar sein, und Fahrzeug sowie Servicevertrag müssen in oneSCM vorhanden sein.

**Rollen.** MPC- und Admin-Benutzer steuern die Erzeugung der Datei i155 im Bereich „Batch Job“. Market Operations prüft die Ergebnisse der Schnittstellen im Rahmen der MO Checks.

**Dateischnittstelle i155 an VEGA.** Für den deutschen Markt überträgt die Schnittstelle i155 Servicevertragsdaten und die zugehörigen Deckungen zwischen oneSCM und VEGA. Die Übertragung erfolgt mandantenübergreifend, wobei die Daten nach Codepages getrennt werden. Jede Änderung am Fahrzeugvertrag oder an den Deckungen löst eine Übertragung aller Vertragsinformationen und Deckungen aus.

Die Datei ist positionsbasiert aufgebaut. Die Satzarten RC01, RC05 und RC20 sind Pflichtfelder. Die Satzart RC80 mit den optionalen Angaben wird ebenfalls erzeugt. Die Satzart RC10 mit Vertrags-, Fahrzeug- und Kundeninformationen wird nur befüllt, wenn dafür Text vorhanden ist. Die Satzarten RC15 bis RC18 sind für Sonderfälle vorgesehen und nicht erforderlich. Der Kraftstofftyp in den Positionen 151 bis 152 stammt aus den Fahrzeugdaten, die bei der Vertragskalkulation aus VeDoc abgerufen werden. Die erzeugte Datei wird in Amazon S3 unter dem Pfad für ausgehende Dateien der Schnittstelle i155 für Deutschland abgelegt.

**Steuerung der Erzeugung.** Im Bereich „Batch Job“ stellen Sie den Zeitplan der Erzeugung der i155 ein. Die Ergebnistabelle zeigt den Jobnamen „Vega i155“, den Jobstatus, die Markt-ID, den Zeitpunkt des letzten Laufs und den Zeitpunkt des nächsten Laufs. Die Zeitangaben stehen im Format TT.MM.JJJJ HH:MM:SS UTC.

1. Öffnen Sie den Bereich „Batch Job“ und suchen Sie den Job „Vega i155“ nach Namen oder Markt.
2. Wählen Sie „Run Now“, um den Job sofort zu starten. Die Ausführung erfordert eine doppelte Bestätigung und ist unabhängig von Jobstatus und Zeitplan.
3. Wählen Sie „Schedule“, um Cron-Ausdrücke anzulegen, zu löschen oder zu speichern. Über „Add Cron Extension“ legen Sie einen neuen Ausdruck an. „Save“ speichert den Ausdruck, „Cancel“ schließt das Fenster ohne Speichern.
4. Aktivieren und deaktivieren Sie den Job über die Aktion „Disable“ beziehungsweise die Aktivierung. Jede Änderung erfordert eine Zwei-Faktor-Bestätigung. Ein Job muss aktiviert sein, damit Sie ihn deaktivieren können. Neu angelegte Jobs sind standardmäßig deaktiviert.
5. Wählen Sie „View“, um die erzeugten i155-Dateien zu sehen. Sie suchen nach dem Dateinamen oder nach einem Zeitraum wie letzte 24 Stunden, letzte Woche, letzter Monat, aktuelles Jahr oder einem frei gewählten Zeitraum.
6. Laden Sie über „Download“ die Datei herunter. Zu jeder i155 gibt es zwei weitere Dateien: die Logdatei der Erzeugung und das Vega-Transferprotokoll. Das Transferprotokoll steht erst zur Verfügung, nachdem VEGA die i155 erfolgreich empfangen und verarbeitet hat.

**Coverage-IDs.** Jede Deckung erhält eine eindeutige, numerische Coverage-ID mit 32 Stellen. Die IDs stehen in der Satzart RC20 an den Positionen 66 bis 97 und sind rechtsbündig angegeben. Die Vergabe beginnt mit dem Wert 1 und erhöht sich für jede neu hinzukommende ID um 1. Die ID gilt vertragsübergreifend. Erhalten die ersten drei Deckungen eines Vertrags die IDs 1, 2 und 3, so erhalten die Deckungen eines zweiten Vertrags, der anschließend erstmals erzeugt wird, die IDs 4 bis 6. Ändern sich später der Status oder andere Attribute eines Vertrags, enthält die i155 nur die Änderungen. Die ursprünglich vergebenen Coverage-IDs bleiben unverändert. Die IDs werden zusammen mit den Produkten übermittelt und im Vertrag gespeichert.

**Vertragstyp und Ablaufkriterium.** Der VEGA-Vertragstyp wird zusammen mit den Produktdaten übermittelt, im Vertrag gespeichert und in der i155 an den Positionen 80 bis 90 ausgegeben. Die Vertragstypen 1P_FSV, 1P_MTN und 1P_TRS ersetzen die Typen 1P_CPLC, 1P_SC und 1P_TC auf Blueprint-Ebene. Dies gilt für alle bestehenden Verträge in allen Status der Produktivumgebung. Die Übertragung an VEGA erfolgt über den bestehenden CFT-Ablauf. Die Angaben zum Vertragstyp des Produkts CompleteCare sind im Klärungsbedarf erfasst.

Der Wert in der Satzart RC05 an Position 260, das sogenannte Return Flag, richtet sich nach dem Ablaufkriterium des Produkts. Hat das Produkt das Ablaufkriterium TIME, steht bei jeder Aufnahme des Vertrags in eine i155 der Wert 1. Hat das Produkt das Ablaufkriterium Time & Mileage, Mileage oder Contingent, steht dort der Wert *. Die Regel gilt über den gesamten Lebenszyklus des Vertrags, also nach Generierung, Aktivierung, Suspendierung, Reaktivierung, vorzeitiger Beendigung und Verlängerung.

**Branchenschlüssel.** Bei einem Vertragsangebot für einen Gewerbekunden wählen Sie die Branche aus einer Auswahlliste, die im Feld Industry Type geführt wird. Die Auswahl gilt auf Vertragsebene und erscheint in der Oberfläche und in den Dokumenten an der Stelle des Platzhalters „Industry“. Bei der Aktivierung und Erzeugung der i155 übernimmt das System den Code der Branche in die Satzart RC05 an den Positionen 266 bis 269, linksbündig und mit einem nachfolgenden Leerzeichen. Die Liste umfasst die Codes 001 bis 049 sowie den Code 099 für „FleetSite - vehicle“. Ist als Branche „Not Relevant“ gewählt, steht an dieser Stelle der Wert ****.

**Ausschluss von Deckungen.** Eine Deckung mit dem Kennzeichen „Not Needed for VEGA“ wird nicht in die i155 aufgenommen. Bei der Vertragsaktivierung erhält Revenue dennoch alle Deckungen, unabhängig von diesem Kennzeichen. Die i155 enthält also ausschließlich die für VEGA relevanten Deckungen, während Revenue den vollständigen Deckungsumfang erhält.

**Kostenverantwortung für Deckungen.** Für jede Deckung legen Sie in der Produktkonfiguration auf der Seite „Coverages“ fest, wer die Kosten trägt. Zur Auswahl stehen „Mercedes-Benz“, das standardmäßig vorausgewählt ist, „Customer“ und „Supplier“. Bei „Supplier“ ist ein Lieferant als Pflichtfeld anzugeben. Mit der Option „Exclude from Vega“ nehmen Sie eine Deckung von der i155 aus. Ist die Anbindung an die Lieferantendatenbank SDB4 eingerichtet, übernimmt das System die Lieferantendaten aus Stream 4 des Lieferantenmanagements. Ist die Anbindung nicht eingerichtet, geben Sie Name und Kreditorennummer des Lieferanten manuell ein. Kostenstelle, Lieferantendaten und das Kennzeichen werden im Payload für Stream 2 bereitgestellt. Die Konfiguration der Deckungen selbst beschreibt Kapitel 14.

**Statusänderungen über die Schnittstelle.** Konsumierende Systeme können den Status eines Servicevertrags über eine Schnittstelle aktualisieren. Folgende Wechsel sind zulässig: von „created“ zu „confirmed“, von „created“ zu „declined“, von „confirmed“ zu „active“, von „active“ zu „suspended“ und von „suspended“ zu „active“. Statuswechsel, die im Vertragsstatusmodell nicht definiert sind, lehnt das System ab, und das aufrufende System erhält eine Fehlermeldung. Jede Statusänderung wird in der Vertragshistorie dokumentiert. Für VEGA relevant sind der Wechsel zu „active“ und der Wechsel zu „suspended“. Diese Änderungen überträgt die i155. Die Status „Waiting for Activation“ und „Active“ setzt ausschließlich das Backend. API-Benutzer können diese beiden Status nicht beeinflussen.

**Verlängerung über MBLD und den Edge Service.** MBLD steuert Langzeitverlängerungen über eine Schnittstelle ohne Benutzeroberfläche. Der Ablauf umfasst folgende Schritte:

1. MBLD fragt über den Edge Service den Kontostand zu einer Vertragsnummer ab und prüft, ob Vertragsanpassungen zulässig sind. Der Vertrag muss im Vertriebskanal „Leasing“ den Status „Aktiv“ haben.
2. MBLD fragt beim Product-Microservice ein Preisangebot für Laufleistung und Laufzeit an. Die Anfrage enthält einen Offset und optional ein Wirksamkeitsdatum. Die Antwort enthält den Gesamtpreis, den Intervallpreis und den Preis je Mehr- oder Minderkilometer.
3. Ist die Konfiguration nicht passend, sendet MBLD eine neue Anfrage mit angepassten Parametern. Ist sie passend, sendet MBLD die Anwendung der Langzeitverlängerung. Der Contract-Microservice legt die Konfiguration an und bestätigt sie mit den aktualisierten Preisangaben.
4. Lehnt der Endkunde das Angebot ab, verwirft der Contract-Microservice die Konfiguration. Stimmt der Endkunde zu, übernimmt der Contract-Microservice die neue Konfiguration auf Vertragsebene, erzeugt die i155 und benachrichtigt VEGA, den Revenue-Microservice und NEMESIS.

Den Offset und das Wirksamkeitsdatum der Leasing-Langzeitverlängerung beschreibt Abschnitt 19.22.

**Kurzfristige Verlängerung.** Der Edge Service stellt die kurzfristige Verlängerung per API bereit. MBLD übergibt die Servicevertragsnummer und die Anzahl der Verlängerungsmonate. Der Contract-Microservice prüft, ob der Vertrag den Status „Aktiv“ hat, das Produkt für die kurzfristige Verlängerung konfiguriert ist und die Einstellungen für Division und Markt sowie die Preis- und Berechtigungsregeln erfüllt sind. Die Summe aller kurzfristigen Verlängerungen darf sechs Monate nicht überschreiten. Die maximal zulässige Laufzeit darf ebenfalls nicht überschritten werden. Lehnt das System die Anfrage ab, nennt die Antwort die Gründe, etwa einen ungültigen Vertragsstatus, eine überschrittene Verlängerungsdauer oder eine nicht unterstützende Produktkonfiguration. Bei einer zulässigen Verlängerung aktualisiert das System den Zahlungsplan und die Vertragswerte für Laufzeit, Enddatum, Laufleistung und Preis. Revenue und NEMESIS erhalten die Daten. Die Antwort an MBLD enthält das neue Vertragsende, die neue Laufzeit, die Gesamtlaufleistung, die monatliche Rate und den Gesamtpreis. Eine E-Mail-Benachrichtigung entfällt.

**Verlängerung nach Signatur.** Nach dem Versand zur Signatur zeigt die Vertragsdetailansicht den Banner „In Progress“. Sobald das Dokument signiert und die Signatur durch DSS validiert ist, werden die Verlängerungsdetails auf den Servicevertrag übertragen und die Vertragsdaten aktualisiert. Anschließend erzeugt das System eine i155, und die Services Revenue und NEMESIS werden benachrichtigt.

**Kontingentprodukte.** Das System rechnet die Leistungen eines Kontingentvertrags über die Erlösverwaltung nach. Der Ablauf verläuft in folgenden Schritten:

1. Die Kostenverwaltung importiert die Schnittstelle i156 und prüft, ob ein Schaden oder eine Forderung als Kontingent zählt.
2. Wird eine Forderung als kontingentfähig erkannt, erhält das Vertragsmanagement eine Benachrichtigung. Es zieht die von der Erlösverwaltung übermittelten Werte von der Anzahl der Kontingentleistungen im Vertrag ab und zeigt die verbleibenden Leistungen an.
3. Die i155 enthält in der Satzart RC20 die ursprüngliche Anzahl der Leistungen an den Positionen 165 bis 169, die Anzahl der genutzten Leistungen an den Positionen 170 bis 174 und an Position 175 den Wert 1.
4. Sind alle Leistungen erbracht, endet der Vertrag automatisch mit dem Status „Abgelaufen“ und dem VEGA-Code 003 und dem Grund „Kontingent“. Anschließend erzeugt das System eine i155.
5. Ohne offene Abgleichsprüfung und ohne Schlussrechnung setzt das System den Vertrag auf „Geschlossen“ mit dem VEGA-Code 004 und übermittelt eine i155 mit dem neuen Status.

Eine fehlende Zählung oder eine fehlende Übermittlung an VEGA kann finanzielle Folgen haben.

**Import der i156 und Händlerdaten.** Die Datei i156 enthält Schadenfälle und Entscheidungen von VEGA. Folgende Regeln gelten:

- Zu einem Schadenfall und Schadencode gilt jeweils die Entscheidung mit der höchsten Entscheidungsnummer. Ist die neue Entscheidungsnummer gleich oder höher als die gespeicherte, überschreibt die neue Entscheidung die Daten. Dies gilt auch, wenn die Nummern nicht lückenlos aufeinanderfolgen. Ist die neue Entscheidungsnummer niedriger, importiert das System den Schadenfall nicht und zeigt eine Fehlermeldung an.
- Der Import großer Dateien mit rund 85.000 Zeilen nutzt eine Sammelabfrage. Die Schnittstelle übergibt eine Liste von Vertragsnummern und liefert die Daten aller gefundenen Verträge gesammelt zurück.
- Die Vega Dealer ID wird zu Vertrag und Fahrgestellnummer in der Detailansicht angezeigt. Quelle ist die Satzart RC01 der Datei i156 an den Positionen 17 bis 21. Beim nächsten Import werden vorhandene Daten aktualisiert, beim ersten Import neue Daten ergänzt.
- In der Händlerverwaltung muss die SAP-Debitorennummer genau 10 Ziffern enthalten, die Vega-ID genau 5 Ziffern. Beide Felder müssen eindeutig sein.

**Händlerwechsel.** Wechselt ein Autohaus den Eigentümer, passt oneSCM die zugehörigen Serviceverträge an. Ein zeitgesteuerter Batch-Job prüft regelmäßig, ob sich Eigentumsverhältnisse geändert haben. Wird eine Änderung erkannt, sendet der Customer-Microservice ein Ereignis mit Händlername, Händleradresse, alter und neuer GS-Outlet-ID, SAP-Debitorennummer und Kreditorennummer an den Contract-Microservice. Der Contract-Microservice ermittelt alle Serviceverträge der alten GS-Outlet-ID, sowohl im Angebot als auch in der Verwaltung, und überschreibt Vertragshändler, Händlername und Händleradresse. Die Felder des Verkäufers bleiben unverändert. Erfolgt die Aktualisierung während der Widerrufsfrist, erhält zusätzlich der Revenue-Microservice ein Benachrichtigungsereignis. Im Szenario der übrigen Märkte bleibt die GSSN-Outlet-ID gleich, die GC-Company-ID ändert sich. SAP-Debitorennummer und Kreditorennummer werden entfernt, und Market Operations trägt die SAP-Debitorennummer erneut ein. Alte und neue Werte erscheinen in der einklappbaren Historientabelle.

**Produktinformationen im Vertrag.** Bei der Erzeugung eines Vertrags aus einem Vertragsvorschlag übernimmt oneSCM alle erforderlichen Informationen aus dem Produkt in den Vertrag. Der Vertrag bleibt dadurch auch dann verarbeitbar, wenn das Produkt im Product-Microservice später geändert oder gelöscht wird, etwa beim Ablauf oder bei einer Kündigung. Bei der Vertragsprüfung muss das zugewiesene Profil mit dem Produkt des Vertrags verknüpft sein.

**Vertragserstellung als gemeinsame Verarbeitungskette.** Das Material beschreibt die Erstellung von Verträgen über Standardfunktionen, Massenerstellung und Leasing als eine gemeinsame Verarbeitungskette. Sie prüft zuerst die Eingaben, lädt danach externe Daten und baut einen unveränderlichen Vertragsentwurf auf. Anschließend speichert sie den Vertrag einmal, erzeugt die Dokumente und veröffentlicht zuletzt die Ereignisse. Die sechs Erstellungsvarianten sind Fahrgestellnummer, Build to Stock, Build to Order, Deal-ID, Modellcode und MBLD. Die Massenerstellung setzt nach einem Fehler dort fort, wo sie unterbrochen wurde. Anfrage- und Antwortformate der externen Schnittstelle bleiben unverändert. Die Einordnung dieser Beschreibung als heutiges Verhalten ist im Klärungsbedarf erfasst.

**Ergebnis und Systemstatus.** Nach einer erfolgreichen Verarbeitung enthält der Vertrag die Coverage-IDs, den Vertragstyp und das Return Flag. Die i155 steht im Bereich „Batch Job“ zum Download bereit, sobald der Job gelaufen ist. VEGA bestätigt die Verarbeitung im Transferprotokoll.

**Besonderheiten je Sparte und Markt.** Die Schnittstelle i155 ist für den deutschen Markt beschrieben. Eine i155-Datei existiert zusätzlich für andere Märkte. Die Branchencodes gelten für Verträge mit Gewerbekunden. Die Ordnerstruktur für VEGA je Markt beschreibt Abschnitt 19.21.

**Hinweise.** Fällt die Datei i155 aus, erhält VEGA die zuletzt vorgenommenen Vertragsänderungen nicht. Dies kann die Abrechnung und die Geltendmachung von Ansprüchen aus den Verträgen beeinflussen. Die Historie der VEGA-Daten im Vertrag beschreibt Kapitel 10.8. Die Anzeige der Vertragshistorie im Bereich „History“ enthält für jede Änderung das geänderte Objekt, das Attribut, den alten und neuen Wert, die Art der Änderung, das Datum und den Bearbeiter. Die Datenquelle ist oneSCM.

**Fehlerbehebung.** Ist die Datei i155 nicht verfügbar, prüfen Sie zuerst den Status des Jobs „Vega i155“ und das Transferprotokoll. Ein fehlgeschlagener Lauf lässt sich über „Run Now“ erneut starten. Erscheinen bei einer Verlängerung Fehlermeldungen, enthält die Antwort den Grund der Ablehnung.

Quellen: Batch 779.1, 530.1, 783.7, 841.1, 843.5, 851.1, 842.1, 862.1, 934.1, 947.1, 927.1, 1161.1, 1040.3, 1026.2, 778.3, 966.1, 744.5, 692.2, 730.4, 742.4, 626.3, 913.1, 594.3, 856.5, 1217.3, 1274.4, 1255.4, 1246.7, 865.1

## 19.10 BS4 beziehungsweise SDB4

**Material:** keine Quellen in den RAG-Batches.

Zu dieser Schnittstelle liegen keine Abschnitte vor. Die Lieferantendaten aus SDB4 für Kostenverantwortung beschreibt Abschnitt 19.9.

Quellen: keine Quellen in den RAG-Batches

## 19.11 oneERP – Kunden- und Finanzintegration

**Zweck.** oneERP ist das Finanzsystem für den deutschen Markt. oneSCM legt Kunden in oneERP an, aktualisiert sie, übergibt Rechnungen und empfängt Rückmeldungen zu Rechnungsstatus, Mahnungen und Zahlungen. Dieser Abschnitt beschreibt die Kundenintegration, die Prüfungen vor der Aktivierung und die Rückmeldewege. Den Export der Rechnungsdaten an das Finanzsystem beschreibt Abschnitt 19.22.

**Voraussetzungen.** Der Markt ist mit dem Finanzsystem oneERP konfiguriert. Die Konfiguration des Finanzsystems ist in den Markteinstellungen hinterlegt. Für die Anlage von Kunden benötigen Sie gepflegte Produkte, ausgefüllte Markteinstellungen sowie vorhandene Vorlagen für E-Mails und Dokumente. Die Materialnummern für die Rechnungserstellung pflegen HQ-Administratoren.

**Rollen.** Die Pflege der Materialnummern steht ausschließlich HQ-Administratoren zu, die über eine eigene Rolle verfügen. Market Operations prüft Kundenstatus, CAS-Ergebnisse und Banküberweisungen. Das Finanzsystem wählt der Administrator in den Markteinstellungen aus.

**Finanzsystem je Markt.** Die Markteinstellungen zeigen das Finanzsystem des Marktes an. Bei der ersten Konfiguration eines Marktes wählen Sie genau eines der Finanzsysteme oneERP, SWT oder CoFiCo. Die Auswahl wird gespeichert und in der Oberfläche nicht bearbeitet. Den Ort finden Sie unter Markteinstellungen, Market config, External System setting und FI Configuration, getrennt für beide Divisionen. Die Felder der Konfiguration hängen vom gewählten Finanzsystem ab. Die Felder für PC und VAN erscheinen nur bei CoFiCo und SWT.

**Anlage eines Kunden in oneERP.** Ist der Vertrag im Status „Confirmed“ und der Kunde im Status „In Confirmation“, prüft oneSCM zuerst, ob bereits eine SAP-Debitorennummer vorliegt. Danach prüft oneSCM, ob oneERP die Debitorennummer kennt. Ist der Kunde nicht bekannt, sendet oneSCM eine XML-Datei an oneERP. Für die BusinessPartnerAPI ist stets der Wert „CMD“ im Feld MPI-BusinessProcessVariantCode zu setzen.

Die Schnittstelle arbeitet asynchron. Auf den Post-Aufruf erhält oneSCM keine Debitorennummer, sondern nur die Rückmeldung, dass der Kunde zu einem Datum angelegt wurde. Die Debitorennummer ruft oneSCM über einen weiteren Aufruf der BP-API ab, gefiltert nach dem Datum der Rückmeldung. Die Information liegt nach etwa 24 Stunden vor. Ein Batch-Job holt die jeweils neuesten Änderungen aus oneERP. Schlägt eine Anlage oder Aktualisierung fehl, wiederholt das System den Vorgang automatisch.

**Kundenanlage und Aktualisierung über die Kundenverwaltung.** Die Kundenverwaltung stellt eigene Funktionen für die Anlage und Aktualisierung von Kunden in oneERP bereit. Bei Änderungen an aktiven Kunden sendet oneSCM eine Aktualisierung an das Finanzsystem. Ändert sich der Name eines Kunden, erhält der Vertrag dazu ein Ereignis. Daten zu gewerblichen Kunden übermittelt das System an NEMESIS. Nach der Neuanlage eines Kunden erfolgt eine CAS-Prüfung, und zwar ausschließlich in diesem Fall.

Bei der Anlage gewerblicher Kunden erfassen Sie Kunden- und Zahlungsinformationen in zwei getrennten Schritten:

1. Auf der Kundeninformationsseite erfassen Sie Kundeninformationen, Zahlungsreferenz, Adressdaten, Steuer- und Rechtsangaben mit USt-IdNr., Steuernummer, Steuerklassifizierung und Rechtsform, Kontaktpersonen, Präferenzen und Händlerdaten. Mit „Weiter“ legt oneSCM den Kunden an und vergibt eine Nummer. Der Wert im Feld „Account Note“ wird dabei geprüft, damit im nächsten Schritt die passenden Zahlungsarten erscheinen.
2. Auf der Seite für Zahlungsinformationen wählen Sie die Zahlungsart Lastschrift mit Bankdaten. Die Forderungsdaten aus dem Finanzsystem zeigen die SAP-Debitorennummer, den Status im Finanzsystem und die Account Note. Die Zahlungsinformationen speichert oneSCM als eigenes Objekt.

Die Länge der Namensfelder ist begrenzt. Der Firmenname umfasst höchstens 70 Zeichen, Vorname und Nachname jeweils höchstens 35 Zeichen. Die Regel gilt bei der Kundenanlage und bei Aktualisierungen.

**Status des Kunden beim Abgleich.** Bei einem neuen Kunden lautet der Status „Waiting for Confirmation“. In diesem Status sind Änderungen erlaubt. Während des Abgleichs mit dem Finanzsystem lautet der Status „In Confirmation“, und Änderungen sind gesperrt. Liegen die SAP-Daten vor, wechselt der Status auf „Active“, und Änderungen sind wieder erlaubt.

**Prüfung über CAS.** Neue Kunden prüft oneSCM vor der Aktivierung eines Vertrags automatisch im Sanktionslistensystem CAS. Die Prüfung gilt für alle neuen Kunden, unabhängig von ihrer Vertragsrolle, und schließt vor der Synchronisation mit oneERP ab. Die regelmäßigen Portfolioprüfungen übernimmt ein zentrales System. Eine lokale manuelle Portfolioprüfung ist nicht erforderlich, soweit dieses System die Prüfung abdeckt.

Für natürliche Personen übermittelt oneSCM Vor- und Nachname sowie die Adresse mit Straße, Ort, Postleitzahl und Land. Für juristische Personen übermittelt oneSCM Firmenname, Rechtsform und Adresse. Das Geburtsdatum erfasst oneSCM nicht und speichert es nicht. Es wird nur im Clearing-Prozess benötigt, wenn ein Treffer anhand anderer Merkmale nicht eindeutig zu entscheiden ist. In diesem Sonderfall übermittelt der MO-Benutzer das Geburtsdatum direkt an CAS außerhalb von oneSCM.

Die Prüfung läuft über eine Webservice-Schnittstelle. Der IndividualCheck übermittelt die Daten. Ein hitType „IN_PROGRESS“ mit addressHits gleich 0 bedeutet, dass kein Treffer vorliegt und eine Geschäftsbeziehung möglich ist. Ist addressHits größer als 0, liegt ein potenzieller Treffer vor, und der Datensatz geht an die zuständige Clearing-Gruppe. Diese Gruppe legen Sie bereits bei der Prüfung fest.

Bei einem potenziellen Treffer fragt oneSCM den Status mit dem StatusCheck über die Prüfauftrags-ID ab. Die Abfrage wiederholt sich alle 10 Minuten, dieser Wert ist empfohlen und änderbar. Die Werte des resultType bedeuten: 0 und 2 stehen für einen Treffer im Clearing, die Abfrage läuft weiter. 1 bedeutet, dass der Clearer den Kunden abgelehnt hat und keine Geschäftsbeziehung zulässig ist. 3 bedeutet, dass der Kunde unbedenklich ist. 4 erscheint bei potenziellen Treffern nicht, da es für Kunden ohne Listentreffer gilt. Die Schleife endet bei 1, 3 oder 4.

In der Oberfläche prüft Market Operations die Ergebnisse unter Admin Section, MO Checks Verification und Customer Checks. Der CAS Check nimmt die Werte OK oder NOT OK an. Zwischen der CAS-Prüfung und der endgültigen Antwort erscheint der Wert „False positive“. Solange ein Vertrag im Status „Waiting for Activation“ verbleibt, prüft Market Operations die Gründe dafür.

**Umsatzsteuer-Identifikationsnummer.** Die USt-IdNr. prüft oneSCM über einen Endpunkt, der den VIES-Dienst der Europäischen Kommission aufruft. Erfasst oneSCM eine USt-IdNr. oder eine Steuernummer, synchronisiert oneSCM diese Angaben bei Anlage oder Aktualisierung eines gewerblichen Kunden mit oneERP. Bei einer Steuernummer übermittelt das System den Steuertyp „taxNumber“, bei einer USt-IdNr. den Steuertyp „vat ID“. Die USt-IdNr. ist nicht mehr auf einen Kunden begrenzt, sodass dieselbe Nummer für verschiedene Kunden gilt. Der Abgleich mit oneERP erfolgt unscharf über mehrere Kriterien.

**Steuerklassifizierung bei der Kundenanlage.** Die Schnittstelle für das Auswahlfeld der Steuerklassifizierung liefert alle Steuerarten mit dem gültigen Steuersatz aus der Steuerverwaltung. Berücksichtigt werden nur Sätze mit gültigem Datum, der Finanzdokumentdefinition „Invoice“, der Steuerart „VAT“ und der Steuerkategorie „Client“. Die Einträge erscheinen im Format „Name der Steuerart - Steuersatz“, etwa „Standard - 19%“ oder „Exempt - 0%“.

**Zahlungsart Banküberweisung.** In Märkten mit oneERP prüft oneSCM die Account Note für jeden Vertrag mit Banküberweisung, unabhängig vom Kundentyp. Einschränkungen erfolgen über die Produktkonfiguration. In Märkten mit CoFiCo existiert keine Account Note. Dort entfällt die Prüfung, und die MO-Prüfung der Banküberweisung ergibt NOT_APPLICABLE. Die Banküberweisung ist dann gewährt, sofern die Konfigurationskette sie erlaubt. Kundenaktualisierungen über Kafka-Ereignisse führen in CoFiCo-Märkten nicht zu einer Sperre. In CoFiCo-Märkten blendet die Oberfläche das Feld Account Note aus.

**IBAN-Validierung über SwiftRef.** Beim Erfassen einer neuen IBAN prüft oneSCM das Format nach den bestehenden Regeln und sendet die IBAN danach an die SwiftRef-API. Ist die IBAN gültig, übernimmt oneSCM Bankname und BIC automatisch und zeigt sie ausgegraut an. Dasselbe gilt für die Währung. Sind im Markt mehrere Währungen hinterlegt, wählen Sie die Währung aus einem Dropdown. Ist die IBAN ungültig, erscheint die Meldung „IBAN IS INVALID“, und die Schaltfläche „Confirm“ steht nicht zur Verfügung. Die Prüfung gilt im Generierungsprozess und in der Kundenverwaltung, nicht im Self Service, und nur für IBANs, die beim Kunden noch nicht vorhanden sind.

**Mercedes me Profil.** oneSCM bindet Mercedes me über drei Schnittstellen an: getProfileFields ermittelt die Pflichtfelder je Land, Sprachraum und Kundentyp, createUserV2 legt ein Profil an, und updateUserV2 aktualisiert Adressen über den User Profile Service. Für Deutschland gelten im MVP die Werte DE, de-DE und B2C, und der Use Case lautet MMCR_NEW_USER.

Ein Profil legen Sie nur für Kunden mit der Vertragsrolle „Holder“ an. Eine Mercedes me ID darf nicht zwei Kunden zugeordnet sein. Den Schalter „I have obtained the customer's consent to create an account for them“ aktivieren Sie nur nach Zustimmung des Kunden. Pflichtfelder sind E-Mail-Adresse oder Telefonnummer, Vorname, Nachname, Land und die Zustimmung zu den Nutzungsbedingungen. Bankdaten sind weder Pflicht noch relevant.

Adressänderungen sendet oneSCM nur innerhalb eines Landes und nur mit Zustimmung des Kunden. Das Land wird als Zeichenfolge aus zwei Großbuchstaben übermittelt, optional mit einem weiteren Bestandteil, etwa „DE“. Änderungen von Vor- und Nachnamen sind über diese Schnittstelle nicht möglich. Die Nutzungsschritte für Kunden beschreibt Kapitel 4.5.

**Behördenkunden.** oneSCM verwaltet private Behördenkunden und gewerbliche Behördenkunden. Beide Typen stehen im Vertragsvorschlag in der Auswahlliste „Kundentyp“ zur Verfügung. Für gewerbliche Behördenkunden ist das Pflichtfeld „Zugehörigkeit“ mit den Optionen „Öffentliche Institutionen“, „Botschaft“, „Militär“ und „NATO“ anzugeben. Der Wert geht an oneERP und wird in das Feld IdentificationCategory synchronisiert, das oneERP als Z_IDEN führt. Gewerbliche Behördenkunden wählen zwischen Lastschrift und Überweisung. Bei gewerblichen Kunden aus dem öffentlichen Sektor sendet oneSCM die Anfrage wie bei einem normalen gewerblichen Kunden, ohne den Wert „publicAuthorities“. Diese Regel gilt auch für Privatkunden.

**Kunden in Indien und der Slowakei.** Meldet sich ein Benutzer aus Indien an, aktiviert oneSCM den indienspezifischen Ablauf mit SWT als Finanzsystem. Der Benutzer erhält die landesspezifischen Eingabefelder. Für die Adressableitung nutzt oneSCM die Google-API. Die Felder Region, Permanent Account Number mit zehn alphanumerischen Zeichen für Privat- und Geschäftskunden, optionale GST-Nummer mit 15 Zeichen für Geschäftskunden und die Option „SEZ mit Steuer“ gehören zum indischen Ablauf. Die Übermittlung an SWT erfolgt im JSON-Dokument mit den Feldern taxNumber 3, 4 und 5. Bei Anmeldung eines Benutzers aus der Slowakei aktiviert oneSCM den slowakischen Ablauf mit CoFiCo als Finanzsystem. Die Region ist als Zeichenfolge mit bis zu 35 Stellen erfasst, die Personal ID mit 15 alphanumerischen Stellen. Die Sichtbarkeit der Personal ID richtet sich nach den Markteinstellungen.

**Materialnummern.** Für jede Produktlinie benötigt oneERP eigene Materialnummern. Fehlen sie, laufen alle Datensätze an oneERP in einen Fehler. HQ-Administratoren pflegen die Materialnummern über eine eigene Rolle, wenn eine Produktlinie angelegt wird oder oneERP Materialnummern ändert.

**Manueller Upload von Rückmeldungen.** HQ-Administratoren und Benutzer mit Zugriff auf den Bereich Admin, Cross File Transfer, File Upload wählen die Schnittstelle „oneERP Invoice Feedback“ oder „oneERP BP36“ aus. Für Invoice Feedback laden Sie eine Datei im Format .txt hoch. oneSCM verarbeitet sie nach der bestehenden Logik und aktualisiert die Rechnungsstatus. Für BP36 laden Sie eine Datei im Format .json hoch, die mehrere BP36-Updates für Zahlungs- und Mahnangaben enthalten kann. Beim Upload prüft das System, ob die Schnittstellenauswahl und die Datei zusammenpassen. Die Ergebnisse erscheinen im Bereich „Ergebnisse“. Jeder Upload ist mit Benutzer, Zeitpunkt und Ergebnis nachvollziehbar.

**Vertragsnummer im Header von E169.** Im automatisierten Rechnungsprozess für MBLD-Verträge trägt oneSCM die Vertragsnummer auf Headerebene in die Datei E169 ein. Die Nummer steht am Ende des HEADER-Satzes hinter der neuen UUID. Die Struktur ist mit oneERP abgestimmt.

**Umstellung von NACOS auf oneERP.** Die NACOS-Batch-Jobs SAPInvE167EXP, SAPInvE169EXP und SAPInvE174EXP entfallen, weil NACOS außer Betrieb ist und oneERP das Finanzsystem für Deutschland ist. Administratoren finden die Jobs im Bereich Batch Jobs nicht mehr. Die Exporte für oneERP laufen unverändert.

**Mercedes-me-Profile bei Kundenanlage.** Die Abläufe zur Auswahl eines gefundenen Kunden, zur Neuanlage und zur Aktualisierung eines Mercedes me Profils beschreibt Kapitel 4.5. Voraussetzung für Profilaktualisierungen ist die Vertragsrolle „Holder“ oder „Holder & Payer“.

**Markt Südkorea.** Das Material beschreibt für den Markt MBKR Regeln für die Kundenart, die Business Registration Number mit 10 Ziffern, die romanisierten Namen und die Zahlungsart. Den Stand der Einführung erfasst der Klärungsbedarf.

**Ergebnis und Systemstatus.** Der Kunde ist in oneSCM mit der SAP-Debitorennummer verknüpft, sobald oneERP sie zurückmeldet. Nach dem Abgleich wechselt der Kunde in den Status „Active“, und Änderungen sind wieder erlaubt. oneSCM setzt den Rechnungsstatus nicht aus dem MPay-Status. Er folgt ausschließlich der Rückmeldung des Finanzsystems über die E169-Feedback-Datei und die Schnittstelle BP36.

**Hinweise.** Fehler aus Kundenereignissen speichert die Domäne in einer Tabelle, die in allen Domänen gleich aufgebaut ist. Die Fehler zeigt eine Schnittstelle im Frontend mit Paginierung, Sortierung und Filterung an. Über eine weitere Schnittstelle sendet das System ein Nemesis-Ereignis zu einer Vertragsnummer erneut.

**Fehlerbehebung.** Schlägt eine Anlage in oneERP fehl, versucht das System den Vorgang automatisch erneut. Prüfen Sie bei wiederholten Fehlern die Materialnummern. Fehlende Materialnummern führen dazu, dass alle Datensätze an oneERP fehlschlagen. Bei einer Störung der automatischen Rückmeldung können HQ-Administratoren die Rückmeldung über den manuellen Upload einspielen.

Quellen: Batch 650.2, 1210.1, 179.2, 586.1, 620.1, 664.1, 615.4, 618.7, 633.1, 883.7, 585.5, 761.1, 210.1, 607.1, 607.3, 559.2, 583.2, 231.1, 591.2, 557.1, 151.3, 147.1, 199.2, 644.2, 673.2, 673.3, 675.2, 681.2, 1210.1, 777.4

## 19.12 CoFiCo – FI-Anbindung

**Zweck.** CoFiCo ist das Finanzsystem für die Slowakei und weitere europäische Märkte. oneSCM überträgt Kunden, Rechnungen und Werkstattbelege an CoFiCo und empfängt Rückmeldungen. Dieser Abschnitt beschreibt die Kundenanbindung, die Exportdateien, die Validierung der Rechnungsdatei, die Plausibilitätsprüfungen und die Konfiguration des Finanzsystems.

**Voraussetzungen.** Der Markt ist mit dem Finanzsystem CoFiCo konfiguriert. Die Werte der FI-Konfiguration sind gepflegt. Die Finanzsystem-Konfiguration für SWT- und CoFiCo-Märkte pflegen HQ-Administratoren über die Seite „FI-Configuration Feature“.

**Rollen.** HQ-Administratoren pflegen die FI-Konfiguration. Mitarbeitende aus Market Operations und MPC prüfen die Plausibilitätsprüfungen. Mitarbeitende im Revenue- und Cost-Management validieren Belege für den Export E167.

**Kundenanbindung.** Für den Markt Slowakei legt die Kundenverwaltung Privatkunden und Geschäftskunden im Sinne von B2C und B2B an und synchronisiert sie mit CoFiCo. Aus CoFiCo ruft oneSCM die SAP-Debitorennummer, den Kundenstatus und weitere Kundendetails ab. Die SAP-Debitorennummer darf alphanumerisch sein. Die Struktur für Anlage und Aktualisierung entspricht der Struktur der SWT-Anbindung. Die Suche in CoFiCo erfolgt nach abgestimmten Kriterien, etwa der USt-IdNr.

Der Kundenstatus zeigt den Stand der Synchronisation. Zu Beginn lautet er „Temporary“, und Änderungen sind erlaubt. Während der Synchronisation steht er auf „In Confirmation“, und Bearbeitungen sind gesperrt. Liegen die SAP-Daten vor und ist mindestens ein Servicevertrag des Kunden aktiv, wechselt der Status auf „Active“. Änderungen an einem aktiven Kunden lösen eine Aktualisierung an CoFiCo aus, bei der auch die oneSCM-ID übermittelt wird.

Für einen neuen Kunden sendet oneSCM eine POST-Anfrage mit der CMD-Struktur an CoFiCo. Für bestehende Kunden mit Änderungen verwendet oneSCM dieselbe Struktur. Die Antwort kommt in derselben Struktur über die Outbound-Schnittstelle von CoFiCo zurück, die bei jeder Anlage oder Änderung im Finanzsystem aktiviert wird. Die Anfrage enthält die Felder salesOrganization, paymentMethod, taxNumber1 bis taxNumber5, directDebit und partnerBankType. Nicht festgelegte Felder erhalten einen leeren Wert. taxNumber1 enthält die Steuernummer, taxNumber2 die Company Registration Number. Ein neues Feld „Währung“ steht am Ende der Struktur und trägt den Währungswert aus der Marktkonfiguration.

Die Felder für Kunden der Slowakei lauten wie folgt. Die Region stammt aus der Google-API, Feld administrative_area_level_1, umfasst höchstens 35 Zeichen und ist für alle Kundenarten verpflichtend. Die Personal ID umfasst 15 alphanumerische Zeichen und kann Sonderzeichen wie einen Schrägstrich enthalten. Die Sichtbarkeit der Personal ID richtet sich nach den Markteinstellungen. Als Zahlungsart steht die Kreditkarte zur Verfügung. Eine SEPA-Datei und ein Lastschriftcode sind für die Slowakei nicht erforderlich.

Der Löschkennzeichen-Status des Finanzsystems mit dem Feld DeletionIndicator ist führend. Hat das Kennzeichen den Wert „true“, zeigt oneSCM „Marked for Deletion“ an, unabhängig von weiteren Status. Andernfalls zeigt oneSCM „Blocked“. Bei Firmenkunden wertet oneSCM das Kennzeichen ebenfalls aus. Für inaktive Kunden löscht oneSCM die SAP- und SEPA-Informationen und hält dies in der Kundenhistorie fest. Der FI-Status wird für diese Kunden nicht mehr synchronisiert. Legen Sie einen neuen Servicevertrag an, prüft oneSCM die SAP- und SEPA-Daten erneut. Änderungen im Finanzsystem sind damit zum Zeitpunkt des neuen Vertrags berücksichtigt.

Wird bei der Kundenanlage ein Treffer gefunden und wählt der Benutzer dennoch die Neuanlage, übernimmt oneSCM die USt-IdNr. automatisch in den neuen Kunden. Die SAP-Debitorennummer ist alphanumerisch zulässig.

**Synchronisation mit CoFiCo.** Das Material beschreibt eine bidirektionale Synchronisation zwischen oneSCM und CoFiCo. Änderungen aus CoFiCo übernimmt oneSCM schrittweise über einen Sync-Endpunkt. Jeder Änderungsdatensatz trägt einen Zeitstempel. Ist der Zeitstempel von CoFiCo neuer, aktualisiert oneSCM den Datensatz. Ist der Zeitstempel in oneSCM neuer, bleibt der oneSCM-Wert erhalten, und er wird per Update an CoFiCo gesendet. Die Antworten sind paginiert, und der Batch-Job ruft alle verfügbaren Seiten nacheinander ab. Der Zeitplan darf höchstens 24 Stunden Intervall haben. Zusätzlich gleicht ein Abgleich der Kundendaten über zwei bis drei Wochen die Daten mit dem bestehenden Get-Customer-Endpunkt ab. Voraussetzung ist, dass CoFiCo die Sync-API bereitstellt und den Get-Customer-Endpunkt um Zeitstempel erweitert. Den Stand dieser Voraussetzung erfasst der Klärungsbedarf. Bei einer Änderung der IBAN auf Kundenebene gilt in CoFiCo derselben Ablauf wie in Deutschland. CoFiCo unterstützt mehrere IBANs und erhöht die BankId, sobald sich die IBAN ändert. Die MO wählt im Kundenmanagement die Aktualisierung der Zahlungsinformationen und gibt die neue IBAN ein. Nach der Prüfung erstellt und unterschreibt oneSCM ein neues SEPA-Mandat und sendet eine Aktualisierung mit der neuen IBAN an CoFiCo. Dasselbe gilt bei einer Änderung über das Customer Account Center. Wie die BankId in diesem Fall übermittelt wird, ist im Klärungsbedarf erfasst.

**Exportdateien und Dateinamen.** Die Exportdateien für CoFiCo und SWT tragen einen Dateinamen mit Division und Uhrzeit. Das Format lautet 1SCM_CountryCode_CompanyCode_SalesOrganization_Division_SAPDebit_YYYYDDMM_HHmmss. Dadurch entstehen auch bei sehr schnellen Exporten keine Dateien mit identischem Namen.

Die Exportjobs berücksichtigen CAMP- und DD-Rechnungen für vollständig subventionierte Verträge. In der H-Zeile ab Position 66 steht für alle Händlerrabatt-Rechnungen der Text „Dealer participation in the service contract based on the agreement.“

**Händlerrechnungstyp.** Händlerrabattrechnungen tragen intern und extern sowie bei manueller Anlage den Rechnungstyp Dealer Discount mit dem Kürzel DD. Beim Export richtet sich der Typ nach der Zugehörigkeit des Händlers. Für zugehörige Händler übermittelt oneSCM IDD, für nicht zugehörige Händler EDD.

**Datei E167 für CoFiCo und SWT.** oneSCM stellt die Schnittstelle E167 für Werkstatt-Finanzbelege bereit. Sie übergibt manuelle Werkstattrechnungen und Kostenweiterleitungsbelege an CoFiCo und SWT. Fachlich entspricht sie der E167-Werkstattschnittstelle für oneERP, verwendet jedoch eine eigene SAP-Dateistruktur, ein eigenes Mapping, einen eigenen Batch-Job und eine eigene Namenskonvention.

Die Datei ist positionsbasiert mit Datensätzen fester Länge. Sie enthält drei Satzarten. Der F-Satz steht einmal pro Datei und enthält Datum und Uhrzeit der Verarbeitung, das oneSCM-Mandat, den ISO-Ländercode, die laufende Nummer der Ausführung sowie die Summen der H- und L-Sätze. Der H-Satz enthält Kopfnummer, Kreditorennummer des Händlers oder Lieferanten, VEGA-Händlernummer, Belegtyp mit 01 für Rechnung und 02 für Gutschrift, Rechnungstyp, Rechnungsdatum, Nummern der Belege und den Bruttogesamtbetrag. Ein neuer H-Satz entsteht, sobald sich der VEGA-Händler, der Belegtyp oder der SAP-Rechnungstyp ändert. Der L-Satz enthält Positionsnummer, Reparaturdatum, Kfz-Kennzeichen, die 17-stellige FIN, die Vertragstypbezeichnung, Netto- und Bruttobetrag sowie den Steuerschlüssel. Der Steuerschlüssel stammt aus den Routing-Einträgen des Tax Managements.

In der Exportdatei trägt die Position „Finance System Document Code“ den Wert aus „Tax Management, Tax Rate, FI Tax Code“. Der Wert wird mit führenden Nullen aufgefüllt. Für die Felder „External Contract Reference“ und „External Payment Reference“ gilt Folgendes. Die External Contract Reference steht in der L-Zeile. Die External Payment Reference übernimmt oneSCM aus der Vertragsebene und stellt sie im Feld „Invoice position text“ dar. Bei MANU- und MPPI-Rechnungen steht sie hinter dem Rechnungspositionstext. Fehlt eine der Referenzen, läuft die Rechnungserstellung weiter, und das Feld bleibt in CoFiCo oder SWT leer.

Der Produktname ersetzt die Produktlinie im Export. Da der Produktname bis zu 50 Zeichen umfassen kann, übergibt oneSCM 40 Zeichen. Kürzere Namen füllt oneSCM mit Leerzeichen auf. Die Regeln sind in den Outbound Mapping Rules für CoFiCo dokumentiert.

**Validierung der Ausgangsrechnungsdatei.** Die Exportläufe SWTInvExp und CoFiCoInvExp prüfen die erzeugte Datei, bevor sie im S3-Ordner abgelegt wird. Der Kopfsatz enthält die Zähler für Rechnungsköpfe und Rechnungspositionen. oneSCM vergleicht sie mit der tatsächlichen Anzahl in der Datei.

1. Stimmen die Zähler nicht überein, protokolliert oneSCM einen Eintrag mit allen Details in Datadog.
2. oneSCM setzt den Vorgang zurück. Der Status der Rechnungen der Datei wechselt von „Exported“ auf „Accepted“. Verarbeitungsnummer und FI-System-Übertragungsdatum entfallen.
3. Auf der Batch-Job-Seite zeigt der Batch den Status „Validation Error“.
4. Nach der Behebung der Ursache startet ein Administrator den Export-Batch erneut. Die zurückgesetzten Rechnungen gehen mit neuer Verarbeitungsnummer und neuem Übertragungsdatum an das Finanzsystem. Sie werden im nächsten regulären Lauf abgerechnet.

**FI-Konfiguration.** HQ-Administratoren pflegen die Konfiguration des Finanzsystems des Finanzsystems selbst. Die Seite finden Sie unter Admin, Market Settings, External System Settings und FI-Configuration Feature. Sie steht nur für SWT- und CoFiCo-Märkte zur Verfügung. Die Werte gelten für den Export von Kundendaten über die API und für den Export von Rechnungen.

- General Details: oneSCM-Mandat als Freitext, Sprachcode und Währungscode aus einer Liste.
- Invoice Settings: je Division ein Tab für PC oder VAN mit dem Feld Sales Organization. Das Feld nimmt einen alphanumerischen Wert mit höchstens vier Zeichen auf.
- Customer Settings: je Division das Feld Legal Entity als SAP Company Code mit höchstens vier Ziffern, die Account Group mit höchstens vier Ziffern und Land1 als Ländercode aus der Liste.
- History: Änderungen auf Attributebene mit Zeitpunkt.

Mit „Save“ speichern Sie die Änderungen. „Restore“ ersetzt die neu eingegebenen Werte durch die zuletzt gespeicherten.

**Plausibilitätsprüfungen.** Auf der Seite „Financial Control“ stehen für CoFiCo und SWT eigene Prüfungen bereit. Der Tab „CoFiCo Check“ vergleicht die Summe der an CoFiCo gesendeten Rechnungsbeträge mit der Summe aus der Rückmeldedatei. Stimmen beide Summen überein, sind die Rechnungen korrekt übermittelt. Der Tab „SWT Checks“ prüft die Vergleichswerte für Indien. Die Funktion ist für alle Finanzsysteme verfügbar, daher lassen sich Werte je Markt filtern. Mehrfach hochgeladene Rechnungen erhöhen die Summen nicht, und die Gesamtsumme wird durch 100 geteilt.

Für Rechnungen aus dem Feedback des Finanzsystems gilt außerdem: Der Zahlbetrag steht in den Stellen 58 bis 73, die Währung in den Stellen 74 bis 76. Für den indischen Markt wird im Feld „MPay Operation Id“ die Transaktions-ID übermittelt.

**Rechnungstexte.** Der allgemeine Rechnungstext für Händlerrabatte und Händlerprovisionen besteht bei SWT und CoFiCo aus 240 Leerzeichen. Bei SWT trägt die Rechnungsposition von Händlerrabatten den Positionstext.

**Ergebnis und Systemstatus.** Nach dem Export und der erfolgreichen Validierung stehen die Rechnungen im Status „Exported“. Die Plausibilitätsprüfung zeigt, ob die übermittelten Summen mit der Rückmeldung übereinstimmen. Den Status der Kunden zeigt die Kundenverwaltung.

**Besonderheiten je Markt.** CoFiCo gilt für die Slowakei und weitere europäische Märkte. Für CoFiCo-Märkte existiert keine Account Note. Die MO-Prüfung der Banküberweisung ist daher nicht anwendbar. Das Feld Account Note blendet die Oberfläche in CoFiCo-Märkten aus. Die Kundenregeln für Indien mit SWT beschreibt Abschnitt 19.11.

**Hinweise.** Die Dateiübertragung über CFT beschreibt Abschnitt 19.21. Die Verarbeitung der Rückmeldungen und der Nemesis-Ereignisse nach der Rechnungsbuchung beschreibt Abschnitt 19.14.

**Fehlerbehebung.** Meldet die Validierung einen Zählerfehler, prüfen Sie den Eintrag in Datadog. Der Batch zeigt dann den Status „Validation Error“. Nach der Ursachenanalyse starten Sie den Export-Batch erneut. Die Rechnungen werden mit neuer Verarbeitungsnummer übermittelt.

Quellen: Batch 121.1, 121.3, 156.2, 198.1, 584.1, 619.1, 591.1, 591.4, 585.5, 127.1, 161.2, 142.3, 138.2, 164.5, 217.2, 162.4, 201.1, 177.1, 181.2, 581.3, 141.3, 181.6

## 19.13 SWT – FI-Anbindung

**Material:** keine Quellen in den RAG-Batches.

Zu dieser Schnittstelle liegen keine Abschnitte vor. Die Kundenanlage für SWT in Indien beschreibt Abschnitt 19.11, die Plausibilitätsprüfung der Rechnungsanzahl Abschnitt 19.15.

Quellen: keine Quellen in den RAG-Batches

## 19.14 NEMESIS – Buchhalterische Verarbeitung

**Zweck.** NEMESIS verarbeitet die buchhalterischen Finanzdaten von Serviceverträgen zum Monatsende. Der Schwerpunkt liegt auf Berechnungen für die Buchhaltung, etwa Umsatzrealisierung, Vertragsverbindlichkeiten und Rückstellungen. oneSCM sendet Ereignisse zu Kunden, Verträgen, Umsätzen und Kosten an NEMESIS. Dieser Abschnitt beschreibt die Auslöser der Ereignisse, die Steuerung je Markt, die Fehlerrückmeldungen und die historische Synchronisation.

**Voraussetzungen.** Der Markt ist für NEMESIS aktiviert. Die Option „Allow Nemesis events to be sent“ steht im Bereich „Nemesis“ der Markteinstellungen unter „External System Settings“. Die Anzeige der historischen Synchronisation und der Fehlerliste setzt den Zugriff auf die Nemesis-Seite voraus.

**Rollen.** Benutzer mit der Berechtigung „Market Settings“ führen die historische Synchronisation aus. HQ-Administratoren steuern die Erzeugung der Ereignisse je Produkt. Der Bereich für fachliche Fehler steht ausschließlich Market-Operation-Benutzern im 2nd Level Support zur Verfügung.

**Ereignisse und Schnittstelle.** oneSCM übermittelt die Daten über eine REST-Schnittstelle an NEMESIS. Ein gemeinsamer Endpunkt gilt für alle Mandanten. Die Schnittstelle liefert Informationen zu Verträgen, Vertragserlösen, Vertragsforderungen und Kundendaten. Die Ereignisse entstehen beim Revenue-Export mit dem Status „Exported“ und bei der Rückmeldung des Finanzsystems mit dem Status „FI Document Created“.

Ein Vertragsereignis entsteht bei der Aktivierung eines Fahrzeugvertrags. Der Vertragsservice im oneSCM-Backend legt das Ereignis an, und ein Batch-Job sendet es an den NEMESIS-Service. Dieser leitet die Informationen an NEMESIS weiter.

Für jeden Erlös stellt oneSCM Revenue-Informationen als JSON bereit, sowohl für automatisch erzeugte Erlöse als auch für manuell angelegte. Die Angaben umfassen unter anderem Ländercode, Fahrgestellnummer, Servicevertragsnummer, Währung, Gesamtbetrag, Gutschrifts- und Belastungsbeträge mit Datum, Verkaufssubventionen, Zahlungsart, kalkulierten Anfangspreis und monatlichen Preis. Die Zahlungsart richtet sich nach dem Preismodell und dem Zahlungsintervall. Bei Fest- oder variablem Preis lautet der Wert 01, bei einmaliger Zahlung 02 und bei Stufenpreismodellen 03. Staffelpreise für die Jahre 2 bis 15 übermittelt oneSCM nicht, da keine Stufenpreise vorliegen.

**Zeitpunkt der Revenue-Ereignisse.** oneSCM erzeugt das Revenue-Ereignis erst, nachdem das Finanzsystem die Rechnung gebucht hat. Voraussetzung ist die Rückmeldung „FI Document Created“ oder ein späterer Status wie „Paid On-Time“, „Paid overdue“ oder „Dunning Level 1“. In den Markteinstellungen wählen Sie im Mehrfachauswahl-Dropdown „NEMESIS Revenue Event Generation“ die Rechnungsstatus aus, für die das Ereignis entsteht. Neben dem Dropdown zeigt ein Info-Symbol den Hinweis „Select status for NEMESIS Revenue Event generation“. Nemesis-Ereignisse entstehen nur für Rechnungen, die den Status „FI Doc Created“ erreicht haben.

Bei Verkaufszuschuss-Rechnungen und internen Rechnungen erzeugt oneSCM Revenue-Ereignisse. Bei internen Rechnungen sendet oneSCM das Ereignis erst, wenn die Rechnung den Status „EXPORTED“ erreicht. Die Markteinstellungen gelten für diese Rechnungen nicht. Beträge in den Revenue- und Cost-Ereignissen übermittelt oneSCM im Format von NEMESIS. Der Betrag wird mit 100 multipliziert, und die Nachkommastellen entfallen. Aus 123,4567 wird so 12345, aus 123,4 wird 12340 und aus 1234 wird 123400.

**Steuerung je Produkt.** HQ-Administratoren legen in den Markteinstellungen fest, für welche Produkte NEMESIS Ereignisse erhält. Die Seite zeigt die Produkte des Marktes in einem Dropdown. Ist ein Produkt nicht ausgewählt, erzeugt oneSCM für dieses Produkt weder Vertragsstamm-Ereignisse noch Umsatz- oder Nicht-VEGA-Kostenereignisse noch Kundenereignisse. Ist ein Produkt ausgewählt, erzeugt oneSCM alle vier Ereignisarten. Jede Änderung protokolliert das System mit Zeitstempel und Benutzerkennung. PC und Van sind getrennt konfiguriert, mit einem eigenen Reiter je Division.

Für Management-Verträge sendet oneSCM keine Kunden-, Vertrags-, Umsatz- oder Händlerereignisse an NEMESIS. Verträge mit einer 100-%-Aftersales-Kampagne lösen keine Ereignisse für Vertrag, Umsatz, Kunde oder Kosten aus.

**Kostenereignisse.** Das Ereignis „Dealer Invoice“ trägt im Feld interfaceName den Wert „DealerInvoice“. Die Händlerrechnungsnummer hat 10 Zeichen, der Company Code lautet 2724. Die Händler-ID im Händlerrechnungs-Ereignis ist die Partnernummer, also die VEGA-ID, und nicht die GSSN-Outlet-ID. Die Kafka-Nachricht enthält den Marktcode für das Reporting und bei manueller Kostenerfassung das Erstzulassungsdatum. Nicht-VEGA-Kostenereignisse entstehen für manuelle Kostenanpassungen und händlerbezogene Kosten. VEGA-Kostenereignisse beruhen auf Werkstattforderungen aus dem VEGA-Import, den CLAI-Rechnungen. In beiden Fällen entsteht pro Forderung ein Kostenereignis.

**Vertragsereignisse.** Das Ereignis zur Änderung der Zahlungsdauer enthält das Feld „numberOfInvoices“. Bei vollständig subventionierten Verträgen, in denen der Kunde nichts zahlt, entsprechen Zahlungsbeginn und Zahlungsende dem Vertragsbeginn und dem Vertragsende. Wird ein Vertrag verlängert, fordert NEMESIS ein Contract-Master-Data-Event an, in dem das Feld „ExtensionReductionIndicator“ befüllt ist. Bei einer kurzfristigen Verlängerung enthält das Feld den Wert „S“.

**Import funktionaler Fehler.** NEMESIS meldet fachliche Fehler als CSV-Datei über den CFT-Ablauf. Die Datei liegt im Ordner für eingehende NEMESIS-Dateien des Landes. Sie enthält unter anderem Company Code, Business Unit, Period, Fehlerdatum und -uhrzeit im Format HHmm, Closing Date, FIN, Vertragsnummer, Vertragsstatus, Produktlinie, Meldungsnummer, Fehlergrund, Fehlertyp, Occurrence und First Incidence.

1. oneSCM ordnet jeden Fehler anhand der Meldungsnummer einem Ereignis zu. Gibt es für eine Nummer mehrere Regeln, entsteht der Fehler in allen genannten Ereignissen. Bei Fehler 23 entstehen beispielsweise Fehler in den Bereichen Contract, Revenue und Cost.
2. Für die Zuordnung zum Ereignistyp Contract, Customer, Revenue oder Cost ist der Interface-Subset maßgeblich. Andere Schnittstellentypen wie ISP ignoriert oneSCM.
3. oneSCM klassifiziert die Fehler nach Meldungsnummer und zeigt sie unter der zugehörigen Domäne an. Dem Bereich Contract sind Meldungen zu fehlendem oder ungültigem Ländercode, fehlendem Vertrag, abweichender FIN, fehlender Vertragslaufzeit, nicht gefundenem Vertragsstamm, einem Vertragsende vor der Migration bei aktivem Status und einem Vertragsbeginn in der Zukunft zugeordnet. Der Bereich Revenue zeigt, dass für einen Vertrag keine Umsatzaktualisierung erfolgt ist. Im Bereich Cost erscheint die Meldung, dass Ist-Kosten für das Abschlussdatum nicht geladen wurden. Meldungen, die ausschließlich die Kostenverteilung im Financial Management betreffen, berücksichtigt oneSCM nicht.

**Fehlerbehandlung im Admin-Bereich.** Die Suche nach fachlichen Fehlern bietet die Kriterien First Incident als Datum, Contract Number als Textfeld mit unscharfer Suche ohne Unterscheidung von Groß- und Kleinschreibung, Status als Mehrfachauswahl und Error code. Mit „Search“ füllt sich der Ergebnisbereich, „Cancel“ verwirft alle Änderungen. Änderungen an den Filterfeldern wirken sich erst nach „Search“ auf die Ergebnisse aus.

Jeder Fehler steht in einer eigenen Zeile. Eine Auswahl ist nur bei Fehlern mit dem Status „Unresolved“ möglich. Die Spalten zeigen Modification Date, Contract Number, FIN, Error code, Reason For Error, Occurrence, First Incidence und Status. Standardmäßig sortiert die Tabelle nach Modification Date, und jede Seite zeigt 10 Einträge, wählbar sind 10, 20, 30, 40 und 50.

Die Aktion „Resend“ sendet alle vier Ereignisse Customer, Contract, Revenue und Cost mit den aktuellen Daten erneut. Die Aktion „Acknowledge“ dient dem Fall, dass der Fehler keine manuelle Korrektur zulässt und der Benutzer ihn nicht beheben kann.

Die Fehlerprotokolle liefert NEMESIS als Excel-Datei über CFT, und zwar monatlich. oneSCM liest die Datei aus und zeigt den Inhalt an. Das Material beschreibt zudem die tägliche Bereitstellung der Protokolle. Den Stand dieser Umstellung erfasst der Klärungsbedarf.

**Fehlerbehandlung und erneutes Senden bei der historischen Synchronisation.** Im Sync-Verlauf öffnet die Aktion „View Details“ den Dialog „Sync Failure Details“ mit den Vertragsnummern, für die Ereignisse fehlgeschlagen sind. Über „Retrigger“ gelangen Sie zu „Nemesis Errors“, wo das fehlgeschlagene Ereignis unter seinem Ereignistyp steht. Nach der Behebung der Ursache senden Sie es erneut. Der Fehlertyp lautet „Infrastructure“ oder „Functional“.

**Historische Synchronisation.** Benutzer mit der Berechtigung „Market Settings“ synchronisieren historische Daten zwischen oneSCM und NEMESIS. Die Funktion deckt alle Ereignistypen ab: Kunde, Vertrag, Umsatz und Kosten. Sie finden sie unter Finance Management, Nemesis, mit den Reitern „Nemesis Errors“, „Historical Data Sync“ und „Sync History“.

1. Im Reiter „Historical Data Sync“ geben Sie Vertragsnummern manuell in das Textfeld ein, getrennt durch Komma oder Zeilenumbruch. Alternativ laden Sie eine Datei im Format .xls hoch. oneSCM prüft Dateityp und Format der Vertragsnummern und entfernt doppelte Einträge.
2. Wählen Sie die Ereignistypen. Standardmäßig sind alle ausgewählt, mindestens einer bleibt ausgewählt. Bei Kosten ist mindestens eine der Optionen VEGA oder Non-VEGA aktiv.
3. Kunden erzeugen je Vertrag ein Ereignis mit den vollständigen Kundenprofildaten. Vertragsereignisse legen den Vertragsstamm an. Für Umsatzereignisse RevenueSet verwendet oneSCM die letzte Rechnung mit dem Status „FI Doc Created“, die die kumulierten Werte des Vertrags enthalten soll.
4. Klicken Sie auf „Start Historical Sync“ und bestätigen Sie im Dialog mit „Confirm & Start Sync“. Danach öffnet sich der Reiter „Sync History“ mit dem laufenden Lauf. Brechen Sie den Dialog ab, bleiben Ihre Eingaben erhalten.

Der Reiter „Sync History“ zeigt Datum, Anzahl der Verträge, Ereignistypen, Gesamtzahl der Ereignisse, Dauer und Status. Die Status lauten „Success“ oder „Completed with Errors“. Einzelne Fehler stoppen den Lauf nicht. Die Fehleranzahl steht je Ereignistyp. Nach Abschluss zeigt der Eintrag die Vertragsnummern mit fehlgeschlagenen Ereignissen.

Für Benutzer mit eingeschränkter Sicht gilt: Erneutes Senden und Bestätigen sind bei Nemesis-Fehlern nicht möglich. Die Seite „Historical Data Sync“ ist sichtbar, die Eingabefelder sind deaktiviert. Dieses Verhalten gilt für alle Benutzer mit eingeschränkter Sicht und nicht nur für die Rolle „View only“.

**Fehlerprotokoll und Abgrenzung.** oneSCM liest zusätzliche Meldungsnummern aus der Nemesis-Fehlerdatei und klassifiziert sie. Die Liste der funktionalen Fehler umfasst die Fehler, die oneSCM in den Ereignistypen anzeigt. Die Fehler 83, 250 und 225 sind für oneSCM nicht vorgesehen, der Fehler 247 gehört in den Contract Master.

**Markt Indien.** Für den Markt Indien gilt der Ablauf des deutschen Marktes für Customer, Revenue, Cost und Contract. Mapping, Statuslogik und Validierungen sind identisch. Abweichend verwendet oneSCM für Indien den Company Code 1414 und den Country Code 82536. Revenue-Ereignisse übermitteln die Werte für Indien. Für Customer-Ereignisse und den Contract-Stammdatensatz gilt dieselbe Funktionsweise.

**Management-Verträge.** Für Management-Verträge sendet oneSCM keine Kunden-, Vertrags-, Umsatz- oder Händlerereignisse an NEMESIS. Die Abhängigkeit zu den Arbeitsströmen für Kunden und Verträge ist im Klärungsbedarf erfasst.

**Ergebnis und Systemstatus.** NEMESIS erhält Ereignisse für Märkte, für die die Option aktiviert ist, und für Produkte, die HQ-Administratoren ausgewählt haben. Fehlerhafte Ereignisse erscheinen in der Fehlerliste, und Sie senden sie nach der Korrektur erneut. Die historische Synchronisation zeigt Status und Fehleranzahl je Lauf.

**Besonderheiten je Markt.** Nemesis-Ereignisse entstehen nur für Märkte, in denen die Option „Allow Nemesis events to be sent“ aktiviert ist. Für Märkte ohne NEMESIS sind die Ereignisse vollständig entkoppelt. Die Anbindung für Südkorea mit dem Marktkürzel MBKR und die Angaben dazu sind im Klärungsbedarf erfasst.

**Hinweise.** Die Datenstruktur der Revenue-Dateien für NEMESIS und die Verarbeitung in der Data Foundation beschreibt Abschnitt 19.19. Die Dateiübertragung über CFT beschreibt Abschnitt 19.21.

**Fehlerbehebung.** Ein Ereignis mit dem Fehler „Functional“ korrigieren Sie in den Stammdaten oder im Vertrag und senden es danach über „Resend“ erneut. Ein Ereignis mit dem Fehler „Infrastructure“ senden Sie nach der Behebung der Ursache erneut, etwa über „Retrigger“ aus dem Sync-Verlauf. Ist eine Meldung nicht manuell korrigierbar, setzen Sie die Aktion „Acknowledge“ ein.

Quellen: Batch 270.1, 263.2, 253.4, 168.1, 191.1, 206.1, 154.2, 229.6, 716.5, 225.3, 225.4, 222.2, 156.4, 183.4, 708.4, 240.2, 251.1, 125.5, 138.1, 144.2, 253.3, 161.3, 163.4, 109.1, 162.2, 145.1, 251.5

## 19.15 MPay – Zahlungsintegration

**Zweck.** MPay ist der interne Zahlungsdienstleister von Mercedes-Benz. oneSCM nutzt MPay für Kreditkartenzahlungen, monatliche Transaktionen, Zahlungslinks, Wiederholungen fehlgeschlagener Zahlungen und Rückerstattungen. Dieser Abschnitt beschreibt die Konfiguration je Markt, die Zahlungsabläufe, die Statushistorie, die Wiederholung und die Rückerstattung.

**Voraussetzungen.** MPay ist im Markt aktiviert. Die Option „Enable MPay“ steht in den Markteinstellungen unter „MPay Configuration“ und ist für alle Märkte zunächst ausgeschaltet. Ist MPay eingeschaltet, sind alle MPay-Felder Pflichtfelder, und die Konfiguration lässt sich nur speichern, wenn alle Felder gefüllt sind.

**Rollen.** Administratoren pflegen die MPay-Konfiguration. Händler und MO legen Verträge mit der Zahlungsart MPay an. Mitarbeitende aus MO und MPC sehen die Statushistorie. MO bearbeitet abgelehnte Zahlungen und Rückerstattungen.

**Konfiguration je Markt.** Administratoren pflegen die Werte unter Admin, Markteinstellungen und dem Reiter „External System Settings“ im Bereich „MPay Configuration“. Die Angaben sind:

- Händlername als Text mit 1 bis 255 Zeichen
- Händler-ID als UUID mit 36 Zeichen
- Benachrichtigungs-URL mit 1 bis 1500 Zeichen
- Gültigkeit des Zahlungslinks in Sekunden als ganze Zahl von 1 bis 15.768.000, Standardwert 86.400
- Transaktionstyp Preauth, Preauth & Capture oder Debit
- Anzahl der Wiederholungsversuche von 0 bis 99, Standardwert 3
- Intervall zwischen den Wiederholungen in Tagen von 0 bis 99, Standardwert 7

Jede Änderung speichert das System in der Historie. Die Seite zeigt an, wer die letzte Änderung wann vorgenommen hat. Änderungen an den Zahlungseinstellungen gelten nur für neu erstellte Serviceverträge. Bestehende Verträge behalten ihre Zahlungskonfiguration. Unter „Supported Payments“ wählen Sie im Dropdown mit Mehrfachauswahl die Zahlungsarten MPay Credit Card, MPay UPI und MPay Netbanking aus. UPI und Netbanking gelten für Indien.

Ist MPay ausgeschaltet, sind alle MPay-Felder nur lesbar, und vorhandene Werte bleiben erhalten. Händler und MO können beim Anlegen neuer Verträge die Zahlungsart MPay nicht mehr auswählen. Bestehende Verträge mit MPay bleiben gültig, und Transaktionen für sie laufen weiter.

**Zahlungsart Kreditkarte bei Verträgen mit Mercedes me Konto.** Hat der Kunde ein Mercedes me Konto, ist die monatliche MPay-Zahlung möglich. Die Karte speichert MPay als Asset unter der Konsumentenreferenz. Hat der Kunde kein Mercedes me Konto, steht MPay nur für eine Einmalzahlung zur Verfügung, und bei der Vertragsaktivierung entsteht kein Karten-Asset. Der Grund ist die begrenzte Gültigkeit der Zahlungslinks für Vorautorisierung und Capture, etwa 30 Tage, während die Aktivierung länger dauern kann.

**Regelfall.** Der Händler wählt Produkt und Kundendaten und die Zahlungsart MPay. Das System prüft, ob ein Mercedes me Konto vorhanden ist. Anschließend folgt die Aktivierung ohne Erfassung von Kartendaten.

1. Nach der Aktivierung erzeugt oneSCM den MPay-Zahlungslink, sobald der CFDM-Batch gelaufen ist und die Rechnung den Status „Accepted“ erreicht hat.
2. Die Aktivierungs-E-Mail enthält einen Link zum Customer Account Center, kurz CAC. Der Kunde öffnet das CAC per OTP, wählt „Bezahlen“, gibt seine Kartendaten ein und schließt die Zahlung ab. Dabei speichert MPay kein Asset.
3. oneSCM erhält die MPay-Benachrichtigungen für autorisiert und eingezogen, markiert die Rechnung als bezahlt und übermittelt die Details an das Finanzsystem.

**Zahlung vor der Aktivierung.** Revenue erzeugt den Zahlungsplan und bestätigt ihn dem Vertrag. Der Vertrag sendet dem Kunden eine E-Mail mit dem Link zum CAC. Nach dem Aufruf des CAC prüft der Vertrag die Zahlungsberechtigung. Ist die Zahlung möglich, fordert der Vertrag bei Revenue einen Zahlungslink an. Betrag und Gültigkeit stammen aus den Markteinstellungen, „Payment Validity“. Das CAC zeigt Link, Betrag und optional die Gültigkeit an. Läuft der Link ab, zeigt das CAC einen Fehler, und die Schaltfläche „Regenerate“ wird im CAC und in den MO Checks aktiv. Nach der Neuerzeugung steht der Status in den MO Checks auf „Pending“. Der Customer-&-Partner-Microservice fragt den Zahlungsstatus per Short Polling bei Revenue ab. Das CAC zeigt danach „Payment Successful“ oder „Payment Failed“.

Bei der Vertragsaktivierung erzeugt oneSCM den Zahlungslink neu. Solange ein Vertrag im Status „Waiting for Confirmation“ oder „Waiting for Activation“ ist, liefert das System bei jeder Anfrage des Frontends einen gültigen Zahlungslink. Wurde der Link bereits verwendet, stellt das System keinen neuen bereit.

**Kreditkartenzahlung für Indien.** Im Retail-Verkauf kann der Kunde im Autohaus einen Einmalvertrag mit Kreditkarte bezahlen. Der Ablauf zur Vertragserstellung bleibt unverändert. Der Händler wählt den Markt, zu dem der Vertrag gehört. Bei der Aktivierung erzeugt oneSCM einen Zahlungslink, der im Vertrag unter „Revenue“ im Abschnitt „Payment details“ steht und nur für den indischen Markt erscheint. Der Link wird als Link und als QR-Code bereitgestellt. Er ist zwei Tage ab Erstellung gültig. Der Betrag entspricht dem Bruttobetrag der einzigen MPPI-Rechnung. Nach erfolgreicher Zahlung mit dem Status „Settled“ steht der Link für eine weitere Transaktion nicht mehr zur Verfügung.

Für die Zuordnung erzeugt oneSCM den Parameter merchantReference als UUID und speichert ihn in der Rechnungstabelle. Anhand dieses Parameters ordnet oneSCM die Benachrichtigungen von MPay der Rechnung zu und bestätigt sie. Alle empfangenen Status speichert das System als Historie. Der letzte Status erscheint pro Rechnung in der Oberfläche. Die Spalte „MPay status“ steht im Zahlungsplan nach „Invoice status“ und nur für den indischen Markt zur Verfügung.

Von MPay sind folgende Status möglich: ERROR, CREATED, PENDING, AUTHORIZED, CLEARED, CAPTURED, SETTLED, COMPLETED, REFUSED, CANCELLED, REFUND_PENDING, REFUND_REFUSED und REFUNDED. Die Rechnung exportiert oneSCM unabhängig vom Transaktionsstatus. Hat die Rechnung den Status „Exported“ und die Transaktion den Status „Captured“, setzt oneSCM den Rechnungsstatus auf „Paid“.

**Monatliche Zahlung und Online-Verkauf.** Bei monatlich bezahlten Verträgen erzeugt oneSCM für jede Rechnung im Status „Fi-Document created“ eine Transaktion mit dem hinterlegten Asset. Die Benachrichtigung zum Transaktionsstatus aktualisiert den MPay-Status. Bei Erfolg setzt oneSCM die Rechnung auf „PAID“. Diese Logik gilt nur für indische Verträge. Für Servicevertrag-Abschlüsse im Online-Shop erzeugt der Online-Shop den Zahlungslink und übermittelt die Asset-ID, die oneSCM im Revenue-Bereich speichert. Die Bereiche „MPay Information“ und die Spalte „MPay status“ sind in den Umgebungen DEV, INT und PREPROD sichtbar.

**Benachrichtigung bei Kartenupdate.** Kreditkarten laufen ab, auch während der Laufzeit eines Vertrags. Die Ablaufkette beginnt mit einer Benachrichtigung von Revenue, die auf der CIAM-ID basiert. Das System ermittelt den Kunden, wählt die E-Mail-Vorlage und versendet sie. Die E-Mail erscheint in der Historie des Vertrags.

Der Kunde ruft das CAC über die E-Mail auf und meldet sich mit Mercedes me an. Die Seite zeigt Vertragsnummer, Vertragsbeginn, Fahrgestellnummer, Zahlungsmethode, Produkt, Kennzeichen, anonymisierte Kreditkartendaten und das Ablaufdatum. Bei „Change Payment Method“ bestätigt der Kunde, dass der Monatsbetrag bis zur Kündigung abgebucht wird. Danach leitet oneSCM zu MPay weiter. Nach dem Callback zeigt das CAC eine Erfolgs- oder Fehlermeldung. Im Erfolgsfall speichert der Vertrag die neue Asset-ID samt NTR, und es erfolgen keine weiteren Benachrichtigungen.

Aktualisiert der Kunde seine Kartendaten nicht, versendet das System Erinnerungen. Der Abstand beträgt die Anzahl der Tage bis zum Ablauf geteilt durch drei. Vor jedem Versand prüft das System, ob der Kunde die Daten bereits aktualisiert hat, und beendet dann die Erinnerungen. Als aktualisiert gelten die Kartendaten, sobald MPay eine neue Asset-ID samt NTR liefert.

**Mastercard Transaction Link ID.** oneSCM speichert und verwendet die Transaction Link ID, kurz TLID, für Mastercard im Zahlungsablauf über MPay. Die TLID verknüpft eine Ausgangstransaktion mit allen Folgetransaktionen des Vertrags, also den Customer Initiated Transactions, kurz CIT, und den Merchant Initiated Transactions, kurz MIT,. Die TLID ist eine global eindeutige Zeichenkette. Die NTR-Werte bleiben ebenfalls in Verwendung und werden auf dieselbe Weise gespeichert.

Bei neuen Verträgen entsteht die TLID in der ersten CIT, in der Regel einer Zero-Authorization mit starker Kundenauthentifizierung. oneSCM speichert sie und verwendet sie für alle folgenden MITs. Bei bestehenden Verträgen ohne TLID übernimmt oneSCM die TLID aus der ersten MIT-Antwort, die eine enthält. Eine gespeicherte TLID überschreibt oneSCM nicht. Jede MIT-Anfrage enthält die TLID im Zahlungsobjekt. Fehlt eine gültige TLID, löst oneSCM eine neue CIT mit SCA aus, etwa über eine Zahlungsanfrage mit dem Betrag null und dem hinterlegten Asset. Für die Anforderung der starken Kundenauthentifizierung ist der Parameter challengeRequested vorgesehen.

Die Pflicht zur Speicherung und Übermittlung der TLID gilt laut Vorgaben der Kartenorganisation mit den Stichtagen 2. Juni 2026 für die Speicherung und 23. Oktober 2026 für die Übermittlung in Transaktionsanfragen. Eine fehlerhafte Speicherung kann zu Soft Declines des Kartenherausgebers führen.

**Wiederholung fehlgeschlagener Zahlungen.** Für jede per MPay bezahlte Rechnung sind maximal drei Wiederholungsversuche vorgesehen, die die Konfiguration festlegt. Schlägt eine Transaktion fehl, führt oneSCM folgende Schritte aus:

1. Der MPay-Status der Rechnung wird auf „Refused“ gesetzt.
2. Kunde und MO-Benutzer erhalten je eine Benachrichtigung. Für den Kunden verwendet oneSCM die Vorlage aus Documents & Communications, für die MO-Benutzer eine eigene Vorlage.
3. In der Historie der Rechnung entsteht ein Eintrag mit dem Grund „Transaction failed“, der Transaktions-ID, dem neuen Status „MPay Refused“ und dem alten Status „MPay Not Due“.
4. Die Zahl der verbleibenden Wiederholungen sinkt um eins. Nach einer Woche erstellt oneSCM eine neue Transaktion. Dies wiederholt sich, bis keine Wiederholung mehr übrig ist.

Ist die Zahlung nach drei Versuchen im Abstand von einer Woche noch abgelehnt, erhält der MO eine Benachrichtigung. Voraussetzung ist, dass die Zahlungsart Kreditkarte ist, der MPay-Status „refused“ lautet und der Kunde bereits per E-Mail informiert wurde. Zusätzlich sendet oneSCM eine E-Mail an die in den Markteinstellungen hinterlegte Adresse, damit das MO-Team den Vorgang extern dokumentieren kann. Das Glockensymbol in der Navigationsleiste zeigt bis zu 9 Benachrichtigungen, darüber „9+“. Die Meldung „Contract number has a refused payment.“ verweist auf Contract Management, Payments, Customer Invoice. Bei mehreren abgelehnten Zahlungen lautet die Meldung „Multiple Contracts have refused payments.“ Führt der MO die Aktion „Retry“ aus, ergänzt das System den Zahlungsverlauf, und die Benachrichtigung verschwindet.

**Statushistorie.** MO- und MPC-Mitarbeitende sehen den Verlauf der MPay-Status für Verträge, die über MPay bezahlt werden. Wählen Sie den Vertrag und öffnen Sie den Reiter „Payment“. Ein Klick auf den MPay-Status einer Rechnung öffnet das Protokoll. Die Einträge zeigen den UTC-Zeitstempel, den Grund „Automatic Changed by System“, den alten und den neuen Wert sowie „Changed by System“. Bei der Anlage einer Rechnung steht als alter Wert „-“. Die Historie können Sie nicht löschen. Sie schließen das Popup über „Back“ oder das X.

**Rückerstattung für Kunden ohne Mercedes me Konto.** Der Ablauf gilt nur für Rechnungen und Verträge mit der Zahlungsart „Digital Payment“. Die Auszahlungsart richtet sich nach der Sechs-Monats-Grenze ab dem Zeitpunkt der Benachrichtigung „CAPTURED“.

- Vor Ablauf von sechs Monaten erfolgt die Rückerstattung automatisiert über den MPay-Rückerstattungsendpunkt. Der Kunde muss nichts unternehmen.
- Nach sechs Monaten kann die Kreditkarte keine erfolgreiche Rückerstattung mehr garantieren. Ein Benutzer der Market Operations startet die Erstellung der manuellen Rückerstattung. Fehlen dem Kunden IBAN und Bankdaten, sendet MO eine „Refund Payout Notification“ mit einem Link zum CAC.
- Der Kunde authentifiziert sich im CAC mit Captcha und OTP und gibt seine IBAN an. Ist eine SWIFT-Validierung verfügbar, prüft das System die Bankdaten. Nach der Bestätigung übermittelt oneSCM die IBAN per POST an das Finanzsystem CoFiCo, SWT oder oneERP.
- Die Bankdaten erscheinen in oneSCM und in den Kundendaten unter „Payment Refund Information“. Nach der erfolgreichen Übermittlung sendet oneSCM die Benachrichtigung „IBAN is there“ an das Revenue Management, und die Freigabeschaltfläche wird aktiv.

Die Vorlage „Refund Specific Payout Notification“ verwendet die Kopffelder bestehender Vorlagen. Der Betreff lautet für Privatkunden „Customer Account Center access for“ mit Vor- und Nachname, für Geschäftskunden „Customer Account Center access for representative of“ mit dem Firmennamen. Die E-Mail enthält einen einmaligen Zugangslink, den Hinweis auf den mobilen Autorisierungscode mit 15 Minuten Gültigkeit und den Hinweis, dass die E-Mail nicht beantwortet werden kann.

**Zahlungsstatus bei Export.** Der CFDM-Batch setzt berechtigte Rechnungen auf den Status „Accepted“, deren Rechnungszeitraum heute oder früher beginnt. Ist MPay im Markt aktiviert, erzeugt oneSCM anschließend die MPay-Transaktion. Der Export an das Finanzsystem umfasst Rechnungen im Status „Accepted“. Bei aktiviertem MPay muss zusätzlich der MPay-Status „Captured“ oder „Refunded“ vorliegen. Ist MPay im Markt nicht aktiviert, entfällt diese Prüfung. Für den Export von Rechnungen im Nicht-MPay-Ablauf gelten die Typen MANU und MPPI im Status „Accepted“.

Bei Verträgen mit Vor- und Nachaktivierung bleiben Rechnungen im Status „Accepted + Captured“, wenn der Export-Batch für CoFiCo oder SWT deaktiviert ist. Sie werden nach der erneuten Aktivierung exportiert. Bei der Nachaktivierung setzt oneSCM eine Rechnung nicht auf „Accepted“, wenn das Fahrzeug nicht autorisiert ist. Für die Zahlungsart „UPI“ und „NetBanking“ erzeugt oneSCM den Zahlungslink direkt aus der Rechnung, nicht aus der Vertragserstellung. Die Zahlart in der H-Zeile lautet für Karte „Z“, für NetBanking „Y“ und für UPI „Z“.

**Plausibilitätsprüfung der Rechnungsanzahl.** Auf der Seite Admin, Financial Control zeigt der Tab „Export Counter / Checks“ je Exportdatei für SWT die Anzahl der exportfähigen Rechnungen in der Spalte „Invoices“ und die tatsächlich exportierten Rechnungen in der Spalte „Exported invoices“. Stimmen beide Werte überein und handelt es sich um dieselben Rechnungen, zeigt die Spalte „Check“ den Wert OK. Andernfalls erscheint „Not OK“, und die Option „More Details“ listet die Vertrags- und Rechnungsnummern, die fehlen oder nicht als exportfähig gezählt wurden. Die Zählung erfolgt je Exportdatei getrennt, und der Zähler wird nach dem Export jedes Dateityps zurückgesetzt. Der Rechnungsstatus bleibt nach dem Export „Exported“. Weitere Statuswechsel löst das Finanzsystem über die Rechnungsrückmeldung aus.

**Ereignisse an NEMESIS.** Die Einstellung „Allow Nemesis Events to be sent“ steuert die Ereignisse. Ist sie aktiviert, sendet oneSCM Kosten-, Kunden- und Vertragsereignisse. Umsatzereignisse richten sich zusätzlich nach den Nemesis-Umsatzstatus. Sind alle Status ausgewählt, sendet oneSCM jedes Umsatzereignis. Ist nur „Accepted“ ausgewählt, sendet oneSCM nur für diesen Status. Sind alle Status abgewählt, entfällt das Umsatzereignis. Den Zahlungstyp in Verträgen setzt das Ereignis nach der Zahlungsweise: 01 für monatlich, 02 für einmalig, 04 für vierteljährlich, 05 für halbjährlich und 06 für jährlich.

**Ergebnis und Systemstatus.** Die Rechnung trägt den MPay-Status und den Rechnungsstatus. Nach dem Export und einer erfolgreichen Transaktion steht die Rechnung auf „Paid“. Bei abgelehnten Zahlungen zeigt die Benachrichtigung die Referenznummer.

**Besonderheiten je Markt.** Die Zahlungsarten UPI und NetBanking gelten nur für Indien. Der Einmalvertrag per Kreditkarte im Retail-Verkauf und im Online-Shop startet mit Indien. Für Kunden ohne Mercedes me Konto steht nur die Einmalzahlung zur Verfügung. Den Stand der Themen zu PayPal, zum Kartenwechsel und zu Einmalverträgen im Online-Shop erfasst der Klärungsbedarf.

**Hinweise.** Die Benachrichtigung des MO bei abgelehnten Zahlungen erscheint im Notification Center. oneSCM entfernt private Angaben zu Fahrzeug und Karteninhaber aus den MPay-Logs. Die Löschung von CIAM-IDs prüft oneSCM über eine API, die das CID Tool von Mercedes me aufruft. oneSCM beantwortet die Anfrage nach den geschäftlichen Anforderungen, da eine CIAM-ID nicht gelöscht werden soll, solange sie für MPay-Zahlungen benötigt wird.

**Fehlerbehebung.** Schlägt eine Zahlung fehl, prüfen Sie den MPay-Status in der Statushistorie. Ist die Wiederholung abgeschlossen, starten Sie die Zahlung über „Retry“ erneut. Ist der Zahlungslink abgelaufen, erzeugt „Regenerate“ einen neuen Link. Erscheint eine Meldung zu einer abgelehnten Zahlung, wählen Sie den Link in der Meldung und prüfen Sie die Rechnung.

Quellen: Batch 157.1, 182.1, 129.2, 220.1, 216.1, 135.1, 194.1, 194.2, 160.1, 160.2, 173.1, 197.1, 215.2, 905.2, 376.2, 148.1, 903.6, 164.4, 577.4, 543.2, 905.5, 806.6, 567.1, 199.6, 217.1, 148.2

## 19.16 ALICE – Berechtigungsmanagement

**Material:** keine Quellen in den RAG-Batches.

Zu dieser Schnittstelle liegen keine Abschnitte vor. Die Anmeldung über die ALICE-API für Indien und die Slowakei beschreibt Abschnitt 19.11, die Ermittlung der verkaufenden Person über ALICE beschreibt Abschnitt 19.22.

Quellen: keine Quellen in den RAG-Batches

## 19.17 DATIX – Manuelle Übergabe

**Zweck.** Dieser Abschnitt beschreibt die manuellen Eingriffe, mit denen Mitarbeitende der Market Operation einen laufenden Batch-Job beenden und einen Rollback auslösen können. Eine automatisierte Übergabe von Kundendaten an das DATIX-System beschreibt das Material nicht. Der Stand des Kundendatenexports für DATIX erfasst der Klärungsbedarf.

**Voraussetzungen.** Der Batch-Job läuft, und Sie sind als MO-Benutzer angemeldet. Die Schaltfläche „Stop“ erscheint nur, wenn der Job den Status „Running“ hat.

**Rollen.** MO-Benutzer stoppen laufende Batch-Jobs. Die Protokollierung in Datadog hält fest, wer den Job gestoppt hat.

**Ablauf des manuellen Stopps.**

1. Öffnen Sie im Admin-Bereich die Seite „Batch jobs“ und suchen Sie den laufenden Job.
2. Wählen Sie in der Spalte „Action“ die Schaltfläche „Stop“. Solange der Job läuft, ist die Option „Run now“ deaktiviert.
3. oneSCM setzt den Job auf den Status „Stopped“, der rot dargestellt wird, und trägt den Namen des Benutzers als User-ID ein.
4. oneSCM führt einen Rollback aus. Alle während der Laufzeit geänderten Daten und alle erzeugten Sequenzen gehen auf den Stand vor dem Start zurück.

Wird der CFDM-Batch gestoppt, setzt oneSCM Rechnungen mit dem Status „Accepted“ auf „Planned“ oder „Created“ zurück. Wurde beim Stopp eine oneERP-Datei erzeugt und sind Rechnungen als exportiert markiert, löscht oneSCM die Datei, auch aus S3. Die Rechnungen erhalten ihren Ausgangszustand zurück, zum Beispiel Status und FI-Processing-Nummer.

**Ergebnis und Systemstatus.** Ein gestoppter Job zeigt den Status „Stopped“. Die Daten entsprechen dem Stand vor dem Start des Jobs.

**Besonderheiten je Sparte und Markt.** Die Rückabwicklung der Export-Dateien betrifft oneERP-Dateien und die entsprechenden Rechnungen.

**Hinweise.** Der Rollback setzt die Daten zurück und löscht erzeugte Dateien. Die Übersicht der Batch-Jobs beschreibt Abschnitt 19.22.

**Fehlerbehebung.** Ein Job, der nicht mehr beendet werden kann, lässt sich über „Stop“ abbrechen. Die Warnung in Datadog nennt den Benutzer, der den Job gestoppt hat.

Quellen: Batch 225.1, 617.4, 1288.1


## 19.18 Weitere Systeme und Dienste

**Zweck.** Dieser Abschnitt beschreibt Dienste, die über die Fachdomänen hinaus wirken: das Benachrichtigungscenter, die Fehlerbenachrichtigung für Batch-Jobs, die Vier-Augen-Freigabe für Sonderfälle, die Kennzeichnung automatisierter Historieneinträge, den Edge Service für externe Vertriebskanäle und die DevOps-Umgebung.

**Voraussetzungen.** Die Benachrichtigungen erhalten Benutzer mit den Rollen MO, MPC und Dealer. Die Fehlerbenachrichtigung für Batch-Jobs geht an das Operations-Team im 2nd Level. Der Edge Service ist für angebundene externe Systeme wie MBLD bereitgestellt.

**Rollen.** Market Operation, kurz MO, prüft und bearbeitet die Benachrichtigungen. MPC prüft Sonderfälle in der Vier-Augen-Freigabe. Dealer stellen Anfragen für Sonderfälle und erhalten die Entscheidung.

**Systeminterne Benachrichtigungen.** oneSCM versendet automatisch Benachrichtigungen zu Vorgängen, die Aufmerksamkeit erfordern. Die Benachrichtigung geht an Benutzer der Market Operation. Der Benutzer, der den Vorgang angelegt hat, erhält sie nicht. Ziel ist ein Freigabeprozess, der auf Benachrichtigungen zwischen den Benutzern beruht.

Das Benachrichtigungscenter zeigt folgende Auslöser:

- manuell erstellte Rechnungen oberhalb eines Schwellenwerts, mit der Meldung „Please approve invoice“ und der Rechnungsnummer
- Kampagnen mit Kulanzzeit (Grace Period), die beim Verkauf eines Servicevertrags angeboten werden. Der MPC genehmigt oder lehnt die Anfrage ab. Der Händler erhält danach die Meldung „Grace Period Campaign“ mit dem Namen der Kampagne und der Vertragsnummer, dass sie genehmigt oder nicht genehmigt wurde.
- Kundenrechnungen, die zu prüfen sind. Mit „Approve“ geben Sie die Rechnung frei, und der Status wechselt auf „accepted“. Mit „Reject“ lehnen Sie sie ab und gelangen auf eine dafür vorgesehene Seite.
- fehlgeschlagene Zahlungen nach den Wiederholungsversuchen (Abschnitt 19.15)

Die Glocke in der Navigationsleiste zeigt die Anzahl offener Benachrichtigungen bis 9. Bei mehr als 9 Benachrichtigungen erscheint „9+“. Ein Klick öffnet das Benachrichtigungscenter auf der rechten Seite. Jede Benachrichtigung ist mit der zugehörigen Seite verlinkt. Benachrichtigungen, die eine Aktion erfordern, sind mit einem blauen Punkt markiert. Eine erledigte Benachrichtigung, etwa nach Genehmigen oder Ablehnen, verschwindet aus dem Center. Das Center schließen Sie über das X.

**Zuweisung einer Aufgabe.** Benutzer der Market Operation oder des MPC weisen eine Benachrichtigung einer bestimmten Person zu. Sie klicken dazu auf „@unassigned“ und geben einen Namen ein. Ab drei Zeichen schlägt ein Dropdown passende Personen vor, gesucht wird nach Vor- und Nachname oder Benutzer-ID. Nach der Zuweisung sieht nur die zugewiesene Person die Benachrichtigung und erhält eine E-Mail mit einem Link. Über „Go to Invoice“ gelangt sie zur Rechnung oder zur Kampagne.

**Vier-Augen-Freigabe für Sonderfälle.** Für Sonderfälle gibt es eine Freigabe über das Benachrichtigungscenter. Ein Antragsteller stellt die Anfrage, ein erster Nutzer führt Änderungen durch, und ein zweiter Nutzer gibt sie frei. Der zweite Nutzer darf weder der erste Nutzer noch der Antragsteller sein. Die Funktion richtet sich an MPC 1, MPC 2 und Dealer.

1. Der Dealer stellt die Anfrage für den Sonderfall. MPC 1 sieht eine neue Benachrichtigung mit dem Status „Offen“ und der Referenz- oder Gruppen-ID.
2. Lehnt MPC 1 die Anfrage ab, erhält der Antragsteller den Status „Abgelehnt“.
3. Nimmt MPC 1 Änderungen vor, etwa am Preis, erhalten alle anderen MPC-Nutzer den Status „In Prüfung“.
4. Akzeptiert der zweite Prüfer die Änderungen, erhält der Antragsteller den Status „Genehmigt“. Nimmt der zweite Prüfer selbst Änderungen vor, durchläuft der Vorgang die Freigabe erneut.
5. Am Ende erhält der Antragsteller eine Benachrichtigung. Liegen zwei Prüfungen vor, kann der Vorgang nur noch mit „Akzeptiert“ oder „Abgelehnt“ abgeschlossen werden.

**Historie bei automatisierten Aktionen.** In der Vertragshistorie zeigt das Feld „Modified By“ bei automatisierten Aktionen den Wert „System“. Er ist eine reservierte Kennung für nicht menschliche Akteure und gilt in allen Diensten. Betroffen sind Statusübergänge, automatische Wiederholungen der MO-Prüfungen, die automatische Vertragsaktivierung, zeitgesteuerte Statusübergänge wie Prolongation und Ablauf, ereignisgesteuerte Aktualisierungen über Kafka, automatische Freigaben im Final Contract Review, die Dokumentgenerierung, Zahlungsverarbeitung und Batch-Jobs, die in die Vertragshistorie schreiben. Bei manuellen Aktionen erscheint weiterhin die Benutzer-ID.

**Fehlerbenachrichtigung für Batch-Jobs.** Fehlschlagende oder abgebrochene Batch-Jobs melden sich automatisch per E-Mail an das NPM-Team (Network Performance Management). Die Funktion gilt für alle Batch-Typen in allen Märkten, darunter die CFDM-Batches und die Exporte E167, E169 und E174. Das Batch-Framework beobachtet den Status fortlaufend. Wechselt ein Batch auf „Failed“ oder „Aborted“, startet die Benachrichtigung. Die Anfrage an den Benachrichtigungsdienst erfolgt innerhalb von 10 Sekunden nach der Erkennung.

Die E-Mail enthält Batch-Namen, Markt, Zeitpunkt des Fehlers im UTC-Format, Laufzeit bis zum Fehler und Fehlerstatus. Das System schreibt zusätzlich einen Protokolleintrag. Ziel der Funktion ist eine Abdeckung der Benachrichtigungen von mindestens 99 Prozent über Märkte und Umgebungen hinweg.

**Edge Service.** Der Edge Service stellt Produkte und Preise für externe Vertriebskanäle bereit. Für den Vertriebskanal „OnlineSales“ enthält die Antwort ausschließlich Produkte und Preise, die gegen die Vertriebsebene „Direct-to-customer“ und die Fahrzeugvoraussetzungen „Limits for Direct-to-customer“ validiert sind. Die Preispunkte bleiben auf Basis der jährlichen Fahrleistung. Bei Langzeitverlängerung und kurzfristiger Verlängerung bietet das System nur zulässige Kombinationen aus Laufleistung und Laufzeit an.

Für Vertragsvorschläge, die über die API angelegt werden, übernimmt oneSCM die Angebotsgültigkeit aus den Markteinstellungen. Für MBLD erfolgt keine automatische Ablehnung. Ist eine Produktversion nicht mehr verfügbar, wendet oneSCM das dafür definierte Verhalten an. Über die OTR-Schnittstelle ruft oneSCM AFAB- und GO-Auftragsnummern ab und setzt danach den bisherigen Ablauf fort.

Der Edge Service wertet Anfragen mit Datumsangaben nach den Marktvorgaben aus. Ein Datum, das nicht den Vorgaben entspricht, führt zu einer Fehlermeldung, und der Vorgang wird nicht abgeschlossen. Bei der Aktivierung darf das Erstzulassungsdatum nicht nach dem Datum der Anfrage liegen. Die Baumuster-Validierung prüft Produkt, Produktkonfiguration und Preis gegen die ursprünglichen Angaben.

**DevOps und Betrieb.** Die CI/CD-Workflows aktualisiert eine eigene Abstraktionsschicht in allen Repositories. Die Workflows starten den gewählten Branch. Das Deployment erfolgt auf AWS ECS. Die Datei-Überwachung durch CFT veröffentlicht Ereignisse für die Anwendung File Scanner. Wichtige Kafka-Topics sichert ein MSK Connector in einem eigenen Bucket. Die Secrets auf Organisationsebene liegen auf Repository-Ebene. Für ECR gehen automatisierte Benachrichtigungen bei hohen und kritischen Schwachstellen aus.

Datadog ist für die Produktivumgebung eingerichtet. Monitore überwachen Anomalien im Frontend. Zur Vorbereitung des Produktivbetriebs ist der Produktions-Account eingerichtet, mit Infrastruktur, Zertifikaten, Secrets, Anwendungsprofilen und Datenbanken. Ein Lasttest prüft Skalierung, Load Balancer, Anwendungen, Datenbankanfragen und Netzwerk. Disaster-Recovery-Szenarien messen die Zeit für einen Rollback.

**Ergebnis und Systemstatus.** Benutzer sehen Benachrichtigungen in der Glocke und im Center. Batch-Fehler erreichen das NPM-Team per E-Mail. Die Historie kennzeichnet automatisierte Einträge mit „System“. Sonderfälle laufen über die Vier-Augen-Freigabe mit dem Status der Anfrage.

**Besonderheiten je Sparte und Markt.** Die Fehlerbenachrichtigung gilt für alle Batch-Typen in den Märkten DE, IN und SK. Der Edge Service stellt Produkte für die Vertriebskanäle Leasing und OnlineSales bereit.

**Hinweise.** Die Benachrichtigung über abgelehnte Zahlungen beschreibt Abschnitt 19.15. Die Aktion „Stop“ für laufende Batch-Jobs beschreibt Abschnitt 19.17. Die Zusammenhänge der Edge-Schnittstellen beschreibt Abschnitt 19.22.

**Fehlerbehebung.** Erhalten Sie keine Benachrichtigung, prüfen Sie die Rolle und die Zuständigkeit des Vorgangs. Der Benutzer, der den Vorgang angelegt hat, erhält sie nicht. Erscheint eine Benachrichtigung nicht mehr, ist sie bereits durch eine Aktion erledigt.

Quellen: Batch 452.1, 428.2, 378.1, 159.1, 1087.2, 1189.1, 1082.5, 1142.6, 545.1, 436.2, 439.1, 461.1, 444.1, 458.1, 440.1, 441.1, 443.1, 445.1, 446.1, 447.1, 448.1, 449.1, 450.1, 451.1, 454.1, 455.1, 456.1, 459.1, 462.1, 486.1, 437.1, 521.1

## 19.19 Datenplattformen und Reporting

**Zweck.** Die Datenplattform führt Daten aus den Domänen von oneSCM, aus NEMESIS, aus den Altsystemen und aus ISP im Unified Data Model, kurz UDM, zusammen. Daraus entstehen Datenprodukte (Data Products, DP) für das Reporting. Dieser Abschnitt beschreibt die Überwachung des Datenflusses, die Ladewege, die Scheduler und die wichtigsten Inhalte der Datenprodukte.

**Voraussetzungen.** Die Datenquellen liefern ihre Dateien in den vorgesehenen Ordnern. Für Nemesis-Daten gilt zusätzlich die Ablage je Division und Markt. Die Datenprodukte entstehen aus dem UDM.

**Rollen.** Das technische Team prüft die Ursache einer Meldung. Das BU-Team aus dem Fachbereich erhält die Benachrichtigungen und klärt fehlende Daten in der Quelle.

**Überwachung des Datenflusses.** Die Überwachung meldet Datensätze, die nicht vom Data Capture Service (DCS) oder vom Glue-Job verarbeitet werden können, fehlende Daten für einen Markt oder eine Division sowie Jobfehler. Die Meldung nennt die Quelle, den Markt, die Division und die Anzahl der betroffenen Datensätze.

- Datensätze aus den Altsystemen iCON, ASSET und SIRIUS, die nicht aus der Datei in das UDM gelangen
- Nemesis-Daten, die nicht aus der Datei in das UDM gelangen, auch beim initialen Nemesis-Load
- oneSCM-Daten, die nicht vom DCS in das UDM übertragen werden
- Daten, die nicht vom UDM in die Datenprodukte übernommen werden
- Abweichungen zwischen gelesenen und geschriebenen Datensätzen

Ein einzelner Datensatz, der nicht verarbeitet werden kann, wird ausgeschlossen und gemeldet. Der Job läuft für die übrigen Datensätze erfolgreich weiter. Die Meldungen bündelt das System je Datenprodukt oder Job, etwa mit der Angabe „23 Verträge aus Nemesis für den Markt BE konnten nicht verarbeitet werden“. Bei einem Bulk Load wird direkt nach Abschluss benachrichtigt. Ein Nemesis-Paket meldet das System nach vollständiger Verarbeitung.

Eine Benachrichtigung entsteht, wenn Kafka-Daten beim DCS nicht verarbeitet werden. Bei Nemesis gilt dies auch, wenn Dateien im Eingangsordner liegen, aber nicht in den Zielbereich des DCS gelangen. Fehlen einzelne Nemesis-Dateien für einen Markt oder eine Division, erfolgt zunächst keine Meldung, weil Dateien zeitversetzt eintreffen. Fehlende I131-Dateien lösen keine Meldung aus.

Die Benachrichtigung geht an einen definierten Empfängerkreis, der auch das BU-Team umfasst. Ein Incident wird automatisch angelegt und enthält alle Angaben, um die betroffenen Datensätze zu finden. Eine Anmeldung der Empfänger ist nicht erforderlich. Der Glue-Job löst die Benachrichtigung nach seinem Ende aus, und fehlende Datensätze führen zu einer zusammenfassenden E-Mail.

**Nemesis-Daten im Ladeprozess.** Die Revenue-Dateien von NEMESIS laden über zwei Wege in die Data Foundation: über Kafka, DCS und den Reporting Service sowie über den Initial Load aus S3. Die Dateistruktur ergänzt NEMESIS um neue Felder. Neun Felder kommen in den Vertragsstammdaten und zwei Felder in den Berechnungsdaten hinzu, die Kopfinformationen bleiben gleich. Der Ladeprozess verarbeitet das bisherige und das neue Format. Im Ladeprozess über DCS und Reporting Service werden neue Felder ignoriert, der Initial-Load-Job über Glue übernimmt sie in die UDM-Tabellen. Ältere Dateien bleiben ladbar. Der Zeitplan der Umstellung auf das neue Format erfasst der Klärungsbedarf.

Die neue Struktur mit zusätzlichen Feldern gilt für alle Märkte ab 08/2023, für Großbritannien ab 07/2023. Umsatzdateien für Mai, Juni und Juli 2023 enthalten die Felder daher nicht. Der Initial Load wertet beide Strukturen aus.

Nemesis-Verträge mit dem Status „NOT YET ACTIVATED“ filtert der initiale Ladeprozess in Glue heraus. Bereits geladene Datensätze mit diesem Status löscht das System aus UDM Financials, da vor der Aktivierung Angaben wie das Erstzulassungsdatum fehlen.

**Dateiablage für den Ladeprozess.** Im Legacy-Ablauf startet die Verarbeitung, sobald eine Datendatei zusammen mit der EOF-Datei im CFT-Verzeichnis des Nemesis-Raw-Buckets liegt. Die Lambda-Funktion verfolgt die Reihenfolge aller hochgeladenen Dateien. Der Glue-Job prüft die Reihenfolge. Fehlt ein Monat und trifft ein späterer Monat ein, verarbeitet der Job die späteren Dateien weiter. Der Job überspringt den fehlenden Monat und erzeugt eine Warnung mit einer E-Mail. Sobald die fehlende Datei eintrifft, laden Sie sie manuell hoch, zusammen mit den Folgemonaten in der richtigen Reihenfolge. Die Folgedateien liegen im Backup-Ordner.

Ein Datensatz mit ungültiger Länge bricht den Ablauf nicht mehr ab. Das System protokolliert den Fehler, überspringt den Datensatz und verarbeitet die übrigen Datensätze der Datei. Die übersprungenen Datensätze stehen in einer separaten Fehlerdatei mit Dateiname, Datensatzkennung oder Vertragsnummer, Berichtsjahr und Berichtsmonat sowie dem Zeitstempel.

**Zeitplan und Scheduler.** Die Base-DP-Jobs laufen am 4. eines jeden Monats. Der Batch-Scheduler ReportingDataProducts löste alle Datenprodukt-Jobs gemeinsam aus. Heute gibt es getrennte Scheduler. Der bestehende Scheduler bedient die Base-Datenprodukte für Vertrag, Kosten, Van-Kosten und Umsatz. ISP und SC Financials haben jeweils einen eigenen Scheduler. Die Funktion function_dp_from_udm verarbeitet die unterschiedlichen Payloads. Alle Scheduler verwenden zunächst denselben Zeitplan, sie lassen sich jedoch unabhängig voneinander einstellen.

**Datenprodukte.** Das Base-Service-Contracts-Datenprodukt enthält drei Spalten für die Hauptdeckung: Maintenance, Warranty und Wear and Tear. Jede Spalte zeigt Y oder N. Ein Komplettvertrag mit allen drei Hauptdeckungen erhält in allen drei Spalten Y. Die Zuordnung erfolgt über eine Mapping-Tabelle für Deckungsarten und Deckungscodes. SIRIUS-Märkte sind in dieser Umsetzung ausgenommen. Die Dateien mit Inventardaten werden monatlich je Markt und Division bereitgestellt, spätestens am 3. eines Monats. Die Felder Marke, Produktkategorie, Kennzeichen, Unterschriftsdatum sowie Name des Verkäufers übernimmt das UDM aus den Inventarlisten.

Der Reporting-Batch für Vertrags- und Umsatzdaten erzeugt CSV-Dateien für Delta- und Vollladungen. Für Umsatzdaten gibt es die Spalten Status mit den Werten „New“ und „Exported“ sowie eine Job-ID. Ein neuer oder geänderter Umsatzdatensatz erhält den Status „New“. Eine Schnittstelle setzt den Status auf „Exported“, sobald eine Liste von Revenue-IDs, eine Job-ID und die Markt-ID übergeben werden.

Die Schnittstelle getAvailableProducts gibt für Produkte mit ISP die maximale Laufzeit und die maximale Laufleistung aus. Ist das Feld isp_available in der Tabelle vehicle_information auf „true“ gesetzt, liefert die Antwort die Details anhand des isp_code.

Für MBD Vans erweitert das Umsatz-Datenprodukt die Preisfelder. Der Vertragsnettopreis stammt aus den Inventory-Reports von ICON und Asset. Der Nettopreis je Kilometer stammt aus dem DDECost-Report von ICON, Asset und SIRIUS. Die Bereitstellung dieser Werte durch den Vertragsservice erfasst der Klärungsbedarf. Das Kunden-Datenprodukt enthält die Felder fin_id, vin_id und status_cd.

Die Zuordnung des Felds aq_veh_model_series_cd leitet das System immer aus der FIN ab. Das Feld BAUREIHE aus den Nemesis-Daten wird ignoriert, da seine Werte nicht zum erwarteten Schlüssel passen. Die Änderung gilt im DCS und im Glue-Prozess gleichermaßen. Den ASSET-Import übernimmt oneSCM so, wie ASSET die Schadensfolgenummer und die Schadenspositionsnummer liefert.

**Ergebnis und Systemstatus.** Die Datenprodukte stehen im Reporting zur Verfügung. Fehlende oder nicht verarbeitete Datensätze sind über die Benachrichtigung und den Incident nachvollziehbar.

**Besonderheiten je Sparte und Markt.** Die Inventardateien gelten für die ASSET- und iCON-Märkte. SIRIUS-Märkte sind bei den Deckungsfeldern ausgenommen.

**Hinweise.** Die Vertragsdaten zu Nemesis beschreibt Abschnitt 19.14. Die Kundentypen für das Kunden-Datenprodukt sind im Klärungsbedarf erfasst.

**Fehlerbehebung.** Erhalten Sie eine Meldung über fehlende Datensätze, prüfen Sie die Quelle, den Markt und die Division aus der Meldung. Fehlt ein Monat einer Nemesis-Datei, laden Sie die fehlende Datei zusammen mit den Folgemonaten manuell nach CFT. Enthält die Fehlerdatei übersprungene Datensätze, korrigieren Sie sie in der Quelle.

Quellen: Batch 304.1, 303.1, 317.1, 322.4, 331.1, 301.1, 300.3, 305.3, 314.1, 304.3

## 19.20 Legacy-Systeme und Übergangsarchitektur

**Material:** keine Quellen in den RAG-Batches.

Zu diesem Unterkapitel liegen keine Abschnitte vor. Die Altsysteme iCON, ASSET und SIRIUS im Datenfluss des Reportings beschreibt Abschnitt 19.19.

Quellen: keine Quellen in den RAG-Batches

## 19.21 Technische Integrationswege

**Zweck.** oneSCM tauscht Daten über Schnittstellen aus: über REST-Aufrufe am Edge Service und an den Diensten, über Kafka-Ereignisse und über Dateien, die CFT in S3-Ordnern ablegt. Dieser Abschnitt beschreibt die Dateiwege und Ordner, die Dateiübertragung über CFT, die Kafka-Ereignisse und die Verarbeitung der Rückmeldedatei i156.

**Voraussetzungen.** Die Dateien liegen im vorgesehenen Ordner. Für die Dateiübertragung ist der CFT-Ablauf eingerichtet. Den Bereich „Cross File Transfer“ nutzen HQ-Administratoren und Benutzer mit Zugriff auf den Bereich.

**Rollen.** HQ-Administratoren und Benutzer mit Zugriff auf den Bereich Admin prüfen die Dateiübertragungen. Market Operation prüft die Ergebnisse der Verarbeitung.

**Dateiwege für Finanzsysteme.** Für SWT liegen der Ausgangs- und der Eingangsordner im Bereich „IN/SWT“ mit der Kennung „IN_E169“. Für CoFiCo liegen sie im Bereich „SK/CoFiCo“ mit der Kennung „SK_E169“. Die Ordner für technische Rückmeldungen „IN_E169_ERROR“ und „SK_E169_ERROR“ sind in der Struktur vorgesehen. Die zugehörigen Abläufe erfasst der Klärungsbedarf. Die Pfade müssen im CFT-Ablauf nachgezogen sein.

Die Datei E167 für CoFiCo und SWT liegt im Ordner für ausgehende Dateien unter ENV, Marktcode, Finanzsystem, Outgoing und E167. Die Exportdateien erhalten einen Namen mit Division und Uhrzeit.

**Dateiwege für VEGA.** Die Schnittstelle i155 legt ihre ausgehenden Dateien in Amazon S3 unter INT, DE, VEGA, Outgoing und i155 ab. Die Logdateien der i155 liegen ergänzend im Ordner I155_LOGS. Die eingehenden Dateien I156 und I131 liegen im Bereich für eingehende Dateien. Das Material beschreibt eine Struktur mit zentralen, globalen Ordnern für alle Märkte anstelle je Markt eigener Ordner. Der Ordner VEGA-ALL wird in VEGA_FULL_TEMP umbenannt. Mehrere Ordner für denselben CFT-Flow erzeugen hohen Wartungsaufwand und können Sperren auslösen, wenn derselbe Flow gleichzeitig läuft. Die Migration der Dateien und Datenbankverweise und die Abstimmung auf dem CFT-Server erfasst der Klärungsbedarf.

**Dateiwege für NEMESIS und die Datenplattform.** Die Fehlerdatei mit funktionalen Fehlern legt NEMESIS im Eingangsordner des Landes unter Environment, DE, NEMESIS und Incoming ab. Die Revenue-Dateien für die Datenplattform liegen im CFT-Verzeichnis des Nemesis-Raw-Buckets. Die Verarbeitung ist in Abschnitt 19.19 beschrieben.

**Dateiübertragung über CFT und Statistik.** Im Admin-Bereich steht der Eintrag „Cross File Transfer“ mit zwei Tabs zur Verfügung: „Cross File Transfer“ zeigt die Übertragungshistorie, und „Upload“ hochgeladene Dateien. Für die Exportdateien E169, E167, E174, SWT und CoFiCo zeigt die Spalte „Total Number of Items“ die Anzahl der exportierten Rechnungen. Bei Status „Completed“ folgt die Anzahl der übersprungenen Rechnungen in Klammern, etwa „1000 (450 skipped)“. Kann die Datei nicht gelesen werden, lautet der Wert „N/A“.

Die Aktion „Statistics“ öffnet die Details einer Datei mit den Spalten Processing Number, oneSCM-Rechnungsnummer, Vertragsnummer, Status und Reason. Als Filter stehen die Nummern, ein Status-Dropdown mit „Exported“ und „Skipped“ sowie die Schaltflächen „Search“ und „Reset“ zur Verfügung. Die Gründe stammen aus Datadog. Die Aktion „Details“ bleibt unverändert.

**Verarbeitung der Rückmeldedatei i156.** oneSCM importiert i156-Dateien in der Reihenfolge, in der VEGA sie erzeugt hat. Liegen mehrere Dateien gleichzeitig im S3-Bucket aus dem CFT-Ablauf, verarbeitet das System sie anhand des Zeitstempels im Satztyp 01 an den Positionen 49 bis 74. Eine Datei mit einem älteren Zeitstempel als der zuletzt importierten Datei überspringt oneSCM und protokolliert einen Fehler in Datadog.

Werden einzelne Ansprüche wegen fehlerhafter Daten übersprungen, protokolliert oneSCM den Fehler in Datadog. Der Administrator erhält eine gesammelte Benachrichtigung mit dem Text „Please review the skipped claims in DataDog“.

Eine Datei mit demselben Zeitstempel lässt sich erneut verarbeiten. Dafür laden Sie die Datei im Bereich „Cross File Transfer“ im Tab „Upload“ hoch. Die Suche bietet den Dateinamen mit höchstens 50 Zeichen, das Datum, die Schnittstelle, die nur i156 umfasst, und „Uploaded by“ mit höchstens 10 Zeichen. Unterstützt werden die Dateitypen .dat und .txt. Bei der erneuten Verarbeitung vergleicht oneSCM die Ansprüche mit der Datenbank. Stimmen Zeitstempel und Entscheidungsnummer überein, überspringt oneSCM den Anspruch. Importiert werden nur Ansprüche, die noch nicht vorhanden sind. So lassen sich korrigierte Ansprüche nachträglich importieren, etwa eine Datei mit demselben Header und dem korrigierten Anspruch.

**Kafka-Ereignisse.** oneSCM verarbeitet Änderungen aus MMe CMDS über ein Kafka-Ereignis. Neuanlagen, Änderungen der E-Mail-Adresse und Löschungen von MMe-Profilen werden verarbeitet. Ungültige MMe-IDs entfernt oneSCM aus Datenschutzgründen. Eine MMe-ID wird sichtbar, sobald der Kunde sein Konto aktiviert hat, also nach dem ersten erfolgreich verarbeiteten Ereignis. Die E-Mail-Adresse für Benachrichtigungen bleibt von der MMe-E-Mail-Adresse getrennt. Die Kafka-Listener ignorieren unbekannte Felder.

Der Producer für die Kontingentanzahl sendet an das Topic „contingent_count“ mit den Feldern coverageCode, damageCode und vegaApplicationNr.

Ein Fahrzeug aus VeDoc lässt sich mit einer längeren Motor-Seriennummer synchronisieren. Das Datenbankfeld akzeptiert die längere Nummer.

**Ergebnis und Systemstatus.** Die Statistik zeigt die verarbeiteten und übersprungenen Datensätze. Übersprungene Ansprüche und Datensätze erscheinen als Meldung in Datadog.

**Besonderheiten je Sparte und Markt.** Die Ordner für SWT gelten für Indien, die Ordner für CoFiCo für die Slowakei. Die Ordner für VEGA gelten für Deutschland.

**Hinweise.** Die Ordnerwahl und die Benennung der Dateien hängen vom CFT-Flow ab. Die Datei für die manuelle Übergabe von Rückmeldungen beschreibt Abschnitt 19.11.

**Fehlerbehebung.** Übersprungene Ansprüche finden Sie in Datadog. Korrigieren Sie den Anspruch in der Quelle oder erstellen Sie eine Datei mit demselben Header und dem korrigierten Anspruch. Laden Sie diese Datei im Tab „Upload“ hoch. Für eine erneute Verarbeitung einer Datei mit demselben Zeitstempel laden Sie sie erneut hoch.

Quellen: Batch 1302.1, 1290.1, 141.1, 719.2, 225.3, 843.5, 851.1, 820.7, 1246.5, 589.1, 229.6, 147.1

## 19.22 Schnittstellenbetrieb und Fehlerbehandlung

**Zweck.** Dieser Abschnitt beschreibt, wie oneSCM Schnittstellen betreibt, Dateien und Ereignisse verarbeitet, Batch-Jobs steuert und Fehler behandelt. Er ergänzt die fachlichen Beschreibungen der einzelnen Anbindungen in den Unterkapiteln 19.2 bis 19.21.

**Voraussetzungen.** Für den Zugriff auf den Batch-Job-Bereich benötigen Sie eine Admin-Rolle. MO-Benutzer sehen Batch-Jobs und deren Läufe, ohne sie zu verändern. Externe Partner nutzen den Edge Service mit einer technischen Berechtigung für die betreffenden Endpunkte.

**Rollen.** Administratoren verwalten Batch-Jobs und laden Dateien herunter. MO-Benutzer sehen Batch-Jobs und Läufe. Partnersysteme wie Leasingpartner und Online-Vertrieb rufen den Edge Service auf. Der Support analysiert Fehler über die Protokolle.

**Edge Service.** Der Edge Service ist die externe Schnittstelle für Online-Vertrieb, Leasing, Produkte, Verträge und Kilometerstände. Die Schnittstelle richtet sich an Partner und an das Frontend.

Den Online-Vertrieb bedienen die Endpunkte POST /contract/v1/online-sales und POST /contract/v2/online-sales sowie GET /contract/v1/status, GET /contract/v1/contract und GET /contract/v1/contracts. Den Leasingvertrag bedienen POST und PUT auf /contract/v1/leasing und /contract/v2/leasing sowie die Konfigurationsendpunkte. Die Verlängerung bedient POST /prolongation, die Preisermittlung bei Verlängerungsangeboten. Den Kontosaldo liefert GET /contract/v1/balance. Die Produktsuche bedienen POST /product/v1/search, POST /product/v2/search, POST /product/v1/detailed, POST /product/v1/leasing/searches und POST /product/v1/online-sales/searches. Die Callbacks für das TraCS-Ergebnis des Adressabgleichs und die digitale Signatur aus dem Dokumentenmanagement nehmen die Endpunkte an POST /v1/tracs/onescm_address-match-final-result und GET /document-management/dss entgegen.

Fehlerantworten und Antworten auf Anfragen gelten als Teil der externen Schnittstelle. Interne Fehlercodes übersetzt der Edge Service in die passenden externen Codes. Ein interner Fehler 403 erscheint extern als 403, ebenso 404 und 500. Zuvor kam extern immer 500 an. Partner sehen dadurch die Ursache eines Fehlers. Die Fehlerbehandlung wird durch Monitore und Benachrichtigungen bei Fehlern im Edge Service begleitet.

Der Edge Service prüft Datumsangaben. Beim Anlegen eines Vertrags verlangt er ein Datum im ISO-Format, etwa 2025-12-01. Bei der Aktivierung im Bereich Leasing zeigt das System die Differenz zwischen dem Datum des ersten Fälligkeitstermins und dem Erstellungsdatum des Angebots in Monaten an.

Für Leasingverträge übernimmt oneSCM die Angaben zur verkaufenden Person aus der E-Mail-Adresse über ALICE und speichert sie auf Vertragsebene. Die Felder salesmanFirstName, salesmanLastName, outletName, outletCountry, salesmanPhoneNumber, dealerName und dealerAddress entfallen aus dem Request-Body. Edge-Anfragen enthalten die Division PC oder VAN. Fehlt die Division oder ist sie nicht zuzuordnen, gibt der Service einen Fehler aus. Der Vertriebskanal steht in den Produktdetails und wird in den Anfragen für Leasing- und Standardverträge übergeben.

Die Endpunkte für Produkte und Preise liefern die Währung als dreistelligen ISO-Code im Knoten priceConfigurations, einmal je Produkt. Das gilt für /product/v1/leasing, /product/v1/online-sales und die Suchen für Leasing und Online-Vertrieb. Die Anfrage an /product/v1/leasing nimmt die vollständige Liste der SA-Codes entgegen. oneSCM filtert die preisrelevanten technischen Optionen und ISP-Codes heraus und gibt die angewendeten Codes im Knoten technicalOptions aus. Das Attribut includedTechnicalOptionIds entfällt. Mit dem Attribut priceDate lassen sich frühere Preisversionen abrufen, etwa für eine Wiederholung der Preisberechnung nach einer Preisaktualisierung zum Jahresbeginn.

Die Produktsuche gibt den Preis für die übergebene Kombination aus Laufleistung und Laufzeit aus. Fehlt diese Angabe, liefert die Antwort den Preis der kleinsten verfügbaren Kombination. Zusätzlich enthält die Antwort alle verfügbaren Kombinationen des Produkts. Über das Feld mileageType unterscheidet die Anfrage jährliche Laufleistung „annual“ und Gesamtlaufleistung „total“, das Feld requestedMileage übernimmt die Angabe. Die vollständige Preismatrix liefert ein eigener Preis-Endpunkt mit Produkt-ID als Pflichtparameter.

Die Leasingsuche liefert die vorgesehene Antwort. Bei der Aktivierung eines Leasingvertrags übergibt oneSCM die Zahlungsreferenz. Der Endpunkt POST contract/v1/leasing akzeptiert die externalCampaignId als Zeichenkette. Die Produktsuche mit product/v2/search ruft Produkte ab, und der Sprachwert der Produktsuche in product/v1/search steht in den Headern.

Die Edge-Endpunkte für Verlängerungen und Verträge bieten nur zulässige Kombinationen aus Laufleistung und Laufzeit an. Bei Langzeitverlängerungen und kurzfristigen Verlängerungen gilt die Verlängerungsregel aus Abschnitt 19.9. Der Edge Service prüft beim Anlegen eines Vertrags das Erstzulassungsdatum und das Datum der Anfrage.

Ob sich Verträge im Status „Created“ über den Edge Service aktualisieren lassen, erfasst der Klärungsbedarf.

**Batch-Jobs im Schnittstellenbetrieb.** Die Dateien und Ereignisse der Schnittstellen verarbeiten Batch-Jobs. Die Übersicht „Batch Job Management“ im Bereich Admin zeigt alle Batch-Jobs aller Märkte mit Name, Status, Markt-ID, Dauer, Zeitpunkt und Status des letzten Laufs, dem Zeitplan und den Aktionen. Globale Jobs, zum Beispiel für die Synchronisation mit Elasticsearch, den CePro-Import und die Dokumentmetadaten, führt das System unter dem Markt „Global“. Sie erscheinen in allen Märkten. Ein Filter nach Markt zeigt also sowohl die globalen Jobs als auch die Jobs des gewählten Marktes.

Administratoren laden Dateien eines Jobs aus S3 herunter. Die Dateisuche filtert nach dem Dateinamen, der Enthält-Suche, und einem Zeitraum: Today, Last week, Last month oder Last 3 months. Die Dateien erscheinen erst nach „Search for Files“. Jede Datei hat eine eigene Download-Schaltfläche, und der Name und das Format bleiben wie im S3-Bucket. Die Ergebnisse erscheinen seitenweise mit 10, 20, 30, 40 oder 50 Einträgen.

Die Ausführungshistorie speichert zu jedem Lauf die Job-ID, Start- und Endzeit, die Dauer, den Status „abgeschlossen“, „fehlgeschlagen“ oder „gestoppt“ sowie die Benutzer-ID des Auslösers. Die Liste der Läufe ist sortierbar, paginiert und über den Jobnamen durchsuchbar. Während ein Lauf läuft, zählt die Oberfläche die Laufzeit in Sekunden und aktualisiert den Status regelmäßig. Ein Klick auf die Zeile öffnet die Läufe des Jobs.

Die Zeitangaben der Batch-Jobs stehen in UTC. Der Dashboard-Filter nennt die Felder „Date From“, „Date To“ und „Status“, und die Detailansicht zeigt die Parameter des Jobs wie USERNAME, DIVISIONS, LAUNCH_DATE oder MARKET_ID. Bei einem Fehler zeigt die Detailansicht den Fehlercode.

**Batch-Scheduler und Aktionen.** Jeder Job hat einen Zeitplan aus Cron-Ausdrücken. Ein Job kann bis zu zehn Cron-Ausdrücke haben. Die Schaltfläche „Save“ ist nur aktiv, wenn der Ausdruck gültig ist. Die Validierung in der Oberfläche entspricht der Prüfung im Backend, sodass Ausdrücke wie „*/5 * * * *“ bereits bei der Eingabe abgelehnt werden.

1. Mit „Run Now“ startet ein Administrator einen Job sofort. Die Aktion ist deaktiviert, solange derselbe Job läuft. Ein Tooltip nennt den Grund.
2. Mit „Disable“ setzt ein Administrator den Job auf „Disabled“. Der Job läuft dann nicht mehr zum geplanten Zeitpunkt, bis er wieder aktiviert wird.
3. Mit „Enable“ aktiviert ein Administrator einen deaktivierten Job. Ein Job läuft nach dem Zeitplan nur, wenn er den Status „Enabled“ hat.
4. Mit „Stop“ beendet ein MO-Benutzer einen laufenden Job, siehe Abschnitt 19.17.

Ein Lauf startet nicht, wenn der Job in einer anderen Sitzung deaktiviert wurde. Neu angelegte Jobs sind standardmäßig deaktiviert.

Die Sprache der Oberfläche übergibt oneSCM beim Auslösen eines Batch-Jobs im HTTP-Header X-Language, analog zum Header X-Market. Der Wert ist verpflichtend und steht dem Job als Parameter language zur Verfügung.

Die automatische Wiederholung der MO-Prüfungen übernimmt der Batch-Job „MO Checks Sync“. Er läuft pro Markt und führt nur Prüfungen mit dem Status „Ausführung fehlgeschlagen“ erneut aus. Ein Erfolg setzt den Status auf OK, Nicht OK oder Ausstehend. Bleibt das technische Problem bestehen, bleibt der Status erhalten, und der nächste Lauf versucht es erneut.

**Ereignisse von oneERP.** oneERP sendet Statusänderungen über Kafka-Topics. Jedes Ereignis gehört zu genau einem FI-Beleg oder einer Rechnung. oneSCM übernimmt nur relevante Ereignisse in eine Warteschlange und verarbeitet sie nacheinander. Die Häufigkeit des Abrufs ist konfigurierbar, ein täglicher Import ist sinnvoll. Ereignisse ohne Inhalt überspringt oneSCM.

Ein Ereignis enthält Controller, Company Code, Fiscal Year und Document Number. Die Belegnummer identifiziert die FI-Rechnungsnummer. Hinzu kommen Nettofälligkeitsdatum, Ausgleichsdatum und Mahnstufe. Ist das Nettofälligkeitsdatum gesetzt, das Ausgleichsdatum aber nicht, bleibt der Rechnungsstatus unverändert. Sind beide Daten gesetzt, aktualisiert oneSCM den Status nach der Regel. Die Mahnstufe steigt nach einer marktspezifischen Frist. Für den deutschen Markt sperrt oneSCM den Vertrag bei Mahnstufe 3.

Für den Rechnungsaustausch mit CoFiCo gilt die Struktur der Dateien aus Abschnitt 19.12. Rechnungsrückmeldungen von SWT importiert oneSCM. Die Signaturangabe im Feld HTXT06 der E169-Datei gilt nur für Gutschriften. Bei Rechnungen bleiben die Felder für Unterschriften leer.

Die Schnittstelle SA31 ersetzt die Schnittstelle SA26. oneERP sendet je Rechnung eine SA31-Kafka-Nachricht, sobald die Rechnung in oneERP aktualisiert wird. oneSCM liest die Ereignisse aus einem gesicherten Topic und aktualisiert den Rechnungsstatus nach den Mapping-Regeln. Die Nachricht besteht aus Kafka-Header, Payload-Header und Payload-Positionen. Die Umstellung auf SA31 erfasst der Klärungsbedarf.

**Batch-Ergebnisse von Exporten.** Der Export der Ausgangsrechnungsdatei für SWT und CoFiCo verwendet die Operation-ID anstelle der Merchant Reference. Bei MPay-Rechnungen überführt der Batch eine Rechnung nur in den Status „Accepted“, wenn der MPay-Status nicht „PENDING“ lautet. Die exportierte Operation-ID richtet sich nach dem MPay-Status: bei „Capture“ die Operation-ID der Capture-Transaktion, bei „Refund“ die der Erstattung und bei „ChargeBack“ die der Rückbuchung. Der CFDM-Batch setzt die Rechnungen auf „Accepted“, der E169-Export erzeugt die Datei mit der VIN oder einem Platzhalter „-“, wenn die VIN fehlt.

Im Export E169 steht für Altteilesteuer-Transaktionen im HEADER-Satz der Wert 4 im Feld „Type of Business Transaction“. Für alle anderen Geschäftsvorfälle bleibt der bisherige Wert. Die Satzstruktur und die Feldlänge bleiben unverändert.

Die Sales-Campaign-Schnittstelle E174 übergibt für Zeile 240 das Sachkonto 40170000. In Zeile 250 steht das Economic Model, das aus den letzten sechs Stellen der QSD5-Materialnummer besteht. Der Job OneERPInvE169EXP schlägt bei fehlerhaften Daten nicht mehr fehl.

Die Gutschrift für Altteilesteuer und der Upload der i156-Datei arbeiten wieder. Der Export für den slowakischen Markt setzt für jede H-Zeile eine eindeutige Verarbeitungsnummer.

**Dateien an VEGA und Schnittstelle i155.** Der Dateiname der i155 setzt sich aus der Kennung I155, dem ISO-Ländercode, der Markenzuordnung PC, VAN oder SMART, einem Zeitstempel im Format JJJJMMTThhmmss und der Endung txt zusammen. Die Datei enthält nur Verträge im Status „aktiv“. Sie endet mit einer Abschlusskennung und einem Zeilenumbruch.

Die Datei enthält weitere Angaben. Der Startkilometerstand steht rechtsbündig in den Positionen 98 bis 104. Das Kennzeichen steht im Satz RC05 an den Positionen 177 bis 186, linksbündig, wenn es erfasst ist. Die Coverage-IDs sind eindeutig. Bei Reifenprodukten gibt die Datei die Wetterprofile „Sommer“, „Sommer/Winter“ und „Allwetter“ auf Deutsch aus. Die Branchenschlüssel der Position 266 bis 269 übermittelt die Datei nicht; die Position bleibt leer, sofern das Material dies bestätigt, siehe Klärungsbedarf.

Die Kontingentzählung im Satz RC20 erfolgt für Basisleistungen. Optionale Leistungen und Karosserieleistungen zählen nicht. Bei Reifen- und Kontingentprodukten stehen in den Positionen 165 bis 169 und 170 bis 174 die Werte „00000“ und die Position 175 bleibt leer. Andernfalls trägt die Position den Wert 1 ein. Die Deckungskategorie „Duration and Mileage“ wird im Satz RC20 entsprechend konfiguriert.

Die Warteschlange des Exports leert oneSCM, sodass Verträge nicht mehr wiederholt exportiert werden. Die Datei wird auch für das Herunterladen aus der Vertragshistorie bereitgestellt. Der Batch-Job I155 läuft in der Integrationsumgebung fehlerfrei. Die Antwort der Schnittstelle getBatchContracts enthält FIN und VIN.

**Nemesis-Schnittstelle.** Die Zguid in den Nemesis-Ereignissen wird mit führenden Nullen auf 30 Stellen angegeben. Der Ländercode für Deutschland lautet 20000, der IconTenant entspricht der 1SCM-Tenant-ID, und der CompanyCode lautet DE01. Beim Wechsel des Zahlungsintervalls von monatlich auf einmalig sendet oneSCM ein Contract-Master-Ereignis mit ExtentionReductionIndicator E und PaymentType 02. Das Zahlungsbeginn-Datum entspricht dem Feld „Invoice period from“ der ersten Rechnung des Zahlungsplans, das Zahlungsende dem Feld „Invoice period to“ der letzten Rechnung. Im Feld für die externe Vertragsnummer übermittelt oneSCM nicht die oneSCM-Vertragsnummer. Erfolgreich übermittelte Vertragsereignisse erzeugen kein Fehlerereignis in NEMESIS. Die Abweichung zwischen geplanter Vertragsdauer in der Oberfläche und in der Kafka-Nachricht ist im Material als beseitigt beschrieben.

Für den Nemesis-Import nimmt die Schnittstelle den Dateinamen als Request-Parameter entgegen und dekodiert ihn. Die Rechnungsfilter-API berücksichtigt den Rechnungstyp.

**Lieferantenberichte.** Die Lieferantenberichte (Supplier Reports) stützen sich auf eine gemeinsame Datengrundlage aus den Services Vertrag, Kunde und Lieferant, Erlöse und Kosten, Produkt und Fahrzeug. Die Quell-Services erfassen Momentaufnahmen über eine gemeinsame Bibliothek und speichern sie zusammen mit der fachlichen Änderung in einer Outbox. Ein gemeinsamer Relay veröffentlicht sie über Kafka. Der History Service übernimmt die Daten und legt typisierte aktuelle und historische Sichten in OpenSearch ab.

Bei einem Ausfall der Historie holen die Ereignisse nach der Wiederherstellung auf, Kafka hält sie vor. Ist Kafka nicht verfügbar, bleiben die Snapshots in der Outbox und werden nach der Wiederherstellung übertragen. Unvollständige Eingaben meldet die Bereitschaftsprüfung mit dem Status WAITING oder BLOCKED samt Gründen. Die Berichtserstellung, die CSV- und XML-Ausgabe, die Vorlagen und die Oberfläche gehören nicht zu dieser Lieferung. Zeitfenster für Ausfälle und die Regeln für Zeitstempel sind im Klärungsbedarf erfasst.

**Konsumenten von Ereignissen.** Ein Konsument einer oneSCM-Schnittstelle authentifiziert und validiert die Anfrage und speichert oder reiht sie dauerhaft ein. Er antwortet innerhalb von 10 Sekunden mit dem Status 202. Er dedupliziert nach Idempotency-Key und eventId, verlässt sich nicht auf die Reihenfolge der Ankunft und ignoriert unbekannte JSON-Felder. Dauerhafte Validierungsfehler melden 4xx, vorübergehende Annahmeunfähigkeit 5xx oder 429. Das Token prüft der Konsument auf Aussteller, Zielgruppe, Ablauf, Signatur und Scope, etwa final-invoices.write.

**Schnittstelle TraCS.** Das Screening für die Schweiz und Tschechien läuft über TraCS. Die Ergebnisse wertet oneSCM anhand der Felder matchFound, wasGoodGuy und wasBadGuy aus. Bei allen drei Werten „false“ liegt kein Treffer vor, und der Geschäftsvorgang läuft weiter. matchFound „true“ mit wasBadGuy „true“ und wasGoodGuy „false“ ist ein Treffer, der den Vorgang stoppt. matchFound „true“ mit wasGoodGuy „true“ ist kein Treffer. Bei matchFound „true“ ohne weitere Entscheidung bindet ein Clearer das Ergebnis im TraCS-Frontend ein. Die endgültige Klärung erfolgt über den Push-Back-Endpunkt. Den GET-Endpunkt für die Abfrage des finalen Clearing-Status verwendet oneSCM mit der cusAebCheckID aus der Antwort auf den POST-Aufruf.

**Market Playground.** Der Market Playground ist eine Demo- und Testumgebung für das HQ-Rollout-Team und Marktvertreter von Rollout-Kandidaten. Er verhält sich wie der deutsche Markt und nutzt dessen Schnittstellen, technisch und datenseitig aber getrennt. Flat Files erhalten eigene Namen und Kennungen und liegen an einem dedizierten S3-Speicherort. Intern speichert der Playground seine Daten in einem eigenen Tenant.

**Ergebnis und Systemstatus.** Eine erfolgreich verarbeitete Schnittstelle erzeugt einen Eintrag in der Ausführungshistorie des Jobs und einen Status am betroffenen Datensatz. Fehler erscheinen im jeweiligen Fehlerbereich oder in der Datadog-Protokollierung, siehe nächster Teil.

**Import der Rückmeldedatei i156.** Die Datei i156 enthält Schadenfälle und Kostendetails von VEGA. oneSCM übernimmt pro Schadencode die Beträge aus dem Satz RC20: den Nettowert für Arbeit, Material, Fremdleistungen und Händleraufwand. Der Netto-Gesamtbetrag ist die Summe dieser vier Werte, der Brutto-Gesamtbetrag entspricht dem Netto-Gesamtbetrag. Händler- und Marktnamen bezieht oneSCM aus dem Dealership Management. Den Aufruf an GSSN für diese Angaben gibt es nicht mehr.

Wird ein Schadenfall mit einer neueren Entscheidungsnummer vollständig abgelehnt, importiert oneSCM ihn und aktualisiert die ältere Version. Bei einem vollständig abgelehnten Schadenfall enthalten die Sätze RC10 und RC20 nur Beträge von 0.

Beim Import prüft oneSCM jeden Datensatz. Als Fehler gelten eine nicht übereinstimmende FRD, eine Kilometereinheit, die von der Einheit des Automotive-Objekts abweicht, eine Kombination aus Vertragsnummer und FIN, die nicht passt, eine Teilemenge und Anzahl der Positionen, die nicht größer als 0 ist, und Total service relevant costs, die nicht größer als 0 sind. Der Datensatz gilt dann als Fehler, der Schadenfall wird übersprungen und eine E-Mail geht an das Market-Operation-Team. Alle Fehler und Warnungen protokolliert oneSCM in Datadog mit der Zeilennummer, damit der Schadenfall eindeutig zu finden ist.

**Wiederholung und Circuit Breaker.** Die Dienste nutzen Wiederholungen (Retry) und einen Circuit Breaker auf Basis von Resilience4j, soweit dies für den jeweiligen Dienst zutrifft. Für die Clients der nachgelagerten Dienste im Edge Service sind Timeouts, Wiederholungen und Circuit Breaker vorgesehen. Ein langsamer oder nicht verfügbarer Dienst führt dann zu einer zeitlich begrenzten Fehlermeldung statt zu einer hängenden Anfrage. Den Stand dieser Umsetzung erfasst der Klärungsbedarf.

**Batch-Fehler und Wiederanlauf.** Ein Batch-Job, der fehlschlägt oder abgebrochen wird, löst eine Benachrichtigung aus. Die Beschreibung steht in Abschnitt 19.18. Jobs, deren Instanz heruntergefahren wurde, schließen korrekt ab und verbleiben nicht im Status „STARTED“. Der Job E169 und der Job E174 bleiben nicht im Status „Started“. Der CFDMBatch startet nicht doppelt, solange eine Instanz läuft. Für eine Sammelrechnung über unterschiedliche Verträge funktioniert die Erstellung. Ein fehlgeschlagener Job lässt sich über „Run Now“ erneut starten.

**Kafka-Nachrichten und Reporting.** Beim Versand von Rechnungen an das Reporting sendet oneSCM Kafka-Nachrichten in Blöcken. Die Rechnungsfilter-API berücksichtigt den Rechnungstyp, da mehrere Rechnungen dieselbe ID tragen können. Die Interface-Datei E169 für den Typ ESUB enthält den Kundennamen im Feld PTXT01.

**Ergebnis und Systemstatus.** Eine erfolgreich verarbeitete Schnittstelle erzeugt einen Eintrag in der Ausführungshistorie des Jobs und einen Status am betroffenen Datensatz. Fehler erscheinen im jeweiligen Fehlerbereich der Fachmaske oder in der Datadog-Protokollierung. Übersprungene Schadenfälle melden sich über die E-Mail an das Market-Operation-Team.

**Besonderheiten je Sparte und Markt.** Die Schnittstellen für Online-Vertrieb und Leasing gelten für Vans und Pkw über die Division im Request. Die Dateien für SWT und CoFiCo beschreibt Abschnitt 19.21. Der Market Playground nutzt die deutschen Schnittstellen in einem getrennten Tenant.

**Hinweise.** Die Batch-Jobs der Fachdomänen beschreibt jeweils das Unterkapitel der Domäne, etwa 19.12 für CoFiCo, 19.14 für NEMESIS und 19.9 für VEGA. Die Dateiwege und Ordner beschreibt Abschnitt 19.21. Für Partner gelten die Konventionen des Edge Service, die der Klärungsbedarf erfasst.

**Fehlerbehebung.** Schlägt ein Batch-Job fehl, starten Sie ihn über „Run Now“ neu, sobald die Ursache behoben ist. Bei einem Job, der nicht mehr endet, nutzen Sie „Stop“. Die Ausführungshistorie zeigt den Status „fehlgeschlagen“ oder „gestoppt“. Ist ein Schadenfall in der i156-Datei nicht importierbar, prüfen Sie die Meldung in Datadog anhand der Zeilennummer. Edge-Fehler mit den Codes 403, 404 oder 500 entsprechen den Fehlerursachen, die der Partner nachvollziehen kann.
Quellen: Batch 514.1, 512.1, 514.2, 534.1, 513.2, 515.1, 532.2, 527.1, 533.2, 520.1, 518.1, 524.2, 1253.2, 1095.2, 1107.5, 1113.5, 1027.3, 1079.6, 1081.5, 1100.4, 1111.5, 1096.5, 1082.4, 1092.3, 93.1, 771.4, 184.1, 184.4, 196.1, 205.2, 208.2, 208.4, 1310.4, 1180.1, 7.6, 855.3, 796.3, 714.6, 716.3, 795.5, 819.4, 1068.7, 1069.7, 297.1, 565.3, 565.4, 519.10, 1299.2, 667.4, 251.6, 223.4, 1070.7

## 19.23 Architekturregister und offene Nachweise

**Zweck.** Dieser Abschnitt soll die Nachweise zur Architektur bündeln, die für Prüfungen und Freigaben verwendet werden. Das Material enthält für dieses Unterkapitel nur einen Abschnitt, der die Benachrichtigungsfunktion beschreibt. Ein Architekturregister mit Nachweisen liegt im Material nicht vor.

**Ergebnis und Systemstatus.** Die Benachrichtigungsfunktion zeigt das Glockensymbol in der Navigationsleiste mit der Anzahl offener Benachrichtigungen. Die Anzahl zählt bis 9, darüber erscheint „9+“. Ein Klick öffnet das Benachrichtigungscenter auf der rechten Seite. Benachrichtigungen mit einer offenen Aktion sind mit einem blauen Punkt markiert. Erledigte Benachrichtigungen erscheinen nicht mehr.

**Hinweise.** Die Funktion ist in Abschnitt 19.18 ausführlich beschrieben. Der Stand des Architekturregisters und der offenen Nachweise erfasst der Klärungsbedarf.

**Fehlerbehebung.** Erscheint die Glocke ohne Eintrag, prüfen Sie, ob die Benachrichtigungen bereits durch eine Aktion erledigt sind.

Quellen: Batch 446.2

## 19.24 VeDoc: Einzelsteckbrief

**Zweck.** VeDoc liefert Fahrzeugdaten für Vertragsberechnung und Produktauswahl. Dieser Abschnitt beschreibt die Kraftstoffart, den Ablauf bei Bestellnummern ohne Fahrgestellnummer in VeDoc und die Prüfung des Erstzulassungsdatums.

**Voraussetzungen.** Für Bestellnummern der Typen GO, AFAB, VERSO und OTR liegt eine Fahrgestellnummer in den Bestellnummerdaten vor. Die Fahrzeugdaten stammen aus VeDoc.

**Ablauf.**

1. Die Kraftstoffart des abgefragten Fahrzeugtyps ermittelt oneSCM, speichert sie und übermittelt sie bei der Bereitstellung von Produkten und Preisen an Stream 2.
2. Liegt zu einer Bestellnummer eine Fahrgestellnummer vor, die in VeDoc noch nicht vorhanden ist, zeigt oneSCM die Produkte an. Vor der Aktivierung prüft der Vertrag die Kompatibilität von Produkt und Preis.
3. Das übermittelte Erstzulassungsdatum prüft oneSCM gegen die Angabe in VeDoc zur übergebenen FIN. Stimmt das Datum überein, fährt oneSCM fort. Existiert in VeDoc kein Datum, speichert oneSCM das vom Kunden angegebene Datum und fährt fort.
4. Weicht das Datum in VeDoc vom übermittelten Datum ab, verwendet oneSCM das Datum des Systems und meldet die Abweichung an die Fachabteilung Operations. Dort wird das Datum manuell geprüft.

**Ergebnis und Systemstatus.** Das Erstzulassungsdatum im Vertrag stammt aus VeDoc oder ist vom Kunden angegeben. Bei einer Abweichung gilt das Systemdatum, bis die Fachabteilung entschieden hat.

**Besonderheiten je Sparte und Markt.** Die Prüfung des Erstzulassungsdatums gilt für die Fahrzeugdaten aus VeDoc in allen Märkten, in denen oneSCM VeDoc nutzt.

**Hinweise.** Die Kraftstoffart wird an Stream 2 übergeben. Die Abfragen für OTR-Fahrzeuge beschreibt Abschnitt 19.5. Die Abgleichsjobs für VeDoc beschreibt Abschnitt 19.4. Der Stand der Anpassungen zum Erstzulassungsdatum erfasst der Klärungsbedarf.

**Fehlerbehebung.** Meldet oneSCM eine Abweichung des Erstzulassungsdatums, prüft die Fachabteilung Operations das Datum manuell. Bis dahin gilt das Systemdatum.

Quellen: Batch 17.4, 1246.4, 1230.4

## 19.25 VERSO/VOM: Einzelsteckbrief

**Material:** keine Quellen in den RAG-Batches.

Zu dieser Schnittstelle liegen keine Abschnitte vor. Die Integration der VerSO-ID über die OTR-Schnittstelle beschreibt Abschnitt 19.18.

Quellen: keine Quellen in den RAG-Batches

## 19.26 oneDoC: Einzelsteckbrief

**Material:** keine Quellen in den RAG-Batches.

Zu diesem Unterkapitel liegen keine Abschnitte vor.

Quellen: keine Quellen in den RAG-Batches

## 19.27 Xentry: Einzelsteckbrief

**Material:** keine Quellen in den RAG-Batches.

Zu diesem Unterkapitel liegen keine Abschnitte vor.

Quellen: keine Quellen in den RAG-Batches

## 19.28 MBFS Bundling: Einzelsteckbrief

**Material:** keine Quellen in den RAG-Batches.

Zu diesem Unterkapitel liegen keine Abschnitte vor.

Quellen: keine Quellen in den RAG-Batches

## 19.29 POS-Kanäle: Einzelsteckbrief

**Material:** keine Quellen in den RAG-Batches.

Zu diesem Unterkapitel liegen keine Abschnitte vor.

Quellen: keine Quellen in den RAG-Batches

## 19.30 Versicherer: Einzelsteckbrief

**Material:** keine Quellen in den RAG-Batches.

Zu diesem Unterkapitel liegen keine Abschnitte vor.

Quellen: keine Quellen in den RAG-Batches

## 19.31 Lieferanten: Einzelsteckbrief

**Zweck.** Dieser Abschnitt beschreibt den automatischen Abruf der Lieferfristen aus den Vorsystemen GO und AFAB. Die Lieferantenstammdaten sind nicht Teil dieses Abschnitts.

**Rollen.** Der HQ-Administrator richtet die Batch-Jobs ein und terminiert sie. Die Händler erhalten die Information zum Liefertermin.

**Ablauf.** Im Bereich Vertragskalkulation ruft oneSCM den voraussichtlichen Liefertermin eines Fahrzeugs aus den Vorsystemen ab und meldet ihn an das Vertragssystem CONTRACT. Der Abruf erfolgt zeitgesteuert über Batch-Jobs. Die Jobs heißen „GetDeliveryDateGlobalOrder“ für GO und „GetDeliveryDateAFABOrder“ für AFAB. Die Details zu AFAB beschreibt Abschnitt 19.3, die Details zu GO Abschnitt 19.2.

**Ergebnis und Systemstatus.** Der Liefertermin steht im Vertrag bereit, sobald der Job einen Wert aus dem Vorsystem erhält. Ohne Wert meldet das System keinen Termin.

**Besonderheiten je Sparte und Markt.** GO gilt für Pkw, AFAB für Vans.

**Hinweise.** Der Abruf des Liefertermins erfolgt ohne manuelles Zutun. Die Terminierung der Jobs folgt den bestehenden Regeln für Batch-Jobs, siehe Abschnitt 19.22. Die Anlage von Lieferantenstammdaten über die Kreditorennummer ist im Klärungsbedarf erfasst.

**Fehlerbehebung.** Fehlt ein Liefertermin, prüfen Sie, ob das Vorsystem einen Wert liefert. Der Job versucht es bei den nächsten Läufen erneut.

Quellen: Batch 1178.1, 617.2
