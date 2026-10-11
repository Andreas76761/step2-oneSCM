# Batch 953 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung: Neuerungen und Hinweise**

**Auswahl und Rücknahme von Kulanzzeit-Kampagnen im Vertragsangebot**

Händler können eine Kulanzzeit-Kampagne (Grace Period) bei der Erstellung eines Vertragsangebots nun nicht nur auswählen, sondern auch wieder zurücknehmen. Bisher ließ sich eine einmal ausgewählte und angewendete Kulanzzeit-Kampagne nicht mehr widerrufen. Dadurch konnten Händler ihr Angebot nicht flexibel auf den Kunden zuschneiden, etwa wenn sie stattdessen eine Sonderanfrage für einen Flottenkunden stellen wollten.

Die Funktion steht den Benutzergruppen Händler, MO, MPC und KAM zur Verfügung. Sie gilt für alle Kundentypen und ist in allen Abläufen der Angebotserstellung verfügbar.

**So funktioniert der Ablauf**

Der Händler startet das Vertragsangebot, indem er eine Kundenkennung eingibt. Das System ruft anschließend die verfügbaren Produkte samt zugehöriger Kampagnen ab. Wählt der Benutzer ein Produkt mit verfügbarer Kulanzzeit-Kampagne aus, klickt er auf „Select Campaign“. Es öffnet sich ein Fenster mit allen anwendbaren Kampagnen, darunter die Sticker-Price-Kampagne und die Kulanzzeit-Kampagne. Es kann jeweils nur eine Kampagne ausgewählt werden.

Nach der Auswahl der Kulanzzeit-Kampagne zeigt das Fenster die Details der Kampagne sowie ein Kommentarfeld für eigene Anmerkungen. Mit „Send Request“ wird die Konfiguration gespeichert. Anschließend erscheint eine Erfolgsmeldung mit dem Hinweis, dass die Anfrage übermittelt wurde und die zuständige Marktstelle benachrichtigt wird, sobald das Angebot erstellt ist. Über „Close“ wird das Fenster geschlossen, und der Benutzer setzt die Angebotserstellung fort. „Cancel Request“ entfernt die ausgeführte Anfrage.

**Erneutes Öffnen und Änderung der Auswahl**

Der Händler kann das Fenster „Manage Campaign“ jederzeit erneut öffnen. Die zuvor gewählte Kulanzzeit-Kampagne ist dann vorausgewählt, und die Erfolgsbestätigung wird angezeigt. Mit „Cancel Request“ wird die Anfrage zurückgenommen, und der Benutzer gelangt zurück zur Übersicht aller verfügbaren Kampagnen. „Close“ schließt das Fenster.

Nach dem Zurücknehmen kann der Benutzer eine andere verfügbare Kampagne auswählen und anwenden. Unterscheidet sich die neu gewählte Kampagne von der Kulanzzeit-Kampagne, wird der Preis unter Berücksichtigung dieser Kampagne aktualisiert. Wird erneut die Kulanzzeit-Kampagne gewählt, wird der Preis nach der aktuellen Umsetzung nicht um diese Kampagne angepasst.

**Auswirkungen bei Flottenkunden**

Wird für einen Flottenkunden eine Kulanzzeit-Kampagne ausgewählt, ist die Schaltfläche „Request Special Case“ ausgegraut und somit nicht verfügbar. Ist keine Kulanzzeit-Kampagne ausgewählt und handelt es sich um einen Flottenkunden, ist die Schaltfläche „Request Special Case“ aktiv.

**Beispielhafter Ablauf**

Der Benutzer meldet sich als Händler, MO, MPC oder KAM an und startet ein Vertragsangebot. Er wählt ein Produkt mit verfügbarer Kulanzzeit-Kampagne, öffnet über „Select Campaign“ die Kampagnenauswahl, wählt die Kampagne, ergänzt einen Kommentar, sendet die Anfrage und schließt das Fenster. Danach öffnet er über „Manage Campaign“ die letzte Anfrage erneut, klickt auf „Cancel Request“ und wählt aus allen verfügbaren Optionen eine Kampagne aus. Anschließend setzt er die Angebotserstellung fort. Design und Grafiken entsprechen den Vorgaben der Mercedes-Benz Workbench.

**Marktseitige Einstellung für Sonderfall-Anfragen**

Für Marktbenutzer wurde zudem eine Benachrichtigungsfunktion für Sonderfälle umgesetzt. Marktbenutzer sollen festlegen können, wie lange Anfragen zu Sonderfällen offen bleiben dürfen.

**Hinweis zur automatisierten Qualitätssicherung**

Mehrere Ende-zu-Ende-Testabläufe für die Vertragserstellung befinden sich derzeit noch in Planung oder Verfeinerung und sind noch nicht abgeschlossen. Sie betreffen unter anderem die Vertragserstellung für Privat- und Gewerbekunden mit bestehender Fahrgestellnummer oder im Baumuster-Ablauf (jeweils mit ISP, unter Berücksichtigung von Build-to-Order und Build-to-Stock), das Anlegen mehrerer Privat- und Gewerbeverträge für denselben Kunden sowie den Produktvergleich mit Angebotsvorschau und E-Mail-Versand. Für den Produktvergleich bei Privatkunden wird geprüft, ob die Funktion aus der Benutzeroberfläche entfernt werden kann. Zwei Testabläufe wurden abgebrochen: die Kündigung eines aktiven Vertrags innerhalb der Kulanzzeit sowie die Vertragserstellung für Gewerbekunden mit bestehender Fahrgestellnummer unter Anwendung eines Händlerrabatts.