# Batch 203 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Revenue Management: Änderungen und Hinweise

Bei internationalen Werkstattrechnungen werden künftig sowohl der Marktcode des Händlers als auch der Marktcode der Zielrechnung gespeichert. Damit lässt sich nachvollziehen, in welchem Markt der Händler angesiedelt ist und für welchen Markt die Rechnung bestimmt ist.

Auch die Ausgabe von Rechnungsdaten wurde überarbeitet. Bei den Kundenrechnungen wurde ein Fehler behoben, bei dem die Währung nicht der in den Markteinstellungen hinterlegten Währung entsprach. Ebenso wurde ein Fehler korrigiert, durch den der Exporttyp nicht richtig zugeordnet wurde. Zudem wurde ein Problem behoben, bei dem der Batch-Job CFDM für indische Rechnungen fehlschlug.

Für die Rechnungsdateien, die im Rahmen der Anbindung an oneERP erzeugt werden (Export E169), gelten zwei Anpassungen. Zum einen wird die bisher in den Dateien mitgelieferte Benutzerkennung entfernt. Die Kontaktdaten auf den Rechnungen werden vereinheitlicht: In oneERP gibt es künftig eine Ableitungstabelle, die das E-Mail-Postfach der Marktoperationen auf der Rechnung ausgibt. Zum anderen wurde in der Zeile PTXT01 das am Zeilenende ergänzte Zeichen „|“ entfernt, da der daraus erzeugte PDF-Text beim Testen nicht wie erwartet dargestellt wurde.

Einige geplante Punkte wurden nicht umgesetzt. Die vorgesehene Erweiterung der ausgehenden SWT-Datei um die Felder der Rechnungsadresse im Satz H wurde abgebrochen. Ebenso wurde die geplante Funktion zum Fortsetzen von Batch-Jobs abgebrochen, die ein Wiederaufnehmen nach einem unerwarteten Anwendungsstopp oder einem manuellen Stopp sowie das Zurückrollen von Daten vorsah.

Noch nicht abgeschlossen ist die Möglichkeit, bei Verträgen des Marktes Deutschland Zahlungsarten hinzuzufügen. Dieses Vorhaben ist derzeit blockiert, da die Abnahmetests (BAT) nicht fortgeführt werden können; die Funktion steht daher noch nicht zur Verfügung.

Schließlich wurden die automatisierten End-to-End-Tests im Bereich Revenue so angepasst, dass sie nicht mehr von vorhandenen Daten abhängig sind und nicht mehr an unbrauchbaren Testdaten scheitern.