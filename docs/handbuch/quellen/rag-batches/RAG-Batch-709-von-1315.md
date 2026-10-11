# Batch 709 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Altteilsteuer bei mehreren Schäden in einem Schadenfall**

Enthält ein Schadenfall mehrere Schäden mit Altteilsteuer, wurden die Gutschriften zur Altteilsteuer bisher zwar in einem gemeinsamen Dokument nach oneERP exportiert, jedoch als getrennte Positionen. Mit der Neuerung wird für jede Kombination aus Deckungscode und Schadencode, für die eine Altteilsteuer anfällt (Satzart 20), eine eigene Altteilsteuer-Gutschrift auf der Seite „Financial Control" unter „Old Part Taxes" (i156) erzeugt. Kombinationen ohne Altteilsteuer führen dagegen zu keiner Gutschrift. Enthält ein Schadenfall beispielsweise drei Schäden, von denen zwei Altteilsteuer aufweisen und einer nicht, erscheinen in der Financial Control genau zwei Altteilsteuer-Gutschriften, jeweils eine für die beiden betroffenen Schäden.

Beim Export in die Schnittstelle E169_OldPartTax werden die Gutschriften desselben Schadenfalls und desselben Händlers als Sammelrechnung in einem gemeinsamen Dokument mit mehreren Positionen zusammengefasst. Die Exportdatei enthält dabei einen Kopfsatz mit den Händlerdaten, anschließend je eine Positionszeile (POS) pro Gutschrift sowie je einen zugehörigen Textsatz (PTXT01) pro Gutschrift.

**i156: Währungs- und Einheitenumrechnung**

Bislang berücksichtigt der Import der i156-Datei keine Währungsumrechnung. Dadurch konnten Schadenfälle in einer abweichenden Währung in oneSCM importiert werden, und der Kontostand wurde allein anhand der Zahlenwerte berechnet, was zu einem falschen Kontostand führen konnte. Künftig erkennt das System beim Import, ob ein Schadenfall in einer anderen Währung vorliegt, und rechnet die Beträge in die Währung des Marktes um, sodass alle Beträge im Vertrag einheitlich in dieser Währung geführt werden.

Dazu liest das System beim Import der i156-Datei den Währungscode des Händlers aus der Satzart RC10, Position 227 bis 229, und vergleicht ihn mit der Währung des aktuellen Marktes. Weicht der Code ab, wird eine Umrechnung durchgeführt. Grundlage sind die Wechselkursdaten der offiziellen FX Data API. Die Wechselkurse werden samt zugehörigem Datum in der Datenbank gespeichert. Ist die Schnittstelle nicht erreichbar, wird für die Verarbeitung des Schadenfalls der zuletzt gespeicherte Kurs verwendet. Besteht keine direkte Umrechnungsmöglichkeit zwischen zwei Währungen, erfolgt die Berechnung über einen Zwischenschritt in Euro.

An der Rechnung werden sowohl der ursprüngliche Betrag samt Währung als auch die umgerechneten Beträge samt Marktwährung gespeichert. In der Benutzeroberfläche werden alle Beträge in der Marktwährung, also als umgerechnete Werte, angezeigt. Für die Berechnung des Kontostands werden ebenfalls die umgerechneten Beträge herangezogen.

Zusätzlich wird die Einheit des Kilometerstands umgerechnet. In der i156-Datei kennzeichnet die Satzart 20, Position 197, die Einheit: 1 steht für Meilen, 0 für Kilometer. Die Umrechnung erfolgt mit den Faktoren 1 Meile = 1,60934 km und 1 km = 0,621371 Meilen.