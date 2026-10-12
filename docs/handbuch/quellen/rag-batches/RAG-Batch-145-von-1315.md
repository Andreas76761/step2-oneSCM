# Batch 145 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

**Audit Report für Nemesis-Ereignisse (in Planung)**

Im Admin-Bereich des Nemesis-Menüs von oneSCM ist ein neuer Audit Report vorgesehen. Er fasst alle Ereignisse zusammen, die oneSCM an Nemesis gesendet hat, und stellt sie für Prüfzwecke bereit. Anwenderinnen und Anwender können Kunden-, Vertrags-, Umsatz- und Kostenereignisse auf Basis der gewählten Filter herunterladen. Das Angebot richtet sich an MPC und MO. Es soll die Beweissicherung nach Zeitraum, Schnittstellentyp oder Vertragsnummer ermöglichen, ohne dass dafür individuelle Supportanfragen nötig sind. Zudem soll es den Aufwand für Vorbereitung und Nachbereitung von Prüfungen durch Market Operations und die technischen Teams während der Abschlussphase einer Prüfung verringern.

Hintergrund sind externe Anforderungen an die Prüfungsbereitschaft sowie interne Compliance-Vorgaben. Bisher ist der Nachweis, was an Nemesis gesendet wurde, in oneSCM nicht als eigene Ansicht verfügbar und muss häufig manuell zusammengetragen werden. Es gibt keine einheitliche Sicht auf alle erfolgreich gesendeten Nemesis-Ereignisse. Große Ereignismengen, etwa bei Migrationen oder Massenversendungen zum Go-live, lassen sich nur schwer prüfen. MPC-Administratoren haben zudem keine marktübergreifende Nachweisansicht für Audits. Der Admin-Bereich bietet bislang vor allem Einblick in Nemesis-Fehler und Reparaturabläufe.

Der Audit Report wird als vierter Tab mit der Bezeichnung „Audit Report“ im Admin-Bereich ergänzt, neben den bestehenden Nemesis-Werkzeugen für Fehler und Synchronisation. Die Filter sind bewusst schlank gehalten: Von-Datum und Bis-Datum (jeweils bezogen auf das Sendedatum), Vertragsnummer sowie der Schnittstellentyp als Mehrfachauswahl. Zur Auswahl stehen Kunde, Vertrag, Umsatz und Kosten, wobei die Kosten nach VEGA und Nicht-VEGA unterschieden werden. Laut den Abnahmekriterien sollen beim Öffnen des Filterbereichs nur Von-Datum, Bis-Datum und Schnittstellentyp angezeigt werden.

Der Ablauf ist wie folgt vorgesehen: Zunächst wählen Anwenderinnen und Anwender den Von- und Bis-Zeitraum sowie die gewünschten Schnittstellentypen und starten die Suche. Die Ergebnisse werden pro Schnittstellentyp aggregiert und als .txt-Datei bereitgestellt. Diese lässt sich einzeln herunterladen, oder es werden mehrere ausgewählte Dateien gemeinsam als ZIP-Archiv heruntergeladen. So entstehen prüfungsgerechte Nachweisdateien. Beim Klick auf „Download“ erhält man jeweils eine Datei für den gewählten Schnittstellentyp und Zeitraum. Wichtig ist, dass die historischen Daten des Ereignisses geliefert werden: Wird ein Datum in der Suche eingegeben, sollen genau die Daten extrahiert werden, die zu diesem Zeitpunkt an Nemesis gesendet wurden. Der Zugriff auf den Tab setzt voraus, dass man Zugang zur Nemesis-Seite hat.

**Korrektur leerer Deckungscodes bei internationalen Werkstattrechnungen (fertiggestellt)**

Das Problem leerer Deckungscodes (Coverage Codes) beim Erstellen einer internationalen Werkstattrechnung wurde behoben.

**Pricing Engine (P.EN) (offen)**

Für die Pricing Engine (P.EN) ist ein Vorhaben angelegt, das sich derzeit noch im Status „Offen“ befindet. Nähere Angaben zu Umfang, Zielgruppe und Funktionsweise liegen noch nicht vor.