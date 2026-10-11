# 8 Antrag verfolgen und aktivieren

Dieses Kapitel beschreibt den Weg eines gespeicherten und unterschriebenen Antrags bis zum aktiven Servicevertrag. Sie finden Anträge in der Antragsverwaltung, lesen den Status und die zulässigen Übergänge, ergänzen fehlende Fahrzeugdaten und Dokumente, kennen die Voraussetzungen der Aktivierung und reagieren auf Ablehnung, Verzögerung und Wiederaufnahme. Beteiligt sind der Dealer, der den Antrag verfolgt und Daten nachreicht, Market Operations (MO) und MPC, die prüfen, freigeben und aktivieren, sowie das System, das bei vollständigen Daten und erfolgreichen Prüfungen automatisch aktiviert. Die fachlichen Prüfungen selbst (MO Checks) beschreibt Kapitel 9; die Verwaltung aktiver Verträge beschreibt Kapitel 10.

## 8.1 Anträge suchen, filtern und verfolgen

**Zweck.** Die Antragsverwaltung (Proposal Management) im Bereich „Vertragserstellung“ (Contract Generation) zeigt alle Anträge, die noch nicht aktiviert sind. Sie verfolgen dort den Status eines Antrags, öffnen die Vertragsübersicht und führen die Aktionen aus, die der jeweilige Status zulässt.

**Voraussetzungen.** Der Antrag ist gespeichert und trägt eine Referenznummer (Kapitel 6.7). Für die Aktivierung ist der Antrag zusätzlich unterschrieben (Kapitel 7).

**Rollen.** Dealer sehen die Anträge ihres Betriebs. MO und MPC sehen darüber hinaus Leasingverträge, die Mercedes-Benz Leasing Deutschland (MBLD) über die Edge-Schnittstelle anlegt; diese erscheinen in der Antragsverwaltung mit dem Status „Created“. Dealer sehen Leasingverträge in keiner Ansicht und können für sie keine Aktionen ausführen. Ohne Berechtigung für die Antragsbearbeitung sehen Sie Anträge nur lesend: Aktionsschaltflächen, Dokumentenupload, E-Mail-Versand und die Bearbeitung von Antragsdaten und Kennzeichen stehen dann nicht zur Verfügung (Kapitel 2.2).

**Schritt für Schritt.**

1. Klicken Sie unter „Vertragserstellung“ auf „Antragsverwaltung“.
2. Geben Sie die Referenznummer ein oder grenzen Sie die Liste über die Filter nach Status, Datum und Kunde ein. Die Filterfelder wirken erst, wenn Sie die Suche ausführen.
3. Öffnen Sie den Antrag über die Vertragsnummer. Es öffnet sich die Vertragsübersicht (Contract Overview) mit den Reitern für Vertrag, Fahrzeug, Kunde, Produkt, Zahlung, Dokumente, Kommunikation und Historie.
4. Fahren Sie in der Liste mit dem Schieberegler nach rechts zur Spalte „Aktionen“ und klicken Sie auf „…“. Das System bietet nur die Aktionen an, die für den aktuellen Status zulässig sind, zum Beispiel „Aktualisieren“ für fehlende Fahrzeugdaten (Kapitel 8.3) oder „Status“ für einen Statuswechsel (Kapitel 8.5 und 8.7).

**Filter „Alle OK“.** Der Filter „Alle OK“ zeigt Verträge, deren Prüfungen ausschließlich den Status OK oder „nicht zutreffend“ haben. Er gilt für den gesamten Statusumfang der Übersicht, also auch für Verträge im Status „Active“ und „Suspended“. So prüfen Sie zum Beispiel für ein Audit, ob die Prüfungen eines bereits aktivierten Vertrags weiterhin vollständig in Ordnung sind, ohne die Ansicht zu wechseln. Ohne diesen Filter blendet die Standardansicht Verträge mit ausschließlich erfolgreichen Prüfungen aus, unabhängig davon, ob sie aktiviert sind.

**Zweiter Einstieg für MO.** Market Operations erreichen die Vertragsübersicht eines noch nicht aktivierten Vertrags auch über die Oberfläche der Verifikationsprüfung („MO Checks Verification“, Kapitel 9), indem sie dort auf die Vertragsnummer klicken.

**Hinweis.** Mit der Aktivierung verlässt der Vertrag die Antragsverwaltung und die Verifikationsprüfung. Sie finden ihn danach auf der Startseite des Vertragsmanagements (Contract Management, Kapitel 10.1).

Quellen: Batch 871.5, 1134.4, 1021.1, 1021.2, 751.1, 864.1, 863.1, 873.1

## 8.2 Statusübersicht und zulässige Übergänge

**Zweck.** Der Vertragsstatus zeigt, an welcher Stelle des Prozesses ein Antrag steht und welche Aktionen möglich sind. Die Oberfläche fragt für jeden Vertrag ab, welche Aktionen im aktuellen Status zulässig sind, und bietet nur diese an. Die vollständige Übergangsmatrix finden Sie in Anhang D.

**Status vor der Aktivierung.**

- „Created“ (Erstellt): Der Antrag ist angelegt und trägt eine Referenznummer. Dealer und MO können alle bis zur Übersicht erfassten Angaben ändern, weil der Kunde noch nicht unterschrieben hat (Kapitel 8.3). Angebotsdokumente tragen in diesem Status das Wasserzeichen „DRAFT“.
- „Waiting for Confirmation“ (Wartet auf Bestätigung): Der Signaturprozess ist gestartet. Mit diesem Status beginnt die Angebotsgültigkeit (Kapitel 8.7).
- „Confirmed“ (Bestätigt): Der Kunde hat den Vertrag bestätigt beziehungsweise unterschrieben. Das System fragt die Kundenprüfung (TRACS) an (Kapitel 8.4). Änderungen, die Preis oder Abstimmung mit dem Kunden betreffen, sind ab hier nicht mehr möglich.
- „Waiting for Activation“ (Wartet auf Aktivierung): Der Aktivierungsprozess ist gestartet, aber nicht beendet. Das System wartet auf Ergebnisse, etwa die SAP-Debitorennummer aus dem Finanzsystem oder die Entscheidung von Market Operations zu einer auffälligen Prüfung.

**Ergebnisstatus.**

- „Active“ (Aktiv): Alle Voraussetzungen sind erfüllt, der Vertrag ist aktiviert (Kapitel 8.6).
- „Rejected“ (Abgelehnt): Der Antrag ist abgelehnt, durch den Kunden, durch MO oder MPC oder automatisch durch das System. Dieser Status ersetzt die früheren Bezeichnungen „Declined“ und „Cancelation by market operations“; die Aktion heißt „Reject“. Nach einer Ablehnung sind keine weiteren Schritte möglich, mit Ausnahme der Wiederaufnahme durch MPC oder MO in definierten Fällen (Kapitel 8.7).

**Status nach der Aktivierung.** Ein aktiver Vertrag kann in „Suspended“ (ausgesetzt, Kapitel 10.4), „Cancel“ (Stornierung innerhalb von 14 Tagen nach der Aktivierung, Kapitel 10.6), „Terminated“ (vorzeitig beendet) oder „Expired“ (abgelaufen nach Datum, Laufleistung oder Kontingent) wechseln. Aus „Expired“ und „Terminated“ wechselt der Vertrag nach einer Wartezeit von 30 Tagen, in der die Endabrechnung erfolgt, automatisch in den einheitlichen Endstatus „Closed“.

**Zulässige Übergänge.** Ein Vertrag durchläuft den Weg „Created“ – „Waiting for Confirmation“ – „Confirmed“ – „Waiting for Activation“ – „Active“. Aus jedem Status vor der Aktivierung ist der Wechsel nach „Rejected“ möglich. Der Übergang nach „Active“ wird ausschließlich im Backend gesetzt, nachdem es die Antwort des Kundenstammdaten-Managements validiert hat; er lässt sich nicht über die Schnittstellen erzwingen. Ein Vertrag mit offenen Prüfungen (Status „Not OK“, „Pending“, „Execution Failed“) ändert seinen Status nicht (Kapitel 8.4).

**Rollen.** Dealer und Dealer-Plus-Nutzer legen Anträge an und bestätigen sie. MO und MPC lehnen ab, aktivieren manuell, nehmen abgelehnte Anträge wieder auf und setzen aktive Verträge aus oder beenden sie. Automatisierte Abläufe sind der Job für den Ablauf der Angebotsgültigkeit, der Job für die automatische Aktivierung sowie Ereignisse aus den Diensten für Revenue, Kunden und Dokumente.

**Historie.** Jeder Statuswechsel wird im Reiter „History“ festgehalten: geändertes Objekt (Contract), Attribut (Contract Status), alter und neuer Wert, Art der Änderung, Grund, Datum und Benutzer. Standardgründe sind zum Beispiel „Rejected by Customer“, „Rejected by MPC/MO“, „Offer Validity Expired“, „Activation process restarted“, „Regular Expiry by Date“, „Regular Expiry by Mileage“, „Expiry by Contingent“ und „Early Termination“ (Kapitel 10.8).

**Übergabe an VEGA.** Statuswechsel übermittelt das System über die Datei i155 an VEGA, zum Beispiel mit dem Statuscode 001 für „Active“, 002 für „Suspended“, 010 für „Cancel“ und 004 für „Closed“. Beim Wechsel von „Created“ nach „Rejected“ werden keine Daten an VEGA gesendet. Einzelheiten zur Schnittstelle enthält Kapitel 19.9.

**Besonderheit Fahrgestellnummer.** Ist in den Markteinstellungen „Nur ein Vertrag pro Fahrgestellnummer zulassen“ aktiv, belegen die Status „Confirmed“, „Waiting for Activation“, „Active“ und „Suspended“ die Fahrgestellnummer. Die Status „Expired“, „Closed“, „Rejected“, „Cancelled“ und „Terminated“ geben sie frei (Kapitel 8.4).

Quellen: Batch 751.1, 844.1, 1011.3, 1056.6, 1025.1, 1005.1, 1004.2, 484.3, 1090.3, 850.1, 856.3, 1084.1, 898.1, 969.1

## 8.3 Fehlende Fahrzeugdaten und Dokumente ergänzen

**Zweck.** Anträge, die über eine Deal-ID oder Auftragsnummer angelegt wurden (Build to Order, Build to Stock), enthalten bei der Anlage oft noch keine Fahrgestellnummer, kein Erstzulassungsdatum (FRD) und kein Kennzeichen. Sie ergänzen diese Angaben, sobald das Fahrzeug zugelassen ist, und laden die zugehörigen Dokumente hoch. Ohne Erstzulassungsdatum ist keine Aktivierung möglich, auch nicht bei Build to Stock.

**Voraussetzungen.** Erstzulassungsdatum, Kennzeichen und die Zulassungsbescheinigung Teil II (ZB II) liegen vor. Ein Servicevertrag kann bis zu 12 Monate und/oder höchstens 50.000 km nach der Erstzulassung abgeschlossen werden, sofern das Fahrzeug noch keinen Service erhalten hat (Ausnahme: Dienst- und Vorführfahrzeuge mit Vorbesitzer). Der Vertragsbeginn entspricht dem Datum der Erstzulassung. Für Anträge im Status „Created“ aus Build to Order oder Build to Stock gilt eine verlängerte Angebotsgültigkeit: Der Antrag bleibt gültig, bis Erstzulassungsdatum und Kennzeichen vorliegen, zuzüglich 30 Tagen.

**Rollen.** Dealer und MO ergänzen die Fahrzeugdaten und laden Dokumente hoch.

**Schritt für Schritt: Fahrzeugdaten ergänzen.**

1. Öffnen Sie „Vertragserstellung“ und dann „Antragsverwaltung“ und suchen Sie den Antrag über die Referenznummer (Kapitel 8.1).
2. Fahren Sie mit dem Schieberegler nach rechts zur Spalte „Aktionen“, klicken Sie auf „…“ und wählen Sie „Aktualisieren“ („Update“).
3. Tragen Sie das Erstzulassungsdatum und das Kennzeichen ein; fehlt die Fahrgestellnummer, ergänzen Sie auch diese. Geben Sie das Kennzeichen ohne Leerzeichen ein; zulässig sind Buchstaben, Ziffern und höchstens ein Bindestrich bei maximal 11 Zeichen.
4. Bestätigen Sie den Dialog.

**Schritt für Schritt: Dokumente hochladen.**

1. Öffnen Sie den Antrag über die Referenznummer.
2. Wechseln Sie in das Register „Kommunikation“.
3. Laden Sie über das Hochladen-Symbol die Kopie der ZB I/ZB II oder das unterschriebene Vertragsdokument hoch (Kapitel 7.6).

**Ergebnis und Systemstatus.** Mit „Aktualisieren“ wechselt der Antrag in den Status „Waiting for Activation“. Das System prüft die ergänzten Angaben und löst die Abfrage der SEPA-Mandatsgültigkeit und der SAP-Debitorennummer aus. Sobald Fahrgestellnummer, Erstzulassungsdatum und Kennzeichen erfasst sind, fordert es den Zahlungsplan passend zur Vertragslaufzeit an: Laufzeitpreis und Werte werden vom Produkt abgerufen, an Revenue zur Erstellung des Zahlungsplans gesendet, und der Plan wird in den Vertrag übernommen. Danach führt das System alle Prüfungen erneut aus (Kapitel 8.4). Liefert die erneute Fahrzeugabfrage eine andere Fahrgestellnummer und passen Produkt, Produktkonfiguration und Preis weiterhin, speichert das System die neue, validierte Fahrgestellnummer im gesamten Vertrag und hält die Änderung im Reiter „Historie“ mit altem Wert, neuem Wert sowie Datum und Uhrzeit fest. Die Aktivierungs-E-Mail enthält in diesem Fall einen Abschnitt, der die bisherige und die neue Fahrgestellnummer nennt (Kapitel 8.6). Bleibt die Fahrgestellnummer gleich, laufen dieselben Prüfungen wie zuvor beschrieben, und die Aktivierungs-E-Mail enthält keinen zusätzlichen Hinweis.

**Prüfung des Erstzulassungsdatums.** Wurde der Antrag mit der Option „FRD unavailable“ angelegt und tragen Sie das Erstzulassungsdatum nach, prüft das System, ob das Vertragsende (Erstzulassungsdatum plus Vertragslaufzeit) bereits erreicht ist. In diesem Fall zeigt es ein Hinweisbanner, dass das Fortfahren den Vertrag beendet. Fahren Sie fort, beendet das System den Vertrag; andernfalls übernimmt es das Datum und setzt die Aktivierung fort.

**Bearbeitbarkeit je Status.** Im Status „Created“ zeigt die Übersicht „Overview & Confirmation“ rechts neben jedem Abschnitt die Schaltfläche „Edit“, etwa bei Fahrzeuginformationen, Produktoptionen sowie Kunden- und Zahlungsinformationen. „Edit“ bei Fahrzeug oder Produkt führt zur Produktauswahl, „Edit“ bei Kunde und Zahlung zur Kundenseite; alle Angaben sind vorausgefüllt und vollständig bearbeitbar. Nach „Weiter“ laufen die automatischen Prüfungen erneut, die Änderungen überschreiben die ursprünglichen Daten, und das Vertragsentwurf-PDF wird aktualisiert. Im Status „Waiting for Activation“ ist der Vertrag mit dem Kunden vereinbart; die Schaltfläche „Edit“ fehlt in den Reitern „Vertrag“, „Kunde“, „Produkt“ und „Zahlung“. Im Reiter „Fahrzeug“ bleibt „Edit“ erhalten und erlaubt ausschließlich die Bearbeitung des Felds „License plate“.

**Fehlerbehebung.** Anträge vom Typ Build to Order lassen sich aktualisieren; das Öffnen eines Antrags im Status „Created“ liefert keinen Fehler „404 Not Found“. Ein Vertrag im Status „Waiting for Activation“ hat immer einen Eintrag in der Prüfliste der MO-Verifizierung.

Quellen: Batch 1106.2, 959.9, 874.3, 874.5, 822.1, 1004.2, 1005.1, 1013.5, 977.5, 517.2, 1070.4

## 8.4 Freigabeprozess und Aktivierungsvoraussetzungen

**Zweck.** Nach der Bestätigung durch den Kunden aktiviert das System den Vertrag nicht unmittelbar, sondern führt vor der Aktivierung Prüfungen durch, damit alle Daten vollständig und stimmig sind. Dieses Unterkapitel beschreibt den Ablauf und die Bedingungen, die für eine Aktivierung erfüllt sein müssen. Die Bearbeitung der einzelnen Prüfungen durch Market Operations beschreibt Kapitel 9.

**Ablauf.**

1. Mit der Bestätigung stößt das System die Signatur über den Digital Signature Service (DSS) an; der Vertrag erhält den Status „Confirmed“.
2. Im Status „Confirmed“ fragt das System für Kunde und Zahler zunächst nur die Kundenprüfung gegen TRACS an. Bei positivem Ergebnis informiert es Market Operations und setzt den Vertrag auf „Rejected“. Bei einem falsch positiven Ergebnis informiert es Market Operations ebenfalls und wiederholt die Prüfung bei Bedarf mehrfach, bis ein eindeutiges Ergebnis vorliegt. Bei negativem Ergebnis fragt es das SEPA-Mandat und die SAP-Debitorennummer an.
3. Der Vertrag wechselt nach „Waiting for Activation“. Der Kunde erhält die Mitteilung, dass der Vertrag angelegt ist und die Freigabe durch Mercedes-Benz aussteht.
4. Das System führt alle verpflichtenden Aktivierungsprüfungen aus und speichert je Prüfung einen Status am Vertrag. Ist eine Prüfung nicht in Ordnung, markiert das System dies für Market Operations, die über das weitere Vorgehen entscheiden. Der Vertrag bleibt in „Waiting for Activation“, bis Market Operations einen weiteren Status vergeben.
5. Sind alle zutreffenden Prüfungen in Ordnung, folgt die Aktivierung (Kapitel 8.5).

**Prüfstatus.** Jede Prüfung hat einen der Status „OK“, „Not OK“, „Pending“ (ausstehend), „Not Applicable“ (nicht anwendbar) oder „Execution Failed“ (Ausführung fehlgeschlagen); bestätigte Prüfungen tragen zusätzlich „OK_ACKNOWLEDGED“ oder „NOT_OK_ACKNOWLEDGED“. Die Aktivierung wird nur fortgesetzt, wenn jede zutreffende Prüfung den Status OK, OK_ACKNOWLEDGED oder NOT_APPLICABLE hat. Solange mindestens eine Prüfung „Not OK“, „Pending“, „NOT_YET_AVAILABLE“, „NOT_OK_ACKNOWLEDGED“ oder „Execution Failed“ zeigt, ist die Aktivierung blockiert. „Execution Failed“ setzt das System, wenn eine Prüfung aus technischen Gründen nicht ausgeführt werden kann, etwa bei einer Zeitüberschreitung oder einem nicht erreichbaren Dienst. Der Status erscheint in Violett, wird automatisch erneut versucht und kann von MO weder bestätigt noch übersteuert werden. Prüfungen mit „Not Applicable“ blockieren den Vertrag nicht.

**Aktivierungsvoraussetzungen.**

- Fahrzeug, Produkt, Produktkonfiguration und Preis sind gegenüber dem Zeitpunkt der Erstellung unverändert; das System vergleicht den Preis bei der Aktivierung. Diese Prüfung gilt für jeden Vertrag und lässt sich nicht umgehen.
- Das Erstzulassungsdatum liegt vor (Kapitel 8.3).
- Die DSS-Signatur des Kunden ist erfasst. Fehlt sie, zeigt das System bei einem manuellen Aktivierungsversuch die Meldung „Customer signature missing“.
- Die Kundenprüfung gegen TRACS für Kunde und Zahler ist negativ. In der Oberfläche heißen die Prüfungen „Customer TRACS Check“ und „Payer TRACS Check“, der Fehlerfall „TRACS Check Error“.
- Der Kunde hat eine SAP-Debitorennummer, und die Gültigkeit des SEPA-Mandats ist in Ordnung. Hat der FI-Systemstatus den Wert „Available“, steht die Position „Fi System Status“ auf „Ok“. Fehlt die Debitorennummer oder ist das Mandat nicht in Ordnung, bleibt der Vertrag in „Waiting for Activation“. Werden Bankdaten oder der Direct-Debit-Code des Kunden ergänzt oder geändert, berechnet das System den Status der MO-Prüfung neu und setzt den Aktivierungsprozess fort (Kapitel 7.3). Bei Gewerbekunden belegt das System den FI-Partnerstatus automatisch: „Aktiv“ mit SAP-Debitorennummer, sonst „Inaktiv“.
- Der Kundenstatus ist „Available“ (angezeigt als „Ok“). „Blocked“ und „Archived“ gelten als „Not Ok“ mit dem jeweiligen Hinweis, „Pending“ als „Pending“.
- Der Verkäufer (der angemeldete Dealer oder ein von MPC beziehungsweise MO zugewiesener Dealer) ist in oneSCM registriert und hat eine SAP-Debitorennummer in der Händlerverwaltung. Fehlt sie, kann der Vertrag bis „Waiting for Activation“ gelangen; die Prüfung „Dealership Check“ zeigt „Dealers SAP Debtor Number – NOK“ mit dem Grund „Dealership not registered“. Der Hyperlink führt in die Händlerverwaltung (Dealership Management), wo die Nummer ergänzt wird; danach steht die Prüfung auf „OK“, und die Aktivierung läuft weiter. Diese Prüfung gilt auch bei Händlerrabatten und wenn MO einen Vertrag im Namen eines Dealers anlegt.
- Die Umsatzsteuer-Identifikationsnummer ist kein Pflichtfeld. Ist sie ausgefüllt, prüft das System sie über VIES und übernimmt das Ergebnis in die MO Checks; ist sie leer, findet keine Prüfung statt. In der Schweiz und in Südkorea steht die Prüfung für alle Kundentypen auf „NOT_APPLICABLE“, da beide Märkte nicht an VIES angeschlossen sind; das Feld heißt dort „MWST-Nummer“ beziehungsweise „Business Registration Number“ und ist ein reines Informationsfeld. Die Prüfung blockiert die Aktivierung in diesen Märkten nie.
- Die Produktkompatibilität ist in Ordnung. Pro Fahrgestellnummer ist nur ein aktiver Vertrag erlaubt. Mehrere Anträge für dasselbe Fahrzeug können parallel in „Created“ oder „Waiting for Confirmation“ stehen. Sobald ein Vertrag die Fahrgestellnummer belegt („Confirmed“, „Waiting for Activation“, „Active“, „Suspended“), setzt das System bei allen übrigen Anträgen derselben Fahrgestellnummer die Produktkompatibilität auf NOT_OK; in „MO Checks Verification“ erscheint „An active contract (<Vertragsnummer>) exists for this chassis“. Wird der aktive Vertrag storniert oder vorzeitig beendet, hebt das System die Sperre für Anträge innerhalb ihrer Angebotsgültigkeit automatisch auf, setzt die Produktkompatibilität auf NOT_APPLICABLE und ergänzt einen Historieneintrag wie „Unblocked – contract <Nummer> terminated“. Abgelehnte Anträge bleiben abgelehnt. Eine Aussetzung gibt die Fahrgestellnummer nicht frei. Ist die Markteinstellung „Nur ein Vertrag pro Fahrgestellnummer zulassen“ (je Pkw und Van) nicht aktiv, sperrt und entsperrt das System nicht. Der Kauf sich ergänzender Produkte mit nicht überlappender Basisabdeckung bleibt möglich; bei der Produktsuche zeigt das System nur Produkte ohne überlappende Basisabdeckung.
- Die zusätzliche Prüfung „Additional Verification“ ist beantwortet, sofern der Markt „Perform Additional Checks“ eingeschaltet hat. Sie dient Kontrollen, die außerhalb des Systems stattfinden. Beim Anlegen steht sie auf „Pending“ und blockiert die Aktivierung. „YES“ setzt sie auf „OK“, „NO“ auf „Not OK“; ein Wechsel von „NO“ auf „YES“ ist möglich. Ist die Einstellung ausgeschaltet, steht die Prüfung auf „Not Applicable“ und bleibt unberücksichtigt.
- Bei Gewerbekunden steht die Prüfung „Industry“ im Abschnitt „Customer Check“ standardmäßig auf „NOK“ mit dem Grund „Check Industry“. Solange sie auf „NOK“ steht, ist nur die manuelle Aktivierung zulässig (Kapitel 8.5).
- Eine angefragte Karenzzeit-Kampagne (Grace Period) ist beantwortet oder die Wartezeit von sieben Tagen ist abgelaufen (Kapitel 8.7).
- Bei Zahlung vor der Aktivierung ist die Zahlung eingegangen. Dann steht die MO-Prüfung auf „OK“ und der Vertrag auf „Waiting for Activation“. Schlägt die Zahlung fehl, steht die Prüfung auf „Not OK“, die Aktivierung ist verhindert, und in den MO Checks steht die Funktion „Retrigger“ zur Verfügung (Kapitel 19.15).
- Für Verträge mit Kampagne liegen die Zahlungsinformationen des Marktes vor, damit die Kampagnenkosten gedeckt sind (Kapitel 12.3).

**Rollen.** Market Operations entscheiden bei auffälligen Prüfungen, bestätigen die Prüfungen Campaign, Additional Verification, Mileage und Industry mit Begründung (Kapitel 9.3) und aktivieren oder lehnen ab. MPC bearbeiten Kampagnen- und Sonderfallanfragen (Kapitel 12.3 und 12.4).

**Hinweis.** Ein fehlender Steuerbefreiungsnachweis verhindert den Übergang von „Waiting for Confirmation“ nach „Confirmed“ nicht; die Prüfung erfolgt wie die Additional Verification offline und wird anschließend bestätigt.

Quellen: Batch 1017.6, 1025.1, 1110.4, 888.2, 898.1, 871.2, 1113.2, 1107.3, 1102.3, 1106.2, 585.6, 623.2, 1103.5, 879.1, 1084.1, 1199.1, 893.1, 893.4, 1041.3, 1100.5, 903.8, 977.5, 1061.8

## 8.5 Automatische und manuelle Aktivierungsvarianten

**Zweck.** Ein Vertrag im Status „Waiting for Activation“ wird entweder automatisch durch das System oder manuell durch Market Operations oder MPC aktiviert. Für bestimmte Zahlungs- und Vertragsvarianten gelten abweichende Abläufe.

**Automatische Aktivierung.** Ein täglicher Lauf aktiviert Verträge im Status „Waiting for Activation“, deren Verifizierungsstatus „OK“ ist. Verträge, bei denen in den MO-Prüfungen noch Positionen auf „NOK“ stehen, werden nicht automatisch aktiviert; sie bleiben in „Waiting for Activation“, bis MO oder MPC entscheiden. Ist ein Dealer registriert und wird ein Händlerrabatt angewendet, aktiviert das System den Vertrag automatisch, sofern alle Prüfungen in Ordnung sind. Die Prüfung „Industry“ bei Gewerbekunden schließt die automatische Aktivierung aus; hier ist nur die manuelle Aktivierung zulässig.

**Manuelle Aktivierung durch MO oder MPC.** Market Operations weisen Verträgen im Status „Created“ oder „Waiting for Activation“ den nächsten Status zu, zum Beispiel nach auffälligen Prüfergebnissen (NOK-Checks).

1. Melden Sie sich als Market-Operation-Benutzer an.
2. Öffnen Sie die Vertragsübersicht über die Startseite von „Vertragserstellung“ oder über „MO Checks Verification“, indem Sie auf die Vertragsnummer klicken.
3. Klicken Sie oben rechts in der Kopfzeile auf „Select“ und wählen Sie „ACTIVATE“.
4. Geben Sie im Bestätigungsdialog den Grund für die Aktivierung ein. Erst dann wird die Schaltfläche „Activate“ unten rechts aktiv.
5. Klicken Sie auf „Activate“. Eine Toast-Meldung bestätigt die Aktivierung.

Die manuelle Aktivierung ist nicht möglich, solange die DSS-Signatur des Kunden fehlt (Meldung „Customer signature missing“) oder eine Anfrage zur Karenzzeit-Kampagne unbeantwortet ist. Geht innerhalb von sieben Tagen keine Antwort von MPC ein, entfernt das System die Anfrage, setzt die Aktivierung fort und gibt die manuelle Aktivierung wieder frei. Die Benachrichtigung zur Karenzzeit-Anfrage enthält den Namen des Dealers und die Benutzer-ID.

**Variante: Zahlung nach Aktivierung per Kreditkarte (Kunden ohne MMe-Account).** Für die Zahlungskonfiguration „Post Activation“, „One-Time“ und Kreditkarte gilt für alle Kundentypen und Sparten: Das System verlangt bei Erstellung und Bestätigung weder eine MMe-ID noch eine CIAM-ID und führt keine Kreditkartenvalidierung durch. Nach der Bestätigung in „Overview & Confirmation“ wählen Sie die Signaturmethode. Ist der Vertrag signiert, die TRACS-Prüfung negativ und eine FI-System-Debitorennummer vorhanden, übermittelt das System Vertragsnummer, Beträge und SAP-Debitorennummer an den Revenue-Dienst, der einen Zahlungslink erzeugt. Der Kunde erhält eine E-Mail mit Zugang zum Customer Account Center, wo er die Kreditkarte validiert (Kapitel 12.8). Der Vertrag steht auf „Waiting for Activation“ und wird aktiviert, sobald alle MO-Prüfungen in Ordnung sind, auch ohne Zahlungsbestätigung. Die Zahlungsüberwachung übernimmt Revenue: Ist die Zahlung sieben Kalendertage nach Erzeugung des Zahlungslinks nicht erfolgt, erhält der Kunde eine Erinnerungs-E-Mail; nach 14 Kalendertagen setzt das System den Vertrag auf „Suspended“ mit dem Historieneintrag „Payment Overdue“. Nach erfolgreicher Zahlung reaktiviert es den Vertrag mit dem Eintrag „Payment Confirmed“ (Kapitel 10.4). Für Kunden mit MMe-Account gilt der Standardablauf.

**Variante: Leasingverträge von MBLD.** Leasingverträge legt ausschließlich MBLD über die Edge-Schnittstelle an; die Retail-Oberfläche bietet dafür keinen Erstellungsablauf. MO und MPC sehen diese Verträge in der Antragsverwaltung mit dem Status „Created“ und bearbeiten sie bis zur Aktivierung, danach im Vertragsmanagement. Die Aktivierung eines bestätigten Leasingvertrags läuft so:

1. Wählen Sie den Leasingvertrag im Status „Confirmed“ und starten Sie die Aktion „Update“.
2. Erfassen Sie die Fahrgestellnummer (genau 17 Zeichen, FIN oder VIN), das Erstzulassungsdatum, das Kennzeichen und den Vertragsbeginn. Den Vertragsbeginn wählen Sie über die Datumsauswahl: frühestens das heutige Datum abzüglich der Gesamtlaufzeit, spätestens heute. Ein ungültiges Datum weist das System direkt am Feld mit „Please enter a valid date“ ab; eine Fahrgestellnummer mit abweichender Länge ebenfalls. Der Dialog lässt sich erst mit gültigen Werten bestätigen.
3. Bestätigen Sie den Dialog. Das System validiert die Fahrgestellnummer mit dem Vehicle Management, prüft Produkt, Produktkonfiguration und Preis und aktiviert den Vertrag über den Edge-Leasing-Aufruf mit allen vier Werten. Der Vertrag wechselt nach „Active“. Dies ist der einzige Weg von „Confirmed“ nach „Active“ für Leasingverträge.

Fordert MBLD die Aktivierung direkt über die Schnittstelle an, sind contractStatus, contractNumber, chassisNumber, firstRegDate und licensePlate Pflichtfelder; contractStartDate ist optional. Das System berechnet das Fahrzeugalter in Tagen als Differenz zwischen Angebotserstellungsdatum und Erstzulassungsdatum und vergleicht es mit dem Produktwert „vehicleAgeLessThan“. Überschreitet das Alter die Grenze, bleibt der Vertrag in seinem Status, und MBLD erhält die Meldung „Difference between First Registration Date and Proposal Creation Date exceeds the product eligibility limit.“; die Anfrage kann mit korrigierten Daten erneut gestellt werden. Die Vertragsdaten ergeben sich aus der Produktkonfiguration: Bei Produkten mit FRD-Bezug ist der Vertragsbeginn das übermittelte contractStartDate oder sonst das Erstzulassungsdatum; bei Produkten ohne FRD-Bezug das contractStartDate oder sonst das Angebotserstellungsdatum. Das geplante Vertragsende ist jeweils Vertragsbeginn plus Laufzeit minus einen Tag; das Aktivierungsdatum ist das Datum des Aufrufs. Ein Vertragsbeginn in der Zukunft wird mit „contract start date cannot be in the future“ abgewiesen; der Vertrag bleibt in „Confirmed“. Kennzeichen mit Leerzeichen bereinigt das System an den Leasing-Endpunkten vor der Format- und Längenprüfung (aus „ AB 1234 “ wird „AB1234“); Bindestriche bleiben erhalten, und der i155-Export übernimmt wie üblich die ersten zehn Zeichen.

**Variante: Massenanlage.** Verträge aus der Massenanlage für Flotten- und Großkunden werden wie jeder andere Vertrag aktiviert; das Autohaus ist Kunde und Zahler, und die Prüfung „Vehicle Registration Document“ ist gesetzt. Die Benachrichtigung erfolgt gesammelt je Group ID (Kapitel 8.6 und 12.9).

Quellen: Batch 1100.5, 1070.4, 1021.1, 1021.2, 1113.2, 904.2, 864.1, 863.1, 873.1, 864.5, 863.5, 892.2, 517.1, 517.2, 878.6, 1025.1

## 8.6 Aktivierung und Ergebnis kontrollieren

**Zweck.** Nach der Aktivierung kontrollieren Sie, ob der Vertrag den Status „Active“ trägt, die Dokumente vorliegen, die Benachrichtigungen versendet sind und die nachgelagerten Systeme informiert wurden.

**Ergebnis und Systemstatus.** Mit der Aktivierung wechselt der Vertrag nach „Active“ und erscheint nicht mehr in der Antragsverwaltung und in der Verifikationsprüfung, sondern auf der Startseite des Vertragsmanagements. Das Bestätigungsdatum zeigt das System erst nach der tatsächlichen Bestätigung an. Mit der Aktivierung wechselt auch ein neuer Kunde vom Status „temporär“ auf „aktiv“ (Kapitel 4.3).

**Übergaben an andere Systeme.**

- VEGA erhält die Datei i155 mit dem Statuscode 001. Bei der ersten Aktivierung entspricht das Statusänderungsdatum (Satzart 05, Stellen 140 bis 147) dem Vertragsbeginn; bei allen späteren Statuswechseln dem tatsächlichen Änderungsdatum. Die i155 verwendet stets die zuletzt validierte Fahrgestellnummer. Bei Reifenprodukten enthält sie zusätzlich Reifenart, Reifengröße und Kontingentwerte (Kapitel 13.5).
- Revenue Management erhält eine Benachrichtigung mit Basispreis (netto und brutto), Wert der Kampagne (netto und brutto), Kostenstelle des Marktes, Händlerrabatt (netto und brutto), SAP-Debitorennummer des Dealers, Angaben zum MPC-Sonderpreis sowie bei Kampagnen Kampagnen-ID, Rabattwert und Endpreis. Rabattinformationen und Provisionen übermittelt das System erst nach Ablauf der im Markt eingestellten Widerrufsfrist; bei 23 Tagen also am 24. Tag.
- NEMESIS, Reporting und Controlling erhalten die Vertragsinformationen; bei Kampagnen aktualisiert ein Ereignis an Products die Gesamtausgaben um den Kampagnenbetrag.

**Benachrichtigungen.** Bei der Aktivierung versendet das System eine einzige E-Mail an alle Beteiligten. Legt der Dealer den Vertrag an, steht der Kunde im Feld „An“ und der Dealer in „CC“. Legt MO den Vertrag im Namen des Dealers an, stehen Dealer und erstellender MO in „CC“. Hat sich die Fahrgestellnummer bei der erneuten Prüfung nach Erfassung des Erstzulassungsdatums geändert, enthält die E-Mail einen Abschnitt mit bisheriger und neuer Nummer; es entsteht keine zusätzliche E-Mail.

**Dokumente.** Im Reiter „Dokumente“ liegen nach der Aktivierung mindestens der Servicevertrag und die Allgemeinen Geschäftsbedingungen. Das Vertragsdokument und der Zahlungsplan tragen im Status „Active“ kein Wasserzeichen; das Wasserzeichen „DRAFT“ erscheint nur im Status „Created“. Das Vertragsdokument weist zusätzlich das Ausstellungsdatum aus. Im Reiter „Benachrichtigungen“ (Register „Kommunikation“) laden Sie die Aktivierungs- und die Bestätigungs-E-Mail herunter.

**Schritt für Schritt: Ergebnis kontrollieren.**

1. Öffnen Sie den Vertrag im Vertragsmanagement (Kapitel 10.1) und prüfen Sie den Status „Active“.
2. Prüfen Sie im Reiter „History“ den Statuswechsel mit Grund, Datum und Benutzer.
3. Prüfen Sie im Reiter „Dokumente“ Servicevertrag und Allgemeine Geschäftsbedingungen.
4. Prüfen Sie im Register „Kommunikation“ die versendete Aktivierungs-E-Mail.

**Besonderheit Massenanlage.** Sobald der erste Vertrag einer Group ID aktiviert oder abgelehnt ist, startet ein täglicher Benachrichtigungsmechanismus. Werktags von Montag bis Freitag erhält der Kunde zu einem festen Zeitpunkt eine E-Mail, die alle seit der letzten Benachrichtigung aktivierten oder abgelehnten Verträge zusammenfasst; sie wird nur versendet, wenn mindestens ein Vertrag betroffen ist. Verträge nach dem Benachrichtigungsschluss am Freitag erscheinen am Montag. Die E-Mail enthält eine Fahrzeugübersicht mit Auftragsnummer, Servicevertragsnummer, Kennung, Erstzulassungsdatum, Kilometerstand, Kennzeichen, Start- und Enddatum und Status („Approved“ oder „Rejected“), einen Link zum Customer Account Center und als Anhang ein ZIP-Archiv mit den Zahlungsplänen aller aktivierten Verträge (Namenskonvention Payment_Plans_GroupID_DDMMYYYY; je Plan Payment_Plan_Servicevertragsnummer_GroupID). Einzelne Ablehnungs-E-Mails versendet das System bei der Massenanlage nicht. Der Mechanismus endet, sobald alle Verträge der Group ID einen Endstatus erreicht haben. Die Vorlagen „Mass Creation Confirmation“ und „Mass Creation Activation“ pflegen Sie im E-Mail-Vorlagenbereich mit den Variablen %GroupID%, %NrOfContracts% und %MassTotalPrice% (Kapitel 14.4).

**Hinweise.** Ein aktivierter Vertrag kann innerhalb von 14 Tagen nach der Aktivierung von MO oder MPC storniert werden, etwa bei irrtümlicher Aktivierung oder Widerruf durch den Kunden (Kapitel 10.6). Die Aktivierung läuft ohne internen Serverfehler, auch beim Zugriff auf einen Vertrag vor der Aktivierung oder auf den Reiter „Zahlung“.

Quellen: Batch 1021.2, 1014.6, 959.10, 1017.6, 869.6, 1106.2, 769.6, 874.3, 977.5, 1108.6, 851.4, 484.2, 484.3, 484.6, 915.5, 381.3, 850.1, 1068.4, 1061.8, 688.2, 1114.2

## 8.7 Ablehnung, Verzögerung und Wiederaufnahme

**Zweck.** Nicht jeder Antrag wird aktiviert. Dieses Unterkapitel beschreibt, wann ein Antrag im Prozess wartet, wann und warum er den Status „Rejected“ erhält und wie MO oder MPC einen abgelehnten Antrag wieder aufnehmen.

**Verzögerung.** Ein Antrag verbleibt in „Waiting for Activation“, solange eine Prüfung nicht in Ordnung ist und Market Operations noch nicht entschieden haben, die SAP-Debitorennummer oder die SEPA-Mandatsgültigkeit fehlt oder eine Prüfung mit „Execution Failed“ auf den automatischen Neuversuch wartet (Kapitel 8.4). Eine angefragte Karenzzeit-Kampagne hält die Aktivierung bis zur Antwort von MPC, höchstens sieben Tage. Als Dealer prüfen Sie in solchen Fällen die Hinweise in der Vertragsübersicht und im Register „Kommunikation“ und reichen fehlende Angaben nach (Kapitel 8.3); fehlende Händlerdaten ergänzt der Markt in der Händlerverwaltung.

**Angebotsgültigkeit.** Die Angebotsgültigkeit ist je Markt in den Market Settings in Tagen konfiguriert. Sie beginnt mit dem Start des Signaturprozesses, also mit dem Status „Waiting for Confirmation“, und endet mit dem Wechsel nach „Confirmed“ oder mit Ablauf der konfigurierten Tage. Läuft sie ab, ohne dass der Kunde bestätigt hat, setzt das System den Antrag automatisch auf „Rejected“ und hinterlegt den Grund „Offer Validity Expired“. Dasselbe gilt, wenn die MO-Prüfungen fehlschlagen und innerhalb der Gültigkeit kein Aktivierungsversuch erfolgt. Für Anträge aus Build to Order und Build to Stock gilt die verlängerte Gültigkeit aus Kapitel 8.3. Unternimmt der Kunde nach der Erstellung keine weiteren Schritte, setzt das System den Antrag nach einer festgelegten Wartezeit automatisch auf „Rejected“ mit dem Grund „Rejected by Customer“.

**Ablehnungsgründe.** Ein Antrag wird abgelehnt

- durch den Kunden, wenn er das Angebot nicht annimmt oder die Angebotsgültigkeit verstreicht;
- durch Vertrieb, MO oder MPC, wenn eine Prüfung für die Aktivierung nicht erfolgreich ist, zum Beispiel bei einer Abweichung des Erstzulassungsdatums; der eingegebene Grund erscheint im Reiter „History“ im Bereich „Reason“;
- automatisch durch das System bei positivem TRACS-Ergebnis oder einem Kunden auf einer Sperrliste, bei fehlender Kompatibilität von Produkt, Konfiguration oder Preis nach dem Ergänzen der Fahrzeugkennung sowie wenn ein anderer Antrag derselben Fahrgestellnummer bestätigt wird. Bei automatischen Ablehnungen verwendet das System vordefinierte Standardmeldungen. Scheitert die automatische Aktivierung, meldet das System den Fall an Market Operations, die den Vertrag über „Admin“ und „MO“ prüfen.

Die Ablehnung wird im Reiter „History“ dokumentiert (Kapitel 8.2). Beim Wechsel von „Created“ nach „Rejected“ werden keine Daten an VEGA gesendet. Wurde bereits vor der Aktivierung gezahlt, sendet das System ein Ereignis mit Kundendaten, Vertragsnummer, Betrag und Zahlungsmethode an Revenue; der Revenue-Dienst erstellt eine Gutschrift und erstattet die Transaktion.

**Benachrichtigung bei Ablehnung.** Wird ein Antrag im Status „Created“ oder „Waiting for Confirmation“ abgelehnt, erhält der Endkunde keine E-Mail, weder bei manueller Ablehnung durch Vertrieb, MO oder MPC noch bei automatischer Ablehnung, in beiden Sparten. Ab dem Status „Confirmed“, also auch in „Waiting for Activation“, erhält der Endkunde die Ablehnungs-E-Mail, sofern er die E-Mail-Benachrichtigungen nicht ausgeschaltet hat. Als Dealer lesen Sie den Ablehnungsgrund in der Historie und im Register „Kommunikation“, korrigieren die Daten und nehmen den Antrag mit MO oder MPC wieder auf oder legen einen neuen Antrag an.

**Wiederaufnahme (Resume).** MO und MPC können den Aktivierungsprozess eines abgelehnten Antrags wieder aufnehmen, wenn der Antrag abgelehnt wurde, weil die in den Markteinstellungen definierte Angebotsgültigkeit abgelaufen ist, weil bereits ein bestätigtes Angebot oder ein aktivierter Vertrag für dieselbe Fahrgestellnummer existiert oder weil eine Anfrage zur Karenzzeit-Kampagne nicht beantwortet wurde. Anträge, die wegen eines positiven TRACS-Ergebnisses abgelehnt wurden, lassen sich nicht wieder aufnehmen.

1. Öffnen Sie in der Antragsverwaltung den Antrag mit dem Status „Rejected“. Entspricht der Ablehnungsgrund einem der zulässigen Fälle, steht die Schaltfläche „Status“ mit der Option „Resume“ zur Verfügung; bei allen anderen Gründen fehlt sie.
2. Wählen Sie „Resume“. Das Fenster „Resume Activation“ öffnet sich.
3. Tragen Sie im Pflichtfeld „Reason for Request“ die Begründung ein.
4. Klicken Sie auf „Resume Activation“. Mit „Cancel“ oder „x“ schließen Sie das Fenster ohne Änderung.

**Ergebnis der Wiederaufnahme.** Der Antrag erhält den Status, den er vor der Ablehnung hatte, zum Beispiel „Created“ oder „Waiting for Confirmation“. Die Historie erhält einen Eintrag mit dem Grund „Activation process restarted“, dem alten Wert „Rejected“, dem neuen Wert, dem Datum und der Benutzer-ID. Das System berechnet die Angebotsgültigkeit ab dem Zeitpunkt der Wiederaufnahme gemäß den aktuellen Markteinstellungen neu und bewertet die Prüfungen erneut: Ist die Fahrgestellnummer frei, ergibt die Produktkompatibilität NOT_APPLICABLE; ist der andere Vertrag weiterhin aktiv, ergibt sie NOT_OK mit dem Hinweis auf den aktiven Vertrag. Alle angewendeten Rabatte, Kampagnen, Optionsabdeckungen und technischen Optionen bleiben erhalten. Anschließend läuft der Aktivierungsprozess im vorgesehenen Ablauf weiter; bei der Aktivierung gelten unverändert die Prüfungen auf Produkt, Konfiguration und Preis.

Quellen: Batch 969.1, 1084.1, 1090.3, 891.7, 822.1, 1011.3, 1087.3, 1110.4, 1113.2, 903.8, 1199.1, 898.1, 1025.1, 1102.3

## Verschiebung in andere Kapitel

- Kapitel 3.2 Suche und Filter oder 19.22 Schnittstellenbetrieb: Suchkriterien und Ergebnisbereich der Fehlertabelle (erstes Auftreten, Vertragsnummer, Status, Fehlercode; Spalten und Seitengröße) [Batch 251.2, 251.3]; Suchkriterien für Schnittstellendateien (Dateityp „Outbound“, Export- und Importdatum, Dateiname, Check) [Batch 177.2, 181.3].
- Kapitel 4.3 Kundendaten und Pflichtangaben prüfen: Kundenstatus „Temporär“, „In Bestätigung“, „Aktiv“, „Inaktiv“ entlang des Vertragsverlaufs und Synchronisierung mit CoFiCo; Status des Holders bei abweichendem Zahler; FI-Partnerstatus und Zahlungsdetails von Gewerbekunden [Batch 1114.2, 591.3, 658.3, 688.2, 623.2].
- Kapitel 5.3 oder 19.7 Warranty-and-Goodwill-API: Abruf des Fahrzeugstatus (HQ gesperrt „V“, gestohlen „3“, Totalschaden „8“, verschrottet „2“) und Stopp der Vertragsgenerierung [Batch 1196.3].
- Kapitel 7.1 Zahlungsarten: Account Note SB, SJ, SI verhindert die Vertragserstellung; Banküberweisung nur für Gewerbekundensegmente der Sparte Van [Batch 1090.1]; Zahlungsreferenz auf dem Reiter „Zahlung“ für Geschäftskunden, Pflege durch MO, API-Parameter [Batch 771.5].
- Kapitel 7.4 Vertragsdokumente und 14.4 Template Management: Master-Vorlage nach Mercedes-Benz-Styleguide, Vorrang produktspezifischer Vorlagen, Szenarien Zahler gleich oder ungleich Halter [Batch 507.2]; Verkäufer- und Händlerdaten aus ALICE sowie Wasserzeichen „DRAFT“ und Zahlungsplan in den Vorlagen (in Kapitel 8.6 nur als Ergebnis genannt) [Batch 484.2, 484.3, 484.6]; Ergebnistabelle der Vorlagenverwaltung [Batch 506.4].
- Kapitel 9.3 Prüfstatus: Bestätigungsdialog für die Prüfungen Campaign, Additional Verification, Mileage und Industry („Set to OK“, „Set to Not Ok“, Pflichtkommentar, Versionierung) [Batch 871.2]; Statuswerte GOOD_GUY, BAD_GUY, RELEASED_ONCE, BLOCKED_ONCE in oneSCM und TRACS [Batch 565.5]; Umbenennung der CAS-Prüfungen in TRACS [Batch 888.2].
- Kapitel 10.4 Aussetzen und Reaktivieren: Sperrung und Wiederaktivierung aktiver Verträge durch MO, Mehrfachauswahl, Pflichtgrund, VEGA-Codes 002 und 001 [Batch 856.3, 856.4]; Reaktivierung gesperrter Leasingverträge [Batch 786.4].
- Kapitel 10.6 Kündigung, Stornierung und Beendigung: Stornierung innerhalb von 14 Tagen nach Aktivierung mit Dialogfeldern „Contract Selection“, „Input Date“, „Mileage“, „Reason“, „Comments“ und VEGA-Code 010 [Batch 850.1]; Ablauf mit Prüfprofil und Zahlungsbetrag 0 direkt nach „Closed“, Statusfolge in der Historie [Batch 796.2]; Statuscodes 003, 009, 013 in der i155 je Ablaufart [Batch 757.3].
- Kapitel 12.3 Kampagnen und Sonderkonditionen: Genehmigung, Ablehnung und Ablauf einer Kampagnenanfrage durch den MPC-Prüfer („Review“, „View“, Status „Confirmed“, „Rejected“, „Expired“ der Anfrage, Preis- und Zahlungsplanfolgen) [Batch 869.5, 882.5]; Ereignisse bei Aktivierung mit genehmigter Karenzzeit-Kampagne [Batch 869.6].
- Kapitel 12.9 Massenanlage: Sonderfallanfragen und Kampagnen in der Massenanlage [Batch 878.6].
- Kapitel 14.9 Preisversionen: Spalte „4 Eye“ und Protokoll des Vier-Augen-Prozesses [Batch 1159.5]; Kapitel 14.8 Produktdefinition: automatischer Wechsel in den Produktstatus „Ready“ [Batch 1228.2]; Kapitel 14.12 Product Testing: Auswahl des Erstzulassungsdatums, Testdatum und „Sales Level“ im Produkttest [Batch 1277.7].
- Kapitel 19.15 MPay: Zahlungen vor der Aktivierung, „Supported Payments“ in den Market Settings, Zahlungsplan mit Rechnung im Status „Confirmed“ [Batch 158.2]; Zahlungslinks nach der Aktivierung (Preauthorize & Capture, Abonnementkennzeichen, CFDM-Batch) [Batch 142.1].
- Kapitel 19.21 Technische Integrationswege: Antwortcodes des Konsumenten und Wiederholungsverhalten von Edge (202 ACCEPTED, 200 ALREADY_ACCEPTED, 409 IDEMPOTENCY_CONFLICT, Dead Letter Topic) [Batch 519.6]; Erweiterung des ChangePayerEventDto um die Vertragsnummer [Batch 1110.4].
- Kapitel 22.2 Geplante Erweiterungen: Zusammenführung der Statusübergänge in einer deklarativen Übergangstabelle mit Parallelbetrieb je Markt [Batch 751.1]; Produktkompatibilität mit ergänzenden Produkten (Erweiterung, Folgeprodukt, paralleles Produkt) [Batch 1199.1, 865.2]; Anzeige des Überweisungsstatus in den MO Checks mit Abgleich gegen oneERP nach 48 Arbeitsstunden [Batch 607.4]; Konfiguration der Zahlungsarten auf Produktebene [Batch 1090.1]; Ausnahme der VIES-Prüfung als Regel auf Marktebene [Batch 879.1].

## Klärungsbedarf

- Wartezeit bis zur automatischen Ablehnung ohne Fortschritt: Batch 1011.3 nennt eine Stunde nach Erstellung („Rejected by Customer“), Batch 1113.2 eine Verlängerung auf 24 Stunden für die Umgebungen DEV, INT und PrePROD, Batch 822.1 die marktspezifische Angebotsgültigkeit. Welcher Wert gilt in der Produktion? Im Text steht „nach einer festgelegten Wartezeit“.
- Automatische Aktivierung: Batch 1100.5 beschreibt die Abschaltung der unmittelbaren automatischen Aktivierung und einen täglichen Lauf; Batch 1025.1, 1013.5 und 1070.4 beschreiben eine automatische Aktivierung direkt nach erfolgreichen Prüfungen. Zu klären, ob die Aktivierung unmittelbar oder nur über den täglichen Lauf erfolgt und ob die Abschaltung weiter gilt.
- Rolle bei der Aktivierung: Batch 751.1 nennt Händler und Dealer-Plus-Nutzer als Rollen, die Verträge aktivieren; Batch 1021.1 und der Quick Guide beschreiben die manuelle Aktivierung ausschließlich durch Market Operations. Zu klären, ob Dealer eine Aktivierungsaktion haben.
- Nachgetragenes Erstzulassungsdatum nach Vertragsende: Batch 1106.2 nennt im Hinweisbanner „abgelehnt“, als Ergebnis jedoch „Terminated“. Welcher Status ist korrekt?
- Status „Activation Failed“: nur Batch 1025.1 nennt ihn als möglichen Folgestatus von „Waiting for Activation“; alle übrigen Quellen kennen nur „Active“ und „Rejected“. Existiert der Status in der Oberfläche?
- Bezeichnung CAS/TRACS: Batch 888.2 beschreibt die Umbenennung aller CAS-Prüfungen in TRACS; Batch 904.2, 1110.4, 969.1, 1011.3 und 1013.5 verwenden „CAS“. Der Text verwendet TRACS; die Beschriftungen in der Oberfläche sind zu prüfen. Batch 888.2 nennt zudem die Abschaltung von CAS im Februar 2027.
- VEGA-Code für „Closed“: Batch 844.1 nennt den Code 004 beim Wechsel nach „Closed“; Batch 757.3 nennt für „Expired“ die Codes 003, 009 und 013. Zuordnung der Codes zu den Status in Kapitel 19.9 abstimmen.
- Bezeichnung „MWST-Nummer“ in der Schweiz: Batch 879.1 vermerkt, dass die deutsche Bezeichnung noch bestätigt werden muss.
- Betreff der Aktivierungs-E-Mail bei Massenanlage: Batch 381.3 nennt „Service Contract Status Update (GroupId: …)“ und „Service Contract Activation (GroupId: …)“ nebeneinander.
- Berechtigungsumfang in Batch 1134.4: Die Beschreibung (Antragsverwaltung sichtbar, keine Aktionen, kein Upload, kein E-Mail-Versand, Anträge im Status „Created“ nur lesend) nennt die betroffene Rolle nicht. Im Text als lesender Zugriff ohne Bearbeitungsberechtigung formuliert; Rolle zu bestätigen.
- Aktivierungs-E-Mail für Onlineverkauf (Batch 1031.1): beschreibt eine erste Projektphase mit direktem Wechsel von „Created“ nach „Activated“ ohne Prüfungen, Betreff „Service Contract confirmation“, Absender Mercedes-Benz Cars UK Limited. Zu klären, ob dieser Ablauf und Markt für das Handbuch relevant sind; nicht in den Text übernommen.
- Benachrichtigung bei Aktivierung (Batch 822.4): nennt getrennte E-Mails an MO, Dealer und Endkunde als offenes Vorhaben; Batch 1108.6 beschreibt eine einzige E-Mail mit „An“ und „CC“. Der Text folgt Batch 1108.6.
- Mehrere aktive Verträge pro Fahrgestellnummer: Batch 1199.1 nennt die automatische Ablehnung aller übrigen Anträge beim Bestätigen eines Vertrags, Batch 1084.1 dagegen eine Sperre über die Produktkompatibilität mit automatischer Freigabe. Der Text folgt Batch 1084.1 (Markteinstellung „oneContractPerChassisNumber“); Verhalten bei inaktiver Markteinstellung bestätigen.
- Hauptvertrag (Batch 1269.5): Die Ansicht für Aktivierung und Vorschlag eines Hauptvertrags zeigt zusätzlich den Preis ohne Rabatt. Begriff „Hauptvertrag“ und Zielkapitel unklar.
- Ende-zu-Ende-Verwaltung des Vertragsstatus (Batch 835.5): nur Fertigstellungsvermerk ohne Inhalt.
- Konfigurierbare zusätzliche Prüfungen (Batch 1041.3) und zusätzliche Prüfung (Batch 893.1, 893.4): Batch 1041.3 bezeichnet die Erweiterung als in Bearbeitung. Der Text beschreibt das Verhalten nach Batch 893.4 als Ist-Zustand; Auslieferung bestätigen.
- Eingestellte oder geschlossene Meldungen ohne Inhalt für das Klärungsregister (Anhang F): Batch 405.1 (drei Meldungen „Cancelled“ bzw. geschlossen ohne Angaben), Batch 528.3 (FI-Systemstatus meldete „nicht in Ordnung“, Meldung abgebrochen), Batch 933.1 (Meldung „Cancelled“, Funktionen möglicherweise nicht ausgeliefert), Batch 606.1 (Funktion „Cancelled“), Batch 1216.4 (nur Überschrift „Damage code – Verify that filtering is saved“), Batch 1183.6 (Anforderungen der Fachseite nicht eingearbeitet), Batch 1086.1 (Hinweis zur Mischung aus geschlossenen und offenen Meldungen), Batch 413.3 (nicht weiterverfolgt: Signaturupload im Template Management, E-Mail-Versand bei mehrfach verwendeten Vorlagen, fehlende Aktivierungs-E-Mail nach Ergänzung fehlender Vertragsinformationen, Anzeige des Zahlungsplans im Vertragsvorschlag, fehlende MPC-Rückmeldung bei Karenzzeit-Kampagnen), Batch 865.2 (Produktverträglichkeitslogik ohne Inhalt), Batch 143.5 (Testfall zu Vertragserstellung und Aktivierung; Aktivierung bei Statuscode 200 der Zahlungsplan-API).
- Hinweis zur ZB II im Quick Guide („Das Hochladen der ZB II ist systemseitig kein Pflichtfeld, jedoch findet ohne Dokument keine Aktivierung statt“) ist dort gestrichen. Zu klären, ob und wie die ZB II die Aktivierung beeinflusst; nicht in den Text übernommen.

## Vorschläge zur Gliederung

- Neues Unterkapitel „8.8 Aktivierung von Leasingverträgen (MBLD)“ oder Aufnahme in Kapitel 21.4: Das Material zu Leasingverträgen (Sichtbarkeit für MO und MPC, Dialog „Update“ mit Fahrgestellnummer, Erstzulassung, Kennzeichen und Vertragsbeginn, Prüfung der Produktgrenzen über die Schnittstelle, Kennzeichenbereinigung) [Batch 864.1, 863.1, 873.1, 864.5, 863.5, 892.2, 517.1, 517.2] ist umfangreich und folgt einem eigenen Ablauf.
- Neues Unterkapitel „Angebotsgültigkeit und automatische Statuswechsel“ oder Abgleich mit Kapitel 5.7: Beginn, Ende und Ausnahmen der Angebotsgültigkeit sowie die automatische Ablehnung [Batch 1090.3, 891.7, 822.1] betreffen Kapitel 5.7 und 8.7 gleichermaßen.
- Unterkapitel 8.5 um „Zahlungsabhängige Aktivierungsvarianten“ erweitern oder mit Kapitel 19.15 verknüpfen: Vorab-Zahlung über MPay und Zahlung nach Aktivierung per Kreditkarte [Batch 158.2, 142.1, 903.8, 904.2] bestimmen den Aktivierungsablauf.
- Unterkapitel 8.6 um „Sammelbenachrichtigung bei Massenanlage“ als eigenen Abschnitt oder Verweis auf Kapitel 12.9 ergänzen [Batch 915.5, 381.3, 878.6].
