# Batch 234 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

**Vertragsverlängerung ausschließlich um Laufleistung**

Wird ein Vertrag nur um die Laufleistung verlängert, bleibt die Vertragslaufzeit unverändert, während der Preis angepasst wird. Der Zahlungsplan wird entsprechend aktualisiert. Bereits zuvor wurde die Aktualisierung des Zahlungsplans bei einer Verlängerung um „Laufleistung und Laufzeit" sowie bei einer Verlängerung nur um die Laufzeit umgesetzt. Das Wirksamkeitsdatum einer Verlängerung um Laufleistung muss spätestens im letzten Monat der Vertragslaufzeit liegen.

Das Verhalten hängt von der Kombination aus Vertragsart und Verlängerungsart ab. Ist der Vertrag monatlich und die Verlängerung ebenfalls monatlich, werden die geplanten Rechnungen mit dem neuen Betrag aktualisiert. Sind im Zahlungsplan keine geplanten Rechnungen vorhanden, werden ab dem Wirksamkeitsdatum neue Rechnungen für die Verlängerung angelegt. Ist der Vertrag monatlich und die Verlängerung einmalig, werden die geplanten Rechnungen gelöscht und nur eine neue Rechnung für die verbleibende Vertragslaufzeit erstellt. Der Rechnungszeitraum reicht dabei vom Wirksamkeitsdatum bis zum Vertragsende. Auch hier gilt: Gibt es keine geplanten Rechnungen, wird ab dem Wirksamkeitsdatum eine neue Rechnung im Zahlungsplan erzeugt.

Bei einem einmaligen Vertrag mit monatlicher Verlängerung werden die Rechnungen im Status „Geplant" mit dem neuen Betrag aus dem Zahlungsplan neu erzeugt. Befindet sich die Rechnung bereits im Status „Akzeptiert", „Exportiert", „FI-Dokument erstellt" oder weiter, werden ab dem Wirksamkeitsdatum neue Rechnungen im Zahlungsplan angelegt. Bei einem einmaligen Vertrag mit einmaliger Verlängerung wird eine Rechnung im Status „Geplant" mit dem neuen Betrag aktualisiert. Befindet sich die einmalige Rechnung bereits im Status „Akzeptiert", „Exportiert", „FI-Dokument erstellt" oder weiter, wird ab dem Wirksamkeitsdatum eine neue Rechnung erstellt.

**Rechnungen vor dem Export stornieren**

Da Rechnungen zunehmend automatisiert erstellt werden und auch manuell angelegte Rechnungen fehleranfällig sein können, besteht die Möglichkeit, eine Rechnung zu stornieren, bevor sie an das Finanzsystem exportiert wird. Die Stornierung setzt den Rechnungsstatus auf „Storniert". Weitere Schritte sind dafür nicht erforderlich. Anwender sollten jedoch beachten, dass nach einer Stornierung gegebenenfalls manuelle Schritte notwendig sind, etwa um Subventionen auszugleichen oder erneut zu erfassen.

Im Reiter „Zahlungen" des Vertrags (Kundenrechnungen und Preisminderungen) steht den Rollen MO und MPC in der Spalte „Aktionen" für Rechnungen im Status „Akzeptiert" die Option „Stornieren" zur Verfügung. Entsprechend der übrigen Anwendung befindet sich die Schaltfläche in der Detailansicht, genau wie beim Akzeptieren oder Stornieren aus dem Admin-Bereich. Im Admin-Bereich unter „Rechnungen" steht die Option „Stornieren" in der Spalte „Aktionen" für Rechnungen im Status „Erstellt" und „Akzeptiert" zur Verfügung. Berücksichtigt werden die Rechnungstypen MANU, DD, CAMP, SDAS, BDCR, FDCR, WSIN und SCOM. Nach einem Klick auf „Stornieren" erscheint die Warnmeldung „Invoice will be set to Cancelled" mit den Schaltflächen „OK" und „Cancel". Nach Bestätigung wird der Status der Rechnung auf „Storniert" gesetzt.

**Alle Rechnungen in der Ergebnistabelle des Admin-Bereichs**

Anwender mit den Rollen MO, MPC, HQ und Admin sehen im Admin-Bereich unter „Rechnungen" in der Ergebnistabelle alle in OneSCM erstellten Rechnungen, unabhängig vom Typ. Dazu zählen Balancing Document Contract Review (BDCR), Final Document Contract Review (FDCR), VEGA-Schadensfälle (CLAI), Provisionsrechnungen (SCOM), individuelle Rechnungen von Dienstleistern (SPIN), monatliche (periodische) Zahlungen an Dienstleister (SPMP), Werkstatt-Finanzdokumente (WSIN) sowie internationale Werkstattrechnungen (WSIN).

**Behobene Fehler**

Folgende Probleme wurden behoben: Eine Abweichung bei einem DOM-Element auf der Seite „Rechnungen" im Admin-Bereich, eine Kundenrechnung, die trotz erfolgreich ausgeführtem Job NacosInvE169Exp nicht in den Status „Exportiert" wechselte, sowie ein leeres Dropdown für den Coverage Code beim Erstellen einer Werkstattrechnung.