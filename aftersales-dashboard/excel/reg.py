from lib import *
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.chart import LineChart, Reference
NAMES={'mo':'Market Operation','pm':'Productmanagement','pr':'Pricing','lg':'Logistik','tr':'Training','wa':'Warranty','cu':'Customer','co':'Competitor','mt':'Marketing','iv':'Bestand','mk':'Markt','tv':'Teileverfügbarkeit','er':'Ertrag und Händler','qg':'Qualität und Garantie','lx':'Luxus und Kundenerlebnis','el':'Elektro, Nachhaltigkeit, Digital'}
DS={k:k+'_monthly' for k in NAMES}
GREEN=PatternFill('solid',fgColor='C6EFCE'); YEL=PatternFill('solid',fgColor='FFEB9C'); RED=PatternFill('solid',fgColor='FFC7CE')
def lists(wb):
    ws=wb.create_sheet('Listen')
    mon=sorted({r['month'] for r in load('tv_monthly')}); reg=['Alle','DACH','Westeuropa','Südeuropa','Nordeuropa','Osteuropa']
    mo=load('mo_monthly'); dims=['Alle','Baumuster','Alter','Produktgruppe']; mem=[]
    for r in mo:
        if r['member'] not in mem: mem.append(r['member'])
    kpis=[]
    head(ws,1,['Monat','Region','Zeitraum','Dimension','Merkmal'])
    for i,m in enumerate(mon,2): ws.cell(i,1,m)
    for i,m in enumerate(reg,2): ws.cell(i,2,m)
    for i,m in enumerate(['Monat','Quartal','Jahr bis Monat'],2): ws.cell(i,3,m)
    for i,m in enumerate(dims,2): ws.cell(i,4,m)
    for i,m in enumerate(mem,2): ws.cell(i,5,m)
    widths(ws,{'A':12,'B':16,'C':16,'D':16,'E':28}); return len(mon),len(reg),len(mem)
def register(wb,bu,spec,nm,nreg,nmem):
    ds=DS[bu]; rows=load(ds); keys=list(rows[0].keys()); n=len(rows)+1
    hasdim='dim' in keys
    ws=wb.create_sheet('R_'+bu.upper()); sn=ds
    col=lambda k: f"{sn}!${CL(keys.index(k)+1)}$2:${CL(keys.index(k)+1)}${n}"
    ws['A1']=f'{NAMES[bu]} – Kennzahlen (Version 3.0, Testdaten)'; ws['A1'].font=TITLE
    ws['A2']=f'Gelbe Zellen sind Eingaben. Daten aus Blatt „{ds}“. Status: grün ≥ 100 % Zielerfüllung, gelb 95–100 %, rot < 95 %.'
    ws['A4']='Region'; ws['B4']='Alle'; ws['A5']='Monat'; ws['B5']='2026-09'; ws['A6']='Zeitraum'; ws['B6']='Monat'
    ws['A7']='Dimension'; ws['B7']='Alle'; ws['A8']='Merkmal'; ws['B8']='Alle'
    ws['A9']='Kennzahl im Diagramm'; ws['B9']=spec[0][1]
    for c in ('B4','B5','B6','B9')+(('B7','B8') if hasdim else ()): ws[c].fill=INP
    if not hasdim: ws['A7']=ws['A8']=''
    ws['D4']='Monatsindex'; ws['E4']='=MATCH(B5,Listen!$A$2:$A$13,0)'
    ws['D5']='Von Monatsindex'; ws['E5']='=IF(B6="Monat",E4,IF(B6="Quartal",MAX(1,E4-2),1))'
    ws['D6']='Anzahl Monate'; ws['E6']='=E4-E5+1'
    ws['D7']='Von Monat'; ws['E7']='=INDEX(Listen!$A$2:$A$13,E5)'; ws['D8']='Vormonat'; ws['E8']='=IF(E4>1,INDEX(Listen!$A$2:$A$13,E4-1),"")'
    dvs=[('B4',f'=Listen!$B$2:$B${nreg+1}'),('B5','=Listen!$A$2:$A$13'),('B6','=Listen!$C$2:$C$4'),('B9',f'=$A$13:$A${12+len(spec)}')]
    if hasdim: dvs+=[('B7','=Listen!$D$2:$D$5'),('B8',f'=Listen!$E$2:$E${nmem+1}')]
    for c,f in dvs:
        dv=DataValidation(type='list',formula1=f,allow_blank=False); ws.add_data_validation(dv); dv.add(c)
    h=['Kennzahl','Einheit','Ist','Vormonat','Ziel','Zielerfüllung','Status','Richtung','Aggregation','Datenfeld','Zielwert (Eingabe)']
    head(ws,12,h)
    base=f"({col('region')}=$B$4)"
    if hasdim: base+=f"*({col('dim')}=$B$7)*({col('member')}=$B$8)"
    def agg(field,month_cond,sumv):
        core=f"SUMPRODUCT({base}*{month_cond}*{col(field)})"
        return core if sumv else core+'/$E$6'
    per=f"({col('month')}>=$E$7)*({col('month')}<=$B$5)"; prev=f"({col('month')}=$E$8)"
    for i,(key,label,fmt,hib,tgt,sm) in enumerate(spec):
        r=13+i; f=FMT.get(fmt,'#,##0.0')
        ws.cell(r,1,label); ws.cell(r,2,fmt); ws.cell(r,10,key)
        ws.cell(r,3,'='+agg(key,per,sm)).number_format=f
        ws.cell(r,4,f'=IF($E$4>1,SUMPRODUCT({base}*{prev}*{col(key)}),"")').number_format=f
        ws.cell(r,8,{1:'höher = besser',0:'niedriger = besser',None:'ohne Richtung'}[hib]); ws.cell(r,9,'Summe' if sm else 'Mittelwert')
        if hib is None: ws.cell(r,5,''); ws.cell(r,6,''); ws.cell(r,7,'–'); continue
        if isinstance(tgt,str):
            ws.cell(r,11,f'Spalte {tgt}'); ws.cell(r,5,'='+agg(tgt,per,sm)).number_format=f
        else:
            c=ws.cell(r,11,tgt); c.fill=INP; c.number_format=f
            ws.cell(r,5,f'=K{r}*'+('$E$6' if sm else '1')).number_format=f
        ws.cell(r,6,f'=IFERROR(IF(H{r}="höher = besser",C{r}/E{r},E{r}/C{r}),"")').number_format='0.0%'
        ws.cell(r,7,f'=IF(F{r}="","–",IF(F{r}>=1,"grün",IF(F{r}>=0.95,"gelb","rot")))')
    last=12+len(spec); rng=f'G13:G{last}'
    ws.conditional_formatting.add(rng,CellIsRule(operator='equal',formula=['"grün"'],fill=GREEN))
    ws.conditional_formatting.add(rng,CellIsRule(operator='equal',formula=['"gelb"'],fill=YEL))
    ws.conditional_formatting.add(rng,CellIsRule(operator='equal',formula=['"rot"'],fill=RED))
    # Verlauf
    v0=last+3; ws.cell(v0-1,1,'Verlauf über zwölf Monate (Auswahl: Region, Dimension, Merkmal)').font=BOLD
    head(ws,v0,['Monat']+[s[1] for s in spec]+['Gewählt (Ist)','Ziel (Gewählt)'])
    for m in range(12):
        r=v0+1+m; ws.cell(r,1,f'=INDEX(Listen!$A$2:$A$13,{m+1})')
        for j,(key,label,fmt,hib,tgt,sm) in enumerate(spec):
            ws.cell(r,2+j,f"=SUMPRODUCT({base}*({col('month')}=$A{r})*{col(key)})").number_format=FMT.get(fmt,'#,##0.0')
        a=CL(2); b=CL(1+len(spec))
        ws.cell(r,2+len(spec),f'=INDEX({a}{r}:{b}{r},MATCH($B$9,$A$13:$A${last},0))')
        ws.cell(r,3+len(spec),f'=IFERROR(INDEX($K$13:$K${last},MATCH($B$9,$A$13:$A${last},0))*1,"")')
    ch=LineChart(); ch.title='Verlauf der gewählten Kennzahl'; ch.height=8; ch.width=20
    ch.add_data(Reference(ws,min_col=2+len(spec),min_row=v0,max_col=3+len(spec),max_row=v0+12),titles_from_data=True)
    ch.set_categories(Reference(ws,min_col=1,min_row=v0+1,max_row=v0+12)); ws.add_chart(ch,f'A{v0+15}')
    widths(ws,{'A':44,'B':14,'C':14,'D':14,'E':14,'F':14,'G':10,'H':18,'I':14,'J':22,'K':18})
    ws.freeze_panes='A13'
    return ws,last
def overview(wb,info):
    ws=wb.create_sheet('Uebersicht',0); ws['A1']='Management-Übersicht – Status aller Register'; ws['A1'].font=TITLE
    ws['A2']='Zählt die Status-Spalte jedes Registers für die dort gewählte Region, den Monat und den Zeitraum.'
    head(ws,4,['Register','Kennzahlen mit Ziel','grün','gelb','rot','Anteil grün','Ø Zielerfüllung'])
    for i,(bu,last) in enumerate(info):
        r=5+i; s=f"R_{bu.upper()}"
        ws.cell(r,1,f'=HYPERLINK("#{s}!A1","{NAMES[bu]}")')
        ws.cell(r,3,f'=COUNTIF({s}!G13:G{last},"grün")'); ws.cell(r,4,f'=COUNTIF({s}!G13:G{last},"gelb")'); ws.cell(r,5,f'=COUNTIF({s}!G13:G{last},"rot")')
        ws.cell(r,2,f'=C{r}+D{r}+E{r}'); ws.cell(r,6,f'=IFERROR(C{r}/B{r},"")').number_format='0%'
        ws.cell(r,7,f'=IFERROR(AVERAGE({s}!F13:F{last}),"")').number_format='0.0%'
    r=5+len(info); ws.cell(r,1,'Gesamt').font=BOLD
    for c in 'BCDE': ws[f'{c}{r}']=f'=SUM({c}5:{c}{r-1})'
    ws[f'F{r}']=f'=IFERROR(C{r}/B{r},"")'; ws[f'F{r}'].number_format='0%'
    widths(ws,{'A':34,'B':20,'C':8,'D':8,'E':8,'F':12,'G':16})
