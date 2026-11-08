# Batch 834 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Management – Neuerungen und Korrekturen**

**Neue Seite „Operative Review Page"**

Im Admin-Bereich steht eine neue Seite mit dem Namen „Operative Review Page" zur Verfügung. Sie gibt MPC- und MO-Anwendern einen Überblick über Contract Reviews, die genehmigt, abgelehnt oder noch zur Genehmigung offen sind, damit die finanzielle Situation des Kunden bei Bedarf angepasst werden kann. Die Seite zeigt Verträge, die als abgelaufen (nach Datum) oder gekündigt gesetzt wurden. Sobald das passiert, ruft das Vehicle Management über die MIC-API den realen Kilometerstand des Fahrzeugs ab. Das Datum wird gespeichert, und der Wert erscheint als „Real Mileage at Contract End (Km)". Anschließend werden die im Contract Review Profile definierten Regelsätze angewendet, um die anzuzeigenden Daten zu ermitteln.

Im Kopfbereich der Seite lässt sich nach Review Type (Dropdown), Final User ID, Datum und Status suchen. Die Final User ID findet Datensätze, die vom eingegebenen Benutzer genehmigt oder abgelehnt wurden. Die Datumssuche liefert Ergebnisse mit passendem Review-Datum. Als Status stehen Approved, Dismissed, Pending, Waiting for Customer Request und TBD zur Auswahl. Die Suchfelder sind per „UND" verknüpft, die Suche startet über die Schaltfläche „Search". Über das „X" lässt sich die Eingabe löschen und neu erfassen. Die Anzahl der angezeigten Datensätze im Verhältnis zur Gesamtzahl wird angezeigt, pro Seite können 10, 20, 30, 40 oder 50 Einträge dargestellt werden.

Die Review-Tabelle enthält die folgenden Informationen: die Vertragsnummer als Link zur Vertragsdetailansicht im Contract Management, das Kennzeichen des Fahrzeugs (ist keines vorhanden, erscheint „-"), das Datum der Kündigung bzw. des Ablaufs, den Produktnamen, das Review Profile als Link zur Profildefinition sowie den Kilometerstand bei Vertragsbeginn. Außerdem werden der geplante Kilometerstand bei Vertragsende und der reale Kilometerstand angezeigt. Die Differenz zwischen geplantem und realem Kilometerstand wird als Planned minus Real berechnet. Die Spalte „Over/Under Mileage including Tolerance" zeigt bei einem realen Stand über dem geplanten Endstand die Mehrkilometer, bei einem Stand darunter die Minderkilometer. Die Maximum Charge wird sowohl bei prozentualer als auch bei absoluter Angabe in Bezug auf den geplanten Kilometerstand berechnet und als Ergebnis angezeigt. Der Preis pro Kilometer stammt aus der Vertragskalkulation bei der Vertragserstellung. Der Zahlungsbetrag (Payment Amount) ergibt sich aus dem Wert für Über-/Unterschreitung inklusive Toleranz multipliziert mit dem Preis pro Kilometer. Positive Beträge werden direkt angezeigt, negative mit vorangestelltem „-". Zusätzlich erscheint der aktuelle Kontostand aus dem Contract Management mit demselben Farbcode.

Die Aktionen Approve und Dismiss sind nur verfügbar, wenn der Status „Pending" lautet. Mit „Approve" wird die Anfrage genehmigt und das Revenue Management benachrichtigt, um Rechnung oder Gutschrift zu erzeugen (Vertragsnummer, Partnernummer, Betrag, Review Type). Mit „Dismiss" wird die Anfrage abgelehnt, der Contract Review in den Status „Closed" überführt und eine i155 erzeugt. Als Status werden Approved, Dismissed und Pending angezeigt. In der Spalte „Modified" erscheinen bei genehmigten oder abgelehnten Reviews die User-ID der bearbeitenden Person sowie ein Datumsstempel im Format TT.MM.JJJJ; bei „Pending" wird „-" angezeigt.

Standardmäßig werden die ältesten Datensätze zuerst angezeigt. Die Ergebnisse sind horizontal scrollbar, die Spalte mit der Vertragsnummer bleibt fixiert, und die Ergebnisse lassen sich sortieren. Wird kein passender Eintrag gefunden, erscheint „No data to display". Das Design folgt der Mercedes-Benz Workbench und dem vom Kunden validierten UI-Design. MPC- und MO-Anwender sehen alle Verträge, die auf Genehmigung oder Ablehnung warten, sowie bereits bearbeitete Reviews. Fehlt der Kilometerstand, können sie den Vertrag weder genehmigen noch ablehnen, haben aber die Möglichkeit, den fehlenden Kilometerstand nachzutragen.

**Kurzfristige Vertragsverlängerung bei Einmalzahlung**

Die kurzfristige Vertragsverlängerung unterstützt nun auch die Zahlungsart „Einmalzahlung". Der bisherige Ablauf des ContractUpdateService wird nur noch im Fall der monatlichen Zahlung ausgeführt. Bei einer Verlängerungsdauer größer als 0 und der Zahlungsart Einmalzahlung aktualisiert der Scheduler für abgelaufene Verträge die Felder Vertragsbeginn, geplantes Vertragsende, Laufzeit und jährliche Fahrleistung. Anschließend wird über den ContractUpdateService das Zahlungsintervall mit dem neuen monatlichen Intervall aktualisiert. Der Wert „reallocatedAmount" im ContractChangeEvent wird als Verlängerungsdauer multipliziert mit dem monatlichen Nettopreis des Vertrags gesetzt.

**Behobene Fehler**

Folgende Fehler wurden korrigiert:

Die Vega-Historie berücksichtigte die Auswahl bei „Entries per page" nicht; die Anzeige richtet sich nun nach der gewählten Anzahl.

Der Name der Benachrichtigungs-E-Mail im Zusammenhang mit der Vertragsübertragung wurde in Backend und Frontend angepasst.

Ein Fehler in der Vertragsübersicht auf der Entwicklungsumgebung wurde behoben.

Im Reiter „Contract" wurde die Vertragsdauer (real) nicht angezeigt; dies wurde behoben.

Beim Kündigen mehrerer Verträge desselben Kunden waren nicht alle aktiven Verträge dieses Kunden auf der Kündigungsseite sichtbar. Dies wurde korrigiert, sodass mehrere Verträge desselben Kunden gemeinsam gekündigt werden können.

Der Händlerrabatt wurde im Reiter „Payment" im Contract Management nicht aktualisiert; auch das wurde behoben.

Der verbleibende Kilometerstand nach einer Vertragsübertragung war nicht korrekt und wurde in Frontend und Backend berichtigt.

Beim Versenden der Aktivierungs-E-Mail trat ein Fehler auf, wenn der Vertrag nicht unterschrieben war; auch dieser Fehler wurde behoben.