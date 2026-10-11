# Batch 95 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Abschlussdokument für die finanzielle Vertragsabrechnung (MDCR)

Im Modul Revenue steht künftig ein einheitlicher Dokumenttyp zur Verfügung, mit dem die finanzielle Position eines Vertrags zum Vertragsende oder bei vorzeitiger Beendigung abgeschlossen wird. Er gilt sowohl für Leasingverträge als auch für Nicht-Leasingverträge. Das Dokument bildet eine abschließende Abrechnung ab, also eine Rechnung bzw. Belastung oder eine Gutschrift bzw. Rückerstattung. Sie gleicht die Differenz zwischen dem tatsächlich Verbrauchten oder Geschuldeten und dem vertraglich Vereinbarten aus. Typische Beispiele sind eine Kilometer-Mehrleistung bei einem Servicevertrag, der Endsaldo bei vorzeitiger Fahrzeugrückgabe in einem Leasingvertrag oder eine Vertragsstrafe bei vorzeitiger Kündigung.

Die Berechnung des Betrags erfolgt außerhalb von oneSCM, da jede Vertragsart und jeder Markt eigene Regeln hat, etwa Preis pro Kilometer, Prozentsätze für Vertragsstrafen, Kilometerobergrenzen oder Datenbankberechnungen im Leasing. oneSCM automatisiert diese Berechnung nicht. Das System stellt stattdessen einen klar definierten Dokumenttyp sowie einen Erstellungs- und Exportprozess bereit, um den bereits berechneten Betrag zu erfassen und zu exportieren.

Das Dokument wird von Mitarbeitenden in den Rollen MO bzw. MPC manuell im Bereich der Finanzdokumente eines Vertrags erstellt, sobald sie den Abrechnungsbetrag extern ermittelt haben. Es wird keine neue Benutzerrolle eingeführt. Es gelten die bestehenden Berechtigungen für die manuelle Dokumenterstellung.

Bei der Erstellung wählen Anwenderinnen und Anwender, ob das Dokument als Rechnung (Belastung des Kunden) oder als Gutschrift (Rückerstattung an den Kunden) angelegt wird. Für Gutschriften gibt es keine Einschränkung. Anschließend wird der Nettobetrag eingegeben, der zuvor extern berechnet wurde. Zusätzlich wird ein Positionstext erfasst, der die Berechnung beschreibt, zum Beispiel: „12.500 km gefahren − 10.000 km vereinbart = 2.500 km × 0,15 EUR/km = 375,00 EUR“. Die Felder für den Rechnungszeitraum („Dokument von“ und „Dokument bis“) sind optional, da dieses Dokument keinen Abrechnungszeitraum darstellt.

Das Dokument durchläuft den üblichen Dokumentenlebenszyklus (Erstellt, Akzeptiert, Exportiert, FI-Beleg erstellt und weitere Schritte) und wird über den Standard-Exportlauf E169/CoFiCo übertragen. Der Positionstext wird dabei als Teil der exportierten Position in die Exportdatei übernommen.

Für MBLD-Verträge gilt eine Besonderheit: Hier werden die Dokumente zusätzlich anhand des Vertriebskanals Leasing und des Dokumenttyps MDCR ausgewählt und per API an MBLD gesendet. Dokumente von Nicht-Leasingverträgen werden nicht an MBLD übermittelt.

Der Nutzen liegt in einer einheitlichen Handhabung: Vertragsende und vorzeitige Beendigung sind häufige Ereignisse, für die bisher uneinheitlich benannte, manuell erstellte Dokumente genutzt wurden. Das führte zu Unklarheit zwischen den Teams, welcher Dokumenttyp eine Schlussabrechnung darstellt. Zudem können Leasing-Endsaldodaten MBLD nur dann zuverlässig erreichen, wenn die Dokumente eindeutig erkannt und korrekt weitergeleitet werden.

Hinweis zur Quelle: In den Rohdaten werden die Bezeichnungen FDCR und MDCR sowie der Status „in Refinement“ verwendet. Die Abschnitte zu Ist-Zustand, Zielzustand, Akzeptanzkriterien, Testfällen und Risiken enthalten keine Angaben. Die Überschrift des Tickets („Hard gate fail – missing required fields“) wird durch den Beschreibungstext nicht näher erläutert und ist daher hier nicht berücksichtigt.