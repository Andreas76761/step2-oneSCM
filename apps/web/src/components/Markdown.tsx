// Markdown-Darstellung (ADR-013 §13: kein HTML) – eigenes Modul, damit react-markdown erst bei Bedarf geladen wird
import { useEffect, useMemo, useState } from 'react';
import Markdown, { defaultUrlTransform } from 'react-markdown';
import { mediaUrl } from '../api';
import { MdGlossTerm, remarkGlossary, useGlossary } from './Glossary';

/** Bild aus der Medienablage; externe Bilder werden nicht geladen (nur Alternativtext, wie im Export) */
function MdImage({ src, alt }: { src?: string; alt?: string }) {
  const sha = /^media:([a-f0-9]{64})$/.exec(src ?? '')?.[1];
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!sha) return;
    let alive = true;
    mediaUrl(sha).then((u) => alive && setUrl(u), () => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [sha]);
  if (!alt) return <span className="md-img-missing-alt" role="img" aria-label="Bild ohne Alternativtext">⚠️ Bild ohne Alternativtext</span>;
  if (!sha || failed) return <span className="md-img-alt">[Bild: {alt}]</span>;
  return url ? <img className="md-img" src={url} alt={alt} loading="lazy" /> : <span className="md-img-alt" aria-busy="true">[Bild: {alt}]</span>;
}

/** Markdown-Vorschau ohne HTML-Ausführung (kein rehype-raw, §13). */
export default function MarkdownView({ text }: { text: string }) {
  // Glossar nur innerhalb eines GlossaryProvider (Leseransicht, Druck); sonst unverändert
  const g = useGlossary();
  const plugins = useMemo(() => (g.regex ? [remarkGlossary(g)] : []), [g]);
  return (
    <div className="md">
      <Markdown skipHtml remarkPlugins={plugins} urlTransform={(url) => (url.startsWith('media:') ? url : defaultUrlTransform(url))}
        components={{ img: ({ src, alt }) => <MdImage src={typeof src === 'string' ? src : undefined} alt={alt} />, ...({ 'gloss-term': MdGlossTerm } as object) }}>{text}</Markdown>
    </div>
  );
}

