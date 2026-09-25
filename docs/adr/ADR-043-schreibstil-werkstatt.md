# ADR-043 Schreibstil in der Werkstatt, Stilwert je Kapitel, Stapelkorrektur

**Status:** akzeptiert, umgesetzt in Etappe 15 (erweitert ADR-040)

## Kontext
Die Stilprüfung (ADR-040) lief nur auf der Seite „Schreibstil“. Redakteurinnen und Redakteure arbeiten aber in der Kapitelwerkstatt und brauchen einen Überblick, welche Kapitel stilistisch nachgearbeitet werden müssen.

## Entscheidung
- **Werkstatt: „🖋️ Stil anzeigen“** schaltet die Stilprüfung für die angezeigte Kapitelversion ein: Absätze mit Hinweisen zeigen gelb markierte Sätze; im Entwurf öffnet ein Klick die Satzbearbeitung (Einzelkorrekturen, freie Bearbeitung) und speichert über die normale Absatzbearbeitung (`PATCH /content-blocks/{id}` mit Versionsprüfung, Grund „Schreibstil“). Bilder des Absatzes bleiben sichtbar; Bildzeilen werden nicht als Sätze geprüft.
- **„🖋️ Stil korrigieren“ (Stapelkorrektur):** `POST /style/chapter-versions/{versionId}/autofix` liefert je Absatz vorher/nachher und die Zahl der Korrekturen (Vorschau, Leserecht). Mit `apply: true` und den gewählten Absätzen samt Versionsnummer werden die Korrekturen gespeichert (Bearbeitungsrecht); gesperrte und zwischenzeitlich geänderte Absätze werden übersprungen und gemeldet. Nur Entwürfe.
- **Stilwert je Kapitel:** `GET /style/chapters` bewertet die neueste Version jedes Kapitels (Stilwert gewichtet nach Satzzahl, Sätze mit Problemen, automatisch korrigierbar), schlechteste zuerst, mit Durchschnitt; das Dashboard zeigt die acht niedrigsten mit Link in die Werkstatt.

## Konsequenzen
- Die Stapelkorrektur wendet nur eindeutige Regelkorrekturen an; Umformulierungen per KI bleiben Einzelentscheidungen (ADR-013, ADR-040).
- Der Stilwert wird bei jedem Aufruf berechnet (kein Zwischenspeicher); bei sehr vielen Kapiteln kann das Dashboard dadurch langsamer laden.
