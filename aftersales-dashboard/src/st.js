(function () {
  const H = window.__hod; if (!H) return;
  const FMT = H.FMT, $ = (id) => document.getElementById(id);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const N0 = NF(0), N1 = NF(1), sg = (v) => (v >= 0 ? '+' : '−');
  const rowsOf = (id) => { const d = dash.data(id); return d.status === 'ok' ? d.data : null; };
  const SC = { kons: ['Konservativ', 0.6], basis: ['Basis', 1], amb: ['Ambitioniert', 1.3] }, PROB = { niedrig: 0.9, mittel: 0.7, hoch: 0.5 };
  const S = { sc: 'basis' };
  $('st-sc').addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) { S.sc = b.dataset.s; drawSt(); } });
  function gather(rg) {
    const g = (id) => rowsOf(id); const ids = ['mo_monthly', 'pm_monthly', 'pr_monthly', 'iv_monthly', 'wa_monthly', 'lg_monthly', 'cu_monthly', 'co_monthly', 'vp_parc', 'mt_channel'];
    if (ids.some((i) => !g(i))) return null;
    const rm = (id) => g(id).filter((r) => r.region === rg && (r.dim == null || r.dim === 'Alle')).sort((a, b) => (a.month < b.month ? -1 : 1));
    const sum = (a, f) => d3.sum(a, (r) => r[f]), avg = (a, f) => d3.mean(a, (r) => r[f]);
    const mo = rm('mo_monthly'), pm = rm('pm_monthly'), pr = rm('pr_monthly'), iv = rm('iv_monthly'), wa = rm('wa_monthly'), lg = rm('lg_monthly'), cu = rm('cu_monthly'), co = rm('co_monthly'), ch = g('mt_channel').filter((r) => r.region === rg);
    const vp = g('vp_parc').filter((r) => r.region === rg && r.year === 2026), lastIv = iv[iv.length - 1], lastCu = cu[cu.length - 1];
    return { rev: sum(mo, 'revenue_k'), gm: avg(pm, 'gross_margin_pct'), disc: avg(pr, 'discount_pct'), stock: lastIv.stock_value_k, obs: lastIv.obsolete_risk_k, claimc: sum(wa, 'claim_cost_k'), recov: avg(wa, 'recovery_pct'), otif: avg(lg, 'otif_pct'),
      cust: lastCu.active_customers, clv: lastCu.clv_eur, churn: lastCu.churn_pct, win: avg(co, 'win_rate_pct'), parc: sum(vp, 'parc_k'), served: sum(vp, 'served_k'), unserved: sum(vp, 'unserved_k'), ch };
  }
  function levers(d, k) {
    const ret = d.served / d.parc * 100, low = d.ch.filter((c) => c.romi_pct < 200), hi = d.ch.filter((c) => c.romi_pct >= 400), wavg = (a, f, w) => d3.sum(a, (r) => r[f] * r[w]) / (d3.sum(a, (r) => r[w]) || 1);
    const mk = (id, short, name, bu, ist, ziel, val, assump, effort, months, risk, start) => ({ id, short, name, bu, ist, ziel, value: val * k, assump, effort, months, risk, start, adj: val * k * PROB[risk] });
    const L = [
      mk('disc', 'Rabatt', 'Rabattdisziplin', 'Pricing', N1.format(d.disc) + ' % Rabattquote', N1.format(d.disc - 1) + ' %', d.rev / (1 - d.disc / 100) * 0.01, 'Rabattquote −1,0 Pkt. auf den Bruttoumsatz; Freigabegrenzen und Rabattmatrix schärfen', 2, 3, 'mittel', 0),
      mk('mix', 'Margenmix', 'Sortimentsmix und Margenprogramm', 'Productmanagement', N1.format(d.gm) + ' % Rohertragsmarge', N1.format(d.gm + 0.5) + ' %', d.rev * 0.005, 'Rohertragsmarge +0,5 Pkt. durch Mix, Einkaufskonditionen und Sortimentsbereinigung', 3, 6, 'niedrig', 1),
      mk('ret', 'Retention', 'Retention +2 Pkt. (Servicepakete, Erinnerungen)', 'Workshop', N1.format(ret) + ' % Retention', N1.format(ret + 2) + ' %', d.rev * 2 / ret, 'Mehr betreute Fahrzeuge; Umsatz je betreutem Fahrzeug konstant', 3, 6, 'mittel', 1),
      mk('win', 'Rückgewinnung', 'Rückgewinnung unbetreuter Bestand (3 %)', 'Customer', N0.format(d.unserved) + ' Tsd. unbetreut', N0.format(d.unserved * 0.97) + ' Tsd.', d.rev * (d.unserved * 0.03) / d.served, 'Ansprache bei Halterwechsel, Flottenverträge und Altfahrzeug-Aktionen; 3 % des unbetreuten Bestands', 4, 9, 'hoch', 3),
      mk('inv', 'Lager', 'Lager- und Obsoleszenzabbau', 'Bestand', FMT.eur_k(d.stock) + ' Lagerwert', FMT.eur_k(d.stock * 0.9), d.stock * 0.1 * 0.08 + d.obs * 0.3, '−10 % Lagerwert bei 8 % Kapitalkosten plus 30 % des Obsoleszenzrisikos vermieden', 2, 4, 'niedrig', 0),
      mk('war', 'Regress', 'Lieferantenregress +10 Pkt. (Garantie)', 'Warranty', N1.format(d.recov) + ' % Regress', N1.format(d.recov + 10) + ' %', d.claimc * 0.1, 'Zusätzliche 10 % der Garantiekosten von Lieferanten zurückgeholt', 2, 4, 'niedrig', 0),
      mk('otif', 'OTIF', 'Lieferfähigkeit: OTIF +2 Pkt.', 'Logistik', N1.format(d.otif) + ' % OTIF', N1.format(d.otif + 2) + ' %', d.rev * 0.005, '25 % der nicht erfüllten Lieferungen führen zu verlorenem Umsatz (2 Pkt. × 25 %)', 3, 6, 'mittel', 2),
      mk('mkt', 'Marketing', 'Marketing-Budget umschichten', 'Marketing', N0.format(d3.sum(low, (c) => c.spend_k)) + ' k€ in Kanälen < 200 % ROMI', '30 % in Kanäle ≥ 400 % ROMI', low.length && hi.length ? d3.sum(low, (c) => c.spend_k) * 0.3 * (wavg(hi, 'romi_pct', 'spend_k') - wavg(low, 'romi_pct', 'spend_k')) / 100 : 0, 'Netto-Mehrertrag: 30 % der Ausgaben schwacher Kanäle wandern in starke Kanäle (ROMI-Differenz)', 2, 3, 'niedrig', 0),
      mk('churn', 'Abwanderung', 'Abwanderung −1 Pkt. (Customer)', 'Customer', N1.format(d.churn) + ' % Abwanderung', N1.format(d.churn - 1) + ' %', d.cust * 0.01 * d.clv / 8, '1 % der aktiven Kunden gehalten; Jahresdeckungsbeitrag = CLV ÷ 8 Jahre Bindung', 3, 12, 'mittel', 2),
      mk('winr', 'Win-Rate', 'Win-Rate +2 Pkt. (Angebotsgeschäft)', 'Competitor', N1.format(d.win) + ' % Win-Rate', N1.format(d.win + 2) + ' %', d.rev * 0.3 * 2 / d.win, '30 % des Umsatzes stammt aus Angebotsgeschäft; Win-Rate +2 Pkt.', 2, 6, 'niedrig', 1)];
    const vs = L.map((l) => l.adj).sort((a, b) => a - b), med = vs[Math.floor(vs.length / 2)];
    L.forEach((l) => { l.cls = l.effort <= 2 && l.adj >= med ? 'Quick Win' : l.adj >= med ? 'Strategischer Hebel' : l.effort <= 2 ? 'Zusatznutzen' : 'Beobachten'; });
    return L.sort((a, b) => b.adj - a.adj);
  }
  const CLS = { 'Quick Win': () => dash.colors[2] || '#2b9a66', 'Strategischer Hebel': () => dash.colors[0], Zusatznutzen: () => dash.colors[1], Beobachten: () => 'var(--cds-chart-muted, #9aa0a8)' };
  const mkSvg = (box, Hh) => { const w = box.clientWidth; if (!w) return null; box.replaceChildren(); const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${Hh}`); return { w, g: svg.append('g').style('font-size', 'var(--cds-font-size-caption)') }; };
  const addDays = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
  window.__stCalc = (rg, key) => { const d = gather(rg); if (!d) return null; const L = levers(d, SC[key || 'basis'][1]), gp = d.rev * d.gm / 100, sumAdj = d3.sum(L, (l) => l.adj), pot = sumAdj * 0.9; return { L, gp, pot, quick: d3.sum(L.filter((l) => l.cls === 'Quick Win'), (l) => l.adj), label: SC[key || 'basis'][0] }; };
  function drawSt() {
    const box = $('ch-st-wf'), mo = H.ready(box, 'mo_monthly'); if (!mo) return;
    $('st-sc').querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.s === S.sc)));
    const rg = H.REGSEL(), d = gather(rg); if (!d) return; const L = levers(d, SC[S.sc][1]);
    const gp = d.rev * d.gm / 100, sumAdj = d3.sum(L, (l) => l.adj), overlap = -sumAdj * 0.1, pot = sumAdj + overlap, quick = d3.sum(L.filter((l) => l.cls === 'Quick Win'), (l) => l.adj);
    // Kacheln
    const kp = $('st-kpi'); kp.replaceChildren();
    const tile = (l, v, s) => { const t = el('div', 'kt'); t.append(el('div', 'kl', l), el('div', 'kv', v), el('div', 'ks', s)); kp.append(t); };
    tile('Potenzial pro Jahr', FMT.eur_k(pot), 'risikoadjustiert · ' + SC[S.sc][0]); tile('Anteil am Rohertrag', N1.format(pot / gp * 100) + ' %', 'Rohertrag 12 Monate ' + FMT.eur_k(gp));
    tile('Quick Wins', FMT.eur_k(quick), L.filter((l) => l.cls === 'Quick Win').length + ' Hebel, Aufwand ≤ 2'); tile('Hebel gesamt', String(L.length), 'über alle Bereiche'); tile('Zeit bis Volleffekt', Math.max(...L.map((l) => l.start + l.months)) + ' Monate', 'inkl. Startversatz');
    // Wasserfall
    const topN = L.slice(0, 6), rest = L.slice(6), steps = [{ l: 'Rohertrag aktuell', v: gp, t: 1 }, ...topN.map((l) => ({ l: l.short, v: l.adj })), ...(rest.length ? [{ l: 'Weitere ' + rest.length, v: d3.sum(rest, (l) => l.adj) }] : []), { l: 'Abschlag −10 %', v: overlap }, { l: 'Rohertrag neu', v: gp + pot, t: 1 }];
    let run = 0; steps.forEach((s) => { if (s.t) { s.lo = 0; s.hi = s.v; run = s.v; } else { s.lo = Math.min(run, run + s.v); s.hi = Math.max(run, run + s.v); run += s.v; } });
    const c1 = mkSvg(box, 320); if (c1) { const { w, g } = c1, Hh = 320, MG = { t: 28, r: 14, b: 54, l: 62 }, lo = gp * 0.96, y = d3.scaleLinear([lo, d3.max(steps, (s) => s.hi) * 1.01], [Hh - MG.b, MG.t]), x = d3.scaleBand(steps.map((s) => s.l), [MG.l, w - MG.r]).padding(0.25);
      y.ticks(4).forEach((t) => { g.append('line').attr('x1', MG.l).attr('x2', w - MG.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', MG.l - 6).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').text(N0.format(t)); });
      g.append('text').attr('class', 'lgd').attr('x', 4).attr('y', 12).attr('fill', 'var(--color-fg-muted)').text('k€ pro Jahr · Achse gekürzt · grün = Hebel (risikoadjustiert) · rot = Abschlag');
      steps.forEach((s) => { const top = y(s.hi), bot = y(Math.max(s.lo, lo)); g.append('rect').attr('x', x(s.l)).attr('width', x.bandwidth()).attr('y', top).attr('height', Math.max(1, bot - top)).attr('rx', 3).attr('fill', s.t ? dash.colors[0] : s.v >= 0 ? dash.colors[2] || '#2b9a66' : H.CRIT).attr('fill-opacity', s.t ? 0.9 : 0.85)
          .on('mousemove', (ev) => H.showTip(ev, [H.line(s.l, 'tt'), H.line((s.t ? '' : sg(s.v)) + N0.format(Math.abs(s.v)) + ' k€')])).on('mouseleave', () => H.hideTip());
        g.append('text').attr('x', x(s.l) + x.bandwidth() / 2).attr('y', top - 4).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg)').text((s.t ? '' : sg(s.v)) + N0.format(Math.abs(s.v)));
        g.append('text').attr('x', x(s.l) + x.bandwidth() / 2).attr('y', Hh - 30).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(s.l); }); }
    // Priorisierungsmatrix
    const c2 = mkSvg($('ch-st-mx'), 330); if (c2) { const { w, g } = c2, Hh = 330, MG = { t: 24, r: 20, b: 40, l: 62 }, x = d3.scaleLinear([0.5, 5.5], [MG.l, w - MG.r]), y = d3.scaleLinear([0, d3.max(L, (l) => l.adj) * 1.2], [Hh - MG.b, MG.t]), med = d3.median(L, (l) => l.adj);
      [1, 2, 3, 4, 5].forEach((t) => { g.append('text').attr('x', x(t)).attr('y', Hh - 22).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text(t); });
      y.ticks(4).forEach((t) => { g.append('line').attr('x1', MG.l).attr('x2', w - MG.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', MG.l - 6).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').text(N0.format(t)); });
      g.append('line').attr('x1', x(2.5)).attr('x2', x(2.5)).attr('y1', MG.t).attr('y2', Hh - MG.b).attr('stroke', 'var(--cds-chart-reference)').attr('stroke-dasharray', '5 4'); g.append('line').attr('x1', MG.l).attr('x2', w - MG.r).attr('y1', y(med)).attr('y2', y(med)).attr('stroke', 'var(--cds-chart-reference)').attr('stroke-dasharray', '5 4');
      g.append('text').attr('class', 'lgd').attr('x', MG.l + 4).attr('y', 14).attr('fill', 'var(--color-fg-muted)').text('Y: Wertbeitrag k€ · X: Aufwand 1–5 · Blase: Dauer');
      const jit = {}; L.forEach((l) => { const k = l.effort; jit[k] = (jit[k] || 0) + 1; l.jx = (jit[k] - 1) * 0.28 - 0.28; });
      L.forEach((l) => { const cx = x(l.effort + l.jx), cy = y(l.adj); g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 6 + l.months * 1.1).attr('fill', CLS[l.cls]()).attr('fill-opacity', 0.55).attr('stroke', CLS[l.cls]()).on('mousemove', (ev) => H.showTip(ev, [H.line(l.name, 'tt'), H.line(N0.format(l.adj) + ' k€ risikoadjustiert · Aufwand ' + l.effort + ' · ' + l.months + ' Monate'), H.line(l.cls, 'tt')])).on('mouseleave', () => H.hideTip());
        g.append('text').attr('x', cx).attr('y', cy - 10 - l.months * 1.1).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg)').text(l.short); }); }
    // Roadmap
    const c3 = mkSvg($('ch-st-rm'), 40 + L.length * 26); if (c3) { const { w, g } = c3, RH = 26, T = 24, Lm = 150, R = 80, mx = Math.max(...L.map((l) => l.start + l.months)) + 1, x = d3.scaleLinear([0, mx], [Lm, w - R]), rows = L.slice().sort((a, b) => a.start - b.start || b.adj - a.adj);
      for (let m = 0; m <= mx; m += 3) { g.append('line').attr('x1', x(m)).attr('x2', x(m)).attr('y1', T - 6).attr('y2', T + rows.length * RH).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', x(m)).attr('y', 14).attr('text-anchor', 'middle').attr('fill', 'var(--color-fg-muted)').text('M' + m); }
      rows.forEach((l, i) => { const cy = T + i * RH + RH / 2; g.append('text').attr('x', Lm - 8).attr('y', cy).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').text(l.short);
        g.append('rect').attr('x', x(l.start)).attr('y', cy - 8).attr('width', Math.max(2, x(l.start + l.months) - x(l.start))).attr('height', 16).attr('rx', 4).attr('fill', CLS[l.cls]()).attr('fill-opacity', 0.85).on('mousemove', (ev) => H.showTip(ev, [H.line(l.name, 'tt'), H.line('Start M' + l.start + ' · Dauer ' + l.months + ' Monate · ' + l.risk + 'es Risiko'), H.line(N0.format(l.adj) + ' k€ pro Jahr', 'tt')])).on('mouseleave', () => H.hideTip());
        g.append('text').attr('x', x(l.start + l.months) + 6).attr('y', cy).attr('dy', '0.32em').attr('fill', 'var(--color-fg-muted)').text(N0.format(l.adj) + ' k€'); }); }
    // Tabelle
    const tb = $('tb-st').querySelector('tbody'); tb.replaceChildren();
    L.forEach((l) => { const tr = el('tr'), nt = el('td'); nt.append(el('span', 'neu', 'NEU')); tr.append(nt, el('td', null, l.name), el('td', 'mut', l.bu), el('td', null, l.ist + ' → ' + l.ziel), el('td', 'num', N0.format(l.value) + ' k€'), el('td', 'num', N0.format(l.adj) + ' k€'), el('td', 'num', '●'.repeat(l.effort) + '○'.repeat(5 - l.effort)), el('td', 'num', l.months + ' Mon.'), el('td', null, l.risk), el('td', null, l.cls));
      const ac = el('td'), b = el('button', 'addact', '+ Maßnahme'); b.type = 'button'; b.addEventListener('click', () => { if (window.__hodAct) window.__hodAct.open({ title: 'Strategiehebel: ' + l.name, bu: 'Übergreifend', ref: 'Strategie', impact: l.assump, impact_k: Math.round(l.adj), prio: l.cls === 'Quick Win' ? 'A' : l.cls === 'Strategischer Hebel' ? 'B' : 'C', due: addDays((l.start + l.months) * 30) }); }); ac.append(b); tr.append(ac); tb.append(tr); });
    // Executive Summary + Leitlinien
    $('st-sum').textContent = 'Über ' + L.length + ' Hebel entstehen ' + FMT.eur_k(pot) + ' pro Jahr (' + SC[S.sc][0] + ', risikoadjustiert, nach 10 % Überschneidungsabschlag) – das entspricht ' + N1.format(pot / gp * 100) + ' % des Rohertrags. Die ' + L.filter((l) => l.cls === 'Quick Win').length + ' Quick Wins liefern ' + FMT.eur_k(quick) + ' mit Aufwand ≤ 2; größter Einzelhebel ist „' + L[0].name + '" mit ' + FMT.eur_k(L[0].adj) + '.';
    const th = $('st-th'); th.replaceChildren();
    const lines = [['Marge vor Menge', 'Preisdurchsetzung und Sortimentsmix zuerst: Sie wirken direkt auf den Rohertrag, brauchen wenig Investition und tragen ' + FMT.eur_k(d3.sum(L.filter((l) => ['disc', 'mix'].includes(l.id)), (l) => l.adj)) + ' bei.'],
      ['Bindung vor Neukundengewinnung', 'Retention und Rückgewinnung des unbetreuten Bestands sichern den wiederkehrenden Werkstattumsatz (' + FMT.eur_k(d3.sum(L.filter((l) => ['ret', 'win', 'churn'].includes(l.id)), (l) => l.adj)) + ') – bei schrumpfendem Fahrzeugbestand der wichtigste strategische Hebel.'],
      ['Kapital und Komplexität senken', 'Lager-/Obsoleszenzabbau, Regress und Marketing-Umschichtung setzen ' + FMT.eur_k(d3.sum(L.filter((l) => ['inv', 'war', 'mkt'].includes(l.id)), (l) => l.adj)) + ' mit kurzer Laufzeit frei.'],
      ['Wettbewerbsposition datenbasiert verteidigen', 'Win-Rate und Lieferfähigkeit gezielt erhöhen (' + FMT.eur_k(d3.sum(L.filter((l) => ['winr', 'otif'].includes(l.id)), (l) => l.adj)) + '), Preisabstand und Verfügbarkeit im Competitor-Register monatlich nachhalten.']];
    lines.forEach(([t, x], i) => { const c = el('div', 'stth'); c.append(el('div', 'stn', String(i + 1)), el('div', null)); const b = c.lastChild; const h = el('div', 'stt'); h.append(t + ' ', el('span', 'neu', 'NEU')); b.append(h, el('div', 'sts', x)); th.append(c); });
    $('st-note').textContent = 'Annahmen: Wertbeiträge sind Modellrechnungen aus den Testdaten (letzte 12 Monate, ' + (rg === 'Alle' ? 'alle Regionen' : rg) + ', ohne Detailfilter); Realisierungswahrscheinlichkeit niedrig 90 %, mittel 70 %, hoch 50 %; Hebel überschneiden sich teilweise (−10 %). Kein Ersatz für eine belastbare Business-Case-Rechnung.';
  }
  window.__hodDraw.st = drawSt;
})();
