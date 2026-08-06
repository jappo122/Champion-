import { createFileRoute } from "@tanstack/react-router";
import { useTranslation, LanguageSwitcher } from "~/i18n";

export const Route = createFileRoute("/purchase/success")({
  component: PurchaseSuccess,
});

function PurchaseSuccess() {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh bg-[#0a1628]">
      <header className="sticky top-0 z-50 border-b border-[#1a2d4a]/50 bg-[#0a1628]/90">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-2">
            <img src="/fb-logo.png" alt="Champion Sales Training & Events" className="h-10 w-auto" />
          </a>
          <nav className="flex items-center gap-6">
            <a href="/training" className="text-sm text-gray-400 hover:text-white">{t('nav.training')}</a>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-bold text-white">{t('purchase.success')}</h1>
        <p className="mt-3 text-gray-400">{t('purchase.successDesc')}</p>
        <div className="mt-4 rounded-lg border border-[#1a2d4a] bg-[#0d1f35] p-4 text-sm text-gray-400">
          {t('purchase.emailSent')}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href="/login" className="btn-primary text-sm">
            {t('auth.signIn')}
          </a>
          <a href="/training" className="btn-secondary text-sm">
            {t('training.start')}
          </a>
        </div>
      </div>
      </div>
    </div>
  );
}