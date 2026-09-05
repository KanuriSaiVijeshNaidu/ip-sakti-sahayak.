"use client";
import { Message, LanguageCode } from "@/types";
import CitationCard from "./CitationCard";
import { User, Bot, Clock, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { getTranslation } from "@/lib/i18n";

function renderFormattedLine(line: string, lineIndex: number) {
  const trimmed = line.trim();
  if (!trimmed) return <div key={lineIndex} className="h-2" />;

  // Markdown H3 / H2 headers
  if (trimmed.startsWith("### ")) {
    return (
      <h4 key={lineIndex} className="font-bold text-gray-900 text-base mt-3 mb-1.5 flex items-center gap-1.5">
        {trimmed.replace(/^###\s*/, "")}
      </h4>
    );
  }
  if (trimmed.startsWith("## ")) {
    return (
      <h3 key={lineIndex} className="font-bold text-gray-900 text-lg mt-4 mb-2">
        {trimmed.replace(/^##\s*/, "")}
      </h3>
    );
  }

  // Horizontal divider
  if (trimmed === "---") {
    return <hr key={lineIndex} className="my-3 border-gray-200" />;
  }

  // Bullet / Numbered lists
  const isNumbered = /^(\d+)\.\s+(.*)/.exec(trimmed);
  const isBullet = /^[-*]\s+(.*)/.exec(trimmed);

  const contentText = isNumbered ? isNumbered[2] : isBullet ? isBullet[1] : trimmed;

  // Process inline markdown (**bold**, *italic*, `code`, [src-N])
  const parts = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[src-\d+\])/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(contentText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(contentText.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={`${lineIndex}-${match.index}`} className="font-semibold text-gray-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={`${lineIndex}-${match.index}`} className="italic text-gray-800">
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code key={`${lineIndex}-${match.index}`} className="bg-gray-100 text-indigo-700 px-1.5 py-0.5 rounded text-xs font-mono">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[src-") && token.endsWith("]")) {
      parts.push(
        <span key={`${lineIndex}-${match.index}`} className="inline-flex items-center px-1.5 py-0.2 bg-green-50 text-green-700 border border-green-200 rounded text-[11px] font-mono font-medium mx-0.5">
          {token}
        </span>
      );
    }
    lastIndex = match.index + token.length;
  }
  if (lastIndex < contentText.length) {
    parts.push(contentText.substring(lastIndex));
  }

  if (isNumbered) {
    return (
      <div key={lineIndex} className="flex items-start gap-2 ml-2 my-1 text-sm text-gray-800">
        <span className="font-semibold text-green-700 select-none shrink-0">{isNumbered[1]}.</span>
        <div className="leading-relaxed">{parts}</div>
      </div>
    );
  }

  if (isBullet) {
    return (
      <div key={lineIndex} className="flex items-start gap-2 ml-2 my-1 text-sm text-gray-800">
        <span className="text-green-600 select-none shrink-0 mt-1">•</span>
        <div className="leading-relaxed">{parts}</div>
      </div>
    );
  }

  return (
    <p key={lineIndex} className="text-gray-800 text-sm leading-relaxed my-1">
      {parts}
    </p>
  );
}

export default function ChatBubble({
  message,
  language = "en",
}: {
  message: Message;
  language?: LanguageCode;
}) {
  const isUser = message.role === "user";
  const [showPassages, setShowPassages] = useState(false);
  const hasCitations = !isUser && message.cited_passages && message.cited_passages.length > 0;
  const t = getTranslation(language);

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} w-full`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
          isUser
            ? "bg-green-100 border border-green-200"
            : "bg-gradient-to-br from-green-600 to-emerald-700 text-white"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-green-700" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bubble container */}
      <div className={`max-w-[85%] flex flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
        {/* Answer card */}
        <div
          className={`rounded-2xl px-5 py-4 ${
            isUser
              ? "bg-green-600 text-white rounded-tr-sm shadow-sm"
              : "bg-white border border-gray-200 shadow-sm rounded-tl-sm w-full"
          }`}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="space-y-0.5">
              {message.content.split("\n").map((line, idx) => renderFormattedLine(line, idx))}
            </div>
          )}
        </div>

        {/* Small source provenance section below answer */}
        {hasCitations && (
          <div className="w-full bg-white border border-gray-200 rounded-xl p-3 shadow-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <BookOpen className="w-3.5 h-3.5 text-green-600" />
                <span>{t.referredSources}</span>
              </div>
              <button
                onClick={() => setShowPassages(!showPassages)}
                className="text-xs text-green-700 hover:text-green-800 font-medium flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded border border-green-200 transition-colors"
              >
                <span>{showPassages ? t.hideQuoted : t.viewQuoted}</span>
                {showPassages ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Document badge summary */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {message.cited_passages!.map((c, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700"
                >
                  <span className="font-mono text-green-700 font-semibold">[src-{i + 1}]</span>
                  <span className="font-medium text-gray-900">{c.section || "Statutory Section"}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-500 text-[11px] truncate max-w-[200px]">{c.source_title || t.sourceDoc}</span>
                  <span className="bg-gray-200 text-gray-700 text-[10px] px-1 rounded uppercase font-semibold">
                    {c.domain}
                  </span>
                </div>
              ))}
            </div>

            {/* Expanded full passages */}
            {showPassages && (
              <div className="pt-2 border-t border-gray-100">
                <CitationCard passages={message.cited_passages!} />
              </div>
            )}
          </div>
        )}

        {/* Latency & Timestamp info */}
        {!isUser && message.latency_ms && (
          <span className="text-[11px] text-gray-400 flex items-center gap-1 px-1">
            <Clock className="w-3 h-3" />
            {t.genTime} {(message.latency_ms / 1000).toFixed(1)}s
          </span>
        )}
      </div>
    </div>
  );
}

