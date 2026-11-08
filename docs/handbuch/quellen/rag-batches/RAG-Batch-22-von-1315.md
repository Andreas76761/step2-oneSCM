# Batch 22 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Motorbaureihen und Motormerkmale im Fahrzeugmanagement**

Die Baumusterliste, die aus CePro importiert wird, wird automatisch um zusätzliche Fahrzeugmerkmale angereichert, damit MPC-Anwender Fahrzeuggruppen einfacher und schneller bilden können. Dazu werden zwei neue Spalten für die Merkmale 4MATIC (Allradantrieb) und Hybrid ergänzt. Die Auswertung erfolgt anhand des Objekts salesDescriptionAfterSales. Für beide Merkmale wird als Ergebnis ein Ja oder Nein hinterlegt, je nachdem, ob ein Treffer gefunden wird. Das Hybrid-Merkmal wird nur für Verbrennungsfahrzeuge (ICE) ermittelt, die im Motorart-Identifier mit B (Benzin) oder D (Diesel) gekennzeichnet sind. Dabei wird nach den Kennungen de, h oder e nach einer Ziffer oder nach der Zeichenfolge HYBRID gesucht. Das 4MATIC-Merkmal wird für Verbrennungsfahrzeuge und für rein batterieelektrische Fahrzeuge (BEV) geprüft. Dabei wird die Zeichenfolge 4MATIC an beliebiger Stelle gesucht, wobei Groß- und Kleinschreibung nicht unterschieden werden.

Darüber hinaus wurde die Baumustertabelle angepasst. Der Motorart-Identifier kennzeichnet nun Benzin, Diesel oder Elektro und bleibt leer, wenn kein Wert vorhanden ist. Die Spalten für Karosserieform und Getriebeart wurden entfernt. Neu hinzugekommen ist die Spalte Motorbaureihe, in der die ersten drei Ziffern einer der beiden Identifier aus dem Objekt combustionEngine gespeichert werden. Diese Angabe dient als Grundlage für die manuelle Anreicherung.

Im Bereich Vehicle Admin steht MPC-Anwendern eine Liste der Motorbaureihen zur Verfügung, in der sich pro Baureihe die Zylinderzahl und die Leistungsmerkmale pflegen lassen. Die Tabelle enthält für jede Motorbaureihe eine Zeile mit drei Spalten: Motorbaureihe, Motorzylinder und Hochleistungsmotor. Die Zylinderzahl wird als Zeichenfolge mit maximal zwei Stellen erfasst, das Leistungsmerkmal als Ja/Nein-Angabe. Beide Felder sind standardmäßig leer und können bearbeitet und gespeichert werden. Beispiele sind die Baureihe 113 mit 6 Zylindern, die Baureihe 214 mit 8 Zylindern und die Baureihe 313 mit 12 Zylindern, wobei nur die Baureihe 313 als Hochleistungsmotor gekennzeichnet ist. Die Liste wird jedes Mal aktualisiert, wenn die Baumusterdaten aktualisiert werden. Die Spaltenüberschrift für AMG-Fahrzeuge lautet Hochleistungsmotor (High-Performance Engine).

Die gepflegten Werte zu Zylinderzahl und Leistungsmerkmal werden gespeichert und auf alle Baumuster mit der jeweiligen Motorbaureihe in der Baumustersuche übertragen. Die beiden Spalten wurden zudem in die Baumusterliste der Suche aufgenommen und stehen dort als Filter zur Verfügung.

Zur schnelleren Orientierung gibt es in der Liste eine Suchleiste für Motorbaureihen. Sie akzeptiert nur Ziffern und höchstens drei Stellen. Nach Eingabe einer Zahl und Klick auf die Suchschaltfläche wird die Liste entsprechend gefiltert. Bei ungültiger Eingabe erscheint die Fehlermeldung „Max. 3 numeric characters allowed. Please correct your input and try again.“ Über die Reset-Schaltfläche werden Suchbegriff und Suchergebnis der vorherigen Suche zurückgesetzt.

**Servicehistorie von Fahrzeugen**

In oneSCM kann ein Servicevertrag nur für Fahrzeuge angelegt werden, die bestimmte Voraussetzungen erfüllen. Wurde vor Vertragsabschluss bereits ein Service durchgeführt, muss das Fahrzeug nach Mercedes-Benz-Standard regelmäßig gewartet worden sein.

Bei Jahreswagen und Gebrauchtwagen wird geprüft, ob das Fahrzeug bereits gewartet wurde. Wurde es gewartet und war die Wartung regelmäßig und standardgemäß, kann der Servicevertrag angelegt werden. War die Wartung nicht standardgemäß, kann kein Servicevertrag angelegt werden. Bei Neufahrzeugen wird geprüft, ob die Zeit- oder Laufleistungsgrenze für den ersten Service bereits erreicht ist. Ist das nicht der Fall, kann der Servicevertrag angelegt werden.

Die Informationen stammen aus dem Mercedes-Benz-System Warranty and Goodwill, dessen DSB-Schnittstellen unter anderem Servicehistorie, Services und Statusinformationen liefern können. Übermittelt werden die FIN (die VIN funktioniert derzeit nicht), der Ländercode, die Sprache, die Anzahl der benötigten Services (oder leer, um alle bisher durchgeführten Services zu erhalten), das aktuelle Datum und optional der aktuelle Kilometerstand. Zurückgeliefert werden die Angaben, ob das Fahrzeug gewartet wurde und ob die regelmäßigen Services innerhalb der Toleranz liegen. Die Daten aus DSB werden 30 Tage lang im Cache von oneSCM gespeichert, damit der Vertrag alle Phasen durchlaufen kann, ohne dass DSB erneut abgefragt werden muss.

**Menüführung bei Fahrzeuggruppen**

Ein Fehler in der Navigation wurde behoben: Beim Wechsel von der Unternavigation „Übersicht“ (Ebene 2) zurück zur Kopfzeile „Contract Calculation“ blieb zuvor die Unternavigation „Fahrzeuggruppe“ geöffnet. Dieses Verhalten wurde korrigiert.