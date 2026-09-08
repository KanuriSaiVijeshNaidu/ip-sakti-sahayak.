import { LanguageCode } from "@/types";
import { TranslationSchema } from "./types";
import { en } from "./en";
import { te } from "./te";
import { hi } from "./hi";
import { ja } from "./ja";

export * from "./types";

export const LOCALES: Record<string, TranslationSchema> = {
  en,
  te,
  hi,
  ja,
};

export function getTranslation(lang: LanguageCode | string): TranslationSchema {
  const code = (lang || "en").toLowerCase();
  return LOCALES[code] || LOCALES.en;
}
