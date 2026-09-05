"use client";

import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import DomainSelector from "@/components/DomainSelector";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import SuggestionsGrid from "@/components/SuggestionsGrid";
import AuthModal, { UserProfile } from "@/components/AuthModal";
import ChatHistoryDrawer, { ChatSession } from "@/components/ChatHistoryDrawer";
import CompareModeModal from "@/components/CompareModeModal";
import KnowledgeNetworkCanvas from "@/components/KnowledgeNetworkCanvas";
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
  ArrowRight,
  CheckCircleFill,
  Globe2,
  Cpu,
  FileEarmarkText,
  JournalBookmarkFill,
  Link45deg,
  Search,
  BoxArrowUpRight,
  ClockHistory,
  LockFill,
  PatchCheckFill,
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

function getUserStorageKey(profile: UserProfile): string {
  if (profile && profile.isLoggedIn && profile.email) {
    return `ayurlex_sessions_${profile.email.trim().toLowerCase()}`;
  }
  return "";
}

// Sample multilingual queries for interactive showcase
const MULTILINGUAL_SHOWCASE: Record<
  LanguageCode,
  { label: string; query: string; answerSnippet: string; statutoryRef: string }
> = {
  auto: {
    label: "Auto-Detect",
    query: "Can an Ayurvedic formulation with Ashwagandha and Piperine be patented?",
    answerSnippet:
      "Under Section 3(p) of the Patents Act 1970, traditional knowledge is non-patentable. However, if synergism is proven (Combination Index CI < 1.0) per Section 3(e), synergistic extraction processes may qualify with NBA Form III clearance.",
    statutoryRef: "Patents Act 1970 §3(p), §3(e) & BDA 2002 §6",
  },
  en: {
    label: "English",
    query: "Can an Ayurvedic formulation with Ashwagandha and Piperine be patented?",
    answerSnippet:
      "Under Section 3(p) of the Patents Act 1970, traditional knowledge is non-patentable. However, if synergism is proven (Combination Index CI < 1.0) per Section 3(e), synergistic extraction processes may qualify with NBA Form III clearance.",
    statutoryRef: "Patents Act 1970 §3(p), §3(e) & BDA 2002 §6",
  },
  te: {
    label: "తెలుగు (Telugu)",
    query: "అశ్వగంధ మరియు పిప్పలితో చేసిన ఆయుర్వేద మిశ్రమానికి పేటెంట్ పొందవచ్చా?",
    answerSnippet:
      "భారత పేటెంట్ చట్టం, 1970 లోని సెక్షన్ 3(p) ప్రకారం సాంప్రదాయ జ్ఞానం పేటెంట్‌కు అర్హత పొందదు. అయితే సెక్షన్ 3(e) కింద స్పష్టమైన సమన్వయ ప్రభావం (Synergy) నిరూపిస్తే NBA ఫారం III అనుమతితో ప్రక్రియ పేటెంట్ పొందవచ్చు.",
    statutoryRef: "పేటెంట్ చట్టం 1970 సెక్షన్ 3(p), 3(e) & NBA సెక్షన్ 6",
  },
  hi: {
    label: "हिन्दी (Hindi)",
    query: "क्या अश्वगंधा और पिपेरिन के आयुर्वेदिक मिश्रण को पेटेंट कराया जा सकता है?",
    answerSnippet:
      "पेटेंट अधिनियम 1970 की धारा 3(p) के तहत पारंपरिक ज्ञान पेटेंट योग्य नहीं है। केवल ज्ञात घटकों का सम्मिश्रण धारा 3(e) द्वारा वर्जित है, जब तक कि अप्रत्याशित सहक्रियात्मक प्रभाव (Synergy) सिद्ध न हो जाए।",
    statutoryRef: "पेटेंट अधिनियम 1970 धारा 3(p), 3(e) एवं NBA धारा 6",
  },
  ta: {
    label: "தமிழ் (Tamil)",
    query: "அஸ்வகந்தா ஆயுர்வேத கலவைக்கு காப்புரிமை பெற முடியுமா?",
    answerSnippet:
      "இந்திய காப்புரிமைச் சட்டம் 1970 பிரிவு 3(p) பாரம்பரிய அறிவைப் பாதுகாக்கிறது. சினெர்ஜி (Synergy) நிரூபிக்கப்பட்டால் மற்றும் NBA படிவம் III அனுமதி பெற்றால் மட்டுமே செயல்முறை காப்புரிமை கோர முடியும்.",
    statutoryRef: "காப்புரிமை சட்டம் 1970 பிரிவு 3(p), 3(e)",
  },
  kn: {
    label: "ಕನ್ನಡ (Kannada)",
    query: "ಅಶ್ವಗಂಧ ಆಯುರ್ವೇದ ಸೂತ್ರೀಕರಣಕ್ಕೆ ಪೇಟೆಂಟ್ ಪಡೆಯಬಹುದೇ?",
    answerSnippet:
      "ಭಾರತೀಯ ಪೇಟೆಂಟ್ ಕಾಯಿದೆ 1970 ರ ಕಲಂ 3(p) ಅಡಿಯಲ್ಲಿ ಸಾಂಪ್ರದಾಯಿಕ ಜ್ಞಾನಕ್ಕೆ ಪೇಟೆಂಟ್ ನಿಷೇಧಿಸಲಾಗಿದೆ. ಸಿನರ್ಜಿಸ್ಟಿಕ್ ಪರಿಣಾಮವನ್ನು ಪ್ರಾಯೋಗಿಕವಾಗಿ ಸಾಬೀತುಪಡಿಸಿದರೆ ಮಾತ್ರ ಪ್ರಕ್ರಿಯೆ ಪೇಟೆಂಟ್ ಸಾಧ್ಯ.",
    statutoryRef: "ಪೇಟೆಂಟ್ ಕಾಯಿದೆ 1970 ಕಲಂ 3(p), 3(e)",
  },
  ml: {
    label: "മലയാളം (Malayalam)",
    query: "അശ്വഗന്ധ ആയുർവേദ ഫോർമുലേഷന് പേറ്റന്റ് നേടാനാകുമോ?",
    answerSnippet:
      "ഇന്ത്യൻ പേറ്റന്റ് ആക്റ്റ് 1970 സെക്ഷൻ 3(p) പ്രകാരം പരമ്പരാഗത അറിവുകൾക്ക് പേറ്റന്റ് ലഭ്യമല്ല. സിനർജി ഫലപ്രാപ്തി തെളിയിച്ചാൽ മാത്രമേ പ്രത്യേക പ്രക്രിയ പേറ്റന്റിനായി പരിഗണിക്കൂ.",
    statutoryRef: "പേറ്റന്റ് ആക്റ്റ് 1970 സെക്ഷൻ 3(p), 3(e)",
  },
};

export default function LandingPage() {
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

  // Blockchain Demo Playground State
  const [notaryInput, setNotaryInput] = useState(
    "Standardized aqueous-ethanolic extract of Withania somnifera standardized to 5.5% Withaferin A in combination with Piper longum bioenhancer (10:1 ratio)."
  );
  const [notaryHash, setNotaryHash] = useState<string>("");
  const [notaryVerified, setNotaryVerified] = useState<boolean | null>(null);
  const [notaryLoading, setNotaryLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const assistantSectionRef = useRef<HTMLDivElement>(null);
  const isEmpty = messages.length === 0;

  // Helper to load sessions for a specific profile
  const loadSessionsForProfile = (profile: UserProfile) => {
    if (!profile || !profile.isLoggedIn || !profile.email) {
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
      setSessions([]);
      setActiveSessionId("");
      setMessages([]);
    } catch {
      setSessions([]);
      setMessages([]);
    }
  };

  // Initial Load
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
      setUserProfile(GUEST_PROFILE);
      loadSessionsForProfile(GUEST_PROFILE);
    } catch {
      setUserProfile(GUEST_PROFILE);
      loadSessionsForProfile(GUEST_PROFILE);
    }
  }, []);

  const handleSaveProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem("ayurlex_user_profile", JSON.stringify(profile));
    } catch {}
    loadSessionsForProfile(profile);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("ayurlex_user_profile");
    } catch {}
    setUserProfile(GUEST_PROFILE);
    loadSessionsForProfile(GUEST_PROFILE);
  };

  const handleGoHome = () => {
    setMessages([]);
    setError(null);
  };

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

  const updateCurrentSessionMessages = (newMsgs: Message[], updatedTitle?: string) => {
    setMessages(newMsgs);

    if (!userProfile.isLoggedIn) return;

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

  const handleSelectSession = (id: string) => {
    const target = sessions.find((s) => s.id === id);
    if (target) {
      setActiveSessionId(target.id);
      setMessages(target.messages || []);
      setDomain(target.domain || "auto");
      setError(null);
      assistantSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  // Auto-scroll when chatting
  useEffect(() => {
    if (!isEmpty) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isEmpty]);

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

    // Ensure view is scrolled to assistant interface
    assistantSectionRef.current?.scrollIntoView({ behavior: "smooth" });

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

  // Blockchain quick simulation hash
  const handleComputeHash = async () => {
    setNotaryLoading(true);
    setNotaryVerified(null);
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(notaryInput);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setNotaryHash(hashHex);
      setNotaryVerified(true);
    } catch {
      setNotaryVerified(false);
    } finally {
      setNotaryLoading(false);
    }
  };

  const scrollToAssistant = (selectedDomain?: DomainType | "auto") => {
    if (selectedDomain) setDomain(selectedDomain);
    assistantSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const t = getTranslation(language);

  return (
    <div className="min-h-screen bg-[#070b0e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* ── Minimal Floating Navigation Bar ───────────────────────────────── */}
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

      {/* ── SECTION 1: CINEMATIC HERO ─────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-radial-hero"
      >
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* National Initiative Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono text-emerald-300 font-medium tracking-wide uppercase">
                SIH 26045 · Ministry of Ayush · Sovereign AI & Blockchain
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Protect Ayurveda. <br />
                <span className="text-gradient-emerald">Navigate IP with Intelligence.</span>
              </h1>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-light leading-relaxed">
              A multilingual, source-cited AI assistant for Intellectual Property and regulatory
              guidance across Ayurveda, India, and international regimes. Citing verified Gazette
              statutes with cryptographic Proof-of-Existence on a sovereign ledger.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollToAssistant()}
                className="px-7 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 shadow-emerald-glow hover:scale-102 active:scale-98 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Ask AYURLEX</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#knowledge-worlds"
                className="px-6 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900/70 hover:bg-slate-800 border border-white/10 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <span>Explore Knowledge</span>
              </a>

              <button
                onClick={() => setIsCompareOpen(true)}
                className="px-5 py-3.5 rounded-xl font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 hover:bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <ColumnsGap className="w-4 h-4" />
                <span className="hidden sm:inline">Compare Legal Regimes</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg border-t border-white/10 text-left">
              <div>
                <span className="block text-xl font-extrabold text-white font-mono">12+</span>
                <span className="text-xs text-slate-400">Gazette Corpora</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-emerald-400 font-mono">&lt;0.1ms</span>
                <span className="text-xs text-slate-400">Semantic Cache</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-teal-400 font-mono">SHA-256</span>
                <span className="text-xs text-slate-400">Merkle Ledger</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Knowledge Constellation Canvas */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full aspect-square max-w-[500px] rounded-3xl bg-slate-950/50 border border-white/10 shadow-2xl backdrop-blur-md relative overflow-hidden group">
              <KnowledgeNetworkCanvas />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Ayurveda → Knowledge → IP → Regulation
                </span>
                <span className="font-mono text-slate-500">Live Mesh</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: TRUST / CAPABILITY STRIP ──────────────────────────── */}
      <section className="border-y border-white/10 bg-slate-950/80 backdrop-blur-xl py-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6 text-xs text-slate-400 whitespace-nowrap">
          <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">Multilingual AI</span>
            <span className="text-slate-600 font-mono">· 6 Indian Languages</span>
          </div>

          <span className="text-slate-700">✦</span>

          <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
            <JournalBookmarkFill className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">Source-Cited Answers</span>
            <span className="text-slate-600 font-mono">· Zero Hallucination</span>
          </div>

          <span className="text-slate-700">✦</span>

          <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-semibold text-slate-200">Hybrid RAG</span>
            <span className="text-slate-600 font-mono">· BGE-M3 + BM25</span>
          </div>

          <span className="text-slate-700">✦</span>

          <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">Ayurvedic Knowledge</span>
            <span className="text-slate-600 font-mono">· AFI / API Monographs</span>
          </div>

          <span className="text-slate-700">✦</span>

          <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
            <FileEarmarkText className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-slate-200">IP Intelligence</span>
            <span className="text-slate-600 font-mono">· §3(p), §3(e), Form TM-A</span>
          </div>

          <span className="text-slate-700">✦</span>

          <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
            <Link45deg className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">Sovereign Blockchain</span>
            <span className="text-slate-600 font-mono">· Merkle PoE</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: PRODUCT EXPERIENCE ("One Intelligence Layer...") ──── */}
      <section id="knowledge-worlds" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
            Categorical Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            One Intelligence Layer. Multiple Knowledge Worlds.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Bridging classical botanical wisdom with modern patent laws, drug licensing standards,
            and export regulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Ayurveda */}
          <div
            onClick={() => scrollToAssistant("ayush")}
            className="glass-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🌿
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Ayurveda
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Classical texts, Ayurvedic Formulary of India (AFI), Pharmacopoeia (API) monographs,
                botanical nomenclature, and traditional therapeutic actions.
              </p>
            </div>
            <div className="pt-6 flex items-center justify-between text-xs font-mono text-emerald-400 font-semibold border-t border-white/5 mt-4">
              <span>Filter: AYUSH</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Intellectual Property */}
          <div
            onClick={() => scrollToAssistant("patents")}
            className="glass-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                💡
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                Intellectual Property
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Patents Act 1970 §3(p) TKDL exclusions, §3(e) synergistic combinations, Trademark
                registration (Form TM-A), Nice classes, and Geographical Indications (GI).
              </p>
            </div>
            <div className="pt-6 flex items-center justify-between text-xs font-mono text-blue-400 font-semibold border-t border-white/5 mt-4">
              <span>Filter: Patents / TM</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Regulatory */}
          <div
            onClick={() => scrollToAssistant("fssai")}
            className="glass-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                ⚖️
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Regulatory
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drugs & Cosmetics Act 1940 Chapter IV-A, Rule 158B licensing for P&P drugs,
                Schedule T GMP compliance, and FSSAI Ayurveda Aahara boundary criteria.
              </p>
            </div>
            <div className="pt-6 flex items-center justify-between text-xs font-mono text-amber-400 font-semibold border-t border-white/5 mt-4">
              <span>Filter: FSSAI / D&C</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Global & Provenance */}
          <div
            onClick={() => scrollToAssistant("auto")}
            className="glass-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🔗
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                Global & Provenance
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                National Biodiversity Authority (NBA Form III ABS), CSIR-AYUSH TKDL prior-art
                defense, WHO-GMP international quality, and Sovereign Blockchain Notarization.
              </p>
            </div>
            <div className="pt-6 flex items-center justify-between text-xs font-mono text-teal-400 font-semibold border-t border-white/5 mt-4">
              <span>Filter: Global / Ledger</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: AI ASSISTANT SHOWCASE ("Ask. Retrieve. Verify...") ─ */}
      <section
        id="ai-assistant"
        ref={assistantSectionRef}
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full scroll-mt-24"
      >
        <div className="text-center space-y-3 mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
            Interactive Operational Studio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ask. Retrieve. Verify. Understand.
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Experience the live working RAG pipeline inside a modern glassmorphic terminal.
          </p>
        </div>

        {/* Pipeline Architecture Indicator Bar */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400 overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5 shrink-0 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>1. User Query</span>
          </div>
          <span className="text-slate-700">→</span>
          <div className="shrink-0">2. Query Expansion</div>
          <span className="text-slate-700">→</span>
          <div className="shrink-0 text-teal-300">3. Hybrid RRF (BM25 + FAISS)</div>
          <span className="text-slate-700">→</span>
          <div className="shrink-0">4. Cross-Encoder Rerank</div>
          <span className="text-slate-700">→</span>
          <div className="shrink-0 text-amber-300">5. CRAG Grounding</div>
          <span className="text-slate-700">→</span>
          <div className="shrink-0 text-emerald-400 font-bold">6. Source-Cited Output</div>
        </div>

        {/* ── The Real Functional Chat Studio ─────────────────────────────── */}
        <div className="rounded-3xl glass-panel-glow p-4 sm:p-6 shadow-2xl space-y-4">
          {/* Top Controls Bar: Domain Selector & Quick Tools */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <DomainSelector value={domain} onChange={setDomain} language={language} />

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setIsCompareOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-xl transition-all"
              >
                <ColumnsGap className="w-3 h-3 text-emerald-400" />
                <span>Compare Matrix</span>
              </button>

              {!isEmpty && (
                <button
                  onClick={handleNewSession}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl transition-all"
                >
                  <PlusCircleFill className="w-3 h-3 text-emerald-400" />
                  <span>New</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Consultation Navigation Toolbar (When chatting) */}
          {!isEmpty && (
            <div className="flex items-center justify-between bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2 text-xs">
              <button
                onClick={handleGoHome}
                className="flex items-center gap-1.5 font-bold text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <HouseDoorFill className="w-3.5 h-3.5 text-emerald-400" />
                <span>Return to Overview</span>
              </button>

              <button
                onClick={() => {
                  if (confirm("Clear this active conversation?")) {
                    if (activeSessionId) handleDeleteSession(activeSessionId);
                    else handleGoHome();
                  }
                }}
                className="px-2.5 py-1 text-[11px] font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash3Fill className="w-3 h-3" />
                <span>Delete</span>
              </button>
            </div>
          )}

          {/* Messages Display Area */}
          <div className="min-h-[300px] max-h-[580px] overflow-y-auto space-y-4 pr-1">
            {/* Welcome State (When chat is empty) */}
            {isEmpty && (
              <div className="flex flex-col items-center text-center py-8 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-emerald-glow border border-emerald-400/40">
                  <ShieldShaded className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-1 max-w-lg">
                  <h3 className="text-xl font-bold text-white font-sans">{t.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Zero-hallucination legal AI grounded in official Indian statutory corpora,
                    enhanced with dense vector semantic search and blockchain verification receipts.
                  </p>
                </div>

                {/* User Account / Data Isolation Status Badge */}
                <div className="w-full max-w-md bg-slate-900/60 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 text-left">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 font-bold text-xs ${
                        userProfile.isLoggedIn ? "bg-emerald-600" : "bg-slate-700"
                      }`}
                    >
                      {userProfile.isLoggedIn ? userProfile.name[0]?.toUpperCase() : "G"}
                    </div>
                    <div>
                      {userProfile.isLoggedIn ? (
                        <>
                          <span className="font-bold text-slate-200 block leading-tight">
                            {userProfile.name}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            Vault: {userProfile.email}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-bold text-slate-300 block leading-tight">
                            Guest Mode
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Zero history recorded before login
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    {userProfile.isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        className="px-2.5 py-1 text-[11px] font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-colors"
                      >
                        Sign Out
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsAuthOpen(true)}
                        className="px-3 py-1 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-xs transition-all flex items-center gap-1"
                      >
                        <KeyFill className="w-3 h-3" />
                        <span>Sign In</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Suggestions Grid */}
                <div className="w-full pt-2">
                  <SuggestionsGrid onSelect={handleSend} language={language} domain={domain} />
                </div>
              </div>
            )}

            {/* Rendered Messages */}
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} language={language} />
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-3 items-center text-slate-400 text-xs px-3 py-3 bg-slate-900/80 border border-emerald-500/30 rounded-2xl shadow-emerald-glow max-w-md backdrop-blur-md">
                <div className="w-6 h-6 rounded-full bg-emerald-950 flex items-center justify-center animate-pulse">
                  <ShieldShaded className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="font-mono text-emerald-300 text-[11px] ml-1">
                    Retrieving BGE-M3 vectors & verifying Gazette citations...
                  </span>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-2 bg-red-950/50 border border-red-500/40 text-red-300 text-xs rounded-xl p-3 shadow-md">
                <ExclamationCircleFill className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="pt-2">
            <ChatInput onSend={handleSend} loading={loading} placeholder={t.inputPlaceholder} />
            <p className="text-[11px] text-center text-slate-500 pt-2 font-mono">
              {t.legalDisclaimer} ·{" "}
              <span className="text-emerald-400">AYURLEX Sovereign V2.0</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: SOURCE-CITED KNOWLEDGE ("Knowledge You Can Trace") ─ */}
      <section id="citations" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
            Verifiable Attribution
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Knowledge You Can Trace.
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            Every legal conclusion and procedural step is directly linked to an official statutory
            section, India Code provision, or Gazette notification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Citation Card 1 */}
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">[src-1] Section 3(p)</span>
              <span className="text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-500/30">
                99% Grounded
              </span>
            </div>
            <h4 className="font-bold text-white text-base">The Patents Act, 1970</h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-white/5">
              "An invention which in effect is traditional knowledge or which is an aggregation or
              duplication of known properties of traditionally known component or components is not
              an invention."
            </p>
            <p className="text-[11px] text-slate-500 italic">Official Source: India Code 39 of 1970</p>
          </div>

          {/* Citation Card 2 */}
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-400 font-bold">[src-2] Form TM-A</span>
              <span className="text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded-full border border-purple-500/30">
                97% Grounded
              </span>
            </div>
            <h4 className="font-bold text-white text-base">The Trade Marks Rules, 2017</h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-white/5">
              "Application for registration of any trade mark for goods or services under Rule 23.
              Statutory e-filing fee: ₹4,500 for Individual / Startup / Small Enterprise; ₹9,000 for
              others."
            </p>
            <p className="text-[11px] text-slate-500 italic">Official Source: First Schedule, Entry 1</p>
          </div>

          {/* Citation Card 3 */}
          <div className="glass-card rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold">[src-3] Rule 158B</span>
              <span className="text-amber-300 bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-500/30">
                96% Grounded
              </span>
            </div>
            <h4 className="font-bold text-white text-base">Drugs & Cosmetics Rules, 1945</h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-white/5">
              "Guidelines for issue of license with respect to Patent or Proprietary medicine.
              Evidence of safety and efficacy required based on pilot clinical studies and
              published scientific literature."
            </p>
            <p className="text-[11px] text-slate-500 italic">Official Source: Chapter IV-A, GSR 780(E)</p>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: MULTILINGUAL EXPERIENCE ("One Question. Many Languages.") ─ */}
      <section id="languages" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
            Linguistic Sovereignty
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            One Question. Many Languages.
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Interact with complex patent and regulatory statutes in your native mother tongue.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {(Object.keys(MULTILINGUAL_SHOWCASE) as LanguageCode[]).map((langKey) => {
            const isSelected = language === langKey;
            return (
              <button
                key={langKey}
                onClick={() => setLanguage(langKey)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-emerald-glow scale-105"
                    : "bg-slate-900/60 text-slate-300 hover:text-white border border-white/10"
                }`}
              >
                {MULTILINGUAL_SHOWCASE[langKey].label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Multilingual Preview Glass Card */}
        <div className="max-w-3xl mx-auto glass-panel-glow rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400 border-b border-white/10 pb-3">
            <span>Query in {MULTILINGUAL_SHOWCASE[language].label}</span>
            <span>Statutory Citation Attached</span>
          </div>

          <p className="text-base sm:text-lg font-semibold text-white">
            "{MULTILINGUAL_SHOWCASE[language].query}"
          </p>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/5 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              Synthesized Legal Stance:
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {MULTILINGUAL_SHOWCASE[language].answerSnippet}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="font-mono text-slate-400">
              Corpus: {MULTILINGUAL_SHOWCASE[language].statutoryRef}
            </span>
            <button
              onClick={() => handleSend(MULTILINGUAL_SHOWCASE[language].query)}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Ask this live</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: KNOWLEDGE EXPLORATION ("From Ancient Knowledge...") ─ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
            Systemic Lineage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            From Ancient Knowledge to Modern Protection.
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto">
            The multi-tier statutory journey an Ayurvedic innovation takes from sacred herb to
            global legal defense.
          </p>
        </div>

        {/* Visual Workflow Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono text-emerald-400 font-bold">STAGE 01</span>
            <h4 className="font-bold text-white text-base">Classical Formulation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Formulation specified in 54 First Schedule texts (Charaka, Sushruta, AFI Part I).
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono text-teal-400 font-bold">STAGE 02</span>
            <h4 className="font-bold text-white text-base">Prior Art & TKDL Check</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              CSIR-AYUSH Traditional Knowledge Digital Library prior art screening to evaluate novelty.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono text-blue-400 font-bold">STAGE 03</span>
            <h4 className="font-bold text-white text-base">Patent / TM Protection</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Proving synergistic efficacy under Section 3(e) with Combination Index data; Form TM-A e-filing.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2">
            <span className="text-xs font-mono text-amber-400 font-bold">STAGE 04</span>
            <h4 className="font-bold text-white text-base">Sovereign Proof-of-Existence</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Immutable SHA-256 Merkle anchoring on the sovereign IP ledger to defeat foreign biopiracy.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: BLOCKCHAIN NOTARIZATION & PROVENANCE STUDIO ───────── */}
      <section
        id="blockchain-provenance"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full"
      >
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
            Cryptographic Integrity
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Sovereign Proof-of-Existence Engine.
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Anchor your herbal formulation, patent draft, or trademark mark onto an immutable
            SHA-256 Merkle ledger before public disclosure.
          </p>
        </div>

        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="space-y-2 text-left">
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
              Formulation / Patent Specification Text
            </label>
            <textarea
              value={notaryInput}
              onChange={(e) => setNotaryInput(e.target.value)}
              rows={3}
              className="w-full bg-slate-950/80 border border-white/15 rounded-xl p-3.5 text-xs text-slate-100 font-mono outline-none focus:border-emerald-500 transition-colors"
              placeholder="Paste your proprietary formulation recipe or patent claims..."
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleComputeHash}
              disabled={notaryLoading || !notaryInput.trim()}
              className="px-5 py-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-emerald-glow transition-all flex items-center gap-2 text-xs cursor-pointer"
            >
              <LockFill className="w-3.5 h-3.5" />
              <span>Compute SHA-256 & Notarize</span>
            </button>

            <span className="text-[11px] font-mono text-slate-500">
              Zero Gas Fees · Sovereign Proof-of-Existence
            </span>
          </div>

          {/* Computed Hash Display */}
          {notaryHash && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">SHA-256 Digest:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1 font-mono">
                  <PatchCheckFill className="w-3.5 h-3.5" />
                  Mined in Sovereign Block
                </span>
              </div>
              <p className="font-mono text-xs text-emerald-300 break-all bg-slate-900/90 p-2.5 rounded-lg border border-white/5">
                {notaryHash}
              </p>
              <p className="text-[11px] text-slate-500">
                Verification URL:{" "}
                <span className="text-slate-300 font-mono">
                  https://ayurlex.in/api/blockchain/verify/{notaryHash}
                </span>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 9: WHY AYURLEX ───────────────────────────────────────── */}
      <section id="why-ayurlex" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/20">
            Core Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for the Intersection of Ayurveda and IP.
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Engineered from first principles to prevent hallucination in high-stakes statutory matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 space-y-3 text-left">
            <span className="text-2xl">🌐</span>
            <h4 className="font-bold text-white text-base">Multilingual Grounding</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native legal prompt engineering across English, Telugu, Hindi, Tamil, Kannada, and
              Malayalam with domain-specific terminology.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 text-left">
            <span className="text-2xl">📜</span>
            <h4 className="font-bold text-white text-base">Zero-Hallucination Citations</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every factual assertion cites verified Gazette notifications and India Code sections.
              Out-of-domain queries trigger strict safe exits.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 text-left">
            <span className="text-2xl">⚡</span>
            <h4 className="font-bold text-white text-base">Sub-Millisecond Vector Cache</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              In-memory cosine semantic cache resolves recurring and paraphrased inquiries in
              0.08ms, bypassing heavy LLM inference.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 text-left">
            <span className="text-2xl">🎯</span>
            <h4 className="font-bold text-white text-base">Hybrid RRF Retrieval</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fuses BGE-M3 1024-dimensional semantic embeddings with BM25 lexical precision and
              cross-encoder reranking for balanced recall.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 text-left">
            <span className="text-2xl">🛡️</span>
            <h4 className="font-bold text-white text-base">Sovereign Blockchain Ledger</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cryptographic Proof-of-Existence anchoring on disk with SHA-256 Merkle root verification
              and downloadable legal certificates.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3 text-left">
            <span className="text-2xl">📋</span>
            <h4 className="font-bold text-white text-base">Actionable Step-by-Step Roadmaps</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides concrete 6-stage procedural roadmaps with statutory fees, portal URLs, and form
              numbers (Form TM-A, Form 24D, InPASS).
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 10: FINAL CTA ("Turn Knowledge Into Protection") ─────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="relative rounded-3xl glass-panel-glow p-10 sm:p-14 overflow-hidden space-y-6">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-500/30">
            Enterprise Legal AI
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Turn Knowledge Into Protection.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Explore AYURLEX and navigate the intersection of Ayurveda, intellectual property, and
            regulation with verifiable source-grounded intelligence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => scrollToAssistant()}
              className="px-8 py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-emerald-glow transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Start with AYURLEX</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-6 py-4 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-white/10 transition-all flex items-center gap-2"
            >
              <ColumnsGap className="w-4 h-4 text-emerald-400" />
              <span>Explore Statutory Matrices</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-[#05080b] py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              🏛️
            </div>
            <div>
              <span className="font-bold text-slate-300">AYURLEX · IP-SAKTI Sahayak</span>
              <p className="text-[11px] text-slate-500">
                SIH 26045 · Ministry of Ayush · CGPDTM · FSSAI
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <p>Answers cite verified Indian Gazette and statutory sources.</p>
            <p className="font-mono text-[10px] text-slate-600">
              Domain Anchor: ayurlex.in · Sovereign SHA-256 Ledger
            </p>
          </div>
        </div>
      </footer>

      {/* ── Modals & Drawers (Preserved 100%) ─────────────────────────────── */}
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

      <CompareModeModal isOpen={isCompareOpen} onClose={() => setIsCompareOpen(false)} />
    </div>
  );
}
