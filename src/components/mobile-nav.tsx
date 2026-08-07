import { useState, useEffect } from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const loggedIn = typeof window !== "undefined" && !!localStorage.getItem("salesdrive_token");

  useEffect(() => {
    (window as any).__toggleMobileNav = () => setOpen((prev) => !prev);
    return () => { delete (window as any).__toggleMobileNav; };
  }, []);

  return (
    <>
      {/* Mobile slide-out menu — inline z-index so it can never sit under the fixed header */}
      {open && (
        <div
          className="fixed inset-0 md:hidden"
          style={{ zIndex: 9999 }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            style={{ zIndex: 1 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Panel — opaque, full height, always above header */}
          <div
            className="absolute right-0 top-0 flex h-full w-72 flex-col border-l border-[#1a2d4a] bg-[#0d1f35]"
            style={{ zIndex: 2, backgroundColor: "#0d1f35" }}
          >
            {/* Close button — always tappable, never covered */}
            <div className="flex items-center justify-between px-6 pb-2 pt-20">
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Menu
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a2d4a] text-gray-300 transition-colors hover:bg-[#24395c] hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-4 overflow-y-auto px-6 pb-8">
              <a href="/" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Home</a>
              <a href="/training" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Training</a>
              <a href="/steps" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Steps of the Sale</a>
              <a href="/profile" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Profile</a>
              <a href="/blog" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Blog</a>
              <a href="/webinars" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Webinars</a>
              <a href="/contact" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Contact Us</a>
              <a href="/support" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Support</a>
              <hr className="border-[#1a2d4a]" />
              <a href="/pricing" className="rounded-lg bg-[#e63946] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#c1121f]" onClick={() => setOpen(false)}>PLANS AND PRICING</a>
              {loggedIn ? (
                <button
                  onClick={() => { localStorage.removeItem("salesdrive_token"); window.location.href = "/"; }}
                  className="text-left text-sm text-[#e63946] hover:text-[#ff6b6b]"
                >
                  Sign Out
                </button>
              ) : (
                <a href="/login" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Sign In</a>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
