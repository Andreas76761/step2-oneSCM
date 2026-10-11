# 12 Geschäftskunden, Kampagnen und Sonderfälle

Dieses Kapitel beschreibt, wie Sie in oneSCM Serviceverträge für Geschäftskunden anlegen, Kampagnen und Sonderkonditionen anwenden und Sonderfälle für Flottenkunden bearbeiten. Es behandelt die Zusatzangaben für Geschäftskunden, Flotten- und VIP-Konstellationen, Kampagnen mit Preisreduktion und Grace-Period-Anfragen, die Dealer-Zuordnung, die Freigabe durch den MPC, Kommentare, das Customer Account Center und die Massenanlage von Fahrzeugen. Die Pflege von Produkten, Preisen und Markteinstellungen beschreibt Kapitel 14. Am Kapitelende stehen Inhalte, die in andere Kapitel gehören, offene Widersprüche im Ausgangsmaterial und Vorschläge zur Gliederung.

## 12.1 Zusätzliche Anforderungen für Geschäftskunden

**Zweck.** Geschäftskunden erhalten Serviceverträge in oneSCM mit denselben Fahrzeugkennungen wie Privatkunden. Für Geschäftskunden erfassen Sie zusätzlich steuerliche Angaben, Unterzeichner und Zahlungsansprechpartner, und das System prüft Firmendaten gesondert. Flotten mit mehreren Fahrzeugen beschreibt Abschnitt 12.2.

**Voraussetzungen.** Sie sind mit einer Rolle angemeldet, die Serviceverträge anlegt. Sie wählen den Kundentyp „Gewerblich“. Für den Kunden liegt eine USt-IdNr. oder eine Steuernummer vor. Mindestens eine dieser Angaben ist für den Vertrag erforderlich.

**Rollen.** Verträge für Geschäftskunden legen Händler, Dealer+, Market Operations (MO) und der MPC an. Key Account Manager (KAM) sind eine eigene Rolle für die Betreuung von Geschäftskunden. Ansprechpartner des Kunden erhalten die Rolle „Signee“, die Rolle „Payment Responsible“ oder beide Rollen. Die Rolle „Payment Responsible“ betrifft digitale Zahlungen und Zahlungsartänderungen im Customer Account Center.

**Schritt für Schritt: Geschäftskundenvertrag anlegen.**

1. Öffnen Sie „Contract Generation“ und starten Sie ein Angebot.
2. Wählen Sie den Kundentyp „Gewerblich“ und erfassen Sie die Branche.
3. Geben Sie eine beliebige Fahrzeugkennung ein. Haben Sie das Angebot mit einem Baumuster begonnen, nimmt das System dessen Kennung in das Angebot auf.
4. Wählen und konfigurieren Sie das Produkt mit Laufzeit, Laufleistung und Zahlungsintervall. Ergänzen Sie optionale und technische Deckungen, sofern zutreffend.
5. Wenden Sie bei Bedarf Händlerrabatte und Kampagnen an. Die Anwendung beschreibt Abschnitt 12.3.
6. Klicken Sie auf „Create Proposal“. Die Produktkonfiguration erzeugt einen Zahlungsplan. Anschließend prüft das System, ob der Kunde bereits vorhanden ist.
7. Suchen Sie den Kunden über Firmenname und USt-IdNr. oder Steuernummer. Eine der beiden Angaben ist Pflicht, bei fehlerhaftem Format erscheint eine Validierungsmeldung.
8. Wählen Sie bei einem bestehenden Kunden den passenden Datensatz aus der Trefferliste. Das System öffnet die Maske „Customer & Payment Information“ mit vorbelegten Werten. Bei einem Neukunden erfassen Sie alle Kundendaten und mindestens eine der beiden Steuerangaben.
9. Geben Sie optional eine „Payment reference“ ein. Die Zahlungsreferenz steht unter „Payment Information“.
10. Prüfen Sie den Reiter „Overview and Confirmation“. USt-IdNr. und Steuerklassifizierung stehen unter „Tax & Legal Details“, die Steuernummer ebenfalls. Vor den Bankdaten steht die Zwischenüberschrift „Bank Details“.
11. Wählen Sie die Unterschriftsart. Das System bietet „OnPremise“, „DSS“ und „Druckdokument“ an.
12. Schließen Sie die Unterschrift ab. Der Vertrag erhält den Status „Confirmed“. Sobald alle erforderlichen Schritte erledigt sind, aktivieren Sie den Vertrag.

**Ergebnis und Systemstatus.** Das System vergibt eine Referenznummer. Das Angebot erhält den Status „Erstellt“, nach der Wahl der Unterschriftsart den Status „Wartet auf Bestätigung“ und nach der Unterschrift den Status „Bestätigt“. Das Angebotsdokument enthält die Steuernummer. Proposal Management und Contract Management zeigen im Reiter „Customer“ das Feld „Tax Number“. Ist kein Wert erfasst, zeigt das System „-“ an. Die Kontaktperson des Unterzeichners erscheint, sofern sie erfasst ist. Scheitert die Prüfung der USt-IdNr., aktiviert das System den Vertrag nicht automatisch.

**Besonderheiten je Rolle.**

- Händler, Dealer+, MO und MPC legen Verträge für Geschäftskunden mit denselben Identifikatoren an wie für Privatkunden. Sie wenden Händlerrabatte und Marktkampagnen auf Verträge für Geschäftskunden an.
- Mindestens ein Ansprechpartner muss die Rolle „Signee + Payment Responsible“ haben. Ohne diesen Ansprechpartner speichert das System die Konfiguration der Ansprechpartner nicht. Ein Ansprechpartner kann die Rolle „Signee“ haben und ein weiterer die Rolle „Payment Responsible“.
- Bestehende Ansprechpartner erhalten die Rolle „Payment Responsible“ standardmäßig gemäß der Migration. Der Ansprechpartner mit dieser Rolle erhält den Link für digitale Zahlungen, den Link zum Customer Account Center für die Änderung der Zahlungsart und den OTP-Code, jeweils über seine gespeicherten Kontaktdaten.
- Die Rolle „Payment Responsible“ gilt nur für Geschäftskunden. Die Rolle „Signee“ bleibt unverändert.

**Besonderheiten je Sparte und Markt.**

- Bei Geschäftskunden zeigt das System Nettopreise mit dem Hinweis „excl. VAT“. Beim Überfahren erscheinen der Standardpreis, bei aktiver Kampagne durchgestrichen, und der Kampagnenpreis jeweils inklusive Mehrwertsteuer sowie der Steuerbetrag mit dem Zusatz „VAT“. Betroffen sind die Produktpreise, die Produktkonfiguration, die Hover-Anzeigen, die Rabattpreise und die Übersicht. Der Zahlungsplan zeigt die bisherige Darstellung.
- Bei Privatkunden zeigt das System Bruttopreise mit dem Hinweis „incl. VAT“.
- Das Feld „Company Registration Number“ steht für die Märkte Deutschland, Indien und die Slowakei zur Verfügung. In der Slowakei betrifft es Geschäftskunden und staatliche Geschäftskunden.
- Auf der Detailseite für Geschäftskunden zeigt das System die SAP-Debitorennummer an.

**Hinweise.**

- Das Kundendatenmodell für Geschäftskunden ist ein Basisablauf. Tochtergesellschaften sind für die Behandlung von Geschäftskunden nicht erforderlich. Das Modell ist keine vollständige Kundenverwaltung für Flotten. Die Funktion richtet sich vor allem an das Team der Market Operations.
- Die Produktkonfiguration erzeugt den Zahlungsplan auf Basis der gewählten Konfiguration. Kunden- und Zahlungsdaten erfassen Sie nur, sofern sie noch nicht vorliegen.
- Der Kontoinhaber wird beim Anlegen eines Geschäftskunden mit dem Firmennamen vorbelegt. Ändern Sie den Firmennamen, aktualisiert sich der Kontoinhaber. Das Feld bleibt im Assistenten „Payment Information“ und in der Kundenverwaltung editierbar.

**Fehlerbehebung.**

- Werden USt-IdNr. und Steuernummer entfernt, erscheint die Meldung, dass mindestens eine der Angaben erfasst werden muss.
- Die Hinweismeldung zur Eindeutigkeit der Firmenregistrierungsnummer erscheint einmal.
- Schlägt die Prüfung der USt-IdNr. fehl, lässt sich der Vertrag nicht automatisch aktivieren.

{{Q:12.1}}

## 12.2 Flotten- und besondere Kundenkonstellationen

**Zweck.** Flottenkunden verwalten mehrere Fahrzeuge in einem Kundenkonto. Der Kundentyp „Commercial Fleet“ kennzeichnet gewerbliche Kunden mit Flottenverwaltung. Dieser Abschnitt beschreibt die Auswahl des Kundentyps, die Zuordnung von Produkten und Kampagnen zu Kundentypen und den Ablauf für VIP-Geschäftskunden mit der KAM-Kampagne mit 100 % Rabatt. Die Sonderfallanfrage für Flotten beschreibt Abschnitt 12.4, die Massenanlage Abschnitt 12.9.

**Voraussetzungen.** Der Kundentyp „Commercial Fleet“ steht im Markt zur Verfügung. Produkte und Sonderkonfigurationen für gewerbliche Flottenkunden sind verfügbar. Für den VIP-Ablauf ist der Kunde als VIP-Kunde markiert, und die MO-Prüfungen sind aktiviert.

**Rollen.** Key Account Manager, Händler, Mitarbeitende im MO und im MPC bieten Flottenkunden Produkte und Preise an und begleiten den Ablauf bis zur Aktivierung. Der VIP-Ablauf steht den Rollen MO, MPC und Dealer+ zur Verfügung.

**Schritt für Schritt: Flottenkunden anlegen.**

1. Öffnen Sie „Contract Generation“ und wählen Sie den Kundentyp „Commercial Fleet“.
2. Geben Sie eine Fahrzeugkennung ein. Das System zeigt nur Produkte an, die dem Kundentyp zugeordnet sind.
3. Wählen und konfigurieren Sie das Produkt. Das System prüft bei der Vertragskalkulation, welche Kampagne auf den Vertrag angewendet werden darf. Kampagnen sind dem Kundentyp zugeordnet.
4. Fahren Sie mit der Sonderfallanfrage nach Abschnitt 12.4 oder mit der Massenanlage nach Abschnitt 12.9 fort.

**Schritt für Schritt: VIP-Geschäftskunde mit KAM-Kampagne mit 100 % Rabatt.**

1. Starten Sie das Angebot für einen Geschäftskunden und konfigurieren Sie das Produkt.
2. Wählen Sie die KAM-Kampagne mit 100 % Rabatt aus.
3. Das System führt die Dublettenprüfung des Kunden durch und prüft, ob der Kunde als VIP-Kunde markiert ist und die 100-%-Kampagne angewendet wird.
4. Sind beide Bedingungen erfüllt, legt das System den Vertrag ohne Zahlungsfelder an. Der Vertrag erhält den Status „Created“, den Vertragspreis 0 und einen Zahlungsplan mit dem Wert 0 ohne Raten. Die Vertragsvorschau zeigt ein Dokument mit dem Wert null ohne Zahlungsinformationen.
5. Beim Bestätigen öffnet sich kein Unterschriftsfenster. Das System setzt den Status automatisch auf „Waiting for Confirmation“.
6. Die MO-Prüfungen blockieren die automatische Aktivierung, solange ein Problem besteht. Der MO behebt das Problem. Prüfungen, die nicht zutreffen, gelten als „Not Applicable“. Dazu gehören die Prüfungen Direct-Debit-Code, SAP-Debitorennummer, FI-Systemstatus, Branche, Vertragsnummer, Dokumentunterschrift, SEPA-Vertragsabgleich, SEPA-Dokumentunterschrift und Steuerbefreiungsbescheinigung.
7. Sind alle Prüfungen bestanden, aktiviert das System den Vertrag automatisch. Bei negativem CAS-Ergebnis setzt das System den Vertrag auf „Confirmed“.

**Ergebnis und Systemstatus.** Nach der Aktivierung nimmt das System den Vertrag in die nächste i155 auf. Das System versendet keine Kundenbenachrichtigungen wie Aktivierung oder Bestätigung. Stattdessen sendet es eine Revenue-Benachrichtigung mit der Kostenstelle der Kampagne. Die Daten gehen an den Notification-Microservice. Es entstehen keine Rechnungen. Solange der Kunde VIP-Kunde ist und die 100-%-Kampagne angewendet wird, ist keine Vertragsunterschrift erforderlich, der Vertragswert beträgt 0, und der Kunde erhält keine E-Mails oder Benachrichtigungen.

**Besonderheiten je Rolle.**

- Der VIP-Ablauf steht den Rollen MO, MPC und Dealer+ zur Verfügung.
- Der Kundentyp „Commercial Fleet“ bestimmt, welche Produkte Sie im Vertragsmodul sehen. Die Angebotsverwaltung zeigt veröffentlichte Produkte je Kundentyp „Commercial Fleet“, „Commercial“ oder „Private“.

**Besonderheiten je Sparte und Markt.**

- Im Produktmodul legen Sie fest, für welche Kundentypen ein Produkt gilt. Das Feld „Customer Type“ bietet eine Mehrfachauswahl für „Privat“, „Gewerblich“ und „Commercial Fleet“. Standardmäßig sind alle Kundentypen ausgewählt. Die Produktzusammenfassung zeigt den Kundentyp an.
- Die Kampagnenübersicht zeigt den Kundentyp jeder Kampagne. Über den Filter „Weitere Filter“ lassen sich Kampagnen nach dem Kundentyp auswählen.
- Bei der Anfrage mit dem Vertriebskanal „Leasing“ liefert das System nur Produkte, die diesem Kanal zugeordnet sind. Das gilt auch für Produkte, die die Kanäle Leasing und Retail haben.

**Hinweise.**

- Bei einer Kampagne mit mehreren Kundentypen wendet das System diejenige Kampagne an, die dem Kunden den höchsten Rabatt gewährt.
- Der VIP-Ablauf greift nur, wenn alle drei Bedingungen erfüllt sind. Ist eine Bedingung nicht erfüllt, gilt der übliche Ablauf für Geschäftskundenverträge.

**Fehlerbehebung.**

- Fehlt ein erwartetes Produkt im Vertragsmodul, prüfen Sie die Zuordnung des Kundentyps am Produkt.
- Offene MO-Prüfungen blockieren die automatische Aktivierung des VIP-Vertrags. Der MO bearbeitet die betroffene Prüfung, anschließend aktiviert das System den Vertrag.

{{Q:12.2}}

## 12.3 Kampagnen und Sonderkonditionen

**Zweck.** Kampagnen gewähren für ein Produkt eine Preisreduktion im Vertragsangebot. Eine Kampagne kann als Prozentwert, als Festbetrag, als Sticker-Price-Kampagne mit Netto-Endpreisen oder als Grace-Period-Kampagne definiert sein. Eine Kampagne mit automatischer Anwendung wirkt ohne Zutun des Verkäufers. Händlerrabatte wirken getrennt von Kampagnen. Dieser Abschnitt beschreibt die Anlage und Verwaltung von Kampagnen durch den Markt, die Anwendung im Vertragsangebot, die Anfrage von Grace-Period-Kampagnen und die Berechnung. Die Freigabe der Anfragen beschreibt Abschnitt 12.6.

**Voraussetzungen.** Das Produkt ist veröffentlicht und hat eine gültige Preisversion. Für eine Kampagne mit Preisversion hat das Produkt eine aktive Preisversion und eine nächste Preisversion. Die Kampagne ist einer Division zugeordnet, Vans oder PC, und einem Vertriebskanal. Für die Anwendung im Angebot haben Sie das Produkt ausgewählt und konfiguriert.

**Rollen.** Der MPC legt Kampagnen an und verwaltet sie. Die Rollen MO und MPC prüfen Kampagnen im Vier-Augen-Verfahren, siehe Abschnitt 12.6. Händler, Dealer+, MO, MPC und KAM wenden Kampagnen im Angebot an. Die Rollen Händler, MO, MPC und KAM können eine Grace-Period-Kampagne auswählen und wieder zurücknehmen.

**Schritt für Schritt: Kampagne anlegen.**

1. Öffnen Sie im Hauptmenü der Produktverwaltung den Menüpunkt „Manage Campaigns“. Die Kampagnenübersicht zeigt alle Kampagnen Ihres Marktes.
2. Klicken Sie auf „Create Campaign“. Der Assistent besteht aus den Schritten „Campaign Setup“, „Discounted Products & Vehicles“ und „Campaign Summary“.
3. Erfassen Sie im Schritt „Campaign Setup“ den Kampagnennamen. Der Name umfasst 3 bis 100 Zeichen. Sonderzeichen sind erlaubt.
4. Legen Sie die Gültigkeit fest. „Valid From“ beginnt frühestens am Folgetag, „Valid To“ ist das Ende der Kampagne. Die Karenzzeit „Grace Period (Days)“ umfasst ein bis zwei Ziffern und hat den Standardwert 0. Die Kampagnenbeschreibung umfasst bis zu 512 Zeichen.
5. Wählen Sie den Rabatttyp „Percentage“, „Fixed Amount“ oder „Sticker Price“. Bei „Percentage“ geben Sie einen Wert von 1 bis 100 mit maximal fünf Zeichen und zwei Nachkommastellen ein. Der Maximalbetrag „Maximum Amount“ ist optional. Bei „Fixed Amount“ geben Sie den Betrag ein, mindestens 1 und mit maximal acht Ziffern und zwei Nachkommastellen. Die Währung ist zunächst EUR.
6. Wählen Sie die Division. Benutzer mit einer Rolle für eine Division sehen nur diese Division. Benutzer mit beiden Rollen können zwischen PC und Van wählen.
7. Wählen Sie mindestens einen Vertriebskanal. Zur Auswahl stehen „Stationary Retail Sales“ und „Direct Online Sales“, die als stand-alone Kanäle gelten, sowie „Leasing“, „Finance“ und „Rental“. Der Kanal bestimmt, welche Produkte im zweiten Schritt erscheinen.
8. Wählen Sie mindestens eine Verkaufsebene. Zur Auswahl stehen „Direct-to-Customer“, „Dealerships“ und „MPCs/MOCs“.
9. Erfassen Sie die Kostenstelle „Cost Center“. Sie ist Pflicht und umfasst bis zu zehn Zeichen aus Ziffern und Bindestrichen. Die Debitorennummer „Debtor Number“ ist optional und darf höchstens zehn Zeichen ohne Leerzeichen enthalten.
10. Erfassen Sie die „External Campaign ID“. Sie darf keine Leerzeichen enthalten und umfasst bis zu zehn Zeichen. Eine ID darf für dieselbe Fahrzeuggruppe zur selben Zeit nur einer Kampagne zugeordnet sein.
11. Aktivieren Sie bei Bedarf „Automatisch anwenden“. Ist das Kontrollkästchen aktiv, wendet das System die Kampagne automatisch in der Vertragserstellung an.
12. Wählen Sie im Schritt „Discounted Products & Vehicles“ das Produkt und die Cluster aus. Bei einer Sticker-Price-Kampagne pflegen Sie Nettopreise je Laufzeit und Laufleistung in der Preismatrix. Die Eingabe erfolgt manuell, per Copy and Paste oder per Excel-Upload, wahlweise auf Basis des Monatspreises oder des Gesamtpreises. Ein Gesamtrabatt wendet einen Prozentsatz mit optionalem Maximalbetrag auf alle leeren Felder eines Clusters an. Sie können einzelne Baumuster oder Modellcodes eines Clusters auswählen. Die Kampagne gilt dann nur für diese Codes.
13. Klicken Sie auf „Next“, sobald alle Pflichtfelder des Schrittes gültig ausgefüllt sind. Mit „Back“ kehren Sie zu einem bereits abgeschlossenen Schritt zurück. Ändern Sie nach einem Rücksprung ein Feld, das Preis oder Konfiguration beeinflusst, setzt das System nachfolgende Auswahlen zurück.
14. Prüfen Sie im Schritt „Campaign Summary“ alle Angaben. Der Schritt zeigt die Einstellungen schreibgeschützt. Mit „Submit“ speichern Sie die Kampagne. Sie erscheint danach in der Kampagnenübersicht und durchläuft die Freigabe nach Abschnitt 12.6.

**Schritt für Schritt: Kampagne im Vertragsangebot anwenden.**

1. Starten Sie auf der Einstiegsseite der Vertragserstellung einen neuen Vertrag. Wählen Sie die Ablaufvariante „Available Chassis Number“, „Build to Stock“ oder „Not Available Chassis Number“ und füllen Sie die Pflichtfelder der Fahrzeugdaten aus.
2. Das System ruft die Vertragskalkulation auf und zeigt die passenden Produkte. Die Produktkarte zeigt den Grundpreis durchgestrichen und den Preis inklusive Kampagne darunter.
3. Wählen und konfigurieren Sie das Produkt. Ist die Konfiguration abgeschlossen, wird die Schaltfläche „Kampagnen“ aktiv.
4. Öffnen Sie die Schaltfläche „Kampagnen“ und wählen Sie eine Kampagne aus. Pro Produkt können Sie nur eine Kampagne auswählen. Mit „Apply“ übernehmen Sie die Kampagne, mit „Cancel“ verwerfen Sie die Auswahl.
5. Vergeben Sie bei Bedarf einen Händlerrabatt. Der Link „Dealer Discount“ steht unter dem Zahlungsintervall. Im Dialog erfassen Sie einen Rabatt als Prozentwert oder als Betrag, mehrere Eingaben sind möglich. Name und Beschreibung der Kampagne sind schreibgeschützt.
6. Prüfen Sie den Preis im Kopfbereich von „Overview and Confirmation“. Der Grundpreis steht durchgestrichen, darunter der reduzierte Preis. Der Tooltip nennt den Namen der Kampagne, die prozentuale Reduktion und den Betrag, den Händlerrabatt und die Gesamtsumme.
7. Setzen Sie den Ablauf nach Kapitel 6 fort.

**Schritt für Schritt: Grace-Period-Kampagne anfragen.**

1. Starten Sie einen neuen Vertrag, wählen Sie die Ablaufvariante, füllen Sie die Fahrzeugdaten aus und wählen Sie ein Produkt. Konfigurieren Sie Laufzeit, Jahreslaufleistung und Zahlungsintervall.
2. Vergeben Sie bei Bedarf einen Händlerrabatt über den Link unter dem Zahlungsintervall.
3. Prüfen Sie, dass keine Marktkampagne angewendet ist. Nur dann zeigt das System die Grace-Period-Kampagnen an.
4. Wählen Sie im Schritt „Special Request“ eine Grace-Period-Kampagne als Optionsfeld aus. Alternativ aktivieren Sie das Kontrollkästchen „Don't add campaigns“. Eine Vorauswahl gibt es nicht.
5. Erfassen Sie eine Begründung im Textfeld und klicken Sie auf „Submit“. Das System bestätigt, dass die Anfrage übermittelt wurde und der zuständige Markt eine Antwort geben wird.
6. Das Benachrichtigungscenter sendet die Anfrage an den MPC. Der MPC prüft sie nach Abschnitt 12.6.
7. Der Händler erhält eine Benachrichtigung über die Entscheidung. Bei einer Genehmigung enthält die Benachrichtigung den Hinweis „Grace Period Campaign „Kampagnenname“ for Contract „Referenznummer“ has been approved.“ Zusätzlich erhält der Händler die aktualisierten Vertragsdetails und den aktualisierten Zahlungsplan. Bei einer Ablehnung lautet der Hinweis „has not been approved“.

**Ergebnis und Systemstatus.** Eine aktive Kampagne wird bei der Preisermittlung berücksichtigt. Das System übermittelt dabei die vollen und die rabattierten Beträge netto und brutto sowie Kostenstelle und Kontonummer. Eine Karenzzeit gilt als Teil der Gültigkeit, die Kampagne bleibt währenddessen mit dem Status „Active“ sichtbar. Die Kampagnenübersicht zeigt den Status „Active“, „Finished“, „Upcoming“ oder „Deactivated“. Der Preis wird nie negativ. Übersteigt der Betrag einer Festbetragskampagne den Vertragspreis, setzt das System den Endpreis auf 0. Bei einer Grace-Period-Kampagne bleibt der Preis bis zur Entscheidung ohne Kampagne, der Produktpreis ist ausgeblendet und es entsteht kein Zahlungsplan. Nach der Genehmigung wendet das System die Kampagne an. Nach der Aktivierung meldet das System die Vertragsdaten an Revenue, Nemesis und Reporting. Die Gesamtausgaben der Kampagne im Produktmanagement erhöhen sich um den Betrag.

**Kampagnen verwalten.**

- Die Übersicht durchsuchen Sie nach Kampagnenname und externer Kampagnen-ID mit mindestens drei Zeichen. Das Jahr filtern Sie mit einer vierstelligen Zahl, den Status über eine Auswahlliste. Eine Filterauswahl schränkt die Optionen der übrigen Filter ein. Mit dem Zurücksetzen leeren Sie alle Felder.
- Die Tabelle zeigt Campaign Name als Link zur Kampagne, External Campaign ID, Discount, Validity Period, Last Modified, Total Expense, Status, Auto Apply, Division, Campaign Type, die Produkte und die Aktionen. Der Campaign Name ist ein Link.
- Eine aktive Kampagne lässt sich bearbeiten, duplizieren und deaktivieren. Bearbeitbar sind dann nur der Kampagnenname, die Sales Description, die Internal Description mit bis zu 512 Zeichen und die Kostenstelle.
- Eine Kampagne mit Status „Upcoming“ lässt sich bearbeiten, duplizieren und für Startdatum in der Zukunft löschen. Der Discount Type ist nicht mehr änderbar.
- Eine Kampagne mit Status „Finished“ lässt sich duplizieren.
- Eine deaktivierte Kampagne lässt sich bearbeiten und duplizieren. Sie lässt sich reaktivieren, wenn das Gültigkeitsende nicht in der Vergangenheit liegt.
- Beim Duplizieren erhält die neue Kampagne den Namen „Copy of“ mit dem Namen der Vorlage. Die Vertriebskanäle und die Produkte sowie die Cluster werden zurückgesetzt. Die External Campaign ID bleibt leer. Bei einer beendeten Kampagne sind „Gültig ab“ und „Gültig bis“ leer.
- Beim Deaktivieren erscheint eine Bestätigung. Danach gilt die Kampagne nicht mehr für Produkte und Preise. Beim Reaktivieren erscheint ebenfalls eine Bestätigung, der Status wechselt auf „Active“.
- Die Kampagnenansicht zeigt die Konfiguration ohne Bearbeitungsmodus.
- Ein Sticker-Price-Wert von 0 oder ein fehlender Wert in der Matrix wird nicht an die Vertragserstellung übermittelt.
- Limit-Voreinstellungen gelten je Division. Benutzer der anderen Division sehen und bearbeiten sie nicht.

**Berechnung von Kampagnen und Rabatten.**

- Eine Kampagne und ein Händlerrabatt werden nicht gestapelt. Beide sind nur Nettobeträge und werden unabhängig von der Reihenfolge vom Nettopreis des Produkts abgezogen.
- Auf ein Produkt wird immer nur eine Kampagne angewendet. Eine Kampagne mit automatischer Anwendung hat Vorrang. Gelten mehrere automatisch angewendete Kampagnen, wählt das System die mit dem höchsten Wert. Bei gleichem Wert gilt die zuerst erstellte Kampagne.
- Eine Sticker-Price-Kampagne gibt den Preis aus der Preismatrix für Laufzeit und Laufleistung zurück. Ist der Sticker Price niedriger als der unrabattierte Preis, ist die Differenz der Rabattwert. Ist er gleich hoch, beträgt der Rabattwert null. Ist er höher, gibt das System den Sticker Price zurück und setzt den Rabattwert auf null. Eine leere Zelle der Matrix behält den unrabattierten Preis.
- Der Händlerrabatt und die Kampagne sind zusammen kleiner als der Vertragswert. Ein Beispiel: Bei einem Vertragswert von 1.200 EUR und einer Kampagnenreduktion von 200 EUR beträgt der Preis 1.000 EUR. Ein Händlerrabatt von 50 % senkt den Preis auf 500 EUR, ein Betragsrabatt von 499 EUR auf 1 EUR. Die Kampagne trägt der Markt, die Händlerrabatte trägt der Händler, der Kunde zahlt 1 EUR. Erreicht oder übersteigt die Summe den Vertragswert, zeigt das System die Meldung „Sum of Market Campaign Reduction and Dealer Discount cannot exceed the Contract Value“ und deaktiviert „Apply“.
- Kampagnenwerte und Händlerrabatt werden auf aggregierter Ebene berechnet. Vom Marktlistenpreis ziehen Sie den Kampagnenwert und den Händlerrabatt ab, wahlweise als Prozentwert oder als Betrag. Die Mehrwertsteuer berechnet das System einmal auf den endgültigen Kundennettopreis.
- Ein Zahlungsintervall für einen vollständig subventionierten Vertrag setzt das System auf einmalig, und es entstehen keine Rechnungen.

**Besonderheiten je Rolle.**

- Der MPC legt Kampagnen an und sieht die Kampagnen seines Marktes. Eine Kampagne ist nur für MPC-Benutzer des jeweiligen Marktes sichtbar.
- Der MO kann eine Grace-Period-Kampagne nicht genehmigen.
- Händler wählen Kampagnen nach Vertriebskanal und Verkaufsebene aus. Die Auswahl „Automatisch anwenden“ entscheidet, ob eine Kampagne ohne Auswahl übernommen wird.
- Die Rolle „Dealer+“ steht für besondere Verkaufssituationen zur Verfügung.

**Besonderheiten je Sparte und Markt.**

- Im deutschen Markt wird keine Kampagne automatisch auf ein Produkt angewendet. Es gibt dort keine Grace-Period-Kampagnen. Die Kampagnendaten stammen aus der Vertragskalkulation und umfassen Kampagnenname, Werte, Rabatte, Verkaufsbeschreibung, Ausnahmen, Kostenstelle, Kampagnentyp und die Angabe zur automatischen Anwendung. Aus dem Fahrzeugmanagement übernimmt das System das Bestelldatum.
- Der Kampagnentyp „Sales Campaign“ oder „After Sales Campaign“ bestimmt, wie das System die Kampagne weiterverarbeitet. Die Kampagne wird mit ihrem Typ an die Vertragserzeugung übergeben.
- Sticker-Price-Preise sind Nettopreise in EUR ohne Mehrwertsteuer.
- Kampagnen für Vans erscheinen in der Übersicht. Für die Übergabe an das Leasing werden alle Kampagnentypen berücksichtigt.

**Hinweise.**

- Die Auswahl einer Kampagne und die Anwendung eines Händlerrabatts hängen nicht voneinander ab. Eine Kampagne ist keine Voraussetzung für einen Händlerrabatt.
- Ist ein Produkt mit einer Kampagne mit automatischer Anwendung konfiguriert, können Sie keine weiteren Kampagnen hinzufügen. Die Bereiche für Kampagnen erscheinen dann nicht.
- Für eine Kampagne in der Karenzzeit berechnet das System die Preise ohne die Kampagnen-ID. Die Preise mit Kampagnen-ID gelten erst nach der Genehmigung.
- Bei einer Stornierung innerhalb der Widerrufsfrist sendet das System ein Rückbuchungsereignis an das Produktmanagement. Es entfernt den Kampagnenbetrag aus den Gesamtausgaben. Verträge ohne Kampagne lösen kein solches Ereignis aus.
- Bei aktivierter Kampagne sendet das System Vertrags-ID, Kampagnen-ID, Rabattwert und Endpreis an Revenue. Das Produktmanagement erhält ein Ereignis zur Aktualisierung der Gesamtausgaben. Zusätzlich entsteht das Dokument i155.
- Der Zahler des Vertrags kann bei einem Vertragswert von null nicht um einen abweichenden Zahler ergänzt werden.
- Sie öffnen den Rabattdialog erneut. Die zuletzt gewählte Kampagne ist vorausgewählt. Mit „Cancel Request“ nehmen Sie eine Grace-Period-Anfrage zurück. Danach wählen Sie eine andere Kampagne. Eine Auswahl, die die Kulanzkampagne wiederholt, ändert den Preis nicht.
- Der Vertrag zeigt die Kampagne im Reiter „Zahlung“ mit Wert und Währung, sofern die Marktkonfiguration die Anzeige vorsieht.

**Fehlerbehebung.**

- Der Kampagnenname umfasst 3 bis 100 Zeichen. Bei einer Abweichung erscheint die Meldung „Min. 3 and max. 100 characters allowed. Please correct your input and try again“.
- Die Kampagnenübersicht zeigt „There are no campaigns to display“, wenn keine Kampagne den Kriterien entspricht.
- Die Vertragserstellung schlägt bei Kampagnen, die nur für gewerbliche Kunden gelten, nicht mit „Invalid campaign“ fehl.
- Die Preisanzeige einer Sticker-Price-Kampagne zeigt keinen Wert an, wenn die Kampagne für die Konfiguration keine Preise enthält.

{{Q:12.3}}

## 12.4 Sonderfallanfrage und Begründung

**Zweck.** Der Händler stellt für einen Flottenkunden eine Sonderfallanfrage, wenn der Standardpreis oder die Standardkonfiguration nicht passt. Die Anfrage betrifft einen neuen Preis oder eine neue Laufleistung oder Laufzeit. Sie enthält eine verpflichtende Begründung. Der MPC prüft und entscheidet nach Abschnitt 12.6.

**Voraussetzungen.** Der Kundentyp ist „Commercial Fleet“. Für Privat- und Gewerbekunden steht die Sonderfallanfrage nicht zur Verfügung. Die Produktkonfiguration ist abgeschlossen. Für den Kunden liegt keine auswählbare Kampagne vor, die Sie nicht ausgewählt haben. Eine Grace-Period-Kampagne gilt hierbei als Ausnahme. Ob ein Produkt für die Sonderfallanfrage freigegeben ist, beschreibt der Abschnitt Klärungsbedarf.

**Rollen.** Händler, KAM, MO und MPC stellen Sonderfallanfragen. Ein Händler sieht nur die Anfragen zu Outlet-IDs, die ihm zugeordnet sind.

**Schritt für Schritt: Sonderfallanfrage stellen.**

1. Konfigurieren Sie das Produkt für den Flottenkunden.
2. Prüfen Sie, ob auswählbare Kampagnen vorhanden sind. Ist eine solche Kampagne nicht ausgewählt, bleibt „Request Special Case“ deaktiviert. Ist keine Kulanzkampagne ausgewählt, ist die Schaltfläche bei einem Flottenkunden aktiv.
3. Klicken Sie auf „Request Special Case“ und wählen Sie die Variante „Neuer Preis“ oder „Neue Laufleistung/Laufzeit“. Die andere Variante verwerfen Sie.
4. Bei einem neuen Preis zeigt das System die Produktkonfiguration schreibgeschützt an. Begründen Sie die Anfrage im Kommentarfeld. Der Kommentar ist Pflicht und umfasst bis zu 500 alphanumerische Zeichen. Ein Beispiel lautet: Der Kunde erweitert seine Flotte und hat ein Budget von 500 Euro pro Jahr für die gewählte Konfiguration.
5. Bei einer neuen Laufleistung oder Laufzeit öffnen Sie mit „Configure Product“ die Produkteinstellungen und wählen die Standard- oder die Sonderkonfiguration. Die Schaltfläche „Make Request“ ist aktiv, wenn die Auswahl gültig ist.
6. Klicken Sie auf „Make Request“. Die Anfrage wird gespeichert und zur Genehmigung gesendet, sobald der Vertrag den Status „Created“ erreicht. Ändern Sie die Anfrage später, ersetzt „Update“ die Schaltfläche und überschreibt die vorherige Anfrage. Gilt die zuletzt gespeicherte Konfiguration.
7. Das Fenster schließt sich. Mit „X“ oder „Cancel“ schließen Sie das Fenster ohne Speichern.
8. Erfassen Sie die Kunden- und Zahlungsdaten und gelangen Sie zu „Overview and Confirmation“. Dort erstellt das System das Angebot und vergibt eine Referenznummer. Die Anfrage geht über den Notification Service an den MPC. Bei einem neuen Preis umfasst sie die Produktkonfiguration, die Preisdetails mit Rabatten, Kampagnen und optionalen Deckungen sowie die Kommentare. Bei einer neuen Laufleistung oder Laufzeit umfasst sie die Sonderkonfiguration, die Händler-Outlet-ID, die Händlerrabattbeträge netto, brutto und Steuer, die Kampagnen-ID, den Kampagnenwert oder -prozentsatz, die Kostenstelle der Kampagne und die Kommentare.

**Ergebnis und Systemstatus.** Nach der Anfrage ist die Konfiguration gesperrt. Optionale Deckungen und technische Optionen lassen sich nicht mehr ändern. Ein Preisangebot lässt sich nicht erstellen, drucken oder per E-Mail versenden. Es wird kein Zahlungsplan angefordert, der Reiter „Payment Plan“ entfällt und der Produktpreis ist ausgeblendet. Die Anfrage erscheint in der Sonderfall-Übersicht, siehe Abschnitt 12.6. Nach der Beantwortung zeigt das System die Preise erneut an.

**Besonderheiten je Rolle.**

- Die Sonderfall-Übersicht zeigt dem Händler die Referenznummer, den Kundennamen, die Anfrageart, die Fahrzeuganzahl, das Einreichungsdatum mit der Benutzerkennung des Anlegers, den Status und die verbleibenden Tage bis zur Fälligkeit. Die Filter umfassen Referenznummer, Kundenname, Anfrageart und den Status „Open“, „In Prüfung“, „Genehmigt“ oder „Rejected“.
- Die Aktion „Ansehen“ öffnet die Detailansicht für Anfragen im Status Open oder In Prüfung. Die Aktion „Prüfen“ steht für genehmigte und abgelehnte Anfragen bereit.
- Der Vertrag mit Sonderfallanfrage lässt sich auch dann anlegen, wenn eine Kampagne mit automatischer Anwendung hinterlegt ist.
- Das Feld „Industry“ ist nach der Anfrage deaktiviert.

**Besonderheiten je Sparte und Markt.**

- Die Anfrage für Flottenkunden ist im Material für Geschäftskunden und den Van-Ablauf ausgerichtet. Die Verfügbarkeit je Division ist im Abschnitt Klärungsbedarf beschrieben.
- Sonderfallrabatte erfassen Sie mit dem Rabatttyp „Sales“ oder „After Sales“. Die Kostenstelle wird je Geschäftsbereich vorbelegt und lässt sich vor dem Speichern anpassen. Die Debitorennummer ist optional.

**Hinweise.**

- Ein Sonderfall und eine Grace-Period-Kampagne schließen sich auf demselben Vertrag gegenseitig aus. Wählen Sie eine Kampagne, ist der Bereich „Special Case“ deaktiviert. Ist ein Sonderfall gewählt, sind die Optionsfelder der Kampagnen deaktiviert.
- Ist eine Grace-Period-Kampagne angewendet, lässt sich „Request Special Case“ öffnen. Ein Banner weist darauf hin, dass Sie die Kampagne zuerst entfernen müssen. „Make Request“ bleibt bis dahin ausgegraut.
- Die Sonderfallanfrage ist an die Auswahl der Konfiguration gebunden. Sie können Sonderfallanfragen für abweichende Laufleistungen und Laufzeiten stellen.
- Nach der Bestätigung eines Sonderfalls zeigt die Übersicht den korrekten monatlichen Preis.

**Fehlerbehebung.**

- Fehlt der Kommentar, lässt sich die Anfrage nicht absenden. Der Kommentar ist Pflicht.
- Verträge im Sonderfall werden nicht wegen fehlender Rabatte auf Vertragsebene abgelehnt.

{{Q:12.4}}

## 12.5 Dealer-Zuordnung und Weiterbearbeitung

**Zweck.** MO und MPC legen Verträge mit einem Sonderfall selbst an und ordnen das Angebot einem Händler zu oder weisen es sich selbst zu. Nach der Entscheidung bearbeitet der Händler den Rabatt und setzt die Aktivierung fort.

**Voraussetzungen.** Die Rolle ist MO oder MPC. Die Produktkonfiguration unterstützt die Sonderfallbearbeitung. Das Händlernetz ist synchronisiert und verfügbar. Für die Selbstzuweisung gilt, dass im Vertrag kein Händlerrabatt angewendet ist.

**Rollen.** MO und MPC erstellen das Angebot und sind Anfragende des Sonderfalls. Ein zweiter MO oder MPC prüft die Anfrage. Der zugeordnete Händler setzt die Aktivierung fort.

**Schritt für Schritt: Angebot mit Sonderfall und Händlerzuordnung.**

1. Starten Sie das Vertragsangebot und konfigurieren Sie das Produkt. Optional fügen Sie einen Händlerrabatt hinzu.
2. Erstellen Sie die Sonderfallanfrage nach Abschnitt 12.4.
3. Ordnen Sie das Angebot optional einem Händler zu. Wurde kein Händlerrabatt angewendet, wählen Sie „Assign to Myself“, um sich selbst zuzuweisen, oder geben Sie die Händlerdaten ein.
4. Die Anfrage durchläuft den Bewertungsprozess nach Abschnitt 12.6. Der Anfragende darf die Anfrage nur genehmigen, wenn ein anderer berechtigter Benutzer die verpflichtende Validierung durchgeführt hat.
5. Nach der Genehmigung benachrichtigt das System den zugeordneten Händler. Er kann den Händlerrabatt hinzufügen oder bearbeiten und die Aktivierung fortsetzen.
6. Nach der Ablehnung benachrichtigt das System den zugeordneten Händler und den Ersteller. Die Vertragsaktivierung lässt sich nicht fortsetzen.
7. Bei der Aktivierung schließt der zugeordnete Händler die Schritte ab. Das System übermittelt die Händlerinformationen an den Revenue-Microservice und erzeugt die i155.

**Schritt für Schritt: Händler bearbeitet die genehmigten Preise.**

1. Öffnen Sie den Bereich „Special Case“ im Menü „Contract Generation“. Angemeldete Händler sehen nur Anfragen zu Verträgen der Outlet-IDs, denen sie zugeordnet sind.
2. Übernehmen Sie die genehmigten Preise unverändert oder öffnen Sie den Rabattdialog. Der Dialog zeigt den ursprünglichen Nettowert vorbelegt. Ändern Sie den Netto-Rabattwert und lösen Sie die Neuberechnung aus.
3. Das System ermittelt den neuen Preis unter Berücksichtigung von Händlerrabatt, Kampagne und MPC-Rabatt. Nach dem Bestätigen aktualisiert das System die Preise in der Detailansicht.
4. Bestätigen Sie den Preis. Das System speichert alle Konfigurationen und Preise und wendet sie auf den Vertrag an.
5. Wählen Sie die Signaturart. Der Vertrag erhält den Status „Waiting for Confirmation“. Fällt die CAS-Prüfung negativ aus, setzt das System den Vertrag auf „Confirmed“.

**Ergebnis und Systemstatus.** Nach der Bestätigung zeigt „Overview and Confirmation“ den Endpreis ohne detaillierte Rabattaufschlüsselung, die aktualisierte Laufzeit und die Zeiträume, den Starttermin, sofern ein FRD verfügbar ist, und den Zahlungsplan. Ist kein FRD verfügbar und das Produkt FRD-bezogen, erzeugt das System den Zahlungsplan anhand der aktuellen Daten. Bei der Aktivierung erhält Revenue die Händlerrabattwerte mit der Outlet-ID, die Kampagnenwerte mit der Kostenstelle, die MPC-Rabattwerte mit der Kostenstelle sowie den endgültigen Produktpreis und die Vertragslaufzeit. Die Vorschau des Angebots und das Servicevertragsdokument enthalten die Angaben zum Händler oder zum MO oder MPC.

**Besonderheiten je Rolle.**

- Bei der Selbstzuweisung steht im Feld „Händlername“ der Strich „-“. Die Übersicht zeigt die E-Mail-Adresse und den Namen des MO oder MPC, der den Vertrag erstellt hat.
- Der Vertrag mit Selbstzuweisung ist nur für den MO oder MPC sichtbar, der ihn erstellt hat. Händler des Marktes sehen ihn nicht.
- Bei der Aktivierung gehen an Revenue Preis- und Kampagnendaten ohne Händlerrabatt und ohne provisionsbezogene Informationen.
- Die Selbstzuweisung steht im ersten Schritt nicht zur Verfügung, wenn für einen Flottenkunden ein Sonderfall angefragt wird.

**Hinweise.**

- Die Händlerzuordnung ist optional und lässt sich vor der Vertragsaktivierung vornehmen.
- Hat der Händler vor der Sonderanfrage einen Rabatt angeboten, liefert das System nach der Genehmigung die Händlerrabattwerte, die Kampagnenbeträge als Absolutwert und die MPC-Rabatte als Absolutwert sowie die Produktpreise netto, brutto und Steuer.
- Der Händler kann nach der Genehmigung zusätzlich zu den genehmigten Preisen einen Rabatt gewähren. Der Rabatt wird auf Basis des Produktpreises berechnet, der Kampagnen und genehmigte Preise einschließt.
- Der Vertrag wird auf „Rejected“ gesetzt, wenn der Händler nicht handelt und die Gültigkeit des Angebots abläuft. Dasselbe gilt, wenn der Sonderfall nicht innerhalb der festgelegten Zeit bearbeitet wird.

**Fehlerbehebung.**

- Verträge im Sonderfall werden nicht wegen fehlender Rabatte auf Vertragsebene abgelehnt.
- Der Sonderfall zeigt die richtige Branche im Ablauf an.

{{Q:12.5}}

## 12.6 Validierung, Freigabe und Ablehnung

**Zweck.** Dieser Abschnitt beschreibt die Prüfung und Entscheidung durch MPC und MO. Sonderfälle, Kampagnen und Preisänderungen laufen im Vier-Augen-Verfahren. Grace-Period-Anfragen entscheidet ein einzelner MPC. Die MO Checks bestätigen Prüfstatus aktiv.

**Voraussetzungen.** Sie sind mit der Rolle MPC oder MO angemeldet. Eine Anfrage oder eine Kampagne liegt zur Prüfung vor. Die Benachrichtigungen beschreibt Abschnitt 12.7.

**Rollen.** MPC 1 prüft und bearbeitet die Anfrage. MPC 2 gibt die Änderungen frei. Der Anfragende ist Händler, KAM, MO oder MPC. Der MO bestätigt Prüfungen in den MO Checks, der MPC entscheidet über Grace-Period-Anfragen.

**Schritt für Schritt: Sonderfall prüfen und freigeben.**

1. Öffnen Sie die Benachrichtigung über das Glockensymbol. Ungelesene Benachrichtigungen erkennen Sie an einem blauen Punkt. Der Link führt zur Sonderfall-Seite.
2. Öffnen Sie die Prüfansicht mit „Review“. Die Karte „Request Details“ zeigt die Referenznummer oder Group ID, den Produktnamen, die Fahrzeuganzahl, den Kundennamen, das Einreichungsdatum, den Status mit der Frist, den Vertragsbeginn, das Vertragsende, die Vertragsdauer und die Fahrleistung. Das Panel „Other Details“ zeigt die Kampagne und die Kommentare.
3. Wählen Sie „Prüfen“. Erst danach sind Änderungen möglich.
4. Prüfen Sie die Fahrzeugdaten im Dialog. Er zeigt die Daten der Vertragserstellung für bis zu 100 Einträge.
5. Überschreiben Sie den Grundpreis, die Optionspreise, die Verwaltungsgebühr oder die Zahlungsintervallgebühr. Der Branchenfaktor, die technischen Optionen, die Verkaufsprovision, der Rabatt nach Kampagnentyp und der Händlerrabatt sind ausgegraut. Jede Änderung berechnet den Kundenpreis pro Fahrzeug und für alle Fahrzeuge, monatlich und insgesamt neu.
6. Erfassen Sie bei einem Rabatt die Art, Betrag oder Prozent, und den Wert. Die Kostenstelle ist Pflicht. Der Kommentar umfasst bis zu 500 alphanumerische Zeichen. Ein Prozentwert speichert das System als Betrag.
7. Entscheiden Sie: „Ablehnen“ setzt den Status auf „Abgelehnt“ und lässt die Preise unverändert. „Bearbeiten und Fortfahren“ speichert die Änderungen, setzt den Status auf „In Prüfung“ und leitet die Anfrage an den zweiten Prüfer weiter. Ohne Änderungen ist „Fortfahren“ deaktiviert.
8. MPC 2 prüft alle Daten einschließlich der Listen- und Kundenpreise sowie der Kommentare. Auch hier wählen Sie zuerst „Prüfen“. Sie können genehmigen, ablehnen oder bearbeiten. Bei einer Bearbeitung ersetzt „Aktualisieren“ die Schaltfläche „Fortfahren“, und die Anfrage durchläuft die Freigabe erneut.
9. Nach der Genehmigung oder Ablehnung zeigt das System eine Übersicht mit den Kommentaren. Mit „Fortfahren“ übergibt der Prüfer die Preise mit Kostenstelle und Kommentaren an die Vertragserstellung. Der Anfragende erhält die Daten mit allen Details zurück.

**Schritt für Schritt: Kostenträger im Sonderfall bearbeiten.**

1. Öffnen Sie die Benachrichtigung zu einer Sonderfallanfrage für einen Komplexprodukt oder ein Produkt mit Kostenträgern.
2. Öffnen Sie „Modify Special Case“. Das Modal zeigt Reiter für die Kostenträger, zum Beispiel „MB“ und „Supplier“, und für das Komplexprodukt.
3. Bearbeiten Sie je Reiter die Preiskomponenten, die Rabattart, die Kostenstelle und das Konto. Ein Rabatt je Kostenträger ist möglich.
4. Erfassen Sie interne und externe Kommentare. Speichern Sie mit „Save Cost Unit“.

**Schritt für Schritt: Grace-Period-Anfrage prüfen.**

1. Öffnen Sie die Liste der Anfragen. Die Suche umfasst Referenznummer, Kundenname, Einreichungsdatum und Status. Der Status ist „All“, „Open“, „Approved“, „Rejected“ oder „Expired“.
2. Klicken Sie bei einer offenen Anfrage auf „Review“. Bei genehmigten, abgelehnten und abgelaufenen Anfragen steht „View“ zur Verfügung. Händler sehen immer nur „View“.
3. Genehmigen Sie die Anfrage mit „Approve“. Sie können einen Kommentar hinzufügen. Der Endpreis ergibt sich aus Listenpreis minus Kampagnenwert und steht im Vertrag. Zahlungsplan und Entwurfsdokument entstehen auf dieser Basis. „Next“ im Schritt „Overview & Confirmation“ des Verkäufers ist danach freigegeben. Der Status wechselt auf „Approved“.
4. Lehnen Sie die Anfrage mit „Reject“ ab. Sie können eine Begründung hinterlegen. Die Kampagne wird nicht angewendet, der Vertrag behält den ursprünglichen Listenpreis. Zahlungsplan und Entwurfsdokument entstehen mit dem ursprünglichen Preis. Der Status wechselt auf „Rejected“.
5. Die Entscheidung ist unwiderruflich. Ein einzelner MPC genügt, es gilt kein Vier-Augen-Prinzip. Die erste Entscheidung sperrt die Anfrage. Entscheiden zwei MPC-Benutzer nahezu gleichzeitig, speichert das System nur die erste Entscheidung. Der zweite Benutzer sieht die Ansichtsseite.

**Schritt für Schritt: Kampagne im Vier-Augen-Verfahren freigeben.**

1. Der Requester erstellt oder bearbeitet die Kampagne und reicht sie über „Submit for Review“ ein. Die Kampagne erhält den Status „In Review“.
2. Der Reviewer erkennt die Kampagne an einem blauen Punkt neben dem Namen. Er öffnet die Bearbeitungsansicht über das Aktionsmenü.
3. Der Reviewer klickt auf „Approve“. Damit ist das Verfahren abgeschlossen. Alternativ bearbeitet er die Kampagne. Dann wechselt die Schaltfläche auf „Submit for Review“, und er reicht die Kampagne erneut ein.
4. Ein Reviewer darf im jeweiligen Schritt nicht dieselbe Person wie der Requester sein. Die Rollen wechseln mit jeder Aktion.
5. Die Aktion „Review Log“ zeigt die Statusänderungen mit Benutzerkennung und Zeitstempel.

**Ergebnis und Systemstatus.**

- Die Anfrage erhält den Status „Open“, „Approved“, „Rejected“ oder „Expired“. Bei einer offenen Anfrage zeigt die Spalte „Due Date“ die verbleibenden Tage. Die Farben sind grau für Open, grün für Approved, rot für Rejected und blau für Expired. Bei drei oder mehr verbleibenden Tagen gilt die Standarddarstellung. Bei null Tagen oder Überfälligkeit wird der Wert rot hervorgehoben.
- Läuft die Frist ohne Entscheidung ab, wechselt die Anfrage auf „Expired“. Der Vertrag läuft mit dem ursprünglichen Preis weiter. „Review“ ist durch „View“ ersetzt.
- Läuft die Gültigkeit des Angebots ab, während die Anfrage offen ist, wechselt die Anfrage auf „Expired“ und der Vertrag auf „Rejected“.
- Das Ende einer Kampagne lässt eine offene Anfrage nicht verfallen. Der MPC kann die Anfrage nach dem Kampagnenende genehmigen, und der Rabatt wird angewendet.
- Eine genehmigte Kampagne erzeugt Ereignisse an Revenue, Products, Nemesis und Reporting. Das Dokument i155 entsteht bei der Aktivierung.
- Kampagnen im Status „In Review“ erhalten bei der Freigabe den Lebenszyklusstatus. Während der Prüfung zeigt die Übersicht „TBC“ mit dem vorgesehenen Startdatum. Nach der Freigabe zeigt sie Start und Ende mit der Anzahl der Tage. Liegt das Startdatum zum Zeitpunkt der Freigabe in der Vergangenheit, setzt das System es auf das Freigabedatum. Liegt das Freigabedatum vor dem gewünschten Startdatum, gilt das gewünschte Startdatum.
- Bei mehreren Entwürfen lässt sich nur der älteste Entwurf einreichen. Die Schaltfläche „Einreichen“ ist für die neueren Entwürfe deaktiviert.

**Schritt für Schritt: Aktive Bestätigung in den MO Checks.**

1. Öffnen Sie die MO Checks. Die Prüfergebnisse zeigen „Ok“, „Not Ok“ oder „Pending“ mit einem Fehlergrund. Der Status „Pending“ betrifft nur das Steuerbefreiungszertifikat.
2. Eine aktive Bestätigung ist nur bei „Not Ok“ oder „Pending“ erforderlich. Betroffen sind die Unterschrift des Servicevertrags und des SEPA-Dokuments bei der Unterschriftsart „Print“, die Dokumenttypen, der Abgleich der Vertragsnummer, das Steuerbefreiungszertifikat, die Laufleistung, die Branche und die Kampagne. Bei einer Kampagne gilt dies nur, wenn der Verkäufer sie ausgewählt hat.
3. Wählen Sie den Daumen nach oben, um ein Dokument zu bestätigen. Erfassen Sie eine Begründung. Der Kommentar wird im Verlauf gespeichert, das Dokument erhält die Markierung „Acknowledged & Approved“ und den Status „OK“. Danach setzen Sie die Vertragsaktivierung manuell fort.
4. Wählen Sie den Daumen nach unten, um ein Dokument abzulehnen. Erfassen Sie eine Begründung. Das Dokument erhält den Status „Not Ok“, der Vertrag wird auf „Rejected“ gesetzt, und eine Aktivierung ist nicht möglich.

**Besonderheiten je Rolle.**

- Der MPC entscheidet über Grace-Period-Anfragen und genehmigt Sonderfälle und Kampagnen im Vier-Augen-Verfahren. Der MO kann eine Grace-Period-Kampagne nicht genehmigen.
- Der Dealer sieht die Entscheidung und den Kommentar des MPC auf der Ansichtsseite. Die Ansicht öffnet sich für Anfragen in jedem Status.
- Der MO bestätigt die Prüfungen in den MO Checks aktiv.

**Besonderheiten je Sparte und Markt.**

- Bei einem Vertrag mit Division „Van“ oder „PC“ gilt die Freigabe für die Division der Kampagne.
- Die Freigabe von Preisversionen und Kampagnen gilt für die jeweilige Marktkonfiguration.

**Hinweise.**

- Ein Vertrag mit Sonderfallanfrage bleibt nach der Ablehnung durch den MPC nicht im Status „Created“ blockiert.
- Bleibt die Grace-Period-Anfrage ohne Entscheidung, verbleibt der Vertrag mit dem ursprünglichen Preis. Die Frist richtet sich nach den Einstellungen des Marktes.
- Ein Vertrag, für den eine Grace-Period-Kampagne abgelehnt wurde, bleibt im Status „Waiting for Activation“ und lässt sich manuell aktivieren. Der Name der abgelehnten Kampagne erscheint nicht mehr, im Feld „Campaign Name“ steht ein Strich.
- Eine Kulanzkampagne wird nach sieben Tagen ohne Entscheidung nicht mehr angezeigt.
- Entscheidungen zu Preisänderungen mit Kostenstelle und Kommentaren gehen mit allen Details an die Vertragserstellung zurück.
- Die Preisänderung und der Rabatt wirken zusammen. Prozentuale Rabatte speichert das System als Betrag.
- Der Vertrag mit Nettopreis zeigt im Prüfdialog Nettopreise. Fährt man mit der Maus über einen Nettopreis, erscheint der Bruttopreis.

**Fehlerbehebung.**

- Ändert sich die Fahrgestellnummer, und passen Produkt, Produktkonfiguration oder Preis nicht mehr, lehnt das System den Vertrag ab. Der Ablehnungsgrund nennt die Ursache: „Produktlinien-Abweichung“ bei einer anderen Produkt-ID oder Produktlinie, „Konfigurationsabweichung“ bei Deckungen, technischen Optionen, Kampagnen, Rabatten oder Sonderfall und „Preisabweichung“ bei einem neuen Nettopreis. Die Fahrgestellnummer lässt sich dann nicht stillschweigend übernehmen, und der Vertrag kann nicht aktiviert werden.
- Gibt man bei einer editierbaren Preiskomponente einen nicht numerischen Wert ein, zeigt das System beim Speichern eine Fehlermeldung. Entspricht der Rabatt dem vollen Grundpreis, beträgt die Nettosumme des Kostenträgers null.
- Die Meldung „Min. 1 and max. 5 characters allowed. Please correct your input and try again“ erscheint bei einem ungültigen Prozentwert.

{{Q:12.6}}

## 12.7 Interne und externe Kommentare

**Zweck.** Kommentare dokumentieren die Begründung von Entscheidungen. Bei Sonderfällen gibt es einen externen Kommentar, der alle Beteiligten sieht, und einen internen Kommentar, der nur internen Rollen zur Verfügung steht.

**Voraussetzungen.** Ein Vertrag mit Sonderfallanfrage ist angelegt. Sie öffnen die Prüf- oder Genehmigungsansicht.

**Rollen.** Die internen Rollen sind MPC, MO und die Preisanpasser und Genehmiger. Händler mit den Rollen Dealer und Dealer+ sehen nur externe Kommentare.

**Schritt für Schritt: Kommentare erfassen.**

1. Öffnen Sie die Prüf- oder Genehmigungsansicht des Sonderfalls.
2. Erfassen Sie beim Bearbeiten, Prüfen oder bei der Statusänderung einen externen Kommentar, einen internen Kommentar oder beide. Beide Felder sind optional.
3. Speichern Sie die Entscheidung. Das System schaltet den Status des Sonderfalls weiter. Ein einzelner Kommentar entsteht als Eintrag der jeweiligen Sichtbarkeit.

**Ergebnis und Systemstatus.** Die Kommentarhistorie enthält jeden Eintrag mit Autor, Zeitstempel, Inhalt und Sichtbarkeitstyp. Die Kommentare erscheinen in chronologischer Reihenfolge, der älteste zuerst. Bestehende Kommentare lassen sich nicht ändern oder löschen. Interne Kommentare tragen die Kennzeichnung „Internal“. In der Historie erscheinen Benutzerkennung, Rolle und Datum.

**Besonderheiten je Rolle.**

- Händler sehen ausschließlich externe Kommentare. Das System übermittelt interne Kommentare nicht an den Händler. Die Kommentarliste zeigt dem Händler keine Lücke.
- Kommentare, die der Händler im Schritt zum Händlerrabatt oder zur Bestätigung abgibt, behandelt das System als extern.
- Ein Händler erfasst keinen internen Kommentar.

**Besonderheiten je Sparte und Markt.** Die Kommentarregeln gelten für Sonderfälle von Händlern, MO und MPC und für Einzel- und Massenanfragen einheitlich.

**Hinweise.**

- Der externe Kommentar dient als Text der Benachrichtigung an den Anfragenden, sobald der Sonderfall in Prüfung wechselt oder genehmigt oder abgelehnt wird. Interne Kommentare nimmt das System nie in Benachrichtigungen auf.
- Der Anfragende, der den Sonderfall erstellt hat, kann ihn nicht selbst genehmigen oder ablehnen. Versucht er es, weist das System die Aktion mit einer Fehlermeldung ab.
- Eine Benachrichtigung zu einer Kampagne oder einer Preisversion erscheint bei den Rollen MPC und MO in der Kategorie „Products and Prices“. Ein Klick führt direkt zur gefilterten Übersicht. Benutzer ohne die Rolle MPC oder MO erhalten keine Benachrichtigung.
- Lehnt ein Prüfer eine Kampagne oder Preisversion ab, steht ein optionales Kommentarfeld bereit. Der Kommentar umfasst bis zu 500 Zeichen. Überschreitet er die Grenze, lässt sich die Ablehnung nicht absenden. Der Einreicher erhält danach eine Rückmeldung zum Status.
- Die Benachrichtigung zur Kulanzfrist verschwindet nach sieben Tagen ohne Aktion.

**Ansichtsmodus „View“.** Die Ansicht „View“ zeigt dasselbe Layout wie „Review“, schreibgeschützt und ohne die Schaltflächen „Approve“ und „Reject“. In der Fußzeile steht nur „Back“. Ein Banner zeigt das Ergebnis, etwa „The request was rejected!“, „The request was approved!“ oder „The request expired without a decision.“. Der Reiter „Comments“ zeigt den vollständigen Kommentarverlauf. Kommentare sind nach dem Absenden unveränderlich.

**Fehlerbehebung.**

- Überschreitet ein Kommentar die zulässige Länge, lässt sich die Ablehnung nicht absenden.
- Versucht der Anfragende, seinen eigenen Sonderfall zu genehmigen oder abzulehnen, zeigt das System eine Fehlermeldung.

{{Q:12.7}}

## 12.8 Customer Account Center

**Zweck.** Das Customer Account Center (CAC) ist die kundenorientierte Website von oneSCM. Endkunden melden sich an, sehen ihre Verträge und Dokumente, laden Dokumente herunter, ändern Zahlungsdaten, bezahlen offene Beträge und lesen die rechtlichen Hinweise.

**Voraussetzungen.** Der Kunde hat einen Vertrag mit dem Status „Aktiv“, „Suspendiert“ oder „Abgelaufen“. Ein aktives Mercedes-me-Profil ist für den Zugang zur Vertragsseite nicht erforderlich. Für Zahlungen mit Mpay ohne Profil gilt die Einmalzahlung. Für die Vorauszahlung sind die MPay Digital Payments in den Markteinstellungen konfiguriert.

**Rollen.** Der MO startet den Zugang zum CAC. Der Kunde meldet sich an. Revenue erzeugt die Links für die Kreditkartenerfassung und die Zahlung. Der MO kann die Aktivierungs-E-Mail erneut senden.

**Schritt für Schritt: Zugang zum CAC für den Kunden.**

1. Öffnen Sie im Kundenmanagement die Kundenseite. Wählen Sie in der Aktionsspalte „Customer Account Center“.
2. Das System sendet dem Kunden eine E-Mail mit dem Link. Den Link können Sie an jeden Kunden senden, der einen Vertrag im Status Aktiv, Suspendiert oder Abgelaufen hat. Fehlt die Mercedes-me-ID des Kunden, weisen Sie ihn darauf hin, dass er für den Abschluss gegebenenfalls ein Profil anlegen und aktivieren muss.
3. Der Kunde klickt auf den Link und erhält einen OTP-Code auf sein Telefon. Er gibt den Code im Dialog ein. Die Authentifizierung über Mercedes me erfolgt per QR-Code oder über den Link „follow this link“. Das System prüft die CIAM-ID des Kunden.
4. Auf der Vertragsseite sieht der Kunde seine Verträge in den Status Aktiv, Suspendiert oder Abgelaufen. Er wählt einen oder mehrere Verträge aus. Je nach Auswahl aktualisiert er die Kreditkartendaten oder ändert die Zahlungsart.
5. Auf der Dokumentenseite filtert der Kunde nach Dokumenttyp. Einzelne PDF-Dateien lädt er einzeln herunter. Bei mehreren Dokumenten erzeugt das System eine ZIP-Datei mit dem Namen „Documents_Referenznummer.zip“. Die Schaltfläche zur Auswahl aller Dokumente erzeugt ebenfalls eine ZIP-Datei.

**Schritt für Schritt: Zahlungsmethode im CAC ändern.**

1. Der Kunde meldet sich bei einem Mitarbeitenden, der in der Kundenverwaltung in der Aktionsspalte die Aktion „Change Payment Self Service“ auslöst.
2. Der Kunde erhält eine E-Mail mit dem Link zum CAC und meldet sich mit einem Einmalcode aus dem Telefon an.
3. Der Kunde wählt Verträge aus, die Kreditkarte oder Lastschrift nutzen. Die Auswahl ist nicht auf eine Zahlungsart beschränkt. Für Verträge mit Lastschrift wechselt er auf Kreditkarte und umgekehrt.

**Schritt für Schritt: Zahlung nach der Aktivierung über das CAC.**

1. Für einen Vertrag mit Einmalzahlung und Mpay ohne Mercedes-me-Profil wählen Sie beim Anlegen die Zahlungsart Mpay. Der Vertrag wird ohne Kartendaten unterzeichnet und aktiviert, der Zahlungsplan entsteht.
2. Nach der Aktivierung erstellt das System den Mpay-Zahlungslink für Pre-Authorization und Capture. Der Kunde erhält eine E-Mail mit dem Link zum CAC.
3. Im CAC authentifiziert sich der Kunde mit einem Captcha und einem SMS-Code. Das System prüft die Vertragsberechtigung und zeigt den Betrag und die Gültigkeit des Links an.
4. Der Kunde folgt dem Link zur Mpay-Seite, gibt die Kartendaten ein und zahlt. Eine Karte speichert das System dabei nicht. Revenue markiert die Rechnung als bezahlt und informiert das Vertragsmanagement.
5. Bei Erfolg erscheint eine Erfolgsmeldung, bei einem Fehler eine Fehlermeldung.

**Schritt für Schritt: Vorauszahlung bei Prepaid-Verträgen.**

1. Konfigurieren Sie das Produkt. Für Prepaid-Verträge ist ausschließlich das Zahlungsintervall „Einmalig“ zulässig. Für die Einmalzahlung erscheint die digitale Zahlungskarte.
2. Erstellen und unterschreiben Sie den Servicevertrag. Fällt die CAS-Prüfung negativ aus, erhält der Vertrag den Status „Bestätigt“.
3. Das System löst eine FI-Synchronisation für die SAP-Debitorennummer aus. Liegt sie vor, erzeugt Revenue einen Zahlungslink für Vorautorisierung und Capture.
4. Das System versendet eine E-Mail an den Kunden mit dem Link zum CAC. Im CAC sieht der Kunde den zu zahlenden Betrag und gelangt über den Zahlungslink zur Zahlungsseite. Nach der Zahlung erscheint eine Erfolgsmeldung. Die Vertragsaktivierung lässt sich danach fortsetzen.
5. Die Vorlage „Zahlung Prepaid-Verträge“ für die Kundenbenachrichtigung erfassen Sie mit dem Verwendungszweck „Payment Completion“, dem Markt, dem Kundentyp und dem Datum „Gültig ab“. Fehlende Pflichtfelder markiert das System. „Als Entwurf speichern“ ist möglich, „Veröffentlichen“ nicht.

**Ergebnis und Systemstatus.** Dokumente, die zu einem Servicevertrag erzeugt oder angehängt wurden, sind im CAC einsehbar. Die Aktivierungs-E-Mail enthält einen Link zum CAC, der Kunde kann ihn bei Bedarf erneut anfordern. Bei einer Änderung der Zahlungsart bestätigt das System die Auswahl mit einer Erfolgsmeldung. Das CAC kennzeichnet eine Kreditkarte nach der letzten Erinnerung und der Umsatzbestätigung als abgelaufen. Aktualisiert der Kunde die Karte vor Ablauf, sendet das System keine weiteren Erinnerungen. Voraussetzung ist ein aktiver Servicevertrag mit einer gültigen Kreditkarte, die über Asset-ID und NTR zugeordnet ist, eine mit dem Vertrag verknüpfte CIAM-ID und die funktionsfähige Mercedes-me-Authentifizierung.

**Erinnerungen bei ausbleibender Zahlung.** Wird der Zahlungslink nicht genutzt, sendet das System am siebten Tag eine Erinnerung mit der Vorlage „Payment Completion“, deren Tageszahl angepasst ist. Zusätzlich erhält der MO eine interne Benachrichtigung. Am 14. Tag suspendiert das System den Vertrag, sofern der Link weiterhin nicht genutzt ist, und informiert den MO. Ist der Zahlungslink abgelaufen, erzeugt eine Schaltfläche den Link neu. Zahlt der Kunde später, reaktiviert das System den Vertrag nach dem Eingang der Zahlung.

**Besonderheiten je Rolle.**

- Der MO legt Kunden und Verträge im Kundenmanagement an, auch für Bestandskunden der Gruppen Privat, Gewerbe und Gewerbe-Flotte. Er sendet die Aktivierungs-E-Mail erneut und startet die Zahlungsänderung.
- Die Aktion für Änderungsanfragen trägt die Bezeichnung „Customer Self Service“. Das System lädt die Vorlage, sendet die E-Mail an den Endkunden und protokolliert sie in der Vertragshistorie.

**Besonderheiten je Sparte und Markt.**

- Das CAC übernimmt den Markt aus der URL.
- Der Rechtsfooter erscheint auf allen Seiten des CAC einheitlich. Die Links „PROVIDER“, „Privacy Settings“, „Privacy Policy“, „Legal Notice“ und „Licenses“ öffnen Dokumente aus der Marktkonfiguration in der Sprache des Kunden. „PROVIDER“ zeigt das Impressum, „Privacy Settings“ zeigt die Cookie-Auswahl, die der Kunde speichern kann.

**Hinweise.**

- Der Link zum CAC erscheint in der Aktivierungs-E-Mail und in den Erinnerungen. Die E-Mail-Vorlagen für Serviceaktivierung und Aktualisierungen enthalten den Hinweis auf das CAC.
- Die Vorlage für die Zahlung trägt den Betreff „[Action Required] Referenznummer Please Complete Your Payment for your Service Contract“.

**Fehlerbehebung.**

- Gibt der Kunde einen falschen Captcha-Code ein, erscheint die Fehlermeldung in der Sprache des Marktes.
- Die Dokumentenseite zeigt Dokumentnamen und Dokumenttyp bei erhöhter Zoomstufe überlappungsfrei an.
- Ist die Umgebung nicht verfügbar, zeigt die Oberfläche eine Meldung, dass oneSCM gerade repariert wird.

{{Q:12.8}}

## 12.9 Massenanlage und Validierung von Fahrzeuglisten

**Zweck.** Die Massenanlage erstellt Serviceverträge für mehrere identisch konfigurierte Fahrzeuge eines Flottenkunden in einem Vorgang. Alle Verträge teilen Produkt, Konfiguration, Branche und Zahlungsintervall und sind über eine Group ID verbunden. Das System prüft die Fahrzeugliste, bevor Verträge entstehen.

**Voraussetzungen.** Der Kundentyp ist „Commercial Fleet“. Die Massenanlage ist für das konfigurierte Produkt aktiviert. Die Abläufe sind Fahrgestellnummer, VIN oder FIN mit verfügbarem Erstzulassungsdatum, Build to Order und Build to Stock. Eine Massenanlage mit einem Baumuster ist nicht möglich. Produkte mit einer Grace-Period-Kampagne sind ausgeschlossen.

**Rollen.** MO, MPC, Dealer und Dealer+ legen Massenanlagen für die Divisionen Passenger Car und Van an.

**Schritt für Schritt: Fahrzeugliste erfassen und validieren.**

1. Öffnen Sie „Contract Generation“ und starten Sie im Bereich „Contract Proposal“ ein Angebot. Wählen Sie den Kundentyp „Commercial Fleet“. Die Branche ist optional und steht auf „Not Relevant“. Geben Sie eine Kennung ein und ergänzen Sie die Angaben.
2. Wählen Sie das Produkt und schließen Sie die Produktkonfiguration ab. Ist die Massenanlage aktiviert, wird die Schaltfläche „Mass Creation“ in der Fußzeile aktiv.
3. Das System öffnet die Seite „Mass Creation“ und erzeugt eine Mass-Creation-ID. Der Kopfbereich zeigt einen Hinweis, dass alle konfigurierten Rabatte, Kampagnen und Sonderwünsche für alle gültigen Fahrzeuge gelten. Er zeigt die Anzahl der Fahrzeuge. Die Schaltflächen „Delete All Containing Error“, „Download Template“ und „Upload Template“ stehen bereit.
4. Erfassen Sie die Fahrzeuge in der Tabelle mit den Spalten Kennungstyp, Kennung, Erstzulassungsdatum, Kilometerstand, Kennzeichen und Aktion. Sie erfassen die Fahrzeuge manuell, per Copy and Paste oder über eine Excel-Datei im Format .xlsx. Die Liste umfasst bis zu 100 Fahrzeuge. Das Hauptfahrzeug steht in der ersten Zeile und ist nicht editierbar.
5. Beachten Sie die Formatregeln. Eine Fahrgestellnummer umfasst 17 Stellen. Das Erstzulassungsdatum hat das Format TT.MM.JJJJ. Der Kilometerstand besteht aus Ziffern. Das Kennzeichen umfasst höchstens 11 alphanumerische Zeichen. Eine Auftragsnummer umfasst 10 Ziffern. Bei einer Fahrgestellnummer ohne Erstzulassungsdatum bleibt das Datum leer und der Kilometerstand steht auf „0“.
6. Bestätigen Sie die Liste mit dem Häkchen. Das System setzt den Kennungstyp automatisch auf „Chassis Number“ oder „Order Number“. Fehlerhafte Zeilen sortiert das System nach oben.
7. Das System prüft die Liste gegen die Fahrzeugdaten. Stimmt das Erstzulassungsdatum nicht, erscheint „FRD incorrect for vehicle“. Liegt die Laufleistung unter dem letzten Servicestand, erscheint „Minimum value is XX.XXX. Correct the mileage“. Passt das Produkt nicht, erscheint „Product not found for vehicle“.
8. Korrigieren oder löschen Sie fehlerhafte Zeilen. „Delete All Rows having errors“ entfernt alle Zeilen mit Fehlermarker. Nach einer Korrektur ist „Update“ aktiv. Die Bestätigung bleibt deaktiviert, bis alle Fehler behoben sind.
9. Die Validierung kann einige Sekunden oder Minuten dauern. Das System zeigt einen Hinweis an. Sie dürfen die Seite verlassen. Sobald alle Fahrzeuge validiert sind, erhalten Sie eine Benachrichtigung. Der Floater zeigt den Fortschritt als Anzahl validierter Fahrzeuge zur Gesamtzahl. Er ist orange, bis alle Fahrzeuge validiert sind, und wechselt danach auf grün.
10. Bestätigen Sie die gültige Liste mit „Confirm“. Die Schaltfläche ist aktiv, sobald 2 bis 100 Fahrzeuge gültig sind.
11. Wählen Sie „Create Proposal“. Geben Sie Firmenname und USt-IdNr. oder Steuernummer ein. Das System prüft auf Dubletten. Ein bestehender Kunde übernimmt seine Daten automatisch. Andernfalls erfassen Sie die Kunden- und Zahlungsinformationen.
12. Die Übersicht und Bestätigung zeigt die Group ID, die Fahrzeugtabelle mit Referenznummer und Vertragsbeginn sowie die Produktoptionen. Die Schaltfläche „Edit“ ist für Produkt und Fahrzeuge ausgegraut. Der Zahlungsplan entspricht dem Zahlungsplan des Hauptfahrzeugs. Mit „Confirm“ bestätigen Sie die Angebote. Die Signatur startet je Group ID.
13. Aktivieren Sie jeden Vertrag nach dem bestehenden Aktivierungsablauf.

**Ergebnis und Systemstatus.** Für jedes gültige Fahrzeug entsteht ein eigener Servicevertrag mit derselben Produktkonfiguration, denselben Deckungen und derselben Struktur des Zahlungsplans. Die Verträge sind über die Group ID verbunden. Die Group ID erscheint im Reiter „Contract“ der Vertragsdetailansicht und im Proposal Management. Im Proposal Management und im Contract Management steht der Suchfilter „Group ID“ bereit. Verträge ohne Group ID zeigen einen Strich mit dem Hinweis „Group ID is available only for Mass Creation“. Der Vertragsbeginn richtet sich nach dem Produkt. Bei FRD-bezogenen Produkten mit vorhandenem Erstzulassungsdatum beginnt der Vertrag mit diesem Datum, andernfalls steht „Not yet available“. Bei Produkten ohne Erstzulassungsbezug zeigt das System das Erstellungsdatum.

**Sonderfall bei der Massenanlage.** Für eine Massenanlage mit einem Sonderfall gelten nur gültige Fahrzeuge der validierten Liste. Die Sonderfallanfrage gilt für alle Verträge derselben Group ID. Die Übersicht zeigt den Suchfilter „Search by Group ID“ und die Spalten Referenznummer oder Group ID, Kundenname, Anfragetyp, Fahrzeuganzahl, Eingangsdatum, Status, Fälligkeitsdatum und Aktionen. Die Prüfseite zeigt den Kundenpreis als Nettopreis pro Fahrzeug, für die Fahrzeuganzahl und pro Intervall. Der Händler wendet einen Händlerrabatt mit „Dealer Discount“ auf alle Verträge der Group ID an. Mit „Confirm“ übernehmen Sie die genehmigten Preise und Konfigurationen auf alle Verträge. Der Sonderfall unterstützt alle Zahlungsintervalle.

**Besonderheiten je Rolle.**

- Der Händler startet die Massenanlage für Flottenkunden und sieht die Validierung in der Benachrichtigung. Er kann die Liste jederzeit erneut bestätigen.
- Ein Benutzer mit der Rolle „Nur Ansicht“ kann die Kennung nicht ändern.
- Der Vertrag mit Deal-ID bezieht nur fahrzeugbezogene Daten ein. Sonderpreise und Kundeninformationen, die mit der Deal-ID verknüpft sind, werden ignoriert.

**Besonderheiten je Sparte und Markt.**

- Die Massenanlage steht für die Divisionen Passenger Car und Van zur Verfügung.
- Die Deal-ID gilt als Kennung für Flottenkunden, wenn die Massenanlage für das Produkt aktiviert ist. Die Aktivierungsbenachrichtigung enthält die Deal-ID und die zugeordnete Fahrgestellnummer.

**Hinweise.**

- Das System validiert die Liste über den Fahrzeugdienst und den Produktdienst. Pro Anfrage sind bis zu 100 Identifikatoren zulässig, FIN, VIN oder Auftragsnummer. Baumuster-Identifikatoren liefern einen Fehler.
- Die Antwort enthält für jedes gültige Fahrzeug das Erstzulassungsdatum, den Kilometerstand, den Status, die kompatiblen Produkte und den Monats- und Gesamtpreis.
- Ändern Sie die Liste oder die Konfiguration, setzt das System die Validierung zurück. „Create Proposal“ ist dann deaktiviert, bis Sie die Liste erneut bestätigen.
- Das System erkennt FIN und VIN desselben Fahrgestells als Duplikate.
- Bei einer Massenanlage erhalten Händler, MO und MPC eine interne Benachrichtigung über das Ergebnis.
- Die Massenanlage erstellt keine Verträge für Fahrzeuge, die Sie aus der Liste gelöscht haben.
- Bei einer Änderung der Fahrzeugliste nach der Validierung wird die vollständige Liste erneut verarbeitet.
- Der MO ändert den Status mehrerer Verträge über „Bulk Status Update“. Die Obergrenze liegt bei 200 Verträgen. Ab einem Schwellenwert prüft der MPC den Vorgang, siehe Kapitel 8.2.

**Fehlerbehebung.**

- Enthält die Datei mehr als 100 Datensätze, lehnt das System den Upload ab. Enthält sie Datensätze im falschen Format, lehnt das System den Upload ebenfalls ab.
- Die Meldung „Enter mandatory fields“ erscheint bei einer Fahrgestellnummer mit Erstzulassungsdatum ohne Laufleistung oder Kennzeichen. Die Meldung „Duplicate Data“ zeigt doppelte Zeilen an. Die Meldung „Enter a valid identifier“ erscheint bei einer ungültigen Kennung.
- Die Meldung „Kindly correct the data“ erscheint, wenn bei einer Auftragsnummer Erstzulassungsdatum, Laufleistung oder Kennzeichen befüllt sind.
- Wird die Kennungsliste erneut eingefügt, ordnet das System die Werte korrekt zu. Die Pflichtfeldmeldung bleibt bestehen.
- Fahrzeuge mit Massenanlage und Erstzulassungsdatum lassen sich mit Erstzulassungsdatum und Kennzeichen aktualisieren.
- Der Kilometerstand und das Kennzeichen lassen keine Eingabe über die maximale Zeichenzahl zu.
- Die Filter und die Suche nach Referenznummer in der Sonderfall-Tabelle funktionieren.

{{Q:12.9}}

## Verschiebung in andere Kapitel

Die folgenden Inhalte gehören nach den Abschnitten der Gliederung in andere Kapitel. Die Angabe nennt das Zielkapitel und den Batch-Verweis.

{{VERSCHIEBUNG}}

## Klärungsbedarf

Die folgenden Punkte betreffen Widersprüche, unklare Aussagen sowie eingestellte oder geschlossene Meldungen. Sie sind nicht Teil der Beschreibung im Fließtext. Die Batch-Verweise nennen die betroffenen Abschnitte.

**Widersprüche im Ausgangsmaterial.**

1. **Bestand der Massenanlage.** Die Batches 954.1, 931.1, 968.1 und 935.2 beschreiben die Massenanlage als abgebrochen, als Ziel oder als nicht möglich. Die Batches 915.1, 917.1 bis 917.7, 914.1, 928.2 und 1061.2 beschreiben die Massenanlage als vorhandene Funktion. Abschnitt 12.9 folgt den zweiten Batches. Bitte bestätigen.
2. **Sonderfall bei einem Baumuster.** Batch 929.8 schließt Sonderfallanfragen bei einem Baumuster aus. Die Batches 959.1 und 959.3 beschreiben die Schaltfläche für die Kennung BM6. Batch 954.1 nennt den BM6 nur für Mehrfahrzeuganlagen als nicht unterstützt.
3. **Sonderfall-Kennzeichen pro Produkt.** Die Batches 1186.1 und 907.2 beschreiben die Steuerung je Produkt und Kundentyp. Batch 906.2 erklärt dieselbe Funktion für abgebrochen. Die Regel für die Kundentypen Commercial Fleet und Commercial Governmental stammt aus Batch 1186.1.
4. **Vier-Augen-Prinzip bei Sonderfällen.** Batch 888.1 erlaubt dem Anfragenden die Genehmigung, wenn ein anderer Benutzer validiert hat. Batch 890.1 schließt die Genehmigung durch den Anfragenden aus. Batch 382.1 verlangt einen zweiten Nutzer, der weder der erste Nutzer noch der Anfragende ist.
5. **Fristen bei Grace-Period-Anfragen.** Batch 1002.2 nennt sieben Tage für die Entscheidung mit Löschung der Anfrage. Batch 881.6 setzt den Status Expired nach Einreichung plus Gültigkeit aus den Market Settings. Batch 1014.5 nennt maximal sieben Tage im Status Waiting for Activation. Die Rückweisung des Vertrags nach 30 Tagen nennt Batch 1002.2 als nicht abschließend geklärt.
6. **Statusliste bei der Genehmigung.** Batch 1002.2 nennt die Status Created, Confirmed und Waiting for Activation. Batch 1111.3 ergänzt den Status Waiting for Confirmation.
7. **Status einer Grace-Period-Kampagne nach dem Enddatum.** Batch 1227.4 nennt für die Karenzzeit den Status Active, Batch 1154.4 den Status Finished. Batch 1227.4 erlaubt bei Finished nur das Duplizieren, Batch 1153.2 nennt Anzeigen, Bearbeiten, Duplizieren und Deaktivieren.
8. **Reaktivieren.** Batch 1153.2 beschreibt eine neue Version mit Vier-Augen-Freigabe. Batch 1227.5 beschreibt eine direkte Rückkehr zum Status Active. Batch 1258.7 entfernt die Aktion bei abgelaufenem Gültigkeitsende.
9. **Aktion „View“ und Standardansicht.** Die Batches 1214.2 und 1259.1 nennen die Aktion „View“, Batch 1264.4 entfernt sie. Batch 1227.3 zeigt alle Kampagnen als Standard, die Batches 1154.4 und 1250.1 nur die Status Upcoming und Active. Batch 1166.1 benennt Upcoming in Ready um.
10. **Bezeichnungen der Kampagnentypen.** Die Batches 1205.2 und 1226.2 nennen die Rabatttypen Percentage, Fixed Amount und Sticker Price. Batch 1163.5 nennt Sticker Type, Batch 111.1 Sales und After Sales als Discount Type, Batch 1270.1 Sales Campaign und After Sales Campaign als Campaign Type.
11. **Dezimaltrennzeichen.** Die Batches 1226.2 und 1202.1 nennen den Punkt, die Batches 1268.3 und 1270.1 das Komma.
12. **External Campaign ID.** Die Batches 1250.1, 1142.3 und 1143.4 nennen die Pflicht und eine Länge von zehn Zeichen. Batch 1226.2 nennt sie optional mit acht Zeichen. Batch 1143.4 erlaubt nur alphanumerische Zeichen, Batch 1250.1 und 1142.3 Sonderzeichen. Die Eindeutigkeit nennt Batch 1259.1 bezogen auf Markt und Gültigkeit, die Batches 1249.1, 1250.1 und 1154.4 bezogen auf die Fahrzeuggruppe.
13. **Kostenstelle, Debitorennummer und Provision.** Batch 1226.2 nennt die Kostenstelle mit zehn alphanumerischen Zeichen und die Debitorennummer mit zehn Stellen. Batch 1251.2 nennt Ziffern mit Bindestrich und eine optionale Debitorennummer. Batch 1261.2 verlangt nur eines der beiden Felder. Batch 1246.3 entfernt die Provision Component, Batch 1226.2 nennt sie als Pflichtfeld, Batch 1260.3 als statischen Wert je Markt.
14. **Maximalbetrag.** Batch 1261.2 begrenzt die Felder Amount und Maximum Amount auf fünf Zeichen. Die Batches 1226.2 und 1202.1 nennen acht Zeichen. Batch 1268.3 nennt den Maximalbetrag als Pflicht, Batch 1226.2 als optional.
15. **Sticker-Price-Matrix und Gesamtrabatt.** Batch 1187.1 beschreibt, dass das System eine höhere Eingabe nicht verhindert und dass der Gesamtrabatt entfällt. Batch 1260.3 erlaubt nur Werte unter dem Monatswert. Die Batches 1202.1 und 1277.5 beschreiben einen Gesamtrabatt.
16. **Prüfung bei der Definition.** Batch 1188.5 beschreibt, dass bei der Definition keine Validierung stattfindet. Die Batches 1226.2 und 1261.2 beschreiben Feldprüfungen beim Anlegen.
17. **Automatische Anwendung als Standard.** Batch 1197.2 nennt das Kontrollkästchen „Automatisch anwenden“ mit dem Standard nicht aktiviert. Batch 1226.2 nennt „Auto apply in dealer sales view“ als standardmäßig aktiviert.
18. **Summenregel und vollständige Förderung.** Die Batches 1017.3 und 1017.7 verlangen eine Summe unter dem Vertragswert. Batch 1092.1 beschreibt eine vollständige Förderung bei gleicher Summe. Batch 170.2 beschreibt keinen Zahlungsplan bei vollständiger Deckung, die Batches 908.6 und 1092.1 einen Zahlungsplan mit dem Wert 0.
19. **Folgen eines nicht genutzten Zahlungslinks.** Batch 587.1 lehnt einen Prepaid-Vertrag nach Fristablauf ab. Batch 580.1 suspendiert den Vertrag am 14. Tag.
20. **Statusbezeichnungen und Angebotsbereich.** Batch 973.4 nennt „Erstellt“, „Wartet auf Bestätigung“ und „Bestätigt“. Die Batches 908.6 und 1002.2 nennen die englischen Status. Batch 960.1 nennt den Bereich „Contract Proposal“, Kapitel 5.1 nennt „Contract Offering“.
21. **Langform von MPC.** Batch 441.3 nennt MPC als Market Product Contact, Batch 989.3 als Market Performance Center. Der Abschnitt verwendet nur die Abkürzung.
22. **Kundentypen.** Batch 994.1 nennt zwei Optionen, Privat und Gewerblich. Die Batches 1163.1, 1185.2 und 1193.2 nennen Commercial Fleet als dritten Kundentyp. Kapitel 5.1 nennt weitere Kundentypen.
23. **Name der Massenanlage und Kundentyp.** Batch 917.3 nennt die Schaltfläche „Mass Creation“, die Batches 928.2 und 968.1 „Mehrere Fahrzeuge hinzufügen“. Batch 914.1 nennt den Kundentyp Fleet Customer, Batch 917.2 Commercial Fleet.
24. **Vertriebskanal und Verkaufsebene.** Batch 1226.2 nennt den Vertriebskanal als Pflichtfeld. Die Batches 1154.3 und 1175.3 nennen die Verkaufsebene als Pflichtfeld. Das Verhältnis beider Felder ist nicht beschrieben.
25. **Begriffe für Grace-Period-Kampagnen.** Die Batches 1014.1 und 953.1 nennen Kulanzzeit, die Batches 441.3 und 1227.4 Karenzzeit, Batch 1154.4 Nachfrist und Batch 1188.5 Kulanzfrist. Das Handbuch verwendet Grace-Period-Kampagne und Karenzzeit. Bitte die Begriffe festlegen.
26. **Schreibweise der Meldung.** Die Meldung zur Anfrage lautet im Ausgangsmaterial „The request has been submited!“. Die Batches 440.3, 441.3, 443.3, 446.4 und weitere nennen sie. Bitte die Schreibweise prüfen.
27. **Ort der Ansichtsfunktion.** Ein Abschnitt beschreibt die Ansicht „View“ als Produktfunktion, ein weiterer als Hyperlink. Siehe Punkt 9.

**Einzelmeldungen mit Batch-Verweis.**

{{KLAERUNG}}

## Vorschläge zur Gliederung

1. **Kapitel 12.3 aufteilen.** Der Abschnitt 12.3 umfasst die Anlage, die Verwaltung, die Anwendung im Angebot, die Grace-Period-Anfrage und die Berechnung. Drei Unterkapitel würden die Lesbarkeit verbessern: Kampagnen anlegen und verwalten, Kampagnen im Angebot anwenden und Berechnung von Kampagnen und Rabatten.
2. **Abstimmung mit Kapitel 14.** Kapitel 5.6 verweist für die Pflege von Kampagnen auf Kapitel 14. Die Anlage und Verwaltung der Kampagnen sollte deshalb mit Kapitel 14 abgestimmt werden, damit die Verantwortung eindeutig ist.
3. **Grace-Period-Kampagnen als eigenes Unterkapitel.** Die Anfrage, die Freigabe, die Fristen und die Benachrichtigungen bilden einen zusammenhängenden Ablauf. Er ist in den Abschnitten 12.3, 12.6 und 12.7 verteilt.
4. **VIP-Ablauf als eigenes Unterkapitel.** Der Ablauf für Geschäftskunden mit der 100-%-Kampagne steht im Abschnitt 12.2. Er betrifft die Zahlungsabwicklung und sollte mit Kapitel 7 abgestimmt werden.
5. **Sonderfall-Grundlagen zusammenführen.** Die Sonderfallanfrage erscheint in den Abschnitten 12.2, 12.4, 12.5 und 12.9. Die Grundlagen sollten in Abschnitt 12.4 stehen, die Massenanlage in Abschnitt 12.9.
6. **Customer Account Center aufteilen.** Abschnitt 12.8 umfasst den Zugang, die Zahlungsabläufe, die Erinnerungen und die Rechtshinweise. Die Zahlungsabläufe Prepaid und Payment Completion sollten als eigenes Unterkapitel stehen.
7. **Massenanlage aufteilen.** Abschnitt 12.9 umfasst die Erfassung und Validierung der Fahrzeugliste, die Angebotserstellung und den Sonderfall. Die Validierung und die Sonderfallbearbeitung sollten getrennt stehen.
8. **Reporting und Dokumente.** Die Zuordnung von Kampagnen zu Dokumenten und Berichten gehört in Kapitel 11. Die Verweise sollten dort ergänzt werden.
9. **Kein Anwenderinhalt.** DevOps-Themen und interne Qualitätsprüfungen gehören nicht in das Benutzerhandbuch. Die Verschiebungen nennen die betroffenen Batches.
