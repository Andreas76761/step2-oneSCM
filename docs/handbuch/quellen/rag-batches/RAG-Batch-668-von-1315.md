# Batch 668 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Abweichenden Zahlungspflichtigen für einen Servicevertrag hinterlegen (Bestandskunde)**

Beim Anlegen eines neuen Servicevertrags für einen Bestandskunden können Sie nun einen anderen Zahlungspflichtigen angeben, dessen Zahlungsinformationen die bisherigen ersetzen. Voraussetzung ist, dass der Kunde bereits existiert, über eine ID verfügt und Zahlungsinformationen hinterlegt sind.

Starten Sie dazu den Assistenten zur Vertragserstellung, indem Sie die Fahrzeuginformationen erfassen, das verfügbare Produkt auswählen und konfigurieren und anschließend den bestehenden Kunden identifizieren. Im Bereich „Customer & Payment Information" finden Sie im Abschnitt „Payment Information" den Schalter „I want to add a different payer for this contract". Wenn Sie ihn aktivieren, erscheint ein zusätzlicher Abschnitt „Payer Information". Dort können Sie entweder einen bestehenden Zahlungspflichtigen auswählen oder die Daten eines neuen Zahlungspflichtigen erfassen.

**Bestehender Zahlungspflichtiger**

Aktivieren Sie im Abschnitt „Payer Information" den Schalter „Payer is already a customer". Es öffnet sich ein Pop-up, in dem Sie nach dem Zahlungspflichtigen suchen können, und zwar anhand von Vorname, Nachname, E-Mail, MercedesMe-ID oder Mobilnummer. Mit dem zusätzlichen Schalter „Permission to use information from MercedesMe" aktivieren Sie die Schaltfläche „Continue", die die Suche auslöst. Die Treffer werden in einem Pop-up angezeigt. Wählen Sie den gewünschten Kunden aus der Liste aus und bestätigen Sie mit „Continue".

Anschließend werden die Kundendaten aus der Domäne Customer & Partner Management vorausgefüllt. Die Kundendetails, die steuerlichen und rechtlichen Angaben, die Präferenzen und die Adresse sind editierbar. Die Forderungen aus dem FI-System werden angezeigt, sind aber deaktiviert. Die DSGVO-Einwilligungen und die Marketingpräferenzen lassen sich über Schalter ändern. Die Zahlungsinformationen sind vorausgefüllt und deaktiviert; SEPA-Lastschrift ist standardmäßig ausgewählt und kann nicht geändert werden.

Im Bereich MercedesMe steht der Schalter „Update MercedesMe account with the information about" zur Verfügung. Ist er aktiviert, werden die in den Kundenfeldern erfassten Informationen in das MercedesMe-Konto übernommen. „Update" übernimmt die bearbeiteten Felder und führt Sie zurück in den Assistenten zur Vertragserstellung, Abschnitt „Customer & Payment Information". „Reset" verwirft Ihre Änderungen in den Feldern. „Cancel" bringt Sie zur Produktauswahl zurück.

Sobald alle Pflichtfelder ausgefüllt sind, wird die Schaltfläche „Next" aktiv. Mit einem Klick darauf werden automatisierte Prüfungen für Fahrzeug, Produkt, Preis, Kunde und Adresse ausgeführt. Sind alle Prüfungen erfolgreich, wird eine Vertragsnummer vergeben und der Vertragsstatus auf „CREATED" gesetzt. Die Daten werden gespeichert, und der Kunde erhält die Zahlungsdaten des ausgewählten Zahlungspflichtigen. Schlägt eine Prüfung fehl, erscheint eine entsprechende Toast-Meldung. Der Vertrag wird dann nicht angelegt und es wird keine Vertragsnummer vergeben.

**Neuer Zahlungspflichtiger**

Ist der Zahlungspflichtige noch kein Kunde, lassen Sie den Schalter „Payer is already a customer" deaktiviert und füllen alle Pflichtfelder aus. Die Sprache wird anhand des Markts der Anmeldung automatisch vorbelegt, im MVP beispielsweise für Deutschland Deutsch. Der Kontoinhaber im Bereich „Payment Information" ist vorausgefüllt und ausgegraut. Im MVP kann die Bestätigung des SEPA-Mandats bzw. die entsprechende Einwilligung angehakt werden. Auch hier steht im Bereich MercedesMe der Schalter „Update MercedesMe account with the information about" bereit, der die erfassten Informationen in das MercedesMe-Konto überträgt.

Mit „Cancel" öffnet sich ein Pop-up zur Bestätigung des Abbruchs. Wenn Sie fortfahren, gelangen Sie zur Startseite der Vertragserstellung; wählen Sie „Cancel", bleiben Sie im aktuellen Fenster. Dasselbe Verhalten gilt für die Vertragserstellung mit einem neuen Kunden. Mit „Back" kehren Sie zur Produktauswahl und -konfiguration zurück. Sobald alle Pflichtfelder ausgefüllt sind, wird „Next" aktiv, und es laufen dieselben automatisierten Prüfungen wie oben beschrieben ab, mit denselben Ergebnissen: Bei Erfolg wird eine Vertragsnummer vergeben und der Status auf „CREATED" gesetzt, bei einem Fehler erscheint eine Toast-Meldung und der Vertrag wird nicht angelegt.

**Hinweis zur Gestaltung**

Die Oberfläche entspricht den Vorgaben der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.