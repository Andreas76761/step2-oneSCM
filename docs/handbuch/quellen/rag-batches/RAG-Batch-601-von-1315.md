# Batch 601 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Hinweis zum Status:** Die erste Änderung (Begrenzung der Zeichenanzahl auf 35) wurde abgebrochen und ist daher in oneSCM nicht umgesetzt. Die zweite Änderung (externe Links auf der Startseite) ist abgeschlossen. Falls das Handbuch nur umgesetzte Funktionen beschreiben soll, entfällt der erste Abschnitt.

**Begrenzung der Zeichenanzahl bei Kundennamen (nicht umgesetzt)**

Vorgesehen war, in oneSCM eine Datenvalidierung einzuführen, die der im FI-System vorhandenen entspricht. Damit sollten die Daten in den Systemen konsistent bleiben. Die Eingabe der Attribute Vorname, Nachname, Firmenname und Zusatzname sollte jeweils auf 35 Zeichen begrenzt werden. Hintergrund war die Vorgabe des SWT-Systems, in dem der Kundenname auf die Felder NAME1 und NAME2 mit jeweils 35 Zeichen aufgeteilt wird. Ist ein Name länger als 35 Zeichen, wird er an Position 35 getrennt, und der Rest steht im Feld NAME2. Insgesamt sind so maximal 70 Zeichen möglich.

Für Privatkunden sollten die Felder Vorname und Nachname auf 35 Zeichen begrenzt werden. Für Geschäftskunden, einschließlich Fuhrparkkunden, galt dies für die Felder Firmenname und Zusatzname. Wird die maximale Zeichenanzahl erreicht, sollte unter dem Textfeld die Meldung „Number of allowed characters should be 35“ erscheinen, und der Wert sollte nicht in der Datenbank gespeichert werden. Die Prüfung war vorgesehen für das Pop-up-Fenster „Customer Details“ sowie die Seite „Customer Information & Payment“ bei der Vertragserstellung, jeweils bei Neuanlage und Bearbeitung des Kunden. Außerdem sollte sie in der Kundenverwaltung auf der Vorschau- und der Bearbeitungsseite für private und gewerbliche Kunden gelten. Da das Ticket abgebrochen wurde, ist diese Validierung nicht verfügbar.

**Neue Karten mit externen Links auf der Startseite**

Auf der Startseite werden zusätzlich zu den bisherigen Karten Karten für externe Webseiten angezeigt. Die Karte für das Xentry-Portal sah bisher nur die Zentrale (HQ). Sie wird künftig allen Benutzern angezeigt.

Händler sehen neben der Xentry-Portal-Karte eine weitere Karte, die auf eine externe Webseite verweist. Sie heißt in der deutschen Oberfläche „Garantie-Pakete“ und in der englischen Oberfläche „warranty products“. Der Link führt zu https://www.warranty-expert.com/MBV/all_index.cfm.