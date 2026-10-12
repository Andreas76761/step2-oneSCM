# Batch 672 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Hinweis zum ersten Thema (Dublettenprüfung bei Ansprechpartnern):** Dieses Vorhaben hat den Status „Cancelled". Es wurde also nicht umgesetzt, und die beschriebene Funktion steht im Produkt nicht zur Verfügung. Für das Benutzerhandbuch sollte der Abschnitt daher nicht als vorhandene Funktion aufgenommen werden. Zur Information folgt der Text, der sich aus den Rohdaten ergibt, falls das Vorhaben später wieder aufgegriffen wird.

**Entwurf (nur bei späterer Umsetzung): Ansprechpartner eines Partners – Dublettenprüfung**

Benutzer der Market Operation können im Bereich „Admin" unter „Partner Management" in einem Partnerdatensatz Ansprechpartner eines Händlers anlegen, anzeigen, bearbeiten und löschen. Nach dem bisherigen Stand prüft oneSCM nicht, ob ein Ansprechpartner für denselben Partner bereits existiert, sodass Dubletten entstehen können.

Geplant war, dass oneSCM beim Anlegen eines neuen Ansprechpartners für einen bestehenden Partner automatisch eine Dublettenprüfung durchführt. Ein Ansprechpartner sollte pro Partner eindeutig über die Kombination aus der User-ID (bzw. der Dealer-Directory-ID) und der von oneSCM vergebenen Partnernummer identifiziert werden. Dazu wählt der Benutzer im Bereich „Admin" unter „Partner Management" den gewünschten Partner aus, scrollt auf der Partnerseite nach unten und klickt auf „Create Contact Person". Anschließend füllt er im angezeigten Fenster alle erforderlichen Felder aus und klickt auf „Create". Erst dann sollte die Prüfung erfolgen.

Ist der Ansprechpartner dem Partner bereits zugeordnet, sollte eine Meldung erscheinen. Nach einem Klick auf „Continue" gelangt der Benutzer zurück zur Partnerseite. Existiert der Ansprechpartner noch nicht, wird er in die Ansprechpartner-Tabelle des Partners aufgenommen, der Benutzer wird zur Partnerseite zurückgeleitet, und der neue Eintrag erscheint in der ersten Zeile der Tabelle. Ein Ansprechpartner sollte demnach nicht mehrfach demselben Partner hinzugefügt werden können.

**Änderungen beim Anlegen von Kunden (Customer Management)**

Benutzer der Market Operation dürfen Kundendatensätze nur noch im Bereich „Contract Generation" von oneSCM anlegen. Dies ist eine Änderung der fachlichen Anforderung und hat folgende Auswirkungen auf das Customer Management:

Wenn ein Benutzer in der Navigationsleiste auf „Customer Management" klickt, sieht er alle Kunden, die zu seinem Markt gehören. Auf dieser Seite kann er keine Kunden mehr anlegen, die Schaltfläche zum Anlegen eines Kunden wurde im Vergleich zur Vorgängerversion entfernt. Das Löschen von Kunden steht im MVP nicht zur Verfügung, und zwar unabhängig vom Kundenstatus (Temporary, In Confirmation, Active oder Inactive), da diese Möglichkeit den Prozess der Vertragserstellung beeinträchtigen würde.

Da das Anlegen von Kunden über die Navigationsleiste „Customer Management" nicht mehr möglich ist, entfällt diese Seite in der bisherigen Form und bleibt dem Benutzer nur noch über die Navigationsleiste „Contract Generation" zugänglich. Dort kann ein neuer Kunde angelegt werden.