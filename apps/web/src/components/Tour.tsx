// Einführung beim ersten Start (ADR-056): wenige Hinweise zu Startseite, Menü, Assistent, Check und Leseransicht.
// Nicht modal (die Seite bleibt bedienbar), per Tastatur steuerbar (Esc schließt), jederzeit über „Einführung“ neu startbar.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const TOUR_KEY = 'onescm.tour.done';

const STEPS = [
  { target: '.task-grid', title: 'Was möchten Sie tun?', text: 'Die Startseite zeigt die wichtigsten Aufgaben. Ein Klick genügt – von Quellen hochladen bis Handbuch veröffentlichen.' },
  { target: '#nav-h-sammeln', title: 'Menü nach Arbeitsablauf', text: 'Das Menü folgt Ihrem Weg: 1 Sammeln → 2 Schreiben → 3 Prüfen → 4 Veröffentlichen. Selteneres liegt unter „Weitere“.' },
  { target: '#main-nav a[href="/kapitel-assistent"]', title: 'Kapitel-Assistent', text: 'Neue Kapitel schreiben Sie hier in vier Schritten – mit Vorlagen und Vorschlägen aus Ihren Quellen.' },
  { target: '#main-nav a[href="/anleitungs-check"]', title: 'Anleitungs-Check', text: 'Prüft, ob ein Kapitel leicht zu befolgen ist, und korrigiert typische Schwächen per Klick.' },
  { target: '#main-nav a[href="/lesen"]', title: 'Leseransicht', text: 'So sehen Ihre Leserinnen und Leser das Handbuch – mit „War das hilfreich?“ je Kapitel.' },
  { target: '#tour-restart', title: 'Jederzeit wieder', text: 'Diese Einführung starten Sie hier erneut. Viel Erfolg mit Ihrem Handbuch!' },
];

export function markTourDone() {
  try {
    localStorage.setItem(TOUR_KEY, '1');
  } catch {
    /* ohne Speicher: erscheint beim nächsten Besuch erneut */
  }
}

export function tourDone() {
  try {
    return localStorage.getItem(TOUR_KEY) === '1';
  } catch {
    return true;
  }
}

export function Tour({ onClose }: { onClose: () => void }) {
  const [i, setI] = useState(0);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const step = STEPS[i];
  const close = () => {
    markTourDone();
    onClose();
  };
  // Ziel hervorheben und Karte daneben platzieren (auf schmalen Bildschirmen oder ohne sichtbares Ziel: unten mittig)
  useLayoutEffect(() => {
    const el = document.querySelector<HTMLElement>(step.target);
    const r = el?.getBoundingClientRect();
    el?.classList.add('tour-target');
    if (el && r && r.width > 0 && window.innerWidth > 800) {
      el.scrollIntoView({ block: 'nearest' });
      const r2 = el.getBoundingClientRect();
      const w = 320;
      const left = r2.right + 16 + w < window.innerWidth ? r2.right + 16 : Math.max(16, Math.min(window.innerWidth - w - 16, r2.left));
      const top = r2.right + 16 + w < window.innerWidth ? Math.max(16, Math.min(window.innerHeight - 220, r2.top)) : Math.min(window.innerHeight - 220, r2.bottom + 12);
      setPos({ top, left });
    } else setPos(null);
    return () => el?.classList.remove('tour-target');
  }, [step.target]);
  useEffect(() => {
    heading.current?.focus();
  }, [i]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div ref={card} className={`tour${pos ? '' : ' tour-center'}`} role="dialog" aria-modal="false" aria-labelledby="tour-title" aria-describedby="tour-text"
      style={pos ? { top: pos.top, left: pos.left } : undefined}>
      <p className="small muted">Einführung · {i + 1} von {STEPS.length}</p>
      <h2 id="tour-title" ref={heading} tabIndex={-1}>{step.title}</h2>
      <p id="tour-text">{step.text}</p>
      <div className="row-actions">
        {i > 0 && <button className="btn small" onClick={() => setI(i - 1)}>← Zurück</button>}
        {i < STEPS.length - 1
          ? <button className="btn small primary" onClick={() => setI(i + 1)}>Weiter →</button>
          : <button className="btn small primary" onClick={close}>Fertig</button>}
        {i < STEPS.length - 1 && <button className="btn small ghost" onClick={close}>Überspringen</button>}
      </div>
    </div>
  );
}
