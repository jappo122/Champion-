// Vercel ESM runtime fix: provide `require` for CJS modules bundled by esbuild
import { createRequire } from "module";
globalThis.require = createRequire(import.meta.url);

import { createHash, timingSafeEqual } from "node:crypto";

// ── Helpers ──
function generateToken(payload) {
  const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }),
  ).toString("base64url");
  const signature = createHash("sha256").update(`${header}.${body}.${secret}`).digest("hex");
  return `${header}.${body}.${signature}`;
}

function verifyPassword(password, stored) {
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

// ── API route handler ──
async function handleApiRequest(req) {
  // DEPLOY_VERSION: 2026-07-25T19:25:00Z — mark-complete + my-progress + login + session
  const url = new URL(req.url, "https://" + (req.headers?.host || "localhost"));

  if (url.pathname === "/api/login" && req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { email, password } = body || {};
      const normalizedEmail = (email || "").trim().toLowerCase();
      if (!normalizedEmail || !password) {
        return new Response(JSON.stringify({ success: false, error: "Email and password required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL);
      const result = await sql`SELECT id, email, name, password_hash, role, session_token FROM users WHERE LOWER(email) = ${normalizedEmail}`;
      if (result.length === 0 || !verifyPassword(password, result[0].password_hash)) {
        return new Response(JSON.stringify({ success: false, error: "Invalid email or password" }), { status: 401, headers: { "Content-Type": "application/json" } });
      }
      const user = result[0];
      const token = generateToken({ userId: user.id, email: user.email, sessionToken: user.session_token, role: user.role });
      return new Response(JSON.stringify({ success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      console.error("API login error:", err.message);
      return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }

  if (url.pathname === "/api/session" && req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { token } = body || {};
      if (!token) return new Response(JSON.stringify({ user: null }), { headers: { "Content-Type": "application/json" } });
      const parts = token.split(".");
      if (parts.length !== 3) return new Response(JSON.stringify({ user: null }), { headers: { "Content-Type": "application/json" } });
      const [header, bodyPart, signature] = parts;
      const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
      const expected = createHash("sha256").update(`${header}.${bodyPart}.${secret}`).digest("hex");
      if (signature !== expected) return new Response(JSON.stringify({ user: null }), { headers: { "Content-Type": "application/json" } });
      const payload = JSON.parse(Buffer.from(bodyPart, "base64url").toString());
      if (payload.exp && payload.exp < Date.now()) return new Response(JSON.stringify({ user: null }), { headers: { "Content-Type": "application/json" } });
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL);
      const result = await sql`SELECT id, email, name, role, session_token FROM users WHERE id = ${payload.userId}`;
      if (result.length === 0) return new Response(JSON.stringify({ user: null }), { headers: { "Content-Type": "application/json" } });
      const user = result[0];
      return new Response(JSON.stringify({ user: { id: user.id, email: user.email, name: user.name, role: user.role } }), { headers: { "Content-Type": "application/json" } });
    } catch {
      return new Response(JSON.stringify({ user: null }), { headers: { "Content-Type": "application/json" } });
    }
  }

  // POST /api/mark-complete — mark lesson complete
  if (url.pathname === "/api/mark-complete" && req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { token, courseId, lessonId, quizResults } = body || {};
      const parts = token.split(".");
      if (parts.length !== 3) return new Response(JSON.stringify({ success: false }), { headers: { "Content-Type": "application/json" } });
      const [header, bodyPart, signature] = parts;
      const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
      const expected = createHash("sha256").update(`${header}.${bodyPart}.${secret}`).digest("hex");
      if (signature !== expected) return new Response(JSON.stringify({ success: false }), { headers: { "Content-Type": "application/json" } });
      const payload = JSON.parse(Buffer.from(bodyPart, "base64url").toString());
      const userId = payload.userId;
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL);
      // Quiz threshold check: if lesson has quiz content, require score >= 80%
      if (quizResults && quizResults.total > 0) {
        const percent = Math.round((quizResults.correct / quizResults.total) * 100);
        if (percent < 80) {
          return new Response(JSON.stringify({ success: false, error: `Score ${percent}% — need 80% or higher to mark complete`, scoreNeeded: 80 }), { headers: { "Content-Type": "application/json" } });
        }
      }
      await sql`INSERT INTO lesson_progress (user_id, course_id, lesson_id) VALUES (${userId}, ${courseId}, ${lessonId}) ON CONFLICT (user_id, lesson_id) DO NOTHING`;
      await sql`UPDATE module_assignments SET completed_at = NOW() WHERE salesperson_id = ${userId} AND course_id = ${courseId} AND (lesson_id = ${lessonId} OR lesson_id IS NULL) AND completed_at IS NULL`;
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      console.error("mark-complete error:", err.message);
      return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }

  // POST /api/my-progress — get completed lessons
  if (url.pathname === "/api/my-progress" && req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { token } = body || {};
      const parts = token.split(".");
      if (parts.length !== 3) return new Response(JSON.stringify({ success: false }), { headers: { "Content-Type": "application/json" } });
      const [header, bodyPart, signature] = parts;
      const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
      const expected = createHash("sha256").update(`${header}.${bodyPart}.${secret}`).digest("hex");
      if (signature !== expected) return new Response(JSON.stringify({ success: false }), { headers: { "Content-Type": "application/json" } });
      const payload = JSON.parse(Buffer.from(bodyPart, "base64url").toString());
      const userId = payload.userId;
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL);
      const rows = await sql`SELECT course_id, lesson_id, completed_at FROM lesson_progress WHERE user_id = ${userId}`;
      return new Response(JSON.stringify({ success: true, completedLessons: rows }), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(JSON.stringify({ success: false }), { headers: { "Content-Type": "application/json" } });
    }
  }

  return null; // Not an API route
}

// ── SSR handler (lazy-loaded) ──
let handler = null;
async function getHandler() {
  if (!handler) handler = (await import("./ssr-bundled.mjs")).default;
  return handler;
}

export default async function(req, res) {
  try {
    // Check API routes first
    const apiResp = await handleApiRequest(req);
    if (apiResp) {
      res.statusCode = apiResp.status;
      apiResp.headers.forEach((v, k) => res.setHeader(k, v));
      res.end(await apiResp.text());
      return;
    }
    // Fall through to SSR
    const h = await getHandler();
    var u = new URL(req.url, "https://" + (req.headers?.host || "localhost"));
    var r = new Request(u, { method: req.method, headers: req.headers });
    if (req.method !== "GET" && req.method !== "HEAD") {
      r = new Request(u, { method: req.method, headers: req.headers, body: req.body });
    }
    var resp = await h.fetch(r);
    res.statusCode = resp.status;
    resp.headers.forEach(function(v, k) { res.setHeader(k, v); });
    res.end(await resp.text());
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.end("Error");
  }
}
// deploy: 2026-07-25T19:54:45Z
