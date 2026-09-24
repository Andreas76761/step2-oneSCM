# oneSCM Handbook Studio
## Vollständiger Projektauftrag für Claude

**Version:** 1.0  
**Stand:** 24.09.2026  
**Sprache:** Deutsch  
**Ziel:** Entwicklung einer revisionssicheren Webapp, die aus tausenden Markdown-Texten ein konsistentes, rollen- und spartenspezifisches oneSCM-Benutzerhandbuch erzeugt.

## 1. Rolle von Claude

Arbeite als Senior Solution Architect, Product Engineer, UX Engineer, Data Modeler, API Designer, QA Engineer und Technical Writer. Liefere produktionsnahe, testbare und dokumentierte Artefakte. Erfinde keine oneSCM-Funktionen oder Prozessschritte. Nicht belegte Informationen werden als `unconfirmed`, `open_question` oder Qualitätsbefund gespeichert. Fachliche Rolle und technische Systemberechtigung bleiben getrennt.

## 2. Produktvision

Die Anwendung importiert ZIP-Dateien und einzelne Markdown-Dateien, extrahiert Kapitel, Unterkapitel und Textabschnitte, speichert Ursprungstexte unverändert, klassifiziert Inhalte und erzeugt daraus professionelle Kapitel für Endanwender. Texte können anschließend manuell ergänzt, geändert, gelöscht, verschoben, gesperrt, versioniert und freigegeben werden.

### Rollen

| Rolle | Icon | Zweck |
|---|---:|---|
| Dealer | 🏪 | operative Vertragsbearbeitung im Autohaus |
| Markt | 🌍 | nationale/lokale Marktorganisation und Markteinstellungen |
| MO | ✅ | Market Operation, Prüfung und Freigabe, einschließlich MO-Check |
| HQ | 🏢 | zentrale Produkt-, Preis- und Systempflege |
| Alle | 👥 | rollenübergreifender Inhalt |

### Sparten

| Sparte | Icon | Code |
|---|---:|---|
| PKW | 🚘 | `car` |
| VAN | 🚐 | `van` |
| Truck | 🚛 | `truck` |
| Bus | 🚌 | `bus` |
| Alle | 🔄 | `all` |
| Ungeklärt | ❓ | `unconfirmed` |

Icon, Textlabel und Farbe werden gemeinsam dargestellt. Farbe allein hat keine Bedeutung.

## 3. Zielworkflow

```text
ZIP/MD importieren
→ Struktur erkennen
→ Ursprungstexte versioniert speichern
→ Rolle, Sparte, Markt und Release klassifizieren
→ semantisch clustern
→ globale Dopplungen erkennen
→ Widersprüche und Lücken klären
→ Canonical Topics festlegen
→ professionellen Kapitelentwurf generieren
→ manuell redigieren
→ Qualitätsgate
→ Freigabe
→ rollen- und spartenspezifischer Export
```

## 4. P0 User Stories

### US-001 Quellen importieren
Als Redakteur möchte ich ZIP- und MD-Dateien importieren, damit alle verfügbaren Quelltexte verarbeitet werden.

**Akzeptanzkriterien**
- ZIP und einzelne MD-Dateien werden akzeptiert.
- Jede Quelle erhält Dateiname, Pfad, SHA-256, Importzeit und Status.
- Fehler einzelner Dateien werden protokolliert.
- Identische Revisionen werden erkannt.
- Ursprungstexte werden nicht überschrieben.

### US-002 Struktur extrahieren
Als Redakteur möchte ich Kapitel, Unterkapitel und Textabschnitte extrahieren, damit Quellen vergleichbar werden.

**Akzeptanzkriterien**
- H1 wird Kapitel, H2 wird Unterkapitel.
- H3 bis H6 bleiben als Zwischenstruktur erhalten.
- Absatzreihenfolge und Quellposition bleiben erhalten.
- Text ohne Überschrift wird sichtbar unter `Ohne Kapitel` abgelegt.

### US-003 Rollen klassifizieren
Als Redakteur möchte ich Inhalte Dealer, Markt, MO, HQ oder Alle zuordnen.

**Akzeptanzkriterien**
- Mehrfachzuordnung ist möglich.
- Automatische Zuordnung besitzt Score, Methode, Modellversion und Evidenzstatus.
- Unbestätigte Zuordnung wird sichtbar markiert.
- Fachliche Rolle und technische Berechtigung sind getrennt.

### US-004 Sparten klassifizieren
Als Redakteur möchte ich Inhalte PKW, VAN, Truck, Bus, Alle oder Ungeklärt zuordnen.

**Akzeptanzkriterien**
- Sparten werden unabhängig von Rollen verwaltet.
- Jede Sparte besitzt Icon und Textlabel.
- Aus Dateinamen abgeleitete Werte bleiben unbestätigt.

### US-005 Semantisch clustern
Als Redakteur möchte ich verwandte Texte clustern, damit tausende Quellen konsolidiert werden.

**Akzeptanzkriterien**
- Analyse funktioniert kapitelintern und kapitelübergreifend.
- Schwellenwerte sind konfigurierbar.
- Treffer zeigen Score, Quelle, Methode und Begründung.
- Cluster können bestätigt, geteilt, zusammengeführt und umbenannt werden.

### US-006 Globale Dopplungen erkennen
Als Redakteur möchte ich gleiche Aussagen im gesamten Handbuch erkennen.

**Akzeptanzkriterien**
- Exakte und semantische Dopplungen werden getrennt ausgewiesen.
- Ein führendes Kapitel kann als `CanonicalTopic` festgelegt werden.
- Andere Kapitel erhalten einen Querverweis.
- Die App löscht nicht automatisch ohne Entscheidung.

### US-007 Widersprüche klären
Als Fachprüfer möchte ich Widersprüche vor der Generierung klären.

**Akzeptanzkriterien**
- Beide Aussagen, Quellen, Rollen, Sparten, Märkte, Releases und Score werden angezeigt.
- Offene Blocker verhindern Generierung, Freigabe und Export.
- Entscheidungen benötigen Begründung, Entscheider und Zeitstempel.
- Unterschiede können als Rollen-, Sparten-, Markt- oder Releaseunterschied klassifiziert werden.

### US-008 Kapitel generieren
Als Redakteur möchte ich aus bestätigten Quellen einen professionellen Kapitelentwurf erzeugen.

**Akzeptanzkriterien**
- Nur bestätigte Quellen fließen ein.
- Struktur: Zweck, Voraussetzungen, Rollen, Schritte, Ergebnis, Besonderheiten, Hinweise, Fehlerbehebung.
- Jeder Absatz ist auf Quellen zurückverfolgbar.
- Keine fachlichen Details werden erfunden.

### US-009 Manuell bearbeiten
Als Redakteur möchte ich Absätze ergänzen, ändern, löschen und verschieben.

**Akzeptanzkriterien**
- Änderungen werden versioniert.
- Manuell bearbeitete oder gesperrte Absätze werden nicht still überschrieben.
- Frühere Versionen können verglichen und wiederhergestellt werden.

### US-010 Rollen- und Spartenhinweise darstellen
Als Endanwender möchte ich Besonderheiten an Icons erkennen.

**Akzeptanzkriterien**
- Rollen und Sparten besitzen eindeutige Icons.
- Icon, Textlabel und Farbe werden gemeinsam verwendet.
- Gefilterte Ansichten enthalten allgemeine plus passende spezifische Inhalte.

### US-012 Qualitätsgate
Als Freigeber möchte ich nur belastbare Kapitel freigeben.

**Akzeptanzkriterien**
- Keine offenen Blocker-Widersprüche oder Datenschutzblocker.
- Jeder Absatz besitzt Evidenz oder dokumentierte manuelle Begründung.
- Rolle, Sparte, Markt und Release sind bestätigt oder bewusst allgemein markiert.
- Fachliche Freigabe ist protokolliert.

### US-020 Traceability
Als Auditor möchte ich Anforderung, API, Test, Dokumentation und Release verknüpfen.

**Akzeptanzkriterien**
- Jede P0-Anforderung besitzt mindestens einen Test.
- Jede API-Operation referenziert mindestens eine User Story.
- Matrix ist als Excel, CSV und Markdown exportierbar.

## 5. Weitere priorisierte Stories

- P1 Optimierungsdashboard
- P1 rollen-/sparten-/markt-/releasegefilterter Export
- P1 Evidenz- und Quellenansicht
- P1 Terminologieverwaltung
- P1 Freigabeworkflow
- P1 kombinierte Suche und Filter
- P1 Datenschutzprüfung
- P2 Versionsvergleich

## 6. Kapitelgenerierung

Nur `source_confirmed` und `manually_confirmed` verwenden. Standardstruktur:

1. Zweck
2. Voraussetzungen
3. Rollen und Zuständigkeiten
4. Schrittweise Durchführung
5. Ergebnis und Systemstatus
6. Rollenabhängige Besonderheiten
7. Sparten-, Markt- und Releaseunterschiede
8. Hinweise, Tipps und Warnungen
9. Fehlerbehebung
10. Quellen- und Freigabestatus

Schreibstil:
- professionell und endanwenderorientiert
- aktiv, klar und chronologisch
- Voraussetzungen vor Aktionen
- erwartetes Ergebnis nach Aktionen
- einheitliche Terminologie
- keine erfundenen Details
- allgemeine Aussagen nur einmal

## 7. Widerspruchs- und Dopplungslogik

Erkenne mindestens:
- Positiv vs. Negation
- Pflicht vs. optional
- abweichende Zahlen oder Fristen
- unterschiedliche Zuständigkeit
- Rollen-, Sparten-, Markt- oder Releaseunterschied
- veraltete Quelle

Entscheidungsoptionen:
- A übernehmen
- B übernehmen
- bedingt gültig
- Rollenunterschied
- Spartenunterschied
- Marktunterschied
- Releaseunterschied
- veraltete Quelle
- ignorieren mit Begründung
- zurückstellen

Dopplungsstufen:
1. identischer Hash
2. semantisch nahezu gleiche Aussage
3. gleiches Fachkonzept in unterschiedlichen Kapiteln

## 8. Kapitelwerkstatt

Funktionen:
- Absatz hinzufügen, bearbeiten, löschen, verschieben
- Überschrift ändern
- Rollen, Sparten, Markt und Release zuordnen
- Hinweis, Tipp oder Warnung einfügen
- Quelle öffnen
- Version vergleichen
- Änderung rückgängig machen
- Absatz sperren und freigeben
- Kommentar hinterlegen

Bearbeitungsmodi:
`generated`, `manually_edited`, `locked`, `needs_regeneration`, `approved`

## 9. Datenmodell

Kernentitäten:
- Project
- SourceDocument
- SourceRevision
- Chapter
- Subchapter
- TextSnippet
- Role
- Division
- Market
- ReleaseScope
- SemanticCluster
- ClusterMember
- CanonicalTopic
- QualityFinding
- GeneratedChapterVersion
- ContentBlock
- ContentBlockVersion
- Approval
- AuditEvent
- Requirement
- TestCase
- DocumentationItem
- ApiOperation

Zentrale Regeln:
1. Ursprungstexte sind unveränderlich.
2. Redaktionelle Änderungen erfolgen an versionierten Content Blocks.
3. Rollen und Sparten sind unabhängige m:n-Beziehungen.
4. Veröffentlichte Versionen sind unveränderlich.
5. Jeder veröffentlichte Absatz benötigt Evidenz oder Begründung.
6. Automatische Klassifikation speichert Modell, Version, Score und Bestätigungszustand.
7. Canonical Topics verhindern Wiederholungen.

## 10. API

OpenAPI 3.1.1, Basispfad `/api/v1`.

Verbindliche Operationen:

```text
POST /imports
GET /imports/{importId}
GET /snippets
PATCH /snippets/{snippetId}
POST /quality/analysis
GET /quality/findings
POST /quality/findings/{findingId}/decision
POST /chapters/{chapterId}/generate
GET /chapter-versions/{versionId}
PATCH /content-blocks/{blockId}
DELETE /content-blocks/{blockId}
POST /chapter-versions/{versionId}/approve
POST /exports
GET /traceability
```

Jede Operation enthält `x-requirements` mit den zugehörigen User-Story-IDs. Fehler verwenden `application/problem+json`.

## 11. Empfohlenes technisches Zielbild

- Frontend: React + TypeScript
- Backend: Node.js + TypeScript
- Produktion: PostgreSQL
- lokale Demo/Tests: SQLite
- Hintergrundjobs für Import, Analyse, Generierung und Export
- Object-Storage-Abstraktion für Quelldateien
- Docker
- Unit- und API-Tests
- Playwright für E2E
- CI auf mindestens zwei unterstützten Node-Versionen

Alternativen müssen anhand Skalierbarkeit, Wartbarkeit, Security und Anforderungen begründet werden.

## 12. Qualitätsbefunde

Typen:
- `gap`
- `duplicate`
- `contradiction`
- `terminology`
- `privacy`
- `readability`

Schweregrade:
- blocker
- high
- medium
- low

## 13. Datenschutz und Security

- Keine personenbezogenen Echtdaten in Screenshots, Beispielen oder Tests.
- Eingebettetes HTML und Skripte werden nicht ausgeführt.
- Datenschutzblocker verhindern Export.
- Uploadgrenzen und Dateitypen sind konfigurierbar.
- Auditprotokoll für Änderungen, Entscheidungen und Freigaben.
- Rollenbasierte Zugriffssteuerung.

## 14. UI-Navigation

```text
Dashboard
Quellen
Textcluster
Widersprüche
Dopplungen
Kapitelgenerator
Kapitelwerkstatt
Rollenansichten
Spartenansichten
Optimierungen
Freigabe
Export
Traceability
Einstellungen
```

Kapitelwerkstatt:
- links: Inhaltsverzeichnis, Status, Rollen-/Spartenabdeckung
- Mitte: Kapiteltext und Editor
- rechts: Quellen, Befunde, Optimierungen, Historie und Freigabe

## 15. P0-Entscheidungsfragen

Behandle folgende Gruppen als entscheidungspflichtig:

- Importformate, Limits, Teilfehler und Revisionslogik
- Markdown-Mapping und Snippet-Granularität
- Rollenzuordnung, Konfidenz und Freigabeberechtigung
- Spartenliste, Icons und automatische Ableitung
- semantisches Verfahren und Schwellenwerte
- globale Cluster und Canonical Topics
- Blockerdefinition und Widerspruchsentscheidungen
- zulässige Evidenzstatus
- Kapitelstruktur und Styleguide
- Schutz manueller Änderungen und Aufbewahrung
- verbindliche Icons und Barrierefreiheit
- Qualitätsgates, Freigeberrollen und Ausnahmen
- Traceability-Ebenen, Tests, Status und Nachweise

Solange eine P0-Frage offen ist:
- Empfehlung nur als vorläufige Annahme verwenden
- Annahme in Code und Dokumentation markieren
- Implementierung konfigurierbar halten
- keine fachliche Freigabe behaupten

## 16. Verbindliche Tests

Mindestens:
- ZIP- und MD-Import
- Teilfehler und identische Revision
- Kapitel-/Unterkapitelextraktion
- Rollen-/Spartenmehrfachzuordnung
- kombinierte Suche und Filter
- exakte und semantische Dopplung
- Pflicht/Optional, Negation, Zahlen und Fristen
- Qualitätsgate blockiert Generierung und Export
- Quellenbeziehung je Absatz
- Schutz manueller Änderungen
- Wiederherstellung früherer Versionen
- gefilterter Export
- Datenschutzblocker
- Traceability aller P0-Stories

## 17. Lieferartefakte

Erzeuge:
1. Gap-Analyse
2. Architektur und ADRs
3. Repository-Struktur
4. Datenbankmigrationen
5. OpenAPI-Spezifikation
6. Backend
7. Frontend
8. Importpipeline
9. semantische Analyse
10. Kapitelgenerator
11. Kapitelwerkstatt
12. Qualitätsgate
13. Export
14. Unit-, API- und E2E-Tests
15. CI-Konfiguration
16. Demo-Daten
17. README für Start, Test und Betrieb
18. aktualisierte Traceability-Matrix

## 18. Definition of Done

Eine Story ist fertig, wenn:
- Akzeptanzkriterien erfüllt
- Tests bestanden
- API und Datenmodell aktualisiert
- Dokumentation aktualisiert
- Traceability vollständig
- keine neuen Blocker
- Datenschutz und Security berücksichtigt
- fachliche Annahmen sichtbar

## 19. Erster Auftrag

Lies dieses Dokument vollständig. Erstelle danach:

1. eine Gap-Analyse
2. eine priorisierte Reihenfolge aller P0-Stories
3. die Repository-Struktur
4. eine ADR-Liste
5. offene Widersprüche und P0-Entscheidungen
6. die Dateien des ersten Implementierungsschritts

Nimm keine fachlich offene P0-Entscheidung stillschweigend vor. Beginne erst nach der Gap-Analyse mit Codeänderungen.
