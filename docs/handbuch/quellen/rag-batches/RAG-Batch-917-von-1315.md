# Batch 917 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Massenanlage von Verträgen: Fahrzeuge hinzufügen und prüfen**

Mit der Funktion „Mass Creation“ können Verkäufer mehrere Serviceverträge für identisch konfigurierte Fahrzeuge in einem Vorgang anlegen. Alle Verträge teilen dieselben Produktbedingungen und Spezifikationen. Flottenkunden erhalten so ihre Verträge gesammelt, statt dass sie einzeln erstellt werden müssen. Die Funktion steht den Rollen MO, MPC, Dealer und Dealer+ für die Divisionen Passenger Car (PC) und VAN zur Verfügung und ist ausschließlich für Flottenkunden verfügbar. Alle Fahrzeuge müssen dasselbe Produkt, dieselbe Konfiguration, dieselbe Branche und dasselbe Zahlungsintervall haben. Insgesamt sind bis zu 100 Fahrzeuge möglich (ein Hauptfahrzeug plus 99 weitere). Auch die Konfiguration „Special Case“ wird unterstützt. Produkte mit einer „Grace Period Campaign“ sind ausgeschlossen.

**Einstieg und Produktkonfiguration**

Der Verkäufer meldet sich in oneSCM an, startet ein Vertragsangebot und wählt den Kundentyp „Fleet Customer“. Anschließend gibt er eine Kennung ein, entweder eine Fahrgestellnummer oder eine Auftragsnummer. Modellcodes (BM) werden nicht unterstützt; wird ein solcher eingegeben, ist die Massenanlage nicht verfügbar. Fehlt das Erstzulassungsdatum, wird je nach Kennung die Logik „Build to Order“ oder „Build to Stock“ berücksichtigt.

Danach ruft das System Produkte und Konfigurationen über die Produkt- und Fahrzeugdienste ab, und der Verkäufer konfiguriert das Produkt. Wird „Special Case“ gewählt, werden Zahlungsintervall und Preise ausgeblendet. Wird eine „Grace Period Campaign“ gewählt, ist die Schaltfläche „Mass Creation“ deaktiviert. Ist die Konfiguration abgeschlossen, werden Zahlungsintervall und Preis angezeigt (sofern zutreffend), und die Schaltfläche „Mass Creation“ in der Fußzeile wird aktiviert.

**Die Seite „Mass Creation“**

Ein Klick auf „Mass Creation“ öffnet eine neue Seite und erzeugt eine eindeutige Mass-Creation-ID, die im Backend verwendet wird. Der Kopfbereich enthält einen Hinweisbanner, dass alle konfigurierten Rabatte, Kampagnen und Sonderwünsche für alle gültigen Fahrzeuge gelten. Außerdem zeigt er die Anzahl der Fahrzeuge in der Tabelle an, die sich automatisch aktualisiert und standardmäßig 1 beträgt. Dazu kommen die Schaltflächen „Delete All Containing Error“ (nur aktiv, wenn Fehler vorliegen), „Download Template“ für die Excel-Vorlage und „Upload Template“. Hochgeladen werden können nur .xlsx-Dateien, die auf Viren geprüft und validiert werden.

Der Hauptbereich enthält die Fahrzeugtabelle mit den Spalten Kennungstyp, Kennung, Erstzulassungsdatum, Kilometerstand, Kennzeichen und Aktionen. In der Fußzeile bricht das „X“ die Massenanlage ab, und „<“ führt zurück zur Produktkonfiguration. „Confirm“ ist aktiv, sobald 2 bis 100 Fahrzeuge gültig sind. Befindet sich nur ein Fahrzeug in der Tabelle, bleibt die Schaltfläche deaktiviert.

**Regeln für die Fahrzeugeingabe**

Die erste Zeile ist das Hauptfahrzeug und schreibgeschützt. Die Zeilen 2 bis 100 sind für weitere Fahrzeuge vorgesehen. Fahrzeuge können manuell eingegeben, per Copy & Paste aus einer externen Quelle eingefügt oder per Excel-Upload hinzugefügt werden. Sobald eine Zeile vollständig ist, wird automatisch eine neue ergänzt. Werden mehr als 99 zusätzliche Fahrzeuge angegeben, werden die überzähligen verworfen.

**Validierung**

Die Prüfung erfolgt in drei Schritten. Zuerst findet die Frontend-Validierung statt, dann die Backend-Validierung der Fahrzeuge, und zuletzt wird die Produktkompatibilität geprüft.

Im ersten Schritt werden Formate und Pflichtfelder kontrolliert. Die Kennung ist ein Pflichtfeld. Entspricht sie dem Format einer Fahrgestellnummer oder Auftragsnummer, wird der Kennungstyp automatisch gesetzt, andernfalls erscheint „-“ und die Meldung „Unregistered Identifier“. Beim Erstzulassungsdatum wird das Datumsformat geprüft; bei ungültigem Format erscheint „Format Unknown“. Ist das Datum leer, gilt bei einer Fahrgestellnummer der Ablauf „Build to Stock“ und bei einer Auftragsnummer „Build to Order“. Beim Kilometerstand wird das numerische Format geprüft („Format Unknown“ bei Fehlern); ein leerer Wert wird für weitere Anfragen als „0“ gewertet. Beim Kennzeichen wird das Format nach den oneSCM-Regeln geprüft. Ist es leer, gilt „Build to Stock“ oder „Build to Order“, abhängig von Fahrgestellnummer und Erstzulassungsdatum. Sind jedoch Fahrgestellnummer und Erstzulassungsdatum vorhanden, erscheint „This field is required“. Bei jedem Formatfehler zeigt die Zeile ein Warnsymbol, die Löschfunktion in der Spalte „Aktionen“ wird aktiviert, ebenso „Delete All Containing Errors“ im Kopfbereich.

Im zweiten Schritt, nach Abschluss der Frontend-Prüfung, werden alle Fahrzeuge zur Validierung gesendet und die Mass-Creation-ID wird aktualisiert. Sobald die Backend-Aufrufe starten, wird auf allen besuchten Seiten ein Floater angezeigt; dieser wird in einem eigenen Epic behandelt. Bei der Kennung können die Fehler „External check failed“ (Fehler bei DSB-Aufrufen), „Unregisted identifier“ (keine Übereinstimmung) oder „Not Matching division“ (PC gegenüber VAN) erscheinen. Wird eine Kennung bearbeitet, wird die Mass-Creation-ID aktualisiert und die neuen Daten werden erneut geprüft. Ist im System ein Erstzulassungsdatum hinterlegt, überschreibt es den eingegebenen Wert, und in der Zelle erscheint die grüne Meldung „FRD Updated“; eine Löschaktion wird dabei nicht aktiviert. Ist kein Datum vorhanden, greift der Ablauf „Build to Stock“ bzw. „Build to Order“. Liegt der Kilometerstand unter dem zuletzt bekannten Stand, erscheint die Meldung „Minimum value is xxxxx. Mileage should be greater than or equal to the last known serviced mileage: xxxxx“. Der Benutzer kann den Wert dann korrigieren, wodurch das Fahrzeug erneut geprüft wird, oder die Zeile löschen. Das Kennzeichen wird nicht mit einem externen System abgeglichen. Ist es leer, gilt „Build to Stock“ oder „Build to Order“, und der Verkäufer muss die Information später als Aktualisierung nachtragen, um die Vertragsaktivierung fortzusetzen. Ein vom Frontend validierter Wert wird übernommen.

Im dritten Schritt muss jedes validierte Fahrzeug zur gewählten Produktkonfiguration passen. Geprüft werden Laufzeit, Laufleistung, Zahlungsintervall, Kampagne, Rabatte, Reifen, Special Case und weitere Produktoptionen. Ist ein Fahrzeug nicht zu 100 % kompatibel, erscheint „Not eligible for product“, die Löschfunktion und „Delete All Containing Errors“ werden aktiviert, und die Zeile zeigt ein Warnsymbol.

**Löschen von Zeilen**

Das Löschen einer einzelnen Zeile entfernt den gesamten Datensatz. „Delete All Containing Error“ entfernt alle Zeilen mit Warnsymbol. In beiden Fällen wird die Mass-Creation-ID aktualisiert.

**Abschluss und Preisanzeige**

Jede Änderung an der Produktkonfiguration (Laufzeit, Laufleistung, Kampagne, Rabatt, Reifenoptionen, Special Case) setzt die Validierung zurück und startet den Prozess neu. Sind alle Fehler beseitigt und alle Fahrzeuge gültig und kompatibel, wird die Mass-Creation-ID aktualisiert, Wert und Farbe des Floaters werden angepasst (im Floater-Epic beschrieben), der Verkäufer erhält eine interne Benachrichtigung, und die Schaltfläche „Confirm“ wird aktiviert. Ein Klick auf „Confirm“ speichert die Konfiguration entsprechend der Mass-Creation-ID und führt zurück zur Produktkonfiguration.

Wurde „Special Case“ gewählt, werden weder Zahlungsplan noch Preis angezeigt, und das Preisangebot kann nicht versendet werden. Ohne „Special Case“ wird der Zahlungsplan mit einem Tooltip angezeigt, der erklärt, dass für jedes Fahrzeug ein ähnlicher Zahlungsplan erzeugt wird. Das Preisangebot kann auch hier nicht versendet werden. Der Preis wird für ein Fahrzeug (je gewähltem Zahlungsintervall und gesamt) sowie für x Fahrzeuge angezeigt, wobei x die Anzahl der gültigen, für die Massenanlage qualifizierten Fahrzeuge ist. Da es sich um Flottenkunden handelt, werden Nettowerte angezeigt; beim Überfahren mit der Maus erscheinen Brutto- und Mehrwertsteuerwert.

Die beschriebenen Szenarien werden in „Phase 2“ der Entwicklung der Massenanlage umgesetzt. Gestaltung und Grafik folgen dem Mercedes-Benz Workbench.