# Batch 947 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Anpassung der Schnittstellennachricht i155 für Verträge mit zeitbasiertem Ablaufkriterium

Die Schnittstellennachricht i155, die oneSCM an das System Vega sendet, enthält im Satz RC05 an Position 260 das Feld „Return Flag". Bisher wurde dieser Wert nur dann auf „1" gesetzt, wenn ein Vertrag durch Zeitablauf endete. Für andere Fälle, etwa den Ablauf nach Laufleistung oder bei einer Kontingentregelung, wurde „*" übermittelt.

Mit der Anpassung richtet sich die Befüllung dieses Feldes nun einheitlich nach der Produktdefinition des Vertrags. Hat das dem Vertrag zugrunde liegende Produkt das Ablaufkriterium „TIME", steht in RC05, Position 260 bei jeder Aufnahme des Vertrags in eine i155 der Wert „1". Hat das Produkt dagegen das Ablaufkriterium „Time & Mileage", „Mileage" oder „Contingent", wird bei jeder Aufnahme des Vertrags in eine i155 der Wert „*" ausgegeben. Dadurch erhält Vega für alle Verträge die passende Information, unabhängig davon, in welcher Situation der Vertrag in der Nachricht enthalten ist.

Die Regel gilt über den gesamten Lebenszyklus eines Vertrags hinweg. Für einen Vertrag mit dem Ablaufkriterium „TIME" wird der Wert „1" nach der Generierung und Aktivierung ebenso angezeigt wie nach einer Suspendierung, einer Reaktivierung, einer vorzeitigen Beendigung oder einer Verlängerung. Entsprechend wird bei Verträgen, deren Produkt ein anderes Ablaufkriterium als ausschließlich „TIME" besitzt, in allen genannten Situationen der Wert „*" angezeigt.

Nach der Umsetzung der Logik sowie erfolgreichen Tests und Validierungen auf allen Testumgebungen (DEV, INT, prePROD) wird für alle Verträge im Produktivsystem mit dem Status ACTIVE oder SUSPENDED die i155 neu generiert und an Vega gesendet. So wird sichergestellt, dass auch bestehende Verträge mit den korrekten Werten bei Vega vorliegen.