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
9. Wählen Sie die Verkaufslogik mit dem Zusatz „Contract start date“ aus. Die Werte sind unter „Verkaufslogik für den Vertragsstart“ in diesem Kapitel beschrieben.
10. Laden Sie das Produktbild von Ihrem Computer hoch. Das Bild ist Pflicht. Die Bildprüfung und das Bedienelement entsprechen dem Produkterstellungsprozess auf Marktebene.
11. Wechseln Sie erst zum nächsten Schritt, wenn alle Pflichtfelder ausgefüllt sind.

*Schritt 2, Coverage Codes.*

12. Wählen Sie in den drei Mehrfachauswahl-Comboboxen „Base Coverages“, „Optional Coverages“ und „Body Coverages“ die Coverage Codes aus. Die Einträge stammen aus den Coverage Codes, die der jeweiligen Kategorie zugeordnet sind. Die Combobox zeigt die Anzahl der Auswahl, zum Beispiel „X coverages selected“. Rechts erscheinen die gewählten Coverage Codes als Tags. Ein Tag entfernen Sie über das X; der Eintrag wird damit auch in der Auswahlliste abgewählt.
13. Wählen Sie mindestens eine Base Coverage. Ohne sie können Sie nicht fortfahren.
14. Bei dem Ablaufkriterium „Kontingent“ ist die Auswahl der Basisdeckung eine Einfachauswahl. Optional Coverages und Body Coverages lassen sich in diesem Fall nicht hinzufügen; beide Dropdown-Listen sind deaktiviert.

*Schritt 3, Übersicht.*

15. Prüfen Sie die Übersicht mit der Bezeichnung „Overview & Confirmation“. Sie zeigt alle Angaben aus den Schritten 1 und 2. Beim Ablaufkriterium sehen Sie Ihre Auswahl als Einzel- oder Mehrfachauswahl, je nach Konfiguration. Von hier aus erstellen Sie den Blueprint.
16. Aus den Schritten 2 und 3 gelangen Sie zu den vorherigen Schritten zurück und ändern bereits ausgefüllte Angaben.

*Blueprint bearbeiten.*

17. Wählen Sie „Bearbeiten“. Der Blueprint öffnet sich im ersten Schritt.
18. Ändern Sie Name, Beschreibung oder das Standardbild. Eine Änderung von Name und Beschreibung wirkt sich auf den ersten Schritt der Produkterstellung aus, wenn dieser angezeigt oder bearbeitet wird. Ein geändertes Standardbild ersetzt das Bild in allen Produkten, die das Bild des Blueprints verwenden.
19. Ändern Sie im zweiten Schritt die optionalen und die Body Coverages. Bei einer Ergänzung oder Entfernung erscheint der Dialog „Removing or Adding Coverages“. Mit „Update“ speichern Sie den Blueprint, mit „Cancel“ schließen Sie den Dialog, ohne zu speichern.
20. Der Dialog weist darauf hin, dass sich das Hinzufügen oder Entfernen von Coverages nur auf Produkte auswirkt, die nach der Aktualisierung des Blueprints erstellt werden. Bereits angelegte Produkte bleiben unverändert. Eine Anpassung bestehender Produkte beschreibt der folgende Ablauf.

*Coverages in einem Blueprint für bestehende Produkte übernehmen.*

21. Legen Sie den neuen Deckungscode in den VEGA Codes an, wie in Kapitel 15.7 beschrieben. Öffnen Sie danach den Blueprint und fügen Sie den Deckungscode hinzu.
22. Ist der Blueprint bereits in einem Produkt verwendet, erscheint am Ende des Blueprint-Ergebnisses eine Hinweismeldung. Sie bestätigt die Änderung und weist auf die Auswirkungen auf die zugehörigen Produkte hin.
23. Deaktivieren Sie das Produkt, das diesen Blueprint nutzt.
24. Öffnen Sie das deaktivierte Produkt zur Bearbeitung. Einmalig erscheint ein Banner, dass der Blueprint aktualisiert wurde. Das Banner erscheint nur beim ersten Bearbeiten, bis Sie den Wizard speichern.
25. Wählen Sie im Schritt 4 „Coverages“ die Schaltfläche „Edit Coverages“. Das Fenster zeigt die geänderten Deckungen aus dem Blueprint. Hinzugefügte und entfernte Deckungen sind klar voneinander unterschieden. Als „NOT INCLUDED“ markierte Deckungen erscheinen bei jeder weiteren Bearbeitung des Produkts nicht im Fenster. Hinzugefügte Deckungscodes bleiben immer zur Auswahl sichtbar.

*Blueprint löschen.*

26. Wählen Sie „Löschen“ und bestätigen Sie den Vorgang. Der Blueprint wird dauerhaft entfernt und steht danach bei der Erstellung neuer Produkte nicht mehr zur Verfügung. Bestehende Marktprodukte und Verträge bleiben davon unberührt.

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

**Maximale Grenzwerte auf Blueprint-Ebene.** Märkte verkaufen Servicevertragsprodukte nur auf Fahrzeuge, die die Berechtigungskriterien erfüllen. Die Grenzwerte auf Blueprint-Ebene, sogenannte Max Limits, bilden den Rahmen, in dem die MPCs agieren. Je nach Produkt und Ablaufkriterium stehen im Blueprint-Setup folgende Felder bereit:

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

**Ergebnis und Systemstatus.** Die Märkte arbeiten mit denselben HQ-Vorgaben. Eine Änderung im HQ-Bereich erscheint in den Market Settings. Wird in den Market Settings eine neue Sprache hinzugefügt, übernimmt das System die aktuellen Inhalte und füllt die Felder vor. Die HQ-Empfehlungen sind in den marktspezifischen Attributen vorbelegt, sodass die Daten abgestimmt bleiben.

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
- Eine entfernte Sprache verschwindet aus der aktiven Anzeige der Benutzeroberfläche. Die Datensätze bleiben erhalten. Bei einer Wiederherstellung ist das Feld mit der gespeicherten Übersetzung wieder sichtbar.
- Ein lokaler Marktnutzer kann die ursprünglichen HQ-Vorgaben zur Feldkonfiguration in den Market Settings weder ändern noch überschreiben.
- Die Beschreibung des ISP-Wizards stammt aus einem Entwicklungsstand, der die Abläufe nur mit dem Verweis „gemäß UI“ beschreibt. Der Stand ist im Klärungsbedarf erfasst.

**Fehlerbehebung.**

- Nach dem Speichern der Market Settings erscheint die Meldung „Settings saved successfully“. Der eingegebene Text bleibt erhalten.
- Ist die Vertragsanlage für ein gesperrtes Fahrzeug nicht möglich, erscheint die Meldung „locked vehicle“ mit dem Zusatz „no products available“.
- Ist ein Pflichtfeld im ISP-Wizard leer, lässt sich der Wizard nicht abschließen. Ergänzen Sie die Angabe und fahren Sie fort.

Quellen: Batch 1130.1, 884.1, 884.3, 5.1, 4.1, 1116.1, 1129.1, 994.2, 1197.1, 1208.1

## 15.6 Aufgabenbeschreibung versus dokumentierte Navigation

Material: keine Quellen in den RAG-Batches

Quellen: keine

## 15.7 Technical Options, SA-Matching, Coverage- und Industry-Codes

**Zweck.** Dieser Abschnitt beschreibt die zentralen Stammdaten, mit denen Produkte Leistungen und Ausstattung abbilden. Coverage Codes bilden Deckungen ab, Industry Codes Branchen, Technische Optionen Ausstattungscodes und Reifengrößen. Das SA-Matching ordnet Modelltypen den Ausstattungscodes zu. Schadencodes ordnen Werkstattfälle einem Deckungscode zu. Coverage Codes, Industry Codes und Schadencodes pflegen Sie im Menüpunkt „Manage Vega Codes“ mit den Reitern „Coverage Codes“, „Industry Codes“ und „Damage codes“. Technische Optionen pflegen Sie in der Fahrzeugverwaltung unter „Technische Optionen“. Die Bezeichnung „Technical Options“ gilt durchgängig in der Preisübersicht, der Angebotsvorschau und den Platzhaltern für Vertragsdokumente. Coverage Codes sind eigenständige Stammdaten, die HQPM definiert und Blueprints zuordnet.

**Voraussetzungen.** Sie sind als HQPM oder HQ-Administrator angemeldet. Für einen Coverage Code legen Sie die Divisionen fest, für die er gelten soll. Die Märkte, in denen ein Code verwendet werden kann, bestimmt die Marktspezifität; sie beschreibt Kapitel 15.5. Für Technische Optionen wählen Sie die Division und den Gruppentyp vor dem Anlegen der Gruppe.

**Rollen.** HQPM legt Coverage Codes, Industry Codes und Technische Optionen an und verwaltet sie. Das Deaktivieren und das Löschen von Industry Codes ist dem HQPM vorbehalten. HQ-Administratoren fassen Ausstattungscodes zu TO-Gruppen zusammen, die Märkte bepreisen. Market-Operation-Nutzer und Administratoren legen Schadencodes an. MPC- und HQ-Nutzer filtern Coverage Codes nach der Kategorie und sehen deren Details.

**Schritt für Schritt.**

*Coverage Code anlegen.*

1. Öffnen Sie den Reiter „Coverage Codes“ und wählen Sie „Create Coverage Code“. Der Assistent führt in drei Schritten durch die Anlage. In jedem Schritt können Sie abbrechen; ein Klick auf das X öffnet einen Dialog zum Beenden.
2. Wählen Sie im Schritt 1 die Coverage Category. Zur Auswahl stehen Base, Body und Optional in alphabetischer Reihenfolge. Die Kategorie „Tire product reference“ steht für die Divisionen Passenger Cars und Vans zur Verfügung.
3. Wählen Sie die Division. Das Dropdown ist eine Mehrfachauswahl mit den Einträgen „Passenger Cars“ und „Vans“. Das Feld zeigt die Anzahl der Auswahl, zum Beispiel „X divisions selected“.
4. Geben Sie den Coverage Name ein. Er umfasst 5 bis 200 Zeichen.
5. Geben Sie den Coverage Code ein. Er besteht aus genau vier Zeichen aus Großbuchstaben und Ziffern; Kleinbuchstaben wandelt das System um. Der Code muss innerhalb der Division eindeutig sein. Das System prüft dies beim Wechsel zum zweiten Schritt und vor dem Speichern. Der erste Buchstabe wird je Kategorie vorbelegt: P für Base, O für Optional und A für Body.
6. Geben Sie die Coverage Reference ein. Sie umfasst 3 bis 10 Zeichen aus Großbuchstaben, Ziffern, Unterstrichen und Bindestrichen.
7. Optional geben Sie einen Family Tag mit 3 bis 25 Zeichen ein. Sonderzeichen sind erlaubt. Der Family Tag muss nicht eindeutig sein.
8. Wählen Sie im Schritt 2 die Märkte über „Current and Upcoming Markets“ oder „Custom Markets“. Der Family Tag erscheint auch in diesem Schritt.
9. Prüfen Sie im Schritt 3 die Übersicht und bestätigen Sie. Der Code erscheint in der Übersichtsliste mit der Spalte „Family tag“.

*Coverage Code bearbeiten und deaktivieren.*

10. Wählen Sie im Aktionsmenü „Bearbeiten“. Der Coverage Code und die Coverage Reference sind nicht änderbar. Im zweiten Schritt passen Sie Beschreibungen an und fügen Märkte hinzu oder entfernen sie. Gespeichert wird im letzten Schritt.
11. Deaktivieren Sie einen Coverage Code oder löschen Sie ihn, sofern er nicht verwendet wird. Beide Aktionen verlangen eine Bestätigung. Ein deaktivierter Code verschwindet aus der Liste und steht für neue Blueprints nicht zur Verfügung. Ein gelöschter Code ist endgültig entfernt; die Aktion lässt sich nicht rückgängig machen.

*Coverage Codes suchen.*

12. Suchen Sie über die Felder für den Coverage Code und die Coverage Reference, den Divisionsfilter und den Kategoriefilter. Die Kategorien Base, Optional und Body lassen sich mehrfach auswählen. Die Suche lösen Sie über „Suchen“ aus. Die Liste ist standardmäßig nach dem vierstelligen Coverage Code sortiert, und jede Spalte lässt sich auf- und absteigend sortieren.

*Industry Code anlegen.*

13. Öffnen Sie den Admin-Bereich, den Menüpunkt „Manage VEGA Codes“ und den Reiter „Industry Codes“. Wählen Sie „Create Industry Code“. Der Vorgang läuft in drei Schritten: „Define Industry Codes“, „Market Specificity“ und „Overview & Confirmation“.
14. Legen Sie im Schritt 1 den Branchencode fest. Er hat genau vier Zeichen: das große I, das das System vorbelegt, und drei Ziffern, die Sie eingeben. Der Code muss eindeutig sein. Die Division ist auf Vans festgelegt. Der Branchenname umfasst 5 bis 200 Zeichen.
15. Wählen Sie im Schritt 2 die Marktspezifität. Die Option „Current and Upcoming Markets“ ist vorausgewählt. Alle Märkte sind dann gewählt, die Kästchen lassen sich nicht ändern. Ein später hinzukommender Markt wird automatisch gewählt und erhält den Branchennamen aus Schritt 1.
16. Wählen Sie für „Custom Markets“ die Märkte per Checkbox. Ein Klick auf „Select All“ oder „Deselect All“ wählt alle Märkte oder hebt alle Auswahlen auf. Nach der Bestätigung erscheint je Markt und Sprache eine Karte mit einem Pflichtfeld für den Branchennamen mit 5 bis 200 Zeichen. Eine geleerte Karte setzt den Standardnamen aus Schritt 1 ein. Ohne ausgewählten Markt bleibt „Confirm“ deaktiviert.
17. Prüfen Sie im Schritt 3 die Übersicht und wählen Sie „Confirm“. Das System speichert den Industry Code.

*Industry Code bearbeiten und deaktivieren.*

18. Wählen Sie „Bearbeiten“. Der Schritt 1 öffnet sich. Der Branchencode ist nicht änderbar, der Name schon. Im Schritt 2 fügen Sie Märkte hinzu oder entfernen sie. Gespeichert wird im letzten Schritt.
19. Deaktivieren Sie einen Industry Code, der Produkten zugeordnet ist. Er verschwindet aus der Auflistung und steht für neue Produkte nicht mehr zur Verfügung. Löschen Sie einen nicht verwendeten Industry Code endgültig. Beide Aktionen verlangen eine Bestätigung.

*Technische Option anlegen.*

20. Öffnen Sie in der Fahrzeugverwaltung den Bereich „Technische Optionen“ und wählen Sie die Division. Danach wählen Sie den Gruppentyp „General“, „Tire Type“ oder „Tire Size“. Beim Bearbeiten ist der Gruppentyp deaktiviert.
21. Geben Sie den Gruppennamen ein. Der Name ist je Division eindeutig. Bei der Gruppenart Reifengröße geben Sie eine Größe ein, zum Beispiel 195/65 R17. Die Eingabe akzeptiert Ziffern, Buchstaben, Leerzeichen und Sonderzeichen wie „/“ und „R“ und ist auf 35 Zeichen begrenzt. Das System speichert den Namen unverändert.
22. Wählen Sie die Matching-Logik: „Alle müssen übereinstimmen“, „Keine darf übereinstimmen“ oder „Eine muss übereinstimmen“.
23. Fügen Sie SA-Codes hinzu. Nach jedem SA-Code zeigt das System eine Tabelle mit den Modellcodes, die diesen SA-Code enthalten. Die Tabelle passt sich an, sobald Sie SA-Codes hinzufügen oder entfernen. Werden zwei unterschiedliche Größen zugeordnet, verwendet das System die größere.
24. Sind in einer Gruppe vom Typ Reifen zwei oder mehr Codes hinterlegt, müssen alle Codes in der VeDoc-Antwort enthalten sein, damit der für diese Kombination definierte Preis angewendet wird.

*TO-Gruppe für die Preisbildung anlegen.*

25. Wählen Sie „Create TO Group“ und anschließend die Division. Geben Sie einen Gruppennamen mit 3 bis 30 Zeichen und eine Gruppenbeschreibung mit 20 bis 2000 Zeichen ein. Fügen Sie Ausstattungscodes hinzu. Jeder Code hat genau drei alphanumerische Zeichen und wird in Großbuchstaben umgewandelt. Eine Gruppe enthält höchstens 15 Ausstattungscodes.
26. Wählen Sie „Create“, um zu speichern. „Cancel“ kehrt ohne Speichern zur Übersicht zurück. Die zuletzt angelegte Gruppe steht standardmäßig oben.

*Schadencode anlegen.*

27. Öffnen Sie den Admin-Bereich unter „VEGA Codes“, wechseln Sie zum Reiter „Damage codes“ und wählen Sie „Create Damage code“. Der Assistent führt in drei Schritten durch die Anlage.
28. Wählen Sie im Schritt „Define Damage Code“ den Coverage Code über die Coverage Reference aus. Die Division ist schreibgeschützt und ergibt sich aus dem Coverage Code. Der Schadencode besteht aus genau fünf Zeichen aus den Ziffern 0 bis 9 und den Buchstaben A bis Z. Der Schadenstyp besteht aus genau zwei Zeichen aus denselben Zeichen. Für jede Kombination aus Division, Schadencode und Schadenstyp entsteht eine eigene Zeile.
29. Wählen Sie im Schritt „Market Specificity“ mindestens einen Markt aus. „Select All Markets“ wählt alle verfügbaren Märkte aus. Je Markt geben Sie Code Description und Type Description ein. Beide Felder umfassen 5 bis 100 Zeichen.
30. Prüfen Sie im Schritt „Overview & Confirmation“ die Übersicht und wählen Sie „Confirm“.

*Schadencodes importieren.*

31. Öffnen Sie im Admin-Bereich den Bereich „Damage Codes“ und wählen Sie „Upload damage codes“. Wählen Sie eine Datei im Format .xlsx über „Browse“ oder per Drag and Drop aus. „Confirm“ startet den Import. Während des Imports erscheint ein Ladeindikator.
32. Die Excel-Datei enthält die Spalte „MSM coverage“ für den Deckungscode, die Spalte „DC+DT“ für den Schadencode und die Spalte „dc Description + dt Description“ für die Beschreibung. Die importierten Codes werden mit ihren Übersetzungen gespeichert, zum Beispiel DE, EN und FR.
33. Laden Sie für eine Kombination aus Deckungscode und Division erneut eine Datei hoch, ersetzt das System die bereits importierten Codes dieser Kombination. Manuell angelegte Schadencodes bleiben erhalten.

*Schadencodes exportieren und ansehen.*

34. Öffnen Sie im Bereich Product Management die VEGA Codes, wählen Sie „Damage Codes“ und suchen Sie. Die Schaltfläche für den Download ist nur aktiv, wenn die Suche mindestens einen Schadencode findet. Die Datei enthält die Codes der aktuellen Suchfilter im XLSX-Format. Wird ohne Filter gesucht, enthält die Datei alle Schadencodes, auch wenn die Oberfläche nur 10.000 anzeigt.
35. Öffnen Sie einen Schadencode über die Spalte „Aktion“ oder über den Link im Schadencode. Der Ansichtsmodus zeigt die Inhalte ohne Bearbeitung. „Cancel“ schließt die Ansicht, „Back“ wechselt in den Bearbeitungsmodus.

**Ergebnis und Systemstatus.**

- Coverage Codes stehen für die Blueprint-Auswahl bereit. Family Tag gruppiert die Coverage Codes in Ansichten für Vertrieb und Kunden. Die Übergabe an die Generierung erfolgt in der festgelegten Reihenfolge und gruppiert nach Family Tag.
- Eine Coverage mit der Kategorie „Tire product reference“ kann im Produkt auf „Optional“ oder „Not Included“ gesetzt werden, nicht auf „Always Included“. Das gilt für die Divisionen Passenger Cars und Vans. Ein Reifenprodukt für Van Unlimited lässt sich eigenständig oder als Option an ein bestehendes Produkt anhängen.
- Industry Codes stehen bei der Produkterstellung zur Auswahl. Die Vertragserstellung übermittelt die Branchendaten für jedes Produkt. Der Branchenname ist eindeutig.
- Technische Optionen werden zentral definiert. Märkte bepreisen die TO-Gruppen. Händler verwenden sie im Verkaufsprozess für Serviceverträge. Die Abfrage verfügbarer Produkte liefert das Feld „included“ je nach Auswahl des Benutzers als wahr oder falsch; die Liste zeigt die Optionen für Laufleistung und Laufzeit.
- Der SA-Code-Filter für Modelltypen der Van-Sparte bietet die Einstellungen „Include SA Code/s“ als Standard, „Exclude SA Code/s“ und „No Rule“. Bei „Include SA Code/s“ zeigt das System nur Modelltypen mit den angegebenen SA-Codes. Bei „Exclude SA Code/s“ zeigt es nur Modelltypen ohne diese Codes. Bei „No Rule“ erscheinen alle relevanten Modelltypen.
- Schadencodes gelten je Division, Schadencode und Schadenstyp und sind in den Märkten verfügbar, die im Assistenten gewählt wurden. Importierte Schadencodes erscheinen in der richtigen Spalte, und die Sortierung nach Coverage Code funktioniert.

**Besonderheiten je Rolle, Sparte und Markt.**

- Die Division bestimmt die Auswahl. Coverage Codes lassen sich den Divisionen Passenger Cars und Vans zuordnen. Industry Codes sind auf die Division Vans festgelegt. Technische Optionen legen Sie je Division an.
- Die Marktlisten für Industry Codes und Schadencodes enthalten ausschließlich Deutschland. Weitere Märkte erscheinen, sobald oneSCM sie unterstützt.
- Die Übersetzungen der Märkte stehen in Kapitel 15.5. Die Marktnamen erscheinen je nach Markteinstellung in der Sprache des Marktes.
- Die Quelle nennt einen Tab zum Anlegen von Industry Codes, der vor allem für Testzwecke gedacht ist. Dieser Abschnitt beschreibt die Anlage als regulären Ablauf. Die Abweichung ist im Klärungsbedarf erfasst.
- Die Gruppenart Reifengröße gehört zum Reifenprodukt. Ein Reifenprodukt mit Radgrößen, Wetterprofilen und Preisen beschreibt Kapitel 13.2. Die Wetterprofile „Summer“, „Summer/Winter“ und „All-Season“ sind fest hinterlegt und ohne Technische Optionen verfügbar.
- Technische Optionen erscheinen in der Fahrzeugverwaltung als Karten mit Gruppenname, Division, SA-Codes und Typ der Technischen Option.

**Hinweise.**

- Die Platzhalter für Vertragsdokumente lauten technicalOptions, contractTechnicalOptions und contractTechnicalOptionsAfterProlongation.
- Ein Angebot über die Fahrgestellnummer oder Bestellnummer zeigt Technische Optionen ohne Preis. Ist bereits eine Technische Option vorhanden, lassen sich Optionen nicht hinzufügen oder entfernen. Diese Abläufe beschreibt Kapitel 5.5.
- Ein neu angelegter Coverage Code darf den Namen eines gelöschten Coverage Codes tragen.
- Die Übersicht erreichen Sie nur mit gültigen Pflichtangaben für Kurz- und Langbeschreibung.
- Die Kategorie „Tire product reference“ verwendet das Präfix T. Die Abweichung zu den übrigen Kategorien ist im Klärungsbedarf erfasst.
- Bei Schadencodes ist die Division schreibgeschützt und ergibt sich aus dem gewählten Coverage Code. oneSCM ist das führende System für die Beziehung zwischen Division und Coverage Code.
- Der Markt ergänzt die Übersetzungen je Sprache in den Market Settings. Kapitel 15.5 beschreibt diese Übermittlung.

**Fehlerbehebung.**

- „Must be at least 4 characters long.“ erscheint, wenn ein Code der Kategorie „Tire product reference“ kürzer als vier Zeichen ist. Der Code beginnt standardmäßig mit „T“, zum Beispiel mit dem Testwert T001.
- „Coverage Code for this division is already existing. Please change it and try again.“ erscheint, wenn der Code in der Division bereits vergeben ist.
- „Coverage Code with this name is already existing. Please change it and try again“ erscheint bei einer doppelten Anlage ohne Divisionsbezug. Ändern Sie den Code und versuchen Sie es erneut.
- Ist ein Branchencode bereits vergeben, erscheint eine Meldung, dass ein Branchencode mit diesem Namen bereits existiert. Ändern Sie den Code und versuchen Sie es erneut.
- „Industry Code saved successfully“ bestätigt die Speicherung. Die Meldung „Failed to update Industry Code successfully“ erscheint bei einem Fehler in der Bearbeitung.
- „Could not load available markets. Please exit and try again later“ erscheint, wenn die Marktliste nicht geladen werden kann. Beenden Sie den Vorgang und versuchen Sie es später erneut.
- „Group Name for this division is already existing. Please change it and try again.“ erscheint, wenn der Gruppenname in der Division bereits vergeben ist.
- Der Button „Create“ bleibt deaktiviert, bis alle Pflichtfelder der TO-Gruppe ausgefüllt sind.
- Das Suchfeld für den Coverage Code begrenzt die Eingabe auf vier Zeichen.
- Nach einem Import erscheint die Meldung „File Dateiname was successfully imported“. Schlägt der Import fehl, erscheint die Meldung „File Dateiname could not be imported.“ mit einer Schaltfläche „Close“. Das Fenster bleibt geöffnet, damit Sie die Datei erneut hochladen können.
- Die Schaltfläche für den Download der Schadencodes ist deaktiviert, wenn die Suche keinen Code findet. Ein Hinweis erklärt dies beim Überfahren mit der Maus.

Quellen: Batch 1220.2, 1220.3, 1264.2, 1191.1, 1162.1, 1161.3, 1160.4, 1263.1, 1221.1, 1204.1, 1208.1, 1209.1, 1203.2, 1259.2, 1258.6, 1254.1, 1201.2, 1174.3, 1174.1, 1188.2, 1167.2, 1207.1, 7.3, 5.3, 4.1, 731.3, 732.1, 169.3, 199.4, 703.3, 884.3, 1171.3, 1100.2, 1130.1, 1279.3

## Verschiebung in andere Kapitel

| Inhalt | Zielkapitel | Batch |
|---|---|---|
| Produkterstellung auf Basis eines Blueprints: Auswahl von Division und Blueprint, Product Setup, Basisproduktinformationen, Vertriebs- und Vertragskonfigurationen, Produktzusammenfassung, Sales Dependency, Lieferant und Reifenumfang des Produkts, Branchen und Kontingentprodukte mit dem Blueprint „Compact“ | 14.8 Produktdefinition, Anlage und Veröffentlichung | 1171.3, 1192.3, 1207.2, 1223.3, 1224.3, 1224.4, 1224.5, 1238.3, 1242.1, 1284.2 |
| Produktbearbeitung, Produktbilder und Ladezeit, Admin-Fee-Werte, Maximallängen der Felder, Industry-Anzeige in der Zusammenfassung, Wetterprofil und T&C bei Produkten | 14.8 Produktdefinition, Anlage und Veröffentlichung | 1259.2, 1264.3, 1273.2, 1278.3, 1279.2 |
| Garantieverlängerung als Produkt durch den MPC-Anwender | 14.8 Produktdefinition, Anlage und Veröffentlichung | 1118.1 |
| Vorschau und Tabelle der Preisversionen | 14.9 Preisversionen, Cluster und Faktorgrenzen | 1268.2 |
| Preismatrix und Tab „Optional Coverages“ eines Clusters | 14.9 Preisversionen, Cluster und Faktorgrenzen | 1264.3 |
| Technische Optionen in Preisclustern, Preisdefinition und Auswahl der TO-Gruppen | 14.9 Preisversionen, Cluster und Faktorgrenzen | 1204.2, 1206.1, 1257.2 |
| Produkte ohne FRD-Bezug: Preisberechnung aus der Preismatrix und Platzhalter für Vertragsdokumente | 14.9 und 7.4 Vertragsdokumente und Sprachvarianten | 1163.2 |
| Technische Optionen im Vertragsangebot, Anzeige ohne Preise, Auswahl bei Baumuster | 5.5 Laufzeit, Laufleistung und Optionen konfigurieren | 929.5, 1100.2 |
| Kategorie „Technischer Tarif“ in der Preisübersicht | 5.6 Preise, Kampagnen und Rabatte im Angebot | 945.3 |
| Gruppierung der Coverage Codes nach Family Tag in Vertriebs- und Kundenansichten | 5.4 Produkte und Leistungsumfang auswählen | 1191.1 |
| Anzeige der Preisinformationen und des Preisclusters auf der Vertragsdetailseite | 10.1 Verträge suchen und Details prüfen | 769.3 |
| Übersetzte Bezeichnungen der Codes in Vertragsdokumenten, Dokumentgenerierung, Bearbeitung Technischer Optionen | 7.4 Vertragsdokumente und Sprachvarianten | 884.1, 1.4 |
| Herstellergarantie je Markt in den Markteinstellungen | 14.2 Marktspezifische Einstellungen | 1118.1 |
| Neuordnung der HQ-Konfigurationsseite, Gruppierung von Timer und Reminder, Währung in den Allgemeinen Einstellungen | 14.2 Marktspezifische Einstellungen | 963.2 |
| Sortierung der Engine Series im Administrationsbereich der Fahrzeugverwaltung | 14.5 Administrationsbereich und zulässige Aktionen | 8.6 |
| Verwaltung der K/JX-Codes im HQ-Reiter der Fahrzeugverwaltung | 14.5 Administrationsbereich und zulässige Aktionen | 1197.1 |
| Ermittlung der K/JX-Codes im Angebot über VeDoc, GoOrder und AFAB | 5.5 Laufzeit, Laufleistung und Optionen konfigurieren; 19.2 GO; 19.3 AFAB; 19.4 CEPRO | 1197.1 |
| Verlängerung und Prolongation bei Änderungen an Coverages, Preis zum Prolongationszeitpunkt | 10.5 Verlängerung, Folgeangebot und Folgevertrag | 1149.1 |
| Produktversion, Deaktivierung von Produkten und Bestandswirkung bei Coverage-Änderungen | 14.10 Produktänderung, Versionierung und Bestandswirkung | 1149.1 |
| Sperre gesperrter Fahrzeuge im Angebotsprozess und Status „Rejected“ bei nachgelieferter Fahrgestellnummer | 5.2 Fahrzeug- und Vorgangskennungen; 8.7 Ablehnung, Verzögerung und Wiederaufnahme | 994.2 |
| Baumuster mit sieben und acht Stellen, Java-Version des Vehicle Managements, Fehlerbehebungen, Testendpunkt, Suche über Auftragsnummer, Ladezeit im Vertragsmanagement | 5.2 Fahrzeug- und Vorgangskennungen; 19.1 Architekturüberblick und Systemlandkarte; 16.4 Testnachweise und produktiver Funktionsstand | 4.1 |
| Van-Produktlinien und I155-Codes in Produkten und Payload | 21.3 Produkte und Preisparameter je Sparte | 1195.2 |
| Reifenprodukt Van Unlimited, Reifenkonfiguration, Radgrößen und Wetterprofile in der Produktanlage | 13.2 Produkt, Reifentyp und Reifengröße; 13.4 Preis, Optionen und Kampagnen | 1161.3, 1171.3, 1174.1, 1174.3 |
| Zuordnung von Deckungscodes zu Lieferanten, Lieferantenregistrierung, Zahlungspläne Light und Full | 11.5 Werkstatt- und Lieferantenbezüge; 11.1 Rechnungsstellung und Zahlpläne | 571.1, 710.2 |
| Schadencode in Schadensfällen in Abhängigkeit vom Deckungscode | 11.4 Kostenmanagement und Claims | 58.1 |
| Schadencodes bei der manuellen Erfassung einer Werkstattrechnung | 11.5 Werkstatt- und Lieferantenbezüge | 732.1 |
| Kostenstelle und Lieferantenpreis je Deckungscode, Branchenpreise | 14.14 Preiskomponenten, Cost Unit Split und Inflation | 127.2, 1203.2 |
| Branchencode in den Basis-Data-Products | 19.19 Datenplattformen und Reporting | 321.8 |
| i155-Erzeugung bei Vertragsende vor Vertragsbeginn, Logdatei, eindeutige Coverage-ID in Satzart RC20 | 19.9 VEGA: Vertrag, Coverage und Claim | 842.2 |
| CePro-Import von E-Performance-Fahrzeugen mit 4Matic | 19.4 CEPRO: Van-Fahrzeugstammdaten | 1254.1 |
| Name von Fahrzeuggruppen mit höchstens 100 Zeichen, Ausrichtung der Seite Technical Options | 14.11 Fahrzeuggruppen und Van-Baumuster-Clustering | 1258.5 |
| Rollen für Passenger Cars und Vans, einheitlicher Geschäftsbereichsfilter in allen Bereichen | 2.2 Fachliche Rollen und technische Berechtigungen; 21.1 Spartenprofil und Abgrenzung Pkw/Van; 14.6 Marktbezogene Sichtbarkeit und Berechtigungen | 603.1 |
| Aktualisierung von SA-Codes aus externen Bestellsystemen, wiederholbare Produktabfrage | 22.2 Ausblick | 1143.5 |
| Erweiterung des Produkt-Blueprints für den Anwendungsfall MBLD | 22.2 Ausblick | 1143.6 |
| Definition eines Produkt-Blueprints für das Produkt „Excellent“ und Optimierung der Blueprint-Logik | Anhang F Quellen und Klärungsregister | 1244.5 |
| Vertragsstartdatum aus der Verkaufslogik und Garantiedauer beim Erfassen des Vertrags | 6.2 Vertragsdaten und Pflichtfelder erfassen | 1118.1 |

## Klärungsbedarf

**Widersprüche und unklare Aussagen.**

1. Ablaufkriterium im Blueprint: Batch 1219.3 nennt, dass genau eines der Ablaufkriterien „Contingent“, „Time“ oder „Time or Mileage“ gewählt wird. Batch 1192.2 und Batch 1192.1 nennen Mehrfachauswahl und die Entscheidung im Produkt. Batch 1195.4 nennt, dass das Ablaufkriterium aller Produkt-Blueprints und Produkte in der Produktionsumgebung „Zeit“ ist. Der Text folgt Batch 1192.1 und Batch 1192.2. Zu bestätigen.
2. Länge des Blueprint-Namens: Batch 1219.3 nennt 3 bis 100 Zeichen. Batch 1264.3 und Batch 1268.2 nennen 3 bis 30 Zeichen. Der Text folgt den beiden letzten Quellen.
3. VEGA-Vertragstyp: Batch 1219.3 nennt 1 bis 11 Zeichen. Die Fehlermeldung in derselben Quelle nennt 6 Zeichen, das Beispiel P_ABC_XYZ hat 9 Zeichen. Die Meldung nennt zusätzlich Bindestriche, die Regel nur Unterstriche. Der Text folgt der Regel.
4. Werte der Verkaufslogik: Batch 1118.1 nennt die Werte FRD, Sales date und Future date. Batch 1183.2 nennt FRD Related, FRD Not Related und Used Car Related. Batch 1163.2 nennt die Sales Logic als Multi Select mit den Werten FRD Related und FRD Not Related. Batch 1183.2 verknüpft die Obergrenzenlogik für Used Car Related mit dem Vorhaben ONESCM-31107. Der Zeitpunkt, zu dem dieses Vorhaben die Logik ablöst, fehlt. Der Text folgt Batch 1118.1.
5. Änderung von Coverages im Blueprint: Batch 1219.4 beschreibt, dass hinzugefügte Optional und Body Coverages in den Produkten als „Not included“ ergänzt und entfernte Coverages aus den Produkten entfernt werden. Batch 1259.2 nennt, dass sich die Änderung nur auf Produkte auswirkt, die nach der Aktualisierung erstellt werden. Batch 1149.1 beschreibt die Übernahme für ein deaktiviertes Produkt bei dessen Bearbeitung. Der Text folgt Batch 1259.2 und Batch 1149.1.
6. Vertriebsabhängigkeit: Batch 1274.3 nennt die Vertriebsabhängigkeit als Feld in Schritt 1 des Blueprints. Batch 1192.2 und Batch 1219.3 führen die Felder von Schritt 1 ohne sie auf. Der Text folgt Batch 1274.3.
7. Zuordnung der Lieferanten: Batch 710.2 nennt, dass jedem Deckungscode nur ein Lieferant zugeordnet sein kann. Batch 571.1 nennt, dass ein Deckungscode bei mehreren Lieferanten verwendet und je Lieferant unterschiedlich konfiguriert werden kann. Batch 710.2 nennt die Zahlungspläne „Light“ und „Normal“ oder „Full“, Batch 571.1 nennt „Light Billing“ und „Full Billing“.
8. Schadencodes und Märkte: Batch 731.3 erlaubt die Auswahl mehrerer Märkte mit Beschreibungen je Markt. Batch 732.1 nennt Schadencodes, die allen Märkten zur Verfügung stehen. Batch 884.3 nennt, dass ein Schadencode genau einem Markt gehört und keine Zuordnung zum eigenen Markt vorgesehen ist. Batch 731.3 nennt „Code Description“ und „Type Description“, Batch 884.3 nennt „Code Name“ und „Type Description“. Zu bestätigen.
9. Rollen für die Anlage der Codes: Batch 1220.2, Batch 1204.1, Batch 1191.1 und Batch 1221.1 nennen die Rolle HQPM. Batch 1162.1 nennt die Rollen HQ, MPC und MO mit vollständigen Rechten und den Zugang über MPC oder HQ. Batch 1161.3 nennt den Zugang über MPC oder HQ. Batch 731.3 nennt Market-Operation-Nutzer und Administratoren für Schadencodes, Batch 1130.1 den HQ-Administrator. Der Text nennt HQPM als Regelfall. Zu bestätigen.
10. Ablageort der VEGA-Codes: Batch 1162.1 nennt das Modul VEGA Codes im Bereich Product Management, nicht im Admin-Bereich. Batch 1221.1, Batch 1208.1, Batch 1204.1, Batch 731.3 und Batch 1160.4 nennen den Admin-Bereich. Der Text folgt dem Admin-Bereich.
11. Kategorien und Begriffe der Coverage Codes: Batch 1220.3 nennt die Kategorien Base, Body und Optional. Batch 1221.1 nennt Basic, Optional und Body für den Filter. Batch 1160.4 nennt „Tire product reference“. Batch 1161.3 und Batch 1162.1 nennen „Tire Option“. Batch 1162.1 nennt für diese Kategorie den Präfix T, Batch 1264.2 nennt die Präfixe P, O und A. Der Text verwendet Base, Optional, Body und „Tire product reference“.
12. Eindeutigkeit des Coverage Codes: Batch 1220.3 nennt die Eindeutigkeit ohne Bezug. Batch 1263.1 und Batch 1162.1 nennen die Eindeutigkeit innerhalb der Division. Der Text folgt der Division. Batch 1263.1 enthält zusätzlich die Frage, ob der Divisionsfilter „smart“ enthalten soll; die Quelle vermerkt, dass „smart“ eher eine Marke als eine Division ist. Die Frage ist nicht beantwortet.
13. Family Tag: Batch 1191.1 beschreibt, dass einzeln geführte Coverage Codes als Coverage-Kategorie angezeigt werden. Das Verhältnis zur Gruppierung über den Family Tag ist nicht eindeutig.
14. Namen und Längen bei Technischen Optionen: Batch 1207.1 nennt 3 bis 30 Zeichen für den Gruppennamen. Batch 1258.5 nennt 100 Zeichen für den Namen von Fahrzeuggruppen; die Quelle erwähnt dabei die Seite Technical Options. Batch 7.3 nennt für eine Gruppe der Reifengröße nur zwei Ziffern. Batch 1174.3 nennt frei wählbare Namen mit bis zu 35 Zeichen. Der Text folgt Batch 1207.1 und Batch 1174.3.
15. Gruppentyp der Reifengröße: Batch 1201.2 nennt den Gruppentyp „Tire Size“. Batch 1174.3 nennt die Gruppenart „Wheel Size“. Der Text folgt Batch 1201.2 im Dropdown.
16. Beschriftung der Abhängigkeit: Batch 1254.1 nennt die Beschriftung „Cost Dependency“ statt „Dependency Definition“. Batch 1257.2 nennt weiterhin „Dependency Definition“. Der Text folgt Batch 1254.1.
17. Industry-Codes-Testtab: Batch 1259.2 beschreibt einen Tab zum Anlegen von Industry Codes, der vor allem für Testzwecke gedacht ist. Batch 1208.1 und Batch 1209.1 beschreiben die Anlage als regulären Ablauf. Der Text folgt Batch 1209.1.
18. Testfälle der Industry Codes: Batch 1203.2 nennt Testfälle für Erstellung, Übersicht, Bearbeitung, Zuordnung zu Produkten und Branchenpreise, enthält aber keine funktionale Beschreibung. Der Text enthält dazu nichts.
19. Kennzeichnung der Schadencodes: Batch 732.1 nennt die Absicht, importierte und manuell angelegte Schadencodes zu kennzeichnen. Die Quelle beschreibt weder den Umfang noch den Zeitpunkt dieser Kennzeichnung.
20. Schrittnamen der Produkterstellung: Batch 1224.3 nennt den Entfall des Dropdowns Brand. Batch 1242.1 nennt drei Dropdowns einschließlich Marke. Batch 1192.3, Batch 1242.1, Batch 1224.4 und Batch 1224.5 nennen unterschiedliche Schrittnamen. Batch 1242.1 nennt „Create Product“, Batch 1207.2 „Create New Product“. Die Abweichungen betreffen Kapitel 14.8.
21. Wirkung auf das Vertragsmanagement: Batch 1149.1 nennt, dass das Vertragsmanagement Änderungen an Coverages nicht berücksichtigt und dafür ein Eintrag für Stream 2 besteht. Der Umgang mit der VEGA-Datei ist nicht beschrieben. Stream 2 ist im Material nicht erläutert.
22. Stand des ISP-Wizards: Batch 1129.1 nennt, dass das Vorhaben dem Entwicklungsstand zugeordnet ist und die Abläufe nur mit dem Verweis „gemäß UI“ beschrieben sind. Die Ergänzung ist vor der Veröffentlichung nötig. Batch 1116.1 beschreibt denselben Ablauf als Sollverhalten. Der Text folgt beiden Quellen.
23. Entfallende Felder in den Markteinstellungen: Batch 963.2 nennt die Felder DSS-Signaturlink, CAS-Antwort, SEPA-Validierung und SAP-Debitorennummer als in der Zielstruktur gestrichen. Die Quelle nennt keinen Zeitpunkt für den Entfall.
24. Preisfaktoren: Batch 1195.4 nennt Probleme mit Preisfaktoren in der Vorproduktionsumgebung, ohne das Sollverhalten zu beschreiben.
25. Ausstehende Prüfpunkte in der Fahrzeugverwaltung: Batch 4.1 nennt die Absicht, bei Van-Fahrzeuggruppen den Namen des SA-Codes anzuzeigen, und das Prüfziel, dass eine aktuelle Preisversion vorausgewählt wird. Die Quelle nennt keinen Stand für beide Punkte.
26. Erweiterung des Contingent Blueprints: Batch 1258.3 nennt eine Erweiterung ohne Angabe des Inhalts.

**Eingestellte, geschlossene und ungeklärte Meldungen.**

- Batch 1244.5 nennt die eingestellte Definition eines Produkt-Blueprints für das Produkt „Excellent“, die Optimierung der Blueprint-Logik und Änderungen an der Produktversion. Diese Punkte gehören nicht zum aktuellen Funktionsumfang und sind daher kein Handbuchinhalt.
- Batch 937.1 ist als Vorgang mit dem Status „Cancelled“ gekennzeichnet. Die Redaktion soll prüfen, ob die Funktion überhaupt ausgeliefert wird. Die Rohdaten enthalten Markierungen, dass Wortlaut und Ablauf im Schritt „Technische Optionen“ noch anzupassen sind. Der Text übernimmt aus dieser Meldung keinen Inhalt.
- Batch 1143.6 nennt die Erweiterung des Produkt-Blueprints für den Anwendungsfall MBLD und verweist auf fehlende Angaben. Der Text enthält dazu nichts.
- Batch 1143.5 beschreibt die Aktualisierung von SA-Codes aus externen Bestellsystemen und eine wiederholbare Produktabfrage als Vorhaben. Die Quelle nennt keinen Stand. Die Verschiebung nach Kapitel 22.2 erfolgt daher ohne Verhaltensbeschreibung.
- Batch 1203.2 nennt Testfälle für Industry Codes ohne funktionale Beschreibung. Siehe Punkt 18.

## Vorschläge zur Gliederung

- Die Unterkapitel 15.1, 15.3, 15.4 und 15.6 haben keine Quellen in den RAG-Batches. Für 15.3 bieten sich die Länderabweichungen aus den Batches 884.1, 1130.1, 1118.1 und 963.2 an, sofern die Zuordnung bestätigt wird. Für 15.4 bietet sich die HQ-Sperre aus Batch 994.2 an, wenn sie als Freigabe auf HQ-Ebene verstanden wird.
- Das Unterkapitel 15.7 umfasst 59 Abschnitte und sollte aufgeteilt werden: 15.7 für Coverage Codes, ein eigenes Unterkapitel für Industry Codes, ein eigenes für Technische Optionen und SA-Matching sowie ein eigenes für Schadencodes. Schadencodes sind im Gliederungstitel von 15.7 nicht genannt.
- ISP-Codes und K/JX-Codes fehlen in der Gliederung. Sie bilden als HQ-Stammdaten ein eigenes Unterkapitel, etwa „K/JX-Codes und ISP-Codes“.
- Das Unterkapitel 15.2 umfasst 28 Abschnitte. Eine Aufteilung in Blueprint-Anlage und -Bearbeitung, Coverages im Blueprint, Verkaufslogik und Grenzwerte sowie Besonderheiten der Van-Blueprints wäre übersichtlicher.
- Die Batches ohne Unterkapitel-Zuordnung sollten zugeordnet werden: Batch 8.6 gehört zu 14.5, Batch 1163.2 zu 14.9 und 15.2, Batch 1195.4 ist im Klärungsbedarf erfasst.
- Die Lieferantenthemen aus den Batches 571.1 und 710.2 fehlen im Kapitel 15 und gehören zu Kapitel 11.5 und 11.1.
- Die Schadencodes gehören zum Kapitel 11.4 für den Schadensfall. Die Stammdaten pflegt Kapitel 15.7.
