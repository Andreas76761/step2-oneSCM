# Batch 770 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverlängerung für zu 100 % subventionierte Verträge (VIP-Kunden)**

Für Servicevertr&auml;ge von VIP-Kunden, die zu 100 % subventioniert und im Status „Aktiv" sind, wird die Long-Term-Prolongation (LTP) künftig mit einer eigenen Preislogik berechnet. Voraussetzung ist, dass der ursprüngliche Rabattwert (Subventionswert) am Vertrag gespeichert ist. Eine LTP kann nur von MO, MPC oder Dealer+ gestartet werden. Bei der Initiierung ruft das System den Product Microservice auf, um die verfügbaren Verlängerungsoptionen und Preise abzufragen. Die Anfrage enthält dabei den am Vertrag hinterlegten ursprünglichen Subventionswert. Der Product Microservice berechnet den LTP-Preis aus dem Standardverlängerungspreis und dem angewendeten Subventionswert. Negative Werte sind nicht zulässig und werden als 0 behandelt (diese Regelung ist noch mit Stream 1 zu klären).

Ist der berechnete LTP-Wert größer als null, wird der VIP-Kunde wie ein regulärer zahlender Kunde behandelt. Als Standardzahlungsart ist die Banküberweisung vorgesehen; das Standardzahlungsintervall steht noch nicht fest. Das Design sieht vor, Zahlungsart und Zahlungsintervall bei der Konfiguration zu erfassen. Dem Kunden wird ein Verlängerungsangebot zur Unterschrift zugesandt. Nach der Unterschrift wird die LTP-Konfiguration angewendet und der Zahlungsplan aktualisiert. Außerdem wird die Schnittstellendatei i155 erzeugt, der Kunde per E-Mail benachrichtigt und die Bereiche Revenue und Nemesis werden informiert.

Beträgt der LTP-Wert null (oder war er rechnerisch negativ), wird die Verlängerung automatisch angewendet, ohne dass eine Kundenunterschrift erforderlich ist. Der Kunde erhält in diesem Fall keine Benachrichtigung. Das System erzeugt weiterhin die i155 und informiert Revenue und Nemesis. Um Fehler zu vermeiden, ist eine eindeutige Verzweigung anhand des finalen LTP-Werts vorgesehen, die durch automatisierte Tests für beide Fälle abgesichert werden soll.

**Vertragsstornierung nach Aufhebung eines Schadenfalls**

Ein Vertrag kann von einem MO weiterhin innerhalb der konfigurierten Widerrufsfrist (Contract Withdrawal Period) storniert werden, etwa auf Kundenwunsch oder bei einem Fehler während der Aktivierung. Voraussetzung ist, dass kein offener Schadenfall besteht. Bisher blieb die Stornierung auch dann gesperrt, wenn ein offener Schadenfall später storniert, abgelehnt oder gelöscht wurde, da der Vertragsservice keine entsprechende Information erhielt. Künftig sendet das System in diesen Fällen ein Ereignis an den Vertragsservice, dass der Schadenfall nicht mehr aktiv ist. Nach Erhalt dieses Ereignisses erlaubt der Vertragsservice die Stornierung, sofern die Widerrufsfrist noch nicht abgelaufen ist.

**Automatisches Vertragsende bei Erreichen der maximalen Laufleistung**

Für Produkte, deren Blueprint die maximale Fahrzeuglaufleistung bei Vertragsende definiert und die zeitbasiert sind, ist vorgesehen, den Vertrag automatisch zu beenden. Der Vertrag endet, sobald die maximale Laufleistung erreicht ist und zusätzlich die entsprechende Option aktiviert wurde. Diese Option ist als Kontrollkästchen umgesetzt, mit dem festgelegt wird, dass der Vertrag automatisch endet, sobald die maximale Laufleistung erreicht ist.