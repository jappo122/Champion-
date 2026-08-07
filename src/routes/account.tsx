import { LanguageSwitcher } from '../i18n';
import { useTranslation } from '../i18n';
import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getSession, updateProfile } from "~/lib/auth";
import { SiteHeader } from "~/components/site-header";

export const Route = createFileRoute("/account")({
  component: AccountPage,
});

function AccountPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<{ id: number; email: string; name: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("salesdrive_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    getSession({ data: { token } }).then((result) => {
      if (result.user) {
        setUser(result.user);
        setName(result.user.name || "");
      } else {
        // Token kept — transient failures should not log you out
        window.location.href = "/login";
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("salesdrive_token");
    window.location.href = "/";
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("salesdrive_token");
    if (!token) return;
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const result = await updateProfile({ data: { token, name } });
      if (result.success) {
        setSaved(true);
        setUser(result.user);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.error || "Failed to update");
      }
    } catch {
      setError("Something went wrong");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0a1628]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 pt-[184px] pb-12">
        <h1 className="text-3xl font-bold text-white">{t('account.title')}</h1>
        <p className="mt-2 text-gray-400">{t('account.subtitle')}</p>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {/* Sidebar */}
          <div className="space-y-1">
            <div className="rounded-lg bg-[#e63946]/10 px-4 py-2 text-sm font-medium text-[#e63946]">
              {t('account.profile')}
            </div>
          </div>

          {/* Main */}
          <div className="md:col-span-2">
            <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
              <h2 className="text-lg font-bold text-white">{t('account.profileInfo')}</h2>
              <p className="mt-1 text-sm text-gray-400">{t('account.profileDesc')}</p>

              <form onSubmit={handleSave} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">{t('auth.email')}</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-gray-500 outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">{t('account.emailUnchangeable')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">{t('auth.name')}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
                    placeholder="Your full name"
                  />
                </div>
                {error && (
                  <div className="rounded-lg bg-[#e63946]/10 p-3 text-sm text-[#e63946]">{error}</div>
                )}
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? t('account.saving') : t('account.save')}
                  </button>
                  {saved && (
                    <span className="text-sm text-green-500">{t('account.saved')}</span>
                  )}
                </div>
              </form>
            </div>

            {/* Account info */}
            <div className="mt-6 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
              <h2 className="text-lg font-bold text-white">{t('account.details')}</h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between border-b border-[#1a2d4a] pb-2">
                  <span className="text-sm text-gray-400">{t('account.memberSince')}</span>
                  <span className="text-sm text-white">Just now</span>
                </div>
                <div className="flex justify-between border-b border-[#1a2d4a] pb-2">
                  <span className="text-sm text-gray-400">{t('account.plan')}</span>
                  <span className="text-sm text-white">Free (waitlist)</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-sm text-gray-400">{t('account.userId')}</span>
                  <span className="text-sm text-white">#{user.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}