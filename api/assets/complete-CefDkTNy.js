import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { c as createSsrRpc } from "./createSsrRpc-l1y8KE69.js";
import { c as createServerFn } from "../server.js";
import { useState, useEffect } from "react";
import "node:async_hooks";
import "h3-v2";
import "@tanstack/router-core";
import "seroval";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core/ssr/server";
import "@tanstack/react-router";
import "@tanstack/react-router/ssr/server";
const completeSignupAfterPayment = createServerFn({
  method: "POST"
}).handler(createSsrRpc("1e00ff5f02fb617bd6edcdd81b75dcefdab45e38e1aec047d5e513514e6c3886"));
function SignupCompletePage() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("/training");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const tier = params.get("tier");
    const email = params.get("email");
    const name = params.get("name");
    const type = params.get("type") || "individual";
    if (payment !== "success" || !tier || !email) {
      setStatus("error");
      setMessage("Invalid or incomplete payment return URL. Please try signing up again.");
      return;
    }
    completeSignupAfterPayment({
      data: {
        email,
        name: name || void 0,
        tier,
        type
      }
    }).then((res) => {
      if (res.success && res.token) {
        localStorage.setItem("salesdrive_token", res.token);
        setRedirectPath(res.user?.role === "management" ? "/manager" : "/training");
        setStatus("success");
      } else {
        setStatus("error");
        setMessage("Something went wrong creating your account. Please contact support.");
      }
    }).catch(() => {
      setStatus("error");
      setMessage("Something went wrong. Please contact support.");
    });
  }, []);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[#0a1628] px-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md text-center", children: [
    status === "loading" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[#e63946] border-t-transparent" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 text-2xl font-bold text-white", children: "Setting Up Your Account" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-400", children: "We're creating your account. This will just take a moment..." })
    ] }),
    status === "success" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 text-3xl font-bold text-white", children: "You're All Set!" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-400", children: "Your account has been created and your subscription is active." }),
      /* @__PURE__ */ jsx("a", { href: redirectPath, className: "mt-8 inline-block rounded-lg bg-[#e63946] px-8 py-3 text-sm font-semibold text-white hover:bg-[#c1121f] transition shadow-lg shadow-[#e63946]/20", children: "Go to Your Dashboard →" })
    ] }),
    status === "error" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e63946]/20", children: /* @__PURE__ */ jsx("svg", { className: "h-8 w-8 text-[#e63946]", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }),
      /* @__PURE__ */ jsx("h1", { className: "mt-6 text-2xl font-bold text-white", children: "Something Went Wrong" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-400", children: message }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 flex gap-4 justify-center", children: [
        /* @__PURE__ */ jsx("a", { href: "/signup", className: "text-sm text-[#e63946] hover:underline", children: "Try Again" }),
        /* @__PURE__ */ jsx("a", { href: "/support", className: "text-sm text-gray-400 hover:text-white", children: "Contact Support" })
      ] })
    ] })
  ] }) });
}
export {
  SignupCompletePage as component
};
