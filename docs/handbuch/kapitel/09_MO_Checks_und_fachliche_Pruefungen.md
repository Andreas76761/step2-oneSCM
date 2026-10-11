# 9 MO Checks und fachliche Prüfungen

Dieses Kapitel beschreibt die MO Checks, mit denen oneSCM Verträge fachlich prüft, bevor sie aktiviert werden, und die Prüfungen, die bei Vertragsänderungen und bei der Contract Review laufen. Die Rolle Market Operations, kurz MO, und die Rolle Market Product Coordinator, kurz MPC, sehen die Prüfergebnisse, klären Abweichungen und entscheiden über den weiteren Weg eines Vertrags. Kapitel 9.2 beschreibt die Prüfungen innerhalb der Vertragsanlage, Kapitel 9.3 die Prüfstatus und die Liste offener Prüfungen, Kapitel 9.4 die Benachrichtigungen an MO, Kapitel 9.5 die erneute Zahlungsprüfung, Kapitel 9.7 die Prüfungen bei Vertragsänderungen und Kapitel 9.8 die Contract Review.

## 9.1 Aufgaben und Abgrenzung der MO-Rolle

Material: keine Quellen in den RAG-Batches

Quellen: keine

## 9.2 MO Checks innerhalb der Vertragsanlage

**Zweck.** Während der Vertragsanlage prüft oneSCM Fahrzeug-, Produkt-, Preis-, Kunden- und Dokumentdaten automatisch. Die Ergebnisse zeigt die Prüfansicht „MO Checks Verification“ den Market Operations. Dieser Abschnitt beschreibt diese Ansicht, die Filterung nach Vertriebskanal, die zusätzliche Prüfung je Division, die Dokumentprüfungen zu Steuerbefreiung und Fahrzeugschein sowie die Kundenprüfungen bei einem Autohaus als Kunde und bei einem unklaren Kundenabgleich mit oneERP.

**Voraussetzungen.** Für die Prüfansicht „MO Checks Verification“ benötigen Sie Rollen und Rechte für den Admin-Bereich. Der Vertrag muss bereits erstellt sein. Die zusätzliche Prüfung „Additional Verification“ wirkt nur, wenn die Marktkonfiguration die Einstellung je Division unterstützt und das MO-Checks-Framework in die Vertragsaktivierung eingebunden ist.

**Rollen.** MO sieht die Prüfungen, setzt Verträge auf „Active“ oder storniert sie und klärt Abweichungen mit dem Kunden und mit oneERP. MPC aktiviert die zusätzliche Prüfung in den Market Settings und benötigt dafür Zugriff auf die Marktkonfiguration sowie die Berechtigung, MO Checks einzusehen und zu aktualisieren. Benutzer eines Autohauses können ein Autohaus als Gewerbekunden anlegen und hochgeladene Dokumente durch die MO-Prüfungen validieren lassen.

**Schritt für Schritt: Prüfansicht „MO Checks Verification“.**

1. Öffnen Sie im Admin-Bereich die Seite „MO Checks Verification“.
2. Prüfen Sie die Überschrift „Verification Checks“ und die Anzahl der angezeigten Datensätze, zum Beispiel „5 of 10 records“. Die Standardanzahl je Seite ist 10. Über die Auswahlliste stellen Sie eine andere Anzahl ein.
3. Wählen Sie einen Vertrag aus der Liste. Die Vorschau zeigt alle automatischen Prüfungen nach Kategorien mit Ergebnis und, bei nicht bestandener Prüfung, mit dem Grund.
4. Öffnen Sie die Vertragsnummer, um die Vertragsdaten zu bearbeiten.
5. Setzen Sie den Vertrag in der Contract Generation Overview im Feld „Status“ auf „Active“ oder stornieren Sie ihn.

**Filter „Sales Channel“.** Der Filter bietet die Optionen „Retail“ und „Leasing“. Beim Öffnen der MO Checks ist „Retail“ voreingestellt. Alle MO Checks für Leasingverträge stehen auf „Not Applicable“, weil Leasingverträge das Retail-Prüfverfahren nicht durchlaufen. Die Prüfung erfolgt vorgelagert in MBLD. Die Aktion „Retrigger Signature“ im „…“-Menü der Startseite des Proposal Managements steht für Leasingverträge nicht zur Verfügung, unabhängig vom Status. Für Retail-Verträge im Status „Waiting for Confirmation“ bleibt sie erhalten.

**Zusätzliche Prüfung „Additional Verification“.** Benutzer mit der Rolle MPC aktivieren die Prüfung unter Market Settings, dann Feature Settings, dann MO Checks. Im Bereich „Perform Additional Checks“ steht der Schalter „Additional Verification“ bereit. Er ist standardmäßig ausgeschaltet und wird für Passenger Cars und Vans getrennt eingestellt.

- Ist der Schalter eingeschaltet, erscheint in den MO Checks der Abschnitt „Additional Checks“ am Ende der Liste mit dem Feld „Additional Verification“. Das Feld hat den Status „Pending", wird orange dargestellt und kann vom Benutzer bestätigt werden.
- Ist der Schalter ausgeschaltet, lautet der Status „Not Applicable". Das Feld ist grau und schreibgeschützt. Die Prüfung wird bei der Aktivierung nicht berücksichtigt.

**Dokumentprüfung „Tax Exempt Certificate“.** Beantragt ein Kunde eine Steuerbefreiung, setzt das System die Steuerklassifizierung auf „Exempt“. Das System legt den Servicevertrag mit dem Status „Created“ und einer Referenznummer an. Der Zahlungsplan entsteht ohne Steuerwerte, und die Steuerklassifizierung „Exempt“ ist sichtbar. Zusätzlich erscheint in den MO Checks die Position der Kategorie „Document Check“ mit dem Namen „Tax Exempt Certificate“, dem Standardstatus „Not Ok“ und dem Grund „Missing Document“.

Anschließend wählt der Vertriebsmitarbeiter die Signaturart, und der Vertrag wechselt auf „Waiting for Confirmation“. Nach der Unterschrift und ohne CAS-Treffer wechselt der Vertrag auf „Confirmed“ und danach auf „Waiting for Activation“.

Der Vertriebsmitarbeiter lädt das Zertifikat in der Vertragsdetailansicht unter „Communication“ oder „Documents“ hoch und wählt den Dokumenttyp „Tax Exempt Certificate“. Der Upload ist im Status „Waiting for Confirmation“, „Confirmed“ oder „Waiting for Activation“ möglich. Danach setzt das System die Position auf „Pending“ mit dem Grund „Tax Exempt Certificate must be confirmed!“. Ein Hyperlink führt direkt zum Dokumentenbereich.

MO prüft das Zertifikat manuell. Ist es konform, wählt MO „Thumbs Up“ und erfasst eine Begründung. Die Position wechselt auf „Ok“ mit dem Grund „Tax Exempt Certificate confirmed“. Ist es nicht konform, wählt MO „Thumbs Down“ und erfasst den Ablehnungsgrund. Die Position wechselt auf „Not Ok“ mit dem Grund „Tax Exempt Certificate not compliant“, und der Vertrag kann nicht aktiviert werden. Fordert ein Kunde keine Steuerbefreiung an, zeigt die Position „Not applicable“.

**Kundenprüfung bei einem Autohaus als Kunde.** Gewerbekunden legen Sie mit dem Schalter „Dealership as Customer“ in der Gewerbekunden-Suche an. Der Schalter ist standardmäßig ausgeschaltet und gilt nur für Kunden vom Typ „Commercial“. Ist er eingeschaltet, ermittelt das System anhand der Anmeldedaten das Autohaus über die GSSN+-Kennung und sucht im Partner Management einen Debitor.

- Ist das Autohaus im Partner Management registriert, übernimmt das System Name, Adresse und SAP-Debitorennummer. Diese Werte sind schreibgeschützt.
- Ist das Autohaus nicht registriert, übernimmt das System Name und Adresse aus GSSN. Der Benutzer erhält den Hinweis, dass das Autohaus registriert werden muss. Für die Outlet-ID entsteht automatisch ein Eintrag im Dealership Management. MO wird benachrichtigt, siehe Kapitel 9.4.
- Die Registrierungsprüfung löst MO im MO-Checks-Dialog auf. Danach wechselt die Prüfung auf „OK“, und die Aktivierung kann fortgesetzt werden, sobald das Autohaus registriert und der SAP-Debitor ergänzt ist.

Die übrigen Felder, etwa Telefonnummer und Ansprechpartner, erfassen Sie manuell. Kunden mit dem Kennzeichen `isDealership` schließt das System von allen Synchronisierungen aus. An das FI-System sendet oneSCM für diese Konten weder eine POST- noch eine UPDATE-Anfrage. Der Prozess der Kundenanlage ist in Kapitel 4.8 beschrieben.

**Kundenabgleich mit oneERP.** Bei der Kundenanlage sendet oneSCM eine Anfrage an oneERP. oneERP liefert anhand von IBAN oder USt-IdNr. genau einen Kunden oder eine Trefferliste. oneSCM vergleicht die Daten über eine unscharfe Suche mit Name, Adresse, Telefonnummer und E-Mail-Adresse. Erreicht ein Kunde eine Übereinstimmung von mindestens 80 Prozent, legt das System den Kunden an, und die Vertragsaktivierung läuft weiter. Der MO-Check-Status ist dann „Ok“.

Erreicht kein Kunde den Schwellenwert, legt oneSCM den Kunden trotzdem an, und der Kunde erhält den Status „Temporary“ oder „In confirmation“. Der Vertrag durchläuft eine MO-Prüfung. Dies gilt auch, wenn oneERP genau einen Kunden geliefert hat. Im Bereich „Customer Check“ erscheint im Feld „SAP Debtor number“ die Meldung „No unique customer match found“, und der Status steht auf „Nok“ mit dem Hinweis „Customer data match score is below accepted threshold“. Der Vertrag lässt sich in diesem Zustand nicht aktivieren.

**Ergebnis und Systemstatus.** Die Liste der Prüfansicht enthält nur Verträge mit mindestens einer Prüfung im Status „NOK“ und im Status „Created“ oder „Waiting for Activation“. Angezeigt werden eine laufende Nummer, das Land, das Datum der Vertragserstellung, die Vertragsnummer als Hyperlink und der Vertragsstatus. Im aktuellen Umfang ist das Land Deutschland, und das Datum der Vertragserstellung entspricht dem Erstzulassungsdatum, kurz FRD. Die Spalte „Verification Check“ zeigt „NOT OK“, wenn der Kunde ein FRD angibt, das vom hinterlegten Wert abweicht. Dann verwendet das System den Systemwert und weist die Abteilung „Operations“ darauf hin, den FRD manuell zu prüfen. Alle übrigen automatischen Prüfungen gelten als „OK“. Wird ein Vertrag ohne fehlgeschlagene Prüfung bestätigt, erscheint er in dieser Ansicht nicht.

Im Stand PI2 bildet das System nur das Szenario „FRD Mismatch“ ab. Alle anderen Prüfungen liefern „OK“. Der Email Check ist für die Stornobenachrichtigung vorgesehen.

**Besonderheiten je Rolle, Sparte und Markt.** Die Prüfansicht richtet sich an MO. Die Steuerbefreiung gilt für alle Kundentypen und Divisionen, das Autohaus als Kunde nur für Gewerbekunden. Die Prüfung „Additional Verification“ wird je Division getrennt eingestellt.

**Hinweise.**

- Die Vertragsnummer führt zur Detailansicht. Dort bearbeiten Sie die Daten, die eine Prüfung betreffen.
- Die Prüfung „Retrigger Payment“ ist in Kapitel 9.5 beschrieben.
- Die Prüfungen bei Vertragsänderungen sind in Kapitel 9.7 beschrieben.
- Die Menüeinträge „Contract Proposal“, „Proposal Management“ und „MO Checks Verification“ sind in Kapitel 3.1 als Navigation beschrieben. Ihre Zuordnung ist im Klärungsbedarf aufgeführt.

**Fehlerbehebung.**

- FRD-Abweichung: Das System verwendet den Systemwert. MO prüft das FRD und setzt den Vertrag auf „Active“ oder storniert ihn.
- Autohaus nicht registriert: MO löst die Registrierungsprüfung im MO-Checks-Dialog auf.
- Kundenabgleich ohne Treffer: Öffnen Sie über „Go to Customer“ den Dialog mit den gefundenen Treffern. Die Felder, zu denen oneERP Daten liefert, werden vorbefüllt. Fehlt ein Wert, zeigt das System einen Strich. Abweichungen zu oneSCM sind hervorgehoben. Stimmen Sie die Daten mit oneERP ab und wählen Sie den passenden Kunden. Bei der Übernahme aktualisiert das System die SAP-Debitorennummer aus oneERP. Bei den übrigen Daten gewinnt der jeweils aktuellere Zeitstempel.
- Steuerbefreiung ohne Zertifikat: Die Position bleibt auf „Not Ok“ mit dem Grund „Missing Document“, bis das Zertifikat hochgeladen und von MO geprüft ist.

Quellen: Batch 1023.2, 863.4, 864.4, 893.2, 893.3, 893.5, 878.4, 554.1, 592.1, 919.1, 1153.3

## 9.3 Prüfstatus, Gründe und offene Prüfungen

**Zweck.** Die Ansicht „MO Checks“ zeigt, welche Prüfungen für einen Vertrag gelaufen sind, welchen Status sie haben und warum eine Prüfung nicht bestanden ist. Die Liste führt die Verträge mit offenen Prüfungen auf, also mit Prüfungen im Status „Pending“ oder „Not OK“.

**Voraussetzungen.** Sie sind mit einer Rolle angemeldet, die die MO Checks einsehen darf. Der Vertrag hat den Status „Created“ oder einen Folgestatus bis „Confirmed“ oder „Waiting for Activation“. Die Anzeige erfasst auch Verträge im Status „Confirmed“.

**Rollen.** MO prüft und entscheidet über Abweichungen. MPC arbeitet mit der Ansicht. Händler, MO und MPC sehen die Prüfungen während der Vertragsanlage.

**Schritt für Schritt.**

1. Öffnen Sie die Seite „MO Checks“.
2. Suchen Sie nach Vertragsnummer, Kundenname, Fahrgestellnummer oder Kennzeichen. Über „X“ setzen Sie die Suchkriterien zurück.
3. Filtern Sie unter „Weitere Filter“ nach der Domäne „Contract Generation“ oder „Contract Management“ und nach dem „Sales Channel“, siehe Kapitel 9.2.
4. Wählen Sie den Filter „All OK“, um vollständig geprüfte Verträge anzuzeigen.
5. Wählen Sie einen Vertrag. Der Vorschaubereich zeigt die Kategorien, den Status und die Gründe jeder Prüfung.
6. Prüfen Sie bei „Not OK“ den angegebenen Grund und beheben Sie die Ursache.
7. Sortieren Sie die Tabelle nach jeder Spalte, wählen Sie die Anzahl der Ergebnisse je Seite oder laden Sie den Bericht über „Download Report“ herunter.

**Prüfkategorien.** Die Vorschau gliedert die Prüfungen wie folgt.

| Kategorie | Prüfungen |
|---|---|
| Fahrzeug | Erstzulassungsdatum, Laufleistung, Fahrgestellnummer |
| Preis | Kampagne |
| Produkt | Produktvariante, Produktcode, Fahrzeugeignung, Produktkompatibilität |
| Kunde | Kunde, Kunden-CAS-Prüfung, USt-ID, Lastschriftcode, SAP-Debitorennummer, FI-Systemstatus, Branche, Zahler-CAS-Prüfung |
| Dokument | Vertragsnummer, Dokumentenunterschrift, SEPA-Vertragsabgleich, SEPA-Dokumentenunterschrift |
| Vertragserzeugung | Händlerprüfung |

Hinzu kommen die Kategorien „Document Check“ für das Steuerbefreiungszertifikat, „Dealership Checks“ für das Fahrzeugschein-Dokument, „Price Check“ für die Zahlung vor der Aktivierung, „Additional Checks“ für die zusätzliche Prüfung und „Category Product Check“ für die Kompatibilität mit bestehenden Verträgen.

**Statuswerte.**

| Status | Bedeutung |
|---|---|
| N/A oder Not Applicable | Die Prüfung trifft im aktuellen Ablauf nicht zu, zum Beispiel die USt-ID-Prüfung bei einem Privatkunden |
| Ok | Die Prüfung ist erfolgreich beendet |
| Not ok | Die Prüfung ist beendet und nicht bestanden |
| Pending | Die Prüfung ist begonnen, aber nicht beendet |
| Not yet available | Die Prüfung ist noch nicht gestartet |

Ein Vertrag gilt als vollständig geprüft, wenn alle Prüfungen den Status „OK“, „OK_ACKNOWLEDGED“ oder „NOT_APPLICABLE“ haben.

**Kundenstatus und CAS-Prüfung.**

- Ein verfügbarer Kunde ist in Ordnung und benötigt keine Begründung. Ein gesperrter oder archivierter Kunde ist nicht in Ordnung. Ein Kunde im Status „Pending“ zeigt den Status „Pending“ ohne Begründung.
- Die CAS-Prüfung zeigt „PENDING“, wenn keine CAS-Antwort vorliegt, und „Positive hit“, wenn die CAS-Antwort einen Treffer enthält. Bei einer Übertragung oder einem Zahlerwechsel zeigt die CAS-Prüfung ohne Begründung „Ok“, bei einem positiven Treffer „Nicht Ok“ mit dem Grund „Positive Hit“ und bei einem möglichen Treffer „Ausstehend“ mit dem Grund „Potential Hit“.
- Steht der Kunde mit einem möglichen Treffer auf der CAS-Sperrliste, wechselt der Status auf „CAS check Positive“, und der Vertrag erhält den Blacklist-Status.
- Bei einem Blacklist-Kunden sendet oneSCM die Kundendaten nicht an das FI-System, also an NACOS und oneERP.
- Der FI-Systemstatus steht bei gesperrten Kunden auf „Gesperrt“, auch bei Bestandskunden. Ein Bestandskunde lässt sich nur aktivieren, wenn der FI-Systemstatus in der MO-Prüfung nicht auf „NOK“ steht.
- Der SAP-Debitorenstatus steht nach der automatischen Übernahme des Werts aus oneERP auf „Ok“.
- Der Hyperlink am Lastschriftcode führt zur Kundenseite.
- Die Branche wird für alle gewerblichen Kundentypen geprüft, einschließlich Commercial Fleet.

**Dokumentenprüfung.** Lautet das Ergebnis der Vertragsnummernprüfung „Ok“, setzt das System die Dokumentenprüfung auf „OK“. Der Vertrag erhält den Status „Bestätigt“, und die Aktivierung läuft weiter. Lautet das Ergebnis „NOK“, setzt das System die Dokumentenprüfung auf „NOK“. MO prüft das hochgeladene Dokument. Bestätigt MO das Dokument, setzt das System den Vertrag auf „Bestätigt“, die Prüfung „Contract Check“ auf „OK“ und setzt die Aktivierung fort. Lehnt MO ab, setzt das System den Servicevertrag auf „Abgelehnt“. Ein Servicevertrag lässt sich in mehreren Vertragsstatus hochladen.

**Mehrere Verträge je Fahrgestellnummer.** Das System unterstützt Angebote für Fahrgestellnummern, die bereits einem aktivierten oder bestätigten Servicevertrag zugeordnet sind. Das gilt für Händler, MO und MPC. Nach der Datenerfassung, der Vorschau und der Signatur prüft das System, ob die Fahrgestellnummer bereits einem bestätigten oder aktivierten Vertrag zugeordnet ist.

- Ist ein solcher Vertrag vorhanden, bleibt sein Status „Confirmed“ unverändert. Das System setzt die Prüfung „Category Product Check“ im neuen Vertrag auf „Not Ok“ mit dem Grund „Please check compatibility with existing contract!“ und einem Hyperlink zur Detailansicht des bestehenden Vertrags. Der neue Vertrag lässt sich nicht automatisch aktivieren. MO prüft die Produkte auf Kompatibilität und entscheidet manuell.
- Ist kein bestätigter oder aktivierter Vertrag vorhanden, läuft die Aktivierung weiter, und die Prüfung steht auf „Ok“.

**Ergebnis und Systemstatus.** Die Liste zeigt das Datum der Aufnahme in die MO Checks, die Fahrgestellnummer, das Kennzeichen, die Vertragsnummer als Hyperlink, die Domäne und den Status. Die Domäne „Contract Generation“ gilt für die Status „Created“, „Waiting for Confirmation“, „Confirmed“ und „Waiting for Activation“. Die Domäne „Contract Management“ gilt für die Status „Active“ und „Suspended“. Die Liste sortiert ältere Einträge zuerst. Verträge verschwinden automatisch aus der Liste, sobald keine Prüfung mehr den Status „Pending“ oder „Not OK“ hat. Die Anzahl der angezeigten Verträge ist kleiner oder gleich der ausgewählten Anzahl je Seite.

Der Download erzeugt eine Excel-Datei mit den Spalten „#“, Datum, Fahrgestellnummer, Kennzeichen, Vertragsnummer, Domäne und Status. Die Datei enthält alle Datensätze der aktuellen Tabellenansicht.

**Besonderheiten je Rolle, Sparte und Markt.** Die Branchenprüfung gilt für alle gewerblichen Kundentypen. Für Leasingverträge stehen alle MO Checks auf „Not Applicable“, wie in Kapitel 9.2 beschrieben. Die Vorschau zeigt den Status korrekt an.

**Hinweise.**

- Die Ansicht „MO Checks“ zeigt im Vorschaubereich alle Prüfungen eines Vertrags. Die Liste zeigt nur die Verträge mit offenen Prüfungen.
- Eine aktive Bestätigung einzelner Prüfungen ist vorgesehen. Die Bedienschritte sind im Klärungsbedarf aufgeführt.
- Die Regel zu mehreren Verträgen je Fahrgestellnummer weicht von der Beschreibung in Kapitel 5.3 ab. Der Konflikt ist im Klärungsbedarf aufgeführt.

**Fehlerbehebung.**

- Bei „Pending“ oder der CAS-Antwort „PENDING“ liegt noch keine Antwort vor. Der Status bleibt auf „Pending“, bis das System die Antwort erhält.
- Bei „NOT OK“ im Dokumentbereich prüft MO das hochgeladene Dokument und entscheidet über den weiteren Weg.

Quellen: Batch 936.3, 798.1, 871.1, 873.4, 1104.5, 621.2, 1068.6, 1093.4, 969.2, 1059.3, 871.4

## 9.4 Qualitätssicherung und Systemprüfungen

**Zweck.** Das System informiert Market Operations, wenn in der Händlerverwaltung ein Autohaus angelegt oder aktualisiert wird. MO prüft und aktualisiert danach die FI-Systemdaten des Autohauses.

**Voraussetzungen.** Ein Autohaus wurde in der Händlerverwaltung angelegt oder geändert.

**Rollen.** MO.

**Schritt für Schritt.**

1. Öffnen Sie die interne E-Mail mit dem Betreff „Update FI System Data for Dealership“.
2. Lesen Sie den Inhalt „New Dealership added or updated in oneSCM“. Die E-Mail nennt den Namen des Autohauses und die GSSN Outlet ID.
3. Prüfen und aktualisieren Sie die FI-Systemdaten des Autohauses. Die E-Mail beschreibt diese Aufgabe als MO-Task.

**Ergebnis und Systemstatus.** Das System versendet die E-Mail bei jeder Anlage und jeder Aktualisierung eines Autohauses. Das System ergänzt die SAP-Debitorennummer am Autohaus nicht selbst. Die Ergänzung erfolgt durch MO.

**Besonderheiten je Rolle, Sparte und Markt.** Die Benachrichtigung betrifft Autohäuser. Für Autohäuser sendet oneSCM keine POST- oder UPDATE-Anfrage an das FI-System. Die Pflege der FI-Systemdaten liegt bei MO.

**Hinweise.** Der Prozess der Kundenanlage für Autohäuser ist in Kapitel 4.8 beschrieben. Die Qualitätssicherung ist kein Bedienablauf für Benutzer. Die Testnachweise gehören in Kapitel 16.4.

Quellen: Batch 594.4

## 9.5 Abweichungen und erneute Prüfung

**Zweck.** Die Prüfung „Pre-Activation Payment“ in der Kategorie „Price Check“ prüft die Zahlung vor der Aktivierung. Ist die Zahlung nicht in Ordnung, ist die Aktivierung blockiert. Über die Funktion „Retrigger Payment“ löst MO die Zahlung erneut aus.

**Voraussetzungen.** Die Prüfung „Pre-Activation Payment“ steht auf „Not OK“. Die Funktion „Retrigger Payment“ ist nur bei diesem Status aktiv.

**Rollen.** MO kann den Vertrag ablehnen, wenn die Zahlung fehlschlägt. Wer „Retrigger Payment“ auslösen darf, ist im Klärungsbedarf aufgeführt.

**Schritt für Schritt.**

1. Prüfen Sie den MO Check „Pre-Activation Payment“ in der Kategorie „Price Check“. Der Standardwert ist „Pending“.
2. Steht die Prüfung auf „Not OK“, wählen Sie „Retrigger Payment“.
3. Bestätigen Sie die Aktion und erfassen Sie einen Grund.
4. Das System speichert Benutzer-ID und Zeitstempel, setzt den Status auf „Pending“ zurück und erzeugt einen neuen Zahlungslink.
5. Wiederholen Sie den Vorgang, sooft es erforderlich ist.
6. Lehnen Sie den Vertrag ab, wenn die Zahlung weiterhin fehlschlägt.

**Ergebnis und Systemstatus.** Bei „OK“ kann die Aktivierung fortgesetzt werden. Bei „Not OK“ ist die Aktivierung blockiert. Bei „Pending“ wartet das System auf die Zahlung.


**Fehlerbehebung.** Schlägt die Zahlung fehl, kann MO den Vertrag jederzeit ablehnen.

Quellen: Batch 903.7

## 9.6 Übergabe zur Entscheidung oder zum Support

Material: keine Quellen in den RAG-Batches

Quellen: keine

## 9.7 MO Checks bei Vertragsänderungen

**Zweck.** Bei den Aktionen „Vertragsinhaber übertragen“, „Zahler eines Vertrags ändern“ und „Bestehende Verträge verlängern“ führt das System Prüfungen und Hintergrundprozesse aus. Schlägt eine Prüfung fehl, markiert das System den Vertrag in den MO Checks mit Status und Hinweis zur Lösung. Die Abläufe der einzelnen Aktionen beschreiben die Kapitel 10.3 und 10.5.

**Voraussetzungen.** Der Vertrag ist im Vertragsmanagement geöffnet. Eine Aktion läuft immer allein. Läuft eine Übertragung, lässt sich keine Verlängerung starten.

**Rollen.** MO und MPC.

**Schritt für Schritt.**

1. Starten Sie die Aktion im Vertrag.
2. Das System ruft Informationen aus externen Systemen ab und erfasst die Unterschriften.
3. Die Fortschrittsanzeige neben der Referenznummer zeigt „Transfer in progress“, „Change Payer in progress“ oder „Prolongation in progress“. Die Anzeige ist orange, dreht sich dauerhaft und zeigt keinen Prozentwert.
4. Fahren Sie mit der Maus über die Anzeige. Die Detailansicht zeigt das Startdatum im Format TT.MM.JJJJ HH:MM:SS UTC, das Fälligkeitsdatum der Unterschrift und die Aufgaben mit ihrem Status.
5. Klicken Sie auf die Anzeige, um zu den MO Checks zu gelangen. Ist der Vertrag dort nicht vorhanden, bleibt der Klick ohne Wirkung.
6. Schlägt eine Aufgabe fehl, markiert das System sie rot und in den MO Checks. Beheben Sie die Ursache und starten Sie die Prüfung aus der Fortschrittsanzeige erneut.

**Ergebnis und Systemstatus.** Die Aufgaben haben folgende Farben: Grün steht für erledigt mit Zeitstempel, Orange für in Bearbeitung, Grau für noch nicht begonnen und Rot für nicht in Ordnung. Sind alle Aufgaben erledigt und ist die Aktion beendet, entfernt das System die Fortschrittsanzeige.

Die Prüfungen je Aktion lauten wie folgt.

- Übertragung: Für den neuen Kunden prüft das System den CAS-Check, den Lastschriftcode, die SAP-Debitorennummer und den FI-Systemstatus. Zusätzlich prüft es die Dokumentenunterschrift mit den Status „Ok“, „Ausstehend“ mit dem Hinweis, dass die Unterschrift in Bearbeitung ist, oder „Nicht Ok“ mit dem Hinweis, das Vertragsdokument zu prüfen.
- Zahlerwechsel: Für den neuen Kunden gelten dieselben Prüfungen. Wird SEPA verwendet, prüft das System zusätzlich die Dokumentenunterschrift mit denselben Status.
- Verlängerung: Das System prüft die Dokumentenunterschrift mit denselben Status.

Bei Fehlern im Lastschriftcode, in der SAP-Debitorennummer oder im FI-Systemstatus erscheint der Hyperlink „Go to Customer“ zur Kundendetailansicht. Bei Fehlern in der Dokumentenunterschrift führt der Hyperlink zur Vertragsdetailansicht und zum Reiter „Communication“.

Liefert der CAS-Check einen positiven Treffer, stoppt das System die Aktion und entfernt die Fortschrittsanzeige, ohne die übrigen Aufgaben abzuschließen. Der Vertrag wechselt auf den Folgestatus. Dieser Fall ist nicht umkehrbar.

**Besonderheiten je Rolle, Sparte und Markt.** Die Prüfungen gelten für B2C- und B2B-Kunden unabhängig vom Produkttyp und von der Konfiguration.

**Hinweise.** Die Prüfungen zur Vertragsübertragung und zum Zahlerwechsel sind Teil der MO Checks. Die Ansicht der MO Checks zeigt die Ergebnisse, die Aktion starten Sie im Vertrag.

Quellen: Batch 799.1, 816.1

## 9.8 Contract Review: Profile und Übersicht

**Zweck.** Die Contract Review ist die abschließende Endabrechnung für beendete oder abgelaufene Verträge vor dem Status „Closed“. Sie ermittelt die Mehr- oder Minderkilometer zwischen vereinbarter und tatsächlicher Laufleistung und berechnet den Betrag, den der Kunde zahlt oder gutgeschrieben bekommt. Die Prüfprofile legen die Regeln fest, nach denen das System den Betrag berechnet und entscheidet.

**Voraussetzungen.** Der Vertrag ist beendet oder nach Datum abgelaufen. Die tatsächliche Laufleistung liegt vor. Die Contract Review ist gestartet, und die Mehr- oder Minderkilometer sind berechnet. Das Produkt des Vertrags ist einem Prüfprofil zugeordnet, bei dem alle Bedingungen gesetzt sind.

**Rollen.** MPC und MO verwalten die Prüfprofile im Admin-Bereich unter „Contract Review Profiles“ und entscheiden über die Contract Review, sofern das Profil keine automatische Entscheidung vorsieht. Der Zugriff auf die Prüfprofile ist auf diese beiden Rollen beschränkt. Das Revenue Management wird nach einer Genehmigung benachrichtigt und bestätigt die Verarbeitung.

**Schritt für Schritt: Prüfprofil suchen und anlegen.**

1. Öffnen Sie im Admin-Bereich „Contract Review Profiles“ oder den Reiter „Review Profiles“ neben dem Reiter „Operative Review“. Beide führen zur Übersicht der Prüfprofile.
2. Suchen Sie mit den Filtern „Datum“ für das Anlagedatum, „Review Profile Name“ für eine Texteingabe, „Application Area“ als Mehrfachauswahl mit Leasing, Standalone und Finance sowie „Approval“ als Einfachauswahl mit Automatic, Manual und Threshold. Die Filterwerte bleiben bei der Suche gespeichert und lassen sich zurücksetzen. „More Filters“ steht nicht zur Verfügung.
3. Legen Sie ein Profil an. Alle Felder sind Pflichtfelder: „Application Area“ als Mehrfachauswahl, „Review Type“ mit den Werten Annual oder Final, „Division“ mit den Werten Passenger Cars oder Vans und „Products“ als Mehrfachauswahl aus der Produkt-Schnittstelle.
4. Legen Sie die Regel für Mehrkilometer fest. Wählen Sie „No Customer Charge“ oder „Customer Charge“. Bei „Customer Charge“ erscheinen „Tolerance“, „Maximum Charge“ und „Approval“. Bei „Tolerance“ und „Maximum Charge“ wählen Sie „Percentage“ oder „Absolute Amount“ und tragen den Wert ein. „Approval“ ist Pflicht. Bei „Threshold“ tragen Sie den Schwellenwert ein.
5. Legen Sie die Regel für Minderkilometer fest. Wählen Sie „No Compensation“, „Compensation“ oder „Compensation on Customer Request“. Bei den beiden Varianten mit Ausgleich gelten dieselben Felder wie bei den Mehrkilometern.
6. Speichern Sie das Profil. Das System vergibt eine eindeutige Profil-ID, die auf Vertragsebene gespeichert wird.

**Schritt für Schritt: Prüfprofil bearbeiten oder löschen.**

7. Bearbeiten Sie ein Profil über „Edit“ in der Spalte „Aktion“ oder in der Detailansicht. Das Symbol wechselt zu einem „X“ zum Abbrechen und einem Häkchen zum Bestätigen. Beim Häkchen erscheint der Dialog „Are you sure you want to edit the setup for current Profile? Any change of the settings will have impact on the Contract Review“. „Proceed“ speichert die Änderung, „Cancel“ verwirft sie.
8. Löschen Sie ein Profil über die Spalte „Aktion“. Die Aktion ist nur aktiv, wenn alle Verträge des Produkts den Status „CLOSED“ haben. Der Dialog „Are you sure you want to delete the current Profile? This action cannot be reverted“ bestätigt das Löschen mit „Proceed“.

**Schritt für Schritt: Contract Review entscheiden.**

9. Öffnen Sie die Seite für operative Prüfungen. Die ältesten Prüfungen im Status „Pending“ erscheinen zuerst.
10. Genehmigen oder verwerfen Sie die Contract Review. Die Entscheidung speichert das System mit Benutzer-ID und Zeitstempel.

**Ergebnis und Systemstatus.**

- Genehmigte Contract Review: Das Revenue Management erhält Vertragsnummer, Kunden- oder Partnernummer, die Art der Review, Final oder Annual, aus dem Profil sowie den Betrag brutto und netto. Positive Beträge führen zu Rechnungen, negative zu Gutschriften. Der Verlauf trägt „Contract Review Accepted“ ein, und der Vertragsstatus bleibt bis zur Bestätigung durch das Revenue Management unverändert. Danach setzt das System den Vertrag auf „Closed“, erzeugt die i155 an VEGA und trägt den neuen Status in den Verlauf ein.
- Verworfene Contract Review: Der Vertrag kann auf „Closed“ gesetzt werden. Das System erzeugt eine i155-Nachricht an VEGA.
- Betrag von 0,00 Euro: Das System übermittelt den Wert nicht an das Revenue Management und setzt den Vertrag direkt auf „Closed“.
- Automatische Entscheidung: Die Spalte „Geändert“ zeigt den Zeitstempel, gefolgt vom Wort „System“.

**Besonderheiten je Rolle, Sparte und Markt.** MPC und MO pflegen die Profile. Das Revenue Management bestätigt die Verarbeitung. Die Anlage von Profilen ist für Pkw möglich. Für Vans ist der Stand im Klärungsbedarf aufgeführt. Die Wartezeiten bis zur Bestätigung durch das Revenue Management sind marktspezifisch konfigurierbar.

**Hinweise.**

- Die Profilregel „Approval“ bestimmt die Entscheidung. Bei „Automatic“ genehmigt das System die Contract Review, sobald der Zahlbetrag berechnet ist. Bei „Threshold“ genehmigt das System automatisch, wenn der Schwellenwert größer als der Zahlbetrag ist. Ist der Schwellenwert kleiner, entscheidet MPC oder MO manuell. Bei „Manual“ entscheidet MPC oder MO in jedem Fall.
- Wird eine Contract Review nicht innerhalb von 30 Tagen nach Verfügbarkeit entschieden, trifft das System die Entscheidung automatisch.
- Für Minderleistungen gelten dieselben drei Varianten. Fälle ohne Kundenanfrage, die MPC oder MO nicht aktiviert haben, berechnet das System nicht und führt sie nicht auf der Seite für operative Prüfungen.
- Das System wendet für die Prüfung die Regeln an, die zum Zeitpunkt der Prüfung definiert sind. Änderungen am Profil wirken auf die Contract Review.
- Der Kunde erhält nach der Contract Review keine automatische E-Mail mit dem Ergebnis. Der Stand ist im Klärungsbedarf aufgeführt.
- Die regelmäßige Vertragsprüfung ist ein eigener Ablauf für die Laufleistung. MO und MPC konfigurieren dafür Prüfprofile mit Toleranzregeln und Prüfzeiträumen, mit denen Verträge erkannt werden, deren Laufleistung die vereinbarte Laufleistung über- oder unterschreitet. Der Ablauf ist in Kapitel 10.9 beschrieben.

**Fehlerbehebung.**

- Wird ein gesuchter Eintrag nicht gefunden oder können keine Einträge abgerufen werden, erscheint eine von zwei Meldungen, wie sie an anderen Stellen der Anwendung verwendet werden.
- Im Dialog zum Anlegen eines Limits ist „Erstellen“ bei leeren Feldern nicht aktiv.
- Schwellenwert, Laufleistung und Prozentlimit akzeptieren nur die vorgesehenen Eingaben. Dezimalzahlen sind zulässig.
- Ein Profil lässt sich nicht löschen, solange ein Vertrag mit seinem Produkt nicht den Status „CLOSED“ hat.

Quellen: Batch 832.2, 227.3, 335.1, 778.4, 779.4, 1211.4, 1216.1, 1278.7, 768.1, 819.2, 1211.3

## Verschiebung in andere Kapitel

- Kapitel 14.5, Administrationsbereich und zulässige Aktionen: Batch 898.3, ohne Unterkapitel-Zuordnung. Der Job „MO Checks Sync“ läuft standardmäßig alle 24 Stunden. Die Konfigurationstabelle zeigt Jobname, Jobstatus, Markt-ID, letzten und nächsten Lauf im Format TT/MM/JJJJ HH:MM:SS AM in UTC. Die Aktionen „Anzeigen“, „Jetzt ausführen“, „Stoppen“, „Planen“ und „Deaktivieren“ stehen zur Verfügung. „Jetzt ausführen“ startet den Job sofort und legt einen neuen Ausführungsdatensatz an.
- Kapitel 4.8, Dealer-Onboarding und Partnerprozess: Batch 554.1. Der vollständige Ablauf „Autohaus als Kunde“ mit Partner Management, GSSN+ und Abfrage bei oneERP gehört in das Dealer-Onboarding. Kapitel 9.2 beschreibt die MO-Prüfungen dazu.
- Kapitel 4.6, Dubletten und widersprüchliche Stammdaten: Batch 592.1. Der Kundenabgleich mit oneERP und die Übernahme der Kundendaten gehören zu den Stammdatenprüfungen. Kapitel 9.2 beschreibt die MO-Sicht.
- Kapitel 10.3 und 10.5, Zahlerwechsel, Vertragsübertragung und Verlängerung: Batch 799.1 und 816.1. Die Abläufe der Aktionen gehören in die Vertragsverwaltung. Die MO-Prüfungen bleiben in Kapitel 9.7.
- Kapitel 10.9, Laufleistung, Kilometerstandshistorie und Prognose: Batch 768.1. Die regelmäßige Vertragsprüfung betrifft die Laufleistung. Kapitel 9.8 verweist darauf.
- Kapitel 5.3, Fahrzeugdaten, Pflichtfelder und Validierungsregeln: Batch 969.2. Die Regel zu mehreren Verträgen je Fahrgestellnummer muss mit Kapitel 5.3 abgestimmt werden. Der Konflikt ist im Klärungsbedarf aufgeführt.
- Kapitel 14.8, Produktdefinition, Anlage und Veröffentlichung: Batch 778.4. Die Entfernung der Produktlinie „Basic“ für Passenger Cars gehört in die Produktdefinition.
- Kapitel 11.7, Reporting, Filter und Exporte: Batch 696.4. Die Statistik- und Importübersicht mit den übersprungenen Meldungen und den Gründen der Zählerprüfung dient der Auswertung durch Market Operations und Finance Administrators.
- Kapitel 16.4, Testnachweise und produktiver Funktionsstand: Batch 195.2 und 205.4. Die automatisierte Qualitätssicherung für die Kundenrechnung, die Validierung der E169-Datei und die Prüfung von Dateien ist ein Nachweis der Qualitätssicherung und kein Bedienablauf.
- Kapitel 14.12, Product Testing als Arbeitsbereich: Batch 343.2. Die Testszenarien für den Produkterstellungs-Assistenten gehören zum Produkttest.
- Kapitel 3.1, Startseite und Menü: Batch 1153.3. Die Zuordnung der Menüeinträge „Contract Proposal“, „Proposal Management“ und „MO Checks Verification“ gehört in die Navigation.

## Klärungsbedarf

1. Sichtbarkeit in den MO Checks: Batch 936.3 beschreibt, dass die Ansicht alle Prüfungen ab dem Status „Created“ zeigt. Batch 798.1 zeigt nur Verträge mit „Pending“ oder „NOK“. Batch 1023.2 führt in der Prüfansicht nur „NOK“ bei den Status „Created“ und „Waiting for Activation“ auf. Batch 1104.5 nimmt den Status „Confirmed“ auf. Ob die Vorschau alle Prüfungen zeigt und die Liste nur offene Verträge, ist nicht eindeutig.
2. Filter „All OK“: Batch 798.1 entfernt vollständig geprüfte Verträge automatisch aus der Liste. Batch 871.4 führt den Filter „All OK“ für solche Verträge ein. Es ist zu klären, ob entfernte Verträge über den Filter erscheinen.
3. Verbesserungen in der Prüfansicht: Batch 871.1 nennt die aktive Bestätigung einzelner Prüfungen, den Download und die Ansicht vollständig geprüfter Verträge. Es fehlen Angaben zur Bedienung, zum Umfang der Bestätigung und zur Rolle, die bestätigt. Batch 893.3 nennt nur den Benutzer.
4. Geltungsbereich PI2 und MVP: Batch 1023.2 führt das Land Deutschland und das Datum der Vertragserstellung als FRD im MVP auf. Der Email Check ist nach PI2 festgelegt. Für PI2 bildet das System nur „FRD Mismatch“ ab. Es ist zu klären, welche Beschränkungen für den heutigen Umfang gelten.
5. Direkte Korrekturen in der Prüfansicht: Batch 1023.2 beschreibt die direkte Korrektur je fehlgeschlagener Prüfung als späteren Ausbau. Es ist zu klären, ob dieser Ausbau vorgesehen ist.
6. Menüstruktur: Batch 1153.3 nennt die Einträge „Contract Proposal“, „Proposal Management“ und „MO Checks Verification“ und vermerkt, dass die Änderungen zu überprüfen sind. Batch 1023.2 ordnet die Prüfansicht dem Admin-Bereich zu.
7. Fahrzeugschein-Prüfung: Batch 878.4 legt die Prüfung „Vehicle Registration Document“ mit dem Standardstatus „NOT OK“ an, wenn ein Schalter eingeschaltet ist. Der Schalter ist nicht benannt. Batch 554.1 beschreibt eine Prüfung mit dem Status „Pending“ bis zum Upload und danach „NOK“ bis zur Bestätigung durch MO. Die Prüfung gehört nach Batch 554.1 nicht zum Umfang und ist als eigenständige Prüfung beschrieben. Es ist zu klären, welche Fassung heute gilt und welcher Schalter steuert.
8. Autohaus als Kunde, offene Punkte: Batch 554.1 führt folgende Punkte als offen auf: ob für bereits als Autohaus angelegte Kunden der Standardablauf gilt, ob bei einem Autohaus die SEPA-Anlage entfällt und die Bankdaten manuell erfasst werden, ob ein bestehender Gewerbekunde nachträglich als Autohaus gekennzeichnet werden kann, und der genaue Umfang des Synchronisierungsausschlusses.
9. FI-Systemdaten des Autohauses: Batch 554.1 schließt POST- und UPDATE-Anfragen an das FI-System für Autohäuser aus. Batch 594.4 beauftragt MO, die FI-Systemdaten zu aktualisieren. Es ist zu klären, wie MO diese Daten pflegt.
10. Bedeutung von „negativ“ bei der CAS-Prüfung: Batch 621.2 nennt eine negative CAS-Prüfung als Blacklist-Fall. Batch 919.1 nennt eine negative CAS-Prüfung als Bedingung für den Status „Confirmed“. Batch 1104.5 verwendet „Positive hit“ für einen Treffer. Batch 799.1 nennt außerdem „Potential Hit“. Die Begriffe sind zu vereinheitlichen.
11. Statuswechsel bei nicht konformer Steuerbefreiung: Batch 919.1 sieht vor, dass der Vertrag den Status „Rejected“ erhalten soll. Ob der Wechsel automatisch durch das System oder manuell durch MO erfolgt, ist im Material nicht geklärt.
12. Dokumentennummer: Batch 799.1 nennt die Prüfung der Dokumentennummer als durchgestrichen. Es ist zu klären, ob sie entfällt.
13. Statusfolge bei Übertragung und Zahlerwechsel: Batch 816.1 lässt offen, welcher Status nach einer ausgelösten Übertragung oder einem ausgelösten Zahlerwechsel gesetzt wird, wenn der CAS-Check einen Treffer liefert.
14. Mehrere Verträge je Fahrgestellnummer: Batch 969.2 erlaubt Angebote für Fahrgestellnummern mit einem bestätigten oder aktivierten Vertrag. Kapitel 5.3 beschreibt, dass je Fahrgestellnummer nur ein aktiver Vertrag zulässig ist und bei Aktivierung alle übrigen Verträge auf „Rejected“ gesetzt werden. Die Beschreibungen widersprechen sich.
15. Rolle „Market Owner“: Batch 768.1 nennt MO als „Market Owner“. Die übrigen Batches verwenden „Market Operations“. Die Bezeichnung ist zu vereinheitlichen.
16. Regelmäßige Vertragsprüfung: Batch 768.1 nennt Prüfprofile für die Laufleistung und die Toleranzregeln. Es ist zu klären, ob diese Profile dieselben sind wie die Profile der Contract Review aus Batch 335.1 und 1211.4.
17. Profile für Vans: Batch 778.4 führt Contract Review Profiles für Van-Produkte als eingeführt auf. Batch 779.4 nennt die Anlage für Transporter als nicht ausgeführt, weil das Vorhaben geschlossen wurde, und die Anlage ist nur für Pkw möglich. Batch 335.1 und 1211.4 bieten „Vans“ als Division an. Der Stand ist zu klären.
18. Manuelle Entscheidung und Frist: Batch 832.2 verlangt, dass MPC oder MO bei manueller Genehmigung in jedem Fall entscheiden. Zugleich entscheidet das System nach 30 Tagen automatisch. Es ist zu klären, welche Entscheidung das System dann trifft.
19. Status nach verworfener Contract Review: Batch 832.2 nennt, dass der Vertrag auf „Geschlossen“ gesetzt werden kann. Es ist zu klären, ob dieser Schritt optional oder automatisch ist.
20. E-Mail an den Kunden nach der Contract Review: Batch 819.2 beschreibt eine automatische E-Mail, die im PI-Vorhaben ohne Zusage geführt wird. Batch 227.3 nennt die Benachrichtigung mit einem späteren Termin. Der Stand ist zu klären.
21. Namensprüfung der Prüfprofile: Batch 1278.7 nennt eine Prüfung auf doppelte Namen unter Berücksichtigung der Groß- und Kleinschreibung. Es ist unklar, ob Namen mit abweichender Schreibweise als doppelt gelten.
22. Zeitformate: Batch 816.1 nennt das Format TT.MM.JJJJ HH:MM:SS UTC. Batch 898.3 nennt das Format TT/MM/JJJJ HH:MM:SS AM in UTC. Das Format ist zu vereinheitlichen.
23. Abgebrochene Vorhaben: Batch 343.2 nennt die Integration der MIC-VAG-Fahrzeug-API und Tests für das Vorschau-Produkt als abgebrochen. Batch 779.4 nennt die Anlage von Profilen für Transporter als geschlossen. Beide Einträge gehören in das Klärungsregister in Anhang F.1 und nicht in das Handbuch.
24. Testszenarien: Batch 343.2 beschreibt die Aktualisierung der Testszenarien für den Produkterstellungs-Assistenten. Diese Inhalte sind Entwicklungsinhalte. Es ist zu klären, ob sie in das Handbuch gehören.
25. Automatische Dateiprüfung: Batch 205.4 nennt eine Kernlösung für die automatische Prüfung von Dateien. Der Fachbezug und die Bedienung sind nicht beschrieben.
26. E169-Datei: Batch 195.2 nennt die Validierung der E169-Datei einschließlich der Verwendung für nicht angeschlossene Händler. Die Bedeutung der Datei und der Ablauf für Benutzer sind nicht beschrieben.

## Vorschläge zur Gliederung

- Kapitel 9.2 deckt Verifikation, Vertriebskanal, zusätzliche Prüfung, Dokumentprüfungen und Kundenprüfungen ab. Die Dokumentprüfungen für Steuerbefreiung und Fahrzeugschein könnten einen eigenen Unterabschnitt bilden oder auf Kapitel 7.8 verweisen.
- Kapitel 9.4, Titel „Qualitätssicherung und Systemprüfungen“: Der Inhalt umfasst nur die Benachrichtigung an MO. Der Titel sollte angepasst werden, etwa auf „Benachrichtigungen an Market Operations“. Die Qualitätssicherung ist nach Kapitel 16.4 verschoben.
- Kapitel 9.5 erhält die Zahlungsprüfung aus Batch 903.7. Kapitel 9.7 erhält die Prüfungen bei Vertragsänderungen aus Batch 799.1 und 816.1. Beide Abschnitte haben damit Material. Kapitel 9.1 und 9.6 haben weiterhin kein Material.
- Kapitel 9.1 ohne Material: Die Rollenabgrenzung sollte mit Kapitel 1.3 und Kapitel 14.1 abgestimmt werden.
- Kapitel 9.6 ohne Material: Die Übergabe zur Entscheidung kann die Ablehnungsfälle aus Kapitel 9.2 und 9.5 aufnehmen, sobald das Material vorliegt.
- Kapitel 9.8, Titel „Contract Review: Profile und Übersicht“: Der Inhalt umfasst auch Entscheidung und Abrechnung. Ein Titel wie „Contract Review: Profile, Entscheidung und Übersicht“ passt besser.
- Kapitel 9.3: Die Trennung zwischen Vorschau eines Vertrags und Liste offener Verträge sollte im Titel oder in zwei Unterabschnitten sichtbar sein.
- Kapitel 5.3 benötigt nach Klärung der Regel zu mehreren Verträgen je Fahrgestellnummer eine Überarbeitung.

Quellen: vollständige Zuordnung der 42 Batch-Abschnitte im Material zu den Unterkapiteln 9.2 bis 9.8 sowie den Verschiebungen.
