# Batch 589 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Verarbeitung von MMe-Updates über Kafka**

oneSCM verarbeitet künftig Aktualisierungen aus MMe CMDS über ein Kafka-Event. Dabei werden Neuanlagen, Änderungen der E-Mail-Adresse und Löschungen von MMe-Profilen berücksichtigt. Aus Datenschutzgründen dürfen veraltete oder nicht mehr existierende MMe-IDs nicht in oneSCM gespeichert bleiben. Deshalb werden MMe-IDs, die nicht mehr gültig sind, automatisch entfernt. Löscht ein Kunde sein MMe-Profil, wird das entsprechende Event verarbeitet und die zum Profil gespeicherten Daten werden in oneSCM gelöscht. Ändert ein Kunde seine MMe-E-Mail-Adresse, wird auch dieses Event konsumiert und die Adresse in oneSCM aktualisiert. Als Update-Event werden ausschließlich Änderungen auf Ebene der MMe-E-Mail-Adresse verarbeitet.

Eine MMe-ID wird erst sichtbar, wenn der Kunde sein Konto aktiviert hat. Ein Konto gilt als aktiviert, sobald das erste relevante MMe-CMDS-Kafka-Event erfolgreich verarbeitet wurde. Bis dahin ist das MMe-Profil entsprechend gekennzeichnet, und eine Hinweismeldung informiert darüber, dass das Profil erst nach der Aktivierung verfügbar ist. Nach der Aktivierung wird die MMe-ID angezeigt und der Hinweis entfällt.

Damit Updates verarbeitet werden können, müssen die E-Mail-Adresse für Benachrichtigungen und das MMe-Profil voneinander entkoppelt sein. Ein Kunde kann daher für MMe eine andere E-Mail-Adresse verwenden als für Benachrichtigungen aus oneSCM. Wird ein Update zu einer MMe-ID empfangen, bleibt die für Benachrichtigungen verwendete E-Mail-Adresse die in oneSCM hinterlegte, und es wird nur die MMe-ID aktualisiert.

**Kundendaten über die Deal ID (VDZ)**

Bei der Vertragserstellung können Kundendaten künftig anhand einer Deal ID abgerufen werden. Diese Funktion gilt für alle Kundentypen. Der Benutzer gibt eine Kennung ein und konfiguriert das Produkt. Wird das Angebot erstellt, übermittelt der Vertrag die Kennung. Handelt es sich dabei um eine Deal ID, ruft das System über VDZ/OTR die zugehörigen Kundendaten ab. Aus der Antwort werden die eindeutige crmDilContactId und, falls vorhanden, die SAP-Debitorennummer verwendet. Zunächst wird oneERP mit der crmDilContactId abgefragt. Liefert diese Anfrage keine Daten und liegt eine SAP-Debitorennummer vor, erfolgt eine zweite Anfrage mit dieser Nummer.

Wird der Kunde in oneERP gefunden, werden die Daten abgerufen und mit dem Bestand in oneSCM auf Dubletten geprüft. Ist der Kunde auch in oneSCM vorhanden, bleiben die Daten in oneSCM maßgeblich. Der Dialog zur Kundensuche wird mit den oneSCM-Daten vorbelegt, und auch die Seite mit den Kundendetails ist mit diesen Daten vorbefüllt, kann aber bearbeitet werden. Ist der Kunde nur in oneERP, aber nicht in oneSCM vorhanden, wird der Suchdialog mit den Daten aus oneERP vorbelegt. Der Benutzer wählt den Kunden aus und gelangt zur Kundendetailseite, die ebenfalls mit den oneERP-Daten gefüllt ist. In beiden Fällen folgen anschließend die Auswahl der Zahlungsart, die Übersicht mit Bestätigung sowie die Erstellung und Aktivierung des Vertrags.

Wird der Kunde in oneERP nicht gefunden, erscheint der Suchdialog leer. Der Benutzer gibt die erforderlichen Daten wie bisher selbst ein, legt den Kunden an, wählt die Zahlungsart und schließt Übersicht, Bestätigung und Aktivierung ab. Dabei wird eine POST-Anfrage zur Kundenanlage an oneERP gesendet.

Ist oneERP zum Zeitpunkt der Anfrage nicht erreichbar, läuft der bisherige Ablauf weiter: Der Benutzer erfasst die Angaben zur Suche oder Anlage des Kunden manuell in oneSCM.