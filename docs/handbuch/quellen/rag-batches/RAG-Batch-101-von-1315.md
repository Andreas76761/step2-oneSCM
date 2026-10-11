# Batch 101 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Abschluss der finanziellen Vertragsposition mit dem Dokumenttyp MDCR

Im Modul Revenue steht ein einheitlicher Dokumenttyp zur Verfügung, mit dem die finanzielle Position eines Vertrags abgeschlossen werden kann, sei es zum Vertragsende oder bei vorzeitiger Beendigung. Der Dokumenttyp gilt sowohl für Leasingverträge als auch für Nicht-Leasingverträge. Er bildet eine Endabrechnung ab, also eine Rechnung beziehungsweise Belastung oder eine Gutschrift beziehungsweise Erstattung. Diese gleicht die Differenz zwischen dem tatsächlich Verbrauchten oder Geschuldeten und dem Vertraglich Vereinbarten aus. Typische Beispiele sind eine Kilometerüberschreitung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe in einem Leasingvertrag oder eine Vertragsstrafe bei vorzeitiger Beendigung.

Die Berechnung des Betrags erfolgt außerhalb von oneSCM, da jeder Vertragstyp und jeder Markt eigene Regeln hat, etwa Preis pro Kilometer, Prozentsätze für Strafen, Kilometerobergrenzen oder Datenbankberechnungen im Leasing. oneSCM automatisiert diese Berechnung nicht. Stattdessen bietet das System einen klar definierten Dokumenttyp sowie einen Erstellungs- und Exportprozess, um den bereits berechneten Betrag zu erfassen und zu exportieren.

Das Dokument wird von Benutzern der Rollen MO und MPC im Bereich der Finanzdokumente eines Vertrags manuell angelegt, nachdem sie den Abrechnungsbetrag extern ermittelt haben. Es wird keine neue Benutzerrolle eingeführt. Für die Erstellung gelten die bestehenden Berechtigungen zur manuellen Dokumentenerstellung, die MO und MPC in diesem Bereich bereits haben.

Bei der Erstellung wählen die Benutzer, ob das Dokument als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden) angelegt wird. Für Gutschriften besteht keine Einschränkung. Außerdem erfassen sie manuell den extern berechneten Nettobetrag und einen Positionstext, der die Berechnung beschreibt, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Die Felder für den Rechnungszeitraum („Dokument von“ und „Dokument bis“) sind optional, da ein solches Dokument keinen Abrechnungszeitraum darstellt.

Nach der Erstellung durchläuft das Dokument den üblichen Dokumentenlebenszyklus (Erstellt → Akzeptiert → Exportiert → FI-Dokument erstellt usw.) und wird über den Standard-Exportjob E169/CoFiCo verarbeitet. Der Positionstext wird dabei in die Position der Exportdatei übernommen.

Für Verträge von MBLD gelten zusätzliche Regeln. Solche Dokumente werden anhand des Vertriebskanals Leasing und des Dokumenttyps MDCR ausgewählt und über eine Schnittstelle an MBLD übermittelt. MDCR-Dokumente von Nicht-Leasingverträgen werden nicht an MBLD gesendet.

Der neue Dokumenttyp ersetzt bisherige, uneinheitlich benannte manuelle Dokumente für Vertragsende und vorzeitige Beendigung. Damit wird eindeutig, welches Dokument eine Endabrechnung darstellt. Zudem können Endsaldodaten aus dem Leasing zuverlässig an MBLD weitergegeben werden.