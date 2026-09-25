// Screenshots markieren (ADR-042): Bildschirmfoto laden, nummerierte Klickpunkte setzen und Bereiche umrahmen, Legende pflegen,
// als PNG in der Bildablage speichern. Punkte lassen sich auch per Tastatur (Koordinaten in Prozent) anlegen und verschieben.
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { patch, post } from '../api';
import { Card, errorText, useApp } from './ui';

interface Marker { x: number; y: number; text: string }
interface Frame { x: number; y: number; w: number; h: number }
type Tool = 'marker' | 'frame';
export interface SavedShot { sha256: string; markdown: string; legend: string; title: string }

const clamp = (v: number) => Math.min(100, Math.max(0, Math.round(v * 10) / 10));

/** Markierungen auf das Bild zeichnen (Koordinaten in Prozent der Bildgröße) */
function draw(canvas: HTMLCanvasElement, img: HTMLImageElement, markers: Marker[], frames: Frame[], color: string, preview: Frame | null) {
  const g = canvas.getContext('2d');
  if (!g) return;
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  canvas.width = w;
  canvas.height = h;
  g.drawImage(img, 0, 0);
  const unit = Math.max(2, Math.round(Math.max(w, h) / 400));
  g.lineWidth = unit * 2;
  g.strokeStyle = color;
  for (const f of preview ? [...frames, preview] : frames) g.strokeRect((f.x / 100) * w, (f.y / 100) * h, (f.w / 100) * w, (f.h / 100) * h);
  const r = Math.max(12, Math.round(Math.min(w, h) / 30));
  g.font = `bold ${Math.round(r * 1.1)}px Arial, Helvetica, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  markers.forEach((m, i) => {
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
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [tool, setTool] = useState<Tool>('marker');
  const [color, setColor] = useState('#d4145a');
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [preview, setPreview] = useState<Frame | null>(null);
  const [alt, setAlt] = useState('');
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<('marker' | 'frame')[]>([]);

  useEffect(() => {
    if (img && canvas.current) draw(canvas.current, img, markers, frames, color, preview);
  }, [img, markers, frames, color, preview]);

  const load = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const i = new Image();
    i.onload = () => {
      URL.revokeObjectURL(url);
      setImg(i);
      setName(file.name);
      setMarkers([]);
      setFrames([]);
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
  const addMarker = (x: number, y: number) => {
    setMarkers((m) => [...m, { x, y, text: '' }]);
    setHistory((h) => [...h, 'marker']);
  };
  const onDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const p = pos(e);
    if (tool === 'marker') addMarker(p.x, p.y);
    else {
      e.currentTarget.setPointerCapture?.(e.pointerId);
      setDrag(p);
    }
  };
  const onMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drag) return;
    const p = pos(e);
    setPreview({ x: Math.min(drag.x, p.x), y: Math.min(drag.y, p.y), w: Math.abs(p.x - drag.x), h: Math.abs(p.y - drag.y) });
  };
  const onUp = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drag) return;
    const p = pos(e);
    const f = { x: Math.min(drag.x, p.x), y: Math.min(drag.y, p.y), w: Math.abs(p.x - drag.x), h: Math.abs(p.y - drag.y) };
    setDrag(null);
    setPreview(null);
    if (f.w >= 1 && f.h >= 1) {
      setFrames((fr) => [...fr, f]);
      setHistory((h) => [...h, 'frame']);
    }
  };
  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    if (last === 'marker') setMarkers((m) => m.slice(0, -1));
    else setFrames((f) => f.slice(0, -1));
    setHistory((h) => h.slice(0, -1));
  };
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
            <label className="inline">Farbe <input type="color" value={color} onChange={(e) => setColor(e.target.value)} /></label>
            <button className="btn small" disabled={!history.length} onClick={undo}>Rückgängig</button>
            <button className="btn small" disabled={!history.length} onClick={() => { setMarkers([]); setFrames([]); setHistory([]); }}>Alles entfernen</button>
          </div>
          <p className="small muted">{tool === 'marker' ? 'Ins Bild klicken, um die nächste Nummer zu setzen.' : 'Mit gedrückter Maustaste einen Rahmen aufziehen.'} {name}</p>
          <div className="shot-canvas">
            <canvas ref={canvas} role="img" aria-label={`Screenshot mit ${markers.length} Nummern und ${frames.length} Rahmen`}
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
                  <button className="btn small danger" aria-label={`Nummer ${i + 1} entfernen`} onClick={() => { setMarkers(markers.filter((_, j) => j !== i)); setHistory((h) => { const k = h.lastIndexOf('marker'); return k < 0 ? h : [...h.slice(0, k), ...h.slice(k + 1)]; }); }}>✕</button>
                </li>
              ))}
            </ol>
            <button className="btn small" onClick={() => addMarker(50, 50)}>+ Nummer in Bildmitte</button>
          </fieldset>
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
