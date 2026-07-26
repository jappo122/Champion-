import { c as createSsrRpc } from "./createSsrRpc-l1y8KE69.js";
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
const sendEmail = createServerFn({
  method: "POST"
}).handler(createSsrRpc("4b25f436ce80645ccec0236688b03cba8c4693e2942328b43053eca42eb891d8"));
export {
  sendEmail
};
