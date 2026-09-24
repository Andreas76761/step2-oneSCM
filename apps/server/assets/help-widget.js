/*
 * oneSCM-Kontexthilfe (ADR-030) – Einbindung in oneSCM:
 *   <script src="https://handbuch.example.com/help/widget.js" data-project="p_default" data-language="de" data-role="dealer" defer></script>
 *   <button data-onescm-help="order.create">Hilfe</button>          (Klick öffnet die Hilfe zur Kontext-ID)
 *   <form data-onescm-help="order.create"> … </form>                 (F1 innerhalb des Bereichs öffnet die Hilfe)
 *   window.OneScmHelp.open('order.create', { role: 'hq', language: 'en' })
 * Die Hilfe erscheint in einem Seitenpanel (iframe, ohne Skripte); Esc schließt es und gibt den Fokus zurück.
 */
(function () {
  'use strict';
  var script = document.currentScript;
  if (!script || window.OneScmHelp) return;
  var base = new URL(script.src, location.href).origin;
  var project = script.getAttribute('data-project') || 'p_default';
  var defaults = { role: script.getAttribute('data-role'), division: script.getAttribute('data-division'), language: script.getAttribute('data-language') };
  var title = { de: 'oneSCM-Hilfe', en: 'oneSCM help', fr: 'Aide oneSCM', es: 'Ayuda de oneSCM', it: 'Guida oneSCM' };
  var closeLabel = { de: 'Hilfe schließen', en: 'Close help', fr: 'Fermer l’aide', es: 'Cerrar ayuda', it: 'Chiudi guida' };
  var panel, frame, closeBtn, heading, lastFocus;

  function pick(o, k) { return o && o[k] != null && o[k] !== '' ? String(o[k]) : defaults[k]; }

  function build(lang) {
    panel = document.createElement('div');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'false');
    panel.id = 'onescm-help-panel';
    panel.style.cssText = 'position:fixed;top:0;right:0;bottom:0;width:min(420px,100vw);background:#fff;box-shadow:-4px 0 18px rgba(15,23,42,.25);z-index:2147483000;display:flex;flex-direction:column;font:14px system-ui,sans-serif';
    var bar = document.createElement('div');
    bar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#0f1f3d;color:#fff';
    heading = document.createElement('strong');
    heading.id = 'onescm-help-title';
    panel.setAttribute('aria-labelledby', heading.id);
    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '×';
    closeBtn.style.cssText = 'background:none;border:0;color:#fff;font-size:22px;line-height:1;cursor:pointer;padding:2px 8px';
    closeBtn.addEventListener('click', close);
    bar.appendChild(heading);
    bar.appendChild(closeBtn);
    frame = document.createElement('iframe');
    frame.style.cssText = 'flex:1;border:0;width:100%';
    frame.setAttribute('referrerpolicy', 'no-referrer');
    panel.appendChild(bar);
    panel.appendChild(frame);
    document.body.appendChild(panel);
    panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } });
  }

  function open(context, options) {
    if (!context) return;
    var lang = pick(options, 'language') || document.documentElement.lang || 'de';
    lang = lang.slice(0, 2).toLowerCase();
    if (!panel) build(lang);
    var q = new URLSearchParams();
    ['role', 'division'].forEach(function (k) { var v = pick(options, k); if (v) q.set(k, v); });
    if (lang !== 'de') q.set('language', lang);
    heading.textContent = title[lang] || title.de;
    closeBtn.setAttribute('aria-label', closeLabel[lang] || closeLabel.de);
    frame.title = title[lang] || title.de;
    frame.src = base + '/help/embed/' + encodeURIComponent(project) + '/' + encodeURIComponent(context) + (q.toString() ? '?' + q : '');
    if (panel.hidden !== false || !panel.contains(document.activeElement)) lastFocus = document.activeElement;
    panel.hidden = false;
    panel.style.display = 'flex';
    closeBtn.focus();
  }

  function close() {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    panel.style.display = 'none'; // Inline-Stil überschreibt sonst das hidden-Attribut
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function contextOf(el) {
    var host = el && el.closest ? el.closest('[data-onescm-help]') : null;
    return host ? { key: host.getAttribute('data-onescm-help'), role: host.getAttribute('data-role'), division: host.getAttribute('data-division'), language: host.getAttribute('data-language') } : null;
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var trigger = t.closest('button[data-onescm-help], a[data-onescm-help]');
    if (!trigger) return;
    e.preventDefault();
    var c = contextOf(trigger);
    open(c.key, c);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'F1') return;
    var c = contextOf(document.activeElement);
    if (!c) return;
    e.preventDefault();
    open(c.key, c);
  });

  window.OneScmHelp = { open: open, close: close };
})();
