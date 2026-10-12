# Batch 826 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 40 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverwaltung (Contract Management): Änderungen und Verbesserungen**

In der Vertragsverwaltung wurden mehrere Bedienelemente und Abläufe überarbeitet. Auf der Vertragsübersichtsseite heißt das Dropdown-Menü, über das Aktionen wie Stornieren, vorzeitig Beenden, Aussetzen, Reaktivieren, Übertragen oder Verlängern ausgewählt werden, jetzt „Action“ statt „Status“. Der Begriff „Status“ bleibt damit dem Zustand eines Vertrags vorbehalten, zum Beispiel „Suspended“, „Active“, „Terminated“, „Cancelled“, „Expired“ oder „Closed“. Außerdem wurde der Reiter „Contract“ in der Vertragsverwaltung überarbeitet. Für die Bearbeitungsfunktion auf den Reitern „Contract“, „Vehicle“ und „Payment“ gilt: Bei Verträgen im Status „Cancelled“, „Terminated“, „Expired“ oder „Closed“ soll die Option „Contract Edit“ nicht mehr angezeigt werden. Beim Stornieren eines Vertrags wird nun eine Rückfrage zur Bestätigung der Stornierung angezeigt. Auch die Stornierung mehrerer Verträge gleichzeitig wurde korrigiert.

Im Reiter „Payment“ der Vertragsübersicht steht für Verträge mit anwendbarer Händlerprovision das neue Feld „Dealer Commission“ zur Verfügung. Es zeigt den Provisionsbetrag an, der bei der Vertragserstellung ermittelt wurde. So können Mitarbeitende im Management Office (MO) die Finanzen eines Vertrags prüfen und den Betrag mit der erstellten Gutschrift abgleichen. Voraussetzung ist ein aktivierter Vertrag, für den eine Händlerprovision gilt.

Nach der Genehmigung einer Kurzzeitverlängerung (Short Term Extension) wird der Gesamtpreis des Vertrags um die durch die Verlängerung entstehenden zusätzlichen Beträge aktualisiert. Die Zahlungsinformationen bei einer Kurzzeitverlängerung wurden ebenfalls angepasst.

Bei der Erzeugung der i155-Datei wurden im Satz RC17, der für den Kundengruppenrabatt vorgesehen und optional ist, bisher keine Angaben ausgegeben. Dort werden nun in den Positionen 62 bis 65 der Standardtext „MSTD“, in den Positionen 66 bis 73 das Vertragsstartdatum und in den Positionen 74 bis 81 das Vertragsenddatum eingetragen. Das gilt für Verträge mit Kampagnenrabatt, mit Kampagne für eine Karenzzeit (Grace Period) und mit Händlerrabatt. Ebenfalls korrigiert wurde der Statuscode für den Status „Closed“, der an Vega exportiert wird.

Für die Aktivierung gilt bei Gewerbekunden: Mitarbeitende im Management Office können einen Vertrag manuell aktivieren, außer wenn die Umsatzsteuer-ID, die CAS-Prüfung oder die Vertragsunterschrift nicht in Ordnung sind.

Für den Produktvergleich wurde die Übergabe der Deckungsumfänge (Coverages) an das Vergleichsdokument geändert. Statt die Base64-Bilder getrennt in jeweils eigenen Platzhaltern zu übermitteln, wird für jeden Deckungsumfang ein Datenobjekt gesendet, das den Namen des Deckungsumfangs und die Base64-Bilder für die gewünschte Anzahl an Produkten enthält.

Darüber hinaus wurden mehrere Fehler behoben, darunter Ausnahmefehler in Entwicklungsumgebungen, eine überschrittene Länge der Produktlinienbeschreibung, das automatische Setzen aktiver Verträge von „Expired“ auf „Closed“ sowie eine fehlerhafte Angabe der Änderungsart bei der Vertragsübertragung.