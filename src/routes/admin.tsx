import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { upgradeDemoAccounts } from "~/lib/admin";
import { getAuthInfo } from "~/lib/auth-guard";
import { LanguageSwitcher } from "~/i18n";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("auth-token");
    if (stored) {
      setToken(stored);
      getAuthInfo({ data: { token: stored } }).then((res) => {
        if (res.authenticated) {
          // Only allow user ID 1 (owner) and demo users to access admin
          const adminEmails = ["owner@champion.com", "jappo122@gmail.com", "floydsandersjr@yahoo.com"];
          if (res.user?.id === 1 || adminEmails.includes(res.user?.email || "")) {
            setIsAdmin(true);
          }
        }
        setInitializing(false);
      });
    } else {
      setInitializing(false);
    }
  }, []);

  async function handleUpgrade() {
    if (!token) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await upgradeDemoAccounts({ data: { token } });
      if (res.success) {
        setResult("✅ Done!\n" + (res.results || []).join("\n"));
      } else {
        setResult("❌ " + (res.error || "Unknown error"));
      }
    } catch (e: any) {
      setResult("❌ " + (e.message || "Request failed"));
    }
    setLoading(false);
  }

  if (initializing) {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <SiteHeader />
        <div className="flex items-center justify-center pt-[184px] pb-12">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <SiteHeader />
        <div className="flex items-center justify-center pt-[184px] pb-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Admin</h1>
            <p className="text-slate-400 mb-6">Please sign in to access the admin panel.</p>
            <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <SiteHeader />
        <div className="flex items-center justify-center pt-[184px] pb-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-slate-400">This page is restricted to owner accounts.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <SiteHeader />

      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
        <p className="text-slate-400 mb-8">Manage demo accounts and platform settings.</p>

        <div className="bg-[#0f1d32] rounded-xl border border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Demo Accounts</h2>
          <p className="text-slate-400 text-sm mb-4">
            Upgrade known demo accounts to the Premium tier for full platform access.
            This affects: owner@champion.com, jappo122@gmail.com, floydsandersjr@yahoo.com
          </p>

          <button
            onClick={handleUpgrade}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              loading
                ? "bg-slate-600 text-slate-300 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {loading ? "Upgrading..." : "Upgrade Demo Accounts to Premium"}
          </button>

          {result && (
            <pre className="mt-4 p-4 bg-[#0a1628] rounded-lg text-sm text-slate-300 whitespace-pre-wrap">
              {result}
            </pre>
          )}
        </div>

        <div className="bg-[#0f1d32] rounded-xl border border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-2">How It Works</h2>
          <p className="text-slate-400 text-sm">
            Demo accounts are automatically recognized by <code className="text-blue-400">getAuthInfo</code> in{" "}
            <code className="text-blue-400">src/lib/auth-guard.ts</code>. Their tier is overridden to{" "}
            <code className="text-green-400">premium</code> regardless of their subscription record,
            giving them full access to all tier-gated courses including Advanced Closing Part 2
            and Senior Sales Training.
          </p>
        </div>
      </div>
    </div>
  );
}
