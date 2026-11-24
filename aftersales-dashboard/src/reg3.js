(function () {
  const H = window.__hod; if (!H || !window.__hodDraw) return;
  const $ = (id) => document.getElementById(id), FMT = H.FMT;
  const nf = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }), N0 = nf(0), N1 = nf(1), N2 = nf(2);
  const svgNS = 'http://www.w3.org/2000/svg';
  const sg = (v) => (v >= 0 ? '+' : '−');
  const scope = () => { const a = H.DA(); return a.length ? { dim: a[0][0], member: a[0][1] } : { dim: 'Alle', member: 'Alle' }; };
  const empty = (el, txt) => { el.classList.remove('dash-skeleton'); el.replaceChildren(); const d = document.createElement('div'); d.className = 'fail'; d.textContent = txt; el.append(d); };
  // generische Brücke: Start-/Endsumme + Veränderungen
  function bridge(box, items, unitFmt) {
    const w = box.clientWidth; if (!w) return; box.replaceChildren();
    let run = 0; const bars = items.map((it) => { const a = it.kind === 'total' ? null : run, b = it.kind === 'total' ? it.value : run + it.value; if (it.kind === 'total') run = it.value; else run += it.value; return { it, a, b }; });
    const runs = bars.map((x) => x.b), lo = Math.min(...runs), hi = Math.max(...runs), pad = Math.max((hi - lo) * 0.7, hi * 0.02), dmin = lo - pad, dmax = hi + pad * 0.6;
    const Hh = 270, MG = { t: 22, b: 40, r: 10 }, svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${Hh}`), g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
    const y = d3.scaleLinear([dmin, dmax], [Hh - MG.b, MG.t]), tf = N0, L = H.measure(svg, [tf.format(dmax)]) + 12, x = d3.scaleBand(items.map((i) => i.label), [L, w - MG.r]).padding(0.25);
    y.ticks(4).forEach((t) => { g.append('line').attr('x1', L).attr('x2', w - MG.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', L - 6).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').text(tf.format(t)); });
    bars.forEach(({ it, a, b }, i) => {
      const tot = it.kind === 'total', top = tot ? b : Math.max(a, b), bot = tot ? dmin : Math.min(a, b), cx = x(it.label) + x.bandwidth() / 2;
      g.append('rect').attr('x', x(it.label)).attr('width', x.bandwidth()).attr('y', y(top)).attr('height', Math.max(2, y(bot) - y(top))).attr('rx', 3)
        .attr('fill', tot ? dash.colors[0] : it.value < 0 ? H.CRIT : dash.colors[0]).attr('fill-opacity', tot ? 0.9 : 0.6)
        .on('mousemove', (ev) => H.showTip(ev, [H.line(it.label, 'tt'), H.line(tot ? unitFmt(it.value) : sg(it.value) + unitFmt(Math.abs(it.value)))])).on('mouseleave', H.hideTip);
      g.append('text').attr('x', cx).attr('y', y(top) - 4).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg)').text(tot ? unitFmt(it.value) : sg(it.value) + unitFmt(Math.abs(it.value)));
      const words = it.label.split(' '); const l1 = words.slice(0, Math.ceil(words.length / 2)).join(' '), l2 = words.slice(Math.ceil(words.length / 2)).join(' ');
      g.append('text').attr('x', cx).attr('y', Hh - 24).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(l1);
      if (l2) g.append('text').attr('x', cx).attr('y', Hh - 11).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(l2);
    });
  }
  // Treiberbaum
  function tree(box, r) {
    const w = box.clientWidth; if (!w) return; box.replaceChildren();
    const wide = w >= 560, BH = 92, G = 14, rw = wide ? Math.min(230, w * 0.34) : w, gapX = wide ? 56 : 0, cw = wide ? w - rw - gapX : w, rootH = 104;
    const Hh = wide ? Math.max(rootH, 3 * BH + 2 * G) : rootH + 22 + 3 * BH + 2 * G;
    const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${Hh}`), g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
    const cg = g.append('g'), maxC = Math.max(Math.abs(r.c_d), Math.abs(r.c_f), Math.abs(r.c_a), 1e-6);
    const box1 = (x, y, bw, bh, label, value, cur, prev, contrib, onClick, root) => {
      const gg = g.append('g').style('cursor', onClick ? 'pointer' : 'default');
      gg.append('rect').attr('x', x).attr('y', y).attr('width', bw).attr('height', bh).attr('rx', 8).attr('fill', 'var(--color-bg)').attr('stroke', 'var(--color-border-line)');
      gg.append('text').attr('x', x + 12).attr('y', y + 20).attr('fill', 'var(--color-fg-muted)').text(label);
      gg.append('text').attr('x', x + 12).attr('y', y + 46).attr('fill', 'var(--color-fg)').style('font-family', 'var(--font-anthropic-serif)').style('font-size', '22px').text(value);
      const pc = (cur / prev - 1) * 100, bad = pc < 0;
      gg.append('text').attr('x', x + 12).attr('y', y + 66).attr('fill', bad ? 'var(--color-bad)' : 'var(--color-ok)').text(sg(pc) + N1.format(Math.abs(pc)) + ' % ggü. Vormonat');
      if (contrib != null) {
        gg.append('text').attr('x', x + 12).attr('y', y + 84).attr('fill', 'var(--color-fg-muted)').text('Beitrag ' + sg(contrib) + N0.format(Math.abs(contrib)) + ' k€');
        const bwid = Math.max(2, (bw - 150) * Math.abs(contrib) / maxC);
        gg.append('rect').attr('x', x + 130).attr('y', y + bh - 17).attr('width', bwid).attr('height', 6).attr('rx', 3).attr('fill', contrib < 0 ? H.CRIT : dash.colors[0]);
      }
      if (onClick) gg.on('click', onClick).append('title').text('Öffnet das passende Register');
      gg.on('mousemove', (ev) => H.showTip(ev, [H.line(label, 'tt'), H.line(value + ' (Vormonat ' + (root ? FMT.eur_k(prev) : '') + ')')].slice(0, root ? 2 : 1)));
      gg.on('mouseleave', H.hideTip);
    };
    const kids = [['Aktive Händler', N0.format(r.d), r.d, r.d_prev, r.c_d, () => H.show('dl')], ['Aufträge je Händler', N1.format(r.f), r.f, r.f_prev, r.c_f, () => H.show('dl')], ['Ø Auftragswert', FMT.eur(r.a), r.a, r.a_prev, r.c_a, () => H.show('mo')]];
    const ry = wide ? (Hh - rootH) / 2 : 0;
    box1(0, ry, rw, rootH, 'Umsatz', FMT.eur_k(r.revenue_k), r.revenue_k, r.revenue_prev, null, null, true);
    g.append('text').attr('x', 12).attr('y', ry + rootH - 8).attr('fill', 'var(--color-fg-muted)').text(sg(r.delta_k) + N0.format(Math.abs(r.delta_k)) + ' k€ ggü. Vormonat');
    kids.forEach(([l, v, c, p, ct, fn], i) => {
      const kx = wide ? rw + gapX : 0, ky = wide ? i * (BH + G) : rootH + 22 + i * (BH + G);
      if (wide) cg.append('path').attr('d', `M${rw} ${ry + rootH / 2} H${rw + gapX / 2} V${ky + BH / 2} H${kx}`).attr('fill', 'none').attr('stroke', 'var(--color-border-line)').attr('stroke-width', 1.5);
      else cg.append('line').attr('x1', w / 2).attr('x2', w / 2).attr('y1', rootH).attr('y2', ky).attr('stroke', 'var(--color-border-line)');
      box1(kx, ky, cw, BH, l, v, c, p, ct, fn, false);
      if (i < 2) g.append('text').attr('x', kx + cw / 2).attr('y', ky + BH + G / 2 + 5).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').style('font-size', '15px').text('×');
    });
  }
  function drawDt() {
    const rg = H.REGSEL(), m = H.M(), sc = scope();
    $('dt-note').hidden = H.DA().length < 2;
    const rows = H.ready($('ch-dt'), 'dt_tree', (r) => r.region === rg && r.dim === sc.dim && r.member === sc.member && r.month === m); if (!rows) return;
    const r = rows[0];
    document.querySelectorAll('#dt .dtmark').forEach((e) => { e.dataset.where = ['id=dt', 'region=' + rg, 'dim=' + sc.dim, 'member=' + sc.member, 'month=' + m].join('&'); e.textContent = r ? r[e.dataset.field] : '—'; });
    if (!r) { empty($('ch-dt'), 'Keine Daten für diese Auswahl'); empty($('ch-dt-b'), 'Keine Daten für diese Auswahl'); }
    else {
      tree($('ch-dt'), r);
      H.ready($('ch-dt-b'), 'dt_tree', () => true);
      bridge($('ch-dt-b'), [{ label: 'Umsatz Vormonat', value: r.revenue_prev, kind: 'total' }, { label: 'Aktive Händler', value: r.c_d, kind: 'delta' }, { label: 'Aufträge je Händler', value: r.c_f, kind: 'delta' }, { label: 'Ø Auftragswert', value: r.c_a, kind: 'delta' }, { label: 'Umsatz aktuell', value: r.revenue_k, kind: 'total' }], (v) => FMT.eur_k(v));
    }
    const gp = H.ready($('ch-dt-g'), 'dt_gp', (x) => x.region === rg && x.month === m);
    if (gp) bridge($('ch-dt-g'), gp.slice().sort((a, b) => a.step - b.step), (v) => FMT.eur_k(v));
    const ins = dash.data('ins_dtg'), i0 = ins.status === 'ok' ? ins.data.find((x) => x.region === rg && x.month === m) : null;
    document.querySelectorAll('#dt .dtgmark').forEach((e) => { e.dataset.where = ['id=dtg', 'region=' + rg, 'month=' + m].join('&'); e.textContent = i0 ? i0[e.dataset.field] : '—'; });
  }
  window.__hodDraw.dt = drawDt;
})();
