(function () {
  const H = window.__hod; if (!H) return;
  const $ = (id) => document.getElementById(id);
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const N0 = NF(0), N1 = NF(1);
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const rng = (seed) => { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  // ---------------------------------------------------------------- Farben
  const C = { grass: '#6fae52', grass2: '#67a64b', asphalt: '#4d535c', lot: '#5b616b', line: '#e4e7ec', walk: '#bcc2cc', slab: '#d5dae2', floorW: '#a9b0bc', floorW2: '#9fa6b3', floorE: '#ecdcc0', floorS: '#e7ebf1', wall: '#f3f4f6', blue: '#1f5fbf', glass: '#a3d6f0', door: '#e07b39', wood: '#a9743f', yellow: '#f2c230', post: '#5b6270', red: '#d64545', dark: '#2b2f36', sofa: '#3b6fd0', green: '#2f8f4e', pot: '#8a5a3c', white: '#fdfdfd', trunk: '#7a5230', skin: '#f0c39b', hair: '#4a3426', steel: '#9aa3b0' };
  const CARC = ['#d64545', '#2a6fdb', '#f2f2f2', '#2b9a66', '#e07b39', '#8b5cf6', '#c9a227', '#3a3f48'];
  // ---------------------------------------------------------------- statisches Modell (Voxel)
  const CX = 22, CY = 15, Z0 = 2;
  let MODEL = null;
  function carBoxes(head, col, extra) { // lokale Boxen um den Mittelpunkt (Länge 4,2 · Breite 2)
    const L = 4.2, Wd = 2, b = [[0, 0, 0.3, L, Wd, 0.8, col], [1, 0.12, 1.1, 2.2, 1.76, 0.7, C.glass], [1, 0.12, 1.8, 2.2, 1.76, 0.14, col], [0.5, -0.08, 0, 0.8, 0.3, 0.6, C.dark], [2.9, -0.08, 0, 0.8, 0.3, 0.6, C.dark], [0.5, 1.78, 0, 0.8, 0.3, 0.6, C.dark], [2.9, 1.78, 0, 0.8, 0.3, 0.6, C.dark], [L - 0.12, 0.2, 0.7, 0.14, 0.4, 0.22, C.yellow], [L - 0.12, 1.4, 0.7, 0.14, 0.4, 0.22, C.yellow]];
    return b.map(([x, y, z, w, d, h, c]) => (head === 'x' ? [x - L / 2, y - Wd / 2, z, w, d, h, c] : [y - Wd / 2, x - L / 2, z, d, w, h, c]));
  }
  function buildModel() {
    const M = new Map(), extra = [], cars = [], trees = [], tiles = [];
    const put = (x, y, z, c, ph, tag) => M.set(x + ',' + y + ',' + z, { x, y, z, w: 1, d: 1, h: 1, c, ph, tag });
    const fill = (x0, y0, z0, x1, y1, z1, c, ph, tag) => { for (let x = x0; x < x1; x++) for (let y = y0; y < y1; y++) for (let z = z0; z < z1; z++) put(x, y, z, c, ph, tag); };
    const del = (x0, y0, z0, x1, y1, z1) => { for (let x = x0; x < x1; x++) for (let y = y0; y < y1; y++) for (let z = z0; z < z1; z++) M.delete(x + ',' + y + ',' + z); };
    const box = (x, y, z, w, d, h, c, ph) => extra.push({ x, y, z, w, d, h, c, ph });
    const car = (cx, cy, z, head, col, ph) => { cars.push({ x: cx, y: cy, z, head, col, ph }); carBoxes(head, col).forEach(([x, y, zz, w, d, h, c]) => box(cx + x, cy + y, z + zz, w, d, h, c, ph)); };
    // Phase 0: Grundstück
    const isG = (x, y) => !(y >= 27 || (y >= 20 && y < 22 && x >= 4 && x < 40) || (x >= 7 && x < 38 && y >= 22 && y < 27) || (x >= 5 && x < 39 && y >= 3 && y < 20));
    for (let x = 0; x < 44; x += 2) for (let y = 0; y < 30; y += 2) { if (isG(x, y) && isG(x + 1, y) && isG(x, y + 1) && isG(x + 1, y + 1)) { const gc = ((x + y) / 2) % 2 ? C.grass : C.grass2; box(x, y, 0, 2, 2, 1, gc, 0); tiles.push({ x, y, c: gc }); } else for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) if (isG(x + a, y + b)) put(x + a, y + b, 0, (x + a + y + b) % 2 ? C.grass : C.grass2, 0); }
    for (let x = 0; x < 44; x++) for (let y = 27; y < 30; y++) put(x, y, 0, y === 28 && x % 6 < 3 ? C.line : C.asphalt, 0);
    for (let x = -6; x < 0; x++) for (let y = 27; y < 30; y++) put(x, y, 0, y === 28 && (x + 12) % 6 < 3 ? C.line : C.asphalt, 0);
    for (let x = 44; x < 50; x++) for (let y = 27; y < 30; y++) put(x, y, 0, y === 28 && x % 6 < 3 ? C.line : C.asphalt, 0);
    for (let x = 4; x < 40; x++) for (let y = 20; y < 22; y++) put(x, y, 0, C.walk, 0);
    for (let x = 7; x < 38; x++) for (let y = 22; y < 27; y++) put(x, y, 0, (x - 7) % 4 === 0 && y < 26 ? C.line : C.lot, 0);
    // Phase 1: Gebäude (Bodenplatte und Wände)
    for (let x = 5; x < 39; x++) for (let y = 3; y < 20; y++) put(x, y, 1, x < 19 ? ((x + y) % 2 ? C.floorW : C.floorW2) : x < 27 ? C.floorE : C.floorS, 1);
    for (let x = 5; x < 39; x++) { for (let z = 2; z < 4; z++) put(x, 3, z, z === 3 ? C.blue : C.wall, 1); }
    for (let y = 3; y < 20; y++) for (let z = 2; z < 4; z++) { put(5, y, z, z === 3 ? C.blue : C.wall, 1); put(38, y, z, z === 3 ? C.blue : C.wall, 1); }
    for (let y = 4; y < 19; y++) for (let z = 2; z < 5; z++) { put(19, y, z, z === 4 ? C.blue : C.wall, 1); put(27, y, z, z === 4 ? C.blue : C.wall, 1); }
    del(19, 9, 2, 20, 13, 4); del(27, 9, 2, 28, 13, 4);
    for (let x = 5; x < 39; x++) for (let z = 2; z < 4; z++) put(x, 19, z, x < 19 ? (z === 3 ? C.blue : C.wall) : C.glass, 1);
    del(7, 19, 2, 11, 19 + 1, 4); del(12, 19, 2, 16, 19 + 1, 4); del(22, 19, 2, 24, 20, 4); del(31, 19, 2, 35, 20, 4);
    [6, 11, 16].forEach((x) => { put(x, 19, 2, C.door, 1); put(x, 19, 3, C.door, 1); });
    fill(19, 19, 2, 20, 20, 4, C.wall, 1); fill(27, 19, 2, 28, 20, 4, C.wall, 1);
    // Phase 2: Werkstatt
    [7, 11, 15].forEach((lx) => [6, 12].forEach((ly) => { fill(lx, ly, 2, lx + 3, ly + 4, 3, C.yellow, 2); }));
    [6, 10, 14, 18].forEach((px) => [6, 9, 12, 15].forEach((py) => { fill(px, py, 3, px + 1, py + 1, 5, C.post, 2); }));
    fill(6, 4, 2, 18, 5, 4, C.wood, 2); [7, 11, 15].forEach((x) => fill(x, 4, 4, x + 2, 5, 5, C.red, 2)); fill(6, 16, 2, 8, 18, 4, C.dark, 2); fill(16, 16, 2, 18, 18, 3, C.steel, 2);
    // Phase 3: Empfang
    fill(21, 9, 2, 25, 10, 4, C.wood, 3); fill(24, 9, 2, 25, 13, 4, C.wood, 3); put(22, 9, 4, C.dark, 3); put(23, 9, 4, C.glass, 3); put(24, 11, 4, C.dark, 3);
    fill(20, 15, 2, 22, 18, 3, C.sofa, 3); fill(20, 15, 3, 21, 18, 4, C.sofa, 3); fill(23, 16, 2, 25, 17, 3, C.wood, 3);
    put(25, 17, 2, C.pot, 3); fill(25, 17, 3, 26, 18, 5, C.green, 3); put(21, 4, 2, C.pot, 3); fill(21, 4, 3, 22, 5, 5, C.green, 3);
    fill(20, 3, 4, 27, 4, 5, C.door, 3);
    fill(20, 19, 2, 21, 22, 6, C.steel, 3); fill(25, 19, 2, 26, 22, 6, C.steel, 3); fill(20, 19, 6, 27, 22, 7, C.red, 3);
    // Phase 4: Verkauf / Showroom
    fill(29, 5, 2, 34, 9, 3, C.white, 4); fill(29, 12, 2, 34, 16, 3, C.white, 4);
    fill(35, 5, 2, 37, 7, 4, C.wood, 4); put(35, 5, 4, C.dark, 4); fill(35, 14, 2, 37, 16, 4, C.wood, 4); put(36, 14, 4, C.dark, 4);
    put(28, 17, 2, C.pot, 4); fill(28, 17, 3, 29, 18, 5, C.green, 4); put(37, 17, 2, C.pot, 4); fill(37, 17, 3, 38, 18, 5, C.green, 4);
    fill(29, 3, 4, 38, 4, 6, C.blue, 4); fill(30, 3, 4, 37, 4, 5, C.white, 4);
    car(31.5, 7, 3, 'x', C.red, 4); car(31.5, 14, 3, 'x', C.blue, 4);
    // Phase 5: Außenanlage
    fill(3, 21, 1, 4, 22, 9, C.post, 5); fill(1, 21, 8, 6, 22, 11, C.blue, 5); fill(2, 21, 9, 5, 22, 10, C.white, 5);
    [[1, 6], [1, 13], [41, 6], [41, 14], [3, 24], [40, 24], [1, 19]].forEach(([x, y]) => { trees.push({ x, y }); fill(x, y, 1, x + 1, y + 1, 3, C.trunk, 5, 'tree'); fill(x - 1, y - 1, 3, x + 2, y + 2, 5, C.green, 5, 'tree'); put(x, y, 5, C.green, 5, 'tree'); });
    [[7, 21], [38, 21]].forEach(([x, y]) => { fill(x, y, 1, x + 1, y + 1, 5, C.post, 5); put(x, y, 5, C.yellow, 5); });
    car(9.5, 24.2, 1, 'y', CARC[0], 5); car(17.5, 24.2, 1, 'y', CARC[2], 5); car(29.5, 24.2, 1, 'y', CARC[3], 5);
    // Voxel ohne freie Fläche entfernen
    const allV = [...M.values()], full = [], has = (x, y, z) => M.has(x + ',' + y + ',' + z);
    M.forEach((v) => { if (!(has(v.x + 1, v.y, v.z) && has(v.x - 1, v.y, v.z) && has(v.x, v.y + 1, v.z) && has(v.x, v.y - 1, v.z) && has(v.x, v.y, v.z + 1) && has(v.x, v.y, v.z - 1))) full.push(v); });
    extra.forEach((e) => full.push(e));
    full.sort((a, b) => a.ph - b.ph || (a.z + (a.h || 1) * 0) - (b.z + 0) || ((a.x + a.y) - (b.x + b.y)));
    const N = full.length, ph = full.map((v) => v.ph), pn = ['Grundstück und Straße', 'Gebäude', 'Werkstatt', 'Empfang', 'Verkauf und Showroom', 'Außenanlage'];
    const first = pn.map((_, p) => ph.indexOf(p)), last = pn.map((_, p) => ph.lastIndexOf(p));
    return { all: allV, cars, trees, tiles, items: full, N, pn, first, last, X: full.map((v) => v.x), Y: full.map((v) => v.y), Z: full.map((v) => v.z), W: full.map((v) => v.w), D: full.map((v) => v.d), Hh: full.map((v) => v.h), Col: full.map((v) => ci(v.c)) };
  }
  // ---------------------------------------------------------------- Darstellung (isometrisch, beliebiger Blickwinkel)
  const PH = (32 * Math.PI) / 180, SP = Math.sin(PH), CP = Math.cos(PH), SH = { top: 1, px: 0.8, nx: 0.6, py: 0.7, ny: 0.5 };
  const CIM = new Map(), SHT = [], FACES = [SH.top, SH.px, SH.nx, SH.py, SH.ny];
  function ci(hex) { let i = CIM.get(hex); if (i === undefined) { i = CIM.size; CIM.set(hex, i); const n = parseInt(hex.slice(1), 16); SHT[i] = FACES.map((f) => 'rgb(' + Math.round(((n >> 16) & 255) * f) + ',' + Math.round(((n >> 8) & 255) * f) + ',' + Math.round((n & 255) * f) + ')'); } return i; }
  const shadeCache = new Map();
  function shade(hex, f) { const k = hex + f; let s = shadeCache.get(k); if (!s) { const n = parseInt(hex.slice(1), 16), r = Math.round(((n >> 16) & 255) * f), g = Math.round(((n >> 8) & 255) * f), b = Math.round((n & 255) * f); s = 'rgb(' + r + ',' + g + ',' + b + ')'; shadeCache.set(k, s); } return s; }
  const ZONES = [
    { id: 'Werkstatt', rect: [6, 4, 19, 19], z: 2, anchor: [12, 9, 9.5], col: '#e07b39' },
    { id: 'Empfang', rect: [20, 4, 27, 19], z: 2, anchor: [23.5, 9, 9.5], col: '#2a6fdb' },
    { id: 'Verkauf', rect: [28, 4, 38, 19], z: 2, anchor: [33, 9, 9.5], col: '#8b5cf6' },
    { id: 'Kunden', rect: [7, 22, 38, 27], z: 1, anchor: [22, 25, 7], col: '#2b9a66' }
  ];
  function render(c, W, Hh, o) {
    // o: {yaw, zoom, n (sichtbare Bausteine, kann Bruch sein), age: Funktion, boxes: dynamische Boxen [[x,y,z,w,d,h,col],...], sel, kp, labels, phaseText}
    const M = MODEL, th = o.yaw, ct = Math.cos(th), st = Math.sin(th), S = Math.min(W / 56, Hh / 40) * o.zoom, ox = W / 2, oy = Hh * 0.6;
    const g = c.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, '#dcebf7'); g.addColorStop(1, '#f4f8fb'); c.fillStyle = g; c.fillRect(0, 0, W, Hh);
    const px = (x, y) => ox + ((x - CX) * ct - (y - CY) * st) * S, py = (x, y, z) => oy + ((x - CX) * st + (y - CY) * ct) * S * SP - (z - Z0) * S * CP;
    const key = [], idx = [], bx = [], by = [], bz = [], bw = [], bd = [], bh = [], bc = []; let n = 0;
    const add = (x, y, z, w, d, h, col) => { const cx = x + w / 2, cy = y + d / 2, ry = (cx - CX) * st + (cy - CY) * ct; bx[n] = x; by[n] = y; bz[n] = z; bw[n] = w; bd[n] = d; bh[n] = h; bc[n] = col; key[n] = ry * CP + (z + h / 2) * SP; idx.push(n); n++; };
    const K = Math.min(M.N, Math.floor(o.n)), FALL = o.fall || 0.7;
    for (let i = 0; i < K; i++) { let dz = 0; if (o.n < M.N) { const age = (o.n - i) / M.N * o.dur; if (age < FALL) { dz = (1 - easeOut(Math.max(0, age) / FALL)) * 8; } } add(M.X[i], M.Y[i], M.Z[i] + dz, M.W[i], M.D[i], M.Hh[i], M.Col[i]); }
    if (o.boxes) for (let i = 0; i < o.boxes.length; i++) { const b = o.boxes[i]; add(b[0], b[1], b[2], b[3], b[4], b[5], ci(b[6])); }
    idx.sort((a, b) => key[a] - key[b]);
    const vis = { px: st > 0.001, nx: st < -0.001, py: ct > 0.001, ny: ct < -0.001 }, lw = S > 9 ? 0.7 : 0.4;
    if (o.sel && o.sel !== 'Alle') { const z = ZONES.find((q) => q.id === o.sel); if (z) { const [x0, y0, x1, y1] = z.rect; c.fillStyle = z.col + '55'; c.beginPath(); c.moveTo(px(x0, y0), py(x0, y0, z.z)); c.lineTo(px(x1, y0), py(x1, y0, z.z)); c.lineTo(px(x1, y1), py(x1, y1, z.z)); c.lineTo(px(x0, y1), py(x0, y1, z.z)); c.closePath(); c.fill(); } }
    for (let q = 0; q < idx.length; q++) {
      const i = idx[q], x = bx[i], y = by[i], z = bz[i], w = bw[i], d = bd[i], h = bh[i], col = bc[i], hw = w / 2, hd = d / 2, cx = x + hw, cy = y + hd;
      const X0 = px(cx - hw, cy - hd), Y0 = (cx - hw - CX) * st + (cy - hd - CY) * ct, X1 = px(cx + hw, cy - hd), Y1 = (cx + hw - CX) * st + (cy - hd - CY) * ct, X2 = px(cx + hw, cy + hd), Y2 = (cx + hw - CX) * st + (cy + hd - CY) * ct, X3 = px(cx - hw, cy + hd), Y3 = (cx - hw - CX) * st + (cy + hd - CY) * ct;
      const sy = (ry, zz) => oy + ry * S * SP - (zz - Z0) * S * CP, zt = z + h, T0 = sy(Y0, zt), T1 = sy(Y1, zt), T2 = sy(Y2, zt), T3 = sy(Y3, zt), B0 = sy(Y0, z), B1 = sy(Y1, z), B2 = sy(Y2, z), B3 = sy(Y3, z);
      c.lineWidth = lw; const sh = SHT[col];
      if (vis.ny) { c.fillStyle = sh[4]; c.beginPath(); c.moveTo(X0, T0); c.lineTo(X1, T1); c.lineTo(X1, B1); c.lineTo(X0, B0); c.closePath(); c.fill(); }
      if (vis.px) { c.fillStyle = sh[1]; c.beginPath(); c.moveTo(X1, T1); c.lineTo(X2, T2); c.lineTo(X2, B2); c.lineTo(X1, B1); c.closePath(); c.fill(); }
      if (vis.py) { c.fillStyle = sh[3]; c.beginPath(); c.moveTo(X2, T2); c.lineTo(X3, T3); c.lineTo(X3, B3); c.lineTo(X2, B2); c.closePath(); c.fill(); }
      if (vis.nx) { c.fillStyle = sh[2]; c.beginPath(); c.moveTo(X3, T3); c.lineTo(X0, T0); c.lineTo(X0, B0); c.lineTo(X3, B3); c.closePath(); c.fill(); }
      c.fillStyle = sh[0]; c.strokeStyle = sh[0]; c.beginPath(); c.moveTo(X0, T0); c.lineTo(X1, T1); c.lineTo(X2, T2); c.lineTo(X3, T3); c.closePath(); c.fill(); c.stroke();
    }
    // Beschriftung am Eingang
    const lx = px(3.5, 21.5), ly = py(3.5, 21.5, 11.6);
    c.font = 'bold ' + Math.max(11, Math.round(S * 0.9)) + 'px Helvetica, Arial, sans-serif'; c.textAlign = 'center'; c.fillStyle = '#1f2430'; c.fillText('AUTOHAUS', lx, ly);
    // Kennzahlen-Marker
    if (o.labels && o.kp) {
      const pills = ZONES.map((z) => { const k = o.kp[z.id]; return { z, k, x: px(z.anchor[0], z.anchor[1]), y: py(z.anchor[0], z.anchor[1], z.anchor[2]) }; }); pills.sort((a, b) => a.y - b.y);
      c.font = 'bold 12px Helvetica, Arial, sans-serif'; const pad = 8;
      pills.forEach((p, i) => { p.ty = p.y - 28; for (let j = 0; j < i; j++) { const q = pills[j]; if (Math.abs(p.x - q.x) < 190 && Math.abs(p.ty - q.ty) < 40) p.ty = q.ty + 42; } });
      pills.forEach((p) => {
        const t1 = p.z.id + ' · ' + p.k.main, t2 = p.k.mainLabel, w1 = c.measureText(t1).width; c.font = '11px Helvetica, Arial, sans-serif'; const w2 = c.measureText(t2).width; c.font = 'bold 12px Helvetica, Arial, sans-serif'; const bw2 = Math.max(w1, w2) + pad * 2 + 12, bx0 = clamp(p.x - bw2 / 2, 4, W - bw2 - 4), by0 = clamp(p.ty - 14, 40, Hh - 44), sel = o.sel === p.z.id;
        c.strokeStyle = '#1f2430'; c.lineWidth = 1; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(clamp(p.x, bx0 + 6, bx0 + bw2 - 6), by0 + 34); c.stroke(); c.fillStyle = '#1f2430'; c.beginPath(); c.arc(p.x, p.y, 3, 0, 7); c.fill();
        c.fillStyle = sel ? '#fff7e0' : 'rgba(255,255,255,0.94)'; c.strokeStyle = sel ? p.z.col : '#c3c9d3'; c.lineWidth = sel ? 2 : 1; c.beginPath(); c.roundRect ? c.roundRect(bx0, by0, bw2, 34, 7) : c.rect(bx0, by0, bw2, 34); c.fill(); c.stroke();
        c.fillStyle = { good: '#2b9a66', warn: '#e0a030', bad: '#d64545', none: '#8a919e' }[p.k.status]; c.beginPath(); c.arc(bx0 + 11, by0 + 12, 5, 0, 7); c.fill();
        c.fillStyle = '#1f2430'; c.textAlign = 'left'; c.font = 'bold 12px Helvetica, Arial, sans-serif'; c.fillText(t1, bx0 + 22, by0 + 16); c.fillStyle = '#5a6270'; c.font = '11px Helvetica, Arial, sans-serif'; c.fillText(t2, bx0 + 22, by0 + 29); p.box = [bx0, by0, bw2, 34];
      });
      o.hit = pills.map((p) => ({ id: p.z.id, box: p.box }));
    }
    if (o.phaseText) { c.fillStyle = 'rgba(31,36,48,0.8)'; c.font = '12px Helvetica, Arial, sans-serif'; c.textAlign = 'left'; c.fillText(o.phaseText, 10, Hh - 12); }
  }
  // ---------------------------------------------------------------- Kennzahlen
  function status(v, tg, inv) { if (v == null || tg == null) return 'none'; const r = inv ? tg / v : v / tg; return r >= 1 ? 'good' : r >= 0.95 ? 'warn' : 'bad'; }
  const IDS = ['ws_cap', 'ws_hours', 'ws_segments', 'lead_funnel', 'sc_monthly', 'vp_parc', 'hv_training', 'cu_monthly', 'vp_group', 'vp_ext'];
  function kpis() {
    const X = window.__nx; if (!X) return null; const rg = H.REGSEL(), miss = IDS.filter((id) => !rowsOf(id)); if (miss.length) { miss.forEach((id) => H.ready(document.createElement('div'), id)); return null; }
    let cap, hr, ld, sc, hv; try { cap = X.capCalc(rg); hr = X.hoursCalc('series'); ld = X.leadCalc(rg); sc = X.scCalc(rg); hv = X.hvCalc(rg, 20); } catch (e) { return null; } if (!cap || !hr || !ld || !sc || !sc.a) return null;
    const set = new Set(H.periodMonths()), pset = new Set(H.prevPeriodMonths(H.periodMonths())), cu = rowsOf('cu_monthly').filter((r) => r.region === rg && r.dim === 'Alle' && r.member === 'Alle'), cw = (S, f) => { const p = cu.filter((r) => S.has(r.month)); const w = d3.sum(p, (r) => r.active_customers); return w ? d3.sum(p, (r) => f(r) * r.active_customers) / w : null; };
    const csi = cw(set, (r) => r.csi_score), csiP = cw(pset, (r) => r.csi_score), nps = cw(set, (r) => r.nps_score), churn = cw(set, (r) => r.churn_pct), rep = cw(set, (r) => r.repeat_pct), cust = cu.filter((r) => set.has(r.month)).slice(-1)[0];
    const W = { id: 'Werkstatt', main: N1.format(cap.util) + ' %', mainLabel: 'Auslastung (Ziel 85 %)', status: status(cap.util, 85), lines: [['Auslastung', N1.format(cap.util) + ' %', 'Ziel 85 %'], ['Arbeitsplätze', N0.format(cap.bays), ''], ['Realisierter Satz', N1.format(hr.avg.rate) + ' €/h', 'Liste ' + N1.format(hr.avg.list) + ' €/h'], ['Leistungsgrad', N1.format(hr.avg.eff) + ' %', 'verkaufte ÷ gestempelte Std.'], ['HV-Anteil Techniker', hv ? N1.format(hv.share) + ' %' : '–', 'Ziel 35 %']] };
    const E = { id: 'Empfang', main: N1.format(ld.l2a) + ' %', mainLabel: 'Lead → Termin (Ziel 40 %)', status: status(ld.l2a, 40), lines: [['Lead → Termin', N1.format(ld.l2a) + ' %', 'Ziel 40 %'], ['Antwortzeit', N1.format(ld.resp) + ' h', 'Ziel ≤ 4 h'], ['Antwort binnen 1 h', N1.format(ld.h1) + ' %', ''], ['Leads', N0.format(ld.L), 'im Zeitraum'], ['Aufträge', N0.format(ld.O), 'aus Leads']] };
    const V = { id: 'Verkauf', main: N1.format(sc.a.ren) + ' %', mainLabel: 'Vertragsverlängerung (Ziel 85 %)', status: status(sc.a.ren, 85), lines: [['Verlängerungsquote', N1.format(sc.a.ren) + ' %', 'Ziel 85 %'], ['Serviceverträge', N0.format(sc.a.con), 'Bestand Ende'], ['Vertragsquote', N1.format(sc.a.pen) + ' %', 'am betreuten Bestand'], ['Kündigungen p. a.', N1.format(sc.a.canc) + ' %', ''], ['Retention mit Vertrag', N1.format(sc.a.rc) + ' %', 'ohne Vertrag ' + N1.format(sc.a.rn) + ' %']] };
    const K = { id: 'Kunden', main: csi == null ? '–' : N1.format(csi), mainLabel: 'Kundenzufriedenheit (CSI)', status: csi == null ? 'none' : csiP == null ? 'none' : csi >= csiP ? 'good' : 'warn', lines: [['CSI', csi == null ? '–' : N1.format(csi), csiP == null ? '' : 'Vorperiode ' + N1.format(csiP)], ['NPS', nps == null ? '–' : N1.format(nps), ''], ['Abwanderung', churn == null ? '–' : N1.format(churn) + ' %', ''], ['Wiederkauf', rep == null ? '–' : N1.format(rep) + ' %', ''], ['Aktive Kunden', cust ? N0.format(cust.active_customers) : '–', 'letzter Monat']] };
    const scene = { occ: clamp(Math.round(cap.util / 100 * 6), 1, 6), cust: clamp(Math.round(ld.l2a / 10) + 2, 3, 9), wait: clamp(Math.round(ld.resp / 2), 0, 5), mech: clamp(Math.round(cap.util / 100 * 6), 2, 6) };
    return { Werkstatt: W, Empfang: E, Verkauf: V, Kunden: K, scene, rg };
  }
  // ================================================================ 3D-Darstellung mit WebGL2 (Fallback: 2D-Isometrie)
  // ---------------------------------------------------------------- Matrizen
  const m4 = {
    mul(a, b) { const o = new Float32Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; },
    persp(fov, asp, n, f) { const t = 1 / Math.tan(fov / 2), o = new Float32Array(16); o[0] = t / asp; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = 2 * f * n / (n - f); return o; },
    ortho(l, r, b, t, n, f) { const o = new Float32Array(16); o[0] = 2 / (r - l); o[5] = 2 / (t - b); o[10] = -2 / (f - n); o[12] = -(r + l) / (r - l); o[13] = -(t + b) / (t - b); o[14] = -(f + n) / (f - n); o[15] = 1; return o; },
    look(e, c, up) { let zx = e[0] - c[0], zy = e[1] - c[1], zz = e[2] - c[2], zl = Math.hypot(zx, zy, zz); zx /= zl; zy /= zl; zz /= zl; let xx = up[1] * zz - up[2] * zy, xy = up[2] * zx - up[0] * zz, xz = up[0] * zy - up[1] * zx, xl = Math.hypot(xx, xy, xz); xx /= xl; xy /= xl; xz /= xl; const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx, o = new Float32Array(16); o[0] = xx; o[1] = yx; o[2] = zx; o[4] = xy; o[5] = yy; o[6] = zy; o[8] = xz; o[9] = yz; o[10] = zz; o[12] = -(xx * e[0] + xy * e[1] + xz * e[2]); o[13] = -(yx * e[0] + yy * e[1] + yz * e[2]); o[14] = -(zx * e[0] + zy * e[1] + zz * e[2]); o[15] = 1; return o; },
    inv(m) { return invGeneral(Array.from(m)); }
  };
  function invGeneral(m) { // Gauß-Jordan
    const n = 4, A = []; for (let r = 0; r < n; r++) { A[r] = []; for (let c = 0; c < n; c++) A[r][c] = m[c * 4 + r]; for (let c = 0; c < n; c++) A[r][n + c] = r === c ? 1 : 0; }
    for (let i = 0; i < n; i++) { let p = i; for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r; const t = A[i]; A[i] = A[p]; A[p] = t; const d = A[i][i] || 1e-12; for (let c = 0; c < 2 * n; c++) A[i][c] /= d; for (let r = 0; r < n; r++) if (r !== i) { const f = A[r][i]; for (let c = 0; c < 2 * n; c++) A[r][c] -= f * A[i][c]; } }
    const out = new Float32Array(16); for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) out[c * 4 + r] = A[r][n + c]; return out;
  }
  const xf = (m, x, y, z) => { const w = m[3] * x + m[7] * y + m[11] * z + m[15]; return [(m[0] * x + m[4] * y + m[8] * z + m[12]) / w, (m[1] * x + m[5] * y + m[9] * z + m[13]) / w, (m[2] * x + m[6] * y + m[10] * z + m[14]) / w, w]; };
  // ---------------------------------------------------------------- Farben
  const HEXS = [], HEXI = new Map();
  const hexRgb = (h) => { const n = parseInt(h.slice(1), 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
  const hx = (h) => { let i = HEXI.get(h); if (i === undefined) { i = HEXS.length; HEXS.push(hexRgb(h)); HEXI.set(h, i); } return i; };
  const hash3 = (x, y, z) => { let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
  // ---------------------------------------------------------------- Feines Baustein-Modell aus dem Voxel-Modell
  const GXO = 6, GXW = 56, GYW = 30, GZW = 14;
  function carTemplate(col) { // lokale Boxen [x, y, z, hx, hy, hz, Farbe]; Vorne = +x, Mittelpunkt auf dem Boden
    return [[0, 0, 0.55, 2.1, 0.95, 0.24, col], [1.25, 0, 0.92, 0.82, 0.9, 0.08, col], [-1.55, 0, 0.92, 0.5, 0.9, 0.08, col], [-0.1, 0, 1.0, 1.02, 0.86, 0.07, col],
      [-0.05, 0, 1.32, 0.85, 0.78, 0.25, C.glass], [-0.05, 0, 1.6, 0.9, 0.82, 0.04, col], [0.85, 0, 1.3, 0.05, 0.8, 0.24, C.glass], [-0.95, 0, 1.3, 0.05, 0.8, 0.22, C.glass],
      [0.82, 0.8, 1.3, 0.07, 0.03, 0.26, col], [0.82, -0.8, 1.3, 0.07, 0.03, 0.26, col], [-0.9, 0.8, 1.3, 0.07, 0.03, 0.24, col], [-0.9, -0.8, 1.3, 0.07, 0.03, 0.24, col],
      [1.3, 0.97, 0.34, 0.38, 0.1, 0.32, C.dark], [1.3, -0.97, 0.34, 0.38, 0.1, 0.32, C.dark], [-1.3, 0.97, 0.34, 0.38, 0.1, 0.32, C.dark], [-1.3, -0.97, 0.34, 0.38, 0.1, 0.32, C.dark],
      [1.3, 1.02, 0.34, 0.16, 0.03, 0.16, '#c9ced6'], [1.3, -1.02, 0.34, 0.16, 0.03, 0.16, '#c9ced6'], [-1.3, 1.02, 0.34, 0.16, 0.03, 0.16, '#c9ced6'], [-1.3, -1.02, 0.34, 0.16, 0.03, 0.16, '#c9ced6'],
      [2.1, 0.62, 0.7, 0.04, 0.2, 0.1, '#fff2a8'], [2.1, -0.62, 0.7, 0.04, 0.2, 0.1, '#fff2a8'], [-2.1, 0.64, 0.72, 0.04, 0.2, 0.08, '#8a1f1f'], [-2.1, -0.64, 0.72, 0.04, 0.2, 0.08, '#8a1f1f'],
      [2.12, 0, 0.42, 0.05, 0.9, 0.09, C.dark], [-2.12, 0, 0.42, 0.05, 0.9, 0.09, C.dark], [-2.12, 0, 0.62, 0.02, 0.22, 0.07, '#f5f5f5'], [2.14, 0, 0.62, 0.02, 0.28, 0.06, '#c9ced6']];
  }
  const CARTPL = {};
  const carTpl = (col) => CARTPL[col] || (CARTPL[col] = carTemplate(col));
  function buildFine(M, f) {
    const GX = GXW * f, GY = GYW * f, GZ = GZW * f, N3 = GX * GY * GZ, col = new Uint16Array(N3), phs = new Uint8Array(N3), id = (x, y, z) => x + GX * (y + GY * z);
    M.tiles.forEach((tl) => { const ci = hx(tl.c) + 1; for (let a = 0; a < 2 * f; a++) for (let b = 0; b < 2 * f; b++) for (let c = 0; c < f; c++) { const i = id((tl.x + GXO) * f + a, tl.y * f + b, c); col[i] = ci; phs[i] = 0; } });
    M.all.forEach((v) => { if (v.tag === 'tree') return; const ci = hx(v.c) + 1; for (let a = 0; a < f; a++) for (let b = 0; b < f; b++) for (let c = 0; c < f; c++) { const i = id((v.x + GXO) * f + a, v.y * f + b, v.z * f + c); col[i] = ci; phs[i] = v.ph; } });
    const greens = ['#2f8f4e', '#3aa35c', '#27793f', '#4db36a'].map(hx), trunk = hx('#7a5230');
    M.trees.forEach((t) => {
      const cx = t.x + 0.5, cy = t.y + 0.5, set = (ux, uy, uz, ci) => { const ix = Math.floor((ux + GXO) * f), iy = Math.floor(uy * f), iz = Math.floor(uz * f); if (ix < 0 || iy < 0 || iz < 0 || ix >= GX || iy >= GY || iz >= GZ) return; const i = id(ix, iy, iz); col[i] = ci + 1; phs[i] = 5; };
      for (let a = 0; a < f * 1; a++) for (let b = 0; b < f * 1; b++) for (let z = 0; z < f * 2.2; z++) { const ux = cx - 0.3 + (a + 0.5) / f * 0.6, uy = cy - 0.3 + (b + 0.5) / f * 0.6; set(ux, uy, 1 + z / f, trunk); }
      const rx = 1.75, rz = 1.55, zc = 4.1, st = 1 / f;
      for (let ux = cx - rx; ux < cx + rx; ux += st) for (let uy = cy - rx; uy < cy + rx; uy += st) for (let uz = zc - rz; uz < zc + rz; uz += st) { const dx = (ux - cx) / rx, dy = (uy - cy) / rx, dz = (uz - zc) / rz, d = dx * dx + dy * dy + dz * dz, h = hash3(Math.floor(ux * f * 7), Math.floor(uy * f * 7), Math.floor(uz * f * 7)); if (d < 0.86 + (h - 0.5) * 0.22 && !(d > 0.6 && h < 0.18)) set(ux, uy, uz, greens[Math.floor(h * 4) % 4]); }
    });
    // sichtbare Zellen und Instanzen
    const keys = [], cells = []; const occ = (x, y, z) => (z < 0 ? true : x < 0 || y < 0 || x >= GX || y >= GY || z >= GZ ? false : col[id(x, y, z)] !== 0);
    for (let z = 0; z < GZ; z++) for (let y = 0; y < GY; y++) for (let x = 0; x < GX; x++) { const i = id(x, y, z); if (!col[i]) continue; if (occ(x + 1, y, z) && occ(x - 1, y, z) && occ(x, y + 1, z) && occ(x, y - 1, z) && occ(x, y, z + 1) && occ(x, y, z - 1)) continue; cells.push(i); keys.push(phs[i] * 1e7 + z * 1e4 + x + y); }
    const ord = cells.map((_, i) => i).sort((a, b) => keys[a] - keys[b]), nCells = cells.length, cars = M.cars, parts = [];
    cars.forEach((cr) => carTpl(cr.col).forEach((b) => parts.push({ cr, b })));
    const NT = nCells + parts.length, arr = new Float32Array(NT * 12), phFirst = [], phLast = [];
    ord.forEach((oi, rank) => {
      const i = cells[oi], x = i % GX, y = Math.floor(i / GX) % GY, z = Math.floor(i / (GX * GY)), ph = phs[i], rgb = HEXS[col[i] - 1], j = 0.94 + hash3(x, y, z) * 0.12;
      let oc = 0; for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) if (occ(x + dx, y + dy, z + 1)) oc++;
      const o = rank * 12, s = 0.5 / f; arr[o] = (x + 0.5) / f - GXO; arr[o + 1] = (y + 0.5) / f; arr[o + 2] = (z + 0.5) / f; arr[o + 3] = 0; arr[o + 4] = s; arr[o + 5] = s; arr[o + 6] = s; arr[o + 7] = clamp(1 - 0.085 * oc, 0.55, 1); arr[o + 8] = rgb[0] * j; arr[o + 9] = rgb[1] * j; arr[o + 10] = rgb[2] * j; arr[o + 11] = rank;
      if (phFirst[ph] === undefined) phFirst[ph] = rank; phLast[ph] = rank;
    });
    parts.forEach((p, k) => { const cr = p.cr, yaw = cr.head === 'x' ? 0 : Math.PI / 2, c = Math.cos(yaw), s = Math.sin(yaw), [lx, ly, lz, hx2, hy2, hz2, hex] = p.b, rgb = HEXS[hx(hex)], o = (nCells + k) * 12, rk = phFirst[cr.ph] + 0.82 * (phLast[cr.ph] - phFirst[cr.ph]);
      arr[o] = cr.x + lx * c - ly * s; arr[o + 1] = cr.y + lx * s + ly * c; arr[o + 2] = cr.z + lz; arr[o + 3] = yaw; arr[o + 4] = hx2; arr[o + 5] = hy2; arr[o + 6] = hz2; arr[o + 7] = 1; arr[o + 8] = rgb[0]; arr[o + 9] = rgb[1]; arr[o + 10] = rgb[2]; arr[o + 11] = rk; });
    return { arr, count: NT, rankMax: nCells, f };
  }
  // ---------------------------------------------------------------- WebGL2-Renderer
  const VS = `#version 300 es
precision highp float;
layout(location=0) in vec3 aPos; layout(location=1) in vec3 aNor; layout(location=2) in vec4 iA; layout(location=3) in vec4 iB; layout(location=4) in vec4 iC;
uniform mat4 uVP; uniform mat4 uLVP; uniform float uN; uniform float uNt; uniform float uDur; uniform float uFall; uniform float uShPass;
out vec3 vN; out vec3 vCol; out float vAO; out vec4 vSh; out vec3 vW;
void main(){
  float rank=iC.w; float zoff=0.0;
  if(rank<-1.5 && uShPass<0.5){ gl_Position=vec4(2.0,2.0,2.0,1.0); vN=vec3(0.,0.,1.); vCol=vec3(0.); vAO=1.; vSh=vec4(0.); vW=vec3(0.); return; }
  if(rank>=0.0){ float age=(uN-rank)/uNt*uDur; if(age<0.0){ gl_Position=vec4(2.0,2.0,2.0,1.0); vN=vec3(0.,0.,1.); vCol=vec3(0.); vAO=1.; vSh=vec4(0.); vW=vec3(0.); return; } float t=clamp(age/uFall,0.0,1.0); float e=1.0-t; zoff=e*e*e*9.0; }
  float cy=cos(iA.w), sy=sin(iA.w);
  vec3 p=aPos*iB.xyz; p=vec3(cy*p.x-sy*p.y, sy*p.x+cy*p.y, p.z);
  vec3 n=vec3(cy*aNor.x-sy*aNor.y, sy*aNor.x+cy*aNor.y, aNor.z);
  vec3 w=iA.xyz+p; w.z+=zoff;
  gl_Position=uVP*vec4(w,1.0); vN=n; vCol=iC.rgb; vAO=iB.w; vSh=uLVP*vec4(w,1.0); vW=w;
}`;
  const FS = `#version 300 es
precision highp float; precision highp sampler2DShadow;
in vec3 vN; in vec3 vCol; in float vAO; in vec4 vSh; in vec3 vW;
uniform vec3 uSun; uniform vec3 uSunCol; uniform vec3 uSky; uniform vec3 uGnd; uniform vec3 uEye; uniform vec3 uFog;
uniform sampler2DShadow uShadow; uniform float uShOn; uniform float uShSize; uniform vec4 uLens;
out vec4 o;
void main(){
  if(uLens.w>0.5){ vec2 d=gl_FragCoord.xy-uLens.xy; if(dot(d,d)>uLens.z*uLens.z) discard; }
  vec3 n=normalize(vN); float ndl=max(dot(n,uSun),0.0); float sh=1.0;
  if(uShOn>0.5){ vec3 sp=vSh.xyz/vSh.w*0.5+0.5; if(sp.x>0.0&&sp.x<1.0&&sp.y>0.0&&sp.y<1.0&&sp.z<1.0){ float s=0.0; float b=0.0018; for(int i=-1;i<=1;i++){ for(int j=-1;j<=1;j++){ s+=texture(uShadow, vec3(sp.xy+vec2(float(i),float(j))/uShSize, sp.z-b)); } } sh=s/9.0; } }
  vec3 hemi=mix(uGnd,uSky,n.z*0.5+0.5);
  vec3 light=hemi*0.6*vAO+uSunCol*ndl*sh*0.92;
  vec3 col=vCol*light;
  float dist=length(vW-uEye); col=mix(col,uFog,clamp((dist-70.0)*0.006,0.0,0.45));
  o=vec4(col,1.0);
}`;
  const BGVS = `#version 300 es
precision highp float; void main(){ vec2 p=vec2(float((gl_VertexID<<1)&2), float(gl_VertexID&2)); gl_Position=vec4(p*2.0-1.0,0.0,1.0); }`;
  const BGFS = `#version 300 es
precision highp float; uniform vec4 uLens; uniform vec3 uTop; uniform vec3 uBot; out vec4 o;
void main(){ vec2 d=gl_FragCoord.xy-uLens.xy; if(dot(d,d)>uLens.z*uLens.z) discard; float t=clamp((gl_FragCoord.y-(uLens.y-uLens.z))/(2.0*uLens.z),0.0,1.0); o=vec4(mix(uBot,uTop,t),1.0); gl_FragDepth=1.0; }`;
  function makeGL(canvas, preserve) {
    let gl; try { gl = canvas.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: !!preserve }); } catch (e) { gl = null; } if (!gl) return null;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const prog = (v, f) => { const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, v)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, f)); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p; };
    try {
      const P = prog(VS, FS), BG = prog(BGVS, BGFS), U = {}, UB = {};
      ['uVP', 'uLVP', 'uN', 'uNt', 'uDur', 'uFall', 'uShPass', 'uSun', 'uSunCol', 'uSky', 'uGnd', 'uEye', 'uFog', 'uShadow', 'uShOn', 'uShSize', 'uLens'].forEach((n) => { U[n] = gl.getUniformLocation(P, n); }); ['uLens', 'uTop', 'uBot'].forEach((n) => { UB[n] = gl.getUniformLocation(BG, n); });
      // Würfel: 24 Ecken mit Normalen
      const pos = [], nor = [], idx = [], F = [[[1, 0, 0], [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]]], [[-1, 0, 0], [[-1, 1, -1], [-1, -1, -1], [-1, -1, 1], [-1, 1, 1]]], [[0, 1, 0], [[1, 1, -1], [-1, 1, -1], [-1, 1, 1], [1, 1, 1]]], [[0, -1, 0], [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]]], [[0, 0, 1], [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]], [[0, 0, -1], [[-1, 1, -1], [1, 1, -1], [1, -1, -1], [-1, -1, -1]]]];
      F.forEach(([n, vs], fi) => { vs.forEach((v) => { pos.push(...v); nor.push(...n); }); const b = fi * 4; idx.push(b, b + 1, b + 2, b, b + 2, b + 3); });
      const bufV = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bufV); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
      const bufN = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bufN); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nor), gl.STATIC_DRAW);
      const bufI = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufI); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
      const mkVao = (ib) => { const v = gl.createVertexArray(); gl.bindVertexArray(v); gl.bindBuffer(gl.ARRAY_BUFFER, bufV); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); gl.bindBuffer(gl.ARRAY_BUFFER, bufN); gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0); gl.bindBuffer(gl.ARRAY_BUFFER, ib); for (let k = 0; k < 3; k++) { gl.enableVertexAttribArray(2 + k); gl.vertexAttribPointer(2 + k, 4, gl.FLOAT, false, 48, 16 * k); gl.vertexAttribDivisor(2 + k, 1); } gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufI); gl.bindVertexArray(null); return v; };
      const sBuf = gl.createBuffer(), dBuf = gl.createBuffer(), sVao = mkVao(sBuf), dVao = mkVao(dBuf), bgVao = gl.createVertexArray();
      const SZ = 2048, shTex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, shTex); gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT24, SZ, SZ); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
      const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, shTex, 0); gl.drawBuffers([gl.NONE]); gl.readBuffer(gl.NONE); const shOk = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE; gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      let nStatic = 0, dyn = new Float32Array(12 * 6000);
      const setU = (o) => {
        gl.uniform1f(U.uN, o.n); gl.uniform1f(U.uNt, o.nt); gl.uniform1f(U.uDur, o.dur); gl.uniform1f(U.uFall, 0.75);
      };
      const drawAll = (nDyn) => { gl.bindVertexArray(sVao); if (nStatic) gl.drawElementsInstanced(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0, nStatic); if (nDyn) { gl.bindVertexArray(dVao); gl.drawElementsInstanced(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0, nDyn); } gl.bindVertexArray(null); };
      return {
        gl, shadows: shOk,
        setStatic(arr, count) { gl.bindBuffer(gl.ARRAY_BUFFER, sBuf); gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW); nStatic = count; },
        setDynamic(arr, count) { gl.bindBuffer(gl.ARRAY_BUFFER, dBuf); gl.bufferData(gl.ARRAY_BUFFER, arr.subarray(0, count * 12), gl.DYNAMIC_DRAW); return count; },
        // o: {w,h (Pixel), vp, lvp, n, nt, dur, sun, sunCol, sky, gnd, eye, fog, top, bot, shadows, nDyn, lens:{x,y,r,vp,eye,size}}
        render(o) {
          const W = o.w, Hh = o.h; gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LESS); gl.disable(gl.CULL_FACE);
          const useSh = shOk && o.shadows;
          if (useSh) { gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); gl.viewport(0, 0, SZ, SZ); gl.disable(gl.SCISSOR_TEST); gl.clear(gl.DEPTH_BUFFER_BIT); gl.colorMask(false, false, false, false); gl.useProgram(P); gl.uniformMatrix4fv(U.uVP, false, o.lvp); gl.uniformMatrix4fv(U.uLVP, false, o.lvp); setU(o); gl.uniform4f(U.uLens, 0, 0, 0, 0); gl.uniform1f(U.uShPass, 1); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, null); drawAll(o.nDyn); gl.colorMask(true, true, true, true); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
          const pass = (vp, eye, vx, vy, vw, vh, lens) => {
            gl.useProgram(P); gl.uniformMatrix4fv(U.uVP, false, vp); gl.uniformMatrix4fv(U.uLVP, false, o.lvp); setU(o); gl.uniform1f(U.uShPass, 0); gl.uniform3fv(U.uSun, o.sun); gl.uniform3fv(U.uSunCol, o.sunCol); gl.uniform3fv(U.uSky, o.sky); gl.uniform3fv(U.uGnd, o.gnd); gl.uniform3fv(U.uEye, eye); gl.uniform3fv(U.uFog, o.fog);
            gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, shTex); gl.uniform1i(U.uShadow, 0); gl.uniform1f(U.uShOn, useSh ? 1 : 0); gl.uniform1f(U.uShSize, SZ);
            gl.uniform4f(U.uLens, lens ? lens.x : 0, lens ? lens.y : 0, lens ? lens.r : 0, lens ? 1 : 0); gl.viewport(vx, vy, vw, vh); drawAll(o.nDyn);
          };
          gl.viewport(0, 0, W, Hh); gl.disable(gl.SCISSOR_TEST); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          pass(o.vp, o.eye, 0, 0, W, Hh, null);
          if (o.lens) {
            const L = o.lens, s = Math.ceil(L.r * 2), x0 = Math.round(L.x - L.r), y0 = Math.round(L.y - L.r);
            gl.enable(gl.SCISSOR_TEST); gl.scissor(x0, y0, s, s); gl.useProgram(BG); gl.uniform4f(UB.uLens, L.x, L.y, L.r, 1); gl.uniform3fv(UB.uTop, o.top); gl.uniform3fv(UB.uBot, o.bot); gl.viewport(x0, y0, s, s); gl.depthFunc(gl.ALWAYS); gl.bindVertexArray(bgVao); gl.drawArrays(gl.TRIANGLES, 0, 3); gl.bindVertexArray(null); gl.depthFunc(gl.LESS);
            pass(L.vp, L.eye, x0, y0, s, s, { x: L.x, y: L.y, r: L.r }); gl.disable(gl.SCISSOR_TEST);
          }
        },
        dyn: () => dyn, ensureDyn(n) { if (dyn.length < n * 12) dyn = new Float32Array(n * 12 * 1.5); return dyn; }
      };
    } catch (e) { return null; }
  }
  // ---------------------------------------------------------------- Kamera, Licht, Szene
  const SCENE_C = [22, 15, 2], dayInfo = (h) => { const u = clamp((h - 6) / 14, 0, 1), a = Math.PI * (1 - u), e = (8 + 52 * Math.sin(Math.PI * u)) * Math.PI / 180, ce = Math.cos(e), L = [Math.cos(a) * ce, Math.sin(a) * ce, Math.sin(e)], k = Math.pow(Math.sin(Math.PI * u), 0.5), mix = (A, B, t) => A.map((v, i) => v + (B[i] - v) * t);
    return { L, sunCol: mix([1.0, 0.62, 0.38], [1.0, 0.96, 0.88], k), sky: mix([0.55, 0.5, 0.62], [0.62, 0.78, 1.0], k), gnd: mix([0.35, 0.3, 0.3], [0.52, 0.48, 0.4], k), fog: mix([0.95, 0.78, 0.65], [0.88, 0.93, 0.98], k), top: mix([0.95, 0.72, 0.52], [0.56, 0.76, 0.93], k), bot: mix([0.99, 0.9, 0.82], [0.92, 0.96, 0.99], k), cssTop: mix([242, 183, 137], [143, 193, 238], k).map(Math.round), cssBot: mix([251, 230, 209], [234, 243, 250], k).map(Math.round) }; };
  const MIRX = new Float32Array([-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  function camMats(cam, W, Hh, fov) {
    const cp = Math.cos(cam.pitch), eye = [cam.tx + cam.dist * cp * Math.sin(cam.yaw), cam.ty + cam.dist * cp * Math.cos(cam.yaw), cam.tz + cam.dist * Math.sin(cam.pitch)], V = m4.mul(m4.look([-eye[0], eye[1], eye[2]], [-cam.tx, cam.ty, cam.tz], [0, 0, 1]), MIRX), P = m4.persp(fov, W / Hh, 0.5, 400); return { eye, vp: m4.mul(P, V) };
  }
  function lightMat(L) { const c = [22, 15, 2], R = 52, eye = [c[0] + L[0] * 90, c[1] + L[1] * 90, c[2] + L[2] * 90]; return m4.mul(m4.ortho(-R, R, -R, R, 1, 220), m4.look(eye, c, Math.abs(L[2]) > 0.95 ? [0, 1, 0] : [0, 0, 1])); }
  const DEF_CAM = () => ({ tx: 22, ty: 15, tz: 2, yaw: -0.55, pitch: 0.62, dist: 66 });
  const FOCUS = { Alle: { tx: 22, ty: 15, tz: 2, dist: 66 }, Werkstatt: { tx: 12.5, ty: 11, tz: 2.5, dist: 26 }, Empfang: { tx: 23.5, ty: 11, tz: 2.5, dist: 20 }, Verkauf: { tx: 32.5, ty: 11, tz: 2.5, dist: 24 }, Kunden: { tx: 22, ty: 24, tz: 1.5, dist: 32 } };
  // ---------------------------------------------------------------- Simulation (Personen, Autos, Türen, Wolken, Hebebühnen)
  const SKIN = ['#f0c39b', '#e0ac80', '#c68a5e', '#8d5a3b', '#f5d2b3'], HAIR = ['#4a3426', '#2b2118', '#8a6a3a', '#c9a227', '#6a6a6a', '#a04a2a'];
  const PERS = { cust: [['#2a6fdb', '#3a3f48'], ['#d64575', '#2f3a52'], ['#2b9a66', '#3a3f48'], ['#e0a030', '#2f3a52'], ['#8b5cf6', '#3a3f48'], ['#e07b39', '#2f3a52'], ['#4a5568', '#232a38'], ['#c0392b', '#3a3f48']], sales: ['#1f3a6b', '#2b2f36'], mech: ['#e07b39', '#2f3a52'], recep: ['#d64545', '#2b2f36'] };
  const floorZ = (x, y) => (x > 5.1 && x < 37.9 && y > 3.1 && y < 19.6 ? 2 : 1);
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const go = (x, y, v) => ({ go: [x, y], v: v || 1.5 }), wt = (s) => ({ w: s }), vis = (b) => ({ vis: b }), setf = (fn) => ({ set: fn });
  function dur(steps, p0) { let t = 0, p = p0; steps.forEach((s) => { if (s.go) { t += dist(p, s.go) / s.v; p = s.go; } else if (s.w != null) t += s.w; }); return t; }
  const angd = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
  function emitPerson(a, push, t) {
    const sc = a.scale || 1, c = Math.cos(a.hd), s = Math.sin(a.hd), sit = !!a.sit, z0 = a.z + (sit ? 0.34 : 0), ph = a.walk * 3.1, sw = a.moving ? Math.sin(ph) : 0, bob = a.moving ? Math.abs(Math.cos(ph)) * 0.04 : Math.sin(t * 1.7 + (a.tt || 0)) * 0.012;
    const [shirt, pants] = a.col, L = (lx, ly, lz, hx2, hy2, hz2, col) => push(a.x + (lx * c - ly * s) * sc, a.y + (lx * s + ly * c) * sc, z0 + (lz + bob) * sc, hx2 * sc, hy2 * sc, hz2 * sc, a.hd, col);
    if (!sit) { L(0.04 + sw * 0.2, -0.12, 0.06, 0.15, 0.08, 0.06, '#1b1d22'); L(0.04 - sw * 0.2, 0.12, 0.06, 0.15, 0.08, 0.06, '#1b1d22'); L(sw * 0.18, -0.12, 0.5, 0.09, 0.09, 0.36, pants); L(-sw * 0.18, 0.12, 0.5, 0.09, 0.09, 0.36, pants); }
    else { L(0.26, -0.12, 0.5, 0.26, 0.09, 0.09, pants); L(0.26, 0.12, 0.5, 0.26, 0.09, 0.09, pants); L(0.52, -0.12, 0.2, 0.1, 0.08, 0.14, pants); L(0.52, 0.12, 0.2, 0.1, 0.08, 0.14, pants); }
    L(0, 0, 1.13, 0.14, 0.27, 0.33, shirt); L(0, 0, 0.84, 0.15, 0.27, 0.04, pants);
    const arm = (side, ph2) => { const raise = a.talk && side > 0 ? 0.35 + Math.sin(t * 3.2) * 0.12 : a.work && side < 0 ? 0.5 : 0, sw2 = -sw * 0.18 * (ph2 ? 1 : -1); L(sw2 + raise * 0.5, side * 0.37, 1.2 + raise * 0.3, 0.07, 0.07, 0.27, shirt); L(sw2 * 1.2 + raise * 0.9, side * 0.37, 0.9 + raise * 0.55, 0.06, 0.06, 0.06, a.skin); };
    arm(1, true); arm(-1, false);
    L(0, 0, 1.5, 0.06, 0.06, 0.05, a.skin); L(0, 0, 1.72, 0.15, 0.15, 0.16, a.skin); L(0.15, 0.06, 1.74, 0.01, 0.03, 0.03, '#1b1d22'); L(0.15, -0.06, 1.74, 0.01, 0.03, 0.03, '#1b1d22');
    L(0, 0, 1.9, 0.16, 0.16, 0.05, a.hair); L(-0.12, 0, 1.74, 0.05, 0.15, 0.12, a.hair);
    if (a.tie) L(0.15, 0, 1.22, 0.01, 0.04, 0.2, '#d64545'); if (a.helm) L(0, 0, 1.96, 0.17, 0.17, 0.05, C.yellow); if (a.vest) L(0.0, 0, 1.15, 0.145, 0.275, 0.1, '#f2c230');
  }
  function emitCar(a, push) { const c = Math.cos(a.hd), s = Math.sin(a.hd); carTpl(a.col).forEach(([lx, ly, lz, hx2, hy2, hz2, col]) => { let cc = col; if (a.brk && lx < -2 && col === '#8a1f1f') cc = '#ff3b30'; push(a.x + lx * c - ly * s, a.y + lx * s + ly * c, a.z + lz, hx2, hy2, hz2, a.hd, cc); }); }
  function newSim(seed, k) { // k: {occ, cust, wait, mech}
    const R = rng(seed), A = []; let t = 0, nextCust = 0.5, nextTraf = 1.5, trafDir = 0; const stalls = [1, 3, 4, 6], busy = {}, doors = [{ x0: 22, x1: 24, y: 19.5, open: 0 }, { x0: 31, x1: 35, y: 19.5, open: 0 }];
    const clouds = [[10, 14, 26, 5, 2.8, 1.4], [38, 26, 29, 4, 2.4, 1.2], [-6, 34, 25, 6, 3, 1.5], [26, 0, 28, 5, 2.6, 1.3], [48, 22, 30, 4.4, 2.4, 1.2]].map((c) => ({ x: c[0], y: c[1], z: c[2], hx: c[3], hy: c[4], hz: c[5] }));
    const mkP = (x, y, col, o) => Object.assign({ k: 'p', x, y, z: floorZ(x, y), hd: R() * 6.28, col, s: [], i: 0, walk: R() * 3, vis: true, moving: false, skin: SKIN[Math.floor(R() * 5)], hair: HAIR[Math.floor(R() * 6)], scale: 0.93 + R() * 0.12 }, o || {});
    const mkCar = (x, y, col, steps, hd) => ({ k: 'c', x, y, z: 1, hd: hd || 0, td: hd || 0, sp: 4, col, s: steps, i: 0, vis: true, brk: false });
    A.push(mkP(22.5, 8.2, PERS.recep, { still: true, hd: Math.PI / 2, hair: '#7a4a2a', skin: SKIN[0], tt: 1 }));
    for (let i = 0; i < 3; i++) { const P = [[[32.4, 10.6], [31.2, 7.6], [33.2, 10.8]], [[35.6, 8.6], [31.6, 14.4], [35.6, 8.6]], [[36.2, 17.2], [31.0, 12.2], [34.5, 17.0]]][i], s = []; P.forEach((q, j) => { s.push(go(q[0], q[1], 0.9), setf((a) => { a.talk = i === 0 && j === 0; }), wt(3 + (i + j) % 3), setf((a) => { a.talk = false; })); }); A.push(mkP(P[0][0], P[0][1], PERS.sales, { tie: true, s, loop: true, hair: i === 1 ? '#c9a227' : HAIR[0] })); }
    for (let i = 0; i < k.mech; i++) { const lx = [7, 11, 15][i % 3], ly = [6, 12][Math.floor(i / 3) % 2], s = [go(lx + 3.35, ly + 2, 1.3), setf((a) => { a.work = true; a.hd = Math.PI; }), wt(5 + (i % 3)), setf((a) => { a.work = false; }), go(lx + 1.5, 5.8, 1.3), wt(3), go(lx + 3.35, ly + 3, 1.3), wt(3)]; A.push(mkP(lx + 3.35, ly + 2, PERS.mech, { s, loop: true, helm: i % 2 === 0, vest: i % 3 === 0 })); }
    const wp = [[23.9, 12.6], [21.4, 13.6], [24.9, 14.0], [22.7, 14.9], [20.6, 15.6]]; for (let i = 0; i < k.wait; i++) A.push(mkP(wp[i][0], wp[i][1], PERS.cust[(i + 2) % 8], { still: true, tt: i, hd: -Math.PI / 2 + (R() - 0.5) * 0.8 }));
    function spawnCust() {
      const free = stalls.filter((q) => !busy[q]); if (!free.length) return; const sidx = free[Math.floor(R() * free.length)], sx = 9.5 + 4 * sidx, fromW = R() < 0.6, lane = fromW ? 28.8 : 27.8, x0 = fromW ? -5 : 49, car = CARC[Math.floor(R() * CARC.length)], sales = R() < 0.38, col = PERS.cust[Math.floor(R() * 8)];
      busy[sidx] = true; const carIn = [go(sx, lane, 7), go(sx, 25.6, 3.4), go(sx, 24.2, 1.6)], t1 = dur([go(x0, lane, 7)].concat(carIn), [x0, lane]) + 1.2;
      const out = [vis(true), go(sx + 1.7, 24.2, 1.5), go(sx + 1.7, 21.2, 1.5), go(22.5, 21.0, 1.5), go(22.5, 18.6, 1.4), go(22.5, 11.6, 1.4)];
      if (!sales) out.push(setf((a) => { a.talk = true; }), wt(2.8 + R() * 2), setf((a) => { a.talk = false; }), go(21.1, 16.4, 1.3), setf((a) => { a.sit = true; a.hd = Math.PI; }), wt(6 + R() * 4), setf((a) => { a.sit = false; }), go(22.5, 11.6, 1.3), wt(1.5));
      else out.push(wt(1.2), go(26.2, 10.5), go(27.8, 10.5), go(31.2, 11.2), setf((a) => { a.talk = true; }), wt(6 + R() * 3), setf((a) => { a.talk = false; }), go(33.4, 6.6), wt(2.5), go(27.8, 10.5), go(22.5, 12.5));
      out.push(go(22.5, 18.6), go(22.5, 21.0), go(sx + 1.7, 21.2), go(sx + 1.7, 24.2), vis(false));
      const tTrip = dur(out, [sx + 1.7, 24.2]) + 0.4;
      const carSteps = [go(sx, lane, 7), go(sx, 25.6, 3.4), go(sx, 24.2, 1.6), wt(tTrip + 0.6), go(sx, 27.0, 1.8), go(sx, lane, 2.4), go(fromW ? 50 : -6, lane, 7), setf((a) => { a.done = true; busy[sidx] = false; })];
      A.push(mkCar(x0, lane, car, carSteps, fromW ? 0 : Math.PI)); A.push(mkP(sx + 1.7, 24.2, col, { s: [vis(false), wt(t1)].concat(out) }));
    }
    function spawnTraffic() { const east = trafDir++ % 2 === 0, lane = east ? 28.8 : 27.8; A.push(mkCar(east ? -5 : 49, lane, CARC[Math.floor(R() * CARC.length)], [go(east ? 50 : -6, lane, 6.5 + R() * 2)], east ? 0 : Math.PI)); }
    function upd(a, dt) {
      let rem = dt; a.moving = false; let moved = false;
      if (a.k === 'c') { const s0 = a.s[a.i]; if (s0 && s0.go) { const d0 = Math.hypot(s0.go[0] - a.x, s0.go[1] - a.y), tg = Math.min(s0.v, 0.9 + 1.9 * d0), pr = a.sp; a.sp += clamp(tg - a.sp, -7 * dt, 3 * dt); a.brk = a.sp < pr - 0.01 && tg < s0.v; } else { a.sp = 0; a.brk = true; } }
      while (rem > 1e-6 && a.i < a.s.length) {
        const s = a.s[a.i];
        if (s.go) { const dx = s.go[0] - a.x, dy = s.go[1] - a.y, d = Math.hypot(dx, dy), v = a.k === 'c' ? Math.max(a.sp, 0.35) : s.v, stp = v * rem; a.td = Math.atan2(dy, dx); if (d <= stp) { a.x = s.go[0]; a.y = s.go[1]; rem -= d / v; a.i++; a.walk += d; moved = true; } else { a.x += dx / d * stp; a.y += dy / d * stp; a.walk += stp; rem = 0; a.moving = true; moved = true; } }
        else if (s.w != null) { a.tw = (a.tw || 0) + rem; if (a.tw >= s.w) { rem = a.tw - s.w; a.tw = 0; a.i++; } else rem = 0; }
        else if (s.vis != null) { a.vis = s.vis; a.i++; } else if (s.set) { s.set(a); a.i++; } else a.i++;
      }
      if (moved && a.td !== undefined) a.hd += angd(a.hd, a.td) * Math.min(1, dt * (a.k === 'c' ? 5 : 9));
      if (a.i >= a.s.length && a.s.length) { if (a.loop) a.i = 0; else a.done = true; }
      if (a.k === 'p') a.z = floorZ(a.x, a.y);
    }
    return {
      t: 0, k, count: () => A.length,
      step(dt) {
        t += dt; this.t = t; nextCust -= dt; nextTraf -= dt; if (nextCust <= 0 && k.cust > 0) { spawnCust(); nextCust = Math.max(2.5, 26 / k.cust) * (0.7 + R() * 0.6); } if (nextTraf <= 0) { spawnTraffic(); nextTraf = 3 + R() * 3; }
        A.forEach((a) => upd(a, dt)); for (let i = A.length - 1; i >= 0; i--) if (A[i].done) A.splice(i, 1);
        doors.forEach((d) => { let near = false; for (const a of A) { if (a.k !== 'p' || !a.vis) continue; if (Math.hypot(a.x - (d.x0 + d.x1) / 2, a.y - d.y) < 3.2) { near = true; break; } } d.open += ((near ? 1 : 0) - d.open) * Math.min(1, dt * 3); });
        clouds.forEach((c) => { c.x += dt * 0.45; if (c.x > 62) c.x = -22; });
      },
      emit(push) {
        A.forEach((a) => { if (!a.vis) return; if (a.k === 'p') emitPerson(a, push, t); else emitCar(a, push); });
        for (let i = 0; i < 6; i++) { if (i >= k.occ) continue; const lx = [7, 11, 15][i % 3], ly = [6, 12][Math.floor(i / 3)], ph = ((t + i * 2.3) % 14) / 14, hgt = ph < 0.2 ? easeOut(ph / 0.2) : ph < 0.6 ? 1 : ph < 0.8 ? 1 - easeOut((ph - 0.6) / 0.2) : 0, z = 2.05 + hgt * 1.9; push(lx + 1.5, ly + 2, z, 1.3, 2.1, 0.06, 0, C.steel); const col = CARC[(i * 3 + 1) % CARC.length], c = Math.cos(Math.PI / 2), s = Math.sin(Math.PI / 2); carTpl(col).forEach(([x, y, zz, h1, h2, h3, cl]) => push(lx + 1.5 + x * c - y * s, ly + 2 + x * s + y * c, z + 0.06 + zz, h1, h2, h3, Math.PI / 2, cl)); }
        doors.forEach((d) => { const hw = (d.x1 - d.x0) / 2; push(d.x0 + hw / 2 - d.open * hw * 0.92, d.y, 3.0, hw / 2, 0.05, 1.0, 0, '#bfe6f7'); push(d.x1 - hw / 2 + d.open * hw * 0.92, d.y, 3.0, hw / 2, 0.05, 1.0, 0, '#bfe6f7'); push((d.x0 + d.x1) / 2, d.y, 4.04, hw, 0.08, 0.06, 0, '#2b2f36'); });
        push(3.5, 21.5, 12.4, 0.06, 0.06, 1.6, 0, '#9aa3b0'); for (let i = 0; i < 8; i++) push(4.0 + i * 0.5, 21.5, 13.1 + Math.sin(t * 3 + i * 0.7) * 0.12 - i * 0.03, 0.25, 0.04, 0.5, 0, i % 2 ? '#ffffff' : '#d64545');
        clouds.forEach((c) => { push(c.x, c.y, c.z, c.hx * 1.5, c.hy * 1.5, c.hz, 0, '#fbfcfe', -2); push(c.x + c.hx, c.y - c.hy * 0.5, c.z, c.hx, c.hy, c.hz, 0, '#fbfcfe', -2); });
      }
    };
  }
  // ---------------------------------------------------------------- Zustand, Szene und Steuerung
  const st = { cam: DEF_CAM(), camT: DEF_CAM(), auto: true, playing: false, built: false, n: 0, dur: 11, speed: 1, labels: true, act: true, shadow: true, lens: false, lensK: 3, lensPos: null, sel: 'Alle', sim: null, simKey: '', kp: null, raf: 0, last: 0, drag: null, hit: [], hour: 14, day: false, fine: 2, err: '', mode: 'gl', hudW: 0 };
  let cv = null, hud = null, hc = null, cx = null, W = 0, Hh = 0, dpr = 1, GLR = null, FINE = null, fineKey = 0;
  function ensure() { if (!MODEL) MODEL = buildModel(); return MODEL; }
  function ensureFine(g) { ensure(); if (!FINE || fineKey !== st.fine) { FINE = buildFine(MODEL, st.fine); fineKey = st.fine; if (g) g.setStatic(FINE.arr, FINE.count); } return FINE; }
  function viewCam(lensOpt) { return st.cam; }
  function dynBoxes(sim, dynBuf) { let n = 0; if (!sim) return { arr: dynBuf, n: 0 }; const push = (x, y, z, hx2, hy2, hz2, yaw, hex, rk) => { if (n * 12 + 12 > dynBuf.length) return; const o = n * 12, rgb = HEXS[hx(hex)]; dynBuf[o] = x; dynBuf[o + 1] = y; dynBuf[o + 2] = z; dynBuf[o + 3] = yaw; dynBuf[o + 4] = hx2; dynBuf[o + 5] = hy2; dynBuf[o + 6] = hz2; dynBuf[o + 7] = 1; dynBuf[o + 8] = rgb[0]; dynBuf[o + 9] = rgb[1]; dynBuf[o + 10] = rgb[2]; dynBuf[o + 11] = rk === undefined ? -1 : rk; n++; }; sim.emit(push); return { arr: dynBuf, n }; }
  function frameParams(g, w, h, cam, o) { // o: {n, hour, sim, shadows, lens:{px,py,r(CSS),k}}
    const fov = 0.62, di = dayInfo(o.hour), { eye, vp } = camMats(cam, w, h, fov), dyn = g.ensureDyn(8000), dd = dynBoxes(o.sim, dyn); g.setDynamic(dyn, dd.n);
    const P = { w, h, vp, eye, lvp: lightMat(di.L), n: o.n >= FINE.rankMax ? FINE.rankMax * 3 : o.n, nt: FINE.count, dur: st.dur, sun: di.L, sunCol: di.sunCol, sky: di.sky, gnd: di.gnd, fog: di.fog, top: di.top, bot: di.bot, shadows: o.shadows, nDyn: dd.n, lens: null, di };
    if (o.lens) { const inv = m4.inv(vp), ndcX = o.lens.px / w * 2 - 1, ndcY = 1 - o.lens.py / h * 2, p0 = xf(inv, ndcX, ndcY, -1), p1 = xf(inv, ndcX, ndcY, 1), dz = p1[2] - p0[2]; let tt = Math.abs(dz) > 1e-6 ? (2 - p0[2]) / dz : 0; tt = clamp(tt, 0, 1); const T = [p0[0] + (p1[0] - p0[0]) * tt, p0[1] + (p1[1] - p0[1]) * tt, 2], cam2 = Object.assign({}, cam, { tx: T[0], ty: T[1], tz: T[2], dist: Math.max(4, cam.dist / o.lens.k) }), R = o.lens.r, m2 = camMats(cam2, 2 * R, 2 * R, fov); P.lens = { x: o.lens.px, y: h - o.lens.py, r: R, vp: m2.vp, eye: m2.eye }; P.lensT = T; }
    return P;
  }
  function rayPlane(vp, px, py, w, h, z) { const inv = m4.inv(vp), nx = px / w * 2 - 1, ny = 1 - py / h * 2, p0 = xf(inv, nx, ny, -1), p1 = xf(inv, nx, ny, 1), dz = p1[2] - p0[2]; if (Math.abs(dz) < 1e-6) return null; const t = (z - p0[2]) / dz; return [p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t]; }
  function projector(vp, w, h) { return (x, y, z) => { const p = xf(vp, x, y, z); return [(p[0] * 0.5 + 0.5) * w, (0.5 - p[1] * 0.5) * h, p[3]]; }; }
  function drawHud(c, w, h, proj, o) { // Marker, Beschriftung, Aufbaustand, Lupe
    if (!o.noClear) c.clearRect(0, 0, w, h); const kp = o.kp; o.hit = [];
    if (o.sel && o.sel !== 'Alle') { const z = ZONES.find((q) => q.id === o.sel); if (z) { const [x0, y0, x1, y1] = z.rect, q = [proj(x0, y0, z.z), proj(x1, y0, z.z), proj(x1, y1, z.z), proj(x0, y1, z.z)]; c.fillStyle = z.col + '38'; c.strokeStyle = z.col; c.lineWidth = 2; c.beginPath(); c.moveTo(q[0][0], q[0][1]); q.slice(1).forEach((pt) => c.lineTo(pt[0], pt[1])); c.closePath(); c.fill(); c.stroke(); } }
    const p0 = proj(3.5, 21.5, 11.8); if (w < 500) { /* kleine Bilder ohne Beschriftung */ } else { c.font = 'bold ' + clamp(Math.round(2200 / Math.max(30, o.dist)), 11, 20) + 'px Helvetica, Arial, sans-serif'; c.textAlign = 'center'; c.lineJoin = 'round'; c.lineWidth = 4; c.strokeStyle = 'rgba(255,255,255,0.9)'; c.strokeText('AUTOHAUS', p0[0], p0[1]); c.fillStyle = '#1f2430'; c.fillText('AUTOHAUS', p0[0], p0[1]); }
    if (o.labels && kp) {
      let zs = ZONES; if (o.dist < 38) zs = ZONES.filter((z) => z.id === o.sel); const pills = zs.map((z) => { const k = kp[z.id], p = proj(z.anchor[0], z.anchor[1], z.anchor[2]); return { z, k, x: p[0], y: p[1] }; }).sort((a, b) => a.y - b.y), pad = 8;
      c.font = 'bold 12px Helvetica, Arial, sans-serif'; pills.forEach((p, i) => { p.ty = p.y - 30; for (let j = 0; j < i; j++) { const q = pills[j]; if (Math.abs(p.x - q.x) < 190 && Math.abs(p.ty - q.ty) < 40) p.ty = q.ty + 42; } });
      pills.forEach((p) => { const t1 = p.z.id + ' · ' + p.k.main, t2 = p.k.mainLabel, w1 = c.measureText(t1).width; c.font = '11px Helvetica, Arial, sans-serif'; const w2 = c.measureText(t2).width; c.font = 'bold 12px Helvetica, Arial, sans-serif'; const bw = Math.max(w1, w2) + pad * 2 + 12, bx = clamp(p.x - bw / 2, 4, w - bw - 4), by = clamp(p.ty - 14, 34, h - 44), sel = o.sel === p.z.id;
        c.strokeStyle = '#1f2430'; c.lineWidth = 1; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(clamp(p.x, bx + 6, bx + bw - 6), by + 34); c.stroke(); c.fillStyle = '#1f2430'; c.beginPath(); c.arc(p.x, p.y, 3, 0, 7); c.fill();
        c.fillStyle = sel ? '#fff7e0' : 'rgba(255,255,255,0.94)'; c.strokeStyle = sel ? p.z.col : '#c3c9d3'; c.lineWidth = sel ? 2 : 1; c.beginPath(); if (c.roundRect) c.roundRect(bx, by, bw, 34, 7); else c.rect(bx, by, bw, 34); c.fill(); c.stroke();
        c.fillStyle = { good: '#2b9a66', warn: '#e0a030', bad: '#d64545', none: '#8a919e' }[p.k.status]; c.beginPath(); c.arc(bx + 11, by + 12, 5, 0, 7); c.fill(); c.fillStyle = '#1f2430'; c.textAlign = 'left'; c.font = 'bold 12px Helvetica, Arial, sans-serif'; c.fillText(t1, bx + 22, by + 16); c.fillStyle = '#5a6270'; c.font = '11px Helvetica, Arial, sans-serif'; c.fillText(t2, bx + 22, by + 29); o.hit.push({ id: p.z.id, box: [bx, by, bw, 34] }); });
    }
    if (o.phaseText) { c.fillStyle = 'rgba(31,36,48,0.85)'; c.font = '12px Helvetica, Arial, sans-serif'; c.textAlign = 'left'; c.fillText(o.phaseText, 10, h - 12); }
    if (o.lens) { const L = o.lens; c.strokeStyle = '#1f2430'; c.lineWidth = 3; c.beginPath(); c.arc(L.px, L.py, L.r, 0, 7); c.stroke(); c.strokeStyle = 'rgba(255,255,255,0.85)'; c.lineWidth = 1.5; c.beginPath(); c.arc(L.px, L.py, L.r - 2, 0, 7); c.stroke(); c.strokeStyle = '#1f2430'; c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(L.px + L.r * 0.71, L.py + L.r * 0.71); c.lineTo(L.px + L.r * 0.71 + 26, L.py + L.r * 0.71 + 26); c.stroke(); c.lineCap = 'butt'; c.fillStyle = 'rgba(31,36,48,0.85)'; c.font = 'bold 12px Helvetica, Arial, sans-serif'; c.textAlign = 'center'; c.fillText('Lupe ×' + L.k, L.px, L.py - L.r - 7); c.beginPath(); c.moveTo(L.px - 6, L.py); c.lineTo(L.px + 6, L.py); c.moveTo(L.px, L.py - 6); c.lineTo(L.px, L.py + 6); c.strokeStyle = 'rgba(31,36,48,0.5)'; c.lineWidth = 1; c.stroke(); }
  }
  // Szene zeichnen: GL (oder 2D-Notlösung) auf cv, HUD auf hud
  function draw() {
    if (!cx || !MODEL) return; const kp = st.kp, sim = st.built && st.act && st.sim ? st.sim : null, nBuilt = st.n, phaseTxt = (() => { if (!FINE || st.n >= FINE.rankMax) return ''; const i = Math.min(MODEL.N - 1, Math.floor(st.n / FINE.rankMax * MODEL.N)); return 'Aufbau: ' + MODEL.pn[MODEL.items[i].ph] + ' · ' + Math.round(st.n / FINE.rankMax * 100) + ' %'; })();
    const lensO = st.lens && st.lensPos ? { px: st.lensPos[0], py: st.lensPos[1], r: Math.min(130, Math.round(Math.min(W, Hh) * 0.27)), k: st.lensK } : null;
    if (GLR) {
      const P = frameParams(GLR, Math.round(W * dpr), Math.round(Hh * dpr), st.cam, { n: nBuilt, hour: st.hour, sim, shadows: st.shadow, lens: lensO ? { px: lensO.px * dpr, py: lensO.py * dpr, r: lensO.r * dpr, k: lensO.k } : null });
      GLR.render(P); const proj = projector(P.vp, W, Hh); hc.setTransform(dpr, 0, 0, dpr, 0, 0); const o = { kp, labels: st.labels && kp && st.n >= FINE.rankMax * 0.9, sel: st.sel, dist: st.cam.dist, phaseText: phaseTxt, lens: lensO }; drawHud(hc, W, Hh, proj, o); st.hit = o.hit;
    } else {
      const boxes = sim ? (() => { const b = []; sim.emit((x, y, z, hx2, hy2, hz2, yaw, hex) => { const s = Math.abs(Math.sin(yaw)), c = Math.abs(Math.cos(yaw)), w2 = 2 * (hx2 * c + hy2 * s), d2 = 2 * (hx2 * s + hy2 * c); b.push([x - w2 / 2, y - d2 / 2, z - hz2, w2, d2, 2 * hz2, hex]); }); return b.filter((q) => q[2] < 12); })() : null;
      cx.setTransform(dpr, 0, 0, dpr, 0, 0); const o = { yaw: st.cam.yaw, zoom: clamp(66 / st.cam.dist, 0.5, 3), n: st.n / FINE.rankMax * MODEL.N, dur: st.dur, boxes, sel: st.sel, kp, labels: st.labels && kp && st.n >= FINE.rankMax * 0.9, phaseText: phaseTxt }; render(cx, W, Hh, o); st.hit = o.hit || [];
      if (lensO) { cx.save(); cx.beginPath(); cx.arc(lensO.px, lensO.py, lensO.r, 0, 7); cx.clip(); cx.drawImage(cv, (lensO.px - lensO.r / lensO.k) * dpr, (lensO.py - lensO.r / lensO.k) * dpr, 2 * lensO.r / lensO.k * dpr, 2 * lensO.r / lensO.k * dpr, lensO.px - lensO.r, lensO.py - lensO.r, 2 * lensO.r, 2 * lensO.r); cx.restore(); cx.strokeStyle = '#1f2430'; cx.lineWidth = 3; cx.beginPath(); cx.arc(lensO.px, lensO.py, lensO.r, 0, 7); cx.stroke(); }
    }
    const wrap = $('ah-wrap'); if (wrap && GLR) { const di = dayInfo(st.hour); wrap.style.background = 'linear-gradient(180deg, rgb(' + di.cssTop.join(',') + '), rgb(' + di.cssBot.join(',') + '))'; }
  }
  function size() { const box = $('ah-wrap'); if (!box || !cv) return false; const w = box.clientWidth; if (!w) return false; const h = Math.round(clamp(w * 0.6, 380, 680)); dpr = Math.min(window.devicePixelRatio || 1, 2); if (w !== W || h !== Hh) { W = w; Hh = h; [cv, hud].forEach((e) => { e.width = Math.round(w * dpr); e.height = Math.round(h * dpr); e.style.width = w + 'px'; e.style.height = h + 'px'; }); } return true; }
  function simFor(kp) { const key = JSON.stringify(kp.scene); if (st.sim && st.simKey === key) return st.sim; st.sim = newSim(20261016, kp.scene); st.simKey = key; for (let i = 0; i < 400; i++) st.sim.step(0.1); return st.sim; }
  function frame(ts) {
    st.raf = 0; if (H.cur() !== 'ah' || !cv || !cv.isConnected || document.hidden) return;
    try {
      const dt = Math.min(0.06, (ts - (st.last || ts)) / 1000); st.last = ts; if (!size()) { loop(); return; } ensure(); ensureFine(GLR);
      if (st.playing) { if (st.n < FINE.rankMax) { st.n = Math.min(FINE.rankMax, st.n + FINE.rankMax / st.dur * dt * st.speed); if (st.n >= FINE.rankMax) { st.built = true; status2(); } } if (st.built && st.act && st.sim && !reduce) st.sim.step(dt * st.speed); if (st.day) { st.hour += dt * 0.5 * st.speed; if (st.hour > 20) st.hour = 6; const hs = $('ah-hour'); if (hs) hs.value = String(st.hour); } if (st.auto && !st.drag) st.camT.yaw += dt * 0.1 * st.speed; }
      const c = st.cam, T = st.camT, k = Math.min(1, dt * 4); ['tx', 'ty', 'tz', 'dist', 'pitch'].forEach((q) => { c[q] += (T[q] - c[q]) * k; }); c.yaw += (T.yaw - c.yaw) * Math.min(1, dt * 9);
      draw();
    } catch (e) { st.err = String(e && e.message || e).slice(0, 160); const s = $('ah-state'); if (s) s.textContent = 'Darstellungsfehler: ' + st.err; st.fatal = true; return; }
    loop();
  }
  function loop() { if (!st.raf && H.cur() === 'ah') st.raf = requestAnimationFrame(frame); }
  function status2() { const e = $('ah-state'); if (e) e.textContent = (st.mode === 'gl' ? '' : 'Einfache Darstellung (WebGL nicht verfügbar) · ') + (st.built ? 'Aufbau abgeschlossen' : st.playing ? 'Aufbau läuft' : 'Pausiert'); }
  function tiles() {
    const box = $('ah-kpi'), kp = st.kp; if (!box) return; if (!kp) { box.textContent = 'Kennzahlen werden geladen …'; return; } box.replaceChildren();
    ZONES.forEach((z) => { const k = kp[z.id], t = document.createElement('div'); t.className = 'kt'; t.style.cursor = 'pointer'; t.style.borderTop = '4px solid ' + z.col; if (st.sel === z.id) t.style.outline = '2px solid ' + z.col;
      const h = document.createElement('div'); h.className = 'kl'; h.textContent = z.id + ' · ' + k.mainLabel; const v = document.createElement('div'); v.className = 'kv'; v.textContent = k.main; t.append(h, v);
      k.lines.forEach(([l, val, s]) => { const r = document.createElement('div'); r.className = 'ks'; r.textContent = l + ': ' + val + (s ? ' (' + s + ')' : ''); t.append(r); });
      t.addEventListener('click', () => pick(z.id)); box.append(t); });
  }
  function pick(id) { st.sel = st.sel === id ? 'Alle' : id; focus(st.sel); zoneBtns(); tiles(); draw(); }
  function focus(id) { const f = FOCUS[id] || FOCUS.Alle; Object.assign(st.camT, f); st.auto = id === 'Alle' ? st.auto : false; btns(); }
  function zoneBtns() { const g = $('ah-zone'); if (g) g.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.z === st.sel))); }
  function summary() { const kp = st.kp, e = $('ah-sum'); if (!e) return; if (!kp) { e.textContent = ''; return; } const s = kp.scene; e.textContent = 'Region ' + kp.rg + ', Zeitraum laut Filter oben. Werkstatt: Auslastung ' + kp.Werkstatt.main + ' – ' + s.occ + ' von 6 Hebebühnen sind belegt. Empfang: Lead → Termin ' + kp.Empfang.main + ', Antwortzeit ' + kp.Empfang.lines[1][1] + ' – ' + s.wait + ' Wartende am Empfang. Verkauf: Vertragsverlängerung ' + kp.Verkauf.main + '. Kunden: CSI ' + kp.Kunden.main + '; ' + s.cust + ' Kundenfahrzeuge je Durchlauf. Die Szene ist symbolisch: Die Zahlen steuern Belegung, Warteschlange und Kundenaufkommen; es sind Testdaten und keine Abbildung eines einzelnen Autohauses.'; }
  function refresh() { const kp = kpis(); if (kp) { st.kp = kp; simFor(kp); tiles(); summary(); } else { st.kp = null; tiles(); } }
  function start(skip) { ensure(); ensureFine(GLR); st.n = skip || reduce ? FINE.rankMax : 0; st.built = st.n >= FINE.rankMax; st.playing = true; st.last = 0; status2(); btns(); loop(); }
  function btns() { const p = $('ah-pause'); if (p) { p.textContent = st.playing ? 'Pause' : 'Weiter'; p.setAttribute('aria-pressed', String(!st.playing)); } [['ah-rot', st.auto], ['ah-lab', st.labels], ['ah-act', st.act], ['ah-lens', st.lens], ['ah-shadow', st.shadow], ['ah-day', st.day]].forEach(([id, v]) => { const e = $(id); if (e) e.setAttribute('aria-pressed', String(v)); }); if (cv) cv.style.cursor = st.lens ? 'none' : 'grab'; }
  function init() {
    if (cv) return; cv = $('ah-cv'); hud = $('ah-hud'); if (!cv || !hud) return; hc = hud.getContext('2d'); GLR = makeGL(cv, false); if (!GLR) { const nc = cv.cloneNode(false); cv.replaceWith(nc); cv = nc; st.mode = '2d'; cx = cv.getContext('2d'); size(); } else { st.mode = 'gl'; cx = true; }
    const on = (id, ev, fn) => { const e = $(id); if (e) e.addEventListener(ev, fn); };
    on('ah-play', 'click', () => start(false)); on('ah-skip', 'click', () => start(true));
    on('ah-pause', 'click', () => { st.playing = !st.playing; st.last = 0; status2(); btns(); loop(); });
    on('ah-sp', 'change', () => { st.speed = +$('ah-sp').value; });
    on('ah-rot', 'click', () => { st.auto = !st.auto; btns(); }); on('ah-lab', 'click', () => { st.labels = !st.labels; btns(); }); on('ah-act', 'click', () => { st.act = !st.act; btns(); });
    on('ah-shadow', 'click', () => { st.shadow = !st.shadow; btns(); }); on('ah-day', 'click', () => { st.day = !st.day; btns(); });
    on('ah-lens', 'click', () => { st.lens = !st.lens; if (st.lens && !st.lensPos) st.lensPos = [W / 2, Hh / 2]; btns(); });
    on('ah-lk', 'change', () => { st.lensK = +$('ah-lk').value; });
    on('ah-hour', 'input', () => { st.hour = +$('ah-hour').value; });
    on('ah-bs', 'change', () => { st.fine = +$('ah-bs').value; ensureFine(GLR); if (st.playing || st.built) { st.n = FINE.rankMax; } });
    on('ah-reset', 'click', () => { Object.assign(st.camT, DEF_CAM()); st.sel = 'Alle'; zoneBtns(); tiles(); });
    on('ah-zone', 'click', (e) => { const b = e.target.closest('button'); if (!b) return; st.sel = b.dataset.z; focus(st.sel); zoneBtns(); tiles(); });
    hud.addEventListener('contextmenu', (e) => e.preventDefault());
    hud.addEventListener('pointerdown', (e) => { st.drag = { x: e.clientX, y: e.clientY, yaw: st.camT.yaw, pitch: st.camT.pitch, tx: st.camT.tx, ty: st.camT.ty, moved: 0, pan: e.button === 2 || e.shiftKey }; hud.setPointerCapture && hud.setPointerCapture(e.pointerId); });
    hud.addEventListener('pointermove', (e) => {
      const r = hud.getBoundingClientRect(); if (st.lens) st.lensPos = [e.clientX - r.left, e.clientY - r.top];
      if (!st.drag) return; const dx = e.clientX - st.drag.x, dy = e.clientY - st.drag.y; st.drag.moved = Math.max(st.drag.moved, Math.abs(dx) + Math.abs(dy)); if (st.drag.moved < 5) return;
      if (st.drag.pan) { const vp = camMats(st.cam, W, Hh, 0.62).vp, a = rayPlane(vp, st.drag.x - r.left, st.drag.y - r.top, W, Hh, st.cam.tz), b2 = rayPlane(vp, e.clientX - r.left, e.clientY - r.top, W, Hh, st.cam.tz); if (a && b2) { st.camT.tx = clamp(st.drag.tx + a[0] - b2[0], -10, 54); st.camT.ty = clamp(st.drag.ty + a[1] - b2[1], -6, 36); st.cam.tx = st.camT.tx; st.cam.ty = st.camT.ty; } }
      else { st.auto = false; st.camT.yaw = st.drag.yaw - dx / 170; st.camT.pitch = clamp(st.drag.pitch + dy / 220, 0.2, 1.4); st.cam.yaw = st.camT.yaw; st.cam.pitch = st.camT.pitch; btns(); }
    });
    hud.addEventListener('pointerup', (e) => { const d = st.drag; st.drag = null; if (d && d.moved < 5) { const r = hud.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, h = st.hit.find((q) => x >= q.box[0] && x <= q.box[0] + q.box[2] && y >= q.box[1] && y <= q.box[1] + q.box[3]); if (h) pick(h.id); } });
    hud.addEventListener('pointerleave', () => { if (st.lens) st.lensPos = null; });
    hud.addEventListener('wheel', (e) => { e.preventDefault(); if (st.lens && !e.ctrlKey) { st.lensK = clamp(st.lensK + (e.deltaY < 0 ? 1 : -1), 2, 5); const q = $('ah-lk'); if (q) q.value = String(st.lensK); } else { st.camT.dist = clamp(st.camT.dist * (e.deltaY < 0 ? 0.9 : 1.1), 8, 95); } }, { passive: false });
    on('ah-zin', 'click', () => { st.camT.dist = clamp(st.camT.dist * 0.8, 8, 95); }); on('ah-zout', 'click', () => { st.camT.dist = clamp(st.camT.dist * 1.25, 8, 95); });
    window.addEventListener('resize', () => { if (H.cur() === 'ah') size(); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden && H.cur() === 'ah') { st.last = 0; loop(); } });
  }
  // ---------------------------------------------------------------- Standbild für das Booklet
  let SNAP = null;
  function snap(c, W2, H2, o) { // o: {yaw, pitch, dist, build (0..1), hour, kp, sel, labels, sim (true/false), target}
    ensure(); const kp = o.kp === undefined ? kpis() : o.kp, sim = kp && o.sim !== false && (o.build === undefined || o.build >= 1) ? newSim(20261016, kp.scene) : null; if (sim) for (let i = 0; i < 500; i++) sim.step(0.1);
    const gw = Math.round(W2 * 1.6), gh = Math.round(H2 * 1.6);
    if (!SNAP) { const cvs = document.createElement('canvas'); cvs.width = gw; cvs.height = gh; const g = makeGL(cvs, true); SNAP = g ? { cvs, g } : { cvs: null, g: null }; }
    if (SNAP.g) {
      const g = SNAP.g; if (SNAP.cvs.width !== gw || SNAP.cvs.height !== gh) { SNAP.cvs.width = gw; SNAP.cvs.height = gh; } FINE2 = FINE2 && FINE2.f === 2 ? FINE2 : buildFine(MODEL, 2); g.setStatic(FINE2.arr, FINE2.count);
      const cam = { tx: 22, ty: 15, tz: 2, yaw: o.yaw === undefined ? -0.55 : o.yaw, pitch: o.pitch === undefined ? 0.62 : o.pitch, dist: o.dist || 66 }; const saveF = FINE; FINE = FINE2;
      const P = frameParams(g, gw, gh, cam, { n: (o.build === undefined ? 1 : o.build) * FINE2.rankMax, hour: o.hour || 14, sim, shadows: true, lens: null }); FINE = saveF; g.render(P);
      const bg = dayInfo(o.hour || 14); const gr = c.createLinearGradient(0, 0, 0, H2); gr.addColorStop(0, 'rgb(' + bg.cssTop.join(',') + ')'); gr.addColorStop(1, 'rgb(' + bg.cssBot.join(',') + ')'); c.fillStyle = gr; c.fillRect(0, 0, W2, H2); c.drawImage(SNAP.cvs, 0, 0, W2, H2);
      const hudO = { kp, labels: o.labels !== false && !!kp, sel: o.sel || 'Alle', dist: cam.dist, noClear: true }; drawHud(c, W2, H2, projector(P.vp, W2, H2), hudO); return kp;
    }
    const sb = sim ? (() => { const b = []; sim.emit((x, y, z, hx2, hy2, hz2, yaw, hex) => { const s = Math.abs(Math.sin(yaw)), cc = Math.abs(Math.cos(yaw)), w3 = 2 * (hx2 * cc + hy2 * s), d3 = 2 * (hx2 * s + hy2 * cc); b.push([x - w3 / 2, y - d3 / 2, z - hz2, w3, d3, 2 * hz2, hex]); }); return b.filter((q) => q[2] < 12); })() : null;
    render(c, W2, H2, { yaw: o.yaw === undefined ? -0.55 : o.yaw, zoom: o.zoom || 1, n: (o.build === undefined ? 1 : o.build) * MODEL.N, dur: 9, boxes: sb, sel: o.sel || 'Alle', kp, labels: o.labels !== false && !!kp }); return kp;
  }
  let FINE2 = null;
  window.__ah = { st, kpis, still: snap, snap, ZONES, ensure, model: () => ensure(), bricks: () => { ensure(); if (!FINE2) FINE2 = buildFine(MODEL, 2); return FINE2.count; }, newSim, glOk: () => !!GLR, makeGL, buildFine };
  window.__hodDraw.ah = () => { try { init(); if (!cv) return; ensure(); size(); ensureFine(GLR); refresh(); btns(); zoneBtns(); status2(); if (!st.playing && !st.built && !st.n) start(false); st.last = 0; loop(); } catch (e) { const q = $('ah-state'); if (q) q.textContent = 'Darstellungsfehler: ' + String(e && e.message || e).slice(0, 160); } };
})();
