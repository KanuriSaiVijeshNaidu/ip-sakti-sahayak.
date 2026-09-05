"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import DomainSelector from "@/components/DomainSelector";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import SuggestionsGrid from "@/components/SuggestionsGrid";
import { sendChatMessage } from "@/lib/api";
import { Message, DomainType, LanguageCode } from "@/types";
import { Scale, AlertCircle, BookOpen, Sparkles } from "lucide-react";
import { getTranslation } from "@/lib/i18n";
import { DOMAIN_DATA } from "@/lib/domainData";

let msgIdCounter = 0;
const newId = () => String(++msgIdCounter);

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState<DomainType | "auto">("auto");
  const [language, setLanguage] = useState<import("@/types").LanguageCode>("en");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isEmpty = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (query: string) => {
    setError(null);
    const userMsg: Message = {
      id: newId(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await sendChatMessage({
        query,
        domain: domain === "auto" ? undefined : domain,
        jurisdiction: "IN",
        language,
      });

      const assistantMsg: Message = {
        id: newId(),
        role: "assistant",
        content: res.answer,
        cited_passages: res.cited_passages,
        latency_ms: res.total_latency_ms,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const t = getTranslation(language);
  const langKey = (["en", "te", "hi", "ta"].includes(language) ? language : "en") as LanguageCode;
  const activeDomainInfo: import("@/lib/domainData").DomainInfo = 
    DOMAIN_DATA[langKey]?.[domain] || 
    DOMAIN_DATA.en?.auto || {
      title: "All Domains",
      badge: "Official Legal Corpus",
      statutes: ["The Patents Act, 1970", "FSSAI Regulations, 2022", "Drugs & Cosmetics Act, 1940"],
      prompts: t.suggestions
    };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header language={language} onLanguageChange={setLanguage} />

      {/* Domain selector bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <DomainSelector value={domain} onChange={setDomain} language={language} />
        </div>
      </div>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome screen */}
          {isEmpty && (
            <div className="flex flex-col items-center text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-orange-500 flex items-center justify-center shadow-lg">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t.title}
                </h2>
                <p className="text-gray-500 max-w-md">
                  {t.welcomeDesc}
                </p>
              </div>

              {/* Active Domain Knowledge Card */}
              <div className="w-full max-w-2xl bg-white border border-green-200 rounded-2xl p-4 text-left shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-900 text-sm">{activeDomainInfo.title}</span>
                  </div>
                  <span className="bg-green-100 text-green-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                    {activeDomainInfo.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Verified Statutory Corpus Active:
                  </p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {activeDomainInfo.statutes.map((st, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-1.5">
                        <span className="text-green-600 font-bold">•</span>
                        <span>{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center gap-1 text-[11px] text-gray-500">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Click any starter prompt below or type your custom legal question:</span>
                </div>
              </div>

              {/* Domain Specific Prompts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-2xl w-full mx-auto">
                {activeDomainInfo.prompts.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(s.text)}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-200 bg-white hover:border-green-400 hover:bg-green-50 text-left text-sm text-gray-800 transition-all group shadow-2xs"
                  >
                    <span className="text-xl mt-0.5 group-hover:scale-110 transition-transform">{s.emoji}</span>
                    <span className="leading-snug font-medium">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} language={language} />
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-orange-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                  </span>
                  {t.searchingCorpus}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input bar — sticky at bottom */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto space-y-2">
          <ChatInput onSend={handleSend} loading={loading} placeholder={t.inputPlaceholder} />
          <p className="text-center text-xs text-gray-400">
            {t.legalDisclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
