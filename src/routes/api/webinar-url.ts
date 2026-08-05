import { createAPIFileRoute } from "@tanstack/react-start/api";
import { sql } from "~/db";
import { createHash } from "node:crypto";

// ── JWT verification (matches signup/complete.tsx format) ──────────────────

function getSecret() {
  return process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
}

function verifyToken(token: string): { userId: number; email: string; role: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, bodyB64, sig] = parts;
    const expectedSig = createHash("sha256")
      .update(`${headerB64}.${bodyB64}.${getSecret()}`)
      .digest("hex");

    if (sig !== expectedSig) return null;

    const body = JSON.parse(Buffer.from(bodyB64, "base64url").toString());

    // Check expiration
    if (body.exp && body.exp < Date.now()) return null;

    return { userId: body.userId, email: body.email, role: body.role };
  } catch {
    return null;
  }
}

// ── Ensure site_settings table exists ──────────────────────────────────────

async function ensureTable() {
  const db = sql();
  await db`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

// ── GET handler: return the current webinar URL ────────────────────────────

export const GET = createAPIFileRoute("/api/webinar-url")({
  handler: async () => {
    try {
      await ensureTable();
      const db = sql();
      const rows = await db`SELECT value FROM site_settings WHERE key = 'webinar_url'`;
      const url = rows.length > 0 ? (rows[0] as { value: string }).value : null;
      return new Response(JSON.stringify({ success: true, url }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("[webinar-url GET] Error:", err);
      return new Response(JSON.stringify({ success: false, url: null }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});

// ── POST handler: save the webinar URL (managers only) ─────────────────────

export const POST = createAPIFileRoute("/api/webinar-url")({
  handler: async ({ request }) => {
    try {
      const body = (await request.json()) as { token: string; url: string };
      const { token, url } = body;

      if (!token) {
        return new Response(JSON.stringify({ success: false, error: "Authentication required." }), {
          status: 401, headers: { "Content-Type": "application/json" },
        });
      }

      // Verify JWT
      const user = verifyToken(token);
      if (!user) {
        return new Response(JSON.stringify({ success: false, error: "Invalid or expired token." }), {
          status: 401, headers: { "Content-Type": "application/json" },
        });
      }

      // Only managers can configure webinar URL
      if (user.role !== "management") {
        return new Response(JSON.stringify({ success: false, error: "Only managers can configure the webinar URL." }), {
          status: 403, headers: { "Content-Type": "application/json" },
        });
      }

      await ensureTable();
      const db = sql();

      // Upsert
      await db`
        INSERT INTO site_settings (key, value, updated_at)
        VALUES ('webinar_url', ${url || ""}, NOW())
        ON CONFLICT (key) DO UPDATE SET value = ${url || ""}, updated_at = NOW()
      `;

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("[webinar-url POST] Error:", err);
      return new Response(JSON.stringify({ success: false, error: "Something went wrong." }), {
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
