(function () {
  const H = window.__hod; if (!H) return;
  const st = new Map(), KEY = 'hod-copt-v1';
  let saved = {}; try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { saved = {}; }
  const defaults = () => ({ leg: true, vj: false, unit: true });
  const get = (id) => { if (!st.has(id)) st.set(id, Object.assign(defaults(), saved[id] || {})); return st.get(id); };
  const persist = () => { try { const o = {}; st.forEach((v, k) => { o[k] = v; }); localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* ohne Speicher */ } };
  window.__copt = { get };
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const UNIT = /^(\s*[+−-]?\s*[\d.,]+)\s*(k€|Mio\. €|€|%|Tage|Tsd\.|Pkt\.|Std\.)(\s.*)?$/;
  function apply(chart) {
    const o = get(chart.id), bar = chart.__bar, card = chart.closest('.card') || chart.parentElement;
    // Legende: Farbschlüssel (Hinweiszeile), HTML-Legenden und Legenden im Diagramm
    card.querySelectorAll(':scope > .note, :scope > .legend, .chart + .legend, .legend').forEach((n) => { if (!n.closest('.copt')) n.hidden = !o.leg; });
    chart.querySelectorAll('.lgd').forEach((n) => { n.style.display = o.leg ? '' : 'none'; });
    // Einheit: Einheiten hinter Zahlen in Beschriftungen ausblenden
    const removed = new Set();
    chart.querySelectorAll('svg text').forEach((t) => {
      if (!t.children.length) {
        if (t.__o === undefined) t.__o = t.textContent;
        const txt = t.__o, m = txt.length < 40 && UNIT.exec(txt);
        if (!o.unit && m) { removed.add(m[2]); t.textContent = m[1].trim() + (m[3] || ''); } else if (t.textContent !== txt) t.textContent = txt;
      }
    });
    if (bar) {
      bar.querySelector('[data-o="leg"]').setAttribute('aria-pressed', String(o.leg));
      bar.querySelector('[data-o="unit"]').setAttribute('aria-pressed', String(o.unit));
      const vb = bar.querySelector('[data-o="vj"]'), can = chart.dataset.vj === '1'; vb.setAttribute('aria-pressed', String(o.vj && can)); vb.disabled = !can;
      vb.title = can ? 'Veränderung zum Vorjahr ein- bzw. ausblenden' : 'Für diese Grafik nicht verfügbar (kein Vorjahresbezug in den Daten)';
      bar.querySelector('.cunit').textContent = !o.unit && removed.size ? 'Einheit: ' + [...removed].join(' · ') : '';
    }
  }
  let pending = new Set(), raf = 0;
  const schedule = (c) => { pending.add(c); if (!raf) raf = requestAnimationFrame(() => { raf = 0; const p = [...pending]; pending = new Set(); p.forEach(apply); }); };
  function init(chart) {
    if (chart.__bar || !chart.id || chart.dataset.nocopt) return;
    const bar = el('div', 'copt'); bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Anzeigeoptionen der Grafik');
    [['leg', 'Legende'], ['vj', 'Δ VJ'], ['unit', 'Einheit']].forEach(([k, l]) => { const b = el('button', null, l); b.type = 'button'; b.dataset.o = k; b.setAttribute('aria-pressed', 'false'); bar.append(b); });
    bar.append(el('span', 'cunit'));
    bar.addEventListener('click', (ev) => {
      const b = ev.target.closest('button'); if (!b || b.disabled) return;
      const o = get(chart.id), k = b.dataset.o; o[k] = !o[k]; persist();
      if (k === 'vj') H.redraw(); else apply(chart);
    });
    chart.parentElement.insertBefore(bar, chart); chart.__bar = bar;
    new MutationObserver(() => schedule(chart)).observe(chart, { childList: true });
    apply(chart);
  }
  const all = () => H.root.querySelectorAll('.chart[id]').forEach(init);
  all();
  // Diagramme, die erst später Container erhalten, nachrüsten
  new MutationObserver(() => all()).observe(H.root, { childList: true, subtree: true });
})();
