// Referenzdaten gemäß Masterprompt §2 (US-003, US-004, US-010).
// ENTSCHEIDUNG(E-04, E-11): Liste, Icons und Farben wie im Masterprompt; Farbe trägt keine eigene Bedeutung,
// sie wird immer zusammen mit Icon und Textlabel verwendet.

export const ROLES = [
  { code: 'dealer', label: 'Dealer', icon: '🏪', color: '#b45309', description: 'operative Vertragsbearbeitung im Autohaus' },
  { code: 'market', label: 'Markt', icon: '🌍', color: '#0369a1', description: 'nationale/lokale Marktorganisation und Markteinstellungen' },
  { code: 'mo', label: 'MO', icon: '✅', color: '#15803d', description: 'Market Operation, Prüfung und Freigabe, einschließlich MO-Check' },
  { code: 'hq', label: 'HQ', icon: '🏢', color: '#6d28d9', description: 'zentrale Produkt-, Preis- und Systempflege' },
  { code: 'all', label: 'Alle', icon: '👥', color: '#475569', description: 'rollenübergreifender Inhalt' },
] as const;

export const DIVISIONS = [
  { code: 'car', label: 'PKW', icon: '🚘', color: '#1d4ed8' },
  { code: 'van', label: 'VAN', icon: '🚐', color: '#0f766e' },
  { code: 'truck', label: 'Truck', icon: '🚛', color: '#b91c1c' },
  { code: 'bus', label: 'Bus', icon: '🚌', color: '#a16207' },
  { code: 'all', label: 'Alle', icon: '🔄', color: '#475569' },
  { code: 'unconfirmed', label: 'Ungeklärt', icon: '❓', color: '#64748b' },
] as const;

export type RoleCode = (typeof ROLES)[number]['code'];
export type DivisionCode = (typeof DIVISIONS)[number]['code'];

export const ROLE_CODES = ROLES.map((r) => r.code) as string[];
export const DIVISION_CODES = DIVISIONS.map((d) => d.code) as string[];

// ENTSCHEIDUNG(E-08): zulässige Evidenzstatus.
export const EVIDENCE_STATUSES = ['source_confirmed', 'manually_confirmed', 'unconfirmed', 'open_question'] as const;
export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];
export const CONFIRMED_EVIDENCE: readonly string[] = ['source_confirmed', 'manually_confirmed'];

export const FINDING_TYPES = ['gap', 'duplicate', 'contradiction', 'terminology', 'privacy', 'readability'] as const;
export type FindingType = (typeof FINDING_TYPES)[number];
export const SEVERITIES = ['blocker', 'high', 'medium', 'low'] as const;
export type Severity = (typeof SEVERITIES)[number];

// §7 Entscheidungsoptionen
export const DECISIONS = [
  { code: 'take_a', label: 'A übernehmen', resolves: true },
  { code: 'take_b', label: 'B übernehmen', resolves: true },
  { code: 'conditional', label: 'bedingt gültig', resolves: true },
  { code: 'role_difference', label: 'Rollenunterschied', resolves: true },
  { code: 'division_difference', label: 'Spartenunterschied', resolves: true },
  { code: 'market_difference', label: 'Marktunterschied', resolves: true },
  { code: 'release_difference', label: 'Releaseunterschied', resolves: true },
  { code: 'outdated_source', label: 'veraltete Quelle', resolves: true },
  { code: 'ignore', label: 'ignorieren mit Begründung', resolves: true },
  { code: 'defer', label: 'zurückstellen', resolves: false },
] as const;
export const DECISION_CODES = DECISIONS.map((d) => d.code) as string[];

// §6 Standardstruktur
export const CHAPTER_SECTIONS = [
  { code: 'purpose', title: 'Zweck' },
  { code: 'prerequisites', title: 'Voraussetzungen' },
  { code: 'responsibilities', title: 'Rollen und Zuständigkeiten' },
  { code: 'steps', title: 'Schrittweise Durchführung' },
  { code: 'result', title: 'Ergebnis und Systemstatus' },
  { code: 'role_specifics', title: 'Rollenabhängige Besonderheiten' },
  { code: 'scope_differences', title: 'Sparten-, Markt- und Releaseunterschiede' },
  { code: 'hints', title: 'Hinweise, Tipps und Warnungen' },
  { code: 'troubleshooting', title: 'Fehlerbehebung' },
  { code: 'status', title: 'Quellen- und Freigabestatus' },
] as const;
export type SectionCode = (typeof CHAPTER_SECTIONS)[number]['code'];
export const SECTION_CODES = CHAPTER_SECTIONS.map((s) => s.code) as string[];

export const BLOCK_MODES = ['generated', 'manually_edited', 'locked', 'needs_regeneration', 'ai_rewritten', 'approved'] as const;
export type BlockMode = (typeof BLOCK_MODES)[number];
export const BLOCK_KINDS = ['paragraph', 'list', 'note', 'tip', 'warning', 'xref', 'gap', 'table', 'code'] as const;

// ENTSCHEIDUNG(E-15): technische Berechtigungen (getrennt von fachlichen Rollen, ADR-009)
export const PERMISSIONS = ['read', 'edit', 'decide', 'approve', 'admin'] as const;
export type Permission = (typeof PERMISSIONS)[number];

export const DEMO_USERS = [
  // E-Mail-Adressen unter der reservierten Domain example.com (RFC 2606) – keine Echtdaten
  { id: 'u-redaktion', name: 'Redaktion (Demo)', permissions: ['read', 'edit'], email: 'redaktion@example.com' },
  { id: 'u-fachpruefung', name: 'Fachprüfung (Demo)', permissions: ['read', 'edit', 'decide'], email: 'fachpruefung@example.com' },
  { id: 'u-freigabe', name: 'Freigabe (Demo)', permissions: ['read', 'decide', 'approve'], email: 'freigabe@example.com' },
  { id: 'u-admin', name: 'Administration (Demo)', permissions: ['read', 'edit', 'decide', 'approve', 'admin'], email: 'admin@example.com' },
  { id: 'u-leser', name: 'Lesezugriff (Demo)', permissions: ['read'], email: 'leser@example.com' },
];
