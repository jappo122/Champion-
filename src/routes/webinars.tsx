import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LanguageSwitcher } from "~/i18n";

export const Route = createFileRoute("/webinars")({
  component: WebinarsPage,
});

function WebinarsPage() {
  const [webinarUrl, setWebinarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/webinar-url")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.url) setWebinarUrl(data.url);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = () => {
    if (webinarUrl) {
      navigator.clipboard.writeText(webinarUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  };

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      {/* Header */}
      <header className="border-b border-[#1a2d4a]/50 bg-[#0a1628]/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <img src="/fb-logo.jpg" alt="Champion Sales Training & Events" className="h-10 w-auto" />
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="/training" className="text-sm text-gray-400 hover:text-white">Training</a>
            <a href="/blog" className="text-sm text-gray-400 hover:text-white">Blog</a>
            <a href="/#pricing" className="text-sm text-gray-400 hover:text-white">Pricing</a>
            <a href="/login" className="text-sm text-gray-400 hover:text-white">Sign In</a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#e63946]/8 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-[300px] w-[300px] rounded-full bg-[#1a2d4a]/40 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400">
            <span className="flex h-2 w-2 rounded-full bg-[#e63946] animate-pulse" />
            Live Training Events
          </span>

          <h1 className="mx-auto mt-8 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Join Our <span className="text-[#e63946]">Live Webinars</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl">
            Learn directly from automotive sales experts in our interactive live training sessions.
            Get real-time answers to your toughest sales challenges and level up your skills.
          </p>
        </div>
      </section>

      {/* Webinar Access Section */}
      <section className="border-t border-[#1a2d4a]/50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1a2d4a] border-t-[#e63946]" />
            </div>
          ) : webinarUrl ? (
            <div className="space-y-8">
              {/* Instructions Card */}
              <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a2d4a]">
                  <svg className="h-7 w-7 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-white mb-4">How to Join</h2>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e63946]/10 text-sm font-bold text-[#e63946]">1</div>
                    <div>
                      <p className="text-sm font-medium text-white">Copy the webinar link</p>
                      <div className="mt-2 flex items-center gap-3">
                        <code className="flex-1 break-all rounded-lg border border-[#1a2d4a] bg-[#0a1628] px-4 py-2.5 text-sm text-gray-300 font-mono">
                          {webinarUrl}
                        </code>
                        <button
                          onClick={handleCopy}
                          className="shrink-0 rounded-lg border border-[#1a2d4a] px-4 py-2.5 text-sm font-medium text-white transition-all hover:border-[#e63946] hover:text-[#e63946] active:scale-95"
                        >
                          {copied ? (
                            <span className="flex items-center gap-1.5 text-green-400">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Copied
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e63946]/10 text-sm font-bold text-[#e63946]">2</div>
                    <div>
                      <p className="text-sm font-medium text-white">Open the link in your browser</p>
                      <p className="mt-1 text-sm text-gray-400">The link works on desktop, tablet, or mobile — no special software required.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e63946]/10 text-sm font-bold text-[#e63946]">3</div>
                    <div>
                      <p className="text-sm font-medium text-white">Join at the scheduled time</p>
                      <p className="mt-1 text-sm text-gray-400">Arrive a few minutes early to test your audio and video. Sessions start promptly.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Big Join Button */}
              <a
                href={webinarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#e63946] px-8 py-5 text-lg font-bold text-white shadow-lg shadow-[#e63946]/25 transition-all duration-200 hover:bg-[#c1121f] hover:shadow-xl hover:shadow-[#e63946]/30 active:scale-[0.98]"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Join the Webinar Now
              </a>
            </div>
          ) : (
            /* No webinar scheduled */
            <div className="rounded-xl border border-dashed border-[#1a2d4a] bg-[#0d1f35] p-12 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#1a2d4a]">
                <svg className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No Webinar Scheduled</h2>
              <p className="text-gray-400 max-w-md mx-auto">
                There's no live webinar scheduled at the moment. Check back soon or contact us to learn about upcoming training events.
              </p>
              <a href="/contact" className="btn-primary mt-8 text-sm">
                Contact Us About Webinars
              </a>
            </div>
          )}

          {/* Info Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a2d4a]">
                <svg className="h-5 w-5 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white">Live & Interactive</h3>
              <p className="mt-2 text-sm text-gray-400">Ask questions in real time. Get personalized feedback on your sales approach from experienced trainers.</p>
            </div>
            <div className="rounded-xl border border-[#1a2d4a] bg-[#0d1f35] p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1a2d4a]">
                <svg className="h-5 w-5 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-white">Practical Techniques</h3>
              <p className="mt-2 text-sm text-gray-400">Walk away with actionable strategies you can use on the sales floor the very next day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a2d4a]/50 bg-[#0a1628] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/training" className="hover:text-white transition-colors">Training</a>
            <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/support" className="hover:text-white transition-colors">Support</a>
            <a href="/login" className="hover:text-white transition-colors">Sign In</a>
          </div>
          <p className="mt-6 text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Champion Sales Training & Events. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
