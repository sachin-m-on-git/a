const http = require('http');
const { execSync } = require('child_process');
const { findLinkByRoute, LINKS_DATA } = require('./links.js');

function handler(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  
  let rawPath = 
    urlObj.searchParams.get('path') ||
    req.headers['x-matched-path'] ||
    req.headers['x-vercel-matched-path'] ||
    urlObj.pathname ||
    '';

  let path = decodeURIComponent(rawPath.replace(/^\/+|\/+$/g, ''));
  if (path.startsWith('api/index')) {
    path = path.replace(/^api\/index\/?/, '');
  }

  // Root /: blank white screen, no copy
  if (!path) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="background:#fff;margin:0;"></body></html>');
  }

  // Serve links.js if requested
  if (path === 'links.js') {
    const fs = require('fs');
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    return res.end(fs.readFileSync(__dirname + '/links.js', 'utf8'));
  }

  const target = findLinkByRoute(path);

  // Server-side clipboard copy when running locally on Windows
  if (target && target.url) {
    try {
      if (process.platform === 'win32') {
        execSync('clip', { input: target.url });
      }
    } catch (err) {}
  }

  const targetUrl = target ? target.url : '';
  const linksJson = JSON.stringify(LINKS_DATA);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title></title>
</head>
<body style="background:#fff;margin:0;min-height:100vh;cursor:pointer;">
<script>
const LINKS = ${linksJson};
function getLink(route) {
  if (!route) return null;
  const c = route.replace(/^\\/+|\\/+$/g, "").toLowerCase().trim();
  if (!c) return null;
  for (const item of LINKS) {
    if (item.id.toLowerCase() === c) return item.url;
    if (item.aliases && item.aliases.some(a => a.toLowerCase() === c)) return item.url;
  }
  return null;
}

const serverUrl = ${JSON.stringify(targetUrl)};
const clientUrl = getLink(location.pathname);
const targetUrl = serverUrl || clientUrl;

if (targetUrl) {
  function copyExec(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch(e) {
      return false;
    }
  }

  function exit() {
    window.close();
    try { window.open('', '_self', ''); window.close(); } catch(e){}
  }

  async function attemptCopy() {
    let ok = copyExec(targetUrl);
    if (!ok && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(targetUrl);
        ok = true;
      } catch(e) {}
    }
    if (ok) {
      setTimeout(exit, 100);
    }
    return ok;
  }

  attemptCopy();
  window.addEventListener('focus', attemptCopy);
  window.addEventListener('click', attemptCopy);
  window.addEventListener('keydown', attemptCopy);
  window.addEventListener('touchstart', attemptCopy);
}
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
