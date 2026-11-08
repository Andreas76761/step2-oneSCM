# Batch 265 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Änderung des Rechnungsstatus**

Der Status einer Rechnung steuert, ob ein Vertrag gesperrt oder aktiviert wird. Da NACOS nicht melden kann, ob eine Rechnung rechtzeitig oder verspätet bezahlt wurde oder sich in einer bestimmten Mahnstufe befindet, können Rechnungsstatus manuell geändert werden. Andere Finanzsysteme (FI-Systeme) liefern diese Statusinformationen detaillierter. Sobald ein FI-System die Status automatisch setzt, läuft der gesamte Ablauf ohne manuelle Eingriffe.

Um den Status einer Rechnung zu ändern, öffnet der Market-Operation-Benutzer im Admin-Menü die Seite „Invoice". Für Rechnungen mit dem Status „FI Document Created", „Paid in time", „Paid Overdue", „Dunning Level 1", „Dunning Level 2" oder „Dunning Level 3" steht die Option „Change status" zur Verfügung. Nach Auswahl dieser Option öffnet sich ein Popup mit dem Titel „Status Change" und der Frage, ob der Status der Rechnung wirklich geändert werden soll.

In diesem Popup ist im Dropdown-Feld „Invoice status" ein neuer Status per Einzelauswahl festzulegen (Pflichtfeld). Zur Auswahl stehen „Paid on time", „Paid overdue", „Dunning level 1", „Dunning level 2" und „Dunning level 3". Wählt der Benutzer „Dunning level 3", erscheint der Hinweis „Based on your selection the contract will be suspended". Zusätzlich ist im Pflichtfeld „Reason" eine Begründung einzugeben, die mindestens 10 und höchstens 150 Zeichen lang sein muss.

Mit „Cancel" wird das Popup geschlossen und der Benutzer kehrt zur Rechnungstabelle zurück. Die Schaltfläche „Confirm" ist erst aktiv, wenn ein Rechnungsstatus ausgewählt und eine gültige Begründung eingegeben wurde. Bei Bestätigung wird die Begründung in der Änderungshistorie des Status gespeichert, der Rechnungsstatus auf den gewählten Wert gesetzt und das Popup geschlossen, woraufhin der Benutzer zur Rechnungstabelle zurückkehrt.

Wird eine Rechnung auf „Dunning level 3" gesetzt, wird das Vertragsmanagement benachrichtigt; diese Benachrichtigung dient dazu, den oder die Verträge zu sperren. Befinden sich für denselben Vertrag mehrere Rechnungen in „Dunning level 3", wird das Vertragsmanagement erst dann erneut benachrichtigt, wenn die letzte Rechnung dieses Vertrags in diesem Status auf „Paid on time", „Paid overdue", „Dunning level 1" oder „Dunning level 2" geändert wird. Diese Benachrichtigung dient dazu, den oder die Verträge wieder zu aktivieren.

Nach erfolgreicher Änderung erscheint die Meldung „Status for invoice <INVOICE_NUMBER> was successfully updated". Kann der Status nicht aktualisiert werden, wird die Fehlermeldung „Status for invoice <INVOICE_NUMBER> could not be updated." angezeigt. Diese Fehlermeldung enthält eine Schaltfläche „Close" und bleibt sichtbar, bis der Market-Operation-Benutzer sie schließt.

**Stornierung von Rechnungen bei Kündigung eines aktiven Vertrags**

Ein Vertrag kann nach seiner Aktivierung noch innerhalb eines gesetzlich begrenzten Zeitraums vom Kunden storniert werden. Das wirkt sich auf den Zahlungsplan aus, da dieser bei der Aktivierung des Vertrags erzeugt wird. Wird der Vertrag storniert, passt sich der Zahlungsplan an, wobei zwei Fälle zu unterscheiden sind.

Wurde noch keine Rechnung an das FI-System übermittelt, werden alle Rechnungen des Zahlungsplans auf den Status „Cancelled" gesetzt und nicht mehr an das FI-System gesendet. Als Grund wird „Contract cancellation" hinterlegt.

Wurde mindestens eine Rechnung an das FI-System übermittelt, wird für jede Rechnung bzw. Gutschrift mit dem Status „Paid" (Paid on time oder Paid overdue) automatisch eine Gutschrift bzw. Rechnung mit denselben Angaben erzeugt: gleicher Empfänger, gleicher Nettobetrag und gleicher Rechnungszeitraum. Als Rechnungsreferenz dient die FI-Rechnungsnummer der bezahlten Rechnung; der Rechnungstyp ist MPPI bzw. MANU. Die bezahlte Rechnung bleibt unverändert. Die neu erzeugte Rechnung wird im Kundenbereich der Rechnungen mit dem Status „Planned" angezeigt. Rechnungen in den Status „Planned", „Accepted", „Exported", „FI Document Created" oder „Dunning Level 1", „2" und „3" werden storniert.

Zu beachten ist: Für NACOS wird die Gutschrift manuell erstellt. Der Prozess läuft für NACOS automatisch, wenn der Rechnungsstatus zuvor manuell auf „Paid" gesetzt und anschließend der Vertrag storniert wird.

**Korrektur einer Rechnung**

Für diese Funktion („Create correction for invoice") liegen in den bereitgestellten Rohdaten keine inhaltlichen Angaben vor, sondern lediglich die Überschrift. Ein Handbuchtext kann daher ohne weitere Informationen nicht verfasst werden, ohne Inhalte zu erfinden. Bitte stellen Sie hierfür Beschreibung, Zielzustand und Akzeptanzkriterien bereit.