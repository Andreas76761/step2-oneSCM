# Batch 354 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Mehrfachunterschriften für Gewerbekunden (Partnerschaften)**

Bisher genügt eine einzelne Unterschrift, um alle rechtsverbindlich zu unterzeichnenden Dokumente auszuführen: den Servicevertrag, das SEPA-Lastschriftmandat (sofern zutreffend) und die langfristige Verlängerungsvereinbarung. Da in manchen Märkten mehrere zeichnungsberechtigte Personen erforderlich sind, unterstützt das System nun die Zuweisung und die nacheinander erfolgende Einholung mehrerer Unterschriften. Die Funktion gilt für alle gewerblichen Kundentypen. Betroffen sind das Angebots- bzw. Vertragsdokument, das SEPA-Mandat und die langfristige Verlängerung.

**Unterzeichner festlegen**

Unterzeichner werden im Kundendatensatz als Kontaktpersonen mit der Rolle „Signee“ hinterlegt. Mögliche Rollen sind „Signee“, „Payment Responsible“ oder die Kombination „Signee + Payment Responsible“. Einem Kunden können mehrere Kontaktpersonen gleichzeitig zugewiesen werden. Weitere Unterzeichner lassen sich über den Kundendatensatz (Kontaktpersonen oder designierte Vertreter) oder während der Vertragserstellung ergänzen. Es muss immer mindestens ein Unterzeichner vorhanden sein, höchstens sind zehn möglich. Für jeden Unterzeichner sind Vorname, Nachname, E-Mail-Adresse, Telefonnummer und Sprache zu erfassen.

Unterzeichner können hinzugefügt, entfernt, bearbeitet oder ersetzt werden. Eine Ausnahme gilt für Kunden im Status „In Confirmation“; hier hängt die Bearbeitung von einer separaten Abhängigkeit ab, die Änderungen an Gewerbekundendaten in diesem Status ermöglichen soll. Wird ein Unterzeichner ersetzt oder entfernt, kann die Unterschrift wie bisher bei einem einzelnen Unterzeichner erneut angestoßen werden, sofern das Angebot noch gültig ist.

**Sprache der Dokumente**

Die Dokumente werden stets in der Sprache des Kundendatensatzes erzeugt. Die bevorzugte Sprache der einzelnen Unterzeichner wird nicht berücksichtigt. Das gilt für den Servicevertrag, das SEPA-Mandat und die langfristige Verlängerung. Die Vorlagen unterstützen dynamische Unterschriftenblöcke für mehrere Unterzeichner und stehen in der Sprache des Kunden zur Verfügung. Die Unterschriften befinden sich am Ende des Dokuments.

**Reihenfolge der Unterschriften**

Sind mehrere Unterzeichner zugewiesen, werden die Unterschriften nacheinander eingeholt. Der erste Unterzeichner erhält die Unterschriftsanforderung und muss unterschreiben, bevor der zweite benachrichtigt wird. Anschließend wird jeweils der nächste Unterzeichner automatisch benachrichtigt und zur Unterschrift eingeladen, bis alle unterschrieben haben. Die Reihenfolge ergibt sich aus einer Positionsnummer, die der Reihenfolge der Zuweisung entspricht und vor dem Auslösen der Unterschrift bearbeitet werden kann.

Alle Unterzeichner müssen dieselbe Unterschriftsmethode verwenden. Es ist nicht zulässig, dass einer vor Ort und ein anderer per E-Mail unterschreibt. Unterstützt werden die Methoden „On Premise“, E-Mail und Druck. Die Gültigkeit der Unterschrift entspricht der Gültigkeit des Angebots. Der Ablauf des Vorgangs, einschließlich der Gültigkeit, wird auf Ebene des Umschlags (Envelope) für alle Unterzeichner gemeinsam gesteuert.

**Unterschrift per E-Mail**

Die Dokumente werden in der festgelegten Reihenfolge an die Unterzeichner versendet. Ein Unterzeichner erhält das Dokument erst, wenn alle Vorgänger innerhalb der Angebotsgültigkeit unterschrieben haben. Das ihm zugesandte Dokument enthält bereits die gesammelten Unterschriften der vorherigen Unterzeichner. Gibt es nur einen Unterzeichner, setzt der Vertrag nach der Unterschrift den üblichen Aktivierungsablauf fort. Läuft die Angebotsgültigkeit ab, bevor ein Unterzeichner unterschrieben hat, wird der Vertrag mit dem Grund „Offer validity expired“ auf „Rejected“ gesetzt.

**Erneutes Anstoßen der Unterschrift**

Wird der Unterschriftsprozess aus irgendeinem Grund neu gestartet, etwa durch manuelles erneutes Auslösen, Datenkorrektur, Vertragsänderung oder Ablauf, wird der bestehende Umschlag im externen Signaturdienst (DSS) zunächst vollständig storniert. Danach wird ein neuer, unsignierter Umschlag erstellt, und der Ablauf beginnt wieder beim ersten Unterzeichner, unabhängig davon, wie viele bereits unterschrieben hatten. Teilweise erfasste Unterschriften werden verworfen.

**Druckdokument**

Beim Druck werden Servicevertrag und gegebenenfalls SEPA-Mandat mit den Unterschriftsbereichen aller Unterzeichner am Dokumentende ausgegeben, anschließend physisch unterschrieben und wieder hochgeladen. Bei der Unterschriftsart „Print“ entfällt bei mehr als einem Unterzeichner der QR-Code für den Kunden, sodass die Unterzeichner nicht per CAC scannen und unterschreiben können. Die Prüfungen beim Druckverfahren wurden auf alle Unterzeichner ausgeweitet.

Beim Hochladen prüft das System in folgender Reihenfolge: Zuerst wird der QR-Code validiert. Stimmt er überein, folgt die nächste Prüfung, andernfalls wird wie bisher ein Fehler ausgegeben. Danach wird die Vollständigkeit der Unterschriften geprüft. Fehlen Unterschriften, wird ein Fehler ausgegeben, und der Benutzer kann erneut hochladen und die Prüfungen wiederholen. Sind alle Prüfungen erfolgreich, werden die MO-Prüfungen „SEPA Document Multiple Signatures“ und „Contract Multiple Signatures“ auf „OK“ gesetzt, andernfalls auf „Not OK“. Für alle Unterschriften gibt es dabei ein einziges Feld in den MO-Prüfungen. Wird nicht innerhalb der Angebotsgültigkeit das korrekte Dokument mit allen Unterschriften hochgeladen, wird der Vertrag mit dem Grund „Offer Validity expired“ auf „Rejected“ gesetzt. Sind alle Unterschriften erfasst und validiert, läuft der übliche Aktivierungsablauf weiter.

**Langfristige Verlängerung**

Die langfristige Verlängerung wird ausschließlich vom MO angestoßen. Als Unterschriftsmethode wird nur die Unterschrift per E-Mail unterstützt; „On Premise“ und Druck sind in diesem Ablauf nicht möglich. Es gilt dieselbe Liste der als Unterzeichner zugewiesenen Personen. Beim Auslösen liest das System die zu diesem Zeitpunkt im Kundendatensatz hinterlegten Kontaktpersonen mit der Rolle „Signee“ aus.

Ist genau ein Unterzeichner vorhanden, wird das Dokument per E-Mail an ihn gesendet, und der übrige Prozess bleibt unverändert. Sind zwei oder mehr Unterzeichner vorhanden, wird der Mehrfachunterzeichner-Ablauf aktiviert, und das Dokument wird nacheinander in der festgelegten Reihenfolge versendet. Es gelten dieselben Regeln wie bei der E-Mail-Unterschrift in der Vertragserstellung: Ein Unterzeichner erhält das Dokument erst, wenn alle Vorgänger innerhalb der Gültigkeit des Verlängerungsangebots unterschrieben haben, und das Dokument enthält jeweils die bisherigen Unterschriften. Läuft die Angebotsgültigkeit vorher ab, wird die Verlängerung mit dem Grund „Offer validity expired“ auf „Rejected“ gesetzt; dieses Verhalten ist laut Vorgabe noch zu bestätigen. Die Dokumentsprache richtet sich nach der Sprache des Kunden, unabhängig von der Sprache einzelner Unterzeichner.

Muss die Unterschrift neu gestartet werden, etwa durch manuelles erneutes Auslösen, Korrektur eines Unterzeichners oder Ablauf, wird der bestehende Umschlag im Signaturdienst vollständig storniert und ein neuer, unsignierter Umschlag erstellt. Die Reihenfolge beginnt wieder beim ersten Unterzeichner, bereits gesammelte Unterschriften werden verworfen. Haben alle Unterzeichner innerhalb der Angebotsgültigkeit unterschrieben, wird die langfristige Verlängerung fortgesetzt und angewendet.