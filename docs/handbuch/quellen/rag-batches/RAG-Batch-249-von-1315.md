# Batch 249 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Ausgangsdatei E169 an NACOS (Revenue Management)**

Damit ein Kunde eine Rechnung bezahlen kann, muss diese erzeugt und an den Kunden versendet werden. Erzeugung, Versand und die Prüfung des Zahlungseingangs übernimmt das Finanzsystem, in diesem Fall NACOS. Die Informationen für die Rechnungserstellung übergibt oneSCM in einer Datei mit festgelegter Struktur und strengen Regeln an NACOS. Diese Datei heißt E169 OUTBOUND (oder EXPORT). Es handelt sich um eine Textdatei mit der Kodierung UTF-8. Der Dateiname lautet E169EXP_YYYYMMDD_HHmmSS.dat. Der Ablagepfad im S3-Bucket steht noch nicht fest.

Die Datei wird einmal pro Monat an NACOS gesendet oder dann, wenn ein Benutzer der Marktorganisation die Erzeugung anstößt. Die manuelle Anforderung folgt zu einem späteren Zeitpunkt. Der Startzeitpunkt des Batch-Jobs ist konfigurierbar. Für das MVP ist vorgesehen, den Job jeweils am 15. eines Monats auszuführen. Der Batch-Job erfasst alle Rechnungsanforderungen mit dem Status „Accepted“ und nimmt sie in die E169-Datei auf. Sobald diese Informationen in der Datei gespeichert sind und die Datei erfolgreich in den AWS-Bucket übertragen wurde, wechseln die Rechnungen in den Status „Exported“. Im Zuge dieses Prozesses und der Statusänderung wird eine Processing Number erzeugt und in die Datei übernommen. Nach der Ausführung des Batch-Jobs wird außerdem das FI-System Transfer Date aktualisiert und auf das Datum der Batch-Ausführung gesetzt. Ein Benutzer der Marktorganisation kann die erzeugte Datei im AWS-Bucket einsehen.

**Aufbau der Datei**

Die Datei enthält verschiedene Satzarten mit jeweils eigenem Zweck. Der erste Satz der Datei ist „K“. „INIT“ enthält die Angaben zum sendenden System und markiert den Beginn einer neuen Rechnung für den Kunden. Ein INIT-Satz kann eine oder, bei Sammelrechnungen (folgen später), mehrere Rechnungsanforderungen umfassen. „HEADER“ bildet den Kopf jeder verarbeiteten Rechnung. „HTXT01“ enthält allgemeine Informationen zur Rechnungsstellung, „HTXT02“ allgemeine Informationen zu den Kontaktdaten im Zusammenhang mit der Rechnung und „HTXT06“ die rechtlichen Angaben bzw. Unterschriften. „HDRPAR“ enthält die Kunden- bzw. Zahlerdaten, „POS“ die rechnungsbezogenen Details und „PTXT01“ den Rechnungstext. Einige Felder, deren Mapping noch nicht abschließend geklärt ist, sind mit „TBD“ gekennzeichnet. Weitere Details zur Struktur stehen im Confluence-Dokument zu den E169-Mapping-Regeln.

**Satzart K**

Der Satz K hat 96 Zeichen. Fest vorgegeben sind der Satztyp „K“, der Mandant 010, der Buchungskreis 0080, das sendende Werk 080, die Niederlassungsnummer des Rechnungsstellers 268, das Subjekt 169 und die Schnittstellenbezeichnung E169. Das Feld „Operation“ besteht aus zwei Leerzeichen. Beginn und Ende des Buchungsmonats werden jeweils mit dem Exportdatum im Format YYYYMM gefüllt, das Erstellungsdatum für den Buchungsbeleg mit dem Exportdatum im Format YYYYMMDD, jeweils zum Zeitpunkt der Dateierzeugung. Das Verarbeitungsdatum bleibt leer (acht Leerzeichen). Die Anzahl der Sätze in der Lieferdatei ergibt sich aus der Zählung aller Zeichen der Datei einschließlich der Zeile „K“. Das Feld für die Dateinummer (Sequenznummer der SAP-Lieferdatei) ist noch nicht belegt, ein weiteres 30-stelliges Feld bleibt leer.

**Satzart INIT**

Der Satz INIT hat 21 Zeichen und enthält ausschließlich feste Werte: den Satztyp INIT, das sendende System 1SCM, die Datenart 1SCM, die Niederlassungsnummer des Rechnungsstellers 268 (wie in „K“) und die Betriebsnummer 00.

**Satzart HEADER**

Der Satz HEADER hat 62 Zeichen. Die Rechnungsidentifikation entspricht der Processing Number, die pro Markt eindeutig vergeben wird. Die Geschäftsvorfallart ist fest „E“ und steht für die reguläre Fakturierung (Rechnungen an Dritte) sowie externe Subventionen. Der Auftragstyp ist nicht relevant, muss aber enthalten und leer sein. Die Niederlassungsnummer des Rechnungsstellers ist 268, die Betriebsnummer 00. Dabei steht 00 für Servicevertrag (für das MVP sind nur Servicevertäge relevant), 03 für Garantie und 06 für SIVECO. Das Belegdatum und das Datum der Datenübergabe an SAP entsprechen dem Exportdatum im Format YYYYMMDD. Als Benutzer wird SERINKE eingetragen, der Exporttyp ist EXTSUB. Ein weiteres vierstelliges Feld bleibt leer.

**Satzarten HTXT01 und HTXT02**

Beide Satzarten haben 255 Zeichen und enthalten den Satztyp sowie die Processing Number als Rechnungsidentifikation. HTXT01 enthält den Kopftext zur Buchung (238 Zeichen), der aus dem Produkt des Vertrags abgeleitet wird. Für das Produkt Excellent lautet er sinngemäß: Die Berechnung des Vertrags Excellent (ehemals Complete) erfolgt entsprechend der vertraglich vereinbarten Zahlungsweise (einmalig, halbjährlich, vierteljährlich im Voraus bzw. monatlich) für volle Monate. Bei einem Vertragsbeginn vor dem 16. des Monats erfolgt die Berechnung inklusive des laufenden Monats, bei einem Vertragsbeginn nach dem 15. für den Folgemonat, und dies wird am Ende der Laufzeit entsprechend berücksichtigt. HTXT02 enthält den Schlusstext zur Buchung (238 Zeichen) aus dem Produkt. Für Excellent verweist er auf den Ansprechpartner im Kundenmanagement per Telefon und E-Mail und informiert gewerbliche Kunden über die Möglichkeit, Rechnungen und Gutschriften elektronisch zu erhalten, mit Verweis auf die Registrierung über das E-Invoicing-Portal von Mercedes-Benz. In beiden Texten wird „|“ als Trennzeichen für neue Absätze verwendet. Überschreitet ein Text 238 Zeichen, wird er auf mehrere HTXT01- bzw. HTXT02-Sätze aufgeteilt.

**Satzart HTXT06**

Der Satz HTXT06 hat 89 Zeichen. Er enthält den Satztyp, die Processing Number, die linke Unterschrift (28 Zeichen), ein leeres Trennfeld (16 Zeichen) und die rechte Unterschrift (28 Zeichen). Für Excellent lauten die Unterschriften „gez.i.V.Carsten Blendow“ links und „gez.i.V. Silke Becker“ rechts. Die Unterschriftstexte für die übrigen Produkte müssen noch mit dem Fachbereich abgestimmt werden.

**Satzart HDRPAR**

Der Satz HDRPAR hat 199 Zeichen und enthält die Kunden- bzw. Zahlerdaten: Processing Number, SAP-Debitorennummer, Vorname (NAME1), Nachname (NAME2), Straße mit Hausnummer, Postleitzahl, Ort und Ländercode. Die Felder Titel und ZTerm bleiben leer. Jede Position entspricht einer Rechnungsanforderung mit dem Status „Accepted“. Bei Sammelrechnungen werden mehrere Rechnungsanforderungen unter derselben Processing Number zusammengefasst.

**Satzart POS**

Der Satz POS hat 167 Zeichen. Er enthält die Processing Number, die oneSCM-Rechnungsnummer als Identifikation der Rechnungsposition und die Vertragsart (siehe HEADER). Die SAP-Materialnummer ist fest mit „QEV 111 AB5IG3“ belegt (fester Wert für PI1). Der Fahrzeugtyp bleibt leer. Die FIN/VIN stammt aus dem Fahrzeug. Das Kennzeichen für Rechnung oder Gutschrift wird aus dem Rechnungstyp abgeleitet: R steht für Rechnung, G für Gutschrift. Der Betrag ist der Nettobetrag multipliziert mit 100 (aus 12,34 wird 1234, aus 1234,00 wird 123400). Hinzu kommen die Währung als ISO-Code und das Leistungsdatum, das aus dem Vertragsbeginn abgeleitet wird. Das Leistungsdatum bezeichnet den Zeitpunkt, zu dem der Rechnungssteller die Leistung erbracht hat. Es ist mit der Steuerabteilung abgestimmt und bei zeitbasierten Verträgen an den Abrechnungszeitraum gekoppelt. Bei halbjährlicher Zahlung (01.01. bis 30.06.) ist es der 30.06., in der folgenden Abrechnungsperiode der 31.12. Die Felder für kurzfristige Vermietungen, sendende und empfangende Kostenstelle, sendenden und empfangenden Auftrag sowie die Leistungsart bleiben leer. Die Einheiten sind fest 1, die Mengeneinheit fest „ST“ (Stück). Das Baumuster ergibt sich aus den Stellen 4 bis 10 der FIN.

**Satzart PTXT01**

Der Satz PTXT01 hat 243 Zeichen und enthält die Processing Number, die oneSCM-Rechnungsnummer sowie einen systemseitig erzeugten Text (216 Zeichen). Dieser enthält die Fahrzeugnummer, FIN/VIN, das Kennzeichen, den Abrechnungszeitraum (von/bis) und die Steuerinformation. Jedes Produkt hat einen eigenen Steuersatz. Inspektionen, die von Dritten ausgeführt werden, erhalten beispielsweise 0 % Steuer. Das System muss den Steuersatz erkennen und für die Summe der steuerpflichtigen Beträge ausweisen, auf welcher Basis des aufgelaufenen Nettobetrags (z. B. 66,12 EUR bei 19 %) die Steuer ermittelt wurde. Die FMS-Fahrzeugnummer ist das Hauptidentifikationsmerkmal des Fahrzeugs, da ein Kunde unter einem Vertrag viele Fahrzeuge haben kann. Das Kennzeichen ist eine zusätzliche Information für den Kunden und nach Angabe des Teams handelsrechtlich für die Rechnungsstellung verpflichtend. Abrechnungszeitraum und Leistungserstellungsdatum sind steuerrechtlich verpflichtend und werden aus den Rechnungsdaten abgeleitet, beim Leistungserstellungsdatum mit einer speziellen Logik. Ein Beispieltext lautet: „Fahrzeugnr. -G72193- FIN/VIN, Kennzeichen, Abrechnungszeitraum 19.01.2023 - 31.12.2023, Umsatzsteuer 19,00% aus 190,30 EUR (17,30 EUR/Monat)“. Ob die Fahrzeugdaten aus dem dem Vertrag zugeordneten Fahrzeug gezogen werden, ist noch zu klären.

**Vergleichsbeispiel**

Als Vergleich kann eine Beispieldatei aus dem System FMS21 herangezogen werden. Dort heißt die entsprechende Datei E125.