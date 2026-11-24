(function () {
  const H = window.__hod; if (!H || !window.__hodDraw) return;
  const $ = (id) => document.getElementById(id), FMT = H.FMT, n0 = H.n0, n1 = H.n1;
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const nf = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const N0 = nf(0), N1 = nf(1), N2 = nf(2);
  const sorts = new Map(), P = () => dash.params();
  const setP = (o) => dash.setParams(o);
  const act = (p) => window.__hodAct && window.__hodAct.open(p);
  function bindSort(tbl, redraw) {
    tbl.addEventListener('click', (ev) => {
      const th = ev.target.closest('th[data-field]'); if (!th) return;
      const s = sorts.get(tbl); sorts.set(tbl, { f: th.dataset.field, dir: s && s.f === th.dataset.field && s.dir === 'asc' ? 'desc' : 'asc' }); redraw();
    });
  }
  function sortRows(tbl, rows, dflt) {
    const s = sorts.get(tbl) || dflt, d = rows.slice();
    if (s) d.sort((a, b) => (a[s.f] < b[s.f] ? -1 : a[s.f] > b[s.f] ? 1 : 0) * (s.dir === 'asc' ? 1 : -1));
    tbl.querySelectorAll('th[data-field]').forEach((th) => { if (s && th.dataset.field === s.f) th.setAttribute('aria-sort', s.dir === 'asc' ? 'ascending' : 'descending'); else th.removeAttribute('aria-sort'); });
    return d;
  }
  const qOf = (id) => { const i = document.querySelector('.tsearch2[data-for="' + id + '"]'); return i ? i.value.trim().toLowerCase() : ''; };
  function fillTable(tbl, rows, key, cols, dflt, extra) {
    const body = tbl.tBodies[0]; body.replaceChildren(); const q = qOf(tbl.id);
    sortRows(tbl, rows, dflt).forEach((r) => {
      const tr = document.createElement('tr'); tr.dataset.key = r[key];
      cols.forEach((c) => tr.append(el('td', c.cls ? c.cls(r) : '', c.get(r))));
      if (extra) { const td = el('td', 'acts'); extra(r, td); tr.append(td); }
      if (q && !tr.textContent.toLowerCase().includes(q)) tr.hidden = true;
      body.append(tr);
    });
  }
  const pill = (t, c) => el('span', 'pill ' + c, t);
  // ======================= Händler =======================
  const dlRisk = $('tb-dl-risk'), dlSeg = $('tb-dl-seg');
  bindSort(dlRisk, () => drawDl()); bindSort(dlSeg, () => drawDl());
  $('dl-lvl').addEventListener('change', () => drawDl()); $('dl-seg').addEventListener('change', () => drawDl());
  dlRisk.addEventListener('click', (ev) => {
    const b = ev.target.closest('button[data-id]'); if (!b) return;
    const r = (rowsOf('dl_risk') || []).find((x) => x.id === b.dataset.id); if (!r) return;
    act({ title: 'Händlergespräch ' + r.name + ' (' + r.segment + '-Händler): ' + r.reasons, bu: 'Händler', ref: 'Abwanderungsrisiko ' + r.name, owner: 'Außendienst ' + r.region, due: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10), prio: r.level === 'hoch' ? 'A' : 'B' });
  });
  function drawDl() {
    const rg = H.REGSEL(), m = H.M();
    H.timeChart($('ch-dl-0'), 'dl_monthly', { y: 'active_dealers', unit: 'int', target: 290, cnt: 1, nodim: 1, hib: 1, type: 'line' });
    H.timeChart($('ch-dl-1'), 'dl_monthly', { y: 'churn_pct', unit: 'pct2', target: 0.8, hib: 0, type: 'bars' });
    const risk = rowsOf('dl_risk'), seg = rowsOf('dl_seg');
    if (risk) {
      const lv = $('dl-lvl').value, sg = $('dl-seg').value;
      const rows = risk.filter((r) => (rg === 'Alle' || r.region === rg) && r.month === m && (lv === 'Alle' || r.level === lv) && (sg === 'Alle' || r.segment === sg));
      fillTable(dlRisk, rows, 'id', [{ get: (r) => r.name }, { get: (r) => r.region }, { get: (r) => r.segment }, { get: (r) => FMT.eur_k(r.revenue_k) }, { get: (r) => FMT.eur_k(r.avg3_k) },
        { get: (r) => N1.format(r.drop_pct) + ' %' }, { get: (r) => String(r.last_order_days) }, { get: (r) => FMT.pct(r.overdue_pct) }, { get: (r) => r.level, cls: (r) => (r.level === 'hoch' ? 'bad' : 'warn') }, { get: (r) => r.reasons }],
        { f: 'score', dir: 'desc' }, (r, td) => { const b = el('button', null, '+ Maßnahme'); b.dataset.id = r.id; td.append(b); });
      $('dl-risk-empty').hidden = rows.length > 0;
    }
    if (seg) fillTable(dlSeg, seg.filter((r) => r.region === rg && r.month === m), 'id', [{ get: (r) => r.segment }, { get: (r) => String(r.active) + ' von ' + r.dealers }, { get: (r) => FMT.eur_k(r.revenue_k) }, { get: (r) => FMT.pct(r.share_pct) }, { get: (r) => FMT.pct(r.margin_pct) }], { f: 'segment', dir: 'asc' });
  }
  // ======================= Alarme =======================
  const alTbl = $('tb-al');
  bindSort(alTbl, () => drawAl());
  const ESC = { rot: 'Bereichsleitung + Head of Aftersales (innerhalb 5 Arbeitstagen, Maßnahmenplan)', gelb: 'Fachbereichsleitung (nächster Monatsreview)' };
  const redN = () => +(P().alred || 2), gapR = () => +(P().algap || 0);
  const level = (r) => (r.streak >= redN() || (gapR() && r.streak >= 1 && r.gap_pct >= gapR()) ? 'rot' : r.streak >= 1 ? 'gelb' : 'gruen');
  $('al-red').addEventListener('change', () => setP({ alred: $('al-red').value === '2' ? null : $('al-red').value }));
  $('al-gap').addEventListener('change', () => setP({ algap: $('al-gap').value === '0' ? null : $('al-gap').value }));
  $('al-bu').addEventListener('change', () => drawAl()); $('al-lv').addEventListener('change', () => drawAl());
  alTbl.addEventListener('click', (ev) => {
    const b = ev.target.closest('button[data-id]'); if (!b) return;
    const r = (rowsOf('al_status') || []).find((x) => x.id === b.dataset.id); if (!r) return; const lv = level(r);
    act({ title: 'Alarm ' + r.kpi + ' (' + r.bu_label + '): ' + r.streak + ' Monat(e) in Folge unter Ziel – Ursache klären und Gegenmaßnahme festlegen', bu: r.bu_label, ref: r.kpi, owner: lv === 'rot' ? 'Bereichsleitung ' + r.bu_label : 'Fachbereichsleitung ' + r.bu_label, due: new Date(Date.now() + (lv === 'rot' ? 7 : 30) * 864e5).toISOString().slice(0, 10), prio: lv === 'rot' ? 'A' : 'B' });
  });
  function drawAl() {
    const rg = H.REGSEL(), m = H.M(), all = rowsOf('al_status'); if (!all) return;
    $('al-red').value = String(redN()); $('al-gap').value = String(gapR());
    const bus = [...new Set(all.map((r) => r.bu_label))];
    if (document.activeElement !== $('al-bu')) { const cur = $('al-bu').value || 'Alle'; $('al-bu').replaceChildren(new Option('Alle Bereiche', 'Alle'), ...bus.map((b) => new Option(b, b))); $('al-bu').value = cur; }
    const bu = $('al-bu').value, lvF = $('al-lv').value;
    const cur = all.filter((r) => r.region === rg && r.month === m);
    const cnt = { rot: 0, gelb: 0, gruen: 0 }; cur.forEach((r) => { cnt[level(r)] += 1; });
    $('al-c-rot').textContent = String(cnt.rot); $('al-c-gelb').textContent = String(cnt.gelb); $('al-c-gruen').textContent = String(cnt.gruen);
    const rows = cur.filter((r) => level(r) !== 'gruen' && (bu === 'Alle' || r.bu_label === bu) && (lvF === 'Alle' || level(r) === lvF)).map((r) => Object.assign({ lvl: level(r) }, r));
    const sev = { rot: 0, gelb: 1 };
    if (!sorts.get(alTbl)) rows.sort((a, b) => sev[a.lvl] - sev[b.lvl] || b.streak - a.streak || b.gap_pct - a.gap_pct);
    fillTable(alTbl, rows, 'id',
      [{ get: (r) => (r.lvl === 'rot' ? 'Rot' : 'Gelb'), cls: (r) => (r.lvl === 'rot' ? 'bad' : 'warn') }, { get: (r) => r.bu_label }, { get: (r) => r.kpi }, { get: (r) => FMT[r.unit](r.value) + ' vs. ' + FMT[r.unit](r.target) },
       { get: (r) => N1.format(r.gap_pct) + ' %' }, { get: (r) => String(r.streak) }, { get: (r) => ESC[r.lvl] }], null, (r, td) => { const b = el('button', null, '+ Maßnahme'); b.dataset.id = r.id; td.append(b); });
    $('al-empty').hidden = rows.length > 0;
    // Ampel-Historie
    const box = $('ch-al'); const hist = all.filter((r) => r.region === rg && (bu === 'Alle' || r.bu_label === bu));
    const w = box.clientWidth; if (!w) return; box.classList.remove('dash-skeleton'); box.replaceChildren();
    const keys = [...new Map(hist.map((r) => [r.bu + '|' + r.kpi, r.bu_label + ' · ' + r.kpi])).entries()], ms = [...new Set(hist.map((r) => r.month))].sort();
    const RH = 20, T = 20, svg = d3.select(box).append('svg').attr('width', '100%'), g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
    const L = Math.min(Math.max(...keys.map(([, t]) => H.measure(svg, [t]))) + 10, w * 0.45), cw = (w - L) / ms.length, byK = new Map(hist.map((r) => [r.bu + '|' + r.kpi + '|' + r.month, r]));
    svg.attr('viewBox', `0 0 ${w} ${T + keys.length * RH + 4}`);
    ms.forEach((mm, i) => g.append('text').attr('x', L + i * cw + cw / 2).attr('y', 13).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(H.mlabel(mm)));
    keys.forEach(([k, t], ri) => {
      g.append('text').attr('x', L - 6).attr('y', T + ri * RH + RH / 2).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').text(t);
      ms.forEach((mm, i) => { const r = byK.get(k + '|' + mm); if (!r) return;
        g.append('rect').attr('x', L + i * cw + 1).attr('y', T + ri * RH + 1).attr('width', Math.max(2, cw - 2)).attr('height', RH - 2).attr('rx', 3).attr('fill', r.ok ? dash.colors[2] || dash.colors[0] : H.CRIT).attr('fill-opacity', r.ok ? 0.35 : 0.85).attr('stroke', mm === m ? 'var(--color-fg)' : 'none')
          .on('mousemove', (ev) => H.showTip(ev, [H.line(t + ' · ' + H.mlabel(mm), 'tt'), H.line(FMT[r.unit](r.value) + ' vs. Ziel ' + FMT[r.unit](r.target)), H.line(r.streak ? r.streak + ' Monat(e) in Folge unter Ziel' : 'Ziel erreicht', 'tt')])).on('mouseleave', H.hideTip).on('click', () => setP({ month: mm }));
      });
    });
  }
  // ======================= Forecast =======================
  const fcm = () => (H.M() < '2026-01' ? '2026-01' : H.M());
  function multi(el0, o) {
    const rows = H.ready(el0, 'fc_cube', (r) => r.region === H.REGSEL() && r.asof === fcm()); if (!rows) return;
    const w = el0.clientWidth; if (!w) return; el0.replaceChildren();
    const Hh = 260, MG = { t: 12, r: 14, b: 26 }, svg = d3.select(el0).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${Hh}`), asof = fcm();
    const vals = rows.flatMap((r) => o.series.map((s) => r[s.f]).filter((v) => v != null)); let lo = o.zero ? 0 : d3.min(vals), hi = d3.max(vals); const pd = (hi - lo) * 0.1; if (!o.zero) lo -= pd; hi += pd;
    const y = d3.scaleLinear([lo, hi], [Hh - MG.b, MG.t]).nice(4), ticks = y.ticks(4), tf = nf(0), L = H.measure(svg, ticks.map((t) => tf.format(t))) + 10;
    const x = d3.scalePoint(rows.map((r) => r.month), [L + 8, w - MG.r - 8]), g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
    ticks.forEach((t) => { g.append('line').attr('x1', L).attr('x2', w - MG.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', L - 6).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').text(tf.format(t)); });
    rows.forEach((r, i) => { if (i % Math.ceil(12 / Math.max(3, Math.floor((w - L) / 60))) === 0) g.append('text').attr('x', x(r.month)).attr('y', Hh - 8).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(H.mlabel(r.month)); });
    g.append('rect').attr('x', x(asof)).attr('y', MG.t).attr('width', Math.max(0, w - MG.r - 8 - x(asof))).attr('height', Hh - MG.b - MG.t).attr('fill', 'var(--cds-chart-grid)').attr('opacity', 0.35);
    g.append('text').attr('x', w - MG.r - 8).attr('y', MG.t + 10).attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').text('Forecast');
    o.series.forEach((s, si) => {
      const pts = rows.filter((r) => r[s.f] != null && (!s.from || r.month >= asof)); if (!pts.length) return;
      g.append('path').datum(pts).attr('fill', 'none').attr('stroke', s.color || dash.colors[si]).attr('stroke-width', s.w || 2).attr('stroke-dasharray', s.dash || null).attr('stroke-linecap', 'round').attr('d', d3.line().x((r) => x(r.month)).y((r) => y(r[s.f])));
    });
    svg.append('rect').attr('x', L).attr('y', 0).attr('width', w - L).attr('height', Hh - MG.b).attr('fill', 'transparent').on('mousemove', (ev) => {
      const px = d3.pointer(ev)[0]; let bi = 0, bd = 1e9; rows.forEach((r, i) => { const dd = Math.abs(x(r.month) - px); if (dd < bd) { bd = dd; bi = i; } }); const r = rows[bi];
      H.showTip(ev, [H.line(H.mlabel(r.month) + (r.kind === 'Ist' ? ' (Ist)' : ' (Forecast)'), 'tt')].concat(o.series.filter((s) => r[s.f] != null).map((s) => H.line(s.label + ': ' + FMT.eur_k(r[s.f])))));
    }).on('mouseleave', H.hideTip);
    const lg = el0.parentElement.querySelector('.legend'); if (lg && !lg.children.length) o.series.forEach((s, si) => { const sp = el('span', 'lg'); const i = el('i'); i.style.background = s.color || dash.colors[si]; if (s.dash) i.style.opacity = 0.6; sp.append(i, s.label); lg.append(sp); });
  }
  function drawFc() {
    multi($('ch-fc-0'), { series: [{ f: 'plan_k', label: 'Plan', dash: '5 4', color: 'var(--cds-chart-reference)' }, { f: 'py_k', label: 'Vorjahr', color: 'var(--color-fg-muted)', w: 1.5 }, { f: 'ist_k', label: 'Ist', color: dash.colors[0] }, { f: 'fc_k', label: 'Forecast', dash: '2 4', w: 2.5, color: dash.colors[1] || dash.colors[0], from: 1 }] });
    multi($('ch-fc-1'), { zero: 1, series: [{ f: 'cum_plan', label: 'Plan kumuliert', dash: '5 4', color: 'var(--cds-chart-reference)' }, { f: 'cum_py', label: 'Vorjahr kumuliert', color: 'var(--color-fg-muted)', w: 1.5 }, { f: 'cum_fc', label: 'Ist + Forecast kumuliert', color: dash.colors[0] }] });
  }
  // ======================= Marge =======================
  const sc = { p: $('mg-p'), d: $('mg-d'), e: $('mg-e'), c: $('mg-c'), f: $('mg-f') };
  const scv = () => ({ p: +sc.p.value, d: +sc.d.value, e: +sc.e.value, c: +sc.c.value, f: +sc.f.value });
  Object.values(sc).forEach((i) => i.addEventListener('input', () => drawMg()));
  $('mg-reset').addEventListener('click', () => { sc.p.value = 0; sc.d.value = 0; sc.e.value = -1.2; sc.c.value = 0; sc.f.value = 0; drawMg(); });
  function scenario(b, s) {
    const v = 1 + s.e * s.p / 100, L = b.list_k * (1 + s.p / 100) * v, d = Math.max(0, b.discount_pct + s.d) / 100, D = L * d, N1 = L - D, B = N1 * b.bonus_pct / 100, F = b.freight_k * v * (1 + s.f / 100), C = b.cogs_k * v * (1 + s.c / 100);
    return { L, D, B, F, C, N1: N1 - B, GP: N1 - B - F - C };
  }
  function drawWf(el0, steps, scen) {
    const w = el0.clientWidth; if (!w) return; el0.replaceChildren();
    const Hh = 280, MG = { t: 16, r: 12, b: 44 }, svg = d3.select(el0).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${Hh}`), g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
    let run = 0; const bars = steps.map((s) => { const a = s.kind === 'total' ? 0 : run, b2 = s.kind === 'total' ? s.value : run + s.value; if (s.kind === 'total') run = s.value; else run += s.value; return { s, lo: Math.min(a, b2), hi: Math.max(a, b2) }; });
    const top = d3.max(bars, (b) => b.hi), y = d3.scaleLinear([0, top * 1.08], [Hh - MG.b, MG.t]).nice(4), tf = nf(0), L = H.measure(svg, [tf.format(top)]) + 12;
    const x = d3.scaleBand(bars.map((b) => b.s.label), [L, w - MG.r]).padding(0.25);
    y.ticks(4).forEach((t) => { g.append('line').attr('x1', L).attr('x2', w - MG.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', L - 6).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').text(tf.format(t)); });
    bars.forEach((b, i) => {
      const tot = b.s.kind === 'total';
      g.append('rect').attr('x', x(b.s.label)).attr('width', x.bandwidth()).attr('y', y(b.hi)).attr('height', Math.max(1, y(b.lo) - y(b.hi))).attr('rx', 3).attr('fill', tot ? dash.colors[0] : 'var(--cds-chart-muted, #9aa0a8)').attr('fill-opacity', tot ? 0.9 : 0.75)
        .on('mousemove', (ev) => H.showTip(ev, [H.line(b.s.label, 'tt'), H.line(FMT.eur_k(b.s.value)), H.line(N1.format(b.s.pct_of_list) + ' % vom Listenumsatz', 'tt')].concat(scen ? [H.line('Szenario: ' + FMT.eur_k(scen[i]), 'tt')] : []))).on('mouseleave', H.hideTip);
      g.append('text').attr('x', x(b.s.label) + x.bandwidth() / 2).attr('y', y(b.hi) - 4).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg)').text(FMT.eur_k(b.s.value));
      g.append('text').attr('x', x(b.s.label) + x.bandwidth() / 2).attr('y', Hh - 26).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(b.s.label);
      g.append('text').attr('x', x(b.s.label) + x.bandwidth() / 2).attr('y', Hh - 12).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(N1.format(b.s.pct_of_list) + ' %');
      if (scen) { const sv = tot ? scen[i] : null; if (sv != null) g.append('line').attr('x1', x(b.s.label) - 3).attr('x2', x(b.s.label) + x.bandwidth() + 3).attr('y1', y(sv)).attr('y2', y(sv)).attr('stroke', 'var(--color-fg)').attr('stroke-width', 2.5).attr('stroke-dasharray', '4 3'); }
    });
  }
  function drawMg() {
    const rg = H.REGSEL(), m = H.M(), steps = H.ready($('ch-mg-w'), 'wf_steps', (r) => r.region === rg && r.month === m), raw = rowsOf('wf_monthly');
    if (!steps || !raw) return;
    const b = raw.find((r) => r.region === rg && r.month === m); if (!b) return;
    const s = scv(), sc2 = scenario(b, s), base = scenario(b, { p: 0, d: 0, e: -1.2, c: 0, f: 0 });
    const changed = s.p || s.d || s.c || s.f;
    drawWf($('ch-mg-w'), steps.slice().sort((a, c) => a.step - c.step), changed ? [sc2.L, -sc2.D, -sc2.B, -sc2.F, -sc2.C, sc2.GP] : null);
    $('mg-p-v').textContent = (s.p >= 0 ? '+' : '') + N1.format(s.p) + ' %'; $('mg-d-v').textContent = (s.d >= 0 ? '+' : '') + N1.format(s.d) + ' Pkt.'; $('mg-e-v').textContent = N1.format(s.e);
    $('mg-c-v').textContent = (s.c >= 0 ? '+' : '') + N1.format(s.c) + ' %'; $('mg-f-v').textContent = (s.f >= 0 ? '+' : '') + N1.format(s.f) + ' %';
    const rows = [['Listenumsatz', base.L, sc2.L], ['Rabatte', -base.D, -sc2.D], ['Boni/Skonti', -base.B, -sc2.B], ['Fracht', -base.F, -sc2.F], ['Wareneinsatz', -base.C, -sc2.C], ['Rohertrag', base.GP, sc2.GP]];
    const body = $('tb-mg').tBodies[0]; body.replaceChildren();
    rows.forEach(([l, a, c], i) => { const d = c - a, tr = el('tr', i === 5 ? 'tot' : ''); tr.append(el('td', null, l), el('td', null, FMT.eur_k(a)), el('td', null, FMT.eur_k(c)), el('td', d < -0.5 ? 'bad' : d > 0.5 ? 'good' : '', (d >= 0 ? '+' : '−') + N0.format(Math.abs(d)) + ' k€')); body.append(tr); });
    const mb = base.GP / base.N1 * 100, ms = sc2.GP / sc2.N1 * 100, dg = sc2.GP - base.GP;
    const tr = el('tr'); tr.append(el('td', null, 'Rohertragsmarge'), el('td', null, N1.format(mb) + ' %'), el('td', null, N1.format(ms) + ' %'), el('td', ms - mb >= 0 ? 'good' : 'bad', (ms - mb >= 0 ? '+' : '−') + N1.format(Math.abs(ms - mb)) + ' Pkt.')); body.append(tr);
    $('mg-sum').textContent = changed ? 'Szenario: Rohertrag ' + (dg >= 0 ? '+' : '−') + N0.format(Math.abs(dg)) + ' k€ (' + (dg >= 0 ? '+' : '−') + N1.format(Math.abs(dg / base.GP * 100)) + ' %), Marge ' + (ms - mb >= 0 ? '+' : '−') + N1.format(Math.abs(ms - mb)) + ' Pkt. – Annahme: Absatzmenge reagiert mit der gewählten Elastizität auf die Preisänderung.' : 'Regler bewegen, um die Wirkung von Preis, Rabatt, Einkauf und Fracht auf den Rohertrag zu sehen.';
  }
  // ======================= Pareto =======================
  const paEnt = () => P().paent || 'Händler', paMet = $('pa-ent');
  paMet.addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) setP({ paent: b.dataset.e === 'Händler' ? null : b.dataset.e }); });
  const paTbl = $('tb-pa'); bindSort(paTbl, () => drawPa());
  function drawPa() {
    const ent = paEnt(), rg = ent === 'Produktgruppen' ? 'Alle' : H.REGSEL(), m = ent === 'Länder' ? 'all' : H.M();
    paMet.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.e === ent)));
    const rows = H.ready($('ch-pa'), 'pa_cube', (r) => r.entity === ent && r.region === rg && r.month === m); if (!rows) return;
    const box = $('ch-pa'), w = box.clientWidth; if (!w) return; box.replaceChildren();
    const top = rows.slice(0, 30), Hh = 300, MG = { t: 14, r: 40, b: 30, l: 56 }, svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${Hh}`), g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
    const x = d3.scaleBand(top.map((r) => r.rank), [MG.l, w - MG.r]).padding(0.2), y = d3.scaleLinear([0, d3.max(top, (r) => r.value) * 1.1], [Hh - MG.b, MG.t]), y2 = d3.scaleLinear([0, 100], [Hh - MG.b, MG.t]);
    y.ticks(4).forEach((t) => { g.append('line').attr('x1', MG.l).attr('x2', w - MG.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', MG.l - 6).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').text(N0.format(t)); });
    [0, 50, 80, 100].forEach((t) => g.append('text').attr('x', w - MG.r + 6).attr('y', y2(t)).attr('dy', '0.32em').attr('fill', 'var(--color-fg-muted)').text(t + ' %'));
    g.append('line').attr('x1', MG.l).attr('x2', w - MG.r).attr('y1', y2(80)).attr('y2', y2(80)).attr('stroke', 'var(--cds-chart-reference)').attr('stroke-dasharray', '5 4');
    const clr = { A: dash.colors[0], B: 'var(--cds-chart-muted, #9aa0a8)', C: 'var(--cds-chart-grid)' };
    g.selectAll('rect').data(top).join('rect').attr('x', (r) => x(r.rank)).attr('width', x.bandwidth()).attr('y', (r) => y(r.value)).attr('height', (r) => y(0) - y(r.value)).attr('rx', 2).attr('data-pg', (r) => (ent === 'Produktgruppen' ? r.name : null)).attr('data-ct', (r) => (ent === 'Länder' ? r.name : null)).attr('fill', (r) => clr[r.cls])
      .on('mousemove', (ev, r) => (ent === 'Produktgruppen' && window.__groupPop ? window.__groupPop.show(ev, r.name) : ent === 'Länder' && window.__ctryPop ? window.__ctryPop.show(ev, r.name) : H.showTip(ev, [H.line(r.name, 'tt'), H.line(FMT.eur_k(r.value) + ' (' + N1.format(r.share_pct) + ' %)'), H.line('kumuliert ' + N1.format(r.cum_pct) + ' % · Klasse ' + r.cls, 'tt')]))).on('mouseleave', () => { H.hideTip(); if (window.__groupPop) window.__groupPop.hide(); if (window.__ctryPop) window.__ctryPop.hide(); });
    g.append('path').datum(top).attr('fill', 'none').attr('stroke', 'var(--color-fg)').attr('stroke-width', 1.8).attr('d', d3.line().x((r) => x(r.rank) + x.bandwidth() / 2).y((r) => y2(r.cum_pct)));
    g.append('text').attr('x', (MG.l + w - MG.r) / 2).attr('y', Hh - 8).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text('Rang (Top ' + top.length + ' von ' + rows.length + ') · Balken = Umsatz in k€ · Linie = kumulierter Anteil');
    fillTable(paTbl, rows.slice(0, 15), 'id', [{ get: (r) => String(r.rank) }, { get: (r) => r.name }, { get: (r) => FMT.eur_k(r.value) }, { get: (r) => FMT.pct(r.share_pct) }, { get: (r) => FMT.pct(r.cum_pct) }, { get: (r) => r.cls }], { f: 'rank', dir: 'asc' });
    const ins = rowsOf('ins_pa'), r0 = ins && ins.find((r) => r.entity === ent && r.region === rg && r.month === m);
    document.querySelectorAll('#pa .pmark').forEach((e) => { e.dataset.where = 'id=pa&entity=' + ent + '&region=' + rg + '&month=' + m; e.textContent = r0 ? r0[e.dataset.field] : '—'; });
  }
  window.__hodDraw.dl = drawDl; window.__hodDraw.al = drawAl; window.__hodDraw.fc = drawFc; window.__hodDraw.mg = drawMg; window.__hodDraw.pa = drawPa;
  document.addEventListener('input', (ev) => { if (ev.target.matches && ev.target.matches('.tsearch2')) { const c = H.cur(); if (window.__hodDraw[c]) window.__hodDraw[c](); } });
})();
