# Batch 195 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

**Darstellung der Werkstattrechnung im Ansichtsmodus**

Die Detailansicht von Werkstattrechnungen im Ansichtsmodus wurde überarbeitet. Bisher mussten Anwender die horizontale Bildlaufleiste verwenden, um alle Details einer Werkstattrechnung zu sehen. Nun ist die Darstellung responsiv gestaltet und passt sich der Bildschirmgröße an, sodass alle Informationen auf einen Blick erkennbar sind, ohne dass seitliches Scrollen erforderlich ist. Mehrere Überschriften werden zusammengefasst, und Spalten ohne Inhalt werden nach Möglichkeit ausgeblendet. Die Spaltenbreiten werden so angepasst, dass alle notwendigen Informationen sichtbar sind. Die Änderung richtet sich an alle Benutzer mit Berechtigung zum Erstellen und Anzeigen von Werkstattrechnungen, etwa Mitarbeitende der Market Operations (MO) und der Market Performance Center (MPC).

Die Anpassung gilt für alle Werkstattrechnungen und Schadenfälle, also für Werkstattrechnungen, SIVECO, Reimbursement, internationale Werkstattrechnungen aus dem Admin-Bereich sowie Claims aus Vega. Sie betrifft den Abschnitt „Rechnungspositionen“. Dort gilt Folgendes:

Ein statischer Hinweistext weist darauf hin, dass Preise als Nettowerte angegeben sind. Die Spaltenüberschriften werden nur einmal auf Ebene des Coverage-Codes angezeigt und erscheinen ohne den Zusatz „Net“. Neu hinzugekommen ist die Spalte „Description“. Für Coverage-Codes wird die Beschreibung aus dem Admin-Bereich unter Vega-Codes und Coverage-Codes übernommen, indem die „Coverage Reference“ zugeordnet wird. Für Damage-Codes wird die „Damage code description“ aus dem Admin-Bereich unter Vega-Codes und Damage-Codes herangezogen.

Die Spalte „Total Gross Amount“ entfällt vollständig, ebenso die Spalte mit dem Rechnungspositionstext. Neben der Spalte „Total Amount“ befindet sich ein „i“-Symbol. Fährt man mit der Maus darüber, werden der Bruttobetrag und der Steuerbetrag angezeigt. Die Spalte „Tax Classification“ steht nun hinter der Spalte „Total Amount“.

Anwender mit Zugriff auf Werkstattrechnungen können diese somit ohne horizontales Scrollen einsehen und sehen alle neuen Spalten mit den korrekten Werten.

**Qualitätssicherung**

Im Rahmen der automatisierten Qualitätssicherung wurden zwei Prüfungen umgesetzt: ein durchgängiger Ablauf, der die Kundenrechnung nach der Vertragserstellung validiert, sowie die Validierung der E169-Datei, einschließlich der Verwendung für nicht angeschlossene Händler.