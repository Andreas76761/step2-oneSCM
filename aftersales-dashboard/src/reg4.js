(function () {
  const H = window.__hod; if (!H) return;
  const FMT = H.FMT, N0 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const ICON = {
    'Bremse': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="6.6" r=".9"/><circle cx="17.4" cy="12" r=".9"/><circle cx="12" cy="17.4" r=".9"/><circle cx="6.6" cy="12" r=".9"/><path d="M18.5 4.5a9 9 0 0 1 2.5 4"/>',
    'Filter': '<rect x="6" y="6" width="12" height="14" rx="2"/><path d="M6 10h12M9 3h6v3H9zM10 13v4M14 13v4"/>',
    'Reifen & Räder': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/>',
    'Zündung & Glühen': '<path d="M9 3h6v4H9zM10 7v6l-1 2h6l-1-2V7M12 15v4M12 19l-2 2"/>',
    'Batterie & Starter': '<rect x="3" y="8" width="18" height="11" rx="2"/><path d="M7 8V5h3v3M14 8V5h3v3M8 13.5h4M10 11.5v4M15 13.5h3"/>',
    'Fahrwerk & Stoßdämpfer': '<path d="M12 3v2l-4 2 8 2-8 2 8 2-8 2 4 2v2"/><path d="M9 3h6M9 21h6"/>',
    'Auspuff & Abgas': '<path d="M3 15h9a4 4 0 0 0 4-4V8"/><rect x="14" y="3" width="4" height="5" rx="1"/><path d="M5 18h8"/>',
    'Klima & Kühlung': '<path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5"/>',
    'Öle & Flüssigkeiten': '<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/>',
    'Wischer & Sicht': '<path d="M3 18a11 11 0 0 1 18 0M12 18L18 7"/><circle cx="12" cy="18" r="1"/>',
    'Beleuchtung': '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    'Elektrik & Sensorik': '<path d="M13 3L5 13h6l-1 8 8-10h-6z"/>',
    'Antrieb & Getriebe': '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    'Kupplung': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 5a7 7 0 0 1 7 7M12 19a7 7 0 0 1-7-7"/>',
    'Lenkung': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M3.5 10.5c5-2 12-2 17 0M12 14v7"/>',
    'Karosserie & Anbau': '<path d="M3 16l2-7h14l2 7v3H3zM5 16h14"/><circle cx="7.5" cy="19" r="1.5"/><circle cx="16.5" cy="19" r="1.5"/>',
    'Riemen & Steuerung': '<circle cx="7" cy="12" r="3.5"/><circle cx="17" cy="12" r="3.5"/><path d="M7 8.5h10M7 15.5h10"/>',
    'Dichtungen & Motorteile': '<rect x="3" y="7" width="18" height="10" rx="2"/><circle cx="7" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="17" cy="12" r="1.5"/>',
    'Zubehör & Pflege': '<path d="M9 8h6v12H9zM10 8V5h4v3M14 5h3M10 14h4"/>',
    'Innenraum & Komfort': '<path d="M8 3h4l1 9h5a2 2 0 0 1 2 2v1H8zM8 15v5M18 15v5"/>' };
  const PG = new Set(Object.keys(ICON));
  const iconSvg = (name) => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', '34'); s.setAttribute('height', '34'); s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor'); s.setAttribute('stroke-width', '1.6'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round'); s.innerHTML = ICON[name]; return s; };
  const pop = $('gpop') || (() => { const d = el('div', 'gpop'); d.id = 'gpop'; d.hidden = true; document.getElementById('app').append(d); return d; })();
  function $(id) { return document.getElementById(id); }
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  let cur = null;
  function place(ev) { window.__place(pop, ev); }
  function build(name) {
    const rg = H.REGSEL(), m = H.M(), iv = rowsOf('iv_group'), mk = rowsOf('mk_group'), ws = rowsOf('ws_groups');
    const c = el('div'), head = el('div', 'gh'), ic = el('div', 'gic'); ic.append(iconSvg(name)); const ht = el('div'); ht.append(el('div', 'bt', name), el('div', 'bs', 'Produktgruppe · ' + (rg === 'Alle' ? 'alle Regionen' : rg) + ' · ' + H.mlabel(m)));
    head.append(ic, ht); c.append(head);
    const a = iv && iv.find((r) => r.region === rg && r.month === m && r.group === name), b = mk && mk.find((r) => r.region === rg && r.month === m && r.group === name);
    const tiles = el('div', 'tiles');
    const tile = (l, v, bad) => { const t = el('div', 'tile'); t.append(el('div', 'tl', l), el('div', 'tv' + (bad ? ' bad' : ''), v)); tiles.append(t); };
    tile('Marktanteil', b ? FMT.pct(b.market_share_pct) : '–', b && b.share_change_pts < 0);
    tile('Δ Anteil', b ? FMT.pts(b.share_change_pts) : '–', b && b.share_change_pts < 0);
    tile('Preisabstand', b ? FMT.pct(b.price_gap_pct) : '–', b && b.price_gap_pct > 2);
    tile('Reichweite', a ? FMT.days(a.days_cover) : '–', false);
    tile('Servicegrad', a ? FMT.pct(a.service_level_pct) : '–', a && a.service_level_pct < 95);
    tile('Obsoleszenz', a ? FMT.eur_k(a.obsolete_risk_k) : '–', false);
    c.append(tiles);
    if (ws) { const x = ws.filter((r) => r.group === name && r.month === m), v = x.reduce((s, r) => s + r.lohn_k + r.teile_k, 0), t = x.reduce((s, r) => s + r.lohn_target_k + r.teile_target_k, 0), l = x.reduce((s, r) => s + r.lohn_k, 0);
      if (x.length) { const ln = el('div', 'gl'); ln.append('Werkstattumsatz ', el('b', null, FMT.eur_k(v)), ' (Lohn ' + FMT.eur_k(l) + ' · Teile ' + FMT.eur_k(v - l) + ') · Ziel ' + N0.format(v / t * 100) + ' %'); c.append(ln); } }
    if (mk) { const pts = mk.filter((r) => r.region === rg && r.group === name && r.month <= m); if (pts.length > 1) {
      const SW = 276, SH = 46, svg = d3.select(c).append('div').append('svg').attr('width', '100%').attr('viewBox', `0 0 ${SW} ${SH}`);
      const ys = d3.scaleLinear(d3.extent(pts, (r) => r.market_share_pct), [SH - 6, 6]), xs = d3.scalePoint(pts.map((r) => r.month), [4, SW - 4]);
      svg.append('path').datum(pts).attr('fill', 'none').attr('stroke', dash.colors[0]).attr('stroke-width', 2).attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round').attr('d', d3.line().x((r) => xs(r.month)).y((r) => ys(r.market_share_pct)));
      svg.append('circle').attr('cx', xs(pts[pts.length - 1].month)).attr('cy', ys(pts[pts.length - 1].market_share_pct)).attr('r', 3.5).attr('fill', dash.colors[0]);
      c.append(el('div', 'pcap', 'Marktanteil, Verlauf bis ' + H.mlabel(m))); } }
    const rec = el('div', 'rec'); rec.append(el('b', null, 'Hinweis: '));
    rec.append(b && b.price_gap_pct > 2 && b.share_change_pts < 0 ? 'Preisaufschlag bei sinkendem Marktanteil – Preise gegen ' + b.main_competitor + ' prüfen.' : a && a.service_level_pct < 95 ? 'Servicegrad unter 95 % – Nachschub und Sicherheitsbestand prüfen.' : a && a.obsolete_risk_k > 150 ? 'Hohes Obsoleszenzrisiko – Abverkauf oder Rückgabe an Lieferanten prüfen.' : 'Unauffällig – Entwicklung weiter beobachten.');
    c.append(rec);
    return c;
  }
  function show(ev, name) {
    if (!PG.has(name)) return;
    H.hideTip();
    if (cur !== name + '|' + H.REGSEL() + '|' + H.M() || pop.hidden) { pop.replaceChildren(build(name)); cur = name + '|' + H.REGSEL() + '|' + H.M(); }
    pop.hidden = false; place(ev);
  }
  function hide() { pop.hidden = true; cur = null; }
  window.__groupPop = { show, hide };
  const nameOf = (t) => {
    const d = t.closest && t.closest('[data-pg]'); if (d) return d.dataset.pg;
    const tag = t.tagName; if ((tag === 'TD' || tag === 'text' || tag === 'tspan') && PG.has((t.textContent || '').trim())) return t.textContent.trim();
    return null;
  };
  H.root.addEventListener('mouseover', (ev) => { const n = nameOf(ev.target); if (n) show(ev, n); });
  H.root.addEventListener('mousemove', (ev) => { if (!pop.hidden) { const n = nameOf(ev.target); if (n) place(ev); else hide(); } });
  H.root.addEventListener('mouseout', (ev) => { if (!pop.hidden && !nameOf(ev.relatedTarget || document.body)) hide(); });
})();
