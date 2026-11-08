# Batch 606 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Hinweis zum Status:** Die zugrunde liegende Funktion trägt den Status „Cancelled". Der folgende Text beschreibt daher den geplanten Funktionsumfang, nicht eine ausgelieferte Funktion. Bitte klären Sie vor einer Aufnahme ins Benutzerhandbuch, ob er überhaupt veröffentlicht werden soll.

**Zahlungsmethode im Customer Account Center ändern**

Das Customer Account Center sollte Endkunden die Möglichkeit geben, die Zahlungsmethode ihrer Servicevertragsprodukte selbst zu ändern, und zwar von Lastschrift auf Kreditkarte oder von Kreditkarte auf Lastschrift. Bisher ist eine solche Änderung nicht möglich. Damit sollten Servicevertragsprodukte den Kunden mehr Flexibilität bieten. Ein Kunde kann für seine Serviceverträge unterschiedliche Zahlungsmethoden nutzen, aber nur eine einzige IBAN. Einige seiner Verträge können also über dieselbe IBAN abgerechnet werden, während andere über eine oder mehrere Kreditkarten laufen.

Voraussetzung ist, dass der Kunde mindestens einen aktiven oder pausierten Servicevertrag hat. Der Kunde meldet sich zunächst bei einem Mitarbeiter, der in der Kundenverwaltung über die Aktion „Change Payment Self Service" in der Aktionsspalte den Prozess anstößt. Der Kunde erhält daraufhin eine E-Mail mit einem Link zum Customer Account Center und authentifiziert sich über einen Einmalcode, den er per Telefon erhält.

**Wechsel von Lastschrift auf Kreditkarte**

Fehlt auf Kundenebene die Mercedes me ID, informiert der Mitarbeiter den Kunden, dass er zuvor ein Mercedes me Profil anlegen und in der Mercedes me App bestätigen muss. Besitzt der Kunde eine CIAM ID, erscheint nach der Anmeldung ein Mercedes me Dialog. Dort kann er einen QR-Code scannen, einem Link zu Mercedes me folgen, einen neuen Code erzeugen lassen oder den Vorgang abbrechen. Das System prüft die CIAM ID und zeigt bei einem Fehler eine Fehlermeldung an, andernfalls geht es weiter. Fehlt die CIAM ID, sieht der Kunde direkt die Vertragsseite. Dort erscheint ein Dialog, dessen Felder vorausgefüllt und nicht bearbeitbar sind. Bestätigt der Kunde ihn, gelangt er zur Mercedes me Authentifizierung. Dabei werden Mercedes me ID und CIAM ID in oneSCM übernommen und gespeichert, wobei das Mercedes me Profil aktiv sein muss. Bei Abbruch kehrt er zur Vertragsseite zurück.

Auf der Vertragsseite sieht der Kunde seine aktiven und pausierten Serviceverträge und kann einen oder mehrere davon auswählen. Über „Change Payment Method" wählt er im Dropdown „Credit Card". Bestätigt er, verlässt er oneSCM und wird zu MPay weitergeleitet. Bei Abbruch bleibt er auf der vorherigen Seite. Nach dem MPay-Prozess ist ein Callback erforderlich, damit eine Erfolgs- oder Fehlermeldung als Toast angezeigt werden kann.

Im Erfolgsfall wird dem Vertrag mitgeteilt, dass die Kreditkarte gespeichert wurde. Eine neue Asset-ID und NTR werden am Vertrag hinterlegt. Das SEPA-Mandat wird automatisch aus dem Dokumenten-Tab der Kundenverwaltung gelöscht. Außerdem wird die Zahlungsmethode im Vertrags-Tab automatisch von Lastschrift auf Kreditkarte umgestellt. Diese Anpassung im Vertrags-Tab sollte laut Rohdaten in einem späteren Programminkrement umgesetzt werden. Zudem sollten Kreditkartendaten und Ablaufdatum der gewählten Verträge aktualisiert werden.

**Wechsel von Kreditkarte auf Lastschrift**

Der Ablauf bis zur Vertragsauswahl entspricht dem oben beschriebenen, einschließlich E-Mail-Link, Einmalcode und Mercedes me Authentifizierung. Der Kunde wählt einen oder mehrere Verträge, klickt auf „Change Payment Method" und wählt „Direct Debit". Nach Bestätigung öffnet sich der Dialog „Account". Dort trägt er die gewünschte IBAN ein. Hat er bereits eine IBAN für einen anderen Servicevertrag, wird diese vorausgefüllt und lässt sich nicht ändern. Die IBAN wird über Swift validiert, und die übrigen Pflichtangaben werden wie in der bestehenden oneSCM-Umsetzung vorausgefüllt. Ist Swift nicht erreichbar, muss der Kunde die Angaben manuell eingeben, die dann validiert werden.

Mit der Bestätigung ersetzt das System die Kreditkarte durch die IBAN. Der Kunde kann den Vorgang mit oder ohne Lastschriftcode abschließen. Anschließend erscheint eine Erfolgsmeldung. Existiert für die IBAN bereits ein SEPA-Mandat in oneERP, wird der Lastschriftcode in oneSCM gespeichert und der Hinweis auf die Unterschrift entfällt. Existiert noch kein Mandat, enthält die Meldung den Hinweis, dass ein SEPA-Dokument zur Unterschrift zugesandt wird.

**Wechsel von einer Lastschrift auf eine andere**

Auch hier gilt, dass ein Kunde über alle Serviceverträge hinweg nur eine IBAN haben darf. Der Ablauf entspricht dem Wechsel von Kreditkarte auf Lastschrift. Die Mercedes me Authentifizierung erfolgt nur, wenn der Kunde eine CIAM ID und eine Mercedes me ID besitzt, andernfalls wird sie übersprungen. Der Kunde kann alle per IBAN bezahlten Verträge auswählen, gibt die neue IBAN ein und bestätigt. Validierung, manuelle Eingabe bei Swift-Ausfall und die Erfolgsmeldung mit oder ohne SEPA-Hinweis funktionieren wie oben beschrieben.