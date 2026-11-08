# Batch 680 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Partner anlegen (Partnerdaten)**

In oneSCM werden zwei Partnertypen unterschieden: Händler (Dealer) und Lieferant (Supplier). Grundsätzlich gibt es zwei Wege, einen Partner zu erfassen. Zum einen kann ein Partner vom Typ Händler über eine Schnittstelle importiert werden (als Quellsysteme sind GSSN+ oder Alice vorgesehen, die endgültige Festlegung steht noch aus). Lieferanten lassen sich auf diesem Weg nicht importieren. Die Umsetzung des Schnittstellenimports ist in der ersten Projektphase (PI1) noch nicht enthalten. Zum anderen kann ein Benutzer der Market Operation einen Partner manuell im Admin-Bereich anlegen. Auf diesem Weg ist grundsätzlich die Anlage beider Partnertypen vorgesehen.

Dazu wechselt der Benutzer im Admin-Bereich in die Partnerverwaltung (Partner Management) und klickt auf die Schaltfläche „Create Partner“. Anschließend kann er zwischen „Create Dealer“ und „Create Supplier“ wählen. Die Option „Create Supplier“ ist im MVP deaktiviert, sodass zunächst nur Händler angelegt werden können.

Nach der Auswahl öffnet sich eine neue Seite zur Erfassung der Partnerdaten. Welche Felder auszufüllen sind, ergibt sich aus dem Partnerdatenmodell. Dieses definiert auf hoher Ebene die Pflichtfelder, die erforderlich sind, um einen Partner in oneSCM anzulegen und mit ihm Geschäfte abzuwickeln. Alle Pflichtfelder sind in der Oberfläche mit einem Stern (*) gekennzeichnet und müssen mit gültigen Daten befüllt werden. Die Prüfung des Datenmodells und der Datenformate erfolgt im Backend. Betroffen sind insbesondere E-Mail-Adresse, Umsatzsteuer-ID (VAT ID), Telefonnummer und Postleitzahl. Entsprechen eingegebene Daten nicht dem definierten Format, erscheint unter dem betreffenden Feld eine passende Fehlermeldung. Im Adressbereich wird das Feld „Adresstyp“ dem Benutzer nicht angezeigt.

Partner werden mandantenbezogen geführt und dem richtigen Rechtsträger (Legal Entity) zugeordnet. Kein Partner ist für Benutzer eines anderen Mandanten sichtbar. Für jeden Partner wird eine Historie über Anlage und Änderung der Details gepflegt, einschließlich des Zeitpunkts der Erstellung und der letzten Aktualisierung sowie der Benutzer-ID der Person, die den Partner angelegt bzw. geändert hat. Der Kostenimport erfolgt auf Basis der Daten des Händlerpartners; diese entsprechen den Daten einer Werkstatt.

**Ansprechpartner**

Auf der Seite zum Anlegen eines Partners können über die Schaltfläche „Add Contact Person“ Ansprechpartner hinzugefügt werden. Zu erfassen sind Rolle, Vorname, Nachname, Anzeigename, Telefon- bzw. Mobilnummer, E-Mail-Adresse und Sprache. Die Rolle wird in einer Dropdown-Liste mit Einfachauswahl unter „Role“ gewählt. Zur Verfügung stehen Salesman, Administration, MBUPTIME, Fleet Manager, Digital Signee, Accounting und General Manager. Pro Partner können beliebig viele Ansprechpartner angelegt werden.

Ein Ansprechpartner kann über die Schaltfläche „Delete“ im Bereich „Add Contact Person“ gelöscht werden, sofern ihm keine Fahrzeugverträge zugeordnet sind. Bestehen verknüpfte Verträge, erscheint ein Popup mit der Fehlermeldung, dass der Ansprechpartner mit Fahrzeugverträgen verknüpft ist (unter Anzeige der Vertragsliste) und das Löschen daher nicht möglich ist. Bestehen keine Verträge, werden die Daten des Ansprechpartners endgültig gelöscht (Hard Delete) und sind danach nicht mehr verfügbar. Nach dem Löschen bleibt der Benutzer auf derselben Seite.

**Speichern und Abbrechen**

Die Schaltfläche „Create“ ist zunächst deaktiviert und wird erst aktiv, wenn alle Pflichtfelder mit gültigen Daten befüllt sind. Mit einem Klick auf „Create“ schließt der Benutzer die Anlage des Partners ab. Bei Erfolg erscheint die Meldung „The partner was added.“ als Toast-Benachrichtigung, die 15 Sekunden sichtbar ist und dann automatisch verschwindet. Schlägt die Anlage fehl, erscheint die Meldung „Something went wrong, and we could not create your partner. Please try again.“ Diese Fehlermeldung enthält eine Schaltfläche „Close“ und bleibt so lange sichtbar, bis der Benutzer sie schließt.

Mit „Cancel“ kann der Benutzer die Anlage abbrechen. Zuvor erscheint die Rückfrage „Are you sure you want to lose all modifications? The modifications you have made will not be updated and they will be lost“. Bestätigt der Benutzer, wird er automatisch zur Ergebnisseite weitergeleitet. Entscheidet er sich dagegen, kehrt er zur Seite mit den Partnerdaten zurück, wo die bereits eingegebenen Informationen weiterhin vorhanden sind.

**Partnerstatus**

Ein Partner hat entweder den Status „Active“ oder „Inactive“. Die Statusvergabe erfolgt automatisch im Hintergrund. Aktiv ist ein Partner, wenn er erstmalig aus dem Quellsystem (ALICE/GSSN+) importiert wird, wenn in oneSCM ein zugehöriger Servicevertrag (SC) existiert (unabhängig vom Vertragsstatus) oder wenn er manuell über den Admin-Bereich angelegt wird. Außerdem kann ein Benutzer der Market Operation den Status manuell im Admin-Bereich von „Active“ auf „Inactive“ setzen, wenn der Partner wieder für den Verkauf von Servicverträgen infrage kommt. Inaktiv ist ein Partner, wenn der Markt über diesen Partner keine Verträge mehr verkaufen möchte; der Status wird dann manuell im Admin-Bereich von „Active“ auf „Inactive“ geändert.

**Gestaltung**

Die Oberfläche folgt dem Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design gemäß dem oneSCM-Style-Guide.