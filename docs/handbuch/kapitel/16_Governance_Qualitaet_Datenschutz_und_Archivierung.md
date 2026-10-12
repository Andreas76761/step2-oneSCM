# 16 Governance, Qualität, Datenschutz und Archivierung

Dieses Kapitel beschreibt, wie Sie Datenschutzerklärungen als Vorlagen in oneSCM pflegen, welche Datenschutzregeln das System heute umsetzt, wie Testnachweise für Datenbestände geprüft werden, wie sich Dokumentenverwaltung und Archivierung unterscheiden und welche Regeln für die Versionierung des Ereignisvertrags gelten. Die Unterkapitel 16.2, 16.7 und 16.8 haben keine Quellen in den RAG-Batches. Unterkapitel 16.3 enthält nur einen Abschnitt, der nicht zum Freigabeworkflow gehört. Inhalte, die in andere Kapitel gehören, sind am Kapitelende unter „Verschiebung in andere Kapitel“ aufgeführt.

## 16.1 Datenschutz und sichere Beispieldaten

**Zweck.** Dieses Unterkapitel beschreibt die Pflege der Datenschutzerklärung als Vorlage, ihre Verwendung in oneSCM und die Datenschutzregeln, die das System heute umsetzt. Zu sicheren Beispieldaten enthält das zugeordnete Material keine Angaben. Die Beispiele in diesem Handbuch verwenden Testwerte und Platzhalter.

**Voraussetzungen.** Sie melden sich mit Zugangsdaten an, die den Bereich „Documents & Communications“ freigeben.

**Rollen.** Das Material nennt die Rollen Admin und MPC für den Bereich „Documents“. Welche Rollen Datenschutzerklärungen anlegen dürfen, beschreibt das Material nicht.

**Schritt für Schritt.**

1. Öffnen Sie den Reiter „Documents“ und wählen Sie „Create Templates“ und anschließend „Privacy Policy“.
2. Erfassen Sie im Bereich Template Setup den Vorlagennamen, zum Beispiel „Privacy Policy“. Das Feld nimmt maximal 56 Zeichen auf.
3. Wählen Sie den Markt im Dropdown. Das System belegt Deutschland vor. Die Auswahl richtet sich nach Ihrer Benutzerrolle.
4. Wählen Sie im Feld „Valid From“ ein Datum im Format TT.MM.JJJJ. Zulässig sind das heutige Datum und Daten nach dem heutigen Datum. Ab diesem Datum verwendet das System die Vorlage für Angebote und Vertragsaktivierungen. Beispiel: 01.01.2027.
5. Erfassen Sie im Feld „Version of the Market“ eine Versionsbezeichnung mit maximal 25 Zeichen. Die Felder „Service Product“ und „Used For“ sind für die Vorlage nicht erforderlich.
6. Wählen Sie im Bereich Template Details optional die Division und die Sprache. Leere Felder machen die Vorlage allgemein gültig.
7. Wählen Sie im Bereich Template Design im Dropdown „Editor“ oder „Upload“.
8. Im Editor geben Sie den Text ein oder fügen ihn ein und wählen eine Kopf- und eine Fußzeile aus. Diese müssen in der Template-Verwaltung nach den Mercedes-Benz-Richtlinien angelegt sein. Die Kopfzeile steht oben, die Fußzeile unten auf der Seite. Beim Upload laden Sie ein statisches PDF von Ihrem Rechner hoch. Kopf- und Fußzeile entfallen dann. Nach dem Hochladen sehen Sie die Datei und können sie wieder löschen.
9. Wählen Sie „Preview“, um die Vorschau in einem separaten Tab zu öffnen.
10. Wählen Sie „Save as Draft“, um die Vorlage als Entwurf zu speichern. Dafür muss der Vorlagenname gefüllt sein. Der Entwurf bleibt 30 Tage bearbeitbar und wird danach gelöscht. Ein Entwurf ist sowohl mit einem hochgeladenen PDF als auch mit dem Editor möglich.
11. Wählen Sie „Publish“, um die Vorlage zu erstellen. Veröffentlichen ist sowohl mit einem hochgeladenen PDF als auch mit Kopf- und Fußzeile im Editor möglich.

**Ergebnis und Systemstatus.** Die veröffentlichte Vorlage erscheint im Dropdown für anzuhängende Dokumente, sobald das Gültigkeitsdatum erreicht ist. Ist zusätzlich ein Servicevertragsprodukt wie „Excellent“ hinterlegt, verwendet das System die produktbezogene Vorlage vorrangig. Andernfalls gilt die Vorlage ohne Produktangabe.

Die Fußzeile jeder Seite von oneSCM enthält die Optionen „Provider“ und „Data Protection“. Ein Klick öffnet ein Fenster mit dem Text in der Sprache des Benutzers. Sie können das Fenster lesen, scrollen und wieder schließen.

**Besonderheiten je Rolle, Sparte und Markt.**

- Rolle: Die Rollen Admin und MPC arbeiten im Bereich „Documents“ mit Vorlagen. Die Rolle entscheidet über das Dropdown für den Markt.
- Sparte: Das Dropdown „Division“ bietet heute PC an. Die Abkürzung steht für Personal Car. Van ist im heutigen Funktionsumfang nicht wählbar.
- Markt: Vorbelegt ist Deutschland. Die Sprache richtet sich nach der Marktrolle. Im heutigen Funktionsumfang steht Englisch zur Verfügung.

**Hinweise.**

- Datenschutzerklärungen sind statisch. Sie benötigen keine Druckvariablen.
- Der DSGVO-Schalter ist aus den Kunden- und Zahlungsinformationen der Vertragserstellung und des Kundenmanagements entfernt. Das gilt für private und gewerbliche Kunden. Die Einwilligung ergibt sich aus der Absicht, einen Servicevertrag abzuschließen. Der Kunde steht dem Händler direkt gegenüber.
- Das System übermittelt Vertrags- und Kundendaten bei der Aktivierung eines Vertrags an den Data Capture Service per Kafka-Nachricht. Den Statuswechsel auf „storniert“ übermittelt es ebenfalls. Löscht das System einen stornierten Vertrag aufgrund der DSGVO, löscht die Reporting-Seite diesen Vertrag ebenfalls. Damit stimmt das Reporting mit den Daten in oneSCM überein.
- Ereignisse gehen ausschließlich an die Konsumentenidentität, die der API-Kündigung zugeordnet ist und für Markt und Division des Vertrags freigegeben ist. Die Zustellung eines Finanzdokuments an eine falsche Organisation gilt als Datenschutzvorfall und nicht als bloßer Funktionsfehler.

**Fehlerbehebung.**

- Brechen Sie die Erstellung ab, nachdem Sie Daten eingegeben haben, erscheint eine Bestätigungsabfrage. Wählen Sie dort „Cancel“, bleibt die Seite mit Ihren Eingaben geöffnet. Wählen Sie „Proceed“, werden die Daten nicht gespeichert, und Sie kehren zur vorherigen Seite zurück.
- Ungültige Eingaben und das Überschreiten der maximalen Zeichenanzahl im Namensfeld prüft das System. Es zeigt dazu eine Fehlermeldung an.
- Solange kein Dokumenttyp angegeben ist, bleibt „Publish“ deaktiviert. Sie können die Vorlage in diesem Fall als Entwurf speichern.

Quellen: Batch 426.1, 416.2, 417.2, 418.2, 984.1, 519.9, 321.3, 651.2

## 16.2 Datenqualität und Datenführerschaft

Material: keine Quellen in den RAG-Batches

Quellen: keine

## 16.3 Fachliche Prüfung und Freigabeworkflow

Material: keine Quellen in den RAG-Batches zur fachlichen Prüfung und zum Freigabeworkflow in oneSCM. Der einzige zugeordnete Abschnitt beschreibt ein Werkzeug für die Qualitätssicherung von Testfällen. Dieses Werkzeug gehört nicht zur Bedienung in oneSCM und nicht in das Benutzerhandbuch. Der Inhalt steht in „Verschiebung in andere Kapitel“ und in „Klärungsbedarf“.

Quellen: Batch 1294.1

## 16.4 Testnachweise und produktiver Funktionsstand

**Zweck.** Die Abnahme prüft den Datenbestand je Markt für das Kosten-Datenprodukt sowie für die Tabellen mit Schadenfällen, Schäden, Positionen und Vertragsdeckungen. Sie zeigt, ob die Daten in der Integrationsumgebung mit Athena übereinstimmen.

**Voraussetzungen.** Für den marktweisen Abgleich benötigen Sie Zugriff auf PostgreSQL und auf Athena.

**Rollen.** Das Material nennt keinen verantwortlichen Tester.

**Schritt für Schritt.**

1. Führen Sie den Job des Kosten-Datenprodukts je Markt aus. Der Job endet erfolgreich.
2. Vergleichen Sie die Anzahl der Delta-Positionen mit der Basistabelle. Die Anzahlen stimmen je Markt überein. In der Produktion gilt das für alle Kosten-Delta-Tabellen, einschließlich AT.
3. Vergleichen Sie in der Integrationsumgebung je Markt die aktiven Anzahlen und Betragssummen von Schadenfällen, Schäden und Positionen mit Athena. Die Werte stimmen überein.
4. Prüfen Sie, dass jeder Schadenfall einen Refined-Treffer hat. Keine Vertragsverknüpfung bleibt ungeklärt. Übersprungene Datensätze sind erklärt.
5. Führen Sie einen Wiederholungslauf ohne Änderungen aus. Der Lauf schreibt keine Daten.
6. Prüfen Sie, dass der Markt GB innerhalb des Speicherbudgets von 4 GB läuft.
7. Prüfen Sie die Lese-API mit den End-to-End-Tests lokal und in der Integrationsumgebung.

**Ergebnis und Systemstatus.** Die Abnahmekriterien beschreiben den Sollzustand des Datenbestands. Das Material belegt nicht, dass der Datenbestand in der Produktion heute alle Kriterien erfüllt.

**Besonderheiten je Rolle, Sparte und Markt.** Für die Produktion gilt die Prüfung für alle Kosten-Delta-Tabellen, und der Markt AT muss enthalten sein. Für den Markt GB gilt das Speicherbudget von 4 GB.

**Hinweise.** Getestet wird mit Unit-, Integrations- und lokalen End-to-End-Tests, mit Cucumber-E2E-Tests und mit einer marktweisen Abstimmung zwischen PostgreSQL und Athena. Bestehende Importe verhalten sich unverändert. Jede Story aktualisiert die betroffene Dokumentation.

Quellen: Batch 295.5

## 16.5 Dokumentenverwaltung und Archivierung unterscheiden

**Zweck.** Dokumentenverwaltung und Archivierung sind getrennte Bereiche mit unterschiedlichen Inhalten und Formaten. Die folgende Tabelle ordnet sie zu.

| Bereich | Inhalt | Format und Abruf |
|---|---|---|
| Dokumentenverwaltung | Vorlagen und Dokumente im Bereich „Documents“, zum Beispiel Datenschutzerklärungen | Versionierte Dokumente aus S3 oder DSS, abrufbar über Dokumentname und Version |
| Archivierung | Dateien des Reporting-Contract-Batch | CSV-Dateien für Delta-Daten und für Volldaten |

**Ergebnis und Systemstatus.** Dokumente im Bereich „Documents“ lassen sich versioniert lesen. Ein generischer Endpunkt liefert den Inhalt anhand von Dokumentname und Version. Der Reporting-Contract-Batch erzeugt CSV-Dateien für Delta-Daten und für Volldaten. Parquet-Dateien erzeugt er nicht.

**Hinweise.** Das Material enthält keine Aufbewahrungsfristen und keine Angaben zum Speicherort der Archivdateien.

Quellen: Batch 426.1, 1284.4

## 16.6 Quellen und Versionsführung

**Zweck.** Dieses Unterkapitel beschreibt die Versionierung des Ereignisvertrags. Der Pfad enthält die Hauptversion v1, das Nachrichtenschema trägt die Version 1.0. Zu Quellenangaben und Vorgangsreferenzen enthält das zugeordnete Material keine Angaben.

**Schritt für Schritt.** Ordnen Sie jede Änderung einem der folgenden Typen zu.

1. Optionale Felder hinzufügen: Die Änderung ist abwärtskompatibel.
2. Felder entfernen oder umbenennen, Typen ändern oder die Bedeutung bestehender Aufzählungswerte ändern: Die Änderung erfordert /api/v2.
3. Neue Aufzählungswerte hinzufügen: Die Änderung erfordert einen ausdrücklichen Kompatibilitätstest mit dem Konsumenten.

**Ergebnis und Systemstatus.** Version 1 umfasst keine Gutschriften, Stornierungen, Zahlungs- und Mahnaktualisierungen und keine Übermittlung von PDF-Dokumenten. Für diese Inhalte sind eigene Ereignisverträge erforderlich.

Quellen: Batch 519.11

## 16.7 Widersprüche, Lücken und Klärungsregister

Material: keine Quellen in den RAG-Batches

Quellen: keine

## 16.8 Dealer-Governance und Reportingnachweise

Material: keine Quellen in den RAG-Batches

Quellen: keine

## Verschiebung in andere Kapitel

| Inhalt | Zielkapitel | Batch |
|---|---|---|
| Vorlagenverwaltung im Bereich Documents: Zugriff der Rollen Admin und MPC auf Vorlagen für Allgemeine Geschäftsbedingungen vom Typ Upload, Versionierung und Lesen von Dokumenten aus S3 oder DSS | 14.4 Vorlagenverwaltung und Template Management | 426.1 |
| Fußzeile mit den Optionen „Provider“ und „Data Protection“, Modal mit der Sprache des Benutzers | 3.3 Oberflächenelemente und Bedienmuster | 984.1 |
| Kundeninformationen im Vertragsgenerierungs-Assistenten: Marketing Preferences mit den Schiebereglern E-Mail, Telefon und InCar/MMe, Feld „Preferences“ im MVP vorbelegt, leer und schreibgeschützt, Einstellung durch Benutzeraktion | 6.2 Vertragsdaten und Pflichtfelder erfassen | 1035.1, 651.2 |
| Entfernter DSGVO-Schalter in den Kunden- und Zahlungsinformationen für private und gewerbliche Kunden | 4.3 Kundendaten und Pflichtangaben prüfen | 651.2 |
| Abruf eines Dokumentinhalts über Dokumentname und Version mit dem generischen Endpunkt | 19.21 Technische Integrationswege | 426.1 |
| Übermittlung von Vertrags- und Kundendaten an den Data Capture Service, Statuswechsel auf „storniert“, Löschung stornierter Verträge im Reporting | 19.19 Datenplattformen und Reporting | 321.3 |
| Ereigniszustellung ausschließlich an die Konsumentenidentität für Markt und Division des Vertrags | 19.22 Schnittstellenbetrieb und Fehlerbehandlung | 519.9 |
| Kosten-Datenprodukt je Markt, Tabellen für Schadenfälle, Schäden, Positionen und Vertragsdeckungen, Import der Iceberg-Delta-Tabellen, Speicherbudget von 4 GB für GB | 19.19 Datenplattformen und Reporting, 19.9 VEGA Vertrag, Coverage und Claim | 295.5 |
| Werkzeug zur Erzeugung von Xray-Testfällen und zur Auswirkungsanalyse, Test Mapping Index im JSON-Format, Erzeugung des Index im CI-Build | 19.23 Architekturregister und Nachweise, keine Bedienfunktion | 1294.1 |

## Klärungsbedarf

- DSGVO-Schalter: Batch 651.2 beschreibt die Entfernung in der Vertragserstellung und im Kundenmanagement. Batch 1035.1 beschreibt im Bereich Kundeninformationen des Vertragsgenerierungs-Assistenten einen Schieberegler als Platzhalter und verlangt eine Klärung mit oneDOC und dem Pilotmarkt MBD. Der Text folgt 651.2, weil dort Entscheidung und Begründung genannt sind. Zu bestätigen.
- Pflichtstatus im Template Setup: Batch 426.1 nennt alle Felder des Template Setup als Pflichtfelder und zugleich die Felder „Service Product“ und „Used For“ als nicht erforderlich. Der Text folgt dem zweiten Satz.
- Dokumenttyp: Batch 417.2 deaktiviert „Publish“ ohne Dokumenttyp. Batch 426.1 nennt kein Feld Dokumenttyp, sondern das Feld „Used For“. Die Feldzuordnung ist zu prüfen.
- Bezeichnung des Namensfelds: Batch 416.2 nennt das Feld „T&C Name“, Batch 426.1 den Vorlagennamen. Der Text verwendet Vorlagenname.
- Beispiel für das Gültigkeitsdatum: Batch 426.1 nennt 14.08.2023 als Beispiel. Das Datum liegt vor dem heutigen Datum und widerspricht der Regel, nur das heutige Datum und Daten nach dem heutigen Datum zuzulassen. Das Handbuch verwendet das Datum 01.01.2027.
- Self-Service-Vorschau: Batch 426.1 formuliert den Link zur Vorschau in der kundenseitigen Self-Service-Oberfläche als Soll-Aussage. Der Text übernimmt sie nicht.
- Abkürzung DSS: Batch 426.1 nennt DSS als Quelle für Dokumente, ohne die Abkürzung zu erläutern.
- Berechtigte Rollen: Batch 426.1 nennt Zugangsdaten für die Datenschutzerklärung, aber keine Rollen, die sie anlegen dürfen.
- Fußzeilentexte: Batch 984.1 beschreibt Anzeige und Sprache der Optionen „Provider“ und „Data Protection“, nicht die Pflege und Freigabe der Texte.
- Archivierung: Batch 1284.4 beschreibt das Format der Archivdateien. Speicherort, Aufbewahrungsfrist und Übergabe der CSV-Dateien fehlen.
- Abnahmestand des Datenprodukts: Batch 295.5 beschreibt Abnahmekriterien und einen Zielzustand. Ob die Kriterien heute in der Produktion erfüllt sind, geht aus dem Material nicht hervor. Ein Testverantwortlicher ist nicht benannt. Die Entscheidung „D3 = B“ für den Import der Iceberg-Delta-Tabellen ist ohne Begründung angegeben.
- Xray-Werkzeug: Batch 1294.1 führt den Status ohne Ergebnis. Die Verantwortung liegt laut Quelle beim AQA Lead beziehungsweise QA Manager. Die Quelle nennt einen veralteten Index als Risiko.
- Eingestellte oder geschlossene Meldungen, Anhang F: Batch 1287.3 beschreibt eine Vorlage zur Konsolidierung der Sicherheits-End-to-End-Tests ohne Ziel, Umfang und Akzeptanzkriterien. Batch 109.3 beschreibt einen Probeeintrag ohne fachlichen Inhalt, der zur Löschung bestimmt ist. Batch 851.3 beschreibt eine geänderte Verarbeitung der Vertragsnummer als Pfadparameter ohne Angabe des neuen Verhaltens, Testfehler als erledigt und eine Änderung der Kundenanlage in End-to-End-Tests. Batch 1311.3 beschreibt eine Änderung an einem End-to-End-Test für die Kostenverwaltung ohne Auswirkung auf die Bedienung. Diese Meldungen sind nicht in das Handbuch übernommen und gehören in das Klärungsregister.

## Vorschläge zur Gliederung

- 16.1: Der Titel „Datenschutz und sichere Beispieldaten“ enthält keine Quelle zu sicheren Beispieldaten. Vorschlag: Titel auf die Datenschutzerklärung und die Datenschutzregeln umstellen oder das Thema streichen, bis Material vorliegt.
- 16.2: Keine Quelle vorhanden. Vorschlag: streichen oder mit 16.8 zusammenführen, sobald Material zu Datenführerschaft vorliegt.
- 16.3: Der Titel passt nicht zum Material. Vorschlag: Freigaben auf die MO Checks in Kapitel 9 und auf die Validierung und Freigabe in 12.6 verweisen. Das Qualitätswerkzeug gehört nach 19.23.
- 16.4: Der Titel „produktiver Funktionsstand“ passt nicht, das Material beschreibt Abnahmekriterien. Vorschlag: Titel „Abnahmekriterien für den Datenbestand“ oder Einordnung in 19.19.
- 16.5: Das Material zur Archivierung umfasst einen Abschnitt. Vorschlag: Archivierung mit Angaben zu Speicherort und Aufbewahrung ergänzen oder in 11.7 Reporting einordnen.
- 16.6: Der Teil zu Vorgangsreferenzen hat keine Quelle. Vorschlag: Titel auf die Versionsführung kürzen und die Versionierung in 19.21 führen.
- 16.7: Das Klärungsregister gehört nach den Stilregeln in Anhang F. Vorschlag: Unterkapitel streichen und das Register in Anhang F führen.
- 16.8: Keine Quelle vorhanden. Der Inhalt überschneidet sich mit 4.7, 4.8 und 12.5. Vorschlag: streichen oder in 12.5 einordnen.
