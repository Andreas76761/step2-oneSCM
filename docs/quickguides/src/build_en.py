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

# ---- Abgleich mit geänderten deutschen Inhalten: neue Strings (eingefügt) und geänderte Strings (ersetzt)
ADDED_EN = {
    "Baumuster mit sechs, sieben und acht Stellen sind zulässig; Contingent-Produkte (Verkaufslogik „FRD Not Related“) finden Sie über das Baumuster, nicht über FIN/VIN (5.4).": "Model series with six, seven and eight digits are accepted; contingent products (sales logic \"FRD Not Related\") are found via the model series, not via the VIN (5.4).",
    "Laufleistung, Kilometerstandshistorie und Prognose": "Mileage, mileage history and projection",
    "Prüfen Sie die **Kilometerstandshistorie** und lösen Sie bei fehlenden MIC-Daten die **Kilometerstandsprognose** aus (10.9); sie ist ein Referenzwert und löst kein Vertragsende aus.": "Check the **mileage history** and trigger the **mileage projection** when MIC data is missing (10.9); it is a reference value and does not end the contract.",
    "Laufleistung prüfen": "Check mileage",
    "Massenanlage und Validierung von Fahrzeuglisten": "Bulk creation and validation of vehicle lists",
    "Für Flotten übergeben Sie Fahrzeuglisten an die **Massenanlage**; das System prüft je Fahrzeug Produkt, Erstzulassung und Laufleistung und benachrichtigt Händler, MO und MPC über die Ergebnistabelle (12.9).": "For fleets, hand vehicle lists to **bulk creation**; the system checks product, first registration and mileage per vehicle and notifies dealer, MO and MPC about the result table (12.9).",
    "Massenanlage": "Bulk creation",
    "Ein Cluster für den relativen Basispreis erfordert einen Preisfaktor (14.9).": "A cluster for the relative base price requires a price factor (14.9).",
    "Fahrzeuggruppen: Das Produkt mit aktueller Preisversion ist vorausgewählt, abgelaufene Preisversionen erscheinen nicht; Name und Beschreibung erzeugt das System auf Wunsch aus den Filtern (14.11).": "Vehicle groups: the product with a current price version is preselected, expired price versions are not shown; on request the system generates name and description from the filters (14.11).",
    "Beim Duplizieren einer Kampagne setzt das System die External Campaign ID zurück; deaktivierte Kampagnen bleiben bearbeitbar (14.13).": "When a campaign is duplicated, the system resets the External Campaign ID; deactivated campaigns remain editable (14.13).",
}
CHANGED_EN = {
    "Assistenten enden einheitlich mit dem Schritt „Overview & Confirmation“; Marktnamen erscheinen in der Sprache der Markteinstellungen (3.3, 3.9).": "Wizards end uniformly with the step \"Overview & Confirmation\"; market names appear in the language of the market settings (3.3, 3.9).",
    "Liefert die Kennung keine Produkte, prüfen Sie Erstzulassungsdatum und Laufleistung: Fahrzeuge über dem Höchstalter oder der Maximallaufleistung des Produkts erhalten keine Ergebnisse (5.3).": "If the identifier returns no products, check the first registration date and mileage: vehicles above the product's maximum age or maximum mileage receive no results (5.3).",
    "10.5 – 10.9 Beenden und nachvollziehen": "10.5 – 10.9 Ending and tracing",
    "Ein Kilometerstand aus einer Werkstattrechnung über der Vertragslaufleistung setzt den Status „abgelaufen nach Laufleistung“ (10.6).": "A mileage from a workshop invoice above the contract mileage sets the status \"expired by mileage\" (10.6).",
    "Mit der Annahme einer Werkstattrechnung übernimmt das System den Kilometerstand in die Historie des Vertrags (10.9, 11.5).": "When a workshop invoice is accepted, the system transfers the mileage into the contract's mileage history (10.9, 11.5).",
    "12.5 – 12.9 Bearbeitung": "12.5 – 12.9 Processing",
    "Technical Options, SA-Matching, Coverage- und Industry-Codes": "Technical options, SA matching, coverage and industry codes",
    "Pflegen Sie **Technical Options, SA-Matching, Coverage- und Industry-Codes** zentral (15.7); sie steuern Produktzuordnung und Leistungsbezug. Märkte erscheinen dabei in der Sprache der Markteinstellungen.": "Maintain **technical options, SA matching, coverage and industry codes** centrally (15.7); they control product assignment and claiming of services. Markets appear in the language of the market settings.",
    "Gruppennamen technischer Optionen sind je Division eindeutig; der Blueprint-Assistent endet mit dem Schritt „Overview & Confirmation“ (15.2, 15.7).": "Group names of technical options are unique per division; the Blueprint wizard ends with the step \"Overview & Confirmation\" (15.2, 15.7).",
    "Automatisierte End-to-End-Tests für Fahrzeug- und Produktmanagement sind Teil des Testnachweises je Release (16.4).": "Automated end-to-end tests for vehicle and product management are part of the test evidence per release (16.4).",
    "Van-Stammdaten kommen über den Batch-Job CeproImport; Störungen von Batch-Jobs melden Sie mit Jobnamen und Zeitpunkt (19.4, 19.22).": "Van master data arrives via the CeproImport batch job; report batch job incidents with job name and time (19.4, 19.22).",
    "Der BM6-Ablauf für Vans bietet alle zu Baumuster und Motortyp passenden Verkaufsbezeichnungen an; Baumuster mit sieben und acht Stellen sind zulässig (21.2).": "The BM6 flow for Vans offers all sales designations matching model series and engine type; model series with seven and eight digits are accepted (21.2).",
    "Das System rechnet Kilometer nicht in Meilen um, führt keine ISP-Code-Prüfung durch und ergänzt die Fahrgestellnummer bei Deal- oder Order-ID nur über die Systemübergabe (22.2).": "The system does not convert kilometers to miles, performs no ISP code check and adds the chassis number for deal or order IDs only via the system handover (22.2).",
    "Bei der Vertragserstellung für MBIL kann die Produktabfrage mit einem Serverfehler enden; wiederholen Sie die Abfrage und melden Sie den Fall (23.2).": "During contract creation for MBIL, the product query can end with a server error; repeat the query and report the case (23.2).",
}
prev_path = os.path.join(H, "spec_prev.json")
if os.path.exists(prev_path):
    de_prev = json.load(open(prev_path, encoding="utf-8"))
    def sync(dn, do, eo):
        if isinstance(dn, str):
            if dn in CHANGED_EN: return CHANGED_EN[dn]
            if dn in ADDED_EN: return ADDED_EN[dn]
            if dn == do: return eo
            raise SystemExit("Unübersetzter geänderter String: " + dn[:80])
        if isinstance(dn, list):
            out = []
            old_objs = [(x, y) for x, y in zip(do, eo) if not isinstance(x, str)]
            k = 0
            for item in dn:
                if isinstance(item, str):
                    if item in CHANGED_EN: out.append(CHANGED_EN[item])
                    elif item in ADDED_EN: out.append(ADDED_EN[item])
                    else:
                        js = [j for j, x in enumerate(do) if x == item]
                        if js: out.append(eo[js[0]])
                        elif item in GLOBAL_MAP: out.append(GLOBAL_MAP[item])
                        else: raise SystemExit("Unübersetzter String: " + item[:80])
                else:
                    out.append(sync(item, old_objs[k][0], old_objs[k][1])); k += 1
            return out
        if isinstance(dn, dict):
            return {key: (sync(dn[key], do[key], eo[key]) if key in do else (ADDED_EN[dn[key]] if isinstance(dn[key], str) else dn[key])) for key in dn}
        return dn
    def collect(a, b, m):
        if isinstance(a, str): m.setdefault(a, b)
        elif isinstance(a, list):
            for x, y in zip(a, b): collect(x, y, m)
        elif isinstance(a, dict):
            for k in a:
                if k in b: collect(a[k], b[k], m)
    GLOBAL_MAP = {}
    for i in range(len(de)): collect(de_prev[i], en[i], GLOBAL_MAP)
    en = [sync(de[i], de_prev[i], en[i]) for i in range(len(de))]
    bounds = [(0, 11), (11, 22), (22, 33), (33, 43)]
    for i, (a, b) in enumerate(bounds):
        json.dump(en[a:b], open(os.path.join(H, "en", "slice%d_en.json" % (i + 1)), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    os.replace(prev_path, os.path.join(H, "spec_prev_used.json"))
    print("EN-Slices mit den deutschen Änderungen abgeglichen")

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
