import { useEffect, useState } from "react";
import { LanguageSwitcher } from "~/i18n";

function drawerEl(): HTMLElement | null {
  return document.getElementById("mobile-nav-drawer");
}

export function MobileNav() {
  // Drawer visibility is controlled DIRECTLY on the DOM (hidden attribute) —
  // immune to React re-render failure (this app's MobileNav can become a ghost
  // component React never re-renders, which killed both the useSyncExternalStore
  // and the useState-from-event versions). `open` is a passive mirror of the DOM,
  // used only for the {open && <LanguageSwitcher/>} conditional.
  const [open, setOpen] = useState(false);
  // Read the token in an effect, NOT during render: SSR renders the logged-out
  // nav, so the first client render must match it (reading localStorage during
  // render made logged-in pages throw React hydration error #418).
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("salesdrive_token"));
  }, []);
  const close = () => {
    const d = drawerEl();
    if (d) d.classList.remove("is-open");
    setOpen(false);
  };

  // Tell the pre-hydration inline script (in __root.tsx) that React is in
  // control now — the script stops toggling the drawer's hidden attribute.
  // Hamburger events toggle the DOM directly; setOpen only mirrors the DOM.
  useEffect(() => {
    (window as any).__mobileNavHydrated = true;
    // onToggle must NOT flip the DOM again: the hamburger buttons already flip
    // the .is-open class directly (belt-and-braces) and then dispatch this
    // event. If we flipped here too, every click would double-toggle (open then
    // instantly close) whenever the listener is live. It only syncs the React
    // mirror to the already-flipped DOM value — idempotent.
    const onToggle = () => {
      const d = drawerEl();
      if (!d) return;
      setOpen(d.classList.contains("is-open"));
    };
    const onOpen = () => {
      const d = drawerEl();
      if (!d) return;
      d.classList.add("is-open");
      setOpen(true);
    };
    const onClose = () => {
      const d = drawerEl();
      if (!d) return;
      d.classList.remove("is-open");
      setOpen(false);
    };
    window.addEventListener("mobile-nav:toggle", onToggle);
    window.addEventListener("mobile-nav:open", onOpen);
    window.addEventListener("mobile-nav:close", onClose);
    return () => {
      window.removeEventListener("mobile-nav:toggle", onToggle);
      window.removeEventListener("mobile-nav:open", onOpen);
      window.removeEventListener("mobile-nav:close", onClose);
    };
  }, []);

  return (
    <>
      {/* Mobile slide-out menu — inline z-index so it can never sit under the header.
          Visibility is 100% native/CSS-driven: closed by default via
          #mobile-nav-drawer { display:none }, opened by the document-capture
          listener toggling the .is-open class. React does NOT render the
          hidden attribute or any class/style for it (no attribute = React
          can never re-apply a stale value and undo the native toggle). */}
      <div
        id="mobile-nav-drawer"
        className="fixed inset-0 md:hidden"
        style={{ zIndex: 9999 }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        {/* Backdrop */}
        <div
          className="nav-backdrop absolute inset-0 bg-black/60"
          style={{ zIndex: 1 }}
          onClick={close}
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
              onClick={close}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a2d4a] text-gray-300 transition-colors hover:bg-[#24395c] hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-4 overflow-y-auto px-6 pb-8">
            {/* Render the language switcher only when the drawer is open — a
                permanently-mounted duplicate here caused a server/client text
                mismatch (React hydration error #418) on /login and /signup. */}
            {open && <div className="flex justify-end"><LanguageSwitcher /></div>}
            <a href="/" className="text-sm text-gray-400 hover:text-white" onClick={close}>Home</a>
            {loggedIn && (
              <>
                <a href="/training" className="text-sm text-gray-400 hover:text-white" onClick={close}>Training</a>
                <a href="/steps" className="text-sm text-gray-400 hover:text-white" onClick={close}>Road to the Sale</a>
                <a href="/profile" className="text-sm text-gray-400 hover:text-white" onClick={close}>Profile</a>
              </>
            )}
            <a href="/blog" className="text-sm text-gray-400 hover:text-white" onClick={close}>Blog</a>
            <a href="/webinars" className="text-sm text-gray-400 hover:text-white" onClick={close}>Webinars</a>
            <a href="/contact" className="text-sm text-gray-400 hover:text-white" onClick={close}>Contact Us</a>
            <a href="/support" className="text-sm text-gray-400 hover:text-white" onClick={close}>Support</a>
            <hr className="border-[#1a2d4a]" />
            <a href="/pricing" className="rounded-lg bg-[#e63946] px-4 py-2 text-center text-sm font-semibold text-white hover:bg-[#c1121f]" onClick={close}>PLANS AND PRICING</a>
            {loggedIn ? (
              <button
                onClick={() => { localStorage.removeItem("salesdrive_token"); window.location.href = "/"; }}
                className="text-left text-sm text-[#e63946] hover:text-[#ff6b6b]"
              >
                Sign Out
              </button>
            ) : (
              <a href="/login" className="text-sm text-gray-400 hover:text-white" onClick={close}>Sign In</a>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
