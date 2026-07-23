import { createServerFn } from "@tanstack/react-start";
import { sql } from "~/db";
import { createHash } from "node:crypto";

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

export const getAppointments = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; userId?: number; date?: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };

    const db = sql();
    let query;
    if (data.userId) {
      // Get appointments for a specific salesperson
      query = db`
        SELECT a.*, u.name as manager_name
        FROM appointments a
        JOIN users u ON u.id = a.manager_id
        WHERE a.salesperson_id = ${data.userId}
        ${data.date ? db`AND a.appointment_time::date = ${data.date}::date` : db``}
        ORDER BY a.appointment_time ASC
      `;
    } else {
      // Get all appointments for this manager
      query = db`
        SELECT a.*, u.name as salesperson_name, u.email as salesperson_email
        FROM appointments a
        JOIN users u ON u.id = a.salesperson_id
        WHERE a.manager_id = ${payload.userId as number}
        ${data.date ? db`AND a.appointment_time::date = ${data.date}::date` : db``}
        ORDER BY a.appointment_time ASC
      `;
    }
    const appointments = await query as Array<Record<string, unknown>>;
    return { success: true, appointments };
  },
);

export const createAppointment = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; salespersonId: number; customerName: string; appointmentTime: string; carDescription?: string; task?: string } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };

    const db = sql();
    await db`
      INSERT INTO appointments (manager_id, salesperson_id, customer_name, appointment_time, car_description, task)
      VALUES (${payload.userId as number}, ${data.salespersonId}, ${data.customerName}, ${data.appointmentTime}, ${data.carDescription || null}, ${data.task || null})
    `;

    // Also send a message to the salesperson about the appointment
    const mgr = await db`SELECT name FROM users WHERE id = ${payload.userId as number}` as Array<{ name: string | null }>;
    const managerName = mgr[0]?.name || "Your manager";
    await db`
      INSERT INTO manager_messages (from_user_id, to_user_id, message)
      VALUES (${payload.userId as number}, ${data.salespersonId}, ${`New appointment scheduled: ${data.customerName} at ${new Date(data.appointmentTime).toLocaleString()}${data.carDescription ? ` (${data.carDescription})` : ""}${data.task ? `. Task: ${data.task}` : ""}`})
    `;

    return { success: true };
  },
);

export const deleteAppointment = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { token: string; appointmentId: number } }) => {
    const payload = verifyToken(data.token);
    if (!payload) return { success: false, error: "Not authenticated" };

    const db = sql();
    await db`DELETE FROM appointments WHERE id = ${data.appointmentId} AND manager_id = ${payload.userId as number}`;
    return { success: true };
  },
);