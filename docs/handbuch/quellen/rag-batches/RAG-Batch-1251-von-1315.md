# Batch 1251 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation – Neuerungen und Änderungen**

**Produktanlage und Preisversionen**

Im Ablauf zur Produktanlage wurden mehrere Anpassungen vorgenommen. Im Schritt „Base Product Information" wurde auf Änderungswunsch eine Schaltfläche entfernt. Für Contingent-Produkte wurde die Preismatrix im Schritt „Price Matrix Definition" überarbeitet, sodass das Anlegen eines neuen Contingents nun in geänderter Form dargestellt wird. Beim Anlegen eines Produkts und einer spezifischen Preisversion werden die Informationen auf den Registerkarten „optional coverages" und „technical options" zudem auf einen Blick angezeigt, sodass das seitliche Scrollen entfällt.

Bei den Zahlungsintervallen waren bisher nur „Monatlich" und „Einmalig" definierbar. Nun lassen sich in der Oberfläche die Intervalle monatlich, vierteljährlich, halbjährlich, jährlich und einmalig festlegen. In der Produktdefinition wird dazu in Schritt 3 eine Auswahl der Zahlungsintervalle ergänzt. Beim Einrichten der Preisversion stehen in Schritt 2 dieselben Intervalle zur Verfügung, die im Produkt definiert wurden, sodass entsprechende Raten erfasst werden können. Die optionalen Felder bleiben unverändert; einige Textbezeichnungen wurden angepasst.

Außerdem können Blueprints und Produkte nun in verschiedenen Divisionen denselben Namen tragen, beispielsweise „Product XYZ" sowohl für VAN als auch für PC. Die Eindeutigkeit des Namens wird je Division geprüft.

Für die Division Passenger Cars wurde die Produktlinie „Basic" gelöscht. Die zugehörigen Einträge in der HQ-Konfiguration unter „Material Numbers Management" sollen ebenfalls entfernt werden, und alle Basic-Blueprints wurden in die Produktlinie „Excellent" migriert.

**Kampagnen**

Bei der Kampagnenanlage und -bearbeitung gibt es in Schritt 1 („Campaign Setup") ein neues Pflichtfeld zur Auswahl der Division. Es handelt sich um eine Einfachauswahl mit den Werten Vans und PC; eine Kampagne kann nicht beiden Divisionen zugleich zugeordnet werden. Angezeigt wird jeweils nur die Division, die dem Benutzer zugewiesen ist. Benutzer mit PC-Rolle können nur PC wählen, Benutzer mit Van-Rolle nur Vans, und Benutzer mit beiden Rollen können zwischen beiden Divisionen wählen. In Schritt 2 („Discounted Products & Vehicles") werden nur Produkte der zuvor gewählten Division angezeigt und sind auswählbar. In Schritt 3 („Campaign Summary") wird die zugeordnete Division in der Zusammenfassung dargestellt.

Die Kampagnen-Suchseite erhält eine neue Spalte „Division", die sortierbar ist. Im Modal „Weitere Filter" wird zusätzlich ein Divisionsfilter angeboten, der sich nach den Berechtigungen des Benutzers richtet und nur erscheint, wenn der Benutzer sowohl VAN- als auch PC-Berechtigungen besitzt.

Für die Felder bei der Kampagnenanlage gelten neue Eingaberegeln. Die Kostenstelle („Cost Center") ist ein Pflichtfeld mit maximal 10 numerischen Zeichen, ohne Leerzeichen zwischen den Ziffern; als einziges Sonderzeichen ist der Bindestrich erlaubt, beispielsweise 123-1234. Die Debitorennummer („Debtor Number") ist ein optionales Feld mit maximal 10 Zeichen, ebenfalls ohne Leerzeichen. Sie wird auch in anderen europäischen CoFiCo-Märkten verwendet.

**Berechnung**

Bei der Preisverlängerung für Leasing gilt nun, dass die Auswahl eines Preispunkts dessen Wert nicht verändern darf. Für direkt getroffene Preispunkte ist keine Berechnung nötig; nur Zwischenwerte werden interpoliert.

Bei der Berechnung des Preises pro Kilometer für Minder- und Mehrkilometer wurde die Formel angepasst. Zuvor konnte die Berechnung einen negativen Preis liefern, etwa wenn bei einem Rabatt von 100 % der Rabattbetrag die Summe aller berücksichtigten Komponenten überstieg. Nun gilt eine strikte Obergrenze von 0: Ergibt die Berechnung der Minderkilometer einen negativen Wert, wird dieser zwingend auf 0 gesetzt. Die Formel lautet: (Gesamt-Basispreis + Optionspreis + Technische Optionen + Industriefaktor + Aufschlag für feste Preisinflation − Kampagnenrabatt − Händlerrabatt) / Gesamtvertragslaufleistung.

**Anzeige kompatibler Produkte und Fahrgestellnummer**

Für die Anzeige kompatibler Produkte werden Daten bereitgestellt, sodass bei nicht erfolgreicher Suche passende Hinweise erscheinen. Wird zum eingegebenen Identifier kein Ergebnis gefunden, lautet die Meldung, dass der Identifier keine Ergebnisse geliefert hat und die Eingabe geprüft und angepasst werden soll. Je nach Fall wird ergänzt, dass eine gültige Fahrgestellnummer, Auftragsnummer oder ein gültiger Modellcode einzugeben ist, und es wird auf durchgeführte Services bzw. deren Reihenfolge verwiesen. Das betrifft Fahrzeuge ohne erfasste Services im DSB sowie Fahrzeuge mit durchgeführten Services, die nicht den Mercedes-Benz-Standards entsprechen. Bei einem falschen Identifier werden keine Produkte angezeigt, sondern eine Seite mit dem entsprechenden Hinweis. Die Prüfungen auf Fahrzeugalter (bei FRD-basierten Produkten) und Laufleistung über dem zulässigen Höchstwert sowie der Fall einer einzigen, abgelaufenen Preisversion („Product Unavailable") sind zunächst nicht Teil der Umsetzung bzw. folgen später.

Für die Generierung werden per Batch-Aufruf die Fahrgestellnummern für PC und VANS aus den externen Auftragsnummernsystemen (GO und AFAB) abgerufen und bereitgestellt. Dies ist erforderlich, weil BTO-Fälle aus der Generierung mit Auftragsnummern angelegt werden und der Generierungsprozess ohne Fahrgestellnummer nicht fortgesetzt werden kann.