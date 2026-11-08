# 6 Servicevertrag anlegen und Antrag abschließen

Dieses Kapitel beschreibt den Weg vom vorbereiteten Angebot (Kapitel 5) bis zum gespeicherten Antrag mit Referenznummer. Sie arbeiten dabei im Assistenten „Vertrag erstellen“, den Sie über den Menüpunkt „Contract Proposal“ (Antragserstellung) erreichen. Nach der Produktkonfiguration erfassen Sie in Schritt 2 „Customer & Payment Information“ die Kunden- und Zahlungsinformationen und kontrollieren in Schritt 3 „Overview & Confirmation“ (Übersicht und Bestätigung) alle Angaben, bevor Sie den Antrag bestätigen und zur Unterzeichnung übergeben (Kapitel 7).

oneSCM unterscheidet in der Bezeichnung zwischen Antrag und Vertrag: Solange ein Vorgang nicht aktiviert ist, heißt er „Antrag“ (englisch „Proposal“); nach der Aktivierung bis zum Vertragsende heißt er „Vertrag“. Die Nummer, die das System beim Anlegen vergibt, heißt von der Erstellung bis zum Abschluss „Referenznummer“ („Reference Number“). Gespeicherte Anträge finden Sie unter „Proposal Management“ (Antragsverwaltung, Kapitel 8.1).

Quellen: Batch 1103.1

## 6.1 Voraussetzungen und Vertragsart prüfen

**Zweck.** Bevor Sie die Kunden- und Zahlungsinformationen erfassen, stellen Sie sicher, dass Vertragsart, Fahrzeug, Produkt und Kundengruppe zueinander passen und dass Sie den Antrag für den gewählten Händlerbetrieb anlegen dürfen. Produkt, Laufzeit, Laufleistung und Preis sind in Schritt 1 festgelegt (Kapitel 5); im weiteren Ablauf ändern Sie diese Angaben nur über „Back“ zum vorherigen Schritt.

**Voraussetzungen.**

- Das Angebot ist vorbereitet, die Fahrzeugdaten sind geladen und das Produkt ist konfiguriert (Kapitel 5).
- Der Kunde ist angelegt oder zugeordnet (Kapitel 4).
- Ihre Rolle ist für die Antragserstellung freigeschaltet (Kapitel 2).

**Rollen.** Händler erfassen, kontrollieren und speichern den Antrag. MPC-Nutzer durchlaufen denselben Assistenten, etwa bei Sonderfällen (Kapitel 6.5). Endkunden können den Ablauf über eine angebundene Drittanbieter-App durchführen; für sie gelten dieselben Pflichtfeld- und Validierungsregeln. Bei allen händlerbezogenen Aktionen, darunter das Anlegen und Ändern eines Antrags, prüft das System neben den fachlichen Berechtigungen auch, ob die Organisations-ID (Outlet-ID) Ihres angemeldeten Benutzers mit der Outlet-ID des Vorgangs übereinstimmt. Die Outlet-ID stammt aus dem Berechtigungsmanagement (Kapitel 19.16). Stimmen die IDs nicht überein, lehnt das System die Aktion ab; wenden Sie sich dann an Ihre Berechtigungsverwaltung (Kapitel 2.5).

**Vertragsart prüfen.**

1. Kontrollieren Sie im Kopfbereich des Assistenten die gewählte Vertragsart und den Einstiegspunkt (Kapitel 5.1).
2. Prüfen Sie, ob Kundentyp (Privat- oder Geschäftskunde, Kapitel 4.1) und Produkt für diese Vertragsart zulässig sind. Abweichende Kundengruppen oder Konditionen führen zu einer Sonderfreigabe (Kapitel 6.5).
3. Prüfen Sie, ob Fahrgestellnummer, Erstzulassungsdatum (FRD) und Kilometerstand vorliegen. Fehlen diese Angaben, legt das System den Antrag mit einem eingeschränkten Datenumfang an (Kapitel 6.3 und 6.6).

**Besonderheit Leasing-Verträge aus MBLD.** Leasing-Verträge, die MBLD über die Edge-Leasing-Schnittstelle anlegt, erscheinen für MO- und MPC-Anwender in der Antragsverwaltung im Status „Created“. Öffnen Sie einen solchen Vertrag, zeigt das System die Seite „Overview & Confirmation“ in einem eingeschränkten Modus: Die Bearbeitungsfunktionen sind ausgegraut, der Zahlungsplan wird nicht angezeigt, die Schalter „Notification Required“ und „Signature Required“ stehen auf „Aus“ und lassen sich nicht bedienen, und die Antragsvorschau ist deaktiviert. Ihnen stehen zwei Aktionen zur Verfügung: Der Zurück-Pfeil führt zur Startseite der Antragsverwaltung, „Confirm“ setzt den Vertrag über die Edge-Leasing-Schnittstelle unmittelbar von „Created“ auf „Confirmed“. Eine Auswahl der Unterschriftsart erfolgt nicht, der Zwischenstatus „Waiting for Confirmation“ wird nicht durchlaufen.

**Hinweis.** Angebundene Systeme können einen Servicevertrag auch über die Schnittstelle zum Anlegen eines Vertrags erzeugen. Der Vertrag entsteht, sobald alle Pflichtfelder übermittelt sind, und erhält den Status „Created“; fehlen Pflichtfelder, enthält die Antwort der Schnittstelle eine Fehlermeldung (Kapitel 19.21).

Quellen: Batch 654.1, 873.3, 864.3, 1005.3, 255.2, 1040.2

## 6.2 Vertragsdaten und Pflichtfelder erfassen

**Zweck.** In Schritt 2 „Customer & Payment Information“ erfassen Sie die Angaben zum Kunden, zu Steuer und Rechtseinheit sowie zur Zahlung. Mit „Weiter“ („Next“) legt das System den Antrag an.

**Voraussetzungen.** Schritt 1 ist vollständig; der Kunde ist ausgewählt oder wird in diesem Schritt neu erfasst (Kapitel 4.2 und 4.3).

**Pflichtfelder.** Alle Pflichtfelder sind mit einem Sternchen (*) gekennzeichnet. Die Schaltfläche „Weiter“ ist von Beginn an aktiv. Klicken Sie darauf, solange Pflichtfelder leer oder ungültig sind, hebt das System alle betroffenen Felder hervor und zeigt unter jedem Feld die Meldung „This field is mandatory. Please enter valid content“. Sie gelangen erst zur Übersicht und Bestätigung, wenn alle Pflichtfelder korrekt ausgefüllt und validiert sind. Das gilt für Händler, MPC-Nutzer und Endkunden in einer Drittanbieter-App gleichermaßen.

**Schritt für Schritt.**

1. Erfassen oder prüfen Sie im Bereich „Customer Details“ Vor- und Nachname, E-Mail-Adresse und Mobilnummer des Kunden sowie die Angaben unter „Marketing Preferences“ (Kapitel 4.3).
2. Erfassen Sie im Bereich „Address“ Postleitzahl, Ort, Straße und Hausnummer. Sobald die Pflichtfelder der Adresse ausgefüllt sind, prüft das System die Adresse über die Domäne Customer & Partner Management auf Plausibilität und zeigt gegebenenfalls Vorschläge oder Hinweise an. Bei plausibler Hausnummer bestätigen Sie den Wert im Pop-up „Please confirm the House Number“ mit „YES“; mit „NO“ bleibt das Feld zu bearbeiten. Die Meldungen sind in Kapitel 6.4 beschrieben.
3. Kontrollieren Sie den Bereich „Tax & Legal Details“. Die „Tax Classification“ (Steuerklassifizierung) ist ein Pflichtfeld mit den Werten „Diplomat“, „Exempt“, „Internal“, „Reduced“ und „Standard“. Der „Tax Classification Code“ ist optional und bietet „Regular (1)“, „Exempt (Diplomats, no Tax) (0)“ und „Reduced (living in a special Region) (2,3,4)“. Die „Legal Entity“ (Rechtseinheit) ist ein Pflichtfeld. Für den Markt Deutschland sind die Felder mit „Standard“, „Regular (1)“ und „Passenger Cars“ vorbelegt und schreibgeschützt.
4. Erfassen Sie im Bereich „Payment Details“ die Zahlungsinformationen. Das Feld „Account Holder“ ist ein Pflichtfeld, schreibgeschützt und mit Vor- und Nachname des Kunden vorbelegt. Die IBAN ist ein Pflichtfeld; über „Add Bank Account“ geben Sie sie ein. Bei einer gültigen IBAN befüllt das System Bankname, BIC und Währung automatisch; die Währung wählen Sie andernfalls aus einer Auswahlliste, in der EUR an erster Stelle steht, Bankname und BIC sind optional. Die Schaltfläche zum Bestätigen des Bankkontos ist erst aktiv, nachdem Sie die SEPA-Einwilligung aktiviert haben. Eine neu hinzugefügte IBAN hat zunächst den Status „TO BE CONFIRMED“. Zahlungsart, Zahlungsintervall, Zahler und Rechnungsempfänger sind in Kapitel 7.1 bis 7.3 beschrieben.
5. Aktivieren Sie bei Bedarf die Sammelrechnung über den Schieberegler am Seitenende (Kapitel 11.3).
6. Klicken Sie auf „Weiter“.

**Kennzeichen.** Liegen Fahrgestellnummer und Erstzulassungsdatum vor, ist das Kennzeichen ein Pflichtfeld; ohne Eingabe zeigt das System eine Fehlermeldung. Das Kennzeichen wird nicht an die Produktsuche übergeben und beeinflusst die angebotenen Produkte nicht. Sie können das Kennzeichen auch in der Übersicht nachtragen (Kapitel 6.6).

**Ergebnis und Systemstatus.** Sind alle Pflichtfelder gültig, löst „Weiter“ nacheinander folgende Schritte aus: Das System führt alle automatisierten Prüfungen durch, vergibt die Referenznummer, legt Antrag und Kunde an und ruft den Zahlungsplan über das Revenue-System ab. Anschließend öffnet sich Schritt 3 „Overview & Confirmation“ (Kapitel 6.3 und 6.6); der Antrag hat den Status „Created“.

**Hinweis.** Im Handbuchbeispiel wird ein Antrag für einen gewerblichen Kunden gestellt; Abweichungen für Privatkunden und für Großkunden in KAM-Betreuung sind in Kapitel 4.1 und 12 beschrieben.

Quellen: Batch 654.1, 669.2, 1034.3, 1036.2, 631.2, 1108.5, 1081.3; Quick-Guide-Inhalt (Van-Vorlage)

## 6.3 Kunden-, Fahrzeug- und Produktzuordnung kontrollieren

**Zweck.** Nach dem Wechsel in Schritt 3 kontrollieren Sie, ob Kunde, Fahrzeug, Produkt und Zahlungsplan zusammengehören, bevor Sie den Antrag bestätigen. Die Seite „Overview & Confirmation“ fasst alle Angaben aus Schritt 1 und 2 zusammen.

**Schritt für Schritt.**

1. Prüfen Sie im Bereich „Customer & Payment Information“ die Unterbereiche „Customer Details“, „Marketing Preferences“, „Address“ und „Payment Information“. Im Unterbereich „Payment Information“ sehen Sie auch die Gültigkeit des SEPA-Mandats.
2. Prüfen Sie im Bereich „Vehicle Information“ Fahrgestellnummer, Kennzeichen („License Plate“), Erstzulassungsdatum und Kilometerstand. Felder, die wegen fehlender Fahrgestellnummer, fehlendem Erstzulassungsdatum, fehlendem Kilometerstand, fehlender vorgesehener Vertragslaufzeit oder fehlendem Vertragsbeginn nicht gefüllt werden können, zeigt das System ohne Wert an. Bei Vertragsbeginn und Laufzeit erscheint dann der Hinweis „Will be updated when FRD is available“ (Kapitel 8.3).
3. Prüfen Sie Produkt, Laufzeit, Laufleistung und Preis. Die Übersicht zeigt den Basispreis und, falls zutreffend, den Preis inklusive Händlerrabatt. Rabatte aus einer Kulanzkampagne stellt die Übersicht nicht dar; sie werden erst bei der Aktivierung wirksam (Kapitel 5.6 und 12.3).
4. Kontrollieren Sie im Abschnitt „Zahlungsplan“ die Plan-Vorschau-Tabelle, die das System aus dem Revenue-System abgerufen hat: Zahlungsintervall, Raten und Fälligkeiten müssen zum Produkt und zur gewählten Zahlungsart passen (Kapitel 7.1 und 11.1).
5. Öffnen Sie die „Antragsvorschau“ („Proposal Preview“) als PDF und prüfen Sie, ob die Vertragsdokumente Kunde, Fahrzeug und Produkt korrekt wiedergeben (Kapitel 7.4).

**Korrekturen.** Das Feld „License Plate“ sowie die Felder der Unterbereiche „Customer Details“, „Marketing Preferences“ und „Address“ bearbeiten Sie direkt auf der Übersichtsseite; auch in der Plan-Vorschau-Tabelle sind einzelne Felder bearbeitbar. Bearbeiten Sie jeweils nur ein Feld und bestätigen Sie es, bevor Sie das nächste ändern; beim gleichzeitigen Bearbeiten zweier Felder zeigt das System eine Fehlermeldung. Bei ungültigen Eingaben erscheinen dieselben Validierungsmeldungen wie in Schritt 2 (Kapitel 6.4). Für Änderungen an Produkt, Laufzeit oder Laufleistung gehen Sie mit „Back“ zu den vorherigen Schritten zurück.

**Besonderheiten.** Händler und Market Operations sehen bei fehlender Fahrgestellnummer oder fehlenden FRD-bezogenen Daten eine unterschiedlich befüllte Übersicht; die nicht erfassbaren Felder bleiben in beiden Ansichten leer.

Quellen: Batch 1058.4, 1056.7, 1013.3, 1014.4, 1081.3, 1103.1; Quick-Guide-Inhalt (Van-Vorlage)

## 6.4 Validierungsregeln und Fehlermeldungen

**Zweck.** Dieses Unterkapitel fasst die Regeln zusammen, nach denen oneSCM Ihre Eingaben in der Antragserstellung prüft, und erklärt, wie Sie auf die Meldungen reagieren. Rote Meldungen blockieren den Fortschritt und müssen bereinigt werden; gelbe Hinweise erlauben das Weitergehen.

**Pflichtfelder.** Leere oder ungültige Pflichtfelder markiert das System beim Klick auf „Weiter“ und zeigt die Meldung „This field is mandatory. Please enter valid content“. Füllen Sie alle markierten Felder, bevor Sie erneut auf „Weiter“ klicken.

**Adressprüfung.** Die Adresse wird nicht nur auf Format und Länge, sondern auf Gültigkeit geprüft. Das System zeigt je Feld eine Meldung und hält „Weiter“ gesperrt, bis das Feld gültig ist:

- Postleitzahl nicht plausibel: „Please insert a valid Post Code“.
- Ort nicht gültig: „Please insert a valid City“.
- Straße nicht plausibel: „Please insert a valid Street name“.
- Hausnummer: Pop-up „Please confirm the House Number“ mit „YES“ und „NO“. Mit „YES“ übernimmt das System den Wert; mit „NO“ erscheint „Please insert a valid House Number“.

Ändern Sie die Adresse nach der Vergabe der Referenznummer, aber vor der Bestätigung des Antrags, prüft das System die Adresse erneut und überschreibt die gespeicherten Daten.

**Kundendaten.** Vor- und Nachname sind Pflichtfelder mit höchstens 35 Zeichen und akzeptieren nur Buchstaben des deutschen und englischen Zeichensatzes. Die E-Mail-Adresse ist ein Pflichtfeld; bei ungültigem Format zeigt das System eine Validierungsmeldung. Die Mobilnummer wird gegen Mercedes me geprüft; bei ungültiger Nummer erscheint die Meldung „Validation error from Mercedes me … is not a valid mobile number“. Die Meldung zu einer ungültigen Postleitzahl bleibt sichtbar, bis Sie das Feld berichtigen.

**Steuer- und Identifikationsnummern.** Formatregeln für Umsatzsteuer-Identifikationsnummer, Steuernummer und Postleitzahl sind je Markt in der Marktkonfiguration hinterlegt (Kapitel 14.2); sie gelten für Pkw und Van gleich. Bei der Prüfung der USt-IdNr. übermittelt das System nur die Ziffern; das Länderkennzeichen geben Sie dennoch wie gewohnt ein. Die E-Mail-Adresse des Verkäufers im Vertrag darf bis zu 255 Zeichen lang sein.

**Bankdaten.** Die IBAN wird beim Anlegen des Antrags und bei einer späteren Änderung an einem aktiven Vertrag über die SwiftRef-Schnittstelle geprüft. Das System kontrolliert, ob die IBAN existiert, und befüllt Bankname, BIC und Währung mit den gelieferten Daten. Bei ungültiger IBAN erscheint eine Validierungsmeldung, und „Weiter“ bleibt in den Zahlungsinformationen gesperrt. Eine IBAN, die in oneSCM bereits vorliegt, wird nicht erneut geprüft. Der Kontoinhaber ist mit Vor- und Nachname vorbelegt.

**Fahrzeugdaten.** Eine Fahrgestellnummer hat genau 17 Zeichen; andere Längen behandelt das System nicht als Fahrgestellnummer. Meldungen zu nicht erkannten Kennungen und zu Produkten, für die Fahrzeugalter oder Laufleistung außerhalb der Grenzen liegen, sind in Kapitel 5.2 und 5.3 beschrieben.

**Technische Fehler.** Lehnt das Backend das Anlegen mit dem Fehler „400 Bad Request“ ab, zeigt das System den vollständigen Fehlertext in einer Toast-Meldung. Notieren Sie den Text zusammen mit Kennung und Zeitpunkt für den Supportfall (Kapitel 23.4).

**Fehlerbehebung.**

- „Weiter“ reagiert nicht oder bleibt gesperrt: Prüfen Sie die Adressfelder und die IBAN; beide halten die Schaltfläche gesperrt, bis sie gültig sind.
- Feld bleibt rot markiert, obwohl es befüllt ist: Prüfen Sie Zeichensatz und Länge (Name höchstens 35 Zeichen, nur Buchstaben; Fahrgestellnummer genau 17 Zeichen).
- Mobilnummer wird abgelehnt: Erfassen Sie die Nummer im internationalen Format mit Ländervorwahl und ohne Leerzeichen.

Quellen: Batch 654.1, 669.2, 30.3, 621.3, 885.1, 1094.4, 631.2, 1314.5, 1081.4

## 6.5 Sonderfreigaben im Standardprozess erkennen

**Zweck.** Weicht ein Antrag vom Standard ab, etwa durch abweichende Konditionen, Rabatte oder eine nicht vorgesehene Kundengruppe, benötigt er eine Freigabe durch das MPC, bevor der Händler den Antrag abschließen und aktivieren kann. Die vollständige Sonderfallanfrage mit Begründung ist in Kapitel 12.4 beschrieben, die MO-Prüfung in Kapitel 9.

**Rollen.** Der Verkäufer vervollständigt das Angebot, ergänzt die Kundendaten und erstellt den Antrag. Das MPC erfasst und konfiguriert die Rabattdetails und gibt den Antrag frei; die Freigabe durch einen MPC genügt, damit der Händler den Ablauf fortsetzt.

**Ablauf.**

1. Sie erstellen den Antrag wie im Standardprozess. Das MPC wird über den Benachrichtigungsdienst (Glocke) über die neue Anfrage informiert; es erreicht den Vorgang über den Deep Link in der Benachrichtigung oder direkt über den MPC-Bereich.
2. Das System legt einen Anfragedatensatz an. Sein Fälligkeitsdatum ergibt sich aus dem Einreichungszeitpunkt plus der in den Market Settings festgelegten Gültigkeit (Kapitel 14.2).
3. Sie erkennen den Sonderfall auf der Seite „Overview & Confirmation“ (Status „Created“) daran, dass der Produktpreis nicht angezeigt wird, die Antragsvorschau deaktiviert ist, kein Zahlungsplan erscheint und die Schaltfläche „Next“ deaktiviert bleibt.
4. Nach der Freigabe durch das MPC stehen Preis, Zahlungsplan und Vorschau zur Verfügung, und Sie setzen den Antrag mit der Abschlusskontrolle fort (Kapitel 6.6).

**Hinweise.** Externe Kommentare sind für den Kunden sichtbar; interne Informationen gehören in interne Kommentare (Kapitel 12.7). Kampagnen und Rabattregeln pflegt der Markt (Kapitel 14.13).

Quellen: Batch 869.4, 1093.2; Quick-Guide-Inhalt (Van-Vorlage)

## 6.6 Übersicht und Abschlusskontrolle

**Zweck.** Auf der Seite „Overview & Confirmation“ führen Sie die Abschlusskontrolle durch und bestätigen den Antrag. Mit der Bestätigung übergeben Sie ihn zur Unterzeichnung (Kapitel 7.5 und 7.6).

**Voraussetzungen.** Der Antrag ist angelegt und hat den Status „Created“; eine eventuelle Sonderfreigabe liegt vor (Kapitel 6.5). Die Kontrolle der Zuordnungen aus Kapitel 6.3 ist erfolgt.

**Schritt für Schritt.**

1. Prüfen Sie die Referenznummer im Feld „Reference Number“ und die angezeigten Preise. Die Übersicht zeigt den Basispreis beziehungsweise den Preis inklusive Händlerrabatt; Werte einer Kulanzkampagne sind nicht enthalten.
2. Tragen Sie bei Bedarf das Kennzeichen im Feld „License Plate“ nach und berichtigen Sie Kundendaten, Marketingpräferenzen und Adresse direkt auf der Seite. Eine geänderte Adresse prüft das System erneut (Kapitel 6.4).
3. Prüfen Sie die Schalter „Notification Required“ und „Signature Required“. Sie legen fest, ob der Kunde benachrichtigt wird und ob eine Unterschrift erforderlich ist.
4. Klicken Sie auf das Häkchen beziehungsweise „Confirm“, um den Antrag zu bestätigen. Das System startet die DSS-Erfassung und setzt den Antrag auf den Status „Confirmed“.
5. Wählen Sie im Dialog „Wählen Sie eine Option für die Unterschrift“ die Unterschriftsart (Kapitel 7.5 und 7.6). Das System bestätigt mit „Unterschriftsprozess für Antrag XXX eingeleitet“.

**Abbrechen und Zurück.** Mit „Cancel“ öffnet sich ein Pop-up: „Cancel“ im Pop-up führt zurück zur aktuellen Seite, „Proceed“ zur Startseite. Mit „Back“ gelangen Sie zu Schritt 2 mit den Kundeninformationen.

**Ergebnis und Systemstatus.** Nach der Bestätigung wechselt der Antrag von „Confirmed“ in „Waiting for Activation“, sobald die Unterschrift vorliegt (Kapitel 8.2). Haben Sie den Ablauf „Build to Stock“ gewählt, bleibt der Antrag im Status „Confirmed“, bis das Erstzulassungsdatum verfügbar ist (Kapitel 8.3).

**Besonderheiten.**

- *Ohne Erstzulassungsdatum:* Fehlt das FRD, führt das System in der Übersicht alle automatisierten Prüfungen mit Ausnahme der FRD-Prüfung durch und erzeugt die Dokumente aus einer Vorlage ohne Erstzulassungsdatum, Vertragsbeginn und Kennzeichen. Erstzulassungsdatum und Kennzeichen bleiben in der Anzeige leer, Vertragsbeginn und Laufzeit tragen den Hinweis „Will be updated when FRD is available“. Der Kunde wird über den Antrag benachrichtigt. Die Bestätigung löst wie im Standardfall die DSS-Erfassung aus und setzt den Status „Confirmed“.
- *Zahlungsart Kreditkarte:* Die Übersicht der Kunden- und Zahlungsinformationen enthält ausschließlich Kreditkarteninformationen. Bei der Kundenbestätigung wählen Sie die Unterschrift wie gewohnt; anstelle der SEPA-Angaben zeigt das System den QR-Code und den vierstelligen Code von Mercedes me, den das Revenue-System bereitstellt (Kapitel 7.1).
- *Leasing-Verträge aus MBLD:* Die Übersicht erscheint im eingeschränkten Modus; „Confirm“ führt ohne Unterschriftsauswahl direkt zu „Confirmed“ (Kapitel 6.1).
- *Sonderfall:* Preis, Zahlungsplan und Vorschau erscheinen erst nach der MPC-Freigabe (Kapitel 6.5).

**Hinweis.** Das Zahlungsintervall lässt sich nach dem Speichern nur noch auf „einmalig“ ändern; andere Änderungen an Konditionen erfordern einen neuen Antrag (Kapitel 10.2).

Quellen: Batch 1014.4, 1013.3, 1081.3, 669.2, 615.3, 873.3, 1103.1; Quick-Guide-Inhalt (Van-Vorlage)

## 6.7 Antrag speichern und Referenz prüfen

**Zweck.** Die Referenznummer ist der Schlüssel für Antragsverwaltung, Historie und Support. Sie stellen sicher, dass der Antrag gespeichert ist, und notieren die Referenznummer.

**Speichern.** Das System speichert den Antrag bereits beim Wechsel von Schritt 2 in die Übersicht: Es vergibt die Referenznummer, legt Antrag und Kunde an und ruft den Zahlungsplan ab. Der Antrag hat dann den Status „Created“ und erscheint in der Antragsverwaltung. Mit „Confirm“ in der Übersicht wechselt er in den Status „Confirmed“ (Kapitel 6.6). Die Zahlungsreferenz („Payment Reference“) wird mit dem Antrag gespeichert und in der Übersicht und auf der Bestätigungsseite angezeigt.

**Schritt für Schritt.**

1. Lesen Sie die Referenznummer im Feld „Reference Number“ der Übersicht ab und notieren Sie sie.
2. Öffnen Sie „Proposal Management“ (Antragsverwaltung) und suchen Sie den Antrag über „Search Proposal“ oder das Feld „Reference Number“. Die Referenznummer steht in der ersten Spalte der Trefferliste (Kapitel 8.1).
3. Öffnen Sie die Detailansicht. Die Nummer erscheint dort als „Reference“; der Reiter „Proposal“ enthält die „Proposal Details“.
4. Prüfen Sie in der Historie den Eintrag „Antrag erstellt“ und nach der Unterschrift den Eintrag „Antrag ist vom Kunden unterschrieben“ (Kapitel 7.8 und 10.8).

**Ergebnis und Systemstatus.** Der Antrag ist mit Referenznummer gespeichert und trägt je nach Fortschritt den Status „Created“, „Confirmed“ oder „Waiting for Activation“ (Kapitel 8.2). Nach dem Versand an den Kunden zeigt das System die Meldung „Der Antrag wurde erfolgreich an den Kunden gesendet“.

**Hinweise.**

- Nach dem Speichern ändern Sie Erstzulassungsdatum, Kennzeichen und Dokumente über „Aktualisieren“ in der Antragsverwaltung (Kapitel 8.3); Konditionen erfordern einen neuen Antrag.
- Für einen Supportfall geben Sie immer die Referenznummer, die verwendete Kennung und den Zeitpunkt an (Kapitel 23.4).
- Verträge, die angebundene Systeme über die Schnittstelle anlegen, erhalten ebenfalls den Status „Created“ und eine Referenznummer (Kapitel 6.1).

Quellen: Batch 654.1, 1103.1, 1103.2, 578.3, 1014.4, 1040.2; Quick-Guide-Inhalt (Van-Vorlage)

## Verschiebung in andere Kapitel

- Kapitel 4.3 Kundendaten und Pflichtangaben prüfen: Postleitzahlprüfung beim Bearbeiten eines bestehenden Kunden (Batch 661.1); Hinweis, dass Vor- und Nachname bei aktiviertem Aktualisierungsschalter nicht in Mercedes me geändert werden, sowie entfernte Sprachoptionen Italienisch und Französisch (Batch 621.3, Teil).
- Kapitel 4.7 Partner- und Dealerbeziehungen: Partnerdatenmodell, Datenvalidierung, Partnerhistorie und mandantenspezifische Führung (Batch 678.3).
- Kapitel 4.8 Dealer-Onboarding und Partnerprozess: Händler anlegen, CSV-/Excel-Upload, SAP-Debitorennummer, Namenszusatz und Kreditorennummer, GSSN-Meldung „GSSN service unavailable“, Prüfungen der Dealership-Tabelle (Batch 646.1, 662.1, 614.1, 610.2, 658.4, 677.2).
- Kapitel 5.2 Fahrzeug- und Vorgangskennungen: Meldungen „Your Identifier could not be recognized“ und „Your Identifier did not return any results“ (Batch 999.5); Behandlung eines aus der Fahrgestellnummer ermittelten, in oneSCM nicht vorhandenen Baumusters (Batch 20.2, Teil).
- Kapitel 5.3 Fahrzeugdaten, Pflichtfelder und Validierungsregeln: Fehlermeldungen bei Überschreitung von Kilometerstand- und Fahrzeugaltersgrenzen in der Anzeige kompatibler Produkte (Batch 1141.4).
- Kapitel 7.6 Manuelle Unterschrift und Dokumentupload sowie Kapitel 8.4 Freigabeprozess und Aktivierungsvoraussetzungen: zwei PDF-Uploads „Service Contract“ und „SEPA Document“, Aktivierungsbegründung mit 5 bis 100 Zeichen (Batch 30.3, Teil).
- Kapitel 8.1 Anträge suchen und filtern: Filter „Proposal Valid From“, „Proposal Valid Until“, „Proposal Created From“, „Proposal Created to“, „VAT ID“ und „Proposal Validity“ (Batch 1103.2, Teil).
- Kapitel 9.3 Prüfstatus beziehungsweise Kapitel 11.7 Reporting, Filter und Exporte: Download der vollständigen gefilterten Prüfliste mit einer Zeile je Referenznummer und Prüfung (Batch 871.3).
- Kapitel 9.8 Contract Review: Profile und Übersicht: Anlage eines Regular-Review-Profils mit Toleranzen und Genehmigungen (Batch 768.4).
- Kapitel 10.1 Verträge suchen und Details prüfen beziehungsweise 10.8 Änderungshistorie: Notizen hinzufügen, bearbeiten und löschen (Batch 757.2).
- Kapitel 10.2 Vertrags-, Kunden- und Zahlungsdaten ändern: Ablauf einer Änderung mit „EDIT“, „Abbrechen“, „Bestätigen“ und Änderungsgrund (Batch 849.2).
- Kapitel 10.3 Zahlerwechsel und Vertragsübertragung: Schritt 3 des Zahlerwechsels mit Erfolgsmeldung zur Genehmigung (Batch 836.4).
- Kapitel 10.4 Aussetzen und Reaktivieren: Sperrung eines oder mehrerer aktiver Leasing-Verträge mit Sperrgrund (Batch 786.3).
- Kapitel 10.5 Verlängerung, Folgeangebot und Folgevertrag: Übersicht und Bestätigung der Langzeitverlängerung mit Vergleich der Konfigurationen (Batch 787.4).
- Kapitel 10.6 Kündigung, Stornierung und Beendigung sowie 14.4 Vorlagenverwaltung: deutsche Vertragsvariablen in E-Mails und Fehlermeldung beim gleichzeitigen Beenden mehrerer Verträge (Batch 807.6).
- Kapitel 11.6 Endabrechnung, Erstattung und Korrekturen: manuelle FI-Belege (MDCR) mit Position, Beträgen, Positionstext, Validierung und Abbruch (Batch 105.4, 57.4, 57.5, 63.4, 63.5, 83.5, 86.4, 112.4).
- Kapitel 12.9 Massenanlage und Validierung von Fahrzeuglisten: Wiedereinstieg über die Mass Draft Page und Übergang von der Mass-Draft-Nummer zur Group ID (Batch 932.3, 932.4).
- Kapitel 14.4 Vorlagenverwaltung und Template Management: Pflichtfelder, Validierung und Prüfkriterien für E-Mail- und Dokumentvorlagen (Batch 490.2, 491.3, 493.3, 494.3).
- Kapitel 14.5 Administrationsbereich und zulässige Aktionen: Steuerverwaltung („Tax Management“) mit Steuerarten, Steuersätzen und Steuerklassifizierungen (Batch 218.3, 218.4, 218.6, 253.1, 255.1, 258.2, 279.4, 280.2); Zeitplan eines Batch-Jobs (Batch 276.3); Schadencode löschen (Batch 731.4); Feld „Affiliation“ und Filter „Division“ auf der Seite „System Notifications“ (Batch 572.4, Teil).
- Kapitel 14.8 Produktdefinition, Anlage und Veröffentlichung sowie 14.10 Produktänderung: Basisinformationen zum Produkt, Sprachreiter, Limit-Sets, Produkt bearbeiten, Produktübersicht und Filter (Batch 1241.1, 1128.3, 1239.5, 1237.1, 1280.4, 1282.6).
- Kapitel 14.11 Fahrzeuggruppen und Van-Baumuster-Clustering: Validierung des Beschreibungsfelds einer Fahrzeuggruppe (Batch 20.2, Teil).
- Kapitel 15.7 Technical Options, SA-Matching, Coverage- und Industry-Codes: Schritt 3 der Coverage-Code-Anlage mit Meldung „Coverage Code saved successfully“ (Batch 1220.5).
- Kapitel 19.12 CoFiCo und 19.13 SWT: Validierung, Übertragung und Fehlerbehandlung der FI-Exportdatei (Batch 121.4).
- Kapitel 19.16 ALICE – Berechtigungsmanagement: technische Umsetzung der Outlet-ID-Prüfung je API-Operation (Batch 1005.3, 255.2, Detail).
- Kapitel 22.2 beziehungsweise Anhang F (Klärungsregister): durchgängiger Ablauf zur Aufnahme einer Coverage-Tabelle mit Coverage- und Contingent-Informationen (Batch 322.6).

## Klärungsbedarf

- Schaltfläche „Weiter“ in Schritt 2: Batch 654.1 beschreibt sie als von Beginn an aktiv mit Hervorhebung fehlender Pflichtfelder; Batch 669.2 beschreibt sie als deaktiviert, bis die Adressfelder validiert sind. Das tatsächliche Verhalten ist zu bestätigen; der Entwurf nennt beide Mechanismen.
- IBAN-Format: Batch 30.3 verlangt eine deutsche IBAN mit 22 Zeichen, Batch 1034.3 nennt eine maximale Länge von 34 Zeichen. Ebenso weichen die Längen des Kontoinhabers (71 Zeichen in Batch 30.3, 60 Zeichen in Batch 1034.3) und der E-Mail-Adresse (241 Zeichen in Batch 30.3, 255 Zeichen für die Verkäufer-E-Mail in Batch 1094.4) voneinander ab. Der Entwurf nennt keine Längen für diese Felder.
- Postleitzahlprüfung: Batch 885.1 beschreibt marktspezifische Regeln über die Marktkonfiguration, Batch 572.4 eine marktunabhängig gleiche Regel. Zu klären, welche Regel gilt.
- Batch 864.3: Die Möglichkeit, einen von MBLD angelegten Leasing-Vertrag abzulehnen („Reject Contract“), ist in den Vorgaben nicht festgelegt. Der Entwurf beschreibt nur Zurück-Pfeil und „Confirm“.
- Batch 1093.2: Die Freigabe durch einen MPC ist als Änderung gegenüber zwei Freigebern beschrieben. Zu bestätigen, dass dieses Verhalten im produktiven Stand gilt.
- Batch 1036.2: Die Felder „Tax Classification“, „Tax Classification Code“ und „Legal Entity“ sind als vorbelegt und schreibgeschützt für den MVP beschrieben. Zu klären, ob sie in weiteren Märkten bearbeitbar sind.
- Batch 654.1, 1014.4, 1013.3 sprechen von „Vertragsnummer“, Batch 1103.1 legt „Referenznummer“ fest. Der Entwurf verwendet durchgängig „Referenznummer“.
- Batch 1014.4 und 1013.3: Die Abkürzung „DSS“ ist im Material nicht erläutert; Bedeutung für das Glossar (Anhang A) zu klären.
- Batch 578.3: Die Speicherung der Zahlungsreferenz wird als Fehlerbehebung beschrieben; Anzeigeort und Bedeutung des Feldes „Payment Reference“ sind nicht näher erläutert.
- Batch 869.4: Der Satz „Auch das entspricht dem Verhalten beim Sonderfall“ lässt offen, auf welchen Vergleichsprozess sich die Beschreibung bezieht (Angebotsanfrage über das MPC).
- Batch 621.3: Die Entfernung der Sprachoptionen Italienisch und Französisch ist ohne Marktbezug beschrieben.
- Batch 572.4: Der Kontext des Pflichtfelds „Affiliation“ ist nicht benannt.
- Batch 1040.2: Welche konsumierenden Systeme die Schnittstelle zum Anlegen eines Vertrags nutzen, ist nicht genannt.
- Eingestellte oder geschlossene Meldungen für das Klärungsregister (Anhang F): Händler anlegen mit Status Cancelled und der Eintrag „No dealership validations on upload“ ohne Beschreibung (Batch 646.1); Postleitzahlprüfung beim Bearbeiten eines Kunden, Status Geschlossen (Batch 661.1); Validierung des Ablaufs zur Coverage-Tabelle ohne Ergebnis (Batch 322.6).
- Batch 1241.1 (verschoben nach 14.8): Die Zahlenwerte in den Meldungstexten stimmen nicht mit den Längenvorgaben der Felder „Product Description“ und „Additional Info Text“ überein.

## Vorschläge zur Gliederung

- Neues Unterkapitel „6.8 Anträge aus angebundenen Systemen bestätigen“ oder Erweiterung von 6.1: Die eingeschränkte Übersicht für Leasing-Verträge aus MBLD (Batch 873.3, 864.3) und das Anlegen über die Vertragsschnittstelle (Batch 1040.2) beschreiben eigene Abläufe mit abweichendem Statusübergang.
- Die Erfassung durch Endkunden über eine Drittanbieter-App (Batch 654.1) legt einen Abschnitt in Kapitel 19.29 POS-Kanäle oder eine Rollenbesonderheit in Kapitel 6.2 nahe.
- Die Terminologie Antrag/Vertrag und Referenznummer (Batch 1103.1, 1103.2) gehört zusätzlich in Kapitel 3.5 und ins Glossar (Anhang A).
- Die Zahlungsart Kreditkarte mit QR-Code und Mercedes-me-Code (Batch 615.3) ist in Kapitel 7.1 als eigene Zahlungsart aufzunehmen.
