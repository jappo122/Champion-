import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { isTokenValid } from "~/lib/client-auth";
import { sendEmail } from "~/lib/email";
import { SiteHeader } from "~/components/site-header";

export const Route = createFileRoute("/email")({
  component: EmailPage,
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("salesdrive_token");
      if (!token || !isTokenValid(token)) {
        throw redirect({ to: "/login" });
      }
    }
  },
});

function EmailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim() || !subject.trim() || !body.trim()) return;
    setSending(true);
    setError("");
    try {
      const result = await sendEmail({ data: { to: to.trim(), subject: subject.trim(), body: body.trim() } });
      if (result.success) {
        setSent(true);
        setTo("");
        setSubject("");
        setBody("");
      } else {
        setError("Failed to send email. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-[#0a1628]">
      {/* Header */}
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 pt-[184px] pb-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Send Email</h1>
          <p className="mt-2 text-gray-400">Compose and send emails to your contacts.</p>
        </div>

        {sent ? (
          <div className="card p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Email Sent!</h2>
            <p className="mt-2 text-gray-400">Your email has been sent successfully.</p>
            <button
              onClick={() => setSent(false)}
              className="btn-primary mt-6"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="card space-y-6 p-6 sm:p-8">
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="to" className="mb-2 block text-sm font-medium text-gray-300">
                To <span className="text-[#e63946]">*</span>
              </label>
              <input
                id="to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                required
                className="w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
              />
            </div>

            <div>
              <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-300">
                Subject <span className="text-[#e63946]">*</span>
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject line"
                required
                className="w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
              />
            </div>

            <div>
              <label htmlFor="body" className="mb-2 block text-sm font-medium text-gray-300">
                Message <span className="text-[#e63946]">*</span>
              </label>
              <textarea
                id="body"
                rows={8}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email message here..."
                required
                className="w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-3 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946] resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={sending || !to.trim() || !subject.trim() || !body.trim()}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? "Sending..." : "Send Email"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
