(function () {
  // Dateierzeuger für das Booklet: PDF, Word (docx) und PowerPoint (pptx) – ohne externe Bibliotheken
  const enc = new TextEncoder();
  const concat = (parts) => { const n = parts.reduce((s, a) => s + a.length, 0), o = new Uint8Array(n); let p = 0; parts.forEach((a) => { o.set(a, p); p += a.length; }); return o; };
  const xe = (s) => String(s == null ? '' : s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // ---------- ZIP (ohne Kompression) ----------
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = (u) => { let c = 0xFFFFFFFF; for (let i = 0; i < u.length; i++) c = CRC[(c ^ u[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  function zip(files) {
    const parts = [], central = []; let off = 0;
    files.forEach((f) => {
      const nm = enc.encode(f.name), d = typeof f.data === 'string' ? enc.encode(f.data) : f.data, crc = crc32(d);
      const lh = new DataView(new ArrayBuffer(30)); lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true); lh.setUint16(12, 0x5A21, true); lh.setUint32(14, crc, true); lh.setUint32(18, d.length, true); lh.setUint32(22, d.length, true); lh.setUint16(26, nm.length, true);
      parts.push(new Uint8Array(lh.buffer), nm, d);
      const ch = new DataView(new ArrayBuffer(46)); ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint16(14, 0x5A21, true); ch.setUint32(16, crc, true); ch.setUint32(20, d.length, true); ch.setUint32(24, d.length, true); ch.setUint16(28, nm.length, true); ch.setUint32(42, off, true);
      central.push(new Uint8Array(ch.buffer), nm); off += 30 + nm.length + d.length;
    });
    const cs = central.reduce((s, a) => s + a.length, 0), end = new DataView(new ArrayBuffer(22)); end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, cs, true); end.setUint32(16, off, true);
    return concat([...parts, ...central, new Uint8Array(end.buffer)]);
  }
  const today = () => new Date().toISOString();
  // ======================= PDF =======================
  const WINMAP = { '€': '\x80', '–': '\x96', '—': '\x97', '•': '\x95', '„': '\x84', '“': '\x93', '”': '\x94', '‚': '\x82', '’': '\x92', '‘': '\x91', '…': '\x85', '→': '->', '←': '<-', '≥': '>=', '≤': '<=', 'Δ': 'Delta ', '−': '-', '●': '*', '○': 'o', '×': '\xD7', '·': '\xB7', '✓': '', 'Σ': 'Summe', 'Ø': '\xD8', '≈': '~', '÷': '\xF7', '²': '\xB2', '³': '\xB3', '‹': '<', '›': '>', ' ': ' ', ' ': ' ' };
  const win = (s) => { let o = ''; for (const ch of String(s == null ? '' : s)) { const c = ch.charCodeAt(0); o += WINMAP[ch] !== undefined ? WINMAP[ch] : c < 256 ? ch : '?'; } return o; };
  function toPDF(model) {
    const W = 595.28, HH = 841.89, M = 42, CW = W - 2 * M, cv = document.createElement('canvas').getContext('2d');
    const meas = (s, size, bold) => { cv.font = (bold ? 'bold ' : '') + size + 'px Helvetica, Arial, "Liberation Sans", sans-serif'; return cv.measureText(s).width; };
    const wrap = (s, maxW, size, bold) => {
      const out = []; String(s).split('\n').forEach((para) => { let line = ''; para.split(/\s+/).forEach((w0) => { let w = w0; if (!w) return;
        while (meas(w, size, bold) > maxW && w.length > 1) { let k = w.length; while (k > 1 && meas(w.slice(0, k), size, bold) > maxW) k--; if (line) { out.push(line); line = ''; } out.push(w.slice(0, k)); w = w.slice(k); }
        const t = line ? line + ' ' + w : w; if (meas(t, size, bold) <= maxW) line = t; else { out.push(line); line = w; } }); out.push(line); });
      return out.length ? out : [''];
    };
    const pstr = (s) => { let o = '('; for (const ch of s) { const c = ch.charCodeAt(0); if (ch === '(' || ch === ')' || ch === '\\') o += '\\' + ch; else if (c < 32 || c > 126) o += '\\' + c.toString(8).padStart(3, '0'); else o += ch; } return o + ')'; };
    const pages = [], imgs = []; let pg = null, y = 0; const sectionPage = [];
    const newPage = () => { pg = { ops: [], im: new Set() }; pages.push(pg); y = M; return pg; };
    const T = (s, x, yy, size, bold, col) => pg.ops.push('BT /' + (bold ? 'F2' : 'F1') + ' ' + size + ' Tf ' + (col || '0.1 0.1 0.13') + ' rg ' + x.toFixed(2) + ' ' + (HH - yy).toFixed(2) + ' Td ' + pstr(s) + ' Tj ET');
    const R = (x, yy, w, h, col) => pg.ops.push(col + ' rg ' + x.toFixed(2) + ' ' + (HH - yy - h).toFixed(2) + ' ' + w.toFixed(2) + ' ' + h.toFixed(2) + ' re f');
    const L = (x1, y1, x2, y2, col, lw) => pg.ops.push((lw || 0.5) + ' w ' + col + ' RG ' + x1.toFixed(2) + ' ' + (HH - y1).toFixed(2) + ' m ' + x2.toFixed(2) + ' ' + (HH - y2).toFixed(2) + ' l S');
    const ensure = (h) => { if (y + h > HH - M - 16) newPage(); };
    const MUT = '0.4 0.42 0.46';
    function para(s, size, bold, col, indent, gap) { const lines = wrap(win(s), CW - (indent || 0), size, bold); lines.forEach((ln) => { ensure(size + 4); T(ln, M + (indent || 0), y + size, size, bold, col); y += size + 3.5; }); y += gap == null ? 3 : gap; }
    function table(b) {
      const sz = 7.8, pad = 3, lh = 9.6, tw = b.cols.reduce((s, c) => s + (c.w || 1), 0), cw = b.cols.map((c) => CW * (c.w || 1) / tw);
      const cells = (row, bold) => row.map((c, i) => wrap(win(c), cw[i] - 2 * pad, sz, bold));
      const drawRow = (row, head, shade) => {
        const cl = cells(row, head), h = Math.max(...cl.map((a) => a.length)) * lh + 2 * pad - 1; ensure(h + (head ? 0 : 0));
        if (head) R(M, y, CW, h, '0.91 0.925 0.945'); else if (shade) R(M, y, CW, h, '0.975 0.98 0.985');
        let x = M; cl.forEach((lines, i) => { lines.forEach((ln, k) => { const tx = b.cols[i].a === 'r' ? x + cw[i] - pad - meas(ln, sz, head) : x + pad; T(ln, tx, y + pad + sz - 1 + k * lh, sz, head, head ? '0.1 0.1 0.13' : '0.15 0.16 0.19'); }); x += cw[i]; });
        L(M, y + h, M + CW, y + h, '0.82 0.84 0.87', 0.4); y += h; return h;
      };
      const hdr = b.cols.map((c) => c.h); ensure(30); drawRow(hdr, true);
      b.rows.forEach((r, ri) => { const cl = cells(r.map((c) => (c == null ? '' : String(c))), false), h = Math.max(...cl.map((a) => a.length)) * lh + 2 * pad - 1; if (y + h > HH - M - 16) { newPage(); drawRow(hdr, true); } drawRow(r.map((c) => (c == null ? '' : String(c))), false, ri % 2 === 1); });
      y += 7; if (b.note) para(b.note, 7.5, false, MUT, 0, 5);
    }
    function image(b) {
      const wpt = Math.min(CW, b.w * 0.6), hpt = wpt * b.h / b.w; ensure(hpt + 16); imgs.push(b); const nm = 'Im' + imgs.length; pg.im.add(imgs.length);
      pg.ops.push('q ' + wpt.toFixed(2) + ' 0 0 ' + hpt.toFixed(2) + ' ' + M.toFixed(2) + ' ' + (HH - y - hpt).toFixed(2) + ' cm /' + nm + ' Do Q'); y += hpt + 4; if (b.cap) para(b.cap, 7.5, false, MUT, 0, 6); else y += 4;
    }
    // Deckblatt
    newPage(); R(0, 0, W, 250, '0.11 0.24 0.42'); T(win(model.title), M, 120, 28, true, '1 1 1'); wrap(win(model.subtitle), CW, 14, false).forEach((ln, i) => T(ln, M, 150 + i * 18, 14, false, '0.85 0.9 0.97'));
    let my = 300; (model.meta || []).forEach(([k, v]) => { T(win(k), M, my, 10, true, MUT); wrap(win(v), CW - 110, 10, false).forEach((ln, i) => { T(ln, M + 110, my + i * 13, 10, false); }); my += 20 + Math.max(0, wrap(win(v), CW - 110, 10, false).length - 1) * 13; });
    wrap(win(model.note || ''), CW, 9, false).forEach((ln, i) => T(ln, M, my + 30 + i * 12, 9, false, MUT));
    newPage(); // Inhaltsverzeichnis (wird später gefüllt)
    const tocPage = pg;
    model.sections.forEach((sec, si) => {
      newPage(); sectionPage[si] = pages.length; T(win(sec.title), M, y + 18, 18, true, '0.11 0.24 0.42'); L(M, y + 25, M + CW, y + 25, '0.11 0.24 0.42', 1.2); y += 38;
      sec.blocks.forEach((b, bi) => {
        if (b.t === 'h2') { const nb = sec.blocks[bi + 1]; ensure(34 + (nb && nb.t === 'img' ? Math.min(CW, nb.w * 0.6) * nb.h / nb.w + 16 : 0)); y += 4; para(b.text, 11.5, true, '0.11 0.24 0.42', 0, 3); } else if (b.t === 'p') para(b.text, 9.2, !!b.bold, null, 0, 4);
        else if (b.t === 'bullets') b.items.forEach((it) => { const lines = wrap(win(it), CW - 14, 9.2, false); lines.forEach((ln, i) => { ensure(13); if (i === 0) T('\x95', M + 2, y + 9.2, 9.2, false); T(ln, M + 14, y + 9.2, 9.2, false); y += 12.7; }); y += 1.5; });
        else if (b.t === 'table') table(b); else if (b.t === 'img') image(b);
      });
    });
    // Inhaltsverzeichnis füllen
    const keep = pg; pg = tocPage; y = M; T('Inhalt', M, y + 18, 18, true, '0.11 0.24 0.42'); L(M, y + 25, M + CW, y + 25, '0.11 0.24 0.42', 1.2); y += 46;
    model.sections.forEach((sec, si) => { T(win(sec.title), M + 4, y, 10.5, false); const pn = String(sectionPage[si] + 0); T(pn, M + CW - meas(pn, 10.5, false), y, 10.5, false, MUT); const tw = meas(win(sec.title), 10.5, false), dw = meas(pn, 10.5, false); for (let dx = M + 10 + tw; dx < M + CW - dw - 6; dx += 4) T('.', dx, y, 10.5, false, '0.7 0.72 0.75'); y += 19; });
    pg = keep;
    pages.forEach((p, i) => { pg = p; if (i > 0) { L(M, HH - 34, W - M, HH - 34, '0.82 0.84 0.87', 0.4); T(win(model.footer || ''), M, HH - 24, 7.5, false, MUT); const s = 'Seite ' + (i + 1) + ' von ' + pages.length; T(s, W - M - meas(s, 7.5, false), HH - 24, 7.5, false, MUT); } });
    // Dateiaufbau
    const objs = []; const add = (b) => { objs.push(typeof b === 'string' ? enc.encode(b) : b); return objs.length; };
    add('<< /Type /Catalog /Pages 2 0 R >>'); add('PLACEHOLDER'); add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'); add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    const imgIds = imgs.map((b) => add(concat([enc.encode('<< /Type /XObject /Subtype /Image /Width ' + b.w + ' /Height ' + b.h + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + b.jpeg.length + ' >>\nstream\n'), b.jpeg, enc.encode('\nendstream')])));
    const pageIds = [];
    pages.forEach((p) => {
      const content = enc.encode(p.ops.join('\n')), cid = add(concat([enc.encode('<< /Length ' + content.length + ' >>\nstream\n'), content, enc.encode('\nendstream')]));
      const xo = [...p.im].map((n) => '/Im' + n + ' ' + imgIds[n - 1] + ' 0 R').join(' ');
      pageIds.push(add('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W.toFixed(2) + ' ' + HH.toFixed(2) + '] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> /XObject << ' + xo + ' >> >> /Contents ' + cid + ' 0 R >>'));
    });
    objs[1] = enc.encode('<< /Type /Pages /Kids [' + pageIds.map((i) => i + ' 0 R').join(' ') + '] /Count ' + pageIds.length + ' >>');
    const info = add('<< /Title ' + pstr(win(model.title.replace(/[–—]/g, '-'))) + ' /Producer (Aftersales Parts Dashboard) /CreationDate (D:' + today().replace(/[-:T]/g, '').slice(0, 14) + 'Z) >>');
    const out = [enc.encode('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')], offs = []; let pos = out[0].length;
    objs.forEach((b, i) => { offs.push(pos); const h = enc.encode((i + 1) + ' 0 obj\n'), t = enc.encode('\nendobj\n'); out.push(h, b, t); pos += h.length + b.length + t.length; });
    let xref = 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n'; offs.forEach((o) => { xref += String(o).padStart(10, '0') + ' 00000 n \n'; });
    out.push(enc.encode(xref + 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root 1 0 R /Info ' + info + ' 0 R >>\nstartxref\n' + pos + '\n%%EOF'));
    return concat(out);
  }
  // ======================= DOCX =======================
  function toDOCX(model) {
    const media = []; let docId = 0;
    const run = (t, o) => '<w:r><w:rPr>' + (o && o.b ? '<w:b/>' : '') + (o && o.color ? '<w:color w:val="' + o.color + '"/>' : '') + (o && o.sz ? '<w:sz w:val="' + o.sz + '"/><w:szCs w:val="' + o.sz + '"/>' : '') + '</w:rPr><w:t xml:space="preserve">' + xe(t) + '</w:t></w:r>';
    const para = (t, o) => '<w:p><w:pPr>' + (o && o.style ? '<w:pStyle w:val="' + o.style + '"/>' : '') + (o && o.keep ? '<w:keepNext/>' : '') + (o && o.ind ? '<w:ind w:left="' + o.ind + '" w:hanging="' + (o.hang || 0) + '"/>' : '') + '</w:pPr>' + (t === '' ? '' : run(t, o)) + '</w:p>';
    const TW = 9638;
    function table(b) {
      const tw = b.cols.reduce((s, c) => s + (c.w || 1), 0), cw = b.cols.map((c) => Math.round(TW * (c.w || 1) / tw));
      const cell = (t, i, head, shade) => '<w:tc><w:tcPr><w:tcW w:w="' + cw[i] + '" w:type="dxa"/>' + (head ? '<w:shd w:val="clear" w:color="auto" w:fill="E8ECF1"/>' : shade ? '<w:shd w:val="clear" w:color="auto" w:fill="F8F9FB"/>' : '') + '</w:tcPr><w:p><w:pPr><w:spacing w:before="20" w:after="20"/>' + (b.cols[i].a === 'r' ? '<w:jc w:val="right"/>' : '') + '</w:pPr>' + run(t == null ? '' : String(t), { b: head, sz: 16 }) + '</w:p></w:tc>';
      let x = '<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="' + TW + '" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblCellMar><w:left w:w="60" w:type="dxa"/><w:right w:w="60" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>' + cw.map((w) => '<w:gridCol w:w="' + w + '"/>').join('') + '</w:tblGrid>';
      x += '<w:tr><w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>' + b.cols.map((c, i) => cell(c.h, i, true)).join('') + '</w:tr>';
      b.rows.forEach((r, ri) => { x += '<w:tr><w:trPr><w:cantSplit/></w:trPr>' + r.map((c, i) => cell(c, i, false, ri % 2 === 1)).join('') + '</w:tr>'; });
      return x + '</w:tbl>' + para('', {}) + (b.note ? para(b.note, { sz: 15, color: '666A73' }) : '');
    }
    function image(b) {
      const n = media.length + 1; media.push(b); docId++; const cxE = Math.round(Math.min(TW, 8800) * 635), cyE = Math.round(cxE * b.h / b.w);
      return '<w:p><w:pPr><w:keepNext/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="' + cxE + '" cy="' + cyE + '"/><wp:docPr id="' + docId + '" name="Grafik ' + n + '" descr="' + xe(b.cap || 'Grafik') + '"/><wp:cNvGraphicFramePr/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="' + docId + '" name="image' + n + '.jpeg"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdImg' + n + '"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + cxE + '" cy="' + cyE + '"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>' + (b.cap ? para(b.cap, { sz: 15, color: '666A73' }) : '');
    }
    let body = para(model.title, { style: 'Title' }) + para(model.subtitle, { style: 'Subtitle' });
    (model.meta || []).forEach(([k, v]) => { body += '<w:p><w:pPr><w:spacing w:after="40"/></w:pPr>' + run(k + ': ', { b: true, color: '666A73' }) + run(v) + '</w:p>'; });
    if (model.note) body += para(model.note, { sz: 17, color: '666A73' });
    body += para('Inhalt', { style: 'TOCHeading' }); model.sections.forEach((s, i) => { body += para((i + 1) + '  ' + s.title, { ind: 360 }); });
    model.sections.forEach((sec, si) => {
      body += para(sec.title, { style: 'Heading1' });
      sec.blocks.forEach((b) => { if (b.t === 'h2') body += para(b.text, { style: 'Heading2', keep: true }); else if (b.t === 'p') body += para(b.text, { b: b.bold }); else if (b.t === 'bullets') b.items.forEach((it) => { body += para('•\t' + it, { ind: 360, hang: 260 }); }); else if (b.t === 'table') body += table(b); else if (b.t === 'img') body += image(b); });
    });
    const NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"';
    const sect = '<w:sectPr><w:footerReference w:type="default" r:id="rIdFooter"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr>';
    const doc = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document ' + NS + '><w:body>' + body + sect + '</w:body></w:document>';
    const sty = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial" w:eastAsia="Arial"/><w:sz w:val="19"/><w:szCs w:val="19"/><w:lang w:val="de-DE"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="100" w:line="259" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>'
      + '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>'
      + '<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="1200" w:after="120"/></w:pPr><w:rPr><w:b/><w:color w:val="1C3D6B"/><w:sz w:val="60"/><w:szCs w:val="60"/></w:rPr></w:style>'
      + '<w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="360"/></w:pPr><w:rPr><w:color w:val="4A5568"/><w:sz w:val="30"/><w:szCs w:val="30"/></w:rPr></w:style>'
      + '<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:pageBreakBefore/><w:spacing w:before="0" w:after="200"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="1C3D6B"/><w:sz w:val="36"/><w:szCs w:val="36"/></w:rPr></w:style>'
      + '<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="220" w:after="80"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:color w:val="1C3D6B"/><w:sz w:val="25"/><w:szCs w:val="25"/></w:rPr></w:style>'
      + '<w:style w:type="paragraph" w:styleId="TOCHeading"><w:name w:val="TOC Heading"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:spacing w:before="480" w:after="120"/></w:pPr><w:rPr><w:b/><w:color w:val="1C3D6B"/><w:sz w:val="28"/></w:rPr></w:style>'
      + '<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>'
      + '<w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:basedOn w:val="TableNormal"/><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4" w:space="0" w:color="C9CED6"/><w:left w:val="single" w:sz="4" w:space="0" w:color="C9CED6"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="C9CED6"/><w:right w:val="single" w:sz="4" w:space="0" w:color="C9CED6"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="C9CED6"/><w:insideV w:val="single" w:sz="4" w:space="0" w:color="C9CED6"/></w:tblBorders></w:tblPr></w:style></w:styles>';
    const foot = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:pBdr><w:top w:val="single" w:sz="4" w:space="4" w:color="C9CED6"/></w:pBdr><w:tabs><w:tab w:val="right" w:pos="9638"/></w:tabs></w:pPr><w:r><w:rPr><w:color w:val="666A73"/><w:sz w:val="15"/></w:rPr><w:t xml:space="preserve">' + xe(model.footer || '') + '</w:t></w:r><w:r><w:rPr><w:color w:val="666A73"/><w:sz w:val="15"/></w:rPr><w:tab/><w:t xml:space="preserve">Seite </w:t></w:r><w:r><w:rPr><w:color w:val="666A73"/><w:sz w:val="15"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:rPr><w:color w:val="666A73"/><w:sz w:val="15"/></w:rPr><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:rPr><w:color w:val="666A73"/><w:sz w:val="15"/></w:rPr><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:rPr><w:color w:val="666A73"/><w:sz w:val="15"/></w:rPr><w:t>1</w:t></w:r><w:r><w:rPr><w:color w:val="666A73"/><w:sz w:val="15"/></w:rPr><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>';
    const RT = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
    const drels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="' + RT + '/styles" Target="styles.xml"/><Relationship Id="rIdFooter" Type="' + RT + '/footer" Target="footer1.xml"/>' + media.map((m, i) => '<Relationship Id="rIdImg' + (i + 1) + '" Type="' + RT + '/image" Target="media/image' + (i + 1) + '.jpeg"/>').join('') + '</Relationships>';
    const ct = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>';
    const rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="' + RT + '/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>';
    const core = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>' + xe(model.title) + '</dc:title><dc:creator>Aftersales Parts Dashboard</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">' + today().slice(0, 19) + 'Z</dcterms:created></cp:coreProperties>';
    return zip([{ name: '[Content_Types].xml', data: ct }, { name: '_rels/.rels', data: rels }, { name: 'word/document.xml', data: doc }, { name: 'word/styles.xml', data: sty }, { name: 'word/footer1.xml', data: foot }, { name: 'word/_rels/document.xml.rels', data: drels }, { name: 'docProps/core.xml', data: core }, ...media.map((m, i) => ({ name: 'word/media/image' + (i + 1) + '.jpeg', data: m.jpeg }))]);
  }
  // ======================= PPTX =======================
  function toPPTX(model) {
    const TPL = window.__BKT; if (!TPL) throw new Error('Vorlage fehlt');
    const SW = 12192000, SH = 6858000, MX = 400000, CWE = SW - 2 * MX, media = []; const slides = [];
    const A = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';
    const rpr = (o) => '<a:rPr lang="de-DE" sz="' + (o.sz || 1400) + '"' + (o.b ? ' b="1"' : '') + ' dirty="0"><a:solidFill><a:srgbClr val="' + (o.color || '1F2430') + '"/></a:solidFill><a:latin typeface="Arial"/><a:cs typeface="Arial"/></a:rPr>';
    const tp = (lines, o) => lines.map((t) => '<a:p><a:pPr algn="' + (o.algn || 'l') + '"><a:spcAft><a:spcPts val="' + (o.gap == null ? 400 : o.gap) + '"/></a:spcAft></a:pPr><a:r>' + rpr(o) + '<a:t>' + xe(t) + '</a:t></a:r></a:p>').join('');
    class Slide { constructor() { this.sh = []; this.rels = []; this.id = 1; } nid() { return ++this.id; }
      text(x, y, w, h, lines, o) { this.sh.push('<p:sp><p:nvSpPr><p:cNvPr id="' + this.nid() + '" name="Text ' + this.id + '"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="' + x + '" y="' + y + '"/><a:ext cx="' + w + '" cy="' + h + '"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr><p:txBody><a:bodyPr wrap="square" lIns="0" tIns="0" rIns="0" bIns="0" rtlCol="0" anchor="' + (o.anchor || 't') + '"><a:normAutofit/></a:bodyPr><a:lstStyle/>' + tp(lines, o) + '</p:txBody></p:sp>'); }
      rect(x, y, w, h, fill) { this.sh.push('<p:sp><p:nvSpPr><p:cNvPr id="' + this.nid() + '" name="Fläche ' + this.id + '"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="' + x + '" y="' + y + '"/><a:ext cx="' + w + '" cy="' + h + '"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="' + fill + '"/></a:solidFill><a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="de-DE"/></a:p></p:txBody></p:sp>'); }
      pic(x, y, w, h, m, descr) { media.push(m); const mi = media.length, rid = 'rId' + (this.rels.length + 2); this.rels.push([rid, '../media/image' + mi + '.jpeg']); this.sh.push('<p:pic><p:nvPicPr><p:cNvPr id="' + this.nid() + '" name="Grafik ' + this.id + '" descr="' + xe(descr || 'Grafik') + '"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="' + rid + '"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="' + x + '" y="' + y + '"/><a:ext cx="' + w + '" cy="' + h + '"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic>'); }
      table(x, y, cols, rows, o) {
        const tw = cols.reduce((s, c) => s + (c.w || 1), 0), cw = cols.map((c) => Math.round(CWE * (c.w || 1) / tw)), sz = o.sz || 1000;
        const cell = (t, i, head, shade) => '<a:tc><a:txBody><a:bodyPr/><a:lstStyle/><a:p><a:pPr algn="' + (cols[i].a === 'r' ? 'r' : 'l') + '"/><a:r>' + rpr({ sz, b: head, color: head ? '1F2430' : '2A2F3A' }) + '<a:t>' + xe(t == null ? '' : String(t)) + '</a:t></a:r></a:p></a:txBody><a:tcPr marL="54864" marR="54864" marT="27432" marB="27432" anchor="ctr"><a:lnL w="0"><a:noFill/></a:lnL><a:lnR w="0"><a:noFill/></a:lnR><a:lnT w="0"><a:noFill/></a:lnT><a:lnB w="6350"><a:solidFill><a:srgbClr val="C9CED6"/></a:solidFill></a:lnB><a:solidFill><a:srgbClr val="' + (head ? 'E8ECF1' : shade ? 'F8F9FB' : 'FFFFFF') + '"/></a:solidFill></a:tcPr></a:tc>';
        const rh = (r) => o.rh(r), tr = (cells, h) => '<a:tr h="' + h + '">' + cells + '</a:tr>';
        let total = rh(null), xml = tr(cols.map((c, i) => cell(c.h, i, true)).join(''), rh(null));
        rows.forEach((r, ri) => { const h = rh(r); total += h; xml += tr(r.map((c, i) => cell(c, i, false, ri % 2 === 1)).join(''), h); });
        this.sh.push('<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="' + this.nid() + '" name="Tabelle ' + this.id + '"/><p:cNvGraphicFramePr><a:graphicFrameLocks noGrp="1"/></p:cNvGraphicFramePr><p:nvPr/></p:nvGraphicFramePr><p:xfrm><a:off x="' + x + '" y="' + y + '"/><a:ext cx="' + CWE + '" cy="' + total + '"/></p:xfrm><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table"><a:tbl><a:tblPr firstRow="1" bandRow="1"/><a:tblGrid>' + cw.map((w) => '<a:gridCol w="' + w + '"/>').join('') + '</a:tblGrid>' + xml + '</a:tbl></a:graphicData></a:graphic></p:graphicFrame>');
        return total;
      }
      xml() { return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld ' + A + '><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>' + this.sh.join('') + '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>'; } }
    const mk = (title, section, n) => { const s = new Slide(); s.rect(0, 0, SW, 90000, '1C3D6B'); s.text(MX, 250000, CWE, 600000, [title + (n ? ' (' + n + ')' : '')], { sz: 2600, b: true, color: '1C3D6B' }); s.text(MX, SH - 330000, CWE, 200000, [model.footer + '  ·  Folie ' + (slides.length + 1)], { sz: 800, color: '7A808C' }); slides.push(s); return s; };
    // Titelfolie
    const t = new Slide(); t.rect(0, 0, SW, 3300000, '1C3D6B'); t.text(MX + 200000, 1250000, CWE - 400000, 900000, [model.title], { sz: 4000, b: true, color: 'FFFFFF' }); t.text(MX + 200000, 2250000, CWE - 400000, 700000, [model.subtitle], { sz: 1800, color: 'D6E2F5' });
    t.text(MX + 200000, 3700000, CWE - 400000, 2200000, (model.meta || []).map(([k, v]) => k + ': ' + v), { sz: 1500, color: '2A2F3A', gap: 600 }); t.text(MX + 200000, SH - 700000, CWE - 400000, 400000, [model.note || ''], { sz: 1000, color: '7A808C' }); slides.push(t);
    const ag = mk('Inhalt', '', 0); const per = model.sections.length > 12 ? 2 : 1, half = Math.ceil(model.sections.length / per);
    for (let c = 0; c < per; c++) ag.text(MX + c * Math.round(CWE / per), 1100000, Math.round(CWE / per) - 100000, 5000000, model.sections.slice(c * half, (c + 1) * half).map((s, i) => (c * half + i + 1) + '   ' + s.title), { sz: 1500, gap: 700 });
    const TOP = 1000000, BOT = SH - 500000;
    model.sections.forEach((sec) => {
      let pend = [], k = 0; const flush = () => { if (!pend.length) return; const s = mk(sec.title, sec.title, 0); s.text(MX, TOP, CWE, BOT - TOP, pend, { sz: 1400, gap: 800 }); pend = []; };
      sec.blocks.forEach((b) => {
        if (b.t === 'h2') { flush(); pend = [b.text]; }
        else if (b.t === 'p') { pend.push(b.text); if (pend.join(' ').length > 900) flush(); }
        else if (b.t === 'bullets') { b.items.forEach((it) => pend.push('• ' + it)); if (pend.join(' ').length > 900) flush(); }
        else if (b.t === 'table') {
          const tw = b.cols.reduce((s, c) => s + (c.w || 1), 0), sz = b.cols.length > 6 ? 900 : 1000, cwe = b.cols.map((c) => CWE * (c.w || 1) / tw), charW = sz / 100 * 12700 * 0.53, lh = sz / 100 * 12700 * 1.22;
          const rowH = (r) => { if (!r) return 300000; const ln = Math.max(...r.map((c, i) => Math.ceil(String(c == null ? '' : c).length * charW / Math.max(1, cwe[i] - 110000)))); return Math.round(Math.max(1, ln) * lh + 90000); };
          const intro = pend.slice(); pend = []; let chunk = [], used = 300000, first = true; const lead = intro.length ? Math.min(900000, 300000 + intro.join(' ').length * 3500) : 0;
          const emit = () => { const s = mk(sec.title, sec.title, 0); let y0 = TOP; if (first && intro.length) { s.text(MX, y0, CWE, lead, intro, { sz: 1200, gap: 300 }); y0 += lead; } s.table(MX, y0, b.cols, chunk, { sz, rh: rowH }); first = false; chunk = []; used = 300000; };
          b.rows.forEach((r) => { const h = rowH(r), avail = BOT - TOP - (first && intro.length ? lead : 0); if (used + h > avail && chunk.length) emit(); chunk.push(r); used += h; }); if (chunk.length || first) emit();
          if (b.note) pend.push(b.note);
        }
        else if (b.t === 'img') { const s = mk(sec.title, sec.title, 0); let y0 = TOP; if (pend.length) { const h = Math.min(1100000, 300000 + pend.join(' ').length * 3000); s.text(MX, y0, CWE, h, pend, { sz: 1200, gap: 300 }); y0 += h; pend = []; } const maxH = BOT - y0 - (b.cap ? 300000 : 0), maxW = CWE; let w = maxW, h = Math.round(w * b.h / b.w); if (h > maxH) { h = maxH; w = Math.round(h * b.w / b.h); } s.pic(MX + Math.round((CWE - w) / 2), y0, w, h, b, b.cap); if (b.cap) s.text(MX, y0 + h + 60000, CWE, 240000, [b.cap], { sz: 1000, color: '666A73', algn: 'ctr' }); }
      });
      flush();
    });
    const RT = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships', PR = 'http://schemas.openxmlformats.org/package/2006/relationships';
    const files = [];
    const ct = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/ppt/presProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"/><Override PartName="/ppt/viewProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"/><Override PartName="/ppt/tableStyles.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' + slides.map((s, i) => '<Override PartName="/ppt/slides/slide' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>').join('') + '</Types>';
    files.push({ name: '[Content_Types].xml', data: ct });
    files.push({ name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="' + PR + '"><Relationship Id="rId1" Type="' + RT + '/officeDocument" Target="ppt/presentation.xml"/><Relationship Id="rId2" Type="' + PR + '/metadata/core-properties" Target="docProps/core.xml"/></Relationships>' });
    files.push({ name: 'docProps/core.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>' + xe(model.title) + '</dc:title><dc:creator>Aftersales Parts Dashboard</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">' + today().slice(0, 19) + 'Z</dcterms:created></cp:coreProperties>' });
    files.push({ name: 'ppt/presentation.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation ' + A + ' saveSubsetFonts="1"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>' + slides.map((s, i) => '<p:sldId id="' + (256 + i) + '" r:id="rId' + (i + 10) + '"/>').join('') + '</p:sldIdLst><p:sldSz cx="' + SW + '" cy="' + SH + '"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>' });
    files.push({ name: 'ppt/_rels/presentation.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="' + PR + '"><Relationship Id="rId1" Type="' + RT + '/slideMaster" Target="slideMasters/slideMaster1.xml"/><Relationship Id="rId2" Type="' + RT + '/theme" Target="theme/theme1.xml"/><Relationship Id="rId3" Type="' + RT + '/presProps" Target="presProps.xml"/><Relationship Id="rId4" Type="' + RT + '/viewProps" Target="viewProps.xml"/><Relationship Id="rId5" Type="' + RT + '/tableStyles" Target="tableStyles.xml"/>' + slides.map((s, i) => '<Relationship Id="rId' + (i + 10) + '" Type="' + RT + '/slide" Target="slides/slide' + (i + 1) + '.xml"/>').join('') + '</Relationships>' });
    files.push({ name: 'ppt/presProps.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentationPr ' + A + '/>' });
    files.push({ name: 'ppt/viewProps.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:viewPr ' + A + '><p:normalViewPr><p:restoredLeft sz="15620"/><p:restoredTop sz="94660"/></p:normalViewPr><p:slideViewPr><p:cSldViewPr><p:cViewPr varScale="1"><p:scale><a:sx n="100" d="100"/><a:sy n="100" d="100"/></p:scale><p:origin x="0" y="0"/></p:cViewPr></p:cSldViewPr></p:slideViewPr><p:gridSpacing cx="72008" cy="72008"/></p:viewPr>' });
    files.push({ name: 'ppt/tableStyles.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:tblStyleLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>' });
    files.push({ name: 'ppt/theme/theme1.xml', data: TPL.theme });
    files.push({ name: 'ppt/slideMasters/slideMaster1.xml', data: TPL.master });
    files.push({ name: 'ppt/slideMasters/_rels/slideMaster1.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="' + PR + '"><Relationship Id="rId1" Type="' + RT + '/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="' + RT + '/theme" Target="../theme/theme1.xml"/></Relationships>' });
    files.push({ name: 'ppt/slideLayouts/slideLayout1.xml', data: TPL.layout });
    files.push({ name: 'ppt/slideLayouts/_rels/slideLayout1.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="' + PR + '"><Relationship Id="rId1" Type="' + RT + '/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>' });
    slides.forEach((s, i) => { files.push({ name: 'ppt/slides/slide' + (i + 1) + '.xml', data: s.xml() }); files.push({ name: 'ppt/slides/_rels/slide' + (i + 1) + '.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="' + PR + '"><Relationship Id="rId1" Type="' + RT + '/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>' + s.rels.map(([id, tg]) => '<Relationship Id="' + id + '" Type="' + RT + '/image" Target="' + tg + '"/>').join('') + '</Relationships>' }); });
    media.forEach((m, i) => files.push({ name: 'ppt/media/image' + (i + 1) + '.jpeg', data: m.jpeg }));
    return zip(files);
  }
  window.__bkx = { toPDF, toDOCX, toPPTX, zip };
})();
