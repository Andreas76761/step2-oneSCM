# 14 Marktrolle, Produkt- und Preispflege sowie Administration

Dieses Kapitel beschreibt, wie Sie als Marktrolle die Stammdaten Ihres Marktes in oneSCM pflegen. Dazu gehören die Markteinstellungen, die Vorlagenverwaltung, der Administrationsbereich, Produkte, Preisversionen, Cluster, Fahrzeuggruppen, Kampagnen und Preiskomponenten. Die Angebotserstellung beschreibt Kapitel 5, die Verwaltung laufender Verträge Kapitel 10. Zentrale Blueprints und globale Vorgaben liegen bei der HQ-Rolle in Kapitel 15. Aussagen aus den RAG-Batches, die sich widersprechen, unklar sind oder eingestellte und geschlossene Meldungen betreffen, führt der Abschnitt Klärungsbedarf am Kapitelende auf.

## 14.1 Aufgaben und Abgrenzung der Marktrolle

Material: keine Quellen in den RAG-Batches

Die Aufgaben der Marktrolle ergeben sich aus den Unterkapiteln 14.2 bis 14.14. Die Abgrenzung zur HQ-Rolle beschreibt Kapitel 15.

Quellen: keine Quellen in den RAG-Batches

## 14.2 Marktspezifische Einstellungen

**Zweck.** In den Markteinstellungen legen Sie fest, wie oneSCM in Ihrem Markt arbeitet. Die Seite umfasst die Reiter „General Settings“, „Feature Settings“, „Inflation“, „External System Settings“ und „Translations“. Die Einstellungen gelten für den gesamten Markt. Reiter mit dem Hinweis auf die Division gelten für die Division PC oder Van.

**Voraussetzungen.** Sie sind im Administrationsbereich angemeldet und haben Berechtigungen für die Markteinstellungen. Die Sprachen Ihres Marktes sind im Bereich „Format“ unter „General Settings“ ausgewählt. Ein Code erscheint im Reiter „Translations“ nur, wenn er zentral definiert und dem Markt zugeordnet ist.

**Rollen.** MPC und HQ-Administratoren als Market Admin legen die Standardsprache des Marktes fest. Eine Rolle ohne Registrierungsrechte sieht in den Markteinstellungen weder die Registrierung, den Upload, die Bearbeitung noch die Löschung von Händlerbetrieben. Sie kann Märkte und Lieferanten nicht registrieren, bearbeiten oder löschen. Das Material nennt die betroffene Rolle nicht.

**Schritt für Schritt.**

1. Öffnen Sie die Markteinstellungen im Administrationsbereich. Wählen Sie bei divisionsbezogenen Einstellungen den Reiter für die Division PC oder Van.
2. Wählen Sie im Bereich „Format“ unter „General Settings“ die Sprachen des Marktes im Mehrfachauswahlfeld aus.
3. Wählen Sie im Dropdown „Default Language“ genau eine der zugewiesenen Sprachen. Die Auswahl ist auf die dem Markt zugewiesenen Sprachen begrenzt. Ohne Standardsprache lässt sich die Einstellung nicht speichern.
4. Mit der Aktion „Generate Default Templates“ erzeugen Sie Standardvorlagen in den ausgewählten Sprachen.
5. Wählen Sie im Dropdown „Price Format“ im Bereich „Format“ das Lakh-Format 1,00,000, sofern Ihr Markt Preise in Lakh pflegt. Preise erscheinen dann zum Beispiel als 5,00,000 INR. Die Funktion steht der Rolle MPC zur Verfügung.
6. Wählen Sie für den indischen Markt im Bereich „Formate“ in der Währungsauswahl den Wert INR.
7. Im Bereich „Terms of Use“ aktivieren Sie das Kontrollkästchen zur Aktualisierung der Version, wenn alle Benutzer die Nutzungsbedingungen erneut bestätigen sollen. Ist die Option aktiv, laden Sie für jede Sprache ein neues Dokument hoch. Die Schaltfläche „Aktualisieren“ ist erst aktiv, wenn alle Sprachen hochgeladen sind. Ist die Option nicht aktiv, ersetzt das neue Dokument das bestehende ohne erneute Zustimmung aller Benutzer.
8. Im Reiter „Timers & Reminders“ pflegen Sie die Erinnerungen. Die Felder für die erste und die zweite Erinnerung in Tagen sowie die beiden Felder unter „Contract End Date Reminders“ sind optional. Ist kein Wert eingetragen, wird keine Erinnerung versendet. Die Grace Period Campaign Request Validity erfassen Sie je Division als positive ganze Zahl in Kalendertagen. Der Standardwert beträgt 7 Kalendertage.
9. Die Gültigkeit des DSS-Signaturlinks in Tagen muss der Angebotsgültigkeit entsprechen. Außerdem pflegen Sie die Wartezeiten für die CAS-Antwort, die SEPA-Validierung und die SAP-Debitorennummer, jeweils in Tagen. Ein Vertrag lässt sich nur aktivieren, wenn CAS, SEPA und SAP in Ordnung sind.
10. Die Gültigkeit eines Angebots zur Langzeitverlängerung pflegen Sie im Bereich „Contract Management“ unter „Timer & Reminders“ mit dem Feld „Long Term Prolongation Proposal Validity“ in Tagen. Zulässig sind Werte von 1 bis 95 Tagen. Der Standardwert beträgt 30 Tage.
11. Im Reiter „Payment“ unter „General Settings“ im Admin-Bereich konfigurieren Sie die Zahlungsmatrix je Sparte. Die linke Seite gliedert die Zahlungsarten in die Gruppen „Pre Activation“ und „Post Activation“. Unter jeder Zahlungsart wählen Sie die Kundentypen „All“, „Private“, „Commercial“ und „Governmental“. Die Vorschau rechts zeigt die entstehende Konfiguration. Ohne Auswahl erscheint der Hinweis „No options were selected“.
12. Zahlungsarten je Kundentyp werden zusätzlich durch HQ-Administratoren im Admin Utility freigegeben. Die Markteinstellungen zeigen nur die Kombinationen, die das Utility für den Markt freigegeben hat.
13. Für die Schweiz steht die Banküberweisung allen Kundentypen zur Verfügung, sofern das Produkt, die Markteinstellungen und die Zahlungsmethoden dies zulassen. Da die Schweiz ein COFICO-Markt ist, wird die Banküberweisung ohne Prüfung eines Kontovermerks gewährt. Die MO-Prüfung gilt als NOT_APPLICABLE.
14. Im Reiter „Translations“ wählen Sie einen der Unterreiter „Coverage Codes“, „Damage Codes“, „Industry Codes“, „Technical Options“ oder „ISP Codes“. Jeder Unterreiter ist nach Passenger Cars und Vans getrennt. Links erscheinen die Codes des Marktes für die gewählte Division. Rechts sehen Sie den schreibgeschützten Feldwert „HQ Proposal“. Darunter erhält jede Sprache des Marktes ein eigenes Eingabefeld, das mit dem HQ-Vorschlag vorbelegt ist.
15. Übernehmen Sie vorbelegte Werte unverändert oder passen Sie nur abweichende Felder an. Pflichtfelder wie der Coverage Name bleiben beim Speichern gefüllt. Beschreibungsfelder dürfen leer bleiben, sofern das Objekt dies erlaubt. Mit „Reset“ verwerfen Sie nicht gespeicherte Änderungen, mit der Bestätigungsschaltfläche speichern Sie.
16. Für Länder mit eigenen Formatvorgaben laden die Validierungsmuster für Postleitzahl, Umsatzsteuer-Identifikationsnummer und Steuernummer aus der Marktkonfiguration. Für Tschechien und die Schweiz gelten getrennte Muster.

**Ergebnis und Systemstatus.** Die gespeicherten Einstellungen gelten für den Markt. Das Produkt liest die Sprachen und die Standardsprache aus den Markteinstellungen. Beim Anlegen oder Bearbeiten einer Kampagne sieht der Anwender für jede aktive Sprache einen eigenen Reiter. Die Standardsprache lässt sich nicht entfernen, ohne eine neue Standardsprache zu bestimmen. Hat ein Vertrag die Angebotsgültigkeit überschritten, ohne dass CAS, SEPA und SAP bestätigt sind, setzt das System den Vertrag auf „Rejected“.

**Besonderheiten je Rolle, Sparte und Markt.**

- Die Standardsprache legt fest, in welcher Sprache Produkte und zugehörige Informationen angelegt werden. Aktuell verwendet nur der Bereich Products diesen Parameter.
- Für neue Märkte wie Indonesien und die Slowakei ist Englisch als Standardsprache voreingestellt.
- Der indische Markt verwendet die Währung INR und das Lakh-Format.
- Die Schweiz erlaubt die Banküberweisung für alle Kundentypen.
- Tschechien und die Schweiz sind im System freigeschaltet und haben eigene Validierungsmuster.

**Hinweise.**

- Der Satz „The following settings will apply throughout the entire market.“ steht auf fast allen Reitern. In den Divisionsreitern lautet er „The following settings will apply for your division throughout the entire market.“
- Das Feld „Clearing Group name“ heißt jetzt „Search Profile Name“. Der Tooltip lautet „Define search profile used to interrogate Critical Account System API service“.
- Wird eine Sprache abgewählt, entfernt das System die zugehörigen Dokumente per Soft Delete. Die Daten bleiben erhalten. Wird die Sprache erneut gewählt, stellt das System die Dokumente automatisch wieder her.
- Beim Entfernen einer nicht standardmäßigen Sprache verschwindet deren Reiter nach dem Aktualisieren der Seite. Das Produkt sendet die Sprache nicht mehr an die Vertragserstellung. Beim Hinzufügen einer Sprache weist ein Tooltip darauf hin, dass auch das Produkt angepasst werden muss.
- Das Feld „Transaction Type“ unter „Market Settings“, „Market Config“, „Mpay Config“ wird nicht mehr angezeigt.
- Die Fußzeile enthält die Bereiche Imprint, Privacy Policy, Terms of Use und Licenses. Die Einträge „Privacy Policy External“ und „General Legal Notice“ bleiben in den Markteinstellungen erhalten, erscheinen aber nicht mehr in der Fußzeile.
- Im Reiter „Feature Settings“ zeigt das Feld „Threshold amounts“ im Bereich „Invoice configuration“ die im Markt hinterlegte Währung an.
- Der Reiter „Translations“ enthält nur Texte zu bestehenden Codes. Neue Codes legt er nicht an.

**Fehlerbehebung.**

- Eine Einstellung ohne Standardsprache lässt sich nicht speichern. Wählen Sie eine zugewiesene Sprache als Standardsprache.
- Fehlt ein Code im Reiter „Translations“, ist er dem Markt für die gewählte Division nicht zugeordnet.
- Das Speichern von Inflationswerten zeigt keinen internen Serverfehler. Das Hochladen einer Datei zeigt keinen Fehler wegen doppelter Schlüssel.
- Die Markteinstellungen übernehmen alle Einstellungen in die Anwendung. Die Neuanlage eines nicht registrierten Händlers ist möglich.
- Der Steuersatz des Marktes Indonesien wird in den Markteinstellungen angezeigt.
- Bei einem fehlgeschlagenen Systemlogin im Konfigurationsservice erscheint eine Meldung.

Quellen: Batch 1093.5, 156.3, 1101.4, 1134.7, 884.2, 884.4, 1302.4, 870.1, 1121.2, 1128.6, 907.1, 777.2, 883.3, 1041.2, 1123.1, 522.1, 1104.3, 694.4, 869.2, 1310.2, 559.1, 1098.4, 629.3

## 14.3 Länderabweichungen vom Blueprint

Material: keine Quellen in den RAG-Batches

Die RAG-Batches enthalten keine Aussagen zu Abweichungen vom Blueprint je Land. Länderspezifische Validierungen für Tschechien und die Schweiz beschreibt Unterkapitel 14.2. Die zentralen Blueprints beschreibt Kapitel 15.

Quellen: keine Quellen in den RAG-Batches

## 14.4 Vorlagenverwaltung und Template Management

**Zweck.** Im Template Management erstellen, prüfen, bearbeiten, duplizieren und löschen Sie Vorlagen für Dokumente, E-Mails, Kopf- und Fußzeilen, Blöcke und Systembenachrichtigungen. Die Vorlagen bilden die Grundlage für personalisierte Kundendokumente. Die Oberfläche folgt der Mercedes-Benz Workbench.

**Voraussetzungen.** Sie sind mit Ihren Zugangsdaten angemeldet. Die Vorlagen für Kopf- und Fußzeile sind bereits definiert. Sie öffnen den Administrationsbereich und wählen „Template Management“.

**Rollen.** MPC-, HQ- und Admin-Nutzer erstellen E-Mail-Vorlagen für Systembenachrichtigungen im Reiter „System Notification“. Unter „Vorlage erstellen“ steht dort ausschließlich „E-Mail erstellen“ zur Verfügung.

**Schritt für Schritt.**

1. Öffnen Sie „Template Management“. Die Übersicht gliedert sich in die Bereiche „Documents“ und „Notifications“. Standardmäßig erscheint „Documents“.
2. Wählen Sie im Reiter „Notification“ die Aktion „Create template“ und danach den Vorlagentyp E-Mail, Header, Footer oder Blocks.
3. Erfassen Sie den Vorlagennamen. Das Feld ist ein Textfeld.
4. Wählen Sie den Markt. Im aktuellen Stand ist Deutschland vorbelegt.
5. Wählen Sie im Feld „Used For“ den Geschäftsprozess. Zur Auswahl stehen Confirmation, Cancellation, Activation, Expiration, Termination und Reactivation. Für Preisinformationen wählen Sie „Informing“, für Änderungen nach dem Aktivstatus eines Vertrags „UPDATING“.
6. Legen Sie mit „Valid From“ das Datum fest, ab dem die Vorlage im Geschäftsprozess gilt.
7. Optional wählen Sie die Division PC, die Marke Mercedes-Benz und die Sprache. Im aktuellen Stand sind Van und Smart nicht auswählbar. Die Sprache richtet sich nach der Marktrolle des Benutzers und ist Englisch.
8. Mit „Save as Draft“ speichern Sie eine Vorlage, sobald der Pflichtname erfasst ist. Die Schaltfläche „Publish“ ist aktiv, wenn alle Pflichtfelder ausgefüllt sind.
9. Gestalten Sie den Inhalt im Editor. E-Mail-Inhalte entsprechen dem MB-Styleguide für E-Mails. Für T&C-Vorlagen wählen Sie einen Footer und einen Header als Editor oder laden eine PDF-Datei hoch.
10. Mit „Send Test E-mail“ erhält der angemeldete Benutzer eine E-Mail im selben Format wie der Kunde, einschließlich Betreff, Kopfzeile, Inhalt und Fußzeile.
11. Vor dem Veröffentlichen prüft das System, ob bereits eine Vorlage desselben Typs mit denselben Pflichtparametern existiert. Pflichtparameter sind Market, Used for und Valid From. Besteht eine solche Vorlage, zeigt das System die Meldung „Template already exists, cannot be published.“
12. Mit „Publish“ veröffentlichen Sie die Vorlage. Sie wird ab dem Datum „Valid From“ im Prozess angewendet. Bei Header- und Blockvorlagen erscheint eine Erfolgsmeldung.
13. Über die Suche filtern Sie nach Vorlagenname, Markt, Vorlagentyp und „Used for“. Mit „More filters“ filtern Sie zusätzlich nach Division, Marke, Sprache und Service-Contract-Produkt. Der Status „Draft“ oder „Published“ ist auswählbar. Ergebnisse erscheinen standardmäßig absteigend nach dem Datum der letzten Änderung.
14. In der Ergebnistabelle wählen Sie je Zeile „Edit“, „View“, „Delete“ oder „Duplicate“. „Delete“ ist nur für Vorlagen im Status „Draft“ möglich, und nur wenn eine neuere Version auf Basis von „Valid From“ vorliegt. Bei erfolgreichem Löschen erscheint „Item has been deleted successfully“. Wird die Vorlage noch von einem Prozess verwendet, erscheint „Item could not be deleted. Process is using the template.“

**Ergebnis und Systemstatus.** Ein Entwurf wird in keinem Geschäftsprozess angewendet, auch dann nicht, wenn „Valid From“ erreicht ist. Entwürfe löscht das System nach 30 Tagen automatisch. Eine veröffentlichte Vorlage wird ab „Valid From“ angewendet. Die Vorlage „Activation“ verwendet das System bei der Vertragserzeugung im Status ACTIVE. Die Stammdatenvorlage für die E-Mail mit Preisinformationen enthält keine Preis- und Produktdetails mehr.

**Besonderheiten je Rolle, Sparte und Markt.** Der Vorlagentyp ergibt sich aus dem gewählten Erstellungspfad. Die Anzeige der Vorlagen richtet sich nach der Rolle. Im aktuellen Stand gelten Division PC, Marke Mercedes-Benz und Sprache Englisch.

**Hinweise.**

- Haben Sie Daten eingegeben und verlassen die Seite, erscheint ein Hinweis auf drohenden Datenverlust. Mit „Cancel“ bleiben Sie auf der Seite, mit „Proceed“ verwerfen Sie die Daten.
- Die Tabelle zeigt 10 Datensätze je Seite. Zur Auswahl stehen 10, 20, 30, 40 oder 50. Die Auswahl setzt sich nach dem Aktualisieren der Seite auf 10 zurück.
- Die Spalten Market, Template Type, Used for und Created by sortieren Sie von A bis Z. Last update und Valid From sortieren Sie von neu nach alt.
- Für die Druckvariablen gilt: Technische Optionen stehen als kommagetrennte Liste bereit, für Vans etwa fünf bis sechs Optionen. Reifentyp und Reifengröße erscheinen, die Größe mit Zollzeichen, zum Beispiel 16". Der Fahrgestelltyp heißt in den Vorlagen Aufbautyp. Zylinder und Motor stehen als eigene Variablen bereit. Die Einrichtung der technischen Optionen in der Vorlage entfällt.
- Auf Produktebene stehen zwei Druckvariablen für den Preis pro Kilometer bereit: für Mehrkilometer und für Minderkilometer. Die Werte übernimmt das System aus dem Vertrag. In der Vorschau ist 0,50 € als Standardwert angezeigt. Die Währung stammt aus den Markteinstellungen.
- Angehängte Dokumente verwalten Sie in der Vorlage. Die Vorschau einer Vorlage stimmt mit der im Prozess erzeugten Vorlage überein.
- Der Inhalt der Vorlage für Systembenachrichtigungen folgt dem MB-Styleguide für E-Mails.

**Fehlerbehebung.**

- Header-Vorlagen lassen sich im Bereich Benachrichtigungen anlegen.
- Der Abruf von Vorlagenprodukten liefert keinen Serverfehler mehr.
- Die Spaltenränder der Tabelle lassen sich verschieben.

Quellen: Batch 468.2, 497.1, 423.2, 479.2, 353.5, 374.4, 378.3, 391.4, 424.3, 433.2, 374.3, 479.4, 421.4, 422.4, 423.4, 464.4, 468.4, 480.4, 485.4, 490.5, 493.6, 494.6, 496.6, 501.6

## 14.5 Administrationsbereich und zulässige Aktionen

**Zweck.** Der Administrationsbereich enthält die Pflegeseiten Ihres Marktes, zum Beispiel Markteinstellungen, Vorlagenverwaltung und Fahrzeugverwaltung. Welche Aktionen Sie sehen und ausführen, hängt von Ihrer Berechtigung und vom Zeitraum des Objekts ab.

**Voraussetzungen.** Sie sind mit einer Rolle angemeldet, die den jeweiligen Bereich zeigt. Aktionen erscheinen nur, wenn Ihre Berechtigung sie zulässt.

**Schritt für Schritt.**

1. Prüfen Sie den Zeitraum der Preisversion, bevor Sie eine Aktion wählen. Bei einer abgelaufenen Preisversion können Sie nur duplizieren. Bei der aktuell gültigen Preisversion stehen Bearbeiten und Duplizieren zur Verfügung, wobei Sie bei Clustern nur den Namen ändern. Bei einer Preisversion mit Startdatum in der Zukunft können Sie duplizieren, löschen und die Cluster bearbeiten.
2. Auf den Karten der Fahrzeuggruppen öffnen Sie „Edit“ und „Delete“ über die Schaltfläche mit den drei Punkten. Die Aktionen erscheinen vollständig oberhalb der Karte, auch bei der letzten Karte einer Reihe. Die Schaltflächen reagieren auch neben dem Text.
3. Dialogfenster schließen Sie nicht durch einen Klick auf den dunklen Hintergrund. Verwenden Sie dafür „Cancel“ oder das X. Für einzelne Dialoge können Ausnahmen gelten.
4. Bleibt die Maske zum Anlegen oder Bearbeiten geöffnet und ändern Sie die Fenstergröße, bleibt die Schaltfläche „Cancel“ sichtbar.

**Ergebnis und Systemstatus.** Ohne Bearbeitungsrecht zeigt der Administrationsbereich die Inhalte im Lesemodus. Motorbaureihen und technische Optionen sind sichtbar. Die Schaltflächen für den ISP-Datenupload und den Datei-Upload im Cross File Transfer fehlen. Das Informationsbanner lässt sich nicht bearbeiten. In der Vertragsprüfung ist der Reiter „Operative Review“ sichtbar, die Schaltfläche „Bearbeiten“ fehlt.

**Besonderheiten je Rolle.** Die Schaltfläche „Bearbeiten“ im Administrationsbereich und in der Vertragsprüfung erscheint nur bei Bearbeitungsrecht. Das Material nennt die Rollen dazu nicht.

Quellen: Batch 1234.3, 1134.8, 21.4, 677.3

## 14.6 Marktbezogene Sichtbarkeit und Berechtigungen

Das Material enthält keine eigene Datei für diesen Abschnitt. Die folgenden Aussagen stammen aus Batches, die Rollen und Sichtbarkeit beschreiben.

**Zweck.** Dieser Abschnitt beschreibt, welche Rolle welche Produkte, Preise, Fahrzeuggruppen und Blueprints sieht und bearbeitet.

**Rollen.**

- Ein Dealer mit der Division Van sieht unter „Manage Products & Prices“ die Van-Produkte und kann im Produkttest auf Van-Produkte zugreifen. Bei PC-Produkten erscheint eine Meldung über verweigerten Zugriff. Fordert dieser Nutzer in der Vertragserstellung ein PC-Chassis an, liefert die Antwort keine Ergebnisse.
- Eine Rolle MPC oder MO mit der Division PC legt Produkte und Filter an und greift auf die PC-Fahrzeuggruppen unter „Manage Vehicle Groups“ zu. Für Van erscheint eine Fehlermeldung oder eine Meldung über verweigerten Zugriff.
- Eine Rolle HQ mit der Division PC legt technische Optionen an. Für Van erscheint die Meldung über verweigerten Zugriff.
- Eine Rolle HQ mit beiden Divisionen sieht unter „Manage Blueprints“ und „Create Blueprint“ die Blueprints beider Divisionen. Mit ausschließlich der Division Van sind nur die Van-Blueprints zugänglich.
- Die Rolle MPC-Product-Manager mit der Rollen-ID MPC-PRODUCT-MANAGER sieht und verwaltet Produkte, Preise und Fahrzeuggruppen. Die Rolle und ihre Berechtigungen legt das Berechtigungssystem ALICE an.
- Die Berechtigung zum Anzeigen von Produkten öffnet den Menüpunkt „Product Management“ und die Liste mit Filtern, Suche und Seitengröße. Die Berechtigung zum Verwalten erlaubt das Anlegen, das Ausfüllen aller Felder, das Abschicken und das Löschen von Produkten sowie das Zuweisen von Preisen. Die Berechtigung zur Statusänderung veröffentlicht Produkte im Status Ready oder Deactivated und deaktiviert Produkte.
- Für Preise gibt es eine Anzeigeberechtigung, mit der Sie Preisversionen einschließlich abgelaufener Versionen öffnen. Die Verwaltungsberechtigung legt Preisversionen und Cluster an, klont und löscht sie und bearbeitet Cluster.
- Für Fahrzeuggruppen gibt es eine Anzeigeberechtigung und eine Verwaltungsberechtigung. Mit der Verwaltungsberechtigung legen Sie Fahrzeuggruppen an, bearbeiten und löschen sie und fügen Baumuster hinzu oder entfernen sie.
- Die Rolle Admin erhält die Berechtigung zum Bearbeiten der Fahrzeugadministration unter „Vehicle Management“.
- Die Rolle MO sieht Produkte, Kampagnen, Preis-Cluster und Fahrzeuggruppen im Lesemodus. Die Aktion „View“ öffnet die Detailansichten für Produkte und Kampagnen.
- Ohne Bearbeitungsrecht heißen die Aktionen „Manage Prices“ und „Assign Prices“ stattdessen „View Prices“.
- Der Zugriff auf das MPC-Dashboard ist durch Routenschutz auf MPC-Nutzer beschränkt. Das Dashboard zeigt Karten, die auf bestehende Seiten verweisen.
- Für die Schadencodes sieht eine Rolle die Werte und kann sie herunterladen. Anlegen, Bearbeiten, Löschen und Hochladen von Schadencodes sind nicht möglich.

**Sparte und Markt.** Die Division bestimmt, welche Produkte, Blueprints und Fahrzeuggruppen ein Benutzer sieht. Benutzer mit beiden Divisionen sehen beide.

**Fehlerbehebung.** Benutzer mit der Rolle MPC sehen die Preise eines Produkts.

Quellen: Batch 1155.1, 1229.1, 334.1, 125.2, 1280.5

## 14.7 Änderungen prüfen, freigeben und dokumentieren

**Zweck.** Dieser Abschnitt beschreibt die Dokumente der Marktkonfiguration und den Inhalt der Preisinformation. Das Material enthält zu diesem Titel keine Prüf- oder Freigabeprozesse. Die Vier-Augen-Freigabe von Preisversionen beschreibt Unterkapitel 14.9.

**Schritt für Schritt: Dokumente der Marktkonfiguration.**

1. Öffnen Sie in der Marktkonfiguration den Reiter „Dokumente“. Dort stehen ausschließlich die Sprachen zur Verfügung, die unter „Format“ in den Allgemeinen Einstellungen ausgewählt sind.
2. Stellen Sie je Dokumentart eine Datei bereit: oneSCM Guideline, Zustimmung zu den Nutzungsbedingungen, Impressum und Datenschutzerklärung. Sie laden die Datei per Drag-and-drop oder über die Dateiauswahl hoch.
3. Nach dem Upload zeigt das System den Dateinamen als Titel und einen Datumsstempel. Bei jedem neuen Upload aktualisiert sich der Datumsstempel.
4. Im Modal-Fenster sehen Sie das Dokument in der Vorschau. Sie können das Dokument löschen oder durch eine neue Datei ersetzen.
5. Die Schaltfläche „Update“ ist aktiv, wenn für eine Dokumentart alle ausgewählten Sprachen hochgeladen sind. Die Prüfung erfolgt je Dokumentart.
6. Beim Navigieren zeigt das System Dokumente in der gewählten Sprache des Benutzers. Endkunden erhalten Dokumente in der Sprache, die in ihrem Profil als bevorzugt hinterlegt ist.

**Inhalt der Preisinformation.** Das Dokument enthält die Daten, die zum Zeitpunkt der Erzeugung in der Oberfläche verfügbar sind. Dazu gehören Fahrzeugdaten, Produktdaten und der Servicepreis aus der Vertragskalkulation. Nach der Konfiguration kommen die Zahlungsbedingungen hinzu, nach der Auswahl eines Händlerrabatts zusätzlich dieser Rabatt. Fehlen Angaben, zeigt das Dokument Platzhalter oder lässt die Bereiche aus. Bei jeder erneuten Erzeugung aktualisiert sich das Dokument. Der angezeigte Preis ist stets der Endpreis. Wurden Rabatte oder Kampagnen angewendet, erscheint nur der resultierende Endpreis, grün hervorgehoben.

Kopf und Fuß stellt die Vorlagenverwaltung bereit. Der Kopf enthält den festen Text „Price Information“, das Datum der Erzeugung, den Namen des Service-Vertragsprodukts, die Angaben zum Verkäufer aus ALICE, ein Bild und die Produktbeschreibung. Die Deckungscodes erscheinen mit ihrer Beschreibung. Am Ende steht der feste Hinweis, dass die Preisinformation Änderungen unterliegt, nur zu Diskussionszwecken dient und kein rechtsverbindliches Angebot darstellt. Verbindliche Zusagen setzen einen vollständig ausgefertigten, schriftlichen Vertrag voraus, der von den berechtigten Vertretern beider Parteien unterzeichnet ist.

**Besonderheiten je Sprache.** Die Auswahl der Sprachen im Reiter „Dokumente“ folgt den Allgemeinen Einstellungen. Das Material beschreibt zur Entfernung einer Sprache eine abweichende Regel, siehe Klärungsbedarf.

Quellen: Batch 975.1, 482.3

## 14.8 Produktdefinition, Anlage und Veröffentlichung

**Zweck.** Im Produktassistenten definieren Sie ein Produkt auf Basis eines Blueprints. Sie legen Basisinformationen, Vertriebs- und Vertragskonfiguration, Deckungen, Preismatrix, Fahrzeugvoraussetzungen und Zusammenfassung fest. Ein Produkt wird veröffentlicht, sobald Preisversion und Geschäftsbedingungen zugeordnet sind. Angebote in Kapitel 5 greifen auf veröffentlichte Produkte zu.

**Voraussetzungen.** Ein Blueprint ist verfügbar. Für die Veröffentlichung ist eine freigegebene Preisversion erforderlich, und dem Produkt sind die allgemeinen Geschäftsbedingungen AGB zugeordnet. Produkte lassen sich ohne zugeordnete AGB nicht veröffentlichen.

**Rollen.** Die Rolle MPC legt Produkte an, bearbeitet sie und weist Preise zu. Die Rollen MO und MPC mit der Division PC dürfen neue Produkte und Filter anlegen. Die Sichtbarkeiten beschreibt Unterkapitel 14.6.

**Schritt für Schritt: Produkt anlegen.**

1. Öffnen Sie „Manage Products & Prices“ und wählen Sie die Schaltfläche „Create“. Die Übersicht zeigt die Spalten Division, Product Name, Brand, Blueprint, Assigned Price, Validity, Status und Actions.
2. Im Schritt 1 prüft das System den Industry Code. Der Name des Industry Codes erscheint korrekt. Der Blueprint zeigt seine Daten an. Produktnamen dürfen bis zu 50 Zeichen lang sein. Blueprints und Produkte können in verschiedenen Divisionen denselben Namen tragen, die Eindeutigkeit prüft das System je Division.
3. Im Schritt 2 erscheinen die Deckungen des Blueprints. Die Bezeichnungen der Sales Level stimmen mit der Auswahl überein. Ohne eigenes Bild verwendet das System das Standardbild. Der Hinweis lautet „Default marketing image will be used if you don’t select another one“.
4. Im Schritt 3 legen Sie die Vertriebs- und Vertragskonfiguration fest. Zu den Zahlungsintervallen gehören monatlich, vierteljährlich, halbjährlich, jährlich und einmalig. Für die Zahlungsperioden wählen Sie mindestens eine der Varianten Einmalzahlung oder monatliche Zahlung. Sind beide deaktiviert, lässt sich das Produkt nicht speichern. Die Bezeichnung in Schritt 3 lautet „Pricing at Contract Sales Date“. Für VAN-Produkte sind die erlaubten Vertragsänderungen verfügbar.
5. Im Schritt 4 „Coverages“ ordnen Sie die Deckungen des Blueprints den Kategorien Included Coverages, Optional Coverages und Body Coverages zu. Beim ersten Anlegen sind nur die Included Coverages aktiv. Optionale Deckungen markieren Sie als Included oder Optional, Body Coverages können optional werden, jedoch nicht Included. Über „Edit Coverages“ legen Sie fest, welche Codes immer enthalten, optional oder nicht enthalten sind. Über „Configure Coverage“ konfigurieren Sie Kostenstelle, Sales Level und Ausschlüsse. Sie wechseln erst zum nächsten Schritt, wenn für alle optionalen und Body Coverages mindestens Kostenstelle und Sales Level gewählt sind. Die Ausschlüsse beschreibt Unterkapitel 14.14.
6. Im Schritt 5 legen Sie die Preismatrix und die Limits fest. Limits zeigen Mindest- und Höchstwerte für das Alter bei Vertragsbeginn in Monaten und für die Laufleistung in Kilometern, für MPC, Direct-to-Customer und Dealership.
7. Im Schritt 6 definieren Sie die Fahrzeugvoraussetzungen. Die Option „Allow vehicles with age less than“ akzeptiert Tage von 1 bis 999 ohne Dezimalstellen.
8. Im Schritt 7 prüfen Sie die Produktzusammenfassung und bestätigen. Der Bestätigungsdialog nach dem Absenden reagiert auf die Eingabetaste mit der Hauptaktion.
9. Speichern Sie einen Entwurf zu jedem Zeitpunkt als Entwurf. Ein Entwurf mit nur dem Produktnamen lässt sich speichern. Ein Entwurf lässt sich abschließen, auch wenn Sie zuletzt Schritt 4 bearbeitet haben. Nach dem Abschluss erhält das Produkt den Status „Erstellt“.
10. Veröffentlichen Sie das Produkt über die Aktion „Publish“. Das System prüft vorab, ob das Produkt veröffentlicht werden kann. Ist die Preisversion nicht freigegeben, lautet die Meldung „{Produktname} could not be published, because {Grund}“.
11. Über das Symbol „Assigned price“ gelangen Sie zur Preisversion. Ist keine Preisgültigkeit aktiv, erscheint das Symbol im Ghost-Zustand.
12. Über die Schaltfläche „T&C“ im Vertragsangebot sehen Dealer, MO und MPC die AGB des gewählten Produkts. Das Fenster erlaubt Lesen, Herunterladen und Drucken. Im Modal für den Produktvergleich müssen die AGB nicht enthalten sein.

**Ergebnis und Systemstatus.** Ein Produkt durchläuft die Status Erstellt, Bereit, Veröffentlicht und Deaktiviert. Der Status aktualisiert sich beim Veröffentlichen und Deaktivieren. Ein deaktiviertes Produkt lässt sich wieder aktivieren. Preise legen Sie nur für Produkte im Status „Erstellt“, „Bereit“ oder „Unveröffentlicht“ an. Ein Produkt im Status „Gelöscht“ nimmt keine neuen Preisversionen auf. Die Produktübersicht sortiert alphabetisch nach Division. Die Spalte „Assigned Price“ zeigt „N/A“ bei Entwürfen, ein deaktiviertes Symbol bei fehlender Preisversion und ein aktives Symbol bei mindestens einer Preisversion.

**Besonderheiten je Sparte und Markt.**

- Reifenprodukte mit dem Umfang „Unlimited“ zeigen die Felder für Zeit und Laufleistung als reine Anzeigefelder. Für Deckungscodes vom Typ Reifen stehen die Kostendefinitionen „No cost“ und „Product reference price“ zur Verfügung. Bei „No cost“ erscheint die optionale Deckung im Vertragsvorschlag mit dem Preis 0.
- Das Reifenprodukt „Van Unlimited“ unterstützt die Produktanlage als Standalone oder als Produktoption, das Hochladen der Preismatrix und die Preisanlage je Wetterprofil und Radgröße.
- Die Produktlinie „Basic“ ist für die Division Passenger Cars entfallen. Basic-Blueprints sind in die Produktlinie „Excellent“ übernommen. Die Produktlinien für Vans sind Maintenance, MaintenancePlus, Complete, Tire, Extended Warranty, SelectPlus und Wear/Tear.
- Die Produktsuche findet Produkte über die Baumuster-Kennung.

**Hinweise.**

- Die Übersichtsseiten für Produkte und Fahrzeuggruppen sortieren nach Erstellung oder letzter Änderung, die neuesten Einträge stehen oben. Die Suche nach Verträgen über Kunde oder Zahler beschreibt Kapitel 10.
- Die Auswahl „Anzahl pro Seite“ bleibt erhalten, wenn Sie zur Produktübersicht zurückkehren.
- Die Tastatur löst in Entscheidungsdialogen die Hauptaktion aus, zum Beispiel beim Löschen oder Veröffentlichen eines Produkts.
- Ist weder die Einmalzahlung noch die monatliche Zahlung aktiviert, lässt sich das Produkt nicht speichern.
- Die Preisinformations-E-Mail enthält für B2C-Kunden Bruttopreise.
- Der Produktnamenfilter unterscheidet nicht zwischen Groß- und Kleinschreibung. Die Spalte Produktname sortiert ohne Berücksichtigung der Schreibung.
- Die Produktübersicht zeigt die Preistabellen, die Informationen zu den AGB und die Blueprint-Details im Lesemodus.
- Die Kennzeichnung der Deckungstabelle unterscheidet, welche Positionen in die Preisberechnung eingehen und welche ausgeschlossen sind.
- Für den Blueprint gilt: Die Option „Contract Change“ entfällt aus der Auswahl „Allowed Modification“.
- Für Produkte mit konfigurierten Preisen zeigt die Preisinformation keine Ab-Preise an.

**Fehlerbehebung.**

- Die Meldung „Authentication forbidden“ erscheint bei der Veröffentlichung nicht, auch nicht bei Produkten mit AGB, die ein Datum in der Zukunft tragen.
- Die Meldung „Product name already used“ erscheint, wenn der Name bereits vergeben ist.
- Die Veröffentlichung eines Produkts mit einem Preisversionsdatum, das dem Datum der AGB entspricht, gelingt.
- Das Bild eines veröffentlichten Produkts bleibt nach dem Speichern auf der Seite Basisinformationen und in der Zusammenfassung sichtbar.
- Schritt 3 der Produktbearbeitung lädt vollständig.
- Die Auswahl im Produktassistenten für Zahlungsperioden bleibt aktiv, auch wenn Sie einen Schritt zurückgehen und wieder vorwärts navigieren.
- Die Veröffentlichung eines Produkts im Status „Deaktiviert“ gelingt, wenn die Preisversion freigegeben ist.
- Das Anlegen und Aktualisieren von Preisversionen liefert keine Fehlermeldung „Bad Request“.
- Für konfigurierte Kombinationen findet das System die passenden Produkte.

Quellen: Batch 1271.1, 1275.1, 1147.1, 1272.4, 1258.2, 1246.2, 1283.1, 1277.2, 1200.1, 1252.2, 1278.2, 1280.2, 806.5, 1260.2, 1228.3, 978.1, 408.4, 1263.2, 1251.1, 1264.1, 1284.3, 1270.4, 1243.3, 1134.3, 1228.4, 1204.5, 1248.1

## 14.9 Preisversionen, Cluster und Faktorgrenzen

**Zweck.** Eine Preisversion legt fest, ab welchem Datum welche Preise gelten. Sie enthält Cluster. Ein Cluster ist eine Preismatrix mit Laufleistung, Laufzeit und Preisen für eine Fahrzeuggruppe. Die Verwaltung erfolgt in der Preisversionsübersicht.

**Voraussetzungen.** Das Produkt hat den Status Erstellt, Bereit, Veröffentlicht oder Deaktiviert. Für einen Cluster existiert eine Fahrzeuggruppe, sofern der Cluster nicht als Basispreis-Cluster angelegt ist.

**Rollen.** MPC-Anwender legen Preisversionen und Cluster an. Eine Rolle mit Anzeigeberechtigung sieht die Preise im Lesemodus. Der Antragsteller und der Prüfer eines Preisversionsentwurfs sind unterschiedliche Personen. Die Freigabe ist in allen Märkten verpflichtend. Der Abschnitt Vier-Augen-Freigabe beschreibt den Ablauf.

**Schritt für Schritt: Preisversion anlegen.**

1. Öffnen Sie die Preisversionsübersicht und wählen Sie das Produkt. Vorausgewählt ist das zuletzt gewählte Produkt. Wählen Sie „Create Price Version“.
2. Vergeben Sie einen Versionsnamen. Die Länge ist ein Pflichtfeld mit 3 bis 100 Zeichen. Bei einer Abweichung erscheint die Meldung „Min. 3 and max. 100 characters allowed. Please correct your input and try again“. Der Versionsname muss innerhalb des Produkts eindeutig sein.
3. Das Feld für das Produkt ist mit dem Namen des Produkts vorbelegt.
4. Legen Sie das Startdatum in der Zukunft fest. Das System schlägt ein Datum eine Woche nach dem heutigen Tag vor. Haben Sie bereits Versionen mit Startdatum in der Zukunft, schlägt das System den Tag nach dem spätesten Startdatum vor. Liegt das vorgeschlagene Datum bei der abschließenden Bestätigung in der Vergangenheit, setzt das System es auf das Freigabedatum.
5. Die Schaltfläche „Create“ ist aktiv, sobald Versionsname und Startdatum angegeben sind. Die Erfolgsmeldung lautet „"Price Version X" was successfully created“. Sie bleibt 15 Sekunden sichtbar. Schlägt das Anlegen fehl, erscheint die Meldung „Something went wrong, and we could not create your price version. Please try again.“ mit einer Schaltfläche „Close“. Mit „Cancel“ speichert das System nichts.
6. Legen Sie einen Cluster über „New Cluster“ an. Sie vergeben einen Clusternamen und wählen eine Fahrzeuggruppe per Einfachauswahl. Name und Fahrzeuggruppe sind Pflichtangaben. Der Name der Preisversion ist vorausgefüllt.
7. Die Preistabelle entsteht aus dem zweiten Schritt der Produktanlage. Die Laufleistung in Kilometern steht in der ersten Spalte, zum Beispiel 0, 5.000, 10.000 und 15.000. Die Laufzeit in Monaten steht in der Kopfzeile, zum Beispiel 6, 12, 18 und 24. Beide Achsen entstehen aus Min, Max und Step. Erlaubt sind nur Ziffern mit höchstens zwei Nachkommastellen.
8. Zellen, deren Produkt aus Laufzeit und Laufleistung den Max-km-Wert multipliziert mit der minimalen Laufzeit übersteigt, sind ausgegraut.
9. Die Schaltfläche „Create“ ist aktiv, sobald mindestens ein Preispunkt eingetragen ist. Die Erfolgsmeldung lautet „"Cluster X" was successfully created.“
10. Alternativ laden Sie die Preise über „Download Template“ und „Upload XLS“ hoch. Die Schaltfläche „Upload XLS“ ist erst nach dem Download der Vorlage aktiv. Das System übernimmt alle Werte aus der Vorlage in die Preistabelle.
11. Ein Basis-Preiscluster lässt sich ohne Fahrzeuggruppe anlegen und als Basispreis-Cluster kennzeichnen. Alle weiteren Cluster leiten Sie über einen Faktor oder einen Prozentwert vom Basis-Preiscluster ab. Entfernen Sie die Fahrzeuggruppe eines bestehenden Clusters, zeigt das System eine Warnung.
12. Ein relativer Basispreis-Cluster RBPC übernimmt die Preismatrix eines absoluten Basispreis-Clusters mit einem Faktor. Der Schalter „Relative base price cluster“ ist standardmäßig ausgeschaltet. Bei aktiviertem Schalter erscheinen die Pflichtfelder „Reference Cluster“ mit dem Standardwert „none“ und „Multiplication factor“ mit dem Standardwert 1. Der Faktor hat maximal sechs Ziffern, eine vor und fünf nach dem Komma, zum Beispiel 0.12345 oder 1.23456. Mit „Apply“ füllt das System die Preismatrix mit den Werten des Referenzclusters, multipliziert mit dem Faktor. Bei aktivem Schalter ist die Preismatrix schreibgeschützt.
13. Die Vorschau „Reference Prices and Changes“ zeigt die ursprünglichen Preise des Referenzclusters und die Differenz durch den Faktor.
14. Ein Cluster, der selbst einen anderen Cluster referenziert, lässt sich nicht als Referenz wählen. Ein referenzierter Cluster lässt sich nicht löschen. Beim Speichern informiert Sie das System, welche Cluster sich dadurch ändern.
15. Bearbeiten Sie einen Cluster über „Edit“. Sie ändern den Clusternamen, die Fahrzeuggruppe und die Preise. Mit „Update“ speichern Sie, mit „Cancel“ verwerfen Sie. Die Erfolgsmeldung lautet „"Cluster X" was successfully updated“.
16. Duplizieren Sie einen Cluster über „Duplicate“. Sie vergeben einen Namen und wählen eine Fahrzeuggruppe, die im gleichen Gültigkeitszeitraum noch keinem Cluster zugeordnet ist.
17. Löschen Sie einen Cluster über „Delete“. Die Aktion ist nur für Cluster möglich, die nicht zu einer aktiven Preisversion gehören. Vor dem Löschen bestätigen Sie den Hinweis, dass Sie den Cluster mit allen Details verlieren.
18. Duplizieren Sie eine Preisversion über „Duplicate“. Der Name lautet „Copy of <Name der kopierten Preisversion>“. Das Startdatum liegt in der Zukunft. Alle Cluster werden kopiert. Die Kopien behalten ihren Namen, stehen aber in keiner Verbindung zu den Originalen.
19. Löschen Sie eine Preisversion nur, wenn ihr Startdatum in der Zukunft liegt. Das System entfernt das Enddatum der vorherigen Version. Folgt auf die gelöschte Version eine weitere Version, übernimmt diese das Startdatum der gelöschten Version.
20. Bearbeiten Sie eine Preisversion mit Startdatum in der Zukunft vollständig. Bei der aktuellen Preisversion ändern Sie nur den Namen. Ändern Sie das Startdatum, passt das System das Enddatum der aktuell gültigen Version auf einen Tag vor dem neuen Startdatum an.
21. Reichen Sie die Preisversion zur Prüfung ein. Eine Preisversion lässt sich nur einreichen, wenn sie mindestens einen Cluster enthält. Über „Submit for Review“ wechselt der Status in der Spalte „4 Eye“ auf „In Review“.

**Vier-Augen-Freigabe.** Der Prüfer sieht blaue Punkte bei geänderten Produkten, Preisversionen und Clustern. Er gibt die Preisversion mit „Approve“ frei. Bearbeitet er die Version oder einen Cluster, wechselt „Approve“ zu „Submit for Review“. Der Prozess wiederholt sich, bis die Freigabe erfolgt. Aktive Preisversionen tragen den Status „Approved“, Preisversionen mit Startdatum in der Zukunft den Status „In Review“. Eine Preisversion ist aktiv, wenn ihr Startdatum heute oder in der Vergangenheit liegt, ihr Ablaufdatum leer oder in der Zukunft liegt und ihr Status „Approved“ lautet. Es darf sich nur eine Preisversion in der Freigabe befinden. Existieren mehrere Entwürfe, reicht nur der älteste ein.

**Ergebnis und Systemstatus.** Eine Preisversion wirkt ab ihrem Startdatum. Die Übersicht zeigt die Spalten Version, Startdatum, Ablaufdatum bei abgelaufenen Versionen, Anzahl der Cluster und Aktionen. Die Option „Show expired versions“ ist standardmäßig nicht aktiviert. Der Bereich der Cluster zeigt die Meldung „This Price Version has no cluster“, solange kein Cluster existiert. Die Preis-Cluster sortiert das System alphabetisch. Bei einem Produkt mit Preisversionen in Deutschland sind im Bereich Passenger Car etwa 100 Cluster je Produkt üblich.

**Besonderheiten je Rolle, Sparte und Markt.**

- Der deutsche Markt pflegt alle Preise auf Basis eines künstlichen Basismodells und leitet daraus per Prozentfaktor die Preistabellen der real existierenden Modelle ab.
- Die Vier-Augen-Freigabe gilt in allen Märkten.
- Benutzer mit der Rolle MPC können Cluster über „Manage Vehicle Groups“ in allen Feldern bearbeiten, sofern das Produkt eine gültige Preisversion hat. Die Datenfelder und der Pricing Factor sind in beiden Wegen bearbeitbar.
- Die Vertriebskanäle der Händlerprovision sind Teil der Preisversion und unabhängig von den Vertriebskanälen des Produkts.

**Hinweise.**

- Das Material nennt für den Industriefaktor in Prozent einen Maximalwert von 999 und einen Minimalwert von 0. Die Grenze von 100 Prozent steht im Klärungsbedarf.
- Die Dealer Commission akzeptiert 0 oder keinen Wert.
- Die Dezimaltrennzeichen Punkt und Komma sind in den Zellen und Preisfaktoren zulässig. Eine falsch formatierte Eingabe wie „10,000.00“ weist das System hin oder passt sie nach Möglichkeit an.
- Die Schaltfläche „Create“ im Bearbeitungsdialog eines Clusters ist nur bei gültigen Eingaben aktiv.
- Wird die Preismatrix eines Produkts geändert, aktualisieren sich bestehende Cluster. Eine Reduzierung der maximalen Gesamtlaufleistung, zum Beispiel von 90.000 auf 70.000 km, wirkt sich auf bestehende Cluster aus.
- Eine Preisversion verwendet für Optionen und technische Optionen die Kostendefinition und die Kostenabhängigkeit, die Sie im Schritt „Price Version Setup“ wählen. Ändern Sie die Kostendefinition, setzt das System die Matrixwerte zurück. Cluster mit einer leeren Matrix erhalten ein Warnsymbol mit dem Hinweis „One or more optionals are missing prices“.
- Eine Erfolgs- oder Fehlermeldung zum Löschen bleibt 15 Sekunden sichtbar oder bis Sie sie schließen.
- Die Vertriebskanäle einer Preisversion bestimmen die Provisionsberechnung. Die Auswahl wird als Bestandteil der Preisversion gespeichert. Sie ist unabhängig von den Vertriebskanälen auf Produktebene.
- Die Zahlungsarten je Kundentyp legt das System gegen die Markteinstellungen ab. Die Preisversion ist der Abgleichspunkt. Wird eine Zahlungsart nicht zugeordnet, speichert das System die Preisversion als Entwurf mit Warnhinweis. Die Einreichung blockiert das System mit der Meldung „No payment configured for {Kundentyp}, remove {Kundentyp} from Product {Name}.“

**Fehlerbehebung.**

- Die Schaltfläche „Speichern“ beim Bearbeiten eines Clusters ist aktiv.
- Das Anlegen eines Clusters mit nur einem Preispunkt gelingt.
- Beim Löschen eines Clusters aktualisiert sich die Tabelle der Preisversionen.
- Das Hochladen einer XLSX-Datei mit der Preismatrix auf der Clusterseite gelingt.
- Der Datumsauswähler für das Startdatum lässt alle Termine in kommenden Monaten zu.
- Ein Basis-Cluster, der den Maximalwert überschreitet, lässt sich nicht speichern.
- Ein Cluster für den relativen Basispreis mit leerem Preisfaktor lässt sich nicht einreichen.

Quellen: Batch 1259.3, 1144.2, 1189.2, 1276.1, 1146.1, 1273.3, 1278.4, 1270.2, 1272.5, 1222.3, 1232.2, 1256.1, 1280.5, 1223.2, 1221.2, 1254.2, 1248.1, 1232.3, 1232.5, 1159.1, 1159.3, 1159.4, 1159.6, 1159.7, 1277.4, 1282.5, 1211.2, 1232.1, 1232.4, 1234.1, 1234.2, 1234.4, 1234.5, 1234.6, 1255.2, 1256.2, 1268.6, 1165.1, 1201.5, 1218.1, 1274.2, 1281.1, 1279.4, 1144.1, 1175.1, 1233.1, 1154.5, 1155.1, 1123.1, 1.3

## 14.10 Produktänderung, Versionierung und Bestandswirkung

**Zweck.** Eine Produktversion ermöglicht die Änderung eines veröffentlichten Produkts, ohne es vorher zu deaktivieren. Das System speichert jede Version. Historische Daten bleiben erhalten und stehen für Prolongationen und Preise der Vergangenheit zur Verfügung.

**Voraussetzungen.** Das Produkt hat den Status Published oder Deactivated. Eine neue Version lässt sich aus einem Produkt mit diesen Status erstellen. Die Version 1 besitzt das Produkt bereits.

**Rollen.** Die Rolle MPC in den Divisionen PC und Van legt Produktversionen an und ändert sie.

**Schritt für Schritt.**

1. Öffnen Sie ein veröffentlichtes Produkt. Im Aktionsmenü stehen „Edit This Version“, „Deactivate“, „Manage Prices“, „Manage T&C“ und „Delete“ zur Verfügung. „Deactivate“ erscheint nur bei veröffentlichten Produkten. Die Aktion „Edit“ für Name, Beschreibung, zusätzliche Informationen und Bild bleibt erhalten.
2. Wählen Sie „Edit This Version“. Das System legt Version 2 im Status Draft an, die Versionsnummern laufen fortlaufend V1, V2 und so weiter. Wählen Sie das neue Änderungsdatum „Effective Modification“. Die Vorgängerversion endet am Tag vor diesem Datum.
3. Bearbeiten Sie die Schritte. Schritt 1 Blueprint-Setup bleibt unverändert. Schritt 2 Basisinformationen und Schritt 3 Vertriebs- und Vertragskonfiguration sind änderbar. Ändern sich Vega-Codes oder Branchencodes, aktualisieren Sie die Branchen. Schritt 4 Deckungen bleibt unverändert. Wirken sich Änderungen in den Schritten 3, 5 oder 6 auf nachgelagerte Konfigurationen aus, erscheint beim Klick auf „Weiter“ ein Hinweis.
4. Ändern Sie die Geschäftsbedingungen über die Aktionsschaltfläche. Die geänderten AGB gelten für das gesamte Produkt.
5. Weisen Sie Preise zu. Ist die zugewiesene Preisversion freigegeben und die vorherige Produktversion veröffentlicht, veröffentlicht das System die neue Version automatisch.
6. Die Änderungshistorie zeigt alle Änderungen in allen Status über alle Versionen hinweg.

**Versionsstatus.** Eine Version durchläuft die Status Draft, Created, Ready, Published und Deprecated. Draft bedeutet mindestens eine Änderung. Created bedeutet eine Preisversion ohne Cluster. Ready bedeutet eine Preisversion mit Cluster. Published bedeutet, dass Preisversion und Cluster freigegeben sind. Wird eine Version veröffentlicht, wechselt die veröffentlichte Vorgängerversion auf Deprecated. Es ist immer nur eine Version eines Produkts veröffentlicht. Für den Lebenszyklus sind nur folgende Übergänge zulässig: von Draft zu Created oder Deleted, von Created zu Ready oder Deleted, von Ready zu Published oder Deleted, von Published zu Deactivated und von Deactivated zu Published. Jeder andere Übergang lehnt das System ab und verändert die Version nicht.

**Ergebnis und Systemstatus.** Die Aktion „Bearbeiten“ für die vollständige Version steht nur in den Status Draft, Created und Ready zur Verfügung. Für Published, Deactivated und Deleted blendet die Oberfläche sie aus, das Backend lehnt sie ab. Die Aktion „Metadaten bearbeiten“ steht in jedem Status zur Verfügung und macht die Version nicht insgesamt bearbeitbar. Die Automatik zur Veröffentlichung gilt ab Version 2. Die erste Version veröffentlichen Sie immer manuell. Ohne zugewiesene Preise fehlt der grüne Haken bei „Manage Prices“, und die Veröffentlichung ist nicht möglich.

Die Versionsdetails zeigen Status, Startdatum und Enddatum. Das Startdatum der Version 1 entspricht dem Start der ersten Preisversion, das Startdatum einer neuen Version dem Start der zugewiesenen Preisversion. Das Enddatum richtet sich nach der zugewiesenen Preisversion. Die Produktübersicht enthält die Spalte „Effective Modification“.

Die Versionsdaten speichert das System im Backend. Bei Generierung und Verwaltung übermittelt es die Versionen im Payload. Die Version ist mit der Preisversion verknüpft. Das Produktsystem gibt dem Vertrag die Produktversion und die Preisversion mit. Der Vertrag speichert beide Werte und verwendet sie für alle weiteren Abfragen.

**Besonderheiten je Sparte und Markt.**

- Kampagnen sind einem oder mehreren Produkten zugeordnet. Diese Produkte können mehrere Versionen in unterschiedlichen Status besitzen. Entfernen Sie ein Sales Level, einen Kundentyp oder einen Vertriebskanal, berechnet das System für diesen Bereich keine Preise mehr. Entfernen Sie eine Kampagne aus den zugänglichen Rabatten, verliert ein Kunde den Zugriff auf den Preis mit Kampagnenrabatt.
- Qualifiziert sich eine neue Produktversion für bestehende Kampagnen, erscheint sie in der Auswahl der Cluster mit der jeweiligen Version. Qualifiziert sie sich nicht, erscheint das Produkt nicht, und Sie müssen eine neue Kampagne anlegen.
- Prolongationen senden die gespeicherte Produkt- und Preisversion an das Produktsystem. Das Produktsystem entscheidet, ob die Verlängerung mit den ursprünglichen Versionen fortgeführt wird oder ob aktualisierte Versionen gelten.
- Alle früheren Versionen eines Vertrags bleiben in der Datenbank erhalten. Für weitere Operationen verwendet das System nur die aktuellen Versionen.
- Für Leasingverträge ermittelt das System die Preisversion, die zum Zeitpunkt der Angebotserstellung aktiv war, wenn das Datum in der Vergangenheit liegt. Der Name der verwendeten Preisversion erscheint im Vertrag.

**Hinweise.**

- Änderungen an Produkten oder Markteinstellungen geben Sie an Preisversionen im Status Draft weiter. Die Weitergabe betrifft Preisversionen mit aktuellem Datum oder Startdatum in der Zukunft. Bei Entwürfen mit Startdatum in der Zukunft erfolgt die Weitergabe automatisch, und das System zeigt einen verpflichtenden Hinweis an. Eine Kampagne im Status „In Review“ oder „Approved“ sperrt Weitergabe und Bearbeitung. Mit „Duplicate“ erstellen Sie eine neue bearbeitbare Instanz.
- Wird eine optionale Deckung von Optional auf Immer eingeschlossen oder Nicht eingeschlossen gesetzt, entfällt die Preisgestaltung für diese Deckung. Wechselt die Deckung von Immer eingeschlossen oder Nicht eingeschlossen auf Optional, legt das System die Preisgestaltung im Reiter für optionale Deckungen an. Die Werte stehen auf „No cost“, ein rotes Warnsymbol kennzeichnet die Positionen.
- Der Verlauf einer Preistabelle zeigt bei einer Langzeitverlängerung die Preisänderungen mit dem Datum der Anwendung.
- Eine Vertragsänderung, die die Preisbestandteile nicht verändert, erscheint nicht in der Preistabelle.

**Fehlerbehebung.**

- Eine neue Version aus einem Produkt mit dem Status Draft, Created, Ready oder Deleted lehnt das System ab.
- Solange eine Version nicht aktiv ist, lässt sich keine weitere Version anlegen. Das System weist darauf hin.
- Für ein gelöschtes Produkt legt das System keine neue Preisversion an.

Quellen: Batch 1155.1, 1136.1, 1137.2, 1140.1, 896.1, 1209.2, 1282.4, 1253.3, 1229.1, 1155.1

## 14.11 Fahrzeuggruppen und Van-Baumuster-Clustering

**Zweck.** Eine Fahrzeuggruppe fasst Baureihen oder Modellcodes zusammen, die in einer Preisversion gemeinsam bepreist werden. Die Verwaltung erfolgt unter „Manage Vehicle Groups“, getrennt nach den Divisionen Passenger Cars und Vans. Ein Clusterauswahlfeld verweist auf die Fahrzeuggruppe.

**Voraussetzungen.** Das Produkt besitzt mindestens eine Preisversion. Produkte im Status Created, Ready, Published oder Deactivated erscheinen zur Auswahl. Produkte im Status Temp oder Deleted erscheinen nicht.

**Rollen.** Die Rolle MPC legt Fahrzeuggruppen an, bearbeitet und löscht sie. Die Rolle MO und die Rolle MPC suchen nach Baumustern. Die Rolle MO erhält Zugriff auf die Fahrzeuggruppenseite.

**Schritt für Schritt: Fahrzeuggruppe anlegen.**

1. Starten Sie den Vorgang in der Übersicht über „Create Vehicle Group“ oder auf der Seite „Cluster anlegen“. Der Ablauf umfasst drei Schritte.
2. Im Schritt 1 vergeben Sie Name und Beschreibung. Startet der Vorgang aus der Übersicht, wählen Sie zusätzlich Produkt und Preisversion. Der Status der Preisversion erscheint als Zusatz, zum Beispiel Current oder Upcoming. Für Produkte im Status Published legen Sie Fahrzeuggruppen nur in Preisversionen mit Startdatum in der Zukunft an. Bei Created, Ready und Deactivated sind aktuelle Preisversionen und Preisversionen mit Startdatum in der Zukunft möglich. In vergangenen Preisversionen legen Sie keine Gruppen an.
3. Startet der Vorgang auf der Seite „Cluster anlegen“, wählen Sie im Dropdown für Fahrzeuggruppen die Option zum Erstellen einer Gruppe. Die neue Gruppe ordnet das System automatisch dem gerade definierten Cluster zu.
4. Die Schaltfläche „Weiter“ wird aktiv, sobald alle Pflichtfelder korrekt und mit den Mindestangaben gefüllt sind. Ein doppelter Name führt zu einer Validierungsmeldung am Eingabefeld.
5. Bricht der Vorgang ab, erscheint bei ungespeicherten Änderungen ein Bestätigungsdialog. Bestätigen Sie den Abbruch, verlassen Sie den Vorgang ohne Speichern.
6. Im Schritt 2 ordnen Sie Baureihen oder Modellcodes zu. Die Filter entsprechen der Übersichtsseite. Mit „Show more filters“ blenden Sie zusätzliche Filter ein. Die Suche arbeitet mit Teilen der Baureihe und benötigt mindestens drei numerische Zeichen. Die Eingabetaste startet die Suche, die X-Schaltfläche setzt Suchbegriff, Filter und Ergebnisse zurück.
7. Die Ergebnisse erscheinen seitenweise. Baureihen, die bereits einer anderen Fahrzeuggruppe derselben Preisversion zugeordnet sind, erscheinen in der gesamten Zeile grau. Die angewendeten Filter erscheinen als Labels. Die Schaltfläche „Weiter“ wird aktiv, sobald ein Filter angewendet ist.
8. Im Schritt 3 prüfen Sie die Übersicht. Die Karte zeigt Name und Beschreibung, die Tabelle die zugeordneten Baureihen. Mit „Erstellen“ legen Sie die Gruppe an.

**Schritt für Schritt: Baumuster suchen und zuordnen.**

1. Öffnen Sie die Ebene „Search Baumuster“ und geben Sie die Suchkriterien ein. Das Feld „Search“ sucht einen BM6-Code exakt. Mit „Search for Baumusters“ starten Sie die Suche.
2. Wählen Sie die Baumuster, die noch keiner Fahrzeuggruppe derselben Preisversion zugeordnet sind. Die Schaltfläche „Add to Vehicle group“ ist aktiv, sobald Sie mindestens ein Baumuster gewählt haben.
3. Im Pop-up wählen Sie die Fahrzeuggruppe per Radiobutton. Der erste Eintrag ist vorausgewählt. Ist keine Gruppe vorhanden, erscheint der Hinweis „Please create first a vehicle group“.
4. Mit „Add“ ordnen Sie die Baumuster zu. Die Erfolgsmeldung nennt die Anzahl der zugeordneten Baumuster und den Gruppennamen. Schlägt die Zuordnung fehl, erscheint die Meldung „Selected baumusters could not be assigned“.
5. Mit „Cancel“ schließen Sie das Pop-up und behalten Ihre Auswahl.
6. Die Suche nach einem Modellcode erfolgt im Reiter „Search Model Code“. Wählen Sie zuerst Passenger Cars oder Vans. Der Modellcode ist ein Pflichtfeld, Sie suchen jeweils einen Modellcode. Das Ergebnis zeigt Model Code, Vehicle Group, Cluster Name, Price Version und Product Name. Bei Vans zeigt das Ergebnis zusätzlich den SA Code. Ein ungültiger Modellcode zeigt „No Records Found.“.

**Schritt für Schritt: Fahrzeuggruppe bearbeiten und löschen.**

1. Öffnen Sie die Karte der Fahrzeuggruppe. Bei den Status Created und Ready bearbeiten Sie die Gruppe in der aktuellen Preisversion und in Preisversionen mit Startdatum in der Zukunft. Bei Published und Deactivated bearbeiten Sie nur Preisversionen mit Startdatum in der Zukunft. Vergangene Preisversionen zeigen die Gruppe nur an.
2. Wählen Sie „Edit“. Ein Pop-up öffnet sich, in dem Sie Name und Details ändern. Mit „Update“ speichern Sie. Die Erfolgsmeldung lautet „Vehicle Group "X" was successfully updated“.
3. Entfernen Sie Baumuster über „Entfernen“. Ein zweites Pop-up bestätigt den Vorgang. Die entfernten Baumuster stehen danach für eine andere Fahrzeuggruppe zur Verfügung.
4. Zum Löschen wählen Sie die Aktion auf der Karte. Das Pop-up warnt, dass die Gruppe mit allen Details verloren geht und die Baumuster entfernt, aber nicht gelöscht werden. Mit „Delete“ bestätigen Sie. Die Meldung lautet „Vehicle Group "X" was successfully deleted“.

**Automatische Benennung.** Für Passenger Cars und Vans erzeugt das System Name und Beschreibung auf Basis der gewählten Filter. Der Schalter „Enable System-Generated Vehicle Group Name & Description“ steht auf der Seite „Vehicle Group Setup“ und ist standardmäßig ausgeschaltet. Ist er aktiv, sind die Felder für Name und Details deaktiviert. Auf der Übersichtsseite lassen sich Name und Beschreibung vor der Bestätigung überschreiben. Die Beschreibung umfasst bis zu 1500 Zeichen. Ändern Sie die Filter, überschreibt das System Name und Beschreibung. Navigieren Sie nur vor und zurück, bleiben Ihre Anpassungen erhalten.

Für Vans folgt der Name der Reihenfolge Klasse, Baureihe, SA-Code, Aufbauart, Motorleistung, zulässiges Gesamtgewicht, Antriebsformel und Motortyp. Die Klasse Vito wird zu VT, Viano zu VN, Citan zu C und Sprinter zu S. Bei Mehrfachauswahl steht ein Kürzel mit dem Zusatz M. Die Motorleistung erscheint mit PS, sofern vorhanden, sonst mit KW. Das zulässige Gesamtgewicht erscheint in Tausend, zum Beispiel 3.5K. Der Motortyp erhält das Präfix MT.

Für Passenger Cars folgt der Name den Kürzeln Klasse, Baureihe, HPE, 4Matic, Hybrid, ISP, Motortyp und Motorzylinder. Nur relevante Filter mit einem Wert erscheinen. Der Motortyp erhält das Präfix MT, der Motorzylinder das Präfix CY.

**Ergebnis und Systemstatus.** Die Karten zeigen den Namen als Titel, das Datum der letzten Änderung und das Kürzel des Bearbeiters als Untertitel. Die gespeicherten Filter erscheinen als Labels. Links in der Fußzeile steht das Produkt, rechts der Clusterbezug. Ist die Gruppe einem Cluster zugeordnet, zeigt die Fußzeile den Clusternamen. Ein Klick führt zum Cluster. Andernfalls steht dort „Unassigned to cluster“. Die Karten erscheinen nach dem Datum der letzten Änderung, die neueste zuerst.

**Besonderheiten je Sparte und Markt.**

- Für Vans enthält die Tabelle der nicht zugewiesenen Modellcodes die Daten der Fahrzeuge. Die Filter „Max Total Weight“ zeigen die Werte 3.000 kg, 3.500 kg, 4.100 kg oder 5.000 kg. Das Gewicht leitet das System aus der fünften Stelle des Baumusters ab, und zwar nur für die Baureihen 907 und 910. Für andere Baureihen zeigt das System NA.
- Die Vans-Fahrzeugtypen erhalten bei der Anbindung an CePro den Modelltyp in einer eigenen Spalte.
- Für Reifenverträge mit Fahrzeugen, deren SA-Codes unterschiedliche Reifengrößen enthalten, berücksichtigt das System die größere Reifengröße.
- Im Vertragsangebot wählt der Händler bei mehreren Fahrzeuggruppen die passende aus. Der Startpreis passt sich an.
- Der Standardmarkt ist DE.
- Fahrzeuggruppen mit ISP-Daten bilden Sie aus ISP-Codes, um die Fahrzeuge getrennt zu bepreisen. Das System importiert die ISP-Informationen einmal pro Woche aus der VEGA-Datei i131.

**ISP-Daten.** Im Admin-Bereich der Fahrzeugverwaltung führt der Reiter ISP-Codes alle Modellcode-Baureihen mit ISP-Code, sortiert aufsteigend. Die Liste wird je Markt geführt. Mit „Upload .xlsx file“ ersetzen Sie die Liste vollständig. Beim Hochladen prüft das System doppelte Zeilen anhand der Kombination aus Baureihe, SA-Code und ISP-Code. Jeder Eintrag enthält einen SA-Code mit drei alphanumerischen Stellen, eine Standardbeschreibung und bis zu zwei weitere Sprachbeschreibungen, ein Zeitfeld, ein Kilometerfeld und ein FRD-Feld. Ein Fahrzeug gilt als „mit ISP“, wenn die Fahrgestellnummer direkt in der Liste steht. Ein Fahrzeug gilt als „ohne ISP“, wenn weder Fahrgestellnummer noch Modellcode in der Liste oder in der hochgeladenen Liste vorkommen. Andernfalls zeigt das System den Zustand als nicht sicher bestimmbar. Bei Filter ISP Yes markiert das System jedes Fahrzeug mit mindestens einem ISP.

**Hinweise.**

- Die Schaltfläche „Suchen“ in Schritt 2 ist aktiv, sobald ein Filter gewählt ist.
- Wird eine Fahrzeuggruppe mit ISP-Code-Filter gewählt, erscheinen zusätzliche Informationen aus der ISP-Tabelle.
- Bei den verfügbaren Produkten zeigt die Fahrzeugverwaltung an, ob ISP enthalten ist. Die Aussagen lauten „Fahrzeug hat“, „hat nicht“ oder „ISP-Enthalten-Sein ist nicht genau bestimmbar“.
- Dialoge schließen Sie nicht durch einen Klick auf den dunklen Hintergrund. Die Hinweise zu Dialogen beschreibt Unterkapitel 14.5.
- Eine Fahrzeuggruppe, die einem Cluster zugeordnet ist, erscheint mit dem Clusternamen auf der Karte.
- Die Liste der Fahrzeuggruppen sortiert nach Datum der letzten Änderung.
- Die Filter „Assigned Product“ und „Price Version“ sowie der Suchbegriff bleiben beim Zurückkehren auf die Seite erhalten.
- Die Listen für Brand, Division, Class und Series sind Mehrfachauswahlen und alphabetisch sortiert.
- Der Dialog „Weitere Filter“ öffnet sich unmittelbar.

**Fehlerbehebung.**

- Eine Gruppe mit bereits vergebenem Namen erhält die Meldung „Vehicle Group X already used“. Ungültige Namen erhalten die Meldung „Please enter a valid vehicle name“.
- Schlägt das Anlegen fehl, lautet die Meldung „Vehicle Group "X" could not be created.“. Die Meldung bleibt bis zum Schließen sichtbar.
- Van-Fahrzeuggruppen legen Sie ohne Berechtigungsfehler an.
- Die Hinweismeldung beim Hinzufügen von Baumustern nennt die tatsächliche Anzahl. Alle ausgewählten Baumuster werden zugeordnet, die Anzeige aktualisiert sich ohne manuelles Neuladen.
- Ein entferntes Baumuster verschwindet sofort aus der Liste.
- Die Namensvalidierung zeigt nur noch eine Fehlermeldung.
- Das Laden von Fahrzeuggruppen funktioniert zuverlässig.
- Die Tabelle der nicht zugewiesenen Modellcodes zeigt bei Vans die Daten an.

Quellen: Batch 12.1, 16.1, 20.1, 17.2, 1151.1, 9.1, 17.1, 25.1, 26.2, 28.1, 28.2, 28.4, 3.4, 1277.6, 1172.1, 1177.1, 19.2, 10.2, 21.1, 27.1, 8.2, 18.1, 11.1, 333.3, 1250.2, 26.1, 1278.6, 13.1, 6.1, 14.1, 27.2, 948.3, 1176.1, 1274.5, 22.3, 1272.7, 1273.7, 1311.2, 1162.2, 1266.3, 1266.4, 5.2, 7.2, 21.2, 28.3, 2.2, 21.3, 1270.4, 1277.4

## 14.12 Product Testing als Arbeitsbereich

**Zweck.** Mit dem Produkttest prüfen MPC-Benutzer ein Produkt mit simulierten Parametern. Der Test ist vor, während und nach der Veröffentlichung möglich. Er zeigt, ob Produkt und Preise korrekt konfiguriert sind.

**Voraussetzungen.** Sie sind als MPC-Benutzer angemeldet. Das Produkt ist in einem Status vorhanden, der für den Test wählbar ist.

**Rollen.** Der MPC-Benutzer findet den Produkttest unter „Product Management“, „Product Testing“. Der MO-Benutzer nutzt den Ablauf unter „Contract Generation“, „Contract Offering“. Der MPC-Benutzer sieht zusätzliche Felder zur Einrichtung des Tests.

**Schritt für Schritt.**

1. Wählen Sie im Aktionsmenü eines Produkts die Aktion „Test Product“ oder öffnen Sie die Seite „Product Testing“.
2. Erfassen Sie die Parameter. Die Seite zeigt die Parameter des ersten Schritts der Vertragserstellung und zusätzliche Angaben für den Test. Sie identifizieren das Fahrzeug über das Baumuster, die Fahrgestellnummer oder die Auftragsnummer.
3. Nach der Eingabe eines Fahrzeugidentifikators zeigt das System die Fahrzeugdetails und, sofern vorhanden, den aktuellen Kilometerstand.
4. Wählen Sie im Status-Dropdown die Produkte, die in die Testdaten eingehen: Ready, Published oder Deactivated.
5. Wählen Sie das Testdatum im Datumsauswähler. Es beginnt heute und simuliert ein Datum in der Zukunft, damit Sie Preisversionen mit Startdatum in der Zukunft testen können. Ist der Schalter für das simulierte FRD-Datum ausgeschaltet, wählen Sie das FRD-Datum.
6. Im Dropdown „Sales Level“ wählen Sie die Vertriebsebene. Sie bestimmt, welche Art von Benutzer die Anfrage stellt.
7. Die Produktliste zeigt die Produkte, die für die Vertriebsebene konfiguriert sind und die Preisversionen berücksichtigen, die zum Testdatum gültig wären.
8. Ein Klick auf ein Produkt öffnet die Konfigurationsseite. Dort wählen Sie Laufzeit, Laufleistung und Zahlungsintervall. Der Reiter „Produkt“ zeigt Beschreibung und Leistungen. Der Bereich „Kampagne“ zeigt, ob im Zeitraum Kampagnen aktiv wären. Der Zahlungsplan passt sich den Optionen an.
9. Mit „Print“ öffnen Sie den Druckdialog für Zahlungsplan und Vertrag. Die Schaltfläche „Email“ öffnet ein Fenster, das eine Test-E-Mail an die angegebene Adresse sendet.

**Ergebnis und Systemstatus.** Der Test berücksichtigt Preise, Gebühren, Services und Kampagnen für das gewählte Datum oder die gewählte Preisversion. Die Produktsuche berücksichtigt den Produktstatus. Wurde der Schalter „FRD unavailable“ aktiviert, setzt das System die Ist-Laufleistung auf 0.

**Hinweise.** Die Zurück-Schaltfläche führt zur Produktseite im vorherigen Zustand.

**Fehlerbehebung.** Beim Zurückgehen in einem Schritt zeigt das System einen Navigationsfehler an.

Quellen: Batch 1222.2, 335.2, 1272.4

## 14.13 Kampagnenanlage und Rabattpflege

**Zweck.** Kampagnen gewähren Rabatte auf Cluster veröffentlichter Produkte. Sie legen sie in der Kampagnenverwaltung an und pflegen sie dort. Die Rabatte wirken im Vertragsangebot, das Kapitel 5 beschreibt.

**Voraussetzungen.** Das Produkt ist veröffentlicht. Die Cluster stammen aus der aktuell gültigen Preisversion. Die Auswahl der Preisversionen beschreibt das Material widersprüchlich, siehe Klärungsbedarf.

**Rollen.** Die Rolle MPC legt Kampagnen an. Die Rolle MO sieht Kampagnen im Lesemodus.

**Schritt für Schritt.**

1. Legen Sie die Kampagne in der Kampagnenverwaltung an. Die Kostenstelle ist ein Pflichtfeld mit höchstens zehn numerischen Zeichen, Leerzeichen sind nicht erlaubt, und der Bindestrich ist das einzige Sonderzeichen, zum Beispiel 123-1234. Die Debitorennummer ist optional und darf höchstens zehn Zeichen ohne Leerzeichen enthalten.
2. Wählen Sie den Rabatttyp. Der Typ „Fixed Amount“ nutzt das Feld „Amount“, der Typ „Percentage“ das Feld „Maximum Amount“. Beide Felder akzeptieren sieben Ziffern, zum Beispiel 10.000,47 oder 1.000.000. Die Rabatttypen „Prozent“ und „Sticker Price“ zeigen den Rabatt korrekt und lassen sich duplizieren.
3. Im Schritt 2 wählen Sie das Produkt und die Fahrzeuggruppen. Die Fahrzeuggruppen erscheinen alphabetisch aufsteigend. Wählen Sie eine Preisversion, werden alle Cluster dieser Preisversion automatisch ausgewählt. Sie können einzelne Cluster abwählen. Die gewählte Preisversion mit den Clustern erscheint in der Zusammenfassung.
4. Bei Sticker-Price-Kampagnen definieren Sie den rabattierten Produktpreis direkt, nicht den Rabattbetrag. Wählen Sie zuerst ein Produkt und danach die Cluster. Ein Haken zeigt, dass mindestens eine Zelle befüllt ist. Die Preismatrix ist leer, bis Sie Preise eintragen. Mit dem Symbol „See original prices and discounted amount“ zeigen Sie die Originalpreise und den Rabattwert.
5. Die Eingaben sind Nettopreise in EUR ohne Mehrwertsteuer. Es sind nur Ziffern mit höchstens zwei Nachkommastellen erlaubt. Der kleinste Wert ist 1, die höchste Stellenzahl sieben Ziffern, zum Beispiel 49.999,99.
6. Die Schaltfläche „Next“ wird aktiv, sobald für ein Produkt und einen Cluster ein rabattierter Preis definiert ist.
7. Wechseln Sie zu einem anderen Produkt, verwirft das System nicht gespeicherte Änderungen nach Ihrer Bestätigung. Wechseln Sie nur den Cluster, speichert das System die Änderungen.
8. Im Schritt zur Auswahl der Produkte und Cluster erscheinen nur veröffentlichte Produkte mit Clustern. Cluster, die im selben Zeitraum bereits einer anderen Kampagne desselben Vertriebskanals zugeordnet sind, erscheinen nicht.
9. Die Preise erfassen Sie wahlweise als Monatspreis oder als Gesamtpreis. Ein Umschalter steuert die Anzeige. Nettopreise geben Sie manuell, per Copy-and-paste oder über den Excel-Upload und -Download ein. Der Hinweis nennt die Preise als Nettopreise in EUR ohne Mehrwertsteuer. Die Funktion „Define over all discount“ steht auf dieser Seite nicht zur Verfügung.
10. Nach dem Speichern erscheinen im Vertragsangebot nur Kampagnen, die den Preis senken. Kulanzkampagnen in der Nachlaufphase bleiben in der Auswahl des Angebots ausgeschlossen.
11. Für Kampagnen in der Nachlaufphase steht die Aktion „Deactivate“ zur Verfügung. Sie beenden die Kampagne damit vorzeitig.
12. Die externe Kampagnen-ID verarbeitet das System korrekt und lässt keine Leerzeichen zu.

**Ergebnis und Systemstatus.** Eine Kampagne im Status „In Review“ oder „Approved“ ist für Weitergabe und Bearbeitung gesperrt. Änderungen erfordern das Duplizieren der Kampagne. Die Zusammenfassung einer Sticker-Price-Kampagne zeigt nur Fahrzeuggruppen mit konfiguriertem Rabatt.

**Besonderheiten je Rolle.** Die Händlerrabatte und Rabattpreise im Vertragsangebot beschreibt Kapitel 5.

**Fehlerbehebung.**

- Eine Kampagne lässt sich nur mit zugewiesenem Produkt anlegen.
- Ein leerer Rabattwert blockiert die Vertragserstellung nicht mehr.
- Die Kampagnenübersicht zeigt den Status einer Kampagne, dessen Gültigkeit die Nachlaufphase überschreitet.

Quellen: Batch 1254.4, 1196.2, 1205.3, 1226.3, 1163.4, 1155.1, 1276.1, 522.1, 1137.2

## 14.14 Preiskomponenten, Cost Unit Split und Inflation

**Zweck.** Preiskomponenten setzen den Vertragspreis zusammen. Dazu gehören der Grundpreis, Optionen, technische Optionen, Branchenaufschläge, Verwaltungsgebühr, Händlerprovision und der Inflationsfaktor. Dieser Abschnitt beschreibt die Kostendefinition, den Inflationsfaktor und die Kostenstellen, soweit das Material sie als Verhalten beschreibt.

**Rollen.** Die Rolle MPC pflegt die Preiskomponenten in der Preisversion.

**Schritt für Schritt: Kostendefinition und Kostenabhängigkeit festlegen.**

1. Wählen Sie die Kostendefinition. Zur Auswahl stehen ein Gesamtwert, ein Prozentsatz des Grundpreises, ein Betrag pro Jahr oder pro Monat und keine konkrete Preisangabe.
2. Wählen Sie die Kostenabhängigkeit. „Keine Abhängigkeit“ erfordert einen einzelnen Wert. „Laufzeitabhängig“ und „Laufleistungsabhängig“ erfordern eine Liste von Werten. „Laufzeit- und laufleistungsabhängig“ erfordert eine Wertematrix.
3. Die Optionen stehen für optionale Deckungen und technische Reifenoptionen im Schritt „Price Version Setup“, für Branchencodes im Schritt „Industry Surcharges“ und für allgemeine technische Optionen im Reiter „Technical Options“ von „Upsert Cluster“ zur Verfügung.
4. Ändern Sie die Kostendefinition oder die Kostenabhängigkeit, gehen die erfassten Matrixwerte verloren. Das System zeigt vorher einen Dialog mit diesem Hinweis.
5. Bei Produkten, deren Basispreistabelle in Kontingenten oder Reifenanzahlen geführt wird, steht die Kostendefinition „Prozent“ nicht zur Verfügung.
6. Eine technische Reifenoption mit der Kostendefinition „Keine Kosten“ erscheint im Dialog zum Hinzufügen von Gruppen technischer Optionen nicht als auswählbare Option.

**Inflation in den Markteinstellungen.** Sie pflegen die Inflationsraten je Jahr in einer Tabelle. Das System berechnet daraus den Inflationsfaktor. Die Raten sind Prozentwerte mit zwei Nachkommastellen. Das aktuelle und das kommende Jahr lassen sich hinzufügen, ein kommendes Jahr lässt sich wieder löschen. Vergangene Jahre sind ausgegraut. Ändern Sie einen Wert des laufenden Jahres, zeigt das System eine doppelte Bestätigung, dass eine Preisversion betroffen sein kann. Die Änderung wirkt nur auf Preisversionen, die nach ihr angelegt werden.

**Inflation in der Preisversion.** Sie aktivieren oder deaktivieren den Inflationsaufschlag beim Anlegen der Preisversion. Ist er aktiv, übernimmt das System die Inflationsdaten aus der Marktkonfiguration. Für das gewählte Jahr muss ein Inflationsfaktor hinterlegt sein. Fehlt er, lautet die Meldung „No Inflation Factor for Selected Year. Please set in Market Configuration“. Die Inflationsmatrix richtet sich nach dem Start der Laufzeit und den Laufzeiten der Preismatrix in Monaten. Das System interpoliert zwischen den Laufzeiten. Die Inflation einer Preisversion lässt sich nicht innerhalb der Preisversion bearbeiten. Ein Duplikat übernimmt die aktuellste Einstellung.

Bei der Preisermittlung multipliziert das System den Gesamtpreis mit dem Inflationsfaktor. Optionale Deckungen können den Inflationsfaktor von der Preisberechnung ausschließen. Der Inflationsfaktor geht in den Payload ein. Der angezeigte Inflationsfaktor einer Preisversion stimmt mit dem in der Marktkonfiguration definierten Wert überein.

**Kostenstellen und Cost Unit Split.**

1. Im Schritt 4 der Produktanlage setzt das System die Kostenstelle MB, Sales Level und Kundentypen standardmäßig. Fügen Sie dem Produkt nachträglich Kundentypen oder Sales Level hinzu, erscheint ein Warnhinweis, und Sie müssen die Leistungen anpassen.
2. Sie wählen Basisdeckungscodes aus einer vordefinierten Liste und weisen jedem Code eine Kostenstelle zu, zum Beispiel Mercedes-Benz, Lieferant oder Kunde. Die Preisübersicht gruppiert die Deckungen nach Kostenstelle und zeigt je Gruppe eine eigene Preismatrix. Die Matrizen müssen übereinstimmen. Die Zuordnung von Deckung und Kostenstelle übermittelt das System im Payload an Brabus.
3. Ausschlüsse setzen Sie je Leistung. Für die Basisleistung stehen Technical Options, Industriezuschlag, Admin-Gebühr, Inflationsfaktor, Händlerprovision und „Exclude from Vega“ zur Verfügung. Für immer enthaltene, optionale und Body-Leistungen stehen Industriezuschlag, Admin-Gebühr, Inflationsfaktor, Händlerprovision, Kampagnen und „Exclude from Vega“ zur Verfügung. „Exclude from Vega“ beeinflusst keinen Preis, das System gibt die Markierung nur weiter.
4. Teilen sich zwei Leistungen desselben Typs eine Kostenstelle, schließt ein Ausschluss an einer der beiden Leistungen den Typ für die Kostenstelle aus. Ändern Sie die Kostenstelle, wirkt sich das sofort auf die Berechnung aus.
5. Für immer enthaltene Van-Leistungen legen Sie fest, welche Bestandteile die Preisberechnung ausschließt. Im Dashboard „Edit Coverages“ wählen Sie im Abschnitt „Exclude from price calculation“ einen oder mehrere Typen.
6. Der Gesamtpreis setzt sich aus Basispreis, eingeschlossenem Optionspreis, optionalen Deckungspreisen, technischen Optionen und Industriefaktorpreis zusammen. Für den Lieferanten-Zahlungsplan zählen diese Bestandteile. Die Verwaltungsgebühr, der Inflationsaufschlag und die Händlerprovision sind darin nicht enthalten.

**Branchenaufschläge.** Im Reiter „Industry Surcharges“ legen Sie Aufschläge für die Branchen eines Produkts fest. Die Branchen erscheinen alphabetisch, jeweils über ein Akkordeon. Die Aufschlagsart ist „Percentage“ mit einem Prozentsatz auf den Listenpreis oder „Amount“ mit einem Gesamtbetrag. Die Abhängigkeit steuert, für welche Kombination aus Laufzeit, Laufleistung oder Kontingent Preise definiert sind. Mit „No Surcharge“ gilt die Branche als vollständig definiert und kostenfrei. Eine leere Zelle zeigt ein Ausrufezeichen. Der Preisfaktor wirkt nicht auf Branchenaufschläge. Mit „Duplicate“ übernehmen Sie alle Konditionen in eine neue Aufschlagsversion.

**Technische Optionen und Gebühren.** Im Reiter „Technical Options“ legen Sie je TO-Gruppe Kostendefinition und Abhängigkeitsdefinition fest und erfassen den Preis. Mit „Edit“ wählen Sie die Gruppen aus. Abgewählte Gruppen zählen nicht mehr zur Preisberechnung des Clusters. Für B2B-Kunden berechnet das System die Zahlungsweise vierteljährlich als dreifachen Monatspreis, halbjährlich als sechsfachen und jährlich als zwölffachen Monatspreis.

**Ergebnis und Systemstatus.** Das System berechnet die Preise für jede Kombination aus Kostendefinition und Kostenabhängigkeit. Das betrifft Branchencodes, technische Optionen und Deckungen, einschließlich Reifen- und Kontingentprodukten. Bei der Vertragsverlängerung gilt das für optionale Deckungen, bei kurzfristigen Verlängerungen auch für Reifenprodukte. Die Preiskomponenten im Payload umfassen den Grundpreis, die Optionspreise, technische Optionen, die Verkaufsprovision, die Gebühr für das Zahlungsintervall, den Rabatt nach Kampagnentyp und den Händlerrabatt.

**Besonderheiten je Sparte und Markt.**

- Für Vans können Sie Bestellnummern über die AFAB-Schnittstelle abrufen. Die Stammdaten der Van-Bestellungen übergibt das System an die Vertragserstellung.
- Das Duplizieren einer Preisversion übernimmt auch die Van-Fahrzeuggruppen.
- Produkte und Preise indiziert das System in Elasticsearch, um die Antwort des Vertragsangebots zu beschleunigen.
- Der Markt Brabus erhält den Payload mit Kostenstellen und Gesamtpreis.

**Hinweise.**

- Die Preisversion im Frontend ist ein mehrstufiger Assistent.
- Ein Hinweis mit dem Text „One or more optionals are missing prices“ erscheint an Clustern, deren optionale Deckungen keine Preise haben.
- Ist der Inflationsaufschlag in der Preisversion deaktiviert, zeigt das System die Inflationsdaten nicht an.
- Für technische Optionen mit 0 Prozent zeigt das System kein Warnsymbol.

**Fehlerbehebung.**

- Das Speichern von Inflationswerten gelingt ohne Serverfehler.
- Ein Basis-Cluster mit einem Wert über dem zulässigen Maximum lässt sich nicht speichern.
- Der Platzhalter für die Verwaltungsgebühr ist bei der Auswahl von Prozent korrekt.

Quellen: Batch 1179.1, 1182.1, 1182.3, 1141.1, 1116.2, 1125.2, 1207.3, 1206.3, 1198.1, 1273.3, 1136.1, 1211.2, 1302.4, 1147.1, 304.4, 1127.1, 946.2, 1093.7

## Verschiebung in andere Kapitel

Die folgenden Abschnitte gehören inhaltlich in andere Kapitel. Die Batch-Verweise stehen jeweils hinter dem Zielkapitel.

- Kapitel 2.2 „Fachliche Rollen und technische Berechtigungen“: Batch 1229.1, 1155.1 zu Rollen und Divisionen.
- Kapitel 3.2 „Suche und Filter“: Batch 1270.4 zur Sortierung der Übersichten und zur Suche nach Verträgen über Kunde oder Zahler.
- Kapitel 3.3 „Oberflächenelemente und Bedienmuster“: Batch 1264.1 zu vereinheitlichten Texten wie „Results“ und der Zählung „4 of 4“.
- Kapitel 3.5 „Preisinformation, Angebot, Antrag und Vertrag“: Batch 945.4 zur Kategorie Gebühren und Faktoren, Batch 945.6 zur Kategorie Endpreise für Kunden, Batch 945.7 zur Tabelle Preis pro Kilometer.
- Kapitel 3.7 „Schnittstellen und Systemübergaben“: Batch 1093.7 zu den Online-Sales-Feldern für Verkäufer und Händler im Vertragsbody.
- Kapitel 5.5 „Laufzeit, Laufleistung und Optionen konfigurieren“: Batch 948.3 zur Angebotsansicht mit Fahrzeuggruppe und Startpreis.
- Kapitel 5.6 „Preise, Kampagnen und Rabatte im Angebot“: Batch 929.7 zu Kampagne und Händlerrabatt, 973.3 zum Bezug auf den Produktpreis, 1010.2 zum Händlerrabatt in Höhe des Vertragswerts, 1014.3 zur Darstellung der Produktkarten, 1061.4 zu Preisen, Rabatten und Steuern, 1068.2 zu Zahlungsplan und Preisanzeige, 1106.1 zur Preisdarstellung in Angebot und Vertrag, 1108.4 zur Rabattzuordnung, 1110.3 zum Händlerrabatt als Nettowert, 1163.3 zur Darstellung des Sticker Price, 222.6 zum Zahlungsplan bei 100 Prozent Händlerrabatt, 814.2 zu Rabattbeträgen im Reiter Zahlung.
- Kapitel 7.1 „Zahlungsarten und Zahlungsintervalle“: Batch 1123.1 zum Abgleich von Zahlungsarten mit Kundentypen, 1284.3 zum Speichern der Zahlungsoptionen, 1093.7 zum bevorzugten Zahlungsintervall im Payload.
- Kapitel 9.8 „Contract Review: Profile und Übersicht“: Batch 334.1 zu Prüfprofilen.
- Kapitel 10.1 „Verträge suchen und Details prüfen“: Batch 1270.4 zur Suche nach Kunde oder Zahler.
- Kapitel 10.5 „Verlängerung, Folgeangebot und Folgevertrag“: Batch 896.1 zu Produkt- und Preisversion bei der Verlängerung, 945.2 zum Verlauf der Preistabelle bei der Langzeitverlängerung.
- Kapitel 11.1 „Rechnungsstellung und Zahlpläne“: Batch 223.3 zu Netto- und Bruttobeträgen von Händlerrabatten und Provisionen sowie zur Händlerrabatt-Rechnung, 1246.9 zur Administrationsgebühr auf allen Rechnungen, 1279.6 zur Rabattberechnung und zum Rechnungsbetrag.
- Kapitel 11.7 „Reporting, Filter und Exporte“ und Kapitel 19.14 zu NEMESIS und der buchhalterischen Verarbeitung: Batch 312.1 zum Datenprodukt SC_Price_Details, 338.1 zum erweiterten Unified Data Model, 304.4 zum Datenprodukt Preiskomponenten.
- Kapitel 12.3 „Kampagnen und Sonderkonditionen“: Batch 1136.1 zu den Auswirkungen von Produktversionen auf Kampagnen.
- Kapitel 13.2 „Produkt, Reifentyp und Reifengröße“: Batch 1147.1 zu Reifenprodukten mit dem Umfang Unlimited und zu Reifencodes, 1248.1 zur Interpolation des Reifenprodukts bei Leasing.
- Kapitel 15.7 „Technical Options, SA-Matching, Coverage- und Industry-Codes“: Batch 1206.2 zur Übersicht der TO-Gruppen für HQ, 1277.8 zu TO-Gruppen, 1220.1 zu benutzerdefinierten Coverage Codes, 6.1 zur Zeichenbegrenzung der VEGA-Codes, 125.2 zu Schadencodes.
- Kapitel 16.3 „Fachliche Prüfung und Freigabeworkflow“: Batch 1159.1, 1159.3, 1159.4, 1159.6, 1159.7 zur Vier-Augen-Freigabe von Preisversionen.
- Kapitel 16.4 „Testnachweise und produktiver Funktionsstand“: Batch 1279.8 zur Stabilität in der Vorproduktionsumgebung, 1217.5 zur Testabdeckung, 1204.5 zur Verifizierung der Produktverwaltung.
- Kapitel 16.7 „Widersprüche, Lücken und Klärungsregister“: Eingestellte und geschlossene Meldungen gehören in das Klärungsregister. Die Liste dazu steht im Abschnitt Klärungsbedarf.
- Kapitel 19.1 „Architekturüberblick und Systemlandkarte“: Batch 551.3 zur Ereigniszustellung nach Transaktionsabschluss, 1136.1 zum Kafka-Ereignis bei Lieferanten, 1248.1 zum Kafka-Topic und zur Produktsynchronisation, 1198.1 zur Indexierung in Elasticsearch.
- Kapitel 19.2 zu GO und den Pkw-Auftragsinformationen: Batch 13.1 zur Abfrage über die Bestellnummer mit GO.PPM.
- Kapitel 19.3 zu AFAB und den Van-Auftragsinformationen: Batch 1198.1 zur AFAB-Schnittstelle bei Bestellnummer.
- Kapitel 19.4 zu CEPRO und den Van-Fahrzeugstammdaten: Batch 18.1 zum Import der Transporter-Stammdaten, 6.1 zum Modelltyp bei Vans.
- Kapitel 19.5 zu OTR und dem Auftrags- und Fahrzeugbezug: Batch 1248.1 zu den Merkmalen BM6 und Kraftstoffart, 1136.1 zum Abruf über die Deal-ID.
- Kapitel 19.11 zu oneERP und der Kunden- und Finanzintegration: Batch 211.2 zur Schnittstelle E174 für interne Händlerrabatte.
- Kapitel 19.16 zu ALICE und dem Berechtigungsmanagement: Batch 1229.1 zur Rolle MPC-Product-Manager.
- Kapitel 20 „Länderspezifische Themen“: Batch 559.1 zu Tschechien und der Schweiz, 1041.2 zur Banküberweisung in der Schweiz, 1302.4 zur Standardsprache Englisch für neue Märkte, 907.1 zum Lakh-Preisformat für Indien.

## Klärungsbedarf

Die folgenden Punkte betreffen Widersprüche, unklare Aussagen und Meldungen mit dem Status Cancelled, Geschlossen oder ähnlich. Sie gehören nicht in den Fließtext, bis die Fachseite sie bestätigt.

1. **Inflationsfaktor in den Markteinstellungen.** Ein Abschnitt beschreibt den Inflationsaufschlag als eingeführt, ein anderer als Meldung mit Status Cancelled. Ein dritter nennt den Inflationsfaktor als nicht definiert. Batch 1179.1, 946.2, 1182.3, 1273.3.
2. **Branchenfaktor und Verwaltungsgebühr im Payload.** Ein Abschnitt nennt beide Bestandteile als nicht ausgeliefert, ein anderer führt Branchenfaktoren in der einheitlichen Definition der Preiskomponenten. Batch 1182.3, 1182.1.
3. **Kostenstellenberechnung für Lieferanten.** Die Erweiterung auf Ebene aller Deckungen trägt den Status Cancelled. Die Abschnitte zu Basisdeckungen je Kostenstelle und zur Payload-Übergabe beschreiben die Funktion als Bestandteil. Batch 1127.1, 1116.2, 1141.1.
4. **Gültigkeit des Angebots zur Langzeitverlängerung.** Ein Abschnitt legt die Gültigkeit je Division fest, der Schluss des Abschnitts nennt die Einstellung für alle Divisionen. Batch 777.2.
5. **Inflation mit 120 Monaten und Datenaufbewahrung in Jahren.** Die Änderungen befinden sich laut Material in einem Test, der blockiert ist. Batch 1093.7.
6. **Bevorzugtes Zahlungsintervall und Online-Sales-Felder.** Das Material beschreibt die Punkte ohne Angabe des Auslieferungsstands. Batch 1093.7.
7. **Rolle bei eingeschränkter Registrierung.** Die Sperre der Registrierung ist beschrieben, die Rolle nicht genannt. Batch 1134.7.
8. **Rolle bei ausgeblendeten Schaltflächen.** Das Material nennt die Rolle für die ausgeblendeten Schaltflächen im Administrationsbereich nicht. Batch 1134.8.
9. **Entfernen von Sprachen.** Ein Abschnitt beschreibt Sprachen im Reiter Dokumente als nicht entfernbar, ein anderer das Entfernen mit Soft Delete. Batch 975.1, 1128.6.
10. **Weitere Verwendungen der Standardsprache.** Das Material verweist auf spätere Versionen, nennt aber keine Verwendung. Batch 870.1.
11. **Banküberweisung außerhalb der Schweiz.** Ein Abschnitt beschränkt die Banküberweisung in allen anderen Märkten auf gewerbliche Kunden, ein anderer nennt nur Deutschland. Batch 1041.2, 1123.1.
12. **Kundentypen in der Zahlungsmatrix.** Die Matrix kennt All, Private, Commercial und Governmental, die Vertragserstellung unterscheidet weitere Kundentypen. Batch 883.3.
13. **Längen der Vorlagennamen.** Das Material nennt 25 Zeichen für Vorlagen, 56 Zeichen in der Suche und 128 Zeichen für Systembenachrichtigungen. Batch 468.2, 497.1, 374.4.
14. **Used For Transferring und Activation.** Ein Abschnitt verwendet Transferring für Mitteilungen nach dem Status Active, ein anderer für Vertragsübertragungen. Activation steht für den Status ACTIVE. Batch 479.2, 479.4, 497.1.
15. **Duplizieren einer Vorlage.** Derselbe Abschnitt beschreibt vorhandenen Inhalt und zugleich leere Felder. Batch 497.1.
16. **Reiter Reports.** Das Material beschreibt den Reiter als in Entwicklung. Batch 359.1.
17. **Filterauswahl in der Vorlagenverwaltung.** Der Abschnitt beschreibt eine erwartete Funktion mit dem Status Reviewed. Batch 433.2.
18. **Benennung der Versionsstatus.** Die Statusliste nennt Deprecated, die Übergangsregel nennt Deactivated. Batch 1140.1.
19. **Bearbeiten eines veröffentlichten Produkts.** Ein Abschnitt erlaubt alle Schritte, ein anderer nur die Aktion Edit This Version und die Metadatenbearbeitung. Batch 1275.1, 1140.1.
20. **Blueprint-Daten bei Edit This Version.** Die Aussage hängt von einer Erweiterung ab, deren Auslieferung das Material nicht bestätigt. Batch 1140.1.
21. **Abhängigkeit im Coverage-Schritt.** Der Abschnitt verweist auf einen Stream 2, ohne ihn zu erklären. Batch 1200.1.
22. **Hinweis zur Quellenlage.** Mehrere Einträge sind als geschlossen, offen oder abgebrochen gekennzeichnet. Batch 1144.5.
23. **Massenanlage mit Sonderfall.** Der Vorgang trägt den Status Geschlossen. Batch 1147.1.
24. **Status Unveröffentlicht.** Das Material nennt den Status für Preise, beschreibt aber keine Entsprechung im Lebenszyklus. Batch 1282.4.
25. **Bearbeiten abgelaufener Preisversionen.** Ein Abschnitt erlaubt Bearbeiten und Duplizieren, andere Abschnitte verbieten das Bearbeiten oder erlauben nur die Ansicht. Batch 1274.2, 1234.4, 1256.2, 1211.2.
26. **Bearbeiten von Clustern.** Ein Abschnitt erlaubt die Bearbeitung nur bei Deactivated oder Ready, ein anderer in allen Status außer Published, ein dritter nur den Namen in der aktuellen Version. Batch 1232.3, 1256.2, 1234.4, 1211.2.
27. **Eindeutigkeit des Versionsnamens.** Ein Abschnitt verlangt Eindeutigkeit, ein anderer lässt das Speichern unter einem vorhandenen Namen zu. Batch 1270.2, 1277.4.
28. **Einreichen eines Preis-Clusters.** Das Material nennt das Einreichen als nicht möglich und beschreibt zugleich den Ablauf Submit for Review. Batch 1.3, 1159.3.
29. **Freigabe bei unvollständiger Prüfung.** Die Schaltfläche Approve bleibt aktiv, auch wenn der Prüfer nicht alle Cluster geprüft hat. Batch 1159.4.
30. **Vertriebskanäle der Händlerprovision.** Ein Satz nennt die Auswahl änderbar, ein anderer sperrt die Änderung bei veröffentlichtem Produkt. Batch 1144.1.
31. **Anzahl der Felder für den relativen Basispreis.** Ein Abschnitt nennt drei zusätzliche Felder, ein anderer zwei. Batch 1221.2, 1223.2.
32. **Duplizieren mit Prozentwerten und Exploration.** Die Erweiterung zum Duplizieren mit Prozentwerten trägt den Status Cancelled, die Exploration weiterer Märkte ist ein reines Untersuchungsthema. Das Duplizieren von Preisversionen ist an anderer Stelle beschrieben, die Erweiterung trägt den Status in Entwicklung. Batch 1196.1, 1146.1, 1234.6.
33. **Obergrenze für den Industriefaktor.** Das Material nennt eine Grenze von 100 Prozent und zugleich eine Erhöhung auf mindestens 200 Prozent. Batch 1255.2.
34. **Van-Fahrzeuggruppen Teil 1.** Der Vorgang trägt den Status Cancelled. Batch 1218.1, 13.1.
35. **Verwaltung referenzierter Cluster.** Der Vorgang trägt den Status Cancelled. Batch 1220.1.
36. **Kampagnen in der Nachlaufphase.** Das Material fragt nach dem Umgang mit offenen Anfragen und nach der Verfügbarkeit von Edit. Batch 1254.4.
37. **Preisversionen bei Kampagnen.** Ein Abschnitt zeigt nur das Produkt mit der aktuell gültigen Preisversion, ein anderer alle aktiven Preisversionen und die nächste mit Startdatum in der Zukunft. Batch 1205.3, 1226.3, 1196.2.
38. **Bezugsgröße des Händlerrabatts.** Ein Abschnitt begrenzt den Händlerrabatt auf den Produktpreis, ein anderer auf den Vertragswert. Batch 973.3, 1010.2.
39. **Hinweis im Zahlungsplan.** Der Hinweis bei 100 Prozent Händlerrabatt trägt den Status erledigt, der Inhalt ist nicht beschrieben. Batch 222.6.
40. **Redaktionelle Ergänzung zum Markt Brabus.** Das Material nennt die Batch-Jobs für den Markt Brabus ohne Angabe der Änderungen. Batch 930.2, 1127.1, 1141.1.
41. **Länge des Versionsnamens.** Das Material nennt 30 Zeichen für Versions- und Clusternamen bei Kontingenten, 50 Zeichen als Obergrenze und 3 bis 100 Zeichen beim Anlegen. Batch 1263.2, 1275.1, 1233.1.
42. **Länge des Fahrzeuggruppennamens.** Das Material nennt 100 Zeichen, 5 bis 25 Zeichen mit eingeschränkten Sonderzeichen, 25 Zeichen ohne Sonderzeichen und 200 Zeichen für VEGA-Codes. Batch 7.2, 28.2, 18.1, 6.1.
43. **Eindeutigkeit des Gruppennamens je Markt.** Ein Abschnitt verneint die Anforderung, ein anderer verlangt die Eindeutigkeit. Batch 27.1, 28.2.
44. **Sortierung der Karten.** Das Material nennt Name, Datum der letzten Änderung und neueste zuerst. Batch 7.2, 11.1, 1270.4.
45. **Länge des Baumusters.** Ein Abschnitt akzeptiert maximal sechs Ziffern, ein anderer sechs oder sieben Ziffern. Batch 27.2, 1162.2.
46. **Namensschema für Fahrzeuggruppen.** Das Schema nennt das Kürzel CY, das Beispiel enthält es nicht. Die Antriebsformel lautet 4X2 im Schema und 2X2 im Beispiel. Die Mehrfachauswahl steht im Material mit einem Trennzeichen als CL M. Batch 1177.1, 1172.1.
47. **ISP-Abfrage über Bestellnummer.** Die Zuordnung für Bestellnummer, Baumuster und Deal-ID ist als Vorhaben beschrieben. Batch 333.3.
48. **Testfälle der Fahrzeuggruppenseite.** Das Material verweist auf Testfälle für die Suche und das Preisversions-Dropdown, ohne Ergebnis. Batch 17.1.
49. **Erhaltung der Filter auf der Fahrzeuggruppenseite.** Das Material beschreibt die Erhaltung als Vorhaben. Batch 6.1.
50. **Abschnitte ohne Inhalt.** Die Abschnitte zur Fahrzeugverwaltung enthalten keine Aussage. Batch 3.1, 8.1.
51. **Hinweis zur Datengrundlage.** Die Überschrift nennt einen zweiten Punkt ohne Beschreibung, die Annahme über den Konflikt ist fachlich zu bestätigen. Batch 53.3.
52. **Vor- und Nachname in der Vertragsübersicht.** Der Fehler ist im Material nicht weiterverfolgt und als geschlossen gekennzeichnet. Batch 629.3.
53. **Prüfung bei manueller Rechnungserstellung.** Das Material beschreibt eine Prüfung für Revenue-Rechnungen des Typs WSIN als Vorhaben. Batch 1248.1.
54. **Anpassung der Verlängerungskampagne.** Der Vorgang trägt den Status Cancelled. Batch 1248.1.
55. **Schritt 24 in der Auswahl der Produktlaufzeiten.** Das Material nennt den Schritt 24 ohne Erläuterung. Batch 1252.2.
56. **Status der Regel für die Weitergabe.** Die Regel befindet sich laut Material im Status AQA Testing. Der Fall eines aktuellen Entwurfs ist zu bestätigen. Batch 1137.2.
57. **Abgelaufene Clusterpreise bei Sticker-Price-Kampagnen.** Das Material nennt die Preismatrix abgelaufener Cluster als deaktiviert, die Anzeige im Reiter Preise ist nicht eindeutig. Batch 1253.3.
58. **Abschnitt ohne Anwenderinhalt.** Der Abschnitt Stabilität beschreibt Fehler in der Vorproduktionsumgebung ohne Anwenderfunktion. Batch 1279.8.

## Vorschläge zur Gliederung

- **14.1 und 14.3.** Beide Unterkapitel enthalten keine Aussagen aus den RAG-Batches. Führen Sie sie mit 15.1 und 15.3 zusammen oder mit der Einleitung von 14.2.
- **14.6.** Das Material enthält keine eigene Datei für Sichtbarkeit und Berechtigungen. Die Aussagen liegen verteilt in 14.2, 14.5, 14.9 und 14.10. Bündeln Sie sie in 14.6, insbesondere die Batches 1155.1, 1229.1, 334.1, 125.2 und 1280.5.
- **14.7.** Der Titel nennt Prüfung und Freigabe. Das Material beschreibt Dokumente der Marktkonfiguration und die Preisinformation. Die Vier-Augen-Freigabe steht in 14.9. Passen Sie den Titel an oder verschieben Sie den Freigabeteil.
- **14.12.** Die Datei mit dem Titel Product Testing enthält Fahrzeuggruppen, Kampagnen-Schritte, Branchenpreise und Preisversionen. Der Produkttest umfasst nur die Batches 1222.2, 335.2 und 1272.4. Ordnen Sie den Inhalt neu.
- **14.8.** Das Unterkapitel umfasst Produktanlage, Coverage-Schritt, AGB und Übersichten. Bilden Sie ein eigenes Unterkapitel für AGB je Produkt mit den Batches 978.1 und 408.4 sowie für die Vorlagen mit AGB mit Batch 490.5.
- **14.9.** Das Unterkapitel umfasst 45 Abschnitte. Teilen Sie es in Preisversionen, Cluster, Vier-Augen-Freigabe, relativer Basispreis-Cluster und Gebühren.
- **14.11.** Das Unterkapitel umfasst 46 Abschnitte. Teilen Sie es in Verwaltung, Anlage, Baumuster-Suche, ISP-Daten und automatische Benennung.
- **14.13.** Die Händlerrabatte gehören in das Angebot nach Kapitel 5.6. Das Unterkapitel konzentriert sich dann auf die Kampagnenanlage.
- **14.14.** Trennen Sie Inflation, Kostenstellen und Branchenaufschläge in eigene Unterkapitel. Der Cost Unit Split enthält mehrere Vorhaben, die im Klärungsbedarf stehen.
- **14.2.** Verweisen Sie länderspezifische Aussagen zusätzlich in Kapitel 20 und die Zahlungsmatrix in Kapitel 7.1.
- **Vorhaben.** Vorhaben ohne Auslieferung gehören in Kapitel 22 oder in das Klärungsregister 16.7, nicht in den Bedientext.
- **Übergänge.** Die Übergänge T14-15 und T15-14 verbinden die Marktpflege mit den HQ-Vorgaben. Das Material enthält dazu keine Inhalte.
