# Batch 864 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Leasing-Verträge in der Retail-Oberfläche: von der Erstellung bis zur Aktivierung und im Vertragsmanagement**

Leasing-Verträge werden ausschließlich von MBLD über die API bzw. Edge angelegt. Die Retail-Oberfläche bietet keinen Ablauf zur Erstellung solcher Verträge. Sobald MBLD einen Leasing-Vertrag angelegt hat, ist er für Mitarbeiter mit der Rolle MO oder MPC im Proposal Management (Contract Generation) mit dem Status „Created“ sichtbar. Nach der Aktivierung können sie ihn im Contract Management weiterbearbeiten. Das bestehende Retail-Erlebnis für von Händlern angelegte Verträge bleibt unverändert. Händler können Leasing-Verträge in keiner Ansicht sehen, bearbeiten oder dafür Aktionen ausführen.

**Filter „Sales Channel“ und Zugriffsbeschränkung**

Im Proposal Management und im Contract Management steht im erweiterten Filter („More Filter“) das neue Feld „Sales Channel“ zur Verfügung. Es bietet in beiden Ansichten dieselben Optionen: „Retail“ (Standardvorgabe, entspricht der bisherigen Ansicht) und „Leasing“. Die Ansichten schließen sich gegenseitig aus: Bei Auswahl von „Leasing“ werden ausschließlich Leasing-Verträge angezeigt. Auch in den MO Checks gibt es den Filter „Sales Channel“ mit den Optionen „Retail“ (Standard) und „Leasing“.

Nur Benutzer mit der Rolle MO oder MPC können die Option „Leasing“ auswählen und Leasing-Verträge in den Listen sehen. Für Händler wird die Option weder im Proposal Management noch im Contract Management oder in den MO Checks angeboten. Leasing-Verträge sind aus allen händlerseitigen Listen ausgeschlossen und lassen sich auch nicht über einen direkten Link (URL) oder API-Aufruf öffnen. Diese Beschränkung wird auf Server- bzw. Berechtigungsebene durchgesetzt und ist nicht nur in der Oberfläche ausgeblendet.

**Eingeschränkte Ansicht „Overview & Confirmation“ und Bestätigung**

Öffnet ein MO- oder MPC-Benutzer aus dem Proposal Management einen Leasing-Vertrag im Status „Created“, gelangt er auf die Seite „Overview & Confirmation“ in einem eingeschränkten Modus. Bearbeitungsfunktionen sind ausgegraut bzw. deaktiviert, und ein Zahlungsplan („Payment Plan“) wird nicht angezeigt. Die Schalter „Notification Required“ und „Signature Required“ stehen auf „Aus“ und sind nicht bedienbar. Auch die Proposal-Vorschau ist deaktiviert. Möglich sind nur zwei Aktionen: der Zurück-Pfeil, der zur Startseite des Proposal Managements zurückführt, oder die Schaltfläche „Confirm“.

Mit „Confirm“ wird der Vertrag direkt auf „Confirmed“ gesetzt, indem die Edge-Leasing-API (PUT /api/edge/contract/v2/leasing) aufgerufen wird. Eine Auswahl der Signaturart erfolgt nicht, und der Zwischenstatus „Waiting for Confirmation“ wird nicht durchlaufen. Der Übergang führt unmittelbar von „Created“ zu „Confirmed“. Die Möglichkeit, einen Vertrag abzulehnen („Reject Contract“), ist in den Vorgaben noch nicht abschließend geklärt.

**MO Checks und Signatur-Neuversand**

Alle MO Checks für Leasing-Verträge sind auf „Not Applicable“ gesetzt, da Leasing-Verträge das übliche Retail-Prüfverfahren nicht durchlaufen und die Prüfung als bereits vorgelagert in MBLD erfolgt angenommen wird. Beim Öffnen der MO Checks ist der Filter „Sales Channel“ standardmäßig auf „Retail“ gesetzt.

Die Aktion „Retrigger Signature“ im zeilenbezogenen „…“-Menü der Startseite des Proposal Managements steht für Leasing-Verträge nicht zur Verfügung, unabhängig vom Status. Für Retail-Verträge im Status „Waiting for Confirmation“ bleibt sie unverändert erhalten.

**Aktualisierung und Aktivierung eines bestätigten Leasing-Vertrags**

Wählt ein MO- oder MPC-Benutzer einen Leasing-Vertrag im Status „Confirmed“ aus und betätigt „Update“, öffnet sich ein Dialog zur Erfassung folgender Angaben:

Die Fahrgestellnummer (Chassis Number) muss genau 17 Zeichen umfassen und kann eine FIN oder VIN sein. Hierfür sind eine Validierung mit dem Vehicle Management sowie eine Prüfung von Produkt, Produktkonfiguration und Preis vorgesehen, derzeit in dieser Form. Außerdem werden das Datum der Erstzulassung (FRD, First Registration Date), das Kennzeichen (License Plate) und das Vertragsbeginn-Datum (Contract Start Date) erfasst.

Das Vertragsbeginn-Datum wird über einen Datumsauswähler und nicht als Freitext eingegeben. Auswählbar sind nur Daten in der Vergangenheit bzw. bis einschließlich heute: Das früheste zulässige Datum ist das heutige Datum abzüglich der Gesamtlaufzeit des Vertrags, das späteste ist der heutige Tag. Zukünftige Daten sind nicht zulässig. Wird ein ungültiges Datum (in der Zukunft oder vor der frühesten Grenze) gewählt oder eingegeben, erscheint direkt am Feld eine verständliche Fehlermeldung („Please enter a valid date“, mehrsprachig vorgesehen). Es erfolgt keine stille Korrektur, und der Dialog kann erst bestätigt werden, wenn ein gültiges Datum vorliegt. Ebenso wird eine Fahrgestellnummer mit weniger oder mehr als 17 Zeichen mit einem Fehler am Feld abgelehnt.

Sind Fahrgestellnummer, Erstzulassungsdatum, Kennzeichen und Vertragsbeginn-Datum gültig und bestätigt, wird der Vertrag über die Edge-Leasing-API (PUT /api/edge/contract/v2/leasing, Aktivierungsaufruf) mit allen vier Werten aktiviert und wechselt in den Status „Active“. Dies ist der einzige Weg von „Confirmed“ zu „Active“ für Leasing-Verträge in diesem Umfang.

**Technische Hinweise**

„Sales Channel“ ist ein neues, gespeichertes und abfragbares Feld am Vertrag. Da bislang in keiner Umgebung Leasing-Verträge existieren, ist keine Nachpflege bestehender Daten erforderlich. Das Leasing-Backend ist bereits vorhanden. Es wird lediglich in der Retail-Oberfläche bereitgestellt und abgesichert.