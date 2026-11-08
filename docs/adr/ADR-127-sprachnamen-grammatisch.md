# ADR-127 Sprachnamen grammatisch

**Status:** akzeptiert, umgesetzt in Etappe 27 (erweitert ADR-074, ADR-078)

## Kontext
Hinweise wie „noch nicht in {Sprache} übersetzt“ setzten den Sprachnamen unverändert ein. In Sprachen mit Fällen oder Artikeln ergab das falsche Sätze („do jazyka čeština“ statt „do češtiny“), und Auswahllisten zeigten kleingeschriebene Namen („français“).

## Entscheidung
- **Zielsprache als Satzteil** (`intoLanguage(code, ui)` in `readerText.ts`): je Beschriftungssprache Präposition und richtige Form für alle neun Projektsprachen – „ins Englische“, „into English“, „en anglais“, „al inglés“, „in inglese“, „in het Engels“, „na język angielski“, „do angličtiny“, „para inglês“. Die Texte nutzen `{into}` statt `{lang}`.
- **Unbekannte Sprachen:** Name über `Intl.DisplayNames` in der Beschriftungssprache mit neutraler Wendung („into Swedish“, „in die Sprache „Schwedisch““).
- **Auswahllisten und Deckblatt:** Eigenbezeichnung großgeschrieben (`languageLabel`: „Français“, „Čeština“). Bedienelemente der Redaktion bleiben deutsch.

## Konsequenzen
- Grammatisch richtige Hinweise in allen Sprachen; neue Projektsprachen brauchen einen Eintrag je Beschriftungssprache, sonst greift die neutrale Wendung.
