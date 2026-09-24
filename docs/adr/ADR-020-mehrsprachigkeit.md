# ADR-020 Mehrsprachigkeit

**Status:** akzeptiert, umgesetzt in Etappe 7

## Entscheidung
- **Quellsprache Deutsch**, Zielsprachen je Projekt (`projects.languages`: en, fr, es, it, nl, pl, cs, pt), gepflegt von der Administration.
- **Übersetzt werden nur freigegebene deutsche Kapitelversionen** (`translations`, eindeutig je Version und Sprache). Wird eine neuere deutsche Version freigegeben, gilt die Übersetzung als **veraltet**; die neue Version wird neu übersetzt.
- **KI-Übersetzung** je Absatz als Hintergrundjob über den KI-Anbieter aus ADR-013: Der deutsche Absatz wird in Sätze bzw. Listenpunkte zerlegt; jeder übersetzte Satz muss die Nummern der deutschen Sätze nennen (**Satz-Zuordnung**). Terminologie wird als Glossar mitgegeben. Absätze mit personenbezogenen Mustern werden nicht an externe Dienste übertragen.
- **Prüfung** jeder Übersetzung (KI und manuell): leer, fehlende oder unbekannte Zuordnung, nicht übersetzte deutsche Sätze, abweichende Zahlen (Tausender-/Dezimaltrennzeichen normalisiert), abweichende Listenstruktur.
- **Freigabe je Sprache** mit Berechtigung `approve` und Kommentar: alle Absätze übersetzt, keine Prüfbefunde, Titel übersetzt, Quelle aktuell. Danach unveränderlich.
- **Export** je Sprache als Markdown oder HTML (`lang`-Attribut), Abschnittstitel für en/fr/es/it übersetzt.

## Konsequenzen
- Die Prüfung ist formal (Zuordnung, Zahlen, Struktur); die inhaltliche Richtigkeit verantwortet die sprachliche Freigabe.
- Mehrsprachige Handbuch-Releases: siehe ADR-021 (Etappe 8).
