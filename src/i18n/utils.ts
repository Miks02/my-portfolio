import { defaultLang, ui, type Lang, type UIKey } from "./ui";

function isLang(value: string | undefined): value is Lang {
  return value !== undefined && value in ui;
}

/** Current locale from Astro.currentLocale, falling back to the default. */
export function getLang(currentLocale: string | undefined): Lang {
  return isLang(currentLocale) ? currentLocale : defaultLang;
}

/** Returns t(key) for the given locale, falling back to the default locale's string. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    const strings: Partial<Record<UIKey, string>> = ui[lang];
    return strings[key] ?? ui[defaultLang][key];
  };
}

/** Prefixes a path with the locale, except for the default locale (`/projects/x` → `/sr/projects/x`). */
export function localizePath(lang: Lang, path: string): string {
  return lang === defaultLang ? path : `/${lang}${path}`;
}
