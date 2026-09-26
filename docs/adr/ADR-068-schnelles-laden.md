# ADR-068 Schnelles Laden der Oberfläche

**Status:** akzeptiert, umgesetzt in Etappe 22

## Kontext
Die Oberfläche war ein einziges JavaScript-Paket (834 kB, 243 kB gzip), das bei jedem Aufruf vollständig geladen und vom Server unkomprimiert ausgeliefert wurde; nach jedem Update musste alles neu geladen werden.

## Entscheidung
- **Code-Splitting:** Jede Seite wird per `React.lazy` erst beim Aufruf geladen (Hinweis „Lade …“ als `role="status"`). Der Markdown-Renderer (`components/Markdown.tsx`) und `oidc-client-ts` (nur im OIDC-Modus) sind eigene Pakete; bis der Renderer geladen ist, erscheint der Text unformatiert statt einer Lücke.
- **Vendor-Chunk:** React, React DOM und Router in einem eigenen Paket, das sich zwischen App-Updates nicht ändert und im Browser-Cache bleibt.
- **Vorkomprimiert:** `apps/web/scripts/compress.mjs` erzeugt nach dem Build Brotli- und gzip-Fassungen (ab 1 kB); `@fastify/static` liefert sie mit `preCompressed` je nach `Accept-Encoding` – ohne Komprimieren je Anfrage und ohne zusätzliche Abhängigkeit.
- **Caching:** Dateien unter `assets/` (Hash im Namen) mit `Cache-Control: public, max-age=31536000, immutable`; `index.html` und SPA-Routen mit `no-cache`, damit eine neue Version sofort wirkt.
- **Lesesuche** (ADR-066) mit zwei Datenbankabfragen statt zwei je Kapitel.

## Ergebnis
Erstaufruf ≈ 96 kB gzip bzw. ≈ 85 kB Brotli statt 243 kB (−60 %); Folgeaufrufe laden nach einem Update nur die geänderten App-Pakete.
