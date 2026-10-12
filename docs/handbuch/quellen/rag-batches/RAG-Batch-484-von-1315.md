# Batch 484 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Erweiterung der Vertragsvorlagen um Verkäuferdaten, Unterschriften, Wasserzeichen und Zahlungsplan**

Die Vorlagen für die Vertragsaktivierung und das Angebot (Contract Proposal) folgen dem Mercedes-Benz-Styleguide. Marktvertreter können sie nutzen und an die Anforderungen ihres Marktes anpassen. Die Vorlagen werden im Template Management erstellt und wurden um mehrere Elemente erweitert.

**Verkäufer- und Händlerdaten sowie Datum**

In die Vorlagen werden das aktuelle Datum, die Daten des Verkäufers (Vor- und Nachname, Telefonnummer, E-Mail-Adresse) sowie die Händlerdaten (Name und Adresse) aufgenommen. Das Datum entspricht dem Systemdatum zu dem Zeitpunkt, an dem der Entwurf bzw. der Vertrag für den Kunden bereitgestellt wurde. Die Verkäufer- und Händlerinformationen werden aus der ALICE-API vorbefüllt. Diese Angaben gelten für das Angebot im Status „Created“ sowie für die Vertragsaktivierung im Status „Active“. Bei der Vertragsaktivierung wird zusätzlich das Ausstellungsdatum des Vertrags ausgewiesen.

**Wasserzeichen für Entwürfe**

Angebote im Status „Created“ erhalten das Wasserzeichen „DRAFT“. Es wird in einem Winkel von 45 Grad angezeigt, die Deckkraft liegt bei 20 bis 30 Prozent (maximal 40 Prozent). Das Wasserzeichen erscheint ausschließlich im Status „Created“ und wird im Template Management hinterlegt, damit es verwendet werden kann. Bei der Vertragsaktivierung wird kein Wasserzeichen angezeigt.

**Unterschriften**

Das Angebot enthält keine Unterschriften. Die Vorlage für die Vertragsaktivierung enthält dagegen einen Unterschriftenbereich für zwei Mercedes-Benz-Vertreter und einen Kunden, jeweils mit den Texten „Signed for and on behalf of Mercedes-Benz“ bzw. „Signed for and on behalf of customer“. Die Unterschriften der Mercedes-Benz-Vertreter werden im Template Management angelegt. Dabei kann entweder Vorname, Nachname und Position bei Mercedes-Benz angegeben oder ein Bild mit eingescannter Unterschrift hochgeladen werden, ebenfalls mit Vorname, Nachname und Position. Das Unterschriftsdatum wird erfasst. Die Unterschriften sind verpflichtend, um im Template Management einen Vertrag zu erstellen, und müssen vor der Vertragsaktivierung vorliegen. Der Hintergrund einer hochgeladenen Unterschrift muss exakt dem Hintergrund des Vertrags entsprechen, es darf kein Kontrast zwischen Vertrag und Unterschrift sichtbar sein.

**Vorbereitung für die digitale Unterschrift (DSS)**

Alle Vorlagen, in denen eine Kundenunterschrift erforderlich ist, werden für die Integration mit dem DSS-Dienst vorbereitet. Dazu muss in der Vorlage der Tag „_!DigSign_1“ eingetragen sein. Muss ein zweiter Kunde unterschreiben, wird zusätzlich der Tag „_!DigSign_2“ verwendet. Der Tag ist nicht sichtbar (weiße Schrift auf weißem Hintergrund) und wird oberhalb der Unterschriftsstelle des Kunden platziert. Er dient dazu, vom DSS-Dienst erkannt zu werden, damit dieser das Feld für die digitale Unterschrift an der richtigen Stelle einfügen kann.

**Zahlungsplan**

Dem Vertrag wird ein Zahlungsplan nach dem Mercedes-Benz-Standard für Verträge beigefügt. Er wird vom Revenue Management abhängig von der Zahlungsart (monatlich oder einmalig) erzeugt. Beim Angebot im Status „Created“ ist der Zahlungsplan mit dem DRAFT-Wasserzeichen versehen, bei der Vertragsaktivierung im Status „Active“ erscheint er ohne Wasserzeichen.