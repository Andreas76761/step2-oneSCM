# Batch 301 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting: Anpassungen im Release**

**Umstellung des Nemesis-Datenladens auf die neue Revenue-Dateistruktur**

Das Nemesis-Team erweitert die Datenstruktur seiner Revenue-Dateien um neue Felder und plant, ab Oktober 2026 auf das neue Format umzustellen. Damit die Revenue-Dateien auch nach dieser Änderung problemlos verarbeitet werden können, wird der gesamte Ladeprozess für Nemesis-Daten angepasst. Bisher stehen zwei Wege zur Verfügung, um Nemesis-Revenue-Dateien in die Data Foundation zu laden: der Weg über Kafka, DCS und den Reporting Service sowie der Initial Load über S3. Aktuell können alle beteiligten Services das derzeitige Nemesis-Format verarbeiten.

Künftig sollen DCS und der Reporting Service (Delta- und Vollladung) sowohl das neue als auch das bisherige Format verarbeiten können. Zusätzliche Datenfelder werden, sofern vorhanden, ausgelesen und in den UDM-Tabellen bereitgestellt. Der Initial-Load-Job für Nemesis (Glue) beherrscht bislang zwei Formate, nämlich das aktuelle und das ursprüngliche Format, das bis März 2023 verwendet wurde. Er soll künftig alle drei Formate (ursprünglich, aktuell, neu) verarbeiten und die Daten der neuen Felder in die UDM-Tabellen übernehmen. Der Glue-Job für das Financials-Datenprodukt kann derzeit die bereits umgesetzten UDM-Felder verarbeiten und wird so erweitert, dass er sämtliche UDM-Felder einschließlich der neuen unterstützt.

Die neuen Felder werden in die UDM-Tabelle für Financials sowie in die Tabellen des Financials-Datenprodukts (Financials und Financials Delta) aufgenommen. Welche Felder genau ergänzt werden, steht erst fest, wenn die neue Schnittstellenbeschreibung vorliegt. Für ältere Zeiträume bleibt der Inhalt der neuen Felder leer. Im Ergebnis lassen sich Nemesis-Dateien aus allen Zeiträumen mit ursprünglicher, aktueller und neuer Struktur verarbeiten, und alle aktuellen sowie neuen Felder stehen im Datenprodukt so zur Verfügung, wie sie in den Dateien geliefert werden. Als Risiko gilt der nur grob bekannte Zeitplan der Änderung auf Nemesis-Seite.

**Korrektur der Verwaltungsgebühren im Revenue-Datenprodukt**

Die bisherige Bereitstellung der Verwaltungsgebühr in der Tabelle des Revenue-Datenprodukts entspricht nicht der Umsetzung der Gebühren in oneSCM, und die Daten sind nicht wie erwartet. Ziel ist es, Verwaltungsgebühr und Zahlungsaufschlag auf Basis der Gesamtbeträge bereitzustellen, die in der Zahlungsdetailtabelle des jeweiligen Vertrags hinterlegt sind.

Dazu wird die Spalte für den monatlichen Verwaltungsgebührenbetrag aus der Tabelle base_sc_revenue_contract entfernt. Der Inhalt der Spalte admin_fee_amt wird korrigiert: Für oneSCM-Verträge, bei denen sie bisher leer war, enthält sie künftig den zuletzt verfügbaren Wert aus oneSCM unter Fees and Factors, Administration Fee, Total Price. Für Legacy-Verträge ist keine Änderung vorgesehen. Zusätzlich wird die neue Spalte payment_markup_amt eingeführt, mit demselben Datentyp und Format wie admin_fee_amt. Sie wird in den UDM-Tabellen für Verträge (refined_contract) und in der Tabelle base_sc_revenue_contract ergänzt und enthält für oneSCM-Verträge den zuletzt verfügbaren Wert aus Fees and Factors, Payment Markup, Total Price. Für Legacy-Verträge gibt es dafür keine Befüllung.

**Behobene Probleme in den Transformationsjobs**

Zusätzlich wurden mehrere Störungen im Reporting-Bereich behoben. Dazu zählen Fehler in den ASSETG-Transformationsjobs, darunter der Job für Schadenspositionen, sowie ein fehlgeschlagener Delta-Transformationsjob für Verträge. Außerdem wurde das Problem gelöst, dass Revenue-Daten in der UDM nicht aktualisiert wurden. Ebenso wurde das Verhalten des Delta-Transformationsjobs für Revenue korrigiert: Er startete zuvor auch für andere Märkte (etwa DE und IN), obwohl er nur für einen bestimmten Markt (etwa SK) angefordert wurde. Künftig soll jeder Job separat und ausschließlich für den jeweils angeforderten Markt gestartet werden.