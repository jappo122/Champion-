import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useLocation,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { I18nProvider, LanguageSwitcher } from "~/i18n/index";
import { MobileNav } from "~/components/mobile-nav";
import { logError } from "~/lib/support";
import { getBlogPost } from "~/content/blog";
import { Component, useEffect } from "react";

// Native hamburger handler fallback — registered from the client bundle when the
// SSR inline script isn't present (the cto.new live shell omits inline scripts).
// The inline script sets window.__mobileNavNative, so this only registers once,
// and never double-toggles on full SSR renders.
if (typeof window !== "undefined" && !(window as any).__mobileNavNative) {
  document.addEventListener(
    "click",
    (e: Event) => {
      const target = e.target as Element | null;
      const btn = target && target.closest ? target.closest('button[aria-label="Menu"]') : null;
      if (!btn) return;
      const d = document.getElementById("mobile-nav-drawer");
      if (!d) return;
      d.hidden = !d.hidden;
      try {
        window.dispatchEvent(new CustomEvent("mobile-nav:toggle"));
      } catch (_) {}
    },
    true,
  );
}

// ── Error Boundary ──────────────────────────────────────────────────────────
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    logError({
      data: {
        message: error.message,
        stack: error.stack || "",
        url: typeof window !== "undefined" ? window.location.href : "",
      },
    }).catch(() => {});
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-[#0a1628] px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e63946]/20">
            <svg className="h-8 w-8 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-white">Something went wrong</h1>
          <p className="mt-2 max-w-md text-gray-400">
            We've been notified. Please try refreshing the page or contact support if the issue persists.
          </p>
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-sm"
            >
              Refresh Page
            </button>
            <a href="/support" className="btn-secondary text-sm">
              Contact Support
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: (ctx) => {
    const path = ctx.matches[ctx.matches.length - 1].pathname;
    // Per-page <title> (SEO): every page gets a unique, descriptive title instead
    // of one identical title across the whole site (was "Duplicate titles" across
    // all 52 blog posts + every public page).
    const SITE = "Champion Sales Training & Events";
    let pageTitle = `${SITE} — Sales Training for Auto Dealers`;
    const blogSlug = path.match(/^\/blog\/([^/]+)\/?$/)?.[1];
    if (blogSlug) {
      const post = getBlogPost(decodeURIComponent(blogSlug));
      pageTitle = post
        ? `${post.title} — ${SITE}`
        : `Blog — ${SITE}`;
    } else if (path === "/blog") pageTitle = `Sales Training Blog — ${SITE}`;
    else if (path === "/pricing") pageTitle = `Pricing & Plans — ${SITE}`;
    else if (path === "/webinars") pageTitle = `Live Webinars — ${SITE}`;
    else if (path === "/support") pageTitle = `Support — ${SITE}`;
    else if (path === "/contact") pageTitle = `Contact — ${SITE}`;
    else if (path === "/login") pageTitle = `Sign In — ${SITE}`;
    else if (path === "/signup") pageTitle = `Create Account — ${SITE}`;
    else if (path === "/steps") pageTitle = `Road to the Sale — ${SITE}`;
    else if (path === "/training/preview") pageTitle = `Try a Sample Quiz — ${SITE}`;
    else if (path === "/training") pageTitle = `Training Courses — ${SITE}`;
    else if (path === "/planner") pageTitle = `Daily Planner — ${SITE}`;
    else if (path === "/profile") pageTitle = `Profile — ${SITE}`;
    else if (path === "/manager") pageTitle = `Manager Dashboard — ${SITE}`;
    else if (path === "/sales-log") pageTitle = `Sales Log — ${SITE}`;
    // Auth-gated / transactional pages that are publicly linked (buy buttons,
    // Road → course links) must stay crawlable so Google sees the noindex tag
    // instead of reporting them as "Blocked by robots.txt". /training/preview
    // is the public sample and stays indexable.
    const noindex =
      path === "/training" ||
      (path.startsWith("/training/") && path !== "/training/preview") ||
      path === "/steps" ||
      path.startsWith("/checkout");
    return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: pageTitle },
      ...(noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
      {
        name: "description",
        content:
          "Sales training that actually closes deals. A complete sales process training platform for automotive salespeople with text-based lessons, assessments, and manager coaching.",
      },
      { name: "og:title", content: pageTitle },
      {
        name: "og:description",
        content:
          "Master the sales process. Close more deals. All in one platform.",
      },
      { name: "og:type", content: "website" },
      { name: "trustpilot-one-time-verification-id", content: "62945537-9b3b-4a29-b0af-543f0c520c06" },
      { name: "trustpilot-one-time-domain-verification-id", content: "f0d6dc8c-dbdd-4479-a7c2-d4fd284fe839" },
      // Security headers
      { httpEquiv: "Content-Security-Policy", content: "default-src 'self'; script-src 'self' 'unsafe-inline' https://buy.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com; frame-src https://buy.stripe.com https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self';" },
      { httpEquiv: "X-Content-Type-Options", content: "nosniff" },
      { httpEquiv: "X-Frame-Options", content: "DENY" },
      { httpEquiv: "Referrer-Policy", content: "strict-origin-when-cross-origin" },
      { httpEquiv: "Permissions-Policy", content: "camera=(), microphone=(), geolocation=()" },
    ],
    links: [
      {
        rel: "canonical",
        href: `https://www.championsalestrainingandevents.com${
          path === "/" ? "/" : path.replace(/\/+$/, "")
        }`,
      },
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        href: "/favicon.ico",
        sizes: "32x32",
      },
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon.png",
        sizes: "32x32",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180",
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        // ALWAYS-ON native hamburger handler. Document-level capture listener
        // that flips the drawer's hidden attribute directly, then dispatches
        // mobile-nav:toggle so MobileNav's mirror listener (setOpen(!d.hidden),
        // idempotent) keeps React state in sync. Deliberately has NO
        // __mobileNavHydrated bail and the hamburger buttons have NO React
        // onClick: React's event pipeline intermittently dies on some page
        // loads (proven live), so this native listener is the SINGLE click
        // handler and there is no path where a tap fails or double-toggles.
        // window.__mobileNavNative tells the client-bundle fallback (module
        // scope below) that this inline handler is already active, so the
        // bundle never registers a duplicate listener on full SSR renders.
        children:
          '(function(){window.__mobileNavNative=true;document.addEventListener("click",function(e){var b=e.target&&e.target.closest?e.target.closest("button[aria-label=Menu]"):null;if(!b)return;var d=document.getElementById("mobile-nav-drawer");if(!d)return;d.hidden=!d.hidden;try{window.dispatchEvent(new CustomEvent("mobile-nav:toggle"))}catch(_){}},true);})();',
      },
    ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-dvh items-center justify-center bg-[#0a1628]">
      <p className="text-xl text-gray-400">Page not found</p>
    </div>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <ScrollManager />
      <div id="app-scroll">
        <Outlet />
      </div>
    </RootDocument>
  );
}
// ── Scroll Manager ─────────────────────────────────────────────────────────
// The document never scrolls (html/body overflow hidden) — #app-scroll is the
// only scrollable region, so the fixed header can never move. This component
// keeps navigation, hash anchors (#features, #pricing) and scroll-to-top
// working against that container instead of the window.
function scrollAppToTop() {
  const el = document.getElementById("app-scroll");
  if (el) el.scrollTop = 0;
}
function scrollToHash(hash: string) {
  const id = (hash || "").replace(/^#/, "");
  const el = document.getElementById("app-scroll");
  if (!el) return;
  if (!id) {
    el.scrollTop = 0;
    return;
  }
  // Wait a frame so the routed page has rendered its sections
  requestAnimationFrame(() => {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    else el.scrollTop = 0;
  });
}
function ScrollManager() {
  const location = useLocation();
  // Route changes: jump to top, or to the section named in the hash
  useEffect(() => {
    if (location.hash) scrollToHash(location.hash);
    else scrollAppToTop();
  }, [location.pathname, location.hash]);
  // Same-page hash links (<a href="#features">): the browser cannot scroll
  // the window (overflow hidden), so scroll the app container instead.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const id = href.replace(/^#/, "");
      if (!id) return;
      e.preventDefault();
      scrollToHash(id);
      history.replaceState(null, "", "#" + id);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <style>{`
          /* Auth-aware footer: CSS handles visibility, immune to React hydration */
          body:not(.is-logged-in) .auth-logged-out { display: inline; }
          body:not(.is-logged-in) .auth-logged-in { display: none; }
          body.is-logged-in .auth-logged-out { display: none; }
          body.is-logged-in .auth-logged-in { display: inline; }
        `}</style>
      </head>
      <body>
        <I18nProvider>
          <ErrorBoundary>
            {children}
            {/* Mobile hamburger menu */}
            <MobileNav />
            {/* Facebook link — visible on all pages */}
            <a
              href="https://www.facebook.com/Championsalesevents"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
              className="fixed bottom-6 left-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#e63946] text-white shadow-lg shadow-[#e63946]/20 transition-all duration-200 hover:bg-[#c1121f] hover:shadow-[#e63946]/40 hover:scale-110"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </ErrorBoundary>
        </I18nProvider>
        <Scripts />
        {/* Canonical updater — syncs link[rel=canonical] href to current page URL */}
        <script>{`
          (function(){
            function updateCanonical() {
              var link = document.querySelector('link[rel="canonical"]');
              if (link) link.href = window.location.origin + window.location.pathname;
            }
            updateCanonical();
            // Update on client-side navigation (pushState/replaceState)
            var origPush = history.pushState;
            history.pushState = function(){ origPush.apply(this, arguments); updateCanonical(); };
            var origReplace = history.replaceState;
            history.replaceState = function(){ origReplace.apply(this, arguments); updateCanonical(); };
            window.addEventListener('popstate', updateCanonical);
          })();
        `}</script>
        {/* Auth detection — runs AFTER React hydration, uses CSS so React can't undo it */}
        <script>{`
          (function(){
            // Always sync body class with token state — add if logged in, remove if not
            if (localStorage.getItem("salesdrive_token")) {
              document.body.classList.add("is-logged-in");
            } else {
              document.body.classList.remove("is-logged-in");
            }
            // Re-check on storage change (multi-tab)
            window.addEventListener("storage", function(){
              if (localStorage.getItem("salesdrive_token")) {
                document.body.classList.add("is-logged-in");
              } else {
                document.body.classList.remove("is-logged-in");
              }
            });
          })();
        `}</script>
      </body>
    </html>
  );
}