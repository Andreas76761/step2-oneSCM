# Batch 407 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 38 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Documents & Communications – Neuerungen und Änderungen**

**B2B-Template-Management:** Im B2B-Template-Management lassen sich Dokumente, Benachrichtigungen und Signaturen als Vorlagen anlegen. Beim Anlegen eines Dokumenttyps kann nun der Kundentyp ausgewählt werden. Jeder erstellte Vorlagentyp kann als Entwurf gespeichert oder veröffentlicht werden. Veröffentlichte Vorlagen stehen im Vertragserstellungsprozess zur Verfügung. Der Signaturtyp wurde auf zwei Signaturen für den Markt und zwei Signaturen für den Kunden erweitert. In der Übersicht der Dokumente und Benachrichtigungen stehen zusätzliche Druckvariablen zur Verfügung, und die Übersicht lässt sich auch nach Kundentyp filtern.

**Dokumentvorlage für die Langzeitverlängerung:** Für die Verlängerung eines Vertrags (Long Term Prolongation) kann eine Dokumentvorlage als Entwurf gespeichert oder veröffentlicht werden; die eingegebenen Daten bleiben jeweils erhalten. Werden Pflichtangaben nicht korrekt ausgefüllt, erscheint zu jedem Feld eine Fehlermeldung, und die Schaltfläche zum Veröffentlichen ist deaktiviert. Die neuen Druckvariablen können in der Vorlage verwendet werden, und es kann eine Signatur ausgewählt werden, die nach der Vertragsverlängerung im Dokument angewendet wird. Bei einer Verlängerung wird die Vorlage mit dem aktuellsten Gültig-ab-Datum verwendet, und die in der Oberfläche erfassten Daten werden korrekt in das Dokument übernommen.

**E-Mail-Vorlagen:** Für die Information über eine Verlängerung gibt es eine E-Mail-Vorlage, die über die Schaltfläche „Send Email“ versendet wird. Sie kann als Entwurf gespeichert und veröffentlicht werden; die Daten erscheinen anschließend in der Übersicht. Nach einer Langzeitverlängerung erhält der Empfänger die E-Mail mit der Vorlage des aktuellsten Gültig-ab-Datums und angehängter PDF-Datei. Zudem kann eine Test-E-Mail versendet werden.

Auch für die Erinnerungs-E-Mail, wenn ein Vertrag sein geplantes Enddatum erreicht, gibt es eine Vorlage. Sie kann als Entwurf gespeichert oder veröffentlicht werden, die Daten bleiben in der Übersicht erhalten, und eine Test-E-Mail kann versendet werden. Die Erinnerung wird 60 und 30 Tage vor dem geplanten Vertragsende zugestellt.

Eine Master-E-Mail-Vorlage informiert Halter und Zahler über einen Zahlerwechsel bei einem aktiven Vertrag. Sie kann jeweils für den Zahler und für den Halter veröffentlicht werden, und die Daten werden gespeichert.

**Systeminterne Benachrichtigungen bei Werkstattrechnungen:** Die Rechnungsseite zeigt die Vertragsnummer der Rechnung an. Ein Klick darauf führt den MO-Benutzer zur Vertragsseite im Vertragsmanagement. Muss nur eine Rechnung genehmigt oder abgelehnt werden, wird direkt die entsprechende Rechnungsseite angezeigt. Bei mehreren Rechnungen führt der Link „Go to invoices“ zur Rechnungsübersicht. Über „Approve“ wird eine Rechnung genehmigt und erhält den Status „akzeptiert“. Über „Reject“ wird sie abgelehnt, und der Benutzer wird auf die vorgesehene Seite weitergeleitet.

Außerdem können zugewiesene Benutzer sich nun selbst wieder von einer Benachrichtigung abmelden (Zuweisung aufheben). Ein Fehler beim Bearbeiten der Datenschutzvorlage nach ihrer Veröffentlichung wurde behoben. Der „Go to invoice“-Link in E-Mails, der nicht anklickbar war, sowie die Prüfung des Zuweisungsfelds, die zuvor über eine Anfrage erfolgte und nun als Frontend-Validierung umgesetzt werden sollte, sind als abgeschlossen gekennzeichnet.

**Noch offene Punkte:** Folgende Themen sind noch nicht abgeschlossen:

Wenn ein MO-Benutzer eine manuelle Rechnung erstellt, die über einem festgelegten Schwellenwert liegt, soll eine Benachrichtigung an andere Benutzer als den Ersteller gesendet werden.

Die digitale Signatur bei Vertragserstellung und -aktivierung ist geplant: Der Kunde soll die Dokumente per E-Mail erhalten und digital unterschreiben können, und die signierten Kopien sollen an Verkäufer und Kunden zurückgehen. Der Verkäufer soll dabei auch die signierten Dokumente samt E-Mail-Inhalt erhalten. Die beim digitalen Signieren versendeten E-Mails sollen im Reiter „Communication“ des Vertrags mit Status sowie den Optionen „Print“ und „Re-send“ erscheinen. Sobald der Vertrag aktiv ist, werden alle Einträge aus dem Reiter „Communication“ der Vertragserstellung in den Reiter „Communication“ des Vertragsmanagements verschoben.

Außerdem soll ein MPC-Benutzer eine Datenschutz-Vorlage per Upload-Auswahl erstellen können. Ein manueller Integrationstest der Vertragsvorlage (PDF-Vorschau des Vertrags) steht abhängig von der Verfügbarkeit der Fachspezifikation (FRD) noch aus.