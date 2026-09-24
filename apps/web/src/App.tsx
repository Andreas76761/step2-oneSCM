import { useCallback, useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { currentProjectId, currentUserId, get, setCurrentProjectId, setCurrentUserId } from './api';
import { initAuth, login, logout, type AuthConfig } from './auth';
import { AppCtx, type Reference } from './components/ui';
import { ClustersPage } from './pages/Clusters';
import { ContradictionsPage } from './pages/Contradictions';
import { DashboardPage } from './pages/Dashboard';
import { DuplicatesPage } from './pages/Duplicates';
import { ExportPage } from './pages/Export';
import { FilteredViewPage } from './pages/FilteredView';
import { GeneratorPage } from './pages/Generator';
import { OptimizationsPage } from './pages/Optimizations';
import { ApprovalPage } from './pages/Approval';
import { SettingsPage } from './pages/Settings';
import { SourcesPage } from './pages/Sources';
import { TraceabilityPage } from './pages/Traceability';
import { WorkshopPage } from './pages/Workshop';
import { TerminologyPage } from './pages/Terminology';
import { EvidencePage } from './pages/Evidence';
import { ComparePage } from './pages/Compare';
import { ProjectsPage } from './pages/Projects';

// Navigation gemäß Masterprompt §14
const NAV = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/quellen', label: 'Quellen', icon: '📥' },
  { to: '/cluster', label: 'Textcluster', icon: '🧩' },
  { to: '/widersprueche', label: 'Widersprüche', icon: '⚖️' },
  { to: '/dopplungen', label: 'Dopplungen', icon: '📑' },
  { to: '/generator', label: 'Kapitelgenerator', icon: '⚙️' },
  { to: '/werkstatt', label: 'Kapitelwerkstatt', icon: '✏️' },
  { to: '/rollen', label: 'Rollenansichten', icon: '👥' },
  { to: '/sparten', label: 'Spartenansichten', icon: '🚘' },
  { to: '/optimierungen', label: 'Optimierungen', icon: '✨' },
  { to: '/terminologie', label: 'Terminologie', icon: '📖' },
  { to: '/evidenz', label: 'Evidenz', icon: '🔎' },
  { to: '/freigabe', label: 'Freigabe', icon: '✅' },
  { to: '/export', label: 'Export', icon: '📤' },
  { to: '/traceability', label: 'Traceability', icon: '🔗' },
  { to: '/projekte', label: 'Projekte', icon: '🗂️' },
  { to: '/einstellungen', label: 'Einstellungen', icon: '⚙' },
];

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
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <strong>oneSCM Handbook Studio</strong>
            <span>v{__APP_VERSION__}</span>
          </div>
          <div className="project-box">
            <label htmlFor="project-select">Projekt</label>
            <select id="project-select" value={projectId} onChange={(e) => switchProject(e.target.value)}>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}{p.archivedAt ? ' (archiviert)' : ''}</option>)}
              {!projects.some((p) => p.id === projectId) && <option value={projectId}>{projectId}</option>}
            </select>
          </div>
          <nav aria-label="Hauptnavigation">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                <span aria-hidden="true">{n.icon}</span> {n.label}
              </NavLink>
            ))}
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
            <small title="Technische Berechtigungen – getrennt von fachlichen Rollen (ADR-009)">Berechtigungen: {me?.permissions.join(', ') || '–'}</small>
          </div>
        </aside>
        <main className="main" key={userId}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
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
            <Route path="/traceability" element={<TraceabilityPage />} />
            <Route path="/projekte" element={<ProjectsPage onChanged={reloadProjects} />} />
            <Route path="/einstellungen" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
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
