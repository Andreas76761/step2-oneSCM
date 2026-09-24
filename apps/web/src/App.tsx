import { useCallback, useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { currentUserId, get, setCurrentUserId } from './api';
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
  { to: '/freigabe', label: 'Freigabe', icon: '✅' },
  { to: '/export', label: 'Export', icon: '📤' },
  { to: '/traceability', label: 'Traceability', icon: '🔗' },
  { to: '/einstellungen', label: 'Einstellungen', icon: '⚙' },
];

export function App() {
  const [ref, setRef] = useState<Reference | null>(null);
  const [userId, setUser] = useState(currentUserId());
  const [toast, setToast] = useState<{ msg: string; kind: 'ok' | 'error' } | null>(null);

  const reloadRef = useCallback(() => {
    get<Reference>('/reference').then(setRef).catch(() => setRef(null));
  }, []);
  useEffect(reloadRef, [reloadRef]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.kind === 'error' ? 9000 : 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const setUserId = (id: string) => {
    setCurrentUserId(id);
    setUser(id);
  };
  const user = ref?.users.find((u) => u.id === userId);

  return (
    <AppCtx.Provider value={{ ref, reloadRef, notify: (msg, kind = 'ok') => setToast({ msg, kind }), userId, setUserId }}>
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <strong>oneSCM Handbook Studio</strong>
            <span>v0.1 · Etappe 1</span>
          </div>
          <nav aria-label="Hauptnavigation">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                <span aria-hidden="true">{n.icon}</span> {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="user-box">
            <label htmlFor="user-select">Demo-Benutzer</label>
            <select id="user-select" value={userId} onChange={(e) => setUserId(e.target.value)}>
              {ref?.users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <small title="Technische Berechtigungen – getrennt von fachlichen Rollen (ADR-009)">Berechtigungen: {user?.permissions.join(', ') ?? '–'}</small>
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
            <Route path="/freigabe" element={<ApprovalPage />} />
            <Route path="/export" element={<ExportPage />} />
            <Route path="/traceability" element={<TraceabilityPage />} />
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
