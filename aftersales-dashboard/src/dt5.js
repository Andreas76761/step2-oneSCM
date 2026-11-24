(function () {
  const H = window.__hod; if (!H) return;
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const N0 = NF(0), N1 = NF(1), N2 = NF(2), sg = (v) => (v >= 0 ? '+' : '−');
  const RAW = ['revenue_k', 'dealers', 'orders', 'parc_k', 'served_k', 'visits_k', 'lines_k', 'list_k', 'price_idx', 'disc_pct'];
  // Multiplikativer Treiberbaum über 5 Schritte (Umsatz = Produkt der Treiber); jede Ebene zerlegt einen Treiber in zwei Faktoren
  const T = {
    rev: { l: 'Umsatz', u: 'k€ je Monat', f: (a) => a.revenue_k, fm: (v) => N0.format(v) + ' k€', k: ['dlr', 'rpd'], d: 'Netto-Teileumsatz, Ø je Monat im Zeitraum' },
    dlr: { l: 'Aktive Händler', f: (a) => a.dealers, fm: (v) => N0.format(v), k: [], d: 'Händler mit Auftrag in 90 Tagen', rec: ['Händlernetz stabilisieren: inaktive Händler reaktivieren, Besuchsprogramm und Aktionen.', 'Händlerbasis wächst – Aktivierung neuer Händler absichern.'] },
    rpd: { l: 'Umsatz je Händler', f: (a) => a.revenue_k / a.dealers, fm: (v) => N1.format(v) + ' k€', k: ['opd', 'aov'], d: 'Umsatz ÷ aktive Händler' },
    opd: { l: 'Aufträge je Händler', f: (a) => a.orders / a.dealers, fm: (v) => N1.format(v), k: ['spd', 'ops'], d: 'Aufträge ÷ aktive Händler' },
    aov: { l: 'Ø Auftragswert', f: (a) => a.revenue_k * 1000 / a.orders, fm: (v) => N0.format(v) + ' €', k: ['lpo', 'vpl'], d: 'Umsatz ÷ Aufträge' },
    spd: { l: 'Betreute Fz. je Händler', f: (a) => a.served_k * 1000 / a.dealers, fm: (v) => N0.format(v), k: ['ppd', 'ret'], d: 'Betreute Fahrzeuge ÷ aktive Händler' },
    ops: { l: 'Aufträge je Tsd. betr. Fz.', f: (a) => a.orders / a.served_k, fm: (v) => N2.format(v), k: ['vps', 'opv'], d: 'Aufträge ÷ betreute Fahrzeuge (in Tsd.)' },
    lpo: { l: 'Positionen je Auftrag', f: (a) => a.lines_k * 1000 / a.orders, fm: (v) => N2.format(v), k: [], d: 'Auftragspositionen ÷ Aufträge', rec: ['Positionszahl je Auftrag stärken: Zusatzverkauf und Teilesets am Bestellvorgang.', 'Mehr Positionen je Auftrag – Bündel- und Cross-Selling-Angebote halten.'] },
    vpl: { l: 'Ø Positionswert', f: (a) => a.revenue_k / a.lines_k, fm: (v) => N2.format(v) + ' €', k: ['lpl', 'rea'], d: 'Umsatz ÷ Positionen' },
    ppd: { l: 'Fz.-Bestand je Händler', f: (a) => a.parc_k * 1000 / a.dealers, fm: (v) => N0.format(v), k: [], d: 'Fahrzeugbestand ÷ aktive Händler', rec: ['Einzugsgebiet je Händler sinkt (Bestandsrückgang) – Netz- und Kapazitätsplanung prüfen.', 'Einzugsgebiet je Händler wächst – Kapazität und Verfügbarkeit absichern.'] },
    ret: { l: 'Retention', f: (a) => a.served_k / a.parc_k, fm: (v) => N1.format(v * 100) + ' %', k: [], d: 'Betreuter Bestand ÷ Fahrzeugbestand', rec: ['Retention fällt: Servicepakete, Erinnerungen und Neufahrzeug-Bindung ausbauen.', 'Retention steigt – Bindungsprogramme fortführen.'] },
    vps: { l: 'Besuche je betr. Fz.', f: (a) => a.visits_k / a.served_k, fm: (v) => N2.format(v), k: [], d: 'Werkstattbesuche pro betreutem Fahrzeug und Jahr', rec: ['Besuchsfrequenz sinkt: Wartungsintervalle aktiv ansprechen, Service-Flatrates anbieten.', 'Besuchsfrequenz steigt – Kapazität in den Werkstätten sichern.'] },
    opv: { l: 'Bestellungen je Besuch', f: (a) => a.orders / (a.visits_k * 1000), fm: (v) => N1.format(v * 100) + ' %', k: [], d: 'Händleraufträge ÷ Werkstattbesuche', rec: ['Teilebestellquote je Besuch sinkt: Verfügbarkeit, Lieferzeit und Bestellkomfort prüfen.', 'Bestellquote je Besuch steigt – Online-Bestellweg ausbauen.'] },
    lpl: { l: 'Listenpreis je Position', f: (a) => a.list_k / a.lines_k, fm: (v) => N2.format(v) + ' €', k: ['pix', 'mix'], d: 'Listenwert ÷ Positionen' },
    rea: { l: 'Preisrealisierung', f: (a) => a.revenue_k / a.list_k, fm: (v) => N1.format(v * 100) + ' %', k: ['dsc', 'bon'], d: 'Umsatz ÷ Listenwert' },
    pix: { l: 'Preisniveau-Index', f: (a) => a.price_idx / 100, fm: (v) => N1.format(v * 100), k: [], d: 'Preisindex gegenüber Wettbewerb (100 = Parität)', rec: ['Preisniveau sinkt: Preisspielräume bei margenstarken Teilen prüfen.', 'Preisniveau steigt – Wettbewerbsabstand im Markt-Register beobachten.'] },
    mix: { l: 'Sortimentsmix', f: (a) => (a.list_k / a.lines_k) / (a.price_idx / 100), fm: (v) => N2.format(v) + ' €', k: [], d: 'Listenpreis je Position bereinigt um das Preisniveau', rec: ['Mix verschiebt sich zu günstigen Positionen: Premium- und Margenartikel aktiv bewerben.', 'Mix verbessert sich – Fokus auf Margenartikel halten.'] },
    dsc: { l: '1 − Rabattquote', f: (a) => 1 - a.disc_pct / 100, fm: (v) => N1.format(v * 100) + ' %', k: [], d: 'Anteil des Listenwerts nach Rabatt', rec: ['Rabattquote steigt: Rabattfreigaben und Rabattmatrix prüfen.', 'Rabattquote sinkt – Rabattdisziplin beibehalten.'] },
    bon: { l: 'Boni-/Konditionsfaktor', f: (a) => a.revenue_k / a.list_k / (1 - a.disc_pct / 100), fm: (v) => N1.format(v * 100) + ' %', k: [], d: 'Boni, Skonti und sonstige Konditionen auf den Listenwert', rec: ['Boni und Skonti belasten stärker: Konditionssysteme prüfen.', 'Konditionen entlasten – Boniregeln beibehalten.'] }
  };
  const st = { cmp: 'prev', sel: 'rev', whatif: 5 };
  $('d5-cmp').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) { st.cmp = b.dataset.c; drawD5(); } });
  const mean = (rows) => { const a = {}; RAW.forEach((k) => { a[k] = d3.mean(rows, (r) => r[k]); }); return a; };
  function values(a) { const o = {}; Object.keys(T).forEach((k) => { o[k] = T[k].f(a); }); return o; }
  function contrib(v1, v0) {
    const c = { rev: v1.rev - v0.rev }, walk = (id) => { const n = T[id]; if (!n.k.length) return; const den = Math.log(v1[id] / v0[id]); n.k.forEach((k) => { c[k] = Math.abs(den) < 1e-12 ? 0 : c[id] * Math.log(v1[k] / v0[k]) / den; walk(k); }); };
    walk('rev'); return c;
  }
  function drawD5() {
    const box = $('ch-d5'), rg = H.REGSEL(), rows = H.ready(box, 'dt5', (r) => r.region === rg); if (!rows) return;
    const m = H.M(), ms = H.periodMonths(), pms = H.prevPeriodMonths(ms), cur = rows.filter((r) => ms.includes(r.month)); if (!cur.length) return;
    let base = st.cmp === 'prev' ? rows.filter((r) => pms.includes(r.month)) : rows.filter((r) => r.month <= m); let cmpLabel = st.cmp === 'prev' ? 'Vorperiode' : 'Ø der Monate bis Periodenende';
    if (!base.length) { base = rows; cmpLabel = 'Ø aller Monate (keine Vorperiode vorhanden)'; }
    $('d5-cmp').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.c === st.cmp)));
    const v1 = values(mean(cur)), v0 = values(mean(base)), C = contrib(v1, v0), w = box.clientWidth; if (!w) return;
    const root = d3.hierarchy({ id: 'rev' }, (d) => T[d.id].k.map((id) => ({ id }))), colW = 178, NW = 150, NH = 58, W = Math.max(w, 6 * colW + 10), leaves = root.leaves().length, Hh = leaves * (NH + 8) + 36;
    d3.tree().nodeSize([NH + 8, colW])(root);
    const y0 = d3.min(root.descendants(), (d) => d.x), nodes = root.descendants(), by = new Map(nodes.map((n) => [n.data.id, n]));
    const path = new Set(); for (let n = by.get(st.sel); n; n = n.parent) path.add(n.data.id);
    box.replaceChildren(); box.style.overflowX = 'auto';
    const svg = d3.select(box).append('svg').attr('width', W).attr('height', Hh).attr('viewBox', `0 0 ${W} ${Hh}`), g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
    const px = (n) => 4 + n.y, py = (n) => 28 + (n.x - y0);
    for (let i = 0; i <= 5; i++) g.append('text').attr('x', 4 + i * colW).attr('y', 12).attr('fill', 'var(--color-fg-muted)').text(i === 0 ? 'Ergebnis' : 'Schritt ' + i);
    root.links().forEach((l) => g.append('path').attr('fill', 'none').attr('stroke', path.has(l.target.data.id) ? 'var(--color-fg)' : 'var(--cds-chart-grid)').attr('stroke-width', path.has(l.target.data.id) ? 2 : 1.3)
      .attr('d', d3.linkHorizontal()({ source: [px(l.source) + NW, py(l.source) + NH / 2], target: [px(l.target), py(l.target) + NH / 2] })));
    const mxc = d3.max(nodes, (n) => Math.abs(C[n.data.id]));
    nodes.forEach((n) => {
      const id = n.data.id, nd = T[id], d = (v1[id] / v0[id] - 1) * 100, c = C[id], pos = c >= 0, col = pos ? dash.colors[2] || '#2b9a66' : H.CRIT, sel = id === st.sel;
      const gg = g.append('g').attr('transform', `translate(${px(n)},${py(n)})`).style('cursor', 'pointer').on('click', () => { st.sel = id; drawD5(); })
        .on('mousemove', (ev) => H.showTip(ev, [H.line(nd.l, 'tt'), H.line(nd.fm(v1[id]) + ' (' + cmpLabel + ': ' + nd.fm(v0[id]) + ')'), H.line('Veränderung ' + sg(d) + N1.format(Math.abs(d)) + ' % · Umsatzbeitrag ' + sg(c) + N1.format(Math.abs(c)) + ' k€', 'tt')])).on('mouseleave', () => H.hideTip());
      gg.append('rect').attr('width', NW).attr('height', NH).attr('rx', 8).attr('fill', 'var(--color-panel)').attr('stroke', sel ? 'var(--color-fg)' : path.has(id) ? 'var(--color-fg-muted)' : 'var(--color-border-line)').attr('stroke-width', sel ? 2.5 : 1.3);
      gg.append('rect').attr('x', 0).attr('y', NH - 5).attr('width', Math.max(3, NW * Math.abs(c) / (mxc || 1))).attr('height', 5).attr('rx', 2).attr('fill', col).attr('opacity', 0.85);
      gg.append('text').attr('x', 8).attr('y', 16).attr('fill', 'var(--color-fg)').style('font-weight', 600).text(nd.l);
      gg.append('text').attr('x', 8).attr('y', 32).attr('fill', 'var(--color-fg)').text(nd.fm(v1[id]));
      gg.append('text').attr('x', NW - 8).attr('y', 32).attr('text-anchor', 'end').attr('fill', col).text(sg(d) + N1.format(Math.abs(d)) + ' %');
      gg.append('text').attr('x', 8).attr('y', 46).attr('fill', 'var(--color-fg-muted)').style('font-size', '10px').text('Beitrag ' + sg(c) + N1.format(Math.abs(c)) + ' k€');
    });
    // Detail zum gewählten Treiber
    const id = st.sel, nd = T[id], d = (v1[id] / v0[id] - 1) * 100, det = $('d5-det'); det.replaceChildren();
    const h = el('div', 'bt', nd.l), p1 = el('div', 'bs', 'Schritt ' + by.get(id).depth + ' · ' + nd.d); det.append(h, p1);
    const f = el('div', 'gl'); f.append('Aktuell ', el('b', null, nd.fm(v1[id])), ' · ' + cmpLabel + ' ' + nd.fm(v0[id]) + ' · ' + sg(d) + N1.format(Math.abs(d)) + ' % · Umsatzbeitrag ', el('b', null, sg(C[id]) + N1.format(Math.abs(C[id])) + ' k€')); det.append(f);
    if (nd.k.length) det.append(el('div', 'gl', 'Zerlegung: ' + nd.l + ' = ' + nd.k.map((k) => T[k].l).join(' × ')));
    const wi = el('label', 'slider'), wv = el('b', null), sp = el('span', null, 'Was-wäre-wenn: Treiber ändern um '); sp.append(wv); const inp = el('input'); inp.type = 'range'; inp.min = -20; inp.max = 20; inp.step = 1; inp.value = st.whatif; wi.append(sp, inp); det.append(wi);
    const out = el('div', 'gl'); det.append(out);
    const upd = () => { st.whatif = +inp.value; wv.textContent = sg(st.whatif) + Math.abs(st.whatif) + ' %'; out.textContent = 'Wirkung auf den Umsatz: ' + sg(st.whatif) + N0.format(Math.abs(v1.rev * st.whatif / 100)) + ' k€ je Monat (' + sg(st.whatif) + N0.format(Math.abs(v1.rev * st.whatif / 100 * 12)) + ' k€ hochgerechnet auf 12 Monate) – alle anderen Treiber unverändert.'; };
    inp.addEventListener('input', upd); upd();
    if (nd.rec) { const r = el('div', 'rec'); r.append(el('b', null, 'Hinweis: '), nd.rec[d < 0 ? 0 : 1]); det.append(r); }
    // Summary
    const leaves_ = nodes.filter((n) => !T[n.data.id].k.length).map((n) => n.data.id).sort((a, b) => C[b] - C[a]), top = leaves_[0], low = leaves_[leaves_.length - 1], dR = v1.rev - v0.rev;
    $('d5-sum').textContent = 'Umsatz ' + N0.format(v1.rev) + ' k€ je Monat (' + sg(dR) + N0.format(Math.abs(dR)) + ' k€ bzw. ' + sg(dR) + N1.format(Math.abs(dR / v0.rev * 100)) + ' % gegenüber ' + cmpLabel + '). Größter positiver Treiber: ' + T[top].l + ' (' + sg(C[top]) + N1.format(Math.abs(C[top])) + ' k€), größter negativer: ' + T[low].l + ' (' + sg(C[low]) + N1.format(Math.abs(C[low])) + ' k€). Die 10 Blätter des Baums erklären die Veränderung vollständig (logarithmische Zerlegung).';
    $('d5-rec').textContent = (T[low].rec ? T[low].rec[C[low] < 0 ? 0 : 1] : '') + (C[low] < 0 ? ' ' : '') + 'Auf „' + T[low].l + '“ klicken für Details und Was-wäre-wenn.';
  }
  window.__hodDraw.dt5 = drawD5; const prev = window.__hodDraw.dt; window.__hodDraw.dt = () => { if (prev) prev(); drawD5(); };
  window.__dt5 = { T, values, mean, contrib, RAW };
})();
