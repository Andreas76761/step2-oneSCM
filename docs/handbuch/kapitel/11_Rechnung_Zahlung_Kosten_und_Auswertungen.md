# 11 Rechnung, Zahlung, Kosten und Auswertungen

Dieses Kapitel beschreibt die Betriebsphase eines Servicevertrags nach dem Abschluss: Sie erstellen Rechnungen und Zahlungspläne, unterscheiden Rechnungsstatus und Zahlungsstatus, erfassen abweichende Rechnungsempfänger und Sammelrechnungen, verwalten Kosten und Claims, prüfen Werkstatt- und Lieferantenbezüge, erstellen Endabrechnungen, Erstattungen und Korrekturen und werten Daten über Reporting und Exporte aus. Die Verträge selbst verwalten Sie in Kapitel 10, die Pflege von Produkten und Preisen beschreibt Kapitel 14, die technische Anbindung der Schnittstellen Kapitel 19, und Fehlermeldungen mit Lösungswegen behandelt Kapitel 23.

## 11.1 Rechnungsstellung und Zahlpläne

**Zweck.** Sie erstellen und bearbeiten Kundenrechnungen, Werkstattrechnungen, Händlerrabatt- und Provisionsbelege sowie Gutschriften und prüfen sie vor der Weitergabe an das Finanzsystem. Zahlungspläne erzeugen Rechnungen automatisch. Manuelle Belege legen Sie im Vertrag an.

**Voraussetzungen.** Interne Kommentare, Werkstattrechnungen und Erstattungen erfassen Sie nur bei Verträgen im Status „Aktiv“. Für Verträge im Status „Closed“ oder „Cancelled“ lassen sich manuelle Rechnungen nicht anlegen, die Schaltfläche „Erstellen“ steht dann nicht zur Verfügung. Jede Rechnung braucht einen gültigen Steuersatz aus der Steuerkonfiguration des Markts. Fehlt er, zeigt das System die Meldung „No valid tax rate was found for selected Invoice Date and Document Type“.

**Rollen.** Market Operations, kurz MO, erfasst Kundenrechnungen, Werkstattrechnungen, Händlerrabatte und Provisionsbelege und gibt sie frei. Für Werkstattrechnungen internationaler Märkte legt der Admin-Bereich die Belege an. Die Rolle Admin sieht dort die Rechnungen über die Seite „International Workshop Invoices“. Die Rollen und ihre Berechtigungen beschreibt Kapitel 2.

**Rechnungsarten und Erfassungsmasken.** Die Masken unterscheiden sich je Rechnungsart. Die folgende Tabelle zeigt die Pflichtangaben, die das System prüft.

| Rechnungsart | Bezeichnung im Menü | Pflichtangaben |
|---|---|---|
| Kundenrechnung manuell, Kürzel MANU | Customer Invoice | Dokumenttyp, Empfänger, SAP-Debitorennummer, Rechnungsdatum, Rechnungszeitraum, Nettobetrag je Position |
| Händlerrabatt, Kürzel DD | Price Reduction | Rechnungsdatum, Dokumenttyp, Partnernummer, Rechnungsempfänger, SAP-Debitorennummer, genau eine Position |
| Händlerprovision, Kürzel SCOM | Dealer Commission | Dokumenttyp, Partnernummer, Rechnungsempfänger, Positionen mit Nettobetrag |
| Werkstattrechnung | Workshop Invoice, bei internationalen Märkten SIVECO Invoice | Dokumenttyp, Partnernummer, Werkstattname, WSR-Nummer, WSR-Typ, Rechnungsdatum, Reparaturdatum, Kilometerstand, Währung, drei Nettobeträge |
| Kundenerstattung | Customer Reimbursement | Dokumenttyp, Partnernummer, Werkstattname, WSR-Nummer, Rechnungsdatum, Nettobetrag je Position |
| Korrektur und Gutschrift | Make Correction, Credit Note | Dokumenttyp, Empfänger, Rechnungsreferenz, Rechnungszeitraum, bei Gutschriften genau eine Position |

**Schritt für Schritt: Kundenrechnung manuell erfassen.**

1. Öffnen Sie den Vertrag und wechseln Sie in den Reiter „Payment“. Wählen Sie im Bereich „Customer Invoice“ die Aktion „Create Invoice“.
2. Wählen Sie den Dokumenttyp „Invoice“ oder „Credit note“. Der Kundenrechnungstyp ist für manuelle Belege auf „Manually created financial documents“, Kürzel MANU, festgelegt.
3. Erfassen Sie den Kopf. Der Empfänger ist der Halter oder der Zahler. Tragen Sie die SAP-Debitorennummer ein. Eine Referenz, das Rechnungsdatum und den Zeitraum erfassen Sie ebenfalls. Das Feld „Internal Comments“ ist optional.
4. Erfassen Sie den Kopftext mit höchstens 230 Zeichen. Er wird in die Ausgabedatei an oneERP übernommen.
5. Legen Sie über „Create invoice position“ die Position an. Geben Sie „Invoice From“ und „Invoice To“ an, wobei das Ende nach dem Beginn liegt. Wählen Sie die Steuerklassifizierung „Standard“ oder „Exempt“ und erfassen Sie den Nettobetrag mit zwei Nachkommastellen. Der Positionstext umfasst höchstens 240 Zeichen. Das System berechnet Steuer und Summe.
6. Klicken Sie auf „Create“. Mit „Cancel“ öffnet sich ein Dialog, in dem Sie mit „Proceed“ die Eingaben verwerfen.
7. Das System legt die Rechnung im Status „Created“ an. Ob eine Freigabe nötig ist, entscheidet der Schwellenwert im Abschnitt „Freigabe“.

**Ergebnis und Systemstatus.** Eine neu erstellte Kundenrechnung hat den Status „Created“. Sie erscheint in der Tabelle „Customer Invoice“ im Reiter „Payment“ und im Admin-Bereich „Invoices“. Nach der Freigabe erhält sie den Status „Accepted“ und geht mit dem nächsten Export an oneERP. Die Detailansicht zeigt die Kopfdaten, die Summen aus den Positionen und die Positionstabelle mit Steuerklassifizierung und Positionstext. Ein leeres Feld zeigt das System als „-“ an.

**Freigabe.** Eine manuelle Kundenrechnung im Status „Created“ durchläuft die Freigabe, wenn ihr Nettobetrag über dem Schwellenwert der Markteinstellung liegt. Der Schwellenwert wird je Division und Markt im Feature-Bereich „New Invoice Configuration“ gepflegt. Er liegt zwischen 0,01 und 9.999,99 EUR, der Standardwert beträgt 100 EUR. Der Ersteller einer Rechnung darf sie nicht selbst freigeben. Unterhalb des Schwellenwerts setzt das System die Rechnung direkt auf „Accepted“.

Die Freigabe erfolgt über das Benachrichtigungscenter, das Sie über das Glockensymbol öffnen. Das Symbol zeigt bis neun offene Freigaben an und danach „9+“. Die Benachrichtigung lautet „Please approve invoice“ mit der Rechnungsnummer. Bei mehreren Rechnungen zeigt das Center eine gefilterte Übersicht der Rechnungen vom Typ MANU im Status „Created“ oberhalb des Schwellenwerts. Mit „Reject“ setzen Sie die Rechnung auf „Cancelled“, mit „Approve“ auf „Accepted“. Eine Benachrichtigung bleibt bestehen, bis Sie die Rechnung freigeben oder ablehnen. Verlassen Sie die Benachrichtigung ohne Entscheidung, erscheint sie nicht mehr am Glockensymbol, bleibt aber gültig.

Die Freigabe ist auch im Vertrag möglich, im Reiter „Payment“ in den Registern „Customer Invoice“ und „Workshop Invoice“. Die Aktionen „Accept“ und „Reject“ stehen nur zur Verfügung, wenn Sie nicht der Ersteller sind. Eine Änderung des Rechnungsdatums berechnet die Umsatzsteuer neu.

**Händlerrabatt manuell erfassen.** Im Reiter „Payment“ wechseln Sie in den Bereich „Price Reduction“ und wählen „Create Invoice“. Die Rechnung enthält genau eine Position. Der Rechnungstyp lautet „Manually created dealer discount“. Die SAP-Debitorennummer umfasst neun Ziffern. Die Rechnungsreferenz ist optional und verweist auf eine FI-Nummer im Status „FI Document Created“, „Paid“ oder „Paid Overdue“. Der Flow-Typ richtet sich nach dem Händlertyp. Ein interner Händlerrabatt entsteht bei eigenen Filialen des Händlers. Im Status „Created“ löschen Sie die Rechnung über das Aktionsmenü. Die Position bearbeiten Sie über die drei Punkte.

**Automatisch erzeugte Händlerrabatte und Provisionen.** Bei der Aktivierung eines Vertrags legt das System Händlerrabatte, Kampagnenrabatte und Händlerprovisionen im Status „Planned“ an. Nach dem Ende der Widerrufsfrist setzt das System sie automatisch auf „Accepted“. Storniert der Kunde innerhalb der Widerrufsfrist, storniert das System Belege im Status „Planned“ oder „Accepted“ ohne Gutschrift. Ist ein Beleg bereits exportiert, erstellt das System eine Gutschrift mit gleicher Nettohöhe im Flow-Typ „External dealer discount“. Die Gutschrift erscheint im Reiter „Price reduction“ mit dem Dokumenttyp „Credit“.

**Provisionsbelege stornieren.** Im Reiter „Dealer Commission“ wählen Sie die Aktion „Reverse“. Die Stornierung ist eine Gegenbuchung eins zu eins. Der Betrag ist schreibgeschützt, das Belegdatum entspricht dem aktuellen Datum, und den Positionstext ergänzen Sie als Begründung. Die Aktion steht ab dem Status „Exported“ zur Verfügung, ebenso bei „FI Doc Created“, „Processed“, „Paid“ und den Mahnstufen, und erst nach Ablauf der Widerrufsfrist. Im Status „Planned“ oder „Accepted“ innerhalb der Frist blendet das System die Aktion aus. Die Originalrechnung bleibt unverändert und ist mit der Stornierung verknüpft. Eine Stornierung der Stornierung erfordert eine ausdrücklich freigegebene Regel.

**Kundenrechnungen bearbeiten.** Die Aktion „Edit“ steht für Rechnungen in den Status „Planned“, „Created“ und „Accepted“ zur Verfügung. Bearbeitbar sind der Rechnungstext mit höchstens 240 Zeichen, die tatsächliche Laufleistung von 0 bis 9.999.999 und die Positionen, wobei mindestens eine Position bestehen bleibt. Die Summen aus Netto, Steuer und Gesamtbetrag berechnet das System aus den Positionen. Jede Änderung wird protokolliert. Ein Verlassen ohne Speichern zeigt den Hinweis „You have unsaved changes!“. Nach einer Änderung der SAP-Debitorennummer oder des Namens des Kunden aktualisiert das System den Empfänger bei MPPI- und MANU-Rechnungen in den Status „Planned“, „Created“ und „Accepted“.

**Kundenrechnungen löschen.** Manuell von MO erstellte Kundenrechnungen löschen Sie über „Delete Invoice“ im Aktionsmenü der Kundenrechnungstabelle. Der Dialog verlangt eine Bestätigung. Jede Löschung wird protokolliert.

**Werkstattrechnungen manuell erfassen.** Sie erfassen die Werkstattrechnung über „Create Invoice“ und den Eintrag „Workshop Invoice“. Im Kopf tragen Sie die WSR-Nummer, den WSR-Typ, das Rechnungsdatum, das Reparaturdatum, den Kilometerstand, den Dokumenttyp und die Partnernummer ein. Das Reparaturdatum liegt zwischen Vertragsstart und Vertragsende. Die Werkstatt suchen Sie über das Feld „Search Dealer“ nach Name, Stadt, VEGA-ID oder GSSN-ID. Inaktive Händler erscheinen rot. Die Warnung „Dealer is inactive. Please ensure that is the correct dealer“ fordert zur Prüfung auf. Die WSR-Nummer ist alphanumerisch und darf die Zeichen Schrägstrich, Bindestrich und Unterstrich enthalten. Sie umfasst höchstens 16 Zeichen. Der Kilometerstand umfasst höchstens sechs Stellen und endet bei 999.999.

Die Positionen legen Sie über „Create Invoice Position“ an. Pflicht sind Coverage Code, Damage Code, Damage Type und die Steuerklassifizierung. Der Damage Code umfasst höchstens sieben Zeichen, die Suche beginnt ab drei Zeichen. Der Damage Type hat zwei Stellen. Die Nettowerte für Labor, Material, Sublets und Dealer Handling sind optional, mindestens ein Wert ist erforderlich. Die Gesamtsumme netto ergibt sich aus den Werten, der Bruttobetrag aus dem Nettobetrag zuzüglich des Steuersatzes. Der Positionstext umfasst höchstens 240 Zeichen.

Die Kontingentprüfung erfolgt über alle Positionen hinweg. Das Fenster „Contingent Counter Impact“ zeigt die Werte Included, Used und To Be Consumed. Vor dem Speichern erscheint der Hinweis „1 contingent will be automatically deducted.“. Überschreitet die Anzahl das verfügbare Kontingent, blockiert das System die Rechnung mit der Meldung „The Number of contingents for this damage code exceeds the number available for this contract.“.

Eine Rechnung wird mit „Create“ gespeichert. Die Meldung lautet „was successfully created“. Schlägt das Speichern fehl, erscheint „could not be created“.

**Werkstattrechnungen bearbeiten, löschen und annehmen.** Die Bearbeitung ist nur im Status „Created“ möglich. Sie öffnen sie über die drei Punkte in der Spalte „Actions“ und die Aktion „Edit“. Die Felder entsprechen der Erfassung. Die FIN übernimmt das System aus dem Vertrag, sie ist nicht änderbar. Ein Anhang ist verpflichtend. Erlaubt sind PDF-Dateien, Bilddateien und ZIP-Dateien, die Sie über „Add Attachment“ hinzufügen. Manuelle Werkstattrechnungen löschen Sie nur im Status „Created“. Importierte Rechnungen lassen sich nicht löschen. Vor dem Löschen bestätigen Sie den Dialog, danach ist der Vorgang endgültig.

Das Annehmen erfolgt im Admin-Bereich „Invoices“ über „Accept“, das Stornieren über „Cancel“. Die Meldung lautet „Workshop invoice was successfully accepted“ beziehungsweise „was successfully cancelled“.

Eine Werkstattrechnung braucht mindestens eine Position. Ohne Positionen zeigt die Tabelle den Hinweis „There are not Invoice Positions to be displayed“ mit dem Button „Create Invoice Position“.

**Storno und Gutschrift bei manuellen Werkstattrechnungen.** Eine manuelle Werkstattrechnung lässt sich nur einmal stornieren. Die Stornorechnung selbst lässt sich wieder stornieren, danach ist eine neue Stornierung möglich. Gutschriften entstehen nicht spontan. Eine Gutschrift ist eine Stornierung vom Typ Gutschrift zu einer bestehenden manuellen Werkstattrechnung. Der Rechnungskopftext ist für manuelle Werkstattrechnungen verpflichtend.

**Werkstattrechnungen anzeigen.** Die Ansicht zeigt Werkstattrechnungen, Erstattungen und SIVECO-Rechnungen ohne horizontales Scrollen. Die Spalte „Description“ zeigt die Deckungsreferenz aus den VEGA-Codes und die Schadenbeschreibung. Neben dem Gesamtbetrag zeigt das Symbol „i“ Brutto und Steuer. Die Beträge stehen netto in der Ansicht. Die Ansicht lässt sich auf einzelne Beträge wie Labor, Sublets, Material oder Dealer Handling beschränken. Bei Vega-Claims stehen alle fünf Beträge zur Verfügung.

**Interne Kommentare.** Interne Kommentare sind für alle Rechnungstypen verfügbar. Ein Kommentar umfasst höchstens 1000 Zeichen. Eigene Kommentare bearbeiten oder löschen Sie über das Aktionsmenü. Bei Händlerrabatt-Rechnungen weisen Sie einen Kommentar einer Person über die Erwähnung mit dem @-Zeichen zu. Die Person erhält eine Benachrichtigung mit dem Link „Go to Invoice“.

**Exporttypen je Produktlinie.** Die Ausgabe an oneERP erfolgt über einen Exporttyp je Produktlinie. Für Pkw gelten die folgenden Zuordnungen.

| Produktlinie | Exporttyp |
|---|---|
| Excellent | S |
| Compact | SW |
| Compact Plus | SN |
| Advance | SG |
| Tire | TC |
| Händlerrabatt und interne Subventionen | ESUB |
| Händlerprovision | ESER |
| Erstattung und Vertragsprüfung | RI und FEA |

Für Vans gelten die Exporttypen Complete mit S, Maintenance mit SW, Maintenance Plus mit SMWT, Select Plus mit SN, Tire mit TC, Extended Warranty mit SG und Wear and Tear mit SWT. Für Leasingverträge der Variante MBLD gelten die Exporttypen LA, LB, LCL, LCO, LE, LCP, LT, LMWT, LWT, LFEA und LRI.

**Belegbeispiel MDCR.** Der Abschlussbeleg MDCR umfasst den Positionstext mit höchstens 255 Zeichen. Der Beleg hat den Belegdatum-Bereich zwischen Vertragsbeginn und heutigem Datum. Das Beispiel rechnet mit Testwerten: 12.500 km gefahren minus 10.000 km vereinbart ergibt 2.500 km. Mal 0,15 EUR je km ergibt 375,00 EUR. Der Beleg hat genau eine FI-Position und einen Nettobetrag als Pflichtfeld. Der Steuerbetrag wird berechnet und ist gesperrt. Fehlt eine Pflichtangabe, speichert das System den Beleg nicht und nennt das fehlende Feld in der Meldung. Bei einem Fehler erfolgt kein Export und keine Übermittlung an MBLD. Der Beleg erhält den Status „Created“, danach „Accepted“, „Exported“, „FI Doc Created“ und schließlich „Paid“ oder eine Mahnstufe.

**Gutschrift an oneERP.** Die Gutschrift trägt den Dokumenttyp „Credit Note“. Ihr Positionstext folgt dem Muster „Abrechnung Ihres Vertrages <Produkttyp> | Vertrag <Vertragsnummer> | Fahrzeugnr. <Fahrgestellnummer> | Kennzeichen <Kennzeichen> | Umsatzsteuer <Steuersatz> aus <Nettobetrag> EUR | Credit Note for your Invoice with Reference Number <WSR-Nummer>“.

**Schnittstellenbezug.** Die Satzarten, Dateinamen und Batch-Jobs der Ausgabe an oneERP beschreibt Kapitel 19. Die Betriebsstättennummern je Division und Produktlinie stehen ebenfalls dort.

**Besonderheiten je Rolle.** MO erstellt, prüft und gibt Belege frei. Im Admin-Bereich „Invoices“ suchen Sie Rechnungen nach Rechnungsnummer, Werkstattrechnungsnummer, Dokumenttyp, Rechnungsart, Rechnungsdatum, Empfänger, Fahrgestellnummer und Kennzeichen. Die Schaltfläche „Download“ exportiert alle Treffer der aktuellen Suche als XLSX-Datei mit dem Namen Invoices_JJJJMMTT_HHmmSS.xlsx. Ohne Treffer ist die Schaltfläche deaktiviert. Die Rolle MPC PM sieht die Rechnungen im Admin-Bereich, ohne sie zu ändern.

**Besonderheiten je Sparte und Markt.**

- Pkw und Vans nutzen unterschiedliche Exporttypen und Betriebsstättennummern. Die Zuordnung je Produktlinie zeigt die Tabelle oben.
- Leasingverträge mit dem Vertriebskanal Leasing und dem Belegtyp MDCR übermittelt das System über die Schnittstelle an MBLD. Nicht leasende Verträge gehen nie an MBLD. Die Zuständigkeit für diese Übermittlung ist im Klärungsbedarf aufgeführt.
- Provisionen bei MBLD-Verträgen gehen an MBLD-Kunden, sofern das Attribut auf TRUE steht. Bei FALSE erhält der Beleg den Status „Processed“ und geht nicht an oneERP.
- Für Provisionen der Division Van exportiert das System keine externen SCOM-Belege. Die Abstimmung der Provisionsberechnung ist im Klärungsbedarf aufgeführt.
- Die SAP-Debitorennummer ist in einigen Märkten alphanumerisch.

**Fehlerbehebung.**

- Eine fehlende Pflichtangabe verhindert die Speicherung. Die Meldung nennt das betroffene Feld.
- Erscheint die Meldung „No valid tax rate was found“, prüfen Sie die Steuerkonfiguration für das Rechnungsdatum und den Dokumenttyp.
- Der Ersteller einer Rechnung kann sie nicht selbst freigeben. Lassen Sie die Freigabe durch eine andere MO-Person durchführen.
- Rechnungen mit dem Status „Error“ nach dem Rückmeldeimport beschreibt Abschnitt 11.2.

Quellen: Batch 55.1, 61.1, 80.1, 82.1, 92.1, 95.1, 96.1, 99.1, 106.1, 142.2, 150.1, 154.1, 163.1, 164.1, 169.1, 178.2, 180.1, 184.2, 184.3, 191.2, 192.1, 192.4, 195.1, 201.2, 202.2, 204.1, 205.1, 214.1, 220.3, 222.4, 223.1, 224.1, 230.1, 233.1, 247.1, 258.4, 264.4, 274.1, 274.5, 283.2, 283.3, 284.2, 285.1, 285.4, 286.1, 286.2, 287.1, 288.1, 291.3, 291.4, 291.6, 440.2, 446.3, 447.2, 449.2, 454.2, 457.3, 459.2, 461.3, 462.2, 486.2, 691.1, 694.1, 694.3, 695.2, 695.3, 695.4, 697.1, 704.2, 714.3, 714.4, 714.5, 726.2, 727.1, 728.2, 729.2, 730.2, 732.3, 733.1, 735.3, 736.1, 817.2, 989.5, 1134.6

## 11.2 Rechnungsstatus und Zahlungsstatus unterscheiden

**Zweck.** Der Rechnungsstatus zeigt, wo ein Beleg im Ablauf steht: vorgesehen, erstellt, freigegeben, exportiert, im Finanzsystem gebucht oder storniert. Der Zahlungsstatus zeigt, ob und wann der Kunde gezahlt hat und ob eine Mahnstufe erreicht ist. Beide Status sind getrennte Angaben und bestimmen unterschiedliche Folgen. Der Zahlungsstatus steuert die Sperre des Vertrags, der Rechnungsstatus bestimmt, ob ein Beleg exportiert wird und in den Kontostand eingeht.

**Voraussetzungen.** Der Vertrag hat einen Zahlungsplan, den das System beim Aktivieren erzeugt. Die Rückmeldedateien des Finanzsystems oder der Zahlungsdienstleister MPay sind verfügbar. Die Markteinstellungen legen die Mahnstufen und Sperrgrenzen je Division fest.

**Rollen.** Market Operations, kurz MO, prüft Rechnungen mit dem Status „Error“, bestätigt Korrekturen und setzt Zahlungs- und Mahnstatus manuell, wo das System keine Rückmeldung erhält. Die Rolle Admin pflegt Rechnungen im Admin-Bereich. MPC PM und HQ PM sehen die Rechnungen und den Verlauf, ohne sie zu ändern.

**Die Statusarten im Überblick.**

| Status | Bedeutung |
|---|---|
| Planned | Der Beleg ist im Zahlungsplan vorgesehen und noch nicht zur Abrechnung freigegeben. |
| Created | Der Beleg ist erfasst und wartet auf die Freigabe. |
| Accepted | Der Beleg ist freigegeben und wird im nächsten Export berücksichtigt. |
| Exported | Der Beleg ist an das Finanzsystem übergeben. Die Buchung steht noch aus. |
| FI Document Created | Das Finanzsystem hat den Beleg mit einer FI-Nummer gebucht. |
| Paid on time | Der Ausgleich erfolgte am oder vor dem Fälligkeitsdatum. |
| Paid overdue | Der Ausgleich erfolgte nach dem Fälligkeitsdatum. |
| Dunning level 1 bis 5 | Der Beleg ist überfällig und hat die angegebene Mahnstufe erreicht. |
| Cancelled | Der Beleg ist storniert. |
| Error | Das Finanzsystem hat den Beleg abgelehnt. |
| Suspended, Terminated, Closed | Diese Status beschreiben den Vertrag und werden in Kapitel 10 und 11.6 beschrieben. |

**Regeln für die Aktualisierung des Zahlungsstatus.** Das System aktualisiert den Zahlungsstatus anhand des Nettofälligkeitsdatums, des Ausgleichsdatums und der Mahnstufe. Die Regeln lauten:

- Fälligkeit ohne Ausgleich und Mahnstufe 0: Das System ändert den Status nicht.
- Fälligkeit mit Ausgleich und Mahnstufe 0: Liegt der Ausgleich am oder vor dem Fälligkeitsdatum, lautet der Status „Paid on time“. Liegt er danach, lautet er „Paid overdue“.
- Fälligkeit ohne Ausgleich und Mahnstufe 1 bis 5: Der Status lautet „Dunning level“ mit der erreichten Stufe.
- Fälligkeit mit Ausgleich und Mahnstufe 1 bis 5: Der Status lautet „Paid overdue“.

**Schritt für Schritt: Rückmeldung des Finanzsystems prüfen.**

1. Öffnen Sie den Vertrag und wechseln Sie in den Reiter „Payment“. Die Tabelle „Customer Invoice“ zeigt den Status jeder Rechnung. Im Admin-Bereich „Invoices“ suchen Sie Rechnungen nach Status und Rechnungsnummer.
2. Prüfen Sie Rechnungen im Status „Error“. Das Finanzsystem meldet diesen Status, wenn ein Kunde oder ein Fahrzeug nicht gebucht werden kann, etwa bei einem gesperrten Kunden oder einer falschen FIN oder VIN.
3. Beheben Sie die Ursache in den Stammdaten, bevor Sie den Beleg bestätigen.
4. Wählen Sie „Confirm Fixes“. Das Dialogfenster bittet um die Bestätigung, dass die Fehler beseitigt sind, und um eine Begründung mit 10 bis 150 Zeichen.
5. Mit „Confirm“ setzt das System den Beleg auf „Accepted“. Der nächste Lauf der Rechnungserzeugung nimmt ihn wieder auf.

**Rückmeldedateien des Finanzsystems.** Die Rückmeldedatei nennt je Beleg den Buchungsstand. Die Kennung 8888888888 steht für einen Fehler, und der Status lautet dann „Error“. Die Kennung 9999999999 steht für eine Stornierung, und der Status lautet „Cancelled“. Jeder andere Eintrag setzt den Status auf „FI Document Created“. Die Datei erscheint täglich für die letzten sieben Tage. Ein Beleg mit dem Status „Exported“ und der Kennung 8888888888 bleibt im Status „Exported“, bis das Finanzsystem ihn freigibt. Die FI-Nummer bleibt bei einer Stornierung erhalten. Bei einer erfolgreichen Buchung übernimmt das System Rechnungsdatum, FI-Nummer, Nettobetrag und Steuer.

**Statushistorie.** Jede Statusänderung wird mit dem Zeitpunkt in UTC, dem Bearbeiter, dem alten und dem neuen Wert und dem Grund gespeichert. Ändert ein Batch-Lauf den Status, lautet der Grund „Automatic Change due to Batch Execution.“. Sie öffnen den Verlauf über einen Klick auf den Status oder über die Aktion „See History“. Die Liste zeigt die neuesten Einträge zuerst und zehn Einträge je Seite.

**Manuelle Änderung des Zahlungsstatus.** Den Zahlungsstatus setzen Sie im Admin-Bereich über die Option „Change status“ für Rechnungen im Status „FI Document Created“, „Paid on time“, „Paid overdue“ oder „Dunning level 1 bis 3“. Sie wählen „Paid on time“, „Paid overdue“ oder „Dunning level 1 bis 3“ und geben eine Begründung mit 10 bis 150 Zeichen ein. Bei der Mahnstufe 3 weist das System darauf hin, dass der Vertrag gesperrt wird. Die Begründung erscheint in der Änderungshistorie.

**Sperre des Vertrags bei Mahnstufen.** Die Sperre richtet sich nach den Markteinstellungen je Division. Der Vertrag wird gesperrt, wenn die Mahnstufe und die Anzahl überfälliger Rechnungen den Grenzwert erreichen. Das Beispiel im Material sperrt einen Vertrag bei Mahnstufe 3 mit zwei überfälligen Rechnungen. Bei Mahnstufe 1 bleibt er aktiv. Der Vertrag wird reaktiviert, sobald der Stand unter die Grenze sinkt, etwa wenn die Rechnung als „Paid overdue“ gilt. Das Mahnwesen zeigt die Stufen farbig. Die Stufen 1 und 2 erscheinen gelb, die Stufen 3, 4 und 5 rot. Die Summe der Beträge aller Mahnstufen erscheint als rotes Feld.

**Kontostand.** Der Kontostand steht im Kopf jeder Vertragsseite rechts oben, zusammen mit dem Vertrag und der FIN. Die Farben zeigen den Stand: grün für positive, rot für negative und grau für den Wert null. Der Betrag erscheint in EUR mit Tausendertrennzeichen und zwei Nachkommastellen. Das Infosymbol neben dem Kontostand zeigt die Aufschlüsselung. Erlöse sind die Kundenrechnungen und Preisminderungen, Kosten sind die Werkstattrechnungen, Provisionen und Lieferantenbelege. Der Kontostand ergibt sich aus Kundenrechnungen plus Preisminderungen minus Werkstattrechnungen minus Provisionen minus Lieferantenbelege. Die Werte stammen aus den Bereichen „Payment“ und berücksichtigen für Kundenrechnungen nur bezahlte Belege. Ein Vertrag ohne Werte zeigt 0,00 an. Bei Vertragsvorschlägen erscheint der Kontostand nicht.

**Rechnungsübersicht im Vertrag.** Im Bereich „Invoicing“ des Reiters „Payment“ finden Sie die Tabelle „Customer Invoice“. Die Überschrift zeigt die Anzahl der Datensätze und die Summe bezahlter Rechnungen bis heute. Die Spalten lauten Flow Type, Invoice Date, Invoice Status, Net Amount, Invoice Period, Processing Number, FI System Transfer Date, FI System Invoice Number, Invoice Number, Invoice Reference und Invoice Recipient. Fehlt ein Wert, zeigt das System „-“ an. Das Datum erscheint im Format TT.MM.JJJJ. Die Reiter „Revenue“ und „Cost“ im Bereich „Finanzbelege“ gliedern die Belege nach Kategorie. Der Reiter „Revenue“ umfasst Kundenrechnungen, Preisminderungen und Lieferantenbelege aus dem Erlös. Der Reiter „Cost“ umfasst Werkstattrechnungen, Provisionen und den Lieferantenzahlungsplan. Filter nach Invoice Category, Invoice Status, oneSCM Invoice Number und FI System Invoice Number sind verfügbar.

**Zahlungsplan und Zahlungsintervall.** Der Zahlungsplan verteilt den Gesamtpreis auf die Rechnungszeiträume. Er wird beim Aktivieren erzeugt und dauerhaft gespeichert. Die Zahlungsintervalle sind jährlich, halbjährlich, vierteljährlich, monatlich und einmalig. Bei einmaliger Zahlung entsteht eine Rechnung über die gesamte Laufzeit, bei monatlicher Zahlung eine Rechnung je Monat. Die Zahlung der jährlichen, halbjährlichen und vierteljährlichen Intervalle entspricht der 12-, 6- oder 3-fachen Monatsrate. Die erste Rechnung umfasst den Zeitraum ab dem Fälligkeitsdatum bis zum Ende des jeweiligen Intervalls, minus einen Tag. Die Netto-Rechnung je Monat ergibt sich aus dem Gesamtnetto geteilt durch die Laufzeit in Monaten.

Die Zahlungsdauer zählt als Anzahl Monate. Vor der Aktivierung errechnet das System sie aus Startdatum und Laufzeit, nach der Aktivierung aus dem Zahlungsplan.

Das Wechseln von „Monthly“ auf „One Time“ im Reiter „Payment“ erzeugt den Zahlungsplan neu. Das System zeigt dazu den Hinweis „You changed the Payment Interval! This will result in recreating the Payment Plan. Would you like to proceed?“. Sind keine Positionen an das Finanzsystem übergeben, erzeugt das System mit „Proceed“ einen neuen Plan mit einer Anforderung über die gesamte Laufzeit. Sind Positionen bereits exportiert, gebucht, bezahlt, storniert oder fehlerhaft, erzeugt das System keinen neuen Plan. Sind Positionen bereits exportiert, bezahlt, storniert oder fehlerhaft, erzeugt das System keinen neuen Plan. Vorgesehene und angelegte Positionen gehen dann in den neuen Plan über.

**Periodische Rechnungserstellung.** Der Batch für die periodischen Rechnungen läuft monatlich je Markt. Er erstellt Rechnungen für Verträge im Status „Active“, deren Zahlungsplan im aktuellen oder einem vorherigen Monat einen Eintrag hat. Das Rechnungsdatum entspricht dem Ausführungsdatum. Die Rechnung wechselt von „Created“ auf „Accepted“. Die Rechnungsdatum-Option legt den Zeitpunkt fest: Option 0 erstellt die Rechnung im Voraus, Option 1 innerhalb des Zeitraums und Option 2 rückwirkend. In Deutschland gilt die Option „in time“.

**Vorabzahlung.** Bei einer Vorabzahlung exportiert das System die Zahlung nach dem Zahlungsabschluss, auch wenn der Vertrag noch nicht aktiviert ist. Der Vertrag erhält dann den Status „Waiting for activation“. Ist der Zahlungslink nicht genutzt worden, macht MPay den Link ungültig. Den Vertrag lehnen Sie nach dem Ausbleiben der Zahlung ab.

**Zahlungsarten und MPay.** Die Zahlung über den Zahlungsdienstleister MPay umfasst Kreditkarte, UPI, Net Banking und in Korea KCP. Die Zahlung mit Kreditkarte erfolgt monatlich: Bei der Verlängerung unterscheidet das System die Pre-Activation, bei der die Verlängerung nach der Zahlung wirksam wird, und die Post-Activation, bei der sie sofort wirksam ist. Die erste Zahlung trägt die Kennung HPP, die monatlichen Zahlungen die Kennung GPP. Schlägt die Zahlung fehl, versucht das System einen Einzug nach 24 Stunden und nach einer Woche erneut. Den fehlgeschlagenen Versuch wiederholt der MO über die Aktion „Retry“. Eine abgelaufene Karte erhält einen neuen Zahlungslink mit dem Betrag null. Wird der Vertrag nicht bezahlt, sperrt das System den Vertrag nach der konfigurierten Anzahl von Tagen, und eine spätere Zahlung reaktiviert ihn. Den Zahlungsstatus einer Transaktion zeigt die Spalte „MPay Status“. Der Status lautet „Captured“, „Refunded“, „Chargeback“, „Settled“ oder „Refused“.

Die Zahlungsbedingung und die Zahlungsart je Rechnung übergibt das System an das Finanzsystem. Die Überweisung ist nur für gewerbliche Kunden vorgesehen. Die Zuordnung der Zahlungsarten je Markt beschreibt Abschnitt 20.

**Vorzeitige Abrechnung mit Digital Payments.** Den Restbetrag eines Vertrags mit periodischer Zahlung rechnet das System über eine Transaktion ab, die mit einer Vorautorisierung und einem Einzug bezahlt wird. Die Schritte beschreibt Abschnitt 11.6.

**Stornierung vor dem Export.** Im Reiter „Zahlungen“ wählen Sie für Rechnungen im Status „Accepted“ die Aktion „Stornieren“. Die Rolle MO und die Rolle MPC haben dafür Berechtigung. Im Admin-Bereich stehen die Rechnungen in den Status „Created“ und „Accepted“ zur Verfügung. Die Typen MANU, DD, CAMP, SDAS, BDCR, FDCR, WSIN und SCOM lassen sich stornieren. Das System zeigt die Warnung „Invoice will be set to Cancelled“ mit den Schaltflächen OK und Cancel.

**Schnittstellen und Fehlerbehebung.** Die Ausgabedatei an NACOS trägt den Namen E169EXP mit Datum und Uhrzeit. Die monatliche Datei erscheint MVP am 15. eines Monats. Nach dem Upload erhält der Beleg den Status „Exported“. Der Rückmeldeimport meldet Fehler im Reiter „Revenue“. Die Meldung „Error“ erscheint in der Kundenrechnungstabelle und im Admin-Bereich „Invoices“.

Die Fehler der Schnittstelle NEMESIS prüft der Admin im Bereich „NEMESIS“ über die Reiter „Vertrag“, „Kunde“, „Umsatz“ und „Kosten“. Er filtert nach Datum, Vertragsnummer, Fehlerart und Status und sendet fehlerhafte Ereignisse mit „Resend“ erneut. Mit „Resend“ werden alle vier Ereignisse eines Vertrags gesendet.  Die technische Beschreibung der Schnittstellen beschreibt Kapitel 19. Die Fehlermeldungen mit Lösungswegen beschreibt Kapitel 23.

**Umsatzsteuer nach Rechnungsart.** Der Steuerwert richtet sich nach der Art des Belegs. Kundenrechnungen vom Typ MPPI, MANU, BDCR und FDCR führen Umsatzsteuer. Werkstattrechnungen aus der Schnittstelle VEGA, Typ CLAI, führen die Steuer nach der Steuerklassifizierung. Internationale Werkstattrechnungen vom Typ WSIN führen keine Umsatzsteuer und zeigen nur den Nettobetrag. Preisminderungen DD führen für externe Händler Umsatzsteuer und für interne Händler keine. Die Kampagnen CAMP und SDAS führen keine Umsatzsteuer. Provisionen SCOM führen für externe Händler Umsatzsteuer.

**Besonderheiten je Rolle.** MO prüft Rechnungen mit Status „Error“, bestätigt Korrekturen und setzt den Zahlungsstatus manuell. MPC PM sieht die Rechnungen ohne Bearbeitungsrechte. Die Berechtigungen sind in Kapitel 2 beschrieben.

**Besonderheiten je Sparte und Markt.**

- Die Zahlungsreferenz des Kunden, etwa eine Leitweg-ID, erscheint im Kopftext der Rechnung. Die Länge beträgt im Finanzsystem oneERP bis zu 230 Zeichen und in SWT und CoFiCo bis zu 90 Zeichen.
- Für Verträge mit dem Vertriebskanal Leasing sendet das System die Schlussrechnung an das externe System. Der Ablauf steht in Abschnitt 11.6.

**Hinweise.**

- Die Rechnungsnummern folgen dem Muster 0YYXXXXXXX für Revenue und 1YYXXXXXXX für Cost. Erreicht die Nummer 9999999, folgt 2YY für Revenue und 3YY für Cost. Das Muster bleibt eindeutig über alle Rechnungsarten.
- Eine schreibgeschützte Rolle darf keine Kommentare erfassen.

**Fehlerbehebung.**

- Rechnung im Status „Error“: Prüfen Sie Kunde und FIN in den Stammdaten, beheben Sie die Ursache und bestätigen Sie mit „Confirm Fixes“. Die Begründung umfasst 10 bis 150 Zeichen.
- Ein Beleg mit dem Status „Exported“ gilt noch nicht als gebucht. Warten Sie auf die Rückmeldung des Finanzsystems.

Quellen: Batch 117.1, 119.1, 119.2, 119.3, 119.4, 130.1, 133.1, 139.1, 147.2, 152.1, 153.2, 162.1, 165.1, 167.1, 170.1, 175.1, 179.1, 192.2, 194.3, 197.2, 200.1, 200.2, 208.3, 219.1, 220.3, 222.3, 226.1, 226.3, 234.2, 235.1, 240.1, 242.2, 244.1, 247.2, 249.1, 254.1, 257.1, 258.1, 262.2, 265.1, 269.2, 274.5, 275.2, 277.1, 278.2, 279.1, 282.3, 282.4, 289.1, 290.1, 290.2, 698.1, 698.2, 701.1, 747.1, 1018.1, 1096.2, 1134.6, 1148.2, 1164.1

## 11.3 Abweichende Rechnungsempfänger und Sammelrechnung

**Zweck.** Sie legen fest, wer eine Rechnung erhält, wenn der Vertragspartner nicht der Rechnungsempfänger ist, und ob mehrere Rechnungen eines Kunden zu einer Sammelrechnung zusammengefasst werden. Außerdem steuern Sie die Übergabe der Provisions- und Lieferantenbelege an das Finanzsystem, die Übertragung eines Vertrags auf einen anderen Kunden und die Gutschrift an den Händler bei einer Kündigung.

**Voraussetzungen.** Der abweichende Rechnungsempfänger steht nur zur Verfügung, wenn der Empfänger im Finanzsystem oneERP mit einer SAP-Nummer angelegt ist. Die Auswahl erfolgt auf Vertragsebene. Gewerbliche Kunden aller Untertypen und alle Divisionen können einen abweichenden Empfänger wählen. Die Sammelrechnung setzt voraus, dass dem Kunden mehrere Verträge mit Rechnungen zugeordnet sind.

**Rollen.** Händler und Market Operations, kurz MO, legen Verträge an und wählen den Rechnungsempfänger. MO prüft die Übertragung eines Vertrags auf einen anderen Kunden und bestätigt die Gutschrift an den Händler. Die Berechtigungen beschreibt Kapitel 2.

**Schritt für Schritt: Abweichenden Rechnungsempfänger festlegen.**

1. Legen Sie den Vertrag für einen gewerblichen Kunden an und öffnen Sie die Angaben zu Kunde und Zahlung.
2. Wählen Sie in der Liste den Rechnungsempfänger aus. Die Liste zeigt Firmenname, SAP-Nummer, Straße, Postleitzahl und Ort. Sie wählen genau einen Eintrag.
3. Lassen Sie das Feld leer, wenn der Vertragspartner selbst Empfänger ist. Das System zeigt dann den Platzhalter „-“ im Reiter „Kunde“.
4. Schließen Sie den Vertrag ab. Mit der Aktivierung übergibt das System die Daten des Empfängers an die Rechnungsstellung. Der Zahler bleibt der Hauptkunde des Vertrags.


**Schritt für Schritt: Sammelrechnung steuern.**

1. Legen Sie im Assistenten für einen neuen Kunden im Schritt „Customer & Payment Information“ den Schalter „Global Collective Invoice“ fest. Der Standardwert ist „Ja“. Der Schalter gilt für den Kunden und alle weiteren Verträge dieses Kunden.
2. Prüfen Sie im Schritt „Overview & Confirmation“ den Schalter „Collective Invoices“. Er übernimmt den Wert aus dem Schritt davor und lässt sich bei neuen Kunden nicht ändern. Die Werte lauten „Included“ oder „Excluded“.
3. Bei einem bestehenden Kunden ist der globale Schalter in der Vertragserstellung nicht änderbar. Der Wert für den Vertrag übernimmt den Stand aus der Kundenverwaltung und lässt sich im Reiter „Payment“ je Vertrag ändern.
4. Eine Änderung im Reiter „Payment“ wirkt nur auf diesen Vertrag und hat keine Auswirkung auf den Kunden oder seine übrigen Verträge.


**Ergebnis und Systemstatus.** Eine Sammelrechnung umfasst nur Rechnungen desselben Kunden. Rechnungen verschiedener Kunden bleiben getrennt. Die Belege erhalten dieselbe Verarbeitungsnummer, wenn sie zusammengefasst werden. Ohne Sammelrechnung erstellt das System für jeden Erlös eine eigene Rechnung. Die Gruppierung trennt Rechnungen des Typs MPPI von den Typen MANU und trennt Rechnungen von Gutschriften. Ein Beispiel mit drei Verträgen und vier Rechnungen zeigt: Ohne Sammelrechnung entstehen vier Rechnungen. Mit einer Sammelrechnung erscheinen die Positionen in einer gemeinsamen Rechnung. Der Export erfasst Belege im Status „Accepted“.

**Self-Billing-Belege an CoFiCo und SWT.** Die Belege SCOM, SPIN und SCIN exportiert das System im Status „Accepted“ über S3 und CFT. Die Datei besteht aus drei Satzarten: Die Zeile F bildet den Kopf der Übertragung mit dem Mandat und der Verkaufsorganisation. Die Zeile H bildet den Kopf je Beleg mit der SAP-Debitorennummer, der Belegart und dem Rechnungsdatum. Die Zeile L bildet die Positionen mit Vertragsnummer, Kennzeichen, Fahrgestellnummer und Zeitraum. Ein deaktivierter Beleg wird nicht exportiert. Eine spätere Aktivierung holt den Export nach.

**Rückmeldung von SWT.** Das System liest die Rückmeldung als CSV-Datei aus dem Eingangsordner des Marktes auf S3. Die Positionen 1 bis 16 enthalten die Verarbeitungsnummer, ab Position 16 folgt die Fehlermeldung. Der Status des Belegs lautet dann „Error“. Die Spalte „Reason“ zeigt den Grund. Die typischen Fehlermeldungen lauten „Customer Not Exist“, „Account is blocked for Posting“, „HSN code is incorrect“, „Tax code is incorrect“ und „Cost center reference is unknown“. Nach der Korrektur bestätigen Sie mit „Confirm Fixes“. Der Beleg wechselt auf „Accepted“, und das Änderungsprotokoll erfasst den Vorgang.

**MBLD-Sonderregel für Leasingverträge.** Für Verträge der Division Pkw mit dem Vertriebskanal Leasing gilt eine eigene Regel. Die Rechnungen sind Einzelrechnungen, eine Sammelrechnung entsteht nicht. Die Abrechnung erfolgt zum Monatsende. Eigene Batch-Jobs übernehmen den Lauf: Der CFDM-Batch setzt die Belege von „Planned“ auf „Accepted“, der E169-Exportlauf für MBLD von „Accepted“ auf „Exported“. Die Exporttypen je Produktlinie lauten LA für Advance, LB für Basic, LCL für Classic, LCO für Compact, LE für Excellent, LCP für Compact Plus und LT für Tire. Der Schalter „Collective Invoice“ erscheint bei Leasingverträgen nicht im Reiter „Payment“.

**Übertragung eines Vertrags auf einen anderen Kunden.** Die Übertragung betrifft aktive Verträge, etwa wenn ein Fahrzeug den Halter wechselt. Der Umfang des Vertrags bleibt unverändert, und es entsteht kein zusätzlicher Vertrag. Die Übertragung ist innerhalb des Marktes möglich und unabhängig vom Zahlungsintervall.

1. Öffnen Sie den Vertrag und wählen Sie im Statusmenü die Aktion „Transfer“. Die Aktion ist nur für aktive Verträge verfügbar.
2. Erfassen Sie im Assistenten das Übertragungsdatum, den Kilometerstand, das Kennzeichen und die Zahlungsoption „Monthly“ oder „One Time“. Ein Kommentar umfasst höchstens 500 Zeichen. Das Übertragungsdatum lässt sich nur auf den Ersten eines Monats zurückdatieren.
3. Erfassen Sie den neuen Kunden mit den Pflichtfeldern Vorname, Nachname, E-Mail, Telefon und Sprache. Die Mercedes-me-ID ist optional. Der neue Kunde erhält zunächst den Status „Temporary“.
4. Prüfen Sie die Übersicht. Sie zeigt die Vertragsnummer, das Produkt, die FIN, das Datum der Erstzulassung, den Kilometerstand, das Kennzeichen, die Laufzeit und die verbleibende Laufleistung. Die Vertragsvorschau steht als PDF zur Verfügung. Die Bestätigung ist nur mit der digitalen Signatur möglich.
5. Das System führt eine CAS-Prüfung durch. Bei den Ergebnissen 3 und 4 setzt es die Übertragung fort. Bei den Ergebnissen 0 und 2 benachrichtigt es MO mit dem Hinweis „CAS Check NOK“. Bei dem Ergebnis 1 setzt es den Vertrag auf „Terminated“ mit dem VEGA-Code 014 und dem Grund „CAS Check Positive“.

Unterschreitet der eingegebene Kilometerstand den Endkilometerstand, setzt das System den Vertrag auf „Suspended“ mit dem VEGA-Code 002. Der neue Kunde unterschreibt das Novationsdokument innerhalb von 14 Tagen. Erfolgt keine Unterschrift, setzt das System den Vertrag auf „Terminated“ mit dem VEGA-Code 014 und dem Grund „Transfer Time Overdue“. Nach der erfolgreichen Übertragung steht der Vertrag auf „Active“. Das System übermittelt die neuen Kundendaten über die Schnittstelle I155 und benachrichtigt die Rechnungsstellung.

**Auswirkungen auf die Zahlung bei der Übertragung.** Bei monatlicher Zahlung setzt das System den Vertrag während der Übertragung auf „Suspended“. In dieser Zeit erzeugen die Batch-Jobs keine Rechnungen. Nach der Übertragung nimmt das System den Vertrag wieder auf. Offene Rechnungen im Status „Planned“ gehen an den neuen Kunden. Bereits erstellte oder exportierte Rechnungen bleiben unverändert. Bei einer Einmalzahlung entstehen keine Auswirkungen und keine Erstattung. Ist der Monat der Übertragung noch nicht ausgestellt, gehört die Rechnung dem neuen Eigentümer.

**Gutschrift an den Händler bei Kündigung.** Kündigt der Kunde innerhalb der Widerrufsfrist, nachdem der Händlerrabatt exportiert wurde, erstellt das System eine Gutschrift an den Händler. Die Gutschrift trägt den Flow-Typ „External dealer discount“, verweist auf die Rechnungsnummer des Händlers, hat den Dokumenttyp „Credit“ und den Zeitraum von Vertragsstart bis Vertragsende. Der Empfänger ist der Händler.

**Besonderheiten je Rolle.** Händler und MO wählen den Rechnungsempfänger bei der Vertragserstellung. MO überwacht die Übertragung und die Rückmeldungen von SWT. Der MPC PM sieht die Belege ohne Änderungsrechte.

**Besonderheiten je Sparte und Markt.**

- Der abweichende Rechnungsempfänger ist im Finanzsystem oneERP verfügbar.
- Die Self-Billing-Belege SCOM, SPIN und SCIN gehen nur an CoFiCo und SWT. Die Einstellung des Self-Billing-Modus beschreibt Abschnitt 11.5.
- Für Leasingverträge in der Division Pkw gilt die MBLD-Sonderregel mit Einzelrechnungen.

**Fehlerbehebung.**

- Eine Rechnung im Status „Error“ nach dem SWT-Feedback prüfen Sie in der Spalte „Reason“. Korrigieren Sie die Ursache, etwa Kundenstammdaten oder Steuercode, und bestätigen Sie mit „Confirm Fixes“.

Quellen: Batch 128.1, 134.1, 197.3, 207.1, 209.3, 212.1, 220.2, 246.2, 271.3, 272.1, 272.2, 273.1, 281.1, 654.3, 655.4, 656.1, 666.1, 666.2, 666.5, 693.1, 840.1, 886.1, 1134.6

## 11.4 Kostenmanagement und Claims

**Zweck.** Das Cost Management zeigt Ihnen Kosten, Kontingente und Kontostand eines Vertrags auf Basis der Schadensdaten aus dem System VEGA. Die Daten bilden zugleich die Grundlage für Auswertungen und für die buchhalterische Sicht auf den Vertrag. Im Kostenmanagement entscheiden Market Operations, ob Kosten eines Schadens an den Kunden weitergegeben werden, und verfolgen abgelehnte Claims bis zur Gutschrift an den Lieferanten.

**Voraussetzungen.** Der Vertrag ist angelegt, und die Schnittstelle I156 übermittelt die Schadensdaten an oneSCM. Beim Einfügen eines Schadens prüft das System die Vertragsnummer und ermittelt die zugehörigen Deckungen. Ein Schaden gilt als relevant für die Kostenweiterleitung, wenn die Kostenstelle der Deckung auf „Customer“ steht.

**Rollen.** Market Operations, kurz MO, prüft die Kosten einer Werkstattrechnung und gibt sie an den Kunden weiter. Eine zweite MO-Person akzeptiert die erstellte CCIN. Die Rolle ADMIN pflegt die Schadencodes und die Seite „Cross File Transfer“.

**Schritt für Schritt: Kosten an den Kunden weitergeben.**

1. Öffnen Sie den Vertrag und wechseln Sie auf der Seite „Payment Details“ in den Reiter „Workshop Invoice“.
2. Prüfen Sie in der Spalte „Actions“ die Werkstattrechnung. Die Aktion „Bill to Customer“ erscheint für eine VEGA Claim, eine manuelle Werkstattrechnung und eine SIVECO-Rechnung, deren Quellrechnung den Status „Processed“ oder „Exported“ hat. Sind diese Bedingungen nicht erfüllt, fehlt die Aktion, oder das Label „CCIN Created“ steht an ihrer Stelle.
3. Klicken Sie auf „Bill to Customer“. Das Bestätigungsfenster zeigt die CCIN-Vorschau mit dem Invoice Type CCIN, dem Document Type Invoice, dem Reparaturdatum als Invoice Date, dem Invoice Flow „Open Book Invoice“, der Nummer der Quellrechnung als Claim Reference, der Vertragsnummer als Contract Reference und dem Initial Status „Created“. Der Nettobetrag entspricht immer dem vollständigen Claim-Betrag.
4. Prüfen Sie die Vorschau. Mit „Cancel“ oder dem Schließen des Fensters wird keine Rechnung erstellt. Der Status der Quellrechnung bleibt unverändert, und die Aktion bleibt verfügbar.
5. Klicken Sie auf „Create“. Die CCIN erscheint im Bereich „Customer Invoice“ und braucht die Akzeptanz durch eine weitere MO-Person.

**Ergebnis und Systemstatus.** Nach dem Erstellen der CCIN hat die Quellrechnung den Status „Forwarded“. Das System speichert den ursprünglichen Status „Processed“ oder „Exported“, damit er bei einer Ablehnung wiederhergestellt werden kann. Der Claim-Betrag wird vom Gesamtsaldo im Reiter „Workshop Invoice“ abgezogen und im Reiter „Customer Invoice“ zum Gesamtsaldo addiert. Solange eine nicht abgelehnte CCIN zur Werkstattrechnung besteht, zeigt die Spalte „Actions“ das Label „CCIN Created“. Damit entsteht keine zweite CCIN für dieselbe Werkstattrechnung. In der Spalte „Document reference“ der Werkstattrechnung steht die oneSCM-Nummer der CCIN als Hyperlink. Der Bruttobetrag ergibt sich aus dem Nettobetrag zuzüglich Steuerbetrag, abhängig von der steuerlichen Einordnung des Kunden.

**Ablehnung der CCIN.** Lehnt eine MO-Person die CCIN ab, erhält sie den Status „Rejected“. Die Quellrechnung kehrt in ihren Ausgangsstatus zurück, also zu „Exported“, wenn sie „Exported“ war, oder zu „Processed“, wenn sie „Processed“ war. Die Aktion „Bill to Customer“ wird in der Zeile wieder angeboten. Manuelle Korrekturen sind dafür nicht erforderlich.

**Besonderheiten je Rolle.** Die automatische CCIN-Erstellung beim VEGA-Import findet statt, wenn die Kostenstelle der Deckung auf „Customer“ steht, und zwar nur für Management-Verträge. Bei der Aktion „Bill to Customer“ entscheidet dagegen die MO-Person bewusst, ob der Kunde belastet wird. Sie prüft die Rechnungsdetails und die CCIN-Vorschau, bevor sie die Kundenabrechnung auslöst.

**Sparte und Markt.** Material: keine Quellen in den RAG-Batches

**Abgelehnte Claims und Schadencodes.** Ein Claim, den VEGA ablehnt und der in oneSCM importiert wird, blendet das System in der Oberfläche aus. Lehnt VEGA den gesamten Claim ab, erscheint er nicht mehr. Das Kontingent wird dabei zurückgebucht: Im abgelehnten Claim hat das Kontingent das umgekehrte Vorzeichen. Betrug das Kontingent in der vorherigen Entscheidung +2, lautet es in der neuen Entscheidungsnummer -2. Lehnt VEGA nur einen einzelnen Schadencode ab, bleiben die übrigen Schadencodes sichtbar. Das Kontingent wird in diesem Fall ebenso behandelt wie bei einem vollständig abgelehnten Claim.

**Ablehnung eines Claims nach Erstellung eines SCIN.** Wird ein Claim abgelehnt, nachdem bereits ein SCIN erstellt wurde, hängt das Vorgehen vom Status des SCIN ab. Hat der SCIN den Status „Planned“ oder „Accepted“, storniert das System ihn. Es entstehen weder ein neuer SCIN noch eine Gutschrift. Ist der SCIN „Exported“ oder befindet er sich in einem späteren Status wie „FI Doc Created“, „Paid“ oder „Dunning Level“, bleibt sein Status unverändert. Stattdessen erstellt das System eine Gutschrift im Status „Planned“, die das Lieferantenkonto ausgleicht. Bei einem exportierten SCIN entspricht der Betrag der Gutschrift dem ursprünglichen SCIN-Betrag mit negativem Vorzeichen. Das Feld „Document Reference“ setzt die Gutschrift in eine Eltern-Kind-Beziehung zum ursprünglichen SCIN.

**Kontingentverwaltung aus Schadensmeldungen.** Übermittelt VEGA über die Schnittstelle I156 Kontingentdaten, wertet das Cost Management sie aus. Jede Inanspruchnahme einer Leistung aus dem Vertrag speichert VEGA. Die Informationen stehen in der I156 bei Satzart 20 in den Feldern „Sign“ und „Wheel Consums“. Das Feld „Sign“ enthält ein Plus, wenn ein weiteres Kontingent verbraucht wurde, und ein Minus, wenn ein verbrauchtes Kontingent zurückgenommen wurde. Das Feld „Wheel Consums“ umfasst vier Stellen, wobei die letzte Stelle die Nachkommastelle bildet. Damit erkennen Sie, wie viele Leistungen für einen Kontingentvertrag erbracht wurden. Ist das Vorzeichen ein Plus und der Wert größer als 0, erhöht die Vertragsverwaltung die Zahl der verbrauchten Kontingente um diesen Wert. Ist das Vorzeichen ein Minus, verringert sie die Zahl entsprechend. Die Kontingentdetails werden gemeinsam mit der Vertragsnummer übermittelt.

**Kostenweiterleitung bei Management-Verträgen.** Für ausgewählte Kundengruppen, etwa Militärangehörige, bietet oneSCM den Management-Vertrag an. Er sieht eine geringe monatliche oder einmalige Gebühr vor. Im Schadenfall übernimmt Mercedes-Benz die Rechnung nicht, sondern das System leitet sie direkt an den Kunden weiter. Händler und MO-Personen können diese Verträge anlegen. Das System erkennt Schäden, bei denen der Kunde die Kosten trägt, und berechnet die darin enthaltene Altteilsteuer an den Kunden weiter. Der Prozess beginnt mit dem Import des Schadens über die Schnittstelle I156. Anschließend legt oneSCM einen Vega-Schadeneintrag mit dem Status „Processed“ an.

**Garantie- und Kulanzdaten.** Die Warranty & Goodwill Claim Service API liefert Claim-Daten aus VEGA. Als Eingabe dient die Fahrzeug-Identnummer, kurz FIN,. Wird stattdessen eine VIN verwendet, validiert das System sie zunächst über VeDOC und ermittelt daraus die FIN. Erst mit der FIN ruft das System die API auf. Die API erfasst oder erzeugt keine Altteilsteuern. Die wöchentlich von VEGA bereitgestellte Datei i156 liefert diese Daten und dient zugleich als Alternative zur API. Ist die API oder der Service nicht verfügbar, zeigt das System keine Daten an.

**Schadencodes verwalten.** Im Admin-Bereich steht die Seite „VEGA Codes“ mit dem Reiter „Damage codes“ zur Verfügung. Dort zeigen Sie Schadencodes an, suchen nach ihnen, legen sie an und löschen sie.

**Cross File Transfer für die Schnittstelle I156.** Im Admin-Bereich bildet die Seite „Cross File Transfer“ die Überwachung und den Dateiupload in einer gemeinsamen Seite ab. Der Reiter „Cross File Transfer“ enthält die Überwachung, der Reiter „Files Upload“ den Dateiupload. Die Funktion steht Benutzern mit der Rolle ADMIN zur Verfügung. Im Reiter „Cross File Transfer“ zeigt die Spalte „Total Number of Items“ vor der Spalte „Status“ die Anzahl der Claims aus der Datei. Bei einem Eintrag mit dem Status „Completed“ steht in Klammern zusätzlich die Anzahl der übersprungenen Claims, zum Beispiel „1000“ mit dem Zusatz „450 skipped“. Bei den Status „Skipped“ und „Failed“ zeigt die Spalte nur die Anzahl der Claims aus der Datei. Kann die Datei nicht gelesen werden, steht dort „N/A“. Über das Symbol „…“ in der Spalte „Actions“ öffnen Sie bei Einträgen der I156 die Optionen „Details“ und „Statistics“.

Die Seite „Statistics“ zeigt die Details des jeweiligen Uploads unter dem Titel „File“ gefolgt vom Dateinamen. Sie filtern nach „Contract Number“, „Workshop Invoice Number“ und „Chassis Number“ als Texteingaben sowie nach „Status“ als Mehrfachauswahl. Mit „Search“ führen Sie die Suche aus, mit „Reset“ setzen Sie sie zurück. Die Ergebnistabelle zeigt die Spalten „Contract No.“, „Workshop Invoice No.“, „Chassis Number“, „Status“, „Reason“ und „Old Part Tax“ mit den Werten Yes oder No. Jede Spalte sortieren Sie auf- oder absteigend. Die Werte „Contract No.“ und „Workshop Invoice No.“ führen zur jeweiligen Vertragsseite beziehungsweise Rechnungsseite.

**Übersichtsansicht des Kostenmanagements.** Material: keine Quellen in den RAG-Batches

**Fehlerbehebung.** Das System verwirft einen Claim und protokolliert den Fehler in Datadog, wenn das Produkt kein Kontingentprodukt ist, wenn die Anzahl der Kontingente das im Vertrag erlaubte Maximum überschreitet oder wenn die Anzahl kleiner als 0 ist. Bei einer Claim-Korrektur darf der übermittelte Wert die noch verfügbaren Kontingente nicht übersteigen. Hat ein Vertrag maximal 4 Kontingente, davon 2 verbraucht, verwirft das System einen Claim mit 3 Kontingenten. Ist die Garantie- und Kulanz-API nicht verfügbar, zeigt das System keine Daten an.

Quellen: Batch 140.1, 211.1, 116.4, 726.1, 183.1, 708.1, 748.1, 731.1, 161.1, 742.1

## 11.5 Werkstatt- und Lieferantenbezüge

**Zweck.** Dieser Abschnitt beschreibt die Belege, die mit Werkstätten und Lieferanten zusammenhängen: Werkstattrechnungen aus der Schnittstelle VEGA und manuelle Werkstattrechnungen, Altteilsteuer, Kostenweiterleitung an Lieferanten, Lieferantenzahlungspläne sowie Lieferantenstammdaten und Berichte. Die Belege bilden die Kosten des Vertrags und stehen im Kontostand.

**Voraussetzungen.** Die wöchentliche Datei der Schnittstelle VEGA liegt im Import bereit, und der Vertrag existiert in oneSCM. Ein Händler oder Lieferant ist in der Händlerverwaltung oder im Partnermanagement erfasst. Die Händlerdaten umfassen eine VEGA-ID und bei manuellen Belegen eine SAP-Nummer. Die Rechtsgrundlage für Self-Billing ist in den Markteinstellungen hinterlegt.

**Rollen.** Market Operations, kurz MO, erfasst manuelle Werkstattrechnungen, prüft Belege und gibt sie frei. Die Rolle Admin legt Lieferanten an und pflegt das Partnermanagement. Die Rolle MPC PM sieht die Lieferantenzahlungspläne und die Berichte, ohne sie zu ändern.

**Schritt für Schritt: Werkstattrechnung im Vertrag prüfen.**

1. Öffnen Sie den Vertrag und wechseln Sie in den Reiter „Payment“. Der Bereich „Workshop Invoice“ zeigt die Werkstattrechnungen, die das System aus VEGA übernommen hat, und die manuell erfassten Belege.
2. Prüfen Sie die Spalten Workshop Invoice Number, Invoice Date, Status, Total Claim Amount und die Verweise auf die oneSCM-Rechnung und die Rechnung im Finanzsystem.
3. Öffnen Sie die Detailansicht über die Nummer. Sie zeigt den Kilometerstand im Format mit Tausendertrennzeichen, die Einheit, den Werkstattnamen, das Reparaturdatum und die Positionen. Die Positionen sind nach Deckungscode und Schadencode gruppiert.
4. Die Spalte „Invoice Reference“ zeigt bei einer Weiterbelastung an den Kunden einen Link auf die CCIN.

Die Übersicht im Reiter „Payment“ zeigt zusätzlich die Summe aller Vertragsschäden. Sie setzt sich aus dem akzeptierten Rechnungsbetrag je Vertrag, Markt und FIN zusammen. Ohne Schaden zeigt das System 0 EUR an. Der Wert fließt in den Kontostand ein.

**Schritt für Schritt: Manuelle Werkstattrechnung für eine Werkstatt prüfen.**

1. Suchen Sie die Werkstatt im Feld „Search Dealer“ nach Name oder VEGA-ID. Die erweiterte Suche umfasst Name, Stadt, VEGA-ID und GSSN-ID. Wählen Sie den Händler aus der Liste.
2. Das System übernimmt Name und VEGA-ID und sperrt sie. Die SAP-Nummer übernimmt es aus der Händlerverwaltung. Fehlt sie dort, erfassen Sie sie im Pflichtfeld „SAP Debtor Number“.
3. Das System prüft vor der Anlage das Rechnungsdatum, das nicht in der Zukunft und nicht vor dem Vertragsbeginn liegen darf. Das Reparaturdatum darf nicht nach dem Rechnungsdatum und nicht vor dem Vertragsbeginn liegen. Überschreitet der Kilometerstand die maximale Laufleistung, zeigt das System eine Warnung, die Sie bestätigen.
4. Die WSR-Nummer ist alphanumerisch und darf die Zeichen Schrägstrich, Bindestrich und Unterstrich enthalten. Sie umfasst höchstens 16 Zeichen.
5. Erfassen Sie die Positionen und speichern Sie die Rechnung. Der Status lautet „Created“, bis ein weiterer MO die Rechnung freigibt.

**Intl Claims im Vertrag.** Mit dem Schalter „International Claims“ im Vertrag erfassen Sie Werkstattrechnungen aus anderen Märkten. Der Schalter ist standardmäßig ausgeschaltet. Das Dropdown bietet die Märkte an, außer dem aktuellen Markt. Nach der Freigabe durch einen anderen MO erhält die Rechnung den Status „Accepted“. Das System exportiert sie dann an NACOS im Typ WSIN mit dem Flow „International Invoice“. Der Kontostand berücksichtigt die Rechnung. Die Fahrgestellnummer prüft das System über VeDOC, bevor es FIN und VIN speichert.

**Weekly-Export an NACOS.** Ein wöchentlicher Lauf exportiert die Werkstatt- und Lieferantenbelege im Status „Accepted“ und setzt sie auf „Exported“. Die Datei enthält den Kopf mit Mandant, Buchungskreis und Werk, die Kopfzeile je Beleg mit der Verarbeitungsnummer und der Betriebsnummer sowie die Positionen mit Material, Fahrgestellnummer, Netto und Leistungsdatum. Die Satzarten K, INIT, HEADER, HDRPAR, POS und PTXT01 beschreibt Kapitel 19. Eine nicht gesendete und gelöschte Datei meldet das System an das NACOS-Team, das die Freigabe manuell vornimmt.

**Welche Belege exportiert werden.** Werkstattrechnungen WSIN und Provisionen SCOM exportiert das System im Status „Accepted“. Provisionen SCOM gehen nur dann über E167, wenn kein Self-Billing gilt. Bei Self-Billing gehen Werkstattvergütungen und Kostenweiterleitungen über E167, Vergütungen und Provisionen über E168. Manuelle Werkstattrechnungen gehen als Erstattungs- oder Zahlungsanforderung an den Händler oder den Lieferanten. Die Weiterleitung eines Kostenbetrags an den Lieferanten oder Versicherer erfolgt über den Flow Kostenweiterleitung.

**Rückbuchung einer CCIN oder SCIN.** Ändert sich die Entscheidung eines Schadens, bucht MO die CCIN oder SCIN über die Aktion „Reverse“ zurück. Die Aktion ist bei Werkstattrechnungen vom Typ WSIN oder CLAI im Status „Forwarded“ verfügbar. Der Dokumenttyp lautet „Credit note“. Die Werkstattrechnung bleibt im Status „Forwarded“. Die Folgen hängen vom Status des Belegs ab: Ein Beleg im Status „Created“ oder „Accepted“ wird storniert. Ein exportierter Beleg erhält eine Gutschrift im Status „Created“ oder „Planned“, die MO freigibt. Ein Beleg im Status „FI Document Created“ oder „Paid“ erhält eine Gutschrift, die das System automatisch freigibt. Die Dokumentreferenz verweist auf die FI-Belegnummer. Nach der Rückbuchung ist die Aktion „Reverse“ deaktiviert.

Das Material beschreibt drei Szenarien: Eine Gesamtablehnung des Claims storniert die CCIN. Eine Aktualisierung durch VEGA ohne Rückbuchung belässt den Beleg. Bei einer Änderung des WSIN erfolgt eine vollständige Rückbuchung und eine neue Rechnung. Die Abweichung zwischen CLAI und der Summe der CCIN oder SCIN erzeugt eine Rechnung bei einem positiven Betrag und eine Gutschrift bei einem negativen Betrag.

**Altteilsteuer bei manuellen Werkstattrechnungen.** Erfassen Sie die Basis der Altteilsteuer im Feld „Old Part Tax Base“. Das System berechnet die Berechnungsgrundlage als Basis geteilt durch 10, gerundet auf zwei Nachkommastellen. Die Altteilsteuer ergibt sich aus der gerundeten Berechnungsgrundlage mal dem Umsatzsteuersatz zum Reparaturdatum, gerundet auf zwei Nachkommastellen. Das Beispiel nennt eine Basis von 257,56 EUR. Die Berechnungsgrundlage beträgt 25,76 EUR, die Altteilsteuer bei 19 Prozent Umsatzsteuer 4,89 EUR. Die beiden Felder sind danach gesperrt. Im Admin-Bereich „Financial Control“ erscheint der Eintrag im Reiter „Old Part Tax Manual“, sobald eines der Felder gefüllt ist.

Die manuelle Altteilsteuer durchläuft die Stufen Created, nach der Freigabe Accepted und nach dem Export E167 den Status Processed bei einem internen Händler oder Exported bei einem externen Händler. Das System übergibt nur den Nettobetrag an oneERP. Die Altteilsteuer selbst erfasst das Finanzsystem manuell.

**Altteilsteuer aus VEGA.** Die Datei i156 liefert die Schadensdaten. Das System prüft, ob die Teilenummer 60 vorliegt. Der Wert der Altteilsteuer ergibt sich aus dem Nettopreis mal Menge der Positionen mit der Teilenummer 60. Die Logik des Kundenanteils ist im Klärungsbedarf aufgeführt. Ohne Löschkennzeichen erstellt das System eine Gutschrift, mit Löschkennzeichen eine Rechnung. Im Admin-Bereich „Financial Control“ zeigt der Reiter „Old Part Tax“ die Belege, gruppiert nach Importdatum der i156-Datei. Die Spalten zeigen den Damage Code, den Damage Type und den Status. Die Datei E169OPT übergibt die Belege an oneERP. Die Prüfung „OK“ oder „Not OK“ vergleicht den Betrag der i156 mit dem Betrag in der E169-Datei.

Bei mehreren Schäden entsteht je Kombination aus Deckungscode und Schadencode eine Gutschrift. Mehrere Altteilsteuern eines Vertrags summiert das System. Der Export E169_OldPartTax fasst die Gutschriften desselben Schadenfalls und Händlers in einer Sammelrechnung zusammen. Der Kopf enthält die Händlerdaten, jede Gutschrift erhält eine eigene Position und einen eigenen Positionstext.

**Kostenweiterleitung an den Lieferanten.** Ist die Kostenstelle der Deckung „Supplier“, erstellt das System aus dem Schaden eine Lieferantenrechnung. Der Flow lautet „Cost Forwarding document“, der Kundenrechnungstyp „Supplier Charge Invoice“ und der Status „Accepted“. Der Zeitraum entspricht dem Reparaturdatum, der Nettobetrag dem Schadenbetrag, der Empfänger ist der Lieferant. Die Kostenereignisse gehen nicht an NEMESIS. Die debitbasierten Batch-Jobs für Lieferantenbelege laufen nicht in Deutschland.

Bei einem Management-Vertrag mit Papierschaden legt MO die Werkstattrechnung manuell an. Nach der Akzeptanz geht sie an externe Händler über E167 und bleibt bei internen Händlern im System. Die Kostenstelle „Customer“ erzeugt die CCIN automatisch.

**Lieferantenzahlungsplan.** Lieferanten erhalten einen Zahlungsplan je Deckungscode. Mehrere Lieferanten je Deckung erhalten je einen Plan, etwa zwei Reifenlieferanten zwei Pläne. Das System erzeugt die Positionen mit dem Flow „Supplier Documents“, dem Lieferantennamen, dem Belegtyp „Credit Notes“, dem Datum und dem Netto- und Bruttobetrag. Monatlich erstreckt sich eine Position über den Zeitraum vom Start bis zum Ende des Folgemonats minus einen Tag. Einmalig umfasst sie den Vertragsbeginn bis zum Vertragsende. Die Belegnummer vergibt das System erst bei „Accepted“.

Die Lieferantenbelege zeigt der Reiter „Payment“ im Bereich „Supplier Invoices“. Das Feld „Deckungscode“ filtert die Belege. Die Summen zeigen „Sum of filtered Supplier Documents“ und „Sum of All Supplier Documents“. Die Spalten lauten oneSCM-Belegnummer, FI-Belegnummer, Processing Number, FI-Transferdatum, Belegtyp, Empfänger, SAP-Debitorennummer, Referenz, Rechnungstyp „Service Provider Monthly“, Datum, Netto, Steuer, Brutto und Status.

**Manuelle Lieferantenbelege, Kürzel SMAN.** MO erfasst einen manuellen Lieferantenbeleg als Rechnung oder Gutschrift. Eine Rechnung entspricht einer Belastung des Lieferanten. Es gibt keine Betragsgrenze. Der Beleg hat eine Position im Finanzsystem. Das Steuerkennzeichen für inländische Umsatzsteuer von 19 Prozent lautet 67. Die Kennzeichen 90 für steuerfrei und 68 für Altteilsteuer lassen sich nicht wählen. Liegt der Betrag auf oder unter der Schwelle, setzt das System den Beleg auf „Accepted“. Der Export E167 übergibt den Beleg, danach erhält er den Status „Exported“ und nach der Buchung „FI Document Created“. Eine Gutschrift entsteht nur aus einem Beleg im Status „FI Document Created“. Ihr Positionstext beginnt mit „Reversal:“.

**Self-Billing für Händlerprovisionen.** Den Modus legen Sie im Admin-Bereich unter „Utility“ auf der Seite „Passenger Cars and Vans“ mit dem Schalter „SCOM Self-Billing Mode“ fest. Der Modus „Full“ bedeutet Self-Billing: Die Gutschrift geht direkt an den Händler, das Finanzsystem bucht über E168 auf das Kreditorenkonto. Der Modus „Light“ bedeutet Self-Billing Light: Der Händler erhält einen Bericht mit Verarbeitungsnummer, Vertragsnummer und Betrag und erstellt selbst die Rechnung. Das Finanzsystem gleicht sie über E167 ab. Der Modus „Light“ setzt eine Berichtsvorlage voraus. Eine Änderung wirkt nur auf neu erstellte Belege. Nur der Admin darf den Modus ändern. Für Lieferanten gilt der Modus je Lieferant.

**Lieferantenverwaltung.** Das Partnermanagement umfasst im Reiter „Supplier“ die Lieferanten. Die Suche erfolgt nach Name oder Kreditorennummer. Die Ergebnisliste zeigt Kreditorennummer, Name, Straße, Postleitzahl, Stadt, Land und „Supplier Usable“. Bei der Anlage sind Kreditorennummer, Name, Straße, Postleitzahl, Stadt und Land Pflichtfelder. Beim Speichern prüft das System auf Dubletten über die Kreditorennummer und meldet „schon registriert“. Eine Bearbeitung informiert die zugehörigen Produkte und Verträge. Einen Lieferanten löschen Sie nur, wenn er nicht genutzt wird.

**Berichte an Lieferanten.** Der Supplier Revenue Report erstellt je Lieferant und Deckungscode einen Bericht über die akzeptierten Positionen. Er entsteht beim Lauf der Lieferantenbatch-Jobs. Der Bericht enthält unter anderem Referenznummer, FIN, VIN, Vertragsbeginn, Vertragsende, Belegnummer, Verarbeitungsnummer, Rechnungszeitraum, Netto, Steuer und Gesamtbetrag. Er steht als CSV und XML zur Verfügung. Der Supplier Cost Report zeigt die Schadenkosten je Lieferant auf der Ebene des Schadencodes und entsteht mit dem SCIN-Export. Empfänger ist der Lieferant oder MPC. Die Sprache richtet sich nach dem Lieferanten.

**Händlerdaten für Belege.** Die Händlerverwaltungstabelle ordnet die VEGA-ID dem Namen und der SAP-Nummer zu. Ist ein Händler in der Tabelle vorhanden, übernimmt das System Name und SAP-Nummer. Fehlt er, ruft das System die Daten aus GSSN+ für aktive Händler ab. Die SAP-Nummer ergänzt der MO manuell, wenn sie fehlt.

**Besonderheiten je Rolle.** MO erfasst, prüft und gibt die manuellen Belege frei. MPC PM sieht Lieferantenzahlungspläne und Berichte. Der Admin pflegt die Lieferanten und das Partnermanagement. Die Berechtigungen beschreibt Kapitel 2.

**Besonderheiten je Sparte und Markt.**

- Der Lieferant erhält für Reifen eine Deckung mit mindestens einer optionalen Coverage. Bei der Kostenstelle „Supplier“ wählt das System nur gültige Lieferanten aus. Die Kostenstelle „MB“ bleibt davon unberührt.
- Die debitbasierten Batch-Jobs für Lieferantenbelege laufen nicht in Deutschland.
- Das Material nennt für Indien, dass Self-Billing dort gesetzlich nicht erlaubt ist. Die Zuordnung der Modi je Markt ist im Klärungsbedarf aufgeführt.

**Fehlerbehebung.**

- Die Meldung „schon registriert“ bei einer Lieferantenanlage zeigt eine Dublette über die Kreditorennummer an. Prüfen Sie den bestehenden Eintrag im Partnermanagement.
- Eine Werkstattrechnung mit der Meldung „Error“ erhält die Korrektur über die Abschnitte 11.2 und 11.4.
- Ist die Altteilsteuer nicht korrekt, prüfen Sie den Reiter „Old Part Tax“ im Admin-Bereich „Financial Control“ und vergleichen Sie den Betrag mit der i156.

Quellen: Batch 110.1, 116.3, 116.5, 121.2, 131.2, 136.1, 183.5, 189.1, 200.3, 249.5, 274.5, 625.1, 631.5, 652.1, 693.1, 702.1, 703.2, 706.1, 707.1, 708.3, 709.1, 710.1, 710.3, 710.4, 710.6, 711.2, 717.1, 722.1, 724.1, 729.1, 730.3, 734.1, 740.2, 740.4, 740.7, 741.1, 741.2, 741.3, 742.2, 744.4, 746.1, 872.2, 872.4, 872.5, 1119.3, 1125.1, 1125.5, 551.5, 1134.6, 692.1

## 11.6 Endabrechnung, Erstattung und Korrekturen

**Zweck.** Dieser Abschnitt beschreibt, wie oneSCM Rechnungen und Gutschriften beim Vertragsende, bei einer vorzeitigen Beendigung und bei einer Kündigung abrechnet. Außerdem zeigt er die Erstattung von Zahlungen über MPay, die Korrektur von Belegen und den Abschluss des Vertrags.

**Voraussetzungen.** Der Vertrag hat einen Zahlungsplan und die Belege, die zum Ende gehören. Für eine Erstattung über MPay muss die Transaktion den Status „Settled“ haben. Eine Korrektur setzt einen Beleg im Status „FI Document Created“, „Paid“, „Paid overdue“ oder einer Mahnstufe voraus.

**Rollen.** Market Operations, kurz MO, entscheidet über Gutschriften und Korrekturen, gibt Belege frei und löst Erstattungen aus. Der Admin pflegt die Löschregel in der Marktkonfiguration. Das Kundenmanagement erfasst die Bankdaten für Erstattungen. Die Rollen beschreibt Kapitel 2.

**Schritt für Schritt: Beendigung innerhalb der Widerrufsfrist abrechnen.**

1. Öffnen Sie den Vertrag und wechseln Sie in den Reiter „Payment“. Prüfen Sie die Rechnungen, die nach der Kündigung betroffen sind.
2. Planned-Rechnungen des Typs MPPI setzt das System auf „Cancelled“. Accepted-Rechnungen werden ebenfalls storniert.
3. Für exportierte Rechnungen erstellt das System eine Gutschrift im Flow-Typ „Periodically payment“ mit dem Status „Created“. Die Gutschrift trägt den Nettobetrag der Ursprungsrechnung, den Zeitraum von Vertragsstart bis Vertragsende und den Empfänger, den Kunden.
4. Rechnungen im Status „FI Document Created“ oder „Paid“ erhalten eine Gutschrift, die das System automatisch freigibt. Bei einer manuell auf „Paid“ gesetzten Rechnung erstellt das System die Gutschrift im Status „Accepted“.
5. Prüfen Sie die Gutschriften und geben Sie die manuell freizugebenden frei.


**Ergebnis und Systemstatus.** Stornierte Belege gehen nicht in den Kontostand ein. Die Gutschriften übergibt das System mit dem nächsten Export an oneERP.

**Abrechnung je Rechnungstyp.** Die folgende Tabelle zeigt, welche Aktion das System je Rechnungstyp ausführt.

| Rechnungstyp | Innerhalb der Widerrufsfrist | Nach der Widerrufsfrist ohne Rückdatierung | Nach der Widerrufsfrist mit Rückdatierung |
|---|---|---|---|
| MPPI | Planned wird storniert. Accepted, exportierte und gebuchte Belege werden über Gutschriften abgerechnet. | Planned wird storniert. Accepted bleibt und ist fällig. Exportierte und gebuchte Belege bleiben unverändert. | Planned und Accepted werden storniert. Exportierte Belege prüft MO manuell. |
| MANU | Die Entscheidung trifft das MO-Team: Storno, Erstellung oder Ablehnung. | MO prüft den Beleg. | MO prüft den Beleg. |
| DD, CAMP, SDAS, SCDAS, SCOM | Planned wird storniert, ohne Gutschrift. | Accepted und exportierte Belege bleiben unverändert. CAMP, SDAS und SCDAS bleiben auch bei FI-Buchung unverändert. | Accepted wird storniert. Die Prüfung erfolgt manuell. |
| WSIN, IWSIN, RI | Die Erstellung bleibt zugelassen, wenn das Reparaturdatum vor dem Beendigungsdatum liegt. Sonst lehnt das System sie ab. | Die Erstellung bleibt zugelassen, wenn das Reparaturdatum vor dem Beendigungsdatum liegt. | Die Erstellung bleibt zugelassen, wenn das Reparaturdatum vor dem Beendigungsdatum liegt. |
| CLAI, CCIN | Keine Aktion. | Keine Aktion. | Keine Aktion. |
| FDCR, BDCR | Unverändert. FDCR wird am Vertragsende erstellt. | Unverändert. | Unverändert. |
| SPMP | Planned wird storniert. | Accepted und exportierte Belege bleiben unverändert. | Die Prüfung erfolgt manuell. |

Beendet der Vertrag wegen Laufleistung, Kontingent oder Zeit, storniert das System nichts. Die Rechnungsstellung läuft bis zum formalen Vertragsende weiter.

**Vorzeitige Beendigung bei monatlicher Zahlung.** Der Vertrag wechselt von „Active“ auf „Terminated“, und die vorgesehenen Rechnungen werden storniert. Ein Auswahlfeld legt das Datum fest, ab dem die Abrechnung gilt. Die Abrechnung erfolgt in zwei Fällen:

- Fall 1: Die Rechnungen sind nicht an das Finanzsystem übermittelt. Die Positionen im Status „Planned“ oder „Accepted“ werden storniert.
- Fall 2: Die Rechnungen sind übermittelt, etwa im Status „Exported“, „FI Document Created“ oder „Paid“. Sie behalten ihren Status. Das System erstellt keine automatische Gutschrift. MO berechnet die Rückerstattung und erstellt den Beleg manuell.

Bei einer Einmalzahlung erfolgt keine Erstattung.

**Kündigung eines aktiven Vertrags.** Ist im Vertrag keine Rechnung an das Finanzsystem übermittelt, storniert das System alle Rechnungen mit dem Grund „Contract cancellation“. Ist mindestens eine Rechnung übermittelt, erstellt das System für jede bezahlte Rechnung eine Gutschrift oder Rechnung mit gleichem Empfänger, Nettobetrag und Zeitraum. Die Referenz verweist auf die FI-Nummer. Die bezahlte Rechnung bleibt unverändert. Neue Rechnungen erhalten den Status „Planned“. Die Belege mit dem Status „Planned“, „Accepted“, „Exported“, „FI Document Created“ oder einer Mahnstufe 1 bis 3 werden storniert. Bei NACOS erstellt MO die Gutschrift manuell.

**Schritt für Schritt: Vorzeitige Abrechnung mit Digital Payments.**

1. Öffnen Sie den Vertrag und wechseln Sie in den Reiter „Payment“. Im Bereich „Payment Information“ wählen Sie im Dropdown „Payment Interval“ den Eintrag „One Time“.
2. Prüfen Sie die Summe der Positionen im Status „Planned“. Das System bildet daraus den Restbetrag.
3. Hat mindestens eine Position einen anderen Status als „Planned“, bleibt der Plan unverändert. Die Positionen im Status „Planned“ wechseln auf „Accepted“, sobald MPay den Einzug als „Captured“ oder „Failed“ meldet. Im Fall „Failed“ wiederholt MO den Einzug über „Retry“.
4. Sind alle Positionen „Planned“, erstellt das System einen neuen Zahlungsplan mit einer Rechnung über die Summe. Die Transaktion erfolgt über PreAuth und Capture.


**Vertragsprüfung bei Mehr- und Minderkilometern.** Bei Verträgen mit einer jährlichen Laufleistung prüft das System zum Vertragsjubiläum die vereinbarte und die gefahrene Jahresfahrleistung. Eine Überschreitung berechnet das System nach dem Kilometerpreis. Eine Unterschreitung führt nicht zu einer Erstattung. Die Regel steht im Klärungsbedarf. Eine Toleranz von 10 Prozent gilt. Die Kilometer kumulieren sich nicht. Die Schlussprüfung bei der Beendigung umfasst jeden Kilometer, ein Übertrag findet nicht statt. Das System erstellt jährlich einen BDCR-Beleg und am Ende einen FDCR-Beleg im Flow-Typ „Contract Review Documents“. Die Belege übergibt das System über E169 an das Finanzsystem.

**Abschlussbeleg MDCR.** Der Beleg MDCR erfasst die Endabrechnung. Die Felder, die Pflichtangaben und die Exportwege beschreibt Abschnitt 11.1. Der Beleg erhält die Belegreferenz erst ab dem Status „FI Document Created“. Der Export erfolgt über E169, CoFiCo und SWT. Die Übermittlung an MBLD über eine Schnittstelle ist im Klärungsbedarf aufgeführt.

**Leasing: Schlussrechnung an das externe System.** Ist ein Leasingvertrag gekündigt, übermittelt das System die Schlussrechnung automatisch an das externe System, sobald sie den Status „FI Document Created“ erreicht. Die Übermittlung setzt voraus, dass der Vertrag den Status „TERMINATED“, den Vertriebskanal „LEASING“ und das Kontrollkästchen „Schlussabrechnung“ hat. Der Belegtyp ist MANU mit dem Dokumenttyp INVOICE. Gutschriften, Stornierungen, Zahlungen und Mahnungen lösen keine Übermittlung aus. Den Ablauf und die Schnittstelle beschreibt Kapitel 19.

**Erstattung über MPay.** Die Erstattung setzt eine Transaktion im MPay-Status „Settled“ voraus. Sie erfolgt auf einem von zwei Wegen.

1. Weg 1: Öffnen Sie im Reiter „Payment“ die Kundenrechnungen und wählen Sie „Create Invoice“. Wählen Sie den Dokumenttyp „Credit Note“ und die FI-Nummer der Rechnung als Rechnungsreferenz. Die Gutschrift darf den Transaktionsbetrag und den bezahlten Nettobetrag nicht überschreiten.
2. Weg 2: Wählen Sie bei einer Rechnung im Status „Paid“ mit dem MPay-Status „Settled“ die Aktion „Make Correction“. Auf der Seite „Create Customer Invoice“ wählen Sie den Dokumenttyp „Credit Note“. Die Rechnungsreferenz ist vorbelegt und gesperrt.

Das Ergebnis ist ein Zahlungsplan-Eintrag im Status „Accepted“ mit dem MPay-Status „Created“. Die Gutschrift erfolgt über die Refund-API, die Rechnung über die Create-Transaction-API.

Erstattet MPay eine Zahlung ohne MMe-Konto, unterscheidet das System nach dem Zeitpunkt der Erfassung. Innerhalb von sechs Monaten nach dem Status „Captured“ erstattet das System automatisch über den Refund-Endpunkt von MPay ohne IBAN und ohne Benachrichtigung. Nach sechs Monaten erfolgt die Auszahlung manuell. MO prüft, ob eine IBAN vorliegt. Fehlt sie, erscheint der Dialog „Refund Specific Payout Notification“. Der Kunde erhält einen Link zum Customer Self-Service mit einem Autorisierungscode, der 15 Minuten gilt. Er gibt seine IBAN ein. Das Kundenmanagement prüft die IBAN über die SWIFT-Validierung und speichert sie als „Payment Refund Information“. Die Freigabe bleibt gesperrt, bis die IBAN vorliegt. Danach erfolgt die Überweisung. MO pflegt die IBAN nicht selbst.

Bei einer Kündigung innerhalb der Kulanzfrist mit Zahlungen über MPay erzeugt das System automatisch eine Gutschrift und eine Erstattungstransaktion. Die Gutschrift trägt den Flow-Typ „Periodically payment“ und den Status „Created“. Der Auslöser ist MO.

Wird ein Vertrag mit Vorabzahlung abgelehnt, nachdem er den Status „Waiting for activation“ erreicht hat, erstattet das System den bezahlten Betrag über MPay. Die Gutschrift entspricht dem bezahlten Rechnungsbetrag und ist mit der Originalrechnung verknüpft.

**Chargeback.** Eine Rückbuchung meldet MPay mit einem der Typen „settlement“, „reversal“, „request“ oder „secondChargeback“. Die Rechnung bleibt im Status, der MPay-Status ändert sich. Bei „secondChargeback“ erstellt das System eine Gutschrift im Status „Created“. MO nimmt die Gutschrift an, wenn die Rückbuchung berechtigt ist, und lehnt sie ab, wenn sie unberechtigt ist. Der Export übergibt die Operation-ID der Erstattung.

**Schritt für Schritt: Manuelle Werkstattrechnung korrigieren.**

1. Öffnen Sie die Werkstattrechnung im Status „Exported“ oder „Processed“ und wählen Sie die Aktion „Reverse“. Das System erstellt einen Gegenbeleg. Die Gegenbuchung macht aus einer Rechnung eine Gutschrift und aus einer Gutschrift eine Rechnung.
2. Bearbeiten Sie die WSR-Nummer, das Rechnungsdatum und den Anhang. Die Belegart, die WSIN, der Kilometerstand, das Reparaturdatum, die Währung, die Partnernummer und die SAP-Nummer sind gesperrt.
3. Prüfen Sie die übernommenen Positionen des Ursprungsbelegs.
4. Erstellen Sie den Beleg. Ein anderer MO gibt ihn frei. Der neue Beleg erscheint im Reiter „Payment“ unter „Workshop Invoice“.

Die Historie zeigt beim neuen Beleg „Correction for“ und beim Ursprungsbeleg „Corrected by“.

**Schritt für Schritt: Händlerprovision korrigieren.**

1. Wechseln Sie im Reiter „Payment“ in den Reiter „Dealer Commission“ und wählen Sie die Aktion „Correction“.
2. Auf der Seite „Edit“ ist der Dokumenttyp „Credit Note“ vorbelegt und nicht änderbar. Erfassen Sie die VEGA-ID des neuen Händlers mit fünf Stellen. Die Empfänger- und SAP-Angaben übernimmt das System.
3. Speichern Sie die Korrektur. Der Beleg wird im Status „Created“ angelegt und von einem anderen MO freigegeben.

Bei Belegen im Status „Planned“ oder „Accepted“ storniert das System den ursprünglichen Beleg mit der Historie „Change Dealer“ und erstellt eine neue Gutschrift für den neuen Händler. Bei Belegen im Status „Exported“, „FI Document Created“ oder „Paid“ erstellt das System eine Korrekturrechnung für den ursprünglichen Händler im Status „Accepted“ und eine Gutschrift für den neuen Händler im Status „Created“. Provisionen unterliegen nicht dem Mahnverfahren, die Auszahlung erfolgt über Self-Billing.

**Händlerwechsel innerhalb der Kulanzfrist.** Wechselt der Vertragshändler innerhalb der Kulanzfrist, passt das System die Händlerrabatt- und Provisionsbelege an. Belege in den Status „Planned“, „Accepted“ oder „Created“ storniert das System automatisch und erzeugt einen neuen Beleg für den neuen Händler. Belege in den Status „Exported“, „FI Document Created“, „Paid“ oder Mahnstufen erhalten einen Gegenbeleg und einen neuen Beleg. Die Änderung ist nur innerhalb der Kulanzfrist möglich.

**Korrekturrechnung einer manuellen Kundenrechnung.** Die Aktion „Correction“ steht für Belege mit dem Status „FI Document Created“, „Paid“, „Paid overdue“ oder einer Mahnstufe 1 bis 3 zur Verfügung. Die Seite übernimmt den Typ MANU. Der Dokumenttyp ist „Credit Note“ oder „Invoice“. Bei einer Gutschrift ist genau eine Position zulässig. Die Referenz ist die FI-Nummer und nicht änderbar. Der Steuersatz richtet sich nach der Steuerklassifizierung der Position. Die Herkunft der Steuersätze ist im Klärungsbedarf aufgeführt.

**Vertragsstatus Geschlossen.** Ein Vertrag mit dem Status „Terminated“ oder „Expired“ erhält nach 30 Tagen automatisch den Status „Closed“. Vorher müssen die Endabrechnung und die Schlussrechnung oder Gutschrift erfolgt sein. Den Status „Closed“ setzt MO nicht manuell. Ein geschlossener Vertrag lässt sich nicht reaktivieren. Die Übermittlung an VEGA erfolgt über die Schnittstelle I155 mit den Codes 103 für „Terminated“ und 102 für „Expired“. Der Kunde erhält keine E-Mail. Weitere aktive Verträge des Kunden bleiben einsehbar.

**Löschregel nach DSGVO.** Die Marktkonfiguration legt die Löschregel fest. Danach löscht das System Kundenrechnungen, Werkstattrechnungen, Preisminderungen und Provisionen nach dem Ende der Angebotsgültigkeit zuzüglich sechs Monaten oder nach dem Jahresende des Jahres, in dem der Vertrag den Status „CLOSED“ erhält, zuzüglich zehn Jahren. Die Regel ist im Klärungsbedarf aufgeführt.

**Affiliate-Status.** Der Affiliate-Status des Händlers stammt aus dem Dealership Management. Er bestimmt, ob ein Beleg als intern oder extern behandelt wird. Die Belege sind die Werkstattrechnungen aus VEGA, die manuellen Werkstattrechnungen, die Händlerrabatte, die Provisionen und die Exporte E167, E169 und E174.

**Besonderheiten je Rolle.** MO entscheidet über Gutschriften, Korrekturen und Erstattungen. Der Admin pflegt die Löschregel in der Marktkonfiguration. Das Kundenmanagement erfasst die Bankdaten für Erstattungen. Der MPC PM sieht die Belege ohne Änderungsrechte.

**Besonderheiten je Sparte und Markt.**

- Die Erstattung ohne MMe-Konto gilt für Digital Payments. Die Fristen beziehen sich auf den Status „Captured“.
- Bei einem Einmalvertrag in Belgien storniert das System die Rechnungen bei einer vorzeitigen Beendigung.
- Die Summe der Vertragspreise für NEMESIS entspricht nach dem Material der Summe der Nettobeträge aus MPPI, MANU, CAMP, DD, BDCR und FDCR. Die Formel ist im Klärungsbedarf aufgeführt.

**Fehlerbehebung.**

- Bei einer Rückdatierung nach der Widerrufsfrist erstellt das System keine automatische Gutschrift im Typ MPPI. Prüfen Sie den Beleg manuell.

Quellen: Batch 55.1, 80.1, 103.1, 120.1, 133.1, 138.3, 146.1, 149.1, 158.1, 166.1, 174.1, 176.2, 179.4, 188.1, 193.1, 209.2, 214.1, 215.1, 221.1, 231.3, 236.1, 245.1, 260.3, 265.2, 274.2, 274.5, 282.3, 286.2, 519.1, 519.2, 519.3, 519.4, 519.5, 705.1, 712.1, 854.2

## 11.7 Reporting, Filter und Exporte

**Zweck.** Dieser Abschnitt zeigt, wie Sie die Exporte an Finanzsysteme prüfen, Dateien herunterladen, Rechnungen filtern und Übertragungen überwachen. Die Auswertungen für Controlling und Reporting stellt oneSCM über Datenprodukte bereit. Den technischen Aufbau beschreibt Kapitel 19.

**Voraussetzungen.** Die Exportläufe der Finanzschnittstellen E167, E168, E169 und E174 sind eingerichtet. Die Rückmeldedateien der Finanzsysteme liegen im Import. Für die Überwachung der Dateiübertragung ist die Seite „Cross File Transfer“ verfügbar.

**Rollen.** Der MPC PM und MO prüfen Exportzahlen und Rückmeldungen im Bereich „Financial Control“. Die Rolle Admin plant und startet Batch-Jobs, lädt Dateien herunter und pflegt die Seite „Cross File Transfer“. Die Rolle HQ verfolgt die Exporte über die Seite „Financial Control“. Die Berechtigungen beschreibt Kapitel 2.

**Schritt für Schritt: Export-Plausibilität prüfen.**

1. Öffnen Sie den Admin-Bereich und wählen Sie „Financial Control“. Wechseln Sie in den Reiter „Export Counter / Checks“.
2. Suchen Sie nach Dateiname, Schnittstelle, Datum oder Check. Die Schaltfläche „Search“ startet die Suche, „Reset“ setzt die Felder zurück.
3. Die Ergebnisliste zeigt Dateiname, Schnittstelle, Exportdatum, die Anzahl der Rechnungen unter „Invoices“, die Anzahl der exportierten Positionen unter „Exported Invoices“ sowie den Check „OK“ oder „Not OK“.
4. Öffnen Sie bei „Not OK“ den Eintrag „More Details“. Er nennt die Vertrags- und Rechnungsnummern, die fehlen oder nicht gezählt wurden.

Die Zählregeln unterscheiden sich je Exportdatei. Bei E169 zählen MPPI-Rechnungen mit einer Periode bis heute oder früher und MANU-Rechnungen im Status „Accepted“. Bei E174 zählen alle Belege im Status „Accepted“, bei E167 die Belege externer Händler im Status „Accepted“. Der Vertrag muss aktiv sein. Bei einer Zahlung über MPay zählt zusätzlich der Status „Captured“ oder „Refunded“. Der Zähler setzt sich je Datei zurück. Nach dem Export bleibt der Beleg im Status „Exported“.

**Schritt für Schritt: E169-Summen prüfen.**

1. Wählen Sie im Admin-Bereich „Financial Control“ den Reiter „E169 Checks“.
2. Filtern Sie nach Dateityp, Status, Exportdatum, Importdatum und Dateiname. Die Dateitypen umfassen SG, IF, EXTSUB, EXTSER und OPT. Die Ergebnisliste zeigt den Status „Exported“, „Import Pending“ oder „Imported“.
3. Vergleichen Sie die Gesamtsumme des Exports mit der Gesamtsumme des Imports. Die Summe des Exports umfasst alle Zeilen und den Nettobetrag. Die Summe des Imports schließt die Finanzbuchungsnummer 888888888 aus.
4. Die Prüfung zeigt „OK“ bei Übereinstimmung und „Not OK“ bei Abweichung.

Die Positionen in den Dateien beschreibt Kapitel 19. Die Beträge in der Datei sind mit dem Faktor 100 angegeben. Für Rückmeldungen von SWT zeigt der Bereich „Feedback“ die Summe der Zeilen des Typs L beim Export und die Summe der Rechnungsstatus 10 beim Import.

**Schritt für Schritt: Dateien herunterladen.**

1. Öffnen Sie die Seite „Batch Job Console Files“ im Admin-Bereich.
2. Markieren Sie die gewünschten Dateien mit dem Kontrollkästchen.
3. Klicken Sie auf „Download“. Bei mehreren Dateien erhalten Sie eine ZIP-Datei.
4. Mit „Back“ kehren Sie zur Übersicht zurück. Bei den Batch-Jobs der Rolle Admin und HQ öffnen Sie über das Aktionsmenü die Ansicht „View“.

**Filter im Admin-Bereich.** Die Filter der Rechnungsliste bleiben erhalten, bis Sie sie selbst zurücksetzen oder ändern. Das gilt beim Wechsel auf eine andere Seite der Liste und auch für die weiteren Filter. Die Hauptfilter umfassen die Verarbeitungsnummer, den Rechnungsstatus, die Nummer des Rechnungsempfängers und die Vertragsnummer. Die weiteren Filter umfassen die oneSCM-Rechnungsnummer, die FI-Systemrechnungsnummer, den Dokumenttyp, den Rechnungstyp, das Rechnungsdatum, den Namen des Empfängers, die Fahrgestellnummer und das Kennzeichen. Die Suche startet mit „Search“.

**Exporte für Vertriebskampagnen.** Der Export für Vertriebskampagnen ist ein monatlicher Lauf am Monatsende. Er erzeugt eine UTF-8-Datei, deren Name Datum und Uhrzeit trägt. Bei hohem Datenvolumen erfolgen mehrere Dateien. Der Export erfasst Belege im Status „Accepted“ mit dem Typ XXX. Nach dem Upload erhält der Beleg den Status „Exported“. Die Verarbeitungsnummer steht nicht in der Datei. Die Buchungszeilen unterscheiden die Sätze 0, 1 und 2. Der Export gilt nur für Deutschland. Den Dateinamen und die Konten führt der Klärungsbedarf auf.

**Kopfsatz und Positionstexte für den Händlerrabatt E174.** Der Kopfsatz trägt für Händlerrabatte den Text „SC Dealer Subsidies“ und für Händlerprovisionen den Text „SC Commissions“, jeweils mit Monat und Jahr. Die Zeilen mit dem Buchungsschlüssel 40 tragen die Auftragsnummer und den Kundennamen als Positionstext. Das Erlösgebiet richtet sich nach dem Produkt. Der Export E174 für Verkaufskampagnen verwendet ein eigenes Erlösgebiet für Verkäufe.

**MOT- und AT-Export E167.** Die gesetzlich geprüften MOT-Beträge und die Altteilsteuer aus der manuellen Werkstattrechnung gehen über den Export E167 an oneERP. Die Zeilen mit dem Schlüssel 50 erfassen die Rechnung und die Zeilen mit dem Schlüssel 40 die Gutschrift. Die Steuerkennzeichen 67, 68, 90 und 92 steuern die Behandlung im Finanzsystem. Bei nur MOT erhält die Zeile mit 50 das Steuerkennzeichen 90 und eine eigene Materialnummer. Bei MOT und AT zusammen bleibt die Reparatur beim Steuerkennzeichen 67, MOT erhält 90 und die Altteilsteuer 68 bei Gutschriften oder 92 bei Rechnungen. Beträge mit gleicher Steuerklassifizierung summiert das System je Zeile. Eine Gutschrift kehrt das Vorzeichen um.

**Exporttypen und Dateibezeichnungen.** Die Exporttypen sind fünfstellig. Drei Typen wurden umbenannt: MTNEXW zu MTNEW, LMTNWT zu LMTWT und LMTNEX zu LMTEW. Die Batch-Jobs für die Self-Billing-Exporte heißen CoFiCoE168InvEXP und SWTE168InvEXP. Der Exporttyp für die E169-Datei richtet sich nach der Rechnungsart: EXTSUB für Händlerrabatte, FEA für den Endsaldo, IF für internationale Claims und SG für MPPI und MANU bei CompleteCare und Excellent. Weitere Exporttypen je Produktlinie zeigt Abschnitt 11.1.

**Cross File Transfer überwachen.** Die Seite „Cross File Transfer“ im Admin-Bereich zeigt den Datenaustausch zwischen VEGA, NACOS und oneSCM in den Stufen externes System, CFT, S3, Import in oneSCM und erzeugte Dateien. Die Filter umfassen Dateityp, Dateiname, Quelle, Ziel und Status. Der Status lautet „In Progress“, „Completed“ oder „Failed“. Die Spalte „Letzte Aktualisierung“ zeigt den Zeitpunkt. Über „More Details“ öffnen Sie den Verlauf der Übertragung. Der Reiter „Files Upload“ dient dem Hochladen.

**NEMESIS-Fehler prüfen.** Der Admin prüft die Übertragung der Ereignisse an NEMESIS im Bereich „NEMESIS“. Ein Ereignis, das die Validierung nicht besteht, sendet das System nicht. Die Fehlerart „Infrastructure“ erscheint in den Reitern Vertrag, Kunde, Umsatz und Kosten. Mit „Resend“ senden Sie die Ereignisse erneut. Die Ergebnisliste zeigt Vorfallsdatum, Fehlerart, Vertragsnummer, Fehlergrund und Status.

**Reporting und Datenprodukte.** Die Datenprodukte für Reporting umfassen unter anderem base_sc_cost_invoice, base_sc_revenue_contract, base_sc_revenue_invoice und SC Financials. Sie enthalten Angaben zur Verarbeitungsnummer, zum Verkaufsprovisionsbetrag, zur Rechnungsart und zum Rechnungsfluss. Die Bereitstellung über das Unified Data Model und die Speicherung in Parquet und Iceberg beschreibt Kapitel 19.

**Ergebnis und Systemstatus.** Ein Check mit dem Ergebnis „OK“ bestätigt, dass Zähler und Summen übereinstimmen. Ein Check „Not OK“ zeigt die fehlenden oder nicht gezählten Verträge und Rechnungen an. Der Status der Rechnung bleibt „Exported“, bis das Finanzsystem den Beleg zurückmeldet. Den Rückmeldestatus beschreibt Abschnitt 11.2.

**Besonderheiten je Rolle.** Der MPC PM sieht die Exportzahlen und die Rückmeldungen. MO prüft die Belege vor dem Export. Der Admin startet die Batch-Jobs und lädt die Dateien herunter. Die Rolle HQ sieht die Übersicht.

**Besonderheiten je Sparte und Markt.**

- Die E169-Dateien enthalten je Produktlinie einen eigenen Exporttyp. Der Exporttyp für die Produktlinie Excellent im Pkw-Bereich ist im Klärungsbedarf aufgeführt.
- Der Kampagnenexport gilt nur für Deutschland.
- Die MBLD-Dateien erhalten eigene Exporttypen mit dem Präfix L.

**Fehlerbehebung.**

- Ein Check „Not OK“ bei den Exportzahlen: Prüfen Sie „More Details“ und korrigieren Sie die fehlenden Verträge oder Rechnungen. Exportieren Sie danach erneut.
- Ein Check „Not OK“ bei der E169-Summe: Vergleichen Sie die Datei im Reiter „E169 Checks“ mit der Rückmeldung des Finanzsystems.
- 
Quellen: Batch 49.4, 63.6, 115.1, 140.2, 142.4, 156.1, 178.1, 181.4, 199.3, 227.1, 228.1, 232.1, 237.1, 241.2, 243.1, 244.1, 267.1, 285.2, 285.3, 316.1, 322.1, 328.1, 340.1, 347.1, 699.1, 704.1

## 11.8 Abweichungen an Fachbereich oder Support übergeben

**Zweck.** Das Material beschreibt keinen Ablauf, mit dem Sie eine Abweichung an den Fachbereich oder an den Support übergeben. Material: keine Quellen in den RAG-Batches.

**Voraussetzungen.** Material: keine Quellen in den RAG-Batches.

**Rollen.** Die Fehler der Schnittstelle NEMESIS bearbeitet die Rolle Market Operation User im Second Level Support. Die Rolle sieht den Bereich „NEMESIS“ im Admin-Bereich. Weitere Rollen für die Übergabe nennt das Material nicht. Material: keine Quellen in den RAG-Batches für die übrigen Rollen.

**Schritt für Schritt: Abweichung übergeben.** Material: keine Quellen in den RAG-Batches.

**Ergebnis und Systemstatus.** Material: keine Quellen in den RAG-Batches.

**Hilfen für die Diagnose.** Das System hält Informationen bereit, mit denen Sie eine Abweichung beschreiben können. Jede übersprungene Werkstattmeldung aus VEGA wird als eigener strukturierter Protokolleintrag in Datadog geschrieben. Der Eintrag enthält die VEGA-Antragsnummer, den Schadencode, den Coverage-Code, die Vertragsnummer und den Grund des Überspringens. Die Meldungen bei der Anlage einer Rechnung nennen die Rechnungsnummer und den Erfolg oder Misserfolg. Die Meldung bleibt sichtbar, bis Sie sie mit „Close“ schließen. Für NEMESIS-Ereignisse filtern Sie nach Datum, Vertragsnummer, Fehlerart und Status.

**Besonderheiten je Rolle, Sparte und Markt.** Material: keine Quellen in den RAG-Batches.

**Hinweise.** Die Fehlermeldungen mit Lösungswegen beschreibt Kapitel 23. Die Beschreibung der Schnittstellen beschreibt Kapitel 19.

**Fehlerbehebung.** Material: keine Quellen in den RAG-Batches für die Übergabe. Für Fehlermeldungen in den Rechnungen verweisen die Abschnitte 11.2 und 11.4 auf den Lösungsweg.

Quellen: Batch 244.1, 291.7, 696.3

## Verschiebung in andere Kapitel

Die folgenden Abschnitte gehören inhaltlich in andere Kapitel. Die Batch-Verweise stehen jeweils hinter dem Zielkapitel.

- Kapitel 2 „Zugang und Rollen“: Batch 274.5 zu den Rollen Admin, HQ PM, MPC PM, Market Operations und Dealer sowie zu den Berechtigungen für Rechnungen, Batch 125.1 zur Rolle „View only“ im Revenue Management, Batch 242.3 zu den Zugriffsrechten für Revenue und Cost Management.
- Kapitel 4 „Kunden/Partner“: Batch 628.1 zum Kundenstatus im Finanzsystem mit den Werten Archiviert und Gesperrt, Batch 836.3 zu den Angaben des Zahlers bei der Kundenerfassung, Batch 618.4 zur Zahlungsreferenz in den Kundendaten, Batch 669.1 zum Konzept der Partnerdaten für Verkäufer und Händler.
- Kapitel 5 und 6 „Fahrzeug/Produkt/Angebot“ und Vertragserstellung: Batch 1016.1 zum Händlerrabatt bei der Vertragserstellung, Batch 999.3 zur Eingabe von FIN, Bestellnummer und Deal-ID, Batch 1037.1 zur Konfiguration des Produkts, Batch 1019.3 zum Vertragsbeginn in der Produktkonfiguration, Batch 1017.4 zu Kunden- und Zahlungsinformationen bei der Vertragserzeugung, Batch 1159.8 zur Vertragslaufzeit in Monaten.
- Kapitel 9 „MO Checks“: Batch 628.1 zu den Vertragssperren bei gesperrten Kunden, Batch 1212.1 zum Contract-Review-Prüfprofil mit Mehr- und Minderkilometern.
- Kapitel 10 „Verträge im Alltag verwalten“: Batch 166.1 zum Vertragshändler im Reiter „Contract“, Batch 854.2 zum Vertragsstatus Closed in der Übersicht, Batch 763.2 zur Kilometerstandshistorie, Batch 126.1 und 137.1 zur Langzeitverlängerung, Batch 758.2, 758.3, 758.4 und 758.5 zum Wirksamkeitsdatum und zur Neuverteilung der Beträge bei der Verlängerung, Batch 840.1 zur Vertragsübertragung auf einen anderen Kunden in der Vertragsübersicht.
- Kapitel 12 „Geschäftskunden/Kampagnen/Sonderfälle“: Batch 438.1 zur Benachrichtigung bei Kampagnen in der Karenzzeit, Batch 1184.1 zum Sonderfall B2B und Fuhrparkkunden, Batch 1136.1 zu Kampagnen bei Produktversionen.
- Kapitel 14 „Marktrolle, Produkt- und Preispflege, Administration“: Batch 1260.1 zur Preisfaktor-Obergrenze, Batch 1262.1 zur Reihenfolge der Rechenschritte, Batch 1224.1 zur Produktverwaltung, Batch 1213.3 zur Berechnungsmethode der Verlängerung, Batch 1251.3 zur Preisverlängerung beim Leasing, Batch 1176.2 zu den Kilometerpreisen bei Mehr- und Minderkilometern, Batch 1215.2 zum Preis pro Kilometer, Batch 1225.1 zur Kostenumverteilung bei zurückliegender Erstzulassung, Batch 1164.1 zu den Zahlungsintervallen in der Preisberechnung, Batch 1190.1 zur Gebührenverwaltung, Batch 1131.2 zur Händlerprovision in der Kalkulation, Batch 1137.1 zu den Kostenstellen der Deckungen, Batch 1152.1 zur Aufteilung der Erstattungskosten, Batch 1143.2 zur Preisberechnung, Batch 1183.1 zur Preislogik bei Gebrauchtfahrzeugen, Batch 1245.1 zur Contract Calculation, Batch 1135.1 zur Produkt- und Preisberechnung, Batch 1115.2 zur Vertragskalkulation, Batch 1122.1 und 1125.1 zu den Lieferantenpreisen je Kilometer, Batch 945.1 zur Preisinformation im Reiter „Zahlung“, Batch 333.4 zu Preisen und Hinweisen, Batch 280.1 zur Steuerverwaltung im Revenue Management, Batch 252.1 zur Steuerverwaltung und zum Tax Type, Batch 218.7 zur Steuerkonfiguration in Indien.
- Kapitel 19 „IT Architektur“ mit Schnittstellen: Batch 519.1, 519.2, 519.3, 519.4, 519.5 und 519.12 zur Schnittstelle für die Schlussrechnung bei Leasing, Batch 249.1, 249.2, 249.5, 249.8, 249.9 und 249.10 zum Aufbau der E169-Datei, Batch 293.1, 293.2, 293.3, 293.4, 293.6 und 293.8 zu den Satzarten der E169-Datei, Batch 740.3, 740.4, 740.5, 740.7 und 740.8 zu den Satzarten INIT, HEADER, PTXT01 und POS, Batch 239.1 und 223.2 zu den Texten der E169-Datei, Batch 224.6 zu den Texten der internationalen Claims, Batch 111.3 zu den Texten für MBLD, Batch 209.1 zur Ausgabe von Texten in PTXT01, Batch 204.1 zu den Kennungen im Finanzsystem oneERP, Batch 250.1 zu den Exporten E174 und E169, Batch 220.2 zu den Reifenprodukten im Export, Batch 128.1 zum Self-Billing-Interface, Batch 281.1 zur Sammelrechnungslogik in der Datei, Batch 167.1 und 208.1 zur Rückmeldung aus oneERP, Batch 254.1 zu den Ereignissen der Schnittstellen, Batch 257.1 zu den Kostenstammdaten für NEMESIS, Batch 719.1 und 719.3 zu den Provisionsereignissen, Batch 724.2 zu den Kosten-Ereignissen, Batch 717.3 zu den Kafka-Ereignissen, Batch 1199.2 zur Schnittstelle MBLD Leasing, Batch 1307.1 zur Architektur, Batch 130.1 zur Konfiguration von MPay, Batch 179.1 zur Übergabe der MPay-Operation-ID, Batch 1136.1 und 1248.1 zu Kafka-Ereignissen und Produktsynchronisation, Batch 740.1 zur Altteilsteuer-Datei.
- Kapitel 19 „IT Architektur“ mit Datenprodukten und Reporting: Batch 296.1, 298.1, 302.1, 304.2, 306.1, 308.1, 309.1, 309.2, 310.1, 313.1, 315.1, 315.4, 316.1, 318.1, 319.1, 320.1, 321.1, 321.2, 322.1, 323.1, 324.1, 325.1, 326.4, 328.1, 329.1, 330.1, 332.1, 333.1, 338.1, 339.1, 340.1, 340.2, 343.1, 344.1, 344.2, 346.1, 347.1, 348.1, 349.2, 299.2, 305.1, 300.2, 515.3, 522.2, 806.3, 294.1, 1269.4, 1268.1, 853.1, 843.4 zu Datenprodukten, Monitoring, Infrastruktur und Aufbewahrungsfristen.
- Kapitel 20 „Länderspezifische Themen“: Batch 147.2 zu KCP in Korea, Batch 219.1 zur monatlichen Kreditkartenzahlung in Indien, Batch 175.1 zur Banküberweisung und zu den Zahlungsarten in Märkten außerhalb Deutschlands, Batch 907.1 zum Lakh-Preisformat für Indien, Batch 1041.2 zur Banküberweisung in der Schweiz.
- Kapitel 22 zu Vorhaben ohne Auslieferung: Batch 748.3 zur Optimierung der Vertragszahlungen, Batch 174.2 zur Gutschrift bei rückdatierter vorzeitiger Beendigung, Batch 1289.1 zum lokalen MPay-Simulator.
- Kapitel 23 „FAQ, Troubleshooting, Support“: Batch 258.1 zu Fehlermeldungen beim Rückmeldeimport, Batch 279.1 zum Fehler Error und zum Vorgang Confirm Fixes.
- Anhang F „Klärungsregister“: Die eingestellten und geschlossenen Meldungen stehen im Abschnitt Klärungsbedarf dieses Kapitels.

## Klärungsbedarf

Die folgenden Punkte betreffen Widersprüche, unklare Aussagen und eingestellte oder geschlossene Meldungen. Sie stehen nicht im Fließtext der Abschnitte, bis die Fachseite sie bestätigt.

1. **Belegtyp MDCR und FDCR.** Das Material bezeichnet denselben Abschlussbeleg mal als FDCR und mal als MDCR. Batch 55.1, 63.1, 76.1, 95.1.
2. **Übermittlung von MDCR an MBLD.** Ein Abschnitt beschreibt die API-Übermittlung für Leasingverträge als bestehend, ein anderer nennt die Schnittstelle als nicht vorhanden. Die Zuständigkeit des Edge-Service-Teams ist nicht geklärt. Batch 55.1, 61.1, 80.1, 106.1.
3. **Kontostand.** Das Material beschreibt mehrere Formeln: Kundenrechnungen plus Preisminderungen minus Werkstattrechnungen minus Provisionen, Erlöse minus Kosten, und für NACOS-Märkte nur Kundenrechnungen mit FI-Beleg minus Vertragsforderungen. Die Formel mit Lieferantenbelegen weicht ab. Batch 222.3, 698.1, 275.2, 119.2, 229.2.
4. **Gutschrift bei Kündigung.** Ein Abschnitt storniert Belege im Status Planned oder Accepted ohne Gutschrift. Ein anderer erstellt bei exportierten Belegen eine Gutschrift, die bei FI-Buchung automatisch freigegeben wird. Der Reiter der Gutschrift ist uneinheitlich: „Price reduction“ oder „Customer Invoice“. Batch 214.1, 236.1, 146.1, 247.1, 265.2.
5. **Gutschrift bei Zahlungen mit Rückdatierung.** Das Material beschreibt eine automatische Gutschrift für die Rückdatierung als Funktion, deren Auslieferung es nicht bestätigt. Batch 174.2, 120.1.
6. **Schwellenwert der Freigabe.** Die Freigabe nennt 100 EUR als Platzhalter. Die Konfiguration führt 100 EUR als Standardwert mit einem Bereich von 0,01 bis 9.999,99 EUR. Die Zuständigkeit je Markt ist offen. Batch 440.2, 142.2, 989.5, 291.5, 284.3.
7. **Bearbeitung durch den Genehmiger.** Ein Abschnitt erlaubt dem Genehmiger das Bearbeiten und macht ihn zum neuen Eigentümer. Ein anderer nennt nur den Ersteller als bearbeitende Person. Batch 223.1, 224.1.
8. **Rechnungsnummern zum Jahreswechsel.** Ein Abschnitt setzt die Nummern am 1. Januar zurück, zwei weitere beschreiben ein Muster mit Jahresangabe ohne Rücksetzung. Batch 200.1, 247.2, 151.4.
9. **Zahlungsdauer.** Ein Abschnitt zählt die Zahlungsdauer in Monaten, ein anderer in Anzahl der Rechnungen. Batch 153.2, 1096.2.
10. **Zeitraum der Zahlungsplanung.** Ein Abschnitt beginnt den Zeitraum mit dem frühesten Rechnungsdatum FRD, ein anderer mit dem Vertragsbeginn. Batch 289.1.
11. **Sperre bei Mahnstufen.** Ein Abschnitt beschreibt eine feste Sperre ab Mahnstufe 3, ein anderer eine Einstellung je Division mit Anzahl der Rechnungen. Batch 165.1, 152.1.
12. **Kennung der Fehlerrückmeldung.** Das Material schreibt die Kennung für den Fehler einmal mit zehn Stellen 8888888888 und einmal mit neun Stellen 888888888. Batch 226.3, 279.1, 283.1.
13. **Zahlungsbedingung in SWT und CoFiCo.** Ein Abschnitt lässt das Feld Payment Term im Header leer, ein anderer nennt Zahlungsbedingungen je Rechnung mit Spalten vor und nach der Aktivierung. Batch 175.1, 113.1, 126.1.
14. **Exporttyp E169 für Excellent.** Der Pkw-Exporttyp für Excellent lautet einmal S, einmal FS. Der Exporttyp Basic fehlt im Material. Batch 150.1, 142.4.
15. **Betriebsstättennummern.** Das Material nennt für Transporter die Werksnummer 268 mit Betriebsnummern je Produktlinie und für Pkw eigene Nummern. Die Abweichungen zwischen den Abschnitten sind nicht geklärt. Batch 150.1, 182.2, 179.5.
16. **Antriebsstrang im Export.** Die Betriebsstättennummer für den Antriebsstrang ist mit oneERP abzustimmen. Batch 150.1.
17. **Self-Billing Light.** Ein Beispiel nennt Light als Modus für Deutschland, ein anderer Abschnitt erklärt Self-Billing in Indien für gesetzlich nicht erlaubt. Batch 693.1.
18. **Exportweg für Provisionen.** Die Batch-Jobs E168 entfallen laut einem Abschnitt, laut einem anderen laufen sie als CoFiCoE168InvEXP und SWTE168InvEXP weiter. Batch 718.1, 115.1, 691.1.
19. **Provisionen Van.** Ein Abschnitt exportiert keine SCOM-Belege für die Division Van, ein anderer exportiert die externen Provisionen und hält die internen als Processed. Batch 695.3, 154.3.
20. **Händlerwechsel bei Provisionen.** Die Korrektur eines Händlerrabatts setzt den Belegtyp SCOM und den Dokumenttyp Gutschrift fest, der Händlerrabatt selbst ist vom Typ DD. Batch 193.1.
21. **Steuersätze für Korrekturen.** Die Korrekturrechnung verwendet feste Steuersätze, das Material nennt als Ziel die Werte aus dem Tax Management. Batch 286.2.
22. **Steuerklassifizierung der Position.** Die Anzeige wechselt zwischen Standard mit 19 Prozent und den Kürzeln AX und DI. Batch 291.4, 220.3.
23. **Positionen der Werkstattrechnung.** Ein Abschnitt verlangt vier Nettowerte, darunter Dealer Handling, ein anderer drei. Batch 729.2, 714.3.
24. **Typen der Werkstattrechnung.** Das Material nennt für internationale Belege fünf Typen, darunter WSIN, und an anderer Stelle nur WSIN und IWSI. Batch 728.2, 729.2, 716.4.
25. **Währung der internationalen Werkstattrechnung.** Ein Abschnitt übernimmt die Vertragswährung, ein anderer die Währung des Markts. Batch 728.2, 729.2.
26. **Dokumenttyp der Werkstattrechnung.** Der Dokumenttyp heißt im Material einmal Invoice oder Credit note, einmal Rechnung. Batch 736.1.
27. **Kopfbereich E169 für Gutschriften.** Der Export der Gutschrift nennt im Kopf einen leeren Exporttyp, ein anderer Abschnitt den Exporttyp EXTSUB. Batch 740.4, 249.5, 293.5.
28. **Dateiendung E167 und E169.** Die Dateiendung der E167-Datei weicht von der E169-Datei ab. Ob diese Abweichung gewollt ist, ist offen. Batch 204.1, 249.1.
29. **Altteilsteuer und Kundenanteil.** Die Logik für den Kundenanteil zieht den Anteil des Händlers ab, die Regel ist nicht vollständig beschrieben. Die Bezeichnung „Old Part Tax Base“ und „Altteilsteuer Grundbetrag“ weicht ab. Batch 741.1, 703.2.
30. **Abgleich der Altteilsteuer.** Ein Abschnitt setzt den Betrag der E169 auf 0, ein anderer übernimmt den Betrag aus der i156. Batch 183.5, 741.2.
31. **Vertragsstatus Closed.** Ein Abschnitt nennt eine Testdauer von einer Stunde statt 30 Tage. Batch 854.2.
32. **Löschregel nach DSGVO.** Die Regel ist beschrieben, der Stand der Prüfung als BAT-Test ist nicht bestätigt. Batch 188.1.
33. **Vertragsübertragung.** Das Material beschreibt die automatische Gutschrift bei Kulanz als Logik des Zahlungsplans, die Umsetzung ist nicht bestätigt. Batch 272.1, 840.1.
34. **Bill-To Party.** Die Behandlung eines leeren Rechnungsempfängers und die Regeln für Verlängerung und das SEPA-Dokument sind offen. Batch 886.1.
35. **Sammelrechnung und Standardwert.** Der Standardwert der globalen Sammelrechnung ist mit „Ja“ angegeben. Für bestehende Kunden nennt ein Abschnitt die Vorbelegung aus der Kundenverwaltung, ein anderer lässt den Schalter bei bestätigtem Vertrag deaktiviert. Batch 273.1, 656.1.
36. **Status Blocked BAT Testing.** Mehrere Funktionen tragen den Status „Blocked BAT Testing“: die Rückmeldung von SWT, die Gutschrift bei Chargeback, die Altteilsteuer-Position aus der i156 und die Zahlungsarten in Deutschland. Batch 207.1, 158.1, 739.1, 203.1.
37. **Umrechnung der Laufleistung.** Der Abschnitt zur Umrechnung von Meilen in Kilometer nennt den Originalwert und den umgerechneten Wert. Die Festlegung des Rhythmus der wöchentlichen Lieferung ist offen. Batch 743.1, 709.2, 699.1.
38. **NEMESIS-Summe.** Die Formel für den Vertragspreis nennt einmal 1.325 und 1.335 EUR, einmal 1.085 und 1.095 EUR als Ergebnis. Batch 245.1, 214.1.
39. **Abgebrochene Meldungen.** Folgende Meldungen tragen den Status „Cancelled“ oder den Vermerk abgebrochen und sind nicht als Funktion beschrieben: Import der Lieferantenrechnungen, Datenmodell der Erlöse, Steuersatz SWT gegenüber der Rechnung, Platzhalter für Supplier Report, Gutschrift bei Authentifizierungsfehler und Gutschrift mit Rückdatierung nach der Widerrufsfrist. Batch 725.1, 292.1, 124.1, 135.2, 155.1, 120.1.
40. **Geschlossene Meldungen.** Folgende Meldungen tragen den Status geschlossen und sind nicht als Handbuchinhalt übernommen: Upload der I156 erzeugte weder CLAI noch OPT, Schadencodes wurden nicht angezeigt, Campaign 4-Eye-Approval und Archivierung der I156 im Jahresordner. Batch 695.5, 1138.1, 689.1.
41. **Zuweisung von Benachrichtigungen.** Die Zuweisung an einen anderen MO mit E-Mail ist als Ziel beschrieben, der Stand ist nicht bestätigt. Batch 406.4.
42. **Teilrechnungen bei Schadencodes.** Die Logik der Teilrechnungen zwischen CLAI und der Summe der CCIN oder SCIN ist nicht vollständig beschrieben. Batch 131.2.
43. **Lieferantenzahlungsplan bei rückwirkender Kündigung.** Die Regel ist mit OneERP und dem Fachbereich abzustimmen. Batch 136.1.
44. **Schwellenwert für Lieferantenbelege.** Das Material nennt 100 EUR für die MO-Freigabe und 1.000 EUR als Beispiel für die Akzeptanz. Batch 136.1.
45. **Berichtsbatch für Lieferanten.** Der Batch für Lieferantenberichte ist als Verfeinerung beschrieben, der Stand ist nicht bestätigt. Batch 551.5.
46. **Bestätigung im Dialog.** Der Text „Confirm setzt Status auf Accept“ steht im Widerspruch zur Aktion Accept für den Status Created. Batch 720.1.
47. **Preisberechnung pro Kilometer.** Das Material nennt die Berechnung als Vorhaben ohne Angabe des Stands. Batch 333.5.
48. **Testszenarien.** Die Testszenarien für offene Posten, Sammelläufe bei Bahn und Bundeswehr, Ausland-Fahrzeuge und Subventionen sind im Material ohne Ergebnis aufgeführt. Batch 184.5.

## Vorschläge zur Gliederung

- **11.1 und 11.2.** Der Zahlungsplan steht in beiden Unterkapiteln. Führen Sie ihn in einem eigenen Unterkapitel „Zahlungspläne und Zahlungsintervalle“ zusammen, das 11.2 vorangeht.
- **11.2.** Die Zahlungsarten und MPay bilden ein eigenes Unterkapitel. Der Kontostand und das Mahnwesen trennen Sie ebenfalls ab.
- **11.3.** Die Vertragsübertragung auf einen anderen Kunden gehört in Kapitel 10, weil sie den Vertragsablauf betrifft. Die Gutschrift an den Händler bei Kündigung passt zu 11.6.
- **11.4.** Die Kontingentverwaltung und die Schadencodes sind Stammdaten. Verschieben Sie die Pflege der Schadencodes in Kapitel 14 oder in die Administration.
- **11.5.** Das Unterkapitel umfasst Werkstatt, Altteilsteuer, Lieferanten, Berichte und Stammdaten. Teilen Sie es in „Werkstattrechnungen“, „Altteilsteuer“ und „Lieferanten“.
- **11.6.** Die Löschregel nach DSGVO ist ein Datenschutzthema. Stellen Sie sie in Kapitel 19 oder in ein eigenes Datenschutzkapitel.
- **11.7.** Der Abschnitt vermischt Export-Plausibilität und Datenprodukte. Trennen Sie die Datenprodukte in Kapitel 19.
- **11.8.** Das Material enthält keine Inhalte für eine Übergabe an Fachbereich oder Support. Führen Sie den Abschnitt mit dem Kapitel 23 zusammen oder streichen Sie ihn, bis Material vorliegt. Der Eintrag in der Gliederungsdatei trägt keinen Batch-Verweis.
- **Anhang.** Die Klärungspunkte dieses Kapitels gehören in den Anhang F, das Klärungsregister.
