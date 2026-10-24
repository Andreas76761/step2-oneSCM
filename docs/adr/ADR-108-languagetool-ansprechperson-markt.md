# ADR-108 Lokale Grammatikprüfung mit LanguageTool und Ansprechperson je Markt

**Status:** akzeptiert, umgesetzt in Etappe 55. Umfasst G-04 und O-09 aus docs/10. Erweitert ADR-040/ADR-097 (Schreibstil, Grammatik) und ADR-101 (Länderreview).

## Kontext
Zwei Punkte warteten auf eine Entscheidung des Auftraggebers.

**G-04 – lokale Grammatikprüfung mit LanguageTool.** Die eigenen Regeln prüfen Stil, Hausregeln und häufige Falschschreibungen. Fehler wie Kongruenz („mit mehrere Fehler“), Kommasetzung oder die kleingeschriebene Höflichkeitsform erkennen sie nicht zuverlässig.

**O-09 – Ansprechperson je Land.** Das Länderreview (ADR-101) ging an einen frei gewählten Benutzer; wer für ein Land zuständig ist, hielt die App nicht fest.

Entscheidungen vom 24.10.2026:
- **G-04:** ja, LanguageTool als **Java-Dienst ohne Docker**.
- **O-09:** **Benutzer je Land/Markt** als Ansprechperson, mit Vertretung.
- **U-07** (weitere Sprachen): keine Auswahl – bleibt offen.

## Entscheidung

**LanguageTool (G-04)**
- **Betrieb:** LanguageTool 6.x läuft als eigener Java-Prozess (`org.languagetool.server.HTTPServer`) und lauscht nur auf `localhost`.
  - `tools/languagetool` enthält Startskripte für Linux/macOS und Windows, eine `pom.xml`, die LanguageTool über Maven Central holt (wenn die Download-Seite gesperrt ist), und eine Anleitung.
  - Rund 1 GB Arbeitsspeicher.
- **Anbindung:** `LANGUAGETOOL_URL` (z. B. `http://localhost:8081`).
  - Akzeptiert werden nur lokale bzw. interne Adressen; mit einer anderen Adresse gilt der Dienst als nicht eingerichtet, damit Texte das Haus nicht verlassen.
  - Zeitlimit je Anfrage `LANGUAGETOOL_TIMEOUT_MS` (Standard 8 s).
- **Prüfung:** Stilprüfung von Texten und Kapiteln (je Absatz, höchstens 4 Anfragen zugleich).
  - Sprachen: Deutsch (de-DE), Englisch (en-US), de-CH; für andere Sprachen gelten nur die eigenen Regeln.
  - Damit fließen die Funde auch in Kapitelbewertung, Prüferprofil „Redaktion“ und Fehlerliste ein.
- **Markdown:** wird vor dem Senden neutralisiert, ohne Stellen zu verschieben – Auszeichnung, Code, Bilder und Linkziele werden Leerzeichen.
  - Treffer, die nur dadurch entstehen (z. B. „Leerzeichen vor dem Punkt“ nach `**Verträge**.`), entfallen.
  - Regeln, die die eigenen Prüfungen schon abdecken, sind abgeschaltet (z. B. Leerraum, typografische Anführungszeichen).
- **Einordnung:** Kategorie → eigene Regel: Tippfehler → Rechtschreibung, Zeichensetzung, Groß-/Kleinschreibung, Typografie, sonst Grammatik.
  - Meldung „LanguageTool: …“, erste Ersetzung als Korrektur per Klick.
  - Stilhinweise zählen als Hinweis, sonst als Warnung.
  - Erlaubte Begriffe und ausgeschaltete Regeln gelten wie für eigene Funde; meldet eine eigene Regel dieselbe Stelle, zählt der Fund einmal.
- **Zwischenspeicher:** je Text und Sprache (2 000 Einträge).
- **Ohne Dienst:** Ist kein Dienst eingerichtet oder ist er nicht erreichbar, prüft die App nur mit den eigenen Regeln. Das Ergebnis nennt es (`languageTool.used`, `error`); Schreibstil und Einstellungen zeigen den Status.

**Ansprechperson je Markt (O-09)**
- Je Projekt und Markt (Ländercode) eine Ansprechperson (App-Benutzer) mit optionaler Vertretung, auch je Sprache. Der Eintrag mit Sprache geht vor dem für alle Sprachen.
- Pflege unter „Einstellungen“ (Berechtigung „admin“).
- **Länderreview ohne Prüferin:** Es geht an die Ansprechperson des Marktes; die Vertretung wird mit eingetragen.
  - Ist das Konto der Ansprechperson gesperrt, wird die Vertretung Prüferin.
  - Ohne Eintrag meldet die App, dass eine Ansprechperson fehlt.
- **Wer prüfen darf:** Die Vertretung darf wie die Prüferin Fehler erfassen und entscheiden. Wählt die Redaktion die Ansprechperson von Hand, wird die Vertretung ebenfalls eingetragen.
- „Meine Länderreviews“ zeigt offene Reviews, bei denen man Prüferin bzw. Prüfer oder Vertretung ist.

## Begründung
- LanguageTool ist ausgereift, quelloffen (LGPL) und lokal betreibbar; die Entscheidung gegen Docker hält den Betrieb einfach (eine Java-Laufzeit).
- Die Anbindung über die HTTP-API hält die App unabhängig von der LanguageTool-Version; fehlt der Dienst, fällt nichts aus.
- Benutzer als Ansprechpersonen nutzen Berechtigungen, Sperren und Projektzugriffe, die es schon gibt; die Vertretung verhindert, dass Reviews liegen bleiben.

## Folgen
- Migration 061: `market_reviewers`; `translation_reviews.deputy`, `assigned_by`.
- Neue Schnittstellen:
  - `GET /style/language-tool`;
  - `GET`/`PUT /market-reviewers`, `DELETE /market-reviewers/{market}`, `GET /translation-reviews/mine`;
  - `POST /translations/{id}/reviews` ohne `reviewer`.
- Neue Umgebungsvariablen `LANGUAGETOOL_URL`, `LANGUAGETOOL_TIMEOUT_MS`.
- Geprüft mit dem echten LanguageTool 6.6 (Maven Central) unter OpenJDK 21; die automatischen Tests nutzen einen Ersatzdienst mit derselben API.
- Benachrichtigungen an die Ansprechperson gibt es noch nicht (Benachrichtigungen hängen bisher an Kommentaren); sie sieht ihre Reviews unter „Meine Länderreviews“.
- Weiter offen: U-07 (weitere Sprachen und Märkte), Schreibweise offener Begriffe (S-04, entscheidet die Redaktion).
