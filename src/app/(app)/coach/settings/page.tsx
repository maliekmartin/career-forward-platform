"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Camera,
  Mail,
  Phone,
  Globe,
  Users,
  Save,
  CheckCircle2,
  Building2,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoCoach } from "@/lib/demo-data";
import { useTheme } from "@/lib/theme-context";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export default function CoachSettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "caseload" | "appearance">("profile");
  const [saved, setSaved] = useState(false);
  const [inactivityAlert, setInactivityAlert] = useState("3 days");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "caseload", name: "Caseload Settings", icon: Users },
    { id: "appearance", name: "Appearance", icon: Sun },
  ] as const;

  const themeOptions = [
    { id: "light", name: "Light", icon: Sun, description: "Light background with dark text" },
    { id: "dark", name: "Dark", icon: Moon, description: "Dark background with light text" },
    { id: "system", name: "System", icon: Monitor, description: "Follow your system preference" },
  ] as const;

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
          Coach Settings
        </h1>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Manage your profile and preferences
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        variants={itemVariants}
        className="flex gap-2 mb-6"
        role="tablist"
        aria-label="Settings sections"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              activeTab === tab.id
                ? isDark
                  ? "bg-[#4FD1C5] text-gray-900"
                  : "bg-[#2B8A8A] text-white"
                : isDark
                ? "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
          >
            <tab.icon className="h-4 w-4" aria-hidden="true" />
            {tab.name}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        variants={itemVariants}
        className={`rounded-2xl border p-8 ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}
        role="tabpanel"
        id={`${activeTab}-panel`}
        aria-labelledby={activeTab}
      >
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-8">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={demoCoach.avatar}
                  alt={`${demoCoach.firstName} ${demoCoach.lastName}'s profile photo`}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <button
                  className={`absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isDark ? "bg-[#4FD1C5] text-gray-900" : "bg-[#2B8A8A] text-white"}`}
                  aria-label="Change profile photo"
                >
                  <Camera className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div>
                <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Profile Photo</h3>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Recommended: Square image, at least 200x200px
                </p>
              </div>
            </div>

            {/* Personal Info */}
            <fieldset>
              <legend className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Personal Information
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    defaultValue={demoCoach.firstName}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    defaultValue={demoCoach.lastName}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    <Mail className="h-4 w-4 inline mr-1" aria-hidden="true" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    defaultValue={demoCoach.email}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    <Phone className="h-4 w-4 inline mr-1" aria-hidden="true" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    defaultValue="(509) 555-0199"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
              </div>
            </fieldset>

            {/* Organization */}
            <fieldset>
              <legend className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Organization
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="organization" className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    <Building2 className="h-4 w-4 inline mr-1" aria-hidden="true" />
                    Organization Name
                  </label>
                  <input
                    type="text"
                    id="organization"
                    defaultValue={demoCoach.organization}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  />
                </div>
                <div>
                  <label htmlFor="region" className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    <Globe className="h-4 w-4 inline mr-1" aria-hidden="true" />
                    Region
                  </label>
                  <select
                    id="region"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    <option>Spokane County</option>
                    <option>King County</option>
                    <option>Pierce County</option>
                    <option>Snohomish County</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Fun Fact */}
            <fieldset>
              <legend className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Fun Fact (visible to clients)
              </legend>
              <div className="grid grid-cols-3 gap-4">
                <select
                  aria-label="Fun fact category"
                  className={`px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  <option>{demoCoach.quirkyFact.prompt}</option>
                  <option>Hidden talent</option>
                  <option>Favorite animal</option>
                  <option>Coffee or tea?</option>
                </select>
                <input
                  type="text"
                  defaultValue={demoCoach.quirkyFact.answer}
                  aria-label="Fun fact answer"
                  className={`col-span-2 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                />
              </div>
            </fieldset>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <fieldset>
              <legend className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Email Notifications
              </legend>
              <div className="space-y-4" role="group" aria-label="Email notification preferences">
                {[
                  { id: "milestone", label: "Client reaches a milestone", description: "Get notified when clients complete quest milestones", default: true },
                  { id: "hired", label: "Client gets hired", description: "Receive notification when a client lands a job", default: true },
                  { id: "inactive", label: "Client becomes inactive", description: "Alert when clients haven't logged in for a while", default: true },
                  { id: "message", label: "New messages", description: "Get notified of new client messages", default: true },
                  { id: "weekly", label: "Weekly caseload summary", description: "Receive a weekly digest of caseload activity", default: false },
                ].map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
                  >
                    <div>
                      <label htmlFor={item.id} className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        {item.label}
                      </label>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{item.description}</p>
                    </div>
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={item.id}
                        defaultChecked={item.default}
                        className="sr-only peer"
                      />
                      <label
                        htmlFor={item.id}
                        className={`block w-11 h-6 rounded-full cursor-pointer transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 ${
                          isDark ? "bg-gray-700 peer-checked:bg-[#4FD1C5]" : "bg-gray-200 peer-checked:bg-[#2B8A8A]"
                        }`}
                      >
                        <span className="block w-5 h-5 bg-white rounded-full shadow transform transition-transform translate-x-0.5 translate-y-0.5 peer-checked:translate-x-5" />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Inactivity Alerts
              </legend>
              <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Alert me when clients haven't logged in for:
              </p>
              <div className="flex gap-3" role="radiogroup" aria-label="Inactivity alert timing">
                {["1 day", "3 days", "7 days", "Never"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setInactivityAlert(option)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      inactivityAlert === option
                        ? isDark
                          ? "bg-[#4FD1C5] text-gray-900"
                          : "bg-[#2B8A8A] text-white"
                        : isDark
                        ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    role="radio"
                    aria-checked={inactivityAlert === option}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        )}

        {/* Caseload Tab */}
        {activeTab === "caseload" && (
          <div className="space-y-6">
            <div>
              <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Caseload Capacity
              </h3>
              <div className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Current Clients</span>
                  <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {demoCoach.clientCount} / {demoCoach.maxClients}
                  </span>
                </div>
                <div
                  className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                  role="progressbar"
                  aria-valuenow={demoCoach.clientCount}
                  aria-valuemin={0}
                  aria-valuemax={demoCoach.maxClients}
                  aria-label="Caseload capacity"
                >
                  <motion.div
                    className={`h-full rounded-full ${isDark ? "bg-[#4FD1C5]" : "bg-[#2B8A8A]"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(demoCoach.clientCount / demoCoach.maxClients) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="maxClients" className={`font-semibold block mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Maximum Clients
              </label>
              <select
                id="maxClients"
                defaultValue="25 clients"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
              >
                <option>15 clients</option>
                <option>20 clients</option>
                <option>25 clients</option>
                <option>30 clients</option>
                <option>No limit</option>
              </select>
              <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Set your maximum caseload capacity
              </p>
            </div>

            <div>
              <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Auto-Assignment</h3>
              <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                <div>
                  <label htmlFor="autoAssign" className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                    Accept new client assignments
                  </label>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Allow the system to auto-assign new clients to your caseload
                  </p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    id="autoAssign"
                    defaultChecked={true}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="autoAssign"
                    className={`block w-11 h-6 rounded-full cursor-pointer transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2 ${
                      isDark ? "bg-gray-700 peer-checked:bg-[#4FD1C5]" : "bg-gray-200 peer-checked:bg-[#2B8A8A]"
                    }`}
                  >
                    <span className="block w-5 h-5 bg-white rounded-full shadow transform transition-transform translate-x-0.5 translate-y-0.5 peer-checked:translate-x-5" />
                  </label>
                </div>
              </div>
            </div>

            <fieldset>
              <legend className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Default Notification Settings for New Clients
              </legend>
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <label htmlFor="emailMilestone" className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Email on milestone
                    </label>
                    <input
                      type="checkbox"
                      id="emailMilestone"
                      defaultChecked
                      className="h-4 w-4 text-[#2B8A8A] rounded focus:ring-primary"
                    />
                  </div>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                  <label htmlFor="defaultInactivity" className={`text-sm block mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Inactivity alert after
                  </label>
                  <select
                    id="defaultInactivity"
                    defaultValue="3 days"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
                      isDark
                        ? "bg-gray-900 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    <option>1 day</option>
                    <option>3 days</option>
                    <option>7 days</option>
                  </select>
                </div>
              </div>
            </fieldset>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div className="space-y-6">
            <div>
              <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Theme</h3>
              <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Choose how Career Forward looks for you
              </p>
              <div className="grid grid-cols-3 gap-4" role="radiogroup" aria-label="Theme selection">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = theme === option.id;
                  return (
                    <motion.button
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme(option.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isSelected
                          ? isDark ? "border-[#4FD1C5]" : "border-[#2B8A8A]"
                          : isDark
                          ? "border-gray-700 hover:border-gray-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      role="radio"
                      aria-checked={isSelected}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        isSelected
                          ? isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/10"
                          : isDark
                          ? "bg-gray-800"
                          : "bg-gray-100"
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          isSelected
                            ? isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"
                            : isDark
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`} aria-hidden="true" />
                      </div>
                      <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{option.name}</p>
                      <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {option.description}
                      </p>
                      {isSelected && (
                        <motion.div
                          layoutId="theme-indicator"
                          className={`mt-3 flex items-center gap-1 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`}
                        >
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                          <span className="text-sm font-medium">Active</span>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
              <h4 className={`font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Preview</h4>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Your current theme is <span className="font-medium capitalize">{theme}</span>
                {theme === "system" && ` (currently ${resolvedTheme})`}
              </p>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className={`flex items-center justify-end gap-3 mt-8 pt-6 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`flex items-center gap-2 text-sm ${isDark ? "text-green-400" : "text-green-600"}`}
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Settings saved!
              </motion.span>
            )}
          </AnimatePresence>
          <Button
            variant="outline"
            className={isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className={`gap-2 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Save Changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
