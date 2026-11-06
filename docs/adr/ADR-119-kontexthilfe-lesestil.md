# ADR-119 Kontexthilfe im Lesestil „Handbuch-Kapitel“

**Status:** akzeptiert, umgesetzt in Etappe 67. Diese Option hatte der Auftraggeber am 24.10.2026 zur Wahl gestellt. Erweitert ADR-030 (Kontexthilfe), ADR-061 (Rückmeldungen in der Online-Hilfe) und ADR-117 (Lesestil).

## Kontext
Leseransicht, Druck und Online-Hilfe folgen seit Etappe 65 dem gewählten Lesestil. Die in oneSCM eingebettete Kontexthilfe (`/help/embed/…`) hatte weiter ein eigenes, festes Aussehen. Ihre Rückmeldeschaltflächen trugen noch Emoji (👍/👎), obwohl die übrige App seit ADR-111 einheitliche Icons nutzt.

## Entscheidung
- **Lesestil auch in der Kontexthilfe:** Steht `readingStyle` auf `fachdoku`, ergänzt die Hilfeseite das CSS aus `readingCss` mit Farben und Schriften der Anpassung, Überschriften mit Balken und Hinweisboxen mit farbigem Balken. Die Schaltflächen nutzen die Hauptfarbe, die Kontrast ≥ 4,5 : 1 zu Weiß hat (ADR-114).
- **Hinweisboxen mit Beschriftung:** Im Lesestil bekommen Hinweis, Tipp und Warnung eine Zeile mit Lucide-Icon (`aria-hidden`) und Bezeichnung. Die Bezeichnung steht in der Sprache des gezeigten Inhalts, beim deutschen Rückfall also deutsch.
- **Icons statt Emoji** bei „War das hilfreich?“ (Daumen hoch/runter als Inline-SVG). Das gilt in beiden Stilen; der zugängliche Name bleibt „Ja“ bzw. „Nein“.
- Unverändert: ohne Skripte, strikte CSP, `frame-ancestors` nur für `HELP_EMBED_ORIGINS`.

## Folgen
- Neue Icons `thumbs-up`, `thumbs-down` im Generator (`scripts/gen-design-icons.mjs`).
- Mit `readingStyle: standard` sieht die Kontexthilfe aus wie bisher, nur mit Icons statt Emoji.
