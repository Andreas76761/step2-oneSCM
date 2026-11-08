# Batch 1227 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kampagnenübersicht (Manage Campaigns)**

Über den Menüpunkt „Manage Campaigns" im Hauptmenü der Produktverwaltung gelangen MPC-Benutzer auf die Kampagnenübersicht. Hier sind alle Kampagnen des jeweiligen Marktes auf einer Seite aufgelistet. Sie lassen sich durchsuchen, in ihrem Status verwalten und über Aktionen wie Bearbeiten, Duplizieren, Aktivieren und Deaktivieren weiterbearbeiten. Die Seite besteht aus einem Suchbereich und einer Tabelle mit den vorhandenen Kampagnen.

**Suchbereich**

Der Suchbereich trägt den Titel „Search Campaigns". Sie können nach dem Kampagnennamen und nach der externen Kampagnen-ID suchen; für beide Felder sind mindestens drei Zeichen erforderlich. Zusätzlich können Sie nach dem Jahr filtern, wofür ein vierstelliger numerischer Wert eingegeben wird, sowie nach dem Status, der über eine Auswahlliste mit allen möglichen Statuswerten gewählt wird. Wenn Sie in einem der Eingabefelder die Eingabetaste drücken, wird die Suche mit den aktuellen Eingaben ausgeführt. Dasselbe erreichen Sie über die Schaltfläche „Search for Campaigns" (Tooltip „Search"). Die passenden Kampagnen erscheinen anschließend in der Tabelle. Mit der Schaltfläche „X" (Tooltip „Reset") werden alle Eingabefelder und Filter geleert und die Suchergebnisse zurückgesetzt.

Die Filter wirken aufeinander: Eine Filterauswahl schränkt die Optionen der folgenden Filter ein. Wählen Sie beispielsweise den Status „Upcoming", werden nur Kampagnen mit diesem Status angezeigt. Beim Jahresfilter führt die Eingabe von 2023 dazu, dass nur Kampagnen angezeigt werden, die 2023 beginnen oder enden.

**Kampagnenbereich**

Der Bereich trägt den Titel „Overview". Darin wird ein Text im Format „Displaying [Anzahl pro Seite] of [Gesamtanzahl] records" angezeigt. Über ein Dropdown legen Sie fest, wie viele Einträge pro Seite erscheinen. Zur Auswahl stehen 10, 20, 30, 40 und 50, Standard ist 10. Außerdem gibt es eine Schaltfläche zum Anlegen einer Kampagne; deren Ablauf wird an anderer Stelle beschrieben.

Die Tabelle enthält die Spalten Campaign Name, External Campaign ID, Discount, Validity Period, Last Modified, Total Expense, Status und Actions. Standardmäßig werden alle Kampagnen des Marktes aus der Datenbank angezeigt. Gibt es nichts anzuzeigen, erscheint die Meldung „There are no campaigns to display".

Der Campaign Name zeigt den Namen der Kampagne. Die External Campaign ID zeigt die optionale externe ID, die bei der Definition der Kampagne vergeben wurde. Die Validity Period zeigt Start- und Enddatum der Gültigkeit, unabhängig vom Status. Last Modified zeigt, wann die Kampagne zuletzt geändert wurde und von wem. Total Expense ist die Summe aller Rabatte aller aktivierten Verträge der Kampagne; der Wert wird mit Informationen aus Stream 2 aktualisiert und bei jedem neu aktivierten Vertrag fortgeschrieben.

Die Tabelle lässt sich über die Spaltenköpfe sortieren. Standardmäßig ist sie nach „Last Modified" absteigend sortiert. Der erste Klick auf eine Spaltenüberschrift sortiert aufsteigend.

**Status von Kampagnen**

Eine Kampagne kann vier Status haben: Active, Finished, Upcoming und Deactivated. Über die Schaltfläche mit den drei Punkten in der Spalte „Actions" öffnet sich ein Menü mit den Aktionen, die für den jeweiligen Status möglich sind.

Active bedeutet, dass die Kampagne läuft: Das aktuelle Datum liegt zwischen Start- und Enddatum (einschließlich dieser Tage) und die Kampagne wurde nicht deaktiviert. Aktive Kampagnen werden bei der Preisermittlung für Fahrzeuge berücksichtigt. Dabei sind die vollen Beträge netto und brutto, die rabattierten Beträge netto und brutto sowie Kostenstelle und Kontonummer zu übermitteln. Auch eine Karenzzeit (Grace Period) wird berücksichtigt; währenddessen wird die Kampagne weiterhin als „Active" angezeigt. Der Preisservice stellt sicher, dass der Preis nie negativ wird, auch wenn der Betrag einer Kampagne vom Typ „Festbetrag" den unrabattierten Vertragspreis übersteigt. Bei aktiven Kampagnen können Sie bearbeiten, duplizieren und deaktivieren.

Finished bedeutet, dass die Kampagne durch Zeitablauf beendet ist, das aktuelle Datum also nach dem Enddatum liegt. Hier ist nur das Duplizieren möglich.

Upcoming bedeutet, dass das Startdatum in der Zukunft liegt. Hier können Sie bearbeiten, duplizieren und löschen.

Deactivated bedeutet, dass eine zuvor aktive Kampagne bewusst deaktiviert wurde und das aktuelle Datum weiterhin zwischen Start- und Enddatum liegt. Während dieser Zeit werden keine Rabatte auf Produkte und Preise angewendet, die an die Vertragserstellung übergeben werden. Hier können Sie bearbeiten, duplizieren und reaktivieren.

**Aktionen im Detail**

Bearbeiten: Der Bearbeitungsprozess folgt dem Ablauf zum Anlegen einer Kampagne. Der Assistent öffnet sich mit denselben Schritten, die Felder enthalten die gespeicherten Informationen, und er startet beim ersten Schritt. Alle Felder können geändert werden.

Duplizieren: Auch dieser Prozess folgt dem Ablauf zum Anlegen einer Kampagne. Es wird eine neue Kampagne mit denselben Funktionen und Besonderheiten erstellt. Der Assistent öffnet sich im ersten Schritt (Campaign Setup), in dem Sie z. B. direkt den Namen ändern können. Der Standardname lautet „Copy of [Name der duplizierten Kampagne]". Die Auswahl der Vertriebskanäle und die in Schritt 2 gewählten Produkte bzw. Cluster werden zurückgesetzt. Alle Felder können geändert werden.

Deaktivieren: Die Kampagne wird dann nicht mehr auf Produkte und Preise angewendet. Zuvor erscheint die Meldung „Are you sure you want to deactivate this campaign? This action will affect this ongoing campaign. Please confirm that you would like to proceed with the deactivation". Mit „Cancel" kehren Sie zur Übersicht zurück. Mit „Proceed" gelangen Sie ebenfalls zur Übersicht, und die Kampagne hat den Status „Deactivated".

Löschen: Diese Aktion ist für Kampagnen möglich, die erst in der Zukunft starten. Es erscheint die Meldung „Are you sure you want to delete this campaign? This action cannot be undone. Please confirm that you would like to proceed with the deletion." Mit „Cancel" kehren Sie zur Übersicht zurück. Mit „Proceed" gelangen Sie zur Übersicht, und die Kampagne wird nicht mehr aufgelistet.

Reaktivieren: Beim Reaktivieren erscheint die Meldung „Are you sure you want to activate this campaign? This action will affect this ongoing campaign. Please confirm that you would like to proceed with the deactivation". Mit „Cancel" kehren Sie zur Übersicht zurück. Mit „Proceed" gelangen Sie ebenfalls zur Übersicht, der Status wechselt zurück auf „Active", und die Kampagne wird wieder auf kompatible Produkte und Preise angewendet.