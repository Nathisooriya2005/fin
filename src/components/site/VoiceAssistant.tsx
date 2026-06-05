import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Mic, MicOff, Send, Sparkles, X, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Web Speech API types (browser-only)
type SpeechRecognitionEvent = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};
type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition(): SpeechRecognitionInstance | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

const QUICK_PROMPTS = [
  "Football turf in Chennai tonight",
  "Cheapest box cricket near me",
  "Book a cricket pitch this Sunday",
];

const initialMessages: UIMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "Hey! I'm **TurfBot** 🏏⚽ — tell me what you want to play, where, and when, and I'll find a turf for you. You can type or hit the mic to talk.",
      },
    ],
  },
];

function partsToText(message: UIMessage): string {
  return message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
}

// Tiny markdown: **bold** and bullet lines starting with "- "
function renderText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const isBullet = line.trimStart().startsWith("- ");
    const content = (isBullet ? line.replace(/^\s*-\s/, "") : line)
      .split(/(\*\*[^*]+\*\*)/g)
      .map((seg, j) =>
        seg.startsWith("**") && seg.endsWith("**") ? (
          <strong key={j}>{seg.slice(2, -2)}</strong>
        ) : (
          <span key={j}>{seg}</span>
        ),
      );
    return (
      <div key={i} className={isBullet ? "flex gap-2 pl-1" : ""}>
        {isBullet && <span className="text-primary-glow mt-1.5 size-1 rounded-full bg-primary-glow shrink-0" />}
        <div>{content}</div>
      </div>
    );
  });
}

export function VoiceAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastSpokenIdRef = useRef<string | null>("welcome");

  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;

  const { messages, sendMessage, status, error } = useChat({
    id: "turfbot",
    messages: initialMessages,
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  // Focus input on open / after send
  useEffect(() => {
    if (open && status === "ready") inputRef.current?.focus();
  }, [open, status]);

  // Speak the latest assistant message (TTS)
  useEffect(() => {
    if (!speakReplies || typeof window === "undefined" || !window.speechSynthesis) return;
    if (status !== "ready") return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    if (lastSpokenIdRef.current === last.id) return;
    lastSpokenIdRef.current = last.id;
    const text = partsToText(last).replace(/\*\*/g, "");
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.05;
    utter.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [messages, status, speakReplies]);

  const handleSend = (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;
    void sendMessage({ text: value });
    setInput("");
  };

  const toggleMic = () => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const rec = getSpeechRecognition();
    if (!rec) {
      alert("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }
    rec.lang = "en-IN";
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = "";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setInput((finalText + interim).trim());
    };
    rec.onend = () => {
      setListening(false);
      if (finalText.trim()) handleSend(finalText);
    };
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open voice booking assistant"
        className={`fixed bottom-5 right-24 z-50 inline-flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold shadow-[var(--shadow-glow)] hover:scale-105 transition-transform animate-[glow-pulse_3s_ease-in-out_infinite] ${
          open ? "hidden" : ""
        }`}
      >
        <span className="size-7 rounded-full bg-background/20 grid place-items-center">
          <Sparkles className="size-4" />
        </span>
        <span className="hidden sm:inline text-sm">Book by voice</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-5 z-50 sm:w-[400px] sm:h-[640px] sm:max-h-[85vh]">
          <div className="absolute inset-0 sm:rounded-3xl glass-card neon-border flex flex-col overflow-hidden animate-[slide-up_0.3s_ease-out]">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center gap-3">
              <div className="size-10 rounded-full bg-gradient-to-br from-primary to-primary-glow grid place-items-center shadow-[var(--shadow-glow)]">
                <Sparkles className="size-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold leading-tight">TurfBot</div>
                <div className="text-xs text-success flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-success animate-pulse" />
                  Voice booking assistant
                </div>
              </div>
              <button
                onClick={() => setSpeakReplies((s) => !s)}
                className="p-2 rounded-lg hover:bg-surface text-muted-foreground hover:text-foreground transition"
                aria-label={speakReplies ? "Mute voice" : "Enable voice"}
                title={speakReplies ? "Mute replies" : "Speak replies"}
              >
                {speakReplies ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  window.speechSynthesis?.cancel();
                  recognitionRef.current?.stop();
                }}
                className="p-2 rounded-lg hover:bg-surface text-muted-foreground hover:text-foreground transition"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-sm leading-relaxed"
                        : "max-w-[90%] text-sm leading-relaxed text-foreground space-y-1"
                    }
                  >
                    {renderText(partsToText(m))}
                  </div>
                </div>
              ))}

              {status === "submitted" && (
                <div className="flex justify-start">
                  <div className="flex gap-1.5 px-3 py-3">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="size-2 rounded-full bg-primary-glow animate-bounce"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                  Couldn't reach the assistant. Please try again.
                </div>
              )}
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex gap-2 flex-wrap">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSend(p)}
                    className="text-xs px-3 py-1.5 rounded-full glass-card hover:neon-border transition text-muted-foreground hover:text-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-border flex items-end gap-2"
            >
              <button
                type="button"
                onClick={toggleMic}
                aria-label={listening ? "Stop listening" : "Start voice input"}
                className={`shrink-0 size-10 rounded-xl grid place-items-center transition ${
                  listening
                    ? "bg-destructive text-destructive-foreground animate-[glow-pulse_1.2s_ease-in-out_infinite]"
                    : "glass-card hover:neon-border text-foreground"
                }`}
              >
                {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                placeholder={listening ? "Listening…" : "Ask or speak — e.g. football tonight"}
                rows={1}
                className="flex-1 resize-none bg-surface rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-muted-foreground max-h-32"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send"
                className="shrink-0 size-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground grid place-items-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition shadow-[var(--shadow-glow)]"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
