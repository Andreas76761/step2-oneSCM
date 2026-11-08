# 13 Reifenprodukte – Tyres

Dieses Kapitel beschreibt Reifenprodukte in oneSCM für Pkw und Vans. Sie erstellen Angebote und Verträge, in denen ein Reifenprodukt als eigenständiges Produkt oder als Option zu einem Servicevertrag enthalten ist. Das Kapitel führt durch die Einordnung, die Produktauswahl, die Konfiguration, den Preis, die Dokumente und die Aktivierung sowie durch die laufende Verwaltung und die Verlängerung. Die Anlage der Produkte, Blueprints und Preisversionen beschreiben die Kapitel 14 und 15. Die allgemeine Vertragserstellung beschreiben die Kapitel 5 bis 8.

## 13.1 Einordnung und Abgrenzung zum Standardprozess

**Zweck.** Ein Reifenprodukt ergänzt den Servicevertrag um Reifenleistungen. Sie verkaufen es entweder als eigenständiges Produkt oder als Option, die an einen Servicevertrag angehängt wird. Die Erfassung, Anzeige und Speicherung der Reifeninformationen ist für drei Produktvarianten einheitlich: das eigenständige Produkt „Tire Product Limited“, das eigenständige Produkt „Tire Product Unlimited“ und komplexe Produkte, bei denen eine Reifenoption zu einem anderen Produkt hinzukommt. Die Reifenangaben erscheinen in Angebot und Vertrag in derselben Form.

**Produktvarianten.** Ein Reifenprodukt mit begrenztem Umfang legt eine feste Anzahl abgedeckter Reifen fest. Diese Anzahl sehen Händler bei der Vertragskonfiguration, und sie fließt in die Preisberechnung ein. Ein Reifenprodukt mit unbegrenztem Umfang hat keine Reifenanzahl. In einem komplexen Produkt können eine Option mit unbegrenzten Reifen und eine Option mit begrenzten Reifen gemeinsam enthalten sein. Die Daten übergibt das System vollständig an die Vertragsgenerierung. Eine Prolongation ist möglich, Kapitel 13.7 beschreibt sie.

Für Vans gibt es das Reifenprodukt „Van Unlimited“. Es lässt sich eigenständig verkaufen oder als Option an ein bestehendes Servicevertragsprodukt anhängen.

Reifenprodukte gehören zur Produktlinie „Tire“. Das Ablaufkriterium dieser Produkte ist Zeit. Abweichungen von diesem Ablaufkriterium bei Unlimited-Produkten sind im Klärungsbedarf erfasst.

**Voraussetzungen.** Das Reifenprodukt ist angelegt und konfiguriert, bevor Sie es im Angebot auswählen.

**Rollen.** Die Rollen Händler, Mercedes-Benz Niederlassungen, kurz MO, und MPC bieten Serviceverträge für Reifenprodukte an und erzeugen sie. Für Vans nutzen die Rollen Dealer Van, MO Van und MPC Van die Funktion Van Unlimited.

**Schritt für Schritt.** Material: keine Quellen in den RAG-Batches

**Ergebnis und Systemstatus.** Ein angelegtes und konfiguriertes Reifenprodukt steht in der Vertragserstellung zur Auswahl. Serviceverträge mit Reifenprodukt unterstützen optionale Deckungen, Händlerrabatte, Kampagnen und die Händlerprovision. Technische Optionen lassen sich einem Servicevertrag mit Reifenprodukt nicht hinzufügen.

**Besonderheiten je Rolle, Sparte und Markt.** Reifenprodukte stehen für alle Kundentypen aus B2C und B2B sowie für jede zugewiesene Branche zur Verfügung. Das Produkt Van Unlimited steht ausschließlich für Van-Kunden und Van-Identifikatoren zur Verfügung. Es ist für die Kundentypen Privat, Gewerbe und Gewerbe-Flotte verfügbar, sofern das Produkt diese Kundentypen vorsieht.

**Hinweise.** In der gesamten Anwendung heißt die Bezeichnung für Reifenoptionen „Tire Product Reference“, auch in allen Bereichen, in denen das Reifenprodukt erwähnt wird. Die Schreibweise der Kategorie in den Coverage Codes ist im Klärungsbedarf erfasst.

Quellen: Batch 924.1, 937.2, 977.1, 1119.1, 1171.1, 1201.1, 1252.3

## 13.2 Produkt, Reifentyp und Reifengröße

**Zweck.** Dieser Abschnitt beschreibt die Angaben zum Reifen, die Sie im Angebot auswählen und die anschließend im Vertrag stehen: Wetterprofil, Reifentyp, Reifengröße, Felgen, Radgröße und die Reifenoption. Die Anzahl der Reifen behandelt Kapitel 13.3, die Auswahl der Reifenoption Kapitel 13.4.

**Voraussetzungen.** Dem Reifenprodukt ist mindestens ein Wetterprofil zugeordnet. Die Vertragskalkulation liefert das Wetterprofil im Produktpayload mit.

**Rollen.** Händler, MO und MPC wählen Reifenprodukte mit begrenztem Umfang für alle Kunden und Kennungen aus, konfigurieren sie und erstellen daraus ein Angebot. Die Rollen Dealer Van, MO Van und MPC Van nutzen die Van-Funktionen.

**Schritt für Schritt.**

1. Wählen Sie im Angebot das Reifenprodukt aus den Produkten, die die Vertragskalkulation für die Kennung ermittelt.
2. Konfigurieren Sie Vertragslaufzeit, jährliche Laufleistung und Zahlungsintervall. Das Feld „Wetterprofil“ wird erst aktiv, wenn das Zahlungsintervall ausgefüllt ist.
3. Wählen Sie das Wetterprofil. Das Feld ist ein Dropdown mit Einfachauswahl. Liefert die Vertragskalkulation nur einen Wert, ist das Feld vorbelegt und nicht editierbar.
4. Erst wenn das Wetterprofil ausgewählt oder vorbelegt ist, werden die Anzahl der Reifen, der Reifentyp und die Reifengröße freigeschaltet. Danach folgen optionale Deckungen, Händlerrabatt und Kampagne.
5. Wählen Sie die Felge: enthalten oder nicht enthalten. Liefert die Produktantwort nur eine Option, zeigt das Angebot sie schreibgeschützt an.
6. Die Radgröße ist ein Anzeigefeld, dessen Wert aus der Produktantwort stammt. Bei Vans zeigt ein Tooltip zur gewählten Radgröße die konkreten Reifengrößen an, zum Beispiel 195/65 R16.
7. Wählen Sie bei einem Reifenprodukt mit begrenztem Umfang den Reifentyp und die Reifengröße.
8. Konfigurieren Sie bei einem komplexen Produkt die Reifenoption, wie in Kapitel 13.4 beschrieben.

**Ergebnis und Systemstatus.** Nach der Konfiguration zeigen die technischen Optionen Wetterprofil, Reifentyp und Reifengröße so, wie die Vertragskalkulation sie im Produktpayload liefert. Die Attribute erscheinen auch in den technischen Spezifikationen der Dokumentvorlagen.

Hat der MPC je Cost Unit eine Wetterprofil-Empfehlung hinterlegt, übergibt das System sie an die Vertragsgenerierung, und der Händler sieht sie dort.

Die Vertragsgenerierung bietet dem Händler nur Reifen an, die der Matching-Logik und den Fahrzeugdaten entsprechen. Die Matching-Logik beschreibt der Klärungsbedarf.

**Besonderheiten je Rolle, Sparte und Markt.** Im Pkw mit begrenztem Umfang erscheinen Reifengröße, Reifentyp, Wetterprofil, Felgen inklusive und Anzahl der Reifen. Im Pkw mit unbegrenztem Umfang entfällt die Anzahl der Reifen. Im Van mit begrenztem Umfang erscheinen Radgröße, Wetterprofil, Felgen inklusive und Anzahl der Reifen; ein Reifentyp wird nicht angezeigt. Im Van mit unbegrenztem Umfang entfällt zusätzlich die Anzahl der Reifen. Die Angaben zum Reifenlieferanten sind im Klärungsbedarf erfasst.

Ein Reifenprodukt kann Reifen mit Felgen und Reifen ohne Felgen anbieten. Die angezeigte Preismatrix richtet sich nach der Auswahl der Felge.

Für Vans steht die Radgröße zur Verfügung. Sie ist als technische Option der Gruppe Wheel Size hinterlegt.

**Hinweise.** Das Produkt bietet MO-Reifen immer an. Weitere Reifentypen bietet es nur an, wenn sie im Produkt ausgewählt sind. Ist das Fahrgestell ab Werk mit einem dieser Reifentypen ausgestattet, ordnet das System dessen Preis zu. Ist der Reifentyp nicht ausgewählt, ordnet das System bei entsprechender Werksausstattung die Preise der MO-Reifen zu.

Die Radgrößen des Produkts liegen zwischen 15 und 23 Zoll. Im Angebot stehen die Radgrößen zur Verfügung, die im Produkt ausgewählt sind.

Die Felder Wetterprofil, Stahlfelge und Radgröße müssen ausgefüllt sein, wenn Sie eine Reifenoption wählen.

Quellen: Batch 875.1, 875.2, 924.2, 926.1, 926.3, 937.2, 937.3, 937.5, 1093.3, 1119.4, 1119.5, 1141.2, 1142.2, 1143.1, 1160.6, 1201.3

## 13.3 Laufzeit, Laufleistung und Leistungsumfang

**Zweck.** Dieser Abschnitt beschreibt, wie Sie Vertragslaufzeit, jährliche Laufleistung, Zahlungsintervall und Anzahl der Reifen im Angebot konfigurieren. Der Leistungsumfang eines Reifenprodukts ergibt sich bei begrenztem Umfang aus der Reifenanzahl. Bei unbegrenztem Umfang entfällt die Reifenanzahl.

**Voraussetzungen.** Sie haben ein Angebot gestartet, eine Fahrgestell- oder Auftragsnummer eingegeben und ein Reifenprodukt ausgewählt. Die Produktliste enthält es, weil die Vertragskalkulation es für die Kennung liefert. Die Konfiguration folgt der Konfiguration von Produkten mit Ablauf nach Zeit oder Laufleistung.

**Rollen.** Händler, MO und MPC konfigurieren Serviceverträge für Reifenprodukte und erzeugen daraus Angebote.

**Schritt für Schritt.**

1. Öffnen Sie die Startseite für Vertragsangebote und wählen Sie den Kundentyp. Bei gewerblichen Kundentypen wählen Sie zusätzlich die Branche.
2. Geben Sie die Fahrgestell- oder Auftragsnummer ein. Ergänzen Sie bei einer Fahrgestellnummer die Erstzulassung, den tatsächlichen Kilometerstand oder das Kennzeichen, sofern das System diese Angaben nicht liefert.
3. Konfigurieren Sie Vertragslaufzeit, jährliche Laufleistung und Zahlungsintervall in dieser Reihenfolge. Jedes Feld wird erst aktiv, wenn das vorherige ausgefüllt ist.
4. Bei Vans wählen Sie die Fahrzeuggruppe. Das Feld ist schreibgeschützt, wenn nur eine Gruppe zur Auswahl steht.
5. Konfigurieren Sie Wetterprofil, Stahlfelge und Radgröße wie in Kapitel 13.2 beschrieben.
6. Wählen Sie die Anzahl der Reifen im Feld „Number of Tires“. Das System schlägt das empfohlene Reifenkontingent aus der Preistabelle vor. Sie ändern den Wert innerhalb des Minimums und des Maximums, die das Produkt festlegt. Die Schrittweite beträgt 2. Sie können also 6 Reifen auswählen, aber nicht 7.
7. Prüfen Sie die Produktkarte. Jede Auswahl aktualisiert die Angaben und den Konfigurationspreis in der Produktkarte auf der rechten Seite.
8. Erstellen Sie das Angebot. Das System speichert das Angebot und die Produktkonfiguration. Die weiteren Schritte beschreiben die Kapitel 13.4 und 13.5.

**Ergebnis und Systemstatus.** Das Angebot enthält die gewählte Vertragslaufzeit, die jährliche Laufleistung, das Zahlungsintervall und die Reifenangaben. Die Produktkarte zeigt den berechneten Preis. Die Preise und die Auswahl aktualisieren sich bei jeder Änderung.

**Besonderheiten je Rolle, Sparte und Markt.** Ein Reifenprodukt, das nur als Produktoption verkauft wird, hat kein eigenes Ablaufkriterium. Das Hauptprodukt bestimmt es.

Ein Reifenprodukt mit begrenztem Umfang erfasst zusätzlich zu den Standardangaben Wetterprofil, Reifenanzahl, Reifentyp und Reifengröße.

Die Produktkonfiguration der Reifenverträge entspricht der Konfiguration von Produkten mit Ablauf nach Zeit oder Laufleistung. Technische Optionen, Leistungen, Kampagnen und Rabatte funktionieren gleich, sowohl bei der Baumuster-Kennung als auch bei anderen Kennungen. Die Abgrenzung zwischen begrenzten, unbegrenzten und komplexen Reifenprodukten ist im Klärungsbedarf erfasst.

**Hinweise.** Die Zahlungsintervalle sind Monthly, Quarterly, Halfyearly, Yearly und Onetime. Wird das Zahlungsintervall von Onetime auf Monthly gestellt, zeigt die Produktkarte den Monatspreis. Das Zahlungsintervall lässt sich danach wieder auswählen.

Das Feld „Vehicle group“ ist nur aktiv, wenn mehrere Einträge zur Auswahl stehen.

Das Pflichtfeld für die Reifenanzahl heißt „Number of Tires“.

Quellen: Batch 899.7, 924.2, 929.4, 937.3, 1064.4, 1093.3, 1100.3, 1119.2, 1173.1, 1256.3, 1257.4

## 13.4 Preis, Optionen und Kampagnen

**Zweck.** Dieser Abschnitt beschreibt, wie oneSCM den Preis eines komplexen Servicevertrags mit Reifenoption berechnet, wie Sie die Reifenoption auswählen und welche Rabatte und Kampagnen gelten.

**Voraussetzungen.** Das Reifenprodukt ist mit Preisen angelegt. Die Sales Dependency ist als Mehrfachauswahl aus Standalone Product und Product Option konfiguriert. Ein Servicevertragsprodukt mit Reifenoption und die zugehörigen Preise sind vorhanden.

**Rollen.** Händler, MO und MPC bieten Serviceverträge mit Reifenoption an und erzeugen sie.

**Schritt für Schritt.**

1. Wählen Sie aus den passenden Produkten den komplexen Servicevertrag mit Reifenoption.
2. Konfigurieren Sie Vertragslaufzeit, jährliche Laufleistung und Zahlungsintervall.
3. Fügen Sie optional technische Optionen zum Servicevertrag hinzu und wählen Sie anschließend optional die Deckungen des Servicevertrags.
4. Wählen Sie die Reifenoption aus. Die Optionen zeigen den Produktnamen und eine Beschreibung statt des VEGA-Codes. Genau eine Option ist ausgewählt. Die übrigen Optionen bleiben auswählbar, und Sie wechseln beliebig oft zwischen ihnen. Die Auswahl ist nicht verpflichtend.
5. Prüfen Sie die Attribute der gewählten Option. Bei einer begrenzten Option ist die Anzahl der Reifen mit dem empfohlenen Wert vorbelegt, den der Produkt-Microservice berechnet. Sie ändern den Wert innerhalb des zulässigen Bereichs. Bei einer unbegrenzten Option entfällt die Reifenanzahl.
6. Wählen Sie Wetterprofil, Stahlfelge und Radgröße. Wenn Sie eine Reifenoption wählen, müssen diese Angaben ausgefüllt sein.
7. Wählen Sie optional die Deckungen der Reifenoption. Es stehen nur die Deckungen zur Verfügung, die auf Produktebene definiert sind.
8. Wählen Sie optional Rabatte und Kampagnen. Angezeigt werden nur die Kampagnen des Hauptprodukts, zum Beispiel Excellence. Kampagnen der Reifenoption sind nicht sichtbar und nicht auswählbar.
9. Wählen Sie optional Kulanzzeit-Kampagnen oder stellen Sie eine Sonderfallanfrage. Danach erstellen Sie das Angebot.

Ist die Reifenoption bereits Teil des Vertrags, zeigt das System sie vorausgewählt und schreibgeschützt mit ihrem Konfigurator an. Optionale Deckungen bleiben auswählbar. Der Schritt für die Reifenoption erscheint nur bei komplexen Produkten mit Reifenoption oder mit Reifenoption und Deckungen.

**Ergebnis und Systemstatus.** Das System berechnet den Servicevertrag und das Reifenprodukt zunächst jeweils einzeln, als wären sie eigenständige Produkte. Der Gesamtpreis ist die Summe beider Produkte. Die Zahlungsadministrationsgebühr und die Rabattkampagne des Reifenvertrags fließen nicht ein.

Der Fahrzeuggesamtpreis setzt sich aus Basispreis, Optionspreis, Preis der technischen Option und Branchenfaktorpreis zusammen. Der Marktlistenpreis berücksichtigt den Fahrzeuggesamtpreis, die Händlerprovision, die Zahlungsadministrationsgebühr, die Administrationsgebühr und den Inflationsaufschlag. Der Kundennettopreis ergibt sich aus dem Marktlistenpreis abzüglich Rabattkampagne und Händlerrabatt. Der Kundenbruttopreis ist der Kundennettopreis zuzüglich Mehrwertsteuer.

Die Übergabe an die Vertragsgenerierung enthält die Preisfaktoren. Die Reifenoption ist darin als durch den Händler auswählbar gekennzeichnet. Der Preis der Reifenoption aktualisiert sich, nachdem der Händler die Auswahl bestätigt hat.

Die Preise und die Auswahl aktualisieren sich bei jeder Änderung in der Konfigurationsanzeige auf der linken Seite.

**Besonderheiten je Rolle, Sparte und Markt.** Der Händlerrabatt ist der vom Händler auf den Gesamtpreis vergebene Wert. Er darf den Preis ohne Mehrwertsteuer nicht übersteigen.

Die Reifenoption berücksichtigt das System nur, wenn der Händler sie ausdrücklich auswählt.

Die Händlerprovision ergibt sich aus dem Maximalwert des Servicevertrags und dem Maximalwert der Reifenoption.

Bei der Kombination mit einer Reifenoption gilt bei der Zahlungsadministrationsgebühr nur die Gebühr des Servicevertrags. Die Administrationsgebühr der Reifenoption ist im Klärungsbedarf erfasst.

Ein Servicevertragsprodukt kann Kundentypen von der Reifenoption ausschließen. Zur Auswahl stehen Private, Commercial, Commercial Fleet, Private Governmental und Commercial Governmental. Diese Kundentypen können die Reifenoption im Zusammenhang mit dem Servicevertrag nicht erwerben.

Der Weg über das Baumuster führt ebenfalls zum Angebot. Für eine unverbindliche Preisinformation wählen Sie die Fahrzeuggruppe. Das Feld ist schreibgeschützt, wenn nur eine Gruppe infrage kommt. Servicevertrag und Reifenoption konfigurieren Sie wie beschrieben. Die Radgröße wählen Sie anhand von Wetterprofil und Stahlfelge aus dem verfügbaren Größenbereich. Ist nur eine Größe möglich, ist das Feld schreibgeschützt. Anschließend drucken Sie die Preisinformation oder versenden sie per E-Mail.

Für den Leasingkanal sind die Preistabellen von der jährlichen Laufleistung auf die Gesamtlaufleistung erweitert. Diese Interpolation gilt auch für das kontingentbasierte Reifenprodukt.

**Hinweise.** Die Reifenmatrix enthält die Anzahl der Reifen und keinen Preispunkt.

Bei der Basispreistabelle, die das empfohlene Reifenkontingent je Kombination aus Laufleistung und Laufzeit abbildet, liegen die Randwerte nicht zwischen zwei Preispunkten. Für sie berechnet das System keinen Wert. Eine Anfrage über die getProducts-API liefert in diesem Fall eine Fehlermeldung.

Interpolierte Werte werden gerundet, sodass keine ungeraden oder gebrochenen Reifenzahlen entstehen. Das System ordnet sie dem nächstliegenden der beiden umgebenden Preispunkte zu. Bei genau mittiger Lage wählt es den höheren Preispunkt. Bei 48 Monaten und 65.000 Gesamtlaufleistungskilometern ergibt die Interpolation rechnerisch 9 und wird auf 8 gerundet. Bei 70.000 ergibt sie 10 und wird auf 12 gerundet. Bei 75.000 ergibt sie 11 und wird auf 12 gerundet.

Die optionalen Deckungen einschließlich der 100-Prozent-Optionen und die technischen Optionen werden nach ihrer Kostenabhängigkeit interpoliert. Bei „No Dependency“, „Duration Dependent“ und „Mileage Dependent“ erfolgt keine Interpolation. Bei „Duration Mileage Dependent“ kommt die reguläre Interpolation zum Einsatz.

Der Schritt für die Reifenoption ist im Klärungsbedarf mit einer abweichenden Nummerierung erfasst.

Quellen: Batch 783.4, 875.1, 937.5, 1064.4, 1119.6, 1150.5, 1168.1, 1169.1, 1249.4, 1250.4

## 13.5 Antrag, Dokumente und Aktivierung

**Zweck.** Dieser Abschnitt beschreibt die Übersicht und Bestätigung, die Dokumente und die Aktivierung eines Vertrags mit Reifenprodukt.

**Voraussetzungen.** Das Angebot ist erstellt und die Produktkonfiguration gespeichert. Der Vertrag hat den Status Created. Die Dokumentvorlagen enthalten den Abschnitt zu den Reifenangaben.

**Rollen.** Händler, MO und MPC rufen Reifenprodukte für alle Kunden und Kennungen ab, konfigurieren sie und erstellen daraus ein Angebot.

**Schritt für Schritt.**

1. Erstellen Sie das Angebot. Das System speichert das Angebot und die Produktkonfiguration.
2. Prüfen Sie die Übersicht und Bestätigung. Der Bereich Product Option enthält den Produktnamen, bei komplexen Produkten den Namen des Hauptprodukts. Außerdem stehen dort der Zeitraum vom Vertragsbeginn bis zum Vertragsende, die jährliche Fahrleistung, die Zahlungsoption und der Vertragsbeginn.
3. Prüfen Sie den Bereich mit den Reifenangaben. Er enthält den Produktnamen, das Wetterprofil, die Felgen inklusive, die Radgröße, die Reifengröße, den Reifentyp, die technischen Optionen und die Anzahl der inkludierten Reifen. Der Produktname erscheint immer. Bei fehlendem Wert erscheint ein Bindestrich. Bei komplexen Produkten zeigt die Anzahl der inkludierten Reifen den erfassten Wert oder „Unlimited“.
4. Prüfen Sie die Angebotsdetails. Der Reiter Fahrzeug zeigt keinen Reifentyp und keine Reifengröße. Diese Angaben stehen im Bereich Reifendetails der Angebotsdetails.
5. Prüfen Sie den Reiter Deckungsdetails. Er führt alle Deckungen des Reifenprodukts auf. Bei komplexen Servicevertragsprodukten mit Reifenoption erscheinen dort die Deckungen des Servicevertrags und der Reifenoption.
6. Prüfen Sie die Dokumente. Die Vorlagen decken das Reifenprodukt Limited und das Reifenprodukt Unlimited als eigenständige Produkte ab sowie komplexe Produkte mit Reifenoption. Der Abschnitt mit den Reifenangaben erscheint nur, wenn er auf der Übersichts- und Bestätigungsseite vorhanden ist. Es werden nur Felder mit einem Wert befüllt.
7. Aktivieren Sie den Vertrag. Bei der Aktivierung und der Erzeugung der i155 ergänzt das System den Reifentext um den Hinweis, dass ein Reifenersatz laut Vertrag nur für das gewählte Wetterprofil zulässig ist, zum Beispiel für das Wetterprofil Sommer. Auch in den externen Vertragsinformationen auf RC10 wird der Satz an den bestehenden Text angehängt.
8. Nach der Aktivierung zeigt die Vertragsdetailansicht die Reifendetails. Kapitel 13.6 beschreibt sie.

**Ergebnis und Systemstatus.** Bei einem Vertrag mit dem Status Created zeigen Übersicht und Bestätigung für alle drei Produktvarianten ein einheitliches Bild.

Nach der Aktivierung enthält der Vertrag die Tabelle Reifendetails. Die Reifenangaben im Angebot und nach der Aktivierung im Vertrag sind identisch aufgebaut.

Die Auswahlliste für die Reifenanzahl trägt die Beschriftung „Number of Tires“.

**Besonderheiten je Rolle, Sparte und Markt.** Die Dokumentvorlagen gelten für Angebot, Bestätigung, Preisinformation, Verlängerung, Übertragung, Informationsübertragung sowie für die Massenerstellung von Angeboten und Bestätigungen.

Die Dokumentvorlagen enthalten das Attribut Wetterprofil für Angebot, Bestätigung, Übernahmeangebot, Übernahmebestätigung, Preisinformation, Verlängerungsinformation und Verlängerung.

Für ein komplexes Produkt präsentiert die Vertragserstellung die Terms and Conditions des Hauptprodukts und der Reifenoption. Ein komplexes Produkt enthält stets beide.

Im Angebots- und Bestätigungsdokument steht der Abschnitt unter dem Bereich Product Options. Im Dokument zur Preisinformation erscheint er unter der Tabelle Product Options.

Der Hinweis, dass der Reifenservice im Netz des Reifenlieferanten erbracht wird, erscheint nur, wenn ein externer Reifenlieferant hinterlegt ist. Der Hinweis steht unterhalb des Bereichs mit den Reifenangaben. Die Angaben zum Reifenlieferanten sind im Klärungsbedarf erfasst.

**Hinweise.** Der Reifenabschnitt erscheint in der Vorschau der Vorlagen mit den Druckvariablen. Die Vorschau zeigt den Bereich mit den reifenproduktspezifischen Angaben und den Hinweistext.

**Fehlerbehebung.** Die Aktivierung eines Vertrags mit einem komplexen Reifenprodukt verläuft ohne Fehlermeldung. Die optionalen Deckungen erscheinen nur einmal. Die Preise der Reifenoption werden korrekt dargestellt. Der Zahlungs-Tab eines Vertrags mit Reifenprodukt lädt ohne Serverfehler.

Quellen: Batch 368.1, 809.1, 924.3, 926.1, 926.2, 926.3, 937.3, 1061.3, 1100.3, 1119.6

## 13.6 Laufende Verwaltung und Leistungsbezug

**Zweck.** Dieser Abschnitt beschreibt, wie Sie die Reifenleistung eines aktivierten Vertrags prüfen, wie importierte Schadenfälle die Anzahl der verbrauchten Reifen verändern und welche Angaben die Schnittstellen übermitteln.

**Voraussetzungen.** Der Vertrag ist aktiviert und enthält ein Reifenprodukt oder einen komplexen Servicevertrag mit Reifenoption. Die Schnittstelle i156 liefert Schadenfälle an den Vertrag. Jobs, die auf gemeinsame Daten zugreifen, laufen nicht gleichzeitig.

**Rollen.** Material: keine Quellen in den RAG-Batches

**Schritt für Schritt.**

1. Öffnen Sie die Vertragsdetailansicht und wechseln Sie in den Reiter Contract.
2. Prüfen Sie den Abschnitt Tire Details unter Contract Details. Er zeigt den Produktnamen, das Wetterprofil, die Felgen inklusive, die Radgröße, die Reifengröße, den Reifentyp, die technischen Optionen und die Anzahl der inkludierten Reifen.
3. Bei einem unbegrenzten Produkt zeigt Tire Details den Produktnamen aus den Daten von Stream 1 und die Anzahl der inkludierten Reifen als „unlimited“. Bei einem begrenzten Produkt zeigt das Feld die gewählte Anzahl.
4. Prüfen Sie den Zähler für die beanspruchten Reifen. Er steht bei Vertragsbeginn auf 0 und passt sich an, sobald ein Schadenfall importiert wird. Der Zähler gilt für alle Reifenprodukte, also für Limited, Unlimited und komplexe Produkte mit Reifenoption.
5. Lesen Sie die Zählung. Gezählt werden ausschließlich Reifen, nicht Service oder Einlagerung. Werden im Winter Winterreifen beansprucht, erhöht sich der Zähler. Werden im Frühjahr wieder die ursprünglichen Reifen montiert, bleibt der Zähler unverändert.
6. Die Anzahl der enthaltenen Reifen ist eine gerade Zahl.
7. Das System importiert Revenue Claims über die Schnittstelle i156, die in RC20 an Position 198 das Zeichen „+“ oder „-“ enthalten. Der Wert aus RC20 an den Positionen 199 bis 202 wird an den Vertrag übergeben. Der Vertrag gleicht Vertragsnummer, Fahrgestellnummer und Leistung ab.
8. Das System addiert den Wert bei einem Pluszeichen zu den genutzten Reifen und subtrahiert ihn bei einem Minuszeichen. Die Oberfläche aktualisiert sich. Ein Beispiel mit Testdaten: Bei einem Vertrag über 8 Reifen führt ein Claim über 3 Reifen mit „+“ zu 3 genutzten Reifen. Ein zweiter Claim über 2 Reifen mit „+“ erhöht den Stand auf 5. Ein dritter Claim über 4 Reifen mit „-“ senkt ihn auf 1.
9. Ist die Anzahl der beanspruchten Reifen gleich der enthaltenen Anzahl, endet der Vertrag nicht, sondern läuft weiter.
10. Wird ein VEGA-Schadenfall für eine bestimmte Anzahl Reifen angelegt, aktualisiert sich der Wert Geltend gemachte Reifen in den Vertragsdetails.

**Ergebnis und Systemstatus.** Nach jeder Aktualisierung erzeugt das System eine aktualisierte i155 und sendet sie an VEGA. In RC10 übermittelt das System dieselben Werte wie bei der Aktivierung.

Bei VEGA-Forderungen sind die angezeigten Informationen mindestens eine Woche alt, weil die i156 einmal pro Woche oder zu einem von der Architektur festgelegten Zeitpunkt erzeugt und verarbeitet wird.

Die i155 überträgt den Reifenlieferanten nicht. Stattdessen überträgt sie den Stückkostenwert aus den Produktdaten pro Deckung in das Feld SERVICE_PROVIDER des Record Type 20. Das Feld ist 50-stellig und alphanumerisch.

In der i155 steht in RC20 an Position 175 immer der Wert 1. Die Positionen 165 bis 169 enthalten den Kontingentstartwert, wobei die letzte Stelle eine Dezimalstelle ist. Bei 4 Reifen lautet der Wert 00040. Die Positionen 170 bis 174 enthalten den aktuellen Verbrauch. Der Standardwert ist 00000, danach steht der übernommene Wert aus der i156.

**Besonderheiten je Rolle, Sparte und Markt.** Die Reifendeckungen stehen als eigene Gruppe in der Vertragsdetailansicht. Die Reihenfolge ist Basisdeckungen, optionale Deckungen und Reifendeckungen. Die Anzeigeregeln gelten auch für bestehende Verträge. Die Datenverfügbarkeit bei Altverträgen ist im Klärungsbedarf erfasst.

**Hinweise.** Steht die i156 nicht zur Verfügung, gibt es keine aktualisierten Informationen.

Jobs, die auf gemeinsame Daten zugreifen, dürfen nicht gleichzeitig laufen. Während des Imports der i156 startet beispielsweise der Job für die i155 nicht.

In einzeiligen Texteingabefeldern entfernt das System führende und nachfolgende Leerzeichen, sobald Sie das Feld verlassen. Mehrere aufeinanderfolgende Leerzeichen zwischen Wörtern fasst das System zu einem Leerzeichen zusammen. Mehrzeilige Textfelder sind davon ausgenommen.

**Fehlerbehebung.** Stimmen Vertragsnummer, Fahrgestellnummer oder Leistung eines Claims nicht mit dem Vertrag überein, importiert das System den Claim nicht und versendet eine Logdatei. Der Empfänger der Logdatei ist im Klärungsbedarf erfasst.

Ist ein Eintrag in der i156 fehlerhaft, ist der Datensatz in oneSCM nicht verfügbar. Er muss manuell nachgetragen werden.

Quellen: Batch 742.5, 809.1, 875.2, 875.3, 924.4, 926.3, 977.6, 1252.3

## 13.7 Verlängerung und Beendigung

**Zweck.** Dieser Abschnitt beschreibt die Verlängerung von Verträgen mit Reifenprodukt und komplexen Produkten mit Reifenoption. Die Verlängerung erfolgt in einem Ablauf im Vertragsmanagement.

**Beendigung.** Material: keine Quellen in den RAG-Batches

**Voraussetzungen.** Das Produkt hat die Angabe Select Allowed Contract Modifications gesetzt. Nur mit dieser Angabe kann das Vertragsmanagement das Reifenprodukt verlängern. Die Felder Allowed Modifications und Long Term erscheinen nur bei Standalone-Produkten mit dem Service-Contract-Blueprint und dem Blueprint Tire Limited Passenger Car.

**Rollen.** Mitarbeitende im Vertragsmanagement mit der Rolle MO oder MPC verlängern Reifenverträge. Die Funktion steht im Leasing und über den Edge Service zur Verfügung.

**Schritt für Schritt.**

1. Starten Sie aus dem Vertragsmanagement den Verlängerungsablauf und konfigurieren Sie ihn.
2. Bei einer kurzfristigen Verlängerung, Short Term, bietet die Produktdomäne einen Monatspreis an. Es gelten dieselben Bedingungen wie im regulären Prozess.
3. Bei einer langfristigen Verlängerung, Long Term, stellt die Produktdomäne der Vertragsdomäne die Preise und die Spezifikation des komplexen Produkts zur Verfügung. Welche Preise angeboten werden, hängt von der Preisregel des Produkts ab. Ist das Produkt mit Pricing at sales date gekennzeichnet, ermitteln sich die Preise zum Verkaufsdatum auf Basis der Kalkulation des Servicevertrags mit Reifenoption. Ist das Produkt mit Pricing at Prolongation date gekennzeichnet, ermitteln sich die Preise zum Verlängerungsdatum.
4. Der Kunde wählt seine Präferenzen. Die Reifenoption behandelt das System als optionalen Deckungscode.
5. Prüfen Sie die Übersicht und Bestätigung. Sie zeigt die Produktkonfiguration mit den Optionen vor und nach der Verlängerung, die Preis- und Zahlungsinformationen sowie den Preis pro Kilometer.
6. Prüfen Sie den Abschnitt Bereifung. Er erscheint nur bei einem Reifenprodukt oder einem komplexen Produkt mit Reifenoption. Er zeigt Produkt, Wetterprofil, Stahlfelge, Radgröße, Reifengröße, Reifentyp und technische Reifenoptionen. Zusätzlich zeigt er die Anzahl der enthaltenen Reifen vor und nach der Verlängerung.

**Ergebnis und Systemstatus.** Der ursprüngliche Vertrag wird auf Grundlage der Benutzerauswahl und der Produktkonfiguration verlängert. Komplexe Produkte können verlängert werden. Die Produktdomäne liefert Preise und Konfiguration an die Vertragsdomäne.

Die Übersicht der Verlängerung enthält im Abschnitt Preis und Zahlung das Zahlungsintervall, die Nettorate, den Steueranteil und die Bruttorate pro Intervall. Sie zeigt die Anzahl der Zahlungen vor und nach der Verlängerung und das Datum, ab dem die Rate gilt. Ursprünglich ist das der Vertragsbeginn, nach der Verlängerung das Datum des Wirksamwerdens.

Die API-Antwort für Reifenverträge enthält bei der Verlängerung die Preismatrix. Der Inflationsfaktor sowie der Preis eines Vertrags mit optionalen Deckungen werden korrekt berechnet.

Die Reifenmatrix enthält die Anzahl der Reifen und keinen Preispunkt.

**Besonderheiten je Rolle, Sparte und Markt.** Für Langzeitverträge ist die Verlängerung um die Position Reifen erweitert, sowohl in der begrenzten als auch in der unbegrenzten Variante.

Die Preisermittlung für die Verlängerung folgt der Interpolationslogik des Leasingkanals, wie in Kapitel 13.4 beschrieben.

Quellen: Batch 358.2, 368.1, 904.1, 1148.1, 1150.1, 1150.2, 1150.5, 1249.4, 1272.3

## Verschiebung in andere Kapitel

- **Kapitel 14.8, Produktdefinition, Anlage und Veröffentlichung:** Die Anlage des Reifenprodukts mit Wetterprofil, Radgrößen, Felgen, Reifentypen, Kontingentgrenzen, Kennzeichen für die Verlängerung und Feldsichtbarkeit beschreiben die Batches 1124.1, 1141.2, 1143.1, 1150.2, 1157.2, 1169.1, 1171.2, 1201.3, 1256.3, 1257.4, 1119.2 und 1142.2. Die Prüfung der Sichtbarkeit im Vertragsvorschlag beschreibt Batch 1124.1.
- **Kapitel 14.9, Preisversionen, Cluster und Faktorgrenzen:** Die Preismatrix für Reifenprodukte ohne Begrenzung mit Radgröße, Felgentyp und Wetterprofil beschreiben die Batches 1171.4 und 1142.2. Die Wetterprofil-Empfehlung je Cost Unit in der Preisversion beschreibt Batch 1119.4.
- **Kapitel 14.10, Produktänderung, Versionierung und Bestandswirkung:** Das Verhalten veröffentlichter Produkte beim Bearbeiten, bei dem die Felder Tire Size, Tire Exchange Logic und Max Amount of Tires nicht änderbar sind, beschreibt Batch 1257.1.
- **Kapitel 14.4, Vorlagenverwaltung und Template Management:** Die Druckvariablen productSpecific, productSpecificOptions und disclaimer sowie die Abschnittsüberschriften der Vorlagen beschreibt Batch 368.1.
- **Kapitel 14.5, Administrationsbereich und zulässige Aktionen:** Die Suche der Coverage Codes ist auf 4 Zeichen und die Coverage Reference auf 10 Zeichen begrenzt. Die Eingabeprüfung für Texte beschreibt Batch 1252.3.
- **Kapitel 15.2, Blueprint-Pflege und globale Standards:** Die Blueprints vom Typ Tire Contract und Service Contract mit Sales Dependency, Tire Scope, Tire Supplier, Expiry Criteria, Preisfaktoren und Zahlungsintervallen beschreibt Batch 1173.1. Die Übergabe der Kontingentnummer in den Blueprints beschreibt Batch 1160.1.
- **Kapitel 15.7, Technical Options, SA-Matching, Coverage- und Industry-Codes:** Die Matching-Regel für die Preismatrix der Reifenkomponente beschreibt Batch 1119.5. Die technische Option Wheel Size beschreibt Batch 1160.6. Die Coverage Codes der Kategorie Tire Option mit dem Muster T und vier Zeichen beschreibt Batch 1174.2.
- **Kapitel 5.4, Produkte und Leistungsumfang auswählen:** Die Vergleichsfunktion für Produkte und Konfigurationen mit den unterstützten Kategorien beschreibt Batch 899.2.
- **Kapitel 16.4, Testnachweise und produktiver Funktionsstand:** Die Prüfszenarien für Serviceverträge mit Reifenoption, Reifenverträge und Preisprüfungen beschreibt Batch 1142.4. Die Prüfung über das Diagramm und einen generierten Vertrag beschreibt Batch 1168.1. Die Sicherheitsprüfungen mit Quality Gates und dem DAST-Scan beschreibt Batch 1310.1.
- **Kapitel 19.9, VEGA, Vertrag, Coverage und Claim:** Die Schnittstellen i155 und i156 mit den Feldern RC10, RC20 und SERVICE_PROVIDER beschreiben die Batches 742.5, 809.1 und 875.2. Das Verhalten im Vertrag steht in Kapitel 13.6.
- **Kapitel 19.21, Technische Integrationswege:** Die Übergabe der Kontingentnummer von Stream 1 an Stream 2 für Basisdeckungen beschreibt Batch 1160.1.

## Klärungsbedarf

**Widersprüche im Material**

1. **Reifenlieferant.** Batch 875.2 beschreibt, dass das Feld Tire Supplier in der Produktkonfiguration, in den Tire Details und in den Produktdaten entfällt. Die Batches 924.2, 924.4, 926.2, 1093.3, 1171.2 und 1173.1 beschreiben dagegen die Erfassung oder Anzeige des Reifenlieferanten. Die Hinweise in Batch 368.1 zum externen Reifenlieferanten hängen von dieser Angabe ab.
2. **Reifentyp bei Vans mit begrenztem Umfang.** Batch 1093.3 beschreibt, dass für Vans mit begrenztem Umfang kein Reifentyp angezeigt wird. Batch 924.2 beschreibt für das Produkt Tire Product Limited die Erfassung des Reifentyps, ohne die Sparte zu unterscheiden.
3. **Ablaufkriterium von Unlimited-Produkten.** Batch 1201.1 beschreibt das Ablaufkriterium Zeit als fest für die Produktlinie Tire. Batch 1173.1 beschreibt für Unlimited-Produkte mit eigenständigem Verkauf die Auswahl zwischen Zeit und Zeit oder Laufleistung.
4. **Administrationsgebühr bei Kombination.** Batch 1168.1 beschreibt, dass die Administrationsgebühr der Reifenoption zur Administrationsgebühr des Servicevertrags addiert wird. Im selben Batch heißt es, dass die Administrationsgebühr des Reifenvertrags in den Gesamtpreis nicht einfließt.
5. **Nummerierung der Schritte bei komplexen Produkten.** Batch 783.4 nennt die Reifenoption Schritt 3. Batch 937.5 beschreibt die Reifenoption im vierten Schritt. Batch 937.3 beschreibt für den eigenständigen Ablauf eine Konfiguration ohne Schritt für die Reifenoption.
6. **Bezeichnung der Wetterprofile.** Batch 926.1 nennt die Werte Sommer, Sommer/Winter und Ganzjahr. Batch 937.3 nennt Ganzjahresreifen, Sommer und Sommer/Winter. Die Batches 1157.2, 1171.4 und 1141.2 nennen Summer, Summer/Winter und All-Season. Batch 924.3 nennt All Seasons.
7. **Bezeichnung der Felge.** Batch 1141.2 nennt die Auswahl Rim Included und Rim Not Included. Batch 1171.4 nennt Steel rim included und No rim.
8. **Pflicht der Felgen- und Wetterprofilangaben.** Batch 1141.2 beschreibt Felgentyp und Wetterprofil bei der Produkteinrichtung als optionale Angaben. Batch 1171.4 beschreibt für jede Radgröße zwei verpflichtende Angaben, nämlich Felgentyp und Wetterprofil.
9. **Pflicht der Preismatrix.** Batch 1119.4 beschreibt, dass mindestens eine Wetterprofil-Matrix vollständig ausgefüllt sein muss. Batch 1171.4 beschreibt, dass für jede Kombination aus Radgröße, Felgentyp und Wetterprofil eine vollständige Preismatrix erforderlich ist. Batch 1150.5 beschreibt eine Reifenmatrix ohne Preispunkt. Die Zuordnung der Matrizen zu den Produkten ist offen.
10. **Matching-Logik.** Batch 1119.5 beschreibt drei Optionen und die Pflicht zu genau einer Auswahl, ohne die Option None Must Match. Batch 1250.4 beschreibt für den Baumuster-Ablauf die Matching-Regel None Must Match. Batch 1153.5 beschreibt die Überschreibung der Matching-Regel auf None Must Match mit dem Hinweis, dass das Verhalten zu überprüfen ist. Batch 1119.5 nennt außerdem Auswirkungen auf die Kommunikation mit einem externen Partner, die das Material nicht beschreibt.
11. **Technische Optionen bei Servicevertrag mit Reifenprodukt.** Batch 977.1 beschreibt, dass technische Optionen einem Servicevertrag mit Reifenprodukt nicht hinzugefügt werden. Die Batches 1171.4 und 1160.6 beschreiben die Radgröße als technische Option mit Preismatrix.
12. **Bezeichnung der Kategorie für Reifenoptionen.** Batch 1174.2 nennt die Kategorie Tire Option. Batch 1169.1 nennt die Kategorie Tire Product Reference. Batch 1252.3 beschreibt die Umbenennung von Tire Option in Tire Product Reference.
13. **Bezeichnung des Abschnitts mit den Reifenangaben.** Batch 924.3 nennt den Abschnitt Tire Product Specifications. Batch 368.1 nennt die Tabelle Tire Product Specific. Batch 926.2 nennt den Bereich Reifendetails.
14. **Bezeichnung der Reiter.** Batch 809.1 nennt den Reiter Vertrag, Batch 924.4 den Reiter Contract und Batch 977.6 den Reiter Proposal.
15. **Technical Specification.** Batch 1100.3 beschreibt, dass Reifengröße und Reifentyp bei Fahrgestell- oder Bestellnummer im Abschnitt Technical Specification erscheinen. Batch 368.1 beschreibt, dass der Abschnitt Technical Specifications aus den Vorlagen entfernt ist. Batch 924.3 beschreibt, dass das Feld Technical Specification unter dem Produktnamen entfällt.
16. **Ausgangslage des Produktumfangs.** Batch 1119.1 beschreibt, dass als Ausgangslage nur ein unbegrenztes Reifenprodukt konfigurierbar war. Batch 1171.1 beschreibt eine eingeschränkte Version mit Mindest- und Höchstanzahl. Der Abschnitt nennt daher keine Ausgangslage.
17. **Hinweis zum Wetterprofil bei Reifenersatz.** Batch 926.1 beschreibt den Satz zum Wetterprofil für die Aktivierung. Batch 809.1 beschreibt für RC10 an Position 71 eine Formatierung, die noch nicht abgestimmt ist. Die Reihenfolge und die Abstände sind offen.

**Unklare Aussagen**

18. **Empfänger der Logdatei.** Batch 809.1 beschreibt eine Logdatei bei nicht importierten Claims. Der Empfänger ist nicht festgelegt.
19. **Stream 4.** Batch 1173.1 beschreibt die Anbindung des Reifenlieferanten per API über Stream 4 als Vorhaben. Die Umsetzung ist nicht belegt.
20. **Kostenstruktur der Basisabdeckung bei Unlimited.** Batch 1142.2 beschreibt eine Anpassung ohne Angaben zu Umfang und Zeitbezug. Der Stand ist nicht belegt.
21. **Infotext zum Wetterprofil.** Batch 1171.4 beschreibt einen Infotext mit dem Platzhalter SAMPLE TEXT for now.
22. **Abgrenzung der Reifenprodukte.** Batch 899.7 beschreibt die Abgrenzung zwischen begrenzten und unbegrenzten Reifenprodukten sowie komplexen Produkten nicht. Der Batch verweist auf eine spätere Festlegung ohne nähere Angaben.
23. **Reifenprodukte ohne Begrenzung.** Batch 929.4 verweist die Konfiguration der Reifenprodukte ohne Begrenzung auf PI13.
24. **Long Term Prolongation.** Batch 911.1 beschreibt die Berücksichtigung von Reifenprodukten in der Langzeitverlängerung. Das Material nennt die Abnahmetestphase als Status. Ein Produktivstand ist nicht belegt.
25. **Details der Langzeitverlängerung.** Batch 904.1 beschreibt die Erweiterung um Reifen ohne weitere Angaben zu Umfang oder Verhalten.
26. **Optionale Deckungen bei deaktivierten Produkten.** Batch 1272.3 beschreibt, dass optionale Deckungen für deaktivierte Produkte standardmäßig hinzugefügt werden. Die Bedeutung ist nicht belegt.
27. **Reihenfolge und Altverträge.** Batch 875.3 beschreibt die Reihenfolge der Reifendeckungen als mit UX abzustimmen. Die Datenverfügbarkeit bei Altverträgen ist zu prüfen.
28. **Freigabe der Van-Unlimited-Funktion.** Batch 937.2 beschreibt die Funktion für die Rollen Dealer Van, MO Van und MPC Van als vorgesehen. Der Freigabestand ist nicht belegt.
29. **Umgebung für den DAST-Scan.** Batch 1310.1 beschreibt den DAST-Scan nach der Bereitstellung auf INT oder PREPROD, die Umgebung ist noch abzustimmen. Rote Funde sollen vor dem Produktivgang geprüft werden.

**Eingestellte oder geschlossene Meldungen**

30. Batch 877.1 beschreibt eine Anpassung der Reifenprodukte in den Varianten Limited, Unlimited und Complex Option. Das Vorhaben ist eingestellt, es enthält keine inhaltlichen Angaben und ist nicht Bestandteil des Handbuchs.
31. Batch 892.1 beschreibt eine Verlängerung Long Term Extension für Tires Unlimited. Die Meldung ist geschlossen, der Text enthält nur Vorlagenabschnitte ohne Inhalt. Die Meldung ist nicht Bestandteil des Handbuchs.
32. Batch 865.3 beschreibt, dass bei der Vertragserstellung für Reifen alle Auswahllisten vorbelegt werden, wenn nur ein Wert wählbar ist. Der Eintrag trägt den Status Offen und enthält keine inhaltlichen Angaben.
33. Batch 911.1 ist unter Punkt 24 erfasst.

## Vorschläge zur Gliederung

- **Neues Unterkapitel für die Reifenoption.** Die Reifenoption in komplexen Produkten wird in den Kapiteln 13.2 bis 13.5 behandelt, die Batches 783.4, 875.1, 937.5, 1169.1 und 1148.1 betreffen sie. Ein eigenes Unterkapitel würde die Auswahl, den Preis und die Verlängerung zusammenführen.
- **Aufteilung von 13.2.** Der Abschnitt 13.2 enthält Produkt, Reifentyp, Reifengröße, Felge und Wetterprofil. Eine Trennung in Produkt und Reifentyp sowie Reifengröße, Felge und Wetterprofil würde die Lesbarkeit verbessern.
- **Beendigung.** Das Unterkapitel 13.7 enthält keine Quellen zur Beendigung. Der Inhalt könnte in Kapitel 10.6 Kündigung, Stornierung und Beendigung geführt werden, mit einem Verweis aus 13.7.
- **Vertragsdetailansicht.** Die Angaben in den Kapiteln 13.5 und 13.6 zur Vertragsdetailansicht könnten in Kapitel 10.1 Verträge suchen und Details prüfen zusammengeführt werden. Kapitel 13.6 würde dann die reifenspezifischen Angaben beschreiben.
- **Preistabellen und Interpolation.** Die Interpolation und die Rundung der Reifenanzahl aus Kapitel 13.4 könnten in Kapitel 14.9 Preisversionen, Cluster und Faktorgrenzen mit einem Verweis aus 13.4 geführt werden.
- **Schnittstellen.** Die Angaben zu i155 und i156 könnten in Kapitel 19.9 mit einem Verweis aus 13.6 stehen, damit die Schnittstellenbeschreibung an einer Stelle gepflegt wird.
- **Zuordnung des Materials.** Das Material war den Unterkapiteln als Dateien zugeordnet. Die Batches aus 13.2 sind redaktionell auf 13.1 bis 13.7 verteilt. Die allgemeinen Batches 742.5 und 892.1 sind im Abschnitt 13.6 beziehungsweise im Klärungsbedarf erfasst.

