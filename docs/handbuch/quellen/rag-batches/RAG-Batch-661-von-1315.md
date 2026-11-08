# Batch 661 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung: Änderungen und Hinweise**

**Validierung der Postleitzahl beim Bearbeiten von Kunden**
Beim Bearbeiten eines bestehenden Kunden mit gültiger Postleitzahl wurde bislang keine Fehlermeldung angezeigt, wenn Ziffern aus dem Postleitzahlenfeld gelöscht wurden. Dadurch ließ sich der Kunde mit einer ungültigen Postleitzahl speichern. Dieses Verhalten wurde als Fehler erfasst und ist inzwischen behoben (Status: Geschlossen).

**Übermittlung bestehender Kundendaten an Nacos**
Sobald ein Servicevertrag den Status „Confirmed" erreicht, dient dies als Auslöser für die Kundenverwaltung. Der Statuswechsel des Vertrags von „Created" auf „Confirmed" soll den Status des Kundendatensatzes von „Temporary" auf „In Confirmation" setzen. „In Confirmation" kennzeichnet, dass der Datensatz über eine Outbound-Datei an das Finanzsystem übermittelt werden muss. Ein Servicevertrag kann dabei von Benutzern der Rollen MPC PM, Dealer oder Market Operation angelegt worden sein.

Für Debitoren, die in oneERP noch nicht existieren, ist bis zum Go-Live von oneERP die Anlage in NACOS erforderlich. Vorgesehen ist die Nutzung der oneERP-BP-API zur Anforderung von Debitoren. Dies gilt ausschließlich für die SAP-Debitorennummer. Die SAP-Debitorennummer ist für die Domäne Revenue Management zwingend erforderlich, um Rechnungen zu erstellen, die an das Finanzsystem NACOS exportiert werden. Die SEPA-Mandats-ID (Lastschriftcode) wird vom Finanzsystem genutzt, um Rechnungen von den Kunden einzuziehen. Das Finanzsystem prüft dabei, ob ein SEPA-Mandat für den Kundennamen und die angegebene IBAN gültig ist, und bildet die Mandats-ID auf Basis von Kundenname und IBAN. Dazu benötigt es von oneSCM bei jedem neuen Servicevertrag eines Kunden einen Kundendatensatz. Die Verteilung der SEPA-Mandats-ID an Drittsysteme wird auf Seite von oneERP noch diskutiert; weitere Klärungen sind in den kommenden PIs zu erwarten.

Von oneSCM wird daher eine neue Logik erwartet, die bei jedem angeforderten Servicevertrag den Kundendatensatz an NACOS sendet. Die Kundenrolle im neuen Vertrag soll dabei „Holder & Payer" oder „Payer" sein. Die Logik darf nicht auf der vorhandenen SAP-Debitorennummer basieren, da diese im Finanzsystem eindeutig ist. Das Ticket ist geschlossen.

**Aktualisierung von i155 bei Änderungen der Kundendaten (abgebrochen)**
Geplant war, bei Änderungen des Kundennamens das optionale Feld RC80 (Position 78–177) der Schnittstelle i155 zu aktualisieren, wenn der zugehörige Vertrag aktiv ist, damit Vega informiert wird. Die Kundennummer in der Vertragserstellung wird als Hyperlink dargestellt und führt zur Detailansicht des Kunden in der Kundenverwaltung. Als Akzeptanzkriterium war vorgesehen, dass der geänderte Kundenname im Feld RC in der VEGA-i155-Datei verfügbar ist. Dieses Vorhaben wurde abgebrochen (Status: Cancelled) und ist daher nicht umgesetzt.

**Löschen von Kundendatensätzen (abgebrochen)**
Das Soft Delete von Kundendatensätzen war bereits definiert, wurde jedoch aus der Benutzeroberfläche entfernt, um ein Löschen von Kunden während der Vertragserstellung zu verhindern. Um die Datenqualität sicherzustellen, sollten nicht mehr benötigte Kundendatensätze automatisch und endgültig (Hard Delete) auch aus der Datenbank gelöscht werden. Vorgesehen war dies 30 Tage nach dem Zeitpunkt, an dem der letzte Vertrag abgelehnt, zurückgewiesen, storniert, geschlossen oder abgelaufen war, sowie 30 Tage nach dem Status „Temporary" eines Kunden. Der Löschzeitraum sollte aus dem Market-Configuration-Dashboard übernommen werden. Auch dieses Vorhaben wurde abgebrochen (Status: Cancelled) und ist daher nicht umgesetzt.