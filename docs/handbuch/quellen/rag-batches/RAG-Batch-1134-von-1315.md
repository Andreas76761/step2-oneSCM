# Batch 1134 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Schreibgeschützte Benutzerrolle („Readonly User")**

Mit der schreibgeschützten Benutzerrolle stellt oneSCM einen reinen Lesezugriff auf die Anwendung bereit. Die Rolle richtet sich an Stakeholder, die sich in oneSCM informieren und Daten entnehmen möchten, ohne dabei versehentlich ungewollte Aktionen im System auszulösen. Ebenso ist vorgesehen, dass ein automatisierter Zugriff (etwa durch einen Crawler-Agenten) bestimmte Inhalte einsehen und kopieren oder per Screenshot festhalten kann. Zuvor gab es keine solche Rolle.

Für Benutzer mit dieser Rolle gilt in allen Bereichen derselbe Grundsatz: Informationen werden vollständig angezeigt, Funktionen zum Anlegen, Bearbeiten, Löschen, Hochladen oder Versenden sind ausgeblendet oder nicht auslösbar. Fehlermeldungen und defekte Verknüpfungen, die bei dieser Rolle zuvor auftraten, wurden behoben.

**Allgemeine Oberfläche**

Auf der Startseite erscheint für die schreibgeschützte Rolle keine Standardfehlermeldung mehr. Im Kopfbereich sind alle Benachrichtigungen sichtbar, die Löschfunktion für Benachrichtigungen wird jedoch ausgeblendet. Die Verweise im Fußbereich (Impressum, Datenschutzerklärung, Nutzungsbedingungen) sind erreichbar.

**Produktverwaltung**

Benutzer können in der Produktübersicht alle Preistabellen sowie die Informationen zu den Allgemeinen Geschäftsbedingungen je Produkt einsehen. Die Produktdetailseite zeigt Preisversionen mit allen Daten und Tabellen, sämtliche Blueprint-Informationen einschließlich der Zahlungsoptionen, die vollständigen Deckungsinformationen sowie die berechneten Felder wie maximale Laufleistung und Alter bei Vertragsende. Kampagnen werden mit allen Angaben dargestellt, darunter Rabattart, Gültigkeitszeitraum, Typ und Preistabellen. Für Blueprints steht eine eigene Detailansicht mit allen relevanten Informationen zur Verfügung. In der Deckungscode-Ansicht werden die Langbeschreibungen angezeigt. Ein Klick auf einen Schadencode führt zur zugehörigen Detailansicht. Die Aktionen zum Anlegen, Bearbeiten und Deaktivieren von Branchencodes sind ausgeblendet. Auch das Dokument der Allgemeinen Geschäftsbedingungen kann geöffnet werden.

**Vertragserstellung und Antragsverwaltung**

Der Menüpunkt für Vertragsanträge ist in der Hauptnavigation verfügbar, und der Prozess der Vertragserstellung ist bis zum Schritt des Zahlungsplans nutzbar. Der Signaturprozess lässt sich nicht auslösen. Aktionsschaltflächen in der Antragsverwaltung sind nicht zugänglich. Verträge können nicht aktiviert oder abgelehnt werden, Antragsdaten und Kennzeichen sind nicht bearbeitbar, und Dokumente können weder hochgeladen oder ersetzt noch E-Mails versendet oder erneut versendet werden. Anträge im Status „Created" lassen sich über die Referenznummer ohne Fehler ansehen. MO-Checks können nicht durchgeführt werden, und Sonderfälle können weder bearbeitet noch abgelehnt oder genehmigt werden. In der Vertragsdetailansicht sind der Kilometerstand zum Verkaufsdatum und das Kennzeichen nicht änderbar; auch hier sind Dokumenten-Upload und E-Mail-Versand nicht möglich.

**Kundenverwaltung**

Auf der Kundendetailseite erscheint keine Fehlermeldung zu Adressvorschlägen mehr. Die Kundenvorschau zeigt die Daten in einer schreibgeschützten Ansicht ohne Fehler und ohne editierbare Leerfelder.

**Rechnungswesen**

Die Sortierung der Rechnungsübersicht ist für alle Rollen einheitlich. Kommentare können von der schreibgeschützten Rolle weder in der Rechnungsdetailansicht noch bei Altteilsteuer-Rechnungen, manuellen Altteilsteuer-Rechnungen oder internationalen Werkstattrechnungen hinzugefügt werden.

**Markteinstellungen und Partnerverwaltung**

In der Marktkonfiguration werden die ausgewählten Rechtsformen angezeigt, und hochgeladene Dokumente lassen sich öffnen. Das Löschsymbol für zukünftige Inflationsfaktoren und die Funktion zum Hinzufügen einer Inflationsrate sind ausgeblendet; die Nemesis-Checkbox ist nicht bedienbar. Registrierung, Upload, Bearbeiten und Löschen von Händlerbetrieben sowie die Registrierung, Bearbeitung und Löschung von Märkten sind für diese Rolle nicht sichtbar. Lieferanten können nicht registriert, bearbeitet oder gelöscht werden.

**Fahrzeugverwaltung, Vertragsprüfung und Administration**

Motorbaureihen und technische Optionen werden angezeigt. Die Schaltflächen für den ISP-Datenupload und den Datei-Upload im Cross File Transfer sind ausgeblendet. Das Informationsbanner wird im Lesemodus ohne Bearbeitungsmöglichkeit dargestellt. In der Vertragsprüfung ist der Reiter „Operative Review" sichtbar, die Bearbeiten-Schaltfläche dagegen ausgeblendet. Dasselbe gilt für die Bearbeiten-Schaltfläche im Administrationsbereich.