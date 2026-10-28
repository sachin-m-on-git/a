const http = require('http');
const { execSync } = require('child_process');
const { findProgramByRoute, PROGRAMS_DATA } = require('./programs.js');

function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

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

  // Serve programs.js if requested directly
  if (path === 'programs.js') {
    const fs = require('fs');
    res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
    return res.end(fs.readFileSync(__dirname + '/programs.js', 'utf8'));
  }

  const target = findProgramByRoute(path);

  // Server-side clipboard copy when running locally on Windows
  if (target && target.code) {
    try {
      if (process.platform === 'win32') {
        execSync('clip', { input: target.code });
        console.log(`[Copied Program to OS Clipboard]: /${path} -> ${target.title}`);
      }
    } catch (err) {}
  }

  const targetCode = target ? target.code : '';
  const programsJson = JSON.stringify(PROGRAMS_DATA);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title></title>
</head>
<body style="background:#fff;margin:0;min-height:100vh;">
<script>
const PROGRAMS = ${programsJson};
function getProgramCode(route) {
  if (!route) return null;
  const c = route.replace(/^\\/+|\\/+$/g, "").toLowerCase().trim();
  if (!c) return null;
  for (const item of PROGRAMS) {
    if (item.id.toLowerCase() === c) return item.code;
    if (item.aliases && item.aliases.some(a => a.toLowerCase() === c)) return item.code;
  }
  return null;
}

const clientCode = getProgramCode(location.pathname);
const serverCode = ${JSON.stringify(targetCode)};
const targetCode = clientCode || serverCode;

if (targetCode) {
  let copied = false;

  function closeTab() {
    window.close();
    try { window.open('', '_self', ''); window.close(); } catch(e){}
  }

  function doCopy() {
    if (copied) return;
    try {
      const ta = document.createElement('textarea');
      ta.value = targetCode;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, targetCode.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) {
        copied = true;
      }
    } catch(e) {}

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(targetCode).then(() => {
        copied = true;
        closeTab();
      }).catch(() => {
        if (copied) closeTab();
      });
    }

    if (copied) {
      setTimeout(closeTab, 150);
    }
  }

  doCopy();
  window.addEventListener('click', () => { doCopy(); closeTab(); });
  window.addEventListener('keydown', () => { doCopy(); closeTab(); });
  window.addEventListener('touchstart', () => { doCopy(); closeTab(); });
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
