# Batch 98 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Abschlussrechnung bzw. Abschlussgutschrift für Verträge: das Dokument MDCR im Revenue-Modul

Hinweis: Dieser Funktionsumfang befindet sich derzeit noch in der Verfeinerung (Refinement). Die folgenden Angaben können sich bis zur Freigabe noch ändern.

Im Revenue-Modul wird ein neuer, manuell erstellter Finanzbeleg eingeführt, mit dem die finanzielle Position eines Vertrags abgeschlossen wird, entweder zum Vertragsende oder bei vorzeitiger Beendigung. Der Beleg MDCR (Manual Financial Document Contract Review) steht sowohl für Leasingverträge als auch für Nicht-Leasingverträge zur Verfügung. Er bildet eine Schlussabrechnung ab, die den Unterschied zwischen dem tatsächlich Verbrauchten bzw. Geschuldeten und dem vertraglich Vereinbarten ausgleicht. Typische Beispiele sind eine Mehrkilometerabrechnung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe in einem Leasingvertrag oder eine Vertragsstrafe bei vorzeitiger Kündigung.

Wichtig ist: Die Berechnung des Betrags erfolgt außerhalb von oneSCM, da jede Vertragsart und jeder Markt eigene Regeln hat, etwa Preis pro Kilometer, Prozentsätze für Vertragsstrafen, Kilometerobergrenzen oder Datenbankberechnungen im Leasing. oneSCM automatisiert diese Berechnung nicht, sondern stellt einen einheitlichen Belegtyp sowie einen Erstellungs- und Exportprozess bereit, um den bereits berechneten Betrag zu erfassen und zu exportieren.

Der Beleg wird von Benutzern der Rollen MO und MPC im Bereich der Finanzbelege eines Vertrags angelegt, sobald sie den Abrechnungsbetrag extern ermittelt haben. Es wird keine neue Rolle eingeführt; es gelten die bereits vorhandenen Berechtigungen zur manuellen Belegerstellung.

Bei der Erstellung wählen Benutzer, ob der MDCR als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden) angelegt wird. Für Gutschriften gibt es keine Einschränkung. Anschließend erfassen sie manuell den extern berechneten Nettobetrag sowie einen Positionstext, der die Berechnung beschreibt, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Die Felder für den Rechnungszeitraum („Beleg von“ und „Beleg bis“) sind beim MDCR optional, da er keinen Abrechnungszeitraum darstellt.

Der MDCR durchläuft den üblichen Belegstatus-Ablauf (Erstellt → Akzeptiert → Exportiert → FI-Beleg erstellt usw.) und wird über den Standard-Exportjob E169/CoFiCo exportiert. Dabei wird der Positionstext in die exportierte Belegposition der Exportdatei übernommen.

Für Verträge von MBLD gilt eine Besonderheit: MDCR-Belege werden zusätzlich anhand des Vertriebskanals (Leasing) und des Belegtyps (MDCR) ausgewählt und per API an MBLD übermittelt. MDCR-Belege von Nicht-Leasingverträgen werden nicht an MBLD gesendet.

Mit dem neuen Belegtyp entfallen die bisher uneinheitlich benannten manuellen Belege für Vertragsende und vorzeitige Beendigung, die zu Unklarheiten zwischen den Teams führten. Zudem wird sichergestellt, dass Leasing-Endsaldodaten zuverlässig bei MBLD ankommen.