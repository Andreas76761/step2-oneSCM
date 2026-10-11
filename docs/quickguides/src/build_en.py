# -*- coding: utf-8 -*-
"""Setzt die englischen Übersetzungsslices zu spec_en.json (Vans) und spec_en_pkw.json (Cars) zusammen."""
import json, sys, os
H = os.path.dirname(os.path.abspath(__file__))
de = json.load(open(os.path.join(H, "spec.json"), encoding="utf-8"))
de_pkw = json.load(open(os.path.join(H, "spec_pkw.json"), encoding="utf-8"))
en = []
for i in range(1, 5):
    en += json.load(open(os.path.join(H, "en", "slice%d_en.json" % i), encoding="utf-8"))
assert [g["nr"] for g in en] == [g["nr"] for g in de]

def fix_paths(o):
    if isinstance(o, dict):
        return {k: ("img_en/" + v[4:] if k in ("path", "img") and isinstance(v, str) and v.startswith("img/") else fix_paths(v)) for k, v in o.items()}
    if isinstance(o, list): return [fix_paths(x) for x in o]
    return o

for g in en:
    g["variant"] = "for Vans"; g["standLabel"] = "AS OF"; g["stand"] = "2026-10-11"; g["slug"] = g["slug"] + "_EN"
en = fix_paths(en)
json.dump(en, open(os.path.join(H, "spec_en.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# Cars-Variante: an den JSON-Pfaden, an denen sich die deutsche Van- und Pkw-Fassung unterscheiden,
# den englischen Text durch die englische Übersetzung der deutschen Pkw-Fassung ersetzen.
PKW_EN = {
    "Kann ich mit der Pkw-Rolle Van-Verträge anlegen?": "Can I create van contracts with the Cars role?",
    "Nein, dafür ist die Van-Rolle und der passende Kontext nötig (Kapitel 2.2).": "No, this requires the Vans role and the matching context (Chapter 2.2).",
    "oneSCM.DealerPKW": "oneSCM.DealerPKW",
    "im Pkw-Geschäft": "in the cars business",
    "Ab Bestellung: **Auftragsnummer aus GO**": "From order: **order number from GO**",
    "ab Bestellung die Auftragsnummer aus GO": "from order the order number from GO",
    "Baumuster, OTR-Deal-ID, GO-Auftragsnummer oder VIN/FIN": "model series, OTR deal ID, GO order number or VIN",
    "aus OTR, GO oder MIC (Kapitel 19.2); Van-Stammdaten aus CEPRO": "from OTR, GO or MIC (Chapter 19.2); van master data from CEPRO",
    "Hilfestellung Servicevertrag Pkw über den Supportweg Ihres Marktes (Kapitel 23.5)": "service contract support for Cars via your market's support channel (Chapter 23.5)",
    "**Hilfestellung Servicevertrag Pkw**: Supportweg Ihres Marktes (Kapitel 23.5)": "**Service contract support Cars**: your market's support channel (Chapter 23.5)",
    "Diese Pkw-Variante beruht auf dem Van-Beispiel „Antragserstellung und -verwaltung“; Pkw-Kennungen siehe Kapitel 21.2.": "This Cars edition is based on the Vans example \"Application creation and management\"; see Chapter 21.2 for car identifiers.",
    "Beispiel 1 entspricht dem Fall der Van-Vorlage „Antragserstellung und -verwaltung“, hier mit Pkw-Kennungen.": "Example 1 corresponds to the case in the Vans template \"Application creation and management\", here with car identifiers.",
    "Welches Beispiel passt für Pkw-Händler?": "Which example suits car dealers?",
    "beide mit Pkw-Kennungen": "both with car identifiers",
    "im Design der Van-Vorlage, als Pkw-Variante": "in the design of the Vans template, as Cars edition",
    "OTR-Deal-ID, GO-Auftragsnummer, Baumuster": "OTR deal ID, GO order number, model series",
}
# Wortweise Ersetzung innerhalb eines Strings: deutsche Pkw-Teilstrings → englische Teilstrings, angewendet auf den englischen Van-Text
# ist nicht möglich, daher: an abweichenden Pfaden wird der ganze String neu gebildet aus dem englischen Van-Text plus Ersetzung der
# englischen Entsprechung der Van-Formulierung. Dafür die Van→Pkw-Paare auf Englisch:
PAIRS_EN = [
    ("Can I create car contracts with the Vans role?", "Can I create van contracts with the Cars role?"),
    ("No, this requires the Cars role and the matching context (Chapter 2.2).", "No, this requires the Vans role and the matching context (Chapter 2.2)."),
    ("oneSCM.DealerVAN", "oneSCM.DealerPKW"),
    ("in the vans business", "in the cars business"),
    ("From order: VerSO **order ID**", "From order: **order number from GO**"),
    ("From order: VerSO-**order ID**", "From order: **order number from GO**"),
    ("from order the VerSO order ID", "from order the order number from GO"),
    ("VerSO order ID", "GO order number"),
    ("sc-van@mercedes-benz.com", "your market's support channel (Chapter 23.5)"),
    ("from OTR, VERSO/VOM or MIC;", "from OTR, GO or MIC (Chapter 19.2);"),
    ("Vans identifiers", "Cars identifiers"),
]
import copy, re
def walk(a, b, c, path=()):
    """a: de van, b: de pkw, c: en van (wird in-place zur en-pkw-Fassung)."""
    if isinstance(a, dict):
        for k in a:
            if isinstance(a[k], (dict, list)): walk(a[k], b[k], c[k], path + (k,))
            elif isinstance(a[k], str) and a[k] != b[k]: c[k] = translate_pkw(a[k], b[k], c[k])
    elif isinstance(a, list):
        for i in range(len(a)):
            if isinstance(a[i], (dict, list)): walk(a[i], b[i], c[i], path + (i,))
            elif isinstance(a[i], str) and a[i] != b[i]: c[i] = translate_pkw(a[i], b[i], c[i])

unresolved = []
def translate_pkw(de_van, de_pkw, en_van):
    if de_pkw in PKW_EN: return PKW_EN[de_pkw]
    out = en_van
    for a, b in PAIRS_EN:
        if a in out: out = out.replace(a, b)
    # Rest: VAN-Rolle, E-Mail etc.
    out = out.replace("oneSCM.DealerVAN", "oneSCM.DealerPKW")
    if out == en_van and not de_pkw.endswith("_Pkw"): unresolved.append((de_van, de_pkw, en_van))
    return out

en_pkw = copy.deepcopy(en)
walk(de, de_pkw, en_pkw)
for g in en_pkw:
    g["variant"] = "for Cars"; g["slug"] = g["slug"].replace("_EN", "_EN_Cars")
json.dump(en_pkw, open(os.path.join(H, "spec_en_pkw.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(en), "guides EN;", len(unresolved), "unresolved Cars substitutions")
for u in unresolved: print("  DE-VAN:", u[0][:90]); print("  DE-PKW:", u[1][:90]); print("  EN    :", u[2][:90])
