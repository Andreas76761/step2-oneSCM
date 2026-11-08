# Batch 1311 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Händler-Startseite und Navigation**

Für Benutzer mit Händlerberechtigung wurde der Einstieg in oneSCM überarbeitet. Bisher wurden Händler nach der Anmeldung auf eine Fehlerseite geleitet, die darüber informierte, dass sie nicht berechtigt seien, die Seite anzusehen. Nach erfolgreicher Anmeldung steht Händlern nun eine eigene Startseite mit einem passenden Navigationsmenü zur Verfügung, über das sie die für sie relevanten Bereiche erreichen.

Das Navigationsmenü in der Kopfzeile enthält die Bereiche Vertragsverwaltung, Kundenverwaltung und Vertragserstellung. Zusätzlich werden der Benutzername (Profil) sowie die GSSN+-ID und das Land angezeigt. Auf der Startseite selbst sehen Händler ein Hintergrundbild und eine persönliche Begrüßung mit Vor- und Nachnamen. Darunter erscheint die Frage „What do you want to do today? Select a quick action from the ones displayed below:“ mit zwei Schaltflächen: „Manage Contract“ führt zur Startseite der Vertragsverwaltung, „Create Contract“ führt zur Seite für das Vertragsangebot. Die Fußzeile entspricht der allgemeinen oneSCM-Fußzeile mit den Angaben zu Anbieter und Datenschutz.

**Zugriff auf Fahrzeuggruppen**

Außerdem wurde ein Problem behoben, bei dem der Bereich Fahrzeuggruppen von der Startseite aus nicht erreichbar war und nur über die Menüleiste in der Kopfzeile geöffnet werden konnte.

**Weitere Arbeiten im Hintergrund**

Im Hintergrund wurde ein automatisierter End-to-End-Test für die Kostenverwaltung korrigiert. Dies hat keine sichtbaren Auswirkungen auf die Bedienung.

**Bekannte Einschränkungen und Ausblick**

Derzeit ist bekannt, dass die Funktion „Health Check“ im Administrationsbereich nicht funktioniert: Beim Betätigen der Schaltfläche erscheint eine Fehlermeldung. Dieser Punkt ist noch in Bearbeitung.

Zudem wird eine mögliche Anbindung des Zahlungsdienstes mPAY untersucht. Aktuell ist mPAY nicht in oneSCM integriert. Geprüft werden unter anderem eine Verwaltungsansicht zur Suche nach vorhandenen Zahlungsmitteln und deren Status, die Erstellung und Weitergabe von Zahlungslinks (etwa als QR-Code für Kunden oder per E-Mail bzw. SMS) sowie eine Schnittstelle zur Rechnungsstellung, die lediglich um eine Transaktions-ID ergänzt wird. Betrachtet werden Zahlungen im stationären Autohaus („Offline Sales“) und im Online-Shop („Online Sales“), jeweils als Einmal- und als monatliche Zahlung. Es handelt sich dabei um eine Voruntersuchung; ein verbindlicher Funktionsumfang oder Termin steht noch nicht fest.