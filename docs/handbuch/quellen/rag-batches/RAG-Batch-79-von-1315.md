# Batch 79 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Abschluss der Vertragsabrechnung mit dem Dokumenttyp MDCR

Im Modul Revenue steht ein einheitlicher Dokumenttyp zur Verfügung, mit dem die finanzielle Position eines Vertrags abgeschlossen wird, entweder zum Vertragsende oder bei vorzeitiger Beendigung. Er gilt sowohl für Leasingverträge als auch für Nicht-Leasingverträge. Das Dokument bildet eine Schlussabrechnung ab, also eine Rechnung bzw. Belastung oder eine Gutschrift bzw. Erstattung. Es gleicht die Differenz zwischen dem tatsächlich Verbrauchten oder Geschuldeten und dem vertraglich Vereinbarten aus. Typische Beispiele sind eine Kilometer-Mehrleistung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe in einem Leasingvertrag oder eine Strafzahlung bei vorzeitiger Vertragsbeendigung.

Die Berechnung des Betrags erfolgt außerhalb von oneSCM, da jede Vertragsart und jeder Markt eigene Regeln hat, etwa Preis pro Kilometer, Prozentsätze für Strafzahlungen, Kilometerobergrenzen oder Datenbankberechnungen im Leasing. oneSCM automatisiert diese Berechnung nicht. Das System stellt stattdessen einen klar definierten Dokumenttyp sowie einen Erstellungs- und Exportprozess bereit, mit dem der bereits berechnete Betrag erfasst und exportiert wird.

Das Dokument wird manuell von Anwendern in den Rollen MO bzw. MPC im Bereich der Finanzdokumente eines Vertrags erstellt, nachdem sie den Abrechnungsbetrag extern ermittelt haben. Es wird keine neue Benutzerrolle eingeführt. Für die Erstellung gelten die bereits vorhandenen Berechtigungen zur manuellen Dokumenterstellung.

Bei der Erstellung wählt der Anwender, ob das Dokument als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden) angelegt wird. Für Gutschriften gibt es keine Einschränkung. Anschließend erfasst der Anwender manuell den extern berechneten Nettobetrag sowie einen Positionstext, der die Berechnung beschreibt, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Die Felder für den Rechnungszeitraum („Dokument von“ und „Dokument bis“) sind optional, da ein solches Dokument keinen Abrechnungszeitraum darstellt.

Das Dokument durchläuft den üblichen Dokumentenlebenszyklus (Erstellt, Akzeptiert, Exportiert, FI-Dokument erstellt usw.) und wird über den standardmäßigen E169/CoFiCo-Export-Batchjob exportiert. Dabei wird der Positionstext in die exportierte Position der Exportdatei übernommen.

Für MBLD-Verträge gilt eine zusätzliche Regel: Diese Dokumente werden anhand des Vertriebskanals Leasing und des Dokumenttyps MDCR ausgewählt und per API an MBLD übermittelt. MDCR-Dokumente von Nicht-Leasingverträgen werden nicht an MBLD gesendet.

Mit dem neuen Dokumenttyp werden bisher uneinheitlich benannte, manuell erstellte Dokumente für Vertragsende und vorzeitige Beendigung ersetzt, die zu Unklarheiten zwischen den Teams geführt haben. Zudem stellen die klaren Routing-Regeln sicher, dass Endsaldo-Daten aus dem Leasing zuverlässig an MBLD gelangen.

Die manuelle Erstellung knüpft an die bereits vorhandene Erstellung von Standardrechnungen und -gutschriften im Bereich der Finanzdokumente eines Vertrags an. Dieser Dokumenttyp ergänzt sie um die Dokumenttyp-Definition, die Feld- und Lebenszyklusregeln sowie die Export- und Routing-Logik.