# Batch 66 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Manuelle Abschlussbelege zur Vertragsprüfung (MDCR) im Bereich Revenue

Im Modul Revenue steht ein neuer, manuell erstellbarer Finanzbeleg zur Verfügung: die Manual Financial Document Contract Review (MDCR). Sie dient dazu, die finanzielle Position eines Vertrags abzuschließen, entweder zum Vertragsende oder bei vorzeitiger Beendigung. Der Beleg ist sowohl für Leasingverträge als auch für Nicht-Leasingverträge nutzbar. Er bildet eine Schlussabrechnung ab, also eine Rechnung bzw. Belastung oder eine Gutschrift bzw. Erstattung, die die Differenz zwischen dem tatsächlich Verbrauchten oder Geschuldeten und dem Vertraglich Vereinbarten ausgleicht. Typische Beispiele sind eine Mehrkilometerabrechnung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe in einem Leasingvertrag oder eine Vertragsstrafe bei vorzeitiger Kündigung. Bisher wurden solche Fälle über individuell und uneinheitlich benannte manuelle Belege erfasst, was teamübergreifend zu Unklarheiten darüber führte, welcher Belegtyp eine Schlussabrechnung darstellt. Die MDCR schafft hier einen einheitlichen, klar definierten Belegtyp.

Die Berechnung des Betrags erfolgt weiterhin außerhalb von oneSCM, da jede Vertragsart und jeder Markt eigene Regeln hat, etwa Preis pro Kilometer, Prozentsätze für Vertragsstrafen, Kilometerobergrenzen oder Datenbankberechnungen im Leasing. oneSCM berechnet den Betrag nicht, sondern erfasst und exportiert den bereits ermittelten Betrag.

Die MDCR wird von Mitarbeitenden in den Rollen MO bzw. MPC im Bereich der Finanzbelege eines Vertrags angelegt, nachdem sie den Abrechnungsbetrag extern berechnet haben. Es wird keine neue Benutzerrolle eingeführt. Es gelten die bestehenden Berechtigungen für die manuelle Belegerstellung, die MO und MPC dort bereits besitzen.

Beim Anlegen wählen Sie, ob die MDCR als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden) erstellt wird. Für Gutschriften gibt es keine Einschränkung. Anschließend erfassen Sie den extern berechneten Nettobetrag und einen Positionstext, der die Berechnung beschreibt, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Die Felder für den Rechnungszeitraum („Beleg von“ und „Beleg bis“) sind bei der MDCR optional, da sie keinen Abrechnungszeitraum darstellt.

Danach durchläuft die MDCR den üblichen Belegprozess (Erstellt → Akzeptiert → Exportiert → FI-Beleg erstellt usw.) und wird über den Standard-Exportjob E169/CoFiCo exportiert. Dabei wird der Positionstext in die exportierte Position der Exportdatei übernommen.

Für Verträge von MBLD gilt zusätzlich: MDCR-Belege werden anhand des Vertriebskanals Leasing in Verbindung mit dem Belegtyp MDCR ausgewählt und per API an MBLD übermittelt. Dadurch gelangen die Endsaldo-Daten aus dem Leasing zuverlässig zu MBLD, das diese Belege zwingend benötigt. MDCR-Belege von Nicht-Leasingverträgen werden nicht an MBLD gesendet.

Die MDCR baut auf der bestehenden manuellen Belegerstellung für Standardrechnungen und -gutschriften im Bereich der Finanzbelege eines Vertrags auf. Sie ergänzt diese um die Definition des Belegtyps, die Feld- und Lebenszyklusregeln sowie die Export- und Routinglogik für E169/CoFiCo und MBLD.