# Batch 1202 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 20 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation: Verbesserungen bei Listenpreis-Kampagnen**

Beim Anlegen einer Listenpreis-Kampagne (Sticker Price Campaign) müssen Sie nicht mehr jeden Wert der Preismatrix von Hand eintragen. Bisher gab es keine Möglichkeit, für leere Zellen der Preismatrix einen Gesamtrabatt festzulegen. Nun können Sie nur einige Werte manuell definieren und für alle übrigen Felder einen übergreifenden Rabatt anbieten, sodass diese Werte nicht mehr einzeln berechnet und eingetragen werden müssen.

Zunächst steht eine Währungsauswahl zur Verfügung. Die Währungen im Dropdown werden aus der Währung übernommen, die für den Markt festgelegt ist.

Zusätzlich gibt es eine neue Schaltfläche für den Gesamtrabatt. Sie öffnet ein Fenster, in dem Sie einen Prozentsatz und einen Maximalbetrag eingeben. Der Rabatt wird ausschließlich auf Felder angewendet, in die Sie keinen Wert manuell eingegeben haben.

Das Feld „Percentage“ ist ein Pflichtfeld und akzeptiert nur Ziffern. Der Wert muss mindestens 1 % betragen und darf höchstens 100,00 % erreichen. Erlaubt sind maximal fünf Zeichen, davon zwei Nachkommastellen (z. B. 98.50 oder 100.00). Den Dezimalpunkt geben Sie selbst ein. Das Feld „Maximum Amount“ ist optional und akzeptiert ebenfalls nur Ziffern. Der Mindestwert beträgt 1, und erlaubt sind maximal acht numerische Zeichen, davon zwei Nachkommastellen (z. B. 123456.50). Werden die Vorgaben nicht eingehalten, erscheint eine Fehlermeldung. Beim Prozentsatz lautet sie „Min. 1 and max. 5 characters allowed. Please correct your input and try again“, beim Maximalbetrag „Min. 1 and max. 8 numeric characters allowed. Please correct your input and try again“.

Mit „Cancel“ schließen Sie das Fenster, ohne den Rabatt anzuwenden. Mit „Submit“ berechnet das System den Rabatt und trägt ihn in alle Felder des aktuellen Clusters ein, in denen kein manueller Wert vorhanden ist. Der Gesamtrabatt gilt dabei jeweils nur für ein Cluster und kann daher für jedes Cluster unterschiedlich sein.

Aus der Planung geht hervor, dass eine neue Bedienmöglichkeit nötig ist, um die Tabelle zurückzusetzen, falls Sie manuell eingegebene Werte oder den angewendeten Prozentrabatt später ändern möchten.

**Weitere Arbeiten im Bereich Contract Calculation**

Das Backend wurde in zwei Punkten weiterentwickelt. Der Batch-Job, der die neuesten Aktualisierungen aus oneERP abruft, wurde angepasst. Außerdem wurden Validierungsfunktionen für die einzelnen Ereignistypen im Customer Management geschaffen. Dazu gehören eine Tabelle zur Speicherung fachlicher und Validierungsfehler in der Domänendatenbank, eine Schnittstelle, die diese Fehler samt Paginierung, Sortierung und Filterung für die Anzeige bereitstellt und an OpenSearch angebunden ist, sowie eine Schnittstelle, die anhand einer Vertragsnummer die erforderlichen Daten für das Nemesis-Ereignis der Domäne zusammenstellt und erneut sendet. Die Fehlerstatus (z. B. gelöst oder ausstehend) lassen sich aktualisieren.