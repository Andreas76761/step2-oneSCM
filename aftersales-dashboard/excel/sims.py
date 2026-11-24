from lib import *
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.chart import LineChart, BarChart, Reference
P={r['sim']+'.'+r['key']:r for r in load('sim_params')}
def pv(k): return P[k]['value']
def inputs(ws,r0,items,col=1):
    """items: [(label,key,value,unit)] -> returns dict key->cell"""
    cells={}
    for i,(lab,key,val,unit) in enumerate(items):
        r=r0+i; ws.cell(r,col,lab); c=ws.cell(r,col+1,val); c.fill=INP; ws.cell(r,col+2,unit); cells[key]=f'$B${r}'
    return cells
BASEREV="SUMPRODUCT((mo_monthly!$A$2:$A$2737=\"Alle\")*(mo_monthly!$I$2:$I$2737=\"Alle\")*(mo_monthly!$J$2:$J$2737=\"Alle\")*mo_monthly!$C$2:$C$2737)"
def s1(wb):
    ws=wb.create_sheet('Sim_Stresstest'); ws['A1']='Simulation 1: Lieferketten-Stresstest (Formeln, ohne Zufall)'; ws['A1'].font=TITLE
    ws['A2']='Ein Lieferant fällt aus. Woche für Woche: Sicherheitsbestand, Fehlmenge, Lieferfähigkeit, stehende Fahrzeuge. Gelbe Zellen sind Eingaben. Quelle der Logik: Dashboard-Simulation 1.'
    sup=load('tv_supplier'); best=max(sup,key=lambda r:r['spend_share_pct']*(2 if r['single_source'] else 1))['supplier']
    ws['A4']='Ausgefallener Lieferant'; ws['B4']=best; ws['B4'].fill=INP
    dv=DataValidation(type='list',formula1=f'=tv_supplier!$A$2:$A${len(sup)+1}'); ws.add_data_validation(dv); dv.add('B4')
    c=inputs(ws,5,[('Ausfalldauer','O',pv('s1.outage_weeks'),'Wochen'),('Sicherheitsbestand','S',pv('s1.safety_weeks'),'Wochen'),('Zusätzliche Alternativ-Quelle','A',pv('s1.alt_boost'),'% der Menge'),('Wiederanlauf','R',pv('s1.recovery_weeks'),'Wochen'),('Teilemarge','M',pv('s1.margin_pct'),'%'),('VOR-Fahrzeuge je 100 k€ Fehlmenge','V',pv('s1.vor_per_100k'),'Fahrzeuge')])
    ws['A12']='Umsatz der letzten zwölf Monate'; ws['B12']='='+BASEREV; ws['C12']='k€'
    ws['A13']='Wochenumsatz'; ws['B13']='=B12/52'; ws['B13'].number_format='#,##0.0'; ws['B12'].number_format='#,##0'
    ws['A14']='Anteil an den Einkaufsausgaben'; ws['B14']='=INDEX(tv_supplier!$D$2:$D$19,MATCH($B$4,tv_supplier!$A$2:$A$19,0))/100'; ws['B14'].number_format='0.0%'
    ws['A15']='Alternativ-Anteil laut Stammdaten'; ws['B15']='=INDEX(tv_supplier!$I$2:$I$19,MATCH($B$4,tv_supplier!$A$2:$A$19,0))'; ws['C15']='%'
    # Szenarien
    head(ws,17,['Hebel-Szenario','Sicherheitsbestand (Wo.)','Alternativ-Zusatz (%)','Wiederanlauf (Wo.)','Alt-Anteil gesamt','Puffer Start (k€)','Umsatz im Risiko (k€)','Veränderung ggü. Basis (k€)'])
    sc=[('Basis','=B6','=B7','=B8'),('Sicherheitsbestand +2 Wochen','=B6+2','=B7','=B8'),('Zusätzliche Alternativ-Quelle +20 %','=B6','=MIN(60,B7+20)','=B8'),('Wiederanlauf eine Woche schneller','=B6','=B7','=MAX(1,B8-1)')]
    T0=34; blocks=[]
    for i,(n,sa,aa,ra) in enumerate(sc):
        r=18+i; ws.cell(r,1,n); ws.cell(r,2,sa); ws.cell(r,3,aa); ws.cell(r,4,ra)
        ws.cell(r,5,f'=MIN(1,($B$15+C{r})/100)'); ws.cell(r,6,f'=B{r}*$B$14*$B$13')
        b0=3+i*4  # Spalten je Szenario: Ausfall, Defizit, Puffer, Fehlmenge  (ab Spalte 3)
        blocks.append(b0)
    head(ws,T0-1,['Woche']); ws.cell(T0-2,1,'Wochenrechnung je Szenario (S1 = Basis, S2 = Sicherheitsbestand +2, S3 = Alternativ-Quelle +20 %, S4 = schnellerer Wiederanlauf)').font=BOLD
    
    for i,b0 in enumerate(blocks):
        head(ws,T0-1,[f'Ausfallgrad S{i+1}',f'Defizit S{i+1}',f'Puffer S{i+1}',f'Fehlmenge S{i+1}'],col=b0)
    head(ws,T0-1,['Lieferfähigkeit % (Basis)','VOR-Fahrzeuge (Basis)'],col=3+16)
    for t in range(40):
        r=T0+t; ws.cell(r,1,t+1)
        for i,b0 in enumerate(blocks):
            sr=18+i; o,d,bf,u=[CL(b0+k) for k in range(4)]
            ws.cell(r,b0,f'=IF(AND({t}>=4,{t}<4+$B$5),1,IF(AND({t}>=4+$B$5,{t}<4+$B$5+$D${sr}),1-({t}-4-$B$5+1)/($D${sr}+1),0))')
            ws.cell(r,b0+1,f'=$B$14*$B$13*(1-$E${sr})*{o}{r}')
            prev=f'$F${sr}' if t==0 else f'{bf}{r-1}'
            # Puffer nach der Woche
            ws.cell(r,b0+2,f'=IF({d}{r}>0,{prev}-MIN({prev},{d}{r}),IF({prev}<$F${sr},MIN($F${sr},{prev}+$B$14*$B$13*0.15),{prev}))')
            ws.cell(r,b0+3,f'=IF({d}{r}>0,{d}{r}-MIN({prev},{d}{r}),0)')
        ws.cell(r,19,f'=100*(1-F{r}/$B$13)'); ws.cell(r,20,f'=F{r}/100*$B$10')
        for cc in range(3,21): ws.cell(r,cc).number_format='0.0'
    for i,b0 in enumerate(blocks):
        u=CL(b0+3); r=18+i; ws.cell(r,7,f'=SUM({u}{T0}:{u}{T0+39})'); ws.cell(r,8,f'=G{r}-$G$18')
        for cc in (5,): ws.cell(r,cc).number_format='0.0%'
        for cc in (6,7,8): ws.cell(r,cc).number_format='#,##0'
    ws['A24']='Ergebnisse (Basis)'; ws['A24'].font=BOLD
    res=[('Umsatz im Risiko (k€)','=G18','#,##0'),('Margenverlust (k€)','=G18*B9/100','#,##0'),('Spitze stehender Fahrzeuge je Woche',f'=MAX(T{T0}:T{T0+39})','0.0'),('Wochen unter 92 % Lieferfähigkeit',f'=COUNTIF(S{T0}:S{T0+39},"<92")','0'),('Sicherheitsbestand reicht (Wochen)','=IF(B14*(1-E18)>0,F18/(B14*B13*(1-E18)),99)','0.0'),('Hebel mit der größten Wirkung','=INDEX(A19:A21,MATCH(MIN(H19:H21),H19:H21,0))',None)]
    for i,(a,f,nf) in enumerate(res):
        ws.cell(25+i,1,a); c=ws.cell(25+i,2,f); c.font=BOLD
        if nf: c.number_format=nf
    ch=LineChart(); ch.title='Lieferfähigkeit über die Wochen (%)'; ch.height=8; ch.width=20
    ch.add_data(Reference(ws,min_col=19,min_row=T0-1,max_row=T0+39),titles_from_data=True); ch.set_categories(Reference(ws,min_col=1,min_row=T0,max_row=T0+39)); ws.add_chart(ch,'J4')
    widths(ws,{'A':44,'B':16,'C':14,'D':14,'E':14,'F':14,'G':18,'H':22}); ws.freeze_panes='A4'
def s3(wb):
    ws=wb.create_sheet('Sim_Preis_Zoll'); ws['A1']='Simulation 3: Preis, Zoll und Währung (Formeln)'; ws['A1'].font=TITLE
    ws['A2']='Preiserhöhung, Zoll und Währung je Region – Wirkung auf Menge, Umsatz, Marge und Parallelimport-Risiko. Gelbe Zellen sind Eingaben.'
    inputs(ws,4,[('Preisänderung Teile','p',pv('s3.price_pct'),'%'),('Zollsatz auf Importteile','t',pv('s3.tariff_pct'),'%'),('Währungsänderung (Lokalwährung zum Euro)','f',pv('s3.fx_pct'),'%'),('Preiselastizität der Nachfrage','e',pv('s3.elasticity'),''),('Weitergabe der Kosten in den Preis','w',pv('s3.passthrough'),'%'),('Schwelle Parallelimport (Preisabstand)','h',pv('s3.parallel_thr'),'%')])
    ws['A10']='Umsatz der letzten zwölf Monate'; ws['B10']='='+BASEREV; ws['C10']='k€'
    ws['D3']='Alle Änderungen (Δ) sind gegen die Basis gerechnet: Parallelimport, der schon ohne Preis-, Zoll- und Währungsänderung auftritt, ist herausgerechnet.'; ws['D3'].font=BOLD
    ws['A11']='Annahme Kostenanteil am Preis'; ws['B11']=0.62; ws['B11'].fill=INP; ws['B11'].number_format='0%'
    h=['Region','Importanteil %','Währungsanteil %','Preisabstand %','Menge k/Monat','Kostenanstieg','Preis Δ','Umsatzbasis (k€)','Preisabstand neu %','Verlust Parallelimport','Menge Δ','Umsatz neu (k€)','Marge Basis (k€)','Marge neu (k€)','Δ Umsatz (k€)','Δ Marge (k€)','Basis-Parallelimport (Verlust Menge)','Umsatz Basis (k€)']
    head(ws,13,h)
    for i in range(5):
        r=14+i; s=i+2
        for j,cn in enumerate('ABCDE'): ws.cell(r,1+j,f'=sim_regions!{cn}{s}')
        ws.cell(r,6,f'=$B$11*($B$5/100*B{r}/100+MAX(0,-$B$6/100)*C{r}/100)'); ws.cell(r,7,f'=$B$4/100+$B$8/100*F{r}')
        ws.cell(r,8,f'=$B$10*E{r}/4600'); ws.cell(r,9,f'=D{r}+(G{r}-$G$14)*100')
        ws.cell(r,10,f'=IF(I{r}>$B$9,MIN(0.15,0.012*(I{r}-$B$9)),0)'); ws.cell(r,11,f'=$B$7*G{r}-J{r}')
        ws.cell(r,12,f'=H{r}*(1+G{r})*(1+K{r})*(1+$B$6/100*C{r}/100)')
        ws.cell(r,17,f'=IF(D{r}>$B$9,MIN(0.15,0.012*(D{r}-$B$9)),0)'); ws.cell(r,18,f'=H{r}*(1-Q{r})')
        ws.cell(r,13,f'=R{r}-H{r}*$B$11*(1-Q{r})'); ws.cell(r,14,f'=L{r}-H{r}*$B$11*(1+K{r})*(1+F{r})')
        ws.cell(r,15,f'=L{r}-R{r}'); ws.cell(r,16,f'=N{r}-M{r}')
        for cc,nf in ((6,'0.0%'),(7,'0.0%'),(10,'0.0%'),(11,'0.0%'),(8,'#,##0'),(12,'#,##0'),(13,'#,##0'),(14,'#,##0'),(15,'#,##0'),(16,'#,##0'),(17,'0.0%'),(18,'#,##0')): ws.cell(r,cc).number_format=nf
    ws['A20']='Gesamt'; ws['A20'].font=BOLD
    for c in 'HLMNOPR': ws[f'{c}20']=f'=SUM({c}14:{c}18)'; ws[f'{c}20'].number_format='#,##0'
    ws['A22']='Ergebnisse'; ws['A22'].font=BOLD
    res=[('Δ Umsatz (k€)','=O20','#,##0'),('Δ Marge (k€)','=P20','#,##0'),('Δ Menge (%)','=(SUMPRODUCT(H14:H18,1+K14:K18)/SUMPRODUCT(H14:H18,1-Q14:Q18)-1)*100','0.0'),('Margenquote neu (%)','=N20/L20*100','0.0'),('Neue Regionen mit Parallelimport-Risiko','=COUNTIFS(J14:J18,">0",Q14:Q18,0)','0')]
    for i,(a,f,nf) in enumerate(res): ws.cell(23+i,1,a); ws.cell(23+i,2,f).number_format=nf; ws.cell(23+i,2).font=BOLD
    ch=BarChart(); ch.title='Margenveränderung je Region (k€)'; ch.height=7; ch.width=16
    ch.add_data(Reference(ws,min_col=16,min_row=13,max_row=18),titles_from_data=True); ch.set_categories(Reference(ws,min_col=1,min_row=14,max_row=18)); ws.add_chart(ch,'D22')
    widths(ws,{'A':44}); [ws.column_dimensions.__getitem__(CL(i)).__setattr__('width',15) for i in range(2,19)]
def s9(wb):
    ws=wb.create_sheet('Sim_Gesamt'); ws['A1']='Simulation 9: Gesamtrechnung (gekoppelt, Planwert ohne Zufall)'; ws['A1'].font=TITLE
    ws['A2']='Preis, Menge, Lieferfähigkeit, Lager, Garantie und Währung wirken zusammen. Ausgangswerte kommen aus den Datenblättern (letzte zwölf Monate); die Fixkosten sind so kalibriert, dass die Ausgangslage dem Betriebsergebnis im Register Ertrag entspricht. Die Zufalls-Spannweite (P10 bis P90) gibt es nur im Dashboard.'
    inputs(ws,4,[('Preisänderung','pr',pv('s9.price_pct'),'%'),('Marktentwicklung Menge','vo',pv('s9.volume_pct'),'%'),('Lieferanten-Termintreue','ot',pv('s9.otd_pp'),'Pkt.'),('Lagerbestand','st',pv('s9.stock_pct'),'%'),('Garantierate','wa',pv('s9.warranty_pct'),'%'),('Währung','fx',pv('s9.fx_pct'),'%')])
    sp=lambda k: f'SUMIFS(sim_params!$D$2:$D$60,sim_params!$A$2:$A$60,"s9",sim_params!$B$2:$B$60,"{k}")'
    ws['A11']='Annahmen (Datenblatt sim_params)'; ws['A11'].font=BOLD
    ws['A12']='Wareneinsatzquote'; ws['B12']='='+sp('cost_share_pct'); ws['C12']='%'
    ws['A13']='Kapitalkostensatz'; ws['B13']='='+sp('capital_rate_pct'); ws['C13']='%'
    ws['A14']='Lieferfähigkeit Ausgangslage'; ws['B14']='='+sp('fill_base'); ws['C14']='%'
    ws['A16']='Ausgangswerte aus den Daten (zwölf Monate)'; ws['A16'].font=BOLD
    er=lambda col,fn: f'{fn}(er_monthly!${col}$2:${col}$73,er_monthly!$A$2:$A$73,"Alle")'
    ws['A17']='Umsatz'; ws['B17']='='+BASEREV; ws['C17']='k€'
    ws['A18']='Garantiekosten (Register Warranty)'; ws['B18']='=SUMPRODUCT((wa_monthly!$A$2:$A$2737="Alle")*(wa_monthly!$I$2:$I$2737="Alle")*(wa_monthly!$J$2:$J$2737="Alle")*wa_monthly!$D$2:$D$2737)'; ws['C18']='k€'
    ws['A19']='Kapitalbindung Ø (Register Ertrag)'; ws['B19']='=AVERAGEIFS(er_monthly!$L$2:$L$73,er_monthly!$A$2:$A$73,"Alle")'; ws['C19']='k€'
    ws['A20']='Zollkosten (Register Ertrag)'; ws['B20']='=SUMIFS(er_monthly!$N$2:$N$73,er_monthly!$A$2:$A$73,"Alle")'; ws['C20']='k€'
    ws['A21']='Betriebsergebnis Aftersales (Register Ertrag)'; ws['B21']='=SUMIFS(er_monthly!$K$2:$K$73,er_monthly!$A$2:$A$73,"Alle")'; ws['C21']='k€'
    ws['A22']='Fixkosten (kalibriert)'; ws['B22']='=B17*(1-B12/100)-B18-B19*B13/100-B20-B21'; ws['C22']='k€'
    for r in range(17,23): ws.cell(r,2).number_format='#,##0'
    k=lambda e,d: f'SUMIFS(sim_coupling!$C$2:$C$8,sim_coupling!$A$2:$A$8,"{e}",sim_coupling!$B$2:$B$8,"{d}")'
    ws['E4']='Faktor Menge/Preis'; ws['F4']='='+k('Menge','Preis'); ws['E5']='Faktor Menge/Lieferfähigkeit'; ws['F5']='='+k('Menge','Lieferfähigkeit')
    ws['E6']='Faktor Fehlmenge/Termintreue'; ws['F6']='='+k('Fehlmengen-Anteil','Termintreue'); ws['E7']='Faktor Lager/Lieferfähigkeit'; ws['F7']='='+k('Lagerbestand','Lieferfähigkeit'); ws['E8']='Faktor Umsatz/Währung'; ws['F8']='='+k('Umsatz','Währung')
    levers=[('Preis ± 2 %','pr',2),('Marktmenge ± 3 %','vo',3),('Termintreue ± 2 Pkt.','ot',2),('Lager ± 10 %','st',10),('Garantierate ± 15 %','wa',15),('Währung ± 5 %','fx',5)]
    order=['pr','vo','ot','st','wa','fx']; cell={'pr':'$B$4','vo':'$B$5','ot':'$B$6','st':'$B$7','wa':'$B$8','fx':'$B$9'}
    scen=[('Ohne Hebel',None,0),('Aktuell',None,None)]+[(f'{n} (+)',kk,d) for n,kk,d in levers]+[(f'{n} (−)',kk,-d) for n,kk,d in levers]
    R0=25; head(ws,R0,['Zeile']+[s[0] for s in scen]); ws.row_dimensions[R0].height=45
    rows=['Preis %','Menge %','Termintreue Pkt.','Lager %','Garantie %','Währung %','Lieferfähigkeit %','Preis Δ','Mengeneffekt Δ','Währungseffekt','Umsatz (k€)','Kostenquote','Warenkosten (k€)','Garantie (k€)','Kapitalkosten (k€)','Betriebsergebnis (k€)']
    for i,n in enumerate(rows): ws.cell(R0+1+i,1,n)
    for j,(sn,kk,d) in enumerate(scen):
        c=CL(2+j); R=lambda i: f'{c}{R0+1+i}'
        for i,key in enumerate(order):
            if d==0 and kk is None: f='=0'
            elif kk is None: f='='+cell[key]
            else: f='='+cell[key]+(f'+{d}' if (key==kk and d>0) else (f'{d}' if key==kk else ''))
            ws[R(i)]=f
        ws[R(6)]=f'=MIN(99.5,$B$14+{R(2)}*0.8*(-$F$6)+{R(3)}*$F$7*0.2)'
        ws[R(7)]=f'={R(0)}/100'; ws[R(8)]=f'=$F$5*({R(6)}-$B$14)/100'; ws[R(9)]=f'={R(5)}/100*$F$8'
        ws[R(10)]=f'=$B$17*(1+{R(1)}/100)*(1+{R(7)})*(1+$F$4*{R(7)}+{R(8)})*(1+{R(9)})'
        ws[R(11)]=f'=$B$12/100*(1+{R(1)}/100)*(1+$F$4*{R(7)}+{R(8)})'; ws[R(12)]=f'=$B$17*{R(11)}'
        ws[R(13)]=f'=$B$18*(1+{R(4)}/100)*(1+{R(1)}/100)*0.9+$B$18*0.1'; ws[R(14)]=f'=$B$19*(1+{R(3)}/100)*$B$13/100'
        ws[R(15)]=f'={R(10)}-{R(12)}-{R(13)}-{R(14)}-$B$22-$B$20'
        for i in (10,12,13,14,15): ws[R(i)].number_format='#,##0'
    e=R0+16; E0=R0+18
    ws.cell(E0,1,'Ergebnisse').font=BOLD
    ws.cell(E0+1,1,'Betriebsergebnis Planwert (k€)'); ws.cell(E0+1,2,f'=C{e}')
    ws.cell(E0+2,1,'Betriebsergebnis ohne Hebel (k€)'); ws.cell(E0+2,2,f'=B{e}')
    ws.cell(E0+3,1,'Abweichung ohne Hebel zum Register Ertrag (k€)'); ws.cell(E0+3,2,f'=B{e}-B21')
    ws.cell(E0+4,1,'Lieferfähigkeit im Plan (%)'); ws.cell(E0+4,2,f'=C{R0+7}'); ws.cell(E0+4,2).number_format='0.0'
    for r in (E0+1,E0+2,E0+3): ws.cell(r,2).number_format='#,##0'; ws.cell(r,2).font=BOLD
    H0=E0+6; head(ws,H0,['Hebel','Ergebnis bei Erhöhung (k€)','Ergebnis bei Senkung (k€)','Wirkung (k€)','Betrag'])
    for i,(n,kk,d) in enumerate(levers):
        r=H0+1+i; up=CL(4+i); dn=CL(10+i); ws.cell(r,1,n); ws.cell(r,2,f'={up}{e}-$C${e}'); ws.cell(r,3,f'={dn}{e}-$C${e}'); ws.cell(r,4,f'=(B{r}-C{r})/2'); ws.cell(r,5,f'=ABS(D{r})')
        for cc in (2,3,4,5): ws.cell(r,cc).number_format='#,##0'
    ws.cell(H0+8,1,'Hebel mit der größten Wirkung'); ws.cell(H0+8,2,f'=INDEX(A{H0+1}:A{H0+6},MATCH(MAX(E{H0+1}:E{H0+6}),E{H0+1}:E{H0+6},0))').font=BOLD
    ch=BarChart(); ch.type='bar'; ch.title='Wirkung je Hebel auf das Betriebsergebnis (k€)'; ch.height=7; ch.width=16
    ch.add_data(Reference(ws,min_col=4,min_row=H0,max_row=H0+6),titles_from_data=True); ch.set_categories(Reference(ws,min_col=1,min_row=H0+1,max_row=H0+6)); ws.add_chart(ch,f'G{E0}')
    widths(ws,{'A':46}); [ws.column_dimensions.__getitem__(CL(i)).__setattr__('width',15) for i in range(2,17)]
