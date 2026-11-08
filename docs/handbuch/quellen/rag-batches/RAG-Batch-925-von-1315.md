# Batch 925 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation)**

Im Bereich der Vertragserstellung wurden mehrere Verbesserungen umgesetzt, die sowohl die Datensicherheit in den Testumgebungen als auch die Stabilität des Systems betreffen.

Auf der Vorproduktionsumgebung (Pre-Prod) waren zuvor Kundendaten aus der Produktionsumgebung kopiert worden. Dadurch erhielten einzelne Kunden DSS-Nachrichten auf ihre tatsächliche Telefonnummer. Um dies künftig zu verhindern, wurde zunächst auf Ebene der einzelnen Domänen ermittelt, welche Kundendaten dort jeweils vorhanden sind. Anschließend wurden mit dem MB-Tool OBFUSKATOR Testdaten erzeugt. Die echten Kundendaten in der Pre-Prod-Umgebung, nämlich Name, Adresse, Telefonnummer und E-Mail-Adresse, wurden durch zufällig generierte Daten ersetzt.

Für die Stabilität des Systems wurden die Listener „contract_customer_changes“ und „contract_revenue_changes“ optimiert, damit es dort nicht mehr zu Out-of-Memory-Fehlern kommt.

Zusätzlich wurde im Rahmen der automatisierten Qualitätssicherung die Erstellung eines Vertrags für Kunden aus dem Bereich Commercial Fleet im Sonderfall „neuer Preis“ abgedeckt.

**Aktualisierung von Kundendaten nach der Vertragserstellung**

Das System unterstützt außerdem die Aktualisierung kundenbezogener Informationen, nachdem ein Vertrag erstellt wurde, sodass die Kundendaten stets aktuell sind. Gleichzeitig kann das Signaturereignis erneut ausgelöst werden, wenn der Vertrag eine Unterschrift erfordert. So ist sichergestellt, dass die neuesten Kundendaten in den unterschriebenen Dokumenten berücksichtigt werden. Das Verhalten hängt vom Vertragsstatus ab und gilt sowohl für Privatkunden (B2C) als auch für Geschäftskunden (B2B).

Hat der Vertrag den Status „Created“, werden geänderte Kundendaten auf Vertragsebene aktualisiert. Die aktualisierten Daten fließen in jedes danach neu erzeugte Vertragsdokument ein.

Im Status „Waiting for Confirmation“ werden die Daten ebenfalls auf Vertragsebene aktualisiert, und das Vertragsdokument wird neu erzeugt. Alle älteren Dokumentversionen werden verworfen. Zudem wird im Vertragsverlauf (Contract History) ein Eintrag mit den Details der Neuerzeugung angelegt. Das weitere Vorgehen richtet sich nach der Signaturmethode. Bei DSS (On-Premise oder E-Mail) wird die bestehende DSS-Envelope-ID storniert und mit dem aktualisierten Vertragsdokument eine neue DSS-Envelope-ID ausgelöst. Bei der Signaturmethode „Print“ muss der Händler den neuen Vertrag ausdrucken und dem Kunden übergeben. Das System weist ihn darauf hin.

In den Status „Confirmed“ und „Waiting for Activation“ werden geänderte Kundendaten ebenfalls auf Vertragsebene aktualisiert. Bereits unterschriebene Dokumente bleiben dabei unverändert.

Werden Kundendaten in sehr kurzen Abständen wiederholt geändert, etwa alle fünf Sekunden, soll der Vertrag nicht bei jeder einzelnen Änderung die Dokumente neu erzeugen. Solche Aktualisierungen sollen stattdessen kontrolliert abgewickelt werden.