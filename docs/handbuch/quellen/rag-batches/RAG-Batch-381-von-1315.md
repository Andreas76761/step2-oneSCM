# Batch 381 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Massenerstellung von Verträgen: Dokument- und E-Mail-Vorlagen sowie DSS-Umschläge**

Mit der Massenerstellung können Sie für einen Kunden mit mehreren Fahrzeugen (einer Flotte) Serviceangebote bzw. Serviceverträge in einem Vorgang anlegen. Der Kunde erhält zur Unterschrift eine Übersichtsseite sowie ein SEPA-Mandat. Die einzelnen Serviceverträge müssen dem Kunden nicht separat zur Unterschrift zugesandt werden. Unterschrieben wird nur die Übersichtsseite. Für die Massenerstellung ist eine Vorlage mit Wasserzeichen für die Vorschau und eine Vorlage zur Unterschrift durch den Kunden vorgesehen. Der QR-Code auf den Massenerstellungsdokumenten enthält die Gruppen-ID und den Dokumenttyp. Die Unterschrift erfolgt im DSS-Prozess (Digital Signature Service), die Übersichtsseite wird dabei in einem eigenen DSS-Umschlag versendet, die übrigen Dokumente (z. B. SEPA-Mandat, AGB) folgen dem üblichen Prozess. Bei der Bestätigung steht ausschließlich DSS zur Verfügung.

**Dokumentvorlagen**

Im Bereich Dokumente können Sie eine Vorlage vom Typ „Vertrag“ für die Massenerstellung anlegen. Dafür stehen neue Anwendungsfälle in der Auswahlliste zur Verfügung, darunter „Mass Creation Confirmation“ und „Mass Creation Proposal“. Zusätzlich gibt es die neue Kategorie „Mass Creation“ für Druckvariablen.

Für die Massenerstellung werden im Prozess der Vertragserzeugung drei neue Attribute eingeführt, die auch in den Vorlagen verfügbar sein müssen. Unter „Druckvariablen > Vertrag“ in den Dokument- und E-Mail-Vorlagen stehen deshalb neue Druckvariablen bereit, die Sie in den benötigten Druckdokumenten verwenden können:

Die Variable Group ID (%GroupID%) übernimmt ihren Wert aus der Vertragserzeugung (Feld „Group ID“). Die Gruppen-ID ist eine vom Vertrag gesetzte Nummer, zum Beispiel 12345/DE25PA. Die Variable Number of Contracts (%NrOfContracts%) entspricht der Anzahl der bei der Erzeugung angegebenen FINs/VINs. Die Variable Mass Total Price (%MassTotalPrice%) ergibt sich aus dem Preis des Vertrags, multipliziert mit der Anzahl der FINs/VINs in der Erzeugung. Bisher wurde zur Identifikation des erzeugten Vertrags die Variable „Reference Number“ genutzt. Da nur ein einzelner Vertrag erzeugt wurde, war eine Variable für die Vertragsanzahl nicht nötig.

Die Übersichtsseite der Massenerstellung (Mass Contract Summary) enthält Kundendetails mit Gruppen-ID, Anzahl der Fahrzeuge und Gesamtpreis des Vertrags (%MassTotalPrice%). Hinzu kommen Informationen zum gewählten Produkt (Produktname, Vertragslaufzeit, Laufleistung, Zahlungsintervall) und Fahrzeugdetails (Kennung, FRD, Kennzeichen; weitere Angaben wie beim Einzelfahrzeugvertrag). Außerdem enthält sie Beispiel-Zahlungsdetails je Fahrzeug (%ChassisNo%) und das Feld für die Kundenunterschrift.

**E-Mail-Vorlagen**

Im E-Mail-Vorlagenbereich können Sie neue E-Mail-Vorlagen anlegen und dabei die neuen Anwendungsfälle „Mass Creation Confirmation“ und „Mass Creation Activation“ auswählen. Die Variablen %GroupID%, %NrOfContracts% und %MassTotalPrice% können verwendet werden.

Die Bestätigungs-E-Mail wird bei der Bestätigung an den Kunden gesendet. Ihr Betreff lautet „Service Contract Proposal Confirmation (GroupId: groupID)“. Die inhaltliche Gestaltung (Kopfbereich, Inhalt, Fußbereich, Produktdetails, grundlegende Fahrzeugkonfiguration, Tabelle aller enthaltenen Fahrgestellnummern) wird vom Geschäftsbereich definiert.

Die Aktivierungs-E-Mail ist eine Statusbenachrichtigung zum Servicevertrag. Der Betreff ist in den Rohdaten nicht einheitlich: einmal „Service Contract Status Update (GroupId: groupID)“, in den Abnahmekriterien „Service Contract Activation (GroupId: groupID)“. Der Versand erfolgt täglich zu einem festgelegten Zeitpunkt (z. B. werktags zu einer bestimmten Uhrzeit) als Sammelmail über alle an diesem Tag (bzw. seit der letzten Benachrichtigung) aktivierten oder abgelehnten Verträge. Sie enthält:

Eine Nachricht zum Fortschritt der Vertragsaktivierung sowie eine Fahrzeugübersicht in Tabellenform, ähnlich der Tabelle in der Bestätigungs-/Angebotsvorlage. Diese zeigt Servicevertragsnummer, Kennung (Auftragsnummer oder Fahrgestellnummer), Datum der Erstzulassung, Start- und Enddatum, Kennzeichen und Status (genehmigt/abgelehnt). Zudem enthält die E-Mail einen Link zum Customer Account Center (CAC).

Der Versand läuft von Montag bis Freitag. Verträge, die nach dem Benachrichtigungsschluss am Freitag aktiviert werden, erscheinen in der Benachrichtigung am Montag. Der Mechanismus endet automatisch, sobald alle Serviceverträge einer Gruppen-ID einen Endstatus (aktiv/abgelehnt) erreicht haben. Einzelne Ablehnungs-E-Mails werden bei der Massenerstellung nicht versendet, abgelehnte Verträge erscheinen in der Statusbenachrichtigung.

**Dokumente im Customer Account Center**

Der Ansprechpartner meldet sich im CAC an, um die Dokumente zur Gruppen-ID einzusehen: Angebotsübersicht, Zahlungspläne der aktivierten Verträge und SEPA-Mandat. Die PDF-Dateien können einzeln ausgewählt und heruntergeladen werden. Bei Auswahl mehrerer Dokumente wird eine ZIP-Datei erzeugt. Über eine Schaltfläche „Alle auswählen“ lassen sich alle Dokumente der Gruppen-ID auswählen, auch dann entsteht eine ZIP-Datei. Der Dateiname der ZIP-Datei lautet Documents_GroupID.zip (Beispiel: Documents_D5X7QBWY.zip). Für Zahlungspläne gilt die Namenskonvention Payment_Plan_ServiceContract_Number_GroupID_Number (Beispiel: Payment Plan_D5X7QBWY_DE25PE_54321_DE25PE).

**Preisinformation**

Für das Preisinformationsdokument und die zugehörige E-Mail-Vorlage sind keine Änderungen erforderlich.