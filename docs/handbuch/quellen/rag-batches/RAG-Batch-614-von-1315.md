# Batch 614 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Händlerverwaltung (Dealership Management)**

Die Händlerverwaltung wurde um zwei zusätzliche Spalten erweitert, die ausschließlich für den Typ „DEALERSHIPS" gelten. Das Feld „Name Addition" (Namenszusatz) wird automatisch aus GSSN+ vorbelegt. Die Kreditorennummer wird vom Benutzer manuell eingegeben. Beide Spalten stehen im Modal, in der Übersicht und im Excel-Template (dort die Kreditorennummer) zur Verfügung. Die Anbindung an Revenue und die Generierung sowie eine API zur Abfrage von Kreditorennummer und Namenszusatz waren ursprünglich Teil der Anforderungen, wurden aber im Rahmen dieser Erweiterung gestrichen und sind daher nicht Bestandteil dieser Funktion.

Beim Anlegen eines Händlers wurden mehrere Validierungen verbessert. Die GSSN-Outlet-ID akzeptiert nur noch genau die zulässige Länge von maximal 10 Zeichen. Wenn eine fehlerhafte GSSN oder SAP-Debitorennummer eingegeben wird, bleibt die Schaltfläche zum Absenden deaktiviert. Wechselt der Benutzer den Händlertyp, erfolgt zunächst keine Validierung, bevor Daten eingegeben wurden.

**Händler-Upload per Excel-Template**

Beim Hochladen einer Datei erhalten Benutzer nun eine klare Rückmeldung zum Ergebnis. Wurden alle Einträge erfolgreich verarbeitet, erscheint die Meldung „All entries were successfully uploaded". Konnten nur einige Einträge nicht hochgeladen werden, wird „Some entries could not be uploaded" angezeigt. Wurde das Template verändert, sodass keine Einträge verarbeitet werden können, lautet die Meldung „No entries were uploaded". Diese Meldungen werden sowohl in der Benutzeroberfläche als auch durch das Backend entsprechend bereitgestellt.

Außerdem wurden mehrere Fehler behoben: Dateien mit fehlerhaften Einträgen ließen sich zuvor teilweise hochladen, die Duplikatsprüfung beim Template-Upload lieferte keinen Hinweis auf einen bereits vorhandenen Datensatz bzw. auf das Überschreiben, und Affiliate-Händler wurden aus dem Upload nicht korrekt interpretiert.

**Kundenverwaltung**

In der Kundenverwaltung wurde ein Fehler behoben, bei dem der Währungswert nicht bereitgestellt wurde, wenn die in den Markteinstellungen hinterlegte Währung nicht EUR war. Zudem wurde die Darstellung der Tabelle für Privatkunden korrigiert, sodass die Daten nicht mehr doppelt abgerufen werden. Technisch wurde die kundenseitige Anwendung dockerisiert.

**Ausblick**

Geplant, aber noch nicht umgesetzt, ist die Erweiterung der Aktualisierung des Mercedes-Me-Profils auf der Kundendetailseite. Bisher können nur Adressdaten innerhalb eines Landes geändert werden. Künftig sollen zusätzlich Vorname und Nachname aktualisierbar sein; die Telefonnummer kann weiterhin nicht geändert werden. Der Tooltip-Text wird entsprechend angepasst.