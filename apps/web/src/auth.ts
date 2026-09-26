// Anmeldung der Web-UI (ENTSCHEIDUNG E-15).
// demo: Demo-Benutzer über Header X-User-Id · oidc: Authorization Code Flow mit PKCE (oidc-client-ts)
// oidc-client-ts wird nur im OIDC-Modus nachgeladen (Demo-Betrieb lädt die Bibliothek nie)
import type { UserManager, User as OidcUser } from 'oidc-client-ts';

export interface AuthConfig {
  mode: 'demo' | 'oidc';
  issuer?: string;
  clientId?: string;
  scope?: string;
  audience?: string | null;
}

let config: AuthConfig = { mode: 'demo' };
let manager: UserManager | null = null;
let current: OidcUser | null = null;

export const authMode = () => config.mode;

export async function initAuth(): Promise<{ config: AuthConfig; user: OidcUser | null }> {
  config = await (await fetch('/api/v1/auth/config')).json();
  if (config.mode !== 'oidc') return { config, user: null };
  const { UserManager, WebStorageStateStore } = await import('oidc-client-ts');
  manager = new UserManager({
    authority: config.issuer!,
    client_id: config.clientId!,
    redirect_uri: `${window.location.origin}/`,
    post_logout_redirect_uri: `${window.location.origin}/`,
    response_type: 'code',
    scope: config.scope ?? 'openid profile',
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
    ...(config.audience ? { extraQueryParams: { audience: config.audience } } : {}),
  });
  manager.events.addUserLoaded((u) => {
    current = u;
  });
  manager.events.addUserUnloaded(() => {
    current = null;
  });
  const params = new URLSearchParams(window.location.search);
  if (params.has('code') && params.has('state')) {
    current = await manager.signinRedirectCallback();
    const target = typeof current.state === 'string' ? current.state : '/';
    window.history.replaceState({}, '', target);
  } else {
    current = await manager.getUser();
    if (current?.expired) current = null;
  }
  return { config, user: current };
}

export const login = () => manager?.signinRedirect({ state: window.location.pathname + window.location.search });
export const logout = () => manager?.signoutRedirect();
export const accessToken = () => current?.access_token ?? null;
