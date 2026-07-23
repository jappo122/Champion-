// Vercel ESM runtime fix: provide `require` for CJS modules bundled by esbuild
import { createRequire } from "module";
globalThis.require = createRequire(import.meta.url);

// Lazy load to avoid top-level await issues on some runtimes
let handler = null;
async function getHandler() {
  if (!handler) handler = (await import("./ssr-bundled.mjs")).default;
  return handler;
}

export default async function(req, res) {
  try {
    const h = await getHandler();
    var u = new URL(req.url, "https://"+req.headers.host);
    var r = new Request(u, {method:req.method, headers:req.headers});
    if(req.method!=="GET"&&req.method!=="HEAD") r = new Request(u, {method:req.method, headers:req.headers, body:req.body});
    var resp = await h.fetch(r);
    res.statusCode = resp.status;
    resp.headers.forEach(function(v,k){res.setHeader(k,v)});
    res.end(await resp.text());
  } catch(e) { console.error(e); res.statusCode=500; res.end("Error"); }
}
