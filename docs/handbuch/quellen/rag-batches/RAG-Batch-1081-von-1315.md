# Batch 1081 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung: Änderungen und Korrekturen**

**Startseite der Vertragserstellung**

Die Sortierfunktion der Spalte „Name" auf der Startseite funktioniert nun. Die Spalte lässt sich auf- oder absteigend sortieren. Auch die Namenssuche wurde überarbeitet: Das Suchfeld liefert alle passenden Ergebnisse, sobald mindestens drei Zeichen eingegeben wurden. Dabei wird nicht zwischen Groß- und Kleinschreibung unterschieden. Die Suche wird nicht durch Drücken der Eingabetaste ausgelöst.

**Assistent zur Vertragserstellung: Präferenzen und Kundendaten**

Im Bereich „Preferences" sind die Felder „Preferred Dealer/Workshop" anfänglich leer und schreibgeschützt. Eine Eingabe von Zeichen ist dort nicht mehr möglich.

Im Bereich „Customer Information" gelten nun Eingabebeschränkungen für die Kundendetails. Die Felder „First Name" und „Last Name" akzeptieren nur Buchstaben und maximal 35 Zeichen. Das Feld „Phone Number" ist auf 35 Zeichen begrenzt. Bei Überschreitung erscheint die Meldung „Maximum 35 characters allowed."

Das Feld „Private VAT-ID" ist auf 16 Zeichen begrenzt. Sonderzeichen wie @, ., %, &, * und # sind nicht zulässig.

Im Unterbereich „Tax & Legal Details" ist für den MVP-Umfang standardmäßig der Wert „Standard" gesetzt. Das Feld ist schreibgeschützt. Im Bereich „Receivables from FI System" ist das Feld „SAP Debitor Number" bei neuen Kunden mit „-" vorbelegt.

Auch bei den Adressdaten wurden Längenbegrenzungen eingeführt. „Post Code", „Street" und „Street Line 2" sind auf 60 Zeichen begrenzt, „House Number" auf 30 Zeichen und „City" auf 40 Zeichen.

Bei den Zahlungsinformationen gelten folgende Grenzen: „Bank Name" ist auf 50 Zeichen begrenzt, und die Fehlermeldung lautet „Maximum 50 characters allowed." „Account Holder" ist auf 60 Zeichen, „IBAN" auf 34 Zeichen und „BIC" auf 15 Zeichen begrenzt.

**Übersicht und Bestätigung (Schritt 3)**

Auf der Seite „Overview & Confirmation" lassen sich nun mehrere Angaben direkt bearbeiten. Dazu gehören das Feld „License Plate" im Bereich „Vehicle Information" sowie die Felder der Unterbereiche „Customer Details", „Marketing Preferences" und „Address" im Bereich „Customer & Payment Information". Im Unterbereich „Payment Information" wird das Feld zur Gültigkeit des SEPA-Mandats angezeigt.

Zusätzlich stehen die Schaltflächen „Cancel" und „Back" zur Verfügung. Nach Klick auf „Cancel" öffnet sich ein Pop-up. Mit „Cancel" im Pop-up gelangt man zurück zur aktuellen Seite, mit „Proceed" zur Startseite. Die Schaltfläche „Back" führt zum vorherigen Schritt des Assistenten, in dem die Kundeninformationen erfasst wurden.

**Fehlermeldungen**

Wenn beim Anlegen eines Vertrags ein Fehler „400 Bad Request" zurückgegeben wird, passt der Fehlertext nun vollständig in die Toast-Meldung.

**Schnittstelle I155**

Der Export über die Schnittstelle I155 lief fortlaufend, weil die Warteschlange nicht geleert wurde und Verträge dadurch wiederholt exportiert wurden. Dieses Problem wurde behoben.