"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MessageSquare,
  X,
  Clock,
  AlertTriangle,
  CheckCircle,
  Megaphone,
  Mail,
  ListTodo,
} from "lucide-react";
import { demoCoach, demoClients } from "@/lib/demo-data";
import { useTheme } from "@/lib/theme-context";
import { useChatContext } from "@/components/app/chat-widget";

// Page title mapping
const pageTitles: Record<string, string> = {
  "/coach/dashboard": "Dashboard",
  "/coach/tasks": "Tasks",
  "/coach/messages": "Messages",
  "/coach/resources": "Local Resources",
  "/coach/reports": "Reports",
  "/coach/settings": "Settings",
};

// Demo notifications
const demoNotifications = [
  {
    id: "notif-1",
    type: "task" as const,
    title: "Task Due Soon",
    message: "Call Aisha - Interview Prep is due in 1 hour",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "notif-2",
    type: "task" as const,
    title: "Overdue Task",
    message: "Follow up on application is overdue",
    time: "1 day ago",
    read: false,
  },
  {
    id: "notif-3",
    type: "message" as const,
    title: "New Message",
    message: "Marcus Thompson sent you a message",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "notif-4",
    type: "announcement" as const,
    title: "Platform Update",
    message: "New task management features are now available!",
    time: "1 day ago",
    read: true,
  },
  {
    id: "notif-5",
    type: "email" as const,
    title: "Email Summary",
    message: "You have 3 unread emails from job seekers",
    time: "3 hours ago",
    read: true,
  },
];

export function CoachHeader() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [notifications, setNotifications] = useState(demoNotifications);

  // Get conversations from shared chat context
  const { conversations, openChat, markAsRead } = useChatContext();

  const pageTitle = pageTitles[pathname] || "Dashboard";
  const unreadCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = conversations.reduce((acc, conv) => acc + conv.unread, 0);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Handle clicking a message - opens chat widget
  const handleMessageClick = (participantId: string) => {
    const client = demoClients.find(c => c.id === participantId);
    if (client) {
      openChat(client);
      setShowMessages(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task":
        return <ListTodo className="h-4 w-4" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "announcement":
        return <Megaphone className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string, read: boolean) => {
    if (read) return isDark ? "text-gray-500" : "text-gray-400";
    switch (type) {
      case "task":
        return isDark ? "text-amber-400" : "text-amber-500";
      case "message":
        return isDark ? "text-blue-400" : "text-blue-500";
      case "announcement":
        return isDark ? "text-purple-400" : "text-purple-500";
      case "email":
        return isDark ? "text-green-400" : "text-green-500";
      default:
        return isDark ? "text-gray-400" : "text-gray-500";
    }
  };

  return (
    <header className={`sticky top-0 z-40 px-6 py-4 border-b transition-colors ${
      isDark ? "bg-gray-950 border-gray-800" : "bg-[#F5F5F5] border-gray-200"
    }`}>
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          {pageTitle}
        </h1>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isDark ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
              aria-label={`Notifications - ${unreadCount} unread`}
              aria-expanded={showNotifications}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 top-12 w-80 rounded-xl shadow-lg border overflow-hidden z-50 ${
                      isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
                    }`}
                  >
                    {/* Header */}
                    <div className={`px-4 py-3 border-b flex items-center justify-between ${
                      isDark ? "border-gray-800" : "border-gray-100"
                    }`}>
                      <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className={`text-xs font-medium ${isDark ? "text-[#4FD1C5] hover:text-[#3DBDB0]" : "text-[#2B8A8A] hover:text-[#237070]"}`}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className={`p-6 text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => markNotificationAsRead(notif.id)}
                            className={`w-full px-4 py-3 text-left transition-colors border-b last:border-b-0 ${
                              notif.read
                                ? isDark ? "border-gray-800" : "border-gray-50"
                                : isDark ? "bg-gray-800/50 border-gray-800" : "bg-blue-50/50 border-gray-50"
                            } ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 ${getNotificationColor(notif.type, notif.read)}`}>
                                {getNotificationIcon(notif.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                  notif.read
                                    ? isDark ? "text-gray-400" : "text-gray-500"
                                    : isDark ? "text-white" : "text-gray-900"
                                }`}>
                                  {notif.title}
                                </p>
                                <p className={`text-xs mt-0.5 truncate ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                                  {notif.message}
                                </p>
                                <p className={`text-xs mt-1 ${isDark ? "text-gray-600" : "text-gray-300"}`}>
                                  {notif.time}
                                </p>
                              </div>
                              {!notif.read && (
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    <div className={`px-4 py-3 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                      <a
                        href="/coach/notifications"
                        className={`text-sm font-medium ${isDark ? "text-[#4FD1C5] hover:text-[#3DBDB0]" : "text-[#2B8A8A] hover:text-[#237070]"}`}
                      >
                        View all notifications
                      </a>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Messages */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
              }}
              className={`p-2 rounded-lg transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isDark ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
              aria-label={`Messages - ${unreadMessagesCount} unread`}
              aria-expanded={showMessages}
            >
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
              {unreadMessagesCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#2B8A8A] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </motion.button>

            {/* Messages Dropdown */}
            <AnimatePresence>
              {showMessages && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMessages(false)}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 top-12 w-80 rounded-xl shadow-lg border overflow-hidden z-50 ${
                      isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
                    }`}
                  >
                    {/* Header */}
                    <div className={`px-4 py-3 border-b flex items-center justify-between ${
                      isDark ? "border-gray-800" : "border-gray-100"
                    }`}>
                      <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                        Messages
                      </h3>
                      {unreadMessagesCount > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          isDark ? "bg-[#4FD1C5]/20 text-[#4FD1C5]" : "bg-[#2B8A8A]/10 text-[#2B8A8A]"
                        }`}>
                          {unreadMessagesCount} new
                        </span>
                      )}
                    </div>

                    {/* Messages List */}
                    <div className="max-h-80 overflow-y-auto">
                      {conversations.length === 0 ? (
                        <div className={`p-6 text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No messages</p>
                        </div>
                      ) : (
                        conversations.map((conv) => (
                          <button
                            key={conv.id}
                            onClick={() => handleMessageClick(conv.participant.id)}
                            className={`w-full text-left px-4 py-3 transition-colors border-b last:border-b-0 ${
                              conv.unread > 0
                                ? isDark ? "bg-gray-800/50 border-gray-800" : "bg-[#2B8A8A]/5 border-gray-50"
                                : isDark ? "border-gray-800" : "border-gray-50"
                            } ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative flex-shrink-0">
                                <img
                                  src={conv.participant.avatar}
                                  alt=""
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                {conv.participant.isOnline && (
                                  <span className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 ${isDark ? "border-gray-900" : "border-white"}`} />
                                )}
                                {conv.unread > 0 && (
                                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2B8A8A] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                                    {conv.unread}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <p className={`text-sm font-medium truncate ${
                                    conv.unread > 0
                                      ? isDark ? "text-white" : "text-gray-900"
                                      : isDark ? "text-gray-400" : "text-gray-600"
                                  }`}>
                                    {conv.participant.name}
                                  </p>
                                  <span className={`text-xs flex-shrink-0 ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                                    {conv.lastMessageTime}
                                  </span>
                                </div>
                                <p className={`text-xs mt-0.5 truncate ${
                                  conv.unread > 0
                                    ? isDark ? "text-gray-300" : "text-gray-600"
                                    : isDark ? "text-gray-500" : "text-gray-400"
                                }`}>
                                  {conv.lastMessage}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    <div className={`px-4 py-3 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                      <a
                        href="/coach/messages"
                        className={`text-sm font-medium ${isDark ? "text-[#4FD1C5] hover:text-[#3DBDB0]" : "text-[#2B8A8A] hover:text-[#237070]"}`}
                      >
                        View all messages
                      </a>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className={`flex items-center gap-3 pl-3 border-l ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <img
              src={demoCoach.avatar}
              alt=""
              className="w-9 h-9 rounded-full object-cover"
              aria-hidden="true"
            />
            <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              {demoCoach.firstName} {demoCoach.lastName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
