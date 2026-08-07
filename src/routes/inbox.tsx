import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { getAuthInfo } from "~/lib/auth-guard";
import { getInboxEmails, getInboxEmail, markInboxRead } from "~/lib/inbox";
import { LanguageSwitcher } from "~/i18n";

export const Route = createFileRoute("/inbox")({
  component: InboxPage,
});

interface EmailSummary {
  id: string;
  thread_id: string | null;
  direction: string;
  from_email: string;
  from_name: string;
  to_emails: string[];
  subject: string;
  preview: string;
  received_at: string;
  is_read: boolean;
}

interface EmailFull extends EmailSummary {
  body: string;
}

const DEMO_EMAILS = ["owner@champion.com", "jappo122@gmail.com", "floydsandersjr@yahoo.com"];
const BUSINESS_EMAIL = "champion-sales-training-events-f80d0630@ctomail.io";

function InboxPage() {
  const [token, setToken] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [emails, setEmails] = useState<EmailSummary[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailFull | null>(null);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");

  // Auth check
  useEffect(() => {
    const stored = localStorage.getItem("auth-token");
    if (!stored) {
      setInitializing(false);
      return;
    }
    setToken(stored);
    (async () => {
      const res = await getAuthInfo({ data: { token: stored } });
      if (res.authenticated && res.user) {
        if (res.user.id === 1 || DEMO_EMAILS.includes(res.user.email?.toLowerCase() || "")) {
          setIsDemo(true);
          // Load emails
          const emailList = await getInboxEmails({ data: { token: stored } });
          setEmails(emailList as EmailSummary[]);
        }
      }
      setInitializing(false);
    })();
  }, []);

  // Calculate unread count
  const unreadCount = emails.filter((e) => !e.is_read).length;

  // Handle email selection
  async function handleSelectEmail(email: EmailSummary) {
    if (!token) return;
    setLoadingEmail(true);
    setMobileView("detail");
    try {
      const full = await getInboxEmail({ data: { token, id: email.id } });
      setSelectedEmail(full as EmailFull);
      // Mark as read
      if (!email.is_read) {
        await markInboxRead({ data: { token, id: email.id } });
        setEmails((prev) =>
          prev.map((e) => (e.id === email.id ? { ...e, is_read: true } : e))
        );
      }
    } catch (err) {
      console.error("Failed to load email:", err);
    }
    setLoadingEmail(false);
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  // Loading state
  if (initializing) {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <SiteHeader />
        <div className="flex items-center justify-center pt-[184px] pb-12">
          <div className="animate-spin h-8 w-8 border-2 border-[#e63946] border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <SiteHeader />
        <div className="flex items-center justify-center pt-[184px] pb-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Inbox</h1>
            <p className="text-slate-400 mb-6">Please sign in to access the inbox.</p>
            <a href="/login" className="px-6 py-3 bg-[#e63946] text-white rounded-lg hover:bg-[#c1121f] transition font-semibold">
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Not a demo user
  if (!isDemo) {
    return (
      <div className="min-h-screen bg-[#0a1628]">
        <SiteHeader />
        <div className="flex items-center justify-center pt-[184px] pb-12">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e63946]/20 mb-4">
              <svg className="h-8 w-8 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-slate-400">The inbox is only available to account owners.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <SiteHeader />

      {/* Top bar */}
      <div className="bg-[#0f1d32] border-b border-[#1a2d4a] px-4 py-3 md:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Inbox</h1>
            <p className="text-xs text-slate-400 mt-0.5">{BUSINESS_EMAIL}</p>
          </div>
          {unreadCount > 0 && (
            <span className="bg-[#e63946] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
      </div>

      {/* Back button on mobile detail view */}
      {mobileView === "detail" && (
        <div className="md:hidden px-4 pt-3">
          <button
            onClick={() => { setMobileView("list"); setSelectedEmail(null); }}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to inbox
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-6xl mx-auto flex h-[calc(100vh-80px)]">
        {/* Email list panel */}
        <div className={`${
          mobileView === "detail" ? "hidden md:block" : "block"
        } w-full md:w-96 lg:w-[420px] border-r border-[#1a2d4a] overflow-y-auto`}>
          {emails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <svg className="w-12 h-12 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-slate-400 text-sm">No emails</p>
              <p className="text-slate-600 text-xs mt-1">Emails sent from your business inbox will appear here.</p>
            </div>
          ) : (
            emails.map((email) => (
              <button
                key={email.id}
                onClick={() => handleSelectEmail(email)}
                className={`w-full text-left px-4 py-3 border-b border-[#1a2d4a] transition hover:bg-[#0f1d32] ${
                  selectedEmail?.id === email.id ? "bg-[#0f1d32] border-l-2 border-l-[#e63946]" : ""
                } ${!email.is_read ? "bg-[#0d1f35]/60" : ""}`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar circle */}
                  <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                    email.direction === "outbound"
                      ? "bg-blue-600/20 text-blue-400"
                      : "bg-green-600/20 text-green-400"
                  }`}>
                    {(email.from_name || email.from_email).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm truncate ${!email.is_read ? "text-white font-semibold" : "text-slate-300"}`}>
                        {email.from_name || email.from_email}
                      </span>
                      <span className="text-xs text-slate-500 flex-shrink-0">
                        {formatDate(email.received_at)}
                      </span>
                    </div>
                    <p className={`text-sm truncate mt-0.5 ${!email.is_read ? "text-white font-medium" : "text-slate-400"}`}>
                      {email.subject}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {email.preview}
                    </p>
                  </div>
                </div>
                {!email.is_read && (
                  <div className="ml-12 mt-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#e63946]" />
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        {/* Email detail panel */}
        <div className={`${
          mobileView === "list" ? "hidden md:flex" : "flex"
        } flex-1 flex-col overflow-y-auto`}>
          {loadingEmail ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-6 w-6 border-2 border-[#e63946] border-t-transparent rounded-full" />
            </div>
          ) : selectedEmail ? (
            <div className="p-6">
              {/* Subject */}
              <h2 className="text-xl font-bold text-white mb-4">{selectedEmail.subject}</h2>

              {/* Metadata */}
              <div className="bg-[#0f1d32] rounded-lg border border-[#1a2d4a] p-4 mb-6">
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm">
                  <span className="text-slate-500">From:</span>
                  <span className="text-slate-300">
                    {selectedEmail.from_name ? `${selectedEmail.from_name} ` : ""}
                    <span className="text-slate-400">&lt;{selectedEmail.from_email}&gt;</span>
                  </span>
                  <span className="text-slate-500">To:</span>
                  <span className="text-slate-300">
                    {selectedEmail.to_emails.join(", ")}
                  </span>
                  <span className="text-slate-500">Date:</span>
                  <span className="text-slate-300">
                    {new Date(selectedEmail.received_at).toLocaleString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-slate-500">Direction:</span>
                  <span className={`text-sm font-medium ${
                    selectedEmail.direction === "outbound" ? "text-blue-400" : "text-green-400"
                  }`}>
                    {selectedEmail.direction === "outbound" ? "Outbound" : "Inbound"}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                {selectedEmail.body}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <svg className="w-16 h-16 mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Select an email to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
