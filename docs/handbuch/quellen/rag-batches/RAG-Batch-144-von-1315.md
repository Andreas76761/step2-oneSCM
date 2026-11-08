# Batch 144 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Hinweise zu Rechnungen bei Vertragsende, Nemesis und E169-Export**

**Stornierungsregeln bei Widerruf und vorzeitiger Beendigung**

Für das Verhalten von Rechnungen bei Vertragsende wurden Regeln definiert, die je nach Rechnungstyp, Rechnungsstatus und Zeitpunkt der Beendigung unterschiedlich ausfallen. Dieses Vorhaben hat den Status „Cancelled". Die Regeln sind daher als Zielbild zu verstehen und nicht als umgesetzte Funktion. Genutzt werden sollten sie von MO und MPC.

Wird ein Vertrag innerhalb der Widerrufsfrist beendet, werden bei Rechnungen des Typs MPPI zwei Fälle unterschieden. Wurde noch keine Rechnung akzeptiert oder exportiert, befinden sich alle Rechnungen im Status „Planned" und werden storniert. Gibt es bereits Rechnungen in den Status „Accepted", „Exported", „FI_Doc_Created" oder „Paid", werden geplante und akzeptierte Rechnungen storniert. Für exportierte Rechnungen wird automatisch eine Gutschrift erstellt, die manuell freigegeben wird. Für Rechnungen im Status „FI_Doc_Created" oder „Paid" wird die Gutschrift automatisch erstellt und automatisch freigegeben. Bei den Typen DD, CAMP, SDAS, SCDAS und SCOM befinden sich alle Rechnungen im Status „Planned" und werden storniert. Bei Rechnungen des Typs MANU entscheidet das MO, ob sie storniert, erstellt oder abgelehnt werden.

Bei einer vorzeitigen Beendigung vor der Widerrufsfrist werden MPPI-Rechnungen im Status „Planned" und „Accepted" storniert. Bei exportierten Rechnungen, Rechnungen mit FI-Beleg und bezahlten Rechnungen prüft das MO, ob eine Gutschrift erstellt wird. Rechnungen der Typen DD, CAMP, SDAS, SCDAS und SCOM werden unabhängig vom Status storniert.

Bei einer vorzeitigen Beendigung nach der Widerrufsfrist kommt es bei MPPI darauf an, ob rückdatiert wird. Geplante Rechnungen werden in beiden Fällen storniert. Akzeptierte Rechnungen bleiben ohne Rückdatierung unverändert und werden exportiert, da sie fällig sind. Mit Rückdatierung werden sie storniert. Exportierte Rechnungen werden ohne Rückdatierung unverändert in oneERP weiterverarbeitet. Für exportierte Rechnungen, Rechnungen mit FI-Beleg und bezahlte Rechnungen gilt bei Rückdatierung: Bis PI16 prüft das MO-Team manuell, ab PI16 wird die neue Funktion zur Erstellung von Rückdatierungs-Gutschriften verwendet. Ohne Rückdatierung bleiben Rechnungen mit FI-Beleg und bezahlte Rechnungen unverändert.

Bei MANU-Rechnungen entscheidet nach der Widerrufsfrist in allen Status (Created, Accepted, Exported, FI_Doc_Created, Paid) das MO-Team manuell. Angelegte und akzeptierte Rechnungen kann das MO ablehnen. Bei SCOM und DD bleiben akzeptierte und exportierte Rechnungen unverändert und werden exportiert. Bei CAMP, SDAS und SCDAS gilt dies zusätzlich für Rechnungen im Status „FI Doc" und „Paid". Bei WSIN, IWSIN und RI wird eine Rechnung zugelassen, wenn das Reparaturdatum vor dem Datum der vorzeitigen Beendigung liegt, andernfalls wird sie abgelehnt. CLAI ist in Vega eingeschränkt, CCIN wird durch CLAI gesteuert. Bei SPMP werden geplante Rechnungen storniert. Akzeptierte und exportierte Rechnungen bleiben ohne Rückdatierung unverändert und werden in oneERP verarbeitet. Mit Rückdatierung prüft das MO-Team bis PI16 manuell, ob der Lieferant belastet wird. FDCR wird am Vertragsende durchgeführt, BDCR bleibt unverändert.

Bei Beendigungen aus bestimmten Gründen (Laufleistung, Kontingent oder Zeit) werden keine Rechnungen storniert. Die Abrechnung erfolgt bis zum Vertragsende.

**Nemesis**

Bei vollständig subventionierten Verträgen, bei denen der Kunde nichts zahlen muss, entsprechen Zahlungsbeginn und Zahlungsende nun dem Vertragsbeginn und dem Vertragsende. Diese Anpassung ist abgeschlossen. Für die Nemesis-Tabelle ist geplant, die Spalte „Modification date" hinter die Spalte „Occurrence" zu verschieben und eine neue Spalte „Resend date" einzufügen, die Datum und Uhrzeit des letzten erneuten Sendens eines Ereignisses speichert. Dieser Punkt liegt im PI-Backlog. Ein Darstellungsproblem bei der Checkbox-Ausrichtung in der Nemesis-Fehlertabelle wurde behoben.

**Werkstattrechnungen**

Ein Fehler, bei dem bei der Anlage einer Werkstattrechnung nach der Suche einzelne Händler mehrfach angezeigt wurden, ist behoben.

**E169-Export und oneERP**

Mehrere Probleme rund um die E169-Datei wurden bearbeitet und geschlossen. Dazu gehören ein zusätzlicher Zeilenumbruch nach HTXT06 sowie ein fehlender Wert statt der Werkstattrechnungsnummer im Satztyp PTXT01 bei der Datei für Altteilsteuer, ein Abgleichfehler bei der Betriebsnummer für Compact Plus (PC) und ein Fehler, bei dem nach dem Auslösen von MBLD_ONEERPinvE169EXP keine Exportdateien für MBLD erzeugt wurden. Die Prüfung, ob die Vertragsnummer im E169-Header enthalten ist, ist in einem Ticket abgeschlossen und in einem weiteren noch offen. Offen ist auch die Prüfung der Zuordnung der Vertragsnummer im oneERP-Rechnungskopf. Ebenfalls offen sind Anpassungen des Exporttyps für MBLD, VAN und PC. Ein Ticket zur Header-Länge der E169-Datei (112 statt 62 Zeichen) wurde abgebrochen.