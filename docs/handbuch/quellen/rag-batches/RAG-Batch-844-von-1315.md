# Batch 844 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 21 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsstatus und Statusmodell**

Das Statusmodell für Verträge wurde vereinheitlicht. Bisher wurde ein Vertrag nach Ablauf (nach Datum, Laufleistung oder Kontingent) auf „Expired“ und bei vorzeitiger Beendigung auf „Terminated“ gesetzt. Nach einer Wartezeit von 30 Tagen, in der die Endabrechnung erfolgt, wechselte er zu „Closed (expired)“ bzw. „Closed (terminated)“. Beide Endstatus heißen nun einheitlich „Closed“. Der Wechsel von „Expired“ bzw. „Terminated“ zu „Closed“ erfolgt automatisch nach Ablauf der 30 Tage. Für Testzwecke lässt sich diese Wartezeit auf eine Stunde konfigurieren.

Jeder Statuswechsel wird im Reiter „History“ festgehalten, und der Grund wird wie folgt angegeben: „Regular Expiry by Date“ bei Ablauf nach Datum, „Regular Expiry by Mileage“ bei Ablauf nach Laufleistung, „Expiry by Contingent“ bei Ablauf nach Kontingent und „Early Termination“ bei vorzeitiger Beendigung. Das Vega-System wird über die Statusänderung per i155-Datei mit dem Vega-Code 004 informiert.

Außerdem wurde der bisherige Status für die Ablehnung durch die Market Operations umbenannt. Die Bezeichnung „Cancelation by market operations“ war irreführend und lautet nun „Rejected“. Die Market Operations können einen Vertrag, bei dem Punkte zu klären sind, entweder aktivieren oder ablehnen. Nach einer Ablehnung sind keine weiteren Schritte möglich. Neu hinzugekommen ist der Status „Cancel“. Er kann einem Vertrag nach der Aktivierung zugewiesen werden und dient der Stornierung nach der Aktivierung, zum Beispiel bei einem aktivierten Vertrag mit einem Beginn in weniger als 14 Tagen. Für diesen Status wird in der i155-Datei der Vega-Code „010“ verwendet.

**Vertragserstellung und Aktivierung**

Bei der Vertragserstellung wird nun geprüft, ob die Vertragslaufzeit bereits in der Vergangenheit liegt. Liegt die Summe aus dem Datum der Erstzulassung (FRD) und der Vertragslaufzeit vor dem Datum der Vertragserstellung, erscheint die Fehlermeldung „Contract duration cannot be made in the past“, und die Schaltfläche „Next“ wird deaktiviert. Damit lassen sich Verträge, die nicht angelegt werden sollten, nicht mehr erstellen und aktivieren. Ein Fehler, der beim Aktivieren eines Vertrags im Backend zu einem Transaktionsfehler führte, wurde behoben.

**Vertragsübersicht und Detailansicht**

Der Export von Verträgen ist nur noch für aktive Verträge möglich. In der Übersicht der Vertragserzeugung und in der Vertragsübersicht führt ein Klick auf den Link im Feld „Customer Name“ nun wie erwartet zur Kundenverwaltung. Ebenso wurden Fehler behoben, durch die die Startseite der Vertragserzeugung und des Vertragsmanagements nicht geladen werden konnte und der Reiter „Vehicle“ in der Detailansicht eines Vertrags keine Daten anzeigte.

Beim Aussetzen von Verträgen („Suspend Contract“) wird die Schaltfläche nun korrekt aktiviert, sobald die Pflichtfelder, etwa der Grund der Aussetzung, ausgefüllt sind. Zuvor erschien sie trotz ausgefüllter Felder deaktiviert, obwohl die Aktion beim Klick dennoch ausgeführt wurde, oder sie wurde erst nach einem Wechsel in einen anderen Reiter und zurück aktiv.

Im Reiter „Documents & Notifications“ eines aktiven Vertrags werden Vertragsdokumente und E-Mails angezeigt. Die E-Mail-Benachrichtigungen, die bei Statuswechseln ausgelöst werden, erscheinen nun in umgekehrter Reihenfolge, beginnend mit der neuesten Benachrichtigung.

**Weitere Funktionen im Vertragsmanagement**

Für das Vertragsmanagement werden zudem die Übertragung eines Vertrags auf einen neuen Kunden (Transfer Ownership), die Stornierung nach der Aktivierung sowie das Bearbeiten von Feldern in der Detailansicht (Reiter „Payment“, „Vehicle“ und „Contract“) fachlich geprüft. Dies umfasst Feldvalidierungen, die Funktionen „Cancel“ und „Back“, das Verhalten bei ungültigen Eingaben und die erfolgreichen Abläufe. Weitere Szenarien betreffen einen Vertrag mit abweichendem Zahler und Halter, bei dem geprüft wird, ob beide auf der Detailseite des Vertragsmanagements angezeigt werden, sowie die Stornierung eines aktivierten Vertrags mit einem Beginn in weniger als 14 Tagen.