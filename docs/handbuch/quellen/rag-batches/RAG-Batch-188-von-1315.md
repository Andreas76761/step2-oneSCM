# Batch 188 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuerungen und Änderungen**

Im Bereich Revenue Management wird das automatische Löschen von Rechnungen zusammen mit dem zugehörigen Vertrag eingeführt. Sobald für einen Vertrag die Löschregel greift, werden alle Vertragsdetails vollständig und unwiderruflich aus dem System entfernt. Damit werden auch die mit dem Vertrag verknüpften Rechnungen gelöscht. Der Hintergrund sind die Vorgaben der DSGVO: Daten, die ihren Zweck bei der Verwaltung eines Servicevertrags erfüllt haben, sollen nicht weiter im System gespeichert werden. Wann die Löschregel angewendet wird, bestimmen die Einstellungen der Marktkonfiguration. Maßgeblich sind das Ende der Angebotsgültigkeit zuzüglich sechs Monate sowie das Ende des Jahres, in dem der Vertrag den Status „CLOSED“ erhalten hat, zuzüglich zehn Jahre. Von der Löschung sind folgende Rechnungsarten betroffen: Kundenrechnungen, Werkstattrechnungen, Preisminderungen und Provisionen. Diese Funktion befindet sich derzeit in der Abnahmetestphase (BAT-Test).

Abgeschlossen wurde außerdem die Konfiguration der Zahlungsanbindung MPay für die Produktivumgebung. Hierfür wurden Zugangskennungen für die Gesellschaften ATC Indien, ATC Slowakei und ATC Deutschland (Modell B, Test) hinterlegt. Für die Region EU und die Region Indien wurden jeweils die Schnittstellenadressen der Test- (UAT) und der Produktivumgebung auf die Version 2 der MPay-Schnittstelle (Pfad „/api/v2/“) umgestellt.

Darüber hinaus wurde ein Fehler behoben, bei dem die Batch-Jobs OneERPInvE174EXP und OneERPInvE167EXP im Status „Started“ hängen blieben. Zudem wurde die Validierung der E169-Datei (Teil 2) im Rahmen der automatisierten Qualitätssicherung abgeschlossen.

Nicht umgesetzt wurde das Vorhaben, lokale Tests für die Inhalte erzeugter Dateien und eine Datenvalidierung nach Abschluss des Jobs einzuführen. Es wurde eingestellt und hat daher keine Auswirkungen auf die Anwendung.