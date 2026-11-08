# Batch 56 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Im Bereich Revenue Management steht ein neuer manuell erstellbarer Finanzbeleg zur Verfügung: das MDCR (Manual Financial Document Contract Review). Es dient dazu, die finanzielle Position eines Vertrags abzuschließen, entweder zum Vertragsende oder bei vorzeitiger Beendigung. Der Beleg ist sowohl für Leasingverträge als auch für Nicht-Leasingverträge nutzbar. Er bildet eine abschließende Abrechnung ab, also eine Rechnung bzw. Belastung oder eine Gutschrift bzw. Erstattung, die die Differenz zwischen dem tatsächlich Verbrauchten oder Geschuldeten und dem Vereinbarten ausgleicht. Typische Beispiele sind eine Mehrkilometerabrechnung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe in einem Leasingvertrag oder eine Vertragsstrafe bei vorzeitiger Kündigung.

Die eigentliche Berechnung erfolgt außerhalb von oneSCM, da jede Vertragsart und jeder Markt eigene Regeln hat, etwa Preis pro Kilometer, Strafzahlungsprozentsätze, Kilometerobergrenzen oder Datenbankberechnungen im Leasing. oneSCM berechnet den Betrag nicht, sondern stellt einen einheitlichen Belegtyp samt Erstellungs- und Exportprozess bereit, mit dem der bereits berechnete Betrag erfasst und exportiert werden kann.

Die Erstellung des MDCR erfolgt durch Benutzer der Rollen MO bzw. MPC im Bereich der Finanzbelege eines Vertrags, sobald sie den Abrechnungsbetrag extern ermittelt haben. Es wird keine neue Benutzerrolle eingeführt; es gelten die bereits vorhandenen Berechtigungen für die manuelle Belegerstellung.

Bei der Erstellung wählen Sie, ob das MDCR als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden) angelegt wird. Für Gutschriften gibt es keine Einschränkung. Anschließend erfassen Sie manuell den extern berechneten Nettobetrag sowie einen Positionstext, der die Berechnung beschreibt, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Die Felder für den Rechnungszeitraum („Beleg von“ und „Beleg bis“) sind beim MDCR optional, da der Beleg keinen Abrechnungszeitraum darstellt.

Das MDCR durchläuft den üblichen Belegprozess (Erstellt → Akzeptiert → Exportiert → FI-Beleg erstellt usw.) und wird über den standardmäßigen E169/CoFiCo-Exportjob exportiert. Der Positionstext wird dabei in die exportierte Position der Exportdatei übernommen.

Für Verträge des Kunden MBLD gilt eine Besonderheit: MDCR-Belege werden zusätzlich anhand des Vertriebswegs (Leasing) und des Belegtyps (MDCR) ausgewählt und per API an MBLD übermittelt. MDCR-Belege von Nicht-Leasingverträgen werden nicht an MBLD gesendet.

Mit dem neuen Belegtyp entfallen die bisher uneinheitlich benannten, manuell erstellten Belege für Vertragsende und vorzeitige Beendigung, die zu Unklarheiten zwischen den Teams geführt haben. Zudem stellen die klaren Routing-Regeln sicher, dass Endsaldo-Daten aus dem Leasing zuverlässig an MBLD gelangen.