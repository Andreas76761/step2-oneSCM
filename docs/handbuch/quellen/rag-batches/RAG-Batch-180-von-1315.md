# Batch 180 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 26 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

Für die Rechnungsstellung wurde die Aktualisierung der Betriebsstättennummer (Establishment Number) des Rechnungsstellers bzw. der Werkstatt umgesetzt. Die Anpassung gilt für die Produktlinien Compact und Complete, jeweils für die Divisionen PC und Van. Sie wird für mehrere Rechnungs- bzw. Vertragsszenarien geprüft: Altteilesteuer (Old Part Tax), EDD, MDD und MANU. Das Szenario MPPI wurde ebenfalls betrachtet; die zugehörigen Prüfungen sind bereits abgeschlossen.

Für die Altteilesteuer muss ein aktiver Vertrag der jeweiligen Produktlinie und Division vorhanden sein. Zusätzlich ist eine i156-Datei mit einem Schadensfall (Claim) vorzubereiten, in dem die Altteilesteuer enthalten ist. Für das Szenario EDD muss ein aktiver Vertrag vorliegen, bei dessen Erstellung ein Händlerrabatt durch einen externen Händler angewendet wurde. Für das Szenario MDD wird ein aktiver Vertrag benötigt, der von einem externen Händler angelegt wurde. Für das Szenario MANU genügt ein vorhandener Vertrag im Status „Aktiv“. Dasselbe gilt für MPPI.

Außerdem wurden die Attribute der Verkaufskampagnen (Sales Campaigns) angepasst. Um dies nachzuvollziehen, muss ein Vertrag angelegt und aktiviert werden, auf den eine Verkaufskampagne angewendet wird. Diese Anpassung ist bereits im Einsatz.

Zusätzlich wurde die Zugriffssteuerung für Benutzer der Zentrale (HQ) nach Divisionen überprüft. Benutzer der Zentrale, denen sowohl die Rolle PC als auch die Rolle Van zugewiesen ist, können in allen Modulen die Daten beider Divisionen einsehen. Dies gilt auch für HQ-Administratoren mit beiden Rollen und ist bereits im Einsatz. Benutzer der Zentrale mit Zugriff ausschließlich auf die Division Van sehen und bearbeiten nur Van-Daten in den jeweils relevanten Modulen. Entsprechend können Benutzer der Zentrale mit Zugriff ausschließlich auf die Division PC nur PC-Daten einsehen und bearbeiten.

Hinweis zum Status: Die Prüfung der Betriebsstättennummer (mit Ausnahme von MPPI) sowie der divisionsbezogenen Zugriffe für HQ-Benutzer befindet sich noch im Review. Ein weiterer Punkt, der die Anzeige des Steuerbetragsfelds bei internationalen Werkstattrechnungen in der Ansicht betraf, wurde abgebrochen und wird daher nicht als Funktion beschrieben.