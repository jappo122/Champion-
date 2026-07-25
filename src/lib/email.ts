import { createServerFn } from "@tanstack/react-start";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = "Sales@championsalestrainingandevents.com";

export const sendEmail = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { to: string | string[]; subject: string; body: string } }) => {
    try {
      const to = Array.isArray(data.to) ? data.to : [data.to];
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to,
          subject: data.subject,
          text: data.body,
        }),
      });
      if (!response.ok) {
        const errText = await response.text();
        console.error("[Email] Resend failed:", errText);
        return { success: false, error: errText };
      }
      return { success: true };
    } catch (err) {
      console.error("[Email] Error:", err);
      return { success: false, error: String(err) };
    }
  },
);
