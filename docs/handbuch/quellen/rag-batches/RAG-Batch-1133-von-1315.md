# Batch 1133 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kampagnenerweiterung: Fahrzeugbestellzeitraum**

Kampagnen lassen sich um einen optionalen Fahrzeugbestellzeitraum (Startdatum und Enddatum) erweitern. Damit wird der Verkauf von Verträgen für bestellte Fahrzeuge in einem bestimmten Zeitraum unterstützt. Die Funktion ist vor allem für MPC gedacht. Hintergrund ist, dass die Bestellsysteme nicht immer zu 100 % verfügbar sind. Das System gleicht den hinterlegten Zeitraum mit dem Bestelldatum im externen Bestellsystem ab und stellt das Ergebnis der Generierung bereit.

Beim Anlegen einer Kampagne können Start- und Enddatum über eine Kalenderauswahl erfasst werden. Beide Felder müssen entweder leer oder gefüllt sein. Wird nur ein Datum eingetragen, erscheint beim Speichern eine Validierungsfehlermeldung. Im Schritt „Campaign Summary“ und in der Kampagnenansicht werden Start- und Enddatum des Fahrzeugbestellzeitraums angezeigt, sofern sie gesetzt wurden. In der Kampagnenübersicht erscheint ein JA/NEIN-Kennzeichen, das angibt, ob ein Fahrzeugbestellzeitraum hinterlegt ist, sowie das Datum oder ein Strich, wenn kein Datum vorhanden ist. Zusätzliche Filter für diesen Zeitraum gibt es nicht.

Ist bei einer Kampagne kein Fahrzeugbestellzeitraum gesetzt, läuft die bisherige Kampagnenprüfung unverändert ab. Ist er gesetzt, ruft das System vor dem Kampagnenabgleich das Fahrzeugbestelldatum über die Schnittstelle des externen Bestellsystems ab. Liegt dieses Datum innerhalb des Fahrzeugbestellzeitraums, werden anschließend Gültigkeit und Kulanzfrist (Grace Period) geprüft. Ist die Kampagne gültig oder noch innerhalb der Kulanzfrist, folgen die Prüfungen auf Baumuster und AutoApply. Ist sie weder gültig noch in der Kulanzfrist, wird sie übersprungen und es wird nichts an die Generierung gesendet. Dasselbe gilt, wenn nach allen Prüfungen keine passende Kampagne gefunden wurde.

Wird die ID als Baumuster (sechsstelliger Code) erkannt, entfallen die Prüfungen im Bestellsystem. Alle passenden Kampagnen werden unabhängig vom AutoApply-Kennzeichen als auswählbare Kampagnen (AutoApplied = false) an die Generierung übergeben und können manuell ausgewählt werden. Bei allen anderen IDs wird das AutoApply-Kennzeichen berücksichtigt: Bei AutoApply = true wird die Kampagne automatisch angewendet, bei false wird sie zur manuellen Auswahl angeboten. Das Bestelldatum wird für alle IDs außer bei Baumuster-Abfragen aus dem externen System abgerufen.

Wurde eine passende Kampagne mit Fahrzeugbestellzeitraum gefunden, werden Start- und Enddatum des Zeitraums im Datenpaket (Payload) an die Generierung übermittelt. Ist das externe Bestellsystem nicht erreichbar, wird eine Fehlermeldung an die Generierung gesendet und der Kampagnenabgleich für das betreffende Fahrzeug abgebrochen.

**Preistabellen: Kopieren und Einfügen sowie Tabellenbezeichnungen**

Bei der Suche nach Modellcodes (Search Model Code) wurden die Bezeichnungen der Tabelle aktualisiert.

Für die Preistabellen der TO-Preisgestaltung wurde das Kopieren und Einfügen für alle Abhängigkeitsarten geprüft: bei Beträgen pro Monat, die von Laufzeit und Laufleistung abhängen, bei Beträgen pro Jahr, die von der Laufleistung abhängen, bei Prozentwerten, die von der Laufzeit abhängen, sowie bei Gesamtbeträgen ohne Abhängigkeit.