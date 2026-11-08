# Batch 773 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Langfristige Verlängerung für Nicht-FRD-Produkte**

Hinweis: Dieses Vorhaben hat den Status „Cancelled“ (abgebrochen). Die beschriebene Funktion wurde daher nicht umgesetzt und steht nach aktuellem Stand nicht zur Verfügung.

Die Funktion zur langfristigen Verlängerung (Long Term Prolongation) von Servicevebrträgen sollte auf Nicht-FRD-Produkte ausgeweitet werden. Bisher ist sie nur für FRD-Produkte möglich, Verträge zu Nicht-FRD-Produkten konnten nicht verlängert werden. Nutzen sollten die Funktion MPC Product Manager und Market-Operations-Nutzer. Je nach Kanal waren zudem weitere berechtigte Rollen vorgesehen, etwa Dealer+ oder API-Konsumenten. Ziel war, dass die langfristige Verlängerung über alle unterstützten Produkttypen und Vertriebskanäle hinweg einheitlich verfügbar ist und dabei produktspezifische Konfigurationsregeln und Validierungen berücksichtigt werden.

Voraussetzung wäre gewesen, dass der Servicevertrag für ein Nicht-FRD-Produkt angelegt wurde und den Status „Active“ hat. Außerdem muss die langfristige Verlängerung für die gewählte Produktkonfiguration unterstützt werden. Der Ablauf sah vor, dass MO oder MPC einen aktiven Servicevertrag auswählen und die langfristige Verlängerung starten. Das System ruft den Produktservice mit den relevanten Informationen auf, um mögliche Konfigurationen zu erhalten. Der Produkt-Microservice bestimmt den Produkttyp und erzwingt die produktspezifischen Konfigurationsregeln.

Für Reifenprodukte in der Variante „Limited“ müssen Gesamtlaufzeit (inklusive Verlängerung), Jahreslaufleistung, Wetterprofil, Reifentyp, Reifengröße und Reifenanzahl angegeben werden. Für Reifenprodukte in der Variante „Unlimited“ sind Gesamtlaufzeit (inklusive Verlängerung), Jahreslaufleistung, Wetterprofil, Stahlfelge, Radgröße und Reifenlieferant erforderlich. Bei Contingent-Produkten sind Gesamtlaufzeit (inklusive Verlängerung) und Anzahl der Services zu konfigurieren. Wartungsprodukte werden wie Contingent-Produkte behandelt. Optionale Zusatzleistungen können hinzugefügt werden, sofern sie für das Produkt verfügbar sind. Fehlt bei den Reifenprodukten ein Pflichtfeld, sollte das System das Weitergehen blockieren. Bei Contingent-Produkten sollten die eingegebenen Werte vor der Bestätigung geprüft werden.

Anschließend gelangt der Nutzer zur Übersicht und Bestätigung. Der weitere Ablauf hängt vom Kanal ab: Im Retail-Kanal ist die Kundenunterschrift erforderlich, bevor die Verlängerung angewendet wird. Im Leasing-Kanal (in den Akzeptanzkriterien als MBLD-Kanal bezeichnet) wird der Antrag direkt per API ohne E-Mail-Benachrichtigung weitergeführt und die Verlängerung ohne Kundenunterschrift angewendet.

Nach der Bestätigung sollte die langfristige Verlängerung angewendet, der Vertrag sowie das FE aktualisiert, ein i155 erzeugt und die Systeme Revenue und Nemesis benachrichtigt werden.

Für die Benutzeroberfläche war vorgesehen, die Konfiguration der Nicht-FRD-Produkte (Reifen, Contingent, Wartung) abzubilden und dabei die Vorgaben des Mercedes-Benz Workbench einzuhalten. Als Risiko wurde genannt, dass unterschiedliche Nicht-FRD-Produkte voneinander abweichende Konfigurationslogik erfordern könnten, was zu fehlerhaften Validierungen führen kann.