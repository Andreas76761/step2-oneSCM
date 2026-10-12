# 18 Migration und Übernahme von Bestandsdaten

Dieses Kapitel beschreibt, welche Bestandsdaten aus Altsystemen und dem Legacy-System in oneSCM und in die Datenprodukte übernommen werden. Es zeigt, wie Sie Datenfelder zuordnen und prüfen, welche übernommenen Kunden und Verträge Sie kontrollieren, welche Korrekturwege bei Fehlerfällen bestehen und wie Legacy-Daten und oneSCM-Daten für die Märkte Tschechien und Schweiz während der Umstellung parallel verarbeitet werden. Die Anlage und Pflege von Kunden im Vertragsprozess beschreibt Kapitel 4, die Datenplattformen und das Reporting Kapitel 19.19, die Testnachweise Kapitel 16.4.

## 18.1 Umfang und Abgrenzung der Migration

**Zweck.** Der Umfang legt fest, für welche Märkte und Datenprodukte Legacy-Daten und oneSCM-Daten zusammengeführt werden. Die Datenbereitstellung aus oneSCM in die Data Foundation umfasst die Märkte Tschechien, Schweiz, Malaysia und Korea. Die Länderkürzel lauten CZ für Tschechien, CH für Schweiz, MY für Malaysia und KR für Korea. Die Märkte CZ und CH sind Bestandsmärkte: Ihre Daten liegen bereits aus dem Legacy-System in der Data Foundation vor und fließen in den oneSCM-Bezugsprozess ein. Für Malaysia und Korea werden die Daten aus oneSCM bereitgestellt.

**Voraussetzungen.** Die Datenprodukte stehen als Iceberg-Datenprodukte bereit, sofern das Iceberg-Sharing startet. Für alle vier Märkte relevant sind die Datenprodukte base_service_contracts, base_sc_costs, base_sc_revenues, base_sc_customer und sc_price_details.

**Rollen.** Die Konsumenten der Datenprodukte in der Zentrale und die Rollout-Märkte nutzen die bereitgestellten Daten.

**Schritt für Schritt.**

1. Die Daten der vier Märkte durchlaufen den gesamten ETL-Prozess, beginnend bei den Kafka-Nachrichten aus oneSCM.
2. Der Data Capture Service und der Reporting Service verarbeiten alle vier Märkte.
3. Für jeden der vier Märkte läuft ein Glue-Transformationsjob job_onescm_delta_transform.
4. Die Jobs zur Erstellung der Datenprodukte berücksichtigen Malaysia und Korea.

**Ergebnis und Systemstatus.** Der Prozess führt durchgängig von der Bereitstellung in oneSCM bis zur Lieferung in die Base-Datenprodukte und in das Preis-Datenprodukt sc_price_details. Die Daten der vier Märkte spiegeln den Stand in oneSCM wider.

**Besonderheiten je Rolle, Sparte und Markt.**

- Tschechien und Schweiz: Legacy-Daten und oneSCM-Daten werden bis zum Ende der Migration parallel verarbeitet. Die Details beschreibt Kapitel 18.6.
- Malaysia und Korea: Die Daten stammen aus oneSCM.
- Sparte: Material: keine Quellen in den RAG-Batches.

**Hinweise.** Dieses Kapitel beschreibt die Übernahme von Bestandsdaten. Die Details der Reporting-Pipeline, also Datenkatalog, Batch-Job-Einträge und Benachrichtigung bei fehlenden Marktdaten, stehen in Kapitel 19.19. Die Automatisierung der Smoke-Tests steht in Kapitel 16.4.

**Fehlerbehebung.** Material: keine Quellen in den RAG-Batches.

Quellen: Batch 299.1, 300.1

## 18.2 Quellsysteme und Datenobjekte

**Zweck.** Das Datenprodukt SC Cost stellt Kostendaten zu Serviceverträgen bereit. Es enthält alle Kosten mit den definierten Datenfeldern für sämtliche Märkte und Anwendungen in einer einzigen Einheit.

**Voraussetzungen.** Das vereinheitlichte Datenmodell enthält die zusätzlichen Attribute. Das Basisdatenprodukt für Servicevertragskosten befüllt diese Attribute.

**Rollen.** Abnehmer des Datenprodukts sind die SPOT-Kolleginnen und -Kollegen sowie weitere Abnehmer. Die Übergabe erfolgt beispielsweise per DDX an extollo.

**Schritt für Schritt.**

1. Das vereinheitlichte Datenmodell wird um die zusätzlichen Attribute ergänzt.
2. Das Basisdatenprodukt für Servicevertragskosten befüllt die zusätzlichen Attribute.
3. Eine Delta-Lieferung des Datenmodells aktualisiert die zusätzlichen Attribute für den gesamten Datenbestand.
4. Vor dem Schreiben neuer Daten legt das System eine Sicherung an.
5. Das Datenprodukt steht in mehreren Datenformaten bereit, etwa XML und CSV.
6. Das System benachrichtigt über Erfolg oder Fehlschlag der Erstellung.

**Ergebnis und Systemstatus.** Das Datenprodukt enthält aktuelle, vollständige und konsistente Daten im definierten Format, einschließlich der zusätzlichen Attribute.

**Besonderheiten je Rolle, Sparte und Markt.**

- Legacy-Anwendungen iCON, ASSET und SIRIUS: Es werden nur Daten berücksichtigt, die im CostAlternativeReport für iCON bzw. in den CostReports für ASSET und SIRIUS enthalten sind.
- oneSCM-Markt: Die zusätzlichen Attribute sind für den oneSCM-Markt relevant.
- Sparte: Material: keine Quellen in den RAG-Batches.

**Hinweise.** Die Anbindung an ISP beschreibt dieses Kapitel nicht. Die offenen Punkte stehen im Klärungsbedarf.

**Fehlerbehebung.** Im Fehlerfall stellt das System das Datenprodukt aus der Sicherung wieder her.

Quellen: Batch 342.2, 884.6

## 18.3 Datenzuordnung und Qualitätsprüfung

**Zweck.** Die Datenzuordnung überführt die Daten der Altsysteme iCON, ASSET und SIRIUS in ein einheitliches Modell. Dazu gehören die Zuordnung der Reporting-Attribute und die Belegung einzelner Felder in den Datenprodukten.

**Voraussetzungen.** Eine Metadatenvorlage erfasst für die Reporting-Attribute den Alias im jeweiligen Report. Die Vorlage ist für alle Attribute der iCON-Reports DDECostAlternative befüllt. Die Metadaten aller relevanten Reports sind eingetragen.

**Rollen.** Material: keine Quellen in den RAG-Batches.

**Schritt für Schritt.**

1. Die Metadaten der Reports werden erfasst. Für jedes Attribut wird der Alias im Report ermittelt und ergänzt.
2. Glue-Pipelines bereinigen und transformieren die Daten aller Altsysteme.
3. Die Pipelines überführen die Daten in das einheitliche Modell.
4. Abweichungen und fehlende Daten werden in AWS behandelt, weil für manche Felder in einem anderen System kein Gegenstück existiert.
5. Nach der Bereitstellung des Vertriebskanals startet die Business Unit für oneSCM-Verträge einen vollständigen Ladevorgang, den Full Load.

**Ergebnis und Systemstatus.**

- Das Feld sales_channel_cd steht im SC-Base-, im SC-Cost- und im SC-VAN-Cost-Datenprodukt zur Verfügung.
- Die Verkäufer-User-ID steht im Feld salesman_number_id des Datenprodukts und des UDM.
- Die Tabelle base_service_contracts enthält für oneSCM-Verträge die Verkäufer-E-Mail-Adresse, die Verkäufer-User-ID und das Ablaufkriterium.

**Besonderheiten je Rolle, Sparte und Markt.**

- iCON- und ASSET-Märkte: sales_channel_cd stammt aus dem Feld SalesChannel des Inventory-Reports.
- SIRIUS-Märkte: Ein Quellfeld existiert nicht. Das Feld sales_channel_cd bleibt leer.
- oneSCM-Märkte: sales_channel_cd stammt aus dem Feld Source System/Channel des jeweiligen Vertrags.
- Verkäufer-E-Mail-Adresse und Verkäufer-User-ID stehen nur für oneSCM-Verträge zur Verfügung. Für Legacy-Verträge sind sie nicht befüllt.
- Sparte: Material: keine Quellen in den RAG-Batches.

**Hinweise.** Die Angaben zu UDM, Mapping und Datenprodukten stehen in der Confluence-Dokumentation.

**Fehlerbehebung.** Material: keine Quellen in den RAG-Batches.

Quellen: Batch 346.2, 326.2, 307.3

## 18.4 Übernommene Kunden und Verträge prüfen

**Zweck.** Sie prüfen die übernommenen Kunden und Verträge der Legacy-Märkte. Die Prüfung umfasst die Vollständigkeit der übernommenen Daten, die Frist für Altverträge und die Schadenfallvolumen je Markt.

**Voraussetzungen.** Die Kunden der Märkte CH und CZ stammen aus den jeweiligen Altsystemen. Legacy-Verträge und Legacy-Kunden sind für die Märkte AT, CH, CZ, FR und GB registriert.

**Rollen.** Das Service-Team und die Operatoren führen den Schadenfall-Import je Markt aus und überwachen ihn. Migrations- und Fachverantwortliche stimmen die Schadenfallvolumen je Markt vor der Migration ab. Das Revenue-Management nutzt den Import über die Lese-API.

**Schritt für Schritt.**

1. Prüfen Sie die übernommenen Kundendaten der Märkte CH und CZ. Diese Daten sind nur lesbar und lassen sich nicht bearbeiten.
2. Kontrollieren Sie übernommene Kunden auf fehlende Daten. Übernommen wird, was sich aus dem Altsystem abrufen lässt. Einzelne Daten können daher fehlen.
3. Legen Sie für übernommene Kunden der Märkte CH und CZ keine Verträge an. Für diese Kunden lassen sich keine Verträge anlegen.
4. Kontrollieren Sie, ob Legacy-Verträge aufgrund der Frist fehlen. Verträge nach Ablauf der Frist werden nicht in das UDM importiert.
5. Stimmen Sie die Schadenfallvolumen je Markt vor der Migration ab.

**Ergebnis und Systemstatus.**

- Legacy-Verträge, deren tatsächliches Vertragsende, im System Real End Date genannt, die marktspezifische Frist überschreitet, werden nicht in das UDM importiert.
- Schadenfälle werden in der Legacy-PostgreSQL-Datenbank als dreistufiges Aggregat gespeichert: Schadenfall, Schaden und Position. Die Positionen umfassen Arbeits-, Teile- und Fremdleistungspositionen.
- Jeder Schadenfall ist mit seinem Legacy-Vertrag verknüpft. Vertragsdeckungen werden importiert, aus ihnen wird die Deckungsbezeichnung für den Umsatz abgeleitet.
- Spalten aus dem Datenprodukt stehen ohne Präfix. Spalten, die nur in der Refined-Schicht vorkommen, tragen das Präfix refined_.
- Die Schadenfälle sind über die veröffentlichte Lese-API abrufbar: GET /v1/legacy-claims und GET /v1/legacy-claims/by-number.

**Besonderheiten je Rolle, Sparte und Markt.**

- CH und CZ: Kunden sind nur lesbar, für sie lassen sich keine Verträge anlegen.
- AT, CH, CZ, FR und GB: Legacy-Schadenfälle werden importiert. Für Deutschland gibt es keine Legacy-Schadenfälle, weil die Kostendaten dort aus oneSCM stammen.
- GB: Der größte Markt umfasst rund 3,1 Mio. Schadenfälle und 19,7 Mio. Positionen. Die Verarbeitung erfolgt in Abschnitten, damit der Import im Speicherbudget bleibt.
- Sparte: Die Frist unterscheidet nach Markt und Sparte. Für Spanien beträgt sie bei Pkw und Vans 20 Jahre.

**Hinweise.**

- Die Frist für Deutschland beträgt mehr als 10 Jahre nach Vertragsende. Die Frist wird bis zum Jahresende des Vertragsendes gerechnet. Endet ein Vertrag am 2. Juli 2016, wird er zum 1. Januar 2027 für die DSGVO-Bereinigung relevant.
- Die Fristen je Markt und Sparte stehen in einer Enum-Tabelle. Der Wert gilt einheitlich für alle Legacy-Systeme. oneSCM besitzt ein eigenes Regelwerk.
- Ist ein Markt in der Enum-Tabelle nicht gepflegt, importiert das System alle Verträge dieses Marktes.
- Die Regelung gilt für alle Datenprodukte außer ISP.
- Der Schadenfall-Import läuft pro Markt über den Batch-Job ImportLegacyClaimData und monatlich nach dem Job des Kosten-Datenprodukts. Jeder Lauf gleicht den Datenbestand eines Marktes mit einer Momentaufnahme ab. Dabei bildet das System einen Hash der Nutzdaten und fügt Datensätze ein, aktualisiert, reaktiviert sie oder deaktiviert sie weich. Die weiche Deaktivierung ist durch die Deaktivierungssperre abgesichert.
- Die vorgelagerte Ablage im Legacy Data Service liefert eine abstimmbare, kontrollierte Kopie vor dem Umsatzimport. Dieselbe Vorgehensweise hat die Migrationen von Verträgen und Kunden abgesichert.

**Fehlerbehebung.** Der Schadenfall-Import ist wiederanlauffähig. Das gilt auch für den größten Markt.

Quellen: Batch 552.1, 295.1, 307.1

## 18.5 Fehlerfälle, Korrekturwege und Nachweise

**Zweck.** Dieser Abschnitt beschreibt, wie das Revenue-Datenprodukt Verwaltungsgebühr und Zahlungsaufschlag bereitstellt und wie der ETL-Prozess für Revenue mit Fehlern umgeht.

**Voraussetzungen.** Verwaltungsgebühr und Zahlungsaufschlag basieren auf den Gesamtbeträgen, die in der Zahlungsdetailtabelle des jeweiligen Vertrags hinterlegt sind.

**Rollen.** Material: keine Quellen in den RAG-Batches.

**Schritt für Schritt.**

1. Parse-Glue-Jobs bereinigen die Revenue-Berichte und wenden die erforderlichen Validierungen an. Die Parse-Jobs der Verträge werden wiederverwendet, um Daten in den Trusted-Bucket zu kopieren. Die Jobs starten automatisch, sobald Berichtsdateien im Raw-Bucket liegen.
2. Die bereinigten Daten liegen im Trusted-Bucket im Ordner revenue.
3. Sobald alle erforderlichen Revenue-Dateien im Trusted-Bucket liegen, startet der Transform-Glue-Job automatisch.
4. Vor dem Schreiben neuer Daten sichert das System das vereinheitlichte Datenmodell.
5. Der Transform-Job schreibt die Daten gemäß der Spezifikation des vereinheitlichten Datenmodells in den Refined-Bucket. Berücksichtigt werden die Altsysteme ICON, Asset Global und Sirius.

**Ergebnis und Systemstatus.**

- Die Tabelle base_sc_revenue_contract enthält keine Spalte für den monatlichen Verwaltungsgebührenbetrag.
- Die Spalte admin_fee_amt enthält für oneSCM-Verträge den zuletzt verfügbaren Wert aus oneSCM unter Fees and Factors, Administration Fee, Total Price. Für Legacy-Verträge entspricht die Spalte der bisherigen Bereitstellung.
- Die Spalte payment_markup_amt hat denselben Datentyp und dasselbe Format wie admin_fee_amt. Sie ist in refined_contract und in base_sc_revenue_contract enthalten. Für oneSCM-Verträge enthält sie den zuletzt verfügbaren Wert aus Fees and Factors, Payment Markup, Total Price.

**Besonderheiten je Rolle, Sparte und Markt.**

- oneSCM-Verträge: admin_fee_amt und payment_markup_amt sind befüllt.
- Legacy-Verträge: Für payment_markup_amt gibt es keine Befüllung.
- Sparte: Material: keine Quellen in den RAG-Batches.

**Hinweise.** Der Transform-Job berücksichtigt Daten aus den drei Altsystemen ICON, Asset Global und Sirius.

**Fehlerbehebung.**

- Jeder Jobfehler löst eine Benachrichtigung aus.
- Im Fehlerfall stellt das System das vereinheitlichte Datenmodell aus der Sicherung wieder her.
- Der Transform-Job erhält die Anzahl der Datensätze. Es gibt keinen Verlust bei der Anzahl der Datensätze.

Quellen: Batch 301.2, 344.3

## 18.6 Cutover und Parallelbetrieb

**Zweck.** Während der Migration verarbeitet das System die Legacy-Daten und die oneSCM-Daten der Märkte CZ und CH parallel.

**Voraussetzungen.** Für die Legacy-Märkte führt das UDM einen Full Load aus, der alte Dateien erneut lädt. Der Parallelbetrieb stellt sicher, dass oneSCM-Daten dabei nicht überschrieben werden.

**Rollen.** Material: keine Quellen in den RAG-Batches.

**Schritt für Schritt.**

1. Die Datenbereitstellung für CZ und CH berücksichtigt bis zum Ende der Migration alle Verträge aus beiden Quellen.
2. Migrierte Legacy-Daten fließen in den oneSCM-Bezugsprozess ein und werden im oneSCM-Sourcing-Prozess erfasst.
3. Der Full Load für die Legacy-Märkte erhält die oneSCM-Daten.
4. Nach dem Ende der Migration werden die Legacy-Parse- und Transform-Jobs für CZ und CH abgeschaltet. Der Legacy-Pfad entfällt vollständig.

**Ergebnis und Systemstatus.** Die Datenprodukte enthalten in keinem Prozessstatus Dubletten. Die Daten der Datenprodukte entsprechen dem Stand in oneSCM.

**Besonderheiten je Rolle, Sparte und Markt.**

- Tschechien und Schweiz: Der Parallelbetrieb gilt für beide Märkte. Bis zum Ende der Migration werden alle Verträge aus beiden Quellen berücksichtigt.
- Malaysia und Korea: Der Parallelbetrieb betrifft diese Märkte nicht.
- Sparte: Material: keine Quellen in den RAG-Batches.

**Hinweise.** Die Abschaltung des Legacy-Pfads setzt das Ende der Migration voraus. Weitere Aufgaben für den Rückbau des Legacy-Pfads stehen im Klärungsbedarf.

**Fehlerbehebung.** Material: keine Quellen in den RAG-Batches.

Quellen: Batch 299.1, 300.1

## Verschiebung in andere Kapitel

| Inhalt | Zielkapitel | Batch |
|---|---|---|
| Reporting-Pipeline für Malaysia und Korea: Data Capture Service, Reporting Service, Glue-Transformationsjobs je Markt, Datenkatalog, Batch-Job-Einträge Delta, Full und Bulkload in der oneSCM-Admin-Konsole, Benachrichtigung bei fehlenden Marktdaten | 19.19 Datenplattformen und Reporting; 17.1 Zielmärkte und Einführungsumfang | 299.1, 300.1 |
| Datenformat der Datenprodukte: Iceberg-Datenprodukte und Parquet-Datenprodukte, Abhängigkeit vom Start des Iceberg-Sharings | 19.19 Datenplattformen und Reporting | 299.1, 300.1 |
| Migration der Selenium-Smoke-Tests nach Playwright, Testautomatisierung | 16.4 Testnachweise und produktiver Funktionsstand | 1286.1 |
| Feldlängen Outlet-Name, Händlername und Händleradresse von 100 auf 250 Zeichen, Flyway-Datenbankmigration | 15 HQ-Rolle, Blueprint und zentrale Stammdaten; Zuordnung zu bestätigen | 1101.5 |
| Lese-API für Legacy-Schadenfälle und Anbindung des Revenue-Managements | 19.9 VEGA: Vertrag, Coverage und Claim; 19.20 Legacy-Systeme und Übergangsarchitektur | 295.1 |

## Klärungsbedarf

- Rollout und Termin: Batch 299.1 und 300.1 nennen Februar 2026 als Rollout-Termin nach dem Planungsstand. Dieser Termin liegt vor dem Stand dieses Kapitels. Batch 300.1 bezeichnet den Rollout für CZ und CH als Go-Live. Status und Termin sind zu bestätigen.
- Datenformat: Batch 299.1 und 300.1 nennen den Wegfall der Parquet-Datenprodukte. Der Umfang der Iceberg-Datenprodukte hängt laut beiden Batches vom Start des Iceberg-Sharings ab. Der Text nennt die Iceberg-Datenprodukte. Der Zeitplan ist zu bestätigen.
- Ladeverfahren im UDM: Batch 299.1 und 300.1 beschreiben, dass der Full Load für die Legacy-Märkte angepasst werden muss. Als Alternative nennen beide Batches zwei getrennte Datenbereiche im UDM, Batch 300.1 spricht von Datenpools. Der Text in 18.6 beschreibt das Sollverhalten. Entscheidung und Umsetzung sind zu bestätigen.
- Rückbau des Legacy-Pfads: Batch 299.1 und 300.1 nennen weitere Aufgaben, die für den Rückbau nötig sind. Diese Aufgaben sind nicht beschrieben.
- Doppelte Fassung: Batch 299.1 und 300.1 beschreiben denselben Umfang mit abweichenden Formulierungen, etwa zur Parallelverarbeitung. Der Text folgt beiden Batches. Die Dublette ist zu prüfen.
- Schadenfall-Import: Batch 295.1 gibt den Status des Vorhabens als offen an. Die Beschreibung in 18.4 folgt dem Sollverhalten. Umsetzungsstand und Freigabe sind zu bestätigen.
- Zielsystem der Vereinheitlichung: Batch 346.2 nennt pricefx als Zielsystem der Vereinheitlichung. Die beschriebenen Pipelines führen die Daten in ein einheitliches Modell in AWS. Die Rolle von pricefx ist zu bestätigen. Die ETL-Pipelines sind im Material als Entwurf beschrieben. Der Umsetzungsstand ist zu bestätigen.
- Verkäufer-User-ID: Batch 307.3 nennt den Release PI15 als erwarteten Zeitpunkt. Der Text enthält keine Release-Angabe, der Termin ist zu bestätigen. Laut Batch 307.3 wurde die Entfernung des Feldes salesman_number_id zurückgenommen. Diese Meldung ist geschlossen und gehört in den Anhang F. Der Text beschreibt das Feld als Verkäufer-User-ID.
- Vertriebskanal: Batch 326.2 nennt als Ziel, dass die Daten für Legacy- und oneSCM-Verträge vorliegen. Für SIRIUS gibt es kein Quellfeld, das Feld bleibt dort leer. Der Text beschreibt die leere Befüllung für SIRIUS. Der Abgleich mit dem Anspruch an Vollständigkeit ist zu klären.
- Fristen für Altverträge: Batch 307.1 nennt die Fristen für Deutschland und Spanien. Fristen für weitere Märkte und Sparten stehen nicht im Material. Die Regel, dass ein nicht gepflegter Markt alle Verträge importiert, ist auf Vollständigkeit zu prüfen.
- Entwicklungsstand SC Cost: Batch 884.6 nennt die ISP-Anbindung, die Festlegung der Pflichtfelder und die Frage einer Migration für bereits eingeführte Märkte wie SK als offene Punkte. Die Inhalte können sich ändern. Der Text in 18.2 enthält diese Punkte nicht.
- Zuordnung der Feldlängen: Batch 1101.5 beschreibt eine Datenbankänderung ohne Fachbezug. Die Zuordnung zu Kapitel 15 ist zu bestätigen.

## Vorschläge zur Gliederung

- 18.2 Quellsysteme und Datenobjekte: Eine Übersicht der Quellsysteme iCON, ASSET, SIRIUS, Legacy-System und Athena mit ihren Datenobjekten fehlt im Material. Der Schadenfall-Import ist ein Datenobjekt, das in 18.2 passt.
- 18.4 in drei Unterkapitel teilen: 18.4.1 Übernommene Kunden, 18.4.2 Legacy-Verträge und Frist, 18.4.3 Schadenfälle aus dem Legacy Data Service. Das Material trennt diese Themen bereits.
- 18.6 Cutover: Ein Ablauf für die Umstellung, etwa Vorbereitung, Umschaltung und Abnahme, fehlt im Material. Der vorhandene Text beschreibt nur den Parallelbetrieb.
- 18.3 und 18.4: Die automatische Zuordnung ordnet die Batches 326.2 und 307.3 dem Abschnitt 18.4 zu. Dieser Entwurf führt sie unter 18.3, weil es um Feldbelegung geht.
- 18.1 und 18.6: Die automatische Zuordnung der Batches 299.1 und 300.1 zu 18.1 wird nach Inhalt auf 18.1 für den Umfang und auf 18.6 für den Parallelbetrieb verteilt.
- 18.5 Nachweise: Die Abstimmung der Schadenfallvolumen je Markt und die Prüfung der Revenue-Daten sind als Nachweise im Abschnitt 18.5 gut aufgehoben. Das Material ordnet die Abstimmung 18.4 zu.
