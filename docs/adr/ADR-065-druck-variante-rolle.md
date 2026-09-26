# ADR-065 Druck je Variante und Rolle im Firmen-Layout

**Status:** akzeptiert, umgesetzt in Etappe 22 (erweitert ADR-060, ADR-063)

## Kontext
Gedruckt wurde bisher immer das ganze Standardhandbuch. Händler, Märkte oder die Zentrale brauchen aber „ihr“ Handbuch – die Variante aus dem Draft Manual (ADR-034) oder nur die für ihre Rolle bestimmten Inhalte – und im Erscheinungsbild des Unternehmens.

## Entscheidung
- Die Druckansicht hat die Auswahl **„Handbuch“** (Standardhandbuch oder eine Handbuch-Variante, jeweils neueste Gliederungsversion) und **„Für Rolle“**. Die Auswahl steht in der Adresse (`?variante=…&rolle=…&entwuerfe=1`) und lässt sich als Link weitergeben.
- **Rolle** filtert wie die Rollenansichten: allgemeine Inhalte plus Inhalte der gewählten Rolle; Kapitel ohne passenden Inhalt entfallen.
- **Firmen-Layout** (ADR-038) auch im Browserdruck: Logo, Firmenname, Untertitel und Vertraulichkeitsvermerk auf dem Deckblatt, Hausfarbe für Deckblattleiste und Kapitelüberschriften, Kopfzeile (eigener Text oder Firma · Titel · Fassung · Rolle) und Fußzeile links.
- **Glossar-Anhang:** Begriffe und Abkürzungen (ADR-066), die im gedruckten Text vorkommen, erscheinen am Ende alphabetisch.
- Varianten tragen als Fassung immer „Arbeitsstand“, da Releases dem Standardhandbuch gelten.
- Gedruckt werden kann erst, wenn Kapitel und Deckblattangaben geladen sind (sonst entstünde ein PDF mit Ersatzangaben).
