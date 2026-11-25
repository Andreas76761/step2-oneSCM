"""Erzeugt erfundene Testdaten: Vorjahreswerte (*_py) für die älteren Register und Händlerdaten je Register.
Aufruf: python3 tools/gen_dealers_and_py.py   (liest und schreibt data/, deterministisch)"""
import json, os, sys, random, hashlib
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, os.path.join(HERE, '..', 'excel'))
from lib import load, spec_from_calcs, DATA
def R(*k): return random.Random(int(hashlib.sha256('|'.join(map(str, k)).encode()).hexdigest()[:12], 16))
spec = spec_from_calcs()
def save(n, d): json.dump(d, open(os.path.join(DATA, n + '.json'), 'w', encoding='utf-8'), ensure_ascii=False)
# --- Vorjahreswerte (nur Gesamtsicht je Region und Monat, Dimension „Alle“)
SKIP = ('region', 'month', 'dim', 'member')
TARGETCOLS = ('target_k', 'budget_plan_k', 'target_stock_k')
for reg in ('mo', 'pm', 'pr', 'lg', 'tr', 'wa', 'cu', 'co', 'mt', 'iv', 'mk'):
    rows = [r for r in load(reg + '_monthly') if r.get('dim', 'Alle') == 'Alle' and r.get('member', 'Alle') == 'Alle']
    hib = {a[0]: a[3] for a in spec[reg]}; kd = {}
    for k in rows[0]:
        if k in SKIP or k in TARGETCOLS: continue
        h = R('dir', reg, k); kd[k] = (h.random() < 0.72, 0.015 + h.random() * 0.07)
    out = []
    for r in rows:
        o = {'region': r['region'], 'month': r['month']}
        for k, v in r.items():
            if k in SKIP: continue
            if k in TARGETCOLS: o[k] = v; continue
            better, g = kd[k]; hb = hib.get(k); n = R('n', reg, r['region'], r['month'], k).gauss(0, 0.012)
            sign = 1 if hb == 0 else (-1 if hb == 1 else (1 if better else -1))
            py = v * (1 + sign * (g if better else -g) + n)
            if reg == 'mo' and k == 'revenue_k' and r.get('yoy_pct') is not None: py = v / (1 + r['yoy_pct'] / 100)  # gleiche Basis wie die bisherige Vorjahres-Rechnung
            if k.endswith('_pct') and k != 'fx_effect_pct': py = min(100, max(0, py)) if k != 'yoy_pct' else py
            o[k] = round(py, 2) if isinstance(v, float) else int(round(py))
        out.append(o)
    save(reg + '_py', out)
# --- Händlerdaten
dl = load('tv_dealer'); dm = load('dealer_monthly')
def last(ds, region):
    rs = [r for r in load(ds) if r['region'] == region and r.get('dim', 'Alle') == 'Alle' and r.get('member', 'Alle') == 'Alle']; rs.sort(key=lambda r: r['month']); return rs[-1]
def mk(ds, mon, cols, cv, lim=None):
    out = []; lim = lim or {}
    for d in dl:
        g = R(ds, d['id']); base = last(mon, d['region']); row = {'id': d['id'], 'name': d['name'], 'region': d['region'], 'country': d['country']}
        for c in cols:
            v = base[c] * (1 + g.gauss(0, cv.get(c, 0.15))); lo, hi = lim.get(c, (0, None)); v = max(lo, v); v = min(hi, v) if hi else v
            row[c] = round(v, 1) if abs(base[c]) < 1000 else int(round(v))
        out.append(row)
    return out
save('lg_dealer', mk('lg_dealer', 'lg_monthly', ['otif_pct', 'fill_rate_pct', 'backorder_pct', 'lead_time_days'], {'otif_pct': .05, 'fill_rate_pct': .04, 'backorder_pct': .4, 'lead_time_days': .3}, {'otif_pct': (50, 100), 'fill_rate_pct': (50, 100), 'backorder_pct': (0.1, 40), 'lead_time_days': (0.5, None)}))
save('wa_dealer', mk('wa_dealer', 'wa_monthly', ['claim_rate_pct', 'processing_days', 'recovery_pct'], {'claim_rate_pct': .35, 'processing_days': .3, 'recovery_pct': .25}, {'claim_rate_pct': (0.1, 10), 'processing_days': (1, None), 'recovery_pct': (5, 100)}))
save('tr_dealer', mk('tr_dealer', 'tr_monthly', ['certified_pct', 'satisfaction', 'completion_pct', 'participants'], {'certified_pct': .2, 'satisfaction': .1, 'completion_pct': .12, 'participants': .5}, {'certified_pct': (10, 100), 'satisfaction': (2.5, 5), 'completion_pct': (30, 100), 'participants': (0, None)}))
save('cu_dealer', mk('cu_dealer', 'cu_monthly', ['csi_score', 'nps_score', 'churn_pct', 'repeat_pct'], {'csi_score': .08, 'nps_score': .5, 'churn_pct': .35, 'repeat_pct': .12}, {'csi_score': (40, 100), 'nps_score': (-30, 80), 'churn_pct': (1, 40), 'repeat_pct': (20, 100)}))
save('pr_dealer', mk('pr_dealer', 'pr_monthly', ['realization_pct', 'margin_pct', 'discount_pct', 'price_index'], {'realization_pct': .04, 'margin_pct': .12, 'discount_pct': .35, 'price_index': .04}, {'realization_pct': (60, 100), 'margin_pct': (10, 60), 'discount_pct': (1, 40), 'price_index': (80, None)}))
save('mt_dealer', mk('mt_dealer', 'mt_monthly', ['conv_pct', 'cac_eur', 'online_pct', 'leads'], {'conv_pct': .3, 'cac_eur': .3, 'online_pct': .4, 'leads': .6}, {'conv_pct': (1, 60), 'cac_eur': (10, None), 'online_pct': (1, 90), 'leads': (0, None)}))
# mo_dealer aus den echten Händler-Monatswerten
by = {}
for r in dm: by.setdefault(r['id'], []).append(r)
mo = []
for d in dl:
    rs = sorted(by[d['id']], key=lambda r: r['month']); rev = sum(r['revenue_k'] for r in rs); od = sum(r['orders'] for r in rs); a = sum(r['revenue_k'] for r in rs[-3:]); b = sum(r['revenue_k'] for r in rs[-6:-3])
    mo.append({'id': d['id'], 'name': d['name'], 'region': d['region'], 'country': d['country'], 'revenue_k': round(rev, 1), 'orders_12m': od, 'aov_eur': int(round(rev * 1000 / od)) if od else 0, 'margin_pct': round(sum(r['margin_pct'] for r in rs) / len(rs), 1), 'growth_pct': round((a / b - 1) * 100, 1) if b else 0})
save('mo_dealer', mo)
print('ok')
