# Batch 90 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Abschlussdokument für die finanzielle Vertragsabrechnung (MDCR)

Im Modul Revenue steht ein neuer Dokumenttyp zur Verfügung, mit dem die finanzielle Position eines Vertrags bei Vertragsende oder bei vorzeitiger Beendigung abgeschlossen wird. Er kann sowohl für Leasingverträge als auch für Nicht-Leasingverträge verwendet werden. Das Dokument bildet eine abschließende Abrechnung ab, entweder als Rechnung bzw. Belastung oder als Gutschrift bzw. Erstattung. Es gleicht die Differenz zwischen dem tatsächlich Verbrauchten oder Geschuldeten und dem vertraglich Vereinbarten aus. Typische Beispiele sind eine Mehrkilometerabrechnung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe in einem Leasingvertrag oder eine Vertragsstrafe bei vorzeitiger Beendigung.

Die Berechnung des Betrags erfolgt außerhalb von oneSCM, da jede Vertragsart und jeder Markt eigene Regeln hat, etwa Preis pro Kilometer, Prozentsätze für Strafzahlungen, Kilometerobergrenzen oder Datenbankberechnungen im Leasing. oneSCM berechnet den Betrag nicht, sondern stellt einen einheitlichen Dokumenttyp sowie einen Erstellungs- und Exportprozess bereit, um den bereits berechneten Betrag zu erfassen und zu exportieren.

Das Dokument wird von Anwendern der Rollen MO und MPC im Bereich der Finanzdokumente eines Vertrags manuell angelegt, sobald sie den Abrechnungsbetrag extern ermittelt haben. Es wird keine neue Rolle eingeführt. Es gelten die bereits vorhandenen Berechtigungen zur manuellen Dokumenterstellung.

Bei der Erstellung wählt der Anwender, ob das Dokument als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden) angelegt wird. Für Gutschriften gibt es keine Einschränkung. Anschließend erfasst der Anwender manuell den extern berechneten Nettobetrag sowie einen Positionstext, der die Berechnung beschreibt, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR". Die Felder für den Rechnungszeitraum („Dokument von“ und „Dokument bis“) sind optional, weil ein solches Dokument keinen Abrechnungszeitraum darstellt.

Das Dokument durchläuft den üblichen Dokumentenlebenszyklus (Erstellt → Akzeptiert → Exportiert → FI-Dokument erstellt usw.) und wird über den Standard-Exportbatchjob E169/CoFiCo exportiert. Der Positionstext wird dabei in der Exportdatei als Teil der Positionszeile übergeben.

Für MBLD-Verträge gilt zusätzlich: Dokumente dieses Typs werden anhand des Vertriebskanals Leasing und des Dokumenttyps ausgewählt und per API an MBLD gesendet. Dokumente von Nicht-Leasingverträgen werden nicht an MBLD übermittelt.

Hintergrund ist, dass Vertragsende und vorzeitige Beendigung häufig vorkommen und bisher mit uneinheitlich benannten, manuell erstellten Dokumenten abgewickelt wurden. Das führte zu Unklarheit darüber, welcher Dokumenttyp eine Schlussabrechnung darstellt. Zudem ist MBLD im Leasing ein verpflichtender nachgelagerter Empfänger. Nur mit klaren Routingregeln können die Endsalden aus dem Leasing zuverlässig dort ankommen. Die manuelle Dokumenterstellung für Standardrechnungen und -gutschriften besteht bereits im Bereich Revenue. Der neue Dokumenttyp ergänzt diese um die Typdefinition, die Feld- und Lebenszyklusregeln sowie die Export- und Routinglogik.