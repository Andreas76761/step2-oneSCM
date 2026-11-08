# Batch 162 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 17 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuerungen und Änderungen**

**Export von Prepaid-Verträgen**
Für Zahlungen vor der Vertragsaktivierung werden die Rechnungen nun an das Finanzsystem (FI-System) exportiert, sobald die Zahlung abgeschlossen ist. Der Export erfolgt auch dann, wenn der Vertrag noch nicht aktiviert wurde. Dazu wird ein Zahlungslink erzeugt und an den Kunden gesendet. Über diesen Link hinterlegt der Kunde seine Zahlungsdaten, wahlweise per Karte, UPI oder NetBanking. Wird die Zahlung von MPay erfolgreich verarbeitet, werden die Transaktionsdetails in der Rechnung aktualisiert. Anschließend informiert Revenue Management die Vertragserstellung (Contract Generation) über den Status der Transaktion. War die Zahlung erfolgreich, wechselt der Vertrag in den Status „Waiting for activation“, und die Rechnung wird an das FI-System exportiert.

Der Export erfolgt für oneERP über die Schnittstelle E169, für CoFiCo und SWT über eine Outbound-Datei. In der Exportdatei wird zusätzlich die Zahlungsart (Karte, UPI oder NetBanking) gespeichert. Die Dateien werden in S3 in denselben Ordnern abgelegt wie bei regulären Kundenrechnungen.

**Speicherung von NEMESIS-Events**
NEMESIS-Events wurden bisher nicht in einer Datenbank gespeichert, sondern lediglich erzeugt, versendet und in Datadog protokolliert. Künftig werden sie vor dem Versand in der Datenbank abgelegt, sodass die Details bei einem Audit oder einer erneuten Übermittlung direkt abgerufen werden können. Jeder Event-Typ wird in einer eigenen Tabelle gespeichert, die alle für einen erneuten Versand erforderlichen Angaben enthält. Ziel ist eine nachvollziehbare Historie der Ereignisse, die Audits, Nachverfolgbarkeit und schnellere Untersuchungen unterstützt.

**Sprache der Benutzeroberfläche in Batch-Jobs**
Die in der Benutzeroberfläche gewählte Sprache wird über den HTTP-Header X-Language übermittelt, analog zum bereits vorhandenen Header X-Market. Dieser Header ist beim Auslösen eines Batch-Jobs verpflichtend. Der Wert wird vom Service normalisiert und geprüft und anschließend als Parameter „language“ an den Batch-Job übergeben. Einzelne Verarbeitungsschritte der Jobs können die Sprache bei Bedarf auslesen.

**Änderungen bei Rechnungstexten für SWT und CoFiCo**
Bei SWT fehlte bei Händlerrabatten der Text der Rechnungsposition; dies wurde behoben. Bei SWT und CoFiCo wurde außerdem der allgemeine Rechnungstext für Händlerrabatte und Händlerprovisionen angepasst, sodass er aus 240 Leerzeichen besteht.

**Batch-Jobs und Schnittstellen**
Die NACOS-Batch-Jobs SAPInvE174EXP und SAPInvE167EXP wurden entfernt; ihre Aufgaben übernehmen die Jobs OneERPInvE174EXP und OneERPInvE167EXP, deren erfolgreiche Ausführung geprüft wurde. Zudem wurde ein Fehler behoben, bei dem der DocumentSignatureStatusJob in der Entwicklungsumgebung fehlschlug und nicht gestartet werden konnte.

**Werkstattrechnungen in der Ansicht**
Die Darstellung von Werkstattrechnungen im Anzeigemodus wurde angepasst und geprüft. Dies betrifft zum einen internationale Werkstattrechnungen, bei denen in der Rechnungsposition jeweils nur der Betrag für Arbeitsleistung (Labour), Material (Materials), Fremdleistungen (Sublets) oder Händlerbearbeitung (Dealer Handling) bzw. alle Beträge gemeinsam angezeigt werden. Zum anderen betrifft es Kundenerstattungsrechnungen, bei denen jeweils nur der Betrag für Händlerbearbeitung, Fremdleistungen oder Material in der Rechnungsposition erscheint. Für die Prüfung der Kundenerstattungsrechnungen muss ein Vertrag im Status „Aktiv“ vorhanden sein.