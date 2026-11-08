# Batch 41 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Dokumenttyp MDCR für die finale Vertragsabrechnung

Im Modul Revenue steht ein neuer, manuell erstellbarer Finanzdokumenttyp zur Verfügung: das MDCR (Manual Financial Document Contract Review). Es dient dazu, die finanzielle Position eines Vertrags abzuschließen, sei es zum Vertragsende oder bei vorzeitiger Beendigung. Der Dokumenttyp ist sowohl für Leasingverträge als auch für Nicht-Leasingverträge nutzbar. Ein MDCR bildet eine abschließende Abrechnung ab, die die Differenz zwischen dem tatsächlich Verbrauchten bzw. Geschuldeten und dem Vertraglich Vereinbarten ausgleicht. Typische Beispiele sind eine Mehrkilometerabrechnung bei einem Servicevertrag, der Restsaldo bei vorzeitiger Fahrzeugrückgabe in einem Leasingvertrag oder eine Vertragsstrafe bei vorzeitiger Kündigung.

Die Berechnung des Betrags erfolgt nicht in oneSCM, sondern außerhalb des Systems, da jeder Vertragstyp und jeder Markt eigene Regeln besitzt, etwa Preis pro Kilometer, Prozentsätze für Strafzahlungen, Kilometerobergrenzen oder Datenbankberechnungen im Leasing. Das MDCR dient ausschließlich dazu, den bereits berechneten Betrag zu erfassen und zu exportieren. Eine Automatisierung der Berechnungslogik ist damit nicht verbunden.

Ein MDCR wird von Benutzern der Rollen MO bzw. MPC im Bereich der Finanzdokumente eines Vertrags angelegt, sobald der Abrechnungsbetrag extern ermittelt wurde. Es wird keine neue Benutzerrolle eingeführt; es gelten die bestehenden Berechtigungen zur manuellen Dokumenterstellung. Beim Anlegen wählen Sie, ob das MDCR als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden) erstellt wird. Für Gutschriften gibt es keine Einschränkung. Anschließend erfassen Sie den extern berechneten Nettobetrag sowie einen Positionstext, der die Berechnung beschreibt, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Die Felder „Dokument von“ und „Dokument bis“ sind bei einem MDCR optional, da es keinen Abrechnungszeitraum darstellt.

Das MDCR durchläuft den üblichen Dokumentenlebenszyklus (Erstellt → Akzeptiert → Exportiert → FI-Dokument erstellt → …) und wird über den Standard-Exportjob E169/CoFiCo verarbeitet. Der Positionstext wird dabei in der Positionszeile der Exportdatei mitgeliefert.

Für MBLD-Verträge gilt eine zusätzliche Regel: MDCR-Dokumente werden anhand des Vertriebskanals Leasing und des Dokumenttyps MDCR ausgewählt und per API an MBLD übermittelt. MDCR-Dokumente von Nicht-Leasingverträgen werden nicht an MBLD gesendet.

Mit dem neuen Dokumenttyp entfallen die bisher üblichen, uneinheitlich benannten manuellen Dokumente für Vertragsende und vorzeitige Beendigung, die teamübergreifend zu Unklarheiten darüber führten, welches Dokument eine Schlussabrechnung darstellt. Durch die klaren Routingregeln gelangen Leasing-Endabrechnungsdaten zuverlässig zu MBLD.