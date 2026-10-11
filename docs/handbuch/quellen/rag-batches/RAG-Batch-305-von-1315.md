# Batch 305 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 26 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting: Änderungen und Korrekturen in diesem Release**

Im Bereich Reporting wurden mit diesem Release mehrere funktionale Erweiterungen und eine Reihe von Fehlerbehebungen umgesetzt, die vor allem die Datenaufbereitung (ETL), die Universal Data Model-Tabellen (UDM) und die Data Products betreffen.

**Erweiterungen bei Preisinformationen und Angeboten**

Das Data Product „SC_Price_Details“ liegt im partitionierten Iceberg-Format vor und enthält Details zu Preisinformationen. Es besteht aus den beiden Tabellen „SC_Price_Details_Components“ und „SC_Price_Details_Per_KM“. Die Tabelle „SC_Price_Details_Components“ wurde um drei Felder am Ende der bestehenden Spalten erweitert: sc_product_line_cd, product_name_txt und sc_type_vega_cd. Die Tabelle „SC_Price_Details_Per_KM“ bleibt unverändert. Die Erweiterung gilt ausschließlich für ONESCM-Verträge (PKW und Vans) und nicht für Legacy-Verträge. Die Daten stehen nur aus ONESCM zur Verfügung.

Zusätzlich werden nun auch Angebotsdaten (Proposals) über die Kafka-Nachrichten des Vertragsservice verarbeitet, und zwar für alle Ereignisse wie Anlegen, Ändern und Löschen. Relevante Angebotsstatus sind „Waiting for Confirmation“, „Confirmed“, „Waiting for Activation“ und „Rejected“. Dadurch sind Preisinformationen auch für Angebote in UDM und im Data Product verfügbar. Beim Laden (Delta bzw. Full Load) gilt: Für alle Tabellen außer den Preiskomponenten-Tabellen werden Daten in den genannten Status herausgefiltert. Für die Preiskomponenten-Tabellen werden die Daten unabhängig vom Status geladen. Wichtig für den Betrieb: Das Vertragsereignis des Vertragsservice darf erst bereitgestellt werden, nachdem die Änderungen auf der Reporting-Seite zusammengeführt und ausgerollt wurden.

**Anpassungen beim ASSET-Import und bei Nemesis-Daten**

Für die inkrementelle Ladelogik im Iceberg-Umfeld müssen Datensätze in allen Tabellen eindeutig identifizierbar sein. Da ASSET bislang weder Schadensfolgenummer noch Schadenspositionsnummer lieferte, wurde bisher mit einer fest hinterlegten Lösung gearbeitet: Der Schadenscode diente als Folgenummer, und die Schadensposition wurde im ETL-Prozess erzeugt. Der ASSET-Import wurde nun so angepasst, dass die Daten so übernommen werden, wie sie aus ASSET kommen, ähnlich wie bei iCON, statt im ETL abgeleitete Werte zu verwenden.

Die Ableitung des Feldes aq_veh_model_series_cd aus den Nemesis-Daten wurde geändert. Bisher wurde der Wert aus der FIN abgeleitet, wenn er nicht aus Nemesis verfügbar war. Da im Nemesis-Feld „BAUREIHE“ nun Werte geliefert werden, die nicht zum erwarteten aq_veh_model_series_cd passen, wird der Wert jetzt in allen Fällen aus der FIN abgeleitet und der Inhalt von „BAUREIHE“ ignoriert. Die Änderung erfolgt sowohl im DCS als auch im Glue-Prozess, damit beide Prozesse synchron bleiben.

**Fehlerbehebungen in ETL, Backend und UDM**

Behoben wurden unter anderem folgende Probleme: ein leeres Feld „Expiry Criteria“, ein fehlgeschlagenes Vertragsprocessing für den Markt SK in Batch 403, die Fehlermeldungen UNRESOLVED_COLUMN.WITH_SUGGESTION und NUM_COLUMNS_MISMATCH (UNION nur bei gleicher Spaltenzahl möglich), unzureichende Glue-Parameter aus function_trans_trusted_reports für bestimmte Glue-Jobs sowie ein Spaltenkonflikt bei Preiskomponenten in UDM. Ebenso wurde das Problem behoben, dass die Marktdateien für CH und CZ nicht über die CFT-Lambda geladen wurden. Weitere geschlossene Punkte betreffen fehlende Nemesis-Datensätze in SC_Financials, fehlgeschlagene Jobs (job_dp_sc_financials, job_dp_base_xxx und ReportingIspDeltaData), unvollständige Coverage-Daten in der Kafka-Nachricht, nicht in UDM ankommende Rabattwerte aus DCS und ein Problem bei der Verarbeitung von Preiskomponenten-Daten für den Markt RS. Zudem wurde ein Fehler beim Nemesis-Initial-Load mit einer unbegründeten Fehlermeldung zu fehlenden Dateien bearbeitet.

**Betrieb und Infrastruktur**

Die Version der Flyaway-Skripte wurde aktualisiert. Für die Glue-Ops-Rolle wurde eine Berechtigung auf Datenbankebene ergänzt. Beim Glue-Job des Reporting-Data-Products für Financials wurde der Timeout in der Glue-YAML-Datei für alle Umgebungen auf 720 Minuten erhöht. Außerdem wurden die AWS-Inspector-Findings vom 27.05.2026 bearbeitet.

**Nicht umgesetzte Vorhaben**

Einige Vorhaben wurden abgebrochen und sind deshalb nicht Teil dieses Release. Dazu gehören der Test mit aktualisierten ASSET-Dateien, die Anpassung der DCS-Logik für Nemesis-Revenue-Dateien (Datensätze mit unvollständigen Werten, etwa im Status „NOT YET ACTIVATED“, sollten das Laden nicht mehr abbrechen), die Behebung der blockierten Datenladung über ADP-Sharing sowie das Anhalten des regulären Schedulers für das Financials Data Product.