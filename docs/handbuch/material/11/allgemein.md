# Material zu 11 Ohne Unterkapitel-Zuordnung

Kapitel 11 Rechnung, Zahlung, Kosten und Auswertungen. 96 Abschnitte aus den RAG-Batches, automatisch zugeordnet, redaktionell zu prüfen.

## [Batch 1274.1] Vertragskalkulation (Contract Calculation) – Behobene Fehler und Verbesserungen

In diesem Release wurden zahlreiche Fehler in der Vertragskalkulation behoben, die vor allem die Produktverwaltung, Preisversionen, Fahrzeuggruppen und Kampagnen betreffen.

## [Batch 1279.1] Release-Hinweise: Vertragskalkulation (Contract Calculation)

In diesem Release wurden zahlreiche Fehler in der Vertragskalkulation behoben und das Verhalten mehrerer Funktionen verbessert. Die Änderungen betreffen vor allem die Produktverwaltung, die Preismatrix, Cluster, Kampagnen sowie die Vertragserzeugung und -aktivierung.

## [Batch 740.1] Altteilsteuer-Datei (Schnittstelle E169) im Cost Management

Im Bereich Cost Management erzeugt oneSCM für die Altteilsteuer eine Datei im Format der Schnittstelle E169. Voraussetzung ist, dass die Altteilsteuer zuvor nach der dafür festgelegten Logik ermittelt wurde. Die Funktion ist neu und hat keinen Vorläufer. Sie wird als Plugin-Modul außerhalb der Microservices umgesetzt.

Der Dateiname folgt dem Muster E169EXP_YYYYMMDD_HHmmss_FILENUMBER_SAP_SG_YYMM_Old_Part_Tax.dat. Die Datei besteht aus mehreren Satzarten, die jeweils eine feste Länge haben.

## [Batch 1126.2] Vertragskalkulation: Neuerungen und Änderungen

Im Bereich der Vertragskalkulation stehen mehrere Funktionen für das Anlegen von Serviceverträgen zur Verfügung. Anwender können ein Servicevertragsprodukt für Vans (FRD) anlegen und anschließend prüfen, ob es im Schritt „Vertragsvorschlag“ sichtbar ist. Ebenso lässt sich ein Servicevertragsprodukt (N-FRD) anlegen und im Vertragsvorschlag auf Sichtbarkeit kontrollieren. Darüber hinaus ist es möglich, ein Servicevertragsprodukt mit Kontingent anzulegen. Diese Funktionen befinden sich bereits im produktiven Einsatz.

Außerdem wurde ein Fehler behoben, bei dem die Preise pro Kilometer nicht korrekt berechnet wurden. Die Berechnung ist damit korrigiert.

## [Batch 1131.1] Abruf von Fahrzeuginformationen in der Vertragskalkulation

In der Vertragskalkulation können Benutzer zu einem Fahrzeug die Marke, die Sparte (Division) und die Verkaufsbezeichnung abrufen. Diese Funktion steht bereits im produktiven Einsatz. Welche Einstiegsdaten dafür genutzt werden können, hängt vom Fahrzeugtyp und der Benutzerrolle ab.

Benutzer mit Zugriff auf Pkw können die drei Angaben für einen Pkw über die Auftragsnummer, den Modellcode oder die Fahrzeugidentifizierungsnummer (FIN/VIN) abrufen. Benutzer mit Zugriff auf Transporter (Vans) können sie für einen Van über den Modellcode abrufen. Benutzer mit kombiniertem Zugriff auf Pkw und Vans können sowohl für Pkw als auch für Vans den Modellcode oder die FIN/VIN als Einstieg verwenden.

## [Batch 1223.1] Vertragskalkulation

Im Bereich der Vertragskalkulation stehen Ihnen mehrere Funktionen für die Verwaltung von Preisen zur Verfügung. Sie können Preiscluster anlegen. Dabei wird auch der Fall berücksichtigt, dass die Anlage nicht erfolgreich verläuft (negatives Szenario). In der Preisversionsübersicht können Sie das Produkt über ein Dropdown-Menü wechseln. Außerdem können Sie dort Preisversionen bearbeiten, duplizieren und löschen sowie abgelaufene Versionen anzeigen lassen.

## [Batch 1230.1] Produkt- und Preisbereitstellung in der Vertragskalkulation

Bisher basierte die Bereitstellung von Produkten und Preisen in der Vertragskalkulation auf Testdaten. Mit der neuen Funktion ermittelt das System auf eine API-Anfrage hin die passenden Produkte und Preise anhand der übergebenen Anfrageparameter. Die Anfrage kann sowohl von internen oneSCM-Prozessen als auch von externen Anfragenden gestellt werden. Die Antwort kann je nach Produktdefinition und Anfrageparametern Informationen zu mehreren Produkten und mehreren Preisfeldern enthalten.

## [Batch 1231.1] Ansicht von Preisen und Produkten im Vertragskalkulationsmodul

In der Vertragskalkulation können Preis- und Produktkonfigurationen jetzt angesehen werden, ohne in den Bearbeitungsmodus zu wechseln. So ist sichergestellt, dass beim reinen Nachschlagen keine Angaben versehentlich verändert werden.

Für MO-Benutzer gibt es die Funktion „View Prices". In der Produktübersicht erscheint beim Überfahren des Symbols zur Preisverwaltung der Hinweistext „View Prices". Zusätzlich steht im Aktionsmenü der Eintrag „View Prices" mit dem bekannten Augen-Symbol zur Verfügung. Die Preisseite zeigt die vorhandene Preisversion sowie das Kontrollkästchen, mit dem abgelaufene Versionen eingeblendet werden können. Die Schaltfläche „Create Price Version" und die Spalte „Action" werden in dieser Ansicht ausgeblendet. Die Ansicht-Aktion bei den Clustern wird direkt angeboten, also ohne Aktionsmenü.

MPC- und MO-Benutzer können die Produktkonfiguration über den Eintrag „View" im Aktionsmenü aller Produkte öffnen. Die Seite wird ohne Stepper und ohne Navigation dargestellt.

## [Batch 333.4] Vertragskalkulation: Preise und Hinweise

In der Preisansicht werden Cluster mit einem Warnhinweis gekennzeichnet, wenn sie optionale Deckungen enthalten, für die kein Preis konfiguriert ist. Warnsymbole erscheinen an allen betroffenen Clustern, im Reiter „Optionale Deckungen“ sowie an den jeweils betroffenen Deckungen; ein Warnhinweis-Dialog ergänzt dies. Die Bearbeitung von Preisen wurde für Kostendefinition, Abhängigkeitsdefinition und TA-Klassifizierung erweitert. Bearbeitbar sind nur zukünftige Preise, vergangene und aktuelle Preise sind gesperrt. Außerdem wurde die Schnittstelle zur Vertragsverlängerung um optionale Deckungscodes erweitert.

## [Batch 1228.1] Produktverwaltung in der Vertragskalkulation

Beim Anlegen eines Produkts stehen Ihnen mehrere Möglichkeiten zur Verfügung. Sie können den Vorgang abbrechen oder das Produkt als Entwurf speichern. Wenn Sie ein Produkt als Entwurf speichern, zurückgehen und anschließend abbrechen, bleibt das Produkt erhalten und erhält den Status „Draft". Auch bei fehlerhaften oder unvollständigen Eingaben in den einzelnen Schritten der Produktanlage wird das Verhalten des Systems berücksichtigt und geprüft.

Bestehende Produkte können Sie in den Status-Ausprägungen Draft, Created, Ready und Deactivated bearbeiten. Ob Ihre Änderungen an den Produktdaten gespeichert werden, richtet sich nach dem jeweiligen Status des Produkts. Wenn Sie ein Produkt löschen, erscheint es anschließend nicht mehr in der Produkttabelle.

## [Batch 695.1] Cost Management: Neuerungen und Änderungen

Im Bereich Cost Management wurden mehrere Anpassungen rund um Provisionen, Rechnungen und Werkstattbelege umgesetzt bzw. vorbereitet.

## [Batch 64.1] Revenue Management

Im Bereich Revenue Management steht eine Verbesserung des Imports zur Verfügung: Beim Import (I156) können nun mehrere RC20-Schadeneinträge verarbeitet werden, die denselben Schadencode tragen, sich aber in der Schadensequenznummer unterscheiden. Solche Einträge werden damit nicht mehr als Duplikate behandelt, sondern als eigenständige Schadenseinträge zugelassen. Weitere Details zur technischen Umsetzung liegen in den vorliegenden Informationen nicht vor.

Für das Revenue Management sind außerdem mehrere Themen vorgesehen, die sich noch nicht in der Umsetzung befinden. Die Überprüfung der Formel für den Kontosaldo, die auf Rückmeldungen aus SA31 zurückgeht, befindet sich derzeit in der Verfeinerung (Refinement). Die inhaltlichen Anforderungen und das Zielverhalten sind noch nicht ausgearbeitet.

Offen sind derzeit die folgenden Themen: Vertragsverlängerungen für Produkte mit aktualisierten Deckungen, eine Prüfliste, die vor dem Go-Live neuer Produkte abgearbeitet werden soll (am Beispiel der Managementverträge), sowie die Anpassung der NEMESIS-Tabelle. Zu diesen Themen sind noch keine näheren Beschreibungen, Akzeptanzkriterien oder Zielzustände hinterlegt. Das Handbuch wird ergänzt, sobald diese Punkte konkretisiert und umgesetzt sind.

**Hinweis für die Redaktion:** Die Beschreibung des ersten Eintrags enthielt nur einen nicht aufgelösten Platzhalter, und die übrigen Einträge enthielten lediglich leere Vorlagentexte. Der Text beschränkt sich daher auf die Angaben aus den Überschriften und Status. Die drei offenen Punkte und die Formelprüfung sind noch nicht fertiggestellt und sollten gegebenenfalls erst nach Abschluss in das Handbuch aufgenommen werden.

## [Batch 122.1] Revenue Management

Im Bereich Revenue Management sind derzeit zwei Themen vorgesehen, die noch nicht umgesetzt sind. Beide befinden sich im Status „Offen“, und für beide liegen bislang keine inhaltlichen Detailangaben vor.

Das erste Thema betrifft den Umgang mit vollständig (zu 100 %) subventionierten Verträgen, bei denen keine Zahlungsdaten erfasst werden. Es ist vorgesehen, dieses Szenario im Rahmen des Revenue Managements gezielt abzubilden. Zu Zielzustand, Anwendergruppen, Abnahmekriterien und Risiken wurden noch keine Angaben hinterlegt. Konkrete Funktionsweisen lassen sich daher zum jetzigen Zeitpunkt nicht beschreiben.

Das zweite Thema betrifft eine Auswahlmöglichkeit zwischen begrenzter („Limited“) und unbegrenzter („Unlimited“) Reifenoption im Zusammenhang mit einer Vertragsverlängerung. Auch hier sind die Details zum Funktionsumfang, zum Nutzerkreis und zum angestrebten Verhalten noch nicht ausgearbeitet. Sobald diese Informationen vorliegen, kann der Abschnitt im Benutzerhandbuch entsprechend ergänzt werden.

Eine ursprünglich angedachte Anpassung, die sich auf das Fehlen eines Entitlements („product_r“) in der HQ-Administration bezog, wurde abgebrochen und wird nicht weiterverfolgt. Für Anwender ergeben sich daraus keine Änderungen.

*Hinweis für die Redaktion: Die Rohdaten enthalten für die offenen Themen ausschließlich leere Beschreibungsvorlagen. Die Texte sind daher bewusst allgemein gehalten, um nichts hinzuzuerfinden. Vor der Veröffentlichung sollten fachliche Details nachgereicht werden.*

## [Batch 199.1] Release-Hinweise Revenue Management

Im Bereich Revenue Management wurden mehrere Anpassungen an den Exporten zu OneERP sowie an der Verwaltung von Schadencodes und Rechnungsstatus vorgenommen. Beachten Sie, dass einzelne Punkte noch in Prüfung oder nicht umgesetzt sind (siehe unten).

## [Batch 32.1] Revenue Management

Im Bereich Revenue Management umfasst dieser Stand sechs Vorhaben, von denen fünf noch offen sind und eines bereits abgeschlossen wurde.

Abgeschlossen ist die Anpassung E174: Die FIN wird nicht mehr im Feld Materialnummer (Stellen 101 bis 118) des Satzes 40 übertragen, sondern im Feld Reference Key 3 (Stellen 280 bis 299) desselben Satzes. Weitere Details zur Umsetzung liegen in den vorliegenden Informationen nicht vor.

Noch offen sind mehrere Architekturvorhaben. Dazu gehört ein neuer Microservice für NEMESIS. Ebenfalls geplant ist eine Erweiterung der Unterstützung mehrerer Märkte in MPay, einschließlich eines Konfigurationsservice für den Transaktionstyp. Außerdem soll der Ablauf I156 neu geschrieben werden. Ein weiteres offenes Architekturvorhaben hat zum Ziel, die in Logs erfassten Daten zu reduzieren und zu anonymisieren.

Darüber hinaus ist für MPay die Erweiterung der Rückerstattung ohne MMe-Account um zusätzliche Anwendungsfälle vorgesehen und ebenfalls noch offen.

Für die offenen Vorhaben sind bislang keine inhaltlichen Beschreibungen, Zielzustände, Akzeptanzkriterien oder Auswirkungen auf die Anwendung hinterlegt. Die Angaben in den Ticketdaten bestehen nur aus unausgefüllten Vorlagentexten. Konkrete Funktionsbeschreibungen für das Benutzerhandbuch können daher erst ergänzt werden, sobald diese Informationen vorliegen.

## [Batch 1219.6] Preismatrix (Contract Calculation – Preiscluster)

Für den Preiscluster der Vertragskalkulation sind die Funktionen zum Herunterladen und Hochladen der Preismatrix (Preistabellen-Upload) im Einsatz und wurden getestet. Weitere Details liegen in den vorliegenden Informationen nicht vor.

## [Batch 242.3] Zugriffsrechte für Revenue und Cost Management

Die Rollen und Berechtigungen wurden gemäß den Abstimmungen aus Business Stream 3 angepasst. Tax Types werden vom Admin verwaltet, Tax Rates von MPC. MPC, MO, HQ und ADMIN können Tax Types und Tax Rates sehen, ebenso die Seite „Finance Control" und die Seite „Admin Invoice". Die Seite „Admin Invoice" können MPC und MO zusätzlich verwalten. Die Seite „Batch Jobs" können MPC, MO, HQ und ADMIN einsehen; verwalten dürfen sie HQ und Admin. Auch die Seite mit den Damage Codes können MPC, MO, HQ und ADMIN sehen. HQ importiert die Liste der Damage Codes, MO und MPC können marktspezifische Damage Codes anlegen. Coverage Codes werden ausschließlich von HQ verwaltet.

## [Batch 35.5] Übermittlung an MBLD

Für Leasingverträge (Vertriebskanal = Leasing/MBLD, Dokumenttyp = MDCR) wird das MDCR-Dokument zusätzlich per API an MBLD gesendet. Die Auswahl erfolgt anhand dieser beiden Kriterien, und das Ergebnis der Übertragung wird nach den bestehenden Regeln für Integration und Fehlerbehandlung festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden ausschließlich über E169/CoFiCo/SWT exportiert und nie an MBLD gesendet.

Hinweis: Laut den vorliegenden Informationen existiert die API zur Auswahl und Übermittlung an MBLD derzeit noch nicht, und die Zuständigkeit des Edge-Service-Teams ist noch nicht formal geklärt.

## [Batch 47.5] Weiterleitung an MBLD

Bei MBLD-Verträgen wird ein MDCR zusätzlich per API an MBLD gesendet. Ausgewählt werden die Dokumente anhand des Vertriebskanals „Leasing“ und des Dokumenttyps MDCR. MDCR-Dokumente von Nicht-Leasing-Verträgen werden ausschließlich über E169/CoFiCo/SWT exportiert und niemals an MBLD gesendet.

## [Batch 54.6] Übermittlung an MBLD

Für Leasingverträge (Vertriebskanal = Leasing/MBLD und Dokumenttyp = MDCR) wird das MDCR-Dokument zusätzlich über eine API an MBLD gesendet. Die Auswahl erfolgt anhand dieser beiden Kriterien, und das Ergebnis der Übertragung wird nach den bestehenden Regeln für Integration und Fehlerbehandlung festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden ausschließlich über E169/CoFiCo/SWT exportiert und niemals an MBLD gesendet.

## [Batch 57.7] Übermittlung an MBLD

Für Leasingverträge, insbesondere MBLD-Verträge, wird das MDCR-Dokument zusätzlich per API an MBLD gesendet. Die Auswahl erfolgt anhand von Vertriebskanal = Leasing und Dokumenttyp = MDCR. Das Ergebnis der Übertragung wird gemäß den bestehenden Integrations- und Fehlerbehandlungsregeln festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden nie an MBLD gesendet, sondern ausschließlich über den Standardexport E169/CoFiCo/SWT verarbeitet.

## [Batch 71.5] Besonderheit bei MBLD-Verträgen

Bei Leasingverträgen von MBLD (Vertriebskanal Leasing, Dokumenttyp MDCR) wird das Dokument zusätzlich per API an MBLD übermittelt. Die Auswahl erfolgt anhand dieser beiden Kriterien, und das Ergebnis der Übertragung wird nach den bestehenden Regeln für Integration und Fehlerbehandlung festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden nie an MBLD gesendet, sondern ausschließlich über den Standardexport E169/CoFiCo an das Finanzsystem übergeben.

## [Batch 73.6] Übermittlung an MBLD

Bei Leasingverträgen (Vertriebskanal = Leasing, Dokumenttyp = MDCR), insbesondere bei MBLD-Verträgen, wird das Dokument zusätzlich über eine API an MBLD gesendet. Die Auswahl erfolgt anhand von Vertriebskanal und Dokumenttyp. Das Übertragungsergebnis wird nach den bestehenden Integrations- und Fehlerbehandlungsregeln festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden ausschließlich über den E169/CoFiCo/SWT-Export verarbeitet und nie an MBLD gesendet.

Hinweis zum aktuellen Stand: Die Auswahllogik für die Weiterleitung an MBLD ist bislang nicht abgestimmt, und die API zur Übermittlung existiert noch nicht. Die Zuständigkeit des Edge-Service-Teams ist noch nicht formal festgelegt.

## [Batch 77.6] Übertragung an MBLD

Für Leasingverträge, also bei Vertriebskanal Leasing/MBLD und Dokumenttyp MDCR, wird das Dokument zusätzlich per API an MBLD gesendet. Die Auswahl erfolgt anhand dieser beiden Kriterien. Das Übertragungsergebnis wird nach den bestehenden Integrations- und Fehlerbehandlungsregeln festgehalten. MDCR-Dokumente von Nicht-Leasingverträgen werden nie an MBLD gesendet, sondern ausschließlich über den Standardexport E169/CoFiCo/SWT verarbeitet.

## [Batch 83.7] Übermittlung an MBLD

Für Leasingverträge, insbesondere MBLD-Verträge, wird das MDCR-Dokument zusätzlich per API an MBLD gesendet. Die Auswahl erfolgt über die Kombination aus Vertriebskanal „Leasing" und Dokumenttyp „MDCR". Das Ergebnis der Übertragung wird gemäß den bestehenden Integrations- und Fehlerbehandlungsregeln erfasst. MDCR-Dokumente von Nicht-Leasingverträgen werden ausschließlich über den Standardexport E169/CoFiCo/SWT an das Finanzsystem übergeben und nie an MBLD gesendet.

## [Batch 86.6] Übertragung an MBLD

Für Leasingverträge, bei denen der Vertriebskanal „Leasing“ (MBLD) und der Dokumenttyp „MDCR“ ist, wird das MDCR-Dokument zusätzlich per API an MBLD gesendet. Das Ergebnis der Übertragung wird nach den bestehenden Regeln für Integration und Fehlerbehandlung erfasst. MDCR-Dokumente von Nicht-Leasingverträgen werden nicht an MBLD übertragen, sondern ausschließlich über den Standardexport E169/CoFiCo an das Finanzsystem übermittelt.

## [Batch 102.6] Besonderheit für MBLD-Verträge

Für Leasingverträge von MBLD werden MDCR-Dokumente zusätzlich per API an MBLD gesendet. Die Auswahl erfolgt anhand der Kriterien Vertriebskanal = Leasing und Dokumenttyp = MDCR. Das Ergebnis der Übermittlung wird nach den bestehenden Regeln für Integration und Fehlerbehandlung festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden nie an MBLD gesendet, sondern ausschließlich über den Standardexport E169/CoFiCo/SWT verarbeitet.

## [Batch 105.6] Übertragung an MBLD

Bei Leasingverträgen, also bei Vertrieb über den Kanal Leasing/MBLD, wird das MDCR-Dokument zusätzlich per API an MBLD gesendet. Die Auswahl erfolgt anhand der Kriterien Vertriebskanal = Leasing und Dokumenttyp = MDCR. Das Ergebnis der Übertragung wird gemäß den bestehenden Integrations- und Fehlerbehandlungsregeln festgehalten. MDCR-Dokumente von Nicht-Leasing-Verträgen werden nie an MBLD gesendet, sondern ausschließlich über den Standardexport an das Finanzsystem verarbeitet.

## [Batch 112.7] Übermittlung an MBLD

Bei Leasingverträgen (Vertriebskanal = Leasing, Belegtyp = MDCR), insbesondere bei MBLD-Verträgen, wird der MDCR-Beleg zusätzlich per API an MBLD gesendet. Die Auswahl erfolgt anhand dieser beiden Kriterien, das Übertragungsergebnis wird gemäß den bestehenden Integrations- und Fehlerbehandlungsregeln festgehalten. MDCR-Belege von Nicht-Leasing-Verträgen werden ausschließlich über den E169/CoFiCo/SWT-Export verarbeitet und nie an MBLD gesendet.

## [Batch 824.5] Datenübermittlung an das Revenue Management

Die Vertragsanwendung übermittelt nun Kunden-ID und Zahler-ID an das Revenue Management. Für einen Zahlerwechsel wurde ein neuer Kafka-Producer mit Kunden-ID, alter und neuer Zahler-ID eingerichtet. Alle Ereignisse, die von der Vertragsverwaltung an Revenue gesendet werden, enthalten außerdem Kunden-ID und Zahler-ID.

## [Batch 1272.1] Contract Calculation – Behobene Fehler und Verbesserungen

In der Domäne Contract Calculation wurden zahlreiche Fehler behoben und Verbesserungen umgesetzt, die die Vertragsgenerierung, die Produktverwaltung, die Preisversionen und die Kampagnen betreffen.

## [Batch 1273.1] Contract Calculation – Verbesserungen und Fehlerbehebungen

In diesem Release wurde die Contract Calculation an zahlreichen Stellen überarbeitet und stabilisiert. Die Änderungen betreffen vor allem die Produktverwaltung, die Preisversionen und Preise, Kampagnen, die Vertragserstellung sowie die Verwaltung von Fahrzeugen und Vorlagen.

## [Batch 1277.1] Release-Hinweise Contract Calculation: Fehlerbehebungen und Verbesserungen

Im Bereich Contract Calculation wurden zahlreiche Fehler behoben und das Verhalten des Systems an mehreren Stellen verbessert. Die folgenden Abschnitte fassen die Änderungen nach Themen zusammen. Fehlerbehebungen, die ausschließlich abgebrochene Vorgänge betreffen, sind hier nicht aufgeführt.

## [Batch 1278.1] Release-Hinweise: Contract Calculation – Behobene Fehler und Verbesserungen

In diesem Release wurden im Bereich Contract Calculation zahlreiche Fehler behoben und die Bedienung an vielen Stellen verbessert. Die folgenden Abschnitte fassen die Änderungen nach Themen zusammen. Tickets, die abgebrochen wurden, sind hier nicht als Änderung aufgeführt.

## [Batch 1280.1] Contract Calculation: Behobene Fehler und Verbesserungen

In diesem Release wurden zahlreiche Fehler im Bereich Contract Calculation behoben, die vor allem die Produktverwaltung, die Preisversionen und die Vertragserstellung betreffen.

## [Batch 1282.1] Contract Calculation: Produkt- und Preisverwaltung

Im Bereich Contract Calculation wurden zahlreiche Verbesserungen und Fehlerbehebungen an der Produkt- und Preisverwaltung umgesetzt.

## [Batch 198.2] Weitere Änderungen im Bereich Revenue Management

Zusätzlich wurden eine Weiterleitung für nicht existierende Rechnungen in der Ansicht (Frontend) ergänzt und ein Problem behoben, bei dem der Batch-Job DocumentSignatureStatusJob im Status „Running“ hängen blieb.

## [Batch 787.1] Vertragsverlängerung (Prolongation) für MBLD-Verträge

Die Prolongationslogik in oneSCM wurde für MBLD-Verträge erweitert. Service-Verträge für MBLD werden auf Basis einer erweiterten Preismatrix, ohne Kundenunterschrift und ohne Erzeugung oder Versand von Dokumenten und Benachrichtigungen angelegt. Diese Besonderheiten gelten nun auch, wenn ein MBLD-Vertrag über das oneSCM-Frontend oder über die API verlängert wird. Das Frontend nutzen Mitarbeitende von Market Operations (MO) bzw. des MPC, die API nutzt MBLD selbst. Für Retail-Verträge bleibt die bisherige Logik unverändert, und auch die Benutzeroberfläche bleibt wie bei Retail.

## [Batch 708.5] Weitere Änderungen im Bereich Cost Management

Beim Import von I156-Dateien wird die Fahrzeug-Identifizierungsnummer (FIN) aus der Datei mit der FIN des Vertrags verglichen. Stimmen sie nicht überein, wird der Schaden übersprungen. Die VIN kann ignoriert werden. Zudem wurde die Validierungsregel für die erste Zeile angepasst, sodass sie nun 600 Zeichen prüft. Ferner werden in der Schnittstelle E167 nun die Händlerdetails mit exportiert.

## [Batch 967.1] Aktualisierung von Vertragsvorschlägen bei der Leasing-Integration

Die bestehende Leasing-Integration der Vertragserstellung deckte bislang nur den sogenannten Happy Flow ab, also den direkten Weg von der Erstellung bis zur Aktivierung ohne Änderungen dazwischen. Dieser Ablauf wurde um Änderungen erweitert, die vom Endkunden ausgehen und Produkt, Fahrzeug, Laufleistung oder Laufzeit betreffen. oneSCM kann nun Änderungen an bestehenden, noch nicht aktivierten Verträgen berücksichtigen, ohne dass der Vertrag storniert und neu angelegt werden muss. Dies ist insbesondere für angebundene Systeme wie MBLD relevant, deren Anforderungen damit erfüllt werden. Bei preisrelevanten Änderungen werden bereits erstellte Verträge aktualisiert.

Der Lebenszyklus eines Vertragsvorschlags richtet sich nach der Gültigkeit des Angebots und nach Konfigurationsänderungen. In den Market Settings für MBLD wird dazu das neue Feld "Proposal Validity" gepflegt, das die Gültigkeit in Tagen angibt. Läuft die Angebotsgültigkeit ab, setzt das System den Vorschlag automatisch auf den Status "Rejected". Ist das Angebot noch gültig und MBLD fordert die Stornierung des Vertrags an, wird der Vorschlag ebenfalls auf "Rejected" gesetzt, und das System gibt den Antwortstatuscode 200 zurück.

Möchte MBLD eine bereits bestätigte Konfiguration ändern, ruft MBLD über den Aggregator die Vertragskalkulation auf, um ein Preisangebot für die neue Konfiguration zu erhalten. Diese kann ein anderes Produkt und/oder andere Einstellungen enthalten. Anschließend übermittelt MBLD die neue Produktkonfiguration samt Preis über den Aggregator an die Vertragserstellung. Dort wird der bestehende Vorschlag mit den neuen Werten überschrieben, wobei die Referenznummer unverändert bleibt. Die Angebotsgültigkeit wird zurückgesetzt. Konfigurationsänderungen sind beliebig oft möglich, der Aktivierungsprozess wird am aktuellen Schritt fortgesetzt, und das System gibt den Antwortstatuscode 200 zurück. Fordert MBLD keine Änderungen an, läuft die Aktivierung wie gewohnt weiter.

Ein Vertrag kann die Status "Created", "Confirmed", "Activated" und "Rejected" annehmen. "Confirmed" gilt, sobald MBLD den Vertrag und die Konfiguration mit dem Kunden bestätigt; das Bestätigungsdatum wird in der Benutzeroberfläche angezeigt. "Activated" bedeutet, dass der Vertrag aktiviert wurde, "Rejected", dass er abgelehnt wurde.

Bei der Benutzerbehandlung gilt: Ist ein Verkäufer von MBLD in Alice vorhanden, aber nicht oneSCM zugeordnet, werden Anfragen und Vertragsaktivierungen akzeptiert. Für Verkäufer, die in Alice nicht vorhanden sind, ist das Vorgehen noch zu klären.

In der Detailansicht des Vertrags bzw. im Reiter "Vertrag" werden Informationen zum Verkäufer angezeigt: Vor- und Nachname, E-Mail-Adresse, Name des Händlers und Stadt. Wo Informationen nicht verfügbar sind, wird "-" angezeigt, wobei die Struktur unabhängig von der Quelle gleich bleiben soll. Offen ist, ob Vor- und Nachname vom externen System verpflichtend geliefert werden müssen, da die aktuelle API-Version sie nicht bereitstellt.

Für den Vertragsbeginn gilt: Bei fahrzeugbezogenen Produkten wird das Datum der Erstzulassung als Vertragsbeginn verwendet, bei vertragsbezogenen Produkten das Verkaufsdatum.

## [Batch 10.4] Schadencodes anlegen (Cost Management)

Benutzer mit der Rolle Market Operation oder Admin können Schadencodes anlegen, damit diese einem Coverage Code zugeordnet werden können. Die Funktion befindet sich im Admin-Bereich unter „VEGA Codes“ auf dem Reiter „Damage codes“ über die Schaltfläche „Create Damage code“. Sie öffnet einen Assistenten mit drei Schritten. Die Oberfläche folgt der vom Kunden freigegebenen UI-Gestaltung und den Vorgaben der Mercedes-Benz Workbench.

Im ersten Schritt, „Define Damage Code“, wählen Sie einen Coverage Code aus einer Dropdown-Liste mit Einfachauswahl aus. Die Liste basiert auf den Coverage Codes des Coverage-Reiters (Feld Coverage Reference). Die Division (Passenger Cars oder Vans) ist ein schreibgeschütztes Feld und wird anhand des Coverage Codes bestimmt. oneSCM ist dabei das führende System für die Beziehung zwischen Division und Coverage Code. Für jede Kombination aus Division, Damage Code und Damage Type wird eine eigene Zeile in der Tabelle angelegt. Der Damage Code ist ein Pflichtfeld mit genau fünf Zeichen (erlaubt sind 0–9 und A–Z), der Damage Type ein Pflichtfeld mit genau zwei Zeichen (ebenfalls 0–9 und A–Z). Bei ungültigen Eingaben werden Fehlermeldungen angezeigt. Sobald alle Pflichtfelder ausgefüllt sind, wird die Schaltfläche „Weiter“ aktiv.

Im zweiten Schritt, „Market Specificity“, legen Sie fest, in welchen Märkten der Schadencode verfügbar ist. Aktuell steht nur Deutschland zur Auswahl; die Liste wird erweitert, sobald oneSCM weitere Märkte unterstützt. Mit „Select All Markets“ werden alle verfügbaren Märkte ausgewählt. Damit die Schaltfläche „Confirm“ aktiv wird, muss mindestens ein Markt ausgewählt sein. Nach der Bestätigung erscheint auf der rechten Seite für jeden Markt eine Karte mit zwei Pflichtfeldern: Code Description und Type Description. Beide müssen zwischen 5 und 100 Zeichen lang sein, wobei alle Zeichen einschließlich sprachspezifischer Sonderzeichen erlaubt sind. Wird die Auswahl eines Marktes aufgehoben und bestätigt, wird die zugehörige Karte samt Beschreibungen entfernt und gelöscht.

Der dritte Schritt, „Overview & Confirmation“, zeigt eine Übersicht der erfassten Daten. Über das „X“ öffnet sich ein Dialog zum Beenden des Vorgangs, sodass Sie die Anlage abbrechen können. Mit „Zurück“ gelangen Sie zum vorherigen Schritt. Mit „Confirm“ im letzten Schritt wird die Konfiguration in der Übersichtsliste gespeichert.

## [Batch 29.1] Vehicle Management

Im Bereich Vehicle Management wurde die Kopfzeile (Header) der Anwendung samt Hauptmenü neu geschaffen. Das Hauptmenü umfasst acht Menüs: Contract Calculation, Contract Generation, Contract Management, Revenue Management, Cost Management, Vehicle Management, Customer & Partner Management sowie Documents & Communication. Unter Contract Calculation gibt es weitere Navigationsebenen. Die Ebene Vehicle Group enthält die Unterpunkte Overview und Search Baumuster. Die Ebene Products ist in der Definition noch offen, die zugehörigen Unterpunkte sind noch nicht festgelegt. Zusätzlich gibt es den Punkt Prices. Das Design richtet sich nach der Mercedes-Benz Workbench, die Oberfläche muss von Mercedes-Benz freigegeben werden. Zur Abnahme gehören die Anmeldung, der Zugriff auf Vehicle Management und die Anzeige der angelegten Fahrzeuggruppe. Zu beachten ist: Ohne die Definition von Fahrzeuggruppen können keine Produkte angelegt und keine Preise zugeordnet werden.

## [Batch 125.1] Revenue Management: Benutzerrolle „View only"

Mit der Benutzerrolle „View only" steht in oneSCM ein reiner Lesezugriff zur Verfügung. Sie richtet sich an Stakeholder, die das System lediglich ansehen und kennenlernen möchten, sowie an einen automatisierten Crawler-Agenten, der Inhalte aufruft, kopiert oder als Screenshot festhält. Für diese Rolle sind keine Aktionen vorgesehen: Inhalte können eingesehen werden, Änderungen sind nicht möglich.

## [Batch 275.1] Revenue Management: Anzeige des Vertragspreises

Im Bereich „Price information" eines Vertrags wird nun der Gesamtpreis des Vertrags angezeigt. Die Preise des Vertrags (Brutto-, Netto- und Steuerbetrag, je monatlich oder einmalig) werden zum Zeitpunkt der Vertragserstellung berechnet. Market-Operation-Benutzer sehen in diesem Bereich die folgenden Felder: Total Gross Amount (der Gesamtbruttobetrag des Vertrags), Total Net Amount (der Gesamtnettobetrag), Total Tax Amount (der gesamte Steuerbetrag) und VAT Rate (der Mehrwertsteuersatz, zum Beispiel 19 %). Diese Felder sind nicht editierbar. Die Gestaltung entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

## [Batch 276.1] Batch-Job-Verwaltung im Bereich Revenue Management

Administratoren können in der Batch-Job-Verwaltung die Dateien eines bestimmten Jobs durchsuchen, den Ausführungszeitplan eines Jobs festlegen und deaktivierte Jobs wieder aktivieren. Alle drei Funktionen werden über die Jobliste aufgerufen. Gestaltung und Darstellung entsprechen der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

## [Batch 617.3] Kunden anlegen für den MBLD-Anwendungsfall (fertiggestellt)

Für den Fall, dass MBLD per Schnittstellenaufruf einen Vertrag anlegt, muss MBLD zuvor als Kunde im System vorhanden sein. Dafür steht in der Kundenverwaltung eine Schaltfläche zum Anlegen von Kunden zur Verfügung. Sie können Benutzer des Market-Operation-Typs „Commercial“ verwenden. Ein Mitarbeiter der Market Operation kann damit einen B2B-Kunden anlegen. Die SAP-Nummer wird dabei aus oneERP abgerufen, und der Kunde wird anschließend in der Datenbank gespeichert. Der Kunde wird zur Ermittlung der FI-Daten an das FI-System übermittelt; ein Lastschriftmandat-Code ist dafür nicht erforderlich. Der SEPA-Ablauf und der FI-Status sind für diesen Fall nicht aktiviert. Ebenfalls entfallen der Signaturablauf, E-Mails und Benachrichtigungen, Dokumente, eine Angebotsgültigkeit, die CAS-Prüfung, die FI-Prüfung sowie Dublettenprüfungen. Ein Angebot wird vom Frontend storniert, was die Löschung in oneSCM auslösen soll.

## [Batch 1202.2] Weitere Arbeiten im Bereich Contract Calculation

Das Backend wurde in zwei Punkten weiterentwickelt. Der Batch-Job, der die neuesten Aktualisierungen aus oneERP abruft, wurde angepasst. Außerdem wurden Validierungsfunktionen für die einzelnen Ereignistypen im Customer Management geschaffen. Dazu gehören eine Tabelle zur Speicherung fachlicher und Validierungsfehler in der Domänendatenbank, eine Schnittstelle, die diese Fehler samt Paginierung, Sortierung und Filterung für die Anzeige bereitstellt und an OpenSearch angebunden ist, sowie eine Schnittstelle, die anhand einer Vertragsnummer die erforderlichen Daten für das Nemesis-Ereignis der Domäne zusammenstellt und erneut sendet. Die Fehlerstatus (z. B. gelöst oder ausstehend) lassen sich aktualisieren.

## [Batch 1266.1] Überarbeitung der Benutzeroberfläche in Contract Calculation

In mehreren Bereichen von oneSCM wurde die Benutzeroberfläche vereinheitlicht, damit Bedienelemente überall gleich aussehen und sich gleich verhalten. Das betrifft vor allem die Schaltflächen in den Assistenten, die Filter und die Tabellen.

## [Batch 1284.1] Produkt-Assistent (Contract Calculation)

Im Assistenten zum Anlegen eines Produkts wurden mehrere Eingaben und Anzeigen verbessert. In den Schritten 4 und 5, in denen Mindest- und Höchstwerte erfasst werden, darf der Mindestwert nicht mehr größer sein als der Höchstwert; in diesem Fall erscheint eine Fehlermeldung. Der Höchstwert muss außerdem mindestens um 1 über dem Mindestwert liegen und darf diesem nicht mehr gleichen. Dies gilt in Schritt 4 sowie in Schritt 5 beim Anlegen eines Limits. Zudem können die Felder für die Gesamtlaufleistung und die Gesamtlaufzeit in Schritt 4 sowie die Felder für das Fahrzeugalter bei Vertragsbeginn und die Fahrzeuglaufleistung bei Vertragsbeginn in Schritt 5 nur noch ganze Zahlen aufnehmen. Dezimalwerte werden nicht mehr akzeptiert.

Im ersten Schritt des Assistenten sind die Auswahlfelder (Dropdowns) nun kompakter und entsprechen in ihrer Länge den Vorgaben aus den Designdateien. Behoben wurde auch ein Fehler, der den Übergang von Schritt 2 zu Schritt 3 verhinderte: Wenn alle Pflichtfelder ausgefüllt waren (vermutlich in Verbindung mit einem hochgeladenen Bild), erschien beim Klick auf „Weiter“ eine Fehlermeldung. Nun gelangen Sie ohne Fehler zum nächsten Schritt, sobald alle Pflichtfelder ausgefüllt sind.

Die Schaltfläche „Als Entwurf speichern“ (Save as Draft) im Bereich „Product Setup“ ist jetzt nur aktiv, wenn das Pflichtfeld „Product Name“ ausgefüllt wurde. Andernfalls ist sie deaktiviert.

## [Batch 141.2] Beibehaltung der Seitenzahl in der Paginierung

Im Bereich Revenue and Cost Management wird ein einheitlicher Mechanismus eingeführt, der den Paginierungsstatus speichert. Bisher springt die Liste beim Zurückkehren aus einer Detailansicht, etwa einer Rechnung, auf Seite 1 zurück, auch wenn man zuvor zum Beispiel auf Seite 4 war. Nutzer mussten die gewünschte Seite erneut manuell ansteuern, was zusätzliche Klicks und einen langsameren Arbeitsablauf bedeutete. Künftig merkt sich das System die zuletzt besuchte Seite und stellt sie beim Zurückkehren wieder her, etwa über die Zurück-Schaltfläche. Der Status bleibt während der Sitzung erhalten oder bis der Nutzer den jeweiligen Bereich verlässt. Die Funktion richtet sich an MO, HQ und MPC.

Sie gilt im Bereich Payment für Customer Invoices, Price Reduction, Dealer Commission und Workshop Invoice, im Bereich Finance Management für Invoices, Finance Control, Nemesis und International Workshop, im Admin-Bereich für Batch Jobs und CFT Uploads sowie für alle paginierten Seiten der Damage-Code-Seiten.

## [Batch 192.3] Verbesserungen für MBLD

Nach Abstimmung mit dem Vertragsmanagement wird die Bedingung geändert: Statt der Division „Passenger Cars“ gelten nun der Source Channel „Leasing“ und das Source System „MBLD“. Dadurch funktioniert die Funktion für Passenger Cars und VAN gleichermaßen. Diese Änderung befindet sich derzeit noch im BAT-Test und ist dort blockiert.

## [Batch 280.3] Anpassungen in der Übersicht aus dem Sprint-Demo-Feedback

Aufgrund des Feedbacks aus der Sprint-Demo wurden in einer Übersichtstabelle mehrere Änderungen vorgenommen. Die Spalte „Workshop Invoice Status" wird in der Oberfläche nicht mehr angezeigt. „Workshop Invoice Number" heißt nun „Vega Claim Number", „Approve" heißt „Accepted", „Dealer Name" heißt „Dealer Name / Workshop Name", und „Total Accepted Invoice Amount" heißt „Total Claim Amount".

## [Batch 765.5] Anpassung über die Schnittstelle (MBLD)

Eine Vertragsanpassung kann auch über die API durch MBLD angestoßen werden. Die Anfrage liefert nur die tatsächlich möglichen Optionen für eine Verkürzung von Laufzeit und/oder Fahrleistung zurück. Der Prozess arbeitet wie die Langzeitverlängerung, erlaubt aber zusätzlich die Reduzierung der ursprünglichen Fahrleistung und/oder Laufzeit. Unterschrift und Dokumente entfallen. Die Änderungen werden auf Vertragsebene übernommen, die Vertragsdaten in der Oberfläche aktualisiert, der Preis-Tab um eine Spalte ergänzt und der Vertrag in die nächste i155-Datei aufgenommen.

## [Batch 1154.1] Preismatrix bei MBLD: Randzellen werden automatisch befüllt

Bei MBLD werden die Preise der Servicevertragsprodukte als Gesamtlaufleistung dargestellt. Lücken in der Preismatrix werden durch lineare Interpolation gefüllt. Bisher wurde nur dann interpoliert, wenn eine Zelle innerhalb derselben Spalte sowohl in einer vorhergehenden als auch in einer nachfolgenden Zelle einen gültigen Preis hatte. Zellen ohne gültige Werte davor und danach blieben leer. Diese Randzellen werden nun nach festen Regeln befüllt. Für jede Laufleistungsspalte gilt: Der erste verfügbare Preispunkt wird in alle darüberliegenden Zellen derselben Spalte übernommen (obere Randlücken). Der letzte verfügbare Preispunkt wird in alle darunterliegenden Zellen derselben Spalte übernommen (untere Randlücken).

## [Batch 238.4] Benutzeroberfläche

In den Bereichen Revenue Management und Cost Management, etwa bei Rechnungen, Financial Control und Batch Jobs, wurden die Symbole für Suchen und Zurücksetzen einheitlich durch neue Symbole ersetzt, die einer fachlichen Anforderung entsprechen.

## [Batch 291.7] Rückmeldungen an den Nutzer

Bei erfolgreicher Erstellung erscheint die Meldung „Invoice <INVOICE_NUMBER> was successfully created“. Schlägt die Erstellung fehl, wird die Fehlermeldung „Invoice <INVOICE_NUMBER> could not be created.“ angezeigt. Diese Fehlermeldung enthält eine Schaltfläche „Close“ und bleibt sichtbar, bis der Nutzer sie schließt.

## [Batch 1019.3] Vertragsbeginn in der Produktkonfiguration

Händler können das Startdatum des Vertrags nun direkt im Produktkonfigurator festlegen. Das ist hilfreich bei Produkten, die nicht ausschließlich vom FRD abhängen. Nach der Fahrzeugeingabe wird die Vertragskalkulation (Contract Calculation) aufgerufen, die die passenden Produktoptionen liefert. Nach der Auswahl eines Produkts konfiguriert der Benutzer es über Dropdowns für die Laufzeit in Monaten (12, 24, 36, 48 oder 60), die jährliche Fahrleistung in Kilometern und das Zahlungsintervall. Neu hinzu kommt das Pflichtfeld „Contract Starting Date“ als Kalenderfeld.

Das Startdatum kann über den Datumsauswähler gewählt oder per Tastatur eingegeben werden. Ein Datum in der Vergangenheit ist weder über den Datumsauswähler noch per Tastatur zulässig. Wird per Tastatur ein zurückliegendes Datum eingegeben, erscheint die Fehlermeldung „Dates cannot be backdated, please enter a valid date.“. Ist das eingegebene Datum gültig, wird die Schaltfläche „Next“ aktiviert.

Für das Startdatum gilt je nach Produkt: Bei dem Produkt EXCELLENT übernimmt das „Contract Starting Date“ den Wert des FRD und ist schreibgeschützt. Bei allen anderen Produkten stellt es das geplante Startdatum (Planned Start Date) dar. Auch hier entspricht die Oberfläche der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

## [Batch 1240.1] Produktkalkulation – Produkt anlegen: Schritt „Configuration 1"

Nachdem Sie im vorherigen Schritt „Base information" alle Pflichtangaben vollständig erfasst haben, gelangen Sie als MPC-Benutzer in den dritten Schritt des Assistenten, „Configuration 1". Hier sehen Sie die Optionen aus dem im ersten Schritt gewählten Blueprint und legen fest, welche davon für Ihr Produkt zulässig sein sollen. Alle angezeigten Listen werden aus dem ausgewählten Produkt-Blueprint gelesen. Der Wechsel in diesen Schritt ist über die Schaltfläche „Weiter" möglich, sobald diese im vorherigen Schritt aktiv ist.

Die Sales Logic können Sie in diesem Schritt konfigurieren. Beim Sales Level stehen per Dropdown mehrere auswählbare Optionen zur Verfügung: Customer, Retail und Market. Auch der Sales Channel ist ein Dropdown mit Mehrfachauswahl. Zur Wahl stehen Stationary Retail Sales (stand-alone), Direct Online Sales (stand-alone), Leasing, Rental und Finance.

Die Main Coverages werden ausschließlich zur Information angezeigt und können nicht verändert werden. Mögliche Einträge sind Maintenance (MAINTEN P001), General Wear & Tear (WEAR_MAIN P002), Vehicle Wear and Tear (WEAR_VEH P003), Parts Warranty (W_PT P004), Vehicle Warranty (W_VEH P006) und Residual Warranty (W_RESIDUE P007). Ebenfalls nur lesbar ist die Contract Logic, für die der Eintrag „Vehicle Related" vorgesehen ist. Die Pricing Logic wird gleichfalls schreibgeschützt dargestellt. Sie umfasst das Preismodell „Fixed Price" sowie als Aufschlag den „Payment-Dependent Markup".

Konfigurieren können Sie darüber hinaus die Discounts, die Modifications und den Expiry. Bei den Discounts wählen Sie per Dropdown mit Mehrfachauswahl aus Sales, After Sales und Dealer. Bei den Modifications steht ebenfalls eine Mehrfachauswahl zur Verfügung: Contract Change, ShortTerm Extension und Contract Transfer. Beim Expiry ist dagegen nur eine einzelne Option wählbar, nämlich entweder Time oder Time or mileage.

Sobald Sie alle Pflichtfelder ausgefüllt beziehungsweise ausgewählt haben, wird die Schaltfläche „Weiter" aktiviert. Für die Navigation stehen Ihnen in diesem Schritt folgende Aktionen zur Verfügung: Mit „Abbrechen" verlassen Sie den Assistenten und kehren zur Übersicht der Produktliste zurück, ohne dass Änderungen gespeichert werden. Haben Sie in diesem oder im vorherigen Schritt mindestens ein Feld ausgefüllt oder geändert, erscheint zuvor ein Bestätigungsdialog. Bestätigen Sie mit „Ja", werden der Dialog und der Assistent geschlossen und die Änderungen verworfen. Wählen Sie „Nein", wird der Dialog geschlossen und Sie kehren in den Assistenten zurück. Wurde seit der zuletzt gespeicherten Version nichts geändert, wird der Assistent direkt geschlossen.

Mit „Als Entwurf speichern" werden alle Änderungen auf dieser Seite sowie aus vorherigen oder folgenden Schritten gespeichert. Anschließend gelangen Sie zur Produktübersicht, wo das Produkt in der Liste angezeigt wird. Dies ist möglich, sobald alle Pflichtfelder ausgefüllt oder ausgewählt sind. Mit „Zurück" wechseln Sie zum vorherigen Schritt, mit „Weiter" zum nächsten Schritt; in beiden Fällen werden die auf dieser Seite vorgenommenen Änderungen gespeichert.

## [Batch 1243.1] Produktübersicht in der Produktkalkulation

Über das Hauptmenü der Produktverwaltung erreichen Sie den Menüpunkt „Products & Prices". Wenn Sie ihn auswählen, öffnet sich die Produktübersicht. Dort sehen Sie als MPC-Benutzer alle Produkte Ihres Marktes, und ausschließlich die Produkte Ihres Marktes. Sie können die Produkte einsehen, durchsuchen und verwalten. Beim Aufruf der Seite wird die Produktliste automatisch mit den verfügbaren Einträgen geladen. Standardmäßig werden Produkte in den Status Draft, Created, Ready, Published und Deactivated angezeigt. Gelöschte Produkte sind zunächst ausgeblendet.

## [Batch 229.8] Hinweis

Der manuelle Testlauf für Cost Management (E167 Werkstattrechnungen) ist noch offen.

## [Batch 1023.1] Erweiterung des Vertragsdatenmodells

Bisher wurde bei der Generierung eines Vertrags aus den Produktdaten ausschließlich die Produkt-ID gespeichert. Mit der Erweiterung werden zusätzliche Basisdaten aus der Vertragskalkulation im Vertrag abgelegt. Dazu gehören die Produktlinie samt Beschreibung, der Vega-Vertragstyp, der Produktname, die Produktbezeichnung (Sales Designation), ein Zusatztext, die Produktkonfigurationslogik (fahrzeug-, vertrags- oder kontingentbezogen), die Produktkonfiguration sowie die Hauptdeckungen. Diese Felder sind bei neuen Verträgen Pflichtfelder. Optionale Deckungen und die Servicewerkstatt werden ergänzt, sofern sie vorhanden sind.

Ziel ist es, die Verträge von nachträglichen Produktänderungen zu entkoppeln. Produkte, einschließlich Name und Deckungen, können sich im Lauf der Zeit ändern. Hat ein Kunde ein Produkt mit bestimmten Deckungen erworben, sollen diese Deckungen in seinem Vertrag unverändert erhalten bleiben, auch wenn das ursprüngliche Produkt später angepasst wird. Wird ein neuer Vertrag generiert, werden alle genannten Datenattribute im erzeugten Vertrag gespeichert.

## [Batch 131.1] (ohne Überschrift)

**Hinweis zur Datenlage:** Von den drei Tickets enthält nur eines (Rückbuchung bei weitergeleiteten Werkstattrechnungen und Schadensfällen) verwertbare Inhalte. Die beiden anderen (Transaktionstyp statt Dokumenttyp sowie Multi-Market-Setup) bestehen nur aus unausgefüllten Vorlagentexten. Das erste ist zudem abgebrochen. Ich habe dazu daher keine Funktionsbeschreibung formuliert, um nichts zu erfinden.

## [Batch 1029.4] Preisbezogene Prüfungen

Voraussetzung ist, dass der Gesamtpreis brutto und der monatliche Kundenpreis brutto zuvor von der Domäne Contract Calculation validiert wurden. Die von Contract Calculation gelieferten Preise sind Nettopreise; die Mehrwertsteuer wird erst in der Domäne Contract Generation hinzugefügt.

Bei der ersten Preisprüfung wird kontrolliert, ob der dem Vertrag zugewiesene Gesamtpreis brutto mit dem im ersten Schritt gewählten und konfigurierten Preis übereinstimmt. Der Gesamtpreis brutto des Kunden muss dazu dem Bruttolistenpreis der Produktvariante in oneSCM entsprechen. Ist das der Fall, gilt die Prüfung als bestanden. Weicht er ab, gilt sie als nicht bestanden, es erscheint die Meldung „The selected price is no longer available“, und der Vorgang wird nicht fortgesetzt.

Bei der zweiten Preisprüfung wird entsprechend kontrolliert, ob der dem Vertrag zugewiesene monatliche Kundenpreis brutto mit dem monatlichen Bruttolistenpreis der Produktvariante in oneSCM übereinstimmt. Bei Übereinstimmung gilt die Prüfung als bestanden. Bei einer Abweichung erscheint ebenfalls die Meldung „The selected price is no longer available“, und der Vorgang wird nicht fortgesetzt.

## [Batch 519.12] Hinweis zum Umsetzungsstand

Die Funktion befindet sich im Dev Backlog und ist noch nicht umgesetzt. Mehrere Punkte erfordern noch Freigaben, etwa die Architekturentscheidung zur Erweiterung von Edge um einen Kafka-Listener und einen ausgehenden Callback, die verbindliche Festlegung des Kündigungsdatums und die Aufbewahrungsfristen. Zudem müssen vorab Contract Service (Konsumentenkennung, Datum, Anreicherung des Ereignisses), Revenue Management (Kontrollkästchen, Vertriebskanal-Prüfung, Outbox, Audit) und das oneSCM-Frontend angepasst werden. Der Zeitpunkt der Übermittlung hängt von der manuellen Rechnungserstellung durch den Mitarbeiter ab und kann daher relativ zur Kündigung nicht garantiert werden.

## [Batch 983.3] Angebot mit Auftragsnummer

Hat der Auftrag bereits eine Fahrgestellnummer, läuft der Ablauf wie bei vorhandener Fahrgestellnummer. Das gilt auch, wenn der Auftrag noch keine Fahrgestellnummer hat, da Vertragskalkulation und Fahrzeugverwaltung bereits über die SA-Codes verfügen und erkennen können, ob eine Technische Option vorliegt.

## [Batch 1165.3] Behobene Probleme

Mehrere Probleme mit einzelnen Verträgen in der Produktivumgebung wurden untersucht und abgeschlossen. Es handelt sich dabei um drei Verträge der Vertragskalkulation.

## [Batch 83.8] Hinweis zum Entwicklungsstand

Nach den vorliegenden Informationen existiert die API zur Auswahl und Übermittlung an MBLD noch nicht; die Zuständigkeit des Edge-Service-Teams ist noch nicht formal zugewiesen. Die Auswahllogik für die MBLD-Übermittlung ist hier jedoch wie oben beschrieben festgelegt.

## [Batch 116.2] Mehrere Entscheidungen in derselben Datei

Enthält eine I156-Datei mehrere Entscheidungsnummern für denselben Claim, denselben Coverage Code und denselben Damage Code, wird nur die jeweils letzte Entscheidung berücksichtigt. Zwischenbelege werden nicht erzeugt, frühere Entscheidungen werden vollständig ignoriert. Lautet die letzte Entscheidung auf 0 EUR und ist der Damage Code abgelehnt, entsteht gar kein SCIN. Beträgt die letzte Entscheidung beispielsweise 150 EUR, wird genau ein SCIN über 150 EUR im Status „Planned“ angelegt, ohne Differenzberechnung, als hätte die erste Entscheidung nie existiert. Liegen drei Entscheidungen vor, wird nur die dritte verwendet.

## [Batch 218.7] Konfiguration der Steuerverwaltung in oneSCM für Indien

Im Reiter Tax Types sind folgende Steuerarten angelegt, jeweils mit Tax Category Client, Customer Tax Classification Standard, Type GST und Customer Classification Debtor: Standard_MBIL_INV_Intra, Standard_MBIL_CN_Intra, Standard_MBIL_INV_Inter und Standard_MBIl_CN_Inter.

Im Reiter Tax Rates sind den Steuerarten folgende Steuersätze zugeordnet, alle mit Entity Client, Tax Type GST und Tax Factor 0.18. Die Gültigkeit reicht jeweils vom aktuellen Datum plus einem Tag bis zum 31.12.2099.

Standard_MBIL_INV_Intra hat den FI Tax Code SA mit der Beschreibung Invoice. Standard_MBIL_CN_Intra hat den FI Tax Code SA mit der Beschreibung Credit. Standard_MBIL_INV_Inter hat den FI Tax Code SB mit der Beschreibung Invoice. Standard_MBIl_CN_Inter hat den FI Tax Code SB mit der Beschreibung Credit.

## [Batch 326.3] Standardwert für kundenbezogene Daten

Für Kunden, die nicht als „Commercial customer“ (partner_type_txt) geführt werden, also insbesondere für Privatkunden, werden bestimmte Felder in den Data Products mit dem Standardwert „anonymous“ befüllt. Dies betrifft licence_plate_txt, cust_number_fi_id, cust_name_txt, sc_payer_id, sc_payer_name_txt, invoice_recipnt_txt und invoice_recipnt_number_id. Der Standardwert gilt nur in den Tabellen der Data Products. Im UDM bleibt der Inhalt vergleichbar mit dem der Quelle. Für SIRIUS-Märkte war die Regelung zum Zeitpunkt der Ticketerstellung noch in Klärung, da dort nicht bei allen Verträgen zwischen privaten und gewerblichen Kunden unterschieden werden kann. Vorgesehen war, die genannten Felder auf den Standardwert zu setzen und nur cust_number_id bereitzustellen.

## [Batch 696.2] Ablauf des Imports

Nach dem Empfang wird die Datei zunächst geparst und strukturell validiert (Datei-Zeitstempel und Anzahl der Datensatztypen). Anschließend folgt je Meldung die Dublettenprüfung: Existiert bereits eine Meldung mit derselben VEGA-Antragsnummer, Entscheidungsnummer und demselben Zeitstempel, wird sie übersprungen. Danach wird geprüft, ob der referenzierte Vertrag in oneSCM existiert; andernfalls wird die Meldung ebenfalls übersprungen. Als nächster Schritt folgt die neue Zählerprüfung für Contingent-Schadencodes. Meldungen, die alle Prüfungen bestehen, werden als Werkstattrechnungen gespeichert, und ein Contingent-Count-Event aktualisiert die Verbrauchsverfolgung. Zuvor wurde die Kontingentkonfiguration beim I156-Import nicht berücksichtigt, sodass Meldungen mit Zähler null unbemerkt importiert wurden und einen Verbrauch von null Einheiten erzeugten.

## [Batch 717.2] Import der I156-Datei

Weichen beim Import der I156-Datei das Datum der Erstzulassung oder der VEGA-Code vom Vertrag ab, wird der Schadenfall dennoch importiert. Zusätzlich wird ein Fehlerprotokoll in DataDog angelegt.

Bei Fehlern in der Erstellung von Werkstattrechnungen wird der betroffene Schadenfall übersprungen, und jeder Fehler wird protokolliert. Ein Mechanismus für die erneute Verarbeitung nicht vollständig verarbeiteter I156-Dateien wurde geprüft, aber nicht umgesetzt.

## [Batch 740.8] Satzart PTXT01 (243 Zeichen)

Dieser Satz enthält die Verarbeitungsnummer, die Positionsnummer der Rechnung und einen Text mit dem festen Wert „Betreffende Antragsnummer“, gefolgt von der Antragsnummer (Claim Number) aus Satzart 20. Das restliche Feld bleibt leer.

Weitere Details zu den Mapping-Regeln sind in der zugehörigen Confluence-Dokumentation „Old Part Tax Mapping rules“ hinterlegt.

## [Batch 835.4] Technische Anpassungen

Im Vertragsobjekt wurden die Felder „collectable“ und „salesPartnerId“ entfernt, da sie inhaltlich den Feldern „collectiveInvoice“ bzw. „outletId“ entsprechen. Die Schnittstelle „updatePaymentInterval“ erhält nun den Parameter „collectiveInvoice“. Im Verkaufsobjekt wurden die Felder „outletId“, „name“ und „country“ ergänzt.

## [Batch 53.2] Import von Schadensmeldungen (I156)

Ebenfalls im Bereich Revenue Management wurde eine Anpassung am I156-Import vorgenommen. Der Import erlaubt nun mehrere RC20-Schadenseinträge mit demselben Schadenscode, sofern sie sich in der Schadenssequenznummer unterscheiden. Einträge mit identischem Schadenscode werden somit nicht mehr als Konflikt gewertet, wenn ihre Schadenssequenznummern verschieden sind. Diese Änderung befindet sich derzeit noch im Teststatus, sodass sich Details bis zur endgültigen Freigabe noch ändern können.

## [Batch 118.2] Hinweise zum aktuellen Stand

Auf der Pre-Prod-Umgebung tritt derzeit ein Fehler auf: Beim Bearbeiten einer Schadencode-Übersetzung erscheint die Meldung „No damage code found for given damage code.“ Außerdem gilt für Beschreibungen derzeit eine Mindestlänge von 5 Zeichen. Diese soll in einer separaten Änderungsanforderung auf 2 Zeichen reduziert werden.

Zwei weitere Punkte im Bereich Revenue Management wurden abgebrochen und werden nicht umgesetzt. Sie betrafen die Erstellung eines Zahlungsplans bei Deckungen mit Kostenträger „Supplier“, die von VEGA ausgeschlossen sind, sowie ein fehlerhaft zugeordneter neuer Mapping-Typ für SMWT-MTNWT.

## [Batch 164.3] Materialnummernverwaltung und Produktlinien

In der Materialnummernverwaltung wird die Produktlinie nun über die von M&M bereitgestellte Produktlinien-API bezogen. Wo im Revenue Management weitere Stellen die Produktlinie verwenden, wurden diese ebenfalls angepasst. Zuvor wurde bei einer Materialnummer die Produktlinie fälschlich als „Enums.ProductLine.BASIC" angezeigt. Außerdem wird die Prüfung vorbereitet, dass die Produktlinie „Basic" für die Division Passenger Car in der Materialnummernverwaltung nicht mehr verfügbar ist.

## [Batch 190.2] Weitere Änderungen

Im Bereich Revenue Management wurde ein Fehler behoben: Die Sortierung der Spalten „Amount Old Part Tax Base“ und „Amount Old Part Tax“ funktioniert nun.

Zwei weitere Punkte, die Anpassung des Gültigkeitsbeginns in der Materialverwaltung auf den 01.01.2025 und die Ergänzung der Umgebungseinstellung „one-scm.enviroment“ in der Konfigurationsdatei application.yaml, wurden geschlossen. Für Anwender ergeben sich daraus keine Hinweise.

## [Batch 196.2] Behobene Probleme

Im E169-Exportfile für oneERP fehlte bei Gutschriften die SAP-Debitorennummer. Dieses Problem wurde bearbeitet und geschlossen. Ebenfalls abgeschlossen wurde eine Anpassung der Synchronisierung beim Start der Anwendung, damit zu Beginn der Synchronisierung bereits alles bereitsteht.

## [Batch 1204.7] Weitere Tests

Für das MPC-Dashboard und die Seite „Preise anzeigen“ der Contract Calculation stehen manuelle Testausführungen noch aus.

## [Batch 47.7] Hinweis zum aktuellen Stand

Laut den vorliegenden Angaben existiert die API zur Auswahl und Übermittlung von Dokumenten an MBLD noch nicht, und eine abgestimmte Auswahllogik dafür ist noch nicht definiert. Die Zuständigkeit des Edge-Service-Teams ist noch nicht formal zugewiesen.

## [Batch 54.7] Hinweis zum Stand

Laut den vorliegenden Angaben existiert die API zur Auswahl und Übermittlung an MBLD noch nicht, und die Zuständigkeit des Edge-Service-Teams ist noch nicht formal geklärt. Das Ticket befindet sich im Teststatus.

## [Batch 57.8] Hinweis zum aktuellen Stand

Die API zur Auswahl und Übertragung an MBLD existiert laut den Rohdaten noch nicht; die Zuständigkeit des Edge-Service-Teams ist noch nicht formal geklärt, und eine abgestimmte Auswahllogik liegt bislang nicht vor.

## [Batch 71.6] Anzeige

MDCR-Rechnungen sind auf der Seite „Finanzdokumente“ sichtbar und können dort in der Ansicht eingesehen werden.

## [Batch 77.7] Anzeige

MDCR-Rechnungen sind auf der Seite „Finanzdokumente“ sichtbar und können dort in der Ansicht betrachtet werden.

## [Batch 102.7] Anzeige

Erstellte MDCR-Rechnungen sind auf der Seite „Finanzdokumente“ sichtbar und können dort in der Ansicht betrachtet werden.

## [Batch 102.8] Hinweis zum aktuellen Stand

Laut den vorliegenden Informationen existiert die API zur Auswahl und Übermittlung von Dokumenten an MBLD noch nicht, und die Auswahllogik dafür ist noch nicht verbindlich abgestimmt. Die Zuständigkeit des zuständigen Teams ist noch nicht formal zugewiesen. Dieser Teil sollte vor Veröffentlichung des Handbuchtexts auf seinen tatsächlichen Stand geprüft werden.

## [Batch 105.7] Anzeige

Das erstellte MDCR ist auf der Seite „Finanzdokumente" sichtbar und kann dort in der Ansicht für MDCR-Rechnungen eingesehen werden.

## [Batch 112.9] Hinweis zum Entwicklungsstand

Die Funktion befindet sich noch in Entwicklung. Die API zur Auswahl und Übertragung der Belege an MBLD existiert derzeit noch nicht, und die Zuständigkeit dafür ist noch nicht formell zugewiesen.

## [Batch 249.4] Satzart INIT

Der Satz INIT hat 21 Zeichen und enthält ausschließlich feste Werte: den Satztyp INIT, das sendende System 1SCM, die Datenart 1SCM, die Niederlassungsnummer des Rechnungsstellers 268 (wie in „K“) und die Betriebsnummer 00.

## [Batch 258.3] Integration der Steuerverwaltung in die Kundenanlage

Die Steuerverwaltung ist mit der Kundenanlage verknüpft. Wird ein Vertrag mit der VAT-Klassifizierung „Exempt" angelegt, steht bei der Rechnungserstellung ausschließlich die Option „Exempt" zur Verfügung. Entsprechend steht bei einem Vertrag mit der Klassifizierung „Standard" nur die Option „Standard" zur Verfügung.

## [Batch 263.4] Suche nach Vertragsnummer

Auf der Seite „Invoices“ im Admin-Bereich war die Suche nach einer Vertragsnummer zuvor nicht möglich: Es erschien ein Fehlersymbol, und die Schaltfläche „Search“ war deaktiviert. Dieses Problem wurde behoben.

## [Batch 321.4] Sicherheit

Die Reporting-Module wurden auf Schwachstellen untersucht, die das Tool Black Duck in den Code-Repositories gemeldet hat. Zunächst wurden die als kritisch und hoch eingestuften Schwachstellen behandelt. Dies schloss auch das Glue-Repository ein.

## [Batch 696.3] Protokollierung in Datadog

Für jede übersprungene Meldung wird ein eigener strukturierter Protokolleintrag in Datadog geschrieben. Er enthält die VEGA-Antragsnummer, den Schadencode, den Coverage-Code, die Vertragsnummer und den Grund des Überspringens, zum Beispiel: „Claim skipped – Damage code [X] has Number of Usages configured but counter value in I156 is zero.“ Entsprechende Meldungen gibt es für Zählerwerte, die größer oder kleiner als der konfigurierte Wert sind, sowie für Zählerwerte, die die verbleibenden Nutzungen des Vertrags übersteigen.

## [Batch 740.3] Satzart INIT (21 Zeichen)

Dieser Satz enthält ausschließlich feste Werte: die Satzart „INIT“, das sendende System „1SCM“ (ein rein technischer Begriff), die Datenart „1SCM“, die Betriebsnummer „268“ (Charter Way) und die Betriebsnummer des Rechnungsstellers „00“. „00“ steht für Servicevertrag; weitere Werte sind 04 für Miete und 09 für Fleetsite.

## [Batch 1258.4] Fahrzeugalter

Das Feld „Vehicle Age“ wird nun in Monaten geführt, wobei 1 Jahr 12 Monaten entspricht. Die Berechnung erfolgt im Backend auf Monatsbasis.

