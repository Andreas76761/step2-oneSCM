(function () {
const CFG = {"bus": {"mo": {"monthly": "mo_monthly", "charts": [{"ds": "mo_monthly", "y": "revenue_k", "unit": "eur_k", "target": "target_k", "hib": 1, "cnt": 0, "type": "line", "el": "ch-mo-0", "sid": "mo_0", "lab": "Umsatz", "ok": "Wachstum in starken Regionen sichern und Aktionsbudget gezielt auf Händler mit Potenzial legen.", "miss": "Zielgap mit den Regionalleitern schließen: Top-Händler-Besuche, Cross-Selling-Aktionen und Reaktivierung inaktiver Händler priorisieren."}, {"ds": "mo_monthly", "y": "orders", "unit": "int", "target": 9000, "hib": 1, "cnt": 1, "type": "bars", "el": "ch-mo-1", "sid": "mo_1", "lab": "Aufträge", "ok": "Auftragsvolumen halten und den Anteil Online-Bestellungen weiter ausbauen.", "miss": "Auftragsrückgang analysieren (Händlerfrequenz, Verfügbarkeit) und Reaktivierungs- sowie Bündelangebote starten."}], "det": {"el": "ch-mo-d", "tb": "tb-mo", "ds": "mo_country", "cat": "country", "val": "revenue_k", "unit": "eur_k", "limit": null, "hib": 1, "allrows": true, "cols": [["country", "Land", null], ["revenue_k", "Umsatz", "eur_k"], ["target_k", "Ziel", "eur_k"], ["yoy_pct", "YoY", "pct"], ["dealers", "Händler", "int"]]}}, "pm": {"monthly": "pm_monthly", "charts": [{"ds": "pm_monthly", "y": "gross_margin_pct", "unit": "pct", "target": 38.0, "hib": 1, "cnt": 0, "type": "line", "el": "ch-pm-0", "sid": "pm_0", "lab": "Rohertragsmarge", "ok": "Margenniveau absichern und den Sortimentsmix weiter zu margenstarken Kategorien verschieben.", "miss": "Sortiment bereinigen, Einkaufskonditionen nachverhandeln und margenschwache Kategorien prüfen."}, {"ds": "pm_monthly", "y": "new_skus", "unit": "int", "target": 250, "hib": 1, "cnt": 1, "type": "bars", "el": "ch-pm-1", "sid": "pm_1", "lab": "Neue SKUs", "ok": "Listungspipeline halten; Fokus auf Fahrzeugabdeckung für Neufahrzeuge.", "miss": "Listungsprozess beschleunigen: Lieferantenfreigaben bündeln und Engpässe im Stammdatenteam beheben."}], "det": {"el": "ch-pm-d", "tb": "tb-pm", "ds": "pm_category", "cat": "category", "val": "margin_pct", "unit": "pct", "limit": 38.0, "hib": 1, "allrows": false, "cols": [["category", "Kategorie", null], ["revenue_k", "Umsatz", "eur_k"], ["margin_pct", "Marge", "pct"], ["obsolete_pct", "Ladenhüter", "pct"], ["stock_turns", "Umschlag", "n1"]]}}, "pr": {"monthly": "pr_monthly", "charts": [{"ds": "pr_monthly", "y": "discount_pct", "unit": "pct", "target": 12.0, "hib": 0, "cnt": 0, "type": "line", "el": "ch-pr-0", "sid": "pr_0", "lab": "Rabattquote", "ok": "Rabattdisziplin beibehalten und den Freigabe-Workflow weiter konsequent nutzen.", "miss": "Rabattfreigaben straffen, Ausnahmen je Kunde monatlich reviewen und das Staffelmodell überarbeiten."}, {"ds": "pr_monthly", "y": "price_index", "unit": "idx", "target": 102.0, "hib": 0, "cnt": 0, "type": "line", "el": "ch-pr-1", "sid": "pr_1", "lab": "Preisindex", "ok": "Wettbewerbsposition stabil – Preisspielräume bei margenstarken Teilen prüfen.", "miss": "Artikel über Marktniveau identifizieren und selektiv anpassen; Preiswahrnehmung bei Schlüsselteilen schützen."}], "det": {"el": "ch-pr-d", "tb": "tb-pr", "ds": "pr_category", "cat": "category", "val": "discount_pct", "unit": "pct", "limit": 12.0, "hib": 0, "allrows": false, "cols": [["category", "Kategorie", null], ["price_index", "Preisindex", "idx"], ["discount_pct", "Rabatt", "pct"], ["margin_pct", "Marge", "pct"], ["revenue_k", "Umsatz", "eur_k"]]}}, "lg": {"monthly": "lg_monthly", "charts": [{"ds": "lg_monthly", "y": "otif_pct", "unit": "pct", "target": 95.0, "hib": 1, "cnt": 0, "type": "line", "el": "ch-lg-0", "sid": "lg_0", "lab": "OTIF", "ok": "Servicegrad halten und Engpassteile weiter proaktiv absichern.", "miss": "Verspätungsursachen (Lieferanten, Kommissionierung, Carrier) analysieren und Sicherheitsbestände für A-Teile erhöhen."}, {"ds": "lg_monthly", "y": "backorder_pct", "unit": "pct", "target": 3.0, "hib": 0, "cnt": 0, "type": "bars", "el": "ch-lg-1", "sid": "lg_1", "lab": "Rückstandsquote", "ok": "Rückstände unter Kontrolle – Bestandsplanung beibehalten.", "miss": "Rückstandsliste täglich priorisieren, Lieferanten-Expedite starten und Alternativteile anbieten."}], "det": {"el": "ch-lg-d", "tb": "tb-lg", "ds": "lg_carrier", "cat": "carrier", "val": "on_time_pct", "unit": "pct", "limit": 95.0, "hib": 1, "allrows": false, "cols": [["carrier", "Carrier", null], ["shipments", "Sendungen", "int"], ["on_time_pct", "Pünktlich", "pct"], ["damage_pct", "Schaden", "pct2"], ["cost_per_shipment_eur", "€/Sendung", "eur"]]}}, "tr": {"monthly": "tr_monthly", "charts": [{"ds": "tr_monthly", "y": "participants", "unit": "int", "target": 280, "hib": 1, "cnt": 1, "type": "bars", "el": "ch-tr-0", "sid": "tr_0", "lab": "Teilnehmer", "ok": "Reichweite halten und Online-Formate für Händler mit weiter Anreise ausbauen.", "miss": "Termine früher kommunizieren, Händlerquoten nachfassen und Webinar-Alternativen anbieten."}, {"ds": "tr_monthly", "y": "satisfaction", "unit": "score", "target": 4.5, "hib": 1, "cnt": 0, "type": "line", "el": "ch-tr-1", "sid": "tr_1", "lab": "Zufriedenheit", "ok": "Qualität sichern und Trainer-Feedback in Kursupdates einarbeiten.", "miss": "Kursfeedback auswerten, schwach bewertete Module überarbeiten und Trainer-Coaching ansetzen."}], "det": {"el": "ch-tr-d", "tb": "tb-tr", "ds": "tr_course", "cat": "course", "val": "participants", "unit": "int", "limit": null, "hib": 1, "allrows": false, "cols": [["course", "Thema", null], ["participants", "Teilnehmer", "int"], ["completion_pct", "Abschluss", "pct"], ["score", "Bewertung", "score"], ["trainings", "Schulungen", "int"]]}}, "wa": {"monthly": "wa_monthly", "charts": [{"ds": "wa_monthly", "y": "claim_rate_pct", "unit": "pct2", "target": 1.2, "hib": 0, "cnt": 0, "type": "line", "el": "ch-wa-0", "sid": "wa_0", "lab": "Reklamationsquote", "ok": "Qualitätsniveau halten und Lieferantenaudits fortsetzen.", "miss": "Top-Fehlerursachen mit Lieferanten und Einkauf adressieren; Einbauhinweise und Teilequalität prüfen."}, {"ds": "wa_monthly", "y": "claim_cost_k", "unit": "eur_k", "target": 350, "hib": 0, "cnt": 1, "type": "bars", "el": "ch-wa-1", "sid": "wa_1", "lab": "Garantiekosten", "ok": "Kosten im Rahmen – Lieferantenregress konsequent weiterführen.", "miss": "Regressquote erhöhen, hochpreisige Fälle (Elektrik) priorisieren und Kulanzregeln schärfen."}], "det": {"el": "ch-wa-d", "tb": "tb-wa", "ds": "wa_cause", "cat": "cause", "val": "cost_k", "unit": "eur_k", "limit": null, "hib": 0, "allrows": false, "cols": [["cause", "Ursache", null], ["claims", "Fälle", "int"], ["cost_k", "Kosten", "eur_k"], ["approved_pct", "Anerkannt", "pct"], ["avg_cost_eur", "Ø Kosten", "eur0"]]}}, "cu": {"monthly": "cu_monthly", "charts": [{"ds": "cu_monthly", "y": "clv_eur", "unit": "eur0", "target": 2400, "hib": 1, "cnt": 0, "type": "line", "el": "ch-cu-0", "sid": "cu_0", "lab": "CLV", "ok": "CLV über Ziel – Bindungsprogramme für Top-Segmente (Flotten, Händler) weiter ausbauen.", "miss": "CLV unter Ziel: Servicepakete, Wartungsverträge und Cross-Selling für Bestandskunden verstärken; Abwanderung in schwachen Segmenten reduzieren."}, {"ds": "cu_monthly", "y": "csi_score", "unit": "idx", "target": 82.0, "hib": 1, "cnt": 0, "type": "line", "el": "ch-cu-1", "sid": "cu_1", "lab": "CSI", "ok": "Zufriedenheit auf Zielniveau – Feedback-Schleife und Servicequalität beibehalten.", "miss": "CSI unter Ziel: Beschwerdeursachen (Lieferzeit, Verfügbarkeit, Beratung) auswerten und Händler-Coaching ansetzen."}, {"ds": "cu_monthly", "y": "tco_eur", "unit": "eur0", "target": 1450, "hib": 0, "cnt": 0, "type": "line", "el": "ch-cu-2", "sid": "cu_2", "lab": "TCO", "ok": "TCO im Zielkorridor – als Vertriebsargument gegenüber Wettbewerb und Flotten nutzen.", "miss": "TCO zu hoch: Wartungsintervalle, Teilepreise und Ausfallzeiten prüfen; Service-Flatrates und Teilepakete für Flotten anbieten."}], "det": {"el": "ch-cu-d", "tb": "tb-cu", "ds": "cu_segment", "cat": "segment", "val": "csi_score", "unit": "idx", "limit": 82.0, "hib": 1, "allrows": false, "cols": [["segment", "Segment", null], ["customers_k", "Kunden (Tsd.)", "int"], ["clv_eur", "CLV", "eur0"], ["csi_score", "CSI", "idx"], ["tco_eur", "TCO", "eur0"], ["churn_pct", "Abwanderung", "pct"]]}}, "co": {"monthly": "co_monthly", "charts": [{"ds": "co_monthly", "y": "rel_share_idx", "unit": "score", "target": 0.95, "hib": 1, "cnt": 0, "type": "line", "el": "ch-co-0", "sid": "co_0", "lab": "Relativer Marktanteil", "ok": "Position gegenüber dem stärksten Wettbewerber gefestigt – Anteilsgewinne in schwächeren Regionen ausbauen.", "miss": "Abstand zum Wettbewerb schließen: Sortiment, Verfügbarkeit und Aktionen in Regionen mit Rückstand gezielt stärken."}, {"ds": "co_monthly", "y": "price_gap_pct", "unit": "pct", "target": 2.0, "hib": 0, "cnt": 0, "type": "line", "el": "ch-co-1", "sid": "co_1", "lab": "Preisabstand", "ok": "Preisabstand im Rahmen – Preisspielräume bei margenstarken Teilen prüfen.", "miss": "Preisabstand zu hoch: Preise bei vergleichsintensiven Artikeln anpassen und Wertargumente (Qualität, Verfügbarkeit) kommunizieren."}], "det": {"el": "ch-co-d", "tb": "tb-co", "ds": "co_competitor", "cat": "competitor", "val": "threat_score", "unit": "score", "limit": 3.5, "hib": 0, "allrows": false, "cols": [["competitor", "Wettbewerber", null], ["market_share_pct", "Marktanteil", "pct"], ["price_index", "Preisindex (Eigen = 100)", "idx"], ["growth_pct", "Wachstum", "pct"], ["threat_score", "Bedrohung", "score"]]}}, "mt": {"monthly": "mt_monthly", "charts": [{"ds": "mt_monthly", "y": "marketing_roi", "unit": "pct", "target": 300.0, "hib": 1, "cnt": 0, "type": "line", "el": "ch-mt-0", "sid": "mt_0", "lab": "Marketing-ROI", "ok": "ROMI auf Zielniveau – Budget zu den ertragsstärksten Kanälen verschieben.", "miss": "ROMI unter Ziel: Kanäle mit schwachem Ertrag pausieren, Budget auf Newsletter und Händlerportal verlagern und Zielgruppen schärfen."}, {"ds": "mt_monthly", "y": "leads", "unit": "int", "target": 15000, "hib": 1, "cnt": 1, "type": "bars", "el": "ch-mt-1", "sid": "mt_1", "lab": "Leads", "ok": "Lead-Volumen im Ziel – Conversion im Vertrieb weiter verbessern.", "miss": "Lead-Ziel verfehlt: Aktionskalender und Kanalmix prüfen, Online-Anteil erhöhen und Händlerkampagnen vorziehen."}], "det": {"el": "ch-mt-d", "tb": "tb-mt", "ds": "mt_channel", "cat": "channel", "val": "romi_pct", "unit": "pct", "limit": 200.0, "hib": 1, "allrows": false, "cols": [["channel", "Kanal", null], ["spend_k", "Ausgaben", "eur_k"], ["leads", "Leads", "int"], ["conv_pct", "Conversion", "pct"], ["romi_pct", "ROMI", "pct"], ["cac_eur", "CAC", "eur0"]]}}}, "ivmk": {"iv": {"charts": [{"el": "ch-iv-0", "ds": "iv_monthly", "y": "stock_value_k", "unit": "eur_k", "target": "target_stock_k", "hib": 0, "type": "line"}, {"el": "ch-iv-1", "ds": "iv_monthly", "y": "service_level_pct", "unit": "pct", "target": 97, "hib": 1, "type": "line"}]}, "mk": {"charts": [{"el": "ch-mk-0", "ds": "mk_monthly", "y": "market_share_pct", "unit": "pct", "target": 18, "hib": 1, "type": "line"}, {"el": "ch-mk-1", "ds": "mk_monthly", "y": "price_gap_pct", "unit": "pct", "target": 2, "hib": 0, "type": "line"}]}}};
const SH = {"Alle": 1, "DACH": 0.34, "Westeuropa": 0.27, "Südeuropa": 0.16, "Nordeuropa": 0.08, "Osteuropa": 0.15}, MS = {"Alle": 1, "A0 Basis": 0.06, "K1 Benzin": 0.12, "K1 Diesel": 0.1, "L2 Diesel": 0.08, "C4 Diesel": 0.08, "O3 Hybrid": 0.03, "S3 Benzin": 0.1, "S3 Diesel": 0.1, "S4 Hybrid": 0.07, "T5 Diesel": 0.12, "E6 Elektro": 0.08, "E7 Elektro": 0.06, "0-2 J": 0.2, "3-5 J": 0.26, "6-8 J": 0.22, "9-12 J": 0.19, "13+ J": 0.13, "Bremse": 0.119, "Filter": 0.081, "Reifen & Räder": 0.1333, "Zündung & Glühen": 0.0429, "Batterie & Starter": 0.0619, "Fahrwerk & Stoßdämpfer": 0.081, "Auspuff & Abgas": 0.0429, "Klima & Kühlung": 0.0476, "Öle & Flüssigkeiten": 0.0571, "Wischer & Sicht": 0.0286, "Beleuchtung": 0.0381, "Elektrik & Sensorik": 0.0429, "Antrieb & Getriebe": 0.0524, "Kupplung": 0.0238, "Lenkung": 0.0333, "Karosserie & Anbau": 0.0238, "Riemen & Steuerung": 0.0286, "Dichtungen & Motorteile": 0.0238, "Zubehör & Pflege": 0.0238, "Innenraum & Komfort": 0.0143};

const root = document.getElementById('dash-root');
const NF = (d) => new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const n0 = NF(0), n1 = NF(1), n2 = NF(2);
const FMT = { eur_k: (v) => n0.format(v) + ' k€', pct: (v) => n1.format(v) + ' %', pct2: (v) => n2.format(v) + ' %',
  int: (v) => n0.format(v), days: (v) => n1.format(v) + ' Tage', eur: (v) => n2.format(v) + ' €', eur0: (v) => n0.format(v) + ' €',
  score: (v) => n2.format(v), idx: (v) => n1.format(v), n1: (v) => n1.format(v) };
const MON = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
const mlabel = (m) => MON[+m.slice(5, 7) - 1] + ' ' + m.slice(2, 4);
const TABS = ['head', 'net', 'ws', 'mo', 'pm', 'pr', 'mk', 'lg', 'iv', 'tr', 'wa', 'cu', 'co', 'mt', 'dl', 'dt', 'mg', 'fc', 'vp', 'pf', 'pl', 'an', 'hy', 'vid', 'ah', 'st', 'al', 'ma', 'ide', 'tv', 'er', 'qg', 'lx', 'el', 'sim', 'gl', 'da', 'imp', 'exp', 'bk', 'dc'];
const ALIAS = { pa: 'an' };
let cur = TABS.includes(ALIAS[location.hash.slice(1)] || location.hash.slice(1)) ? (ALIAS[location.hash.slice(1)] || location.hash.slice(1)) : 'head';
const tip = document.getElementById('tip');
const MUTED = 'var(--color-fg-muted)', CRIT = 'var(--cds-chart-status-critical)';

// Popovers: bleiben am Mauszeiger und immer im sichtbaren Bereich (auch bei Rahmen mit Transform oder höherem Inhalt als Fenster)
const GRID = 12, vcells = new Set(), vhost = document.createElement('div');
vhost.style.cssText = 'position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;visibility:hidden;z-index:-1';
try {
  const io = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting && e.intersectionRatio >= 0.5) vcells.add(e.target); else vcells.delete(e.target); }); }, { threshold: [0, 0.5, 1] });
  for (let r = 0; r < GRID; r++) for (let c = 0; c < GRID; c++) { const d = document.createElement('div'); d.style.cssText = 'position:absolute;left:' + (c * 100 / GRID) + '%;top:' + (r * 100 / GRID) + '%;width:' + (100 / GRID) + '%;height:' + (100 / GRID) + '%'; d.__rc = [r, c]; vhost.append(d); io.observe(d); }
  document.body.append(vhost);
} catch (e) { vcells.clear(); }
// sichtbarer Bereich des Fensters (z. B. wenn der Rahmen höher ist als der sichtbare Ausschnitt der Seite)
const visibleRect = () => {
  const vw = window.innerWidth, vh = window.innerHeight; if (!vcells.size || vcells.size === GRID * GRID) return { left: 0, top: 0, right: vw, bottom: vh };
  let r0 = GRID, r1 = -1, c0 = GRID, c1 = -1; vcells.forEach((d) => { const [r, c] = d.__rc; r0 = Math.min(r0, r); r1 = Math.max(r1, r); c0 = Math.min(c0, c); c1 = Math.max(c1, c); });
  return { left: c0 * vw / GRID, top: r0 * vh / GRID, right: (c1 + 1) * vw / GRID, bottom: (r1 + 1) * vh / GRID };
};
function putAt(el, x, y) { el.style.left = '0px'; el.style.top = '0px'; const r0 = el.getBoundingClientRect(); el.style.left = (x - r0.left) + 'px'; el.style.top = (y - r0.top) + 'px'; }
function placePop(pop, ev, off) {
  off = off == null ? 16 : off; const v = visibleRect(); pop.style.transform = ''; pop.style.transformOrigin = '0 0'; pop.style.left = '0px'; pop.style.top = '0px';
  const w = pop.offsetWidth, h = pop.offsetHeight, availH = v.bottom - v.top - 16, sc = h > availH && availH > 80 ? availH / h : 1, W = w * sc, Hh = h * sc;
  let x = ev.clientX + off; if (x + W > v.right - 8) x = ev.clientX - W - off; x = Math.max(v.left + 8, Math.min(x, v.right - W - 8));
  let y = ev.clientY - 20; y = Math.max(v.top + 8, Math.min(y, v.bottom - Hh - 8));
  putAt(pop, x, y); if (sc < 1) pop.style.transform = 'scale(' + sc.toFixed(3) + ')';
}
window.__place = placePop;
function showTip(ev, html) {
  tip.hidden = false; tip.replaceChildren(...html);
  const w = tip.offsetWidth, h = tip.offsetHeight, v = visibleRect();
  let x = ev.clientX - w / 2, y = ev.clientY - h - 14; if (y < v.top + 4) y = ev.clientY + 18;
  x = Math.max(v.left + 4, Math.min(x, v.right - w - 4)); y = Math.max(v.top + 4, Math.min(y, v.bottom - h - 4)); putAt(tip, x, y);
}
const hideTip = () => { tip.hidden = true; };
const gpShow = (ev, name) => { if (!window.__groupPop) return false; window.__groupPop.show(ev, name); return true; };
const line = (txt, cls) => { const d = document.createElement('div'); if (cls) d.className = cls; d.textContent = txt; return d; };

let lastMonth = null, firstMonth = null;
const sel = document.getElementById('month-sel');
const M = () => dash.params().month || lastMonth;
const PT = () => dash.params().pt || 'm';
const ymOf = (m) => [+m.slice(0, 4), +m.slice(5, 7)];
const addM = (m, k) => { const [y, mm] = ymOf(m), t = y * 12 + mm - 1 + k; return Math.floor(t / 12) + '-' + String(t % 12 + 1).padStart(2, '0'); };
function periodMonths(m, pt) {
  m = m || M(); pt = pt || PT(); const [y, mm] = ymOf(m);
  if (pt === 'q') { const s = Math.floor((mm - 1) / 3) * 3 + 1; return [0, 1, 2].map((i) => y + '-' + String(s + i).padStart(2, '0')); }
  if (pt === 'y') return Array.from({ length: 12 }, (_, i) => y + '-' + String(i + 1).padStart(2, '0')).filter((x) => x <= m);
  if (pt === 'r') return Array.from({ length: 12 }, (_, i) => addM(m, i - 11));
  return [m];
}
const prevPeriodMonths = (ms) => ms.map((x) => addM(x, -ms.length));
const SUMKPI = new Set(['revenue_k', 'orders', 'new_skus', 'price_changes', 'trainings', 'participants', 'claims', 'claim_cost_k', 'leads', 'budget_k', 'reach_k', 'competitor_promos']);
// Periodenwert: Summen für Mengen- und Umsatzgrößen, sonst Mittelwert; Δ gegenüber der vorherigen gleich langen Periode (je Monat verglichen)
function aggRow(rows, ms, pms) {
  const a = rows.filter((r) => ms.includes(r.month)), b = rows.filter((r) => pms.includes(r.month)); if (!a.length) return null;
  const base = a[a.length - 1], sum = SUMKPI.has(base.kpi), ag = (x, f) => (sum ? d3.sum(x, (r) => r[f]) : d3.mean(x, (r) => r[f]));
  const value = ag(a, 'value'), tg = a.filter((r) => r.target != null), target = tg.length ? ag(tg, 'target') : null, prev = b.length ? ag(b, 'value') : null;
  let delta = 0; if (prev != null) { const x = sum ? value / a.length : value, y = sum ? prev / b.length : prev; delta = base.dk === 'pp' ? x - y : (y ? (x / y - 1) * 100 : 0); }
  const ok = target == null ? null : base.hib ? value >= target : value <= target;
  return Object.assign({}, base, { value, prev, target, delta, ok, status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel', n: a.length });
}
const quarterOf = (m) => ymOf(m)[0] + '-Q' + (Math.floor((ymOf(m)[1] - 1) / 3) + 1);
const ptSeg = document.getElementById('pt-seg');
const regSel = document.getElementById('region-sel');
const dimSels = [['bm', 'Baumuster', document.getElementById('bm-sel')], ['alt', 'Alter', document.getElementById('alt-sel')], ['pg', 'Produktgruppe', document.getElementById('pg-sel')]];
dimSels.forEach(([key, , s]) => s.addEventListener('change', () => dash.setParams({ [key]: s.value || null })));
function fillDims() {
  const d = dash.data('mo_monthly'); if (d.status !== 'ok') return;
  dimSels.forEach(([key, dim, s]) => {
    if (document.activeElement === s) return;
    const mem = [...new Set(d.data.filter((r) => r.dim === dim).map((r) => r.member))];
    s.replaceChildren(new Option('Alle ' + (dim === 'Alter' ? 'Altersklassen' : dim === 'Baumuster' ? 'Baumuster' : 'Produktgruppen'), ''), ...mem.map((m) => new Option(m, m)));
    s.value = dash.params()[key] || '';
  });
}
const REGSEL = () => dash.params().region || 'Alle';
const CSEL = () => dash.params().country || '';
const SCOPE = () => CSEL() || REGSEL();
const COUNTCOLS = {"mo_monthly": ["revenue_k", "target_k", "orders", "active_dealers"], "pm_monthly": ["active_skus", "new_skus"], "pr_monthly": ["price_changes"], "lg_monthly": [], "tr_monthly": ["trainings", "participants"], "wa_monthly": ["claims", "claim_cost_k"], "cu_monthly": ["active_customers"], "co_monthly": ["competitor_promos"], "mt_monthly": ["leads", "budget_k", "budget_plan_k", "reach_k"]};
const REGS = Object.keys(SH);
const DA = () => { const p = dash.params(); return [['Baumuster', p.bm], ['Alter', p.alt], ['Produktgruppe', p.pg]].filter((x) => x[1]); };
const COMBO = () => DA().length >= 2;
const DS = () => { const a = DA(); return a.length === 1 ? { dim: a[0][0], member: a[0][1] } : a.length ? { dim: '*', member: '*' } : { dim: 'Alle', member: 'Alle' }; };
const MSP = () => DA().reduce((p, [, m]) => p * MS[m], 1);
const VSET = new Set([...Object.keys(CFG.bus).flatMap((b) => ['kpi_' + b, 'ins_' + b]), 'head_kpis', 'head_bu', 'head_summary', 'ins_head']);
const VC = new Map();
function comboRows(id, raw) {
  const act = DA(), cc = COUNTCOLS[id], idx = new Map();
  for (const r of raw) { const k = r.region + '|' + r.month; let m = idx.get(k); if (!m) idx.set(k, m = new Map()); m.set(r.dim + '|' + r.member, r); }
  const out = [];
  for (const m of idx.values()) {
    const b = m.get('Alle|Alle'); if (!b) continue;
    const rs = act.map(([d, mem]) => m.get(d + '|' + mem)); if (rs.some((x) => !x)) continue;
    const row = { region: b.region, month: b.month, dim: '*', member: '*' };
    for (const f of Object.keys(b)) {
      if (['region', 'month', 'dim', 'member'].includes(f)) continue;
      row[f] = cc.includes(f) ? rs.reduce((p, r) => p * (b[f] ? r[f] / b[f] : 0), b[f]) : rs.reduce((s, r) => s + r[f] - b[f], b[f]);
    }
    if (row.orders && row.revenue_k != null) row.aov_eur = row.revenue_k * 1000 / row.orders;
    out.push(row);
  }
  return out;
}
function deriveKpi(rows) {
  const act = DA(), idx = new Map();
  for (const r of rows) { const k = [r.region, r.month, r.bu || '', r.kpi].join('|'); let m = idx.get(k); if (!m) idx.set(k, m = new Map()); m.set(r.dim + '|' + r.member, r); }
  const out = [];
  for (const m of idx.values()) {
    const b = m.get('Alle|Alle'); if (!b) continue;
    const rs = act.map(([d, mem]) => m.get(d + '|' + mem)); if (rs.some((x) => !x)) continue;
    const cnt = b.unit === 'int' || b.unit === 'eur_k', pp = b.unit === 'pct';
    const comb = (f) => { const v0 = b[f]; if (v0 == null) return null; return cnt ? rs.reduce((p, r) => p * (v0 ? r[f] / v0 : 0), v0) : rs.reduce((s, r) => s + r[f] - v0, v0); };
    const value = comb('value'), prev = comb('prev'), target = comb('target');
    const ok = target == null ? null : b.hib ? value >= target : value <= target;
    const row = Object.assign({}, b, { dim: '*', member: '*', value, prev, target, ok, delta: pp ? value - prev : (value / prev - 1) * 100, status: ok == null ? '–' : ok ? 'Ziel erreicht' : 'Unter Ziel' });
    if (b.id) row.id = [b.region, '*', b.month, b.bu, b.kpi].join('|');
    out.push(row);
  }
  return out;
}
function buFrom(hk) {
  const m = new Map();
  for (const r of hk) { const k = [r.region, r.month, r.bu].join('|'), g = m.get(k) || { region: r.region, dim: '*', member: '*', month: r.month, bu: r.bu, bu_label: r.bu_label, total: 0, ok_n: 0 }; g.total += 1; if (r.ok) g.ok_n += 1; m.set(k, g); }
  return [...m.values()].map((g) => Object.assign(g, { ok_pct: Math.round(g.ok_n / g.total * 100) }));
}
function sumFrom(hk) {
  const m = new Map();
  for (const r of hk) { const k = r.region + '|' + r.month, g = m.get(k) || { region: r.region, dim: '*', member: '*', month: r.month, off: 0, total: 0 }; g.total += 1; if (r.ok === false) g.off += 1; m.set(k, g); }
  return [...m.values()];
}
const trendTxt = (ok, better, S) => (ok ? (better ? S.ok : 'Trend dreht – frühzeitig gegensteuern. ' + S.ok) : (better ? S.miss + ' Trend verbessert sich – Maßnahmen fortführen.' : 'Handlungsbedarf: ' + S.miss));
function genIns(bu) {
  const c = CFG.bus[bu], raw = dash.data(c.monthly), ins = dash.data('ins_' + bu); if (raw.status !== 'ok' || ins.status !== 'ok') return null;
  const comb = comboRows(c.monthly, raw.data), out = ins.data.filter((r) => r.month === 'all' && r.dim === 'Alle').map((r) => Object.assign({}, r, { dim: '*', member: '*' }));
  for (const region of REGS) {
    const mon = comb.filter((r) => r.region === region);
    for (let i = 1; i < mon.length; i++) for (const s of c.charts) {
      const v = mon[i][s.y], p = mon[i - 1][s.y], b3 = mon[Math.max(0, i - 3)][s.y], f = FMT[s.unit];
      const t = typeof s.target === 'string' ? mon[i][s.target] : s.target * (s.cnt ? SH[region] * MSP() : 1);
      const ok = s.hib ? v >= t : v <= t, better = s.hib ? v >= b3 : v <= b3, d = (v / p - 1) * 100;
      out.push({ id: s.sid, region, dim: '*', member: '*', month: mon[i].month, ok,
        summary: s.lab + ': ' + f(v) + ' (' + (d >= 0 ? '+' : '−') + n1.format(Math.abs(d)) + ' % ggü. Vormonat), Ziel ' + f(t) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.',
        rec: trendTxt(ok, better, s) });
    }
  }
  return out;
}
function genInsHead() {
  const hk = dash.data('head_kpis'), raw = dash.data('mo_monthly'); if (hk.status !== 'ok' || raw.status !== 'ok') return null;
  const bu = buFrom(virtRows('head_kpis', hk.data)), out = [], months = [...new Set(bu.map((g) => g.month))];
  for (const region of REGS) {
    for (const month of months) {
      const g = bu.filter((x) => x.region === region && x.month === month), low = g.filter((x) => x.ok_pct < 50), full = g.filter((x) => x.ok_pct === 100);
      out.push({ id: 'head_bu', region, dim: '*', member: '*', month, ok: low.length === 0,
        summary: full.length + ' von ' + g.length + ' Bereichen erreichen alle Kern-KPIs' + (low.length ? '; unter 50 % Zielerreichung: ' + low.map((x) => x.bu_label).join(', ') : '; kein Bereich unter 50 %') + '.',
        rec: low.length ? 'Fokus-Review mit ' + low.map((x) => x.bu_label).join(' und ') + ': Ursachen klären und Maßnahmenplan innerhalb von zwei Wochen vereinbaren.' : 'Kein kritischer Bereich – Fokus auf Wachstum und Effizienz, Bereiche mit offenen KPIs im Monatsreview nachfassen.' });
    }
    const mo = comboRows('mo_monthly', raw.data).filter((r) => r.region === region);
    for (let i = 1; i < mo.length; i++) {
      const a = mo[i], p = mo[i - 1], b3 = mo[Math.max(0, i - 3)], ok = a.revenue_k >= a.target_k, better = a.revenue_k >= b3.revenue_k, d = (a.revenue_k / p.revenue_k - 1) * 100;
      out.push({ id: 'head_rev', region, dim: '*', member: '*', month: a.month, ok,
        summary: 'Umsatz ' + FMT.eur_k(a.revenue_k) + ' (' + (d >= 0 ? '+' : '−') + n1.format(Math.abs(d)) + ' % ggü. Vormonat), Ziel ' + FMT.eur_k(a.target_k) + (ok ? ' erreicht' : ' verfehlt') + '; 3-Monats-Trend ' + (better ? 'positiv' : 'negativ') + '.',
        rec: ok ? 'Momentum nutzen: Wachstumsinitiativen in den stärksten Regionen ausbauen.' : 'Lücke zum Ziel in der Market Operation priorisieren: Länder unter Plan, Händlerreaktivierung und Aktionen im Folgemonat.' });
    }
  }
  return out;
}
function virtRows(id, data) {
  if (!COMBO() || !(VSET.has(id) || COUNTCOLS[id])) return null;
  const sig = DA().map((x) => x.join(':')).join('|'), c = VC.get(id);
  if (c && c.sig === sig && c.src === data) return c.rows;
  let rows = null;
  if (id.startsWith('kpi_') || id === 'head_kpis') rows = deriveKpi(data);
  else if (id === 'head_bu' || id === 'head_summary') { const hk = dash.data('head_kpis'); const v = hk.status === 'ok' ? virtRows('head_kpis', hk.data) : null; rows = v ? (id === 'head_bu' ? buFrom(v) : sumFrom(v)) : null; }
  else if (id === 'ins_head') rows = genInsHead();
  else if (id.startsWith('ins_') && CFG.bus[id.slice(4)]) rows = genIns(id.slice(4));
  else if (COUNTCOLS[id]) rows = comboRows(id, data);
  VC.set(id, { sig, src: data, rows }); return rows;
}
function markState(el) {
  const src = el.dataset.source || el.dataset.osrc, virt = (COMBO() && VSET.has(src)) || (PT() !== 'm' && el.classList.contains('kmark') && (src.startsWith('kpi_') || src === 'head_kpis') && !el.dataset.all);
  if (virt) { if (!el.dataset.osrc) { el.dataset.osrc = src; el.removeAttribute('data-source'); } }
  else if (el.dataset.osrc) { el.dataset.source = el.dataset.osrc; delete el.dataset.osrc; }
  return src;
}
const WSX = () => { const p = dash.params(), seg = p.segment || 'Alle', ser = p.series || '', part = p.part || 'total', metric = p.wkpi || 'retention_pct'; return { kpi: metric === 'penetration' ? 'pen_' + part : metric, metric, part, pen: 'pen_' + part, segment: seg, sel: ser, series: ser || (seg !== 'Alle' ? seg : 'Alle'), age: p.age || 'Alle', abck: p.abcm || 'service_level_pct' }; };
const cSel = document.getElementById('country-sel');
function rowFor(el, src) {
  const d0 = dash.data(src); let m = M(); if ((src === 'fc_kpi' || src === 'ins_fc') && m && m < '2026-01') m = '2026-01';
  if (d0.status !== 'ok' || !m) return null;
  const d = { data: virtRows(src, d0.data) || d0.data };
  const dyn = el.dataset.dyn ? el.dataset.dyn.split(',') : [], wsx = WSX();
  const pairs = (el.dataset.base ? el.dataset.base.split('&') : []).map((p) => p.split('=')).map(([k, v]) => (k === 'scope' ? [k, SCOPE()] : k === 'region' ? [k, REGSEL()] : k === 'dim' ? [k, DS().dim] : k === 'member' ? [k, DS().member] : k === 'kpi' && dyn.includes('pen') ? [k, wsx.pen] : k === 'kpi' && dyn.includes('abck') ? [k, wsx.abck] : dyn.includes(k) ? [k, wsx[k]] : [k, v]));
  const per = PT();
  if (!el.dataset.all && per !== 'm' && el.classList.contains('kmark') && (src.startsWith('kpi_') || src === 'head_kpis')) {
    const ms = periodMonths(m, per), need = new Set([...ms, ...prevPeriodMonths(ms)]), ag = aggRow(d.data.filter((x) => need.has(x.month) && pairs.every(([k, v]) => String(x[k]) === v)), ms, prevPeriodMonths(ms));
    if (ag) { el.dataset.where = pairs.concat([['month', m]]).map((q) => q.join('=')).join('&'); return ag; }
  }
  if (!el.dataset.all) pairs.push(['month', m]);
  el.dataset.where = pairs.map((p) => p.join('=')).join('&');
  return d.data.find((x) => pairs.every(([k, v]) => String(x[k]) === v)) || null;
}
function headPeriodSummary() {
  const d = dash.data('head_kpis'); if (d.status !== 'ok') return null; const m = M(), ms = periodMonths(m), pms = prevPeriodMonths(ms), need = new Set([...ms, ...pms]), ds = DS(), rg = REGSEL(), by = new Map();
  (virtRows('head_kpis', d.data) || d.data).forEach((r) => { if (r.region === rg && r.dim === ds.dim && r.member === ds.member && need.has(r.month)) { const k = r.bu + '|' + r.kpi; if (!by.has(k)) by.set(k, []); by.get(k).push(r); } });
  let total = 0, off = 0; by.forEach((rows) => { const a = aggRow(rows, ms, pms); if (a) { total += 1; if (a.ok === false) off += 1; } }); return { total, off };
}
function fillMarks() {
  const mo = dash.data('mo_monthly');
  if (mo.status === 'ok' && mo.data.length) {
    const months = [...new Set(mo.data.map((r) => r.month))].sort();
    firstMonth = months[0]; lastMonth = months[months.length - 1];
    if (document.activeElement !== sel) {
      const ks = months.slice(1), per = PT(), opts = [], grp = (kf) => { const g = new Map(); ks.forEach((m) => { const k = kf(m); if (!g.has(k)) g.set(k, []); g.get(k).push(m); }); return g; };
      if (per === 'q') grp(quarterOf).forEach((ms, k) => { const [y, q] = k.split('-Q'); opts.push(new Option('Q' + q + ' ' + y + (ms.length < 3 ? ' (' + ms.length + ' von 3 Monaten)' : ''), 'q:' + ms[ms.length - 1])); });
      else if (per === 'y' || per === 'r') { grp((m) => m.slice(0, 4)).forEach((ms, y) => opts.push(new Option(y + (ms.length < 12 ? (ms[ms.length - 1] === lastMonth ? ' (bis ' + MON[+lastMonth.slice(5, 7) - 1] + ', ' + ms.length + ' Monate)' : ' (' + ms.length + ' Monate)') : ''), 'y:' + ms[ms.length - 1]))); opts.push(new Option('Letzte 12 Monate', 'r:' + lastMonth)); }
      else months.slice(1).forEach((m) => opts.push(new Option(MON[+m.slice(5, 7) - 1] + ' ' + m.slice(0, 4), m)));
      sel.replaceChildren(...opts); sel.value = per === 'm' ? M() : per + ':' + M();
    }
    ptSeg.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === (PT() === 'r' ? 'y' : PT()))));
    const pn = document.getElementById('per-note'), pr = PT();
    if (pn) { pn.hidden = pr === 'm'; if (pr !== 'm') { const pm = periodMonths(); pn.textContent = 'Zeitraum ' + (pr === 'q' ? 'Quartal' : pr === 'r' ? 'Letzte 12 Monate' : 'Jahr') + ': ' + mlabel(pm[0]) + ' bis ' + mlabel(pm[pm.length - 1]) + ' · Kennzahl-Kacheln = Summe bzw. Ø der Monate, Δ gegenüber der vorherigen gleich langen Periode · Grafiken zeigen den Verlauf bis Periodenende, der Zeitraum ist hinterlegt · Zusammenfassungen und Empfehlungen beziehen sich auf den letzten Monat.' + (pm.filter((x) => x >= months[1]).length < pm.length ? ' · Datenbasis: ' + pm.filter((x) => x >= months[1]).length + ' von ' + pm.length + ' Monaten (Vormonatsvergleich erst ab ' + mlabel(months[1]) + ').' : ''); } }
  }
  root.querySelectorAll('.kmark').forEach((el) => {
    const r = rowFor(el, markState(el));
    if (!r) { el.textContent = '—'; return; }
    const f = el.dataset.field;
    if (f === 'value') {
      el.textContent = FMT[r.unit](r.value);
      const c = el.closest('.kpi'); if (c) c.dataset.ok = String(r.ok);
    } else if (f === 'target') el.textContent = r.target == null ? '–' : FMT[r.unit](r.target);
    else if (f === 'delta') {
      el.textContent = (r.delta >= 0 ? '+' : '−') + n1.format(Math.abs(r.delta)) + (r.dk === 'pp' ? ' Pkt.' : ' %');
      el.className = 'kmark ' + deltaCls(r);
    }
  });
  root.querySelectorAll('.smark').forEach((el) => {
    const src = el.dataset.source || el.dataset.osrc;
    if (PT() !== 'm' && src === 'head_summary') { const s = headPeriodSummary(); el.textContent = s ? n0.format(s[el.dataset.field]) : '—'; return; }
    const r = rowFor(el, markState(el)); el.textContent = r ? n0.format(r[el.dataset.field]) : '—';
  });
  root.querySelectorAll('.imark').forEach((el) => { const r = rowFor(el, markState(el)); el.textContent = r ? r[el.dataset.field] : '—'; });
}
sel.addEventListener('change', () => { const v = sel.value; if (v.includes(':')) { const [pt, mm] = v.split(':'); dash.setParams({ pt, month: mm }); } else dash.setParams({ pt: null, month: v }); });
ptSeg.addEventListener('click', (ev) => {
  const b = ev.target.closest('button'); if (!b) return; const t = b.dataset.p, d = dash.data('mo_monthly'); if (d.status !== 'ok') return;
  const ks = [...new Set(d.data.map((r) => r.month))].sort().slice(1), m = M();
  if (t === 'm') dash.setParams({ pt: null }); else if (t === 'q') dash.setParams({ pt: 'q', month: ks.filter((x) => quarterOf(x) === quarterOf(m)).pop() || m }); else dash.setParams({ pt: 'y', month: ks.filter((x) => x.slice(0, 4) === m.slice(0, 4)).pop() || m });
});
regSel.addEventListener('change', () => { pinned = null; hideBpop(); dash.setParams({ region: regSel.value, country: null }); });
cSel.addEventListener('change', () => { pinned = null; hideBpop(); dash.setParams({ country: cSel.value || null }); });
function fillRegions() {
  const b = dash.data('branches');
  if (b.status !== 'ok') return;
  if (document.activeElement !== regSel) {
    const regs = [...new Set(b.data.map((x) => x.region))];
    regSel.replaceChildren(new Option('Alle Regionen', 'Alle'), ...regs.map((r) => new Option(r, r)));
    regSel.value = REGSEL();
  }
  if (document.activeElement !== cSel) {
    const cs = [...new Set(b.data.filter((x) => REGSEL() === 'Alle' || x.region === REGSEL()).map((x) => x.country))].sort((x, y) => x.localeCompare(y, 'de'));
    cSel.replaceChildren(new Option('Alle Länder', ''), ...cs.map((c) => new Option(c, c)));
    cSel.value = cs.includes(CSEL()) ? CSEL() : '';
  }
}
function deltaCls(r) {
  if (Math.abs(r.delta) < 0.05 || r.hib == null) return 'flat';
  return (r.delta >= 0) === (r.hib === 1) ? 'good' : 'bad';
}
function failed(el) { el.classList.remove('dash-skeleton'); const d = document.createElement('div'); d.className = 'fail'; d.append(document.createElement('i'), 'Failed to load'); el.replaceChildren(d); }
function ready(el, id, flt) {
  const d = dash.data(id);
  if (d.status === 'ok') { el.classList.remove('dash-skeleton'); const data = virtRows(id, d.data) || d.data; return flt ? data.filter(flt) : data; }
  if (d.status === 'error') failed(el); else { el.replaceChildren(); el.classList.add('dash-skeleton'); }
  return null;
}
function measure(svg, texts) {
  let m = 0;
  texts.forEach((t) => { const x = svg.append('text').style('font-size', 'var(--cds-font-size-caption)').text(t); m = Math.max(m, x.node().getComputedTextLength()); x.remove(); });
  return m;
}
const decimals = (step) => (step >= 1 ? 0 : step >= 0.1 ? 1 : 2);

const copt = (el) => (window.__copt && el.id ? window.__copt.get(el.id) : { leg: true, vj: false, unit: true });
function vjOf(rows, o, id) {
  if (id && window.__vjReal) { try { const real = window.__vjReal(id, rows, o); if (real) return real; } catch (e) { /* Schätzung */ } }
  const pp = o.unit === 'pct' || o.unit === 'pct2';
  if (o.y === 'revenue_k' && rows.every((r) => r.yoy_pct != null)) return rows.map((r) => ({ v: r.revenue_k / (1 + r.yoy_pct / 100), d: r.yoy_pct, real: true, pp: false }));
  const n = rows.length, mx = (n - 1) / 2, my = d3.mean(rows, (r) => r[o.y]); let num = 0, den = 0;
  rows.forEach((r, i) => { num += (i - mx) * (r[o.y] - my); den += (i - mx) ** 2; });
  const b = den ? num / den : 0;
  return rows.map((r) => { const v = r[o.y] - 12 * b; return { v, d: pp ? r[o.y] - v : (v ? (r[o.y] / v - 1) * 100 : 0), real: false, pp }; });
}
function a11yTime(el, rows, o, tv, vj, fmt) {
  const A = window.__a11y; if (!A || !rows.length) return; const ys = rows.map((r) => r[o.y]), iMin = ys.indexOf(d3.min(ys)), iMax = ys.indexOf(d3.max(ys)), hasT = tv.some((x) => x != null), last = rows.length - 1;
  const head = ['Monat', 'Wert'].concat(hasT ? ['Ziel'] : []).concat(vj ? ['Vorjahr'] : []);
  A.table(el, { summary: 'Verlauf ' + mlabel(rows[0].month) + ' bis ' + mlabel(rows[last].month) + ': zuletzt ' + fmt(ys[last]) + ', niedrigster Wert ' + fmt(ys[iMin]) + ' (' + mlabel(rows[iMin].month) + '), höchster Wert ' + fmt(ys[iMax]) + ' (' + mlabel(rows[iMax].month) + ')' + (hasT && tv[last] != null ? ', Ziel ' + fmt(tv[last]) : ''), head,
    rows: rows.map((r, i) => [mlabel(r.month), fmt(ys[i])].concat(hasT ? [tv[i] != null ? fmt(tv[i]) : '–'] : []).concat(vj ? [fmt(vj[i].v) + (vj[i].real ? '' : ' (Schätzung)')] : [])) });
}
function timeChart(el, id, o) {
  const rows = ready(el, id, (r) => (!M() || r.month <= M()) && (r.region == null || r.region === REGSEL()) && (r.dim == null || (r.dim === DS().dim && r.member === DS().member)) && (!o.rowf || o.rowf(r))); if (!rows) return;
  const w = el.clientWidth; if (!w) return;
  el.replaceChildren(); el.dataset.vj = '1';
  const vj = copt(el).vj ? vjOf(rows, o, id) : null;
  const H = 230, MG = { t: 12, r: 14, b: 26 }, fmt = FMT[o.unit];
  const tv = rows.map((r) => (typeof o.target === 'string' ? r[o.target] : o.target * (o.cnt ? SH[REGSEL()] * (o.nodim ? 1 : MSP()) : 1)));
  const vals = rows.map((r) => r[o.y]).concat(tv.filter((x) => x != null)).concat(vj ? vj.map((x) => x.v) : []);
  let lo = d3.min(vals), hi = d3.max(vals);
  if (o.type === 'bars') lo = 0; else { const p = (hi - lo) * 0.15 || 1; lo -= p; hi += p; }
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${H}`);
  const y = d3.scaleLinear([lo, hi], [H - MG.b, MG.t]).nice(4);
  const ticks = y.ticks(4), dec = decimals(ticks.length > 1 ? ticks[1] - ticks[0] : 1), tfn = NF(dec), US = { eur_k: ' k€', pct: ' %', pct2: ' %', days: ' Tage', eur: ' €', eur0: ' €' }[o.unit] || '', tf = { format: (v) => tfn.format(v) + US };
  const L = measure(svg, ticks.map((t) => tf.format(t))) + 10;
  const x = o.type === 'bars' ? d3.scaleBand(rows.map((r) => r.month), [L, w - MG.r]).padding(0.3) : d3.scalePoint(rows.map((r) => r.month), [L + 8, w - MG.r - 8]);
  const xp = (m) => (o.type === 'bars' ? x(m) + x.bandwidth() / 2 : x(m));
  const g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
  ticks.forEach((t) => {
    g.append('line').attr('x1', L).attr('x2', w - MG.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'var(--cds-chart-grid)');
    g.append('text').attr('x', L - 6).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', MUTED).text(tf.format(t));
  });
  const step = Math.ceil(rows.length / Math.max(2, Math.floor((w - L - MG.r) / 56)));
  rows.forEach((r, i) => { if (i % step === 0) g.append('text').attr('x', xp(r.month)).attr('y', H - 8).attr('text-anchor', 'middle').attr('fill', MUTED).text(mlabel(r.month)); });
  if (PT() !== 'm') { const pm = new Set(periodMonths()), px = rows.filter((r) => pm.has(r.month)).map((r) => xp(r.month)); if (px.length) { const pad = o.type === 'bars' ? x.bandwidth() / 2 + 2 : 8; g.append('rect').attr('x', d3.min(px) - pad).attr('width', d3.max(px) - d3.min(px) + 2 * pad).attr('y', MG.t).attr('height', H - MG.b - MG.t).attr('rx', 4).attr('fill', dash.colors[0]).attr('opacity', 0.1); } }
  const miss = (r, t) => t != null && (o.hib ? r[o.y] < t : r[o.y] > t);
  if (o.type === 'bars') {
    g.selectAll('rect.b').data(rows).join('rect').attr('x', (r) => x(r.month)).attr('width', x.bandwidth()).attr('y', (r) => y(r[o.y])).attr('height', (r) => y(0) - y(r[o.y]))
      .attr('rx', 4).attr('fill', (r, i) => (miss(r, tv[i]) ? CRIT : dash.colors[0]));
  } else {
    g.append('path').datum(rows).attr('fill', 'none').attr('stroke', dash.colors[0]).attr('stroke-width', 2).attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round')
      .attr('d', d3.line().x((r) => xp(r.month)).y((r) => y(r[o.y])));
    const lr = rows[rows.length - 1];
    g.append('circle').attr('cx', xp(lr.month)).attr('cy', y(lr[o.y])).attr('r', 4).attr('fill', miss(lr, tv[tv.length - 1]) ? CRIT : dash.colors[0]);
  }
  if (vj) {
    if (o.type === 'bars') rows.forEach((r, i) => g.append('line').attr('x1', x(r.month)).attr('x2', x(r.month) + x.bandwidth()).attr('y1', y(vj[i].v)).attr('y2', y(vj[i].v)).attr('stroke', 'var(--color-fg)').attr('stroke-width', 2).attr('stroke-opacity', 0.55));
    else g.append('path').datum(rows.map((r, i) => [xp(r.month), y(vj[i].v)])).attr('fill', 'none').attr('stroke', 'var(--color-fg-muted)').attr('stroke-width', 1.6).attr('stroke-dasharray', '1.5 3.5').attr('stroke-linecap', 'round').attr('d', d3.line());
    const ld = vj[vj.length - 1];
    g.append('text').attr('class', 'vjl').attr('x', w - MG.r - 2).attr('y', MG.t + 6).attr('text-anchor', 'end').attr('fill', 'var(--color-fg-muted)').text('Δ VJ ' + (ld.d >= 0 ? '+' : '−') + n1.format(Math.abs(ld.d)) + (ld.pp ? ' Pkt.' : ' %') + (ld.real ? '' : ' (Trend-Schätzung)'));
  }
  if (tv.some((t) => t != null)) {
    g.append('path').datum(rows.map((r, i) => [xp(r.month), y(tv[i])])).attr('fill', 'none').attr('stroke', 'var(--cds-chart-reference)').attr('stroke-width', 1.5).attr('stroke-dasharray', '5 4')
      .attr('d', d3.line());
  }
  const dot = g.append('circle').attr('r', 5).attr('fill', dash.colors[0]).attr('stroke', 'var(--color-panel)').attr('stroke-width', 2).style('display', 'none');
  svg.append('rect').attr('x', L).attr('y', 0).attr('width', w - L).attr('height', H - MG.b).attr('fill', 'transparent').style('cursor', 'pointer')
    .on('mousemove', (ev) => {
      const px = d3.pointer(ev)[0]; let bi = 0, bd = Infinity;
      rows.forEach((r, i) => { const dd = Math.abs(xp(r.month) - px); if (dd < bd) { bd = dd; bi = i; } });
      const r = rows[bi];
      if (o.type !== 'bars') dot.style('display', null).attr('cx', xp(r.month)).attr('cy', y(r[o.y]));
      const items = [line(mlabel(r.month), 'tt'), line(fmt(r[o.y]))];
      if (tv[bi] != null) items.push(line('Ziel ' + fmt(tv[bi]), 'tt'));
      if (vj) items.push(line('Vorjahr ' + fmt(vj[bi].v) + (vj[bi].real ? '' : ' (Schätzung)') + ' · Δ ' + (vj[bi].d >= 0 ? '+' : '−') + n1.format(Math.abs(vj[bi].d)) + (vj[bi].pp ? ' Pkt.' : ' %'), 'tt'));
      showTip(ev, items);
    }).on('mouseleave', () => { dot.style('display', 'none'); hideTip(); })
    .on('click', (ev) => {
      const px = d3.pointer(ev)[0]; let bi = 0, bd = Infinity;
      rows.forEach((r, i) => { const dd = Math.abs(xp(r.month) - px); if (dd < bd) { bd = dd; bi = i; } });
      if (rows[bi].month !== firstMonth) dash.setParams({ month: rows[bi].month });
    });
  try { a11yTime(el, rows, o, tv, vj, fmt); } catch (e) { /* Textalternative optional */ }
}

function barChart(el, id, o) {
  let rows = ready(el, id, o.flt); if (!rows) return;
  const w = el.clientWidth; if (!w) return;
  el.replaceChildren();
  rows = rows.slice();
  const hasVj = rows.length > 0 && rows[0].yoy_pct != null; el.dataset.vj = hasVj ? '1' : '0';
  const vjOn = hasVj && copt(el).vj, vjt = (r) => (vjOn ? '  VJ ' + (r.yoy_pct >= 0 ? '+' : '−') + n1.format(Math.abs(r.yoy_pct)) + ' %' : '');
  if (o.sort !== false) rows.sort((a, b) => b[o.val] - a[o.val]);
  const fmt = FMT[o.unit], RH = 30, H = rows.length * RH + 24;
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${H}`);
  const L = Math.min(measure(svg, rows.map((r) => String(r[o.cat]))) + 12, w * 0.45);
  const R = measure(svg, rows.map((r) => fmt(r[o.val]) + vjt(r))) + 12;
  const maxV = d3.max(rows, (r) => r[o.val]), x = d3.scaleLinear([0, Math.max(maxV, o.limit || 0, o.tcol ? d3.max(rows, (r) => r[o.tcol]) : 0) * 1.05], [L, w - R]);
  const g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
  const miss = (v) => o.limit != null && (o.hib ? v < o.limit : v > o.limit);
  const missRow = (r) => (o.tcol ? r[o.tcol] != null && (o.hib ? r[o.val] < r[o.tcol] : r[o.val] > r[o.tcol]) : miss(r[o.val]));
  rows.forEach((r, i) => {
    const cy = 18 + i * RH + RH / 2 - 9;
    g.append('text').attr('x', L - 8).attr('y', cy).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').text(String(r[o.cat]));
    g.append('rect').attr('x', L).attr('y', cy - 8).attr('height', 16).attr('width', Math.max(2, x(r[o.val]) - L)).attr('rx', 4)
      .attr('data-pg', o.cat === 'group' ? String(r[o.cat]) : null).attr('data-ct', o.cat === 'country' ? String(r[o.cat]) : null).attr('data-bs', o.cat === 'series' ? String(r[o.cat]) : null).attr('data-ba', o.cat === 'age' ? String(r[o.cat]) : null).attr('fill', missRow(r) ? CRIT : dash.colors[0]).attr('stroke', o.focus != null && String(r[o.cat]) === o.focus ? 'var(--color-fg)' : 'none').attr('stroke-width', 2).style('cursor', o.click ? 'pointer' : null)
      .on('mousemove', (ev) => (o.cat === 'group' && window.__groupPop ? window.__groupPop.show(ev, String(r[o.cat])) : o.cat === 'country' && window.__ctryPop ? window.__ctryPop.show(ev, String(r[o.cat])) : (o.cat === 'series' || o.cat === 'age') && window.__carPop ? window.__carPop.show(ev, o.cat === 'series' ? { series: String(r[o.cat]), age: o.ctxAge || null } : { age: String(r[o.cat]), series: o.ctxSeries || null }) : showTip(ev, [line(String(r[o.cat]), 'tt'), line(fmt(r[o.val]))].concat(o.tcol ? [line('Ziel ' + fmt(r[o.tcol]), 'tt')] : [])))).on('mouseleave', () => { hideTip(); if (window.__groupPop) window.__groupPop.hide(); if (window.__ctryPop) window.__ctryPop.hide(); })
      .on('click', () => { if (o.click) o.click(r); });
    if (o.tcol && r[o.tcol] != null) g.append('line').attr('x1', x(r[o.tcol])).attr('x2', x(r[o.tcol])).attr('y1', cy - 11).attr('y2', cy + 11).attr('stroke', 'var(--cds-chart-reference)').attr('stroke-width', 2);
    g.append('text').attr('x', x(r[o.val]) + 6).attr('y', cy).attr('dy', '0.32em').attr('fill', MUTED).text(fmt(r[o.val]) + vjt(r));
  });
  if (o.limit != null) {
    g.append('line').attr('x1', x(o.limit)).attr('x2', x(o.limit)).attr('y1', 8).attr('y2', H - 8).attr('stroke', 'var(--cds-chart-reference)').attr('stroke-width', 1.5).attr('stroke-dasharray', '5 4');
  }
  try { const A = window.__a11y; if (A && rows.length) { const mx = rows[0], mn = rows[rows.length - 1], hasT = !!o.tcol; A.table(el, { summary: rows.length + ' Einträge, höchster Wert ' + fmt(d3.max(rows, (r) => r[o.val])) + ' (' + String(rows.reduce((b, r) => (r[o.val] > b[o.val] ? r : b), rows[0])[o.cat]) + '), niedrigster Wert ' + fmt(d3.min(rows, (r) => r[o.val])) + ' (' + String(rows.reduce((b, r) => (r[o.val] < b[o.val] ? r : b), rows[0])[o.cat]) + ')', head: ['Eintrag', 'Wert'].concat(hasT ? ['Ziel'] : []), rows: rows.map((r) => [String(r[o.cat]), fmt(r[o.val])].concat(hasT ? [r[o.tcol] != null ? fmt(r[o.tcol]) : '–'] : [])) }); } } catch (e) { /* optional */ }
}

const sorts = new WeakMap();
function renderTable(tbl, id, cols, key, flt, fkey) {
  let rows = ready(tbl, id, flt); tbl.classList.remove('dash-skeleton'); if (!rows) return;
  if (tbl.id === 'tb-head' && PT() !== 'm') { const ms = periodMonths(), pms = prevPeriodMonths(ms), g = new Map(); rows.forEach((r) => { const k = r.bu + '|' + r.kpi; if (!g.has(k)) g.set(k, []); g.get(k).push(r); }); rows = [...g.values()].map((x) => aggRow(x, ms, pms)).filter(Boolean); }
  const s = sorts.get(tbl);
  let data = rows.slice();
  if (s) data.sort((a, b) => (a[s.f] < b[s.f] ? -1 : a[s.f] > b[s.f] ? 1 : 0) * (s.dir === 'asc' ? 1 : -1));
  tbl.querySelectorAll('th').forEach((th) => { if (s && th.dataset.field === s.f) th.setAttribute('aria-sort', s.dir === 'asc' ? 'ascending' : 'descending'); else th.removeAttribute('aria-sort'); });
  const qin = document.querySelector('.tsearch[data-for="' + tbl.id + '"]'), qq = qin ? qin.value.trim().toLowerCase() : '';
  const body = tbl.tBodies[0]; body.replaceChildren();
  data.forEach((r) => {
    const tr = document.createElement('tr'); tr.dataset.key = r[key]; tr.dataset.focus = r[fkey || key]; if (dash.params().focus && String(r[fkey || key]) === dash.params().focus && !['tb-head', 'tb-gl'].includes(tbl.id)) tr.className = 'focus';
    cols.forEach((c, i) => {
      const td = document.createElement('td'); if (i > 0 && c.num !== false) td.className = 'num';
      const v = c.get(r); td.textContent = v.t; if (v.c) td.className += ' ' + v.c; tr.append(td);
    });
    if (qq && !tr.textContent.toLowerCase().includes(qq)) tr.hidden = true;
    body.append(tr);
  });
}
root.addEventListener('input', (ev) => { if (ev.target.matches('.tsearch')) draw(cur); });
root.addEventListener('click', (ev) => {
  const tr = ev.target.closest('.tbl tbody tr[data-key]');
  if (tr && !['tb-head', 'tb-gl'].includes(tr.closest('table').id) && !tr.closest('table').dataset.own) { const f = dash.params().focus; const fv = tr.dataset.focus || tr.dataset.key; dash.setParams({ focus: f === fv ? null : fv }); return; }
  const th = ev.target.closest('.tbl th'); if (!th || th.closest('table').dataset.own) return;
  const tbl = th.closest('table'), s = sorts.get(tbl);
  sorts.set(tbl, { f: th.dataset.field, dir: s && s.f === th.dataset.field && s.dir === 'asc' ? 'desc' : 'asc' });
  draw(cur);
});

const headCols = [
  { get: (r) => ({ t: r.bu_label }) }, { get: (r) => ({ t: r.label }), num: false },
  { get: (r) => ({ t: FMT[r.unit](r.value) }) },
  { get: (r) => ({ t: (r.delta >= 0 ? '+' : '−') + n1.format(Math.abs(r.delta)) + (r.dk === 'pp' ? ' Pkt.' : ' %'), c: deltaCls(r) }) },
  { get: (r) => ({ t: r.target == null ? '–' : FMT[r.unit](r.target) }) },
  { get: (r) => ({ t: r.status, c: r.ok == null ? 'flat' : r.ok ? 'good' : 'bad' }), num: false }];
function draw(t) {
  const q = (id) => document.getElementById(id);
  if (t === 'net') { drawNet(); if (window.__hodDraw.netx) (window.__safe || ((n, f) => f()))('netx', window.__hodDraw.netx); return; }
  if (t === 'ws') { drawWs(); if (window.__hodDraw.wsx) (window.__safe || ((n, f) => f()))('wsx', window.__hodDraw.wsx); return; }
  if (t === 'gl') { drawGl(); (window.__safe || ((n, f) => f()))('glx', window.__hodDraw.glx || (() => 0)); return; }
  if (window.__hodDraw && window.__hodDraw[t]) { (window.__safe || ((n, f) => f()))('hook ' + t, window.__hodDraw[t]); return; }
  if (t === 'iv') { drawIv(); if (window.__hodDraw.ivx) (window.__safe || ((n, f) => f()))('ivx', window.__hodDraw.ivx); return; }
  if (t === 'mk') { drawMk(); if (window.__hodDraw.mkx) (window.__safe || ((n, f) => f()))('mkx', window.__hodDraw.mkx); return; }
  if (t === 'head') {
    barChart(q('ch-head-bu'), 'head_bu', { cat: 'bu_label', val: 'ok_pct', unit: 'pct0', limit: 50, hib: 1, sort: false, flt: (r) => r.month === M() && r.region === REGSEL() && r.dim === DS().dim && r.member === DS().member, click: (r) => show(r.bu) });
    timeChart(q('ch-head-rev'), 'mo_monthly', { y: 'revenue_k', unit: 'eur_k', target: 'target_k', hib: 1, type: 'line' });
    renderTable(q('tb-head'), 'head_kpis', headCols, 'id', (r) => (PT() === 'm' ? r.month === M() : new Set([...periodMonths(), ...prevPeriodMonths(periodMonths())]).has(r.month)) && r.region === REGSEL() && r.dim === DS().dim && r.member === DS().member);
    return;
  }
  const c = CFG.bus[t];
  c.charts.forEach((o) => timeChart(q(o.el), o.ds, o));
  const d = c.det;
  const fl = (r) => (d.allrows ? REGSEL() === 'Alle' || r.region === REGSEL() : r.region === REGSEL()), foc = dash.params().focus || null;
  barChart(q(d.el), d.ds, Object.assign({}, d, { flt: fl, focus: foc, click: (r) => dash.setParams({ focus: foc === String(r[d.cat]) ? null : String(r[d.cat]) }) }));
  renderTable(q(d.tb), d.ds, d.cols.map(([f, l, u]) => ({ get: (r) => ({ t: u ? FMT[u](r[f]) : String(r[f]) }) })), d.cat, fl);
  if (window.__hodDraw && window.__hodDraw[t + 'x']) (window.__safe || ((n, f) => f()))('hook ' + t + 'x', window.__hodDraw[t + 'x']);
}

const KM = 1000, LON0 = -25, LON1 = 45, LATT = 71.5, LATB = 34;
const myr = (la) => Math.log(Math.tan(Math.PI / 4 + la * Math.PI / 360));
const KK = KM / ((LON1 - LON0) * Math.PI / 180), MAPH = (myr(LATT) - myr(LATB)) * KK;
const proj = (lon, lat) => [(lon - LON0) * Math.PI / 180 * KK, (myr(LATT) - myr(lat)) * KK];
const bpop = document.getElementById('bpop');
let pinned = null;
function h(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
function mk(el, src, where, field) { el.dataset.source = src; el.dataset.where = where; el.dataset.field = field; return el; }
const BTILES = [['revenue_k', 'Umsatz', 'eur_k', 1, 'target_k'], ['otif_pct', 'OTIF', 'pct', 1, 95], ['fill_rate_pct', 'Lieferbereitschaft', 'pct', 1, 97],
  ['margin_pct', 'Marge', 'pct', 1, 36], ['claim_rate_pct', 'Reklamation', 'pct2', 0, 1.2], ['certified_pct', 'Zertifiziert', 'pct', 1, 85]];
const BREC = { revenue_k: 'Umsatzlücke: Händlerbesuche und Aktionen priorisieren.', otif_pct: 'Liefertreue: Kommissionierung und Carrier-Abstimmung prüfen.',
  fill_rate_pct: 'Verfügbarkeit: Bestandsparameter und Nachschub überprüfen.', margin_pct: 'Marge: Rabattfreigaben und Preisdurchsetzung nachschärfen.',
  claim_rate_pct: 'Reklamationen: Top-Fehlerursachen mit dem Standort analysieren.', certified_pct: 'Qualifizierung: Schulungsplätze für Techniker einplanen.' };
function showBranch(ev, id) {
  const m = M(), br = NET.br.get(id), all = (NET.hist.get(id) || []).filter((r) => r.month <= m);
  if (!br || !all.length) return;
  const cur = all[all.length - 1], at = NET.attain.get(id + '|' + m), where = 'id=' + id + '&month=' + m;
  const c = h('div');
  const ph = NET.photos && NET.photos.get(id);
  if (ph) { const im = h('img', 'bph'); im.src = ph; im.alt = 'Beispielbild ' + br.city; c.append(im, h('div', 'pcap', 'Beispielbild (generiert)')); }
  const bs = h('div', 'bs'); if (window.__flag) bs.append(window.__flag(br.country, 22)); bs.append(br.country + ' · ' + br.region + ' · ' + br.id);
  c.append(h('div', 'bt', br.city), bs);
  const pill = h('div', 'kx'); pill.append('Zielerreichung ');
  const ps = mk(h('b', at && at.miss ? 'bad' : 'good', at ? n1.format(at.attain_pct) + ' %' : '—'), 'net_attain', where, 'attain_pct'); pill.append(ps); c.append(pill);
  const tiles = h('div', 'tiles'), misses = [];
  for (const [f, lab, unit, hib, t] of BTILES) {
    const tv = typeof t === 'string' ? cur[t] : t, ok = hib ? cur[f] >= tv : cur[f] <= tv;
    if (!ok) misses.push(f);
    const tile = h('div', 'tile'); tile.append(h('div', 'tl', lab), mk(h('div', 'tv ' + (ok ? '' : 'bad'), FMT[unit](cur[f])), 'branch_monthly', where, f), h('div', 'tg', 'Ziel ' + FMT[unit](tv)));
    tiles.append(tile);
  }
  c.append(tiles);
  const sp = h('div'); c.append(sp);
  const ft = h('div', 'ft');
  [['staff', 'Mitarbeiter', n0], ['dealers', 'Händler', n0], ['warehouse_m2', 'Lager m²', n0]].forEach(([f, l, nfm]) => {
    const s = h('span'); s.append(l + ' ', mk(h('b', null, nfm.format(br[f])), 'branches', 'id=' + id, f)); ft.append(s);
  });
  c.append(ft);
  const rec = h('div', 'rec'); rec.append(h('b', null, 'Empfehlung: '), misses.length ? BREC[misses[0]] : 'Standort im Plan – Best Practices an Nachbarstandorte weitergeben.'); c.append(rec);
  bpop.replaceChildren(c); bpop.hidden = false;
  // sparkline revenue vs target
  const SW = 276, SH = 54, svg = d3.select(sp).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${SW} ${SH}`);
  const ys = d3.scaleLinear([0, d3.max(all, (r) => Math.max(r.revenue_k, r.target_k)) * 1.1], [SH - 4, 4]);
  const xs = d3.scalePoint(all.map((r) => r.month), [4, SW - 4]);
  if (all.length > 1) {
    svg.append('path').datum(all).attr('fill', 'none').attr('stroke', 'var(--cds-chart-reference)').attr('stroke-dasharray', '4 3').attr('d', d3.line().x((r) => xs(r.month)).y((r) => ys(r.target_k)));
    svg.append('path').datum(all).attr('fill', 'none').attr('stroke', dash.colors[0]).attr('stroke-width', 2).attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round').attr('d', d3.line().x((r) => xs(r.month)).y((r) => ys(r.revenue_k)));
    svg.append('circle').attr('cx', xs(cur.month)).attr('cy', ys(cur.revenue_k)).attr('r', 3.5).attr('fill', dash.colors[0]);
  }
  placePop(bpop, ev);
}
const NET = { br: new Map(), hist: new Map(), attain: new Map(), photos: null };
function drawNet() {
  const el = document.getElementById('ch-net');
  const ids = ['europe_geo', 'branches', 'branch_monthly', 'net_attain'], ds = ids.map((i) => dash.data(i));
  if (ds.some((d) => d.status === 'error')) { failed(el); return; }
  if (ds.some((d) => d.status !== 'ok')) { el.replaceChildren(); el.classList.add('dash-skeleton'); return; }
  const m = M(), w = el.clientWidth; if (!m || !w) return;
  el.classList.remove('dash-skeleton'); el.replaceChildren(); hideBpop();
  const [geo, br, bm, at] = ds.map((d) => d.data);
  const phd = dash.data('branch_photos');
  if (phd.status === 'ok' && (!NET.photos || NET.photos.size !== phd.data.length)) NET.photos = new Map(phd.data.map((r) => [r.id, r.img]));
  NET.br = new Map(br.map((b) => [b.id, b])); NET.hist = new Map(); NET.attain = new Map(at.map((a) => [a.id + '|' + a.month, a]));
  bm.forEach((r) => { if (!NET.hist.has(r.id)) NET.hist.set(r.id, []); NET.hist.get(r.id).push(r); });
  const rg = REGSEL(), cur = bm.filter((r) => r.month === m), maxRev = d3.max(cur, (r) => r.revenue_k);
  const cs = CSEL(), inR = (id) => (rg === 'Alle' || NET.br.get(id).region === rg) && (!cs || NET.br.get(id).country === cs);
  const pos = (r) => proj(NET.br.get(r.id).lon, NET.br.get(r.id).lat);
  let vx = 0, vy = 0, vw = KM, vh = MAPH;
  const vis = cur.filter((r) => inR(r.id));
  if ((rg !== 'Alle' || cs) && vis.length) {
    const pts = vis.map(pos), x0 = d3.min(pts, (p) => p[0]), x1 = d3.max(pts, (p) => p[0]), y0 = d3.min(pts, (p) => p[1]), y1 = d3.max(pts, (p) => p[1]), pad = 45;
    vw = Math.max(x1 - x0 + 2 * pad, 220); vh = vw * MAPH / KM;
    if (y1 - y0 + 2 * pad > vh) { vh = y1 - y0 + 2 * pad; vw = vh * KM / MAPH; }
    if (vw >= KM) { vw = KM; vh = MAPH; }
    vx = Math.min(Math.max((x0 + x1) / 2 - vw / 2, 0), KM - vw); vy = Math.min(Math.max((y0 + y1) / 2 - vh / 2, 0), MAPH - vh);
  }
  const zoom = vw / KM, f = Math.pow(zoom, 0.6);
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `${vx} ${vy} ${vw} ${vh}`).attr('role', 'img').attr('aria-label', 'Europakarte mit Niederlassungen');
  svg.on('click', (ev) => { if (ev.target.tagName !== 'circle') { pinned = null; hideBpop(); } });
  svg.append('rect').attr('width', KM).attr('height', MAPH).attr('fill', 'var(--color-bg)');
  svg.append('g').selectAll('path').data(geo).join('path').attr('d', (g) => g.d).attr('fill', 'var(--cds-chart-grid)').attr('stroke', 'var(--color-panel)').attr('stroke-width', 0.8 * zoom).attr('stroke-linejoin', 'round');
  const rad = d3.scaleSqrt([0, maxRev], [3.2, 11]);
  if (rg !== 'Alle' || cs) {
    svg.append('g').selectAll('circle').data(cur.filter((r) => !inR(r.id))).join('circle').attr('cx', (r) => pos(r)[0]).attr('cy', (r) => pos(r)[1])
      .attr('r', 2.2 * f).attr('fill', MUTED).attr('fill-opacity', 0.35).style('pointer-events', 'none');
  }
  svg.append('g').selectAll('circle').data(vis.slice().sort((a, b) => b.revenue_k - a.revenue_k)).join('circle')
    .attr('cx', (r) => pos(r)[0]).attr('cy', (r) => pos(r)[1])
    .attr('r', (r) => rad(r.revenue_k) * f).attr('fill', (r) => (r.revenue_k < r.target_k ? CRIT : dash.colors[0])).attr('fill-opacity', 0.72)
    .attr('stroke', 'var(--color-panel)').attr('stroke-width', zoom)
    .on('mouseenter mousemove', function (ev, r) { if (pinned) return; d3.select(this).attr('stroke', 'var(--color-fg)').attr('stroke-width', 2 * zoom); showBranch(ev, r.id); })
    .on('mouseleave', function () { d3.select(this).attr('stroke', 'var(--color-panel)').attr('stroke-width', zoom); if (!pinned) hideBpop(); })
    .on('click', function (ev, r) { ev.stopPropagation(); pinned = pinned === r.id ? null : r.id; showBranch(ev, r.id); if (!pinned) hideBpop(); });
}
function hideBpop() { bpop.hidden = true; }

FMT.thr = (v) => n2.format(v);
const WSU = { retention_pct: 'pct', pen_total: 'eur_k', pen_lohn: 'eur_k', pen_teile: 'eur_k', throughput: 'thr' };
function heatmap(el, id, o) {
  const rows = ready(el, id, o.flt); if (!rows) return;
  const w = el.clientWidth; if (!w) return;
  el.replaceChildren();
  const rk = o.rk || 'series', ck = o.ck || 'age', sers = [...new Set(rows.map((r) => r[rk]))], ages = [...new Set(rows.map((r) => r[ck]))], fmt = FMT[o.unit];
  const T = 26, RH = 40, H = T + sers.length * RH + 4;
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${H}`);
  const L = Math.min(measure(svg, sers) + 12, w * 0.4), cw = (w - L) / ages.length;
  const sv = (r) => (o.unit === 'eur_k' && r.target ? r.value / r.target : r.value), op = d3.scaleLinear(d3.extent(rows, sv), [0.12, 0.6]);
  const g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
  ages.forEach((a, i) => g.append('text').attr('x', L + i * cw + cw / 2).attr('y', 16).attr('text-anchor', 'middle').attr('fill', MUTED).text(a));
  sers.forEach((s, si) => g.append('text').attr('x', L - 8).attr('y', T + si * RH + RH / 2).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', 'var(--color-fg)').text(s));
  rows.forEach((r) => {
    const x = L + ages.indexOf(r[ck]) * cw, y = T + sers.indexOf(r[rk]) * RH;
    g.append('rect').attr('x', x + 2).attr('y', y + 2).attr('width', Math.max(2, cw - 4)).attr('height', RH - 4).attr('rx', 5).attr('fill', dash.colors[0]).attr('fill-opacity', op(sv(r)))
      .attr('stroke', r.ok === false ? CRIT : 'none').attr('stroke-width', 2).style('cursor', o.click ? 'pointer' : 'default').attr('data-bs', rk === 'series' ? r[rk] : null).attr('data-ba', ck === 'age' ? r[ck] : null)
      .on('mousemove', (ev) => (rk === 'series' && ck === 'age' && window.__carPop ? window.__carPop.show(ev, { series: r[rk], age: r[ck] }) : showTip(ev, [line(r[rk] + ' · ' + r[ck], 'tt'), line(fmt(r.value))].concat(r.target != null ? [line('Ziel ' + fmt(r.target), 'tt')] : [])))).on('mouseleave', hideTip)
      .on('click', () => { if (o.click) o.click(r); });
    g.append('text').attr('x', x + cw / 2).attr('y', y + RH / 2).attr('dy', '0.32em').attr('text-anchor', 'middle').attr('fill', 'var(--color-fg)').style('pointer-events', 'none').text(fmt(r.value));
  });
}
const wsSegment = document.getElementById('ws-segment'), wsSeries = document.getElementById('ws-series'), wsAge = document.getElementById('ws-age'), wsMetric = document.getElementById('ws-metric');
wsSeries.addEventListener('change', () => dash.setParams({ series: wsSeries.value || null }));
wsSegment.addEventListener('change', () => dash.setParams({ segment: wsSegment.value === 'Alle' ? null : wsSegment.value, series: null }));
wsAge.addEventListener('change', () => dash.setParams({ age: wsAge.value === 'Alle' ? null : wsAge.value }));
wsMetric.addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) dash.setParams({ wkpi: b.dataset.m }); });
const wsPart = document.getElementById('ws-part');
wsPart.addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) dash.setParams({ part: b.dataset.p === 'total' ? null : b.dataset.p, wkpi: 'penetration' }); });
function fillWs() {
  const d = dash.data('ws_segments'); if (d.status !== 'ok') return;
  const st = WSX(), segs = [...new Set(d.data.map((r) => r.segment))];
  if (document.activeElement !== wsSegment) { wsSegment.replaceChildren(new Option('Alle Segmente', 'Alle'), ...segs.map((s) => new Option(s, s))); wsSegment.value = st.segment; }
  if (document.activeElement !== wsSeries) {
    const sers = [...new Map(d.data.filter((r) => st.segment === 'Alle' || r.segment === st.segment).map((r) => [r.series, 1])).keys()];
    wsSeries.replaceChildren(new Option('Alle Baureihen', ''), ...sers.map((s) => new Option(s, s))); wsSeries.value = sers.includes(st.sel) ? st.sel : '';
  }
  if (document.activeElement !== wsAge) { wsAge.replaceChildren(new Option('Alle Altersklassen', 'Alle'), ...[...new Set(d.data.map((r) => r.age))].map((s) => new Option(s, s))); wsAge.value = st.age; }
  wsMetric.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.m === st.metric)));
  wsPart.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.p === st.part)));
}
const glArea = document.getElementById('gl-area');
glArea.addEventListener('change', () => dash.setParams({ garea: glArea.value === 'Alle' ? null : glArea.value }));
const glCols = ['area', 'kpi', 'unit', 'definition', 'formula', 'direction', 'target'].map((f) => ({ num: false, get: (r) => ({ t: String(r[f]), c: f === 'formula' ? 'mono' : f === 'kpi' ? 'kpicell' : '' }) }));
function drawGl() {
  const d = dash.data('glossary'); if (d.status !== 'ok') return;
  const area = dash.params().garea || 'Alle';
  if (document.activeElement !== glArea) { glArea.replaceChildren(new Option('Alle Bereiche', 'Alle'), ...[...new Set(d.data.map((r) => r.area))].map((a) => new Option(a, a))); glArea.value = area; }
  renderTable(document.getElementById('tb-gl'), 'glossary', glCols, 'id', (r) => area === 'Alle' || r.area === area);
}
const wsCols = [
  { get: (r) => ({ t: r.group }), num: false },
  { get: (r) => ({ t: FMT.eur_k(r.lohn_k) }) }, { get: (r) => ({ t: FMT.eur_k(r.teile_k) }) }, { get: (r) => ({ t: FMT.eur_k(r.gesamt_k) }) },
  { get: (r) => ({ t: FMT.eur_k(r.gesamt_t) }) }, { get: (r) => ({ t: n1.format(r.attain_pct) + ' %', c: r.attain_pct < 100 ? 'bad' : 'good' }) }];
function drawWs() {
  const q = (id) => document.getElementById(id), st = WSX(), m = M(), unit = WSU[st.kpi];
  heatmap(q('ws-heat'), 'ws_cube', { kpi: st.kpi, unit, month: m, flt: (r) => r.kpi === st.kpi && r.month === m && r.level === 2 && (st.segment === 'Alle' || r.segment === st.segment), click: (r) => dash.setParams({ series: r.series, age: r.age }) });
  timeChart(q('ws-trend'), 'ws_cube', { y: 'value', unit, target: 'target', hib: 1, type: 'line', rowf: (r) => r.kpi === st.kpi && r.series === st.series && r.age === st.age });
  barChart(q('ws-ser'), 'ws_cube', { ctxAge: st.age && st.age !== 'Alle' ? st.age : null, cat: 'series', val: 'value', unit, tcol: 'target', hib: 1, flt: (r) => r.kpi === st.kpi && r.month === m && r.age === st.age && r.level === 2 && (st.segment === 'Alle' || r.segment === st.segment), click: (r) => dash.setParams({ series: r.series }) });
  const pc = { total: ['gesamt_k', 'gesamt_t'], lohn: ['lohn_k', 'lohn_t'], teile: ['teile_k', 'teile_t'] }[st.part], gf = (r) => r.series === st.series && r.month === m, foc = dash.params().focus || null;
  barChart(q('ws-grp'), 'ws_grp', { cat: 'group', val: pc[0], unit: 'eur_k', tcol: pc[1], hib: 1, flt: gf, focus: foc, click: (r) => dash.setParams({ focus: foc === r.group ? null : r.group }) });
  renderTable(q('tb-ws'), 'ws_grp', wsCols, 'id', gf, 'group');
  barChart(q('ws-chart-age'), 'ws_cube', { ctxSeries: st.series || null, cat: 'age', val: 'value', unit, tcol: 'target', hib: 1, sort: false, flt: (r) => r.kpi === st.kpi && r.month === m && r.series === st.series && r.age !== 'Alle', click: (r) => dash.setParams({ age: r.age }) });
}

FMT.pts = (v) => (v >= 0 ? '+' : '−') + n1.format(Math.abs(v)) + ' Pkt.';
function scatterChart(el, id, o) {
  const rows = ready(el, id, o.flt); if (!rows) return;
  const w = el.clientWidth; if (!w) return;
  el.replaceChildren();
  const H = 340, M0 = { t: 14, r: 16, b: 42, l: 46 };
  const svg = d3.select(el).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${w} ${H}`);
  const xe = d3.extent(rows, (r) => r.price_gap_pct), ye = d3.extent(rows, (r) => r.share_change_pts);
  const x = d3.scaleLinear([Math.min(xe[0], -1) - 0.8, Math.max(xe[1], 3) + 0.8], [M0.l, w - M0.r]).nice(), y = d3.scaleLinear([Math.min(ye[0], -0.5) - 0.3, Math.max(ye[1], 0.5) + 0.3], [H - M0.b, M0.t]).nice();
  const rad = d3.scaleSqrt([0, d3.max(rows, (r) => r.market_volume_k)], [4, 17]);
  const g = svg.append('g').style('font-size', 'var(--cds-font-size-caption)');
  x.ticks(6).forEach((t) => g.append('text').attr('x', x(t)).attr('y', H - M0.b + 16).attr('text-anchor', 'middle').attr('fill', MUTED).text(n1.format(t)));
  y.ticks(5).forEach((t) => { g.append('line').attr('x1', M0.l).attr('x2', w - M0.r).attr('y1', y(t)).attr('y2', y(t)).attr('stroke', 'var(--cds-chart-grid)'); g.append('text').attr('x', M0.l - 6).attr('y', y(t)).attr('dy', '0.32em').attr('text-anchor', 'end').attr('fill', MUTED).text(n1.format(t)); });
  g.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', M0.t).attr('y2', H - M0.b).attr('stroke', 'var(--cds-chart-reference)').attr('stroke-dasharray', '5 4');
  g.append('line').attr('x1', x(2)).attr('x2', x(2)).attr('y1', M0.t).attr('y2', H - M0.b).attr('stroke', 'var(--cds-chart-reference)').attr('stroke-dasharray', '2 3');
  g.append('line').attr('x1', M0.l).attr('x2', w - M0.r).attr('y1', y(0)).attr('y2', y(0)).attr('stroke', 'var(--cds-chart-reference)').attr('stroke-dasharray', '5 4');
  g.append('text').attr('x', (M0.l + w - M0.r) / 2).attr('y', H - 6).attr('text-anchor', 'middle').attr('fill', MUTED).text('Preisabstand zum Wettbewerb in % (rechts = teurer)');
  g.append('text').attr('transform', `translate(12 ${(M0.t + H - M0.b) / 2}) rotate(-90)`).attr('text-anchor', 'middle').attr('fill', MUTED).text('Marktanteilsveränderung in Pkt.');
  const risk = (r) => r.price_gap_pct > 2 && r.share_change_pts < 0;
  g.selectAll('circle').data(rows.slice().sort((a, b) => b.market_volume_k - a.market_volume_k)).join('circle')
    .attr('cx', (r) => x(r.price_gap_pct)).attr('cy', (r) => y(r.share_change_pts)).attr('r', (r) => rad(r.market_volume_k))
    .attr('data-pg', (r) => r.group).attr('fill', (r) => (risk(r) ? CRIT : dash.colors[0])).attr('fill-opacity', 0.7)
    .attr('stroke', (r) => (o.focus != null && r.group === o.focus ? 'var(--color-fg)' : 'var(--color-panel)')).attr('stroke-width', (r) => (o.focus != null && r.group === o.focus ? 2.5 : 1)).style('cursor', 'pointer')
    .on('mousemove', (ev, r) => gpShow(ev, r.group) || showTip(ev, [line(r.group, 'tt'), line('Preisabstand ' + FMT.pct(r.price_gap_pct)), line('Marktanteil ' + FMT.pct(r.market_share_pct) + ' (' + FMT.pts(r.share_change_pts) + ')'), line('Hauptwettbewerber: ' + r.main_competitor, 'tt')])).on('mouseleave', hideTip)
    .on('click', (ev, r) => o.click(r));
  g.selectAll('text.lbl').data(rows.filter(risk)).join('text').attr('class', 'lbl').attr('x', (r) => x(r.price_gap_pct) + rad(r.market_volume_k) + 3).attr('y', (r) => y(r.share_change_pts)).attr('dy', '0.32em').attr('fill', 'var(--color-fg)').style('pointer-events', 'none').text((r) => r.group);
}
const abcMetric = document.getElementById('abc-metric');
abcMetric.addEventListener('click', (ev) => { const b = ev.target.closest('button'); if (b) dash.setParams({ abcm: b.dataset.a === 'service_level_pct' ? null : b.dataset.a }); });
const IVU = { service_level_pct: 'pct', days_cover: 'days', stock_value_k: 'eur_k' };
const ivCols = [{ get: (r) => ({ t: r.group }), num: false }, { get: (r) => ({ t: FMT.eur_k(r.stock_value_k) }) }, { get: (r) => ({ t: FMT.days(r.days_cover) }) }, { get: (r) => ({ t: FMT.pct(r.service_level_pct), c: r.service_level_pct < 95 ? 'bad' : '' }) }, { get: (r) => ({ t: FMT.eur_k(r.slow_mover_k) }) }, { get: (r) => ({ t: FMT.eur_k(r.obsolete_risk_k) }) }];
const mkCols = [{ get: (r) => ({ t: r.group }), num: false }, { get: (r) => ({ t: FMT.eur_k(r.market_volume_k) }) }, { get: (r) => ({ t: FMT.pct(r.market_share_pct) }) }, { get: (r) => ({ t: FMT.pts(r.share_change_pts), c: r.share_change_pts < 0 ? 'bad' : 'good' }) },
  { get: (r) => ({ t: FMT.eur(r.own_price_eur) }) }, { get: (r) => ({ t: FMT.eur(r.comp_price_eur) }) }, { get: (r) => ({ t: FMT.pct(r.price_gap_pct), c: r.price_gap_pct > 2 ? 'bad' : '' }) }, { get: (r) => ({ t: r.main_competitor }), num: false }];
function drawIv() {
  const q = (id) => document.getElementById(id), m = M(), st = WSX(), foc = dash.params().focus || null, rg = REGSEL();
  CFG.ivmk.iv.charts.forEach((o) => timeChart(q(o.el), o.ds, o));
  abcMetric.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.a === st.abck)));
  heatmap(q('ch-iv-x'), 'iv_abc_cube', { kpi: st.abck, unit: IVU[st.abck], rk: 'abc', ck: 'xyz', flt: (r) => r.region === rg && r.month === m && r.kpi === st.abck });
  const fl = (r) => r.region === rg && r.month === m;
  barChart(q('ch-iv-g'), 'iv_group', { cat: 'group', val: 'obsolete_risk_k', unit: 'eur_k', limit: null, hib: 0, flt: fl, focus: foc, click: (r) => dash.setParams({ focus: foc === r.group ? null : r.group }) });
  renderTable(q('tb-iv'), 'iv_group', ivCols, 'id', fl, 'group');
}
function drawMk() {
  const q = (id) => document.getElementById(id), m = M(), foc = dash.params().focus || null, rg = REGSEL();
  CFG.ivmk.mk.charts.forEach((o) => timeChart(q(o.el), o.ds, o));
  const fl = (r) => r.region === rg && r.month === m;
  scatterChart(q('ch-mk-s'), 'mk_group', { flt: fl, focus: foc, click: (r) => dash.setParams({ focus: foc === r.group ? null : r.group }) });
  renderTable(q('tb-mk'), 'mk_group', mkCols, 'id', fl, 'group');
}
FMT.eur_m = (v) => n1.format(v) + ' Mio. €';
FMT.pct0 = (v) => n0.format(v) + ' %';
function show(t) {
  if (ALIAS[t]) t = ALIAS[t];
  cur = t;
  root.querySelectorAll('.tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === t)));
  TABS.forEach((p) => { document.getElementById(p).hidden = p !== t; });
  if (dash.params().focus) dash.setParams({ focus: null });
  dash.setLink(t); hideTip(); pinned = null; hideBpop(); draw(t);
}
root.querySelector('.tabs').addEventListener('click', (ev) => { const b = ev.target.closest('.tab'); if (b) show(b.dataset.tab); });
TABS.forEach((p) => { document.getElementById(p).hidden = p !== cur; });
root.querySelectorAll('.tab').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === cur)));
document.getElementById('reset-all').addEventListener('click', () => { dash.resetParams(); pinned = null; hideBpop(); });
window.__hod = { show, M, REGSEL, root, cur: () => cur, ready, FMT, n0, n1, timeChart, measure, mlabel, CRIT, showTip, hideTip, line, DA, DS, SH, redraw: () => draw(cur), CFG, PT, periodMonths, prevPeriodMonths, aggRow, SUMKPI, addM };
dash.onData(() => { const sf = window.__safe || ((n, f) => f()); sf('marks', fillMarks); sf('regions', fillRegions); sf('dims', fillDims); sf('ws', fillWs); sf('draw ' + cur, () => draw(cur)); });
})();
