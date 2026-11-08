# Batch 1129 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Marktspezifische Anpassung von ISP-Codes (Technische Optionen)**

Bisher können Benutzer im Bereich Vehicle Management keine ISP-Codes vom Typ Wizard anlegen. Künftig soll ein HQ-Benutzer eine zentrale Empfehlung für die Codes pro Markt hinterlegen können und festlegen, in welchen Märkten diese Codes verwendet werden dürfen. Die einzelnen Märkte ergänzen anschließend ihre eigene Übersetzung in den Market Settings.

Für die Anlage der Codes steht im Vehicle Management ein dreistufiger Wizard zur Verfügung, der sich am Verhalten der bereits bekannten Vega Codes orientiert. Zunächst legt der Benutzer den Code an, wobei Upload und Download deaktiviert sind. Danach definiert er die Märkte, für die der Code gelten soll, und füllt anschließend das HQ-Feld aus. Abschließend sieht der Benutzer eine Übersicht, die alle zusammengeführten Angaben vor dem endgültigen Absenden anzeigt. Sind Pflichtfelder (Code-Anlage, Marktdefinition oder HQ-Felder) nicht ausgefüllt, blockiert das System das Absenden des Wizards.

Nach dem Abschluss übermittelt das System die Code-Details und die vom HQ ausgefüllten Angaben automatisch und ohne manuellen Eingriff an die Market Settings. Dort sind die HQ-Felder für den richtigen Markt und in der richtigen Sprache sichtbar. Die vom HQ bereitgestellten Hinweise und Vorschläge werden in den marktspezifischen Attributen der lokalen Märkte automatisch vorbelegt, damit die Daten einheitlich bleiben.

Die Kommunikation verläuft ausschließlich in eine Richtung, vom HQ-Bereich in die Market Settings, und nicht bidirektional. Ändert ein Benutzer im HQ-Bereich Daten, nachdem er sie bereits erfasst hat, werden diese Änderungen in die HQ-Felder der Market Settings übernommen. Sie gelangen auch in die Marktfelder, sofern der Markt diese nicht zuvor selbst überschrieben hat. Wird in den Market Settings eine neue Sprache hinzugefügt, übernimmt das System die jeweils aktuellen Werte und belegt die Felder damit vor.

Die zentrale Steuerung bleibt dabei gewahrt. Ein lokaler Marktbenutzer kann die ursprünglichen HQ-Vorgaben zur Feldkonfiguration in den Market Settings weder ändern noch überschreiben. Zudem kann er keine Daten oder Übersetzungen einsehen oder bearbeiten, die zu einem anderen Marktsegment oder einer anderen Division gehören, für die ihm die Berechtigung fehlt.

Hinweis: Das zugrunde liegende Vorhaben befindet sich noch im Entwicklungs-Backlog. Die genauen Abläufe in der Benutzeroberfläche sind in den vorliegenden Angaben nur durch den Verweis „gemäß UI“ beschrieben und müssen vor der Veröffentlichung des Handbuchtexts ergänzt werden.