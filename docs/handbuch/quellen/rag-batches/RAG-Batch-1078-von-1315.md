# Batch 1078 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fehlerbehebung bei der Erstellung der I155-Datei**

Bei der automatischen Erstellung der I155-Datei, die regelmäßig durch einen zeitgesteuerten Prozess ausgelöst und an das Zielsystem Vega übermittelt wird, trat in bestimmten Fällen ein Fehler auf. Die Generierung brach mit einer Ausnahme ab, sodass die Datei für die betroffenen Verträge nicht erstellt werden konnte.

Ursache war die Prüfung, ob sich der Status eines Vertrags geändert hat. Dabei werden zuvor gespeicherte Vertragsdaten im JSON-Format wieder in ein Vertragsobjekt eingelesen. Diese gespeicherten Daten enthielten Felder, die das aktuelle Vertragsobjekt nicht mehr kennt, beispielsweise den Gesamtnettolistenpreis (totalNetListPrice). Da solche unbekannten Felder beim Einlesen nicht ignoriert werden sollten, wurde der Vorgang abgebrochen und die Erzeugung der I155-Datei schlug fehl. Betroffen war insbesondere die Verarbeitung von Datensätzen des Satztyps 05.

Das Problem wurde behoben, und das zugehörige Ticket wurde geschlossen. Die I155-Datei kann damit auch für Verträge erstellt werden, deren gespeicherte Daten ältere oder zusätzliche Felder enthalten. Welche technische Anpassung im Einzelnen vorgenommen wurde, geht aus den vorliegenden Informationen nicht hervor.