# Batch 836 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Zahlungspflichtigen eines aktiven Vertrags ändern (Change Payer)**

Bisher kann ein abweichender Zahlungspflichtiger (Payer) nur bei der Vertragserstellung hinterlegt werden. Für einen aktiven Vertrag waren keine Änderungen an den Payer-Daten möglich. Mit der neuen Funktion können Benutzer der Market Operations (MO) den Payer eines aktiven Vertrags ändern. Voraussetzung ist, dass der Vertrag den Status „Aktiv“ hat und der Benutzer die MO-Rolle besitzt. Typischerweise wendet sich der Vertragsinhaber an den MO-Benutzer und bittet um die Änderung. Unterstützt werden drei Fälle: Inhaber und Payer sind identisch und es soll ein neuer Payer hinzugefügt werden; der Vertrag hat einen Inhaber und einen abweichenden Payer und es soll ein anderer abweichender Payer hinterlegt werden; oder der Vertrag hat einen Inhaber und einen abweichenden Payer und der Inhaber möchte selbst Payer werden.

Der MO-Benutzer ruft den Vertrag über die Startseite des Vertragsmanagements auf und wählt im Status-Dropdown die neue Option „Change Payer“. Diese Option steht nicht zur Verfügung, wenn eine Payer-Änderung bereits angestoßen, aber noch nicht abgeschlossen wurde, etwa weil die CAS-, SAP- oder SEPA-Prüfungen noch ausstehen. Nach der Auswahl wird der Benutzer zur Seite „Payer Change Details“ weitergeleitet.

**Schritt 1: Payer Change Details**

Im ersten Abschnitt werden die Änderungsdaten erfasst. Das Datum der Payer-Änderung ist ein Pflichtfeld und wird über ein Kalender-Widget gewählt; Datumsangaben in der Vergangenheit sind nicht zulässig. Zusätzlich kann ein optionaler Kommentar mit bis zu 500 alphanumerischen Zeichen eingegeben werden.

Im zweiten Abschnitt wird festgelegt, wer den Vertrag künftig bezahlt. Mit dem Schalter „Add Contract Holder as Payer“ kann der Inhaber als Payer übernommen werden; der Schalter lässt sich nur bedienen, wenn der aktuelle Payer nicht ohnehin der Inhaber ist. Als Pflichtfelder sind Vorname, Nachname, E-Mail-Adresse, Telefonnummer und Sprache (Dropdown) zu füllen. Die Mercedes me ID ist optional. Außerdem gibt es die private USt-ID (Financial Identification Number). Der Kundenstatus wird bei bestehenden Kunden über Customer & Partner abgefragt und angezeigt; bei neuen Kunden erscheint schreibgeschützt „Temporary“.

Existiert der Payer bereits, öffnet sich ein Dialogfenster „Customer Matches“ mit den Schaltflächen „Cancel“ und „Continue“. Dort wählt der Benutzer den passenden Datensatz aus; mit „Continue“ werden dessen Kundendaten in die Seite „Payer & Payer Information“ übernommen. Andernfalls kann der Benutzer die Option „Add a New Customer“ wählen und fortfahren. Über das „X“ lässt sich der Vorgang jederzeit abbrechen.

**Schritt 2: Payer & Payer Information**

Auf dieser Seite werden die Daten des Payers aus dem Customer Management erfasst oder angezeigt. Sie gliedert sich in folgende Bereiche:

Kundendetails: Vorname, Nachname, E-Mail-Adresse, Telefonnummer, Mobilnummer, Partnertyp, private USt-ID und Kundenstatus.

Steuer- und Rechtsdaten: Steuerklassifizierung, Code der Steuerklassifizierung und Rechtsform (Legal Entity).

Forderungen aus dem FI-System: Partnertyp, SAP-Debitorennummer und die Information, ob das FI-System gesperrt ist.

Präferenzen: bevorzugter Händler bzw. bevorzugte Werkstatt.

Marketing-Präferenzen: E-Mail, Telefon und Mercedes me.

Adressdaten: Adresssuche (Google API), Postleitzahl, Ort, Straße, Hausnummer, Adresszusatz und Land.

Zahlungsinformationen: Kontoinhaber (schreibgeschützt), IBAN (Eingabe möglich), Bankname (schreibgeschützt), BIC (schreibgeschützt) und Währung.

Außerdem gibt es Schalter für die SEPA-Mandatszustimmung und für Sammelrechnungen.

**Schritt 3: Übersicht und Bestätigung**

Beim Weitergehen werden die ausgefüllten Felder geprüft. Fehlen Pflichtangaben, wird eine Fehlermeldung angezeigt und der Benutzer zum ersten nicht ausgefüllten Feld von oben nach unten geführt. Anschließend erscheint die Seite „Overview and Confirmation“, deren Felder nicht bearbeitet werden können. Zum Ändern geht der Benutzer über „<“ oder das Bearbeiten-Symbol zurück. Angezeigt werden Vertragsnummer, Produktname, Produktbeschreibung sowie Preis pro Monat und Gesamtpreis (jeweils inkl. MwSt.). Dazu kommen die Payer-Änderungsdaten mit Datum und Kommentar aus Schritt 1 sowie alle in Schritt 2 erfassten Payer-Informationen. Das „X“ bricht den Vorgang ab, „<“ führt zurück zur Seite „Payer & Payment Information“.

Mit der Bestätigung ist die Erfassung abgeschlossen. Es erscheint eine Erfolgsseite mit der Meldung: „Contract Number xxxxxxxx payer details have been successfully submitted for Approval! All parties will be notified via email with the change payer details.“

**Prüfungen im Hintergrund**

Nach der Bestätigung wird Customer and Partner Management angefragt, bei Bedarf den neuen Payer anzulegen und die SAP-Debitorennummer sowie die Gültigkeit des SEPA-Mandats für den neu angelegten Payer zu liefern. Die Wartezeit auf die CAS-Antwort ist marktspezifisch konfigurierbar, zum Beispiel 7 Tage für UK oder 30 Tage für FR. Bleibt die Antwort innerhalb dieser Zeit aus, wird der Vorgang abgebrochen und auf der Seite „MO Intelligence“ für die MO-Prüfung als NOK markiert. Die Benachrichtigung dort wird 14 Tage lang vorgehalten.

Bei der SAP-Prüfung wird bei „OK“ fortgefahren, bei „NOK“ erfolgt ein Hinweis an die MO. Die SEPA-Prüfung läuft genauso. Die CAS-Prüfung wird wie bei der Integration in die Vertragserstellung umgesetzt. Liefert sie den Wert „3“ oder „4“, geht es mit der nächsten Prüfung weiter. Bei „0“ oder „2“ wird die MO benachrichtigt, und unter „MO Checks“ erscheint „CAS Check NOK“ mit dem Grund „False Positive“. Bei „1“ wird der Vertrag beendet (Vega-Statuscode „014“, Grund: CAS Check Positive). Zudem wird die MO benachrichtigt („CAS Check NOK“, Grund „CAS Positive“) und erhält eine E-Mail.

Sind alle Prüfungen in Ordnung, werden Inhaber und Payer per E-Mail über die Änderung informiert, und das Revenue Management wird über die Payer-Änderung des Vertrags benachrichtigt.

**Sonderfall: Inhaber wird zum Payer**

Hat ein Vertrag einen Inhaber und einen abweichenden Payer und möchte der Inhaber selbst Payer werden, kann der Benutzer den Schalter „Add Contract Holder as Payer“ ein- oder ausschalten. Beim Einschalten werden alle Kundendaten des Inhabers in Schritt 1 und, sofern Finanzdaten vorliegen, auch in Schritt 2 vorbefüllt. Sind alle SAP-, SEPA- und CAS-Prüfungen in Ordnung, erscheint die Meldung: „Contract Number xxxxxxxx payer details have been succesfully changed to customer <Firstname> <Lastname>! All parties will be notified via email with the change payer details.“ Andernfalls lautet sie: „Contract Number xxxxxxxx payer details have been successfully submitted for Approval“. In diesem Fall wird eine E-Mail ausschließlich an den Inhaber gesendet, sobald dieser als Payer des Vertrags eingetragen ist.

**Design**

Gestaltung und Grafiken müssen der Mercedes-Benz Workbench entsprechen.