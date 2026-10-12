# Batch 1298 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Hinweis: Viele der Rohdaten enthalten nur leere Vorlagentexte. Der folgende Text beschränkt sich daher auf die tatsächlich vorhandenen Informationen.

**Architektur und Qualitätssicherung in oneSCM**

Im Bereich Architektur wurden mehrere Maßnahmen zur Qualitätssicherung der automatisierten Tests (Automation Quality Assurance, AQA) bearbeitet. Abgeschlossen sind ein sogenannter Locator-Self-Healing-Agent sowie die Anpassung der Sanity- und Smoke-Tests. Zu beiden Themen liegen keine näheren inhaltlichen Beschreibungen vor.

Abgeschlossen wurde außerdem eine Untersuchung, wie sich Tests auf Basis weiterer Schnittstellen (APIs) gestalten lassen. Ziel ist es, Testdaten nicht mehr aufwendig über die Benutzeroberfläche, sondern direkt über APIs anzulegen. So kann beispielsweise ein Vertrag per API erstellt und anschließend die Vertragsverwaltung in der Oberfläche getestet werden. Ebenso kann ein Produkt per API angelegt werden, sodass die weiteren Schritte in der Oberfläche folgen, oder ein Batch-Job wird per API gestartet. Dieses Vorgehen soll vor allem die Ausführungszeit der Tests verkürzen.

Ebenfalls abgeschlossen ist eine Untersuchung, die klärt, welche Schritte in den bestehenden Tests noch fehlen. Dabei wird betrachtet, welche Tests für die Hauptabläufe und die Nebenabläufe vorhanden sein sollten, was bei den Hauptabläufen bereits abgedeckt ist und was bei den Nebenabläufen noch nicht abgedeckt ist. Eine weitere Untersuchung zum Release-Test befindet sich derzeit in der Refinement-Phase. Sie widmet sich der Leitfrage, ob ein Release sicher durchgeführt werden kann.

Noch offen ist ein Refactoring des Test-Frameworks. Es soll Doppelungen (DRY) und Verstöße gegen das Prinzip der einzelnen Verantwortlichkeit (SRP) beseitigen, um Wartungsaufwand zu senken, die Lesbarkeit zu verbessern und die Schichtenstruktur des Frameworks durchzusetzen. Als Abschlusskriterien gelten: alle zugehörigen Stories sind geschlossen, es gibt keine neuen ContractData-Instanziierungen mehr, keine @Slf4j-Annotationen in Page- und Modulklassen, die Klasse OverviewAndConfirmationSteps umfasst weniger als 400 Zeilen, und es kommt kein Thread.Sleep mehr in Klassen vor.

Für die Codequalität wurden SonarCloud-Findings behoben, und zwar für die Explorers-Services und die Brabus-Services. Für die M&M-Services steht dies noch aus.

Geplant, aber noch offen, ist zudem eine Benutzerrolle mit reinen Leserechten (Readonly User Role). Diese Rolle soll in oneSCM alles einsehen, aber nichts verändern können. Dafür sind Anpassungen erforderlich: Auf der Startseite erscheint derzeit eine Fehlermeldung, und im Kopfbereich sind Benachrichtigungen nicht sichtbar. In der Produktverwaltung führt in der Verwaltung der Fahrzeuggruppen ein Klick auf das Preisschild im Ansichtsmodus nicht zur Preismatrix, sondern zu einer Fehlermeldung. Weitere Anpassungen sind in den vorliegenden Daten nicht vollständig aufgeführt.