"use client";
import { useState, useRef, KeyboardEvent } from "react";
import { SendFill, ArrowRepeat } from "react-bootstrap-icons";

interface Props {
  onSend: (query: string) => void;
  loading: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, loading, disabled, placeholder }: Props) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const q = text.trim();
    if (!q || loading) return;
    onSend(q);
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInput = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
  };

  return (
    <div className="flex items-center gap-3 bg-zinc-950/90 backdrop-blur-xl border border-zinc-800 rounded-2xl sm:rounded-full px-4 sm:px-5 py-2.5 sm:py-3 shadow-2xl focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-white/10 transition-all duration-200">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          handleInput();
        }}
        onKeyDown={handleKey}
        placeholder={placeholder || "Ask about patents, trademarks, GI tags, FSSAI / AYUSH compliance..."}
        rows={1}
        disabled={disabled || loading}
        className="flex-1 resize-none outline-none text-xs sm:text-sm text-white placeholder-zinc-500 bg-transparent max-h-32 disabled:opacity-50 font-normal leading-relaxed"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || loading || disabled}
        className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-full flex items-center justify-center transition-all duration-200 ${
          text.trim() && !loading && !disabled
            ? "bg-white hover:bg-zinc-200 text-black shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            : "bg-zinc-900 text-zinc-600 cursor-not-allowed"
        }`}
        title="Send legal inquiry"
      >
        {loading ? (
          <ArrowRepeat className="w-4 h-4 text-black animate-spin" />
        ) : (
          <SendFill className={`w-3.5 h-3.5 ${text.trim() ? "text-black" : "text-zinc-600"}`} />
        )}
      </button>
    </div>
  );
}
