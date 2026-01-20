"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Lock,
  Loader2,
  ArrowRight,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  FileText,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ScoreData {
  totalScore: number;
  resumeQualityTotal: number;
  jobSeekerTotal: number;
  formattingStructure: number;
  spellingGrammar: number;
  lengthBrevity: number;
  relevanceClarity: number;
  educationScore: number;
  tenureScore: number;
  gapsScore: number;
  marketMatchScore: number;
  marketDemandLevel: string | null;
  recommendations: Array<{
    title: string;
    description: string;
    priority: string;
    category: string;
    potentialGain: number;
  }>;
}

const quickTopics = [
  { label: "Improve my score", icon: TrendingUp },
  { label: "Review my resume", icon: FileText },
  { label: "Interview prep", icon: Briefcase },
];

export default function AICoachPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const [scores, setScores] = useState<ScoreData | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkSubscription();
    fetchScores();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkSubscription = async () => {
    try {
      const res = await fetch("/api/subscription/status");
      if (res.ok) {
        const data = await res.json();
        setIsPremium(data.subscription?.isPremium || false);
        setUserName(data.subscription?.firstName || "");
      }
    } catch (error) {
      console.error("Failed to check subscription:", error);
      setIsPremium(false);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const fetchScores = async () => {
    try {
      const res = await fetch("/api/scores/calculate");
      if (res.ok) {
        const data = await res.json();
        if (data.hasScore) {
          setScores(data.scores);
        }
      }
    } catch (error) {
      console.error("Failed to fetch scores:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSubscribe = async () => {
    try {
      const res = await fetch("/api/subscription/checkout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error("Subscription error:", error);
    }
  };

  if (checkingSubscription) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2B8A8A]" />
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="max-w-md mx-auto py-12 px-4">
        <div className={`rounded-2xl p-8 text-center ${isDark ? "bg-gray-900/50" : "bg-white"} shadow-sm border ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          {/* Compass Avatar */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2B8A8A] to-[#4ECDC4] flex items-center justify-center shadow-lg">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <polygon points="12,2 14.5,9.5 12,12 9.5,9.5" fill="currentColor" />
                <polygon points="12,22 9.5,14.5 12,12 14.5,14.5" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <h1 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            Meet Compass
          </h1>
          <p className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Your personal career guide
          </p>

          <div className={`p-5 rounded-xl mb-6 text-left ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}>
            <p className={`text-sm leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              "Hey! I'm Compass - here to help you find your direction. Whether you're polishing
              your resume, prepping for interviews, or figuring out your next move, I've got you."
            </p>
          </div>

          <Button
            onClick={handleSubscribe}
            className="w-full bg-[#2B8A8A] hover:bg-[#237070] text-white font-medium py-5"
          >
            Chat with Compass - $4.99/mo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p className={`mt-3 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            Cancel anytime
          </p>
        </div>
      </div>
    );
  }

  // Welcome message from Compass
  const welcomeMessage = userName
    ? `Hey ${userName}! Ready to make some moves?`
    : "Hey! I'm Compass. Where are we heading today?";

  // Helper to get score color
  const getScoreColor = (score: number, max: number) => {
    const pct = (score / max) * 100;
    if (pct >= 80) return "text-green-500";
    if (pct >= 60) return "text-[#2B8A8A]";
    if (pct >= 40) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number, max: number) => {
    const pct = (score / max) * 100;
    if (pct >= 80) return "bg-green-500";
    if (pct >= 60) return "bg-[#2B8A8A]";
    if (pct >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  // Normalize scores to 0-100
  const resumePct = scores ? Math.round((scores.resumeQualityTotal / 30) * 100) : 0;
  const seekerPct = scores ? Math.round((scores.jobSeekerTotal / 70) * 100) : 0;

  return (
    <div className="flex gap-6 h-[calc(100vh-150px)]">
      {/* Left Panel - Context */}
      <div className={`w-80 flex-shrink-0 flex flex-col gap-4 overflow-y-auto ${isDark ? "text-white" : "text-gray-900"}`}>
        {/* Score Overview */}
        {scores && (
          <div className={`rounded-xl p-5 ${isDark ? "bg-gray-900/50" : "bg-white"} border ${isDark ? "border-gray-800" : "border-gray-100"}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Your Score</h3>
              <span className={`text-2xl font-bold ${getScoreColor(scores.totalScore, 100)}`}>
                {Math.round(scores.totalScore)}
              </span>
            </div>

            {/* Score bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className={isDark ? "text-gray-400" : "text-gray-500"}>Resume Quality</span>
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}>{resumePct}%</span>
                </div>
                <div className={`h-2 rounded-full ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                  <motion.div
                    className={`h-full rounded-full ${getScoreBg(resumePct, 100)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${resumePct}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className={isDark ? "text-gray-400" : "text-gray-500"}>Job Seeker</span>
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}>{seekerPct}%</span>
                </div>
                <div className={`h-2 rounded-full ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                  <motion.div
                    className={`h-full rounded-full ${getScoreBg(seekerPct, 100)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${seekerPct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
              </div>
            </div>

            {scores.marketDemandLevel && (
              <div className={`mt-4 pt-4 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#2B8A8A]" />
                  <span className="text-xs">
                    <span className={isDark ? "text-gray-400" : "text-gray-500"}>Market demand: </span>
                    <span className={`font-medium capitalize ${
                      scores.marketDemandLevel === "high" ? "text-green-500" : "text-amber-500"
                    }`}>
                      {scores.marketDemandLevel}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Top Recommendations */}
        {scores && scores.recommendations && scores.recommendations.length > 0 && (
          <div className={`rounded-xl p-5 ${isDark ? "bg-gray-900/50" : "bg-white"} border ${isDark ? "border-gray-800" : "border-gray-100"}`}>
            <h3 className="font-semibold text-sm mb-3">Focus Areas</h3>
            <div className="space-y-2">
              {scores.recommendations.slice(0, 4).map((rec, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(`Help me with: ${rec.title}`)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      rec.priority === "high" ? "bg-red-500" :
                      rec.priority === "medium" ? "bg-amber-500" : "bg-green-500"
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                        {rec.title}
                      </p>
                      <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        +{rec.potentialGain} pts
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className={`rounded-xl p-5 ${isDark ? "bg-gray-900/50" : "bg-white"} border ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          <h3 className="font-semibold text-sm mb-3">Quick Topics</h3>
          <div className="space-y-2">
            {quickTopics.map((topic, i) => {
              const Icon = topic.icon;
              return (
                <button
                  key={i}
                  onClick={() => sendMessage(topic.label)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                    isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                    <Icon className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                  </div>
                  <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {topic.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className={`flex items-center gap-3 pb-4 border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2B8A8A] to-[#4ECDC4] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <polygon points="12,2 14.5,9.5 12,12 9.5,9.5" fill="currentColor" />
                <polygon points="12,22 9.5,14.5 12,12 14.5,14.5" fill="currentColor" opacity="0.5" />
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
          </div>
          <div>
            <h2 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Compass</h2>
            <p className={`text-xs ${isDark ? "text-green-400" : "text-green-600"}`}>Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Welcome */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2B8A8A] to-[#4ECDC4] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="12,2 14,10 12,12 10,10" fill="currentColor" />
              </svg>
            </div>
            <div className={`rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
              <p className={`text-sm ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                {welcomeMessage}
              </p>
            </div>
          </div>

          {/* Messages */}
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2B8A8A] to-[#4ECDC4] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="12,2 14,10 12,12 10,10" fill="currentColor" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                    message.role === "user"
                      ? "bg-[#2B8A8A] text-white rounded-tr-sm"
                      : isDark
                      ? "bg-gray-800 text-gray-100 rounded-tl-sm"
                      : "bg-gray-100 text-gray-800 rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing */}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2B8A8A] to-[#4ECDC4] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="12,2 14,10 12,12 10,10" fill="currentColor" />
                </svg>
              </div>
              <div className={`rounded-2xl rounded-tl-sm px-4 py-3 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                <div className="flex gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isDark ? "bg-gray-500" : "bg-gray-400"} animate-bounce`} style={{ animationDelay: "0ms" }} />
                  <span className={`w-2 h-2 rounded-full ${isDark ? "bg-gray-500" : "bg-gray-400"} animate-bounce`} style={{ animationDelay: "150ms" }} />
                  <span className={`w-2 h-2 rounded-full ${isDark ? "bg-gray-500" : "bg-gray-400"} animate-bounce`} style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`pt-4 border-t ${isDark ? "border-gray-800" : "border-gray-200"}`}>
          <div className={`flex items-center gap-2 p-1.5 rounded-full ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Compass..."
              className={`flex-1 px-4 py-2 bg-transparent text-sm focus:outline-none ${
                isDark ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"
              }`}
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                input.trim() && !isLoading
                  ? "bg-[#2B8A8A] text-white"
                  : isDark
                  ? "bg-gray-700 text-gray-500"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
