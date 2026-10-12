# Batch 353 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente & Kommunikation – Neuerungen und Änderungen**

**Kunden-QR-Code auf Druckdokumenten und Signaturarten**

Für Märkte, in denen die Signatur vor Ort nicht zulässig ist, wird der QR-Code im Unterschriftsbereich des Kunden angepasst. Bisher enthielt dieser QR-Code immer einen Link, der über das Customer Account Center die Signatur vor Ort auslöste. Das stellte in Märkten ohne zulässige Signatur vor Ort eine Lücke dar und entsprach nicht den rechtlichen Vorgaben. Künftig richtet sich der QR-Code nach der Marktkonfiguration: Ist die Signatur vor Ort deaktiviert, enthält der QR-Code auf dem gedruckten Dokument den DSS-Link für die Fernsignatur (Signatur per E-Mail). Ist die Signatur vor Ort aktiviert, enthält er weiterhin den DSS-Link für die Signatur vor Ort. Voraussetzung ist, dass die Fernsignatur in jedem Markt verpflichtend, immer aktiviert und schreibgeschützt ist, ihre Konfiguration also nicht geändert werden kann.

**SEPA-QR-Code**

Der SEPA-QR-Code für Händler enthält derzeit die Referenznummer, über die man nach dem Scannen zum zugehörigen Vertrag für den Upload gelangt. Da der QR-Code dadurch zu viele Informationen enthält, wird er teilweise nicht gelesen oder erkannt. Die Logik soll daher angepasst werden: Anstelle der Referenznummer wird eine Dokument-ID eingebettet, die zur Seite für den Upload des SEPA-Dokuments führt.

**Dokumente über UUID abrufen**

Dokumente werden bisher über numerische Datenbank-IDs identifiziert. Beim Kopieren von Daten von einer Umgebung in eine andere entstehen neue IDs, sodass ein Dokument auf zwei Umgebungen nicht mehr über dieselbe ID erkannt wird. Künftig sollen Dokumente über eine UUID identifiziert werden, um Datenübernahmen etwa von PROD nach PREPROD zu erleichtern. Dafür werden neue Versionen der Endpunkte bereitgestellt, die statt der ID die UUID verwenden. Microservices, die Dokumente aus dem Dokumentenmanagement abrufen, sollen diese neuen Endpunkte nutzen und die UUID für bestehende Dokumente importieren.

**Preisinformation: mehr Transparenz bei Neuzuordnung**

Weicht das Erstzulassungsdatum vom Vertragsbeginn ab, wird der Betrag auf den Rechnungen neu zugeordnet. In diesem Fall wird nun ein Hinweis auf dem Dokument angezeigt, der mit der Meldung des Vertrags in der Benutzeroberfläche übereinstimmt. Auf Englisch lautet er „Prices were updated because the First Registration Date is in the past.“, auf Deutsch „Preise wurden aktualisiert, da das Erstzulassungsdatum in der Vergangenheit liegt.“ Der Hinweis erscheint unter der letzten Zeile der Preistabelle, oberhalb der Produktkonfiguration. Der Vertrag übermittelt die Meldung im Payload; ist sie dort enthalten, wird sie auch auf dem Dokument angezeigt.

**Vorlagenverwaltung**

In der Vorlagenverwaltung kann nun für Dokumente, E-Mails und Systembenachrichtigungen nach Status gefiltert werden, und zwar nach „Draft“ (Entwurf) und „Published“ (Veröffentlicht).

**Behobene Fehler**

Im Bereich Dokumente wurden mehrere Probleme behoben. Das Häkchen bzw. X wird nun auf der Vorlage der Preisinformation angezeigt. Die Kundenunterschrift im Dokument erscheint nicht mehr auf einer neuen Seite. Außerdem wurden weitere gemeldete Probleme geschlossen: unvollständig dargestellte Kundendaten im Angebotsdokument (PC & VAN), eine nicht versendete Bestätigungs-E-Mail bei Signatur mit Ausdruck sowie eine fehlerhafte Formatierung beim Dokumenten-Upload.

**In Vorbereitung bzw. in Untersuchung**

Derzeit wird untersucht, wie sich eine Deaktivierung der Signatur vor Ort in einem Markt auswirkt. Zudem ist eine Exploration zum Einsatz von KI-Übersetzungen für Vorlagen geplant, die im Backlog liegt. Ziel ist, beim Erstellen von Entwürfen, auch bei Klonen der Standardvorlagen, automatisch Übersetzungen in alle in der Marktkonfiguration definierten Marktsprachen zu erzeugen. Dabei soll eine schlanke Lösung gefunden werden, die nicht zu viele Entwürfe erzeugt. Zu berücksichtigen ist, dass Märkte wie die Schweiz unter Umständen kein Englisch für Vorlagen nutzen. Beispiel: Veröffentlicht die Zentrale eine neue Standardvorlage auf Englisch und klont ein Markt wie die Schweiz diese, muss der Nutzer dem Klon eine Marktsprache zuweisen, und das System soll KI-Übersetzungen für alle Marktsprachen erstellen.