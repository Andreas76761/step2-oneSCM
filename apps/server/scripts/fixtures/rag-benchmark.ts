// Fiktiver Messbestand für die RAG-Komponente (ADR-099): kleine oneSCM-ähnliche Wissensbasis mit typischen Schwierigkeiten –
// Synonyme (Händler/Dealer), Komposita (Kündigungsfrist/Vertragskündigung), Abkürzungen (MO, FIN), Fehlercodes und
// Ticketnummern, englische Fragen auf deutsche Quellen, Dubletten älterer Fassungen und Lückenfragen ohne Antwort.
// Alle Inhalte sind erfunden; keine echten Personen, Fahrzeuge oder Kundendaten.

const FM = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n';

export const BENCH_DOCS: { name: string; text: string }[] = [
  { name: 'vertraege.md', text: `${FM}# 3. Vertragsverwaltung

## 3.1 Vertrag anlegen

Öffnen Sie **Contracts › New Contract**. Wählen Sie den Kunden und die Laufzeit aus. Die Laufzeit beträgt zwölf bis 60 Monate. Speichern Sie mit **Save**; der Vertrag erhält den Status „Entwurf“.

## 3.2 Vertrag kündigen

Ein aktiver Vertrag kann mit einer Frist von 30 Tagen zum Monatsende gekündigt werden. Öffnen Sie den Vertrag, wählen Sie **Terminate** und geben Sie den Kündigungsgrund an. Nach der Bestätigung wechselt der Status zu „gekündigt“.

## 3.3 Vertrag verlängern

Vor Ablauf der Laufzeit bietet das System eine Verlängerung an. Die Verlängerung übernimmt die bisherigen Konditionen; geänderte Preise müssen neu freigegeben werden.

## 3.4 Vertragsstatus

Ein Vertrag durchläuft die Status Entwurf, Prüfung, aktiv, gekündigt und abgelaufen. Nur aktive Verträge erzeugen Rechnungen.
` },
  { name: 'vertraege_2024_alt.md', text: `${FM}# 3. Vertragsverwaltung

## 3.2 Vertrag kündigen

Ein aktiver Vertrag kann mit einer Frist von 30 Tagen zum Monatsende gekündigt werden. Öffnen Sie den Vertrag, wählen Sie **Terminate** und geben Sie den Kündigungsgrund an. Nach der Bestätigung wechselt der Status zu „gekündigt“.

## 3.5 Vertragsvorlagen

Vorlagen legen Standardlaufzeit, Zahlungsweise und Leistungsumfang fest. Neue Vorlagen erstellt die Zentrale.
` },
  { name: 'antraege.md', text: `${FM}# 4. Anträge

## 4.1 Antrag stellen

Der Dealer stellt einen Antrag (Proposal) über **Proposals › Create**. Pflichtfelder sind Kunde, Fahrzeugmodell und gewünschter Starttermin.

## 4.2 Antrag prüfen

Die Market Operation prüft jeden Antrag innerhalb von drei Werktagen. Die Prüfung umfasst Bonität, Preisgestaltung und Vollständigkeit der Unterlagen.

## 4.3 Antrag ablehnen

Wird ein Antrag abgelehnt, erhält der Dealer eine Benachrichtigung mit dem Ablehnungsgrund. Der Antrag kann korrigiert und erneut eingereicht werden.

## 4.4 Antrag zurückziehen

Solange die Prüfung nicht begonnen hat, kann der Dealer den Antrag zurückziehen. Danach ist nur noch eine Ablehnung durch die Prüfung möglich.
` },
  { name: 'abrechnung.md', text: `${FM}# 6. Abrechnung

## 6.1 Rechnungen

Für jeden aktiven Vertrag erstellt das System monatlich eine Rechnung. Das Zahlungsziel beträgt 14 Tage nach Rechnungsdatum.

## 6.2 Gutschriften

Eine Gutschrift wird erstellt, wenn eine Rechnung storniert oder ein Betrag erstattet wird. Gutschriften gibt die Buchhaltung frei.

## 6.3 Fehlermeldungen

Die Meldung E-4711 bedeutet, dass für den Vertrag keine gültige Bankverbindung hinterlegt ist. Ergänzen Sie die Bankverbindung unter **Customer › Payment** und starten Sie die Abrechnung erneut. Die Meldung E-4712 bedeutet, dass der Abrechnungszeitraum bereits abgeschlossen ist.
` },
  { name: 'rollen.md', text: `${FM}# 2. Rollen und Berechtigungen

## 2.1 Dealer

Der Dealer legt Verträge und Anträge an, sieht nur die eigenen Kunden und darf Verträge kündigen. Preise freigeben darf er nicht.

## 2.2 MO

Die Market Operation (MO) prüft und genehmigt Anträge und gibt geänderte Preise frei. Sie sieht alle Verträge ihres Marktes.

## 2.3 HQ

Die Zentrale (HQ) pflegt Vorlagen, Produkte und Preislisten für alle Märkte.
` },
  { name: 'anmeldung.md', text: `${FM}# 1. Erste Schritte

## 1.1 Anmeldung

Melden Sie sich mit Ihrer Benutzerkennung und dem Einmalcode aus der Authenticator-App an. Nach drei Fehlversuchen wird das Konto für 15 Minuten gesperrt.

## 1.2 Passwort zurücksetzen

Wählen Sie auf der Anmeldeseite **Forgot password**. Sie erhalten einen Link, der 24 Stunden gültig ist.
` },
  { name: 'jira/ONESCM-1234.md', text: `---\nevidence_status: unconfirmed\nsource_type: jira\n---\n# Jira-Tickets

## ONESCM-1234 Kündigungsgrund als Pflichtfeld

| Feld | Wert |
|---|---|
| Ticket | ONESCM-1234 |
| Status | Fertig |

### Beschreibung

Beim Kündigen eines Vertrags wird der Kündigungsgrund zum Pflichtfeld. Zur Auswahl stehen Fahrzeugwechsel, Umzug, Unzufriedenheit und Sonstiges.
` },
  { name: 'faq.md', text: `${FM}# 9. Häufige Fragen

## 9.1 Fahrzeugdaten

Die FIN wird beim Anlegen des Vertrags aus dem Fahrzeugbestand übernommen und kann danach nicht mehr geändert werden.

## 9.2 Druck

Verträge lassen sich als PDF drucken. Der Druck enthält alle Konditionen und die Unterschriftenfelder.
` },
  { name: 'reporting.md', text: `${FM}# 8. Auswertungen

## 8.1 Vertragsübersicht

Die Vertragsübersicht zeigt alle Verträge mit Status, Laufzeit und Restlaufzeit. Sie lässt sich nach Markt und Status filtern und als Excel-Datei exportieren.

## 8.2 Kündigungsquote

Die Kündigungsquote ist der Anteil der im Monat gekündigten Verträge an allen aktiven Verträgen.
` },
  { name: 'schulung.md', text: `${FM}# 10. Schulung

## 10.1 Schulungsangebot

Neue Anwenderinnen und Anwender besuchen eine zweistündige Online-Schulung. Termine stehen im Schulungskalender.
` },
];

/** Begriffe: Synonyme (zu vermeiden) und Übersetzungen – Grundlage der Abfrageerweiterung */
export const BENCH_TERMS: { preferred: string; avoid: string[]; translations?: Record<string, string> }[] = [
  { preferred: 'Dealer', avoid: ['Händler'], translations: { en: 'dealer' } },
  { preferred: 'Vertrag', avoid: ['Kontrakt'], translations: { en: 'contract' } },
  { preferred: 'kündigen', avoid: ['beenden', 'stornieren'], translations: { en: 'terminate' } },
  { preferred: 'Antrag', avoid: ['Proposal', 'Anfrage'], translations: { en: 'proposal' } },
  { preferred: 'Rechnung', avoid: ['Faktura'], translations: { en: 'invoice' } },
  { preferred: 'Zahlungsziel', avoid: ['Zahlungsfrist'], translations: { en: 'payment term' } },
];
export const BENCH_ABBREVIATIONS: { abbreviation: string; expansion: string }[] = [
  { abbreviation: 'MO', expansion: 'Market Operation' },
  { abbreviation: 'HQ', expansion: 'Zentrale' },
  { abbreviation: 'FIN', expansion: 'Fahrzeug-Identifizierungsnummer' },
];

export type BenchKind = 'direkt' | 'umschreibung' | 'synonym' | 'kompositum' | 'abkuerzung' | 'kennung' | 'englisch' | 'luecke';
export interface BenchQuestion { q: string; kind: BenchKind; path?: string; heading?: string; keywords?: string[]; language?: 'de' | 'en' }

export const BENCH_QUESTIONS: BenchQuestion[] = [
  { q: 'Wie lege ich einen Vertrag an?', kind: 'direkt', path: 'vertraege.md', heading: 'Vertrag anlegen', keywords: ['New Contract'] },
  { q: 'Mit welcher Frist kann ein Vertrag gekündigt werden?', kind: 'direkt', path: 'vertraege', heading: 'Vertrag kündigen', keywords: ['30 Tagen'] },
  { q: 'Wie lange ist das Zahlungsziel einer Rechnung?', kind: 'direkt', path: 'abrechnung.md', heading: 'Rechnungen', keywords: ['14 Tage'] },
  { q: 'Wer gibt Gutschriften frei?', kind: 'direkt', path: 'abrechnung.md', heading: 'Gutschriften', keywords: ['Buchhaltung'] },
  { q: 'Welche Status durchläuft ein Vertrag?', kind: 'direkt', path: 'vertraege.md', heading: 'Vertragsstatus', keywords: ['abgelaufen'] },
  { q: 'Wie setze ich mein Passwort zurück?', kind: 'direkt', path: 'anmeldung.md', heading: 'Passwort', keywords: ['Forgot password'] },
  { q: 'Wann wird das Konto gesperrt?', kind: 'direkt', path: 'anmeldung.md', heading: 'Anmeldung', keywords: ['drei Fehlversuchen'] },
  { q: 'Welche Pflichtfelder hat ein Antrag?', kind: 'direkt', path: 'antraege.md', heading: 'Antrag stellen', keywords: ['Fahrzeugmodell'] },

  { q: 'Wie viel Zeit bleibt, um eine Rechnung zu bezahlen?', kind: 'umschreibung', path: 'abrechnung.md', heading: 'Rechnungen', keywords: ['14 Tage'] },
  { q: 'Wie lange dauert es, bis ein Antrag geprüft ist?', kind: 'umschreibung', path: 'antraege.md', heading: 'Antrag prüfen', keywords: ['drei Werktagen'] },
  { q: 'Was passiert, wenn mein Antrag nicht genehmigt wird?', kind: 'umschreibung', path: 'antraege.md', heading: 'Antrag ablehnen', keywords: ['Ablehnungsgrund'] },
  { q: 'Kann ich einen eingereichten Antrag wieder zurücknehmen?', kind: 'umschreibung', path: 'antraege.md', heading: 'zurückziehen', keywords: ['Prüfung'] },
  { q: 'Wie lange gilt der Link zum Zurücksetzen?', kind: 'umschreibung', path: 'anmeldung.md', heading: 'Passwort', keywords: ['24 Stunden'] },

  { q: 'Was darf ein Händler?', kind: 'synonym', path: 'rollen.md', heading: 'Dealer', keywords: ['eigenen Kunden'] },
  { q: 'Wie beende ich einen Vertrag?', kind: 'synonym', path: 'vertraege', heading: 'Vertrag kündigen', keywords: ['Terminate'] },
  { q: 'Wie lange ist die Zahlungsfrist?', kind: 'synonym', path: 'abrechnung.md', heading: 'Rechnungen', keywords: ['14 Tage'] },
  { q: 'Wer prüft eine Anfrage des Händlers?', kind: 'synonym', path: 'antraege.md', heading: 'Antrag prüfen', keywords: ['Market Operation'] },

  { q: 'Wie lang ist die Kündigungsfrist?', kind: 'kompositum', path: 'vertraege', heading: 'Vertrag kündigen', keywords: ['30 Tagen'] },
  { q: 'Was zeigt die Vertragsübersicht?', kind: 'kompositum', path: 'reporting.md', heading: 'Vertragsübersicht', keywords: ['Restlaufzeit'] },
  { q: 'Wie wird die Vertragsverlängerung gemacht?', kind: 'kompositum', path: 'vertraege.md', heading: 'verlängern', keywords: ['Konditionen'] },
  { q: 'Welche Gründe gibt es bei der Vertragskündigung?', kind: 'kompositum', path: 'ONESCM-1234', keywords: ['Umzug'] },
  { q: 'Was regelt eine Vorlage für Verträge?', kind: 'kompositum', path: 'vertraege_2024_alt.md', heading: 'Vertragsvorlagen', keywords: ['Zahlungsweise'] },

  { q: 'Was macht die MO?', kind: 'abkuerzung', path: 'rollen.md', heading: 'MO', keywords: ['genehmigt'] },
  { q: 'Kann die FIN geändert werden?', kind: 'abkuerzung', path: 'faq.md', heading: 'Fahrzeugdaten', keywords: ['nicht mehr geändert'] },
  { q: 'Was pflegt das HQ?', kind: 'abkuerzung', path: 'rollen.md', heading: 'HQ', keywords: ['Preislisten'] },

  { q: 'Was bedeutet E-4711?', kind: 'kennung', path: 'abrechnung.md', heading: 'Fehlermeldungen', keywords: ['Bankverbindung'] },
  { q: 'Was bedeutet Fehler E-4712?', kind: 'kennung', path: 'abrechnung.md', heading: 'Fehlermeldungen', keywords: ['abgeschlossen'] },
  { q: 'Was ändert ONESCM-1234?', kind: 'kennung', path: 'ONESCM-1234', keywords: ['Pflichtfeld'] },

  { q: 'How do I terminate a contract?', kind: 'englisch', path: 'vertraege', heading: 'Vertrag kündigen', keywords: ['Terminate'], language: 'en' },
  { q: 'What is the payment term of an invoice?', kind: 'englisch', path: 'abrechnung.md', heading: 'Rechnungen', keywords: ['14 Tage'], language: 'en' },
  { q: 'Who reviews a proposal?', kind: 'englisch', path: 'antraege.md', heading: 'Antrag prüfen', keywords: ['Market Operation'], language: 'en' },

  { q: 'Wie exportiere ich Verträge nach SAP?', kind: 'luecke' },
  { q: 'Wie hoch ist die Provision des Dealers?', kind: 'luecke' },
  { q: 'Welche Versicherung ist im Vertrag enthalten?', kind: 'luecke' },
  { q: 'Wie ändere ich die Sprache der Oberfläche?', kind: 'luecke' },
  { q: 'Wie viele Fahrzeuge darf ein Kunde leasen?', kind: 'luecke' },
];

/**
 * Prüfsatz (zurückgehalten): nach der Abstimmung von v2 geschrieben und nicht zum Einstellen verwendet –
 * zeigt, ob die Verbesserung über die Abstimmungsfragen hinaus trägt.
 */
export const BENCH_HOLDOUT: BenchQuestion[] = [
  { q: 'Welche Laufzeit kann ein Vertrag haben?', kind: 'direkt', path: 'vertraege.md', heading: 'Vertrag anlegen', keywords: ['60 Monate'] },
  { q: 'Wie oft wird eine Rechnung erstellt?', kind: 'direkt', path: 'abrechnung.md', heading: 'Rechnungen', keywords: ['monatlich'] },
  { q: 'Wie lange ist ein gesperrtes Konto gesperrt?', kind: 'direkt', path: 'anmeldung.md', heading: 'Anmeldung', keywords: ['15 Minuten'] },
  { q: 'Wer erstellt neue Vertragsvorlagen?', kind: 'kompositum', path: 'vertraege_2024_alt.md', heading: 'Vertragsvorlagen', keywords: ['Zentrale'] },
  { q: 'Welche Verträge erzeugen Rechnungen?', kind: 'direkt', path: 'vertraege.md', heading: 'Vertragsstatus', keywords: ['aktive'] },
  { q: 'Was brauche ich für die Anmeldung?', kind: 'umschreibung', path: 'anmeldung.md', heading: 'Anmeldung', keywords: ['Einmalcode'] },
  { q: 'Was muss bei geänderten Preisen beachtet werden?', kind: 'umschreibung', path: 'vertraege.md', heading: 'verlängern', keywords: ['freigegeben'] },
  { q: 'Wie wird eine Rechnung storniert?', kind: 'umschreibung', path: 'abrechnung.md', heading: 'Gutschriften', keywords: ['Gutschrift'] },
  { q: 'Welche Kunden sieht ein Händler?', kind: 'synonym', path: 'rollen.md', heading: 'Dealer', keywords: ['eigenen Kunden'] },
  { q: 'Kann ein Autohaus Preise freigeben?', kind: 'synonym', path: 'rollen.md', heading: 'Dealer', keywords: ['nicht'] },
  { q: 'Was zeigt die Kündigungsquote?', kind: 'kompositum', path: 'reporting.md', heading: 'Kündigungsquote', keywords: ['Anteil'] },
  { q: 'Wann ist der Abrechnungszeitraum abgeschlossen?', kind: 'kompositum', path: 'abrechnung.md', heading: 'Fehlermeldungen', keywords: ['E-4712'] },
  { q: 'Lässt sich die Vertragsübersicht exportieren?', kind: 'kompositum', path: 'reporting.md', heading: 'Vertragsübersicht', keywords: ['Excel'] },
  { q: 'Welche Verträge sieht die MO?', kind: 'abkuerzung', path: 'rollen.md', heading: 'MO', keywords: ['ihres Marktes'] },
  { q: 'Woher kommt die FIN im Vertrag?', kind: 'abkuerzung', path: 'faq.md', heading: 'Fahrzeugdaten', keywords: ['Fahrzeugbestand'] },
  { q: 'Wie behebe ich E-4711?', kind: 'kennung', path: 'abrechnung.md', heading: 'Fehlermeldungen', keywords: ['Bankverbindung'] },
  { q: 'Can I print a contract?', kind: 'englisch', path: 'faq.md', heading: 'Druck', keywords: ['PDF'], language: 'en' },
  { q: 'How long does the dealer have to pay an invoice?', kind: 'englisch', path: 'abrechnung.md', heading: 'Rechnungen', keywords: ['14 Tage'], language: 'en' },
  { q: 'Wie melde ich mich mit Fingerabdruck an?', kind: 'luecke' },
  { q: 'Welche Rabatte bekommt ein Großkunde?', kind: 'luecke' },
  { q: 'Wie storniere ich eine Schulung?', kind: 'luecke' },
  { q: 'Wie lange dauert die Lieferung eines Fahrzeugs?', kind: 'luecke' },
];
