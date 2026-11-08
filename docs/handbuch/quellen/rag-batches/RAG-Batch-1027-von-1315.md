# Batch 1027 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Benachrichtigungen im Vertragserstellungsprozess**

Sobald der Benutzer bei der Vertragserstellung die Auswahl der Produkte und Kunden abgeschlossen und die Vertragsübersicht durchlaufen hat, informiert oneSCM den Vertragsinhaber (HOLDER) bei jedem relevanten Statuswechsel per E-Mail. Die Nachricht geht immer an den Vertragsinhaber. Sind sowohl ein Vertragsinhaber als auch ein Zahlungspflichtiger (PAYER) hinterlegt, erhält ebenfalls ausschließlich der Vertragsinhaber die E-Mail.

Wird der Vertrag bestätigt (Status CONFIRMED), erhält der Kunde eine E-Mail mit dem Hinweis, dass der Vertrag zur abschließenden Prüfung weitergeleitet wurde und alle vertragsbezogenen Dokumente nach der Aktivierung zugestellt werden. Die E-Mail enthält außerdem eine kurze Zusammenfassung des Vertrags. Wird der Vertrag erfolgreich aktiviert (Status ACTIVE), informiert eine E-Mail darüber, dass der Vertrag aktiviert wurde. Alle vertragsbezogenen Dokumente sind dieser E-Mail als PDF angehängt. Wird der Vertrag storniert, weil Prüfungen fehlgeschlagen sind (Status CANCEL), erhält der Kunde eine E-Mail mit dem Hinweis, dass seine Anfrage zur Vertragserstellung nicht weiterbearbeitet werden konnte. Damit wird der Benutzer über nicht bestandene Prüfungen informiert.

**Kundenprüfung bei der Vertragserstellung**

Um doppelte Kundenanlagen zu vermeiden, prüft das System bei der Vertragserstellung, ob der Kunde bereits existiert. Nachdem der Benutzer ein Produkt ausgewählt und konfiguriert hat, erscheint eine Seite zur Eingabe der Kundendaten. Erforderlich sind Vorname, Nachname, E-Mail-Adresse bzw. MercedesMe-ID sowie Telefonnummer bzw. MercedesMe-ID. Zudem wird die Erlaubnis des Kunden eingeholt, seine Mercedes-Me-Profildaten zu verwenden.

Anschließend wird eine Abfrage an die Kunden- und Partnerverwaltung gesendet, die auch die Prüfung des Mercedes-Me-Profils umfasst. Existiert der Kunde bereits, zeigt das System den Hinweis an, dass der Kunde schon vorhanden ist, und die Daten werden vorausgefüllt, sodass der bestehende Kundenprozess genutzt wird. Andernfalls wird der Prozess für einen neuen Kunden fortgesetzt und die erforderlichen Daten werden erfasst.

**Dateiname der Schnittstellendatei I155**

Die Schnittstellendatei I155 war für den deutschen Markt bislang nicht verfügbar, und der bisher für andere Märkte verwendete Name ist nicht relevant. Der Dateiname setzt sich nun aus folgenden Bestandteilen zusammen: der Kennung I155, dem Land nach ISO 3166 (für Deutschland DE), der Markenzuordnung (PC für den MVP, VAN, SMART), einem Zeitstempel im Format JJJJMMTThhmmss sowie der Dateiendung txt. Ein Beispiel ist I155_DE_PC_20230724101725.txt.