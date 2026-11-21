// Screenshot aus der Zwischenablage (ADR-085, F-23): Strg+V auf der Seite oder Schaltfläche (Clipboard API).
// Nur Rasterbilder; Text in der Zwischenablage bleibt für Eingabefelder unberührt.
import { useEffect, useRef } from 'react';

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

/** Bild aus einem Einfüge-Ereignis, sonst null */
export function imageFromPaste(e: ClipboardEvent): File | null {
  for (const item of Array.from(e.clipboardData?.items ?? [])) {
    if (item.kind === 'file' && IMAGE_TYPES.includes(item.type)) {
      const f = item.getAsFile();
      if (f) return new File([f], f.name && f.name !== 'image.png' ? f.name : `screenshot-${stamp()}.${item.type.split('/')[1]}`, { type: item.type });
    }
  }
  return null;
}

/** Bild über die Clipboard API lesen (Schaltfläche); wirft eine verständliche Meldung, wenn keins vorhanden ist */
export async function readClipboardImage(): Promise<File> {
  if (!navigator.clipboard?.read) throw new Error('Ihr Browser erlaubt das Lesen der Zwischenablage nicht – drücken Sie Strg+V.');
  for (const item of await navigator.clipboard.read()) {
    const type = item.types.find((t) => IMAGE_TYPES.includes(t));
    if (type) return new File([await item.getType(type)], `screenshot-${stamp()}.${type.split('/')[1]}`, { type });
  }
  throw new Error('In der Zwischenablage ist kein Bild.');
}

/** Strg+V mit Bild auf der ganzen Seite abfangen, solange die Komponente angezeigt wird */
export function usePasteImage(onImage: (f: File) => void, enabled = true) {
  const cb = useRef(onImage);
  cb.current = onImage;
  useEffect(() => {
    if (!enabled) return;
    const h = (e: ClipboardEvent) => {
      const f = imageFromPaste(e);
      if (!f) return;
      e.preventDefault();
      cb.current(f);
    };
    document.addEventListener('paste', h);
    return () => document.removeEventListener('paste', h);
  }, [enabled]);
}
