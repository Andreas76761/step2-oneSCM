# Batch 1284 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Produkt-Assistent (Contract Calculation)**

Im Assistenten zum Anlegen eines Produkts wurden mehrere Eingaben und Anzeigen verbessert. In den Schritten 4 und 5, in denen Mindest- und Höchstwerte erfasst werden, darf der Mindestwert nicht mehr größer sein als der Höchstwert; in diesem Fall erscheint eine Fehlermeldung. Der Höchstwert muss außerdem mindestens um 1 über dem Mindestwert liegen und darf diesem nicht mehr gleichen. Dies gilt in Schritt 4 sowie in Schritt 5 beim Anlegen eines Limits. Zudem können die Felder für die Gesamtlaufleistung und die Gesamtlaufzeit in Schritt 4 sowie die Felder für das Fahrzeugalter bei Vertragsbeginn und die Fahrzeuglaufleistung bei Vertragsbeginn in Schritt 5 nur noch ganze Zahlen aufnehmen. Dezimalwerte werden nicht mehr akzeptiert.

Im ersten Schritt des Assistenten sind die Auswahlfelder (Dropdowns) nun kompakter und entsprechen in ihrer Länge den Vorgaben aus den Designdateien. Behoben wurde auch ein Fehler, der den Übergang von Schritt 2 zu Schritt 3 verhinderte: Wenn alle Pflichtfelder ausgefüllt waren (vermutlich in Verbindung mit einem hochgeladenen Bild), erschien beim Klick auf „Weiter“ eine Fehlermeldung. Nun gelangen Sie ohne Fehler zum nächsten Schritt, sobald alle Pflichtfelder ausgefüllt sind.

Die Schaltfläche „Als Entwurf speichern“ (Save as Draft) im Bereich „Product Setup“ ist jetzt nur aktiv, wenn das Pflichtfeld „Product Name“ ausgefüllt wurde. Andernfalls ist sie deaktiviert.

**Produktzusammenfassung (Schritt 7)**

Die Produktzusammenfassung wurde in Darstellung und Inhalt überarbeitet. Die Bezeichnungen der Bereiche und Felder werden einheitlich mit großen Anfangsbuchstaben geschrieben, zum Beispiel „Product Setup“, „Product Line“, „Product Code“, „Product Line Description“, „Sales Level“, „Sales Channels“, „Possible Discounts“, „Possible Modifications“, „Regular Expiry Criteria“, „Main Coverages“, „Total Mileage“, „Total Duration“, „Payment Options“, „Payment Interval“, „One Time“ und „Admin Fee“. Auch der Blueprint wird nun in der Schreibweise „Excellent“ angezeigt. Die Überschrift „Main Coverages“ wurde zudem in ihrer Schreibweise korrigiert.

Im Bereich „Condition“ werden die Angaben zu „Contract Logic“, „Price Model“ und „Markups“ nun angezeigt. Sie erscheinen in dieser Reihenfolge nach „Possible Discounts“. Bei der Gesamtlaufzeit wird die Einheit korrekt als „Year“ bzw. „Years“ dargestellt, statt wie zuvor als Tage. Bei den Limits lauten die Bezeichnungen „Limits for MPC User“, „Limits for Dealer“ und „Limits for Customer“.

**Weitere Anpassungen**

Zahlungsoptionen können nur noch gespeichert werden, wenn mindestens eine der beiden Varianten, Einmalzahlung oder monatliche Zahlung, aktiviert ist. Sind beide deaktiviert, ist das Speichern nicht möglich. Außerdem wurde in der Übersichtsseite ein überflüssiges Leerzeichen im Namen der Schaltfläche „Create Vehicle Group“ entfernt.

**Archivierung**

Im Bereich Archivierung wurde die Erstellung der Dateien für den Reporting-Contract-Batch umgestellt. Die bisherige Logik zur Erzeugung von Parquet-Dateien entfällt. Stattdessen werden CSV-Dateien sowohl für Delta-Daten als auch für Volldaten erzeugt.