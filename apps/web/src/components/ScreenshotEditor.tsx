// Screenshots markieren (ADR-042, erweitert ADR-046): Bildschirmfoto laden, nummerierte Klickpunkte setzen, Bereiche umrahmen,
// Pfeile und Textfelder einzeichnen, vertrauliche Bereiche unkenntlich machen (verpixelt – im gespeicherten PNG nicht umkehrbar),
// Legende pflegen, als PNG speichern. Nummern und Textfelder lassen sich auch per Tastatur (Koordinaten in Prozent) anlegen.
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { patch, post } from '../api';
import { Card, errorText, useApp } from './ui';

interface Marker { x: number; y: number; text: string }
interface Frame { x: number; y: number; w: number; h: number }
interface Arrow { x1: number; y1: number; x2: number; y2: number }
interface Label { x: number; y: number; text: string }
type Tool = 'marker' | 'frame' | 'arrow' | 'text' | 'blur';
interface Shapes { markers: Marker[]; frames: Frame[]; arrows: Arrow[]; labels: Label[]; blurs: Frame[] }
const EMPTY: Shapes = { markers: [], frames: [], arrows: [], labels: [], blurs: [] };
const KEY: Record<Tool, keyof Shapes> = { marker: 'markers', frame: 'frames', arrow: 'arrows', text: 'labels', blur: 'blurs' };
export interface SavedShot { sha256: string; markdown: string; legend: string; title: string }

const clamp = (v: number) => Math.min(100, Math.max(0, Math.round(v * 10) / 10));

/** Bereich verpixeln: verkleinert und ohne Glättung wieder vergrößert (Inhalt ist danach nicht mehr lesbar) */
function pixelate(g: CanvasRenderingContext2D, x: number, y: number, rw: number, rh: number, block: number) {
  if (rw < 1 || rh < 1) return;
  const small = document.createElement('canvas');
  small.width = Math.max(1, Math.ceil(rw / block));
  small.height = Math.max(1, Math.ceil(rh / block));
  const sg = small.getContext('2d');
  if (!sg) return;
  sg.drawImage(g.canvas, x, y, rw, rh, 0, 0, small.width, small.height);
  g.save();
  g.imageSmoothingEnabled = false;
  g.drawImage(small, 0, 0, small.width, small.height, x, y, rw, rh);
  g.restore();
}

/** Markierungen auf das Bild zeichnen (Koordinaten in Prozent der Bildgröße); Reihenfolge: Unschärfe, Rahmen, Pfeile, Text, Nummern */
function draw(canvas: HTMLCanvasElement, img: HTMLImageElement, sh: Shapes, color: string, preview: { tool: Tool; f: Frame; a: Arrow } | null) {
  const g = canvas.getContext('2d');
  if (!g) return;
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  canvas.width = w;
  canvas.height = h;
  g.drawImage(img, 0, 0);
  const px = (f: Frame) => [(f.x / 100) * w, (f.y / 100) * h, (f.w / 100) * w, (f.h / 100) * h] as const;
  const block = Math.max(8, Math.round(Math.min(w, h) / 50));
  for (const b of sh.blurs) pixelate(g, ...px(b), block);
  const unit = Math.max(2, Math.round(Math.max(w, h) / 400));
  const r = Math.max(12, Math.round(Math.min(w, h) / 30));
  g.lineWidth = unit * 2;
  g.strokeStyle = color;
  for (const f of sh.frames) g.strokeRect(...px(f));
  const arrow = (a: Arrow) => {
    const [x1, y1, x2, y2] = [(a.x1 / 100) * w, (a.y1 / 100) * h, (a.x2 / 100) * w, (a.y2 / 100) * h];
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const head = r * 1.1;
    g.lineWidth = unit * 2;
    g.strokeStyle = color;
    g.fillStyle = color;
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2 - Math.cos(ang) * head * 0.8, y2 - Math.sin(ang) * head * 0.8);
    g.stroke();
    g.beginPath();
    g.moveTo(x2, y2);
    g.lineTo(x2 - head * Math.cos(ang - 0.45), y2 - head * Math.sin(ang - 0.45));
    g.lineTo(x2 - head * Math.cos(ang + 0.45), y2 - head * Math.sin(ang + 0.45));
    g.closePath();
    g.fill();
  };
  sh.arrows.forEach(arrow);
  if (preview) {
    g.save();
    g.setLineDash([unit * 3, unit * 2]);
    if (preview.tool === 'arrow') arrow(preview.a);
    else g.strokeRect(...px(preview.f));
    g.restore();
  }
  g.font = `bold ${Math.round(r * 0.9)}px Arial, Helvetica, sans-serif`;
  g.textBaseline = 'middle';
  for (const l of sh.labels) {
    const text = l.text.trim() || 'Text';
    const tw = g.measureText(text).width;
    const [x, y] = [(l.x / 100) * w, (l.y / 100) * h];
    const pad = r * 0.4;
    const bh = r * 1.5;
    g.fillStyle = '#ffffff';
    g.strokeStyle = color;
    g.lineWidth = unit;
    g.beginPath();
    g.rect(x, y - bh / 2, tw + pad * 2, bh);
    g.fill();
    g.stroke();
    g.fillStyle = '#111827';
    g.textAlign = 'left';
    g.fillText(text, x + pad, y + 1);
  }
  g.font = `bold ${Math.round(r * 1.1)}px Arial, Helvetica, sans-serif`;
  g.textAlign = 'center';
  sh.markers.forEach((m, i) => {
    const cx = (m.x / 100) * w;
    const cy = (m.y / 100) * h;
    g.beginPath();
    g.arc(cx, cy, r, 0, Math.PI * 2);
    g.fillStyle = color;
    g.fill();
    g.lineWidth = unit;
    g.strokeStyle = '#ffffff';
    g.stroke();
    g.fillStyle = '#ffffff';
    g.fillText(String(i + 1), cx, cy + 1);
  });
}

export function ScreenshotEditor({ canEdit, onSaved }: { canEdit: boolean; onSaved?: (s: SavedShot) => void }) {
  const { notify } = useApp();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState('');
  const [sh, setSh] = useState<Shapes>(EMPTY);
  const { markers, frames, arrows, labels, blurs } = sh;
  const setMarkers = (m: Marker[]) => setSh((x) => ({ ...x, markers: m }));
  const setLabels = (l: Label[]) => setSh((x) => ({ ...x, labels: l }));
  const [tool, setTool] = useState<Tool>('marker');
  const [color, setColor] = useState('#d4145a');
  const [labelText, setLabelText] = useState('');
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [preview, setPreview] = useState<{ tool: Tool; f: Frame; a: Arrow } | null>(null);
  const [alt, setAlt] = useState('');
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<Tool[]>([]);

  useEffect(() => {
    if (img && canvas.current) draw(canvas.current, img, sh, color, preview);
  }, [img, sh, color, preview]);

  const load = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const i = new Image();
    i.onload = () => {
      URL.revokeObjectURL(url);
      setImg(i);
      setName(file.name);
      setSh(EMPTY);
      setHistory([]);
      setTitle(file.name.replace(/\.[^.]+$/, ''));
    };
    i.onerror = () => notify('Bild konnte nicht geladen werden.', 'error');
    i.src = url;
  };

  const pos = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: clamp(((e.clientX - r.left) / r.width) * 100), y: clamp(((e.clientY - r.top) / r.height) * 100) };
  };
  const add = <K extends Tool>(t: K, item: Shapes[(typeof KEY)[K]][number]) => {
    setSh((x) => ({ ...x, [KEY[t]]: [...(x[KEY[t]] as unknown[]), item] }));
    setHistory((h) => [...h, t]);
  };
  const addMarker = (x: number, y: number) => add('marker', { x, y, text: '' });
  const addLabel = (x: number, y: number) => add('text', { x, y, text: labelText.trim() || 'Text' });
  const onDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const p = pos(e);
    if (tool === 'marker') addMarker(p.x, p.y);
    else if (tool === 'text') addLabel(p.x, p.y);
    else {
      e.currentTarget.setPointerCapture?.(e.pointerId);
      setDrag(p);
    }
  };
  const shape = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
    f: { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) },
    a: { x1: a.x, y1: a.y, x2: b.x, y2: b.y },
  });
  const onMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drag) return;
    setPreview({ tool, ...shape(drag, pos(e)) });
  };
  const onUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drag) return;
    const { f, a } = shape(drag, pos(e));
    setDrag(null);
    setPreview(null);
    if (tool === 'arrow') {
      if (Math.hypot(a.x2 - a.x1, a.y2 - a.y1) >= 2) add('arrow', a);
    } else if (f.w >= 1 && f.h >= 1) add(tool === 'blur' ? 'blur' : 'frame', f);
  };
  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    setSh((x) => ({ ...x, [KEY[last]]: (x[KEY[last]] as unknown[]).slice(0, -1) }));
    setHistory((h) => h.slice(0, -1));
  };
  const dropHistory = (t: Tool) => setHistory((h) => {
    const k = h.lastIndexOf(t);
    return k < 0 ? h : [...h.slice(0, k), ...h.slice(k + 1)];
  });
  const describe = [
    `Screenshot mit ${markers.length} Nummern und ${frames.length} Rahmen`,
    arrows.length ? `${arrows.length} Pfeilen` : '', labels.length ? `${labels.length} Textfeldern` : '', blurs.length ? `${blurs.length} unkenntlichen Bereichen` : '',
  ].filter(Boolean).join(', ');
  const legend = markers.map((m, i) => `${i + 1}. ${m.text.trim() || `Schritt ${i + 1}`}`).join('\n');

  const save = async () => {
    if (!canvas.current || !alt.trim()) return;
    setBusy(true);
    try {
      const blob = await new Promise<Blob | null>((res) => canvas.current!.toBlob(res, 'image/png'));
      if (!blob) throw new Error('Bild konnte nicht erzeugt werden.');
      const fd = new FormData();
      fd.append('file', new File([blob], `${(title || 'screenshot').replace(/[^\w.-]+/g, '_')}.png`, { type: 'image/png' }));
      const m = await post<{ sha256: string }>('/media', fd);
      if (title.trim()) await patch(`/media/${m.sha256}`, { title: title.trim() });
      const markdown = `![${alt.trim().replace(/([\\[\]])/g, '\\$1')}](media:${m.sha256})`;
      notify('Screenshot gespeichert.');
      onSaved?.({ sha256: m.sha256, markdown, legend, title: title.trim() || alt.trim() });
    } catch (e) {
      notify(errorText(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Screenshot markieren">
      <label className="block">Bildschirmfoto (PNG oder JPEG)
        <input type="file" accept="image/png,image/jpeg" data-testid="screenshot-input" onChange={(e) => load(e.target.files?.[0])} />
      </label>
      {img && (
        <>
          <div className="filters" role="group" aria-label="Werkzeug">
            <button className={`chip${tool === 'marker' ? ' active' : ''}`} aria-pressed={tool === 'marker'} onClick={() => setTool('marker')}>① Nummer setzen</button>
            <button className={`chip${tool === 'frame' ? ' active' : ''}`} aria-pressed={tool === 'frame'} onClick={() => setTool('frame')}>▭ Rahmen ziehen</button>
            <button className={`chip${tool === 'arrow' ? ' active' : ''}`} aria-pressed={tool === 'arrow'} onClick={() => setTool('arrow')}>➜ Pfeil ziehen</button>
            <button className={`chip${tool === 'text' ? ' active' : ''}`} aria-pressed={tool === 'text'} onClick={() => setTool('text')}>T Textfeld setzen</button>
            <button className={`chip${tool === 'blur' ? ' active' : ''}`} aria-pressed={tool === 'blur'} onClick={() => setTool('blur')}>▦ Unkenntlich machen</button>
            <label className="inline">Farbe <input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></label>
            <button className="btn small" disabled={!history.length} onClick={undo}>Rückgängig</button>
            <button className="btn small" disabled={!history.length} onClick={() => { setSh(EMPTY); setHistory([]); }}>Alles entfernen</button>
          </div>
          {tool === 'text' && <label className="inline">Beschriftung <input value={labelText} onChange={(e) => setLabelText(e.target.value)} placeholder="z. B. Pflichtfeld" /></label>}
          <p className="small muted">{{
            marker: 'Ins Bild klicken, um die nächste Nummer zu setzen.', frame: 'Mit gedrückter Maustaste einen Rahmen aufziehen.', arrow: 'Mit gedrückter Maustaste vom Anfang zur Spitze des Pfeils ziehen.',
            text: 'Ins Bild klicken, um das Textfeld zu setzen (linke Kante, Mitte).', blur: 'Bereich aufziehen, der unkenntlich werden soll (z. B. Kundendaten) – im gespeicherten Bild nicht wiederherstellbar.',
          }[tool]} {name}</p>
          <div className="shot-canvas">
            <canvas ref={canvas} role="img" aria-label={describe}
              onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} data-testid="screenshot-canvas" />
          </div>
          <fieldset className="step-list">
            <legend className="small">Legende (Nummern, Position in % – auch per Tastatur)</legend>
            <ol>
              {markers.map((m, i) => (
                <li key={i} className="step-row">
                  <input aria-label={`Nummer ${i + 1} Beschreibung`} placeholder="Was wird hier geklickt?" value={m.text} onChange={(e) => setMarkers(markers.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} />
                  <input aria-label={`Nummer ${i + 1} X in Prozent`} type="number" min={0} max={100} value={m.x} style={{ width: '5em' }} onChange={(e) => setMarkers(markers.map((x, j) => (j === i ? { ...x, x: clamp(Number(e.target.value)) } : x)))} />
                  <input aria-label={`Nummer ${i + 1} Y in Prozent`} type="number" min={0} max={100} value={m.y} style={{ width: '5em' }} onChange={(e) => setMarkers(markers.map((x, j) => (j === i ? { ...x, y: clamp(Number(e.target.value)) } : x)))} />
                  <button className="btn small danger" aria-label={`Nummer ${i + 1} entfernen`} onClick={() => { setMarkers(markers.filter((_, j) => j !== i)); dropHistory('marker'); }}>✕</button>
                </li>
              ))}
            </ol>
            <button className="btn small" onClick={() => addMarker(50, 50)}>+ Nummer in Bildmitte</button>
          </fieldset>
          {(labels.length > 0 || tool === 'text') && (
            <fieldset className="step-list">
              <legend className="small">Textfelder (Position in %)</legend>
              <ul className="plain">
                {labels.map((l, i) => (
                  <li key={i} className="step-row">
                    <input aria-label={`Textfeld ${i + 1}`} value={l.text} onChange={(e) => setLabels(labels.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} />
                    <input aria-label={`Textfeld ${i + 1} X in Prozent`} type="number" min={0} max={100} value={l.x} style={{ width: '5em' }} onChange={(e) => setLabels(labels.map((x, j) => (j === i ? { ...x, x: clamp(Number(e.target.value)) } : x)))} />
                    <input aria-label={`Textfeld ${i + 1} Y in Prozent`} type="number" min={0} max={100} value={l.y} style={{ width: '5em' }} onChange={(e) => setLabels(labels.map((x, j) => (j === i ? { ...x, y: clamp(Number(e.target.value)) } : x)))} />
                    <button className="btn small danger" aria-label={`Textfeld ${i + 1} entfernen`} onClick={() => { setLabels(labels.filter((_, j) => j !== i)); dropHistory('text'); }}>✕</button>
                  </li>
                ))}
              </ul>
              <button className="btn small" onClick={() => addLabel(40, 50)}>+ Textfeld in Bildmitte</button>
            </fieldset>
          )}
          {blurs.length > 0 && <p className="small">▦ {blurs.length} Bereich(e) werden im gespeicherten Bild verpixelt.</p>}
          <label className="block">Titel (Bildverzeichnis)<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label className="block">Alternativtext (Pflicht)<input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Was zeigt der Screenshot?" /></label>
          {canEdit
            ? <button className="btn primary" disabled={busy || !alt.trim()} onClick={save}>Screenshot speichern</button>
            : <p className="small muted">Speichern erfordert Bearbeitungsrechte.</p>}
        </>
      )}
    </Card>
  );
}
