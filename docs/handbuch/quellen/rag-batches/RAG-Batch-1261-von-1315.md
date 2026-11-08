# Batch 1261 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragskalkulation: Änderungen und Korrekturen**

**Produktveröffentlichung und Dokumente**

Ein Produkt kann künftig nicht mehr veröffentlicht werden, ohne dass ihm ein Dokument mit Allgemeinen Geschäftsbedingungen (T&C) zugeordnet ist. Die Schaltfläche „Publish Anyway" entfällt, und „Create T&C" ist nun die primäre Schaltfläche. Der Hinweistext lautet: „A product must have a Terms and Conditions document linked to it before publishing. You can create one from here using the Create T&C button. If you don't want to do that now, you can cancel, return to the product overview, and create it later from the Template Management page." Dieses Verhalten gilt für Frontend und Backend gleichermaßen. Außerdem tragen erzeugte Dokumente keinen Zeitstempel mehr im Dateinamen. Der Name lautet also beispielsweise „Service_Contract_15OEAASW_DE24PE.pdf" und nicht mehr „Service_Contract_15OEAASW_DE24PE_20240829130650.pdf".

**Kampagnenverwaltung**

Beim Anlegen einer Kampagne sind die Felder „Amount" und „Maximum Amount" auf maximal fünf numerische Zeichen begrenzt, von denen zwei auf die Nachkommastellen entfallen (zum Beispiel 999.12). Die Eingabevalidierung für Kostenstelle und Debitorennummer wurde korrigiert: Eine gültige Kostenstelle wie 269-0603 wurde zuvor fälschlich mit einer Fehlermeldung abgelehnt. Zudem waren beide Felder als Pflichtfelder ausgelegt, obwohl pro Kampagne nur eines von beiden benötigt wird, entweder Kostenstelle oder Debitorennummer. Darüber hinaus berücksichtigen Kampagnen nun die erlaubten Rabattarten eines Produkts. Ein Produkt, für das nur der Rabatt „Sales" erlaubt ist, soll bei einer Kampagne vom Typ „After Sales" nicht mehr auswählbar sein.

**Vertragserstellung**

In der Produktübersicht des Vertragserstellungsprozesses wurden bisher beim Überfahren eines Produkts alle Deckungsumfänge der Produktvorlage (Blueprint) angezeigt, auch optionale, die im Produkt gar nicht verwendet werden. Dies wurde korrigiert. Produkte mit Optionen, die immer enthalten sind („100%-Optionen"), werden nun unter „Included Coverages" aufgeführt. Das ist unter anderem für den Go-Live in Deutschland relevant, wo die Legal-Check-Option (TÜV) als 100%-Option zum Produkt „Excellent" hinzugefügt werden muss.

Die oben auf der Seite angezeigten Beträge für monatlichen und gesamten Bruttopreis wichen bei manchen Kombinationen von Laufzeit und Jahresfahrleistung vom Zahlungsplan ab, weil sie auf einer anderen Berechnungsgrundlage beruhten. Künftig werden dort dieselben Werte wie im Zahlungsplan verwendet. Außerdem werden bei der Produktauswahl nur noch Produkte angeboten, die zu den Vorgaben passen. Wird etwa ein aktueller Kilometerstand von 120.000 km angegeben, erscheinen keine Produkte mit einer maximalen Fahrleistung von 100.000 km bei Vertragsbeginn mehr.

**Produktdefinition und Produktlimits**

Die Beschriftungen beim Anlegen und Anzeigen von Produktlimits wurden gemäß der vorgegebenen Skizze korrigiert. Ein Produkt, dessen Erstellung unterbrochen wurde, etwa durch das Schließen des Browsers, war zuvor in der Produktübersicht nicht sichtbar, obwohl es angelegt wurde. Dieses Problem wurde behoben.