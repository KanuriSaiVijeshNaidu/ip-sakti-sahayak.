"use client";

import { useState } from "react";
import { Message, DomainType } from "@/types";
import {
  XLg,
  PlusLg,
  Trash3Fill,
  Download,
  ChatLeftTextFill,
  Search,
  FileEarmarkTextFill,
  ClockFill,
  KeyFill,
} from "react-bootstrap-icons";

export interface ChatSession {
  id: string;
  title: string;
  domain: DomainType | "auto";
  language: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

interface ChatHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onClearAllSessions?: () => void;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
}

export default function ChatHistoryDrawer({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onClearAllSessions,
  isLoggedIn,
  onOpenAuth,
}: ChatHistoryDrawerProps) {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filteredSessions = sessions.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.messages.some((m) => m.content.toLowerCase().includes(search.toLowerCase()))
  );

  const exportSession = (session: ChatSession, format: "json" | "markdown") => {
    let content = "";
    let filename = "";
    let mimeType = "";

    if (format === "json") {
      content = JSON.stringify(session, null, 2);
      filename = `ayurlex-consultation-${session.id.slice(0, 8)}.json`;
      mimeType = "application/json";
    } else {
      filename = `ayurlex-consultation-${session.id.slice(0, 8)}.md`;
      mimeType = "text/markdown";
      const lines = [
        `# AYURLEX Statutory Consultation Audit Transcript`,
        `**Session ID**: \`${session.id}\``,
        `**Domain**: ${session.domain.toUpperCase()}`,
        `**Created At**: ${new Date(session.createdAt).toLocaleString()}`,
        `**Message Count**: ${session.messages.length}`,
        `\n---\n`,
      ];

      session.messages.forEach((m, idx) => {
        lines.push(
          `### ${m.role === "user" ? "👤 User Query" : "⚖️ AYURLEX Statutory Answer"} (${idx + 1})`
        );
        lines.push(`*Timestamp: ${new Date(m.timestamp).toLocaleTimeString()}*\n`);
        lines.push(m.content);
        if (m.cited_passages && m.cited_passages.length > 0) {
          lines.push(`\n**Verified Statutory Citations:**`);
          m.cited_passages.forEach((cp) => {
            lines.push(
              `- [${cp.section || cp.source_title}] "${cp.passage_text.slice(0, 120)}..." (${cp.domain} · ${cp.jurisdiction})`
            );
          });
        }
        lines.push(`\n---\n`);
      });

      content = lines.join("\n");
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 border-r border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
          <div className="flex items-center gap-2">
            <ChatLeftTextFill className="w-4 h-4 text-green-700" />
            <h2 className="font-bold text-gray-900 text-sm">Consultation History</h2>
            <span className="text-xs bg-green-100 text-green-800 font-mono px-2 py-0.5 rounded-full font-semibold">
              {isLoggedIn ? sessions.length : 0}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <XLg className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* If Not Logged In: Show Zero Default History with Sign-In Prompt */}
        {!isLoggedIn ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
              <KeyFill className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-xs">
              <h3 className="text-sm font-bold text-gray-900">No History Before Login</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                To protect confidentiality, chat history is never saved in Guest Mode. Please sign in with your email & OTP to create and save private legal consultations.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <KeyFill className="w-3.5 h-3.5" />
              <span>Sign In with Email & OTP</span>
            </button>
          </div>
        ) : (
          /* LOGGED IN: SHOW SESSIONS & ACTIONS */
          <>
            {/* New Chat Button */}
            <div className="p-3 border-b border-gray-100">
              <button
                onClick={() => {
                  onNewSession();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-green-700 hover:bg-green-800 text-white font-medium text-xs rounded-xl shadow-xs transition-all hover:shadow-md"
              >
                <PlusLg className="w-3.5 h-3.5" />
                New Consultation (+ Chat)
              </button>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search legal consultations..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-100/70 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:bg-white"
                />
              </div>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <ChatLeftTextFill className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-500">No consultations found</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Ask a legal question to create your first consultation.
                  </p>
                </div>
              ) : (
                filteredSessions.map((s) => {
                  const isActive = s.id === activeSessionId;
                  const dateStr = new Date(s.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={s.id}
                      className={`group relative rounded-xl border p-2.5 transition-all text-left ${
                        isActive
                          ? "border-green-600 bg-green-50/60 shadow-xs"
                          : "border-gray-200/80 hover:border-gray-300 hover:bg-gray-50/70"
                      }`}
                    >
                      <button
                        onClick={() => {
                          onSelectSession(s.id);
                          onClose();
                        }}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="text-xs font-semibold text-gray-900 line-clamp-1 flex-1">
                            {s.title || "Untitled Legal Inquiry"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono shrink-0 flex items-center gap-0.5">
                            <ClockFill className="w-2.5 h-2.5" />
                            {dateStr}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                          <span className="px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-mono uppercase">
                            {s.domain}
                          </span>
                          <span>·</span>
                          <span>{s.messages.length} messages</span>
                        </div>
                      </button>

                      {/* Actions */}
                      <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1">
                          <button
                            title="Export as Markdown"
                            onClick={() => exportSession(s, "markdown")}
                            className="px-2 py-0.5 text-[10px] font-mono rounded text-gray-600 hover:bg-gray-200/70 flex items-center gap-1 transition-colors"
                          >
                            <FileEarmarkTextFill className="w-2.5 h-2.5 text-gray-500" />
                            MD
                          </button>
                          <button
                            title="Export as JSON"
                            onClick={() => exportSession(s, "json")}
                            className="px-2 py-0.5 text-[10px] font-mono rounded text-gray-600 hover:bg-gray-200/70 flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-2.5 h-2.5 text-gray-500" />
                            JSON
                          </button>
                        </div>

                        <button
                          title="Delete this consultation"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Delete this consultation from your private vault?")) {
                              onDeleteSession(s.id);
                            }
                          }}
                          className="p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash3Fill className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Clear All History Button */}
            {sessions.length > 0 && onClearAllSessions && (
              <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete ALL consultation records in your vault? This cannot be undone.")) {
                      onClearAllSessions();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Trash3Fill className="w-3 h-3" />
                  <span>Clear All History</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* Footer info */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-[11px] text-gray-500 flex items-center justify-between">
          <span>Isolated Storage</span>
          <span className="font-mono text-[10px] text-green-700 font-medium">AYUR-V2.0</span>
        </div>
      </div>
    </div>
  );
}
