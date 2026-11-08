# Batch 48 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Im Bereich Revenue Management steht ein neuer manuell erstellbarer Finanzbeleg zur Verfügung: das MDCR (Manual Financial Document Contract Review). Er dient dazu, die finanzielle Position eines Vertrags abzuschließen, entweder zum Vertragsende oder bei vorzeitiger Beendigung, und ist sowohl für Leasingverträge als auch für Nicht-Leasingverträge nutzbar. Ein MDCR bildet eine abschließende Verrechnung ab, die die Differenz zwischen dem tatsächlich Verbrauchten bzw. Geschuldeten und dem vertraglich Vereinbarten ausgleicht. Typische Beispiele sind eine Mehrkilometerabrechnung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe in einem Leasingvertrag oder eine Vertragsstrafe bei vorzeitiger Beendigung.

Die Berechnung des Betrags erfolgt weiterhin außerhalb von oneSCM, da jeder Vertragstyp und jeder Markt eigene Regeln hat, etwa Preise pro Kilometer, Strafprozentsätze, Kilometerobergrenzen oder Datenbankberechnungen im Leasing. Das System automatisiert diese Berechnung nicht, sondern stellt einen einheitlichen Belegtyp sowie eine Erstellungs- und Exportstrecke bereit, um den bereits berechneten Betrag zu erfassen und zu exportieren.

Die Erstellung eines MDCR richtet sich an Benutzer der Rollen MO und MPC. Sie lösen die Erstellung im Bereich der Finanzbelege eines Vertrags aus, nachdem sie den Abrechnungsbetrag extern ermittelt haben. Es wird keine neue Rolle eingeführt; es gelten die bereits vorhandenen Berechtigungen zur manuellen Belegerstellung.

Beim Anlegen wählt der Benutzer, ob das MDCR als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden) erstellt wird. Für Gutschriften gibt es keine Einschränkung. Anschließend erfasst der Benutzer manuell den extern berechneten Nettobetrag sowie einen Positionstext, der die Berechnung beschreibt, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR". Die Felder für den Rechnungszeitraum („Beleg von“ und „Beleg bis“) sind optional, weil ein MDCR keinen Abrechnungszeitraum darstellt.

Das MDCR durchläuft den üblichen Belegslebenszyklus (Erstellt → Akzeptiert → Exportiert → FI-Beleg erstellt → …) und wird über den Standard-Exportjob E169/CoFiCo exportiert. Dabei wird der Positionstext in die exportierte Position der Exportdatei übernommen.

Für MBLD-Verträge gilt zusätzlich: MDCR-Belege werden anhand des Vertriebskanals „Leasing“ und des Belegtyps MDCR ausgewählt und per API an MBLD übermittelt. MDCR-Belege von Nicht-Leasingverträgen werden nicht an MBLD gesendet.

Der neue Belegtyp ersetzt bisherige, uneinheitlich benannte manuelle Belege für Vertragsende und vorzeitige Beendigung und schafft damit Klarheit darüber, welcher Beleg eine Schlussabrechnung darstellt. Zudem stellt die eindeutige Kennzeichnung und Weiterleitung sicher, dass Endsaldo-Daten aus Leasingverträgen zuverlässig bei MBLD ankommen.