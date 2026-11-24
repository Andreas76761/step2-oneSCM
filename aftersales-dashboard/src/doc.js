(function () {
  const H = window.__hod; if (!H) return;
  const q = document.getElementById('dc-q'), n = document.getElementById('dc-n');
  function filter() { const t = q.value.trim().toLowerCase(); let vis = 0, all = 0; document.querySelectorAll('#dc table.dcx tbody tr').forEach((r) => { all += 1; const ok = !t || r.textContent.toLowerCase().includes(t); r.hidden = !ok; if (ok) vis += 1; }); document.querySelectorAll('#dc li').forEach((li) => { li.hidden = !!t && !li.textContent.toLowerCase().includes(t); }); n.textContent = t ? vis + ' von ' + all + ' Zeilen' : all + ' Zeilen'; }
  q.addEventListener('input', filter);
  window.__hodDraw.dc = filter;
})();
