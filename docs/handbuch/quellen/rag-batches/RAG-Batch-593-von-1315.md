# Batch 593 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kunden- und Partnerverwaltung**

Bei der Eingabe der USt-IdNr. wird die Länge künftig auf 11 Zeichen begrenzt, also auf das Länderkürzel „DE“ gefolgt von neun Ziffern, zum Beispiel DE123456789. Diese Begrenzung gilt sowohl beim Bearbeiten eines gewerblichen Kunden als auch bei der Vertragserstellung. Sie macht eine frühere Änderung rückgängig, die dieses Eingabeverhalten zuvor anders geregelt hatte.

Für gewerbliche Kunden steht außerdem die Zahlungsoption Kredit- bzw. Debitkarte zur Verfügung.

Beim Bearbeiten eines Kunden mit dem Status „In Bestätigung“ („In Confirmation“) gilt nun dasselbe Verhalten wie beim Status „Vorläufig“ („Temporary“). Solange der „Direct Debit Code“ leer ist, bleibt die SAP-Debitorennummer deaktiviert. Sobald der „Direct Debit Code“ ausgefüllt wurde, wird die „SAP Debtor Number“ aktiviert und zum Pflichtfeld. Die Änderungen werden anschließend gespeichert. Der „Direct Debit Code“ ist damit bei leerem Feld kein Pflichtfeld.

Behoben wurde zudem ein Fehler beim Abruf von Kundendaten aus oneERP anhand der IBAN. In diesem Fall trat ein Verbindungsfehler auf, sodass die Daten nicht abgerufen werden konnten.

Noch offen ist die Anforderung, vom Kundenprüfungsdienst (CAS) abgelehnte Verträge zu prüfen. Derzeit wird ein Vertrag standardmäßig abgelehnt, wenn der Kunde eine positive CAS-Rückmeldung erhält. Für MBIL soll der MPC den Vertrag auch nach einer positiven CAS-Rückmeldung prüfen können. Laut MBIL MPC ist eine positive Rückmeldung zwar sehr unwahrscheinlich, der MPC möchte den Vertrag in diesem Fall aber vor der endgültigen Entscheidung prüfen. Diese Anpassung ist noch nicht umgesetzt.