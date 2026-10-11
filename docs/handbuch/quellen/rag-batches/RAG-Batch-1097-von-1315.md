# Batch 1097 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Hinweis: Tickets mit dem Status „Cancelled“ (Massenanlage von Fahrzeugen, neue Request-Attribute für Leasing-Verträge, Quelle der Händlerprovisionsdaten) wurden nicht berücksichtigt, da sie nicht umgesetzt wurden. Ebenso wurde die interne Umbenennung der Edge-Service-Endpunkte weggelassen, da sie für Anwender ohne Auswirkung ist.

**Vertragserstellung: Neuerungen und Korrekturen**

In der Vertragserstellung wurden mehrere Verbesserungen umgesetzt. In den Vertragsvorschlägen wurden einige deutsche Feldbezeichnungen angepasst: Statt „Kunde“ heißt das Feld nun „Kundengruppe“, statt „Industrie“ wird „Branche“ angezeigt, und anstelle von „Modellcode“ lautet die Bezeichnung „Baumuster | FIN/VIN | Auftragsnummer“. Der bisherige Untertitel „Geben Sie eine gültige Fahrgestellnummer, Auftragsnummer, Modellcode ein“ entfällt.

Die Kundentypen werden nun in der gesamten Anwendung einheitlich verwendet. Bei der Abfrage von Produkten wird der Kundentyp mitgesendet, sodass nur Produkte angezeigt werden, die dem jeweiligen Kundentyp zugeordnet sind. Bei der Erstellung eines Vertrags wird ebenfalls der passende Kundentyp übernommen. Unterschieden werden Privatkunde (Private Customer), Gewerbekunde (Commercial Customer), Leasing-Gewerbekunde (Leasing Commercial Customer, MBLD) und Gewerbe-Flottenkunde (Commercial Fleet Customer).

Beim Hochladen von Dokumenten wurde eine zusätzliche Prüfung des Dokumenttyps eingeführt. Außerdem lässt sich der Dialog zum Hochladen von Dokumenten nun gezielt öffnen: Scannt ein Händler den QR-Code eines Vertrags, wird er auf die Dokumentenseite des Vertrags weitergeleitet. Ist in der Adresse angegeben, dass der Upload-Dialog geöffnet werden soll, öffnet sich dieser automatisch. Ist zusätzlich ein Dokumenttyp angegeben, wird dieser im Dialog bereits vorausgewählt.

Für die Erzeugung der Schnittstelle i155 (RC05, Position 151–152) wurden weitere Kraftstoffarten ergänzt. Zusätzlich zu den bisherigen Werten (Benzin „4“, Diesel „1“, Elektro „7“, ohne Angabe „*“) werden nun folgende Werte ausgegeben: Hybrid Benzin/Elektro „9“, Hybrid Diesel/Elektro „8“, Rapsöl „6“, Wasserstoff „5“, Gas „3“ und Biodiesel „2“.

**Behobene Fehler**

Der Status der Vertragsunterschrift wurde korrigiert. Zuvor konnte der Status im Reiter „Historie“ des Vertragsvorschlags („Waiting for Confirmation“) vom Status in den MO-Prüfungen („OK Document signed“) abweichen. Beide Stellen sollen nun einen einheitlichen Status der Unterschrift anzeigen.

Außerdem wurde ein Problem für den Markt Indien behoben: Beim Anlegen eines Servicevertrags für Gewerbekunden konnte der Schritt „Kunden- & Zahlungsinformationen“ nicht abgeschlossen werden. Die Zahlungsart Kredit-/Debitkarte wird für Gewerbekunden nun auch ohne Mercedes-me-Konto akzeptiert. Zu beachten ist, dass Lastschrift auf dem indischen Markt keine verfügbare Zahlungsart ist.