# Batch 424 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsvorschau (PDF) bei nicht verfügbaren Fahrzeugdaten**

Die Vertragsvorschau als PDF-Dokument berücksichtigt jetzt den Fall, dass Fahrzeugdaten wie Fahrgestellnummer, Kennzeichen oder Baumuster nicht vorliegen. Das betrifft zum Beispiel Fahrzeuge, die der Kunde bestellt hat und für die er einen Servicevertrag abschließen möchte (Built to order), sowie Fahrzeuge, die der Händler bereits an den Kunden verkauft hat (Build to stock). Bei der Vertragserstellung stehen drei Wege zur Auswahl: Fahrgestellnummer, Auftragsnummer oder Modellcode (Baumuster). Zusätzlich gibt es einen Schalter, mit dem der Anwender angibt, dass das Datum der Erstzulassung nicht verfügbar ist. Auf Grundlage der bei der Vertragserstellung übermittelten Daten wählt das System automatisch den passenden Dokumenttyp für die Vertragsvorschau aus und zeigt ihn an. Sind einzelne Angaben als „-“ oder als Text gekennzeichnet, wird der jeweils übermittelte Wert unverändert in das Dokument übernommen.

**E-Mail-Vorlage für die Vertragsverlängerung**

In den Stammdaten kann nun eine E-Mail-Benachrichtigungsvorlage für verlängerte Verträge angelegt werden, die an den Vertragsinhaber versendet wird. Die Erstellung erfolgt im Administrationsbereich unter Vorlagenverwaltung im Reiter „Benachrichtigung“ über „Vorlage erstellen“ und anschließend „E-Mail“. Voraussetzung ist, dass Kopf- und Fußzeilenvorlagen bereits definiert sind.

Als Pflichtangaben erfassen Sie den Vorlagennamen (maximal 25 Zeichen), den Markt (standardmäßig Deutschland), den Verwendungszweck (hier „Short term prolongation“) und das Datum „Gültig ab“. Optional können Sie die Sparte (PC oder VAN) und die Sprache festlegen. Sind Pflichtfelder nicht ausgefüllt, weist das System auf das betreffende Feld hin. „Als Entwurf speichern“ bleibt dann möglich, „Veröffentlichen“ jedoch nicht.

Im Anschluss gestalten Sie den Inhalt der E-Mail gemäß dem MB Style Guide: Betreff, Kopf- und Fußzeile sowie den Text im Vorlageneditor. Der Betreff lautet „Service Contract Prolongated (Contract Number: %Contract Number)“, wobei die Vertragsnummer erst beim Versand eingesetzt wird. Der Text enthält Platzhalter (Druckvariablen), die per Drag-and-drop eingefügt werden, etwa für Vor- und Nachname, Verlängerungsart und -zeitraum. Eine Tabelle stellt den aktuellen Vertrag dem Vertrag nach der Verlängerung gegenüber, und zwar mit Vertragsbeginn, geplantem Vertragsdatum, Vertragsdauer, Jahres- und Gesamtlaufleistung, Zahlungsart und Betrag. Die Vorlage schließt mit einem Hinweis auf den Kundenservice, der Grußformel des Service-Contract-Teams und marktspezifischen Kontaktdaten.

Mit „Test-E-Mail senden“ erhält der angemeldete Anwender eine E-Mail im selben Format wie der Kunde, einschließlich Betreff, Kopfzeile, Fußzeile und Inhalt. „Als Entwurf speichern“ sichert den Zwischenstand, ohne dass die Vorlage in Geschäftsprozessen angewendet wird. „Veröffentlichen“ macht die endgültige Version verfügbar, die ab dem Datum „Gültig ab“ zum Einsatz kommt. Veröffentlichte Vorlagen erscheinen in der Übersichtsseite der Vorlagen.

**Korrekturen und Anpassungen in der Vorlagenverwaltung**

In der Vorlagenverwaltung wurde ein Fehler behoben, bei dem beim Abrufen von Vorlagenprodukten der Statuscode 500 zurückgegeben wurde. Außerdem wurden aus der Stammdatenvorlage für die E-Mail-Benachrichtigung, die versendet wird, wenn ein Kunde Preisinformationen anfordert, die Preis- und Produktdetails entfernt.