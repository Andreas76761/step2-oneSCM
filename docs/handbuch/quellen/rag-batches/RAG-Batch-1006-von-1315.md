# Batch 1006 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung: Auswahl der Signaturmethode**

Bisher konnten Händler bzw. Marktbetreiber den letzten Schritt der Vertragserstellung, die Bestätigung unter „Übersicht und Bestätigung" (Schritt 3 des Vertragsassistenten), abschließen, ohne dass die Unterschrift des Kunden erfasst wurde. Dies hat sich geändert: Nach dem Klick auf die Bestätigungsschaltfläche öffnet sich nun ein Fenster, in dem Sie die Methode für die Unterschrift des Kunden auswählen. Erst danach geht es mit der Vertragsaktivierung weiter, und der jeweils passende Ablauf wird ausgelöst.

Der Weg dorthin bleibt unverändert: Sie starten die Vertragserstellung, wählen und konfigurieren die Produkte, erfassen die Kunden- und Zahlungsinformationen und gelangen zur Übersicht. Im Auswahlfenster stehen drei Optionen zur Verfügung.

Bei der Option „Digitale Signatur" wird der Dienst „Documents and Communication" aufgerufen, der die Erfassung der Kundenunterschrift über den DSS-Service auslöst. Sobald die Unterschrift erfasst wurde, sendet „Documents and Communication" eine Rückmeldung an oneSCM. Bis zu dieser Bestätigung bleibt der Vertrag im Status „Waiting for Activation". Über „Print hard copy" kann der Vertrag zusätzlich ohne Unterschrift ausgedruckt werden.

Bei der Option „eSignature (on-premise)" wird über „Documents and Communication" die DSS-Lösung vor Ort ausgelöst. Der Kunde ist dabei persönlich anwesend und unterschreibt auf einem Gerät am Verkaufsort, beispielsweise einem Apple iPad mit Apple Pencil. Das unterschriebene Dokument wird im DSS-Archiv gespeichert und im Reiter „Communication" angezeigt. Auch hier bestätigt „Documents and Communication" die erfasste Unterschrift, und der Vertrag bleibt bis zu dieser Bestätigung im Status „Waiting for Activation". Ebenso steht „Print hard copy" für einen Ausdruck ohne Unterschrift zur Verfügung.

Die Option „Dokument drucken" ermöglicht es, den Vertrag auszudrucken, etwa um ihn dem Kunden zur Unterschrift zu übergeben. Das Erfassen bzw. Bestätigen der Unterschrift für diesen Weg ist noch nicht umgesetzt; der zugehörige Ablauf ist für PI5 geplant.

Sobald eine der drei Optionen gewählt ist, wird die Schaltfläche „Continue" aktiv. Mit ihr bestätigen Sie die gewählte Methode zur Unterschriftserfassung. Die technische Umsetzung der DSS-Unterschrift liegt bei „Documents & Communication". Oberfläche und Gestaltung entsprechen der Mercedes-Benz Workbench und dem vom Kunden validierten UI-Design.

**Produktauswahl: Unverbindliches Angebot drucken oder per E-Mail senden**

Neu ist die Möglichkeit, bereits bei der Produktauswahl ein unverbindliches Angebot zu erstellen und an den Kunden weiterzugeben. Als Händler bzw. Marktbetreiber starten Sie die Vertragserstellung, wählen ein Produkt aus und öffnen die Detailansicht. In deren Fußzeile stehen zwei Schaltflächen zur Verfügung.

Mit „Print" wird der Ausdruck der auf der Seite angezeigten Informationen gestartet. Mit „Email" öffnet sich ein Fenster, in dem die Angaben zum Kunden erfasst werden, der das Produkt in der Detailansicht angefragt hat. Dazu gehören Vorname, Nachname und E-Mail-Adresse. Vor- und Nachname sind Textfelder, die alphanumerische Zeichen in Groß- und Kleinschreibung akzeptieren. Die E-Mail-Adresse wird ebenfalls als Text eingegeben, muss dem Format einer E-Mail-Adresse entsprechen und akzeptiert Groß- und Kleinbuchstaben. Wird das erwartete Format in einem Feld nicht eingehalten, erscheint eine Fehlermeldung, und die Schaltfläche „Send Email" bleibt deaktiviert. Sie wird erst aktiv, wenn alle Pflichtfelder ausgefüllt und gültig sind.

Mit „Cancel" schließen Sie das Fenster und brechen den Vorgang ab. Mit „Send Email" wird die E-Mail an die eingegebene Adresse versendet. Als Absenderadresse dient die E-Mail-Adresse des Verkäufers, die aus den Anmeldedaten übernommen wird; eine gesonderte Erfassung ist nicht nötig. Nach dem Versand erscheint die Hinweismeldung „Email successfully sent". Das Design des Angebots richtet sich nach der erweiterten Stammdatenvorlage für Preisinformationen zum Vergleich. Auch hier gelten die Vorgaben der Mercedes-Benz Workbench sowie des vom Kunden validierten UI-Designs.