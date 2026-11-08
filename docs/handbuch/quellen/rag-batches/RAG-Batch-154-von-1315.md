# Batch 154 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuerungen im Überblick**

**Rechnungen direkt aus dem Vertrag freigeben**
MO- und MPC-Benutzer müssen Kunden- und Werkstattrechnungen nicht mehr ausschließlich über die Seiten „Finance Management → Invoices“ und „International Workshop Invoices“ bearbeiten. Die Aktionen sind jetzt auch direkt im Vertrag unter „Payment“ möglich, auf den Registern „Customer Invoice“ und „Workshop Invoice“. Öffnen Sie dort eine Rechnung im Status „Created“, stehen die Schaltflächen „Accept“, „Reject“ und „Edit“ zur Verfügung. Der Ablauf entspricht dem auf den bisherigen Seiten. „Accept“ und „Reject“ sind nur aktiv, wenn der angemeldete MO- oder MPC-Benutzer nicht derjenige ist, der die Rechnung erstellt hat. Die Funktion gilt für Rechnungen und Gutschriften aller Typen und soll die Annahme, Ablehnung und Bearbeitung für MO- und MPC-Benutzer erleichtern.

**Historische Nemesis-Datensynchronisation, Phase 2**
Die zweite Phase erweitert die Synchronisation um gezielte Wiederherstellung fehlgeschlagener Ereignisse, robustere Ausführung und eine vollständige Nachvollziehbarkeit. Sie baut auf dem durchgängigen Ablauf der ersten Phase auf. Bisher konnten Benutzer vollständige Synchronisationen starten und sahen einfache Verlaufseinträge sowie Fehleranzahlen. Es fehlten detaillierte Fehlerlisten, Wiederholungsmöglichkeiten und ein detaillierteres Audit. Die Funktion richtet sich an Benutzer mit der Berechtigung „Market Settings“ und verkürzt Wiederherstellungszeiten, weil gezielt die fehlgeschlagenen Einträge bearbeitet werden.

Klicken Sie im Sync-Verlauf in der Spalte „Actions“ auf „View Details“, öffnet sich der Dialog „Sync Failure Details“. Er zeigt die Vertragsnummern, für die Nemesis-Ereignisse fehlgeschlagen sind. Mit „Cancel“ schließen Sie den Dialog und kehren zum Sync-Verlauf zurück. Mit „Retrigger“ gelangen Sie zur Seite „Nemesis Errors“. Dort ist das fehlgeschlagene Ereignis unter dem jeweiligen Ereignistyp protokolliert. Sie können den Eintrag auswählen und das Ereignis nach der Behebung der Ursache erneut an Nemesis senden. Der Fehlertyp wird anhand des bei der Ereigniserzeugung aufgetretenen Fehlers als „Infrastructure“ oder „Functional“ kategorisiert.

**Weitere Anpassungen im Bereich Revenue Management**
Ein Fehler beim Import von i156-Claims mit altem Teilesteuersatz („Old Part Tax“), der zuvor einen Fehler auslöste, wurde behoben.

Zusätzlich sind folgende Themen in Prüfung oder im Einsatz und betreffen unter anderem die Exporte an das FI-System:

Für die I155-Datei wird geprüft, ob abweichende Händlerwährungen und Einheiten (Meilen) korrekt umgerechnet werden. Im HTXT01-Satz von E169 wird beim alten Teilesteuersatz das Buchungsdatum statt der Buchungsperiode angezeigt. Auf dem Register „Payment“ wird eine Warnmeldung samt Begründungspflicht bei Änderung des Zahlungsintervalls geprüft.

Der PTXT01-Text beim Export von Händlerrabatt-Rechnungen nach E169 wird für externe Händlerrabatte bei VAN- und PC-Verträgen im Status „accepted“ verifiziert. Ebenso wird geprüft, dass die externe Händlerprovision bei VAN-Verträgen und die interne Händlerprovision bei PC-Verträgen an das FI-System exportiert werden. Die interne Händlerprovision bei VAN-Verträgen wird auf „processed“ gesetzt und nicht an das FI-System exportiert.

Außerdem wurde die Oberfläche der Rechnungsseite für den alten Teilesteuersatz erweitert, zum einen für Vega-Claims (Voraussetzung: erzeugte I156-Datei mit altem Teilesteuersatz), zum anderen für manuelle Werkstattrechnungen. Letzteres befindet sich noch in der Prüfung.