"""Weitere Blätter des Excel-Templates: Sim_Elektro (Simulation 2), Sim_Zufall (P10 bis P90 der Gesamtrechnung mit festen Zufallszahlen),
R_DT (Treiberbaum) und Szenarien (Vorlage für die Szenarien aus dem Dashboard)."""
import re, random, os
from lib import *
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.chart import BarChart, Reference
from sims import BASEREV, pv, inputs
SA = lambda sim, key: f'SUMIFS(sim_assumptions!$D$2:$D$60,sim_assumptions!$A$2:$A$60,"{sim}",sim_assumptions!$B$2:$B$60,"{key}")'
def s2(wb):
    ws = wb.create_sheet('Sim_Elektro'); ws['A1'] = 'Simulation 2: Elektro-Übergang beim Teilebedarf (Formeln, ohne Zufall)'; ws['A1'].font = TITLE
    ws['A2'] = 'Fahrzeugbestand und Teileumsatz nach Antrieb bis 2040. Bestand aus vp_parc/vp_group (Gesamt, 2026), Annahmen aus sim_assumptions. Gelbe Zellen sind Eingaben.'
    inputs(ws, 4, [('Elektroanteil Neufahrzeuge 2030', 'a', pv('s2.bev_2030'), '%'), ('Elektroanteil Neufahrzeuge 2035', 'b', pv('s2.bev_2035'), '%'), ('Teileumsatz je Elektrofahrzeug (zu Verbrenner)', 'c', pv('s2.bev_factor'), '%'), ('Lieferpflicht Verbrenner-Teile nach Serienende', 'd', pv('s2.ice_obligation'), 'Jahre'), ('Wachstum Gesamtbestand', 'e', pv('s2.parc_growth'), '% p. a.'), ('Haltekosten je 1000 Verbrenner-Artikel', 'f', pv('s2.hold_cost_k'), 'k€ p. a.')])
    ws['E4'] = 'Annahmen (sim_assumptions)'; ws['E4'].font = BOLD
    for i, (lab, k) in enumerate([('Neuzulassungsrate (% des Bestands)', 'sales_rate_pct'), ('Elektroanteil Neufahrzeuge 2026 (%)', 'bev_share_2026'), ('Obergrenze Plug-in-Hybrid (%)', 'phev_cap_pct'), ('Teileumsatz Plug-in-Hybrid zu Verbrenner', 'phev_factor'), ('Verschrottung Grundwert (%)', 'scrap_base_pct'), ('Verschrottung Zuschlag Verbrenner (Pkt.)', 'scrap_ice_extra_pct')]):
        ws.cell(5 + i, 5, lab); ws.cell(5 + i, 6, '=' + SA('s2', k))
    # Ausgangsbestand je Baureihe
    series = [r['series'] for r in load('vp_group')]
    head(ws, 13, ['Baureihe', 'Bestand 2026 (Tsd.)', 'Verbrenner %', 'Plug-in-Hybrid %', 'Elektro %'])
    for i in range(len(series)):
        r = 14 + i; ws.cell(r, 1, f'=vp_group!A{i+2}'); ws.cell(r, 2, f'=SUMPRODUCT((vp_parc!$A$2:$A$601=A{r})*(vp_parc!$C$2:$C$601="Alle")*(vp_parc!$D$2:$D$601=2026)*vp_parc!$E$2:$E$601)')
        ws.cell(r, 3, f'=vp_group!C{i+2}+vp_group!D{i+2}'); ws.cell(r, 4, f'=vp_group!E{i+2}'); ws.cell(r, 5, f'=vp_group!F{i+2}')
    L = 13 + len(series)
    ws['A25'] = 'Bestand gesamt (Tsd.)'; ws['B25'] = f'=SUM(B14:B{L})'
    ws['A26'] = 'Teileumsatz 12 Monate (k€)'; ws['B26'] = '=' + BASEREV; ws['A27'] = 'Umsatz je Fahrzeug (k€)'; ws['B27'] = '=B26/B25'
    for r, c in ((28, 'C'), (29, 'D'), (30, 'E')):
        ws[f'A{r}'] = {'C': 'Verbrenner Start (Tsd.)', 'D': 'Plug-in-Hybrid Start (Tsd.)', 'E': 'Elektro Start (Tsd.)'}[c]; ws[f'B{r}'] = f'=SUMPRODUCT($B$14:$B${L},{c}14:{c}{L})/100'
    ws['A31'] = 'Normierung auf den Bestand'; ws['B31'] = '=B25/SUM(B28:B30)'
    T0 = 34; heads = ['Jahr', 'Elektro Neuf. %', 'Verbrenner Anteil', 'Hybrid Anteil', 'Verbrenner (Tsd.)', 'Plug-in-Hybrid (Tsd.)', 'Elektro (Tsd.)', 'Neufahrzeuge', 'Verschrottung', 'Umsatz Verbrenner (k€)', 'Umsatz Hybrid (k€)', 'Umsatz Elektro (k€)', 'Teileumsatz (k€)', 'Index 2026 = 100', 'Elektro > Verbrenner', 'Elektroanteil Bestand']
    head(ws, T0 - 1, heads)
    for i in range(15):
        r = T0 + i; y = 2026 + i; ws.cell(r, 1, y)
        ws.cell(r, 2, f'=IF(A{r}<=2030,$F$6+($B$4-$F$6)*(A{r}-2026)/4,IF(A{r}<=2035,$B$4+($B$5-$B$4)*(A{r}-2030)/5,MIN(100,$B$5+(100-$B$5)*(A{r}-2035)/10)))')
        ws.cell(r, 4, f'=MIN($F$7/100,1-B{r}/100)'); ws.cell(r, 3, f'=MAX(0,1-B{r}/100-D{r})')
        if i == 0:
            ws.cell(r, 5, '=$B$28*$B$31'); ws.cell(r, 6, '=$B$29*$B$31'); ws.cell(r, 7, '=$B$30*$B$31')
        else:
            p = r - 1; tot = f'(E{p}+F{p}+G{p})'
            ws.cell(r, 8, f'={tot}*$F$5/100'); ws.cell(r, 9, f'=$F$9/100+$F$10/100*(E{p}/{tot})')
            ws.cell(r, 5, f'=E{p}*(1-I{r}-0.01)+H{r}*(1+$B$8/100)*C{r}'); ws.cell(r, 6, f'=F{p}*(1-I{r})+H{r}*(1+$B$8/100)*D{r}'); ws.cell(r, 7, f'=G{p}*(1-I{r}+0.01)+H{r}*(1+$B$8/100)*B{r}/100')
        ws.cell(r, 10, f'=E{r}*$B$27'); ws.cell(r, 11, f'=F{r}*$B$27*$F$8'); ws.cell(r, 12, f'=G{r}*$B$27*$B$6/100'); ws.cell(r, 13, f'=J{r}+K{r}+L{r}'); ws.cell(r, 14, f'=M{r}/$M${T0}*100')
        ws.cell(r, 15, f'=IF(L{r}>J{r},1,0)'); ws.cell(r, 16, f'=G{r}/(E{r}+F{r}+G{r})')
        for c in (5, 6, 7, 8, 10, 11, 12, 13): ws.cell(r, c).number_format = '#,##0'
        for c in (2, 14): ws.cell(r, c).number_format = '0.0'
        ws.cell(r, 16).number_format = '0%'
    E_ = T0 + 14
    ws['H4'] = 'Ergebnisse'; ws['H4'].font = BOLD
    res = [('Teileumsatz 2035 gegen 2026 (%)', f'=M{T0+9}/M{T0}*100-100', '0.0'), ('Spitzenjahr Teileumsatz', f'=INDEX(A{T0}:A{E_},MATCH(MAX(M{T0}:M{E_}),M{T0}:M{E_},0))', '0'), ('Elektro übertrifft Verbrenner ab', f'=IFERROR(INDEX(A{T0}:A{E_},MATCH(1,O{T0}:O{E_},0)),"nach 2040")', '0'), ('Verbrenner-Fahrzeuge 2040 (Tsd.)', f'=E{E_}', '#,##0'), ('Haltekosten Verbrenner-Teile p. a. (k€)', '=$B$9*42', '#,##0')]
    for i, (a, f, nf) in enumerate(res): ws.cell(5 + i, 8, a); c = ws.cell(5 + i, 9, f); c.number_format = nf; c.font = BOLD
    ch = BarChart(); ch.type = 'col'; ch.grouping = 'stacked'; ch.overlap = 100; ch.title = 'Teileumsatz nach Antrieb (k€)'; ch.height = 8; ch.width = 18
    ch.add_data(Reference(ws, min_col=10, min_row=T0 - 1, max_col=12, max_row=E_), titles_from_data=True); ch.set_categories(Reference(ws, min_col=1, min_row=T0, max_row=E_)); ws.add_chart(ch, f'R{T0-1}')
    widths(ws, {'A': 44, 'E': 38}); [ws.column_dimensions.__getitem__(CL(i)).__setattr__('width', 15) for i in range(2, 17) if i != 5]
def s9mc(wb):
    ws = wb.create_sheet('Sim_Zufall'); ws['A1'] = 'Gesamtrechnung mit Unsicherheit: P10, P50, P90 des Betriebsergebnisses (500 feste Zufallsläufe)'; ws['A1'].font = TITLE
    ws['A2'] = 'Regler und Ausgangswerte stammen aus dem Blatt Sim_Gesamt. Die Zufallszahlen (Spalten A bis F ab Zeile 22) sind fest gespeichert, damit sich das Ergebnis nicht bei jeder Berechnung ändert. Das Dashboard rechnet mit 2.500 Läufen, die Werte weichen deshalb leicht ab.'
    ws['A4'] = 'Gemeinsame Unsicherheit (Korrelation, %)'; ws['B4'] = '=SUMIFS(sim_params!$D$2:$D$60,sim_params!$A$2:$A$60,"s9",sim_params!$B$2:$B$60,"corr")'
    sd = [('Menge (Pkt.)', 4), ('Preis (Pkt.)', 1.2), ('Termintreue (Pkt.)', 1.2), ('Garantierate (Pkt.)', 18), ('Währung (Pkt.)', 4)]
    for i, (l, v) in enumerate(sd): ws.cell(5 + i, 1, 'Streuung ' + l); c = ws.cell(5 + i, 2, v); c.fill = INP
    ws['D4'] = 'Ergebnis'; ws['D4'].font = BOLD
    N0 = 22; N = 500; end = N0 + N - 1; col = 'S'
    for i, (a, f) in enumerate([('P10 (k€)', f'=PERCENTILE({col}{N0}:{col}{end},0.1)'), ('P50 (k€)', f'=PERCENTILE({col}{N0}:{col}{end},0.5)'), ('P90 (k€)', f'=PERCENTILE({col}{N0}:{col}{end},0.9)'), ('Mittelwert (k€)', f'=AVERAGE({col}{N0}:{col}{end})'), ('Planwert Sim_Gesamt (k€)', '=Sim_Gesamt!C41' if False else '=Sim_Gesamt!B44')]):
        ws.cell(5 + i, 4, a); c = ws.cell(5 + i, 5, f); c.number_format = '#,##0'; c.font = BOLD
    head(ws, N0 - 1, ['z (gemeinsam)', 'e Menge', 'e Preis', 'e Termintreue', 'e Garantie', 'e Währung', 'Menge %', 'Preis %', 'Termintreue Pkt.', 'Garantie %', 'Währung %', 'Lieferfähigkeit', 'Preis Δ', 'Mengeneffekt', 'Umsatz', 'Warenkosten', 'Garantie', 'Menge Δ', 'Betriebsergebnis (k€)'])
    rnd = random.Random(20261110); G = 'Sim_Gesamt!'
    for i in range(N):
        r = N0 + i
        for j in range(6): ws.cell(r, 1 + j, round(rnd.gauss(0, 1), 5))
        gk = lambda c, sdr: f'(SQRT($B$4/100)*$A{r}+SQRT(1-$B$4/100)*{c}{r})*$B${sdr}'
        ws.cell(r, 7, f'={G}$B$5+{gk("B", 5)}'); ws.cell(r, 8, f'={G}$B$4+{gk("C", 6)}'); ws.cell(r, 9, f'={G}$B$6+{gk("D", 7)}')
        ws.cell(r, 10, f'={G}$B$8+{gk("E", 8)}'); ws.cell(r, 11, f'={G}$B$9+{gk("F", 9)}')
        ws.cell(r, 12, f'=MIN({G}$F$12,{G}$B$14+I{r}*{G}$F$10*(-{G}$F$6)+{G}$B$7*{G}$F$7*{G}$F$11)')
        ws.cell(r, 13, f'=H{r}/100'); ws.cell(r, 14, f'={G}$F$5*(L{r}-{G}$B$14)/100'); ws.cell(r, 18, f'=G{r}/100')
        ws.cell(r, 15, f'={G}$B$17*(1+R{r})*(1+M{r})*(1+{G}$F$4*M{r}+N{r})*(1+K{r}/100*{G}$F$8)')
        ws.cell(r, 16, f'={G}$B$17*{G}$B$12/100*(1+R{r})*(1+{G}$F$4*M{r}+N{r})')
        ws.cell(r, 17, f'={G}$B$18*(1+J{r}/100)*(1+R{r})*{G}$F$9/100+{G}$B$18*(1-{G}$F$9/100)')
        ws.cell(r, 19, f'=O{r}-P{r}-Q{r}-{G}$B$19*(1+{G}$B$7/100)*{G}$B$13/100-{G}$B$22-{G}$B$20')
        for c in (15, 16, 17, 19): ws.cell(r, c).number_format = '#,##0'
    widths(ws, {'A': 40, 'D': 26}); [ws.column_dimensions.__getitem__(CL(i)).__setattr__('width', 14) for i in range(2, 20) if i != 4]
def dt(wb):
    t = open(os.path.join(SRC, 'dt5.js'), encoding='utf-8').read(); i = t.index('const T = {'); seg = t[i:t.index('\n  };', i)]
    ents = re.findall(r"\n\s{4}(\w+): \{ l: '([^']*)'(?:, u: '[^']*')?, f: \(a\) => ([^,]*?), fm:.*?k: \[([^\]]*)\]", seg)
    nodes = [(k, l, f, [x.strip().strip("'") for x in kids.split(',') if x.strip()]) for k, l, f, kids in ents]
    ws = wb.create_sheet('R_DT'); ws['A1'] = 'Treiberbaum: Umsatz in seine Treiber zerlegt (Formeln)'; ws['A1'].font = TITLE
    ws['A2'] = 'Der Beitrag eines Treibers = Änderung des übergeordneten Knotens × ln(Treiber neu ÷ alt) ÷ ln(Knoten neu ÷ alt); die Beiträge summieren sich exakt zur Umsatzänderung. Gelbe Zellen sind Eingaben.'
    ws['A4'] = 'Region'; ws['B4'] = 'Alle'; ws['A5'] = 'Monat (Periodenende)'; ws['B5'] = '2026-09'; ws['A6'] = 'Vergleich'; ws['B6'] = 'Vormonat'
    for c in ('B4', 'B5', 'B6'): ws[c].fill = INP
    for c, f, nm in (('B4', '=Listen!$B$2:$B$7', None), ('B5', '=Listen!$A$2:$A$13', None)):
        dv = DataValidation(type='list', formula1=f); ws.add_data_validation(dv); dv.add(c)
    dv = DataValidation(type='list', formula1='"Vormonat,Ø bis Periodenende"'); ws.add_data_validation(dv); dv.add('B6')
    ws['D4'] = 'Monatsindex'; ws['E4'] = '=MATCH(B5,Listen!$A$2:$A$13,0)'; ws['D5'] = 'Vergleichsmonate von'; ws['E5'] = '=IF(B6="Vormonat",MAX(1,E4-1),1)'; ws['D6'] = 'Vergleichsmonate bis'; ws['E6'] = '=IF(B6="Vormonat",MAX(1,E4-1),E4)'
    raw = ['revenue_k', 'dealers', 'orders', 'parc_k', 'served_k', 'visits_k', 'lines_k', 'list_k', 'price_idx', 'disc_pct']
    keys = list(load('dt5')[0].keys()); cl = lambda k: CL(keys.index(k) + 1)
    head(ws, 9, ['Rohwert', 'Aktuell', 'Vergleich'])
    for i, k in enumerate(raw):
        r = 10 + i; ws.cell(r, 1, k); rng = f'dt5!${cl(k)}$2:${cl(k)}$73'
        base = f'(dt5!$A$2:$A$73=$B$4)'
        ws.cell(r, 2, f'=SUMPRODUCT({base}*(dt5!$B$2:$B$73=$B$5)*{rng})')
        ws.cell(r, 3, f'=SUMPRODUCT({base}*(dt5!$B$2:$B$73>=INDEX(Listen!$A$2:$A$13,$E$5))*(dt5!$B$2:$B$73<=INDEX(Listen!$A$2:$A$13,$E$6))*{rng})/($E$6-$E$5+1)')
    ref = {k: r for r, k in enumerate(raw, 10)}
    def cvt(expr, c):  # a.xxx -> Zelle in Spalte c
        return re.sub(r'a\.(\w+)', lambda m: f'${c}${ref[m.group(1)]}', expr)
    head(ws, 22, ['Treiber', 'Aktuell', 'Vergleich', 'Änderung', 'Beitrag zur Umsatzänderung (k€)', 'Anteil'])
    row = {}; 
    for i, (k, l, f, kids) in enumerate(nodes): row[k] = 23 + i
    for k, l, f, kids in nodes:
        r = row[k]; ws.cell(r, 1, l); ws.cell(r, 2, '=' + cvt(f, 'B')); ws.cell(r, 3, '=' + cvt(f, 'C')); ws.cell(r, 4, f'=B{r}/C{r}-1').number_format = '0.0%'
    parent = {}
    for k, l, f, kids in nodes:
        for c in kids: parent[c] = k
    rr = row['rev']; ws.cell(rr, 5, f'=B{rr}-C{rr}')
    for k, l, f, kids in nodes:
        if k == 'rev': continue
        p = row[parent[k]]; r = row[k]; ws.cell(r, 5, f'=IF(ABS(LN(B{p}/C{p}))<1E-12,0,E{p}*LN(B{r}/C{r})/LN(B{p}/C{p}))')
    for k, l, f, kids in nodes:
        r = row[k]; ws.cell(r, 6, f'=IFERROR(E{r}/$E${rr},0)').number_format = '0%'
        for c in (2, 3, 5): ws.cell(r, c).number_format = '#,##0.00'
    leaves = [row[k] for k, l, f, kids in nodes if not kids]
    last = 23 + len(nodes); ws.cell(last + 1, 1, 'Summe der Endknoten-Beiträge (muss der Umsatzänderung entsprechen)'); ws.cell(last + 1, 5, '=SUM(' + ','.join(f'E{x}' for x in leaves) + ')').number_format = '#,##0.00'
    ws.cell(last + 2, 1, 'Prüfung: Differenz'); ws.cell(last + 2, 5, f'=E{last+1}-E{rr}').number_format = '0.000000'
    widths(ws, {'A': 42, 'B': 16, 'C': 16, 'D': 14, 'E': 30, 'F': 12})
def scn(wb):
    ws = wb.create_sheet('Szenarien'); head(ws, 1, ['Modell', 'Szenario', 'Gespeichert', 'Ablage', 'Abweichende Regler', 'Ergebnis', 'Wert'])
    ws['A3'] = 'Vorlage: Im Dashboard unter Simulationen die gespeicherten Szenarien als CSV exportieren (Schaltfläche „Szenarien als CSV“) und hier einfügen. Die Spalten entsprechen dem Export. Ergebnisse sind der Stand zum Speicherzeitpunkt.'
    widths(ws, {'A': 30, 'B': 28, 'C': 18, 'D': 18, 'E': 60, 'F': 40, 'G': 16})
