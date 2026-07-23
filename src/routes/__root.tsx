import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { I18nProvider, LanguageSwitcher } from "~/i18n/index";
import { MobileNav } from "~/components/mobile-nav";
import { logError } from "~/lib/support";
import { Component } from "react";
import { SpeedInsights } from "@vercel/speed-insights/react";

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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Champion Sales Training & Events — Sales Training for Auto Dealers" },
      {
        name: "description",
        content:
          "Sales training that actually closes deals. A complete sales process training platform for automotive salespeople with text-based lessons, assessments, and manager coaching.",
      },
      { name: "og:title", content: "Champion Sales Training & Events — Sales Training" },
      {
        name: "og:description",
        content:
          "Master the sales process. Close more deals. All in one platform.",
      },
      { name: "og:type", content: "website" },
      { name: "trustpilot-one-time-verification-id", content: "62945537-9b3b-4a29-b0af-543f0c520c06" },
      { name: "trustpilot-one-time-domain-verification-id", content: "f0d6dc8c-dbdd-4479-a7c2-d4fd284fe839" },
      // Security headers
      { "http-equiv": "Content-Security-Policy", content: "default-src 'self'; script-src 'self' 'unsafe-inline' https://buy.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com; frame-src https://buy.stripe.com https://js.stripe.com; object-src 'none'; base-uri 'self'; form-action 'self';" },
      { "http-equiv": "X-Content-Type-Options", content: "nosniff" },
      { "http-equiv": "X-Frame-Options", content: "DENY" },
      { "http-equiv": "Referrer-Policy", content: "strict-origin-when-cross-origin" },
      { "http-equiv": "Permissions-Policy", content: "camera=(), microphone=(), geolocation=()" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
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
  }),
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
      <Outlet />
    </RootDocument>
  );
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
            {/* Global language switcher — fixed top-right, below nav */}
            <div className="fixed right-4 top-20 z-40">
              <LanguageSwitcher />
            </div>
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
            {/* Footer links — both states rendered, CSS shows correct one */}
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
              <a href="/contact" className="text-sm text-gray-400 transition-colors hover:text-white">
                Contact Us
              </a>
              <span className="text-gray-600">|</span>
              <a href="/blog" className="text-sm text-gray-400 transition-colors hover:text-white">
                Blog
              </a>
              <span className="text-gray-600">|</span>
              {/* Show when logged out */}
              <a href="/login" className="auth-logged-out text-sm font-medium text-[#e63946] transition-colors hover:text-[#ff6b6b]">
                Sign In
              </a>
              {/* Show when logged in */}
              <a
                href="#"
                className="auth-logged-in text-sm font-medium text-[#e63946] transition-colors hover:text-[#ff6b6b]"
                onClick={(e) => {
                  e.preventDefault();
                  localStorage.removeItem("salesdrive_token");
                  document.body.classList.remove("is-logged-in");
                  window.location.href = "/";
                }}
              >
                Sign Out
              </a>
            </div>
          </ErrorBoundary>
        </I18nProvider>
        <Scripts />
        <SpeedInsights />
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