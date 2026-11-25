// Kleiner Server: liefert die Seite (src/index.html in einem #dash-root) mit dem Laufzeit-Ersatz und die Datensätze.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), TYPES = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.html': 'text/html; charset=utf-8' };
function page(stub) {
  const body = fs.readFileSync(path.join(ROOT, 'src', 'index.html'), 'utf8');
  return '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Test</title>' +
    '<style>:root{--color-fg:#1a1a1a;--color-fg-muted:#666;--color-bg:#fff;--color-panel:#f6f6f6;--color-warn:#b45309;--color-ok:#2b9a66;--color-bad:#c0392b;--cds-font-size-title:22px;--cds-font-size-heading:15px;--cds-font-size-body:14px;--cds-font-size-caption:12px;--cds-font-weight-medium:600;--cds-chart-grid:#e5e5e5;--cds-chart-status-critical:#c0392b}body{margin:12px;font-family:system-ui,sans-serif;background:#fff}</style></head><body>' +
    '<script src="/test/d3.js"></script><script src="/test/dash-mock.js"></script>' + (stub ? '<script src="/test/claude-stub.js"></script>' : '') + '<div id="dash-root">' + body + '</div></body></html>';
}
function start(port) {
  const srv = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    if (u === '/' || u === '/index.html') { res.writeHead(200, { 'content-type': TYPES['.html'] }); return res.end(page(/[?&]stub=/.test(req.url))); }
    if (u === '/test/d3.js') { res.writeHead(200, { 'content-type': TYPES['.js'] }); return fs.createReadStream(path.join(ROOT, 'node_modules', 'd3', 'dist', 'd3.min.js')).pipe(res); }
    let f = u.startsWith('/data/') || u.startsWith('/test/') ? path.join(ROOT, u) : path.join(ROOT, 'src', u);
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('nicht gefunden'); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
  });
  return new Promise((ok) => srv.listen(port || 0, '127.0.0.1', () => ok(srv)));
}
module.exports = { start };
if (require.main === module) start(+process.env.PORT || 8080).then((s) => console.log('http://127.0.0.1:' + s.address().port));
