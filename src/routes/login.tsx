import { LanguageSwitcher } from '../i18n';
import { useTranslation } from '../i18n';
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from 'react';

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json() as any;
      if (result.success && result.token) {
        localStorage.setItem("salesdrive_token", result.token);
        window.location.href = "/profile";
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <header className="sticky top-0 z-50 border-b border-[#1a2d4a]/50 bg-[#0a1628]/90">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/" className={`flex items-center gap-2 transition-all duration-300 ${scrolled ? "-translate-y-2 opacity-0 pointer-events-none" : "translate-y-0 opacity-100"}`}>
            <img src="/fb-logo.png" alt="Champion Sales Training & Events" className="h-10 w-auto" />
          </a>
          <nav className="flex items-center gap-6">
            <a href="/training" className="text-sm text-gray-400 hover:text-white">{t('nav.training')}</a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <a href="/" className="inline-flex items-center gap-2">
              <img src="/fb-logo.png" alt="Champion Sales Training & Events" className="h-10 w-auto" />
            </a>
          </div>
        <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8">
          <LanguageSwitcher />
          <h1 className="text-2xl font-bold text-white">{t('auth.signIn')}</h1>
          <p className="mt-2 text-sm text-gray-400">Sign in to your account to continue.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">{t('auth.email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
                placeholder="you@dealership.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">{t('auth.password')}</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 pr-11 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
                  placeholder="Your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="rounded-lg bg-[#e63946]/10 p-3 text-sm text-[#e63946]">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? t('auth.signingIn') : t('auth.signIn')}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-400">
            {t('auth.noAccount')}{" "}
            <a href="/signup" className="text-[#e63946] hover:underline">
              {t('auth.signUp')}
            </a>
          </p>
          <p className="mt-4 text-center text-xs text-gray-600">
            After signing in, if you don't see our emails, check your spam folder. Add <span className="text-[#e63946]">champion-sales-training-events-f80d0630@ctomail.io</span> to your contacts.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}