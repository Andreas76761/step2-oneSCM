# Batch 293 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Ausgangsdatei E169 an NACOS**

Damit ein Kunde eine Rechnung bezahlen kann, muss diese erzeugt und an ihn versendet werden. Erstellung, Versand und die Prüfung des Zahlungseingangs übernimmt das Finanzsystem, in diesem Fall NACOS. Die Informationen für die Rechnungserstellung übermittelt oneSCM an NACOS in einer Textdatei mit festgelegter Struktur und strikten Regeln. Diese Datei heißt E169 OUTBOUND (auch E169 EXPORT) und ist UTF-8-kodiert. Der Dateiname lautet E169EXP_YYYYMMDD_HHmmSS.dat. Der Ablagepfad im S3-Bucket steht noch nicht fest.

Die Datei wird einmal pro Monat an NACOS übermittelt. Eine manuelle Anforderung durch einen Market-Operation-Benutzer ist für einen späteren Zeitpunkt vorgesehen. Der Startzeitpunkt des Batch-Jobs ist konfigurierbar. Für das MVP läuft er jeden Monat am 15. Der Batch-Job erfasst alle Rechnungsanforderungen im Status „Accepted“ und nimmt sie in die E169-Datei auf. Sobald die Informationen in der Datei gespeichert und die Datei erfolgreich in den AWS-Bucket übertragen wurde, wechseln die Rechnungen in den Status „Exported“. Im Zuge dieses Prozesses und des Statuswechsels wird eine Processing Number erzeugt und in die Datei übernommen. Nach der Ausführung des Batches wird außerdem das Feld „FI-System Transfer Date“ mit dem Datum der Batch-Ausführung aktualisiert. Ein Market-Operation-Benutzer soll die erzeugte Datei im AWS-Bucket einsehen können.

**Aufbau der Datei**

Die Datei besteht aus mehreren Satzarten mit jeweils eigenem Zweck. Der Satz K bildet die erste Zeile der Datei. INIT enthält Angaben zum sendenden System. HEADER ist der Kopf jeder verarbeiteten Rechnung. HTXT01 enthält allgemeine Informationen zur Rechnung, HTXT02 allgemeine Informationen zu den Kontaktdaten in Bezug auf die Rechnung und HTXT06 die rechtlichen Angaben samt Unterschriften. HDRPAR enthält die Kunden- bzw. Zahlerdaten, POS die rechnungsbezogenen Details und PTXT01 den Rechnungstext. Einzelne Felder der Zuordnung sind noch nicht final und mit „TBD“ markiert. Die ausführliche Beschreibung der Struktur findet sich in der Mapping-Dokumentation zu E169 im Confluence.

**Satzart K**

Der Satz K hat 96 Zeichen. Er enthält überwiegend feste Werte: Mandant 010, Buchungskreis 0080, sendendes Werk 080, Betriebs- bzw. Filialnummer des Rechnungsstellers 268, Thema 169 und die Schnittstellenbezeichnung E169. Das Feld „Operation“ besteht aus zwei Leerzeichen. Beginn und Ende des Buchungszeitraums werden mit dem Exportdatum im Format YYYYMM gefüllt, das Erstellungsdatum des Buchungsbelegs mit dem Exportdatum im Format YYYYMMDD, jeweils zum Zeitpunkt der Dateierzeugung. Das Verarbeitungsdatum bleibt leer (acht Leerzeichen), ebenso das Feld mit 30 Zeichen. Die Anzahl der Sätze in der Lieferdatei umfasst auch die Zeile „K“ selbst.

**Satzart INIT**

INIT markiert den Beginn einer neuen Rechnung für den Kunden und kann eine oder, bei Sammelrechnungen (folgen später), mehrere Rechnungsanforderungen enthalten. Der Satz hat 21 Zeichen und besteht aus festen Werten: Satzart INIT, sendendes System 1SCM, Datenart 1SCM, Betriebsnummer 268 und Zusatz 00.

**Satzart HEADER**

Der HEADER hat 62 Zeichen. Die Rechnungsidentifikationsnummer ist die Processing Number, die je Markt eindeutig erzeugt wird. Die Geschäftsvorfallart ist fest „E“ (reguläre Rechnungsstellung für Dritte sowie externe Subventionen). Der Auftragstyp ist nicht relevant, muss aber enthalten und leer sein. Die Nummer des Rechnungsstellers ist 268, die Betriebsnummer 00. Dabei steht 00 für Serviceverträge (nur diese sind für das MVP relevant), 03 für Garantie und 06 für SIVECO. Belegdatum und Übertragungsdatum entsprechen dem Exportdatum im Format YYYYMMDD. Als Benutzer ist SERINKE hinterlegt, der Exporttyp lautet EXTSUB. Ein weiteres Feld mit vier Zeichen bleibt leer.

**Satzarten HTXT01, HTXT02 und HTXT06**

HTXT01 und HTXT02 haben jeweils 255 Zeichen und enthalten neben der Processing Number den Kopftext bzw. den Schlusstext der Buchung mit je 238 Zeichen. Beide Texte stammen aus den Produktinformationen des Vertrags. Absätze werden durch das Trennzeichen „|“ gekennzeichnet. Ist ein Text länger als 238 Zeichen, wird er auf mehrere Sätze aufgeteilt. Für das Produkt Excellent (ehemals Complete) erläutert der Kopftext die Berechnung entsprechend der vertraglich vereinbarten Zahlungsweise (einmalig, halbjährlich, vierteljährlich im Voraus bzw. monatlich) für volle Monate. Bei einem Vertragsbeginn vor dem 16. des Monats erfolgt die Berechnung inklusive des laufenden Monats, bei einem Beginn nach dem 15. für den Folgemonat, was am Ende der Laufzeit entsprechend berücksichtigt wird. Der Schlusstext für Excellent verweist bei Fragen auf den Ansprechpartner im Kundenmanagement und informiert gewerbliche Kunden über die Möglichkeit, Rechnungen und Gutschriften elektronisch zu erhalten, wofür eine Registrierung auf der Website von Mercedes-Benz E-Invoicing erforderlich ist.

HTXT06 hat 89 Zeichen und enthält die linke und die rechte Unterschrift auf der Rechnung mit je 28 Zeichen, getrennt durch ein leeres Trennfeld mit 16 Zeichen. Für Excellent lauten sie „gez.i.V.Carsten Blendow“ und „gez.i.V. Silke Becker“. Die Unterschriftstexte der übrigen Produkte müssen noch mit dem Fachbereich geklärt werden.

**Satzart HDRPAR**

HDRPAR hat 199 Zeichen und enthält die Kundendaten: SAP-Debitorennummer (Customer.SAP Debit Number), NAME1 (Vorname), NAME2 (Nachname), Straße mit Hausnummer, Postleitzahl, Ort und ISO-Ländercode. Die Felder Titel und ZTerm bleiben leer. Jede Position entspricht einer Rechnungsanforderung im Status „Accepted“. Bei Sammelrechnungen werden mehrere Rechnungsanforderungen unter derselben Processing Number zusammengefasst.

**Satzart POS**

POS hat 167 Zeichen und enthält die rechnungsbezogenen Details. Dazu gehören die Processing Number, die oneSCM-Rechnungsnummer als Identifikation der Rechnungsposition, die SAP-Materialnummer als Festwert (QEV 111 AB5IG3, fest für PI1) und die FIN. Das Kennzeichen „Rechnung oder Gutschrift“ wird aus dem Rechnungstyp abgeleitet: R steht für Rechnung, G für Gutschrift. Der Betrag ist der Nettobetrag multipliziert mit 100 (aus 12,34 wird 1234, aus 1234,00 wird 123400). Hinzu kommen die ISO-Währung und das Leistungsdatum, das aus dem Vertragsbeginn abgeleitet wird. Es legt fest, zu welchem Zeitpunkt der Rechnungssteller die Leistung erbracht hat, und ist mit der Steuerabteilung abgestimmt. Bei zeitbasierten Verträgen ist es an den Abrechnungszeitraum gekoppelt. Bei halbjährlicher Zahlung (01.01.–30.06.) ist es beispielsweise der 30.06., im folgenden Zeitraum der 31.12. Die Einheiten sind fest 1, die Mengeneinheit ist ST (Stück). Das Baumuster wird aus den Stellen 4 bis 10 der FIN abgeleitet. Fahrzeugtyp, kurzfristige Vermietung, Kostenstellen, Aufträge und Leistungsart bleiben leer.

**Satzart PTXT01**

PTXT01 hat 243 Zeichen. Der Text mit 216 Zeichen wird systemseitig erzeugt und enthält Fahrzeugnummer, FIN/VIN, Kennzeichen, Abrechnungszeitraum und Steuerinformationen. Jedes Produkt hat einen eigenen Steuersatz. Inspektionen, die von Dritten ausgeführt werden, erhalten beispielsweise 0 % Steuer. Das System ermittelt den Steuersatz und weist für die Summe der steuerpflichtigen Beträge aus, auf welcher Basis des aufgelaufenen Nettobetrags die Steuer bestimmt wurde. Die FMS-Fahrzeugnummer ist das Hauptidentifikationsmerkmal des Fahrzeugs, da ein Kunde unter einem Vertrag viele Fahrzeuge haben kann. Das Kennzeichen dient dem Kunden als zusätzliche Information und ist nach Einschätzung des Teams handelsrechtlich für die Rechnungsstellung verpflichtend. Abrechnungszeitraum und Leistungserstellungsdatum sind steuerrechtlich verpflichtend und werden aus den Rechnungsdaten bzw. über eine spezifische Logik abgeleitet. Ein Beispieltext lautet: „Fahrzeugnr. -G72193- Kennzeichen -[Kennzeichen entfernt]- Abrechnungszeitraum 19.01.2023 - 31.12.2023 Umsatzsteuer 19,00% aus 190,30 EUR (17,30 EUR/ Monat)“.