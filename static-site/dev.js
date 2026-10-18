#!/usr/bin/env node
// One command for local work: website + admin.   npm start   (or: node dev.js)
// Serves the site on http://localhost:8000 and starts the admin file proxy (decap-server) on :8081.
const http = require("http"), fs = require("fs"), path = require("path"), { spawn } = require("child_process");
const { execFileSync } = require("child_process");
const PORT = +process.env.PORT || 8000, ROOT = __dirname;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "application/javascript", ".json": "application/json", ".yml": "text/yaml", ".xml": "application/xml", ".txt": "text/plain", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon", ".pdf": "application/pdf", ".mp4": "video/mp4", ".woff2": "font/woff2" };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end("Forbidden"); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!p.endsWith("/")) { res.writeHead(301, { Location: p + "/" }); return res.end(); }
    file = path.join(file, "index.html");
  }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(buf);
  });
});
server.on("error", e => {
  console.error(e.code === "EADDRINUSE" ? `\nPort ${PORT} is busy. Close the other server, or run:  PORT=8001 npm start\n` : e);
  process.exit(1);
});
// Rebuild pages automatically whenever the admin saves content.
function build(why) {
  try { execFileSync(process.execPath, ["build.js"], { cwd: ROOT, stdio: "pipe" }); console.log(`  [build] site rebuilt (${why})`); }
  catch (e) { console.error("  [build] FAILED:\n" + (e.stderr || e.message)); }
}
let timer;
fs.watch(path.join(ROOT, "data"), (_, name) => {
  if (name !== "projects.json" && name !== "site.json") return;
  clearTimeout(timer); timer = setTimeout(() => build(name + " changed"), 400);
});
server.listen(PORT, () => {
  build("startup");
  console.log(`\n  Website : http://localhost:${PORT}\n  Admin   : http://localhost:${PORT}/admin/\n\n  Press Ctrl + C to stop both.\n`);
  const cms = spawn("npx --yes decap-server", { cwd: ROOT, stdio: ["ignore", "inherit", "inherit"], shell: true });
  const stop = () => { cms.kill(); server.close(); process.exit(0); };
  process.on("SIGINT", stop); process.on("SIGTERM", stop);
  cms.on("exit", c => c && console.error("Admin proxy stopped (code " + c + "). Website is still running."));
});
