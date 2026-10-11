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

Der Wert in der Satzart RC05 an Position 260, das sogenannte Return Flag, richtet sich nach dem Ablaufkriterium des Produkts. Hat das Produkt das Ablaufkriterium TIME, steht bei jeder Aufnahme des Vertrags in eine i155 der Wert 1. Hat das Produkt das Ablaufkriterium Time & Mileage, Mileage oder Contingent, steht dort der Wert Stern. Die Regel gilt über den gesamten Lebenszyklus des Vertrags, also nach Generierung, Aktivierung, Suspendierung, Reaktivierung, vorzeitiger Beendigung und Verlängerung.

**Branchenschlüssel.** Bei einem Vertragsangebot für einen Gewerbekunden wählen Sie die Branche (Industry Type) aus einer Auswahlliste. Die Auswahl gilt auf Vertragsebene und erscheint in der Oberfläche und in den Dokumenten an der Stelle des Platzhalters „Industry“. Bei der Aktivierung und Erzeugung der i155 übernimmt das System den Code der Branche in die Satzart RC05 an den Positionen 266 bis 269, linksbündig und mit einem nachfolgenden Leerzeichen. Die Liste umfasst die Codes 001 bis 049 sowie den Code 099 für „FleetSite - vehicle“. Ist als Branche „Not Relevant“ gewählt, steht an dieser Stelle der Wert vier Sterne.

**Ausschluss von Deckungen.** Eine Deckung mit dem Kennzeichen „Not Needed for VEGA“ wird nicht in die i155 aufgenommen. Bei der Vertragsaktivierung erhält Revenue dennoch alle Deckungen, unabhängig von diesem Kennzeichen. Die i155 enthält also ausschließlich die für VEGA relevanten Deckungen, während Revenue den vollständigen Deckungsumfang erhält.

**Kostenverantwortung für Deckungen.** Für jede Deckung legen Sie in der Produktkonfiguration auf der Seite „Coverages“ fest, wer die Kosten trägt. Zur Auswahl stehen „Mercedes-Benz“, das standardmäßig vorausgewählt ist, „Customer“ und „Supplier“. Bei „Supplier“ ist ein Lieferant als Pflichtfeld anzugeben. Mit der Option „Exclude from Vega“ nehmen Sie eine Deckung von der i155 aus. Ist die Anbindung an die Lieferantendatenbank SDB4 eingerichtet, übernimmt das System die Lieferantendaten aus Stream 4 des Lieferantenmanagements. Ist die Anbindung nicht eingerichtet, geben Sie Name und Kreditorennummer des Lieferanten manuell ein. Kostenstelle, Lieferantendaten und das Kennzeichen werden im Payload für Stream 2 bereitgestellt. Die Konfiguration der Deckungen selbst beschreibt Kapitel 14.

**Statusänderungen über die Schnittstelle.** Konsumierende Systeme können den Status eines Servicevertrags über eine Schnittstelle aktualisieren. Folgende Wechsel sind zulässig: von „created“ zu „confirmed“, von „created“ zu „declined“, von „confirmed“ zu „active“, von „active“ zu „suspended“ und von „suspended“ zu „active“. Statuswechsel, die im Vertragsstatusmodell nicht definiert sind, lehnt das System ab, und das aufrufende System erhält eine Fehlermeldung. Jede Statusänderung wird in der Vertragshistorie dokumentiert. Für VEGA relevant sind der Wechsel zu „active“ und der Wechsel zu „suspended“. Diese Änderungen überträgt die i155. Die Status „Waiting for Activation“ und „Active“ setzt ausschließlich das Backend. API-Benutzer können diese beiden Status nicht beeinflussen.

**Verlängerung über MBLD und den Edge Service.** MBLD steuert Langzeitverlängerungen über eine Schnittstelle ohne Benutzeroberfläche. Der Ablauf umfasst folgende Schritte:

1. MBLD fragt über den Edge Service den Kontostand zu einer Vertragsnummer ab und prüft, ob Vertragsanpassungen zulässig sind. Der Vertrag muss im Vertriebskanal „Leasing“ den Status „Aktiv“ haben.
2. MBLD fragt beim Product-Microservice ein Preisangebot für Laufleistung und Laufzeit an. Die Anfrage enthält einen Offset und optional ein Wirksamkeitsdatum. Die Antwort enthält den Gesamtpreis, den Intervallpreis und den Preis je Mehr- oder Minderkilometer.
3. Ist die Konfiguration nicht passend, sendet MBLD eine neue Anfrage mit angepassten Parametern. Ist sie passend, sendet MBLD die Anwendung der Langzeitverlängerung. Der Contract-Microservice legt die Konfiguration an und bestätigt sie mit den aktualisierten Preisangaben.
4. Lehnt der Endkunde das Angebot ab, verwirft der Contract-Microservice die Konfiguration. Stimmt der Endkunde zu, übernimmt der Contract-Microservice die neue Konfiguration auf Vertragsebene, erzeugt die i155 und benachrichtigt VEGA, den Revenue-Microservice und NEMESIS.

Die Berechnung des Offsets beschreibt Abschnitt 19.11.

**Kurzfristige Verlängerung.** Der Edge Service stellt die kurzfristige Verlängerung per API bereit. MBLD übergibt die Servicevertragsnummer und die Anzahl der Verlängerungsmonate. Der Contract-Microservice prüft, ob der Vertrag den Status „Aktiv“ hat, das Produkt für die kurzfristige Verlängerung konfiguriert ist und die Einstellungen für Division und Markt sowie die Preis- und Berechtigungsregeln erfüllt sind. Die Summe aller kurzfristigen Verlängerungen darf sechs Monate nicht überschreiten. Die maximal zulässige Laufzeit darf ebenfalls nicht überschritten werden. Lehnt das System die Anfrage ab, nennt die Antwort die Gründe, etwa einen ungültigen Vertragsstatus, eine überschrittene Verlängerungsdauer oder eine nicht unterstützende Produktkonfiguration. Bei einer zulässigen Verlängerung aktualisiert das System den Zahlungsplan und die Vertragswerte für Laufzeit, Enddatum, Laufleistung und Preis. Revenue und NEMESIS erhalten die Daten. Die Antwort an MBLD enthält das neue Vertragsende, die neue Laufzeit, die Gesamtlaufleistung, die monatliche Rate und den Gesamtpreis. Eine E-Mail-Benachrichtigung entfällt.

**Verlängerung nach Signatur.** Nach dem Versand zur Signatur zeigt die Vertragsdetailansicht den Banner „In Progress“. Sobald das Dokument signiert und die Signatur durch DSS validiert ist, werden die Verlängerungsdetails auf den Servicevertrag übertragen und die Vertragsdaten aktualisiert. Anschließend erzeugt das System eine i155, und die Services Revenue und NEMESIS werden benachrichtigt.

**Kontingentprodukte.** Das System rechnet die Leistungen eines Kontingentvertrags über die Erlösverwaltung nach. Der Ablauf verläuft in folgenden Schritten:

1. Die Kostenverwaltung importiert die Schnittstelle i156 und prüft, ob ein Schaden oder eine Forderung als Kontingent zählt.
2. Wird eine Forderung als kontingentfähig erkannt, erhält das Vertragsmanagement eine Benachrichtigung. Es zieht die von der Erlösverwaltung übermittelten Werte von der Anzahl der Kontingentleistungen im Vertrag ab und zeigt die verbleibenden Leistungen an.
3. Die i155 enthält in der Satzart RC20 die ursprüngliche Anzahl der Leistungen an den Positionen 165 bis 169, die Anzahl der genutzten Leistungen an den Positionen 170 bis 174 und an Position 175 den Wert 1.
4. Sind alle Leistungen erbracht, endet der Vertrag automatisch mit dem Status „Abgelaufen“ (VEGA-Code 003) und dem Grund „Kontingent“. Anschließend erzeugt das System eine i155.
5. Ohne offene Abgleichsprüfung und ohne Schlussrechnung setzt das System den Vertrag auf „Geschlossen“ (VEGA-Code 004) und übermittelt eine i155 mit dem neuen Status.

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

**Besonderheiten je Sparte und Markt.** Die Übertragung an VEGA gilt für den deutschen Markt. Die Branchencodes und der Ablauf für Gewerbekunden gelten für Verträge mit Gewerbekunden. Die Ordnerstruktur für VEGA je Markt beschreibt Abschnitt 19.21.

**Hinweise.** Fällt die Datei i155 aus, erhält VEGA die zuletzt vorgenommenen Vertragsänderungen nicht. Dies kann die Abrechnung und die Geltendmachung von Ansprüchen aus den Verträgen beeinflussen. Die Historie der VEGA-Daten im Vertrag beschreibt Kapitel 10.8. Die Anzeige der Vertragshistorie im Bereich „History“ enthält für jede Änderung das geänderte Objekt, das Attribut, den alten und neuen Wert, die Art der Änderung, das Datum und den Bearbeiter. Die Datenquelle ist oneSCM.

**Fehlerbehebung.** Ist die Datei i155 nicht verfügbar, prüfen Sie zuerst den Status des Jobs „Vega i155“ und das Transferprotokoll. Ein fehlgeschlagener Lauf lässt sich über „Run Now“ erneut starten. Erscheinen bei einer Verlängerung Fehlermeldungen, enthält die Antwort den Grund der Ablehnung.

Quellen: Batch 779.1, 530.1, 783.7, 841.1, 843.5, 851.1, 842.1, 862.1, 934.1, 947.1, 927.1, 1161.1, 1040.3, 1026.2, 778.3, 966.1, 744.5, 692.2, 730.4, 742.4, 626.3, 913.1, 594.3, 856.5, 1217.3, 1274.4, 1255.4, 1246.7, 865.1
