# Batch 259 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Revenue Management: Änderungen und Korrekturen

Export E169 und Altteilsteuer
Der E169-Export und der Export für die Altteilsteuer wurden überarbeitet. Die Unterschriften im Dokument lauten nun David Kuester und Sebastian Rinke. Der Text für PTXT01 lautet „Betreffende Antragsnummer“, gefolgt von der Schadensnummer. Der Exporttyp bleibt sowohl im Kopfbereich (HEADER) als auch in den Positionen (POS) leer. Außerdem wurde die Berechnung des Baumusters korrigiert. Sie begann zuvor ab Position 5 der FIN statt ab Position 4. Das betraf den E169-Export ebenso wie den Export der Altteilsteuer.

Manuelle Rechnungen und Rechnungserstellung
Um Rechnungen aus dem Zahlungsplan von manuell angelegten Rechnungen unterscheiden zu können, erhalten alle Rechnungen vom Typ „MANU“ nun den Flow-Typ „Corrective Financial Document“. Zuvor wurde bei manuell erstellten Rechnungen fälschlicherweise der Flow-Typ „Periodical Payment“ angezeigt. Behoben wurde außerdem ein Fehler, bei dem die Erstellung einer manuellen Rechnung mit einem Positionsbetrag über 100 mit einer Fehlermeldung scheiterte. Ebenso wurde ein Fehler im Freigabeprozess im Admin-Bereich behoben. Wird eine manuell erstellte Rechnung mit einem Betrag unter 100 im Status „Accepted“ nachträglich auf einen höheren Betrag geändert, wechselt sie in den Status „Created“. Die Freigabe durch einen anderen Benutzer im Admin-Bereich unter „Invoices“ führte bisher zu einer Fehlermeldung.

Prüfung von Rechnungspositionen
Das System prüft nun, dass das Startdatum einer Rechnungsposition nicht vor dem Vertragsbeginn liegt. Das Enddatum einer Rechnungsposition darf nicht nach dem Vertragsende liegen. Zuvor konnte eine Position mit einem Rechnungszeitraum außerhalb der Vertragslaufzeit angelegt werden. Dies ist nun über eine Anpassung des Datumsauswahlfelds oder eine Meldung an den Benutzer abgedeckt.

Steuerberechnung
Die Logik zur Berechnung des Steuerbetrags wurde von der Benutzeroberfläche ins Backend verlagert. Bei Rechnungen aus dem Zahlungsplan wird der Nettobetrag bei der Erzeugung des Zahlungsplans berechnet. Sobald der Batch-Job die Rechnung verarbeitet und in den Status „Accepted“ setzt, werden Steuerbetrag und Bruttobetrag neu berechnet.

Händlerrabatt in Höhe des Vertragswerts
Gewährt der Händler dem Kunden einen Rabatt in Höhe des gesamten Vertragswerts (100-Prozent-Fall), werden nach Aktivierung des Vertrags die Zahlungspläne mit dem Händler als Zahler erstellt. Das Zahlungsintervall ist dabei fest auf „OneTime“ gesetzt. Der Betrag pro Intervall entspricht der Einrichtung anderer Verträge mit Einmalzahlung. Es werden keine Kundenrechnungen erzeugt. Stattdessen wird der Händlerrabatt in Höhe des Vertragswerts mit der Kennzeichnung „DD“ im Reiter „Price Reduction“ angelegt. Diese Rechnungen werden mit dem regulären E169-Export zur Rechnungssynchronisation an NACOS übertragen, mit dem Subject „EXTSER“. Da Subventionen von OwnRetail-Händlern verarbeitet werden, wird geprüft, ob der Händler intern oder extern ist. Den Wert zur Bestimmung des Affiliate-Status liefert GSSN+. Bei einem internen Händler („Affiliate“) wird der Händlerrabatt an die Schnittstelle E174 geleitet. Bei einem externen Händler („Not-Affiliate“) wird er an die Schnittstelle E169 geleitet.

Batch-Jobs
Mehrere Fehler im Bereich der Batch-Jobs wurden behoben. Der CFDM-Batch-Job endete zuvor mit dem Status „Failing“ statt „Completed“. Außerdem übernahm er Rechnungen nicht, deren Rechnungszeitraum das heutige Datum enthielt. Diese blieben im Status „Planned“, obwohl sie in den Status „Accepted“ wechseln sollten. Der Pfad der Batch-Job-Dateien war fehlerhaft. Nach dem Ausführen von NACOSINVE169EXP war die Dateiliste auf der Dateiseite leer, obwohl die Datei im S3-Ordner vorhanden war. Erzeugte Dateien werden nun auf der Seite zur Dateisuche angezeigt. Im Zusammenhang damit wurde auch geprüft, dass nach Ausführung des Batch-Jobs NACOSInvE169EXP die Rechnungen den Status „Exported“ erhalten und die Datei in der Batch-Ausführung sichtbar ist.

Zahlungspläne und Vertragslaufzeit
Bei der monatlichen Rechnungserstellung wurden falsche Datumsangaben korrigiert. Ein Vertrag mit einer Laufzeit von einem Jahr zeigte als Laufzeit 01.12.2023 bis 01.12.2024 an. Erwartet wird 01.12.2023 bis 30.11.2024. Der letzte der zwölf Zahlungspläne wies zudem einen Tag zu viel aus. Weiterhin wurde die vorzeitige Abrechnung bei bestehenden Verträgen mit geändertem Zahlungsplan behandelt. Wird im Bereich „Price Information“ das Zahlungsintervall von monatlich auf „OneTime“ geändert, soll der Zahlungsplan auf einen einzelnen Eintrag umgestellt werden. Bisher blieben fälschlicherweise zwölf Zahlungspläne bestehen.