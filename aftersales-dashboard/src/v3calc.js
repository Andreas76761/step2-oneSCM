window.__v3spec = {"tv": [["vor_pct", "VOR-Quote (Fahrzeug steht wegen Teil)", "pct", 0, 4.0, "rate"], ["days_to_repair", "Tage bis zur Reparatur", "days", 0, 3.5, "rate"], ["first_fill_pct", "Erstanruf-Lieferquote", "pct", 1, 92.0, "rate"], ["rush_pct", "Eilbestellquote", "pct", 0, 8.0, "rate"], ["order_to_shop_h", "Bestellung bis Werkstatt (Std.)", "n1", 0, 36.0, "rate"], ["supplier_otd_pct", "Lieferanten-Termintreue", "pct", 1, 95.0, "rate"], ["supplier_ppm", "Lieferantenqualität (ppm)", "int", 0, 120.0, "rate"], ["single_source_pct", "Abhängigkeit von Einzelquellen", "pct", 0, 18.0, "rate"], ["return_pct", "Retourenquote", "pct", 0, 2.5, "rate"], ["stock_age_d", "Bestandsalter (Tage)", "int", 0, 140.0, "rate"], ["fc_mape", "Prognosefehler MAPE", "pct", 0, 22.0, "rate"]], "er": [["absorption_pct", "Aftersales-Deckungsgrad (Absorption)", "pct", 1, 100.0, "rate"], ["margin_per_ro", "Marge je Auftrag", "eur0", 1, 215.0, "rate"], ["labor_parts_ratio", "Verhältnis Lohn zu Teile", "score", null, null, "rate"], ["customer_pay_pct", "Anteil Kundenzahler", "pct", 1, 62.0, "rate"], ["warranty_pct", "Anteil Garantie", "pct", 0, 27.0, "rate"], ["internal_pct", "Anteil intern", "pct", null, null, "rate"], ["oe_share_pct", "Marktanteil Originalteile", "pct", 1, 68.0, "rate"], ["contribution_k", "Deckungsbeitrag (k€)", "eur_k", 1, 2150.0, "sum"], ["ebit_k", "Betriebsergebnis Aftersales (k€)", "eur_k", 1, 760.0, "sum"], ["capital_k", "Kapitalbindung (k€)", "eur_k", 0, 5900.0, "sum"], ["fx_effect_pct", "Währungseffekt auf Umsatz", "pct", null, null, "rate"], ["tariff_cost_k", "Zollkosten (k€)", "eur_k", 0, 55.0, "sum"]], "qg": [["warranty_cost_per_veh", "Garantiekosten je Fahrzeug (€)", "eur0", 0, 118.0, "rate"], ["claims_per_1000", "Reklamationen je 1000 Fahrzeuge", "n1", 0, 14.5, "rate"], ["repeat_repair_pct", "Wiederholreparaturen", "pct", 0, 3.0, "rate"], ["recall_completion_pct", "Rückrufabarbeitung", "pct", 1, 92.0, "rate"], ["early_warning_idx", "Frühwarn-Index Feldqualität", "score", 0, 1.0, "rate"], ["time_to_detect_d", "Zeit bis Erkennung eines Feldproblems (Tage)", "int", 0, 21.0, "rate"]], "lx": [["classic_fill_pct", "Klassiker-Lieferfähigkeit (15–30 Jahre)", "pct", 1, 88.0, "rate"], ["classic_stock_cost", "Lagerkosten je Klassiker-Teil (€/Jahr)", "eur", 0, 6.5, "rate"], ["accessories_rev_k", "Zubehör und Individualisierung (k€)", "eur_k", 1, 540.0, "sum"], ["manufaktur_rev_k", "Manufaktur-Teile (k€)", "eur_k", 1, 120.0, "sum"], ["lifestyle_rev_k", "Lifestyle-Umsatz (k€)", "eur_k", 1, 65.0, "sum"], ["package_attach_pct", "Servicepaket-Abschlussquote", "pct", 1, 38.0, "rate"], ["package_value", "Wert je Servicepaket (€)", "eur0", 1, 1850.0, "rate"], ["second_owner_pct", "Zweit- und Drittbesitzer-Bindung", "pct", 1, 55.0, "rate"], ["wait_days", "Wartezeit auf Werkstatttermin (Tage)", "days", 0, 5.0, "rate"], ["pickup_pct", "Hol- und Bringservice-Nutzung", "pct", 1, 24.0, "rate"], ["loaner_pct", "Ersatzwagen-Quote", "pct", 1, 30.0, "rate"]], "el": [["hv_repair_rev_k", "Hochvolt-Reparaturumsatz (k€)", "eur_k", 1, 310.0, "sum"], ["battery_damage_1000", "Batterieschäden je 1000 Elektrofahrzeuge", "n1", 0, 2.2, "rate"], ["software_rev_k", "Software- und Funktionsumsatz (k€)", "eur_k", 1, 180.0, "sum"], ["charging_rev_k", "Ladeinfrastruktur-Service (k€)", "eur_k", 1, 70.0, "sum"], ["reman_pct", "Anteil aufbereiteter Teile", "pct", 1, 12.0, "rate"], ["co2_per_shipment", "CO₂ je Sendung (kg)", "n1", 0, 3.2, "rate"], ["online_parts_rev_k", "Teile-Umsatz online (k€)", "eur_k", 1, 420.0, "sum"], ["app_booking_pct", "App-Buchungsquote", "pct", 1, 35.0, "rate"]]};
dash.calc('kpi_tv', { title: 'KPIs Teileverfügbarkeit', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je Kennzahl (Version 3.0, Testdaten).', inputs: ['tv_monthly'],
  fn: (tv_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const defs = [["vor_pct", "VOR-Quote (Fahrzeug steht wegen Teil)", "pct", 0, 4.0, 0], ["days_to_repair", "Tage bis zur Reparatur", "days", 0, 3.5, 0], ["first_fill_pct", "Erstanruf-Lieferquote", "pct", 1, 92.0, 0], ["rush_pct", "Eilbestellquote", "pct", 0, 8.0, 0], ["order_to_shop_h", "Bestellung bis Werkstatt (Std.)", "n1", 0, 36.0, 0], ["supplier_otd_pct", "Lieferanten-Termintreue", "pct", 1, 95.0, 0], ["supplier_ppm", "Lieferantenqualität (ppm)", "int", 0, 120.0, 0], ["single_source_pct", "Abhängigkeit von Einzelquellen", "pct", 0, 18.0, 0], ["return_pct", "Retourenquote", "pct", 0, 2.5, 0], ["stock_age_d", "Bestandsalter (Tage)", "int", 0, 140.0, 0], ["fc_mape", "Prognosefehler MAPE", "pct", 0, 22.0, 0]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) {
    const rows = tv_monthly.filter((r) => r.region === region);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi], target = t == null ? null : cnt ? t * SH[region] : t, pp = unit === 'pct';
        const ok = target == null || hib == null ? null : hib ? value >= target : value <= target;
        out.push({ region, month, kpi, label, unit, value, prev, target, hib: hib == null ? null : hib, ok, delta: pp ? value - prev : (prev ? (value / prev - 1) * 100 : 0), dk: pp ? 'pp' : 'rel', status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('kpi_er', { title: 'KPIs Ertrag und Händler', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je Kennzahl (Version 3.0, Testdaten).', inputs: ['er_monthly'],
  fn: (er_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const defs = [["absorption_pct", "Aftersales-Deckungsgrad (Absorption)", "pct", 1, 100.0, 0], ["margin_per_ro", "Marge je Auftrag", "eur0", 1, 215.0, 0], ["labor_parts_ratio", "Verhältnis Lohn zu Teile", "score", null, null, 0], ["customer_pay_pct", "Anteil Kundenzahler", "pct", 1, 62.0, 0], ["warranty_pct", "Anteil Garantie", "pct", 0, 27.0, 0], ["internal_pct", "Anteil intern", "pct", null, null, 0], ["oe_share_pct", "Marktanteil Originalteile", "pct", 1, 68.0, 0], ["contribution_k", "Deckungsbeitrag (k€)", "eur_k", 1, 2150.0, 1], ["ebit_k", "Betriebsergebnis Aftersales (k€)", "eur_k", 1, 760.0, 1], ["capital_k", "Kapitalbindung (k€)", "eur_k", 0, 5900.0, 1], ["fx_effect_pct", "Währungseffekt auf Umsatz", "pct", null, null, 0], ["tariff_cost_k", "Zollkosten (k€)", "eur_k", 0, 55.0, 1]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) {
    const rows = er_monthly.filter((r) => r.region === region);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi], target = t == null ? null : cnt ? t * SH[region] : t, pp = unit === 'pct';
        const ok = target == null || hib == null ? null : hib ? value >= target : value <= target;
        out.push({ region, month, kpi, label, unit, value, prev, target, hib: hib == null ? null : hib, ok, delta: pp ? value - prev : (prev ? (value / prev - 1) * 100 : 0), dk: pp ? 'pp' : 'rel', status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('kpi_qg', { title: 'KPIs Qualität und Garantie', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je Kennzahl (Version 3.0, Testdaten).', inputs: ['qg_monthly'],
  fn: (qg_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const defs = [["warranty_cost_per_veh", "Garantiekosten je Fahrzeug (€)", "eur0", 0, 118.0, 0], ["claims_per_1000", "Reklamationen je 1000 Fahrzeuge", "n1", 0, 14.5, 0], ["repeat_repair_pct", "Wiederholreparaturen", "pct", 0, 3.0, 0], ["recall_completion_pct", "Rückrufabarbeitung", "pct", 1, 92.0, 0], ["early_warning_idx", "Frühwarn-Index Feldqualität", "score", 0, 1.0, 0], ["time_to_detect_d", "Zeit bis Erkennung eines Feldproblems (Tage)", "int", 0, 21.0, 0]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) {
    const rows = qg_monthly.filter((r) => r.region === region);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi], target = t == null ? null : cnt ? t * SH[region] : t, pp = unit === 'pct';
        const ok = target == null || hib == null ? null : hib ? value >= target : value <= target;
        out.push({ region, month, kpi, label, unit, value, prev, target, hib: hib == null ? null : hib, ok, delta: pp ? value - prev : (prev ? (value / prev - 1) * 100 : 0), dk: pp ? 'pp' : 'rel', status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('kpi_lx', { title: 'KPIs Luxus und Kundenerlebnis', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je Kennzahl (Version 3.0, Testdaten).', inputs: ['lx_monthly'],
  fn: (lx_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const defs = [["classic_fill_pct", "Klassiker-Lieferfähigkeit (15–30 Jahre)", "pct", 1, 88.0, 0], ["classic_stock_cost", "Lagerkosten je Klassiker-Teil (€/Jahr)", "eur", 0, 6.5, 0], ["accessories_rev_k", "Zubehör und Individualisierung (k€)", "eur_k", 1, 540.0, 1], ["manufaktur_rev_k", "Manufaktur-Teile (k€)", "eur_k", 1, 120.0, 1], ["lifestyle_rev_k", "Lifestyle-Umsatz (k€)", "eur_k", 1, 65.0, 1], ["package_attach_pct", "Servicepaket-Abschlussquote", "pct", 1, 38.0, 0], ["package_value", "Wert je Servicepaket (€)", "eur0", 1, 1850.0, 0], ["second_owner_pct", "Zweit- und Drittbesitzer-Bindung", "pct", 1, 55.0, 0], ["wait_days", "Wartezeit auf Werkstatttermin (Tage)", "days", 0, 5.0, 0], ["pickup_pct", "Hol- und Bringservice-Nutzung", "pct", 1, 24.0, 0], ["loaner_pct", "Ersatzwagen-Quote", "pct", 1, 30.0, 0]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) {
    const rows = lx_monthly.filter((r) => r.region === region);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi], target = t == null ? null : cnt ? t * SH[region] : t, pp = unit === 'pct';
        const ok = target == null || hib == null ? null : hib ? value >= target : value <= target;
        out.push({ region, month, kpi, label, unit, value, prev, target, hib: hib == null ? null : hib, ok, delta: pp ? value - prev : (prev ? (value / prev - 1) * 100 : 0), dk: pp ? 'pp' : 'rel', status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });
dash.calc('kpi_el', { title: 'KPIs Elektro, Nachhaltigkeit, Digital', description: 'Je Region und Monat: Wert, Vormonat, Ziel und Status je Kennzahl (Version 3.0, Testdaten).', inputs: ['el_monthly'],
  fn: (el_monthly) => {
  const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15};
  const defs = [["hv_repair_rev_k", "Hochvolt-Reparaturumsatz (k€)", "eur_k", 1, 310.0, 1], ["battery_damage_1000", "Batterieschäden je 1000 Elektrofahrzeuge", "n1", 0, 2.2, 0], ["software_rev_k", "Software- und Funktionsumsatz (k€)", "eur_k", 1, 180.0, 1], ["charging_rev_k", "Ladeinfrastruktur-Service (k€)", "eur_k", 1, 70.0, 1], ["reman_pct", "Anteil aufbereiteter Teile", "pct", 1, 12.0, 0], ["co2_per_shipment", "CO₂ je Sendung (kg)", "n1", 0, 3.2, 0], ["online_parts_rev_k", "Teile-Umsatz online (k€)", "eur_k", 1, 420.0, 1], ["app_booking_pct", "App-Buchungsquote", "pct", 1, 35.0, 0]];
  const out = [];
  for (const region of ["Alle", "DACH", "Westeuropa", "Südeuropa", "Nordeuropa", "Osteuropa"]) {
    const rows = el_monthly.filter((r) => r.region === region);
    for (let i = 1; i < rows.length; i++) {
      const a = rows[i], b = rows[i - 1], month = a.month;
      for (const [kpi, label, unit, hib, t, cnt] of defs) {
        const value = a[kpi], prev = b[kpi], target = t == null ? null : cnt ? t * SH[region] : t, pp = unit === 'pct';
        const ok = target == null || hib == null ? null : hib ? value >= target : value <= target;
        out.push({ region, month, kpi, label, unit, value, prev, target, hib: hib == null ? null : hib, ok, delta: pp ? value - prev : (prev ? (value / prev - 1) * 100 : 0), dk: pp ? 'pp' : 'rel', status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
      }
    }
  }
  return out;
} });

// Maßnahmenvorschläge für die fünf neuen Register: Kennzahlen unter Ziel mit Vorschlag, Rolle und Frist aus dem Maßnahmen-Playbook (Schlüssel <Register>_<Kennzahl>).
dash.calc('ma_suggest3', { title: 'Maßnahmenvorschläge (Version 3.0)', description: 'Kennzahlen der Register Teileverfügbarkeit, Ertrag, Qualität, Luxus und Elektro unter Ziel (je Region und Monat) mit Vorschlag, Rolle und Frist aus dem Maßnahmen-Playbook.', inputs: ['kpi_tv', 'kpi_er', 'kpi_qg', 'kpi_lx', 'kpi_el', 'ma_playbook'],
  fn: (kpi_tv, kpi_er, kpi_qg, kpi_lx, kpi_el, ma_playbook) => {
    const NFC = {}, nf = (v, d) => (NFC[d] || (NFC[d] = new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }))).format(v);
    const F = { eur_k: (v) => nf(v, 0) + ' k€', pct: (v) => nf(v, 1) + ' %', int: (v) => nf(v, 0), days: (v) => nf(v, 1) + ' Tage', eur: (v) => nf(v, 2) + ' €', eur0: (v) => nf(v, 0) + ' €', score: (v) => nf(v, 2), idx: (v) => nf(v, 1), n1: (v) => nf(v, 1) };
    const LAB = { tv: 'Teileverfügbarkeit', er: 'Ertrag und Händler', qg: 'Qualität und Garantie', lx: 'Luxus und Kundenerlebnis', el: 'Elektro, Nachhaltigkeit, Digital' };
    const pb = new Map(ma_playbook.map((p) => [p.kpi_id, p])), out = [];
    [['tv', kpi_tv], ['er', kpi_er], ['qg', kpi_qg], ['lx', kpi_lx], ['el', kpi_el]].forEach(([bu, rows]) => {
      for (const r of rows) {
        if (r.ok !== false) continue; const p = pb.get(bu + '_' + r.kpi); if (!p) continue;
        const fm = F[r.unit] || ((v) => nf(v, 1)), gap = Math.abs(r.value - r.target) / Math.abs(r.target) * 100;
        out.push({ id: [r.region, r.month, bu, r.kpi].join('|'), region: r.region, month: r.month, bu, bu_label: LAB[bu], kpi: r.label, gap: fm(r.value) + ' vs. Ziel ' + fm(r.target), prio: gap > 5 ? 'A' : gap > 2 ? 'B' : 'C', action: p.action, owner_role: p.owner_role, effect: p.effect, days: p.days });
      }
    });
    return out;
  } });

// Datenqualität der Datensätze der Version 3.0: Zeilen, Vollständigkeit, Monatsabdeckung, Datenstand, leere Werte, Duplikate, Plausibilität und Ausreißer.
dash.calc('dq_checks3', { title: 'Datenqualitäts-Prüfungen (Version 3.0)', description: 'Prüfungen der neuen Datensätze: Zeilen, Vollständigkeit, Monatsabdeckung, Datenstand, leere Werte, Duplikate, Plausibilität und Ausreißer.', inputs: ["tv_monthly", "er_monthly", "qg_monthly", "lx_monthly", "el_monthly", "tv_dealer", "er_dealer", "tv_part", "tv_supplier", "qg_issue", "qg_recall", "qg_series", "lx_segment", "lx_classic", "el_segment", "sim_params", "sim_assumptions", "sim_hubs", "sim_programs", "sim_regions", "sim_sku", "sim_coupling", "ma_playbook", "qg_dealer", "lx_dealer", "el_dealer", "tv_py", "er_py", "qg_py", "lx_py", "el_py", "mo_py", "pm_py", "pr_py", "lg_py", "tr_py", "wa_py", "cu_py", "co_py", "mt_py", "mk_py", "iv_py", "mo_dealer", "lg_dealer", "wa_dealer", "tr_dealer", "cu_dealer", "pr_dealer", "mt_dealer"],
  fn: (...args) => {
    const spec = [["tv_monthly", ["region", "month"]], ["er_monthly", ["region", "month"]], ["qg_monthly", ["region", "month"]], ["lx_monthly", ["region", "month"]], ["el_monthly", ["region", "month"]], ["tv_dealer", ["id"]], ["er_dealer", ["id"]], ["tv_part", ["part_no"]], ["tv_supplier", ["supplier"]], ["qg_issue", ["component"]], ["qg_recall", ["campaign"]], ["qg_series", ["series"]], ["lx_segment", ["segment"]], ["lx_classic", ["age_band"]], ["el_segment", ["topic"]], ["sim_params", ["sim", "key"]], ["sim_assumptions", ["sim", "key"]], ["sim_hubs", ["hub"]], ["sim_programs", ["id"]], ["sim_regions", ["region"]], ["sim_sku", ["klass"]], ["sim_coupling", ["effect", "driver"]], ["ma_playbook", ["kpi_id"]], ["qg_dealer", ["id"]], ["lx_dealer", ["id"]], ["el_dealer", ["id"]], ["tv_py", ["region", "month"]], ["er_py", ["region", "month"]], ["qg_py", ["region", "month"]], ["lx_py", ["region", "month"]], ["el_py", ["region", "month"]], ["mo_py", ["region", "month"]], ["pm_py", ["region", "month"]], ["pr_py", ["region", "month"]], ["lg_py", ["region", "month"]], ["tr_py", ["region", "month"]], ["wa_py", ["region", "month"]], ["cu_py", ["region", "month"]], ["co_py", ["region", "month"]], ["mt_py", ["region", "month"]], ["mk_py", ["region", "month"]], ["iv_py", ["region", "month"]], ["mo_dealer", ["id"]], ["lg_dealer", ["id"]], ["wa_dealer", ["id"]], ["tr_dealer", ["id"]], ["cu_dealer", ["id"]], ["pr_dealer", ["id"]], ["mt_dealer", ["id"]]], REGIONS = 6, NOPCT = ['absorption_pct', 'fx_effect_pct', 'price_gap_pct', 'effect_pct', 'effect_sd', 'growth_pct', 'yoy_pct'], OPTIONAL = ['hint', 'note', 'unit']; // Spalten, die laut Datenvertrag leer sein dürfen
    const isCount = (c) => /_k$|_m$|_count$/.test(c) || ['orders_month', 'claims', 'vehicles_k', 'daily_demand', 'annual_demand', 'ppm', 'open_days', 'lead_time_d'].includes(c);
    const mi = (m) => +m.slice(0, 4) * 12 + +m.slice(5, 7);
    const data = Object.fromEntries(spec.map(([id], i) => [id, args[i]]));
    const stand = Object.values(data).filter((r) => r.length && 'month' in r[0]).flatMap((r) => r.map((x) => x.month)).sort().pop();
    const out = [];
    for (const [id, keys] of spec) {
      const rows = data[id], add = (check, bad, detail) => out.push({ id: id + '|' + check, dataset: id, check, status: bad ? 'Warnung' : 'OK', detail });
      add('Zeilen', !rows.length, rows.length.toLocaleString('de-DE') + ' Zeilen'); if (!rows.length) continue;
      const cols = Object.keys(rows[0]), monthly = 'month' in rows[0];
      if (monthly) {
        const ms = [...new Set(rows.map((r) => r.month))].sort(); let gaps = 0; for (let i = 1; i < ms.length; i++) if (mi(ms[i]) - mi(ms[i - 1]) !== 1) gaps += 1;
        add('Monatsabdeckung', gaps > 0 || ms.length < 12, ms.length + ' Monate (' + ms[0] + ' bis ' + ms[ms.length - 1] + ')' + (gaps ? ', ' + gaps + ' Lücke(n)' : ''));
        add('Datenstand', ms[ms.length - 1] !== stand, 'letzter Monat ' + ms[ms.length - 1] + (ms[ms.length - 1] === stand ? ' (aktuell)' : ', erwartet ' + stand));
        if ('region' in rows[0]) { const exp = REGIONS * ms.length; add('Vollständigkeit', rows.length !== exp, rows.length + ' von ' + exp + ' erwarteten Zeilen (' + REGIONS + ' Regionen × ' + ms.length + ' Monate)'); }
      }
      const nums = cols.filter((c) => typeof rows[0][c] === 'number'); let empty = 0, neg = 0, pct = 0;
      for (const r of rows) for (const c of cols) {
        const v = r[c]; if (v === null || v === undefined || v === '' || (typeof v === 'number' && !Number.isFinite(v))) { if (!OPTIONAL.includes(c)) empty += 1; continue; }
        if (typeof v === 'number') { if (isCount(c) && v < 0) neg += 1; if (/_pct$/.test(c) && !NOPCT.includes(c) && (v < 0 || v > 100)) pct += 1; }
      }
      add('Leere Werte', empty > 0, empty + ' leere oder ungültige Werte');
      const seen = new Set(); let dup = 0; for (const r of rows) { const k = keys.map((c) => r[c]).join('|'); if (seen.has(k)) dup += 1; else seen.add(k); }
      add('Duplikate', dup > 0, dup + ' doppelte Schlüssel (' + keys.join(' + ') + ')');
      add('Plausibilität', neg + pct > 0, pct + ' Quoten außerhalb 0–100 %, ' + neg + ' negative Mengen');
      if (monthly && 'region' in rows[0]) {
        let out3 = 0; const byR = new Map(); rows.forEach((r) => { if (!byR.has(r.region)) byR.set(r.region, []); byR.get(r.region).push(r); });
        const med = (v) => { const q = v.slice().sort((x, y) => x - y), h = q.length >> 1; return q.length % 2 ? q[h] : (q[h - 1] + q[h]) / 2; };
        for (const [, rr] of byR) for (const c of nums) { const vs = rr.map((r) => r[c]), m = med(vs), mad = med(vs.map((v) => Math.abs(v - m))); if (!mad) continue; vs.forEach((v) => { if (0.6745 * Math.abs(v - m) / mad > 3.5 * 2) out3 += 1; }); }
        add('Ausreißer', out3 > 0, out3 + ' Werte, die robust (Median und MAD) stark vom Verlauf der Region abweichen');
      }
    }
    return out;
  } });
