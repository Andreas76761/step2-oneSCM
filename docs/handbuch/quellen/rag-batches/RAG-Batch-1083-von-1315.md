# Batch 1083 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation)**

Bei der Aktivierung eines Vertrags prüft oneSCM künftig, ob die im Vertragsantrag gewählte Zahlungsart zu den Vorgaben des zugeordneten Debitorenkontos in oneERP passt. Hintergrund ist, dass oneSCM Kunden in SAP Finance (oneERP) anhand von Name und Adresse sucht. Die Antwort enthält neben den Debitoreninformationen auch einen Kontovermerk, der festlegt, welche Zahlungsarten für den Kunden zulässig sind. Wird ein bestehender Kunde bei dieser Suche nicht gefunden, behandelt oneSCM ihn als Neukunden. Da dann noch kein Kontovermerk vorliegt, werden zunächst beide Zahlungsarten angeboten. Dadurch kann ein Vertrag mit einer Zahlungsart entstehen, die das später gefundene Debitorenkonto gar nicht erlaubt.

Um das zu verhindern, ruft das System vor der Aktivierung den aktuellen Kontovermerk des zugeordneten Debitorenkontos ab und vergleicht ihn mit der Zahlungsart des Vertrags. Bei leerem Kontovermerk oder beim Vermerk „S“ sind Überweisung und SEPA-Lastschrift zulässig. Beim Vermerk „K“ ist nur die Überweisung erlaubt, beim Vermerk „KB“ ausschließlich die SEPA-Lastschrift. Entspricht die gewählte Zahlungsart dem Kontovermerk, wird die Aktivierung fortgesetzt. Widerspricht sie ihm, wird die Aktivierung blockiert, und Sie erhalten eine Fehlermeldung. Diese weist darauf hin, dass die gewählte Zahlungsart nicht zur Konfiguration des Debitorenkontos in oneERP passt. So bleiben die Daten in oneSCM und oneERP konsistent, und Folgeprobleme durch falsch zugeordnete Zahlungsarten werden vermieden.

Weitere Änderungen betreffen das Backend der Vertragserstellung. Für Leasingverträge (MBLD) kann der Zahlungsplan nun ab dem Vertragsbeginn mit einem festen Intervallpreis erstellt werden. Die E-Mail-Signatur ist künftig ein Pflichtfeld und kann nicht mehr bearbeitet werden. Beim Abgleich von Produktpreisen wird außerdem eine Toleranz von ±1 Euro berücksichtigt.

Vorübergehend werden sämtliche Ablehnungsbenachrichtigungen an Kunden und Händler unterdrückt. Diese Maßnahme ist ausdrücklich als zeitlich begrenzt vorgesehen.

Auch die Benutzeroberfläche wird angepasst. In der Produktübersicht soll der Produktname mit einem Zeilenumbruch dargestellt werden, damit er auf den ersten Blick vollständig sichtbar ist. Diese Änderung befindet sich derzeit in der Qualitätssicherung. Für den Produktvergleich ist zudem geplant, die Zulässigkeit auf der Ebene des Blueprint-Typs zu bewerten. Dieses Vorhaben steht noch im Entwicklungs-Backlog.