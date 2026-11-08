# Batch 891 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Gültigkeitsdauer von Angeboten (Proposal Validity)**

Im Bereich Contract Generation wird jedem Angebot (Proposal) ab seiner Erstellung eine Gültigkeitsdauer zugewiesen und überwacht. Kundinnen und Kunden profitieren dadurch von einem garantierten Preis für einen festgelegten Zeitraum. Angebote, die nicht innerhalb dieser Frist abgeschlossen werden, lehnt das System automatisch ab. Alle Berechnungen erfolgen in UTC.

**Konfiguration und Geltungsbereich**

Die Gültigkeitsdauer (Offer Validity) wird in den Markteinstellungen hinterlegt und für jede Division getrennt gepflegt, also für PC und VAN. Der konfigurierbare Wert beträgt mindestens 0,05 Tage (etwa eine Stunde). Empfohlen wird ein Höchstwert von 95 Tagen. Zwar lassen sich auch höhere Werte einstellen, dies kann jedoch zu Problemen auf Seiten von DSS führen. Die Funktion gilt für die Kundentypen Privat, Privat Behörden, Gewerbe, Gewerbe Flotte und Gewerbe Behörden sowie für den Vertriebskanal Retail.

**Identifikation eines Angebots**

Ein Angebot kann zunächst über eine oder mehrere der folgenden Angaben identifiziert werden: Fahrgestellnummer, Auftragsnummer, Deal-ID, Verso oder Baumuster.

**Ablauf bei Standardangeboten**

Erreicht ein neu angelegtes Angebot den Status „Created“, prüft das System, ob ausreichende Identifikationsdaten vorliegen. Wurde das Angebot mit einer anderen Angabe als ausschließlich einem Baumuster angelegt, ermittelt das System die für die Division des Angebots konfigurierte Gültigkeitsdauer und weist sie dem Angebot zu. Der Startzeitpunkt der Gültigkeit entspricht dem Zeitpunkt der Angebotserstellung. Das Enddatum ergibt sich aus dem Startdatum zuzüglich der konfigurierten Gültigkeitsdauer. Anschließend wird das Angebot im Rahmen der Gültigkeitsüberwachung geprüft.

**Angebote nur mit Baumuster**

Wird ein Angebot ausschließlich mit einem Baumuster angelegt, wird zunächst keine Gültigkeitsdauer zugewiesen, und es startet kein Countdown. Das Angebot bleibt im Wartezustand. Sobald später eine zusätzliche Angabe gespeichert wird (Deal-ID, Auftragsnummer, Verso oder Fahrgestellnummer), weist das System die konfigurierte Gültigkeitsdauer zu. Der Countdown beginnt ab dem Zeitpunkt, zu dem diese zusätzliche Angabe gespeichert wurde. Die Gültigkeit wird dabei nur einmal vergeben: Wird nach einer Deal-ID später noch eine Fahrgestellnummer ergänzt, berechnet das System die Gültigkeit nicht neu, und das ursprüngliche Ablaufdatum bleibt unverändert.

**Bestätigung vor Ablauf**

Erreicht das Angebot vor dem Ende der Gültigkeitsdauer den Status „Confirmed“, wird der Countdown beim Speichern der Bestätigung gestoppt. Das Angebot bleibt gültig, und es erfolgt keine automatische Ablehnung.

**Ablauf ohne Bestätigung**

Ist das Ende der Gültigkeitsdauer erreicht und das Angebot noch nicht bestätigt, setzt das System den Status automatisch auf „Rejected“. Als Standardgrund für die Ablehnung wird „Offer Validity Expired“ hinterlegt.

**Hinweis zu bestehenden Angeboten**

Bereits vorhandene Angebote sind von dieser Änderung nicht betroffen.