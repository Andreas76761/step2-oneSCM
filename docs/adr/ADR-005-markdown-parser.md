# ADR-005 Eigener, nicht ausführender Markdown-Struktur-Parser

**Status:** akzeptiert

## Kontext
Benötigt werden Überschriftenebenen, Blockgrenzen, Zeilennummern und Reihenfolge – kein HTML-Rendering. Eingebettetes HTML/Skripte dürfen nie ausgeführt werden (§13).

## Entscheidung
Zeilenbasierter Parser (`domain/markdown.ts`) für ATX-/Setext-Überschriften, Absätze, Listen, Tabellen, Zitate, Codeblöcke und YAML-Front-Matter (sicher geparst mit `yaml`, ohne benutzerdefinierte Tags). HTML bleibt reiner Text. Im Frontend wird Markdown mit `react-markdown` **ohne** `rehype-raw` dargestellt, d. h. HTML wird nicht interpretiert.

## Alternativen
`remark`/`mdast`: vollständiger, aber Positionsinformationen je Block müssten ohnehin nachbearbeitet werden; größere Abhängigkeitsfläche.
