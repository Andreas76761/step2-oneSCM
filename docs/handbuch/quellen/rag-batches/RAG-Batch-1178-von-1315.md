# Batch 1178 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Automatischer Abruf von Lieferterminen aus GO und AFAB**

Im Bereich Vertragskalkulation (Contract Calculation) ruft das System den voraussichtlichen Liefertermin eines Fahrzeugs automatisch aus den Vorsystemen ab und meldet ihn an das Vertragssystem (CONTRACT). Der Abruf erfolgt zeitgesteuert über Batch-Jobs. Das Händlerumfeld profitiert davon, weil die Information zum Liefertermin so ohne manuelles Zutun bereitgestellt werden kann. Die Einrichtung und Terminierung der Jobs übernimmt der HQ-Administrator, die Händler erhalten die Information.

**Einrichtung der Batch-Jobs**

Für die beiden Vorsysteme stehen zwei Batch-Jobs zur Verfügung, die Sie an der gewohnten Stelle für Batch-Jobs anlegen und terminieren: „GetDeliveryDateGlobalOrder" für GO (das Pkw-System) und „GetDeliveryDateAFABOrder" für AFAB (das Transporter-System). Die Anlage und Terminierung folgt den bestehenden Regeln und dem üblichen Verhalten von Batch-Jobs. Die Terminierung erfolgt über eine Cron-ähnliche Einstellung. Als automatischer Rhythmus ist einmal pro Monat vorgesehen. Für AFAB gilt als Standardwert ein zweimaliger Lauf pro Monat.

**Abruf aus GO (Pkw)**

Wenn der Job „GetDeliveryDateGlobalOrder" läuft, fragt das System GO anhand der Auftragsnummer ab. Aus der Antwort liest es das Feld „DateTo" innerhalb des Elements „TargetDeliveryDate" aus. Dieses Feld enthält den relevanten Liefertermin. Ist das Feld befüllt, meldet das System den Termin an CONTRACT. Ist es leer, erfolgt für diesen Auftrag in diesem Lauf keine Meldung. In den folgenden geplanten Läufen fragt das System den Auftrag erneut ab, bis ein Liefertermin vorliegt und übermittelt werden kann.

**Abruf aus AFAB (Transporter)**

Beim Lauf des Jobs „GetDeliveryDateAFABOrder" fragt das System AFAB entweder anhand der Auftragsnummer oder anhand der FIN/VIN ab. Den Liefertermin entnimmt es aus dem dafür vorgesehenen Feld der Antwort bzw. der AFAB-Datei, nämlich dem Feld „GLT BAT Err [EN]: TDD-BAT calc.". Auch hier gilt: Ist das Feld befüllt, wird der Termin an CONTRACT gemeldet. Ist es leer, wird für diesen Auftrag in diesem Lauf nichts gemeldet, und das System versucht es bei den nächsten geplanten Läufen erneut, bis ein Termin vorhanden ist.

**Meldung an CONTRACT**

Sobald das System aus GO oder AFAB einen befüllten Liefertermin erhalten hat, informiert es das CONTRACT-System. Übermittelt werden die Kennung des Auftrags und der abgerufene Liefertermin. Vor der Übergabe wandelt das System das Datumsformat des jeweiligen Vorsystems in das Datumsformat des Marktes um, sodass CONTRACT das Datum entsprechend den Markteinstellungen erhält. Wurde der Liefertermin für einen Auftrag einmal erfolgreich an CONTRACT übermittelt, ruft das System diesen Termin in späteren Läufen nicht erneut ab und sendet ihn nicht erneut. Regelungen für nachträgliche Aktualisierungen sind hier nicht festgelegt.

**Hinweis zur Zuordnung**

Pro Fahrgestell gibt es genau eine Auftragsnummer. Dadurch ist die Zuordnung eines Liefertermins zu einem Fahrzeug eindeutig.