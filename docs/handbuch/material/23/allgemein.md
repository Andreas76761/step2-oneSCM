# Material zu 23 Ohne Unterkapitel-Zuordnung

Kapitel 23 FAQ, Troubleshooting und Support. 11 Abschnitte aus den RAG-Batches, automatisch zugeordnet, redaktionell zu prüfen.

## [Batch 192.5] Weitere Korrekturen

Die Händlerfelder werden nun auch dann zurückgesetzt, wenn die „Partner Number – Vega ID“ ungültig ist. In der Übersicht der Materialnummern wird beim Zurücksetzen der Filter keine aufklappbare Zeile mehr angezeigt. Ebenfalls behoben wurde, dass der Download der i156-Datei über den Cross File Transfer nicht funktionierte. Darüber hinaus wurden Probleme mit E169-Batchjobs behandelt, die im Status „Started“ verblieben, sowie die Anzeige aller verfügbaren Materialnummern auf der Übersichtsseite.

## [Batch 258.5] Weitere Korrekturen

Behoben wurde außerdem ein Problem, bei dem der entfernte zweite Schalter für die globale Rechnungsstellung („Global Invoicing") die Vertragserstellung verhinderte. Zudem wurde ein Fehler bei den Batch Jobs behoben, der beim Löschen eines Job-Zeitplans (Job Schedule) auftrat.

## [Batch 315.5] Weitere Korrekturen

Die Lösch-Logik für Umsatz- und Kostendaten wurde korrigiert, und der Transformationsjob für Vertrags-Deltas behandelt Löschfälle jetzt korrekt. Behoben wurden außerdem Sicherheitsbefunde in der Entwicklungsumgebung, ein Deserialisierungsfehler bei einem nicht numerischen Textwert in einem Zahlenfeld sowie ein Problem, bei dem das Feld „annual_vehicle_mileage_txt“ für Altsystem-Verträge nicht für alle Verträge passte.

Die Validierung der Trennung von Batch-Jobs ist noch offen und noch nicht abgeschlossen.

## [Batch 610.3] Weitere Korrekturen

Die Validierung von Vor- und Nachnamen ist zwischen Frontend und Backend nun einheitlich. Außerdem ändern Aufrufe von GSSN die Namen für Märkte nicht mehr.

## [Batch 653.5] Weitere Korrekturen

Die Anzeige „Heruntergeladen am" wird nun unmittelbar nach dem Herunterladen einer Datei aktualisiert und nicht mehr erst nach einem Neuladen der Seite. Das Zeitstempelformat (UTC) wurde korrigiert. Außerdem wurde ein Fehler behoben, bei dem Kundendaten nicht aktualisiert werden konnten, wenn man nach der Vertragserstellung zur Seite „Kunden- und Zahlungsinformationen" zurückkehrte und Daten wie Name, E-Mail, Telefonnummer oder Adresse änderte, ohne die Option zur Aktualisierung des Mercedes-me-Kontos zu aktivieren. Ebenfalls behoben wurde die nicht funktionierende Mercedes-me-Suche.

## [Batch 698.5] Weitere Korrekturen und Anpassungen

Der Begriff „CrossFileTransfer" wird in der Benutzersprache Deutsch nun korrekt angezeigt. Für die SAP-Kreditorennummer gilt bei MWSI nun eine Pflichtangabe. HQ-Admin-Benutzer von MBSK haben Zugriff auf die Seite „Financial Control".

## [Batch 769.8] Weitere Korrekturen

Behoben wurden außerdem Probleme bei der Anlage von SAP-Debitorennummern für Kunden, bei der Erfassung von Erstzulassungsdatum und Kfz-Kennzeichen sowie bei Rechnungen zu gekündigten Verträgen, die fälschlich im Status „geplant“ standen bzw. nicht den Status „Dokument erstellt“ erhielten.

## [Batch 800.3] Weitere Korrekturen

Für Händlerbenutzer wird die Aktionsabfrage im Vertragsmanagement nicht mehr unnötig aufgerufen, und die zuvor fehlenden Vertragsdetails werden wieder angezeigt.

## [Batch 244.2] Technische Änderung

Bei allen Services wurde die Konfiguration entfernt, die einen Betrieb im DEBUG-Modus ermöglichte. Für Anwender ergeben sich dadurch keine funktionalen Änderungen.

## [Batch 494.5] E-Mail-Inhalt

Alle Inhalte werden gemäß dem Mercedes-Benz E-Mail-Styleguide erstellt. Der Betreff lautet „Service Contract Rejection (Contract Number: %Contract Number)". Die Vertragsnummer wird erst beim Versand an den Kunden eingesetzt und entsprechend der jeweiligen Nummer aktualisiert. Header und Footer wählen Sie jeweils aus einem Dropdown unter den angezeigten Werten aus.

Im Template Design Editor geben Sie den folgenden Text ein. Alle mit „%" gekennzeichneten Werte sind Platzhalter (Print Variables), die Sie per Drag-and-drop einfügen:

Dear (%First Name) (%Last name),
Thank you for choosing to maintain your vehicle with a Mercedes-Benz Service Contract. Unfortunately, your request cannot be processed further. For further details, please contact our Customer Support Team.
Yours sincerely,
Service Contract Team
Mercedes-Benz Cars Germany
[Market Specific input] <Contact Phone Number>
[Market Specific input] <Contact E-mail Address>
[Market Specific input] Please consider the environment before printing this email.

## [Batch 546.3] Überwachung und Monitoring

Die Überwachung der Anwendung wurde ausgebaut. Neben einem Monitoring des Anwendungszustands wurden die synthetischen Datadog-Tests der Preprod-Umgebung korrigiert. Im Rahmen des Datadog-/JVM-Monitorings entstehen neue Monitore für JVM-Metriken, die bei Erreichen von 80 % alarmieren. Weitere Monitore sollen alle Operationen abdecken und sämtliche Fehler aus dem APM erfassen. Außerdem wird die Integration mit dem Datadog-Agent geprüft, um zusätzliche JVM-Metriken auszulesen, etwa um festzustellen, welches Objekt den JVM-Speicher belegt. Für den Support wurden tägliche, wiederkehrende Aufgaben gebündelt und mit klaren Handlungsanweisungen versehen. Zudem werden Schwachstellen in jedem Sprint geprüft und behoben.

