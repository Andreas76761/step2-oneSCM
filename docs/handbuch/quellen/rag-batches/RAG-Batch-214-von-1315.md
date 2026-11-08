# Batch 214 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Revenue Management: Änderungen und Neuerungen

Standardisierte Erstellung von Händlerrabatten, Kampagnen- und Provisionsrechnungen
Die Erstellung von Händlerrabatt-Rechnungen (DD), Kampagnenrechnungen (CAMP bzw. SDAS) und Provisionsrechnungen (SCOM) wurde vereinheitlicht. Bisher gab es dafür keinen einheitlichen Ablauf: Händlerrabatte wurden bei Aktivierung des Vertrags erzeugt, wenn sie vom Händler vergeben wurden, dagegen erst nach Ablauf der Widerrufsfrist, wenn sie von der Marktorganisation (MO) vergeben wurden. Kampagnenrechnungen entstanden bei der Aktivierung, Provisionsrechnungen erst nach der Widerrufsfrist.

Nun gilt für alle drei Rechnungsarten derselbe Ablauf. Sobald ein Vertrag aktiviert wird, erzeugt das System die jeweilige Rechnung automatisch im Status „Geplant" (PLANNED). Das gilt für Händlerrabatte unabhängig davon, ob sie von einem Händler oder von der MO vergeben wurden, für Kampagnenrabatte, die bei der Vertragserstellung angewendet wurden, sowie für Provisionen, sofern diese konfiguriert sind. Endet die Widerrufsfrist (Grace Period) des Vertrags, setzt das System die geplanten Rechnungen automatisch auf „Akzeptiert" (ACCEPTED). Wird ein Vertrag innerhalb der in den Markteinstellungen festgelegten Widerrufsfrist storniert, werden die zugehörigen Rechnungen ebenfalls automatisch storniert. Dadurch entfällt die Notwendigkeit, in diesem Fall eine Gutschrift zu erstellen. Sowohl Händler als auch MO-Benutzer können weiterhin Verträge anlegen und dabei Händlerrabatte vergeben oder Verträge mit bereits eingebauter Kampagne erstellen.

Anpassungen an der Schnittstelle E169
Der Textsatz PTXT01 wurde um das Leistungserstellungsdatum erweitert. Dieses wird am Ende des Satzes ergänzt und entspricht dem Ende des Rechnungszeitraums, zum Beispiel „Leistungserstellungsdatum 23.11.2024". Außerdem wird im Nettobetrag der Punkt durch ein Komma als Dezimaltrennzeichen ersetzt. Beide Änderungen gelten für alle Rechnungen, die über E169 erzeugt werden.

Ebenfalls geändert wurde die Kennung im Kopfsatz (Positionen 37 bis 44): In allen E169-Typen wird nun „OSOINEG" anstelle von „SERINKE" verwendet.

Behobene Fehler und technische Verbesserungen
Ein manuell hinzugefügter Text zu einer manuell erstellten Rabattrechnung wurde bisher nicht im E169-Export PTX01 übertragen; dieses Problem wurde behoben. Ebenso wurde ein Fehler korrigiert, durch den sich eine Händlerrabatt-Rechnung nicht bearbeiten ließ, wenn die Datumsangaben geändert wurden. Zudem wurde das Feld „changeBy" in den Plausibilitätstabellen im Backend auf eine Länge von 50 Zeichen erweitert.