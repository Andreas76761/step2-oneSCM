# Batch 213 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

Im Bereich Revenue Management wurden mehrere Verbesserungen und Fehlerbehebungen umgesetzt, die vor allem die Rechnungserstellung, den Datenexport an das Finanzsystem und die Datenqualität betreffen.

Bei der manuellen Erstellung einer Rechnungsanforderung werden nun zusätzlich der Marktcode und das Kennzeichen „Collectible“ (einziehbar) in die Anforderung übernommen. Außerdem wird das Kostenrechnungsereignis (Cost Invoice Event) jetzt versendet, sobald die jeweilige Rechnung verarbeitet wurde. Zudem wurde korrigiert, dass Kundenrechnungen nach der Durchführung eines Zahlerwechsels (Change Payer) nicht aktualisiert wurden.

Der Export E169 wurde in mehreren Punkten angepasst bzw. korrigiert. Für Provisionsrechnungen wird nun der Text „Händlersubvention“ ergänzt. Bei Händlerprovisionen wurde eine fehlerhaft übermittelte Materialnummer korrigiert. In der Exportdatei wurde zudem behoben, dass in der Zeile HDRPAR die SAP-Debitorennummer des Kunden anstelle der SAP-Nummer des Händlers ausgegeben wurde.

Bei den Plausibilitätsprüfungen wurden fehlerhafte Beträge für den Export korrigiert. Darüber hinaus wurde im Backend der Code im Bereich Revenue - Cost bereinigt (Code Smells) und die Testabdeckung verbessert.

Zwei zunächst geplante Vorhaben wurden nicht umgesetzt und sind daher nicht Bestandteil dieser Version. Dies betrifft zum einen die Funktion „MPay - Pre-authentication & Capture“, mit der Kreditkartenzahlungen flexibler hätten abgewickelt werden sollen, indem Beträge zunächst nur autorisiert und erst nach Ablauf der Widerrufsfrist eingezogen werden. Zum anderen betrifft es die geplanten Anpassungen für MBLD-Verträge, bei denen separate Batchjobs Einzelrechnungen unabhängig vom regulären Rechnungsfluss an das Finanzsystem hätten übertragen sollen.