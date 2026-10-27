// Muster der Designvorlagen (ADR-112) mit fiktiven Inhalten – zeigt Aufbau und Gestaltung, ohne Daten eines Projekts.
import type { DesignChapter } from './designs.js';

/** Platzhalter-Sha für Muster-Bildschirmfotos (kein echtes Medium) */
export const SAMPLE_SHA = 'f'.repeat(64);

/** Neutrales Bildschirmfoto als SVG (Kopfleiste, Formularfelder, Schaltfläche) */
export function sampleScreenshot(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270" viewBox="0 0 480 270">
<rect width="480" height="270" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
<rect width="480" height="34" rx="8" fill="#1f2937"/><rect y="26" width="480" height="8" fill="#1f2937"/>
<circle cx="18" cy="17" r="5" fill="#94a3b8"/><rect x="32" y="12" width="70" height="10" rx="3" fill="#94a3b8"/>
<rect x="24" y="54" width="180" height="12" rx="3" fill="#334155"/>
<rect x="24" y="80" width="200" height="30" rx="4" fill="#fff" stroke="#cbd5e1"/><rect x="34" y="91" width="90" height="8" rx="2" fill="#cbd5e1"/>
<rect x="240" y="80" width="216" height="30" rx="4" fill="#fff" stroke="#cbd5e1"/><rect x="250" y="91" width="110" height="8" rx="2" fill="#cbd5e1"/>
<rect x="24" y="124" width="432" height="30" rx="4" fill="#fff" stroke="#cbd5e1"/><rect x="34" y="135" width="150" height="8" rx="2" fill="#cbd5e1"/>
<rect x="24" y="170" width="432" height="56" rx="4" fill="#eef2f7"/><rect x="36" y="184" width="240" height="8" rx="2" fill="#94a3b8"/><rect x="36" y="200" width="180" height="8" rx="2" fill="#cbd5e1"/>
<rect x="360" y="236" width="96" height="24" rx="4" fill="#2563eb"/><rect x="378" y="245" width="60" height="6" rx="2" fill="#fff"/>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

const IMG = (alt: string) => `![${alt}](media:${SAMPLE_SHA})`;

export const SAMPLE_QUICKREF: { title: string; chapters: DesignChapter[]; links: string; faq: { question: string; answer: string }[]; footer: string } = {
  title: 'oneSCM – Servicevertrag anlegen und verwalten',
  footer: 'Im Beispiel wird ein Vertrag für einen gewerblichen Kunden angelegt; Abweichungen für Privatkunden sind gekennzeichnet.',
  chapters: [
    {
      title: 'Vertrag anlegen',
      sections: [
        { code: 'prerequisites', title: 'Anmeldung in oneSCM', blocks: [
          { kind: 'paragraph', text: `${IMG('Startseite von oneSCM')}\nRufen Sie oneSCM über das [Händlerportal](https://portal.example.org) oder die [Direktverlinkung](https://onescm.example.org) auf.` },
          { kind: 'note', text: 'Bei fehlenden oder falschen Berechtigungen wenden Sie sich an die Administration Ihres Betriebs (Rolle **oneSCM.Händler**).' },
        ] },
        { code: 'steps', title: 'Schritte', blocks: [
          { kind: 'list', text: `1. Klicken Sie auf **Vertrag erstellen**.\n2. Wählen Sie die **Kundengruppe** und geben Sie den passenden Einstiegspunkt an, um die Fahrzeugdaten zu laden:\n   - für eine Preisindikation: **Baumuster**\n   - ab Angebot: **Angebotsnummer**\n   - ab Produktion: **FIN**\n3. Ergänzen Sie die **Erstzulassung**, die **aktuelle Laufleistung** oder das **Kennzeichen**. ${IMG('Fahrzeugdaten')}\n4. Wählen Sie im nächsten Abschnitt das **Servicepaket** aus.\n5. Konfigurieren Sie **Zahlungsintervall**, **Vertragsdauer** und **jährliche Laufleistung**.` },
          { kind: 'warning', text: 'Das **Zahlungsintervall** kann nachträglich nur auf **„einmalig“** geändert werden; andere Änderungen erfordern einen neuen Vertrag.' },
          { kind: 'list', text: '6. Fügen Sie bei Bedarf **technische Optionen** und **zusätzliche Leistungen** hinzu.\n7. Wählen Sie aktive **Kampagnen** und eigene **Händlerrabatte**. Prüfen Sie anhand der Beschreibung die Berechtigung für die Kampagne.\n8. Prüfen Sie im Abschnitt **Zahlungsplan** die Vertragsdetails und erzeugen Sie bei Bedarf eine **Vorschau (PDF)**.' },
        ] },
        { code: 'result', title: 'Ergebnis', blocks: [{ kind: 'paragraph', text: 'Der Vertrag ist angelegt und wartet auf die Unterschrift des Kunden. Die Unterlagen finden Sie unter **Vertragsverwaltung**.' }] },
      ],
    },
    {
      title: 'Vertrag verwalten',
      sections: [
        { code: 'steps', title: 'Schritte', blocks: [
          { kind: 'list', text: `1. Klicken Sie unter **Vertragserstellung** auf **Vertragsverwaltung**.\n2. Suchen Sie den Vertrag über die **Referenznummer** und wählen Sie unter **Aktionen** den Eintrag **Aktualisieren**. ${IMG('Vertragsverwaltung')}\n3. Tragen Sie **Erstzulassungsdatum** und **Kennzeichen** ein.\n4. Laden Sie unter **Kommunikation** die Kopie des Fahrzeugscheins hoch.` },
          { kind: 'warning', text: 'Ohne hochgeladenen **Fahrzeugschein** wird der Vertrag **nicht aktiviert**, obwohl das Feld kein Pflichtfeld ist.' },
          { kind: 'tip', text: 'Über das Suchfeld finden Sie Verträge auch über das Kennzeichen.' },
        ] },
      ],
    },
  ],
  links: '- **Händlerportal** – Neuigkeiten zum System, [hier](https://portal.example.org).\n- **Schulungsmaterial** – Videos, häufige Fragen und ausführliche Anleitungen, [hier](https://schulung.example.org).\n- **Hilfe zum Servicevertrag**: [servicevertrag@example.org](mailto:servicevertrag@example.org)',
  faq: [
    { question: 'Wie lange nach der Erstzulassung kann ein Servicevertrag abgeschlossen werden?', answer: 'Bis zu 12 Monate bzw. 50.000 km nach Erstzulassung, sofern das Fahrzeug noch keinen Service erhalten hat.' },
    { question: 'Kann ein Vertrag für Vorführwagen abgeschlossen werden?', answer: 'Vorführwagen gelten als Gebrauchtfahrzeuge; für sie ist nur ein reines Wartungspaket möglich.' },
  ],
};

export const SAMPLE_FACHDOKU: { title: string; chapters: DesignChapter[]; footer: string; docLabel: string } = {
  title: 'Kapitel 4: Vertragsberechnung',
  docLabel: 'oneSCM Fachdokumentation',
  footer: 'oneSCM · Fach- und Handbuchdokumentation (Muster)',
  chapters: [
    {
      title: 'Kapitel 4: Vertragsberechnung',
      versionNo: 3, approvedAt: '2026-10-20T10:00:00Z', validFrom: '2026.4',
      sections: [
        { code: 'purpose', title: 'Einleitung und fachlicher Auftrag', blocks: [
          { kind: 'paragraph', text: 'Mit diesem Kapitel verstehen Sie, wie oneSCM den Preis eines Servicevertrags berechnet – vom Basispreis aus der Preismatrix bis zum Endpreis mit Rabatten und Steuer.' },
          { kind: 'note', text: '**Zielbild:** Händler und Vertrieb wählen jederzeit die passende, geprüfte Tarifoption für das Fahrzeug des Kunden.' },
          { kind: 'paragraph', text: '### Kernaufgaben\n- **Produktverwaltung:** Lebenszyklus der Serviceprodukte (Wartung, Verschleiß, Garantie).\n- **Preismatrizen:** Tarife nach Fahrzeuggruppe, Laufzeit und Laufleistung.\n- **Kampagnen:** Aktionsrabatte mit Gültigkeitszeitraum.' },
        ] },
        { code: 'concept', title: 'Preismatrix und Fahrzeuggruppen', blocks: [
          { kind: 'paragraph', text: 'Innerhalb einer Fahrzeuggruppe spannt oneSCM eine Tabelle aus Laufzeit und Gesamtlaufleistung auf (fiktive Werte in Euro netto):' },
          { kind: 'table', text: '| Laufleistung \\ Laufzeit | 12 Monate | 24 Monate | 36 Monate |\n|---|---|---|---|\n| 15.000 km | 240,00 € | 480,00 € | 720,00 € |\n| 30.000 km | 350,00 € | 710,00 € | 1.080,00 € |\n| 45.000 km | 490,00 € | 980,00 € | 1.480,00 € |' },
          { kind: 'tip', text: '**Wichtig:** Sobald eine Preisversion veröffentlicht ist, sind preisrelevante Angaben gesperrt; für Änderungen legen Sie eine neue Preisversion an.' },
        ] },
        { code: 'steps', title: 'Ablauf der Berechnung', blocks: [
          { kind: 'list', text: '1. **Basispreis** aus der Preismatrix ermitteln.\n2. **Optionen** und **technische Zuschläge** aufschlagen.\n3. **Händlerprovision** ergänzen – Ergebnis ist der **Listenpreis**.\n4. **Kampagnen-** und **Händlerrabatt** abziehen.\n5. **Mehrwertsteuer** aufschlagen – Ergebnis ist der **Endpreis**.' },
          { kind: 'code', text: '```\n[Entwurf] ──(Einreichen)──> [Erstellt] ──(Preis zugewiesen)──> [Bereit]\n                                                       │\n                                                 (Veröffentlichen)\n                                                       ▼\n[Archiviert] <──(Deaktivieren)──────────────── [Veröffentlicht]\n```' },
          { kind: 'warning', text: '**Ausschlusskriterium:** Ist für das Fahrzeug bereits eine Vertragsleistung erfasst, sperrt oneSCM die Vertragserstellung mit dem Hinweis „Fahrzeug nicht berechtigt“.' },
        ] },
        { code: 'result', title: 'Ergebnis und Zahlungsintervalle', blocks: [
          { kind: 'table', text: '| Intervall | Code | Aufschlag | Typischer Einsatz |\n|---|---|---|---|\n| Einmalzahlung | `ONE_TIME` | 0,0 % | Barkauf |\n| Jährlich | `YEARLY` | + 1,0 % | Flotten |\n| Monatlich | `MONTHLY` | + 3,0 % | Privatkunden |' },
          { kind: 'xref', text: 'Kapitel 5: Vertragsunterzeichnung' },
        ] },
      ],
    },
  ],
};
