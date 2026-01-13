"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import { useJobSeekerMessages, currentJobSeeker } from "@/lib/job-seeker-messages-context";
import {
  Send,
  Paperclip,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  Download,
  Bot,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesLoading />}>
      <MessagesContent />
    </Suspense>
  );
}

function MessagesLoading() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
      <div className={`rounded-xl border shadow-sm h-full flex items-center justify-center ${
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      }`}>
        <p className={isDark ? "text-gray-500" : "text-gray-400"}>Loading messages...</p>
      </div>
    </div>
  );
}

function MessagesContent() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const searchParams = useSearchParams();

  // Use shared messages context
  const { conversations, sendMessage, markAsRead, getConversation } = useJobSeekerMessages();

  // Get conversation from URL or default to first
  const conversationIdFromUrl = searchParams.get("conversation");
  const [selectedConversationId, setSelectedConversationId] = useState<string>(
    conversationIdFromUrl || conversations[0]?.id || "ai-conversation"
  );

  const selectedConversation = getConversation(selectedConversationId);

  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  // Mark as read when viewing
  useEffect(() => {
    if (selectedConversationId) {
      markAsRead(selectedConversationId);
    }
  }, [selectedConversationId, markAsRead]);

  // Update URL when conversation changes
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("conversation", selectedConversationId);
    window.history.replaceState({}, "", url.toString());
  }, [selectedConversationId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversationId) return;
    sendMessage(selectedConversationId, newMessage);
    setNewMessage("");
  };

  const handleDownloadTranscript = () => {
    if (!selectedConversation) return;

    // Generate RTF content
    const rtfHeader = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fswiss Helvetica;}{\\f1\\fmodern Courier New;}}
{\\colortbl;\\red43\\green138\\blue138;\\red100\\green100\\blue100;\\red0\\green0\\blue0;}
\\f0\\fs24
`;

    const title = `\\pard\\qc\\b\\fs32 Career Forward Message Transcript\\b0\\fs24\\par
\\pard\\qc\\cf2\\fs20 Conversation with ${selectedConversation.participant.name}\\par
Downloaded: ${new Date().toLocaleString()}\\cf0\\fs24\\par
\\pard\\par
\\pard\\brdrb\\brdrs\\brdrw10\\brsp20\\par
\\pard\\par
`;

    const messageContent = selectedConversation.messages.map((msg) => {
      const senderName = msg.senderId === currentJobSeeker.id
        ? `${currentJobSeeker.firstName} ${currentJobSeeker.lastName}`
        : selectedConversation.participant.name;
      const isSelf = msg.senderId === currentJobSeeker.id;
      const color = isSelf ? "\\cf1" : "\\cf3";
      return `\\pard ${color}\\b ${senderName}\\b0\\cf0  \\i\\fs18\\cf2 ${msg.timestamp}\\cf0\\i0\\fs24\\par
\\pard ${msg.text}\\par
\\pard\\par
`;
    }).join("");

    const rtfContent = rtfHeader + title + messageContent + "}";

    const blob = new Blob([rtfContent], { type: "application/rtf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${selectedConversation.participant.name.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.rtf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Truncate message for sidebar preview
  const truncateMessage = (msg: string, maxLength: number = 35) => {
    if (msg.length <= maxLength) return msg;
    return msg.substring(0, maxLength) + "...";
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border shadow-sm h-full flex overflow-hidden ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        {/* Conversation List Sidebar */}
        <div className={`w-80 border-r flex flex-col ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          <div className={`p-4 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
            <h2 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Messages
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversationId(conversation.id)}
                className={`w-full px-4 py-3 text-left transition-colors border-b ${
                  selectedConversationId === conversation.id
                    ? isDark ? "bg-gray-800 border-gray-800" : "bg-[#2B8A8A]/10 border-gray-100"
                    : isDark ? "border-gray-800 hover:bg-gray-800/50" : "border-gray-50 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    {conversation.type === "ai" ? (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isDark ? "bg-gradient-to-br from-[#4FD1C5] to-[#2B8A8A]" : "bg-gradient-to-br from-[#2B8A8A] to-[#1a5555]"
                      }`}>
                        <Bot className="h-6 w-6 text-white" />
                      </div>
                    ) : (
                      <img
                        src={conversation.participant.avatar}
                        alt={conversation.participant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    {conversation.participant.isOnline && (
                      <div className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 ${isDark ? "border-gray-900" : "border-white"}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
                        {conversation.participant.name}
                      </p>
                      <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        {conversation.lastMessageTime.split(", ")[0]}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {conversation.participant.role}
                    </p>
                    <p className={`text-sm mt-1 truncate ${
                      conversation.unreadCount > 0
                        ? isDark ? "text-gray-200 font-medium" : "text-gray-800 font-medium"
                        : isDark ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {truncateMessage(conversation.lastMessage)}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 bg-[#2B8A8A] dark:bg-[#4FD1C5] rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white dark:text-gray-900">{conversation.unreadCount}</span>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className={`p-4 border-b flex items-center justify-between ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  {selectedConversation.type === "ai" ? (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isDark ? "bg-gradient-to-br from-[#4FD1C5] to-[#2B8A8A]" : "bg-gradient-to-br from-[#2B8A8A] to-[#1a5555]"
                    }`}>
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <img
                      src={selectedConversation.participant.avatar}
                      alt={selectedConversation.participant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  {selectedConversation.participant.isOnline && (
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 ${isDark ? "border-gray-900" : "border-white"}`} />
                  )}
                </div>
                <div>
                  <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                    {selectedConversation.participant.name}
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {selectedConversation.participant.role} · {selectedConversation.participant.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadTranscript}
                  className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                  title="Download transcript"
                >
                  <Download className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                </button>
                {selectedConversation.type === "coach" && (
                  <>
                    <button className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                      <Phone className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                    </button>
                    <button className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                      <Video className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                    </button>
                  </>
                )}
                <button className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                  <Info className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.type === "ai" && (
                <div className={`text-center py-4 mb-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs ${
                    isDark ? "bg-gray-800" : "bg-gray-100"
                  }`}>
                    <Sparkles className="h-3 w-3" />
                    AI responses are simulated for demo purposes
                  </div>
                </div>
              )}
              {selectedConversation.messages.map((message) => {
                const isSelf = message.senderId === currentJobSeeker.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${isSelf ? "order-2" : ""}`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl whitespace-pre-wrap ${
                          isSelf
                            ? isDark
                              ? "bg-[#4FD1C5] text-gray-900 rounded-br-md"
                              : "bg-[#2B8A8A] text-white rounded-br-md"
                            : isDark
                              ? "bg-gray-800 text-white rounded-bl-md"
                              : "bg-gray-100 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      <div
                        className={`flex items-center gap-1 mt-1 ${
                          isSelf ? "justify-end" : "justify-start"
                        }`}
                      >
                        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{message.timestamp}</span>
                        {isSelf && (
                          <>
                            {message.status === "read" ? (
                              <CheckCheck className={`h-3 w-3 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
                            ) : message.status === "delivered" ? (
                              <CheckCheck className={`h-3 w-3 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                            ) : (
                              <Check className={`h-3 w-3 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className={`p-4 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <button className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                  <Paperclip className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                </button>
                <input
                  type="text"
                  placeholder={selectedConversation.type === "ai" ? "Ask Career Forward AI anything..." : "Type a message..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className={`flex-1 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                  }`}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`rounded-xl px-4 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className={isDark ? "text-gray-500" : "text-gray-400"}>Select a conversation</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
