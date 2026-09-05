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
    <div className="flex items-end gap-2 bg-white border border-gray-300 rounded-2xl px-4 py-3 shadow-xs focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-all">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => { setText(e.target.value); handleInput(); }}
        onKeyDown={handleKey}
        placeholder={placeholder || "Ask about patents, trademarks, GI tags, FSSAI / AYUSH compliance..."}
        rows={1}
        disabled={disabled || loading}
        className="flex-1 resize-none outline-none text-sm text-gray-900 placeholder-gray-400 bg-transparent max-h-40 disabled:opacity-50"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || loading || disabled}
        className="flex-shrink-0 w-9 h-9 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
      >
        {loading
          ? <ArrowRepeat className="w-4 h-4 text-white animate-spin" />
          : <SendFill className="w-3.5 h-3.5 text-white" />}
      </button>
    </div>
  );
}
