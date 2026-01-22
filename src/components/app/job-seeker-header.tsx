"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MessageSquare,
  Trophy,
  Target,
  Briefcase,
  Calendar,
  Bot,
  User,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useJobSeekerMessages } from "@/lib/job-seeker-messages-context";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  profilePhotoUrl: string | null;
}

// Page title mapping
const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/messages": "Messages",
  "/job-board": "Job Board",
  "/resume-builder": "Resume Builder",
  "/job-tracker": "Job Tracker",
  "/interview-prep": "Interview Prep",
  "/assessments": "Assessments",
  "/resources": "Local Resources",
  "/achievements": "Achievements",
  "/settings": "Settings",
};

// Demo notifications
const demoNotifications = [
  {
    id: "notif-1",
    type: "achievement" as const,
    title: "Achievement Unlocked!",
    message: "You completed your profile - +50 XP",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "notif-2",
    type: "message" as const,
    title: "New Message",
    message: "Sarah Johnson sent you a message",
    time: "3 hours ago",
    read: false,
  },
  {
    id: "notif-3",
    type: "reminder" as const,
    title: "Interview Tomorrow",
    message: "Don't forget your interview at Tech Corp at 10:00 AM",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "notif-4",
    type: "job" as const,
    title: "New Job Match",
    message: "3 new jobs match your profile",
    time: "1 day ago",
    read: true,
  },
];

export function JobSeekerHeader() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Use shared messages context
  const { conversations, totalUnreadCount } = useJobSeekerMessages();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [notifications, setNotifications] = useState(demoNotifications);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setUser(data.profile);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const pageTitle = pageTitles[pathname] || "Dashboard";
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const markNotifAsRead = (id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllNotifsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return <Trophy className="h-4 w-4" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      case "reminder":
        return <Calendar className="h-4 w-4" />;
      case "job":
        return <Briefcase className="h-4 w-4" />;
      case "milestone":
        return <Target className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string, read: boolean) => {
    if (read) return isDark ? "text-gray-500" : "text-gray-400";
    switch (type) {
      case "achievement":
        return isDark ? "text-yellow-400" : "text-yellow-500";
      case "message":
        return isDark ? "text-blue-400" : "text-blue-500";
      case "reminder":
        return isDark ? "text-red-400" : "text-red-500";
      case "job":
        return isDark ? "text-green-400" : "text-green-500";
      case "milestone":
        return isDark ? "text-purple-400" : "text-purple-500";
      default:
        return isDark ? "text-gray-400" : "text-gray-500";
    }
  };

  // Truncate last message for preview
  const truncateMessage = (msg: string, maxLength: number = 40) => {
    if (msg.length <= maxLength) return msg;
    return msg.substring(0, maxLength) + "...";
  };

  return (
    <header className={`sticky top-0 z-40 px-6 py-4 border-b transition-colors ${
      isDark ? "bg-gray-950 border-gray-800" : "bg-[#F5F5F5] border-gray-200"
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            {pageTitle}
          </h1>
          {pathname === "/dashboard" && (
            <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Welcome back{user?.firstName ? `, ${user.firstName}` : ""}! Let's continue your quest.
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowMessages(false);
              }}
              className={`p-2 rounded-lg transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                isDark ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              }`}
              aria-label={`Notifications - ${unreadNotifCount} unread`}
              aria-expanded={showNotifications}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {unreadNotifCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                >
                  {unreadNotifCount}
                </motion.span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 top-12 w-80 rounded-xl shadow-lg border overflow-hidden z-50 ${
                      isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
                    }`}
                  >
                    <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                      <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Notifications</h3>
                      {unreadNotifCount > 0 && (
                        <button onClick={markAllNotifsAsRead} className={`text-xs font-medium ${isDark ? "text-[#4FD1C5] hover:text-[#3DBDB0]" : "text-[#2B8A8A] hover:text-[#237070]"}`}>
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => markNotifAsRead(notif.id)}
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
                              <p className={`text-sm font-medium ${notif.read ? (isDark ? "text-gray-400" : "text-gray-500") : (isDark ? "text-white" : "text-gray-900")}`}>
                                {notif.title}
                              </p>
                              <p className={`text-xs mt-0.5 truncate ${isDark ? "text-gray-500" : "text-gray-400"}`}>{notif.message}</p>
                              <p className={`text-xs mt-1 ${isDark ? "text-gray-600" : "text-gray-300"}`}>{notif.time}</p>
                            </div>
                            {!notif.read && <div className="w-2 h-2 rounded-full bg-[#2B8A8A] dark:bg-[#4FD1C5] mt-2" />}
                          </div>
                        </button>
                      ))}
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
              aria-label={`Messages${totalUnreadCount > 0 ? ` - ${totalUnreadCount} unread` : ""}`}
              aria-expanded={showMessages}
            >
              <MessageSquare className="h-5 w-5" aria-hidden="true" />
              {totalUnreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-4 h-4 bg-[#2B8A8A] dark:bg-[#4FD1C5] rounded-full text-[10px] font-bold text-white dark:text-gray-900 flex items-center justify-center"
                >
                  {totalUnreadCount}
                </motion.span>
              )}
            </motion.button>

            {/* Messages Dropdown - Conversation List Style */}
            <AnimatePresence>
              {showMessages && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMessages(false)} />
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
                    <div className={`px-4 py-3 border-b flex items-center justify-between ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                      <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Messages</h3>
                      <Link
                        href="/messages"
                        onClick={() => setShowMessages(false)}
                        className={`text-xs font-medium ${isDark ? "text-[#4FD1C5] hover:text-[#3DBDB0]" : "text-[#2B8A8A] hover:text-[#237070]"}`}
                      >
                        View all
                      </Link>
                    </div>

                    {/* Conversation List */}
                    <div className="max-h-80 overflow-y-auto">
                      {conversations.map((conversation) => (
                        <Link
                          key={conversation.id}
                          href={`/messages?conversation=${conversation.id}`}
                          onClick={() => setShowMessages(false)}
                          className={`block px-4 py-3 transition-colors border-b last:border-b-0 ${
                            conversation.unreadCount > 0
                              ? isDark ? "bg-gray-800/50 border-gray-800" : "bg-[#2B8A8A]/5 border-gray-50"
                              : isDark ? "border-gray-800" : "border-gray-50"
                          } ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
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
                                  {conversation.lastMessageTime.split(", ")[0] || conversation.lastMessageTime}
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
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <Link href="/settings" className={`flex items-center gap-3 pl-3 border-l transition-colors ${isDark ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-100"} rounded-lg px-3 py-1.5 -mr-3`}>
            {user?.profilePhotoUrl ? (
              <img
                src={user.profilePhotoUrl}
                alt=""
                className="w-9 h-9 rounded-full object-cover"
                aria-hidden="true"
              />
            ) : (
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/10"}`}>
                <User className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} />
              </div>
            )}
            <span className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
              {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
