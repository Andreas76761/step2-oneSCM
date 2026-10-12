# Batch 1109 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Neuerungen und Änderungen in der Vertragserstellung (Contract Generation)**

Bei der Vertragserstellung wird der Händlerrabatt nun korrekt geprüft. Zuvor war es möglich, für ein Produkt, das auf Produktebene keine Händlerrabatte zulässt, dennoch einen Händlerrabatt einzugeben. Die auf Produktebene erlaubten Rabatte werden jetzt berücksichtigt.

Bei der Vertragsanfrage (Contract Offering) wurde die Anzeige im Kilometerstandfeld angepasst. Wird ein Wert eingegeben, der unter dem zuletzt bekannten DSB-Wert liegt, erscheint weiterhin eine Fehlermeldung mit dem letzten bekannten Kilometerstand. Ist der eingegebene Wert gleich oder höher, wird unter dem Feld nicht mehr der Hinweis „Retrieved mileage: Wert“ angezeigt.

Wenn der Digital Signature Service (DSS) beim Start der Vertragsunterschrift nicht erreichbar ist, wurde bisher lediglich eine Toast-Meldung mit dem Fehler 500 angezeigt. Nun erscheint auf der Seite eine deutlich sichtbare Fehlermeldung: „The Digital Signature Service (DSS) is currently not available. Please try again to initiate the digital signature process for contract xxx/xxx.“ Über die Schaltfläche „See All Contracts“ gelangt man zur Angebotsverwaltung (Offer Management). Über die Schaltfläche „Retry“ lässt sich die digitale Unterschrift erneut auslösen, indem der Dialog mit dem gewünschten Unterschriftsablauf geöffnet wird.

Auf der Prüfseite der Market Operations (MO Checks Verification) wurden zwei ähnliche Prüfungen, „CAS Check“ und „Customer CAS Check“, zu einer einzigen Prüfung zusammengeführt, da es sich um dieselbe Prüfung handelt.

Außerdem wurde die Kunden-ID für VEGA I155 umgestellt. Statt des bisherigen numerischen Formats mit 15 Stellen gilt nun das Format ODE00xxxxxxxxxx.

Bei der Vertragserstellung wird zudem die GSSN+-ID des Autohauses erfasst, dem der Händler zugeordnet ist, der den Vertrag erstellt hat. Die Daten werden im Vertragsobjekt gespeichert und sowohl in der Angebotsverwaltung (Offer Management) als auch in der Vertragsverwaltung (Contract Management) in der Vertragsdetailansicht auf dem Reiter „Vertrag“ im Feld „Contracting Dealer“ angezeigt. Dieses Feld hieß zuvor „Sales Partner ID GSSN+“.

Die Preise optionaler Deckungen im Vertragsdokument werden jetzt abhängig vom Kundentyp festgelegt.

Der Reiter „Kampagne“ wurde angepasst, falls eine Marktkampagne einen Rabatt ausschließlich als Betrag anbietet. Bisher wurden der Prozentsatz und der maximale Rabattbetrag angezeigt. Wird nur ein Betrag angewendet, wird nun dieser angezeigt; sind Betrag und Prozentsatz beide hinterlegt, werden beide dargestellt.

Der Ablauf nach Erreichen des Status „Bestätigt“ (Confirmed) wurde geändert und betrifft alle Abläufe der Vertragserstellung. Zunächst wird nur noch die CAS-Prüfung bei Kunde und Partner angefragt. Ist das Ergebnis positiv, werden die Market Operations informiert (MO Checks) und der Vertrag wird auf „Abgelehnt“ (Rejected) gesetzt. Ist das Ergebnis falsch-positiv, werden die Market Operations ebenfalls informiert und die CAS-Prüfung wird so oft wiederholt, bis das Ergebnis eindeutig negativ oder positiv ist. Ist das Ergebnis negativ, wird der Ablauf fortgesetzt und das SEPA-Mandat sowie die SAP-Debitorennummer werden angefragt. Bisher wurden CAS-Prüfung, SEPA-Mandat und SAP-Debitorennummer gemeinsam angefragt, und die Antworten trafen im Status „Wartet auf Aktivierung“ (Waiting for Activation) ein.

Zu jeder Fahrgestellnummer wird nun die zugehörige Auftragsnummer gespeichert. Sie wird aus der Antwort des Vehicle Management übernommen, im Vertragsobjekt abgelegt und bei Aktivierung des Vertrags an das Revenue Management und das Cost Management übermittelt.

Wählt der Kunde bei der Unterschrift die Option „On Premise“, erscheint ein Bildschirm mit QR-Code und Link. Wurde dieser Bildschirm geschlossen, war es bisher nicht möglich, das Unterschriftsformular erneut aufzurufen. Jetzt wird der Unterschriftslink als „DSS LINK“ im Reiter „Kommunikation“ unter den Benachrichtigungen des Vertrags gespeichert und angezeigt. Händler, MO- und MPC-Benutzer sowie Kunden können darüber die Unterschriftsseite erneut öffnen und die Unterschrift abschließen. Sobald die Kundenunterschrift in den Vertrag übernommen wurde, wird der Link deaktiviert und kann nicht erneut angeklickt werden.

Ergänzend dazu kann ein Vertrag mit E-Signatur-Ablauf, der außerhalb des Systems (On Premise) unterschrieben wurde, nach der Unterschrift über den Reiter „Kommunikation“ hochgeladen werden.

Zusätzlich wurde im Frontend die neue Version der getDocument-API integriert.

Die geplante Entfernung der Kontrollkästchen-Bestätigung der Geschäftsbedingungen („I have read and agree to …“) auf der Übersichts- und Bestätigungsseite wurde nicht umgesetzt. Es bleibt dabei, dass die Geschäftsbedingungen vor der Unterschrift akzeptiert werden müssen.