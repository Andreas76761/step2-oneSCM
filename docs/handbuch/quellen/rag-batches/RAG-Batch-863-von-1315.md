# Batch 863 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Leasingverträge in der Retail-Oberfläche: von der Erstellung bis zur Aktivierung und im Vertragsmanagement**

Leasingverträge werden ausschließlich von MBLD über die API bzw. den Edge-Service angelegt. Die Retail-Oberfläche bietet dafür keinen Erstellungsprozess. Mit dieser Funktion sind die von MBLD erzeugten Leasingverträge in oneSCM von der Erstellung bis zur Aktivierung sichtbar und bearbeitbar, danach auch im Vertragsmanagement. Das bereits bestehende Leasing-Backend wird dazu lediglich in der Oberfläche bereitgestellt und abgesichert. Die gewohnte Retail-Bedienung für Händler bleibt vollständig unverändert. Die Funktion unterstützt die Mitarbeitenden der Rollen MO und MPC bei der Bearbeitung von Leasingverträgen und dient dem Roll-out für MBLD.

**Filter „Sales Channel“ und Zugriffsrechte**

Sobald MBLD einen Leasingvertrag angelegt hat, erscheint er für MO- und MPC-Nutzer im Status „Created“ in der Angebotsverwaltung (Proposal Management, Contract Generation). Im erweiterten Filter („More Filter“) der Angebotsverwaltung und des Vertragsmanagements steht das neue Feld „Sales Channel“ mit identischen Optionen zur Verfügung: „Retail“ (Standard und bisherige Ansicht) und „Leasing“. Die Ansichten schließen sich gegenseitig aus: Bei Auswahl von „Leasing“ werden ausschließlich Leasingverträge angezeigt. Dasselbe Filterfeld mit denselben Optionen und demselben Standardwert gibt es auch in den MO Checks.

Leasingverträge und die Option „Leasing“ sind nur für die Rollen MO und MPC sichtbar. Händlern wird die Option in keinem Bildschirm angeboten, Leasingverträge werden aus allen händlerseitigen Listen ausgeschlossen. Sie können weder angesehen noch bearbeitet noch anderweitig verwendet werden, auch nicht über einen direkten Link (URL) oder einen API-Aufruf. Diese Einschränkung wird serverseitig bzw. auf Berechtigungsebene durchgesetzt, in der Angebotsverwaltung und im Vertragsmanagement gleichermaßen.

**Eingeschränkte Ansicht „Overview & Confirmation“ und Bestätigung**

Öffnet ein MO- oder MPC-Nutzer einen Leasingvertrag im Status „Created“ aus der Angebotsverwaltung, gelangt er in einen eingeschränkten Modus der Ansicht „Overview & Confirmation“. Bearbeitungsfunktionen sind ausgegraut bzw. deaktiviert, der Zahlungsplan wird nicht angezeigt, und die Schalter „Notification Required“ und „Signature Required“ sind ausgeschaltet und nicht bedienbar. Auch die Angebotsvorschau ist deaktiviert. Möglich sind nur drei Aktionen: der Zurück-Pfeil, der zur Startseite der Angebotsverwaltung zurückführt, die Schaltfläche „X“, die den Vertrag auf „Rejected“ setzt, sowie die Schaltfläche „Confirm“.

Bei „Confirm“ wird der Vertrag über den Edge-Leasing-Aufruf (PUT /api/edge/contract/v2/leasing) direkt auf „Confirmed“ gesetzt. Es erscheint keine Abfrage zur Signaturauswahl, und der Zwischenstatus „Waiting for Confirmation“ wird nicht durchlaufen. Folgerichtig steht die Aktion „Retrigger Signature“ im Zeilenmenü („…“) der Angebotsverwaltung für Leasingverträge unabhängig vom Status nicht zur Verfügung. Für Retail-Verträge im Status „Waiting for Confirmation“ bleibt sie unverändert erhalten.

**MO Checks**

In den MO Checks gibt es den neuen Filter „Sales Channel“ mit den Optionen „Retail“ (Standard) und „Leasing“. Alle MO Checks für Leasingverträge sind auf „Not Applicable“ gesetzt, da Leasingverträge das übliche Retail-Prüfverfahren nicht durchlaufen und die Prüfung vorgelagert in MBLD erfolgt.

**Aktualisierung und Aktivierung eines bestätigten Leasingvertrags**

Wählt ein MO- oder MPC-Nutzer einen Leasingvertrag im Status „Confirmed“ aus und startet die Aktion „Update“, öffnet sich ein Dialog mit folgenden Angaben:

Die Fahrgestellnummer (Chassis Number) muss 17 Zeichen umfassen und kann eine FIN oder VIN sein. Vorgesehen sind eine Validierung mit dem Fahrzeugmanagement sowie eine Prüfung von Produkt, Produktkonfiguration und Preis (nach aktuellem Stand). Zusätzlich werden die Erstzulassung (FRD, First Registration Date) und das Kennzeichen (License Plate) erfasst.

Der Vertragsbeginn (Contract Start Date) wird über einen Datumsauswahldialog gewählt, nicht per Freitext. Frühestens wählbar ist das heutige Datum abzüglich der Gesamtlaufzeit des Vertrags, spätestens das heutige Datum. Zukünftige Daten sind nicht zulässig, es sind nur Daten in der Vergangenheit bzw. der heutige Tag wählbar. Ein zukünftiges oder zu weit zurückliegendes Datum wird direkt am Feld mit einer verständlichen Meldung abgelehnt („Please enter a valid date“, mehrsprachig hinterlegt). Es erfolgt keine stille Korrektur, und der Dialog kann erst mit einem gültigen Datum bestätigt werden. Ebenso wird eine Fahrgestellnummer mit mehr oder weniger als 17 Zeichen abgelehnt.

Sind Fahrgestellnummer, Erstzulassung, Kennzeichen und Vertragsbeginn gültig und bestätigt, wird der Vertrag über den Edge-Leasing-Aufruf (PUT /api/edge/contract/v2/leasing) mit allen vier Werten aktiviert und wechselt in den Status „Active“. Dies ist der einzige Weg von „Confirmed“ zu „Active“ für Leasingverträge im Rahmen dieser Funktion.

**Abgrenzung**

Nicht Teil dieser Funktion sind ein Erstellungsprozess für Leasingverträge in der Retail-Oberfläche, Änderungen an der MBLD-/Edge-Leasing-API über die beschriebenen Bestätigungs- und Aktivierungsaufrufe hinaus sowie Änderungen an der Händleroberfläche.