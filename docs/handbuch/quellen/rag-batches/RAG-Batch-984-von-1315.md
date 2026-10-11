# Batch 984 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fußzeile mit Anbieterkennzeichnung und Datenschutz**

In der Fußzeile jeder Seite von oneSCM stehen nun zwei Optionen zur Verfügung: „Provider" (Anbieterkennzeichnung bzw. Impressum) und „Data Protection" (Datenschutzerklärung). Ein Klick auf eine der beiden Optionen öffnet ein Fenster (Modal), dessen Inhalt gelesen, gescrollt und wieder geschlossen werden kann. Die Texte werden in der Sprache angezeigt, die der Benutzer ausgewählt hat: Wählt er Englisch, erscheint der englische Text, wählt er Deutsch, der deutsche Text. So können Benutzer die Informationen zum Anbieter und zum Datenschutz jederzeit einsehen und zur Kenntnis nehmen.

**Zustimmung zu den Nutzungsbedingungen**

Mit Ausnahme des ADMIN kann kein Benutzer oneSCM verwenden, ohne zuvor die Nutzungsbedingungen akzeptiert zu haben. Bei der ersten Anmeldung öffnet sich ein Fenster mit dem Titel „oneSCM - Terms of Use". Dieses Fenster hat keine Schaltfläche zum Schließen und lässt sich erst schließen, wenn der Text bis zum Ende gescrollt, das Kontrollkästchen aktiviert und die Bedingungen akzeptiert wurden. Der Inhalt basiert auf der Vorlage, die von Documents & Communication definiert wird, und ist scrollbar.

Sobald der Benutzer den Text bis ganz nach unten gescrollt hat, wird ein Kontrollkästchen angezeigt, mit dem er bestätigt, die Nutzungsbedingungen gelesen zu haben. Die Schaltfläche „Accept" ist zunächst ausgegraut und wird erst aktiv, wenn dieses Kästchen angekreuzt wurde. Mit einem Klick auf „Accept" wird die Zustimmung in einer versionierten Tabelle gespeichert. Erfasst werden dabei ein fortlaufender Zähler, die Markt-ID, zu der der angemeldete Benutzer gehört, die Benutzer-ID, die Version der Nutzungsbedingungen (1, 2, 3 usw.) sowie Datum und Uhrzeit der Zustimmung im Format JJJJ.MM.TT HH:MM:SS.

Beendet ein Benutzer nach der ersten Anmeldung die Sitzung oder den Browser oder tritt ein Timeout ein, wird er bei jeder weiteren Anmeldung erneut aufgefordert, die Nutzungsbedingungen zu akzeptieren, solange er sie nicht abgeschlossen hat. Zur Einhaltung der DSGVO gilt ein Löschmechanismus: Wurden mehr als zwei Versionen der Nutzungsbedingungen akzeptiert und liegen zwischen den letzten beiden Versionen drei Jahre, wird die ältere Version einmal jährlich im Dezember aus der Tabelle gelöscht. War ein Benutzer länger als drei Jahre nicht in oneSCM angemeldet, werden seine Daten aus der Tabelle gelöscht. Meldet er sich nach einer solchen Löschung (nach mehr als drei Jahren) wieder an, muss er die aktuellste Version der Nutzungsbedingungen erneut akzeptieren.

**Neues Vertragsattribut**

Für Serviceverträge wurde ein zusätzliches Vertragsattribut eingeführt, mit dem das System für jeden Fall erkennt, wie der jeweilige Ablauf zu behandeln ist. Bisher galten alle erstellten Verträge als Standalone-Verträge. Jedem Produkt wird nun eines der folgenden Attribute zugewiesen: Standalone, Leasing oder Finance.

Die Vertragserstellung fragt abhängig vom Ablauf die passenden Produkte ab. Die bisherigen oneSCM-Abläufe verwenden Standalone-Produkte. Der MBLD-Ablauf erhält die Produkte mit dem Attribut Leasing. Der Finance-Ablauf erhält künftig die Produkte mit dem Attribut Finance; dieser Teil ist noch offen. Die Produktdetails enthalten in der Antwort das Produktattribut, das im Vertragsobjekt gespeichert wird.

Nach dem Erstellen und Aktivieren eines Servicevertrags, einschließlich aller folgenden Status, wird in der Vertragsdetailansicht auf dem Reiter „Contract" im Feld „Contract Type" der Typ angezeigt, der dem Produkt zugewiesen wurde, zum Beispiel „Standalone".