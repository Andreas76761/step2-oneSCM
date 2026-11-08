# Batch 273 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 8 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Release-Hinweise für das Benutzerhandbuch**

**Sammelrechnung auf Vertragsebene**

Kunden mit mehreren Servicverträgen können künftig wählen, ob sie je Vertrag eine eigene Rechnung, eine gemeinsame Rechnung für alle Servicverträge oder eine kombinierte Variante erhalten. Diese Einstellung lässt sich auch bei der Erstellung eines neuen Servicevertrags treffen, unabhängig von der Auswahl, die zuvor auf Kundenebene getroffen wurde.

Bei der Vertragserstellung gilt für neue Kunden Folgendes: Im Schritt 2 „Customer & Payment Information" steht der Schalter „Global Collective Invoice" zur Verfügung. Er ist für neue Kunden bearbeitbar und standardmäßig auf „Yes" gesetzt, alternativ kann „No" gewählt werden. Im Schritt 3 „Overview & Confirmation" erscheint der Schalter „Collective Invoices". Sein Wert wird standardmäßig aus der Auswahl für „Global Collective Invoice" aus Schritt 2 übernommen. Für neue Kunden ist dieser Schalter nicht bearbeitbar. Mögliche Werte sind „Included" und „Excluded".

Für bestehende Kunden ist „Global Collective Invoice" im Schritt 2 nicht bearbeitbar. Der Schalter „Collective Invoices" wird hier standardmäßig anhand der Einstellung „Global Collective Invoice" aus der Kundenverwaltung vorbelegt und ist bearbeitbar. Ist der Schalter aktiv, gilt „Included", ist er inaktiv, gilt „Excluded". Eine Änderung wirkt sich nicht auf „Global Collective Invoice" auf Kundenebene aus.

Auch in der Vertragsverwaltung ist die Einstellung verfügbar: Im Reiter „Payment" wird der Schalter „Collective Invoices" mit dem Wert angezeigt, der bei der Vertragserstellung gewählt wurde. Er kann dort während der Laufzeit des Vertrags geändert werden. Die Änderung betrifft ausschließlich den jeweiligen Vertrag. Weder die Einstellung „Global Collective Invoice" auf Kundenebene noch die Einstellungen anderer Verträge des Kunden werden dadurch beeinflusst. Umgekehrt wird „Collective Invoices" nicht automatisch durch „Global Collective Invoice" überschrieben. So kann ein Kunde mit mehreren Servicverträgen einzelne Verträge als Sammelrechnung führen und andere nicht, indem er den Schalter manuell umstellt. Das Revenue Management berücksichtigt für jeden Kunden den Wert des Attributs „Collective Invoices" jedes einzelnen Vertrags. Die Oberfläche folgt der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Steuerverwaltung**

In der Steuerverwaltung (Tax Management) steht die Funktion zum Anlegen einer neuen Steuerklassifizierung zur Verfügung, einschließlich einer Schaltfläche zum Abbrechen des Vorgangs.

**Fehlerbehebungen**

Die Darstellung des Rechnungsstatus in der Kundenrechnungsansicht wurde korrigiert. Außerdem wurden mehrere technische Probleme behoben: ein Fehler beim Start der Anwendung aufgrund einer fehlgeschlagenen Validierung der Datenbankmigration, ein Fehler, bei dem der Aufruf eines Vertrags zu der Meldung „Customer/Contract not found" führte, sowie ein Problem mit dem Speicherort eines Ordners im S3-Ablagesystem.

**Hinweis zu nicht umgesetzten Funktionen**

Die geplante Vorschau des Zahlungsplans bei der Vertragserstellung wurde nicht umgesetzt (Status „Cancelled") und ist daher in dieser Version nicht verfügbar.