import { createServerFn } from "@tanstack/react-start";
import { sql } from "~/db";

export const submitTicket = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { name: string; email: string; subject: string; message: string } }) => {
    const db = sql();
    try {
      await db`
        INSERT INTO support_tickets (name, email, subject, message)
        VALUES (${data.name}, ${data.email}, ${data.subject}, ${data.message})
      `;
      return { success: true };
    } catch (err) {
      console.error("[Support] Error submitting ticket:", err);
      return { success: false };
    }
  },
);

export const logError = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { message: string; stack?: string; url?: string; userId?: number } }) => {
    const db = sql();
    try {
      await db`
        INSERT INTO error_logs (message, stack, url, user_id)
        VALUES (${data.message}, ${data.stack || null}, ${data.url || null}, ${data.userId || null})
      `;
    } catch (err) {
      console.error("[ErrorLog] Failed to log error:", err);
    }
    return { success: true };
  },
);