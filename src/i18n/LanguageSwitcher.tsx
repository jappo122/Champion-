import { useState, useRef, useEffect } from "react";
import { useTranslation, type Language } from "./index";
import { languages } from "./config";

export function LanguageSwitcher() {
  const { lang, setLang, currentLanguage } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <span className="mb-1 block text-[10px] font-medium uppercase tracking-wider text-gray-500">Change Language</span>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-gray-400 transition-colors hover:text-white hover:bg-[#1a2d4a]"
        aria-label="Select language"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="hidden sm:inline">{currentLanguage?.nativeName || lang}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 max-h-72 w-48 overflow-y-auto rounded-xl border border-[#1a2d4a] bg-[#0d1f35] shadow-xl shadow-black/30">
          {languages.map((langItem) => (
            <button
              key={langItem.code}
              onClick={() => { setLang(langItem.code); setOpen(false); }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#1a2d4a] ${
                lang === langItem.code ? "text-[#e63946]" : "text-gray-400"
              }`}
            >
              <span className="text-xs text-gray-500 w-6">{langItem.code.toUpperCase()}</span>
              <span className="font-medium">{langItem.nativeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}