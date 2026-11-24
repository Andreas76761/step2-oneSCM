(function () { const r = document.getElementById('dash-root'); if (!r) return; const s = document.createElement('style'); s.textContent = `#dash-root .chfab{position:fixed;right:20px;bottom:20px;z-index:60;font:inherit;font-weight:600;padding:12px 20px;border-radius:999px;border:0;background:var(--color-fg);color:var(--color-panel);cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.28)}
#dash-root .chfab[hidden],#dash-root .chatwin[hidden]{display:none}
#dash-root .chatwin{position:fixed;z-index:61;min-width:320px;min-height:120px;display:flex;flex-direction:column;background:var(--color-panel);color:var(--color-fg);border:1px solid var(--color-border-line);border-radius:12px;box-shadow:0 10px 34px rgba(0,0,0,.3);overflow:hidden;font-size:var(--cds-font-size-caption)}
#dash-root .chatwin.min{min-height:0}#dash-root .chatwin.min .chtabs,#dash-root .chatwin.min .chpane,#dash-root .chatwin.min .chrs{display:none}
#dash-root .chhd{display:flex;align-items:center;gap:6px;padding:9px 10px 9px 14px;background:var(--color-fg);color:var(--color-panel);cursor:move;touch-action:none;user-select:none}
#dash-root .chhd .cht0{flex:1;font-weight:600}
#dash-root .chhd button{font:inherit;width:26px;height:26px;border-radius:6px;border:0;background:transparent;color:inherit;cursor:pointer;font-size:16px;line-height:1}
#dash-root .chhd button:hover{background:rgba(255,255,255,.2)}
#dash-root .chtabs{display:flex;border-bottom:1px solid var(--color-border-line)}
#dash-root .chtabs button{flex:1;font:inherit;padding:8px;border:0;background:transparent;color:var(--color-fg-muted);cursor:pointer;border-bottom:2px solid transparent}
#dash-root .chtabs button[aria-selected=true]{color:var(--color-fg);border-bottom-color:var(--color-fg);font-weight:600}
#dash-root .chpane{flex:1;min-height:0;display:flex;flex-direction:column}#dash-root .chpane[hidden]{display:none}
#dash-root .chlog{flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px}
#dash-root .chm{max-width:92%;padding:8px 10px;border-radius:10px;line-height:1.45;overflow-wrap:anywhere}
#dash-root .chm.me{align-self:flex-end;background:var(--color-fg);color:var(--color-panel)}
#dash-root .chm.bot{align-self:flex-start;background:var(--color-bg);border:1px solid var(--color-border-line);width:92%}
#dash-root .chchips{display:flex;gap:6px;flex-wrap:wrap;padding:6px 10px;border-top:1px solid var(--color-border-line)}
#dash-root .chchips button{font:inherit;font-size:11px;padding:3px 9px;border-radius:999px;border:1px solid var(--color-border-line);background:var(--color-panel);color:var(--color-fg);cursor:pointer}
#dash-root .chin{display:flex;gap:6px;padding:8px 10px;border-top:1px solid var(--color-border-line)}
#dash-root .chin input{flex:1;font:inherit;padding:7px 9px;border:1px solid var(--color-border-line);border-radius:8px;background:var(--color-bg);color:var(--color-fg);min-width:0}
#dash-root .chrs{position:absolute;right:0;bottom:0;width:18px;height:18px;cursor:nwse-resize;touch-action:none;background:linear-gradient(135deg,transparent 55%,var(--color-fg-muted) 55%,var(--color-fg-muted) 62%,transparent 62%,transparent 74%,var(--color-fg-muted) 74%,var(--color-fg-muted) 81%,transparent 81%)}
#dash-root .chbtn{padding:4px 9px;font-size:11px}
#dash-root .chrow{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
#dash-root .chcap{color:var(--color-fg-muted);font-size:11px;margin-top:6px}
#dash-root .chcard{border:1px solid var(--color-border-line);border-top:4px solid var(--color-fg-muted);border-radius:8px;padding:8px 10px;margin-top:6px;background:var(--color-panel)}
#dash-root .chcard.ch-good{border-top-color:var(--color-ok)}#dash-root .chcard.ch-warn{border-top-color:var(--color-warn)}#dash-root .chcard.ch-bad{border-top-color:var(--color-bad)}
#dash-root .chk{color:var(--color-fg-muted)}#dash-root .chv{font-size:22px;font-weight:600;margin:2px 0}#dash-root .chs{color:var(--color-fg-muted);font-size:11px}
#dash-root .chbar{display:grid;grid-template-columns:110px 1fr 54px;gap:6px;align-items:center;margin:3px 0}
#dash-root .chbl{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#dash-root .chbt{background:var(--color-border-line);height:10px;border-radius:5px;overflow:hidden}#dash-root .chbf{display:block;height:100%;border-radius:5px}#dash-root .chbv{text-align:right}
#dash-root .chtw{overflow-x:auto;margin-top:6px}#dash-root .chtab{width:100%;border-collapse:collapse;font-size:11px}#dash-root .chtab th,#dash-root .chtab td{padding:4px 6px;border-bottom:1px solid var(--color-border-line);text-align:left;vertical-align:top}#dash-root .chtab .num{text-align:right}#dash-root .chtab tr.od td{background:rgba(214,69,69,.1)}
#dash-root .chtrack{flex:1;overflow-y:auto;padding:10px}
#dash-root .chsum{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px}#dash-root .chsc{border:1px solid var(--color-border-line);border-radius:8px;padding:6px;text-align:center}#dash-root .chsc b{display:block;font-size:18px}#dash-root .chsc.bad b{color:var(--color-bad)}
#dash-root .chform{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0}#dash-root .chform input,#dash-root .chform select,#dash-root .chtab select{font:inherit;font-size:11px;padding:5px 6px;border:1px solid var(--color-border-line);border-radius:6px;background:var(--color-bg);color:var(--color-fg);min-width:0}#dash-root .chform input:first-child{grid-column:1/-1}#dash-root .cht{font-weight:600}
@media (max-width:520px){#dash-root .chatwin{min-width:0}}

#dash-root .v3t .v3q{font:inherit;padding:6px 9px;border:1px solid var(--color-border-line);border-radius:8px;background:var(--color-bg);color:var(--color-fg);min-width:180px}
#dash-root .v3bad{color:var(--color-bad);font-weight:600}#dash-root .v3ok{color:var(--color-ok)}
#dash-root .v3c{margin-top:12px}
#dash-root .simtabs{flex-wrap:wrap;margin:8px 0}
#dash-root .simctl{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px 18px;margin:8px 0}
#dash-root .simp{display:block}#dash-root .simpt{display:flex;justify-content:space-between;gap:8px}#dash-root .simp input[type=range]{width:100%}#dash-root .simh{display:block;color:var(--color-fg-muted);font-size:11px}
#dash-root .simx{grid-column:1/-1}#dash-root .simhubs{display:flex;flex-wrap:wrap;gap:4px 16px}
#dash-root .simlg{display:flex;gap:14px;flex-wrap:wrap;margin-top:4px;font-size:var(--cds-font-size-caption)}#dash-root .simlg i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:5px}
#dash-root .simtiles{margin:10px 0}
`; r.prepend(s); })();
