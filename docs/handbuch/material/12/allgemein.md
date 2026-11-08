# Material zu 12 Ohne Unterkapitel-Zuordnung

Kapitel 12 Geschäftskunden, Kampagnen und Sonderfälle. 5 Abschnitte aus den RAG-Batches, automatisch zugeordnet, redaktionell zu prüfen.

## [Batch 486.3] Hinweis zum zweiten Anwendungsfall

Ein weiterer Anwendungsfall, bei dem Kampagnen mit Kulanzzeitraum (Grace Period) bei der Vertragserstellung eine Benachrichtigung an den MPC auslösen sollten, wurde als nicht mehr gültig gekennzeichnet und ist an anderer Stelle abgedeckt. Er ist daher nicht Bestandteil dieser Funktion.

## [Batch 918.3] Produktkonfiguration

Das System zeigt die verfügbaren Produkte an. Sie konfigurieren gegebenenfalls Kampagnen, optionale Deckungen und den Händlerrabatt. Auf Grundlage der gewählten Konfiguration wird ein Zahlungsplan erzeugt. Anschließend prüft das System, ob der Kunde bereits vorhanden ist (Dublettenprüfung). Kunden- und Zahlungsdaten erfassen Sie, sofern sie nicht bereits vorliegen.

## [Batch 1069.4] Preise, Zahlungsplan und Übersicht

Die Darstellung der Mehrwertsteuerwerte wurde korrigiert. Der Zahlungsplan zeigt den umverteilten Betrag an, sofern Werte vorliegen. Bei Verträgen mit monatlicher Zahlung entspricht die Servicerate nun dem Nettobetrag. Marktkampagnen erscheinen auf der Seite „Übersicht und Bestätigung“ nicht mehr fälschlich als Händlerrabatte, und die dort angezeigten Informationen stimmen mit der Vertragsvorschau (PDF) überein. Bei der Verlängerung mit langer Laufzeit fehlen keine Zeilen mehr in der Übersichtstabelle, wenn zu früh auf „Weiter“ geklickt wird. Das Bestätigungsdatum wird für bestätigte Verträge angezeigt.

## [Batch 624.3] Anzeige der SAP-Debitorennummer

Zudem wurde ein Fehler im Frontend behoben: Die SAP-Debitorennummer wird jetzt auf der Detailseite für Geschäftskunden angezeigt.

## [Batch 820.4] Suspendierung

Im Pop-up-Fenster zur Suspendierung eines Vertrags wird der Grund nicht mehr als Freitext erfasst. Stattdessen gibt es ein verpflichtendes Dropdown-Feld „Reason for Suspension" mit den Werten „Payment Overdue" und „Other". „Payment Overdue" ist vorausgewählt. Wird „Other" gewählt, muss zusätzlich ein Kommentar erfasst werden. In allen anderen Fällen ist das Textfeld „Comments" optional.

