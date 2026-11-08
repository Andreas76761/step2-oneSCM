# Batch 623 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 21 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung: Neuerungen und Korrekturen**

**Händlerverwaltung (Dealership Management)**

Die Validierung der SAP-Debitorennummer wurde angepasst. Bisher war die Nummer auf genau zehn Ziffern beschränkt. Künftig darf das Feld nicht leer sein und muss aus maximal zehn numerischen Ziffern bestehen. Damit werden auch Märkte unterstützt, deren SAP-Nummern kürzer sind, etwa Polen mit acht Ziffern. Beim Upload einer Händlerliste werden Namen mit einer Länge von bis zu 300 Zeichen unterstützt. Umlaute, Sonderzeichen und Großschreibung sind zulässig, zum Beispiel „Autohaus Bortenlänger GmbH und Co. KG". Als eindeutiger Wert gilt nur noch die GSSN-ID; die Eindeutigkeitsprüfung für andere Felder entfällt. Die Änderung ist erfolgreich umgesetzt, wenn oneSCM die Datei zum Upload zulässt. Ein Fehler, bei dem der Upload eines Händlers mit einem 400-Fehler des Servers scheiterte, wurde ebenfalls behoben.

Die Händlerverwaltungstabelle wurde zudem erweitert. Wenn ein Mitarbeiter der Marktorganisation im Namen eines Händlers einen Vertrag anlegt, unterstützt die Tabelle nun diesen Fall, sobald in der Generierung ein Händler zugewiesen wird. Die Händlerdetails stammen dabei aus ALICE und enthalten die GSSN-ID des Verkäufers.

Bei der Registrierung eines Händlers wurden mehrere Fehler behoben: Der Absenden-Button war dauerhaft deaktiviert, ein neuer Händler vom Typ „Market" konnte nicht angelegt werden, und Validierungsmeldungen wurden doppelt mit demselben Text angezeigt.

**Gewerbekunden und Zahlungsinformationen**

Für Gewerbekunden wird der FI-System-Partnerstatus im Bereich „Forderungen aus dem FI-System" nun automatisch vom System vorbelegt und kann nicht mehr bearbeitet werden. Liegt eine SAP-Debitorennummer vor, ist der Status „Aktiv", andernfalls „Inaktiv". Zuvor konnte der Status manuell gewählt werden.

Das Pflichtfeld für die USt-ID wurde von der Seite „Kunden- und Zahlungsinformationen" entfernt. Außerdem wurde die Validierung der USt-ID korrigiert, und der Abgleich über die USt-ID, der bei der Erkennung doppelter Gewerbekunden nicht richtig funktionierte, wurde repariert. Zahlungsdetails von Gewerbekunden können nun auch im Bestätigungsstatus aktualisiert werden. Die Debitorennummer eines Gewerbekunden wird auf der Ergebnisseite wieder korrekt angezeigt. Die Fehlermeldung „Customer debtor data not found", die die Aktivierung eines Vertrags verhinderte, wurde behoben. Ebenso wurde das Problem behoben, dass die Funktionen „Transfer" und „Zahlungspflichtigen ändern" sowohl für Neu- als auch für Bestandskunden abgelehnt wurden. Auch die Kundensuche, die zuvor einen Fehler zurückgab, funktioniert wieder.

**Vereinheitlichung der Seite „Kunden- und Zahlungsinformationen"**

Die Seiten für Privat- und Gewerbekunden wurden in Feldern und Bereichen vereinheitlicht und nach dem Prinzip „wichtigste Informationen zuerst" angeordnet. Die Reihenfolge entspricht der Übersichtsseite aus der Generierung: Kundendetails, Adressdetails, Zahlungsinformationen, Steuer- und Rechtsdetails, Forderungen aus dem FI-System, Sammelrechnung, Kontaktperson (nur für Gewerbekunden), Präferenzen, Mercedes me (nur für Privatkunden) sowie Marketingpräferenzen, die für DE entfallen. Bei MCC folgen abschließend die Händlerdetails. Der Bereich zum SEPA-Mandat wird entfernt.

**Technische Korrekturen im Hintergrund**

Die Prüfung von E-Mail-Einschränkungen wurde im Kundenservice und im Benachrichtigungsservice korrigiert. Das Kundenereignis, das an Nemesis gesendet wird, wurde in einer aktualisierten Version bereitgestellt, bei der einzelne Attributwerte angepasst wurden.