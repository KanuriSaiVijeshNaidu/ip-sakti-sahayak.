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
    <div className="flex items-center gap-3 bg-white border border-gray-300/80 rounded-2xl sm:rounded-full px-5 py-3 shadow-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:shadow-md transition-all duration-200">
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
        className="flex-1 resize-none outline-none text-sm text-gray-900 placeholder-gray-400 bg-transparent max-h-32 disabled:opacity-50 font-normal leading-relaxed"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || loading || disabled}
        className={`flex-shrink-0 w-9 h-9 rounded-xl sm:rounded-full flex items-center justify-center transition-all duration-200 ${
          text.trim() && !loading && !disabled
            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 hover:scale-105 active:scale-95 cursor-pointer"
            : "bg-gray-100 text-gray-300 cursor-not-allowed"
        }`}
        title="Send legal inquiry"
      >
        {loading ? (
          <ArrowRepeat className="w-4 h-4 text-emerald-600 animate-spin" />
        ) : (
          <SendFill className={`w-3.5 h-3.5 ${text.trim() ? "text-white" : "text-gray-300"}`} />
        )}
      </button>
    </div>
  );
}
