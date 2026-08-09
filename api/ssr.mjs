// Vercel ESM runtime fix: provide `require` for CJS modules bundled by esbuild
import { createRequire } from "module";
globalThis.require = createRequire(import.meta.url);

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { apiImpl } from "./handlers.mjs";

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
  const { token } = body || {};
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
  if (url.pathname === "/api/signup" && req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { email, password, name, role } = body || {};
      const cleanEmail = (email || "").trim().toLowerCase();
      const cleanName = (name || "").trim().slice(0, 100);
      if (!cleanEmail || !cleanEmail.includes("@") || cleanEmail.length > 254) {
        return new Response(JSON.stringify({ success: false, error: "Valid email is required" }), { headers: { "Content-Type": "application/json" } });
      }
      if (!password || password.length < 6 || password.length > 128) {
        return new Response(JSON.stringify({ success: false, error: "Password must be 6-128 characters" }), { headers: { "Content-Type": "application/json" } });
      }
      if (/[<>"'&]/.test(cleanName)) {
        return new Response(JSON.stringify({ success: false, error: "Name contains invalid characters" }), { headers: { "Content-Type": "application/json" } });
      }
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL);
      const existing = await sql`SELECT id FROM users WHERE email = ${cleanEmail}`;
      if (existing.length > 0) {
        return new Response(JSON.stringify({ success: false, error: "Email already registered" }), { headers: { "Content-Type": "application/json" } });
      }
      const passwordHash = hashPassword(password);
      const sessionToken = randomBytes(32).toString("hex");
      const cleanRole = role === "management" ? "management" : "individual";
      const result = await sql`
        INSERT INTO users (email, name, password_hash, role, session_token)
        VALUES (${cleanEmail}, ${cleanName || null}, ${passwordHash}, ${cleanRole}, ${sessionToken})
        RETURNING id, email, name, role
      `;
      const user = result[0];
      const startTier = cleanRole === "management" ? "plus" : "basic";
      const billingDay = new Date().getDate();
      const nextBilling = new Date();
      nextBilling.setDate(nextBilling.getDate() + 30);
      await sql`
        INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual)
        VALUES (${user.id}, ${startTier}, ${startTier}, 'active', ${nextBilling.toISOString()}, ${billingDay}, ${cleanRole !== "management"})
      `;
      const token = generateToken({ userId: user.id, email: user.email, sessionToken, role: user.role });
      return new Response(JSON.stringify({ success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      console.error("API signup POST error:", err.message);
      return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }

  // ── Signup complete (public POST — create account AFTER Stripe payment) ──
  if (url.pathname === "/api/signup-complete" && req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { email, name, tier, type } = body || {};
      if (!email || !tier) {
        return new Response(JSON.stringify({ success: false, error: "Email and tier are required" }), { status: 400, headers: { "Content-Type": "application/json" } });
      }
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL);
      const cleanEmail = String(email).trim().toLowerCase();
      const existing = await sql`SELECT id FROM users WHERE email = ${cleanEmail}`;
      if (existing.length > 0) {
        return new Response(JSON.stringify({ success: true, alreadyExists: true }), { headers: { "Content-Type": "application/json" } });
      }
      const tempPassword = randomBytes(12).toString("hex");
      const passwordHash = hashPassword(tempPassword);
      const sessionToken = randomBytes(32).toString("hex");
      const role = type === "management" ? "management" : "individual";
      const cleanName = (name || "").trim().slice(0, 100) || null;
      const result = await sql`
        INSERT INTO users (email, name, password_hash, role, session_token)
        VALUES (${cleanEmail}, ${cleanName}, ${passwordHash}, ${role}, ${sessionToken})
        RETURNING id, email, name, role
      `;
      const user = result[0];
      const billingDay = new Date().getDate();
      const nextBilling = new Date();
      nextBilling.setDate(nextBilling.getDate() + 30);
      await sql`
        INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual)
        VALUES (${user.id}, ${tier}, ${tier}, 'active', ${nextBilling.toISOString()}, ${billingDay}, ${type !== "management"})
      `;
      try {
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (RESEND_API_KEY) {
          const tierLabel = String(tier).charAt(0).toUpperCase() + String(tier).slice(1);
          const accountType = type === "management" ? "Management" : "Individual";
          const welcomeBody =
            `Hi ${cleanName || "there"},\n\nWelcome to Champion Sales Training & Events! Your ${tierLabel} ${accountType} account has been created.\n\n─── Your Login ───\nSite: https://www.championsalestrainingandevents.com/login\nEmail: ${cleanEmail}\nTemporary Password: ${tempPassword}\n\nPlease log in and change your password from your profile page.\n\n` +
            (type === "management"
              ? "─── Next Steps ───\n- Add your sales team from your manager dashboard\n- Assign training modules based on skill gaps\n- Track team progress and sales performance\n\n"
              : "") +
            `Get started now!\n\n- Champion Sales Training Team`;
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_API_KEY}` },
            body: JSON.stringify({
              from: "Sales@championsalestrainingandevents.com",
              to: [cleanEmail],
              subject: `Welcome to Champion Sales Training — Your ${accountType} Account is Ready`,
              text: welcomeBody,
            }),
          });
        }
      } catch (err) {
        console.error("API signup-complete: welcome email failed:", err.message);
      }
      const token = generateToken({ userId: user.id, email: user.email, sessionToken, role: user.role });
      return new Response(JSON.stringify({ success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
      console.error("API signup-complete POST error:", err.message);
      return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
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
      const subResult = await sql`SELECT tier, status FROM subscriptions WHERE user_id = ${user.id} AND status = 'active' ORDER BY id DESC LIMIT 1`;
      const tier = subResult.length > 0 ? subResult[0].tier : "basic";
      const DEMO_EMAILS = ["owner@champion.com", "jappo122@gmail.com", "floydsandersjr@yahoo.com"];
      const effectiveTier = (user.id === 1 || DEMO_EMAILS.includes(user.email.toLowerCase())) ? "premium" : tier;
      return new Response(JSON.stringify({ authenticated: true, user: { id: user.id, email: user.email, name: user.name, role: user.role, tier: effectiveTier } }), { headers: { "Content-Type": "application/json" } });
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
        return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
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
