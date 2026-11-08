# Batch 107 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Abschlussdokument zur finanziellen Vertragsprüfung (MDCR) im Bereich Revenue

Im Modul Revenue steht ein neuer, einheitlicher Dokumenttyp zur Verfügung, mit dem die finanzielle Position eines Vertrags abgeschlossen werden kann, sei es zum regulären Vertragsende oder bei vorzeitiger Beendigung. Das Dokument, das manuell erstellt wird und als Manual Financial Document Contract Review (MDCR) bezeichnet wird, lässt sich sowohl für Leasingverträge als auch für Nicht-Leasingverträge verwenden. Es bildet eine abschließende Abrechnung ab, die die Differenz zwischen dem tatsächlich Verbrauchten bzw. Geschuldeten und dem vertraglich Vereinbarten ausgleicht. Typische Anwendungsfälle sind eine Mehrkilometerabrechnung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe im Leasing oder eine Vertragsstrafe bei vorzeitiger Kündigung.

Die eigentliche Berechnung des Betrags erfolgt außerhalb von oneSCM, da jeder Vertragstyp und jeder Markt eigene Regeln besitzt, etwa Preise pro Kilometer, Prozentsätze für Vertragsstrafen, Kilometerobergrenzen oder Datenbankberechnungen im Leasing. Das System automatisiert diese Berechnung nicht. Es stellt stattdessen einen klar definierten Dokumenttyp sowie einen Erstellungs- und Exportprozess bereit, mit dem der bereits berechnete Betrag erfasst und exportiert wird.

Die Erstellung des Dokuments erfolgt durch Anwender der Rollen MO bzw. MPC im Bereich der Finanzdokumente eines Vertrags, nachdem sie den Abrechnungsbetrag extern ermittelt haben. Es wird keine neue Benutzerrolle eingeführt; es gelten die bereits vorhandenen Berechtigungen für die manuelle Dokumenterstellung.

Bei der Erstellung wählt der Anwender, ob das Dokument als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden) angelegt wird. Für Gutschriften gibt es dabei keine Einschränkung. Der Anwender erfasst manuell den Nettobetrag, der extern berechnet wurde, sowie einen Positionstext, der die Berechnung beschreibt, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Die Felder für den Rechnungszeitraum („Dokument von“ und „Dokument bis“) sind optional, da ein MDCR keinen Abrechnungszeitraum darstellt.

Das Dokument durchläuft den üblichen Dokumentenlebenszyklus (Erstellt → Akzeptiert → Exportiert → FI-Dokument erstellt usw.) und wird über den standardmäßigen Exportjob E169/CoFiCo verarbeitet. Der Positionstext wird dabei in der Exportdatei als Teil der Belegposition mitgeliefert.

Für Verträge der MBLD gilt eine zusätzliche Regel: MDCR-Dokumente werden anhand des Vertriebskanals Leasing und des Dokumenttyps MDCR ausgewählt und per API an MBLD übermittelt. MDCR-Dokumente von Nicht-Leasingverträgen werden nicht an MBLD gesendet.

Der neue Dokumenttyp ersetzt bisherige, uneinheitlich benannte manuelle Dokumente für Vertragsende und vorzeitige Beendigung, die zu Unklarheiten darüber führten, welches Dokument eine Schlussabrechnung darstellt. Durch die klaren Routing-Regeln wird zudem sichergestellt, dass Endsaldo-Daten aus dem Leasing zuverlässig bei MBLD ankommen.