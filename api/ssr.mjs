import handler from "./ssr-bundled.mjs";
export default async function(req, res) {
  try {
    var u = new URL(req.url, "https://"+req.headers.host);
    var r = new Request(u, {method:req.method, headers:req.headers});
    if(req.method!=="GET"&&req.method!=="HEAD") r = new Request(u, {method:req.method, headers:req.headers, body:req.body});
    var resp = await handler.fetch(r);
    res.statusCode = resp.status;
    resp.headers.forEach(function(v,k){res.setHeader(k,v)});
    res.end(await resp.text());
  } catch(e) { console.error(e); res.statusCode=500; res.end("Error"); }
}
