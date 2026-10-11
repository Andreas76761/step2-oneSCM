# Batch 819 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 34 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Verlängerungen auf Produktebene**

Die Verlängerung von Verträgen berücksichtigt nun die Konfiguration des jeweiligen Produkts. Bisher konnte für jedes Produkt standardmäßig eine Kurzzeitverlängerung von maximal sechs Monaten durchgeführt werden, und Langzeitverlängerungen richteten sich nach den Laufzeiten, die von der Vertragskalkulation geliefert wurden. Künftig sind sowohl Kurzzeit- als auch Langzeitverlängerungen nur möglich, wenn das Produkt dies in seiner Konfiguration unterstützt. Vor dem Angebot einer Verlängerung an MO/MPC wird dies zusätzlich geprüft. Die im Auswahlmenü angezeigten Optionen für die Kurzzeitverlängerung sind auf den Zeitraum begrenzt, der maximal verlängert werden darf, höchstens jedoch sechs Monate. Beträgt die Produktlaufzeit beispielsweise 60 Monate und besteht ein Servicevertrag über 58 Monate, kann nur um maximal zwei Monate verlängert werden, bis die Produktlaufzeit erreicht ist. Bei einer Langzeitverlängerung wird in der Anfrage an die Vertragskalkulation die bisherige Vertragslaufzeit übermittelt, gegebenenfalls einschließlich einer bereits erfolgten Kurzzeitverlängerung. Die Vertragskalkulation liefert daraufhin die Zeiträume zurück, die zusätzlich zur bestehenden Laufzeit hinzugefügt werden können.

Mehrere Fehler im Zusammenhang mit Langzeitverlängerungen wurden behoben. Dazu zählen Fehlermeldungen, die auftraten, wenn ein Produkt deaktiviert oder gelöscht wurde, sowie Probleme, wenn Vertragslaufzeiten nach der Deaktivierung eines Produkts verlängert werden sollten. Ebenfalls korrigiert wurden der Fehler beim Abwählen der Laufleistung und das Zurücksetzen des angezeigten Preises, wenn Felder ausgewählt wurden und anschließend zurücknavigiert wurde. Zudem stimmt der in der E-Mail angezeigte Preis nun mit dem Preis auf der Übersichts- und Bestätigungsseite der Verlängerung überein. Die Schaltfläche zum Verlängern wird bei Verträgen mit Kontingentprodukt nicht mehr angezeigt.

**Vertragsprüfung (Contract Review)**

Nach einer Vertragsprüfung werden die zu berechnenden oder gutzuschreibenden Beträge bislang an das Revenue-System übergeben, um die entsprechenden Finanzdokumente zu erzeugen, ohne dass der Endkunde informiert wird. Vorgesehen ist, dass der Kunde nach Abschluss der Prüfung je nach Ergebnis automatisch per E-Mail mit einer passenden Vorlage benachrichtigt wird: wenn er einen Betrag zahlen muss, wenn er nichts zahlen muss (0,00 Euro) oder wenn er eine Gutschrift erhält. Dieser Punkt befindet sich derzeit im PI-Backlog und ist noch nicht umgesetzt.

Wird eine Vertragsprüfung vom System anhand der Profilregeln automatisch genehmigt oder abgelehnt, zeigt die Spalte „Geändert“ den aktuellen Zeitstempel gefolgt vom Wort „System“. Auf der Seite für operative Prüfungen werden standardmäßig die ältesten Prüfungen mit dem Status „Pending“ zuerst angezeigt. Korrigiert wurden außerdem die automatische Genehmigung von Prüfungen, deren Zahlungsbetrag über dem Schwellenwert liegt, sowie die Erzeugung von Rechnungen über 0 Euro im Prüfprozess.

**Vertragsübertragung und Oberfläche**

Der Fehler, dass die Übertragung eines Vertrags nicht funktionierte, wurde behoben. Die Aktionsschaltfläche wird für beendete Verträge nicht mehr angezeigt. Bei vorzeitig beendeten Verträgen mit Minderlaufleistung wird dagegen die Option „Request review“ im Auswahlmenü angeboten. Außerdem wurde die fehlerhafte Meldung beim Ändern des Kilometerstands bei Vertragsbeginn korrigiert, und Leerzeichen in der Vertragsnummer auf der Übersichtsseite der Vertragsverwaltung wurden entfernt.

**Schnittstellen und Dokumente**

Beim Wechsel des Zahlungsintervalls von monatlich auf einmalig wird nun ein Contract-Master-Ereignis erzeugt und an Nemesis gesendet. Dabei gelten die Werte ExtentionReductionIndicator = E und PaymentType = 02. Für Nemesis-Verträge wurden zudem folgende Anpassungen vorgenommen: Die Zguid wird mit führenden Nullen auf 30 Stellen angegeben (zum Beispiel 000000000000000000000002432686), der Ländercode für Deutschland lautet 20000, der IconTenant entspricht der 1SCM-Tenant-ID (20000DE), und der CompanyCode lautet DE01. Das Zahlungsbeginn-Datum entspricht „Invoice period from“ der ersten Rechnung des Zahlungsplans, das Zahlungsende-Datum „Invoice period to“ der letzten Rechnung.

Für das Abrufen von Dokumenten aus der Datenbank gibt es eine neue Version der Schnittstelle getContractDocument. Sie enthält einen zusätzlichen Parameter, mit dem festgelegt wird, ob das Aktivierungsdokument oder die Übertragungsdokumente zurückgegeben werden. Beim Erzeugen des Dokuments i155 wird das Kennzeichen nun linksbündig ausgerichtet. Zudem wurde das Löschen eines Preises korrigiert, sodass zugehörige untergeordnete Einträge mitgelöscht werden.

**Offene und nicht umgesetzte Punkte**

Die manuelle Testdurchführung für die Langzeitverlängerung ist noch offen. Nicht umgesetzt wurden unter anderem die Anzeige der Vertragswährung bei den Schwellenwert-Feldern auf der Seite zur Einrichtung des Prüfprofils, Verbesserungen am Prüfprofil in der Vertragskalkulation, die Übertragung aktiver Verträge auf bestehende Kunden, die Aktualisierung der Zahlerinformationen bei Einmalzahlung sowie verschiedene Korrekturen bei Vertragsübertragungen und Langzeitverlängerungen mit Einmalzahlung oder DSS-Signatur.