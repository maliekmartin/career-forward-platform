"use client";

import { useState, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Send,
  Paperclip,
  Download,
  Check,
  CheckCheck,
  MessageSquare,
} from "lucide-react";
import { demoCoach, demoClients, DemoClient } from "@/lib/demo-data";
import { useTheme } from "@/lib/theme-context";

// Shared types - exported for use in messages page
export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: Message[];
}

interface ChatWindow {
  id: string;
  participantId: string;
  isMinimized: boolean;
}

const currentUser = demoCoach;

// Initialize demo conversations
const createInitialConversations = (): Conversation[] => {
  return demoClients.slice(0, 5).map((client, idx) => ({
    id: `conv-${client.id}`,
    participant: {
      id: client.id,
      name: `${client.firstName} ${client.lastName}`,
      avatar: client.avatar,
      isOnline: client.isOnline,
    },
    lastMessage: idx === 0
      ? "Thanks! I'm trying to hit my goal of 10 applications this month."
      : idx === 1
      ? "I just completed the STAR method module!"
      : idx === 2
      ? "Can you help me with my resume?"
      : idx === 3
      ? "I have an interview next week!"
      : "Thank you for your help.",
    lastMessageTime: idx === 0 ? "2 min ago" : idx === 1 ? "1 hour ago" : idx === 2 ? "Yesterday" : "2 days ago",
    unread: idx === 0 ? 1 : idx === 2 ? 2 : 0,
    messages: [
      {
        id: `msg-${client.id}-1`,
        senderId: currentUser.id,
        text: `Hi ${client.firstName}! How's the job search going?`,
        timestamp: "Yesterday, 2:30 PM",
        status: "read" as const,
      },
      {
        id: `msg-${client.id}-2`,
        senderId: client.id,
        text: idx === 0
          ? "Hi Sarah! It's going well. I just submitted 3 more applications this week."
          : "Thank you for checking in! Things are progressing.",
        timestamp: "Yesterday, 3:15 PM",
        status: "read" as const,
      },
      {
        id: `msg-${client.id}-3`,
        senderId: currentUser.id,
        text: "That's fantastic! I can see your progress in the dashboard. You're really staying consistent.",
        timestamp: "Yesterday, 3:20 PM",
        status: "read" as const,
      },
      {
        id: `msg-${client.id}-4`,
        senderId: client.id,
        text: idx === 0
          ? "Thanks! I'm trying to hit my goal of 10 applications this month."
          : "I appreciate your support!",
        timestamp: "2 min ago",
        status: "delivered" as const,
      },
    ],
  }));
};

// Context for managing all conversations
interface ChatContextType {
  // Conversations
  conversations: Conversation[];
  getConversation: (participantId: string) => Conversation | undefined;
  sendMessage: (participantId: string, text: string) => void;
  markAsRead: (participantId: string) => void;

  // Chat windows (floating widget)
  openChat: (client: DemoClient) => void;
  closeChat: (participantId: string) => void;
  minimizeChat: (participantId: string) => void;
  chatWindows: ChatWindow[];
}

const ChatContext = createContext<ChatContextType | null>(null);

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // Shared conversation state
  const [conversations, setConversations] = useState<Conversation[]>(createInitialConversations);

  // Chat widget windows (floating)
  const [chatWindows, setChatWindows] = useState<ChatWindow[]>([]);
  const [newMessages, setNewMessages] = useState<Record<string, string>>({});

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const MAX_OPEN_CHATS = 3;

  // Get a conversation by participant ID
  const getConversation = useCallback((participantId: string) => {
    return conversations.find(c => c.participant.id === participantId);
  }, [conversations]);

  // Send a message (updates shared state)
  const sendMessage = useCallback((participantId: string, text: string) => {
    if (!text.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      timestamp,
      status: "sent",
    };

    setConversations(prev => prev.map(conv => {
      if (conv.participant.id === participantId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: text.trim(),
          lastMessageTime: "Just now",
        };
      }
      return conv;
    }));
  }, []);

  // Mark conversation as read
  const markAsRead = useCallback((participantId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.participant.id === participantId) {
        return { ...conv, unread: 0 };
      }
      return conv;
    }));
  }, []);

  // Open a chat window (for floating widget)
  const openChat = useCallback((client: DemoClient) => {
    // First, ensure conversation exists
    setConversations(prev => {
      const exists = prev.find(c => c.participant.id === client.id);
      if (exists) return prev;

      // Create new conversation if it doesn't exist
      return [...prev, {
        id: `conv-${client.id}`,
        participant: {
          id: client.id,
          name: `${client.firstName} ${client.lastName}`,
          avatar: client.avatar,
          isOnline: client.isOnline,
        },
        lastMessage: "",
        lastMessageTime: "Now",
        unread: 0,
        messages: [],
      }];
    });

    // Then open/unminimize the chat window
    setChatWindows(prev => {
      const existingIndex = prev.findIndex(w => w.participantId === client.id);

      if (existingIndex !== -1) {
        // Window exists - unminimize it
        return prev.map((w, idx) =>
          idx === existingIndex ? { ...w, isMinimized: false } : w
        );
      }

      // Create new window
      const newWindow: ChatWindow = {
        id: `chat-${Date.now()}`,
        participantId: client.id,
        isMinimized: false,
      };

      // Check how many non-minimized windows we have
      const openWindows = prev.filter(w => !w.isMinimized);

      if (openWindows.length >= MAX_OPEN_CHATS) {
        // Minimize the oldest open window
        const oldestOpen = openWindows[0];
        return [
          ...prev.map(w => w.id === oldestOpen.id ? { ...w, isMinimized: true } : w),
          newWindow,
        ];
      }

      return [...prev, newWindow];
    });

    // Mark as read when opening
    markAsRead(client.id);
  }, [markAsRead]);

  // Close a chat window
  const closeChat = useCallback((participantId: string) => {
    setChatWindows(prev => prev.filter(w => w.participantId !== participantId));
  }, []);

  // Minimize/unminimize a chat window
  const minimizeChat = useCallback((participantId: string) => {
    setChatWindows(prev => prev.map(w =>
      w.participantId === participantId ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  }, []);

  // Send message from chat widget input
  const sendWidgetMessage = (participantId: string) => {
    const text = newMessages[participantId]?.trim();
    if (!text) return;
    sendMessage(participantId, text);
    setNewMessages(prev => ({ ...prev, [participantId]: "" }));
  };

  // Download transcript for a conversation
  const handleDownloadTranscript = (participantId: string) => {
    const conversation = getConversation(participantId);
    if (!conversation) return;

    const rtfHeader = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fswiss Helvetica;}}
{\\colortbl;\\red43\\green138\\blue138;\\red100\\green100\\blue100;\\red0\\green0\\blue0;}
\\f0\\fs24
`;

    const title = `\\pard\\qc\\b\\fs32 Career Forward Message Transcript\\b0\\fs24\\par
\\pard\\qc\\cf2\\fs20 ${currentUser.firstName} ${currentUser.lastName} (Coach) & ${conversation.participant.name}\\par
Downloaded: ${new Date().toLocaleString()}\\cf0\\fs24\\par
\\pard\\par
`;

    const messages = conversation.messages.map((msg) => {
      const senderName = msg.senderId === currentUser.id
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : conversation.participant.name;
      const color = msg.senderId === currentUser.id ? "\\cf1" : "\\cf3";
      return `\\pard ${color}\\b ${senderName}\\b0\\cf0  \\i\\fs18\\cf2 ${msg.timestamp}\\cf0\\i0\\fs24\\par
\\pard ${msg.text}\\par\\par
`;
    }).join("");

    const rtfContent = rtfHeader + title + messages + "}";

    const blob = new Blob([rtfContent], { type: "application/rtf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${conversation.participant.name.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.rtf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get open (non-minimized) and minimized windows
  const openWindows = chatWindows.filter(w => !w.isMinimized);
  const minimizedWindows = chatWindows.filter(w => w.isMinimized);

  return (
    <ChatContext.Provider value={{
      conversations,
      getConversation,
      sendMessage,
      markAsRead,
      openChat,
      closeChat,
      minimizeChat,
      chatWindows,
    }}>
      {children}

      {/* Chat Widget UI */}
      {chatWindows.length > 0 && (
        <div className="fixed bottom-0 right-4 z-50 flex items-end gap-2">
          {/* Minimized Chat Bubbles */}
          {minimizedWindows.length > 0 && (
            <div className="flex gap-2 mb-2">
              {minimizedWindows.map((window) => {
                const conversation = getConversation(window.participantId);
                if (!conversation) return null;

                return (
                  <motion.div
                    key={window.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => minimizeChat(window.participantId)}
                    className="relative cursor-pointer group"
                  >
                    <img
                      src={conversation.participant.avatar}
                      alt={conversation.participant.name}
                      className={`w-12 h-12 rounded-full object-cover border-2 shadow-lg hover:shadow-xl transition-shadow ${
                        isDark ? "border-gray-700" : "border-white"
                      }`}
                    />
                    {conversation.participant.isOnline && (
                      <div className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 ${
                        isDark ? "border-gray-700" : "border-white"
                      }`} />
                    )}
                    {conversation.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{conversation.unread}</span>
                      </div>
                    )}
                    {/* Close button on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeChat(window.participantId);
                      }}
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center hidden group-hover:flex ${
                        isDark ? "bg-gray-600" : "bg-gray-700"
                      }`}
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Open Chat Windows */}
          <div className="flex gap-2">
            <AnimatePresence>
              {openWindows.map((window) => {
                const conversation = getConversation(window.participantId);
                if (!conversation) return null;

                return (
                  <motion.div
                    key={window.id}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className={`w-80 rounded-t-xl shadow-2xl border overflow-hidden ${
                      isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                    }`}
                  >
                    {/* Header */}
                    <div className={`px-4 py-3 flex items-center justify-between ${
                      isDark ? "bg-[#4FD1C5] text-gray-900" : "bg-[#2B8A8A] text-white"
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={conversation.participant.avatar}
                            alt={conversation.participant.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          {conversation.participant.isOnline && (
                            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 ${
                              isDark ? "border-[#4FD1C5]" : "border-[#2B8A8A]"
                            }`} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{conversation.participant.name}</p>
                          <p className={`text-xs ${isDark ? "text-gray-900/70" : "text-white/70"}`}>
                            {conversation.participant.isOnline ? "Active now" : "Offline"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDownloadTranscript(window.participantId)}
                          className={`p-1.5 rounded transition-colors ${
                            isDark ? "hover:bg-gray-900/20" : "hover:bg-white/20"
                          }`}
                          title="Download transcript"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => minimizeChat(window.participantId)}
                          className={`p-1.5 rounded transition-colors ${
                            isDark ? "hover:bg-gray-900/20" : "hover:bg-white/20"
                          }`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => closeChat(window.participantId)}
                          className={`p-1.5 rounded transition-colors ${
                            isDark ? "hover:bg-gray-900/20" : "hover:bg-white/20"
                          }`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className={`h-72 overflow-y-auto p-3 space-y-2 ${
                      isDark ? "bg-gray-800" : "bg-gray-50"
                    }`}>
                      {conversation.messages.length === 0 ? (
                        <div className={`text-center text-sm py-8 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Start a conversation with {conversation.participant.name.split(" ")[0]}</p>
                        </div>
                      ) : (
                        conversation.messages.map((message) => {
                          const isSelf = message.senderId === currentUser.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                                  isSelf
                                    ? isDark
                                      ? "bg-[#4FD1C5] text-gray-900 rounded-br-md"
                                      : "bg-[#2B8A8A] text-white rounded-br-md"
                                    : isDark
                                      ? "bg-gray-700 text-gray-100 rounded-bl-md"
                                      : "bg-white text-gray-900 rounded-bl-md shadow-sm"
                                }`}
                              >
                                <p>{message.text}</p>
                                <div className={`flex items-center gap-1 mt-0.5 ${isSelf ? "justify-end" : ""}`}>
                                  <span className={`text-[10px] ${
                                    isSelf
                                      ? isDark ? "text-gray-900/60" : "text-white/60"
                                      : isDark ? "text-gray-400" : "text-gray-400"
                                  }`}>
                                    {message.timestamp}
                                  </span>
                                  {isSelf && (
                                    message.status === "read" ? (
                                      <CheckCheck className={`h-3 w-3 ${isDark ? "text-gray-900/60" : "text-white/60"}`} />
                                    ) : (
                                      <Check className={`h-3 w-3 ${isDark ? "text-gray-900/60" : "text-white/60"}`} />
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Input */}
                    <div className={`p-3 border-t ${
                      isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-100"
                    }`}>
                      <div className="flex items-center gap-2">
                        <button className={`p-2 rounded-full transition-colors ${
                          isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                        }`}>
                          <Paperclip className="h-4 w-4" />
                        </button>
                        <input
                          type="text"
                          placeholder="Aa"
                          value={newMessages[window.participantId] || ""}
                          onChange={(e) => setNewMessages(prev => ({ ...prev, [window.participantId]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && sendWidgetMessage(window.participantId)}
                          className={`flex-1 px-3 py-2 rounded-full text-sm focus:outline-none focus:ring-2 ${
                            isDark
                              ? "bg-gray-800 text-white placeholder-gray-500 focus:ring-[#4FD1C5]/30"
                              : "bg-gray-100 text-gray-900 placeholder-gray-400 focus:ring-[#2B8A8A]/20"
                          }`}
                        />
                        <button
                          onClick={() => sendWidgetMessage(window.participantId)}
                          disabled={!newMessages[window.participantId]?.trim()}
                          className={`p-2 rounded-full transition-colors disabled:opacity-50 ${
                            isDark
                              ? "text-[#4FD1C5] hover:bg-[#4FD1C5]/10"
                              : "text-[#2B8A8A] hover:bg-[#2B8A8A]/10"
                          }`}
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </ChatContext.Provider>
  );
}
