# Batch 873 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Leasing-Verträge im Retail-UI: von der Anlage bis zur Aktivierung und im Vertragsmanagement**

Leasing-Verträge werden ausschließlich von MBLD über die Edge-Schnittstelle (API) angelegt. Das Retail-UI bietet keine Möglichkeit, solche Verträge zu erstellen. Mit dieser Erweiterung sind die von MBLD angelegten Leasing-Verträge in oneSCM ab ihrer Anlage bis zur Aktivierung sowie anschließend im Vertragsmanagement sichtbar und bearbeitbar. Die bisherige Händlerumgebung (Retail) bleibt dabei vollständig unverändert. Die Funktionen richten sich an MO- und MPC-Anwender, die das Leasinggeschäft unterstützen und die Verträge durchgängig bearbeiten können, ohne ein separates Leasing-Werkzeug zu benötigen.

**Filter „Sales Channel" und Zugriffsrechte**

In den erweiterten Filteroptionen (More Filter) der Angebotsverwaltung (Contract Generation), des Vertragsmanagements und der MO-Prüfungen (MO Checks) steht der neue Filter „Sales Channel" zur Verfügung. Er bietet die Optionen „Retail" und „Leasing"; voreingestellt ist „Retail", was der bisherigen Ansicht entspricht. Die beiden Ansichten schließen sich gegenseitig aus: Bei der Auswahl „Leasing" werden ausschließlich Leasing-Verträge angezeigt. In der Angebotsverwaltung und im Vertragsmanagement stehen der Filter und die Zugriffsbeschränkung in identischer Form zur Verfügung.

Leasing-Verträge sind nur für Anwender mit der Rolle MO oder MPC sichtbar. Händler sehen die Option „Leasing" in keinem Bildschirm, Leasing-Verträge sind aus allen händlerseitigen Listen ausgeschlossen und lassen sich auch nicht über einen direkten Link (URL) öffnen. Händler können Leasing-Verträge weder einsehen noch bearbeiten oder Aktionen darauf ausführen. Dies wird auf Ebene von API und Berechtigungen serverseitig durchgesetzt und nicht nur in der Oberfläche ausgeblendet.

**Angelegter Leasing-Vertrag: eingeschränkte Übersicht und Bestätigung**

Sobald MBLD einen Leasing-Vertrag angelegt hat, erscheint er für MO- und MPC-Anwender in der Angebotsverwaltung im Status „Created". Öffnet ein Anwender einen solchen Vertrag, gelangt er auf die Übersichts- und Bestätigungsseite in einem eingeschränkten Modus. Die Bearbeitungsfunktionen sind deaktiviert und ausgegraut, der Zahlungsplan wird nicht angezeigt, die Schalter „Notification Required" und „Signature Required" sind ausgeschaltet und nicht bedienbar, und auch die Angebotsvorschau ist deaktiviert. Es stehen nur zwei Aktionen zur Verfügung: der Zurück-Pfeil, der zur Startseite der Angebotsverwaltung zurückführt, oder die Schaltfläche „Confirm".

Mit „Confirm" wird der Vertrag direkt über die Edge-Leasing-Schnittstelle auf den Status „Confirmed" gesetzt. Es erscheint keine Auswahl der Unterschriftsart, und der Zwischenstatus „Waiting for Confirmation" wird nicht durchlaufen. Der Übergang erfolgt unmittelbar von „Created" zu „Confirmed".

**MO-Prüfungen und Signatur-Neuauslösung**

Auch in den MO-Prüfungen gibt es den Filter „Sales Channel" mit den Optionen „Retail" (Standard) und „Leasing". Für Leasing-Verträge sind alle MO-Prüfungen auf „Not Applicable" gesetzt, da sie nicht das übliche Retail-Prüfverfahren durchlaufen und die Verifizierung vorgelagert bei MBLD erfolgt.

Die Aktion „Retrigger Signature" im Zeilenmenü („…") der Angebotsverwaltung wird für Leasing-Verträge nicht angeboten, unabhängig vom Status. Für Retail-Verträge im Status „Waiting for Confirmation" bleibt sie unverändert verfügbar.

**Aktualisieren und Aktivieren eines bestätigten Vertrags**

Wählt ein MO- oder MPC-Anwender einen Leasing-Vertrag im Status „Confirmed" aus und startet die Aktion „Update", öffnet sich ein Dialog zur Erfassung folgender Angaben: Fahrgestellnummer (Chassis Number), Datum der Erstzulassung (FRD), Kennzeichen (License Plate) und Vertragsbeginn (Contract Start Date).

Die Fahrgestellnummer muss genau 17 Zeichen lang sein und kann als FIN oder VIN angegeben werden. Bei einer kürzeren oder längeren Eingabe erscheint eine Fehlermeldung direkt am Feld, und der Dialog lässt sich nicht bestätigen.

Der Vertragsbeginn wird über einen Datumsauswahldialog gewählt, nicht per Freitexteingabe. Auswählbar sind nur Daten in der Vergangenheit bzw. bis einschließlich heute. Das früheste zulässige Datum ergibt sich aus dem heutigen Datum abzüglich der Gesamtlaufzeit des Vertrags. Ein Datum in der Zukunft oder vor diesem frühesten Datum wird direkt im Feld mit einer verständlichen Meldung abgelehnt (vorgesehen ist der Hinweis „Please enter a valid date", mehrsprachig), es erfolgt keine stillschweigende Korrektur, und eine Bestätigung ist erst mit einem gültigen Datum möglich.

Sind Fahrgestellnummer, Erstzulassung, Kennzeichen und Vertragsbeginn gültig, wird der Dialog bestätigt. Daraufhin wird der Vertrag über die Edge-Leasing-Schnittstelle mit allen vier Werten aktiviert und wechselt in den Status „Active". Dies ist der einzige Weg von „Confirmed" zu „Active" für Leasing-Verträge im Umfang dieser Erweiterung.

**Hinweise zum Umfang**

Das Leasing-Backend besteht bereits; diese Erweiterung macht es im Retail-UI zugänglich und regelt den Zugriff darauf. „Sales Channel" ist ein neues, gespeichertes und abfragbares Feld am Vertrag. Eine Anlage von Leasing-Verträgen im Retail-UI, Änderungen an der MBLD-/Edge-Schnittstelle über das für Bestätigung und Aktivierung Nötige hinaus sowie Änderungen an der Händleroberfläche gehören nicht zum Umfang.