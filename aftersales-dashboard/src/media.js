(function () {
  const H = window.__hod; if (!H) return;
  const FMT = H.FMT, $ = (id) => document.getElementById(id);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const N0 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }), N1 = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const AGES = ['0-2 J', '3-5 J', '6-8 J', '9-12 J', '13+ J'];
  // Karosserieprofile (Seitenansicht, Front rechts): Koordinaten im Raster 400 × 200
  const T = {
    hatch: { x0: 85, x1: 322, yD: 112, yB: 112, yR: 64, cr0: 90, cr1: 108, cf1: 218, cf0: 254, wr: 128, wf: 272, r: 21 },
    compact: { x0: 70, x1: 332, yD: 112, yB: 110, yR: 62, cr0: 80, cr1: 105, cf1: 228, cf0: 268, wr: 120, wf: 287, r: 22 },
    sedan: { x0: 55, x1: 346, yD: 106, yB: 108, yR: 60, cr0: 118, cr1: 142, cf1: 232, cf0: 274, wr: 112, wf: 297, r: 22 },
    estate: { x0: 52, x1: 346, yD: 110, yB: 108, yR: 60, cr0: 60, cr1: 84, cf1: 232, cf0: 276, wr: 108, wf: 294, r: 22 },
    lux: { x0: 48, x1: 352, yD: 105, yB: 106, yR: 58, cr0: 112, cr1: 142, cf1: 238, cf0: 286, wr: 108, wf: 306, r: 23 },
    suv: { x0: 62, x1: 338, yD: 100, yB: 100, yR: 50, cr0: 66, cr1: 82, cf1: 240, cf0: 280, wr: 112, wf: 294, r: 26 },
    cross: { x0: 66, x1: 334, yD: 104, yB: 104, yR: 56, cr0: 76, cr1: 96, cf1: 232, cf0: 274, wr: 116, wf: 290, r: 25 },
    van: { x0: 52, x1: 346, yD: 92, yB: 98, yR: 34, cr0: 54, cr1: 56, cf1: 254, cf0: 292, wr: 108, wf: 298, r: 24 },
    evh: { x0: 76, x1: 328, yD: 108, yB: 112, yR: 60, cr0: 90, cr1: 120, cf1: 224, cf0: 270, wr: 122, wf: 284, r: 23 }
  };
  const SER = {
    'Kleinwagen A0': ['hatch', '#d94f3d'], 'Kompakt K1': ['compact', '#3b6fb6'], 'Limousine L2': ['sedan', '#2c2f36'], 'Kombi C4': ['estate', '#9aa1a9'], 'Oberklasse O3': ['lux', '#1f4a38'],
    'SUV S3': ['suv', '#e9eaec'], 'Crossover S4': ['cross', '#c4793a'], 'Transporter T5': ['van', '#eceff3'], 'Elektro E6': ['evh', '#2fa8b8'], 'Elektro E7': ['cross', '#6b4fbf']
  };
  const EV = (s) => /Elektro/.test(s);
  const hex = (c) => { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const rgb = (a) => '#' + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (c, d, t) => { const a = hex(c), b = hex(d); return rgb(a.map((v, i) => v + (b[i] - v) * t)); };
  const seeded = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; }; };
  let uid = 0;
  // Gerenderte Fahrzeug-Illustration; Altersscheibe 0–4 steuert Lack, Schmutz, Kratzer, Rost, Scheinwerfer und Reifen
  function carMarkup(series, ai, W) {
    const [type, base] = SER[series] || SER['Kompakt K1'], P = T[type], id = 'cv' + (++uid), rnd = seeded(series + ai), ev = EV(series);
    const sat = [1, 0.95, 0.85, 0.72, 0.58][ai], dirt = [0, 0.1, 0.2, 0.32, 0.45][ai], rust = [0, 0, 0, 0.5, 0.9][ai];
    const paint = mix(base, '#7a746a', [0, 0.04, 0.12, 0.22, 0.34][ai]), hi = mix(paint, '#ffffff', 0.45), lo = mix(paint, '#000000', 0.42);
    const cy = 142, r = P.r, wy = cy, ground = cy + r;
    const lowerD = `M ${P.x0} 150 L ${P.x0} ${P.yD + 4} Q ${P.x0} ${P.yD - 2} ${P.x0 + 14} ${P.yD - 3} L ${P.cr0} ${P.yD - 3} L ${P.cf0} ${P.yB - 2} L ${P.x1 - 26} ${P.yB + 2} Q ${P.x1 - 4} ${P.yB + 8} ${P.x1} ${P.yB + 24} L ${P.x1} 150 Z`;
    const cabD = `M ${P.cr0} ${P.yD - 3} Q ${P.cr0 + 2} ${P.yR + 6} ${P.cr1} ${P.yR} L ${P.cf1} ${P.yR} Q ${P.cf0 - 18} ${P.yR + 6} ${P.cf0} ${P.yB - 2} Z`;
    const mid = (P.cr1 + P.cf1) / 2, glass = `M ${P.cr0 + 6} ${P.yD - 7} Q ${P.cr0 + 8} ${P.yR + 9} ${P.cr1 + 4} ${P.yR + 6} L ${P.cf1 - 2} ${P.yR + 6} Q ${P.cf0 - 20} ${P.yR + 10} ${P.cf0 - 8} ${P.yB - 6} Z`;
    const wheel = (cx) => {
      const spokes = ev ? '' : Array.from({ length: 5 }, (_, k) => { const a = k * 72 * Math.PI / 180; return `<line x1="${cx}" y1="${wy}" x2="${(cx + Math.cos(a) * r * 0.58).toFixed(1)}" y2="${(wy + Math.sin(a) * r * 0.58).toFixed(1)}" stroke="#6d737b" stroke-width="${(r * 0.1).toFixed(1)}" stroke-linecap="round"/>`; }).join('');
      return `<g><ellipse cx="${cx}" cy="${wy}" rx="${r + 5}" ry="${r + 4}" fill="#14161a"/><circle cx="${cx}" cy="${wy}" r="${r}" fill="url(#${id}t)"/><circle cx="${cx}" cy="${wy}" r="${r * 0.66}" fill="url(#${id}r)"/>`
        + (ev ? `<circle cx="${cx}" cy="${wy}" r="${r * 0.5}" fill="${mix('#9aa3ad', '#3a3226', rust ? 0.35 : 0.05 * ai)}" opacity=".85"/><path d="M ${cx - r * 0.5} ${wy} A ${r * 0.5} ${r * 0.5} 0 0 1 ${cx + r * 0.5} ${wy}" fill="none" stroke="#fff" stroke-opacity=".3"/>` : spokes + `<circle cx="${cx}" cy="${wy}" r="${r * 0.34}" fill="#2a2d33"/>`) + `<circle cx="${cx}" cy="${wy}" r="${r * 0.12}" fill="#c9ced4"/></g>`;
    };
    const scr = Array.from({ length: [0, 2, 5, 8, 13][ai] }, () => { const x = P.x0 + 12 + rnd() * (P.x1 - P.x0 - 40), y = P.yD + 6 + rnd() * 34, l = 8 + rnd() * 26; return `<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x + l).toFixed(1)}" y2="${(y + (rnd() - 0.5) * 6).toFixed(1)}" stroke="${rnd() > 0.5 ? '#fff' : '#3a3a3a'}" stroke-opacity="${(0.25 + rnd() * 0.3).toFixed(2)}" stroke-width=".7"/>`; }).join('');
    const dents = ai >= 2 ? Array.from({ length: ai - 1 }, () => { const x = P.x0 + 30 + rnd() * (P.x1 - P.x0 - 80), y = P.yD + 14 + rnd() * 18; return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(7 + rnd() * 8).toFixed(1)}" ry="${(3 + rnd() * 3).toFixed(1)}" fill="url(#${id}d)"/>`; }).join('') : '';
    const rustSpots = ai >= 3 ? Array.from({ length: (ai - 2) * 4 }, (_, k) => { const near = k % 2 ? P.wr : P.wf, x = near + (rnd() - 0.5) * 80, y = 128 + rnd() * 20; return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.6 + rnd() * 3.2).toFixed(1)}" fill="#8a4a1d" fill-opacity="${(0.45 + rnd() * 0.4).toFixed(2)}"/>`; }).join('') : '';
    const lamp = `<path d="M ${P.x1 - 30} ${P.yB + 4} Q ${P.x1 - 8} ${P.yB + 6} ${P.x1 - 3} ${P.yB + 16} L ${P.x1 - 12} ${P.yB + 18} Q ${P.x1 - 24} ${P.yB + 14} ${P.x1 - 30} ${P.yB + 4} Z" fill="url(#${id}h)" stroke="#444" stroke-width=".6"/>` + (ai >= 3 ? `<path d="M ${P.x1 - 30} ${P.yB + 4} Q ${P.x1 - 8} ${P.yB + 6} ${P.x1 - 3} ${P.yB + 16} L ${P.x1 - 12} ${P.yB + 18} Q ${P.x1 - 24} ${P.yB + 14} ${P.x1 - 30} ${P.yB + 4} Z" fill="#c78a1e" fill-opacity="${ai === 3 ? 0.3 : 0.5}"/>` : '');
    const tail = ev ? `<rect x="${P.x0 - 1}" y="${P.yD + 2}" width="9" height="3.4" rx="1.5" fill="#d1242f"/>` : `<rect x="${P.x0 - 1}" y="${P.yD + 2}" width="8" height="14" rx="2" fill="#b3202a"/>`;
    const stripe = type === 'van' ? `<rect x="${P.x0}" y="${P.yD + 18}" width="${P.x1 - P.x0}" height="5" fill="${mix('#2a6fdb', '#7a746a', ai * 0.12)}" opacity=".85"/>` : ev ? `<path d="M ${P.cr0 + 14} ${P.yD + 20} L ${P.cf0 + 20} ${P.yB + 18}" stroke="#7bffe6" stroke-opacity=".5" stroke-width="2"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="${W}" role="img" aria-label="Illustration ${series}, Altersscheibe ${AGES[ai]}"><defs>
<linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9edf2"/><stop offset=".7" stop-color="#cfd5dc"/><stop offset="1" stop-color="#aab1ba"/></linearGradient>
<linearGradient id="${id}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset=".35" stop-color="${paint}"/><stop offset="1" stop-color="${lo}"/></linearGradient>
<linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bcd3e3"/><stop offset=".5" stop-color="#5d7488"/><stop offset="1" stop-color="#26323d"/></linearGradient>
<linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity="${[0.55, 0.45, 0.32, 0.2, 0.1][ai]}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="${id}t" cx=".5" cy=".5" r=".5"><stop offset=".72" stop-color="${mix('#2b2d31', '#6a6a66', ai * 0.12)}"/><stop offset="1" stop-color="#101113"/></radialGradient>
<radialGradient id="${id}r" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#f1f3f5"/><stop offset="1" stop-color="${mix('#8b929a', '#4a4036', ai * 0.15)}"/></radialGradient>
<radialGradient id="${id}h" cx=".3" cy=".3" r=".9"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#9fb0bf"/></radialGradient>
<radialGradient id="${id}d" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".6" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}m" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient>
<mask id="${id}mk"><rect width="400" height="200" fill="url(#${id}m)"/></mask>
<filter id="${id}n" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed="${3 + ai}"/><feColorMatrix type="matrix" values="0 0 0 0 .36  0 0 0 0 .29  0 0 0 0 .2  0 0 0 1.5 -.5"/></filter>
<filter id="${id}u" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".045 .09" numOctaves="2" seed="${11 + ai}"/><feColorMatrix type="matrix" values="0 0 0 0 .58  0 0 0 0 .27  0 0 0 0 .08  0 0 0 5 -2.6"/></filter>
<filter id="${id}b"><feGaussianBlur stdDeviation="4"/></filter><filter id="${id}c"><feColorMatrix type="saturate" values="${sat}"/></filter>
<clipPath id="${id}k"><path d="${lowerD}"/><path d="${cabD}"/></clipPath></defs>
<rect width="400" height="200" fill="url(#${id}bg)"/><rect y="${ground - 2}" width="400" height="${200 - ground + 2}" fill="#9aa1aa" opacity=".55"/>
<ellipse cx="${(P.x0 + P.x1) / 2}" cy="${ground + 3}" rx="${(P.x1 - P.x0) / 2 + 10}" ry="9" fill="#000" opacity=".42" filter="url(#${id}b)"/>
<g filter="url(#${id}c)"><path d="${lowerD}" fill="url(#${id}p)"/><path d="${cabD}" fill="url(#${id}p)"/>${stripe}
<path d="${glass}" fill="url(#${id}g)" opacity="${ai === 4 ? 0.88 : 1}"/><line x1="${mid}" y1="${P.yR + 6}" x2="${mid}" y2="${P.yD - 4}" stroke="${lo}" stroke-width="3"/>
<path d="${glass}" fill="url(#${id}s)" opacity=".5"/>
<path d="M ${P.cf0 - 16} ${P.yB - 2} L ${P.cf0 - 16} 146 M ${mid} ${P.yD - 4} L ${mid} 146 M ${P.cr0 + 10} ${P.yD} L ${P.cr0 + 6} 146" stroke="${lo}" stroke-opacity=".5" stroke-width="1" fill="none"/>
<rect x="${P.cf0 - 34}" y="${P.yD + 8}" width="14" height="3" rx="1.5" fill="#d8dce0" opacity=".85"/><rect x="${mid - 34}" y="${P.yD + 8}" width="14" height="3" rx="1.5" fill="#d8dce0" opacity=".85"/>
<path d="M ${P.x0 + 6} ${P.yD + 12} Q ${(P.x0 + P.x1) / 2} ${P.yD + 2} ${P.x1 - 30} ${P.yB + 8}" stroke="#fff" stroke-opacity="${[0.6, 0.45, 0.3, 0.18, 0.08][ai]}" stroke-width="3" fill="none" stroke-linecap="round"/>
<g clip-path="url(#${id}k)"><rect x="0" y="0" width="400" height="200" filter="url(#${id}n)" opacity="${dirt}"/><g mask="url(#${id}mk)"><rect x="0" y="0" width="400" height="200" filter="url(#${id}u)" opacity="${rust}"/></g>
<rect x="0" y="125" width="400" height="30" fill="#6b5a44" opacity="${dirt * 0.55}" mask="url(#${id}mk)"/>${scr}${dents}${rustSpots}</g>
<ellipse cx="${P.wr}" cy="${wy}" rx="${r + 7}" ry="${r + 6}" fill="#0d0e10"/><ellipse cx="${P.wf}" cy="${wy}" rx="${r + 7}" ry="${r + 6}" fill="#0d0e10"/>
${lamp}${tail}<path d="M ${P.cf0 + 2} ${P.yB - 6} l 14 -2 l 2 6 l -14 2 z" fill="${lo}"/></g>
${wheel(P.wr)}${wheel(P.wf)}
<rect x="${P.x0 + 2}" y="148" width="${P.x1 - P.x0 - 4}" height="3" fill="#000" opacity=".25"/></svg>`;
  }
  window.__carSvg = (series, ai, w) => { const d = el('div'); d.innerHTML = carMarkup(series, ai, w || 300); return d.firstChild; };
  // ======================= Popover =======================
  const pop = (() => { const d = el('div', 'gpop cpic'); d.id = 'carpop'; d.hidden = true; $('app').append(d); return d; })();
  let cur = null;
  const place = (ev) => window.__place(pop, ev);
  const P_ = () => dash.params();
  function build(series, age) {
    const ws = rowsOf('ws_segments') || [], months = [...new Set(ws.map((r) => r.month))].sort(), m = (H.M() && months.includes(H.M())) ? H.M() : months[months.length - 1];
    const sers = [...new Set(ws.map((r) => r.series))], ai = Math.max(0, AGES.indexOf(age));
    const rows = ws.filter((r) => r.month === m && (!series || r.series === series) && (!age || r.age === age));
    const c = el('div'), head = el('div', 'bt'); head.append((series || 'Alle Baureihen') + ' · ' + (age || 'alle Altersscheiben') + ' ');
    const neu = el('span', 'neu', 'NEU'); head.append(neu); c.append(head);
    c.append(el('div', 'bs', 'Baureihe · Altersscheibe · ' + H.mlabel(m)));
    const pic = el('div', 'cpimg'); pic.append(window.__carSvg(series || 'Kompakt K1', ai, 316)); c.append(pic);
    const strip = el('div', 'cpstrip');
    if (series) AGES.forEach((a, i) => { const t = el('div', 'cpth' + (i === ai ? ' on' : '')); t.append(window.__carSvg(series, i, 54), el('span', null, a)); strip.append(t); });
    else ['Kleinwagen A0', 'Kompakt K1', 'SUV S3', 'Transporter T5', 'Elektro E6'].forEach((s) => { const t = el('div', 'cpth'); t.append(window.__carSvg(s, ai, 54), el('span', null, s.split(' ')[1])); strip.append(t); });
    c.append(strip);
    if (rows.length) {
      const veh = rows.reduce((s, r) => s + r.vehicles_k, 0), ret = rows.reduce((s, r) => s + r.retention_pct * r.vehicles_k, 0) / veh, ord = rows.reduce((s, r) => s + r.orders, 0), lohn = rows.reduce((s, r) => s + r.lohn_k, 0), teile = rows.reduce((s, r) => s + r.teile_k, 0);
      const tiles = el('div', 'tiles'), tile = (l, v, bad) => { const t = el('div', 'tile'); t.append(el('div', 'tl', l), el('div', 'tv' + (bad ? ' bad' : ''), v)); tiles.append(t); };
      tile('Fahrzeuge', N1.format(veh) + ' Tsd.'); tile('Retention', N1.format(ret) + ' %', ret < 70); tile('Aufträge', N0.format(ord));
      tile('Lohn', FMT.eur_k(lohn)); tile('Teile', FMT.eur_k(teile)); tile('Umsatz je Fz.', N0.format((lohn + teile) / veh) + ' €');
      c.append(tiles);
      const rec = el('div', 'rec'); rec.append(el('b', null, 'Hinweis: '));
      rec.append(ai >= 3 ? 'Ältere Altersscheibe: Verschleiß- und Instandsetzungsteile sowie Preisaktionen für Freie-Werkstatt-Kunden prüfen.' : ai === 0 ? 'Junge Altersscheibe: Bindung ab dem ersten Service sichern (Servicepakete, Erinnerungen).' : 'Mittlere Altersscheibe: Wartungsintervalle und Verschleißteile aktiv ansprechen.');
      c.append(rec);
    }
    c.append(el('div', 'pcap', 'Gerenderte Illustration (kein Foto) – Baureihe und Altersscheibe bestimmen Lack, Schmutz, Kratzer, Rost und Reifen.'));
    return c;
  }
  function show(ev, ctx) {
    H.hideTip();
    const p = P_(), cage = ctx.age && ctx.age !== 'Alle' ? ctx.age : null, series = ctx.series || (cage ? (p.series || null) : null), age = cage || (p.age && p.age !== 'Alle' ? p.age : null);
    const key = (series || '') + '|' + (age || '') + '|' + H.M();
    if (cur !== key || pop.hidden) { pop.replaceChildren(build(series, age)); cur = key; }
    pop.hidden = false; place(ev);
  }
  function hide() { pop.hidden = true; cur = null; }
  window.__carPop = { show, hide };
  const SERIES = new Set(Object.keys(SER)), AGESET = new Set(AGES);
  const nameOf = (t) => {
    if (!t || !t.closest) return null;
    const a = t.closest('[data-bs]'), b = t.closest('[data-ba]');
    if (a || b) { const ag = b ? b.dataset.ba : null; return { series: a ? a.dataset.bs : null, age: ag && ag !== 'Alle' ? ag : null }; }
    const tag = t.tagName; if (tag === 'TD' || tag === 'TH' || tag === 'text' || tag === 'tspan') { const s = (t.textContent || '').trim().replace(/ P$/, ''); if (SERIES.has(s)) return { series: s, age: null }; if (AGESET.has(s)) return { series: null, age: s }; }
    return null;
  };
  H.root.addEventListener('mouseover', (ev) => { const n = nameOf(ev.target); if (n) show(ev, n); });
  H.root.addEventListener('mousemove', (ev) => { if (!pop.hidden) { const n = nameOf(ev.target); if (n) place(ev); else hide(); } });
  H.root.addEventListener('mouseout', (ev) => { if (!pop.hidden && !nameOf(ev.relatedTarget || document.body)) hide(); });
})();
