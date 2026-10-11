# -*- coding: utf-8 -*-
"""Inhalte der Quick Guides je Handbuchkapitel. build() erzeugt die JSON-Spezifikation für gen.js."""
import json, math, re

STAND = "11.10.2026"

def _plain(t):
    return re.sub(r"\*\*|~~|__", "", t)

def _lines(text, width_in, size=9):
    cpi = 17.5 * 9 / size            # Zeichen je Zoll (Liberation Sans, 9 pt)
    return max(1, math.ceil(len(_plain(text)) / (cpi * width_in)))

def _h_items(items, width_in, size=9):
    lh = size * 1.2 / 72
    gap = size * 0.45 / 72
    h = 0.0
    for it in items:
        if isinstance(it, str):
            h += _lines(it, width_in, size) * lh + gap
        elif "steps" in it:
            for s in it["steps"]:
                if isinstance(s, list):
                    h += _lines(s[0], width_in - 0.22, size) * lh + 0.03
                    for b in s[1:]:
                        h += _lines(b, width_in - 0.4, size) * lh + 0.03
                    h += gap
                else:
                    h += _lines(s, width_in - 0.22, size) * lh + gap
        elif "bullets" in it:
            for b in it["bullets"]:
                h += _lines(b, width_in - 0.18, size) * lh + 0.03
        elif "head" in it:
            h += lh + 0.03
    return h

COLW = 5.1

FLOW = {
 1: ["Ziele und Nutzen", "Projekt einordnen", "Rolle identifizieren", "Domänen verstehen", "Standard und Abweichung"],
 2: ["Login per SSO", "Kontext prüfen", "Rolle abgleichen", "Berechtigung beantragen", "Zugangsproblem lösen", "Sitzung sichern"],
 3: ["Startseite und Menü", "Suche und Filter", "Bedienmuster", "Prozesslandkarte", "Lead und Schnittstellen", "Status einordnen", "Sprache und Kontext"],
 4: ["Kundengruppe wählen", "Kunde suchen", "Pflichtangaben prüfen", "Vertragsrollen zuordnen", "Daten übernehmen", "Partner und Dealer"],
 5: ["Vertrag erstellen", "Einstiegspunkt wählen", "Fahrzeugdaten ergänzen", "Produkt konfigurieren", "Optionen und Kampagnen", "Preisinformation", "Antrag erstellen"],
 6: ["Voraussetzungen prüfen", "Vertragsdaten erfassen", "Zuordnung kontrollieren", "Validierung lesen", "Sonderfreigabe erkennen", "Abschlusskontrolle", "Speichern und Referenz"],
 7: ["Zahlungsart und Intervall", "Bankdaten und Mandat", "Dokumente prüfen", "Unterschriftsart wählen", "Erneute Signatur", "Status kontrollieren"],
 8: ["Antragsverwaltung öffnen", "Aktualisieren", "Erstzulassung und Kennzeichen", "Dokumente hochladen", "Status prüfen", "Ergebnis kontrollieren", "Ablehnung bearbeiten"],
 9: ["Arbeitsliste öffnen", "Kriterien prüfen", "Prüfstatus setzen", "Abweichung klären", "Genehmigen oder zurückweisen", "Änderung und Review"],
 10: ["Vertrag suchen", "Daten ändern", "Zahlerwechsel", "Aussetzen und Reaktivieren", "Folgeangebot", "Kündigung und Beendigung", "Historie prüfen"],
 11: ["Zahlplan prüfen", "Status unterscheiden", "Rechnungsempfänger", "Kosten und Claims", "Endabrechnung", "Reporting und Übergabe"],
 12: ["Geschäftskunde erfassen", "Kampagne prüfen", "Sonderfall beantragen", "Zuordnung und Validierung", "Kommentare", "Customer Account Center"],
 13: ["Abgrenzung", "Reifentyp und Größe", "Laufzeit und Umfang", "Preis und Kampagne", "Antrag und Aktivierung", "Verwaltung und Beendigung"],
 14: ["Aufgaben und Einstellungen", "Vorlagen und Administration", "Produkt anlegen", "Preisversionen pflegen", "Änderung und Cluster", "Product Testing", "Freigabe dokumentieren"],
 15: ["HQ-Rolle abgrenzen", "Blueprint pflegen", "Abweichung bewerten", "Governance und Freigabe", "Mit Markt und MO abstimmen", "Technical Options pflegen"],
 16: ["Sichere Beispieldaten", "Datenführerschaft", "Freigabeworkflow", "Testnachweise", "Verwaltung vs. Archiv", "Quellen und Register", "Dealer-Governance"],
 17: ["Zielmärkte und Umfang", "Voraussetzungen", "Vorbereitung und Abnahme", "Schulung und Übergabe", "Begleitung"],
 18: ["Umfang abgrenzen", "Quellsysteme", "Mapping und Qualität", "Übernahme prüfen", "Fehlerfälle", "Cutover"],
 19: ["Systemlandkarte", "Datenquellen zuordnen", "Integrationswege", "Fehlerbehandlung", "Architekturregister", "Steckbriefe"],
 20: ["Länderprofil", "Lokale Rollen", "Lokale Produkte", "Zahlung und Signatur", "Einführung und Migration", "Abweichungsregister"],
 21: ["Spartenprofil", "Kennungen je Sparte", "Produkte je Sparte", "Antrag und Aktivierung", "Verwaltung und Finanzen", "Planung und Tests"],
 22: ["Funktionsstand prüfen", "Erweiterungen kennen", "Schulung bewerten", "Release verfolgen"],
 23: ["FAQ und bekannte Fehler", "Anliegen einordnen", "Supportfall vorbereiten", "Support kontaktieren", "Workaround prüfen"],
}

def image(path, h):
    return {"type": "image", "path": path, "h": h}

def card(title, items, shot=None, shot_h=1.25, size=9):
    tw = COLW - 0.2 - ((min(1.9, COLW * 0.38) + 0.12) if shot else 0)
    if shot: tw *= 0.86
    h = (0.08 + (0.3 if title else 0) + _h_items(items, tw, size)) * 1.08 + 0.12
    if shot:
        h = max(h, shot_h + 0.2)
    b = {"type": "card", "title": title, "items": items, "h": round(h, 2), "size": size}
    if shot:
        b["shot"] = shot; b["shotH"] = shot_h
    return b

def steps(items, title=None, shot=None, shot_h=1.25, size=9):
    tw = COLW - ((min(1.9, COLW * 0.38) + 0.12) if shot else 0)
    h = (0.3 if title else 0) + _h_items(items, tw, size) + 0.05
    if shot:
        h = max(h, shot_h + (0.3 if title else 0) + 0.05)
    b = {"type": "steps", "items": items, "h": round(h, 2), "size": size}
    if title: b["title"] = title
    if shot:
        b["shot"] = shot; b["shotH"] = shot_h
    return b

def warn(text, size=9):
    h = max(0.45, _lines(text, COLW - 0.6, size) * size * 1.2 / 72 + 0.22)
    return {"type": "warn", "text": text, "h": round(h, 2), "size": size}

def note(text, blue=False, size=9):
    return {"type": "note", "text": text, "blue": blue, "h": round(_lines(text, COLW, size) * size * 1.2 / 72 + 0.06, 2), "size": size}

def overview(cols, title="Die Themen im Überblick", size=9):
    cw = (COLW - 0.2) / len(cols)
    hs = []
    for c in cols:
        items = []
        for s in c["sections"]:
            items.append({"head": s["head"]}); items.append({"bullets": s["bullets"]}); items.append("")
        hs.append(_h_items(items, cw, size))
    return {"type": "overview", "title": title, "cols": cols, "h": round(0.3 + max(hs) + 0.05, 2), "size": size}

def faq(qa, title="Häufig gestellte Fragen und Antworten", size=9):
    items = [{"head": title}, {"bullets": [f"**{q}** {a}" for q, a in qa]}]
    return {"type": "faq", "qa": qa, "title": title, "h": round(0.14 + _h_items(items, COLW - 0.24, size) + len(qa) * 0.04 + 0.1, 2), "size": size}


def guide(nr, slug, title, ziel, rollen, voraus, themen, schritte, warnung, hinweise, check, fragen, links, footer=None, shot1="Einstieg in das Thema", shot2="Arbeitsmaske"):
    """Standardaufbau: Seite 1 Überblick und Vorgehen, Seite 2 Checkliste, Hinweise, FAQ, Links."""
    footer = footer or f"**Hinweis**: Dieser Quick Guide fasst Kapitel {nr} des oneSCM-Handbuchs zusammen. Details, Bildschirmbilder und Nachweise finden Sie im Handbuchkapitel."
    half = math.ceil(len(schritte) / 2)
    s1, s2 = schritte[:half], schritte[half:]
    fl = FLOW[nr]
    flow_h = 1.05 if len(fl) <= 5 else 1.65
    left1 = [
        dict(card("Ziel und Nutzen", [ziel], shot=shot1, shot_h=1.15), img="img/badge_%02d.png" % nr),
        note("Dieses Dokument ist interaktiv – Verweise auf Handbuchkapitel und Systeme sind als Links hinterlegt.", blue=True),
        overview(themen),
        image("img/landscape_%02d.png" % nr, 1.32),
    ]
    rollen_card = card("Rollen und Voraussetzungen", [{"head": "Beteiligte Rollen"}, {"bullets": rollen}, "", {"head": "Voraussetzungen"}, {"bullets": voraus}])
    right1 = [image("img/flow_%02d.png" % nr, flow_h), steps([{"steps": s1}], title="So gehen Sie vor"), warn(warnung)]
    rest = steps([{"start": half + 1, "steps": s2}]) if s2 else None
    right2_extra = []
    if rest:
        if sum(b["h"] for b in right1) + rest["h"] + 0.12 * len(right1) <= 6.28:
            right1.append(rest)
        else:
            rest["title"] = "So gehen Sie vor (Fortsetzung)"; rest["h"] += 0.3
            right2_extra.append(rest)
    # Linke Spalte Seite 1 darf nicht überlaufen: Landkarte sonst auf Seite 2
    if sum(b["h"] for b in left1) + 0.12 * (len(left1) - 1) > 6.28:
        left1.pop(); right2_extra.append(image("img/landscape_%02d.png" % nr, 1.32))
    left2 = [
        rollen_card,
        card("Checkliste vor dem Abschluss", [{"bullets": [f"☐  {c}" for c in check]}]),
        card("Hinweise und Stolpersteine", [{"bullets": hinweise}]),
    ]
    right2 = right2_extra + [faq(fragen), card("Wichtige Links und Ansprechpartner", [{"bullets": links}])]
    def colh(col): return sum(b["h"] for b in col) + 0.12 * (len(col) - 1)
    while colh(right2) > 6.28 and len(right2) > 1:
        cands = [i for i in range(len(right2)) if right2[i]["type"] != "steps" and colh(left2) + 0.12 + right2[i]["h"] <= 6.28]
        if not cands: break
        i = max(cands, key=lambda k: right2[k]["h"])
        left2.append(right2.pop(i))
    return {"nr": nr, "slug": slug, "title": title, "stand": STAND, "footer": footer, "flow": fl,
            "pages": [{"left": left1, "right": right1}, {"left": left2, "right": right2}]}


def T(head, bullets):
    return {"head": head, "bullets": bullets}

def cols(*sections):
    """Verteilt Abschnitte auf zwei Spalten."""
    n = len(sections); half = math.ceil(n / 2)
    return [{"sections": list(sections[:half])}, {"sections": list(sections[half:])}]

LINK_HB = "__Handbuch oneSCM__ – Vollständige Kapitel mit Bildschirmbildern, Rollen-, Status- und Scopematrizen (Anhang D)."
LINK_FAQ = "__FAQ und Troubleshooting__ – Kapitel 23 mit Fragen je Prozessphase und bekannten Fehlern je Markt und Release."
LINK_GLOSSAR = "__Glossar__ – Anhang A mit Begriffen und Abkürzungen."
LINK_SUPPORT = "**Support und Eskalation** – Supportfall mit Referenznummer, Markt, Sparte und Bildschirmbild melden (Kapitel 23.4 und 23.5)."
LINK_RP = "__oneSCM RetailPortal__ – Neuerungen im System und Schulungsmaterial."

G = []

# ---------------------------------------------------------------- 1
G.append(guide(1, "Einfuehrung_und_Ueberblick", "Einführung und Überblick",
 "oneSCM ist das zentrale System für Servicevertrags- und Wartungsprodukte. Dieser Guide zeigt, **wofür oneSCM genutzt wird**, welche **Rollen** zusammenarbeiten und wie der **globale Standard** mit **lokalen Ausprägungen** je Markt zusammenspielt (Kapitel 1.1 bis 1.6).",
 ["**Dealer** (Autohaus): Angebot, Antrag, Antragsverwaltung", "**MO** (Market Operation): fachliche Prüfung und Aktivierung", "**Markt**: Produkt-, Preis- und Kampagnenpflege, Administration", "**HQ**: Blueprint, globale Standards, zentrale Stammdaten"],
 ["Zugang zu oneSCM über RetailPortal oder Direktverlinkung (Kapitel 2)", "Kenntnis des eigenen Markt-, Sparten- und Betriebskontexts", "Handbuchkapitel 1 als Einstieg vor allen Prozesskapiteln"],
 cols(T("1.1 – 1.3 Ziele und Rollen", ["Ziele und Nutzen von oneSCM", "Projekthintergrund und Einordnung", "Beteiligte Rollen und Aufgaben"]),
      T("1.4 – 1.6 Ökosystem und Standard", ["Rollen im oneSCM-Ökosystem", "Fachliche Domänen und Zusammenarbeit", "Globaler Standard und lokale Ausprägungen"])),
 ["Lesen Sie **Ziele und Nutzen** (1.1): oneSCM bündelt Preisinformation, Angebot, Antrag, Vertrag und Verwaltung in einem System.",
  "Ordnen Sie das Projekt ein (1.2): oneSCM löst Altsysteme ab und bildet den Vertragsprozess für **Pkw und Van** einheitlich ab.",
  ["Identifizieren Sie Ihre **Rolle** (1.3 und 1.4) und die zugehörigen Kapitel:", "Dealer: Kapitel 4 bis 8 und 10", "MO: Kapitel 9 und 10", "Markt: Kapitel 14", "HQ: Kapitel 15"],
  "Verstehen Sie die **fachlichen Domänen** (1.5): Kunde, Fahrzeug, Produkt, Vertrag, Zahlung und Dokument greifen ineinander.",
  "Beachten Sie **Standard und Abweichung** (1.6): Der Blueprint gilt global, Länderabweichungen sind im Register dokumentiert (Kapitel 20)."],
 "~~Länderspezifische Abweichungen~~ vom Blueprint sind nur gültig, wenn sie im Länderabweichungsregister (Kapitel 20.6) dokumentiert und freigegeben sind.",
 ["Begriffe und Abkürzungen (MO, HQ, OTR, FIN, ZB I) finden Sie im Glossar (Anhang A).", "Die Prozesslandkarte (Kapitel 3.4) zeigt die Reihenfolge der Prozesskapitel.", "Lesepfade je Rolle stehen im Vorspann (V.2)."],
 ["Eigene Rolle und Markt sind bekannt", "Zuständige Handbuchkapitel sind identifiziert", "Zugang zu oneSCM ist beantragt oder vorhanden", "Glossar und Prozesslandkarte sind bekannt"],
 [("Wofür steht oneSCM?", "Für das zentrale Service Contract Management: Angebot, Antrag, Vertrag und Verwaltung von Service- und Wartungsprodukten."),
  ("Gilt das Handbuch für Pkw und Van?", "Ja. Spartenunterschiede sind in Kapitel 21 beschrieben, Länderunterschiede in Kapitel 20."),
  ("Wo beginne ich als neue Nutzerin oder neuer Nutzer?", "Mit Kapitel 2 (Zugang) und Kapitel 3 (Navigation), danach mit dem Prozesskapitel Ihrer Rolle.")],
 [LINK_HB, LINK_RP, LINK_GLOSSAR, LINK_SUPPORT],
 shot1="Startseite oneSCM", shot2="Prozesslandkarte"))

# ---------------------------------------------------------------- 2
G.append(guide(2, "Zugang_Rollen_und_Berechtigungen", "Zugang, Rollen und Berechtigungen",
 "Sie melden sich per **Single Sign-on** an, prüfen Ihre **fachliche Rolle** und die **technischen Berechtigungen** und wissen, wie Sie fehlende Rechte **beantragen** und Zugangsprobleme lösen (Kapitel 2.1 bis 2.6).",
 ["**Nutzerin/Nutzer**: Login, Kontextprüfung, Antrag auf Berechtigung", "**ALICE-Autohaus-Admin**: Freischaltung der Rollen im Autohaus", "**Markt/HQ**: Rollenmodell und Freigaben"],
 ["Gültiges Benutzerkonto im Konzernverzeichnis", "Zugeordnete oneSCM-Rolle (z. B. oneSCM.DealerVAN)", "Zugang über RetailPortal oder Direktverlinkung"],
 cols(T("2.1 – 2.3 Login und Rollen", ["Login und Single Sign-on", "Fachliche Rollen und technische Berechtigungen", "Berechtigungsantrag und Freigabe"]),
      T("2.4 – 2.6 Kontext und Sicherheit", ["Markt-, Sparten- und Betriebskontext prüfen", "Fehlende Berechtigungen und Zugangsprobleme", "Sicherer Umgang mit Benutzerkonto und Sitzung"])),
 ["Rufen Sie oneSCM über __RetailPortal__ oder über die __Direktverlinkung__ auf. Die Anmeldung erfolgt per **Single Sign-on** (2.1).",
  "Prüfen Sie nach dem Login Ihren **Markt-, Sparten- und Betriebskontext** (2.4): Falscher Kontext bedeutet falsche Produkte und Preise.",
  "Gleichen Sie Ihre **fachliche Rolle** mit den **technischen Berechtigungen** ab (2.2). Fehlende Menüpunkte deuten auf fehlende Rollen hin.",
  "Fehlt eine Berechtigung, stellen Sie den **Berechtigungsantrag** über ALICE (2.3). Im Autohaus schaltet der **ALICE-Autohaus-Admin** frei.",
  "Bei Zugangsproblemen (2.5): Browser-Cache leeren, erneut anmelden, dann Supportfall mit Benutzerkennung und Bildschirmbild melden.",
  "Sperren Sie Ihre Sitzung bei Abwesenheit und teilen Sie Ihr Konto nie mit anderen (2.6)."],
 "~~Berechtigungen werden nie per E-Mail oder Zuruf vergeben.~~ Jede Rolle wird über ALICE beantragt, geprüft und freigegeben; die Freigabe ist nachvollziehbar dokumentiert.",
 ["Die Rolle oneSCM.DealerVAN ist Voraussetzung für die Antragserstellung im Van-Geschäft.", "Nach einer Rollenänderung ist eine erneute Anmeldung nötig.", "Mehrere Märkte oder Sparten erfordern mehrere Rollenzuordnungen."],
 ["Login über SSO funktioniert", "Markt, Sparte und Betrieb sind korrekt", "Alle benötigten Menüpunkte sind sichtbar", "Ansprechperson für ALICE ist bekannt"],
 [("Warum sehe ich den Menüpunkt Vertragserstellung nicht?", "Die zugehörige Rolle fehlt. Beantragen Sie sie über ALICE bei Ihrem Autohaus-Admin."),
  ("Wie lange dauert eine Freigabe?", "Die Freigabe erfolgt durch den zuständigen Admin; den aktuellen Status sehen Sie im Berechtigungsantrag."),
  ("Kann ich mehrere Rollen haben?", "Ja, zum Beispiel Dealer-Rollen für Pkw und Van; der aktive Kontext wird in oneSCM angezeigt.")],
 ["__ALICE – Berechtigungsmanagement__ – Rollenantrag und Freigabe (Kapitel 19.16).", LINK_RP, LINK_HB, LINK_SUPPORT],
 shot1="Anmeldung Single Sign-on", shot2="Berechtigungsantrag in ALICE"))

# ---------------------------------------------------------------- 3
G.append(guide(3, "Grundlagen_Navigation_und_Customer_Journey", "Grundlagen, Navigation und Customer Journey",
 "Sie finden sich auf **Startseite und Menü** zurecht, nutzen **Suche und Filter**, kennen die **Bedienmuster** und ordnen den Vertragsprozess von der **Preisinformation** bis zum **Vertrag** in die **Prozesslandkarte** ein (Kapitel 3.1 bis 3.9).",
 ["**Alle Rollen**: Navigation, Suche, Statusverständnis", "**Dealer**: Customer Journey vom Lead bis zum Vertrag", "**MO/Markt**: Statusinformationen und Systemübergaben"],
 ["Erfolgreicher Login mit korrektem Kontext (Kapitel 2)", "Grundkenntnis der Prozesslandkarte", "Persönlicher Arbeitskontext und Sprache sind eingestellt"],
 cols(T("3.1 – 3.3 Oberfläche", ["Startseite und Menü", "Suche und Filter", "Oberflächenelemente und Bedienmuster"]),
      T("3.4 – 3.6 Customer Journey", ["Prozesslandkarte", "Preisinformation, Angebot, Antrag und Vertrag", "Lead und CRM-Übergabe"]),
      T("3.7 – 3.9 Status und Kontext", ["Schnittstellen und Systemübergaben", "Statusinformationen richtig einordnen", "Persönlicher Arbeitskontext und Sprachen"])),
 ["Starten Sie auf der **Startseite** (3.1): Die Kacheln führen zu **Vertragserstellung**, **Antragsverwaltung**, **Kundenmanagement** sowie zu Garantie-Paketen und externen Portalen.",
  "Nutzen Sie **Suche und Filter** (3.2): Referenznummer, FIN/VIN, Kundenname oder Status grenzen Listen ein. Spalten wie „Aktionen“ erreichen Sie über den horizontalen Schieberegler.",
  "Erkennen Sie die **Bedienmuster** (3.3): Schrittleiste mit Häkchen, Schieberegler für optionale Angaben, Drei-Punkte-Menü für Aktionen, Pflichtfelder mit Stern.",
  "Ordnen Sie Ihren Vorgang in die **Prozesslandkarte** ein (3.4 und 3.5): Preisinformation → Angebot → Antrag → Vertrag.",
  "Übernehmen Sie **Leads** aus dem CRM und geben Sie Ergebnisse zurück (3.6); beachten Sie die **Systemübergaben** an OTR, VEGA und oneERP (3.7).",
  "Lesen Sie **Statusinformationen** richtig (3.8): Antragsstatus, Signaturstatus und Vertragsstatus sind getrennte Größen.",
  "Stellen Sie **Arbeitskontext und Sprache** ein (3.9); Dokumente folgen der Sprachvariante des Marktes (Kapitel 7.4)."],
 "~~Ein grüner Haken in der Schrittleiste bedeutet nicht, dass der Vertrag aktiv ist.~~ Erst der Vertragsstatus „aktiv“ nach Prüfung und Aktivierung (Kapitel 8) ist verbindlich.",
 ["Die Statusübersicht mit zulässigen Übergängen steht in Kapitel 8.2 und in Anhang D.", "Die Suche findet nur Vorgänge im eigenen Markt- und Betriebskontext.", "Browser-Zoom unter 100 % blendet Spalten aus; nutzen Sie den Schieberegler."],
 ["Startseite und Hauptmenü sind bekannt", "Suche nach Referenznummer und FIN funktioniert", "Prozessphase des Vorgangs ist klar", "Sprache und Arbeitskontext sind gesetzt"],
 [("Wo finde ich einen gespeicherten Antrag wieder?", "Unter Vertragserstellung › Antragsverwaltung über die Referenznummer (Kapitel 8.1)."),
  ("Was ist der Unterschied zwischen Angebot und Antrag?", "Das Angebot ist eine Preisinformation ohne Bindung; der Antrag wird gespeichert, unterschrieben, geprüft und aktiviert."),
  ("Kann ich die Oberfläche in einer anderen Sprache nutzen?", "Ja, über den persönlichen Arbeitskontext (3.9); Vertragsdokumente folgen den Sprachvarianten des Marktes.")],
 [LINK_HB, "__Prozessdiagramme__ – Anhang C mit Prozesslandkarte und Teilprozessen.", LINK_GLOSSAR, LINK_SUPPORT],
 shot1="Startseite mit Kacheln", shot2="Suche und Filter in der Antragsverwaltung"))

# ---------------------------------------------------------------- 4
G.append(guide(4, "Kunden_Partner_und_Vertragsrollen", "Kunden, Partner und Vertragsrollen",
 "Sie unterscheiden **Privat- und Geschäftskunden**, finden **vorhandene Kunden**, prüfen **Pflichtangaben**, ordnen die **Vertragsrollen** (Inhaber, Zahler, Nutzer, Kontakt, Rechnungsempfänger) zu und vermeiden **Dubletten** (Kapitel 4.1 bis 4.8).",
 ["**Dealer**: Kundensuche, Neuanlage, Rollenzuordnung", "**MO**: Prüfung von Stammdaten und Dubletten", "**Markt**: Dealer-Onboarding und Partnerprozess"],
 ["Kundengruppe ist bekannt (Privat, Gewerbe, KAM betreute Großkunden)", "Identifikationsdaten des Kunden liegen vor", "Datenschutzhinweise sind beachtet (Kapitel 16.1)"],
 cols(T("4.1 – 4.3 Kunden erfassen", ["Privatkunden und Geschäftskunden", "Vorhandene Kunden suchen und zuordnen", "Kundendaten und Pflichtangaben prüfen"]),
      T("4.4 – 4.6 Rollen und Qualität", ["Vertragsinhaber, Zahler, Nutzer, Kontakt, Rechnungsempfänger", "Datenübernahme aus angebundenen Systemen", "Dubletten und widersprüchliche Stammdaten"]),
      T("4.7 – 4.8 Partner", ["Partner- und Dealerbeziehungen", "Dealer-Onboarding und Partnerprozess"])),
 ["Wählen Sie die **Kundengruppe** (4.1). „KAM betreute Großkunden“ nur bei individuellen Preisanfragen bzw. FS 140+.",
  ["**Suchen** Sie zuerst nach dem Kunden und wählen Sie ihn aus; legen Sie nur bei Bedarf neu an (4.2). Zur Identifikation dienen:", "Privatkunde: Vor- und Nachname, Telefonnummer, E-Mail-Adresse oder Mercedes me ID", "Gewerblicher Kunde: Firmenname, USt-ID"],
  "Prüfen Sie **Pflichtangaben** und Plausibilität (4.3): Adresse, Kontaktdaten, Rechtsform; Fehler blockieren spätere Prüfungen.",
  "Ordnen Sie die **Vertragsrollen** zu (4.4): Vertragsinhaber, Zahler, Nutzer, Kontakt und Rechnungsempfänger können abweichen, müssen aber je Markt zulässig sein.",
  "Übernehmen Sie Daten aus **angebundenen Systemen** (4.5, z. B. oneERP) statt sie neu zu tippen; prüfen Sie **Dubletten** und Widersprüche (4.6).",
  "Pflegen Sie **Partner- und Dealerbeziehungen** (4.7); neue Händler durchlaufen das **Dealer-Onboarding** (4.8)."],
 "~~Vertragsinhaber und Halter des Fahrzeugs müssen identisch sein.~~ Ein abweichender Vertragsinhaber ist nicht zulässig; abweichend dürfen nur Zahler und Rechnungsempfänger sein.",
 ["Dubletten entstehen meist durch Neuanlage ohne vorherige Suche; der MO kann sie zurückweisen.", "Personenbezogene Daten gehören nicht in Kommentare oder Screenshots (Kapitel 16.1).", "Bei Datenübernahme aus Fremdsystemen ist das führende System maßgeblich (Kapitel 16.2)."],
 ["Kunde gesucht, keine Dublette angelegt", "Kundengruppe korrekt gewählt", "Pflichtangaben vollständig und plausibel", "Vertragsrollen zugeordnet und zulässig"],
 [("Darf der Zahler vom Vertragsinhaber abweichen?", "Ja, der Zahler und der Rechnungsempfänger können abweichen; der Vertragsinhaber muss Halter sein."),
  ("Was tun bei widersprüchlichen Stammdaten?", "Nicht überschreiben, sondern Abweichung dokumentieren und an das führende System bzw. den Support geben (Kapitel 4.6)."),
  ("Wie wird ein neuer Dealer angebunden?", "Über den Partnerprozess und das Dealer-Onboarding des Marktes (Kapitel 4.8).")],
 ["__Customer Account Center__ – Kundenkonten und Sonderfälle (Kapitel 12.8).", "__oneERP__ – Kunden- und Finanzintegration (Kapitel 19.11).", LINK_HB, LINK_SUPPORT],
 shot1="Kundensuche", shot2="Kundendaten erfassen"))

# ---------------------------------------------------------------- 5
G.append(guide(5, "Fahrzeug_Produkt_und_Angebot_vorbereiten", "Fahrzeug, Produkt und Angebot vorbereiten",
 "Sie wählen die **Vertragsart** und den **Einstiegspunkt**, laden **Fahrzeugdaten**, wählen **Produkt und Leistungsumfang**, konfigurieren **Laufzeit, Laufleistung und Optionen** und erstellen ein **Angebot** mit Kampagnen und Rabatten (Kapitel 5.1 bis 5.8).",
 ["**Dealer**: Angebot erstellen und übergeben", "**Markt**: Produkte, Preise und Kampagnen bereitstellen (Kapitel 14)", "**MO**: Prüfung bei Sonderfreigaben"],
 ["Kunde ist angelegt oder zugeordnet (Kapitel 4)", "Fahrzeugkennung liegt vor: Baumuster, OTR-Deal-ID, VerSO-Order-ID oder VIN/FIN", "Zulässige Produkte für Markt und Sparte sind bekannt"],
 cols(T("5.1 – 5.3 Fahrzeug", ["Vertragsarten und Einstiegspunkte", "Fahrzeug- und Vorgangskennungen", "Fahrzeugdaten, Pflichtfelder und Validierungsregeln"]),
      T("5.4 – 5.6 Produkt und Preis", ["Produkte und Leistungsumfang auswählen", "Laufzeit, Laufleistung und Optionen konfigurieren", "Preise, Kampagnen und Rabatte im Angebot"]),
      T("5.7 – 5.8 Angebot", ["Angebotsgültigkeit und Änderungen", "Übergabe zur Antragserstellung"])),
 ["Klicken Sie auf „**Vertrag erstellen**“ und wählen Sie die **Vertragsart** (5.1).",
  ["Geben Sie je nach Phase den passenden **Einstiegspunkt** an, um die Fahrzeugdaten zu laden (5.2):", "Für eine Preisindikation: **Baumuster**", "Ab Angebot: OTR-**Deal-ID**", "Ab Bestellung: VerSO-**Order-ID**", "Ab Produktion: **VIN/FIN**"],
  "Ergänzen Sie **Erstzulassung**, **aktuelle Laufleistung** oder **Kennzeichen** (5.3). Sind diese noch unbekannt, aktivieren Sie den Schieberegler.",
  "Wählen Sie das **Service-/Wartungspaket** (5.4) und konfigurieren Sie **Zahlungsintervall, Vertragsdauer, jährliche Laufleistung** und ggf. **Industrie** (5.5).",
  "Fügen Sie, falls verfügbar, **technische Optionen** und **zusätzliche Leistungen** hinzu und wählen Sie **aktive Kampagnen** oder **eigene Händlerrabatte** (5.6). Prüfen Sie die Berechtigung anhand der Kampagnenbeschreibung.",
  "Prüfen Sie im **Zahlungsplan** die Vertragsdetails und erzeugen Sie für Angebotszwecke die Vorschau „**Preisinformation**“ (PDF). Beachten Sie die **Angebotsgültigkeit** (5.7).",
  "Mit „**Antrag erstellen**“ übergeben Sie das Angebot in die Antragserstellung (5.8, Kapitel 6)."],
 "~~Sobald Sie auf „Antrag erstellen“ klicken, springen Sie zur Kundendatenerfassung~~ und können den Vertrag erst später wieder bearbeiten. Prüfen Sie Produkt, Laufzeit und Laufleistung vorher.",
 ["Das Zahlungsintervall „einmalig“ und „monatlich“ ist immer wählbar; andere Intervalle hängen von Kundensegment und Laufzeit ab.", "Bedingungen und Konditionen sowie Händlerinformationen lassen sich über die Symbole dauerhaft einblenden.", "Vorführ- und Dienstwagen gelten als Gebrauchtfahrzeuge; dafür ist nur ein reines Wartungspaket möglich."],
 ["Einstiegspunkt passend zur Phase gewählt", "Fahrzeugdaten geladen und Pflichtfelder geprüft", "Produkt, Laufzeit und Laufleistung passen zum Kundenwunsch", "Kampagne zulässig, Preisinformation erzeugt"],
 [("Welche Kennung nehme ich vor der Bestellung?", "Das Baumuster für eine Preisindikation; ab Angebot die OTR-Deal-ID, ab Bestellung die VerSO-Order-ID."),
  ("Kann ich ein Angebot später ändern?", "Bis zur Antragserstellung ja; danach gelten die Änderungsregeln aus Kapitel 5.7 und 10.2."),
  ("Wie lange ist ein Angebot gültig?", "Die Gültigkeit richtet sich nach Marktvorgaben und Preisversion (Kapitel 5.7 und 14.9).")],
 ["__OTR__ – Auftrags- und Fahrzeugbezug (Kapitel 19.5).", "__MIC__ – Fahrzeugdaten-API (Kapitel 19.8).", LINK_HB, LINK_SUPPORT],
 shot1="Vertrag erstellen: Einstiegspunkt", shot2="Produktkonfiguration"))

# ---------------------------------------------------------------- 6
G.append(guide(6, "Servicevertrag_anlegen_und_Antrag_abschliessen", "Servicevertrag anlegen und Antrag abschließen",
 "Sie prüfen **Voraussetzungen und Vertragsart**, erfassen **Vertragsdaten und Pflichtfelder**, kontrollieren **Kunden-, Fahrzeug- und Produktzuordnung**, verstehen **Validierungsregeln** und speichern den **Antrag** mit **Referenznummer** (Kapitel 6.1 bis 6.7).",
 ["**Dealer**: Antrag erfassen, kontrollieren und speichern", "**MO**: Sonderfreigaben und Prüfung (Kapitel 9)", "**Markt**: Validierungsregeln je Markt"],
 ["Angebot ist vorbereitet (Kapitel 5)", "Kunde ist zugeordnet (Kapitel 4)", "Rolle für Antragserstellung ist freigeschaltet (Kapitel 2)"],
 cols(T("6.1 – 6.3 Erfassen", ["Voraussetzungen und Vertragsart prüfen", "Vertragsdaten und Pflichtfelder erfassen", "Kunden-, Fahrzeug- und Produktzuordnung kontrollieren"]),
      T("6.4 – 6.7 Prüfen und speichern", ["Validierungsregeln und Fehlermeldungen", "Sonderfreigaben im Standardprozess erkennen", "Übersicht und Abschlusskontrolle", "Antrag speichern und Referenz prüfen"])),
 ["Prüfen Sie **Vertragsart und Voraussetzungen** (6.1): Fahrzeug, Produkt und Kundengruppe müssen zur Vertragsart passen.",
  "Erfassen Sie die **Vertragsdaten** (6.2): Pflichtfelder sind mit Stern markiert; fehlende Angaben blockieren das Speichern.",
  "Kontrollieren Sie im Abschnitt **Zahlungsplan** die Zuordnung von **Kunde, Fahrzeug und Produkt** (6.3) und nutzen Sie die **Antragsvorschau** (PDF).",
  "Lesen Sie **Validierungsmeldungen** (6.4): Rote Meldungen müssen behoben werden, gelbe Hinweise erlauben das Weitergehen.",
  "Erkennen Sie **Sonderfreigaben** (6.5): Abweichende Konditionen oder Kundengruppen lösen eine MO-Prüfung aus (Kapitel 9 und 12.4).",
  "Führen Sie die **Abschlusskontrolle** in der Übersicht durch (6.6) und klicken Sie auf das **Häkchen**, um zur Unterzeichnung zu gelangen.",
  "**Speichern** Sie den Antrag und notieren Sie die **Referenznummer** (6.7); sie ist der Schlüssel für Antragsverwaltung und Support."],
 "~~Das Zahlungsintervall kann im Nachgang nur auf „einmalig“ geändert werden~~, andere Änderungen erfordern einen Neuvertrag.",
 ["Im Beispiel des Handbuchs wird ein Antrag für einen gewerblichen Kunden gestellt; Abweichungen für Privatkunden und KAM betreute Großkunden sind markiert.", "Eine Sammelrechnung aktivieren Sie bei der Kundendatenprüfung über den Schieberegler am Seitenende.", "Gespeicherte Anträge finden Sie unter Antragsverwaltung (Kapitel 8.1)."],
 ["Vertragsart und Voraussetzungen geprüft", "Pflichtfelder vollständig, keine roten Meldungen", "Kunde, Fahrzeug und Produkt korrekt zugeordnet", "Antrag gespeichert, Referenznummer notiert"],
 [("Kann ich den Antrag nach dem Speichern ändern?", "Eingeschränkt: Erstzulassung, Kennzeichen und Dokumente über „Aktualisieren“ (Kapitel 8.3); Konditionen erfordern einen Neuvertrag."),
  ("Was bedeutet eine Sonderfreigabe?", "Der Antrag weicht vom Standard ab und wird durch den MO geprüft, bevor er aktiviert werden kann (Kapitel 9 und 12.4)."),
  ("Wo sehe ich die Referenznummer?", "In der Übersicht nach dem Speichern und in der Antragsverwaltung in der ersten Spalte.")],
 ["__Übergangsmodul T6-7__ – Vom gespeicherten Antrag zu Zahlungsdaten und Signatur.", LINK_HB, LINK_FAQ, LINK_SUPPORT],
 shot1="Vertrag erstellen", shot2="Übersicht und Abschlusskontrolle"))

# ---------------------------------------------------------------- 7
G.append(guide(7, "Zahlungsdaten_Dokumente_und_Unterschrift", "Zahlungsdaten, Dokumente und Unterschrift",
 "Sie erfassen **Zahlungsart und Zahlungsintervall**, **Zahler und Rechnungsempfänger**, **Bankdaten und Mandate**, erzeugen die **Vertragsdokumente** in der richtigen Sprache und holen die **Unterschrift** digital oder manuell ein (Kapitel 7.1 bis 7.8).",
 ["**Dealer**: Zahlungsdaten erfassen, Signatur einholen, Dokumente hochladen", "**Kunde**: Unterzeichnung per QR-Code, E-Mail oder auf Papier", "**MO**: Prüfung von Signatur- und Dokumentstatus"],
 ["Antrag ist gespeichert (Kapitel 6)", "Kunden-E-Mail und Handynummer sind im Kundenstamm hinterlegt", "Bankdaten des Zahlers liegen vor"],
 cols(T("7.1 – 7.3 Zahlung", ["Zahlungsarten und Zahlungsintervalle", "Vertragszahler und Rechnungsempfänger", "Bankdaten und Mandate"]),
      T("7.4 – 7.6 Dokumente und Signatur", ["Vertragsdokumente und Sprachvarianten", "Digitale Unterschrift", "Manuelle Unterschrift und Dokumentupload"]),
      T("7.7 – 7.8 Kontrolle", ["Mehrfachunterschriften und erneute Signatur", "Signatur-, Dokument- und Antragsstatus kontrollieren"])),
 ["Wählen Sie **Zahlungsart und Zahlungsintervall** (7.1) und bestimmen Sie **Zahler und Rechnungsempfänger** (7.2).",
  "Erfassen Sie **Bankdaten** und erzeugen Sie das **SEPA-Mandat** (7.3); bei Sammelrechnung aktivieren Sie den Schieberegler.",
  "Erzeugen Sie die **Antragsvorschau** (PDF) und prüfen Sie die **Sprachvariante** der Dokumente (7.4).",
  ["Wählen Sie die **Unterschriftsart** (7.5 und 7.6):", "**E-Signatur (QR-Code)**: Kunde scannt den Code, unterschreibt mobil; Ablage automatisch.", "**Unterschrift per E-Mail**: Link per E-Mail, Zugriff mit 4-stelligem SMS-Code; Ablage automatisch.", "**Dokument drucken**: handschriftliche Unterschrift, danach Scan und „Antrag hochladen“."],
  "Bei mehreren Unterzeichnern oder Änderungen holen Sie die **Signatur erneut** ein (7.7).",
  "Kontrollieren Sie **Signatur-, Dokument- und Antragsstatus** (7.8), bevor Sie zur Aktivierungsprüfung übergehen (Kapitel 8)."],
 "~~Für die Vertragsprüfung und Aktivierung müssen Erstzulassung, Kennzeichen und eine Kopie der ZB II vorliegen.~~ Bei Druckvariante sind Vertragsdokumente und SEPA-Mandat separat hochzuladen.",
 ["Mit der digitalen Unterzeichnung erhält der Kunde den Vertrag automatisch zugesendet.", "Die Druckvariante eignet sich bei mehreren erforderlichen Unterschriften oder wenn keine digitale Signatur möglich ist.", "Das Vertragsdokument kann alternativ am Computer über den Link aufgerufen werden."],
 ["Zahlungsart, Intervall, Zahler und Rechnungsempfänger erfasst", "SEPA-Mandat erzeugt bzw. hochgeladen", "Dokumente in der richtigen Sprachvariante", "Signaturstatus „unterschrieben“ kontrolliert"],
 [("Der Kunde hat keine Handynummer hinterlegt. Was nun?", "Die E-Mail-Variante braucht die SMS-Verifizierung; nutzen Sie die E-Signatur per QR-Code oder die Druckvariante."),
  ("Kann ein Dokument später hochgeladen werden?", "Ja, über die Antragsverwaltung › Aktualisieren › Kommunikation (Kapitel 8.3)."),
  ("Was passiert bei einer erneuten Signatur?", "Das bisherige Dokument wird ersetzt; der Signaturstatus beginnt neu (Kapitel 7.7).")],
 ["__Übergangsmodul T7-8__ – Von Dokumenten und Signatur zur Aktivierungsprüfung.", "__MPay__ – Zahlungsintegration (Kapitel 19.15).", LINK_HB, LINK_SUPPORT],
 shot1="Zahlungsplan", shot2="Auswahl der Unterschriftsart"))

# ---------------------------------------------------------------- 8
G.append(guide(8, "Antrag_verfolgen_und_aktivieren", "Antrag verfolgen und aktivieren",
 "Sie **suchen und filtern Anträge**, lesen die **Statusübersicht**, ergänzen **fehlende Fahrzeugdaten und Dokumente**, kennen die **Aktivierungsvoraussetzungen** und reagieren richtig auf **Ablehnung, Verzögerung und Wiederaufnahme** (Kapitel 8.1 bis 8.7).",
 ["**Dealer**: Antrag verfolgen, Daten und Dokumente nachreichen", "**MO/Kundenmanagement**: Prüfung, Freigabe und Aktivierung", "**System**: automatische Aktivierung bei vollständigen Daten"],
 ["Antrag ist gespeichert und unterschrieben (Kapitel 6 und 7)", "Referenznummer liegt vor", "Erstzulassung, Kennzeichen und ZB II sind verfügbar"],
 cols(T("8.1 – 8.3 Verfolgen", ["Anträge suchen, filtern und verfolgen", "Statusübersicht und zulässige Übergänge", "Fehlende Fahrzeugdaten und Dokumente ergänzen"]),
      T("8.4 – 8.7 Aktivieren", ["Freigabeprozess und Aktivierungsvoraussetzungen", "Automatische und manuelle Aktivierungsvarianten", "Aktivierung und Ergebnis kontrollieren", "Ablehnung, Verzögerung und Wiederaufnahme"])),
 ["Klicken Sie unter **Vertragserstellung** auf „**Antragsverwaltung**“ und suchen Sie den Antrag über die **Referenznummer** (8.1).",
  "Fahren Sie mit dem Schieberegler nach rechts zur Spalte „**Aktionen**“, klicken Sie auf „**…**“ und wählen Sie „**Aktualisieren**“.",
  "Fügen Sie **Erstzulassungsdatum** und **Kennzeichen** ein (8.3).",
  "Öffnen Sie den Antrag über die Referenznummer, wechseln Sie in das Register „**Kommunikation**“ und laden Sie über das Hochladen-Symbol die Kopie der **ZB I/ZB II** oder das unterschriebene Vertragsdokument hoch.",
  "Prüfen Sie die **Statusübersicht** (8.2): Nur zulässige Übergänge sind möglich; der Antrag wird durch das Kundenmanagement geprüft und aktiviert (8.4 und 8.5).",
  "Kontrollieren Sie das **Ergebnis** (8.6): Vertragsstatus „aktiv“ und Rückmeldung in der Kommunikation.",
  "Bei **Ablehnung** meldet sich das Kundenmanagement; korrigieren Sie die Daten und nehmen Sie den Antrag wieder auf (8.7)."],
 "~~Das Hochladen der ZB II ist systemseitig kein Pflichtfeld, jedoch findet ohne Dokument keine Aktivierung statt.~~ Falsche Anträge werden abgelehnt und der Kunde erhält eine Information.",
 ["Ein Servicevertrag kann bis zu 12 Monate und/oder maximal 50.000 km nach Erstzulassung abgeschlossen werden, sofern das Fahrzeug noch keinen Service erhalten hat (Ausnahme: Dienst- und Vorführfahrzeuge mit Vorbesitzer).", "Der Vertragsbeginn entspricht dem Datum der Erstzulassung.", "Statusübergänge sind in Anhang D als Matrix dokumentiert."],
 ["Antrag in der Antragsverwaltung gefunden", "Erstzulassung und Kennzeichen eingetragen", "ZB II und Vertragsdokument hochgeladen", "Vertragsstatus „aktiv“ kontrolliert"],
 [("Wie lange dauert die Aktivierung?", "Bei vollständigen Daten erfolgt die automatische Aktivierung zeitnah; manuelle Prüfungen durch das Kundenmanagement dauern entsprechend länger (8.5)."),
  ("Mein Antrag wurde abgelehnt. Was tun?", "Ablehnungsgrund in der Kommunikation lesen, Daten korrigieren und den Antrag erneut einreichen (8.7)."),
  ("Kann ich den Status filtern?", "Ja, die Antragsverwaltung bietet Filter nach Status, Datum und Kunde (8.1).")],
 ["__Übergangsmodul T8-9__ – Gesamtprozess und MO-Rollenvertiefung.", LINK_HB, LINK_FAQ, LINK_SUPPORT],
 shot1="Antragsverwaltung", shot2="Aktualisieren: Erstzulassung und Kennzeichen"))

# ---------------------------------------------------------------- 9
G.append(guide(9, "MO_Checks_und_fachliche_Pruefungen", "MO Checks und fachliche Prüfungen",
 "Sie kennen **Aufgaben und Abgrenzung der MO-Rolle**, führen **MO Checks** innerhalb der Vertragsanlage durch, bewerten **Prüfstatus und Gründe**, sichern die **Qualität**, behandeln **Abweichungen** und übergeben an **Entscheidung oder Support** (Kapitel 9.1 bis 9.8).",
 ["**MO** (Market Operation): fachliche Prüfung, Genehmigung, Zurückweisung", "**Dealer**: Nachlieferung von Daten und Dokumenten", "**HQ/Markt**: Prüfregeln und Contract-Review-Profile"],
 ["MO-Rolle ist freigeschaltet (Kapitel 2)", "Antrag ist unterschrieben und vollständig eingereicht (Kapitel 7 und 8)", "Prüfkriterien des Marktes sind bekannt"],
 cols(T("9.1 – 9.4 Prüfung", ["Aufgaben und Abgrenzung der MO-Rolle", "MO Checks innerhalb der Vertragsanlage", "Prüfstatus, Gründe und offene Prüfungen", "Qualitätssicherung und Systemprüfungen"]),
      T("9.5 – 9.8 Ergebnis", ["Abweichungen und erneute Prüfung", "Übergabe zur Entscheidung oder zum Support", "MO Checks bei Vertragsänderungen", "Contract Review: Profile und Übersicht"])),
 ["Öffnen Sie die **Arbeitsliste MO-Check** und wählen Sie den Antrag (9.2).",
  "Prüfen Sie **Fahrzeugdaten, Kundendaten, Dokumente und Signatur** gegen die Prüfkriterien (9.2 und 9.4); Systemprüfungen zeigen Abweichungen an.",
  "Setzen Sie den **Prüfstatus** und erfassen Sie den **Grund** (9.3). Offene Prüfungen bleiben in der Arbeitsliste sichtbar.",
  "Bei **Abweichungen** fordern Sie Korrekturen beim Dealer an und prüfen erneut (9.5).",
  "**Genehmigen** oder **weisen Sie zurück**; übergeben Sie strittige Fälle zur Entscheidung oder an den Support (9.6).",
  "Prüfen Sie **Vertragsänderungen** nach denselben Regeln (9.7) und nutzen Sie die **Contract-Review-Profile** für die Übersicht (9.8)."],
 "~~Eine Zurückweisung ist nur mit Kommentar zulässig.~~ Der Grund muss für den Dealer nachvollziehbar sein und wird in der Historie gespeichert.",
 ["Der MO prüft fachlich; technische Störungen gehen an den Support (Kapitel 23).", "Kommentare sind intern oder extern sichtbar; prüfen Sie die Sichtbarkeit vor dem Speichern (Kapitel 12.7).", "Prüfungen sind Teil des Freigabeworkflows nach Kapitel 16.3."],
 ["Alle Prüfkriterien bewertet", "Prüfstatus und Grund erfasst", "Abweichungen dokumentiert und zurückgemeldet", "Entscheidung genehmigt oder zurückgewiesen"],
 [("Was prüft der MO genau?", "Vollständigkeit und Plausibilität von Kunde, Fahrzeug, Produkt, Zahlungsdaten, Dokumenten und Signatur (9.2 und 9.4)."),
  ("Kann der Dealer den Prüfstatus sehen?", "Ja, in der Antragsverwaltung als Status und in der Kommunikation als Rückmeldung."),
  ("Wie oft darf erneut geprüft werden?", "So oft, wie Korrekturen nachgereicht werden; jede Prüfung ist in der Historie nachvollziehbar (9.5).")],
 ["__Übergangsmodul T9-10__ – Vom Prüfergebnis zur laufenden Vertragsverwaltung.", "__Rollen-/Status-/Scopematrizen__ – Anhang D.", LINK_HB, LINK_SUPPORT],
 shot1="Arbeitsliste MO-Check", shot2="Prüfung mit Genehmigen und Zurückweisen"))

# ---------------------------------------------------------------- 10
G.append(guide(10, "Vertraege_im_Alltag_verwalten", "Verträge im Alltag verwalten",
 "Sie **suchen Verträge**, ändern **Vertrags-, Kunden- und Zahlungsdaten**, führen **Zahlerwechsel und Übertragung** durch, **setzen aus und reaktivieren**, verlängern oder **beenden** Verträge und nutzen die **Änderungshistorie** (Kapitel 10.1 bis 10.8).",
 ["**Dealer**: Änderungen anstoßen, Folgeangebote erstellen", "**MO**: Prüfung von Änderungen (Kapitel 9.7)", "**Fachbereich Finanzen**: finanzielle Folgen und Nachweise"],
 ["Vertrag ist aktiv (Kapitel 8)", "Grund und Zeitpunkt der Änderung sind bekannt", "Zustimmung des Kunden liegt vor, wo erforderlich"],
 cols(T("10.1 – 10.4 Ändern", ["Verträge suchen und Details prüfen", "Vertrags-, Kunden- und Zahlungsdaten ändern", "Zahlerwechsel und Vertragsübertragung", "Aussetzen und Reaktivieren"]),
      T("10.5 – 10.8 Beenden und nachvollziehen", ["Verlängerung, Folgeangebot und Folgevertrag", "Kündigung, Stornierung und Beendigung", "Finanzielle Folgen und Abschlussnachweise", "Änderungshistorie und Nachvollziehbarkeit"])),
 ["Suchen Sie den Vertrag über Referenznummer, FIN oder Kunde und prüfen Sie die **Details** (10.1).",
  "Ändern Sie **Vertrags-, Kunden- oder Zahlungsdaten** über die zulässigen Aktionen (10.2); das Zahlungsintervall ist nachträglich nur auf „einmalig“ änderbar.",
  "Führen Sie **Zahlerwechsel** oder **Vertragsübertragung** mit den erforderlichen Nachweisen durch (10.3).",
  "**Setzen Sie aus** bzw. **reaktivieren** Sie bei berechtigten Gründen (10.4).",
  "Erstellen Sie vor Laufzeitende ein **Folgeangebot** oder einen **Folgevertrag** (10.5).",
  "Bei **Kündigung, Stornierung oder Beendigung** prüfen Sie die **finanziellen Folgen** und sichern die **Abschlussnachweise** (10.6 und 10.7).",
  "Kontrollieren Sie die **Änderungshistorie** (10.8); jede Änderung ist mit Zeitpunkt, Rolle und Grund nachvollziehbar."],
 "~~Änderungen an Produkt, Laufzeit oder Laufleistung erfordern einen Neuvertrag.~~ Stornierungen und Beendigungen haben finanzielle Folgen (Kapitel 11.6) und sind nicht umkehrbar.",
 ["Änderungen durchlaufen den MO Check nach Kapitel 9.7.", "Vertragsübertragung setzt einen neuen Halter und die Identität von Inhaber und Halter voraus (Kapitel 4.4).", "Die Historie ist Grundlage für Reporting und Governance (Kapitel 16)."],
 ["Vertrag eindeutig identifiziert", "Zulässige Änderung gewählt, Nachweise vorhanden", "Finanzielle Folgen geprüft", "Änderung in der Historie dokumentiert"],
 [("Kann ich die Laufleistung erhöhen?", "Nicht im laufenden Vertrag; dafür ist ein Neuvertrag oder Folgevertrag nötig (10.2 und 10.5)."),
  ("Was ist der Unterschied zwischen Stornierung und Kündigung?", "Stornierung hebt den Vertrag auf, Kündigung beendet ihn zum Termin; beide haben eigene finanzielle Folgen (10.6 und 10.7)."),
  ("Wo sehe ich, wer etwas geändert hat?", "In der Änderungshistorie des Vertrags (10.8).")],
 [LINK_HB, "__Rechenbeispiele und Finanzbezug__ – Anhang I.2.", LINK_FAQ, LINK_SUPPORT],
 shot1="Vertragssuche", shot2="Vertragsdetails mit Aktionen"))

# ---------------------------------------------------------------- 11
G.append(guide(11, "Rechnung_Zahlung_Kosten_und_Auswertungen", "Rechnung, Zahlung, Kosten und Auswertungen",
 "Sie verstehen **Rechnungsstellung und Zahlpläne**, unterscheiden **Rechnungs- und Zahlungsstatus**, behandeln **abweichende Rechnungsempfänger und Sammelrechnungen**, kennen **Kostenmanagement und Claims**, **Endabrechnung und Korrekturen** und nutzen **Reporting und Exporte** (Kapitel 11.1 bis 11.8).",
 ["**Dealer**: Rechnungs- und Zahlungsstatus prüfen, Werkstattbezug", "**Fachbereich Finanzen**: Zahlpläne, Korrekturen, Erstattungen", "**Markt/HQ**: Reporting und Auswertungen"],
 ["Vertrag ist aktiv und Zahlungsdaten sind erfasst (Kapitel 7)", "Zugriff auf Rechnungs- und Zahlungsinformationen", "Kenntnis der Schnittstellen zu oneERP, NEMESIS und MPay (Kapitel 19)"],
 cols(T("11.1 – 11.4 Rechnung und Kosten", ["Rechnungsstellung und Zahlpläne", "Rechnungsstatus und Zahlungsstatus unterscheiden", "Abweichende Rechnungsempfänger und Sammelrechnung", "Kostenmanagement und Claims"]),
      T("11.5 – 11.8 Abrechnung und Reporting", ["Werkstatt- und Lieferantenbezüge", "Endabrechnung, Erstattung und Korrekturen", "Reporting, Filter und Exporte", "Abweichungen an Fachbereich oder Support übergeben"])),
 ["Prüfen Sie den **Zahlplan** des Vertrags (11.1): Intervall, Beträge und Fälligkeiten.",
  "Unterscheiden Sie **Rechnungsstatus** (gestellt, storniert) und **Zahlungsstatus** (offen, bezahlt, überfällig) (11.2).",
  "Bei **abweichendem Rechnungsempfänger** oder **Sammelrechnung** prüfen Sie die Zuordnung aus Kapitel 7.2 (11.3).",
  "Verfolgen Sie **Kosten und Claims** je Vertrag (11.4) und die **Werkstatt- und Lieferantenbezüge** (11.5).",
  "Bei Beendigung erfolgt die **Endabrechnung** mit **Erstattung** oder **Korrektur** (11.6).",
  "Nutzen Sie **Reporting, Filter und Exporte** für Auswertungen (11.7) und übergeben Sie **Abweichungen** an Fachbereich oder Support (11.8)."],
 "~~Rechnungs- und Zahlungsstatus sind getrennte Größen.~~ Eine gestellte Rechnung ist nicht bezahlt, und ein Zahlungseingang ändert den Vertragsstatus nicht automatisch.",
 ["Buchhalterische Verarbeitung erfolgt in NEMESIS, Zahlungen über MPay, Kundendaten über oneERP (Kapitel 19.11 bis 19.15).", "Exporte enthalten personenbezogene Daten; beachten Sie Kapitel 16.1.", "Rechenbeispiele zu Erstattungen stehen in Anhang I.2."],
 ["Zahlplan und Fälligkeiten geprüft", "Rechnungs- und Zahlungsstatus korrekt gelesen", "Rechnungsempfänger und Sammelrechnung passend", "Abweichung mit Referenznummer übergeben"],
 [("Warum steht der Vertrag auf „bezahlt“, die Rechnung aber auf „offen“?", "Beide Status kommen aus unterschiedlichen Systemen und werden zeitversetzt aktualisiert (11.2)."),
  ("Wer korrigiert eine falsche Rechnung?", "Der Fachbereich Finanzen über den Korrekturprozess; Sie übergeben den Fall mit Referenznummer (11.6 und 11.8)."),
  ("Kann ich Reports exportieren?", "Ja, über Reporting mit Filtern und Export (11.7), rollenabhängig.")],
 ["__NEMESIS__ – Buchhalterische Verarbeitung (Kapitel 19.14).", "__MPay__ – Zahlungsintegration (Kapitel 19.15).", LINK_HB, LINK_SUPPORT],
 shot1="Zahlplan", shot2="Reporting mit Filtern"))

# ---------------------------------------------------------------- 12
G.append(guide(12, "Geschaeftskunden_Kampagnen_und_Sonderfaelle", "Geschäftskunden, Kampagnen und Sonderfälle",
 "Sie kennen die **zusätzlichen Anforderungen für Geschäftskunden** und **Flotten**, wenden **Kampagnen und Sonderkonditionen** an, stellen **Sonderfallanfragen** mit Begründung, verstehen **Dealer-Zuordnung, Validierung und Freigabe** sowie **Kommentare** und das **Customer Account Center** (Kapitel 12.1 bis 12.8).",
 ["**Dealer**: Sonderfallanfrage, Kampagnenwahl, Kommentare", "**MO/Markt**: Validierung, Freigabe oder Ablehnung", "**KAM**: betreute Großkunden und individuelle Preisanfragen"],
 ["Kundengruppe „Geschäftskunde“ oder „KAM betreute Großkunden“ ist korrekt gewählt (Kapitel 4.1)", "Kampagnenberechtigung ist laut Beschreibung gegeben", "Begründung für den Sonderfall liegt vor"],
 cols(T("12.1 – 12.4 Geschäftskunden und Sonderfall", ["Zusätzliche Anforderungen für Geschäftskunden", "Flotten- und besondere Kundenkonstellationen", "Kampagnen und Sonderkonditionen", "Sonderfallanfrage und Begründung"]),
      T("12.5 – 12.8 Bearbeitung", ["Dealer-Zuordnung und Weiterbearbeitung", "Validierung, Freigabe und Ablehnung", "Interne und externe Kommentare", "Customer Account Center"])),
 ["Erfassen Sie bei **Geschäftskunden** Firmenname und **USt-ID** sowie ggf. Industrie (12.1); bei **Flotten** prüfen Sie die Kundenkonstellation (12.2).",
  "Wählen Sie **Kampagnen** oder **Sonderkonditionen** nur, wenn die Berechtigung laut Beschreibung erfüllt ist (12.3).",
  "Stellen Sie bei Abweichungen vom Standard eine **Sonderfallanfrage** mit nachvollziehbarer **Begründung** (12.4).",
  "Die Anfrage wird dem zuständigen **Dealer** bzw. Bearbeiter zugeordnet (12.5) und durch MO oder Markt **validiert, freigegeben oder abgelehnt** (12.6).",
  "Nutzen Sie **interne Kommentare** für die Abstimmung und **externe Kommentare** für Rückmeldungen an den Kunden (12.7).",
  "Verwalten Sie Kundenkonten und Sonderfälle im **Customer Account Center** (12.8)."],
 "~~Die Kundengruppe „KAM betreute Großkunden“ ist nur bei individuellen Preisanfragen zu verwenden~~, d. h. bei KAM-betreuten Kunden bzw. bei FS 140+.",
 ["Sonderfreigaben lösen immer eine MO-Prüfung aus (Kapitel 6.5 und 9).", "Externe Kommentare sind für den Kunden sichtbar; keine internen Informationen eintragen.", "Kampagnen werden vom Markt gepflegt (Kapitel 14.13)."],
 ["Kundengruppe und Zusatzangaben korrekt", "Kampagnenberechtigung geprüft", "Sonderfall begründet und eingereicht", "Kommentarsichtbarkeit beachtet"],
 [("Wann brauche ich eine Sonderfallanfrage?", "Wenn Konditionen, Kundenkonstellation oder Produkt vom Standard abweichen (12.4)."),
  ("Wer entscheidet über den Sonderfall?", "MO oder Markt nach Validierung; das Ergebnis sehen Sie im Antrag und in den Kommentaren (12.6)."),
  ("Was ist das Customer Account Center?", "Der Bereich zur Verwaltung von Kundenkonten, Beziehungen und Sonderfällen (12.8).")],
 [LINK_HB, "__Praxisbeispiele entlang des Vertragsprozesses__ – Anhang I.1.", LINK_FAQ, LINK_SUPPORT],
 shot1="Kampagnen und Händlerrabatt", shot2="Sonderfallanfrage"))

# ---------------------------------------------------------------- 13
G.append(guide(13, "Reifenprodukte_Tyres", "Reifenprodukte – Tyres",
 "Sie ordnen **Reifenprodukte** gegenüber dem Standardprozess ein, wählen **Produkt, Reifentyp und Reifengröße**, konfigurieren **Laufzeit, Laufleistung und Leistungsumfang**, prüfen **Preis, Optionen und Kampagnen**, führen **Antrag, Dokumente und Aktivierung** durch und verwalten den Vertrag bis zur **Beendigung** (Kapitel 13.1 bis 13.7).",
 ["**Dealer**: Reifenvertrag anbieten, beantragen, verwalten", "**Markt**: Reifenprodukte, Größen und Preise pflegen", "**MO**: Prüfung und Aktivierung"],
 ["Fahrzeugdaten geladen (Kapitel 5)", "Reifentyp und Reifengröße des Fahrzeugs bekannt", "Reifenprodukt ist im Markt freigegeben"],
 cols(T("13.1 – 13.4 Produkt", ["Einordnung und Abgrenzung zum Standardprozess", "Produkt, Reifentyp und Reifengröße", "Laufzeit, Laufleistung und Leistungsumfang", "Preis, Optionen und Kampagnen"]),
      T("13.5 – 13.7 Vertrag", ["Antrag, Dokumente und Aktivierung", "Laufende Verwaltung und Leistungsbezug", "Verlängerung und Beendigung"])),
 ["Erkennen Sie die **Abgrenzung** (13.1): Reifenprodukte folgen dem Standardprozess, haben aber eigene Produkt- und Preisparameter.",
  "Wählen Sie das **Reifenprodukt** sowie **Reifentyp** und **Reifengröße** passend zum Fahrzeug (13.2).",
  "Konfigurieren Sie **Laufzeit, Laufleistung und Leistungsumfang** (13.3) und prüfen Sie **Preis, Optionen und Kampagnen** (13.4).",
  "Erstellen Sie den **Antrag**, holen Sie die Unterschrift ein und laden Sie die Dokumente hoch (13.5, wie Kapitel 6 bis 8).",
  "Im laufenden Vertrag erfolgt der **Leistungsbezug** über die Werkstatt (13.6).",
  "Vor Laufzeitende prüfen Sie **Verlängerung** oder **Beendigung** (13.7)."],
 "~~Reifengröße und Reifentyp müssen zur Fahrzeugausstattung passen.~~ Abweichungen führen zur Zurückweisung im MO Check und verhindern den Leistungsbezug.",
 ["Technische Optionen und Coverage-Codes werden zentral gepflegt (Kapitel 15.7).", "Spartenunterschiede Pkw/Van beachten (Kapitel 21).", "Kampagnen für Reifenprodukte sind markt- und zeitabhängig (Kapitel 14.13)."],
 ["Reifenprodukt im Markt verfügbar", "Reifentyp und -größe korrekt", "Laufzeit und Laufleistung konfiguriert", "Antrag aktiviert, Leistungsbezug möglich"],
 [("Kann ich Reifen und Service in einem Vertrag kombinieren?", "Das hängt vom Produktangebot des Marktes ab (Kapitel 13.1 und 14.8)."),
  ("Woher kommt die Reifengröße?", "Aus den Fahrzeugdaten; prüfen Sie sie gegen die tatsächliche Ausstattung (13.2)."),
  ("Wie läuft der Leistungsbezug?", "Über die Werkstatt mit Bezug auf Vertrag und Coverage (13.6 und 19.9).")],
 [LINK_HB, "__VEGA__ – Vertrag, Coverage und Claim (Kapitel 19.9).", LINK_FAQ, LINK_SUPPORT],
 shot1="Reifenprodukt auswählen", shot2="Reifentyp und Reifengröße"))

# ---------------------------------------------------------------- 14
G.append(guide(14, "Marktrolle_Produkt_und_Preispflege_sowie_Administration", "Marktrolle, Produkt- und Preispflege sowie Administration",
 "Sie kennen **Aufgaben und Abgrenzung der Marktrolle**, pflegen **marktspezifische Einstellungen**, **Vorlagen**, **Produkte, Preisversionen, Fahrzeuggruppen und Kampagnen**, nutzen **Product Testing** und dokumentieren **Änderungen und Freigaben** (Kapitel 14.1 bis 14.14).",
 ["**Markt**: Produkt-, Preis- und Kampagnenpflege, Administration", "**HQ**: Blueprint und Freigaben (Kapitel 15)", "**MO/Dealer**: Rückmeldungen aus Prüfung und Vertrieb"],
 ["Marktrolle mit Administrationsrechten (Kapitel 2)", "Blueprint und Länderabweichungen bekannt (Kapitel 15 und 20)", "Freigabeprozess des Marktes geklärt (Kapitel 16.3)"],
 cols(T("14.1 – 14.7 Markt und Administration", ["Aufgaben und Abgrenzung der Marktrolle", "Marktspezifische Einstellungen", "Länderabweichungen vom Blueprint", "Vorlagenverwaltung und Template Management", "Administrationsbereich und zulässige Aktionen", "Marktbezogene Sichtbarkeit und Berechtigungen", "Änderungen prüfen, freigeben und dokumentieren"]),
      T("14.8 – 14.14 Produkt, Preis, Kampagne", ["Produktdefinition, Anlage und Veröffentlichung", "Preisversionen, Cluster und Faktorgrenzen", "Produktänderung, Versionierung und Bestandswirkung", "Fahrzeuggruppen und Van-Baumuster-Clustering", "Product Testing als Arbeitsbereich", "Kampagnenanlage und Rabattpflege", "Preiskomponenten, Cost Unit Split und Inflation"])),
 ["Klären Sie **Aufgaben und Abgrenzung** zur HQ-Rolle (14.1) und pflegen Sie **marktspezifische Einstellungen** und **Länderabweichungen** (14.2 und 14.3).",
  "Verwalten Sie **Vorlagen** (14.4) und nutzen Sie nur die **zulässigen Aktionen** im Administrationsbereich (14.5); prüfen Sie **Sichtbarkeit und Berechtigungen** (14.6).",
  "**Definieren** Sie Produkte, legen Sie sie an und **veröffentlichen** Sie sie (14.8).",
  "Pflegen Sie **Preisversionen, Cluster und Faktorgrenzen** sowie **Preiskomponenten, Cost Unit Split und Inflation** (14.9 und 14.14).",
  "Bei **Produktänderungen** beachten Sie **Versionierung** und **Bestandswirkung** (14.10); clustern Sie **Fahrzeuggruppen** und **Van-Baumuster** (14.11).",
  "Testen Sie Änderungen im **Product Testing** (14.12), bevor Sie **Kampagnen und Rabatte** anlegen (14.13).",
  "**Prüfen, freigeben und dokumentieren** Sie jede Änderung (14.7)."],
 "~~Veröffentlichte Preisversionen wirken sofort auf neue Angebote.~~ Prüfen Sie Faktorgrenzen und Bestandswirkung im Product Testing, bevor Sie veröffentlichen.",
 ["Länderabweichungen müssen im Register (Kapitel 20.6) dokumentiert sein, sonst gilt der Blueprint.", "Produktänderungen wirken je nach Versionierung nur auf Neuverträge oder auch auf den Bestand (14.10).", "Übergangsmodule T14-15 und T15-14 beschreiben das Zusammenspiel mit HQ."],
 ["Änderung im Product Testing geprüft", "Preisversion, Cluster und Faktorgrenzen plausibel", "Bestandswirkung bewertet", "Freigabe dokumentiert"],
 [("Was darf der Markt ohne HQ ändern?", "Marktspezifische Einstellungen, Preise, Kampagnen und Vorlagen innerhalb des Blueprints; Abweichungen brauchen HQ-Freigabe (14.3 und 15.4)."),
  ("Wie teste ich ein neues Produkt?", "Im Product Testing mit Testdaten aus Anhang I.3, bevor es veröffentlicht wird (14.12)."),
  ("Was ist ein Cost Unit Split?", "Die Aufteilung des Preises auf Kostenkomponenten, z. B. für Inflationsanpassungen (14.14).")],
 ["__Übergangsmodul T14-15__ – Marktpflege und zentrale Vorgaben verbinden.", "__Testdatenkatalog__ – Anhang I.3.", LINK_HB, LINK_SUPPORT],
 shot1="Administrationsbereich", shot2="Preisversion anlegen"))

# ---------------------------------------------------------------- 15
G.append(guide(15, "HQ_Rolle_Blueprint_und_zentrale_Stammdaten", "HQ-Rolle, Blueprint und zentrale Stammdaten",
 "Sie kennen **Aufgaben und Abgrenzung der HQ-Rolle**, pflegen den **Blueprint** und **globale Standards**, behandeln **Länderabweichungen**, steuern **Governance und Freigaben**, arbeiten mit **Markt und MO** zusammen und verantworten **Technical Options, SA-Matching und Coverage-Codes** (Kapitel 15.1 bis 15.7).",
 ["**HQ**: Blueprint, globale Standards, zentrale Stammdaten", "**Markt**: lokale Ausprägung und Rückmeldung (Kapitel 14)", "**MO**: Prüfregeln und Qualitätsrückmeldungen (Kapitel 9)"],
 ["HQ-Rolle mit zentralen Pflegerechten", "Governance-Prozess und Freigabestufen bekannt (Kapitel 16)", "Länderabweichungsregister zugänglich (Kapitel 20.6)"],
 cols(T("15.1 – 15.4 Blueprint und Governance", ["Aufgaben und Abgrenzung der HQ-Rolle", "Blueprint-Pflege und globale Standards", "Umgang mit Länderabweichungen", "Governance und Freigaben auf HQ-Ebene"]),
      T("15.5 – 15.7 Zusammenarbeit und Stammdaten", ["Zusammenarbeit mit Markt und MO", "Aufgabenbeschreibung versus dokumentierte Navigation", "Technical Options, SA-Matching und Coverage-Codes"])),
 ["Grenzen Sie die **HQ-Rolle** gegen Markt und MO ab (15.1).",
  "Pflegen Sie den **Blueprint** und die **globalen Standards** als verbindliche Grundlage aller Märkte (15.2).",
  "Bewerten Sie **Länderabweichungen** und geben Sie sie frei oder lehnen Sie sie ab (15.3); Ergebnis ins Register (Kapitel 20.6).",
  "Steuern Sie **Governance und Freigaben** auf HQ-Ebene (15.4) nach dem Freigabeworkflow aus Kapitel 16.3.",
  "Stimmen Sie sich mit **Markt und MO** ab (15.5); unterscheiden Sie **Aufgabenbeschreibung** und **dokumentierte Navigation** im System (15.6).",
  "Pflegen Sie **Technical Options, SA-Matching und Coverage-Codes** zentral (15.7); sie steuern Produktzuordnung und Leistungsbezug."],
 "~~Änderungen an Coverage-Codes und SA-Matching wirken auf alle Märkte und Sparten.~~ Sie werden nur nach Freigabe und mit Testnachweis veröffentlicht (Kapitel 16.4).",
 ["Der Blueprint ist Referenz für Schulung und Handbuch; Abweichungen sind je Land dokumentiert (Kapitel 20).", "HQ-Freigaben sind im Klärungsregister nachvollziehbar (Anhang F).", "Übergangsmodule T15-14 und T15-16 verbinden HQ-Pflege mit Markt und Governance."],
 ["Blueprint-Änderung begründet und freigegeben", "Länderabweichung bewertet und im Register", "Technical Options und Coverage-Codes getestet", "Markt und MO informiert"],
 [("Was ist der Blueprint?", "Der globale Standardprozess mit Produkten, Regeln und Stammdaten, von dem Märkte nur dokumentiert abweichen dürfen (15.2)."),
  ("Wer pflegt Coverage-Codes?", "HQ zentral; Märkte nutzen sie in Produktdefinition und Leistungsbezug (15.7)."),
  ("Wie gehen HQ und Markt bei Konflikten vor?", "Über das Klärungsregister und die Governance-Freigabe (15.4 und 16.7).")],
 ["__Übergangsmodul T15-14__ – Zentrale Grundlagen an die Marktpflege übergeben.", "__Übergangsmodul T15-16__ – Von der Pflegeentscheidung zum Governance-Nachweis.", LINK_HB, LINK_SUPPORT],
 shot1="Blueprint-Pflege", shot2="Technical Options und Coverage-Codes"))

# ---------------------------------------------------------------- 16
G.append(guide(16, "Governance_Qualitaet_Datenschutz_und_Archivierung", "Governance, Qualität, Datenschutz und Archivierung",
 "Sie beachten **Datenschutz** und sichere Beispieldaten, sichern **Datenqualität und Datenführerschaft**, nutzen den **Freigabeworkflow**, dokumentieren **Testnachweise**, unterscheiden **Dokumentenverwaltung und Archivierung**, führen **Quellen, Tickets und Versionen** sowie das **Klärungsregister** (Kapitel 16.1 bis 16.8).",
 ["**Alle Rollen**: Datenschutz und Datenqualität", "**Markt/HQ**: Freigabeworkflow, Versionsführung, Governance", "**Dealer**: Dealer-Governance und Reportingnachweise"],
 ["Kenntnis der Datenschutzregeln des Konzerns", "Zugriff auf Klärungsregister und Ticketreferenzen", "Freigabestufen des Marktes bekannt"],
 cols(T("16.1 – 16.4 Datenschutz und Qualität", ["Datenschutz und sichere Beispieldaten", "Datenqualität und Datenführerschaft", "Fachliche Prüfung und Freigabeworkflow", "Testnachweise und produktiver Funktionsstand"]),
      T("16.5 – 16.8 Nachweise", ["Dokumentenverwaltung und Archivierung unterscheiden", "Quellen, Ticketreferenzen und Versionsführung", "Widersprüche, Lücken und Klärungsregister", "Dealer-Governance und Reportingnachweise"])),
 ["Verwenden Sie in Schulung, Tickets und Bildschirmbildern nur **sichere Beispieldaten**; keine echten Kunden- oder Bankdaten (16.1).",
  "Beachten Sie die **Datenführerschaft** (16.2): Das führende System (z. B. oneERP für Kunden) ist maßgeblich; Korrekturen erfolgen dort.",
  "Durchlaufen Sie den **Freigabeworkflow** (16.3): fachliche Prüfung, Freigabe, Dokumentation.",
  "Hinterlegen Sie **Testnachweise** und halten Sie den **produktiven Funktionsstand** fest (16.4).",
  "Unterscheiden Sie **Dokumentenverwaltung** (laufender Vorgang) und **Archivierung** (rechtssichere Ablage) (16.5).",
  "Führen Sie **Quellen, Ticketreferenzen und Versionen** (16.6) und tragen Sie **Widersprüche und Lücken** ins **Klärungsregister** ein (16.7).",
  "Sichern Sie **Dealer-Governance** und **Reportingnachweise** (16.8)."],
 "~~Personenbezogene Daten gehören nie in Kommentare, Tickets oder Bildschirmbilder.~~ Verwenden Sie den Testdatenkatalog (Anhang I.3) und anonymisieren Sie Beispiele.",
 ["Archivierte Dokumente sind unveränderlich; Korrekturen erzeugen neue Versionen.", "Jede Handbuchaussage hat eine Quelle oder Ticketreferenz (Anhang F).", "Das Klärungsregister ist Pflichtlektüre vor Releases (Kapitel 22)."],
 ["Beispiele anonymisiert", "Führendes System beachtet", "Freigabe dokumentiert", "Klärungsregister aktualisiert"],
 [("Darf ich ein Bildschirmbild mit Kundendaten an den Support senden?", "Nur anonymisiert oder mit Testdaten; echte Daten sind zu schwärzen (16.1)."),
  ("Was ist der Unterschied zwischen Dokumentenverwaltung und Archivierung?", "Dokumentenverwaltung begleitet den Vorgang, Archivierung ist die rechtssichere, unveränderliche Ablage (16.5)."),
  ("Wo melde ich einen Widerspruch im Handbuch?", "Im Klärungsregister mit Kapitel, Quelle und Ticketreferenz (16.7 und Anhang F).")],
 ["__Quellen und Klärungsregister__ – Anhang F.", "__Testdatenkatalog und Nachweise__ – Anhang I.3.", LINK_HB, LINK_SUPPORT],
 shot1="Dokumentenverwaltung", shot2="Klärungsregister"))

# ---------------------------------------------------------------- 17
G.append(guide(17, "Rollout_und_Einfuehrung", "Rollout und Einführung",
 "Sie kennen **Zielmärkte und Einführungsumfang**, die **Voraussetzungen für Zugang, Konfiguration und Schulung**, die **Marktvorbereitung mit fachlicher Abnahme**, die **Schulung und Übergabe in den Betrieb** sowie die **Begleitung nach der Einführung** (Kapitel 17.1 bis 17.5).",
 ["**Projekt/HQ**: Rollout-Planung und Abnahme", "**Markt**: Marktvorbereitung, Konfiguration, Schulung", "**Dealer/MO**: Teilnahme an Schulung und Abnahme"],
 ["Rollout-Plan mit Zielmärkten liegt vor", "Berechtigungen für Schulungs- und Produktivsystem beantragt (Kapitel 2)", "Marktkonfiguration nach Kapitel 14 abgeschlossen"],
 cols(T("17.1 – 17.3 Vorbereitung", ["Zielmärkte und Einführungsumfang", "Voraussetzungen für Zugang, Konfiguration und Schulung", "Marktvorbereitung und fachliche Abnahme"]),
      T("17.4 – 17.5 Betrieb", ["Schulung und Übergabe in den Betrieb", "Begleitung nach Einführung und offene Punkte"])),
 ["Klären Sie **Zielmärkte und Einführungsumfang** (17.1): Welche Sparten, Produkte und Rollen gehen wann live?",
  "Stellen Sie die **Voraussetzungen** sicher (17.2): Zugänge, Marktkonfiguration, Schulungsumgebung.",
  "Führen Sie die **Marktvorbereitung** durch und dokumentieren Sie die **fachliche Abnahme** mit Testnachweisen (17.3, Kapitel 16.4).",
  "Schulen Sie die Rollen mit Handbuch, Quick Guides und Wissenschecks (Anhang H) und übergeben Sie in den **Betrieb** (17.4).",
  "Begleiten Sie die Einführung (**Hypercare**) und führen Sie **offene Punkte** im Klärungsregister (17.5)."],
 "~~Ohne dokumentierte fachliche Abnahme erfolgt kein Produktivstart im Markt.~~ Abnahme, Testnachweise und Schulungsstand sind Voraussetzung für die Übergabe in den Betrieb.",
 ["Länderbezogene Einführung und Migration stehen in Kapitel 20.5 und 18.", "Alltagschecklisten für den Start finden Sie in Anhang B.", "Releaseinformationen zum Funktionsstand in Kapitel 22.4."],
 ["Zielmärkte und Umfang bestätigt", "Zugänge und Konfiguration bereit", "Abnahme dokumentiert", "Schulung durchgeführt, offene Punkte erfasst"],
 [("Wer nimmt den Markt ab?", "Der Markt fachlich, HQ für Blueprint-Konformität; beides wird dokumentiert (17.3)."),
  ("Welche Schulungsunterlagen gibt es?", "Handbuch, Quick Guides je Kapitel, Wissenschecks (Anhang H) und Schulungsmaterial im RetailPortal."),
  ("Wie lange dauert die Begleitung nach Einführung?", "Nach Rollout-Plan des Marktes; offene Punkte werden bis zur Schließung im Register geführt (17.5).")],
 [LINK_RP, "__Wissenschecks und Lösungen__ – Anhang H.", LINK_HB, LINK_SUPPORT],
 shot1="Rollout-Plan", shot2="Abnahmeprotokoll"))

# ---------------------------------------------------------------- 18
G.append(guide(18, "Migration_und_Uebernahme_von_Bestandsdaten", "Migration und Übernahme von Bestandsdaten",
 "Sie kennen **Umfang und Abgrenzung der Migration**, die **Quellsysteme und Datenobjekte**, die **Datenzuordnung und Qualitätsprüfung**, prüfen **übernommene Kunden und Verträge**, behandeln **Fehlerfälle** und verstehen **Cutover und Parallelbetrieb** (Kapitel 18.1 bis 18.6).",
 ["**Projekt/HQ**: Migrationsumfang, Cutover", "**Markt**: Datenzuordnung und Qualitätsprüfung", "**Dealer/MO**: Prüfung übernommener Kunden und Verträge"],
 ["Migrationsplan und Quellsysteme sind bekannt", "Zugriff auf Prüf- und Fehlerlisten", "Korrekturwege und Ansprechpersonen sind festgelegt"],
 cols(T("18.1 – 18.3 Vorbereitung", ["Umfang und Abgrenzung der Migration", "Quellsysteme und Datenobjekte", "Datenzuordnung und Qualitätsprüfung"]),
      T("18.4 – 18.6 Durchführung", ["Übernommene Kunden und Verträge prüfen", "Fehlerfälle, Korrekturwege und Nachweise", "Cutover und Parallelbetrieb"])),
 ["Klären Sie **Umfang und Abgrenzung** (18.1): Welche Verträge, Kunden und Dokumente werden übernommen, welche verbleiben im Altsystem?",
  "Identifizieren Sie **Quellsysteme und Datenobjekte** (18.2), z. B. Legacy-Systeme aus Kapitel 19.20.",
  "Prüfen Sie **Datenzuordnung** (Mapping) und **Qualität** anhand der Prüfregeln (18.3).",
  "Prüfen Sie **übernommene Kunden und Verträge** stichprobenartig und nach Fehlerliste (18.4).",
  "Behandeln Sie **Fehlerfälle** über die definierten **Korrekturwege** und sichern Sie **Nachweise** (18.5).",
  "Beachten Sie **Cutover und Parallelbetrieb** (18.6): Ab dem Stichtag gilt oneSCM als führend."],
 "~~Während des Parallelbetriebs dürfen migrierte Verträge nur im führenden System geändert werden.~~ Doppelpflege erzeugt Widersprüche und blockiert die Aktivierung.",
 ["Migrierte Verträge sind in der Historie als migriert gekennzeichnet (Kapitel 10.8).", "Datenführerschaft nach Kapitel 16.2 gilt auch für Altdaten.", "Länderbezogene Migration in Kapitel 20.5."],
 ["Migrationsumfang bestätigt", "Mapping und Qualität geprüft", "Stichproben kontrolliert", "Fehlerfälle mit Nachweis korrigiert"],
 [("Werden alle Altverträge migriert?", "Nur die im Migrationsumfang definierten; der Rest läuft im Altsystem aus (18.1)."),
  ("Was mache ich mit einem fehlerhaft migrierten Vertrag?", "Fehlerfall über den Korrekturweg melden, nicht manuell nachbauen (18.5)."),
  ("Wann endet der Parallelbetrieb?", "Mit dem im Cutover-Plan festgelegten Stichtag (18.6).")],
 ["__Legacy-Systeme und Übergangsarchitektur__ – Kapitel 19.20.", LINK_HB, LINK_FAQ, LINK_SUPPORT],
 shot1="Migrationsübersicht", shot2="Fehlerliste"))

# ---------------------------------------------------------------- 19
G.append(guide(19, "IT_Architektur", "IT Architektur",
 "Sie kennen die **Systemlandkarte** und die angebundenen Systeme für **Auftrags-, Fahrzeug-, Vertrags-, Finanz-, Zahlungs- und Berechtigungsdaten**, die **Integrationswege**, den **Schnittstellenbetrieb mit Fehlerbehandlung** sowie die **Einzelsteckbriefe** (Kapitel 19.1 bis 19.31).",
 ["**HQ/IT**: Architektur, Schnittstellenbetrieb", "**Markt/MO**: Fehlerbehandlung und Nachweise", "**Dealer**: Verständnis der Datenherkunft"],
 ["Grundverständnis des Vertragsprozesses (Kapitel 3)", "Zugriff auf das Architekturregister (19.23)", "Supportweg für Schnittstellenfehler bekannt (Kapitel 23)"],
 cols(T("Auftrag und Fahrzeug (19.2 – 19.10)", ["GO – Pkw-Auftragsinformationen", "AFAB – Van-Auftragsinformationen", "CEPRO – Van-Fahrzeugstammdaten", "OTR – Auftrags- und Fahrzeugbezug", "DSB – Kilometerstand", "Warranty-and-Goodwill-API, MIC", "VEGA – Vertrag, Coverage, Claim", "BS4 bzw. SDB4"]),
      T("Finanzen, Zahlung, Berechtigung (19.11 – 19.17)", ["oneERP – Kunden- und Finanzintegration", "CoFiCo und SWT – FI-Anbindung", "NEMESIS – Buchhaltung", "MPay – Zahlung", "ALICE – Berechtigungen", "DATIX – Manuelle Übergabe"]),
      T("Betrieb und Steckbriefe (19.18 – 19.31)", ["Weitere Systeme, Datenplattformen, Legacy", "Integrationswege und Schnittstellenbetrieb", "Architekturregister", "Steckbriefe: VeDoc, VERSO/VOM, oneDoC, Xentry, MBFS Bundling, POS-Kanäle, Versicherer, Lieferanten"])),
 ["Starten Sie mit **Architekturüberblick und Systemlandkarte** (19.1).",
  ["Ordnen Sie die Datenquellen je Prozessschritt zu:", "Fahrzeug und Auftrag: GO, AFAB, CEPRO, OTR, MIC, DSB (19.2 bis 19.8)", "Vertrag und Leistung: VEGA, BS4/SDB4, Warranty-and-Goodwill-API (19.7, 19.9, 19.10)", "Kunde und Finanzen: oneERP, CoFiCo, SWT, NEMESIS, MPay (19.11 bis 19.15)", "Zugang: ALICE (19.16); manuelle Übergabe: DATIX (19.17)"],
  "Kennen Sie die **technischen Integrationswege** (19.21) und den **Schnittstellenbetrieb** mit **Fehlerbehandlung** (19.22).",
  "Nutzen Sie das **Architekturregister** für offene Nachweise (19.23).",
  "Schlagen Sie bei Bedarf die **Einzelsteckbriefe** nach (19.24 bis 19.31)."],
 "~~Schnittstellenfehler nicht durch manuelle Doppelpflege umgehen.~~ Melden Sie den Fehler mit Referenznummer und System an den Support; DATIX ist nur der dokumentierte manuelle Übergabeweg.",
 ["Pkw und Van nutzen unterschiedliche Auftragssysteme (GO bzw. AFAB/CEPRO).", "Datenplattformen und Reporting (19.19) sind lesend angebunden.", "Legacy-Systeme (19.20) laufen nur bis zum Cutover (Kapitel 18.6)."],
 ["Systemlandkarte verstanden", "Datenquelle je Prozessschritt bekannt", "Fehlerweg bei Schnittstellenstörung bekannt", "Steckbrief des betroffenen Systems gelesen"],
 [("Woher kommen die Fahrzeugdaten im Antrag?", "Je nach Einstiegspunkt aus OTR, VERSO/VOM oder MIC; Van-Stammdaten aus CEPRO (19.4 bis 19.8)."),
  ("Was macht VEGA?", "VEGA führt Vertrag, Coverage und Claim für den Leistungsbezug (19.9)."),
  ("Wann wird DATIX genutzt?", "Nur für die dokumentierte manuelle Übergabe, wenn kein automatischer Weg besteht (19.17).")],
 ["__Architekturregister und offene Nachweise__ – Kapitel 19.23.", "__Schnittstellenbetrieb und Fehlerbehandlung__ – Kapitel 19.22.", LINK_HB, LINK_SUPPORT],
 shot1="Systemlandkarte", shot2="Schnittstellenmonitor"))

# ---------------------------------------------------------------- 20
G.append(guide(20, "Laenderspezifische_Themen", "Länderspezifische Themen",
 "Sie lesen das **Länder- und Marktprofil**, kennen **lokale Rollen und Zugangsvarianten**, **lokale Produkte, Preise und Kampagnen**, **Zahlung, Dokumente und Signatur je Land**, die **länderbezogene Einführung und Migration** sowie das **Länderabweichungsregister** (Kapitel 20.1 bis 20.6).",
 ["**Markt**: Länderprofil und Abweichungsregister pflegen", "**HQ**: Abweichungen freigeben (Kapitel 15.3)", "**Dealer/MO**: lokale Regeln anwenden"],
 ["Eigenes Land und Markt sind bekannt (Kapitel 2.4)", "Zugriff auf das Länderabweichungsregister", "Blueprint-Kenntnis (Kapitel 15.2)"],
 cols(T("20.1 – 20.3 Profil und Produkte", ["Länder- und Marktprofil", "Lokale Rollen und Zugangsvarianten", "Lokale Produkte, Preise und Kampagnen"]),
      T("20.4 – 20.6 Abwicklung und Qualität", ["Zahlung, Dokumente und Signatur je Land", "Länderbezogene Einführung und Migration", "Länderabweichungsregister und Qualität"])),
 ["Lesen Sie das **Länder- und Marktprofil** Ihres Landes (20.1).",
  "Prüfen Sie **lokale Rollen und Zugangsvarianten** (20.2) gegenüber Kapitel 2.",
  "Beachten Sie **lokale Produkte, Preise und Kampagnen** (20.3) und deren Pflege durch den Markt (Kapitel 14).",
  "Wenden Sie die landesspezifischen Regeln für **Zahlung, Dokumente und Signatur** an (20.4), z. B. Sprachvarianten und zulässige Signaturarten.",
  "Verfolgen Sie **Einführung und Migration** Ihres Landes (20.5, Kapitel 17 und 18).",
  "Prüfen Sie jede Abweichung im **Länderabweichungsregister** (20.6); nur dokumentierte Abweichungen gelten."],
 "~~Nicht dokumentierte Länderabweichungen sind unzulässig.~~ Im Zweifel gilt der Blueprint; Abweichungen werden über Markt und HQ ins Register aufgenommen.",
 ["Das Register enthält je Abweichung Grund, Freigabe und Gültigkeit.", "Signaturarten und Dokumentensprachen können je Land abweichen (Kapitel 7.4 bis 7.6).", "Bekannte Fehler mit Marktbezug stehen in Kapitel 23.2."],
 ["Länderprofil gelesen", "Lokale Rollen und Zugang geprüft", "Lokale Produkt- und Zahlungsregeln bekannt", "Abweichungen im Register geprüft"],
 [("Gilt mein Quick Guide in jedem Land?", "Der Standardprozess ja; landesspezifische Abweichungen stehen im Länderprofil und Register (20.1 und 20.6)."),
  ("Wer trägt Abweichungen ein?", "Der Markt beantragt, HQ gibt frei (15.3 und 20.6)."),
  ("Welche Signaturarten gibt es in meinem Land?", "Siehe Kapitel 20.4 und das Länderprofil.")],
 ["__Länderabweichungsregister__ – Kapitel 20.6.", LINK_HB, LINK_FAQ, LINK_SUPPORT],
 shot1="Länderprofil", shot2="Länderabweichungsregister"))

# ---------------------------------------------------------------- 21
G.append(guide(21, "Spartenspezifische_Themen", "Spartenspezifische Themen",
 "Sie kennen das **Spartenprofil** und die **Abgrenzung Pkw/Van**, die **Fahrzeugdaten und Kennungen je Sparte**, **Produkte und Preisparameter je Sparte**, **Antrag, Signatur und Aktivierung je Sparte**, **Verwaltung und Finanzfolgen** sowie **Spartenplanung, Tests und Freigaben** (Kapitel 21.1 bis 21.6).",
 ["**Dealer**: spartenrichtige Erfassung", "**Markt**: Produkte und Preise je Sparte (Kapitel 14.11)", "**HQ**: Spartenplanung und Freigaben"],
 ["Rolle für die jeweilige Sparte freigeschaltet (z. B. oneSCM.DealerVAN)", "Spartenkontext ist gesetzt (Kapitel 2.4)", "Fahrzeugkennungen der Sparte bekannt"],
 cols(T("21.1 – 21.3 Profil und Daten", ["Spartenprofil und Abgrenzung Pkw/Van", "Fahrzeugdaten und Kennungen je Sparte", "Produkte und Preisparameter je Sparte"]),
      T("21.4 – 21.6 Prozess und Planung", ["Antrag, Signatur und Aktivierung je Sparte", "Verwaltung und Finanzfolgen je Sparte", "Spartenplanung, Tests und Freigaben"])),
 ["Lesen Sie das **Spartenprofil** und die **Abgrenzung Pkw/Van** (21.1).",
  ["Nutzen Sie die **Kennungen je Sparte** (21.2):", "Pkw: Auftragsdaten aus GO (Kapitel 19.2)", "Van: Auftragsdaten aus AFAB, Stammdaten aus CEPRO, Baumuster-Clustering (Kapitel 19.3, 19.4, 14.11)"],
  "Wählen Sie **Produkte und Preisparameter** der Sparte (21.3).",
  "Führen Sie **Antrag, Signatur und Aktivierung** nach den Spartenregeln durch (21.4).",
  "Beachten Sie **Verwaltung und Finanzfolgen** je Sparte (21.5).",
  "**Spartenplanung, Tests und Freigaben** liegen bei Markt und HQ (21.6)."],
 "~~Pkw- und Van-Verträge nutzen unterschiedliche Auftragssysteme und Kennungen.~~ Ein falscher Spartenkontext führt zu falschen Produkten und Preisen; prüfen Sie den Kontext vor dem Angebot.",
 ["Die Vorlage dieses Quick Guides ist das Van-Beispiel „Antragserstellung und -verwaltung“.", "Van-Baumuster werden in Fahrzeuggruppen geclustert (Kapitel 14.11).", "Spartenübergreifende Sonderfälle in Kapitel 12."],
 ["Spartenkontext korrekt", "Kennung der Sparte verwendet", "Produkt der Sparte gewählt", "Spartenregeln für Signatur und Aktivierung beachtet"],
 [("Kann ich mit der Van-Rolle Pkw-Verträge anlegen?", "Nein, dafür ist die Pkw-Rolle und der passende Kontext nötig (Kapitel 2.2)."),
  ("Warum unterscheiden sich die Einstiegspunkte?", "Weil Pkw und Van unterschiedliche Auftrags- und Stammdatensysteme haben (21.2 und 19)."),
  ("Wo stehen die Spartentests?", "In Kapitel 21.6 und im Testdatenkatalog (Anhang I.3).")],
 ["__Spartenprofil Pkw/Van__ – Kapitel 21.1.", LINK_HB, LINK_FAQ, LINK_SUPPORT],
 shot1="Spartenkontext", shot2="Einstiegspunkt je Sparte"))

# ---------------------------------------------------------------- 22
G.append(guide(22, "Ausblick_und_Weiterentwicklung", "Ausblick und Weiterentwicklung",
 "Sie kennen den **bestätigten Funktionsstand**, die **geplanten Erweiterungen und offenen Anforderungen**, die **Auswirkungen auf Schulung und Handbuch** sowie die **Releaseinformationen und Änderungsübersicht** (Kapitel 22.1 bis 22.4).",
 ["**HQ/Projekt**: Releaseplanung und Änderungsübersicht", "**Markt**: Bewertung der Auswirkungen auf Schulung", "**Alle Rollen**: Kenntnis des gültigen Funktionsstands"],
 ["Aktuelle Handbuchversion und Releasestand bekannt", "Zugriff auf Releaseinformationen", "Klärungsregister für offene Anforderungen (Anhang F)"],
 cols(T("22.1 – 22.2 Stand und Planung", ["Bestätigter Funktionsstand", "Geplante Erweiterungen und offene Anforderungen"]),
      T("22.3 – 22.4 Auswirkung und Release", ["Auswirkungen auf Schulung und Handbuch", "Releaseinformationen und Änderungsübersicht"])),
 ["Prüfen Sie den **bestätigten Funktionsstand** (22.1): Nur dokumentierte und getestete Funktionen gelten als produktiv (Kapitel 16.4).",
  "Lesen Sie **geplante Erweiterungen und offene Anforderungen** (22.2); sie sind nicht Teil des aktuellen Prozesses.",
  "Bewerten Sie **Auswirkungen auf Schulung und Handbuch** (22.3) und planen Sie Aktualisierungen der Quick Guides.",
  "Verfolgen Sie **Releaseinformationen und Änderungsübersicht** (22.4) und gleichen Sie den Stand in der Fußzeile der Guides ab."],
 "~~Geplante Funktionen dürfen nicht geschult oder Kunden zugesagt werden~~, bevor sie als produktiver Funktionsstand bestätigt sind.",
 ["Jede Änderung hat eine Ticketreferenz (Kapitel 16.6).", "Releasebezogene bekannte Fehler stehen in Kapitel 23.2.", "Der Stand jedes Quick Guides steht in der Fußzeile."],
 ["Funktionsstand geprüft", "Offene Anforderungen bekannt", "Schulungsbedarf bewertet", "Release-Änderungen gelesen"],
 [("Woher weiß ich, ob eine Funktion produktiv ist?", "Aus dem bestätigten Funktionsstand (22.1) und den Testnachweisen (16.4)."),
  ("Wie oft werden die Quick Guides aktualisiert?", "Mit jedem Release, das Prozessschritte ändert (22.3 und 22.4)."),
  ("Wo melde ich eine neue Anforderung?", "Über das Klärungsregister und den Markt an HQ (22.2 und 16.7).")],
 ["__Releaseinformationen und Änderungsübersicht__ – Kapitel 22.4.", LINK_HB, LINK_FAQ, LINK_SUPPORT],
 shot1="Releaseübersicht", shot2="Änderungsübersicht"))

# ---------------------------------------------------------------- 23
G.append(guide(23, "FAQ_Troubleshooting_und_Support", "FAQ, Troubleshooting und Support",
 "Sie finden **häufige Fragen je Prozessphase**, **bekannte Fehler mit Markt- und Releasebezug**, unterscheiden **Bedienfrage, Datenabweichung und Störung**, stellen die **Informationen für einen Supportfall** zusammen, kennen **Support- und Eskalationswege** und **bestätigte Workarounds** (Kapitel 23.1 bis 23.6).",
 ["**Alle Rollen**: Selbsthilfe über FAQ und Workarounds", "**Dealer/MO**: Supportfall mit vollständigen Angaben", "**Support/Kundenmanagement**: Bearbeitung und Eskalation"],
 ["Referenznummer, Markt, Sparte und Rolle bekannt", "Bildschirmbild ohne personenbezogene Daten (Kapitel 16.1)", "Handbuchkapitel zum Prozessschritt geprüft"],
 cols(T("23.1 – 23.3 Einordnen", ["Häufig gestellte Fragen nach Prozessphase", "Bekannte Fehler mit Markt- und Releasebezug", "Bedienfrage, Datenabweichung und Störung"]),
      T("23.4 – 23.6 Melden und lösen", ["Informationen für einen Supportfall", "Support- und Eskalationswege", "Bestätigte Workarounds und Ergebnisprüfung"])),
 ["Suchen Sie zuerst in den **FAQ je Prozessphase** (23.1) und in den **bekannten Fehlern** Ihres Marktes und Releases (23.2).",
  ["Ordnen Sie Ihr Anliegen ein (23.3):", "**Bedienfrage**: Handbuch und Quick Guide", "**Datenabweichung**: führendes System und Fachbereich (Kapitel 16.2)", "**Störung**: Supportfall"],
  ["Stellen Sie die **Informationen für den Supportfall** zusammen (23.4):", "Referenznummer, FIN/VIN, Markt, Sparte, Rolle", "Zeitpunkt, Schritt, Fehlermeldung, Bildschirmbild"],
  "Nutzen Sie die **Support- und Eskalationswege** (23.5): Hilfestellung Servicevertrag Van über **sc-van@mercedes-benz.com**; weitere Wege je Markt.",
  "Wenden Sie nur **bestätigte Workarounds** an und prüfen Sie das **Ergebnis** (23.6)."],
 "~~Unbestätigte Workarounds können Verträge und Daten beschädigen.~~ Nutzen Sie ausschließlich die in Kapitel 23.6 dokumentierten Lösungen.",
 ["Bei fehlerhaften Informationen kommt das Kundenmanagement auf Sie zu; falsche Anträge werden abgelehnt.", "Ticketreferenzen helfen, Ihr Anliegen dem richtigen Kapitel zuzuordnen (Anhang E).", "Schulungsmaterial, Videos und FAQ finden Sie im RetailPortal."],
 ["FAQ und bekannte Fehler geprüft", "Anliegen eingeordnet", "Supportinformationen vollständig", "Workaround bestätigt, Ergebnis geprüft"],
 [("Wie lange kann nach Erstzulassung ein Servicevertrag abgeschlossen werden?", "Bis zu 12 Monate und/oder maximal 50.000 km, sofern das Fahrzeug noch keinen Service erhalten hat (Ausnahme Dienst- und Vorführfahrzeuge mit Vorbesitzer)."),
  ("Kann für Vorführwagen ein Service-Paket abgeschlossen werden?", "Vorführ- und Dienstwagen gelten als Gebrauchtfahrzeuge; dafür ist nur ein reines Wartungspaket möglich."),
  ("Kann eine andere Person als der Halter den Vertrag abschließen?", "Nein, Vertragsinhaber und Halter müssen identisch sein.")],
 ["**Hilfestellung Servicevertrag Van**: __sc-van@mercedes-benz.com__", LINK_RP, "__Ticket-zu-Kapitel-Zuordnung__ – Anhang E.", LINK_HB],
 shot1="FAQ-Übersicht", shot2="Supportfall anlegen"))


def build(path):
    json.dump(G, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return len(G)

if __name__ == "__main__":
    import sys
    print(build(sys.argv[1]), "Guides geschrieben")
