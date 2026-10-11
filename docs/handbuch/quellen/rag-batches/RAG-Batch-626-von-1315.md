# Batch 626 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 29 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung: Neuerungen und Änderungen**

**Händlerdaten im Vertrag**

Auf der Seite für Kunden- und Zahlungsinformationen gibt es einen neuen Abschnitt „Dealer Details". Er wird genutzt, wenn eine Mobilitätsorganisation (MO) einen Servicevertrag im Auftrag eines bestimmten Händlers verkauft. Das Feld für die E-Mail-Adresse akzeptiert nur gültige E-Mail-Formate. Der Händlername und der Ort werden jeweils als Dropdown mit allen möglichen Varianten aus GSSN angeboten, wobei der Ort sich auf den gewählten Händler bezieht. Der Name des Verkäufers wird ausgegraut angezeigt und stammt aus Alice/GSSN. Der Abschnitt gilt ausschließlich auf Vertragsebene, nicht in der Kundenverwaltung. Die Felder werden gegen die geltenden Regeln validiert. Für die Bearbeitung gelten dieselben Regeln wie bei Kunden: In den Status „Waiting for Confirmation" und „In Confirmation" sind keine Änderungen möglich. Änderungen werden an die zuständige Domäne zurückgemeldet und in der Kundenhistorie festgehalten.

**Vereinfachte Suche in der Kundenverwaltung**

Die Kundenverwaltung unterscheidet Privatkunden und Geschäftskunden bereits über zwei getrennte Tabs. Deshalb entfällt das Dropdown „Kundentyp" in den Suchfiltern beider Tabs. Auch das Pop-up „Weitere Filter" wurde entfernt. Die darin enthaltenen Filterkriterien stehen nun direkt auf der Hauptsuchseite für Privat- und Geschäftskunden zur Verfügung. Die Änderung betrifft ausschließlich die Benutzeroberfläche.

**Händlerverwaltung**

Bei der Validierung der Felder in der Händlerverwaltung gelten strengere Regeln. Die SAP-Debitorennummer muss künftig genau 10 Ziffern enthalten, die Vega-ID genau 5 Ziffern. Bisher waren höchstens 10 beziehungsweise 5 Ziffern zulässig. Zusätzlich wurde die Validierung des Ortes in der Händlerverwaltung angepasst. Die Felder Vega-ID und SAP-Debitorennummer müssen außerdem eindeutig sein.

**Namen bei der Vertragserstellung**

Wenn bei der Vertragserstellung Kundendaten in Großbuchstaben eingegeben werden, erscheint nicht mehr fälschlicherweise die Fehlermeldung „Not a valid name. Valid example: John-George Smith". Stattdessen werden alle Namen automatisch in das Standardformat korrigiert und so gespeichert.

**Weitere Korrekturen**

Im Bereich der Vertragsprüfung erscheint neben „Genehmigen/Ablehnen" nun die Schaltfläche „Zu den Verträgen" statt „Zu den Rechnungen". Der Reset funktioniert jetzt auch für den Mercedes-me-Schalter in der Kundenverwaltung. Doppelte Kundeneinträge in der Kundenverwaltung wurden behoben. Die irrtümlich angezeigte Meldung „Modules.CustomerManagement.Subpages.CustomerManagement.." bei der Vertragserstellung erscheint nicht mehr. Die Schaltfläche für Global Collective Invoices ist in der Vertragserstellung nicht mehr bearbeitbar. Außerdem wurde ein Fehler im Batch-Job für den Kundenexport (CustomerExportJob) auf der Integrationsumgebung behoben.

**Noch in Prüfung befindliche Themen**

Für den Umgang mit dem FI-System-Kundenstatus sind folgende Verhaltensweisen vorgesehen, aber noch nicht abschließend geprüft. Der FI-System-Status soll in der Kundenvorschau und auf der Kundendetailseite angezeigt werden. Hat ein bestehender Kunde bei der Vertragserstellung den FI-System-Status „Archived", wird er nicht weiterverwendet, sondern wie ein neuer Kunde behandelt. Er wird in oneSCM angelegt, seine Daten werden zur Anlage an NACOs/oneERP gesendet, und der Vertrag wird erst aktiviert, wenn SAP-Debitorennummer und Lastschriftmandat vorliegen und alle weiteren MO-Prüfungen bestanden sind. Bei leerem oder anderem Status als „Archived" oder „Blocked" bleibt der Ablauf unverändert. Bei einem FI-System-Status erhält der MO-Benutzer eine interne Benachrichtigung sowie eine E-Mail, und die Benachrichtigung führt zur Kundenvorschau. Bei Status „Blocked" erscheint der Vertrag in den MO-Prüfungen mit dem Status „Blocked".

Ebenfalls noch in Prüfung sind das Hinzufügen einer IBAN über die Vertragserstellung (mit IBAN-Validierung, automatischer Befüllung von BIC und Bankname sowie Prüfung auf doppelte IBAN) und über die Kundenverwaltung. Gleiches gilt für die manuelle Werkstattrechnung für einen bestehenden Händler mit oder ohne SAP-Debitorennummer sowie für einen neuen Händler, der in oneSCM noch nicht existiert.