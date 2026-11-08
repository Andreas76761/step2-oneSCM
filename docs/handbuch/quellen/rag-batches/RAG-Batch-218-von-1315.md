# Batch 218 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Steuerverwaltung für den Markt Indien (MBIL)**

Bisher ist die Steuerverwaltung in oneSCM für den deutschen Markt definiert, wobei die Standardsteuer die Mehrwertsteuer (VAT) ist. Mit der Einführung des neuen Marktes MBIL (Indien) wird die Steuer über den GST-Satz (Goods and Services Tax) ermittelt, der auf den Servicevertrag anzuwenden ist. Die GST löst in Indien die Mehrwertsteuer auf Lieferungen von Waren und Dienstleistungen ab. Für Indien steht dafür ein eigenes Steuermodul zur Verfügung, in dem die neuen Steuerarten und Steuersätze definiert werden.

Es gibt drei GST-Arten. Die CGST (Central Goods and Services Tax) wird von der Zentralregierung erhoben, wenn Waren oder Leistungen innerhalb eines Bundesstaates gehandelt werden. Die SGST (State Goods and Services Tax) wird bei Käufen oder Verkäufen innerhalb des eigenen Bundesstaates von der jeweiligen Landesregierung erhoben. Die IGST (Integrated Goods and Services Tax) kommt zur Anwendung, wenn die Ware oder Leistung aus einem anderen Bundesstaat stammt. Sie erleichtert Transaktionen über Staatsgrenzen hinweg und sorgt für eine faire Verteilung der Einnahmen zwischen den beteiligten Gebieten.

Wird ein Servicevertrag nach dem Fahrzeugkauf verkauft, ist darauf eine GST von 18 % anzuwenden. Bei Transaktionen innerhalb eines Bundesstaates (Intra-State) setzt sich diese aus 9 % CGST und 9 % SGST zusammen. Bei Transaktionen zwischen Bundesstaaten (Inter-State) werden 18 % IGST angewendet. Welcher GST-Satz beim Anlegen eines Servicevertrags gilt, richtet sich danach, in welchem Bundesstaat der Kunde ansässig ist.

**Steuerarten (Tax Types): Übersicht und Suche**

Die Übersicht der Steuerarten zeigt zunächst alle Einträge an, da anfangs kein Filter gesetzt ist und alle Filterfelder leer sind. Gesucht werden kann nach dem Namen (Treffer, wenn der Name das eingegebene Wort enthält) sowie über Auswahllisten, die ihre Werte aus der Datenbank beziehen, nach Tax Category, Customer Tax Classification und Type. Änderungen an den Filtern wirken sich nicht automatisch auf die Ergebnisse aus. Die Ergebnisse werden erst nach Klick auf „Search“ angezeigt. „Reset“ setzt die Filterauswahl auf den Ausgangszustand zurück, aktualisiert die Ergebnisse dabei aber nicht.

Die Ergebnistabelle enthält die Spalten Name (Standardsortierung), Tax Category, Customer Tax Classification, Type, Customer Classification und Actions. Übersteigt die Trefferzahl die maximale Anzahl pro Seite, werden die Ergebnisse auf mehrere Seiten verteilt, zwischen denen Admin-Benutzer wechseln können. Standardmäßig werden 10 Datensätze pro Seite angezeigt. Über eine Auswahlliste lässt sich der Wert auf 10, 20, 30, 40 oder 50 ändern. Die zuletzt gewählte Einstellung wird nicht gespeichert und nach einem Neuladen der Seite auf 10 zurückgesetzt.

**Steuerart anlegen**

Die Seite zum Anlegen einer Steuerart enthält folgende Felder:

Der Name ist ein Pflichtfeld mit mindestens 3 und höchstens 50 Zeichen. Sonderzeichen sind erlaubt. Derselbe Name darf nicht für mehrere Steuerarten verwendet werden, andernfalls erscheint eine Fehlermeldung.

Die Tax Category zeigt an, ob sich die Steuer auf den Kunden (Client) oder auf das Produkt (Product) bezieht. Sie wird über eine Auswahlliste mit diesen beiden Werten gewählt und ist ein Pflichtfeld.

Die Customer Tax Classification wird aus dem Wert des vorherigen Feldes abgeleitet und vorbelegt, da dieser die Beschreibung enthält. Mögliche Werte sind Standard, Exempt und Reduced. Auch dieses Feld ist ein Pflichtfeld.

Der Customer Tax Type ist ein Pflichtfeld, bei dem eine Auswahlliste mit dem vorausgewählten Wert GST zur Verfügung steht.

Der GST-Typ ist eine Mehrfachauswahl mit den Werten CGST, SGST und IGST.

Die Schaltfläche „Create“ ist ausgegraut, solange nicht alle Pflichtfelder ausgefüllt sind. Nach Klick auf „Create“ wird die Steuerart angelegt, der Benutzer wird zur Tabelle der Steuerarten weitergeleitet und die neue Steuerart erscheint dort. Wurde im Formular nichts eingegeben, führt „Cancel“ direkt zur Tabelle der Steuerarten zurück. Wurden bereits Angaben gemacht, erscheint ein Bestätigungs-Popup. Mit „Cancel“ wird das Popup geschlossen und der Benutzer bleibt auf der Erstellungsseite. Mit „Proceed“ wird das Popup geschlossen, die Änderungen werden verworfen und der Vorgang wird beendet.

Nach erfolgreichem Anlegen erscheint die Meldung „Tax Type <NAME> was successfully created“. Kann die Steuerart nicht angelegt werden, wird die Fehlermeldung „Tax type <NAME> could not be created.“ angezeigt. Diese Fehlermeldung enthält eine Schaltfläche „Close“ und bleibt sichtbar, bis der MPC-Benutzer sie schließt.

**Steuerart bearbeiten und löschen**

Beim Bearbeiten einer Steuerart kann nur der Name geändert werden. Es gelten dieselben Regeln wie beim Anlegen: Pflichtfeld, 3 bis 50 Zeichen, Sonderzeichen erlaubt, keine doppelten Namen (mit Fehlermeldung). Tax Category, Customer Tax Classification und Customer Tax Type sind nicht editierbar. Eine Steuerart kann nur gelöscht werden, wenn sie nicht für einen Steuersatz (Tax Rate) verwendet wird.

**Steuersätze (Tax Rates): Übersicht und Suche**

Auch die Übersicht der Steuersätze zeigt anfangs alle Einträge ohne Filter. Gesucht werden kann nach dem Namen (Treffer, wenn der Name das Wort enthält), nach der Financial Document Definition über eine Auswahlliste sowie nach Validity From und Validity To über jeweils einen Kalender mit Datumsformat. Wie bei den Steuerarten werden die Ergebnisse erst nach Klick auf „Search“ aktualisiert, „Reset“ setzt die Filter zurück, ohne die Ergebnisse zu aktualisieren.

Die Ergebnistabelle enthält die Spalten Name (Standardsortierung), Entity, Tax Type, FI Tax Code, FI Tax Code Description, Tax Factor, Validity im Format „Validity_from - Validity_to“ und Actions. Die Aktionen werden in anderen Epics behandelt. Die Seitenaufteilung funktioniert wie bei den Steuerarten: standardmäßig 10 Datensätze pro Seite, wählbar sind 10, 20, 30, 40 oder 50, und nach einem Neuladen der Seite gilt wieder der Standardwert 10.

**Steuersatz anlegen**

Die Seite zum Anlegen eines Steuersatzes enthält folgende Felder:

Der Name ist eine Einfachauswahl und ein Pflichtfeld. Zur Auswahl stehen alle eindeutigen Werte aus der Spalte Name im Reiter Tax Types.

Die Tax Category ist deaktiviert und wird anhand des gewählten Namens (z. B. „Standard_IN_Intra“) vorbelegt. Der Wert stammt aus der Spalte Entity im Reiter Tax Types.

Der Tax Type ist ebenfalls deaktiviert und wird anhand des gewählten Namens vorbelegt. Der Wert stammt aus der Spalte Tax Type im Reiter Tax Types.

Der Financial System Document Code ist ein Pflichtfeld. Es handelt sich um ein Textfeld mit 2 Zeichen, die aus Buchstaben (A–Z) und Ziffern (0–9) bestehen dürfen.

Die Financial Document Definition ist ein Pflichtfeld mit den Werten Invoice und Credit Note.

Valid from ist ein Pflichtfeld. Zulässig sind nur Datumswerte in der Zukunft, beginnend mit dem morgigen Tag.

Valid to ist ein Pflichtfeld, das standardmäßig auf den 31.12.2099 gesetzt und deaktiviert ist. Der Wert muss größer als der Wert von Valid from sein.

Der Tax Factor ist ein Pflichtfeld und besteht aus mehreren Feldern, abhängig von der gewählten Steuerart. Wurden beispielsweise zwei GST-Typen gewählt, erscheinen beide als Tax Factor und müssen ausgefüllt werden. Jedes Feld ist ein Textfeld, das Dezimalzahlen mit 2 Nachkommastellen zwischen 0 und 1 zulässt. Der gesamte Tax Factor ist die Summe aller GST-Komponenten. Hat die gewählte Steuerart nur CGST, entspricht der Tax Factor dem CGST-Wert. Sind IGST und CGST enthalten, ist der Tax Factor die Summe beider Werte. Bei der Definition eines Steuersatzes werden die Untersteuerarten SGST und CGST bzw. IGST entsprechend der gewählten Steuerart angezeigt.

**Konfiguration der Steuerverwaltung in oneSCM für Indien**

Im Reiter Tax Types sind folgende Steuerarten angelegt, jeweils mit Tax Category Client, Customer Tax Classification Standard, Type GST und Customer Classification Debtor: Standard_MBIL_INV_Intra, Standard_MBIL_CN_Intra, Standard_MBIL_INV_Inter und Standard_MBIl_CN_Inter.

Im Reiter Tax Rates sind den Steuerarten folgende Steuersätze zugeordnet, alle mit Entity Client, Tax Type GST und Tax Factor 0.18. Die Gültigkeit reicht jeweils vom aktuellen Datum plus einem Tag bis zum 31.12.2099.

Standard_MBIL_INV_Intra hat den FI Tax Code SA mit der Beschreibung Invoice. Standard_MBIL_CN_Intra hat den FI Tax Code SA mit der Beschreibung Credit. Standard_MBIL_INV_Inter hat den FI Tax Code SB mit der Beschreibung Invoice. Standard_MBIl_CN_Inter hat den FI Tax Code SB mit der Beschreibung Credit.

**Design**

Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.