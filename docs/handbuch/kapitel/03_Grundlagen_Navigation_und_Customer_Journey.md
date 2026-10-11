# 3 Grundlagen, Navigation und Customer Journey

Dieses Kapitel vermittelt die Grundlagen für die Arbeit mit oneSCM. Sie lernen den Aufbau der Startseite und der Hauptnavigation kennen, nutzen Suche und Filter in den Ergebnislisten, erkennen die wiederkehrenden Bedienmuster der Oberfläche und ordnen Ihren Vorgang in den Vertragsprozess von der Preisinformation bis zum aktiven Vertrag ein. Die Abschnitte 3.7 bis 3.9 erläutern, welche angebundenen Systeme Sie in der Oberfläche wahrnehmen, wie Sie Statusangaben richtig lesen und wie sich Sprache und persönlicher Arbeitskontext auf Ihre Anzeige auswirken.

Voraussetzung ist eine erfolgreiche Anmeldung mit einer über ALICE zugewiesenen Rolle für Ihren Markt und Ihre Sparte (Kapitel 2). Die fachlichen Prozesse selbst beschreiben die Kapitel 4 bis 13; die Marktpflege und die HQ-Aufgaben stehen in den Kapiteln 14 und 15.

## 3.1 Startseite und Menü

### Zweck

Die Startseite ist Ihr Einstieg in oneSCM. Sie bietet Schnellaktionen für die häufigsten Aufgaben, Karten mit Verweisen auf angebundene Portale und die Hauptnavigation in der Kopfzeile. Welche Startseite und welche Menüpunkte Sie sehen, hängt von Ihrer Rolle ab.

### Voraussetzungen und Rollen

Sie sind über Single Sign-on angemeldet, und in ALICE ist mindestens eine oneSCM-Rolle für Sie hinterlegt. Händler, Market Operations (MO), Market Product Controller (MPC), Zentrale (HQ) sowie Sonderrollen wie die schreibgeschützte Rolle und die Nacos-Rolle erhalten jeweils einen auf ihre Aufgaben zugeschnittenen Einstieg (Kapitel 2.2 und Anhang D).

### Aufbau der Startseite

Die Händler-Startseite zeigt ein Hintergrundbild und eine persönliche Begrüßung mit Vor- und Nachnamen. Darunter steht die Frage „What do you want to do today? Select a quick action from the ones displayed below:“ mit zwei Schaltflächen:

- „Manage Contract“ öffnet die Startseite der Vertragsverwaltung.
- „Create Contract“ öffnet die Seite für das Vertragsangebot.

Zusätzlich enthält die Startseite Karten (Kacheln). Symbol und Text haben in jeder Karte eine feste Position, auch bei zweizeiligem Text. Neben den Karten für die oneSCM-Bereiche gibt es Karten mit externen Links:

- „Access Xentry Portal“ führt zum Xentry-Portal und wird allen Benutzern angezeigt.
- Ein Link zur OTR-Seite ist analog zur Xentry-Karte auf der Hauptseite verfügbar.
- Händler sehen die Karte „Garantie-Pakete“ (deutsche Oberfläche) beziehungsweise „warranty products“ (englische Oberfläche), die zur externen Webseite der Garantieprodukte führt.

Die Namen und Links der Karten pflegt der Markt in den Markteinstellungen; Benutzer mit MPC-Rolle legen dort fest, welche Karten für Händler und für bestimmte Benutzergruppen wie MPC-MO erscheinen (Kapitel 14.2). Unten rechts zeigt die Anwendung ein Fahrzeugbild (Pkw oder Transporter), das auch auf großen Bildschirmen vollständig dargestellt wird.

### Kopfzeile und Hauptnavigation

Die Kopfzeile enthält die Hauptnavigation, den Benutzernamen (Profil), die GSSN+-ID, das Land und den Bereich für Benachrichtigungen. Die Hauptnavigation ist in dieser Reihenfolge angeordnet:

1. „Contract Generation“ mit den Unterpunkten „Contract Proposal“, „Proposal Management“ und „MO Checks Verification“ (Kapitel 5, 6, 8 und 9).
2. „Contract Management“ für die Verwaltung bestehender Verträge (Kapitel 10).
3. „Customer Management“ für die Kundenübersicht des Marktes (Kapitel 4).
4. „Product Management“ mit den Unterpunkten „Product and Pricing“, „Manage Vehicle Groups“ und „Product Testing“ (Kapitel 14).
5. „Admin Section“ mit den Administrationsfunktionen (Kapitel 14.5).

Links in der Navigationsleiste und die Navigationsschaltflächen im Dashboard öffnen sich in einem neuen Browser-Tab. Ein geöffnetes Flyout schließt sich, wenn Sie außerhalb des Containers klicken. Die Fußzeile mit den Angaben zu Anbieter und Datenschutz sowie den Verweisen „Impressum“, „Datenschutzerklärung“ und „Nutzungsbedingungen“ ist auf allen Seiten sichtbar.

### Schritt für Schritt: Einstieg

1. Melden Sie sich über Single Sign-on an (Kapitel 2.1).
2. Prüfen Sie in der Kopfzeile Benutzername, GSSN+-ID und Land. Diese Angaben zeigen Ihren aktiven Arbeitskontext (Kapitel 3.9).
3. Wählen Sie eine Schnellaktion auf der Startseite oder öffnen Sie den gewünschten Bereich über die Hauptnavigation.
4. Kehren Sie über das oneSCM-Logo oder den Browser-Tab der Startseite zu jedem Zeitpunkt zum Einstieg zurück.

### Besonderheiten je Rolle

- **Händler** sehen die Händler-Startseite mit den Bereichen Vertragsverwaltung, Kundenverwaltung und Vertragserstellung. Kunden legen Sie innerhalb der Vertragserstellung an (Kapitel 4).
- **MO** sehen unter „Customer Management“ alle Kunden ihres Marktes. Auch MO legen Kundendatensätze ausschließlich im Bereich „Contract Generation“ an; die Kundenübersicht enthält keine Schaltfläche zum Anlegen.
- **MPC** gelangen nach der Anmeldung auf das MPC-Dashboard. Sie haben Zugriff auf die Navigationsebene „Product Management“ mit allen Unterpunkten. Die Preispflege beginnt in der Produktliste unter „Product and Pricing“ über das Preisschild-Symbol in der Spalte „Assigned prices“ (Kapitel 14.9).
- **Schreibgeschützte Rolle**: Die Startseite erscheint ohne Fehlermeldung. Im Kopfbereich sind alle Benachrichtigungen sichtbar, die Löschfunktion für Benachrichtigungen ist ausgeblendet.
- **Nacos-Rolle**: Im Menü steht ausschließlich der Punkt „Downloads“ zur Verfügung; andere Seiten sind nicht zugänglich (Kapitel 19.18).

### Hinweise

Der Zustand des Tutorials bleibt zwischen den Sitzungen erhalten. Die in oneSCM gewählte Oberflächensprache gilt im gesamten System (Kapitel 3.9).

### Fehlerbehebung

- Sind für Sie keine Rechte zur Nutzung von oneSCM hinterlegt, zeigt das System die Meldung „Sorry – offenbar ist etwas schief gelaufen!“ mit dem Hinweis „Für Sie sind keine User-Rechte zur Nutzung von oneSCM hinterlegt. Bitte wenden Sie sich an Ihren ALICE-Administrator.“ Beantragen Sie die Rolle über ALICE (Kapitel 2.3 und 2.5).
- Läuft Ihre Sitzung ab, informiert Sie das System in allen Bereichen darüber. Melden Sie sich erneut an.
- Fehlt ein erwarteter Menüpunkt, fehlt die zugehörige Rolle (Kapitel 2.5).

Quellen: Batch 1311.1, 1235.1, 601.3, 938.2, 1260.4, 1309.2, 1310.5, 1134.2, 1278.10, 1188.3, 1249.6, 1302.3, 918.6, 663.1, 672.3, 1308.2, 1315.3

## 3.2 Suche und Filter

### Zweck

Alle Übersichten in oneSCM, etwa Vertragsverwaltung, Angebotsverwaltung, Kundenverwaltung, Produktliste und Vorlagenverwaltung, folgen demselben Such- und Filtermuster. Dieser Abschnitt beschreibt das Muster und die Suchkriterien der wichtigsten Listen. Die Suche liefert nur Vorgänge Ihres eigenen Markt- und Betriebskontextes.

### Aufbau einer Suche

Oberhalb der Ergebnistabelle stehen die Hauptsuchfelder. Weitere Kriterien erreichen Sie über „More Filter“ beziehungsweise „More filters“ oder „Mehr Filter“; es öffnet sich ein Pop-up mit den übrigen Feldern. Im Pop-up übernimmt „Apply“ oder „Filter“ die Eingaben in die Suche, „Cancel“ verwirft sie.

- Mehrere Kriterien sind durch „Und“ verknüpft: Ein Treffer erfüllt alle eingegebenen Kriterien gleichzeitig. Die Filter werden in der Reihenfolge angewendet, in der sie in der Oberfläche stehen.
- Bei Filtern mit Mehrfachauswahl erscheinen die gewählten Werte als Chips. Ein Klick auf das X-Symbol leert die Auswahl; die Suche bleibt weiterhin funktionsfähig. Ändern Sie einen Filter mit Einfachauswahl, bleiben die übrigen Filter unverändert.
- Abhängige Filter bauen aufeinander auf: Eine Auswahl schränkt die Optionen der nachfolgenden Filter ein. Wählen Sie in der Produktliste beispielsweise die Division „Passenger Car“, bietet der Filter „Brand“ nur Marken dieser Division an.
- Textsuchen finden Teilzeichenfolgen: Ein Eintrag wird gefunden, wenn der Suchbegriff an beliebiger Stelle vorkommt. Die Namenssuche liefert Treffer ab drei eingegebenen Zeichen und unterscheidet nicht zwischen Groß- und Kleinschreibung. Platzhalter wie „*“ unterstützt die Suche nicht.
- Führende Leerzeichen entfernt das System aus Eingaben. Verlangt ein Feld eine Mindestanzahl an Zeichen, erscheint die Fehlermeldung erst, wenn Sie das Feld mit zu wenigen Zeichen verlassen.

### Schritt für Schritt: Suche ausführen

1. Geben Sie in die Hauptsuchfelder die bekannten Kriterien ein, zum Beispiel die Referenznummer oder den Kundennamen.
2. Öffnen Sie bei Bedarf „More Filter“, setzen Sie weitere Kriterien und bestätigen Sie mit „Apply“.
3. Starten Sie die Suche mit „Search“ beziehungsweise „Search & Filter“. Sobald ein Suchfeld befüllt ist, startet auch die Eingabetaste die Suche.
4. Prüfen Sie die Ergebnistabelle. Spalten wie „Aktionen“ erreichen Sie über den horizontalen Schieberegler; die Spalte „Actions“ bleibt beim Scrollen rechts fixiert.
5. Mit „Reset“ beziehungsweise „Zurücksetzen“ leeren Sie alle Felder und Filter und stellen den Standardzustand der Seite wieder her.

### Ergebnislisten, Sortierung und Seitennavigation

- Standardmäßig zeigt eine Tabelle zehn Datensätze pro Seite. Über das Auswahlfeld „Entries per page“ wählen Sie 10, 20, 30, 40 oder 50 Datensätze; ab dem 51. Datensatz beginnt die nächste Seite. Die gewählte Anzahl wird nicht gespeichert und steht nach dem Aktualisieren der Seite wieder auf 10.
- Erhöhen Sie die Anzahl pro Seite, springt die Tabelle auf die letzte für diese Anzahl verfügbare Seite statt eine leere Seite anzuzeigen.
- Tabellen sind nach der ersten Spalte sortiert, in der Regel alphabetisch nach dem Namen. Alle Spalten lassen sich auf- und absteigend sortieren.
- Die Gesamtzahl der Treffer wird angezeigt, zum Beispiel „Displaying 10 of 20 documents“.
- „Alle auswählen“ wählt ausschließlich die Datensätze der aktuellen Seite aus.
- Der Schlüsselwert der ersten Spalte, etwa die Referenznummer eines Vertrags oder der Produktname, ist als Hyperlink ausgeführt und öffnet die Detailansicht. Eine separate Aktion „Anzeigen“ gibt es im Aktionsmenü nicht.

### Suchkriterien der wichtigsten Listen

**Vertragserstellung und Vertragsverwaltung.** Die Hauptsuchfelder sind „Reference Number“ (deutsch „Referenznummer“), Kundenname, Fahrgestellnummer und Kennzeichen. Das Kennzeichen erscheint zusätzlich als Spalte, damit Sie Treffer zu Ihrem Kennzeichenfilter nachvollziehen können. Unter „Mehr Filter“ stehen in dieser Reihenfolge „Order Number“, „Status“, „Customer Type“, „VAT ID“ und die übrigen Filter, darunter das Aktivierungsdatum, das auch als Spalte angezeigt wird. Die Ergebnisliste zeigt je Vertrag Referenznummer, Produktname, Fahrgestellnummer, Kundennummer, Kundenname, Erstellungsdatum, Ersteller, Status und Aktion. Die Tabelle der Angebotsverwaltung („Offer Management“) lässt sich ebenfalls auf- und absteigend sortieren.

**Kundenverwaltung.** Die Startseite bietet die Reiter „Privatkunden“ und „Geschäftskunden“ sowie zusätzlich den Filter „Kundentyp“. Im Reiter „Commercial Customer“ suchen MO und MPC nach Gewerbekunden über Name, Debitorennummer, USt-IdNr. („VAT ID“), Postleitzahl und Ort; mindestens Name oder USt-IdNr. ist erforderlich. Beim Öffnen des Reiters ist die Ergebnisseite leer, die Suche starten Sie mit „Search for customers“ (Kapitel 4.2).

**Produktliste.** Der Bereich „Search Products“ enthält das Suchfeld „Product Name“ mit einem X-Symbol zum Löschen der Eingabe. Als Mehrfachauswahl-Filter stehen „Division“, „Brand“, „Blueprint“, „Assigned Prices“ und „Status“ zur Verfügung; die Inhalte stammen aus dem Blueprint. Das Kontrollkästchen „Show deleted products“ schaltet die Anzeige auf ausschließlich gelöschte Produkte um (Kapitel 14.8).

**Vorlagenverwaltung.** Suchfelder sind Vorlagenname (maximal 56 Zeichen), Markt, Vorlagentyp (SEPA, Vertragsbedingungen, Blöcke, Kopfzeile, Fußzeile) und „Verwendet für“ (Vertragsangebot, Vertragsaktivierung); „Weitere Filter“ grenzt nach Division, Marke, Sprache und Service-Contract-Produkt ein (Kapitel 14.4).

**Partner-Management.** Die erweiterte Suche akzeptiert mehrere Suchbegriffe und weitere Filteroptionen (Kapitel 4.7).

### Hinweise

Die Oberfläche greift für Suchen, Sortierung, Seitennavigation und Filter auf einen Suchindex (Elastic Search) zu, der regelmäßig mit den Daten der Fachsysteme abgeglichen wird. Erscheint ein soeben geänderter Datensatz noch nicht in der Liste, laden Sie die Seite kurz darauf erneut.

### Fehlerbehebung

- Liefert die Suche keine Treffer, erscheint anstelle der Ergebnisse ein Hinweis. Prüfen Sie die Schreibweise und entfernen Sie einzelne Filter mit „Reset“.
- Tritt beim Abrufen der Daten ein Fehler auf, zeigt das System eine Hinweismeldung (Toast) mit dem Text „No data available“. Wiederholen Sie die Suche; bleibt der Fehler bestehen, melden Sie ihn mit Suchkriterien und Zeitpunkt über den Supportweg (Kapitel 23.4).

Quellen: Batch 744.2, 852.2, 1059.2, 1081.1, 1114.8, 1106.3, 807.5, 769.4, 744.3, 647.1, 627.3, 1243.2, 506.3, 677.1, 274.4, 26.4, 19.1, 688.4, 663.1, 838.1, 1266.5, 1228.6, 1310.5, 1315.3

## 3.3 Oberflächenelemente und Bedienmuster

### Zweck

oneSCM verwendet in allen Bereichen dieselben Bedienelemente. Wer die Muster kennt, findet sich in jedem Assistenten, jeder Tabelle und jedem Dialog zurecht. Gestaltung und Grafik folgen der Mercedes-Benz Workbench und dem oneSCM-Styleguide.

### Schaltflächen und Symbole

Schaltflächen tragen ein Symbol und zeigen beim Darüberfahren einen Tooltip mit ihrer Bezeichnung:

| Funktion | Symbol | Art | Tooltip (Beispiel) |
|---|---|---|---|
| Abbrechen | X | sekundär | „Cancel“, „Abbrechen“, kontextbezogen „Back to Products“ oder „Back to Prices“ |
| Zurück | < | sekundär | „Back“ |
| Weiter | > | primär | „Next“ |
| Erstellen | Haken | primär | „Create“ |
| Speichern bei ungespeicherten Änderungen | Haken | primär | „Update“ |
| Bearbeiten | Stift | primär oder sekundär je Seite | „Bearbeiten“ |
| Vorschau | Auge | sekundär | „Vorschau“ |
| Veröffentlichen | Haken | primär | „Veröffentlichen“ |

In Tabellen steht die Hauptaktion direkt in der Spalte „Actions“; weitere Aktionen sind im Drei-Punkte-Menü „…“ gruppiert. Gibt es nur eine Aktion, etwa „Löschen“, erscheint sie direkt. Tabellenwerte sind nur dann als Hyperlink formatiert, wenn sie tatsächlich verlinken.

### Assistenten (Wizards)

Mehrstufige Vorgänge wie die Vertragserstellung, die Produktanlage, die Anlage von Fahrzeuggruppen und Kampagnen laufen in Assistenten mit Schrittleiste ab:

1. Ein Schritt gilt als vollständig, wenn alle Pflichtfelder gefüllt sind. Seine Nummer in der Schrittleiste wird dann zu einem blauen Häkchen.
2. Mit „Next“ gelangen Sie zum nächsten Schritt. Das ist erst möglich, wenn alle Pflichtfelder ausgefüllt und validiert sind. Ist ein Pflichtfeld leer, erscheint eine Hinweismeldung (Toast) nach dem Muster „[Feldname] is not filled“, zum Beispiel „IBAN is not filled“ oder „Partner type is not filled“.
3. Mit „Back“ oder per Klick auf eine Schrittnummer wechseln Sie zu einem vollständigen Schritt zurück. Die Zurück-Schaltfläche erscheint ab dem zweiten Schritt.
4. Im letzten Schritt ersetzt die Schaltfläche zum Erstellen die Schaltfläche „Weiter“. Alle Assistenten schließen mit dem Schritt „Overview & Confirmation“ ab; dort prüfen Sie die Zusammenfassung und bestätigen die Anlage.

Im Produktassistenten ist „Save as Draft“ aktiv, sobald das Feld „Product Name“ gültig befüllt ist. Der Klick speichert das Produkt mit den bis dahin erfassten Angaben im Status „Draft“, schließt den Assistenten und führt zur Produktübersicht, auch wenn andere Schritte unvollständig sind. Beim Bearbeiten eines Produkts zeigt das System bei ungespeicherten Änderungen anstelle von „Weiter“ die Speichern-Schaltfläche mit dem Tooltip „Update“; solange sie sichtbar ist, ist die Zurück-Schaltfläche ausgeblendet.

**Abbrechen und ungespeicherte Änderungen.** Haben Sie nichts geändert, schließt „Cancel“ den Assistenten direkt. Haben Sie mindestens ein Feld geändert, fragt ein Dialog nach:

- In den Assistenten des Produktmanagements lautet der Dialog „You have unsaved changes!“ mit der Meldung „If you close the process, you will lose all the changes you have made. Are you sure you want to close?“. „Yes“ beendet den Vorgang und verwirft die Änderungen, „No“ schließt nur den Dialog.
- In der Vertragserstellung lautet der Dialog „You have unsaved changes that will be lost. The changes you have made will not be updated and they will be lost. Are you sure you want to proceed?“. „Cancel“ führt zur aktuellen Seite zurück, „Proceed“ verwirft die Änderungen und führt zur Startseite (Landing Page).

### Eingabefelder und Validierung

- Pflichtfelder sind gekennzeichnet; ohne sie bleibt die weiterführende Schaltfläche deaktiviert.
- In allen Formularen sendet die Eingabetaste das Formular ab.
- Datumsfelder wählen Sie über einen Kalender. Ein Erstzulassungsdatum darf nicht in der Zukunft liegen; bei Tastatureingabe eines in der Zukunft liegenden Datums erscheint „First Registration Date cannot be in future“, und die bestätigende Schaltfläche bleibt deaktiviert.
- Das Kennzeichenfeld („License Plate“) akzeptiert bis zu 11 alphanumerische Zeichen einschließlich deutscher Sonderzeichen und Bindestrich an beliebiger Stelle; Eingaben wandelt das System in Großbuchstaben um. Ist der Schalter „FRD unavailable“ aktiv, blendet das System das Kennzeichenfeld aus, weil ein nie zugelassenes Fahrzeug kein Kennzeichen hat.
- Schalter (Toggles) aktivieren optionale Angaben oder Automatiken, etwa die systemgenerierte Benennung von Fahrzeuggruppen (Kapitel 14.11).
- Mehrfachauswahl-Dropdowns zeigen gewählte Werte als Chips; das X-Symbol leert die Auswahl.
- Fehlerhafte Eingaben meldet das System beim Verlassen des Feldes, nicht während der Eingabe.

### Meldungen und Dialoge

- Hinweismeldungen (Toasts) erscheinen am Bildschirmrand. Fehlermeldungen blenden sich nach neun Sekunden automatisch aus, wenn Sie sie nicht selbst schließen; versuchen Sie trotz des Fehlers fortzufahren, erscheint die Meldung bei jedem Versuch erneut.
- Meldungen mit der Schaltfläche „Close“, etwa „Tax <Name> could not be deleted.“, bleiben sichtbar, bis Sie sie schließen.
- Löschvorgänge bestätigen Sie in einem Dialog mit dem Titel „Delete …“ (zum Beispiel „Delete Product“, „Delete Tax Rate“). Der Dialog weist darauf hin, dass die Aktion nicht rückgängig gemacht werden kann. „Cancel“ bricht ab, „Delete“ führt die Löschung aus. Im Erfolgsfall erscheint eine Bestätigung wie „Tax <Name> was successfully deleted“.
- Läuft Ihre Sitzung ab, informiert Sie das System in allen Bereichen.

### Tabellen und Detailansichten

- Die Spalte „Actions“ bleibt beim horizontalen Scrollen rechts fixiert.
- Leere Tabellen zeigen einen Leerzustand; beim Anlegen einer Van-Fahrzeuggruppe erscheinen in Schritt 2 beide Tabellen mit ihrem jeweiligen Leerzustand.
- Warnsymbole am Ende eines Eintrags, etwa bei Branchenzuschlägen, sind unabhängig von der Textlänge sichtbar.
- Detailansichten aktualisieren sich automatisch, wenn sich der Vertragsstatus oder ein Vertragsdetail ändert; ein Neuladen des Browsers ist nicht nötig. Beispielsweise erscheint ein Eintrag in der Historie nach dem Aussetzen („Suspend“) eines Vertrags sofort.
- Tooltips erscheinen beim Darüberfahren mit der Maus; auf mobilen Geräten öffnen Sie sie durch Antippen.

### Preisanzeige

Bei Privatkunden (B2C) zeigt die Oberfläche Bruttopreise und beim Darüberfahren die Nettopreise. Bei Geschäftskunden (B2B) zeigt sie Nettopreise und beim Darüberfahren die Bruttopreise. Das gilt für Produktdetailansicht, Produktvergleich, Rabattanzeige, Übersicht und Bestätigung sowie die Verlängerung.

### Einheitliche Bezeichnungen

Die Oberfläche verwendet in Vertragserstellung und Vertragsverwaltung einheitliche Begriffe: „First Registration Date“ anstelle der Abkürzung „FRD“, „Model“ anstelle von „Sales Designation“ (auch in den permanenten Kopfzeilen), „Reference Number“ beziehungsweise „Referenznummer“ für die Vertragskennung, „Reference“ auf der Detailseite, „Customer Type“ bei den Forderungen aus dem FI-System und den Reiter „Payment“ für die Zahlungsdaten. In der Vertragshistorie heißt der Vorgang beim Erstellen, Aktivieren oder Ablehnen eines Vertrags „Antrag“. Zwischen einem Wort und einer folgenden Klammer steht ein Leerzeichen.

Quellen: Batch 1266.2, 398.2, 229.7, 1266.5, 929.12, 783.6, 1241.2, 1034.4, 1035.2, 1036.3, 1308.3, 1310.5, 1315.3, 1012.2, 1079.2, 1107.1, 274.4, 524.1, 279.3, 1237.2, 929.1, 1253.6, 807.5, 1113.3, 1021.4, 26.5, 506.8, 668.4, 680.5, 683.5, 999.6, 1013.6, 1014.7, 1017.8, 1036.4, 1238.4, 1239.6, 1243.4, 869.8, 903.9, 981.3, 218.8, 836.7, 976.10

## 3.4 Prozesslandkarte

Die Prozesslandkarte ordnet die Kapitel dieses Handbuchs dem Lebenszyklus eines Servicevertrags zu. Der Prozess beginnt mit der Kundenanlage oder Kundenzuordnung (Kapitel 4), führt über die Fahrzeugidentifikation, Produktauswahl und Preisinformation (Kapitel 5) zur Antragserstellung mit Zahlungsdaten und Unterschrift (Kapitel 6 und 7), zur Aktivierung (Kapitel 8) und zu den fachlichen Prüfungen der MO-Rolle (Kapitel 9). Danach folgen die laufende Vertragsverwaltung (Kapitel 10), Rechnung und Finanzfolgen (Kapitel 11) sowie die Sonderprozesse für Geschäftskunden, Flotten und Reifenprodukte (Kapitel 12 und 13). Markt- und HQ-Rolle stellen mit Produkten, Preisen, Vorlagen und Blueprints die Grundlage bereit (Kapitel 14 und 15).

In der Oberfläche spiegelt sich diese Reihenfolge in der Hauptnavigation: „Contract Generation“ deckt die Phasen bis zur Aktivierung ab, „Contract Management“ die Verwaltung, „Customer Management“ und „Product Management“ die Stammdaten. Die grafische Prozesslandkarte mit Teilprozessen finden Sie in Anhang C; Lesepfade je Rolle enthält der Vorspann (V.2).

Material: keine Quellen in den RAG-Batches

## 3.5 Preisinformation, Angebot, Antrag und Vertrag

### Zweck

Ein Servicevertrag durchläuft in oneSCM vier Stufen: die unverbindliche Preisinformation, das Vertragsangebot, den gespeicherten Antrag und den aktivierten Vertrag. Dieser Abschnitt ordnet die Stufen ein und verweist auf die Prozesskapitel mit den Einzelschritten.

### Voraussetzungen und Rollen

Die Stufen Preisinformation, Angebot und Antrag bearbeiten Händler, MO und MPC im Bereich „Contract Generation“. Die Aktivierung und die anschließende Verwaltung erfolgen in „Contract Management“ (Kapitel 8 und 10).

### Die vier Stufen

1. **Preisinformation.** Nach Eingabe einer Fahrzeug- oder Vorgangskennung ruft die Produktauswahl passende Produkte mit Preisen, Konfigurationen sowie enthaltenen und optionalen Deckungen ab. Zwei oder drei Produkte stellen Sie in einer Vergleichstabelle gegenüber; optionale Deckungen erscheinen dort mit einem „ab“-Preis und lassen sich direkt auswählen. Die Preisinformation ist unverbindlich und erzeugt keinen Vorgang (Kapitel 5.4 und 5.6).
2. **Angebot.** Mit „Auswählen“ öffnen Sie die Produktdetailansicht mit vorbelegten Konfigurationsfeldern. Das Preisangebot versenden Sie per E-Mail aus der Produktdetailansicht oder aus dem Vergleich; im Angebotsdialog wählen Sie die Sprache aus den Marktsprachen (Kapitel 5.6 und 7.4). Über „Create Contract“ auf der Startseite gelangen Sie direkt zur Seite des Vertragsangebots („Contract Proposal“).
3. **Antrag.** Der Assistent der Vertragserstellung führt über die Produktauswahl, die Kunden- und Zahlungsinformationen („Customer & Payment Information“ mit den Abschnitten „Receivables from FI System“ und „Tax & Legal Details“) zur Übersicht und Bestätigung („Overview & Confirmation“, „Data & Documents Preview“). Mit der Bestätigung entsteht der Antrag im Status „Created“; die Historie führt den Vorgang unter dem Titel „Antrag“. Unterschrift und Dokumente folgen in Kapitel 7, die Verwaltung gespeicherter Anträge in „Proposal Management“ (Kapitel 8.1).
4. **Vertrag.** Nach Unterschrift und Vervollständigung der Daten wechselt der Antrag in „Waiting for Activation“. Das System ruft in diesem Status die SAP-Debitorennummer und die Gültigkeit des SEPA-Mandats ab und berechnet die Vertragslaufzeit aus Erstzulassungsdatum und Vertragsdauer. Nach erfolgreicher Prüfung ist der Vertrag „Active“; ein abgebrochener Aktivierungsversuch führt zum Status „Rejected“ (Kapitel 8). Aktive Verträge verwalten Sie in „Contract Management“, etwa für Zahlerwechsel, Anpassungen der Laufzeit und Laufleistung oder Kommunikation mit dem Kunden (Kapitel 10).

### Ergebnis und Systemstatus

Jede Stufe hat einen eigenen Status; die Übergänge und ihre Bedeutung erläutert Kapitel 3.8. Dokumente und Benachrichtigungen zu einem Vertrag ab dem Status „Created“ finden Sie im Tab „Communication“ der Vertragsdetails (Kapitel 10.1).

### Hinweise

Ein grüner Haken in der Schrittleiste bestätigt nur den vollständigen Schritt. Verbindlich ist erst der Vertragsstatus „Active“ nach Prüfung und Aktivierung.

Quellen: Batch 929.1, 991.1, 1104.1, 1311.1, 1249.6, 1036.3, 1113.3, 524.1, 1012.2, 1059.2, 838.1, 836.1, 765.4

## 3.6 Lead und CRM-Übergabe

Leads aus dem CRM-System der Vertriebsorganisation bilden den Einstieg in die Customer Journey, bevor in oneSCM eine Preisinformation oder ein Angebot entsteht. Händler übernehmen die Kundendaten eines Leads in die Kundenanlage (Kapitel 4) und erstellen daraus Angebot und Antrag (Kapitel 5 und 6). Ergebnisse wie ein versendetes Angebot oder ein aktivierter Vertrag fließen an die vertriebliche Nachverfolgung zurück. Welche Daten oneSCM mit dem CRM austauscht und über welchen Weg, beschreibt Kapitel 19.

Material: keine Quellen in den RAG-Batches

## 3.7 Schnittstellen und Systemübergaben

### Zweck

oneSCM arbeitet mit mehreren Umsystemen zusammen. Dieser Abschnitt zeigt, an welchen Stellen Sie diese Übergaben in der Oberfläche wahrnehmen. Die technischen Steckbriefe der Schnittstellen stehen in Kapitel 19, die Fehlerbehandlung in Kapitel 19.22 und 23.

### Systemübergaben im Arbeitsablauf

- **ALICE** stellt Ihre Berechtigungen und Ihre bevorzugte Sprache bereit. Fehlen Rechte, verweist die Fehlermeldung auf den ALICE-Administrator (Kapitel 2 und 19.16).
- **Xentry-Portal und OTR** erreichen Sie über die Karten auf der Startseite. OTR-Deal-IDs dienen als Fahrzeug- und Vorgangskennung beim Einstieg in die Vertragserstellung (Kapitel 5.2 und 19.5).
- **FI-System (SAP, oneERP)**: Im Status „Waiting for Activation“ ruft oneSCM die SAP-Debitorennummer und die Gültigkeit des SEPA-Mandats ab. Die Kundenübersicht zeigt den Status des Kunden im FI-System; die Vertragserstellung enthält den Abschnitt „Receivables from FI System“. Ein Zahlerwechsel ist erst wieder möglich, wenn die CAS-, SAP- und SEPA-Prüfungen des vorherigen Wechsels beendet sind (Kapitel 10.3 und 19.11).
- **i155-Datei**: Angepasste Verträge, etwa nach einer Laufzeit- oder Laufleistungsänderung, nimmt das System in die nächste erzeugte i155-Datei auf. Texte für i155 werden in der Marktsprache hinterlegt (Kapitel 19.9).
- **VEGA**: Auf Werkstattrechnungen zeigt oneSCM die Beschreibung des gewählten VEGA-Schadencodes in Ihrer Oberflächensprache; gespeichert werden Kennung und Beschreibung in der Standardsprache des Marktes (Kapitel 11.5 und 19.9).
- **Nacos**: Für den deutschen Markt erzeugt oneSCM Customer-Export-Dateien, die Benutzer mit der Nacos-Rolle über den Menüpunkt „Downloads“ abrufen (Kapitel 19.18).
- **Produktmanagement an Vertragserzeugung**: Beim Veröffentlichen eines Produkts oder einer Kampagne übergibt das Produktmanagement ein Datenpaket mit den Inhalten je Sprache an die Vertragserzeugung. Die Vertragserstellung wird nie blockiert, weil Übersetzungen fehlen (Kapitel 3.9 und 14.8).
- **Leasing über den EDGE-Service**: Leasingverträge entstehen über die Leasing-Schnittstelle, nicht über die Retail-Oberfläche; das Feld „Sales Channel“ am Vertrag weist den Vertriebskanal aus (Kapitel 19.21).

### Hinweise

Die Oberfläche greift über einen Suchindex auf die Daten der Fachsysteme zu, der regelmäßig aktualisiert wird (Kapitel 3.2). Bei Störungen einer Übergabe melden Sie Referenznummer, Kennung, Zeitpunkt und Fehlermeldung über den Supportweg (Kapitel 23.4 und 23.5).

Quellen: Batch 1308.2, 1309.2, 918.6, 601.3, 1012.2, 836.1, 688.4, 1036.3, 765.4, 975.3, 694.2, 663.1, 1121.5, 864.6, 863.6, 1228.6

## 3.8 Statusinformationen richtig einordnen

### Zweck

oneSCM führt getrennte Statusangaben für Verträge, Kunden, Produkte, Preise und Kundenkommunikation. Dieser Abschnitt erläutert, welche Angabe was bedeutet, damit Sie den Stand eines Vorgangs richtig einschätzen. Die vollständige Statusübersicht mit zulässigen Übergängen steht in Kapitel 8.2 und in Anhang D; das Statusmodell der Verträge ist im Dokument „Contract Status Model“ der Projektdokumentation beschrieben.

### Vertragsstatus

- „Created“: Der Antrag ist gespeichert. Ab diesem Status sind Dokumente und Benachrichtigungen im Tab „Communication“ sichtbar.
- „Waiting for Activation“: Alle Daten für die Aktivierung liegen vor; das System ruft Debitorennummer und SEPA-Mandat ab. In diesem Status sind Vertragsstartdatum (Reiter „Contract“) und Erstzulassungsdatum (Reiter „Vehicle“) für keinen Benutzer mehr editierbar.
- „Active“: Der Vertrag ist aktiviert und verbindlich.
- „Rejected“ („Abgelehnt“): Die Aktivierung wurde abgebrochen oder abgelehnt; der Vorgang ist auf der Registerkarte „History“ nachvollziehbar.
- „Suspended“ (ausgesetzt), „Vorzeitig beendet“ und „Abgelaufen“ sowie „abgelaufen nach Laufleistung“ kennzeichnen die Beendigungsformen (Kapitel 10.4 und 10.6).

Das Status-Dropdown eines Vertrags bietet nur die im aktuellen Status zulässigen Aktionen an, etwa „Change Payer“ oder „Contract Adaptation“ bei aktiven Verträgen.

### Kundenstatus

Kunden haben die Status „Temporary“, „In Confirmation“, „Active“ und „Inactive“. Die Kundenübersicht zeigt zusätzlich den Status des Kunden im FI-System (Kapitel 4.3).

### Produkt- und Preisstatus

- Produkte durchlaufen die Status „Draft“, „Created“, „Ready“, „Published“, „Deactivated“ und „Deleted“. Gelöschte Produkte erscheinen nur bei aktiviertem Kontrollkästchen „Show deleted products“ und lassen sich weder bearbeiten noch für die Vertragserstellung auswählen (Kapitel 14.8).
- Der Filter „Assigned Prices“ unterscheidet „Draft Products – No prices possible“, „Ready Products – No prices assigned“ und „Prices assigned“. Ist für ein Produkt keine Preisgültigkeit aktiv, erscheint das Preisschild-Symbol in der Spalte „Assigned prices“ ausgegraut („Ghost“-Zustand), bleibt aber klickbar (Kapitel 14.9).

### Status der Kundenkommunikation

Im Unterregister „Notifications“ des Tabs „Communication“ hat jede E-Mail einen Status: „Sent“ bei erfolgreichem Versand, „Fail“ bei fehlgeschlagenem Versand und „Expired“, wenn eine E-Mail zur digitalen Signatur nicht geöffnet wurde und die Signaturfrist abgelaufen ist. Bei „Failed“ und „Expired“ steht die Aktion „Re-send“ zur Verfügung (Kapitel 7.5 und 10.1).

### Hinweise

- Antragsstatus, Signaturstatus und Vertragsstatus sind getrennte Größen. Ein vollständiger Schritt im Assistenten oder ein versendetes Dokument bedeutet nicht, dass der Vertrag aktiv ist.
- Statusbezeichnungen erscheinen in Ihrer Oberflächensprache; der Standardgrund („Default Reason“) in Statusdialogen folgt einem Sprachwechsel sofort (Kapitel 3.9).

Quellen: Batch 1021.4, 1012.2, 1059.2, 1058.5, 838.1, 1113.3, 771.6, 1237.2, 1243.2, 1235.1, 672.3, 688.4, 836.1, 765.4, 796.4

## 3.9 Persönlicher Arbeitskontext und Sprachen

### Zweck

Ihr Arbeitskontext besteht aus Markt, Sparte, Betrieb (GSSN+-ID) und Rolle; er bestimmt, welche Daten Sie sehen. Die Sprache bestimmt, in welcher Sprache Oberfläche, Inhalte und Kundendokumente erscheinen. oneSCM trennt dabei die Oberflächensprache des Benutzers von der Sprache der Inhalte und Dokumente.

### Arbeitskontext

Die Kopfzeile zeigt Benutzername, GSSN+-ID und Land. Sie arbeiten im Markt, für den Ihre Rolle berechtigt ist; Suchen und Listen liefern nur Daten dieses Marktes. Mehrere Märkte oder Sparten erfordern mehrere Rollenzuordnungen in ALICE (Kapitel 2.4).

### Anzeigesprache der Oberfläche

Die Oberflächensprache ergibt sich aus einer festen Reihenfolge:

1. Beim ersten Aufruf von oneSCM gilt die in ALICE hinterlegte bevorzugte Sprache.
2. Ist diese in oneSCM nicht verfügbar, gilt die Sprache des Browsers.
3. Steht auch diese nicht zur Verfügung, erscheint die Anwendung auf Deutsch.
4. Bei jedem weiteren Aufruf gilt zuerst die zuletzt in oneSCM gewählte Sprache, danach dieselbe Reihenfolge.

Die gewählte Sprache ist im gesamten System vorausgewählt. Zur Auswahl stehen die Sprachen, die der Markt in den Markteinstellungen unter „Market Settings“ › „Market Config“ › „General Settings“ › „Format“ › „Languages“ festgelegt hat (Kapitel 14.2). Jeder Markt hat genau eine Standardsprache; alle weiteren Sprachen sind optional.

### Oberflächensprache und Kundensprache

In „Contract Generation“ und „Contract Management“ zeigt die Oberfläche Platzhalter, Beschreibungen, Bezeichnungen und Deckungen in Ihrer Oberflächensprache. Dokumente und Benachrichtigungen an den Kunden erzeugt und versendet das System in der Sprache, die auf Kundenebene hinterlegt ist. Zwei Ausnahmen gelten:

- Beim Drucken eines Angebots entsteht das Dokument in Ihrer Oberflächensprache.
- Beim Versenden eines Angebots per E-Mail wählen Sie die Sprache im Feld „Sprache“ des Angebotsdialogs aus den Marktsprachen; vorbelegt ist Ihre Oberflächensprache. Im B2C-Fall folgen die Felder Vorname, Nachname, E-Mail-Adresse und Sprache; im B2B-Fall Vorname und Nachname der Kontaktperson, Firmenname, E-Mail-Adresse und Sprache.

Beispiel: Ein Händler arbeitet mit englischer Oberfläche und erstellt einen Servicevertrag für einen Kunden mit bevorzugter Sprache Deutsch. Die Bedienung erfolgt auf Englisch, alle Benachrichtigungen und Dokumente an den Kunden auf Deutsch. Umgekehrt gilt dasselbe. Texte für i155 werden unabhängig davon in der Marktsprache ausgegeben.

Fehlt eine Übersetzung in der angeforderten Sprache, verwendet das System die Standardsprache des Marktes als Rückfallebene. Die Vertragserstellung wird nie blockiert, weil Übersetzungen fehlen. Beschreibungen von VEGA-Schadencodes auf Werkstattrechnungen erscheinen in Ihrer Oberflächensprache und wechseln mit ihr; ist keine Übersetzung vorhanden, zeigt das System die auf der Rechnung gespeicherte Beschreibung. Der Standardgrund („Default Reason“) in Statusdialogen wird bei einem Sprachwechsel aktualisiert.

### Marktbezeichnungen und Formate

Die Oberfläche zeigt Marktbezeichnungen in der Sprache, die in den Markteinstellungen gewählt ist; bei Deutsch erscheint beispielsweise „Deutschland“ statt „Germany“. Das gilt für die Marktspalte der Tabellen, die Detail- und Zusammenfassungsansichten sowie für den zweiten Schritt der Anlage von Coverage Codes und Industry Codes (Kapitel 14.2 und 15.7).

Datum, Uhrzeit, Namensreihenfolge, Währung und Dezimalstellen werden nach den Formateinstellungen des Marktes dargestellt (Reiter „Format“ der „General Settings“). Voreingestellt sind das 24-Stunden-Format, das Datumsformat DD MM YYYY mit Punkt als Trennzeichen, die Namensreihenfolge „Vorname, Nachname“ und das Währungsformat 1.234.567,89 mit zwei Dezimalstellen. Datumsangaben in den Vertragsdetails, etwa „Created On“, folgen diesen Einstellungen. Zeitstempel im Tab „Communication“ sind in UTC angegeben.

### English (support mode)

Für Support- und Administrationsbenutzer steht in den Spracheinstellungen die Option „English (support mode)“ zur Verfügung. Reguläre Markt- und Händlerbenutzer sehen sie nicht.

1. Aktivieren Sie den Support-Modus in den Spracheinstellungen.
2. Bildschirmtitel, Menüeinträge, Schaltflächen und Feldbezeichnungen erscheinen auf Englisch. Ein dauerhaft eingeblendeter Hinweis auf jeder Seite zeigt, dass der Modus aktiv ist.
3. Alle Geschäftsdaten, erzeugten Dokumente, E-Mails und kundensichtbaren Verträge bleiben in der Marktsprache; englische Oberflächentexte gelangen nicht in Dokumente. Beim Bearbeiten und Speichern bleiben sprachabhängige Feldwerte und Auswahllistenwerte in der Marktsprache erhalten.
4. Schalten Sie den Modus zu jedem Zeitpunkt aus, auch mitten in einem Arbeitsablauf. Die Oberfläche kehrt sofort zur gewählten Marktsprache zurück, der Hinweis verschwindet, und Ihr Arbeitsfortschritt bleibt erhalten.

Der Support-Modus wirkt nur für den jeweiligen Benutzer. Hat ein Markt Englisch in seiner Sprachliste abgewählt, bleibt Englisch als reine Oberflächensprache verfügbar; Inhalte erscheinen dann in der Standardsprache des Marktes, und der Markt pflegt keine englischen Dokumentvorlagen.

### Besonderheiten je Rolle

- **Markt (MPC)**: Fügt der Markt in den Markteinstellungen eine Sprache hinzu, weist ein Hinweistext darauf hin, dass Produkte, E-Mail-Vorlagen, Dokumentvorlagen und Geschäftsbedingungen in dieser Sprache zu ergänzen sind; andernfalls erscheint eine Fehlermeldung, die die fehlende Sprache nennt, zum Beispiel „language DE missing“ (Kapitel 14.2 und 14.8).
- **Marktverantwortliche mit Lokalisierungsrolle** pflegen die Übersetzungen der Oberflächenbezeichnungen ihres Marktes über die Funktion „Market Translation“; Änderungen werden beim Neustart des jeweiligen Dienstes wirksam (Kapitel 14.2).

### Fehlerbehebung

- Erscheint die Oberfläche in einer unerwarteten Sprache, prüfen Sie die zuletzt gewählte Sprache in oneSCM, die bevorzugte Sprache in ALICE und die Browsersprache.
- Erscheint ein Begriff in einer anderen Sprache als der Rest der Oberfläche, fehlt die Übersetzung für Ihre Sprache; das System zeigt dann die Standardsprache. Melden Sie den Begriff mit Bildschirmbild über den Supportweg (Kapitel 23.3).

Quellen: Batch 1308.2, 1309.2, 523.1, 975.3, 1104.1, 1128.5, 1121.5, 694.2, 796.4, 989.2, 918.6, 838.1, 529.1, 1252.4, 1311.1, 524.1, 1092.4, 807.5

## Verschiebung in andere Kapitel

Folgende Abschnitte des Materials gehören inhaltlich in andere Kapitel und sind dort zu verwenden:

- Kapitel 4.1 Privatkunden und Geschäftskunden: Filter „Kundentyp“ neben den Reitern der Kundenverwaltung (Batch 627.3).
- Kapitel 4.2 Vorhandene Kunden suchen und zuordnen: Gewerbekundensuche im Reiter „Commercial Customer“ im Detail (Batch 647.1); Kundenübersicht mit Spalten und FI-System-Status (Batch 688.4).
- Kapitel 4.3 Kundendaten und Pflichtangaben prüfen: Kundenanlage nur über „Contract Generation“, kein Löschen von Kunden (Batch 672.3).
- Kapitel 4.7 Partner- und Dealerbeziehungen: erweiterte Suche im Partner-Management (Batch 677.1).
- Kapitel 4.8 Dealer-Onboarding und Partnerprozess: Händlerverwaltung, Markttyp, Ländercode-ID, Datei-Upload (Batch 621.5).
- Kapitel 5.2 Fahrzeug- und Vorgangskennungen: geprüfte Eingabeszenarien für Fahrgestellnummer, Auftragsnummer und Baumuster (Batch 948.5).
- Kapitel 5.4 Produkte und Leistungsumfang auswählen: Produktvergleich mit optionalen Deckungen im Detail (Batch 991.1); strenge Branchenfilterung und Meldung „No Industry was selected / Not relevant“ (Batch 1160.5); Kontingentprodukte ohne Verlängerung und Vertragsprüfung (Batch 976.10).
- Kapitel 6.2 Vertragsdaten und Pflichtfelder erfassen: Kennzeichenfeld mit 11 Zeichen und Bindestrich (Batch 1079.2); Schalter „FRD unavailable“ (Batch 1107.1).
- Kapitel 6.6 Übersicht und Abschlusskontrolle: Angleichung von Schritt 3 an Schritt 2, Pflichtfeld Festnetznummer, entfallene Felder für den Markt DE (Batch 1113.3).
- Kapitel 7.1 Zahlungsarten und Zahlungsintervalle: Übersetzung „Einmalzahlung“ für „One Time“ (Batch 512.2).
- Kapitel 7.4 Vertragsdokumente und Sprachvarianten: Sprachauswahl im Angebotsdialog, Dokumente in der Kundensprache (Batch 1104.1, 975.3).
- Kapitel 7.5 Digitale Unterschrift: Option „E-Mail senden“ im letzten Schritt des Angebotsassistenten (Batch 783.6); Status „Expired“ und „Re-send“ für Signatur-E-Mails (Batch 838.1).
- Kapitel 8 Aktivierung / 10.2: Aktion „Update“ für „Build to Stock“-Verträge mit Erstzulassungsdatum und Kennzeichen, Statuswechsel zu „Waiting for Activation“ (Batch 1012.2, 1058.5).
- Kapitel 10.1 Verträge suchen und Details prüfen: Tab „Communication“ mit Unterregistern „Documents“ und „Notifications“ (Batch 838.1); Startseite der Vertragsverwaltung (Batch 852.2); Ergebnisliste der Verträge (Batch 744.3).
- Kapitel 10.3 Zahlerwechsel und Vertragsübertragung: „Change Payer“ für MO bei aktiven Verträgen (Batch 836.1).
- Kapitel 10.5 Verlängerung: „Contract Adaptation“ mit neuer Laufzeit und Fahrleistung für Leasing (Batch 765.4); Prüfung des Wirksamkeitsdatums (Batch 769.7).
- Kapitel 10.9 Laufleistung, Kilometerstandshistorie und Prognose: gemeinsame Kilometerstandshistorie bei mehreren Verträgen je Fahrzeug (Batch 763.7).
- Kapitel 11.4 Kostenmanagement und Claims: Startseite der Kostenverwaltung (Cost & Contract Management) (Batch 744.1).
- Kapitel 11.5 Werkstatt- und Lieferantenbezüge: Schadencode-Beschreibung auf Werkstattrechnungen, Anlage je Division (Batch 694.2); Formularservice für Workshop-Rechnungen (Batch 1309.2).
- Kapitel 14.2 Marktspezifische Einstellungen: Kacheln und Links der Startseite in den Markteinstellungen (Batch 938.2); Reiter „Format“ der General Settings im Detail (Batch 989.2); Sprachen hinzufügen und weich löschen (Batch 1121.4, 1252.4); „Market Translation“ und Configuration Service (Batch 529.1); Fehlerkorrekturen in den Markteinstellungen (Batch 515.2).
- Kapitel 14.4 Vorlagenverwaltung und Template Management: Suche in der Vorlagenverwaltung (Batch 506.3); Berichtsvorlagen mit Berichtstyp und „Report Design“ (Batch 359.2); Schaltflächen „Vorschau“ und „Veröffentlichen“ (Batch 398.2).
- Kapitel 14.5 Administrationsbereich: Steuersatz löschen (Batch 279.3); Spalte „Name“ der Steuerverwaltung ohne Hyperlink, Aktion „Löschen“ bei internationalen Werkstattrechnungen (Batch 229.7); Seitennavigation und Feld „Engine Series“ in der Fahrzeugverwaltung (Batch 19.1); Übersetzungen „Health Check“ und „Family Tag“ (Batch 524.1).
- Kapitel 14.8 Produktdefinition, Anlage und Veröffentlichung: Produktsuche und Filter (Batch 1243.2); Produkt löschen, Soft Delete und Hard Delete (Batch 1237.2); Spalte „Produktname“ als Hyperlink (Batch 1266.5); „Save as Draft“ im Produktassistenten (Batch 1241.2); Sprachreiter je Marktsprache (Batch 1128.1, 1128.2, 1128.5, 1121.5); Produkt anlegen und aktivieren (Batch 5.5); Übergabe des Datenpakets an die Vertragserzeugung (Batch 1121.5).
- Kapitel 14.9 Preisversionen, Cluster und Faktorgrenzen: Einstieg über „Assigned prices“ und Preisversionsübersicht (Batch 1235.1); Preismatrix für Kontingentprodukte (Batch 1217.1); Warnsymbol bei „Industry Surcharges“ (Batch 1253.6).
- Kapitel 14.11 Fahrzeuggruppen und Van-Baumuster-Clustering: Leerzustände beider Tabellen in Schritt 2 (Batch 1253.6); Filter-Reset, Tabelle der nicht zugeordneten Fahrzeuggruppen, Motorbaureihen (Batch 7.5).
- Kapitel 15.7 Technical Options, SA-Matching, Coverage- und Industry-Codes: marktspezifische Übersetzungen für Schadencodes (Batch 118.1); Validierung beim Import von Schadencodes (Batch 723.3); Gesamtanzahl der Schadencodes (Batch 712.2); Suche auf der Seite der TO-Gruppen (Batch 1260.4).
- Kapitel 16.4 Testnachweise und produktiver Funktionsstand: marktfähige UI-Tests und Quality Dashboard (Batch 524.1); Smoke-Tests der Vertragsverwaltung (Batch 533.1); Erweiterung der Testsuite zur Fehleranalyse (Batch 1296.1); Testdaten in der Entwicklungsoberfläche (Batch 1223.4); Mehrfachaktivierung je Fahrgestellnummer in der Vorproduktionsumgebung (Batch 1309.2).
- Kapitel 19.11 oneERP / 19.21 Technische Integrationswege: Feld „Sales Channel“ und Leasing-Backend (Batch 864.6); Abgrenzung der Leasing-API (Batch 863.6); Header „x-lang“ für Backend-Meldungen und externe Organisations-ID (Batch 1314.4).
- Kapitel 19.18 Weitere Systeme und Dienste: Download-Funktion für Nacos-Benutzer im Detail (Batch 663.1); Elastic-Search-Instanz (Batch 1228.6).
- Kapitel 22.2 (Ausblick und Weiterentwicklung, offene Anforderungen): Untersuchung zur Signatur vor Ort und KI-Übersetzungen für Vorlagen (Batch 353.7); konfigurierbare Darstellung von Datum, Uhrzeit und Währung je Kunde und Team (Batch 1315.3); zweite Phase der marktspezifischen Schadencode-Uploads (Batch 118.1).

## Klärungsbedarf

- Reihenfolge und Zuschnitt der Hauptnavigation: Batch 1249.6 führt „MO Checks Verification“ als eigenständigen Reiter zwischen „Contract Generation“ und „Contract Management“, Batch 1302.3 ordnet den Punkt unter „Contract Generation“ ein, Batch 1310.5 nennt die Reihenfolge Contract Generation, Contract Management, Customer Management, Product Management, Admin Section. Der Text folgt den Batches 1302.3 und 1310.5; die gültige Menüstruktur ist am System zu prüfen.
- Auslösen der Suche per Eingabetaste: Batch 744.2 und 1059.2 beschreiben, dass die Eingabetaste die Suche startet; Batch 1081.1 beschreibt für die Namenssuche auf der Startseite der Vertragserstellung, dass die Suche nicht per Eingabetaste, sondern ab drei Zeichen automatisch läuft. Zu klären, welche Listen welches Verhalten zeigen.
- Groß- und Kleinschreibung in Suchen: Batch 1081.1 (Namenssuche ohne Unterscheidung) und Batch 1260.4 (Suche der TO-Gruppen mit Unterscheidung) widersprechen sich im Muster.
- Verhalten von „X“ in Assistenten: Batch 783.6 beschreibt, dass „X“ den Angebotsassistenten schließt und die Konfiguration für eine spätere Fortsetzung speichert; Batch 1266.2 und 1241.2 beschreiben „X“ als Abbrechen mit Verwerfen der Änderungen. Zu klären, ob der Angebotsassistent Konfigurationen zwischenspeichert.
- Dialogtexte bei ungespeicherten Änderungen unterscheiden sich zwischen Produktassistent („You have unsaved changes!“, Yes/No, Batch 1241.2) und Vertragserstellung („You have unsaved changes that will be lost …“, Cancel/Proceed, Batch 1034.4, 1035.2, 1036.3). Zu klären, ob eine Vereinheitlichung vorgesehen ist.
- Produktvergleich: Batch 929.12 nennt den Produktvergleich im Frontend als deaktiviert, Batch 991.1 und 1104.1 beschreiben ihn als nutzbar. Der Text folgt Batch 991.1.
- Rückfallsprache: Batch 1308.2 nennt Deutsch als letzte Rückfallebene der Oberflächensprache; Batch 989.2 nennt Englisch als Standard der Spracheinstellung im Reiter „Format“; Batch 523.1 und 1128.5 verweisen auf die Standardsprache des Marktes. Zu klären, welche Regel für die Oberflächensprache und welche für Inhalte gilt.
- Formate: Batch 1315.3 beschreibt die konfigurierbare Darstellung von Datum, Uhrzeit und Währung je Kunde und Team als Vorhaben ohne Entscheidung über die Umsetzung; Batch 989.2 beschreibt den Reiter „Format“ der General Settings als vorhanden. Der Text folgt Batch 989.2.
- Währungsauswahl im Reiter „Format“: Batch 989.2 nennt Mehrfachauswahl als vorhanden, Einzelauswahl als Zielzustand bis zur Abstimmung der Umrechnungslogik.
- Datumsformate im Reiter „Format“: Batch 989.2 listet MM DD YYYY, MM DD YY, YY MM DD und YYYY MM DD als Auswahl, nennt aber DD MM YYYY als Standard; das Standardformat fehlt in der Auswahlliste.
- Marktbezeichnungen in der Sprache der Markteinstellungen: Die Aussage stammt aus dem Stilbeispiel (zuordnung-batch-01-05.md, Abschnitt 3.9) ohne Batch-Abschnittsangabe im Material zu Kapitel 3; der Batch-Verweis ist zu ergänzen.
- Links für weitere Felder der Vertragsliste: Batch 744.3 lässt offen, ob Kundennummer oder Kundenname ebenfalls als Link ausgeführt werden und welche Zielseite gilt (Klärung durch Business Stream 3).
- Weitere Filter in der Vertragsverwaltung: Batch 744.2 nennt die zusätzlichen Filteroptionen als nach der MVP-Phase festzulegen; Batch 1106.3 und 769.4 nennen „Order Number“, „Status“, „Customer Type“, „VAT ID“ und Aktivierungsdatum. Vollständige Liste am System zu prüfen.
- Begrenzung der Zeichenanzahl auf 35: Batch 601.1 nennt die Änderung als abgebrochen und nicht in oneSCM vorhanden; kein Handbuchinhalt, ins Klärungsregister (Anhang F).
- Übersetzungsprobleme in der slowakischen Version: Batch 1294.2 ist geschlossen und ohne fachliche Angaben; kein Handbuchinhalt, ins Klärungsregister (Anhang F).
- Sprachauswahl in der Vorproduktionsumgebung (nur Englisch für alle Märkte): Batch 512.2 nennt die Meldung als geschlossen; kein Handbuchinhalt, ins Klärungsregister (Anhang F).
- Batch 72.1 enthält keine fachlichen Angaben zu Systemverhalten (Überarbeitung des Vertragsmanagement-Moduls im Revenue Management ohne Beschreibung der Sonderfälle); kein Handbuchinhalt.
- Batch 1188.3 nennt eine Überarbeitung der Hauptnavigation nach UX-Stream ohne inhaltliche Angaben; nur als Quelle für die Struktur in 3.1 geführt.
- Falsche Symbolgrößen beim ersten Aufruf der Markteinstellungen in der Tagessitzung: Batch 515.2 beschreibt einen bekannten Fehler ohne Lösung; Aufnahme in Kapitel 23.2 prüfen.
- Marktspezifische Übersetzungen für Schadencodes (Batch 118.1) und „Market Translation“ mit durchgestrichenen Teilen zur Crowdin-Integration (Batch 529.1): Umfang des produktiven Funktionsstands zu bestätigen, bevor Kapitel 14.2 und 15.7 Schritte beschreiben.
- Bearbeitungsansicht von Produkten: Batch 1266.2 nennt die endgültige Gestaltung als mit dem Ansprechpartner abzustimmen; Schaltflächenlogik am System prüfen.
- Externer Link der Karte „Garantie-Pakete“ (Batch 601.3): Ziel-URL vor Veröffentlichung des Handbuchs auf Aktualität prüfen.
- Automatisierte Qualitätsprüfungen zu Zahlungsintervallen, Zahlungsartwechsel, technischen Optionen, Kontingentprodukten, Contract Review und Vertragsbearbeitung (Batch 533.1): ohne Angaben zu Umfang und Zielverhalten; kein Handbuchinhalt.

## Vorschläge zur Gliederung

- Neues Unterkapitel „3.10 Tabellen, Ergebnislisten und Seitennavigation“: Das Material zu Sortierung, Seitennavigation, Spaltenfixierung, Auswahl und Leerzuständen (Batch 26.4, 19.1, 274.4, 688.4, 744.3, 663.1, 1266.5, 1253.6) ist umfangreich genug für einen eigenen Abschnitt und entlastet 3.2 und 3.3.
- Neues Unterkapitel „3.11 Rollenabhängige Startseiten und Dashboards“: Händler-Startseite, MPC-Dashboard, schreibgeschützte Rolle, Nacos-Downloads und Kachelkonfiguration (Batch 1311.1, 1278.10, 1134.2, 663.1, 938.2) lassen sich dort je Rolle gegenüberstellen.
- Unterkapitel 3.9 in „Persönlicher Arbeitskontext“ und „Sprachen und Formate“ aufteilen: Die Sprachregeln (Oberflächensprache, Kundensprache, Support-Modus, Rückfallebenen, Formate) füllen allein einen Abschnitt (Batch 1308.2, 523.1, 975.3, 1104.1, 1128.5, 989.2).
- Kapitel 3.7 auf „Systemübergaben aus Sicht der Oberfläche“ zuschneiden und die technischen Beschreibungen vollständig in Kapitel 19 belassen; das zugeordnete Material (Batch 1036.3, 1296.1) betrifft Bedienung beziehungsweise Testautomatisierung und nicht die Schnittstellen.
