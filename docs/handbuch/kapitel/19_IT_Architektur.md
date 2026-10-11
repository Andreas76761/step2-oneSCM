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

**Händlerwechsel.** Wechselt ein Autohaus den Eigentümer, passt oneSCM die zugehörigen Serviceverträge an. Ein zeitgesteuerter Batch-Job prüft regelmäßig, ob sich Eigentumsverhältnisse geändert haben. Wird eine Änderung erkannt, sendet der Customer-Microservice ein Ereignis mit Händlername, Händleradresse, bisheriger und neuer GS-Outlet-ID, SAP-Debitorennummer und Kreditorennummer an den Contract-Microservice. Der Contract-Microservice ermittelt alle Serviceverträge der bisherigen GS-Outlet-ID, sowohl im Angebot als auch in der Verwaltung, und überschreibt Vertragshändler, Händlername und Händleradresse. Die Felder des Verkäufers bleiben unverändert. Erfolgt die Aktualisierung während der Widerrufsfrist, erhält zusätzlich der Revenue-Microservice ein Benachrichtigungsereignis. Im Szenario der übrigen Märkte bleibt die GSSN-Outlet-ID gleich, die GC-Company-ID ändert sich. SAP-Debitorennummer und Kreditorennummer werden entfernt, und Market Operations trägt die SAP-Debitorennummer erneut ein. Alte und neue Werte erscheinen in der einklappbaren Historientabelle.

**Produktinformationen im Vertrag.** Bei der Erzeugung eines Vertrags aus einem Vertragsvorschlag übernimmt oneSCM alle erforderlichen Informationen aus dem Produkt in den Vertrag. Der Vertrag bleibt dadurch auch dann verarbeitbar, wenn das Produkt im Product-Microservice später geändert oder gelöscht wird, etwa beim Ablauf oder bei einer Kündigung. Bei der Vertragsprüfung muss das zugewiesene Profil mit dem Produkt des Vertrags verknüpft sein.

**Vertragserstellung als gemeinsame Verarbeitungskette.** Das Material beschreibt die Erstellung von Verträgen über Standardfunktionen, Massenerstellung und Leasing als eine gemeinsame Verarbeitungskette. Sie prüft zuerst die Eingaben, lädt danach externe Daten und baut einen unveränderlichen Vertragsentwurf auf. Anschließend speichert sie den Vertrag einmal, erzeugt die Dokumente und veröffentlicht zuletzt die Ereignisse. Die sechs Erstellungsvarianten sind Fahrgestellnummer, Build to Stock, Build to Order, Deal-ID, Modellcode und MBLD. Die Massenerstellung setzt nach einem Fehler dort fort, wo sie unterbrochen wurde. Anfrage- und Antwortformate der externen Schnittstelle bleiben unverändert. Die Einordnung dieser Beschreibung als heutiges Verhalten ist im Klärungsbedarf erfasst.

**Ergebnis und Systemstatus.** Nach einer erfolgreichen Verarbeitung enthält der Vertrag die Coverage-IDs, den Vertragstyp und das Return Flag. Die i155 steht im Bereich „Batch Job“ zum Download bereit, sobald der Job gelaufen ist. VEGA bestätigt die Verarbeitung im Transferprotokoll.

**Besonderheiten je Sparte und Markt.** Die Schnittstelle i155 ist für den deutschen Markt beschrieben. Eine i155-Datei existiert zusätzlich für andere Märkte. Die Branchencodes gelten für Verträge mit Gewerbekunden. Die Ordnerstruktur für VEGA je Markt beschreibt Abschnitt 19.21.

**Hinweise.** Fällt die Datei i155 aus, erhält VEGA die zuletzt vorgenommenen Vertragsänderungen nicht. Dies kann die Abrechnung und die Geltendmachung von Ansprüchen aus den Verträgen beeinflussen. Die Historie der VEGA-Daten im Vertrag beschreibt Kapitel 10.8. Die Anzeige der Vertragshistorie im Bereich „History“ enthält für jede Änderung das geänderte Objekt, das Attribut, den alten und neuen Wert, die Art der Änderung, das Datum und den Bearbeiter. Die Datenquelle ist oneSCM.

**Fehlerbehebung.** Ist die Datei i155 nicht verfügbar, prüfen Sie zuerst den Status des Jobs „Vega i155“ und das Transferprotokoll. Ein fehlgeschlagener Lauf lässt sich über „Run Now“ erneut starten. Erscheinen bei einer Verlängerung Fehlermeldungen, enthält die Antwort den Grund der Ablehnung.

Quellen: Batch 779.1, 530.1, 783.7, 841.1, 843.5, 851.1, 842.1, 862.1, 934.1, 947.1, 927.1, 1161.1, 1040.3, 1026.2, 778.3, 966.1, 744.5, 692.2, 730.4, 742.4, 626.3, 913.1, 594.3, 856.5, 1217.3, 1274.4, 1255.4, 1246.7, 865.1

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

Der Löschkennzeichen-Status (DeletionIndicator) des Finanzsystems, im Material DeletionIndicator genannt, ist führend. Hat das Kennzeichen den Wert „true“, zeigt oneSCM „Marked for Deletion“ an, unabhängig von weiteren Status. Andernfalls zeigt oneSCM „Blocked“. Bei Firmenkunden wertet oneSCM das Kennzeichen ebenfalls aus. Für inaktive Kunden löscht oneSCM die SAP- und SEPA-Informationen und hält dies in der Kundenhistorie fest. Der FI-Status wird für diese Kunden nicht mehr synchronisiert. Legen Sie einen neuen Servicevertrag an, prüft oneSCM die SAP- und SEPA-Daten erneut. Änderungen im Finanzsystem sind damit zum Zeitpunkt des neuen Vertrags berücksichtigt.

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

**FI-Konfiguration.** HQ-Administratoren pflegen die bisher fest hinterlegte Konfiguration des Finanzsystems selbst. Die Seite finden Sie unter Admin, Market Settings, External System Settings und FI-Configuration Feature. Sie steht nur für SWT- und CoFiCo-Märkte zur Verfügung. Die Werte gelten für den Export von Kundendaten über die API und für den Export von Rechnungen.

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
3. oneSCM klassifiziert die Fehler nach Meldungsnummer und zeigt sie unter der zugehörigen Domäne an. Dem Bereich Contract sind Meldungen zu fehlendem oder ungültigem Ländercode, fehlendem Vertrag, abweichender FIN, fehlender Vertragslaufzeit, nicht gefundenem Vertragsstamm, einem Vertragsende vor der Migration bei aktivem Status und einem zukünftigen Vertragsbeginn zugeordnet. Der Bereich Revenue zeigt, dass für einen Vertrag keine Umsatzaktualisierung erfolgt ist. Im Bereich Cost erscheint die Meldung, dass Ist-Kosten für das Abschlussdatum nicht geladen wurden. Meldungen, die ausschließlich die Kostenverteilung im Financial Management betreffen, berücksichtigt oneSCM nicht.

**Fehlerbehandlung im Admin-Bereich.** Die Suche nach fachlichen Fehlern bietet die Kriterien First Incident als Datum, Contract Number als Textfeld mit unscharfer Suche ohne Unterscheidung von Groß- und Kleinschreibung, Status als Mehrfachauswahl und Error code. Mit „Search“ füllt sich der Ergebnisbereich, „Cancel“ verwirft alle Änderungen. Änderungen an den Filterfeldern wirken sich erst nach „Search“ auf die Ergebnisse aus.

Jeder Fehler steht in einer eigenen Zeile. Eine Auswahl ist nur bei Fehlern mit dem Status „Unresolved“ möglich. Die Spalten zeigen Modification Date, Contract Number, FIN, Error code, Reason For Error, Occurrence, First Incidence und Status. Standardmäßig sortiert die Tabelle nach Modification Date, und jede Seite zeigt 10 Einträge, wählbar sind 10, 20, 30, 40 und 50.

Die Aktion „Resend“ sendet alle vier Ereignisse Customer, Contract, Revenue und Cost mit den aktuellen Daten erneut. Die Aktion „Acknowledge“ dient dem Fall, dass der Fehler keine manuelle Korrektur zulässt und der Benutzer ihn nicht beheben kann.

Die Fehlerprotokolle liefert NEMESIS bislang monatlich als Excel-Datei über CFT. oneSCM liest die Datei aus und zeigt den Inhalt an. Das Material beschreibt zudem die tägliche Bereitstellung der Protokolle. Den Stand dieser Umstellung erfasst der Klärungsbedarf.

**Fehlerbehandlung und erneutes Senden bei der historischen Synchronisation.** Im Sync-Verlauf öffnet die Aktion „View Details“ den Dialog „Sync Failure Details“ mit den Vertragsnummern, für die Ereignisse fehlgeschlagen sind. Über „Retrigger“ gelangen Sie zu „Nemesis Errors“, wo das fehlgeschlagene Ereignis unter seinem Ereignistyp steht. Nach der Behebung der Ursache senden Sie es erneut. Der Fehlertyp lautet „Infrastructure“ oder „Functional“.

**Historische Synchronisation.** Benutzer mit der Berechtigung „Market Settings“ synchronisieren historische Daten zwischen oneSCM und NEMESIS. Die Funktion deckt alle Ereignistypen ab: Kunde, Vertrag, Umsatz und Kosten. Sie finden sie unter Finance Management, Nemesis, mit den Reitern „Nemesis Errors“, „Historical Data Sync“ und „Sync History“.

1. Im Reiter „Historical Data Sync“ geben Sie Vertragsnummern manuell in das Textfeld ein, getrennt durch Komma oder Zeilenumbruch. Alternativ laden Sie eine Datei im Format .xls hoch. oneSCM prüft Dateityp und Format der Vertragsnummern und entfernt doppelte Einträge.
2. Wählen Sie die Ereignistypen. Standardmäßig sind alle ausgewählt, mindestens einer bleibt ausgewählt. Bei Kosten ist mindestens eine der Optionen VEGA oder Non-VEGA aktiv.
3. Kunden erzeugen je Vertrag ein Ereignis mit den vollständigen Kundenprofildaten. Vertragsereignisse legen den Vertragsstamm an. Für Umsatzereignisse (RevenueSet) verwendet oneSCM die letzte Rechnung mit dem Status „FI Doc Created“, die die kumulierten Werte des Vertrags enthalten soll.
4. Klicken Sie auf „Start Historical Sync“ und bestätigen Sie im Dialog mit „Confirm & Start Sync“. Danach öffnet sich der Reiter „Sync History“ mit dem laufenden Lauf. Brechen Sie den Dialog ab, bleiben Ihre Eingaben erhalten.

Der Reiter „Sync History“ zeigt Datum, Anzahl der Verträge, Ereignistypen, Gesamtzahl der Ereignisse, Dauer und Status. Die Status lauten „Success“ oder „Completed with Errors“. Einzelne Fehler stoppen den Lauf nicht. Die Fehleranzahl steht je Ereignistyp. Nach Abschluss zeigt der Eintrag die Vertragsnummern mit fehlgeschlagenen Ereignissen.

Für Benutzer mit eingeschränkter Sicht gilt: Erneutes Senden und Bestätigen sind bei Nemesis-Fehlern nicht möglich. Die Seite „Historical Data Sync“ ist sichtbar, die Eingabefelder sind deaktiviert. Dieses Verhalten gilt für alle Benutzer mit eingeschränkter Sicht und nicht nur für die Rolle „View only“.

**Fehlerprotokoll und Abgrenzung.** oneSCM liest zusätzliche Meldungsnummern aus der Nemesis-Fehlerdatei, die früher unberücksichtigt blieben. Die Liste der funktionalen Fehler umfasst die Fehler, die oneSCM in den Ereignistypen anzeigt. Die Fehler 83, 250 und 225 sind nicht Teil der Umsetzung, der Fehler 247 gehört in den Contract Master.

**Markt Indien.** Für den Markt Indien gilt der Ablauf des deutschen Marktes für Customer, Revenue, Cost und Contract. Mapping, Statuslogik und Validierungen sind identisch. Abweichend verwendet oneSCM für Indien den Company Code 1414 und den Country Code 82536. Revenue-Ereignisse übermitteln die Werte für Indien. Für Customer-Ereignisse und den Contract-Stammdatensatz gilt dieselbe Funktionsweise.

**Management-Verträge.** Für Management-Verträge sendet oneSCM keine Kunden-, Vertrags-, Umsatz- oder Händlerereignisse an NEMESIS. Die Abhängigkeit zu den Arbeitsströmen für Kunden und Verträge ist im Klärungsbedarf erfasst.

**Ergebnis und Systemstatus.** NEMESIS erhält Ereignisse für Märkte, für die die Option aktiviert ist, und für Produkte, die HQ-Administratoren ausgewählt haben. Fehlerhafte Ereignisse erscheinen in der Fehlerliste, und Sie senden sie nach der Korrektur erneut. Die historische Synchronisation zeigt Status und Fehleranzahl je Lauf.

**Besonderheiten je Markt.** Nemesis-Ereignisse entstehen nur für Märkte, in denen die Option „Allow Nemesis events to be sent“ aktiviert ist. Für Märkte ohne NEMESIS sind die Ereignisse vollständig entkoppelt. Die Anbindung für Südkorea (MBKR) und die Angaben dazu sind im Klärungsbedarf erfasst.

**Hinweise.** Die Datenstruktur der Revenue-Dateien für NEMESIS und die Verarbeitung in der Data Foundation beschreibt Abschnitt 19.19. Die Dateiübertragung über CFT beschreibt Abschnitt 19.21.

**Fehlerbehebung.** Ein Ereignis mit dem Fehler „Functional“ korrigieren Sie in den Stammdaten oder im Vertrag und senden es danach über „Resend“ erneut. Ein Ereignis mit dem Fehler „Infrastructure“ senden Sie nach der Behebung der Ursache erneut, etwa über „Retrigger“ aus dem Sync-Verlauf. Ist eine Meldung nicht manuell korrigierbar, setzen Sie die Aktion „Acknowledge“ ein.

Quellen: Batch 270.1, 263.2, 253.4, 168.1, 191.1, 206.1, 154.2, 229.6, 716.5, 225.3, 225.4, 222.2, 156.4, 183.4, 708.4, 240.2, 251.1, 125.5, 138.1, 144.2, 253.3, 161.3, 163.4, 109.1, 162.2, 145.1, 251.5
