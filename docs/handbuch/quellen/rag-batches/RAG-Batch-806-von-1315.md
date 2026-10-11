# Batch 806 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 20 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsübertragung und Zahlerwechsel**

Der Ablauf für die Vertragsübertragung (Transfer) und den Zahlerwechsel (Change Payer) wurde in mehreren Punkten überarbeitet. Wird ein Vertrag für einen neuen Kunden übertragen oder der Zahler gewechselt und der Vertrag erhält während des Unterschriftsprozesses den Status „Suspended", stehen die Reaktivierungsoptionen im Menü „Actions" nicht mehr zur Verfügung. Für neue Kunden, die über einen Zahlerwechsel angelegt werden, wird nun das SEPA-Dokument erzeugt. Während ein Zahlerwechsel für einen neuen Kunden läuft, reagieren die Aktionen wieder wie erwartet. Außerdem wird bei mehrfachem Klicken auf die Vertragsübertragung nicht mehr mehrfach ein neuer Kunde angelegt, und ein doppelter Klick auf „Next" auf der Seite „Customer & Payment Information" löst beim Bestätigen der Übertragung keinen Fehler mehr aus. Der Käufer erhält nach der Übertragung nur noch eine E-Mail-Benachrichtigung statt zwei. Ein auf einen neuen gewerblichen Kunden übertragener Vertrag verbleibt nicht mehr im Status „Suspended". In den Markteinstellungen ist zudem die Option zum Drucken von Dokumenten für die Vertragsübertragung verfügbar.

**Verfügbare Aktionen, Verlängerung und Vertragsdaten**

Die Ermittlung der verfügbaren Aktionen erfolgt nun über eine neue Schnittstelle (getAvailableActions). Sie liefert die Aktionen Übertragung, Zahlerwechsel, kurze und lange Verlängerung sowie Kundenkompensation. Die bisherige Logik in der Benutzeroberfläche für diese Aktionen sowie für die Status „Cancellation" und „Confirmed" wurde entfernt. Die Schnittstelle getAvailableStatus wurde angepasst: Der Status „Confirmed" wird für einen Vertrag, der auf Bestätigung wartet, nur dann zurückgegeben, wenn die MO-Prüfung mit dem Feld „Contract Document" den Status NOT_OK hat. Für einen aktiven Vertrag wird der Status „Cancelled" zurückgegeben.

Die Schaltfläche „Prolongate" wird nicht mehr angezeigt, wenn die Vertragsdauer der Produktlebensdauer entspricht. Im Prozess der Langzeitverlängerung wurde eine Feldbezeichnung geändert. Änderungen an der Vertragsdauer und an der Langzeitverlängerung nach einem Kurzzeitfall wurden zurückgenommen.

In der Vertragshistorie wird das Aktivierungsereignis nicht mehr doppelt für einen Vertrag erfasst. In der Datei I155 wird der geplante Vertragsendkilometerstand wieder korrekt ausgewiesen.

**Reporting**

Die Werte „real_sc_end_date_dt" und „real_end_mileage_num" wurden bisher in allen Fällen an das Reporting gesendet, obwohl sie in oneSCM nicht immer angezeigt werden. Sie werden nun passend zur Anzeige in der Benutzeroberfläche übermittelt. Die bestehende Nachricht „contract_reporting" wurde um die Attribute „highPerformanceEngine" und „productId" ergänzt.

**Abschließende Vertragsprüfung (Final Contract Review)**

Die Regeln für die abschließende Vertragsprüfung wurden überarbeitet. Sie muss den aktuellen Toleranzwert enthalten und wird ausgelöst, wenn ein Vertrag durch Erreichen der geplanten Gesamtlaufleistung und/oder des geplanten Vertragsendes beendet wird. Der Zeitraum für vom Kunden gewünschte Ausgleichszahlungen beträgt 90 Tage nach Vertragsende. Er kann über ein zusätzliches Feld in der Markt-Konfiguration angepasst werden, dessen Tagesanzahl den Standardwert von 90 Tagen überschreibt.

Bei Verträgen mit der Einstellung „productConfigurationLogic": „VEHICLE_RELATED" wird die genutzte Laufleistung zum Vertragsbeginn immer auf 0 gesetzt. Mehr- und Minderlaufleistung werden jeweils auf Basis der geplanten Gesamtlaufleistung berechnet, wobei eine Toleranz berücksichtigt wird, sofern sie definiert ist. Liegt der Kilometerstand bei Vertragsende unter der geplanten Gesamtlaufleistung, kann innerhalb des definierten Zeitraums die Vertragsprüfung angefordert werden. Andernfalls ist diese Anforderung deaktiviert und die abschließende Prüfung wird automatisch ausgelöst, da von einer Mehrlaufleistung ausgegangen wird. Die Berechnung wird manuell, schwellenwertbasiert oder automatisch freigegeben und an das Revenue Management übermittelt. Nach dessen Bestätigung wird der Vertrag auf „Closed" gesetzt.

Die abschließende Vertragsprüfung gilt nicht für Reifenprodukte, für Kontingentprodukte und für Verträge, die auf Wunsch des Kunden vorzeitig beendet werden. Bei Reifen- und Kontingentverträgen wird sie auch beim Erreichen des geplanten Endes beziehungsweise der Anzahl der Leistungen nicht ausgelöst.

**Produktverwaltung**

Schritt 3 der Produktbearbeitung und -erstellung bleibt nicht mehr dauerhaft im Ladezustand hängen.

**MPay-Einstellungen in den Markteinstellungen**

Administratoren können MPay-Einstellungen nun über Admin-Menü, Markteinstellungen und den Reiter „External System Settings" im Bereich „MPay Configuration" pflegen. Dieser Bereich steht nur für Märkte zur Verfügung, in denen MPay genutzt wird. Folgende Angaben sind möglich:

Der Händlername (merchantName) ist ein Text mit 1 bis 255 Zeichen. Die Händler-ID (merchantId) ist eine UUID mit 36 Zeichen, zum Beispiel 0df734b1-b9c2-457a-83d6-99069fbcc33b. Die Benachrichtigungs-URL ist ein Text mit 1 bis 1500 Zeichen. Die Gültigkeit des Zahlungslinks wird in Sekunden als ganze Zahl zwischen 1 und 15.768.000 angegeben, der Standardwert beträgt 86.400. Als Transaktionstyp stehen „Preauth", „Preauth & Capture" und „Debit" zur Auswahl. Die Anzahl der Wiederholungsversuche ist ein Pflichtfeld mit Werten von 0 bis 99 und dem Standardwert 3. Das Intervall zwischen den Wiederholungen in Tagen ist ebenfalls ein Pflichtfeld mit Werten von 0 bis 99 und dem Standardwert 7.

Die hinterlegten Werte werden für MPay-Transaktionen, die Erstellung von Zahlungslinks und den Wiederholungsmechanismus verwendet. Jede Änderung wird in der Historie gespeichert. Auf der Seite wird angezeigt, wer die letzte Änderung wann vorgenommen hat („Last updated by USER_ID in TIMESTAMP").