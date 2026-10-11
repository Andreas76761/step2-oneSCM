# Batch 800 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Verlängerung (Prolongation) von Verträgen**

Bei der Verlängerung eines Vertrags berechnet das System die Preise nun korrekter, insbesondere wenn für die Preisermittlung der aktuelle Cluster anstelle des Clusters bei Vertragsabschluss verwendet wird. Bei der Berechnung der Preisdifferenz, etwa bei einem Vertrag mit 12 Monaten Laufzeit, der auf 18 Monate verlängert wird, wird der Preis für die bisherige Laufzeit nun aus dem alten Cluster ermittelt und vom Preis für die neue Laufzeit abgezogen. Die Logik berücksichtigt zudem optionale Zusatzleistungen. Wird nur eine optionale Leistung ergänzt, setzt sich der Preis aus dem aktuellen Monatspreis und dem Monatspreis der neuen Zusatzleistung(en) für die verbleibende Vertragslaufzeit zusammen; für bereits vorhandene Leistungen beträgt der Preis 0. Bei einer reinen Erhöhung der Laufzeit oder bei Laufzeit- und Laufleistungserhöhung ergibt sich der neue Preis aus dem Netto-Gesamtpreis des Vertrags zuzüglich der Differenz zwischen neuem und altem Preismatrixwert, abzüglich des bereits gezahlten Gesamtbetrags. Wird bei einer Verlängerung erstmals eine optionale Leistung hinzugefügt, wird ausschließlich der aktuelle Preis verwendet.

In der Benutzeroberfläche wird bei ausgewählter Verlängerung zunächst anstelle von Preisen ein „-“ angezeigt. Sobald die Verlängerung konfiguriert ist (Laufzeit und jährliche Laufleistung), werden die zur Konfiguration gehörenden Preise angezeigt. Wird die Konfiguration geändert, aktualisieren sich die Preise entsprechend, sodass stets der zur aktuellen Konfiguration passende Preis erscheint.

Zahlreiche Fehler rund um die Verlängerung wurden behoben: Der Versand einer Langzeitverlängerung per E-Mail löst keinen Fehler mehr aus, und beim Anlegen einer Langzeitverlängerung nach einer Kurzzeitverlängerung werden Laufzeit und Laufleistung korrekt übermittelt. Die E-Mail zur Kurzzeitverlängerung zeigt nun die richtigen Daten an. Die Planvorschau im Verlängerungsdokument entspricht nicht mehr der Vorschau zum Zeitpunkt des Vertragsabschlusses, und bei der Langzeitverlängerung fehlende Felder wurden ergänzt. Auch wird die Produktinformation im Job zur Aktualisierung von Vertragsdaten erneut abgerufen.

**Ablauf von Verträgen**

Der Ablauf von Verträgen richtet sich künftig nach dem im Produkt definierten Ablaufkriterium. Beim Kriterium „TIME“ kann ein Vertrag nur durch Erreichen des geplanten Enddatums ablaufen. Bei „TIME_OR_MILEAGE“ läuft er entweder mit Erreichen des Enddatums oder bei Überschreiten der geplanten Laufleistung ab. Bei „CONTINGENT“ läuft der Vertrag ab, sobald alle Kontingentleistungen verbraucht sind. Zusätzlich können Verträge ohne Fehler separat datumsbasiert ablaufen. E-Mails zum Vertragsablauf werden nicht mehr für Verträge ausgelöst, die noch den Status „Aktiv“ haben.

Bei der Übermittlung abgelaufener Verträge an Vega (Schnittstelle I155) wird das Rückläufer-Kennzeichen verwendet. Läuft ein Vertrag aufgrund des Kriteriums „Zeit“ ab, wird im Satzart 05 an Stelle 260 der Wert „1“ übertragen. Bei jeder anderen Ablaufart, etwa durch Laufleistung oder Kontingent, wird dort „*“ übertragen. Dadurch kann Vega Ansprüche bei Überschreitung der Laufleistung weiterhin zulassen, nicht jedoch nach Überschreiten des Vertragsendes.

**Weitere Korrekturen**

Für Händlerbenutzer wird die Aktionsabfrage im Vertragsmanagement nicht mehr unnötig aufgerufen, und die zuvor fehlenden Vertragsdetails werden wieder angezeigt.