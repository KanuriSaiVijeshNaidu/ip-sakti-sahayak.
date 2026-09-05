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
import {
  ShieldShaded,
  ExclamationCircleFill,
  ColumnsGap,
  ChatLeftTextFill,
  ShieldCheck,
  KeyFill,
  HouseDoorFill,
  Trash3Fill,
  PlusCircleFill,
  ArrowLeftCircleFill,
} from "react-bootstrap-icons";
import { getTranslation } from "@/lib/i18n";
import { DOMAIN_DATA } from "@/lib/domainData";

// Unauthenticated Guest Profile (Zero history before login)
const GUEST_PROFILE: UserProfile = {
  name: "Guest Citizen",
  email: "",
  role: "guest",
  isLoggedIn: false,
};

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

// User-specific storage key ensuring complete per-user isolation
function getUserStorageKey(profile: UserProfile): string {
  if (profile && profile.isLoggedIn && profile.email) {
    return `ayurlex_sessions_${profile.email.trim().toLowerCase()}`;
  }
  return "";
}

export default function ChatPage() {
  // User Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>(GUEST_PROFILE);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // History & Compare Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Sessions State (Zero default history before login)
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

  // Helper to load sessions for a specific profile (Zero default history for guests!)
  const loadSessionsForProfile = (profile: UserProfile) => {
    if (!profile || !profile.isLoggedIn || !profile.email) {
      // Rule: DO NOT make any default history before login!
      setSessions([]);
      setActiveSessionId("");
      setMessages([]);
      return;
    }

    try {
      const key = getUserStorageKey(profile);
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          setMessages(parsed[0].messages || []);
          setDomain(parsed[0].domain || "auto");
          return;
        }
      }

      // If logged in but no past history, start with empty list
      setSessions([]);
      setActiveSessionId("");
      setMessages([]);
    } catch {
      setSessions([]);
      setMessages([]);
    }
  };

  // 1. Initial Load: Check profile & load that user's private sessions
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("ayurlex_user_profile");
      if (savedProfile) {
        const parsedProfile: UserProfile = JSON.parse(savedProfile);
        if (parsedProfile && parsedProfile.isLoggedIn) {
          setUserProfile(parsedProfile);
          loadSessionsForProfile(parsedProfile);
          return;
        }
      }
      // Strictly guest mode with zero default history
      setUserProfile(GUEST_PROFILE);
      loadSessionsForProfile(GUEST_PROFILE);
    } catch {
      setUserProfile(GUEST_PROFILE);
      loadSessionsForProfile(GUEST_PROFILE);
    }
  }, []);

  // 2. Persist profile changes upon successful OTP login
  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem("ayurlex_user_profile", JSON.stringify(profile));
    } catch {}
    loadSessionsForProfile(profile);
  };

  // 3. Reliable Sign Out Handler
  const handleLogout = () => {
    try {
      localStorage.removeItem("ayurlex_user_profile");
    } catch {}
    setUserProfile(GUEST_PROFILE);
    loadSessionsForProfile(GUEST_PROFILE);
  };

  // 4. Return to Home Screen
  const handleGoHome = () => {
    setMessages([]);
    setError(null);
  };

  // 5. Clear All History for the active user
  const handleClearAllSessions = () => {
    const key = getUserStorageKey(userProfile);
    if (key) {
      try {
        localStorage.removeItem(key);
      } catch {}
    }
    setSessions([]);
    setActiveSessionId("");
    setMessages([]);
  };

  // 6. Persist messages to active user's storage key (only when logged in)
  const updateCurrentSessionMessages = (newMsgs: Message[], updatedTitle?: string) => {
    setMessages(newMsgs);

    if (!userProfile.isLoggedIn) {
      // Guest mode chats are transient and not saved into history
      return;
    }

    setSessions((prev) => {
      let updated: ChatSession[];
      const existing = prev.find((s) => s.id === activeSessionId);

      if (existing) {
        updated = prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              title:
                updatedTitle ||
                (s.messages.length === 0 && newMsgs.length > 0
                  ? newMsgs[0].content.slice(0, 45) + "..."
                  : s.title),
              updatedAt: Date.now(),
              messages: newMsgs,
            };
          }
          return s;
        });
      } else {
        // Create new session entry for this logged in user
        const newSessionId = activeSessionId || generateSessionId();
        setActiveSessionId(newSessionId);
        const newSession: ChatSession = {
          id: newSessionId,
          title: newMsgs[0]?.content.slice(0, 45) + "..." || "Legal Consultation",
          domain,
          language,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: newMsgs,
        };
        updated = [newSession, ...prev];
      }

      try {
        const key = getUserStorageKey(userProfile);
        if (key) localStorage.setItem(key, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // 7. Create new chat session for active user
  const handleNewSession = () => {
    const newId = generateSessionId();
    setActiveSessionId(newId);
    setMessages([]);
    setError(null);

    if (userProfile.isLoggedIn) {
      const newSession: ChatSession = {
        id: newId,
        title: `Consultation #${sessions.length + 1}`,
        domain,
        language,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [],
      };
      const updated = [newSession, ...sessions];
      setSessions(updated);
      try {
        const key = getUserStorageKey(userProfile);
        if (key) localStorage.setItem(key, JSON.stringify(updated));
      } catch {}
    }
  };

  // 8. Select session
  const handleSelectSession = (id: string) => {
    const target = sessions.find((s) => s.id === id);
    if (target) {
      setActiveSessionId(target.id);
      setMessages(target.messages || []);
      setDomain(target.domain || "auto");
      setError(null);
    }
  };

  // 9. Delete individual session
  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    try {
      const key = getUserStorageKey(userProfile);
      if (key) localStorage.setItem(key, JSON.stringify(updated));
    } catch {}

    if (id === activeSessionId) {
      if (updated.length > 0) {
        setActiveSessionId(updated[0].id);
        setMessages(updated[0].messages || []);
        setDomain(updated[0].domain || "auto");
      } else {
        handleGoHome();
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with Home, Triggers & Logout */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        sessionCount={sessions.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        userProfile={userProfile}
        onLogout={handleLogout}
        onGoHome={handleGoHome}
      />

      {/* Domain selector bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-2 sticky top-[53px] z-20 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <DomainSelector value={domain} onChange={setDomain} language={language} />

          <button
            onClick={() => setIsCompareOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shrink-0"
          >
            <ColumnsGap className="w-3 h-3 text-emerald-700" />
            <span>Compare Statutes</span>
          </button>
        </div>
      </div>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Active Consultation Navigation Toolbar (When chatting) */}
          {!isEmpty && (
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs shadow-2xs">
              <button
                onClick={handleGoHome}
                className="flex items-center gap-1.5 font-bold text-gray-700 hover:text-green-800 transition-colors"
                title="Return to Welcome Screen"
              >
                <HouseDoorFill className="w-3.5 h-3.5 text-green-700" />
                <span>← Return to Home Screen</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleNewSession}
                  className="px-2.5 py-1 text-[11px] font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1"
                  title="Start a fresh question"
                >
                  <PlusCircleFill className="w-3 h-3 text-gray-500" />
                  <span>New Chat</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm("Delete and clear this active conversation?")) {
                      if (activeSessionId) {
                        handleDeleteSession(activeSessionId);
                      } else {
                        handleGoHome();
                      }
                    }
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors flex items-center gap-1"
                  title="Delete this conversation"
                >
                  <Trash3Fill className="w-3 h-3" />
                  <span>Delete Chat</span>
                </button>
              </div>
            </div>
          )}

          {/* Welcome screen */}
          {isEmpty && (
            <div className="flex flex-col items-center text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-orange-500 flex items-center justify-center shadow-lg">
                <ShieldShaded className="w-8 h-8 text-white" />
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

              {/* User Account / Data Isolation Status Banner */}
              <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="flex items-center gap-2.5 text-left">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 font-bold ${
                      userProfile.isLoggedIn ? "bg-emerald-700" : "bg-gray-400"
                    }`}
                  >
                    {userProfile.isLoggedIn ? userProfile.name[0]?.toUpperCase() : "G"}
                  </div>
                  <div>
                    {userProfile.isLoggedIn ? (
                      <>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-gray-900">{userProfile.name}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.2 rounded uppercase font-bold">
                            {userProfile.role}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-500 font-mono">
                          Vault: {userProfile.email} (Strictly Isolated)
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-gray-800">Guest Mode (No History Stored)</span>
                        <p className="text-[11px] text-gray-500">
                          Sign in with your email & OTP to save private consultations and verify credentials.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  {userProfile.isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsAuthOpen(true)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-green-700 hover:bg-green-800 rounded-lg shadow-xs transition-all flex items-center gap-1"
                    >
                      <KeyFill className="w-3.5 h-3.5" />
                      Sign In with OTP
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl text-left">
                <button
                  onClick={() => setIsCompareOpen(true)}
                  className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-green-400 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                    <ColumnsGap className="w-4 h-4 text-emerald-700" />
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
                    <span>Email & OTP Access</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {userProfile.isLoggedIn
                      ? `Active: ${userProfile.email}`
                      : "Instant 6-digit OTP to your Gmail."}
                  </p>
                </button>

                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-green-400 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1">
                    <ChatLeftTextFill className="w-4 h-4 text-purple-700" />
                    <span>Private Consultations</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {userProfile.isLoggedIn
                      ? `${sessions.length} consultations in vault.`
                      : "Sign in to save and manage history."}
                  </p>
                </button>
              </div>

              {/* Suggestions grid */}
              <div className="w-full">
                <SuggestionsGrid onSelect={handleSend} language={language} domain={domain} />
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
                <ShieldShaded className="w-3.5 h-3.5 text-green-700" />
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
              <ExclamationCircleFill className="w-4 h-4 shrink-0" />
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
        onLogout={handleLogout}
      />

      <ChatHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onClearAllSessions={handleClearAllSessions}
        isLoggedIn={userProfile.isLoggedIn}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <CompareModeModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />
    </div>
  );
}
