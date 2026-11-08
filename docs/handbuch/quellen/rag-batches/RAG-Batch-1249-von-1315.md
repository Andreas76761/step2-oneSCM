# Batch 1249 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation: Neuerungen**

**Kampagnenverwaltung**

Die Eindeutigkeitsprüfung der „External Campaign ID" wurde erweitert. Bisher durfte eine bestimmte External Campaign ID zu einem Zeitpunkt nur für eine einzige Kampagne vergeben sein. Nun gilt diese Einschränkung nur noch innerhalb derselben Fahrzeuggruppe. Kampagnen, die sich zeitlich oder in ihrer Fahrzeuggruppe nicht überschneiden, können dieselbe External Campaign ID verwenden. Dadurch kann der Markt Deutschland Kampagnen flexibler definieren, insbesondere bei den Aktions-IDs für Verkaufssubventionen.

Außerdem werden Sticker-Price-Kampagnen mit dem Wert 0 nicht mehr an die Vertragserstellung (Contract Generation) übermittelt. Dasselbe gilt für Kampagnen mit dem Wert „null". Das ist der Fall, wenn für eine Konfiguration kein Wert in der Tabelle hinterlegt ist.

**Produktlinien**

Für die Division Passenger Cars wurde die Produktlinie „Basic" gelöscht. Auch die zugehörigen Einträge in der HQ-Konfiguration unter „Material Numbers Management" sollen entfernt werden. Alle bisherigen Basic-Blueprints wurden in die Produktlinie „Excellent" migriert.

Mit der Einführung der Division VAN gibt es für Vans eine eigene Liste von Produktlinien mit abweichenden Bezeichnungen. Für Vans stehen folgende Produktlinien zur Verfügung: Maintenance, Comfort, Complete, Tire, Extended Warranty, SelectPlus und Wear/Tear. Die Tabellen mit den Produktlinien für Passenger Cars und Vans werden auch in den Themen des Stream 3 (Material Number Board) verwendet, sodass für beide Divisionen nur eine Quelle gilt.

**Preismanagement**

Im Preismanagement können Cluster nun über alle vorhandenen Cluster hinweg nach ihrem Namen durchsucht werden.

Für die Indien-Konfiguration entfällt in der Produktkonfiguration die bisherige Obergrenze von 49.999,99 für den Preis in der Matrix aus Laufleistung und Laufzeit, sodass höhere Preiswerte erfasst werden können. Die ebenfalls vorgesehene indische Zahlendarstellung (1,00,000.00 statt 100,000.00) wird nicht hier, sondern in Stream 2 über ein separates Epic bzw. einen separaten Change Request umgesetzt.

**Leasing-Interpolation für das Reifenprodukt**

Damit die oneSCM-Preistabellen mit dem Leasingkanal kompatibel sind, wurden sie von der jährlichen Laufleistung auf die Gesamtlaufleistung erweitert. Die dafür erforderliche Interpolationslogik gilt nun auch für das kontingentbasierte Reifenprodukt.

Bei der Basispreistabelle des Reifenprodukts wird die empfohlene Reifenanzahl je Kombination aus Laufleistung und Laufzeit abgebildet. Randwerte der Tabelle liegen nicht zwischen zwei Preispunkten und können deshalb nicht interpoliert werden. Für sie wird kein Wert berechnet. Wird ein solcher Preispunkt über die getProducts-API angefragt, antwortet das System mit einer Fehlermeldung. Das entspricht der allgemeinen Interpolationslogik.

Interpolierte Werte werden gerundet, damit keine ungeraden oder gebrochenen Reifenanzahlen wie 7, 9, 6,5 oder 6,67 entstehen. Sie werden auf einen der beiden umgebenden Preispunkte gesetzt. Beispielsweise ergibt sich bei 48 Monaten und 65.000 Gesamtlaufleistung rechnerisch 9, was näher an 8 als an 12 liegt, also wird auf 8 gerundet. Bei 70.000 ergibt sich 10, exakt in der Mitte zwischen 8 und 12, hier wird auf 12 gerundet. Bei 75.000 ergibt sich 11, was näher an 12 liegt, also wird auf 12 gerundet.

Die übrigen Preistabellen des Reifenprodukts, nämlich Optionale Deckungen einschließlich 100-%-Optionen sowie Technische Optionen, werden nach ihrer Kostenabhängigkeit behandelt. Bei „No Dependency", „Duration Dependent" und „Mileage Dependent" erfolgt keine Interpolation. Bei „Duration Mileage Dependent" kommt die reguläre Interpolation zum Einsatz.

**Anzeige kompatibler Produkte**

Für die Anzeige kompatibler Produkte werden Daten bereitgestellt, die in bestimmten Fällen passende Hinweismeldungen ermöglichen. Ist für das Fahrzeug eine Wartung im DSB erfasst (Check 3), oder wurden Services durchgeführt, die nicht den Mercedes-Benz-Standards entsprechen (Check 4), meldet das System, dass die Eingabe keine Ergebnisse geliefert hat. Der Hinweis empfiehlt, eine gültige Fahrgestellnummer, Auftragsnummer oder einen gültigen Modellcode einzugeben und zusätzlich die durchgeführten Services bzw. deren Reihenfolge zu prüfen. Bei einer fehlerhaften Kennung (Check 5) werden keine Produkte angezeigt, und es erscheint der Hinweis, die Eingabe zu prüfen und anzupassen. Der Fall, dass nur eine abgelaufene Preisversion existiert (Check 6), wird zu einem späteren Zeitpunkt umgesetzt.

**Hauptnavigation**

Die Hauptnavigation wurde angepasst. Unter „Contract Generation" finden sich „Contract Proposal" und „Proposal Management". Die „MO Checks Verification" wird als eigenständiger Reiter zwischen „Contract Generation" und „Contract Management" geführt und enthält den Punkt „MO Checks Verification". „Product Testing" wird unter „Product Management" eingeordnet.