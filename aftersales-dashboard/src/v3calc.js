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
