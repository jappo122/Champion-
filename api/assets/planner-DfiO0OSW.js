import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { c as createServerFn } from "../server.js";
import { s as sql } from "./db-D7cnbd5l.js";
import { createHash } from "node:crypto";
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
const getAppointments_createServerFn_handler = createServerRpc({
  id: "dd6d5646c2bba3013dd52cc0639dc053cdc52d1b3d1f9675e96d105cc280b650",
  name: "getAppointments",
  filename: "src/lib/planner.ts"
}, (opts) => getAppointments.__executeServer(opts));
const getAppointments = createServerFn({
  method: "POST"
}).handler(getAppointments_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  let query;
  if (data.userId) {
    query = db`
        SELECT a.*, u.name as manager_name
        FROM appointments a
        JOIN users u ON u.id = a.manager_id
        WHERE a.salesperson_id = ${data.userId}
        ${data.date ? db`AND a.appointment_time::date = ${data.date}::date` : db``}
        ORDER BY a.appointment_time ASC
      `;
  } else {
    query = db`
        SELECT a.*, u.name as salesperson_name, u.email as salesperson_email
        FROM appointments a
        JOIN users u ON u.id = a.salesperson_id
        WHERE a.manager_id = ${payload.userId}
        ${data.date ? db`AND a.appointment_time::date = ${data.date}::date` : db``}
        ORDER BY a.appointment_time ASC
      `;
  }
  const appointments = await query;
  return {
    success: true,
    appointments
  };
});
const createAppointment_createServerFn_handler = createServerRpc({
  id: "1a92e942e42dbac7c8b685d2ce8da8c0d4d440199c7fa0a94b9cb929bc4aef19",
  name: "createAppointment",
  filename: "src/lib/planner.ts"
}, (opts) => createAppointment.__executeServer(opts));
const createAppointment = createServerFn({
  method: "POST"
}).handler(createAppointment_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  await db`
      INSERT INTO appointments (manager_id, salesperson_id, customer_name, appointment_time, car_description, task)
      VALUES (${payload.userId}, ${data.salespersonId}, ${data.customerName}, ${data.appointmentTime}, ${data.carDescription || null}, ${data.task || null})
    `;
  const mgr = await db`SELECT name FROM users WHERE id = ${payload.userId}`;
  mgr[0]?.name || "Your manager";
  await db`
      INSERT INTO manager_messages (from_user_id, to_user_id, message)
      VALUES (${payload.userId}, ${data.salespersonId}, ${`New appointment scheduled: ${data.customerName} at ${new Date(data.appointmentTime).toLocaleString()}${data.carDescription ? ` (${data.carDescription})` : ""}${data.task ? `. Task: ${data.task}` : ""}`})
    `;
  return {
    success: true
  };
});
const deleteAppointment_createServerFn_handler = createServerRpc({
  id: "66fffc30499861b55ad6476c19d18e4fbf7aeeb82929401d0f7bf686fd1c76b8",
  name: "deleteAppointment",
  filename: "src/lib/planner.ts"
}, (opts) => deleteAppointment.__executeServer(opts));
const deleteAppointment = createServerFn({
  method: "POST"
}).handler(deleteAppointment_createServerFn_handler, async ({
  data
}) => {
  const payload = verifyToken(data.token);
  if (!payload) return {
    success: false,
    error: "Not authenticated"
  };
  const db = sql();
  await db`DELETE FROM appointments WHERE id = ${data.appointmentId} AND manager_id = ${payload.userId}`;
  return {
    success: true
  };
});
export {
  createAppointment_createServerFn_handler,
  deleteAppointment_createServerFn_handler,
  getAppointments_createServerFn_handler
};
