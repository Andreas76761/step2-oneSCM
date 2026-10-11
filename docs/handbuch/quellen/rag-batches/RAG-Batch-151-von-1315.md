# Batch 151 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

**Verbesserungen am Batch-Job-Dashboard**

Die Dashboard-Seite für Batch-Jobs wird überarbeitet, damit Administratoren Jobs gezielter finden und Fehler leichter nachvollziehen können. Bisher gab es keine Filtermöglichkeit, und bei einem fehlgeschlagenen Job wurde der Fehler nicht angezeigt, sodass die Ursache schwer zu erkennen war. Künftig stehen drei neue Suchkriterien zur Verfügung: „Date From“ (Datum und Uhrzeit), „Date To“ und „Status“ (Dropdown mit allen verfügbaren Status). Bei „Date From“ werden alle Batch-Jobs angezeigt, deren Startzeit nach oder gleich dem gewählten Zeitpunkt liegt, bei „Date To“ alle Jobs mit einer Startzeit vor oder gleich dem gewählten Zeitpunkt. Bei Auswahl eines Status werden nur Jobs mit diesem Status angezeigt. Die Filter lassen sich einzeln oder in Kombination verwenden, und die Ergebnisse werden nach dem Anwenden sofort aktualisiert.

Die Ergebnisliste enthält zudem die neue Spalte „Actions“, in der jede Zeile die Aktion „Details“ bietet. Ein Klick darauf öffnet einen Dialog mit dem Abschnitt „Parameters“, der alle zum Batch-Job gehörenden Parameter auflistet, zum Beispiel USERNAME, DIVISIONS, LAUNCH_DATE oder MARKET_ID. Hat der Job den Status „Failed“, zeigt der Dialog zusätzlich den Abschnitt „Error Code“ mit den detaillierten Fehlerinformationen des fehlgeschlagenen Jobs. Diese Verbesserung befindet sich derzeit im BAT-Test.

**Komfort bei der Batch-Job-Tabelle**

Die Tabelle der Batch-Jobs wurde in der Bedienung verbessert. Ist die Tabelle mit den Job-Läufen geschlossen und wird ein Batch-Job gestartet, öffnet sich diese automatisch. Solange der letzte Lauf nicht beendet ist, wird der Status regelmäßig abgefragt (Short Polling). Dabei wird die Laufzeit in Sekunden mitgezählt und in der Oberfläche angezeigt. Außerdem ist die gesamte Zeile eines Batch-Jobs anklickbar und öffnet die untergeordnete Tabelle mit den Job-Läufen.

**Contract Number im Header der oneERP-Datei E169**

Im automatisierten Rechnungsprozess für MBLD-Verträge wird die Vertragsnummer nun auf Header-Ebene in die Dateistruktur E169 aufgenommen. Das Team von oneERP hatte dies angefordert, weil die Vertragsnummer so in den Kopfdaten der erzeugten Rechnung bzw. des Kundenauftrags in oneERP nutzbar ist. Zuvor stand sie nur im Positionstext, der sich auf das Rechnungsdruck-Layout beschränkt und für Folgeprozesse nicht verwendbar ist. Die Vertrags- bzw. Referenznummer des Servicevertrags steht am Ende des HEADER-Satzes, hinter der neu hinzugefügten UUID. Die angepasste Struktur wurde mit den oneERP-Kollegen abgestimmt.

**Weitere Korrekturen und Prüfungen**

Wenn der Betrag 0,00 beträgt, wurde in der Antwort bisher keine Währung mitgeliefert; dies wurde behoben. Ebenfalls behoben wurde, dass die Werte der Spalte „Market“ in der Schadensupload-Datei zwischen Groß- und Kleinschreibung unterschieden.

Die Rechnungsnummer und die Verarbeitungsnummer in oneSCM werden jedes Jahr zum 1. Januar auf 1 zurückgesetzt. Geprüft wurde außerdem die Download-Funktion für Rechnungen auf der Seite „Finance Management → Invoices“.

Für die Slowakei wurde die Vertragssperre und Reaktivierung auf Basis von Mahnstufe und Rechnungsanzahl getestet. Voraussetzungen sind ein Vertrag mit drei MPPIs im FI-Beleg sowie die Marktkonfiguration „Trigger Contract Suspension“ mit Mahnstufe 2 und zwei Rechnungen. Zudem wird getestet, ob nach Ablauf der MPay-Sitzung der Link zur Eingabe der Kartendaten weiterhin verfügbar ist.