# Batch 394 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**SEPA-Mandat im Vertragsprozess**

In der Vorlagenverwaltung (Template Management) lässt sich eine Vorlage für das SEPA-Mandat nach dem Style Guide von Mercedes-Benz anlegen. Sie gilt für Privat- und Gewerbekunden und kann von der Marktvertretung an die Anforderungen des jeweiligen Marktes angepasst werden. Zur Einrichtung sind folgende Angaben erforderlich: Vorlagenname (Sepa Mandate), Markt, Verwendungszweck (Vertragsangebot und Vertragsaktivierung), Kundentyp (Mehrfachauswahl aus Privat und Gewerblich) sowie das Datum „Gültig ab“. Optional können Division und Sprache angegeben werden. Die Sprache wird aus der Marktkonfiguration übernommen. Die Vorlage steht ab dem hinterlegten Gültigkeitsdatum zur Verfügung. Im Vertragsangebot wird das SEPA-Mandat mit einem Entwurfs-Wasserzeichen versehen.

Der Style Guide legt Kopfzeile mit MB-Stern-Logo, die Wortmarke „Mercedes-Benz“, Typografie, Satzspiegel und Fußzeile fest. In der Vorlage werden Druckvariablen verwendet, etwa Name des Kontoinhabers, Firmenname, USt-IdNr., Adresse, E-Mail, IBAN, BIC, Bankname und Gläubiger-/Lastschriftcode. Sie werden durch die Daten aus der Vertragserstellung ersetzt, sofern diese vorliegen. Das Dokument ist außerdem für die Signatur über DSS vorbereitet, sowohl on premise als auch in der Cloud-Variante. Alle Vertragsvorlagen müssen so konfiguriert sein, dass das SEPA-Dokument angehängt wird. Liegt für den Kunden bereits ein SEPA-Lastschriftcode vor, wird das SEPA-Mandat nicht erneut zur Unterschrift versendet.

**Unterschriftsmethode und Dokumentenbereitstellung**

Bestätigt der Kunde im Vertragsprozess die eingegebenen Daten und entscheidet sich zu unterschreiben, werden ihm unabhängig von der gewählten Unterschriftsmethode alle Dokumente bereitgestellt: der Servicevertrag mit angehängtem SEPA-Mandat sowie die Allgemeinen Geschäftsbedingungen. Beim Druck werden diese Dokumente zu einer einzigen PDF-Datei zusammengeführt. Bei der Signatur über DSS werden sie als mehrere Dokumente versendet.

Die Datei des Servicevertrags heißt nun „Service_Contract_Request_…“ statt „Service_Contract_…“. Aus „Service_Contract_N2V5TUOQ_DE24PE.pdf“ wird also „Service_Contract_Request_N2V5TUOQ_DE24PE.pdf“.

**Änderungen im Ablauf und Export an NACOS**

Der bisherige Schalter für die SEPA-Zustimmung (SEPA Consent) wurde in der gesamten Anwendung entfernt. Nach der Unterschrift wird das signierte SEPA-PDF gemeinsam mit der Excel-Datei für DSS und für die On-Premise-Variante in eine ZIP-Datei aufgenommen. Wurde der Export neuer Kunden an NACOS bereits zum Download bereitgestellt, wird das Dokument in die aktualisierte NACOS-Exportdatei (Export_oneSCM_CMD_UPDATED) eingefügt. In der Exportdatei wird in der Spalte „REMARKS“ der Name des signierten SEPA-PDFs eingetragen, damit der NACOS-Anwender erkennen kann, welcher Kunde aus der Excel-Datei das Dokument unterschrieben hat. In der Datei Export_oneSCM_CMD_CREATED gibt es zusätzlich die Spalte „SEPA existing?“.

Hinweis: Die Hilfefunktion auf der Startseite (Support-Schaltfläche) wurde nicht umgesetzt, da das zugehörige Ticket geschlossen wurde. Sie ist daher nicht Teil dieser Beschreibung.