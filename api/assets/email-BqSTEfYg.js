import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { c as createServerFn } from "../server.js";
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
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Sales@championsalestrainingandevents.com";
const sendEmail_createServerFn_handler = createServerRpc({
  id: "4b25f436ce80645ccec0236688b03cba8c4693e2942328b43053eca42eb891d8",
  name: "sendEmail",
  filename: "src/lib/email.ts"
}, (opts) => sendEmail.__executeServer(opts));
const sendEmail = createServerFn({
  method: "POST"
}).handler(sendEmail_createServerFn_handler, async ({
  data
}) => {
  try {
    const to = Array.isArray(data.to) ? data.to : [data.to];
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject: data.subject,
        text: data.body
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error("[Email] Resend failed:", errText);
      return {
        success: false,
        error: errText
      };
    }
    return {
      success: true
    };
  } catch (err) {
    console.error("[Email] Error:", err);
    return {
      success: false,
      error: String(err)
    };
  }
});
export {
  sendEmail_createServerFn_handler
};
