dash.calc('kpi_mo', { title: 'KPIs Market Operation', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je KPI.', inputs: ['mo_monthly'],
  fn: (mo_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const defs = [["revenue_k", "Umsatz", "eur_k", 1, "target_k", 0], ["orders", "Aufträge", "int", 1, 9000, 1], ["active_dealers", "Aktive Händler", "int", 1, 640, 1], ["yoy_pct", "Wachstum ggü. Vorjahr", "pct", 1, 5.0, 0], ["aov_eur", "Ø Auftragswert", "eur", 1, 500, 0]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) for (const [dim, member] of SC) {
    const rows = mo_monthly.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi];
        const target = typeof t === 'string' ? a[t] : cnt ? t * SH[region] * MS[member] : t, pp = unit === 'pct';
        const ok = target == null ? null : hib ? value >= target : value <= target;
        out.push({ region, dim, member, month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('ins_mo', { title: 'Summary Market Operation', description: 'Kurzfazit und Handlungsempfehlung je Grafik, Region und Monat.', inputs: ['mo_monthly', 'mo_country'],
  fn: (mo_monthly, mo_country) => {
  const ALL = mo_monthly, DET = mo_country;
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', int: (v) => nf(v, 0), days: (v) => nf(v, 1) + ' Tage',
    eur: (v) => nf(v, 2) + ' €', eur0: (v) => nf(v, 0) + ' €', score: (v) => nf(v, 2), idx: (v) => nf(v, 1), n1: (v) => nf(v, 1) };
  const T = [{"id": "mo_0", "y": "revenue_k", "unit": "eur_k", "target": "target_k", "hib": 1, "cnt": 0, "lab": "Umsatz", "ok": "Wachstum in starken Regionen sichern und Aktionsbudget gezielt auf Händler mit Potenzial legen.", "miss": "Zielgap mit den Regionalleitern schließen: Top-Händler-Besuche, Cross-Selling-Aktionen und Reaktivierung inaktiver Händler priorisieren."}, {"id": "mo_1", "y": "orders", "unit": "int", "target": 9000, "hib": 1, "cnt": 1, "lab": "Aufträge", "ok": "Auftragsvolumen halten und den Anteil Online-Bestellungen weiter ausbauen.", "miss": "Auftragsrückgang analysieren (Händlerfrequenz, Verfügbarkeit) und Reaktivierungs- sowie Bündelangebote starten."}];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) {
  for (const [dim, member] of SC) {
    const mon = ALL.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < mon.length; i++) {
      const month = mon[i].month;
      for (const s of T) {
        const v = mon[i][s.y], p = mon[i - 1][s.y], b3 = mon[Math.max(0, i - 3)][s.y];
        const t = typeof s.target === 'string' ? mon[i][s.target] : s.target * (s.cnt ? SH[region] * MS[member] : 1);
        const ok = s.hib ? v >= t : v <= t, better = s.hib ? v >= b3 : v <= b3;
        const d = (v / p - 1) * 100, sign = d >= 0 ? '+' : '−';
        const summary = s.lab + ': ' + F[s.unit](v) + ' (' + sign + nf(Math.abs(d), 1) + ' % ggü. Vormonat), Ziel ' + F[s.unit](t) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.';
        const rec = ok ? (better ? s.ok : 'Trend dreht – frühzeitig gegensteuern. ' + s.ok) : (better ? s.miss + ' Trend verbessert sich – Maßnahmen fortführen.' : 'Handlungsbedarf: ' + s.miss);
        out.push({ id: s.id, region, dim, member, month, ok, summary, rec });
      }
    }
  }
    const det = true ? DET.filter((r) => region === 'Alle' || r.region === region) : DET.filter((r) => r.region === region);
    const D = {"id": "mo_d", "cat": "country", "val": "revenue_k", "unit": "eur_k", "limit": null, "hib": 1, "cmp": "target_k", "lab": "Umsatz je Land", "ok": "Alle Länder im Plan – Best Practices des stärksten Landes ausrollen.", "miss": "Länder unter Plan mit Maßnahmenplan hinterlegen (Außendienst-Kapazität, lokale Aktionen) und monatlich nachhalten."};
    const sorted = det.slice().sort((a, b) => b[D.val] - a[D.val]);
    const hi = sorted[0], lo = sorted[sorted.length - 1];
    let summary, rec, ok = true;
    if (D.cmp) {
      const gap = det.filter((r) => r[D.val] < r[D.cmp]);
      ok = gap.length === 0;
      const w = det.slice().sort((a, b) => (a[D.val] - a[D.cmp]) - (b[D.val] - b[D.cmp]))[0];
      summary = D.lab + ': ' + gap.length + ' von ' + det.length + ' unter Plan' + (ok ? '' : '; größte Lücke ' + w[D.cat] + ' (' + F[D.unit](w[D.val] - w[D.cmp]) + ')') + '.';
    } else if (D.limit != null) {
      const bad = det.filter((r) => (D.hib ? r[D.val] < D.limit : r[D.val] > D.limit));
      ok = bad.length === 0;
      const w = det.slice().sort((a, b) => (D.hib ? a[D.val] - b[D.val] : b[D.val] - a[D.val]))[0];
      summary = D.lab + ': ' + bad.length + ' von ' + det.length + ' ' + (D.hib ? 'unter' : 'über') + ' dem Grenzwert ' + F[D.unit](D.limit) + (ok ? '' : '; kritischster Wert ' + w[D.cat] + ' (' + F[D.unit](w[D.val]) + ')') + '.';
    } else {
      const tot = det.reduce((a, r) => a + r[D.val], 0);
      summary = D.lab + ': größter Posten ' + hi[D.cat] + ' (' + F[D.unit](hi[D.val]) + ', ' + nf(hi[D.val] / tot * 100, 0) + ' % des Gesamtwerts), kleinster ' + lo[D.cat] + ' (' + F[D.unit](lo[D.val]) + ').';
    }
    rec = ok ? D.ok : D.miss;
    out.push({ id: D.id, region, dim: 'Alle', member: 'Alle', month: 'all', ok, summary, rec });
  }
  return out;
} });
dash.calc('kpi_pm', { title: 'KPIs Productmanagement', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je KPI.', inputs: ['pm_monthly'],
  fn: (pm_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const defs = [["gross_margin_pct", "Rohertragsmarge", "pct", 1, 38.0, 0], ["coverage_pct", "Fahrzeugabdeckung", "pct", 1, 92.0, 0], ["obsolete_share_pct", "Ladenhüter-Anteil", "pct", 0, 4.0, 0], ["ttm_days", "Time-to-Market", "days", 0, 45, 0], ["new_skus", "Neue SKUs", "int", 1, 250, 1]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) for (const [dim, member] of SC) {
    const rows = pm_monthly.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi];
        const target = typeof t === 'string' ? a[t] : cnt ? t * SH[region] * MS[member] : t, pp = unit === 'pct';
        const ok = target == null ? null : hib ? value >= target : value <= target;
        out.push({ region, dim, member, month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('ins_pm', { title: 'Summary Productmanagement', description: 'Kurzfazit und Handlungsempfehlung je Grafik, Region und Monat.', inputs: ['pm_monthly', 'pm_category'],
  fn: (pm_monthly, pm_category) => {
  const ALL = pm_monthly, DET = pm_category;
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', int: (v) => nf(v, 0), days: (v) => nf(v, 1) + ' Tage',
    eur: (v) => nf(v, 2) + ' €', eur0: (v) => nf(v, 0) + ' €', score: (v) => nf(v, 2), idx: (v) => nf(v, 1), n1: (v) => nf(v, 1) };
  const T = [{"id": "pm_0", "y": "gross_margin_pct", "unit": "pct", "target": 38.0, "hib": 1, "cnt": 0, "lab": "Rohertragsmarge", "ok": "Margenniveau absichern und den Sortimentsmix weiter zu margenstarken Kategorien verschieben.", "miss": "Sortiment bereinigen, Einkaufskonditionen nachverhandeln und margenschwache Kategorien prüfen."}, {"id": "pm_1", "y": "new_skus", "unit": "int", "target": 250, "hib": 1, "cnt": 1, "lab": "Neue SKUs", "ok": "Listungspipeline halten; Fokus auf Fahrzeugabdeckung für Neufahrzeuge.", "miss": "Listungsprozess beschleunigen: Lieferantenfreigaben bündeln und Engpässe im Stammdatenteam beheben."}];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) {
  for (const [dim, member] of SC) {
    const mon = ALL.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < mon.length; i++) {
      const month = mon[i].month;
      for (const s of T) {
        const v = mon[i][s.y], p = mon[i - 1][s.y], b3 = mon[Math.max(0, i - 3)][s.y];
        const t = typeof s.target === 'string' ? mon[i][s.target] : s.target * (s.cnt ? SH[region] * MS[member] : 1);
        const ok = s.hib ? v >= t : v <= t, better = s.hib ? v >= b3 : v <= b3;
        const d = (v / p - 1) * 100, sign = d >= 0 ? '+' : '−';
        const summary = s.lab + ': ' + F[s.unit](v) + ' (' + sign + nf(Math.abs(d), 1) + ' % ggü. Vormonat), Ziel ' + F[s.unit](t) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.';
        const rec = ok ? (better ? s.ok : 'Trend dreht – frühzeitig gegensteuern. ' + s.ok) : (better ? s.miss + ' Trend verbessert sich – Maßnahmen fortführen.' : 'Handlungsbedarf: ' + s.miss);
        out.push({ id: s.id, region, dim, member, month, ok, summary, rec });
      }
    }
  }
    const det = false ? DET.filter((r) => region === 'Alle' || r.region === region) : DET.filter((r) => r.region === region);
    const D = {"id": "pm_d", "cat": "category", "val": "margin_pct", "unit": "pct", "limit": 38.0, "hib": 1, "cmp": null, "lab": "Marge je Kategorie", "ok": "Alle Kategorien über Zielmarge – Preise und Konditionen stabil halten.", "miss": "Kategorien unter Zielmarge: Preis- und Einkaufsmaßnahmen gemeinsam mit Pricing planen und Ladenhüter abverkaufen."};
    const sorted = det.slice().sort((a, b) => b[D.val] - a[D.val]);
    const hi = sorted[0], lo = sorted[sorted.length - 1];
    let summary, rec, ok = true;
    if (D.cmp) {
      const gap = det.filter((r) => r[D.val] < r[D.cmp]);
      ok = gap.length === 0;
      const w = det.slice().sort((a, b) => (a[D.val] - a[D.cmp]) - (b[D.val] - b[D.cmp]))[0];
      summary = D.lab + ': ' + gap.length + ' von ' + det.length + ' unter Plan' + (ok ? '' : '; größte Lücke ' + w[D.cat] + ' (' + F[D.unit](w[D.val] - w[D.cmp]) + ')') + '.';
    } else if (D.limit != null) {
      const bad = det.filter((r) => (D.hib ? r[D.val] < D.limit : r[D.val] > D.limit));
      ok = bad.length === 0;
      const w = det.slice().sort((a, b) => (D.hib ? a[D.val] - b[D.val] : b[D.val] - a[D.val]))[0];
      summary = D.lab + ': ' + bad.length + ' von ' + det.length + ' ' + (D.hib ? 'unter' : 'über') + ' dem Grenzwert ' + F[D.unit](D.limit) + (ok ? '' : '; kritischster Wert ' + w[D.cat] + ' (' + F[D.unit](w[D.val]) + ')') + '.';
    } else {
      const tot = det.reduce((a, r) => a + r[D.val], 0);
      summary = D.lab + ': größter Posten ' + hi[D.cat] + ' (' + F[D.unit](hi[D.val]) + ', ' + nf(hi[D.val] / tot * 100, 0) + ' % des Gesamtwerts), kleinster ' + lo[D.cat] + ' (' + F[D.unit](lo[D.val]) + ').';
    }
    rec = ok ? D.ok : D.miss;
    out.push({ id: D.id, region, dim: 'Alle', member: 'Alle', month: 'all', ok, summary, rec });
  }
  return out;
} });
dash.calc('kpi_pr', { title: 'KPIs Pricing', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je KPI.', inputs: ['pr_monthly'],
  fn: (pr_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const defs = [["realization_pct", "Preisdurchsetzung", "pct", 1, 97.0, 0], ["margin_pct", "Rohertragsmarge", "pct", 1, 36.0, 0], ["discount_pct", "Rabattquote", "pct", 0, 12.0, 0], ["price_index", "Preisindex vs. Wettbewerb", "idx", 0, 102.0, 0], ["price_changes", "Preisänderungen", "int", null, null, 0]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) for (const [dim, member] of SC) {
    const rows = pr_monthly.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi];
        const target = typeof t === 'string' ? a[t] : cnt ? t * SH[region] * MS[member] : t, pp = unit === 'pct';
        const ok = target == null ? null : hib ? value >= target : value <= target;
        out.push({ region, dim, member, month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('ins_pr', { title: 'Summary Pricing', description: 'Kurzfazit und Handlungsempfehlung je Grafik, Region und Monat.', inputs: ['pr_monthly', 'pr_category'],
  fn: (pr_monthly, pr_category) => {
  const ALL = pr_monthly, DET = pr_category;
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', int: (v) => nf(v, 0), days: (v) => nf(v, 1) + ' Tage',
    eur: (v) => nf(v, 2) + ' €', eur0: (v) => nf(v, 0) + ' €', score: (v) => nf(v, 2), idx: (v) => nf(v, 1), n1: (v) => nf(v, 1) };
  const T = [{"id": "pr_0", "y": "discount_pct", "unit": "pct", "target": 12.0, "hib": 0, "cnt": 0, "lab": "Rabattquote", "ok": "Rabattdisziplin beibehalten und den Freigabe-Workflow weiter konsequent nutzen.", "miss": "Rabattfreigaben straffen, Ausnahmen je Kunde monatlich reviewen und das Staffelmodell überarbeiten."}, {"id": "pr_1", "y": "price_index", "unit": "idx", "target": 102.0, "hib": 0, "cnt": 0, "lab": "Preisindex", "ok": "Wettbewerbsposition stabil – Preisspielräume bei margenstarken Teilen prüfen.", "miss": "Artikel über Marktniveau identifizieren und selektiv anpassen; Preiswahrnehmung bei Schlüsselteilen schützen."}];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) {
  for (const [dim, member] of SC) {
    const mon = ALL.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < mon.length; i++) {
      const month = mon[i].month;
      for (const s of T) {
        const v = mon[i][s.y], p = mon[i - 1][s.y], b3 = mon[Math.max(0, i - 3)][s.y];
        const t = typeof s.target === 'string' ? mon[i][s.target] : s.target * (s.cnt ? SH[region] * MS[member] : 1);
        const ok = s.hib ? v >= t : v <= t, better = s.hib ? v >= b3 : v <= b3;
        const d = (v / p - 1) * 100, sign = d >= 0 ? '+' : '−';
        const summary = s.lab + ': ' + F[s.unit](v) + ' (' + sign + nf(Math.abs(d), 1) + ' % ggü. Vormonat), Ziel ' + F[s.unit](t) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.';
        const rec = ok ? (better ? s.ok : 'Trend dreht – frühzeitig gegensteuern. ' + s.ok) : (better ? s.miss + ' Trend verbessert sich – Maßnahmen fortführen.' : 'Handlungsbedarf: ' + s.miss);
        out.push({ id: s.id, region, dim, member, month, ok, summary, rec });
      }
    }
  }
    const det = false ? DET.filter((r) => region === 'Alle' || r.region === region) : DET.filter((r) => r.region === region);
    const D = {"id": "pr_d", "cat": "category", "val": "discount_pct", "unit": "pct", "limit": 12.0, "hib": 0, "cmp": null, "lab": "Rabattquote je Kategorie", "ok": "Alle Kategorien innerhalb der Rabattgrenze – Matrix beibehalten.", "miss": "Kategorien über der Grenze: Rabattmatrix anpassen und Ausnahmen nur noch mit Freigabe zulassen."};
    const sorted = det.slice().sort((a, b) => b[D.val] - a[D.val]);
    const hi = sorted[0], lo = sorted[sorted.length - 1];
    let summary, rec, ok = true;
    if (D.cmp) {
      const gap = det.filter((r) => r[D.val] < r[D.cmp]);
      ok = gap.length === 0;
      const w = det.slice().sort((a, b) => (a[D.val] - a[D.cmp]) - (b[D.val] - b[D.cmp]))[0];
      summary = D.lab + ': ' + gap.length + ' von ' + det.length + ' unter Plan' + (ok ? '' : '; größte Lücke ' + w[D.cat] + ' (' + F[D.unit](w[D.val] - w[D.cmp]) + ')') + '.';
    } else if (D.limit != null) {
      const bad = det.filter((r) => (D.hib ? r[D.val] < D.limit : r[D.val] > D.limit));
      ok = bad.length === 0;
      const w = det.slice().sort((a, b) => (D.hib ? a[D.val] - b[D.val] : b[D.val] - a[D.val]))[0];
      summary = D.lab + ': ' + bad.length + ' von ' + det.length + ' ' + (D.hib ? 'unter' : 'über') + ' dem Grenzwert ' + F[D.unit](D.limit) + (ok ? '' : '; kritischster Wert ' + w[D.cat] + ' (' + F[D.unit](w[D.val]) + ')') + '.';
    } else {
      const tot = det.reduce((a, r) => a + r[D.val], 0);
      summary = D.lab + ': größter Posten ' + hi[D.cat] + ' (' + F[D.unit](hi[D.val]) + ', ' + nf(hi[D.val] / tot * 100, 0) + ' % des Gesamtwerts), kleinster ' + lo[D.cat] + ' (' + F[D.unit](lo[D.val]) + ').';
    }
    rec = ok ? D.ok : D.miss;
    out.push({ id: D.id, region, dim: 'Alle', member: 'Alle', month: 'all', ok, summary, rec });
  }
  return out;
} });
dash.calc('kpi_lg', { title: 'KPIs Logistik', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je KPI.', inputs: ['lg_monthly'],
  fn: (lg_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const defs = [["otif_pct", "OTIF (On-Time-In-Full)", "pct", 1, 95.0, 0], ["fill_rate_pct", "Lieferbereitschaft", "pct", 1, 97.0, 0], ["backorder_pct", "Rückstandsquote", "pct", 0, 3.0, 0], ["lead_time_days", "Lieferzeit", "days", 0, 2.0, 0], ["cost_per_line_eur", "Kosten je Auftragszeile", "eur", 0, 1.8, 0], ["inventory_turn", "Lagerumschlag", "n1", 1, 6.0, 0]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) for (const [dim, member] of SC) {
    const rows = lg_monthly.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi];
        const target = typeof t === 'string' ? a[t] : cnt ? t * SH[region] * MS[member] : t, pp = unit === 'pct';
        const ok = target == null ? null : hib ? value >= target : value <= target;
        out.push({ region, dim, member, month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('ins_lg', { title: 'Summary Logistik', description: 'Kurzfazit und Handlungsempfehlung je Grafik, Region und Monat.', inputs: ['lg_monthly', 'lg_carrier'],
  fn: (lg_monthly, lg_carrier) => {
  const ALL = lg_monthly, DET = lg_carrier;
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', int: (v) => nf(v, 0), days: (v) => nf(v, 1) + ' Tage',
    eur: (v) => nf(v, 2) + ' €', eur0: (v) => nf(v, 0) + ' €', score: (v) => nf(v, 2), idx: (v) => nf(v, 1), n1: (v) => nf(v, 1) };
  const T = [{"id": "lg_0", "y": "otif_pct", "unit": "pct", "target": 95.0, "hib": 1, "cnt": 0, "lab": "OTIF", "ok": "Servicegrad halten und Engpassteile weiter proaktiv absichern.", "miss": "Verspätungsursachen (Lieferanten, Kommissionierung, Carrier) analysieren und Sicherheitsbestände für A-Teile erhöhen."}, {"id": "lg_1", "y": "backorder_pct", "unit": "pct", "target": 3.0, "hib": 0, "cnt": 0, "lab": "Rückstandsquote", "ok": "Rückstände unter Kontrolle – Bestandsplanung beibehalten.", "miss": "Rückstandsliste täglich priorisieren, Lieferanten-Expedite starten und Alternativteile anbieten."}];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) {
  for (const [dim, member] of SC) {
    const mon = ALL.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < mon.length; i++) {
      const month = mon[i].month;
      for (const s of T) {
        const v = mon[i][s.y], p = mon[i - 1][s.y], b3 = mon[Math.max(0, i - 3)][s.y];
        const t = typeof s.target === 'string' ? mon[i][s.target] : s.target * (s.cnt ? SH[region] * MS[member] : 1);
        const ok = s.hib ? v >= t : v <= t, better = s.hib ? v >= b3 : v <= b3;
        const d = (v / p - 1) * 100, sign = d >= 0 ? '+' : '−';
        const summary = s.lab + ': ' + F[s.unit](v) + ' (' + sign + nf(Math.abs(d), 1) + ' % ggü. Vormonat), Ziel ' + F[s.unit](t) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.';
        const rec = ok ? (better ? s.ok : 'Trend dreht – frühzeitig gegensteuern. ' + s.ok) : (better ? s.miss + ' Trend verbessert sich – Maßnahmen fortführen.' : 'Handlungsbedarf: ' + s.miss);
        out.push({ id: s.id, region, dim, member, month, ok, summary, rec });
      }
    }
  }
    const det = false ? DET.filter((r) => region === 'Alle' || r.region === region) : DET.filter((r) => r.region === region);
    const D = {"id": "lg_d", "cat": "carrier", "val": "on_time_pct", "unit": "pct", "limit": 95.0, "hib": 1, "cmp": null, "lab": "Pünktlichkeit je Carrier", "ok": "Alle Carrier erfüllen die Zusage – Volumenverteilung beibehalten.", "miss": "Carrier unter Ziel mit SLA-Gespräch eskalieren und Volumen ggf. zu stärkeren Carriern verlagern."};
    const sorted = det.slice().sort((a, b) => b[D.val] - a[D.val]);
    const hi = sorted[0], lo = sorted[sorted.length - 1];
    let summary, rec, ok = true;
    if (D.cmp) {
      const gap = det.filter((r) => r[D.val] < r[D.cmp]);
      ok = gap.length === 0;
      const w = det.slice().sort((a, b) => (a[D.val] - a[D.cmp]) - (b[D.val] - b[D.cmp]))[0];
      summary = D.lab + ': ' + gap.length + ' von ' + det.length + ' unter Plan' + (ok ? '' : '; größte Lücke ' + w[D.cat] + ' (' + F[D.unit](w[D.val] - w[D.cmp]) + ')') + '.';
    } else if (D.limit != null) {
      const bad = det.filter((r) => (D.hib ? r[D.val] < D.limit : r[D.val] > D.limit));
      ok = bad.length === 0;
      const w = det.slice().sort((a, b) => (D.hib ? a[D.val] - b[D.val] : b[D.val] - a[D.val]))[0];
      summary = D.lab + ': ' + bad.length + ' von ' + det.length + ' ' + (D.hib ? 'unter' : 'über') + ' dem Grenzwert ' + F[D.unit](D.limit) + (ok ? '' : '; kritischster Wert ' + w[D.cat] + ' (' + F[D.unit](w[D.val]) + ')') + '.';
    } else {
      const tot = det.reduce((a, r) => a + r[D.val], 0);
      summary = D.lab + ': größter Posten ' + hi[D.cat] + ' (' + F[D.unit](hi[D.val]) + ', ' + nf(hi[D.val] / tot * 100, 0) + ' % des Gesamtwerts), kleinster ' + lo[D.cat] + ' (' + F[D.unit](lo[D.val]) + ').';
    }
    rec = ok ? D.ok : D.miss;
    out.push({ id: D.id, region, dim: 'Alle', member: 'Alle', month: 'all', ok, summary, rec });
  }
  return out;
} });
dash.calc('kpi_tr', { title: 'KPIs Training', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je KPI.', inputs: ['tr_monthly'],
  fn: (tr_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const defs = [["certified_pct", "Zertifizierungsgrad", "pct", 1, 85.0, 0], ["satisfaction", "Teilnehmerzufriedenheit", "score", 1, 4.5, 0], ["completion_pct", "Abschlussquote", "pct", 1, 90.0, 0], ["participants", "Teilnehmer", "int", 1, 280, 1], ["trainings", "Schulungen", "int", 1, 20, 1]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) for (const [dim, member] of SC) {
    const rows = tr_monthly.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi];
        const target = typeof t === 'string' ? a[t] : cnt ? t * SH[region] * MS[member] : t, pp = unit === 'pct';
        const ok = target == null ? null : hib ? value >= target : value <= target;
        out.push({ region, dim, member, month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('ins_tr', { title: 'Summary Training', description: 'Kurzfazit und Handlungsempfehlung je Grafik, Region und Monat.', inputs: ['tr_monthly', 'tr_course'],
  fn: (tr_monthly, tr_course) => {
  const ALL = tr_monthly, DET = tr_course;
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', int: (v) => nf(v, 0), days: (v) => nf(v, 1) + ' Tage',
    eur: (v) => nf(v, 2) + ' €', eur0: (v) => nf(v, 0) + ' €', score: (v) => nf(v, 2), idx: (v) => nf(v, 1), n1: (v) => nf(v, 1) };
  const T = [{"id": "tr_0", "y": "participants", "unit": "int", "target": 280, "hib": 1, "cnt": 1, "lab": "Teilnehmer", "ok": "Reichweite halten und Online-Formate für Händler mit weiter Anreise ausbauen.", "miss": "Termine früher kommunizieren, Händlerquoten nachfassen und Webinar-Alternativen anbieten."}, {"id": "tr_1", "y": "satisfaction", "unit": "score", "target": 4.5, "hib": 1, "cnt": 0, "lab": "Zufriedenheit", "ok": "Qualität sichern und Trainer-Feedback in Kursupdates einarbeiten.", "miss": "Kursfeedback auswerten, schwach bewertete Module überarbeiten und Trainer-Coaching ansetzen."}];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) {
  for (const [dim, member] of SC) {
    const mon = ALL.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < mon.length; i++) {
      const month = mon[i].month;
      for (const s of T) {
        const v = mon[i][s.y], p = mon[i - 1][s.y], b3 = mon[Math.max(0, i - 3)][s.y];
        const t = typeof s.target === 'string' ? mon[i][s.target] : s.target * (s.cnt ? SH[region] * MS[member] : 1);
        const ok = s.hib ? v >= t : v <= t, better = s.hib ? v >= b3 : v <= b3;
        const d = (v / p - 1) * 100, sign = d >= 0 ? '+' : '−';
        const summary = s.lab + ': ' + F[s.unit](v) + ' (' + sign + nf(Math.abs(d), 1) + ' % ggü. Vormonat), Ziel ' + F[s.unit](t) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.';
        const rec = ok ? (better ? s.ok : 'Trend dreht – frühzeitig gegensteuern. ' + s.ok) : (better ? s.miss + ' Trend verbessert sich – Maßnahmen fortführen.' : 'Handlungsbedarf: ' + s.miss);
        out.push({ id: s.id, region, dim, member, month, ok, summary, rec });
      }
    }
  }
    const det = false ? DET.filter((r) => region === 'Alle' || r.region === region) : DET.filter((r) => r.region === region);
    const D = {"id": "tr_d", "cat": "course", "val": "participants", "unit": "int", "limit": null, "hib": 1, "cmp": null, "lab": "Teilnehmer je Thema", "ok": "Nachfrage zeigt klare Schwerpunkte: Kapazitäten für gefragte Themen ausbauen.", "miss": "Nachfrage zeigt klare Schwerpunkte: Kapazitäten für gefragte Themen ausbauen, schwach gebuchte Kurse prüfen."};
    const sorted = det.slice().sort((a, b) => b[D.val] - a[D.val]);
    const hi = sorted[0], lo = sorted[sorted.length - 1];
    let summary, rec, ok = true;
    if (D.cmp) {
      const gap = det.filter((r) => r[D.val] < r[D.cmp]);
      ok = gap.length === 0;
      const w = det.slice().sort((a, b) => (a[D.val] - a[D.cmp]) - (b[D.val] - b[D.cmp]))[0];
      summary = D.lab + ': ' + gap.length + ' von ' + det.length + ' unter Plan' + (ok ? '' : '; größte Lücke ' + w[D.cat] + ' (' + F[D.unit](w[D.val] - w[D.cmp]) + ')') + '.';
    } else if (D.limit != null) {
      const bad = det.filter((r) => (D.hib ? r[D.val] < D.limit : r[D.val] > D.limit));
      ok = bad.length === 0;
      const w = det.slice().sort((a, b) => (D.hib ? a[D.val] - b[D.val] : b[D.val] - a[D.val]))[0];
      summary = D.lab + ': ' + bad.length + ' von ' + det.length + ' ' + (D.hib ? 'unter' : 'über') + ' dem Grenzwert ' + F[D.unit](D.limit) + (ok ? '' : '; kritischster Wert ' + w[D.cat] + ' (' + F[D.unit](w[D.val]) + ')') + '.';
    } else {
      const tot = det.reduce((a, r) => a + r[D.val], 0);
      summary = D.lab + ': größter Posten ' + hi[D.cat] + ' (' + F[D.unit](hi[D.val]) + ', ' + nf(hi[D.val] / tot * 100, 0) + ' % des Gesamtwerts), kleinster ' + lo[D.cat] + ' (' + F[D.unit](lo[D.val]) + ').';
    }
    rec = ok ? D.ok : D.miss;
    out.push({ id: D.id, region, dim: 'Alle', member: 'Alle', month: 'all', ok, summary, rec });
  }
  return out;
} });
dash.calc('kpi_wa', { title: 'KPIs Warranty', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je KPI.', inputs: ['wa_monthly'],
  fn: (wa_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const defs = [["claim_rate_pct", "Reklamationsquote", "pct", 0, 1.2, 0], ["processing_days", "Bearbeitungsdauer", "days", 0, 5.0, 0], ["recovery_pct", "Lieferantenregress", "pct", 1, 60.0, 0], ["claim_cost_k", "Garantiekosten", "eur_k", 0, 350, 1], ["claims", "Reklamationen", "int", 0, 520, 1]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) for (const [dim, member] of SC) {
    const rows = wa_monthly.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi];
        const target = typeof t === 'string' ? a[t] : cnt ? t * SH[region] * MS[member] : t, pp = unit === 'pct';
        const ok = target == null ? null : hib ? value >= target : value <= target;
        out.push({ region, dim, member, month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('ins_wa', { title: 'Summary Warranty', description: 'Kurzfazit und Handlungsempfehlung je Grafik, Region und Monat.', inputs: ['wa_monthly', 'wa_cause'],
  fn: (wa_monthly, wa_cause) => {
  const ALL = wa_monthly, DET = wa_cause;
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', int: (v) => nf(v, 0), days: (v) => nf(v, 1) + ' Tage',
    eur: (v) => nf(v, 2) + ' €', eur0: (v) => nf(v, 0) + ' €', score: (v) => nf(v, 2), idx: (v) => nf(v, 1), n1: (v) => nf(v, 1) };
  const T = [{"id": "wa_0", "y": "claim_rate_pct", "unit": "pct2", "target": 1.2, "hib": 0, "cnt": 0, "lab": "Reklamationsquote", "ok": "Qualitätsniveau halten und Lieferantenaudits fortsetzen.", "miss": "Top-Fehlerursachen mit Lieferanten und Einkauf adressieren; Einbauhinweise und Teilequalität prüfen."}, {"id": "wa_1", "y": "claim_cost_k", "unit": "eur_k", "target": 350, "hib": 0, "cnt": 1, "lab": "Garantiekosten", "ok": "Kosten im Rahmen – Lieferantenregress konsequent weiterführen.", "miss": "Regressquote erhöhen, hochpreisige Fälle (Elektrik) priorisieren und Kulanzregeln schärfen."}];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) {
  for (const [dim, member] of SC) {
    const mon = ALL.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < mon.length; i++) {
      const month = mon[i].month;
      for (const s of T) {
        const v = mon[i][s.y], p = mon[i - 1][s.y], b3 = mon[Math.max(0, i - 3)][s.y];
        const t = typeof s.target === 'string' ? mon[i][s.target] : s.target * (s.cnt ? SH[region] * MS[member] : 1);
        const ok = s.hib ? v >= t : v <= t, better = s.hib ? v >= b3 : v <= b3;
        const d = (v / p - 1) * 100, sign = d >= 0 ? '+' : '−';
        const summary = s.lab + ': ' + F[s.unit](v) + ' (' + sign + nf(Math.abs(d), 1) + ' % ggü. Vormonat), Ziel ' + F[s.unit](t) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.';
        const rec = ok ? (better ? s.ok : 'Trend dreht – frühzeitig gegensteuern. ' + s.ok) : (better ? s.miss + ' Trend verbessert sich – Maßnahmen fortführen.' : 'Handlungsbedarf: ' + s.miss);
        out.push({ id: s.id, region, dim, member, month, ok, summary, rec });
      }
    }
  }
    const det = false ? DET.filter((r) => region === 'Alle' || r.region === region) : DET.filter((r) => r.region === region);
    const D = {"id": "wa_d", "cat": "cause", "val": "cost_k", "unit": "eur_k", "limit": null, "hib": 0, "cmp": null, "lab": "Kosten je Ursache", "ok": "Größte Kostentreiber gezielt mit Lieferant bzw. Schulung angehen (z. B. Falscher Einbau → Training).", "miss": "Größte Kostentreiber gezielt mit Lieferant bzw. Schulung angehen (z. B. Falscher Einbau → Training)."};
    const sorted = det.slice().sort((a, b) => b[D.val] - a[D.val]);
    const hi = sorted[0], lo = sorted[sorted.length - 1];
    let summary, rec, ok = true;
    if (D.cmp) {
      const gap = det.filter((r) => r[D.val] < r[D.cmp]);
      ok = gap.length === 0;
      const w = det.slice().sort((a, b) => (a[D.val] - a[D.cmp]) - (b[D.val] - b[D.cmp]))[0];
      summary = D.lab + ': ' + gap.length + ' von ' + det.length + ' unter Plan' + (ok ? '' : '; größte Lücke ' + w[D.cat] + ' (' + F[D.unit](w[D.val] - w[D.cmp]) + ')') + '.';
    } else if (D.limit != null) {
      const bad = det.filter((r) => (D.hib ? r[D.val] < D.limit : r[D.val] > D.limit));
      ok = bad.length === 0;
      const w = det.slice().sort((a, b) => (D.hib ? a[D.val] - b[D.val] : b[D.val] - a[D.val]))[0];
      summary = D.lab + ': ' + bad.length + ' von ' + det.length + ' ' + (D.hib ? 'unter' : 'über') + ' dem Grenzwert ' + F[D.unit](D.limit) + (ok ? '' : '; kritischster Wert ' + w[D.cat] + ' (' + F[D.unit](w[D.val]) + ')') + '.';
    } else {
      const tot = det.reduce((a, r) => a + r[D.val], 0);
      summary = D.lab + ': größter Posten ' + hi[D.cat] + ' (' + F[D.unit](hi[D.val]) + ', ' + nf(hi[D.val] / tot * 100, 0) + ' % des Gesamtwerts), kleinster ' + lo[D.cat] + ' (' + F[D.unit](lo[D.val]) + ').';
    }
    rec = ok ? D.ok : D.miss;
    out.push({ id: D.id, region, dim: 'Alle', member: 'Alle', month: 'all', ok, summary, rec });
  }
  return out;
} });
dash.calc('kpi_cu', { title: 'KPIs Customer', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je KPI.', inputs: ['cu_monthly'],
  fn: (cu_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const defs = [["clv_eur", "Customer Lifetime Value (CLV)", "eur0", 1, 2400, 0], ["csi_score", "Customer Satisfaction Index (CSI)", "idx", 1, 82.0, 0], ["tco_eur", "Total Cost of Ownership (TCO)", "eur0", 0, 1450, 0], ["nps_score", "Net Promoter Score (NPS)", "idx", 1, 38.0, 0], ["churn_pct", "Abwanderungsquote", "pct", 0, 9.0, 0], ["repeat_pct", "Wiederkaufrate", "pct", 1, 72.0, 0], ["active_customers", "Aktive Kunden (Tsd.)", "int", 1, 1500, 1]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) for (const [dim, member] of SC) {
    const rows = cu_monthly.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi];
        const target = typeof t === 'string' ? a[t] : cnt ? t * SH[region] * MS[member] : t, pp = unit === 'pct';
        const ok = target == null ? null : hib ? value >= target : value <= target;
        out.push({ region, dim, member, month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('ins_cu', { title: 'Summary Customer', description: 'Kurzfazit und Handlungsempfehlung je Grafik, Region und Monat.', inputs: ['cu_monthly', 'cu_segment'],
  fn: (cu_monthly, cu_segment) => {
  const ALL = cu_monthly, DET = cu_segment;
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', int: (v) => nf(v, 0), days: (v) => nf(v, 1) + ' Tage',
    eur: (v) => nf(v, 2) + ' €', eur0: (v) => nf(v, 0) + ' €', score: (v) => nf(v, 2), idx: (v) => nf(v, 1), n1: (v) => nf(v, 1) };
  const T = [{"id": "cu_0", "y": "clv_eur", "unit": "eur0", "target": 2400, "hib": 1, "cnt": 0, "lab": "CLV", "ok": "CLV über Ziel – Bindungsprogramme für Top-Segmente (Flotten, Händler) weiter ausbauen.", "miss": "CLV unter Ziel: Servicepakete, Wartungsverträge und Cross-Selling für Bestandskunden verstärken; Abwanderung in schwachen Segmenten reduzieren."}, {"id": "cu_1", "y": "csi_score", "unit": "idx", "target": 82.0, "hib": 1, "cnt": 0, "lab": "CSI", "ok": "Zufriedenheit auf Zielniveau – Feedback-Schleife und Servicequalität beibehalten.", "miss": "CSI unter Ziel: Beschwerdeursachen (Lieferzeit, Verfügbarkeit, Beratung) auswerten und Händler-Coaching ansetzen."}, {"id": "cu_2", "y": "tco_eur", "unit": "eur0", "target": 1450, "hib": 0, "cnt": 0, "lab": "TCO", "ok": "TCO im Zielkorridor – als Vertriebsargument gegenüber Wettbewerb und Flotten nutzen.", "miss": "TCO zu hoch: Wartungsintervalle, Teilepreise und Ausfallzeiten prüfen; Service-Flatrates und Teilepakete für Flotten anbieten."}];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) {
  for (const [dim, member] of SC) {
    const mon = ALL.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < mon.length; i++) {
      const month = mon[i].month;
      for (const s of T) {
        const v = mon[i][s.y], p = mon[i - 1][s.y], b3 = mon[Math.max(0, i - 3)][s.y];
        const t = typeof s.target === 'string' ? mon[i][s.target] : s.target * (s.cnt ? SH[region] * MS[member] : 1);
        const ok = s.hib ? v >= t : v <= t, better = s.hib ? v >= b3 : v <= b3;
        const d = (v / p - 1) * 100, sign = d >= 0 ? '+' : '−';
        const summary = s.lab + ': ' + F[s.unit](v) + ' (' + sign + nf(Math.abs(d), 1) + ' % ggü. Vormonat), Ziel ' + F[s.unit](t) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.';
        const rec = ok ? (better ? s.ok : 'Trend dreht – frühzeitig gegensteuern. ' + s.ok) : (better ? s.miss + ' Trend verbessert sich – Maßnahmen fortführen.' : 'Handlungsbedarf: ' + s.miss);
        out.push({ id: s.id, region, dim, member, month, ok, summary, rec });
      }
    }
  }
    const det = false ? DET.filter((r) => region === 'Alle' || r.region === region) : DET.filter((r) => r.region === region);
    const D = {"id": "cu_d", "cat": "segment", "val": "csi_score", "unit": "idx", "limit": 82.0, "hib": 1, "cmp": null, "lab": "CSI je Kundensegment", "ok": "Alle Segmente erreichen das CSI-Ziel – Best Practices des besten Segments übertragen.", "miss": "Segmente unter CSI-Ziel gezielt mit Servicemaßnahmen und festen Ansprechpartnern betreuen; Online- und Privatkunden zuerst."};
    const sorted = det.slice().sort((a, b) => b[D.val] - a[D.val]);
    const hi = sorted[0], lo = sorted[sorted.length - 1];
    let summary, rec, ok = true;
    if (D.cmp) {
      const gap = det.filter((r) => r[D.val] < r[D.cmp]);
      ok = gap.length === 0;
      const w = det.slice().sort((a, b) => (a[D.val] - a[D.cmp]) - (b[D.val] - b[D.cmp]))[0];
      summary = D.lab + ': ' + gap.length + ' von ' + det.length + ' unter Plan' + (ok ? '' : '; größte Lücke ' + w[D.cat] + ' (' + F[D.unit](w[D.val] - w[D.cmp]) + ')') + '.';
    } else if (D.limit != null) {
      const bad = det.filter((r) => (D.hib ? r[D.val] < D.limit : r[D.val] > D.limit));
      ok = bad.length === 0;
      const w = det.slice().sort((a, b) => (D.hib ? a[D.val] - b[D.val] : b[D.val] - a[D.val]))[0];
      summary = D.lab + ': ' + bad.length + ' von ' + det.length + ' ' + (D.hib ? 'unter' : 'über') + ' dem Grenzwert ' + F[D.unit](D.limit) + (ok ? '' : '; kritischster Wert ' + w[D.cat] + ' (' + F[D.unit](w[D.val]) + ')') + '.';
    } else {
      const tot = det.reduce((a, r) => a + r[D.val], 0);
      summary = D.lab + ': größter Posten ' + hi[D.cat] + ' (' + F[D.unit](hi[D.val]) + ', ' + nf(hi[D.val] / tot * 100, 0) + ' % des Gesamtwerts), kleinster ' + lo[D.cat] + ' (' + F[D.unit](lo[D.val]) + ').';
    }
    rec = ok ? D.ok : D.miss;
    out.push({ id: D.id, region, dim: 'Alle', member: 'Alle', month: 'all', ok, summary, rec });
  }
  return out;
} });
dash.calc('kpi_co', { title: 'KPIs Competitor', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je KPI.', inputs: ['co_monthly'],
  fn: (co_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const defs = [["rel_share_idx", "Relativer Marktanteil", "score", 1, 0.95, 0], ["price_gap_pct", "Preisabstand zum Wettbewerb", "pct", 0, 2.0, 0], ["avail_gap_pts", "Verfügbarkeitsvorsprung (Pkt.)", "pct", 1, 0.5, 0], ["win_rate_pct", "Win-Rate", "pct", 1, 48.0, 0], ["loss_price_pct", "Verlustgrund Preis", "pct", 0, 40.0, 0], ["online_share_pct", "Online-Anteil im Markt", "pct", null, null, 0], ["competitor_promos", "Wettbewerber-Aktionen", "int", null, null, 0]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) for (const [dim, member] of SC) {
    const rows = co_monthly.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi];
        const target = typeof t === 'string' ? a[t] : cnt ? t * SH[region] * MS[member] : t, pp = unit === 'pct';
        const ok = target == null ? null : hib ? value >= target : value <= target;
        out.push({ region, dim, member, month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('ins_co', { title: 'Summary Competitor', description: 'Kurzfazit und Handlungsempfehlung je Grafik, Region und Monat.', inputs: ['co_monthly', 'co_competitor'],
  fn: (co_monthly, co_competitor) => {
  const ALL = co_monthly, DET = co_competitor;
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', int: (v) => nf(v, 0), days: (v) => nf(v, 1) + ' Tage',
    eur: (v) => nf(v, 2) + ' €', eur0: (v) => nf(v, 0) + ' €', score: (v) => nf(v, 2), idx: (v) => nf(v, 1), n1: (v) => nf(v, 1) };
  const T = [{"id": "co_0", "y": "rel_share_idx", "unit": "score", "target": 0.95, "hib": 1, "cnt": 0, "lab": "Relativer Marktanteil", "ok": "Position gegenüber dem stärksten Wettbewerber gefestigt – Anteilsgewinne in schwächeren Regionen ausbauen.", "miss": "Abstand zum Wettbewerb schließen: Sortiment, Verfügbarkeit und Aktionen in Regionen mit Rückstand gezielt stärken."}, {"id": "co_1", "y": "price_gap_pct", "unit": "pct", "target": 2.0, "hib": 0, "cnt": 0, "lab": "Preisabstand", "ok": "Preisabstand im Rahmen – Preisspielräume bei margenstarken Teilen prüfen.", "miss": "Preisabstand zu hoch: Preise bei vergleichsintensiven Artikeln anpassen und Wertargumente (Qualität, Verfügbarkeit) kommunizieren."}];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) {
  for (const [dim, member] of SC) {
    const mon = ALL.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < mon.length; i++) {
      const month = mon[i].month;
      for (const s of T) {
        const v = mon[i][s.y], p = mon[i - 1][s.y], b3 = mon[Math.max(0, i - 3)][s.y];
        const t = typeof s.target === 'string' ? mon[i][s.target] : s.target * (s.cnt ? SH[region] * MS[member] : 1);
        const ok = s.hib ? v >= t : v <= t, better = s.hib ? v >= b3 : v <= b3;
        const d = (v / p - 1) * 100, sign = d >= 0 ? '+' : '−';
        const summary = s.lab + ': ' + F[s.unit](v) + ' (' + sign + nf(Math.abs(d), 1) + ' % ggü. Vormonat), Ziel ' + F[s.unit](t) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.';
        const rec = ok ? (better ? s.ok : 'Trend dreht – frühzeitig gegensteuern. ' + s.ok) : (better ? s.miss + ' Trend verbessert sich – Maßnahmen fortführen.' : 'Handlungsbedarf: ' + s.miss);
        out.push({ id: s.id, region, dim, member, month, ok, summary, rec });
      }
    }
  }
    const det = false ? DET.filter((r) => region === 'Alle' || r.region === region) : DET.filter((r) => r.region === region);
    const D = {"id": "co_d", "cat": "competitor", "val": "threat_score", "unit": "score", "limit": 3.5, "hib": 0, "cmp": null, "lab": "Bedrohung je Wettbewerbergruppe", "ok": "Keine Wettbewerbergruppe über dem Grenzwert – Beobachtung fortführen.", "miss": "Wettbewerbergruppen über dem Grenzwert (z. B. Online-Plattformen, freie Werkstattketten) mit Preis-, Verfügbarkeits- und Servicemaßnahmen kontern."};
    const sorted = det.slice().sort((a, b) => b[D.val] - a[D.val]);
    const hi = sorted[0], lo = sorted[sorted.length - 1];
    let summary, rec, ok = true;
    if (D.cmp) {
      const gap = det.filter((r) => r[D.val] < r[D.cmp]);
      ok = gap.length === 0;
      const w = det.slice().sort((a, b) => (a[D.val] - a[D.cmp]) - (b[D.val] - b[D.cmp]))[0];
      summary = D.lab + ': ' + gap.length + ' von ' + det.length + ' unter Plan' + (ok ? '' : '; größte Lücke ' + w[D.cat] + ' (' + F[D.unit](w[D.val] - w[D.cmp]) + ')') + '.';
    } else if (D.limit != null) {
      const bad = det.filter((r) => (D.hib ? r[D.val] < D.limit : r[D.val] > D.limit));
      ok = bad.length === 0;
      const w = det.slice().sort((a, b) => (D.hib ? a[D.val] - b[D.val] : b[D.val] - a[D.val]))[0];
      summary = D.lab + ': ' + bad.length + ' von ' + det.length + ' ' + (D.hib ? 'unter' : 'über') + ' dem Grenzwert ' + F[D.unit](D.limit) + (ok ? '' : '; kritischster Wert ' + w[D.cat] + ' (' + F[D.unit](w[D.val]) + ')') + '.';
    } else {
      const tot = det.reduce((a, r) => a + r[D.val], 0);
      summary = D.lab + ': größter Posten ' + hi[D.cat] + ' (' + F[D.unit](hi[D.val]) + ', ' + nf(hi[D.val] / tot * 100, 0) + ' % des Gesamtwerts), kleinster ' + lo[D.cat] + ' (' + F[D.unit](lo[D.val]) + ').';
    }
    rec = ok ? D.ok : D.miss;
    out.push({ id: D.id, region, dim: 'Alle', member: 'Alle', month: 'all', ok, summary, rec });
  }
  return out;
} });
dash.calc('kpi_mt', { title: 'KPIs Marketing', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je KPI.', inputs: ['mt_monthly'],
  fn: (mt_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const defs = [["marketing_roi", "Marketing-ROI (ROMI)", "pct", 1, 300.0, 0], ["cac_eur", "Kundengewinnungskosten (CAC)", "eur0", 0, 85, 0], ["conv_pct", "Lead-Conversion", "pct", 1, 12.0, 0], ["leads", "Leads", "int", 1, 15000, 1], ["budget_k", "Marketingausgaben", "eur_k", 0, "budget_plan_k", 0], ["reach_k", "Reichweite (Tsd. Kontakte)", "int", 1, 5800, 1], ["online_pct", "Online-Anteil Bestellungen", "pct", 1, 28.0, 0]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) for (const [dim, member] of SC) {
    const rows = mt_monthly.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi];
        const target = typeof t === 'string' ? a[t] : cnt ? t * SH[region] * MS[member] : t, pp = unit === 'pct';
        const ok = target == null ? null : hib ? value >= target : value <= target;
        out.push({ region, dim, member, month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('ins_mt', { title: 'Summary Marketing', description: 'Kurzfazit und Handlungsempfehlung je Grafik, Region und Monat.', inputs: ['mt_monthly', 'mt_channel'],
  fn: (mt_monthly, mt_channel) => {
  const ALL = mt_monthly, DET = mt_channel;
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', int: (v) => nf(v, 0), days: (v) => nf(v, 1) + ' Tage',
    eur: (v) => nf(v, 2) + ' €', eur0: (v) => nf(v, 0) + ' €', score: (v) => nf(v, 2), idx: (v) => nf(v, 1), n1: (v) => nf(v, 1) };
  const T = [{"id": "mt_0", "y": "marketing_roi", "unit": "pct", "target": 300.0, "hib": 1, "cnt": 0, "lab": "Marketing-ROI", "ok": "ROMI auf Zielniveau – Budget zu den ertragsstärksten Kanälen verschieben.", "miss": "ROMI unter Ziel: Kanäle mit schwachem Ertrag pausieren, Budget auf Newsletter und Händlerportal verlagern und Zielgruppen schärfen."}, {"id": "mt_1", "y": "leads", "unit": "int", "target": 15000, "hib": 1, "cnt": 1, "lab": "Leads", "ok": "Lead-Volumen im Ziel – Conversion im Vertrieb weiter verbessern.", "miss": "Lead-Ziel verfehlt: Aktionskalender und Kanalmix prüfen, Online-Anteil erhöhen und Händlerkampagnen vorziehen."}];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) {
  for (const [dim, member] of SC) {
    const mon = ALL.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < mon.length; i++) {
      const month = mon[i].month;
      for (const s of T) {
        const v = mon[i][s.y], p = mon[i - 1][s.y], b3 = mon[Math.max(0, i - 3)][s.y];
        const t = typeof s.target === 'string' ? mon[i][s.target] : s.target * (s.cnt ? SH[region] * MS[member] : 1);
        const ok = s.hib ? v >= t : v <= t, better = s.hib ? v >= b3 : v <= b3;
        const d = (v / p - 1) * 100, sign = d >= 0 ? '+' : '−';
        const summary = s.lab + ': ' + F[s.unit](v) + ' (' + sign + nf(Math.abs(d), 1) + ' % ggü. Vormonat), Ziel ' + F[s.unit](t) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.';
        const rec = ok ? (better ? s.ok : 'Trend dreht – frühzeitig gegensteuern. ' + s.ok) : (better ? s.miss + ' Trend verbessert sich – Maßnahmen fortführen.' : 'Handlungsbedarf: ' + s.miss);
        out.push({ id: s.id, region, dim, member, month, ok, summary, rec });
      }
    }
  }
    const det = false ? DET.filter((r) => region === 'Alle' || r.region === region) : DET.filter((r) => r.region === region);
    const D = {"id": "mt_d", "cat": "channel", "val": "romi_pct", "unit": "pct", "limit": 200.0, "hib": 1, "cmp": null, "lab": "ROMI je Kanal", "ok": "Alle Kanäle über Mindest-ROMI – Budgets zugunsten der besten Kanäle umschichten.", "miss": "Kanäle unter Mindest-ROMI (z. B. Social Media, Messen) überarbeiten oder Budget zu Newsletter, Händlerportal und Werkstatt-Kooperationen verlagern."};
    const sorted = det.slice().sort((a, b) => b[D.val] - a[D.val]);
    const hi = sorted[0], lo = sorted[sorted.length - 1];
    let summary, rec, ok = true;
    if (D.cmp) {
      const gap = det.filter((r) => r[D.val] < r[D.cmp]);
      ok = gap.length === 0;
      const w = det.slice().sort((a, b) => (a[D.val] - a[D.cmp]) - (b[D.val] - b[D.cmp]))[0];
      summary = D.lab + ': ' + gap.length + ' von ' + det.length + ' unter Plan' + (ok ? '' : '; größte Lücke ' + w[D.cat] + ' (' + F[D.unit](w[D.val] - w[D.cmp]) + ')') + '.';
    } else if (D.limit != null) {
      const bad = det.filter((r) => (D.hib ? r[D.val] < D.limit : r[D.val] > D.limit));
      ok = bad.length === 0;
      const w = det.slice().sort((a, b) => (D.hib ? a[D.val] - b[D.val] : b[D.val] - a[D.val]))[0];
      summary = D.lab + ': ' + bad.length + ' von ' + det.length + ' ' + (D.hib ? 'unter' : 'über') + ' dem Grenzwert ' + F[D.unit](D.limit) + (ok ? '' : '; kritischster Wert ' + w[D.cat] + ' (' + F[D.unit](w[D.val]) + ')') + '.';
    } else {
      const tot = det.reduce((a, r) => a + r[D.val], 0);
      summary = D.lab + ': größter Posten ' + hi[D.cat] + ' (' + F[D.unit](hi[D.val]) + ', ' + nf(hi[D.val] / tot * 100, 0) + ' % des Gesamtwerts), kleinster ' + lo[D.cat] + ' (' + F[D.unit](lo[D.val]) + ').';
    }
    rec = ok ? D.ok : D.miss;
    out.push({ id: D.id, region, dim: 'Alle', member: 'Alle', month: 'all', ok, summary, rec });
  }
  return out;
} });
dash.calc('head_kpis', { title: 'Kern-KPIs aller Bereiche', description: 'Drei Kern-KPIs je Businessunit, Region und Monat mit Vormonat, Ziel und Status.', inputs: ["mo_monthly", "pm_monthly", "pr_monthly", "lg_monthly", "tr_monthly", "wa_monthly", "cu_monthly", "co_monthly", "mt_monthly"],
  fn: (mo_monthly, pm_monthly, pr_monthly, lg_monthly, tr_monthly, wa_monthly, cu_monthly, co_monthly, mt_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const spec = [
    ["mo", "Market Operation", mo_monthly, [["revenue_k", "Umsatz", "eur_k", 1, "target_k", 0], ["yoy_pct", "Wachstum ggü. Vorjahr", "pct", 1, 5.0, 0], ["orders", "Aufträge", "int", 1, 9000, 1]]],
    ["pm", "Productmanagement", pm_monthly, [["gross_margin_pct", "Rohertragsmarge", "pct", 1, 38.0, 0], ["coverage_pct", "Fahrzeugabdeckung", "pct", 1, 92.0, 0], ["obsolete_share_pct", "Ladenhüter-Anteil", "pct", 0, 4.0, 0]]],
    ["pr", "Pricing", pr_monthly, [["realization_pct", "Preisdurchsetzung", "pct", 1, 97.0, 0], ["margin_pct", "Rohertragsmarge", "pct", 1, 36.0, 0], ["discount_pct", "Rabattquote", "pct", 0, 12.0, 0]]],
    ["lg", "Logistik", lg_monthly, [["otif_pct", "OTIF (On-Time-In-Full)", "pct", 1, 95.0, 0], ["fill_rate_pct", "Lieferbereitschaft", "pct", 1, 97.0, 0], ["backorder_pct", "Rückstandsquote", "pct", 0, 3.0, 0]]],
    ["tr", "Training", tr_monthly, [["certified_pct", "Zertifizierungsgrad", "pct", 1, 85.0, 0], ["satisfaction", "Teilnehmerzufriedenheit", "score", 1, 4.5, 0], ["completion_pct", "Abschlussquote", "pct", 1, 90.0, 0]]],
    ["wa", "Warranty", wa_monthly, [["claim_rate_pct", "Reklamationsquote", "pct", 0, 1.2, 0], ["processing_days", "Bearbeitungsdauer", "days", 0, 5.0, 0], ["recovery_pct", "Lieferantenregress", "pct", 1, 60.0, 0]]],
    ["cu", "Customer", cu_monthly, [["clv_eur", "Customer Lifetime Value (CLV)", "eur0", 1, 2400, 0], ["csi_score", "Customer Satisfaction Index (CSI)", "idx", 1, 82.0, 0], ["tco_eur", "Total Cost of Ownership (TCO)", "eur0", 0, 1450, 0]]],
    ["co", "Competitor", co_monthly, [["rel_share_idx", "Relativer Marktanteil", "score", 1, 0.95, 0], ["price_gap_pct", "Preisabstand zum Wettbewerb", "pct", 0, 2.0, 0], ["win_rate_pct", "Win-Rate", "pct", 1, 48.0, 0]]],
    ["mt", "Marketing", mt_monthly, [["marketing_roi", "Marketing-ROI (ROMI)", "pct", 1, 300.0, 0], ["cac_eur", "Kundengewinnungskosten (CAC)", "eur0", 0, 85, 0], ["conv_pct", "Lead-Conversion", "pct", 1, 12.0, 0]]]
  ];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) for (const [dim, member] of SC) for (const [bu, bu_label, all, defs] of spec) {
    const rows = all.filter((r) => r.region === region && r.dim === dim && r.member === member);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi];
        const target = typeof t === 'string' ? a[t] : cnt ? t * SH[region] * MS[member] : t, pp = unit === 'pct';
        const ok = target == null ? null : hib ? value >= target : value <= target;
        out.push(Object.assign({ id: [region, dim, member, month, bu, kpi].join('|'), bu, bu_label }, { region, dim, member, month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' }));
      }
    }
  }
  return out;
} });
dash.calc('head_bu', { title: 'Zielerreichung je Bereich', description: 'Anteil der Kern-KPIs je Bereich, Region und Monat, die ihr Ziel erreichen.', inputs: ['head_kpis'],
  fn: (head_kpis) => {
  const m = new Map();
  for (const r of head_kpis) {
    const key = [r.region, r.dim, r.member, r.month, r.bu].join('|');
    const g = m.get(key) || { region: r.region, dim: r.dim, member: r.member, month: r.month, bu: r.bu, bu_label: r.bu_label, total: 0, ok_n: 0 };
    g.total += 1; if (r.ok) g.ok_n += 1; m.set(key, g);
  }
  return [...m.values()].map((g) => ({ ...g, ok_pct: Math.round(g.ok_n / g.total * 100) }));
} });
dash.calc('head_summary', { title: 'KPIs unter Ziel', description: 'Anzahl Kern-KPIs unter Ziel und insgesamt je Region und Monat.', inputs: ['head_kpis'],
  fn: (head_kpis) => {
  const m = new Map();
  for (const r of head_kpis) {
    const key = [r.region, r.dim, r.member, r.month].join('|'), g = m.get(key) || { region: r.region, dim: r.dim, member: r.member, month: r.month, off: 0, total: 0 };
    g.total += 1; if (r.ok === false) g.off += 1; m.set(key, g);
  }
  return [...m.values()];
} });
dash.calc('ins_head', { title: 'Summary Head of', description: 'Kurzfazit und Handlungsempfehlung für die Übersicht je Region und Monat.', inputs: ['head_bu', 'mo_monthly'],
  fn: (head_bu, mo_monthly) => {
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', int: (v) => nf(v, 0), days: (v) => nf(v, 1) + ' Tage',
    eur: (v) => nf(v, 2) + ' €', eur0: (v) => nf(v, 0) + ' €', score: (v) => nf(v, 2), idx: (v) => nf(v, 1), n1: (v) => nf(v, 1) };
  const SC = [["Alle", "Alle"], ["Baumuster", "A0 Basis"], ["Baumuster", "K1 Benzin"], ["Baumuster", "K1 Diesel"], ["Baumuster", "L2 Diesel"], ["Baumuster", "C4 Diesel"], ["Baumuster", "O3 Hybrid"], ["Baumuster", "S3 Benzin"], ["Baumuster", "S3 Diesel"], ["Baumuster", "S4 Hybrid"], ["Baumuster", "T5 Diesel"], ["Baumuster", "E6 Elektro"], ["Baumuster", "E7 Elektro"], ["Alter", "0-2 J"], ["Alter", "3-5 J"], ["Alter", "6-8 J"], ["Alter", "9-12 J"], ["Alter", "13+ J"], ["Produktgruppe", "Bremse"], ["Produktgruppe", "Filter"], ["Produktgruppe", "Reifen & Räder"], ["Produktgruppe", "Zündung & Glühen"], ["Produktgruppe", "Batterie & Starter"], ["Produktgruppe", "Fahrwerk & Stoßdämpfer"], ["Produktgruppe", "Auspuff & Abgas"], ["Produktgruppe", "Klima & Kühlung"], ["Produktgruppe", "Öle & Flüssigkeiten"], ["Produktgruppe", "Wischer & Sicht"], ["Produktgruppe", "Beleuchtung"], ["Produktgruppe", "Elektrik & Sensorik"], ["Produktgruppe", "Antrieb & Getriebe"], ["Produktgruppe", "Kupplung"], ["Produktgruppe", "Lenkung"], ["Produktgruppe", "Karosserie & Anbau"], ["Produktgruppe", "Riemen & Steuerung"], ["Produktgruppe", "Dichtungen & Motorteile"], ["Produktgruppe", "Zubehör & Pflege"], ["Produktgruppe", "Innenraum & Komfort"]], MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};
  const out = [];
  const HB = new Map(); for (const x of head_bu) { const k = [x.region, x.dim, x.member, x.month].join('|'); if (!HB.has(k)) HB.set(k, []); HB.get(k).push(x); }
  const months = [...new Set(head_bu.map((g) => g.month))];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) for (const [dim, member] of SC) {
  for (const month of months) {
    const g = HB.get([region, dim, member, month].join('|')) || [];
    const low = g.filter((x) => x.ok_pct < 50), full = g.filter((x) => x.ok_pct === 100);
    const summary = full.length + ' von ' + g.length + ' Bereichen erreichen alle Kern-KPIs' + (low.length ? '; unter 50 % Zielerreichung: ' + low.map((x) => x.bu_label).join(', ') : '; kein Bereich unter 50 %') + '.';
    const rec = low.length ? 'Fokus-Review mit ' + low.map((x) => x.bu_label).join(' und ') + ': Ursachen klären und Maßnahmenplan innerhalb von zwei Wochen vereinbaren.' : 'Kein kritischer Bereich – Fokus auf Wachstum und Effizienz, Bereiche mit offenen KPIs im Monatsreview nachfassen.';
    out.push({ id: 'head_bu', region, dim, member, month, ok: low.length === 0, summary, rec });
  }
  const mo = mo_monthly.filter((r) => r.region === region && r.dim === dim && r.member === member);
  for (let i = 1; i < mo.length; i++) {
    const a = mo[i], p = mo[i - 1], b3 = mo[Math.max(0, i - 3)];
    const ok = a.revenue_k >= a.target_k, better = a.revenue_k >= b3.revenue_k, d = (a.revenue_k / p.revenue_k - 1) * 100;
    out.push({ id: 'head_rev', region, dim, member, month: a.month, ok,
      summary: 'Umsatz ' + F.eur_k(a.revenue_k) + ' (' + (d >= 0 ? '+' : '−') + nf(Math.abs(d), 1) + ' % ggü. Vormonat), Ziel ' + F.eur_k(a.target_k) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.',
      rec: ok ? 'Momentum nutzen: Wachstumsinitiativen in den stärksten Regionen ausbauen.' : 'Lücke zum Ziel in der Market Operation priorisieren: Länder unter Plan, Händlerreaktivierung und Aktionen im Folgemonat.' });
  }
  }
  return out;
} });
dash.calc('net_attain', { title: 'Zielerreichung je Standort', description: 'Umsatz in % vom Monatsziel je Niederlassung und Monat.', inputs: ['branch_monthly'],
  fn: (branch_monthly) => branch_monthly.map((r) => ({ id: r.id, month: r.month, attain_pct: Math.round(r.revenue_k / r.target_k * 1000) / 10, miss: r.revenue_k < r.target_k })) });
dash.calc('net_kpis', { title: 'Netz-KPIs je Region/Land', description: 'Summe bzw. Durchschnitt der Niederlassungen je Region, Land (und gesamt) und Monat.', inputs: ['branch_monthly', 'branches'],
  fn: (branch_monthly, branches) => {
  const reg = new Map(branches.map((b) => [b.id, b]));
  const by = new Map();
  const add = (scope, r) => {
    const key = scope + '|' + r.month;
    const g = by.get(key) || { scope, month: r.month, rev: 0, tgt: 0, plan: 0, otif: 0, claim: 0, n: 0 };
    g.rev += r.revenue_k; g.tgt += r.target_k; g.plan += r.revenue_k >= r.target_k ? 1 : 0;
    g.otif += r.otif_pct; g.claim += r.claim_rate_pct; g.n += 1; by.set(key, g);
  };
  for (const r of branch_monthly) { const b = reg.get(r.id); add('Alle', r); add(b.region, r); add(b.country, r); }
  const groups = new Map();
  for (const g of by.values()) {
    if (!groups.has(g.scope)) groups.set(g.scope, []);
    groups.get(g.scope).push({ month: g.month, revenue_m: g.rev / 1000, target_m: g.tgt / 1000, in_plan: g.plan, plan_target: Math.round(g.n * 0.85),
      otif_pct: g.otif / g.n, claim_rate_pct: g.claim / g.n });
  }
  const defs = [['revenue_m', 'Netzumsatz', 'eur_m', 1, 'target_m'], ['in_plan', 'Standorte im Plan', 'int', 1, 'plan_target'],
    ['otif_pct', 'Ø OTIF', 'pct', 1, 95], ['claim_rate_pct', 'Ø Reklamationsquote', 'pct2', 0, 1.2]];
  const out = [];
  for (const [scope, list] of groups) {
    list.sort((a, b) => (a.month < b.month ? -1 : 1));
    for (let i = 1; i < list.length; i++) {
      const a = list[i], b = list[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t] of defs) {
        const value = a[kpi], prev = b[kpi];
        const target = typeof t === 'string' ? a[t] : t, pp = unit === 'pct';
        const ok = hib ? value >= target : value <= target;
        out.push({ scope, month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('ins_net', { title: 'Summary Netz', description: 'Kurzfazit und Handlungsempfehlung für das Niederlassungsnetz je Monat.', inputs: ['branch_monthly', 'branches'],
  fn: (branch_monthly, branches) => {
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const info = new Map(branches.map((b) => [b.id, b]));
  const months = [...new Set(branch_monthly.map((r) => r.month))].slice(1);
  const scopes = [['Alle', 0], ...[...new Set(branches.map((b) => b.region))].map((n) => [n, 1]), ...[...new Set(branches.map((b) => b.country))].map((n) => [n, 2])];
  const out = [];
  for (const [scope, level] of scopes) {
    for (const month of months) {
      const rows = branch_monthly.filter((r) => r.month === month && (level === 0 || (level === 1 ? info.get(r.id).region : info.get(r.id).country) === scope));
      const ranked = rows.map((r) => ({ city: info.get(r.id).city, a: r.revenue_k / r.target_k * 100 })).sort((x, y) => x.a - y.a);
      const below = ranked.filter((x) => x.a < 100).length, worst = ranked.slice(0, Math.min(3, ranked.length)), best = ranked.slice(-Math.min(3, ranked.length)).reverse();
      let part = '', lead = '';
      if (level < 2) {
        const grp = new Map();
        for (const r of rows) {
          const b = info.get(r.id), n = level === 0 ? b.region : b.country, g = grp.get(n) || { name: n, rev: 0, tgt: 0 };
          g.rev += r.revenue_k; g.tgt += r.target_k; grp.set(n, g);
        }
        const w = [...grp.values()].map((g) => ({ name: g.name, a: g.rev / g.tgt * 100 })).sort((x, y) => x.a - y.a)[0];
        part = '; schwächste' + (level === 0 ? ' Region ' : 's Land ') + w.name + ' (' + nf(w.a, 1) + ' % Zielerreichung)';
        lead = w.a < 100 ? 'Task Force für ' + w.name + ' aufsetzen, ' : (level === 0 ? 'Alle Regionen' : 'Alle Länder') + ' im Plan – Einzelmaßnahmen für die schwächsten Standorte definieren, ';
      } else {
        lead = ranked[0].a < 95 ? 'Maßnahmenplan für ' + worst[0].city + ' aufsetzen, ' : 'Alle Standorte nahe am Plan – Fokus auf Stabilität, ';
      }
      out.push({ id: 'net', scope, month, ok: below < rows.length * 0.15,
        summary: below + ' von ' + rows.length + ' Niederlassungen unter Monatsziel' + part + '; schwächste Standorte: '
          + worst.map((x) => x.city + ' (' + nf(x.a, 1) + ' %)').join(', ') + '.',
        rec: lead + 'Peer-Learning mit den stärksten Standorten (' + best.map((x) => x.city).join(', ') + ') organisieren und Standorte unter 95 % Zielerreichung monatlich im Review nachfassen.' });
    }
  }
  return out;
} });
dash.calc('ws_cube', { title: 'Werkstatt-KPIs Segment × Alter', description: 'Retention, Penetration, Throughput und Aufträge je Fahrzeugsegment, Baureihe, Altersklasse (und gesamt) und Monat; Ziele je Altersklasse.', inputs: ['ws_segments'],
  fn: (ws_segments) => {
  const RT = { '0-2 J': 90, '3-5 J': 75, '6-8 J': 58, '9-12 J': 40, '13+ J': 25 };
  const segOf = new Map(ws_segments.map((r) => [r.series, r.segment]));
  const segs = [...new Set(ws_segments.map((r) => r.segment))], sers = [...new Set(ws_segments.map((r) => r.series))];
  const scopes = [['Alle', 'Alle', 0], ...segs.map((s) => [s, s, 1]), ...sers.map((s) => [s, segOf.get(s), 2])];
  const ages = ['Alle', ...new Set(ws_segments.map((r) => r.age))];
  const months = [...new Set(ws_segments.map((r) => r.month))].sort();
  const byMonth = new Map(months.map((m) => [m, ws_segments.filter((r) => r.month === m)]));
  const defs = [['retention_pct', 'Retention', 'pct', 1], ['pen_total', 'Penetration Gesamt', 'eur_k', 1], ['pen_lohn', 'Penetration Lohn', 'eur_k', 1], ['pen_teile', 'Penetration Teile', 'eur_k', 1],
    ['throughput', 'Throughput', 'thr', 1], ['orders', 'Werkstattaufträge', 'int', null]];
  const out = [];
  for (const [series, segment, level] of scopes) for (const age of ages) {
    const list = months.map((month) => {
      const rows = byMonth.get(month).filter((r) => (level === 0 || (level === 1 ? r.segment === series : r.series === series)) && (age === 'Alle' || r.age === age));
      const veh = rows.reduce((a, r) => a + r.vehicles_k, 0), orders = rows.reduce((a, r) => a + r.orders, 0), bay = rows.reduce((a, r) => a + r.bay_days, 0);
      const w = (f) => rows.reduce((a, r) => a + f(r) * r.vehicles_k, 0) / veh;
      const sum = (f) => rows.reduce((a, r) => a + r[f], 0), lohn = sum('lohn_k'), teile = sum('teile_k'), lt = sum('lohn_target_k'), tt = sum('teile_target_k');
      return { month, retention_pct: w((r) => r.retention_pct), pen_lohn: lohn, pen_teile: teile, pen_total: lohn + teile, throughput: orders / bay, orders,
        retention_t: w((r) => RT[r.age]), pen_lohn_t: lt, pen_teile_t: tt, pen_total_t: lt + tt };
    });
    for (let i = 1; i < list.length; i++) {
      const a = list[i], b = list[i - 1];
      for (const [kpi, label, unit, hib] of defs) {
        const value = a[kpi], prev = b[kpi], pp = unit === 'pct';
        const target = kpi === 'retention_pct' ? a.retention_t : kpi === 'throughput' ? 2.4 : kpi.startsWith('pen_') ? a[kpi + '_t'] : null;
        const ok = target == null ? null : value >= target;
        out.push({ series, segment, level, age, month: a.month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('ins_ws', { title: 'Summary Workshop', description: 'Kurzfazit und Handlungsempfehlung je Grafik, Kennzahl und Auswahl.', inputs: ['ws_cube'],
  fn: (ws_cube) => {
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { pct: (v) => nf(v, 1) + ' %', thr: (v) => nf(v, 2) + ' Auf./Tag', eur_k: (v) => nf(v, 0) + ' k€' };
  const idx = new Map(ws_cube.map((r) => [r.series + '|' + r.age + '|' + r.month + '|' + r.kpi, r]));
  const leafs = [...new Map(ws_cube.filter((r) => r.level === 2).map((r) => [r.series, r.segment])).entries()];
  const segs = ['Alle', ...new Set(leafs.map(([s, g]) => g))];
  const scopes = ['Alle', ...segs.slice(1), ...leafs.map(([s]) => s)];
  const ages = [...new Set(ws_cube.map((r) => r.age))].filter((x) => x !== 'Alle');
  const months = [...new Set(ws_cube.map((r) => r.month))].sort();
  const KP = {
    retention_pct: { lab: 'Retention', ok: 'Bindung halten und Bindungsprogramme auf die nächste Altersstufe ausweiten.',
      miss: 'Rückholprogramm starten: Service-Erinnerungen, Wartungspakete und Mobilitätsgarantie nach Ablauf der Garantie.' },
    pen_total: { lab: 'Penetration Gesamt', ok: 'Werkstattumsatz halten und Zusatzverkäufe (Inspektionspakete, Verschleißteile) aktiv anbieten.',
      miss: 'Werkstattumsatz steigern: Festpreis-Wartung, Verschleißteil-Pakete und Online-Terminbuchung gezielt für ältere Fahrzeuge anbieten.' },
    pen_lohn: { lab: 'Penetration Lohn', ok: 'Lohnumsatz halten und Terminauslastung weiter optimieren.',
      miss: 'Lohnumsatz steigern: Arbeitswerte-Pakete, Terminauslastung und Zusatzarbeiten (Diagnose, Klimaservice) anbieten.' },
    pen_teile: { lab: 'Penetration Teile', ok: 'Teileumsatz halten und Verfügbarkeit wichtiger Verschleißteile absichern.',
      miss: 'Teileumsatz steigern: Teile-Verkaufsquote je Auftrag erhöhen (Verschleißteil-Pakete, Original-Teile) und Verfügbarkeit sichern.' },
    throughput: { lab: 'Throughput', ok: 'Durchsatz halten und Spitzenzeiten durch Terminsteuerung entzerren.',
      miss: 'Durchsatz steigern: Terminplanung glätten, Teileverfügbarkeit vor dem Termin sichern und Arbeitsplatz-Auslastung prüfen.' } };
  const gapOf = (r) => (r.unit === 'eur_k' ? r.value / r.target - 1 : r.value - r.target), name = (s) => (s === 'Alle' ? 'alle Baureihen' : s), aname = (a) => (a === 'Alle' ? 'alle Altersklassen' : a);
  const out = [];
  for (const kpi of Object.keys(KP)) {
    const K = KP[kpi], f = F[kpi === 'throughput' ? 'thr' : kpi.startsWith('pen_') ? 'eur_k' : 'pct'], d = kpi === 'throughput' ? 2 : kpi.startsWith('pen_') ? 0 : 1, pk = kpi === 'throughput' ? '' : kpi.startsWith('pen_') ? ' k€' : ' Pkt.';
    months.slice(1).forEach((month, mi) => {
      const at = (s, a) => idx.get(s + '|' + a + '|' + month + '|' + kpi);
      for (const seg of segs) {
        const L = leafs.filter(([s, g]) => seg === 'Alle' || g === seg).map(([s]) => s);
        const cells = L.flatMap((s) => ages.map((a) => at(s, a)));
        const bad = cells.filter((c) => !c.ok), sorted = cells.slice().sort((x, y) => gapOf(x) - gapOf(y)), w = sorted[0], b = sorted[sorted.length - 1];
        out.push({ id: 'heat', kpi, segment: seg, month, ok: bad.length === 0,
          summary: K.lab + (seg === 'Alle' ? '' : ' (' + seg + ')') + ': ' + bad.length + ' von ' + cells.length + ' Zellen unter Ziel; größte Lücke ' + w.series + ', ' + w.age + ' (' + f(w.value) + ' vs. Ziel ' + f(w.target) + '); stärkste Zelle ' + b.series + ', ' + b.age + ' (' + f(b.value) + ').',
          rec: bad.length ? K.miss + ' Priorität: ' + w.series + ', ' + w.age + '.' : K.ok });
        for (const a of ['Alle', ...ages]) {
          const rows = L.map((s) => at(s, a)).sort((x, y) => gapOf(x) - gapOf(y)), lo = rows[0], hi = rows[rows.length - 1], below = rows.filter((r) => !r.ok).length;
          out.push({ id: 'ser', kpi, age: a, segment: seg, month, ok: below === 0,
            summary: K.lab + ' (' + aname(a) + (seg === 'Alle' ? '' : ', ' + seg) + '): ' + below + ' von ' + rows.length + ' Baureihen unter Ziel; schwächste ' + lo.series + ' (' + f(lo.value) + ' vs. Ziel ' + f(lo.target) + '), stärkste ' + hi.series + ' (' + f(hi.value) + ').',
            rec: below ? K.miss + ' Start bei ' + lo.series + '.' : K.ok });
        }
      }
      for (const s of scopes) {
        const rows = ages.map((a) => at(s, a));
        let step = 0, from = 0;
        for (let i = 1; i < rows.length; i++) { const dd = rows[i - 1].value - rows[i].value; if (dd > step) { step = dd; from = i - 1; } }
        const below = rows.filter((r) => !r.ok).length;
        out.push({ id: 'age', kpi, series: s, month, ok: below === 0,
          summary: K.lab + ' (' + name(s) + '): von ' + rows[0].age + ' (' + f(rows[0].value) + ') bis ' + rows[rows.length - 1].age + ' (' + f(rows[rows.length - 1].value) + '); stärkster Rückgang zwischen ' + rows[from].age + ' und ' + rows[from + 1].age + ' (−' + nf(step, d) + pk + ').',
          rec: below ? K.miss + ' Besonders ab ' + rows[from + 1].age + '.' : K.ok });
        for (const a of ['Alle', ...ages]) {
          const r = at(s, a), p = idx.get(s + '|' + a + '|' + months[Math.max(0, mi - 2)] + '|' + kpi), better = r.value >= p.value;
          out.push({ id: 'trd', kpi, series: s, age: a, month, ok: r.ok,
            summary: K.lab + ' (' + name(s) + ', ' + aname(a) + '): ' + f(r.value) + ', Ziel ' + f(r.target) + (r.ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.',
            rec: r.ok ? (better ? K.ok : 'Trend dreht – frühzeitig gegensteuern. ' + K.ok) : (better ? K.miss + ' Trend verbessert sich – Maßnahmen fortführen.' : 'Handlungsbedarf: ' + K.miss) });
        }
      }
    });
  }
  return out;
} });
dash.calc('ws_grp', { title: 'Penetration nach Produktgruppe', description: 'Lohn-, Teile- und Gesamtumsatz mit Ziel je Produktgruppe, Fahrzeugsegment bzw. Baureihe (und gesamt) und Monat.', inputs: ['ws_groups'],
  fn: (ws_groups) => {
  const segOf = new Map(ws_groups.map((r) => [r.series, r.segment]));
  const segs = [...new Set(ws_groups.map((r) => r.segment))], sers = [...new Set(ws_groups.map((r) => r.series))];
  const scopes = [['Alle', 0], ...segs.map((x) => [x, 1]), ...sers.map((x) => [x, 2])];
  const groups = [...new Set(ws_groups.map((r) => r.group))], months = [...new Set(ws_groups.map((r) => r.month))].sort();
  const out = [];
  for (const [series, level] of scopes) for (const month of months) {
    const rows = ws_groups.filter((r) => r.month === month && (level === 0 || (level === 1 ? r.segment === series : r.series === series)));
    for (const group of groups) {
      const g = rows.filter((r) => r.group === group), sum = (f) => g.reduce((a, r) => a + r[f], 0);
      const lohn_k = sum('lohn_k'), teile_k = sum('teile_k'), lohn_t = sum('lohn_target_k'), teile_t = sum('teile_target_k');
      out.push({ id: series + '|' + month + '|' + group, series, month, group, lohn_k, teile_k, gesamt_k: lohn_k + teile_k, lohn_t, teile_t, gesamt_t: lohn_t + teile_t,
        attain_pct: Math.round((lohn_k + teile_k) / (lohn_t + teile_t) * 1000) / 10 });
    }
  }
  return out;
} });
dash.calc('ins_grp', { title: 'Summary Produktgruppen', description: 'Kurzfazit und Handlungsempfehlung zur Produktgruppen-Auswertung je Auswahl, Umsatzart und Monat.', inputs: ['ws_grp'],
  fn: (ws_grp) => {
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const f = (v) => nf(v, 0) + ' k€';
  const scopes = [...new Set(ws_grp.map((r) => r.series))], months = [...new Set(ws_grp.map((r) => r.month))].sort();
  const PART = { total: ['Gesamt', 'gesamt_k', 'gesamt_t'], lohn: ['Lohn', 'lohn_k', 'lohn_t'], teile: ['Teile', 'teile_k', 'teile_t'] };
  const MISS = { total: 'Gruppen unter Ziel mit Aktionspaketen (Wartung + Verschleißteile) und gezielter Kundenansprache bearbeiten.',
    lohn: 'Lohnumsatz in schwachen Gruppen über Arbeitswerte-Pakete, Zusatzarbeiten und bessere Terminauslastung steigern.',
    teile: 'Teileumsatz in schwachen Gruppen über Teile-Pakete, Verkaufsquote je Auftrag und Teileverfügbarkeit steigern.' };
  const out = [];
  for (const series of scopes) for (const month of months) {
    const rows = ws_grp.filter((r) => r.series === series && r.month === month);
    for (const part of Object.keys(PART)) {
      const [lab, vf, tf] = PART[part];
      const rk = rows.map((r) => ({ g: r.group, v: r[vf], t: r[tf], a: r[vf] / r[tf] - 1 })).sort((x, y) => x.a - y.a);
      const bad = rk.filter((x) => x.a < 0), w = rk[0], b = rk[rk.length - 1], tot = rk.reduce((a, x) => a + x.v, 0);
      const top = rk.slice().sort((x, y) => y.v - x.v)[0];
      out.push({ id: 'grp', series, part, month, ok: bad.length === 0,
        summary: 'Penetration ' + lab + (series === 'Alle' ? '' : ' (' + series + ')') + ': ' + bad.length + ' von ' + rk.length + ' Produktgruppen unter Ziel; größte Lücke ' + w.g + ' (' + nf(w.a * 100, 1) + ' % vs. Ziel ' + f(w.t) + '); größte Gruppe ' + top.g + ' (' + f(top.v) + ', ' + nf(top.v / tot * 100, 0) + ' % des Umsatzes).',
        rec: bad.length ? MISS[part] + ' Priorität: ' + w.g + (bad.length > 1 ? ' und ' + rk[1].g : '') + '.' : 'Alle Produktgruppen im Plan – Zusatzverkäufe und Cross-Selling zwischen Lohn und Teilen weiter ausbauen.' });
    }
  }
  return out;
} });
dash.calc('kpi_iv', { title: 'KPIs Bestand', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je KPI.', inputs: ["iv_monthly"],
  fn: (iv_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "S\u00fcdeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const defs = [["stock_value_k", "Bestandswert", "eur_k", 0, "target_stock_k", 0], ["days_cover", "Reichweite", "days", 0, 60, 0], ["service_level_pct", "Servicegrad", "pct", 1, 97, 0], ["slow_mover_pct", "Langsamdreher-Anteil", "pct", 0, 8, 0], ["obsolete_risk_k", "Obsoleszenzrisiko", "eur_k", 0, 1800, 1], ["inventory_turn", "Lagerumschlag", "n1", 1, 6, 0]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "S\u00fcdeuropa", "Nordeuropa", "Osteuropa"]) {
    const rows = iv_monthly.filter((r) => r.region === region);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi];
        const target = typeof t === 'string' ? a[t] : cnt ? t * SH[region] : t, pp = unit === 'pct' || unit === 'pts';
        const ok = target == null ? null : hib ? value >= target : value <= target;
        out.push({ region, month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('ins_iv', { title: 'Summary Bestand', description: 'Kurzfazit und Handlungsempfehlung je Grafik, Region und Monat.', inputs: ["iv_monthly"],
  fn: (iv_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "S\u00fcdeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', eur_m: (v) => nf(v, 1) + ' Mio. €', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', days: (v) => nf(v, 1) + ' Tage', int: (v) => nf(v, 0), eur: (v) => nf(v, 2) + ' €', pts: (v) => (v >= 0 ? '+' : '−') + nf(Math.abs(v), 1) + ' Pkt.', n1: (v) => nf(v, 1) };
  const T = [{"id": "iv_0", "y": "stock_value_k", "unit": "eur_k", "target": "target_stock_k", "hib": 0, "lab": "Bestandswert", "ok": "Bestandsniveau halten und Nachschub weiter eng am Bedarf ausrichten.", "miss": "Bestand abbauen: Bestellmengen und Sicherheitsbestände für Langsamdreher senken, Überbestände zwischen Lagern umlagern."}, {"id": "iv_1", "y": "service_level_pct", "unit": "pct", "target": 97, "hib": 1, "lab": "Servicegrad", "ok": "Servicegrad halten und Engpassteile weiter proaktiv absichern.", "miss": "Verfügbarkeit erhöhen: Sicherheitsbestände der A-Teile anheben, Lieferanten-Expedite und kürzere Wiederbeschaffungszeiten verhandeln."}];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "S\u00fcdeuropa", "Nordeuropa", "Osteuropa"]) {
    const mon = iv_monthly.filter((r) => r.region === region);
    for (let i = 1; i < mon.length; i++) {
      const month = mon[i].month;
      for (const s of T) {
        const v = mon[i][s.y], p = mon[i - 1][s.y], b3 = mon[Math.max(0, i - 3)][s.y], f = F[s.unit];
        const t = typeof s.target === 'string' ? mon[i][s.target] : s.target;
        const ok = s.hib ? v >= t : v <= t, better = s.hib ? v >= b3 : v <= b3, d = (v / p - 1) * 100;
        const summary = s.lab + ': ' + f(v) + ' (' + (d >= 0 ? '+' : '−') + nf(Math.abs(d), 1) + ' % ggü. Vormonat), Ziel ' + f(t) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.';
        const rec = ok ? (better ? s.ok : 'Trend dreht – frühzeitig gegensteuern. ' + s.ok) : (better ? s.miss + ' Trend verbessert sich – Maßnahmen fortführen.' : 'Handlungsbedarf: ' + s.miss);
        out.push({ id: s.id, region, month, ok, summary, rec });
      }
    }
  }
  return out;
} });
dash.calc('iv_abc_cube', { title: 'ABC/XYZ-Kennzahlen', description: 'Servicegrad, Reichweite und Bestandswert je ABC/XYZ-Klasse mit Zielen je ABC-Klasse.', inputs: ["iv_abc"],
  fn: (iv_abc) => {
  const TS = { 'A': 99, 'B': 97, 'C': 93 }, TD = { 'A': 35, 'B': 60, 'C': 95 };
  const out = [];
  for (const r of iv_abc) {
    const c = r.abc.charAt(0), okS = r.service_level_pct >= TS[c], okD = r.days_cover <= TD[c];
    out.push({ region: r.region, month: r.month, abc: r.abc, xyz: r.xyz, kpi: 'service_level_pct', unit: 'pct', value: r.service_level_pct, target: TS[c], ok: okS });
    out.push({ region: r.region, month: r.month, abc: r.abc, xyz: r.xyz, kpi: 'days_cover', unit: 'days', value: r.days_cover, target: TD[c], ok: okD });
    out.push({ region: r.region, month: r.month, abc: r.abc, xyz: r.xyz, kpi: 'stock_value_k', unit: 'eur_k', value: r.stock_value_k, target: null, ok: null });
  }
  return out;
} });
dash.calc('ins_ivx', { title: 'Summary ABC/XYZ', description: 'Kurzfazit und Handlungsempfehlung zur ABC/XYZ-Matrix je Region, Monat und Kennzahl.', inputs: ["iv_abc_cube"],
  fn: (iv_abc_cube) => {
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', eur_m: (v) => nf(v, 1) + ' Mio. €', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', days: (v) => nf(v, 1) + ' Tage', int: (v) => nf(v, 0), eur: (v) => nf(v, 2) + ' €', pts: (v) => (v >= 0 ? '+' : '−') + nf(Math.abs(v), 1) + ' Pkt.', n1: (v) => nf(v, 1) };
  const M = { service_level_pct: ['Servicegrad', 'Servicegrad der kritischen Klassen heben: Sicherheitsbestände für A-Teile anheben, Nachschubzyklen verkürzen und Prognose für X/Y-Artikel schärfen.', 'Servicegrad halten und das Niveau der C-Klassen gezielt über Kundenbedarf steuern.'],
    days_cover: ['Reichweite', 'Reichweiten in den roten Klassen abbauen: Bestellmengen für Z-Artikel senken, Abverkaufsaktionen und Rückgaben an Lieferanten prüfen.', 'Reichweiten im Zielkorridor halten und Nachschubparameter beobachten.'],
    stock_value_k: ['Bestandswert', 'Kapital in C/Z-Klassen reduzieren: Sortimentsbereinigung, Mindestbestände senken und Abverkauf von Langsamläufern priorisieren.', 'Kapitalbindung im Blick behalten und Bestandsverteilung zwischen den Klassen regelmäßig prüfen.'] };
  const g = new Map();
  for (const r of iv_abc_cube) { const k = [r.region, r.month, r.kpi].join('|'); if (!g.has(k)) g.set(k, []); g.get(k).push(r); }
  const out = [];
  for (const [k, rows] of g) {
    const [region, month, kpi] = k.split('|'), m = M[kpi], f = F[rows[0].unit];
    if (kpi === 'stock_value_k') {
      const tot = rows.reduce((a, r) => a + r.value, 0), hi = rows.slice().sort((x, y) => y.value - x.value)[0];
      out.push({ id: 'abc', region, month, kpi, ok: true, summary: m[0] + ': ' + f(tot) + ' gesamt; höchste Kapitalbindung in ' + hi.abc + ' / ' + hi.xyz + ' (' + f(hi.value) + ', ' + nf(hi.value / tot * 100, 0) + ' %).', rec: m[2] });
      continue;
    }
    const bad = rows.filter((r) => !r.ok), gap = (r) => (kpi === 'service_level_pct' ? r.value - r.target : r.target - r.value), w = rows.slice().sort((x, y) => gap(x) - gap(y))[0];
    out.push({ id: 'abc', region, month, kpi, ok: bad.length === 0,
      summary: m[0] + ': ' + bad.length + ' von ' + rows.length + ' Klassen verfehlen das Ziel; größte Lücke ' + w.abc + ' / ' + w.xyz + ' (' + f(w.value) + ' vs. Ziel ' + f(w.target) + ').',
      rec: bad.length ? m[1] + ' Priorität: ' + w.abc + ' / ' + w.xyz + '.' : m[2] });
  }
  return out;
} });
dash.calc('ins_ivg', { title: 'Summary Bestand Produktgruppen', description: 'Kurzfazit und Handlungsempfehlung zu Obsoleszenz und Servicegrad je Produktgruppen-Auswertung.', inputs: ["iv_group"],
  fn: (iv_group) => {
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', eur_m: (v) => nf(v, 1) + ' Mio. €', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', days: (v) => nf(v, 1) + ' Tage', int: (v) => nf(v, 0), eur: (v) => nf(v, 2) + ' €', pts: (v) => (v >= 0 ? '+' : '−') + nf(Math.abs(v), 1) + ' Pkt.', n1: (v) => nf(v, 1) };
  const g = new Map();
  for (const r of iv_group) { const k = r.region + '|' + r.month; if (!g.has(k)) g.set(k, []); g.get(k).push(r); }
  const out = [];
  for (const [k, rows] of g) {
    const [region, month] = k.split('|');
    const tot = rows.reduce((a, r) => a + r.obsolete_risk_k, 0), top = rows.slice().sort((x, y) => y.obsolete_risk_k - x.obsolete_risk_k).slice(0, 3);
    const share = top.reduce((a, r) => a + r.obsolete_risk_k, 0) / tot * 100, low = rows.filter((r) => r.service_level_pct < 95).sort((x, y) => x.service_level_pct - y.service_level_pct);
    out.push({ id: 'ivg', region, month, ok: low.length === 0,
      summary: 'Obsoleszenzrisiko ' + F.eur_k(tot) + ': größte Treiber ' + top.map((r) => r.group + ' (' + F.eur_k(r.obsolete_risk_k) + ')').join(', ') + ' mit ' + nf(share, 0) + ' % des Risikos; ' + (low.length ? low.length + ' Produktgruppen mit Servicegrad unter 95 %, am niedrigsten ' + low[0].group + ' (' + F.pct(low[0].service_level_pct) + ').' : 'alle Produktgruppen mit Servicegrad ab 95 %.'),
      rec: 'Risikobestand in ' + top[0].group + ' und ' + top[1].group + ' über Abverkaufsaktionen, Lieferantenrückgabe oder Umlagerung abbauen' + (low.length ? '; Nachschub und Sicherheitsbestand für ' + low[0].group + ' erhöhen.' : ' und das Servicegrad-Niveau halten.') });
  }
  return out;
} });
dash.calc('kpi_mk', { title: 'KPIs Markt', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je KPI.', inputs: ["mk_monthly"],
  fn: (mk_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "S\u00fcdeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const defs = [["market_share_pct", "Marktanteil", "pct", 1, 18, 0], ["share_gain_pts", "Marktanteilsgewinn ggü. Vorjahr", "pts", 1, 0.5, 0], ["price_gap_pct", "Preisabstand zum Wettbewerb", "pct", 0, 2, 0], ["market_volume_m", "Marktvolumen", "eur_m", null, null, 0]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "S\u00fcdeuropa", "Nordeuropa", "Osteuropa"]) {
    const rows = mk_monthly.filter((r) => r.region === region);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi];
        const target = typeof t === 'string' ? a[t] : cnt ? t * SH[region] : t, pp = unit === 'pct' || unit === 'pts';
        const ok = target == null ? null : hib ? value >= target : value <= target;
        out.push({ region, month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('ins_mk', { title: 'Summary Markt', description: 'Kurzfazit und Handlungsempfehlung je Grafik, Region und Monat.', inputs: ["mk_monthly"],
  fn: (mk_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "S\u00fcdeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', eur_m: (v) => nf(v, 1) + ' Mio. €', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', days: (v) => nf(v, 1) + ' Tage', int: (v) => nf(v, 0), eur: (v) => nf(v, 2) + ' €', pts: (v) => (v >= 0 ? '+' : '−') + nf(Math.abs(v), 1) + ' Pkt.', n1: (v) => nf(v, 1) };
  const T = [{"id": "mk_0", "y": "market_share_pct", "unit": "pct", "target": 18, "hib": 1, "lab": "Marktanteil", "ok": "Marktanteil sichern und Wachstumsgruppen gezielt weiter ausbauen.", "miss": "Marktanteil zurückgewinnen: Schwächegruppen mit Preis- und Verfügbarkeitsaktionen sowie Händleransprache adressieren."}, {"id": "mk_1", "y": "price_gap_pct", "unit": "pct", "target": 2, "hib": 0, "lab": "Preisabstand zum Wettbewerb", "ok": "Preisposition halten und Spielräume bei Gruppen mit Preisvorteil für Marge nutzen.", "miss": "Preisabstand verringern: Gruppen mit hohem Aufschlag und sinkendem Marktanteil gezielt anpassen, Preiswahrnehmung bei Schlüsselteilen schützen."}];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "S\u00fcdeuropa", "Nordeuropa", "Osteuropa"]) {
    const mon = mk_monthly.filter((r) => r.region === region);
    for (let i = 1; i < mon.length; i++) {
      const month = mon[i].month;
      for (const s of T) {
        const v = mon[i][s.y], p = mon[i - 1][s.y], b3 = mon[Math.max(0, i - 3)][s.y], f = F[s.unit];
        const t = typeof s.target === 'string' ? mon[i][s.target] : s.target;
        const ok = s.hib ? v >= t : v <= t, better = s.hib ? v >= b3 : v <= b3, d = (v / p - 1) * 100;
        const summary = s.lab + ': ' + f(v) + ' (' + (d >= 0 ? '+' : '−') + nf(Math.abs(d), 1) + ' % ggü. Vormonat), Ziel ' + f(t) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.';
        const rec = ok ? (better ? s.ok : 'Trend dreht – frühzeitig gegensteuern. ' + s.ok) : (better ? s.miss + ' Trend verbessert sich – Maßnahmen fortführen.' : 'Handlungsbedarf: ' + s.miss);
        out.push({ id: s.id, region, month, ok, summary, rec });
      }
    }
  }
  return out;
} });
dash.calc('ins_mkg', { title: 'Summary Markt Produktgruppen', description: 'Kurzfazit und Handlungsempfehlung zu Preis und Marktanteil je Produktgruppe, Region und Monat.', inputs: ["mk_group"],
  fn: (mk_group) => {
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', eur_m: (v) => nf(v, 1) + ' Mio. €', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', days: (v) => nf(v, 1) + ' Tage', int: (v) => nf(v, 0), eur: (v) => nf(v, 2) + ' €', pts: (v) => (v >= 0 ? '+' : '−') + nf(Math.abs(v), 1) + ' Pkt.', n1: (v) => nf(v, 1) };
  const g = new Map();
  for (const r of mk_group) { const k = r.region + '|' + r.month; if (!g.has(k)) g.set(k, []); g.get(k).push(r); }
  const out = [];
  for (const [k, rows] of g) {
    const [region, month] = k.split('|');
    const risk = rows.filter((r) => r.price_gap_pct > 2 && r.share_change_pts < 0).sort((x, y) => y.price_gap_pct - x.price_gap_pct);
    const win = rows.slice().sort((x, y) => y.share_change_pts - x.share_change_pts).slice(0, 2), exp = rows.filter((r) => r.price_gap_pct > 2).length;
    out.push({ id: 'mkg', region, month, ok: risk.length === 0,
      summary: risk.length + ' von ' + rows.length + ' Produktgruppen mit Preisaufschlag über 2 % bei sinkendem Marktanteil' + (risk.length ? ' (kritisch: ' + risk.slice(0, 3).map((r) => r.group + ' ' + F.pts(r.share_change_pts) + ', Aufschlag ' + F.pct(r.price_gap_pct)).join('; ') + ')' : '') + '; ' + exp + ' Gruppen insgesamt über 2 % Aufschlag; stärkste Gewinner: ' + win.map((r) => r.group + ' (' + F.pts(r.share_change_pts) + ')').join(', ') + '.',
      rec: risk.length ? 'Preise für ' + risk.slice(0, 2).map((r) => r.group).join(' und ') + ' gegen den Hauptwettbewerber (' + risk[0].main_competitor + ') prüfen und selektiv anpassen; in Gewinner-Gruppen (' + win[0].group + ') Margenspielräume nutzen.' : 'Keine kritischen Gruppen – Preisspielräume in Gewinner-Gruppen (' + win[0].group + ') für Marge nutzen und Wettbewerbspreise monatlich nachverfolgen.' });
  }
  return out;
} });
dash.calc('ma_suggest', { title: 'Maßnahmenvorschläge', description: 'KPIs unter Ziel (Gesamtsicht je Region und Monat) mit Vorschlag, Rolle und Frist aus dem Maßnahmen-Playbook.', inputs: ["head_kpis", "ma_playbook"],
  fn: (head_kpis, ma_playbook) => {
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', int: (v) => nf(v, 0), days: (v) => nf(v, 1) + ' Tage', eur: (v) => nf(v, 2) + ' €', eur0: (v) => nf(v, 0) + ' €', score: (v) => nf(v, 2), idx: (v) => nf(v, 1), n1: (v) => nf(v, 1) };
  const pb = new Map(ma_playbook.map((p) => [p.kpi_id, p]));
  const out = [];
  for (const r of head_kpis) {
    if (r.ok !== false || r.dim !== 'Alle') continue;
    const p = pb.get(r.bu + '_' + r.kpi); if (!p) continue;
    const gap = Math.abs(r.value - r.target) / Math.abs(r.target) * 100;
    out.push({ id: [r.region, r.month, r.bu, r.kpi].join('|'), region: r.region, month: r.month, bu: r.bu, bu_label: r.bu_label, kpi: r.label,
      gap: F[r.unit](r.value) + ' vs. Ziel ' + F[r.unit](r.target), prio: gap > 5 ? 'A' : gap > 2 ? 'B' : 'C', action: p.action, owner_role: p.owner_role, effect: p.effect, days: p.days });
  }
  return out;
} });
dash.calc('dq_checks', { title: 'Datenqualitäts-Prüfungen', description: 'Zeilen, Monatsabdeckung, leere Werte, Duplikate und Plausibilität je Datensatz.', inputs: ["mo_monthly", "mo_country", "pm_monthly", "pm_category", "pr_monthly", "pr_category", "lg_monthly", "lg_carrier", "tr_monthly", "tr_course", "wa_monthly", "wa_cause", "branches", "branch_monthly", "ws_segments", "ws_groups", "iv_monthly", "dealers", "dealer_monthly", "fc_plan", "wf_monthly", "iv_group", "iv_abc", "mk_monthly", "mk_group", "cu_monthly", "cu_segment", "co_monthly", "co_competitor", "mt_monthly", "mt_channel", "dt5", "pg_margin"],
  fn: (mo_monthly, mo_country, pm_monthly, pm_category, pr_monthly, pr_category, lg_monthly, lg_carrier, tr_monthly, tr_course, wa_monthly, wa_cause, branches, branch_monthly, ws_segments, ws_groups, iv_monthly, dealers, dealer_monthly, fc_plan, wf_monthly, iv_group, iv_abc, mk_monthly, mk_group, cu_monthly, cu_segment, co_monthly, co_competitor, mt_monthly, mt_channel, dt5, pg_margin) => {
  const spec = [["mo_monthly", ["region", "dim", "member", "month"]], ["mo_country", ["country"]], ["pm_monthly", ["region", "dim", "member", "month"]], ["pm_category", ["region", "category"]], ["pr_monthly", ["region", "dim", "member", "month"]], ["pr_category", ["region", "category"]], ["lg_monthly", ["region", "dim", "member", "month"]], ["lg_carrier", ["region", "carrier"]], ["tr_monthly", ["region", "dim", "member", "month"]], ["tr_course", ["region", "course"]], ["wa_monthly", ["region", "dim", "member", "month"]], ["wa_cause", ["region", "cause"]], ["branches", ["id"]], ["branch_monthly", ["id", "month"]], ["ws_segments", ["series", "age", "month"]], ["ws_groups", ["series", "group", "month"]], ["iv_monthly", ["region", "month"]], ["dealers", ["id"]], ["dealer_monthly", ["id", "month"]], ["fc_plan", ["region", "month"]], ["wf_monthly", ["region", "month"]], ["iv_group", ["id"]], ["iv_abc", ["region", "month", "abc", "xyz"]], ["mk_monthly", ["region", "month"]], ["mk_group", ["id"]], ["cu_monthly", ["region", "dim", "member", "month"]], ["cu_segment", ["region", "segment"]], ["co_monthly", ["region", "dim", "member", "month"]], ["co_competitor", ["region", "competitor"]], ["mt_monthly", ["region", "dim", "member", "month"]], ["mt_channel", ["region", "channel"]], ["dt5", ["region", "month"]], ["pg_margin", ["region", "group"]]];
  const data = { mo_monthly, mo_country, pm_monthly, pm_category, pr_monthly, pr_category, lg_monthly, lg_carrier, tr_monthly, tr_course, wa_monthly, wa_cause, branches, branch_monthly, ws_segments, ws_groups, iv_monthly, dealers, dealer_monthly, fc_plan, wf_monthly, iv_group, iv_abc, mk_monthly, mk_group, cu_monthly, cu_segment, co_monthly, co_competitor, mt_monthly, mt_channel, dt5, pg_margin };
  const out = [];
  const NOPCT = ['yoy_pct', 'price_gap_pct', 'romi_pct', 'growth_pct'];
  const isCount = (c) => /_k$|_m$|_count$/.test(c) || ['orders', 'claims', 'trainings', 'participants', 'active_dealers', 'active_skus', 'new_skus', 'price_changes', 'shipments', 'dealers', 'skus', 'active_customers', 'leads', 'competitor_promos', 'dealers', 'staff', 'warehouse_m2', 'bay_days'].includes(c);
  const mi = (m) => +m.slice(0, 4) * 12 + +m.slice(5, 7);
  for (const [id, keys] of spec) {
    const rows = data[id], add = (check, bad, detail) => out.push({ id: id + '|' + check, dataset: id, check, status: bad ? 'Warnung' : 'OK', detail });
    add('Zeilen', rows.length === 0, rows.length.toLocaleString('de-DE') + ' Zeilen');
    if ('month' in rows[0]) {
      const ms = [...new Set(rows.map((r) => r.month))].sort(); let gaps = 0;
      for (let i = 1; i < ms.length; i++) if (mi(ms[i]) - mi(ms[i - 1]) !== 1) gaps += 1;
      add('Monatsabdeckung', gaps > 0 || ms.length < 12, ms.length + ' Monate (' + ms[0] + ' bis ' + ms[ms.length - 1] + ')' + (gaps ? ', ' + gaps + ' Lücke(n)' : ''));
    }
    const cols = Object.keys(rows[0]), nums = cols.filter((c) => typeof rows[0][c] === 'number');
    let empty = 0, neg = 0, pct = 0;
    for (const r of rows) {
      for (const c of cols) if (r[c] === null || r[c] === undefined || r[c] === '' || (typeof r[c] === 'number' && !Number.isFinite(r[c]))) empty += 1;
      for (const c of nums) {
        if (isCount(c) && r[c] < 0) neg += 1;
        if (/_pct$/.test(c) && !NOPCT.includes(c) && (r[c] < 0 || r[c] > 100)) pct += 1;
      }
    }
    add('Leere Werte', empty > 0, empty + ' leere oder ungültige Werte');
    const seen = new Set(); let dup = 0;
    for (const r of rows) { const k = keys.map((c) => r[c]).join('|'); if (seen.has(k)) dup += 1; else seen.add(k); }
    add('Duplikate', dup > 0, dup + ' doppelte Schlüssel (' + keys.join(' + ') + ')');
    add('Plausibilität', neg + pct > 0, pct + ' Quoten außerhalb 0–100 %, ' + neg + ' negative Mengen');
  }
  return out;
} });
dash.calc('dq_summary', { title: 'Datenqualität gesamt', description: 'Anzahl bestandener und auffälliger Prüfungen.', inputs: ["dq_checks"],
  fn: (dq_checks) => {
  const total = dq_checks.length, warn = dq_checks.filter((r) => r.status !== 'OK').length;
  return [{ id: 'dq', datasets: new Set(dq_checks.map((r) => r.dataset)).size, total, warn, ok: total - warn }];
} });
dash.calc('dl_monthly', { title: 'Händler-Monatswerte', description: 'Aktive Händler, Abwanderung, Aufträge je Händler, Zahlungsverzug und Risikoumsatz je Region und Monat.', inputs: ["dealers", "dealer_monthly"],
  fn: (dealers, dealer_monthly) => {
  const info = new Map(dealers.map((d) => [d.id, d]));
  const by = new Map();
  for (const r of dealer_monthly) { if (!by.has(r.id)) by.set(r.id, []); by.get(r.id).push(r); }
  const acc = new Map();
  const add = (region, month) => {
    const k = region + '|' + month; let g = acc.get(k);
    if (!g) { g = { region, month, active: 0, prevActive: 0, churned: 0, orders: 0, rev: 0, payW: 0, overW: 0, riskK: 0, riskN: 0 }; acc.set(k, g); }
    return g;
  };
  for (const [id, rows] of by) {
    rows.sort((a, b) => (a.month < b.month ? -1 : 1));
    const d = info.get(id);
    rows.forEach((r, i) => {
      const prev = rows[i - 1], avg3 = i ? rows.slice(Math.max(0, i - 3), i).reduce((s, x) => s + x.revenue_k, 0) / Math.min(3, i) : null;
      for (const region of ['Alle', d.region]) {
        const g = add(region, r.month);
        if (r.orders > 0) { g.active += 1; g.orders += r.orders; g.rev += r.revenue_k; g.payW += (r.days_to_pay - d.payment_terms_days) * r.revenue_k; g.overW += r.overdue_pct * r.revenue_k; }
        if (prev && prev.orders > 0) { g.prevActive += 1; if (r.orders === 0) g.churned += 1; }
        if (avg3 && r.orders > 0 && r.revenue_k < 0.75 * avg3) { g.riskK += r.revenue_k; g.riskN += 1; }
      }
    });
  }
  return [...acc.values()].map((g) => ({ region: g.region, month: g.month, active_dealers: g.active, churn_pct: g.prevActive ? g.churned / g.prevActive * 100 : 0,
    orders_per_dealer: g.active ? g.orders / g.active : 0, pay_delay_days: g.rev ? g.payW / g.rev : 0, overdue_pct: g.rev ? g.overW / g.rev : 0, at_risk_k: g.riskK, at_risk_n: g.riskN }))
    .sort((a, b) => (a.region === b.region ? (a.month < b.month ? -1 : 1) : ['Alle', 'DACH', 'Westeuropa', 'Südeuropa', 'Nordeuropa', 'Osteuropa'].indexOf(a.region) - ['Alle', 'DACH', 'Westeuropa', 'Südeuropa', 'Nordeuropa', 'Osteuropa'].indexOf(b.region)));
} });
dash.calc('kpi_dl', { title: 'KPIs Händler', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je KPI.', inputs: ["dl_monthly"],
  fn: (dl_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "S\u00fcdeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const defs = [["active_dealers", "Aktive Händler", "int", 1, 290, 1], ["churn_pct", "Abwanderungsquote", "pct2", 0, 0.8, 0], ["orders_per_dealer", "Aufträge je aktivem Händler", "n1", 1, 36, 0], ["pay_delay_days", "Zahlungsverzug", "days", 0, 3, 0], ["overdue_pct", "Überfällige Forderungen", "pct", 0, 6, 0], ["at_risk_k", "Umsatz in Risiko-Händlern", "eur_k", 0, 30, 1]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "S\u00fcdeuropa", "Nordeuropa", "Osteuropa"]) {
    const rows = dl_monthly.filter((r) => r.region === region);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi];
        const target = typeof t === 'string' ? a[t] : cnt ? t * SH[region] : t, pp = unit === 'pct' || unit === 'pts';
        const ok = target == null ? null : hib ? value >= target : value <= target;
        out.push({ region, month, kpi, label, unit, value, prev, target, hib, ok, delta: pp ? value - prev : (value / prev - 1) * 100, dk: pp ? 'pp' : 'rel',
          status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('ins_dl', { title: 'Summary Händler', description: 'Kurzfazit und Handlungsempfehlung je Grafik, Region und Monat.', inputs: ["dl_monthly"],
  fn: (dl_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "S\u00fcdeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const F = { eur_k: (v) => nf(v, 0) + ' k€', eur_m: (v) => nf(v, 1) + ' Mio. €', pct: (v) => nf(v, 1) + ' %', pct2: (v) => nf(v, 2) + ' %', days: (v) => nf(v, 1) + ' Tage', int: (v) => nf(v, 0), eur: (v) => nf(v, 2) + ' €', pts: (v) => (v >= 0 ? '+' : '−') + nf(Math.abs(v), 1) + ' Pkt.', n1: (v) => nf(v, 1) };
  const T = [{"id": "dl_0", "y": "active_dealers", "unit": "int", "target": 290, "cnt": 1, "hib": 1, "lab": "Aktive Händler", "ok": "Händlerbasis stabil – Reaktivierungsaktionen für ruhende Händler im Blick behalten.", "miss": "Händlerbasis stabilisieren: Reaktivierungskampagne für inaktive Händler und Betreuungsrhythmus für Risiko-Händler festlegen."}, {"id": "dl_1", "y": "churn_pct", "unit": "pct2", "target": 0.8, "hib": 0, "lab": "Abwanderungsquote", "ok": "Abwanderung unter Kontrolle – Frühwarnsignale (Umsatzrückgang, Zahlungsverzug) weiter beobachten.", "miss": "Abwanderung senken: Händler mit Umsatzrückgang proaktiv ansprechen, Konditionen und Service prüfen, Gründe der Abwanderer analysieren."}];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "S\u00fcdeuropa", "Nordeuropa", "Osteuropa"]) {
    const mon = dl_monthly.filter((r) => r.region === region);
    for (let i = 1; i < mon.length; i++) {
      const month = mon[i].month;
      for (const s of T) {
        const v = mon[i][s.y], p = mon[i - 1][s.y], b3 = mon[Math.max(0, i - 3)][s.y], f = F[s.unit];
        const t = typeof s.target === 'string' ? mon[i][s.target] : s.target;
        const ok = s.hib ? v >= t : v <= t, better = s.hib ? v >= b3 : v <= b3, d = (v / p - 1) * 100;
        const summary = s.lab + ': ' + f(v) + ' (' + (d >= 0 ? '+' : '−') + nf(Math.abs(d), 1) + ' % ggü. Vormonat), Ziel ' + f(t) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.';
        const rec = ok ? (better ? s.ok : 'Trend dreht – frühzeitig gegensteuern. ' + s.ok) : (better ? s.miss + ' Trend verbessert sich – Maßnahmen fortführen.' : 'Handlungsbedarf: ' + s.miss);
        out.push({ id: s.id, region, month, ok, summary, rec });
      }
    }
  }
  return out;
} });
dash.calc('dl_risk', { title: 'Händler mit Abwanderungsrisiko', description: 'Händler mit Risikopunkten aus Umsatzrückgang, Inaktivität und Zahlungsverhalten je Monat.', inputs: ["dealers", "dealer_monthly"],
  fn: (dealers, dealer_monthly) => {
  const info = new Map(dealers.map((d) => [d.id, d]));
  const by = new Map();
  for (const r of dealer_monthly) { if (!by.has(r.id)) by.set(r.id, []); by.get(r.id).push(r); }
  const out = [];
  for (const [id, rows] of by) {
    rows.sort((a, b) => (a.month < b.month ? -1 : 1));
    const d = info.get(id);
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i], prev = rows[i - 1], avg3 = rows.slice(Math.max(0, i - 3), i).reduce((s, x) => s + x.revenue_k, 0) / Math.min(3, i);
      const drop = avg3 ? (1 - r.revenue_k / avg3) * 100 : 0, reasons = [];
      let score = 0;
      if (prev.orders > 0 && r.orders === 0) { score += 3; reasons.push('keine Aufträge mehr'); }
      else if (drop >= 30) { score += 2; reasons.push('Umsatz −' + Math.round(drop) + ' % ggü. 3-Monats-Ø'); }
      if (r.last_order_days > 45) { score += 2; reasons.push(r.last_order_days + ' Tage ohne Auftrag'); }
      if (r.overdue_pct > 12) { score += 1; reasons.push(r.overdue_pct.toFixed(0) + ' % überfällig'); }
      if (r.days_to_pay > d.payment_terms_days + 10) { score += 1; reasons.push('Zahlung ' + Math.round(r.days_to_pay - d.payment_terms_days) + ' Tage über Ziel'); }
      if (score < 2) continue;
      out.push({ id: id + '|' + r.month, dealer: id, name: d.name, region: d.region, segment: d.segment, month: r.month, revenue_k: r.revenue_k, avg3_k: avg3, drop_pct: drop,
        last_order_days: r.last_order_days, overdue_pct: r.overdue_pct, score, level: score >= 4 ? 'hoch' : 'mittel', reasons: reasons.join('; ') });
    }
  }
  return out;
} });
dash.calc('dl_seg', { title: 'Händlersegmente', description: 'Anzahl, Umsatz und Umsatzanteil je Händlersegment (A/B/C), Region und Monat.', inputs: ["dealers", "dealer_monthly"],
  fn: (dealers, dealer_monthly) => {
  const info = new Map(dealers.map((d) => [d.id, d]));
  const g = new Map();
  for (const r of dealer_monthly) {
    const d = info.get(r.id);
    for (const region of ['Alle', d.region]) {
      const k = [region, r.month, d.segment].join('|'); let x = g.get(k);
      if (!x) { x = { id: k, region, month: r.month, segment: d.segment, dealers: 0, active: 0, revenue_k: 0, marginW: 0 }; g.set(k, x); }
      x.dealers += 1; if (r.orders > 0) { x.active += 1; x.revenue_k += r.revenue_k; x.marginW += r.margin_pct * r.revenue_k; }
    }
  }
  const tot = new Map();
  for (const x of g.values()) { const k = x.region + '|' + x.month; tot.set(k, (tot.get(k) || 0) + x.revenue_k); }
  return [...g.values()].map((x) => ({ id: x.id, region: x.region, month: x.month, segment: x.segment, dealers: x.dealers, active: x.active, revenue_k: x.revenue_k,
    share_pct: x.revenue_k / tot.get(x.region + '|' + x.month) * 100, margin_pct: x.revenue_k ? x.marginW / x.revenue_k : 0 }));
} });
dash.calc('ins_dlr', { title: 'Summary Händlerrisiko', description: 'Kurzfazit und Handlungsempfehlung zu Abwanderungsrisiko und Segmenten je Region und Monat.', inputs: ["dl_risk", "dl_seg"],
  fn: (dl_risk, dl_seg) => {
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const out = [];
  const regs = ['Alle', 'DACH', 'Westeuropa', 'Südeuropa', 'Nordeuropa', 'Osteuropa'], months = [...new Set(dl_seg.map((r) => r.month))].sort();
  for (const region of regs) for (const month of months) {
    const seg = dl_seg.filter((r) => r.region === region && r.month === month), tot = seg.reduce((a, r) => a + r.revenue_k, 0);
    const rk = dl_risk.filter((r) => (region === 'Alle' || r.region === region) && r.month === month).sort((a, b) => b.score - a.score || b.avg3_k - a.avg3_k);
    const hi = rk.filter((r) => r.level === 'hoch'), expo = hi.reduce((a, r) => a + r.avg3_k, 0), a = seg.find((r) => r.segment === 'A');
    const hiA = hi.filter((r) => r.segment === 'A').length;
    out.push({ id: 'dlr', region, month, ok: hi.length === 0,
      summary: hi.length + ' Händler mit hohem und ' + (rk.length - hi.length) + ' mit mittlerem Abwanderungsrisiko; gefährdeter Umsatz (3-Monats-Ø) ' + nf(expo, 0) + ' k€' + (tot ? ' (' + nf(expo / tot * 100, 1) + ' % des Monatsumsatzes)' : '') + (hiA ? ', davon ' + hiA + ' A-Händler' : '') + '; A-Händler erzielen ' + (a ? nf(a.share_pct, 0) : '–') + ' % des Umsatzes' + (rk.length ? '; höchstes Risiko: ' + rk[0].name + ' (' + rk[0].reasons + ')' : '') + '.',
      rec: hi.length ? 'Persönliche Händlergespräche für die ' + Math.min(5, hi.length) + ' Händler mit dem höchsten Risiko in den nächsten 14 Tagen ansetzen (Außendienst), A-Händler zuerst; bei Zahlungsproblemen Kreditlimit und Zahlungsplan klären.' : 'Kein akutes Abwanderungsrisiko – Frühwarnung (mittleres Risiko) im Monatsreview beobachten und Reaktivierungsaktionen für inaktive Händler prüfen.' });
  }
  return out;
} });
dash.calc('pa_cube', { title: 'Pareto-Analyse', description: 'Rangfolge, Anteil und kumulierter Anteil je Händler, Niederlassung, Produktgruppe und Land.', inputs: ["dealers", "dealer_monthly", "branches", "branch_monthly", "ws_groups", "mo_country"],
  fn: (dealers, dealer_monthly, branches, branch_monthly, ws_groups, mo_country) => {
  const dinfo = new Map(dealers.map((d) => [d.id, d])), binfo = new Map(branches.map((b) => [b.id, b]));
  const out = [];
  const pareto = (entity, region, month, items) => {
    items = items.filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
    const tot = items.reduce((s, x) => s + x.value, 0); let cum = 0;
    items.forEach((x, i) => { cum += x.value; const before = cum - x.value;
      out.push({ id: [entity, region, month, i + 1].join('|'), entity, region, month, rank: i + 1, name: x.name, value: x.value, share_pct: x.value / tot * 100, cum_pct: cum / tot * 100, cls: before / tot < 0.8 ? 'A' : before / tot < 0.95 ? 'B' : 'C', n: items.length }); });
  };
  const regs = ['Alle', 'DACH', 'Westeuropa', 'Südeuropa', 'Nordeuropa', 'Osteuropa'];
  const months = [...new Set(dealer_monthly.map((r) => r.month))].sort();
  for (const month of months) {
    const dm = dealer_monthly.filter((r) => r.month === month), bm = branch_monthly.filter((r) => r.month === month);
    for (const region of regs) {
      pareto('Händler', region, month, dm.filter((r) => region === 'Alle' || dinfo.get(r.id).region === region).map((r) => ({ name: dinfo.get(r.id).name, value: r.revenue_k })));
      pareto('Niederlassungen', region, month, bm.filter((r) => region === 'Alle' || binfo.get(r.id).region === region).map((r) => ({ name: binfo.get(r.id).city, value: r.revenue_k })));
    }
    const gs = new Map();
    for (const r of ws_groups) if (r.month === month) gs.set(r.group, (gs.get(r.group) || 0) + r.lohn_k + r.teile_k);
    pareto('Produktgruppen', 'Alle', month, [...gs].map(([name, value]) => ({ name, value })));
  }
  for (const region of regs) pareto('Länder', region, 'all', mo_country.filter((r) => region === 'Alle' || r.region === region).map((r) => ({ name: r.country, value: r.revenue_k })));
  return out;
} });
dash.calc('ins_pa', { title: 'Summary Pareto', description: 'Kurzfazit zur Konzentration und Handlungsempfehlung je Betrachtung, Region und Monat.', inputs: ["pa_cube"],
  fn: (pa_cube) => {
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const g = new Map();
  for (const r of pa_cube) { const k = [r.entity, r.region, r.month].join('|'); if (!g.has(k)) g.set(k, []); g.get(k).push(r); }
  const REC = { 'Händler': ['Händlerbasis', 'Top-Händler als Key Accounts absichern (feste Ansprechpartner, Rahmenverträge), C-Händler über Onlineportal und Standardsortiment effizient bedienen.'],
    'Niederlassungen': ['Standortnetz', 'Spitzenstandorte als Referenz nutzen, Standorte der C-Klasse auf Wirtschaftlichkeit prüfen (Zusammenlegung, Kooperation, Zielvereinbarung).'],
    'Produktgruppen': ['Sortiment', 'Verfügbarkeit und Preispflege auf die A-Gruppen konzentrieren, Gruppen der C-Klasse auf Bereinigung und Mindestbestände prüfen.'],
    'Länder': ['Länder', 'Ressourcen auf die A-Länder konzentrieren, in C-Ländern Wachstumshebel (Händlernetz, Aktionen) gezielt prüfen.'] };
  const out = [];
  for (const [k, rows] of g) {
    const [entity, region, month] = k.split('|'), n = rows.length, a = rows.filter((r) => r.cls === 'A'), top3 = rows.slice(0, 3).reduce((s, r) => s + r.share_pct, 0), top20 = rows.slice(0, Math.max(1, Math.ceil(n * 0.2))).slice(-1)[0].cum_pct;
    const risk = top3 > 25 ? 'hoch' : top3 > 15 ? 'mittel' : 'gering', R = REC[entity];
    out.push({ id: 'pa', entity, region, month, ok: risk !== 'hoch',
      summary: R[0] + ': die obersten 20 % (' + Math.max(1, Math.ceil(n * 0.2)) + ' von ' + n + ') erzeugen ' + nf(top20, 0) + ' % des Umsatzes; ' + a.length + ' A-Einheiten bis 80 %; Top 3: ' + rows.slice(0, 3).map((r) => r.name + ' (' + nf(r.share_pct, 1) + ' %)').join(', ') + '; Konzentrationsrisiko ' + risk + '.',
      rec: (risk === 'hoch' ? 'Klumpenrisiko senken: Abhängigkeit von den Top 3 absichern und Nachwuchs-Kunden aufbauen. ' : '') + R[1] });
  }
  return out;
} });
dash.calc('fc_cube', { title: 'Forecast-Verlauf', description: 'Plan, Vorjahr, Ist und Forecast je Region, Stichtag und Monat des Jahres 2026.', inputs: ["mo_monthly", "fc_plan"],
  fn: (mo_monthly, fc_plan) => {
  const regs = ['Alle', 'DACH', 'Westeuropa', 'Südeuropa', 'Nordeuropa', 'Osteuropa'];
  const out = [], months26 = Array.from({ length: 12 }, (_, i) => '2026-' + String(i + 1).padStart(2, '0'));
  for (const region of regs) {
    const mo = new Map(mo_monthly.filter((r) => r.region === region && r.dim === 'Alle').map((r) => [r.month, r]));
    const pl = new Map(fc_plan.filter((r) => r.region === region).map((r) => [r.month, r.plan_k]));
    const plan = (m) => (mo.has(m) ? mo.get(m).target_k : pl.get(m));
    const py = (m) => (m >= '2026-10' ? mo.get('2025-' + m.slice(5)).revenue_k : mo.get(m).revenue_k / (1 + mo.get(m).yoy_pct / 100));
    for (let a = 0; a < 9; a++) {
      const asof = months26[a], g = [0, 1, 2].map((k) => mo.get(months26[a - k] || '2025-' + String(12 + a - k).padStart(2, '0')).yoy_pct).reduce((s, x) => s + x, 0) / 3;
      let cp = 0, cy = 0, cf = 0;
      months26.forEach((m) => {
        const ist = m <= asof ? mo.get(m).revenue_k : null, fc = ist != null ? ist : py(m) * (1 + g / 100);
        cp += plan(m); cy += py(m); cf += fc;
        out.push({ id: [region, asof, m].join('|'), region, asof, month: m, plan_k: plan(m), py_k: py(m), ist_k: ist, fc_k: fc, kind: ist != null ? 'Ist' : 'Forecast', cum_plan: cp, cum_py: cy, cum_fc: cf, growth_pct: g });
      });
    }
  }
  return out;
} });
dash.calc('fc_kpi', { title: 'Forecast-Kennzahlen', description: 'Umsatz Ist, Forecast Gesamtjahr, Rest-Jahr und benötigter Monatsumsatz je Region und Stichtag.', inputs: ["fc_cube"],
  fn: (fc_cube) => {
  const g = new Map();
  for (const r of fc_cube) { const k = r.region + '|' + r.asof; if (!g.has(k)) g.set(k, []); g.get(k).push(r); }
  const out = [], sum = (rows, f) => rows.reduce((s, r) => s + (r[f] || 0), 0);
  for (const [k, rows] of g) {
    const [region, asof] = k.split('|'), past = rows.filter((r) => r.month <= asof), rest = rows.filter((r) => r.month > asof), last3 = past.slice(-3);
    const mk = (kpi, label, value, prev, target, hib) => { const ok = target == null ? null : hib ? value >= target : value <= target;
      out.push({ region, month: asof, kpi, label, unit: 'eur_k', value, prev, target, hib, ok, delta: (value / prev - 1) * 100, dk: 'rel', status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' }); };
    mk('ytd', 'Umsatz laufendes Jahr (Ist)', sum(past, 'ist_k'), sum(past, 'py_k'), sum(past, 'plan_k'), 1);
    mk('fy', 'Forecast Gesamtjahr', sum(rows, 'fc_k'), sum(rows, 'py_k'), sum(rows, 'plan_k'), 1);
    mk('rest', 'Forecast Rest-Jahr', sum(rest, 'fc_k'), sum(rest, 'py_k'), sum(rest, 'plan_k'), 1);
    mk('req', 'Benötigter Ø-Monatsumsatz zum Jahresplan', (sum(rows, 'plan_k') - sum(past, 'ist_k')) / rest.length, sum(last3, 'ist_k') / last3.length, null, 0);
  }
  return out;
} });
dash.calc('ins_fc', { title: 'Summary Forecast', description: 'Kurzfazit und Handlungsempfehlung zum Forecast je Region und Stichtag.', inputs: ["fc_cube"],
  fn: (fc_cube) => {
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const g = new Map();
  for (const r of fc_cube) { const k = r.region + '|' + r.asof; if (!g.has(k)) g.set(k, []); g.get(k).push(r); }
  const out = [], sum = (rows, f) => rows.reduce((s, r) => s + (r[f] || 0), 0);
  for (const [k, rows] of g) {
    const [region, asof] = k.split('|'), past = rows.filter((r) => r.month <= asof), rest = rows.filter((r) => r.month > asof);
    const fy = sum(rows, 'fc_k'), plan = sum(rows, 'plan_k'), py = sum(rows, 'py_k'), gap = fy - plan, req = (plan - sum(past, 'ist_k')) / rest.length, run = sum(past.slice(-3), 'ist_k') / 3;
    out.push({ id: 'fc', region, month: asof, ok: gap >= 0,
      summary: 'Forecast Gesamtjahr ' + nf(fy, 0) + ' k€ (' + (gap >= 0 ? '+' : '−') + nf(Math.abs(gap / plan * 100), 1) + ' % ggü. Plan, ' + (fy >= py ? '+' : '−') + nf(Math.abs((fy / py - 1) * 100), 1) + ' % ggü. Vorjahr); Lücke zum Jahresplan ' + nf(gap, 0) + ' k€; bis Jahresende sind im Schnitt ' + nf(req, 0) + ' k€ pro Monat nötig (' + (req >= run ? '+' : '−') + nf(Math.abs((req / run - 1) * 100), 1) + ' % ggü. Ø der letzten 3 Monate).',
      rec: gap >= 0 ? 'Jahresplan auf Kurs – Vorsprung absichern und Upside-Potenziale (Q4-Aktionen, Händlerreaktivierung) gezielt nutzen.' : (req / run - 1 > 0.1 ? 'Jahresplan ist mit der aktuellen Run-Rate nicht erreichbar – Aufholplan für Q4 festlegen (Aktionen, Großkunden, Preis-/Mengen-Hebel) und Plan beim Forecast-Review neu bewerten.' : 'Lücke ist mit moderater Steigerung schließbar – Q4-Aktionsplan mit Regionen und Händlern vereinbaren.') });
  }
  return out;
} });
dash.calc('wf_steps', { title: 'Margen-Wasserfall', description: 'Listenumsatz, Rabatte, Boni, Fracht, Wareneinsatz und Rohertrag je Region und Monat.', inputs: ["wf_monthly"],
  fn: (wf_monthly) => {
  const out = [];
  for (const r of wf_monthly) {
    const L = r.list_k, D = L * r.discount_pct / 100, N1 = L - D, B = N1 * r.bonus_pct / 100, F = r.freight_k, C = r.cogs_k, GP = N1 - B - F - C;
    [['Listenumsatz', L, 'total'], ['Rabatte', -D, 'delta'], ['Boni/Skonti', -B, 'delta'], ['Fracht', -F, 'delta'], ['Wareneinsatz', -C, 'delta'], ['Rohertrag', GP, 'total']].forEach(([label, value, kind], i) =>
      out.push({ id: [r.region, r.month, i].join('|'), region: r.region, month: r.month, step: i, label, value, kind, pct_of_list: value / L * 100 }));
  }
  return out;
} });
dash.calc('ins_wf', { title: 'Summary Wasserfall', description: 'Kurzfazit und Handlungsempfehlung zum Margen-Wasserfall je Region und Monat.', inputs: ["wf_steps"],
  fn: (wf_steps) => {
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const g = new Map();
  for (const r of wf_steps) { const k = r.region + '|' + r.month; if (!g.has(k)) g.set(k, []); g.get(k).push(r); }
  const out = [];
  for (const [k, rows] of g) {
    const [region, month] = k.split('|'), by = Object.fromEntries(rows.map((r) => [r.label, r])), leak = ['Rabatte', 'Boni/Skonti', 'Fracht'].map((l) => by[l]).sort((a, b) => a.value - b.value)[0];
    out.push({ id: 'wf', region, month, ok: by['Rohertrag'].pct_of_list >= 30,
      summary: 'Von 100 € Listenumsatz bleiben ' + nf(by['Rohertrag'].pct_of_list, 1) + ' € Rohertrag: Rabatte ' + nf(by['Rabatte'].pct_of_list, 1) + ' €, Boni/Skonti ' + nf(by['Boni/Skonti'].pct_of_list, 1) + ' €, Fracht ' + nf(by['Fracht'].pct_of_list, 1) + ' €, Wareneinsatz ' + nf(by['Wareneinsatz'].pct_of_list, 1) + ' €; größter Abfluss vor dem Wareneinsatz: ' + leak.label + ' (' + nf(leak.value, 0) + ' k€).',
      rec: leak.label === 'Rabatte' ? 'Rabattdisziplin zuerst: Freigabegrenzen und Rabattmatrix prüfen – jeder Punkt weniger Rabatt wirkt direkt auf den Rohertrag; im Szenario unten die Wirkung testen.' : leak.label === 'Fracht' ? 'Frachtkosten senken: Mindestbestellwerte, Sammellieferungen und Carrier-Konditionen überprüfen.' : 'Boni- und Skontosystem überprüfen: Staffeln an Wachstum und Zahlungsverhalten koppeln.' });
  }
  return out;
} });
dash.calc('al_status', { title: 'Alarm-Status', description: 'Zielerreichung, Abstand und Monate in Folge unter Ziel je KPI, Region und Monat.', inputs: ["kpi_mo", "kpi_pm", "kpi_pr", "kpi_lg", "kpi_tr", "kpi_wa", "kpi_cu", "kpi_co", "kpi_mt", "kpi_iv", "kpi_mk", "kpi_dl"],
  fn: (kpi_mo, kpi_pm, kpi_pr, kpi_lg, kpi_tr, kpi_wa, kpi_cu, kpi_co, kpi_mt, kpi_iv, kpi_mk, kpi_dl) => {
  const src = [['mo', kpi_mo], ['pm', kpi_pm], ['pr', kpi_pr], ['lg', kpi_lg], ['tr', kpi_tr], ['wa', kpi_wa], ['cu', kpi_cu], ['co', kpi_co], ['mt', kpi_mt], ['iv', kpi_iv], ['mk', kpi_mk], ['dl', kpi_dl]];
  const names = { mo: 'Market Operation', pm: 'Productmanagement', pr: 'Pricing', lg: 'Logistik', tr: 'Training', wa: 'Warranty', cu: 'Customer', co: 'Competitor', mt: 'Marketing', iv: 'Bestand', mk: 'Markt', dl: 'Händler' };
  const grp = new Map();
  src.forEach(([bu, rows]) => { for (const r of rows) {
    if (r.dim !== undefined && r.dim !== 'Alle') continue;
    if (r.target == null || r.ok == null) continue;
    const k = [r.region, bu, r.kpi].join('|'); if (!grp.has(k)) grp.set(k, []); grp.get(k).push({ bu, r });
  } });
  const out = [];
  for (const rows of grp.values()) {
    rows.sort((a, b) => (a.r.month < b.r.month ? -1 : 1));
    let streak = 0;
    for (const { bu, r } of rows) {
      streak = r.ok ? 0 : streak + 1;
      out.push({ id: [r.region, bu, r.kpi, r.month].join('|'), region: r.region, month: r.month, bu, bu_label: names[bu], kpi: r.label, unit: r.unit, value: r.value, target: r.target, hib: r.hib, ok: r.ok,
        gap_pct: Math.abs(r.value - r.target) / Math.abs(r.target) * 100, streak });
    }
  }
  return out;
} });
dash.calc('dt_tree', { title: 'Umsatz-Treiberbaum', description: 'Zerlegung der Umsatzveränderung zum Vormonat in Aktive Händler, Aufträge je Händler und Ø Auftragswert (logarithmische Zerlegung) je Region, Detailauswahl und Monat.', inputs: ["mo_monthly"],
  fn: (mo_monthly) => {
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const N = { d: 'Aktive Händler', f: 'Aufträge je Händler', a: 'Ø Auftragswert' };
  const REC = { d: ['Händlerbasis stärken: ruhende Händler reaktivieren, gezielt neue Händler gewinnen und Abwanderungsrisiken im Händler-Register prüfen.', 'Zuwachs bei aktiven Händlern halten: neue Händler schnell auf einen regelmäßigen Bestellrhythmus bringen und die Betreuung sichern.'],
    f: ['Kaufrhythmus erhöhen: Bündelangebote, Nachbestell-Erinnerungen und Online-Bestellung ausbauen, Verfügbarkeit häufig bestellter Teile sichern.', 'Höhere Bestellfrequenz absichern: Verfügbarkeit und Lieferzeit hochhalten und Aktionen nicht überdehnen.'],
    a: ['Warenkorb stärken: Cross-Selling, Mindestbestellwerte und Preispflege prüfen.', 'Größerer Warenkorb: Preis- und Sortimentseffekt absichern und auf Rabattdisziplin achten.'] };
  const g = new Map();
  for (const r of mo_monthly) { const k = [r.region, r.dim, r.member].join('|'); if (!g.has(k)) g.set(k, []); g.get(k).push(r); }
  const out = [], sg = (v) => (v >= 0 ? '+' : '−');
  for (const rows of g.values()) {
    rows.sort((a, b) => (a.month < b.month ? -1 : 1));
    for (let i = 1; i < rows.length; i++) {
      const c = rows[i], p = rows[i - 1];
      if (!c.active_dealers || !p.active_dealers || !c.orders || !p.orders) continue;
      const R1 = c.revenue_k, R0 = p.revenue_k, D1 = c.active_dealers, D0 = p.active_dealers, F1 = c.orders / D1, F0 = p.orders / D0, A1 = R1 * 1000 / c.orders, A0 = R0 * 1000 / p.orders;
      const L = R1 === R0 ? R1 : (R1 - R0) / Math.log(R1 / R0), cd = L * Math.log(D1 / D0), cf = L * Math.log(F1 / F0), ca = L * Math.log(A1 / A0), dR = R1 - R0;
      const items = [['d', cd], ['f', cf], ['a', ca]].sort((x, y) => Math.abs(y[1]) - Math.abs(x[1])), main = items[0];
      out.push({ id: [c.region, c.dim, c.member, c.month].join('|'), region: c.region, dim: c.dim, member: c.member, month: c.month, revenue_k: R1, revenue_prev: R0, delta_k: dR,
        d: D1, d_prev: D0, f: F1, f_prev: F0, a: A1, a_prev: A0, c_d: cd, c_f: cf, c_a: ca, main: N[main[0]],
        summary: 'Umsatz ' + nf(R1, 0) + ' k€ (' + sg(dR) + nf(Math.abs(dR / R0 * 100), 1) + ' % bzw. ' + sg(dR) + nf(Math.abs(dR), 0) + ' k€ ggü. Vormonat): ' + items.map(([k, v]) => N[k] + ' ' + sg(v) + nf(Math.abs(v), 0) + ' k€').join(', ') + '; Haupttreiber ' + N[main[0]] + '.',
        rec: REC[main[0]][main[1] >= 0 ? 1 : 0] + (items.filter(([k, v]) => v < 0 && k !== main[0]).length ? ' Zusätzlich bremst: ' + items.filter(([k, v]) => v < 0 && k !== main[0]).map(([k]) => N[k]).join(', ') + '.' : '') });
    }
  }
  return out;
} });
dash.calc('dt_gp', { title: 'Rohertrag-Brücke', description: 'Veränderung des Rohertrags zum Vormonat nach Listenumsatz, Rabatten, Boni, Fracht und Wareneinsatz je Region und Monat.', inputs: ["wf_steps"],
  fn: (wf_steps) => {
  const g = new Map();
  for (const r of wf_steps) { const k = r.region + '|' + r.month; if (!g.has(k)) g.set(k, []); g.get(k).push(r); }
  const out = [], regs = ['Alle', 'DACH', 'Westeuropa', 'Südeuropa', 'Nordeuropa', 'Osteuropa'], months = [...new Set(wf_steps.map((r) => r.month))].sort();
  for (const region of regs) for (let i = 1; i < months.length; i++) {
    const c = g.get(region + '|' + months[i]), p = g.get(region + '|' + months[i - 1]);
    out.push({ id: [region, months[i], 0].join('|'), region, month: months[i], step: 0, label: 'Rohertrag Vormonat', value: p[5].value, kind: 'total' });
    for (let s = 0; s < 5; s++) out.push({ id: [region, months[i], s + 1].join('|'), region, month: months[i], step: s + 1, label: c[s].label, value: c[s].value - p[s].value, kind: 'delta' });
    out.push({ id: [region, months[i], 6].join('|'), region, month: months[i], step: 6, label: 'Rohertrag aktuell', value: c[5].value, kind: 'total' });
  }
  return out;
} });
dash.calc('ins_dtg', { title: 'Summary Rohertrag-Brücke', description: 'Kurzfazit und Handlungsempfehlung zur Rohertrag-Brücke je Region und Monat.', inputs: ["dt_gp"],
  fn: (dt_gp) => {
  const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
  const g = new Map();
  for (const r of dt_gp) { const k = r.region + '|' + r.month; if (!g.has(k)) g.set(k, []); g.get(k).push(r); }
  const out = [], sg = (v) => (v >= 0 ? '+' : '−');
  for (const [k, rows] of g) {
    const [region, month] = k.split('|'), a = rows[0].value, b = rows[6].value, d = b - a, dl = rows.slice(1, 6).sort((x, y) => Math.abs(y.value) - Math.abs(x.value));
    const REC = { 'Listenumsatz': d >= 0 ? 'Mengen- und Preiseffekt im Listenumsatz absichern, Rabatt- und Einkaufsseite im Blick behalten.' : 'Listenumsatz stützen: Absatzmenge und Preisniveau prüfen, Aktionen und Händleransprache verstärken.',
      'Rabatte': 'Rabattdisziplin: Freigabegrenzen und Rabattmatrix prüfen, Ausnahmen je Kunde nachverfolgen.', 'Boni/Skonti': 'Boni- und Skontosystem prüfen: Staffeln an Wachstum und Zahlungsverhalten koppeln.',
      'Fracht': 'Frachtkosten senken: Sammellieferungen, Mindestbestellwerte und Carrier-Konditionen prüfen.', 'Wareneinsatz': 'Einkaufskonditionen und Sortimentsmix prüfen; Preisanpassungen gegen steigende Einstandspreise absichern.' };
    out.push({ id: 'dtg', region, month, ok: d >= 0, summary: 'Rohertrag ' + nf(b, 0) + ' k€ (' + sg(d) + nf(Math.abs(d), 0) + ' k€ ggü. Vormonat): ' + dl.slice(0, 3).map((r) => r.label + ' ' + sg(r.value) + nf(Math.abs(r.value), 0) + ' k€').join(', ') + '; größter Hebel ' + dl[0].label + '.',
      rec: REC[dl[0].label] });
  }
  return out;
} });
dash.calc('pl_base', { title: 'Planungsbasis', description: 'Umsatz der letzten 12 Monate als Verteilungsschlüssel je Land, Produktgruppe, Baumuster, Monat und Altersklasse.', inputs: ["mo_monthly", "mo_country"],
  fn: (mo_monthly, mo_country) => {
  const rows = mo_monthly.filter((r) => r.region === 'Alle'), months = [...new Set(rows.map((r) => r.month))].sort();
  const tot = rows.filter((r) => r.dim === 'Alle').reduce((s, r) => s + r.revenue_k, 0), MN = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  const out = [{ id: 'Gesamt|Gesamt', dim: 'Gesamt', member: 'Gesamt', order: 0, base_k: tot, share_pct: 100 }];
  const add = (dim, items) => { const sum = items.reduce((s, x) => s + x.v, 0); items.forEach((x, i) => out.push({ id: dim + '|' + x.m, dim, member: x.m, order: i, base_k: tot * x.v / sum, share_pct: x.v / sum * 100 })); };
  add('Monat', MN.map((m, i) => ({ m, v: rows.find((r) => r.dim === 'Alle' && +r.month.slice(5, 7) === i + 1).revenue_k })));
  for (const dim of ['Baumuster', 'Alter', 'Produktgruppe']) {
    const mem = [...new Set(rows.filter((r) => r.dim === dim).map((r) => r.member))];
    add(dim, mem.map((m) => ({ m, v: rows.filter((r) => r.dim === dim && r.member === m).reduce((s, r) => s + r.revenue_k, 0) })));
  }
  add('Land', mo_country.map((c) => ({ m: c.country, v: c.revenue_k })).sort((a, b) => b.v - a.v));
  return out;
} });