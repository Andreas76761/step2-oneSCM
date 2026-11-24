// Ersatz für die Dashboard-Laufzeitumgebung (window.dash): lädt alle Datensätze aus /data und rechnet berechnete Datensätze (dash.calc) lokal.
(function () {
  function getJSON(url) { const x = new XMLHttpRequest(); x.open('GET', url, false); x.send(); if (x.status !== 200) throw new Error('Laden fehlgeschlagen: ' + url); return JSON.parse(x.responseText); }
  const manifest = getJSON('/data/_manifest.json'), raw = {}, defs = {}, cache = {}, lsn = [], params = {};
  manifest.forEach((m) => { raw[m.id] = getJSON('/data/' + m.file); });
  function get(id) {
    if (Object.prototype.hasOwnProperty.call(raw, id)) return { status: 'ok', data: raw[id] };
    const d = defs[id]; if (!d) return { status: 'error', error: 'Unbekannter Datensatz ' + id };
    if (cache[id]) return cache[id];
    const ins = (d.inputs || []).map(get); if (ins.some((x) => x.status === 'loading')) return { status: 'loading' };
    const bad = ins.find((x) => x.status !== 'ok'); if (bad) return (cache[id] = { status: 'error', error: bad.error });
    try { return (cache[id] = { status: 'ok', data: d.fn.apply(null, ins.map((x) => x.data)) }); } catch (e) { return (cache[id] = { status: 'error', error: String(e && e.message || e) }); }
  }
  const notify = () => lsn.slice().forEach((f) => { try { f(); } catch (e) { setTimeout(() => { throw e; }); } });
  window.dash = {
    colors: ['#2a6fdb', '#e1783d', '#2b9a66', '#8b5cf6', '#d6336c', '#12a5b0'],
    data: get,
    calc: (id, def) => { defs[id] = def; delete cache[id]; },
    params: () => Object.assign({}, params),
    setParams: (p) => { Object.keys(p).forEach((k) => { if (p[k] == null || p[k] === '') delete params[k]; else params[k] = p[k]; }); notify(); },
    resetParams: () => { Object.keys(params).forEach((k) => delete params[k]); notify(); },
    setLink: () => {}, onData: (f) => { lsn.push(f); },
    _notify: notify, _raw: raw, _defs: defs
  };
  window.addEventListener('load', () => setTimeout(notify, 0));
})();
