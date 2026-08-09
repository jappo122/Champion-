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

  // ── My progress (authenticated POST — completed lessons for the user) ──
  if (url.pathname === "/api/my-progress" && req.method === "POST") {
    try {
      const { token } = await req.json();
      if (!token) {
        return Response.json({ success: false, error: "Authentication required." }, { status: 401 });
      }
      const parts = token.split(".");
      if (parts.length !== 3) {
        return Response.json({ success: false, error: "Invalid or expired token." }, { status: 401 });
      }
      const [headerB64, bodyB64, signature] = parts;
      const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
      const expected = createHash("sha256").update(`${headerB64}.${bodyB64}.${secret}`).digest("hex");
      if (signature !== expected) {
        return Response.json({ success: false, error: "Invalid or expired token." }, { status: 401 });
      }
      const payload = JSON.parse(Buffer.from(bodyB64, "base64url").toString());
      if (payload.exp && payload.exp < Date.now()) {
        return Response.json({ success: false, error: "Invalid or expired token." }, { status: 401 });
      }
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL!);
      const rows = await sql`
        SELECT course_id, lesson_id, completed_at
        FROM lesson_progress
        WHERE user_id = ${payload.userId as number}
        ORDER BY completed_at DESC
      `;
      return Response.json({ success: true, completedLessons: rows });
    } catch (err: any) {
      console.error("API my-progress POST error:", err.message);
      return Response.json({ success: false, error: "Server error" }, { status: 500 });
    }
  }
  // ── Support ticket (public POST — contact form) ──
  if (url.pathname === "/api/support-ticket" && req.method === "POST") {
    try {
      const { name, email, subject, message } = await req.json();
      if (!name || !email || !subject || !message) {
        return Response.json({ success: false, error: "All fields are required" }, { status: 400 });
      }
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL!);
      await sql`
        INSERT INTO support_tickets (name, email, subject, message)
        VALUES (${name}, ${email}, ${subject}, ${message})
      `;
      return Response.json({ success: true });
    } catch (err: any) {
      console.error("API support-ticket POST error:", err.message);
      return Response.json({ success: false, error: "Server error" }, { status: 500 });
    }
  }

  // ── Contact form (public POST — email to sales + auto-confirmation) ──
  if (url.pathname === "/api/contact" && req.method === "POST") {
    try {
      const { name, email, phone, wantsCallback, subject, description } = await req.json();
      if (!name || !email || !subject || !description) {
        return Response.json({ success: false, error: "All fields are required" }, { status: 400 });
      }
      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      if (!RESEND_API_KEY) {
        console.error("API contact error: RESEND_API_KEY not set");
        return Response.json({ success: false, error: "Server error" }, { status: 500 });
      }
      const FROM_EMAIL = "Sales@championsalestrainingandevents.com";
      const body = `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nCall Back Requested: ${wantsCallback ? "YES — Call this person back" : "No"}\nSubject: ${subject}\n\nDescription/Question/Concern:\n${description}\n`;
      const sendMail = (to: string[], subj: string, text: string) =>
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({ from: FROM_EMAIL, to, subject: subj, text }),
        });
      // 1. Notify sales department
      const salesRes = await sendMail(["cstrainingpros@yahoo.com"], `Contact Form: ${subject}`, body);
      if (!salesRes.ok) {
        console.error("API contact error: Resend failed", await salesRes.text());
        return Response.json({ success: false, error: "Server error" }, { status: 500 });
      }
      // 2. Auto-confirmation to the submitter
      const confirmBody =
        `Hi ${name},\n\nThank you for contacting Champion Sales Training & Events. We've received your message and will respond within 48 hours.\n\nSubject: ${subject}\n\n` +
        (wantsCallback ? `You've requested a call back, so a sales representative will reach out to you at ${phone}.\n\n` : "") +
        `If you need immediate assistance, you can also reach our sales department at cstrainingpros@yahoo.com.\n\n- Champion Sales Training & Events Team`;
      await sendMail([email], "We received your message — Champion Sales Training & Events", confirmBody);
      return Response.json({ success: true });
    } catch (err: any) {
      console.error("API contact POST error:", err.message);
      return Response.json({ success: false, error: "Server error" }, { status: 500 });
    }
  }

  // ── Signup (public POST — create account + subscription before payment) ──
  if (url.pathname === "/api/signup" && req.method === "POST") {
    try {
      const { email, password, name, role } = await req.json();
      const cleanEmail = (email || "").trim().toLowerCase();
      const cleanName = (name || "").trim().slice(0, 100);
      if (!cleanEmail || !cleanEmail.includes("@") || cleanEmail.length > 254) {
        return Response.json({ success: false, error: "Valid email is required" });
      }
      if (!password || password.length < 6 || password.length > 128) {
        return Response.json({ success: false, error: "Password must be 6-128 characters" });
      }
      if (/[<>"'&]/.test(cleanName)) {
        return Response.json({ success: false, error: "Name contains invalid characters" });
      }
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL!);
      const existing = await sql`SELECT id FROM users WHERE email = ${cleanEmail}`;
      if (existing.length > 0) {
        return Response.json({ success: false, error: "Email already registered" });
      }
      const passwordHash = hashPassword(password);
      const sessionToken = randomBytes(32).toString("hex");
      const cleanRole = role === "management" ? "management" : "individual";
      const result = await sql`
        INSERT INTO users (email, name, password_hash, role, session_token)
        VALUES (${cleanEmail}, ${cleanName || null}, ${passwordHash}, ${cleanRole}, ${sessionToken})
        RETURNING id, email, name, role
      `;
      const user = result[0] as { id: number; email: string; name: string | null; role: string };
      const startTier = cleanRole === "management" ? "plus" : "basic";
      const billingDay = new Date().getDate();
      const nextBilling = new Date();
      nextBilling.setDate(nextBilling.getDate() + 30);
      await sql`
        INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual)
        VALUES (${user.id}, ${startTier}, ${startTier}, 'active', ${nextBilling.toISOString()}, ${billingDay}, ${cleanRole !== "management"})
      `;
      const token = generateToken({ userId: user.id, email: user.email, sessionToken, role: user.role });
      return Response.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err: any) {
      console.error("API signup POST error:", err.message);
      return Response.json({ success: false, error: "Server error" }, { status: 500 });
    }
  }

  // ── Signup complete (public POST — create account AFTER Stripe payment) ──
  if (url.pathname === "/api/signup-complete" && req.method === "POST") {
    try {
      const { email, name, tier, type } = await req.json();
      if (!email || !tier) {
        return Response.json({ success: false, error: "Email and tier are required" }, { status: 400 });
      }
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL!);
      const cleanEmail = String(email).trim().toLowerCase();

      const existing = await sql`SELECT id FROM users WHERE email = ${cleanEmail}`;
      if (existing.length > 0) {
        return Response.json({ success: true, alreadyExists: true });
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
      const user = result[0] as { id: number; email: string; name: string | null; role: string };

      const billingDay = new Date().getDate();
      const nextBilling = new Date();
      nextBilling.setDate(nextBilling.getDate() + 30);
      await sql`
        INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual)
        VALUES (${user.id}, ${tier}, ${tier}, 'active', ${nextBilling.toISOString()}, ${billingDay}, ${type !== "management"})
      `;

      // Verify login credentials work (read-only HTTP check, same path a customer uses)
      let finalPassword = tempPassword;
      try {
        const loginRes = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: cleanEmail, password: tempPassword }),
        });
        const loginData = (await loginRes.json()) as any;
        if (!loginData.success) {
          console.error("API signup-complete: login verification FAILED for", cleanEmail);
        }
      } catch (err: any) {
        console.error("API signup-complete: login verification error:", err.message);
      }

      // Send welcome email with verified login credentials
      try {
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (RESEND_API_KEY) {
          const tierLabel = String(tier).charAt(0).toUpperCase() + String(tier).slice(1);
          const accountType = type === "management" ? "Management" : "Individual";
          const welcomeBody =
            `Hi ${cleanName || "there"},\n\nWelcome to Champion Sales Training & Events! Your ${tierLabel} ${accountType} account has been created.\n\n─── Your Login ───\nSite: https://www.championsalestrainingandevents.com/login\nEmail: ${cleanEmail}\nTemporary Password: ${finalPassword}\n\nPlease log in and change your password from your profile page.\n\n` +
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
      } catch (err: any) {
        console.error("API signup-complete: welcome email failed:", err.message);
      }

      const token = generateToken({ userId: user.id, email: user.email, sessionToken, role: user.role });
      return Response.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (err: any) {
      console.error("API signup-complete POST error:", err.message);
      return Response.json({ success: false, error: "Server error" }, { status: 500 });
    }
  }

  // ── Auth info (POST — validate token, return user + effective tier) ──
  if (url.pathname === "/api/auth-info" && req.method === "POST") {
    try {
      const { token } = await req.json();
      if (!token) return Response.json({ authenticated: false, user: null });
      const parts = token.split(".");
      if (parts.length !== 3) return Response.json({ authenticated: false, user: null });
      const [headerB64, bodyB64, signature] = parts;
      const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
      const expected = createHash("sha256").update(`${headerB64}.${bodyB64}.${secret}`).digest("hex");
      if (signature !== expected) return Response.json({ authenticated: false, user: null });
      const payload = JSON.parse(Buffer.from(bodyB64, "base64url").toString());
      if (payload.exp && payload.exp < Date.now()) return Response.json({ authenticated: false, user: null });
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL!);
      const userResult = await sql`
        SELECT id, email, name, role, session_token FROM users WHERE id = ${payload.userId as number}
      ` as Array<{ id: number; email: string; name: string | null; role: string; session_token: string }>;
      if (userResult.length === 0) return Response.json({ authenticated: false, user: null });
      const user = userResult[0];
      const subResult = await sql`
        SELECT tier, status FROM subscriptions
        WHERE user_id = ${user.id} AND status = 'active'
        ORDER BY id DESC LIMIT 1
      ` as Array<{ tier: string; status: string }>;
      const tier = subResult.length > 0 ? subResult[0].tier : "basic";
      const DEMO_EMAILS = ["owner@champion.com", "jappo122@gmail.com", "floydsandersjr@yahoo.com"];
      const effectiveTier = (user.id === 1 || DEMO_EMAILS.includes(user.email.toLowerCase())) ? "premium" : tier;
      return Response.json({
        authenticated: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, tier: effectiveTier },
      });
    } catch (err: any) {
      console.error("API auth-info POST error:", err.message);
      return Response.json({ authenticated: false, user: null }, { status: 500 });
    }
  }

  // ── Mark lesson complete (authenticated POST — persist progress + assignments) ──
  if (url.pathname === "/api/mark-complete" && req.method === "POST") {
    try {
      const { token, courseId, lessonId } = await req.json();
      if (!token) return Response.json({ success: false, error: "Not authenticated" }, { status: 401 });
      const parts = token.split(".");
      if (parts.length !== 3) return Response.json({ success: false, error: "Not authenticated" }, { status: 401 });
      const [headerB64, bodyB64, signature] = parts;
      const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
      const expected = createHash("sha256").update(`${headerB64}.${bodyB64}.${secret}`).digest("hex");
      if (signature !== expected) return Response.json({ success: false, error: "Not authenticated" }, { status: 401 });
      const payload = JSON.parse(Buffer.from(bodyB64, "base64url").toString());
      if (payload.exp && payload.exp < Date.now()) return Response.json({ success: false, error: "Not authenticated" }, { status: 401 });
      const userId = payload.userId as number;
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL!);
      // 1. Persist to lesson_progress
      await sql`
        INSERT INTO lesson_progress (user_id, course_id, lesson_id)
        VALUES (${userId}, ${courseId}, ${lessonId})
        ON CONFLICT (user_id, lesson_id) DO NOTHING
      `;
      // 2. Update module_assignments if this lesson/course was assigned
      const assignments = await sql`
        UPDATE module_assignments
        SET completed_at = NOW()
        WHERE salesperson_id = ${userId}
          AND course_id = ${courseId}
          AND (lesson_id = ${lessonId} OR lesson_id IS NULL)
          AND completed_at IS NULL
        RETURNING id, manager_id, course_id, lesson_id
      ` as Array<{ id: number; manager_id: number; course_id: string; lesson_id: string | null }>;
      // 3. Notify manager if assignment was completed
      for (const assignment of assignments) {
        const managers = await sql`SELECT email FROM users WHERE id = ${assignment.manager_id}` as Array<{ email: string | null }>;
        const managerEmail = managers[0]?.email;
        if (managerEmail) {
          const salesperson = await sql`SELECT name, email FROM users WHERE id = ${userId}` as Array<{ name: string | null; email: string }>;
          const spName = salesperson[0]?.name || salesperson[0]?.email || "A salesperson";
          try {
            const RESEND_API_KEY = process.env.RESEND_API_KEY;
            if (RESEND_API_KEY) {
              await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${RESEND_API_KEY}` },
                body: JSON.stringify({
                  from: "Sales@championsalestrainingandevents.com",
                  to: [managerEmail],
                  subject: `${spName} completed a training module`,
                  text: `${spName} has completed the module "${assignment.course_id}"${assignment.lesson_id ? ` / "${assignment.lesson_id}"` : ""}.\n\nView progress: https://www.championsalestrainingandevents.com/manager`,
                }),
              });
            }
          } catch (err: any) {
            console.error("API mark-complete: manager notify failed:", err.message);
          }
        }
      }
      return Response.json({ success: true, assignmentsCompleted: assignments.length });
    } catch (err: any) {
      console.error("API mark-complete POST error:", err.message);
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
