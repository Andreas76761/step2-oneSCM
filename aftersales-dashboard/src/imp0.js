(function () {
  // Kern für den Import: eigene Daten ersetzen oder ergänzen einen Datensatz; davon abgeleitete (berechnete) Datensätze werden lokal neu gerechnet.
  const d = window.dash; if (!d || window.__imp) return;
  const defs = {}, OV = {}, META = {}, cache = {}; let ok = true, ver = 0; const KEY = 'aftersales-import-v1';
  // Kapitel (Register) und ihre importierbaren Datensätze
  const CH = [
    ['Market Operation', ['mo_monthly', 'mo_country', 'mo_py', 'mo_dealer']], ['Productmanagement', ['pm_monthly', 'pm_category', 'pm_py']], ['Pricing', ['pr_monthly', 'pr_category', 'wf_monthly', 'pr_py', 'pr_dealer']], ['Logistik', ['lg_monthly', 'lg_carrier', 'lg_py', 'lg_dealer']],
    ['Training', ['tr_monthly', 'tr_course', 'hv_training', 'tr_py', 'tr_dealer']], ['Warranty', ['wa_monthly', 'wa_cause', 'wa_py', 'wa_dealer']], ['Customer', ['cu_monthly', 'cu_segment', 'sc_monthly', 'cu_py', 'cu_dealer']], ['Competitor', ['co_monthly', 'co_competitor', 'co_py']],
    ['Marketing', ['mt_monthly', 'mt_channel', 'lead_funnel', 'mt_py', 'mt_dealer']], ['Markt', ['mk_monthly', 'mk_group', 'mk_py']], ['Bestand', ['iv_monthly', 'iv_group', 'iv_abc', 'iv_py']], ['Händler', ['dealers', 'dealer_monthly']],
    ['Europa-Netz', ['branches', 'branch_monthly']], ['Workshop', ['ws_segments', 'ws_groups', 'ws_hours', 'ws_cap']], ['Vehicle Parc', ['vp_parc', 'vp_group', 'vp_ext', 'vp_mileage', 'uio_country']],
    ['Jahresplanung und Forecast', ['fc_plan', 'se_monthly']], ['Treiberbaum', ['dt5']], ['Marge', ['pg_margin']], ['Maßnahmen', ['programme', 'prog_effect', 'ma_playbook']], ['Ideenspeicher', ['ideen']],
    ['Glossar', ['glossary']], ['Datenanbindung', ['data_catalog', 'data_contract']],
    ['Teileverfügbarkeit', ['tv_monthly', 'tv_py', 'tv_dealer', 'tv_part', 'tv_supplier']], ['Ertrag und Händler', ['er_monthly', 'er_py', 'er_dealer']], ['Qualität und Garantie', ['qg_monthly', 'qg_py', 'qg_dealer', 'qg_issue', 'qg_recall', 'qg_series']], ['Luxus und Kundenerlebnis', ['lx_monthly', 'lx_py', 'lx_dealer', 'lx_segment', 'lx_classic']], ['Elektro, Nachhaltigkeit, Digital', ['el_monthly', 'el_py', 'el_dealer', 'el_segment']], ['Simulationen (Annahmen)', ['sim_params', 'sim_assumptions', 'sim_hubs', 'sim_programs', 'sim_regions', 'sim_sku', 'sim_coupling']]
  ];
  const LAB = { mo_monthly: 'Monatswerte', mo_country: 'Länder', pm_monthly: 'Monatswerte', pm_category: 'Kategorien', pr_monthly: 'Monatswerte', pr_category: 'Kategorien', wf_monthly: 'Preiswasserfall', lg_monthly: 'Monatswerte', lg_carrier: 'Carrier', tr_monthly: 'Monatswerte', tr_course: 'Schulungsthemen', hv_training: 'Hochvolt-Kompetenz', wa_monthly: 'Monatswerte', wa_cause: 'Ursachen', cu_monthly: 'Monatswerte', cu_segment: 'Segmente', sc_monthly: 'Serviceverträge', co_monthly: 'Monatswerte', co_competitor: 'Wettbewerber', mt_monthly: 'Monatswerte', mt_channel: 'Kanäle', lead_funnel: 'Lead-Strecke', mk_monthly: 'Monatswerte', mk_group: 'Produktgruppen', iv_monthly: 'Monatswerte', iv_group: 'Produktgruppen', iv_abc: 'ABC/XYZ', dealers: 'Händlerstamm', dealer_monthly: 'Händler-Monatswerte', branches: 'Niederlassungen', branch_monthly: 'Niederlassungs-Monatswerte', ws_segments: 'Fahrzeugsegmente', ws_groups: 'Teilegruppen', ws_hours: 'Stunden und Sätze', ws_cap: 'Kapazität', vp_parc: 'Fahrzeugbestand', vp_group: 'Antriebsarten', vp_ext: 'UIO je Baureihe', vp_mileage: 'Laufleistung', uio_country: 'UIO je Land', fc_plan: 'Jahresplan', se_monthly: 'Saisonalität', dt5: 'Treiberbaum', pg_margin: 'Marge je Produktgruppe', programme: 'Programme', prog_effect: 'Programmwirkung', ma_playbook: 'Playbook', ideen: 'Ideen', glossary: 'Glossar', data_catalog: 'Datenkatalog', data_contract: 'Datenvertrag', tv_monthly: 'Monatswerte', tv_dealer: 'Händler (Lieferzeit, Quoten)', tv_part: 'Teile', tv_supplier: 'Lieferanten', er_monthly: 'Monatswerte', er_dealer: 'Händler (Ertrag)', qg_monthly: 'Monatswerte', qg_issue: 'Frühwarnung', qg_recall: 'Rückrufe', qg_series: 'Baureihen', lx_monthly: 'Monatswerte', lx_segment: 'Kundensegmente', lx_classic: 'Klassiker', el_monthly: 'Monatswerte', el_segment: 'Ausgangslage', mo_py: 'Vorjahreswerte', pm_py: 'Vorjahreswerte', pr_py: 'Vorjahreswerte', lg_py: 'Vorjahreswerte', tr_py: 'Vorjahreswerte', wa_py: 'Vorjahreswerte', cu_py: 'Vorjahreswerte', co_py: 'Vorjahreswerte', mt_py: 'Vorjahreswerte', mk_py: 'Vorjahreswerte', iv_py: 'Vorjahreswerte', mo_dealer: 'Händler', lg_dealer: 'Händler', wa_dealer: 'Händler', tr_dealer: 'Händler', cu_dealer: 'Händler', pr_dealer: 'Händler', mt_dealer: 'Händler', tv_py: 'Vorjahreswerte', er_py: 'Vorjahreswerte', qg_py: 'Vorjahreswerte', lx_py: 'Vorjahreswerte', el_py: 'Vorjahreswerte', qg_dealer: 'Händler', lx_dealer: 'Händler', el_dealer: 'Händler', sim_params: 'Regler und Voreinstellungen', sim_assumptions: 'Feste Rechengrößen', sim_hubs: 'Lagerstandorte', sim_programs: 'Programme (Annahmen)', sim_regions: 'Regionen (Zoll, Währung)', sim_sku: 'Teileklassen', sim_coupling: 'Kopplungsfaktoren' };
  const RAW = new Set(CH.flatMap((c) => c[1]));
  const hasOv = (id, seen) => { if (OV[id] !== undefined) return true; const df = defs[id]; if (!df) return false; seen = seen || new Set(); if (seen.has(id)) return false; seen.add(id); return df.inputs.some((i) => hasOv(i, seen)); };
  let od = null, oc = null;
  try {
    oc = d.calc.bind(d); od = d.data.bind(d);
    d.calc = function (id, o) { defs[id] = o; return oc(id, o); };
    d.data = function (id) {
      if (!Object.keys(OV).length || !hasOv(id)) return od(id);
      if (OV[id] !== undefined) return { status: 'ok', data: OV[id] };
      const c = cache[id]; if (c && c.v === ver) return c.r;
      const ins = defs[id].inputs.map((i) => d.data(i)), bad = ins.find((x) => x.status !== 'ok'); if (bad) return bad;
      let r; try { r = { status: 'ok', data: defs[id].fn.apply(null, ins.map((x) => x.data)) }; } catch (e) { r = { status: 'error' }; }
      cache[id] = { v: ver, r }; return r;
    };
    if (d.data === od) ok = false;
  } catch (e) { ok = false; }
  const redraw = () => { try { const n = String(Date.now()); d.setParams({ _imp: n }); setTimeout(() => { try { d.setParams({ _imp: null }); } catch (e) { /* */ } }, 0); } catch (e) { /* */ } if (window.__hod && window.__hod.redraw) { try { window.__hod.redraw(); } catch (e) { /* */ } } };
  const save = () => { try { const s = JSON.stringify({ OV, META }); if (s.length > 4500000) return false; localStorage.setItem(KEY, s); return true; } catch (e) { return false; } };
  function set(id, rows, meta) { OV[id] = rows; META[id] = Object.assign({ at: new Date().toISOString(), rows: rows.length }, meta || {}); ver++; Object.keys(cache).forEach((k) => delete cache[k]); const saved = save(); redraw(); return saved; }
  function clear(id) { if (id) { delete OV[id]; delete META[id]; } else { Object.keys(OV).forEach((k) => delete OV[k]); Object.keys(META).forEach((k) => delete META[k]); } ver++; Object.keys(cache).forEach((k) => delete cache[k]); save(); redraw(); }
  // Originaldaten (ohne Import) eines Datensatzes
  const original = (id) => { try { const r = od ? od(id) : d.data(id); return r.status === 'ok' ? r.data : null; } catch (e) { return null; } };
  const current = (id) => { const r = d.data(id); return r.status === 'ok' ? r.data : null; };
  try { const s = localStorage.getItem(KEY); if (s) { const o = JSON.parse(s); if (o && o.OV) { Object.assign(OV, o.OV); Object.assign(META, o.META || {}); ver++; } } } catch (e) { /* kein lokaler Speicher */ }
  window.__imp = { CH, LAB, RAW, set, clear, original, current, list: () => Object.keys(OV).map((k) => Object.assign({ id: k }, META[k])), active: () => Object.keys(OV).length, ok: () => ok, defs: () => defs };
})();
