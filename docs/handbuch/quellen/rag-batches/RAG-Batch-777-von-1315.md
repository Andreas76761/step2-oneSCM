# Batch 777 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Gültigkeitsdauer von Verlängerungsangeboten (Contract Prolongation)**

Bisher hatten Angebote zur Vertragsverlängerung keine festgelegte Gültigkeitsdauer. Sie endeten erst, wenn die Gültigkeit des DSS-Links ablief, die Verlängerung aktiv abgebrochen oder der Vertrag ausgesetzt bzw. beendet wurde. Brauchte ein Kunde mehrere Wochen oder Monate für die Unterschrift und waren in der Zwischenzeit ein oder mehrere Rechnungsstichtage überschritten, mussten die monatlichen, quartalsweisen oder jährlichen Raten nach der Unterschrift neu verteilt werden. Das ist in mehreren Märkten nicht zulässig, da der Kunde ein Angebot mit einer niedrigeren Rate unterschreibt, als sie nach der Unterschrift tatsächlich gilt. Mit der neuen Funktion wird die Gültigkeitsdauer ausdrücklich festgelegt und das Wirksamkeitsdatum daran gekoppelt, sodass nach der Kundenunterschrift keine Neuverteilung der Raten mehr nötig ist. Ein Nebeneffekt: Kunden müssen zeitnah unterschreiben, und Angebote verbleiben nicht dauerhaft im Status „Waiting for Confirmation“.

**Konfiguration in den Markteinstellungen**

MPC Product Manager legen die Gültigkeitsdauer getrennt je Division fest. Dafür steht unter Market Settings → General Settings → Timer & Reminders (PC & VAN) → Contract Management das neue Feld „Long Term Prolongation Proposal Validity (Days)“ zur Verfügung. Es gibt an, wie viele Tage ein Angebot zur Langzeitverlängerung gültig bleibt. Zulässig sind Werte von 1 bis 95 Tagen; der Standardwert für neue Märkte oder nach einem Zurücksetzen beträgt 30 Tage. Die Einstellung gilt für alle Divisionen und für alle Verträge, unabhängig vom Vertriebskanal (Retail, MBLD, Online Sales). Benutzer benötigen die entsprechenden Berechtigungen.

**Ablauf der Langzeitverlängerung**

Die Langzeitverlängerung kann von Mitarbeitenden der Market Operations (MO) oder des MPC an einem aktiven Vertrag gestartet werden. Die Gültigkeit des Angebots wird aus dem Anfragedatum zuzüglich der konfigurierten Tage berechnet, und das Ablaufdatum wird im Dokument zur Langzeitverlängerung angezeigt. Das Dokument enthält die Angebotsgültigkeit als Platzhalter. Während dieses Zeitraums bleiben Konfiguration und Preis erhalten, auch wenn sich die Preise auf Produktebene ändern.

Das nächste Wirksamkeitsdatum ermittelt das System anhand des Anfragedatums, der Angebotsgültigkeit, des Zahlungsintervalls und der verfügbaren Wirksamkeitsdaten. Liegt das Ende der Gültigkeit nach dem rechnerisch nächsten Wirksamkeitsdatum, wählt das System das nächste verfügbare Wirksamkeitsdatum nach Ablauf der Gültigkeit. Beispiel: Wird die Verlängerung am 10.12.2025 versendet und beträgt die Gültigkeit 30 Tage, ist das Angebot bis zum 09.01.2026 gültig. Bei monatlichem Zahlungsintervall läge das rechnerische Wirksamkeitsdatum am 05.01.2026. Da das Gültigkeitsende danach liegt, wird das nächste Wirksamkeitsdatum danach gewählt, nämlich der 05.02.2026.

Ist die Restlaufzeit des Vertrags kürzer als die Angebotsgültigkeit, entspricht die Angebotsgültigkeit den verbleibenden Vertragstagen, und das nächste Wirksamkeitsdatum ist der erste Tag nach Vertragsende.

**Bestätigung durch den Kunden und Ratenneuverteilung**

Der Kunde erhält das Dokument und muss es innerhalb der Gültigkeitsdauer bestätigen bzw. unterschreiben. Bis zum gewählten nächsten Wirksamkeitsdatum werden die Raten normal verteilt; ab diesem Datum beginnt die Neuverteilung. Nach der Bestätigung werden die Änderungen übernommen: Preis, Vertragslaufzeit, Deckungen und weitere zu ändernde Parameter werden aktualisiert, ein i155 wird erzeugt, Revenue erhält eine Benachrichtigung und aktualisiert die Rechnungen (Zahlungsplan), und Nemesis wird ebenfalls benachrichtigt. Das System berechnet den verbleibenden Vertragsbetrag ab dem gewählten nächsten Wirksamkeitsdatum neu.

Die Konfiguration einer Langzeitverlängerung lässt sich nachträglich nur wiederherstellen, solange die Angebotsgültigkeit noch aktiv ist.

**Keine Unterschrift innerhalb der Gültigkeit**

Unterschreibt der Kunde weder innerhalb der Angebotsgültigkeit noch bis zum letzten Vertragstag, wird der Vertrag auf „Expired“ gesetzt. Die Langzeitverlängerung steht dann nicht mehr zur Verfügung, und der DSS-Umschlag wird storniert.

**Vorzeitige Beendigung oder Aussetzung während einer laufenden Verlängerung**

Soll während einer laufenden Langzeitverlängerung eine vorzeitige Beendigung oder Aussetzung (Early Suspend) durchgeführt werden, wird zunächst die laufende Langzeitverlängerung abgebrochen. Dadurch bleibt das Vertrags-Setup (Laufzeit, Laufleistung, optionale Deckungen) im Zustand vor dem Start der Langzeitverlängerung erhalten. Anschließend wird die vorzeitige Aussetzung eingeleitet und die Historie aktualisiert.