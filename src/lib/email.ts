import { createServerFn } from "@tanstack/react-start";

const FROM_EMAIL = "champion-sales-training-events-f80d0630@ctomail.io";

export const sendEmail = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { to: string[]; subject: string; body: string } }) => {
    try {
      // Use the team's inbox to send emails
      const response = await fetch("https://api.ctomail.io/v1/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.CTOMAIL_API_KEY || ""}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: data.to,
          subject: data.subject,
          text: data.body,
        }),
      });
      if (!response.ok) {
        console.error("[Email] Failed to send:", await response.text());
        return { success: false };
      }
      return { success: true };
    } catch (err) {
      console.error("[Email] Error:", err);
      return { success: false };
    }
  },
);