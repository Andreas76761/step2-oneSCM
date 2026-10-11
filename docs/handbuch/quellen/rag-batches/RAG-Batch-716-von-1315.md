# Batch 716 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 23 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Kontostand und Werkstattrechnungen

Bei der Berechnung des Kontostands eines Vertrags wurden bislang auch Werkstattrechnungen berücksichtigt, die sich noch im Status „Erstellt“ oder „Akzeptiert“ befanden oder bereits storniert worden waren. Eine stornierte Rechnung ließ den Kontostand daher unverändert. Dies wurde korrigiert: Stornierte Werkstattrechnungen werden bei der Berechnung nicht mehr einbezogen. Für manuell im Vertrag angelegte Werkstattrechnungen gilt zudem, dass sie erst ab einem bestimmten Status in den Kontostand einfließen. Bei externen Werkstätten ist dies der Status „Exportiert“, bei internen Werkstätten der Status „Verarbeitet“.

Bedienung und Darstellung

In den Werkstattrechnungen unter dem Zahlungsplan sind die Deckungscodes beim Öffnen einer Rechnung nun standardmäßig eingeklappt. Bei der manuellen Erfassung von Werkstattrechnungen wurde zudem ein Fehler behoben, durch den Schadenarten doppelt angezeigt wurden. In den Batch-Jobs bleiben Filter nicht mehr erhalten, wenn Sie zu einer anderen Seite wechseln, sondern werden zurückgesetzt. Außerdem wurde der Import mehrerer Schadensfälle zum selben Vertrag korrigiert.

Import der Schnittstelle i156

Der Import der Schnittstelle i156 wurde in mehreren Punkten überarbeitet und verbessert. Ein Fehler, bei dem beim Import die Meldung „recordType10 nicht gefunden“ auftrat, wurde behoben. Die je Schadenscode angezeigten Beträge stammen jetzt aus dem Satz RC20. Dazu zählen der Nettowert für Arbeit, Material, Fremdleistungen und Händleraufwand. Der Netto-Gesamtbetrag ergibt sich als Summe dieser vier Werte, der Brutto-Gesamtbetrag entspricht dem Netto-Gesamtbetrag. Händler- und Marktnamen werden nun aus dem Dealership Management bezogen. Der bisherige Aufruf von GSSN entfällt, da das Dealership Management alle Angaben zu Händler oder Markt bereitstellt.

Internationale Werkstattrechnungen

Für internationale Werkstattrechnungen, die über den Admin-Bereich erstellt werden, gibt es den neuen Rechnungstyp „IWSI“ (bisher „WSIN“). So lassen sie sich von Werkstattrechnungen unterscheiden, die aus VEGA importiert oder manuell im Vertrag angelegt wurden. Der neue Typ wird im Ereignis an NEMESIS übermittelt.

Kostenereignisse und Schnittstelle zu NEMESIS

Die Übermittlung von Kostenereignissen an NEMESIS wurde überarbeitet. Die Mapping-Regeln für das Ereignis „Dealer Invoice“ wurden aktualisiert, und das Tag „interfaceName“ trägt nun den Wert „DealerInvoice“. Im Ereignis gilt für die Händlerrechnungsnummer eine Länge von 10 Zeichen, der Company Code lautet 2724. Die Werte für Company Code und Business Area (erste Ebene) wurden im Kostenereignis angepasst und im Common Service nachgezogen. Mehrere Fehler wurden behoben: Das Kostenereignis für NEMESIS wurde zeitweise nicht erzeugt. In der Kafka-Nachricht fehlten der Marktcode für das Reporting sowie bei manueller Kostenerfassung das Datum der Erstzulassung. Außerdem führte eine fehlende oneSCM-Rechnungsnummer in der Kostennachricht zu einer Ausnahme. Schließlich fehlte diese Rechnungsnummer auch bei der Altteil-Steuerrechnung, weshalb sie nicht an NACOS gesendet wurde. Auch dies ist nun behoben.