# Batch 1069 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 74 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation): Behobene Fehler und Verbesserungen**

Im Bereich der Vertragserstellung wurden zahlreiche Fehler behoben, die den Ablauf von der Produktauswahl über die Preisinformation bis zur Bestätigung und Unterzeichnung betrafen. Die folgende Übersicht fasst die Korrekturen thematisch zusammen. Hinweis: Nicht alle erfassten Meldungen wurden umgesetzt. Einige wurden abgebrochen und sind hier nicht als Änderung berücksichtigt.

**Vertragserstellung und Kundendaten**

Mehrere Probleme, die das Anlegen eines Vertrags verhinderten, wurden gelöst. Dazu zählen Fehler beim Aufruf der Schnittstelle zur Vertragserstellung, ein nicht funktionierender Erstellungsablauf (auch bei manuell eingegebener Laufleistung), ein Lesefehler der Anfrage beim Erstellen sowie Schwierigkeiten beim Anlegen von Verträgen für gewerbliche Kunden und mit einer neuen Bestellnummer. Ebenso behoben wurde, dass Nutzer nach einer Namensänderung wegen der IBAN-Validierung nicht fortfahren konnten. Bei den Händlerdaten werden die Felder nun korrekt deaktiviert, nachdem eine vorhandene Händler-E-Mail-Adresse verwendet wurde, und geänderte Händlerdaten bleiben erhalten. Auch der Kundenstatus wird nach einer positiven CAS-Prüfung und einem abgelehnten Vertrag nun richtig gesetzt. Der Reiter für B2B-Kunden wird in Vertragsverwaltung und Vertragserstellung einheitlich dargestellt. Die Validierungsmeldung zur Fahrzeugkennung wird korrekt angezeigt und nicht mehr doppelt eingeblendet. Nach dem Hinzufügen einer Kennung werden die Preise aktualisiert. Eine manuell eingegebene Laufleistung setzt das Format des tatsächlichen Werts nicht mehr zurück.

**Produktauswahl, Vergleich und optionale Deckungen**

In der Produktauswahl passen Produktpreis und Produkttitel nun in die Produktkarte, ohne sich mit der Beschreibung zu überlagern. Im Vergleichsfenster werden Bilder nicht mehr abgeschnitten. Die Auswahl der Zahlungsintervalle bleibt beim Vergleichen und Auswählen von Produkten erhalten. Drucken von Dokumenten und Versenden von E-Mails sind in der Produktauswahl wieder möglich. Zudem stimmen die Werte beim Vergleich von zwei oder drei Produkten in E-Mail und Ausdruck überein.

Bei den optionalen Deckungen wurden mehrere Fehler korrigiert: Die Schaltfläche zum Hinzufügen funktioniert auch bei unterschiedlicher Anzahl optionaler Deckungen je Laufzeit- bzw. Laufleistungsauswahl. Fehlermeldungen zur Kurzbeschreibung im Vergleichswerkzeug treten nicht mehr auf. Bei mehreren Deckungen eines Produkts werden diese richtig zugeordnet, und die Auswahl einer einzelnen Deckung übernimmt nicht mehr mehrere gleichzeitig in die Produktkonfiguration. Optionale Deckungen erscheinen in der Preisinformation, Preisabweichungen wurden beseitigt, und die Auswahl eines Deckungscodes führt nicht mehr zu leerem Preis und leerem Tooltip.

**Preise, Zahlungsplan und Übersicht**

Die Darstellung der Mehrwertsteuerwerte wurde korrigiert. Der Zahlungsplan zeigt den umverteilten Betrag an, sofern Werte vorliegen. Bei Verträgen mit monatlicher Zahlung entspricht die Servicerate nun dem Nettobetrag. Marktkampagnen erscheinen auf der Seite „Übersicht und Bestätigung“ nicht mehr fälschlich als Händlerrabatte, und die dort angezeigten Informationen stimmen mit der Vertragsvorschau (PDF) überein. Bei der Verlängerung mit langer Laufzeit fehlen keine Zeilen mehr in der Übersichtstabelle, wenn zu früh auf „Weiter“ geklickt wird. Das Bestätigungsdatum wird für bestätigte Verträge angezeigt.

**Ausdrucke, Angebote und E-Mails**

Das Preisangebotsdokument verwendet nun das richtige Preisformat. Im gedruckten Angebot werden keine fest hinterlegten optionalen Deckungen mehr ausgegeben, und die Angaben zu optionalen Deckungen entsprechen der Nutzerauswahl. Der Fehler beim Drucken des Vertragsangebots mit vollem Vertragsbetrag als Händlerrabatt ist behoben, ebenso der Fehler bei der Druckauswahl mit Signaturproblem (Endlosladen). Die Kopfzeilen der Planvorschau überlagern das Modul „Per E-Mail senden“ nicht mehr. In der Vorschau aus der Erstellung heraus sind die Allgemeinen Geschäftsbedingungen dem Servicevertrag beigefügt. Die Preise im PDF für gewerbliche Kunden wurden geprüft und korrigiert. Der Wert für die verbleibenden Tage bis zum Ende der Angebotsgültigkeit wird per E-Mail übermittelt.

**Unterzeichnung und Bestätigung**

Die Schaltfläche „Bestätigen“ steht bei Auswahl und Unterzeichnung über DSS/eSignatur nicht mehr vorzeitig zur Verfügung. Der DSS-Ablauf funktioniert wieder, und der DSS-Link öffnet den Bereich zur Dokumentenunterzeichnung nicht mehr im selben Browser-Tab. Die Unterzeichnung eines Vertrags mit On-Premise-Lösung ist möglich. Beim Vertragstransfer wird das Signaturfeld dem Käufer statt dem Verkäufer zugewiesen. Das Bestätigungsereignis wird für Verträge versendet.

**Services, Benachrichtigungen und Schnittstellen**

Der Servicevertrag wird nach einer kurzfristigen Verlängerung aktualisiert. Bei Produkten ohne optionale Deckungen enthält der Servicevertrag kein leeres Feld „Hinzugefügte optionale Deckungen“ mehr. Der Zugriff auf Vertragsbenachrichtigungen führt im Build-to-Order-Ablauf nicht mehr zu einem internen Serverfehler. In der Nemesis-Schnittstelle wird im Feld für die externe Vertragsnummer nicht mehr die oneSCM-Vertragsnummer übermittelt. Außerdem wurde die Langsamkeit im Vertragsangebot behoben.