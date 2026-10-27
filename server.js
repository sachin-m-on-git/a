const http = require('http');
const { execSync } = require('child_process');
const { findLinkByRoute } = require('./links.js');

function handler(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const path = decodeURIComponent(urlObj.pathname.replace(/^\/+|\/+$/g, ''));

  // Root /: blank white screen, no copy
  if (!path) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="background:#fff;margin:0;"></body></html>');
  }

  // links.js static file
  if (path === 'links.js') {
    const fs = require('fs');
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    return res.end(fs.readFileSync(__dirname + '/links.js', 'utf8'));
  }

  const target = findLinkByRoute(path);
  if (!target || !target.url) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="background:#fff;margin:0;"></body></html>');
  }

  // Server-side OS clipboard copy (works reliably on local Windows machine)
  try {
    if (process.platform === 'win32') {
      execSync('clip', { input: target.url });
      console.log(`[Copied to OS Clipboard]: /${path} -> ${target.url}`);
    }
  } catch (err) {
    console.warn('Server-side clipboard copy failed (falling back to client):', err.message);
  }

  // Client-side HTML that copies and closes tab
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title></title></head>
<body style="background:#fff;margin:0;">
<script>
const url = ${JSON.stringify(target.url)};
function exit() {
  window.close();
  try { window.open('', '_self', ''); window.close(); } catch(e){}
}
function copy() {
  try {
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  } catch(e){}
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(exit).catch(exit);
  } else {
    exit();
  }
}
copy();
exit();
window.addEventListener('click', () => { copy(); exit(); });
window.addEventListener('keydown', () => { copy(); exit(); });
</script>
</body>
</html>`;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

module.exports = handler;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const server = http.createServer(handler);
  server.listen(PORT, () => {
    console.log(`> Server running on http://localhost:${PORT}`);
  });
}
