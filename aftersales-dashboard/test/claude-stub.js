// Ersatz für window.claude (Plattform-Fähigkeiten db und user) mit Speicher im Arbeitsspeicher.
// Rolle über die Adresse wählen: ?stub=admin | editor | viewer, Nutzerkennung mit &uid=...
(function () {
  const q = new URLSearchParams(location.search), role = q.get('stub') || 'editor', uid = q.get('uid') || 'u_' + role;
  const store = (window.__stubDb = window.__stubDb || {}), subs = {};
  const col = (name) => (store[name] = store[name] || new Map());
  const snap = (name) => ({ docs: [...col(name).entries()].map(([id, data]) => ({ id, data: () => JSON.parse(JSON.stringify(data)) })) });
  const fire = (name) => (subs[name] || []).forEach((f) => { try { f(snap(name)); } catch (e) { /* ignorieren */ } });
  let n = 0;
  const db = {
    collection: (name) => ({ add: async (d) => { const id = 'd' + (++n); col(name).set(id, JSON.parse(JSON.stringify(d))); fire(name); return { id }; }, onSnapshot: (f) => { (subs[name] = subs[name] || []).push(f); setTimeout(() => f(snap(name)), 0); return () => {}; }, doc: (id) => db.doc(name + '/' + id) }),
    doc: (path) => { const [name, id] = path.split('/'); return { set: async (d) => { col(name).set(id, JSON.parse(JSON.stringify(d))); fire(name); }, update: async (d) => { col(name).set(id, Object.assign({}, col(name).get(id), d)); fire(name); }, delete: async () => { col(name).delete(id); fire(name); }, get: async () => ({ exists: col(name).has(id), data: () => col(name).get(id) }), onSnapshot: (f) => { setTimeout(() => f({ exists: col(name).has(id), data: () => col(name).get(id) }), 0); return () => {}; } }; }
  };
  const user = { isOwner: () => role === 'admin', canEdit: () => role === 'admin', can: (x) => (x === 'data.write' ? role !== 'viewer' : null), id: async () => uid, me: async () => ({ id: uid }), profiles: async (ids) => Object.fromEntries(ids.map((i) => [i, { name: 'Test ' + i }])) };
  window.claude = { use: async (name) => (name === 'db' ? db : name === 'user' ? user : null) };
})();
