"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck,
  Download,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoCoach } from "@/lib/demo-data";
import { useTheme } from "@/lib/theme-context";
import { useChatContext, Conversation } from "@/components/app/chat-widget";

// Demo current user (coach view)
const currentUser = demoCoach;

export default function CoachMessagesPage() {
  // Use shared chat context for synced conversations
  const { conversations, sendMessage, markAsRead } = useChatContext();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    conversations.length > 0 ? conversations[0].participant.id : null
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Get the selected conversation from shared state
  const selectedConversation = selectedConversationId
    ? conversations.find(c => c.participant.id === selectedConversationId) || null
    : null;

  // Handle conversation selection
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversationId(conversation.participant.id);
    markAsRead(conversation.participant.id);
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    // Use the shared sendMessage from context - syncs with chat widget
    sendMessage(selectedConversation.participant.id, newMessage);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDownloadTranscript = () => {
    if (!selectedConversation) return;

    const rtfHeader = `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\fswiss Helvetica;}{\\f1\\fmodern Courier New;}}
{\\colortbl;\\red43\\green138\\blue138;\\red100\\green100\\blue100;\\red0\\green0\\blue0;}
\\f0\\fs24
`;

    const title = `\\pard\\qc\\b\\fs32 Career Forward Message Transcript\\b0\\fs24\\par
\\pard\\qc\\cf2\\fs20 Conversation between ${currentUser.firstName} ${currentUser.lastName} (Coach) and ${selectedConversation.participant.name}\\par
Downloaded: ${new Date().toLocaleString()}\\cf0\\fs24\\par
\\pard\\par
\\pard\\brdrb\\brdrs\\brdrw10\\brsp20\\par
\\pard\\par
`;

    const messages = selectedConversation.messages.map((msg) => {
      const senderName = msg.senderId === currentUser.id
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : selectedConversation.participant.name;
      const isSelf = msg.senderId === currentUser.id;
      const color = isSelf ? "\\cf1" : "\\cf3";
      return `\\pard ${color}\\b ${senderName}\\b0\\cf0  \\i\\fs18\\cf2 ${msg.timestamp}\\cf0\\i0\\fs24\\par
\\pard ${msg.text}\\par
\\pard\\par
`;
    }).join("");

    const rtfContent = rtfHeader + title + messages + "}";

    const blob = new Blob([rtfContent], { type: "application/rtf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${selectedConversation.participant.name.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.rtf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((acc, conv) => acc + conv.unread, 0);

  return (
    <div className="h-[calc(100vh-6rem)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              Messages
            </h1>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>
              {totalUnread > 0 ? `${totalUnread} unread messages` : "Chat with your clients"}
            </p>
          </div>
          <div className={`flex items-center gap-2 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>{conversations.length} active conversations</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-xl border shadow-sm h-[calc(100%-5rem)] flex overflow-hidden ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        {/* Conversations List */}
        <aside
          className={`w-80 border-r flex flex-col ${isDark ? "border-gray-800" : "border-gray-100"}`}
          role="complementary"
          aria-label="Conversation list"
        >
          {/* Search */}
          <div className={`p-4 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} aria-hidden="true" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                }`}
                aria-label="Search conversations"
              />
            </div>
          </div>

          {/* Conversation List */}
          <nav className="flex-1 overflow-y-auto" aria-label="Conversations">
            <ul role="list">
              {filteredConversations.map((conversation) => (
                <li key={conversation.id}>
                  <button
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full p-4 text-left cursor-pointer transition-colors border-b focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
                      selectedConversation?.id === conversation.id
                        ? isDark ? "bg-[#4FD1C5]/10" : "bg-[#2B8A8A]/5"
                        : isDark ? "hover:bg-gray-800 border-gray-800" : "hover:bg-gray-50 border-gray-50"
                    } ${isDark ? "border-gray-800" : "border-gray-50"}`}
                    aria-selected={selectedConversation?.id === conversation.id}
                    aria-label={`Conversation with ${conversation.participant.name}, ${conversation.unread > 0 ? `${conversation.unread} unread messages` : "no unread messages"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={conversation.participant.avatar}
                          alt=""
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.participant.isOnline && (
                          <span className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 ${isDark ? "border-gray-900" : "border-white"}`} aria-label="Online" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                            {conversation.participant.name}
                          </p>
                          <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? "bg-[#4FD1C5]" : "bg-[#2B8A8A]"}`}>
                          <span className={`text-xs font-medium ${isDark ? "text-gray-900" : "text-white"}`}>{conversation.unread}</span>
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Chat Area */}
        {selectedConversation ? (
          <main className="flex-1 flex flex-col" role="main" aria-label={`Chat with ${selectedConversation.participant.name}`}>
            {/* Chat Header */}
            <header className={`p-4 border-b flex items-center justify-between ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedConversation.participant.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {selectedConversation.participant.isOnline && (
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 ${isDark ? "border-gray-900" : "border-white"}`} aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                    {selectedConversation.participant.name}
                  </p>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    {selectedConversation.participant.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadTranscript}
                  className={`p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                  aria-label="Download transcript"
                >
                  <Download className="h-5 w-5" aria-hidden="true" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                  aria-label="Start voice call"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                  aria-label="Start video call"
                >
                  <Video className="h-5 w-5" aria-hidden="true" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                  aria-label="View contact info"
                >
                  <Info className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>
            </header>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4"
              role="log"
              aria-label="Message history"
              aria-live="polite"
            >
              <AnimatePresence initial={false}>
                {selectedConversation.messages.map((message, index) => {
                  const isSelf = message.senderId === currentUser.id;
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[70%] ${isSelf ? "order-2" : ""}`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl ${
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
                          <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                            {message.timestamp}
                          </span>
                          {isSelf && (
                            <>
                              {message.status === "read" ? (
                                <CheckCheck className={`h-3 w-3 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} aria-label="Read" />
                              ) : message.status === "delivered" ? (
                                <CheckCheck className={`h-3 w-3 ${isDark ? "text-gray-500" : "text-gray-400"}`} aria-label="Delivered" />
                              ) : (
                                <Check className={`h-3 w-3 ${isDark ? "text-gray-500" : "text-gray-400"}`} aria-label="Sent" />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <footer className={`p-4 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                  aria-label="Attach file"
                >
                  <Paperclip className="h-5 w-5" aria-hidden="true" />
                </motion.button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`flex-1 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                  }`}
                  aria-label="Type a message"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`rounded-xl px-4 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </footer>
          </main>
        ) : (
          <div className={`flex-1 flex items-center justify-center ${isDark ? "text-gray-500" : "text-gray-500"}`}>
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
