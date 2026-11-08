# Material zu 18 Ohne Unterkapitel-Zuordnung

Kapitel 18 Migration und Übernahme von Bestandsdaten. 3 Abschnitte aus den RAG-Batches, automatisch zugeordnet, redaktionell zu prüfen.

## [Batch 342.2] Erweiterung des Datenprodukts „SC Cost"

Das bestehende Datenprodukt mit den Kostendaten zu Serviceverträgen (SC Cost) wurde um zusätzliche Attribute erweitert. Diese waren in der ersten Version nicht enthalten, weil dafür keine Legacy-Daten vorlagen, sind aber für den oneSCM-Markt relevant. Dazu wurde das vereinheitlichte Datenmodell um die neuen Attribute ergänzt, und das Basisdatenprodukt für Servicevertragskosten wurde so erweitert, dass diese Attribute befüllt werden. Bei einer Delta-Lieferung des Datenmodells wird sichergestellt, dass die neuen Attribute für den gesamten Datenbestand aktualisiert werden.

Das Datenprodukt enthält aktuelle, vollständige und konsistente Daten im definierten Format einschließlich der neuen Attribute. Für Legacy-Anwendungen werden dabei nur Daten berücksichtigt, die im CostAlternativeReport (iCON) bzw. in den CostReports (ASSET, SIRIUS) enthalten sind. Alle Kosten mit den definierten Datenfeldern werden für sämtliche Märkte und Anwendungen in einer einzigen Einheit bereitgestellt. Das Datenprodukt geht an die SPOT-Kolleginnen und -Kollegen, etwa per DDX an extollo, sowie an weitere Abnehmer. Mehrere Datenformate wie XML und CSV sind möglich. Über Erfolg oder Fehlschlag der Erstellung wird benachrichtigt, und vor dem Schreiben neuer Daten wird eine Sicherung angelegt, aus der das Datenprodukt im Fehlerfall wiederhergestellt werden kann.

## [Batch 884.6] Hinweis zum Entwicklungsstand

Die Funktion befindet sich noch in der Entwicklung. Offen sind derzeit die Details der ISP-Anbindung, die genaue Festlegung der Pflichtfelder und die Frage, ob für bereits eingeführte Märkte (zum Beispiel SK) eine Migration erforderlich ist. Die Inhalte dieses Abschnitts können sich daher noch ändern.

## [Batch 1101.5] Datenbank und Feldlängen

Die in der Datenbank zulässige Zeichenanzahl für Outlet-Name, Händlername und Händleradresse wurde von 100 auf 250 Zeichen erhöht. Hintergrund waren Probleme im Produktivbetrieb bei sehr langen Bezeichnungen. Die Prüfung ergab, dass das Feld in keiner anderen Domäne verwendet wird. Die Änderung ist in die Flyway-Datenbankmigration aufgenommen.

