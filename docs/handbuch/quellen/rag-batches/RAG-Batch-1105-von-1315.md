# Batch 1105 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 19 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation)**

Beim Hochladen eines Vertrags wird der Status „Vertragsdokument" künftig standardmäßig auf „NOK" gesetzt. Zuvor wurde nach dem Dokumenten-Upload automatisch „OK" übermittelt, sodass keine manuelle Prüfung nötig war. Die Vertragsaktivierung wird nun angehalten, bis der Vertrag freigegeben ist, und der Vertrag verbleibt im Status „Waiting for Confirmation". In den Market Operations (MO) wird unter „Check -> Document Signature Check -> Contract Document" der Status „NOK" angezeigt, zusammen mit dem Link „Go To Communication". Dieser führt zur Detailansicht des Servicevertrags und dort zum Reiter „Communication". Nach der Prüfung kann der Vertrag bestätigt oder abgelehnt werden. Bei einer Bestätigung gelten die hochgeladenen Dokumente als in Ordnung, das Vertragsdokument wechselt von „NOK" auf „OK", der Vertrag wird auf „Confirmed" gesetzt und die Aktivierung läuft weiter. Bei einer Ablehnung wird der Vertrag auf „Rejected" gesetzt.

Die MO-Prüfungen zu den Kundendaten wurden erweitert. Bei der Erstellung eines Vertrags werden dort der Direct Debit Code, der FI-Systemstatus und neu auch die SAP-Debitorennummer mit ihrem jeweiligen Status angezeigt. Beim Direct Debit Code, beim FI-Systemstatus und bei der SAP-Debitorennummer steht jeweils ein Link „Go to Customer" zur Verfügung. Er führt zur Kundenseite, auf der sich der FI-Systemstatus bzw. die SAP-Debitorennummer bearbeiten lässt. Sobald alle Attribute gefüllt sind, wechselt der Status in den MO-Prüfungen automatisch auf „Ok" und die Vertragsaktivierung wird fortgesetzt. Die Kundenprüfungen erscheinen außerdem in einer festen Reihenfolge: Kunde, CAS-Check, Direct Debit Code, SAP-Debitorennummer und FI-Systemstatus. Zuvor war die Reihenfolge zufällig.

Ist während der verschiedenen Abläufe der Vertragsangebotserstellung eine bestimmte Information noch nicht verfügbar, erscheint anstelle des Hinweises „will be updated" nun der Text „not yet available". Das betrifft zum Beispiel bei Build-to-Order-Fahrzeugen das FRD, das Kennzeichen, den Vertragsbeginn und die Vorlagen.

Bei der Produktkonfiguration im Vertragsangebot werden nur noch Kombinationen aus Laufzeit und Jahresfahrleistung angeboten, bei denen die geplante Gesamtfahrleistung (Laufzeit mal Jahresfahrleistung) nicht unter dem Kilometerstand zum Verkaufszeitpunkt liegt. Auch vor der Vertragserstellung wird dies geprüft. Beispiel: Bei 100.000 km zum Verkaufszeitpunkt, 0 km bei Vertragsbeginn, 36 Monaten Laufzeit und 20.000 km Jahresfahrleistung ergibt sich eine geplante Gesamtfahrleistung von 60.000 km. Diese liegt unter dem Kilometerstand zum Verkaufszeitpunkt und ist daher nicht zulässig.

Sobald ein Vertrag unterschrieben wurde, wird im Bereich „Communication" immer die unterschriebene Version des Dokuments angezeigt, unabhängig vom Vertragsstatus. Zudem wird die API „getDocument" so angepasst, dass sie die Vertragsnummer erhält. Dadurch werden in der Kommunikation immer die Allgemeinen Geschäftsbedingungen angezeigt, die bei der Erstellung des Dokuments verwendet wurden.

Bei der Laufzeit wird zwischen geplanter und tatsächlicher Laufzeit unterschieden. Das Feld mit der tatsächlichen Laufzeit wird nur angezeigt, wenn sich der Vertrag im Status „Terminated", „Expired" oder „Closed" befindet.

Ändert sich der Kundenname, wird in den Ereignis-Topics „customer_changed" und „commercial_customer_changed" auch der Benutzername (Vor- und Nachname) der Person übermittelt, die die Änderung vorgenommen hat.

Als Kontaktdaten des Market-Operations-Pools gelten die neue Standard-E-Mail-Adresse und die Telefonnummer +49 (0)30 2694 4343, die die bisherige Adresse ersetzen.

Wird ein Preisangebot an Privat- oder Gewerbekunden versendet, werden nun auch die dem Produkt zugeordneten Allgemeinen Geschäftsbedingungen beigefügt. Bei einem Vergleich mehrerer Produkte gilt dies für die Bedingungen aller verglichenen Produkte. Das gilt sowohl für Preisinformationen aus der Produktdetailansicht bzw. Konfiguration als auch für solche aus dem Vergleich.

Bei monatlicher Zahlweise enthielt die Preisinformation bisher nicht den Gesamtpreis, dessen Anzeige zumindest im Online-Vertrieb gesetzlich vorgeschrieben ist. Dieser Punkt wurde zur Prüfung gemeldet.

Auf der Produktdetailseite wurde die Darstellung vereinheitlicht, und zwar bei Schriftgrößen und Abständen auf den Reitern „Included Coverages" und „Campaign".