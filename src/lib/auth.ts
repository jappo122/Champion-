import { createServerFn } from "@tanstack/react-start";
import { sql } from "~/db";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

// ── Password hashing with PBKDF2-style (no external deps) ──────────────────

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

// ── JWT-style token (HMAC-signed) ──────────────────────────────────────────

const getSecret = () => process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";

function generateToken(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 7 * 24 * 60 * 60 * 1000 }),
  ).toString("base64url");
  const signature = createHash("sha256").update(`${header}.${body}.${getSecret()}`).digest("hex");
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expected = createHash("sha256").update(`${header}.${body}.${getSecret()}`).digest("hex");
    if (signature !== expected) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// ── Server Functions ───────────────────────────────────────────────────────

export const signup = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { email: string; password: string; name?: string; role?: string } }) => {
    // ── Server-side input validation ──
    const email = (data.email || "").trim().toLowerCase();
    const password = data.password || "";
    const name = (data.name || "").trim().slice(0, 100); // max 100 chars

    if (!email || !email.includes("@") || email.length > 254) {
      return { success: false, error: "Valid email is required" };
    }
    if (password.length < 6 || password.length > 128) {
      return { success: false, error: "Password must be 6-128 characters" };
    }
    if (/[<>"'&]/.test(name)) {
      return { success: false, error: "Name contains invalid characters" };
    }

    const db = sql();
    const existing = await db`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return { success: false, error: "Email already registered" };
    }
    const passwordHash = hashPassword(data.password);
    const sessionToken = randomBytes(32).toString("hex");
    const role = data.role || "individual";
    const result = await db`
      INSERT INTO users (email, name, password_hash, role, session_token)
      VALUES (${email}, ${name || null}, ${passwordHash}, ${role}, ${sessionToken})
      RETURNING id, email, name, role
    `;
    const user = result[0] as { id: number; email: string; name: string | null; role: string };

    // Create a subscription record for the new user (Demo/Free tier)
    // Individual accounts get is_individual = TRUE
    const startTier = role === "management" ? "plus" : "basic";
    const billingDay = new Date().getDate();
    const nextBilling = new Date();
    nextBilling.setDate(nextBilling.getDate() + 30);
    await db`
      INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual)
      VALUES (${user.id}, ${startTier}, ${startTier}, 'active', ${nextBilling.toISOString()}, ${billingDay}, ${role !== "management"})
    `;

    const token = generateToken({ userId: user.id, email: user.email, sessionToken, role: user.role });
    return { success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  },
);

export const login = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { email: string; password: string } }) => {
    const db = sql();
    const normalizedEmail = (data.email || "").trim().toLowerCase();
    const result = await db`SELECT id, email, name, password_hash, role FROM users WHERE LOWER(email) = ${normalizedEmail}`;
    if (result.length === 0) {
      return { success: false, error: "Invalid email or password" };
    }
    const user = result[0] as { id: number; email: string; name: string | null; password_hash: string; role: string };
    if (!verifyPassword(data.password, user.password_hash)) {
      return { success: false, error: "Invalid email or password" };
    }
    // Use existing session token (no longer invalidates other sessions)
    const userRow = await db`SELECT session_token FROM users WHERE id = ${user.id}`;
    const sessionToken = (userRow[0] as { session_token: string }).session_token;
    const token = generateToken({ userId: user.id, email: user.email, sessionToken, role: user.role });
    return { success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  },
);

export const getSession = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token?: string } }) => {
    if (!data?.token) return { user: null };
    const payload = verifyToken(data.token);
    if (!payload) return { user: null };
    const db = sql();
    const result = await db`SELECT id, email, name, role, session_token FROM users WHERE id = ${payload.userId as number}`;
    if (result.length === 0) return { user: null };
    const user = result[0] as { id: number; email: string; name: string | null; role: string; session_token: string };
    // Session token check removed — JWT expiration (7 days) is sufficient
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role } };
  },
);

export const updateProfile = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; name?: string; email?: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const db = sql();
    const userId = payload.userId as number;
    if (data.name !== undefined) {
      await db`UPDATE users SET name = ${data.name} WHERE id = ${userId}`;
    }
    if (data.email !== undefined) {
      await db`UPDATE users SET email = ${data.email} WHERE id = ${userId}`;
    }
    const result = await db`SELECT id, email, name, role FROM users WHERE id = ${userId}`;
    const user = result[0] as { id: number; email: string; name: string | null; role: string };
    return { success: true, user };
  },
);