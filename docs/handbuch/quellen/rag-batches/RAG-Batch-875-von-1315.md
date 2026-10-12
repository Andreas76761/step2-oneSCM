# Batch 875 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reifenoptionen bei Komplexen Produkten**

Bei Komplexen Produkten kann eine Reifenoption hinterlegt sein. Diese ist entweder begrenzt (Limited, mit einer festen Anzahl an Reifen) oder unbegrenzt (Unlimited). Im Konfigurationsschritt wird jede Reifenoption mit ihrem Produktnamen und einer Beschreibung angezeigt, statt wie bisher mit dem VEGA-Code. Namen und Beschreibungen werden von Stream 1 bereitgestellt und über die Daten des Produkt-Microservice geliefert. So lassen sich die Optionen im Verkaufsgespräch erklären, ohne technische Codes zu entschlüsseln.

Die Auswahl erfolgt über Radiobuttons. Es ist immer genau eine Option ausgewählt. Die übrigen Optionen bleiben auswählbar, sodass Sie jederzeit frei zwischen ihnen wechseln und Konfigurationen im Gespräch mit dem Kunden vergleichen können. Beim Wechsel wird die Attributliste durch die Attribute der neu gewählten Option ersetzt.

Unter der gewählten Option erscheinen die auswählbaren Attribute, die sich aus den Produktdaten ergeben, zum Beispiel Reifentyp, Größe, Dimension, Felgen und Wetterprofil. Bei einer begrenzten Option wird zusätzlich die Anzahl der Reifen angezeigt. Sie ist mit dem empfohlenen Wert vorbelegt, den der Produkt-Microservice berechnet. Sie können diesen Wert ändern, sofern es sich um eine positive ganze Zahl innerhalb des für das Produkt zulässigen Bereichs handelt. Bei einer unbegrenzten Option wird die Attributliste ohne Eingabe einer Reifenanzahl angezeigt.

Liefert der Produkt-Microservice für die Kennung nur eine einzige Reifenkonfiguration, ist ausschließlich diese auswählbar und vorausgewählt; weitere Alternativen werden nicht angeboten. Werden mehrere Konfigurationen geliefert, können Sie die Optionen anhand der Kundenbedürfnisse filtern. Die Filterkriterien richten sich nach den gelieferten Attributen, etwa Reifentyp, Größe oder Felgen. Die Anzeige verengt sich auf die passenden Konfigurationen, und nach dem Zurücksetzen der Filter werden wieder alle angezeigt.

**Umbenennungen und Entfall des Reifenlieferanten**

Die Bezeichnung „Optional Coverages for Tire Options" heißt nun in allen Vorkommen und Sprachen „Optional Tire Coverages". Das Feld „Tire Supplier" (Reifenlieferant) entfällt in der Produktkonfiguration und in den Tire Details und wird auch nicht mehr in den Produktdaten geliefert. Auch in der nachgelagerten Schnittstelle i155 wird der Lieferant nicht mehr übertragen. Stattdessen schreibt die i155 den Unit Cost-Wert (Stückkosten) aus den Produktdaten in das Feld SERVICE_PROVIDER (Positionen 195 bis 244) des Record Type 20. Der Wert gilt pro Deckung, sodass jede Deckungszeile ihren eigenen Wert erhält. Er wird unverändert in das 50-stellige alphanumerische Feld übernommen. Bereits gespeicherte Reifenlieferanten-Werte bestehender Verträge bleiben in der Datenbank erhalten, werden aber weder angezeigt noch exportiert.

**Vertragsdetailansicht**

In der Contract Detailed View zeigen die Tire Details bei einem unbegrenzten Produkt den von Stream 1 bereitgestellten Produktnamen an. Das Feld „Number of Included Tires" zeigt bei einem begrenzten Produkt die gewählte Anzahl und bei einem unbegrenzten Produkt den Text „unlimited". Reifendeckungen werden als eigene Gruppe untereinander sortiert dargestellt und nicht mit Basisdeckungen oder sonstigen optionalen Deckungen vermischt. Als Reihenfolge ist vorgesehen: Basisdeckungen, optionale Deckungen, Reifendeckungen (jeweils Basis- und optionale Reifendeckungen innerhalb der Gruppe). Diese Reihenfolge ist noch mit UX abzustimmen. Die Anzeigeregeln gelten auch für bestehende Verträge; die Datenverfügbarkeit bei Altverträgen ist noch zu prüfen.

**Doppelte Vertragsbedingungen**

Ein Komplexes Produkt enthält ein Basisprodukt mit eigenen Allgemeinen Geschäftsbedingungen (Terms & Conditions, T&C). Wird eine Reifenoption hinzugefügt, die selbst ein Produkt ist, müssen auch deren T&C verfügbar sein. Die Oberfläche ermöglicht daher, beide Dokumente anzusehen und herunterzuladen, im Schritt der Produktkonfiguration und überall dort, wo T&C bereits angeboten werden. Beide T&C werden zwingend dem Angebot (Proposal) beigefügt, und der Kunde unterschreibt mit beiden. Nach Vertragserstellung stehen beide Dokumente in der Contract Detailed View unter Communication → Documents zur Verfügung.