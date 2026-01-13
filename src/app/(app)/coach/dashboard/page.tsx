"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Phone,
  MessageSquare,
  MoreHorizontal,
  Trophy,
  Eye,
  PartyPopper,
  Sparkles,
  Bell,
  Download,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Activity,
  UserCheck,
  ExternalLink,
  X,
  FileSpreadsheet,
  CalendarDays,
  CheckSquare,
  Square,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Target,
  UserPlus,
  Search,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  StickyNote,
  Plus,
  ListTodo,
  AlertTriangle,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoClients, demoCoach, DemoClient, getActionLabel, formatActionTime, ActionType } from "@/lib/demo-data";
import { useChatContext } from "@/components/app/chat-widget";
import { useTheme } from "@/lib/theme-context";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
};

const cardHoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
};

// Get milestone display info
const getMilestoneInfo = (milestone: string) => {
  const milestones: Record<string, { label: string; lightColor: string; lightBg: string; darkColor: string; darkBg: string }> = {
    "profile-complete": { label: "Profile Done", lightColor: "text-blue-700", lightBg: "bg-blue-100", darkColor: "text-blue-300", darkBg: "bg-blue-900/50" },
    "resume-ready": { label: "Resume Ready", lightColor: "text-purple-700", lightBg: "bg-purple-100", darkColor: "text-purple-300", darkBg: "bg-purple-900/50" },
    "assessment-complete": { label: "Assessment", lightColor: "text-indigo-700", lightBg: "bg-indigo-100", darkColor: "text-indigo-300", darkBg: "bg-indigo-900/50" },
    "first-application": { label: "First App", lightColor: "text-cyan-700", lightBg: "bg-cyan-100", darkColor: "text-cyan-300", darkBg: "bg-cyan-900/50" },
    "interview-prep": { label: "Interview Prep", lightColor: "text-amber-700", lightBg: "bg-amber-100", darkColor: "text-amber-300", darkBg: "bg-amber-900/50" },
    "active-seeker": { label: "Active Seeker", lightColor: "text-green-700", lightBg: "bg-green-100", darkColor: "text-green-300", darkBg: "bg-green-900/50" },
    "interview-scheduled": { label: "Interview Set", lightColor: "text-orange-700", lightBg: "bg-orange-100", darkColor: "text-orange-300", darkBg: "bg-orange-900/50" },
    "offer-received": { label: "Offer Received", lightColor: "text-emerald-700", lightBg: "bg-emerald-100", darkColor: "text-emerald-300", darkBg: "bg-emerald-900/50" },
    "quest-complete": { label: "Hired!", lightColor: "text-yellow-700", lightBg: "bg-yellow-100", darkColor: "text-yellow-300", darkBg: "bg-yellow-900/50" },
  };
  return milestones[milestone] || { label: milestone, lightColor: "text-gray-700", lightBg: "bg-gray-100", darkColor: "text-gray-300", darkBg: "bg-gray-800" };
};

// Get program/track based on education
const getProgram = (education: string) => {
  const programs: Record<string, string> = {
    "high-school": "Youth Program",
    "some-college": "Career Transition",
    "associates": "Career Transition",
    "bachelors": "Professional Track",
    "masters": "Executive Track",
    "doctorate": "Executive Track",
  };
  return programs[education] || "General";
};

// Get icon component for action type
const getActionIcon = (type: ActionType): React.ComponentType<{ className?: string }> => {
  const icons: Record<ActionType, React.ComponentType<{ className?: string }>> = {
    submitted_application: Briefcase,
    saved_job: Briefcase,
    browsed_jobs: Search,
    updated_resume: FileText,
    downloaded_resume: Download,
    updated_profile: UserCheck,
    completed_interview_module: GraduationCap,
    watched_prep_video: GraduationCap,
    started_interview_prep: GraduationCap,
    completed_assessment: Target,
    started_assessment: Target,
    viewed_assessment_results: Target,
    updated_application_status: Activity,
    added_job_to_tracker: ListTodo,
    logged_interview_notes: StickyNote,
    messaged_coach: MessageSquare,
    read_coach_message: Mail,
    completed_task: CheckCircle,
    viewed_task: ListTodo,
    viewed_resource: ExternalLink,
    saved_resource: ExternalLink,
    logged_in: Activity,
    viewed_dashboard: Eye,
  };
  return icons[type] || Activity;
};

// Format 24-hour time to 12-hour AM/PM format (PST)
const formatTimeTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// Demo schedule data (stored in 24-hour, displayed in 12-hour)
const todaySchedule = [
  { time: "09:00", endTime: "10:00", name: "Marcus Robinson", type: "Check-in", color: "border-l-[#2B8A8A]", lightBg: "bg-[#2B8A8A]/10", darkBg: "bg-[#4FD1C5]/20" },
  { time: "11:00", endTime: "11:30", name: "Aisha Patel", type: "Resume Review", color: "border-l-purple-500", lightBg: "bg-purple-50", darkBg: "bg-purple-900/30" },
  { time: "14:00", endTime: "15:00", name: "Diana Okonkwo", type: "Offer Discussion", color: "border-l-emerald-500", lightBg: "bg-emerald-50", darkBg: "bg-emerald-900/30" },
  { time: "16:00", endTime: "16:30", name: "Robert Kim", type: "Interview Prep", color: "border-l-amber-500", lightBg: "bg-amber-50", darkBg: "bg-amber-900/30" },
];

export default function CoachDashboardPage() {
  const [clients, setClients] = useState(demoClients);
  const [hiredClient, setHiredClient] = useState<DemoClient | null>(null);
  const [showHiredModal, setShowHiredModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedClient, setSelectedClient] = useState<DemoClient | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Profile Modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileClient, setProfileClient] = useState<DemoClient | null>(null);

  // Export Modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportClient, setExportClient] = useState<DemoClient | null>(null);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [includeJobOutcomes, setIncludeJobOutcomes] = useState(false);

  // Add Job Seeker Modal state
  const [showAddJobSeekerModal, setShowAddJobSeekerModal] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResult, setSearchResult] = useState<{ found: boolean; email: string; name: string } | null>(null);
  const [inviteStatus, setInviteStatus] = useState<"idle" | "searching" | "sending" | "sent">("idle");

  // Task system types and state
  interface CoachTask {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    dueTime: string; // "09:00", "14:30", etc.
    notifyBefore: { value: number; unit: "hours" | "days" };
    assignedJobSeekers: string[]; // client IDs
    priority: "default" | "urgent";
    status: "pending" | "completed" | "overdue";
    isRecurring: boolean;
    recurringFrequency?: "daily" | "weekly" | "biweekly" | "monthly";
    recurringEndDate?: Date;
    createdAt: Date;
    createdBy: string;
  }

  // Demo tasks
  const [tasks, setTasks] = useState<CoachTask[]>([
    {
      id: "task-1",
      title: "Call Aisha - Interview Prep",
      description: "Congratulate on interview and prep for upcoming interview at Tech Corp",
      dueDate: new Date(),
      dueTime: "09:00",
      notifyBefore: { value: 1, unit: "hours" },
      assignedJobSeekers: [demoClients[1].id],
      priority: "urgent",
      status: "pending",
      isRecurring: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      createdBy: `${demoCoach.firstName} ${demoCoach.lastName}`,
    },
    {
      id: "task-2",
      title: "Resume Review - Marcus",
      description: "Review updated resume and provide feedback on skills section",
      dueDate: new Date(),
      dueTime: "14:00",
      notifyBefore: { value: 2, unit: "hours" },
      assignedJobSeekers: [demoClients[0].id],
      priority: "default",
      status: "pending",
      isRecurring: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdBy: `${demoCoach.firstName} ${demoCoach.lastName}`,
    },
    {
      id: "task-3",
      title: "Weekly Check-in",
      description: "Weekly progress check-in with caseload members",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      dueTime: "10:00",
      notifyBefore: { value: 1, unit: "days" },
      assignedJobSeekers: [demoClients[0].id, demoClients[1].id, demoClients[2].id],
      priority: "default",
      status: "pending",
      isRecurring: true,
      recurringFrequency: "weekly",
      recurringEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdBy: `${demoCoach.firstName} ${demoCoach.lastName}`,
    },
    {
      id: "task-4",
      title: "Follow up on application",
      description: "Check status of Marketing Coordinator application",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      dueTime: "11:00",
      notifyBefore: { value: 4, unit: "hours" },
      assignedJobSeekers: [demoClients[2].id],
      priority: "default",
      status: "overdue",
      isRecurring: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdBy: `${demoCoach.firstName} ${demoCoach.lastName}`,
    },
  ]);

  // Task helpers
  const getTasksDueToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate >= today && taskDate < tomorrow && task.status !== "completed";
    });
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => {
      const taskDateTime = new Date(task.dueDate);
      const [hours, minutes] = task.dueTime.split(":").map(Number);
      taskDateTime.setHours(hours, minutes, 0, 0);
      return taskDateTime < now && task.status !== "completed";
    });
  };

  const getUpcomingTasks = () => {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= now && taskDate <= threeDaysFromNow && task.status === "pending";
    });
  };

  const markTaskComplete = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: "completed" as const } : task
    ));
  }, []);

  const tasksDueToday = getTasksDueToday();
  const overdueTasks = getOverdueTasks();
  const upcomingTasks = getUpcomingTasks();

  // Notes state - stores notes per client
  interface ClientNote {
    id: string;
    text: string;
    timestamp: Date;
    coachName: string;
  }
  const [clientNotes, setClientNotes] = useState<Record<string, ClientNote[]>>({
    // Demo notes for first client
    [demoClients[0].id]: [
      {
        id: "note-1",
        text: "Discussed career goals and target industries. Client is motivated and engaged.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        coachName: `${demoCoach.firstName} ${demoCoach.lastName}`,
      },
      {
        id: "note-2",
        text: "Reviewed resume updates. Suggested adding more quantifiable achievements.",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        coachName: `${demoCoach.firstName} ${demoCoach.lastName}`,
      },
    ],
  });
  const [newNoteText, setNewNoteText] = useState("");

  // Notes View Modal state
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notesClient, setNotesClient] = useState<DemoClient | null>(null);
  const [notesStartDate, setNotesStartDate] = useState("");
  const [notesEndDate, setNotesEndDate] = useState("");

  // Open notes modal for a client
  const openNotesModal = useCallback((client: DemoClient) => {
    setNotesClient(client);
    setShowNotesModal(true);
    setNotesStartDate("");
    setNotesEndDate("");
    setNewNoteText("");
  }, []);

  // Add a note for a client
  const handleAddNote = useCallback((clientId: string) => {
    if (!newNoteText.trim()) return;

    const newNote: ClientNote = {
      id: `note-${Date.now()}`,
      text: newNoteText.trim(),
      timestamp: new Date(),
      coachName: `${demoCoach.firstName} ${demoCoach.lastName}`,
    };

    setClientNotes(prev => ({
      ...prev,
      [clientId]: [newNote, ...(prev[clientId] || [])],
    }));
    setNewNoteText("");
  }, [newNoteText]);

  // Format date for note display - always includes time
  const formatNoteDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (diffDays === 0) {
      return `Today at ${timeStr}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${timeStr}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago at ${timeStr}`;
    } else {
      return `${date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })} at ${timeStr}`;
    }
  };

  // Export notes to Excel
  const handleExportNotes = useCallback(() => {
    if (!notesClient) return;

    const notes = clientNotes[notesClient.id] || [];
    let filteredNotes = notes;

    // Filter by date range if provided
    if (notesStartDate || notesEndDate) {
      const startDate = notesStartDate ? new Date(notesStartDate) : new Date(0);
      const endDate = notesEndDate ? new Date(notesEndDate + "T23:59:59") : new Date();

      filteredNotes = notes.filter(note => {
        const noteDate = new Date(note.timestamp);
        return noteDate >= startDate && noteDate <= endDate;
      });
    }

    // Create CSV content
    const headers = ["Date", "Time", "Coach", "Note"];
    const rows = filteredNotes.map(note => {
      const date = new Date(note.timestamp);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        note.coachName,
        `"${note.text.replace(/"/g, '""')}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${notesClient.firstName}_${notesClient.lastName}_notes.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`Exported ${filteredNotes.length} notes for ${notesClient.firstName} ${notesClient.lastName}`);
  }, [notesClient, clientNotes, notesStartDate, notesEndDate]);

  // Demo function to search for job seekers by email
  const handleSearchEmail = useCallback(() => {
    if (!searchEmail.trim()) return;
    setInviteStatus("searching");

    // Simulate search delay
    setTimeout(() => {
      // Demo: pretend we found a user if it looks like a valid email
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(searchEmail);
      if (isValidEmail) {
        setSearchResult({
          found: true,
          email: searchEmail,
          name: searchEmail.split("@")[0].split(".").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ")
        });
      } else {
        setSearchResult({ found: false, email: searchEmail, name: "" });
      }
      setInviteStatus("idle");
    }, 800);
  }, [searchEmail]);

  // Send invite to job seeker
  const handleSendInvite = useCallback(() => {
    if (!searchResult?.found) return;
    setInviteStatus("sending");

    // Simulate sending invite
    setTimeout(() => {
      setInviteStatus("sent");
    }, 1000);
  }, [searchResult]);

  const { openChat } = useChatContext();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleOpenChat = useCallback((client: DemoClient) => {
    openChat(client);
  }, [openChat]);

  const markClientAsHired = useCallback((client: DemoClient) => {
    setClients(prev => prev.map(c => {
      if (c.id === client.id) {
        return {
          ...c,
          currentMilestone: "quest-complete",
          completedMilestones: [...c.completedMilestones, "offer-received", "quest-complete"],
          questProgress: 100,
          achievements: [...c.achievements, "quest-complete", "diamond-hired"],
        };
      }
      return c;
    }));
    setHiredClient(client);
    setShowHiredModal(true);
    setMenuOpen(null);
  }, []);

  const handleClientClick = useCallback((client: DemoClient) => {
    setSelectedClient(selectedClient?.id === client.id ? null : client);
  }, [selectedClient]);

  // Open profile modal
  const openProfileModal = useCallback((client: DemoClient) => {
    setProfileClient(client);
    setShowProfileModal(true);
    setMenuOpen(null);
  }, []);

  // Open export modal
  const openExportModal = useCallback((client: DemoClient) => {
    setExportClient(client);
    // Set default date range to last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    setExportStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
    setExportEndDate(today.toISOString().split('T')[0]);
    setIncludeJobOutcomes(false);
    setShowExportModal(true);
    setMenuOpen(null);
  }, []);

  // Handle Excel export
  const handleExport = useCallback(() => {
    if (!exportClient) return;

    // Create CSV content for Excel
    const headers = ["Date", "Activity", "Details"];
    if (includeJobOutcomes) {
      headers.push("Outcome");
    }

    // Demo job tracker data
    const activities = [
      { date: "2024-01-15", activity: "Application Submitted", details: "Software Engineer at TechCorp", outcome: "Phone Screen" },
      { date: "2024-01-18", activity: "Phone Screen", details: "TechCorp - HR Interview", outcome: "Passed" },
      { date: "2024-01-20", activity: "Application Submitted", details: "Frontend Developer at StartupXYZ", outcome: "Rejected" },
      { date: "2024-01-22", activity: "Technical Interview", details: "TechCorp - Technical Round", outcome: "Passed" },
      { date: "2024-01-25", activity: "Application Submitted", details: "Full Stack Developer at BigCo", outcome: "Interview" },
      { date: "2024-01-28", activity: "Final Interview", details: "TechCorp - Team Fit", outcome: "Hired" },
    ];

    // Filter by date range
    const filteredActivities = activities.filter(a => {
      const actDate = new Date(a.date);
      const start = new Date(exportStartDate);
      const end = new Date(exportEndDate);
      return actDate >= start && actDate <= end;
    });

    // Build CSV content
    let csv = headers.join(",") + "\n";
    filteredActivities.forEach(a => {
      const row = [a.date, a.activity, `"${a.details}"`];
      if (includeJobOutcomes) {
        row.push(a.outcome);
      }
      csv += row.join(",") + "\n";
    });

    // Create and download file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${exportClient.lastName}_${exportClient.firstName}_Activity_Report_${exportStartDate}_to_${exportEndDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportModal(false);
  }, [exportClient, exportStartDate, exportEndDate, includeJobOutcomes]);

  // Stats calculations
  const activeClients = clients.filter(c => c.daysInactive < 3).length;
  const placementsThisMonth = clients.filter(c => c.currentMilestone === "quest-complete").length;
  const engagementRate = Math.round((activeClients / clients.length) * 100);

  // Pagination calculations
  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClients = clients.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calendar helpers
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["M", "T", "W", "T", "F", "S", "S"];

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  // Keyboard navigation for calendar
  const handleCalendarKeyDown = (e: React.KeyboardEvent, day: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedDate(day);
    }
  };

  return (
    <motion.div
      className="h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-5 mb-6">
        {/* Active Clients */}
        <motion.div
          variants={cardHoverVariants}
          initial="rest"
          whileHover="hover"
          className={`rounded-2xl p-5 border shadow-sm transition-colors ${
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
          }`}
          role="region"
          aria-label="Job Seekers on Caseload statistic"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center relative ${isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/10"}`}>
                <svg className="w-14 h-14 -rotate-90" aria-hidden="true">
                  <circle cx="28" cy="28" r="24" fill="none" stroke={isDark ? "#374151" : "#e5e7eb"} strokeWidth="4" />
                  <motion.circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke={isDark ? "#4FD1C5" : "#2B8A8A"}
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0 150.8" }}
                    animate={{ strokeDasharray: `${(activeClients / clients.length) * 150.8} 150.8` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </svg>
                <Users className={`h-5 w-5 absolute ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} aria-hidden="true" />
              </div>
              <div>
                <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{activeClients}</p>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Job Seekers on Caseload</p>
              </div>
            </div>
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${isDark ? "text-green-400 bg-green-900/30" : "text-green-600 bg-green-50"}`}
            >
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              +8%
            </motion.span>
          </div>
        </motion.div>

        {/* Placements This Month */}
        <motion.div
          variants={cardHoverVariants}
          initial="rest"
          whileHover="hover"
          className={`rounded-2xl p-5 border shadow-sm transition-colors ${
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
          }`}
          role="region"
          aria-label="Placements this month statistic"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${isDark ? "bg-emerald-900/30" : "bg-emerald-50"}`}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Trophy className={`h-6 w-6 ${isDark ? "text-emerald-400" : "text-emerald-600"}`} aria-hidden="true" />
              </motion.div>
              <div>
                <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{placementsThisMonth}</p>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Placements this month</p>
              </div>
            </div>
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${isDark ? "text-green-400 bg-green-900/30" : "text-green-600 bg-green-50"}`}
            >
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
              +12%
            </motion.span>
          </div>
        </motion.div>

        {/* Tasks Due Today */}
        <motion.div
          variants={cardHoverVariants}
          initial="rest"
          whileHover="hover"
          className={`rounded-2xl p-5 border shadow-sm transition-colors cursor-pointer ${
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
          }`}
          role="region"
          aria-label="Tasks due today"
          onClick={() => window.location.href = "/coach/tasks"}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center relative ${isDark ? "bg-purple-900/30" : "bg-purple-50"}`}>
                <ListTodo className={`h-6 w-6 ${isDark ? "text-purple-400" : "text-purple-600"}`} aria-hidden="true" />
              </div>
              <div>
                <p className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tasksDueToday.length}</p>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Tasks Due Today</p>
              </div>
            </div>
            {overdueTasks.length > 0 && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${isDark ? "text-red-400 bg-red-900/30" : "text-red-600 bg-red-50"}`}
              >
                <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                {overdueTasks.length} overdue
              </motion.span>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content - Two Columns */}
      <motion.div variants={itemVariants} className="grid grid-cols-[1fr_320px] gap-5">
        {/* Left Column - Client Table */}
        <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}>
          {/* Table Header */}
          <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
            <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Caseload
            </h2>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowAddJobSeekerModal(true);
                  setSearchEmail("");
                  setSearchResult(null);
                  setInviteStatus("idle");
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isDark
                    ? "bg-[#4FD1C5] text-gray-900 hover:bg-[#3DBDB0]"
                    : "bg-[#2B8A8A] text-white hover:bg-[#237070]"
                }`}
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                Add Job Seeker
              </motion.button>
              <div className={`flex items-center gap-1 p-1 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                <button
                  className={`p-1.5 rounded-md shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isDark ? "bg-gray-700" : "bg-white"}`}
                  aria-label="List view"
                  aria-pressed="true"
                >
                  <svg className={`h-4 w-4 ${isDark ? "text-gray-300" : "text-gray-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
                <button
                  className={`p-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}
                  aria-label="Grid view"
                  aria-pressed="false"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto" role="region" aria-label="Job seekers list">
            <table className="w-full" role="grid">
              <thead>
                <tr className={isDark ? "bg-gray-800/50" : "bg-gray-50/50"}>
                  <th scope="col" className={`text-left text-xs font-medium uppercase tracking-wider px-5 py-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Name</th>
                  <th scope="col" className={`text-left text-xs font-medium uppercase tracking-wider px-5 py-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Applications</th>
                  <th scope="col" className={`text-left text-xs font-medium uppercase tracking-wider px-5 py-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Last Action</th>
                  <th scope="col" className={`text-right text-xs font-medium uppercase tracking-wider px-5 py-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-gray-800" : "divide-gray-100"}`}>
                {paginatedClients.map((client, index) => {
                  const milestoneInfo = getMilestoneInfo(client.currentMilestone);
                  const isSelected = selectedClient?.id === client.id;
                  // Get action icon component
                  const ActionIcon = getActionIcon(client.lastAction.type);

                  return (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * index }}
                      className={`transition-colors cursor-pointer ${
                        isSelected
                          ? isDark ? "bg-gray-800" : "bg-gray-50"
                          : isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50/50"
                      }`}
                      onClick={() => openProfileModal(client)}
                      tabIndex={0}
                      role="row"
                      aria-selected={isSelected}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openProfileModal(client);
                        }
                      }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={client.avatar}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            {client.isOnline && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 ${isDark ? "border-gray-900" : "border-white"}`}
                                aria-label="Online"
                              />
                            )}
                          </div>
                          <div>
                            <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                              {client.firstName} {client.lastName}
                            </p>
                            <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>99201</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>{client.stats.applicationsSubmitted}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <ActionIcon className={`h-4 w-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                          <div className="flex flex-col">
                            <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                              {getActionLabel(client.lastAction.type)}
                            </span>
                            <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                              {formatActionTime(client.lastAction.timestamp)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleOpenChat(client)}
                            className={`p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                              isDark
                                ? "text-gray-500 hover:text-[#4FD1C5] hover:bg-[#4FD1C5]/10"
                                : "text-gray-400 hover:text-[#2B8A8A] hover:bg-[#2B8A8A]/10"
                            }`}
                            aria-label={`Send message to ${client.firstName} ${client.lastName}`}
                          >
                            <MessageSquare className="h-4 w-4" aria-hidden="true" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                              isDark
                                ? "text-gray-500 hover:text-[#4FD1C5] hover:bg-[#4FD1C5]/10"
                                : "text-gray-400 hover:text-[#2B8A8A] hover:bg-[#2B8A8A]/10"
                            }`}
                            aria-label={`View resume for ${client.firstName} ${client.lastName}`}
                          >
                            <FileText className="h-4 w-4" aria-hidden="true" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openNotesModal(client)}
                            className={`p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                              isDark
                                ? "text-gray-500 hover:text-[#4FD1C5] hover:bg-[#4FD1C5]/10"
                                : "text-gray-400 hover:text-[#2B8A8A] hover:bg-[#2B8A8A]/10"
                            }`}
                            aria-label={`View notes for ${client.firstName} ${client.lastName}`}
                          >
                            <StickyNote className="h-4 w-4" aria-hidden="true" />
                          </motion.button>
                          <div className="relative">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setMenuOpen(menuOpen === client.id ? null : client.id)}
                              className={`p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                isDark
                                  ? "text-gray-500 hover:text-gray-300 hover:bg-gray-800"
                                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                              }`}
                              aria-label={`More actions for ${client.firstName} ${client.lastName}`}
                              aria-expanded={menuOpen === client.id}
                              aria-haspopup="menu"
                            >
                              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                            </motion.button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                              {menuOpen === client.id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  transition={{ duration: 0.15 }}
                                  className={`absolute right-0 top-10 rounded-lg shadow-lg border py-1 z-10 min-w-[160px] ${
                                    isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                                  }`}
                                  role="menu"
                                >
                                  <button
                                    onClick={() => {
                                      handleOpenChat(client);
                                      setMenuOpen(null);
                                    }}
                                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 focus:outline-none focus-visible:bg-primary/10 ${
                                      isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                    role="menuitem"
                                  >
                                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                                    Send Message
                                  </button>
                                  <button
                                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 focus:outline-none focus-visible:bg-primary/10 ${
                                      isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() => openProfileModal(client)}
                                    role="menuitem"
                                  >
                                    <Eye className="h-4 w-4" aria-hidden="true" />
                                    View Profile
                                  </button>
                                  <button
                                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 focus:outline-none focus-visible:bg-primary/10 ${
                                      isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                    onClick={() => openExportModal(client)}
                                    role="menuitem"
                                  >
                                    <Download className="h-4 w-4" aria-hidden="true" />
                                    Export Job Tracker Log
                                  </button>
                                  {(client.currentMilestone === "offer-received" || client.currentMilestone === "interview-scheduled") && (
                                    <>
                                      <div className={`border-t my-1 ${isDark ? "border-gray-700" : "border-gray-100"}`} role="separator" />
                                      <button
                                        onClick={() => markClientAsHired(client)}
                                        className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 focus:outline-none ${
                                          isDark ? "text-amber-400 hover:bg-amber-900/30" : "text-amber-600 hover:bg-amber-50"
                                        }`}
                                        role="menuitem"
                                      >
                                        <Trophy className="h-4 w-4" aria-hidden="true" />
                                        Mark as Hired
                                      </button>
                                    </>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className={`px-5 py-4 border-t flex items-center justify-between ${isDark ? "border-gray-800" : "border-gray-100"}`}>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              Showing {startIndex + 1}-{Math.min(endIndex, clients.length)} of {clients.length} in caseload
            </p>
            <nav className="flex items-center gap-1" role="navigation" aria-label="Pagination">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </motion.button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    currentPage === page
                      ? isDark
                        ? "bg-[#4FD1C5] text-gray-900"
                        : "bg-[#2B8A8A] text-white"
                      : isDark
                      ? "text-gray-400 hover:bg-gray-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                }`}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </motion.button>
            </nav>
          </div>

          {/* Quick Tasks Preview */}
          <div className={`px-5 py-4 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                <ListTodo className="h-4 w-4" aria-hidden="true" />
                Tasks Overview
              </h3>
              <a
                href="/coach/tasks"
                className={`text-xs font-medium hover:underline ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`}
              >
                View All Tasks
              </a>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Due Today */}
              <a
                href="/coach/tasks?filter=today"
                className={`p-3 rounded-xl border transition-colors hover:shadow-md ${
                  isDark ? "bg-gray-800/50 border-gray-700 hover:border-gray-600" : "bg-gray-50 border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Clock className={`h-4 w-4 ${isDark ? "text-blue-400" : "text-blue-500"}`} aria-hidden="true" />
                  <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Due Today</span>
                </div>
                <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tasksDueToday.length}</p>
              </a>

              {/* Overdue */}
              <a
                href="/coach/tasks?filter=overdue"
                className={`p-3 rounded-xl border transition-colors hover:shadow-md ${
                  overdueTasks.length > 0
                    ? isDark ? "bg-red-900/20 border-red-800 hover:border-red-700" : "bg-red-50 border-red-100 hover:border-red-200"
                    : isDark ? "bg-gray-800/50 border-gray-700 hover:border-gray-600" : "bg-gray-50 border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className={`h-4 w-4 ${overdueTasks.length > 0 ? (isDark ? "text-red-400" : "text-red-500") : (isDark ? "text-gray-500" : "text-gray-400")}`} aria-hidden="true" />
                  <span className={`text-xs font-medium ${overdueTasks.length > 0 ? (isDark ? "text-red-400" : "text-red-500") : (isDark ? "text-gray-400" : "text-gray-500")}`}>Overdue</span>
                </div>
                <p className={`text-2xl font-bold ${overdueTasks.length > 0 ? (isDark ? "text-red-400" : "text-red-600") : (isDark ? "text-white" : "text-gray-900")}`}>{overdueTasks.length}</p>
              </a>

              {/* Upcoming */}
              <a
                href="/coach/tasks?filter=upcoming"
                className={`p-3 rounded-xl border transition-colors hover:shadow-md ${
                  isDark ? "bg-gray-800/50 border-gray-700 hover:border-gray-600" : "bg-gray-50 border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className={`h-4 w-4 ${isDark ? "text-green-400" : "text-green-500"}`} aria-hidden="true" />
                  <span className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>Upcoming</span>
                </div>
                <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{upcomingTasks.length}</p>
              </a>
            </div>

            {/* Quick Task List */}
            {tasksDueToday.length > 0 && (
              <div className="mt-3 space-y-2">
                {tasksDueToday.slice(0, 2).map((task) => {
                  const assignedClient = demoClients.find(c => task.assignedJobSeekers.includes(c.id));
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        isDark ? "bg-gray-800/30" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {task.priority === "urgent" && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isDark ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-600"
                          }`}>
                            Urgent
                          </span>
                        )}
                        <span className={`text-sm truncate ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                          {task.title}
                        </span>
                        {task.isRecurring && (
                          <Repeat className={`h-3 w-3 flex-shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`} aria-hidden="true" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          {formatTimeTo12Hour(task.dueTime)}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => markTaskComplete(task.id)}
                          className={`p-1 rounded transition-colors ${
                            isDark ? "hover:bg-green-900/30 text-gray-500 hover:text-green-400" : "hover:bg-green-50 text-gray-400 hover:text-green-500"
                          }`}
                          aria-label="Mark task complete"
                        >
                          <CheckCircle className="h-4 w-4" aria-hidden="true" />
                        </motion.button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Calendar & Schedule */}
        <div className="space-y-5">
          {/* Calendar */}
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            className={`rounded-2xl border shadow-sm p-5 transition-colors ${
              isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
            }`}
            role="region"
            aria-label="Calendar"
          >
            <div className="flex items-center justify-between mb-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevMonth}
                className={`p-1 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
                aria-label="Previous month"
              >
                <ChevronLeft className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-400"}`} aria-hidden="true" />
              </motion.button>
              <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextMonth}
                className={`p-1 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
                aria-label="Next month"
              >
                <ChevronRight className={`h-5 w-5 ${isDark ? "text-gray-400" : "text-gray-400"}`} aria-hidden="true" />
              </motion.button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2" role="row">
              {dayNames.map((day, i) => (
                <div key={i} className={`text-center text-xs font-medium py-2 ${isDark ? "text-gray-500" : "text-gray-400"}`} role="columnheader">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Calendar days">
              {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" role="gridcell" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected = day === selectedDate;
                const isToday = day === new Date().getDate() &&
                  currentMonth.getMonth() === new Date().getMonth() &&
                  currentMonth.getFullYear() === new Date().getFullYear();
                const hasEvent = [8, 15, 22, selectedDate].includes(day);

                return (
                  <motion.button
                    key={day}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(day)}
                    onKeyDown={(e) => handleCalendarKeyDown(e, day)}
                    className={`aspect-square rounded-full flex items-center justify-center text-sm transition-all relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isSelected
                        ? isDark
                          ? "bg-[#4FD1C5] text-gray-900 font-medium"
                          : "bg-[#2B8A8A] text-white font-medium"
                        : isToday
                        ? isDark
                          ? "bg-[#4FD1C5]/20 text-[#4FD1C5] font-medium"
                          : "bg-[#2B8A8A]/10 text-[#2B8A8A] font-medium"
                        : isDark
                        ? "text-gray-300 hover:bg-gray-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    role="gridcell"
                    aria-selected={isSelected}
                    aria-label={`${day} ${monthNames[currentMonth.getMonth()]}${hasEvent ? ", has events" : ""}`}
                  >
                    {day}
                    {hasEvent && !isSelected && (
                      <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isDark ? "bg-[#4FD1C5]" : "bg-[#2B8A8A]"}`} aria-hidden="true" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Today's Schedule */}
          <motion.div
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
            className={`rounded-2xl border shadow-sm p-5 transition-colors ${
              isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
            }`}
            role="region"
            aria-label="Today's schedule"
          >
            <h3 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Today's Schedule</h3>
            <ul className="space-y-3" role="list">
              {todaySchedule.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={`p-3 rounded-xl border-l-4 ${item.color} ${isDark ? item.darkBg : item.lightBg}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        {formatTimeTo12Hour(item.time)} - {formatTimeTo12Hour(item.endTime)}
                      </p>
                      <p className={`text-sm mt-0.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{item.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-md ${isDark ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"}`}>
                      {item.type}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
            <Button
              variant="outline"
              className={`w-full mt-4 gap-2 ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}`}
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              View Full Calendar
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Hired Celebration Modal */}
      <AnimatePresence>
        {showHiredModal && hiredClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowHiredModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hired-modal-title"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-2xl p-8 max-w-md mx-4 text-center relative overflow-hidden ${
                isDark ? "bg-gray-900" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confetti Background */}
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute top-4 left-8 text-2xl"
                >🎉</motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                  className="absolute top-8 right-12 text-2xl"
                >🎊</motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                  className="absolute bottom-12 left-12 text-xl"
                >⭐</motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 }}
                  className="absolute bottom-8 right-8 text-2xl"
                >🏆</motion.div>
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <PartyPopper className="h-10 w-10 text-white" aria-hidden="true" />
                </motion.div>

                <h2 id="hired-modal-title" className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Placement Success!
                </h2>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <img
                    src={hiredClient.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400"
                  />
                  <div className="text-left">
                    <p className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      {hiredClient.firstName} {hiredClient.lastName}
                    </p>
                    <p className={`text-sm font-medium flex items-center gap-1 ${isDark ? "text-green-400" : "text-green-600"}`}>
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      Hired
                    </p>
                  </div>
                </div>

                <p className={`mb-6 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {hiredClient.firstName} has successfully completed their program and secured employment!
                </p>

                <div className={`rounded-xl p-4 mb-6 border ${isDark ? "bg-yellow-900/20 border-yellow-700" : "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"}`}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className={`h-5 w-5 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} aria-hidden="true" />
                    <span className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Milestones Achieved</span>
                  </div>
                  <div className="flex justify-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm border ${isDark ? "bg-gray-800 border-yellow-600 text-yellow-300" : "bg-white border-yellow-300 text-yellow-700"}`}>
                      ✓ Program Complete
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm border ${isDark ? "bg-gray-800 border-yellow-600 text-yellow-300" : "bg-white border-yellow-300 text-yellow-700"}`}>
                      ✓ Employment Secured
                    </span>
                  </div>
                </div>

                {hiredClient.notificationSettings.emailOnHired && (
                  <p className={`text-xs mb-4 flex items-center justify-center gap-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    <Bell className="h-3 w-3" aria-hidden="true" />
                    Email notification sent to {demoCoach.email}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className={`flex-1 ${isDark ? "border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setShowHiredModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className={`flex-1 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}
                    onClick={() => {
                      handleOpenChat(hiredClient);
                      setShowHiredModal(false);
                    }}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
                    Congratulate
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && profileClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowProfileModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-modal-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl ${
                isDark ? "bg-gray-900" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`sticky top-0 z-10 px-6 py-4 border-b flex items-center justify-between ${
                isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
              }`}>
                <h2 id="profile-modal-title" className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Job Seeker Profile
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowProfileModal(false)}
                  className={`p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                  aria-label="Close profile"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>

              {/* Profile Content */}
              <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-start gap-5 mb-6">
                  <div className="relative">
                    <img
                      src={profileClient.avatar}
                      alt=""
                      className="w-24 h-24 rounded-2xl object-cover"
                    />
                    {profileClient.isOnline && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 ${isDark ? "border-gray-900" : "border-white"}`}
                        aria-label="Online"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                      {profileClient.firstName} {profileClient.lastName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`flex items-center gap-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        <Mail className="h-4 w-4" aria-hidden="true" />
                        {profileClient.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span className={`flex items-center gap-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        <Phone className="h-4 w-4" aria-hidden="true" />
                        {profileClient.phone}
                      </span>
                      <span className={`flex items-center gap-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                        Spokane, WA
                      </span>
                    </div>
                  </div>
                  <div>
                    {(() => {
                      const milestoneInfo = getMilestoneInfo(profileClient.currentMilestone);
                      return (
                        <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${
                          isDark ? `${milestoneInfo.darkBg} ${milestoneInfo.darkColor}` : `${milestoneInfo.lightBg} ${milestoneInfo.lightColor}`
                        }`}>
                          {milestoneInfo.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3 mb-6">
                  <Button
                    onClick={() => {
                      handleOpenChat(profileClient);
                      setShowProfileModal(false);
                    }}
                    className={`flex-1 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
                    Send Message
                  </Button>
                  <Button
                    variant="outline"
                    className={`flex-1 ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}`}
                  >
                    <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                    View Resume
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowProfileModal(false);
                      openExportModal(profileClient);
                    }}
                    className={isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}
                  >
                    <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                    Export
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border ${isDark ? "bg-gray-800/50 border-gray-800" : "bg-gray-50 border-gray-100"}`}
                  >
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Program Progress</p>
                    <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{profileClient.questProgress}%</p>
                    <div className={`mt-2 h-2 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                      <motion.div
                        className={`h-full rounded-full ${isDark ? "bg-[#4FD1C5]" : "bg-[#2B8A8A]"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${profileClient.questProgress}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border ${isDark ? "bg-gray-800/50 border-gray-800" : "bg-gray-50 border-gray-100"}`}
                  >
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Applications</p>
                    <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{profileClient.stats.applicationsSubmitted}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border ${isDark ? "bg-gray-800/50 border-gray-800" : "bg-gray-50 border-gray-100"}`}
                  >
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Interviews</p>
                    <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{profileClient.stats.interviewsScheduled}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border ${isDark ? "bg-gray-800/50 border-gray-800" : "bg-gray-50 border-gray-100"}`}
                  >
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Day Streak</p>
                    <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{profileClient.stats.loginStreak}</p>
                  </motion.div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Career Info */}
                  <div className={`p-5 rounded-xl border ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                    <h4 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      <Briefcase className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} aria-hidden="true" />
                      Career Information
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className={`text-xs uppercase tracking-wide ${isDark ? "text-gray-500" : "text-gray-400"}`}>Work Experience</p>
                        <p className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>{profileClient.resume.workExperience} years</p>
                      </div>
                      <div>
                        <p className={`text-xs uppercase tracking-wide ${isDark ? "text-gray-500" : "text-gray-400"}`}>Previous Jobs</p>
                        <p className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>{profileClient.resume.jobCount} positions</p>
                      </div>
                      <div>
                        <p className={`text-xs uppercase tracking-wide ${isDark ? "text-gray-500" : "text-gray-400"}`}>Program</p>
                        <p className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>{getProgram(profileClient.resume.education)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Education & Skills */}
                  <div className={`p-5 rounded-xl border ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                    <h4 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                      <GraduationCap className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} aria-hidden="true" />
                      Skills & Education
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className={`text-xs uppercase tracking-wide ${isDark ? "text-gray-500" : "text-gray-400"}`}>Education</p>
                        <p className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                          {profileClient.resume.education.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                      </div>
                      <div>
                        <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Top Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {profileClient.resume.skills.slice(0, 4).map((skill, i) => (
                            <span
                              key={i}
                              className={`px-2 py-1 rounded-md text-xs font-medium ${
                                isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className={`mt-6 p-5 rounded-xl border ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                  <h4 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <Target className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} aria-hidden="true" />
                    Completed Milestones
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profileClient.completedMilestones.map((milestone, i) => {
                      const info = getMilestoneInfo(milestone);
                      return (
                        <span
                          key={i}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                            isDark ? `${info.darkBg} ${info.darkColor}` : `${info.lightBg} ${info.lightColor}`
                          }`}
                        >
                          ✓ {info.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Coach Notes */}
                <div className={`mt-6 p-5 rounded-xl border ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                  <h4 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <StickyNote className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} aria-hidden="true" />
                    Coach Notes
                    <span className={`ml-auto text-xs font-normal ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {(clientNotes[profileClient.id] || []).length} notes
                    </span>
                  </h4>

                  {/* Add New Note */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <textarea
                        value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        placeholder="Add a note about this job seeker..."
                        rows={2}
                        className={`flex-1 px-3 py-2 rounded-lg border text-sm resize-none transition-colors focus:outline-none focus:ring-2 ${
                          isDark
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-[#4FD1C5]"
                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#2B8A8A]"
                        }`}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddNote(profileClient.id)}
                        disabled={!newNoteText.trim()}
                        className={`px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          isDark
                            ? "bg-[#4FD1C5] text-gray-900 hover:bg-[#3DBDB0]"
                            : "bg-[#2B8A8A] text-white hover:bg-[#237070]"
                        }`}
                      >
                        <Plus className="h-5 w-5" aria-hidden="true" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Notes Log */}
                  <div className={`space-y-3 max-h-60 overflow-y-auto ${(clientNotes[profileClient.id] || []).length > 0 ? "" : "hidden"}`}>
                    {(clientNotes[profileClient.id] || []).map((note) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}
                      >
                        <p className={`text-sm mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                          {note.text}
                        </p>
                        <div className={`flex items-center gap-3 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {formatNoteDate(note.timestamp)}
                          </span>
                          <span>•</span>
                          <span>{note.coachName}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Empty State */}
                  {(clientNotes[profileClient.id] || []).length === 0 && (
                    <p className={`text-sm text-center py-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      No notes yet. Add your first note above.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Log Modal */}
      <AnimatePresence>
        {showExportModal && exportClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowExportModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="export-modal-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`rounded-2xl w-full max-w-md shadow-2xl ${
                isDark ? "bg-gray-900" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${
                isDark ? "border-gray-800" : "border-gray-100"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/10"}`}>
                    <FileSpreadsheet className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="export-modal-title" className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Export Job Tracker Log
                    </h2>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {exportClient.firstName} {exportClient.lastName}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowExportModal(false)}
                  className={`p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                  aria-label="Close export dialog"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-5">
                {/* Date Range */}
                <div>
                  <label className={`block text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="export-start-date" className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="export-start-date"
                        value={exportStartDate}
                        onChange={(e) => setExportStartDate(e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                          isDark
                            ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                            : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="export-end-date" className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        End Date
                      </label>
                      <input
                        type="date"
                        id="export-end-date"
                        value={exportEndDate}
                        onChange={(e) => setExportEndDate(e.target.value)}
                        className={`w-full px-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                          isDark
                            ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                            : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Job Outcomes Checkbox */}
                <div className={`p-4 rounded-xl border ${isDark ? "border-gray-800 bg-gray-800/30" : "border-gray-100 bg-gray-50"}`}>
                  <button
                    type="button"
                    onClick={() => setIncludeJobOutcomes(!includeJobOutcomes)}
                    className="w-full flex items-start gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                    aria-pressed={includeJobOutcomes}
                  >
                    <div className={`mt-0.5 p-0.5 rounded transition-colors ${
                      includeJobOutcomes
                        ? isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"
                        : isDark ? "text-gray-600" : "text-gray-400"
                    }`}>
                      {includeJobOutcomes ? (
                        <CheckSquare className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Square className="h-5 w-5" aria-hidden="true" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        Include Application Outcomes
                      </p>
                      <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Add status column: Rejected, Phone Screen, Interview, Hired
                      </p>
                    </div>
                  </button>
                </div>

                {/* Export Preview */}
                <div className={`p-4 rounded-xl border ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                  <p className={`text-xs uppercase tracking-wide mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    Export Summary
                  </p>
                  <div className={`text-sm space-y-1 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                    <p>• Columns: Date, Activity, Details{includeJobOutcomes ? ", Outcome" : ""}</p>
                    <p>• Format: Excel-compatible (.csv)</p>
                    <p>• File: {exportClient.lastName}_{exportClient.firstName}_Activity_Report.csv</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`px-6 py-4 border-t flex gap-3 ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                <Button
                  variant="outline"
                  className={`flex-1 ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}`}
                  onClick={() => setShowExportModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExport}
                  className={`flex-1 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" aria-hidden="true" />
                  Export to Excel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Job Seeker Modal */}
      <AnimatePresence>
        {showAddJobSeekerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddJobSeekerModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-job-seeker-modal-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`rounded-2xl w-full max-w-md shadow-2xl ${
                isDark ? "bg-gray-900" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${
                isDark ? "border-gray-800" : "border-gray-100"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/10"}`}>
                    <UserPlus className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="add-job-seeker-modal-title" className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Add Job Seeker
                    </h2>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Invite to your caseload
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddJobSeekerModal(false)}
                  className={`p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-5">
                {/* Email Search */}
                <div>
                  <label htmlFor="search-email" className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Search by Email
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} aria-hidden="true" />
                      <input
                        type="email"
                        id="search-email"
                        placeholder="Enter job seeker's email..."
                        value={searchEmail}
                        onChange={(e) => {
                          setSearchEmail(e.target.value);
                          setSearchResult(null);
                          setInviteStatus("idle");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSearchEmail()}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                          isDark
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-[#4FD1C5]"
                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#2B8A8A]"
                        }`}
                      />
                    </div>
                    <Button
                      onClick={handleSearchEmail}
                      disabled={!searchEmail.trim() || inviteStatus === "searching"}
                      className={`px-4 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}
                    >
                      {inviteStatus === "searching" ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Search className="h-4 w-4" aria-hidden="true" />
                        </motion.div>
                      ) : (
                        <Search className="h-4 w-4" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Search Result */}
                {searchResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border ${
                      searchResult.found
                        ? isDark ? "border-green-700 bg-green-900/20" : "border-green-200 bg-green-50"
                        : isDark ? "border-red-700 bg-red-900/20" : "border-red-200 bg-red-50"
                    }`}
                  >
                    {searchResult.found ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? "bg-gray-700" : "bg-gray-200"}`}>
                            <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                              {searchResult.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                              {searchResult.name}
                            </p>
                            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                              {searchResult.email}
                            </p>
                          </div>
                        </div>
                        <CheckCircle className={`h-5 w-5 ${isDark ? "text-green-400" : "text-green-500"}`} aria-hidden="true" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <AlertCircle className={`h-5 w-5 ${isDark ? "text-red-400" : "text-red-500"}`} aria-hidden="true" />
                        <div>
                          <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                            No account found
                          </p>
                          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            No job seeker with this email exists
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Invite Status */}
                {inviteStatus === "sent" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl border ${isDark ? "border-[#4FD1C5]/30 bg-[#4FD1C5]/10" : "border-[#2B8A8A]/30 bg-[#2B8A8A]/10"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/20"}`}>
                        <CheckCircle className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} aria-hidden="true" />
                      </div>
                      <div>
                        <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                          Invitation Sent!
                        </p>
                        <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          An email has been sent to {searchResult?.email} with a link to accept your invitation.
                        </p>
                        <div className={`flex items-center gap-4 mt-3 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" aria-hidden="true" />
                            Email notification sent
                          </span>
                          <span className="flex items-center gap-1">
                            <Bell className="h-3 w-3" aria-hidden="true" />
                            Dashboard notification sent
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Info Box */}
                <div className={`p-4 rounded-xl border ${isDark ? "border-gray-800 bg-gray-800/30" : "border-gray-100 bg-gray-50"}`}>
                  <h4 className={`text-sm font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    How invitations work
                  </h4>
                  <ul className={`text-sm space-y-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    <li className="flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>Job seeker receives an email with an "Accept Invite" link</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Bell className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>They also see a notification in their dashboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>Invitation expires in 7 days</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`px-6 py-4 border-t flex gap-3 ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                <Button
                  variant="outline"
                  className={`flex-1 ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}`}
                  onClick={() => setShowAddJobSeekerModal(false)}
                >
                  {inviteStatus === "sent" ? "Done" : "Cancel"}
                </Button>
                {inviteStatus !== "sent" && (
                  <Button
                    onClick={handleSendInvite}
                    disabled={!searchResult?.found || inviteStatus === "sending"}
                    className={`flex-1 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}
                  >
                    {inviteStatus === "sending" ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="mr-2"
                        >
                          <Send className="h-4 w-4" aria-hidden="true" />
                        </motion.div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" aria-hidden="true" />
                        Send Invitation
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes View Modal */}
      <AnimatePresence>
        {showNotesModal && notesClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNotesModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="notes-modal-title"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`rounded-2xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-2xl flex flex-col ${
                isDark ? "bg-gray-900" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`px-6 py-4 border-b flex items-center justify-between ${
                isDark ? "border-gray-800" : "border-gray-100"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isDark ? "bg-[#4FD1C5]/20" : "bg-[#2B8A8A]/10"}`}>
                    <StickyNote className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="notes-modal-title" className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                      Coach Notes
                    </h2>
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {notesClient.firstName} {notesClient.lastName}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNotesModal(false)}
                  className={`p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                  aria-label="Close"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Add New Note */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Add New Note
                  </label>
                  <div className="flex gap-2">
                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Add a note about this job seeker..."
                      rows={2}
                      className={`flex-1 px-3 py-2 rounded-lg border text-sm resize-none transition-colors focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-[#4FD1C5]"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#2B8A8A]"
                      }`}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddNote(notesClient.id)}
                      disabled={!newNoteText.trim()}
                      className={`px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDark
                          ? "bg-[#4FD1C5] text-gray-900 hover:bg-[#3DBDB0]"
                          : "bg-[#2B8A8A] text-white hover:bg-[#237070]"
                      }`}
                    >
                      <Plus className="h-5 w-5" aria-hidden="true" />
                    </motion.button>
                  </div>
                </div>

                {/* Notes Log */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      Notes History
                    </label>
                    <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      {(clientNotes[notesClient.id] || []).length} total
                    </span>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {(clientNotes[notesClient.id] || []).length === 0 ? (
                      <p className={`text-sm text-center py-8 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        No notes yet. Add your first note above.
                      </p>
                    ) : (
                      (clientNotes[notesClient.id] || []).map((note) => (
                        <motion.div
                          key={note.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-lg ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}
                        >
                          <p className={`text-sm mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                            {note.text}
                          </p>
                          <div className={`flex items-center gap-3 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" aria-hidden="true" />
                              {formatNoteDate(note.timestamp)}
                            </span>
                            <span>•</span>
                            <span>{note.coachName}</span>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                {/* Export Section */}
                <div className={`p-4 rounded-xl border ${isDark ? "border-gray-800 bg-gray-800/30" : "border-gray-100 bg-gray-50"}`}>
                  <h4 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Export Notes
                  </h4>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label htmlFor="notes-start-date" className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="notes-start-date"
                        value={notesStartDate}
                        onChange={(e) => setNotesStartDate(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                          isDark
                            ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                            : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                        }`}
                      />
                    </div>
                    <div>
                      <label htmlFor="notes-end-date" className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        End Date
                      </label>
                      <input
                        type="date"
                        id="notes-end-date"
                        value={notesEndDate}
                        onChange={(e) => setNotesEndDate(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                          isDark
                            ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                            : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                        }`}
                      />
                    </div>
                  </div>

                  <p className={`text-xs mb-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    Leave dates empty to export all notes
                  </p>

                  <Button
                    onClick={handleExportNotes}
                    disabled={(clientNotes[notesClient.id] || []).length === 0}
                    className={`w-full ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" aria-hidden="true" />
                    Export to Excel
                  </Button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`px-6 py-4 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                <Button
                  variant="outline"
                  className={`w-full ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}`}
                  onClick={() => setShowNotesModal(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
