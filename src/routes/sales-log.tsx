import { createFileRoute } from "@tanstack/react-router";
import { LanguageSwitcher } from "~/i18n";

export const Route = createFileRoute("/sales-log")({
  component: SalesLogPage,
});

function SalesLogPage() {
  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <header className="border-b border-[#1a2d4a]/50 bg-[#0a1628]/90">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <img src="/fb-logo.jpg" alt="Champion Sales Training & Events" className="h-10 w-auto" />
          </a>
          <nav className="flex items-center gap-6">
            <a href="/manager" className="text-sm text-gray-400 hover:text-white">Manager Dashboard</a>
            <a href="/profile" className="text-sm text-gray-400 hover:text-white">Profile</a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e63946]/20">
            <svg className="h-8 w-8 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-white">Sales Log</h1>
          <p className="mt-3 text-gray-400">Track your sales, goals, and gross profit. This feature is available in the manager dashboard for Premium subscribers.</p>
          <div className="mt-8 flex justify-center gap-4">
            <a href="/manager" className="btn-primary text-sm">Go to Manager Dashboard</a>
            <a href="/profile" className="btn-secondary text-sm">View Subscription</a>
          </div>
        </div>
      </main>
    </div>
  );
}