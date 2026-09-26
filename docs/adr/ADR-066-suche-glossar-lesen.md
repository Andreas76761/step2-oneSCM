# ADR-066 Suche und Glossar in der Leseransicht

**Status:** akzeptiert, umgesetzt in Etappe 22 (erweitert ADR-054)

## Kontext
Leserinnen und Leser fanden Anleitungen nur über Kapiteltitel. Fachbegriffe und Abkürzungen blieben unerklärt, obwohl Terminologie (ADR-012) und Abkürzungsverzeichnis (ADR-032) gepflegt werden.

## Entscheidung
- **Suche** „Im Handbuch suchen“ über Titel und Text der gezeigten Fassungen (freigegeben, mit „Entwürfe einblenden“ die neueste): alle Wörter müssen vorkommen, Titeltreffer zuerst, je Kapitel ein Ausschnitt mit markierten Wörtern (`GET /reader/search`). Suche beim Tippen ab zwei Zeichen; die Ergebnisse ersetzen das Inhaltsverzeichnis.
- Ein Treffer öffnet das Kapitel mit `?q=`; die Wörter werden über die **CSS Custom Highlight API** markiert (keine Änderung am DOM, unabhängig vom Rendering), der erste Treffer wird angesteuert. Eine Statuszeile nennt die Trefferzahl und bietet „Markierung entfernen“. Browser ohne die API zeigen das Kapitel ohne Markierung.
- **Glossar** (`GET /reader/glossary`): bevorzugte Begriffe der Terminologie mit Definition und alle Abkürzungen; keine eigene Pflege. Beim ersten Vorkommen je Absatz bzw. Schrittliste wird der Begriff zur Schaltfläche mit gepunkteter Unterstreichung; Klick, Maus oder Tastatur zeigen die Erklärung als Tooltip (WCAG 1.4.13: Esc schließt, überfahrbar, bleibt stehen).
- Der zugängliche Name der Schaltfläche ist der Begriff selbst, damit Beschriftungen (z. B. Schritte zum Abhaken) unverändert bleiben. Begriffe erkennen den Anfangsbuchstaben groß und klein, Abkürzungen nur in genauer Schreibweise; längere Begriffe haben Vorrang.
- Im Druck erscheinen Begriffe als normaler Text; die Erklärungen stehen im Glossar-Anhang (ADR-065).
