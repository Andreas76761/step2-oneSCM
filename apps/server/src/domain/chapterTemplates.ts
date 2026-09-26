// Kapitelvorlagen für den Assistenten (ADR-055): typische Aufgaben eines Benutzerhandbuchs mit bewährtem Aufbau.
// „…“ markiert Stellen, die mit der konkreten Aufgabe zu füllen sind (der Anleitungs-Check meldet offene Platzhalter).
export interface ChapterTemplate {
  id: string;
  name: string;
  description: string;
  titleHint: string;
  purpose: string;
  prerequisites: string[];
  steps: string[];
  result: string;
  hints: string[];
}

export const CHAPTER_TEMPLATES: ChapterTemplate[] = [
  {
    id: 'create', name: 'Datensatz anlegen', description: 'Etwas Neues erfassen und speichern, z. B. einen Vertrag, Artikel oder Kunden.',
    titleHint: '… anlegen',
    purpose: 'Mit dieser Anleitung legen Sie … an. Sie benötigen sie, wenn …',
    prerequisites: ['Sie haben die Berechtigung „…“', 'Die Stammdaten … sind angelegt'],
    steps: ['Öffnen Sie **… › …**', 'Klicken Sie auf **Neu**', 'Füllen Sie die Pflichtfelder … aus', 'Klicken Sie auf **Speichern**'],
    result: 'Der neue Eintrag ist gespeichert und erscheint in der Liste …',
    hints: ['Pflichtfelder sind mit * gekennzeichnet'],
  },
  {
    id: 'approve', name: 'Prüfen und genehmigen', description: 'Einen Vorgang prüfen und genehmigen oder zurückweisen.',
    titleHint: '… prüfen und genehmigen',
    purpose: 'Mit dieser Anleitung prüfen Sie … und genehmigen oder weisen es zurück.',
    prerequisites: ['Sie haben die Berechtigung „…“', 'Der Vorgang hat den Status „…“'],
    steps: ['Öffnen Sie die Arbeitsliste **…**', 'Wählen Sie den Vorgang aus', 'Prüfen Sie …', 'Klicken Sie auf **Genehmigen** oder **Zurückweisen**'],
    result: 'Der Vorgang erhält den Status „…“ und …',
    hints: ['Beim Zurückweisen geben Sie einen Grund an – er wird dem Absender angezeigt'],
  },
  {
    id: 'search', name: 'Suchen und filtern', description: 'Einträge finden, eingrenzen und das Ergebnis weiterverwenden.',
    titleHint: '… suchen',
    purpose: 'Mit dieser Anleitung finden Sie … schnell über Suche und Filter.',
    prerequisites: ['Sie haben Lesezugriff auf …'],
    steps: ['Öffnen Sie **… › …**', 'Geben Sie im Suchfeld … ein', 'Grenzen Sie die Liste über **Filter** ein', 'Öffnen Sie den gewünschten Eintrag per Klick'],
    result: 'Die Liste zeigt nur die passenden Einträge; der gewählte Eintrag ist geöffnet.',
    hints: ['Gespeicherte Filter finden Sie unter **…**'],
  },
  {
    id: 'change', name: 'Einstellung ändern', description: 'Eine Einstellung oder einen bestehenden Eintrag ändern.',
    titleHint: '… ändern',
    purpose: 'Mit dieser Anleitung ändern Sie …. Die Änderung gilt ab sofort für …',
    prerequisites: ['Sie haben die Berechtigung „…“'],
    steps: ['Öffnen Sie **… › …**', 'Klicken Sie auf **Bearbeiten**', 'Ändern Sie …', 'Klicken Sie auf **Speichern**'],
    result: 'Die neue Einstellung ist gespeichert und wirkt ab …',
    hints: ['Frühere Werte sehen Sie in der **Historie**'],
  },
  {
    id: 'troubleshoot', name: 'Fehler beheben', description: 'Eine Fehlermeldung verstehen und das Problem lösen.',
    titleHint: 'Meldung „…“ beheben',
    purpose: 'Diese Anleitung hilft, wenn die Meldung „…“ erscheint. Sie erfahren die Ursache und wie Sie weiterarbeiten.',
    prerequisites: [],
    steps: ['Lesen Sie die Meldung vollständig', 'Prüfen Sie …', 'Korrigieren Sie …', 'Klicken Sie erneut auf **…**'],
    result: 'Die Meldung erscheint nicht mehr und der Vorgang wird fortgesetzt.',
    hints: ['Erscheint die Meldung weiterhin, wenden Sie sich an …'],
  },
  {
    id: 'export', name: 'Bericht erstellen', description: 'Eine Auswertung erzeugen, herunterladen oder weitergeben.',
    titleHint: '… auswerten',
    purpose: 'Mit dieser Anleitung erstellen Sie einen Bericht über … und laden ihn herunter.',
    prerequisites: ['Sie haben die Berechtigung „…“'],
    steps: ['Öffnen Sie **Berichte › …**', 'Wählen Sie den Zeitraum', 'Klicken Sie auf **Erstellen**', 'Klicken Sie auf **Herunterladen**'],
    result: 'Der Bericht liegt als … in Ihrem Download-Ordner.',
    hints: ['Große Zeiträume dauern länger – schränken Sie bei Bedarf ein'],
  },
];
