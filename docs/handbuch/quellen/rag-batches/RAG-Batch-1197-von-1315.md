# Batch 1197 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**K/JX-Codes im HQ-Admin-Bereich**

Im Bereich Fahrzeugverwaltung steht HQ-Administratoren ein neuer Reiter zur Verfügung, in dem die K/JX-Codes für Wartungsprodukte mit Kontingent zentral gepflegt werden. Diese Codes sind Ausstattungs- bzw. SA-Codes, die angeben, wann für ein bestimmtes Fahrzeug eine Wartung empfohlen wird, zum Beispiel der Code K15 für ein Serviceintervall von 15.000 km oder JX5 für ein Wartungsintervall von 10.000 km. Mit der neuen Funktion erhalten alle Märkte eine einheitliche, verbindliche Quelle für diese Codes, die zugleich als Vorgabe für die Erstellung von Serviceverträgen dient.

Die Codes werden in einer Tabelle angezeigt. Sie enthält die Spalten Code (maximal 10 Zeichen), Laufleistung in km, Laufleistung in Meilen, Laufzeit in Monaten (ganze Zahl), Geschäftsbereich (Einfachauswahl zwischen PC und Van) sowie eine Beschreibung als Freitext mit maximal 800 Zeichen, in der keine Sonderzeichen erlaubt sind. Die Tabelle lässt sich nach Code, Laufleistung in km, Laufleistung in Meilen, Laufzeit in Monaten und Geschäftsbereich durchsuchen. Alle Spaltenüberschriften sind auf- und absteigend sortierbar. Am Seitenende befindet sich eine Seitennavigation, mit der sich auch die Anzahl der Einträge pro Seite ändern lässt.

Über die Schaltfläche „Erstellen“ öffnet sich ein Dialogfenster, in dem die Daten eingegeben werden. Nach dem Absenden erscheint der neue Eintrag in der Tabelle. Für jeden Eintrag stehen die Aktionen „Bearbeiten“ und „Löschen“ zur Verfügung. Beim Bearbeiten öffnet sich ein Dialog mit vorausgefüllten Daten, deren Änderung die bestehenden Werte überschreibt. Vor dem Löschen eines Eintrags wird eine Bestätigung abgefragt. Für das Anlegen mehrerer Einträge auf einmal kann eine Vorlage heruntergeladen und anschließend als Excel-Datei wieder hochgeladen werden.

Die gepflegten Codes werden anschließend in der Vertragserstellung verwendet. Wird ein Fahrgestellidentifikator übermittelt, erkennt das System, ob es sich um einen Van oder einen PC handelt, und ermittelt die dem Fahrzeug zugeordneten K/JX-Codes, entweder über einen VEDOC-Aufruf oder aus bereits vorhandenen Daten des CEPRO-Imports. Dabei werden ausschließlich die Codes aus der Tabelle in oneSCM berücksichtigt. Laufleistung und Laufzeit des passenden Tabelleneintrags werden an die Generierung zurückgegeben, wobei die Laufleistung im Format der Markteinstellung (Kilometer oder Meilen) ausgegeben wird. Existiert kein Tabelleneintrag, werden leere Werte zurückgegeben.

Wird stattdessen eine Auftragsnummer übermittelt, erkennt das System ebenfalls, ob es sich um einen Van oder einen PC handelt. Bei einem PC werden die K/JX-Codes über die GoOrder-API abgerufen, bei einem Van über die AFAB-API. Auch hier werden Laufleistung und Laufzeit aus der Tabelle entsprechend der Markteinstellung zurückgegeben, und bei fehlendem Eintrag bleiben die Werte leer.

**Contract Calculation: Verbesserungen bei Listenpreis-Kampagnen**

Bisher war die Option „Automatisch anwenden“ in der Händler-Verkaufsansicht standardmäßig aktiviert, sodass Kampagnen automatisch in die Vertragserstellung übernommen und die dort angezeigten Kampagnenpreise standardmäßig angewendet wurden. Künftig wählen Verkäufer bzw. Händler die gültigen Kampagnen in der Händleransicht selbst aus.

Dazu ist das Kontrollkästchen „Automatisch anwenden“ bei allen Rabattarten sichtbar und standardmäßig nicht aktiviert. Der Benutzer kann es für alle Kampagnentypen selbst aktivieren oder deaktivieren, und der Zustand jeder Kampagne ist für ihn klar erkennbar. Ist das Kontrollkästchen nicht aktiviert, wird die Kampagne nicht automatisch in die Vertragserstellung übernommen, und die dort angezeigten Preise werden durch sie nicht beeinflusst. Kampagnen können parallel laufen.

Auch die übermittelten Daten wurden angepasst. Es wird eine Liste aller Kampagnen gesendet, wobei jede Kampagne ihren Kampagnentyp enthält und der Zustand ausgewählt bzw. nicht ausgewählt korrekt abgebildet wird. Zusätzlich enthält die Antwort der Schnittstellen getVehicleInformation und getAvailableProducts das Bestelldatum des Fahrzeugs.