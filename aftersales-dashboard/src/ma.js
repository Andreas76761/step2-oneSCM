(function () {
  const H = window.__hod; if (!H) return;
  const $ = (id) => document.getElementById(id);
  const BU_LIST = ['Market Operation', 'Productmanagement', 'Pricing', 'Markt', 'Logistik', 'Bestand', 'Training', 'Warranty', 'Customer', 'Competitor', 'Marketing', 'Händler', 'Treiberbaum', 'Alarme', 'Forecast', 'Marge', 'Pareto', 'Workshop', 'Europa-Netz', 'Teileverfügbarkeit', 'Ertrag und Händler', 'Qualität und Garantie', 'Luxus und Kundenerlebnis', 'Elektro, Nachhaltigkeit, Digital', 'Übergreifend'];
  const PANEL_BU = { mo: 'Market Operation', pm: 'Productmanagement', pr: 'Pricing', mk: 'Markt', lg: 'Logistik', iv: 'Bestand', tr: 'Training', wa: 'Warranty', cu: 'Customer', co: 'Competitor', mt: 'Marketing', dl: 'Händler', dt: 'Treiberbaum', al: 'Alarme', fc: 'Forecast', mg: 'Marge', pa: 'Pareto', ws: 'Workshop', net: 'Europa-Netz', head: 'Übergreifend', tv: 'Teileverfügbarkeit', er: 'Ertrag und Händler', qg: 'Qualität und Garantie', lx: 'Luxus und Kundenerlebnis', el: 'Elektro, Nachhaltigkeit, Digital' };
  const STAT = ['Offen', 'In Arbeit', 'Verzögert', 'Erledigt'], PRIO = { A: 'hoch', B: 'mittel', C: 'niedrig' };
  const nf0 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
  let db = null, uid = null, actions = [], editId = null, delArm = null, filt = { status: 'Alle', bu: 'Alle' };
  const sorts = new Map();
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const today = () => new Date().toISOString().slice(0, 10);
  const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const fdate = (d) => (d ? d.slice(8, 10) + '.' + d.slice(5, 7) + '.' + d.slice(0, 4) : '–');
  const isOpen = (a) => a.status !== 'Erledigt', isLate = (a) => isOpen(a) && a.due && a.due < today();

  // ---------- generic simple table (own sorting + search) ----------
  function simpleTable(tbl, rows, cols, key, q) {
    const s = sorts.get(tbl);
    let data = rows.slice();
    if (s) data.sort((a, b) => (a[s.f] < b[s.f] ? -1 : a[s.f] > b[s.f] ? 1 : 0) * (s.dir === 'asc' ? 1 : -1));
    tbl.querySelectorAll('th').forEach((th) => { if (s && th.dataset.field === s.f) th.setAttribute('aria-sort', s.dir === 'asc' ? 'ascending' : 'descending'); else th.removeAttribute('aria-sort'); });
    const body = tbl.tBodies[0]; body.replaceChildren();
    data.forEach((r) => {
      const tr = document.createElement('tr'); tr.dataset.key = r[key];
      cols.forEach((c, i) => { const td = el('td', c.cls ? c.cls(r) : '', c.get(r)); tr.append(td); });
      if (q && !tr.textContent.toLowerCase().includes(q)) tr.hidden = true;
      body.append(tr);
    });
  }
  const qOf = (id) => { const i = document.querySelector('.tsearch2[data-for="' + id + '"]'); return i ? i.value.trim().toLowerCase() : ''; };
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  // Vorschläge: Bereiche bis Version 2 und die fünf Register der Version 3.0
  const sugRows = () => { const a = rowsOf('ma_suggest'); if (!a) return null; const b = rowsOf('ma_suggest3'); return b ? a.concat(b) : a; };

  // ---------- Maßnahmen ----------
  const F = { title: $('ma-title'), bu: $('ma-bu'), ref: $('ma-ref'), owner: $('ma-owner'), due: $('ma-due'), prio: $('ma-prio'), impact: $('ma-impact'), impk: $('ma-impk'), note: $('ma-note') };
  F.bu.replaceChildren(...BU_LIST.map((b) => new Option(b, b)));
  $('ma-fbu').replaceChildren(new Option('Alle Bereiche', 'Alle'), ...BU_LIST.map((b) => new Option(b, b)));
  const RL = () => window.__roles || null, canNew = () => !RL() || RL().can.write(), canMod = (a) => !RL() || RL().can.modify(a && a.createdBy), logA = (k, t, r) => { try { if (RL()) RL().log(k, t, r); } catch (e) { /* Protokoll optional */ } };
  const msg = (t, bad) => { const m = $('ma-msg'); m.textContent = t || ''; m.className = 'mut small' + (bad ? ' bad' : ''); };
  function openForm(p, quiet) {
    p = p || {}; editId = p.id || null;
    F.title.value = p.title || ''; F.bu.value = p.bu || 'Übergreifend'; F.ref.value = p.ref || ''; F.owner.value = p.owner || ''; F.due.value = p.due || addDays(30);
    F.prio.value = p.prio || 'B'; F.impact.value = p.impact || ''; F.impk.value = p.impact_k != null ? p.impact_k : ''; F.note.value = p.note || '';
    $('ma-form-title').textContent = editId ? 'Maßnahme bearbeiten' : 'Neue Maßnahme';
    $('ma-cancel').hidden = !editId && !p.title; msg('');
    if (!quiet) { $('ma-form-card').scrollIntoView({ block: 'nearest' }); F.title.focus(); }
  }
  async function save() {
    if (!db) { msg('Speichern ist in dieser Ansicht nicht verfügbar (keine Schreibrechte).', true); return; }
    const title = F.title.value.trim(); if (!title) { msg('Bitte einen Titel eingeben.', true); return; }
    const old = actions.find((a) => a.id === editId);
    if (old ? !canMod(old) : !canNew()) { msg(old ? 'Diese Maßnahme darf nur der Ersteller oder ein Administrator ändern.' : 'Mit der Rolle Betrachter können keine Maßnahmen angelegt werden.', true); return; }
    const now = new Date().toISOString(), k = parseFloat(String(F.impk.value).replace(',', '.'));
    const obj = { title, bu: F.bu.value, ref: F.ref.value.trim(), owner: F.owner.value.trim(), due: F.due.value || addDays(30), prio: F.prio.value, status: old ? old.status : 'Offen',
      impact: F.impact.value.trim(), impact_k: Number.isFinite(k) ? k : null, note: F.note.value.trim(), created: old ? old.created : now, updated: now, createdBy: old ? old.createdBy || null : uid };
    $('ma-save').disabled = true;
    try {
      if (editId) await db.doc('actions/' + editId).set(obj); else await db.collection('actions').add(obj);
      logA(editId ? 'Maßnahme geändert' : 'Maßnahme angelegt', title, obj.bu + (obj.ref ? ' · ' + obj.ref : ''));
      openForm({}, true); $('ma-cancel').hidden = true; msg('Gespeichert.');
    } catch (e) { const denied = e && (/denied|forbidden|permission|403|not_granted/i.test(String(e.code || '') + ' ' + String(e.message || ''))); msg(denied ? 'Gemeinsames Speichern ist nur mit der Stufe „Editor“ am Dashboard möglich. Bitte den Eigentümer, Ihnen im Teilen-Menü die Stufe „Editor“ zu geben.' : 'Speichern fehlgeschlagen' + (e && e.code ? ' (' + e.code + ')' : '') + '.', true); } finally { $('ma-save').disabled = false; }
  }
  async function setStatus(id, status) { if (!db) return; const a0 = actions.find((x) => x.id === id); if (a0 && !canMod(a0)) { msg('Den Status darf nur der Ersteller oder ein Administrator ändern.', true); drawMa(); return; } try { await db.doc('actions/' + id).update({ status, updated: new Date().toISOString() }); logA('Status geändert: ' + status, a0 ? a0.title : id, a0 ? a0.bu : ''); } catch (e) { msg('Statusänderung fehlgeschlagen.', true); } }
  async function del(id) { if (!db) return; const a0 = actions.find((x) => x.id === id); if (a0 && !canMod(a0)) { msg('Diese Maßnahme darf nur der Ersteller oder ein Administrator löschen.', true); drawMa(); return; } try { await db.doc('actions/' + id).delete(); logA('Maßnahme gelöscht', a0 ? a0.title : id, a0 ? a0.bu : ''); } catch (e) { msg('Löschen fehlgeschlagen.', true); } }
  $('ma-save').addEventListener('click', save);
  $('ma-cancel').addEventListener('click', () => { openForm({}, true); $('ma-cancel').hidden = true; });
  $('ma-fbu').addEventListener('change', () => { filt.bu = $('ma-fbu').value; drawMa(); });
  $('ma-chips').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) { filt.status = b.dataset.s; drawMa(); } });
  const maTbl = $('tb-ma');
  maTbl.addEventListener('click', (ev) => {
    const th = ev.target.closest('th[data-field]'); if (th) { const s = sorts.get(maTbl); sorts.set(maTbl, { f: th.dataset.field, dir: s && s.f === th.dataset.field && s.dir === 'asc' ? 'desc' : 'asc' }); drawMa(); return; }
    const b = ev.target.closest('button[data-act]'); if (!b) return;
    const id = b.dataset.id, a = actions.find((x) => x.id === id); if (!a) return;
    if (b.dataset.act === 'edit') openForm(a);
    else if (b.dataset.act === 'del') { if (delArm === id) { delArm = null; del(id); } else { delArm = id; drawMa(); } }
  });
  maTbl.addEventListener('change', (ev) => { const s = ev.target.closest('select[data-id]'); if (s) setStatus(s.dataset.id, s.value); });
  function drawMa() {
    const open = actions.filter(isOpen), late = actions.filter(isLate);
    $('ma-c-open').textContent = String(open.length); $('ma-c-prog').textContent = String(actions.filter((a) => a.status === 'In Arbeit').length);
    $('ma-c-late').textContent = String(late.length); $('ma-c-done').textContent = String(actions.filter((a) => a.status === 'Erledigt').length);
    $('ma-c-eff').textContent = nf0.format(open.reduce((s, a) => s + (a.impact_k || 0), 0)) + ' k€';
    $('ma-c-late').parentElement.parentElement.dataset.ok = late.length ? 'false' : 'true';
    const tab = document.querySelector('.tab[data-tab="ma"]'); if (tab) tab.textContent = 'Maßnahmen' + (open.length ? ' (' + open.length + (late.length ? ', ' + late.length + ' überfällig ⚠' : '') + ')' : '');
    $('ma-chips').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.s === filt.status)));
    $('ma-save').disabled = !db || !canNew(); if (!db) msg('Hinweis: Speichern ist in dieser Ansicht nicht verfügbar – Maßnahmen können nur gelesen werden.'); else if (!canNew()) msg('Mit der Rolle Betrachter können Maßnahmen nur gelesen werden.');
    try { drawRole(); drawAudit(); remind(); } catch (e) { /* optional */ }
    let rows = actions.filter((a) => (filt.status === 'Alle' || a.status === filt.status) && (filt.bu === 'Alle' || a.bu === filt.bu));
    const q = qOf('tb-ma'), s = sorts.get(maTbl) || { f: 'due', dir: 'asc' };
    rows = rows.slice().sort((a, b) => ((a[s.f] || '') < (b[s.f] || '') ? -1 : (a[s.f] || '') > (b[s.f] || '') ? 1 : 0) * (s.dir === 'asc' ? 1 : -1));
    maTbl.querySelectorAll('th[data-field]').forEach((th) => { if (th.dataset.field === s.f) th.setAttribute('aria-sort', s.dir === 'asc' ? 'ascending' : 'descending'); else th.removeAttribute('aria-sort'); });
    const body = maTbl.tBodies[0]; body.replaceChildren();
    if (!rows.length) { const tr = el('tr'), td = el('td', 'mut', actions.length ? 'Keine Maßnahmen für diese Auswahl.' : 'Noch keine Maßnahmen – Empfehlungen unter den Grafiken mit „+ Maßnahme“ übernehmen oder Vorschläge unten nutzen.'); td.colSpan = 8; tr.append(td); body.append(tr); }
    rows.forEach((a) => {
      const tr = el('tr', isLate(a) ? 'late' : '');
      const t = el('td'); const b = el('b', null, a.title); t.append(b); if (a.note) t.append(el('div', 'mut small', a.note));
      const st = el('select'); st.dataset.id = a.id; STAT.forEach((x) => st.append(new Option(x, x))); st.value = a.status;
      const act = el('td', 'acts'), e1 = el('button', null, 'Bearbeiten'), e2 = el('button', delArm === a.id ? 'bad' : null, delArm === a.id ? 'Sicher löschen?' : 'Löschen');
      e1.dataset.act = 'edit'; e1.dataset.id = a.id; e2.dataset.act = 'del'; e2.dataset.id = a.id; act.append(e1, e2);
      if (!canMod(a)) { [e1, e2, st].forEach((x) => { x.disabled = true; x.title = 'Nur der Ersteller oder ein Administrator darf diese Maßnahme ändern.'; }); }
      const dueTd = el('td', isLate(a) ? 'bad' : '', fdate(a.due) + (isLate(a) ? ' ⚠' : ''));
      const stTd = el('td'); stTd.append(st);
      tr.append(el('td', null, a.prio + ' · ' + (PRIO[a.prio] || '')), t, el('td', null, a.bu), el('td', null, [a.ref, a.owner].filter(Boolean).join(' · ') || '–'), dueTd, stTd,
        el('td', null, [a.impact, a.impact_k != null ? nf0.format(a.impact_k) + ' k€' : ''].filter(Boolean).join(' · ') || '–'), act);
      if (q && !tr.textContent.toLowerCase().includes(q)) tr.hidden = true;
      body.append(tr);
    });
    drawSug();
  }
  const sugTbl = $('tb-ma-sug');
  sugTbl.addEventListener('click', (ev) => {
    const th = ev.target.closest('th[data-field]'); if (th) { const s = sorts.get(sugTbl); sorts.set(sugTbl, { f: th.dataset.field, dir: s && s.f === th.dataset.field && s.dir === 'asc' ? 'desc' : 'asc' }); drawSug(); return; }
    const b = ev.target.closest('button[data-sid]'); if (!b) return;
    const r = (sugRows() || []).find((x) => x.id === b.dataset.sid); if (!r) return;
    openForm({ title: r.action, bu: r.bu_label, ref: r.kpi + ' (' + r.gap + ')', owner: r.owner_role, due: addDays(r.days), prio: r.prio, impact: r.effect });
  });
  function drawSug() {
    const all = sugRows(); if (!all) return;
    const rows = all.filter((r) => r.region === H.REGSEL() && r.month === H.M());
    const s = sorts.get(sugTbl);
    const data = rows.slice().sort((a, b) => (s ? ((a[s.f] < b[s.f] ? -1 : a[s.f] > b[s.f] ? 1 : 0) * (s.dir === 'asc' ? 1 : -1)) : (a.prio < b.prio ? -1 : a.prio > b.prio ? 1 : 0)));
    sugTbl.querySelectorAll('th[data-field]').forEach((th) => { if (s && th.dataset.field === s.f) th.setAttribute('aria-sort', s.dir === 'asc' ? 'ascending' : 'descending'); else th.removeAttribute('aria-sort'); });
    const body = sugTbl.tBodies[0]; body.replaceChildren();
    data.forEach((r) => {
      const tr = el('tr'); tr.dataset.key = r.id;
      ['bu_label', 'kpi', 'gap', 'prio', 'action', 'owner_role', 'days'].forEach((f) => tr.append(el('td', null, String(r[f]))));
      const done = actions.some((a) => a.title === r.action), td = el('td', 'acts'), b = el('button', null, done ? 'Übernommen' : 'Übernehmen'); b.dataset.sid = r.id; b.disabled = done; td.append(b); tr.append(td); body.append(tr);
    });
    $('ma-sug-empty').hidden = data.length > 0;
  }
  $('ma-form-card').addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && ev.target.tagName === 'INPUT') save(); });
  root_input();
  function root_input() { document.addEventListener('input', (ev) => { if (ev.target.matches && ev.target.matches('.tsearch2')) { const c = H.cur(); if (c === 'ma') drawMa(); if (c === 'da') drawDa(); } }); }
  // ---------- "+ Maßnahme" next to each recommendation ----------
  function decorate() {
    document.querySelectorAll('.sum').forEach((s) => {
      if (s.querySelector('.addact')) return;
      const b = el('button', 'addact', '+ Maßnahme'); b.type = 'button'; b.title = 'Empfehlung als Maßnahme übernehmen'; s.append(b);
    });
  }
  H.root.addEventListener('click', (ev) => {
    const b = ev.target.closest('.addact'); if (!b) return;
    const sum = b.closest('.sum'), rec = sum.querySelector('[data-field="rec"]'), card = sum.closest('.card'), panel = sum.closest('.panel');
    const txt = rec && rec.textContent !== '—' ? rec.textContent : '';
    openForm({ title: txt, bu: PANEL_BU[panel && panel.id] || 'Übergreifend', ref: card && card.querySelector('h3') ? card.querySelector('h3').textContent : '', due: addDays(30), prio: 'B' });
    H.show('ma');
  });
  // ---------- Datenanbindung ----------
  const dqF = $('da-dqf'), dsF = $('da-dsf');
  dqF.addEventListener('change', () => drawDa()); dsF.addEventListener('change', () => { dsF.dataset.v = dsF.value; drawDa(); });
  ['tb-da-cat', 'tb-da-dq', 'tb-da-con'].forEach((id) => $(id).addEventListener('click', (ev) => {
    const th = ev.target.closest('th[data-field]'); if (!th) return; const t = $(id), s = sorts.get(t);
    sorts.set(t, { f: th.dataset.field, dir: s && s.f === th.dataset.field && s.dir === 'asc' ? 'desc' : 'asc' }); drawDa();
  }));
  function drawDa() {
    const cat = rowsOf('data_catalog'), dq0 = rowsOf('dq_checks'), dq3 = rowsOf('dq_checks3'), dq = dq0 ? dq0.concat(dq3 || []) : null, con = rowsOf('data_contract');
    if (cat) simpleTable($('tb-da-cat'), cat, ['dataset', 'title', 'used_in', 'grain', 'rows', 'last_month', 'source_proposal', 'refresh', 'status'].map((f) => ({ get: (r) => (f === 'rows' ? nf0.format(r.rows) : String(r[f])), cls: (r) => (f === 'status' ? 'warn' : '') })), 'dataset', qOf('tb-da-cat'));
    if (dq) simpleTable($('tb-da-dq'), dq.filter((r) => dqF.value === 'Alle' || r.status === dqF.value), ['dataset', 'check', 'status', 'detail'].map((f) => ({ get: (r) => String(r[f]), cls: (r) => (f === 'status' ? (r.status === 'OK' ? 'good' : 'bad') : '') })), 'id', qOf('tb-da-dq'));
    if (con) {
      if (document.activeElement !== dsF) { const sets = [...new Set(con.map((r) => r.dataset))]; dsF.replaceChildren(new Option('Alle Datensätze', 'Alle'), ...sets.map((d) => new Option(d, d))); dsF.value = dsF.dataset.v || 'Alle'; }
      dsF.dataset.v = dsF.value;
      simpleTable($('tb-da-con'), con.filter((r) => dsF.value === 'Alle' || r.dataset === dsF.value), ['dataset', 'column', 'type', 'description', 'required'].map((f) => ({ get: (r) => String(r[f]) })), 'id', qOf('tb-da-con'));
    }
  }
  window.__hodDraw = { ma: drawMa, da: drawDa };
  window.__hodAct = { open: (p) => { openForm(p); H.show('ma'); }, list: () => actions.slice() };
  dash.onData(decorate);
  // ---------- Erinnerung an überfällige und bald fällige Maßnahmen (Hinweis auf jeder Seite, pro Tag ausblendbar) ----------
  const RKEY = 'aftersales-remind-v1';
  function remind() {
    const late = actions.filter(isLate), soon = actions.filter((a) => isOpen(a) && !isLate(a) && a.due && a.due <= addDays(7)), sig = today() + '|' + late.length + '|' + soon.length;
    let box = $('ma-remind'); const take = document.querySelector('#dash-root .take');
    if (!box) { if (!take) return; box = el('div', 'card'); box.id = 'ma-remind'; box.setAttribute('role', 'status'); take.after(box); }
    let hidden = false; try { hidden = localStorage.getItem(RKEY) === sig; } catch (e) { hidden = false; }
    if ((!late.length && !soon.length) || hidden) { box.hidden = true; return; }
    box.hidden = false; box.replaceChildren(); box.style.borderLeft = '4px solid var(--cds-chart-status-critical, #c0392b)'; box.style.padding = '8px 12px';
    const lst = late.concat(soon).slice(0, 3).map((a) => a.title + (a.owner ? ' (' + a.owner + ', fällig ' + fdate(a.due) + ')' : ' (fällig ' + fdate(a.due) + ')')).join(' · ');
    box.append(el('b', null, '⚠ ' + (late.length ? late.length + (late.length === 1 ? ' Maßnahme überfällig' : ' Maßnahmen überfällig') : '') + (late.length && soon.length ? ', ' : '') + (soon.length ? soon.length + ' in den nächsten 7 Tagen fällig' : '')), el('div', 'mut small', lst + (late.length + soon.length > 3 ? ' · …' : '')));
    const bar = el('div', 'toprow regrow'), go = el('button', 'bkbtn', 'Zu den Maßnahmen'), hide = el('button', 'bkbtn', 'Heute ausblenden'); go.type = hide.type = 'button'; go.addEventListener('click', () => H.show('ma')); hide.addEventListener('click', () => { try { localStorage.setItem(RKEY, sig); } catch (e) { /* ohne Speicher */ } box.hidden = true; }); bar.append(go, hide); box.append(bar);
  }
  // ---------- Rolle und Änderungsprotokoll ----------
  const fdt2 = (iso) => (iso ? iso.slice(8, 10) + '.' + iso.slice(5, 7) + '.' + iso.slice(0, 4) + ' ' + iso.slice(11, 16) : '–');
  function drawRole() {
    const R = RL(); if (!R) return; let p = $('ma-role'); if (!p) { p = el('p', 'note'); p.id = 'ma-role'; $('ma-form-card').before(p); }
    p.textContent = 'Ihre Rolle: ' + R.role() + (R.mode() === 'lokal' ? ' (ohne Plattformanmeldung)' : '') + ' – ' + R.text();
  }
  function drawAudit() {
    const R = RL(); if (!R) return; const panel = document.getElementById('ma'); if (!panel) return; let c = $('ma-audit');
    if (!c) { c = el('div', 'card'); c.id = 'ma-audit'; const hd = el('div', 'cardhead'); hd.append(el('h3', null, 'Änderungsprotokoll')); const tw = el('div', 'tbl-wrap'), t = el('table', 'tbl'); t.dataset.own = '1'; t.id = 'tb-ma-audit'; const th = el('thead'), tr = el('tr'); ['Zeitpunkt', 'Wer', 'Aktion', 'Maßnahme / Szenario', 'Bereich'].forEach((h) => tr.append(el('th', null, h))); th.append(tr); t.append(th, el('tbody')); tw.append(t); c.append(hd, el('p', 'note', 'Wer hat wann welche Maßnahme oder welches Szenario angelegt, geändert oder gelöscht (die letzten 40 Einträge).'), tw); const ma = $('ma-sug-empty'); (ma && ma.closest('.card') ? ma.closest('.card') : panel.lastElementChild).after(c); }
    const body = $('tb-ma-audit').tBodies[0]; body.replaceChildren(); const list = R.entries();
    if (!list.length) { const tr = el('tr'), td = el('td', 'mut', 'Noch keine Einträge.'); td.colSpan = 5; tr.append(td); body.append(tr); }
    list.forEach((e) => { const tr = el('tr'); [fdt2(e.at), R.who(e.by), e.kind, e.title, e.ref || '–'].forEach((v) => tr.append(el('td', null, v))); body.append(tr); });
  }
  if (RL()) RL().on(() => { try { drawMa(); } catch (e) { /* optional */ } });
  // ---------- db ----------
  (async () => {
    try {
      const c = window.claude; if (!c || !c.use) throw new Error('none');
      db = await c.use('db');
      try { const u = await c.use('user'); uid = u && u.id ? await u.id() : null; } catch (e) { uid = null; }
      if (db) db.collection('actions').onSnapshot((snap) => { actions = snap.docs.map((d) => Object.assign({ id: d.id }, d.data())); drawMa(); }, () => {});
    } catch (e) { db = null; }
    openForm({}, true); $('ma-cancel').hidden = true; drawMa();
  })();
})();
