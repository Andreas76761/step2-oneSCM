// Version 3.0 (Ausbau): Vorjahresvergleich und Händler-Ranking für die älteren Register, Händler-Detail mit eigenem Verlauf und Rang-Steckbrief.
(function () {
  const H = window.__hod, V = window.__v3; if (!H || !V) return; const root = H.root;
  const { dtable, card, F, rk, RK, best } = V;
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }), N0 = NF(0), N1 = NF(1);
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const NAMES = { mo: 'Market Operation', pm: 'Productmanagement', pr: 'Pricing', lg: 'Logistik', tr: 'Training', wa: 'Warranty', cu: 'Customer', co: 'Competitor', mt: 'Marketing', mk: 'Markt', iv: 'Bestand' };
  const fm = (unit, v) => { try { return H.FMT[unit] ? H.FMT[unit](v) : N1.format(v); } catch (e) { return N1.format(v); } };
  // ---------- Vorjahresvergleich (Gesamtsicht)
  function vjBox(key, host) {
    const kp = rowsOf('kpi_' + key), py = rowsOf(key + '_py'); if (!kp || !py) return; const rg = H.REGSEL(), m = H.M(), ds = H.DS ? H.DS() : { dim: 'Alle', member: 'Alle' };
    const c = card(host, 'Vorjahresvergleich · ' + NAMES[key], ' ');
    if (ds.dim && ds.dim !== 'Alle') { c.lastChild.textContent = 'Der Vorjahresvergleich mit echten Vorjahreswerten gilt für die Gesamtsicht (Dimension „Alle“). Mit einem Detailfilter rechnet das Dashboard die Vorjahreslinie in den Diagrammen als Trendschätzung.'; return; }
    const p = py.find((r) => r.region === rg && r.month === m), rows = kp.filter((r) => r.region === rg && r.month === m && (r.dim == null || r.dim === 'Alle') && p && p[r.kpi] != null).map((r) => { const v = p[r.kpi], pp = r.unit === 'pct' || r.unit === 'pct2', d = pp ? r.value - v : (v ? (r.value / v - 1) * 100 : 0), good = r.hib == null ? null : (r.hib ? d > 0 : d < 0); return { kpi: r.label, now: r.value, py: v, d, pp, unit: r.unit, better: Math.abs(d) < 0.05 ? 'unverändert' : good === null ? '–' : good ? 'besser' : 'schlechter' }; });
    if (!rows.length) { c.lastChild.textContent = 'Für diese Auswahl liegen keine Vorjahreswerte vor.'; return; }
    const nb = rows.filter((r) => r.better === 'besser').length, nw = rows.filter((r) => r.better === 'schlechter').length;
    c.lastChild.textContent = rg + ', ' + H.mlabel(m) + ' gegenüber ' + H.mlabel(String(+m.slice(0, 4) - 1) + m.slice(4)) + ': ' + nb + ' Kennzahlen besser, ' + nw + ' schlechter als im Vorjahr. Prozent-Kennzahlen: Veränderung in Prozentpunkten, alle anderen in Prozent. Vorjahreswerte sind Testdaten.';
    dtable(c, { rows, sort: 'd', desc: false, search: false, cols: [{ k: 'kpi', l: 'Kennzahl', num: false }, { k: 'now', l: 'Aktuell', f: (v, r) => fm(r.unit, v) }, { k: 'py', l: 'Vorjahr', f: (v, r) => fm(r.unit, v) }, { k: 'd', l: 'Veränderung', f: (v, r) => (v >= 0 ? '+' : '−') + N1.format(Math.abs(v)) + (r.pp ? ' Pkt.' : ' %') }, { k: 'better', l: 'Bewertung', num: false, bad: (v) => v === 'schlechter' }] });
  }
  // ---------- Händler-Ranking je Register
  const RANK = {
    mo: { ds: 'mo_dealer', t: 'Händler-Ranking Umsatz', key: 'revenue_k', hib: 1, note: 'Rang 1 = höchster Umsatz der letzten zwölf Monate.', cols: [{ k: 'revenue_k', l: 'Umsatz (12 Monate)', f: F.eur_k }, { k: 'orders_12m', l: 'Aufträge', f: F.int }, { k: 'aov_eur', l: 'Ø Auftragswert', f: F.eur0, t: { hib: 1, target: 500 } }, { k: 'margin_pct', l: 'Marge', f: F.pct }, { k: 'growth_pct', l: 'Wachstum (3 Monate)', f: F.pct, t: { hib: 1, target: 5 } }] },
    lg: { ds: 'lg_dealer', t: 'Händler-Ranking Logistik', key: 'otif_pct', hib: 1, note: 'Rang 1 = höchste Liefertreue (OTIF).', cols: [{ k: 'otif_pct', l: 'OTIF', f: F.pct, t: { hib: 1, target: 95 } }, { k: 'fill_rate_pct', l: 'Lieferbereitschaft', f: F.pct, t: { hib: 1, target: 97 } }, { k: 'backorder_pct', l: 'Rückstandsquote', f: F.pct, t: { hib: 0, target: 3 } }, { k: 'lead_time_days', l: 'Lieferzeit (Tage)', f: F.n1, t: { hib: 0, target: 2 } }] },
    wa: { ds: 'wa_dealer', t: 'Händler-Ranking Warranty', key: 'claim_rate_pct', hib: 0, note: 'Rang 1 = niedrigste Reklamationsquote.', cols: [{ k: 'claim_rate_pct', l: 'Reklamationsquote', f: F.pct, t: { hib: 0, target: 1.2 } }, { k: 'processing_days', l: 'Bearbeitungsdauer (Tage)', f: F.n1, t: { hib: 0, target: 5 } }, { k: 'recovery_pct', l: 'Lieferantenregress', f: F.pct, t: { hib: 1, target: 60 } }] },
    tr: { ds: 'tr_dealer', t: 'Händler-Ranking Training', key: 'certified_pct', hib: 1, note: 'Rang 1 = höchster Zertifizierungsgrad.', cols: [{ k: 'certified_pct', l: 'Zertifizierungsgrad', f: F.pct, t: { hib: 1, target: 85 } }, { k: 'satisfaction', l: 'Zufriedenheit', f: F.n2, t: { hib: 1, target: 4.5 } }, { k: 'completion_pct', l: 'Abschlussquote', f: F.pct, t: { hib: 1, target: 90 } }, { k: 'participants', l: 'Teilnehmer', f: F.int }] },
    cu: { ds: 'cu_dealer', t: 'Händler-Ranking Kundenzufriedenheit', key: 'csi_score', hib: 1, note: 'Rang 1 = höchster CSI.', cols: [{ k: 'csi_score', l: 'CSI', f: F.n1, t: { hib: 1, target: 82 } }, { k: 'nps_score', l: 'NPS', f: F.n1, t: { hib: 1, target: 38 } }, { k: 'churn_pct', l: 'Abwanderung', f: F.pct, t: { hib: 0, target: 9 } }, { k: 'repeat_pct', l: 'Wiederkaufrate', f: F.pct, t: { hib: 1, target: 72 } }] },
    pr: { ds: 'pr_dealer', t: 'Händler-Ranking Preisdurchsetzung', key: 'realization_pct', hib: 1, note: 'Rang 1 = höchste Preisdurchsetzung.', cols: [{ k: 'realization_pct', l: 'Preisdurchsetzung', f: F.pct, t: { hib: 1, target: 97 } }, { k: 'margin_pct', l: 'Rohertragsmarge', f: F.pct, t: { hib: 1, target: 36 } }, { k: 'discount_pct', l: 'Rabattquote', f: F.pct, t: { hib: 0, target: 12 } }, { k: 'price_index', l: 'Preisindex', f: F.n1, t: { hib: 0, target: 102 } }] },
    mt: { ds: 'mt_dealer', t: 'Händler-Ranking Marketing', key: 'conv_pct', hib: 1, note: 'Rang 1 = höchste Lead-Conversion.', cols: [{ k: 'conv_pct', l: 'Lead-Conversion', f: F.pct, t: { hib: 1, target: 12 } }, { k: 'cac_eur', l: 'Kosten je Neukunde (CAC)', f: F.eur0, t: { hib: 0, target: 85 } }, { k: 'online_pct', l: 'Online-Anteil', f: F.pct, t: { hib: 1, target: 28 } }, { k: 'leads', l: 'Leads', f: F.int }] }
  };
  function rankBox(key, host) {
    const cfg = RANK[key]; if (!cfg) return; const all = rowsOf(cfg.ds); if (!all) return; const rg = H.REGSEL(), dl = all.filter((r) => rg === 'Alle' || r.region === rg); if (!dl.length) return;
    const c = card(host, cfg.t, cfg.note + ' Rot = schlechter als Ziel; Region laut Filter oben. ' + best(dl, cfg.key, cfg.hib) + '. Händlerdaten sind Testdaten.');
    dtable(c, { rows: rk(dl, cfg.key, cfg.hib), sort: cfg.key, desc: !cfg.hib, limit: 10, cols: [RK, { k: 'name', l: 'Händler', num: false }, { k: 'region', l: 'Region', num: false }].concat(cfg.cols) });
  }
  // ---------- Zeichnen in die älteren Register
  function drawKey(key) {
    const panel = document.getElementById(key); if (!panel || panel.hidden) return; const anchor = document.getElementById('ov-' + key); if (!anchor) return;
    let box = document.getElementById('x2-' + key); if (!box) { box = el('div'); box.id = 'x2-' + key; anchor.after(box); } box.replaceChildren();
    try { vjBox(key, box); } catch (e) { /* optional */ } try { rankBox(key, box); } catch (e) { /* optional */ }
  }
  // ---------- Händler-Detail (Register Händler)
  const MET = [['mo_dealer', 'revenue_k', 'Umsatz (12 Monate, k€)', 1, (v) => F.eur_k(v)], ['tv_dealer', 'order_to_shop_h', 'Bestellung bis Werkstatt (Std.)', 0, F.n1], ['tv_dealer', 'first_fill_pct', 'Erstanruf-Lieferquote', 1, F.pct], ['er_dealer', 'absorption_pct', 'Aftersales-Deckungsgrad', 1, F.pct], ['qg_dealer', 'claims_per_1000', 'Reklamationen je 1000 Fahrzeuge', 0, F.n1], ['lx_dealer', 'package_attach_pct', 'Servicepaket-Quote', 1, F.pct], ['el_dealer', 'hv_certified_techs', 'HV-zertifizierte Techniker', 1, F.int], ['lg_dealer', 'otif_pct', 'OTIF', 1, F.pct], ['wa_dealer', 'claim_rate_pct', 'Reklamationsquote', 0, F.pct], ['tr_dealer', 'certified_pct', 'Zertifizierungsgrad', 1, F.pct], ['cu_dealer', 'csi_score', 'Kundenzufriedenheit (CSI)', 1, F.n1], ['pr_dealer', 'realization_pct', 'Preisdurchsetzung', 1, F.pct], ['mt_dealer', 'conv_pct', 'Lead-Conversion', 1, F.pct]];
  const AREA = { mo_dealer: 'Market Operation', tv_dealer: 'Teileverfügbarkeit', er_dealer: 'Ertrag', qg_dealer: 'Qualität und Garantie', lx_dealer: 'Luxus und Kundenerlebnis', el_dealer: 'Elektro und Digital', lg_dealer: 'Logistik', wa_dealer: 'Warranty', tr_dealer: 'Training', cu_dealer: 'Customer', pr_dealer: 'Pricing', mt_dealer: 'Marketing' };
  let sel = null;
  function line(host, months, series, title) {
    const w = Math.max(280, host.clientWidth || 520), h = 190, m = { l: 48, r: 14, t: 12, b: 26 }, svg = d3.select(host).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${h}`).attr('role', 'img').attr('aria-label', title), g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
    const x = d3.scalePoint(months, [m.l, w - m.r]), vals = series.flatMap((s) => s.v), y = d3.scaleLinear([d3.min(vals) * 0.9, d3.max(vals) * 1.05], [h - m.b, m.t]).nice(4);
    y.ticks(4).forEach((t) => { g.append('line').attr('x1', m.l).attr('x2', w - m.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', m.l - 6).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').text(N1.format(t)); });
    months.forEach((mo, i) => { if (i % 2 === 0) g.append('text').attr('x', x(mo)).attr('y', h - 6).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(H.mlabel(mo)); });
    series.forEach((s, i) => { g.append('path').attr('d', d3.line().x((d, j) => x(months[j])).y((d) => y(d))(s.v)).attr('fill', 'none').attr('stroke', dash.colors[i % 6]).attr('stroke-width', 2.2); });
    return svg;
  }
  function detail(host) {
    const dealers = rowsOf('dealers'), dm = rowsOf('dealer_monthly'); if (!dealers || !dm) return; const c = card(host, 'Händler-Detail', 'Ein Händler im Überblick: Stammdaten, Umsatz- und Auftragsverlauf der letzten zwölf Monate und seine Platzierung in allen Registern mit Händler-Ranking (Rang von 300).');
    const bar = el('div', 'toprow regrow'), lab = el('label', 'flt', 'Händler '), s = el('select'); s.id = 'dl-detail-sel'; s.setAttribute('aria-label', 'Händler wählen'); dealers.slice().sort((a, b) => (a.name < b.name ? -1 : 1)).forEach((d) => s.append(new Option(d.name + ' (' + d.region + ')', d.id))); if (!sel || !dealers.some((d) => d.id === sel)) sel = dealers[0].id; s.value = sel; lab.append(s); bar.append(lab); c.append(bar);
    const body = el('div'); body.id = 'dl-detail-body'; c.append(body);
    const fill = () => {
      body.replaceChildren(); const d = dealers.find((x) => x.id === sel); if (!d) return;
      const t = el('div', 'ovtiles'); [['Region', d.region], ['Land', d.country], ['Ort', d.city], ['Händler seit', d.since], ['Zahlungsziel', d.payment_terms_days + ' Tage'], ['Segment', d.segment]].forEach(([l, v]) => { const x = el('div', 'ovtile ov-none'); x.append(el('div', 'kl', l), el('div', 'kv', String(v))); t.append(x); }); body.append(t);
      const rows = dm.filter((r) => r.id === sel).sort((a, b) => (a.month < b.month ? -1 : 1)), months = rows.map((r) => r.month), g = el('div', 'grid');
      [['Umsatz (k€)', 'revenue_k'], ['Aufträge', 'orders'], ['Marge (%)', 'margin_pct'], ['Zahlungsdauer (Tage)', 'days_to_pay']].forEach(([tt, k]) => { const cd = card(g, tt + ' je Monat', ''), ch = el('div', 'chart'); cd.append(ch); line(ch, months, [{ n: tt, v: rows.map((r) => r[k]) }], 'Verlauf ' + tt + ' von ' + d.name); if (window.__a11y) window.__a11y.table(ch, { summary: 'Verlauf ' + H.mlabel(months[0]) + ' bis ' + H.mlabel(months[months.length - 1]) + ': zuletzt ' + N1.format(rows[rows.length - 1][k]), head: ['Monat', tt], rows: rows.map((r) => [H.mlabel(r.month), N1.format(r[k])]) }); }); body.append(g);
      const prof = []; MET.forEach(([ds, k, l, hib, f]) => { const all = rowsOf(ds); if (!all) return; const me = all.find((r) => r.id === sel); if (!me) return; const rank = (arr) => 1 + arr.filter((r) => (hib ? r[k] > me[k] : r[k] < me[k])).length, reg = all.filter((r) => r.region === me.region); prof.push({ area: AREA[ds], kpi: l, v: me[k], rank: rank(all), n: all.length, rr: rank(reg), rn: reg.length, f }); });
      const c2 = card(body, 'Platzierung in den Registern', 'Rang 1 = bester Wert unter allen Händlern; in Klammern der Rang in der eigenen Region. Rot: schlechteres Drittel.');
      dtable(c2, { rows: prof, sort: 'rank', desc: false, search: false, cols: [{ k: 'area', l: 'Register', num: false }, { k: 'kpi', l: 'Kennzahl', num: false }, { k: 'v', l: 'Wert', f: (v, r) => r.f(v) }, { k: 'rank', l: 'Rang gesamt', f: (v, r) => v + ' von ' + r.n, bad: (v, r) => v > r.n * 2 / 3 }, { k: 'rr', l: 'Rang Region', f: (v, r) => v + ' von ' + r.rn, bad: (v, r) => v > r.rn * 2 / 3 }] });
    };
    s.addEventListener('change', () => { sel = s.value; fill(); }); fill();
  }
  function drawDl() {
    const panel = document.getElementById('dl'); if (!panel || panel.hidden) return; let box = document.getElementById('x2-dl');
    if (!box) { box = el('div'); box.id = 'x2-dl'; panel.append(box); }
    if (box.dataset.ready === '1') return; try { detail(box); box.dataset.ready = '1'; } catch (e) { /* optional */ }
  }
  function all() { Object.keys(NAMES).forEach(drawKey); drawDl(); }
  let tm = null; const later = (ms) => { clearTimeout(tm); tm = setTimeout(all, ms || 120); };
  dash.onData(() => later(250)); root.querySelector('.tabs').addEventListener('click', () => later(400)); window.addEventListener('hashchange', () => later(400));
  window.__dl2 = { draw: all, RANK };
})();
