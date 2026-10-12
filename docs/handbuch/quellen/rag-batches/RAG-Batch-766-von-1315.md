# Batch 766 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverwaltung: Zahlungsart ändern (Reiter „Zahlung")**

Im Reiter „Zahlung" können bestehende Zahlungsarten über das Kundenportal (CAC) geändert werden. Die Funktion unterstützt die Änderung der Zahlungsart für einen oder mehrere Verträge, damit Kunden auf eine besser passende Zahlungsoption wechseln können. Dabei bleiben die korrekte Abrechnung und die vertragliche Nachvollziehbarkeit gewährleistet. Voraussetzung ist, dass der Kunde in oneSCM existiert und mindestens einen Vertrag besitzt. Der Vertragsstatus spielt keine Rolle (aktiv, ausgesetzt, abgelaufen, gekündigt oder abgeschlossen). Die Verträge müssen über den Contract Microservice abrufbar sein. Die verfügbaren Zahlungsarten werden auf Produktebene definiert und vorgelagert durchgesetzt.

Nach der Anmeldung im CAC ruft der Customer Microservice beim Contract Microservice alle Verträge des Kunden ab. Zu jedem Vertrag werden Vertragsnummer, Zahlungsart und Zahlungsintervall angezeigt.

Bei einem Wechsel im Lastschriftverfahren (Änderung der IBAN) oder von Lastschrift auf Kreditkarte wählt der Kunde einen oder mehrere Verträge aus. Wird die IBAN geändert, übernehmen alle Verträge des Kunden die neue IBAN, unabhängig von der Auswahl. Wird die Zahlungsart von Lastschrift auf Kreditkarte geändert, gilt dies nur für die ausgewählten Verträge. Nach Abschluss der Änderung sendet der Customer Microservice die Aktualisierung an den Contract Microservice. Dieser aktualisiert die Zahlungsart und den Verlaufsbereich des Vertrags.

Beim Wechsel von Kreditkarte auf Lastschrift wird, falls für den Kunden noch kein SEPA-Dokument vorliegt, automatisch eines erzeugt. Der Kunde muss es per E-Mail unterschreiben. Das Dokument wird auf Vertragsebene im Reiter „Communication" unter „Documents" abgelegt, zunächst mit der ursprünglichen ID. Nach der Unterschrift wird es durch die unterschriebene Fassung mit der zugehörigen ID ersetzt. Es wird bei dem Vertrag gespeichert, für den die Änderung angefordert wurde. Wenn mehrere Verträge gleichzeitig ausgewählt wurden, ist noch offen, bei welchem Vertrag das Dokument abgelegt wird. Auch hier sendet der Customer Microservice nach Abschluss die Aktualisierung an den Contract Microservice, der Zahlungsart und Verlauf aktualisiert.

Zusätzlich gibt es die vorzeitige Abrechnung (Wechsel auf Einmalzahlung). Sie ist nicht möglich, wenn der Vertrag bereits das Zahlungsintervall „Einmalzahlung" hat. Sie kann unabhängig davon ausgelöst werden, wie die Zahlungsart geändert wird, also von Lastschrift zu Lastschrift oder Kreditkarte und umgekehrt. Der Kunde wählt im CAC die Verträge aus und entscheidet sich für die vorzeitige Abrechnung. Der Customer Microservice fordert diese beim Contract Microservice an. Dieser veranlasst bei den Produkten eine Neuberechnung und erhält die neu berechneten Beträge, die er an den Customer Microservice weitergibt. Der Customer Microservice führt dann die Änderung durch. Der Contract Microservice setzt das Zahlungsintervall auf „Einmalzahlung", dokumentiert die Änderung im Verlauf und benachrichtigt Revenue.

Eine Änderung der Zahlungsart gilt ab dem nächsten Abrechnungszyklus. Bereits bestehende Rechnungen bleiben unverändert.

Es besteht das Risiko, dass eine IBAN ohne gültiges Mandat geändert wird. Das kann zu unbezahlten Rechnungen und zur Aussetzung des Vertrags führen. Zur Absicherung wird der SEPA-Status nachverfolgt, und Verträge ohne Mandat werden gekennzeichnet.

Für die Zukunft sind mögliche Verbesserungen vorgesehen: ein Status „ausstehend" für Zahlungsänderungen, bis das SEPA-Mandat unterschrieben ist, die Sperrung aller Aktionen in der Vertragsverwaltung, bis die Zahlung aktualisiert wurde, sowie ein Ablauf für fehlgeschlagene oder abgelaufene SEPA-Unterschriften.

**Weitere Themen der Vertragsverwaltung**

Die Themen „Vertragsverwaltung für die Option Van-Reifen" und „Vertragsverlängerung für Management-Verträge" sind noch offen. Für sie liegen bislang keine inhaltlichen Angaben vor. Die geplante Integration von MIC bzw. „Get Mileage" in die Vertragsverwaltung (nur PROD) wurde abgebrochen und wird nicht umgesetzt.