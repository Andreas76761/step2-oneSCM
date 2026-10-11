# Batch 1106 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation – Änderungen im Überblick**

**Preisdarstellung in Angebot und Vertrag**
Der in der Produktkonfiguration angezeigte Preis wird nun durchgängig in allen weiteren Schritten verwendet. Das gilt unabhängig davon, ob Standardpreise, umverteilte Beträge, Rabattpreise oder Rabattpreise in Kombination mit umverteilten Beträgen zum Einsatz kommen. Der jeweils konfigurierte Preis erscheint in der Produktkonfiguration, im Zahlungsplan, in der Übersicht und Bestätigung, im an den Kunden gesendeten Angebot sowie im Vergleich und im Vergleichsangebot. Bisher wurden im Angebot an den Kunden die Standardpreise verwendet, obwohl in der Produktkonfiguration umverteilte Beträge angezeigt wurden. Dies ist behoben.

In der Übersicht und Bestätigung werden die Rabatte außerdem in der Reihenfolge dargestellt, in der sie angewendet werden: zuerst die Kampagne, dann der Code-Rabatt und anschließend der Händlerrabatt. Zuvor kam die Reihenfolge der Rabatte zufällig zustande. Zusätzlich wurde die Darstellung der Rabattbezeichnung in diesem Bereich überarbeitet.

**Vertragsaktivierung und Übermittlung an das Revenue Management**
Rabattinformationen und Provisionen wurden bisher 14 Tage nach der Vertragsaktivierung an das Revenue Management gesendet, unabhängig von der eingestellten Widerrufsfrist. Künftig erfolgt die Übermittlung erst nach Ablauf der Widerrufsfrist. Ist die Widerrufsfrist beispielsweise auf 23 Tage eingestellt, werden die Daten am 24. Tag gesendet.

Hat der FI-Systemstatus den Wert „Available“, wird zudem die Position „Fi System Status“ im MO-Check auf „Ok“ gesetzt, und die Vertragsaktivierung ist möglich.

Wird ein Vertrag für ein Fahrzeug ohne Erstzulassungsdatum (FRD) angelegt, bei dem die Option „FRD unavailable“ gewählt wurde, und wird später über die Aktion „Update“ im Angebotsmanagement ein Erstzulassungsdatum nachgetragen, wird dieses Datum geprüft. Liegt das eingegebene Datum nach dem FRD zuzüglich der Vertragslaufzeit, wird ein Hinweisbanner angezeigt, dass das Fortfahren den Vertrag auf „abgelehnt“ setzt. Entscheidet sich der Benutzer dennoch fortzufahren, wird der Vertrag auf „Terminated“ gesetzt. Andernfalls wird das eingegebene Datum übernommen und die Aktivierung fortgesetzt.

Außerdem wurde die Speicherung optionaler Deckungen im Vertrag angepasst. Da die Antwort des Fahrzeugsystems die monatlichen Preise nicht mehr enthält, war die Vertragserstellung zuvor blockiert.

**Suche und Filter**
Im Angebotsmanagement und im Vertragsmanagement steht in der Option „Mehr Filter“ ein zusätzliches Suchfeld mit der Bezeichnung „Order Number“ zur Verfügung. Nach Eingabe einer Bestellnummer und Klick auf „Apply“ werden die zugehörigen Verträge gesucht. Die Filteroptionen sind nun in dieser Reihenfolge angeordnet: Order Number, Status, Customer Type, VAT ID, übrige Filter.

**Anzeige und Navigation**
Das Feld „Planned Mileage at Contract End (Km)“ zeigt in der Vertragserstellung und im Vertragsmanagement die Vertragslaufleistung an. Bei einem Vertrag über drei Jahre mit je 20.000 km wird somit 60.000 km angezeigt. Vorerst entspricht die geplante Vertragslaufleistung der geplanten Laufleistung bei Vertragsende.

Im Footer ist neben der „Privacy Policy“ nun auch der Link „Terms of Use“ verfügbar. Bisher mussten Benutzer die Nutzungsbedingungen nach der ersten Anmeldung akzeptieren, konnten deren Inhalt danach aber nicht mehr einsehen. Der Link verhält sich genauso wie der Link zur Privacy Policy.