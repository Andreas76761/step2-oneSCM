# Batch 835 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 17 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsübertragung und Berechtigungen**

Bei der Vertragsübertragung (Contract Transfer) wurde die abschließende Meldung angepasst. Nach dem Abschluss der Übertragung lautet sie nun, dass der neue Kunde per E-Mail über die Details der Übertragung informiert wird. Zuvor war dort von „allen Beteiligten“ die Rede. Außerdem wurden die Übersichts- und die Bestätigungsseite der Vertragsübertragung korrigiert, sodass sie die richtigen Informationen anzeigen. Das Problem einer leeren Übersichtsseite während der Übertragung wurde ebenfalls behoben. Die Rolle Dealer kann keine Vertragsübertragung mehr durchführen und darf auch den Status eines Vertrags nicht mehr ändern.

**Vorzeitige Beendigung (Early Termination)**

Die Geschäftslogik der vorzeitigen Beendigung wurde überarbeitet. Bisher war eine vorzeitige Beendigung für den heutigen Tag oder für ein zukünftiges Datum möglich, wobei der Vertrag auch bei einem in der Zukunft liegenden Beendigungsdatum sofort mit dem Datum der Durchführung beendet wurde. Künftig kann die Beendigung rückwirkend, für den heutigen Tag oder für die Zukunft erfasst werden. Für den deutschen Markt ist eine Rückdatierung um maximal drei Monate möglich. Der Wert für die maximale Rückdatierung kann für jeden Markt individuell festgelegt werden.

Wird ein Vertrag beendet, werden auf Vertragsebene zwei Datumsangaben gespeichert: das Datum der Anfrage im Format TT.MM.JJJJ HH:MM:SS sowie der Wirksamkeitstag im Format TT.MM.JJJJ, zum Beispiel 01.03.2024. Liegt der Wirksamkeitstag in der Zukunft, bleibt der Vertrag bis zu diesem Datum im aktuellen Status. Bis zum Wirksamkeitstag können weiterhin alle Vorgänge auf Vertragsebene durchgeführt werden, beispielsweise eine Übertragung oder ein Wechsel des Zahlers. Zum Wirksamkeitstag wird die Schnittstellennachricht i155 mit dem neuen Status erzeugt.

**Vertragslaufzeit (Real)**

Das Feld „Vertragslaufzeit (Real)“ wird aus der Benutzeroberfläche der Vertragserstellung (Contract Generation) entfernt und befindet sich nun in der Vertragsdetailansicht auf dem Reiter „Vertrag“. In der Vertragsverwaltung (Contract Management) zeigt das Feld zwei Varianten an. Ist der Vertrag aktiv oder ausgesetzt, wird ein Strich („-“) angezeigt. Wurde der Vertrag beendet oder ist er abgelaufen, wird der Zeitraum in Monaten vom Vertragsbeginn bis zum Zeitpunkt der Beendigung bzw. des Ablaufs berechnet, zum Beispiel „37 Monate“. Die reale Vertragslaufzeit kann von der geplanten Vertragslaufzeit abweichen. Eine fehlerhafte Anzeige der Vertragslaufzeit im Modul Contract Management wurde zudem korrigiert.

**Technische Anpassungen**

Im Vertragsobjekt wurden die Felder „collectable“ und „salesPartnerId“ entfernt, da sie inhaltlich den Feldern „collectiveInvoice“ bzw. „outletId“ entsprechen. Die Schnittstelle „updatePaymentInterval“ erhält nun den Parameter „collectiveInvoice“. Im Verkaufsobjekt wurden die Felder „outletId“, „name“ und „country“ ergänzt.

**Ende-zu-Ende-Verwaltung des Vertragsstatus**

Der Ende-zu-Ende-Ablauf, in dem MPC und Dealer den Vertragsstatus verwalten können, wurde fertiggestellt.

**Weitere geplante Themen**

Noch offen sind die Umbenennung und Definition eines neuen Status „Cancelation by market (Rejected)“ sowie des Status „Cancel“. Ebenso offen ist die Zuordnung unterschiedlicher Datumswerte zu den Vertragsstatus, bei der Vertragsbeginn, Erstellungsdatum, Aktivierungsdatum und Verkaufsdatum betrachtet werden.