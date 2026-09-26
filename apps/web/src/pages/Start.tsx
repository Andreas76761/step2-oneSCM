// Startseite (ADR-053): „Was möchten Sie tun?“ – die Hauptaufgaben auf einen Blick, der Fortschritt zum fertigen Handbuch
// und die Kapitel, die als Nächstes Aufmerksamkeit brauchen.
import { Link } from 'react-router-dom';
import { Card, Page, useLoad } from '../components/ui';
import { scoreLabel } from './Guidance';

const TASKS = [
  { to: '/quellen', icon: '📥', title: 'Quellen hochladen', text: 'Vorhandene Dokumente, Notizen oder Exporte als Grundlage einlesen.' },
  { to: '/kapitel-assistent', icon: '🧭', title: 'Neues Kapitel schreiben', text: 'Geführt in vier Schritten – mit Vorschlägen aus den Quellen.' },
  { to: '/werkstatt', icon: '✏️', title: 'Kapitel überarbeiten', text: 'Absätze bearbeiten, Bilder einfügen, Stil korrigieren.' },
  { to: '/anleitungs-check', icon: '🔍', title: 'Verständlichkeit prüfen', text: 'Sind die Anleitungen leicht zu befolgen? Mit Korrekturen per Klick.' },
  { to: '/veroeffentlichung', icon: '📚', title: 'Handbuch veröffentlichen', text: 'Freigegebene Kapitel als Version bereitstellen und exportieren.' },
];

export function StartPage() {
  const dash = useLoad<any>('/dashboard');
  const guidance = useLoad<any>('/guidance');
  const releases = useLoad<any[]>('/releases');
  const d = dash.data;
  const g = guidance.data;
  const versions = (status?: string) => (d?.versions ?? []).filter((v: any) => !status || v.status === status).reduce((n: number, v: any) => n + Number(v.n), 0);
  const contradictions = (d?.openFindings ?? []).filter((f: any) => f.type === 'contradiction').reduce((n: number, f: any) => n + Number(f.n), 0);
  const steps = d && g && releases.data ? [
    { done: d.sources > 0, label: 'Quellen eingelesen', detail: d.sources ? `${d.sources} Dokumente` : 'noch keine', to: '/quellen' },
    { done: d.sources > 0 && contradictions === 0, label: 'Widersprüche geklärt', detail: contradictions ? `${contradictions} offen` : 'keine offen', to: '/widersprueche' },
    { done: versions() > 0, label: 'Kapitel geschrieben', detail: g.chapters.length ? `${g.chapters.length} Kapitel` : 'noch keine', to: '/kapitel-assistent' },
    { done: g.average !== null && g.average >= 80, label: 'Kapitel leicht zu befolgen', detail: g.average === null ? 'noch nicht geprüft' : `Durchschnitt ${g.average} von 100`, to: '/anleitungs-check' },
    { done: versions('approved') > 0, label: 'Kapitel freigegeben', detail: `${versions('approved')} freigegeben`, to: '/freigabe' },
    { done: releases.data.length > 0, label: 'Handbuch veröffentlicht', detail: releases.data.length ? `${releases.data.length} Version(en)` : 'noch nicht', to: '/veroeffentlichung' },
  ] : null;
  const nextStep = steps?.find((s) => !s.done);
  const attention = (g?.chapters ?? []).filter((c: any) => c.open.length).slice(0, 3);
  return (
    <Page title="Start" subtitle="Was möchten Sie tun?">
      <nav aria-label="Hauptaufgaben" className="task-grid">
        {TASKS.map((t) => (
          <Link key={t.to} to={t.to} className="task-tile">
            <span className="task-icon" aria-hidden="true">{t.icon}</span>
            <strong>{t.title}</strong>
            <span className="small">{t.text}</span>
          </Link>
        ))}
      </nav>
      <div className="grid2">
        <Card title="Ihr Weg zum fertigen Handbuch">
          {!steps ? <p className="muted">Lade …</p> : (
            <>
              <ol className="progress-list">
                {steps.map((s) => (
                  <li key={s.label} className={s.done ? 'done' : s === nextStep ? 'next' : ''}>
                    <span className="progress-mark" aria-hidden="true">{s.done ? '✓' : s === nextStep ? '→' : '○'}</span>
                    <span className="progress-text"><Link to={s.to}>{s.label}</Link> <span className="small muted">· {s.detail}</span></span>
                    <span className="sr-only">{s.done ? '(erledigt)' : s === nextStep ? '(als Nächstes)' : '(offen)'}</span>
                  </li>
                ))}
              </ol>
              <p className="small">{nextStep ? <>Als Nächstes: <Link to={nextStep.to}><strong>{nextStep.label}</strong></Link></> : '🎉 Alle Schritte erledigt.'} · {steps.filter((s) => s.done).length} von {steps.length} erledigt</p>
            </>
          )}
        </Card>
        <Card title="Braucht Aufmerksamkeit">
          {!g ? <p className="muted">Lade …</p> : !attention.length ? <p className="small">{g.chapters.length ? '✓ Alle Kapitel erfüllen den Anleitungs-Check.' : 'Noch keine Kapitel – beginnen Sie mit dem Kapitel-Assistenten.'}</p> : (
            <ul className="plain attention">
              {attention.map((c: any) => (
                <li key={c.chapterId}>
                  <Link to={`/anleitungs-check/${c.versionId}`}><strong>{c.title}</strong></Link>
                  <span className="small muted"> · {c.score} von 100, {scoreLabel(c.score)}</span>
                  <div className="small">{c.open.slice(0, 3).map((o: any) => o.label).join(' · ')}{c.open.length > 3 ? ` · +${c.open.length - 3}` : ''}</div>
                </li>
              ))}
            </ul>
          )}
          <p className="small"><Link to="/anleitungs-check">Alle Kapitel im Anleitungs-Check →</Link></p>
        </Card>
      </div>
      <p className="small muted">Kennzahlen, Rollen- und Spartenabdeckung finden Sie im <Link to="/dashboard">Dashboard</Link> unter „Weitere“.</p>
    </Page>
  );
}
