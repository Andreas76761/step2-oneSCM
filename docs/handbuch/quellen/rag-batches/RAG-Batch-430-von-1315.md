# Batch 430 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vorlagenverwaltung für Dokumente (Templates Documents Overview)**

Die Vorlagenverwaltung (Template Management) steht im Admin-Bereich zur Verfügung und ermöglicht es, die für den gesamten Lebenszyklus eines Servicevertrags benötigten Dokumentvorlagen anzulegen, einzusehen, zu bearbeiten und zu löschen. Nach der Anmeldung wählt der Benutzer im Admin-Bereich die Vorlagenverwaltung aus und gelangt auf die Übersichtsseite. Diese ist in zwei Bereiche gegliedert: Dokumente und Benachrichtigungen. Beim Laden der Seite ist standardmäßig der Bereich „Dokumente“ aktiv. Die Oberfläche folgt dem Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

Im Dokumentenbereich lässt sich die Vorlagenliste über mehrere Felder durchsuchen: Vorlagenname (Freitext, maximal 56 Zeichen), Markt (Dropdown, abhängig von der Benutzerrolle; im MVP Deutschland), Vorlagentyp (SEPA, Vertragsbedingungen, Blöcke, Header, Footer) sowie „Verwendet für“ (Vertragsangebot oder Vertragsaktivierung). Über den Link „Weitere Filter“ stehen zusätzlich die Filter Division, Marke, Sprache und Servicevertragsprodukt zur Verfügung. Mit „Suchen“ wird die Suche anhand der ausgefüllten Felder ausgeführt. Existiert kein passendes Ergebnis, erscheint ein entsprechender Hinweistext („No results found“). Mit „Zurücksetzen“ werden alle Felder geleert und der Standardzustand der Seite angezeigt.

Die Ergebnisse erscheinen in einer Tabelle mit den Spalten Markt, Vorlagentyp, Verwendet für, Letzte Aktualisierung, Erstellt von, Gültig ab und Status (Entwurf oder Veröffentlicht). Die Spalten Markt, Vorlagentyp, Verwendet für, Erstellt von und Status sind von A bis Z sortierbar, die Spalten Letzte Aktualisierung und Gültig ab vom neuesten zum ältesten Eintrag. Standardmäßig wird die Tabelle nach dem neuesten Eintrag zuerst angezeigt.

Pro Tabellenzeile stehen mehrere Aktionen zur Verfügung. „Bearbeiten“ führt auf die Erstellungsseite des gewählten Vorlagentyps. „Ansehen“ öffnet eine Vorschau der Vorlage. „Löschen“ ist nur für Vorlagen im Status „Entwurf“ möglich; bei Erfolg erscheint die Meldung „Item has been deleted successfully“, andernfalls „Item could not be deleted. Process is using the template.“ „Herunterladen“ gilt nur für statische Vorlagen wie die Vertragsbedingungen. „Duplizieren“ öffnet die Seite der gewählten Vorlage mit übernommenem Inhalt; alle Felder sind leer und müssen neu gesetzt werden. Vor dem Veröffentlichen wird geprüft, dass keine andere Vorlage desselben Typs mit denselben Pflichtparametern Markt, Verwendet für und Gültig ab existiert. Ist das der Fall, erscheint der Hinweis „Template already exists, cannot be published.“ Eine veröffentlichte Vorlage kann somit als Ausgangspunkt für eine neue Vorlage dupliziert werden. Entwürfe werden nach 30 Tagen automatisch gelöscht.

Bei mehr Ergebnissen als pro Seite darstellbar wird die Tabelle auf mehrere Seiten aufgeteilt, zwischen denen Admin-Benutzer navigieren können. Standardmäßig werden 10 Datensätze pro Seite angezeigt; über ein Dropdown kann auf 20, 30, 40 oder 50 umgestellt werden. Die Auswahl wird nicht gespeichert und nach einer Aktualisierung der Seite auf 10 zurückgesetzt.

Über die Schaltfläche „Vorlage erstellen“ öffnet sich eine Liste mit den Werten Vertragsbedingungen, SEPA-Mandat, Block, Header und Footer. Die Auswahl eines Eintrags führt zur entsprechenden Erstellungsseite.

**Behobener Fehler bei den weiteren Filtern**

In den „Weiteren Filtern“ der Übersichtsseite wurde ein Fehler behoben: Zuvor wurde ein ausgewähltes Servicevertragsprodukt nicht in der Ergebnistabelle berücksichtigt. Erwartet wird, dass jede Auswahl aus der Produktliste in der Ergebnistabelle abgebildet wird.