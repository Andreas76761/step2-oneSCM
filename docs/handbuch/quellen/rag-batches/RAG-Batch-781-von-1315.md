# Batch 781 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Nächstes Wirksamkeitsdatum bei der Langzeitverlängerung**

Das System verarbeitet das nächste Wirksamkeitsdatum künftig abhängig vom jeweiligen Vertriebskanal und stellt die passenden Auswahloptionen bereit. Bisher gilt das nächste Wirksamkeitsdatum nur für den Retail-Kanal, und zwar bei der Langzeitverlängerung und beim Transfer. Bei der Langzeitverlängerung entspricht es dem nächsten Rechnungsdatum und ist die einzige Option, die angewendet werden kann. Beim Transfer stehen die nächsten Rechnungsdaten zur Auswahl, wobei Anwender eines der zukünftigen Daten wählen können.

**Retail sowie Leasing über das oneSCM-Frontend**

Wird eine Langzeitverlängerung gestartet, ruft das System wie bisher die verfügbaren nächsten Wirksamkeitsdaten aus Revenue ab. Diese werden in chronologischer Reihenfolge in einer Dropdown-Liste im Feld „Datumsauswahl“ angezeigt. Ist ein Vertrag aktiv und stehen keine weiteren Wirksamkeitsdaten zur Verfügung, schlägt das System automatisch genau eine Option vor: den ersten Tag nach Ablauf des Vertrags. Endet ein Vertrag beispielsweise am 10. November 2025, lautet das nächste Wirksamkeitsdatum der 11. November 2025. Beim Leasing über das oneSCM-Frontend wird dieser Ablauf durch MO/MPC abgewickelt.

Wurde die Langzeitverlängerung bereits konfiguriert und ändert der Anwender anschließend das nächste Wirksamkeitsdatum, stößt das System einen erneuten Aufruf des Produkt-Microservice an, um aktualisierte Preise und Konfigurationen abzurufen. Die bestehende Konfiguration der Langzeitverlängerung wird zurückgesetzt, um die Datenkonsistenz sicherzustellen, und der Anwender muss sie auf Basis der neu abgerufenen Produktdaten erneut vornehmen. Im Retail-Kanal besteht die Konfiguration aus Gesamtlaufzeit und jährlicher Laufleistung, beim Leasing aus Gesamtlaufzeit und Gesamtlaufleistung.

**Leasing über den EDGE Service**

Für das Leasing über den EDGE Service werden im Body der API zwei Felder verwendet. Das Feld „Offset“ ist ein numerisches Pflichtfeld mit maximal drei Stellen. Es gibt an, wie viele der aus Revenue empfangenen nächsten verfügbaren Wirksamkeitsdaten übersprungen werden, bevor die Langzeitverlängerung angewendet wird. Liefert Revenue beispielsweise zehn verfügbare Daten und ist der Offset 2, überspringt das System die ersten beiden Daten und verwendet das dritte als Wirksamkeitsdatum der Langzeitverlängerung. Übersteigt der angegebene Offset die Anzahl der verfügbaren Wirksamkeitsdaten, gibt das System einen Fehler aus.

Das Feld „Leasing Effective Date“ ist ein optionales Datumsfeld. Werden sowohl ein Offset als auch ein Leasing Effective Date angegeben und unterscheiden sie sich, hat der Offset Vorrang, und das Leasing Effective Date wird ignoriert.

**Hinweis zum Umfang**

Die Anpassung der Langzeitverlängerung für Reifen und komplexe Produkte wurde nicht umgesetzt; dieses Vorhaben wurde abgebrochen. Zu seinem Inhalt liegen keine weiteren Angaben vor.