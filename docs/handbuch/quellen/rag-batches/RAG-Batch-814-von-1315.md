# Batch 814 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverwaltung (Contract Management)**

**Zahlerwechsel mit SEPA-Mandat**

Der Zahlerwechsel wurde an die Anforderungen des SEPA-Verfahrens angepasst. Das SEPA-Mandat wird nun in den Prozess eingebunden und kann vom Kunden digital oder auf Papier unterschrieben werden. Die Funktion steht ausschließlich für B2C-/Privatkunden zur Verfügung und kann nur von einem MO für einen aktiven Vertrag durchgeführt werden.

Der MO ruft den betreffenden Vertrag auf und startet den Zahlerwechsel über den Status. Anschließend wird er zur Seite mit den Zahlerwechsel-Details weitergeleitet. Dort erfasst er zunächst das Datum, das nur in der Zukunft liegen darf, sowie einen Kommentar. Danach legt er fest, wer künftig zahlt. Auf Basis der Pflichtangaben prüft das System, ob der Kunde bereits existiert. Bei einem bestehenden Kunden werden die Felder mit den hinterlegten Informationen vorbelegt, bei einem neuen Kunden müssen alle Pflichtfelder ausgefüllt werden. Erfasst werden Kundeninformationen (mit Kundensuche), Adressdaten, Zahlungsinformationen und Präferenzen, einschließlich Mercedes Me. Bei den Zahlungsinformationen ist die IBAN das einzige Pflichtfeld; die übrigen Angaben werden anhand der IBAN ermittelt und angezeigt. Im letzten Schritt zeigt eine Übersicht mit Bestätigung die Vertragsnummer, das Produktbild, den Produktnamen und die Produktbeschreibung, die Preise sowie die Zahlerwechsel-Details und die Zahlerinformationen.

Bei der Bestätigung gilt: Hat der Kunde noch kein SEPA-Dokument, wird der Signaturvorgang gestartet. Der Kunde wählt in einem Fenster die gewünschte Unterschriftsmethode (digital oder manuell), anschließend erscheint eine Erfolgsseite mit einer Meldung. Ist der Kunde aktiv und sind FI-Daten (SEPA/SAP-Debitorennummer) vorhanden, wird der Zahler direkt gewechselt. Ist der Kunde aktiv, hat aber keine FI-Daten, oder handelt es sich um einen neuen Kunden, werden die weiteren Prüfungen durchgeführt: Bei einem neuen Kunden erfolgt eine CAS-Prüfung. Fällt sie positiv aus, wird der Zahlerwechsel abgebrochen und der MO benachrichtigt. Bei einem möglichen Treffer wird auf die Freigabe gewartet, bei einem negativen Ergebnis wird fortgefahren. Danach werden die SAP-Debitorennummer und der Lastschriftcode angefordert. Sobald FI-Daten, CAS-Prüfung und Unterschrift vorliegen, wird der Zahler gewechselt.

Solange das SEPA-Dokument nicht unterschrieben und hochgeladen und das Lastschriftmandat nicht erfasst ist, wird der Vertrag auf „suspendiert“ gesetzt und für die i155-Erzeugung markiert, und die Rechnungsstellung wird gestoppt. Für den Abschluss des Vorgangs gilt eine Frist von 30 Tagen (je Markt konfigurierbar). Wird sie überschritten, wird der Vertrag auf „Early Terminate“ gesetzt und für die nächste i155 markiert.

In den Dialogen steuern die Symbole „>“ (nächster Schritt), „<“ (zurück), „X“ (Abbruch des Zahlerwechsels) und „√“ (Prozess schließen und Signaturvorgang auslösen) den Ablauf.

**Weitere Korrekturen und Verbesserungen**

Rabattbeträge von Händlerrabatt und Kampagnenrabatt werden im Reiter „Zahlung“ im Bereich „Preisinformationen“ nun als Nettobetrag, also ohne Mehrwertsteuer, angezeigt. Zuvor wurden sie brutto dargestellt.

Außerdem wurden folgende Probleme behoben:

Die Sortierung der Fahrzeuggruppen für VAN funktioniert wieder. Beim Ändern des Kilometerstands bei Vertragsbeginn wird keine fehlerhafte Fehlermeldung mehr ausgelöst. Der Vertragsservice wird aktualisiert, nachdem eine Grace-Kampagne genehmigt und der Vertrag aktiviert wurde. In B2B-E-Mail-Benachrichtigungen werden Firmenname sowie Vor- und Nachname der Kontaktperson angezeigt. Beim Eigentümerwechsel eines Vertrags wird das nächste Wirksamkeitsdatum (Rechnungstage) angezeigt.