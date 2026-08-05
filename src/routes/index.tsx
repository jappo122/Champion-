import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation, LanguageSwitcher } from "~/i18n";

// ── Route configuration ────────────────────────────────────────────────────
export const Route = createFileRoute("/")({
  component: Home,
});

// ── Component ──────────────────────────────────────────────────────────────
function Home() {
  const { t } = useTranslation();
  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <Navbar t={t} />
      <Hero t={t} />
      <Features t={t} />
      <AccountTypes t={t} />
      <HowItWorks t={t} />
      <Testimonials t={t} />
      <Pricing t={t} />
      <Footer t={t} />
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────
function Navbar({ t }: { t: (k: string) => string }) {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("salesdrive_token"));
    const check = () => setLoggedIn(!!localStorage.getItem("salesdrive_token"));
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);
  return (
    <header className="fixed top-0 z-50 w-full bg-transparent">
      <div className="mx-auto flex h-[210px] max-w-7xl items-center justify-between px-3 md:px-6">
        <a href="/" className="flex items-center shrink-0 pl-0">
          <img src="/fb-logo.png" alt="Champion Sales Training & Events" className="h-[175px] w-auto object-contain" />
        </a>
        <button
          onClick={() => (window as any).__toggleMobileNav?.()}
          className="md:hidden flex h-12 w-12 items-center justify-center rounded-lg bg-[#1a2d4a] text-white"
          aria-label="Menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <nav className="hidden items-center gap-6 md:flex">
          {loggedIn ? (
            <>
              <a href="/training" className="text-sm text-gray-400 transition-colors hover:text-white">{t('nav.training')}</a>
              <a href="/steps" className="text-sm text-gray-400 transition-colors hover:text-white">Steps of the Sale</a>
              <a href="/webinars" className="text-sm text-gray-400 transition-colors hover:text-white">Webinars</a>
              <a href="/profile" className="text-sm text-gray-400 transition-colors hover:text-white">{t('profile.title')}</a>
              <button onClick={() => { localStorage.removeItem("salesdrive_token"); window.location.href = "/"; }} className="text-sm text-gray-400 transition-colors hover:text-white">Sign Out</button>
            </>
          ) : (
            <>
              <a href="/training" className="text-sm text-gray-400 transition-colors hover:text-white">{t('nav.training')}</a>
              <a href="/steps" className="text-sm text-gray-400 transition-colors hover:text-white">Steps of the Sale</a>
              <a href="/webinars" className="text-sm text-gray-400 transition-colors hover:text-white">Webinars</a>
              <a href="/blog" className="text-sm text-gray-400 transition-colors hover:text-white">Blog</a>
              <a href="/login" className="text-sm text-gray-400 transition-colors hover:text-white">{t('nav.signIn')}</a>
              
            </>
          )}
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────
function Hero({ t }: { t: (k: string) => string }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
    <section className="relative overflow-hidden pt-56 pb-28 sm:pb-36">
      {/* Background glow — enhanced depth */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[#e63946]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-[#f77f00]/8 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-0 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[#1a2d4a]/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-4 py-1.5 text-xs font-medium text-gray-400">
          <span className="flex h-2 w-2 rounded-full bg-[#e63946] animate-pulse" />
          {t('hero.badge')}
        </div>

        <p className="mt-6 text-sm font-semibold text-[#e63946]/80 uppercase tracking-[0.2em]">Training salespeople since 2015</p>

        <h1 className="mx-auto mt-4 max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.08]">
          <span className="text-white">{t('hero.title.line1')}</span>
          <br />
          <span className="gradient-brand">{t('hero.title.line2')}</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-400 sm:text-xl">
          {t('hero.description')}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#pricing" className="btn-primary-lg">
            {t('hero.cta.waitlist')}
          </a>
          <a href="#features" className="btn-secondary text-base px-8 py-4">
            {t('hero.cta.learnMore')}
          </a>
        </div>

        {/* Scroll down indicator — bottom right, fades on scroll */}
        <div
          className={`fixed bottom-8 right-8 z-40 flex flex-col items-center gap-1.5 transition-all duration-700 ${
            scrolled ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
            Scroll Down
          </span>
          <svg className="h-5 w-5 animate-bounce text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="h-5 w-5 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {t('hero.trust.proven')}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="h-5 w-5 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {t('hero.trust.biteSized')}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="h-5 w-5 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t('hero.trust.forDealers')}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Features ───────────────────────────────────────────────────────────────
function Features({ t }: { t: (k: string) => string }) {
  const features = [
    t('features.sales.item1'),
    t('features.sales.item2'),
    t('features.sales.item3'),
    t('features.sales.item4'),
    t('features.sales.item5'),
    t('features.sales.item6'),
    t('features.sales.item7'),
  ];

  return (
    <section id="features" className="border-t border-[#1a2d4a]/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="section-title">{t('features.title')}</h2>
          <p className="section-subtitle mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="card-glow md:col-span-2 max-w-2xl mx-auto">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a2d4a] icon-bg transition-colors duration-200">
              <svg className="h-7 w-7 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">{t('features.sales.title')}</h3>
            <p className="mt-3 text-gray-400">
              {t('features.sales.desc')}
            </p>
            <ul className="mt-6 space-y-3">
              {features.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-400">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <a href="/training" className="btn-primary mt-6 text-sm">
              {t('features.sales.cta')}
            </a>
          </div>
        </div>
        {/* Scroll down indicator — bottom right of features section */}
        <div className="mt-8 flex justify-end">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
              Scroll Down
            </span>
            <svg className="h-4 w-4 animate-bounce text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Account Types ──────────────────────────────────────────────────────────
function AccountTypes({ t }: { t: (k: string) => string }) {
  return (
    <section id="account-types" className="border-t border-[#1a2d4a]/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="section-title">Choose Your Account Type</h2>
          <p className="section-subtitle mx-auto">
            Whether you're an individual salesperson or a dealership manager, we have the right plan for you.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
          <div className="card-glow">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a2d4a] icon-bg transition-colors duration-200">
              <svg className="h-7 w-7 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Individual Account</h3>
            <p className="mt-3 text-gray-400">
              Perfect for salespeople who want to master the sales process at their own pace.
              Access all courses, track your progress, and start closing more deals.
            </p>
            <ul className="mt-4 space-y-2">
              {["Complete training library", "Track your own progress", "Interactive quizzes with 80% mastery threshold", "Objection handling techniques"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-400">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <a href="/signup" className="btn-primary mt-6 text-sm inline-block">
              Get Started — Individual
            </a>
          </div>

          <div className="card-glow border-[#e63946]/30">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1a2d4a] icon-bg transition-colors duration-200">
              <svg className="h-7 w-7 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Management Account</h3>
            <p className="mt-3 text-gray-400">
              Built for dealership managers who need to train their team at scale.
              Add salespeople, track progress, assign modules, and manage subscriptions.
            </p>
            <ul className="mt-4 space-y-2">
              {["Add & manage salespeople", "Track team progress", "Assign modules by skill gaps", "Cost & subscription management"].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-400">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <a href="/signup" className="btn-primary mt-6 text-sm inline-block">
              Get Started — Management
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── How It Works ────────────────────────────────────────────────────────────
function HowItWorks({ t }: { t: (k: string) => string }) {
  const steps = [
    {
      number: "01",
      title: t('how.step1.title'),
      description: t('how.step1.desc'),
      color: "from-[#e63946] to-[#f77f00]",
    },
    {
      number: "02",
      title: t('how.step2.title'),
      description: t('how.step2.desc'),
      color: "from-[#f77f00] to-[#e63946]",
    },
    {
      number: "03",
      title: t('how.step3.title'),
      description: t('how.step3.desc'),
      color: "from-[#e63946] to-[#f77f00]",
    },
  ];

  return (
    <section id="how-it-works" className="border-t border-[#1a2d4a]/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="section-title">{t('how.title')}</h2>
          <p className="section-subtitle mx-auto">
            {t('how.subtitle')}
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="card-glow relative">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r px-4 py-1 text-xs font-bold text-white">
                <span className="gradient-text" style={{ WebkitTextFillColor: "white" }}>
                  {t('how.step')} {step.number}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-gray-400">{step.description}</p>
              <div className="mt-6 h-1 w-full rounded-full bg-[#1a2d4a]">
                <div className={`h-1 w-1/3 rounded-full bg-gradient-to-r ${step.color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ───────────────────────────────────────────────────────────
function Testimonials({ t }: { t: (k: string) => string }) {
  const testimonials = [
    {
      quote: "My team closed 23% more deals within 30 days of starting this training. The objection-handling modules alone are worth 10× the subscription.",
      name: "Michael Torres",
      role: "General Manager, Elite Motors",
      avatar: "MT",
    },
    {
      quote: "I've tried five training platforms. This is the only one my salespeople actually use — the 2-minute video format keeps them engaged daily.",
      name: "Sarah Chen",
      role: "Sales Director, Pacific Auto Group",
      avatar: "SC",
    },
    {
      quote: "The skills gap assessment showed us exactly where every rep needed work. Targeted coaching instead of blanket training saved us months.",
      name: "David Okafor",
      role: "Owner, Okafor Motors",
      avatar: "DO",
    },
  ];

  return (
    <section id="testimonials" className="border-t border-[#1a2d4a]/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="section-title">Trusted by Dealerships Nationwide</h2>
          <p className="section-subtitle mx-auto">
            Real results from real sales teams using Champion Sales Training every day.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="card-glass flex flex-col">
              {/* Quote */}
              <svg className="mb-4 h-8 w-8 text-[#e63946]/40" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2V8zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2V8z" />
              </svg>
              <p className="flex-1 text-gray-300 leading-relaxed italic">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#e63946] to-[#f77f00] text-sm font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Trust bar */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" />99.7% uptime</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" />500+ dealerships</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" />4.9/5 average rating</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" />24/7 support</span>
        </div>
      </div>
    </section>
  );
}

// ── Pricing ────────────────────────────────────────────────────────────────
function Pricing({ t }: { t: (k: string) => string }) {
  const individualTiers = [
    {
      id: "basic",
      name: t('pricing.basic.name'),
      price: t('pricing.basic.price'),
      period: t('pricing.period'),
      description: t('pricing.basic.desc'),
      features: [
        t('pricing.basic.feature1'), t('pricing.basic.feature2'),
        t('pricing.basic.feature3'), t('pricing.basic.feature4'),
      ],
      cta: t('pricing.cta'),
      href: "https://buy.stripe.com/00wfZh2aq7eY02S7fF8Vi0c",
      featured: false,
    },
    {
      id: "plus",
      name: t('pricing.plus.name'),
      price: t('pricing.plus.price'),
      period: t('pricing.period'),
      description: t('pricing.plus.desc'),
      features: [
        t('pricing.plus.feature1'), t('pricing.plus.feature2'),
        t('pricing.plus.feature3'), t('pricing.plus.feature4'),
      ],
      cta: t('pricing.cta'),
      href: "https://buy.stripe.com/fZudR95mC7eYbLAarR8Vi0d",
      featured: true,
    },
    {
      id: "premium",
      name: t('pricing.premium.name'),
      price: t('pricing.premium.price'),
      period: t('pricing.period'),
      description: t('pricing.premium.desc'),
      features: [
        t('pricing.premium.feature1'), t('pricing.premium.feature2'),
        t('pricing.premium.feature3'), t('pricing.premium.feature4'),
        t('pricing.premium.feature5'), t('pricing.premium.feature6'),
        t('pricing.premium.feature7'),
      ],
      cta: t('pricing.cta'),
      href: "https://buy.stripe.com/8x2dR96qGdDm6rggQf8Vi0e",
      featured: false,
    },
  ];

  const mgmtTiers = [
    {
      id: "mgmt-basic",
      name: t('pricing.mgmtBasic.name'),
      price: t('pricing.mgmtBasic.price'),
      period: t('pricing.basePlus'),
      description: t('pricing.management.desc'),
      perPerson: t('pricing.perPerson'),
      range: "$149–$189",
      features: [
        t('pricing.mgmtBasic.feature1'), t('pricing.mgmtBasic.feature2'),
        t('pricing.mgmtBasic.feature3'), t('pricing.mgmtBasic.feature4'),
        t('pricing.mgmtPlus.perPerson'),
      ],
      cta: t('pricing.cta'),
      href: "/checkout?tier=mgmt-basic",
      featured: false,
    },
    {
      id: "mgmt-plus",
      name: t('pricing.mgmtPlus.name'),
      price: t('pricing.mgmtPlus.price'),
      period: t('pricing.basePlus'),
      description: t('pricing.management.desc'),
      perPerson: t('pricing.perPerson'),
      range: "$149–$189",
      features: [
        t('pricing.mgmtPlus.feature1'), t('pricing.mgmtPlus.feature2'),
        t('pricing.mgmtPlus.feature3'), t('pricing.mgmtPlus.feature4'),
        t('pricing.mgmtPlus.perPerson'),
      ],
      cta: t('pricing.cta'),
      href: "/checkout?tier=mgmt-plus",
      featured: true,
    },
    {
      id: "mgmt-premium",
      name: t('pricing.mgmtPremium.name'),
      price: t('pricing.mgmtPremium.price'),
      period: t('pricing.basePlus'),
      description: t('pricing.management.desc'),
      perPerson: t('pricing.perPerson'),
      range: "$149–$189",
      features: [
        t('pricing.mgmtPremium.feature1'), t('pricing.mgmtPremium.feature2'),
        t('pricing.mgmtPremium.feature3'), t('pricing.mgmtPremium.feature4'),
        t('pricing.mgmtPremium.feature5'), t('pricing.mgmtPremium.feature6'),
        t('pricing.mgmtPlus.perPerson'),
      ],
      cta: t('pricing.cta'),
      href: "/checkout?tier=mgmt-premium",
      featured: false,
    },
  ];

  const renderTier = (tier: typeof individualTiers[0] & { perPerson?: string; range?: string }) => (
    <div
      key={tier.id}
      className={`relative flex flex-col rounded-xl border p-8 transition-all duration-200 ${
        tier.featured
          ? "border-[#e63946] bg-[#0d1f35] shadow-lg shadow-[#e63946]/10 scale-105"
          : "border-[#1a2d4a] bg-[#0d1f35] hover:border-[#2a4a6a]"
      }`}
    >
      {tier.featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#e63946] px-4 py-1 text-xs font-semibold text-white">
          {t('pricing.popular')}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-300">{tier.name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold text-white">${tier.price}</span>
        <span className="text-sm text-gray-500">{tier.period}</span>
      </div>
      {tier.range && (
        <p className="mt-1 text-xs text-gray-500">{tier.perPerson}: {tier.range}</p>
      )}
      <p className="mt-2 text-sm text-gray-400">{tier.description}</p>
      <ul className="mt-6 space-y-3 flex-1">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-gray-400">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-[#e63946]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <a
        href={tier.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-8 flex w-full items-center justify-center rounded-lg py-3 text-sm font-semibold transition-all duration-200 ${
          tier.featured
            ? "bg-[#e63946] text-white hover:bg-[#c1121f]"
            : "border border-[#1a2d4a] text-white hover:border-[#e63946] hover:text-[#e63946]"
        }`}
      >
        {tier.cta}
      </a>
    </div>
  );

  return (
    <section id="pricing" className="border-t border-[#1a2d4a]/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="section-title">{t('pricing.title')}</h2>
          <p className="section-subtitle mx-auto">{t('pricing.subtitle')}</p>
        </div>

        {/* Individual Plans */}
        <div className="mt-16">
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1a2d4a] bg-[#0d1f35] px-5 py-2 text-sm font-medium text-gray-300">
              {t('pricing.individual')}
            </span>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {individualTiers.map(renderTier)}
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1a2d4a]/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#0a1628] px-6 text-sm font-medium text-gray-500">OR</span>
          </div>
        </div>

        {/* Management Plans */}
        <div>
          <div className="mb-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e63946]/30 bg-[#e63946]/5 px-5 py-2 text-sm font-medium text-[#e63946]">
              {t('pricing.management')}
            </span>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {mgmtTiers.map(renderTier)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ──────────────────────────────────────────────────────────────────
function Footer({ t }: { t: (k: string) => string }) {
  return (
    <footer className="border-t border-[#1a2d4a]/50 bg-[#0a1628] py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2">
              <img src="/fb-logo.png" alt="Champion Sales Training & Events" className="h-[168px] w-auto -my-[52px]" />
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500">
              The complete automotive sales training platform. Master the proven sales process, close more deals, and grow your career.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">{t('nav.training')}</h4>
            <ul className="space-y-3">
              <li><a href="/training" className="text-sm text-gray-500 transition-colors hover:text-white">{t('nav.training')}</a></li>
              <li><a href="/blog" className="text-sm text-gray-500 transition-colors hover:text-white">Blog</a></li>
              <li><a href="/webinars" className="text-sm text-gray-500 transition-colors hover:text-white">Webinars</a></li>
              <li><a href="/#features" className="text-sm text-gray-500 transition-colors hover:text-white">{t('nav.features')}</a></li>
              <li><a href="/#pricing" className="text-sm text-gray-500 transition-colors hover:text-white">{t('nav.pricing')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Account</h4>
            <ul className="space-y-3">
              <li><a href="/login" className="text-sm text-gray-500 transition-colors hover:text-white">{t('nav.signIn')}</a></li>
              <li><a href="/signup" className="text-sm text-gray-500 transition-colors hover:text-white">{t('nav.getStarted')}</a></li>
              <li><a href="/manager" className="text-sm text-gray-500 transition-colors hover:text-white">{t('nav.manager')}</a></li>
              <li><a href="/support" className="text-sm text-gray-500 transition-colors hover:text-white">{t('footer.support')}</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#1a2d4a]/50 pt-8 sm:flex-row">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Champion Sales Training & Events. {t('footer.copyright')}
          </p>
          <div className="flex gap-6">
            <a href="https://www.facebook.com/Championsalesevents" target="_blank" rel="noopener noreferrer" className="text-gray-600 transition-colors hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}