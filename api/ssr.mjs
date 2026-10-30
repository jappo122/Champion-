// Vercel ESM runtime fix: provide `require` for CJS modules bundled by esbuild
import { createRequire } from "module";
globalThis.require = createRequire(import.meta.url);

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import {
  apiImpl,
  getSubscriptionState,
  requireTrainingAccess,
  httpStatusFor,
  signupStart,
  signupComplete,
} from "./handlers.mjs";

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

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  let key = password + salt;
  for (let i = 0; i < 1000; i++) {
    key = createHash("sha256").update(key).digest("hex");
  }
  return `${salt}:${key}`;
}

function authPayload(req) {
  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { token } = { ...(body?.data ?? {}), ...(body ?? {}) };
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, bodyPart, signature] = parts;
  const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
  const expected = createHash("sha256").update(`${header}.${bodyPart}.${secret}`).digest("hex");
  if (signature !== expected) return null;
  const payload = JSON.parse(Buffer.from(bodyPart, "base64url").toString());
  if (payload.exp && payload.exp < Date.now()) return null;
  return payload;
}

// ── API route handler ──
function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { "Content-Type": "application/json" } });
}
async function parseJsonBody(req) {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    return body || {};
  } catch {
    return {};
  }
}
async function handleApiRequest(req) {
  // DEPLOY_VERSION: 2026-08-09 — login, session, mark-complete, webinar-url, my-progress,
  // support-ticket, contact, signup, signup-complete, auth-info (direct handlers, no serverFn)
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
      const { token } = { ...(body?.data ?? {}), ...(body ?? {}) };
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
      const { token, courseId, lessonId, quizResults } = { ...(body?.data ?? {}), ...(body ?? {}) };
      const parts = token.split(".");
      if (parts.length !== 3) return new Response(JSON.stringify({ success: false }), { headers: { "Content-Type": "application/json" } });
      const [header, bodyPart, signature] = parts;
      const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
      const expected = createHash("sha256").update(`${header}.${bodyPart}.${secret}`).digest("hex");
      if (signature !== expected) return new Response(JSON.stringify({ success: false }), { headers: { "Content-Type": "application/json" } });
      const payload = JSON.parse(Buffer.from(bodyPart, "base64url").toString());
      // Writing lesson progress / quiz results requires an active subscription.
      const access = await requireTrainingAccess(token);
      if (!access.ok) {
        return new Response(JSON.stringify(access.response), { status: access.status, headers: { "Content-Type": "application/json" } });
      }
      const userId = access.userId;
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

  // GET /api/webinar-url — anyone can read
  if (url.pathname === "/api/webinar-url" && req.method === "GET") {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL);
      await sql`CREATE TABLE IF NOT EXISTS webinar_settings (key TEXT PRIMARY KEY, value TEXT)`;
      const rows = await sql`SELECT value FROM webinar_settings WHERE key = 'webinar_url'`;
      return new Response(JSON.stringify({ success: true, url: rows.length > 0 ? rows[0].value : null }), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }

  // POST /api/webinar-url — manager only
  if (url.pathname === "/api/webinar-url" && req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { token, url: webinarUrl } = body || {};
      if (!token) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
      const parts = token.split(".");
      if (parts.length !== 3) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
      const [header, bodyPart, signature] = parts;
      const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
      const expected = createHash("sha256").update(`${header}.${bodyPart}.${secret}`).digest("hex");
      if (signature !== expected) return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
      const payload = JSON.parse(Buffer.from(bodyPart, "base64url").toString());
      if (payload.role !== "management") return new Response(JSON.stringify({ success: false, error: "Manager access required" }), { status: 403, headers: { "Content-Type": "application/json" } });
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL);
      await sql`CREATE TABLE IF NOT EXISTS webinar_settings (key TEXT PRIMARY KEY, value TEXT)`;
      await sql`INSERT INTO webinar_settings (key, value) VALUES ('webinar_url', ${webinarUrl || ""}) ON CONFLICT (key) DO UPDATE SET value = ${webinarUrl || ""}`;
      return new Response(JSON.stringify({ success: true, url: webinarUrl }), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }

  // ── Support ticket (public POST — contact form) ──
  if (url.pathname === "/api/support-ticket" && req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { name, email, subject, message } = body || {};
      if (!name || !email || !subject || !message) {
        return new Response(JSON.stringify({ success: false, error: "All fields are required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL);
      await sql`INSERT INTO support_tickets (name, email, subject, message) VALUES (${name}, ${email}, ${subject}, ${message})`;
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      console.error("API support-ticket POST error:", err.message);
      return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }

  // ── Contact form (public POST — email to sales + auto-confirmation) ──
  if (url.pathname === "/api/contact" && req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { name, email, phone, wantsCallback, subject, description } = body || {};
      if (!name || !email || !subject || !description) {
        return new Response(JSON.stringify({ success: false, error: "All fields are required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      const FROM_EMAIL = "Sales@championsalestrainingandevents.com";
      const text = `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nCall Back Requested: ${wantsCallback ? "YES — Call this person back" : "No"}\nSubject: ${subject}\n\nDescription/Question/Concern:\n${description}\n`;
      const sendMail = (to, subj, bodyText) =>
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({ from: FROM_EMAIL, to, subject: subj, text: bodyText }),
        });
      try {
        const salesRes = await sendMail(["cstrainingpros@yahoo.com"], `Contact Form: ${subject}`, text);
        if (!salesRes.ok) console.error("API contact: Resend sales notify failed", await salesRes.text());
      } catch (err) {
        console.error("API contact: Resend sales notify error:", err.message);
      }
      try {
        const confirmBody =
          `Hi ${name},\n\nThank you for contacting Champion Sales Training & Events. We've received your message and will respond within 48 hours.\n\nSubject: ${subject}\n\n` +
          (wantsCallback ? `You've requested a call back, so a sales representative will reach out to you at ${phone}.\n\n` : "") +
          `If you need immediate assistance, you can also reach our sales department at cstrainingpros@yahoo.com.\n\n- Champion Sales Training & Events Team`;
        await sendMail([email], "We received your message — Champion Sales Training & Events", confirmBody);
      } catch (err) {
        console.error("API contact: Resend confirmation error:", err.message);
      }
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      console.error("API contact POST error:", err.message);
      return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }

  // ── Signup (public POST — create account + subscription before payment) ──
  // ── Signup (public POST) ──
  // OWNER RULE (2026-10-30): there is no free signup. This creates an INERT
  // account record only — NO subscriptions row — so the gate denies every
  // training surface until a verified Stripe payment runs through
  // /api/signup-complete below.
  if (url.pathname === "/api/signup" && req.method === "POST") {
    try {
      const body = await parseJsonBody(req);
      const result = await signupStart(body);
      return jsonResponse(result.body, result.status);
    } catch (err) {
      console.error("API signup POST error:", err.message);
      return jsonResponse({ success: false, error: "Server error" }, 500);
    }
  }

  // ── Signup complete (public POST) ──
  // The ONLY path that activates an account. It requires a Stripe checkout
  // session id and verifies it against Stripe server-side. Caller-supplied
  // fields such as ?payment=success&tier=premium&email=… are IGNORED: they
  // grant nothing. Missing STRIPE_SECRET_KEY fails closed (503).
  if (url.pathname === "/api/signup-complete" && req.method === "POST") {
    try {
      const body = await parseJsonBody(req);
      const result = await signupComplete(body, url.searchParams);
      return jsonResponse(result.body, result.status);
    } catch (err) {
      console.error("API signup-complete POST error:", err.message);
      return jsonResponse({ success: false, error: "Server error" }, 500);
    }
  }

  // ── Auth info (POST — validate token, return user + effective tier) ──
  if (url.pathname === "/api/auth-info" && req.method === "POST") {
    try {
      const payload = authPayload(req);
      if (!payload) return new Response(JSON.stringify({ authenticated: false, user: null }), { headers: { "Content-Type": "application/json" } });
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL);
      const userResult = await sql`SELECT id, email, name, role, session_token FROM users WHERE id = ${payload.userId}`;
      if (userResult.length === 0) return new Response(JSON.stringify({ authenticated: false, user: null }), { headers: { "Content-Type": "application/json" } });
      const user = userResult[0];
      // Subscription is the gate for training (owner rule). Report the truth:
      // tier is the real tier from an ACTIVE subscription, or null when there is
      // none — never a defaulted "basic". Demo/owner accounts always pass.
      const sub = await getSubscriptionState(user);
      return new Response(JSON.stringify({
        authenticated: true,
        subscribed: sub.subscribed,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, tier: sub.tier, subscribed: sub.subscribed },
      }), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      console.error("API auth-info POST error:", err.message);
      return new Response(JSON.stringify({ authenticated: false, user: null }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }

  // ── Shared handler dispatcher (api/handlers.mjs — same source as serve.ts) ──
  // POST /api/<name> with { data: {...} } → apiImpl[name](data). No overlap with
  // the explicit handlers above; placed before the remaining handlers for clarity.
  if (url.pathname.startsWith("/api/") && req.method === "POST") {
    const name = url.pathname.slice("/api/".length);
    if (apiImpl && typeof apiImpl[name] === "function") {
      try {
        const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
        const result = await apiImpl[name](body?.data ?? body);
        // Subscription-gated handlers return 403 so the gate holds for direct
        // API calls (see httpStatusFor in api/handlers.mjs).
        return new Response(JSON.stringify(result), { status: httpStatusFor(result), headers: { "Content-Type": "application/json" } });
      } catch (err) {
        console.error(`API ${name} error:`, err.message);
        return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
      }
    }
  }

  // POST /api/my-progress — get completed lessons
  if (url.pathname === "/api/my-progress" && req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { token } = { ...(body?.data ?? {}), ...(body ?? {}) };
      const parts = token.split(".");
      if (parts.length !== 3) return new Response(JSON.stringify({ success: false }), { headers: { "Content-Type": "application/json" } });
      const [header, bodyPart, signature] = parts;
      const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
      const expected = createHash("sha256").update(`${header}.${bodyPart}.${secret}`).digest("hex");
      if (signature !== expected) return new Response(JSON.stringify({ success: false }), { headers: { "Content-Type": "application/json" } });
      const payload = JSON.parse(Buffer.from(bodyPart, "base64url").toString());
      // Training progress is subscription-gated (owner rule).
      const access = await requireTrainingAccess(token);
      if (!access.ok) {
        return new Response(JSON.stringify(access.response), { status: access.status, headers: { "Content-Type": "application/json" } });
      }
      const userId = access.userId;
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
