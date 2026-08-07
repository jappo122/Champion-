import { useState, useEffect } from "react";
import { useTranslation, LanguageSwitcher } from "~/i18n";

// ── Shared Site Header ─────────────────────────────────────────────────────
// One header for every page: fixed (never moves), same logo size everywhere.
export function SiteHeader() {
  const { t } = useTranslation();
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("salesdrive_token"));
    const check = () => setLoggedIn(!!localStorage.getItem("salesdrive_token"));
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);
  return (
    <header className="w-full bg-[#0a1628]">
      <div className="mx-auto flex h-40 max-w-7xl items-center justify-between px-3 md:px-6">
        {/* Logo — same size on every page, never moves */}
        <a href="/" className="block shrink-0">
          <img
            src="/fb-logo.png"
            alt="Champion Sales Training & Events"
            className="h-[140px] w-auto object-contain"
          />
        </a>

        {/* Hamburger — mobile only, always visible & same size */}
        <button
          onClick={() => (window as any).__toggleMobileNav?.()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1a2d4a] text-white md:hidden"
          aria-label="Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop nav — in flow, right-aligned */}
        <nav className="hidden items-center gap-6 md:flex">
          {loggedIn ? (
            <>
              <a href="/training" className="text-sm text-gray-400 transition-colors hover:text-white">{t('nav.training')}</a>
              <a href="/steps" className="text-sm text-gray-400 transition-colors hover:text-white">Steps of the Sale</a>
              <a href="/webinars" className="text-sm text-gray-400 transition-colors hover:text-white">Webinars</a>
              <a href="/profile" className="text-sm text-gray-400 transition-colors hover:text-white">{t('profile.title')}</a>
              <button onClick={() => { localStorage.removeItem("salesdrive_token"); window.location.href = "/"; }} className="text-sm text-gray-400 transition-colors hover:text-white">Sign Out</button>
            </>
          ) : (
            <>
              <a href="/training" className="text-sm text-gray-400 transition-colors hover:text-white">{t('nav.training')}</a>
              <a href="/steps" className="text-sm text-gray-400 transition-colors hover:text-white">Steps of the Sale</a>
              <a href="/webinars" className="text-sm text-gray-400 transition-colors hover:text-white">Webinars</a>
              <a href="/blog" className="text-sm text-gray-400 transition-colors hover:text-white">Blog</a>
              <a href="/login" className="text-sm text-gray-400 transition-colors hover:text-white">{t('nav.signIn')}</a>
            </>
          )}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
