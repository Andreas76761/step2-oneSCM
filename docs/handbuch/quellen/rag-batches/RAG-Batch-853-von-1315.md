# Batch 853 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Export aktiver Verträge**

Auf der Startseite des Vertragsmanagements steht Ihnen die Schaltfläche „Export" zur Verfügung. Damit können Sie alle aktiven Verträge exportieren, deren geplantes Vertragsende in den nächsten drei Monaten liegt. So lassen sich bestehende Verträge analysieren und Kunden, deren Vertrag in Kürze ausläuft, rechtzeitig erinnern. Wenn Sie mit dem Mauszeiger über die Schaltfläche fahren, erscheint ein Hinweis, dass die Exportdatei ausschließlich aktive Verträge enthält, deren geplantes Enddatum in den nächsten drei Monaten liegt.

Nach einem Klick auf „Export" öffnet sich ein Dialogfenster, in dem Sie das gewünschte Format wählen: .csv oder .xlsx. Mit „Speichern" laden Sie die Datei im gewählten Format herunter. Die Leistung der Anwendung soll auch bei einer wachsenden Zahl zu exportierender Verträge nicht beeinträchtigt werden. Der Dateiname lautet je nach Auswahl OneSCM_ActiveContracts_TenantID_YYYYMMDD.csv oder OneSCM_ActiveContracts_TenantID_YYYYMMDD.xlsx.

Die Exportdatei enthält für jeden aktiven Vertrag folgende Angaben: Vertragsnummer, Status, Aktivierungsdatum, Produktname, VIN, FIN, Kennzeichen, Kundennummer, Kundenname, SAP-Debitorennummer (zur Zuordnung des Kunden im Finanzsystem), Vertragsbeginn, geplantes Vertragsende, Ersteller, Kontostand, Marke, Division, Modell und Baumuster. Die Händlernummer und der Händlername sind im Export derzeit nicht enthalten, da dies für das MVP nicht vorgesehen ist.

Der Umfang der Exportdatei richtet sich nach Ihrer Rolle. Verkäufer erhalten nur die aktiven Verträge, die in den nächsten drei Monaten auslaufen und zu dem Standort gehören, an dem sie arbeiten. Market-Operation-Benutzer und MPC-Benutzer erhalten jeweils die in den nächsten drei Monaten auslaufenden aktiven Verträge eines bestimmten Marktes.

**E-Mail-Benachrichtigungen bei Statusänderungen von Verträgen**

Um den Weg zur papierlosen Arbeitsweise zu unterstützen, werden Kunden über bestimmte Statusänderungen ihres Vertrags per E-Mail informiert. Die Erzeugung von Dokumenten für diese Statuswechsel wird dadurch ersetzt. Voraussetzung ist, dass sich der Vertrag im Status „Aktiv" befindet. Die E-Mail geht an die E-Mail-Adresse des Kunden, die im Kundenmanagement oder bei der Vertragserstellung hinterlegt wurde. Sie wird immer an den Vertragsinhaber (Holder) gesendet. Gibt es sowohl einen Holder als auch einen Payer, erhält ebenfalls der Holder die E-Mail.

Eine Benachrichtigung wird in drei Fällen ausgelöst. Läuft ein Vertrag nach Datum oder Laufleistung ab, erhält der Kunde die Information, dass der Servicevertrag beendet wurde und die Leistungen nicht mehr abgedeckt sind. Bei einer vorzeitigen Beendigung, also dem Rückzug eines Fahrzeugvertrags vor dem Vertragsende, wird der Kunde darüber informiert, dass der Servicevertrag auf seinen Wunsch hin beendet wurde und die Leistungen nicht mehr abgedeckt sind. Wird ein ausgesetzter Vertrag wieder aktiviert, erhält der Kunde die Mitteilung, dass der Vertrag erneut aktiv ist. Die Inhalte der E-Mails entsprechen den jeweiligen Vorlagen für das Vertragsende, die vorzeitige Beendigung und die Wiederaktivierung.

Versendete E-Mails werden im Reiter „Dokumente" des Vertrags protokolliert. Im Aktionsmenü „…" stehen die Aktionen „Drucken" und „E-Mail erneut senden" zur Verfügung. Mit „E-Mail erneut senden" wird die E-Mail erneut an die E-Mail-Adresse des Kunden verschickt.

Einige Punkte sind für das MVP nicht vorgesehen und bleiben einer späteren Ausbaustufe vorbehalten. Bei einer regulären oder vorzeitigen Beendigung wird kein Dokument erzeugt, stattdessen erhält der Kunde eine E-Mail. Bei einer Aussetzung (Suspendierung) übernimmt das Finanzsystem NACOS/COFICO die Benachrichtigung oder Erinnerung, wobei OneSCM einen individuellen Text für diese Mitteilung bereitstellt. Marktspezifische Einstellungen für den E-Mail-Versand sind ebenfalls später vorgesehen. Bis dahin werden bei vorzeitiger Beendigung, Ablauf nach Datum oder Laufleistung sowie Wiederaktivierung standardmäßig E-Mails an alle Kunden gesendet.