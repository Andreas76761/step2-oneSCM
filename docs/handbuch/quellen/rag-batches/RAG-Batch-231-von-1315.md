# Batch 231 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Steuerverwaltung: Auswahl der Steuersätze bei der Kundenanlage**

Bei der Anlage eines Vertrags und eines Kunden muss der Händler eine Steuerklassifizierung festlegen. Früher lieferte die Schnittstelle, die das entsprechende Auswahlfeld auf der Kundenanlageseite befüllt, ausschließlich die statischen Werte „Standard" und „Exempt". Nun gibt die Schnittstelle alle Steuerarten mit ihrem jeweils gültigen Steuersatz aus der Steuerverwaltung zurück. Berücksichtigt werden dabei nur Steuersätze, die zum aktuellen Datum gültig sind, bei denen die Finanzdokumentdefinition „Invoice", die Steuerart „VAT" und die Steuerkategorie „Client" lautet. Im Auswahlfeld erscheint jeder Eintrag im Format „Name der Steuerart - Steuersatz", wobei der Steuersatz als Prozentwert angezeigt wird, zum Beispiel „Standard - 19%" oder „Exempt - 0%".

**Steuerverwaltung: Anpassung des Gültigkeitsendes beim Löschen eines Steuersatzes**

Wird ein Steuersatz gelöscht, werden die verbleibenden Steuersätze so angepasst, dass keine Lücke im Gültigkeitszeitraum entsteht. Der vorhergehende Steuersatz übernimmt dazu das Gültigkeitsende des gelöschten Satzes.

Wird der letzte Steuersatz gelöscht, verlängert sich der vorherige Satz entsprechend. Gilt beispielsweise Steuersatz 1 vom 01.01.2020 bis 31.12.2024 und Steuersatz 2 vom 01.01.2025 bis 31.12.2099, so gilt nach dem Löschen von Steuersatz 2 der Steuersatz 1 vom 01.01.2020 bis 31.12.2099.

Wird ein mittlerer Steuersatz gelöscht, gilt dieselbe Regel. Hat Steuersatz 1 die Gültigkeit 01.01.2020 bis 31.12.2024, Steuersatz 2 die Gültigkeit 01.01.2025 bis 30.06.2025 und Steuersatz 3 die Gültigkeit 01.07.2025 bis 31.12.2099, so gilt nach dem Löschen von Steuersatz 2 der Steuersatz 1 vom 01.01.2020 bis 30.06.2025. Steuersatz 3 bleibt unverändert.

**Anpassung des Zahlungsplans bei vorzeitiger Beendigung eines Vertrags mit monatlicher Zahlung**

Wird ein Vertrag aus einem der im System hinterlegten Gründe vorzeitig beendet, wechselt der Vertragsstatus von „Active" auf „Terminated". Die geplanten Rechnungen im Zahlungsplan des Vertrags werden dann auf den Status „Cancelled" gesetzt, damit sie nicht zur Weiterverarbeitung an NACOS übermittelt werden. Wird die vorzeitige Beendigung rückwirkend vorgenommen, muss dem Kunden gegebenenfalls eine Gutschrift gewährt werden. Berücksichtigt werden ausschließlich Verträge mit monatlicher Zahlung. Bei Verträgen mit Einmalzahlung erfolgt keine Erstattung an den Kunden; es wird davon ausgegangen, dass Verkäufer (bisheriger Kunde) und Käufer (neuer Kunde) dies beim Fahrzeugverkauf untereinander regeln.

Im ersten Fall ist die Rechnung noch nicht an das Finanzsystem übermittelt worden. Das bei der vorzeitigen Beendigung gewählte Wirksamkeitsdatum ist also noch nicht in Rechnung gestellt und nicht an NACOS gesendet worden. Sobald die vorzeitige Beendigung abgeschlossen ist und der Vertrag den Status „Terminated" hat, werden alle Rechnungen vom Typ MPPI mit dem Status „Planned" oder „Accepted" auf „Cancelled" gesetzt. In der Vertragsverwaltung steht dem Benutzer bei der vorzeitigen Beendigung ein Auswahlfeld mit Datumswerten zur Verfügung, das mit dem Rechnungszeitraum beginnt.

Im zweiten Fall ist die Rechnung bereits an das Finanzsystem übermittelt worden, die vorzeitige Beendigung erfolgt also rückwirkend. Rechnungen mit dem Status „Exported", „F1 Doc Created" oder „Paid" behalten ihren Status, und für bereits an NACOS gesendete Rechnungen werden vom System keine Gutschriften erstellt. Möchte der Markt den Kunden nach der vorzeitigen Beendigung entschädigen, sei es bei monatlich oder einmalig bezahlten Verträgen, liegt es beim MO-Benutzer, den Betrag zu berechnen und die Gutschrift manuell zu erstellen. Eine automatische Gutschrifterstellung ist nicht vorgesehen.