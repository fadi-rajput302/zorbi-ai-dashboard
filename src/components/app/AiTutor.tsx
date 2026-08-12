import { motion } from "framer-motion";
import {
  Mic,
  Paperclip,
  Plus,
  Send,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { ZorbiMascot } from "@/components/ZorbiMascot";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  time: string;
  file?: string;
}

const HISTORY = [
  { title: "Chain rule explained", preview: "Think of peeling an onion…", time: "2h ago" },
  { title: "Physics Ch. 6 summary", preview: "Key equations + 3 practice…", time: "Yesterday" },
  { title: "Chemistry quiz prep", preview: "Bonding, polarity, 10 questions…", time: "2 days ago" },
  { title: "English essay outline", preview: "Intro → 3 body paragraphs…", time: "3 days ago" },
];

const SUGGESTIONS = [
  "Explain the chain rule",
  "Summarize Physics Chapter 6",
  "Quiz me on chemical bonding",
  "Plan my study week",
];

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

let idCounter = 0;
const nextId = () => ++idCounter;

function buildReply(query: string) {
  const topic = query.length > 56 ? `${query.slice(0, 56)}…` : query;
  return [
    `Great question about "${topic}"! 🧠 Let's break it down step by step. The key idea is simpler than it looks — once you see the pattern, it clicks. I've also added a quick practice question at the end to lock it in.`,
    `I've got you! For "${topic}" — here's the short version: start from what you already know, then apply the one new rule for this topic. Want me to turn this into a flashcard or a mini-quiz?`,
    `Nice one! Here's how I'd approach "${topic}": (1) define the core idea, (2) work a small example together, (3) try one on your own and I'll check it. Ready when you are!`,
  ];
}

export function AiTutor({
  draft = "",
  draftVersion = 0,
}: {
  draft?: string;
  draftVersion?: number;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nextId(),
      role: "assistant",
      content:
        "Hi Fahad! 👋 I'm Zorbi, your AI tutor. Ask me anything — a tricky concept, a homework question, or a topic to summarize.",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [activeChat, setActiveChat] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const replyIndex = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Initialise to the current version so a remount (e.g. navigating back to
  // the tutor screen) doesn't re-send the last draft.
  const draftSeen = useRef(draftVersion);

  useEffect(() => {
    if (draftVersion !== draftSeen.current && draft.trim()) {
      draftSeen.current = draftVersion;
      sendMessage(draft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, draftVersion]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const pushAssistantReply = (query: string) => {
    const replies = buildReply(query);
    const reply = replies[replyIndex.current % replies.length];
    replyIndex.current += 1;
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "assistant", content: reply, time: now() },
    ]);
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: trimmed, time: now() },
    ]);
    setInput("");
    setShowSuggestions(false);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      pushAssistantReply(trimmed);
    }, 1100);
  };

  const handleFile = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        role: "user",
        content: `Uploaded ${file.name}`,
        time: now(),
        file: file.name,
      },
    ]);
    setShowSuggestions(false);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      pushAssistantReply(`Let me read through ${file.name} for you…`);
    }, 1200);
    toast("File received", {
      description: "Zorbi is reading through it now.",
    });
  };

  const newChat = () => {
    setMessages([
      {
        id: nextId(),
        role: "assistant",
        content:
          "Hi Fahad! 👋 Fresh start — what would you like to learn today?",
        time: now(),
      },
    ]);
    setShowSuggestions(true);
    setActiveChat(0);
    replyIndex.current = 0;
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[264px_minmax(0,1fr)]">
      {/* Conversation history */}
      <aside className="glass hidden flex-col rounded-3xl p-4 lg:flex">
        <button
          type="button"
          onClick={newChat}
          className="flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-3 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_-10px_rgba(99,102,241,0.7)] transition-all hover:-translate-y-px"
        >
          <Plus className="size-4" />
          New chat
        </button>

        <div className="mt-4 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          <Sparkles className="size-3.5 text-indigo-400" />
          Recent
        </div>

        <div className="mt-2 flex flex-col gap-1">
          {HISTORY.map((chat, i) => (
            <button
              key={chat.title}
              type="button"
              onClick={() => setActiveChat(i)}
              className={cn(
                "rounded-2xl px-3 py-2.5 text-left transition-all",
                activeChat === i
                  ? "bg-white text-slate-900 shadow-[0_1px_2px_rgba(28,40,92,0.06),0_8px_20px_-12px_rgba(79,108,240,0.3)] ring-1 ring-white/80"
                  : "text-slate-500 hover:bg-white/70",
              )}
            >
              <div className="truncate text-[13px] font-semibold">
                {chat.title}
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <span className="truncate text-[11px] text-slate-400">
                  {chat.preview}
                </span>
                <span className="shrink-0 text-[10px] text-slate-300">
                  {chat.time}
                </span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat */}
      <section className="glass flex min-h-[560px] flex-col overflow-hidden rounded-3xl">
        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-white/70 bg-white/40 px-5 py-4">
          <ZorbiMascot size={40} glow={false} />
          <div>
            <div className="text-sm font-bold text-slate-900">Zorbi AI Tutor</div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Online · replies instantly
            </div>
          </div>
          <button
            type="button"
            onClick={newChat}
            className="ml-auto flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200/80 transition-all hover:text-indigo-600 hover:ring-indigo-200"
          >
            <Plus className="size-3.5" />
            New chat
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto px-5 py-6"
        >
          {messages.map((message) =>
            message.role === "assistant" ? (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-end gap-2.5"
              >
                <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-slate-200/70 shadow-sm">
                  <ZorbiMascot size={30} glow={false} />
                </div>
                <div className="max-w-[78%] rounded-2xl rounded-bl-md bg-white/90 px-4 py-3 text-[13.5px] leading-relaxed text-slate-700 shadow-sm ring-1 ring-slate-100">
                  {message.file && (
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                      <Paperclip className="size-3" />
                      {message.file}
                    </div>
                  )}
                  {message.content}
                  <div className="mt-1.5 text-right text-[10px] text-slate-300">
                    {message.time}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-end"
              >
                <div className="max-w-[78%] rounded-2xl rounded-br-md bg-gradient-to-br from-indigo-500 to-violet-500 px-4 py-3 text-[13.5px] leading-relaxed text-white shadow-[0_10px_24px_-12px_rgba(99,102,241,0.7)]">
                  {message.file && (
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1 text-xs font-semibold">
                      <Paperclip className="size-3" />
                      {message.file}
                    </div>
                  )}
                  {message.content}
                  <div className="mt-1.5 text-right text-[10px] text-white/60">
                    {message.time}
                  </div>
                </div>
              </motion.div>
            ),
          )}

          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-2.5"
            >
              <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-slate-200/70 shadow-sm">
                <ZorbiMascot size={30} glow={false} />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white/90 px-4 py-3.5 shadow-sm ring-1 ring-slate-100">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="size-1.5 rounded-full bg-indigo-300"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Suggested questions */}
        {showSuggestions && (
          <div className="flex flex-wrap gap-2 px-5 pb-3">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                className="rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200/80 transition-all hover:-translate-y-px hover:text-indigo-600 hover:ring-indigo-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div className="border-t border-white/70 bg-white/40 px-4 py-3.5">
          <div className="flex items-center gap-2 rounded-full bg-white/90 p-1.5 pl-2 shadow-[0_10px_28px_-14px_rgba(79,108,240,0.45)] ring-1 ring-white/90 transition-shadow focus-within:ring-2 focus-within:ring-indigo-300/60">
            <input
              ref={fileRef}
              type="file"
              multiple
              accept=".pdf,.pptx,.doc,.docx,.png,.jpg"
              className="hidden"
              onChange={(e) => {
                handleFile(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Upload a file"
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Paperclip className="size-[18px]" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask Zorbi anything…"
              className="h-9 min-w-0 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() =>
                toast("Voice input", {
                  description: "Zorbi's voice mode is coming soon!",
                })
              }
              aria-label="Voice input"
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Mic className="size-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => sendMessage(input)}
              aria-label="Send message"
              disabled={!input.trim() || typing}
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_8px_18px_-8px_rgba(99,102,241,0.7)] transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send className="size-4" />
            </button>
          </div>
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <WandSparkles className="size-3 text-indigo-300" />
            Zorbi can explain, summarize, quiz you, and help with homework.
          </div>
        </div>
      </section>
    </div>
  );
}
