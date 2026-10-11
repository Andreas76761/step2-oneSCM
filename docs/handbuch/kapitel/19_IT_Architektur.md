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

**Material:** PLATZHALTER_19_3
