# 10 Verträge im Alltag verwalten

Dieses Kapitel beschreibt die Verwaltung aktiver Serviceverträge im Vertragsmanagement von oneSCM. Sie suchen Verträge und prüfen ihre Details, ändern Vertrags-, Kunden- und Zahlungsdaten, wechseln den Zahler oder übertragen den Vertrag, setzen Verträge aus und reaktivieren sie, verlängern sie, beenden sie und prüfen die finanziellen Folgen. Ergänzend beschreibt das Kapitel die Historie, die Schnittstellendateien und die Kilometerstandsdaten, auf denen Prüfungen und Abläufe beruhen. Die Erstellung eines Vertrags beschreibt Kapitel 6, die Rechnungsstellung Kapitel 11 und die Pflege von Produkten und Preisen Kapitel 14.

## 10.1 Verträge suchen und Details prüfen

**Zweck.** Sie suchen aktive Verträge im Vertragsmanagement und prüfen die Details eines Vertrags, bevor Sie eine Aktion auslösen. Die Suche findet einen Vertrag unabhängig davon, ob Sie die Fahrgestellnummer als FIN oder als VIN eingeben. Das Suchfeld trägt die Bezeichnung „Search Contract“. In den Ergebnissen und auf der Startseite erscheint die Vertragsnummer als „Reference Number“. Beim Zurückkehren aus einer anderen Funktion setzt das System die Suche zurück, sodass kein früheres Ergebnis angezeigt wird.

**Voraussetzungen.** Der Vertrag ist angelegt und trägt eine Vertragsnummer. Der Export von Verträgen steht nur für aktive Verträge zur Verfügung. Die Registerkarte „Documents & Notifications“ zeigt Dokumente und E-Mails für Verträge, denen eine Vertragsnummer zugewiesen wurde und die den Status „Aktiv“ hatten.

**Rollen.** Die Vertragsverwaltung richtet sich an Power User mit den passenden Berechtigungen. Die genaue Rollendefinition ist im Klärungsbedarf erfasst. Ein MPC-Benutzer sieht alle Verträge des Marktes, dem er zugeordnet ist.

**Schritt für Schritt.**

1. Öffnen Sie die Startseite des Vertragsmanagements und geben Sie im Suchfeld „Search Contract“ die Fahrgestellnummer, die Vertragsnummer oder die Referenznummer ein.
2. Öffnen Sie über „More Filters“ ein Pop-up mit weiteren Suchkriterien, etwa dem Status des Vertrags. Das Textfeld „Group ID“ listet alle Referenznummern einer Gruppe auf. Die Übersicht bietet außerdem einen Filter nach dem Aktivierungsdatum.
3. Wählen Sie den Vertrag aus. Der permanente Kopfbereich zeigt den Vertragsstatus, die Erstzulassung und das Kennzeichen. Fehlt das Kennzeichen, erscheint „-“.
4. Prüfen Sie die Registerkarten. „Contract“ enthält die Vertrags- und Produktdaten, „Vehicle“ die Fahrzeugdaten, „Customer“ die Daten von Halter und Zahler, „Payment“ die Zahlungsdaten.
5. Öffnen Sie „Documents & Notifications“, um Vertragsdokumente und E-Mails einzusehen. Die E-Mails erscheinen mit der neuesten zuerst.

**Ergebnis und Systemstatus.** Die Detailansicht zeigt den aktuellen Stand des Vertrags. Sie enthält die Vertragsdaten mit Planwerten und Ablaufkriterium, die Fahrzeugdaten mit der Bestellnummer vor dem Kennzeichen sowie den letzten bekannten Kilometerstand, die Coverage-Tabelle und die Zahlungsdaten. Die Kundennummer ist ein Link zur Kundenverwaltung.

**Besonderheiten je Rolle.** Ein MPC-Benutzer sieht alle Verträge des Marktes, dem er zugeordnet ist. Die Historie erfasst Prüfungen und Aktionen im Zusammenhang mit MO nicht.

**Besonderheiten je Sparte und Markt.** Kilometerangaben tragen in Deutschland die Einheit „Km“, in Großbritannien „Mi“. Das Datums- und Kilometerformat richtet sich nach den Markteinstellungen. Das Bestelldatum erscheint im Datumsformat des Marktes, und zwischen Währung und Betrag steht ein Leerzeichen.

**Hinweise.** Die Coverage-Tabelle zeigt zu jeder Deckung die Kostenstelle mit den Ausprägungen „Mercedes-Benz“, „Supplier“ oder „Customer“, den Namen des Lieferanten, den Ausschluss von VEGA, die Kontingentkennzeichnung und das enthaltene sowie das verbrauchte Kontingent. Für Preise kann „n/a“ erscheinen. E-Mails zur vorzeitigen Ablösung erscheinen im Reiter „Communication“ im Bereich „Emails“ mit dem Dokumentnamen „Early Settlement“. Die Aktion „Re-send“ sendet sie erneut. Sammelmeldungen ohne beschriebenes Sollverhalten sind im Klärungsbedarf erfasst.

**Fehlerbehebung.** Der Link im Feld „Customer Name“ führt zur Kundenverwaltung. Der Reiter „Vehicle“ zeigt die Fahrzeugdaten an. Die Kundensuche zeigt nur die Verträge des gesuchten Kunden, auch wenn mehrere Kunden denselben Vornamen tragen. Die Fahrgestellnummer wird im Reiter „Vehicle“ korrekt angezeigt. Die Suche nach Angeboten und Verträgen funktioniert mit FIN und mit VIN. Die Startseite des Vertragsmanagements lädt, und in der Spalte „Product Name“ erscheint das Produkt des Vertrags.

Quellen: Batch 785.1, 355.3, 757.4, 761.3, 763.1, 778.1, 790.1, 795.4, 801.1, 827.1, 831.5, 844.3, 845.1, 848.1, 850.2, 854.1, 859.1, 860.1, 861.1, 861.4, 935.7, 1079.5, 1102.5, 1103.4, 1106.4, 1274.7, 825.4, 837.1, 1102.5

## 10.2 Vertrags-, Kunden- und Zahlungsdaten ändern

**Zweck.** Sie ändern die Daten eines aktivierten Vertrags, etwa Vertragsdaten, Fahrzeugdaten oder Zahlungsdaten. Die Bearbeitung erfolgt über die Schaltfläche „EDIT“ in der Detailansicht. Alle bearbeitbaren Felder sind versioniert, sodass alle Werte erhalten bleiben, die seit der Aktivierung gültig waren. Jede Änderung wird mit einer Begründung gespeichert und im Änderungsprotokoll angezeigt.

**Voraussetzungen.** Der Vertrag ist aktiviert. Die Option „Contract Edit“ erscheint nicht bei Verträgen mit dem Status „Cancelled“, „Terminated“, „Expired“ oder „Closed“. Die Fahrzeugdaten eines Vertrags im Status „Created“ ergänzen Sie um das FRD und das Kennzeichen. Die Registerkarte „Vehicle“ öffnen Sie in der Angebotsverwaltung ab dem Status „Waiting for confirmation“ und im Vertragsmanagement ab dem Status „Active“.

**Rollen.** Die Schaltfläche „EDIT“ steht Benutzern der Market Operations zur Verfügung. Händler dürfen Zahlungsintervalle nicht bearbeiten. Die Rolle Dealer führt keine Vertragsübertragung durch und darf den Status eines Vertrags nicht ändern. Ein MPC-Benutzer kann Verträge im Status „Waiting for Activation“ manuell aktivieren oder ablehnen.

**Schritt für Schritt.**

1. Öffnen Sie den Vertrag und wechseln Sie auf die Registerkarte, deren Daten Sie ändern möchten. Die Registerkarten „Contract“, „Vehicle“ und „Payment“ enthalten bearbeitbare Felder. Die Registerkarte „Customer“ ist nicht bearbeitbar. Auf der Registerkarte „Product“ ist „EDIT“ deaktiviert.
2. Klicken Sie auf „EDIT“. Die zulässigen Felder werden bearbeitbar.
3. Beachten Sie die Feldregeln. Bei dem Produkt „Excellent“ darf die Laufleistung bei Vertragsbeginn 10.000 km nicht überschreiten. Das Startdatum darf nicht vor der Erstzulassung liegen, und eine Rückdatierung über den Kalender ist nicht möglich. Das Kennzeichen ist auf 11 alphanumerische Zeichen einschließlich Bindestrich begrenzt. Bei Excellent-Verträgen ist die Erstzulassung schreibgeschützt.
4. Im Reiter „Payment“ stellen Sie das Zahlungsintervall ausschließlich von „Monthly“ auf „One Time“ um. Das System stößt damit das Revenue Management an, die nächste Rechnung mit dem Restbetrag zu erzeugen.
5. Speichern Sie die Änderung. Das System merkt sie für die nächste i155-Übertragung vor.

**Ergebnis und Systemstatus.** Nach dem Speichern zeigt die Detailansicht die geänderten Werte. Die Historie enthält den alten und den neuen Wert, die Art der Änderung, das Datum, den ausführenden Benutzer und den Kommentar. Geänderte Vertragsdaten gehen in die nächste i155-Datei ein. Eine Änderung des Zahlungsintervalls aktualisiert den Zahlungsplan im Bereich Invoicing.

**Besonderheiten je Rolle.** Händler können den Händler eines Vertrags auch nach der Aktivierung ändern. Der Reiter „Payment“ zeigt für Verträge mit anwendbarer Händlerprovision das Feld „Dealer Commission“, mit dem Market Operations die Finanzen eines Vertrags prüfen können.

**Besonderheiten je Sparte und Markt.** Das Steuersatzfeld akzeptiert Werte im Format 0,ddddd und damit Steuersätze mit bis zu drei Nachkommastellen. Bestehende Werte im Format 0,dd bleiben gültig. Eine Eingabe mit mehr Nachkommastellen lehnt das System mit einer Fehlermeldung ab, ohne zu runden.

**Hinweise.** Änderungen an Kundennamen übernimmt das Vertragsmanagement. Änderungen an Kontaktdaten im Kundenprofil gibt das System an den Vertragsservice weiter. Frühere Kontaktdaten speichert das System zu Prüfzwecken, zeigt sie aber nicht an. Die Kundendaten pflegen Sie in der Kundenverwaltung. Bei einer Einmalzahlung entspricht die Zahlungsdauer der Vertragslaufzeit. Bei monatlicher Zahlung mit Preisumverteilung beginnt die Zahlungsdauer am Startdatum der Rechnungsperiode nach dem Umverteilungszeitraum und endet mit dem Vertragsende.

**Fehlerbehebung.** Das Feld „Industry“ erscheint im Bearbeitungsmodus der Vertragsdetailseite. Die Fehlermeldungen beim Hinzufügen einer Zahlungsreferenz zu einem Vertrag sind eindeutig. Die Zahlungsdauer aktualisiert sich in allen relevanten Szenarien. Der Zahlungsplan übernimmt bei einer Regenerierung die aktuellen Preisinformationen. Die Schaltfläche „Übernehmen“ beim Händlerrabatt übernimmt den Wert. Das Feld „Anzahl Reifen Gesamt/Verbrauch“ ersetzt die frühere Bezeichnung in den Vertragsdetails.

Quellen: Batch 225.2, 238.1, 616.6, 752.1, 761.2, 762.1, 778.1, 784.1, 790.1, 791.1, 811.1, 812.1, 821.1, 826.1, 827.1, 835.1, 837.1, 838.3, 845.1, 849.1, 861.5, 1079.5, 1085.1, 834.3, 750.1, 801.1, 825.4

## 10.3 Zahlerwechsel und Vertragsübertragung

**Zweck.** Mit der Vertragsübertragung, im System „Transfer“ genannt, übergeben Sie einen aktiven Vertrag an einen neuen Vertragsinhaber. Mit dem Zahlerwechsel, im System „Change Payer“ genannt, ändern Sie den Zahler eines aktiven Vertrags, ohne den Vertrag zu übertragen. Beide Vorgänge laufen über einen Assistenten und enden mit einer Unterschrift des Kunden.

**Voraussetzungen.** Der Vertrag ist aktiv, und das Produkt lässt die Vertragsübertragung zu. Market Operations liegt eine Anfrage vor sowie eine Kopie des Verkaufsvertrags oder ein Nachweis über den Eigentümerwechsel. Für einen Zahlerwechsel darf der Vertragswert nicht vollständig durch eine aktive Kampagne oder einen Händlerrabatt gedeckt sein. Während eine Übertragung läuft, ist „Change Payer“ deaktiviert, und während ein Zahlerwechsel läuft, ist „Transfer“ deaktiviert.

**Rollen.** Benutzer der Market Operations führen Übertragung und Zahlerwechsel durch. Die Rolle Dealer kann keine Vertragsübertragung durchführen. Der Zahlerwechsel über die Schaltfläche „Change Payer“ ist für Gewerbekunden nicht verfügbar.

**Schritt für Schritt Vertragsübertragung.**

1. Wählen Sie den aktiven Vertrag aus und öffnen Sie im Aktionsmenü „Action“ die Option „Transfer“. Die Option steht nur bei aktiven Verträgen zur Verfügung, deren Produkt die Übertragung erlaubt.
2. Erfassen Sie im ersten Schritt das Übertragungsdatum. Das Datum ist ein Pflichtfeld und lässt sich nur auf einen Tag in der Zukunft setzen.
3. Erfassen Sie den aktuellen Kilometerstand. Das System ermittelt ihn über die Vertragskalkulation aus der Fahrgestellnummer. Ist der Dienst nicht verfügbar, geben Sie den Wert manuell ein. Der Wert darf nicht über dem Kilometerstand am Vertragsende liegen, der sich aus Startstand, Laufzeit und Jahreslaufleistung ergibt, und nicht unter dem Kilometerstand beim Verkauf.
4. Erfassen Sie das Kennzeichen und optional einen Kommentar. Der Kommentar wird nach Abschluss der Übertragung im Bereich „History“ gespeichert.
5. Erfassen Sie die Daten des neuen Vertragsinhabers. Ist der Kunde bereits im System vorhanden, wählen Sie ihn über die Kundensuche aus. Bei einem neuen Kunden füllen Sie die Pflichtfelder aus, darunter Vorname, Nachname, E-Mail oder Mercedes-me-ID, Mobilnummer oder Mercedes-me-ID und die Adresse über die Adresssuche. Das System prüft das Format der E-Mail-Adresse.
6. Erfassen Sie im zweiten Schritt die Zahler- und Zahlungsdaten. Bei einem bestehenden Kunden sind die Felder mit den vorhandenen Daten vorbelegt. Bei einem neuen Kunden ist die IBAN das einzige Pflichtfeld, die übrigen Angaben leitet das System daraus ab.
7. Prüfen Sie im dritten Schritt Übersicht und Bestätigung. Die Vertragsvorschau enthält das Novationsdokument und bei einem neuen Kunden zusätzlich ein SEPA-Dokument.
8. Bestätigen Sie mit „√“. Die Bestätigung startet die Unterschrift. Der Kunde wählt die Signaturmethode.
9. Nach der Unterschrift fordert das System für einen neuen Kunden eine CAS-Prüfung an sowie SAP-Debitorennummer und Lastschriftcode. Ist das Ergebnis positiv, endet der Vertrag mit dem Vega-Statuscode 014 und dem Grund „CAS Check Positive“. Market Operations erhält dazu eine E-Mail. Bei einem möglichen Treffer wartet das System auf die Freigabe. Liegen die Prüfungen und die Unterschrift in Ordnung, wird die Übertragung akzeptiert und der Vertrag wieder auf „Aktiv“ gesetzt. Bei einem bestehenden Kunden, der bereits geprüft ist, entfallen diese Prüfungen.
10. Nach der erfolgreichen Übertragung aktualisiert das System die Kundendaten, erzeugt eine i155-Meldung mit dem neuen Kunden, informiert das Revenue Management und das Customer Management und versendet eine E-Mail an den neuen Kunden.

**Schritt für Schritt Zahlerwechsel.**

1. Wählen Sie den aktiven Vertrag aus und öffnen Sie im Aktionsmenü „Change Payer“.
2. Wählen Sie die Konstellation. Hat der Vertrag einen Halter und einen davon abweichenden Zahler, fügen Sie einen vorhandenen Zahler hinzu, legen einen neuen eigenständigen Zahler an oder machen den Halter zum Zahler. Sind Halter und Zahler identisch, ersetzen Sie den Zahler durch einen vorhandenen oder neuen Zahler.
3. Erfassen Sie die Pflichtfelder auf der Seite „Payer & Payer Information“. Fehlen Pflichtfelder, erscheint beim Weiterleiten zur Übersicht eine Fehlermeldung. Ein Zahlerwechsel ist nur für Zeitpunkte bis zum letzten Verfügbarkeitstag des Vertrags möglich.
4. Bei einem vom Halter abweichenden Zahler prüft das System den CAS-Status des Zahlers. Fällt die Prüfung positiv aus, bricht das System den Zahlerwechsel ab und reaktiviert den Vertrag mit dem Grund „Change Payer Failed“.
5. Lassen Sie den neuen Zahler das SEPA-Dokument unterschreiben, sofern dies nicht bereits geschehen ist.
6. Das System informiert Halter und Zahler getrennt per E-Mail. Ist der Halter zugleich der Zahler, entfällt die Benachrichtigung an den Zahler.

**Dokumente nach der Aktivierung hochladen.** Entscheidet sich ein Kunde für die manuelle Unterschrift auf einem ausgedruckten Dokument, laden Sie das unterschriebene Dokument in der Detailansicht über „Upload Document“ im Reiter „Communications“ hoch. Der Vorgang kann nicht abgeschlossen werden, solange das Dokument nicht validiert ist. Bei der Vertragsübertragung wählen Sie den Dokumenttyp „Novation Document“, beim Zahlerwechsel „SEPA“ und bei der Verlängerung „Prolongation“. Das System prüft die Vertragsnummer, die Unterschrift und bei der Verlängerung den QR-Code. Ein ungültiges Dokument wird in den MO-Prüfungen markiert. Die verfügbaren Dokumenttypen sind im Klärungsbedarf erfasst.

**Ergebnis und Systemstatus.** Bei der Übertragung bleibt der Vertrag aktiv und gehört dem neuen Kunden. Die Historie zeigt die Änderung des Attributs „Kunde“ mit altem und neuem Wert, die Art der Änderung „Transfer“, den Kommentar und den ausführenden Benutzer. Beim Zahlerwechsel bezahlt der neue Zahler ab dem Vertragsstart. Halter und Zahler erhalten die Bestätigung per E-Mail.

**Besonderheiten je Sparte und Markt.** Ein Vertrag eines Privatkunden lässt sich nicht auf einen Geschäftskunden übertragen und umgekehrt. Ein für einen Gewerbekunden angelegter Vertrag lässt sich übertragen. Die Umsatzsteuer-ID ist bei der Übertragung kein Pflichtfeld.

**Hinweise.** Bei der Übertragung unterzeichnet der Verkäufer am Standort des Verkäufers und der Käufer am Standort des Käufers, bei Bedarf zusätzlich das SEPA-Dokument. Die Schaltfläche „Send Email“ im Reiter „Communication“ sendet DSS-E-Mails erneut. Dabei storniert das System einen bestehenden DSS-Umschlag und erzeugt einen neuen mit der aktuellen E-Mail-Adresse und Telefonnummer. Das Limit für den Upload von Dokumenten in den Markteinstellungen beträgt 100 MB. Die Erfolgsseite der Übertragung meldet, dass der neue Kunde per E-Mail über die Details informiert wird.

**Fehlerbehebung.** Ein doppelter Klick auf „Next“ löst beim Bestätigen keinen Fehler aus. Mehrfaches Klicken auf die Vertragsübertragung legt keinen neuen Kunden doppelt an. Der Käufer erhält eine E-Mail. Ein auf einen neuen gewerblichen Kunden übertragener Vertrag bleibt nicht im Status „Suspended“. Der verbleibende Kilometerstand nach einer Übertragung ist korrekt. Die Aktion „Transfer“ funktioniert. Die Reaktivierungsoptionen stehen während einer Übertragung oder eines Zahlerwechsels nicht zur Verfügung, wenn der Vertrag während des Unterschriftsprozesses ausgesetzt ist.

Quellen: Batch 336.1, 359.1, 386.2, 394.1, 414.1, 428.3, 470.1, 479.3, 761.2, 795.3, 806.1, 807.3, 813.1, 815.1, 819.3, 820.1, 824.4, 827.2, 831.5, 834.3, 835.1, 847.1, 788.3, 797.1, 1102.5, 1102.6, 1110.5, 749.1, 750.1

## 10.4 Aussetzen und Reaktivieren

**Zweck.** Sie setzen einen aktiven Vertrag aus. Ein ausgesetzter Vertrag kann in der Werkstatt nicht genutzt werden. Mit der Reaktivierung setzen Sie einen ausgesetzten Vertrag wieder auf „Aktiv“. Aussetzen, Reaktivieren, vorzeitige Beendigung und Stornierung lassen sich für mehrere Verträge eines Kunden gleichzeitig ausführen. Die Aussetzung betrifft aktive Verträge, die Reaktivierung ausgesetzte Verträge.

**Voraussetzungen.** Der Vertrag ist aktiv und gehört nicht zu einem Kontingentprodukt. Das System wartet nicht auf die DSS-Unterschrift des Kunden für eine Langzeitverlängerung, und das Produkt unterstützt die Langzeitverlängerung. Für die Reaktivierung hat der Vertrag den Status „Suspended“.

**Rollen.** Benutzer der Market Operations setzen Verträge aus und reaktivieren sie. Händler dürfen Verträge nicht aussetzen, nicht reaktivieren und nicht beenden. Die Zulässigkeit für die Rolle MPC ist im Klärungsbedarf erfasst.

**Schritt für Schritt Aussetzen.**

1. Öffnen Sie den Vertrag und wählen Sie im Aktionsmenü die Option „Suspend Contract“.
2. Wählen Sie den Grund in der Auswahlliste „Reason for Suspension“. Der Standardwert ist „Payment Overdue“. Bei „Other“ ist ein Kommentar verpflichtend.
3. Sind mehrere Verträge eines Kunden betroffen, suchen Sie im Pop-up über „Search contract“ und markieren die Verträge. Mit „Select All Contracts“ wählen Sie alle Verträge der Liste aus. Grund und Kommentar gelten für alle ausgewählten Verträge.
4. Die Schaltfläche zur Ausführung wird aktiv, sobald die Pflichtfelder ausgefüllt sind. Führen Sie die Aussetzung aus.

**Schritt für Schritt Reaktivieren.**

1. Öffnen Sie den ausgesetzten Vertrag und wählen Sie die Aktion „Reaktivieren“. Die Schaltfläche für den Status „Ruhend“ heißt ebenfalls „Reaktivieren“.
2. Sind mehrere Verträge betroffen, wählen Sie sie im Pop-up aus. Neben jeder Vertragsnummer erscheint das Kennzeichen oder „-“, wenn kein Kennzeichen vorhanden ist.
3. Erfassen Sie Grund und Kommentar und führen Sie die Reaktivierung aus.

**Ergebnis und Systemstatus.** Eine Aussetzung setzt den Vertragsstatus auf „Suspended“. Die i155-Meldung führt den Status 002, eine Reaktivierung den Status 001. Die Historie hält den Grund fest. Das System erzeugt für Market Operations eine interne Benachrichtigung vom Typ SUSPENDED_CONTRACT und eine E-Mail vom Typ TASK_ASSIGNMENT. Wechselt der Vertrag aus dem Status „Suspended“ in einen anderen Status, löscht das System die interne Benachrichtigung. Ausnahme sind Übertragung und Zahlerwechsel, die während der Aussetzung laufen. Nach der Reaktivierung versendet das System eine E-Mail an den Kunden. Welche Vorlage gilt, ist im Klärungsbedarf erfasst.

**Ablauf bei Mahnstufe 3.** Das Revenue Management kann auf Anfrage einen oder mehrere aktive Verträge sperren. Das System setzt den Vertragsstatus auf „Suspended“ und hinterlegt den Grund „Dunning Level 3“. Die i155-Meldung führt den Status 002 und kann in RC10 einen Hinweis auf die Sperrung enthalten. Das Revenue Management erhält die Information über die Statusänderung und den Zeitpunkt. Die Reaktivierung nach einer Mahnstufe 3 erfolgt auf Anfrage des Revenue Managements. Das System setzt den Vertrag auf „Aktiv“ und hinterlegt den Grund „Dunning Level 3 Removed“. Die Historie zeigt den Vorgang als Änderung des Attributs „Contract Status“ mit dem Änderungstyp „Suspension“ beziehungsweise „Activation“. Als Ausführenden zeigt die Historie „oneSCM“.

**Zahlungsprobleme mit der Kreditkarte.** Meldet das Revenue Management, dass die Kreditkarte eines Vertrags abgelaufen ist, setzt das System einen aktiven Vertrag auf „Suspendiert“ und hinterlegt den Grund „Payment Method Invalid“. Der Vertrag bleibt suspendiert, bis eine weitere Entscheidung getroffen wird oder das Vertragsende erreicht ist. Market Operations erhält eine interne Benachrichtigung. Der Kunde aktualisiert seine Kartendaten selbst im Customer Account Center. Revenue übermittelt die neue Asset-ID und die NTR, die das System auf Vertragsebene speichert. Sind offene Zahlungen beglichen, setzt das System den Vertrag wieder auf „Aktiv“ und hinterlegt den Grund „Payment Method Update“. Erfolgt keine Aktualisierung, beendet ein Market-Operations-Benutzer den Vertrag manuell vorzeitig.

**Zahlungslink.** Wird der Zahlungslink eines Vertrags nicht genutzt, erhält der Kunde am siebten Tag eine Erinnerung. Am 14. Tag endet die Karenzzeit. Die Wirkung auf den Vertrag ist im Klärungsbedarf erfasst. Wurde eine Zahlung versucht, solange Wiederholungsversuche laufen, setzt das System den Vertrag nicht aus. Liegen für den Vertrag Forderungen aus VEGA oder manuelle Werkstattrechnungen im Status „Akzeptiert“ vor, blockiert das System eine automatische Stornierung. Market Operations klärt die Forderungen dann und ändert den Vertragsstatus danach.

**Besonderheiten je Rolle.** Market-Operations-Benutzer setzen Verträge aus und reaktivieren sie. Bei Gewerbekunden lassen sich mehrere Verträge gleichzeitig aussetzen, reaktivieren oder vorzeitig beenden.

**Besonderheiten je Sparte und Markt.** Leasingverträge aus dem MBLD-Ablauf sperren und reaktivieren Sie über den Edge Service. Bei diesen Verträgen versendet das System keine E-Mail an den Kunden. Für Verträge der Sparte Van und Pkw gelten dieselben Statuswechsel.

**Hinweise.** Während einer laufenden Langzeitverlängerung bricht das System die Verlängerung vor einer Aussetzung ab, sodass die Konfiguration des Vertrags vor dem Start der Verlängerung erhalten bleibt. Ein ausgesetzter Vertrag lässt sich auch direkt vorzeitig beenden. Im Pop-up zur Aussetzung ist die Auswahl „Reason for Suspension“ verpflichtend. Die Aussetzung einer Langzeitverlängerung im Status „Expired“ oder bei einer Beendigung nach Laufleistung ist im Klärungsbedarf erfasst.

**Fehlerbehebung.** Die Schaltfläche „Suspend Contract“ wird aktiv, sobald die Pflichtfelder ausgefüllt sind. Ein Vertrag, der während der Übertragung oder des Zahlerwechsels ausgesetzt wird, behält die Reaktivierungsoptionen nicht. Nach einem Zahlerwechsel auf einen neuen Kunden bleibt der Vertrag nicht im Status „Ausgesetzt“. Eine Aussetzung über den Status „Suspended“ wird vollständig protokolliert.

Quellen: Batch 777.6, 778.2, 780.1, 783.1, 786.1, 787.2, 789.1, 790.1, 794.1, 802.1, 805.1, 806.1, 807.2, 811.1, 812.1, 824.4, 830.2, 833.4, 838.3, 844.3, 845.1, 850.2, 854.1, 853.2, 856.1, 160.3, 216.2, 491.2, 616.6, 809.2

## 10.5 Verlängerung, Folgeangebot und Folgevertrag

**Zweck.** Mit einer Verlängerung erweitern Sie Laufzeit oder Laufleistung eines aktiven Vertrags, ohne einen neuen Vertrag anzulegen. Die Kurzzeitverlängerung, im System „Short Term Extension“ genannt, verlängert den Vertrag um einen bis sechs Monate zum Monatspreis. Die Langzeitverlängerung, im System „Long Term Prolongation“ genannt, verlängert Laufzeit und Laufleistung zu einem neuen Preis. Für Leasingverträge aus dem MBLD-Ablauf gelten eigene Abläufe. Die Vertragsanpassung mit Reduzierung ist im Klärungsbedarf erfasst.

**Voraussetzungen.** Der Vertrag ist aktiv, und das Produkt unterstützt die gewählte Verlängerungsart. Die Langzeitverlängerung steht nicht für Kontingentprodukte zur Verfügung. Eine Verlängerung, die auf die DSS-Unterschrift des Kunden wartet, blockiert eine weitere Langzeitverlängerung. Der Vertrag darf nicht bereits über die im Produkt konfigurierte maximale Laufzeit oder Laufleistung hinaus verlängert sein. Eine Kurzzeitverlängerung ist insgesamt auf sechs Monate begrenzt. Ein Vertrag, der vollständig durch Händler oder Kampagne bezahlt ist, lässt sich nicht kurzfristig verlängern. Bei subventionierten Verträgen sind Kurz- und Langzeitverlängerung zunächst nicht auswählbar. Der Kunde registriert seine Zahlungsinformationen im Customer Account Center, danach stellt Market Operations die Verlängerung bereit.

**Rollen.** Market Operations und MPC führen Verlängerungen aus. Händler können für bestehende Verträge Preise für Langzeitverlängerungen anfragen. Ein MBLD-Vertrag verlängert MBLD über die Schnittstelle, nachdem sich MBLD mit dem Market Operations Team abgestimmt hat.

**Schritt für Schritt Kurzzeitverlängerung.**

1. Wählen Sie den aktiven Vertrag aus und öffnen Sie über „Prolongate“ die Auswahl der Verlängerungsart.
2. Wählen Sie die Laufzeit von einem bis sechs Monaten. Haben Sie den Vertrag bereits verlängert, zeigt das System nur die Monate, mit denen die Gesamtdauer von sechs Monaten nicht überschritten wird. Bei zwei bereits verlängerten Monaten stehen nur noch ein bis vier Monate zur Auswahl.
3. Erfassen Sie optional einen Kommentar. Das Feld ist auf 100 Zeichen begrenzt.
4. Prüfen Sie im zweiten Schritt die Übersicht mit Referenznummer, Produkt, Verlängerungsdetails und Vergleichstabelle. Das Startdatum bleibt unverändert, das geplante Vertragsende verschiebt sich um die gewählten Monate. Das Zahlungsintervall ist monatlich.
5. Bestätigen Sie mit dem Häkchen. Das System wendet die Verlängerung an, versendet eine E-Mail an den Kunden, erzeugt eine i155-Meldung mit dem neuen Vertragsende und informiert das Revenue Management.

Für die Laufleistung bei einer Kurzzeitverlängerung gilt die Markteinstellung „Mileage Handling“ für die Kurzzeitverlängerung. Die Einstellung „Extend Mileage“ erhöht die Fahrleistung anteilig. Dafür teilt das System die Jahresfahrleistung durch 12 und multipliziert das Ergebnis mit den verlängerten Monaten. Bei 10.000 km pro Jahr und drei Monaten ergeben sich 2.500 km. Die Einstellung „Do Not Extend Mileage“ lässt die Fahrleistung unverändert. Der Standardwert ist „Extend Mileage“. Ist die Kurzzeitverlängerung für das Produkt aktiviert, werten Sie die Einstellung zum Zeitpunkt des Starts aus.

Die Kurzzeitverlängerung erhöht den Gesamtpreis des Vertrags um den Monatspreis multipliziert mit den hinzugefügten Monaten. Der Monatspreis wird auf Basis aller Zahlungsintervalle und der Verwaltungsgebühr aus der Produktkonfiguration ermittelt. Er gilt unabhängig vom ursprünglichen Zahlungsintervall.

**Schritt für Schritt Langzeitverlängerung.**

1. Wählen Sie den aktiven Vertrag aus und öffnen Sie im Aktionsmenü die Langzeitverlängerung. Das System ruft die möglichen Konfigurationen und Preise über den Produktservice ab.
2. Legen Sie im ersten Schritt die Verlängerungsdetails fest. Das Startdatum ist schreibgeschützt und entspricht dem nächsten Gültigkeitstag. Wählen Sie die Laufzeit in Monaten aus der Auswahl, die sich aus der maximalen Laufzeit des Produkts ergibt. Wählen Sie die jährliche Laufleistung aus. Die Gesamtlaufleistung berechnet das System und zeigt sie schreibgeschützt an. Mindestens eine der beiden Angaben, Laufzeit oder Laufleistung, müssen Sie ausfüllen.
3. Beachten Sie die vier Fälle. Wählen Sie Laufzeit und Laufleistung, verlängert sich der Vertrag um die Laufzeit, und die Laufleistung gilt für die gesamte neue Laufzeit. Wählen Sie nur die Laufzeit und soll die Gesamtlaufleistung erhalten bleiben, verteilt das System die Gesamtlaufleistung auf den neuen Zeitraum. Wählen Sie nur die Laufleistung, bleibt die Vertragslaufzeit unverändert. Wählen Sie nur die Laufzeit, bleibt die jährliche Laufleistung wie in den Anfangsjahren.
4. Wählen Sie die optionalen Deckungen. Bereits enthaltene optionale Deckungen bleiben vorausgewählt und lassen sich nicht abwählen. Zusätzliche optionale Deckungen fügen Sie durch Anklicken hinzu. Der Preis berechnet sich danach neu.
5. Prüfen Sie den Preis. Bei Privatkunden zeigt das System den Bruttopreis, beim Darüberfahren mit der Maus den Nettopreis und die Mehrwertsteuer. Bei Geschäftskunden zeigt das System den Nettopreis und im Tooltip den Bruttopreis.
6. Prüfen Sie im zweiten Schritt die Übersicht. Die Tabelle „Vertragsänderungen“ stellt den aktuellen Vertrag dem Vertrag nach der Verlängerung gegenüber, in den Spalten „Current Contract“ und „Contract after Extension“. Der Vertragsbeginn bleibt unverändert. Laufzeit, Enddatum und Laufleistung zeigen die Werte nach der Verlängerung.
7. Senden Sie das Angebot optional per „E-Mail senden“ an den Kunden. Das PDF trägt ein DRAFT-Wasserzeichen, enthält einen Zahlungsplan und hat keinen Unterschriftsbereich.
8. Starten Sie mit „Übermitteln & Unterschreiben“ den DSS-Prozess. Das System fragt vor dem Start: „Are you sure you want to proceed with the DSS signature for prolongation?“ Mit „Proceed“ starten Sie den Prozess, mit „Cancel“ brechen Sie ihn ab. Während der Prozess läuft, zeigt ein Banner „On Progress“ den Status an. Die Verlängerungsoption ist für diesen Vertrag bis zum Abschluss deaktiviert.

Die Konfiguration bleibt erhalten, wenn Sie den Ablauf mit „X“ verlassen. Beim erneuten Start zeigt das System die Schaltfläche „Open Setup“, mit der Sie die zuletzt gespeicherte Konfiguration laden. Den Prozess bricht das Revenue Management oder der Benutzer mit der Aktion „Cancel Long Term Prolongation“ ab, die einen Grund verlangt.

**Automatische Genehmigung oder Ablehnung.** Hat der Kunde den Anhang innerhalb der konfigurierten DSS-Wartezeit unterzeichnet und liegt das Vertragsende noch nicht vor, gilt die Verlängerung als übernommen. Der Kunde erhält eine E-Mail, das System erzeugt eine i155-Datei mit dem aktualisierten Vertragsende und der aktualisierten Laufleistung, und das Revenue Management erstellt die Rechnungen für das gewählte Zahlungsintervall. Die Historie zeigt „Prolongation Successful“ mit dem Benutzer „System“. Unterzeichnet der Kunde nicht vor dem Vertragsende, erhält der Vertrag den Status „Expired“. Die Historie zeigt „Prolongation Failed“, und eine Vertragsprüfung für die Endabrechnung wird angestoßen.

**Folgeangebot und Gültigkeit.** Ein Verlängerungsangebot hat eine ausdrücklich festgelegte Gültigkeitsdauer. Das Wirksamkeitsdatum ergibt sich aus dem Anfragedatum, der Angebotsgültigkeit und dem Zahlungsintervall. Liegt das Ende der Gültigkeit nach dem rechnerisch nächsten Wirksamkeitsdatum, wählt das System das nächste verfügbare Wirksamkeitsdatum nach Ablauf der Gültigkeit. Beispiel: Ein am 10.12.2025 versendetes Angebot mit 30 Tagen Gültigkeit ist bis zum 09.01.2026 gültig. Das rechnerische Wirksamkeitsdatum liegt am 05.01.2026, daher ist das Wirksamkeitsdatum der 05.02.2026. Ist die Restlaufzeit kürzer als die Gültigkeit, endet die Gültigkeit mit dem Vertragsende, und das nächste Wirksamkeitsdatum ist der erste Tag nach Vertragsende. Die Konfiguration und der Preis bleiben während der Gültigkeit erhalten, auch wenn sich die Preise auf Produktebene ändern.

Vor dem Vertragsende informiert das System den Vertragsinhaber automatisch über eine Verlängerungsmöglichkeit. Die erste Benachrichtigung erfolgt 60 Tage vor dem geplanten Vertragsende, die zweite 30 Tage vor dem Ende, sofern keine Verlängerung erfolgt ist. In Spanien gelten 180 und 45 Tage. Die Anzahl der Tage ist je Markt konfigurierbar. Die Benachrichtigung gilt für aktive und ausgesetzte Verträge, nicht für Kontingentprodukte.

Ein Folgevertrag nach Ablauf ist im Material nicht beschrieben.

**Preisberechnung.** Die Verlängerung erfolgt während der Laufzeit des Vertrags. Bei der Preisberechnung für Verlängerungen berücksichtigt das System keine Händlerprovision, keine Marktkampagnen und keine Händlerrabatte. Der zahlungsabhängige Aufschlag bleibt im Preis enthalten. Die Produktkonfiguration legt fest, ob der Preis mit der Preisversion zum Verkaufsdatum oder mit der Preisversion zum Verlängerungszeitpunkt berechnet wird. Bei „Pricing at Prolongation Time“ verwendet das System den neuen Matrixwert, bei „Pricing at Contract Sales Date“ den alten Matrixwert. Der Preis der bisherigen Laufzeit wird aus dem Preis der neuen Laufzeit abgezogen, und das Ergebnis verteilt das System auf die verbleibenden Monate. Ergibt die Berechnung einen negativen Betrag, setzt das System ihn auf 0.

Bei einer Verlängerung von Verträgen mit einem Sonderfall berechnet das System den Angebotspreis aus dem ursprünglichen Sonderfallpreis zuzüglich der Differenz der Preispunkte. Beispiel: Ein ursprünglicher Sonderfallpreis von 1.800 zuzüglich einer Differenz von 950 ergibt einen Angebotspreis von 2.750. Eine erneute Sonderfallanfrage ist bei der Verlängerung nicht möglich.

Für MBLD-Verträge stellt oneSCM Verlängerungspreise bereit, die aus der Gesamtlaufleistung abgeleitet und zwischen vorhandenen Preispunkten derselben Laufzeit interpoliert werden. Verlängerungen mit preisrelevanten Optionen verwenden die ursprüngliche Preisversion, die Produktkonfiguration legt die Preisversion fest.

**Besonderheiten je Rolle.** Händler fragen Preise für bestehende Verträge an. Die Verlängerung selbst führen Market Operations und MPC aus. Ein Dealer+-Benutzer kann Verlängerungen nur im Rahmen der Produktkonfiguration auslösen.

**Besonderheiten je Sparte und Markt.** Bei Reifenprodukten ist die Anzahl der Reifen ein Vielfaches von 2, und das System zeigt eine Empfehlung an. Die Langzeitverlängerung steht für alle Produkte zur Verfügung. Ist ein Produkt nicht für die Kurzzeitverlängerung konfiguriert, zeigt die Oberfläche die Option nicht an. Für MBLD-Verträge erfolgt die Verlängerung über die Schnittstelle, ohne Dokument und ohne Kundenunterschrift.

**Hinweise.** Kurz- und Langzeitverlängerung lassen sich auf einem Vertrag kombinieren, sofern alle Voraussetzungen erfüllt sind. Mehrere Langzeitverlängerungen sind möglich, solange das System nicht auf die DSS-Unterschrift wartet. Verträge, die zuvor langfristig verlängert wurden, lassen sich verkürzen. Jede Anpassung berechnet das System auf Basis der aktuellen Vertragswerte. Das Kommentarfeld ist optional. Die Vertragsübersicht ist in der Anwendung, in E-Mails und in Dokumenten identisch. Die E-Mail zur Langzeitverlängerung nennt bei Geschäftskunden das Feld „Firmenname“. Eine Verlängerung mit Zusatzdeckungen ist auch ohne Auswahl einer Laufleistung möglich.

**Fehlerbehebung.** Die Verlängerungs-E-Mail wird einmal versendet. Der Monatspreis wird korrekt angezeigt. Der Gesamtpreis des Vertrags aktualisiert sich nach einer genehmigten Kurzzeitverlängerung. Die Zahlungsdauer erhöht sich um die verlängerten Monate. Die Berechnung der geplanten Laufleistung bei Langzeitverlängerungen berücksichtigt die Laufleistung zu Vertragsbeginn. Der Preis optionaler Deckungen verteilt den Preismatrixbetrag auf die Vertragslaufzeit. Die Verlängerung von Verträgen aus Sonderfällen ist möglich. Die Auswahl „Long Term Prolongation“ öffnet den Assistenten ohne Fehlermeldung.

Quellen: Batch 123.1, 185.4, 248.1, 254.2, 234.1, 409.1, 760.1, 762.1, 771.1, 776.1, 777.1, 777.3, 780.1, 781.1, 781.2, 782.1, 783.1, 783.2, 783.5, 787.3, 788.2, 791.1, 793.1, 799.1, 800.1, 807.4, 809.3, 810.2, 811.1, 817.1, 819.1, 820.2, 821.2, 822.6, 823.3, 824.1, 824.2, 826.1, 828.1, 829.1, 830.1, 830.3, 830.4, 830.5, 830.7, 831.3, 834.2, 839.1, 889.3, 1150.3, 1150.4, 1154.2, 1154.6, 1157.1, 1167.1, 1211.1, 1213.1, 1213.2, 1213.4, 1258.1, 1264.5, 1273.4, 1274.7, 754.2, 765.6, 769.2, 769.1, 1278.9, 384.4, 788.2, 1139.1, 1213.4

## 10.6 Kündigung, Stornierung und Beendigung

**Zweck.** Sie beenden einen Vertrag auf drei Wegen. Sie storniern einen Vertrag innerhalb der Widerrufsfrist, sie beenden einen aktiven oder ausgesetzten Vertrag vorzeitig, oder der Vertrag läuft automatisch nach Datum, Laufleistung oder Kontingent ab. Nach dem Ablauf oder der vorzeitigen Beendigung setzt das System den Vertrag nach einer konfigurierten Frist auf „Closed“.

**Voraussetzungen.** Für die Stornierung eines aktivierten Vertrags muss die Stornierungsfrist in den Markteinstellungen definiert sein. Der Vertrag darf keinen offenen Schadensfall haben. Vor der Aktivierung storniert der Benutzer einen Vertrag im Status „Created“ oder „Waiting for Activation“. Für die vorzeitige Beendigung muss der Vertrag aktiv oder ausgesetzt sein. Bei Leasingverträgen prüft das System zusätzlich den Vertragstyp. Die Eingabe der Laufleistung ist erst möglich, nachdem ein Beendigungsdatum gewählt wurde.

**Rollen.** MO und MPC stornieren Verträge. Andere Rollen können die Funktion „Vertrag stornieren“ nicht auslösen. Die Rolle Dealer darf den Status eines Vertrags nicht ändern. Leasingverträge beendet MBLD über den Edge Service, die Regeln entsprechen denen der Retail-Verträge.

**Schritt für Schritt Stornierung eines aktivierten Vertrags.**

1. Öffnen Sie den aktivierten Vertrag und wählen Sie „Cancel Contract“. Liegt eine aktive Werkstattrechnung vor, erscheint die Meldung „Contract Cancellation cannot be initiated as the contract has an active workshop invoice“, und der Vorgang startet nicht.
2. Das System prüft beim Klick auf Schadensfälle über die Warranty-and-Goodwill-Schnittstelle. Liegt ein offener Schadensfall vor, zeigt das System die Meldung, dass der Vertrag nicht storniert werden kann. Im Warnfenster führt Sie „Go to Early Terminate“ zur vorzeitigen Beendigung. Ist die Schnittstelle nicht erreichbar, erscheint eine Fehlermeldung, und die Aktion bricht ab.
3. Wählen Sie das Stornierungsdatum. Endanwender können bis zum Ende der Frist aus den Markteinstellungen stornieren. MO und MPC können bis zum Aktivierungsdatum zuzüglich der Frist und der Pufferzeit stornieren. Während der Pufferzeit lässt der Datumsauswähler nur den letzten gültigen Stornierungstag zu.
4. Erfassen Sie den Grund und optional einen Kommentar und bestätigen Sie die Stornierung. Das Pop-up „Vertrag stornieren“ erfasst keinen Kilometerstand.
5. Nach der Bestätigung erhält der Vertrag den Status „Cancelled“. Das tatsächliche Vertragsende entspricht dem Vortag. Die Historie enthält die Stornierung mit Grund und Kommentar, und der Kunde erhält eine E-Mail.

**Schritt für Schritt vorzeitige Beendigung.**

1. Wählen Sie den aktiven oder ausgesetzten Vertrag aus und öffnen Sie im Aktionsmenü „Terminate Early“.
2. Wählen Sie das Beendigungsdatum im Kalender. Das Datum darf nicht in der Zukunft liegen und muss mindestens einen Tag nach der Aktivierung liegen. Bei Produkten mit FRD gilt FRD plus 1 Tag als frühestes Datum, bei Produkten ohne FRD-Bezug das Aktivierungsdatum plus 1 Tag. Die zulässige Rückdatierung ist im Klärungsbedarf erfasst.
3. Das Kilometerstandsfeld wird nach der Wahl des Datums freigegeben. Geben Sie für jedes Fahrzeug den Kilometerstand ein. Er darf nicht unter dem zuletzt bekannten Kilometerstand liegen. Stehen Werte aus MIC und DSB zur Verfügung, gilt der höhere Wert als Untergrenze. Liegt der DSB-Wert über dem MIC-Wert, ist das Feld ein Eingabefeld, das mindestens den DSB-Wert enthalten muss.
4. Wählen Sie den Grund in der Liste „Select Reason“. Bei „Other“ ist ein Kommentar verpflichtend. Mehrere Verträge eines Kunden können Sie mit „Select All Contracts“ gemeinsam beenden. Bereits markierte Verträge, deren Aktivierungsdatum nicht vor dem Beendigungsdatum liegt, verlieren ihre Markierung und das System zeigt den Grund an.
5. Schließen Sie den Vorgang mit „Terminate Contract Early“ ab. Ein Hinweis weist darauf hin, dass nach der Beendigung eine abschließende Vertragsprüfung manuell erfolgt, etwa für Rechnungen mit Zahlungsdatum nach der Beendigung.

**Ergebnis und Systemstatus.** Nach der vorzeitigen Beendigung erhält der Vertrag den Status „Early Terminated“. Die i155-Meldung führt das Ausscheidedatum in RC05, Stellen 107 bis 114, und das Datum der Auslösung in den Stellen 140 bis 147. Revenue und Nemesis erhalten das Wirksamkeitsdatum und das Auslösedatum. Ist keine abschließende Vertragsprüfung erforderlich, wartet das System die in den Markteinstellungen festgelegte Zahl von Tagen ab und setzt den Vertrag danach automatisch auf „Closed“. Die Historie vermerkt den Grund „Claiming period time over“. In der Wartezeit können Händler weiterhin Forderungen zum Vertrag einreichen. Bereits an VEGA übermittelte Schäden bleiben bestehen. Neue Schadensfälle mit einem Datum nach dem Ereignisdatum legt das System nicht an.

Für Revenue und Nemesis gilt: Bereits an oneERP übertragene Rechnungsanforderungen werden verarbeitet. Noch nicht exportierte Rechnungsanforderungen werden storniert. Erlöse und Kosten melden weiterhin an Nemesis. Manuelle Rechnungen und Gutschriften sind möglich, bis der Vertrag auf „Closed“ steht.

**Ablauf des Vertrags.** Ein aktiver Vertrag läuft automatisch ab, sobald das Vertragsende oder die vereinbarte Gesamtlaufleistung erreicht ist, je nachdem, was zuerst eintritt. Der Status wechselt dann auf „Expired“, und der Kunde erhält eine E-Mail. Das System informiert VEGA über die i155-Datei. Wird das Vertragsende erreicht, setzt das System den Vertrag auf „Expired“ und löst die Schnittstelle i155 aus. Der Ablauf richtet sich nach dem Ablaufkriterium des Produkts. Bei „TIME“ endet der Vertrag mit dem geplanten Enddatum. Bei „TIME_OR_MILEAGE“ endet er mit dem Enddatum oder mit dem Überschreiten der geplanten Laufleistung. Bei „CONTINGENT“ endet er, sobald alle Leistungen verbraucht sind. Ein Kontingentvertrag endet erst, wenn alle Services aufgebraucht sind, und bei mehreren Kriterien mit dem ersten erreichten Kriterium.

Meldet der Laufleistungsstand aus einem i156-Import eine Laufleistung, die über der geplanten Gesamtlaufleistung liegt, setzt das System den Vertrag auf „Expired“, aktualisiert den letzten bekannten Kilometerstand und die tatsächliche Laufleistung am Vertragsende und löst eine Vertragsprüfung aus. Eine Hochrechnung löst niemals einen Ablauf aus.

Ein vorzeitiger Ablauf durch Eingabe eines Kilometerstands erfordert eine Bestätigung. Erreicht oder überschreitet der eingegebene Wert den geplanten Kilometerstand am Vertragsende und unterstützt das Produkt den Ablauf nach Laufleistung, fragt das System: „The entered value will result in early contract expiration. Do you want to proceed?“ Mit „Proceed“ speichert das System den Wert, setzt den Vertrag auf „Expired“ und hinterlegt den Grund „Expired by Mileage“.

**Besonderheiten je Rolle.** MO und MPC führen Stornierungen und vorzeitige Beendigungen aus. Der Kunde kann eine Stornierung innerhalb der Frist selbst auslösen, sofern das System dies anbietet. Bei MBLD-Verträgen erfolgt die Verwaltung über den Edge Service, ohne E-Mail an den Kunden.

**Besonderheiten je Sparte und Markt.** Für Deutschland ist eine Rückdatierung der vorzeitigen Beendigung im Klärungsbedarf erfasst. Bei Reifenprodukten endet der Vertrag nicht, wenn die geplante Endlaufleistung oder die vollständige Nutzung der Reifensätze erreicht ist. Der Vertrag bleibt in diesem Fall aktiv. Kontingentprodukte stehen für die vorzeitige Beendigung im MVP nicht zur Verfügung.

**Hinweise.** Die Kulanzfrist für Stornierungen gilt bis zu der Frist, die in den Markteinstellungen festgelegt ist. Bei einer Stornierung innerhalb der Kulanzfrist storniert das System geplante Belege der Typen DD, SCOM, SDAS und CAMP automatisch. Ein Vertrag, der mit einer Grace-Period-Kampagne innerhalb der Widerrufsfrist storniert wird, sendet ein Storno-Ereignis an Products. Der Kilometerstand bei einer Beendigung wird je Fahrzeug erfasst. Die Kündigungsoption nach einer Aktivierung entfällt nach 14 Tagen. Eine Reaktivierung nach einer Aussetzung setzt diese Frist nicht zurück. Die Beendigung nach Laufleistung ist im Klärungsbedarf erfasst.

**Fehlerbehebung.** Die Datumsauswahl bei der Stornierung berücksichtigt die 14-Tage-Frist ab der Aktivierung. Die Zeile „Vertragsdauer“ aktualisiert sich bei vorzeitiger Beendigung und bei Stornierung mit dem tatsächlichen Enddatum. Die Stornierung bleibt erlaubt, wenn ein offener Schadensfall später storniert, abgelehnt oder gelöscht wird und die Widerrufsfrist noch läuft. Eine vorzeitige Beendigung storniert nicht alle Rechnungen aus oneSCM. Bei einem Vertrag mit Schadensfall nach der Stornierung entfällt die Option „Vertrag stornieren“. Der Vertrag lässt sich nicht ablaufen oder schließen, wenn die Review-Zahlung 0 beträgt. Das Eingabefeld für die Laufleistung in der vorzeitigen Beendigung ist aktiv, sobald ein Beendigungsdatum gewählt ist.

Quellen: Batch 153.1, 224.3, 141.4, 144.1, 343.1, 469.1, 477.1, 478.3, 492.1, 748.2, 754.3, 763.6, 770.2, 770.3, 771.2, 779.3, 784.1, 785.1, 786.1, 786.5, 788.5, 792.1, 799.2, 800.2, 803.1, 804.1, 806.2, 809.2, 812.1, 813.1, 820.3, 823.2, 825.2, 825.6, 827.1, 831.1, 832.1, 833.2, 834.3, 835.1, 843.2, 852.5, 853.2, 855.4, 856.2, 869.7, 976.8, 976.9, 988.2, 1021.3, 1080.2, 1026.1, 824.4, 1 Batch 810.1, 833.1

## 10.7 Finanzielle Folgen und Abschlussnachweise

**Zweck.** Nach dem Ende eines Vertrags prüft das System die finanzielle Abrechnung über die Vertragsprüfung, im System „Contract Review“ genannt. Auf Basis des Profils, das dem Produkt zugeordnet ist, berechnet das System Mehr- und Minderkilometer. Daraus ergeben sich Rechnungen, Gutschriften oder Ausgleichszahlungen. Finanzbelege und Rechnungen des Vertrags zeigt das Vertragsmanagement lesend an.

**Voraussetzungen.** Der Vertrag ist beendet oder abgelaufen. Dem Produkt ist ein Profil zugeordnet. Das System benötigt den tatsächlichen Kilometerstand am Vertragsende. Ist im Profil sowohl für Mehr- als auch für Minderkilometer „No Charge“ beziehungsweise „No Compensation“ gesetzt, findet keine Vertragsprüfung statt.

**Rollen.** MPC und MO geben die Vertragsprüfung frei oder lehnen sie ab. Bei einer Minderleistung mit manueller Freigabe ist die Genehmigung durch den MPC möglich. Revenue erhält die Benachrichtigung nach einer Freigabe.

**Schritt für Schritt Vertragsprüfung.**

1. Der Vertrag erhält den Status „Expired“ nach Datum oder nach Beendigung. Das Contract Management fragt beim Vehicle Management unter Angabe der Fahrgestellnummer den Kilometerstand an. Das Vehicle Management ruft ihn über die MIC-API ab.
2. Liefert das System keinen Kilometerstand, wird das Feld „Real Vehicle Mileage at Contract End“ zu einem Eingabefeld. Geben Sie den Kilometerstand nach Rückfrage beim Kunden ein. Der Wert darf nicht kleiner sein als der zuletzt aus i156 importierte Stand. Das System zeigt dann die Meldung „Entered Mileage cannot be smaller than last captured mileage“ mit dem letzten Stand.
3. Das System vergleicht den geplanten Kilometerstand am Vertragsende mit dem tatsächlichen Stand. Der Vergleich berücksichtigt eine Toleranz, sofern sie im Profil definiert ist. Liegt der tatsächliche Stand über dem geplanten Stand, entsteht eine Mehrleistung. Liegt er darunter, entsteht eine Minderleistung.
4. Bei einer Mehrleistung berechnet das System den Betrag auf Basis eines Prozentwerts oder eines absoluten Werts. Ist eine Maximalbelastung hinterlegt, wird der kleinere der beiden Werte mit dem Preis pro Kilometer multipliziert. Bei einer Minderleistung hängt das Vorgehen vom Profil ab. Bei „Compensation on Customer Request“ wird nichts berechnet. Bei „Compensation“ berechnet das System die Gutschrift.
5. Prüfen Sie die Freigabe in der Operative Review Page. Mit „Approve“ genehmigen Sie die Anfrage, und Revenue erstellt Rechnung oder Gutschrift. Mit „Dismiss“ lehnen Sie sie ab, der Contract Review erhält den Status „Closed“, und das System erzeugt eine i155-Meldung. Die Aktionen sind nur im Status „Pending“ verfügbar.
6. Bei einer manuellen Freigabe entscheidet das System nach 30 Tagen automatisch. Bei einer Freigabe über einen Schwellenwert genehmigt das System den Eintrag automatisch, wenn der Schwellenwert über dem Zahlbetrag liegt.
7. Bei einem Kundenwunsch auf Minderkilometer-Ausgleich startet die Vertragsprüfung erst auf Anfrage des Kunden. Die Option „Contract Review“ steht im Statusmenü bereit. Sie bestätigen den Vorgang mit „Proceed“, der sich nicht rückgängig machen lässt. Ein Vertrag, für den die Prüfung berechnet wurde, lässt sich nicht erneut berechnen.

**Ergebnis und Systemstatus.** Nach der Prüfung setzt das System den Vertrag auf „Closed“ und übermittelt eine i155-Meldung mit Status 004. Die Historie enthält den Eintrag „Contract Review in Progress“, solange die Prüfung läuft. Die Zahlung nach einer Prüfung erfolgt über Revenue. Auf der Vertragsprüfung zeigt die Spalte „Preis/km“ den Preis, der im betreffenden Fall verwendet wurde.

**Besonderheiten je Rolle.** Die Operative Review Page zeigt MPC- und MO-Benutzern alle Verträge, die auf Genehmigung oder Ablehnung warten, sowie bereits bearbeitete Prüfungen. Fehlt der Kilometerstand, können sie den Vertrag weder genehmigen noch ablehnen, aber den Kilometerstand nachtragen.

**Besonderheiten je Sparte und Markt.** Es gibt getrennte Kilometerpreise für Mehr- und Minderkilometer. Die Vertragsprüfung gilt für Pkw und Vans. Bei Reifenprodukten und Kontingentprodukten löst das System die Prüfung beim Erreichen des geplanten Endes nicht aus. Der Zeitraum für Ausgleichszahlungen beträgt 90 Tage nach Vertragsende und lässt sich über die Markt-Konfiguration anpassen.

**Hinweise.** Ein Vertrag, der während einer Laufzeit mit einer Kundenvereinbarung vorzeitig beendet wird, unterliegt keiner Vertragsprüfung, wenn der Kunde die Beendigung wünscht. Die Vertragsprüfung zeigt die Rechnungsanforderung oder die Gutschrift an. Ein MDCR-Dokument durchläuft die Stufen Erstellt, Akzeptiert, Exportiert, FI-Dokument erstellt und Bezahlt beziehungsweise Mahnstufe. Die Statusübergänge folgen den bestehenden Regeln für Finanzdokumente. Der Export an das Finanzsystem erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. Dabei übergibt das System den Kundendokumenttyp „MDCR“, den Dokumentempfänger, die SAP-Debitorennummer, Netto-, Steuer- und Gesamtbetrag und die Steuerklassifizierung. Der Positionstext steht im Positionssatz, der Kopftext bleibt leer. Die Kundenbelege und Werkstattbelege sind in Tabelle und Detailseite sichtbar. Neue Belege lassen sich nicht erstellen, bestehende nicht bearbeiten, löschen oder korrigieren. Werkstattbelege lassen sich nicht stornieren und nicht an den Kunden weiterberechnen. Interne Kommentare an Finanzbelegen sind sichtbar, lassen sich aber nicht ergänzen.

**Fehlerbehebung.** Ein Vertrag mit einer Review-Zahlung von 0 läuft ab oder wird geschlossen. Verträge werden zuverlässig in den Status „Geschlossen“ überführt. Bei der automatischen Vertragsschließung zeigen Grund und „Geändert von“ die richtigen Angaben. Verträge scheitern nicht an einer ausstehenden Dokumentenprüfung. Das Kilometerfeld in der Operative Review Page zeigt die Laufleistung formatiert, und die Datumsangaben folgen einem einheitlichen Format.

Quellen: Batch 35.4, 47.4, 57.6, 71.4, 73.5, 83.6, 105.5, 125.3, 185.3, 771.2, 780.1, 793.1, 805.1, 806.4, 821.3, 827.4, 831.4, 832.1, 833.1, 833.3, 834.1, 946.1, 979.1, 848.1, 812.1, 826.1, 1 Batch 1, 827.4, 831.4

## 10.8 Änderungshistorie und Nachvollziehbarkeit

**Zweck.** Die Historie zeigt alle Änderungen eines Vertrags über seinen gesamten Lebenszyklus, einschließlich des alten und des neuen Werts und des Benutzers, der die Änderung vorgenommen hat. Sie erfasst zwölf Anwendungsfälle: Aussetzung, Reaktivierung, Kündigung, vorzeitige Beendigung, Ablauf nach Datum, Ablauf nach Laufleistung, Abschluss, Kurzzeit- und Langzeitverlängerung, Vertragsübertragung, Zahlerwechsel sowie Änderungen von Vertragsdaten nach der Aktivierung.

**Voraussetzungen.** Der Vertrag wurde zur Unterschrift versendet. Die Historie erscheint in der Vertragsübersicht über den Reiter „History“.

**Rollen.** Benutzer mit der Rolle Administrator können die i155-Datei aus der Historie herunterladen. Market Operations sehen die Historie ihrer Verträge. Prüfungen und Aktionen im Zusammenhang mit MO erfasst die Historie nicht.

**Schritt für Schritt.**

1. Öffnen Sie den Vertrag und wechseln Sie in den Reiter „History“.
2. Prüfen Sie die Spalten „Modified Object“, „Reason“, „Old Value“, „New Value“, „Date“, „Modified by“ und „Comment“. Fehlt ein Wert, erscheint „-“.
3. Sortieren Sie die Spalten. Die Anzeige umfasst 10, 20, 30, 40 oder 50 Einträge je Seite. Standardmäßig stehen die neuesten Änderungen oben. Oberhalb der Tabelle zeigt das System die Anzahl der Einträge an, etwa „Displaying 1 of 10 records“.
4. Öffnen Sie die Kategorien. Zusammengehörige Aktionen, etwa die Erstellung oder die Bestätigung eines Vertragsvorschlags, sind in einer Kategorie mit Start- und Enddatum gebündelt. Jeder Vorgang einer Verlängerung erhält eine eigene Kategorie.
5. Für den letzten Export nach VEGA zeigt die Zeile „Last export to VEGA“ Datum und Uhrzeit. Administratoren laden über den Zeitstempel die i155-Datei herunter, die zu diesem Zeitpunkt erzeugt wurde.

**Ergebnis und Systemstatus.** Die Tabelle „Contract History“ führt Statusänderungen nach der Aktivierung, Änderungen am Vertrag und den letzten Export an VEGA zusammen. Die Datumsspalte zeigt den Zeitstempel im Format JJJJ.MM.TT hh:mm:ss AM/PM UTC. Die Historie wird in einem fixierten Bereich angezeigt, dessen Einträge scrollbar sind. Kundenbezogene Änderungen zeigt die Historie als Eintrag mit einem Link zur Historie im Kundenmanagement. Änderungen mit Begründung speichert das System und zeigt sie im Änderungsprotokoll an.

**Besonderheiten je Rolle.** Benutzer mit der Rolle Administrator sehen den Zeitstempel des letzten Exports als Link. Bei einem manuell angestoßenen Batchlauf für die Schnittstelle i155 zeigt die Spalte „Geändert von“ die Benutzerkennung der auslösenden Person und nicht das System. Kundenänderungen sind im Kundenmanagement protokolliert.

**Besonderheiten je Sparte und Markt.** Das Datums- und Zeitformat folgt der UTC-Angabe der Historie. Die Kilometerangaben tragen die Markteinheit.

**Hinweise.** Der Schalter „Notification Required“ im Reiter „Communication“ im Bereich „Emails“ steuert den Versand der Vertragsbenachrichtigungen. Das Feld „Geändert von“ zeigt bei Verlängerungen die ausführende Person. Das Löschen von Vertragsdaten nach der DSGVO und die Kennzeichnung der Historie für Datenschutzzwecke sind im Kapitel Governance beschrieben. Alle Änderungen am Vertrag erhalten eine Versionierung, und die Historie zeigt sie an. Die Historie zeigt bei einer Verlängerung den Eintrag „Long Term Prolongation In progress“ mit dem auslösenden Benutzer.

**Fehlerbehebung.** Die Historie zeigt die Bezeichnungen „Waiting for Activation“ und „Close Terminated“ einheitlich. Der Grund für den Status „Suspended“ erscheint in der Historie. Das Entfernen eines Kennzeichens bei einem aktiven Vertrag erscheint in der Historie. Das Aktivierungsereignis erscheint nur einmal. Der Ablaufgrund zeigt den richtigen Grund. Die Historie wird für MO-Benutzer aktualisiert. Die Historie zeigt die Benutzerinformation und den Zeitstempel bei jeder Änderung.

Quellen: Batch 759.1, 791.1, 806.2, 808.1, 809.3, 811.1, 812.1, 821.1, 829.1, 830.7, 842.3, 850.2, 861.5, 908.4, 993.1, 1026.1, 1079.5, 1080.2, 799.2, 854.1, 1 Batch 1, 861.5

## 10.9 Laufleistung, Kilometerstandshistorie und Prognose

**Zweck.** Kilometerstände sind die Grundlage für die Vertragsprüfung, den Ablauf nach Laufleistung und die Prognose. Sie sehen die Kilometerstandshistorie im Reiter „Vehicle“, synchronisieren den Kilometerstand mit MIC, erfassen Kilometerstände manuell und berechnen eine Hochrechnung. Die Quellen der Kilometerstände sind DSB, MIC, VEGA und die Benutzerkennung bei manuellen Einträgen.

**Voraussetzungen.** Die Synchronisation mit MIC und die Hochrechnung stehen nur bei aktivem Servicevertrag zur Verfügung. Für die Prüfung eines Vertrags müssen Vertragsbeginn, Vertragsende, geplante Laufleistung, Kilometerstand bei Vertragsbeginn, Produkt, Kundentyp und Vertriebskanal vorhanden sein. Geprüft werden nur Verträge im Status „Active“ oder „Suspended“.

**Rollen.** MO und MPC synchronisieren den Kilometerstand, erfassen Werte manuell, berechnen die Hochrechnung und löschen manuelle Einträge. Beim Anlegen eines Vertrags erfasst das System den Kilometerstand automatisch. Händler und MO-Nutzer geben die Fahrgestellnummer ein, und das System ruft den Kilometerstand ab.

**Schritt für Schritt.**

1. Öffnen Sie den Reiter „Vehicle“ und prüfen Sie die Tabelle „Mileage History“. Der jeweils zuletzt importierte Eintrag steht oben. Jede Spalte lässt sich sortieren.
2. Klicken Sie auf „Get Mileage Information“, um den letzten bekannten Kilometerstand mit Datum aus MIC abzurufen. Der Eintrag erhält die Quelle „MIC“ und den Bearbeiter „System“. Ist MIC für das Fahrzeug nicht verfügbar, erscheint die Meldung „MIC is not available for this vehicle“, und die Historie bleibt unverändert.
3. Erfassen Sie einen Kilometerstand manuell, wenn MIC nicht verfügbar ist. Geben Sie das Datum der tatsächlichen Erfassung und den Kilometerstand ein. Der Wert muss größer sein als der Eintrag mit dem nächstniedrigeren früheren Datum und kleiner als der Eintrag mit dem nächsthöheren späteren Datum. Ein abgelehnter Wert wird nicht gespeichert. Gültige Einträge erhalten die Quelle „User“ und die Benutzerkennung.
4. Löschen Sie einen manuellen Eintrag über die Löschfunktion. Nach der Bestätigung der Abfrage „Are you sure? This action is irreversible.“ ist die Löschung endgültig. Einträge aus MIC, VEGA, Vertrag und Hochrechnung lassen sich nicht löschen.
5. Klicken Sie auf „Calculate Mileage Projection“, wenn keine aktuellen MIC-Daten vorliegen. Das System berechnet den Kilometerstand auf Basis des letzten bekannten Stands und des Vertragsbeginns. Der Höchstwert beträgt 9.999.999 km. Liegt keine Historie vor, erscheint die Meldung „Mileage Projection cannot be calculated because no historical mileage exists“.

Die Berechnung teilt den letzten bekannten Kilometerstand durch die Tage vom Vertragsbeginn bis zu seinem Datum und erhält so den theoretischen Tageswert. Den Tageswert multipliziert das System mit den Tagen bis zum Anfragedatum und rundet auf eine ganze Zahl. Beispiel: Der Vertrag beginnt am 1. April 2025 mit 0 km. Der letzte Stand von 12.500 km stammt vom 31. Januar 2026, die Anfrage erfolgt am 10. März 2026. Der Tageswert beträgt 41 km, und die Hochrechnung ergibt 14.063 km.

**Ergebnis und Systemstatus.** Die Hochrechnung speichert das System in der Historie mit Quelle „Projection“, Datum, Uhrzeit und der Benutzerkennung des ausführenden MO- oder MPC-Benutzers. Sie dient als Referenzwert und löst niemals ein Vertragsende aus. Auch ein Kilometerstand, der den geplanten Endstand erreicht oder übersteigt, beendet den Vertrag nicht. Der zuletzt bekannte Kilometerstand erscheint im Reiter „Vehicle“ als „Last Known Mileage (Km)/Date“.

Bei einem Import von Werkstattrechnungen über i156 aktualisiert das System den Kilometerstand im Vertrag mit Datum und Quelle VEGA. Überschreitet der Kilometerstand die geplante Gesamtlaufleistung, setzt das System den Vertrag auf „Expired“. Die i155-Meldung führt dann den Code 003.

Bei der Prüfung eines Vertrags, dessen letzter Kilometerstand älter als 30 Tage ist, erzeugt das System automatisch eine Hochrechnung und verwendet sie als Quelle „Projection“. Die tägliche geplante Laufleistung ergibt sich aus der Jahreslaufleistung geteilt durch 365. Die theoretische Laufleistung ist der Kilometerstand bei Vertragsbeginn plus die tägliche Laufleistung mal die vergangenen Tage. Die absolute Abweichung ist der erfasste Stand minus die theoretische Laufleistung, die prozentuale Abweichung ist die absolute Abweichung geteilt durch die theoretische Laufleistung. Beispiel: Ein Vertrag beginnt am 2. Januar 2025 mit 10.000 km bei 20.000 km Jahreslaufleistung. Am 14. Februar 2026 liegt ein Stand von 40.000 km vor. Die theoretische Laufleistung beträgt 32.356 km, die Abweichung 7.644 km, also 24 %. Bei einer Toleranz von 20 % liegt die zulässige Abweichung bei 6.471 km.

**Besonderheiten je Rolle.** MO und MPC erfassen und löschen manuelle Kilometerstände. Händler erhalten den Kilometerstand beim Anlegen eines Vertrags automatisch, können ihn bei Bedarf aber manuell eintragen. Bei einem manuellen Wert, der kleiner ist als der zuletzt erfasste, zeigt das System eine Fehlermeldung.

**Besonderheiten je Sparte und Markt.** Die Einheit richtet sich nach der Markteinstellung. Der Code 0 steht für Kilometer, der Code 1 für Meilen. Liegen nur Meilen vor, rechnet das System in Kilometer um und rundet auf die nächste ganze Zahl, sodass 100 Meilen als 161 km gespeichert werden. Der Kilometerstand gilt für Pkw und Vans.

**Hinweise.** Beim Anlegen eines Vertrags ruft das System den Kilometerstand zur Fahrgestellnummer automatisch ab. Die Erfassung des Kilometerstands beschreibt Kapitel 5.3. Der Zeitpunkt der Abfrage ist im Klärungsbedarf erfasst. Der Kilometerstand bei Vertragsbeginn ist in der i155-Datei 0, und die geplante Endlaufleistung ergibt sich aus dem Startstand plus Laufzeit mal Jahreslaufleistung. Bei Produkten ohne FRD-Bezug gilt der erfasste Kilometerstand als Kilometerstand zum Verkaufsdatum und als Kilometerstand bei Vertragsbeginn. Bei der Rechnungserstellung darf der Kilometerstand nicht über 999.999 liegen und nicht unter dem zuletzt bekannten Stand. Veraltete Laufleistungsdaten können zu falschen Abweichungen führen, dann greift die Hochrechnung. Fehlen Laufleistungsdaten, überspringt das System den Vertrag bis zum nächsten Prüfzyklus. Die Meldung zum letzten dokumentierten Service nennt den Wert und die Einheit des Services sowie den eingegebenen Wert.

**Fehlerbehebung.** Das Feld „Laufleistung“ nimmt keine Buchstaben und keine Sonderzeichen an. Das Feld „Fahrgestellnummer“ zeigt Buchstaben ausschließlich als Großbuchstaben. Die Anzeige des Tausendertrennzeichens folgt dem Format 10.000. Die Meldung zum letzten Service zeigt den Wert statt eines leeren Feldes. Die geplante Endlaufleistung in der i155-Datei entspricht dem Startstand plus Laufzeit mal Jahreslaufleistung, sodass die Erzeugung der Datei nicht mehr an einer zu kleinen Endlaufleistung scheitert. Das Vertragsende nach Laufleistung wird aus dem Kilometerstand der Claims ermittelt.

Quellen: Batch 2.1, 16.2, 17.3, 763.1, 763.3, 763.4, 763.5, 763.6, 768.2, 768.5, 768.7, 807.1, 810.1, 799.2, 824.3, 825.3, 825.5, 979.1, 987.2, 1000.1, 1019.1, 1056.4, 1061.5, 1082.2, 1090.2, 1095.4, 1183.4, 1194.2, 1196.4, 1257.6, 833.3, 795.4, 1 Batch 1, 1000.1

## Verschiebung in andere Kapitel

| Zielkapitel | Batch-Verweis | Inhalt |
|---|---|---|
| 2.2 Fachliche Rollen und technische Berechtigungen | 762.1 | Berechtigung des MPC im Markt SK auf Batch-Jobs anderer Märkte |
| 2.6 Sicherer Umgang mit Benutzerkonto und Sitzung | 1102.5 | Nutzungsbedingungen beim ersten Login als Pop-up mit Scrollpflicht |
| 3.1 Startseite und Menü | 1106.4 | Link „Terms of Use“ im Footer neben „Privacy Policy“ |
| 4.7 Partner- und Dealerbeziehungen | 594.1 | Automatische Aktualisierung der Händlerdaten bei Eigentümerwechsel |
| 5.3 Fahrzeugdaten, Pflichtfelder und Validierungsregeln | 1000.1, 17.3, 1019.1, 1056.4, 1082.2, 979.1 | Ermittlung und Erfassung des Kilometerstands bei der Vertragserstellung |
| 5.5 Laufzeit, Laufleistung und Optionen konfigurieren | 1061.5, 1183.4 | Laufleistungsvalidierung im Vertragsvorschlag und Auswahl der Matrixwerte |
| 6.2 Vertragsdaten und Pflichtfelder erfassen | 876.1, 971.1 | Vertragsstart bei Garantieverlängerungen und Klassifizierung FRD und nicht FRD |
| 7.4 Vertragsdokumente und Sprachvarianten | 372.1 | Standardisierte Schreiben für Antrag, Anpassung, Suspendierung und Vertragsende |
| 8.5 Automatische und manuelle Aktivierungsvarianten | 423.3, 496.5 | Inhalt der Aktivierungs- und Bestätigungs-E-Mail |
| 9.8 Contract Review: Profile und Übersicht | 1216.2, 1216.3, 768.6, 768.2 | Profilanlage, Übersichtsseite und Regular Review |
| 12.5 Dealer-Zuordnung und Weiterbearbeitung | 1184.5, 959.8 | Anfragen zu Laufzeit und Laufleistung sowie beantwortete Konditionen |
| 12.9 Massenanlage und Validierung von Fahrzeuglisten | 935.7 | Group ID bei Massenverträgen |
| 14.2 Marktspezifische Einstellungen | 1103.4 | Umbenennung „Proposal Validity (Days)“ in der Markt-Konfiguration |
| 14.4 Vorlagenverwaltung und Template Management | 408.3, 424.2, 470.1, 491.2, 492.1 | Anlage von E-Mail-Vorlagen für Verlängerung, Übertragung, Reaktivierung und Kündigung |
| 14.8 Produktdefinition, Anlage und Veröffentlichung | 899.6, 971.1, 1195.1, 1213.2, 1239.1, 1239.4, 876.1 | Produktkonfiguration für Verlängerung, Anzahl Services, Vertragsprodukte und Fahrzeugvoraussetzungen |
| 14.9 Preisversionen, Cluster und Faktorgrenzen | 1257.3, 1224.6, 1246.1 | Dependency Definition des Industry Price Factors, Schritt 4 der Preismatrix und Bereiche der Preismatrix |
| 16.1 Datenschutz und sichere Beispieldaten | 993.1, 759.1 | Automatische Bereinigung nicht aktivierter Verträge und Löschkonzept |
| 16.4 Testnachweise und produktiver Funktionsstand | 1285.1, 779.3 | Testabdeckung und Architekturvorhaben |
| 19.9 VEGA – Vertrag, Coverage und Claim | 156.5, 855.1, 1080.2, 1026.1, 789.1 | Schadencodes, Datenmodell, i155-Erzeugung, Fehlerbehandlung und Vertragstyp-Umstellung |
| 19.18 Weitere Systeme und Dienste | 321.6 | ISP Data Product und Divisions-Zuordnung |
| 19.19 Datenplattformen und Reporting | 307.2, 837.1 | Feld expiry_criterion und Übergabe an OpenSearch |
| 19.21 Technische Integrationswege | 270.2, 270.3, 1230.2, 1095.4, 1194.2, 755.1 | Vertragsereignisse, JSON-Daten, Anfrageparameter, MBLD-Parameter und Service API |
| 20.3 Lokale Produkte, Preise und Kampagnen | 1085.1 | Steuersätze mit Nachkommastellen für Märkte wie die Schweiz |

## Klärungsbedarf

**Widersprüche im Material.**

- Zeitpunkt der Kilometerstandsabfrage bei der Vertragserstellung: Batch 1000.1 und 1019.1 beschreiben den Abruf bei Eingabe der Fahrgestellnummer. Batch 17.3 und 987.2 beschreiben den Abruf erst nach der Unterschrift oder Bestätigung.
- Kilometerstand bei Vertragsbeginn: Batch 861.4 nennt im MVP den Wert 0. Batch 1090.2 übernimmt bei Produkten ohne FRD-Bezug den erfassten Stand. Batch 987.2 übernimmt den eingegebenen Wert.
- Vertragsbeginn und Verkaufsdatum: Batch 837.1 setzt den Vertragsbeginn auf das Erstellungsdatum und das Verkaufsdatum auf die Unterschrift. Batch 971.1 setzt den Vertragsbeginn bei FRD-Produkten auf das FRD, Batch 1090.2 setzt das Verkaufsdatum auf das Erstellungsdatum und Batch 1195.1 auf das Kaufdatum.
- Vertragsbeginn bei Garantieverlängerungen: Batch 876.1 setzt den Beginn auf FRD plus Warranty Duration plus 1 Tag. Die Auswirkungen auf Revenue, Reporting und CAC sind laut Material noch zu bestätigen.
- Real Mileage at Contract End: Batch 861.4 berechnet den Wert aus Jahreslaufleistung mal Laufzeit. Batch 825.5 lässt den Wert bei aktiven Verträgen leer und nutzt bei Ablauf die Prognose. Batch 833.3 nutzt den Wert aus MIC.
- Contract Duration (Real): Batch 861.4 zeigt die tatsächliche Laufzeit gleich der geplanten Laufzeit. Batch 837.1 zeigt „-“ bei aktiven und ausgesetzten Verträgen. Batch 825.4 nennt das Format „12 Months/4 Months“.
- Vertragsbeginn bei Ablauf: Batch 1090.2 und 1195.1 weichen von den Angaben zu FRD-Produkten ab.
- Zahlungsintervall bei Verlängerungen: Batch 820.2 und 821.2 erlauben nur „Monatlich“. Batch 830.3 bietet „OneTime“ und „Monthly“ an, Batch 834.2 unterstützt Einmalzahlung bei Kurzzeitverlängerungen, Batch 254.2 nennt die Oberfläche als nur monatlich auswählbar, Batch 793.1 schließt Einmalzahlung im deutschen Markt aus.
- Zahlungsintervall ändern: Batch 849.1 erlaubt Market Operations und MPC die Umstellung von „Monthly“ auf „One Time“. Batch 838.3 schließt MPC davon aus.
- Rolle MPC bei Aussetzung und Beendigung: Batch 802.1, 787.2 und 780.1 nennen MO und MPC. Batch 830.2 und 856.1 nennen Market Operations. Batch 838.3 schließt MPC aus.
- Übertragung und Zahlungsart: Batch 847.1 setzt eine vollständige Einmalzahlung voraus, Batch 813.1 nennt die Übertragung unabhängig von der Zahlungsart.
- Datum der Übertragung: Batch 813.1 und 820.1 erlauben nur Daten in der Zukunft, Batch 847.1 erlaubt Daten zwischen Vertragsbeginn und Vertragsende.
- Angaben bei der Übertragung: Batch 813.1 nennt drei Schritte, ein Kennzeichen als Pflicht und einen Kommentar bis 500 Zeichen. Batch 847.1 nennt zwei Schritte, ein optionales Kennzeichen und einen Kommentar bis 300 Zeichen.
- Signaturart bei Übertragung und Zahlerwechsel: Batch 797.1 nennt ausschließlich die DSS-Signatur per SMS. Batch 813.1 und 824.4 nennen digitale und manuelle Signatur sowie eSignature On-Premise oder DSS.
- Dokumenttypen beim Upload: Batch 797.1 nennt „Novation Document“, „SEPA“ und „Prolongation“. Batch 794.1 listet „Service Contract + SEPA Mandate“, „Terms and Conditions“, „SEPA Document“, „Vehicle Registration Document“, „Company Registration“, „Tax Exempt Certificate“ und „Other Documents“ und entfernt „Novation Document“.
- Löschbarkeit von Dokumenten: Batch 752.1 beschreibt Service-Vertrag, Langzeitverlängerung, SEPA, AGB und Zahlungsplan als nicht löschbar und sonstige Dokumente als löschbar. Batch 789.1 prüft die Signatur nur bei SEPA-Dokumenten.
- Stornierungsfrist: Batch 804.1 nennt eine feste Pufferzeit von fünf Arbeitstagen. Batch 756.1 beschreibt eine konfigurierbare Pufferzeit mit Standardwert sieben Arbeitstagen, das zugehörige Ticket ist geschlossen.
- Blockade der Stornierung: Batch 804.1 und 770.2 nennen einen offenen Schadensfall. Batch 823.2 und 825.2 nennen eine aktive VEGA-Werkstattrechnung.
- Stornierungsfrist ab Aktivierung: Batch 813.1, 823.2 und 825.2 nennen 14 Tage. Batch 804.1 nennt die Frist aus den Markteinstellungen.
- Mehrfache Stornierung und Kündigung: Batch 827.1 nennt das gleichzeitige Kündigen mehrerer Verträge. Batch 823.2 und 825.2 erlauben nur einen einzelnen Vertrag. Batch 834.3 beschreibt das Kündigen mehrerer Verträge desselben Kunden.
- Process Indicator in RC05, Position 62: Batch 1080.2 setzt immer den Wert 1. Batch 823.2 und 825.2 setzen 2 bei einer Stornierung innerhalb von 14 Tagen.
- Vega-Code bei regulärem Ablauf: Batch 856.2 nennt den Status 101. Batch 833.1 nennt 003 für den Ablauf nach Datum und 810.1 nennt 003 für den Ablauf nach Laufleistung.
- Rückdatierung der vorzeitigen Beendigung: Batch 833.2 erlaubt nur den heutigen Tag. Batch 843.2 untersagt die Rückdatierung. Batch 831.1 und 835.2 erlauben für Deutschland bis zu drei Monate. Batch 792.1, 788.5 und 786.5 erlauben bis zu 90 Tage zurück mit unterschiedlichen Untergrenzen. Batch 831.1 erlaubt zusätzlich Daten in der Zukunft.
- Statusbezeichnung nach vorzeitiger Beendigung: „Early Terminated“ (Batch 792.1), „Terminated“ (Batch 855.4), „Close Terminated“ (Batch 850.2).
- Gründe für die vorzeitige Beendigung: Batch 855.4 enthält „Transfer“, Batch 843.2 entfernt „Transfer“. Batch 824.4 nennt „Customer Request“ und „Other“.
- Vertragsprüfung nach vorzeitiger Beendigung: Batch 792.1 verlangt eine manuelle Vertragsprüfung. Batch 812.1 führt keine Vertragsprüfung mehr durch. Batch 819.3 bietet bei Minderlaufleistung „Request review“ an. Batch 806.4 nennt keine Prüfung bei Wunsch des Kunden.
- Kontingentprodukte und Ablauf: Batch 800.2 und 976.9 nennen den Ablauf bei Verbrauch aller Leistungen. Batch 856.2 und 855.4 nennen Kontingentabläufe als nicht im MVP. Batch 806.4 löst die Prüfung bei Kontingent nicht aus.
- Laufleistung bei Kurzzeitverlängerung: Batch 774.1 nennt die Markteinstellung mit Standard „Extend Mileage“. Batch 839.1 bleibt die Gesamtlaufleistung gleich und die Jahreslaufleistung wird neu berechnet. Batch 782.1 erhöht die Gesamtlaufleistung anteilig. Batch 793.1 erhöht die Gesamtlaufleistung nach dem Verhältnis von neuer und alter Laufzeit.
- Kurzzeitverlängerung bei MBLD: Batch 787.2 schließt sie für MBLD aus. Batch 774.1 nennt MBLD als Nutzer über die API. Batch 1150.3 bietet bei „Prolongate“ immer beide Optionen an.
- Kurzzeitverlängerung in der Produktivumgebung: Batch 796.1 und 793.1 nennen sie in der Produktivumgebung als deaktiviert. Batch 839.1 und 1150.3 beschreiben sie als verfügbar.
- Mindestlaufzeit der Langzeitverlängerung: Batch 830.1 nennt mindestens zwölf Monate. Batch 1224.6 nennt einen Mindestwert von 6 Monaten in der Preismatrix. Batch 830.3 zeigt Laufzeiten ab 24 Monaten.
- Preisversion der Langzeitverlängerung: Batch 1213.1 nennt die ursprüngliche Preisversion für Verlängerungen. Batch 1273.4 nennt die jeweils neueste Preisversion. Batch 1213.2 bietet eine Auswahl zwischen „original“ und „new“.
- Negative Beträge: Batch 776.1 nennt negative Raten als unzulässig. Batch 1167.1 nennt negative Preise als möglich. Batch 1139.1 setzt negative Ergebnisse auf 0.
- Vertragsanpassung und Reduzierung: Batch 123.1 beschreibt die Reduzierung für MBLD mit dem Status der Umsetzung als offen und nur Verlängerung vorhanden. Batch 1139.1 beschreibt Konfiguration und Ablauf „Contract Adaptation“. Batch 830.7 nennt die Reduzierung als nicht berücksichtigt und verweist auf die Early Termination.
- Benachrichtigung bei Aussetzung: Batch 854.1 versendet bei „Ausgesetzt“ keine E-Mail. Batch 794.1 versendet eine Suspendierungsvorlage bei abgelaufener Kreditkarte. Batch 845.1 versendet bei Mahnstufe 3 eine E-Mail, Inhalt und Nennung der Mahnstufe sind offen.
- Vorlage bei Reaktivierung: Batch 854.1 nennt die Aktivierungsvorlage. Batch 491.2 und 794.1 nennen eine Reaktivierungsvorlage.
- Zahlungslink: Batch 160.3 beschreibt am 14. Tag eine automatische Stornierung und im selben Absatz eine Aussetzung.
- Provision: Batch 848.1 zeigt die Händlerprovision als Platzhalter mit 100 EUR, Berechnungslogik offen. Batch 826.1 und 812.1 beschreiben die ermittelte Provision.
- Historie und Kilometerquellen: Batch 807.1 nennt DSB, MIC, VEGA und die Benutzerkennung. Batch 1196.4 nennt DSB, Warranty and Goodwill, VEGA-Claims und manuelle Werkstattrechnungen, VEGA-Claims und manuelle Rechnungen sind laut Material noch nicht angebunden. Batch 763.3 nennt MIC als Quelle mit Bearbeiter „System“.
- Operative Review Statuses: Batch 834.1 nennt „Approved“, „Dismissed“, „Pending“, „Waiting for Customer Request“ und „TBD“. Batch 831.4 nennt „Approved“ und „Pending“. Batch 768.6 nennt für das Regular Review „Pending“, „Acknowledged“, „Customer Notified“ und „Prolongation Offer Sent“.
- Expiry Kriterium und Prognose: Batch 825.5 übernimmt bei Vertragsablauf den Prognosewert als tatsächlichen Stand, wenn keine MIC-API verfügbar ist. Batch 2.1 und 763.6 verwenden die Prognose ausschließlich als Referenzwert.
- Zahlungsreferenz und Dokumentenprüfung: Batch 793.1 ist die Angabe zur Dokumentenprüfung nicht eindeutig.
- Steuerfeld und Statusbezeichnung: Batch 850.2 nennt die i155-Position RC05 140 bis 147 als Datum der Statusänderung, Batch 792.1 nennt sie als Datum der Auslösung.
- Rollen und Benutzerbezeichnungen in Benachrichtigungen: Batch 414.1 nennt „Changing payer for Holder“ und „Changing payer for Payer“, Batch 794.1 nennt „Change Payer For Holder“ und „Change Payer For Payer“.
- Zuständigkeit für die Vertragsübertragung: Batch 835.1 untersagt die Rolle Dealer. Batch 847.1 nennt Market Operations, Batch 813.1 nennt Market Operation. Die Rolle MPC ist nicht genannt.
- Vertragsänderung ohne Statusänderung: Batch 750.1 beschreibt die versionsbasierte Sperre. Die Reaktion der Oberfläche bei gleichzeitiger Bearbeitung ist noch nicht abgestimmt.
- Vertragsanpassung mit Verkürzung: Batch 765.6 vermerkt, dass offen ist, ob eine Verkürzung immer die aktuellen Werte verwendet.
- Rollen im Vertragsmanagement: Batch 861.1 und 859.1 nennen Power User, die Zielgruppe und die Rollendefinition sind nicht bestätigt.
- Mehrere Felder mit Versionierung: Batch 861.5 erlaubt die Bearbeitung der jährlichen Fahrleistung, des Kilometerstands bei Vertragsbeginn, der tatsächlichen Fahrleistung, der Start- und Enddaten und der tatsächlichen Laufzeit erst nach dem MVP. Batch 849.1 erlaubt die Bearbeitung von Kilometerstand bei Vertragsbeginn und Startdatum im MVP.
- Zahlerwechsel und Transfer, Zuständigkeit für Dokumente: Batch 797.1 verlangt für die Verlängerung ein Dokument mit DSS. Batch 820.1 zeigt die Schaltfläche „Change Payer“ nicht für Gewerbekunden.
- Aussetzung der Langzeitverlängerung: Batch 780.1 beendet eine laufende Verlängerung automatisch bei Aussetzung, Early Termination oder Ablauf. Batch 777.6 und 778.2 beschreiben den Abbruch der Verlängerung vor einer Aussetzung.
- Export des Vertrags: Batch 845.1 nennt die Funktion des Export-Buttons als im Einsatz, ohne Angaben zur Funktionsweise.
- Angebotsverwaltung mit Verlängerung für Management-Verträge und Van-Reifen: Batch 766.2 nennt die Themen als offen ohne Inhalt.

**Eingestellte, geschlossene oder abgebrochene Meldungen.**

- Batch 756.1: Abbruch des Vorhabens „Änderung der Bezahlmethode abbrechen“ mit Einstellung der Meldung. Das Ticket zur Pufferzeit der Widerrufsfrist ist geschlossen. Weitere Tickets sind ohne Umsetzung geschlossen oder abgebrochen.
- Batch 790.1: Die Sperre gegen parallele Aktionen, die Korrektur doppelter Protokolleinträge bei der Aktivierung, die Behebung eines Zugriffsfehlers bei getContractsV2 und die Analyse zu fehlenden Auftragsnummern bei Van-Verträgen sind eingestellt.
- Batch 766.2: Die Integration von MIC und „Get Mileage“ in die Vertragsverwaltung (nur PROD) ist abgebrochen.
- Batch 818.4: Die geplante Anpassung der Kilometerstandsermittlung bei vorzeitiger Beendigung, Eigentumsübertragung und Vertragsprüfung ist abgebrochen.
- Batch 901.2: Das Thema „Get Real Vehicle Mileage (MIC Part 1)“ ist abgebrochen, ohne Inhalt.
- Batch 1166.2: Der Umschalter in der Preismatrix für Preis pro Kilometer ist abgebrochen, ohne Informationen.
- Batch 1285.1: Die Meldung zu CrowdIn „Customer and Operations Communication“ ist abgebrochen.
- Batch 141.4: Der Fehlerhinweis, dass DD, SCOM und SDAS nach einer vorzeitigen Beendigung nicht storniert werden, ist abgebrochen.
- Batch 144.1: Die Regeln für Rechnungen bei Vertragsende haben den Status „Cancelled“. Sie sind als Zielbild beschrieben und nicht als Funktion.
- Batch 773.1: Die langfristige Verlängerung für Nicht-FRD-Produkte hat den Status „Cancelled“.
- Batch 775.1: Die Zusammenarbeit von kurz- und langfristiger Verlängerung hat den Status „Cancelled“.
- Batch 767.1: Die Vorhaben „Aktualisierung des FRD-Prozesses für aktive Verträge“ und „Plausibilitätsprüfung der Fahrzeug-Endlaufleistung“ sind „Cancelled“. Die Erweiterung der Abschlussprüfung für Laufleistungsabläufe ist im Status „Offen“.
- Batch 808.1: Die Langzeitverlängerung mit Kampagne ist als Vorhaben im Status „Offen“ beschrieben. Übermittlung an die Fakturierung und Darstellung sind nicht abschließend geklärt.
- Batch 784.1: Das Thema „Change of Payment Method“ ist offen.
- Batch 372.1: Die standardisierten Schreiben sind laut Material nicht fertiggestellt, die E-Mail-Vorlage ist in der Prüfung.
- Batch 752.1: Die Kündigung auf Basis des Schadenservice-Typs „12“ ist offen. Der fehlende Ablauf-Eintrag im Historien-Tab und die nicht bereitgestellte Reifenoption sind abgebrochen. Die Themen „Suspension: Manuell vs. Automatisch“ und „Contract Transfer Revival“ sind offen.
- Batch 754.3: Die Eingabe der Laufleistung im Dialog vor den Pflichtfeldern ist als Vorhaben beschrieben.
- Batch 779.3: Die Erweiterung der Tests für Sperrung und Reaktivierung für Commercial Customer ist offen.
- Batch 793.1: Die Anpassung der Health-Check-Funktion für mehrere Instanzen ist offen.
- Batch 15.1: Die Produktsuche beim Anlegen eines Vertrags ist als behobene und geschlossene Meldung beschrieben. Das Verhalten steht in Kapitel 5.
- Batch 766.2 und 751.2: Die Vorhaben zu „Limited / Unlimited Tire“, zu Produkten mit zwei Basispreistabellen und zu komplexen Optionen sind offen ohne Inhalt.
- Batch 185.4: Die Szenarien für Vertragsanpassungen bei gewerblichen und privaten Verträgen sind überwiegend offen. Das Grundszenario für Gewerbe befindet sich in der Prüfung.
- Batch 1 Batch 1: Die Vertragsprüfung und Ausgleichsfunktion für Kulanz sind laut Material noch offen und mit Vorlagen ohne Inhalt versehen.
- Batch 1257.6 und 1183.4: Keine Klärung, nur Sammelhinweise.

**Sammelmeldungen ohne eigenständigen Handbuchinhalt.** Die folgenden Release-Zusammenfassungen enthalten keine beschreibbaren Funktionen: Batch 757.4, 769.1, 754.1, 823.1, 818.2, 818.3 (offene Prüfpunkte zur Historie), 839.2 (behobene Fehler ohne Sollverhalten), 1 Batch 1. Die Historie-Prüfpunkte aus Batch 818.3 sind offen.

**Weitere offene Punkte.**

- Batch 19.3: Die Angabe „Mileage Indicator“ ist ohne Funktionsbeschreibung.
- Batch 855.1: Das Datenmodell des Vertrags ist im MVP-Umfang beschrieben. Die Zuordnung zu Kapitel 19 ist offen.
- Batch 1102.6: Die Kennzeichnung der Einstellung für Dokumentdruck bei der Vertragsübertragung ist ohne Ausprägung.

## Vorschläge zur Gliederung

- Unterkapitel 10.5 in fünf Teile gliedern: 10.5.1 Kurzzeitverlängerung, 10.5.2 Langzeitverlängerung mit Konfiguration und DSS, 10.5.3 Folgeangebot und Gültigkeit, 10.5.4 Preisberechnung mit Sonderfall und MBLD, 10.5.5 Vertragsanpassung und Reduzierung. Das Material enthält für jeden Teil eigene Abläufe und Ausnahmen.
- Neues Unterkapitel „10.3a Dokumente nach der Aktivierung“, da der Upload von Vertragsdokumenten für Übertragung, Zahlerwechsel und Verlängerung ein eigener Prozess mit Validierung ist.
- Neues Unterkapitel „10.4a Zahlungsprobleme und automatische Aussetzung“ mit Mahnstufe 3, Kreditkarte und Zahlungslink. Diese Abläufe sind bisher im Unterkapitel 10.4 zusammengefasst.
- Neues Unterkapitel „10.6a Stornierung vor und nach Aktivierung“, um die unterschiedlichen Voraussetzungen klar zu trennen.
- Neues Unterkapitel „10.10 Massenaktionen über mehrere Verträge“, da Aussetzen, Reaktivieren, vorzeitige Beendigung und Stornierung sowie die Gruppen-ID hier gemeinsam beschrieben werden können.
- Neues Unterkapitel „10.11 Vertragsstatus und zulässige Aktionen“, da die Ermittlung der verfügbaren Aktionen und die Statusbezeichnungen über mehrere Unterkapitel verteilt sind.
- Neues Unterkapitel „10.12 Folgevertrag nach Ablauf“, da das Material dazu keine Quellen enthält und der Begriff in der Gliederung erwartet wird.
- Die Kilometerstandsabfrage bei der Vertragserstellung sollte in Kapitel 5.3 mit einem Verweis aus 10.9 beschrieben werden. Die Abläufe in 10.9 sollten sich auf Historie, Synchronisation, Hochrechnung und Prüfung beschränken.
- Die Contract-Review-Übersicht (Regular Review, Operative Review Page, Profile) sollte vollständig in Kapitel 9.8 stehen. Kapitel 10.7 behält die Endabrechnung.

---

Hinweis zur Prüfung: Die Verbots-Prüfung, die Batch-Abdeckung und die Zeichenzahl sind in der Abschlussprüfung dokumentiert.
