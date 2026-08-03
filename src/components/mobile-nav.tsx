import { useState } from "react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const loggedIn = typeof window !== "undefined" && !!localStorage.getItem("salesdrive_token");

  return (
    <>
      {/* Hamburger button — visible on mobile only */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a2d4a] text-white md:hidden"
        aria-label="Menu"
      >
        {open ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile slide-out menu */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-[#0d1f35] border-l border-[#1a2d4a] p-6 pt-20">
            <nav className="flex flex-col gap-4">
              <a href="/" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Home</a>
              <a href="/training" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Training</a>
              <a href="/steps" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Steps of the Sale</a>
              <a href="/profile" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Profile</a>
              <a href="/blog" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Blog</a>
              <a href="/webinars" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Webinars</a>
              <a href="/contact" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Contact Us</a>
              <a href="/support" className="text-sm text-gray-400 hover:text-white" onClick={() => setOpen(false)}>Support</a>
              <hr className="border-[#1a2d4a]" />
              <a href="/pricing" className="rounded-lg bg-[#e63946] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#c1121f]" onClick={() => setOpen(false)}>See Plans &amp; Price</a>
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
