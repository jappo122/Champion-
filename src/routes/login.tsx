import { LanguageSwitcher } from '../i18n';
import { useTranslation } from '../i18n';
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="flex min-h-dvh items-center justify-center bg-[#0a1628] px-6">
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
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
                placeholder="Your password"
              />
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
  );
}