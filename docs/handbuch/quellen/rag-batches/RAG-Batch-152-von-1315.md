# Batch 152 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 26 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

Im Bereich Revenue Management wurde die automatische Vertragssperrung und -reaktivierung erweitert. Die Sperrung eines Vertrags lässt sich im Markt-Setting anhand der Mahnstufe und der Anzahl offener Rechnungen auslösen, etwa bei Mahnstufe 2 und zwei Rechnungen. Das Verhalten wird für Deutschland und Indien geprüft, jeweils für Verträge mit drei MPPIs im FI-Beleg (in Deutschland auch MANU). Zusätzlich wird die Konfiguration der Vertragssperrung für PKW und Transporter in der Slowakei, in Indien und in Deutschland verifiziert.

Das Feld für die Zahlungsdauer zeigt nun die Anzahl der Monate statt der Anzahl der Rechnungen an. Das gilt sowohl in der Benutzeroberfläche als auch im Nemesis-Event. Außerdem wurde die Änderung der Zahlungsart im Revenue Management umgesetzt.

Bei den Exporten für SWT und COFICO wird der FI-Steuercode nun als Finanzsystem-Belegcode verwendet. Zuvor wurde in den exportierten Dateien ein falscher FI-Steuercode angegeben. Die Prüfung erfolgt anhand eines Vertrags im Status „aktiv“.

Mitarbeitende im MO können gutschriftsbezogene Vorgänge nun wie folgt bearbeiten: Gutschriften mit zwei MPPIs lassen sich annehmen und ablehnen, wenn die Rechnungsreferenz der FI-System-Rechnungsnummer entspricht, wenn der Mpay-Status „second_chargeback“ lautet oder wenn der Rechnungsstatus „created“ ist.

Die Vertragsverwaltung erhält künftig Benachrichtigungen, wenn ein Schadencode in einem Vega-Claim storniert wurde. Das Gleiche gilt, wenn eine Werkstattrechnung storniert, abgelehnt oder gelöscht wurde.

Um Verwechslungen zu vermeiden, wurde der Begriff „Invoice“ (Rechnung) im Frontend und Backend vereinheitlicht. Der Begriff wurde bisher sowohl für das Finanzdokument als auch für den Dokumenttyp „Rechnung“ verwendet, wobei es sich bei einer Rechnung im Sinne eines Finanzdokuments mitunter um eine Gutschrift handeln kann. Er wird daher durch „Dokument“ bzw. „FI-Dokument“ ersetzt. So wird beispielsweise aus der oneSCM-Rechnungsnummer die oneSCM-Dokumentnummer, aus der FI-System-Rechnungsnummer die FI-System-Dokumentnummer, aus dem Rechnungsdatum das Dokumentdatum und aus dem Rechnungsstatus der FI-Dokumentstatus. Entsprechend ändern sich auch die Bezeichnungen für Werkstattrechnungsnummer, -typ und -referenz in Werkstattdokumentnummer, -typ und -referenz.

Auf der Seite „Batch Job Console Files“ steht eine Funktion zum gebündelten Herunterladen von Dateien zur Verfügung.

Darüber hinaus wurden mehrere Fehler behoben. Der Batchjob E169 arbeitete in der Entwicklungsumgebung nicht korrekt. Der DocumentSignatureStatusJob blieb im Status „Starting“ hängen. Im PTX01-Text des E169 Dealer Discount fehlte das Schlüsselwort „für“ nach „Händlersubvention“. Die Gesamtanzahl der Schadencode-Datensätze veränderte sich beim Anwenden eines Filters nicht. Die „Sum of All Paid Invoices“ wurde fehlerhaft berechnet. Die Checkboxen auf der Batchjob-Ansicht waren für alle Benutzer sichtbar. Ein Kommentar auf der Rechnung war falsch ausgerichtet.