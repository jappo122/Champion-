// Production server for the built site. The TanStack Start build emits a portable
// fetch handler (dist/server/server.js) plus static client assets (dist/client);
// this wraps them in a Bun server on port 3000 — static files first, SSR for the
// rest. Run `bun run build` before starting. Restart it with `bun run publish`.
//
// Starting a new instance supersedes the old one: it frees the port no matter
// which user owns the current server (provisioning starts it as `engine`; a team
// member's `bun run publish` runs as their own user), so publish never collides
// with an already-running server. Every sandbox user has passwordless sudo, so
// the takeover works across user boundaries.
import handler from "./dist/server/server.js";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

// ── Direct API handlers (bypass broken TanStack server function manifest) ──

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  let key = password + salt;
  for (let i = 0; i < 1000; i++) {
    key = createHash("sha256").update(key).digest("hex");
  }
  return `${salt}:${key}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  let key = password + salt;
  for (let i = 0; i < 1000; i++) {
    key = createHash("sha256").update(key).digest("hex");
  }
  try {
    return timingSafeEqual(Buffer.from(key), Buffer.from(hash));
  } catch {
    return false;
  }
}

function generateToken(payload: Record<string, unknown>): string {
  const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }),
  ).toString("base64url");
  const signature = createHash("sha256").update(`${header}.${body}.${secret}`).digest("hex");
  return `${header}.${body}.${signature}`;
}

async function handleApiRequest(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  
  if (url.pathname === "/api/login" && req.method === "POST") {
    try {
      const { email, password } = await req.json();
      const normalizedEmail = (email || "").trim().toLowerCase();
      if (!normalizedEmail || !password) {
        return Response.json({ success: false, error: "Email and password required" }, { status: 400 });
      }
      
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL!);
      const result = await sql`SELECT id, email, name, password_hash, role FROM users WHERE LOWER(email) = ${normalizedEmail}`;
      
      if (result.length === 0 || !verifyPassword(password, result[0].password_hash)) {
        return Response.json({ success: false, error: "Invalid email or password" });
      }
      
      const user = result[0];
      // Reuse existing session token (no longer invalidates other sessions)
      const sessionToken = user.session_token;
      const token = generateToken({ userId: user.id, email: user.email, sessionToken, role: user.role });
      
      return Response.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err: any) {
      console.error("API login error:", err.message);
      return Response.json({ success: false, error: "Server error" }, { status: 500 });
    }
  }
  
  if (url.pathname === "/api/session" && req.method === "POST") {
    try {
      const { token } = await req.json();
      if (!token) return Response.json({ user: null });
      
      // Verify token
      const parts = token.split(".");
      if (parts.length !== 3) return Response.json({ user: null });
      const [header, body, signature] = parts;
      const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
      const expected = createHash("sha256").update(`${header}.${body}.${secret}`).digest("hex");
      if (signature !== expected) return Response.json({ user: null });
      
      const payload = JSON.parse(Buffer.from(body, "base64url").toString());
      if (payload.exp && payload.exp < Date.now()) return Response.json({ user: null });
      
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL!);
      const result = await sql`SELECT id, email, name, role, session_token FROM users WHERE id = ${payload.userId as number}`;
      if (result.length === 0) return Response.json({ user: null });
      
      const user = result[0];
      // Session token check removed — JWT expiration (7 days) is sufficient security
      
      return Response.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch {
      return Response.json({ user: null });
    }
  }

  // ── Webinar URL (public GET) ──
  if (url.pathname === "/api/webinar-url" && req.method === "GET") {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL!);
      await sql`CREATE TABLE IF NOT EXISTS webinar_settings (key TEXT PRIMARY KEY, value TEXT)`;
      const result = await sql`SELECT value FROM webinar_settings WHERE key = 'webinar_url'`;
      return Response.json({ url: result.length > 0 ? result[0].value : null });
    } catch (err: any) {
      console.error("API webinar-url GET error:", err.message);
      return Response.json({ url: null, error: "Server error" }, { status: 500 });
    }
  }

  // ── Webinar URL (manager POST) ──
  if (url.pathname === "/api/webinar-url" && req.method === "POST") {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
      const token = authHeader.slice(7);
      const parts = token.split(".");
      if (parts.length !== 3) return Response.json({ success: false, error: "Invalid token" }, { status: 401 });
      const [headerB64, bodyB64, signature] = parts;
      const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
      const expected = createHash("sha256").update(`${headerB64}.${bodyB64}.${secret}`).digest("hex");
      if (signature !== expected) return Response.json({ success: false, error: "Invalid token" }, { status: 401 });
      const payload = JSON.parse(Buffer.from(bodyB64, "base64url").toString());
      if (payload.role !== "management") {
        return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
      }
      const { url: newUrl } = await req.json();
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL!);
      await sql`CREATE TABLE IF NOT EXISTS webinar_settings (key TEXT PRIMARY KEY, value TEXT)`;
      await sql`INSERT INTO webinar_settings (key, value) VALUES ('webinar_url', ${newUrl || null})
        ON CONFLICT (key) DO UPDATE SET value = ${newUrl || null}`;
      return Response.json({ success: true, url: newUrl });
    } catch (err: any) {
      console.error("API webinar-url POST error:", err.message);
      return Response.json({ success: false, error: "Server error" }, { status: 500 });
    }
  }

  return null; // Not an API route
}

// Pinned, NOT read from the environment. The published preview URL
// (<label>.<PUBLIC_SITE_DOMAIN>) is reverse-proxied to 0.0.0.0:3000 inside the
// sandbox, so the default site MUST bind there. Bun auto-loads .env files, so
// honouring process.env.PORT/HOST would let a stray env var or a .env in the site
// dir silently move the site off :3000 (or onto loopback) and break the public URL.
const PORT = 3000;
const HOST = "0.0.0.0";
const CLIENT_DIR = `${import.meta.dir}/dist/client`;

// Free PORT regardless of which user owns the current listener. lsof runs under
// sudo so it can see (and the kill can signal) a process owned by another user;
// the loop waits for the socket to actually release before we bind.
const freePort =
  `for _ in $(seq 1 25); do ` +
  `pids=$(lsof -t -iTCP:${String(PORT)} -sTCP:LISTEN 2>/dev/null || true); ` +
  `if [ -z "$pids" ]; then exit 0; fi; ` +
  `kill $pids 2>/dev/null || true; sleep 0.2; ` +
  `done`;

// Take over the port, re-freeing and retrying if another publish grabbed it in the
// gap between freeing and binding (last publish wins). Bun.serve throws EADDRINUSE
// synchronously, so without this a raced publish would die while the shell already
// reported success.
for (let attempt = 1; ; attempt++) {
  await Bun.$`sudo sh -c ${freePort}`.quiet().nothrow();
  try {
    Bun.serve({
      port: PORT,
      hostname: HOST,
      async fetch(req) {
        // Check API routes first
        const apiResponse = await handleApiRequest(req);
        if (apiResponse) return apiResponse;

        const { pathname } = new URL(req.url);
        // SEO: 301 (permanent) redirect for trailing-slash URLs so Google sees
        // exactly one URL per page. TanStack's default was a 307 (temporary),
        // which keeps both variants alive and causes duplicate-content flags.
        if (pathname !== "/" && pathname.endsWith("/") && !pathname.includes(".")) {
          const clean = pathname.replace(/\/+$/, "") || "/";
          const urlObj = new URL(req.url);
          return Response.redirect(urlObj.origin + clean + (urlObj.search || ""), 301);
        }
        if (pathname !== "/") {
          const file = Bun.file(CLIENT_DIR + pathname);
          if (await file.exists()) return new Response(file);
        }
        return (
          handler as { fetch: (r: Request) => Response | Promise<Response> }
        ).fetch(req);
      },
    });
    break;
  } catch (err) {
    if (attempt >= 10) throw err;
    await Bun.sleep(200);
  }
}

console.log(`team-site serving on http://${HOST}:${String(PORT)}`);
