(function () {
  const errs = []; let db = null, uid = null, timer = null, banner = null;
  const where = () => { try { return (window.__hod && window.__hod.cur && window.__hod.cur()) || ''; } catch (e) { return ''; } };
  function show(e) {
    try {
      const root = document.getElementById('dash-root'); if (!root) return;
      if (!banner) { banner = document.createElement('div'); banner.id = 'diag-banner'; banner.style.cssText = 'margin:8px 0;padding:8px 12px;border:1px solid var(--color-warn);border-radius:8px;background:var(--color-panel);font-size:12px;display:flex;gap:10px;align-items:flex-start'; const t = document.createElement('span'); t.id = 'diag-text'; t.style.flex = '1'; const b = document.createElement('button'); b.textContent = 'Schließen'; b.style.cssText = 'font-size:12px;cursor:pointer'; b.addEventListener('click', () => { banner.hidden = true; }); banner.append(t, b); root.prepend(banner); }
      banner.hidden = false; document.getElementById('diag-text').textContent = 'Technischer Hinweis: Im Bereich „' + (e.tab || '?') + '“ (' + e.part + ') ist ein Fehler aufgetreten: ' + e.msg + '. Die übrigen Bereiche laufen weiter.';
    } catch (x) { /* Hinweis ist optional */ }
  }
  function flush() {
    clearTimeout(timer); timer = setTimeout(async () => {
      try { if (!db) { const c = window.claude; if (!c || !c.use) return; db = await c.use('db'); const u = await c.use('user'); uid = u && u.id ? await u.id() : null; } if (db && uid) await db.doc('data/users/' + uid + '/diag').set({ errors: errs, at: new Date().toISOString() }); } catch (x) { /* Diagnose ist optional */ }
    }, 800);
  }
  function rec(part, err, extra) {
    const e = { part, msg: String((err && err.message) || err).slice(0, 300), stack: String((err && err.stack) || '').split('\n').slice(0, 4).join(' | ').slice(0, 500), tab: where(), at: new Date().toISOString() }; if (extra) Object.assign(e, extra);
    errs.push(e); if (errs.length > 20) errs.shift(); show(e); flush();
    try { console.warn('Dashboard-Hinweis', e); } catch (x) { /* Konsole optional */ }
  }
  window.__safe = (part, fn) => { try { return fn(); } catch (err) { rec(part, err); return undefined; } };
  window.__diag = { errs, rec };
  window.addEventListener('error', (ev) => { rec('Skript', ev.error || ev.message, { src: String(ev.filename || '').slice(-60), line: ev.lineno }); });
  window.addEventListener('unhandledrejection', (ev) => { rec('Promise', ev.reason); });
})();
