# Batch 395 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 31 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Dokumente und Kommunikation – Neuerungen und Änderungen

Im Bereich Dokumente und Kommunikation wurden Anpassungen an Vertragsdokumenten, Vorlagen und Benachrichtigungen umgesetzt. Die folgenden Abschnitte fassen die abgeschlossenen Änderungen sowie die noch geplanten Erweiterungen zusammen.

Änderungen an Vertragsdokumenten

Für Gewerbekunden (Pkw und Vans) wurde in den Vertragsdokumenten im Abschnitt „Produktdetails“ das neue Feld „Branche“ ergänzt. Bei der Vertragserstellung wird der Wert angezeigt, der beim Anlegen des Vertrags auf der Vertragsseite erfasst wurde. In der Vorlagenverwaltung steht hierfür eine neue Druckvariable zur Verfügung. Ist das Feld leer, wird auch die Bezeichnung nicht angezeigt. Außerdem wurde der Ablauf für die Unterschrift im Servicevertrags-PDF überarbeitet: Die Unterschrift des Marktes soll aus allen Servicevertrags-Dokumenten entfernt werden, sodass dort nur noch die Unterschrift des Kunden verbleibt. Auch die Möglichkeit der Markt-Unterschrift in der Vorlagenverwaltung, die zugehörige Beschränkung sowie der Unterschriftstyp für alle Märkte sollen entfallen. Die Funktion in der Vorlagenverwaltung wird dabei über einen für Anwender nicht sichtbaren Feature-Toggle gesteuert, da sie für andere Märkte noch benötigt werden könnte. Ein zusätzlicher Hinweistext auf den Servicevertrags-PDFs ist vorgesehen, sein Wortlaut ist jedoch noch zu definieren.

Vorlagen und Benachrichtigungen

Vorlagen und Benachrichtigungen wurden an die aktuellen BDS-Standards angeglichen. Zudem wurde die Darstellung von E-Mail-Benachrichtigungen angepasst, damit sie in den fünf in Deutschland am häufigsten genutzten E-Mail-Programmen wie vorgesehen angezeigt werden. Für Privat- und Gewerbekunden zählen dazu Web.de, GMX, Gmail, Outlook und Yahoo. Für den B2B-Bereich sind vor allem Web.de, GMX und Gmail relevant. Außerdem wurde eine Vorlage für eine E-Mail-Erinnerung eingeführt, die versendet wird, wenn das Gültigkeitsdatum eines Vertragsangebots kurz vor dem Ende steht.

In der Verwaltung von AGB-Vorlagen gilt nun: Eine Vorlage kann nur noch erstellt werden, wenn mindestens ein Produkt aus der Auswahlliste verknüpft ist, andernfalls steht die Schaltfläche zum Veröffentlichen nicht zur Verfügung. Entsprechend wird beim Überfahren der Produktauswahl „Servicevertrag“ mit der Maus keine Information mehr angezeigt.

Auf der Kundendetailseite entfallen die Schalter für die DSGVO-Einwilligung und für die Allgemeinen Geschäftsbedingungen.

Behobene Fehler

Behoben wurden unter anderem folgende Probleme: Bei der Unterschrift vor Ort wurden der QR-Code und die Seite zum Unterschreiben des Vertrags nicht erzeugt. In der Vorlagenverwaltung wurden bei der Erstellung von Vertragsvorlagen die Druckvariablen nicht angezeigt. Nach Aktivierung eines Vertrags ging die Aktivierungs-E-Mail nicht ein. Nach einer langfristigen Vertragsverlängerung und der Unterschrift über DSS wurde das Dokument nicht aktualisiert. Zudem erhielt der zuständige Mitarbeiter keine Benachrichtigung zur Freigabe einer Kulanzkampagne. Weitere Korrekturen betrafen falsche Standardwerte bei Platzhaltern, die Zeichenkodierung der Vorlagenvorschau (UTF-8), die Anzeige interner Benachrichtigungen in den Entwicklungs- und Integrationsumgebungen, das falsche Format der Restlaufzeit in der E-Mail zur Vertragsübernahme, identische Kundennamen im Unterschriftsbereich von Verkäufer und Käufer in der Vertragsübernahme-Vorlage sowie die fehlende Speicherung der CIAM-ID in der DSS-Entität bei der Vor-Ort-Option.

Geplante Erweiterungen

Noch offen sind folgende Erweiterungen: Anwender sollen E-Mail-Vorlagen für Benachrichtigungen sowie Vorlagen für Dokumente für gewerbliche Kunden (B2B) erstellen können. Für die Benachrichtigung beim Klick auf die Schaltfläche „E-Mail senden“ bei einer langfristigen Verlängerung ist eine Anpassung vorgesehen. Ebenfalls geplant sind Master-E-Mail-Vorlagen als Erinnerung 30 bzw. 60 Tage vor dem geplanten Vertragsende, die Anwender mit E-Mail-Inhalten für Kunden befüllen können. Darüber hinaus ist eine Master-E-Mail-Vorlage für alle Anwendungsfälle der Vertragsprüfung vorgesehen: Der Kunde muss zahlen, der Kunde muss nicht zahlen oder dem Kunden wird ein Betrag gutgeschrieben. Schließlich soll es künftig möglich sein, Dokumente und Benachrichtigungen in den jeweiligen Registerkarten nach ihrem Namen zu durchsuchen.