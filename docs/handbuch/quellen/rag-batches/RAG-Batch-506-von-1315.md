# Batch 506 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vorlagenverwaltung: Übersichtsseite für Dokumentvorlagen**

Die Vorlagenverwaltung (Template Management) ist ein Arbeitsbereich, in dem Märkte Kundendokumente und E-Mail-Vorlagen über eine benutzerfreundliche grafische Oberfläche selbst erstellen und verwalten können. Vorlagen und Bausteine lassen sich wiederverwenden, sodass personalisierte und regelkonforme Kundendokumente schnell entstehen. Die Gestaltung und Erzeugung von Dokumenten ist dabei mit den Prozessen des Servicevertrags verknüpft. Jeder Markt kann die Vorlagen an lokale Anforderungen anpassen, dabei bleiben die Mercedes-Benz-Richtlinien und die Einheitlichkeit gewahrt. Der Bereich umfasst die Verwaltung der Vorlagen, die Auslöser für die Erzeugung von Dokumenten und E-Mails, Zugriffssteuerung sowie Rollen. Benutzer können Dokumentvorlagen, die über den gesamten Lebenszyklus eines Servicevertrags benötigt werden, anlegen, ansehen, ändern und löschen.

**Aufruf und Aufbau der Übersichtsseite**

Nach der Anmeldung öffnen Sie den Admin-Bereich und wählen dort die Vorlagenverwaltung. Es erscheint die Übersichtsseite, die in die zwei Kategorien Dokumente und Benachrichtigungen unterteilt ist. Beim Laden der Seite ist standardmäßig die Kategorie Dokumente aktiv. Die Tabelle zeigt zunächst die zuletzt aktualisierten Einträge zuerst an.

**Suche und Filter**

Oberhalb der Tabelle stehen folgende Suchfelder zur Verfügung: Vorlagenname (Texteingabe, maximal 56 Zeichen), Markt (Auswahlliste, abhängig von der Benutzerrolle; im MVP ist Deutschland verfügbar), Vorlagentyp (SEPA, Vertragsbedingungen, Blöcke, Kopfzeile, Fußzeile) und „Verwendet für“ (Vertragsangebot, Vertragsaktivierung). Mit der Schaltfläche „Zurücksetzen“ werden alle Felder geleert und der Standardzustand der Seite wird wieder angezeigt. Mit „Suchen“ wird die Suche anhand der ausgefüllten Felder ausgeführt. Findet sich kein passender Eintrag, erscheint ein Hinweis, dass keine Ergebnisse gefunden wurden. Über „Weitere Filter“ lässt sich die Suche zusätzlich nach Division, Marke, Sprache und Service-Contract-Produkt eingrenzen.

**Die Ergebnistabelle**

Die Tabelle enthält die Spalten Markt, Vorlagentyp, „Verwendet für“, Letzte Aktualisierung, Erstellt von, Gültig ab und Status. Der Status ist entweder „Entwurf“ oder „Veröffentlicht“. Die Spalten Markt, Vorlagentyp, „Verwendet für“, „Erstellt von“ und Status lassen sich alphabetisch sortieren. Die Spalten „Letzte Aktualisierung“ und „Gültig ab“ lassen sich vom neuesten zum ältesten Eintrag sortieren.

**Aktionen pro Eintrag**

Jede Zeile bietet eine Aktionsschaltfläche mit folgenden Funktionen:

„Bearbeiten“ führt Sie zur Erstellungsseite des gewählten Vorlagentyps. „Ansehen“ öffnet die Vorschau der Vorlage. „Löschen“ ist nur für Vorlagen im Status „Entwurf“ möglich, und zwar dann, wenn auf Grundlage des Feldes „Gültig ab“ bereits eine neuere Version der Vorlage existiert. Bei Erfolg erscheint die Meldung „Item has been deleted successfully“. Kann die Vorlage nicht gelöscht werden, weil sie von einem Prozess verwendet wird, erscheint die Meldung „Item could not be deleted. Process is using the template.“ „Herunterladen“ steht nur für statische Vorlagen wie Vertragsbedingungen zur Verfügung. „Duplizieren“ führt Sie zur Seite der gewählten Vorlage. Der Inhalt ist dort bereits vorhanden und kann geändert werden, alle Felder sind jedoch leer und müssen neu gesetzt werden. Vor dem Veröffentlichen wird geprüft, dass kein weiterer Vorlagentyp mit denselben Pflichtparametern existiert. Diese Pflichtparameter sind Markt, „Verwendet für“ und „Gültig ab“. Gibt es bereits eine solche Vorlage, erscheint der Hinweis „Template already exists, cannot be published.“

Vorlagen im Status „Entwurf“ werden nach 30 Tagen automatisch gelöscht.

**Seitenaufteilung der Tabelle**

Übersteigt die Zahl der Ergebnisse die maximale Anzahl pro Seite, werden die Ergebnisse auf mehrere Seiten verteilt, zwischen denen Admin-Benutzer blättern können. Standardmäßig werden 10 Einträge pro Seite angezeigt. Über eine Auswahlliste können Sie alternativ 20, 30, 40 oder 50 Einträge pro Seite einstellen. Die zuletzt gewählte Anzahl wird nicht gespeichert und nach einer Aktualisierung der Seite wieder auf 10 zurückgesetzt.

**Neue Vorlage erstellen**

Über die Schaltfläche „Vorlage erstellen“ öffnet sich eine Liste mit den Werten Vertragsbedingungen (T&C), SEPA-Mandat, Block, Kopfzeile und Fußzeile. Mit der Auswahl eines Wertes gelangen Sie zur entsprechenden Seite, auf der Sie die neue Vorlage anlegen.

**Gestaltung**

Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.