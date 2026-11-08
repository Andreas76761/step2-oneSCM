# Batch 964 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Keine Produkte gefunden: Erweiterte Hinweise bei der Vertragserstellung**

Wenn Sie ein Vertragsangebot erstellen und nach der Eingabe der Pflichtfelder die Vertragsberechnung auslösen, sucht das System anhand der eingegebenen Kennung passende Produkte und Konfigurationen. Als Kennung können Sie eine Fahrgestellnummer, eine Auftragsnummer oder einen Baumuster-Code (Model Code) verwenden. Liefert die Suche kein Ergebnis, zeigt das System nun differenziertere Hinweise an als bisher. So können Sie besser nachvollziehen, woran es liegen könnte, und gezielter reagieren.

Zunächst prüft das System, ob das Baumuster überhaupt veröffentlichten Produkten zugeordnet ist. Ist das nicht der Fall, erscheint weiterhin die bekannte Meldung: „Your Identifier did not return any results. Please check and adjust your input if needed and try again. Enter a valid Chassis Number, Order Number, or Model Code."

Ist das Baumuster dagegen veröffentlichten Produkten zugeordnet, erfüllt das Fahrzeug aber offenbar nicht deren Anforderungen, führt das System vier weitere Prüfungen durch. Je nach Ergebnis wird die Standardmeldung um einen konkreten Hinweis ergänzt, der mit „Alternatively, check …" beginnt.

Überschreitet das Fahrzeugalter (bei Berechnung auf Basis des Erstzulassungsdatums, FRD) das für das Produkt zulässige Höchstalter, lautet der Zusatz: „Alternatively, check the vehicle's FRD." Überschreitet die Laufleistung die für das Produkt zulässige Obergrenze, lautet er: „Alternatively, check the vehicle's mileage." Eine zu niedrige Laufleistung wird dabei nicht geprüft. Ist für das Fahrzeug im DSB eine Servicemaßnahme erfasst, erhalten Sie den Zusatz: „Alternatively, check for performed services." Wurden Servicemaßnahmen durchgeführt, die nicht den Mercedes-Benz-Standards entsprechen, lautet der Hinweis: „Alternatively, check the order of performed services."

Treffen mehrere dieser Gründe gleichzeitig zu, fasst das System sie in einer gemeinsamen Meldung zusammen. Die zutreffenden Gründe werden dann am Ende der Standardmeldung aufgelistet, zum Beispiel: „Your Identifier did not return any results. Please check and adjust your input if needed and try again. Enter a valid Chassis Number, Order Number, or Model Code. Alternatively, check for Mileage, FRD, or performed Services."

Die Gestaltung der Meldungen folgt den Vorgaben der Mercedes-Benz Workbench.