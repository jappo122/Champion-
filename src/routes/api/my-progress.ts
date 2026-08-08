import { createAPIFileRoute } from "@tanstack/react-start/api";
import { sql } from "~/db";
import { createHash } from "node:crypto";

// ── JWT verification (matches webinar-url.ts / signup format) ─────────────
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
    if (body.exp && body.exp < Date.now()) return null;
    return { userId: body.userId, email: body.email, role: body.role };
  } catch {
    return null;
  }
}

// ── POST handler: return the authenticated user's completed lessons ───────
export const POST = createAPIFileRoute("/api/my-progress")({
  handler: async ({ request }) => {
    try {
      const body = (await request.json()) as { token?: string };
      const { token } = body;
      if (!token) {
        return new Response(JSON.stringify({ success: false, error: "Authentication required." }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      const user = verifyToken(token);
      if (!user) {
        return new Response(JSON.stringify({ success: false, error: "Invalid or expired token." }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      const db = sql();
      const rows = (await db`
        SELECT course_id, lesson_id, completed_at
        FROM lesson_progress
        WHERE user_id = ${user.userId}
        ORDER BY completed_at DESC
      `) as Array<{ course_id: string; lesson_id: string; completed_at: string }>;
      return new Response(
        JSON.stringify({ success: true, completedLessons: rows }),
        { headers: { "Content-Type": "application/json" } },
      );
    } catch (err) {
      console.error("[my-progress POST] Error:", err);
      return new Response(
        JSON.stringify({ success: false, error: "Could not load progress." }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  },
});
