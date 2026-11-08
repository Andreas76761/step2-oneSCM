# Batch 717 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kostenmanagement: Werkstattrechnungen, Export E167 und Import I156**

**Export der Werkstattrechnungen (E167)**

Bisher wurden alle Werkstattrechnungen über die Schnittstelle E167 an NACOS exportiert. Künftig erhält NACOS aus oneSCM nur noch manuell erstellte Werkstattrechnungen, die externe Händler betreffen. Diese Rechnungen werden in die E167-Datei exportiert und durchlaufen einen festgelegten Statusablauf. Bei einem externen Händler muss die Rechnung zunächst von einem MO-Benutzer freigegeben werden, wodurch sie den Status „Accepted“ erhält. Nach erfolgreichem Export in die E167-Datei wechselt der Status automatisch auf „Exported“. Bei einem internen Händler wird die Rechnung ebenfalls von einem MO-Benutzer freigegeben und erhält den Status „Accepted“. Unmittelbar danach wechselt der Status automatisch auf „Processed“. Rechnungen im Status „Processed“ werden vom Batch-Job E167 nicht exportiert. Sie verbleiben im System, damit der Kontostand korrekt bleibt.

Zusätzlich wurde der Aufbau der E167-Datei angepasst. Der Steuerbetrag in Landeswährung wird rechtsbündig mit führenden Leerzeichen ausgegeben. Auch die Stückzahl im Satztyp 2 wird rechtsbündig mit Leerzeichen links ausgegeben. In der ersten Zeile des Satztyps 2 wurden fehlende Felder ergänzt. Beim Senden einer Rechnung an NACOS lautet die Bankkontonummer in Zeile 2 des Satztyps 2 42010900. Bei interner Buchung in NACOS gelten für die Zeilen 1 bis 4 des Satztyps 2 nacheinander die Bankkontonummern 52003000, 82003010, 82003000 und 52003000. Das Feld ZTERM wird beim Senden einer Rechnung an NACOS in Zeile 2 des Satztyps 2 mit einem Schrägstrich gefolgt von drei Leerzeichen befüllt. Das Feld „Strasse“ enthält in Zeile 1 des Satztyps 2 die Straße samt Hausnummer.

Beim Export von Gutschriften beginnt der Satztyp 2 mit 50. Dabei gilt eine eigene Zuordnung der Felder.

**Import der I156-Datei**

Weichen beim Import der I156-Datei das Datum der Erstzulassung oder der VEGA-Code vom Vertrag ab, wird der Schadenfall dennoch importiert. Zusätzlich wird ein Fehlerprotokoll in DataDog angelegt.

Bei Fehlern in der Erstellung von Werkstattrechnungen wird der betroffene Schadenfall übersprungen, und jeder Fehler wird protokolliert. Ein Mechanismus für die erneute Verarbeitung nicht vollständig verarbeiteter I156-Dateien wurde geprüft, aber nicht umgesetzt.

**Datenweitergabe an DCS über Kafka**

Bei Anlage, Änderung oder Löschung einer Rechnung werden die Kostendaten als Kafka-Nachricht für DCS bereitgestellt. Das gilt nach einem I156-Import und nach manueller Kostenerstellung. Für importierte Schadenfälle werden alle erforderlichen Informationen übermittelt, etwa Marktcode, Servicevertrag, Rechnungsnummer, Reparaturdatum, Partnernummer, Werkstattname, Nettogesamtbetrag, Währung sowie Rechnungspositionen mit Deckungs- und Schadencodes. Für manuell erstellte Rechnungen werden einzelne Angaben nicht gesendet, da sie nicht in der Datenbank vorliegen und fachlich nicht angefordert wurden.

**Weitere Korrekturen**

Bei Werkstattrechnungen waren Deckungscode und Schadencodebeschreibung leer; dies wurde behoben. Die SAP-Debitorennummer wird bei Werkstattrechnungen nun als Text statt als Zahl gespeichert. Außerdem wurden Anpassungen in den Microservices für Kosten, Erlöse, Kunden und Verträge vorgenommen, um Fehler bei der Anbindung an Nemesis zu beheben.