# Batch 831 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vorzeitige Vertragsbeendigung (Early Termination)**

Bisher war eine vorzeitige Beendigung nur für das heutige Datum oder für ein zukünftiges Datum möglich. Dabei wurde der Vertrag immer mit dem Datum der Durchführung beendet, auch wenn das Beendigungsdatum in der Zukunft lag. Künftig kann eine vorzeitige Beendigung rückdatiert, auf den heutigen Tag oder in die Zukunft gelegt werden. Für den deutschen Markt ist eine Rückdatierung um maximal drei Monate möglich. Der Wert für die maximale Rückdatierung lässt sich für jeden Markt individuell anpassen.

Wird ein Vertrag beendet, werden auf Vertragsebene zwei Datumsangaben gespeichert: der Zeitpunkt der Anfrage im Format TT.MM.JJJJ HH:MM:SS und der Wirksamkeitstag im Format TT.MM.JJJJ, zum Beispiel 01.03.2024. Liegt der Wirksamkeitstag in der Zukunft, bleibt der Vertrag bis zu diesem Datum im bisherigen Status. Bis zum Wirksamkeitstag können weiterhin alle Vorgänge auf Vertragsebene durchgeführt werden, etwa eine Übertragung oder ein Wechsel des Zahlers. Zum Wirksamkeitstag wird die Schnittstellennachricht i155 mit dem neuen Status erzeugt.

**Abgelehnte Kulanzzeit-Kampagnen bei der Vertragserstellung**

Wenn ein Händler oder eine Marktorganisation (MO) eine Vertragserstellung startet und für den Vertrag keine reguläre Kampagne, wohl aber eine Kulanzzeit-Kampagne (Grace Period) verfügbar ist, wird die Anfrage hierfür an das MPC gesendet. Lehnt das MPC die Kulanzzeit-Rabatte ab, bleibt der Vertrag im Status „Waiting for Activation“ und kann manuell aktiviert werden. In diesem Fall wird der Name der abgelehnten Kampagne nicht mehr angezeigt. Stattdessen erscheint im Feld „Campaign Name“ auf dem Reiter „Product“ ein „-“. Dies gilt sowohl auf der Seite der Vertragserstellung als auch nach der manuellen Aktivierung auf der Seite des Vertragsmanagements.

**Benachrichtigung vor dem geplanten Vertragsende**

Marktorganisationen konnten bislang eine Kurzzeitverlängerung für Verträge anbieten, die kurz vor der Beendigung oder dem Ablauf stehen. Künftig soll Kunden zusätzlich eine Langzeitverlängerung angeboten werden können, um den „sorgenfreien“ Zusatzzeitraum zu sichern. Dafür werden automatische Benachrichtigungen an den Vertragsinhaber versendet, die sowohl für Kurzzeit- als auch für Langzeitverlängerungen gelten.

Voraussetzung ist, dass sich der Vertrag im Status „Active“ oder „Suspended“ befindet, das Produkt nicht vom Typ „Contingent“ ist und der Vertrag nicht bereits mit der maximalen Laufzeit und Laufleistung des Produkts abgeschlossen wurde. Die erste Benachrichtigung geht an den Vertragsinhaber, wenn bis zum geplanten Vertragsende noch 60 Tage verbleiben. Sie informiert darüber, dass der Vertrag bald ausläuft, und lädt zur Verlängerung ein. Wurde nach dieser ersten Erinnerung keine Verlängerung vorgenommen, folgt die zweite Benachrichtigung, sobald noch 30 Tage verbleiben. Sie wird nicht versendet, wenn das geplante Vertragsende zwischenzeitlich verlängert wurde oder sich der Vertragsstatus auf einen anderen Status als „Active“ oder „Suspended“ geändert hat. Die Anzahl der Tage für beide Benachrichtigungen ist je Markt konfigurierbar. In Deutschland gelten 60 und 30 Tage, in Spanien 180 und 45 Tage.

**Unterkilometer-Ausgleich auf Kundenwunsch (Undermileage)**

Neu ist die Möglichkeit, dass MPC oder MO die Vertragsprüfung (Contract Review) für einen Unterkilometer-Ausgleich erst dann auslösen, wenn der Kunde dies ausdrücklich beantragt hat. Voraussetzung ist, dass der Vertrag beendet ist oder durch Zeitablauf abgelaufen ist, und zwar vor weniger als 90 Tagen. Außerdem muss das Produkt des Vertrags ein Profil besitzen, in dem der Ausgleich auf Kundenwunsch („Compensation on Customer Request“) festgelegt ist.

Erhält die MO oder das MPC vom Kunden die Anfrage, wählt sie in der Vertragsdetailansicht des Vertragsmanagements über den Status die Option „Contract Review“. Es öffnet sich ein Dialog, in dem die Aktion bestätigt werden muss, da sie nicht rückgängig gemacht werden kann („Proceed“ oder „Cancel“). Nach der Bestätigung wendet das System die Profilkonfiguration des Produkts an, führt alle Berechnungen durch und zeigt das Ergebnis auf der Seite „Operative Page Review“ an. Der Status des Eintrags richtet sich nach der Freigabeeinstellung des Profils: Bei automatischer Freigabe wird der Eintrag als „Approved“ angezeigt. Bei einer Schwellenwert-Freigabe ist er „Approved“, wenn der Schwellenwert kleiner ist als der gutzuschreibende Betrag, und „Pending“, wenn der Schwellenwert größer ist. Bei manueller Freigabe lautet der Status „Pending“. Die Option „Contract Review“ wird anschließend aus dem Status-Button entfernt. Ein Vertrag, für den die abschließende Prüfung berechnet wurde, kann nicht ein zweites Mal berechnet werden. Gestaltung und Grafik entsprechen der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Weitere Korrekturen im Vertragsmanagement**

Im Reiter „Communication“ der Vertragsübersicht wurden Darstellungsfehler behoben: Der fehlende Tabellenhintergrund wurde ergänzt, und die Spalten sind nun korrekt ausgerichtet. Außerdem wurde ein Navigationsproblem bei der Vertragsübertragung korrigiert.