# Batch 927 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Ausschluss von Deckungen bei der Übermittlung an Vega

Bei der Vertragserstellung entscheidet das System jetzt automatisch, welche Deckungen in die i155-Datei für Vega aufgenommen werden und welche nicht. Ziel ist, dass an Vega nur die relevanten Deckungen übermittelt werden, während Revenue bei der Vertragsaktivierung weiterhin sämtliche Deckungen erhält.

Der Ablauf beginnt damit, dass die Vertriebsmitarbeiterin bzw. der Vertriebsmitarbeiter eine Kennung in das System eingibt, um passende Produkte zu erhalten. Das Produktsystem liefert daraufhin eine Liste von Produkten samt Konfiguration zurück, wobei jedes Produkt die zugehörigen Deckungen enthält. Jede Deckung trägt dabei ein Kennzeichen, das angibt, ob sie für Vega nicht benötigt wird („Not Needed for VEGA“).

Das System prüft jede Deckung einzeln. Ist eine Deckung mit dem Kennzeichen „Not Needed for VEGA“ versehen, wird sie nicht in die i155-Datei aufgenommen. Sie wird jedoch bei der Vertragsaktivierung trotzdem an Revenue weitergegeben. Ist eine Deckung nicht mit diesem Kennzeichen versehen, wird sie sowohl in die i155-Datei aufgenommen als auch bei der Aktivierung an Revenue übermittelt. Die erzeugte i155-Datei enthält somit ausschließlich die relevanten Deckungen, während an Revenue bei der Vertragsaktivierung alle Deckungen gesendet werden, unabhängig davon, ob sie in der i155-Datei enthalten sind.

Zur Überprüfung der Funktion wird ein Produkt eingerichtet, das sowohl Deckungen mit dem Kennzeichen „Not Needed for Vega“ als auch Deckungen ohne dieses Kennzeichen enthält. Anschließend wird ein Vertragsangebot erstellt, das Produkt sowie die Kundendaten übernommen und der Vorgang bis zur Aktivierung durchgeführt. Bei der Aktivierung werden alle Deckungen an Revenue gesendet, egal ob sie gekennzeichnet sind oder nicht. Die i155-Datei enthält dagegen nur die Deckungen ohne Kennzeichen, die gekennzeichneten Deckungen sind darin nicht enthalten.