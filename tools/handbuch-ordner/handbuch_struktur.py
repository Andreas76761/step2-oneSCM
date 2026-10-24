#!/usr/bin/env python3
"""Arbeitsordner für das oneSCM-Handbuch aus einer Gliederung erzeugen und abgleichen.

Je Kapitel acht Arbeitsordner:
  01_Quellen (Raw_2023 … Raw_2027), 02_Entwurf, 03_Bilder, 04_Pruefung_Freigabe,
  05_Audit, 06_FAQ, 07_Ideenspeicher, 08_Steuerung (Dealer, MO, Markt, HQ, IT, Marktspezifisch, Spartenspezifisch)
und je Unterkapitel ein Ordner mit UNTERKAPITEL.md. Je Kapitel und Unterkapitel eine ANWEISUNG.md (Kapitelanweisung,
gilt mit Vorrang für die Agenten). Dazu CLAUDE.md, .claude/agents und .claude/settings.json.
Hauptordner zur Steuerung: 05_I_Output (Produkte), 06_II_Stil_und_Design, 07_III_Grammatik_Synonyme_Fehlerliste, 08_IV_Translation.
Bereiche außerhalb des Handbuchs: 09_Pipeline (Jira-Tickets in Bearbeitung, je Kapitel/Unterkapitel der Gesamtgliederung),
10_Backlog (noch nicht begonnen) und 11_Intern (Testing, Reporting, Systeme, Migration, Rollout, Other).
Steuerung der Agenten: 12_Goal (Ziel, Abgleich, Empfehlungen) und 00_Dokumentation/Agenten (Aufgaben, Entscheidungen, Triage).

Befehle:
  zip       <Gliederung.xlsx|.json> <Ziel.zip> [--stand 23102026]
            vollständiger Arbeitsordner als ZIP (Excel-Matrix der Gesamtgliederung oder JSON-Export einer App-Gliederung)
  abgleich  <Arbeitsordner> [--gliederung Datei.xlsx|.json] [--app http://localhost:3000 --projekt p_default (--token … | --benutzer u-admin)]
            legt nur Fehlendes an (Ordner, Hauptordner 05–08, Vorlagendateien, neue Agenten), löscht und überschreibt nichts
            (abweichende Vorlagen als <Datei>.neu daneben), und schreibt 00_Dokumentation/GLIEDERUNG_ABGLEICH.md. Gliederungen aus der App landen unter 03_Varianten/<Name>/.
            Mit --app werden auch die Kapitelanweisungen aus der App (Kapitelsteuerung) in ANWEISUNG.md der Kapitel unter 02_Kapitel übernommen –
            nur wenn die Datei fehlt oder noch leer ist; sonst als ANWEISUNG.md.neu. Ebenso die Einträge aus Pipeline, Backlog und
            Intern der App als Dateien in 09_Pipeline, 10_Backlog und 11_Intern (von Hand geänderte Dateien bleiben, App-Fassung als .neu),
            Übersetzungsspeicher und Glossar je Zielsprache des Projekts nach 08_IV_Translation/<Sprache> (SPEICHER.csv, GLOSSAR.csv),
            Aufgaben und Entscheidungen der Agenten nach 00_Dokumentation/Agenten, der Ziel-Abgleich nach 12_Goal/ABGLEICH.md und
            für neue Unterkapitel der Triage (Kennung „neu“) Ordner neu_<Titel> im passenden Kapitel unter 02_Kapitel.

Benötigt Python 3.9+, für Excel zusätzlich openpyxl. Der App-Abgleich nutzt nur die lokale App-Adresse.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import re
import sys
import urllib.request
import zipfile
from datetime import date, datetime
from pathlib import Path

HIER = Path(__file__).resolve().parent
VORLAGEN = HIER / 'vorlagen'
RAW_JAHRE = ['Raw_2023', 'Raw_2024', 'Raw_2025', 'Raw_2026', 'Raw_2027']
STEUERUNG = ['01_Dealer', '02_MO', '03_Markt', '04_HQ', '05_IT', '06_Marktspezifisch', '07_Spartenspezifisch']
# Rollen der App (Gliederungen) → Rollen der Steuerung; IT kennt die App nicht
APP_ROLLEN = {'dealer': 'Dealer', 'market': 'Markt', 'mo': 'MO', 'hq': 'HQ'}
APP_SPARTEN = {'car': 'Pkw', 'van': 'Van', 'truck': 'Truck', 'bus': 'Bus'}
MARKTUMFANG = {'blueprint': 'Blueprint (marktübergreifend)', 'markets': 'ausgewählte Märkte'}
STEUER_ROLLEN = ['Dealer', 'MO', 'Markt', 'HQ', 'IT']
# Ausgabesprachen: Hauptsprache Deutsch, dazu die Landessprachen (Ordner 04_Output/<Sprache>/<Kapitel>)
SPRACHEN = ['01_Deutsch_DE', '02_Englisch_EN', '03_Französisch_FR', '04_Italienisch_IT', '05_Spanisch_ES',
            '06_Tschechisch_CS', '07_Slowakisch_SK', '08_Koreanisch_KO', '09_Malaiisch_MS',
            # Schweizer Varianten (Entscheidung 24.10.2026, ADR-101): Kennung wie in der App (de-ch, fr-ch)
            '10_Deutsch_DE-CH', '11_Französisch_FR-CH']
OUTPUT = '04_Output'
# Hauptordner zur Steuerung (I–IV); Nummern 05–08, damit der Explorer sie nach 04_Output sortiert
AUSGABE = '05_I_Output'
STIL = '06_II_Stil_und_Design'
LEKTORAT = '07_III_Grammatik_Synonyme_Fehlerliste'
TRANSLATION = '08_IV_Translation'
# Produktarten in 05_I_Output: Ordner → (Produkt, Zweck, Zielgruppe/Rollen, Format, Qualitätskriterien)
PRODUKTE = {
    '01_Handbuch': ('Handbuch', 'vollständige Referenz und Anleitung zu oneSCM, gesetzt aus den freigegebenen Kapiteln',
                    'alle Rollen (Dealer, MO, Markt, HQ, IT) je nach Lesepfad', 'DOCX/PDF nach Word-Vorlage; je Kapitel oder gesamt',
                    ['alle enthaltenen Unterkapitel freigegeben', 'Inhaltsverzeichnis und Abbildungsverzeichnis vollständig', 'Querverweise geprüft']),
    '02_Releaseletter': ('Releaseletter', 'Anwender über Änderungen eines Release informieren',
                         'alle Rollen, je Änderung die betroffene Rolle, Sparte (Pkw/Van) und Markt', 'DOCX/PDF oder E-Mail-Text, 1–2 Seiten je Release',
                         ['je Änderung: Was – Für wen – Ab wann – Verweis aufs Handbuch', 'nur produktiv verfügbare Funktionen', 'Release-Nummer und Datum belegt']),
    '03_QuickGuide': ('QuickGuide', 'die wichtigsten Abläufe einer Rolle auf einen Blick',
                      'je QuickGuide eine Rolle (Dealer, MO, Markt, HQ)', 'PDF, 1–2 Seiten, je Rolle eine Datei',
                      ['nur Schritte und Screens', 'jeder Schritt im Handbuch belegt', 'Callout-Nummern = Schrittnummern']),
    '04_Schulungsmaterial': ('Schulungsmaterial', 'Schulungen und Selbstlernen zu oneSCM',
                             'Trainerinnen und Trainer, neue Anwendende je Rolle', 'PPTX nach PowerPoint-Vorlage, Übungen und Lösungen als DOCX',
                             ['Lernziel je Modul', 'Übungen mit Testdaten (keine Echtdaten)', 'Wissenscheck mit Lösungen (Anhang H)']),
    '05_Interne_Dokumente': ('Interne Dokumente', 'Unterlagen für Redaktion, HQ und IT (z. B. Redaktionsleitfaden, Klärungslisten)',
                             'Redaktion, HQ, IT', 'DOCX/Markdown',
                             ['Zielgruppe und Vertraulichkeit im Kopf', 'Abkürzungen im Glossar', 'nicht für Anwendende veröffentlichen']),
    '06_Videos': ('Videos', 'Abläufe in oneSCM als kurze Bildschirmvideos zeigen',
                  'Anwendende je Rolle', 'Drehbuch (DOCX), Sprechertext, Untertitel (SRT/VTT); MP4 2–5 Minuten',
                  ['Sprechertext synchron zu den Schritten', 'Untertitel vorhanden', 'nur anonymisierte Testdaten im Bild']),
    '07_Grafiken': ('Grafiken', 'Zusammenhänge und Abläufe als Schaubild oder Infografik',
                    'alle Rollen', 'SVG/PNG, Quelldatei mitliefern',
                    ['Beschriftung nach STIL_UND_DESIGN.md', 'Alternativtext', 'Farben nicht als einziger Informationsträger']),
    '08_Prozesse': ('Prozesse', 'Geschäftsprozesse rund um oneSCM aus Sicht der Rollen beschreiben',
                    'MO, Markt, HQ, IT; Dealer für ihre Schritte', 'Prozessbeschreibung (DOCX), Diagramm (BPMN/SVG)',
                    ['jede Rolle und jede Übergabe benannt', 'Abgleich mit Anhang C (Prozessdiagramme)', 'Status- und Rollenbegriffe wie im Handbuch']),
}
PRODUKT_ORDNER = ['01_Entwurf', '02_Screens', '03_Final']
STIL_ORDNER = ['01_Designvorschlaege', '02_Tonalitaet', '03_Vorlagen', '04_Bildsprache_Screenshots']
LEKTORAT_ORDNER = ['01_Grammatik', '02_Synonyme', '03_Fehlerliste']
TRANSLATION_ORDNER = ['01_Glossar', '02_Uebersetzungsspeicher', '03_Laenderreview']
# Bereiche außerhalb des Handbuchs (ADR-098): kommende Funktionen und Internes
PIPELINE = '09_Pipeline'
BACKLOG = '10_Backlog'
INTERN = '11_Intern'
# Steuerung der Agenten (ADR-100): Ziel-Abgleich GOAL und Aufgaben/Entscheidungen des Orchestrators
GOAL = '12_Goal'
AGENTEN_DOK = '00_Dokumentation/Agenten'
OHNE_ZUORDNUNG = '00_Ohne_Zuordnung'
INTERN_THEMEN = {
    '01_Testing': ('Testing', 'Testkonzepte, Testfälle, Testdaten (nur anonymisiert), Ergebnisse'),
    '02_Reporting': ('Reporting', 'Berichte, Kennzahlen, Auswertungen'),
    '03_Systeme': ('Systeme', 'Systemlandschaft, Schnittstellen, Umgebungen'),
    '04_Migration': ('Migration', 'Datenmigration, Altsysteme, Übernahmeregeln'),
    '05_Rollout': ('Rollout', 'Rollout-Planung je Markt und Sparte, Kommunikation, Schulungstermine'),
    '06_Other': ('Other', 'alles Interne, das in keinen der anderen Ordner passt'),
}
TICKET_KOPF = '| Ticket | Titel | Gliederung | Erstelldatum | Stream | Produktionsdatum | Status | Dokumentiert |\n|---|---|---|---|---|---|---|---|\n'
ARBEITSORDNER = ['01_Quellen', '02_Entwurf', '03_Bilder', '04_Pruefung_Freigabe', '05_Audit', '06_FAQ', '07_Ideenspeicher', '08_Steuerung']
# Anhänge und Vorspann haben in der Gesamtgliederung keinen Eintrag der Ebene 1
GRUPPEN = {
    'V': '00_Vorspann',
    'A': 'Anhang_A_Glossar_und_Abkürzungen',
    'B': 'Anhang_B_Alltagschecklisten',
    'C': 'Anhang_C_Prozessdiagramme',
    'D': 'Anhang_D_Rollen-_Status-_und_Scopematrizen',
    'E': 'Anhang_E_Ticket-zu-Kapitel-Zuordnung',
    'F': 'Anhang_F_Quellen_und_Klärungsregister',
    'G': 'Anhang_G_Bildverzeichnis_und_Nachweise',
    'H': 'Anhang_H_Wissenschecks_und_Lösungen',
    'I': 'Anhang_I_Praxisbeispiele_Rechenbeispiele_Testdaten',
}


def ordnername(titel: str, laenge: int = 60) -> str:
    """Windows-taugliche Ordnernamen: ohne verbotene Zeichen, Kommas und Klammerzusätze, Leerzeichen → _, gekürzt an Wortgrenze."""
    t = re.sub(r'\[[^\]]*\]', '', titel)
    t = re.sub(r'[\\/:*?"<>|,;]', '', t).replace('–', '-').strip()
    t = re.sub(r'\s+', ' ', t)
    if len(t) > laenge:
        t = t[:laenge].rsplit(' ', 1)[0]
    return t.replace(' ', '_').strip('._-')


# ---------------------------------------------------------------- Gliederung lesen → einheitliches Modell
# Modell: [{key, ordner, titel, meta, unter: [{nr, titel, meta, punkte: [{nr, titel, meta}]}], uebergaenge: [{nr, titel, text, meta}]}]
# meta: {pkw, van, kriterium, notiz}

LEER = {'pkw': '', 'van': '', 'kriterium': '', 'notiz': ''}


def lies_excel(pfad: Path):
    import openpyxl
    ws = openpyxl.load_workbook(pfad, read_only=True).worksheets[0]
    zeilen = list(ws.iter_rows(values_only=True))
    kopf = list(zeilen[0])
    s = {k: kopf.index(k) for k in ['Kapitel', 'Thema', 'Ebene', '1 Pkw', '2 Van', 'Abschlusskriterium', 'Text / Übergang', 'Notizen / Nachweisbedarf']}
    kapitel: dict[str, dict] = {}
    for z in zeilen[1:]:
        if z[s['Kapitel']] is None:
            continue
        nr, titel, ebene = str(z[s['Kapitel']]).strip(), str(z[s['Thema']]).strip(), int(z[s['Ebene']])
        meta = {'pkw': z[s['1 Pkw']] or '', 'van': z[s['2 Van']] or '', 'kriterium': z[s['Abschlusskriterium']] or '', 'notiz': z[s['Notizen / Nachweisbedarf']] or ''}
        k = nr[1:].split('-')[0] if nr.startswith('T') else nr.split('.')[0]  # Übergang T6-7 gehört zu Kapitel 6
        kap = kapitel.setdefault(k, {'key': k, 'ordner': None if k.isdigit() else GRUPPEN.get(k, f'Anhang_{k}'), 'titel': '', 'meta': dict(LEER), 'unter': [], 'uebergaenge': []})
        if ebene == 1:
            kap.update(ordner=f'{int(k):02d}_{ordnername(titel)}', titel=titel, meta=meta)
        elif ebene == 2:
            kap['unter'].append({'nr': nr, 'titel': titel, 'meta': meta, 'punkte': []})
        elif ebene == 3:
            kap['unter'][-1]['punkte'].append({'nr': nr, 'titel': titel, 'meta': meta})
        elif ebene == 0:
            kap['uebergaenge'].append({'nr': nr, 'titel': titel, 'text': z[s['Text / Übergang']] or '', 'meta': meta})
    rang = lambda k: (0, 0) if k == 'V' else (1, int(k)) if k.isdigit() else (2, ord(k[0]))
    return [kapitel[k] for k in sorted(kapitel, key=rang)]


def lies_app_json(daten: dict):
    """JSON-Export einer Gliederung aus der App (GET /outlines/{id}/export?format=json): zwei Ebenen, Nummern aus der Reihenfolge."""
    if daten.get('format') != 'onescm-outline':
        raise ValueError('Kein Gliederungsexport der App (format onescm-outline erwartet).')
    modell = []
    for i, c in enumerate(daten.get('nodes', []), 1):
        meta = {**LEER, 'notiz': c.get('description') or ''}
        unter = [{'nr': f'{i}.{j}', 'titel': s['title'], 'meta': {**LEER, 'notiz': s.get('description') or ''}, 'punkte': []}
                 for j, s in enumerate(c.get('children', []), 1)]
        modell.append({'key': str(i), 'ordner': f'{i:02d}_{ordnername(c["title"])}', 'titel': c['title'], 'meta': meta, 'unter': unter, 'uebergaenge': []})
    return modell


def lies_gliederung(pfad: Path):
    if pfad.suffix.lower() == '.json':
        return lies_app_json(json.loads(pfad.read_text(encoding='utf-8')))
    return lies_excel(pfad)


# ---------------------------------------------------------------- Soll-Struktur

def sparten(m) -> str:
    if not (m['pkw'] or m['van']):
        return 'offen'
    return m['pkw'] if m['pkw'] == m['van'] else f"Pkw: {m['pkw']} · Van: {m['van']}"


def uordner(u) -> str:
    return f"{u['nr']}_{ordnername(u['titel'])}"


def anweisung(titel: str, text: str = '', wichtig: list | None = None, nicht: list | None = None, gueltig_ab: str | None = None) -> str:
    """Kapitelanweisung (ADR-096) – gleiche Form wie der Export der App; leere Abschnitte mit [offen]."""
    z = [f'# Anweisung: {titel}', '',
         '> Gilt mit hohem Vorrang für alle Arbeiten an diesem Kapitel bzw. Unterkapitel. Vorrang haben nur die Grundregeln (Daten lokal, nichts erfinden, nichts löschen, Datenschutz).', '']
    if gueltig_ab:
        z += [f'**Gültig ab:** {gueltig_ab}', '']
    z += ['## Worauf es ankommt', '', text.strip() or '[offen]', '']
    z += ['## Wichtige Themen (müssen vorkommen)', ''] + ([f'- {t}' for t in wichtig] if wichtig else ['- [offen]']) + ['']
    z += ['## Nicht beschreiben', ''] + ([f'- {t}' for t in nicht] if nicht else ['- [offen]']) + ['']
    return '\n'.join(z)


def anweisung_leer(inhalt: str) -> bool:
    """Vorlage ohne eigene Angaben (alle drei Abschnitte [offen])"""
    return inhalt.count('[offen]') >= 3 and '## Worauf es ankommt\n\n[offen]' in inhalt


def kapitel_baum(modell, basis: str, unterkapitel_arbeitsordner: bool = False, rollen_rahmen: set | None = None):
    """Ordner und Vorlagendateien unterhalb von basis (z. B. 02_Kapitel oder 03_Varianten/Dealer_Van).
    rollen_rahmen: Rollen einer Variante – andere Rollen sind dort außerhalb des Rahmens (–)."""
    stufe = lambda r: '?' if not rollen_rahmen or r in rollen_rahmen or r == 'IT' else '– (Variante)'
    ordner: set[str] = set()
    dateien: dict[str, str] = {}

    def arbeitsordner(pfad: str, unterkapitel: list):
        for a in ARBEITSORDNER:
            ordner.add(f'{pfad}/{a}')
        for r in RAW_JAHRE:
            ordner.add(f'{pfad}/01_Quellen/{r}')
        for s in STEUERUNG:
            ordner.add(f'{pfad}/08_Steuerung/{s}')
        dateien[f'{pfad}/01_Quellen/QUELLEN.md'] = ('# Quellen\n\nOriginale nach Jahr des Dokumentstands in `Raw_2023` … `Raw_2027`.\n\n'
                                                   '| Datei | Raw-Jahr | SHA-256 | Fundstelle | Unterkapitel | Sicherheit | zugeordnet am |\n|---|---|---|---|---|---|---|\n')
        dateien[f'{pfad}/03_Bilder/BILDER.md'] = '# Bildverzeichnis\n\n| Nummer | Datei | Unterkapitel | Alternativtext | Bildunterschrift | Quelle | Anonymisierung | Status |\n|---|---|---|---|---|---|---|---|\n'
        dateien[f'{pfad}/05_Audit/AUDIT.md'] = ('# Audit\n\n| Datum | Prüfgegenstand | Quellen­abdeckung % | Aussagen belegt/gesamt | Pflichtkriterien bestanden/gesamt | Kritische Befunde | Ergebnis | Bericht |\n'
                                               '|---|---|---|---|---|---|---|---|\n')
        dateien[f'{pfad}/06_FAQ/FAQ.md'] = '# Häufige Fragen\n\n| Nr. | Frage | Antwort | Quelle | Rolle | Sparte/Markt | Status |\n|---|---|---|---|---|---|---|\n'
        dateien[f'{pfad}/07_Ideenspeicher/IDEEN.md'] = '# Ideenspeicher\n\n| Nr. | Datum | Idee | Herkunft | Betrifft | Art | Status | Entscheidung |\n|---|---|---|---|---|---|---|---|\n'
        zeilen = ['# Steuerung', '', 'Wer braucht welchen Inhalt? **V** = nutzt/bearbeitet · **L** = liest · **–** = nicht relevant · **?** = offen (Beleg fehlt).',
                  'Markt- und spartenspezifische Inhalte: Markt-Code bzw. Pkw/Van eintragen, Material in `06_Marktspezifisch` bzw. `07_Spartenspezifisch`.', '',
                  '| Unterkapitel | Dealer | MO | Markt | HQ | IT | Marktspezifisch | Spartenspezifisch | Beleg |', '|---|---|---|---|---|---|---|---|---|']
        rollen = ' | '.join(stufe(r) for r in STEUER_ROLLEN)
        zeilen += [f"| {u['nr']} {u['titel']} | {rollen} | – | {sparten(u['meta'])} | |" for u in unterkapitel] or [f'| (Kapitel) | {rollen} | – | – | |']
        dateien[f'{pfad}/08_Steuerung/STEUERUNG.md'] = '\n'.join(zeilen) + '\n'

    for kap in modell:
        kpfad = f"{basis}/{kap['ordner']}"
        arbeitsordner(kpfad, kap['unter'])
        z = [f"# {kap['ordner'].replace('_', ' ')}", '', f"**Sparten:** {sparten(kap['meta'])}", '']
        if kap['meta']['kriterium']:
            z += [f"**Abschlusskriterium:** {kap['meta']['kriterium']}", '']
        if kap['meta']['notiz']:
            z += [f"**Nachweisbedarf:** {kap['meta']['notiz']}", '']
        z += ['## Unterkapitel', ''] + [f"- {u['nr']} {u['titel']}" + (f" ({len(u['punkte'])} Punkte)" if u['punkte'] else '') for u in kap['unter']]
        if kap['uebergaenge']:
            z += ['', '## Übergangstexte', '']
            for t in kap['uebergaenge']:
                z += [f"### {t['nr']} {t['titel']}", '', t['text'] or '[offen]', '', f"*Abschlusskriterium:* {t['meta']['kriterium']}", '']
        z += ['', '## Arbeitsordner', '', '| Ordner | Inhalt | Agent |', '|---|---|---|',
              '| 01_Quellen | Raw_2023 … Raw_2027, QUELLEN.md | input-sortierer |',
              '| 02_Entwurf | Entwürfe je Unterkapitel | kapitel-redakteur |',
              '| 03_Bilder | Bilder, BILDER.md | bild-redakteur |',
              '| 04_Pruefung_Freigabe | Prüfberichte, Freigabebelege | pruefer, Mensch |',
              '| 05_Audit | Audit-Berichte, AUDIT.md | auditor |',
              '| 06_FAQ | Fragen mit belegter Antwort, FAQ.md | faq-redakteur |',
              '| 07_Ideenspeicher | Ideen, Verbesserungen, Zukünftiges, IDEEN.md | ideen-sammler |',
              '| 08_Steuerung | Rollen Dealer/MO/Markt/HQ/IT, Markt- und Spartenspezifisches, STEUERUNG.md | steuerung |', '', '## Notizen', '']
        dateien[f'{kpfad}/KAPITEL.md'] = '\n'.join(z)
        dateien[f'{kpfad}/ANWEISUNG.md'] = anweisung(kap['ordner'].replace('_', ' '))
        for u in kap['unter']:
            upfad = f'{kpfad}/{uordner(u)}'
            ordner.add(upfad)
            if unterkapitel_arbeitsordner:
                arbeitsordner(upfad, [u])
            uz = [f"# {u['nr']} {u['titel']}", '', f"**Sparten:** {sparten(u['meta'])}", '']
            if u['meta']['kriterium']:
                uz += [f"**Abschlusskriterium:** {u['meta']['kriterium']}", '']
            if u['meta']['notiz']:
                uz += [f"**Nachweisbedarf:** {u['meta']['notiz']}", '']
            uz += ['## Punkte (Ebene 3)', '']
            for p in u['punkte']:
                uz += [f"### {p['nr']} {p['titel']}", '', f"- Nachweisbedarf: {p['meta']['notiz'] or '–'}", f"- Abschlusskriterium: {p['meta']['kriterium'] or '–'}", '']
            if not u['punkte']:
                uz += ['(keine Punkte der Ebene 3 hinterlegt)', '']
            uz += ['## Notizen', '']
            dateien[f'{upfad}/UNTERKAPITEL.md'] = '\n'.join(uz)
            dateien[f'{upfad}/ANWEISUNG.md'] = anweisung(f"{u['nr']} {u['titel']}")
    return ordner, dateien


def output_ordner(modell, unterpfad: str = '') -> set:
    """04_Output/<Sprache>/[<unterpfad>/]<Kapitel> – Ausgabe je Sprache und Kapitel."""
    vor = f'/{unterpfad}' if unterpfad else ''
    return {f"{OUTPUT}/{sp}{vor}/{kap['ordner']}" for sp in SPRACHEN for kap in modell}


def fachbegriffe() -> dict:
    """Tabelle „Fachbegriffe je Sprache“ aus SPRACHEN.md: {Code: [(Deutsch, Übersetzung)]} – Startwerte der Glossare."""
    zeilen = [z for z in (VORLAGEN / 'SPRACHEN.md').read_text(encoding='utf-8').split('## Fachbegriffe je Sprache', 1)[-1].splitlines() if z.startswith('|')]
    if len(zeilen) < 2:
        return {}
    kopf = [c.strip() for c in zeilen[0].strip('|').split('|')]
    begriffe: dict[str, list] = {}
    for z in zeilen[2:]:
        zellen = [c.strip() for c in z.strip('|').split('|')]
        for code, wert in zip(kopf[1:], zellen[1:]):
            if wert:
                begriffe.setdefault(code, []).append((zellen[0], wert))
    return begriffe


def hauptordner():
    """Die vier Hauptordner zur Steuerung: I Output, II Stil und Design, III Grammatik/Synonyme/Fehlerliste, IV Translation.
    Unabhängig von der Gliederung – zip und abgleich legen sie immer an."""
    lies = lambda n: (VORLAGEN / n).read_text(encoding='utf-8')
    ordner: set[str] = set()
    dateien: dict[str, str] = {}
    # I Output: je Produktart Entwurf, Screens, Endfassung je Sprache (01_Deutsch_DE = Master)
    dateien[f'{AUSGABE}/README.md'] = lies('Ausgabe_README.md')
    for p, (name, zweck, zielgruppe, form, kriterien) in PRODUKTE.items():
        ordner.update(f'{AUSGABE}/{p}/{o}' for o in PRODUKT_ORDNER)
        ordner.update(f'{AUSGABE}/{p}/03_Final/{sp}' for sp in SPRACHEN)
        dateien[f'{AUSGABE}/{p}/PRODUKT.md'] = '\n'.join([
            f'# {name}', '', f'**Zweck:** {zweck}', '', f'**Zielgruppe/Rollen:** {zielgruppe}', '',
            '**Quellen:** ausschließlich freigegebene Kapitel aus `02_Kapitel` (bzw. `03_Varianten`) – je Datei Kapitel/Unterkapitel und Freigabestand '
            '(Datum, Version) in der Statustabelle angeben. Screens aus `03_Bilder` der Kapitel, aufbereitet nach `06_II_Stil_und_Design/STIL_UND_DESIGN.md`.', '',
            f'**Format:** {form}', '', '**Stil:** `06_II_Stil_und_Design/STIL_UND_DESIGN.md`, Ton laut `06_II_Stil_und_Design/02_Tonalitaet/TONALITAET.md`; '
            'Sprache laut `07_III_Grammatik_Synonyme_Fehlerliste/`.', '',
            '## Qualitätskriterien', '', *[f'- {k}' for k in kriterien],
            '- keine personenbezogenen Daten in Text und Screens', '- Lektorat ohne offene Fehler in `FEHLERLISTE.csv`',
            '- Anrede „Sie“, UI-Begriffe englisch in „…“ mit deutschem Handbuchbegriff', '',
            '## Ablage', '', '| Ordner | Inhalt |', '|---|---|',
            '| `01_Entwurf/` | Entwürfe `<Kurzname>_Entwurf_vN.<ext>` |', '| `02_Screens/` | Screenshots dieses Produkts |',
            '| `03_Final/01_Deutsch_DE/` | freigegebener deutscher Master |',
            '| `03_Final/<Sprache>/` | Übersetzungen über `08_IV_Translation`, erst nach dem Länderreview freigegeben |', '',
            '## Status', '', 'Status: Entwurf · Lektorat · freigegeben · übersetzt · veraltet (ein Quellkapitel hat sich geändert).', '',
            '| Datei | Version | Quellen (Kapitel, Freigabestand) | Status | Lektorat | Freigabe (Datum) | Sprachen | Anmerkung |',
            '|---|---|---|---|---|---|---|---|', ''])
    # II Stil und Design
    ordner.update(f'{STIL}/{o}' for o in STIL_ORDNER)
    dateien[f'{STIL}/STIL_UND_DESIGN.md'] = lies('STIL_UND_DESIGN.md')
    dateien[f'{STIL}/02_Tonalitaet/TONALITAET.md'] = lies('TONALITAET.md')
    # III Grammatik, Synonyme, Fehlerliste (CSV in UTF-8 mit BOM für Excel)
    ordner.update(f'{LEKTORAT}/{o}' for o in LEKTORAT_ORDNER)
    dateien[f'{LEKTORAT}/README.md'] = lies('Lektorat_README.md')
    dateien[f'{LEKTORAT}/01_Grammatik/GRAMMATIK.md'] = lies('GRAMMATIK.md')
    dateien[f'{LEKTORAT}/02_Synonyme/SYNONYME.csv'] = lies('SYNONYME.csv')
    dateien[f'{LEKTORAT}/03_Fehlerliste/FEHLERLISTE.csv'] = lies('FEHLERLISTE.csv')
    dateien[f'{LEKTORAT}/03_Fehlerliste/FEHLERLISTE.md'] = lies('FEHLERLISTE.md')
    # IV Translation: je Zielsprache (alle Sprachen außer der Hauptsprache Deutsch)
    dateien[f'{TRANSLATION}/TRANSLATION.md'] = lies('TRANSLATION.md')
    begriffe = fachbegriffe()
    for sp in SPRACHEN[1:]:
        code = sp.rsplit('_', 1)[-1]
        ordner.update(f'{TRANSLATION}/{sp}/{o}' for o in TRANSLATION_ORDNER)
        glossar = io.StringIO()
        w = csv.writer(glossar, delimiter=';', lineterminator='\n')
        w.writerow(['Deutsch', code, 'Kontext', 'Status', 'Quelle'])
        w.writerows([de, ziel, '', 'bestätigt', '04_Output/SPRACHEN.md'] for de, ziel in begriffe.get(code, []))
        dateien[f'{TRANSLATION}/{sp}/01_Glossar/GLOSSAR.csv'] = '﻿' + glossar.getvalue()
        dateien[f'{TRANSLATION}/{sp}/02_Uebersetzungsspeicher/SPEICHER.csv'] = f'﻿Nr;Deutsch;{code};Datei;Ausgangsversion;Datum;Status\n'
        land = ('alle Länder gemeinsam (Redaktion führt zusammen)' if code == 'EN'
                else 'das jeweilige Land laut `04_Output/SPRACHEN.md`')
        dateien[f'{TRANSLATION}/{sp}/03_Laenderreview/REVIEW.md'] = (
            f'# Länderreview {sp}\n\nReview durch {land}. Status: bereit · im Review · Korrektur · geprüft · veraltet.\n'
            'Ansprechperson je Land ist noch offen (O-09) – bis dahin nur das Reviewer-Land eintragen.\n\n'
            '| Datei/Kapitel | Sprache | Reviewer-Land | Status | Datum | Anmerkung |\n|---|---|---|---|---|---|\n')
    return ordner, dateien


def bereiche(kapitel: list):
    """Pipeline, Backlog und Intern. kapitel: [(Kapitelordner, [Unterkapitelordner])] der Gesamtgliederung –
    die Pipeline hat dieselben Kapitel- und Unterkapitelordner wie 02_Kapitel."""
    lies = lambda n: (VORLAGEN / n).read_text(encoding='utf-8')
    ordner = {f'{PIPELINE}/{OHNE_ZUORDNUNG}'}
    for k, unter in kapitel:
        ordner.add(f'{PIPELINE}/{k}')
        ordner.update(f'{PIPELINE}/{k}/{u}' for u in unter)
    dateien = {
        f'{PIPELINE}/README.md': lies('Pipeline_README.md'),
        f'{PIPELINE}/PIPELINE.md': '# Pipeline – Übersicht\n\nTickets in Bearbeitung, noch nicht produktiv. Nach Produktionsdatum sortiert.\n\n' + TICKET_KOPF,
        f'{BACKLOG}/README.md': lies('Backlog_README.md'),
        f'{BACKLOG}/BACKLOG.md': '# Backlog – Übersicht\n\nTickets, deren Bearbeitung noch nicht begonnen hat.\n\n' + TICKET_KOPF,
        f'{INTERN}/README.md': lies('Intern_README.md'),
        f'{GOAL}/README.md': lies('Goal_README.md'),
        f'{GOAL}/ZIEL.md': lies('ZIEL.md'),
        f'{GOAL}/ABGLEICH.md': '# Ziel-Abgleich (GOAL)\n\nNoch kein Abgleich. Agent goal starten oder `abgleich --app …`.\n\n| Kriterium | Ist | Soll | erfüllt | Empfehlung | Agent |\n|---|---|---|---|---|---|\n',
        f'{GOAL}/EMPFEHLUNGEN.md': '# Empfehlungen (GOAL)\n\n| Datum | Kriterium | Empfehlung | Agent | als Aufgabe übernommen |\n|---|---|---|---|---|\n',
        f'{AGENTEN_DOK}/README.md': lies('Agenten_README.md'),
        f'{AGENTEN_DOK}/AUFGABEN.md': '# Aufgaben der Agenten\n\n> Plant und verfeinert der orchestrator; Herkunft: Orchestrator, GOAL oder von Hand.\n\n| Agent | Aufgabe | Priorität | Status | Herkunft | geändert |\n|---|---|---|---|---|---|\n',
        f'{AGENTEN_DOK}/ENTSCHEIDUNGEN.md': '# Entscheidungen der Agenten\n\n> Entscheidungen trifft ein Mensch. Der orchestrator trägt Fragen ein und setzt Antworten um.\n\n| Agent | Frage | Möglichkeiten | Status | Entscheidung | von, am |\n|---|---|---|---|---|---|\n',
        f'{AGENTEN_DOK}/TRIAGE.md': '# Triage – Bericht\n\n| Datum | Abschnitte | Labels | Vorschläge | neue Unterkapitel | zu prüfen |\n|---|---|---|---|---|---|\n',
    }
    for o, (name, inhalt) in INTERN_THEMEN.items():
        ordner.add(f'{INTERN}/{o}')
        dateien[f'{INTERN}/{o}/THEMA.md'] = (f'# Intern: {name}\n\n**Inhalt:** {inhalt}\n\n> Intern – nicht für das Handbuch, keine Veröffentlichung.\n\n'
                                            '| Datei | Inhalt | Stand | Herkunft |\n|---|---|---|---|\n')
    return ordner, dateien


def kapitel_aus_modell(modell) -> list:
    return [(kap['ordner'], [uordner(u) for u in kap['unter']]) for kap in modell]


def kapitel_aus_ordner(ziel: Path) -> list:
    """Kapitel- und Unterkapitelordner, wie sie in 02_Kapitel liegen (ohne Arbeitsordner)"""
    basis = ziel / '02_Kapitel'
    if not basis.exists():
        return []
    return [(k.name, sorted(u.name for u in k.iterdir() if u.is_dir() and u.name not in ARBEITSORDNER))
            for k in sorted(x for x in basis.iterdir() if x.is_dir())]


def gliederung_dateien(modell, basis: str, name: str):
    """CSV, Markdown und Status-Übersicht einer Gliederung."""
    puffer = io.StringIO()
    w = csv.writer(puffer, delimiter=';')
    w.writerow(['Kapitel', 'Thema', 'Ebene', 'Ordner', 'Pkw', 'Van', 'Abschlusskriterium', 'Notiz'])
    md = [f'# Gliederung: {name}', '']
    status = [f'# Status je Unterkapitel ({name})', '', '| Nr. | Unterkapitel | Quellen | Entwurf | Bilder | Prüfung | Audit | FAQ | Steuerung | Freigabe |', '|---|---|---|---|---|---|---|---|---|---|']
    for kap in modell:
        kp = f"{basis}/{kap['ordner']}"
        m = kap['meta']
        w.writerow([kap['key'], kap['titel'] or kap['ordner'], 1, kp, m['pkw'], m['van'], m['kriterium'], m['notiz']])
        md.append(f"## {kap['ordner']}" + (f" – {kap['titel']}" if kap['titel'] else ''))
        for u in kap['unter']:
            up = f'{kp}/{uordner(u)}'
            w.writerow([u['nr'], u['titel'], 2, up, u['meta']['pkw'], u['meta']['van'], u['meta']['kriterium'], u['meta']['notiz']])
            md.append(f"- **{u['nr']} {u['titel']}**")
            status.append(f"| {u['nr']} | {u['titel']} | – | – | – | – | – | – | – | – |")
            for p in u['punkte']:
                w.writerow([p['nr'], p['titel'], 3, up, p['meta']['pkw'], p['meta']['van'], p['meta']['kriterium'], p['meta']['notiz']])
                md.append(f"  - {p['nr']} {p['titel']}")
        for t in kap['uebergaenge']:
            w.writerow([t['nr'], t['titel'], 0, kp, '', '', t['meta']['kriterium'], t['meta']['notiz']])
            md.append(f"- Übergang **{t['nr']}** {t['titel']}")
        md.append('')
    legende = '\n\nLegende: – offen · ✎ in Arbeit · ✓ erledigt · ⚠ blockiert\n'
    return '﻿' + puffer.getvalue(), '\n'.join(md), '\n'.join(status) + legende


def vorlagen_dateien(stand: str, gliederung_name: str):
    """Wurzel- und Dokumentationsdateien sowie die Agenten aus vorlagen/."""
    ersetze = lambda t: t.replace('{{STAND}}', stand).replace('{{GLIEDERUNG}}', gliederung_name)
    lies = lambda n: ersetze((VORLAGEN / n).read_text(encoding='utf-8'))
    d = {
        'CLAUDE.md': lies('CLAUDE.md'),
        '.claude/settings.json': lies('settings.json'),
        '00_Dokumentation/README.md': lies('Dokumentation_README.md'),
        '00_Dokumentation/ENTSCHEIDUNGEN.md': lies('ENTSCHEIDUNGEN.md'),
        '00_Dokumentation/BEGRIFFE.md': lies('BEGRIFFE.md'),
        '00_Dokumentation/INPUT_PROTOKOLL.md': '# Input-Protokoll\n\n| Datum | Datei | SHA-256 | Raw-Jahr | Ergebnis | Kapitel/Unterkapitel | Begründung |\n|---|---|---|---|---|---|---|\n\n## Zu entscheiden\n\n',
        '00_Dokumentation/AUDIT_GESAMT.md': '# Audit – Gesamtübersicht\n\n| Kapitel | letztes Audit | Quellenabdeckung % | Belegquote % | Kritische Befunde | Ergebnis |\n|---|---|---|---|---|---|\n',
        '00_Dokumentation/FAQ_GESAMT.md': '# Häufige Fragen – Gesamtliste\n\n| Nr. | Frage | Kapitel | Rolle | Status |\n|---|---|---|---|---|\n',
        '00_Dokumentation/IDEEN_GESAMT.md': '# Ideenspeicher – Gesamtliste\n\n| Nr. | Idee | Kapitel | Art | Status | Entscheidung |\n|---|---|---|---|---|---|\n',
        '00_Dokumentation/STEUERUNG_GESAMT.md': lies('STEUERUNG_GESAMT.md'),
        '01_Input/README.md': lies('Input_README.md'),
        '00_Dokumentation/App/APP.md': lies('APP.md'),
        '00_Dokumentation/App/TESTFRAGEN.csv': '\ufeff' + lies('TESTFRAGEN.csv'),  # BOM: Excel erkennt UTF-8
    }
    stand_agenten = {}
    for a in sorted((VORLAGEN / 'agents').glob('*.md')):
        inhalt = a.read_text(encoding='utf-8')
        d[f'.claude/agents/{a.name}'] = inhalt
        stand_agenten[a.name] = hashlib.sha256(inhalt.encode()).hexdigest()
    # gelieferter Stand: der Abgleich ersetzt später nur Agenten, die seitdem niemand geändert hat
    d['.claude/agents/.vorlagen.json'] = json.dumps(stand_agenten, indent=2)
    # Werkzeug selbst mitliefern, damit der Abgleich lokal läuft
    d['00_Dokumentation/Werkzeuge/handbuch_struktur.py'] = (HIER / 'handbuch_struktur.py').read_text(encoding='utf-8')
    for v in sorted(VORLAGEN.rglob('*')):
        if v.is_file():
            d[f'00_Dokumentation/Werkzeuge/vorlagen/{v.relative_to(VORLAGEN).as_posix()}'] = v.read_text(encoding='utf-8')
    return d


def gesamt(modell, stand: str, gliederung_name: str, gliederung_daten: bytes, unterkapitel_arbeitsordner: bool):
    ordner, dateien = kapitel_baum(modell, '02_Kapitel', unterkapitel_arbeitsordner)
    ordner |= {'01_Input/01_Eingang', '01_Input/02_Zugeordnet', '01_Input/03_Ausgeschlossen', '03_Varianten', '00_Dokumentation/Gliederung/App',
               '00_Dokumentation/App/Exporte', '00_Dokumentation/App/Befragungen'}
    ordner |= output_ordner(modell)
    h_o, h_d = hauptordner()
    ordner |= h_o
    dateien.update(h_d)
    b_o, b_d = bereiche(kapitel_aus_modell(modell))
    ordner |= b_o
    dateien.update(b_d)
    dateien[f'{OUTPUT}/README.md'] = (VORLAGEN / 'Output_README.md').read_text(encoding='utf-8')
    dateien[f'{OUTPUT}/SPRACHEN.md'] = (VORLAGEN / 'SPRACHEN.md').read_text(encoding='utf-8')
    dateien.update(vorlagen_dateien(stand, gliederung_name))
    csv_t, md_t, status_t = gliederung_dateien(modell, '02_Kapitel', gliederung_name)
    dateien['00_Dokumentation/Gliederung/Gliederung.csv'] = csv_t
    dateien['00_Dokumentation/Gliederung/Gliederung.md'] = md_t
    dateien['00_Dokumentation/STATUS.md'] = status_t
    dateien['03_Varianten/README.md'] = ('# Varianten aus der App\n\nJede Gliederung, die in der App unter Stammdaten › Inhaltsverzeichnis angelegt wird, '
                                         'erhält hier einen eigenen Ordner mit derselben Kapitelstruktur. Anlegen mit:\n\n'
                                         '`python 00_Dokumentation/Werkzeuge/handbuch_struktur.py abgleich . --app http://localhost:3000`\n')
    bin_dateien = {f'00_Dokumentation/Gliederung/{gliederung_name}': gliederung_daten}
    return ordner, dateien, bin_dateien


# ---------------------------------------------------------------- ZIP

def schreibe_zip(ziel: Path, wurzel: str, ordner, dateien, bin_dateien):
    alle = set(ordner)
    for p in list(dateien) + list(bin_dateien):
        teile = p.split('/')[:-1]
        alle.update('/'.join(teile[:i]) for i in range(1, len(teile) + 1))
    with zipfile.ZipFile(ziel, 'w', zipfile.ZIP_DEFLATED) as z:
        for o in sorted(alle):
            z.writestr(f'{wurzel}/{o}/', '')
        for p, t in sorted(dateien.items()):
            z.writestr(f'{wurzel}/{p}', t.encode('utf-8'))
        for p, b in sorted(bin_dateien.items()):
            z.writestr(f'{wurzel}/{p}', b)
    return alle


# ---------------------------------------------------------------- Abgleich mit einem bestehenden Ordner

def app_gliederungen(adresse: str, projekt: str, token: str | None, benutzer: str | None):
    """Neueste Version jeder Gliederung der App mit JSON-Export."""
    kopf = {'X-Project-Id': projekt, 'Accept': 'application/json'}
    if token:
        kopf['Authorization'] = f'Bearer {token}'
    elif benutzer:
        kopf['X-User-Id'] = benutzer

    def hole(pfad):
        with urllib.request.urlopen(urllib.request.Request(adresse.rstrip('/') + '/api/v1' + pfad, headers=kopf), timeout=30) as r:
            return json.loads(r.read().decode('utf-8'))
    try:
        liste = hole('/outlines')
    except OSError as e:
        sys.exit(f'App unter {adresse} nicht erreichbar oder Anmeldung abgelehnt ({e}). Läuft die App? Stimmen --projekt und --token/--benutzer?')
    for o in (x for x in liste['items'] if x.get('latest')):
        yield o, hole(f"/outlines/{o['id']}/export?format=json")


def app_anweisungen(adresse: str, projekt: str, token: str | None, benutzer: str | None):
    """Kapitelanweisungen der App (GET /structure/instructions/export); None bei älterer App ohne Kapitelsteuerung."""
    kopf = {'X-Project-Id': projekt, 'Accept': 'application/json'}
    if token:
        kopf['Authorization'] = f'Bearer {token}'
    elif benutzer:
        kopf['X-User-Id'] = benutzer
    try:
        with urllib.request.urlopen(urllib.request.Request(adresse.rstrip('/') + '/api/v1/structure/instructions/export', headers=kopf), timeout=30) as r:
            daten = json.loads(r.read().decode('utf-8'))
    except OSError:
        return None
    return daten if daten.get('format') == 'onescm-instructions' else None


def nummer(titel: str) -> str | None:
    """Kapitel- bzw. Unterkapitelnummer am Anfang („7. …“ → 7, „07_…“ → 7, „7.1 …“ → 7.1)"""
    m = re.match(r'^\s*0*(\d+(?:\.\d+)*)[._\s]', titel + ' ')
    return '.'.join(str(int(x)) for x in m.group(1).split('.')) if m else None


def anweisungen_abgleichen(ziel: Path, daten: dict, bericht: list, zuordnung: dict | None = None):
    """Anweisungen der App in 02_Kapitel/<Kapitel>/ANWEISUNG.md und <Unterkapitel>/ANWEISUNG.md – Zuordnung über die Nummer;
    Anweisungen der Handbuch-Varianten in 03_Varianten/<Name>/<Kapitel>/ANWEISUNG.md (Ordner laut zuordnung.json).
    Fehlt die Datei oder ist sie noch leer, wird sie geschrieben; eigene Angaben bleiben, die App-Fassung kommt als .neu daneben."""
    ziele = [('02_Kapitel', daten.get('chapters', []))]
    for v in daten.get('variants', []):
        name = (zuordnung or {}).get(v.get('familyId'))
        if name:
            ziele.append((f'03_Varianten/{name}', v.get('chapters', [])))
    gesamt = [0, 0]
    for rel, kapitel in ziele:
        n, a = _anweisungen_in(ziel, ziel / rel, kapitel, bericht)
        gesamt[0] += n
        gesamt[1] += a
    bericht.append(f'- {gesamt[0]} Kapitelanweisungen aus der App übernommen' + (f', {gesamt[1]} abweichend (.neu)' if gesamt[1] else ''))


def _anweisungen_in(ziel: Path, basis: Path, kapitel: list, bericht: list):
    if not basis.exists():
        return 0, 0
    kap_ordner = {nummer(k.name): k for k in basis.iterdir() if k.is_dir() and nummer(k.name)}
    neu = abweichend = 0

    def schreibe(pfad: Path, inhalt: str):
        nonlocal neu, abweichend
        if not pfad.exists() or anweisung_leer(pfad.read_text(encoding='utf-8')):
            if not pfad.exists() or pfad.read_text(encoding='utf-8') != inhalt:
                pfad.write_text(inhalt, encoding='utf-8')
                neu += 1
        elif pfad.read_text(encoding='utf-8') != inhalt:
            n = pfad.with_name('ANWEISUNG.md.neu')
            if not n.exists() or n.read_text(encoding='utf-8') != inhalt:
                n.write_text(inhalt, encoding='utf-8')
                abweichend += 1
                bericht.append(f'- `{pfad.relative_to(ziel)}` hat eigene Angaben und weicht von der App ab – App-Fassung als `ANWEISUNG.md.neu`, bitte zusammenführen')

    leer = lambda i: not ((i.get('text') or '').strip() or i.get('topics') or i.get('excluded'))
    for c in kapitel:
        k = kap_ordner.get(nummer(c['title']) or '')
        if not k:
            continue
        if not leer(c['instruction']):
            schreibe(k / 'ANWEISUNG.md', c['markdown'])
        unter = {nummer(u.name): u for u in k.iterdir() if u.is_dir() and nummer(u.name) and '.' in (nummer(u.name) or '')}
        for s in c.get('subchapters', []):
            u = unter.get(nummer(s['title']) or '')
            if u and not leer(s['instruction']):
                schreibe(u / 'ANWEISUNG.md', s['markdown'])
    return neu, abweichend


def app_bereiche(adresse: str, projekt: str, token: str | None, benutzer: str | None):
    """Pipeline, Backlog und Intern der App (GET /work-areas/export); None bei älterer App"""
    kopf = {'X-Project-Id': projekt, 'Accept': 'application/json'}
    if token:
        kopf['Authorization'] = f'Bearer {token}'
    elif benutzer:
        kopf['X-User-Id'] = benutzer
    try:
        with urllib.request.urlopen(urllib.request.Request(adresse.rstrip('/') + '/api/v1/work-areas/export', headers=kopf), timeout=30) as r:
            daten = json.loads(r.read().decode('utf-8'))
    except OSError:
        return None
    return daten if daten.get('format') == 'onescm-work-areas' else None


def _datum(iso: str | None) -> str:
    return f'{iso[8:10]}.{iso[5:7]}.{iso[:4]}' if iso and re.match(r'^\d{4}-\d{2}-\d{2}$', iso) else (iso or '–')


def _passend(basis: Path, titel: str | None, mit_punkt: bool):
    """Ordner unter basis zum Titel: zuerst über die Nummer, sonst über den Ordnernamen"""
    if not titel or not basis.exists():
        return None
    kandidaten = [x for x in basis.iterdir() if x.is_dir() and x.name not in ARBEITSORDNER]
    n = nummer(titel)
    if n:
        for x in kandidaten:
            if nummer(x.name) == n and (('.' in n) == mit_punkt):
                return x
    name = ordnername(re.sub(r'^\s*\d+(?:\.\d+)*\.?\s*', '', titel))
    return next((x for x in kandidaten if name and x.name.endswith(name)), None)


def _schreiben_geschuetzt(ziel: Path, dateien_stand: dict, vorlage: dict, zahl: dict, bericht: list):
    """Schreiber für App-Lieferungen: neue Datei anlegen; unveränderte (Hash wie letzte Lieferung bzw. Vorlage) aktualisieren;
    von Hand geänderte bleiben, die App-Fassung kommt als .neu daneben"""
    def schreibe(rel: str, inhalt: str):
        p = ziel / rel
        h = hashlib.sha256(inhalt.encode()).hexdigest()
        if not p.exists():
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(inhalt, encoding='utf-8')
            zahl['neu'] += 1
        else:
            jetzt = hashlib.sha256(p.read_bytes()).hexdigest()
            if jetzt == h:
                pass
            elif dateien_stand.get(rel, vorlage.get(rel)) == jetzt:
                p.write_text(inhalt, encoding='utf-8')
                zahl['aktualisiert'] += 1
            else:
                n = p.with_name(p.name + '.neu')
                if not n.exists() or n.read_text(encoding='utf-8') != inhalt:
                    n.write_text(inhalt, encoding='utf-8')
                    zahl['abweichend'] += 1
                    bericht.append(f'- `{rel}` wurde von Hand geändert – App-Fassung als `{rel}.neu`, bitte zusammenführen')
                return
        dateien_stand[rel] = h
    return schreibe


def bereiche_abgleichen(ziel: Path, daten: dict, bericht: list):
    """Einträge der App als Dateien: Pipeline je Kapitel/Unterkapitel, Backlog, Intern je Thema. Eine Datei, die seit der
    letzten Lieferung niemand geändert hat, wird aktualisiert; eine geänderte bleibt, die App-Fassung kommt als .neu daneben.
    Wechselt ein Eintrag den Ort (z. B. Backlog → Pipeline), bleibt die alte Datei liegen und wird gemeldet."""
    stand_datei = ziel / '00_Dokumentation' / 'App' / 'bereiche_stand.json'
    try:
        stand = json.loads(stand_datei.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        stand = {}
    dateien_stand, orte = stand.get('dateien', {}), stand.get('orte', {})
    zahl = {'neu': 0, 'aktualisiert': 0, 'abweichend': 0}
    # leere Übersichten aus der Vorlage gelten als unverändert
    vorlage = {rel: hashlib.sha256(t.encode()).hexdigest() for rel, t in bereiche([])[1].items()}
    schreibe = _schreiben_geschuetzt(ziel, dateien_stand, vorlage, zahl, bericht)

    dateiname = lambda e: f"{e['jiraKey']}.md" if e.get('jiraKey') else f"{ordnername(e['title'], 40) or e['id']}.md"
    zeilen = {PIPELINE: [], BACKLOG: []}
    for e in daten.get('pipeline', []):
        kap = _passend(ziel / PIPELINE, e.get('chapterTitle'), False)
        unter = _passend(kap, e.get('subchapterTitle'), True) if kap else None
        ordner = unter or kap or (ziel / PIPELINE / OHNE_ZUORDNUNG)
        rel = (ordner / dateiname(e)).relative_to(ziel).as_posix()
        if e.get('chapterTitle') and not kap:
            bericht.append(f"- ⚠ `{e.get('jiraKey') or e['title']}`: Kapitel „{e['chapterTitle']}“ hat keinen Ordner in `{PIPELINE}` – abgelegt unter `{OHNE_ZUORDNUNG}`")
        zeilen[PIPELINE].append((e, rel))
    for e in daten.get('backlog', []):
        zeilen[BACKLOG].append((e, f'{BACKLOG}/{dateiname(e)}'))
    intern = [(e, f"{INTERN}/{e.get('topicFolder') or '06_Other'}/{dateiname(e)}") for e in daten.get('intern', [])]
    for e, rel in zeilen[PIPELINE] + zeilen[BACKLOG] + intern:
        alt = orte.get(e['id'])
        if alt and alt != rel and (ziel / alt).exists():
            bericht.append(f"- `{e.get('jiraKey') or e['title']}` liegt jetzt unter `{rel}` – die alte Datei `{alt}` bleibt (bitte als verschoben markieren, nicht löschen)")
        schreibe(rel, e['markdown'])
        orte[e['id']] = rel
    for bereich, titel, text in [(PIPELINE, 'Pipeline', 'Tickets in Bearbeitung, noch nicht produktiv. Nach Produktionsdatum sortiert.'),
                                 (BACKLOG, 'Backlog', 'Tickets, deren Bearbeitung noch nicht begonnen hat.')]:
        z = [f'# {titel} – Übersicht', '', f'{text} Stand aus der App: {_datum((daten.get("exportedAt") or "")[:10])}.', '', TICKET_KOPF.rstrip('\n')]
        for e, rel in zeilen[bereich]:
            gl = ' › '.join(x for x in [e.get('chapterTitle'), e.get('subchapterTitle')] if x) or '[offen]'
            z.append(f"| [{e.get('jiraKey') or '–'}]({Path(rel).relative_to(bereich).as_posix()}) | {e['title']} | {gl} | {_datum(e.get('createdOn'))} | "
                     f"{e.get('stream') or '[offen]'} | {_datum(e.get('productionDate')) if e.get('productionDate') else '[offen]'} | {e.get('jiraStatus') or '–'} | "
                     f"{'ja' if e.get('state') in ('documented', 'ready', 'live') else 'nein'}{' – produktiv, übernehmen?' if e.get('state') == 'ready' else ''} |")
        schreibe(f'{bereich}/{bereich[3:].upper()}.md', '\n'.join(z) + '\n')
    stand_datei.parent.mkdir(parents=True, exist_ok=True)
    stand_datei.write_text(json.dumps({'dateien': dateien_stand, 'orte': orte}, ensure_ascii=False, indent=2), encoding='utf-8')
    bericht.append(f"- Pipeline {len(zeilen[PIPELINE])}, Backlog {len(zeilen[BACKLOG])}, Intern {len(intern)} Einträge: "
                   f"{zahl['neu']} Dateien neu, {zahl['aktualisiert']} aktualisiert, {zahl['abweichend']} abweichend (.neu)")


def app_hole(adresse: str, projekt: str, token: str | None, benutzer: str | None, pfad: str):
    """GET auf die lokale App; None bei Fehler oder älterer App"""
    kopf = {'X-Project-Id': projekt, 'Accept': 'application/json'}
    if token:
        kopf['Authorization'] = f'Bearer {token}'
    elif benutzer:
        kopf['X-User-Id'] = benutzer
    try:
        with urllib.request.urlopen(urllib.request.Request(adresse.rstrip('/') + '/api/v1' + pfad, headers=kopf), timeout=30) as r:
            return json.loads(r.read().decode('utf-8'))
    except (OSError, ValueError):
        return None


def app_hole_datei(adresse: str, projekt: str, token: str | None, benutzer: str | None, pfad: str):
    """GET auf die lokale App, Antwort als Text (CSV); None bei Fehler"""
    kopf = {'X-Project-Id': projekt}
    if token:
        kopf['Authorization'] = f'Bearer {token}'
    elif benutzer:
        kopf['X-User-Id'] = benutzer
    try:
        with urllib.request.urlopen(urllib.request.Request(adresse.rstrip('/') + '/api/v1' + pfad, headers=kopf), timeout=30) as r:
            return r.read().decode('utf-8')
    except OSError:
        return None


def uebersetzung_abgleichen(ziel: Path, adresse: str, projekt: str, token: str | None, benutzer: str | None, bericht: list):
    """Übersetzungsspeicher und Glossar der App je Zielsprache des Projekts (ADR-101) nach 08_IV_Translation/<Sprache>:
    unveränderte Dateien werden aktualisiert, von Hand geänderte bleiben (App-Fassung als .neu)."""
    sprachen = (app_hole(adresse, projekt, token, benutzer, '/languages') or {}).get('projectLanguages')
    if sprachen is None:
        bericht.append('- App liefert keine Sprachen (ältere Version oder keine Berechtigung)')
        return
    stand_datei = ziel / TRANSLATION / 'app_stand.json'
    try:
        stand = json.loads(stand_datei.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        stand = {}
    dateien_stand = stand.get('dateien', {})
    zahl = {'neu': 0, 'aktualisiert': 0, 'abweichend': 0}
    vorlage = {rel: hashlib.sha256(t.encode()).hexdigest() for rel, t in hauptordner()[1].items()}
    schreibe = _schreiben_geschuetzt(ziel, dateien_stand, vorlage, zahl, bericht)
    ohne_ordner = []
    for sp in SPRACHEN[1:]:
        code = sp.rsplit('_', 1)[-1].lower()
        if code not in sprachen:
            continue
        for rel, pfad in [(f'{TRANSLATION}/{sp}/02_Uebersetzungsspeicher/SPEICHER.csv', f'/translation-memory/export?language={code}&format=csv'),
                          (f'{TRANSLATION}/{sp}/01_Glossar/GLOSSAR.csv', f'/translation-glossary/export?language={code}&format=csv')]:
            inhalt = app_hole_datei(adresse, projekt, token, benutzer, pfad)
            if inhalt is not None:
                schreibe(rel, inhalt)
    for code in sprachen:
        if not any(sp.rsplit('_', 1)[-1].lower() == code for sp in SPRACHEN):
            ohne_ordner.append(code)
    if ohne_ordner:
        bericht.append(f"- ⚠ Zielsprachen ohne Ordner in `{TRANSLATION}`: {', '.join(ohne_ordner)} – bitte Ordner ergänzen")
    stand_datei.parent.mkdir(parents=True, exist_ok=True)
    stand_datei.write_text(json.dumps({'dateien': dateien_stand}, ensure_ascii=False, indent=2), encoding='utf-8')
    bericht.append(f"- Übersetzung ({', '.join(sprachen) or 'keine Zielsprachen'}): {zahl['neu']} Dateien neu, {zahl['aktualisiert']} aktualisiert, {zahl['abweichend']} abweichend (.neu)")


def agenten_abgleichen(ziel: Path, daten: dict, neue_unterkapitel: list, bericht: list):
    """Aufgaben, Entscheidungen und Ziel-Abgleich der App (GET /agents/export) als Dateien; neue Unterkapitel der Triage
    (GET /triage/new-subchapters) als Ordner neu_<Titel> im passenden Kapitel unter 02_Kapitel – Vorhandenes bleibt."""
    stand_datei = ziel / AGENTEN_DOK / 'agenten_stand.json'
    try:
        stand = json.loads(stand_datei.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        stand = {}
    dateien_stand = stand.get('dateien', {})
    zahl = {'neu': 0, 'aktualisiert': 0, 'abweichend': 0}
    vorlage = {rel: hashlib.sha256(t.encode()).hexdigest() for rel, t in bereiche([])[1].items()}
    schreibe = _schreiben_geschuetzt(ziel, dateien_stand, vorlage, zahl, bericht)
    f = daten.get('files', {})
    for rel, key in [(f'{AGENTEN_DOK}/AUFGABEN.md', 'tasks'), (f'{AGENTEN_DOK}/ENTSCHEIDUNGEN.md', 'decisions'), (f'{GOAL}/ABGLEICH.md', 'goal')]:
        if f.get(key):
            schreibe(rel, f[key])
    ordner_neu = 0
    for u in neue_unterkapitel:
        kap = _passend(ziel / '02_Kapitel', u.get('chapterTitle'), False)
        if not kap:
            bericht.append(f"- ⚠ neues Unterkapitel „{u.get('title')}“: Kapitel „{u.get('chapterTitle')}“ hat keinen Ordner in `02_Kapitel`")
            continue
        o = kap / f"neu_{ordnername(u.get('title') or '', 50)}"
        if not o.exists():
            o.mkdir(parents=True)
            (o / 'UNTERKAPITEL.md').write_text(
                f"# {u.get('title')}\n\n**Kennung: neu** – von TRIAGE angelegt ({(u.get('createdAt') or '')[:10]}), {u.get('chunks', 0)} Abschnitte. "
                'Ein Mensch bestätigt, benennt um oder löst ab (App: Kapitelsteuerung bzw. Triage). Nach der Bestätigung den Ordner '
                'ohne `neu_` in die Gliederung übernehmen (Gesamtgliederung ergänzen, dann `abgleich --gliederung …`).\n', encoding='utf-8')
            ordner_neu += 1
    stand_datei.parent.mkdir(parents=True, exist_ok=True)
    stand_datei.write_text(json.dumps({'dateien': dateien_stand}, ensure_ascii=False, indent=2), encoding='utf-8')
    bericht.append(f"- Agenten: {zahl['neu']} Dateien neu, {zahl['aktualisiert']} aktualisiert, {zahl['abweichend']} abweichend (.neu); "
                   f"{len(neue_unterkapitel)} neue Unterkapitel der Triage, {ordner_neu} Ordner `neu_…` angelegt")


def agenten_aktualisieren(ziel: Path, bericht: list):
    """Neue Agenten anlegen; vorhandene nur ersetzen, wenn sie seit der letzten Lieferung unverändert sind."""
    stand_datei = ziel / '.claude' / 'agents' / '.vorlagen.json'
    try:
        alt = json.loads(stand_datei.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        alt = {}
    neu_stand = {}
    for a in sorted((VORLAGEN / 'agents').glob('*.md')):
        inhalt = a.read_text(encoding='utf-8')
        h = hashlib.sha256(inhalt.encode()).hexdigest()
        neu_stand[a.name] = h
        pfad = ziel / '.claude' / 'agents' / a.name
        if not pfad.exists():
            pfad.parent.mkdir(parents=True, exist_ok=True)
            pfad.write_text(inhalt, encoding='utf-8')
            bericht.append(f'- Agent neu: `{a.name}`')
            continue
        jetzt = hashlib.sha256(pfad.read_bytes()).hexdigest()
        if jetzt == h or alt.get(a.name) == h:
            continue  # schon aktuell, oder Vorlage seit der letzten Lieferung unverändert (eigene Anpassungen bleiben)
        if alt.get(a.name) == jetzt:
            pfad.write_text(inhalt, encoding='utf-8')
            bericht.append(f'- Agent aktualisiert: `{a.name}`')
        else:
            # Endung .neu statt .md: Claude Code lädt die Datei nicht als zweiten Agenten
            (pfad.parent / f'{a.name}.neu').write_text(inhalt, encoding='utf-8')
            bericht.append(f'- Agent `{a.name}` wurde von Hand geändert und die Vorlage ist neu – neue Fassung als `{a.name}.neu` abgelegt, bitte zusammenführen')
    stand_datei.write_text(json.dumps(neu_stand, indent=2), encoding='utf-8')


def vorlagen_neu(ziel: Path, bericht: list):
    """Arbeitsweise-Dateien (CLAUDE.md, Arbeitsweise, Output-README) nie überschreiben: weicht die Vorlage ab, neue Fassung als <Datei>.neu daneben."""
    try:
        gliederung = re.search(r'00_Dokumentation/Gliederung/([^`]+)`', (ziel / 'CLAUDE.md').read_text(encoding='utf-8')).group(1)
    except (OSError, AttributeError):
        gliederung = '<Gliederung>'
    vorlagen = vorlagen_dateien(ziel.name, gliederung)
    vorlagen[f'{OUTPUT}/README.md'] = (VORLAGEN / 'Output_README.md').read_text(encoding='utf-8')
    for rel in ['CLAUDE.md', '00_Dokumentation/README.md', f'{OUTPUT}/README.md']:
        p, inhalt = ziel / rel, vorlagen[rel]
        if not p.exists():
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(inhalt, encoding='utf-8')
            bericht.append(f'- Vorlage neu: `{rel}`')
        elif p.read_text(encoding='utf-8') != inhalt:
            neu = p.with_name(p.name + '.neu')
            if not neu.exists() or neu.read_text(encoding='utf-8') != inhalt:
                neu.write_text(inhalt, encoding='utf-8')
                bericht.append(f'- `{rel}` weicht von der aktuellen Vorlage ab – neue Fassung als `{rel}.neu` abgelegt, bitte zusammenführen')


def abgleich(ziel: Path, soll_ordner, soll_dateien, basis_liste, bericht: list):
    """Fehlendes anlegen; Vorhandenes nie überschreiben; Ordner, die die Gliederung nicht mehr kennt, nur melden."""
    neu_o = neu_d = 0
    for o in sorted(soll_ordner):
        p = ziel / o
        if not p.exists():
            p.mkdir(parents=True, exist_ok=True)
            neu_o += 1
    for rel, inhalt in sorted(soll_dateien.items()):
        p = ziel / rel
        if not p.exists():
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(inhalt, encoding='utf-8')
            neu_d += 1
    bericht.append(f'- {neu_o} Ordner und {neu_d} Dateien neu angelegt')
    for basis in basis_liste:
        soll = {o.split('/')[len(basis.split('/'))] for o in soll_ordner if o.startswith(basis + '/')}
        soll_u = {o for o in soll_ordner if o.startswith(basis + '/') and o.count('/') == basis.count('/') + 2}
        b = ziel / basis
        if not b.exists():
            continue
        for k in sorted(x for x in b.iterdir() if x.is_dir()):
            if k.name not in soll:
                bericht.append(f'- ⚠ `{basis}/{k.name}` steht nicht mehr in der Gliederung (umbenannt oder entfallen) – nicht verändert')
                continue
            for u in sorted(x for x in k.iterdir() if x.is_dir() and x.name not in ARBEITSORDNER):
                if f'{basis}/{k.name}/{u.name}' not in soll_u:
                    bericht.append(f'- ⚠ `{basis}/{k.name}/{u.name}` steht nicht mehr in der Gliederung – nicht verändert')


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='befehl', required=True)
    z = sub.add_parser('zip', help='vollständigen Arbeitsordner als ZIP erzeugen')
    z.add_argument('gliederung', type=Path)
    z.add_argument('ziel', type=Path)
    z.add_argument('--stand', default=date.today().strftime('%d%m%Y'))
    z.add_argument('--unterkapitel-arbeitsordner', action='store_true', help='die acht Arbeitsordner auch in jedem Unterkapitel anlegen')
    g = sub.add_parser('abgleich', help='bestehenden Arbeitsordner ergänzen')
    g.add_argument('ordner', type=Path)
    g.add_argument('--gliederung', type=Path, help='Gesamtgliederung (Excel) oder App-Export (JSON) für 02_Kapitel')
    g.add_argument('--app', help='Adresse der lokalen App, z. B. http://localhost:3000 – alle Gliederungen nach 03_Varianten')
    g.add_argument('--projekt', default='p_default')
    g.add_argument('--token', help='API-Token der App (Integrationen › API-Tokens, Berechtigung read)')
    g.add_argument('--benutzer', help='Demo-Benutzer der App, z. B. u-admin (nur Demo-Modus)')
    g.add_argument('--unterkapitel-arbeitsordner', action='store_true')
    a = ap.parse_args()

    if a.befehl == 'zip':
        modell = lies_gliederung(a.gliederung)
        ordner, dateien, bin_d = gesamt(modell, a.stand, a.gliederung.name, a.gliederung.read_bytes(), a.unterkapitel_arbeitsordner)
        alle = schreibe_zip(a.ziel, a.stand, ordner, dateien, bin_d)
        laengster = max((f'{a.stand}/{p}' for p in dateien), key=len)
        print(f"{len(modell)} Kapitel, {sum(len(k['unter']) for k in modell)} Unterkapitel, {len(alle)} Ordner, {len(dateien) + len(bin_d)} Dateien → {a.ziel}")
        print(f'längster Pfad ({len(laengster)} Zeichen relativ): {laengster}')
        return

    ziel = a.ordner.resolve()
    if not (ziel / 'CLAUDE.md').exists():
        sys.exit(f'{ziel} ist kein Handbuch-Arbeitsordner (CLAUDE.md fehlt).')
    bericht = [f'# Gliederungsabgleich {datetime.now():%d.%m.%Y %H:%M}', '']
    agenten_aktualisieren(ziel, bericht)
    # Hauptordner I–IV hängen nicht von der Gliederung ab: bei jedem Abgleich ergänzen
    bericht += ['', f'## Hauptordner {AUSGABE}, {STIL}, {LEKTORAT}, {TRANSLATION}', '']
    h_o, h_d = hauptordner()
    abgleich(ziel, h_o, h_d, [], bericht)
    bericht += ['', '## Vorlagen (CLAUDE.md, Arbeitsweise, Output)', '']
    vorlagen_neu(ziel, bericht)
    # Arbeit mit der App (ab App-Version 0.41): Ordner und Vorlagen ergänzen, Vorhandenes bleibt
    bericht += ['', '## App (00_Dokumentation/App)', '']
    app_d = {k: v for k, v in vorlagen_dateien(ziel.name, '').items() if k.startswith('00_Dokumentation/App/')}
    abgleich(ziel, {'00_Dokumentation/App/Exporte', '00_Dokumentation/App/Befragungen'}, app_d, [], bericht)
    if a.gliederung:
        modell = lies_gliederung(a.gliederung)
        o, d = kapitel_baum(modell, '02_Kapitel', a.unterkapitel_arbeitsordner)
        bericht += ['', f'## Gesamtgliederung `{a.gliederung.name}` → 02_Kapitel', '']
        o |= output_ordner(modell)
        abgleich(ziel, o, d, ['02_Kapitel'], bericht)
    # Pipeline, Backlog, Intern: Kapitelordner der Pipeline folgen 02_Kapitel (auch nach einem Abgleich der Gesamtgliederung)
    bereiche_bericht = ['', f'## Bereiche {PIPELINE}, {BACKLOG}, {INTERN}', '']
    b_o, b_d = bereiche(kapitel_aus_ordner(ziel))
    abgleich(ziel, b_o, b_d, [], bereiche_bericht)
    bericht += bereiche_bericht
    if a.app:
        zuordnung_datei = ziel / '00_Dokumentation' / 'Gliederung' / 'App' / 'zuordnung.json'
        zuordnung_datei.parent.mkdir(parents=True, exist_ok=True)
        try:
            zuordnung = json.loads(zuordnung_datei.read_text(encoding='utf-8'))
        except (OSError, ValueError):
            zuordnung = {}
        for info, export in app_gliederungen(a.app, a.projekt, a.token, a.benutzer):
            # Ordner je Gliederungsfamilie: bleibt bei Umbenennung oder neuer Version in der App derselbe
            name = zuordnung.setdefault(info['familyId'], ordnername(info['name']) or info['familyId'])
            basis = f'03_Varianten/{name}'
            modell = lies_app_json(export)
            app_rollen = [APP_ROLLEN[r] for r in info.get('roles') or [] if r in APP_ROLLEN]
            o, d = kapitel_baum(modell, basis, a.unterkapitel_arbeitsordner, set(app_rollen) if app_rollen and 'all' not in (info.get('roles') or []) else None)
            csv_t, md_t, status_t = gliederung_dateien(modell, basis, info['name'])
            sparten_txt = ', '.join(APP_SPARTEN.get(x, x) for x in info.get('divisions') or [] if x not in ('all', 'unconfirmed')) or 'alle'
            maerkte = ', '.join(info.get('markets') or []) or MARKTUMFANG.get(info.get('marketScope'), info.get('marketScope') or 'alle')
            d[f'{basis}/VARIANTE.md'] = (f"# Variante: {info['name']}\n\n- Version in der App: {info['versionNo']}\n- Rollen: {', '.join(app_rollen) or 'alle'}\n"
                                         f"- Sparten: {sparten_txt}\n- Märkte: {maerkte}\n- Beschreibung: {info.get('description') or '–'}\n\n"
                                         'Die Variante ist der Rahmen für Steuerung und Entwürfe; die Datei wird beim Abgleich nicht überschrieben.\n')
            d[f'{basis}/STATUS.md'] = status_t
            (ziel / '00_Dokumentation' / 'Gliederung' / 'App' / f'{name}_v{info["versionNo"]}.json').write_text(json.dumps(export, ensure_ascii=False, indent=2), encoding='utf-8')
            (ziel / '00_Dokumentation' / 'Gliederung' / 'App' / f'{name}.md').write_text(md_t, encoding='utf-8')
            bericht += ['', f"## App-Gliederung „{info['name']}“ (v{info['versionNo']}) → {basis}", '']
            o |= output_ordner(modell, f'Varianten/{name}')
            abgleich(ziel, o, d, [basis], bericht)
        zuordnung_datei.write_text(json.dumps(zuordnung, ensure_ascii=False, indent=2), encoding='utf-8')
        # Kapitelanweisungen (App ab 0.43, Kapitelsteuerung) für die Gesamtgliederung unter 02_Kapitel
        anw = app_anweisungen(a.app, a.projekt, a.token, a.benutzer)
        bericht += ['', '## Kapitelanweisungen aus der App → 02_Kapitel und 03_Varianten', '']
        if anw is None:
            bericht.append('- App liefert keine Kapitelanweisungen (ältere Version oder keine Berechtigung)')
        else:
            anweisungen_abgleichen(ziel, anw, bericht, zuordnung)
        # Pipeline, Backlog, Intern (App ab 0.45)
        ber = app_bereiche(a.app, a.projekt, a.token, a.benutzer)
        bericht += ['', f'## Pipeline, Backlog, Intern aus der App → {PIPELINE}, {BACKLOG}, {INTERN}', '']
        if ber is None:
            bericht.append('- App liefert keine Arbeitsbereiche (ältere Version oder keine Berechtigung)')
        else:
            bereiche_abgleichen(ziel, ber, bericht)
        # Übersetzungsspeicher und Glossar je Zielsprache (App ab 0.48)
        bericht += ['', f'## Übersetzung aus der App → {TRANSLATION}', '']
        uebersetzung_abgleichen(ziel, a.app, a.projekt, a.token, a.benutzer, bericht)
        # Agenten: Aufgaben, Entscheidungen, Ziel-Abgleich, neue Unterkapitel der Triage (App ab 0.47)
        ag = app_hole(a.app, a.projekt, a.token, a.benutzer, '/agents/export')
        bericht += ['', f'## Agenten aus der App → {AGENTEN_DOK}, {GOAL}, 02_Kapitel (neu_…)', '']
        if not ag or ag.get('format') != 'onescm-agents':
            bericht.append('- App liefert keine Agenten (ältere Version oder keine Berechtigung)')
        else:
            neu = (app_hole(a.app, a.projekt, a.token, a.benutzer, '/triage/new-subchapters') or {}).get('items', [])
            agenten_abgleichen(ziel, ag, neu, bericht)
    if not (a.gliederung or a.app):
        bericht += ['', 'Nur Agenten, Hauptordner und Vorlagen abgeglichen (weder --gliederung noch --app angegeben).']
    (ziel / '00_Dokumentation' / 'GLIEDERUNG_ABGLEICH.md').write_text('\n'.join(bericht) + '\n', encoding='utf-8')
    print('\n'.join(bericht))


if __name__ == '__main__':
    main()
