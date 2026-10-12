# Batch 62 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Abschluss der finanziellen Position eines Vertrags mit MDCR-Dokumenten

Hinweis zum Status: Die hier beschriebene Funktion befindet sich noch in der Refinement-Phase. Die Angaben können sich bis zur Umsetzung noch ändern.

Im Modul Revenue wird ein neuer Dokumenttyp eingeführt, mit dem die finanzielle Position eines Vertrags abgeschlossen werden kann, entweder zum Vertragsende oder bei vorzeitiger Beendigung. Der Dokumenttyp ist sowohl für Leasingverträge als auch für Verträge ohne Leasing nutzbar. Das Dokument bildet eine Schlussabrechnung ab, entweder als Rechnung bzw. Belastung oder als Gutschrift bzw. Erstattung. Es gleicht die Differenz zwischen dem tatsächlich Verbrauchten oder Geschuldeten und dem vertraglich Vereinbarten aus. Typische Beispiele sind eine Kilometerüberschreitung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe in einem Leasingvertrag oder eine Vertragsstrafe bei vorzeitiger Beendigung.

Die Berechnung des Betrags erfolgt außerhalb von oneSCM, da jeder Vertragstyp und jeder Markt eigene Regeln hat, etwa Preis pro Kilometer, Prozentsätze für Vertragsstrafen, Kilometerobergrenzen oder Datenbankberechnungen im Leasing. oneSCM automatisiert diese Berechnung nicht. Stattdessen bietet das System einen einheitlichen Dokumenttyp sowie einen Erstellungs- und Exportprozess, um den bereits berechneten Betrag zu erfassen und zu exportieren.

Das Dokument wird manuell von Benutzern der Rollen MO bzw. MPC im Bereich der Finanzdokumente eines Vertrags angelegt, nachdem sie den Abrechnungsbetrag extern ermittelt haben. Es wird keine neue Benutzerrolle eingeführt. Die Erstellung nutzt die bereits vorhandenen Berechtigungen für die manuelle Dokumenterstellung.

Bei der Erstellung wählen Sie aus, ob das Dokument als Rechnung (Belastung des Kunden) oder als Gutschrift (Erstattung an den Kunden) angelegt wird. Für Gutschriften gibt es dabei keine Einschränkung. Sie erfassen manuell den extern berechneten Nettobetrag sowie einen Positionstext, der die Berechnung beschreibt, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR". Die Felder für den Rechnungszeitraum („Dokument von" und „Dokument bis") sind optional, da dieses Dokument keinen Abrechnungszeitraum darstellt.

Das Dokument durchläuft den üblichen Dokumentenlebenszyklus (Erstellt → Akzeptiert → Exportiert → FI-Dokument erstellt usw.) und wird über den Standard-Batchjob für E169/CoFiCo exportiert. Der Positionstext wird dabei in der Exportdatei in der Position des Dokuments mit übertragen.

Für MBLD-Verträge gilt eine Besonderheit: Hier werden Dokumente dieses Typs zusätzlich anhand des Vertriebskanals Leasing und des Dokumenttyps ausgewählt und per API an MBLD gesendet. Dokumente von Verträgen ohne Leasing werden nicht an MBLD übermittelt.

Mit dieser Funktion entfallen die bisherigen manuell erstellten Dokumente, die uneinheitlich benannt waren und teamübergreifend Unklarheit darüber verursachten, welcher Dokumenttyp eine Schlussabrechnung darstellt. Zudem wird sichergestellt, dass Endsaldo-Daten aus dem Leasing zuverlässig an MBLD gelangen, das als zwingender nachgelagerter Empfänger auf die korrekte Erkennung und Weiterleitung dieser Dokumente angewiesen ist.