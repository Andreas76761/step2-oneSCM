# Material zu 22 Ohne Unterkapitel-Zuordnung

Kapitel 22 Ausblick und Weiterentwicklung. 43 Abschnitte aus den RAG-Batches, automatisch zugeordnet, redaktionell zu prüfen.

## [Batch 341.3] Nicht umgesetzte Vorhaben

Folgende Vorhaben wurden abgebrochen und sind daher nicht Teil des Funktionsumfangs.

Geplant war ein eigenes Datenprodukt für den Markt Deutschland und die Division Cars. Es sollte ausschließlich Daten dieses Marktes und dieser Division enthalten und aus den bestehenden, marktübergreifenden Datenprodukten „Base Service Contract“ und „Base SC Revenue“ abgeleitet werden, da DDX keinen zeilen- und spaltenbasierten Datenzugriff unterstützt. Vorgesehen war außerdem eine Variante nur für „Base SC“. Beide Vorhaben wurden abgebrochen, die entsprechenden Datenprodukte stehen daher nicht zur Verfügung.

Ebenfalls abgebrochen wurde ein Sammelvorhaben, das die aus PI3 übrig gebliebenen Aufgaben für eine Priorisierung und Umsetzung in PI4 bündeln sollte.

## [Batch 524.4] Hinweis zu nicht umgesetzten Vorhaben

Das Vorhaben, UI-Tests gegen die lokale Entwicklungs-UI auszuführen, wurde abgebrochen. Ebenso wurde die Korrektur der Suche nach erstellten und aktiven Leasing- und Retail-Verträgen im Edge Service, die nicht alle Werte lieferte, nicht umgesetzt. Die Übernahme der Reporting-Services befindet sich noch im Entwicklungs-Backlog; Details dazu liegen noch nicht vor.

## [Batch 1148.3] Nicht umgesetzte Vorhaben

Zwei ursprünglich geplante Vorhaben wurden abgebrochen und sind daher nicht Bestandteil dieses Releases. Das erste ist eine Prolongation-API für Leasing, die für die Verlängerung von Verträgen im Bereich MBLD vorgesehen war. Das zweite sind Tests und Anpassungen der Online-Sale-API, über die der Online-Verkauf Produkte aus der Produktdomäne für den Online-Shop abrufen sollte.

## [Batch 507.3] Nicht umgesetzte Vorhaben

Die geplanten Arbeiten für eine statische Vorlage als Fußzeile sowie für eine Master-Kopfzeile nach MB-Richtlinien wurden abgebrochen und nicht umgesetzt.

## [Batch 966.2] Nicht umgesetzte Vorhaben: Signatureinstellung pro Markt und Produkt

Geplant war, in der Marktkonfiguration je Markt und je Produkt festzulegen, ob der Signaturschritt im Ablauf der Vertragserstellung (Contract Generation) angewendet wird. Hintergrund ist, dass einige Märkte bestimmte Produkte ohne Kundenunterschrift verkaufen. Bislang erfordern alle Produkte und Verträge eine Kundensignatur. Künftig sollte ein Produkt den Ablauf ohne Signaturschritt durchlaufen können, unabhängig von der Art der Signatur, um die Schritte im Ablauf zu reduzieren. Nutzen sollten dies dieselben Anwender wie bisher, nämlich die Marktbenutzer (MPC). Dieses Vorhaben wurde abgebrochen und steht daher nicht zur Verfügung.

## [Batch 305.6] Nicht umgesetzte Vorhaben

Einige Vorhaben wurden abgebrochen und sind deshalb nicht Teil dieses Release. Dazu gehören der Test mit aktualisierten ASSET-Dateien, die Anpassung der DCS-Logik für Nemesis-Revenue-Dateien (Datensätze mit unvollständigen Werten, etwa im Status „NOT YET ACTIVATED“, sollten das Laden nicht mehr abbrechen), die Behebung der blockierten Datenladung über ADP-Sharing sowie das Anhalten des regulären Schedulers für das Financials Data Product.

## [Batch 324.2] Nicht umgesetzte Vorhaben

Folgende Vorhaben wurden abgebrochen und sind daher nicht Bestandteil des Release: ein Batch, der alle Vertragsdaten-Ereignisse gebündelt versendet, die Umstellung der Feldwerte von „VAN_Car“ auf „VAN“, zusätzliche Base Data Products für MBD Van sowie die Erweiterung der Datenqualitätsregeln im Unified Data Model.

## [Batch 264.6] Nicht umgesetzte Vorhaben

Die Änderung des Routings im Batch-Job-Service, bei der andere Microservices über das Gateway aufgerufen werden sollten (inklusive Übernahme des Kong-Autorisierungs-Headers), wurde abgebrochen. Ebenfalls abgebrochen wurde das Vorhaben zum Thema „Contract is suspended“, zu dem keine inhaltlichen Angaben vorliegen.

## [Batch 433.5] Nicht umgesetzte Vorhaben

Zwei Punkte wurden abgebrochen und sind daher nicht Bestandteil dieser Version. Geplant war eine Master-Vorlage für eine Änderungsanfrage-E-Mail an den Endkunden, die über die Aktionen im Kundenmanagement ausgelöst werden sollte. Ebenso entfällt die Behebung des Problems, dass beim Anklicken des AGB-Links in der Vertragserstellung eine hochgeladene Vorlage mit der Meldung „Dokument nicht gefunden" quittiert wurde.

## [Batch 724.3] Nicht umgesetzte Vorhaben

Zwei weitere Vorhaben wurden abgebrochen und sind daher nicht Teil der Funktionalität: die Verwaltung von Managed Contracts samt Kostenabwicklung sowie die Anzeige importierter Lieferantenrechnungen im Vertrag.

## [Batch 815.2] Nicht umgesetzte Vorhaben

Einige geplante Themen wurden nicht weiterverfolgt und sind abgebrochen worden. Dazu gehören ein Test zur Übertragung von Einmalzahlungsverträgen, die vorgesehene CAS-Prüfung des neuen Eigentümers bei Einmalzahlungsverträgen sowie die Übertragung von Verträgen zwischen Geschäftskunden (B2B-Transfer). Ebenfalls abgebrochen wurde die Behebung eines internen Serverfehlers, der beim Aufrufen des Reiters „History“ auftrat.

## [Batch 1092.5] Nicht umgesetzte Vorhaben

Folgende Anpassungen wurden geprüft, aber abgebrochen und sind daher nicht Bestandteil des aktuellen Funktionsumfangs: die automatische Aktivierung eines Vertrags, sobald alle MO-Prüfungen in Ordnung sind (die Aktivierung erfolgt weiterhin manuell), die neue Behandlung optionaler Deckungen in der Vertragserstellung (sie werden weiterhin angezeigt und sind auswählbar, auch wenn sie keinen Preis haben) sowie die Korrektur eines Problems bei der Identifikator-Validierung in der Massenanlage, bei dem nach der Anpassung eines nicht passenden Kilometerstands keine erneute Validierung möglich war.

## [Batch 1098.5] Noch nicht umgesetzt (On Hold)

Für über Edge erstellte Online-Sales-Verträge ist vorgesehen, dass bei der Kundensuche ein exakter Treffer anhand folgender Merkmale zurückgegeben wird: Vorname, Nachname, Mobilnummer, E-Mail-Adresse, IBAN, Personal ID (bei privaten Kunden in Märkten, in denen dieses Feld verpflichtend ist) sowie USt-IdNr. bzw. Steuernummer (bei gewerblichen Kunden). Dafür soll die API für die exakte Suche mit Vorname, Nachname, E-Mail-Adresse und Telefonnummer verwendet werden. Wird zusätzlich die IBAN für den exakten Treffer benötigt, ist eine weitere API erforderlich. Diese Anforderung ist derzeit pausiert.

## [Batch 391.6] Noch offen bzw. nicht umgesetzt

Eine allgemeine Verbesserung der E-Mails befindet sich im Backlog. Sie soll Benutzern helfen, E-Mails korrekt anzuzeigen, etwa über einen Hinweis zur Anzeige im Browser. Mehrere weitere Vorhaben wurden nicht umgesetzt, darunter die Anpassung der Kopf- und Fußzeilen-Auswahl in der Vorlagenverwaltung, die Änderung der Systemvorlagen zu Vor- und Nachnamen der Market-Operations-Benutzer, die Aufnahme des SEPA-Mandats in den Servicevertrag sowie weitere Anpassungen zur Darstellung von Dokumenten in Safari auf macOS und zur Kopf- und Fußzeile des SEPA-Mandats in der PDF-Vorschau.

## [Batch 25.2] Hinweis zu nicht umgesetzten Inhalten

Das Anlegen einer neuen Fahrzeuggruppe direkt von der Navigationsebene „Baumuster suchen" aus (Schaltfläche „Create Vehicle Group") wurde nicht umgesetzt, da das zugehörige Vorhaben abgebrochen wurde. Die Untersuchung der CePro-Stammdaten-API zur Anreicherung von Baumusterdaten ist abgeschlossen. Daraus ergibt sich im Benutzerhandbuch jedoch keine eigenständige Funktion, die hier beschrieben werden könnte.

## [Batch 170.3] Nicht umgesetzt

Die geplante Unterstützung einer Rechnungsstellung nach Geschäftsjahr für VAN-Kunden wurde nicht umgesetzt und ist daher nicht Bestandteil des Funktionsumfangs.

## [Batch 196.3] Nicht weiterverfolgte Vorhaben

Vier Vorhaben wurden abgebrochen und sind daher in oneSCM nicht verfügbar: die Behandlung von Deferred Logic in SWT, die Zahlungsart Banküberweisung für Behördenkunden mit Versand der Rechnungen an oneERP, die Aktualisierung der Hauptnavigation für Revenue & Cost Management sowie ein weiteres, nicht näher beschriebenes Vorhaben im Bereich Revenue Management. Für diese Punkte lagen keine inhaltlichen Beschreibungen vor.

## [Batch 529.2] Lokalisierung nach Regionen (nicht umgesetzt)

Ein weiteres Vorhaben sollte neben der Sprache auch regionale Varianten (Locales) unterstützen, sodass sich etwa Englisch für en-US und en-GB unterscheiden lässt. Vorgesehen waren eine automatische oder manuelle Auswahl der Locale, die dauerhaft gespeichert wird, sowie ein Rückgriff auf die Basissprache, wenn eine Variante fehlt. Dieses Vorhaben wurde abgebrochen und steht daher nicht zur Verfügung. Derzeit gibt es weiterhin nur Sprachdateien.

## [Batch 1253.8] Noch nicht umgesetzt bzw. verworfen

Die Vorlagen zum Herunter- und Hochladen sollen ein einheitliches Erscheinungsbild erhalten: Hintergrund im Mercedes-Benz-Blau (#0078D6, wb-blue-45) und weiße Schrift. Dies soll in allen Domänen gelten, in denen es solche Vorlagen gibt, unter anderem bei der Massenerstellung und der Händlerverwaltung. Die Umsetzung befindet sich noch im Backlog. Die geplante Änderung, bei Kampagnen im Status „Finished“, die sich noch in der Nachfrist (Grace Period) befinden, die automatische Anwendung nicht zu berücksichtigen, wurde abgebrochen. Als Begründung war genannt, dass Kampagnen in der Nachfrist die Freigabe des Marktes benötigen und nicht automatisch angewendet werden können.

## [Batch 191.6] Nicht umgesetzte Punkte

Zwei geplante Anpassungen wurden nicht weiterverfolgt (Status „Cancelled"). Dies betrifft zum einen die Berücksichtigung des Steuerbetrags aus der oneERP-Rückmeldedatei beim Import. Zum anderen betrifft es die Anzeige von Materialnummern, deren Gültigkeitsbeginn in der Zukunft liegt. Beim Import der Rückmeldedatei bleibt der Steuerbetrag der Rechnung daher weiterhin unberücksichtigt.

## [Batch 365.5] Nicht weiterverfolgte Vorhaben

Zwei Vorhaben wurden abgebrochen: die Ergänzung des Angebotsdokuments um die Angabe der Branche (Industry) im Bereich der Fahrzeuginformationen sowie die Anpassung der E-Mail-Vorlage zur Erinnerung vor Vertragsende mit einem Hinweis auf die Möglichkeit der Vertragsverlängerung.

## [Batch 532.4] Hinweis zu nicht umgesetzten Punkten

Nicht umgesetzt wurden die einheitliche Benennung ähnlicher Felder in den Edge-Service-APIs (Ticket geschlossen), die Konsolidierung von Assertions in der automatisierten Qualitätssicherung (abgebrochen) sowie ein Ticket zu einem Branch, der nicht angelegt werden konnte (geschlossen). Für diese Punkte liegen keine Änderungen vor, die im Handbuch zu beschreiben wären.

## [Batch 538.1] DevOps – Neuerungen und Verbesserungen

Im Bereich DevOps wurden mehrere Vorhaben abgeschlossen, die den Betrieb und die Absicherung der Plattform betreffen. Die Informationen dazu beschränken sich auf die Themen selbst; detaillierte Beschreibungen, Zielzustände oder Abnahmekriterien liegen für die meisten Vorhaben nicht vor.

Abgeschlossen wurde die Integration zwischen GitHub und Terraform. Ebenfalls fertiggestellt sind Anpassungen an der Beobachtbarkeit (Observability) in AWS sowie die Migration auf Graviton. Darüber hinaus wurde die Optimierung von Richtlinien mithilfe des IAM Access Analyzer umgesetzt. Eine Änderung im Zusammenhang mit Artifactory auf Seiten von DevOps wurde ebenfalls abgeschlossen.

Zur Stabilität und Sicherheit des Systems wurden außerdem zwei Fehlerbehebungen vorgenommen: Ein Verbindungs-Timeout (CONNECTION_TIME_OUT) beim File Scanner wurde behoben, und ein Problem bei der AWS-Anmeldung auf den Runnern wurde korrigiert. Zudem wurden Sicherheitsbefunde bearbeitet und behoben. Der laufende Support und das Monitoring wurden im Rahmen eines eigenen Vorhabens abgeschlossen, ebenso die Aktualisierung und Validierung der Dokumentation.

Nicht umgesetzt wurden zwei Vorhaben, die abgebrochen wurden: die Anpassung einer WAF-Regel, mit der eine IP-Adresse von blockierten Ereignissen ausgenommen werden sollte, sowie Verbesserungen am Application Performance Monitoring. Letztere sollten die Überwachung um die Darstellung von Nutzungsverläufen (User Journey) und Heatmaps erweitern, einschließlich Seiten, Fehlern und durchgängiger Ende-zu-Ende-Verfolgung (E2E-Tracing). Diese Funktionen stehen daher nicht zur Verfügung.

## [Batch 380.2] Ziel des Vorhabens

Vorgesehen war, dass in der Vorlagenverwaltung (Template Management) Dokumenten- und E-Mail-Vorlagen auch für den Kundentyp „Commercial Fleet" angelegt und gepflegt werden können. Hintergrund war, dass für alle Kundentypen Vorlagen für Dokumente und E-Mails vorhanden sein sollen. Nutzen sollten diese Möglichkeit Anwender in der Rolle MPC sowie Administratoren. Die Auswahl des neuen Kundentyps hätte sich auf die Vertragserstellung und den Ablauf der Vertragsverwaltung ausgewirkt.

## [Batch 439.4] Ausblick

Für die Zukunft sind erweiterte Funktionen vorgesehen, darunter die Zuweisung von Vorgängen und der Abschluss des Bearbeitungskreislaufs.

## [Batch 601.2] Begrenzung der Zeichenanzahl bei Kundennamen (nicht umgesetzt)

Vorgesehen war, in oneSCM eine Datenvalidierung einzuführen, die der im FI-System vorhandenen entspricht. Damit sollten die Daten in den Systemen konsistent bleiben. Die Eingabe der Attribute Vorname, Nachname, Firmenname und Zusatzname sollte jeweils auf 35 Zeichen begrenzt werden. Hintergrund war die Vorgabe des SWT-Systems, in dem der Kundenname auf die Felder NAME1 und NAME2 mit jeweils 35 Zeichen aufgeteilt wird. Ist ein Name länger als 35 Zeichen, wird er an Position 35 getrennt, und der Rest steht im Feld NAME2. Insgesamt sind so maximal 70 Zeichen möglich.

Für Privatkunden sollten die Felder Vorname und Nachname auf 35 Zeichen begrenzt werden. Für Geschäftskunden, einschließlich Fuhrparkkunden, galt dies für die Felder Firmenname und Zusatzname. Wird die maximale Zeichenanzahl erreicht, sollte unter dem Textfeld die Meldung „Number of allowed characters should be 35“ erscheinen, und der Wert sollte nicht in der Datenbank gespeichert werden. Die Prüfung war vorgesehen für das Pop-up-Fenster „Customer Details“ sowie die Seite „Customer Information & Payment“ bei der Vertragserstellung, jeweils bei Neuanlage und Bearbeitung des Kunden. Außerdem sollte sie in der Kundenverwaltung auf der Vorschau- und der Bearbeitungsseite für private und gewerbliche Kunden gelten. Da das Ticket abgebrochen wurde, ist diese Validierung nicht verfügbar.

## [Batch 1001.2] Marktspezifische Wartezeiten und Fristen (nicht umgesetzt)

Für Contract Generation war vorgesehen, dass HQ-Administratoren im Bereich „Admin / Market Settings“ über einen zusätzlichen Reiter „Contract“ marktspezifische Fristen festlegen können. Vorgesehen waren die Angebotsgültigkeit in Tagen und die Frist für die Stornierung nach der Aktivierung in Tagen, jeweils als numerisches Eingabefeld mit Tausendertrennzeichen. Für Deutschland waren 100 Tage Angebotsgültigkeit (Übergang von „Created“ zu „Rejected“) und 14 Tage Stornierungsfrist nach Aktivierung genannt. Diese Funktion wurde abgebrochen und steht daher nicht zur Verfügung.

## [Batch 1244.4] Im Entwicklungs-Backlog

In der Produktverwaltung fehlt derzeit ein Tooltip für künftige Entwurfspreisversionen. Dieser soll ergänzt werden.

## [Batch 337.1] (ohne Überschrift)

Im Bereich Reporting wurden mehrere Verbesserungen an der Datenverarbeitung und an der Bedienung umgesetzt.

Ein zentrales Thema war die Vorbereitung eines Delta-Lake-Ansatzes. Bisher wird bei jeder neuen Eingangsdatei das komplette Unified Data Model ersetzt und anschließend die gesamte Information in den Datenprodukten bereitgestellt. Ziel des Delta-Lake-Setups ist es, dass beim Eintreffen einer neuen Datei nur die Daten in den Delta Lake übernommen werden, die sich gegenüber dem bestehenden Datenbestand im Unified Data Model geändert haben. Die Datenprodukte können weiterhin als vollständige Dateien bereitgestellt werden, enthalten dann aber zusätzliche Delta-Informationen. Dadurch lassen sich bestehende Datenprodukte sowohl als Vollladung als auch als Delta nutzen. Die Delta-Daten werden versioniert und für jeden Zeitpunkt, zu dem Änderungen eintreffen (zum Beispiel täglich), vorgehalten. Konsumenten können so wählen, welche Version des Deltas sie beziehen möchten. Als Abnahmekriterien galten, dass kein Datenverlust auftritt und die Bereitstellung der Daten schneller erfolgt als im bisherigen Verfahren.

Darüber hinaus wurden Fehler in der Dateiverarbeitung behoben. Der CFT-Job führt nun auch dann genau einmal aus, wenn dieselbe Datei erneut eintrifft. Zudem wurde das Problem behoben, dass Quelldateien nach erfolgreicher Parse- und Transformationsausführung nicht korrekt gelöscht wurden. Außerdem wurden die Duplikate in den Vertragsdaten für alle Märkte entfernt.

In der Oberfläche wurden die Filter in Schritt 2 der Fahrzeuggruppenerstellung angepasst. Bei Filtern mit mehr als zwei Optionen sind nun nach dem Schließen und erneuten Öffnen des Filters, wenn bereits einzelne Einträge ausgewählt wurden, wieder alle möglichen Optionen sichtbar und auswählbar.

Einige weitere geplante Vorhaben im Reporting wurden nicht umgesetzt und eingestellt. Dazu gehören die verarbeitungsbezogene Delta-Verarbeitung des ETL-Ladevorgangs, die Erstellung zusätzlicher Datenprodukte getrennt nach Divisionen (nur PKW, nur Vans oder beides), Datenqualitätsregeln für das Unified Data Model sowie die Historisierung des Vertragsstatus. Diese Funktionen stehen daher nicht zur Verfügung.

## [Batch 846.1] (ohne Überschrift)

Im Bereich Contract Management wurden mehrere Anpassungen vorgenommen, die die Detailansicht eines Vertrags und die Vertragstabellen betreffen.

In der Detailansicht eines Vertrags ist im Reiter „Vehicle" das Feld „License Plate" (Kennzeichen) nun als editierbares Feld Bestandteil des Fahrzeugbereichs. Wer als Market Operations einen Vertrag auf der Startseite des Contract Managements auswählt und in den Reiter „Vehicle" wechselt, sieht dort das Kennzeichen angezeigt. Wird das Kennzeichen geändert, soll ein Scheduler das Kennzeichen im Vertrag samt Begründung aktualisieren, und die Information im permanenten Header wird ebenfalls angepasst. Die Gestaltung orientiert sich an der Mercedes-Benz Workbench und an dem vom Kunden freigegebenen UI-Design.

Bei den Vertragstabellen wurde die Sortierung nach dem Erstellungsdatum („Created On") berücksichtigt. Weitere Details dazu liegen nicht vor.

Außerdem wurde im Bereich „History" eines ausgewählten Vertrags die Bezeichnung des zweiten dort angezeigten Abschnitts geändert. Dieser hieß zuvor „History of Change" und trägt nun den Namen „Contract Status History".

Eine ursprünglich geplante Zusammenführung der beiden History-Tabellen (Vega History und Contract Status History) zu einer einzigen Tabelle mit dem Namen „Contract History" wurde nicht umgesetzt, das entsprechende Vorhaben wurde abgebrochen. Die beschriebenen Funktionen, etwa die Filterung nach Objekten oder die Auswahl der Anzahl angezeigter Einträge, stehen daher nicht zur Verfügung.

## [Batch 994.3] Weitere Hinweise

Die Darstellung der Oberflächen entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design. Zusätzlich wurden Verbesserungen im Zusammenhang mit dem Go-Live von Contract Generation umgesetzt. Details dazu sind in den vorliegenden Informationen nicht beschrieben.

Die geplante Anzeige von Deckungen (enthalten/optional) in der Vertragsübersicht wurde nicht umgesetzt, da das zugehörige Vorhaben abgebrochen wurde. Die Deckungen werden daher weiterhin nicht in der Vertragsübersicht angezeigt.

## [Batch 678.1] (ohne Überschrift)

**Hinweis:** Beide zugrunde liegenden Vorhaben haben den Status „Cancelled" (abgebrochen). Die hier beschriebenen Funktionen wurden somit nicht umgesetzt und sind in dieser Form nicht Teil des Releases. Falls der Text dennoch in das Benutzerhandbuch aufgenommen werden soll, empfiehlt sich eine Prüfung durch das Team.

## [Batch 1309.3] Technische Verbesserungen im Hintergrund

Im Backend wurde ein Problem mit dem Optimistic Lock im Config Service behoben, und die Performance des SyncEsCostJob wurde verbessert. Für die kundenseitige Oberfläche wurde die CI/CD-Pipeline vorbereitet, und die Anbindung wurde auf CodeArtifacts migriert. Im Bereich der automatisierten Qualitätssicherung wurden Tests für den Vertragsablauf vorbereitet und umgesetzt sowie eine Strategie bzw. Architektur zur Erstellung von Testdaten umgesetzt. Außerdem wurden die End-to-End-Tests korrigiert.

Die geplante Anzeige der Release-Version in der Benutzeroberfläche wurde nicht umgesetzt. Die Bereinigung der automatisierten Tests befindet sich derzeit in der Analyse.

## [Batch 531.1] Sicherheit und Schwachstellenmanagement

Für den Edge Service wurde das Ziel verfolgt, die in Black Duck gemeldeten Schwachstellen im Bereich Edge Contract zu beheben. Dieses Vorhaben ist abgeschlossen. Ergänzend dazu wurde im DevOps-Bereich eine Prüfung der Schwachstellen aus ECR- und Sechub-Scans für PI13 umgesetzt. Ziel war ein Confluence-Dashboard, das einen klaren Überblick über die vorhandenen Schwachstellen bietet. Außerdem sollten die Aktualisierung, die Ausführung und der Vergleich der kritischen und hochgradigen Schwachstellen aus beiden Scans automatisiert werden. Auch dieses Vorhaben ist fertiggestellt.

## [Batch 531.3] Repositories und Pipelines

Unter dem Titel „Repository & Pipeline Improvements“ wurden Sicherheit, Dokumentation und Automatisierung der Repositories verbessert. Dazu gehörten die Korrektur der Maskierung von CodeArtifact-Token, die Aktualisierung der GitHub-Übersichtsseiten und die automatische Erzeugung der Dokumentation für Terraform-Module. Auch dieses Vorhaben ist fertig. Abgeschlossen ist außerdem das Vorhaben zu GitHub Runners und AWS-Integration. Konkrete Angaben zum Zielverhalten liegen dafür nicht vor.

## [Batch 590.4] Getrennte Kunden- und Zahlungsinformationen (abgebrochen)

Das Vorhaben, Kunden- und Zahlungsinformationen für alle Kunden zu trennen, wurde abgebrochen und wird nicht umgesetzt.

## [Batch 781.4] Hinweis zum Umfang

Die Anpassung der Langzeitverlängerung für Reifen und komplexe Produkte wurde nicht umgesetzt; dieses Vorhaben wurde abgebrochen. Zu seinem Inhalt liegen keine weiteren Angaben vor.

## [Batch 987.1] (ohne Überschrift)

Hinweis vorab: Beide Funktionen, die in den Rohdaten beschrieben sind, tragen den Status „Cancelled“. Sie wurden also nicht umgesetzt bzw. nicht freigegeben. Der folgende Text beschreibt sie deshalb als geplantes Verhalten. Vor einer Aufnahme ins Benutzerhandbuch sollte geklärt werden, ob er überhaupt veröffentlicht werden soll.

## [Batch 145.3] Pricing Engine (P.EN) (offen)

Für die Pricing Engine (P.EN) ist ein Vorhaben angelegt, das sich derzeit noch im Status „Offen“ befindet. Nähere Angaben zu Umfang, Zielgruppe und Funktionsweise liegen noch nicht vor.

## [Batch 264.2] Chargenjobs: Fehler- und Warnprotokolle (offen)

Geplant ist, dass Administratoren die Fehler- und Warnmeldungen eines Chargenjob-Laufs einsehen können. Treten bei einem Lauf Fehler oder Warnungen auf, sollen diese zur späteren Prüfung gespeichert werden. Über die Chargenjob-Seite und die Option „See Logs“ gelangt man zu den Protokollen eines bestimmten Laufs. Es öffnet sich eine neue Seite mit einem Suchbereich und einem Ergebnisbereich.

Im Suchbereich kann nach Zeitstempel, Kritikalität und Nachricht gesucht werden. Die Kritikalität (Error/Warning) wird über ein Dropdown mit Mehrfachauswahl gewählt und zeigt nur die Werte, die in der Datenbank vorhanden sind. Bei der Nachricht wird gesucht, ob sie einen bestimmten Text enthält. Die Ergebnisse zeigen Zeitstempel, Kritikalität und Nachricht. Administratoren sollen alle von einem Lauf erzeugten Protokolle einsehen und nach Zeitstempel, Kritikalität oder Nachricht suchen können.

## [Batch 531.4] Betrieb und Überwachung

Das Vorhaben „Support & Monitoring PI13“ ist abgeschlossen. Zum angestrebten Verhalten enthalten die vorliegenden Informationen keine näheren Angaben.

## [Batch 935.1] (ohne Überschrift)

Hinweis: Das zugrunde liegende Vorhaben hat den Status „Cancelled“. Die beschriebenen Funktionen sind daher nicht als freigegebener Leistungsumfang zu verstehen.

## [Batch 990.2] Hinweis zum Upload unterschriebener Serviceverträge

Die geplante Anpassung der Abläufe zum Hochladen unterschriebener Serviceverträge wurde abgebrochen und ist daher nicht Teil dieser Funktionalität.

