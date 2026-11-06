# ADR-107 Textbausteine (Single Sourcing) und schnellere Übersicht oneSCM_Metadaten

**Status:** akzeptiert, umgesetzt in Etappe 54. Umfasst W-11 aus docs/10 (F-19 aus docs/07) und den offenen Punkt „schnellere Übersicht oneSCM_Metadaten“ aus dem Lasttest der Etappe 49. Erweitert ADR-009 (Absätze mit Lineage und Historie), ADR-079 (oneSCM_Metadaten) und ADR-104 (Entwurf als Kopie der freigegebenen Version).

## Kontext
- **Textbausteine (W-11):** Hinweise wie „Speichern Sie regelmäßig …“ stehen wortgleich in vielen Kapiteln. Ändert sich der Inhalt, muss die Redaktion jedes Kapitel einzeln finden und ändern. Der Punkt war als „später“ empfohlen; er braucht keine offene Entscheidung.
- **Übersicht oneSCM_Metadaten:** Sie braucht bei 48 000 Chunks rund 200 ms und macht ein Fünftel der Anfragen im gemischten Paralleltest aus (docs/lasttest-metadaten.md, Etappe 49).

Der Auftraggeber hat „weiter mit der nächsten Etappe“ gewünscht. Die Punkte mit offener Entscheidung bleiben offen: G-04 (LanguageTool lokal), weitere Märkte und Sprachen (U-07), die Schreibweise offener Begriffe und O-09.

## Entscheidung

**Textbausteine (W-11)**
- Ein Textbaustein hat eine Kennung (z. B. `hinweis-sitzung`), einen Titel, eine Art (Absatz, Hinweis, Tipp, Warnung, Liste, Tabelle) und Fassungen mit Notiz. Ein geänderter Text ergibt eine neue Fassung.
- **Einfügen:** Der Baustein wird ein gesperrter, verknüpfter Absatz am Ende eines Abschnitts.
  - Der Absatz trägt Baustein und Fassung (`content_blocks.module_id`, `module_version`).
  - Er hat die dokumentierte Begründung „Textbaustein … (Fassung n)“, damit die Evidenzprüfung ihn als bewusst manuell erkennt.
  - Ist die neueste Version freigegeben, entsteht ein Entwurf als Kopie (wie bei den Änderungsvorschlägen, ADR-104).
- **Verwendung:** Je Kapitel steht der verknüpfte Absatz in der neuesten Version mit Status „aktuell“ oder „veraltet“.
- **In Kapitel aktualisieren:** Die aktuelle Fassung wird in die verknüpften Absätze mit älterer Fassung übernommen.
  - Das geschieht je Kapitel in einen Entwurf und mit Eintrag in der Absatzhistorie.
  - Freigegebene Versionen bleiben bis zur nächsten Freigabe gültig.
  - Eingereichte Kapitel werden übersprungen und gemeldet.
- **Gleiche Absätze verknüpfen:** Noch nicht verknüpfte Absätze, deren Text einer Fassung des Bausteins gleicht, werden verknüpft und aktualisiert. Verglichen wird ohne Markdown-Auszeichnung und Leerraum-Unterschiede.
- **Wiederkehrende Absätze:** Gleicher Text ab 8 Wörtern in mindestens zwei Kapiteln (neueste Version, ohne Baustein) wird als Kandidat gezeigt und lässt sich mit einem Klick als Baustein anlegen.
- **Eigener Text löst die Verknüpfung:** Wer einen verknüpften Absatz ändert, gibt ihm eigenen Text. Er wird beim Aktualisieren nicht mehr überschrieben.
- **Weitere Regeln:**
  - Beim Neu-Generieren eines Kapitels bleiben verknüpfte Absätze wie andere manuelle Absätze erhalten.
  - Exporte zeigen den Text wie jeden Absatz.
  - Abgelegte Bausteine lassen sich nicht mehr einfügen; vorhandene Verknüpfungen bleiben.
  - Bearbeiten erfordert die Berechtigung „Bearbeiten“, Lesen genügt für Liste und Verwendung.
- Werkstatt: Kennzeichen „🧩 Textbaustein F n“ am Absatz.

**Übersicht oneSCM_Metadaten**
- Dokumente, Chunks je Format und gelabelte Chunks werden je Projekt zwischengespeichert, höchstens 30 s lang.
- Diese Schreibzugriffe verwerfen den Speicher sofort:
  - Import (neue Revision, entfernte oder wiederhergestellte Dokumente, Abschluss),
  - Labeln von Chunks, Löschen eines Labels, TRIAGE,
  - Entfernen einer Wissensnotiz.
- Labelgruppen und gespeicherte Antworten werden weiter bei jeder Anfrage gezählt; die Abfragen sind günstig.

## Begründung
- Die Verknüpfung am Absatz nutzt Lineage und Historie, die es schon gibt. Ein Baustein ist damit ein gewöhnlicher Absatz mit Herkunft und keine Sonderform im Export.
- Aktualisieren in einen Entwurf hält den Freigabeprozess ein; der Fachbereich gibt eine geänderte Fassung wie jede Änderung frei.
- „Eigener Text löst die Verknüpfung“ verhindert, dass bewusste Abweichungen still überschrieben werden.
- Ein Zwischenspeicher mit kurzer Frist braucht keine Zähler, die an vielen Stellen mitgeführt werden und auseinanderlaufen können.

## Folgen
- Migration 060: `text_modules`, `text_module_versions`, `content_blocks.module_id` und `module_version`.
- Neue Schnittstellen:
  - `GET`/`POST /text-modules`, `GET /text-modules/candidates`;
  - `GET`/`PATCH /text-modules/{id}`, `POST /text-modules/{id}/insert`, `POST /text-modules/{id}/propagate`.
- Seite „Textbausteine“ (Schreiben).
- Bei mehreren Instanzen kann die Übersicht auf einer anderen Instanz bis zu 30 s den alten Stand zeigen.
- Nicht umgesetzt: Bausteine mit Platzhaltern (z. B. Produktname je Variante) und Bausteine in Übersetzungen; Übersetzungen eines verknüpften Absatzes laufen wie bisher je Kapitel.
