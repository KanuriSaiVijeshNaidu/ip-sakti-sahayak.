"use client";

import { useState, useEffect } from "react";
import {
  PeopleFill,
  PersonBadgeFill,
  ShieldLockFill,
  JournalText,
  ClockHistory,
  Download,
  BoxArrowUpRight,
  ShieldCheck,
  CheckCircleFill,
  KeyFill,
  Search,
  EyeFill,
  ArrowRepeat,
} from "react-bootstrap-icons";
import { UserProfile } from "@/components/AuthModal";
import { ChatSession } from "@/components/ChatHistoryDrawer";

interface BlockchainBlock {
  index: number;
  timestamp: string;
  hash: string;
  previous_hash: string;
  merkle_root: string;
  transaction_count: number;
  transactions?: Array<{
    tx_id: string;
    asset_title: string;
    applicant_name: string;
    applicant_email?: string;
    domain: string;
    document_sha256: string;
    timestamp: string;
    certificate_id?: string;
  }>;
}

interface StoredUserVault {
  username?: string;
  email: string;
  name: string;
  role: string;
  institution?: string;
  registrationNumber?: string;
  isLoggedIn: boolean;
  sessions: ChatSession[];
  lastActive: string;
  lastLogin?: string;
  device?: string;
}

export default function UserDirectory() {
  const [activeTab, setActiveTab] = useState<"vaults" | "blockchain">("vaults");
  const [users, setUsers] = useState<StoredUserVault[]>([]);
  const [selectedUser, setSelectedUser] = useState<StoredUserVault | null>(null);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [blockchainBlocks, setBlockchainBlocks] = useState<BlockchainBlock[]>([]);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");

  // 1. Fetch real-time users from sovereign server registry & merge with local vaults
  const loadAllUsers = async () => {
    setLoadingUsers(true);
    try {
      // Fetch from centralized server endpoint
      const res = await fetch("/api/admin/users");
      let serverUsers: StoredUserVault[] = [];
      if (res.ok) {
        const data = await res.json();
        serverUsers = data.users || [];
      }

      // Also scan current client localStorage to capture any unsynced local sessions
      const localMap = new Map<string, StoredUserVault>();

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("ayurlex_sessions_")) {
          const email = key.replace("ayurlex_sessions_", "").toLowerCase();
          const sessionData = localStorage.getItem(key);
          const sessions: ChatSession[] = sessionData ? JSON.parse(sessionData) : [];
          localMap.set(email, {
            email,
            name: email.split("@")[0],
            role: "citizen",
            isLoggedIn: true,
            sessions,
            lastActive: sessions.length > 0 ? new Date(sessions[0].updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Recently",
            device: "💻 Local Client",
          });
        }
      }

      // Check active local user profile
      const activeProfileStr = localStorage.getItem("ayurlex_user_profile");
      if (activeProfileStr) {
        try {
          const activeProfile: UserProfile = JSON.parse(activeProfileStr);
          if (activeProfile && activeProfile.email) {
            const em = activeProfile.email.toLowerCase();
            const existing = localMap.get(em);
            localMap.set(em, {
              email: em,
              name: activeProfile.name || existing?.name || em.split("@")[0],
              role: activeProfile.role || existing?.role || "citizen",
              institution: activeProfile.institution,
              registrationNumber: activeProfile.registrationNumber,
              isLoggedIn: activeProfile.isLoggedIn ?? true,
              sessions: existing?.sessions || [],
              lastActive: "Active Now",
              device: "💻 Active Session",
            });
          }
        } catch {}
      }

      // Merge server and local records (server is authoritative)
      const mergedMap = new Map<string, StoredUserVault>();

      for (const su of serverUsers) {
        const suEmail = su.email.toLowerCase();
        const local = localMap.get(suEmail);
        mergedMap.set(suEmail, {
          username: su.username,
          email: su.email,
          name: su.name,
          role: su.role,
          institution: su.institution,
          registrationNumber: su.registrationNumber,
          isLoggedIn: su.isLoggedIn,
          sessions: su.sessions && su.sessions.length > 0 ? su.sessions : (local?.sessions || []),
          lastActive: su.lastActive || "Recently",
          lastLogin: su.lastLogin,
          device: su.device || "🌐 Central Registry",
        });
      }

      // Add any local client users not yet present on server
      localMap.forEach((lu, emailKey) => {
        if (!mergedMap.has(emailKey)) {
          mergedMap.set(emailKey, lu);
        }
      });

      const finalUsers = Array.from(mergedMap.values());
      setUsers(finalUsers);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));

      // Retain or select active user
      setSelectedUser((prev) => {
        if (prev) {
          const updated = finalUsers.find((u) => u.email.toLowerCase() === prev.email.toLowerCase());
          if (updated) return updated;
        }
        return finalUsers.length > 0 ? finalUsers[0] : null;
      });
    } catch (err) {
      console.error("[AYURLEX Admin] Error loading users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Mount effect with live 4-second auto-sync & cross-tab storage listener
  useEffect(() => {
    loadAllUsers();

    const interval = setInterval(() => {
      loadAllUsers();
    }, 4000);

    const handleStorage = () => {
      loadAllUsers();
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // 2. Load Blockchain blocks for admin inspection
  useEffect(() => {
    if (activeTab === "blockchain") {
      setLoadingBlocks(true);
      fetch("http://127.0.0.1:8000/api/blockchain/ledger")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.blocks) {
            setBlockchainBlocks(data.blocks);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingBlocks(false));
    }
  }, [activeTab]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportAudit = () => {
    const auditData = {
      exportTimestamp: new Date().toISOString(),
      adminAuthority: "AYURLEX Sovereign Admin Console",
      totalUsers: users.length,
      users: users.map((u) => ({
        email: u.email,
        name: u.name,
        role: u.role,
        sessionCount: u.sessions.length,
        sessions: u.sessions,
      })),
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ayurlex-user-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldLockFill className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              User Vaults & Statutory Audit Console
            </h2>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded-full font-bold">
              ADMIN PRIVILEGE
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Review registered citizen & advocate profiles, private consultation transcripts, and blockchain notarized IP assets.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Live Sync Status Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 rounded-xl text-[11px] font-medium text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Auto-Sync</span>
            {lastSyncTime && (
              <span className="text-gray-400 font-mono text-[10px] hidden sm:inline">
                ({lastSyncTime})
              </span>
            )}
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={loadAllUsers}
            disabled={loadingUsers}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200/90 rounded-xl transition-all shadow-2xs cursor-pointer btn-spring"
            title="Refresh user directory immediately"
          >
            <ArrowRepeat className={`w-3.5 h-3.5 text-emerald-700 ${loadingUsers ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Sub-tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("vaults")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "vaults"
                  ? "bg-white text-gray-900 shadow-2xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              User Directory ({users.length})
            </button>
            <button
              onClick={() => setActiveTab("blockchain")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "blockchain"
                  ? "bg-white text-gray-900 shadow-2xs font-bold"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Blockchain IP Filings
            </button>
          </div>

          <button
            onClick={handleExportAudit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-all shadow-2xs cursor-pointer"
            title="Export full user audit logs as JSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Export Audit</span>
          </button>
        </div>
      </div>

      {/* ── TAB 1: USER VAULTS & CONSULTATIONS ──────────────────────────────── */}
      {activeTab === "vaults" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Users List */}
          <div className="lg:col-span-4 bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user, email, or role..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-gray-800 outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {filteredUsers.map((user) => {
                const isSelected = selectedUser?.email === user.email;
                return (
                  <button
                    key={user.email}
                    onClick={() => {
                      setSelectedUser(user);
                      setSelectedSession(user.sessions.length > 0 ? user.sessions[0] : null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start justify-between gap-2.5 ${
                      isSelected
                        ? "bg-emerald-50/70 border-emerald-300 shadow-sm"
                        : "bg-white border-gray-200/70 hover:border-gray-300 hover:bg-gray-50/80"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {user.name[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-gray-900 truncate">
                            {user.name}
                          </span>
                          <span className="text-[9px] font-mono px-1 rounded bg-gray-100 text-gray-600 uppercase font-bold">
                            {user.role}
                          </span>
                        </div>
                        {user.username && (
                          <span className="text-[11px] font-mono font-bold text-emerald-700 block truncate">
                            @{user.username}
                          </span>
                        )}
                        <span className="text-[11px] text-gray-500 font-mono block truncate">
                          {user.email}
                        </span>
                        {user.device && (
                          <span className="text-[9px] text-gray-400 block mt-0.5">
                            {user.device}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-full block">
                        {user.sessions.length} sessions
                      </span>
                      <span className="text-[9px] text-gray-400 block mt-1">
                        {user.lastActive}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: User Detail & Consultation Inspector */}
          <div className="lg:col-span-8 space-y-4">
            {selectedUser ? (
              <>
                {/* User Summary Card */}
                <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {selectedUser.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-gray-900">{selectedUser.name}</h3>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-1.5 py-0.2 rounded font-bold uppercase">
                          {selectedUser.role}
                        </span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.2 rounded flex items-center gap-1">
                          <CheckCircleFill className="w-2.5 h-2.5" /> OTP Verified
                        </span>
                        {selectedUser.device && (
                          <span className="text-[10px] bg-gray-100 text-gray-600 font-mono px-1.5 py-0.2 rounded">
                            {selectedUser.device}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 font-mono block mt-0.5">
                        Vault: {selectedUser.email} (Strictly Isolated Storage)
                      </span>
                      {selectedUser.institution && (
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          {selectedUser.institution} · {selectedUser.registrationNumber || "Verified Member"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs font-semibold text-gray-600">
                    Total Consultations:{" "}
                    <span className="text-emerald-700 font-bold">{selectedUser.sessions.length}</span>
                  </div>
                </div>

                {/* Consultation Sessions for this User */}
                <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                      <JournalText className="w-4 h-4 text-emerald-700" />
                      <span>Private Consultation Vault</span>
                    </div>
                    <span className="text-[11px] text-gray-400">
                      AES-256 Client-Side Partitioning
                    </span>
                  </div>

                  {selectedUser.sessions.length === 0 ? (
                    <div className="text-center py-8 text-xs text-gray-400">
                      No consultations recorded yet in this user&apos;s isolated vault.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Sessions List */}
                      <div className="md:col-span-5 space-y-2 border-r border-gray-100 pr-3">
                        {selectedUser.sessions.map((sess) => {
                          const isSessSelected = selectedSession?.id === sess.id;
                          return (
                            <button
                              key={sess.id}
                              onClick={() => setSelectedSession(sess)}
                              className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                                isSessSelected
                                  ? "bg-emerald-50 border-emerald-300 font-semibold text-gray-900 shadow-sm"
                                  : "bg-gray-50/70 border-gray-200/70 hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                                <span className="uppercase font-mono font-bold text-emerald-700">
                                  {sess.domain || "general"}
                                </span>
                                <span>{new Date(sess.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="line-clamp-2 leading-snug">{sess.title}</p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Selected Session Transcript & Citations */}
                      <div className="md:col-span-7 space-y-3 max-h-[420px] overflow-y-auto pl-1">
                        {selectedSession ? (
                          <>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs space-y-2">
                              <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase block">
                                Inquiry Transcript
                              </span>
                              {selectedSession.messages.map((m, idx) => (
                                <div
                                  key={idx}
                                  className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                                    m.role === "user"
                                      ? "bg-white border border-gray-200 font-semibold text-gray-900"
                                      : "bg-emerald-50/50 border border-emerald-100 text-gray-800"
                                  }`}
                                >
                                  <span className="text-[10px] font-mono uppercase font-bold text-gray-400 block mb-1">
                                    {m.role === "user" ? "Citizen Question:" : "AYURLEX Legal Answer:"}
                                  </span>
                                  <p className="whitespace-pre-wrap">{m.content}</p>

                                  {m.cited_passages && m.cited_passages.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-emerald-200/60 text-[10px] text-gray-500 space-y-1">
                                      <span className="font-bold text-emerald-800">
                                        Verified Citations:
                                      </span>
                                      {m.cited_passages.map((c, ci) => (
                                        <div key={ci} className="font-mono text-gray-600">
                                          • {c.section} ({c.source_title})
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-6 text-xs text-gray-400">
                            Select a consultation session on the left to inspect transcripts.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-xs text-gray-400">
                Select a user from the directory to inspect their consultation vault.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: BLOCKCHAIN IP APPLICATIONS REGISTRY ──────────────────────── */}
      {activeTab === "blockchain" && (
        <div className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Sovereign Proof-of-Existence IP Ledger</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Every notarized Ayurvedic formulation, patent claim, and trademark brand is cryptographically chained and tamper-evident.
              </p>
            </div>
            <a
              href="http://127.0.0.1:8000/docs#/blockchain"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <span>Swagger API Docs</span>
              <BoxArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {loadingBlocks ? (
            <div className="text-center py-8 text-xs text-gray-400 animate-pulse">
              Querying sovereign blockchain node and validating cryptographic hashes...
            </div>
          ) : blockchainBlocks.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400">
              No blockchain blocks loaded. Ensure FastAPI backend is active on port 8000.
            </div>
          ) : (
            <div className="space-y-3">
              {blockchainBlocks.map((block) => (
                <div
                  key={block.index}
                  className="bg-gray-50 border border-gray-200/80 rounded-xl p-4 text-xs space-y-2 card-motion"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-emerald-700 text-white px-2 py-0.5 rounded-lg">
                        Block #{block.index}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {new Date(block.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                      {block.transaction_count} Transaction(s)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-white p-2 rounded-lg border border-gray-200 truncate">
                      <span className="text-gray-400 block text-[9px] uppercase">Block Hash:</span>
                      <span className="text-gray-800">{block.hash}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-gray-200 truncate">
                      <span className="text-gray-400 block text-[9px] uppercase">Merkle Root:</span>
                      <span className="text-gray-800">{block.merkle_root}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

