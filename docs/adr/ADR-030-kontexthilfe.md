# ADR-030 Kontexthilfe für oneSCM

**Status:** akzeptiert, umgesetzt in Etappe 10

## Kontext
Anwenderinnen und Anwender von oneSCM sollen die passende Handbuchstelle direkt aus der Maske öffnen können – in ihrer Rolle und Sprache, auf Wunsch mit dem Handbuch-Assistenten (ADR-026). Die Hilfe soll ohne zusätzliche Anmeldung funktionieren, darf aber keine unveröffentlichten Inhalte preisgeben.

## Entscheidung
- **Kontext-IDs** (`help_contexts`, Migration `020`): sprechende, stabile Kennungen wie `order.create` (Kleinbuchstaben, Ziffern, `._:-`) verweisen auf ein Kapitel, optional auf einen Abschnitt. Pflege in der Anwendung („Kontexthilfe“) oder im Front-Matter der Quelle (`help_context: [order.create]` → erstes Kapitel der Datei). Manuelle Zuordnungen haben Vorrang und werden von Importen nicht überschrieben.
- **Drei Zugänge:**
  1. **API** `GET /api/v1/context-help/{key}?role&division&language` (angemeldet oder per API-Token, ADR-028): aktuell freigegebene Kapitelversion, gefiltert nach Rolle/Sparte wie der Export, freigegebene Übersetzung oder deutscher Rückfall (`fallback`), fertiges HTML mit eingebetteten Bildern (ADR-029) und Deep-Link.
  2. **Deep-Link** `/hilfe/{key}?role&language` in der Anwendung für angemeldete Nutzer.
  3. **Hilfe-Widget** `/help/widget.js`: Seitenpanel mit iframe auf `/help/embed/{projekt}/{key}`; Elemente mit `data-onescm-help` öffnen die Hilfe per Klick oder F1, Esc schließt und gibt den Fokus zurück.
- **Öffentliche Einbettung nur nach Freischaltung** je Projekt (Administration) und nur mit dem Stand des **neuesten veröffentlichten Releases** (ADR-018) – auch der Assistent im Widget stützt sich ausschließlich auf dessen Kapitelversionen. Nicht freigeschaltet, unbekannt und nicht veröffentlicht sind nicht unterscheidbar (404).
- **Sicherheit der Einbettung:** Seite ohne Skripte (Formular für den Assistenten), eigene CSP `default-src 'none'; img-src data:; form-action 'self'`, `frame-ancestors` nur für die per `HELP_EMBED_ORIGINS` erlaubten Ursprünge; Fragen aus dem Widget unterliegen dem engeren Rate-Limit und werden als `help-widget` protokolliert.

## Konsequenzen
- oneSCM braucht nur Kontext-IDs in seinen Masken; Inhalte bleiben im Handbuch-Workflow (Freigabe, Release).
- Neue Inhalte erscheinen öffentlich erst mit dem nächsten Release – gewollt, damit die eingebettete Hilfe einem geprüften Stand entspricht.
