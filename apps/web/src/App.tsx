import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import {
  ArchiveIcon, ArrowLeftRightIcon, BadgeCheckIcon, BadgeHelpIcon, BellIcon, BlocksIcon, BookAIcon, BookMarkedIcon, BookOpenIcon, BookOpenCheckIcon, BotIcon, BoxesIcon, CalendarDaysIcon, CarIcon, CaseSensitiveIcon, ChartLineIcon, ChartPieIcon, ChevronDownIcon, ChevronRightIcon, CircleCheckIcon, CircleHelpIcon, ClipboardListIcon, CompassIcon, ConstructionIcon, CopyIcon, CopyCheckIcon, DatabaseIcon, EllipsisIcon, FileInputIcon, FileOutputIcon, FilePenIcon, FileTextIcon, FilesIcon, FlagIcon, FolderInputIcon, FolderKanbanIcon, GaugeIcon, GitCompareIcon, GitCompareArrowsIcon, GroupIcon, HouseIcon, ImageIcon, ImagesIcon, LanguagesIcon, LayoutDashboardIcon, LibraryIcon, LifeBuoyIcon, LinkIcon, ListChecksIcon, ListFilterIcon, ListOrderedIcon, ListTreeIcon, LockIcon, MenuIcon, MessageCircleQuestionIcon, MessageSquareIcon, MessagesSquareIcon, NetworkIcon, NewspaperIcon, PaletteIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, PenLineIcon, PlugIcon, PuzzleIcon, RefreshCwIcon, RocketIcon, ScaleIcon, SearchCheckIcon, SettingsIcon, ShieldCheckIcon, SlidersHorizontalIcon, SparklesIcon, SpellCheckIcon, StickyNoteIcon, TagsIcon, TargetIcon, UserCogIcon, UserRoundSearchIcon, UsersIcon, UsersRoundIcon, WandSparklesIcon, XIcon, type LucideIcon,
} from 'lucide-react';
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { currentProjectId, currentUserId, get, setCurrentProjectId, setCurrentUserId } from './api';
import { initAuth, login, logout, type AuthConfig } from './auth';
import { AppCtx, permLabel, type Reference } from './components/ui';
import { Tour, tourDone } from './components/Tour';

const StartPage = lazy(() => import('./pages/Start').then((m) => ({ default: m.StartPage })));
// Seiten werden erst beim Aufruf geladen (Code-Splitting): kleineres Startpaket, schnellerer erster Aufbau
const ClustersPage = lazy(() => import('./pages/Clusters').then((m) => ({ default: m.ClustersPage })));
const ContradictionsPage = lazy(() => import('./pages/Contradictions').then((m) => ({ default: m.ContradictionsPage })));
const DashboardPage = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.DashboardPage })));
const DuplicatesPage = lazy(() => import('./pages/Duplicates').then((m) => ({ default: m.DuplicatesPage })));
const ExportPage = lazy(() => import('./pages/Export').then((m) => ({ default: m.ExportPage })));
const SearchPage = lazy(() => import('./pages/Search').then((m) => ({ default: m.SearchPage })));
const StylePage = lazy(() => import('./pages/Style').then((m) => ({ default: m.StylePage })));
const DiagramsPage = lazy(() => import('./pages/Diagrams').then((m) => ({ default: m.DiagramsPage })));
const FilteredViewPage = lazy(() => import('./pages/FilteredView').then((m) => ({ default: m.FilteredViewPage })));
const GeneratorPage = lazy(() => import('./pages/Generator').then((m) => ({ default: m.GeneratorPage })));
const OptimizationsPage = lazy(() => import('./pages/Optimizations').then((m) => ({ default: m.OptimizationsPage })));
const ApprovalPage = lazy(() => import('./pages/Approval').then((m) => ({ default: m.ApprovalPage })));
const SettingsPage = lazy(() => import('./pages/Settings').then((m) => ({ default: m.SettingsPage })));
const SourcesPage = lazy(() => import('./pages/Sources').then((m) => ({ default: m.SourcesPage })));
const TraceabilityPage = lazy(() => import('./pages/Traceability').then((m) => ({ default: m.TraceabilityPage })));
const WorkshopPage = lazy(() => import('./pages/Workshop').then((m) => ({ default: m.WorkshopPage })));
const TerminologyPage = lazy(() => import('./pages/Terminology').then((m) => ({ default: m.TerminologyPage })));
const EvidencePage = lazy(() => import('./pages/Evidence').then((m) => ({ default: m.EvidencePage })));
const ComparePage = lazy(() => import('./pages/Compare').then((m) => ({ default: m.ComparePage })));
const ProjectsPage = lazy(() => import('./pages/Projects').then((m) => ({ default: m.ProjectsPage })));
const UsersPage = lazy(() => import('./pages/Users').then((m) => ({ default: m.UsersPage })));
const ReleasesPage = lazy(() => import('./pages/Releases').then((m) => ({ default: m.ReleasesPage })));
const InboxPage = lazy(() => import('./pages/Discussion').then((m) => ({ default: m.InboxPage })));
const TranslationsPage = lazy(() => import('./pages/Translations').then((m) => ({ default: m.TranslationsPage })));
const TranslationMemoryPage = lazy(() => import('./pages/TranslationTools').then((m) => ({ default: m.TranslationMemoryPage })));
const TranslationGlossaryPage = lazy(() => import('./pages/TranslationTools').then((m) => ({ default: m.TranslationGlossaryPage })));
const AnalyticsPage = lazy(() => import('./pages/Analytics').then((m) => ({ default: m.AnalyticsPage })));
const AssistantPage = lazy(() => import('./pages/Assistant').then((m) => ({ default: m.AssistantPage })));
const IntegrationsPage = lazy(() => import('./pages/Integrations').then((m) => ({ default: m.IntegrationsPage })));
const ContextHelpAdminPage = lazy(() => import('./pages/ContextHelp').then((m) => ({ default: m.ContextHelpAdminPage })));
const ContextHelpPage = lazy(() => import('./pages/ContextHelp').then((m) => ({ default: m.ContextHelpPage })));
const OutlinesPage = lazy(() => import('./pages/Outlines').then((m) => ({ default: m.OutlinesPage })));
const DraftManualPage = lazy(() => import('./pages/DraftManual').then((m) => ({ default: m.DraftManualPage })));
const AbbreviationsPage = lazy(() => import('./pages/MasterData').then((m) => ({ default: m.AbbreviationsPage })));
const FaqPage = lazy(() => import('./pages/MasterData').then((m) => ({ default: m.FaqPage })));
const GlossaryPage = lazy(() => import('./pages/MasterData').then((m) => ({ default: m.GlossaryPage })));
const ImageIndexPage = lazy(() => import('./pages/MasterData').then((m) => ({ default: m.ImageIndexPage })));
const PlanningPage = lazy(() => import('./pages/MasterData').then((m) => ({ default: m.PlanningPage })));
const GuidancePage = lazy(() => import('./pages/Guidance').then((m) => ({ default: m.GuidancePage })));
const TextModulesPage = lazy(() => import('./pages/TextModules').then((m) => ({ default: m.TextModulesPage })));
const BeforeAfterPage = lazy(() => import('./pages/BeforeAfter').then((m) => ({ default: m.BeforeAfterPage })));
const TextVariantsPage = lazy(() => import('./pages/Audience').then((m) => ({ default: m.TextVariantsPage })));
const ProfileReviewsPage = lazy(() => import('./pages/Audience').then((m) => ({ default: m.ProfileReviewsPage })));
const RevisionsPage = lazy(() => import('./pages/Revisions').then((m) => ({ default: m.RevisionsPage })));
const AssessmentPage = lazy(() => import('./pages/Assessment').then((m) => ({ default: m.AssessmentPage })));
const LanguageErrorsPage = lazy(() => import('./pages/Assessment').then((m) => ({ default: m.LanguageErrorsPage })));
const ChapterAssistantPage = lazy(() => import('./pages/ChapterAssistant').then((m) => ({ default: m.ChapterAssistantPage })));
const PrintPage = lazy(() => import('./pages/Reader').then((m) => ({ default: m.PrintPage })));
const ReaderBookmarksPage = lazy(() => import('./pages/Reader').then((m) => ({ default: m.ReaderBookmarksPage })));
const ReaderFaqPage = lazy(() => import('./pages/Reader').then((m) => ({ default: m.ReaderFaqPage })));
const ReaderPage = lazy(() => import('./pages/Reader').then((m) => ({ default: m.ReaderPage })));
const MetadataOverviewPage = lazy(() => import('./pages/Metadata').then((m) => ({ default: m.MetadataOverviewPage })));
const MetadataChunksPage = lazy(() => import('./pages/Metadata').then((m) => ({ default: m.MetadataChunksPage })));
const MetadataQaPage = lazy(() => import('./pages/Metadata').then((m) => ({ default: m.MetadataQaPage })));
const AccessMatrixPage = lazy(() => import('./pages/Metadata').then((m) => ({ default: m.AccessMatrixPage })));
const DomainMapPage = lazy(() => import('./pages/Metadata').then((m) => ({ default: m.DomainMapPage })));
const MetadataLabelsPage = lazy(() => import('./pages/Metadata').then((m) => ({ default: m.MetadataLabelsPage })));
const SourceUpdatesPage = lazy(() => import('./pages/SourceUpdates').then((m) => ({ default: m.SourceUpdatesPage })));
const TicketReleasesPage = lazy(() => import('./pages/ReleaseLetters').then((m) => ({ default: m.TicketReleasesPage })));
const ReleaseLettersPage = lazy(() => import('./pages/ReleaseLetters').then((m) => ({ default: m.ReleaseLettersPage })));
const OutlineSourcesPage = lazy(() => import('./pages/Knowledge').then((m) => ({ default: m.OutlineSourcesPage })));
const KnowledgeNotesPage = lazy(() => import('./pages/Knowledge').then((m) => ({ default: m.KnowledgeNotesPage })));
const QuestionCatalogPage = lazy(() => import('./pages/QuestionCatalog').then((m) => ({ default: m.QuestionCatalogPage })));
const AnswerQualityPage = lazy(() => import('./pages/AnswerQuality').then((m) => ({ default: m.AnswerQualityPage })));
const SurveysPage = lazy(() => import('./pages/Surveys').then((m) => ({ default: m.SurveysPage })));
const MetaDuplicatesPage = lazy(() => import('./pages/MetaDuplicates').then((m) => ({ default: m.MetaDuplicatesPage })));
const HeadingsPage = lazy(() => import('./pages/Headings').then((m) => ({ default: m.HeadingsPage })));
const IngestPage = lazy(() => import('./pages/Ingest').then((m) => ({ default: m.IngestPage })));
const ImageArchivePage = lazy(() => import('./pages/ImageArchive').then((m) => ({ default: m.ImageArchivePage })));
const StructurePage = lazy(() => import('./pages/Structure').then((m) => ({ default: m.StructurePage })));
const TriagePage = lazy(() => import('./pages/Triage').then((m) => ({ default: m.TriagePage })));
const ContentDashboardPage = lazy(() => import('./pages/Triage').then((m) => ({ default: m.ContentDashboardPage })));
const AgentsPage = lazy(() => import('./pages/Agents').then((m) => ({ default: m.AgentsPage })));
const GoalPage = lazy(() => import('./pages/Agents').then((m) => ({ default: m.GoalPage })));
const WorkAreaPage = lazy(() => import('./pages/WorkAreas').then((m) => ({ default: m.WorkAreaPage })));
const FeedbackPage = lazy(() => import('./pages/Feedback').then((m) => ({ default: m.FeedbackPage })));

// Navigation nach Arbeitsablauf (ADR-053): Sammeln → Schreiben → Prüfen → Veröffentlichen; Selteneres unter „Weitere“
type NavItem = { to: string; label: string; icon: LucideIcon };
const NAV_GROUPS: { id: string; label: string; items: NavItem[] }[] = [
  // oneSCM_Metadaten (ADR-079): Quellen einlesen, je Überschrift labeln und befragen
  { id: 'metadaten', label: 'oneSCM_Metadaten', items: [
    { to: '/metadaten', label: 'Übersicht', icon: GaugeIcon },
    { to: '/metadaten/einlesen', label: 'Einlesen', icon: FileInputIcon },
    { to: '/metadaten/triage', label: 'Triage', icon: ListFilterIcon },
    { to: '/metadaten/inhalte', label: 'Inhalts-Dashboard', icon: ChartPieIcon },
    { to: '/metadaten/ueberschriften', label: 'Quellen je Überschrift', icon: ListTreeIcon },
    { to: '/metadaten/chunks', label: 'Chunks', icon: BlocksIcon },
    { to: '/metadaten/dubletten', label: 'Dubletten (alle Formate)', icon: CopyIcon },
    { to: '/metadaten/kapitel-quellen', label: 'Kapitel ↔ Quellen', icon: ArrowLeftRightIcon },
    { to: '/metadaten/wissensnotizen', label: 'Wissensnotizen', icon: StickyNoteIcon },
    { to: '/metadaten/fragen', label: 'Fragen & Antworten', icon: MessageCircleQuestionIcon },
    { to: '/metadaten/rueckfragen', label: 'Rückfragen', icon: CircleHelpIcon },
    { to: '/metadaten/qualitaet', label: 'Antwortqualität', icon: TargetIcon },
    { to: '/metadaten/befragung', label: 'Expertenbefragung', icon: UserRoundSearchIcon },
    { to: '/metadaten/zugriffsmatrix', label: 'Zugriffsmatrix', icon: ShieldCheckIcon },
    { to: '/metadaten/zuordnung', label: 'Zuordnung', icon: NetworkIcon },
    { to: '/metadaten/labels', label: 'Labels', icon: TagsIcon },
  ] },
  // Agenten in der App (ADR-100): Orchestrator, Aufgaben, Entscheidungen, Ziel-Abgleich GOAL
  { id: 'agenten', label: 'Agenten', items: [
    { to: '/agenten', label: 'Aufgaben & Entscheidungen', icon: BotIcon },
    { to: '/agenten/goal', label: 'GOAL – Ziel-Abgleich', icon: FlagIcon },
  ] },
  { id: 'sammeln', label: '1 Sammeln', items: [
    { to: '/quellen', label: 'Quellen', icon: FolderInputIcon },
    { to: '/quellenaenderungen', label: 'Quellenänderungen', icon: RefreshCwIcon },
    { to: '/cluster', label: 'Textcluster', icon: GroupIcon },
    { to: '/widersprueche', label: 'Widersprüche', icon: ScaleIcon },
    { to: '/dopplungen', label: 'Dopplungen', icon: CopyCheckIcon },
  ] },
  // Arbeitsbereiche (ADR-098): kommende Funktionen vorab dokumentieren, Backlog, interne Themen – nicht im Handbuch
  { id: 'bereiche', label: 'Pipeline, Backlog, Intern', items: [
    { to: '/pipeline', label: 'Pipeline', icon: ConstructionIcon },
    { to: '/backlog', label: 'Backlog', icon: ArchiveIcon },
    { to: '/intern', label: 'Intern', icon: LockIcon },
  ] },
  { id: 'schreiben', label: '2 Schreiben', items: [
    { to: '/kapitelsteuerung', label: 'Kapitelsteuerung', icon: SlidersHorizontalIcon },
    { to: '/kapitel-assistent', label: 'Kapitel-Assistent', icon: CompassIcon },
    { to: '/generator', label: 'Kapitelgenerator', icon: WandSparklesIcon },
    { to: '/werkstatt', label: 'Kapitelwerkstatt', icon: PenLineIcon },
    { to: '/draft-manual', label: 'Draft Manual', icon: FileTextIcon },
    { to: '/textbausteine', label: 'Textbausteine', icon: PuzzleIcon },
    { to: '/bilder', label: 'Bilder', icon: PaletteIcon },
    { to: '/bildarchiv', label: 'Bildarchiv', icon: ImagesIcon },
    { to: '/vorher-nachher', label: 'Vorher/Nachher', icon: GitCompareArrowsIcon },
  ] },
  { id: 'pruefen', label: '3 Prüfen', items: [
    { to: '/anleitungs-check', label: 'Anleitungs-Check', icon: ListChecksIcon },
    { to: '/kapitelbewertung', label: 'Kapitelbewertung', icon: BadgeCheckIcon },
    { to: '/ueberarbeitung', label: 'Überarbeitung', icon: FilePenIcon },
    { to: '/pruefprofile', label: 'Prüferprofile', icon: UsersRoundIcon },
    { to: '/rueckmeldungen', label: 'Rückmeldungen', icon: MessageSquareIcon },
    { to: '/schreibstil', label: 'Schreibstil', icon: SpellCheckIcon },
    { to: '/fehlerliste', label: 'Fehlerliste', icon: ClipboardListIcon },
    { to: '/terminologie', label: 'Terminologie', icon: BookAIcon },
    { to: '/evidenz', label: 'Evidenz', icon: SearchCheckIcon },
    { to: '/freigabe', label: 'Freigabe', icon: CircleCheckIcon },
  ] },
  { id: 'veroeffentlichen', label: '4 Veröffentlichen', items: [
    { to: '/lesen', label: 'Leseransicht', icon: BookOpenIcon },
    { to: '/export', label: 'Export', icon: FileOutputIcon },
    { to: '/textvarianten', label: 'Textvarianten', icon: FilesIcon },
    { to: '/veroeffentlichung', label: 'Veröffentlichung', icon: RocketIcon },
    { to: '/uebersetzungen', label: 'Übersetzungen', icon: LanguagesIcon },
    { to: '/uebersetzungen/speicher', label: 'Übersetzungsspeicher', icon: DatabaseIcon },
    { to: '/uebersetzungen/glossar', label: 'Glossar je Sprache', icon: BookMarkedIcon },
    { to: '/release-abgleich', label: 'Release-Abgleich', icon: GitCompareIcon },
    { to: '/releaseletter', label: 'Releaseletter', icon: NewspaperIcon },
  ] },
];
const NAV_MORE: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboardIcon },
  { to: '/rollen', label: 'Rollenansichten', icon: UsersIcon },
  { to: '/sparten', label: 'Spartenansichten', icon: CarIcon },
  { to: '/optimierungen', label: 'Optimierungen', icon: SparklesIcon },
  { to: '/assistent', label: 'Assistent', icon: MessagesSquareIcon },
  { to: '/kontexthilfe', label: 'Kontexthilfe', icon: LifeBuoyIcon },
  { to: '/analytik', label: 'Analytik', icon: ChartLineIcon },
  { to: '/traceability', label: 'Traceability', icon: LinkIcon },
  { to: '/projekte', label: 'Projekte', icon: FolderKanbanIcon },
  { to: '/benutzer', label: 'Benutzer', icon: UserCogIcon },
  { to: '/integrationen', label: 'Integrationen', icon: PlugIcon },
];

// Stammdaten (ADR-032): unten in der Navigation, mit Untermenü
const MASTER_DATA = [
  { to: '/stammdaten/inhaltsverzeichnis', label: 'Inhaltsverzeichnis', icon: ListOrderedIcon },
  { to: '/stammdaten/abkuerzungen', label: 'Abkürzungen', icon: CaseSensitiveIcon },
  { to: '/stammdaten/glossar', label: 'Glossar', icon: LibraryIcon },
  { to: '/stammdaten/bildverzeichnis', label: 'Bildverzeichnis', icon: ImageIcon },
  { to: '/stammdaten/faq', label: 'FAQ', icon: BadgeHelpIcon },
  { to: '/stammdaten/planung', label: 'Planung', icon: CalendarDaysIcon },
];

const COLLAPSE_KEY = 'onescm.nav.collapsed';
const THEME_KEY = 'onescm.theme';
type Theme = 'system' | 'light' | 'dark';
const readTheme = (): Theme => {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === 'light' || t === 'dark' ? t : 'system';
  } catch {
    return 'system';
  }
};
/** Darstellung (ADR-035): System, Hell oder Dunkel – über data-theme am Wurzelelement */
const applyTheme = (t: Theme) => {
  if (t === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
};
applyTheme(readTheme());
const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === '1';
  } catch {
    return false;
  }
};

export function App() {
  const [auth, setAuth] = useState<{ config: AuthConfig; signedIn: boolean } | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  useEffect(() => {
    initAuth()
      .then(({ config, user }) => setAuth({ config, signedIn: config.mode === 'demo' || !!user }))
      .catch((e) => setAuthError(String(e?.message ?? e)));
  }, []);

  if (authError) return <div className="login"><div className="card"><h1>Anmeldung nicht möglich</h1><p className="alert error">{authError}</p></div></div>;
  if (!auth) return <div className="login"><p className="muted">Lade …</p></div>;
  if (!auth.signedIn) {
    return (
      <div className="login">
        <div className="card">
          <h1>oneSCM Handbook Studio</h1>
          <p className="muted">Bitte melden Sie sich mit Ihrem Unternehmenskonto an.</p>
          <button className="btn primary" onClick={() => void login()}>Anmelden</button>
        </div>
      </div>
    );
  }
  return <Studio mode={auth.config.mode} />;
}

function Studio({ mode }: { mode: 'demo' | 'oidc' }) {
  const [ref, setRef] = useState<Reference | null>(null);
  const [me, setMe] = useState<{ id: string; name: string; permissions: string[] } | null>(null);
  const [userId, setUser] = useState(currentUserId());
  const [toast, setToast] = useState<{ msg: string; kind: 'ok' | 'error'; id: number } | null>(null);
  const toastSeq = useRef(0);
  const [projects, setProjects] = useState<{ id: string; name: string; archivedAt: string | null }[]>([]);
  const projectId = currentProjectId();
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  // Einklappbare Navigation (nur Symbole); Zustand je Browser gemerkt
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const toggleCollapsed = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, c ? '0' : '1');
      } catch {
        /* ohne Speicher: nur für diese Sitzung */
      }
      return !c;
    });
  };
  const [theme, setTheme] = useState<Theme>(readTheme);
  const changeTheme = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      /* nur für diese Sitzung */
    }
  };
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  // Tastenkürzel „/“ fokussiert die Suche (nicht in Eingabefeldern)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || t.closest('input, textarea, select, [contenteditable="true"]')) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  // Waagerecht scrollende Tabellen ohne fokussierbaren Inhalt per Tastatur erreichbar machen (WCAG 2.1.1, axe
  // scrollable-region-focusable) – mobil werden Tabellen zum Scrollbereich (styles.css); gilt für alle Seiten
  useEffect(() => {
    const focusable = 'a[href], button, input, select, textarea, [tabindex]';
    const update = () => {
      for (const t of document.querySelectorAll<HTMLElement>('.table, .table-wrap')) {
        const scrolls = t.scrollWidth > t.clientWidth + 1 && getComputedStyle(t).overflowX !== 'visible';
        const needsStop = scrolls && !t.querySelector(focusable);
        // nur selbst gesetzte Tabstopps wieder entfernen
        if (needsStop && !t.hasAttribute('tabindex')) {
          t.setAttribute('tabindex', '0');
          t.dataset.scrollStop = '';
        } else if (!needsStop && t.dataset.scrollStop !== undefined) {
          t.removeAttribute('tabindex');
          delete t.dataset.scrollStop;
        }
      }
    };
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
  // Fixierte erste Spalte (z. B. Zugriffsmatrix): Beim Tabben schiebt der Browser das Feld nur knapp ins Bild und
  // damit unter die fixierte Spalte. Dann den Scrollbereich so weit schieben, dass der Fokus sichtbar ist (WCAG 2.4.11).
  useEffect(() => {
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement;
      const row = el.closest?.('tr');
      if (!row) return;
      let box: HTMLElement | null = row.parentElement;
      while (box && !(box.scrollWidth > box.clientWidth + 1 && getComputedStyle(box).overflowX !== 'visible')) box = box.parentElement;
      if (!box) return;
      const r = el.getBoundingClientRect();
      for (const cell of row.querySelectorAll<HTMLElement>(':scope > th, :scope > td')) {
        if (cell.contains(el) || getComputedStyle(cell).position !== 'sticky') continue;
        const c = cell.getBoundingClientRect();
        if (r.left < c.right && r.right > c.left) box.scrollLeft -= c.right - r.left + 8;
      }
    };
    document.addEventListener('focusin', onFocus);
    return () => document.removeEventListener('focusin', onFocus);
  }, []);
  // Einführung (ADR-056): beim ersten Besuch der Startseite; automatisierte Browser (Tests) starten sie nicht selbst
  const [tourOpen, setTourOpen] = useState(false);
  useEffect(() => {
    if (location.pathname === '/' && !tourDone() && !navigator.webdriver) setTourOpen(true);
  }, [location.pathname]);
  const inMore = NAV_MORE.some((n) => location.pathname === n.to || location.pathname.startsWith(`${n.to}/`));
  const [moreOpen, setMoreOpen] = useState(inMore);
  useEffect(() => {
    if (inMore) setMoreOpen(true);
  }, [inMore]);
  const inMasterData = location.pathname.startsWith('/stammdaten');
  const [masterOpen, setMasterOpen] = useState(inMasterData);
  useEffect(() => {
    if (inMasterData) setMasterOpen(true);
  }, [inMasterData]);
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const navigationType = useNavigationType();
  const userNavigated = useRef(false);
  const [unread, setUnread] = useState(0);
  const reloadUnread = useCallback(() => {
    get<any>('/notifications?unread=true').then((n) => setUnread(n.unread)).catch(() => setUnread(0));
  }, []);
  useEffect(() => {
    reloadUnread();
    const t = setInterval(reloadUnread, 30_000);
    return () => clearInterval(t);
  }, [reloadUnread, userId, location.pathname]);
  // Nach einem Seitenwechsel: Menü schließen und Fokus auf die Seitenüberschrift setzen (WCAG 2.4.3)
  useEffect(() => {
    setNavOpen(false);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Weiterleitungen beim ersten Laden (z. B. /stammdaten → Inhaltsverzeichnis) sind kein Seitenwechsel:
    // Der Fokus bleibt am Seitenanfang, der erste Tabstopp ist „Zum Inhalt springen“.
    if (navigationType === 'REPLACE' && !userNavigated.current) return;
    userNavigated.current = true;
    const t = setTimeout(() => {
      const h1 = mainRef.current?.querySelector<HTMLElement>('h1');
      if (h1) {
        h1.tabIndex = -1;
        h1.focus({ preventScroll: false });
      }
    }, 50);
    return () => clearTimeout(t);
  }, [location.pathname]);
  const reloadProjects = useCallback(() => {
    get<any[]>('/projects').then((list) => {
      setProjects(list);
      // Gewähltes Projekt nicht (mehr) zugänglich → Standardprojekt
      if (list.length && !list.some((p) => p.id === currentProjectId())) switchProject(list[0].id);
    }).catch(() => setProjects([]));
  }, []);

  const reloadRef = useCallback(() => {
    get<Reference>('/reference').then(setRef).catch(() => setRef(null));
  }, []);
  useEffect(reloadRef, [reloadRef]);
  useEffect(() => {
    get('/me').then(setMe).catch(() => setMe(null));
    reloadProjects();
  }, [userId, reloadProjects]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.kind === 'error' ? 9000 : 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const setUserId = (id: string) => {
    setCurrentUserId(id);
    setUser(id);
  };

  return (
    <AppCtx.Provider value={{ ref, reloadRef, notify: (msg, kind = 'ok') => setToast({ msg, kind, id: ++toastSeq.current }), userId, setUserId }}>
      <a className="skip-link" href="#main">Zum Inhalt springen</a>
      <div className={`shell${collapsed ? " nav-collapsed" : ""}`}>
        <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
          <div className="brand">
            <strong><BookOpenCheckIcon className="brand-logo" aria-hidden="true" size={22} strokeWidth={2} />oneSCM Handbook Studio</strong>
            <span>v{__APP_VERSION__}</span>
            <button type="button" className="collapse-toggle" aria-expanded={!collapsed} aria-controls="main-nav" aria-label={collapsed ? 'Navigation ausklappen' : 'Navigation einklappen'} title={collapsed ? 'Navigation ausklappen' : 'Navigation einklappen'} onClick={toggleCollapsed}>
              {collapsed ? <PanelLeftOpenIcon aria-hidden="true" size={18} /> : <PanelLeftCloseIcon aria-hidden="true" size={18} />}
            </button>
          </div>
          <div className="project-box">
            <label htmlFor="project-select">Projekt</label>
            <select id="project-select" value={projectId} onChange={(e) => switchProject(e.target.value)}>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}{p.archivedAt ? ' (archiviert)' : ''}</option>)}
              {!projects.some((p) => p.id === projectId) && <option value={projectId}>{projectId}</option>}
            </select>
          </div>
          <form role="search" className="nav-search" onSubmit={(e) => { e.preventDefault(); if (search.trim().length >= 2) navigate(`/suche?q=${encodeURIComponent(search.trim())}`); }}>
            <label htmlFor="global-search" className="sr-only">Suche im Projekt</label>
            <input id="global-search" ref={searchRef} type="search" placeholder="Suchen … ( / )" value={search} onChange={(e) => setSearch(e.target.value)} />
          </form>
          <button className="btn nav-toggle" aria-expanded={navOpen} aria-controls="main-nav" onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <><XIcon aria-hidden="true" size={18} /> Menü schließen</> : <><MenuIcon aria-hidden="true" size={18} /> Menü</>}
          </button>
          <nav id="main-nav" aria-label="Hauptnavigation" className={navOpen ? 'open' : ''}>
            <NavLink to="/aufgaben" title="Aufgaben & Hinweise" className={({ isActive }) => (isActive ? 'active' : '')}>
              <BellIcon className="nav-icon" aria-hidden="true" size={18} strokeWidth={1.75} /> <span className="nav-label">Aufgaben & Hinweise</span>{unread > 0 && <span className="count" aria-label={`${unread} ungelesen`}>{unread}</span>}
            </NavLink>
            <NavLink to="/" end title="Start" className={({ isActive }) => (isActive ? 'active' : '')}>
              <HouseIcon className="nav-icon" aria-hidden="true" size={18} strokeWidth={1.75} /> <span className="nav-label">Start</span>
            </NavLink>
            {NAV_GROUPS.map((g) => (
              <div key={g.id} role="group" aria-labelledby={`nav-h-${g.id}`} className="nav-section">
                <span id={`nav-h-${g.id}`} className="nav-heading">{g.label}</span>
                {g.items.map((n) => (
                  // Übersicht nur bei genauer Übereinstimmung aktiv, wenn Unterseiten eigene Einträge haben
                  <NavLink key={n.to} to={n.to} end={g.items.some((o) => o.to.startsWith(`${n.to}/`))} title={n.label} className={({ isActive }) => (isActive ? 'active' : '')}>
                    <n.icon className="nav-icon" aria-hidden="true" size={18} strokeWidth={1.75} /> <span className="nav-label">{n.label}</span>
                  </NavLink>
                ))}
              </div>
            ))}
            <button type="button" className={`nav-group${inMore ? ' active-group' : ''}`} aria-expanded={moreOpen} aria-controls="nav-weitere" title="Weitere" onClick={() => setMoreOpen(!moreOpen)}>
              <EllipsisIcon className="nav-icon" aria-hidden="true" size={18} strokeWidth={1.75} /> <span className="nav-label">Weitere</span><span aria-hidden="true" className="nav-caret">{moreOpen ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}</span>
            </button>
            <div id="nav-weitere" className="nav-sub" hidden={!moreOpen}>
              {NAV_MORE.map((n) => (
                <NavLink key={n.to} to={n.to} title={n.label} className={({ isActive }) => (isActive ? 'active' : '')}>
                  <n.icon className="nav-icon" aria-hidden="true" size={18} strokeWidth={1.75} /> <span className="nav-label">{n.label}</span>
                </NavLink>
              ))}
            </div>
            <div className="nav-bottom">
              <button type="button" className={`nav-group${inMasterData ? ' active-group' : ''}`} aria-expanded={masterOpen} aria-controls="nav-stammdaten" title="Stammdaten" onClick={() => setMasterOpen(!masterOpen)}>
                <BoxesIcon className="nav-icon" aria-hidden="true" size={18} strokeWidth={1.75} /> <span className="nav-label">Stammdaten</span><span aria-hidden="true" className="nav-caret">{masterOpen ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}</span>
              </button>
              <div id="nav-stammdaten" className="nav-sub" hidden={!masterOpen}>
                {MASTER_DATA.map((n) => (
                  <NavLink key={n.to} to={n.to} title={n.label} className={({ isActive }) => (isActive ? 'active' : '')}>
                    <n.icon className="nav-icon" aria-hidden="true" size={18} strokeWidth={1.75} /> <span className="nav-label">{n.label}</span>
                  </NavLink>
                ))}
              </div>
              <NavLink to="/einstellungen" title="Einstellungen" className={({ isActive }) => (isActive ? 'active' : '')}>
                <SettingsIcon className="nav-icon" aria-hidden="true" size={18} strokeWidth={1.75} /> <span className="nav-label">Einstellungen</span>
              </NavLink>
            </div>
          </nav>
          <div className="user-box">
            {mode === 'demo' ? (
              <>
                <label htmlFor="user-select">Demo-Benutzer</label>
                <select id="user-select" value={userId} onChange={(e) => setUserId(e.target.value)}>
                  {ref?.users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <span>Angemeldet als</span>
                <strong className="user-name">{me?.name ?? '…'}</strong>
                <button className="btn small" onClick={() => void logout()}>Abmelden</button>
              </>
            )}
            <button id="tour-restart" type="button" className="btn small" onClick={() => { navigate('/'); setTourOpen(true); }}>Einführung</button>
            <label htmlFor="theme-select">Darstellung</label>
            <select id="theme-select" value={theme} onChange={(e) => changeTheme(e.target.value as Theme)}>
              <option value="system">wie System</option>
              <option value="light">Hell</option>
              <option value="dark">Dunkel</option>
            </select>
            <small title="Technische Berechtigungen – getrennt von fachlichen Rollen (ADR-009)">Berechtigungen: {me?.permissions.map(permLabel).join(', ') || '–'}</small>
          </div>
        </aside>
        <main className="main" key={userId} id="main" ref={mainRef} tabIndex={-1}>
          <Suspense fallback={<p className="muted page-loading" role="status">Lade …</p>}>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/anleitungs-check" element={<GuidancePage />} />
            <Route path="/anleitungs-check/:versionId" element={<GuidancePage />} />
            <Route path="/kapitelbewertung" element={<AssessmentPage />} />
            <Route path="/kapitelbewertung/:versionId" element={<AssessmentPage />} />
            <Route path="/fehlerliste" element={<LanguageErrorsPage />} />
            <Route path="/ueberarbeitung" element={<RevisionsPage />} />
            <Route path="/pruefprofile" element={<ProfileReviewsPage />} />
            <Route path="/textvarianten" element={<TextVariantsPage />} />
            <Route path="/ueberarbeitung/:batchId" element={<RevisionsPage />} />
            <Route path="/kapitel-assistent" element={<ChapterAssistantPage />} />
            <Route path="/lesen" element={<ReaderPage />} />
            <Route path="/lesen/druck" element={<PrintPage />} />
            <Route path="/lesen/faq" element={<ReaderFaqPage />} />
            <Route path="/lesen/lesezeichen" element={<ReaderBookmarksPage />} />
            <Route path="/rueckmeldungen" element={<FeedbackPage />} />
            <Route path="/lesen/:chapterId" element={<ReaderPage />} />
            <Route path="/metadaten" element={<MetadataOverviewPage />} />
            <Route path="/metadaten/chunks" element={<MetadataChunksPage />} />
            <Route path="/metadaten/fragen" element={<MetadataQaPage />} />
            <Route path="/metadaten/zugriffsmatrix" element={<AccessMatrixPage />} />
            <Route path="/metadaten/zuordnung" element={<DomainMapPage />} />
            <Route path="/metadaten/kapitel-quellen" element={<OutlineSourcesPage />} />
            <Route path="/metadaten/wissensnotizen" element={<KnowledgeNotesPage />} />
            <Route path="/metadaten/einlesen" element={<IngestPage />} />
            <Route path="/metadaten/ueberschriften" element={<HeadingsPage />} />
            <Route path="/metadaten/dubletten" element={<MetaDuplicatesPage />} />
            <Route path="/metadaten/rueckfragen" element={<QuestionCatalogPage />} />
            <Route path="/metadaten/qualitaet" element={<AnswerQualityPage />} />
            <Route path="/metadaten/befragung" element={<SurveysPage />} />
            <Route path="/release-abgleich" element={<TicketReleasesPage />} />
            <Route path="/releaseletter" element={<ReleaseLettersPage />} />
            <Route path="/metadaten/labels" element={<MetadataLabelsPage />} />
            <Route path="/quellen" element={<SourcesPage />} />
            <Route path="/quellenaenderungen" element={<SourceUpdatesPage />} />
            <Route path="/cluster" element={<ClustersPage />} />
            <Route path="/widersprueche" element={<ContradictionsPage />} />
            <Route path="/dopplungen" element={<DuplicatesPage />} />
            <Route path="/generator" element={<GeneratorPage />} />
            <Route path="/werkstatt" element={<WorkshopPage />} />
            <Route path="/werkstatt/:chapterId" element={<WorkshopPage />} />
            <Route path="/rollen" element={<FilteredViewPage mode="role" />} />
            <Route path="/sparten" element={<FilteredViewPage mode="division" />} />
            <Route path="/optimierungen" element={<OptimizationsPage />} />
            <Route path="/terminologie" element={<TerminologyPage />} />
            <Route path="/evidenz" element={<EvidencePage />} />
            <Route path="/evidenz/:versionId" element={<EvidencePage />} />
            <Route path="/vergleich/:chapterId" element={<ComparePage />} />
            <Route path="/freigabe" element={<ApprovalPage />} />
            <Route path="/export" element={<ExportPage />} />
            <Route path="/bildarchiv" element={<ImageArchivePage />} />
            <Route path="/vorher-nachher" element={<BeforeAfterPage />} />
            <Route path="/textbausteine" element={<TextModulesPage />} />
            <Route path="/kapitelsteuerung" element={<StructurePage />} />
            <Route path="/metadaten/triage" element={<TriagePage />} />
            <Route path="/metadaten/inhalte" element={<ContentDashboardPage />} />
            <Route path="/agenten" element={<AgentsPage />} />
            <Route path="/agenten/goal" element={<GoalPage />} />
            <Route path="/pipeline" element={<WorkAreaPage area="pipeline" />} />
            <Route path="/backlog" element={<WorkAreaPage area="backlog" />} />
            <Route path="/intern" element={<WorkAreaPage area="intern" />} />
            <Route path="/veroeffentlichung" element={<ReleasesPage />} />
            <Route path="/uebersetzungen" element={<TranslationsPage />} />
            <Route path="/uebersetzungen/speicher" element={<TranslationMemoryPage />} />
            <Route path="/uebersetzungen/glossar" element={<TranslationGlossaryPage />} />
            <Route path="/aufgaben" element={<InboxPage onRead={reloadUnread} />} />
            <Route path="/analytik" element={<AnalyticsPage />} />
            <Route path="/assistent" element={<AssistantPage />} />
            <Route path="/integrationen" element={<IntegrationsPage />} />
            <Route path="/draft-manual" element={<DraftManualPage />} />
            <Route path="/draft-manual/:outlineId" element={<DraftManualPage />} />
            <Route path="/stammdaten" element={<Navigate to="/stammdaten/inhaltsverzeichnis" replace />} />
            <Route path="/stammdaten/inhaltsverzeichnis" element={<OutlinesPage />} />
            <Route path="/stammdaten/inhaltsverzeichnis/:outlineId" element={<OutlinesPage />} />
            <Route path="/stammdaten/abkuerzungen" element={<AbbreviationsPage />} />
            <Route path="/stammdaten/glossar" element={<GlossaryPage />} />
            <Route path="/stammdaten/bildverzeichnis" element={<ImageIndexPage />} />
            <Route path="/stammdaten/faq" element={<FaqPage />} />
            <Route path="/stammdaten/planung" element={<PlanningPage />} />
            <Route path="/kontexthilfe" element={<ContextHelpAdminPage />} />
            <Route path="/hilfe/:contextKey" element={<ContextHelpPage />} />
            <Route path="/traceability" element={<TraceabilityPage />} />
            <Route path="/suche" element={<SearchPage />} />
            <Route path="/schreibstil" element={<StylePage />} />
            <Route path="/bilder" element={<DiagramsPage />} />
            <Route path="/projekte" element={<ProjectsPage onChanged={reloadProjects} />} />
            <Route path="/benutzer" element={<UsersPage />} />
            <Route path="/einstellungen" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </Suspense>
        </main>
        {tourOpen && <Tour onClose={() => setTourOpen(false)} />}
        {/* Ansage für Screenreader (WCAG 4.1.3): Die Live-Regionen sind immer vorhanden, sonst bleibt eine neu eingefügte Meldung oft
            stumm. Jede Meldung ist ein neuer Knoten, damit auch dieselbe Meldung ein zweites Mal angesagt wird; Fehler sofort (alert). */}
        <div role="status" aria-live="polite" aria-atomic="true" data-live="status">
          {toast?.kind === 'ok' && <div key={toast.id} className="toast ok">{toast.msg}</div>}
        </div>
        <div role="alert" aria-atomic="true" data-live="alert">
          {toast?.kind === 'error' && <div key={toast.id} className="toast error">{toast.msg}</div>}
        </div>
      </div>
    </AppCtx.Provider>
  );
}

/** Projektwechsel: alle geladenen Daten gehören zum bisherigen Projekt – daher neu starten (Dashboard). */
function switchProject(id: string) {
  if (id === currentProjectId()) return;
  setCurrentProjectId(id);
  window.location.assign('/');
}
