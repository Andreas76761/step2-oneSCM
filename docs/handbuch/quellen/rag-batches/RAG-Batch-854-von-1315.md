# Batch 854 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente und Benachrichtigungen im Vertragsmanagement**

Im Vertragsmanagement steht Ihnen für jeden Vertrag der Bereich „Dokumente und Benachrichtigungen" zur Verfügung. Er bietet eine Übersicht über alle vertragsbezogenen Dokumente, etwa Vertrag, Geschäftsbedingungen und SEPA-Mandat, sowie über die E-Mail-Benachrichtigungen, die im gesamten Lebenszyklus eines Vertrags ausgelöst wurden. Voraussetzung ist, dass dem Vertrag bereits eine Vertragsnummer zugewiesen wurde und er den Status „Aktiv" hatte. Dokumente und E-Mails werden in getrennten Registerkarten dargestellt. Die Registerkarte für E-Mails zeigt die Benachrichtigungen, die während des Vertragslebenszyklus versendet wurden, wobei die neueste Benachrichtigung zuerst erscheint.

Die Tabelle enthält die Spalten Art der Benachrichtigung, Versanddatum, Status und Aktionen. Der Status gibt an, ob die E-Mail vom Server versendet wurde („Gesendet") oder ob der Versand aufgrund eines Fehlers nicht erfolgen konnte („Fehlgeschlagen"). Gesendete E-Mails können Sie drucken, fehlgeschlagene können Sie erneut versenden.

Welche Benachrichtigung versendet wird, hängt vom Vertragsstatus ab. Beim Status „Bestätigt" wird eine Bestätigungs-E-Mail mit der Bestätigungsvorlage versendet, bei „Storniert" eine Stornierungs-E-Mail mit der Stornierungsvorlage. Wird ein Vertrag aktiv, erhält der Kunde eine Aktivierungs-E-Mail auf Basis der Aktivierungsvorlage, zusammen mit den Vertragsbedingungen als Dokument. Bei „Abgelaufen" wird eine Ablauf-E-Mail mit der Ablaufvorlage versendet, bei „Beendet" eine Beendigungs-E-Mail mit der Beendigungsvorlage. Bei einer Reaktivierung wird erneut die Aktivierungsvorlage verwendet. Für die Status „Ausgesetzt", „Geschlossen (Abgelaufen)" und „Geschlossen (Beendet)" werden keine E-Mails versendet.

**Vertragsstatus „Geschlossen (Beendet)" und „Geschlossen (Abgelaufen)"**

Ein beendeter oder abgelaufener Servicevertrag kann geschlossen werden, sodass er nicht mehr aktiviert werden kann. Der Status wird nach Ablauf von 30 Tagen automatisch auf „Geschlossen (Beendet)" bzw. „Geschlossen (Abgelaufen)" gesetzt. Voraussetzung ist, dass der Vertrag zuvor den Status „Beendet" bzw. „Abgelaufen" hatte. Für Testzwecke lässt sich diese Frist auf eine Stunde konfigurieren.

Bei einem beendeten Vertrag werden vor dem Schließen die Endabrechnung durchgeführt und eine Schlussrechnung oder Gutschrift erstellt. Bei einem abgelaufenen Vertrag wird die Endabrechnung durchgeführt, sofern sie erforderlich ist. Andernfalls wird geprüft, ob eine Schlussrechnung oder Gutschrift nötig ist, und diese bei Bedarf ausgestellt. Danach wird der Vertrag geschlossen. Mitarbeitende der Market Operations können den Status nicht manuell auf „Geschlossen (Abgelaufen)" setzen. Ein Vertrag mit diesem Status kann zudem nicht reaktiviert werden. Während des Prozesses können Market-Operations-Nutzer weitere aktive Serviceverträge desselben Kunden einsehen und einzeln auswählen.

Nach dem Wechsel in den Status „Geschlossen" wird das System VEGA über die Datei I155 informiert. Für „Geschlossen (Beendet)" wird der VEGA-Statuscode 103 übermittelt, für „Geschlossen (Abgelaufen)" der Code 102. Der Kunde erhält in diesen beiden Fällen keine E-Mail-Benachrichtigung.

**Vertragsansicht**

Die Detailansicht eines Vertrags gliedert sich in die Bereiche Übersicht, Kunde, Fahrzeug, Vertrag und Produktdetails, die jeweils die zugehörigen Angaben des Vertrags anzeigen. Zusätzlich gibt es einen Verlaufsbereich mit Detailinformationen.