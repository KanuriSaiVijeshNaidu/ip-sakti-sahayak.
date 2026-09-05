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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
  };

  return (
    <div className="relative flex items-end gap-2 bg-slate-900/80 border border-white/15 hover:border-white/25 rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all duration-200">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          handleInput();
        }}
        onKeyDown={handleKey}
        placeholder={placeholder || "Ask about patent eligibility, trademark Form TM-A, Rule 158B, GI tags..."}
        rows={1}
        disabled={disabled || loading}
        className="flex-1 resize-none outline-none text-sm text-slate-100 placeholder-slate-500 bg-transparent max-h-40 disabled:opacity-50 font-sans leading-relaxed"
      />

      <button
        onClick={handleSend}
        disabled={!text.trim() || loading || disabled}
        className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-emerald-glow"
        title="Submit Legal Query (Enter)"
      >
        {loading ? (
          <ArrowRepeat className="w-4 h-4 text-white animate-spin" />
        ) : (
          <SendFill className="w-3.5 h-3.5 text-slate-950 translate-x-px" />
        )}
      </button>
    </div>
  );
}
