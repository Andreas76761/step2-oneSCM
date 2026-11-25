"""Prüft das Excel-Template: baut es, rechnet es mit LibreOffice neu und vergleicht Kernwerte mit den Daten.
Aufruf: python3 excel/test_template.py   (benötigt openpyxl und soffice)"""
import json, os, shutil, subprocess, sys, tempfile, statistics as st
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import openpyxl
from lib import load
res = []
def chk(name, ok, info=''):
    res.append(ok); print(('  ok     ' if ok else '  FEHLER ') + name + ('' if ok else '  → ' + str(info)))
tmp = tempfile.mkdtemp(); src = os.path.join(tmp, 'template.xlsx')
subprocess.run([sys.executable, os.path.join(HERE, 'main.py'), src], check=True, capture_output=True)
subprocess.run(['soffice', '--headless', '--calc', '--convert-to', 'xlsx', '--outdir', os.path.join(tmp, 'rc'), src], capture_output=True, timeout=300)
wb = openpyxl.load_workbook(os.path.join(tmp, 'rc', 'template.xlsx'), data_only=True)
errs = [(w.title, c.coordinate) for w in wb for row in w.iter_rows() for c in row if isinstance(c.value, str) and (c.value.startswith('#') or c.value.startswith('Err:'))]
chk('keine Formelfehler', not errs, errs[:3])
chk('16 Register, Treiberbaum, 5 Simulationsblätter', sum(n.startswith('R_') and n != 'R_DT' for n in wb.sheetnames) == 16 and sum(n.startswith('Sim_') for n in wb.sheetnames) == 5 and 'R_DT' in wb.sheetnames, wb.sheetnames[:8])
mo = [r for r in load('mo_monthly') if r['region'] == 'Alle' and r['dim'] == 'Alle' and r['member'] == 'Alle' and r['month'] == '2026-09'][0]
r = wb['R_MO']; chk('R_MO Umsatz Sept. 2026 = Rohdaten', abs(r['C13'].value - mo['revenue_k']) < 1e-6, (r['C13'].value, mo['revenue_k']))
er = [x for x in load('er_monthly') if x['region'] == 'Alle']; ref = sum(x['ebit_k'] for x in er)
def by_label(ws, text):
    for rw in range(1, 80):
        if text in str(ws.cell(rw, 1).value): return ws.cell(rw, 2).value if ws.cell(rw, 2).value is not None else ws.cell(rw, 5).value
g = wb['Sim_Gesamt']; ohne = by_label(g, 'ohne Hebel (k€)'); abw = by_label(g, 'Abweichung ohne Hebel')
chk('Sim_Gesamt: ohne Hebel = Betriebsergebnis Register Ertrag', isinstance(ohne, (int, float)) and abs(ohne - ref) < 0.01, (ohne, ref))
chk('Sim_Gesamt: Abweichung zum Register = 0', isinstance(abw, (int, float)) and abs(abw) < 1e-6, abw)
p = wb['Sim_Preis_Zoll']; chk('Sim_Preis_Zoll: Zeile „Neue Regionen“ vorhanden', any('Neue Regionen' in str(p.cell(rw, 1).value) for rw in range(20, 35)))
s1 = wb['Sim_Stresstest']; chk('Sim_Stresstest: Umsatz im Risiko = Dashboard-Referenz (429,19)', abs(by_label(s1, 'Umsatz im Risiko') - 429.194423) < 0.01, by_label(s1, 'Umsatz im Risiko'))
chk('Sim_Preis_Zoll: Δ Umsatz = Dashboard-Referenz (−1355,29)', abs(by_label(p, 'Δ Umsatz') + 1355.289716) < 0.01, by_label(p, 'Δ Umsatz'))
import json as _j
base = _j.load(open(os.path.join(HERE, '..', 'test', 'baseline.json'), encoding='utf-8'))['s2']; e = wb['Sim_Elektro']
chk('Sim_Elektro: Teileumsatz 2035 gegen 2026 = Dashboard', abs(e['I5'].value - base[0][1]) < 1e-4, (e['I5'].value, base[0][1]))
chk('Sim_Elektro: Spitzenjahr, Verbrenner 2040, Haltekosten = Dashboard', e['I6'].value == base[1][1] and abs(e['I8'].value - base[3][1]) < 1e-3 and abs(e['I9'].value - base[4][1]) < 1e-6, [e['I6'].value, e['I8'].value, e['I9'].value])
d = wb['R_DT']; diff = by_label(d, 'Prüfung: Differenz'); chk('R_DT: Beiträge der Endknoten summieren sich zur Umsatzänderung', diff is not None and abs(d.cell(next(r for r in range(1, 60) if str(d.cell(r, 1).value).startswith('Prüfung')), 5).value) < 1e-6, diff)
z = wb['Sim_Zufall']; chk('Sim_Zufall: Mittelwert der 500 Läufe liegt nahe am Planwert (±3 %)', abs(z['E8'].value / z['E9'].value - 1) < 0.03 and z['E5'].value < z['E6'].value < z['E7'].value, [z.cell(5 + i, 5).value for i in range(5)])
chk('Blatt Szenarien (Vorlage) vorhanden', 'Szenarien' in wb.sheetnames)
abs_ = [x['absorption_pct'] for x in load('er_monthly')]; chk('Absorptionsquote ohne Deckelung', max(abs_) >= 100, max(abs_))
shutil.rmtree(tmp, ignore_errors=True)
print('\n%d von %d Prüfungen bestanden' % (sum(res), len(res))); sys.exit(0 if all(res) else 1)
