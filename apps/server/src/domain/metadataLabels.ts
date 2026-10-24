// Label-Katalog für oneSCM_Metadaten (ADR-079, ADR-080): vordefinierte Labels in neun Gruppen, Deutsch und Englisch.
// ENTSCHEIDUNG(M-06): Labels sind vordefiniert; Pflege (umbenennen, ausblenden, ergänzen) nur mit Berechtigung `admin`.
// Stand ADR-080 (Etappe 28): Gliederung = Gesamtgliederung vom 11./12.10.2026 (23 Kapitel, Vorspann, Anhänge A–I),
// Navigation = Menü der oneSCM-Oberfläche (nameEn = UI-Begriff), Rollen mit MO = Market Operation, Sparten nur Pkw und Van.
// Katalog-Labels früherer Stände bleiben in den Projekten erhalten, werden beim Abgleich aber ausgeblendet.

export const LABEL_LANGUAGES = ['de', 'en'] as const;
export type LabelLanguage = (typeof LABEL_LANGUAGES)[number];

export const LABEL_GROUPS = [
  { code: 'outline', nameDe: 'Handbuch-Gliederung', nameEn: 'Manual outline', icon: '🗂', color: '#1d4ed8' },
  { code: 'role', nameDe: 'Rollen', nameEn: 'Roles', icon: '👥', color: '#6d28d9' },
  { code: 'navigation', nameDe: 'Navigation im System', nameEn: 'System navigation', icon: '🧭', color: '#0f766e' },
  { code: 'domain', nameDe: 'Fachdomäne', nameEn: 'Business domain', icon: '🧩', color: '#4d7c0f' },
  { code: 'customer', nameDe: 'Kundengruppe', nameEn: 'Customer group', icon: '🧑‍💼', color: '#be185d' },
  { code: 'system', nameDe: 'Systeme und Schnittstellen', nameEn: 'Systems and interfaces', icon: '🔌', color: '#475569' },
  { code: 'content', nameDe: 'Inhaltstyp', nameEn: 'Content type', icon: '🧾', color: '#b45309' },
  { code: 'division', nameDe: 'Sparte', nameEn: 'Division', icon: '🚘', color: '#0369a1' },
  { code: 'quality', nameDe: 'Qualität und Status', nameEn: 'Quality and status', icon: '🏷', color: '#b91c1c' },
  // Pflichtgruppen der Triage (ADR-100): jeder Chunk trägt je Gruppe mindestens ein Label
  { code: 'version', nameDe: 'Version', nameEn: 'Version', icon: '🔖', color: '#7c3aed' },
  { code: 'status', nameDe: 'Status', nameEn: 'Status', icon: '🚦', color: '#15803d' },
  { code: 'language', nameDe: 'Sprache', nameEn: 'Language', icon: '🌐', color: '#0e7490' },
  { code: 'market', nameDe: 'Markt', nameEn: 'Market', icon: '🗺', color: '#a16207' },
  { code: 'detail', nameDe: 'Detaillevel', nameEn: 'Detail level', icon: '🔍', color: '#9333ea' },
  { code: 'review', nameDe: 'Zu prüfen', nameEn: 'To be reviewed', icon: '⚠', color: '#dc2626' },
] as const;
/** Pflicht-Labelgruppen je Chunk (ADR-100): Version, Status, Domäne, Rolle, Sprache, Sparte, Markt, Detaillevel, zu prüfen */
export const REQUIRED_GROUPS = ['version', 'status', 'domain', 'role', 'language', 'division', 'market', 'detail', 'review'] as const;
export type RequiredGroup = (typeof REQUIRED_GROUPS)[number];
/** Detaillevel steuern Umfang und Ausgabe: HappyPath = Standardablauf, Edge = Ausnahmen (Abschnitt „Fehler und Ausnahmen“) */
export const DETAIL_LEVELS = ['basis', 'basis-plus', 'zusatz', 'intern', 'happy-path', 'edge', 'in-review'] as const;
export type DetailLevel = (typeof DETAIL_LEVELS)[number];
/** Standard je Kapitel: alles außer Intern und inPrüfung */
export const DEFAULT_DETAIL_LEVELS: DetailLevel[] = ['basis', 'basis-plus', 'zusatz', 'happy-path', 'edge'];
export type LabelGroup = (typeof LABEL_GROUPS)[number]['code'];
export const LABEL_GROUP_CODES = LABEL_GROUPS.map((g) => g.code) as string[];

export interface CatalogLabel { code: string; group: LabelGroup; nameDe: string; nameEn: string; description?: string }

type Row = [key: string, nameDe: string, nameEn: string, description?: string];
const group = (g: LabelGroup, prefix: string, rows: Row[]): CatalogLabel[] =>
  rows.map(([key, nameDe, nameEn, description]) => ({ code: `${prefix}.${key}`, group: g, nameDe, nameEn, ...(description ? { description } : {}) }));

export const LABEL_CATALOG: CatalogLabel[] = [
  // Gesamtgliederung (Gliederung_oneSCM12102026.xlsx): Vorspann, Kapitel 1–23, Anhänge A–I – Reihenfolge = Lesefolge
  ...group('outline', 'outline', [
    ['vorspann', 'V Vorspann', 'V Front matter'],
    ['kap01', '01 Einführung und Überblick', '01 Introduction and overview'],
    ['kap02', '02 Zugang, Rollen und Berechtigungen', '02 Access, roles and permissions'],
    ['kap03', '03 Grundlagen, Navigation und Customer Journey', '03 Basics, navigation and customer journey'],
    ['kap04', '04 Kunden, Partner und Vertragsrollen', '04 Customers, partners and contract roles'],
    ['kap05', '05 Fahrzeug, Produkt und Angebot vorbereiten', '05 Preparing vehicle, product and quote'],
    ['kap06', '06 Servicevertrag anlegen und Antrag abschließen', '06 Creating a service contract and completing the proposal'],
    ['kap07', '07 Zahlungsdaten, Dokumente und Unterschrift', '07 Payment data, documents and signature'],
    ['kap08', '08 Antrag verfolgen und aktivieren', '08 Tracking and activating proposals'],
    ['kap09', '09 MO Checks und fachliche Prüfungen', '09 MO checks and business reviews'],
    ['kap10', '10 Verträge im Alltag verwalten', '10 Managing contracts day to day'],
    ['kap11', '11 Rechnung, Zahlung, Kosten und Auswertungen', '11 Invoicing, payment, costs and reports'],
    ['kap12', '12 Geschäftskunden, Kampagnen und Sonderfälle', '12 Business customers, campaigns and special cases'],
    ['kap13', '13 Reifenprodukte – Tyres', '13 Tyre products'],
    ['kap14', '14 Marktrolle, Produkt- und Preispflege sowie Administration', '14 Market role, product and price maintenance, administration'],
    ['kap15', '15 HQ-Rolle, Blueprint und zentrale Stammdaten', '15 HQ role, blueprint and central master data'],
    ['kap16', '16 Governance, Qualität, Datenschutz und Archivierung', '16 Governance, quality, data protection and archiving'],
    ['kap17', '17 Rollout und Einführung', '17 Rollout and introduction'],
    ['kap18', '18 Migration und Übernahme von Bestandsdaten', '18 Migration and transfer of existing data'],
    ['kap19', '19 IT-Architektur', '19 IT architecture'],
    ['kap20', '20 Länderspezifische Themen', '20 Country-specific topics'],
    ['kap21', '21 Spartenspezifische Themen', '21 Division-specific topics'],
    ['kap22', '22 Ausblick und Weiterentwicklung', '22 Outlook and further development'],
    ['kap23', '23 FAQ, Troubleshooting und Support', '23 FAQ, troubleshooting and support'],
    ['anhang-a', 'A Glossar und Abkürzungen', 'A Glossary and abbreviations'],
    ['anhang-b', 'B Alltagschecklisten', 'B Everyday checklists'],
    ['anhang-c', 'C Prozessdiagramme', 'C Process diagrams'],
    ['anhang-d', 'D Rollen-, Status- und Scopematrizen', 'D Role, status and scope matrices'],
    ['anhang-e', 'E Ticket-zu-Kapitel-Zuordnung', 'E Ticket-to-chapter mapping'],
    ['anhang-f', 'F Quellen und Klärungsregister', 'F Sources and clarification register'],
    ['anhang-g', 'G Bildverzeichnis und Nachweise', 'G List of figures and evidence'],
    ['anhang-h', 'H Wissenschecks und Lösungen', 'H Knowledge checks and solutions'],
    ['anhang-i', 'I Praxisbeispiele, Rechenbeispiele und Testdaten', 'I Practical examples, calculations and test data'],
  ]),
  // Rollen – MO = Market Operation (Entscheidung 23.10.2026); IT als Rolle der Steuerung im Arbeitsordner
  ...group('role', 'role', [
    ['dealer', 'Dealer', 'Dealer'],
    ['dealer-plus', 'Dealer+', 'Dealer+', 'Dealer mit erweiterten Verkaufslimits'],
    ['market', 'Markt (MPC)', 'Market (MPC)', 'Markt-Produktmanagement, Produkt- und Preisverantwortung, Vier-Augen-Prinzip MPC1/MPC2'],
    ['mo', 'MO (Market Operation)', 'MO (Market Operation)', 'Prüfung und Freigabe, MO Checks'],
    ['kam', 'KAM', 'KAM', 'Key Account Management'],
    ['hq', 'HQ', 'HQ'],
    ['hq-admin', 'HQ Admin', 'HQ admin'],
    ['hq-product', 'HQ Produktmanagement', 'HQ product management'],
    ['cam-team', 'CaM-Team', 'CaM team'],
    ['it', 'IT', 'IT'],
    ['all', 'Alle Rollen', 'All roles'],
    ['other', 'Sonstiges', 'Other', 'keine der Rollen Dealer, MO, Market, HQ (Triage)'],
  ]),
  // Navigation: Menü der oneSCM-Oberfläche; nameEn = UI-Begriff (unverändert), nameDe = Handbuchbegriff
  ...group('navigation', 'nav', [
    ['mainpage', 'Startseite', 'Access Mainpage', 'In der Oberfläche geschrieben als „Acess Mainpage“'],
    ['product', 'Produktmanagement', 'Product Management'],
    ['product.vehicle-groups', 'Produktmanagement › Fahrzeuggruppen verwalten', 'Product Management › Manage Vehicle Groups'],
    ['product.products-prices', 'Produktmanagement › Produkte und Preise verwalten', 'Product Management › Manage Products and Prices'],
    ['product.campaign', 'Produktmanagement › Kampagnen verwalten', 'Product Management › Manage Campaign'],
    ['product.blueprints', 'Produktmanagement › Blueprints verwalten', 'Product Management › Manage Blueprints'],
    ['product.vega-codes', 'Produktmanagement › VEGA-Codes', 'Product Management › Vega Codes'],
    ['product.testing', 'Produktmanagement › Produkttest', 'Product Management › Product Testing'],
    ['generation', 'Vertragserstellung', 'Contract Generation'],
    ['generation.proposal', 'Vertragserstellung › Antrag anlegen', 'Contract Generation › Contract Proposal'],
    ['generation.proposal-management', 'Vertragserstellung › Anträge verwalten', 'Contract Generation › Proposal Management'],
    ['generation.mo-checks', 'Vertragserstellung › MO Checks', 'Contract Generation › MO Checks'],
    ['generation.special-cases', 'Vertragserstellung › Sonderfälle', 'Contract Generation › Special Cases'],
    ['contract-management', 'Vertragsverwaltung', 'Contract Management'],
    // Unterpunkte 3.1–3.5 (Handbuch-Werkstatt V4, Menüstruktur); englische UI-Begriffe bestätigt am 23.10.2026
    ['contract-management.search-change', 'Vertragsverwaltung › Vertrag suchen und ändern', 'Contract Management › Search and Change Contract', 'V4-Punkt 3.1'],
    ['contract-management.suspend-reactivate', 'Vertragsverwaltung › Vertrag aussetzen und reaktivieren', 'Contract Management › Suspend and Reactivate Contract', 'V4-Punkt 3.2'],
    ['contract-management.terminate-cancel', 'Vertragsverwaltung › Vertrag beenden, stornieren und kündigen', 'Contract Management › Terminate and Cancel Contract', 'V4-Punkt 3.3'],
    ['contract-management.renewal', 'Vertragsverwaltung › Verlängerung, Folgevertrag und Neuvertrag', 'Contract Management › Extension, Follow-up and New Contract', 'V4-Punkt 3.4'],
    ['contract-management.documents', 'Vertragsverwaltung › Dokumente und Kommunikation', 'Contract Management › Documents and Communication', 'V4-Punkt 3.5'],
    ['customer', 'Kundenverwaltung', 'Customer Management'],
    ['customer.private', 'Kundenverwaltung › Privatkunden', 'Customer Management › Private Customer'],
    ['customer.commercial', 'Kundenverwaltung › Geschäftskunden', 'Customer Management › Commercial Customer'],
    ['finance', 'Finanzen', 'Finance'],
    ['finance.fi-document', 'Finanzen › Status FI-Beleg', 'Finance › Status FI Document'],
    ['finance.document-type', 'Finanzen › Belegart', 'Finance › Document Type'],
    ['finance.financial-control', 'Finanzen › Finanzkontrolle', 'Finance › Financial Control'],
    ['finance.oneerp-checks', 'Finanzen › oneERP-Prüfungen', 'Finance › oneERP Checks'],
    ['international-workshop', 'International Workshop', 'International Workshop'],
    ['nemesis', 'Nemesis', 'Nemesis'],
    ['market-settings', 'Markteinstellungen', 'Market Settings'],
    ['market-settings.inflation', 'Markteinstellungen › Inflation', 'Market Settings › Inflation'],
    ['template-management', 'Vorlagenverwaltung', 'Template Management'],
    ['admin', 'Administration', 'Admin Section'],
    ['admin.material-number', 'Administration › Materialnummer', 'Admin Section › Material Number'],
    ['admin.batch-jobs', 'Administration › Batch-Jobs', 'Admin Section › Batch Jobs'],
    ['admin.vehicle-management', 'Administration › Fahrzeugverwaltung', 'Admin Section › Vehicle Management'],
    ['admin.health-check', 'Administration › Health Check', 'Admin Section › Health Check'],
    ['admin.cross-file-transfer', 'Administration › Cross File Transfer', 'Admin Section › Cross File Transfer'],
    ['admin.information-banner', 'Administration › Informationsbanner', 'Admin Section › Information Banner'],
  ]),
  // Fachdomänen von oneSCM
  ...group('domain', 'domain', [
    ['contract-calculation', 'Contract Calculation', 'Contract Calculation'],
    ['contract-generation', 'Contract Generation', 'Contract Generation'],
    ['contract-management', 'Contract Management', 'Contract Management'],
    ['revenue', 'Revenue Management', 'Revenue Management'],
    ['cost', 'Cost Management', 'Cost Management'],
    ['customer-partner', 'Customer & Partner Management', 'Customer & Partner Management'],
    ['vehicle', 'Vehicle Management', 'Vehicle Management'],
    ['documents', 'Documents & Communication', 'Documents & Communication'],
    ['reporting', 'Reporting', 'Reporting'],
    ['general', 'Allgemein', 'General', 'domänenübergreifend, z. B. Anmeldung, Navigation, Grundlagen (Triage)'],
  ]),
  ...group('customer', 'customer', [
    ['private', 'Privatkunde', 'Private customer'],
    ['business', 'Gewerbekunde', 'Business customer'],
    ['fleet', 'Commercial Fleet', 'Commercial fleet'],
    ['government', 'Behörde (Governmental)', 'Governmental'],
    ['leasing', 'Leasing', 'Leasing'],
  ]),
  // Systemsteckbriefe der Gesamtgliederung (Kapitel 19)
  ...group('system', 'system', [
    ['go', 'GO', 'GO'],
    ['afab', 'AFAB', 'AFAB'],
    ['cepro', 'CEPRO', 'CEPRO'],
    ['otr', 'OTR', 'OTR'],
    ['dsb', 'DSB', 'DSB'],
    ['mic', 'MIC', 'MIC'],
    ['vega', 'VEGA', 'VEGA'],
    ['bs4', 'BS4/SDB4', 'BS4/SDB4'],
    ['oneerp', 'oneERP', 'oneERP'],
    ['cofico', 'CoFiCo', 'CoFiCo'],
    ['swt', 'SWT', 'SWT'],
    ['nemesis', 'NEMESIS', 'NEMESIS'],
    ['mpay', 'MPay', 'MPay'],
    ['alice', 'ALICE', 'ALICE', 'Berechtigungssystem'],
    ['datix', 'DATIX', 'DATIX'],
    ['vedoc', 'VeDoc', 'VeDoc'],
    ['verso', 'VERSO/VOM', 'VERSO/VOM'],
    ['onedoc', 'oneDoC', 'oneDoC'],
    ['xentry', 'Xentry', 'Xentry'],
  ]),
  // Inhaltstyp – Anleitung, Referenz, Erklärung, Tutorial nach Diátaxis
  ...group('content', 'content', [
    ['tutorial', 'Tutorial', 'Tutorial'],
    ['instruction', 'Anleitung', 'Instruction'],
    ['reference', 'Referenz', 'Reference'],
    ['explanation', 'Erklärung', 'Explanation'],
    ['process', 'Prozessbeschreibung', 'Process description'],
    ['definition', 'Definition', 'Definition'],
    ['business-rule', 'Geschäftsregel', 'Business rule'],
    ['status-model', 'Statusmodell', 'Status model'],
    ['prerequisite', 'Voraussetzung', 'Prerequisite'],
    ['result', 'Ergebnis', 'Result'],
    ['note', 'Hinweis', 'Note'],
    ['tip', 'Tipp', 'Tip'],
    ['warning', 'Warnung', 'Warning'],
    ['error-solution', 'Fehlerbild und Lösung', 'Error and solution'],
    ['example', 'Beispiel', 'Example'],
    ['system-profile', 'Systemsteckbrief/Schnittstelle', 'System profile/interface'],
    ['quick-guide', 'Quick Guide', 'Quick guide'],
    ['jira-ticket', 'Jira-Ticket/Epic', 'Jira ticket/epic'],
    ['screenshot', 'Screenshot', 'Screenshot'],
    ['video', 'Video', 'Video'],
    ['table', 'Tabelle', 'Table'],
    ['faq', 'Frage und Antwort', 'Question and answer'],
  ]),
  // Sparten: nur Pkw und Van (Entscheidung 23.10.2026)
  ...group('division', 'division', [
    ['car', 'Pkw', 'Car'],
    ['van', 'Van', 'Van'],
    ['all', 'Pkw+Van', 'Car+Van'],
  ]),
  ...group('quality', 'quality', [
    ['checked', 'Geprüft', 'Checked'],
    ['to-check', 'Prüfen', 'To be checked'],
    ['outdated', 'Veraltet', 'Outdated'],
    ['duplicate', 'Dublette', 'Duplicate'],
    ['contradiction', 'Widerspruch', 'Contradiction'],
    ['gap', 'Lücke', 'Gap'],
    ['incomplete', 'Unvollständig', 'Incomplete'],
    ['no-production-proof', 'Produktivnachweis fehlt', 'Production evidence missing', 'Ticket- oder Teststatus ist kein Nachweis für den Produktivstand'],
    ['editorial-only', 'Redaktionsteil – nicht veröffentlichen', 'Editorial only – do not publish'],
    ['important', 'Wichtig', 'Important'],
    ['confidential', 'Vertraulich', 'Confidential'],
    ['personal-data', 'Personenbezogene Daten', 'Personal data'],
    ['translate', 'Übersetzen', 'To be translated'],
    ['new-in-release', 'Neu im Release', 'New in release'],
    ['manual-candidate', 'Kandidat für Handbuch', 'Candidate for manual'],
    ['faq-candidate', 'Kandidat für FAQ', 'Candidate for FAQ'],
    ['not-relevant', 'Nicht relevant', 'Not relevant'],
  ]),
  // Pflichtgruppen (ADR-100); Versionen, Märkte und weitere Sprachen legt TRIAGE bei Bedarf an
  ...group('version', 'version', [
    ['open', 'ohne Version', 'No version', 'keine Version, kein Release in der Quelle'],
  ]),
  ...group('status', 'status', [
    ['live', 'live', 'Live', 'produktiv, bestätigte Quelle'],
    ['draft', 'Entwurf', 'Draft', 'Quelle unbestätigt'],
    ['in-progress', 'in Bearbeitung', 'In progress', 'Ticket in Bearbeitung bzw. Pipeline'],
  ]),
  ...group('language', 'language', [
    ['de', 'Deutsch', 'German'],
    ['en', 'Englisch', 'English'],
  ]),
  ...group('market', 'market', [
    ['all', 'alle Märkte', 'All markets', 'marktübergreifend (Blueprint)'],
  ]),
  ...group('detail', 'detail', [
    ['basis', 'Basis', 'Basic', 'Überblick und Grundbegriffe'],
    ['basis-plus', 'Basis+', 'Basic+', 'vertiefte Erklärung'],
    ['zusatz', 'Zusatz', 'Additional', 'Tipps, Hinweise, Beispiele, optionale Wege'],
    ['intern', 'Intern', 'Internal', 'nicht für Anwendende'],
    ['happy-path', 'HappyPath', 'Happy path', 'Standardablauf (Standard-Workflow)'],
    ['edge', 'Edge', 'Edge case', 'Ausnahmen, Fehler, Sonderfälle'],
    ['in-review', 'inPrüfung', 'In review', 'Umfang noch nicht entschieden'],
  ]),
  ...group('review', 'review', [
    ['yes', 'zu prüfen', 'To be reviewed', 'Triage unsicher – ein Mensch prüft'],
    ['no', 'geprüft', 'Reviewed'],
  ]),
];

/**
 * Zuordnung Fachdomäne → Gliederungspunkte und Menüpunkte (ADR-082): Vorschlag des Katalogs, je Projekt änderbar.
 * Schlüssel = Domänen-Code ohne Präfix, Werte = Label-Codes der Gruppen outline und navigation.
 */
export const DOMAIN_LINKS: Record<string, string[]> = {
  'contract-calculation': ['outline.kap05', 'outline.kap06', 'outline.kap13', 'outline.kap14', 'nav.product.products-prices', 'nav.product.campaign', 'nav.market-settings.inflation', 'nav.generation.proposal'],
  'contract-generation': ['outline.kap06', 'outline.kap07', 'outline.kap08', 'outline.kap09', 'nav.generation', 'nav.generation.proposal', 'nav.generation.proposal-management', 'nav.generation.mo-checks', 'nav.generation.special-cases'],
  'contract-management': ['outline.kap10', 'outline.kap12', 'nav.contract-management', 'nav.contract-management.search-change', 'nav.contract-management.suspend-reactivate',
    'nav.contract-management.terminate-cancel', 'nav.contract-management.renewal', 'nav.contract-management.documents'],
  revenue: ['outline.kap11', 'nav.finance', 'nav.finance.fi-document', 'nav.finance.document-type', 'nav.finance.oneerp-checks'],
  cost: ['outline.kap11', 'nav.international-workshop', 'nav.finance.financial-control'],
  'customer-partner': ['outline.kap04', 'outline.kap12', 'nav.customer', 'nav.customer.private', 'nav.customer.commercial'],
  vehicle: ['outline.kap05', 'nav.product.vehicle-groups', 'nav.product.vega-codes', 'nav.admin.vehicle-management'],
  documents: ['outline.kap07', 'outline.kap10', 'outline.kap16', 'nav.template-management', 'nav.contract-management.documents'],
  reporting: ['outline.kap11', 'outline.anhang-d', 'nav.finance.financial-control'],
};

/** Code für eigene Labels: Kleinbuchstaben, Ziffern, Punkt, Bindestrich */
export const LABEL_CODE_RE = /^[a-z0-9][a-z0-9.-]{1,59}$/;
