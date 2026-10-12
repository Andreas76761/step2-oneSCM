# Batch 671 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kundendaten-Export an Nacos**

Sobald ein Servicevertrag im System den Status „Bestätigt" erreicht, dient dieser Statuswechsel als Auslöser für die Kundenverwaltung. Der Vertrag kann von Benutzern der Rollen MPC PM, Dealer oder Market Operation angelegt worden sein. Wechselt der Vertrag von „Angelegt" auf „Bestätigt", wird zugleich der Status des zugehörigen Kundendatensatzes von „Temporär" auf „In Bestätigung" gesetzt. Der Status „In Bestätigung" kennzeichnet, dass der Datensatz an das FI-System übermittelt werden muss.

Alle Kundendaten im Status „In Bestätigung" werden im System gesammelt und zu Beginn jedes Arbeitstages von der Kundenverwaltung an Nacos gesendet. Dafür wird automatisch eine Excel-Datei erzeugt. Pflichtfelder sind: oneSCM-Kundennummer, Vorname, Nachname, Straße, Hausnummer, Postleitzahl, Stadt, Land, Telefonnummer, E-Mail-Adresse, Bankname, Kontoinhaber, IBAN und Währung. Optionale Felder sind: SAP-Debitorennummer (sofern vorhanden), Festnetznummer, BIC, FI-System-Bank-ID, Lastschriftcode und SEPA-Mandatsstatus.

Kundendaten können nur für Kunden im Status „Temporär", „Aktiv" und „Inaktiv" bearbeitet und aktualisiert werden. Für Datensätze im Status „In Bestätigung", die bereits als exportiert markiert sind, sind keine Änderungen zulässig. Aktualisierte Daten aktiver Kunden müssen an Nacos übermittelt werden, damit beide Systeme synchron bleiben.

Die Excel-Datei wird täglich an eine hinterlegte E-Mail-Adresse gesendet. Die Rückmeldung wird noch am selben Tag bis zum Ende des Arbeitstages erwartet. Übertragungsart und Empfänger sind noch nicht festgelegt, da die Organisation auf Seite von PC noch aufgebaut wird. Wahrscheinlich übernimmt dasselbe Team die Debitoren für PC, das dies heute bereits für VAN tut. Für die Rückmeldung des FI-Systems stehen drei Optionen zur Diskussion: die Einrichtung eines CFT-Flows für die Dateiübertragung, der Upload einer Vorlage mit Lastschriftcode und SAP-Debitorennummer durch Mitarbeitende des Nacos-Master-Data-Teams oder der bisherige Prozess, bei dem Mitarbeitende des Nacos-Master-Data-Teams sich in oneSCM anmelden und SAP-Debitorennummer und Lastschriftcode manuell erfassen. Die Rückmeldedatei von Nacos wird separat behandelt.

**Kontaktpersonen eines Partners**

Hinweis: Die geplante Umstellung der Kontaktpersonen-Ansicht auf eine Tabelle wurde abgebrochen und ist daher nicht Bestandteil des Funktionsumfangs. Zum Stand der Beschreibung gilt: Auf der Seite „Partner anlegen" können Benutzer der Market Operation über die Schaltfläche „Kontaktperson hinzufügen" Kontaktpersonen für den Partner erfassen.

Zusätzlich wurden Abläufe rund um das Hinzufügen und Löschen von Kontaktpersonen, das Schließen des Abbrechen-Dialogs sowie das Anlegen eines Händlers mit allen ausgefüllten Feldern erfolgreich geprüft. Voraussetzung ist jeweils die Anmeldung am oneSCM-System.