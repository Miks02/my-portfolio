import {
  defaultLang,
  defaultStrings,
  languages,
  ui,
  type Lang,
  type UIKey,
} from "./ui";

function isLang(value: string | undefined): value is Lang {
  return value !== undefined && value in languages;
}

/** Current locale from Astro.currentLocale, falling back to the default. */
export function getLang(currentLocale: string | undefined): Lang {
  return isLang(currentLocale) ? currentLocale : defaultLang;
}

/** Returns t(key) for the given locale, falling back to the default locale's string. */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? defaultStrings[key];
  };
}

/** Prefixes a path with the locale, except for the default locale (`/projects/x` → `/sr/projects/x`). */
export function localizePath(lang: Lang, path: string): string {
  return lang === defaultLang ? path : `/${lang}${path}`;
}

/**
 * The same page in another language, for the language switcher and hreflang links.
 * `/sr/projects/x/` → `/projects/x/` (en), `/` → `/sr/` (sr).
 */
export function getAlternatePath(pathname: string, targetLang: Lang): string {
  // pathname "/sr/projects/x/" splits into ["", "sr", "projects", "x", ""].
  const parts = pathname.split("/");
  const first = parts[1];
  const hasLocalePrefix = first !== defaultLang && isLang(first);
  const pathWithoutLocale = hasLocalePrefix
    ? `/${parts.slice(2).join("/")}`
    : pathname;
  return localizePath(targetLang, pathWithoutLocale);
}
