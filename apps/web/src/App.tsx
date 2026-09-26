import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { currentProjectId, currentUserId, get, setCurrentProjectId, setCurrentUserId } from './api';
import { initAuth, login, logout, type AuthConfig } from './auth';
import { AppCtx, type Reference } from './components/ui';
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
const ChapterAssistantPage = lazy(() => import('./pages/ChapterAssistant').then((m) => ({ default: m.ChapterAssistantPage })));
const PrintPage = lazy(() => import('./pages/Reader').then((m) => ({ default: m.PrintPage })));
const ReaderFaqPage = lazy(() => import('./pages/Reader').then((m) => ({ default: m.ReaderFaqPage })));
const ReaderPage = lazy(() => import('./pages/Reader').then((m) => ({ default: m.ReaderPage })));
const FeedbackPage = lazy(() => import('./pages/Feedback').then((m) => ({ default: m.FeedbackPage })));

// Navigation nach Arbeitsablauf (ADR-053): Sammeln → Schreiben → Prüfen → Veröffentlichen; Selteneres unter „Weitere“
type NavItem = { to: string; label: string; icon: string };
const NAV_GROUPS: { id: string; label: string; items: NavItem[] }[] = [
  { id: 'sammeln', label: '1 Sammeln', items: [
    { to: '/quellen', label: 'Quellen', icon: '📥' },
    { to: '/cluster', label: 'Textcluster', icon: '🧩' },
    { to: '/widersprueche', label: 'Widersprüche', icon: '⚖️' },
    { to: '/dopplungen', label: 'Dopplungen', icon: '📑' },
  ] },
  { id: 'schreiben', label: '2 Schreiben', items: [
    { to: '/kapitel-assistent', label: 'Kapitel-Assistent', icon: '🧭' },
    { to: '/generator', label: 'Kapitelgenerator', icon: '⚙️' },
    { to: '/werkstatt', label: 'Kapitelwerkstatt', icon: '✏️' },
    { to: '/draft-manual', label: 'Draft Manual', icon: '📝' },
    { to: '/bilder', label: 'Bilder', icon: '🎨' },
  ] },
  { id: 'pruefen', label: '3 Prüfen', items: [
    { to: '/anleitungs-check', label: 'Anleitungs-Check', icon: '🔍' },
    { to: '/rueckmeldungen', label: 'Rückmeldungen', icon: '💬' },
    { to: '/schreibstil', label: 'Schreibstil', icon: '🖋️' },
    { to: '/terminologie', label: 'Terminologie', icon: '📖' },
    { to: '/evidenz', label: 'Evidenz', icon: '🔎' },
    { to: '/freigabe', label: 'Freigabe', icon: '✅' },
  ] },
  { id: 'veroeffentlichen', label: '4 Veröffentlichen', items: [
    { to: '/lesen', label: 'Leseransicht', icon: '📖' },
    { to: '/export', label: 'Export', icon: '📤' },
    { to: '/veroeffentlichung', label: 'Veröffentlichung', icon: '📚' },
    { to: '/uebersetzungen', label: 'Übersetzungen', icon: '🌐' },
  ] },
];
const NAV_MORE: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/rollen', label: 'Rollenansichten', icon: '👥' },
  { to: '/sparten', label: 'Spartenansichten', icon: '🚘' },
  { to: '/optimierungen', label: 'Optimierungen', icon: '✨' },
  { to: '/assistent', label: 'Assistent', icon: '💬' },
  { to: '/kontexthilfe', label: 'Kontexthilfe', icon: '❓' },
  { to: '/analytik', label: 'Analytik', icon: '📈' },
  { to: '/traceability', label: 'Traceability', icon: '🔗' },
  { to: '/projekte', label: 'Projekte', icon: '🗂️' },
  { to: '/benutzer', label: 'Benutzer', icon: '👤' },
  { to: '/integrationen', label: 'Integrationen', icon: '🔌' },
];

// Stammdaten (ADR-032): unten in der Navigation, mit Untermenü
const MASTER_DATA = [
  { to: '/stammdaten/inhaltsverzeichnis', label: 'Inhaltsverzeichnis', icon: '🗂' },
  { to: '/stammdaten/abkuerzungen', label: 'Abkürzungen', icon: '🔤' },
  { to: '/stammdaten/glossar', label: 'Glossar', icon: '📘' },
  { to: '/stammdaten/bildverzeichnis', label: 'Bildverzeichnis', icon: '🖼️' },
  { to: '/stammdaten/faq', label: 'FAQ', icon: '❔' },
  { to: '/stammdaten/planung', label: 'Planung', icon: '📅' },
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
  const [toast, setToast] = useState<{ msg: string; kind: 'ok' | 'error' } | null>(null);
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
    <AppCtx.Provider value={{ ref, reloadRef, notify: (msg, kind = 'ok') => setToast({ msg, kind }), userId, setUserId }}>
      <a className="skip-link" href="#main">Zum Inhalt springen</a>
      <div className={`shell${collapsed ? " nav-collapsed" : ""}`}>
        <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
          <div className="brand">
            <strong>oneSCM Handbook Studio</strong>
            <span>v{__APP_VERSION__}</span>
            <button type="button" className="collapse-toggle" aria-expanded={!collapsed} aria-controls="main-nav" aria-label={collapsed ? 'Navigation ausklappen' : 'Navigation einklappen'} title={collapsed ? 'Navigation ausklappen' : 'Navigation einklappen'} onClick={toggleCollapsed}>
              {collapsed ? '»' : '«'}
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
            {navOpen ? '✕ Menü schließen' : '☰ Menü'}
          </button>
          <nav id="main-nav" aria-label="Hauptnavigation" className={navOpen ? 'open' : ''}>
            <NavLink to="/aufgaben" title="Aufgaben & Hinweise" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span aria-hidden="true" className="nav-icon">🔔</span> <span className="nav-label">Aufgaben & Hinweise</span>{unread > 0 && <span className="count" aria-label={`${unread} ungelesen`}>{unread}</span>}
            </NavLink>
            <NavLink to="/" end title="Start" className={({ isActive }) => (isActive ? 'active' : '')}>
              <span aria-hidden="true" className="nav-icon">🏠</span> <span className="nav-label">Start</span>
            </NavLink>
            {NAV_GROUPS.map((g) => (
              <div key={g.id} role="group" aria-labelledby={`nav-h-${g.id}`} className="nav-section">
                <span id={`nav-h-${g.id}`} className="nav-heading">{g.label}</span>
                {g.items.map((n) => (
                  <NavLink key={n.to} to={n.to} title={n.label} className={({ isActive }) => (isActive ? 'active' : '')}>
                    <span aria-hidden="true" className="nav-icon">{n.icon}</span> <span className="nav-label">{n.label}</span>
                  </NavLink>
                ))}
              </div>
            ))}
            <button type="button" className={`nav-group${inMore ? ' active-group' : ''}`} aria-expanded={moreOpen} aria-controls="nav-weitere" title="Weitere" onClick={() => setMoreOpen(!moreOpen)}>
              <span aria-hidden="true" className="nav-icon">⋯</span> <span className="nav-label">Weitere</span><span aria-hidden="true" className="nav-caret">{moreOpen ? '▾' : '▸'}</span>
            </button>
            <div id="nav-weitere" className="nav-sub" hidden={!moreOpen}>
              {NAV_MORE.map((n) => (
                <NavLink key={n.to} to={n.to} title={n.label} className={({ isActive }) => (isActive ? 'active' : '')}>
                  <span aria-hidden="true" className="nav-icon">{n.icon}</span> <span className="nav-label">{n.label}</span>
                </NavLink>
              ))}
            </div>
            <div className="nav-bottom">
              <button type="button" className={`nav-group${inMasterData ? ' active-group' : ''}`} aria-expanded={masterOpen} aria-controls="nav-stammdaten" title="Stammdaten" onClick={() => setMasterOpen(!masterOpen)}>
                <span aria-hidden="true" className="nav-icon">🗃</span> <span className="nav-label">Stammdaten</span><span aria-hidden="true" className="nav-caret">{masterOpen ? '▾' : '▸'}</span>
              </button>
              <div id="nav-stammdaten" className="nav-sub" hidden={!masterOpen}>
                {MASTER_DATA.map((n) => (
                  <NavLink key={n.to} to={n.to} title={n.label} className={({ isActive }) => (isActive ? 'active' : '')}>
                    <span aria-hidden="true" className="nav-icon">{n.icon}</span> <span className="nav-label">{n.label}</span>
                  </NavLink>
                ))}
              </div>
              <NavLink to="/einstellungen" title="Einstellungen" className={({ isActive }) => (isActive ? 'active' : '')}>
                <span aria-hidden="true" className="nav-icon">⚙</span> <span className="nav-label">Einstellungen</span>
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
            <small title="Technische Berechtigungen – getrennt von fachlichen Rollen (ADR-009)">Berechtigungen: {me?.permissions.join(', ') || '–'}</small>
          </div>
        </aside>
        <main className="main" key={userId} id="main" ref={mainRef} tabIndex={-1}>
          <Suspense fallback={<p className="muted page-loading" role="status">Lade …</p>}>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/anleitungs-check" element={<GuidancePage />} />
            <Route path="/anleitungs-check/:versionId" element={<GuidancePage />} />
            <Route path="/kapitel-assistent" element={<ChapterAssistantPage />} />
            <Route path="/lesen" element={<ReaderPage />} />
            <Route path="/lesen/druck" element={<PrintPage />} />
            <Route path="/lesen/faq" element={<ReaderFaqPage />} />
            <Route path="/rueckmeldungen" element={<FeedbackPage />} />
            <Route path="/lesen/:chapterId" element={<ReaderPage />} />
            <Route path="/quellen" element={<SourcesPage />} />
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
            <Route path="/veroeffentlichung" element={<ReleasesPage />} />
            <Route path="/uebersetzungen" element={<TranslationsPage />} />
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
        {toast && (
          <div className={`toast ${toast.kind}`} role="status" aria-live="polite">
            {toast.msg}
          </div>
        )}
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
