import { LanguageCode } from "@/types";
import { TranslationSchema } from "@/locales/types";
import { LOCALES, getTranslation as getTrans } from "@/locales";

export type TranslationStrings = TranslationSchema;

export const I18N = LOCALES;

export function getTranslation(lang: LanguageCode | string): TranslationSchema {
  return getTrans(lang);
}
