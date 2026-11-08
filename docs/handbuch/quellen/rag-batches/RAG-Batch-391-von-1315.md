# Batch 391 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 51 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente und Kommunikation – Änderungen und Verbesserungen**

Im Bereich Dokumente und Kommunikation wurden zahlreiche Verbesserungen an E-Mail-Benachrichtigungen, Vertragsdokumenten und der Vorlagenverwaltung umgesetzt.

**E-Mail-Benachrichtigungen**

Der Versand von E-Mails wurde an mehreren Stellen angepasst. Wenn eine Datei zum Download bereitsteht, wird eine E-Mail mit einem Link zur Download-Seite versendet. Für Rückfragen enthält sie zwei Kontaktadressen: Die Adresse für technische Probleme ist fest hinterlegt, die Adresse für fachliche Fragen wird vom System aus der Marktkonfiguration übernommen. Der Text der E-Mail für die digitale Signatur (DSS) wurde von „Service Contract" auf „Service Contract Request" umgestellt, sodass nun von einer zu signierenden Servicevertragsanfrage die Rede ist. Außerdem wurde festgelegt, dass bei der Bestätigung eine E-Mail mit Anhängen und bei der Aktivierung eine E-Mail ohne Anhänge versendet wird. Bisher war dies umgekehrt. Ebenso wurde die Kontaktangabe des Market-Operations-Pools auf eine neue E-Mail-Adresse und die Telefonnummer +49 (0)30 2694 4343 umgestellt.

Behoben wurden zudem mehrere Darstellungs- und Funktionsprobleme: Die Kopf- und Fußzeile von E-Mails wurde auf mobilen Geräten nicht korrekt angezeigt, Wörter in E-Mails waren uneinheitlich eingefärbt, und die Preisinformations-E-Mail war falsch ausgerichtet. Die Bilder im E-Mail-Header wurden ausgetauscht, und der graue Hintergrund von E-Mail-Benachrichtigungen wurde durch einen weißen ersetzt. Test-E-Mails können nun auch an andere E-Mail-Konten gesendet werden. Die Aktivierungs-E-Mail zeigte bei deutscher Systemsprache englische Druckvariablen, und ein mit E-Signatur unterzeichneter Servicevertrag wurde in der Aktivierungs-E-Mail nicht als unterzeichnete Fassung versendet. Auch das Problem, dass Kunden die Bestätigungs-E-Mail nicht erhielten, wurde behoben. In den Benachrichtigungsaktionen wurde zusätzlich die Funktion „Klonen" ergänzt.

**Vertragsdokumente und Druckvariablen**

Die Berechnung der jährlichen und der gesamten Laufleistung sowie der monatlichen Rate im Servicevertrag war fehlerhaft und wurde korrigiert. Auch die veraltete Logik für die Gesamtlaufleistung im Vertragsdokument wurde bereinigt. Die Kundenunterschrift steht jetzt auf der ersten Seite, und der Mercedes-Benz-Stern wurde in die Mitte des Dokuments verschoben. Die Druckvariable „STATUS" wurde aus allen Vertragsvorlagen entfernt. Die Ausgabe der Druckvariablen erscheint bei deutschen Dokumenten nun auf Deutsch. Ausrichtung und Abstände in Datenschutzerklärung und AGB wurden korrigiert, ebenso die Ausrichtung des Infotexts zum Zeichnen der Unterschrift in der E-Signatur. Wurde ein Vertrag per Druckfunktion unterschrieben, fehlte das SEPA-Mandat in der ZIP-Datei; auch dies wurde behoben. Außerdem umgeht das SEPA-Mandat nicht mehr die Outlet-Validierung. Die Zahlenformatierung aus den Markteinstellungen wurde für mehrere Dokumente nicht angewendet; diese Korrektur ist fertiggestellt.

**Vorlagenverwaltung**

In der Vorlagenverwaltung wurden die Funktion für angehängte Dokumente überarbeitet und das Problem behoben, dass sich Spaltenränder nicht verschieben ließen. Zudem wurde die Abweichung zwischen der Vorschau einer Vorlage und der im Prozess erzeugten Vorlage beseitigt.

**Upload, Download und Signatur**

Der Upload von AGB funktionierte für die deutsche Sprache nicht und wurde korrigiert. Mehrere Fehler beim Hochladen von unterschriebenen oder gescannten Serviceverträgen wurden behoben, darunter nicht erkannte Uploads nach einer Druckunterschrift, ein Zeitüberschreitungsfehler beim Hochladen eines unterschriebenen Vertrags und nicht erkannte JPEG-Fotos auf dem iPad. Ebenfalls behoben wurden ein Fehler beim Herunterladen eines mit der Druckoption erstellten und hochgeladenen Vertrags, ein Fehler beim Aufruf der merge-pdf-API, eine Fehlermeldung beim erneuten Senden über DSS sowie die Fehlermeldung „Authentication forbidden" beim Öffnen der Produktübersicht. Die Fehler „Maximum upload size exceeded" bei der Vertragserzeugung und „Datei zu groß" beim Hochladen eines per Foto erfassten Servicevertrags sind ebenfalls behoben. Zusätzlich wurde ein Flyway-Skript im Benachrichtigungsbereich korrigiert.

**Noch offen bzw. nicht umgesetzt**

Eine allgemeine Verbesserung der E-Mails befindet sich im Backlog. Sie soll Benutzern helfen, E-Mails korrekt anzuzeigen, etwa über einen Hinweis zur Anzeige im Browser. Mehrere weitere Vorhaben wurden nicht umgesetzt, darunter die Anpassung der Kopf- und Fußzeilen-Auswahl in der Vorlagenverwaltung, die Änderung der Systemvorlagen zu Vor- und Nachnamen der Market-Operations-Benutzer, die Aufnahme des SEPA-Mandats in den Servicevertrag sowie weitere Anpassungen zur Darstellung von Dokumenten in Safari auf macOS und zur Kopf- und Fußzeile des SEPA-Mandats in der PDF-Vorschau.