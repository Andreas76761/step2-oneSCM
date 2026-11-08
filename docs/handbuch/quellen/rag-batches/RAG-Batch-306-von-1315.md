# Batch 306 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 26 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting – Änderungen und Verbesserungen**

Im Bereich Reporting wurden in diesem Release mehrere Fehler behoben und Verbesserungen umgesetzt, die vor allem die Datenqualität und die Stabilität der Datenverarbeitung betreffen.

Im Zuge der Preisprüfung wurden Fehler in den ETL-Jobs sowie in den Jobs des Reporting Service festgestellt und korrigiert. Zudem wurde ein Fehler in der Funktion FUNCTION_DP_FROM_UDM behoben, die wegen eines ungültigen UpdateExpression fehlschlug. Auch die Benachrichtigungs-Lambda funktioniert wieder: Sie konnte zuvor wegen ungültiger SSM-Parameter keine E-Mails zu Fehlerdateien versenden.

Mehrere inhaltliche Korrekturen verbessern die Qualität der Reporting-Daten. oneSCM-Verträge mit leerem Feld partner_type_txt und fehlerhafter Anonymisierung wurden korrigiert. Im Base Contract Data Product wurden Vertragsduplikate für die Quelle oneSCM beseitigt. Außerdem wurde ein falscher Wert im Feld new_used_cd korrigiert. Der Vertragsnettopreis (contract_net_price_amt) entsprach nicht immer dem in oneSCM hinterlegten Wert, und auch der Wert net_amount_per_interval im Revenue Data Product wich von der Darstellung in oneSCM ab. Beides wurde angepasst. Darüber hinaus wurde der Verarbeitungsprozess der Nemesis-Revenue-Datei korrigiert, der sich nicht wie erwartet verhalten hatte.

Zur Vereinheitlichung wurden die neu hinzugefügten Felder currency_txt in den Data-Product-Tabellen in curr_cd umbenannt. Damit entsprechen sie den älteren, bereits vom Reporting genutzten Spalten, sodass für dieselbe Währungsinformation nicht mehr zwei verschiedene Spaltennamen existieren. Betroffen sind die Tabellen base_sc_cost_damage, base_sc_cost_damage_position und base_sc_revenue_invoice.

Im Bereich Infrastruktur und Sicherheit wurden die Ergebnisse des AWS Inspector vom 13.05.2026 bearbeitet. Außerdem erhielten die FullAdmin-Rollen die fehlende DROP-Berechtigung auf Tabellenebene in AWS Lake Formation. Dadurch können einzelne Tabellen aus Glue-Datenbanken nun gelöscht werden, was zuvor trotz vorhandener Berechtigungen auf Datenbankebene nicht möglich war.

Schließlich wurden die Artefakte des Reportings in der Dokumentation aktualisiert. Dies betrifft das Mapping-Sheet für das UDM, die Data-Product-Definitionen sowie die Playbooks und die Architekturdarstellung. Zusätzlich entstand eine Dokumentation, die einen allgemeinen Überblick über die Datenverarbeitung in der ETL-Pipeline und in den Microservices gibt.