(function () {
  // Version 3.0: Register Teileverfügbarkeit, Ertrag, Qualität, Luxus und Elektro – Management-Übersicht, Verlauf je Kennzahl, Detailtabellen
  const H = window.__hod, X = window.__ovx, O = window.__ov; if (!H || !X || !O) return;
  if (H.SUMKPI && H.SUMKPI.add) ['contribution_k', 'ebit_k', 'tariff_cost_k', 'accessories_rev_k', 'manufaktur_rev_k', 'lifestyle_rev_k', 'hv_repair_rev_k', 'software_rev_k', 'charging_rev_k', 'online_parts_rev_k'].forEach((k) => H.SUMKPI.add(k));
  const { el, N0, N1 } = X, NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }), N2 = NF(2);
  const SPEC = window.__v3spec || {};
  const NAME = { tv: 'Teileverfügbarkeit', er: 'Ertrag und Händler', qg: 'Qualität und Garantie', lx: 'Luxus und Kundenerlebnis', el: 'Elektro, Nachhaltigkeit, Digital' };
  const F = { pct: (v) => N1.format(v) + ' %', n1: (v) => N1.format(v), n2: (v) => N2.format(v), int: (v) => N0.format(v), days: (v) => N1.format(v) + ' Tage', eur0: (v) => N0.format(v) + ' €', eur: (v) => N2.format(v) + ' €', eur_k: (v) => N0.format(v) + ' k€', txt: (v) => String(v) };
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  // ---------- Tabellen
  function dtable(host, o) { // o: {rows, cols:[{k,l,f,t:{hib,target},bar,num}], sort, desc, limit, search, note}
    const st = { k: o.sort, desc: o.desc !== false, q: '', all: false }, wrap = el('div', 'v3t'), bar = el('div', 'toprow regrow'), tw = el('div', 'tbl-wrap'); host.append(wrap); wrap.append(bar, tw);
    const sb = el('input'); sb.placeholder = 'Suchen …'; sb.setAttribute('aria-label', 'Suchen'); sb.className = 'v3q'; if (o.search !== false) bar.append(sb); const cnt = el('span', 'mut small'); bar.append(cnt);
    const bad = (c, v, r) => (c.t && v != null ? (c.t.hib ? v < c.t.target : v > c.t.target) : c.bad ? c.bad(v, r) : false);
    function draw() {
      tw.replaceChildren(); let rs = o.rows.filter((r) => !st.q || o.cols.some((c) => String(r[c.k]).toLowerCase().includes(st.q))); if (st.k) rs = rs.slice().sort((a, b) => (a[st.k] < b[st.k] ? -1 : a[st.k] > b[st.k] ? 1 : 0) * (st.desc ? -1 : 1));
      const total = rs.length, shown = st.all || !o.limit ? rs : rs.slice(0, o.limit); cnt.textContent = total + ' Zeilen' + (o.limit && total > o.limit && !st.all ? ', zuerst ' + o.limit : '') + (o.countBad ? ' · ' + o.countBad(rs) : '');
      const t = el('table', 'tbl'); t.dataset.own = '1'; const hd = el('thead'), hr = el('tr');
      o.cols.forEach((c) => { const th = el('th', c.num === false ? null : 'num', c.l); th.style.cursor = 'pointer'; th.title = 'Sortieren'; if (st.k === c.k) th.setAttribute('aria-sort', st.desc ? 'descending' : 'ascending'); th.addEventListener('click', () => { if (st.k === c.k) st.desc = !st.desc; else { st.k = c.k; st.desc = c.num !== false; } draw(); }); hr.append(th); }); hd.append(hr); t.append(hd);
      const tb = el('tbody'); shown.forEach((r) => { const tr = el('tr'); o.cols.forEach((c) => { const v = r[c.k], td = el('td', c.num === false ? null : 'num', v == null ? '–' : c.f ? c.f(v, r) : typeof v === 'number' ? N1.format(v) : String(v)); if (bad(c, v, r)) td.className += ' v3bad'; else if (c.t && v != null) td.className += ' v3ok'; if (c.bar && v != null) { const pcw = Math.max(0, Math.min(100, v / c.bar * 100)); td.style.background = 'linear-gradient(90deg,rgba(42,111,219,.22) ' + pcw + '%,transparent ' + pcw + '%)'; } tr.append(td); }); tb.append(tr); }); t.append(tb); tw.append(t);
      if (o.limit && total > o.limit) { const b = el('button', 'bkbtn', st.all ? 'Weniger zeigen' : 'Alle ' + total + ' zeigen'); b.type = 'button'; b.style.margin = '8px 0'; b.addEventListener('click', () => { st.all = !st.all; draw(); }); tw.append(b); }
    }
    sb.addEventListener('input', () => { st.q = sb.value.trim().toLowerCase(); draw(); }); draw();
  }
  function card(host, title, note) { const c = el('div', 'card v3c'), h = el('div', 'cardhead'); h.append(el('h3', null, title)); c.append(h); if (note) c.append(el('p', 'note', note)); host.append(c); return c; }
  function multiLine(host, rows, keys, labels, fm, hdr) { // Verlauf mehrerer Reihen
    const w = host.clientWidth || 560, h = 200, m = { l: 44, r: 12, t: 14, b: 24 }; if (!window.d3) return; const months = [...new Set(rows.map((r) => r.month))].sort();
    const svg = d3.select(host).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${h}`).attr('role', 'img').attr('aria-label', hdr || 'Verlauf'), x = d3.scalePoint(months, [m.l, w - m.r]), all = keys.flatMap((k) => rows.map((r) => r[k])), y = d3.scaleLinear([Math.min(0, d3.min(all)), d3.max(all) * 1.1], [h - m.b, m.t]).nice();
    const g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)'); y.ticks(4).forEach((t) => { g.append('line').attr('x1', m.l).attr('x2', w - m.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', m.l - 5).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').text(N0.format(t)); });
    months.forEach((mo, i) => { if (i % 2 === 0) g.append('text').attr('x', x(mo)).attr('y', h - 6).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(H.mlabel(mo)); });
    keys.forEach((k, i) => { const col = dash.colors[i % dash.colors.length]; g.append('path').attr('d', d3.line().x((r) => x(r.month)).y((r) => y(r[k]))(rows)).attr('fill', 'none').attr('stroke', col).attr('stroke-width', 2); g.append('text').attr('x', w - m.r - 2).attr('y', y(rows[rows.length - 1][k]) - 5).attr('text-anchor', 'end').attr('fill', col).text(labels[i] + ' ' + fm(rows[rows.length - 1][k])); });
  }
  function hist(host, vals, o) { // Verteilung mit Zielstrich
    const w = host.clientWidth || 560, h = 180, m = { l: 36, r: 10, t: 12, b: 26 }; if (!window.d3 || !vals.length) return; const bins = d3.bin().thresholds(o.bins || 14)(vals), x = d3.scaleLinear([bins[0].x0, bins[bins.length - 1].x1], [m.l, w - m.r]), y = d3.scaleLinear([0, d3.max(bins, (b) => b.length)], [h - m.b, m.t]);
    const svg = d3.select(host).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${h}`).attr('role', 'img').attr('aria-label', o.title), g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
    bins.forEach((b) => g.append('rect').attr('x', x(b.x0) + 1).attr('width', Math.max(1, x(b.x1) - x(b.x0) - 2)).attr('y', y(b.length)).attr('height', y(0) - y(b.length)).attr('rx', 2).attr('fill', (o.hib ? b.x1 <= o.target : b.x0 >= o.target) ? 'var(--color-bad)' : dash.colors[0]).attr('opacity', 0.85).on('mousemove', (ev) => H.showTip(ev, [H.line(N1.format(b.x0) + ' bis ' + N1.format(b.x1) + ' ' + o.unit, 'tt'), H.line(b.length + ' Händler')])).on('mouseleave', () => H.hideTip()));
    g.append('line').attr('x1', x(o.target)).attr('x2', x(o.target)).attr('y1', m.t).attr('y2', h - m.b).attr('stroke', 'var(--color-fg)').attr('stroke-dasharray', '4 3'); g.append('text').attr('x', x(o.target) + 4).attr('y', m.t + 8).attr('fill', 'var(--color-fg)').text('Ziel ' + N1.format(o.target));
    x.ticks(6).forEach((t) => g.append('text').attr('x', x(t)).attr('y', h - 8).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(N0.format(t)));
  }
  // ---------- Register-Konfiguration
  const kp = (rid) => (SPEC[rid] || []).map((a) => ({ k: a[0], l: a[1], unit: a[2], hib: a[3], target: a[4], kind: a[5] }));
  const CONF = {
    tv: (b, reg) => {
      const dl = (rowsOf('tv_dealer') || []).filter((r) => reg === 'Alle' || r.region === reg), pt = rowsOf('tv_part'), sp = rowsOf('tv_supplier');
      if (dl.length) { const c = card(b, 'Bestellung bis Werkstatt je Händler', 'Je Händler: Lieferzeit der Bestellung bis in die Werkstatt, Erstanruf-Lieferquote, Eilbestellquote und Fahrzeuge, die wegen eines Teils stehen. Rot = schlechter als Ziel; Region laut Filter oben.');
        dtable(c, { rows: dl, sort: 'order_to_shop_h', limit: 15, countBad: (rs) => rs.filter((r) => r.order_to_shop_h > 36).length + ' über 36 Std.', cols: [{ k: 'name', l: 'Händler', num: false }, { k: 'region', l: 'Region', num: false }, { k: 'orders_month', l: 'Bestellungen/Monat', f: F.int }, { k: 'order_to_shop_h', l: 'Bestellung bis Werkstatt (Std.)', t: { hib: 0, target: 36 } }, { k: 'first_fill_pct', l: 'Erstanruf-Lieferquote', f: F.pct, t: { hib: 1, target: 92 } }, { k: 'rush_pct', l: 'Eilbestellquote', f: F.pct, t: { hib: 0, target: 8 } }, { k: 'vor_pct', l: 'VOR-Quote', f: F.pct, t: { hib: 0, target: 4 } }, { k: 'days_to_repair', l: 'Tage bis Reparatur', t: { hib: 0, target: 3.5 } }] }); }
      if (pt) { const c = card(b, 'Prognosegüte, Bestandsalter und Retouren je Teil', 'Je Teil (Auswahl von 60 Teilen aus zwölf Gruppen): Prognosefehler (MAPE), Alter im Lager, Retourenquote und Erstanruf-Lieferquote. Klassiker-Teile haben naturgemäß ein höheres Alter und mehr Prognosefehler.');
        dtable(c, { rows: pt, sort: 'mape_pct', limit: 15, countBad: (rs) => rs.filter((r) => r.mape_pct > 22).length + ' mit MAPE über 22 %', cols: [{ k: 'part_no', l: 'Teil', num: false }, { k: 'group', l: 'Gruppe', num: false }, { k: 'abc', l: 'ABC', num: false }, { k: 'annual_demand', l: 'Bedarf/Jahr', f: F.int }, { k: 'mape_pct', l: 'Prognosefehler MAPE', f: F.pct, t: { hib: 0, target: 22 } }, { k: 'stock_age_d', l: 'Bestandsalter (Tage)', f: F.int, t: { hib: 0, target: 140 } }, { k: 'return_pct', l: 'Retourenquote', f: F.pct, t: { hib: 0, target: 2.5 } }, { k: 'first_fill_pct', l: 'Erstanruf-Lieferquote', f: F.pct, t: { hib: 1, target: 92 } }] }); }
      if (sp) { const ss = sp.filter((r) => r.single_source), share = ss.reduce((a, r) => a + r.spend_share_pct, 0); const c = card(b, 'Lieferantenleistung und Abhängigkeit', 'Termintreue und Qualität (ppm) je Lieferant. Einzelquelle = keine Alternative qualifiziert; ' + N0.format(ss.length) + ' von ' + sp.length + ' Lieferanten sind Einzelquellen (' + N1.format(share) + ' % der Einkaufsausgaben).');
        dtable(c, { rows: sp.map((r) => Object.assign({}, r, { single: r.single_source ? 'ja' : 'nein' })), sort: 'risk_score', limit: 18, search: false, cols: [{ k: 'supplier', l: 'Lieferant', num: false }, { k: 'country', l: 'Land', num: false }, { k: 'category', l: 'Kategorie', num: false }, { k: 'spend_share_pct', l: 'Ausgabenanteil', f: F.pct }, { k: 'otd_pct', l: 'Termintreue', f: F.pct, t: { hib: 1, target: 95 } }, { k: 'ppm', l: 'Qualität (ppm)', f: F.int, t: { hib: 0, target: 120 } }, { k: 'single', l: 'Einzelquelle', num: false, bad: (v) => v === 'ja' }, { k: 'alt_share_pct', l: 'Alternative (%)', f: F.int }, { k: 'lead_time_d', l: 'Lieferzeit (Tage)', f: F.int }, { k: 'risk_score', l: 'Risiko 1–5', f: F.n1, bad: (v) => v >= 4 }] }); }
    },
    er: (b, reg) => {
      const dl = (rowsOf('er_dealer') || []).filter((r) => reg === 'Alle' || r.region === reg), m = (rowsOf('er_monthly') || []).filter((r) => r.region === reg);
      if (m.length) { const c = card(b, 'Zahlerarten im Verlauf', 'Anteil der Aufträge nach Zahler: Kunde, Garantie, intern. Ziel Kundenzahler 62 %, Garantie höchstens 27 %.'); const ch = el('div', 'chart'); c.append(ch); multiLine(ch, m, ['customer_pay_pct', 'warranty_pct', 'internal_pct'], ['Kunde', 'Garantie', 'intern'], F.pct, 'Zahlerarten'); }
      if (dl.length) { const c = card(b, 'Aftersales-Deckungsgrad je Händler', 'Deckungsgrad = Anteil der Händler-Fixkosten, den das Servicegeschäft trägt. Ziel 100 %: Balken links des Ziels (rot) tragen die Fixkosten nicht vollständig.'); const ch = el('div', 'chart'); c.append(ch); hist(ch, dl.map((r) => r.absorption_pct), { target: 100, hib: 1, unit: '%', title: 'Verteilung Deckungsgrad' });
        dtable(c, { rows: dl, sort: 'absorption_pct', desc: false, limit: 15, countBad: (rs) => rs.filter((r) => r.absorption_pct < 100).length + ' unter 100 %', cols: [{ k: 'name', l: 'Händler', num: false }, { k: 'region', l: 'Region', num: false }, { k: 'ro_month', l: 'Aufträge/Monat', f: F.int }, { k: 'absorption_pct', l: 'Deckungsgrad', f: F.pct, t: { hib: 1, target: 100 } }, { k: 'margin_per_ro', l: 'Marge je Auftrag', f: F.eur0, t: { hib: 1, target: 215 } }, { k: 'labor_parts_ratio', l: 'Lohn zu Teile', f: F.n2 }, { k: 'oe_share_pct', l: 'Originalteile-Anteil', f: F.pct, t: { hib: 1, target: 68 } }, { k: 'customer_pay_pct', l: 'Kundenzahler', f: F.pct, t: { hib: 1, target: 62 } }, { k: 'warranty_pct', l: 'Garantie', f: F.pct, t: { hib: 0, target: 27 } }] }); }
    },
    qg: (b) => {
      const is = rowsOf('qg_issue'), rc = rowsOf('qg_recall'), sr = rowsOf('qg_series');
      if (is) { const c = card(b, 'Frühwarnung aus der Feldqualität', 'Reklamationen je 1000 Fahrzeuge gegen die eigene Basis. z-Wert ab 3 gilt als Signal (rot): Das Bauteil weicht deutlich vom üblichen Niveau ab und sollte geprüft werden.');
        dtable(c, { rows: is, sort: 'z_score', limit: 12, countBad: (rs) => rs.filter((r) => r.z_score >= 3).length + ' Signale (z ≥ 3)', cols: [{ k: 'component', l: 'Bauteil', num: false }, { k: 'baseline_per_1000', l: 'Basis je 1000', f: F.n2 }, { k: 'now_per_1000', l: 'Aktuell je 1000', f: F.n2 }, { k: 'z_score', l: 'z-Wert', f: F.n1, bad: (v) => v >= 3 }, { k: 'vehicles_k', l: 'Fahrzeuge (Tsd.)', f: F.int }, { k: 'avg_cost_eur', l: 'Ø Kosten', f: F.eur0 }, { k: 'first_seen', l: 'Erstmals', num: false, f: (v) => H.mlabel(v) }] }); }
      if (rc) { const c = card(b, 'Rückrufabarbeitung', 'Anteil der betroffenen Fahrzeuge, bei denen der Rückruf umgesetzt ist. Ziel 92 %.');
        dtable(c, { rows: rc, sort: 'completed_pct', desc: false, search: false, cols: [{ k: 'campaign', l: 'Kampagne', num: false }, { k: 'severity', l: 'Schwere', num: false }, { k: 'vehicles_k', l: 'Fahrzeuge (Tsd.)', f: F.int }, { k: 'completed_pct', l: 'Umgesetzt', f: F.pct, t: { hib: 1, target: 92 }, bar: 100 }, { k: 'open_days', l: 'Offen seit (Tage)', f: F.int }, { k: 'cost_per_vehicle_eur', l: 'Kosten je Fahrzeug', f: F.eur0 }] }); }
      if (sr) { const c = card(b, 'Garantiekosten und Reklamationen je Baureihe', 'Garantiekosten je Fahrzeug (Ziel 118 €), Reklamationen je 1000 Fahrzeuge (Ziel 14,5) und Wiederholreparaturen (Ziel 3 %).');
        dtable(c, { rows: sr, sort: 'warranty_cost_per_veh', search: false, cols: [{ k: 'series', l: 'Baureihe', num: false }, { k: 'vehicles_k', l: 'Fahrzeuge (Tsd.)', f: F.int }, { k: 'warranty_cost_per_veh', l: 'Garantiekosten je Fahrzeug', f: F.eur0, t: { hib: 0, target: 118 } }, { k: 'claims_per_1000', l: 'Reklamationen je 1000', f: F.n1, t: { hib: 0, target: 14.5 } }, { k: 'repeat_repair_pct', l: 'Wiederholreparaturen', f: F.pct, t: { hib: 0, target: 3 } }] }); }
    },
    lx: (b) => {
      const sg = rowsOf('lx_segment'), cl = rowsOf('lx_classic');
      if (sg) { const c = card(b, 'Kundenwert nach Segment', 'Besitzer-Segmente im Vergleich: Kundenwert (CLV), Bindung, Umsatz je Fahrzeug, Servicepaket-Quote und Zubehör je Fahrzeug. Zweit- und Drittbesitzer binden sich deutlich schwächer als Erstbesitzer.');
        dtable(c, { rows: sg, sort: 'clv_eur', search: false, cols: [{ k: 'segment', l: 'Segment', num: false }, { k: 'vehicles_k', l: 'Fahrzeuge (Tsd.)', f: F.int }, { k: 'clv_eur', l: 'Kundenwert (CLV)', f: F.eur0, bar: 9000 }, { k: 'retention_pct', l: 'Bindung', f: F.pct }, { k: 'rev_per_vehicle_eur', l: 'Umsatz je Fahrzeug', f: F.eur0 }, { k: 'package_attach_pct', l: 'Servicepaket-Quote', f: F.pct }, { k: 'accessory_eur', l: 'Zubehör je Fahrzeug', f: F.eur0 }] }); }
      if (cl) { const c = card(b, 'Altfahrzeuge und Klassiker', 'Teile für 15- bis 30-jährige Fahrzeuge: Lieferfähigkeit fällt mit dem Alter, die Lagerkosten je Teil steigen – bei sehr geringer Nachfrage je Artikel. Die Lieferpflicht läuft je Altersgruppe aus.');
        dtable(c, { rows: cl, sort: 'age_band', desc: false, search: false, cols: [{ k: 'age_band', l: 'Alter', num: false }, { k: 'vehicles_k', l: 'Fahrzeuge (Tsd.)', f: F.int }, { k: 'sku_count', l: 'Artikel', f: F.int }, { k: 'demand_per_sku_year', l: 'Bedarf je Artikel/Jahr', f: F.int }, { k: 'fill_pct', l: 'Lieferfähigkeit', f: F.pct, t: { hib: 1, target: 88 } }, { k: 'stock_cost_per_part_eur', l: 'Lagerkosten je Teil', f: F.eur, t: { hib: 0, target: 6.5 } }, { k: 'obligation_years_left', l: 'Lieferpflicht noch (Jahre)', f: F.int }] }); }
    },
    el: (b) => {
      const es = rowsOf('el_segment');
      if (es) { const c = card(b, 'Ausgangslage Elektro und Nachhaltigkeit', 'Basiswerte aus dem Fahrzeugbestand und der Hochvolt-Kompetenz (Testdaten). Die Entwicklung steht oben bei den Kennzahlen; die Auswirkung auf den Teilebedarf zeigt die Simulation „Elektro-Übergang“.');
        dtable(c, { rows: es, search: false, cols: [{ k: 'topic', l: 'Thema', num: false }, { k: 'baseline', l: 'Ausgangswert', f: F.n1 }, { k: 'unit', l: 'Einheit', num: false }, { k: 'note', l: 'Hinweis', num: false }] }); }
    }
  };
  // ---------- Zeichnen
  const SUB = { tv: 'Verfügbarkeit, Lieferzeit, Lieferanten und Bestandsqualität – die Kennzahlen, die ein stehendes Fahrzeug verhindern.', er: 'Wie viel des Händlerergebnisses trägt der Aftersales, und womit wird es verdient?', qg: 'Garantiekosten, Reklamationen, Wiederholreparaturen, Rückrufe und Frühwarnung.', lx: 'Klassiker, Individualisierung, Servicepakete, Besitzer-Bindung und Servicekomfort.', el: 'Hochvolt, Batterie, Software, Ladeservice, Aufbereitung, CO₂ und digitale Kanäle.' };
  // Maßnahmen aus dem Playbook: Vorschläge je Kennzahl unter Ziel und Hinweise in der Management-Übersicht
  const advOf = (key) => { const d = dash.data('ma_playbook'); if (d.status !== 'ok') return null; const pre = key + '_'; return d.data.filter((r) => r.kpi_id.indexOf(pre) === 0).map((r) => ({ y: r.kpi_id.slice(pre.length), miss: r.action + ' (' + r.owner_role + ', Frist ' + r.days + ' Tage)' })); };
  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const PRIO = { A: 'hoch', B: 'mittel', C: 'niedrig' };
  function sugCard(key, host) {
    const d = dash.data('ma_suggest3'); if (d.status !== 'ok') return; const rg = H.REGSEL(), m = H.M(), rows = d.data.filter((r) => r.bu === key && r.region === rg && r.month === m).sort((a, b) => (a.prio < b.prio ? -1 : a.prio > b.prio ? 1 : 0));
    const c = el('div', 'card'), hd = el('div', 'cardhead'); hd.append(el('h3', null, 'Maßnahmenvorschläge · ' + NAME[key])); c.append(hd, el('p', 'note', 'Kennzahlen unter Ziel (' + rg + ', ' + H.mlabel(m) + ') mit Vorschlag aus dem Maßnahmen-Playbook. „Übernehmen“ legt die Maßnahme im Register Maßnahmen an.'));
    if (!rows.length) { c.append(el('p', 'note', 'Keine Kennzahl unter Ziel – keine Maßnahmen nötig.')); host.append(c); return; }
    const done = (t) => { try { return window.__hodAct.list().some((a) => a.title === t); } catch (e) { return false; } };
    const tw = el('div', 'tbl-wrap'), t = el('table', 'tbl'); t.dataset.own = '1'; const th = el('thead'), hr = el('tr'); ['Kennzahl', 'Abstand', 'Priorität', 'Vorschlag', 'Rolle', 'Frist', ''].forEach((h) => hr.append(el('th', null, h))); th.append(hr); t.append(th);
    const tb = el('tbody'); rows.forEach((r) => { const tr = el('tr'); [r.kpi, r.gap, r.prio + ' · ' + PRIO[r.prio], r.action, r.owner_role, r.days + ' Tage'].forEach((v) => tr.append(el('td', null, v))); const td = el('td', 'acts'), b = el('button', null, done(r.action) ? 'Übernommen' : 'Übernehmen'); b.type = 'button'; b.disabled = done(r.action);
      b.addEventListener('click', () => { try { window.__hodAct.open({ title: r.action, bu: r.bu_label, ref: r.kpi + ' (' + r.gap + ')', owner: r.owner_role, due: addDays(r.days), prio: r.prio, impact: r.effect }); } catch (e) { /* Register Maßnahmen nicht verfügbar */ } }); td.append(b); tr.append(td); tb.append(tr); }); t.append(tb); tw.append(t); c.append(tw); host.append(c);
  }
  function drawReg(key) {
    const panel = document.getElementById(key); if (!panel || panel.hidden) return;
    const card0 = X.slot(key); if (!card0) return; const calc = O.calc(key); X.fillKpi(card0, NAME[key], calc, advOf(key), ' · ' + SUB[key] + ' Alle Zahlen sind Testdaten (erfunden).');
    let box = document.getElementById('v3x-' + key); if (!box) { box = el('div'); box.id = 'v3x-' + key; card0.after(box); } box.replaceChildren();
    const reg = H.REGSEL(), ks = kp(key), g = el('div', 'grid');
    ks.forEach((k) => { const c = el('div', 'card'), hd = el('div', 'cardhead'); hd.append(el('h3', null, k.l)); c.append(hd, el('p', 'note', (k.target == null ? 'ohne Zielwert' : 'Ziel ' + (F[k.unit] ? F[k.unit](k.target) : N1.format(k.target)) + (k.hib ? ' (höher ist besser)' : ' (niedriger ist besser)')))); const ch = el('div', 'chart'); ch.id = 'v3c-' + key + '-' + k.k; c.append(ch); g.append(c); });
    box.append(g);
    ks.forEach((k) => { try { H.timeChart(document.getElementById('v3c-' + key + '-' + k.k), key + '_monthly', { y: k.k, unit: k.unit, target: k.target == null ? '__none' : k.target, hib: k.hib ? 1 : 0, cnt: k.kind === 'sum' ? 1 : 0, type: 'line' }); } catch (e) { /* Verlauf optional */ } });
    try { sugCard(key, box); } catch (e) { /* Vorschläge optional */ }
    const det = el('div'); box.append(det); try { CONF[key](det, reg); } catch (e) { det.append(el('p', 'note', 'Detailtabellen konnten nicht aufgebaut werden.')); }
  }
  Object.keys(NAME).forEach((k) => { window.__hodDraw[k] = () => drawReg(k); });
  setTimeout(() => { Object.assign(O.NAME, NAME); }, 200); // Übersichten für Booklet, Export und Chat
  window.__v3 = { NAME, SPEC, drawReg, CONF };
})();
