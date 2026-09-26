# ADR-075 Übersetzung aus der Leseransicht anfordern

**Status:** akzeptiert, umgesetzt in Etappe 25 (erweitert ADR-020, ADR-071)

## Kontext
Leser sehen „noch nicht übersetzt“, konnten der Redaktion aber nicht mitteilen, welche Kapitel sie in ihrer Sprache brauchen. Die Redaktion übersetzte ohne Kenntnis des Bedarfs.

## Entscheidung
- Im Rückfall-Hinweis (Übersetzung fehlt oder ist veraltet) der Knopf **„Übersetzung anfordern“** (`POST /reader/translation-requests`, jede Person mit Lesezugriff). Danach „✓ Übersetzung angefordert – die Redaktion ist informiert“.
- Je Person, Kapitel und Sprache zählt **ein** Wunsch (Tabelle `translation_requests`, Migration 033). Nur Projektsprachen; für aktuell übersetzte Kapitel abgelehnt.
- Der **erste Wunsch** je Kapitel und Sprache erzeugt einen Hinweis in der Kapitel-Diskussion an Autorin/Autor und Einreichende der neuesten Fassung (wie Leser-Rückmeldungen, ADR-061) – ohne Flut bei vielen Wünschen.
- **„Gewünschte Übersetzungen“** auf der Seite Übersetzungen (`GET /translation-requests`): meistgewünschte zuerst, Stand *fehlt / veraltet / in Arbeit*, Knopf „Übersetzen“ legt die Übersetzung direkt an. Der Stand wird berechnet: Ein Wunsch ist erledigt, sobald die Übersetzung der aktuellen freigegebenen Fassung freigegeben ist (mit `all=true` auch erledigte).
- Bei der **Freigabe** der Übersetzung erhalten alle, die sie gewünscht haben, eine Benachrichtigung mit Link zum Kapitel in ihrer Sprache.
