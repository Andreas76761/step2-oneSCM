# Batch 677 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Partner- und Kundenverwaltung in oneSCM**

**Erweiterte Suche und Filter im Partner-Management**
Im Partner-Management lässt sich eine erweiterte Suche mit mehreren Suchbegriffen durchführen. Zusätzlich stehen weitere Filteroptionen zur Verfügung, mit denen sich die Ergebnisse eingrenzen lassen. Die Funktion wurde auf ihre korrekte Arbeitsweise geprüft. Die Erstellung eines Datensatzes für diese Prüfung sowie die Anpassung bestehender Tests sind für einen späteren Schritt vorgesehen.

**Händler anlegen**
Ein Händler kann angelegt werden, indem ausschließlich die Pflichtfelder ausgefüllt werden. Voraussetzung ist die Anmeldung am oneSCM-System.

**Verhalten von Dialogfenstern**
Dialogfenster (Modals) in oneSCM sollen nicht mehr versehentlich geschlossen werden, wenn Anwenderinnen und Anwender außerhalb des Fensters auf den dunklen Hintergrund klicken. Dies betrifft zum Beispiel die Bearbeiten- und Löschen-Dialoge einer Fahrzeuggruppen-Karte auf der Übersichtsseite. Zuvor ging beim versehentlichen Wegklicken unter Umständen bereits eingegebene Information verloren und es entstand Verwirrung darüber, was geschehen war. Vorgesehen ist, Dialogfenster standardmäßig nicht per Klick auf den Hintergrund schließbar zu machen. Wo es erforderlich ist, können Ausnahmen definiert werden. Diese Regelung soll auch für künftige Erweiterungen gelten.

**Geplante, nicht umgesetzte Funktionen**
Zwei weitere Anforderungen im Bereich Kunden- und Partnerverwaltung wurden nicht umgesetzt, sondern abgebrochen. Sie sind daher im aktuellen Funktionsumfang nicht enthalten, und für das Handbuch ist nur der geplante Hintergrund relevant.

Die erste Anforderung sah vor, dass bei der Vertragserstellung ein Kunde in externen Listen und Systemen geprüft wird, etwa im Finanzsystem (Nacos) und in der CAS-Sanktionsliste. Das Ergebnis sollte die Marktbetreuung (Market Operation) über die Einstufung des Kunden informieren. Der Kundenstatus lautet bei der Vertragserstellung „In Confirmation“. Händler sollten den Finanzsystem-Status von Kunden nicht einsehen können. Außerdem sollte das Anlegen doppelter Kunden nicht möglich sein.

Die zweite Anforderung betraf einen Genehmigungsprozess für Kundenänderungen. Änderungen an Adresse, Kontakt- oder Zahlungsdaten sowie Korrekturen fehlerhaft erfasster Daten sollten durch mehrere Rollen möglich sein, darunter Market Operation, MPC PM, Händler und Admin. Geplant war folgender Ablauf:

Kunden im Status „Temporary“ können von allen berechtigten Rollen direkt geändert werden, ohne Genehmigung. Bei Kunden im Status „Active“ oder „Inactive“ sind alle Felder editierbar. Existiert noch keine SAP-Debitorennummer, wird direkt gespeichert. Ist sie vorhanden, hängt das Vorgehen von der Rolle ab: Änderungen durch Händler oder Verkäufer sollten eine Benachrichtigungsaufgabe an Market Operation, MPC PM oder Admin auslösen und erst nach Freigabe wirksam werden. Änderungen durch Market Operation, MPC PM oder Admin sollten ohne Genehmigung übernommen werden. Nach einer Freigabe oder Änderung sollte ein Ereignis erzeugt werden, damit die Änderungen in eine Hilfsdatei für den Abgleich mit dem Finanzsystem (in Deutschland Nacos) exportiert werden. Bei Kunden im Status „In Confirmation“ sollten Änderungen direkt möglich sein, solange die Daten noch nicht exportiert wurden. Sobald sie zum Export bereitstehen, sollten bis zum Eingang der Rückmeldedatei des Finanzsystems keine Änderungen erlaubt sein.

Lehnt eine genehmigende Person eine Änderung ab, wird sie nicht gespeichert und die bisherigen Daten bleiben gültig. Bis zur Genehmigung sollten in anderen Funktionen nur die alten Kundendaten verwendet werden. Vorgesehen war außerdem eine Oberfläche zum Vergleich von alten und neuen Daten, in der Änderungen genehmigt oder abgelehnt werden können, bei Ablehnung mit Angabe eines Grundes. Die anfragende Person sollte über das Ergebnis informiert werden.

Zum Gesamtprozess gehörte: Der Kunde bleibt im Status „Temporary“, bis das Angebot im Vertragserstellungsprozess bestätigt wird. Danach wechselt er auf „In Confirmation“, und die Kundendaten werden an das Finanzsystem übermittelt. Das Finanzsystem sendet SAP-Debitorennummer und Lastschriftcode (nur bei vorhandenen Bankdaten) zurück. Nach deren Eintragung wird der Vertrag aktiviert und der Kunde wechselt von „In Confirmation“ auf „Active“.