import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { c as createServerFn } from "../server.js";
import { s as sql } from "./db-D7cnbd5l.js";
import { randomBytes, createHash } from "node:crypto";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "react";
import "@tanstack/react-router";
import "react/jsx-runtime";
import "@tanstack/react-router/ssr/server";
import "@neondatabase/serverless";
const getSecret = () => process.env.SESSION_SECRET || "salesdrive-dev-secret-change-in-prod";
function verifyToken(token) {
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
function verifyManager(token) {
  const payload = verifyToken(token);
  if (!payload) return null;
  return {
    userId: payload.userId,
    email: payload.email
  };
}
const getMyProgress_createServerFn_handler = createServerRpc({
  id: "3221f3a4204dd83bc28ed66fb5acdffa4d96a1e8f1db920b51a7367bfb38d607",
  name: "getMyProgress",
  filename: "src/lib/manager.ts"
}, (opts) => getMyProgress.__executeServer(opts));
const getMyProgress = createServerFn({
  method: "POST"
}).handler(getMyProgress_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const userId = payload.userId;
  const db = sql();
  const userResult = await db`
      SELECT id, email, name FROM users WHERE id = ${userId}
    `;
  if (userResult.length === 0) return {
    success: false,
    error: "User not found"
  };
  const user = userResult[0];
  const completedLessons = await db`
      SELECT course_id, lesson_id, completed_at FROM lesson_progress WHERE user_id = ${userId}
    `;
  const completedMap = new Map(completedLessons.map((l) => [l.lesson_id, l.completed_at]));
  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    completedLessons: completedLessons.map((l) => ({
      ...l,
      completed_at: String(l.completed_at)
    })),
    completedMap: Object.fromEntries(completedMap)
  };
});
const markMyLessonComplete_createServerFn_handler = createServerRpc({
  id: "e7770dfade8d3e86aa88e5d711d4c723eb0200691ef9a76fc8763eff3acf2fdd",
  name: "markMyLessonComplete",
  filename: "src/lib/manager.ts"
}, (opts) => markMyLessonComplete.__executeServer(opts));
const markMyLessonComplete = createServerFn({
  method: "POST"
}).handler(markMyLessonComplete_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const userId = payload.userId;
  const db = sql();
  await db`
      INSERT INTO lesson_progress (user_id, course_id, lesson_id)
      VALUES (${userId}, ${data.courseId}, ${data.lessonId})
      ON CONFLICT (user_id, lesson_id) DO NOTHING
    `;
  const assignments = await db`
      UPDATE module_assignments 
      SET completed_at = NOW() 
      WHERE salesperson_id = ${userId} 
        AND course_id = ${data.courseId}
        AND (lesson_id = ${data.lessonId} OR lesson_id IS NULL)
        AND completed_at IS NULL
      RETURNING id, manager_id, course_id, lesson_id
    `;
  for (const assignment of assignments) {
    const managers = await db`
        SELECT email FROM users WHERE id = ${assignment.manager_id}
      `;
    const managerEmail = managers[0]?.email;
    if (managerEmail) {
      const salesperson = await db`
          SELECT name, email FROM users WHERE id = ${userId}
        `;
      const spName = salesperson[0]?.name || salesperson[0]?.email || "A salesperson";
      try {
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (RESEND_API_KEY) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
              from: "Sales@championsalestrainingandevents.com",
              to: [managerEmail],
              subject: `${spName} completed a training module`,
              text: `${spName} has completed the module "${assignment.course_id}"${assignment.lesson_id ? ` / "${assignment.lesson_id}"` : ""}.

View progress: https://championsalestrainingandevents.com/manager`
            })
          });
        } else {
          console.log(`[Email] Would notify ${managerEmail}: ${spName} completed ${assignment.course_id}`);
        }
      } catch (err) {
        console.error("[Email] Failed to notify manager:", err);
      }
    }
  }
  return {
    success: true,
    assignmentsCompleted: assignments.length
  };
});
const removeMyLessonComplete_createServerFn_handler = createServerRpc({
  id: "1b8000400d6d231bada369e773f07b6195fbc9fe0ed88e049db2f73d336fe0e4",
  name: "removeMyLessonComplete",
  filename: "src/lib/manager.ts"
}, (opts) => removeMyLessonComplete.__executeServer(opts));
const removeMyLessonComplete = createServerFn({
  method: "POST"
}).handler(removeMyLessonComplete_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const userId = payload.userId;
  const db = sql();
  await db`
      DELETE FROM lesson_progress WHERE user_id = ${userId} AND lesson_id = ${data.lessonId}
    `;
  return {
    success: true
  };
});
const getTeamProgress_createServerFn_handler = createServerRpc({
  id: "6d848a6285240562fade7cea55f201f8399aa920675d23a8d2f60811fd85fb58",
  name: "getTeamProgress",
  filename: "src/lib/manager.ts"
}, (opts) => getTeamProgress.__executeServer(opts));
const getTeamProgress = createServerFn({
  method: "POST"
}).handler(getTeamProgress_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const salespeople = await db`
      SELECT id, email, name, created_at FROM users WHERE role = 'user' ORDER BY name ASC, email ASC
    `;
  const courses = [{
    id: "10-steps-part-1",
    count: 10
  }, {
    id: "10-steps-part-2",
    count: 10
  }, {
    id: "advanced-closing",
    count: 5
  }, {
    id: "digital-marketing",
    count: 4
  }, {
    id: "customer-experience",
    count: 4
  }, {
    id: "sales-drills",
    count: 10
  }, {
    id: "senior-sales",
    count: 5
  }, {
    id: "closing-objections",
    count: 5
  }, {
    id: "needs-assessment-2",
    count: 5
  }, {
    id: "advanced-closing-part2",
    count: 4
  }, {
    id: "heart-method",
    count: 6
  }];
  const totalLessonCount = courses.reduce((s, c) => s + c.count, 0);
  const team = await Promise.all(salespeople.map(async (sp) => {
    const progress = await db`
          SELECT course_id, COUNT(*) as completed
          FROM lesson_progress
          WHERE user_id = ${sp.id}
          GROUP BY course_id
        `;
    const courseProgress = courses.map((c) => ({
      id: c.id,
      total: c.count,
      completed: progress.find((p) => p.course_id === c.id)?.completed ?? 0
    }));
    const totalCompleted = courseProgress.reduce((s, c) => s + c.completed, 0);
    const percent = totalLessonCount > 0 ? Math.round(totalCompleted / totalLessonCount * 100) : 0;
    const unreadResult = await db`
          SELECT COUNT(*) as count FROM manager_messages
          WHERE to_user_id = ${sp.id} AND is_read = FALSE
        `;
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
      unreadCount
    };
  }));
  return {
    success: true,
    team
  };
});
const getUserProgress_createServerFn_handler = createServerRpc({
  id: "9c0421e3ae78540b25ad0e30e8d434622c6f1ff4b61c1617f4b1908a169e6a89",
  name: "getUserProgress",
  filename: "src/lib/manager.ts"
}, (opts) => getUserProgress.__executeServer(opts));
const getUserProgress = createServerFn({
  method: "POST"
}).handler(getUserProgress_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const userResult = await db`
      SELECT id, email, name FROM users WHERE id = ${data.userId}
    `;
  if (userResult.length === 0) return {
    success: false,
    error: "User not found"
  };
  const user = userResult[0];
  const completedLessons = await db`
      SELECT course_id, lesson_id, completed_at FROM lesson_progress WHERE user_id = ${data.userId}
    `;
  const completedMap = new Map(completedLessons.map((l) => [l.lesson_id, l.completed_at]));
  const messages = await db`
      SELECT m.id, m.message, m.is_read, m.created_at, u.name as from_name
      FROM manager_messages m
      JOIN users u ON u.id = m.from_user_id
      WHERE m.to_user_id = ${data.userId}
      ORDER BY m.created_at DESC
      LIMIT 50
    `;
  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    },
    completedLessons: completedLessons.map((l) => ({
      ...l,
      completed_at: String(l.completed_at)
    })),
    completedMap: Object.fromEntries(completedMap),
    messages: messages.map((m) => ({
      ...m,
      is_read: Boolean(m.is_read),
      created_at: String(m.created_at)
    }))
  };
});
const sendMessage_createServerFn_handler = createServerRpc({
  id: "f8f55b485c47ee0f5d017569a268e294533cd5195ce0bb2c9fe1e8133a96bb94",
  name: "sendMessage",
  filename: "src/lib/manager.ts"
}, (opts) => sendMessage.__executeServer(opts));
const sendMessage = createServerFn({
  method: "POST"
}).handler(sendMessage_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const fromUserId = payload.userId;
  if (!data.message.trim()) return {
    success: false,
    error: "Message cannot be empty"
  };
  const db = sql();
  await db`
      INSERT INTO manager_messages (from_user_id, to_user_id, message, response_to)
      VALUES (${fromUserId}, ${data.toUserId}, ${data.message.trim()}, ${data.responseTo || null})
    `;
  return {
    success: true
  };
});
const markMessageRead_createServerFn_handler = createServerRpc({
  id: "8eaef4251083319385a2e19d1be4b881bf29095f4d87934f8d1be0eba6a67ec4",
  name: "markMessageRead",
  filename: "src/lib/manager.ts"
}, (opts) => markMessageRead.__executeServer(opts));
const markMessageRead = createServerFn({
  method: "POST"
}).handler(markMessageRead_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  await db`UPDATE manager_messages SET is_read = TRUE WHERE id = ${data.messageId}`;
  return {
    success: true
  };
});
const markLessonComplete_createServerFn_handler = createServerRpc({
  id: "afa7675d84a08a924a93721ab3da1c98e107c856a23e7bebc378c17bfcdb96a6",
  name: "markLessonComplete",
  filename: "src/lib/manager.ts"
}, (opts) => markLessonComplete.__executeServer(opts));
const markLessonComplete = createServerFn({
  method: "POST"
}).handler(markLessonComplete_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  await db`
      INSERT INTO lesson_progress (user_id, course_id, lesson_id)
      VALUES (${data.userId}, ${data.courseId}, ${data.lessonId})
      ON CONFLICT (user_id, lesson_id) DO NOTHING
    `;
  return {
    success: true
  };
});
const removeLessonComplete_createServerFn_handler = createServerRpc({
  id: "ed5b3652e011937d53d01f6c5920938d1175c8c543682bdb10932d6133608ee8",
  name: "removeLessonComplete",
  filename: "src/lib/manager.ts"
}, (opts) => removeLessonComplete.__executeServer(opts));
const removeLessonComplete = createServerFn({
  method: "POST"
}).handler(removeLessonComplete_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  await db`
      DELETE FROM lesson_progress WHERE user_id = ${data.userId} AND lesson_id = ${data.lessonId}
    `;
  return {
    success: true
  };
});
const addSalesperson_createServerFn_handler = createServerRpc({
  id: "d59530cf90590aac5a47607c248df9cffcc1617e32d2390ecbe2c004add9f2d9",
  name: "addSalesperson",
  filename: "src/lib/manager.ts"
}, (opts) => addSalesperson.__executeServer(opts));
const addSalesperson = createServerFn({
  method: "POST"
}).handler(addSalesperson_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const existing = await db`SELECT id FROM users WHERE email = ${data.email}`;
  if (existing.length > 0) {
    return {
      success: false,
      error: "Salesperson with this email already exists"
    };
  }
  const tempPassword = randomBytes(12).toString("hex");
  const salt = randomBytes(16).toString("hex");
  let key = tempPassword + salt;
  for (let i = 0; i < 1e3; i++) {
    key = createHash("sha256").update(key).digest("hex");
  }
  const passwordHash = `${salt}:${key}`;
  const sessionToken = randomBytes(32).toString("hex");
  const result = await db`
      INSERT INTO users (email, name, password_hash, role, session_token)
      VALUES (${data.email}, ${data.name}, ${passwordHash}, 'user', ${sessionToken})
      RETURNING id
    `;
  const newUser = result[0];
  const billingDay = (/* @__PURE__ */ new Date()).getDate();
  const nextBilling = /* @__PURE__ */ new Date();
  nextBilling.setDate(nextBilling.getDate() + 30);
  await db`
      INSERT INTO subscriptions (user_id, plan, tier, status, next_billing_date, billing_day, is_individual, manager_group_id)
      VALUES (${newUser.id}, ${data.tier}, ${data.tier}, 'active', ${nextBilling.toISOString()}, ${billingDay}, FALSE, ${session.userId})
    `;
  const manager = await db`SELECT email, name FROM users WHERE id = ${session.userId}`;
  const tierPrices = {
    basic: 149,
    plus: 169,
    premium: 189
  };
  const allSalespeople = await db`
      SELECT s.tier FROM users u
      JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
      WHERE u.role = 'user'
    `;
  const managerSub = await db`
      SELECT tier FROM subscriptions WHERE user_id = ${session.userId} AND status = 'active'
    `;
  const basePrice = managerSub[0]?.tier === "premium" ? 189 : 169;
  const salespersonTotal = allSalespeople.reduce((sum, sp) => sum + (tierPrices[sp.tier] || 169), 0);
  const newSalespersonCost = tierPrices[data.tier] || 169;
  const grandTotal = basePrice + salespersonTotal;
  if (manager.length > 0) {
    try {
      const {
        sendEmail
      } = await import("./email-cxXaOx6X.js");
      await sendEmail({
        to: [manager[0].email],
        subject: "New Team Member Added — Updated Billing Summary",
        body: `Hi ${manager[0].name || "there"},

A new team member has been added to your Champion Sales Training account.

─── Added ───
${data.name || data.email} (${data.tier.charAt(0).toUpperCase() + data.tier.slice(1)} Tier) — ${newSalespersonCost}/mo

─── Updated Monthly Cost ───
Base Plan: ${basePrice}/mo
Salespeople: ${salespersonTotal}/mo (${allSalespeople.length} total)
New Total: ${grandTotal}/mo

Your next billing date remains unchanged. You can view full details on your profile page.

- Champion Sales Training Team`
      });
    } catch {
    }
  }
  const {
    verifyAndEnsureLogin
  } = await import("./verify-login-CC2mAV6S.js");
  const verifyResult = await verifyAndEnsureLogin(data.email, tempPassword, db);
  const finalPassword = verifyResult.password;
  try {
    const {
      sendEmail
    } = await import("./email-cxXaOx6X.js");
    await sendEmail({
      to: [data.email],
      subject: "Welcome to Champion Sales Training — Your Account is Ready",
      body: `Hi ${data.name || "there"},

Welcome to Champion Sales Training & Events! Your ${data.tier.charAt(0).toUpperCase() + data.tier.slice(1)} account has been created by your manager.

─── Your Login ───
Site: https://championsalestrainingandevents.com/login
Email: ${data.email}
Temporary Password: ${finalPassword}

Please log in and change your password from your profile page.

─── What You Get ───
- Complete training library
- Interactive quizzes & assessments
- Sales process mastery (10-step method)
- Objection handling & closing techniques

Get started now and take your sales career to the next level!

- Champion Sales Training Team`
    });
  } catch {
  }
  return {
    success: true,
    userId: newUser.id
  };
});
const removeSalesperson_createServerFn_handler = createServerRpc({
  id: "ca81aa781b4d068719ce036a5b2b0e3f88a1cdaef88e0f2bcc945f9c2fa25189",
  name: "removeSalesperson",
  filename: "src/lib/manager.ts"
}, (opts) => removeSalesperson.__executeServer(opts));
const removeSalesperson = createServerFn({
  method: "POST"
}).handler(removeSalesperson_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const sp = await db`SELECT email, name, tier FROM users u JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active' WHERE u.id = ${data.userId}`;
  const sub = await db`SELECT next_billing_date FROM subscriptions WHERE user_id = ${data.userId} AND status = 'active'`;
  const lastDay = sub[0]?.next_billing_date ? new Date(sub[0].next_billing_date).toLocaleDateString() : "the end of the current billing period";
  await db`UPDATE users SET role = 'inactive' WHERE id = ${data.userId}`;
  await db`UPDATE subscriptions SET status = 'cancelled', cancelled_at = NOW(), ends_at = ${sub[0]?.next_billing_date ? new Date(sub[0].next_billing_date).toISOString() : null} WHERE user_id = ${data.userId} AND status = 'active'`;
  if (sp.length > 0) {
    try {
      const {
        sendEmail
      } = await import("./email-cxXaOx6X.js");
      await sendEmail({
        to: [sp[0].email],
        subject: "Your subscription has been cancelled",
        body: `Hi ${sp[0].name || "there"},

Your Champion Sales Training subscription has been cancelled by your manager.

Your access will continue until ${lastDay}.

- Champion Sales Training Team`
      });
    } catch {
    }
  }
  const manager = await db`SELECT email, name FROM users WHERE id = ${session.userId}`;
  if (manager.length > 0) {
    try {
      const tierPrices = {
        basic: 149,
        plus: 169,
        premium: 189
      };
      const remainingSalespeople = await db`
          SELECT s.tier FROM users u
          JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
          WHERE u.role = 'user'
        `;
      const managerSub = await db`
          SELECT tier FROM subscriptions WHERE user_id = ${session.userId} AND status = 'active'
        `;
      const basePrice = managerSub[0]?.tier === "premium" ? 189 : 169;
      const salespersonTotal = remainingSalespeople.reduce((sum, sp2) => sum + (tierPrices[sp2.tier] || 169), 0);
      const removedCost = tierPrices[sp[0]?.tier] || 169;
      const grandTotal = basePrice + salespersonTotal;
      const {
        sendEmail
      } = await import("./email-cxXaOx6X.js");
      await sendEmail({
        to: [manager[0].email],
        subject: "Team Member Removed — Updated Billing Summary",
        body: `Hi ${manager[0].name || "there"},

A team member has been removed from your Champion Sales Training account.

─── Removed ───
${sp[0]?.name || sp[0]?.email || "Unknown"} (${sp[0]?.tier ? sp[0].tier.charAt(0).toUpperCase() + sp[0].tier.slice(1) : ""} Tier) — saving ${removedCost}/mo

─── Updated Monthly Cost ───
Base Plan: ${basePrice}/mo
Salespeople: ${salespersonTotal}/mo (${remainingSalespeople.length} total)
New Total: ${grandTotal}/mo

Your next billing date remains unchanged. The removed member's access ends on ${lastDay}.

- Champion Sales Training Team`
      });
    } catch {
    }
  }
  return {
    success: true
  };
});
const changeSalespersonTier_createServerFn_handler = createServerRpc({
  id: "03f6e12e4db29fb8b4b6afd287a6df9c6a8e7b8ae57708c1bb67f4e840ce62d2",
  name: "changeSalespersonTier",
  filename: "src/lib/manager.ts"
}, (opts) => changeSalespersonTier.__executeServer(opts));
const changeSalespersonTier = createServerFn({
  method: "POST"
}).handler(changeSalespersonTier_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const tiers = ["basic", "plus", "premium"];
  if (!tiers.includes(data.tier)) return {
    success: false,
    error: "Invalid tier"
  };
  await db`UPDATE subscriptions SET tier = ${data.tier} WHERE user_id = ${data.userId} AND status = 'active'`;
  const user = await db`SELECT email, name FROM users WHERE id = ${data.userId}`;
  if (user.length > 0) {
    try {
      const {
        sendEmail
      } = await import("./email-cxXaOx6X.js");
      await sendEmail({
        to: [user[0].email],
        subject: "Your subscription tier has been updated",
        body: `Hi ${user[0].name || "there"},

Your Champion Sales Training subscription has been updated to the ${data.tier.charAt(0).toUpperCase() + data.tier.slice(1)} tier.

- Champion Sales Training Team`
      });
    } catch {
    }
  }
  return {
    success: true
  };
});
const getTeamCost_createServerFn_handler = createServerRpc({
  id: "21e9ac0f75fcb896d05f95803ca940ccf5073f894ac5252bc30ad0b7af411b5a",
  name: "getTeamCost",
  filename: "src/lib/manager.ts"
}, (opts) => getTeamCost.__executeServer(opts));
const getTeamCost = createServerFn({
  method: "POST"
}).handler(getTeamCost_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const activeSalespeople = await db`
      SELECT u.id, u.email, u.name, s.tier
      FROM users u
      JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
      WHERE u.role = 'user'
    `;
  const tierPrices = {
    basic: 149,
    plus: 169,
    premium: 189
  };
  const breakdown = {};
  let total = 0;
  for (const sp of activeSalespeople) {
    const price = tierPrices[sp.tier] || 169;
    if (!breakdown[sp.tier]) breakdown[sp.tier] = {
      count: 0,
      price,
      subtotal: 0
    };
    breakdown[sp.tier].count++;
    breakdown[sp.tier].subtotal += price;
    total += price;
  }
  return {
    success: true,
    breakdown,
    total,
    count: activeSalespeople.length
  };
});
const getSalesLog_createServerFn_handler = createServerRpc({
  id: "38ac02dafb0d26f55b381bf8e049da13b9e64485cc34697c62bafbb8287fe567",
  name: "getSalesLog",
  filename: "src/lib/manager.ts"
}, (opts) => getSalesLog.__executeServer(opts));
const getSalesLog = createServerFn({
  method: "POST"
}).handler(getSalesLog_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const entries = await db`
      SELECT sl.*, u.name as salesperson_name, u.email as salesperson_email
      FROM sales_log sl
      LEFT JOIN users u ON u.id = sl.salesperson_id
      WHERE sl.user_id = ${session.userId}
      ORDER BY sl.created_at DESC
      LIMIT 50
    `;
  return {
    success: true,
    entries: entries.map((e) => ({
      ...e,
      created_at: String(e.created_at),
      amount: Number(e.amount)
    }))
  };
});
const addSalesEntry_createServerFn_handler = createServerRpc({
  id: "ced407a3b857bc28380a3412b5b592807e08617739a57bc5f5c601224a8ccf49",
  name: "addSalesEntry",
  filename: "src/lib/manager.ts"
}, (opts) => addSalesEntry.__executeServer(opts));
const addSalesEntry = createServerFn({
  method: "POST"
}).handler(addSalesEntry_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  await db`
      INSERT INTO sales_log (user_id, salesperson_id, customer_name, vehicle, amount, status, notes)
      VALUES (${session.userId}, ${data.salespersonId || null}, ${data.customerName}, ${data.vehicle}, ${data.amount}, ${data.status}, ${data.notes || null})
    `;
  return {
    success: true
  };
});
const deleteSalesEntry_createServerFn_handler = createServerRpc({
  id: "ec00ab5cf9967a6672888a83b23fcfb7c6de22fd5f7057498f4be212333cfc1a",
  name: "deleteSalesEntry",
  filename: "src/lib/manager.ts"
}, (opts) => deleteSalesEntry.__executeServer(opts));
const deleteSalesEntry = createServerFn({
  method: "POST"
}).handler(deleteSalesEntry_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  await db`DELETE FROM sales_log WHERE id = ${data.entryId} AND user_id = ${session.userId}`;
  return {
    success: true
  };
});
const createAssignment_createServerFn_handler = createServerRpc({
  id: "43dac81f24a83401a179dcc542fde77b11bef664a85cdd75812560e7498cfc3b",
  name: "createAssignment",
  filename: "src/lib/manager.ts"
}, (opts) => createAssignment.__executeServer(opts));
const createAssignment = createServerFn({
  method: "POST"
}).handler(createAssignment_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  await db`
      INSERT INTO module_assignments (manager_id, salesperson_id, course_id, lesson_id)
      VALUES (${session.userId}, ${data.salespersonId}, ${data.courseId}, ${data.lessonId || null})
    `;
  await db`
      INSERT INTO manager_messages (from_user_id, to_user_id, message)
      VALUES (${session.userId}, ${data.salespersonId}, ${`New module assigned: ${data.courseId}${data.lessonId ? ` / ${data.lessonId}` : ""}. Please complete this training module.`})
    `;
  return {
    success: true
  };
});
const assignAllSalespeople_createServerFn_handler = createServerRpc({
  id: "b290334c87f65aa12dfa707394f10bd647afee85ceb1e2df2c992e1f8c7f129e",
  name: "assignAllSalespeople",
  filename: "src/lib/manager.ts"
}, (opts) => assignAllSalespeople.__executeServer(opts));
const assignAllSalespeople = createServerFn({
  method: "POST"
}).handler(assignAllSalespeople_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const salespeople = await db`
      SELECT u.id FROM users u
      JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
      WHERE s.manager_group_id = ${session.userId}
    `;
  for (const sp of salespeople) {
    await db`
        INSERT INTO module_assignments (manager_id, salesperson_id, course_id, lesson_id)
        VALUES (${session.userId}, ${sp.id}, ${data.courseId}, ${data.lessonId || null})
      `;
    await db`
        INSERT INTO manager_messages (from_user_id, to_user_id, message)
        VALUES (${session.userId}, ${sp.id}, ${`New module assigned to everyone: ${data.courseId}${data.lessonId ? ` / ${data.lessonId}` : ""}. Please complete this training module.`})
      `;
  }
  return {
    success: true,
    count: salespeople.length
  };
});
const getAssignments_createServerFn_handler = createServerRpc({
  id: "9a42464ad55bb0261ecee7e16bb1920825485257bab1868c4ea6148f4a79334d",
  name: "getAssignments",
  filename: "src/lib/manager.ts"
}, (opts) => getAssignments.__executeServer(opts));
const getAssignments = createServerFn({
  method: "POST"
}).handler(getAssignments_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const assignments = await db`
      SELECT ma.*, u.name as salesperson_name, u.email as salesperson_email
      FROM module_assignments ma
      JOIN users u ON u.id = ma.salesperson_id
      WHERE ma.manager_id = ${session.userId}
      ORDER BY ma.assigned_at DESC
      LIMIT 50
    `;
  return {
    success: true,
    assignments: assignments.map((a) => ({
      ...a,
      assigned_at: String(a.assigned_at),
      completed_at: a.completed_at ? String(a.completed_at) : null
    }))
  };
});
const completeAssignment_createServerFn_handler = createServerRpc({
  id: "d0151042fbfaa43cce236a092102e6802294901453c35c6218a2aae04df4e8fc",
  name: "completeAssignment",
  filename: "src/lib/manager.ts"
}, (opts) => completeAssignment.__executeServer(opts));
const completeAssignment = createServerFn({
  method: "POST"
}).handler(completeAssignment_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  await db`
      UPDATE module_assignments SET completed_at = NOW()
      WHERE id = ${data.assignmentId} AND manager_id = ${session.userId}
    `;
  return {
    success: true
  };
});
const deleteAssignment_createServerFn_handler = createServerRpc({
  id: "593287870e8409025900fbb2929e698265032a933e96b6e4c5277c74e1fb7015",
  name: "deleteAssignment",
  filename: "src/lib/manager.ts"
}, (opts) => deleteAssignment.__executeServer(opts));
const deleteAssignment = createServerFn({
  method: "POST"
}).handler(deleteAssignment_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  await db`DELETE FROM module_assignments WHERE id = ${data.assignmentId} AND manager_id = ${session.userId}`;
  return {
    success: true
  };
});
const getTeamMembers_createServerFn_handler = createServerRpc({
  id: "27f38323f5a8f60beae3ed33af644a3d0c19a306d0c851c31b40d92751c29b34",
  name: "getTeamMembers",
  filename: "src/lib/manager.ts"
}, (opts) => getTeamMembers.__executeServer(opts));
const getTeamMembers = createServerFn({
  method: "POST"
}).handler(getTeamMembers_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const members = await db`
      SELECT u.id, u.email, u.name, s.tier
      FROM users u
      JOIN subscriptions s ON s.user_id = u.id AND s.status = 'active'
      WHERE s.manager_group_id = ${session.userId}
      ORDER BY u.name ASC, u.email ASC
    `;
  const team = await Promise.all(members.map(async (m) => {
    const progress = await db`
          SELECT COUNT(*) as count FROM lesson_progress WHERE user_id = ${m.id}
        `;
    const totalLessons = 68;
    const completed = progress[0]?.count ?? 0;
    return {
      ...m,
      completedLessons: completed,
      totalLessons,
      percent: totalLessons > 0 ? Math.round(completed / totalLessons * 100) : 0
    };
  }));
  return {
    success: true,
    team
  };
});
const getMyAssignments_createServerFn_handler = createServerRpc({
  id: "e84e6d2db2b812879be8b49ee430996ce17268a8dbfb11012fafd1bd8dfce5fb",
  name: "getMyAssignments",
  filename: "src/lib/manager.ts"
}, (opts) => getMyAssignments.__executeServer(opts));
const getMyAssignments = createServerFn({
  method: "POST"
}).handler(getMyAssignments_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const userId = payload.userId;
  const assignments = await db`
      SELECT ma.*, u.name as manager_name, u.email as manager_email
      FROM module_assignments ma
      JOIN users u ON u.id = ma.manager_id
      WHERE ma.salesperson_id = ${userId}
      ORDER BY ma.assigned_at DESC
      LIMIT 50
    `;
  return {
    success: true,
    assignments: assignments.map((a) => ({
      ...a,
      assigned_at: String(a.assigned_at),
      completed_at: a.completed_at ? String(a.completed_at) : null
    }))
  };
});
const getMyAppointments_createServerFn_handler = createServerRpc({
  id: "5d97fca2e9fb72281a49bcf5f8b7c47035cd048e39a5994130236cd819496062",
  name: "getMyAppointments",
  filename: "src/lib/manager.ts"
}, (opts) => getMyAppointments.__executeServer(opts));
const getMyAppointments = createServerFn({
  method: "POST"
}).handler(getMyAppointments_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const userId = payload.userId;
  const appointments = await db`
      SELECT a.*, u.name as manager_name, u.email as manager_email
      FROM appointments a
      JOIN users u ON u.id = a.manager_id
      WHERE a.salesperson_id = ${userId}
      ORDER BY a.appointment_time ASC
    `;
  return {
    success: true,
    appointments: appointments.map((a) => ({
      ...a,
      appointment_time: String(a.appointment_time),
      created_at: a.created_at ? String(a.created_at) : null
    }))
  };
});
const getMyMessages_createServerFn_handler = createServerRpc({
  id: "d50b22ea8bc3499776f9360fd8ff013a0f8cfb5cd8b32b53f29f25b65922145a",
  name: "getMyMessages",
  filename: "src/lib/manager.ts"
}, (opts) => getMyMessages.__executeServer(opts));
const getMyMessages = createServerFn({
  method: "POST"
}).handler(getMyMessages_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const userId = payload.userId;
  const messages = await db`
      SELECT m.id, m.message, m.is_read, m.created_at, u.name as from_name, u.email as from_email
      FROM manager_messages m
      JOIN users u ON u.id = m.from_user_id
      WHERE m.to_user_id = ${userId}
      ORDER BY m.created_at DESC
      LIMIT 50
    `;
  return {
    success: true,
    messages: messages.map((m) => ({
      ...m,
      is_read: Boolean(m.is_read),
      created_at: String(m.created_at)
    }))
  };
});
const getMyNotificationCounts_createServerFn_handler = createServerRpc({
  id: "ee4342a9f92b0ca9c8ba97cf34dca08b8423a995b366c0666e8590af349a502e",
  name: "getMyNotificationCounts",
  filename: "src/lib/manager.ts"
}, (opts) => getMyNotificationCounts.__executeServer(opts));
const getMyNotificationCounts = createServerFn({
  method: "POST"
}).handler(getMyNotificationCounts_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const userId = payload.userId;
  const unreadResult = await db`
      SELECT COUNT(*) as count FROM manager_messages
      WHERE to_user_id = ${userId} AND is_read = FALSE
    `;
  const pendingResult = await db`
      SELECT COUNT(*) as count FROM module_assignments
      WHERE salesperson_id = ${userId} AND completed_at IS NULL
    `;
  return {
    success: true,
    unreadMessages: unreadResult[0]?.count ?? 0,
    pendingAssignments: pendingResult[0]?.count ?? 0
  };
});
const checkDailyLimit_createServerFn_handler = createServerRpc({
  id: "c153c6f9d97b6ec247c501fa9cc10f2a1f7a19996ff1dfb211836fa0dd1fa6ca",
  name: "checkDailyLimit",
  filename: "src/lib/manager.ts"
}, (opts) => checkDailyLimit.__executeServer(opts));
const checkDailyLimit = createServerFn({
  method: "POST"
}).handler(checkDailyLimit_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const result = await db`
      SELECT COUNT(*) as count FROM lesson_progress
      WHERE user_id = ${data.userId} AND completed_at::date = ${today}::date
    `;
  const completedToday = result[0]?.count ?? 0;
  const maxDaily = 5;
  return {
    success: true,
    completedToday,
    maxDaily,
    limitReached: completedToday >= maxDaily
  };
});
const getSkillGaps_createServerFn_handler = createServerRpc({
  id: "7aa6c6bf3d00934822d619178e6a2688cc840cbba0debbce10014029836c6741",
  name: "getSkillGaps",
  filename: "src/lib/manager.ts"
}, (opts) => getSkillGaps.__executeServer(opts));
const getSkillGaps = createServerFn({
  method: "POST"
}).handler(getSkillGaps_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const progress = await db`
      SELECT course_id, COUNT(*) as completed
      FROM lesson_progress
      WHERE user_id = ${data.userId}
      GROUP BY course_id
    `;
  const courses = [{
    id: "10-steps-part-1",
    name: "10 Steps to the Sale",
    total: 10
  }, {
    id: "10-steps-part-2",
    name: "10 Steps Part 2 (Quiz)",
    total: 10
  }, {
    id: "advanced-closing",
    name: "Advanced Closing",
    total: 5
  }, {
    id: "digital-marketing",
    name: "Digital Marketing",
    total: 4
  }, {
    id: "customer-experience",
    name: "Customer Experience",
    total: 4
  }, {
    id: "sales-drills",
    name: "Sales Drills",
    total: 10
  }, {
    id: "senior-sales",
    name: "Senior Sales Training",
    total: 5
  }, {
    id: "closing-objections",
    name: "Closing & Overcoming Objections",
    total: 5
  }, {
    id: "needs-assessment-2",
    name: "Needs Assessment Part 2",
    total: 5
  }, {
    id: "advanced-closing-part2",
    name: "Adv. Closing Part 2",
    total: 4
  }, {
    id: "heart-method",
    name: "The H.E.A.R.T. Method",
    total: 6
  }];
  const gaps = courses.map((c) => {
    const completed = progress.find((p) => p.course_id === c.id)?.completed ?? 0;
    return {
      courseId: c.id,
      courseName: c.name,
      total: c.total,
      completed,
      percent: Math.round(completed / c.total * 100),
      weakest: completed / c.total < 0.5
    };
  }).sort((a, b) => a.percent - b.percent);
  return {
    success: true,
    gaps
  };
});
const resetMyProgress_createServerFn_handler = createServerRpc({
  id: "d71ed2c05491e732831296bfed5af0ddd2b8162ec0568bffb05ca3ea7c2bc949",
  name: "resetMyProgress",
  filename: "src/lib/manager.ts"
}, (opts) => resetMyProgress.__executeServer(opts));
const resetMyProgress = createServerFn({
  method: "POST"
}).handler(resetMyProgress_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  const userId = payload.userId;
  await db`DELETE FROM lesson_progress WHERE user_id = ${userId}`;
  await db`UPDATE module_assignments SET completed_at = NULL WHERE salesperson_id = ${userId}`;
  return {
    success: true
  };
});
const resetUserProgress_createServerFn_handler = createServerRpc({
  id: "9733d655e8700c2dae7fd3b88b155bc8d16d8d7ebfec622dd443818434419500",
  name: "resetUserProgress",
  filename: "src/lib/manager.ts"
}, (opts) => resetUserProgress.__executeServer(opts));
const resetUserProgress = createServerFn({
  method: "POST"
}).handler(resetUserProgress_createServerFn_handler, async ({
  data
}) => {
  const session = verifyManager(data.token);
  if (!session) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  await db`DELETE FROM lesson_progress WHERE user_id = ${data.userId}`;
  return {
    success: true
  };
});
export {
  addSalesEntry_createServerFn_handler,
  addSalesperson_createServerFn_handler,
  assignAllSalespeople_createServerFn_handler,
  changeSalespersonTier_createServerFn_handler,
  checkDailyLimit_createServerFn_handler,
  completeAssignment_createServerFn_handler,
  createAssignment_createServerFn_handler,
  deleteAssignment_createServerFn_handler,
  deleteSalesEntry_createServerFn_handler,
  getAssignments_createServerFn_handler,
  getMyAppointments_createServerFn_handler,
  getMyAssignments_createServerFn_handler,
  getMyMessages_createServerFn_handler,
  getMyNotificationCounts_createServerFn_handler,
  getMyProgress_createServerFn_handler,
  getSalesLog_createServerFn_handler,
  getSkillGaps_createServerFn_handler,
  getTeamCost_createServerFn_handler,
  getTeamMembers_createServerFn_handler,
  getTeamProgress_createServerFn_handler,
  getUserProgress_createServerFn_handler,
  markLessonComplete_createServerFn_handler,
  markMessageRead_createServerFn_handler,
  markMyLessonComplete_createServerFn_handler,
  removeLessonComplete_createServerFn_handler,
  removeMyLessonComplete_createServerFn_handler,
  removeSalesperson_createServerFn_handler,
  resetMyProgress_createServerFn_handler,
  resetUserProgress_createServerFn_handler,
  sendMessage_createServerFn_handler
};
