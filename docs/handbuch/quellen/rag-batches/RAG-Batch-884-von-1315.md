# Batch 884 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Marktspezifische Übersetzungen für Deckungen und weitere Codes**

Die Vertragserstellung unterstützt künftig marktspezifische Bezeichnungen und Beschreibungen für Coverage Codes, Damage Codes, Industry Codes, Technical Options und ISP Codes. Diese Codes werden zentral in der Produktverwaltung bzw. in den VEGA Codes definiert, die ISP Codes zusätzlich in der Fahrzeugverwaltung. Der dort hinterlegte Text bildet den sogenannten HQ-Vorschlag. Er ist je Code einheitlich, wird von der Zentrale gepflegt und kann von den Märkten nicht verändert werden. Jeder Markt kann nun eigene Formulierungen in den Sprachen seines Marktes hinterlegen, getrennt nach den Bereichen Passenger Cars und Vans. Wo ein Markt keine eigene Übersetzung erfasst hat, wird automatisch der HQ-Vorschlag verwendet.

**Der neue Reiter „Translations“ in den Markteinstellungen**

In den Markteinstellungen steht dafür der neue Reiter „Translations“ zur Verfügung. Er befindet sich als eigenständiger Reiter direkt hinter „External System Settings“ und steht damit auf einer Ebene mit General Settings, Feature Settings, Inflation und External System Settings. Innerhalb des Reiters gibt es fünf Unterreiter in dieser Reihenfolge: Coverage Codes, Damage Codes, Industry Codes, Technical Options und ISP Codes. Jeder Unterreiter bietet die gewohnte Aufteilung nach Passenger Cars und Vans.

Alle Unterreiter sind gleich aufgebaut. Links werden die Codes aufgelistet, die dem Markt für die gewählte Division zugeordnet sind, zum Beispiel „P0R1 - General Wear and Tear“ oder „P0B1 - Vehicle Wear & Tear“. Wählen Sie einen Code aus, erscheint rechts zunächst ein hervorgehobenes, schreibgeschütztes Feld „HQ Proposal“ mit dem zentral definierten Text. Darunter wird für jede dem Markt zugeordnete Sprache ein eigenes Eingabefeld angezeigt, beispielsweise „Switzerland - DE“, „Switzerland - FR“ und „Switzerland - IT“. Die Sprachen entsprechen den Sprachen, die im Reiter „Format“ unter General Settings für den Markt hinterlegt sind.

Beim ersten Öffnen sind die Felder jeder Sprache mit den Werten des HQ-Vorschlags vorbelegt. Sie können diese unverändert übernehmen oder einzelne Felder anpassen und müssen so nur das ändern, was im Markt tatsächlich abweicht. Am Ende der Seite stehen die Aktionen zum Zurücksetzen (nicht gespeicherte Änderungen verwerfen) und zum Bestätigen (Speichern) zur Verfügung, wie in den übrigen Bereichen der Markteinstellungen. Pflichtfelder, etwa der Coverage Name, dürfen nicht leer gespeichert werden. Beschreibungsfelder können leer bleiben, sofern das zugrunde liegende Objekt dies erlaubt.

**Felder je Code-Typ**

Die Felder unterscheiden sich je nach Code-Typ. Bei Coverage Codes können Sie Coverage Name, Description und Family Tag übersetzen. Bei Damage Codes sind es Code Name und Type Description. Bei Industry Codes gibt es das einzelne Feld Industry. Bei Technical Options werden Group Name und Group Description gepflegt, bei ISP Codes das einzelne Feld Description.

Eine Besonderheit gilt für Damage Codes: Ein Damage Code gehört immer genau einem Markt. In der Liste erscheinen daher nur die Damage Codes, die bereits dem aktuellen Markt zugeordnet sind. Eine Zuordnung eines Codes zum eigenen Markt ist hier nicht vorgesehen, es werden ausschließlich die vorhandenen Codes je Sprache übersetzt.

**Voraussetzungen**

In den Markteinstellungen werden keine neuen Codes angelegt, sondern nur marktspezifische Texte zu bestehenden Codes. Ein Code muss daher zuvor zentral definiert und dem Markt zugeordnet worden sein, damit er im Bereich „Translations“ erscheint. Bei den Technical Options und den ISP Codes musste dafür zunächst die Möglichkeit geschaffen werden, Übersetzungen je Markt und Sprache zu speichern. Die ISP Codes stammen zudem aus der Fahrzeugverwaltung und werden über eine neue Anbindung für die Markteinstellungen und die Vertragserstellung bereitgestellt.

**Verwendung der Texte in der Vertragserstellung und in Dokumenten**

Für alle fünf Code-Typen gilt dieselbe Regel: Arbeitet ein Verkäufer oder das System in einer bestimmten Sprache und hat der Markt für diese Sprache eine Übersetzung gespeichert, wird diese verwendet. Andernfalls wird der HQ-Vorschlag angezeigt. Es erscheint nie ein leerer Text.

Die Regel greift an folgenden Stellen:

- bei der Anzeige und Auswahl von Deckungen in der Vertragserstellung,
- bei der Erzeugung von Dokumenten und Vorlagen (Platzhalter),
- in der Vertragsdetailansicht, den Reifendetails und den Deckungslisten sowie überall dort, wo Namen oder Beschreibungen von Deckungen, Branchen, Technical Options oder ISP Codes angezeigt werden,
- bei den Damage Codes in den Kosten- und Schadensabläufen der Revenue-Verwaltung, etwa bei der Verarbeitung von Werkstattrechnungen, unter Verwendung der gewählten Sprache des Marktes.

Die Dokumentenverwaltung selbst löst keine Übersetzungen auf. Die Auswahl des Textes erfolgt vorab im Vertragsservice, sodass die Dokumentenverwaltung den bereits aufgelösten Text erhält.

**Hinweis zum Entwicklungsstand**

Die Funktion befindet sich noch in der Entwicklung. Offen sind derzeit die Details der ISP-Anbindung, die genaue Festlegung der Pflichtfelder und die Frage, ob für bereits eingeführte Märkte (zum Beispiel SK) eine Migration erforderlich ist. Die Inhalte dieses Abschnitts können sich daher noch ändern.