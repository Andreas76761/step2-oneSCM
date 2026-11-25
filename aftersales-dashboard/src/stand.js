// Datenstand je Register und Kennzahl: letzter Monat mit Daten, Quelle und Aktualisierung aus dem Datenkatalog; Warnung, wenn ein Register älter ist als die übrigen.
(function () {
  const root = document.getElementById('dash-root'); if (!root || window.__stand) return;
  const MAP = { mo: 'mo_monthly', pm: 'pm_monthly', pr: 'pr_monthly', lg: 'lg_monthly', tr: 'tr_monthly', wa: 'wa_monthly', cu: 'cu_monthly', co: 'co_monthly', mt: 'mt_monthly', mk: 'mk_monthly', iv: 'iv_monthly', tv: 'tv_monthly', er: 'er_monthly', qg: 'qg_monthly', lx: 'lx_monthly', el: 'el_monthly' };
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const lastOf = (rows, key) => { let m = null; for (const r of rows) { if (r.month && (key == null || (r[key] != null && r[key] !== ''))) { if (!m || r.month > m) m = r.month; } } return m; };
  const mlab = (m) => (window.__hod && window.__hod.mlabel ? window.__hod.mlabel(m) : m);
  function global() { let g = null; Object.values(MAP).forEach((ds) => { const r = rowsOf(ds); if (r) { const l = lastOf(r); if (l && (!g || l > g)) g = l; } }); return g; }
  function info(key) {
    const ds = MAP[key], rows = ds && rowsOf(ds); if (!rows) return null; const last = lastOf(rows), g = global(), cat = (rowsOf('data_catalog') || []).find((c) => c.dataset === ds) || {};
    return { ds, last, g, stale: !!last && !!g && last < g, src: cat.source_proposal || 'nicht hinterlegt', refresh: cat.refresh || 'nicht hinterlegt', status: cat.status || 'nicht hinterlegt', rows };
  }
  const spec = (key) => (window.__v3spec && window.__v3spec[key]) || null;
  function draw(key) {
    const panel = document.getElementById(key); if (!panel || panel.hidden) return; const i = info(key); if (!i || !i.last) return;
    let p = document.getElementById('stand-' + key); const intro = panel.querySelector('.intro');
    if (!p) { p = el('p', 'note'); p.id = 'stand-' + key; p.setAttribute('role', 'status'); if (intro) intro.after(p); else panel.prepend(p); }
    const txt = 'Datenstand: ' + mlab(i.last) + ' (' + i.ds + ') · Quelle (Vorschlag): ' + i.src + ' · Aktualisierung: ' + i.refresh + ' · Status: ' + i.status + (i.stale ? ' · ⚠ älter als die übrigen Register (neuester Stand: ' + mlab(i.g) + ')' : '');
    if (p.textContent !== txt) p.textContent = txt; p.style.color = i.stale ? 'var(--cds-chart-status-critical, #c0392b)' : ''; p.dataset.stale = i.stale ? '1' : '0';
    // je Kennzahl: letzter Monat, in dem die Kennzahl einen Wert hat
    const sp = spec(key) || [], byLabel = new Map(sp.map((a) => [a[1], a[0]]));
    panel.querySelectorAll('.ovtile').forEach((t) => { const l = t.querySelector('.kl'), kpi = l ? byLabel.get(l.textContent) : null, m = kpi ? lastOf(i.rows, kpi) : i.last, tt = 'Datenstand ' + mlab(m || i.last) + ' · ' + i.ds + ' · ' + i.src + ' · Aktualisierung ' + i.refresh; if (t.title !== tt) t.title = tt; });
  }
  function all() { Object.keys(MAP).forEach(draw); }
  let tm = null; const later = () => { clearTimeout(tm); tm = setTimeout(all, 60); };
  try { new MutationObserver(later).observe(root, { childList: true, subtree: true }); } catch (e) { /* ohne Beobachter */ }
  dash.onData(later); window.__stand = { info, draw: all, global };
})();
