// Standalone Vercel serverless function for mark-complete
import { neon } from "@neondatabase/serverless";
import { createHash } from "crypto";

function verifyToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, bodyPart, signature] = parts;
    const secret = process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
    const expected = createHash("sha256").update(`${header}.${bodyPart}.${secret}`).digest("hex");
    if (signature !== expected) return null;
    return JSON.parse(Buffer.from(bodyPart, "base64url").toString());
  } catch { return null; }
}

export default async function(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { token, courseId, lessonId, quizResults } = body || {};
    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }
    const userId = payload.userId;
    const sql = neon(process.env.DATABASE_URL);
    
    if (quizResults && quizResults.total > 0) {
      const percent = Math.round((quizResults.correct / quizResults.total) * 100);
      if (percent < 80) {
        return res.status(200).json({ success: false, error: `Score ${percent}% — need 80% or higher to mark complete`, scoreNeeded: 80 });
      }
    }
    
    await sql`INSERT INTO lesson_progress (user_id, course_id, lesson_id) VALUES (${userId}, ${courseId}, ${lessonId}) ON CONFLICT (user_id, lesson_id) DO NOTHING`;
    await sql`UPDATE module_assignments SET completed_at = NOW() WHERE salesperson_id = ${userId} AND course_id = ${courseId} AND (lesson_id = ${lessonId} OR lesson_id IS NULL) AND completed_at IS NULL`;
    
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("mark-complete error:", err.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
