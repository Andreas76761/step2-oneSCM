# Batch 266 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Steuerverwaltung und Rechnungserstellung im Bereich Revenue Management**

**Vermeidung doppelter Steuerklassifizierungen**

Bisher gab es beim Anlegen einer Steuerklassifizierung keine Einschränkungen, sodass für denselben Steuertyp mehrere Versionen erstellt werden konnten. Dies ist nun nicht mehr unbeschränkt möglich. Beim Anlegen einer neuen Steuerklassifizierung prüft oneSCM, ob bereits eine Steuerklassifizierung mit denselben Parametern existiert. Verglichen werden dabei die Finanzdokumentdefinition, der Finanzsteuer-Klassifizierungscode, die Kundenklassifizierung, der Steuertyp und die Gültigkeit. Existiert keine Steuerklassifizierung mit diesen Parametern, wird die neue Steuerklassifizierung unverändert gespeichert.

Existiert bereits eine gültige Steuerklassifizierung mit denselben Parametern, gelten für Administratoren folgende Regeln: Im Feld „Valid From“ sind nur Datumswerte in der Zukunft zulässig, frühestens der morgige Tag. Wenn Sie auf „Create“ klicken, erscheint ein Warnhinweis mit dem Text: „Already exist a tax classification with the same criteria. If you want to proceed the validity of the previous tax classification will be changed. Do you want to proceed?“ Der Hinweis bietet zwei Schaltflächen an.

Mit „Cancel“ schließen Sie den Hinweis und kehren zur Seite zum Anlegen der Steuerklassifizierung zurück, wobei alle zuvor eingegebenen Daten erhalten bleiben. Mit „Proceed“ schließen Sie den Hinweis, die Gültigkeit der bestehenden Steuerklassifizierung wird angepasst und die neue Steuerklassifizierung wird gespeichert. Die bestehende Steuerklassifizierung endet dabei einen Tag vor dem Beginn der Gültigkeit der neu angelegten.

Ein Beispiel: Eine bestehende Steuerklassifizierung TAX1 ist vom 01.01.2022 bis 31.12.2050 gültig. Wird eine neue Klassifizierung TAX2 mit Gültigkeit ab 15.01.2024 bis 31.12.2099 angelegt, endet TAX1 anschließend am 14.01.2024. Auch bei mehreren bestehenden Klassifizierungen wird die Gültigkeit entsprechend angepasst, sodass am Ende jeweils nur eine Steuerklassifizierung gültig ist.

Damit ist sichergestellt, dass Administratoren neue Steuerklassifizierungen anlegen können, dass immer nur eine Steuerklassifizierung gleichzeitig gültig ist, dass die neue Steuerklassifizierung ein Startdatum in der Zukunft hat und dass die Gültigkeit der alten Steuerklassifizierung automatisch angepasst wird, wenn eine weitere angelegt wird.

**Behobener Fehler bei der Rechnungserstellung**

Beim Versuch, im Vertragsmanagement eine Rechnung für einen aktiven Vertrag zu erstellen, wurde zuvor eine unbekannte Fehlermeldung angezeigt und die Erstellung war nicht möglich. Dieser Fehler im Backend wurde behoben. Die Rechnungserstellung ist nun möglich und es wird eine Erfolgsmeldung angezeigt.

**Suche in der Steuerverwaltung**

Die Steuerverwaltung ist um Suchmöglichkeiten erweitert worden. Sie können nun nach der Finanzdokumentdefinition sowie nach der Kunden-Steuerklassifizierung suchen. Beide Funktionen befinden sich derzeit im Status „In Use“.