# Batch 1310 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 27 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise: Architektur**

**Sicherheitsprüfungen mit SecHub**

SecHub wurde in oneSCM integriert und eingeführt. Zuvor stand die Lösung lediglich als Vorlage zur Verfügung und wurde nur explorativ für den Security Service genutzt; zudem fehlten einzelne Komponenten. Künftig werden bei einem Pull Request in den oneSCM-Repositories, einschließlich DevOps und IAC, zusätzliche Quality Gates ausgeführt. Das erste Quality Gate ist ein Secrets Scan: Wird ein Fund gemeldet, schlägt der Pull Request fehl. Das zweite Quality Gate wertet den Source Code Scan von SecHub aus. Bei kritischen oder hohen Funden („rote“ Funde) schlägt der Pull Request ebenfalls fehl. Bei „gelben“ Funden wird ein Jira-Ticket erstellt, der Pull Request wird jedoch nicht blockiert.

Als dritte Prüfung ist vorgesehen, nach der Bereitstellung auf INT bzw. PREPROD (noch abzustimmen) einen DAST Scan auszulösen. Dieser umfasst den AjaxSpider zum Auffinden von Seiten in Ajax-lastigen Webseiten, den Spider zum Entdecken und Aufrufen neuer URLs, einen passiven Scan, der Webanwendungen prüft, ohne sie anzugreifen, sowie einen automatischen aktiven Scan, der Sicherheitslücken prüft und Angriffe durchführt und nur für eigene Webanwendungen eingesetzt werden darf. Rote Funde erzeugen ein Jira-Ticket mit hoher Priorität (Major) sowie eine Benachrichtigung; sie sollen vor dem Produktivgang geprüft und behoben werden. Gelbe Funde erzeugen ebenfalls ein Jira-Ticket. Außerdem wurden die Security Service BOM erweitert und die Version des Security Clients aktualisiert.

**Marktkonfiguration**

Im Reiter „Market Configuration“ wurden die Felder „First Name“ und „Last Name“ entfernt; die Vorlage wird entsprechend angepasst, ohne diese Felder abzufragen. Bei den Timern und Erinnerungen gilt: Die Gültigkeit des DSS-Signaturlinks (in Tagen) muss der Angebotsgültigkeit entsprechen. Weiterhin gibt es die Wartezeiten für die CAS-Antwort, die SEPA-Validierung und die SAP-Debitorennummer (jeweils in Tagen). Ein Vertrag kann nur aktiviert werden, wenn CAS, SEPA und SAP in Ordnung sind. Liegt bis zum Ablauf der Angebotsgültigkeit keine Bestätigung vor, wird der Vertrag auf „Rejected“ gesetzt. Diese Änderung wurde im Frontend und im Backend umgesetzt.

**Batch-Jobs und Monitoring**

Es gibt ein neues Dashboard, auf dem alle Läufe von Batch-Jobs überwacht werden können. Dafür wurde eine API zum Abruf aller Batch-Job-Läufe geschaffen. Sie ist nach allen Feldern sortierbar, paginiert und über das Filterkriterium „jobName“ durchsuchbar. Sie liefert eine Liste von BatchDashboardEntryDto-Objekten. Zudem wurde die Prüfung laufender Jobs verbessert; laufende Jobs werden nun anhand der Execution-ID statt der Instance-ID verifiziert.

**Import, Fehlermeldungen und Schnittstellen**

Die Performance beim Import von Damage Codes wurde verbessert. Die Fehlerbehandlung beim I156-Import ist besser geworden, und die Meldung für den Fall, dass ein Händler in GSSN nicht gefunden wird, wurde verständlicher gestaltet. Beim Versand von Rechnungen an das Reporting werden Kafka-Nachrichten nun in Blöcken (Chunks) gesendet. Die Rechnungsfilter-API berücksichtigt jetzt den Rechnungstyp, da mehrere Rechnungen dieselbe ID haben können und dies zuvor zu Inkonsistenzen führte. Außerdem fehlte beim Interface E169 ESUB der Kundenname in PTXT01; dies wurde behoben. Die End-to-End-Tests im Bereich Revenue-Management wurden korrigiert.

**Bedienung und Oberfläche**

Das System entfernt nun führende Leerzeichen (TRIM) bei Eingaben. Die Navigation im Kopfbereich wurde neu angeordnet: Contract Generation, Contract Management, Customer Management, Product Management und Admin Section. Behoben wurden außerdem eine fälschlich angezeigte Fehlermeldung („Yikes something went wrong there!“) nach erfolgreichem Login, ein nicht auf allen Seiten sichtbarer Footer sowie ein Problem, bei dem ein Entitlement-Update den Cache nicht leerte.

**Lokale Entwicklungsumgebung**

Für die lokale Umgebung gibt es Verbesserungen: Der S3-Service-Mock wurde um Funktionen (Lambda-Funktion) erweitert, Wiremock steht für die Schnittstellen der lokalen Umgebung bereit, und Anwendungen, die in IntelliJ gestartet werden, lassen sich mit der Docker-Umgebung integrieren, um sie einfacher zu debuggen. Zudem wurden Benutzer für jede Rolle in der lokalen Umgebung bereitgestellt.