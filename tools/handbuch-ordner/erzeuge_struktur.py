#!/usr/bin/env python3
"""Erzeugt den lokalen Arbeitsordner für das oneSCM-Handbuch aus der Gliederung (Excel) als ZIP.

Aufbau: 00_Dokumentation, 01_Input, 02_Kapitel/<Kapitel>/{01_Quellen,02_Entwurf,03_Bilder,04_Pruefung_Freigabe,<Unterkapitel>}
sowie .claude/agents (lokale Agenten), CLAUDE.md und .claude/settings.json (WebFetch/WebSearch gesperrt).

Aufruf: python3 erzeuge_struktur.py <Gliederung.xlsx> <Ziel.zip> [--stand 23102026] [--unterkapitel-arbeitsordner]
"""
import argparse
import csv
import io
import re
import zipfile
from datetime import date
from pathlib import Path

import openpyxl

VORLAGEN = Path(__file__).parent / 'vorlagen'
ARBEITSORDNER = ['01_Quellen', '02_Entwurf', '03_Bilder', '04_Pruefung_Freigabe']
# Anhänge und Vorspann haben in der Gliederung keinen Eintrag der Ebene 1
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


def lies_gliederung(pfad: Path):
    ws = openpyxl.load_workbook(pfad, read_only=True).worksheets[0]
    zeilen = list(ws.iter_rows(values_only=True))
    kopf = list(zeilen[0])
    spalte = lambda name: kopf.index(name)
    s = {k: spalte(k) for k in ['Kapitel', 'Thema', 'Ebene', '1 Pkw', '2 Van', 'Abschlusskriterium', 'Text / Übergang', 'Notizen / Nachweisbedarf']}
    eintraege = []
    for z in zeilen[1:]:
        if z[s['Kapitel']] is None:
            continue
        eintraege.append({
            'nr': str(z[s['Kapitel']]).strip(), 'titel': str(z[s['Thema']]).strip(), 'ebene': int(z[s['Ebene']]),
            'pkw': z[s['1 Pkw']] or '', 'van': z[s['2 Van']] or '', 'kriterium': z[s['Abschlusskriterium']] or '',
            'text': z[s['Text / Übergang']] or '', 'notiz': z[s['Notizen / Nachweisbedarf']] or '',
        })
    return eintraege


def sparten(e) -> str:
    return e['pkw'] if e['pkw'] == e['van'] else f"Pkw: {e['pkw']} · Van: {e['van']}"


def kapitel_von(nr: str) -> str:
    """'6.2.1' → '6', 'A.1.3' → 'A', 'T6-7' → '6' (Übergang gehört zum Ausgangskapitel)"""
    if nr.startswith('T'):
        return nr[1:].split('-')[0]
    return nr.split('.')[0]


def baue(eintraege, stand: str, unterkapitel_arbeitsordner: bool, gliederung_name: str, gliederung_daten: bytes):
    dateien: dict[str, bytes] = {}
    ordner: set[str] = set()

    def datei(pfad: str, inhalt: str | bytes):
        dateien[pfad] = inhalt.encode('utf-8') if isinstance(inhalt, str) else inhalt

    def vorlage(name: str) -> str:
        return (VORLAGEN / name).read_text(encoding='utf-8').replace('{{STAND}}', stand).replace('{{GLIEDERUNG}}', gliederung_name)

    # Kapitel bilden
    kapitel: dict[str, dict] = {}
    for e in eintraege:
        k = kapitel_von(e['nr'])
        if k not in kapitel:
            if k.isdigit():
                name = None  # aus Ebene 1
            else:
                name = GRUPPEN.get(k, f'Anhang_{k}')
            kapitel[k] = {'name': name, 'titel': '', 'unter': [], 'uebergaenge': []}
        kap = kapitel[k]
        if e['ebene'] == 1:
            kap['name'] = f"{int(k):02d}_{ordnername(e['titel'])}"
            kap['titel'] = e['titel']
            kap['eintrag'] = e
        elif e['ebene'] == 2:
            kap['unter'].append({**e, 'punkte': []})
        elif e['ebene'] == 3:
            kap['unter'][-1]['punkte'].append(e)
        elif e['ebene'] == 0:
            kap['uebergaenge'].append(e)
    reihenfolge = sorted(kapitel, key=lambda k: (0, -1) if k == 'V' else (1, int(k)) if k.isdigit() else (2, ord(k)))

    # Wurzel
    datei('CLAUDE.md', vorlage('CLAUDE.md'))
    datei('.claude/settings.json', vorlage('settings.json'))
    for a in sorted((VORLAGEN / 'agents').glob('*.md')):
        datei(f'.claude/agents/{a.name}', a.read_text(encoding='utf-8'))

    # Dokumentation
    doku = '00_Dokumentation'
    datei(f'{doku}/README.md', vorlage('Dokumentation_README.md'))
    datei(f'{doku}/Gliederung/{gliederung_name}', gliederung_daten)
    puffer = io.StringIO()
    w = csv.writer(puffer, delimiter=';')
    w.writerow(['Kapitel', 'Thema', 'Ebene', 'Ordner', 'Pkw', 'Van', 'Abschlusskriterium', 'Notiz'])
    md = [f'# Gliederung oneSCM-Handbuch (Stand der Vorlage: {gliederung_name})', '']
    status = ['# Status je Unterkapitel', '', '| Nr. | Unterkapitel | Quellen | Entwurf | Bilder | Prüfung | Freigabe |', '|---|---|---|---|---|---|---|']
    for k in reihenfolge:
        kap = kapitel[k]
        md.append(f"## {kap['name']}" + (f" – {kap['titel']}" if kap['titel'] else ''))
        if kap.get('eintrag'):
            e = kap['eintrag']
            w.writerow([e['nr'], e['titel'], 1, f"02_Kapitel/{kap['name']}", e['pkw'], e['van'], e['kriterium'], e['notiz']])
        for u in kap['unter']:
            uordner = f"02_Kapitel/{kap['name']}/{u['nr']}_{ordnername(u['titel'])}"
            w.writerow([u['nr'], u['titel'], 2, uordner, u['pkw'], u['van'], u['kriterium'], u['notiz']])
            md.append(f"- **{u['nr']} {u['titel']}**")
            status.append(f"| {u['nr']} | {u['titel']} | – | – | – | – | – |")
            for p in u['punkte']:
                w.writerow([p['nr'], p['titel'], 3, uordner, p['pkw'], p['van'], p['kriterium'], p['notiz']])
                md.append(f"  - {p['nr']} {p['titel']}")
        for t in kap['uebergaenge']:
            w.writerow([t['nr'], t['titel'], 0, f"02_Kapitel/{kap['name']}", '', '', t['kriterium'], t['notiz']])
            md.append(f"- Übergang **{t['nr']}** {t['titel']}")
        md.append('')
    datei(f'{doku}/Gliederung/Gliederung.csv', '﻿' + puffer.getvalue())
    datei(f'{doku}/Gliederung/Gliederung.md', '\n'.join(md))
    datei(f'{doku}/STATUS.md', '\n'.join(status) + '\n\nLegende: – offen · ✎ in Arbeit · ✓ erledigt · ⚠ blockiert\n')
    datei(f'{doku}/ENTSCHEIDUNGEN.md', vorlage('ENTSCHEIDUNGEN.md'))
    datei(f'{doku}/BEGRIFFE.md', vorlage('BEGRIFFE.md'))
    datei(f'{doku}/INPUT_PROTOKOLL.md', '# Input-Protokoll\n\n| Datum | Datei | SHA-256 | Ergebnis | Kapitel/Unterkapitel | Begründung |\n|---|---|---|---|---|---|\n\n## Zu entscheiden\n\n')

    # Input
    for o in ['01_Input/01_Eingang', '01_Input/02_Zugeordnet', '01_Input/03_Ausgeschlossen']:
        ordner.add(o)
    datei('01_Input/README.md', vorlage('Input_README.md'))

    # Kapitel
    for k in reihenfolge:
        kap = kapitel[k]
        basis = f"02_Kapitel/{kap['name']}"
        for a in ARBEITSORDNER:
            ordner.add(f'{basis}/{a}')
        zeilen = [f"# {kap['name'].replace('_', ' ')}", '']
        if kap.get('eintrag'):
            e = kap['eintrag']
            zeilen += [f"**Sparten:** {sparten(e)}", '', f"**Abschlusskriterium:** {e['kriterium']}", '', f"**Nachweisbedarf:** {e['notiz']}", '']
        zeilen += ['## Unterkapitel', '']
        zeilen += [f"- {u['nr']} {u['titel']} ({len(u['punkte'])} Punkte)" for u in kap['unter']]
        if kap['uebergaenge']:
            zeilen += ['', '## Übergangstexte', '']
            for t in kap['uebergaenge']:
                zeilen += [f"### {t['nr']} {t['titel']}", '', t['text'] or '[offen]', '', f"*Abschlusskriterium:* {t['kriterium']}", '']
        zeilen += ['', '## Arbeitsordner', '', '| Ordner | Inhalt |', '|---|---|',
                   '| 01_Quellen | zugeordnete Quellen, QUELLEN.md |', '| 02_Entwurf | Entwürfe je Unterkapitel |',
                   '| 03_Bilder | Bilder, BILDER.md |', '| 04_Pruefung_Freigabe | Prüfberichte, Freigabebelege |', '', '## Notizen', '']
        datei(f'{basis}/KAPITEL.md', '\n'.join(zeilen))
        datei(f'{basis}/01_Quellen/QUELLEN.md', '# Quellen\n\n| Datei | SHA-256 | Fundstelle | Unterkapitel | Sicherheit | zugeordnet am |\n|---|---|---|---|---|---|\n')
        datei(f'{basis}/03_Bilder/BILDER.md', '# Bildverzeichnis\n\n| Nummer | Datei | Unterkapitel | Alternativtext | Bildunterschrift | Quelle | Anonymisierung | Status |\n|---|---|---|---|---|---|---|---|\n')
        for u in kap['unter']:
            uordner = f"{basis}/{u['nr']}_{ordnername(u['titel'])}"
            ordner.add(uordner)
            if unterkapitel_arbeitsordner:
                for a in ARBEITSORDNER:
                    ordner.add(f'{uordner}/{a}')
            uz = [f"# {u['nr']} {u['titel']}", '', f"**Sparten:** {sparten(u)}", '',
                  f"**Abschlusskriterium:** {u['kriterium']}", '', f"**Nachweisbedarf:** {u['notiz']}", '', '## Punkte (Ebene 3)', '']
            for p in u['punkte']:
                uz += [f"### {p['nr']} {p['titel']}", '', f"- Nachweisbedarf: {p['notiz'] or '–'}", f"- Abschlusskriterium: {p['kriterium'] or '–'}", '']
            uz += ['## Notizen', '']
            datei(f'{uordner}/UNTERKAPITEL.md', '\n'.join(uz))
    return dateien, ordner, len(reihenfolge), sum(len(kapitel[k]['unter']) for k in kapitel)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('gliederung', type=Path)
    ap.add_argument('ziel', type=Path)
    ap.add_argument('--stand', default=date.today().strftime('%d%m%Y'))
    ap.add_argument('--unterkapitel-arbeitsordner', action='store_true', help='die vier Arbeitsordner auch in jedem Unterkapitel anlegen')
    a = ap.parse_args()
    dateien, ordner, n_kap, n_unter = baue(lies_gliederung(a.gliederung), a.stand, a.unterkapitel_arbeitsordner, a.gliederung.name, a.gliederung.read_bytes())
    wurzel = a.stand
    with zipfile.ZipFile(a.ziel, 'w', zipfile.ZIP_DEFLATED) as z:
        alle_ordner = set(ordner)
        for p in dateien:
            teile = p.split('/')[:-1]
            for i in range(1, len(teile) + 1):
                alle_ordner.add('/'.join(teile[:i]))
        for o in sorted(alle_ordner):
            z.writestr(f'{wurzel}/{o}/', '')
        for p, inhalt in sorted(dateien.items()):
            z.writestr(f'{wurzel}/{p}', inhalt)
    laengster = max((f'{wurzel}/{p}' for p in dateien), key=len)
    print(f'{n_kap} Kapitel, {n_unter} Unterkapitel, {len(alle_ordner)} Ordner, {len(dateien)} Dateien → {a.ziel}')
    print(f'längster Pfad ({len(laengster)} Zeichen relativ): {laengster}')


if __name__ == '__main__':
    main()
