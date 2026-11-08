# Batch 386 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente und Kommunikation: Vorlagen in den Sprachen des Marktes**

Wenn ein MPC-Benutzer eine Benachrichtigungsvorlage anlegt, wird künftig nicht mehr nur eine einzelne Vorlage in der gewählten Sprache erzeugt. Sobald eine neue Vorlage in einer Sprache veröffentlicht wird, erstellt das System automatisch geklonte Vorlagen mit demselben Aufbau in allen Sprachen, die in der Marktkonfiguration zugelassen sind, mit Ausnahme der Hauptsprache. Sind in der Marktkonfiguration beispielsweise Deutsch und Englisch hinterlegt und der MPC-Benutzer erstellt eine Vorlage auf Deutsch, entsteht automatisch eine Kopie mit der Sprache Englisch. Dies gilt sowohl für Dokumentvorlagen als auch für E-Mail-Vorlagen. Eine automatische Übersetzung der erzeugten Vorlagen findet nicht statt, da die Richtlinie des Herstellers den Einsatz von KI-Übersetzungen nicht zulässt.

Die automatisch erzeugten Vorlagen erhalten den Status „Draft“ und werden als geändert von „oneSCM“ angezeigt (zuvor „System“). Sie erscheinen im Ergebnisbereich der Dokument- bzw. E-Mail-Vorlagen. Der MPC-Benutzer kann sie ansehen und bearbeiten. Speichert er Änderungen während der Bearbeitung, bleibt der Status „Draft“. Sobald die Vorlage überarbeitet ist und der Benutzer auf „Publish“ klickt, wechselt der Status auf „Published“.

Zusätzlich lassen sich Vorlagen löschen, und zwar sowohl bei Dokumenten als auch bei E-Mails. Neben der Schaltfläche zum Erstellen einer Vorlage steht dafür eine Löschoption zur Verfügung. Über Kontrollkästchen können einzelne oder alle Vorlagen ausgewählt werden, damit nicht benötigte Vorlagen entfernt werden können. Wählt der Benutzer „Alle auswählen“, werden sämtliche Kontrollkästchen markiert. Beim Klick auf „Löschen“ erscheint ein Warnhinweis als Pop-up. Mit „Abbrechen“ im Pop-up gelangt der Benutzer zurück zur aktuellen Seite; auch nach dem Bestätigen mit „Löschen“ kehrt er zur aktuellen Seite zurück.

Beim Löschen werden die Vorlagen aus der Datenbank entfernt. Gelöscht werden dürfen nur Vorlagen, für die mindestens eine aktive, veröffentlichte Vorlage vorhanden ist. Für jeden Vorlagentyp muss also eine aktive veröffentlichte Vorlage im System verbleiben, alle übrigen können gelöscht werden. Nach dem Löschen zeigt das System ein Pop-up mit der Meldung, dass die genannten Vorlagen erfolgreich gelöscht wurden und die übrigen Vorlagen nicht gelöscht werden konnten, da sie aktiv und veröffentlicht sind.

**Weitere Themen im Bereich Dokumente und Kommunikation**

Die Validierung der Vega-ID bei der Registrierung eines Händlers war uneinheitlich; dieses Problem wurde behoben.

Für den Upload und das Prüfen von Dokumenten beim Drucken und Hochladen ist eine Beschleunigung vorgesehen. Derzeit dauern Upload und Prüfung etwa eine Minute. Geprüft werden dabei der QR-Code mit der Angebotsnummer, die mit der Nummer aus oneSCM übereinstimmen muss, sowie die Unterschrift des Kunden. Ziel ist es, die Dauer auf unter 20 Sekunden zu senken und in der Oberfläche einen Ladezustand anzuzeigen, der erklärt, dass Prüfungen durchgeführt werden. Damit soll ein effizienter, reibungsloser Ablauf für den Händler gewährleistet werden. Das Vorhaben befindet sich im PI-Backlog.

Außerdem wird untersucht, ob Benutzer auch Dokumente im Querformat hochladen können und ihr Format bei der Anzeige beibehalten wird. Bisher werden hochgeladene Querformat-Dokumente abgeschnitten dargestellt. Dieses Thema befindet sich in der Explorationsphase und ist noch nicht umgesetzt.