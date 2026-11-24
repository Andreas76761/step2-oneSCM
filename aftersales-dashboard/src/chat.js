(function () {
  const H = window.__hod; if (!H) return;
  const root = document.getElementById('dash-root'); if (!root) return;
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }), N0 = NF(0), N1 = NF(1);
  const LS = { get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ohne Speicher */ } } };
  const BU_LIST = ['Übergreifend', 'Market Operation', 'Productmanagement', 'Pricing', 'Markt', 'Logistik', 'Bestand', 'Training', 'Warranty', 'Customer', 'Competitor', 'Marketing', 'Händler', 'Treiberbaum', 'Alarme', 'Forecast', 'Marge', 'Workshop', 'Europa-Netz', 'Vehicle Parc', 'Teileverfügbarkeit', 'Ertrag und Händler', 'Qualität und Garantie', 'Luxus und Kundenerlebnis', 'Elektro, Nachhaltigkeit, Digital', 'Simulationen'];
  const STAT = ['Offen', 'In Arbeit', 'Verzögert', 'Erledigt'], PRIO = { A: 'hoch', B: 'mittel', C: 'niedrig' };
  const REG5 = ['DACH', 'Westeuropa', 'Südeuropa', 'Nordeuropa', 'Osteuropa'];
  const norm = (s) => String(s).toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9% ]+/g, ' ').replace(/\s+/g, ' ').trim();
  const STOP = new Set(['wie', 'hoch', 'ist', 'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'und', 'oder', 'von', 'vom', 'zum', 'zur', 'zeige', 'zeig', 'mir', 'bitte', 'was', 'wie', 'wo', 'welche', 'welcher', 'alle', 'im', 'in', 'bei', 'fuer', 'mit', 'aktuell', 'aktuelle', 'aktueller', 'wert', 'kennzahl', 'kpi', 'stand', 'auswertung', 'uebersicht', 'trend', 'verlauf', 'vergleich', 'regionen', 'region', 'unter', 'ziel', 'steht', 'stehen', 'wir', 'sind', 'lauf', 'entwicklung', 'gibt', 'es']);
  let db = null, uid = null, actions = [], localMode = false, shared = [], priv = [], canShared = null, saveMode = 'local';
  const merge = () => { actions = shared.map((a) => Object.assign({ scope: 'shared' }, a)).concat(priv.map((a) => Object.assign({ scope: 'private' }, a)), LS.get('chat-actions', []).map((a) => Object.assign({ scope: 'local' }, a))); };
  const privDoc = () => (db && uid ? db.doc('data/users/' + uid + '/actions') : null);
  const privSave = async () => { const d = privDoc(); if (!d) throw new Error('kein persönlicher Speicher'); await d.set({ list: priv.map((a) => { const o = Object.assign({}, a); delete o.scope; return o; }) }); };
  // ======================= Daten =======================
  const REGMAP = () => { const o = {}; document.querySelectorAll('#dash-root .tabs .tab').forEach((b) => { o[b.dataset.tab] = b.textContent.replace(/\s*NEU\s*$/, '').trim(); }); return o; };
  function allKpis() {
    const O = window.__ov, O2 = window.__ov2, out = [], names = REGMAP(); if (!O || !O2) return out;
    const add = (key, c) => { if (c) c.list.forEach((r) => out.push({ key, reg: names[key] || key, r })); };
    Object.keys(O.NAME).forEach((k) => { try { add(k, O.calc(k)); } catch (e) { /* Register nicht bereit */ } });
    Object.keys(O2.KSPEC).forEach((k) => { try { add(k, O2.kcalc(O2.KSPEC[k])); } catch (e) { /* */ } });
    return out;
  }
  const fmt = (r, v) => { if (v == null || !isFinite(v)) return '–'; const f = H.FMT[r.unit]; return f ? f(v) : N1.format(v); };
  const pc = (v) => (v == null ? '–' : (Math.abs(v - 100) < 1.5 ? N1.format(v) : N0.format(v)) + ' %');
  const delta = (r) => (r.delta == null || !isFinite(r.delta) ? '–' : (r.delta > 0.05 ? '▲ ' : r.delta < -0.05 ? '▼ ' : '→ ') + (r.delta >= 0 ? '+' : '−') + N1.format(Math.abs(r.delta)) + (r.dk === 'pp' ? ' pp' : ' %'));
  const stat = (i) => (i == null ? 'none' : i >= 100 ? 'good' : i >= 95 ? 'warn' : 'bad');
  const ctxTxt = () => { const ms = H.periodMonths(), rg = H.REGSEL(); return (rg === 'Alle' ? 'Alle Märkte' : rg) + ' · ' + (ms.length > 1 ? H.mlabel(ms[0]) + ' – ' + H.mlabel(ms[ms.length - 1]) : H.mlabel(ms[0])); };
  function findKpi(q, list) {
    const toks = norm(q).split(' ').filter((t) => t.length >= 3 && !STOP.has(t)); if (!toks.length) return null; let best = null, bs = 0;
    list.forEach((k) => { const nl = norm(k.r.label), nr = norm(k.reg); let s = 0; toks.forEach((t) => { const st = t.length > 5 ? t.slice(0, t.length - 1) : t; if (nl.includes(st) || (st.length >= 4 && nl.split(' ').some((w) => st.includes(w) && w.length >= 4))) s += 2; else if (nr.includes(st)) s += 0.6; }); if (nl.split(' ').length > 0 && s > 0) s -= nl.length / 400; if (s > bs) { bs = s; best = k; } });
    return bs >= 1.5 ? best : null;
  }
  function findRegister(q) {
    const nq = norm(q), names = REGMAP(); let best = null, bl = 0;
    Object.keys(names).forEach((k) => { const n = norm(names[k]); if (n.length >= 3 && nq.includes(n) && n.length > bl) { best = k; bl = n.length; } });
    const al = { werkstatt: 'ws', 'europa netz': 'net', netz: 'net', haendler: 'dl', bestand: 'iv', lager: 'iv', logistik: 'lg', preis: 'pr', pricing: 'pr', garantie: 'wa', kunden: 'cu', wettbewerb: 'co', marketing: 'mt', schulung: 'tr', training: 'tr', produkt: 'pm', parc: 'vp', fahrzeugbestand: 'vp', planung: 'pl', treiberbaum: 'dt', marge: null };
    if (!best) Object.keys(al).forEach((a) => { if (al[a] && nq.includes(a) && a.length > bl) { best = al[a]; bl = a.length; } }); return best;
  }
  // ======================= Bausteine (Antworten) =======================
  const msgBox = () => document.getElementById('chat-log');
  function bubble(who, build) { const b = el('div', 'chm ' + who); if (typeof build === 'string') b.textContent = build; else build(b); const log = msgBox(); log.append(b); log.scrollTop = log.scrollHeight; return b; }
  function btn(txt, fn, cls) { const b = el('button', 'bkbtn chbtn' + (cls ? ' ' + cls : ''), txt); b.type = 'button'; b.addEventListener('click', fn); return b; }
  function spark(host, ser) {
    if (!ser || ser.length < 2 || !window.d3) return; const w = 220, h = 44, x = d3.scalePoint(ser.map((r) => r.month), [4, w - 6]), v = ser.map((r) => r.value).concat(ser.map((r) => r.target).filter((t) => t != null)), y = d3.scaleLinear([d3.min(v), d3.max(v)], [h - 5, 5]);
    const s = d3.select(host).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${h}`).attr('role', 'img').attr('aria-label', 'Verlauf ' + ser.length + ' Monate');
    if (ser.some((r) => r.target != null)) s.append('path').attr('d', d3.line().defined((r) => r.target != null).x((r) => x(r.month)).y((r) => y(r.target))(ser)).attr('fill', 'none').attr('stroke', 'var(--color-fg-muted)').attr('stroke-dasharray', '3 3');
    s.append('path').attr('d', d3.line().x((r) => x(r.month)).y((r) => y(r.value))(ser)).attr('fill', 'none').attr('stroke', 'var(--color-fg)').attr('stroke-width', 1.8); const l = ser[ser.length - 1]; s.append('circle').attr('cx', x(l.month)).attr('cy', y(l.value)).attr('r', 3).attr('fill', 'var(--color-fg)');
  }
  const COLV = { good: 'var(--color-ok)', warn: 'var(--color-warn)', bad: 'var(--color-bad)', none: 'var(--color-fg-muted)' };
  function bars(parent, rows, f) { const max = Math.max(...rows.map((r) => r.v), 1), w = el('div', 'chbars'); rows.forEach((r) => { const line = el('div', 'chbar'), lab = el('span', 'chbl', r.n), tr = el('span', 'chbt'), fl = el('span', 'chbf'), val = el('span', 'chbv', f ? f(r.v) : N1.format(r.v)); fl.style.width = Math.max(2, r.v / max * 100) + '%'; fl.style.background = r.c || COLV.none; tr.append(fl); line.append(lab, tr, val); w.append(line); }); parent.append(w); }
  function table(parent, head, rows) { const w = el('div', 'chtw'), t = el('table', 'chtab'), th = el('tr'); head.forEach((h, i) => th.append(el('th', i ? 'num' : null, h))); const hd = el('thead'); hd.append(th); t.append(hd); const tb = el('tbody'); rows.forEach((r) => { const tr = el('tr'); r.forEach((c, i) => tr.append(el('td', i ? 'num' : null, c))); tb.append(tr); }); t.append(tb); w.append(t); parent.append(w); }
  function kpiCard(b, k, withRegions) {
    const r = k.r, s = stat(r.i), card = el('div', 'chcard ch-' + s); card.append(el('div', 'chk', k.reg + ' · ' + r.label), el('div', 'chv', fmt(r, r.value)));
    card.append(el('div', 'chs', 'Ziel ' + (r.target == null ? '–' : fmt(r, r.target)) + (r.i == null ? ' · ohne Zielwert' : ' · Zielerfüllung ' + pc(r.i)) + ' · ' + delta(r) + ' ggü. Vorperiode')); const sp = el('div', 'chsp'); card.append(sp); spark(sp, r.ser); b.append(card);
    if (withRegions && r.reg) { const rows = r.reg.map((q, i) => (q && q.i != null ? { n: REG5[i], v: q.i, c: COLV[stat(q.i)] } : null)).filter(Boolean); if (rows.length) { b.append(el('div', 'chcap', 'Zielerfüllung je Region')); bars(b, rows, pc); } }
    const row = el('div', 'chrow'); row.append(btn('Register öffnen', () => H.show(k.key)), btn('Maßnahme anlegen', () => addFromKpi(k))); b.append(row);
  }
  // ======================= Maßnahmen =======================
  const today = () => new Date().toISOString().slice(0, 10), addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const sorted = () => actions.slice().sort((a, b) => (a.status === 'Erledigt') - (b.status === 'Erledigt') || String(a.due).localeCompare(String(b.due)));
  const overdue = (a) => a.status !== 'Erledigt' && a.due && a.due < today();
  async function saveAction(o) {
    const now = new Date().toISOString(), obj = Object.assign({ title: '', bu: 'Übergreifend', ref: '', owner: '', due: addDays(30), prio: 'B', status: 'Offen', impact: '', impact_k: null, note: '', created: now, updated: now, createdBy: uid }, o);
    // 1) gemeinsame Sammlung (wie im Register Maßnahmen), 2) persönlicher Speicher in der Datenbank, 3) lokal im Browser
    if (db && canShared !== false) { try { await db.collection('actions').add(obj); saveMode = 'shared'; return true; } catch (e) { canShared = false; } }
    if (db && uid) { try { obj.id = 'P' + Date.now().toString(36); priv.push(obj); await privSave(); saveMode = 'private'; merge(); drawTracker(); return true; } catch (e) { priv = priv.filter((a) => a.id !== obj.id); } }
    saveMode = 'local'; localMode = true; obj.id = 'L' + Date.now().toString(36); const loc = LS.get('chat-actions', []); loc.push(obj); LS.set('chat-actions', loc); merge(); drawTracker(); return true;
  }
  async function setStatus(a, s2) {
    const up = new Date().toISOString(), id = String(a.id);
    if (id.startsWith('L')) { const loc = LS.get('chat-actions', []), x = loc.find((q) => q.id === a.id); if (x) { x.status = s2; x.updated = up; LS.set('chat-actions', loc); } merge(); drawTracker(); return; }
    if (id.startsWith('P')) { const x = priv.find((q) => q.id === a.id); if (x) { x.status = s2; x.updated = up; try { await privSave(); } catch (e) { say('Statusänderung konnte nicht gespeichert werden.'); } } merge(); drawTracker(); return; }
    if (!db) return; try { await db.doc('actions/' + a.id).update({ status: s2, updated: up }); } catch (e) { say('Statusänderung fehlgeschlagen (keine Schreibrechte für die gemeinsame Sammlung).'); }
  }
  function addFromKpi(k) {
    const r = k.r, adv = H.CFG && H.CFG.bus && H.CFG.bus[k.key] ? H.CFG.bus[k.key].charts : null, ch = adv ? adv.find((c) => c.y === r.kpi || c.sid && c.lab === r.label) : null, below = r.i != null && r.i < 100;
    const bu = BU_LIST.find((n) => n === k.reg) || 'Übergreifend', gap = r.i == null ? '' : ' (Zielerfüllung ' + pc(r.i) + ')';
    saveAction({ title: r.label + ': ' + (below ? 'Zielabweichung schließen' : 'Niveau sichern'), bu, ref: r.label, prio: r.i == null ? 'B' : r.i < 90 ? 'A' : r.i < 100 ? 'B' : 'C', note: (below && ch && ch.miss ? ch.miss : (ch && ch.ok) || '') + gap + ' · angelegt im Chat, ' + ctxTxt() }).then(() => { say('Maßnahme „' + r.label + '“ angelegt (fällig in 30 Tagen). Sie erscheint im Register Maßnahmen und im Tracker.'); tab('track'); });
  }
  function actList(b, list, title) {
    b.append(el('div', 'chcap', title + ' (' + list.length + ')')); if (!list.length) return;
    table(b, ['#', 'Maßnahme', 'Fällig', 'Status'], list.slice(0, 12).map((a, i) => [String(i + 1), a.title + (a.owner ? ' – ' + a.owner : ''), (overdue(a) ? '⚠ ' : '') + (a.due || '–').split('-').reverse().join('.'), a.status])); numbered = list.slice(0, 12);
    if (list.length > 12) b.append(el('div', 'chcap', '… und ' + (list.length - 12) + ' weitere im Tracker.')); b.append(btn('Tracker öffnen', () => tab('track')));
  }
  let numbered = [];
  function parseDate(t) { const m = /(\d{1,2})\.(\d{1,2})\.(\d{2,4})?/.exec(t); if (!m) return null; const y = m[3] ? (m[3].length === 2 ? 2000 + +m[3] : +m[3]) : new Date().getFullYear(); return y + '-' + String(m[2]).padStart(2, '0') + '-' + String(m[1]).padStart(2, '0'); }
  function newAction(text) {
    let t = text.replace(/^.*?(maßnahme|massnahme|aufgabe|todo)\s*[:\-–]?\s*/i, ''), o = {};
    const ow = /(?:verantwortlich(?:er)?|owner|von)\s*[:=]?\s*([A-ZÄÖÜ][\wäöüß.\-]*(?:\s[A-ZÄÖÜ][\wäöüß.\-]*)?)/.exec(t); if (ow) { o.owner = ow[1]; t = t.replace(ow[0], ''); }
    const du = /(?:bis|fällig|faellig|termin)\s*(\d{1,2}\.\d{1,2}\.(?:\d{2,4})?)/i.exec(t); if (du) { o.due = parseDate(du[1]); t = t.replace(du[0], ''); }
    const pr = /prio(?:rität|ritaet)?\s*[:=]?\s*(a|b|c|hoch|mittel|niedrig)/i.exec(t); if (pr) { const v = pr[1].toLowerCase(); o.prio = v === 'a' || v === 'hoch' ? 'A' : v === 'c' || v === 'niedrig' ? 'C' : 'B'; t = t.replace(pr[0], ''); }
    const bu = BU_LIST.find((n) => n !== 'Übergreifend' && norm(t).includes(norm(n))); if (bu) o.bu = bu; o.title = t.replace(/\s+/g, ' ').replace(/[,;\s]+$/, '').trim();
    if (!o.title) return null; o.note = 'angelegt im Chat'; return o;
  }
  // ======================= Intents =======================
  function answer(q) {
    const nq = norm(q), list = allKpis(); if (!nq) return;
    if (/^(hilfe|help|\?|was kannst du|beispiele)/.test(nq)) return help();
    // Region setzen
    const rgm = REG5.concat(['Alle']).find((r) => new RegExp('(region|markt|filter)\\s+' + norm(r) + '\\b').test(nq)); if (rgm) { dash.setParams({ region: rgm }); return say('Filter gesetzt: ' + (rgm === 'Alle' ? 'Alle Märkte' : rgm) + '. Alle Register und meine Antworten beziehen sich jetzt darauf.'); }
    // Maßnahmen
    const st = /(?:massnahme|aufgabe)\s*#?(\d+)\s*(?:ist\s*|auf\s*)?(erledigt|fertig|in arbeit|offen|verzoegert|verzögert)/.exec(nq);
    if (st) { const a = numbered[+st[1] - 1]; if (!a) return say('Maßnahme ' + st[1] + ' kenne ich nicht – bitte zuerst die Liste zeigen („Maßnahmen offen“).'); const s = /erledigt|fertig/.test(st[2]) ? 'Erledigt' : /arbeit/.test(st[2]) ? 'In Arbeit' : /offen/.test(st[2]) ? 'Offen' : 'Verzögert'; setStatus(a, s); return say('Status von „' + a.title + '“ auf „' + s + '“ gesetzt.'); }
    if (/(neue|neu|anlegen|lege|erstelle|erfasse|fuege|füge).*(massnahme|aufgabe|todo)/.test(nq) || /^(massnahme|aufgabe|todo)\s*[:\-]/.test(nq)) { const k = findKpi(q.replace(/^.*?(massnahme|maßnahme|aufgabe)\s*(zu|für|fuer)\s*/i, ''), list); if (/(massnahme|aufgabe)\s*(zu|fuer|für)\s/.test(nq) && k) return addFromKpi(k); const o = newAction(q); if (!o) return say('Bitte einen Titel angeben, z. B.: „Neue Maßnahme: Lieferantenaudit starten, verantwortlich Müller, bis 30.11., Prio A“.'); return saveAction(o).then(() => { say('Maßnahme „' + o.title + '“ angelegt' + (o.owner ? ' (' + o.owner + ')' : '') + ', fällig ' + (o.due || addDays(30)).split('-').reverse().join('.') + '.' + (saveMode === 'private' ? ' (gespeichert in Ihrem persönlichen Speicher)' : saveMode === 'local' ? ' (nur in diesem Browser gespeichert)' : '')); }); }
    if (/(massnahme|aufgabe|tracker|todo)/.test(nq)) { const all = sorted(); let l = all, t = 'Alle Maßnahmen'; if (/ueberfaellig|verzoeger|verspaetet/.test(nq)) { l = all.filter((a) => overdue(a) || a.status === 'Verzögert'); t = 'Überfällige oder verzögerte Maßnahmen'; } else if (/erledigt|abgeschlossen/.test(nq)) { l = all.filter((a) => a.status === 'Erledigt'); t = 'Erledigte Maßnahmen'; } else if (/offen|laufend|arbeit|aktiv|status/.test(nq)) { l = all.filter((a) => a.status !== 'Erledigt'); t = 'Offene Maßnahmen'; } return bubble('bot', (b) => { b.append(el('div', null, l.length ? t + ': Sie sind nach Fälligkeit sortiert. Mit „Maßnahme 2 erledigt“ ändern Sie den Status.' : 'Keine Maßnahmen in dieser Auswahl.')); actList(b, l, t); }); }
    // Simulationen
    if (/simulation|stresstest|szenario|was passiert wenn|was waere wenn/.test(nq)) { const SM = window.__sim; if (!SM) return say('Die Simulationen sind in dieser Ansicht nicht verfügbar.'); const ix = SM.SIMS.findIndex((s) => nq.includes(norm(s.title).split(' ')[0]) || (/lieferant|ausfall|stress/.test(nq) && s.id === 's1') || (/elektro|bev/.test(nq) && s.id === 's2') || (/zoll|waehrung|preis/.test(nq) && s.id === 's3') || (/bestand|lager/.test(nq) && s.id === 's4') || (/netz|standort/.test(nq) && s.id === 's5') || (/garantie|rueckruf/.test(nq) && s.id === 's6') || (/werkstatt|kapazitaet|warte/.test(nq) && s.id === 's7') || (/massnahme|programm/.test(nq) && s.id === 's8') || (/gesamt/.test(nq) && s.id === 's9'));
      return bubble('bot', (b) => { b.append(el('div', null, ix >= 0 ? 'Passende Simulation: ' + SM.SIMS[ix].title + '. ' + SM.SIMS[ix].intro : 'Es gibt neun Simulationen – wählen Sie eine aus:')); const rw = el('div', 'chrow'); (ix >= 0 ? [SM.SIMS[ix]] : SM.SIMS).forEach((s) => rw.append(btn(s.title.slice(0, 30), () => { SM.S.cur = s.id; H.show('sim'); }))); b.append(rw); }); }
    // Zusammenfassung
    if (/zusammenfassung|wie stehen wir|gesamtlage|ueberblick|lage\b|management summary/.test(nq)) {
      const tg = list.filter((k) => k.r.i != null), ok = tg.filter((k) => k.r.i >= 100), low = tg.filter((k) => k.r.i < 100).sort((a, b) => a.r.i - b.r.i), best = tg.slice().sort((a, b) => b.r.i - a.r.i).slice(0, 3);
      return bubble('bot', (b) => { b.append(el('div', null, ctxTxt() + ': ' + ok.length + ' von ' + tg.length + ' Kennzahlen mit Zielwert sind erreicht (' + N0.format(ok.length / (tg.length || 1) * 100) + ' %).')); b.append(el('div', 'chcap', 'Größte Abweichungen')); table(b, ['Kennzahl', 'Ist', 'Zielerf.'], low.slice(0, 5).map((k) => [k.reg + ' · ' + k.r.label, fmt(k.r, k.r.value), pc(k.r.i)])); b.append(el('div', 'chcap', 'Stärkste Kennzahlen')); table(b, ['Kennzahl', 'Ist', 'Zielerf.'], best.map((k) => [k.reg + ' · ' + k.r.label, fmt(k.r, k.r.value), pc(k.r.i)])); const rw = el('div', 'chrow'); rw.append(btn('Alle unter Ziel zeigen', () => ask('Welche Kennzahlen sind unter Ziel?'))); b.append(rw); });
    }
    // unter Ziel
    if (/unter ziel|abweichung|kritisch|problem|schlecht|verfehlt|rot\b|sorgen/.test(nq) && !findKpi(q.replace(/unter ziel|abweichung|kritisch|problem/gi, ''), list)) {
      const rk = findRegister(q); let l = list.filter((k) => k.r.i != null && k.r.i < 100); if (rk) l = l.filter((k) => k.key === rk); l.sort((a, b) => a.r.i - b.r.i);
      return bubble('bot', (b) => { b.append(el('div', null, l.length ? l.length + ' Kennzahlen unter Ziel' + (rk ? ' in ' + REGMAP()[rk] : '') + ' (' + ctxTxt() + '). Die größten Abweichungen zuerst:' : 'Keine Kennzahl unter Ziel' + (rk ? ' in ' + REGMAP()[rk] : '') + '.')); if (l.length) { bars(b, l.slice(0, 8).map((k) => ({ n: k.r.label, v: k.r.i, c: COLV[stat(k.r.i)] })), pc); const rw = el('div', 'chrow'); l.slice(0, 3).forEach((k) => rw.append(btn('Maßnahme: ' + k.r.label.slice(0, 22), () => addFromKpi(k)))); b.append(rw); } });
    }
    // Regionsvergleich
    const k = findKpi(q, list), rk = findRegister(q);
    if (k && /(region|vergleich|beste|schlechteste|laender|länder|markt)/.test(nq)) return bubble('bot', (b) => { b.append(el('div', null, k.reg + ' · ' + k.r.label + ' im Vergleich der Regionen (' + ctxTxt().split(' · ')[1] + ').')); const rows = k.r.reg.map((q2, i) => (q2 && q2.value != null ? { n: REG5[i], v: q2.i != null ? q2.i : q2.value, c: q2.i != null ? COLV[stat(q2.i)] : COLV.none, raw: q2 } : null)).filter(Boolean); bars(b, rows, (v) => (k.r.i != null ? pc(v) : N1.format(v))); b.append(el('div', 'chcap', k.r.i != null ? 'Balken = Zielerfüllung in %.' : 'Balken = Wert.')); b.append(btn('Register öffnen', () => H.show(k.key))); });
    // KPI-Frage
    if (k) return bubble('bot', (b) => { b.append(el('div', null, ctxTxt() + ':')); kpiCard(b, k, true); });
    // Register-Auswertung
    if (rk) return registerView(rk, list);
    // Auswertung allgemein
    if (/auswertung|analyse|bericht|report/.test(nq)) return bubble('bot', (b) => { b.append(el('div', null, 'Welche Auswertung? Zum Beispiel:')); const rw = el('div', 'chrow'); ['Zusammenfassung', 'Welche Kennzahlen sind unter Ziel?', 'Auswertung Warranty', 'Auswertung Logistik', 'Maßnahmen offen'].forEach((t) => rw.append(btn(t, () => ask(t)))); b.append(rw); });
    return bubble('bot', (b) => { b.append(el('div', null, 'Das habe ich nicht verstanden. Ich kenne Kennzahlen („Wie hoch ist der Umsatz?“), Auswertungen („Auswertung Warranty“, „Zusammenfassung“, „unter Ziel“, „Regionen Vergleich OTIF“) und Maßnahmen („Neue Maßnahme: …“, „Maßnahmen offen“, „Maßnahme 2 erledigt“).')); const near = list.filter((x) => x.r.i != null).slice(0, 0); if (near.length) b.append(el('div')); });
  }
  function registerView(rk, list) {
    const names = REGMAP(), l = list.filter((k) => k.key === rk);
    return bubble('bot', (b) => {
      if (l.length) { const tg = l.filter((k) => k.r.i != null), ok = tg.filter((k) => k.r.i >= 100).length; b.append(el('div', null, names[rk] + ' (' + ctxTxt() + '): ' + (tg.length ? ok + ' von ' + tg.length + ' Kennzahlen mit Zielwert erreicht.' : 'keine Zielwerte hinterlegt.'))); table(b, ['Kennzahl', 'Ist', 'Ziel', 'Zielerf.'], l.map((k) => [k.r.label, fmt(k.r, k.r.value), k.r.target == null ? '–' : fmt(k.r, k.r.target), pc(k.r.i)])); }
      else { const O2 = window.__ov2, o = O2 && O2.DASH[rk] ? (() => { try { return O2.DASH[rk](); } catch (e) { return null; } })() : null; if (o) { b.append(el('div', null, names[rk] + ': ' + o.sub)); table(b, ['Kennzahl', 'Wert'], o.tiles.map((t) => [t.l, t.v])); (o.notes || []).slice(0, 2).forEach((n) => b.append(el('div', 'chcap', '• ' + n))); } else b.append(el('div', null, 'Für ' + names[rk] + ' liegen aktuell keine Kennzahlen vor – bitte das Register einmal öffnen.')); }
      b.append(btn('Register öffnen', () => H.show(rk)));
    });
  }
  function help() { bubble('bot', (b) => { b.append(el('div', null, 'Ich beantworte Fragen zu den Kennzahlen des Dashboards und führe Ihre Maßnahmen. Filter (Region, Zeitraum) oben gelten für meine Antworten. Beispiele:')); const rw = el('div', 'chrow'); ['Wie hoch ist der Umsatz?', 'Welche Kennzahlen sind unter Ziel?', 'Auswertung Warranty', 'Regionen Vergleich OTIF', 'Zusammenfassung', 'Maßnahmen offen', 'Neue Maßnahme: Lieferantenaudit starten, verantwortlich Müller, bis 30.11., Prio A', 'Region DACH'].forEach((t) => rw.append(btn(t.length > 34 ? t.slice(0, 32) + '…' : t, () => ask(t)))); b.append(rw); b.append(el('div', 'chcap', 'Hinweis: Ich arbeite mit festen Regeln auf den Dashboard-Daten (keine KI-Auswertung) und verstehe nur diese Fragearten.')); }); }
  function say(t) { bubble('bot', t); }
  function ask(t) { bubble('me', t); try { answer(t); } catch (e) { say('Das konnte ich nicht auswerten (' + String(e && e.message || e).slice(0, 80) + '). Bitte die Frage anders formulieren.'); } }
  // ======================= Fenster =======================
  const S = Object.assign({ open: false, x: null, y: null, w: 400, h: 560, tab: 'chat', min: false }, LS.get('chat-win', {}));
  let win = null, fab = null, trackBox = null;
  function persist() { LS.set('chat-win', { open: S.open, x: S.x, y: S.y, w: S.w, h: S.h, tab: S.tab, min: S.min }); }
  function place() { if (!win) return; const vw = window.innerWidth, vh = window.innerHeight, w = Math.min(S.w, vw - 16), h = Math.min(S.h, vh - 16); if (S.x == null) { S.x = Math.max(8, vw - w - 24); S.y = Math.max(8, vh - h - 90); } S.x = Math.min(Math.max(0, S.x), Math.max(0, vw - 120)); S.y = Math.min(Math.max(0, S.y), Math.max(0, vh - 44)); win.style.left = S.x + 'px'; win.style.top = S.y + 'px'; win.style.width = w + 'px'; win.style.height = S.min ? 'auto' : h + 'px'; win.classList.toggle('min', !!S.min); }
  function openWin(v) { S.open = v; if (win) win.hidden = !v; if (fab) { fab.setAttribute('aria-expanded', String(v)); fab.hidden = v; } if (v) { place(); setTimeout(() => { const i = document.getElementById('chat-in'); if (i && S.tab === 'chat') i.focus(); }, 30); } persist(); }
  function tab(t) { S.tab = t; if (!win) return; win.querySelectorAll('.chtabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.t === t))); win.querySelector('#chat-pane-chat').hidden = t !== 'chat'; win.querySelector('#chat-pane-track').hidden = t !== 'track'; if (t === 'track') drawTracker(); if (S.min) { S.min = false; place(); } persist(); if (!S.open) openWin(true); }
  function drawTracker() {
    const box = document.getElementById('chat-track'); if (!box) return; box.replaceChildren(); const all = sorted(), open = all.filter((a) => a.status !== 'Erledigt'), od = all.filter(overdue);
    const sum = el('div', 'chsum'); [['Offen', open.length], ['In Arbeit', all.filter((a) => a.status === 'In Arbeit').length], ['Überfällig', od.length], ['Erledigt', all.filter((a) => a.status === 'Erledigt').length]].forEach(([l, v]) => { const c = el('div', 'chsc' + (l === 'Überfällig' && v ? ' bad' : '')); c.append(el('b', null, String(v)), el('span', null, l)); sum.append(c); }); box.append(sum);
    box.append(el('div', 'chcap chmode', modeText()));
    const f = el('form', 'chform'); f.innerHTML = ''; const ti = el('input'); ti.placeholder = 'Neue Maßnahme (Titel)'; ti.setAttribute('aria-label', 'Titel'); ti.required = true; const bu = el('select'); bu.setAttribute('aria-label', 'Bereich'); BU_LIST.forEach((n) => bu.append(new Option(n, n))); const ow = el('input'); ow.placeholder = 'Verantwortlich'; ow.setAttribute('aria-label', 'Verantwortlich'); const du = el('input'); du.type = 'date'; du.value = addDays(30); du.setAttribute('aria-label', 'Fällig'); const pr = el('select'); pr.setAttribute('aria-label', 'Priorität'); Object.keys(PRIO).forEach((k2) => pr.append(new Option('Prio ' + k2 + ' (' + PRIO[k2] + ')', k2))); pr.value = 'B'; const sb = el('button', 'bkbtn pri', 'Anlegen'); sb.type = 'submit'; f.append(ti, bu, ow, du, pr, sb);
    f.addEventListener('submit', (e) => { e.preventDefault(); if (!ti.value.trim()) return; saveAction({ title: ti.value.trim(), bu: bu.value, owner: ow.value.trim(), due: du.value || addDays(30), prio: pr.value, note: 'angelegt im Chat-Tracker' }).then(() => { ti.value = ''; }); }); box.append(f);
    if (!all.length) { box.append(el('p', 'chcap', 'Noch keine Maßnahmen. Legen Sie eine an oder fragen Sie im Chat nach einer Kennzahl unter Ziel und wählen „Maßnahme anlegen“.')); return; }
    const w = el('div', 'chtw'), t = el('table', 'chtab'), hd = el('thead'), hr = el('tr'); ['#', 'Maßnahme', 'Fällig', 'Status'].forEach((h) => hr.append(el('th', null, h))); hd.append(hr); t.append(hd); const tb = el('tbody');
    all.forEach((a, i) => { const tr = el('tr', overdue(a) ? 'od' : ''); tr.append(el('td', null, String(i + 1))); const td = el('td'); td.append(el('div', 'cht', a.title), el('div', 'chcap', [a.bu, a.owner, PRIO[a.prio] ? 'Prio ' + a.prio : '', a.scope === 'private' ? 'persönlich' : a.scope === 'local' ? 'nur lokal' : ''].filter(Boolean).join(' · '))); tr.append(td, el('td', null, (overdue(a) ? '⚠ ' : '') + (a.due || '–').split('-').reverse().join('.'))); const ts = el('td'), sel = el('select'); sel.setAttribute('aria-label', 'Status ' + a.title); STAT.forEach((s) => sel.append(new Option(s, s))); sel.value = a.status || 'Offen'; sel.addEventListener('change', () => setStatus(a, sel.value)); ts.append(sel); tr.append(ts); tb.append(tr); }); t.append(tb); w.append(t); box.append(w); numbered = all;
  }
  function build() {
    if (win) return; fab = el('button', 'chfab', 'Chat'); fab.type = 'button'; fab.setAttribute('aria-label', 'Assistenten öffnen'); fab.setAttribute('aria-expanded', 'false'); fab.addEventListener('click', () => openWin(true));
    win = el('div', 'chatwin'); win.hidden = true; win.setAttribute('role', 'dialog'); win.setAttribute('aria-label', 'Assistent: Kennzahlen, Auswertungen, Maßnahmen');
    const hd = el('div', 'chhd'); hd.append(el('span', 'cht0', 'Assistent')); const bm = el('button', null, '–'), bc = el('button', null, '×'); bm.type = bc.type = 'button'; bm.setAttribute('aria-label', 'Minimieren'); bc.setAttribute('aria-label', 'Schließen'); hd.append(bm, bc);
    const tabs = el('div', 'chtabs'); [['chat', 'Chat'], ['track', 'Maßnahmen']].forEach(([k2, l]) => { const b = el('button', null, l); b.type = 'button'; b.dataset.t = k2; b.setAttribute('aria-selected', String(k2 === S.tab)); b.addEventListener('click', () => tab(k2)); tabs.append(b); });
    const p1 = el('div', 'chpane'); p1.id = 'chat-pane-chat'; const log = el('div', 'chlog'); log.id = 'chat-log'; log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite'); const chips = el('div', 'chchips'); ['Zusammenfassung', 'Unter Ziel', 'Maßnahmen offen', 'Hilfe'].forEach((t) => { const b = el('button', null, t); b.type = 'button'; b.addEventListener('click', () => ask(t === 'Unter Ziel' ? 'Welche Kennzahlen sind unter Ziel?' : t)); chips.append(b); });
    const fm = el('form', 'chin'); const inp = el('input'); inp.id = 'chat-in'; inp.placeholder = 'Frage oder Befehl, z. B. „Wie hoch ist der Umsatz?“'; inp.setAttribute('aria-label', 'Nachricht'); inp.autocomplete = 'off'; const sd = el('button', 'bkbtn pri', 'Senden'); sd.type = 'submit'; fm.append(inp, sd); fm.addEventListener('submit', (e) => { e.preventDefault(); const t = inp.value.trim(); if (!t) return; inp.value = ''; ask(t); }); p1.append(log, chips, fm);
    const p2 = el('div', 'chpane'); p2.id = 'chat-pane-track'; trackBox = el('div', 'chtrack'); trackBox.id = 'chat-track'; p2.append(trackBox); p2.hidden = S.tab !== 'track'; p1.hidden = S.tab !== 'chat';
    const rs = el('div', 'chrs'); rs.setAttribute('aria-hidden', 'true'); win.append(hd, tabs, p1, p2, rs); root.append(fab, win);
    bc.addEventListener('click', () => openWin(false)); bm.addEventListener('click', () => { S.min = !S.min; place(); persist(); });
    // Verschieben
    hd.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; const sx = e.clientX, sy = e.clientY, ox = S.x, oy = S.y; hd.setPointerCapture(e.pointerId); const mv = (ev) => { S.x = ox + ev.clientX - sx; S.y = oy + ev.clientY - sy; place(); }, up = () => { hd.removeEventListener('pointermove', mv); hd.removeEventListener('pointerup', up); persist(); }; hd.addEventListener('pointermove', mv); hd.addEventListener('pointerup', up); });
    // Größe ändern
    rs.addEventListener('pointerdown', (e) => { const sx = e.clientX, sy = e.clientY, ow = win.offsetWidth, oh = win.offsetHeight; rs.setPointerCapture(e.pointerId); const mv = (ev) => { S.w = Math.max(320, ow + ev.clientX - sx); S.h = Math.max(300, oh + ev.clientY - sy); place(); }, up = () => { rs.removeEventListener('pointermove', mv); rs.removeEventListener('pointerup', up); persist(); }; rs.addEventListener('pointermove', mv); rs.addEventListener('pointerup', up); e.preventDefault(); });
    win.addEventListener('keydown', (e) => { if (e.key === 'Escape') openWin(false); }); window.addEventListener('resize', () => { if (S.open) place(); });
    bubble('bot', (b) => { b.append(el('div', null, 'Hallo! Ich beantworte Fragen zu Kennzahlen, zeige Auswertungen und führe Ihre Maßnahmen. ' + ctxTxt() + '.')); const rw = el('div', 'chrow'); ['Wie hoch ist der Umsatz?', 'Auswertung Warranty', 'Hilfe'].forEach((t) => rw.append(btn(t, () => ask(t)))); b.append(rw); });
    openWin(S.open); if (S.tab === 'track') drawTracker();
  }
  function modeText() {
    if (!db) return 'Speicher: nur in diesem Browser (keine Datenbank verfügbar). Maßnahmen sind für andere nicht sichtbar.';
    if (canShared === false || saveMode === 'private') return 'Speicher: Ihr persönlicher Datenbank-Speicher (nur für Sie sichtbar, auf allen Ihren Geräten). Die gemeinsame Liste können nur Bearbeiter beschreiben – wer dort Rechte hat, sieht und ändert die gemeinsamen Maßnahmen.';
    if (saveMode === 'local') return 'Speicher: nur in diesem Browser – die Datenbank hat das Speichern abgelehnt.';
    return 'Speicher: gemeinsame Datenbank – alle Maßnahmen sind für alle sichtbar, die das Dashboard mit Rechten öffnen, und stehen auch im Register Maßnahmen.';
  }
  // Datenbank für Maßnahmen (gemeinsame Sammlung wie im Register Maßnahmen; sonst persönlich; sonst lokal)
  (async () => {
    try { const c = window.claude; if (c && c.use) { db = await c.use('db'); try { const u = await c.use('user'); uid = u && u.id ? await u.id() : null; if (u && u.can) { const v = u.can('data.write'); canShared = v === true ? true : v === false ? false : null; } } catch (e) { uid = null; } } } catch (e) { db = null; }
    if (db) {
      try { db.collection('actions').onSnapshot((snap) => { shared = snap.docs.map((d) => Object.assign({ id: d.id }, d.data())); merge(); drawTracker(); }, () => {}); } catch (e) { /* nur lesen nicht möglich */ }
      const d = privDoc(); if (d) { try { d.onSnapshot((s2) => { priv = s2.exists && s2.data() && Array.isArray(s2.data().list) ? s2.data().list : []; merge(); drawTracker(); }, () => {}); } catch (e) { /* ohne persönlichen Speicher */ } }
      saveMode = canShared === false ? 'private' : 'shared';
    } else localMode = true;
    merge(); drawTracker();
  })();
  const start = () => { try { build(); } catch (e) { /* Chat ist optional */ } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else setTimeout(start, 0);
  window.__chat = { ask, answer, open: () => openWin(true), S, allKpis, findKpi, newAction, actions: () => actions };
})();
