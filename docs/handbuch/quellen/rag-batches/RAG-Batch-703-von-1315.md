# Batch 703 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Cost Management: Neuerungen und Änderungen**

**Manuelle Werkstattrechnungen: Entfall des Feldes „Rechnungspositionstext"**
Beim manuellen Erfassen einer Werkstattrechnung muss der Rechnungspositionstext nicht mehr eingegeben werden. Das Feld wurde ursprünglich eingeführt, um zusätzliche Details zu einzelnen Rechnungspositionen festzuhalten, hat sich aber als nicht mehr nützlich erwiesen. Es wird daher in der Erfassungsmaske entfernt, und auch die Tabelle der Rechnungspositionen enthält keine Spalte für diesen Text mehr. Alle übrigen Spalten bleiben unverändert. Rechnungen lassen sich ohne dieses Feld ohne Fehlermeldung anlegen und speichern. Die Änderung gilt für alle vier Typen von Werkstattrechnungen (Werkstattrechnung, SIVECO, Reimbursement und internationale Werkstattrechnungen aus dem Admin-Bereich). Da das Feld in der Oberfläche entfällt, wird es auch bei bereits bestehenden Rechnungen nicht mehr angezeigt.

**Altteilsteuer bei manuellen Werkstattrechnungen**
Beim manuellen Erfassen einer Werkstattrechnung mit Altteilsteuer berechnet das System die Werte automatisch, damit keine falschen Beträge aus der Papierrechnung übernommen und an das Finanzsystem übermittelt werden. Der Benutzer erfasst weiterhin die Altteilsteuer-Basis anhand der Papierrechnung. Daraus ermittelt das System die beiden Felder „Berechnungsbasis" und „Altteilsteuer", füllt sie vorab aus und sperrt sie für Änderungen, sodass sie nicht überschrieben werden können.

Die Berechnungsbasis ergibt sich aus der Altteilsteuer-Basis geteilt durch 10, gerundet auf zwei Nachkommastellen. Beispiel: Bei einer Basis von 257,56 ergibt sich 25,756 und gerundet 25,76. Die Altteilsteuer wird aus der gerundeten Berechnungsbasis multipliziert mit dem zum Reparaturdatum gültigen Mehrwertsteuersatz berechnet und ebenfalls auf zwei Nachkommastellen gerundet. Beispiel: 25,76 × 19 % = 4,8944, gerundet 4,89.

Im deutschen Sprachmodell wurde zudem die Feldbezeichnung „Altteilsteuer-Base" in „Altteilsteuer - Grundbetrag" umbenannt.

Außerdem werden manuell erfasste Altteilsteuern jetzt zuverlässig unter Admin-Bereich → Financial Control → Old Part Taxes - Manual angezeigt. Dafür genügt es, dass mindestens eines der beiden Felder („Old Part Tax" oder „Old Part Tax - Base") ausgefüllt ist. Ist ein Feld leer, bleibt die zugehörige Spalte auf der Seite ebenfalls leer.

**Ansichtsmodus für Schadencodes**
HQ-Admin-Benutzer können den Inhalt eines Schadencodes nun einsehen, ohne in den Bearbeitungsmodus zu wechseln. Die Ansichtsfunktion steht für alle Schadencodes in der Spalte „Aktion" unter Admin-Bereich → VEGA Codes → Damage Codes zur Verfügung. Zusätzlich ist der Schadencode in der Tabelle als Link zum Ansichtsmodus ausgeführt. In der Ansicht schließt „Cancel" den Ansichtsmodus, und mit „Back" gelangt man zurück, um Werte zu ändern.

**Korrekturen**
Eine Preisminderungsrechnung wird nach dem Anlegen jetzt sofort in der Tabelle angezeigt und nicht mehr erst nach einer Aktualisierung der Seite. Ebenso wurde ein Problem behoben, durch das sich eine Kundenerstattungsrechnung (Customer Reimbursement) nicht anlegen ließ.