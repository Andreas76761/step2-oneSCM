// Klickstrecke aus Screenshots (ADR-093, F-24): Stationen aus Bildern des Archivs, nummeriert 1, 2, 3 … – mehrere
// Bilder einer Station sind parallele Wege und heißen 3a, 3b … Reine Fachlogik für Prüfung, Nummern und Alternativtext.

export interface ClickAlternative { sha: string; caption: string }
export interface ClickStation { alternatives: ClickAlternative[] }

export const MAX_STATIONS = 12;
export const MAX_ALTERNATIVES = 3;

/** Eingabe prüfen: 2–12 Stationen, je 1–3 Bilder mit Beschriftung (höchstens 80 Zeichen) */
export function normalizeStations(input: unknown): ClickStation[] {
  if (!Array.isArray(input)) throw new Error('steps muss eine Liste von Stationen sein.');
  const out = input.map((st: any, i: number) => {
    const alts = Array.isArray(st?.alternatives) ? st.alternatives : st?.sha ? [st] : [];
    if (!alts.length || alts.length > MAX_ALTERNATIVES) throw new Error(`Station ${i + 1}: 1 bis ${MAX_ALTERNATIVES} Bilder.`);
    return {
      alternatives: alts.map((a: any) => {
        const sha = String(a?.sha ?? '');
        if (!/^[a-f0-9]{64}$/.test(sha)) throw new Error(`Station ${i + 1}: Bild fehlt.`);
        return { sha, caption: String(a?.caption ?? '').replace(/\s+/g, ' ').trim().slice(0, 80) };
      }),
    };
  });
  if (out.length < 2 || out.length > MAX_STATIONS) throw new Error(`Eine Klickstrecke hat 2 bis ${MAX_STATIONS} Stationen.`);
  return out;
}

/** Nummern je Bild: [['1'], ['2'], ['3a', '3b'], ['4']] */
export const stationLabels = (stations: ClickStation[]) =>
  stations.map((s, i) => (s.alternatives.length === 1 ? [String(i + 1)] : s.alternatives.map((_, k) => `${i + 1}${String.fromCharCode(97 + k)}`)));

/** Alternativtext: „Klickstrecke Reifen anlegen: 1 Startseite → 2 Produkte → 3a Neu oder 3b Kopieren → 4 Speichern“ */
export function clickpathAlt(title: string, stations: ClickStation[]) {
  const labels = stationLabels(stations);
  const parts = stations.map((s, i) => s.alternatives.map((a, k) => `${labels[i][k]}${a.caption ? ` ${a.caption}` : ''}`).join(' oder '));
  return `Klickstrecke ${title}: ${parts.join(' → ')}`.slice(0, 600);
}
