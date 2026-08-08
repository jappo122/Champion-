import { createServerFn } from "@tanstack/react-start";
import { sql } from "~/db";
import { createHash, randomBytes } from "node:crypto";
import { courses as catalogCourses } from "~/content/courses";

// ── Token verification (inlined to avoid build issues with shared imports) ──

const getSecret = () => process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";

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

// ── Helper ──────────────────────────────────────────────────────────────────

function verifyManager(token: string): { userId: number; email: string } | null {
  const payload = verifyToken(token);
  if (!payload) return null;
  return { userId: payload.userId as number, email: payload.email as string };
}

// ── Server Functions ────────────────────────────────────────────────────────

/** Get the current user's own lesson progress (for individual salespeople). */
export const getMyProgress = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const userId = payload.userId as number;

    const db = sql();

    const userResult = await db`
      SELECT id, email, name FROM users WHERE id = ${userId}
    ` as Array<{ id: number; email: string; name: string | null }>;
    if (userResult.length === 0) return { success: false, error: "User not found" };
    const user = userResult[0];

    const completedLessons = await db`
      SELECT course_id, lesson_id, completed_at FROM lesson_progress WHERE user_id = ${userId}
    ` as Array<{ course_id: string; lesson_id: string; completed_at: string }>;

    const completedMap = new Map(completedLessons.map((l) => [l.lesson_id, l.completed_at]));

    return {
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      completedLessons: completedLessons.map((l) => ({
        ...l,
        completed_at: String(l.completed_at),
      })),
      completedMap: Object.fromEntries(completedMap),
    };
  },
);

/** Mark a lesson as completed for the current user (individual). */
export const markMyLessonComplete = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; courseId: string; lessonId: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const userId = payload.userId as number;

    const db = sql();

    // 1. Persist to lesson_progress
    await db`
      INSERT INTO lesson_progress (user_id, course_id, lesson_id)
      VALUES (${userId}, ${data.courseId}, ${data.lessonId})
      ON CONFLICT (user_id, lesson_id) DO NOTHING
    `;

    // 2. Update module_assignments if this lesson/course was assigned
    const assignments = await db`
      UPDATE module_assignments 
      SET completed_at = NOW() 
      WHERE salesperson_id = ${userId} 
        AND course_id = ${data.courseId}
        AND (lesson_id = ${data.lessonId} OR lesson_id IS NULL)
        AND completed_at IS NULL
      RETURNING id, manager_id, course_id, lesson_id
    ` as Array<{ id: number; manager_id: number; course_id: string; lesson_id: string | null }>;

    // 3. Notify manager if assignment was completed
    for (const assignment of assignments) {
      const managers = await db`
        SELECT email FROM users WHERE id = ${assignment.manager_id}
      ` as Array<{ email: string | null }>;
      const managerEmail = managers[0]?.email;
      if (managerEmail) {
        // Get salesperson name
        const salesperson = await db`
          SELECT name, email FROM users WHERE id = ${userId}
        ` as Array<{ name: string | null; email: string }>;
        const spName = salesperson[0]?.name || salesperson[0]?.email || "A salesperson";

        try {
          const RESEND_API_KEY = process.env.RESEND_API_KEY;
          if (RESEND_API_KEY) {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`,
              },
              body: JSON.stringify({
                from: "Sales@championsalestrainingandevents.com",
                to: [managerEmail],
                subject: `${spName} completed a training module`,
                text: `${spName} has completed the module "${assignment.course_id}"${assignment.lesson_id ? ` / "${assignment.lesson_id}"` : ""}.\n\nView progress: https://www.championsalestrainingandevents.com/manager`,
              }),
            });
          } else {
            console.log(`[Email] Would notify ${managerEmail}: ${spName} completed ${assignment.course_id}`);
          }
        } catch (err) {
          console.error("[Email] Failed to notify manager:", err);
        }
      }
    }

    return { success: true, assignmentsCompleted: assignments.length };
  },
);

/** Remove a lesson completion for the current user (individual). */
export const removeMyLessonComplete = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; lessonId: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const userId = payload.userId as number;

    const db = sql();
    await db`
      DELETE FROM lesson_progress WHERE user_id = ${userId} AND lesson_id = ${data.lessonId}
    `;

    return { success: true };
  },
);

// ── Manager-only functions below ──────────────────────────────────────────

/** Get the full sales team (users with role 'user'), their progress stats, and unread message counts. */
export const getTeamProgress = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();

    // Get all salespeople (users with role 'user')
    const salespeople = await db`
      SELECT id, email, name, created_at FROM users WHERE role = 'user' ORDER BY name ASC, email ASC
    ` as Array<{ id: number; email: string; name: string | null; created_at: string }>;

    // Total lessons across all courses (derived from the live catalog so it stays accurate)
    const courses = catalogCourses.map((c) => ({ id: c.id, count: c.lessons }));
    const totalLessonCount = courses.reduce((s, c) => s + c.count, 0);

    // For each salesperson, get their completed lesson count
    const team = await Promise.all(
      salespeople.map(async (sp) => {
        const progress = await db`
          SELECT course_id, COUNT(*) as completed
          FROM lesson_progress
          WHERE user_id = ${sp.id}
          GROUP BY course_id
        ` as Array<{ course_id: string; completed: number }>;

        const courseProgress = courses.map((c) => ({
          id: c.id,
          total: c.count,
          completed: progress.find((p) => p.course_id === c.id)?.completed ?? 0,
        }));

        const totalCompleted = courseProgress.reduce((s, c) => s + c.completed, 0);
        const percent = totalLessonCount > 0 ? Math.round((totalCompleted / totalLessonCount) * 100) : 0;

        // Get unread message count
        const unreadResult = await db`
          SELECT COUNT(*) as count FROM manager_messages
          WHERE to_user_id = ${sp.id} AND is_read = FALSE
        ` as Array<{ count: number }>;
        const unreadCount = unreadResult[0]?.count ?? 0;

        return {
          id: sp.id,
          email: sp.email,
          name: sp.name,
          memberSince: String(sp.created_at),
          totalCompleted,
          totalLessons: totalLessonCount,
          percent,
          courseProgress,
          unreadCount,
        };
      }),
    );

    return { success: true, team };
  },
);

/** Get detailed progress for a specific user (all lessons, marked as completed or not). */
export const getUserProgress = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; userId: number } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();

    const userResult = await db`
      SELECT id, email, name FROM users WHERE id = ${data.userId}
    ` as Array<{ id: number; email: string; name: string | null }>;
    if (userResult.length === 0) return { success: false, error: "User not found" };
    const user = userResult[0];

    // Get all completed lessons for this user
    const completedLessons = await db`
      SELECT course_id, lesson_id, completed_at FROM lesson_progress WHERE user_id = ${data.userId}
    ` as Array<{ course_id: string; lesson_id: string; completed_at: string }>;

    const completedMap = new Map(completedLessons.map((l) => [l.lesson_id, l.completed_at]));

    // Get messages for this user
    const messages = await db`
      SELECT m.id, m.message, m.is_read, m.created_at, u.name as from_name
      FROM manager_messages m
      JOIN users u ON u.id = m.from_user_id
      WHERE m.to_user_id = ${data.userId}
      ORDER BY m.created_at DESC
      LIMIT 50
    ` as Array<{ id: number; message: string; is_read: boolean; created_at: string; from_name: string | null }>;

    return {
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      completedLessons: completedLessons.map((l) => ({
        ...l,
        completed_at: String(l.completed_at),
      })),
      completedMap: Object.fromEntries(completedMap),
      messages: messages.map((m) => ({
        ...m,
        is_read: Boolean(m.is_read),
        created_at: String(m.created_at),
      })),
    };
  },
);

/** Send a message from any authenticated user to another user. */
export const sendMessage = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; toUserId: number; message: string; responseTo?: number } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const fromUserId = payload.userId as number;

    if (!data.message.trim()) return { success: false, error: "Message cannot be empty" };

    const db = sql();
    await db`
      INSERT INTO manager_messages (from_user_id, to_user_id, message, response_to)
      VALUES (${fromUserId}, ${data.toUserId}, ${data.message.trim()}, ${data.responseTo || null})
    `;

    return { success: true };
  },
);

/** Mark a message as read. */
export const markMessageRead = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; messageId: number } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    await db`UPDATE manager_messages SET is_read = TRUE WHERE id = ${data.messageId}`;
    return { success: true };
  },
);

/** Mark a lesson as completed for a user. */
export const markLessonComplete = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; userId: number; courseId: string; lessonId: string } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    await db`
      INSERT INTO lesson_progress (user_id, course_id, lesson_id)
      VALUES (${data.userId}, ${data.courseId}, ${data.lessonId})
      ON CONFLICT (user_id, lesson_id) DO NOTHING
    `;

    return { success: true };
  },
);

/** Remove a lesson completion. */
export const removeLessonComplete = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; userId: number; lessonId: string } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    await db`
      DELETE FROM lesson_progress WHERE user_id = ${data.userId} AND lesson_id = ${data.lessonId}
    `;

    return { success: true };
  },
);

/** Add a new salesperson under a manager account. */
export const addSalesperson = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; email: string; name: string; tier: string } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    
    // Check if email already exists
    const existing = await db`SELECT id FROM users WHERE email = ${data.email}`;
    if (existing.length > 0) {
      return { success: false, error: "Salesperson with this email already exists" };
    }

    // Generate password for the new salesperson
    const tempPassword = randomBytes(12).toString("hex");
    const salt = randomBytes(16).toString("hex");
    let key = tempPassword + salt;
    for (let i = 0; i < 1000; i++) {
      key = createHash("sha256").update(key).digest("hex");
    }
    const passwordHash = `${salt}:${key}`;
    const sessionToken = randomBytes(32).toString("hex");

    // Create user with role 'user' (salesperson)
    const result = await db`
      INSERT INTO users (email, name, password_hash, role, session_token)
      VALUES (${data.email}, ${data.name}, ${passwordHash}, 'user', ${sessionToken})
      RETURNING id
    `;

    const newUser = result[0] as { id: number };

    // Create subscription record with billing info
    const billingDay = new Date().getDate();
    const nextBilling = new Date();
    nextBilling.setDate(nextBilling.getDate() + 30);
    await db`
      INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual, manager_group_id)
      VALUES (${newUser.id}, ${data.tier}, ${data.tier}, 'active', ${nextBilling.toISOString()}, ${billingDay}, FALSE, ${session.userId})
    `;

    // Get manager info for invoice email
    const manager = await db`SELECT email, name FROM users WHERE id = ${session.userId}` as Array<{ email: string; name: string | null }>;
    
    // Calculate new total cost
    const tierPrices: Record<string, number> = { basic: 149, plus: 169, premium: 189 };
    const allSalespeople = await db`
      SELECT s.tier FROM users u
      JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
      WHERE u.role = 'user'
    ` as Array<{ tier: string }>;
    
    // Get manager's own subscription for base plan cost
    const managerSub = await db`
      SELECT tier FROM subscriptions WHERE user_id = ${session.userId} AND status = 'active'
    ` as Array<{ tier: string }>;
    const basePrice = managerSub[0]?.tier === "premium" ? 189 : 169;
    
    const salespersonTotal = allSalespeople.reduce((sum, sp) => sum + (tierPrices[sp.tier] || 169), 0);
    const newSalespersonCost = tierPrices[data.tier] || 169;
    const grandTotal = basePrice + salespersonTotal;

    // Send invoice email to manager
    if (manager.length > 0) {
      try {
        const { sendEmail } = await import("~/lib/email");
        await sendEmail({
          to: [manager[0].email],
          subject: "New Team Member Added — Updated Billing Summary",
          body: `Hi ${manager[0].name || "there"},\n\nA new team member has been added to your Champion Sales Training account.\n\n─── Added ───\n${data.name || data.email} (${data.tier.charAt(0).toUpperCase() + data.tier.slice(1)} Tier) — ${newSalespersonCost}/mo\n\n─── Updated Monthly Cost ───\nBase Plan: ${basePrice}/mo\nSalespeople: ${salespersonTotal}/mo (${allSalespeople.length} total)\nNew Total: ${grandTotal}/mo\n\nYour next billing date remains unchanged. You can view full details on your profile page.\n\n- Champion Sales Training Team`,
        });
      } catch {}
    }

    // Verify login credentials before sending welcome email
    // (read-only — never modifies the stored password)
    const { verifyAndEnsureLogin } = await import("~/lib/verify-login");
    const verifyResult = await verifyAndEnsureLogin(data.email, tempPassword);
    const finalPassword = verifyResult.password; // Always the tempPassword we stored

    // Send welcome email to the new salesperson with verified login credentials
    try {
      const { sendEmail } = await import("~/lib/email");
      await sendEmail({
        to: [data.email],
        subject: "Welcome to Champion Sales Training — Your Account is Ready",
        body: `Hi ${data.name || "there"},\n\nWelcome to Champion Sales Training & Events! Your ${data.tier.charAt(0).toUpperCase() + data.tier.slice(1)} account has been created by your manager.\n\n─── Your Login ───\nSite: https://www.championsalestrainingandevents.com/login\nEmail: ${data.email}\nTemporary Password: ${finalPassword}\n\nPlease log in and change your password from your profile page.\n\n─── What You Get ───\n- Complete training library\n- Interactive quizzes & assessments\n- Sales process mastery (10-step method)\n- Objection handling & closing techniques\n\nGet started now and take your sales career to the next level!\n\n- Champion Sales Training Team`,
      });
    } catch {}

    return { success: true, userId: newUser.id };
  },
);

/** Remove a salesperson (set status to inactive). */
export const removeSalesperson = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; userId: number } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    
    // Get salesperson info before removal
    const sp = await db`SELECT email, name, tier FROM users u JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active' WHERE u.id = ${data.userId}` as Array<{ email: string; name: string | null; tier: string }>;
    
    // Get the subscription's next_billing_date for the "last day of access"
    const sub = await db`SELECT next_billing_date FROM subscriptions WHERE user_id = ${data.userId} AND status = 'active'` as Array<{ next_billing_date: string | null }>;
    const lastDay = sub[0]?.next_billing_date 
      ? new Date(sub[0].next_billing_date).toLocaleDateString() 
      : "the end of the current billing period";

    await db`UPDATE users SET role = 'inactive' WHERE id = ${data.userId}`;
    await db`UPDATE subscriptions SET status = 'cancelled', cancelled_at = NOW(), ends_at = ${sub[0]?.next_billing_date ? new Date(sub[0].next_billing_date).toISOString() : null} WHERE user_id = ${data.userId} AND status = 'active'`;

    // Send cancellation email to the salesperson
    if (sp.length > 0) {
      try {
        const { sendEmail } = await import("~/lib/email");
        await sendEmail({
          to: [sp[0].email],
          subject: "Your subscription has been cancelled",
          body: `Hi ${sp[0].name || "there"},\n\nYour Champion Sales Training subscription has been cancelled by your manager.\n\nYour access will continue until ${lastDay}.\n\n- Champion Sales Training Team`,
        });
      } catch {}
    }

    // Send updated billing summary to manager
    const manager = await db`SELECT email, name FROM users WHERE id = ${session.userId}` as Array<{ email: string; name: string | null }>;
    if (manager.length > 0) {
      try {
        // Calculate new total after removal
        const tierPrices: Record<string, number> = { basic: 149, plus: 169, premium: 189 };
        const remainingSalespeople = await db`
          SELECT s.tier FROM users u
          JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
          WHERE u.role = 'user'
        ` as Array<{ tier: string }>;
        
        const managerSub = await db`
          SELECT tier FROM subscriptions WHERE user_id = ${session.userId} AND status = 'active'
        ` as Array<{ tier: string }>;
        const basePrice = managerSub[0]?.tier === "premium" ? 189 : 169;
        const salespersonTotal = remainingSalespeople.reduce((sum, sp) => sum + (tierPrices[sp.tier] || 169), 0);
        const removedCost = tierPrices[sp[0]?.tier] || 169;
        const grandTotal = basePrice + salespersonTotal;
        
        const { sendEmail } = await import("~/lib/email");
        await sendEmail({
          to: [manager[0].email],
          subject: "Team Member Removed — Updated Billing Summary",
          body: `Hi ${manager[0].name || "there"},\n\nA team member has been removed from your Champion Sales Training account.\n\n─── Removed ───\n${sp[0]?.name || sp[0]?.email || "Unknown"} (${sp[0]?.tier ? sp[0].tier.charAt(0).toUpperCase() + sp[0].tier.slice(1) : ""} Tier) — saving ${removedCost}/mo\n\n─── Updated Monthly Cost ───\nBase Plan: ${basePrice}/mo\nSalespeople: ${salespersonTotal}/mo (${remainingSalespeople.length} total)\nNew Total: ${grandTotal}/mo\n\nYour next billing date remains unchanged. The removed member's access ends on ${lastDay}.\n\n- Champion Sales Training Team`,
        });
      } catch {}
    }

    return { success: true };
  },
);

/** Change a salesperson's subscription tier. */
export const changeSalespersonTier = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; userId: number; tier: string } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    const tiers = ["basic", "plus", "premium"];
    if (!tiers.includes(data.tier)) return { success: false, error: "Invalid tier" };

    await db`UPDATE subscriptions SET tier = ${data.tier} WHERE user_id = ${data.userId} AND status = 'active'`;

    // Send tier change email to the salesperson
    const user = await db`SELECT email, name FROM users WHERE id = ${data.userId}` as Array<{ email: string; name: string | null }>;
    if (user.length > 0) {
      try {
        const { sendEmail } = await import("~/lib/email");
        await sendEmail({
          to: [user[0].email],
          subject: "Your subscription tier has been updated",
          body: `Hi ${user[0].name || "there"},\n\nYour Champion Sales Training subscription has been updated to the ${data.tier.charAt(0).toUpperCase() + data.tier.slice(1)} tier.\n\n- Champion Sales Training Team`,
        });
      } catch {}
    }

    return { success: true };
  },
);

/** Get cost breakdown for the manager's team. */
export const getTeamCost = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    const activeSalespeople = await db`
      SELECT u.id, u.email, u.name, s.tier
      FROM users u
      JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
      WHERE u.role = 'user'
    ` as Array<{ id: number; email: string; name: string | null; tier: string }>;

    const tierPrices: Record<string, number> = { basic: 149, plus: 169, premium: 189 };
    const breakdown: Record<string, { count: number; price: number; subtotal: number }> = {};
    let total = 0;

    for (const sp of activeSalespeople) {
      const price = tierPrices[sp.tier] || 169;
      if (!breakdown[sp.tier]) breakdown[sp.tier] = { count: 0, price, subtotal: 0 };
      breakdown[sp.tier].count++;
      breakdown[sp.tier].subtotal += price;
      total += price;
    }

    return { success: true, breakdown, total, count: activeSalespeople.length };
  },
);

// ── Sales Log Functions ────────────────────────────────────────────────────

/** Get sales log entries for a manager. */
export const getSalesLog = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    const entries = await db`
      SELECT sl.*, u.name as salesperson_name, u.email as salesperson_email
      FROM sales_log sl
      LEFT JOIN users u ON u.id = sl.salesperson_id
      WHERE sl.user_id = ${session.userId}
      ORDER BY sl.created_at DESC
      LIMIT 50
    ` as Array<Record<string, unknown>>;

    return {
      success: true,
      entries: entries.map((e) => ({
        ...e,
        created_at: String(e.created_at),
        amount: Number(e.amount),
      })),
    };
  },
);

/** Add a sales entry. */
export const addSalesEntry = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; salespersonId?: number; customerName: string; vehicle: string; amount: number; status: string; notes?: string } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    await db`
      INSERT INTO sales_log (user_id, salesperson_id, customer_name, vehicle, amount, status, notes)
      VALUES (${session.userId}, ${data.salespersonId || null}, ${data.customerName}, ${data.vehicle}, ${data.amount}, ${data.status}, ${data.notes || null})
    `;

    return { success: true };
  },
);

/** Delete a sales entry. */
export const deleteSalesEntry = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; entryId: number } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    await db`DELETE FROM sales_log WHERE id = ${data.entryId} AND user_id = ${session.userId}`;
    return { success: true };
  },
);

// ── Module Assignment Functions ────────────────────────────────────────────

/** Create a module assignment for a salesperson. */
export const createAssignment = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; salespersonId: number; courseId: string; lessonId?: string } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    await db`
      INSERT INTO module_assignments (manager_id, salesperson_id, course_id, lesson_id)
      VALUES (${session.userId}, ${data.salespersonId}, ${data.courseId}, ${data.lessonId || null})
    `;

    // Notify the salesperson via message
    await db`
      INSERT INTO manager_messages (from_user_id, to_user_id, message)
      VALUES (${session.userId}, ${data.salespersonId}, ${`New module assigned: ${data.courseId}${data.lessonId ? ` / ${data.lessonId}` : ""}. Please complete this training module.`})
    `;

    return { success: true };
  },
);

/** Assign a module to ALL salespeople on the team at once. */
export const assignAllSalespeople = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; courseId: string; lessonId?: string } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    // Get all salespeople under this manager
    const salespeople = await db`
      SELECT u.id FROM users u
      JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
      WHERE s.manager_group_id = ${session.userId}
    ` as Array<{ id: number }>;

    for (const sp of salespeople) {
      await db`
        INSERT INTO module_assignments (manager_id, salesperson_id, course_id, lesson_id)
        VALUES (${session.userId}, ${sp.id}, ${data.courseId}, ${data.lessonId || null})
      `;
      // Notify each salesperson
      await db`
        INSERT INTO manager_messages (from_user_id, to_user_id, message)
        VALUES (${session.userId}, ${sp.id}, ${`New module assigned to everyone: ${data.courseId}${data.lessonId ? ` / ${data.lessonId}` : ""}. Please complete this training module.`})
      `;
    }

    return { success: true, count: salespeople.length };
  },
);

/** Get all assignments for a manager. */
export const getAssignments = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    const assignments = await db`
      SELECT ma.*, u.name as salesperson_name, u.email as salesperson_email
      FROM module_assignments ma
      JOIN users u ON u.id = ma.salesperson_id
      WHERE ma.manager_id = ${session.userId}
      ORDER BY ma.assigned_at DESC
      LIMIT 50
    ` as Array<Record<string, unknown>>;

    return {
      success: true,
      assignments: assignments.map((a) => ({
        ...a,
        assigned_at: String(a.assigned_at),
        completed_at: a.completed_at ? String(a.completed_at) : null,
      })),
    };
  },
);

/** Mark an assignment as completed. */
export const completeAssignment = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; assignmentId: number } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    await db`
      UPDATE module_assignments SET completed_at = NOW()
      WHERE id = ${data.assignmentId} AND manager_id = ${session.userId}
    `;
    return { success: true };
  },
);

/** Delete an assignment. */
export const deleteAssignment = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; assignmentId: number } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    await db`DELETE FROM module_assignments WHERE id = ${data.assignmentId} AND manager_id = ${session.userId}`;
    return { success: true };
  },
);

/** Get team members linked to this manager (via manager_group_id). */
export const getTeamMembers = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };

    const db = sql();
    const members = await db`
      SELECT u.id, u.email, u.name, s.tier
      FROM users u
      JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
      WHERE s.manager_group_id = ${session.userId}
      ORDER BY u.name ASC, u.email ASC
    ` as Array<{ id: number; email: string; name: string | null; tier: string }>;

    // Get progress for each member
    const team = await Promise.all(
      members.map(async (m) => {
        const progress = await db`
          SELECT COUNT(*) as count FROM lesson_progress WHERE user_id = ${m.id}
        ` as Array<{ count: number }>;
        const totalLessons = catalogCourses.reduce((s, c) => s + c.lessons, 0); // Total lessons across all courses
        const completed = progress[0]?.count ?? 0;
        return {
          ...m,
          completedLessons: completed,
          totalLessons,
          percent: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0,
        };
      }),
    );

    return { success: true, team };
  },
);

// ── Salesperson-facing functions ──────────────────────────────────────────

/** Get assignments for the current user (salesperson). */
export const getMyAssignments = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };

    const db = sql();
    const userId = payload.userId as number;
    const assignments = await db`
      SELECT ma.*, u.name as manager_name, u.email as manager_email
      FROM module_assignments ma
      JOIN users u ON u.id = ma.manager_id
      WHERE ma.salesperson_id = ${userId}
      ORDER BY ma.assigned_at DESC
      LIMIT 50
    ` as Array<Record<string, unknown>>;

    return {
      success: true,
      assignments: assignments.map((a) => ({
        ...a,
        assigned_at: String(a.assigned_at),
        completed_at: a.completed_at ? String(a.completed_at) : null,
      })),
    };
  },
);

/** Get appointments for the current user (salesperson). */
export const getMyAppointments = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };

    const db = sql();
    const userId = payload.userId as number;
    const appointments = await db`
      SELECT a.*, u.name as manager_name, u.email as manager_email
      FROM appointments a
      JOIN users u ON u.id = a.manager_id
      WHERE a.salesperson_id = ${userId}
      ORDER BY a.appointment_time ASC
    ` as Array<Record<string, unknown>>;

    return {
      success: true,
      appointments: appointments.map((a) => ({
        ...a,
        appointment_time: String(a.appointment_time),
        created_at: a.created_at ? String(a.created_at) : null,
      })),
    };
  },
);

/** Get messages for the current user (salesperson). */
export const getMyMessages = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };

    const db = sql();
    const userId = payload.userId as number;
    const messages = await db`
      SELECT m.id, m.message, m.is_read, m.created_at, u.name as from_name, u.email as from_email
      FROM manager_messages m
      JOIN users u ON u.id = m.from_user_id
      WHERE m.to_user_id = ${userId}
      ORDER BY m.created_at DESC
      LIMIT 50
    ` as Array<{ id: number; message: string; is_read: boolean; created_at: string; from_name: string | null; from_email: string }>;

    return {
      success: true,
      messages: messages.map((m) => ({
        ...m,
        is_read: Boolean(m.is_read),
        created_at: String(m.created_at),
      })),
    };
  },
);

/** Get unread message count and pending assignment count for the current user. */
export const getMyNotificationCounts = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };

    const db = sql();
    const userId = payload.userId as number;

    const unreadResult = await db`
      SELECT COUNT(*) as count FROM manager_messages
      WHERE to_user_id = ${userId} AND is_read = FALSE
    ` as Array<{ count: number }>;

    const pendingResult = await db`
      SELECT COUNT(*) as count FROM module_assignments
      WHERE salesperson_id = ${userId} AND completed_at IS NULL
    ` as Array<{ count: number }>;

    return {
      success: true,
      unreadMessages: unreadResult[0]?.count ?? 0,
      pendingAssignments: pendingResult[0]?.count ?? 0,
    };
  },
);

export const checkDailyLimit = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; userId: number } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const db = sql();
    const today = new Date().toISOString().split("T")[0];
    const result = await db`
      SELECT COUNT(*) as count FROM lesson_progress
      WHERE user_id = ${data.userId} AND completed_at::date = ${today}::date
    ` as Array<{ count: number }>;

    const completedToday = result[0]?.count ?? 0;
    const maxDaily = 5;
    return { success: true, completedToday, maxDaily, limitReached: completedToday >= maxDaily };
  },
);

/** Get skill gap analysis for a user (find weakest courses). */
export const getSkillGaps = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; userId: number } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const db = sql();
    const progress = await db`
      SELECT course_id, COUNT(*) as completed
      FROM lesson_progress
      WHERE user_id = ${data.userId}
      GROUP BY course_id
    ` as Array<{ course_id: string; completed: number }>;

    const courses = [
      { id: "10-steps-part-1", name: "10 Steps to the Sale", total: 10 },
      { id: "10-steps-part-2", name: "10 Steps Part 2 (Quiz)", total: 10 },
      { id: "advanced-closing", name: "Advanced Closing", total: 5 },
      { id: "digital-marketing", name: "Digital Marketing", total: 4 },
      { id: "customer-experience", name: "Customer Experience", total: 4 },
      { id: "sales-drills", name: "Sales Drills", total: 10 },
      { id: "senior-sales", name: "Senior Sales Training", total: 5 },
      { id: "closing-objections", name: "Closing & Overcoming Objections", total: 5 },
      { id: "needs-assessment-2", name: "Needs Assessment Part 2", total: 5 },
      { id: "advanced-closing-part2", name: "Adv. Closing Part 2", total: 4 },
      { id: "heart-method", name: "The H.E.A.R.T. Method", total: 6 },
    ];

    const gaps = courses.map((c) => {
      const completed = progress.find((p) => p.course_id === c.id)?.completed ?? 0;
      return {
        courseId: c.id,
        courseName: c.name,
        total: c.total,
        completed,
        percent: Math.round((completed / c.total) * 100),
        weakest: completed / c.total < 0.5,
      };
    }).sort((a, b) => a.percent - b.percent);

    return { success: true, gaps };
  },
);

/** Reset ALL lesson progress for the current user (individual self-service). */
export const resetMyProgress = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const db = sql();
    const userId = payload.userId as number;
    await db`DELETE FROM lesson_progress WHERE user_id = ${userId}`;
    // Also clear any pending module assignments
    await db`UPDATE module_assignments SET completed_at = NULL WHERE salesperson_id = ${userId}`;
    return { success: true };
  },
);

/** Reset ALL lesson progress for a team member (manager only). */
export const resetUserProgress = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; userId: number } }) => {
    const session = verifyManager(data.token);
    if (!session) return { success: false, error: "Not authenticated" };
    const db = sql();
    await db`DELETE FROM lesson_progress WHERE user_id = ${data.userId}`;
    return { success: true };
  },
);