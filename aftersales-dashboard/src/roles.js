// Rollen und Rechte (Betrachter, Bearbeiter, Administrator) und Änderungsprotokoll.
// Die Rolle ergibt sich aus den Rechten, die die Plattform meldet (Eigentümer/Bearbeiter = Administrator, Schreibrecht = Bearbeiter, sonst Betrachter).
// Hinweis: Die Prüfungen in der Oberfläche führen den Nutzer; durchgesetzt werden Rechte nur von der Plattform (Zugriffsregeln der Datenbank).
(function () {
  if (window.__roles) return;
  const ROLES = { Betrachter: 'Betrachter', Bearbeiter: 'Bearbeiter', Administrator: 'Administrator' };
  const TEXT = { Betrachter: 'Sie können alles ansehen, aber keine Maßnahmen anlegen oder ändern.', Bearbeiter: 'Sie können Maßnahmen und Szenarien anlegen und Ihre eigenen ändern oder löschen.', Administrator: 'Sie können alle Maßnahmen und Szenarien ändern oder löschen.' };
  const LSK = 'aftersales-audit-v1';
  const R = { role: ROLES.Bearbeiter, uid: null, mode: 'lokal', db: null, audit: [], local: [], names: {}, cbs: [] };
  try { R.local = JSON.parse(localStorage.getItem(LSK) || '[]'); } catch (e) { R.local = []; }
  const emit = () => R.cbs.slice().forEach((f) => { try { f(); } catch (e) { /* ignorieren */ } });
  const entries = () => R.audit.concat(R.local).sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 40);
  async function names(ids) {
    const miss = ids.filter((i) => i && !(i in R.names)); if (!miss.length || !R.user || !R.user.profiles) return;
    try { const p = await R.user.profiles(miss); miss.forEach((i) => { R.names[i] = (p && p[i] && p[i].name) || ''; }); emit(); } catch (e) { miss.forEach((i) => { R.names[i] = ''; }); }
  }
  const api = {
    ROLES, text: () => TEXT[R.role], role: () => R.role, uid: () => R.uid, mode: () => R.mode,
    can: { write: () => R.role !== ROLES.Betrachter, admin: () => R.role === ROLES.Administrator, modify: (createdBy) => R.role === ROLES.Administrator || (R.role === ROLES.Bearbeiter && (!createdBy || !R.uid || createdBy === R.uid)) },
    who: (id) => (id ? R.names[id] || (id === R.uid ? 'Sie' : 'Nutzer ' + String(id).slice(-4)) : 'lokal'),
    entries, on: (f) => { R.cbs.push(f); },
    set: (role, uid) => { R.role = role; if (uid !== undefined) R.uid = uid; emit(); }, // für Tests
    log: async (kind, title, ref) => {
      const e = { at: new Date().toISOString(), by: R.uid || null, kind, title: String(title || '').slice(0, 160), ref: ref ? String(ref).slice(0, 120) : '' };
      if (R.db) { try { await R.db.collection('audit').add(e); return; } catch (x) { /* lokal sichern */ } }
      R.local.push(e); R.local = R.local.slice(-60); try { localStorage.setItem(LSK, JSON.stringify(R.local)); } catch (x) { /* ohne Speicher */ } emit();
    }
  };
  window.__roles = api;
  (async () => {
    try {
      const c = window.claude; if (!c || !c.use) return;
      const u = await c.use('user'); R.user = u;
      if (u) { const owner = u.isOwner ? u.isOwner() : false, edit = u.canEdit ? u.canEdit() : false, w = u.can ? u.can('data.write') : null; R.role = owner || edit ? ROLES.Administrator : w === false ? ROLES.Betrachter : ROLES.Bearbeiter; try { R.uid = u.id ? await u.id() : null; } catch (e) { R.uid = null; } R.mode = 'Plattform'; }
      R.db = await c.use('db');
      if (R.db) R.db.collection('audit').onSnapshot((snap) => { R.audit = snap.docs.map((d) => Object.assign({ id: d.id }, d.data())); names(Array.from(new Set(R.audit.map((x) => x.by)))); emit(); }, () => {});
      emit();
    } catch (e) { /* ohne Plattform: lokale Rolle */ }
  })();
})();
