# Batch 625 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Lieferantenverwaltung (Supplier)**

Für lieferantenbezogene Prozesse wie Rechnungs- und Gutschriftläufe steht nun ein schlankes Datenmodell für Lieferanten zur Verfügung. Es speichert die dafür notwendigen Basisdaten, darunter die Kreditorennummer. Ohne diese Daten wären Rechnungs- oder Gutschriftläufe für Lieferanten nicht möglich. Die Daten nutzen vor allem Benutzer der Market Operation (MO), etwa um bei Bedarf manuelle Rechnungen zu erstellen.

Im Admin-Bereich wurde „Dealership Management" in „Partner Management" umbenannt. Hinter dem Reiter „Market" gibt es den neuen Reiter „Supplier". Dort können Lieferanten über die Felder „Name" und „Supplier Creditor Number" gesucht werden. Die Schaltflächen „Suchen" und „Zurücksetzen" funktionieren wie in der übrigen Anwendung. Die Ergebnistabelle zeigt Kreditorennummer, Name, Straße mit Hausnummer, Postleitzahl, Stadt, Land und die Angabe, ob der Lieferant verwendbar ist („Supplier Usable"). Auch Anzeige pro Seite und Seitennavigation verhalten sich wie sonst in der Anwendung.

Neue Lieferanten legt der MO-Benutzer manuell über einen Dialog an. Pflichtfelder, die auch editierbar sind, sind Kreditorennummer, Name, Straße, Postleitzahl, Stadt und Land. Mit „Abbrechen" kehrt der Benutzer zur Ergebnisseite zurück, ohne dass etwas gespeichert wird. Mit „Submit" wird zunächst anhand der Kreditorennummer auf Dubletten geprüft, damit kein Lieferant doppelt erfasst wird. Ist der Lieferant noch nicht vorhanden, wird er gespeichert und es erscheint eine Erfolgsmeldung. Existiert er bereits, erscheint eine Fehlermeldung, dass die Registrierung nicht möglich war, weil der Lieferant schon registriert ist. Erfasste Lieferanten können anschließend von Produkt und Vertrag verwendet werden.

Für vorhandene Lieferanten sind zwei Aktionen vorgesehen. Beim Bearbeiten werden Produkt und Vertrag über die neuen Daten informiert. Löschen ist nur möglich, wenn der Lieferant weder von einem Produkt noch von einem Vertrag verwendet wird. Zur Anbindung an die SDB4-API ist festgehalten, dass die Kreditorennummer dort als „Supplier Number" geführt wird und nur Nummern ohne Index übernommen werden. Ein Batch-Job zum Abgleich der Daten mit SDB4 war vorgesehen, die Frequenz war jedoch noch offen.

**Anpassungen bei Kunden und Partnern**

In der Benutzeroberfläche wurde der Begriff „Customer" dort entfernt, wo bisher „Customer Private" und „Customer Commercial" standen. Diese Änderung betrifft nur die Oberfläche, nicht das Backend.

Für Kunden gilt nun: Immer wenn ein Kunde, ob neu oder bereits vorhanden, mit Mercedes-Benz in einen vertraglichen Zustand eintritt, ist eine CAS-Prüfung erforderlich. Das gilt zum Beispiel bei der Übertragung eines Vertrags auf einen bestehenden Kunden oder wenn ein vorhandener Kunde als Halter oder Zahler einen neuen Vertrag erhält. Über CAS wird der Status des neuen bzw. übertragenen Vertrags bestimmt.

Bei NEMESIS-Kunden wurden die Datenübergabe und die Konfiguration angepasst. Die Zguid wird nun mit führenden Nullen auf 30 Stellen aufgefüllt. Der Ländercode wird für Deutschland als 20000 statt „DE" übermittelt. Für den Endpunkt wurde zusätzlich eine neue Property mit dem Wert „CustomerMasterSet" eingeführt, die beim Erstellen der Anfrage verwendet wird.

Für Händler (Dealer) wird in der Kundenverwaltung die IBAN künftig anonymisiert angezeigt. Wie bisher sehen Händler nur Kunden und Verträge, die sie in ihrer Outlet-ID angelegt haben, und können deren Daten mit Ausnahme der Zahlungsdetails ändern.

**Fehlerbehebungen und Anpassungen**

Zusätzlich wurden mehrere Fehler behoben und Abläufe angepasst: Der NACOS-ROBO-Job samt Dateien und Ablauf wurde überarbeitet. Der Händler-Upload scheiterte zuvor mit einem Serverfehler (500). Behoben wurden außerdem ein Tenant-Mismatch zwischen Vertrags- und Kundendaten, gelegentliche Fehler beim Erfassen von Kundendetails für Geschäftskunden, die fehlgeschlagene Abfrage von Händlerdetails bei VEGA-IDs mit führenden Nullen, die nicht funktionierende Händlerregistrierung von der MO-Prüfungsseite sowie der nicht funktionierende Link aus der Liste der letzten fünf Verträge. Die Schaltfläche für globale Sammelrechnungen ist bei der Vertragserstellung nicht mehr editierbar. Korrigiert wurden zudem ein falsch gesetzter Kundenstatus bei Verträgen mit abweichendem Halter und Zahler sowie temporäre Privatkunden, deren Status bei Vertragsaktivierung nicht auf „Aktiv" wechselte.