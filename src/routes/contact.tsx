import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { sendEmail } from "~/lib/email";

const submitContactForm = createServerFn({ method: "POST" }).handler(
  async ({ data }: { data: {
    name: string;
    email: string;
    phone: string;
    wantsCallback: boolean;
    subject: string;
    description: string;
  } }) => {
    try {
      const body = `New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Call Back Requested: ${data.wantsCallback ? "YES — Call this person back" : "No"}
Subject: ${data.subject}

Description/Question/Concern:
${data.description}
`;

      await sendEmail({
        data: {
          to: ["cstrainingpros@yahoo.com"],
          subject: `Contact Form: ${data.subject}`,
          body,
        },
      });

      // Send auto-confirmation to the user
      await sendEmail({
        data: {
          to: [data.email],
          subject: "We received your message — Champion Sales Training & Events",
          body: `Hi ${data.name},\n\nThank you for contacting Champion Sales Training & Events. We've received your message and will respond within 48 hours.\n\nSubject: ${data.subject}\n\n${data.wantsCallback ? "You've requested a call back, so a sales representative will reach out to you at ${data.phone}.\n\n" : ""}If you need immediate assistance, you can also reach our sales department at cstrainingpros@yahoo.com.\n\n- Champion Sales Training & Events Team`,
        },
      });

      return { success: true };
    } catch (err) {
      console.error("[Contact] Error submitting form:", err);
      return { success: false };
    }
  },
);

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [wantsCallback, setWantsCallback] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !description) return;

    setStatus("loading");
    try {
      const result = await submitContactForm({
        data: { name, email, phone, wantsCallback, subject, description },
      });
      if (result.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setPhone("");
        setWantsCallback(false);
        setSubject("");
        setDescription("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      {/* Header */}
      <header className="border-b border-[#1a2d4a]/50 bg-[#0a1628]/90">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e63946]">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">Champion Sales Training & Events</span>
          </a>
          <nav className="flex items-center gap-6">
            <a href="/" className="text-sm text-gray-400 transition-colors hover:text-white">Home</a>
            <a href="/support" className="text-sm text-gray-400 transition-colors hover:text-white">Support</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-white">Contact Us</h1>
          <p className="mt-2 text-gray-400">
            Have a question about our training platform, pricing, or need help getting started? We're here to help.
          </p>

          {/* Contact Info Sections */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Sales Department */}
            <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e63946]/20">
                <svg className="h-5 w-5 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">Sales Department</h2>
              <p className="mt-2 text-sm text-gray-400">
                <a href="mailto:cstrainingpros@yahoo.com" className="text-[#e63946] hover:underline">
                  cstrainingpros@yahoo.com
                </a>
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Contact our sales department via email 24/7. You'll receive a response within 48 hours. Usually a sales person will reach out and call you right away if you provide a phone number.
              </p>
            </div>

            {/* Support */}
            <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-white">Support</h2>
              <p className="mt-2 text-sm text-gray-400">
                Need help with the platform? Visit our{" "}
                <a href="/support" className="text-blue-400 hover:underline">
                  Support page
                </a>{" "}
                to submit a ticket. Our support team will respond within 24 hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="mt-12 rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8">
            <h2 className="text-xl font-semibold text-white">Send Us a Message</h2>
            <p className="mt-1 text-sm text-gray-400">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>

            {status === "success" ? (
              <div className="mt-8 rounded-xl border border-[#1a2d4a] bg-[#0a1628] p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">Message Sent!</h3>
                <p className="mt-2 text-gray-400">
                  We've received your message and will get back to you within 48 hours.
                  {wantsCallback && " A team member will call you at the number you provided."}
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1a2d4a] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a4a6a]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Name <span className="text-[#e63946]">*</span>
                    </label>
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
                    <label className="block text-sm font-medium text-gray-300">
                      Email <span className="text-[#e63946]">*</span>
                    </label>
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
                  <label className="block text-sm font-medium text-gray-300">
                    Phone Number <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
                    placeholder="(555) 123-4567"
                  />
                  <label className="mt-2 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantsCallback}
                      onChange={(e) => setWantsCallback(e.target.checked)}
                      className="h-4 w-4 rounded border-[#1a2d4a] bg-[#0a1628] text-[#e63946] focus:ring-[#e63946]"
                    />
                    <span className="text-sm text-gray-400">I'd like a call back</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Subject <span className="text-[#e63946]">*</span>
                  </label>
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
                  <label className="block text-sm font-medium text-gray-300">
                    Description / Question / Concern <span className="text-[#e63946]">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-white placeholder-gray-500 outline-none transition-colors focus:border-[#e63946]"
                    placeholder="Tell us more about what you need..."
                  />
                </div>

                {status === "error" && (
                  <div className="rounded-lg bg-[#e63946]/10 p-3 text-sm text-[#e63946]">
                    Something went wrong. Please try again or email us directly at cstrainingpros@yahoo.com.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full rounded-lg bg-[#e63946] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#c1121f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
