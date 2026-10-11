# Batch 678 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Hinweis:** Beide zugrunde liegenden Vorhaben haben den Status „Cancelled" (abgebrochen). Die hier beschriebenen Funktionen wurden somit nicht umgesetzt und sind in dieser Form nicht Teil des Releases. Falls der Text dennoch in das Benutzerhandbuch aufgenommen werden soll, empfiehlt sich eine Prüfung durch das Team.

**Entwurf für das Benutzerhandbuch (Customer & Partner Management)**

**Änderung von Partnerdaten**

Die Pflege von Partnerdaten in oneSCM ist ausschließlich Benutzern der Marktoperationen (Market Operations) vorbehalten. Sie können gezielt nach einem bestimmten Händler oder Lieferanten suchen, dessen Übersicht öffnen und sich dort alle hinterlegten Details ansehen. Alle erforderlichen Partnerdaten lassen sich bearbeiten und speichern. Ausgenommen ist die Partnernummer, da sie vom System automatisch vergeben wird.

Zusätzlich können Ansprechpartner hinzugefügt werden. Ein Ansprechpartner kann gelöscht werden, sofern er nicht mit Fahrzeugverträgen verknüpft ist. Besteht eine solche Verknüpfung, wird das Löschen mit der Fehlermeldung „The Contact person cannot be deleted as it is linked to VCs (provide list)" abgelehnt, wobei die betroffenen Verträge aufgelistet werden sollen. Auch den Status eines Partners können Benutzer ändern: Soll ein Partner nicht mehr genutzt werden, wird er auf „inaktiv" gesetzt. Wurde ein Partner fälschlicherweise angelegt und befindet er sich noch im Status „Created", kann er gelöscht werden. Anders als bei Kunden werden Partnerdaten nicht an andere Schnittstellen weitergegeben. Die Daten werden manuell von MPC- bzw. operativen Benutzern angelegt und geändert.

**Partnerdatenmodell und Datenvalidierung**

Das Partnerdatenmodell legt auf hoher Ebene fest, welche Pflichtfelder erforderlich sind, um einen Partner in oneSCM anzulegen und mit ihm Geschäfte zu führen. Die Partnerattribute richten sich nach dem hinterlegten Partnerdatenmodell, Datenformate und Validierungen nach der zugehörigen Excel-Vorgabe. Geprüft werden insbesondere E-Mail-Adresse, USt-IdNr. (VAT ID), Telefonnummer und Postleitzahl. Die Pflichtfeldprüfungen greifen gemäß dieser Vorgabe.

Für Anlage und Änderung eines Partners wird eine Historie geführt. Sie enthält den Zeitpunkt der Erstellung und der letzten Änderung sowie die Benutzer-ID der Person, die den Partner angelegt bzw. zuletzt geändert hat. Der Kostenimport erfolgt auf Basis der Händler-Partnerdaten, die dieselben Daten wie die einer Werkstatt enthalten.

Partner werden mandantenspezifisch geführt und dem richtigen Rechtsträger (Legal Entity) zugeordnet. Die Daten werden mandantenweise in den entsprechenden Tabellen gespeichert, sodass Partner für Benutzer anderer Mandanten nicht sichtbar sind.