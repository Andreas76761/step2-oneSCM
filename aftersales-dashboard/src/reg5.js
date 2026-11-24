(function () {
  const H = window.__hod; if (!H) return;
  const FMT = H.FMT, $ = (id) => document.getElementById(id);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const N0 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }), N1 = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const NS = 'http://www.w3.org/2000/svg';
  // ======================= Flaggen (vereinfachte Darstellung, ohne Wappen) =======================
  const hs = (cs) => cs.map((c, i) => `<rect y="${i * 20 / cs.length}" width="30" height="${20 / cs.length + 0.1}" fill="${c}"/>`).join('');
  const vs = (cs) => cs.map((c, i) => `<rect x="${i * 30 / cs.length}" width="${30 / cs.length + 0.1}" height="20" fill="${c}"/>`).join('');
  const rect = (x, y, w, h, f) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;
  const nordic = (bg, outer, inner, ix = 9, t = 4, it = 0) => rect(0, 0, 30, 20, bg) + rect(ix - t / 2 - 0.5, 0, t, 20, outer) + rect(0, 8, 30, t, outer) + (it ? rect(ix - it / 2 - 0.5, 0, it, 20, inner) + rect(0, 10 - it / 2, 30, it, inner) : '');
  const star = (cx, cy, R, r, fill, rot = -90) => { const p = []; for (let i = 0; i < 10; i++) { const a = (rot + i * 36) * Math.PI / 180, rr = i % 2 ? r : R; p.push((cx + rr * Math.cos(a)).toFixed(2) + ',' + (cy + rr * Math.sin(a)).toFixed(2)); } return `<polygon points="${p.join(' ')}" fill="${fill}"/>`; };
  const FLAG = {
    'Deutschland': hs(['#000', '#d00', '#ffce00']),
    'Österreich': hs(['#ed2939', '#fff', '#ed2939']),
    'Schweiz': rect(0, 0, 30, 20, '#d52b1e') + rect(13, 4, 4, 12, '#fff') + rect(9, 8, 12, 4, '#fff'),
    'Frankreich': vs(['#0055a4', '#fff', '#ef4135']),
    'Großbritannien': rect(0, 0, 30, 20, '#012169') + '<path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0L30 20M30 0L0 20" stroke="#c8102e" stroke-width="1.6"/>' + rect(12, 0, 6, 20, '#fff') + rect(0, 7, 30, 6, '#fff') + rect(13, 0, 4, 20, '#c8102e') + rect(0, 8, 30, 4, '#c8102e'),
    'Irland': vs(['#169b62', '#fff', '#ff883e']),
    'Niederlande': hs(['#ae1c28', '#fff', '#21468b']),
    'Belgien': vs(['#000', '#fdda24', '#ef3340']),
    'Luxemburg': hs(['#ed2939', '#fff', '#00a1de']),
    'Spanien': rect(0, 0, 30, 20, '#aa151b') + rect(0, 5, 30, 10, '#f1bf00'),
    'Portugal': rect(0, 0, 30, 20, '#ff0000') + rect(0, 0, 12, 20, '#006600') + '<circle cx="12" cy="10" r="3.6" fill="#ffe000" stroke="#ff0000" stroke-width=".8"/>',
    'Italien': vs(['#009246', '#fff', '#ce2b37']),
    'Polen': hs(['#fff', '#dc143c']),
    'Tschechien': hs(['#fff', '#d7141a']) + '<polygon points="0,0 14,10 0,20" fill="#11457e"/>',
    'Slowakei': hs(['#fff', '#0b4ea2', '#ee1c25']) + rect(7, 4, 6, 9, '#ee1c25') + rect(9.6, 5.5, 1, 6, '#fff') + rect(8, 7, 3, 1, '#fff'),
    'Ungarn': hs(['#ce2939', '#fff', '#477050']),
    'Rumänien': vs(['#002b7f', '#fcd116', '#ce1126']),
    'Bulgarien': hs(['#fff', '#00966e', '#d62612']),
    'Griechenland': Array.from({ length: 9 }, (_, i) => rect(0, i * 20 / 9, 30, 20 / 9 + 0.1, i % 2 ? '#fff' : '#0d5eaf')).join('') + rect(0, 0, 11.1, 11.2, '#0d5eaf') + rect(4.4, 0, 2.3, 11.2, '#fff') + rect(0, 4.5, 11.1, 2.3, '#fff'),
    'Kroatien': hs(['#ff0000', '#fff', '#171796']) + rect(12, 6.5, 6, 7, '#ff0000') + rect(12, 6.5, 2, 1.75, '#fff') + rect(16, 6.5, 2, 1.75, '#fff') + rect(14, 8.25, 2, 1.75, '#fff') + rect(12, 10, 2, 1.75, '#fff') + rect(16, 10, 2, 1.75, '#fff') + rect(14, 11.75, 2, 1.75, '#fff'),
    'Slowenien': hs(['#fff', '#005da4', '#ed1c24']) + '<path d="M7 3.5h5v5a2.5 3 0 0 1-5 0z" fill="#005da4" stroke="#ed1c24" stroke-width=".6"/>',
    'Serbien': hs(['#c6363c', '#0c4076', '#fff']) + rect(7, 5, 5, 8, '#c6363c'),
    'Bosnien-Herzegowina': rect(0, 0, 30, 20, '#002395') + '<polygon points="8,0 24,0 24,20" fill="#fecb00"/>' + [[8, 0], [10.5, 2.5], [13, 5], [15.5, 7.5], [18, 10], [20.5, 12.5]].map(([x, y]) => star(x + 1, y + 1, 1.2, 0.5, '#fff')).join(''),
    'Dänemark': nordic('#c8102e', '#fff', null, 12, 3),
    'Schweden': nordic('#006aa7', '#fecc00', null, 11, 4),
    'Norwegen': nordic('#ba0c2f', '#fff', '#00205b', 11, 5, 2.4),
    'Finnland': nordic('#fff', '#003580', null, 11, 4.4),
    'Estland': hs(['#0072ce', '#000', '#fff']),
    'Lettland': rect(0, 0, 30, 20, '#9e3039') + rect(0, 8, 30, 4, '#fff'),
    'Litauen': hs(['#fdb913', '#006a44', '#c1272d']),
    'Türkei': rect(0, 0, 30, 20, '#e30a17') + '<circle cx="11" cy="10" r="5" fill="#fff"/><circle cx="12.4" cy="10" r="4" fill="#e30a17"/>' + star(16.2, 10, 2.1, 0.9, '#fff', 0)
  };
  const flag = (name, w) => {
    const s = document.createElementNS(NS, 'svg'); w = w || 24; s.setAttribute('viewBox', '0 0 30 20'); s.setAttribute('width', w); s.setAttribute('height', Math.round(w * 2 / 3));
    s.setAttribute('role', 'img'); s.setAttribute('aria-label', 'Flagge ' + name); s.setAttribute('class', 'flag'); s.innerHTML = FLAG[name] || '<rect width="30" height="20" fill="#ccc"/>'; return s;
  };
  window.__flag = flag;
  // ======================= Länder-Popover =======================
  const pop = (() => { const d = el('div', 'gpop cpop'); d.id = 'cpop'; d.hidden = true; $('app').append(d); return d; })();
  let cur = null;
  const place = (ev) => window.__place(pop, ev);
  function build(name) {
    const mo = rowsOf('mo_country') || [], br = rowsOf('branches') || [], r = mo.find((x) => x.country === name), c = el('div');
    const head = el('div', 'gh'), ht = el('div'); head.append(flag(name, 54), ht); ht.append(el('div', 'bt', name), el('div', 'bs', 'Land' + (r ? ' · ' + r.region : ''))); c.append(head);
    if (!r) { c.append(el('div', 'gl', 'Keine Länderdaten verfügbar.')); return c; }
    const tot = mo.reduce((s, x) => s + x.revenue_k, 0), rank = 1 + mo.filter((x) => x.revenue_k > r.revenue_k).length, att = r.revenue_k / r.target_k * 100, nb = br.filter((b) => b.country === name).length;
    const tiles = el('div', 'tiles'), tile = (l, v, bad) => { const t = el('div', 'tile'); t.append(el('div', 'tl', l), el('div', 'tv' + (bad ? ' bad' : ''), v)); tiles.append(t); };
    tile('Umsatz 12 Mon.', FMT.eur_k(r.revenue_k)); tile('Zielerreichung', FMT.pct(att), att < 100); tile('Wachstum YoY', FMT.pct(r.yoy_pct), r.yoy_pct < 5);
    tile('Händler', N0.format(r.dealers)); tile('Niederlassungen', N0.format(nb)); tile('Umsatzanteil', FMT.pct(r.revenue_k / tot * 100));
    c.append(tiles);
    c.append(el('div', 'gl', 'Rang ' + rank + ' von ' + mo.length + ' Ländern · Ø Umsatz je Händler ' + FMT.eur_k(r.revenue_k / r.dealers)));
    const rec = el('div', 'rec'); rec.append(el('b', null, 'Hinweis: '));
    rec.append(att < 98 ? 'Ziellücke von ' + FMT.eur_k(r.target_k - r.revenue_k) + ' – Händleraktivierung und Aktionsplanung mit der Landesleitung prüfen.' : r.yoy_pct < 4 ? 'Ziel erreicht, aber Wachstum unter Netzschnitt – Marktpotenzial und Wettbewerb analysieren.' : 'Land im Plan – Erfolgsfaktoren auf Länder mit Ziellücke übertragen.');
    c.append(rec); return c;
  }
  function show(ev, name) {
    if (!FLAG[name]) return;
    H.hideTip();
    if (cur !== name || pop.hidden) { pop.replaceChildren(build(name)); cur = name; }
    pop.hidden = false; place(ev);
  }
  function hide() { pop.hidden = true; cur = null; }
  window.__ctryPop = { show, hide };
  const nameOf = (t) => {
    if (!t || !t.closest) return null;
    const d = t.closest('[data-ct]'); if (d) return d.dataset.ct;
    const tag = t.tagName; if (tag === 'TD' || tag === 'text' || tag === 'tspan' || tag === 'TH') { const s = (t.textContent || '').trim(); if (FLAG[s]) return s; }
    return null;
  };
  H.root.addEventListener('mouseover', (ev) => { const n = nameOf(ev.target); if (n) show(ev, n); });
  H.root.addEventListener('mousemove', (ev) => { if (!pop.hidden) { const n = nameOf(ev.target); if (n) place(ev); else hide(); } });
  H.root.addEventListener('mouseout', (ev) => { if (!pop.hidden && !nameOf(ev.relatedTarget || document.body)) hide(); });

  // ======================= Pareto: 2er- und 3er-Tupel =======================
  const REGION = { Deutschland: 'DACH', Österreich: 'DACH', Schweiz: 'DACH', Frankreich: 'Westeuropa', Großbritannien: 'Westeuropa', Irland: 'Westeuropa', Niederlande: 'Westeuropa', Belgien: 'Westeuropa', Luxemburg: 'Westeuropa',
    Spanien: 'Südeuropa', Portugal: 'Südeuropa', Italien: 'Südeuropa', Griechenland: 'Südeuropa', Kroatien: 'Südeuropa', Slowenien: 'Südeuropa', Serbien: 'Südeuropa', 'Bosnien-Herzegowina': 'Südeuropa',
    Polen: 'Osteuropa', Tschechien: 'Osteuropa', Slowakei: 'Osteuropa', Ungarn: 'Osteuropa', Rumänien: 'Osteuropa', Bulgarien: 'Osteuropa', Türkei: 'Osteuropa',
    Dänemark: 'Nordeuropa', Schweden: 'Nordeuropa', Norwegen: 'Nordeuropa', Finnland: 'Nordeuropa', Estland: 'Nordeuropa', Lettland: 'Nordeuropa', Litauen: 'Nordeuropa' };
  const DIM = { L: ['Land', 'Land'], P: ['Produktgruppe', 'Produktgruppe'], B: ['Baumuster', 'Baumuster'], A: ['Alter', 'Altersklasse'] };
  const COMBOS = { 2: ['LP', 'LB', 'LA', 'PB', 'PA', 'BA'], 3: ['LPB', 'LPA', 'LBA', 'PBA'] };
  const clabel = (c) => c.split('').map((k) => DIM[k][1]).join(' × ');
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 10007) / 10007; };
  const SOUTH = new Set(['Spanien', 'Italien', 'Portugal', 'Griechenland', 'Kroatien']);
  // Wechselwirkung (Testdaten-Annahmen): deterministische Streuung + einige fachlich plausible Muster
  function sem(a, ma, b, mb) {
    const k = a + b; let f = 1; const ev = (m) => /Elektro|Hybrid/.test(m), el_ = (m) => /Elektro/.test(m), dsl = (m) => /Diesel/.test(m), old = (m) => m === '9-12 J' || m === '13+ J';
    if (k === 'LB') { const rg = REGION[ma]; if (ev(mb) && rg === 'Nordeuropa') f *= 1.9; if (ev(mb) && ma === 'Niederlande') f *= 1.5; if (dsl(mb) && (ma === 'Frankreich' || ma === 'Italien')) f *= 1.3; if (ev(mb) && rg === 'Osteuropa') f *= 0.6; }
    if (k === 'LP') { const rg = REGION[ma]; if (mb === 'Reifen & Räder' && rg === 'Nordeuropa') f *= 1.6; if (mb === 'Klima & Kühlung' && SOUTH.has(ma)) f *= 1.6; if (mb === 'Batterie & Starter' && rg === 'Nordeuropa') f *= 1.3; }
    if (k === 'BA') { if (el_(ma) && mb === '0-2 J') f *= 1.7; if (el_(ma) && mb === '13+ J') f *= 0.3; if (dsl(ma) && old(mb)) f *= 1.3; if (ma === 'A0 Basis' && old(mb)) f *= 1.3; }
    if (k === 'PB') { if (ma === 'Elektrik & Sensorik' && ev(mb)) f *= 1.8; if ((ma === 'Zündung & Glühen' || ma === 'Auspuff & Abgas' || ma === 'Kupplung' || ma === 'Öle & Flüssigkeiten') && el_(mb)) f *= 0.25; if (ma === 'Auspuff & Abgas' && dsl(mb)) f *= 1.5; if (ma === 'Zündung & Glühen' && dsl(mb)) f *= 1.4; }
    if (k === 'PA') { if (ma === 'Batterie & Starter' && old(mb)) f *= 1.5; if (ma === 'Dichtungen & Motorteile' && mb === '13+ J') f *= 1.7; if (ma === 'Zubehör & Pflege' && mb === '0-2 J') f *= 1.5; if ((ma === 'Bremse' || ma === 'Fahrwerk & Stoßdämpfer') && old(mb)) f *= 1.2; if (ma === 'Innenraum & Komfort' && mb === '0-2 J') f *= 1.4; }
    return f * Math.exp(0.5 * (hash(k + '|' + ma + '|' + mb) * 2 - 1));
  }
  let cubeFor = null, CUBE = null;
  function cube(base) {
    if (cubeFor === base) return CUBE;
    const M = {}; let tot = 0;
    for (const k of 'LPBA') M[k] = [];
    const name = { L: 'Land', P: 'Produktgruppe', B: 'Baumuster', A: 'Alter' };
    base.filter((r) => r.dim !== 'Gesamt').sort((a, b) => a.order - b.order).forEach((r) => { for (const k in name) if (r.dim === name[k]) M[k].push({ m: r.member, s: r.share_pct / 100, base: r.base_k }); });
    const g = base.find((r) => r.dim === 'Gesamt'); tot = g ? g.base_k : 0;
    const PAIR = {}; for (const p of ['LP', 'LB', 'LA', 'PB', 'PA', 'BA']) PAIR[p] = M[p[0]].map((x) => M[p[1]].map((y) => sem(p[0], x.m, p[1], y.m)));
    const cells = []; let sum = 0;
    M.L.forEach((l, i) => M.P.forEach((p, j) => M.B.forEach((b, k) => M.A.forEach((a, n) => {
      const v = l.s * p.s * b.s * a.s * PAIR.LP[i][j] * PAIR.LB[i][k] * PAIR.LA[i][n] * PAIR.PB[j][k] * PAIR.PA[j][n] * PAIR.BA[k][n]; sum += v; cells.push({ L: l.m, P: p.m, B: b.m, A: a.m, v }); }))));
    const sc = tot / sum; cells.forEach((c) => { c.v *= sc; });
    CUBE = { cells, tot, M }; cubeFor = base; return CUBE;
  }
  function tuples(base, combo, rg) {
    const C = cube(base), map = new Map(), keys = combo.split('');
    for (const c of C.cells) { if (rg !== 'Alle' && REGION[c.L] !== rg) continue; const id = keys.map((k) => c[k]).join('\u0001'); map.set(id, (map.get(id) || 0) + c.v); }
    const items = [...map].map(([id, v]) => ({ parts: id.split('\u0001'), value: v })).sort((a, b) => b.value - a.value);
    const tot = items.reduce((s, x) => s + x.value, 0); let cum = 0;
    items.forEach((x, i) => { const bef = cum; cum += x.value; x.rank = i + 1; x.share = x.value / tot * 100; x.cum = cum / tot * 100; x.cls = bef / tot < 0.8 ? 'A' : bef / tot < 0.95 ? 'B' : 'C'; });
    return { items, tot, C };
  }
  const P = () => dash.params();
  const mode = () => (P().patup === '2' || P().patup === '3' ? P().patup : 'single');
  const comboOf = () => { const n = mode(), l = COMBOS[n] || []; return l.includes(P().pacombo) ? P().pacombo : l[0]; };
  const modeSeg = $('pa-mode'), comboSel = $('pat-combo'), thirdSel = $('pat-third');
  if (!modeSeg) return;
  modeSeg.addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) dash.setParams({ patup: b.dataset.m === 'single' ? null : b.dataset.m, pacombo: null, pathird: null }); });
  comboSel.addEventListener('change', () => dash.setParams({ pacombo: comboSel.value, pathird: null }));
  thirdSel.addEventListener('change', () => dash.setParams({ pathird: thirdSel.value || null }));
  const lbl = (parts) => parts.join(' · ');
  function drawPareto(T, combo, n) {
    const box = $('ch-pat'), w = box.clientWidth; if (!w) return; box.replaceChildren();
    const top = T.items.slice(0, 40), Hh = 300, MG = { t: 14, r: 40, b: 34, l: 56 }, svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${Hh}`), g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
    const x = d3.scaleBand(top.map((r) => r.rank), [MG.l, w - MG.r]).padding(0.15), y = d3.scaleLinear([0, d3.max(top, (r) => r.value) * 1.1], [Hh - MG.b, MG.t]), y2 = d3.scaleLinear([0, 100], [Hh - MG.b, MG.t]);
    y.ticks(4).forEach((t) => { g.append('line').attr('x1', MG.l).attr('x2', w - MG.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', MG.l - 6).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').text(N0.format(t)); });
    [0, 50, 80, 100].forEach((t) => g.append('text').attr('x', w - MG.r + 6).attr('y', y2(t)).attr('dy', '0.32em').attr('fill', 'var(--color-fg-muted)').text(t + ' %'));
    g.append('line').attr('x1', MG.l).attr('x2', w - MG.r).attr('y1', y2(80)).attr('y2', y2(80)).attr('stroke', 'var(--cds-chart-reference)').attr('stroke-dasharray', '5 4');
    const clr = { A: dash.colors[0], B: 'var(--cds-chart-muted, #9aa0a8)', C: 'var(--cds-chart-grid)' };
    g.selectAll('rect').data(top).join('rect').attr('x', (r) => x(r.rank)).attr('width', x.bandwidth()).attr('y', (r) => y(r.value)).attr('height', (r) => y(0) - y(r.value)).attr('rx', 2).attr('fill', (r) => clr[r.cls])
      .on('mousemove', (ev, r) => H.showTip(ev, [H.line(r.parts.join(' × '), 'tt'), H.line(FMT.eur_k(r.value) + ' (' + N1.format(r.share) + ' %)'), H.line('kumuliert ' + N1.format(r.cum) + ' % · Klasse ' + r.cls, 'tt')])).on('mouseleave', () => H.hideTip());
    g.append('path').datum(top).attr('fill', 'none').attr('stroke', 'var(--color-fg)').attr('stroke-width', 1.8).attr('d', d3.line().x((r) => x(r.rank) + x.bandwidth() / 2).y((r) => y2(r.cum)));
    g.append('text').attr('x', (MG.l + w - MG.r) / 2).attr('y', Hh - 8).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text('Rang (Top ' + top.length + ' von ' + N0.format(T.items.length) + ' ' + n + 'er-Tupeln) · Balken = Umsatz in k€ · Linie = kumulierter Anteil');
  }
  function drawMatrix(T, combo, third, rg) {
    const box = $('ch-pat-m'), w = box.clientWidth; if (!w) return; box.replaceChildren();
    const rk = combo[0], ck = combo[1], tk = combo[2], C = T.C;
    const map = new Map(); let tot = 0;
    for (const c of C.cells) { if (rg !== 'Alle' && REGION[c.L] !== rg) continue; if (tk && third && c[tk] !== third) continue; const id = c[rk] + '\u0001' + c[ck]; map.set(id, (map.get(id) || 0) + c.v); tot += c.v; }
    const mem = (k) => { const m = new Map(); for (const c of C.cells) { if (rg !== 'Alle' && REGION[c.L] !== rg) continue; m.set(c[k], (m.get(c[k]) || 0) + c.v); } return [...m].sort((a, b) => b[1] - a[1]).map((x) => x[0]); };
    const rows = mem(rk), cols = mem(ck);
    const sorted = [...map.values()].sort((a, b) => b - a), cutoff = (() => { let cum = 0; for (const v of sorted) { cum += v; if (cum >= tot * 0.8) return v; } return 0; })();
    const mx = sorted[0] || 1, RH = rk === 'A' || rk === 'B' ? 26 : 17, top = 8 + (ck === 'P' ? 118 : ck === 'B' ? 66 : 30), left = Math.min(190, Math.max(...rows.map((r) => r.length)) * 6.6 + 14);
    const padR = ck === 'P' || ck === 'B' ? 120 : 12, cw = Math.max(16, Math.min(70, (w - left - padR) / cols.length)), Hh = top + rows.length * RH + 6, W = Math.max(w, left + cols.length * cw + padR);
    const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${Hh}`), g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
    cols.forEach((c, j) => g.append('text').attr('transform', `translate(${left + j * cw + cw / 2},${top - 5}) rotate(-45)`).attr('fill', 'var(--color-fg)').text(c));
    rows.forEach((r, i) => g.append('text').attr('x', left - 6).attr('y', top + i * RH + RH / 2).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').text(r));
    rows.forEach((r, i) => cols.forEach((c, j) => { const v = map.get(r + '\u0001' + c) || 0;
      g.append('rect').attr('x', left + j * cw + 1).attr('y', top + i * RH + 1).attr('width', cw - 2).attr('height', RH - 2).attr('rx', 3).attr('fill', dash.colors[0]).attr('fill-opacity', v ? 0.07 + 0.88 * Math.sqrt(v / mx) : 0.03)
        .attr('stroke', v && v >= cutoff ? 'var(--color-fg)' : 'none').attr('stroke-width', 1.4)
        .on('mousemove', (ev) => H.showTip(ev, [H.line(r + ' × ' + c + (third ? ' × ' + third : ''), 'tt'), H.line(FMT.eur_k(v) + ' (' + N1.format(v / tot * 100) + ' % von ' + (third ? 'Auswahl' : 'Summe') + ')'), H.line(v >= cutoff ? 'Klasse A (Kern der ersten 80 %)' : 'außerhalb der 80 %-Kernzone', 'tt')])).on('mouseleave', () => H.hideTip()); }));
  }
  function drawTable(T, combo) {
    const tb = $('tb-pat'), th = tb.querySelector('thead'), body = tb.querySelector('tbody'); th.replaceChildren(); body.replaceChildren();
    const hr = el('tr'); ['Rang', ...combo.split('').map((k) => DIM[k][1]), 'Umsatz', 'Anteil', 'Kumuliert', 'Klasse'].forEach((t, i, a) => { const c = el('th', i > a.length - 5 && i < a.length - 1 ? 'num' : null, t); hr.append(c); }); th.append(hr);
    T.items.slice(0, 20).forEach((r) => { const tr = el('tr'); [String(r.rank), ...r.parts, FMT.eur_k(r.value), FMT.pct(r.share), FMT.pct(r.cum), r.cls].forEach((t, i, a) => { const td = el('td', i >= a.length - 4 && i < a.length - 1 ? 'num' : null, t); tr.append(td); }); body.append(tr); });
  }
  function tile(box, l, v, sub) { const t = el('div', 'kt'); t.append(el('div', 'kl', l), el('div', 'kv', v)); if (sub) t.append(el('div', 'ks', sub)); box.append(t); }
  function draw() {
    const md = mode(); $('pa-single').hidden = md !== 'single'; $('pa-tup').hidden = md === 'single';
    modeSeg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === md)));
    if (md === 'single') return;
    const base = H.ready($('ch-pat'), 'pl_base'); if (!base) return;
    const n = +md, combo = comboOf(), rg = H.REGSEL(), list = COMBOS[n];
    if (comboSel.dataset.n !== md) { comboSel.replaceChildren(); list.forEach((c) => { const o = el('option', null, clabel(c)); o.value = c; comboSel.append(o); }); comboSel.dataset.n = md; }
    comboSel.value = combo;
    const T = tuples(base, combo, rg), it = T.items, nA = it.filter((x) => x.cls === 'A').length, nC = it.filter((x) => x.cls === 'C').length, sumC = it.filter((x) => x.cls === 'C').reduce((s, x) => s + x.share, 0);
    const top10 = it.slice(0, 10).reduce((s, x) => s + x.share, 0), tp = it[0];
    const kp = $('pat-kpi'); kp.replaceChildren();
    tile(kp, 'Kombinationen', N0.format(it.length), clabel(combo));
    tile(kp, 'A-Tupel (bis 80 %)', N0.format(nA), N1.format(nA / it.length * 100) + ' % der Kombinationen');
    tile(kp, 'Top-Tupel', N1.format(tp.share) + ' %', tp.parts.join(' · '));
    tile(kp, 'Top 10 zusammen', N1.format(top10) + ' %', 'des Umsatzes');
    tile(kp, 'C-Tupel (letzte 5 %)', N0.format(nC), N1.format(nC / it.length * 100) + ' % der Kombinationen');
    // dritte Dimension
    const tk = combo[2]; $('pat-third-wrap').hidden = !tk;
    let third = '';
    if (tk) { const ms = [...T.C.M[tk].map((x) => x.m)]; if (thirdSel.dataset.k !== combo) { thirdSel.replaceChildren(); const o0 = el('option', null, 'Alle (Summe)'); o0.value = ''; thirdSel.append(o0); ms.forEach((m) => { const o = el('option', null, m); o.value = m; thirdSel.append(o); }); thirdSel.dataset.k = combo; $('pat-third-l').firstChild.textContent = DIM[tk][1] + ' '; } third = ms.includes(P().pathird) ? P().pathird : ''; thirdSel.value = third; }
    $('pat-m-title').textContent = DIM[combo[0]][1] + ' × ' + DIM[combo[1]][1] + (third ? ' (' + third + ')' : tk ? ' (Summe über ' + DIM[tk][1] + ')' : '');
    drawPareto(T, combo, n); drawMatrix(T, combo, third, rg); drawTable(T, combo);
    // Summary + Empfehlung (regelbasiert)
    const k80 = it.findIndex((x) => x.cum >= 80) + 1, pctK = k80 / it.length * 100;
    const sumTxt = n + 'er-Tupel ' + clabel(combo) + (rg === 'Alle' ? '' : ' (' + rg + ')') + ': ' + N0.format(k80) + ' von ' + N0.format(it.length) + ' Kombinationen (' + N1.format(pctK) + ' %) erzeugen 80 % des Umsatzes; größtes Tupel: ' + tp.parts.join(' · ') + ' mit ' + N1.format(tp.share) + ' %. Die ' + N0.format(nC) + ' C-Tupel bringen zusammen nur ' + N1.format(sumC) + ' %.';
    const rec = pctK < 20 ? 'Stark konzentriert: Die A-Kombinationen als Fokussegmente führen – Verfügbarkeit, Preispflege und Aktionen gezielt dort bündeln; C-Tupel über Standardsortiment und Online-Kanal bedienen.' : pctK < 40 ? 'Mittlere Konzentration: A-Kombinationen priorisieren, bei B-Tupeln gezielt Wachstumshebel prüfen (Cross-Selling, Händlerpotenzial).' : 'Breit gestreut: Es gibt kaum Klumpenrisiko – Komplexität über Sortiments- und Bestandsbereinigung der C-Tupel (' + N1.format(sumC) + ' % Umsatz) senken.';
    $('pat-sum').textContent = sumTxt; $('pat-rec').textContent = rec;
  }
  const origPa = window.__hodDraw.pa;
  window.__hodDraw.pa = () => { draw(); if (mode() === 'single') origPa(); };
  window.__hodTup = { tuples, cube, draw };
})();
