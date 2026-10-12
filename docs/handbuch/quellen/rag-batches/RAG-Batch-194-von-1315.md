# Batch 194 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 18 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Wiederholung von Zahlungen mit MPay

Im Bereich Revenue Management wurde der Umgang mit fehlgeschlagenen MPay-Transaktionen erweitert. Schlägt eine Transaktion aus irgendeinem Grund fehl, zum Beispiel wegen fehlender Deckung oder einer gesperrten Karte, musste bisher ein neuer Zahlungslink erzeugt werden. Künftig wird die Transaktion automatisch wiederholt. Wenn alle automatischen Versuche fehlschlagen, kann ein Benutzer der Market Operation (MO) die Zahlung manuell erneut anstoßen.

Automatische Wiederholung

Für jede Rechnung, die per MPay bezahlt wird, sind maximal drei Wiederholungsversuche vorgesehen. Diese Anzahl wird in der Konfiguration hinterlegt. Schlägt eine MPay-Transaktion fehl, führt oneSCM automatisch mehrere Schritte aus. Zunächst wird der MPay-Status der Rechnung auf „Refused“ gesetzt. Anschließend erhalten der Kunde und die MO-Benutzer jeweils eine Benachrichtigung über den Status der Transaktion. Für den Kunden wird dabei die von Documents & Communications bereitgestellte Vorlage verwendet, für die MO-Benutzer eine eigene Benachrichtigungsvorlage. Außerdem wird in der Historie der Rechnung ein neuer Eintrag angelegt. Als Grund wird „Transaction failed“ mit der Transaktions-ID angegeben, als neuer Status „MPay – Refused“ und als alter Status „MPay – Not Due“. Danach verringert sich die Anzahl der verbleibenden Wiederholungen um eins. Nach einer Woche wird für die Rechnung eine neue Transaktion erstellt. Dies wiederholt sich, bis keine Wiederholungen mehr übrig sind.

Manuelle Wiederholung

Bei einer Kundenrechnung mit dem MPay-Status „Refused“ wird in der Spalte „Aktion“ die Option „Retry“ angezeigt. Diese Option wird von einem Benutzer der Market Operation ausgelöst und erstellt für die ausgewählte Rechnung eine neue Transaktion. Auch diese Aktion wird in der Historie der Rechnung festgehalten.