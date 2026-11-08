# Batch 822 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 20 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Angebotsgültigkeit und automatische Statuswechsel**

Die Gültigkeit eines Angebots ist marktspezifisch konfigurierbar und kann beispielsweise 100, 33 oder 1000 Tage betragen. Für Verträge, die über den Prozess „Build to Order" bzw. „Build to Stock" angelegt werden, gilt eine Ausnahme: Der Vertrag im Status „Created" bleibt so lange gültig, bis das FRD und das Kennzeichen vorliegen, zuzüglich 30 Tagen. Die Angaben zur Angebotsgültigkeit sollen im Bereich Vertragsverwaltung angezeigt werden.

Innerhalb der Gültigkeitsdauer wechselt der Vertragsstatus automatisch. Unterschreibt der Kunde den Vertrag innerhalb der Angebotsgültigkeit (im Beispiel 100 Tage), wird der Vertrag auf „Waiting for Activation" gesetzt. Schlagen die MO-Prüfungen fehl und erfolgt innerhalb der Angebotsgültigkeit kein Aktivierungsversuch, wird der Vertrag automatisch auf „Rejected" gesetzt. Ebenso wird der Vertrag abgelehnt, wenn der Kunde ihn nicht innerhalb der Angebotsgültigkeit ab Erstellung unterschreibt und das Angebot somit abläuft.

**Löschung abgelaufener Angebote**

Vorgesehen ist, dass Verträge nach Ablauf des Angebots und einer zusätzlichen Frist von sechs Monaten gelöscht werden. Dies betrifft Verträge in den Status „Created", „Waiting for Confirmation" und „Confirmed". Diese Funktionen sind derzeit noch nicht umgesetzt.

**Zahlungsplan: Info-Symbol und Tooltip**

In der Vorschau des Zahlungsplans werden Monate, deren Zahlung auf die übrigen Raten umverteilt wurde, mit einem Betrag von 0 EUR angezeigt. Damit dieser Vorgang bei der Vertragserstellung nachvollziehbar ist, erscheint beim Überfahren der Zellen mit 0 EUR in der Spalte „Amount Gross" ein Tooltip mit dem Text „This month's payment is reallocated to the rest of the Payment Plan". Dies gilt sowohl in der Vertragsverwaltung als auch bei der Vertragserstellung.

**Aktivierung, Benachrichtigungen und Provision**

Bei der Aktivierung eines Vertrags sollen drei Parteien per E-Mail informiert werden: die MO, die den Vertrag erstellt hat, der zugewiesene Händler und der Endkunde. Sobald der Vertrag aktiv ist, wird zudem das Revenue-Team benachrichtigt, einschließlich der Informationen zum zugewiesenen Händler, damit Provision bzw. Rabatte berücksichtigt werden können. Nach Abschluss aller Schritte und der Aktivierung soll der zugewiesene Händler gegebenenfalls die Provision erhalten bzw. der Rabatt ausgezahlt werden. Der Vertrag erscheint in der Vertragsverwaltung, und die Aktivierungs-E-Mail wird versendet. Auch diese Funktionen sind noch offen.

**Dokumente hochladen**

Im Bereich Kommunikation bzw. Dokumente eines Vertrags soll für Händler-, MO- und MPC-Benutzer eine Schaltfläche „Upload" bereitgestellt werden. Sie ist für den Fall gedacht, dass der Kunde nach einiger Zeit mit dem ausgedruckten, unterschriebenen Servicevertrag zurückkommt. Über die Schaltfläche können der unterschriebene Servicevertrag oder andere Dokumente hochgeladen werden. Beim Überfahren der Schaltfläche wird der Text „Upload" angezeigt.

**Verlängerungen (Prolongation)**

Bei einer langfristigen Verlängerung werden alle Daten ab dem Wirksamkeitstag der Verlängerung aktualisiert. Das gilt für Verträge mit monatlichem Zahlungsintervall ebenso wie für Verträge mit Einmalzahlung.

Bei einer kurzfristigen Verlängerung werden nach der Genehmigung folgende Felder angepasst. Der Gesamtbruttobetrag ergibt sich aus dem bisherigen Bruttobetrag zuzüglich des Gesamtbruttobetrags für den Verlängerungszeitraum (Anzahl der Monate multipliziert mit dem monatlichen Bruttowert). Der Gesamtnettobetrag und der Gesamtsteuerbetrag werden entsprechend berechnet. Ist der Kunde steuerbefreit und fällt kein Steuerbetrag an, wird „-" angezeigt. Die Zahlungsdauer erhöht sich um die Anzahl der Monate der Verlängerung. Sammelrechnung, Kampagnenbetrag und Händlerrabatt bleiben unverändert. Ändert sich zwischenzeitlich die Mehrwertsteuer, wird dies in späteren Releases behandelt.

Bei Verträgen mit monatlichem Zahlungsintervall bleibt das Zahlungsintervall monatlich, da die kurzfristige Verlängerung standardmäßig auf einem monatlichen Intervall beruht. Brutto- und Nettobetrag pro Intervall bleiben unverändert.

Bei Verträgen mit Einmalzahlung steht noch eine Geschäftsentscheidung aus, wie das Zahlungsintervall sowie der Brutto- und Nettobetrag pro Intervall angepasst werden.