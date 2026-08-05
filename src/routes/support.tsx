import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { sql } from "~/db";
import { useTranslation } from "~/i18n";

const submitTicket = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: { name: string; email: string; subject: string; message: string } }) => {
    const db = sql();
    try {
      await db`
        INSERT INTO support_tickets (name, email, subject, message)
        VALUES (${data.name}, ${data.email}, ${data.subject}, ${data.message})
      `;
      return { success: true };
    } catch (err) {
      console.error("[Support] Error submitting ticket:", err);
      return { success: false };
    }
  },
);

export const Route = createFileRoute("/support")({
  component: SupportPage,
});

function SupportPage() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("error") === "1"
      ? "error"
      : "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setStatus("loading");
    try {
      const result = await submitTicket({ data: { name, email, subject, message } });
      if (result.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        // Send auto-confirmation email
        try {
          const { sendEmail } = await import("~/lib/email");
          await sendEmail({
            to: [email],
            subject: "Support Ticket Received",
            body: `Hi ${name},\n\nWe've received your support ticket.\n\nSubject: ${subject}\n\nWe'll review it and get back to you within 24 hours.\n\n- Champion Sales Training Support`,
          });
        } catch {}
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <header className="border-b border-[#1a2d4a]/50 bg-[#0a1628]/90">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <img src="/fb-logo.png" alt="Champion Sales Training & Events" className="h-10 w-auto" />
          </a>
          <a href="/" className="text-sm text-gray-400 transition-colors hover:text-white">Home</a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mx-auto max-w-lg">
          <h1 className="text-3xl font-bold text-white">{t('support.title')}</h1>
          <p className="mt-2 text-gray-400">{t('support.subtitle')}</p>

          {status === "success" ? (
            <div className="mt-10 rounded-xl border border-green-500/30 bg-green-500/10 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/20">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-400">{t('support.success')}</h3>
                  <p className="mt-1 text-sm text-gray-300">{t('support.successDesc')}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300">{t('support.name')}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">{t('support.email')}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
                    placeholder="you@dealership.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">{t('support.subject')}</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">{t('support.message')}</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
                  placeholder="Tell us more about your issue..."
                />
              </div>
              {status === "error" && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                      <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-red-300">{t('support.error')}</p>
                  </div>
                </div>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "loading" ? t('support.sending') : t('support.submit')}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}