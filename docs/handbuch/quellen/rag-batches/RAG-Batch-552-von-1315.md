# Batch 552 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung: Änderungen und Erweiterungen**

**Migration von Kundendaten aus Altsystemen**

Für die Märkte Schweiz (CH) und Tschechien (CZ) werden Kundendaten aus den jeweiligen Altsystemen in oneSCM übernommen. Diese Daten stehen ausschließlich lesend zur Verfügung, sie können also nicht bearbeitet werden. Für diese migrierten Kunden lassen sich zudem keine Verträge anlegen. Übernommen wird, was sich aus dem Altsystem abrufen lässt. Es kann daher vorkommen, dass einzelne Daten nicht vollständig vorliegen.

**Anpassungen für den Markt Schweiz (MBCH)**

Steuernummer und Umsatzsteuer-Identifikationsnummer (VAT-ID) lassen sich nun im Schweizer Format erfassen. Zuvor war dies nicht möglich. Außerdem wird die Meldung zur Kundenaktualisierung nicht mehr angezeigt, wenn tatsächlich keine Kundeninformationen geändert wurden.

**SEPA-Mandat und Lastschriftzahlung für MBCH (in Refinement)**

Für den Schweizer Markt weicht der Ablauf für das SEPA-Mandat und die Lastschrift vom Standard ab. Der Prozess wird außerhalb von oneSCM gesteuert. Der bisherige Standardprozess für CoFiCo-Märkte erfüllt die rechtlichen Anforderungen für MBCH nicht. Die Abläufe in oneSCM werden deshalb angepasst, damit die gesetzlichen Vorgaben eingehalten werden. Nutzen werden die Funktion voraussichtlich die Rollen MO, MPC, Dealer und Dealer+, abhängig von den definierten bzw. neuen Rollen.

Das Kundendatenmodell wird um Eingabefelder erweitert, damit das SEPA-Mandatsdokument vorausgefüllt und der SEPA-Ablauf durchgeführt werden kann. Da SwiftRef weder BIC noch Banknamen ableitet, muss der Bankname manuell in oneSCM erfasst werden, sofern er sich nicht aus SWIFTref ermitteln lässt; alternativ wird eine Lösung zur Ableitung aus SWIFT gesucht. Der Bankname wird für das SEPA-Dokument benötigt. Die BIC ist für die Schweiz dagegen nicht relevant und darf den Ablauf nicht blockieren, wenn sie leer ist. Zusätzlich werden neue Felder für Bankort und Postleitzahl der Bank eingeführt, da diese Angaben im SEPA-Dokument erforderlich sind. Die Bankdaten-Eingabe im Kundendatenmodal wird entsprechend angepasst.

Nach dem POST-Request an CoFiCo läuft der Prozess wie folgt ab: Der Kunde druckt das CH/LSV-Dokument aus und sendet es an seine Bank. Die Bank unterzeichnet den Berichtigungsteil und schickt das Mandat an MBCH. Die lokale Buchhaltung fordert die Änderung beim FO-Team an, das die Ausführung bei CoFiCo veranlasst. Das CoFiCo-Team setzt in den Bankdaten des Finanzsystems die Einzugsermächtigung (Collection Authorization) auf „Ja“. Im Synchronisationsprozess wird dieser Wert in oneSCM aktualisiert, sodass der Aktivierungsprozess fortgesetzt werden kann. Solange der Markt keine abweichende Regel bestätigt, sendet oneSCM diese Freigabe nicht im ausgehenden Request mit. Wurde die Einzugsermächtigung noch nicht gesetzt, wird sie also nicht als „Ja“ übermittelt, und der Vertrag unterliegt weiterhin der konfigurierten MBCH-Prüfung.

Für die Einzugsermächtigung gibt es eine MO-Prüfung. Ist die Einzugsermächtigung in den Bankdaten nicht gesetzt, steht die Prüfung auf „NOK“. Hat die Bank den Offline-Prozess abgeschlossen, das CoFiCo-Team die Einzugsermächtigung auf „Ja“ gesetzt und oneSCM den entsprechenden Status aus dem Finanzsystem empfangen, wird die Prüfung auf „OK“ gesetzt. Ein Vertrag wird aktiviert, wenn der POST-Request mit den SEPA-Mandatsdaten gesendet wurde, die CoFiCo-Mandatsreferenz (Direct Debit Code) empfangen und gespeichert wurde und alle SEPA-MO-Prüfungen auf „OK“ stehen, bei MBCH einschließlich der Einzugsermächtigung.

Zusätzlich ist vorgesehen, dass der Markt das von der Bank unterzeichnete SEPA-Dokument hochlädt und die Bankunterschrift geprüft und bestätigt wird. Die genauen Prüfungen, etwa die Erkennung der Unterschrift oder eine Bestätigung durch den MO, dass es sich um das richtige Dokument handelt, sind noch nicht abschließend geklärt.

**Händlerregistrierung bei mehreren Warranty-IDs**

Für einen Händlerstandort können in GSSN+ mehrere externe Schlüssel (Warranty-IDs) vorliegen, etwa je eine pro Division (PC und VAN). Der Schlüssel ist unabhängig von der Division stets derselbe. Haben alle vorhandenen Warranty-IDs denselben Wert, wird der Händler registriert. Unterscheiden sich die Werte, erscheint eine Fehlermeldung, und die Registrierung des Händlers ist nicht möglich.