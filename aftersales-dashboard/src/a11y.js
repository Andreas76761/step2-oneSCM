// Barrierefreiheit der Diagramme: Textalternative (Rolle, Name, Kurzbeschreibung) für jede Grafik und eine aufklappbare Datentabelle zu den Diagrammen mit bekannten Daten.
(function () {
  const root = document.getElementById('dash-root'); if (!root || window.__a11y) return;
  const NS = 'http://www.w3.org/2000/svg'; let n = 0;
  const st = document.createElement('style');
  st.textContent = '#dash-root .sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}#dash-root details.a11y-data{margin:2px 0 10px}#dash-root details.a11y-data>summary{font-size:var(--cds-font-size-caption);color:var(--color-fg-muted);cursor:pointer;padding:2px 0}#dash-root details.a11y-data>summary:focus-visible{outline:2px solid var(--color-fg);outline-offset:2px}#dash-root details.a11y-data table{margin-top:4px}';
  root.prepend(st);
  const txt = (e) => (e ? e.textContent.replace(/\s+/g, ' ').trim() : '');
  function titleFor(svg) {
    const card = svg.closest('.card') || svg.closest('section') || svg.parentElement, h = card && card.querySelector('.cardhead h3, h3, h4');
    return txt(h) || 'Diagramm';
  }
  function label(svg) {
    if (svg.getAttribute('data-a11y')) return; svg.setAttribute('data-a11y', '1');
    if (!svg.getAttribute('role')) svg.setAttribute('role', 'img');
    if (!svg.getAttribute('aria-label')) svg.setAttribute('aria-label', 'Diagramm: ' + titleFor(svg));
  }
  function scan() { root.querySelectorAll('svg:not([data-a11y])').forEach((s) => { if (!s.closest('button, .tab')) label(s); }); }
  try { new MutationObserver(() => { clearTimeout(scan.t); scan.t = setTimeout(scan, 30); }).observe(root, { childList: true, subtree: true }); } catch (e) { /* ohne Beobachter */ }
  scan();
  // host: Container der Grafik; o: { summary, caption, head: [...], rows: [[...]] }
  function table(host, o) {
    try {
      if (!host || !o || !o.rows || !o.rows.length) return;
      if (!host.isConnected) { o.tries = (o.tries || 0) + 1; if (o.tries < 25) setTimeout(() => table(host, o), 40); return; } // Grafik ist noch nicht in der Seite
      const old = host.nextElementSibling; if (old && old.classList.contains('a11y-data')) old.remove();
      const id = 'a11y-' + (++n), svg = host.querySelector('svg');
      if (svg) { label(svg); if (o.summary) { let s = document.createElement('span'); s.className = 'sr-only'; s.id = id + '-s'; s.textContent = o.summary; host.append(s); svg.setAttribute('aria-describedby', id + '-s'); } }
      const d = document.createElement('details'); d.className = 'a11y-data'; const sm = document.createElement('summary'); sm.textContent = 'Datentabelle zum Diagramm' + (o.summary ? ' – ' + o.summary : ''); d.append(sm);
      const wrap = document.createElement('div'); wrap.className = 'tbl-wrap'; const t = document.createElement('table'); t.className = 'tbl'; t.dataset.own = '1';
      const cap = document.createElement('caption'); cap.className = 'sr-only'; cap.textContent = o.caption || (svg && svg.getAttribute('aria-label')) || 'Diagrammdaten'; t.append(cap);
      const th = document.createElement('thead'), hr = document.createElement('tr'); (o.head || []).forEach((h, i) => { const c = document.createElement('th'); c.scope = 'col'; if (i) c.className = 'num'; c.textContent = h; hr.append(c); }); th.append(hr); t.append(th);
      const tb = document.createElement('tbody'); o.rows.forEach((r) => { const tr = document.createElement('tr'); r.forEach((v, i) => { const c = document.createElement(i === 0 ? 'th' : 'td'); if (i === 0) c.scope = 'row'; else c.className = 'num'; c.textContent = v == null ? '–' : String(v); tr.append(c); }); tb.append(tr); }); t.append(tb); wrap.append(t); d.append(wrap);
      host.after(d);
    } catch (e) { /* Textalternative ist optional */ }
  }
  window.__a11y = { table, label, scan };
})();
