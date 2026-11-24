(function () {
  const H = window.__hod, I = window.__imp; if (!H || !I) return;
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }), N0 = NF(0);
  const enc = new TextEncoder(), dec = new TextDecoder('utf-8');
  // ======================= CSV =======================
  function parseCSV(text) {
    text = text.replace(/^﻿/, ''); const first = text.split(/\r?\n/, 1)[0] || '', cnt = (c) => first.split(c).length - 1, delim = cnt(';') >= cnt(',') && cnt(';') >= cnt('\t') ? ';' : cnt('\t') > cnt(',') ? '\t' : ',';
    const rows = []; let row = [], f = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; }
      else if (ch === '"') q = true; else if (ch === delim) { row.push(f); f = ''; } else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(f); f = ''; rows.push(row); row = []; } else f += ch;
    }
    if (f !== '' || row.length) { row.push(f); rows.push(row); } return rows.filter((r) => r.some((x) => String(x).trim() !== ''));
  }
  const csvCell = (v, delim) => { if (v == null) return ''; let s = typeof v === 'number' ? String(v).replace('.', ',') : String(v); if (s.includes(delim) || s.includes('"') || /[\r\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"'; return s; };
  const toCSV = (rows) => '﻿' + rows.map((r) => r.map((v) => csvCell(v, ';')).join(';')).join('\r\n') + '\r\n';
  // ======================= XLSX lesen =======================
  async function inflate(u8) { const s = new Blob([u8]).stream().pipeThrough(new DecompressionStream('deflate-raw')); return new Uint8Array(await new Response(s).arrayBuffer()); }
  async function unzip(buf) {
    const u = new Uint8Array(buf), dv = new DataView(buf); let e = u.length - 22; while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--; if (e < 0) throw new Error('Keine gültige Excel-Datei (.xlsx).');
    const n = dv.getUint16(e + 10, true); let p = dv.getUint32(e + 16, true); const out = {};
    for (let i = 0; i < n; i++) {
      if (dv.getUint32(p, true) !== 0x02014b50) break; const method = dv.getUint16(p + 10, true), cs = dv.getUint32(p + 20, true), nl = dv.getUint16(p + 28, true), el2 = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), lho = dv.getUint32(p + 42, true), name = dec.decode(u.subarray(p + 46, p + 46 + nl));
      const lnl = dv.getUint16(lho + 26, true), lel = dv.getUint16(lho + 28, true), st = lho + 30 + lnl + lel, data = u.subarray(st, st + cs); out[name] = { method, data }; p += 46 + nl + el2 + cl;
    }
    const get = async (name) => { const f = out[name]; if (!f) return null; const raw = f.method === 0 ? f.data : f.method === 8 ? await inflate(f.data) : null; if (!raw) throw new Error('Nicht unterstützte Komprimierung in der Excel-Datei.'); return dec.decode(raw); };
    return { get, names: Object.keys(out) };
  }
  const colIdx = (ref) => { const m = /^([A-Z]+)/.exec(ref); let n = 0; for (const ch of m[1]) n = n * 26 + ch.charCodeAt(0) - 64; return n - 1; };
  const xml = (s) => new DOMParser().parseFromString(s, 'application/xml');
  const kids = (n, tag) => [...n.getElementsByTagName(tag)];
  async function readXLSX(buf) {
    if (typeof DecompressionStream === 'undefined') throw new Error('Dieser Browser kann Excel-Dateien nicht lesen (DecompressionStream fehlt). Bitte als CSV speichern.');
    const z = await unzip(buf), wb = z.get && await z.get('xl/workbook.xml'); if (!wb) throw new Error('Keine gültige Excel-Datei (.xlsx).');
    const rels = await z.get('xl/_rels/workbook.xml.rels'), relMap = {}; if (rels) kids(xml(rels), 'Relationship').forEach((r) => { relMap[r.getAttribute('Id')] = r.getAttribute('Target'); });
    const ss = []; const sst = await z.get('xl/sharedStrings.xml'); if (sst) kids(xml(sst), 'si').forEach((si) => ss.push(kids(si, 't').map((t) => t.textContent).join('')));
    const sheets = [];
    for (const s of kids(xml(wb), 'sheet')) {
      const rid = s.getAttribute('r:id') || s.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id'); let t = relMap[rid] || ''; t = t.replace(/^\//, ''); if (!t.startsWith('xl/')) t = 'xl/' + t;
      const sx = await z.get(t); if (!sx) continue; const rows = [];
      kids(xml(sx), 'row').forEach((r) => { const arr = []; kids(r, 'c').forEach((c) => { const ci = colIdx(c.getAttribute('r') || 'A1'), ty = c.getAttribute('t'), v = c.getElementsByTagName('v')[0]; let val = null;
        if (ty === 'inlineStr') val = kids(c, 't').map((x) => x.textContent).join(''); else if (v) { const tx = v.textContent; val = ty === 's' ? ss[+tx] : ty === 'str' ? tx : ty === 'b' ? tx === '1' : ty === 'e' ? null : tx === '' ? null : Number(tx); } arr[ci] = val; });
        const ri = +r.getAttribute('r') - 1; if (arr.length) rows[Number.isFinite(ri) ? ri : rows.length] = arr; });
      const dense = []; for (let i = 0; i < rows.length; i++) if (rows[i] && rows[i].some((x) => x != null && String(x).trim() !== '')) dense.push(Array.from(rows[i], (x) => (x === undefined ? null : x))); sheets.push({ name: s.getAttribute('name'), rows: dense });
    }
    return sheets;
  }
  // ======================= XLSX schreiben =======================
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  const colName = (i) => { let s = ''; for (i++; i > 0; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + (i - 1) % 26) + s; return s; };
  function writeXLSX(sheets) { // sheets: [{name, rows:[[header...],[...]], widths?}]
    const used = new Set(), nm = sheets.map((s) => { let n = String(s.name).replace(/[\[\]:*?/\\]/g, ' ').slice(0, 31) || 'Blatt', k = 1, b = n; while (used.has(n.toLowerCase())) n = b.slice(0, 28) + '_' + (++k); used.add(n.toLowerCase()); return n; });
    const files = [{ name: '[Content_Types].xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' + sheets.map((_, i) => '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join('') + '</Types>' },
      { name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' },
      { name: 'xl/workbook.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' + nm.map((n, i) => '<sheet name="' + esc(n) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>').join('') + '</sheets></workbook>' },
      { name: 'xl/_rels/workbook.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + sheets.map((_, i) => '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>').join('') + '<Relationship Id="rId' + (sheets.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>' },
      { name: 'xl/styles.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1C3D6B"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs></styleSheet>' }];
    sheets.forEach((s, si) => {
      const w = s.rows[0] ? s.rows[0].map((_, c) => { let m = String(s.rows[0][c] == null ? '' : s.rows[0][c]).length; for (let r = 1; r < Math.min(s.rows.length, 60); r++) m = Math.max(m, String(s.rows[r][c] == null ? '' : s.rows[r][c]).length); return Math.min(60, Math.max(8, m + 2)); }) : [];
      let x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' + (w.length ? '<cols>' + w.map((v, i) => '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + v + '" customWidth="1"/>').join('') + '</cols>' : '') + '<sheetData>';
      s.rows.forEach((r, ri) => { x += '<row r="' + (ri + 1) + '">'; r.forEach((v, ci) => { if (v == null || v === '') return; const ref = colName(ci) + (ri + 1), st = ri === 0 ? ' s="1"' : ''; if (typeof v === 'number' && isFinite(v)) x += '<c r="' + ref + '"' + st + '><v>' + v + '</v></c>'; else if (typeof v === 'boolean') x += '<c r="' + ref + '" t="b"><v>' + (v ? 1 : 0) + '</v></c>'; else x += '<c r="' + ref + '" t="inlineStr"' + st + '><is><t xml:space="preserve">' + esc(typeof v === 'object' ? JSON.stringify(v) : v) + '</t></is></c>'; }); x += '</row>'; });
      files.push({ name: 'xl/worksheets/sheet' + (si + 1) + '.xml', data: x + '</sheetData></worksheet>' });
    });
    return window.__bkx.zip(files);
  }
  // ======================= Werte prüfen und umwandeln =======================
  const parseNum = (v) => { if (typeof v === 'number') return isFinite(v) ? v : NaN; let s = String(v).trim().replace(/\s| /g, '').replace(/[€%]$/, ''); if (s === '') return null; if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '').replace(',', '.'); else if (/^-?\d+,\d+$/.test(s)) s = s.replace(',', '.'); return /^-?\d+(\.\d+)?([eE][-+]?\d+)?$/.test(s) ? Number(s) : NaN; };
  const serialMonth = (n) => { const d = new Date(Math.round((n - 25569) * 86400000)); return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0'); };
  function typeOf(ref, col) { for (let i = 0; i < ref.length && i < 200; i++) { const v = ref[i][col]; if (v !== null && v !== undefined) return typeof v; } return 'string'; }
  function validate(id, table, base) {
    const ref = I.original(id); const res = { id, errors: [], warnings: [], rows: null };
    if (!ref || !ref.length) { res.errors.push('Datensatz ' + id + ' ist noch nicht geladen.'); return res; }
    if (table.length < 2) { res.errors.push('Die Datei enthält keine Datenzeilen.'); return res; }
    const cols = Object.keys(ref[0]), head = table[0].map((h) => String(h == null ? '' : h).trim()), low = head.map((h) => h.toLowerCase()), pos = {};
    cols.forEach((c) => { const i = low.indexOf(c.toLowerCase()); if (i >= 0) pos[c] = i; });
    const missing = cols.filter((c) => pos[c] === undefined); if (missing.length) res.errors.push('Spalten fehlen: ' + missing.join(', ') + '. Erwartet werden die Spaltenüberschriften der Vorlage.');
    const extra = head.filter((h) => h && !cols.some((c) => c.toLowerCase() === h.toLowerCase())); if (extra.length) res.warnings.push('Unbekannte Spalten werden ignoriert: ' + extra.slice(0, 6).join(', ') + (extra.length > 6 ? ' …' : ''));
    if (res.errors.length) return res;
    const types = {}; cols.forEach((c) => { types[c] = typeOf(ref, c); }); const bad = {}, rows = [];
    for (let r = 1; r < table.length; r++) {
      const src = table[r]; if (!src || !src.some((x) => x != null && String(x).trim() !== '')) continue; const o = {};
      cols.forEach((c) => { let v = src[pos[c]]; const t = types[c];
        if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) { o[c] = null; return; }
        if (t === 'number') { const n = parseNum(v); if (n === null) o[c] = null; else if (Number.isNaN(n)) { (bad[c] = bad[c] || []).push([r + 1, v]); o[c] = null; } else o[c] = n; }
        else if (t === 'boolean') o[c] = typeof v === 'boolean' ? v : /^(1|true|wahr|ja|x)$/i.test(String(v).trim());
        else { if (typeof v === 'number' && /month$/i.test(c) && v > 20000) v = serialMonth(v); else if (typeof v === 'number') v = Number.isInteger(v) ? String(v) : String(v); o[c] = String(v).trim(); } });
      rows.push(o);
    }
    if (!rows.length) { res.errors.push('Die Datei enthält keine Datenzeilen.'); return res; }
    Object.keys(bad).forEach((c) => { const share = bad[c].length / rows.length, ex = 'z. B. „' + bad[c][0][1] + '“ in Zeile ' + bad[c][0][0]; if (share > 0.05) res.errors.push('Spalte ' + c + ': ' + bad[c].length + ' Werte sind keine Zahl (' + ex + ').'); else res.warnings.push('Spalte ' + c + ': ' + bad[c].length + ' Werte sind keine Zahl und bleiben leer (' + ex + ').'); });
    cols.filter((c) => /month$/i.test(c)).forEach((c) => { const nb = rows.filter((o) => o[c] != null && !/^\d{4}-\d{2}$/.test(o[c])); if (nb.length) res.errors.push('Spalte ' + c + ': Monate müssen als JJJJ-MM angegeben werden (z. B. 2026-03); gefunden: „' + nb[0][c] + '“.'); });
    if (base === 'append') { const cur = I.current(id) || []; res.rows = cur.concat(rows); res.added = rows.length; } else res.rows = rows;
    const n0 = (I.current(id) || []).length; res.warnings.push((base === 'append' ? rows.length + ' Zeilen werden angehängt (danach ' + res.rows.length + ' Zeilen).' : 'Ersetzt ' + N0.format(n0) + ' vorhandene durch ' + N0.format(rows.length) + ' neue Zeilen.')); return res;
  }
  const dsRows = (id) => I.current(id) || I.original(id) || [];
  const dsTable = (id) => { const r = dsRows(id); if (!r.length) return null; const cols = Object.keys(r[0]); return [cols].concat(r.map((o) => cols.map((c) => o[c]))); };
  // ======================= Oberfläche =======================
  const S = { ch: 0, ds: null, mode: 'replace', plan: null, file: '' };
  let built = false;
  const msg = (t, bad) => { const e = $('imp-msg'); if (e) { e.textContent = t || ''; e.className = 'bkmsg' + (bad ? ' bad' : ''); } };
  const slug = (s) => String(s).replace(/[^A-Za-z0-9ÄÖÜäöüß]+/g, '_').replace(/^_|_$/g, '');
  async function save(name, bytes, mime) { const b = window.__bk && window.__bk.saveFile; const blob = new Blob([bytes], { type: mime }); if (b) return b(name, blob); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 4000); return 'saved'; }
  const XM = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  function build() {
    const panel = $('imp'); if (!panel || built) return; built = true;
    const c1 = el('div', 'card'), hd = el('div', 'cardhead'); hd.append(el('h3', null, 'Daten je Kapitel importieren'));
    c1.append(hd, el('p', 'note', 'Wählen Sie ein Kapitel (Register) und einen Datensatz, laden Sie die Vorlage mit den aktuellen Daten herunter, ändern oder ergänzen Sie sie und laden Sie die Datei als Excel (.xlsx) oder CSV wieder hoch. Die Registerseiten und alle berechneten Kennzahlen rechnen sofort mit den neuen Daten.'));
    const row1 = el('div', 'toprow regrow'); const l1 = el('label', 'flt', 'Kapitel '), s1 = el('select'); s1.id = 'imp-ch'; s1.setAttribute('aria-label', 'Kapitel'); l1.append(s1);
    const l2 = el('label', 'flt', 'Datensatz '), s2 = el('select'); s2.id = 'imp-ds'; s2.setAttribute('aria-label', 'Datensatz'); l2.append(s2);
    const l3 = el('label', 'flt', 'Übernahme '), s3 = el('select'); s3.id = 'imp-mode'; s3.setAttribute('aria-label', 'Übernahme'); s3.append(new Option('Daten ersetzen', 'replace'), new Option('Zeilen anhängen', 'append')); l3.append(s3); row1.append(l1, l2, l3); c1.append(row1);
    const row2 = el('div', 'toprow regrow'); [['imp-tcsv', 'Vorlage als CSV'], ['imp-txls', 'Vorlage als Excel'], ['imp-tall', 'Vorlage Kapitel (alle Datensätze, Excel)']].forEach(([id, t]) => { const b = el('button', 'bkbtn', t); b.id = id; b.type = 'button'; row2.append(b); }); c1.append(row2);
    const drop = el('div', 'impdrop'); drop.id = 'imp-drop'; drop.tabIndex = 0; drop.setAttribute('role', 'button'); drop.append(el('strong', null, 'Datei hier ablegen oder klicken'), el('span', 'mut small', ' · Excel (.xlsx) oder CSV (; , oder Tab als Trenner, UTF-8)')); const fi = el('input'); fi.type = 'file'; fi.id = 'imp-file'; fi.accept = '.csv,.xlsx,.txt,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'; fi.hidden = true; fi.multiple = false; drop.append(fi); c1.append(drop);
    const m = el('p', 'bkmsg'); m.id = 'imp-msg'; m.setAttribute('role', 'status'); c1.append(m); const pv = el('div'); pv.id = 'imp-prev'; c1.append(pv);
    const c2 = el('div', 'card'), h2 = el('div', 'cardhead'); h2.append(el('h3', null, 'Aktive Importe')); const ac = el('div'); ac.id = 'imp-act'; c2.append(h2, ac);
    const c3 = el('div', 'card'), h3 = el('div', 'cardhead'); h3.append(el('h3', null, 'Regeln für Dateien')); const ul = el('ul', 'dcl'); ['Die erste Zeile enthält die Spaltenüberschriften der Vorlage (Groß-/Kleinschreibung egal); die Reihenfolge ist beliebig, zusätzliche Spalten werden ignoriert.', 'Zahlen mit Dezimalkomma oder -punkt; Tausenderpunkte sind erlaubt. Leere Zellen bleiben leer.', 'Monate stehen als JJJJ-MM (2026-03). Excel-Datumswerte in Monatsspalten werden umgerechnet.', 'Excel-Mappe mit mehreren Blättern: Blätter, die wie ein Datensatz des gewählten Kapitels heißen (z. B. mo_monthly), werden alle auf einmal geprüft.', 'Vor der Übernahme zeigt eine Vorschau Zeilenzahl, Warnungen und Fehler; mit Fehlern wird nichts übernommen.', 'Importierte Daten gelten nur in Ihrem Browser (lokal gespeichert) und lassen sich je Datensatz oder komplett zurücksetzen. Sie ändern nicht die veröffentlichte Seite für andere.'].forEach((t) => ul.append(el('li', null, t))); c3.append(h3, ul);
    panel.append(c1, c2, c3);
    s1.append(...I.CH.map((c, i) => new Option(c[0], String(i)))); s1.value = String(S.ch);
    s1.addEventListener('change', () => { S.ch = +s1.value; S.ds = null; fillDs(); S.plan = null; $('imp-prev').replaceChildren(); msg(''); });
    s2.addEventListener('change', () => { S.ds = s2.value; }); s3.addEventListener('change', () => { S.mode = s3.value; if (S.plan && S.plan.raw) analyse(S.plan.raw); });
    $('imp-tcsv').addEventListener('click', tplCsv); $('imp-txls').addEventListener('click', tplXls); $('imp-tall').addEventListener('click', tplAll);
    drop.addEventListener('click', () => fi.click()); drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fi.click(); } });
    ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); })); ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
    drop.addEventListener('drop', (e) => { const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) readFile(f); }); fi.addEventListener('change', () => { if (fi.files[0]) readFile(fi.files[0]); fi.value = ''; });
    fillDs();
  }
  function fillDs() {
    const s2 = $('imp-ds'), ids = I.CH[S.ch][1]; s2.replaceChildren(...ids.map((id) => { const r = I.current(id); return new Option(id + ' – ' + (I.LAB[id] || id) + (r ? ' (' + N0.format(r.length) + ' Zeilen)' : ' (lädt …)'), id); })); if (!S.ds || !ids.includes(S.ds)) S.ds = ids[0]; s2.value = S.ds;
  }
  async function tplCsv() { const t = dsTable(S.ds); if (!t) { msg('Datensatz ist noch nicht geladen.', true); return; } const r = await save(S.ds + '.csv', enc.encode(toCSV(t)), 'text/csv;charset=utf-8'); msg(r === 'declined' ? 'Speichern abgebrochen.' : 'Vorlage ' + S.ds + '.csv erzeugt (' + N0.format(t.length - 1) + ' Zeilen, Trennzeichen „;“, Dezimalkomma).'); }
  async function tplXls() { const t = dsTable(S.ds); if (!t) { msg('Datensatz ist noch nicht geladen.', true); return; } const r = await save(S.ds + '.xlsx', writeXLSX([{ name: S.ds, rows: t }]), XM); msg(r === 'declined' ? 'Speichern abgebrochen.' : 'Vorlage ' + S.ds + '.xlsx erzeugt.'); }
  async function tplAll() { const ids = I.CH[S.ch][1], sh = ids.map((id) => ({ name: id, rows: dsTable(id) })).filter((s) => s.rows); if (!sh.length) { msg('Daten sind noch nicht geladen.', true); return; } const r = await save('Import_' + slug(I.CH[S.ch][0]) + '.xlsx', writeXLSX(sh), XM); msg(r === 'declined' ? 'Speichern abgebrochen.' : 'Mappe mit ' + sh.length + ' Blättern erzeugt – Blattnamen = Datensatznamen, bitte nicht umbenennen.'); }
  async function readFile(f) {
    S.file = f.name; msg('Datei wird gelesen …'); $('imp-prev').replaceChildren();
    try {
      const nm = f.name.toLowerCase(); let tabs;
      if (/\.xlsx$/.test(nm)) tabs = (await readXLSX(await f.arrayBuffer())).map((s) => ({ name: s.name, rows: s.rows }));
      else if (/\.(csv|txt)$/.test(nm)) tabs = [{ name: f.name.replace(/\.[^.]+$/, ''), rows: parseCSV(dec.decode(new Uint8Array(await f.arrayBuffer()))) }];
      else { msg('Bitte eine .xlsx- oder .csv-Datei wählen.', true); return; }
      S.plan = { raw: tabs }; analyse(tabs);
    } catch (e) { msg('Datei konnte nicht gelesen werden: ' + (e && e.message ? e.message : e), true); }
  }
  function analyse(tabs) {
    const ids = I.CH[S.ch][1], items = []; const byName = new Map(tabs.map((t) => [t.name.toLowerCase(), t]));
    ids.forEach((id) => { const t = byName.get(id.toLowerCase()); if (t) items.push({ id, tab: t }); });
    if (!items.length) { if (tabs.length === 1 || tabs.every((t) => !ids.some((i) => i.toLowerCase() === t.name.toLowerCase()))) items.push({ id: S.ds, tab: tabs[0] }); }
    items.forEach((it) => { it.res = validate(it.id, it.tab.rows, S.mode); }); S.plan.items = items; preview();
  }
  function preview() {
    const box = $('imp-prev'); box.replaceChildren(); const items = S.plan.items, okN = items.filter((i) => !i.res.errors.length).length;
    items.forEach((it) => {
      const card = el('div', 'impres'), t = el('h4', null, it.id + ' – ' + (I.LAB[it.id] || '') + (it.tab.name.toLowerCase() === it.id ? '' : ' (Blatt „' + it.tab.name + '“)')); card.append(t);
      it.res.errors.forEach((e) => card.append(el('p', 'bkmsg bad', '✗ ' + e))); it.res.warnings.forEach((w) => card.append(el('p', 'note', 'ℹ ' + w)));
      if (!it.res.errors.length && it.res.rows) { const rows = it.res.rows.slice(S.mode === 'append' ? -Math.min(6, it.res.added) : 0, S.mode === 'append' ? undefined : 6), cols = Object.keys(it.res.rows[0]).slice(0, 8), w = el('div', 'tbl-wrap'), tb = el('table', 'tbl'); tb.dataset.own = '1'; const th = el('thead'), tr = el('tr'); cols.forEach((c, i) => { const h = el('th', i ? 'num' : null, c); tr.append(h); }); th.append(tr); const bd = el('tbody'); rows.forEach((r) => { const q = el('tr'); cols.forEach((c, i) => q.append(el('td', i ? 'num' : null, r[c] == null ? '' : String(r[c])))); bd.append(q); }); tb.append(th, bd); w.append(tb); card.append(w, el('p', 'note', 'Vorschau der ' + (S.mode === 'append' ? 'letzten angehängten' : 'ersten') + ' Zeilen' + (Object.keys(it.res.rows[0]).length > 8 ? ' und der ersten 8 Spalten' : '') + '.')); }
      box.append(card);
    });
    const bar = el('div', 'toprow regrow'), ap = el('button', 'bkbtn pri', okN === items.length ? 'Daten übernehmen' : okN ? okN + ' fehlerfreie Datensätze übernehmen' : 'Übernehmen nicht möglich'), cn = el('button', 'bkbtn', 'Verwerfen'); ap.type = cn.type = 'button'; ap.disabled = !okN;
    ap.addEventListener('click', () => { let saved = true, n = 0; items.forEach((it) => { if (!it.res.errors.length) { saved = I.set(it.id, it.res.rows, { file: S.file, mode: S.mode, kapitel: I.CH[S.ch][0] }) && saved; n++; } }); S.plan = null; box.replaceChildren(); fillDs(); drawActive(); msg(n + ' Datensatz' + (n > 1 ? 'sätze' : '') + ' übernommen' + (saved ? '' : ' (nur für diese Sitzung – lokaler Speicher voll oder gesperrt)') + '. Die Register rechnen jetzt mit den neuen Daten.'); });
    cn.addEventListener('click', () => { S.plan = null; box.replaceChildren(); msg('Verworfen.'); }); bar.append(ap, cn); box.append(bar);
    msg(okN === items.length ? 'Datei geprüft: keine Fehler.' : okN ? 'Datei geprüft: ' + (items.length - okN) + ' von ' + items.length + ' Datensätzen mit Fehlern.' : 'Datei geprüft: Fehler gefunden, nichts wird übernommen.', okN !== items.length);
  }
  function drawActive() {
    const box = $('imp-act'); if (!box) return; box.replaceChildren(); const L = I.list();
    if (!I.ok()) box.append(el('p', 'bkmsg bad', 'Hinweis: In dieser Umgebung lässt sich die Datenabfrage nicht umleiten – Importe wirken eventuell nicht.'));
    if (!L.length) { box.append(el('p', 'note', 'Keine eigenen Daten aktiv – das Dashboard zeigt die Testdaten.')); return; }
    const w = el('div', 'tbl-wrap'), tb = el('table', 'tbl'); tb.dataset.own = '1'; const th = el('thead'), tr = el('tr'); ['Datensatz', 'Kapitel', 'Zeilen', 'Datei', 'Stand', ''].forEach((h, i) => tr.append(el('th', i === 2 ? 'num' : null, h))); th.append(tr); const bd = el('tbody');
    L.forEach((x) => { const q = el('tr'); q.append(el('td', null, x.id + ' – ' + (I.LAB[x.id] || '')), el('td', null, x.kapitel || ''), el('td', 'num', N0.format(x.rows)), el('td', null, (x.file || '') + (x.mode === 'append' ? ' (angehängt)' : '')), el('td', null, new Date(x.at).toLocaleString('de-DE'))); const b = el('button', 'bkbtn', 'Zurücksetzen'); b.type = 'button'; b.addEventListener('click', () => { I.clear(x.id); fillDs(); drawActive(); msg('Originaldaten für ' + x.id + ' wiederhergestellt.'); }); const td = el('td'); td.append(b); q.append(td); bd.append(q); });
    tb.append(th, bd); w.append(tb); const bar = el('div', 'toprow regrow'), all = el('button', 'bkbtn', 'Alle Importe zurücksetzen'); all.type = 'button'; all.addEventListener('click', () => { I.clear(); fillDs(); drawActive(); msg('Alle Importe zurückgesetzt – das Dashboard zeigt wieder die Testdaten.'); }); bar.append(all); box.append(w, bar);
  }
  window.__xlsx = { parseCSV, toCSV, readXLSX, writeXLSX, validate, parseNum };
  window.__hodDraw.imp = () => { build(); fillDs(); drawActive(); };
})();
