# Batch 778 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Management – Änderungen und Neuerungen**

**Erweiterte Informationen auf der Vertragsdetailseite**

Die Tabelle mit den Coverage-Details auf der Vertragsdetailseite wurde erweitert, um die erweiterte Coverage-Logik für Management- und Reifenverträge abzubilden. Bisher enthielt die Tabelle je Coverage den Coverage Code, den Coverage Name und den Preis. Sowohl in der Vertragserstellung (Contract Generation) als auch im Contract Management werden nun in dieser Reihenfolge zusätzlich folgende Angaben angezeigt: Kostenstelle (Cost Unit) mit den Ausprägungen „Mercedes-Benz", „Supplier" oder „Customer", der Name des Lieferanten (Supplier Name), die Information, ob die Coverage von VEGA ausgeschlossen ist (Excluded from VEGA), ob sie kontingentbasiert ist (Contingent-Based) und ob sie ein beendendes Kontingent besitzt (Terminating Contingent). Ergänzt wird die Tabelle um das enthaltene Kontingent (Included Contingent) und das bereits verbrauchte Kontingent (Used Contingent). Für Preise kann der Wert „n/a" angezeigt werden, für den Lieferantennamen gegebenenfalls „-".

Außerdem wird auf der Vertragsdetailseite im Reiter „Contract" nun das für den jeweiligen Vertrag geltende Ablaufkriterium (Contract Expiry Criterion) angezeigt, sowohl in der Vertragserstellung als auch im Contract Management. Bisher waren Ablaufkriterien auf Blueprint-Ebene vordefiniert und auf Produktebene festgelegt, auf Vertragsebene war jedoch nicht ersichtlich, welches Kriterium gilt. Nutzer mussten dafür im Produkt nachsehen, was zu Überraschungen führen konnte, wenn ein Vertrag endete. Das Ablaufkriterium wird nach der tatsächlichen Endlaufleistung (Real End Mileage) am Vertragsende dargestellt. Die zugehörigen Übersetzungen im Frontend wurden ergänzt.

Zusätzlich wurde ein Fehler behoben, durch den das Feld „Industry" im Bearbeitungsmodus der Vertragsdetailseite im Contract Management und in der Vertragserstellung fehlte.

**Langzeitverlängerung und vorzeitige Beendigung**

Wenn für einen Vertrag eine Langzeitverlängerung (Long Term Extension) läuft und MO/MPC den Vertrag vorzeitig beenden oder aussetzen möchte, ist folgende Vorgehensweise vorgesehen: Zunächst wird die laufende Langzeitverlängerung abgebrochen. Dadurch bleibt die Vertragskonfiguration mit Laufzeit, Laufleistung und optionalen Coverages auf dem Stand vor dem Auslösen der Langzeitverlängerung. Anschließend wird die vorzeitige Beendigung (Early Termination) eingeleitet und die Historie aktualisiert.

**Anpassung der VEGA-Vertragstypen**

Die VEGA-Vertragstypen wurden auf Blueprint-Ebene geändert. Betroffen sind alle bestehenden Verträge in jedem Status auf der Produktivumgebung. Die Typen wurden in der Datenbank angepasst, und für alle Verträge wurde die Schnittstelle I155 erneut an VEGA übermittelt. Die Änderungen lauten: 1P_CPLC wird zu 1P_FSV, 1P_SC wird zu 1P_MTN und 1P_TC wird zu 1P_TRS. Zur Dokumentation wurden die betroffenen Service-Verträge vor und nach der Änderung aufgelistet. Die Übertragung an VEGA erfolgt über den bestehenden CFT-Flow.

**Contract Review Profiles und Produktlinien**

Für Van-Produkte wurden Contract Review Profiles eingeführt. Voraussetzung für die Prüfung ist ein angelegtes Review-Profil für Vans, bei dem alle Bedingungen gesetzt sind, sowie ein aktiver Van-Vertrag. Außerdem wurde die Produktlinie „Basic" für die Division Passenger Cars entfernt.

**Fehlerbehebungen**

Behoben wurden außerdem mehrere Fehler: Bei der Prolongation wurde für ein deaktiviertes Produkt ein falscher Wert angezeigt. Zudem wurden Fehler in der Anbindung an Nemesis korrigiert, darunter ein Fehler „Bad Request" (POST 400) sowie ein interner API-Fehler in den Umgebungen INT und Pre-Prod. Ebenfalls wurde die Einschränkung behoben, dass ein Kunde im Bestätigungsstatus (Confirmation) nicht aktualisiert werden konnte.