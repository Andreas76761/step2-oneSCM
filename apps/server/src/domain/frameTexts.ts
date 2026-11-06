// Rahmentexte in Export und Druck je Sprache (ADR-101, U-08): Titel, Deckblatt, Kopf- und Fußzeile, Inhaltsverzeichnis,
// Versionszeile, „Gültig ab“, Hinweisarten, Verzeichnisse im Anhang und „Historie“. Schweizer Varianten wie die Grundsprache.

export interface FrameTexts {
  native: string; manualTitle: string; exportedOn: string; asOf: string; unfiltered: string; filter: string;
  roles: string; divisions: string; market: string; markets: string; release: string; blueprint: string;
  approvedVersion: string; dated: string; validFrom: string; contents: string; page: string; of: string; draft: string;
  note: string; tip: string; warning: string; xref: string;
  history: string; abbreviations: string; glossary: string; images: string; faq: string;
}

const T: Record<string, FrameTexts> = {
  de: {
    native: 'Deutsch', manualTitle: 'oneSCM Benutzerhandbuch', exportedOn: 'Exportiert am', asOf: 'Stand', unfiltered: 'ungefiltert', filter: 'Filter',
    roles: 'Rollen', divisions: 'Sparten', market: 'Markt', markets: 'Märkte', release: 'Release', blueprint: 'Blueprint (ohne marktspezifische Inhalte)',
    approvedVersion: 'Freigegebene Version', dated: 'vom', validFrom: 'Gültig ab', contents: 'Inhalt', page: 'Seite', of: 'von', draft: 'Entwurf',
    note: 'Hinweis', tip: 'Tipp', warning: 'Warnung', xref: 'Querverweis',
    history: 'Historie: abgelöste Funktionen', abbreviations: 'Abkürzungsverzeichnis', glossary: 'Glossar', images: 'Bildverzeichnis', faq: 'Häufige Fragen (FAQ)',
  },
  en: {
    native: 'English', manualTitle: 'oneSCM User Manual', exportedOn: 'Exported on', asOf: 'As of', unfiltered: 'unfiltered', filter: 'Filter',
    roles: 'Roles', divisions: 'Divisions', market: 'Market', markets: 'Markets', release: 'Release', blueprint: 'Blueprint (without market-specific content)',
    approvedVersion: 'Approved version', dated: 'of', validFrom: 'Valid from', contents: 'Contents', page: 'Page', of: 'of', draft: 'Draft',
    note: 'Note', tip: 'Tip', warning: 'Warning', xref: 'Cross-reference',
    history: 'History: superseded functions', abbreviations: 'List of abbreviations', glossary: 'Glossary', images: 'List of figures', faq: 'Frequently asked questions (FAQ)',
  },
  fr: {
    native: 'Français', manualTitle: 'Manuel utilisateur oneSCM', exportedOn: 'Exporté le', asOf: 'État au', unfiltered: 'non filtré', filter: 'Filtre',
    roles: 'Rôles', divisions: 'Divisions', market: 'Marché', markets: 'Marchés', release: 'Version', blueprint: 'Blueprint (sans contenu spécifique au marché)',
    approvedVersion: 'Version approuvée', dated: 'du', validFrom: 'Valable à partir de', contents: 'Sommaire', page: 'Page', of: 'sur', draft: 'Brouillon',
    note: 'Remarque', tip: 'Conseil', warning: 'Avertissement', xref: 'Renvoi',
    history: 'Historique : fonctions remplacées', abbreviations: 'Liste des abréviations', glossary: 'Glossaire', images: 'Liste des figures', faq: 'Questions fréquentes (FAQ)',
  },
  es: {
    native: 'Español', manualTitle: 'Manual de usuario de oneSCM', exportedOn: 'Exportado el', asOf: 'Estado a', unfiltered: 'sin filtrar', filter: 'Filtro',
    roles: 'Funciones', divisions: 'Divisiones', market: 'Mercado', markets: 'Mercados', release: 'Versión', blueprint: 'Blueprint (sin contenido específico del mercado)',
    approvedVersion: 'Versión aprobada', dated: 'del', validFrom: 'Válido desde', contents: 'Índice', page: 'Página', of: 'de', draft: 'Borrador',
    note: 'Nota', tip: 'Consejo', warning: 'Advertencia', xref: 'Referencia cruzada',
    history: 'Historial: funciones sustituidas', abbreviations: 'Lista de abreviaturas', glossary: 'Glosario', images: 'Índice de figuras', faq: 'Preguntas frecuentes (FAQ)',
  },
  it: {
    native: 'Italiano', manualTitle: 'Manuale utente oneSCM', exportedOn: 'Esportato il', asOf: 'Stato al', unfiltered: 'non filtrato', filter: 'Filtro',
    roles: 'Ruoli', divisions: 'Divisioni', market: 'Mercato', markets: 'Mercati', release: 'Release', blueprint: 'Blueprint (senza contenuti specifici del mercato)',
    approvedVersion: 'Versione approvata', dated: 'del', validFrom: 'Valido da', contents: 'Indice', page: 'Pagina', of: 'di', draft: 'Bozza',
    note: 'Nota', tip: 'Suggerimento', warning: 'Avvertenza', xref: 'Rimando',
    history: 'Cronologia: funzioni sostituite', abbreviations: 'Elenco delle abbreviazioni', glossary: 'Glossario', images: 'Elenco delle figure', faq: 'Domande frequenti (FAQ)',
  },
  nl: {
    native: 'Nederlands', manualTitle: 'oneSCM-gebruikershandleiding', exportedOn: 'Geëxporteerd op', asOf: 'Stand', unfiltered: 'ongefilterd', filter: 'Filter',
    roles: 'Rollen', divisions: 'Divisies', market: 'Markt', markets: 'Markten', release: 'Release', blueprint: 'Blueprint (zonder marktspecifieke inhoud)',
    approvedVersion: 'Goedgekeurde versie', dated: 'van', validFrom: 'Geldig vanaf', contents: 'Inhoud', page: 'Pagina', of: 'van', draft: 'Concept',
    note: 'Opmerking', tip: 'Tip', warning: 'Waarschuwing', xref: 'Kruisverwijzing',
    history: 'Historie: vervangen functies', abbreviations: 'Lijst met afkortingen', glossary: 'Woordenlijst', images: 'Lijst met afbeeldingen', faq: 'Veelgestelde vragen (FAQ)',
  },
  pl: {
    native: 'Polski', manualTitle: 'Podręcznik użytkownika oneSCM', exportedOn: 'Wyeksportowano', asOf: 'Stan na', unfiltered: 'bez filtra', filter: 'Filtr',
    roles: 'Role', divisions: 'Działy', market: 'Rynek', markets: 'Rynki', release: 'Wydanie', blueprint: 'Blueprint (bez treści specyficznych dla rynku)',
    approvedVersion: 'Zatwierdzona wersja', dated: 'z dnia', validFrom: 'Obowiązuje od', contents: 'Spis treści', page: 'Strona', of: 'z', draft: 'Wersja robocza',
    note: 'Uwaga', tip: 'Wskazówka', warning: 'Ostrzeżenie', xref: 'Odsyłacz',
    history: 'Historia: zastąpione funkcje', abbreviations: 'Wykaz skrótów', glossary: 'Słownik', images: 'Spis ilustracji', faq: 'Najczęściej zadawane pytania (FAQ)',
  },
  cs: {
    native: 'Čeština', manualTitle: 'Uživatelská příručka oneSCM', exportedOn: 'Exportováno', asOf: 'Stav k', unfiltered: 'bez filtru', filter: 'Filtr',
    roles: 'Role', divisions: 'Divize', market: 'Trh', markets: 'Trhy', release: 'Verze', blueprint: 'Blueprint (bez obsahu specifického pro trh)',
    approvedVersion: 'Schválená verze', dated: 'ze dne', validFrom: 'Platné od', contents: 'Obsah', page: 'Strana', of: 'z', draft: 'Koncept',
    note: 'Poznámka', tip: 'Tip', warning: 'Varování', xref: 'Křížový odkaz',
    history: 'Historie: nahrazené funkce', abbreviations: 'Seznam zkratek', glossary: 'Glosář', images: 'Seznam obrázků', faq: 'Časté dotazy (FAQ)',
  },
  sk: {
    native: 'Slovenčina', manualTitle: 'Používateľská príručka oneSCM', exportedOn: 'Exportované', asOf: 'Stav k', unfiltered: 'bez filtra', filter: 'Filter',
    roles: 'Roly', divisions: 'Divízie', market: 'Trh', markets: 'Trhy', release: 'Verzia', blueprint: 'Blueprint (bez obsahu špecifického pre trh)',
    approvedVersion: 'Schválená verzia', dated: 'zo dňa', validFrom: 'Platné od', contents: 'Obsah', page: 'Strana', of: 'z', draft: 'Koncept',
    note: 'Poznámka', tip: 'Tip', warning: 'Varovanie', xref: 'Krížový odkaz',
    history: 'História: nahradené funkcie', abbreviations: 'Zoznam skratiek', glossary: 'Glosár', images: 'Zoznam obrázkov', faq: 'Časté otázky (FAQ)',
  },
  pt: {
    native: 'Português', manualTitle: 'Manual do utilizador oneSCM', exportedOn: 'Exportado em', asOf: 'Estado em', unfiltered: 'sem filtro', filter: 'Filtro',
    roles: 'Funções', divisions: 'Divisões', market: 'Mercado', markets: 'Mercados', release: 'Versão', blueprint: 'Blueprint (sem conteúdo específico do mercado)',
    approvedVersion: 'Versão aprovada', dated: 'de', validFrom: 'Válido a partir de', contents: 'Índice', page: 'Página', of: 'de', draft: 'Rascunho',
    note: 'Nota', tip: 'Dica', warning: 'Advertência', xref: 'Referência cruzada',
    history: 'Histórico: funções substituídas', abbreviations: 'Lista de abreviaturas', glossary: 'Glossário', images: 'Lista de figuras', faq: 'Perguntas frequentes (FAQ)',
  },
  ko: {
    native: '한국어', manualTitle: 'oneSCM 사용자 매뉴얼', exportedOn: '내보낸 날짜', asOf: '기준일', unfiltered: '필터 없음', filter: '필터',
    roles: '역할', divisions: '부문', market: '시장', markets: '시장', release: '릴리스', blueprint: '블루프린트(시장별 내용 제외)',
    approvedVersion: '승인된 버전', dated: '날짜', validFrom: '적용 시작', contents: '목차', page: '페이지', of: '/', draft: '초안',
    note: '참고', tip: '팁', warning: '경고', xref: '상호 참조',
    history: '이력: 대체된 기능', abbreviations: '약어 목록', glossary: '용어집', images: '그림 목록', faq: '자주 묻는 질문(FAQ)',
  },
  ms: {
    native: 'Bahasa Melayu', manualTitle: 'Manual Pengguna oneSCM', exportedOn: 'Dieksport pada', asOf: 'Status pada', unfiltered: 'tanpa penapis', filter: 'Penapis',
    roles: 'Peranan', divisions: 'Bahagian', market: 'Pasaran', markets: 'Pasaran', release: 'Keluaran', blueprint: 'Blueprint (tanpa kandungan khusus pasaran)',
    approvedVersion: 'Versi diluluskan', dated: 'bertarikh', validFrom: 'Sah mulai', contents: 'Kandungan', page: 'Halaman', of: 'daripada', draft: 'Draf',
    note: 'Nota', tip: 'Petua', warning: 'Amaran', xref: 'Rujukan silang',
    history: 'Sejarah: fungsi yang diganti', abbreviations: 'Senarai singkatan', glossary: 'Glosari', images: 'Senarai rajah', faq: 'Soalan lazim (FAQ)',
  },
};
T['de-ch'] = { ...T.de, native: 'Deutsch (Schweiz)' };
T['fr-ch'] = { ...T.fr, native: 'Français (Suisse)' };

export const FRAME_LANGUAGES = Object.keys(T);
/** Rahmentexte einer Sprache; unbekannte Sprachen bekommen Englisch, Deutsch bleibt Standard */
export function frameTexts(language: string | null | undefined = 'de'): FrameTexts {
  const l = (language ?? 'de').toLowerCase();
  return T[l] ?? T[l.split('-')[0]] ?? T.en;
}
export const pageLine = (f: FrameTexts, page: number, pages: number) => `${f.page} ${page} ${f.of} ${pages}`;
