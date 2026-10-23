// Label-Katalog für oneSCM_Metadaten (ADR-079): 100 vordefinierte Labels in sechs Gruppen, Deutsch und Englisch.
// ENTSCHEIDUNG(M-06): Labels sind vordefiniert; Pflege (umbenennen, ausblenden, ergänzen) nur mit Berechtigung `admin`.
// Gliederung und Navigation sind ein Vorschlag aus den Kapiteln der Demo-Quellen und den üblichen oneSCM-Bereichen –
// Codes bleiben stabil, Namen lassen sich je Projekt anpassen.

export const LABEL_LANGUAGES = ['de', 'en'] as const;
export type LabelLanguage = (typeof LABEL_LANGUAGES)[number];

export const LABEL_GROUPS = [
  { code: 'outline', nameDe: 'Handbuch-Gliederung', nameEn: 'Manual outline', icon: '🗂', color: '#1d4ed8' },
  { code: 'role', nameDe: 'Rollen', nameEn: 'Roles', icon: '👥', color: '#6d28d9' },
  { code: 'navigation', nameDe: 'Navigation im System', nameEn: 'System navigation', icon: '🧭', color: '#0f766e' },
  { code: 'content', nameDe: 'Inhaltstyp', nameEn: 'Content type', icon: '🧾', color: '#b45309' },
  { code: 'division', nameDe: 'Sparte', nameEn: 'Division', icon: '🚘', color: '#0369a1' },
  { code: 'quality', nameDe: 'Qualität und Status', nameEn: 'Quality and status', icon: '🏷', color: '#b91c1c' },
] as const;
export type LabelGroup = (typeof LABEL_GROUPS)[number]['code'];
export const LABEL_GROUP_CODES = LABEL_GROUPS.map((g) => g.code) as string[];

export interface CatalogLabel { code: string; group: LabelGroup; nameDe: string; nameEn: string }

const group = (g: LabelGroup, prefix: string, rows: [string, string, string][]): CatalogLabel[] =>
  rows.map(([key, nameDe, nameEn]) => ({ code: `${prefix}.${key}`, group: g, nameDe, nameEn }));

export const LABEL_CATALOG: CatalogLabel[] = [
  // Gliederungsvorschlag für das Handbuch (30) – Reihenfolge = Kapitelfolge
  ...group('outline', 'outline', [
    ['01-introduction', '01 Einleitung', '01 Introduction'],
    ['02-about', '02 Über dieses Handbuch', '02 About this manual'],
    ['03-overview', '03 Systemüberblick oneSCM', '03 oneSCM system overview'],
    ['04-login', '04 Anmeldung und Start', '04 Login and getting started'],
    ['05-interface', '05 Bedienung der Oberfläche', '05 Using the interface'],
    ['06-users', '06 Benutzerverwaltung', '06 User management'],
    ['07-permissions', '07 Rollen und Berechtigungen', '07 Roles and permissions'],
    ['08-notifications', '08 Benachrichtigungen', '08 Notifications'],
    ['09-master-data', '09 Stammdaten', '09 Master data'],
    ['10-contracts', '10 Vertragsbearbeitung', '10 Contract processing'],
    ['11-contract-create', '11 Vertrag anlegen', '11 Create a contract'],
    ['12-contract-change', '12 Vertrag ändern', '12 Change a contract'],
    ['13-contract-end', '13 Vertrag kündigen und beenden', '13 Terminate a contract'],
    ['14-contract-search', '14 Vertragsübersicht und Suche', '14 Contract overview and search'],
    ['15-mo-check', '15 MO-Check', '15 MO check'],
    ['16-approval', '16 Prüfung und Freigabe', '16 Review and approval'],
    ['17-products', '17 Preis- und Produktpflege', '17 Price and product maintenance'],
    ['18-price-lists', '18 Preislisten', '18 Price lists'],
    ['19-billing', '19 Abrechnung', '19 Billing'],
    ['20-credit-notes', '20 Gutschriften', '20 Credit notes'],
    ['21-reports', '21 Berichte und Auswertungen', '21 Reports and analytics'],
    ['22-interfaces', '22 Schnittstellen und Datenaustausch', '22 Interfaces and data exchange'],
    ['23-market-settings', '23 Markteinstellungen', '23 Market settings'],
    ['24-system-settings', '24 Systemeinstellungen', '24 System settings'],
    ['25-troubleshooting', '25 Fehlerbehebung', '25 Troubleshooting'],
    ['26-faq', '26 Häufige Fragen', '26 Frequently asked questions'],
    ['27-glossary', '27 Glossar', '27 Glossary'],
    ['28-abbreviations', '28 Abkürzungen', '28 Abbreviations'],
    ['29-release-notes', '29 Release-Hinweise', '29 Release notes'],
    ['30-appendix', '30 Anhang', '30 Appendix'],
  ]),
  // Rollen (10) – die ersten fünf entsprechen den fachlichen Rollen aus §2 (domain/reference.ts)
  ...group('role', 'role', [
    ['dealer', 'Dealer', 'Dealer'],
    ['market', 'Markt', 'Market'],
    ['mo', 'MO (Market Operation)', 'MO (Market Operation)'],
    ['hq', 'HQ', 'HQ'],
    ['all', 'Alle Rollen', 'All roles'],
    ['key-user', 'Key User', 'Key user'],
    ['admin', 'Administration', 'Administration'],
    ['support', 'Support', 'Support'],
    ['sales', 'Vertrieb', 'Sales'],
    ['accounting', 'Buchhaltung', 'Accounting'],
  ]),
  // Navigation im System (25) – Menüpfade in oneSCM
  ...group('navigation', 'nav', [
    ['home', 'Startseite', 'Home'],
    ['dashboard', 'Dashboard', 'Dashboard'],
    ['search', 'Suche', 'Search'],
    ['contracts.overview', 'Verträge › Übersicht', 'Contracts › Overview'],
    ['contracts.new', 'Verträge › Neuer Vertrag', 'Contracts › New contract'],
    ['contracts.details', 'Verträge › Vertragsdetails', 'Contracts › Contract details'],
    ['contracts.documents', 'Verträge › Dokumente', 'Contracts › Documents'],
    ['contracts.history', 'Verträge › Historie', 'Contracts › History'],
    ['review.mo-check', 'Prüfung › MO-Check', 'Review › MO check'],
    ['review.approvals', 'Prüfung › Freigaben', 'Review › Approvals'],
    ['products.catalog', 'Produkte › Katalog', 'Products › Catalogue'],
    ['products.price-lists', 'Produkte › Preislisten', 'Products › Price lists'],
    ['billing.invoices', 'Abrechnung › Rechnungen', 'Billing › Invoices'],
    ['billing.credit-notes', 'Abrechnung › Gutschriften', 'Billing › Credit notes'],
    ['billing.payments', 'Abrechnung › Zahlungen', 'Billing › Payments'],
    ['reports.standard', 'Berichte › Standardberichte', 'Reports › Standard reports'],
    ['reports.export', 'Berichte › Export', 'Reports › Export'],
    ['master.dealers', 'Stammdaten › Händler', 'Master data › Dealers'],
    ['master.customers', 'Stammdaten › Kunden', 'Master data › Customers'],
    ['master.vehicles', 'Stammdaten › Fahrzeuge', 'Master data › Vehicles'],
    ['admin.users', 'Administration › Benutzer', 'Administration › Users'],
    ['admin.roles', 'Administration › Rollen und Rechte', 'Administration › Roles and permissions'],
    ['admin.market', 'Administration › Markteinstellungen', 'Administration › Market settings'],
    ['notifications', 'Benachrichtigungen', 'Notifications'],
    ['help', 'Hilfe und Support', 'Help and support'],
  ]),
  // Inhaltstyp (15)
  ...group('content', 'content', [
    ['instruction', 'Anleitung', 'Instruction'],
    ['process', 'Prozessbeschreibung', 'Process description'],
    ['definition', 'Definition', 'Definition'],
    ['business-rule', 'Geschäftsregel', 'Business rule'],
    ['prerequisite', 'Voraussetzung', 'Prerequisite'],
    ['result', 'Ergebnis', 'Result'],
    ['note', 'Hinweis', 'Note'],
    ['tip', 'Tipp', 'Tip'],
    ['warning', 'Warnung', 'Warning'],
    ['error-solution', 'Fehlerbild und Lösung', 'Error and solution'],
    ['example', 'Beispiel', 'Example'],
    ['screenshot', 'Screenshot', 'Screenshot'],
    ['video', 'Video', 'Video'],
    ['table', 'Tabelle', 'Table'],
    ['faq', 'Frage und Antwort', 'Question and answer'],
  ]),
  // Sparten (5) – wie §2 (domain/reference.ts)
  ...group('division', 'division', [
    ['car', 'PKW', 'Car'],
    ['van', 'VAN', 'Van'],
    ['truck', 'Truck', 'Truck'],
    ['bus', 'Bus', 'Bus'],
    ['all', 'Alle Sparten', 'All divisions'],
  ]),
  // Qualität und Status (15)
  ...group('quality', 'quality', [
    ['checked', 'Geprüft', 'Checked'],
    ['to-check', 'Prüfen', 'To be checked'],
    ['outdated', 'Veraltet', 'Outdated'],
    ['duplicate', 'Dublette', 'Duplicate'],
    ['contradiction', 'Widerspruch', 'Contradiction'],
    ['gap', 'Lücke', 'Gap'],
    ['incomplete', 'Unvollständig', 'Incomplete'],
    ['important', 'Wichtig', 'Important'],
    ['confidential', 'Vertraulich', 'Confidential'],
    ['personal-data', 'Personenbezogene Daten', 'Personal data'],
    ['translate', 'Übersetzen', 'To be translated'],
    ['new-in-release', 'Neu im Release', 'New in release'],
    ['manual-candidate', 'Kandidat für Handbuch', 'Candidate for manual'],
    ['faq-candidate', 'Kandidat für FAQ', 'Candidate for FAQ'],
    ['not-relevant', 'Nicht relevant', 'Not relevant'],
  ]),
];

/** Code für eigene Labels: Kleinbuchstaben, Ziffern, Punkt, Bindestrich */
export const LABEL_CODE_RE = /^[a-z0-9][a-z0-9.-]{1,59}$/;
