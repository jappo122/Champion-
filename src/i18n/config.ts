// Language definitions for the top 20 most spoken languages
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  dir: "ltr" | "rtl";
}

export const languages: Language[] = [
  { code: "zh", name: "Chinese (Simplified)", nativeName: "简体中文", dir: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", dir: "ltr" },
  { code: "en", name: "English", nativeName: "English", dir: "ltr" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", dir: "rtl" },
  { code: "pt", name: "Portuguese", nativeName: "Português", dir: "ltr" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", dir: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", dir: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", dir: "ltr" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", dir: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", dir: "ltr" },
  { code: "jv", name: "Javanese", nativeName: "Basa Jawa", dir: "ltr" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", dir: "ltr" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", dir: "ltr" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", dir: "ltr" },
  { code: "ko", name: "Korean", nativeName: "한국어", dir: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", dir: "ltr" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", dir: "ltr" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", dir: "ltr" },
  { code: "it", name: "Italian", nativeName: "Italiano", dir: "ltr" },
];

export type TranslationKey = string;

export interface Translations {
  [key: string]: string;
}

// Simple translation function
export function t(key: string, lang: string): string {
  // This is a placeholder — the actual translations are loaded from locale modules
  // and stored in a global object. The `useTranslation` hook handles this.
  return key;
}

// ── Storage ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "champion_lang";

export function getStoredLanguage(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEY) || navigator.language.split("-")[0] || "en";
  }
  return "en";
}

export function storeLanguage(code: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, code);
  }
}

export function isLanguageSupported(code: string): boolean {
  return languages.some((l) => l.code === code);
}