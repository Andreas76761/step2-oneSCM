import sys, os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *; import reg, sims
from openpyxl import Workbook
OUT=sys.argv[1] if len(sys.argv)>1 else 'Aftersales_Parts_Excel_Template_v3.xlsx'
wb=Workbook(); wb.remove(wb.active)
spec=spec_from_calcs()
ORDER=['mo','pm','pr','lg','tr','wa','cu','co','mt','mk','iv','tv','er','qg','lx','el']
nm,nreg,nmem=reg.lists(wb)
info=[]
for bu in ORDER:
    ws,last=reg.register(wb,bu,spec[bu],nm,nreg,nmem); info.append((bu,last))
sims.s1(wb); sims.s3(wb); sims.s9(wb)
reg.overview(wb,info)
# Datenblätter (Import-Format: Blattname = Datensatzname, Zeile 1 = Spalten)
CH=[('Market Operation',['mo_monthly','mo_country']),('Productmanagement',['pm_monthly','pm_category']),('Pricing',['pr_monthly','pr_category','wf_monthly']),('Logistik',['lg_monthly','lg_carrier']),('Training',['tr_monthly','tr_course','hv_training']),('Warranty',['wa_monthly','wa_cause']),('Customer',['cu_monthly','cu_segment','sc_monthly']),('Competitor',['co_monthly','co_competitor']),('Marketing',['mt_monthly','mt_channel','lead_funnel']),('Markt',['mk_monthly','mk_group']),('Bestand',['iv_monthly','iv_group','iv_abc']),('Händler',['dealers','dealer_monthly']),('Europa-Netz',['branches','branch_monthly']),('Workshop',['ws_segments','ws_groups','ws_hours','ws_cap']),('Vehicle Parc',['vp_parc','vp_group','vp_ext','vp_mileage','uio_country']),('Jahresplanung und Forecast',['fc_plan','se_monthly']),('Treiberbaum',['dt5']),('Marge',['pg_margin']),('Maßnahmen',['programme','prog_effect','ma_playbook']),('Ideenspeicher',['ideen']),('Glossar',['glossary']),('Datenanbindung',['data_catalog','data_contract']),('Teileverfügbarkeit',['tv_monthly','tv_py','tv_dealer','tv_part','tv_supplier']),('Ertrag und Händler',['er_monthly','er_py','er_dealer']),('Qualität und Garantie',['qg_monthly','qg_py','qg_dealer','qg_issue','qg_recall','qg_series']),('Luxus und Kundenerlebnis',['lx_monthly','lx_py','lx_dealer','lx_segment','lx_classic']),('Elektro, Nachhaltigkeit, Digital',['el_monthly','el_py','el_dealer','el_segment']),('Simulationen (Annahmen)',['sim_params','sim_assumptions','sim_hubs','sim_programs','sim_regions','sim_sku','sim_coupling'])]
nrows=0; nds=0
for ch,dss in CH:
    for ds in dss:
        rows=load(ds); keys=list(rows[0].keys()); ws=wb.create_sheet(ds) if ds not in wb.sheetnames else wb[ds]
        ws.append(keys)
        for r in rows: ws.append([r.get(k) if not isinstance(r.get(k),(dict,list)) else json.dumps(r.get(k),ensure_ascii=False) for k in keys])
        for c in ws[1]: c.font=HF; c.fill=HFILL
        ws.freeze_panes='A2'
        for j,k in enumerate(keys,1):
            w=max(len(str(k)),*(len(str(r.get(k,''))) for r in rows[:100])); ws.column_dimensions[CL(j)].width=min(40,max(9,w+2))
        ws.sheet_properties.tabColor='999999'; nrows+=len(rows); nds+=1
for n in wb.sheetnames:
    if n.startswith('R_'): wb[n].sheet_properties.tabColor='1F3A5F'
    if n.startswith('Sim_'): wb[n].sheet_properties.tabColor='C0504D'
ws=wb.create_sheet('Hinweise',1)
txt=['Aftersales Parts – Excel-Template Version 3.0 (erfundene Testdaten)','',
'AUFBAU','  Uebersicht: Status aller Register (grün/gelb/rot) auf einen Blick.',
'  R_MO … R_EL (blau): 16 Register mit Kennzahlen, Ziel, Zielerfüllung, Status und Verlaufsdiagramm. Region, Monat, Zeitraum (Monat, Quartal, Jahr bis Monat) und bei den Kapiteln mit Dimension auch Dimension und Merkmal wählen (gelbe Zellen).',
'  Sim_Stresstest, Sim_Preis_Zoll, Sim_Gesamt (rot): drei Simulationen als Formeln, deckungsgleich mit den Dashboard-Simulationen 1, 3 und 9 (ohne Zufallsrechnung).',
'  Datenblätter (grau): ein Blatt je Datensatz, Blattname = Datensatzname, Zeile 1 = Spaltennamen. Dieses Format liest die Import-Funktion des Dashboards (nicht umbenennen).',
'  Listen: Auswahllisten für die Register.','',
'RECHENREGELN','  Mittelwert-Kennzahlen (Quoten, Preise) werden über den Zeitraum gemittelt, Summen-Kennzahlen (Umsatz, Aufträge, k€) summiert; das Ziel summierter Kennzahlen wird mit der Anzahl Monate multipliziert.',
'  Zielerfüllung: höher = besser → Ist/Ziel, niedriger = besser → Ziel/Ist. Status: grün ≥ 100 %, gelb 95–100 %, rot < 95 %. Die Ziele (gelbe Spalte K) sind Annahmen und frei änderbar.',
'  Die Register ersetzen nicht die Dashboard-Auswertung (z. B. Vergleich mit dem Vorjahr, Frühwarnung); sie rechnen die Kernlogik nach.','',
'NEUERUNG','  Absorptionsquote (er_monthly.absorption_pct) ohne Deckelung bei 99,6 %: Werte bis 100,9 %, das Ziel von 100 % ist erreichbar.','',
f'ENTHALTEN: {nds} Datensätze mit {nrows} Datenzeilen (alle Datensätze des Dashboards außer Fotos und Geodaten).',
'NICHT ENTHALTEN: Zufallsrechnungen (P10/P50/P90) und die übrigen sechs Simulationen, Treiberbaum-Grafik, Händler-Rankings – diese gibt es nur im Dashboard.']
for i,t in enumerate(txt,1): ws.cell(i,1,t)
ws['A1'].font=TITLE; ws.column_dimensions['A'].width=170
for r in (3,9,13,16): ws.cell(r,1).font=BOLD
wb.save(OUT); print(len(wb.sheetnames),nds,nrows)
