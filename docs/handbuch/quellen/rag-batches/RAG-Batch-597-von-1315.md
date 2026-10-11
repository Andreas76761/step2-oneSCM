# Batch 597 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung**

Beim Anlegen eines Servicevertrags sind die Kunden- und die Zahlungsinformationen für Privatkunden jetzt auf zwei getrennte Schritte verteilt. Auf der Seite „Kundeninformationen" finden sich weiterhin die Bereiche Kundeninformationen, Adressdaten, Präferenzen, Mercedes me und Händlerdaten. Neu hinzugekommen ist der Bereich „Steuer- und Rechtsdaten" mit den Angaben zu Steuer- und Rechtsdetails sowie zur juristischen Person. Mit einem Klick auf „Weiter" wird der Kunde in oneSCM angelegt und erhält eine Kundennummer. Erteilt der Kunde die Erlaubnis zur Nutzung seines Mercedes me Accounts, wird dessen CIAM-ID mit der oneSCM-Kundennummer verknüpft, und die Kreditkarte steht als Zahlungsart für diesen Kunden zur Verfügung.

Auf der neuen Seite „Zahlungsinformationen" wählen Sie die Zahlungsart. Zur Auswahl stehen Kredit-/Debitkarte, wobei die Mercedes me Authentifizierung und die MPay-Schritte unverändert ablaufen, sowie Lastschrift mit unverändertem Verhalten. Der Info-Bereich und die Anzeige der Forderungen aus dem FI-System bleiben wie bisher. Die Zahlungsinformationen werden in der Datenbank als eigenes Objekt behandelt. Dadurch können Kunden, die der Nutzung ihres Mercedes me Accounts zugestimmt haben, bereits beim ersten Servicevertrag per Kreditkarte zahlen. Bisher war das erst ab dem zweiten Vertrag möglich.

Auch bei der Pflege der Kundendaten gab es Verbesserungen. Die Umsatzsteuer-Identifikationsnummer ist für Privatkunden kein Pflichtfeld mehr und wurde für Privatkunden in allen Märkten entfernt, damit dadurch keine Fehler mehr auftreten. Bei der USt-IdNr. sind nun zusätzlich zum Länderkürzel „DE" elf Ziffern zulässig, sodass auch längere reale Nummern erfasst werden können. Händlerbenutzer können außerdem die IBAN eines neuen Privatkunden wieder eingeben. Die Aktion „Customer Account Center" steht nun für alle Kunden zur Verfügung. Zudem wurde die Historie angepasst: Die Zuordnung wird dort von „legalEntity" auf „division" umgestellt, und zwar im Frontend.

Für gewerbliche Kunden wurde ein Fehler behoben, bei dem ein Gewerbekunde im Markt Indien während der Vertragserstellung nicht gefunden wurde.

Im Bereich Schnittstellen und Signatur sind die Behandlung der IBAN mit SAP-Debitor zwischen oneSCM und oneERP in beiden Richtungen sowie der Signaturprozess über die DSS-v2-API für Gewerbe- und Privatkunden produktiv im Einsatz.

Außerhalb von Deutschland lassen sich Mercedes me Profile nun ebenfalls anlegen, sofern der Kunde dem zustimmt. Dies gilt beispielsweise für die Schweiz und Tschechien. Bislang war das nur im deutschen Markt möglich.

Bei der Händlerverwaltung wird anstelle des Brand Codes künftig die Warranty ID verwendet. Der Brand Code ist weltweit nicht eindeutig, da jeder Markt ihn selbst pflegt und ähnliche Codes in verschiedenen Märkten vorkommen können. Die Warranty ID setzt sich aus Ländercode und VEGA-ID des Händlers zusammen und wird über die External Keys API abgerufen. Für ein GS-Outlet wird anhand der Outlet-ID die Warranty ID ermittelt. In der Tabelle der Händlerverwaltung wird die daraus abgeleitete VEGA-ID angezeigt. Die vollständige Warranty ID ist dort nicht nötig, da die Tabelle marktindividuell geführt wird. Bei der Registrierung eines Händlers wird die VEGA-ID ebenfalls aus der Warranty ID gewonnen.