"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, DollarSign, Clock, Bookmark, Search, User } from "lucide-react";

type DemoTab = "dashboard" | "messages" | "job-board" | "compass" | "resume" | "job-tracker" | "interview-prep";

export function InteractiveDashboardDemo() {
  const [activeTab, setActiveTab] = useState<DemoTab>("job-tracker");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "square", section: "main" },
    { id: "messages", label: "Messages", icon: "circle", section: "main" },
    { id: "job-board", label: "Job Board", icon: "square", section: "main" },
    { id: "compass", label: "Compass AI", icon: "diamond", section: "tools" },
    { id: "resume", label: "Resume Builder", icon: "square", section: "tools" },
    { id: "job-tracker", label: "Job Tracker", icon: "circle", section: "tools" },
    { id: "interview-prep", label: "Interview Prep", icon: "square", section: "tools" },
  ] as const;

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="bg-white/90 backdrop-blur-2xl border border-[#7C5FF5]/20 rounded-3xl shadow-2xl overflow-hidden max-w-7xl mx-auto"
    >
      {/* Mock browser chrome */}
      <div className="flex items-center gap-2 px-5 py-3 bg-gray-50/50 border-b border-gray-200/50">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <div className="ml-4 text-xs text-gray-500 font-medium">app.careerforward.io/dashboard</div>
      </div>

      <div className="flex h-[720px]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
          {/* Logo */}
          <div className="p-5 border-b border-gray-100">
            <Image
              src="/branding/logo.svg"
              alt="Career Forward"
              width={140}
              height={35}
            />
          </div>

          {/* Quest Progress */}
          <div className="px-4 py-4">
            <div className="bg-gradient-to-br from-[#F3E8FF] to-[#E9D5FF] rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">Your Career Quest</span>
                <span className="text-xs font-bold text-[#7C5FF5]">32%</span>
              </div>
              <div className="flex gap-1">
                {[100, 60, 0, 0, 0].map((progress, i) => (
                  <div key={i} className="flex-1 h-2 rounded-full bg-white/50 overflow-hidden">
                    <div
                      className="h-full bg-[#7C5FF5] rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-400 uppercase px-3 py-2">Main</div>
            {tabs.filter(t => t.section === "main").map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DemoTab)}
                className={`w-full text-left rounded-xl px-3 py-2.5 text-sm font-medium flex items-center gap-2.5 transition-all ${
                  activeTab === tab.id
                    ? "bg-[#7C5FF5]/10 text-[#7C5FF5]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className={`w-4 h-4 flex items-center justify-center ${
                  activeTab === tab.id ? "bg-[#7C5FF5]" : ""
                } rounded`}>
                  {tab.icon === "square" && (
                    <div className={`w-2.5 h-2.5 ${activeTab === tab.id ? "bg-white" : "bg-gray-400"} rounded-sm`} />
                  )}
                  {tab.icon === "circle" && (
                    <div className={`w-2.5 h-2.5 ${activeTab === tab.id ? "bg-white" : "bg-gray-400"} rounded-full`} />
                  )}
                </div>
                {tab.label}
              </button>
            ))}

            <div className="text-xs font-semibold text-gray-400 uppercase px-3 py-2 pt-4">Tools</div>
            {tabs.filter(t => t.section === "tools").map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DemoTab)}
                className={`w-full text-left rounded-xl px-3 py-2.5 text-sm font-medium flex items-center gap-2.5 transition-all ${
                  activeTab === tab.id
                    ? "bg-[#7C5FF5]/10 text-[#7C5FF5]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  {tab.icon === "diamond" && (
                    <div className={`w-2.5 h-2.5 ${activeTab === tab.id ? "bg-[#A78BFA]" : "bg-gray-400"} rounded-sm rotate-45`} />
                  )}
                  {tab.icon === "square" && (
                    <div className={`w-2.5 h-2.5 ${activeTab === tab.id ? "bg-gray-400" : "bg-gray-400"}`} />
                  )}
                  {tab.icon === "circle" && (
                    <div className={`w-2.5 h-2.5 ${activeTab === tab.id ? "bg-gray-400" : "bg-gray-400"} rounded-full`} />
                  )}
                </div>
                {tab.label}
              </button>
            ))}
          </div>

          {/* User profile */}
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">Job Seeker</div>
                <div className="text-xs text-gray-500">View Profile</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-gradient-to-br from-[#FAFBFC] to-white overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full p-6 overflow-y-auto"
            >
              {activeTab === "dashboard" && <DashboardContent />}
              {activeTab === "messages" && <MessagesContent />}
              {activeTab === "job-board" && <JobBoardContent />}
              {activeTab === "compass" && <CompassContent />}
              {activeTab === "resume" && <ResumeContent />}
              {activeTab === "job-tracker" && <JobTrackerContent />}
              {activeTab === "interview-prep" && <InterviewPrepContent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardContent() {
  return (
    <>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome back! Let's keep the momentum going.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#E9D5FF" strokeWidth="3" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="#7C5FF5" strokeWidth="3"
                  strokeDasharray="32 100" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#7C5FF5]">32%</div>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">Quest Progress</div>
              <div className="text-xs text-gray-500">Stage 2 of 5</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <div className="w-5 h-5 bg-blue-500 rounded-sm" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-xs text-gray-500">Applications</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
              <div className="w-5 h-5 bg-[#7C5FF5] rounded-full" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-xs text-gray-500">Interviews</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <div className="text-sm font-bold text-gray-900 mb-4">Recent Activity</div>
        <div className="space-y-3">
          {[
            { company: "TC", title: "Marketing Coordinator", org: "TechCorp", time: "2d ago", status: "green", action: "Interview scheduled for Friday" },
            { company: "II", title: "Junior Designer", org: "Innovate Inc", time: "5d ago", status: "yellow", action: "Application under review" },
            { company: "SC", title: "Content Writer", org: "StartUp Co", time: "1w ago", status: "yellow", action: "Waiting for response" },
          ].map((app, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition">
              <div className={`w-10 h-10 rounded-lg ${
                app.company === "TC" ? "bg-[#7C5FF5]/10" : app.company === "II" ? "bg-[#A78BFA]/10" : "bg-blue-500/10"
              } flex items-center justify-center text-xs font-bold ${
                app.company === "TC" ? "text-[#7C5FF5]" : app.company === "II" ? "text-[#A78BFA]" : "text-blue-600"
              }`}>
                {app.company}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{app.title}</div>
                <div className="text-xs text-gray-500">{app.org} • {app.time}</div>
                <div className="text-xs text-gray-600 mt-0.5">{app.action}</div>
              </div>
              <div className={`w-3 h-3 rounded-full ${app.status === "green" ? "bg-green-500" : "bg-yellow-500"}`} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function MessagesContent() {
  return (
    <>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Messages</h2>
        <p className="text-sm text-gray-500">Communication hub for all your job applications</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-12 border border-blue-100 text-center">
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Coming Soon!</h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Direct messaging with employers, interview scheduling, and automated follow-ups all in one place.
        </p>
      </div>
    </>
  );
}

function JobBoardContent() {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Job Board</h2>
          <p className="text-sm text-gray-500">Browse thousands of opportunities</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C5FF5]/20 w-64"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {[
          {
            title: "Senior Marketing Manager",
            company: "TechCorp",
            logo: "TC",
            location: "Seattle, WA",
            salary: "$95K - $130K",
            type: "Full-time",
            posted: "2 days ago",
            remote: true,
            description: "Lead marketing initiatives for rapidly growing SaaS company. 5+ years experience required."
          },
          {
            title: "Product Designer",
            company: "Innovate Labs",
            logo: "IL",
            location: "San Francisco, CA",
            salary: "$105K - $145K",
            type: "Full-time",
            posted: "5 days ago",
            remote: false,
            description: "Design beautiful, user-centric products for millions of users. Portfolio required."
          },
          {
            title: "Content Strategist",
            company: "Digital Agency",
            logo: "DA",
            location: "Remote",
            salary: "$75K - $95K",
            type: "Contract",
            posted: "1 week ago",
            remote: true,
            description: "Develop content strategies for Fortune 500 clients. 3+ years in content marketing."
          },
        ].map((job, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
              {/* Company Logo */}
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-[#7C5FF5]/10 to-[#A78BFA]/10 flex items-center justify-center flex-shrink-0 border border-[#7C5FF5]/20">
                <span className="text-sm font-bold text-[#7C5FF5]">{job.logo}</span>
              </div>

              {/* Job Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.remote && (
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                        Remote
                      </span>
                    )}
                    <span className="text-xs font-medium text-[#7C5FF5] bg-[#7C5FF5]/10 px-2.5 py-1 rounded-full">
                      {job.type}
                    </span>
                  </div>
                </div>

                {/* Location, Salary, Posted */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-green-600">{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{job.posted}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{job.description}</p>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-[#7C5FF5] text-white text-sm font-semibold rounded-lg hover:bg-[#6B4FE4] transition shadow-sm">
                    Apply Now
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#7C5FF5]/30 text-[#7C5FF5] text-sm font-medium rounded-lg hover:bg-[#7C5FF5]/5 transition">
                    <User className="w-4 h-4" />
                    Find Hiring Manager
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
                    <Bookmark className="w-4 h-4" />
                    Save
                  </button>
                  <button className="text-sm text-[#7C5FF5] font-medium hover:underline ml-auto">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function CompassContent() {
  return (
    <>
      <div className="mb-5 flex items-center gap-4">
        <Image
          src="/compass-ai.svg"
          alt="Compass AI"
          width={56}
          height={56}
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Compass AI Coach</h2>
          <p className="text-sm text-gray-500">Your 24/7 career assistant</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#F3E8FF] to-[#E9D5FF] rounded-xl p-5 border border-[#7C5FF5]/20 mb-5">
        <div className="text-sm font-semibold text-[#7C5FF5] mb-3">💡 Suggested Actions</div>
        <div className="space-y-2.5">
          <div className="bg-white/90 rounded-lg p-3 text-sm text-gray-700">
            "Update your resume summary to highlight your marketing achievements"
          </div>
          <div className="bg-white/90 rounded-lg p-3 text-sm text-gray-700">
            "Practice behavioral interview questions for your upcoming TechCorp interview"
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
        <div className="text-sm font-bold text-gray-900 mb-4">Chat with Compass</div>
        <div className="space-y-3 mb-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] flex-shrink-0" />
            <div className="bg-[#F3E8FF] rounded-lg p-3 text-sm text-gray-800 max-w-md">
              Hi! How can I help you with your job search today? I can help with resume tips, interview prep, or career advice.
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask me anything about your career..."
            className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C5FF5]/20"
          />
          <button className="px-5 py-3 bg-[#7C5FF5] text-white text-sm font-medium rounded-lg hover:bg-[#6B4FE4] transition">
            Send
          </button>
        </div>
      </div>
    </>
  );
}

function ResumeContent() {
  return (
    <>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Resume Builder</h2>
        <p className="text-sm text-gray-500">Create ATS-optimized resumes with AI assistance</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-5 border border-green-100 text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">87</div>
          <div className="text-sm text-gray-600 font-medium">Resume Score</div>
          <div className="text-xs text-gray-500 mt-1">Above average</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
          <div className="text-sm text-gray-600 font-medium">Resume Versions</div>
          <div className="text-xs text-gray-500 mt-1">Tailored for roles</div>
        </div>
      </div>

      <div className="space-y-3">
        {["Marketing Resume - General", "Tech Industry Resume", "Creative Portfolio Resume"].map((name, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#7C5FF5]/10 rounded-lg flex items-center justify-center">
                  <div className="w-5 h-5 bg-[#7C5FF5]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{name}</div>
                  <div className="text-xs text-gray-500">Updated 2 days ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-green-600">87/100</span>
                <span className="text-sm text-[#7C5FF5] font-medium">Edit →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function JobTrackerContent() {
  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Job Tracker</h2>
          <p className="text-sm text-gray-500">Manage every stage of your applications</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#7C5FF5] text-white text-sm font-medium rounded-lg hover:bg-[#6B4FE4] transition shadow-lg shadow-[#7C5FF5]/30">
          <Plus className="w-4 h-4" />
          Add Job
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: "Applied", value: "8", color: "bg-blue-500" },
          { label: "1st Interview", value: "3", color: "bg-purple-500" },
          { label: "2nd Interview", value: "2", color: "bg-indigo-500" },
          { label: "Offer", value: "1", color: "bg-green-500" },
          { label: "Accepted", value: "0", color: "bg-amber-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
            <div className={`text-2xl font-bold ${
              stat.color.replace('bg-', 'text-')
            } mb-1`}>{stat.value}</div>
            <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {[
          { company: "TechCorp", role: "Marketing Manager", stage: "1st Interview", date: "Interview: May 18", status: "green" },
          { company: "Innovate Labs", role: "Product Designer", stage: "2nd Interview", date: "Final round scheduled", status: "green" },
          { company: "Digital Agency", role: "Content Strategist", stage: "Offer", date: "Offer received", status: "green" },
          { company: "StartUp Co", role: "Social Media Manager", stage: "Applied", date: "Applied May 10", status: "yellow" },
          { company: "Global Brands", role: "Brand Manager", stage: "1st Interview", date: "Scheduled for May 20", status: "green" },
          { company: "Creative Studio", role: "Art Director", stage: "Applied", date: "Applied May 8", status: "yellow" },
        ].map((app, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                app.status === "green" ? "bg-green-500" : app.status === "yellow" ? "bg-yellow-500" : "bg-red-500"
              }`} />
              <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{app.role}</div>
                  <div className="text-xs text-gray-500">{app.company}</div>
                </div>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    app.stage === "Offer" ? "bg-green-50 text-green-700" :
                    app.stage === "2nd Interview" ? "bg-indigo-50 text-indigo-700" :
                    app.stage === "1st Interview" ? "bg-purple-50 text-purple-700" :
                    "bg-blue-50 text-blue-700"
                  }`}>
                    {app.stage}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{app.date}</div>
                <div className="text-right">
                  <button className="text-sm text-[#7C5FF5] font-medium hover:underline">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function InterviewPrepContent() {
  return (
    <>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Interview Prep</h2>
        <p className="text-sm text-gray-500">Practice and ace your interviews</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-gradient-to-br from-[#F3E8FF] to-white rounded-xl p-5 border border-[#7C5FF5]/20 text-center">
          <div className="text-3xl font-bold text-[#7C5FF5] mb-2">24</div>
          <div className="text-sm text-gray-600 font-medium">Practice Questions</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-5 border border-green-100 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">5</div>
          <div className="text-sm text-gray-600 font-medium">Mock Interviews</div>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { title: "Common Behavioral Questions", count: "12 questions", icon: "💼", progress: 75 },
          { title: "Technical Interview Prep", count: "8 questions", icon: "💻", progress: 50 },
          { title: "STAR Method Practice", count: "10 scenarios", icon: "⭐", progress: 90 },
        ].map((module, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">{module.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">{module.title}</div>
                <div className="text-xs text-gray-500">{module.count}</div>
              </div>
              <div className="text-sm text-[#7C5FF5] font-medium">Practice →</div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-[#7C5FF5] h-2 rounded-full transition-all"
                style={{ width: `${module.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
