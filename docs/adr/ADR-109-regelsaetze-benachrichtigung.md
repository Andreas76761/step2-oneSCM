# ADR-109 Zuschaltbare Regelsätze und Benachrichtigung zum Länderreview

**Status:** akzeptiert, umgesetzt in Etappe 56. Umfasst S-06 aus docs/10 und die in ADR-108 offen gebliebene Benachrichtigung der Ansprechperson. Erweitert ADR-040/ADR-097 (Schreibstil) und ADR-108 (Ansprechperson je Markt).

## Kontext
- **S-06:** Die Checkliste nennt regelbasiertes Schreiben (tekom), ASD-STE100 und Vale als zuschaltbare Regelsätze. Die eigenen Regeln der App prüfen Stil und Hausregeln, aber nicht die Struktur von Handlungsanweisungen. Viele Redaktionen pflegen ihre Regeln bereits als Vale-Stil (YAML).
- **Benachrichtigung:** Seit Etappe 55 geht ein Länderreview automatisch an die Ansprechperson des Marktes. Erfahren hat sie davon nur über „Meine Länderreviews“.

Für keinen der beiden Punkte stand eine Entscheidung aus. Die Empfehlung „später“ in docs/10 bezog sich auf den Aufwand.

## Entscheidung

**Regelsätze (S-06)**
- Regelsätze gelten je Projekt und lassen sich unter „Schreibstil › Regeln“ ein- und ausschalten (Berechtigung „admin“); jede Regel eines Satzes ist einzeln abschaltbar.
- Ein Satz gilt für Texte seiner Sprache: Der Sprachcode wird auf die Grundsprache verkürzt, de-CH zählt also als Deutsch.
- Die Funde zählen als Regel „Regelsatz“ (Meldung „Satzname: …“, Herkunft `source: { set, rule }`). Sie gehen ein in Schreibstil, Kapitelprüfung, Kapitelbewertung, Prüferprofil „Redaktion“ und Fehlerliste (Kategorie „Stil und Tonalität“).
- „Regelsatz“ lässt sich wie jede eigene Regel ganz ausschalten.
- **Regelbasiertes Schreiben** (Deutsch, nach dem Vorbild der tekom-Leitlinie, eigene Formulierung der Regeln):
  - eine Handlung je Schritt;
  - Bedingung vor Handlung;
  - direkt auffordern statt Modalverb;
  - Schritte höchstens 20 Wörter;
  - genau verweisen statt „siehe oben“;
  - keine doppelte Verneinung;
  - keine Klammern in Schritten.
- **Simplified Technical English** (Englisch, Schreibregeln von ASD-STE100):
  - Anweisungen höchstens 20 Wörter, beschreibende Sätze höchstens 25;
  - eine Anweisung je Satz;
  - Aktiv statt Passiv;
  - keine -ing-Formen;
  - keine „should/could/may/might“ in Anweisungen;
  - Absätze höchstens sechs Sätze.

  Das kontrollierte Wörterbuch von ASD-STE100 ist urheberrechtlich geschützt und nicht enthalten. Eigene Wortlisten lassen sich als Vale-Stil ergänzen.
- **Vale-Stile:** Einlesen als YAML-Dateien oder als ZIP mit dem Stilordner; eine Datei je Regel, der Name ist der Dateiname. Gleicher Name ersetzt den Stil.
  - Unterstützt: `existence`, `substitution` (erste Ersetzung als Korrektur per Klick) und `occurrence` (je Satz). Ausgewertet werden `message` (mit `%s`), `level` (suggestion = Hinweis, sonst Warnung), `ignorecase` und `nonword`.
  - Andere Regeltypen (z. B. `spelling`, `conditional`) und unsichere Muster werden mit Grund als „nicht übernommen“ genannt:
    - Rückverweise und Lookbehind gibt es in Vale (RE2) nicht;
    - verschachtelte Wiederholungen wie `(a+)+` können sehr langsam werden.
  - Grenzen: höchstens 300 Dateien zu je 64 KB, 500 Muster je Regel, 300 Zeichen je Muster.
  - Code (`` `…` ``) und Linkziele werden nicht geprüft.
- Alles läuft in der App; kein Vale-Programm, kein Netz.

**Benachrichtigung zum Länderreview**
- Beim Anfordern erhalten die Prüferin bzw. der Prüfer und die Vertretung einen Hinweis unter „Aufgaben & Hinweise“ (Typ `review_assigned`). Ist ein Webhook bzw. E-Mail eingerichtet, geht er auch über diese Kanäle.
- Nach der Entscheidung („vom Land freigegeben“ bzw. „zurück an Übersetzung“) erhält die anfordernde Person einen Hinweis (`review_decided`).
- Hinweise an sich selbst entfallen.
- Der Link öffnet „Übersetzungen“ mit Kapitel und Übersetzung (`/uebersetzungen?kapitel=…&uebersetzung=…`); „Meine Länderreviews“ springt ebenso direkt dorthin.

## Begründung
- Eigene Umsetzung statt Vale-Programm: keine weitere Laufzeit, Funde mit Stellen und Korrektur wie die übrigen Regeln, Daten bleiben in der App.
- Die drei Vale-Regeltypen decken die üblichen Wort- und Ersetzungslisten ab; was nicht passt, wird offen genannt statt still ignoriert.
- Hinweise nutzen den bestehenden Posteingang mit seinen Zustellkanälen (ADR-025, ADR-064).

## Folgen
- Migration 062: `style_rule_sets` (mitgelieferte Sätze erst nach der ersten Änderung, Vale-Stile mit Regeln und nicht übernommenen Regeln).
- Neue Schnittstellen: `GET /style/rule-sets`, `PATCH`/`DELETE /style/rule-sets/{key}`, `POST /style/rule-sets/vale`; `GET /translation-reviews/mine` liefert `chapterId`.
- Neue Stilregel `rule_set` („Regelsatz“).
- Weiter offen: U-07 (weitere Sprachen und Märkte), Schreibweise offener Begriffe (S-04, entscheidet die Redaktion).
