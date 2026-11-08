# -*- coding: utf-8 -*-
"""Zerlegt die RAG-Batch-Dateien in Abschnitte und ordnet sie per Schlüsselwörtern den Handbuchkapiteln zu."""
import os, re, json, sys, csv, collections

SRC = sys.argv[1]; OUT = sys.argv[2]; GLIEDERUNG = sys.argv[3]
os.makedirs(OUT, exist_ok=True)

# Schlüsselwörter je Kapitel (Kleinschreibung, Teilstring-Treffer). Gewicht 2 für eindeutige Begriffe.
KW = {
 1: [("oneSCM-Ökosystem",2),("projekthintergrund",2),("globaler standard",2),("domäne",1)],
 2: [("berechtigung",2),("alice",2),("single sign",2),("login",2),("anmeldung",1),("rolle",1),("zugriff",1),("sitzung",1)],
 3: [("navigation",2),("startseite",2),("menü",1),("suche und filter",2),("oberfläche",1),("bedien",1),("customer journey",2),("gestaltung",2),("layout",1),("sprache",1),("übersetzung",2),("mehrsprachig",2),("prozesslandkarte",2),("lead",1),("crm",2)],
 4: [("kunden- und partnerverwaltung",3),("customer & partner",3),("kundenverwaltung",2),("partnerverwaltung",2),("dealer-onboarding",2),("dublette",2),("stammdaten",1),("privatkunde",1),("geschäftskunde",1),("vertragsinhaber",2),("zahler",1),("rechnungsempfänger",1),("kundendaten",2),("partner",1)],
 5: [("vertragserstellung",2),("contract generation",2),("angebot",1),("fahrzeugdaten",2),("baumuster",2),("fin",1),("vin",1),("deal-id",2),("order-id",2),("verso",2),("einstiegspunkt",2),("produktauswahl",2),("laufzeit",1),("optionen",1),("kennung",2),("preisindikation",2),("verkaufsbezeichnung",2),("bm6",2)],
 6: [("antrag",1),("pflichtfeld",2),("validierung",1),("fehlermeldung",1),("sonderfreigabe",2),("referenznummer",2),("vertragsanlage",2),("übersicht und bestätigung",2),("overview & confirmation",1)],
 7: [("zahlungsart",2),("zahlungsintervall",2),("bankdaten",2),("sepa",2),("mandat",2),("dokumente und kommunikation",3),("documents & communications",3),("unterschrift",2),("signatur",2),("e-signatur",2),("dokument",1),("vorlage",1),("template",1),("pdf",1)],
 8: [("aktivierung",2),("antragsverwaltung",2),("freigabeprozess",2),("statusübergang",2),("ablehnung",1),("status",1),("review-batch",1)],
 9: [("mo-check",3),("mo check",3),("mo-prüfung",2),("prüfstatus",2),("contract review",3),("fachliche prüfung",2),("qualitätssicherung",1),("market operation",2)],
 10: [("vertragsverwaltung",2),("vertragsmanagement",2),("contract management",2),("zahlerwechsel",2),("vertragsübertragung",2),("aussetzen",2),("reaktivier",2),("verlängerung",2),("folgevertrag",2),("kündigung",2),("stornierung",2),("beendigung",2),("änderungshistorie",2),("laufleistung",2),("kilometerstand",2),("mileage",2),("vertragsende",2),("lebenszyklus",2)],
 11: [("revenue management",3),("rechnung",2),("invoice",2),("zahlplan",2),("zahlungsstatus",2),("kostenmanagement",3),("cost management",3),("claim",2),("werkstatt",2),("lieferant",1),("endabrechnung",2),("erstattung",2),("reporting",2),("export",1),("altteilsteuer",2),("buchung",2),("mbld",2),("gutschrift",2),("sammelrechnung",2),("schwellenwert",1),("contract calculation",3),("vertragskalkulation",3),("kalkulation",2)],
 12: [("geschäftskunden",2),("flotte",2),("fleet",2),("kampagne",2),("campaign",2),("sonderfall",2),("sonderkondition",2),("kommentar",2),("customer account center",3),("massenanlage",3),("bulk",2),("großkunde",2),("kam",1)],
 13: [("reifen",3),("tyre",3),("tire",3)],
 14: [("marktkonfiguration",3),("markteinstellung",2),("produktverwaltung",2),("product management",2),("produktanlage",2),("preisversion",2),("preispflege",2),("preisfaktor",2),("cluster",2),("fahrzeuggruppe",3),("vehicle group",3),("product testing",3),("kampagnenverwaltung",2),("rabatt",2),("preiskomponente",2),("cost unit",2),("inflation",2),("vorlagenverwaltung",2),("administration",1),("template management",2),("vorlage anlegen",2),("testen, speichern und veröffentlichen",2),("veröffentlich",1)],
 15: [("blueprint",3),("hq",2),("headquarter",2),("technische optionen",3),("technical option",3),("sa-matching",3),("sa-code",2),("coverage code",3),("deckungscode",3),("industry code",3),("branchencode",3),("globale standards",2),("governance",1)],
 16: [("datenschutz",2),("archivierung",2),("datenqualität",2),("freigabeworkflow",2),("testnachweis",2),("end-to-end",2),("e2e",2),("testfall",2),("klärung",2),("versionierung",1),("audit",1)],
 17: [("rollout",3),("einführung",2),("go-live",2),("schulung",2),("abnahme",1),("hypercare",2),("zielmarkt",2)],
 18: [("migration",3),("bestandsdaten",2),("cutover",3),("parallelbetrieb",2),("quellsystem",2),("altsystem",2),("legacy",2)],
 19: [("architektur",2),("schnittstelle",2),("api",1),("microservice",2),("edge service",3),("batch-job",2),("batch job",2),("java",2),("oneerp",2),("nemesis",2),("mpay",2),("datix",2),("vega",2),("cepro",2),("afab",2),("mic",1),("otr",1),("dsb",2),("cofico",2),("swt",2),("vedoc",2),("xentry",2),("systeminterne benachrichtigung",2),("benachrichtigung",1),("notification",1),("endpunkt",2),("endpoint",2),("backend",1),("frontend",1),("kafka",2),("event",1)],
 20: [("länderspezifisch",3),("land",1),("markt",1),("lokale",1),("country",2)],
 21: [("sparte",2),("pkw",1),("van",1),("transporter",1),("division",2),("passenger car",1)],
 22: [("geplant",2),("vorhaben",2),("nicht umgesetzt",2),("backlog",2),("on hold",2),("release",1),("ausblick",2),("weiterentwicklung",2)],
 23: [("behobene fehler",2),("weitere korrekturen",1),("fehlerbehebung",2),("bug",2),("support",2),("eskalation",2),("workaround",2),("faq",2),("störung",2),("troubleshoot",2)],
}
NAMES = {}
for r in csv.DictReader(open(GLIEDERUNG, encoding="utf-8")):
    if r["ebene"] == "1": NAMES[int(r["kapitel"])] = r["thema"]

def parse(text):
    """Liefert Abschnitte [(titel, text)] aus einem Batch; fette Zeilen oder kurze Zeilen ohne Satzende sind Überschriften."""
    lines = text.split("\n")
    body = []
    for ln in lines[2:]:  # Titelzeile und Hinweiszeile überspringen
        if ln.startswith("_Automatisch") or ln.startswith("# "): continue
        body.append(ln)
    paras = [p.strip() for p in re.split(r"\n\s*\n", "\n".join(body)) if p.strip()]
    sections, cur_t, cur = [], "", []
    for p in paras:
        is_head = (p.startswith("**") and p.endswith("**") and "\n" not in p) or (len(p) < 90 and "\n" not in p and not p.endswith((".", ":", "!", "?")) )
        if is_head:
            if cur: sections.append((cur_t, "\n\n".join(cur)))
            cur_t, cur = p.strip("*").strip(), []
        else:
            # Überschrift am Zeilenanfang innerhalb eines Absatzes (fett, dann Zeilenumbruch)
            m = re.match(r"^\*\*([^*\n]{3,80})\*\*\n(.+)$", p, re.S)
            if m:
                if cur: sections.append((cur_t, "\n\n".join(cur)))
                cur_t, cur = m.group(1).strip(), [m.group(2).strip()]
            else:
                cur.append(p)
    if cur: sections.append((cur_t, "\n\n".join(cur)))
    return sections

def classify(title, text):
    t = (title + " " + text).lower(); tt = title.lower()
    scores = collections.Counter()
    for ch, kws in KW.items():
        for kw, w in kws:
            n = t.count(kw)
            if n: scores[ch] += w * min(n, 4) + (3 * w if kw in tt else 0)
    if not scores: return 0, 0
    best, sc = scores.most_common(1)[0]
    return best, sc

rows = []
files = sorted(os.listdir(SRC), key=lambda f: int(re.search(r"Batch-(\d+)", f).group(1)))
for f in files:
    nr = int(re.search(r"Batch-(\d+)", f).group(1))
    text = open(os.path.join(SRC, f), encoding="utf-8").read()
    m = re.search(r"aus (\d+) Tickets", text); tickets = int(m.group(1)) if m else 0
    for i, (title, body) in enumerate(parse(text)):
        if not body.strip(): continue
        ch, sc = classify(title, body)
        rows.append({"batch": nr, "abschnitt": i + 1, "titel": title or "(ohne Überschrift)", "kapitel": str(ch) if ch else "",
                     "kapitelname": NAMES.get(ch, "Ohne Zuordnung"), "treffer": sc, "tickets": tickets, "zeichen": len(body), "text": body})

# Statistik
stat = collections.Counter(r["kapitelname"] for r in rows)
print(len(rows), "Abschnitte aus", len(files), "Batches")
for k, v in sorted(stat.items(), key=lambda x: -x[1]): print("%5d  %s" % (v, k))
# Übersicht (ohne Text) und Volltexte in drei Teilen
light = [{k: v for k, v in r.items() if k != "text"} | {"auszug": r["text"][:220]} for r in rows]
json.dump(light, open(os.path.join(OUT, "quelltexte_index.json"), "w", encoding="utf-8"), ensure_ascii=False)
groups = [[], [], []]
for r in rows:
    k = int(r["kapitel"] or 0)
    groups[0 if k and k <= 8 else 1 if k and k <= 14 else 2].append(r)
for i, g in enumerate(groups):
    json.dump(g, open(os.path.join(OUT, "quelltexte_%d.json" % (i + 1)), "w", encoding="utf-8"), ensure_ascii=False)
    print("quelltexte_%d.json" % (i + 1), len(g), "Abschnitte", os.path.getsize(os.path.join(OUT, "quelltexte_%d.json" % (i + 1))) // 1024, "KB")
print("index", os.path.getsize(os.path.join(OUT, "quelltexte_index.json")) // 1024, "KB")
