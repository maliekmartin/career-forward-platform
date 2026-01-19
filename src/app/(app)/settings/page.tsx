"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import {
  User,
  Bell,
  Shield,
  Eye,
  Globe,
  Palette,
  Link2,
  Download,
  Trash2,
  ChevronRight,
  Camera,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const tabs = [
  { id: "profile", name: "Profile", icon: User },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "privacy", name: "Privacy & Coach", icon: Shield },
  { id: "preferences", name: "Preferences", icon: Palette },
  { id: "data", name: "Your Data", icon: Download },
];

export default function SettingsPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeTab, setActiveTab] = useState("profile");
  const [coachConnected, setCoachConnected] = useState(false);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Settings</h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>Manage your account and preferences</p>
      </motion.div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-64 flex-shrink-0"
        >
          <div className={`rounded-2xl border p-2 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-[#2B8A8A]/10 text-[#2B8A8A]"
                    : isDark
                      ? "text-gray-400 hover:bg-gray-800"
                      : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1"
        >
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Photo */}
              <div className={`rounded-2xl border p-6 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Profile Photo
                </h2>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-[#2B8A8A]/10 rounded-2xl flex items-center justify-center">
                      <span className="text-3xl font-bold text-[#2B8A8A]">
                        JD
                      </span>
                    </div>
                    <button className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                      isDark ? "bg-[#4FD1C5] text-gray-900 hover:bg-[#3DBDB0]" : "bg-[#2B8A8A] text-white hover:bg-[#237070]"
                    }`}>
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Upload a professional photo for your profile
                    </p>
                    <Button variant="outline" size="sm" className={isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}>
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className={`rounded-2xl border p-6 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Personal Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John"
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
                        isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
                        isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
                        isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="(509) 555-1234"
                      className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
                        isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
                      }`}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button className={`rounded-xl ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6">
              {/* Coach Connection */}
              <div className={`rounded-2xl border p-6 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                <h2 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Career Coach Connection
                </h2>
                <p className={`text-sm mb-6 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Connect with a career coach at your American Job Center to get
                  personalized support and guidance.
                </p>

                {coachConnected ? (
                  <div className={`rounded-xl p-4 ${isDark ? "bg-green-900/20 border border-green-800" : "bg-green-50 border border-green-200"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? "bg-green-900/30" : "bg-green-100"}`}>
                          <Check className={`h-5 w-5 ${isDark ? "text-green-400" : "text-green-600"}`} />
                        </div>
                        <div>
                          <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                            Connected with Sarah Johnson
                          </p>
                          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            Career Services Center
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCoachConnected(false)}
                        className={isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={`rounded-xl p-4 ${isDark ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                          No coach connected
                        </p>
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          Enter a coach code to connect
                        </p>
                      </div>
                      <Button
                        className={isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}
                        onClick={() => setCoachConnected(true)}
                      >
                        <Link2 className="h-4 w-4 mr-2" />
                        Connect Coach
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* What Coach Can See */}
              <div className={`rounded-2xl border p-6 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Coach Visibility Settings
                </h2>
                <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Control what your career coach can see when connected.
                </p>
                <div className="space-y-3">
                  {[
                    {
                      label: "Quest Progress",
                      description: "Your overall journey progress",
                    },
                    {
                      label: "Job Applications",
                      description: "Applications logged in Job Tracker",
                    },
                    {
                      label: "Saved Resumes",
                      description: "Resumes you've created",
                    },
                    {
                      label: "Achievements",
                      description: "Badges and milestones earned",
                    },
                    {
                      label: "Last Activity",
                      description: "When you last used the platform",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between p-3 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
                    >
                      <div>
                        <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{item.label}</p>
                        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          {item.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2B8A8A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2B8A8A] ${isDark ? "bg-gray-700" : "bg-gray-200"}`}></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className={`rounded-2xl border p-6 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
              <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: "Email Notifications",
                    description: "Receive updates via email",
                  },
                  {
                    label: "Application Reminders",
                    description: "Reminders to follow up on applications",
                  },
                  {
                    label: "Coach Messages",
                    description: "Messages from your career coach",
                  },
                  {
                    label: "Achievement Alerts",
                    description: "When you earn a new badge",
                  },
                  {
                    label: "Weekly Summary",
                    description: "Weekly progress report",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between p-4 border rounded-xl ${isDark ? "border-gray-800" : "border-gray-100"}`}
                  >
                    <div>
                      <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{item.label}</p>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#2B8A8A]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2B8A8A] ${isDark ? "bg-gray-700" : "bg-gray-200"}`}></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className={`rounded-2xl border p-6 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                <h2 className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Language
                </h2>
                <select className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] ${
                  isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-900"
                }`}>
                  <option>English</option>
                  <option>Español</option>
                  <option>Русский</option>
                  <option>Українська</option>
                  <option>Marshallese</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="space-y-6">
              <div className={`rounded-2xl border p-6 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                <h2 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Export Your Data
                </h2>
                <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Download all your data including resumes, applications, and
                  progress.
                </p>
                <Button variant="outline" className={isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>

              <div className={`rounded-2xl border p-6 ${isDark ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"}`}>
                <h2 className={`text-lg font-semibold mb-2 ${isDark ? "text-red-400" : "text-red-900"}`}>
                  Delete Account
                </h2>
                <p className={`text-sm mb-4 ${isDark ? "text-red-300" : "text-red-700"}`}>
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
                <Button variant="outline" className={`${isDark ? "text-red-400 border-red-700 hover:bg-red-900/30" : "text-red-600 border-red-300 hover:bg-red-100"}`}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
