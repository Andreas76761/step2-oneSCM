# Batch 176 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Ausgehende Rechnungsdatei: Operation-ID statt Merchant Reference

In der Struktur der ausgehenden Rechnungsdatei (Outbound Invoice File) wird anstelle der bisherigen Merchant Reference nun die Operation-ID ausgegeben. Diese Änderung gilt für die Zahlungsarten Kreditkarte, Net Banking und UPI und wurde für die Belegarten MPPI (einmalige Zahlung), MANU als Gutschrift (Credit Note) und MANU als Rechnung (Invoice) geprüft. Für die Kreditkarte ist außerdem die Variante MPPI über Cofico berücksichtigt, daneben jeweils die Variante über SWT. Die Prüfung stellt sicher, dass die Datei die Operation-ID an der Stelle enthält, an der zuvor die Merchant Reference stand.

Für die Prüfung wird in der Regel zunächst ein Vertrag für einen Kunden angelegt und aktiviert, dessen hinterlegte Zahlungsart der jeweils zu prüfenden Zahlungsart entspricht, also Kreditkarte, Net Banking oder UPI. Bei MPPI-Zahlungen handelt es sich dabei um einen Vertrag mit einmaliger Zahlung.

Rückerstattung über MPay bei Vertragskündigung

Wird ein aktiver Vertrag innerhalb der Kulanzfrist (Grace Period) gekündigt und wurden die ersten Zahlungen über MPay abgewickelt, erfolgt die Rückerstattung automatisiert. Ziel ist eine reibungslose und zeitnahe Erstattung an den Kunden. Bisher erzeugte das System bei einer Kündigung innerhalb der Kulanzfrist automatisch eine Gutschrift, um bereits bezahlte Rechnungen auszugleichen. Mit der Einführung von MPay als Zahlungsabwicklung stößt das System zusätzlich eine Erstattungstransaktion über MPay an, um dem Kunden den Betrag zurückzuzahlen.

Die Gutschrift wird im Reiter „Kundenrechnung“ (Customer Invoice) mit folgenden Angaben angelegt: Der Flow-Typ lautet „Periodically payment“, als oneSCM-Rechnungsnummer wird die oneSCM-Rechnungsnummer eingetragen, die Verarbeitungsnummer (Processing Number) bleibt leer. Als Belegart wird „Credit“ verwendet, der Status ist „Created“ und der Kundenrechnungstyp lautet MPPI. Der Rechnungszeitraum reicht vom Startdatum bis zum Enddatum des Vertrags. Der Nettobetrag entspricht dem Betrag der MPPI-Rechnung, Rechnungsempfänger ist der Kundenname, und als Rechnungsreferenz wird die vom FI-System für die ursprüngliche Rechnung übermittelte Rechnungsnummer verwendet.

Sobald die Transaktion abgeschlossen ist, wird der zugehörige MPay-Status der Rechnung in oneSCM aktualisiert. Dabei bleibt der Rechnungsstatus „Exported“ bestehen; weitere Statusänderungen werden vom FI-System auf Basis des empfangenen Rechnungsfeedbacks ausgelöst. Beim Export dieser Gutschrift an das FI-System wird die Operation-ID der Erstattungstransaktion in der Exportdatei mitgesendet.

Die Funktion lässt sich anhand folgender Punkte nachvollziehen: Ein Mitarbeiter im Fuhrparkmanagement (MO) kann den Vertrag innerhalb der Kulanzfrist kündigen, sofern keine Schadensfälle (Claims) zum Vertrag vorliegen. Ist die Kundenrechnung bereits exportiert, erzeugt das System automatisch die Gutschrift. Die Erstattungstransaktion wird angestoßen und der Kunde erhält das Geld zurück. Zudem wird der MPay-Status der zugehörigen Rechnung in oneSCM aktualisiert.