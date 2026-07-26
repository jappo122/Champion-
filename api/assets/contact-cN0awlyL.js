import { c as createServerRpc } from "./createServerRpc-D_-6bKnO.js";
import { c as createServerFn } from "../server.js";
import { sendEmail } from "./email-cxXaOx6X.js";
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
import "./createSsrRpc-l1y8KE69.js";
const submitContactForm_createServerFn_handler = createServerRpc({
  id: "c3804d43ea11a75535ebb5ae9e76d1efb9734c08a9487988e3b78f015fb81075",
  name: "submitContactForm",
  filename: "src/routes/contact.tsx"
}, (opts) => submitContactForm.__executeServer(opts));
const submitContactForm = createServerFn({
  method: "POST"
}).handler(submitContactForm_createServerFn_handler, async ({
  data
}) => {
  try {
    const body = `New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Call Back Requested: ${data.wantsCallback ? "YES — Call this person back" : "No"}
Subject: ${data.subject}

Description/Question/Concern:
${data.description}
`;
    await sendEmail({
      data: {
        to: ["cstrainingpros@yahoo.com"],
        subject: `Contact Form: ${data.subject}`,
        body
      }
    });
    await sendEmail({
      data: {
        to: [data.email],
        subject: "We received your message — Champion Sales Training & Events",
        body: `Hi ${data.name},

Thank you for contacting Champion Sales Training & Events. We've received your message and will respond within 48 hours.

Subject: ${data.subject}

${data.wantsCallback ? "You've requested a call back, so a sales representative will reach out to you at ${data.phone}.\n\n" : ""}If you need immediate assistance, you can also reach our sales department at cstrainingpros@yahoo.com.

- Champion Sales Training & Events Team`
      }
    });
    return {
      success: true
    };
  } catch (err) {
    console.error("[Contact] Error submitting form:", err);
    return {
      success: false
    };
  }
});
export {
  submitContactForm_createServerFn_handler
};
