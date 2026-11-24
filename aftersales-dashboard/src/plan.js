(function () {
  const H = window.__hod; if (!H) return;
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const N0 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }), N1 = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const sg = (v) => (v >= 0 ? '+' : '−');
  const DIMS = [['Land', 'Land'], ['Produktgruppe', 'Produktgruppe'], ['Baumuster', 'Baumuster'], ['Monat', 'Monat'], ['Alter', 'Altersklasse']];
  const GROWTH = 5;
  let db = null, uid = null, base = null, baseTot = 0, T = null, mode = 'hold', locks = {}, localRev = null, saveT = null, saved = 'Noch nicht gespeichert', msgs = [];
  const lockedSum = (d) => Object.values(locks[d] || {}).reduce((s, v) => s + v, 0);
  function values(dim) {
    const L = locks[dim] || {}, items = base.get(dim); let w = 0, ls = 0;
    items.forEach((i) => { if (L[i.member] != null) ls += L[i.member]; else w += i.base_k; });
    const avail = Math.max(0, T - ls);
    return items.map((i) => (L[i.member] != null ? Object.assign({}, i, { value: L[i.member], locked: true }) : Object.assign({}, i, { value: w ? avail * i.base_k / w : 0, locked: false })));
  }
  const nLocks = () => Object.values(locks).reduce((s, o) => s + Object.keys(o).length, 0);
  // ---------- persistence ----------
  function persist() {
    clearTimeout(saveT); saved = db ? 'Wird gespeichert …' : 'Nur in dieser Sitzung (Speichern nicht verfügbar)'; renderStatus();
    if (!db) return;
    saveT = setTimeout(async () => {
      localRev = String(Date.now()) + Math.random().toString(36).slice(2, 6);
      try { await db.doc('plan/fy2027').set({ total: T, mode, locks, rev: localRev, updated: new Date().toISOString(), by: uid }); saved = 'Gespeichert ' + new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); }
      catch (e) { saved = 'Speichern fehlgeschlagen' + (e && e.code ? ' (' + e.code + ')' : ''); }
      renderStatus();
    }, 600);
  }
  function applyRemote(d) { if (!d || d.rev === localRev || !base) return; T = d.total; mode = d.mode || 'hold'; locks = d.locks || {}; saved = 'Aktualisiert durch andere Ansicht'; render(); }
  // ---------- Aktionen ----------
  function setTotal(x) { if (!(x >= 0)) return; msgs = []; T = x; persist(); render(); }
  function edit(dim, member, x) {
    if (!(x >= 0)) { render(); return; }
    msgs = [];
    const vals = values(dim), old = vals.find((v) => v.member === member).value;
    if (mode === 'recalc') { const nt = vals.reduce((s, v) => s + (v.member === member ? x : v.value), 0); msgs.push('Gesamtziel angepasst: ' + N0.format(T) + ' → ' + N0.format(nt) + ' k€ (' + sg(nt - T) + N0.format(Math.abs(nt - T)) + ' k€) durch Änderung ' + member + ' (' + dim + ').'); T = nt; }
    (locks[dim] = locks[dim] || {})[member] = x; persist(); render();
  }
  function toggleLock(dim, member) {
    msgs = []; const L = (locks[dim] = locks[dim] || {});
    if (L[member] != null) delete L[member]; else L[member] = values(dim).find((v) => v.member === member).value;
    if (!Object.keys(L).length) delete locks[dim]; persist(); render();
  }
  function reset() { msgs = []; locks = {}; T = Math.round(baseTot * (1 + GROWTH / 100)); mode = 'hold'; persist(); render(); }
  // ---------- Rendering ----------
  function renderStatus() { const s = $('pl-saved'); if (s) s.textContent = saved; }
  function render() {
    if (!base) return;
    $('pl-total').value = String(Math.round(T)); $('pl-base').textContent = N0.format(baseTot) + ' k€';
    const gr = (T / baseTot - 1) * 100; $('pl-growth').textContent = sg(gr) + N1.format(Math.abs(gr)) + ' %'; $('pl-locks').textContent = String(nLocks());
    $('pl-mode').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === mode)));
    let worst = 0; const warn = [];
    DIMS.forEach(([dim, label]) => {
      const vals = values(dim), sum = vals.reduce((s, v) => s + v.value, 0), diff = sum - T, ls = lockedSum(dim);
      if (Math.abs(diff) > 0.5) worst = Math.max(worst, Math.abs(diff));
      if (ls > T + 0.5) warn.push(label + ': fixierte Werte (' + N0.format(ls) + ' k€) übersteigen das Gesamtziel – Gesamtziel erhöhen oder Fixierungen lösen.');
      else if (vals.every((v) => v.locked) && Math.abs(diff) > 0.5) warn.push(label + ': alle Werte fixiert – Summe weicht um ' + sg(diff) + N0.format(Math.abs(diff)) + ' k€ vom Gesamtziel ab.');
      const tb = $('pl-t-' + dim).tBodies[0]; tb.replaceChildren();
      vals.forEach((v) => {
        const tr = el('tr', v.locked ? 'locked' : ''), inp = el('input'); inp.type = 'number'; inp.min = '0'; inp.step = '1'; inp.value = String(Math.round(v.value)); inp.dataset.dim = dim; inp.dataset.m = v.member; inp.setAttribute('aria-label', 'Plan ' + v.member);
        const d = (v.value / v.base_k - 1) * 100, lb = el('button', 'lockb', v.locked ? '🔒' : '🔓'); lb.dataset.dim = dim; lb.dataset.m = v.member; lb.title = v.locked ? 'Fixierung lösen' : 'Wert fixieren'; lb.type = 'button';
        const c3 = el('td'); c3.append(inp); const c6 = el('td'); c6.append(lb);
        tr.append(el('td', null, v.member), el('td', null, N0.format(v.base_k)), c3, el('td', null, N1.format(v.value / T * 100) + ' %'), el('td', d < 0 ? 'bad' : 'good', sg(d) + N1.format(Math.abs(d)) + ' %'), c6); tb.append(tr);
      });
      const ft = $('pl-f-' + dim); ft.replaceChildren(); ft.append(el('span', null, 'Σ Plan ' + N0.format(sum) + ' k€'), el('span', Math.abs(diff) > 0.5 ? 'bad' : 'good', Math.abs(diff) > 0.5 ? 'Differenz ' + sg(diff) + N0.format(Math.abs(diff)) + ' k€' : 'passt zum Gesamtziel'));
    });
    $('pl-msg').replaceChildren(...msgs.concat(warn).map((t) => el('div', warn.includes(t) ? 'bad' : 'mut small', t)));
    $('pl-status').textContent = worst > 0.5 ? 'Abweichung zwischen Dimensionen' : 'Konsistent'; $('pl-status').parentElement.parentElement.dataset.ok = String(worst <= 0.5);
    renderStatus(); drawMonths(); lookup();
  }
  function drawMonths() {
    const box = $('ch-pl'), vals = values('Monat'), w = box.clientWidth; if (!w) return; box.classList.remove('dash-skeleton'); box.replaceChildren();
    const Hh = 250, MG = { t: 14, r: 10, b: 28 }, svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${Hh}`), g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
    const top = d3.max(vals, (v) => Math.max(v.value, v.base_k)) * 1.1, y = d3.scaleLinear([0, top], [Hh - MG.b, MG.t]).nice(4), L = H.measure(svg, [N0.format(y.domain()[1])]) + 12, x = d3.scaleBand(vals.map((v) => v.member), [L, w - MG.r]).padding(0.2), x2 = d3.scaleBand(['b', 'p'], [0, x.bandwidth()]).padding(0.08);
    y.ticks(4).forEach((t) => { g.append('line').attr('x1', L).attr('x2', w - MG.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', L - 6).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').text(N0.format(t)); });
    vals.forEach((v) => {
      g.append('text').attr('x', x(v.member) + x.bandwidth() / 2).attr('y', Hh - 10).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(v.member);
      g.append('rect').attr('x', x(v.member) + x2('b')).attr('width', x2.bandwidth()).attr('y', y(v.base_k)).attr('height', y(0) - y(v.base_k)).attr('rx', 2).attr('fill', 'var(--cds-chart-muted, #9aa0a8)').attr('fill-opacity', 0.6);
      g.append('rect').attr('x', x(v.member) + x2('p')).attr('width', x2.bandwidth()).attr('y', y(v.value)).attr('height', y(0) - y(v.value)).attr('rx', 2).attr('fill', dash.colors[0]).attr('stroke', v.locked ? 'var(--color-fg)' : 'none').attr('stroke-width', 1.5)
        .on('mousemove', (ev) => H.showTip(ev, [H.line(v.member, 'tt'), H.line('Plan ' + N0.format(v.value) + ' k€' + (v.locked ? ' (fixiert)' : '')), H.line('Basis ' + N0.format(v.base_k) + ' k€', 'tt')])).on('mouseleave', H.hideTip);
    });
    const lg = box.parentElement.querySelector('.legend'); if (lg && !lg.children.length) [['Basis (Ist letzte 12 Monate)', 'var(--cds-chart-muted, #9aa0a8)'], ['Plan 2027', dash.colors[0]]].forEach(([t, c]) => { const s = el('span', 'lg'), i = el('i'); i.style.background = c; s.append(i, t); lg.append(s); });
  }
  const sel = {}; DIMS.forEach(([d]) => { sel[d] = $('pl-s-' + d); sel[d].addEventListener('change', lookup); });
  function lookup() {
    if (!base) return; let share = 1, parts = [];
    DIMS.forEach(([d]) => { if (sel[d].options.length === 0) { sel[d].replaceChildren(...base.get(d).map((i) => new Option(i.member, i.member))); } const v = values(d).find((x) => x.member === sel[d].value); share *= v.value / T; parts.push(v); });
    $('pl-cell').textContent = N1.format(T * share) + ' k€ (' + new Intl.NumberFormat('de-DE', { maximumFractionDigits: share * 100 < 0.1 ? 4 : 2 }).format(share * 100) + ' % des Gesamtziels, Näherung über unabhängige Verteilungsschlüssel)';
  }
  // ---------- Events ----------
  $('pl-total').addEventListener('change', () => { const v = parseFloat($('pl-total').value); setTimeout(() => setTotal(v), 0); });
  $('pl-mode').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (!b || b.dataset.m === mode) return; mode = b.dataset.m; msgs = []; persist(); render(); });
  $('pl-reset').addEventListener('click', reset);
  $('pl-dims').addEventListener('change', (ev) => { const i = ev.target.closest('input[data-dim]'); if (i) { const d = i.dataset.dim, m = i.dataset.m, v = parseFloat(i.value); setTimeout(() => edit(d, m, v), 0); } });
  $('pl-dims').addEventListener('click', (ev) => { const b = ev.target.closest('button.lockb'); if (b) toggleLock(b.dataset.dim, b.dataset.m); });
  $('pl-growth-in').addEventListener('change', () => { const g = parseFloat($('pl-growth-in').value); if (Number.isFinite(g)) { setTimeout(() => { setTotal(Math.round(baseTot * (1 + g / 100))); $('pl-growth-in').value = ''; }, 0); } });
  // ---------- Daten ----------
  function init() {
    const d = dash.data('pl_base'); if (d.status !== 'ok' || base) return;
    base = new Map(); d.data.forEach((r) => { if (r.dim === 'Gesamt') { baseTot = r.base_k; return; } if (!base.has(r.dim)) base.set(r.dim, []); base.get(r.dim).push(r); });
    base.forEach((v) => v.sort((a, b) => a.order - b.order));
    T = Math.round(baseTot * (1 + GROWTH / 100)); render(); trySub();
  }
  let subbed = false;
  function trySub() {
    if (subbed || !db || !base) return; subbed = true;
    db.doc('plan/fy2027').onSnapshot((s) => { if (s.exists) applyRemote(s.data()); else { saved = 'Noch nicht gespeichert'; renderStatus(); } }, () => {});
  }
  window.__hodDraw.pl = () => { init(); if (base) { drawMonths(); } };
  (async () => {
    try { const c = window.claude; if (c && c.use) { db = await c.use('db'); try { const u = await c.use('user'); uid = u && u.id ? await u.id() : null; } catch (e) { uid = null; } } } catch (e) { db = null; }
    if (!db) saved = 'Nur in dieser Sitzung (Speichern nicht verfügbar)';
    init(); trySub(); renderStatus();
  })();
  dash.onData(init);
})();
