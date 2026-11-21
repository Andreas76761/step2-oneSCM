// Etappe 112: Code-Review der Etappen 109–111
import { describe, expect, it } from 'vitest';
import { analyzeStyle, avoidMatches } from '../src/domain/style.js';

describe('Etappe 112', () => {
  it('[T-453] Systemname: jede andere Schreibweise ist ein Fund („nemesis“, „NeMeSiS“), die bevorzugte nie', () => {
    const text = 'Nemesis liefert Daten. nemesis und NeMeSiS und NEMESIS sind falsch geschrieben.';
    expect(avoidMatches(text, 'NEMESIS', 'Nemesis').map((m) => m[0])).toEqual(['nemesis', 'NeMeSiS', 'NEMESIS']);
    // gewöhnliche Varianten weiter ohne Groß-/Kleinschreibung, auch am Satzanfang
    expect(avoidMatches('Genehmigung erteilt. Die genehmigung fehlt.', 'Genehmigung', 'Freigabe').map((m) => m[0])).toEqual(['Genehmigung', 'genehmigung']);
    const issues = analyzeStyle(text, { terms: [{ preferred: 'Nemesis', avoid: ['NEMESIS'] }] }).sentences.flatMap((s) => s.issues).filter((i) => i.rule === 'terminology');
    expect(issues.map((i) => text.slice(i.start, i.end))).toEqual(['nemesis', 'NeMeSiS', 'NEMESIS']);
    expect(issues.every((i) => i.fix?.replacement === 'Nemesis')).toBe(true);
  });
});
