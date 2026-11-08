# Batch 620 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnermanagement**

Für den indischen Markt wurde die Kundenanlage um einen eigenen Ablauf erweitert, der an das Finanzsystem SWT angebunden ist. Das bisherige Finanzsystem ist auf Deutschland ausgerichtet und berücksichtigt NACOS bzw. oneERP. SWT wird in Indien und weiteren Märkten eingesetzt und liefert unter anderem den SAP-Debitor, den Status eines Kunden sowie alle weiteren Kundendaten. Aus dem Kundenmanagement heraus können nun Privatkunden (B2C) und Geschäftskunden (B2B) angelegt und mit SWT abgeglichen werden.

Der indienspezifische Ablauf wird aktiviert, sobald sich ein Benutzer aus Indien anmeldet. Die Anmeldung erfolgt über die ALICE-API. Für diesen Benutzer werden die landesspezifischen Eingabefelder angezeigt, und die Verbindung zu SWT wird genutzt. Für Indien wird zudem die Google-API verwendet, um vollständige Adressdaten abzuleiten. Bei der Kundenanlage wird im Feld Kundentyp für Privatkunden ein „X" übermittelt, für Geschäftskunden bleibt es leer.

Für beide Kundenarten steht ein neues Auswahlfeld „Region" zur Verfügung. Die Werte stammen künftig aus den Markteinstellungen und sind derzeit fest hinterlegt. In der Oberfläche wird der Name der Region angezeigt, etwa Punjab, an SWT wird im JSON-Dokument der zugehörige Regionscode übermittelt. Die Region bestimmt die Besteuerung je Region.

Bei Privatkunden gibt es zusätzlich das Pflichtfeld „Permanent Account Number" (PAN). Es besteht aus 10 alphanumerischen Zeichen, zum Beispiel AVNPB9871Z, und wird im JSON unter Tax Number 4 übermittelt. Außerdem gibt es die Auswahl „Tax Classification" mit Werten wie Standard, Exempt und Reduced. Diese Werte sollen künftig über eine API des Bereichs Revenue bereitgestellt werden.

Bei Geschäftskunden wird die PAN ebenfalls als Pflichtfeld erfasst, in gleichem Format. Hinzu kommt die GST-Nummer (Goods and Services Tax Identification Number). Sie ist eine eindeutige, 15-stellige alphanumerische Kennung mit festem Format, zum Beispiel 29AARFC4000B1ZV, und ist nicht verpflichtend. Sie wird im JSON unter Tax Number 3 übermittelt.

Für beide Kundenarten gibt es die Option „SEZ mit Steuer" (SEZ = Special Economic Zone, Sonderwirtschaftszone). Ist sie angehakt, wird im Feld taxNumber5 der Wert 4 gesendet, andernfalls der Wert 1. Für die SAP-Nummer gilt für Indien ein Beispielformat wie INC800957.

Beim Anlegen eines Kunden startet automatisch die Datenkommunikation mit dem Finanzsystem. Zunächst hat der Kunde den Status „Waiting for Confirmation", in diesem Status sind Änderungen erlaubt. Während des Abgleichs mit SWT lautet der Status „In Confirmation", Änderungen sind dann nicht möglich. Sobald die SAP-Daten vorliegen, wechselt der Status auf „Active", und Änderungen sind wieder erlaubt. Änderungen an aktiven Kunden lösen eine Aktualisierung (POST/UPDATE) an SWT aus, bei der zusätzlich der Customer Code mitgesendet wird.

Im Hintergrund läuft der Abgleich so ab: Sobald die REST-API verfügbar ist, wird die Verbindung hergestellt. SWT wird anschließend mit der PAN oder der GST-Nummer als Filterkriterium abgefragt, und die zurückgegebene Kundennummer wird gespeichert. Existiert der Kunde bereits, wird der Customer Code (SAP-Debitor) übernommen. Existiert er nicht, wird eine POST-Anfrage erstellt, die auf den Daten der Oberfläche und den Vorgaben der Business Requirements für SWT beruht.

**Weitere Verbesserungen**

Beim Hochladen von Dokumenten wurde die Logik für nicht lesbare QR-Codes angepasst. Wirft der Dokumentendienst eine Ausnahme, wird sie im Frontend angezeigt. Ist der QR-Code nicht lesbar und die Prüfung der Vertragsnummer nicht in Ordnung, öffnet sich ein Dialogfenster. Bestätigt der Kunde dort das Fortfahren, wird das hochgeladene Dokument gespeichert und die Prüfung auf „NOK" gesetzt. Ist der QR-Code lesbar und die Vertragsnummer korrekt, läuft der Upload unverändert weiter, und der Vertrag wird aktiviert.

Außerdem wurden mehrere Fehler behoben: ein Fehler im Logging der Kunden-App, ein Darstellungsproblem im Overlay der Kundenvorschau sowie ein Problem, bei dem die Aktualisierung der Zahlungsdetails nicht ausgelöst wurde, wenn bei aktiven Privatkunden die IBAN geändert wurde.