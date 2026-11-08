# Batch 824 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverwaltung (Contract Management): Neuerungen und Verbesserungen**

**Zahlungsinformationen nach Verlängerungen**
Der Reiter „Zahlung“ wird von der Vertragsverwaltung und vom Revenue-Bereich gemeinsam bedient. Die dort angezeigten Werte werden bei der Vertragsanlage erfasst. Bisher wurden sie bei einer Verlängerung nicht aktualisiert. Künftig sollen sie den aktuellen Vertragsstand widerspiegeln.

Bei einer Kurzzeitverlängerung eines Vertrags mit monatlichem Zahlungsintervall werden nach der Genehmigung mehrere Felder angepasst. Der Gesamtbruttobetrag ergibt sich aus dem bisherigen Bruttobetrag des Vertrags zuzüglich des Bruttobetrags für den verlängerten Zeitraum (Anzahl der Monate multipliziert mit dem monatlichen Bruttowert). Der Gesamtnettobetrag und der Gesamtsteuerbetrag werden entsprechend berechnet. Ist ein Kunde von Steuern befreit und fällt kein Steuerbetrag an, wird „-“ angezeigt. Die Zahlungsdauer erhöht sich um die Anzahl der Monate der Kurzzeitverlängerung. Das Zahlungsintervall bleibt monatlich, da eine Kurzzeitverlängerung standardmäßig mit monatlichem Intervall erfolgt. Brutto- und Nettobetrag pro Intervall bleiben unverändert. Änderungen der Mehrwertsteuer in der Zwischenzeit werden in späteren Planungsintervallen behandelt. Sammelrechnung, Kampagnenbetrag und Händlerrabatt bleiben ebenfalls unverändert.

Bei Verträgen mit einmaliger Zahlung werden Gesamtbrutto-, Gesamtnetto- und Gesamtsteuerbetrag sowie die Zahlungsdauer auf dieselbe Weise angepasst. Wie das Zahlungsintervall sowie die Brutto- und Nettobeträge pro Intervall aktualisiert werden, steht noch nicht fest, da hierzu eine Entscheidung des Fachbereichs aussteht. Bei einer Langzeitverlängerung werden alle Daten ab dem Tag des Inkrafttretens der Verlängerung aktualisiert.

**Korrekturen bei Verlängerungen und Rechnungen**
Die Berechnung der geplanten Laufleistung bei Langzeitverlängerungen wurde korrigiert. Ebenso wurde behoben, dass nach einer Kurzzeitverlängerung bei Verträgen mit monatlicher Zahlung Rechnungen für die verlängerten Monate fehlerhaft erzeugt wurden. Bei Verträgen mit einmaliger Zahlung wurden die Rechnungen für die verlängerten Monate falsch berechnet, in der Übersichtsseite der Kurzzeitverlängerung angezeigt und fehlerhaft erzeugt. Auch dies wurde korrigiert. Zudem wird die Verlängerungseinrichtung nach Abschluss der Verlängerung gelöscht. Außerdem wurde behoben, dass von Händlern angelegte Verträge im Login der MO-Benutzer nicht sichtbar waren.

**Schnittstelle i155**
In der Schnittstelle i155 wird der Wert im Satz RC05, Position 123–129 (geplante Endlaufleistung) neu berechnet. Bisher entsprach er der in der Oberfläche angezeigten geplanten Gesamtlaufleistung, die nach einer früheren Änderung die im Servicevertrag enthaltenen Kilometer berücksichtigt. Dadurch war die geplante Gesamtlaufleistung teils kleiner als der Kilometerstand bei Vertragsbeginn, und die Erzeugung der i155 schlug fehl. Nun gilt: Kilometerstand bei Vertragsbeginn plus (Vertragslaufzeit multipliziert mit der jährlichen Laufleistung). Beispiel: Bei 7.000 km zu Vertragsbeginn und einem Vertrag über 3 Jahre mit 10.000 km pro Jahr ergibt sich ein Wert von 37.000 km.

**Anpassungen der Benutzeroberfläche**
Im Pop-up zum Aussetzen eines Vertrags wird der Grund nicht mehr als Freitext erfasst. Stattdessen steht eine verpflichtende Auswahlliste „Reason for Suspension“ mit den Werten „Payment Overdue“ (Standardwert) und „Other“ zur Verfügung. Bei „Other“ muss ein Kommentar erfasst werden; ansonsten ist das Kommentarfeld optional.

Im Pop-up zur vorzeitigen Vertragsbeendigung wird „Other“ als letzte Option der Auswahlliste angezeigt, und bei dessen Auswahl ist ein Kommentar verpflichtend. Der Eintrag „Contract Terminated by the Customer“ heißt nun „Customer Request“.

In den Pop-ups für das Aussetzen, Reaktivieren und die vorzeitige Beendigung mehrerer Verträge wird neben der Vertragsnummer nun das Kfz-Kennzeichen angezeigt, damit MO-Benutzer Verträge leichter identifizieren können. Das Format lautet „Vertragsnummer | Kennzeichen“, zum Beispiel „P00200B/0001 | DAX1953“. Fehlt das Kennzeichen, erscheint stattdessen „-“, zum Beispiel „P00200B/0001 | -“.

Bei der Vertragsübertragung erscheint ein Dialog, in dem die zulässige Signaturart für die Vertragsunterzeichnung gewählt wird: eSignature (On-Premise) oder DSS-Signatur.

**Datenübermittlung an das Revenue Management**
Die Vertragsanwendung übermittelt nun Kunden-ID und Zahler-ID an das Revenue Management. Für einen Zahlerwechsel wurde ein neuer Kafka-Producer mit Kunden-ID, alter und neuer Zahler-ID eingerichtet. Alle Ereignisse, die von der Vertragsverwaltung an Revenue gesendet werden, enthalten außerdem Kunden-ID und Zahler-ID.