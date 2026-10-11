# Batch 11 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 26 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fahrzeuggruppen im Bereich Vehicle Management**

Die Verwaltung von Fahrzeuggruppen wurde in mehreren Punkten überarbeitet und stabilisiert. Im Erstellungsprozess einer Fahrzeuggruppe bleibt der Bearbeitungsstand nun auch dann sinnvoll erhalten, wenn zwischen Tabs gewechselt und anschließend zurücknavigiert wird. Die gefilterte Tabelle der Modellreihen behält ihren Zustand über die einzelnen Schritte hinweg bei. Ein in Schritt 1 eingegebener Detailtext wird jetzt korrekt in der Übersicht angezeigt. Wird eine neue Fahrzeuggruppe im Rahmen eines gerade definierten Clusters angelegt, wird sie diesem automatisch zugeordnet. Zudem wurde ein Tippfehler in der Beschreibung der Fahrzeuggruppen-Karten korrigiert.

Auf der Übersichtsseite werden die Fahrzeuggruppen nun nach dem Datum der letzten Änderung sortiert. Die zuletzt geänderte Gruppe erscheint dabei ganz oben; zuvor war keine Sortierregel hinterlegt. Für die Version 1.2 der Pkw-Fahrzeuggruppen wurden die Struktur der Unter-Tabs, die Änderungen in Schritt 2 der Erstellung sowie die Trennung der Fahrzeuggruppen nach Divisionen geprüft und als reviewed markiert. Die manuelle Testausführung für Version 1.1 der Fahrzeuggruppen sowie die Darstellung der Karten auf der Übersichtsseite sind noch offen.

**Benutzerprofil und Tabellen**

Die Anwendung merkt sich künftig bestimmte Oberflächeneinstellungen im Benutzerprofil, damit diese nach einem erneuten Login nicht jedes Mal neu vorgenommen werden müssen. Auf allen Seiten wird der zuletzt gewählte Markt gespeichert. Auf den Seiten „Manage Products“ und „Manage Campaigns“ werden zusätzlich die Anzahl der Einträge pro Seite und die Spaltensortierung gespeichert. Filter bleiben erhalten, bis der Benutzer den Tab oder den Browser schließt oder innerhalb des Hauptmenüs zu einer anderen Seite navigiert. Außerdem wurde die Suche und Bearbeitung der Tabelle im Vehicle Management überarbeitet.

**Import, Schnittstellen und Fehlerbehebungen**

Der Cepro-Import war bisher ein Job, der nur im Backend sichtbar war. Er wurde in die Batch-Job-Oberfläche migriert und ist dort nun verfügbar. Beim Excel-Upload wurde das Verhalten bei fehlerhaft aufgebauten Excel-Dateien korrigiert, sodass der Upload in diesem Fall nicht mehr fehlschlägt. Die irreführende Fehlermeldung des Edge-Contract-Service, der als Wrapper über die Produkt-API arbeitet, wurde verbessert. Hintergrund ist, dass darüber Schnittstellen für externe Services bereitgestellt werden und die Meldungen daher verständlich sein müssen. Ebenfalls behoben wurden ein Fehler bei der Anfrage von Motordetails im Admin-Bereich des Vehicle Management sowie ein Startproblem der Product-Management-Anwendung unter Windows. Bei den Vedoc-Anpassungen (Teil 2) wurde SalesDatadto im Hinblick auf das Kennzeichen entfernt, die Codeinfo bleibt erhalten. Zusätzlich wurde ein fehlschlagender End-to-End-Test für die Kampagnenprodukte repariert.