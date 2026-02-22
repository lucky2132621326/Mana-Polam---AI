"use client"
import React, { createContext, useContext, useEffect, useState } from "react"

type Lang = "en" | "te"

const LanguageContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
}>({
  lang: "en",
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")

  useEffect(() => {
    const stored = localStorage.getItem("mp_lang") as Lang | null
    if (stored) setLang(stored)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("mp_lang", lang)
    } catch {}
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export function Trans({ en, te }: { en: React.ReactNode; te: React.ReactNode }) {
  const { lang } = useLanguage()
  return <>{lang === "te" ? te : en}</>
}

export function LanguageToggle() {
  const { lang, setLang } = useLanguage()
  return (
    <div className="flex items-center gap-2">
      <button
        aria-label="Toggle language"
        onClick={() => setLang(lang === "en" ? "te" : "en")}
        className="rounded-md bg-emerald-600 text-white px-3 py-1 text-sm font-medium hover:bg-emerald-700 transition"
      >
        {lang === "en" ? "Language" : "భాష"}
      </button>
    </div>
  )
}

export default LanguageProvider
