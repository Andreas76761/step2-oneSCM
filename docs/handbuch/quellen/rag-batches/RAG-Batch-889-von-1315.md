# Batch 889 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vollständig subventionierte Verträge: Verzicht auf Zahlungsdatenerfassung und FI-Synchronisation**

Bisher müssen alle Kunden unabhängig davon, ob ihr Vertrag vollständig subventioniert ist oder nicht, mit dem FI-System synchronisiert werden, damit ein Servicevertrag angelegt und aktiviert werden kann. Künftig werden vollständig subventionierte Verträge davon ausgenommen. Das ist eine gesetzliche Vorgabe. Verträge ohne finanzielle Verpflichtung des Kunden werden ausschließlich in oneSCM verwaltet. Die Regelung gilt sowohl in der Vertragserstellung (Contract Generation) als auch im Vertragsmanagement.

Ein Vertrag gilt als vollständig subventioniert, wenn der Kundenbeitrag 0,00 beträgt, weil der gesamte Vertragswert durch eine Subvention, eine Kampagne, einen Händlerrabatt oder eine Kombination daraus gedeckt ist. Die Regelung gilt für alle Kundentypen, alle Identifikatoren, alle Zahlungsarten (vor und nach der Aktivierung) und alle Vertriebskanäle. Weil kein Zahlungseingang erwartet wird, durchlaufen diese Verträge den FI-Prozess nicht, erzeugen keine Finanzdaten und erfordern keine SEPA-bezogene Verarbeitung.

**Vertragserstellung**

Der Vertragsvorschlag wird wie gewohnt mit einem beliebigen Kundentyp und Identifikator begonnen. Das verfügbare Produkt wird konfiguriert, einschließlich möglicher optionaler Deckungen, technischer Optionen, Sonderfälle und Massenanlage. Ergibt sich am Ende ein Produktwert von 0, wird der Vertrag nach der Berechnung des Vorschlags als vollständig subventioniert eingestuft. Das gilt auch, wenn der Kundenbeitrag erst durch die Kombination aus Kampagne und Händlerrabatt auf 0,00 sinkt.

Anschließend wird der Vorschlag angelegt, und der Benutzer wird zur Eingabe der Kundendaten für die Dublettenprüfung aufgefordert. Stimmen die Kundendaten überein, werden die vorhandenen Kundendaten vorbelegt. Im weiteren Verlauf entfällt die Seite „Payment Information“, da für vollständig subventionierte Verträge keine Zahlungsdaten erfasst werden müssen. Dieser Teil ist von der Domäne Customer & Partner umzusetzen.

Sobald der Vorschlag angelegt und die Referenznummer vergeben ist, gilt Folgendes:

Es wird keine FI-Synchronisationsanfrage erstellt, es entstehen keine FI-Datensätze, und es wird kein FI-Status vergeben. Stattdessen wird ein Audit-Eintrag gespeichert, der festhält, dass die FI-Synchronisation wegen der vollständigen Subventionierung übersprungen wurde. Solange keine Zahlungsdaten erforderlich sind, wird kein SEPA-Dokument erzeugt, und eine Prüfung „SEPA Contract Match“ wird nicht ausgeführt.

Die MO-Prüfungen werden angepasst. Bei der Kundenprüfung werden „Direct Debit Code“, „SAP Debtor Number“, „FI System Status“ und „Bank Transfer“ jeweils als „Not Applicable“ gekennzeichnet. Bei der Dokumentenprüfung gilt dies für „SEPA Contract Match“. Diese Prüfungen werden übersprungen, und der Aktivierungsprozess wird fortgesetzt.

Nach der Aktivierung des Vertrags werden Daten an Revenue und an Nemesis gesendet, und es wird eine i155 erzeugt. Die Möglichkeit, in der Oberfläche eine Langzeit- oder Kurzzeitverlängerung anzustoßen, wird deaktiviert.

**Vertragsmanagement**

Bei einem vollständig subventionierten Vertrag sind Kurzzeit- und Langzeitverlängerung in der Oberfläche nicht auswählbar. Möchte der Kunde dennoch verlängern, muss er sich an Market Operations (MO) wenden. Er wird darauf hingewiesen, seine Zahlungsinformationen im CAC zu registrieren. Sobald die Zahlungsinformationen im System vorliegen und validiert sind, werden Langzeit- und Kurzzeitverlängerung freigeschaltet. MO kann die Verlängerung dann anstoßen, konfigurieren und weiterführen.

**Sonderfälle**

Hat ein Kunde bereits Daten, die mit dem FI-System synchronisiert sind, wird beim Anlegen eines neuen, vollständig subventionierten Vertrags die FI-Synchronisation dennoch übersprungen. Die vorhandenen FI-Kundendaten bleiben unverändert.

Legt ein Kunde mit einem vollständig subventionierten Vertrag einen weiteren Vertrag an, dessen Kundenbeitrag größer als 0,00 ist, müssen Zahlungsinformationen erhoben und die Finanzdaten mit dem FI-System synchronisiert werden.

Ein Kunde kann gleichzeitig vollständig subventionierte und nicht vollständig subventionierte Verträge besitzen. In diesem Fall wird der vollständig subventionierte Vertrag nicht mit FI synchronisiert, der nicht subventionierte Vertrag dagegen schon. Beide Verträge werden unabhängig voneinander verwaltet.