"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LanguageCode } from "@/types";
import { TranslationSchema } from "@/locales/types";
import { getTranslation } from "@/locales";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    try {
      const savedLang = (localStorage.getItem("ayurlex_language") ||
        localStorage.getItem("ip_sakti_lang")) as LanguageCode;
      if (savedLang && ["en", "te", "hi", "ja", "ta", "kn", "ml"].includes(savedLang)) {
        setLanguageState(savedLang);
      }
    } catch {}

    const handleStorageChange = () => {
      try {
        const updated = (localStorage.getItem("ayurlex_language") ||
          localStorage.getItem("ip_sakti_lang")) as LanguageCode;
        if (updated && ["en", "te", "hi", "ja", "ta", "kn", "ml"].includes(updated)) {
          setLanguageState(updated);
        }
      } catch {}
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem("ayurlex_language", newLang);
      localStorage.setItem("ip_sakti_lang", newLang);
      window.dispatchEvent(new Event("storage"));
    } catch {}
  };

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "en" as LanguageCode,
      setLanguage: () => {},
      t: getTranslation("en"),
    };
  }
  return context;
}
