# Batch 408 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 24 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente und Kommunikation**

Im Bereich Dokumente und Kommunikation wurden mehrere Verbesserungen an der Vertragssignatur, an den E-Mail-Vorlagen und an der Vorlagenverwaltung vorgenommen.

**Digitale Signatur**

Wird ein Dokument vom Kunden vor Ort (On Premise) signiert, bleibt der Benutzer bzw. Händler nach erfolgreicher Signatur nicht mehr auf der Seite mit dem QR-Code, sondern wird auf die Übersicht aller Verträge weitergeleitet. Behoben wurde außerdem ein Fehler, bei dem die Signatur vor Ort aufgrund einer ungültigen Archiv-Konfiguration im Signaturdienst (DSS) mit einer fehlerhaften Anfrage (Bad Request) abgelehnt wurde.

Auch der Build-to-Stock-Ablauf funktioniert nun mit der digitalen Signatur. Da die Signatur-Schnittstellen ein Enddatum zwingend voraussetzen, bei diesem Ablauf aber noch kein Enddatum vorliegt (der Vertrag hat noch keine erste Fälligkeit), wird zunächst das aktuelle Datum als Enddatum verwendet, damit die Signatur ausgelöst werden kann. Sobald das Datum der ersten Fälligkeit aus der Vertragserstellung vorliegt, wird es durch das korrekte Enddatum ersetzt, damit die Archivierung stimmt. Dies gilt für alle Fälle, in denen das Enddatum leer ist.

**E-Mail-Vorlagen und Benachrichtigungen**

Bei der Erstellung einer E-Mail-Vorlage kann im Auswahlfeld „Used For“ der Eintrag „TASK_ASSIGMENT“ gewählt werden. Eine solche Vorlage lässt sich sowohl als Entwurf speichern als auch veröffentlichen.

Für E-Mail-Benachrichtigungen bei bestimmten Vertragsereignissen können Vorlagen als Entwurf gespeichert oder veröffentlicht werden. Dies betrifft die Ereignisse Kündigung (Terminated), Reaktivierung (Reactivation) und Ablauf (Expired). Die eingegebenen Daten bleiben dabei auf der Übersichtsseite erhalten. Ebenso kann in den Stammdaten-Vorlagen eine E-Mail-Vorlage für die Benachrichtigung bei einer Vertragsverlängerung (Prolongation) veröffentlicht werden.

Korrigiert wurden zudem Abweichungen bei den E-Mail-Inhalten: Der Inhalt der E-Mail zur Aktivierung eines aktualisierten Dienstleistungsvertrags sowie der Inhalt der E-Mail bei einer kurzfristigen Verlängerung entsprach nicht der hinterlegten E-Mail-Vorlage und wurde angepasst.

**Allgemeine Geschäftsbedingungen (T&C)**

Die Erstellung der Allgemeinen Geschäftsbedingungen (T&C) orientiert sich nun an der Produkterstellung. Bisher konnte ein Produkt ohne gültige T&C veröffentlicht werden. Künftig wird die MPC darauf hingewiesen, wenn ein Produkt keine gültigen T&C besitzt und diese angelegt werden müssen. Dabei werden Daten aus dem Produkt übernommen und in die Felder der Erstellungsseite vorbelegt: Die Sparte und der Produktname stammen aus dem definierten Produkt, das Feld „Gültig ab“ entspricht dem im Produkt festgelegten Startdatum, und Markt und Sprache richten sich nach dem Markt des Benutzers. Zusätzlich wird das Produktmanagement darüber informiert, dass für das Produkt keine T&C existieren.

Ist eine Vorlage einem veröffentlichten Produkt zugeordnet, kann sie nicht gelöscht werden. T&C müssen einen Inhalt haben, entweder als hochgeladene Version oder über den Editor. Andernfalls ist das Speichern nicht möglich.

**Noch offene Punkte**

Folgende Funktionen sind derzeit noch nicht abgeschlossen: Für Vertragsvorlagen zur Vertragsaktivierung und für Angebote soll die MPC künftig zusätzlich zwei Unterschriften von Marktvertretern und eine Kundenunterschrift, das aktuelle Ausstellungsdatum des Vertrags links unter der Vertragsnummer sowie die Angaben zum Verkäufer (die Person, die den Vertrag verkauft) einfügen können. Außerdem soll bei der Vertragserstellung in der Vertragsvorschau ein Wasserzeichen „DRAFT“ auf der Vorlage und in den Zahlungsplan-Details angezeigt werden. Nach der Aktivierung des Vertrags entfällt dieses Wasserzeichen.

Für den manuellen Versand von E-Mails oder den erneuten Versand von Dokumenten an Kunden ist noch zu prüfen, dass der E-Mail-Text den in der Vorlagenverwaltung definierten Markt-Kopf und die Markt-Fußzeile enthält. Auch die manuelle Prüfung der systeminternen Benachrichtigungen (Teil 1: erweiterte Funktionen, einschließlich Zuweisung) steht noch aus.