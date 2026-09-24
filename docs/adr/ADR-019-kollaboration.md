# ADR-019 Kollaboration: Kommentare, Aufgaben, Benachrichtigungen

**Status:** akzeptiert, umgesetzt in Etappe 7

## Entscheidung
- **Diskussionen** (`comments`) an Absätzen, Befunden und Kapiteln. Absatz-Diskussionen hängen an der **Lineage** und bleiben über Neugenerierungen und Kapitelversionen erhalten. Antworten (eine Ebene), Markdown, max. 5 000 Zeichen.
- **@Erwähnungen** über die Benutzerkennung (`@u-redaktion`, `@oidc:…`); berücksichtigt werden nur Personen mit Zugriff auf das Projekt (ADR-014).
- **Aufgaben** sind Kommentare mit Zuständigkeit, optionaler Frist und Status offen/erledigt. Anlegen und Zuweisen erfordert `edit`; erledigen dürfen die zuständige Person und die Redaktion. Kommentieren ist mit Lesezugriff möglich.
- **Benachrichtigungen** (`notifications`) bei Erwähnung, Zuweisung, Antwort und erledigter Aufgabe: immer in der App (Seite „Aufgaben & Hinweise“, Zähler in der Navigation); zusätzlich per **Webhook** (`NOTIFY_WEBHOOK_URL`, JSON mit `text` für gängige Chat-Webhooks) und **E-Mail** (`SMTP_URL`, `MAIL_FROM`, Links mit `APP_URL`). Zustellung über die Jobqueue mit Wiederholung; je Kanal wird der Erfolg gespeichert, damit Wiederholungen nichts doppelt senden.
- E-Mail-Adressen stammen aus dem bestätigten OIDC-Claim `email` (Demo-Benutzer: Adressen unter example.com). Kopfzeilen werden nur aus festen Werten gebildet; nodemailer 10 mit deaktiviertem Datei-/URL-Zugriff.

## Konsequenzen
- Kommentare sind Teil des Audits und werden nicht gelöscht; Text ändern kann nur die verfassende Person.
