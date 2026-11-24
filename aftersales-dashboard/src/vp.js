(function () {
  const H = window.__hod; if (!H) return;
  const FMT = H.FMT, $ = (id) => document.getElementById(id);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const N0 = NF(0), N1 = NF(1), N2 = NF(2);
  const sg = (v) => (v >= 0 ? '+' : '−');
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029];
  const MET = [['parc_k', 'Fahrzeugbestand'], ['new_k', 'Neufahrzeuge'], ['served_k', 'Betreuter Bestand'], ['unserved_k', 'Unbetreuter Bestand'], ['owner_change_k', 'Halterwechsel'], ['scrap_k', 'Verschrottung'], ['accident_k', 'Unfall'], ['fleet_k', 'Flottenfahrzeuge']];
  const MLAB = Object.fromEntries(MET), SUMF = ['parc_k', 'new_k', 'scrap_k', 'accident_k', 'owner_change_k', 'fleet_k', 'served_k', 'unserved_k'];
  const SH = { DACH: 0.34, Westeuropa: 0.27, Südeuropa: 0.16, Nordeuropa: 0.08, Osteuropa: 0.15 };
  const fK = (v, d) => NF(d == null ? (Math.abs(v) < 100 ? 1 : 0) : d).format(v) + ' Tsd.';
  const phaseOf = (y) => (y < 2026 ? 'Ist' : y === 2026 ? 'aktuell' : 'Prognose');
  // Zeitreihe je Baureihe/Region (Baureihe „Alle“ = Summe)
  function series(data, s, rg) {
    return YEARS.map((y) => { const o = { year: y, phase: phaseOf(y) }; SUMF.forEach((f) => { o[f] = 0; });
      for (const r of data) if (r.region === rg && r.year === y && (s === 'Alle' || r.series === s)) SUMF.forEach((f) => { o[f] += r[f]; });
      o.retention_pct = o.parc_k ? o.served_k / o.parc_k * 100 : 0; return o; });
  }
  const seriesList = (data) => [...new Set(data.map((r) => r.series))];
  const fillSel = (sel, items, v) => { if (sel.dataset.n !== String(items.length)) { sel.replaceChildren(); items.forEach(([val, lab]) => { const o = el('option', null, lab); o.value = val; sel.append(o); }); sel.dataset.n = String(items.length); } sel.value = v; };
  const axisY = (g, y, MG, w) => y.ticks(4).forEach((t) => { g.append('line').attr('x1', MG.l).attr('x2', w - MG.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', MG.l - 6).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').text(N0.format(t)); });
  const mkSvg = (box, Hh) => { const w = box.clientWidth; if (!w) return null; box.replaceChildren(); const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${Hh}`); return { w, g: svg.append('g').style('font-size', 'var(--cds-font-size-caption)') }; };

  // ======================= Vehicle Parc =======================
  const vp = { m: 'parc_k', s: 'Alle', y: 2026 };
  const vpSel = $('vp-s'), vpYear = $('vp-y'), vpMet = $('vp-m');
  vpMet.addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) { vp.m = b.dataset.m; drawVp(); } });
  vpSel.addEventListener('change', () => { vp.s = vpSel.value; drawVp(); });
  vpYear.addEventListener('change', () => { vp.y = +vpYear.value; drawVp(); });
  function vpKpis(rec, prev) {
    const box = $('vp-kpi'); box.replaceChildren();
    const t = (m, l, v, sub) => { const b = el('button', 'kt' + (vp.m === m ? ' on' : '')); b.type = 'button'; b.append(el('div', 'kl', l), el('div', 'kv', v), el('div', 'ks', sub)); b.addEventListener('click', () => { vp.m = m; drawVp(); }); box.append(b); };
    t('parc_k', 'Fahrzeugbestand', fK(rec.parc_k), prev ? sg(rec.parc_k - prev.parc_k) + N1.format(Math.abs(rec.parc_k / prev.parc_k * 100 - 100)) + ' % ggü. Vorjahr' : '');
    t('new_k', 'Neufahrzeuge (Zugang)', fK(rec.new_k), N1.format(rec.new_k / rec.parc_k * 100) + ' % vom Bestand');
    t('served_k', 'Betreuter Bestand', fK(rec.served_k), 'Retention ' + N1.format(rec.retention_pct) + ' % × Bestand');
    t('unserved_k', 'Unbetreuter Bestand', fK(rec.unserved_k), N1.format(rec.unserved_k / rec.parc_k * 100) + ' % vom Bestand');
    t('owner_change_k', 'Halterwechsel', fK(rec.owner_change_k), N1.format(rec.owner_change_k / rec.parc_k * 100) + ' % vom Bestand');
    t('scrap_k', 'Verschrottung (Abgang)', fK(rec.scrap_k), N1.format(rec.scrap_k / rec.parc_k * 100) + ' % vom Bestand');
    t('accident_k', 'Unfall (Totalschaden)', fK(rec.accident_k), N1.format(rec.accident_k / rec.parc_k * 100) + ' % vom Bestand');
    t('fleet_k', 'Flottenfahrzeuge', fK(rec.fleet_k), N1.format(rec.fleet_k / rec.parc_k * 100) + ' % vom Bestand');
  }
  function drawVp() {
    const data = H.ready($('ch-vp'), 'vp_parc'); if (!data) return;
    const rg = H.REGSEL(), m = vp.m, ser = seriesList(data);
    fillSel(vpSel, [['Alle', 'Alle Baureihen'], ...ser.map((s) => [s, s])], vp.s); fillSel(vpYear, YEARS.map((y) => [y, y + ' (' + phaseOf(y) + ')']), vp.y);
    vpMet.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === m)));
    const rec = series(data, vp.s, rg), cur = rec.find((r) => r.year === vp.y), prev = rec.find((r) => r.year === vp.y - 1);
    vpKpis(cur, prev);
    $('vp-t1').textContent = MLAB[m] + ' 2020–2029 · ' + (vp.s === 'Alle' ? 'alle Baureihen' : vp.s) + ' · ' + (rg === 'Alle' ? 'alle Regionen' : rg);
    // 1) Verlauf
    $('ch-vp').dataset.vj = '1'; const vjOn = window.__copt && window.__copt.get('ch-vp').vj;
    const c1 = mkSvg($('ch-vp'), 290);
    if (c1) { const { w, g } = c1, MG = { t: 14, r: 14, b: 34, l: 56 }, Hh = 290, stacked = m === 'parc_k';
      const x = d3.scaleBand(YEARS, [MG.l, w - MG.r]).padding(0.25), ymax = d3.max(rec, (r) => r[m]) * 1.12, y = d3.scaleLinear([0, ymax], [Hh - MG.b, MG.t]);
      axisY(g, y, MG, w);
      YEARS.forEach((yr) => { const r = rec.find((q) => q.year === yr), fc = yr > 2026, op = fc ? 0.55 : 1, sel = yr === vp.y;
        const tip = (ev) => H.showTip(ev, [H.line(yr + ' · ' + phaseOf(yr), 'tt'), H.line(MLAB[m] + ': ' + fK(r[m])), H.line('Bestand ' + fK(r.parc_k) + ' · betreut ' + fK(r.served_k) + ' (' + N1.format(r.retention_pct) + ' %)', 'tt')]);
        if (stacked) { g.append('rect').attr('x', x(yr)).attr('width', x.bandwidth()).attr('y', y(r.served_k)).attr('height', y(0) - y(r.served_k)).attr('fill', dash.colors[0]).attr('fill-opacity', op).on('mousemove', tip).on('mouseleave', () => H.hideTip()).on('click', () => { vp.y = yr; drawVp(); });
          g.append('rect').attr('x', x(yr)).attr('width', x.bandwidth()).attr('y', y(r.parc_k)).attr('height', y(r.served_k) - y(r.parc_k)).attr('rx', 2).attr('fill', 'var(--cds-chart-muted, #9aa0a8)').attr('fill-opacity', op * 0.75).on('mousemove', tip).on('mouseleave', () => H.hideTip()).on('click', () => { vp.y = yr; drawVp(); }); }
        else g.append('rect').attr('x', x(yr)).attr('width', x.bandwidth()).attr('y', y(r[m])).attr('height', y(0) - y(r[m])).attr('rx', 2).attr('fill', dash.colors[0]).attr('fill-opacity', op).attr('stroke', sel ? 'var(--color-fg)' : 'none').on('mousemove', tip).on('mouseleave', () => H.hideTip()).on('click', () => { vp.y = yr; drawVp(); });
        g.append('text').attr('x', x(yr) + x.bandwidth() / 2).attr('y', y(r[m]) - 4).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg)').text(N0.format(r[m]));
        const pv = vjOn && rec.find((q) => q.year === yr - 1);
        if (pv && pv[m]) { const dv = (r[m] / pv[m] - 1) * 100; g.append('text').attr('x', x(yr) + x.bandwidth() / 2).attr('y', y(r[m]) - 16).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').style('font-size', '10px').text((dv >= 0 ? '+' : '−') + N1.format(Math.abs(dv)) + ' % VJ'); }
        g.append('text').attr('x', x(yr) + x.bandwidth() / 2).attr('y', Hh - 18).attr('text-anchor', 'middle').attr('fill', sel ? 'var(--color-fg)' : 'var(--color-fg-muted)').style('font-weight', sel ? 600 : 400).text(yr);
        g.append('text').attr('x', x(yr) + x.bandwidth() / 2).attr('y', Hh - 5).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(phaseOf(yr)); });
      g.append('text').attr('class', 'lgd').attr('x', 4).attr('y', 10).attr('fill', 'var(--color-fg-muted)').text('Tsd. Fahrzeuge' + (stacked ? ' · blau = betreut · grau = unbetreut' : '') + ' · helle Balken = Prognose'); }
    // 2) Bestandsbrücke
    const c2 = mkSvg($('ch-vp-b'), 250);
    if (c2) { const { w, g } = c2, Hh = 250, MG = { t: 22, r: 14, b: 40, l: 56 }, start = prev ? prev.parc_k : cur.parc_k - cur.new_k + cur.scrap_k + cur.accident_k;
      const steps = [{ l: 'Bestand ' + (vp.y - 1), v: start, t: 1 }, { l: '+ Neufahrzeuge', v: cur.new_k }, { l: '− Verschrottung', v: -cur.scrap_k }, { l: '− Unfall', v: -cur.accident_k }, { l: 'Bestand ' + vp.y, v: cur.parc_k, t: 1 }];
      let run = 0; steps.forEach((s) => { if (s.t) { s.lo = 0; s.hi = s.v; run = s.v; } else { s.lo = Math.min(run, run + s.v); s.hi = Math.max(run, run + s.v); run += s.v; } });
      const lo = Math.min(...steps.map((s) => s.t ? s.v : s.lo)) * 0.9, y = d3.scaleLinear([lo, d3.max(steps, (s) => s.hi) * 1.04], [Hh - MG.b, MG.t]), x = d3.scaleBand(steps.map((s) => s.l), [MG.l, w - MG.r]).padding(0.3);
      axisY(g, y, MG, w);
      steps.forEach((s) => { const top = y(s.hi), bot = y(Math.max(s.lo, lo));
        g.append('rect').attr('x', x(s.l)).attr('width', x.bandwidth()).attr('y', top).attr('height', Math.max(1, bot - top)).attr('rx', 3).attr('fill', s.t ? dash.colors[0] : s.v >= 0 ? dash.colors[2] || '#2b9a66' : H.CRIT).attr('fill-opacity', s.t ? 0.9 : 0.8)
          .on('mousemove', (ev) => H.showTip(ev, [H.line(s.l, 'tt'), H.line((s.t ? '' : sg(s.v)) + fK(Math.abs(s.v)))])).on('mouseleave', () => H.hideTip());
        g.append('text').attr('x', x(s.l) + x.bandwidth() / 2).attr('y', top - 4).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg)').text((s.t ? '' : sg(s.v)) + N1.format(Math.abs(s.v)));
        g.append('text').attr('x', x(s.l) + x.bandwidth() / 2).attr('y', Hh - 20).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(s.l); });
      g.append('text').attr('class', 'lgd').attr('x', 4).attr('y', 10).attr('fill', 'var(--color-fg-muted)').text('Tsd. Fahrzeuge · Halterwechsel ändert den Bestand nicht (' + N1.format(cur.owner_change_k) + ' Tsd. Wechsel)'); }
    // 3) Heatmap Baureihe × Jahr
    const c3 = (() => { const box = $('ch-vp-h'), w = box.clientWidth; if (!w) return null; box.replaceChildren(); return { box, w }; })();
    if (c3) { const rows = ser.map((s) => ({ s, rec: series(data, s, rg) })), L = 120, RH = 24, T = 26, cw = Math.max(40, (c3.w - L - 8) / YEARS.length), Hh = T + rows.length * RH + 6;
      const mx = d3.max(rows, (r) => d3.max(r.rec, (q) => q[m])) || 1, svg = d3.select(c3.box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${Math.max(c3.w, L + cw * YEARS.length + 8)} ${Hh}`), g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
      YEARS.forEach((yr, j) => g.append('text').attr('x', L + j * cw + cw / 2).attr('y', 16).attr('text-anchor', 'middle').attr('fill', yr === vp.y ? 'var(--color-fg)' : 'var(--color-fg-muted)').style('font-weight', yr === vp.y ? 600 : 400).text(yr + (yr > 2026 ? ' P' : '')));
      rows.forEach((r, i) => { g.append('text').attr('x', L - 6).attr('y', T + i * RH + RH / 2).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').style('font-weight', r.s === vp.s ? 600 : 400).style('cursor', 'pointer').text(r.s).on('click', () => { vp.s = vp.s === r.s ? 'Alle' : r.s; drawVp(); });
        r.rec.forEach((q, j) => { const v = q[m];
          g.append('rect').attr('x', L + j * cw + 1).attr('y', T + i * RH + 1).attr('width', cw - 2).attr('height', RH - 2).attr('rx', 3).attr('fill', dash.colors[0]).attr('fill-opacity', 0.08 + 0.8 * Math.sqrt(v / mx)).attr('stroke', q.year === vp.y ? 'var(--color-fg)' : 'none')
            .on('mousemove', (ev) => H.showTip(ev, [H.line(r.s + ' · ' + q.year + ' (' + q.phase + ')', 'tt'), H.line(MLAB[m] + ': ' + fK(v)), H.line('Retention ' + N1.format(q.retention_pct) + ' %', 'tt')])).on('mouseleave', () => H.hideTip()).on('click', () => { vp.y = q.year; drawVp(); });
          g.append('text').attr('x', L + j * cw + cw / 2).attr('y', T + i * RH + RH / 2).attr('dy', '0.32em').attr('text-anchor', 'middle').attr('fill', 'var(--color-fg)').style('pointer-events', 'none').text(N0.format(v)); }); }); }
    // Summary
    const a25 = rec.find((r) => r.year === 2025), a29 = rec.find((r) => r.year === 2029), dP = (a29.parc_k / a25.parc_k - 1) * 100, dS = (a29.served_k / a25.served_k - 1) * 100;
    const neuNet = cur.new_k - cur.scrap_k - cur.accident_k;
    $('vp-sum').textContent = (vp.s === 'Alle' ? 'Alle Baureihen' : vp.s) + ', ' + (rg === 'Alle' ? 'alle Regionen' : rg) + ': Bestand ' + vp.y + ' ' + fK(cur.parc_k) + ' (davon betreut ' + fK(cur.served_k) + ', unbetreut ' + fK(cur.unserved_k) + '). Netto-Zugang ' + sg(neuNet) + fK(Math.abs(neuNet)) + ' (Neu ' + fK(cur.new_k) + ' − Verschrottung ' + fK(cur.scrap_k) + ' − Unfall ' + fK(cur.accident_k) + '). Bis 2029 ' + sg(dP) + N1.format(Math.abs(dP)) + ' % Bestand und ' + sg(dS) + N1.format(Math.abs(dS)) + ' % betreuter Bestand gegenüber 2025.';
    $('vp-rec').textContent = dS < -3 ? 'Der betreute Bestand schrumpft – Retention (Servicepakete, Erinnerungen, Konnektivität) und Neufahrzeug-Bindung ab dem ersten Service priorisieren.' : cur.unserved_k / cur.parc_k > 0.35 ? 'Hoher unbetreuter Anteil – Rückgewinnung über Halterwechsel-Ansprache, Flottenverträge und Preisaktionen für ältere Fahrzeuge prüfen.' : 'Bestand stabil – Retention halten und Kapazitäten an die Altersstruktur anpassen.';
  }
  window.__hodDraw.vp = drawVp;

  // ======================= Parc-Forecast (Simulation) =======================
  const pf = { s: 'Alle', d: -20, r: 0 };
  const pfSel = $('pf-s'), sD = $('pf-d'), sR = $('pf-r');
  pfSel.addEventListener('change', () => { pf.s = pfSel.value; drawPf(); });
  sD.addEventListener('input', () => { pf.d = +sD.value; drawPf(); }); sR.addEventListener('input', () => { pf.r = +sR.value; drawPf(); });
  $('pf-presets').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) { pf.d = +b.dataset.d; pf.r = +b.dataset.r; sD.value = pf.d; sR.value = pf.r; drawPf(); } });
  // Kennzahl-Basis (letzte 12 Monate) je Region
  function kpiBase(rg) {
    const mo = rowsOf('mo_monthly'), pm = rowsOf('pm_monthly'), wa = rowsOf('wa_monthly'), tr = rowsOf('tr_monthly'), iv = rowsOf('iv_monthly'), lg = rowsOf('lg_carrier'), ws = rowsOf('ws_segments');
    if (!mo || !pm || !wa || !tr || !iv || !lg || !ws) return null;
    const months = [...new Set(mo.map((r) => r.month))].sort().slice(-12), in12 = new Set(months), lastM = months[months.length - 1];
    const all = (r) => r.region === rg && in12.has(r.month) && (r.dim == null || r.dim === 'Alle');
    const sum = (rows, f) => rows.filter(all).reduce((s, r) => s + r[f], 0), avg = (rows, f) => { const x = rows.filter(all); return x.reduce((s, r) => s + r[f], 0) / (x.length || 1); };
    const ivr = iv.filter((r) => r.region === rg && r.month === lastM)[0] || {};
    return { rev: sum(mo, 'revenue_k'), ord: sum(mo, 'orders'), dlr: avg(mo, 'active_dealers'), gm: avg(pm, 'gross_margin_pct'), claims: sum(wa, 'claims'), claimc: sum(wa, 'claim_cost_k'), part: sum(tr, 'participants'), stock: ivr.stock_value_k || 0, cover: ivr.days_cover || 0,
      ship: lg.filter((r) => r.region === rg).reduce((s, r) => s + r.shipments, 0), ws12: (s) => ws.filter((r) => in12.has(r.month) && (s === 'Alle' || r.series === s)).reduce((a, r) => ({ lohn: a.lohn + r.lohn_k, teile: a.teile + r.teile_k }), { lohn: 0, teile: 0 }) };
  }
  function pfPath(data, rg, s, d, r) {
    const rec = series(data, s, rg), tot26 = series(data, 'Alle', rg), by = (y) => rec.find((r) => r.year === y);
    // Szenario-Pfad 2025 → 2029
    const Y = [2025, 2026, 2027, 2028, 2029], base = Y.map(by), scn = [];
    Y.forEach((y, i) => { const b = base[i], k = (y - 2025) / 4, prevS = scn[i - 1], p0 = by(y - 1);
      if (i === 0) { scn.push({ year: y, parc_k: b.parc_k, served_k: b.served_k, retention_pct: b.retention_pct, new_k: b.new_k, scrap_k: b.scrap_k, accident_k: b.accident_k }); return; }
      const P = base[0].parc_k * Math.pow(1 + d / 100, k), sr = b.scrap_k / p0.parc_k, ar = b.accident_k / p0.parc_k, scr = sr * prevS.parc_k, acc = ar * prevS.parc_k, ret = b.retention_pct + r * k;
      scn.push({ year: y, parc_k: P, scrap_k: scr, accident_k: acc, new_k: P - prevS.parc_k + scr + acc, retention_pct: ret, served_k: P * ret / 100 }); });
    const b29 = base[4], s29 = scn[4];
    return { rec, tot26, by, Y, base, scn, b29, s29 };
  }
  function pfItems(rg, s, P) {
    const { tot26, by, b29, s29 } = P;
    const K = kpiBase(rg); if (!K) return null;
    const cohort = tot26.find((r) => r.year === 2026).served_k ? by(2026).served_k / tot26.find((r) => r.year === 2026).served_k : 1, ws = K.ws12(s), wsf = rg === 'Alle' ? 1 : SH[rg] || 1;
    const rb = b29.served_k / by(2026).served_k, rs = s29.served_k / by(2026).served_k;
    const f = (eps) => [1 + eps * (rb - 1), 1 + eps * (rs - 1)];
    const items = [];
    const add = (name, bu, v, eps, unit, hib, note) => { const [fb, fs] = f(eps); items.push({ name, bu, cur: v, base: v * fb, scn: v * fs, unit, hib, eps, note }); };
    add('Netto-Teileumsatz', 'Market Operation', K.rev * cohort, 1, 'eur_k', 1, 'Umsatz folgt dem betreuten Bestand 1:1');
    add('Aufträge', 'Market Operation', K.ord * cohort, 1, 'int', 1, 'Aufträge je betreutem Fahrzeug konstant');
    add('Aktive Händler', 'Market Operation', K.dlr * cohort, 0.35, 'int', 1, 'Händlernetz reagiert verzögert (Konsolidierung)');
    add('Werkstatt-Lohnumsatz', 'Workshop', ws.lohn * wsf, 1, 'eur_k', 1, 'Lohn je betreutem Fahrzeug konstant');
    add('Werkstatt-Teileumsatz', 'Workshop', ws.teile * wsf, 1, 'eur_k', 1, 'Teile je betreutem Fahrzeug konstant');
    add('Sendungen', 'Logistik', K.ship * cohort, 0.9, 'int', 1, 'Mengen folgen Nachfrage, Mindestfrequenz bleibt');
    add('Garantiefälle', 'Warranty', K.claims * cohort, 1.1, 'int', 0, 'Weniger Neufahrzeuge → überproportional weniger Garantie');
    add('Garantiekosten', 'Warranty', K.claimc * cohort, 1.1, 'eur_k', 0, 'wie Garantiefälle');
    add('Schulungsteilnehmer', 'Training', K.part * cohort, 0.5, 'int', 1, 'Schulungsbedarf sinkt nur teilweise (Pflichtthemen)');
    add('Lagerwert', 'Bestand', K.stock * cohort, 0.6, 'eur_k', 0, 'Sortimentsbreite hält Lager, Menge sinkt unterproportional');
    // abgeleitete Kennzahlen
    const rv = items[0], dg = 0.04 * 100;
    const gmB = K.gm + dg * (rb - 1), gmS = K.gm + dg * (rs - 1);
    items.push({ name: 'Rohertragsmarge (Pkt.)', bu: 'Pricing', cur: K.gm, base: gmB, scn: gmS, unit: 'pct', hib: 1, pts: true, note: 'Fixkostenwirkung: −0,04 Pkt. je −1 % betreuter Bestand' });
    items.push({ name: 'Rohertrag', bu: 'Pricing', cur: rv.cur * K.gm / 100, base: rv.base * gmB / 100, scn: rv.scn * gmS / 100, unit: 'eur_k', hib: 1, note: 'Umsatz × Marge' });
    const stk = items[9], cv = K.cover;
    items.push({ name: 'Lagerreichweite (Tage)', bu: 'Bestand', cur: cv, base: cv * (stk.base / stk.cur) / (rv.base / rv.cur), scn: cv * (stk.scn / stk.cur) / (rv.scn / rv.cur), unit: 'days', hib: 0, note: 'Lager sinkt langsamer als Nachfrage → Reichweite steigt' });
    return items;
  }
  window.__pfCalc = (rg, s, d, r) => { const data = rowsOf('vp_parc'); if (!data) return null; const P = pfPath(data, rg, s, d, r); return Object.assign({}, P, { items: pfItems(rg, s, P) }); };
  function drawPf() {
    const data = H.ready($('ch-pf'), 'vp_parc'); if (!data) return;
    const rg = H.REGSEL(), ser = seriesList(data);
    fillSel(pfSel, [['Alle', 'Alle Baureihen'], ...ser.map((s) => [s, s])], pf.s); sD.value = pf.d; sR.value = pf.r;
    $('pf-d-v').textContent = sg(pf.d) + N0.format(Math.abs(pf.d)).replace('−', '') + ' %'; $('pf-r-v').textContent = sg(pf.r) + N1.format(Math.abs(pf.r)) + ' Pkt.';
    const { rec, tot26, by, Y, base, scn, b29, s29 } = pfPath(data, rg, pf.s, pf.d, pf.r);
    // 1) Bestandspfad
    const c1 = mkSvg($('ch-pf'), 280);
    if (c1) { const { w, g } = c1, Hh = 280, MG = { t: 22, r: 90, b: 28, l: 56 }, all = [...base, ...scn].flatMap((r) => [r.parc_k, r.served_k]);
      const x = d3.scalePoint(Y, [MG.l + 10, w - MG.r]), y = d3.scaleLinear([Math.min(...all) * 0.85, Math.max(...all) * 1.05], [Hh - MG.b, MG.t]);
      axisY(g, y, MG, w); Y.forEach((yr) => g.append('text').attr('x', x(yr)).attr('y', Hh - 10).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(yr));
      const line = (arr, f, color, dashA, label) => { g.append('path').datum(arr).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2.2).attr('stroke-dasharray', dashA).attr('d', d3.line().x((r) => x(r.year)).y((r) => y(r[f])));
        g.selectAll(null).data(arr).join('circle').attr('cx', (r) => x(r.year)).attr('cy', (r) => y(r[f])).attr('r', 3.5).attr('fill', color).on('mousemove', (ev, r) => H.showTip(ev, [H.line(label + ' ' + r.year, 'tt'), H.line(fK(r[f]))])).on('mouseleave', () => H.hideTip());
        const e = arr[arr.length - 1]; g.append('text').attr('x', x(e.year) + 8).attr('y', y(e[f])).attr('dy', '0.32em').attr('fill', color).text(label); };
      line(base, 'parc_k', dash.colors[0], '5 4', 'Bestand Basis'); line(scn, 'parc_k', dash.colors[0], null, 'Bestand Szen.'); line(base, 'served_k', dash.colors[1], '5 4', 'betreut Basis'); line(scn, 'served_k', dash.colors[1], null, 'betreut Szen.');
      g.append('text').attr('class', 'lgd').attr('x', 4).attr('y', 10).attr('fill', 'var(--color-fg-muted)').text('Tsd. Fahrzeuge · gestrichelt = Basisprognose · durchgezogen = Szenario'); }
    // 2) Zu-/Abgänge
    const c2 = mkSvg($('ch-pf-f'), 250);
    if (c2) { const { w, g } = c2, Hh = 250, MG = { t: 22, r: 14, b: 30, l: 56 }, Y2 = Y.slice(1), keys = [['bn', 'Neu Basis', 'var(--cds-chart-muted, #9aa0a8)'], ['sn', 'Neu Szenario', dash.colors[0]], ['sa', 'Abgänge Szenario', H.CRIT]];
      const val = (yr, k) => { const i = Y.indexOf(yr); return k === 'bn' ? base[i].new_k : k === 'sn' ? scn[i].new_k : scn[i].scrap_k + scn[i].accident_k; };
      const x = d3.scaleBand(Y2, [MG.l, w - MG.r]).paddingInner(0.25), xi = d3.scaleBand(keys.map((k) => k[0]), [0, x.bandwidth()]).padding(0.08), y = d3.scaleLinear([Math.min(0, ...Y2.flatMap((yr) => keys.map((k) => val(yr, k[0])))), d3.max(Y2.flatMap((yr) => keys.map((k) => val(yr, k[0])))) * 1.15], [Hh - MG.b, MG.t]);
      axisY(g, y, MG, w);
      Y2.forEach((yr) => { keys.forEach(([k, lab, col]) => { const v = val(yr, k); g.append('rect').attr('x', x(yr) + xi(k)).attr('width', xi.bandwidth()).attr('y', y(Math.max(0, v))).attr('height', Math.abs(y(v) - y(0))).attr('rx', 2).attr('fill', col).attr('fill-opacity', 0.85)
        .on('mousemove', (ev) => H.showTip(ev, [H.line(lab + ' ' + yr, 'tt'), H.line(fK(v))])).on('mouseleave', () => H.hideTip());
        g.append('text').attr('x', x(yr) + xi(k) + xi.bandwidth() / 2).attr('y', y(Math.max(0, v)) - 3).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg)').text(N0.format(v)); });
        g.append('text').attr('x', x(yr) + x.bandwidth() / 2).attr('y', Hh - 10).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(yr); });
      keys.forEach(([k, lab, col], i) => { g.append('rect').attr('class', 'lgd').attr('x', MG.l + i * 150).attr('y', 2).attr('width', 10).attr('height', 10).attr('rx', 2).attr('fill', col); g.append('text').attr('class', 'lgd').attr('x', MG.l + i * 150 + 14).attr('y', 11).attr('fill', 'var(--color-fg-muted)').text(lab); }); }
    // Tabelle Bestandspfad
    const tp = $('tb-pf-p'); tp.querySelector('thead').replaceChildren(); tp.querySelector('tbody').replaceChildren();
    const hr = el('tr'); ['Bestand in Tsd.', ...Y.map(String)].forEach((t, i) => hr.append(el('th', i ? 'num' : null, t))); tp.querySelector('thead').append(hr);
    const trow = (lab, arr, f, bold) => { const tr = el('tr', bold ? 'tot' : null); tr.append(el('td', null, lab)); arr.forEach((r) => tr.append(el('td', 'num', N1.format(r[f])))); tp.querySelector('tbody').append(tr); };
    trow('Fahrzeugbestand – Basis', base, 'parc_k'); trow('Fahrzeugbestand – Szenario', scn, 'parc_k', true); trow('Betreuter Bestand – Basis', base, 'served_k'); trow('Betreuter Bestand – Szenario (Retention × Bestand)', scn, 'served_k', true);
    trow('Unbetreuter Bestand – Szenario', scn.map((r) => ({ unserved_k: r.parc_k - r.served_k })), 'unserved_k'); trow('Neufahrzeuge – Basis', base, 'new_k'); trow('Neufahrzeuge – Szenario (erforderlich)', scn, 'new_k', true);
    const tr2 = el('tr'); tr2.append(el('td', null, 'Retention Szenario in %')); scn.forEach((r) => tr2.append(el('td', 'num', N1.format(r.retention_pct)))); tp.querySelector('tbody').append(tr2);
    // Auswirkungen je Kennzahl
    const items = pfItems(rg, pf.s, { tot26, by, b29, s29 }); if (!items) return;
    // Anzeige
    const tb = $('tb-pf-k'); tb.querySelector('tbody').replaceChildren();
    const fmtV = (it, v) => (it.unit === 'pct' ? N1.format(v) + ' %' : it.unit === 'days' ? N1.format(v) + ' Tage' : it.unit === 'eur_k' ? N0.format(v) + ' k€' : N0.format(v));
    items.forEach((it) => { const d = it.scn - it.base, dp = it.pts ? d : (it.base ? d / it.base * 100 : 0), good = it.hib ? d >= 0 : d <= 0, tr = el('tr');
      tr.append(el('td', null, it.name), el('td', 'mut', it.bu), el('td', 'num', fmtV(it, it.cur)), el('td', 'num', fmtV(it, it.base)), el('td', 'num', fmtV(it, it.scn)), el('td', 'num ' + (Math.abs(dp) < 0.05 ? '' : good ? 'good' : 'bad'), sg(dp) + N1.format(Math.abs(dp)) + (it.pts ? ' Pkt.' : ' %')), el('td', 'mut small', it.note || '')); tb.querySelector('tbody').append(tr); it.dp = dp; it.good = good; });
    // Balken Δ %
    const c3 = (() => { const box = $('ch-pf-i'), w = box.clientWidth; if (!w) return null; box.replaceChildren(); return { box, w }; })();
    if (c3) { const rows = items.filter((i) => !i.pts), RH = 24, L = 175, Hh = 24 + rows.length * RH, svg = d3.select(c3.box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${c3.w} ${Hh}`), g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
      const mx = Math.max(5, d3.max(rows, (r) => Math.abs(r.dp))) * 1.15, x = d3.scaleLinear([-mx, mx], [L + 60, c3.w - 56]);
      g.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', 6).attr('y2', Hh - 6).attr('stroke', 'var(--color-fg-muted)');
      rows.forEach((r, i) => { const cy = 18 + i * RH; g.append('text').attr('x', L - 8).attr('y', cy).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').text(r.name);
        g.append('rect').attr('x', Math.min(x(0), x(r.dp))).attr('y', cy - 8).attr('width', Math.max(1, Math.abs(x(r.dp) - x(0)))).attr('height', 16).attr('rx', 3).attr('fill', r.good ? dash.colors[2] || '#2b9a66' : H.CRIT).attr('fill-opacity', 0.85)
          .on('mousemove', (ev) => H.showTip(ev, [H.line(r.name + ' (' + r.bu + ')', 'tt'), H.line(sg(r.dp) + N1.format(Math.abs(r.dp)) + ' % ggü. Basis 2029'), H.line(r.note || '', 'tt')])).on('mouseleave', () => H.hideTip());
        g.append('text').attr('x', r.dp >= 0 ? x(r.dp) + 5 : x(r.dp) - 5).attr('y', cy).attr('dy', '0.32em').attr('text-anchor', r.dp >= 0 ? 'start' : 'end').attr('fill', 'var(--color-fg-muted)').text(sg(r.dp) + N1.format(Math.abs(r.dp)) + ' %'); }); }
    // Summary & Empfehlung
    const dPark = (s29.parc_k / base[0].parc_k - 1) * 100, dServB = (s29.served_k / b29.served_k - 1) * 100, worst = items.filter((i) => !i.pts && !i.good).sort((a, b) => Math.abs(b.dp) - Math.abs(a.dp)).slice(0, 3);
    $('pf-sum').textContent = 'Szenario: Gesamtbestand ' + sg(dPark) + N1.format(Math.abs(dPark)) + ' % bis 2029 ggü. 2025 (' + fK(base[0].parc_k) + ' → ' + fK(s29.parc_k) + '), Retention ' + N1.format(s29.retention_pct) + ' % → betreuter Bestand ' + fK(s29.served_k) + ' (' + sg(dServB) + N1.format(Math.abs(dServB)) + ' % ggü. Basisprognose 2029). Größte negative Wirkung: ' + (worst.length ? worst.map((w) => w.name + ' ' + sg(w.dp) + N1.format(Math.abs(w.dp)) + ' %').join(', ') : 'keine') + '. Dafür wären ' + fK(s29.new_k) + ' Neufahrzeuge in 2029 nötig (Basis ' + fK(b29.new_k) + ').';
    $('pf-rec').textContent = dServB < -10 ? 'Starker Rückgang: Fixkosten und Kapazitäten (Händlernetz, Lager, Logistik) frühzeitig anpassen, Retention-Programme (Servicepakete, Erinnerungen, Flottenverträge) ausbauen und Teile-Sortiment auf umsatzstarke A-Gruppen fokussieren.' : dServB < -3 ? 'Moderater Rückgang: Retention stabilisieren und Lagerreichweite überwachen; Wachstum über Altfahrzeuge und Zubehör prüfen.' : 'Geringe Wirkung: Basisplanung beibehalten, Szenario regelmäßig neu bewerten.';
  }
  window.__hodDraw.pf = drawPf;
})();
