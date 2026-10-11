# Batch 994 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation: Neuerungen im Überblick**

**Auswahl des Kundentyps und Preisanzeige im Angebotsprozess**

Beim Start eines Vertragsangebots wählen Händler zunächst den Kundentyp. Das Feld ist ein Pflichtfeld und bietet in einem Dropdown zwei Optionen an: Privat (B2C) und Gewerblich (B2B). Erst nach der Auswahl des Kundentyps wird das Eingabefeld für die Fahrzeugkennung freigeschaltet. Solange kein Kundentyp gewählt ist, bleibt das Feld deaktiviert. Sobald die Kennung eingegeben und erkannt wurde, werden die passenden Produkte und Preise ermittelt und angezeigt.

Bei Privatkunden werden Bruttopreise mit dem Hinweis „incl. VAT“ angezeigt. Das gilt für den Standardpreis und, sofern vorhanden, den Kampagnenpreis. Bei einer aktiven Kampagne wird der Standardpreis durchgestrichen dargestellt. Beim Überfahren des Preises mit der Maus erscheinen der Standardpreis und der Kampagnenpreis ohne Mehrwertsteuer sowie der Mehrwertsteuerbetrag mit dem Zusatz „VAT“, jeweils für Monats- und Jahrespreise. Die übrigen Ansichten für Privatkunden bleiben unverändert.

Bei Geschäftskunden werden Nettopreise mit dem Hinweis „excl. VAT“ angezeigt. Beim Überfahren des Preises erscheinen der Standardpreis (bei aktiver Kampagne durchgestrichen) und der Kampagnenpreis jeweils inklusive Mehrwertsteuer sowie der Mehrwertsteuerbetrag mit dem Zusatz „VAT“, ebenfalls für Monats- und Jahrespreise. Betroffen sind unter anderem die Produktpreise („ab“-Preise), die Produktkonfiguration (monatlich und gesamt), das nicht bindende Angebot beim Drucken oder Versand per E-Mail, die Hover-Anzeigen für Preise und Rabatte, Rabattpreise und -werte, Anfragen für Kampagnen mit Karenzzeit sowie Übersicht und Bestätigung. Der Zahlungsplan bleibt vorerst unverändert.

**Gesperrte Fahrzeuge (HQ-Sperre)**

Händler, Mitarbeitende der Marktorganisation (MO) und MPC-Nutzer können für Fahrzeuge, die von der Zentrale (HQ) gesperrt wurden, keine Serviceverträge anlegen oder aktivieren. Damit werden einschränkende regulatorische Vorgaben eingehalten.

Wird im Angebotsprozess nach der Auswahl des Kundentyps eine Fahrgestellnummer eingegeben, prüft die Vertragskalkulation zunächst, ob das Fahrzeug von der Zentrale gesperrt ist. Ist das der Fall, werden keine Produkte und Preise geliefert, und es erscheint die Fehlermeldung „locked vehicle - no products available“. Ist das Fahrzeug nicht gesperrt, werden alle passenden Produkte und Preise bereitgestellt.

Wird stattdessen ein Baumuster oder eine Auftragsnummer ohne verfügbare Fahrgestellnummer verwendet, werden Produkte und Preise geliefert, und der Vertrag kann den Status „Confirmed“ erreichen. Liefert das Fahrzeugmanagement bei erstellten Verträgen (BTO) später die Fahrgestellnummer nach, wird erneut geprüft, ob das Fahrzeug gesperrt ist. Bei einer Sperre wird der Vertrag auf „Rejected“ gesetzt, und die Marktorganisation erhält gemäß der Vorlage eine Benachrichtigung. Andernfalls wird die Aktivierung fortgesetzt.

**Weitere Hinweise**

Die Darstellung der Oberflächen entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design. Zusätzlich wurden Verbesserungen im Zusammenhang mit dem Go-Live von Contract Generation umgesetzt. Details dazu sind in den vorliegenden Informationen nicht beschrieben.

Die geplante Anzeige von Deckungen (enthalten/optional) in der Vertragsübersicht wurde nicht umgesetzt, da das zugehörige Vorhaben abgebrochen wurde. Die Deckungen werden daher weiterhin nicht in der Vertragsübersicht angezeigt.