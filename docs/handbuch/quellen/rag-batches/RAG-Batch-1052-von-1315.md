# Batch 1052 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 33 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation)**

Im Bereich der Vertragserstellung können Sie einen Vertrag auf verschiedenen Wegen aktivieren. Dazu zählen die Aktivierung über Build to Order und über Build to Stock. Ebenso lässt sich ein Vertrag mit Baumuster und der zusätzlichen Kennung Chassisnummer aktivieren. Für neue Privatkunden wird der Vertrag dabei über die Methode „Print Document“ unterzeichnet. Das gilt sowohl für die Aktivierung mit Baumuster und Chassisnummer als auch für Build to Stock. Zusätzlich können Sie prüfen, ob die Felder korrekt befüllt werden, wenn Sie unterschiedliche Kennungen eingeben. Für ISP-Fahrzeuge lassen sich ebenfalls Verträge anlegen. Die Details eines noch nicht bestätigten Vertrags im Status „CREATED“ können bearbeitet werden.

Bei der Vertragserstellung werden außerdem Zusatzfunktionen berücksichtigt. Dazu gehören die Anzeige und Auswahl optionaler Deckungen, eine Vorschau des Zahlungsplans mit Tooltip, die Unterscheidung nach Kundentyp mit unterschiedlicher Preisdarstellung sowie die Ergänzung der Information zur Kundenrabattgruppe. Der Kundenreiter in der Vertragserstellung und im Vertragsmanagement wurde ebenfalls geprüft. Auch eine einheitliche Darstellung des Verlaufsbereichs im Vertragsmanagement ist Teil der geplanten Arbeiten.

In der Vertragsvorlage steht ein neuer Platzhalter für die Bestellnummer zur Verfügung. Offen ist, ob dieser auch auf dem Novationsdokument und dem Prolongationsdokument erscheinen soll. Diese Frage wurde an die zuständigen Personen gerichtet.

**Behobene Fehler**

Im Rahmen der Qualitätssicherung wurden zahlreiche Fehler behoben. Sie betreffen vor allem folgende Bereiche:

Dokumente: SEPA-Dokumente wurden teilweise nicht in der Oberfläche angezeigt, obwohl sie hochgeladen waren, und fehlten im E-Mail-Umschlag des DSS. In einem Fall war ein Dokument erfolgreich hochgeladen, ließ sich aber nicht herunterladen. Zudem wurden Verträge mit fehlerhafter Dokumentenbehandlung korrigiert.

Kunden- und Vertragsdaten: Ein temporärer Kunde wurde ohne Referenznummer geführt. Die Prüfungen im MO zeigten Kundendetails an, die nicht mit den Daten im Kundenbereich übereinstimmten. Der CAS-Status im MO wurde nach einem Kundenereignis nicht aktualisiert. Ein FI-Systemstatus „NOK“ wurde im MO falsch interpretiert. Außerdem war eine Vertragsaktivierung ohne Kennzeichen möglich, und eine leere Start-Kilometerstand-Angabe führte zu einem Validierungsfehler bei einem Nemesis-Ereignis.

Preise und Benachrichtigungen: Der „Total Price Outcome“ in der Preisinformation im Vergleich wurde korrigiert. Kunden erhielten Benachrichtigungen und E-Mails auf Englisch, obwohl sie Deutsch als Sprache gewählt hatten.

Systemverhalten und Zugang: Die Anfrage „Get product“ wurde in der Produktivumgebung doppelt gleichzeitig ausgelöst. Bei den Nutzungsbedingungen konnten Anwender nicht in die App weitergehen. Die Links zu Impressum und Datenschutzerklärung in oneSCM funktionierten nicht.

**Umsetzung und Tests**

Die technischen Umsetzungen in den Teilen 1, 2 und 3 auf Backend-Seite sind abgeschlossen. Die Testfälle für die Funktionen werden in Xray geschrieben und vor dem Erreichen der INT-Umgebung manuell ausgeführt. Fehler werden protokolliert und in der DEV-Umgebung durch Bestätigungstests geprüft. Fehlgeschlagene Schritte werden erneut ausgeführt und entweder als bestanden bestätigt oder mit klar dokumentierten Fehlern besprochen, bevor eine Übernahme in die INT-Umgebung erfolgt.