# Batch 908 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Verträge für B2B-Kunden ohne Unterschrift, SEPA und Benachrichtigungen**

Für bestimmte B2B-Kunden, die Servicevertr&auml;ge kostenfrei erhalten, sind Kundenunterschrift, Benachrichtigungen und die Erfassung von Zahlungsinformationen einschließlich SEPA nicht erforderlich. Damit der Ablauf der Vertragserstellung für diese Fälle einfacher wird, lässt sich nun für jeden Servicevertrag steuern, ob eine Kundenunterschrift und Kundenbenachrichtigungen erforderlich sind. Die Einstellungen gelten für alle Kundentypen und beide Divisionen (PC/VAN), sowohl in der Vertragserstellung als auch im Vertragsmanagement, sobald der Vertrag den Status „Active" erreicht hat.

**Berechtigungen und Einstellungen**

Die Optionen „Signature Required" und „Notification Required" können ausschließlich von Benutzern mit den Rollen MO, MPC und Dealer+ konfiguriert werden. Für Dealer ohne Dealer+-Berechtigung sind beide Felder standardmäßig auf „Ja" gesetzt und schreibgeschützt. Die beiden Optionen befinden sich unter „Overview & Confirmation" im Bereich „Preferences" und sind jeweils als Schalter ausgeführt, der standardmäßig eingeschaltet ist. Ist „Signature Required" eingeschaltet, muss der Kunde vertragsbezogene Dokumente unterschreiben; ist der Schalter ausgeschaltet, ist keine Kundenunterschrift nötig. Ist „Notification Required" eingeschaltet, erhält der Kunde alle Benachrichtigungen im Vertragsverlauf, etwa zu Aktivierung, Ablehnung, Stornierung, Sperrung, Reaktivierung, Erinnerungen, vorzeitiger Beendigung, Abschluss und Vertragsprüfung. Ist der Schalter ausgeschaltet, entfallen diese Benachrichtigungen. Ein Info-Tooltip, der die Auswirkungen erläutert, wird nur angezeigt, wenn der jeweilige Schalter bearbeitet werden kann. Benachrichtigungen, die über DSS ausgelöst werden, etwa zur Unterschrift oder zur erneuten Anforderung einer Zahlung, werden niemals deaktiviert.

Die Schalter sind für MO, MPC und Dealer+ nur bei der Zahlungsart Banküberweisung bearbeitbar. Bei allen anderen Zahlungsarten bleiben beide Schalter eingeschaltet und schreibgeschützt. Bei Lastschrift und digitalen Zahlungen ist Unterschrift bzw. Benachrichtigung notwendig, um Zahlungen fortzusetzen oder zu validieren.

**Verhalten bei ausgeschalteter Unterschrift**

Bei Banküberweisung und ausgeschaltetem Schalter „Signature Required" werden die MO-Prüfungen teilweise automatisch aktualisiert: Vertragsreferenznummer, Vertragsunterschrift und Dokumenttyp werden auf „OK" gesetzt, die SEPA-bezogenen Prüfungen (SEPA-Vertragsabgleich und SEPA-Dokumenttyp) auf „Not Applicable". Bei der Bestätigung des Vertrags wird das Unterschriftsfenster nicht angezeigt, und der Vertrag erhält den Status „Waiting for Confirmation". Ist das CAS-Ergebnis negativ, wechselt der Vertrag in den Status „Confirmed". Das Vertragsdokument wird ohne Wasserzeichen und ohne Unterschrift abgelegt. Nach der Aktivierung kann die Einstellung „Signature Required" nicht mehr geändert werden.

**Verhalten bei ausgeschalteten Benachrichtigungen**

Bei Banküberweisung und ausgeschaltetem Schalter „Notification Required" erhält der Kunde keine E-Mails zum Vertragsverlauf, also keine E-Mails zu Aktivierung, Ablehnung, Stornierung, Sperrung und Reaktivierung, Erinnerungen, vorzeitiger Beendigung, Abschluss, Vertragsprüfung oder sonstige nicht genannte E-Mails. DSS-E-Mails, etwa für Unterschriftsprozesse und die erneute Anforderung von Zahlungen, werden weiterhin versendet.

Ab dem Status „Waiting for Confirmation" sowie später im Vertragsmanagement steht im Bereich „Communication → Emails" ein Schalter „Notification Required" zur Verfügung. Sein Anfangswert entspricht dem Wert zum Zeitpunkt, zu dem der Vertrag in den Status „Waiting for Confirmation" gewechselt ist. Ist der Schalter ausgeschaltet und die Zahlungsart nicht Banküberweisung, ist er deaktiviert. Bei Banküberweisung können MO, MPC und Dealer+ ihn wieder einschalten. Solange er ausgeschaltet ist, ist die Funktion „Resend Email" deaktiviert, mit Ausnahme von DSS-E-Mails. Wird er eingeschaltet, kann der erneute Versand bereits erzeugter E-Mails wieder genutzt werden, und alle künftigen Benachrichtigungen im Vertragsverlauf werden versendet.

**Kombinationen der Einstellungen**

Ist die Unterschrift erforderlich, aber die Benachrichtigung ausgeschaltet, werden Unterschrifts-E-Mails weiterhin über DSS versendet. Ist die Unterschrift nicht erforderlich und die Benachrichtigung eingeschaltet, wird kein Unterschriftsfenster angezeigt, und der Vertrag wird bei negativem CAS-Ergebnis direkt bestätigt.

**Workflow für VIP-Kunden mit der KAM-Kampagne (100 % Rabatt)**

Zusätzlich gibt es einen eigenen Ablauf für VIP-Geschäftskunden, die für die KAM-100-%-Rabattkampagne berechtigt sind. Diese Kunden erhalten Servicevertr&auml;ge ohne Zahlung, ohne Unterschrift und ohne Kundenbenachrichtigungen, sodass eine schnelle und reibungslose Aktivierung möglich ist.

Voraussetzungen sind: Der Benutzer hat die Rolle MO, MPC oder Dealer+, es handelt sich um einen Geschäftskunden (Commercial Customer), die KAM-Kampagne mit 100 % Rabatt ist verfügbar und auswählbar, der Kunde ist als VIP-Kunde markiert, und die MO-Prüfungen sind aktiviert.

Der Benutzer erstellt ein Vertragsangebot für einen Geschäftskunden und wählt bei der Produktkonfiguration die KAM-Kampagne mit 100 % Rabatt. Das System führt eine Dublettenprüfung des Kunden durch und prüft, ob der Kunde VIP-Kunde ist und die 100-%-KAM-Kampagne angewendet wird. Ist eine der Bedingungen nicht erfüllt, gilt der übliche Ablauf für Geschäftskundenverträge. Sind beide Bedingungen erfüllt, greift der VIP-Nullwert-Ablauf.

In diesem Ablauf werden die Zahlungsfelder (Zahlungsarten und IBAN) in den Zahlungsinformationen ausgeblendet. Der Vertrag wird mit dem Status „Created", dem Vertragspreis 0 und einem Zahlungsplan von 0 ohne Raten angelegt; Zahlungsdetails werden nirgends angezeigt. Die Vertragsvorschau zeigt ein Dokument mit Wert null und ohne Zahlungsinformationen. Beim Bestätigen wird kein Unterschriftsfenster geöffnet, und das System setzt den Status automatisch auf „Waiting for Confirmation". Bei negativem CAS-Ergebnis wird der Vertrag automatisch auf „Confirmed" gesetzt. Zu keinem Zeitpunkt werden Kunden-E-Mails oder -Benachrichtigungen versendet.

Bei den MO-Prüfungen blockieren vorhandene Probleme die automatische Aktivierung, und der MO muss sie beheben. Sind alle Prüfungen bestanden, wird der Vertrag automatisch aktiviert. Folgende Prüfungen gelten als „Not Applicable": Preisprüfung, Kunde: Direct-Debit-Code, Kunde: SAP-Debitorennummer, Kunde: FI-Systemstatus, Kunde: Branche, Dokument: Vertragsnummer, Dokument: Dokumentunterschrift, Dokument: SEPA-Vertragsabgleich, Dokument: SEPA-Dokumentunterschrift und Dokument: Steuerbefreiungsbescheinigung.

Nach der Aktivierung wird der Vertrag in die nächste i155 aufgenommen. Es werden keine Kundenbenachrichtigungen (Aktivierung, Bestätigung usw.) gesendet; stattdessen wird eine Revenue-Benachrichtigung versendet, die die Kostenstelle der Kampagne (Campaign Cost Center) enthält, und die Daten werden an den Notification-Microservice übermittelt. Rechnungen werden nicht erzeugt. Zusammengefasst gilt: Solange der Kunde VIP-Kunde ist und die 100-%-Rabattkampagne angewendet wird, ist keine Vertragsunterschrift erforderlich, der Vertragswert beträgt 0, es werden keine Rechnungen erstellt, und der Kunde erhält keine E-Mails oder Benachrichtigungen.

**Hinweise**

Grafik und Design müssen den Vorgaben des Mercedes-Benz Workbench entsprechen. Als Risiken sind genannt: mögliche regulatorische Verstöße, wenn Verträge ohne Unterschrift aktiviert werden, Verwirrung beim Kunden, wenn er bei ausgeschalteten Benachrichtigungen keine Kenntnis von Vertragsänderungen erhält, sowie Lücken bei der Nachvollziehbarkeit, warum Unterschrift oder Benachrichtigungen deaktiviert wurden.