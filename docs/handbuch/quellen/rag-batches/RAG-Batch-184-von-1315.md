# Batch 184 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 42 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuerungen und Korrekturen**

**Sales Campaigns (Schnittstelle E174)**

Die Attributanpassungen der oneERP-Schnittstelle E174 gelten ausschließlich für Sales Campaigns. In Zeile 240 wird als Sachkonto nun das Konto 40170000 übergeben. In Zeile 250 wird statt des Baumusters nun das „Economic Model“ übermittelt. Es wird aus der QSD5-Materialnummer abgeleitet und besteht immer aus den letzten sechs Stellen dieser Nummer. Aus der Materialnummer QSD5SC72687C ergibt sich so beispielsweise das Economic Model 72687C.

**Interne Kommentare auf Rechnungen**

Für mehrere Rechnungsarten stehen nun interne Kommentare zur Verfügung. Dies betrifft internationale Werkstattrechnungen, Erstattungsrechnungen, SIVECO-Rechnungen, Werkstattrechnungen für interne und externe Händler, MDD-Rechnungen für interne und externe Händler sowie MANU-Kundenrechnungen. Voraussetzung ist jeweils, dass ein Vertrag im Status „Aktiv“ vorliegt.

**Angepasste Logik des Steuerbetrags bei Werkstattrechnungen**

Die Berechnung des Steuerbetrags wurde für verschiedene Werkstattrechnungen überarbeitet. Das betrifft die internationale Werkstattrechnung und die SIVECO-Rechnung sowie die Kundenerstattungsrechnung, jeweils für Werkstätten ohne Zugehörigkeit (mit Normalsteuersatz, ermäßigtem Steuersatz oder Steuerbefreiung) und für zugehörige Werkstätten. Dasselbe gilt für manuelle Werkstattrechnungen, ebenfalls für nicht zugehörige Werkstätten (Normalsteuersatz, ermäßigter Steuersatz, steuerbefreit) und für zugehörige Werkstätten. Auch für VEGA-Claims wurde die Steuerbetragslogik angepasst. Hierfür muss eine i156-Datei mit Claim und enthaltenen Steuerinformationen vorbereitet werden. Bei den übrigen Rechnungsarten ist ein Vertrag im Status „Aktiv“ Voraussetzung.

**Behobene Fehler und weitere Anpassungen**

Beim Export der oneERP-Schnittstelle E169 für RI und IF wird nun ein „-“ eingetragen, wenn die Fahrgestellnummer (VIN) in der Datei fehlt. Außerdem wurde die fehlerhafte SAP-Debitorennummer für RI und IF korrigiert. Die Vertragslaufzeit wird wieder korrekt angezeigt. Der Job OneERPInvE169EXP schlägt bei fehlerhaften Daten nicht mehr fehl.

Für den indischen Markt wurde MPay in der INT-Umgebung eingerichtet, indem die ATC-ID für Indien hinterlegt wurde.

Behoben wurden zudem Probleme beim Export der Gutschrift für Altteilesteuer sowie beim Hochladen der i156-Datei. Weder der automatische Upload aus VEGA noch der manuelle Upload mit Admin-Benutzer funktionierte zuvor zuverlässig, und Claims wurden in ONESCM nicht angezeigt.

Im Zusammenhang mit der CoFiCo-Schnittstelle wurden zwei Fehler korrigiert. Beim Export für den slowakischen Markt erhielten mehrere Rechnungen unterschiedlicher Verträge und Rechnungsarten dieselbe Verarbeitungsnummer. Nun hat jede H-Zeile eine eindeutige Verarbeitungsnummer. Zudem wird der Header-Index korrekt gesetzt.

**Testfälle in Prüfung**

Derzeit befinden sich Testszenarien in der Prüfung, die noch nicht abgeschlossen sind. Sie betreffen Offene Posten (offene oder gezahlte Rechnungen mit offener, gezahlter oder ohne Gutschrift), Sammelläufe für Bahn und Bundeswehr ohne Zusatzkosten sowie den Fall eines im Ausland zugelassenen Fahrzeugs, das in einer deutschen Werkstatt repariert wurde, mit Rechnung an MB DE. Außerdem werden Sammelläufe ohne Subvention sowie mit Subvention für Niederlassung, Nfz, Aftersales und E169 geprüft.