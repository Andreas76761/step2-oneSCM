# Batch 551 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung: geplante Erweiterungen**

Im Bereich Kunden- und Partnerverwaltung sind mehrere Weiterentwicklungen vorgesehen, die sich derzeit noch in der Planung befinden.

**Automatische Ereignisse bei Kundenänderungen**

Bisher werden für unterschiedliche Kundenänderungen jeweils eigene Topics verwendet, zum Beispiel für allgemeine Kundenänderungen, für die SAP-Debitorennummer und für Änderungen von Kundenname und SAP-Debitor. Wird auf Kundenebene ein neues Feld ergänzt und sollen nachgelagerte Systeme über Änderungen daran informiert werden, muss bislang jedes Mal ein neues Topic angelegt werden. Künftig soll ein gemeinsames Topic für Änderungen an Kundendaten genutzt werden. Nachgelagerte Systeme und alle Verbraucher von Kundendaten werden dann automatisch über Änderungen informiert, ohne dass für neue Felder ein weiteres Topic erforderlich ist. Dadurch sinkt die Anzahl der Topics, und auch zukünftige Anforderungen werden abgedeckt. Als Ziel gilt: Jede Aktualisierung eines Feldes auf Kundenebene löst ein entsprechendes Ereignis aus.

**Verlässlichere Ereigniszustellung durch Abstimmung auf den Transaktionsabschluss**

Mit dem Wachstum des Systems steigen die Anforderungen an die Ereigniskommunikation. Bisher können Ereignisse direkt aus der Anwendung heraus veröffentlicht werden, und zwar unter Umständen schon in dem Moment, in dem ein Geschäftsvorfall verarbeitet wird. Dadurch besteht das Risiko, dass nachgelagerte Verbraucher inkonsistente Daten erhalten. Künftig sollen Ereignisse gemeinsam mit den Geschäftsdaten gespeichert und anschließend veröffentlicht werden, sodass jede abgeschlossene Änderung zuverlässig zugestellt wird. Datenänderung und Ereignis werden dabei als zusammenhängende Einheit behandelt. Ein Ereignis wird nur gesendet, wenn die Transaktion erfolgreich abgeschlossen wird. Wird eine Transaktion zurückgerollt, wird kein Ereignis veröffentlicht.

**Marktspezifische Kundenlogik in eigenen Services**

Mit jedem neuen Markt kommt marktspezifische Logik hinzu, etwa abweichende Regeln für die Kundenanlage, fachliche Prüfregeln für die Kundendatenpflege sowie ein anderes Finanzsystem mit eigenen Anfragen. Auch Adressformate, Pflichtfelder und Datenanreicherungen unterscheiden sich je Markt. Da der Kundenservice auf weitere Märkte ausgeweitet wird, steigt die Komplexität mit jedem zusätzlichen Markt. Künftig soll die gesamte marktspezifische Logik in eigenen Implementierungen je Markt gebündelt werden. Märkte ohne Sonderregeln greifen auf eine Standardimplementierung zurück. Ein neuer Markt kann so angelegt werden, ohne den Kernservice zu verändern und ohne die Logik bestehender Märkte zu beeinflussen. Das bestehende Verhalten aller aktuellen Märkte soll unverändert bleiben, was durch die vorhandene Testsuite und Regressionstests je Markt überprüft wird.

**Batchjobs zur Erzeugung von Lieferantenberichten**

Dieses Vorhaben befindet sich in der Verfeinerung. Bislang gibt es im neuen Service, der für Berichte aller Art (zum Beispiel für Lieferanten und Händler) zuständig ist, keinen Batchjob zur Berichtserstellung. Vorgesehen ist ein Batchjob für Lieferantenberichte, der von der Zentrale (HQ) für jeden Markt terminiert wird und über einen Cron-Scheduler läuft. Er soll folgende Berichte erzeugen: Vertragsberichte, Umsatzberichte (Zahlungsplanbericht des Lieferanten) und Kostenberichte (Kostenaufschlüsselung). Die Berichte sollen alle Daten enthalten, die in den Rechnungs-Batchjobs exportiert wurden, und die Daten des jeweils letzten Laufs des betreffenden Berichtsjobs berücksichtigen.

Die Jobs verarbeiten alle exportierten Rechnungen, unabhängig davon, wie viele Exportläufe zuvor stattgefunden haben. Ein Bericht beschränkt sich nicht mehr auf die Daten eines einzelnen Exportlaufs, sondern umfasst alles, was seit der letzten Ausführung des Berichtsjobs exportiert wurde. Ein Beispiel: Am 5. eines Monats werden bei einem Export 50 Rechnungen exportiert. Am 10. werden drei manuelle Rechnungen erstellt. Am 15. läuft der Export erneut und überträgt 30 Rechnungen. Am 19. entstehen zwei weitere manuelle Rechnungen. Am letzten Tag des Monats läuft der Export planmäßig, um noch nicht exportierte Rechnungen zu erfassen. Insgesamt ergeben sich so etwa 85 Rechnungen. Anschließend läuft der Berichts-Batchjob, und der Bericht enthält alle Daten seit dem letzten Lauf sowie die Daten zu all diesen Rechnungen.

**Exploration: Bereitstellung des Zahlungslinks per SMS**

Dieses Thema befindet sich ebenfalls in der Verfeinerung. Es soll untersucht werden, ob und wie ein Zahlungslink per SMS bereitgestellt werden kann, einschließlich der Frage der Konfigurierbarkeit. Grundlage der Untersuchung ist ein separates Dokument zum Zahlungslink-Prozess. Weitere Details liegen derzeit nicht vor.