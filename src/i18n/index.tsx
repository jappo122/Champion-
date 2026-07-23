import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getStoredLanguage, storeLanguage, languages, type Language } from "./config";
import enTranslations from "./locales/en";

export type { Language };
export { LanguageSwitcher } from "./LanguageSwitcher";

interface I18nContextType {
  lang: string;
  setLang: (code: string) => void;
  t: (key: string) => string;
  currentLanguage: Language | undefined;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: (key: string) => key,
  currentLanguage: undefined,
});

// Dynamic import of locale files
const localeCache: Record<string, Record<string, string>> = {};

async function loadLocale(lang: string): Promise<Record<string, string>> {
  if (localeCache[lang]) return localeCache[lang];
  try {
    const mod = await import(`./locales/${lang}.ts`);
    localeCache[lang] = mod.default || mod.translations;
    return localeCache[lang];
  } catch {
    // Fallback to English
    if (lang !== "en") return loadLocale("en");
    return {};
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState("en");
  // Preload English translations statically so SSR works — fallback to key is only a JS guard
  const [translations, setTranslations] = useState<Record<string, string>>(enTranslations);

  useEffect(() => {
    const stored = getStoredLanguage();
    setLangState(stored);
    loadLocale(stored).then(setTranslations);
  }, []);

  const setLang = (code: string) => {
    setLangState(code);
    storeLanguage(code);
    loadLocale(code).then(setTranslations);
  };

  const t = (key: string): string => {
    // Try current translations first, then fall back to English, then raw key
    return translations[key] || enTranslations[key] || key;
  };

  const currentLanguage = languages.find((l) => l.code === lang);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, currentLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}

export { loadLocale };