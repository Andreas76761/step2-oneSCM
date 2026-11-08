# Batch 109 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuer Markt Südkorea**

Für den Bereich Revenue Management wurde die Anwendung für den neuen Markt Südkorea vorbereitet und freigeschaltet. Dazu wurde das System für Südkorea konfiguriert. Dies umfasst die Aktivierung von NEMESIS sowie das Senden von Ereignissen an NEMESIS. Für den Länderschlüssel KR ist die Währung KRW hinterlegt.

Außerdem wurden die Batch-Jobs für Südkorea angelegt, und zwar alle Jobs, die auf der zugehörigen Seite zu den Batch-Jobs im Confluence beschrieben sind. Für den Datenaustausch wurden die S3-Pfade für die Schnittstellen eingerichtet: für SWT je ein Ein- und Ausgangsverzeichnis (KR_E169), für VEGA die Ausgangsverzeichnisse I155 und I155_LOGS sowie die Eingangsverzeichnisse I156 und I131, und für NEMESIS ein Eingangsverzeichnis für fachliche Fehler (FUNCTIONALERRORS). Zusätzlich wurden die CFT-Flows und MPay für den südkoreanischen Markt konfiguriert.

Hinweis zur Dokumentation: Der SAP Company Code für Südkorea ist in den vorliegenden Angaben nicht festgelegt (dort steht nur ein Fragezeichen). Auch der VEGA-Länderschlüssel-Eintrag ist in den Rohdaten nicht lesbar. Beide Angaben sollten vor Veröffentlichung ergänzt oder bestätigt werden.

**Excel-Export und Rechnungsanzahl**

Es wurde ein Fehler im Zusammenhang mit dem Excel-Export behandelt, bei dem die Anzahl der Zeilen in der exportierten Datei nicht mit der Anzahl der in der Benutzeroberfläche angezeigten Rechnungen übereinstimmte. Das Ticket ist inzwischen geschlossen. Details zur Ursache oder zur Lösung sind in den vorliegenden Angaben nicht enthalten.

**Nicht berücksichtigter Eintrag**

Ein weiterer Eintrag trägt die Bezeichnung eines End-to-End-Testlaufs (Probe, zum Löschen vorgesehen) und enthält ausschließlich Vorlagentexte ohne fachlichen Inhalt. Er wurde daher nicht in das Benutzerhandbuch übernommen.