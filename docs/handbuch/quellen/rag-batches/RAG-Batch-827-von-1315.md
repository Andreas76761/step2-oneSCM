# Batch 827 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 50 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverwaltung (Contract Management)**

In der Vertragsverwaltung wurden mehrere Funktionen rund um die Pflege und Verlängerung von Verträgen erweitert und überarbeitet. Händler und Mobilitätsorganisationen (MO) können einen Vertrag im Status „Created“ vervollständigen, indem sie lediglich das FRD und das Kennzeichen ergänzen. Die Fahrgestellnummer wird dabei vom Backend erfasst. Ein MPC-Benutzer sieht alle Verträge des Marktes, dem er zugeordnet ist, und kann Verträge im Status „Waiting for Activation“ manuell aktivieren oder ablehnen. Verträge erscheinen nach der Erstellung zudem oben in der Liste. Bei der Suche nach erzeugten Dokumenten und Benachrichtigungen kann nun nach dem Titel gesucht werden. Ein Vertragsübergang wird im Reiter „Historie“ angezeigt, und der Reiter „Kommunikation“ mit den Dokumenten wurde überarbeitet. Außerdem lassen sich mehrere Verträge gleichzeitig kündigen. Dabei wird der Kilometerstand ermittelt und zum Kündigungsdatum die Schnittstellennachricht i155 erzeugt.

**Zahlerwechsel**

Bei aktiven Verträgen kann der Zahler geändert werden. Dies ist in mehreren Konstellationen vorgesehen. Hat der Vertrag einen Halter und einen davon abweichenden Zahler, kann ein bereits vorhandener Zahler hinzugefügt, ein neuer eigenständiger Zahler angelegt oder der Halter selbst zum neuen Zahler gemacht werden. Sind Halter und Zahler identisch, kann der Zahler durch einen bereits vorhandenen oder durch einen neuen Zahler ersetzt werden.

**Kurzfristige und langfristige Verlängerung**

Bei der kurzfristigen Verlängerung (Short Term Extension) zeigt die Übersicht bei der Vertragsdauer nun zusätzlich die Maßeinheit „Months“ an. Außerdem steht eine Information bereit, um wie viel länger der Vertrag verlängert werden kann. Das geplante Vertragsende und die Vertragsdauer werden nach der Verlängerung aktualisiert. Der in der Übersicht angezeigte Betrag stimmt mit dem Betrag in der E-Mail überein, und die versendete E-Mail enthält die Vertragsnummer.

Bei der langfristigen Verlängerung (Long Term Extension) eines aktiven Vertrags stehen verschiedene Varianten zur Verfügung:

Wird nur ein Zeitraum gewählt, wird der Vertrag um diesen Zeitraum verlängert, und die Gesamtlaufleistung bleibt wie ursprünglich vereinbart. Möchte die MO dieselbe Gesamtlaufleistung beibehalten, wird diese auf den neuen Zeitraum umverteilt. Wird nur die Laufleistung gewählt, wird sie angepasst, die Vertragsdauer bleibt unverändert. Werden Zeitraum und Laufleistung gewählt, wird der Vertrag um den Zeitraum verlängert, und die Laufleistung ergibt sich aus der bisherigen Vertragsdauer zuzüglich des Verlängerungszeitraums. Auch eine Kombination aus kurzfristiger und langfristiger Verlängerung ist bei einem aktiven Vertrag möglich.

Im Reiter „Historie“ wird angezeigt, dass die langfristige Verlängerung in Bearbeitung ist und welcher MO-Benutzer sie veranlasst hat. Die langfristige Verlängerung kann dem Kunden über die Schaltfläche „Send Email“ zugesandt werden. Verträge, die bereits über die maximale Dauer bzw. Laufleistung hinaus verlängert wurden, können nicht erneut langfristig verlängert werden. Wurde die DSS-Signatur des Kunden bei einer langfristigen Verlängerung nicht geleistet, ist keine weitere langfristige Verlängerung möglich.

**Vertragsprüfung (Contract Review)**

Die Vertragsprüfung berücksichtigt Unter- und Überschreitungen der Laufleistung (Undermileage und Overmileage). Bei manueller Genehmigung kann die Prüfung durch den MPC bzw. die MO genehmigt oder abgelehnt werden. Bei Undermileage mit manueller Genehmigung ist die Genehmigung durch den MPC möglich. Bei Verwendung eines Schwellenwerts gilt: Liegt dieser unter dem Zahlungsbetrag, kann die Prüfung manuell genehmigt oder abgelehnt werden. Liegt er über dem Zahlungsbetrag, wird die Prüfung automatisch genehmigt. Bei automatischer Genehmigung erhält die Prüfung ebenfalls direkt den Status „genehmigt“. Bei manueller Genehmigung von Over- oder Undermileage wird nach 30 Tagen automatisch eine Entscheidung getroffen.

Wird ein Vertrag gekündigt oder läuft er aus und ist ihm ein Produkt mit einem Profil für Unter- oder Überschreitung der Laufleistung zugeordnet, wird der Zahlungsbetrag in der Vertragsprüfung angezeigt. Die Vertragsprüfung kann auch für abgelaufene Verträge ausgelöst werden, wobei die Historie anzeigt, dass die Prüfung läuft. Bei gekündigten Verträgen kann sie innerhalb von 90 Tagen nicht erneut ausgelöst werden.

Werden bei einer Vertragsprüfung die Fahrzeugdaten nicht aus MIC abgerufen und eine höhere Laufleistung als die zuletzt an i156 gesendete eingetragen, wird die tatsächliche Laufleistung bei Vertragsende aktualisiert. Auch der Fall einer geringeren Laufleistung sowie der Fall, dass alle Fahrzeugdaten aus MIC abgerufen werden, sind abgedeckt.

Auf der Seite „Operative Review“ stehen zudem Such- und Sortierfunktionen zur Verfügung.