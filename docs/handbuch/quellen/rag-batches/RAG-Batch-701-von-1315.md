# Batch 701 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 25 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Cost Management: Werkstattrechnungen und Gutschriften**

Bei der manuellen Erfassung von Werkstattrechnungen wurde ein Fehler behoben: Wurde über den Pfad Vertrag, Zahlung, Werkstattrechnung eine bereits verarbeitete manuelle Werkstattrechnung storniert, blieb die Schaltfläche „Erstellen“ nach dem Ausfüllen der Pflichtangaben deaktiviert. Die neue manuelle Werkstattrechnung konnte dadurch nicht angelegt werden. Dieses Verhalten wurde korrigiert. Ebenfalls behoben wurde ein Problem, bei dem eine I156-Datei nicht korrekt verarbeitet wurde.

Für Werkstattrechnungen mit Altteilesteuer (Old Part Tax) wird geprüft, dass zwei Belege erzeugt werden: eine Rechnung mit den vom Benutzer erfassten Positionen und den Altteilesteuer-Werten sowie eine Gutschrift für den Altteilesteuer-Betrag. Voraussetzung für die Prüfung ist ein angelegter Vertrag. Zudem werden die Altteilesteuer-Felder bei der manuellen Erfassung von Werkstattrechnungen geprüft. Ein früher gemeldetes Verhalten, bei dem eine manuell erfasste Werkstattrechnung mit Altteilesteuer-Wert auch auf der Seite für manuelle Altteilesteuer angezeigt wurde, ohne dass die erwartete zweite Rechnung entstand, wurde abgebrochen und nicht weiterverfolgt.

Die Händlerprovision wird anhand des Rechnungsstatus geprüft. Dabei werden die Status „Geplant“, „Akzeptiert“, „Exportiert“, „FI-Dokument erstellt“ und „Bezahlt“ berücksichtigt. Als Voraussetzung dient jeweils ein Vertrag mit Händlerprovision im entsprechenden Status.

Für die Erstellung internationaler Rechnungen über den Admin-Bereich wird ein Feld „Division“ ergänzt, und zwar sowohl für den Bereich VAN als auch für den Bereich PC.

Darüber hinaus wird die Referenz auf die ursprüngliche Werkstattrechnung in Rechnungen und Gutschriften geprüft, jeweils in beide Richtungen, also in der Rechnung zur Gutschrift und in der Gutschrift zur Rechnung. Dies betrifft internationale Werkstattrechnungen und -gutschriften im Status „Exportiert“, Kundenerstattungen und SEVICO-Vorgänge sowie manuelle Werkstattrechnungen und -gutschriften. Je nach Szenario wird der Status „Verarbeitet“ oder „Exportiert“ betrachtet. Voraussetzung ist jeweils ein aktiver Vertrag, der durch einen MO-Benutzer aktiviert wurde. Bei Szenarien mit Status „Verarbeitet“ wurde der Vertrag von einem Affiliate-Händler angelegt, bei Szenarien mit Status „Exportiert“ von einem Nicht-Affiliate-Händler.