# ADR-071 Sprachen beim Lesen

**Status:** akzeptiert, umgesetzt in Etappe 24 (erweitert ADR-020, ADR-054, ADR-066)

## Kontext
Übersetzungen (ADR-020) konnten freigegeben und exportiert werden, die Leseransicht zeigte aber nur Deutsch. Händler im Ausland sollen das Handbuch in ihrer Sprache lesen – auch wenn noch nicht alles übersetzt ist.

## Entscheidung
- **Sprachauswahl** oben im Inhaltsverzeichnis der Leseransicht, sobald das Projekt Zielsprachen hat (`GET /reader/languages`, mit Anzahl übersetzter Kapitel). Die Wahl gilt für den Browser (`localStorage`) und lässt sich per `?lang=` verlinken; nur Projektsprachen sind erlaubt (sonst 400).
- **Fassung in der Sprache** (`GET /reader/versions/{versionId}?lang=`): gleiche Struktur wie die deutsche Fassung (Rollen, Schritte, Hinweise), Texte und Titel aus der **freigegebenen Übersetzung genau dieser Fassung**, Abschnittstitel übersetzt, `lang`-Attribut am Artikel.
- **Rückfall auf Deutsch mit Hinweis** statt Lücke: `fallback = missing` (noch keine Übersetzung), `outdated` (Übersetzung gehört zu einer älteren Fassung) bzw. Anzahl noch deutscher Absätze. Der Hinweis nennt die Sprache und dass die deutsche Fassung gezeigt wird.
- **Titel, Suche, FAQ und Glossar folgen der Sprache:** Inhaltsverzeichnis mit übersetzten Titeln (`GET /reader/translations`), Suche über übersetzte Texte (sonst deutsch, Kennzeichen `translated`), FAQ in der Sprache (sonst deutsch), Glossar aus den **Übersetzungen der Terminologie** (Begriff und Definition je Projektsprache, gepflegt unter „Terminologie“; ohne Übersetzung kein Eintrag).
- „Siehe auch“ berechnet sich immer aus der **deutschen Quelle** und ist damit in jeder Sprache gleich, nur die Titel erscheinen übersetzt (ADR-072).

## Konsequenzen
- Keine neuen Übersetzungsdaten: es gilt nur, was im Übersetzungs-Workflow freigegeben wurde (Vier-Augen-Prinzip bleibt).
- Migration 032 ergänzt `terminology_terms.translations` (JSON je Sprache).
