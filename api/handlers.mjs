// Shared API handlers — single source of truth for BOTH API layers.
// - serve.ts (cto.new):  import { apiImpl } from "./api/handlers.mjs"
// - api/ssr.mjs (www/Vercel): same import
// Each handler: async (data) => result — the wire format is POST {data: {...}},
// matching the original createServerFn call sites (they sent { data: args }).
import { createHash, randomBytes } from "node:crypto";

const getSecret = () => process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";

function verifyToken(token) {
  try {
    if (!token) return null;
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

function verifyManager(token) {
  const payload = verifyToken(token);
  if (!payload) return null;
  return { userId: payload.userId, email: payload.email };
}

// Total lessons across the live catalog (10 courses, 62 lessons).
const TOTAL_LESSONS = 62;

const TIER_INFO = {
  basic: { label: "Basic", price: 149 },
  plus: { label: "Plus", price: 169 },
  premium: { label: "Premium", price: 189 },
};
const TIER_ORDER = ["basic", "plus", "premium"];
const TIER_PRICES = { basic: 149, plus: 169, premium: 189 };

// Fail-open email send (Resend). Never blocks the caller; failures are logged.
async function sendEmail({ to, subject, body }) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error("sendEmail: RESEND_API_KEY not set");
    return;
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({ from: "Sales@championsalestrainingandevents.com", to, subject, text: body }),
    });
  } catch (err) {
    console.error("sendEmail error:", err.message);
  }
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  let key = password + salt;
  for (let i = 0; i < 1000; i++) key = createHash("sha256").update(key).digest("hex");
  return `${salt}:${key}`;
}

const db = () => {
  const { neon } = require("@neondatabase/serverless");
  return neon(process.env.DATABASE_URL);
};

export const apiImpl = {
  // ── Manager dashboard ────────────────────────────────────────────────────
  async getTeamProgress({ token }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    const salespeople = await sql`SELECT id, email, name, created_at FROM users WHERE role = 'user' ORDER BY name ASC, email ASC`;
    const team = await Promise.all(
      salespeople.map(async (sp) => {
        const progress = await sql`SELECT course_id, COUNT(*) as completed FROM lesson_progress WHERE user_id = ${sp.id} GROUP BY course_id`;
        const totalCompleted = progress.reduce((s, p) => s + Number(p.completed), 0);
        const percent = TOTAL_LESSONS > 0 ? Math.round((totalCompleted / TOTAL_LESSONS) * 100) : 0;
        const unreadResult = await sql`SELECT COUNT(*) as count FROM manager_messages WHERE to_user_id = ${sp.id} AND is_read = FALSE`;
        return {
          id: sp.id,
          email: sp.email,
          name: sp.name,
          memberSince: String(sp.created_at),
          totalCompleted,
          totalLessons: TOTAL_LESSONS,
          percent,
          courseProgress: [],
          unreadCount: unreadResult[0]?.count ?? 0,
        };
      }),
    );
    return { success: true, team };
  },

  async getUserProgress({ token, userId }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    const userResult = await sql`SELECT id, email, name FROM users WHERE id = ${userId}`;
    if (userResult.length === 0) return { success: false, error: "User not found" };
    const user = userResult[0];
    const completedLessons = await sql`SELECT course_id, lesson_id, completed_at FROM lesson_progress WHERE user_id = ${userId}`;
    const completedMap = Object.fromEntries(completedLessons.map((l) => [l.lesson_id, l.completed_at]));
    const messages = await sql`SELECT m.id, m.message, m.is_read, m.created_at, u.name as from_name FROM manager_messages m JOIN users u ON u.id = m.from_user_id WHERE m.to_user_id = ${userId} ORDER BY m.created_at DESC LIMIT 50`;
    return {
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
      completedLessons: completedLessons.map((l) => ({ ...l, completed_at: String(l.completed_at) })),
      completedMap,
      messages: messages.map((m) => ({ ...m, is_read: Boolean(m.is_read), created_at: String(m.created_at) })),
    };
  },

  async sendMessage({ token, toUserId, message, responseTo }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const fromUserId = payload.userId;
    if (!message.trim()) return { success: false, error: "Message cannot be empty" };
    const sql = db();
    await sql`INSERT INTO manager_messages (from_user_id, to_user_id, message, response_to) VALUES (${fromUserId}, ${toUserId}, ${message.trim()}, ${responseTo || null})`;
    return { success: true };
  },

  async markMessageRead({ token, messageId }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    await sql`UPDATE manager_messages SET is_read = TRUE WHERE id = ${messageId}`;
    return { success: true };
  },

  async markLessonComplete({ token, userId, courseId, lessonId }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    await sql`INSERT INTO lesson_progress (user_id, course_id, lesson_id) VALUES (${userId}, ${courseId}, ${lessonId}) ON CONFLICT (user_id, lesson_id) DO NOTHING`;
    return { success: true };
  },

  async removeLessonComplete({ token, userId, lessonId }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    await sql`DELETE FROM lesson_progress WHERE user_id = ${userId} AND lesson_id = ${lessonId}`;
    return { success: true };
  },

  async addSalesperson({ token, email, name, tier }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) return { success: false, error: "Salesperson with this email already exists" };
    const tempPassword = randomBytes(12).toString("hex");
    const passwordHash = await hashPassword(tempPassword);
    const sessionToken = randomBytes(32).toString("hex");
    const result = await sql`INSERT INTO users (email, name, password_hash, role, session_token) VALUES (${email}, ${name}, ${passwordHash}, 'user', ${sessionToken}) RETURNING id`;
    const newUser = result[0];
    const billingDay = new Date().getDate();
    const nextBilling = new Date();
    nextBilling.setDate(nextBilling.getDate() + 30);
    await sql`INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual, manager_group_id) VALUES (${newUser.id}, ${tier}, ${tier}, 'active', ${nextBilling.toISOString()}, ${billingDay}, FALSE, ${session.userId})`;
    const manager = await sql`SELECT email, name FROM users WHERE id = ${session.userId}`;
    const allSalespeople = await sql`SELECT s.tier FROM users u JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active' WHERE u.role = 'user'`;
    const managerSub = await sql`SELECT tier FROM subscriptions WHERE user_id = ${session.userId} AND status = 'active'`;
    const basePrice = managerSub[0]?.tier === "premium" ? 189 : 169;
    const salespersonTotal = allSalespeople.reduce((sum, sp) => sum + (TIER_PRICES[sp.tier] || 169), 0);
    const newSalespersonCost = TIER_PRICES[tier] || 169;
    const grandTotal = basePrice + salespersonTotal;
    if (manager.length > 0) {
      await sendEmail({
        to: [manager[0].email],
        subject: "New Team Member Added — Updated Billing Summary",
        body: `Hi ${manager[0].name || "there"},\n\nA new team member has been added to your Champion Sales Training account.\n\n─── Added ───\n${name || email} (${tier.charAt(0).toUpperCase() + tier.slice(1)} Tier) — ${newSalespersonCost}/mo\n\n─── Updated Monthly Cost ───\nBase Plan: ${basePrice}/mo\nSalespeople: ${salespersonTotal}/mo (${allSalespeople.length} total)\nNew Total: ${grandTotal}/mo\n\nYour next billing date remains unchanged. You can view full details on your profile page.\n\n- Champion Sales Training Team`,
      });
    }
    await sendEmail({
      to: [email],
      subject: "Welcome to Champion Sales Training — Your Account is Ready",
      body: `Hi ${name || "there"},\n\nWelcome to Champion Sales Training & Events! Your ${tier.charAt(0).toUpperCase() + tier.slice(1)} account has been created by your manager.\n\n─── Your Login ───\nSite: https://www.championsalestrainingandevents.com/login\nEmail: ${email}\nTemporary Password: ${tempPassword}\n\nPlease log in and change your password from your profile page.\n\n─── What You Get ───\n- Complete training library\n- Interactive quizzes & assessments\n- Sales process mastery (10-step method)\n- Objection handling & closing techniques\n\nGet started now and take your sales career to the next level!\n\n- Champion Sales Training Team`,
    });
    return { success: true, userId: newUser.id };
  },

  async removeSalesperson({ token, userId }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    const sp = await sql`SELECT email, name, tier FROM users u JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active' WHERE u.id = ${userId}`;
    const sub = await sql`SELECT next_billing_date FROM subscriptions WHERE user_id = ${userId} AND status = 'active'`;
    const lastDay = sub[0]?.next_billing_date ? new Date(sub[0].next_billing_date).toLocaleDateString() : "the end of the current billing period";
    await sql`UPDATE users SET role = 'inactive' WHERE id = ${userId}`;
    await sql`UPDATE subscriptions SET status = 'cancelled', cancelled_at = NOW(), ends_at = ${sub[0]?.next_billing_date ? new Date(sub[0].next_billing_date).toISOString() : null} WHERE user_id = ${userId} AND status = 'active'`;
    if (sp.length > 0) {
      await sendEmail({ to: [sp[0].email], subject: "Your subscription has been cancelled", body: `Hi ${sp[0].name || "there"},\n\nYour Champion Sales Training subscription has been cancelled by your manager.\n\nYour access will continue until ${lastDay}.\n\n- Champion Sales Training Team` });
    }
    const manager = await sql`SELECT email, name FROM users WHERE id = ${session.userId}`;
    if (manager.length > 0) {
      const remainingSalespeople = await sql`SELECT s.tier FROM users u JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active' WHERE u.role = 'user'`;
      const managerSub = await sql`SELECT tier FROM subscriptions WHERE user_id = ${session.userId} AND status = 'active'`;
      const basePrice = managerSub[0]?.tier === "premium" ? 189 : 169;
      const salespersonTotal = remainingSalespeople.reduce((sum, x) => sum + (TIER_PRICES[x.tier] || 169), 0);
      const removedCost = TIER_PRICES[sp[0]?.tier] || 169;
      const grandTotal = basePrice + salespersonTotal;
      await sendEmail({
        to: [manager[0].email],
        subject: "Team Member Removed — Updated Billing Summary",
        body: `Hi ${manager[0].name || "there"},\n\nA team member has been removed from your Champion Sales Training account.\n\n─── Removed ───\n${sp[0]?.name || sp[0]?.email || "Unknown"} (${sp[0]?.tier ? sp[0].tier.charAt(0).toUpperCase() + sp[0].tier.slice(1) : ""} Tier) — saving ${removedCost}/mo\n\n─── Updated Monthly Cost ───\nBase Plan: ${basePrice}/mo\nSalespeople: ${salespersonTotal}/mo (${remainingSalespeople.length} total)\nNew Total: ${grandTotal}/mo\n\nYour next billing date remains unchanged. The removed member's access ends on ${lastDay}.\n\n- Champion Sales Training Team`,
      });
    }
    return { success: true };
  },

  async changeSalespersonTier({ token, userId, tier }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    if (!TIER_ORDER.includes(tier)) return { success: false, error: "Invalid tier" };
    const sql = db();
    await sql`UPDATE subscriptions SET tier = ${tier} WHERE user_id = ${userId} AND status = 'active'`;
    const user = await sql`SELECT email, name FROM users WHERE id = ${userId}`;
    if (user.length > 0) {
      await sendEmail({ to: [user[0].email], subject: "Your subscription tier has been updated", body: `Hi ${user[0].name || "there"},\n\nYour Champion Sales Training subscription has been updated to the ${tier.charAt(0).toUpperCase() + tier.slice(1)} tier.\n\n- Champion Sales Training Team` });
    }
    return { success: true };
  },

  async getTeamCost({ token }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    const activeSalespeople = await sql`SELECT u.id, u.email, u.name, s.tier FROM users u JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active' WHERE u.role = 'user'`;
    const breakdown = {};
    let total = 0;
    for (const sp of activeSalespeople) {
      const price = TIER_PRICES[sp.tier] || 169;
      if (!breakdown[sp.tier]) breakdown[sp.tier] = { count: 0, price, subtotal: 0 };
      breakdown[sp.tier].count++;
      breakdown[sp.tier].subtotal += price;
      total += price;
    }
    return { success: true, breakdown, total, count: activeSalespeople.length };
  },

  async getSalesLog({ token }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    const entries = await sql`SELECT sl.*, u.name as salesperson_name, u.email as salesperson_email FROM sales_log sl LEFT JOIN users u ON u.id = sl.salesperson_id WHERE sl.user_id = ${session.userId} ORDER BY sl.created_at DESC LIMIT 50`;
    return { success: true, entries: entries.map((e) => ({ ...e, created_at: String(e.created_at), amount: Number(e.amount) })) };
  },

  async addSalesEntry({ token, salespersonId, customerName, vehicle, amount, status, notes }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    await sql`INSERT INTO sales_log (user_id, salesperson_id, customer_name, vehicle, amount, status, notes) VALUES (${session.userId}, ${salespersonId || null}, ${customerName}, ${vehicle}, ${amount}, ${status}, ${notes || null})`;
    return { success: true };
  },

  async deleteSalesEntry({ token, entryId }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    await sql`DELETE FROM sales_log WHERE id = ${entryId} AND user_id = ${session.userId}`;
    return { success: true };
  },

  async createAssignment({ token, salespersonId, courseId, lessonId }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    await sql`INSERT INTO module_assignments (manager_id, salesperson_id, course_id, lesson_id) VALUES (${session.userId}, ${salespersonId}, ${courseId}, ${lessonId || null})`;
    await sql`INSERT INTO manager_messages (from_user_id, to_user_id, message) VALUES (${session.userId}, ${salespersonId}, ${`New module assigned: ${courseId}${lessonId ? ` / ${lessonId}` : ""}. Please complete this training module.`})`;
    return { success: true };
  },

  async assignAllSalespeople({ token, courseId, lessonId }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    const salespeople = await sql`SELECT u.id FROM users u JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active' WHERE s.manager_group_id = ${session.userId}`;
    for (const sp of salespeople) {
      await sql`INSERT INTO module_assignments (manager_id, salesperson_id, course_id, lesson_id) VALUES (${session.userId}, ${sp.id}, ${courseId}, ${lessonId || null})`;
      await sql`INSERT INTO manager_messages (from_user_id, to_user_id, message) VALUES (${session.userId}, ${sp.id}, ${`New module assigned to everyone: ${courseId}${lessonId ? ` / ${lessonId}` : ""}. Please complete this training module.`})`;
    }
    return { success: true, count: salespeople.length };
  },

  async getAssignments({ token }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    const assignments = await sql`SELECT ma.*, u.name as salesperson_name, u.email as salesperson_email FROM module_assignments ma JOIN users u ON u.id = ma.salesperson_id WHERE ma.manager_id = ${session.userId} ORDER BY ma.assigned_at DESC LIMIT 50`;
    return { success: true, assignments: assignments.map((a) => ({ ...a, assigned_at: String(a.assigned_at), completed_at: a.completed_at ? String(a.completed_at) : null })) };
  },

  async completeAssignment({ token, assignmentId }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    await sql`UPDATE module_assignments SET completed_at = NOW() WHERE id = ${assignmentId} AND manager_id = ${session.userId}`;
    return { success: true };
  },

  async deleteAssignment({ token, assignmentId }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    await sql`DELETE FROM module_assignments WHERE id = ${assignmentId} AND manager_id = ${session.userId}`;
    return { success: true };
  },

  async getTeamMembers({ token }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    const members = await sql`SELECT u.id, u.email, u.name, s.tier FROM users u JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active' WHERE s.manager_group_id = ${session.userId} ORDER BY u.name ASC, u.email ASC`;
    const team = await Promise.all(
      members.map(async (m) => {
        const progress = await sql`SELECT COUNT(*) as count FROM lesson_progress WHERE user_id = ${m.id}`;
        const completed = progress[0]?.count ?? 0;
        return { ...m, completedLessons: completed, totalLessons: TOTAL_LESSONS, percent: TOTAL_LESSONS > 0 ? Math.round((completed / TOTAL_LESSONS) * 100) : 0 };
      }),
    );
    return { success: true, team };
  },

  // ── Salesperson-facing ───────────────────────────────────────────────────
  async getMyAssignments({ token }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const sql = db();
    const userId = payload.userId;
    const assignments = await sql`SELECT ma.*, u.name as manager_name, u.email as manager_email FROM module_assignments ma JOIN users u ON u.id = ma.manager_id WHERE ma.salesperson_id = ${userId} ORDER BY ma.assigned_at DESC LIMIT 50`;
    return { success: true, assignments: assignments.map((a) => ({ ...a, assigned_at: String(a.assigned_at), completed_at: a.completed_at ? String(a.completed_at) : null })) };
  },

  async getMyAppointments({ token }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const sql = db();
    const userId = payload.userId;
    const appointments = await sql`SELECT a.*, u.name as manager_name, u.email as manager_email FROM appointments a JOIN users u ON u.id = a.manager_id WHERE a.salesperson_id = ${userId} ORDER BY a.appointment_time ASC`;
    return { success: true, appointments: appointments.map((a) => ({ ...a, appointment_time: String(a.appointment_time), created_at: a.created_at ? String(a.created_at) : null })) };
  },

  async getMyMessages({ token }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const sql = db();
    const userId = payload.userId;
    const messages = await sql`SELECT m.id, m.message, m.is_read, m.created_at, u.name as from_name, u.email as from_email FROM manager_messages m JOIN users u ON u.id = m.from_user_id WHERE m.to_user_id = ${userId} ORDER BY m.created_at DESC LIMIT 50`;
    return { success: true, messages: messages.map((m) => ({ ...m, is_read: Boolean(m.is_read), created_at: String(m.created_at) })) };
  },

  async getMyNotificationCounts({ token }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const sql = db();
    const userId = payload.userId;
    const unreadResult = await sql`SELECT COUNT(*) as count FROM manager_messages WHERE to_user_id = ${userId} AND is_read = FALSE`;
    const pendingResult = await sql`SELECT COUNT(*) as count FROM module_assignments WHERE salesperson_id = ${userId} AND completed_at IS NULL`;
    return { success: true, unreadMessages: unreadResult[0]?.count ?? 0, pendingAssignments: pendingResult[0]?.count ?? 0 };
  },

  async checkDailyLimit({ token, userId }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const sql = db();
    const today = new Date().toISOString().split("T")[0];
    const result = await sql`SELECT COUNT(*) as count FROM lesson_progress WHERE user_id = ${userId} AND completed_at::date = ${today}::date`;
    const completedToday = result[0]?.count ?? 0;
    const maxDaily = 5;
    return { success: true, completedToday, maxDaily, limitReached: completedToday >= maxDaily };
  },

  async getSkillGaps({ token, userId }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const sql = db();
    const progress = await sql`SELECT course_id, COUNT(*) as completed FROM lesson_progress WHERE user_id = ${userId} GROUP BY course_id`;
    const courses = [
      { id: "10-steps-part-1", name: "Road to the Sale", total: 10 },
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
      return { courseId: c.id, courseName: c.name, total: c.total, completed, percent: Math.round((completed / c.total) * 100), weakest: completed / c.total < 0.5 };
    }).sort((a, b) => a.percent - b.percent);
    return { success: true, gaps };
  },

  async resetMyProgress({ token }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const sql = db();
    const userId = payload.userId;
    await sql`DELETE FROM lesson_progress WHERE user_id = ${userId}`;
    await sql`UPDATE module_assignments SET completed_at = NULL WHERE salesperson_id = ${userId}`;
    return { success: true };
  },

  async resetUserProgress({ token, userId }) {
    const session = verifyManager(token);
    if (!session) return { success: false, error: "Not authenticated" };
    const sql = db();
    await sql`DELETE FROM lesson_progress WHERE user_id = ${userId}`;
    return { success: true };
  },

  // ── Planner ──────────────────────────────────────────────────────────────
  async getAppointments({ token, userId, date }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const sql = db();
    let appointments;
    if (userId) {
      appointments = await sql`SELECT a.*, u.name as manager_name FROM appointments a JOIN users u ON u.id = a.manager_id WHERE a.salesperson_id = ${userId} ${date ? sql`AND a.appointment_time::date = ${date}::date` : sql``} ORDER BY a.appointment_time ASC`;
    } else {
      appointments = await sql`SELECT a.*, u.name as salesperson_name, u.email as salesperson_email FROM appointments a JOIN users u ON u.id = a.salesperson_id WHERE a.manager_id = ${payload.userId} ${date ? sql`AND a.appointment_time::date = ${date}::date` : sql``} ORDER BY a.appointment_time ASC`;
    }
    return { success: true, appointments };
  },

  async createAppointment({ token, salespersonId, customerName, appointmentTime, carDescription, task }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const sql = db();
    await sql`INSERT INTO appointments (manager_id, salesperson_id, customer_name, appointment_time, car_description, task) VALUES (${payload.userId}, ${salespersonId}, ${customerName}, ${appointmentTime}, ${carDescription || null}, ${task || null})`;
    const mgr = await sql`SELECT name FROM users WHERE id = ${payload.userId}`;
    const managerName = mgr[0]?.name || "Your manager";
    await sql`INSERT INTO manager_messages (from_user_id, to_user_id, message) VALUES (${payload.userId}, ${salespersonId}, ${`New appointment scheduled: ${customerName} at ${new Date(appointmentTime).toLocaleString()}${carDescription ? ` (${carDescription})` : ""}${task ? `. Task: ${task}` : ""}`})`;
    return { success: true };
  },

  async deleteAppointment({ token, appointmentId }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const sql = db();
    await sql`DELETE FROM appointments WHERE id = ${appointmentId} AND manager_id = ${payload.userId}`;
    return { success: true };
  },

  // ── Billing (individual self-service) ────────────────────────────────────
  async getUserSubscription({ token }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const sql = db();
    const userId = payload.userId;
    const subs = await sql`SELECT id, tier, status, next_billing_date, billing_day, is_individual, started_at, cancelled_at, ends_at, billing_email_sent FROM subscriptions WHERE user_id = ${userId} AND status = 'active' ORDER BY id DESC LIMIT 1`;
    if (subs.length === 0) return { success: true, subscription: null, message: "No active subscription" };
    const sub = subs[0];
    const tierInfo = TIER_INFO[sub.tier] || TIER_INFO.basic;
    const canUpgrade = TIER_ORDER.indexOf(sub.tier) < TIER_ORDER.length - 1;
    const canDowngrade = TIER_ORDER.indexOf(sub.tier) > 0;
    return {
      success: true,
      subscription: {
        id: sub.id, tier: sub.tier, tierLabel: tierInfo.label, price: tierInfo.price, status: sub.status,
        nextBillingDate: sub.next_billing_date ? String(sub.next_billing_date) : null,
        billingDay: sub.billing_day, isIndividual: sub.is_individual !== false,
        startedAt: sub.started_at ? String(sub.started_at) : null,
        cancelledAt: sub.cancelled_at ? String(sub.cancelled_at) : null,
        endsAt: sub.ends_at ? String(sub.ends_at) : null,
        billingEmailSent: sub.billing_email_sent === true,
        canUpgrade, canDowngrade,
        availableUpgrades: canUpgrade ? TIER_ORDER.slice(TIER_ORDER.indexOf(sub.tier) + 1) : [],
        availableDowngrades: canDowngrade ? TIER_ORDER.slice(0, TIER_ORDER.indexOf(sub.tier)) : [],
      },
    };
  },

  async cancelSubscription({ token }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const sql = db();
    const userId = payload.userId;
    const userResult = await sql`SELECT id, email, name, role FROM users WHERE id = ${userId}`;
    if (userResult.length === 0) return { success: false, error: "User not found" };
    const user = userResult[0];
    if (user.role === "management" || user.role === "user") {
      return { success: false, error: "Management accounts must be cancelled by the account owner" };
    }
    const subResult = await sql`SELECT id, next_billing_date FROM subscriptions WHERE user_id = ${userId} AND status = 'active' ORDER BY id DESC LIMIT 1`;
    if (subResult.length === 0) return { success: false, error: "No active subscription" };
    const sub = subResult[0];
    const lastDay = sub.next_billing_date ? new Date(sub.next_billing_date).toLocaleDateString() : "the end of the current billing period";
    await sql`UPDATE subscriptions SET status = 'cancelled', cancelled_at = NOW(), cancelled_by = ${userId}, ends_at = ${sub.next_billing_date ? new Date(sub.next_billing_date).toISOString() : null} WHERE id = ${sub.id}`;
    await sendEmail({ to: [user.email], subject: "Subscription Cancellation Confirmed", body: `Hi ${user.name || "there"},\n\nYour Champion Sales Training subscription has been cancelled.\n\nYour access will continue until ${lastDay}. No further charges will be made.\n\nThank you for being a customer.\n\n- Champion Sales Training Team` });
    return { success: true, lastDay };
  },

  async changeTier({ token, newTier }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    if (!TIER_INFO[newTier]) return { success: false, error: "Invalid tier" };
    const sql = db();
    const userId = payload.userId;
    const userResult = await sql`SELECT role FROM users WHERE id = ${userId}`;
    if (userResult.length === 0) return { success: false, error: "User not found" };
    if (userResult[0].role === "management" || userResult[0].role === "user") {
      return { success: false, error: "Contact your account manager to change tiers" };
    }
    await sql`UPDATE subscriptions SET tier = ${newTier} WHERE user_id = ${userId} AND status = 'active'`;
    const userInfo = await sql`SELECT email, name FROM users WHERE id = ${userId}`;
    if (userInfo.length > 0) {
      await sendEmail({ to: [userInfo[0].email], subject: "Subscription Tier Updated", body: `Hi ${userInfo[0].name || "there"},\n\nYour Champion Sales Training subscription has been updated to the ${TIER_INFO[newTier].label} tier ($${TIER_INFO[newTier].price}/mo). The new rate will apply on your next billing date.\n\n- Champion Sales Training Team` });
    }
    return { success: true, newTier, newPrice: TIER_INFO[newTier].price };
  },

  async checkBillingDueSoon({ token, daysAhead }) {
    const payload = verifyToken(token || "");
    if (!payload) return { success: false, error: "Not authenticated" };
    const days = daysAhead || 3;
    const sql = db();
    const now = new Date();
    const target = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const dueSubs = await sql`SELECT s.id, s.user_id, s.tier, s.next_billing_date, s.billing_day, u.email, u.name FROM subscriptions s JOIN users u ON u.id = s.user_id WHERE s.status = 'active' AND s.next_billing_date IS NOT NULL AND s.next_billing_date <= ${target.toISOString()} AND s.next_billing_date > ${now.toISOString()} AND (s.billing_email_sent IS NULL OR s.billing_email_sent = FALSE)`;
    const remindersSent = [];
    for (const sub of dueSubs) {
      try {
        const tierInfo = TIER_INFO[sub.tier] || TIER_INFO.basic;
        const billingDate = new Date(sub.next_billing_date).toLocaleDateString();
        const stripeLinks = {
          basic: "https://buy.stripe.com/00wfZh2aq7eY02S7fF8Vi0c",
          plus: "https://buy.stripe.com/fZudR95mC7eYbLAarR8Vi0d",
          premium: "https://buy.stripe.com/8x2dR96qGdDm6rggQf8Vi0e",
        };
        const paymentLink = stripeLinks[sub.tier] || stripeLinks.basic;
        await sendEmail({ to: [sub.email], subject: `Your Champion Sales Training renewal is due soon — $${tierInfo.price}`, body: `Hi ${sub.name || "there"},\n\nYour Champion Sales Training ${tierInfo.label} subscription ($${tierInfo.price}/mo) will renew on ${billingDate}.\n\nTo continue your access, please complete payment here:\n${paymentLink}\n\nIf you've already paid, please ignore this reminder.\n\n- Champion Sales Training Team` });
        await sql`UPDATE subscriptions SET billing_email_sent = TRUE WHERE id = ${sub.id}`;
        await sql`INSERT INTO billing_reminders (subscription_id, reminder_type, next_billing_date) VALUES (${sub.id}, '3day', ${sub.next_billing_date})`;
        remindersSent.push(sub.email);
      } catch (err) {
        console.error(`[Billing] Failed to send reminder to ${sub.email}:`, err);
      }
    }
    return { success: true, count: remindersSent.length, sentTo: remindersSent };
  },

  async getPaymentLink({ tier }) {
    const stripeLinks = {
      basic: "https://buy.stripe.com/00wfZh2aq7eY02S7fF8Vi0c",
      plus: "https://buy.stripe.com/fZudR95mC7eYbLAarR8Vi0d",
      premium: "https://buy.stripe.com/8x2dR96qGdDm6rggQf8Vi0e",
    };
    return { link: stripeLinks[tier] || stripeLinks.basic };
  },

  // ── Account ──────────────────────────────────────────────────────────────
  async updateProfile({ token, name, email }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const sql = db();
    const userId = payload.userId;
    if (name !== undefined) await sql`UPDATE users SET name = ${name} WHERE id = ${userId}`;
    if (email !== undefined) await sql`UPDATE users SET email = ${email} WHERE id = ${userId}`;
    const result = await sql`SELECT id, email, name, role FROM users WHERE id = ${userId}`;
    const user = result[0];
    return { success: true, user };
  },

  // ── Admin ────────────────────────────────────────────────────────────────
  async upgradeDemoAccounts({ token }) {
    const payload = verifyToken(token);
    if (!payload) return { success: false, error: "Not authenticated" };
    const sql = db();
    const demoEmails = ["owner@champion.com", "jappo122@gmail.com", "floydsandersjr@yahoo.com"];
    const results = [];
    for (const email of demoEmails) {
      const users = await sql`SELECT id FROM users WHERE email = ${email}`;
      if (users.length === 0) { results.push(`${email}: user not found`); continue; }
      const userId = users[0].id;
      const existing = await sql`SELECT id FROM subscriptions WHERE user_id = ${userId} AND status = 'active'`;
      if (existing.length > 0) {
        await sql`UPDATE subscriptions SET tier = 'premium' WHERE id = ${existing[0].id}`;
        results.push(`${email}: upgraded to premium`);
      } else {
        const billingDay = new Date().getDate();
        const nextBilling = new Date();
        nextBilling.setDate(nextBilling.getDate() + 30);
        await sql`INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual) VALUES (${userId}, 'premium', 'premium', 'active', ${nextBilling.toISOString()}, ${billingDay}, TRUE)`;
        results.push(`${email}: created premium subscription`);
      }
    }
    return { success: true, results };
  },

  // ── Inbox ────────────────────────────────────────────────────────────────
  async ensureInboxTable() {
    const sql = db();
    await sql`CREATE TABLE IF NOT EXISTS inbox_emails (id TEXT PRIMARY KEY, thread_id TEXT, direction TEXT NOT NULL DEFAULT 'inbound', from_email TEXT NOT NULL DEFAULT '', from_name TEXT NOT NULL DEFAULT '', to_emails TEXT[] NOT NULL DEFAULT '{}', subject TEXT NOT NULL DEFAULT '', preview TEXT NOT NULL DEFAULT '', body TEXT NOT NULL DEFAULT '', received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), is_read BOOLEAN NOT NULL DEFAULT false, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    await sql`CREATE INDEX IF NOT EXISTS idx_inbox_emails_received_at ON inbox_emails (received_at DESC)`;
  },

  async syncInboxEmails({ token, emails }) {
    await this.ensureInboxTable();
    const sql = db();
    if (!emails || emails.length === 0) return { success: true, synced: 0 };
    let synced = 0;
    for (const email of emails) {
      try {
        await sql`INSERT INTO inbox_emails (id, thread_id, direction, from_email, from_name, to_emails, subject, preview, body, received_at) VALUES (${email.id}, ${email.thread_id || null}, ${email.direction || 'inbound'}, ${email.from_email || ''}, ${email.from_name || ''}, ${email.to_emails || []}, ${email.subject || ''}, ${email.preview || ''}, ${email.body || ''}, ${email.received_at ? new Date(email.received_at).toISOString() : new Date().toISOString()}) ON CONFLICT (id) DO NOTHING`;
        synced++;
      } catch (err) {
        console.error("[Inbox] Failed to sync email:", email.id, err);
      }
    }
    return { success: true, synced };
  },

  async getInboxEmails({ token }) {
    await this.ensureInboxTable();
    const sql = db();
    const rows = await sql`SELECT id, thread_id, direction, from_email, from_name, to_emails, subject, preview, received_at, is_read FROM inbox_emails ORDER BY received_at DESC LIMIT 100`;
    return rows.map((r) => ({ ...r, received_at: String(r.received_at), to_emails: Array.isArray(r.to_emails) ? r.to_emails : [] }));
  },

  async getInboxEmail({ token, id }) {
    await this.ensureInboxTable();
    const sql = db();
    const rows = await sql`SELECT id, thread_id, direction, from_email, from_name, to_emails, subject, preview, body, received_at, is_read FROM inbox_emails WHERE id = ${id} LIMIT 1`;
    if (rows.length === 0) return null;
    const r = rows[0];
    return { ...r, received_at: String(r.received_at), to_emails: Array.isArray(r.to_emails) ? r.to_emails : [] };
  },

  async markInboxRead({ token, id }) {
    await this.ensureInboxTable();
    const sql = db();
    await sql`UPDATE inbox_emails SET is_read = true WHERE id = ${id}`;
    return { success: true };
  },
};
