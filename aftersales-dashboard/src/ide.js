(function () {
  const H = window.__hod; if (!H) return;
  const $ = (id) => document.getElementById(id);
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const STAT = ['Offen', 'In Prüfung', 'Geplant', 'Erledigt', 'Verworfen'], REC = ['Nächster Schritt', 'Später', 'Reminder', 'Nicht in der Webapp', 'Umgesetzt', 'Bereits abgedeckt'];
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const today = () => new Date().toISOString().slice(0, 10), fdate = (d) => (d ? d.slice(8, 10) + '.' + d.slice(5, 7) + '.' + d.slice(0, 4) : '–');
  let db = null, uid = null, state = {}, localRev = null, saveT = null, saved = 'Noch nicht gespeichert', subbed = false;
  const f = { rec: 'Alle', reg: 'Alle', q: '' };
  const dflt = (r) => ({ s: r.rec === 'Umgesetzt' || r.rec === 'Bereits abgedeckt' ? 'Erledigt' : r.rec === 'Nicht in der Webapp' ? 'Verworfen' : 'Offen', d: r.due || '', n: '' });
  const get = (r) => Object.assign(dflt(r), state[r.id] || {});
  const open = (s) => s.s !== 'Erledigt' && s.s !== 'Verworfen', due = (s) => open(s) && s.d && s.d <= today();
  function persist() {
    clearTimeout(saveT); saved = db ? 'Wird gespeichert …' : 'Nur in dieser Sitzung (Speichern nicht verfügbar)'; status(); if (!db) return;
    saveT = setTimeout(async () => { localRev = String(Date.now()) + Math.random().toString(36).slice(2, 6); try { await db.doc('ideen/state').set({ state, rev: localRev, updated: new Date().toISOString(), by: uid }); saved = 'Gespeichert ' + new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }); } catch (e) { saved = 'Speichern fehlgeschlagen' + (e && e.code ? ' (' + e.code + ')' : ''); } status(); }, 600);
  }
  const status = () => { const s = $('ide-saved'); if (s) s.textContent = saved; };
  function set(id, k, v) { const r = (rowsOf('ideen') || []).find((x) => x.id === id); if (!r) return; state[id] = Object.assign(get(r), { [k]: v }); persist(); draw(); }
  function tile(box, items) { box.replaceChildren(...items.map(([l, v, s]) => { const t = el('div', 'kt'); t.append(el('div', 'kl', l), el('div', 'kv', v), el('div', 'ks', s)); return t; })); }
  const cls = { hoch: 'good', mittel: 'warn', niedrig: 'bad' };
  function draw() {
    const all = rowsOf('ideen'); if (!all) { H.ready($('ide-tiles'), 'ideen'); return; }
    const rs = [...new Set(all.map((r) => r.register))].sort(); if ($('ide-reg').dataset.n !== String(rs.length)) { $('ide-reg').replaceChildren(new Option('Alle Register', 'Alle'), ...rs.map((r) => new Option(r, r))); $('ide-reg').dataset.n = String(rs.length); } if ($('ide-rec').dataset.n !== '1') { $('ide-rec').replaceChildren(new Option('Alle Empfehlungen', 'Alle'), ...REC.map((r) => new Option(r, r))); $('ide-rec').dataset.n = '1'; } $('ide-reg').value = f.reg; $('ide-rec').value = f.rec;
    const cnt = (fn) => all.filter(fn).length, S = all.map(get);
    tile($('ide-tiles'), [['Ideen und Impulse', String(all.length), 'aus dem Anbieter-Portfolio (14.10.2026)'], ['Nächster Schritt', String(cnt((r) => r.rec === 'Nächster Schritt')), 'Empfohlen, sobald Daten da sind'], ['Wiedervorlage fällig', String(S.filter(due).length), 'Termin erreicht, noch offen'], ['Umgesetzt oder abgedeckt', String(cnt((r) => r.rec === 'Umgesetzt' || r.rec === 'Bereits abgedeckt')), 'mit Label NEU in den Registern'], ['Nicht in der Webapp', String(cnt((r) => r.rec === 'Nicht in der Webapp')), 'bewertet und verworfen']]);
    const tb = $('tb-ide').tBodies[0]; tb.replaceChildren(); const q = f.q.toLowerCase();
    all.slice().sort((a, b) => REC.indexOf(a.rec) - REC.indexOf(b.rec) || (a.id < b.id ? -1 : 1)).forEach((r) => {
      if ((f.rec !== 'Alle' && r.rec !== f.rec) || (f.reg !== 'Alle' && r.register !== f.reg)) return; const s = get(r), tr = el('tr', due(s) ? 'locked' : ''); const td = (t, c) => { const e = el('td', c || '', t); tr.append(e); return e; };
      td(r.id); const t1 = td(''); t1.append(el('strong', null, r.theme), el('br'), el('span', 'mut', r.kpi)); const t2 = td((r.source.match(/S\d/g) || []).join(' · '), 'mut'); t2.title = r.source; td(r.register); td(r.fit, cls[r.fit]); td(r.effort); td(r.value, cls[r.value]); td(r.rec, r.rec === 'Nächster Schritt' ? 'warn' : r.rec === 'Umgesetzt' || r.rec === 'Bereits abgedeckt' ? 'good' : 'mut'); td(r.data, 'mut'); td(r.why);
      const st1 = td(''), sel = el('select'); STAT.forEach((x) => { const o = el('option', null, x); o.value = x; sel.append(o); }); sel.value = s.s; sel.setAttribute('aria-label', 'Status ' + r.id); sel.addEventListener('change', () => set(r.id, 's', sel.value)); st1.append(sel);
      const d1 = td(''), di = el('input'); di.type = 'date'; di.value = s.d; di.setAttribute('aria-label', 'Wiedervorlage ' + r.id); di.addEventListener('change', () => set(r.id, 'd', di.value)); d1.append(di); if (due(s)) d1.append(el('div', 'bad small', 'fällig'));
      const n1 = td(''), ni = el('input'); ni.type = 'text'; ni.maxLength = 200; ni.value = s.n; ni.placeholder = 'Notiz'; ni.setAttribute('aria-label', 'Notiz ' + r.id); ni.addEventListener('change', () => set(r.id, 'n', ni.value)); n1.append(ni);
      if (q && !tr.textContent.toLowerCase().includes(q) && !(s.n || '').toLowerCase().includes(q)) tr.hidden = true; tb.append(tr); });
    status();
  }
  function trySub() { if (subbed || !db) return; subbed = true; db.doc('ideen/state').onSnapshot((s) => { if (s.exists) { const d = s.data(); if (d && d.rev !== localRev) { state = d.state || {}; saved = 'Aktualisiert durch andere Ansicht'; draw(); } } else { saved = 'Noch nicht gespeichert'; status(); } }, () => {}); }
  const on = (id, ev, fn) => { const e = $(id); if (e) e.addEventListener(ev, fn); };
  on('ide-rec', 'change', () => { f.rec = $('ide-rec').value; draw(); }); on('ide-reg', 'change', () => { f.reg = $('ide-reg').value; draw(); }); on('ide-q', 'input', () => { f.q = $('ide-q').value.trim(); draw(); });
  (async () => { try { const c = window.claude; if (c && c.use) { db = await c.use('db'); try { const u = await c.use('user'); uid = u && u.id ? await u.id() : null; } catch (e) { uid = null; } } } catch (e) { db = null; } if (!db) saved = 'Nur in dieser Sitzung (Speichern nicht verfügbar)'; trySub(); status(); })();
  window.__ide = { get, due, REC, STAT };
  window.__hodDraw.ide = () => { trySub(); draw(); };
})();
