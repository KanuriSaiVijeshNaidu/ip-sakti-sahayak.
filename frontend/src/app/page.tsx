"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import DomainSelector from "@/components/DomainSelector";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import SuggestionsGrid from "@/components/SuggestionsGrid";
import AuthModal, { UserProfile, UserRole } from "@/components/AuthModal";
import ChatHistoryDrawer, { ChatSession } from "@/components/ChatHistoryDrawer";
import CompareModeModal from "@/components/CompareModeModal";
import LiveNatureWallpaper from "@/components/LiveNatureWallpaper";
import { sendChatMessage } from "@/lib/api";
import { Message, DomainType, LanguageCode, JurisdictionType } from "@/types";
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
  JournalBookmarkFill,
  Globe2,
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
  const router = useRouter();

  // User Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>(GUEST_PROFILE);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

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
  const [jurisdiction, setJurisdiction] = useState<JurisdictionType>("IN");

  const handleJurisdictionChange = (jur: JurisdictionType) => {
    setJurisdiction(jur);
    try {
      localStorage.setItem("ayurlex_jurisdiction", jur);
    } catch {}
  };
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

  // 1. Initial Load: Check profile & load that user's private sessions, or redirect to /login
  useEffect(() => {
    try {
      const savedJur = localStorage.getItem("ayurlex_jurisdiction") as JurisdictionType;
      if (savedJur && ["US", "IN", "EU", "DE", "WO"].includes(savedJur)) {
        setJurisdiction(savedJur);
      }

      const savedProfile = localStorage.getItem("ayurlex_user_profile");
      if (savedProfile) {
        const parsedProfile: UserProfile = JSON.parse(savedProfile);
        if (parsedProfile && parsedProfile.isLoggedIn) {
          setUserProfile(parsedProfile);
          loadSessionsForProfile(parsedProfile);
          setAuthChecked(true);
          return;
        }
      }
      // If not logged in, redirect to login page
      router.replace("/login");
    } catch {
      router.replace("/login");
    }
  }, [router]);

  // 2. Persist profile changes upon successful OTP login
  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem("ayurlex_user_profile", JSON.stringify(profile));
    } catch {}
    loadSessionsForProfile(profile);

    // Immediately sync to sovereign centralized admin user directory
    if (profile && profile.isLoggedIn && profile.email) {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          email: profile.email,
          name: profile.name,
          role: profile.role,
          institution: profile.institution,
          registrationNumber: profile.registrationNumber,
          device: isMobile ? "📱 Mobile (Phone)" : "💻 Desktop / Laptop",
        }),
      }).catch((err) => console.error("Error syncing user to central admin directory:", err));
    }
  };

  // 3. Reliable Sign Out Handler - Clears profile and returns to /login
  const handleLogout = () => {
    try {
      localStorage.removeItem("ayurlex_user_profile");
    } catch {}
    setUserProfile(GUEST_PROFILE);
    loadSessionsForProfile(GUEST_PROFILE);
    router.replace("/login");
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

        // Sync consultation session to centralized admin registry
        if (userProfile.isLoggedIn && userProfile.email) {
          fetch("/api/admin/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "sync_session",
              email: userProfile.email,
              sessions: updated,
            }),
          }).catch(() => {});
        }
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
        jurisdiction,
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
    <div className="min-h-screen flex flex-col bg-black text-white relative overflow-x-hidden">
      {/* Live Animated Motion Nature Wallpaper */}
      <LiveNatureWallpaper />

      {/* Header with Home & User Profile Controls */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        jurisdiction={jurisdiction}
        onJurisdictionChange={handleJurisdictionChange}
        sessionCount={sessions.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenCompare={() => {}}
        onOpenAuth={() => router.push("/login")}
        userProfile={userProfile}
        onLogout={handleLogout}
        onGoHome={handleGoHome}
      />

      {/* Domain selector bar */}
      <div className="bg-black/90 backdrop-blur-xl border-b border-zinc-800/80 px-3 sm:px-4 py-2 sticky top-[49px] sm:top-[57px] z-20 shadow-2xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex-1 overflow-x-auto no-scrollbar">
            <DomainSelector value={domain} onChange={setDomain} language={language} />
          </div>
        </div>
      </div>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5">
          {/* Active Consultation Navigation Toolbar (When chatting) */}
          {!isEmpty && (
            <div className="flex flex-wrap items-center justify-between bg-zinc-950/90 border border-zinc-800 rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs shadow-xl animate-entrance-1 gap-2">
              <button
                onClick={handleGoHome}
                className="flex items-center gap-1.5 font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Return to Welcome Screen"
              >
                <HouseDoorFill className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">← Return to Home Screen</span>
                <span className="sm:hidden">← Home</span>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Link
                  href="/location"
                  className="px-2.5 sm:px-3 py-1 text-[11px] font-bold text-white bg-zinc-900 border border-zinc-700 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  title="Change Active Jurisdiction"
                >
                  <span>{jurisdiction === "US" ? "🇺🇸" : jurisdiction === "IN" ? "🇮🇳" : jurisdiction === "EU" ? "🇪🇺" : jurisdiction === "DE" ? "🇩🇪" : "🌐"}</span>
                  <span className="hidden sm:inline">Market</span>
                </Link>

                <button
                  onClick={handleNewSession}
                  className="px-2.5 sm:px-3 py-1 text-[11px] font-semibold text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl transition-all flex items-center gap-1 btn-spring cursor-pointer shrink-0"
                  title="Start a fresh question"
                >
                  <PlusCircleFill className="w-3 h-3 text-zinc-400" />
                  <span className="hidden sm:inline">New Chat</span>
                  <span className="sm:hidden">New</span>
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
                  className="px-2.5 sm:px-3 py-1 text-[11px] font-semibold text-red-400 hover:bg-red-950/60 border border-red-900/60 rounded-xl transition-all flex items-center gap-1 btn-spring cursor-pointer shrink-0"
                  title="Delete this conversation"
                >
                  <Trash3Fill className="w-3 h-3" />
                  <span className="hidden sm:inline">Delete Chat</span>
                  <span className="sm:hidden">Delete</span>
                </button>
              </div>
            </div>
          )}

          {/* Welcome screen */}
          {isEmpty && (
            <div className="flex flex-col items-center text-center py-4 sm:py-6 space-y-4 sm:space-y-5">
              {/* Sleek Darkened Emblem */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-zinc-900 border border-zinc-700 p-3.5 sm:p-4 flex items-center justify-center shadow-2xl animate-entrance-1">
                <ShieldShaded className="w-9 h-9 sm:w-11 sm:h-11 text-white drop-shadow-md" />
              </div>

              {/* Minimal Active Jurisdiction Link Pill */}
              <div className="animate-entrance-1">
                <Link
                  href="/location"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 text-xs text-zinc-300 transition-all shadow-md group"
                  title="Tap to change active jurisdiction"
                >
                  <span className="text-base">
                    {jurisdiction === "US" ? "🇺🇸" : jurisdiction === "IN" ? "🇮🇳" : jurisdiction === "EU" ? "🇪🇺" : jurisdiction === "DE" ? "🇩🇪" : "🌐"}
                  </span>
                  <span className="font-bold text-white">
                    {jurisdiction === "US" ? "Active Market: United States (USPTO & FDA)" :
                     jurisdiction === "IN" ? "Active Market: India (CGPDTM & AYUSH)" :
                     jurisdiction === "EU" ? "Active Market: European Union (EPO & EMA)" :
                     jurisdiction === "DE" ? "Active Market: Germany (DPMA & BfArM)" :
                     "Active Market: International (WIPO PCT)"}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 group-hover:text-white">
                    Change Location →
                  </span>
                </Link>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5 max-w-2xl mx-auto animate-entrance-2 px-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {t.title}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {t.subtitle} —{" "}
                  <span className="text-white font-bold">
                    Zero-Hallucination Grounded AI
                  </span>{" "}
                  backed by 12 Official Gazette Corpora and SHA-256 Sovereign Audit Ledger.
                </p>
              </div>

              {/* Quick Action Cards (Mobile-friendly vertical stacking cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-4xl text-left animate-entrance-3">
                <Link
                  href="/profile"
                  className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md hover:border-zinc-600 hover:bg-zinc-900/90 card-motion flex flex-col justify-between group shadow-lg cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-1.5">
                    <div className="w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center shrink-0">
                      {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span>My Profile</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded font-bold ml-auto">
                      ACCOUNT
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    View Full Name, Verified Gmail, Position ({userProfile.role || "Citizen"}), and Account Vault.
                  </p>
                </Link>

                <Link
                  href="/location"
                  className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md hover:border-zinc-600 hover:bg-zinc-900/90 card-motion flex flex-col justify-between group shadow-lg cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-1.5">
                    <Globe2 className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-200" />
                    <span>Select Location</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded font-bold ml-auto">
                      MARKET
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    Switch between United States, India, European Union, Germany & Global PCT.
                  </p>
                </Link>

                <button
                  onClick={() => {
                    setDomain("patents");
                    handleSend("What are the Section 3(p) TKDL prior-art restrictions on Ayurvedic patents?");
                  }}
                  className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md hover:border-zinc-600 hover:bg-zinc-900/90 card-motion flex flex-col justify-between group shadow-lg cursor-pointer select-none text-left"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-1.5">
                    <JournalBookmarkFill className="w-4 h-4 text-zinc-300 group-hover:scale-110 transition-transform duration-200" />
                    <span>TKDL Search</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    300K+ formulations, Section 3(p) non-patentability & biological diversity checks.
                  </p>
                </button>

                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="p-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md hover:border-zinc-600 hover:bg-zinc-900/90 card-motion flex flex-col justify-between group shadow-lg cursor-pointer select-none text-left"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-white mb-1.5">
                    <ChatLeftTextFill className="w-4 h-4 text-zinc-300 group-hover:scale-110 transition-transform duration-200" />
                    <span>History</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    {sessions.length > 0
                      ? `${sessions.length} consultations saved in your isolated vault.`
                      : "Access verified citations, session transcripts & legal receipts."}
                  </p>
                </button>
              </div>

              {/* Suggestions grid */}
              <div className="w-full animate-entrance-5">
                <SuggestionsGrid onSelect={handleSend} language={language} domain={domain} jurisdiction={jurisdiction} />
              </div>
            </div>
          )}

          {/* Messages list */}
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} language={language} />
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3 items-center text-zinc-300 text-xs px-3 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl max-w-sm">
              <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center animate-pulse">
                <ShieldShaded className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                <span className="font-mono text-zinc-400 ml-1">
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
      <footer className="bg-gradient-to-t from-black via-black/90 to-transparent pt-2 pb-4 px-3 sm:px-4 sticky bottom-0 z-20">
        <div className="max-w-2xl mx-auto space-y-2">
          <ChatInput onSend={handleSend} loading={loading} placeholder={t.inputPlaceholder} />
          <p className="text-[11px] text-center text-zinc-500 font-medium select-none">
            {t.legalDisclaimer} ·{" "}
            <span className="font-mono text-zinc-400 font-semibold">AYURLEX V2.0 Enterprise</span>
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
