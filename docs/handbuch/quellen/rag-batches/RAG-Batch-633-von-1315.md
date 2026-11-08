# Batch 633 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**IBAN-Validierung über die SwiftRef-API**

Beim Erfassen einer neuen IBAN prüft das System diese über die SwiftRef-API und übernimmt die zurückgelieferten Daten automatisch in die entsprechenden Felder. So wird sichergestellt, dass die eingegebene IBAN korrekt ist. Die Funktion steht im Generierungsprozess und in der Kundenverwaltung zur Verfügung. Eine Nutzung im Self Service ist im aktuellen Stand nicht vorgesehen. Sie gilt ausschließlich für IBANs, die für den jeweiligen Kunden in oneSCM noch nicht vorhanden sind.

Sobald die IBAN eingegeben wurde, wird sie zunächst nach den bereits bestehenden Regeln validiert und anschließend an die SwiftRef-API übermittelt. Ist die IBAN laut API-Antwort gültig, werden die Felder Bankname und BIC (Bank Identifier Code) automatisch befüllt und ausgegraut dargestellt. Dasselbe gilt für die Währung. Sind in der Marktkonfiguration mehrere Währungen hinterlegt, steht die Währung als Dropdown-Auswahl zur Verfügung.

Meldet die API, dass die IBAN ungültig ist, zeigt das System die Fehlermeldung „IBAN IS INVALID" an. In diesem Fall ist die Schaltfläche „Confirm" nicht verfügbar, sodass die IBAN nicht übernommen werden kann.

Einige im Zusammenhang mit der Erfassung beschriebene Abläufe gehören zur Funktion für mehrere IBANs und gelten im aktuellen Stand noch nicht. Dazu zählen das Hinzufügen einer weiteren IBAN über „Add account" mit einem Modal-Dialog, die Pflicht zur Aktivierung der SEPA-Einwilligung vor der Bestätigung sowie das Aufnehmen der neuen IBAN in die Liste der Bankkonten des Kunden. Auch das Auslösen des SEPA-Ablaufs nach der Bestätigung, bei dem der IBAN-Status auf „TO BE CONFIRMED" gesetzt wird, ist davon betroffen.

**Weitere Themen im Bereich Customer & Partner Management**

Der Fehler, dass ein kürzlich angelegter Kunde nicht in der Exportdatei für Nacos enthalten war, wurde abgebrochen und wird nicht weiterverfolgt. Außerdem stehen noch manuelle Testdurchläufe aus. Sie betreffen die Validierung notwendiger Operationen gegenüber Organisations-IDs (Explorers), die Suche und Filterung bei kommerziellen Kundendaten, die Überarbeitung der NACOS-Outbound-Datei (Robo-Job) sowie das Anlegen kommerzieller Kunden und die zugehörigen Datensatzaktionen.