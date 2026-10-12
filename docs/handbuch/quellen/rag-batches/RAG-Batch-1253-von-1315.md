# Batch 1253 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation – Änderungen und Anpassungen**

**Produktdefinition und Produktabfrage**

Bei der Produktdefinition lässt sich die maximale Vertragslaufzeit in Monaten künftig mit bis zu drei Zeichen angeben. Bisher war der Wert auf zwei Zeichen begrenzt. Das war für Transporter (VANs) zu knapp, bei denen Verträge über zehn Jahre, also 120 Monate, üblich sind. Die Validierung wurde entsprechend erweitert.

Damit im gesamten System dieselben Kundentypen verwendet werden, gelten einheitliche Bezeichnungen: Privatkunde (PRIVATE_CUSTOMER), Gewerbekunde (COMMERCIAL_CUSTOMER), Leasing-Gewerbekunde (COMMERCIAL_CUSTOMER_LEASING, MBLD) und Gewerbe-Flottenkunde (COMMERCIAL_FLEET). Wird einem Produkt ein Kundentyp zugewiesen, stehen diese Typen zur Auswahl. Fragt ein Vertrag passende Produkte ab, enthält die Anfrage den Kundentyp, und es werden nur die Produkte zurückgegeben, die zu diesem Kundentyp passen.

**Schnittstelle „Produkte für Leasing“ (Edge Service)**

Alle Endpunkte, die eine Preismatrix liefern, nämlich /product/v1/leasing und /product/v1/online-sales, geben nun auch die Währung zurück. Sie wird als dreistelliger ISO-Code, zum Beispiel EUR, im Knoten priceConfigurations angegeben, und zwar einmal pro Produkt, ähnlich wie das Attribut „vat“.

Die Anfrage an den Endpunkt /product/v1/leasing wurde um optionale Attribute erweitert. MBLD kann zusätzlich zum Baumuster die vollständige Liste der SA-Codes (saCodeList) übermitteln. oneSCM filtert daraus die Codes heraus, die sich auf den Preis auswirken, also technische Optionen und ISP-Codes. Die gefundenen und angewendeten SA-Codes für technische Optionen erscheinen in der Antwort im Knoten „technicalOptions“. Das Attribut includedTechnicalOptionIds entfällt, da MBLD es nicht liefern kann; es wird durch die saCodeList ersetzt. Außerdem kann MBLD das Kundensegment von ROTF (Retail of the Future) im Attribut roftCustomerSegment übergeben. Es wird für die Zuordnung von Sonderrabatten benötigt. Die genaue Zuordnung wird noch abgestimmt, das Attribut ist aber bereits Teil der Schnittstelle. Zusätzlich kann MBLD über das Attribut priceDate auch frühere Preisversionen anfragen, etwa um eine Preisberechnung auf Basis einer früheren Anfrage zu wiederholen. Das ist nach einer Preisaktualisierung, zum Beispiel zu Jahresbeginn, erforderlich.

**Abgelaufene Versionen, Cluster und Produkte**

Abgelaufene Versionen, Cluster und Produkte werden zurückgegeben, sofern sie zugeordnet sind. In der Oberfläche werden abgelaufene Cluster und Preisversionen angezeigt, wenn die Cluster bereits Kampagnen zugeordnet sind. Ihre Auswahl ist deaktiviert. Bei Kampagnen mit Sticker Price ist zudem die Preismatrix abgelaufener Cluster deaktiviert.

**Marktsprachen und Vorlagen**

Ein Produkt muss Allgemeine Geschäftsbedingungen (T&C) in allen Sprachen der Markteinstellungen haben. Fügt ein Benutzer in den Markteinstellungen eine Marktsprache hinzu, wird er darüber informiert, dass auch alle Vorlagen (E-Mail-Vorlagen, Dokumentvorlagen und T&C) in dieser Sprache ergänzt werden sollen. Unternehmt er nichts, tritt wie bisher eine Fehlermeldung vom Typ „language DE missing“ auf.

**Kampagnen**

Wird in der Kampagnenerstellung der Rabattyp geändert, nachdem man bereits zu Schritt 2 gewechselt und wieder zurückgegangen ist, werden alle Angaben aus Schritt 2 zurückgesetzt. Bisher blieben z. B. Werte in der Preismatrix erhalten. Ebenso werden die in Schritt 2 angezeigten Produkte zurückgesetzt, wenn das Feld für den Kampagnentyp in Schritt 1 geändert wird.

In der Übersicht „Manage Campaigns“ gibt es eine neue Spalte „Auto Apply“. Sie zeigt „Yes“, wenn für die Kampagne die automatische Anwendung in der Händlerverkaufssicht aktiviert ist, andernfalls „No“.

**Weitere Oberflächenanpassungen**

Bei den Produktpreisen unter „Industry Surcharges“ wird das Warnsymbol am Ende einer Branche immer angezeigt, unabhängig von der Länge des Namens. Beim Anlegen einer Fahrzeuggruppe für Vans werden in Schritt 2 beide Tabellen angezeigt, auch wenn keine Daten vorliegen. Bisher erschien nur eine leere Tabelle, die zweite fehlte. Beide zeigen nun ihren jeweiligen Leerzustand.

**Product BluePrints und Datenübermittlung**

Der VEGA-Vertragstyp in BluePrints bleibt editierbar, auch wenn der BluePrint bereits in einem veröffentlichten Produkt verwendet wird. Bei Contingent-Produkten und Reifen darf die Contingent-Nummer im Payload nur für Base-Coverages gesendet werden, nicht für Optional- oder Body-Coverages. Hintergrund waren Probleme mit den VEGA-Dateien, die vom Vertrag gesendet werden.

**Noch nicht umgesetzt bzw. verworfen**

Die Vorlagen zum Herunter- und Hochladen sollen ein einheitliches Erscheinungsbild erhalten: Hintergrund im Mercedes-Benz-Blau (#0078D6, wb-blue-45) und weiße Schrift. Dies soll in allen Domänen gelten, in denen es solche Vorlagen gibt, unter anderem bei der Massenerstellung und der Händlerverwaltung. Die Umsetzung befindet sich noch im Backlog. Die geplante Änderung, bei Kampagnen im Status „Finished“, die sich noch in der Nachfrist (Grace Period) befinden, die automatische Anwendung nicht zu berücksichtigen, wurde abgebrochen. Als Begründung war genannt, dass Kampagnen in der Nachfrist die Freigabe des Marktes benötigen und nicht automatisch angewendet werden können.