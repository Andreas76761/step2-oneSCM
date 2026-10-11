# 15 HQ-Rolle, Blueprint und zentrale Stammdaten

Dieses Kapitel beschreibt die Aufgaben der HQ-Rolle in oneSCM. HQPM-Anwender legen globale Blueprints an und pflegen zentrale Stammdaten wie Coverage Codes, Industry Codes, Technische Optionen und Schadencodes. HQ-Administratoren ergänzen diese Stammdaten um ISP-Codes und K/JX-Codes. Die Märkte übernehmen die HQ-Vorgaben, ergänzen ihre Übersetzungen und bauen darauf Produkte und Preise auf. Die Pflege von Produkten und Preisen durch den Markt beschreibt Kapitel 14, die Vertragserstellung Kapitel 5 und 6.

## 15.1 Aufgaben und Abgrenzung der HQ-Rolle

Material: keine Quellen in den RAG-Batches

Quellen: keine

## 15.2 Blueprint-Pflege und globale Standards

**Zweck.** Ein Blueprint ist die Vorlage, aus der ein Markt Produkte erstellt. Er standardisiert VEGA-Kennungen, enthaltene Leistungen, Verkaufslogik, Ablaufkriterien und Grenzwerte und lässt den Märkten Spielraum für marktspezifische Optionen. Alle Blueprints sind global. Ein angelegter Blueprint steht in allen Märkten im Produkterstellungsprozess zur Auswahl. Der Infobereich „How blueprints work“ im Produktassistenten erklärt, dass die Zentrale Blueprints definiert, um Märkte bei der Produkterstellung zu unterstützen und Konsistenz über Prozesse und Systeme hinweg zu sichern. Alle Blueprint-Leistungen und Produktcodes funktionieren ohne zusätzliche VEGA-Konfiguration.

**Voraussetzungen.** Sie sind als HQPM angemeldet. Die Coverage Codes, die Sie einem Blueprint zuordnen, sind angelegt und der passenden Kategorie zugeordnet. Die Anlage beschreibt Kapitel 15.7. Für Blueprints mit Reifenbezug sind die benötigten Technischen Optionen angelegt; ihre Anlage beschreibt ebenfalls Kapitel 15.7.

**Rollen.** Der HQPM-Anwender legt Blueprints an, bearbeitet sie und löscht sie. HQ-Administratoren legen Blueprints für Vans an. Die Grenzwerte auf Blueprint-Ebene richten sich an HQ sowie an MPC- und MOC-Nutzer. MPC-Anwender erstellen Produkte auf Basis eines Blueprints; die Produkterstellung beschreibt Kapitel 14.8.

**Schritt für Schritt.**

*Übersicht öffnen und Blueprint anlegen.*

1. Öffnen Sie das Menü „Product Management“ und das Untermenü „Manage Product Blueprints“. Die Übersicht zeigt alle Blueprints in einer Liste. Jede Spalte lässt sich sortieren. Standardmäßig steht der zuletzt geänderte Blueprint oben.
2. Wählen Sie „Create Blueprint“. Das Pop-up führt in drei Schritten durch die Anlage. In jedem Schritt können Sie abbrechen; dabei erscheint der Abbruchdialog.

*Schritt 1, Blueprint-Einrichtung.*

3. Wählen Sie die Division in einem Dropdown mit Einfachauswahl.
4. Geben Sie den Blueprint-Namen ein. Das Feld ist Pflicht. Sonderzeichen sind erlaubt. Das System prüft beim Verlassen des Feldes, ob der Name bereits vergeben ist. Die zulässige Länge beträgt 3 bis 30 Zeichen.
5. Geben Sie die Blueprint-Beschreibung ein. Das Feld ist Pflicht und umfasst 20 bis 2000 Zeichen. Sonderzeichen sind erlaubt.
6. Wählen Sie die Produktlinie in einem Dropdown mit Einfachauswahl. Die Angabe ist Pflicht.
7. Geben Sie den VEGA-Vertragstyp ein. Erlaubt sind Großbuchstaben, Ziffern und Unterstriche, zum Beispiel der Testwert P_ABC_XYZ. Das System wandelt Eingaben in Großbuchstaben um.
8. Wählen Sie das Ablaufkriterium. Die Option „Kontingent“ ist nur als Einzelauswahl möglich und schließt alle anderen Einträge aus. „Zeit“ und „Zeit oder Laufleistung“ sind als Mehrfachauswahl verfügbar. Im ersten Schritt legen Sie die Vertriebsabhängigkeit ebenfalls fest. Der MPC-Anwender wählt im Produkt eines der im Blueprint aktivierten Kriterien aus.
9. Wählen Sie die Verkaufslogik mit dem Zusatz „Contract start date“ aus. Die Werte sind in der Beschreibung unter „Besonderheiten je Rolle, Sparte und Markt“ erläutert.
10. Laden Sie das Produktbild von Ihrem Computer hoch. Das Bild ist Pflicht. Die Bildprüfung und das Bedienelement entsprechen dem Produkterstellungsprozess auf Marktebene.
11. Wechseln Sie erst zum nächsten Schritt, wenn alle Pflichtfelder ausgefüllt sind.

*Schritt 2, Coverage Codes.*

12. Wählen Sie in den drei Mehrfachauswahl-Comboboxen „Base Coverages“, „Optional Coverages“ und „Body Coverages“ die Coverage Codes aus. Die Einträge stammen aus den Coverage Codes, die der jeweiligen Kategorie zugeordnet sind. Die Combobox zeigt die Anzahl der Auswahl, zum Beispiel „X coverages selected“. Rechts erscheinen die gewählten Coverage Codes als Tags. Ein Tag entfernen Sie über das X; der Eintrag wird damit auch in der Auswahlliste abgewählt.
13. Wählen Sie mindestens eine Base Coverage. Ohne sie können Sie nicht fortfahren.
14. Bei dem Ablaufkriterium „Kontingent“ ist die Auswahl der Basisdeckung eine Einfachauswahl. Optional Coverages und Body Coverages lassen sich in diesem Fall nicht hinzufügen; beide Dropdown-Listen sind deaktiviert.

*Schritt 3, Übersicht.*

15. Prüfen Sie die Übersicht mit der Bezeichnung „Overview & Confirmation“. Sie zeigt alle Angaben aus den Schritten 1 und 2. Beim Ablaufkriterium sehen Sie Ihre Auswahl als Einzel- oder Mehrfachauswahl, je nach Konfiguration. Von hier aus erstellen Sie den Blueprint.
16. Aus den Schritten 2 und 3 kehren Sie jederzeit zu den vorherigen Schritten zurück und ändern bereits ausgefüllte Angaben.

*Blueprint bearbeiten.*

17. Wählen Sie „Bearbeiten“. Der Blueprint öffnet sich im ersten Schritt.
18. Ändern Sie Name, Beschreibung oder das Standardbild. Eine Änderung von Name und Beschreibung wirkt sich auf den ersten Schritt der Produkterstellung aus, wenn dieser angezeigt oder bearbeitet wird. Ein geändertes Standardbild ersetzt das Bild in allen Produkten, die das Bild des Blueprints verwenden.
19. Ändern Sie im zweiten Schritt die optionalen und die Body Coverages. Bei einer Ergänzung oder Entfernung erscheint der Dialog „Removing or Adding Coverages“. Mit „Update“ speichern Sie den Blueprint, mit „Cancel“ schließen Sie den Dialog, ohne zu speichern.
20. Der Dialog weist darauf hin, dass sich das Hinzufügen oder Entfernen von Coverages nur auf Produkte auswirkt, die nach der Aktualisierung des Blueprints erstellt werden. Bereits angelegte Produkte bleiben unverändert. Eine Anpassung bestehender Produkte beschreibt der folgende Ablauf.

*Coverages in einem Blueprint für bestehende Produkte übernehmen.*

21. Legen Sie den neuen Deckungscode in den VEGA Codes an, wie in Kapitel 15.7 beschrieben. Öffnen Sie danach den Blueprint und fügen Sie den Deckungscode hinzu.
22. Ist der Blueprint bereits in einem Produkt verwendet, erscheint am Ende des Blueprint-Ergebnisses eine Hinweismeldung. Sie bestätigt die Änderung und weist auf die Auswirkungen auf die zugehörigen Produkte hin.
23. Deaktivieren Sie das Produkt, das diesen Blueprint nutzt.
24. Öffnen Sie das deaktivierte Produkt zur Bearbeitung. Einmalig erscheint ein Banner, dass der Blueprint aktualisiert wurde. Das Banner erscheint nur beim ersten Bearbeiten, bis der Wizard abgeschlossen ist.
25. Wählen Sie im Schritt 4 „Coverages“ die Schaltfläche „Edit Coverages“. Das Fenster zeigt die geänderten Deckungen aus dem Blueprint. Hinzugefügte und entfernte Deckungen sind klar voneinander unterschieden. Als „NOT INCLUDED“ markierte Deckungen erscheinen bei jeder weiteren Bearbeitung des Produkts nicht im Fenster. Hinzugefügte Deckungscodes bleiben immer zur Auswahl sichtbar.

*Blueprint löschen.*

26. Wählen Sie „Löschen“ und bestätigen Sie den Vorgang. Der Blueprint wird dauerhaft entfernt und steht danach bei der Erstellung neuer Produkte nicht mehr zur Verfügung. Bestehende Marktprodukte und Verträge sind davon nicht betroffen.

**Ergebnis und Systemstatus.** Ein gespeicherter Blueprint steht in allen Märkten für die Produkterstellung bereit. Die Tabelle „Manage Product Blueprints“ ist nach Geschäftsbereich sortiert, daher gibt es dort keinen zusätzlichen Filter. Wird der Name eines Blueprints im Blueprint-Bereich geändert, aktualisiert sich der Name in der Produktübersicht. Ein Blueprint, zu dem ein veröffentlichtes Produkt existiert, lässt sich bearbeiten. Wird im ersten Schritt die Division gewechselt, setzt das System die Deckungen zurück; die Zusammenfassung ist erst erreichbar, wenn Deckungen ausgewählt sind. Die Verkaufslogik bleibt beim Wechsel zwischen Schritt 1 und Schritt 2 erhalten. Ein Produkt erbt aus dem Blueprint die Felder Sales Dependency, Verkaufslogik, Rabatte, Branchen, Ablaufkriterien und Lieferant. Die Auswahl im Produkt beschreibt Kapitel 14.8.

**Besonderheiten je Rolle, Sparte und Markt.**

- HQPM-Anwender legen Blueprints an, bearbeiten sie und löschen sie. HQ-Administratoren legen Blueprints für Vans an.
- Für Vans stehen die Produktlinien Complete, Comfort, SelectPlus, Maintenance, Extended Warranty und Tires zur Verfügung. Ihnen sind die I155-Codes 16, 22, 20, 19, 18 und 06 zugeordnet, die im Payload an die Generierung übergeben werden. Van-Bilder liegen in einem eigenen Speicher und erscheinen nur, wenn die Division Vans gewählt ist.
- Der Blueprint „Full Service“ bietet das Ablaufkriterium „Zeit und Laufleistung“ an.
- Bei Blueprints mit dem Ablaufkriterium „Kontingent“ sind Basisdeckungen Einfachauswahl; Optional und Body Coverages sind ausgeschlossen. Der Blueprint „Compact“ ist ein kontingentbasierter Blueprint der Division Passenger Car, dessen Produktanlage Kapitel 14.8 beschreibt.
- Der VEGA-Vertragstyp bleibt editierbar, auch wenn ein veröffentlichtes Produkt den Blueprint verwendet. Bei Contingent-Produkten und Reifen sendet das System die Contingent-Nummer im Payload nur für Basisdeckungen, nicht für Optional- oder Body Coverages.

**Verkaufslogik für den Vertragsstart.** Die Verkaufslogik steuert das Startdatum eines Vertrags. Sie dient als Grundlage für zertifizierte Gebrauchtwagen, also CPO-Fahrzeuge, und für Garantieverlängerungen, die erst nach Ablauf der Herstellergarantie beginnen. Die Dauer der Herstellergarantie hinterlegt jeder Markt in den Markteinstellungen, die Kapitel 14.2 beschreibt. Sie wird mit der Marktdauer addiert, zum Beispiel ergeben 24 Monate Herstellerdauer und 12 Monate Marktdauer insgesamt 36 Monate. Der Blueprint zeigt das Feld als „Sales Logic“ mit dem Zusatz „Contract start date“. Es gilt für alle Divisionen und Blueprint-Typen. Die Werte lauten:

- „FRD“ entspricht der Logik FRD Related ohne den Zusatz „Related“.
- „Sales date“ bezieht sich auf das Datum der Angebotserstellung und entspricht der Logik FRD Not Related.
- „Future date“ steht für ein Datum in der Zukunft, etwa das Ende der Garantiedauer oder das vorgesehene Vertragsende des ursprünglichen Produkts. Das Kontrollkästchen „Future date“ ist standardmäßig nicht ausgewählt.

Auf Blueprint-Ebene lassen sich mehrere Werte gleichzeitig auswählen. Ein Produkt übernimmt nur die aktivierten Werte. Im Produkt wählt der MPC-Anwender genau einen davon aus. Die Verknüpfung der Produktlimits mit der Verkaufslogik bezieht sich auf die Werte FRD, Sales date und Future date.

**Maximale Grenzwerte auf Blueprint-Ebene.** Märkte sollen Servicevertragsprodukte nur auf Fahrzeuge anwenden, die die Berechtigungskriterien erfüllen. Die Grenzwerte auf Blueprint-Ebene, sogenannte Max Limits, bilden den Rahmen, in dem die MPCs agieren. Je nach Produkt und Ablaufkriterium stehen im Blueprint-Setup folgende Felder bereit:

- Bei Reifenprodukten „Maximum Allowed Tire Replacements“. Sie geben einen absoluten Wert ein oder wählen die Option „Unlimited“.
- Bei dem Ablaufkriterium „Kontingent“ „Maximum Allowed Services“, ebenfalls mit der Option „Unlimited“.
- Das Feld für das maximale Fahrzeugalter bei Vertragsende mit einem Mindestwert von 24 Monaten.
- Bei den Ablaufkriterien „Time“ oder „Time or Mileage“ zusätzlich das Feld für die maximale Fahrleistung bei Vertragsende. Beim Ablaufkriterium „Time“ gibt es das Kontrollkästchen, mit dem der Vertrag endet, sobald die maximale Fahrleistung erreicht ist. Die maximale Fahrleistung entspricht dem Wert aus dem Schritt „Precondition“ im Modul Product Configuration.

Alle Felder akzeptieren nur absolute Zahlenwerte. Die Grenzwerte wirken auf die Preismatrix im Modul „Products & Prices“. Bei Reifenprodukten darf das Feld „Max Amount of Tires“ den Blueprint-Wert nicht überschreiten. Bei Produkten ohne Reifenbezug bilden das maximale Fahrzeugalter und die maximale Fahrleistung die Obergrenzen für Max-Months unter „Define Duration Options“ und für Max-Kilometers unter „Define Annual Mileage Options“. Nutzer können in der Preismatrix keine X-Y-Dimensionen konfigurieren, die über diese Grenzen hinausgehen. Der Abschnitt „Calculated Maximum Mileage/Age at Contract End“ ist in der Preismatrix nicht vorhanden.

Der Schritt heißt „Vehicle Preconditions & Limits“. Dort setzen MPC- und MOC-Nutzer Limits für drei Nutzergruppen: MPC- und MOC-Nutzer, Händler und Direktvertriebskanäle. Die Limits gelten für Produkte aller Ablaufkriterien, für Reifen- und Nicht-Reifenprodukte. Beispielhaft lässt die Van-Sparte in Deutschland bis zu 300.000 km zu. Die Felder „Maximum Vehicle Age at Contract End“ und „Maximum Vehicle Mileage at Contract End“ verhindern, dass ein Produkt mit einer Laufzeit verkauft wird, die das definierte Alter oder die definierte Laufleistung überschreitet.

**Produkte ohne FRD-Bezug.** Der Preis eines Produkts ohne FRD-Bezug stammt aus der Preismatrix und wird durch die gewählte Laufzeit geteilt. Das Vertragsstartdatum entspricht dem Datum, an dem das Produkt gekauft oder aktiviert wird. Das Vertragsenddatum ergibt sich aus dem Aktivierungsdatum zuzüglich der gewählten Laufzeit. Voraussetzung ist, dass das Produkt verfügbar ist. Im Fahrzeugbereich stehen die Platzhalter „Vehicle Age at Contract End“ und „Vehicle Mileage at Contract End“ zur Verfügung.

**Hinweise.**

- Die Ablaufkriterien einer Vertragslogik legt der Blueprint fest; die endgültige Auswahl trifft der Produktanwender. Ein Blueprint mit mehreren Kriterien erlaubt dem MPC-Anwender zu bestimmen, wann das Vertragsende eintritt.
- Änderungen an Coverages wirken auf Prolongationen unterschiedlich, je nachdem, ob das Produkt mit dem Preis zum Vertragsverkaufsdatum oder zum Prolongationszeitpunkt geführt wird. Bei Produkten mit Preis zum Vertragsverkaufsdatum ignoriert der bestehende Vertrag später hinzugefügte oder entfernte Deckungen; der Kunde zahlt weiterhin den ursprünglichen Preis. Eine entfernte Deckung bleibt bei der Prolongation buchbar, auch wenn die neue Produktversion sie nicht mehr anbietet. Eine hinzugefügte optionale Deckung kann nicht nachträglich in den Vertrag aufgenommen werden, weil sie zum Verkaufszeitpunkt keinen Preis hatte.
- Bei Produkten mit Preis zum Prolongationszeitpunkt gilt: Eine hinzugefügte immer eingeschlossene Deckung erhöht den Prolongationspreis, ohne die Deckungen des Vertrags zu erweitern. Eine entfernte immer eingeschlossene Deckung senkt ihn entsprechend. Eine optionale Deckung, die im Vertrag enthalten ist und entfernt wurde, hat zum Prolongationszeitpunkt keinen Preis; dann greift eine Fallback-Logik, die den zuletzt verfügbaren Preis dieser Option verwendet. Die Preise übermittelt das System unter diesen Bedingungen an den Partner Brabus.
- Das Vertragsmanagement berücksichtigt diese Änderungen nicht. Der Umgang mit der VEGA-Datei bei hinzugefügten oder entfernten Deckungen ist im Klärungsbedarf erfasst.
- Ein doppelter Blueprint-Name führt beim Bearbeiten zu einer Fehlermeldung.
- Blueprint-Bilder werden im Blueprint-Bereich angezeigt.

**Fehlerbehebung.**

- Die Meldung zur Länge des Blueprint-Namens nennt die zulässige Länge des Feldes. Korrigieren Sie die Eingabe und versuchen Sie es erneut.
- Bei der Beschreibung erscheint die Meldung „Min. 20 and max. 2000 characters allowed. Please correct your input and try again“. Passen Sie die Länge an.
- Bei einem ungültigen VEGA-Vertragstyp erscheint die Meldung „Must have 6 characters and can only contain letters, numbers, underscore or dashes“. Verwenden Sie nur Großbuchstaben, Ziffern und Unterstriche.
- Ist der Blueprint-Name bereits vergeben, meldet das System dies beim Verlassen des Feldes.

Quellen: Batch 1192.2, 1219.3, 1181.1, 1219.1, 1118.1, 1192.1, 1195.2, 1084.2, 1183.2, 1219.4, 1224.3, 1219.5, 1253.7, 1258.3, 1264.3, 1268.2, 1274.3, 1219.2, 1149.1, 1277.3, 1259.2, 1278.3, 1273.2, 1163.2, 1162.1, 1171.3, 1279.2, 603.1

## 15.3 Umgang mit Länderabweichungen

Material: keine Quellen in den RAG-Batches

Quellen: keine

## 15.4 Governance und Freigaben auf HQ-Ebene

Material: keine Quellen in den RAG-Batches

Quellen: keine

## 15.5 Zusammenarbeit mit Markt und MO

**Zweck.** Die HQ-Rolle definiert Coverage Codes, Industry Codes, ISP-Codes und K/JX-Codes zentral und stellt sie den Märkten als Vorgabe zur Verfügung. Die Märkte ergänzen in den Market Settings ihre eigenen, sprachspezifischen Bezeichnungen. Die Übermittlung verläuft nur in eine Richtung, vom HQ-Bereich in die Market Settings. Die HQ-Felder sind für Marktnutzer schreibgeschützt. Der Markt kann die ursprünglichen HQ-Vorgaben weder ändern noch überschreiben.

**Voraussetzungen.** Der Code ist im HQ-Bereich angelegt und bestätigt, bevor der Markt ihn in den Market Settings übersetzt. Die Marktspezifität legt fest, in welchen Märkten der Code verwendet werden kann. Die Anlage der Codes beschreibt Kapitel 15.7.

**Rollen.** HQ-Administratoren legen Codes an und pflegen sie. Market-Operation-Nutzer und MPC-Benutzer pflegen in den Market Settings die Sprachfelder ihres Marktes und sehen die HQ-Felder schreibgeschützt. Ein lokaler Marktnutzer kann Daten oder Übersetzungen eines anderen Marktsegments oder einer anderen Division weder einsehen noch ändern, wenn ihm die Berechtigung fehlt. Händler, MO-Mitarbeitende und MPC-Nutzer unterliegen der HQ-Sperre für Fahrzeuge.

**Schritt für Schritt.**

*Code im HQ-Bereich anlegen.*

1. Legen Sie den Coverage Code oder Industry Code im Schritt 1 an und konfigurieren Sie ihn je Division.
2. Wählen Sie im Schritt 2 „Marktspezifität“ die Märkte. Zur Auswahl stehen „Current and Upcoming Markets“ und „Custom Markets“. Bei Custom Markets setzen Sie die Märkte per Checkbox. In diesem Schritt gibt es keine Sprachfelder.
3. Prüfen Sie im Schritt 3 die Übersicht und bestätigen Sie den Code.

*ISP-Codes anlegen.*

4. Öffnen Sie im Bereich Vehicle Management den dreistufigen Wizard für ISP-Codes. Das Vorgehen entspricht dem der Vega Codes.
5. Legen Sie den Code an. Upload und Download sind dabei deaktiviert. Definieren Sie danach die Märkte und füllen Sie das HQ-Feld mit der HQ-Empfehlung aus.
6. Prüfen Sie die Übersicht. Fehlende Pflichtangaben wie Code, Marktdefinition oder HQ-Felder verhindern den Abschluss des Wizards.

*K/JX-Codes pflegen.*

7. Öffnen Sie im Bereich Fahrzeugverwaltung den HQ-Reiter für K/JX-Codes. Die Tabelle enthält die Spalten Code mit höchstens 10 Zeichen, Laufleistung in Kilometern, Laufleistung in Meilen, Laufzeit in ganzen Monaten, Geschäftsbereich PC oder Van und eine Beschreibung mit höchstens 800 Zeichen ohne Sonderzeichen.
8. Legen Sie Einträge über „Erstellen“ an. Für mehrere Einträge laden Sie eine Excel-Vorlage hoch. Beim Bearbeiten überschreiben die neuen Werte die bestehenden. Vor dem Löschen fragt das System nach einer Bestätigung.

*Änderungen im HQ-Bereich übernehmen.*

9. Ändern Sie einen Code im HQ-Bereich. Das System übernimmt die Änderung in die HQ-Felder der Market Settings. Marktfelder aktualisiert es, sofern der Markt sie nicht überschrieben hat.
10. Deaktivieren Sie einen Coverage Code. Er verschwindet danach aus der Liste der aktiven Coverage Codes in den Market Settings.

**Ergebnis und Systemstatus.** Die Märkte arbeiten mit denselben HQ-Vorgaben. Eine Änderung im HQ-Bereich erscheint in den Market Settings. Das System übernimmt neue Sprachen aus den Market Settings mit den aktuellen Inhalten und füllt die Felder vor. Die HQ-Empfehlungen sind in den marktspezifischen Attributen vorbelegt, sodass die Daten abgestimmt bleiben.

K/JX-Codes werden in der Vertragserstellung verwendet. Bei einem Fahrgestellidentifikator erkennt das System, ob es sich um einen Van oder einen PC handelt, und ermittelt die K/JX-Codes über einen VeDoc-Aufruf oder aus vorhandenen Daten des CePro-Imports. Berücksichtigt werden nur Codes aus der Tabelle in oneSCM. Laufleistung und Laufzeit des Eintrags gehen in der Einheit der Markteinstellung an die Generierung, also in Kilometern oder Meilen. Gibt es keinen Eintrag, bleiben die Werte leer. Bei einer Auftragsnummer ruft das System die K/JX-Codes für einen PC über die GoOrder-API und für einen Van über die AFAB-API ab. Auch hier bleiben die Werte leer, wenn kein Eintrag existiert.

**Besonderheiten je Rolle, Sparte und Markt.**

- HQ-Administratoren pflegen die ISP-Codes im Bereich Vehicle Management und die K/JX-Codes im Bereich Fahrzeugverwaltung.
- Die Übersetzungen der Marktseite sind je Sparte getrennt nach Passenger Cars und Vans. Wo ein Markt keine eigene Übersetzung erfasst hat, verwendet das System den HQ-Vorschlag. Der HQ-Vorschlag ist je Code einheitlich, wird von der Zentrale gepflegt und kann von den Märkten nicht verändert werden.
- Die Felder mit Übersetzungen unterscheiden sich je Code-Typ. Bei Coverage Codes übersetzen Sie Coverage Name, Description und Family Tag. Bei Damage Codes übersetzen Sie Code Name und Type Description. Bei Industry Codes gibt es das Feld Industry. Bei Technischen Optionen übersetzen Sie Group Name und Group Description. Bei ISP-Codes gibt es das Feld Description.
- Die Marktliste enthält ausschließlich Deutschland. Weitere Märkte erscheinen, sobald oneSCM sie unterstützt.
- Ist die Markteinstellung Deutsch, erscheint „Deutschland“ statt „Germany“ in der Marktspalte der Tabellen, in der Detail- und Zusammenfassungsansicht sowie in Schritt 2 der Anlage. Dafür liefert das Backend die Marktcodes der ausgewählten Märkte.

**Hinweise.**

- Die HQ-Sperre verhindert, dass Händler, MO-Mitarbeitende und MPC-Nutzer für gesperrte Fahrzeuge Serviceverträge anlegen oder aktivieren. Die Vertragskalkulation prüft nach der Auswahl des Kundentyps und der Eingabe einer Fahrgestellnummer, ob das Fahrzeug von der Zentrale gesperrt ist. Ist es gesperrt, liefert das System keine Produkte und Preise. Ist es nicht gesperrt, stellt es alle passenden Produkte und Preise bereit.
- Bei einem Baumuster oder einer Auftragsnummer ohne verfügbare Fahrgestellnummer liefert das System Produkte und Preise, und der Vertrag kann den Status „Confirmed“ erreichen. Liefert das Fahrzeugmanagement bei einem erstellten Vertrag später die Fahrgestellnummer nach, prüft das System die Sperre erneut. Bei einer Sperre setzt es den Vertrag auf „Rejected“ und die Marktorganisation erhält gemäß der Vorlage eine Benachrichtigung. Andernfalls setzt das System die Aktivierung fort.
- Eine entfernte Sprache verschwindet aus der aktiven Anzeige der Benutzeroberfläche. Die Datensätze bleiben erhalten. Bei einer Wiederherstellung ist das Feld mit der zuvor gespeicherten Übersetzung wieder sichtbar.
- Ein lokaler Marktnutzer kann die ursprünglichen HQ-Vorgaben zur Feldkonfiguration in den Market Settings weder ändern noch überschreiben.
- Die Beschreibung des ISP-Wizards stammt aus einem Entwicklungsstand, der die Abläufe nur mit dem Verweis „gemäß UI“ beschreibt. Der Stand ist im Klärungsbedarf erfasst.

**Fehlerbehebung.**

- Nach dem Speichern der Market Settings erscheint die Meldung „Settings saved successfully“. Der eingegebene Text bleibt erhalten.
- Ist die Vertragsanlage für ein gesperrtes Fahrzeug nicht möglich, erscheint die Meldung „locked vehicle - no products available“.
- Ist ein Pflichtfeld im ISP-Wizard leer, lässt sich der Wizard nicht abschließen. Ergänzen Sie die Angabe und fahren Sie fort.

Quellen: Batch 1130.1, 884.1, 884.3, 5.1, 4.1, 1116.1, 1129.1, 994.2, 1197.1, 1208.1

## 15.6 Aufgabenbeschreibung versus dokumentierte Navigation

Material: keine Quellen in den RAG-Batches

Quellen: keine

