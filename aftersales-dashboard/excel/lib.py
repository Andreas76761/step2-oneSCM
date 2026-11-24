import json,re,os
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter as CL
HERE=os.path.dirname(os.path.abspath(__file__))
DATA=os.path.join(HERE,'..','data')
SRC=os.path.join(HERE,'..','src')
def load(n):
    with open(os.path.join(DATA,n+'.json'),encoding='utf-8') as f: return json.load(f)
HF=Font(bold=True,color='FFFFFF'); HFILL=PatternFill('solid',fgColor='1F3A5F')
INP=PatternFill('solid',fgColor='FFF2CC'); GREY=PatternFill('solid',fgColor='F2F2F2')
TITLE=Font(bold=True,size=14); BOLD=Font(bold=True)
FMT={'pct':'0.0"%"','eur_k':'#,##0" k€"','int':'#,##0','days':'0.0" Tage"','n1':'0.0','eur':'#,##0.00" €"','eur0':'#,##0" €"','idx':'0.0','score':'0.00','pts':'0.0" Pkt."','eur_m':'#,##0.0" Mio €"'}
def head(ws,row,vals,col=1):
    for j,v in enumerate(vals):
        c=ws.cell(row,col+j,v); c.font=HF; c.fill=HFILL; c.alignment=Alignment(horizontal='center',vertical='center',wrap_text=True)
def widths(ws,ws_w):
    for k,v in ws_w.items(): ws.column_dimensions[k].width=v
SUMKPI={'revenue_k','orders','new_skus','price_changes','trainings','participants','claims','claim_cost_k','leads','budget_k','reach_k','competitor_promos'}
def spec_from_calcs():
    t=open(os.path.join(SRC,'calcs.js'),encoding='utf-8').read(); out={}
    for bu in ['mo','pm','pr','lg','tr','wa','cu','co','mt','iv','mk']:
        i=t.find(f"dash.calc('kpi_{bu}'"); seg=t[i:i+60000]
        m=re.search(r"const defs = (\[\[.*?\]\]);",seg,re.S); out[bu]=json.loads(m.group(1))
        out[bu]=[[k,l,f,h,tg,1 if k in SUMKPI else 0] for k,l,f,h,tg,_ in out[bu]]
    t3=open(os.path.join(SRC,'v3calc.js'),encoding='utf-8').read()
    sp=json.loads(re.search(r"window.__v3spec = (\{.*?\});\n",t3,re.S).group(1))
    for k,v in sp.items(): out[k]=[[a,b,c,d,e,(1 if f=='sum' else 0)] for a,b,c,d,e,f in v]
    return out
