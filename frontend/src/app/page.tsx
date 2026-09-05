"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import DomainSelector from "@/components/DomainSelector";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import SuggestionsGrid from "@/components/SuggestionsGrid";
import AuthModal, { UserProfile, UserRole } from "@/components/AuthModal";
import ChatHistoryDrawer, { ChatSession } from "@/components/ChatHistoryDrawer";
import CompareModeModal from "@/components/CompareModeModal";
import { sendChatMessage } from "@/lib/api";
import { Message, DomainType, LanguageCode } from "@/types";
import { Scale, AlertCircle, BookOpen, Sparkles, SplitSquareVertical, MessageSquare, ShieldCheck } from "lucide-react";
import { getTranslation } from "@/lib/i18n";
import { DOMAIN_DATA } from "@/lib/domainData";

const DEFAULT_PROFILE: UserProfile = {
  name: "Dr. Rajesh Sharma",
  role: "vaidya",
  registrationNumber: "AYUSH-IN-9842",
  institution: "National Institute of Ayurveda",
  isLoggedIn: true,
};

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export default function ChatPage() {
  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // History & Compare Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Sessions State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");

  // Chat Parameters
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState<DomainType | "auto">("auto");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const isEmpty = messages.length === 0;

  // 1. Initial Load from LocalStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("ayurlex_user_profile");
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }

      const savedSessions = localStorage.getItem("ayurlex_chat_sessions");
      if (savedSessions) {
        const parsed: ChatSession[] = JSON.parse(savedSessions);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          setMessages(parsed[0].messages || []);
          setDomain(parsed[0].domain || "auto");
          return;
        }
      }

      // If no session exists, create a starter session
      const starterId = generateSessionId();
      const starterSession: ChatSession = {
        id: starterId,
        title: "Initial Statutory Consultation",
        domain: "auto",
        language: "en",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
      };
      setSessions([starterSession]);
      setActiveSessionId(starterId);
    } catch {
      // Fallback gracefully
    }
  }, []);

  // 2. Persist profile changes
  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem("ayurlex_user_profile", JSON.stringify(profile));
    } catch {}
  };

  // 3. Persist messages to active session in localStorage
  const updateCurrentSessionMessages = (newMsgs: Message[], updatedTitle?: string) => {
    setMessages(newMsgs);
    setSessions((prev) => {
      const updated = prev.map((s) => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            title: updatedTitle || (s.messages.length === 0 && newMsgs.length > 0 ? newMsgs[0].content.slice(0, 45) + "..." : s.title),
            updatedAt: Date.now(),
            messages: newMsgs,
          };
        }
        return s;
      });
      try {
        localStorage.setItem("ayurlex_chat_sessions", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 4. Create new chat session
  const handleNewSession = () => {
    const newId = generateSessionId();
    const newSession: ChatSession = {
      id: newId,
      title: `Legal Inquiry #${sessions.length + 1}`,
      domain,
      language,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newId);
    setMessages([]);
    setError(null);
    try {
      localStorage.setItem("ayurlex_chat_sessions", JSON.stringify(updated));
    } catch {}
  };

  // 5. Select past session
  const handleSelectSession = (id: string) => {
    const target = sessions.find((s) => s.id === id);
    if (target) {
      setActiveSessionId(target.id);
      setMessages(target.messages || []);
      setDomain(target.domain || "auto");
      setError(null);
    }
  };

  // 6. Delete session
  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    try {
      localStorage.setItem("ayurlex_chat_sessions", JSON.stringify(updated));
    } catch {}

    if (id === activeSessionId) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
        setMessages(updated[0].messages || []);
        setDomain(updated[0].domain || "auto");
      } else {
        handleNewSession();
      }
    }
  };

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle Send Message
  const handleSend = async (query: string) => {
    setError(null);
    const userMsg: Message = {
      id: `msg_${Date.now()}_u`,
      role: "user",
      content: query,
      timestamp: new Date(),
    };
    const nextMsgs = [...messages, userMsg];
    updateCurrentSessionMessages(nextMsgs);
    setLoading(true);

    try {
      const res = await sendChatMessage({
        query,
        domain: domain === "auto" ? undefined : domain,
        jurisdiction: "IN",
        language,
      });

      const assistantMsg: Message = {
        id: `msg_${Date.now()}_a`,
        role: "assistant",
        content: res.answer,
        cited_passages: res.cited_passages,
        latency_ms: res.total_latency_ms,
        timestamp: new Date(),
        blockchain_receipt: res.blockchain_receipt,
      };

      const finalMsgs = [...nextMsgs, assistantMsg];
      updateCurrentSessionMessages(finalMsgs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Statutory search service temporarily busy.");
    } finally {
      setLoading(false);
    }
  };

  const t = getTranslation(language);
  const langKey = (["en", "te", "hi", "ta"].includes(language) ? language : "en") as LanguageCode;
  const activeDomainInfo =
    DOMAIN_DATA[langKey]?.[domain] ||
    DOMAIN_DATA.en?.auto || {
      title: "All Domains",
      badge: "Official Legal Corpus",
      statutes: ["The Patents Act, 1970", "FSSAI Regulations, 2022", "Drugs & Cosmetics Act, 1940"],
      prompts: t.suggestions,
    };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with full triggers */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        sessionCount={sessions.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        userProfile={userProfile}
      />

      {/* Domain selector bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 sticky top-[53px] z-20 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <DomainSelector value={domain} onChange={setDomain} language={language} />

          <button
            onClick={() => setIsCompareOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shrink-0"
          >
            <SplitSquareVertical className="w-3 h-3 text-emerald-700" />
            <span>Compare Statutes</span>
          </button>
        </div>
      </div>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome screen */}
          {isEmpty && (
            <div className="flex flex-col items-center text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-orange-500 flex items-center justify-center shadow-lg">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1.5 max-w-xl">
                <h2 className="text-2xl font-bold text-gray-900">{t.title}</h2>
                <p className="text-sm text-gray-600">
                  {t.subtitle} —{" "}
                  <span className="text-green-700 font-semibold">
                    Zero-Hallucination Grounded AI
                  </span>{" "}
                  backed by 12 Official Gazette Corpora and SHA-256 Ledger Provenance.
                </p>
              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl text-left">
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-green-400 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                    <SplitSquareVertical className="w-4 h-4 text-emerald-700" />
                    <span>Statutory Compare</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Patent vs Trademark vs GI, Classical Drug vs Ayurveda Aahara matrices.
                  </p>
                </button>

                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-green-400 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>Role Verification</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Active as <strong className="text-gray-800">{userProfile.name}</strong> ({userProfile.role}).
                  </p>
                </button>

                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-green-400 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                    <MessageSquare className="w-4 h-4 text-purple-700" />
                    <span>Audit Consultations</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {sessions.length} recorded consultations ready for Markdown/JSON export.
                  </p>
                </button>
              </div>

              {/* Suggestions grid */}
              <div className="w-full">
                <SuggestionsGrid onSelect={handleSend} language={language} />
              </div>
            </div>
          )}

          {/* Messages list */}
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} language={language} />
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3 items-center text-gray-500 text-xs px-2 py-3 bg-white border border-gray-200 rounded-2xl shadow-2xs max-w-sm">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                <Scale className="w-3.5 h-3.5 text-green-700" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" />
                <span className="font-mono text-gray-600 ml-1">
                  Querying BGE-M3 & Verifying Gazette Citations...
                </span>
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 shadow-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input bar */}
      <footer className="bg-white border-t border-gray-200 p-4 sticky bottom-0 z-20">
        <div className="max-w-4xl mx-auto space-y-2">
          <ChatInput onSend={handleSend} loading={loading} placeholder={t.inputPlaceholder} />
          <p className="text-[11px] text-center text-gray-500">
            {t.legalDisclaimer} ·{" "}
            <span className="font-mono text-gray-600">AYURLEX V2.0 Enterprise</span>
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      <ChatHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
      />

      <CompareModeModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />
    </div>
  );
}
