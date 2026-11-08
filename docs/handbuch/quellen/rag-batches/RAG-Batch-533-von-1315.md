# Batch 533 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Benutzeroberfläche**

Im Bereich der Benutzeroberfläche wurden mehrere Abläufe rund um die Vertragsverwaltung automatisiert abgesichert. Abgeschlossen ist der Smoke-Test zum Anlegen eines Vertrags für den Kundentyp „Behörde" (Governmental). Er prüft, dass sich ein solcher Vertrag über die Oberfläche erstellen lässt.

Für weitere Abläufe sind automatisierte Qualitätsprüfungen vorgesehen, aber noch nicht abgeschlossen. Dazu gehören die Zahlungsintervalle (jährlich, halbjährlich und vierteljährlich), die Änderung der Zahlungsart, Verträge mit technischen Optionen, Verträge mit Kontingentprodukten, die Vertragsprüfung (Contract Review) sowie die Bearbeitung von Verträgen. Zu diesen Punkten liegen derzeit keine näheren Angaben zu Umfang, Zielverhalten oder Abnahmekriterien vor. Die Prüfung der Änderung des Zahlers bei einem Vertrag wurde nicht weiterverfolgt und ist abgebrochen.

**Edge Services: Fehlerbehandlung**

Bisher lieferte die interne Schnittstelle bei Fehlern zwar spezifische Fehlercodes wie 403 (Forbidden). An die externe Schnittstelle wurden diese Codes jedoch nicht korrekt weitergegeben. Dort kam stattdessen immer der allgemeine Fehlercode 500 (Internal Server Error) an. Das erschwerte die Fehlersuche und machte Tests für die angebundenen Systeme schwierig, da nicht erkennbar war, was die eigentliche Ursache eines Problems war.

Mit der Neuerung werden interne Fehlercodes nun in die passenden externen Entsprechungen übersetzt und an die Nutzer der Edge Services weitergereicht. Meldet die interne Schnittstelle einen Fehler 403, erhält die externe Schnittstelle ebenfalls einen Fehler 403. Das Gleiche gilt für die Fehler 404 und 500. Auch weitere Fehlercodes werden bei Bedarf von diesem Mechanismus behandelt. Davon profitieren vor allem Partnersysteme wie VANs, Leasing und Online-Vertrieb, die dadurch mehr Transparenz erhalten und Fehlerursachen leichter nachvollziehen können.