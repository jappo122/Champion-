// Migration: Add lesson_progress and manager_messages tables
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  try {
    // Create lesson_progress table
    await sql`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id VARCHAR(255) NOT NULL,
        lesson_id VARCHAR(255) NOT NULL,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(user_id, lesson_id)
      )
    `;
    console.log("✅ lesson_progress table ready");

    // Create manager_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS manager_messages (
        id SERIAL PRIMARY KEY,
        from_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        to_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    console.log("✅ manager_messages table ready");

    // Create index for faster queries
    await sql`CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_lesson_progress_course ON lesson_progress(course_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_manager_messages_to ON manager_messages(to_user_id, is_read)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_manager_messages_from ON manager_messages(from_user_id)`;
    console.log("✅ indexes created");

    console.log("🎉 Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();