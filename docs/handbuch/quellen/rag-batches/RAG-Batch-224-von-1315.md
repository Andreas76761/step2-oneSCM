# Batch 224 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Änderungen und Korrekturen**

**Bearbeitung manueller Kundenrechnungen**
Eine manuell erstellte Kundenrechnung im Status „Created" konnte bisher auch von anderen Benutzern inhaltlich bearbeitet werden, nicht nur von der Person, die sie angelegt hat. Dies wurde angepasst: Der Inhalt der Rechnung darf nun ausschließlich vom Ersteller bearbeitet werden. Andere MO-Benutzer können die Rechnung lediglich genehmigen (Approve) oder ablehnen (Reject).

**Batch-Jobs**
Die Navigation in der Batch-Job-Übersicht wurde verbessert. Wählt man einen Batch-Job beispielsweise auf der zweiten Seite der Liste aus und öffnet die Detailansicht, führt die Schaltfläche „Zurück" nun wieder auf die zweite Seite, also auf die Seite, auf der der Batch-Job ausgewählt wurde. Zudem wurde ein Fehler behoben, durch den der Batch-Job SAPInvE169EXP fehlschlug.

**Vorzeitige Vertragsbeendigung**
Im Zusammenhang mit der vorzeitigen Beendigung eines Vertrags wurde das Verhalten korrigiert, bei dem alle Rechnungen aus oneSCM storniert wurden.

**Steuerverwaltung (Tax Management)**
Die Regel zur Erkennung von Dubletten war fehlerhaft und wurde korrigiert.

**Rechnungsbereich**
Eine OpenSearch-Exception, die im Bereich „Invoices" des Revenue Managements auftrat, wurde behoben.

**Anpassung der Texte für internationale Rechnungen und Altteilsteuer (E169)**
Für internationale Servicevertragsrechnungen wurden die Texte angepasst. Der Kopftext (HTXT01) weist die Rechnung als Sammelrechnung für den internationalen Prozess aus und enthält den Rechnungssender (Markt und VEGA-Mandat mit der VEGA-ID des Marktes) sowie den Rechnungszeitraum. Dieser reicht vom Datum des letzten Imports der E169 mit internationalen Rechnungen bis zum Datum des aktuellen Imports. Als Unterschriftenfelder (HTXT06) sind „gez.i.V. Blendow" und „gez.i.V. Rinke" hinterlegt.

Der Positionstext (PTXT01) enthält die Fahrgestellnummer, den Abrechnungszeitraum, die Vertragsnummer, den Vertragstyp, die Nummer der Werkstattrechnung, das Belegdatum, das Leistungsdatum, den Kilometerstand bei der Reparatur sowie Name und Ort des Reparaturbetriebs. Anschließend werden die einzelnen Reparaturen mit ihrer Schadencode-Beschreibung aufgeführt. Es folgen die Gesamtkosten der Reparaturen in der jeweiligen Währung, aufgeteilt in Lohn, Material und Fremdleistung (Dealer Handling), die Rechnungssumme als Gesamtnettobetrag der Position sowie die Umsatzsteuer mit Steuersatz und Bezugsbetrag. Bei mehreren Steuersätzen werden die Umsatzsteuerzeilen jeweils für die Summe der Beträge mit dem gewählten Steuersatz ausgewiesen. Ist diese Summe 0, wird die Zeile nicht angezeigt.

Für die Altteilsteuer (E169) erläutert der Kopftext (HTXT01) in deutscher und englischer Sprache, dass im Rahmen der Servicevertragsabwicklung die Altteilsteuer für den Buchungszeitraum abgerechnet wird. Sie ermittelt sich aus der zum Leistungszeitraum gültigen Mehrwertsteuer auf 10 % der Differenz (60er Teil) zwischen dem zu verbauenden aufbereiteten Teil (Tauschteil bzw. 80er Teil) und dem „alten" Teil (70er Teil), der an das Logistik Center (LC) verkauft wird. Der Buchungszeitraum reicht vom Datum des letzten Imports der i156 mit Altteilsteuer bis zum Datum des aktuellen Imports. Im Positionstext (PTXT01) wird die relevante Antragsnummer, also die Nummer der Werkstattrechnung, ausgewiesen.