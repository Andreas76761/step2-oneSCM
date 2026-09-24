# ADR-023 Analytik und Berichte

**Status:** akzeptiert, umgesetzt in Etappe 8

## Entscheidung
- **Zustandsgrößen** (Textabschnitte, bestätigter Anteil, offene Befunde und Blocker, Kapitel, freigegebene Kapitel, in Prüfung, Nachweisabdeckung) werden **je Projekt und Tag** in `kpi_snapshots` festgehalten (Migration `013`): täglich um 00:05 UTC (Job `kpi-daily`, eine Kette je Installation) und bei jedem Aufruf der Analytik. Tage ohne Snapshot übernehmen den letzten Wert (Stufenfunktion). Archivierte Projekte schreiben keine Snapshots.
- **Flussgrößen** (Befunde neu/erledigt, Freigaben, Ablehnungen, Importe, Releases) werden aus den Zeitstempeln der Fachdaten berechnet – auch rückwirkend.
- **Freigabeprozess:** Prüfdauer = letzte Einreichung (Audit) → Entscheidung; Durchlaufzeit = Generierung → Freigabe; Median, P90, Maximum; Erstfreigabequote je Version.
- **Projektbericht** als PDF (pdfmake, ohne externe Abrufe): Kennzahlen mit Veränderung, Aktivität, Freigabeprozess, Kapitelstatus, offene Blocker, Übersetzungsstand, Releases.
- **BI-Export** `GET /analytics/export/{kpis|flow|approvals|chapters|findings}` als CSV (UTF-8 mit BOM, RFC 4180, Schutz vor Formel-Injektion) oder JSON mit stabilen Spaltennamen – für Power BI, Excel, Tableau.
- Zeitraum `from`/`to` (Standard 90 Tage, höchstens drei Jahre).

## Konsequenzen
- Zeitreihen beginnen mit der Einführung von Etappe 8; Flussgrößen sind auch für die Vergangenheit verfügbar.
