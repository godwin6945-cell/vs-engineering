"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Minimize2, 
  Maximize2, 
  Phone, 
  MapPin, 
  FileText, 
  RefreshCw,
  MessageSquare
} from "lucide-react";
import { Button } from "./Button";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro-1",
      role: "assistant",
      content: "Namaste! I am the VS Engineering AI Technical Consultant. Ask me anything about our 5-axis CNC machining, ±0.005mm tolerances, raw material rates (MS, SS, Al, Ti), Coimbatore works address, or live order tracking.",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "What machining tolerances do you guarantee?",
    "What are your current raw material prices per kg?",
    "Where is your factory located in Coimbatore?",
    "How can I submit drawings for immediate quote?",
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: ChatMessage = {
          id: "bot-" + Date.now(),
          role: "assistant",
          content: data.reply || "Thank you for reaching out. Please connect with our team at +91 9345804547 or godwin6945@gmail.com.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          role: "assistant",
          content: "Our AI service is temporarily reconnecting. For urgent drawing review, call or WhatsApp our engineering desk directly at +91 9345804547 or email godwin6945@gmail.com.",
          time: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-40 flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-navy-900 to-orange-600 text-white shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/20 group animate-pulse-subtle"
          aria-label="Open AI Engineering Consultant"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-navy-900 flex items-center justify-center font-bold relative shadow-xs shrink-0">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-navy-900 animate-ping" />
          </div>
          <div className="text-left font-mono pr-1 hidden sm:block">
            <span className="text-[11px] block font-bold leading-tight">AI Technical Bot</span>
            <span className="text-[9px] text-orange-200 block">Ask anything 24/7</span>
          </div>
          <span className="font-mono text-xs font-bold sm:hidden pr-1">Ask AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-2 bottom-2 top-14 sm:top-auto sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px] sm:h-[550px] max-h-[92vh] sm:max-h-[85vh] z-50 bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-steel-200 dark:border-steel-800 flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-navy-950 text-white p-4 flex items-center justify-between border-b border-navy-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-sm tracking-tight">VS Engineering AI</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-steel-400 font-mono">
                  Powered by Gemini 1.5 • Coimbatore Works
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-steel-400 hover:text-white hover:bg-navy-800 transition-colors"
                aria-label="Close Chatbot"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Info Strip */}
          <div className="px-4 py-2 bg-orange-500/10 border-b border-orange-500/20 flex items-center justify-between text-[11px] font-mono text-orange-600 dark:text-orange-400">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> +91 9345804547
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Coimbatore, TN
            </span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs bg-steel-50/50 dark:bg-navy-950/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-xs whitespace-pre-wrap leading-relaxed ${
                    m.role === "user"
                      ? "bg-orange-500 text-white rounded-br-none"
                      : "bg-white dark:bg-navy-900 text-navy-900 dark:text-steel-100 border border-steel-200 dark:border-steel-800 rounded-bl-none"
                  }`}
                >
                  {m.content}
                </div>
                <span className="text-[9px] text-steel-400 font-mono mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-steel-400 font-mono text-xs p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-500" />
                <span>AI Engineering Bot is formulating response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 border-t border-steel-100 dark:border-steel-800/80 bg-white dark:bg-navy-900 overflow-x-auto flex gap-1.5 no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-steel-100 dark:bg-navy-950 text-[10px] font-mono text-steel-600 dark:text-steel-300 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 border border-steel-200 dark:border-steel-800 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-navy-900 border-t border-steel-200 dark:border-steel-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about tolerances, quotes, materials..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-steel-50 dark:bg-navy-950 border border-steel-200 dark:border-steel-700 text-steel-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <Button
              variant="orange"
              size="sm"
              type="submit"
              disabled={!input.trim() || loading}
              className="px-3 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
