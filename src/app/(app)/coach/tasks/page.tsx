"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListTodo,
  Plus,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  Users,
  Repeat,
  Bell,
  Filter,
  Search,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { demoClients, demoCoach, DemoClient } from "@/lib/demo-data";
import { useTheme } from "@/lib/theme-context";

// Task interface
interface CoachTask {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  dueTime: string;
  notifyBefore: { value: number; unit: "hours" | "days" };
  assignedJobSeekers: string[];
  priority: "default" | "urgent";
  status: "pending" | "completed" | "overdue";
  isRecurring: boolean;
  recurringFrequency?: "daily" | "weekly" | "biweekly" | "monthly";
  recurringEndDate?: Date;
  createdAt: Date;
  createdBy: string;
}

// Format 24-hour time to 12-hour AM/PM format (PST)
const formatTimeTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export default function CoachTasksPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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
    {
      id: "task-5",
      title: "Monthly Assessment Review",
      description: "Review completed assessments and discuss results",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      dueTime: "15:00",
      notifyBefore: { value: 1, unit: "days" },
      assignedJobSeekers: [demoClients[3].id, demoClients[4].id],
      priority: "default",
      status: "pending",
      isRecurring: true,
      recurringFrequency: "monthly",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      createdBy: `${demoCoach.firstName} ${demoCoach.lastName}`,
    },
  ]);

  // Filter state
  const [filter, setFilter] = useState<"all" | "today" | "overdue" | "upcoming" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CoachTask | null>(null);
  const [editingTask, setEditingTask] = useState<{
    title: string;
    description: string;
    dueDate: string;
    dueTime: string;
    priority: "default" | "urgent";
    notifyBefore: { value: number; unit: "hours" | "days" };
    assignedJobSeekers: string[];
    isRecurring: boolean;
    recurringFrequency: "daily" | "weekly" | "biweekly" | "monthly";
    recurringEndDate: string;
  } | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "09:00",
    priority: "default" as "default" | "urgent",
    notifyBefore: { value: 1, unit: "hours" as "hours" | "days" },
    assignedJobSeekers: [] as string[],
    isRecurring: false,
    recurringFrequency: "weekly" as "daily" | "weekly" | "biweekly" | "monthly",
  });

  // Task helpers
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    switch (filter) {
      case "today":
        filtered = filtered.filter(task => {
          const taskDate = new Date(task.dueDate);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate >= today && taskDate < tomorrow && task.status !== "completed";
        });
        break;
      case "overdue":
        filtered = filtered.filter(task => task.status === "overdue" || (new Date(task.dueDate) < today && task.status !== "completed"));
        break;
      case "upcoming":
        filtered = filtered.filter(task => {
          const taskDate = new Date(task.dueDate);
          return taskDate >= today && taskDate <= threeDaysFromNow && task.status === "pending";
        });
        break;
      case "completed":
        filtered = filtered.filter(task => task.status === "completed");
        break;
    }

    return filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const markTaskComplete = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: "completed" as const } : task
    ));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const openTaskDetails = useCallback((task: CoachTask) => {
    setSelectedTask(task);
    setEditingTask({
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate).toISOString().split("T")[0],
      dueTime: task.dueTime,
      priority: task.priority,
      notifyBefore: { ...task.notifyBefore },
      assignedJobSeekers: [...task.assignedJobSeekers],
      isRecurring: task.isRecurring,
      recurringFrequency: task.recurringFrequency || "weekly",
      recurringEndDate: task.recurringEndDate ? new Date(task.recurringEndDate).toISOString().split("T")[0] : "",
    });
  }, []);

  const handleSaveTask = useCallback(() => {
    if (!selectedTask || !editingTask) return;
    if (!editingTask.title.trim() || !editingTask.dueDate) return;

    setTasks(prev => prev.map(task =>
      task.id === selectedTask.id
        ? {
            ...task,
            title: editingTask.title,
            description: editingTask.description,
            dueDate: new Date(editingTask.dueDate),
            dueTime: editingTask.dueTime,
            priority: editingTask.priority,
            notifyBefore: editingTask.notifyBefore,
            assignedJobSeekers: editingTask.assignedJobSeekers,
            isRecurring: editingTask.isRecurring,
            recurringFrequency: editingTask.isRecurring ? editingTask.recurringFrequency : undefined,
            recurringEndDate: editingTask.isRecurring && editingTask.recurringEndDate ? new Date(editingTask.recurringEndDate) : undefined,
            // Update status based on new due date
            status: task.status === "completed" ? "completed" : (new Date(editingTask.dueDate) < new Date() ? "overdue" : "pending"),
          }
        : task
    ));
    setSelectedTask(null);
    setEditingTask(null);
  }, [selectedTask, editingTask]);

  const closeTaskDetails = useCallback(() => {
    setSelectedTask(null);
    setEditingTask(null);
  }, []);

  const handleCreateTask = () => {
    if (!newTask.title.trim() || !newTask.dueDate) return;

    const task: CoachTask = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      dueDate: new Date(newTask.dueDate),
      dueTime: newTask.dueTime,
      notifyBefore: newTask.notifyBefore,
      assignedJobSeekers: newTask.assignedJobSeekers,
      priority: newTask.priority,
      status: "pending",
      isRecurring: newTask.isRecurring,
      recurringFrequency: newTask.isRecurring ? newTask.recurringFrequency : undefined,
      createdAt: new Date(),
      createdBy: `${demoCoach.firstName} ${demoCoach.lastName}`,
    };

    setTasks(prev => [task, ...prev]);
    setShowCreateModal(false);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "09:00",
      priority: "default",
      notifyBefore: { value: 1, unit: "hours" },
      assignedJobSeekers: [],
      isRecurring: false,
      recurringFrequency: "weekly",
    });
  };

  const formatTaskDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getAssignedClients = (jobSeekerIds: string[]) => {
    return demoClients.filter(c => jobSeekerIds.includes(c.id));
  };

  const filteredTasks = getFilteredTasks();

  // Stats
  const tasksDueToday = tasks.filter(t => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const taskDate = new Date(t.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate >= today && taskDate < tomorrow && t.status !== "completed";
  }).length;

  const overdueTasks = tasks.filter(t => t.status === "overdue" || (new Date(t.dueDate) < new Date() && t.status !== "completed")).length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Tasks
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Manage your tasks and follow-ups
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className={isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}
        >
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          Create Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setFilter("all")}
          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
            filter === "all"
              ? isDark ? "border-[#4FD1C5] bg-[#4FD1C5]/10" : "border-[#2B8A8A] bg-[#2B8A8A]/10"
              : isDark ? "border-gray-800 bg-gray-900 hover:border-gray-700" : "border-gray-100 bg-white hover:border-gray-200"
          }`}
        >
          <ListTodo className={`h-5 w-5 mb-2 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} aria-hidden="true" />
          <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tasks.length}</p>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Total Tasks</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setFilter("today")}
          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
            filter === "today"
              ? isDark ? "border-blue-500 bg-blue-900/20" : "border-blue-500 bg-blue-50"
              : isDark ? "border-gray-800 bg-gray-900 hover:border-gray-700" : "border-gray-100 bg-white hover:border-gray-200"
          }`}
        >
          <Clock className={`h-5 w-5 mb-2 ${isDark ? "text-blue-400" : "text-blue-500"}`} aria-hidden="true" />
          <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{tasksDueToday}</p>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Due Today</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setFilter("overdue")}
          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
            filter === "overdue"
              ? isDark ? "border-red-500 bg-red-900/20" : "border-red-500 bg-red-50"
              : overdueTasks > 0
              ? isDark ? "border-red-800 bg-red-900/10 hover:border-red-700" : "border-red-100 bg-red-50/50 hover:border-red-200"
              : isDark ? "border-gray-800 bg-gray-900 hover:border-gray-700" : "border-gray-100 bg-white hover:border-gray-200"
          }`}
        >
          <AlertTriangle className={`h-5 w-5 mb-2 ${overdueTasks > 0 ? (isDark ? "text-red-400" : "text-red-500") : (isDark ? "text-gray-500" : "text-gray-400")}`} aria-hidden="true" />
          <p className={`text-2xl font-bold ${overdueTasks > 0 ? (isDark ? "text-red-400" : "text-red-600") : (isDark ? "text-white" : "text-gray-900")}`}>{overdueTasks}</p>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Overdue</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setFilter("completed")}
          className={`p-4 rounded-xl border cursor-pointer transition-colors ${
            filter === "completed"
              ? isDark ? "border-green-500 bg-green-900/20" : "border-green-500 bg-green-50"
              : isDark ? "border-gray-800 bg-gray-900 hover:border-gray-700" : "border-gray-100 bg-white hover:border-gray-200"
          }`}
        >
          <CheckCircle className={`h-5 w-5 mb-2 ${isDark ? "text-green-400" : "text-green-500"}`} aria-hidden="true" />
          <p className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{completedTasks}</p>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Completed</p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
              isDark
                ? "bg-gray-900 border-gray-800 text-white placeholder-gray-500 focus:ring-[#4FD1C5]"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#2B8A8A]"
            }`}
          />
        </div>
      </div>

      {/* Task List */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
        <div className={`px-5 py-4 border-b ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          <h2 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
            {filter === "all" ? "All Tasks" : filter === "today" ? "Due Today" : filter === "overdue" ? "Overdue Tasks" : filter === "upcoming" ? "Upcoming Tasks" : "Completed Tasks"}
          </h2>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {filteredTasks.length === 0 ? (
            <div className={`p-8 text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              <ListTodo className="h-12 w-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
              <p>No tasks found</p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const assignedClients = getAssignedClients(task.assignedJobSeekers);
              const isOverdue = task.status === "overdue" || (new Date(task.dueDate) < new Date() && task.status !== "completed");

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => openTaskDetails(task)}
                  className={`p-4 transition-colors cursor-pointer ${
                    task.status === "completed"
                      ? isDark ? "bg-gray-800/30" : "bg-gray-50"
                      : isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); markTaskComplete(task.id); }}
                      disabled={task.status === "completed"}
                      className={`mt-1 p-1 rounded transition-colors ${
                        task.status === "completed"
                          ? isDark ? "text-green-400" : "text-green-500"
                          : isDark ? "text-gray-500 hover:text-green-400" : "text-gray-400 hover:text-green-500"
                      }`}
                      aria-label={task.status === "completed" ? "Completed" : "Mark as complete"}
                    >
                      <CheckCircle className="h-5 w-5" aria-hidden="true" />
                    </motion.button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {task.priority === "urgent" && (
                          <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                            isDark ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-600"
                          }`}>
                            Urgent
                          </span>
                        )}
                        <h3 className={`font-medium ${
                          task.status === "completed"
                            ? isDark ? "text-gray-500 line-through" : "text-gray-400 line-through"
                            : isDark ? "text-white" : "text-gray-900"
                        }`}>
                          {task.title}
                        </h3>
                        {task.isRecurring && (
                          <Repeat className={`h-4 w-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} aria-hidden="true" />
                        )}
                        {/* Assigned Job Seeker Avatars */}
                        {assignedClients.length > 0 && (
                          <div className="flex items-center -space-x-1.5 ml-1">
                            {assignedClients.slice(0, 4).map((client, idx) => (
                              <img
                                key={client.id}
                                src={client.avatar}
                                alt={`${client.firstName} ${client.lastName}`}
                                title={`${client.firstName} ${client.lastName}`}
                                className={`w-5 h-5 rounded-full object-cover border-2 ${
                                  isDark ? "border-gray-900" : "border-white"
                                }`}
                                style={{ zIndex: assignedClients.length - idx }}
                              />
                            ))}
                            {assignedClients.length > 4 && (
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium border-2 ${
                                isDark ? "bg-gray-700 text-gray-300 border-gray-900" : "bg-gray-200 text-gray-600 border-white"
                              }`}>
                                +{assignedClients.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {task.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs">
                        {/* Due Date - Yellow/Amber for visibility */}
                        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium ${
                          isOverdue && task.status !== "completed"
                            ? isDark ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-600"
                            : task.status === "completed"
                            ? isDark ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400"
                            : isDark ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700"
                        }`}>
                          <Calendar className="h-3 w-3" aria-hidden="true" />
                          {formatTaskDate(task.dueDate)} at {formatTimeTo12Hour(task.dueTime)}
                        </span>

                        <span className={`flex items-center gap-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          <Bell className="h-3 w-3" aria-hidden="true" />
                          {task.notifyBefore.value} {task.notifyBefore.unit} before
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); openTaskDetails(task); }}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? "text-gray-500 hover:text-[#4FD1C5] hover:bg-[#4FD1C5]/10" : "text-gray-400 hover:text-[#2B8A8A] hover:bg-[#2B8A8A]/10"
                        }`}
                        aria-label="Edit task"
                      >
                        <Edit3 className="h-4 w-4" aria-hidden="true" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark ? "text-gray-500 hover:text-red-400 hover:bg-red-900/20" : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                        }`}
                        aria-label="Delete task"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl ${
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
                    <Plus className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} aria-hidden="true" />
                  </div>
                  <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Create New Task
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateModal(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="e.g., Call Marcus - Interview Prep"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-[#4FD1C5]"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#2B8A8A]"
                    }`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Add details about the task..."
                    rows={3}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm resize-none transition-colors focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-[#4FD1C5]"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#2B8A8A]"
                    }`}
                  />
                </div>

                {/* Due Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                          : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      Time
                    </label>
                    <input
                      type="time"
                      value={newTask.dueTime}
                      onChange={(e) => setNewTask({ ...newTask, dueTime: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                          : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                      }`}
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Priority
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setNewTask({ ...newTask, priority: "default" })}
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        newTask.priority === "default"
                          ? isDark ? "border-[#4FD1C5] bg-[#4FD1C5]/10 text-[#4FD1C5]" : "border-[#2B8A8A] bg-[#2B8A8A]/10 text-[#2B8A8A]"
                          : isDark ? "border-gray-700 text-gray-400 hover:border-gray-600" : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      Default
                    </button>
                    <button
                      onClick={() => setNewTask({ ...newTask, priority: "urgent" })}
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        newTask.priority === "urgent"
                          ? isDark ? "border-red-500 bg-red-900/20 text-red-400" : "border-red-500 bg-red-50 text-red-600"
                          : isDark ? "border-gray-700 text-gray-400 hover:border-gray-600" : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      Urgent
                    </button>
                  </div>
                </div>

                {/* Notify Before */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Notify Before
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      min="1"
                      value={newTask.notifyBefore.value}
                      onChange={(e) => setNewTask({ ...newTask, notifyBefore: { ...newTask.notifyBefore, value: parseInt(e.target.value) || 1 } })}
                      className={`w-20 px-4 py-2.5 rounded-lg border text-sm text-center transition-colors focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                          : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                      }`}
                    />
                    <select
                      value={newTask.notifyBefore.unit}
                      onChange={(e) => setNewTask({ ...newTask, notifyBefore: { ...newTask.notifyBefore, unit: e.target.value as "hours" | "days" } })}
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                          : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                      }`}
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>

                {/* Assign Job Seekers */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Assign Job Seekers
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {demoClients.map((client) => (
                      <label
                        key={client.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          newTask.assignedJobSeekers.includes(client.id)
                            ? isDark ? "bg-[#4FD1C5]/10" : "bg-[#2B8A8A]/10"
                            : isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={newTask.assignedJobSeekers.includes(client.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewTask({ ...newTask, assignedJobSeekers: [...newTask.assignedJobSeekers, client.id] });
                            } else {
                              setNewTask({ ...newTask, assignedJobSeekers: newTask.assignedJobSeekers.filter(id => id !== client.id) });
                            }
                          }}
                          className="rounded"
                        />
                        <img src={client.avatar} alt="" className="w-8 h-8 rounded-full" />
                        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                          {client.firstName} {client.lastName}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Recurring */}
                <div>
                  <label className={`flex items-center gap-3 cursor-pointer ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    <input
                      type="checkbox"
                      checked={newTask.isRecurring}
                      onChange={(e) => setNewTask({ ...newTask, isRecurring: e.target.checked })}
                      className="rounded"
                    />
                    <Repeat className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">Make this a recurring task</span>
                  </label>

                  {newTask.isRecurring && (
                    <div className="mt-3 ml-7">
                      <select
                        value={newTask.recurringFrequency}
                        onChange={(e) => setNewTask({ ...newTask, recurringFrequency: e.target.value as "daily" | "weekly" | "biweekly" | "monthly" })}
                        className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                          isDark
                            ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                            : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                        }`}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`px-6 py-4 border-t flex gap-3 ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                <Button
                  variant="outline"
                  className={`flex-1 ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}`}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTask}
                  disabled={!newTask.title.trim() || !newTask.dueDate}
                  className={`flex-1 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}
                >
                  Create Task
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {selectedTask && editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeTaskDetails}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className={`rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl ${
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
                    <Edit3 className={`h-5 w-5 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`} aria-hidden="true" />
                  </div>
                  <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Task Details
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeTaskDetails}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                  }`}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-5">
                {/* Status Badge */}
                {(() => {
                  const taskStatus = selectedTask.status;
                  const isTaskOverdue = taskStatus === "overdue" || (new Date(selectedTask.dueDate) < new Date() && taskStatus !== "completed");
                  return (
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        taskStatus === "completed"
                          ? isDark ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-600"
                          : isTaskOverdue
                          ? isDark ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-600"
                          : isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
                      }`}>
                        {taskStatus === "completed" ? "Completed" : isTaskOverdue ? "Overdue" : "Pending"}
                      </span>
                      {selectedTask.isRecurring && (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                          isDark ? "bg-purple-900/30 text-purple-400" : "bg-purple-100 text-purple-600"
                        }`}>
                          <Repeat className="h-3 w-3" aria-hidden="true" />
                          {selectedTask.recurringFrequency?.charAt(0).toUpperCase()}{selectedTask.recurringFrequency?.slice(1)}
                        </span>
                      )}
                      <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                        Created {new Date(selectedTask.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  );
                })()}

                {/* Title */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    placeholder="e.g., Call Marcus - Interview Prep"
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-[#4FD1C5]"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#2B8A8A]"
                    }`}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Description
                  </label>
                  <textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    placeholder="Add details about the task..."
                    rows={3}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm resize-none transition-colors focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-[#4FD1C5]"
                        : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-[#2B8A8A]"
                    }`}
                  />
                </div>

                {/* Due Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={editingTask.dueDate}
                      onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                          : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                      Time
                    </label>
                    <input
                      type="time"
                      value={editingTask.dueTime}
                      onChange={(e) => setEditingTask({ ...editingTask, dueTime: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                          : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                      }`}
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Priority
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingTask({ ...editingTask, priority: "default" })}
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        editingTask.priority === "default"
                          ? isDark ? "border-[#4FD1C5] bg-[#4FD1C5]/10 text-[#4FD1C5]" : "border-[#2B8A8A] bg-[#2B8A8A]/10 text-[#2B8A8A]"
                          : isDark ? "border-gray-700 text-gray-400 hover:border-gray-600" : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      Default
                    </button>
                    <button
                      onClick={() => setEditingTask({ ...editingTask, priority: "urgent" })}
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        editingTask.priority === "urgent"
                          ? isDark ? "border-red-500 bg-red-900/20 text-red-400" : "border-red-500 bg-red-50 text-red-600"
                          : isDark ? "border-gray-700 text-gray-400 hover:border-gray-600" : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      Urgent
                    </button>
                  </div>
                </div>

                {/* Notify Before */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Notify Before
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      min="1"
                      value={editingTask.notifyBefore.value}
                      onChange={(e) => setEditingTask({ ...editingTask, notifyBefore: { ...editingTask.notifyBefore, value: parseInt(e.target.value) || 1 } })}
                      className={`w-20 px-4 py-2.5 rounded-lg border text-sm text-center transition-colors focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                          : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                      }`}
                    />
                    <select
                      value={editingTask.notifyBefore.unit}
                      onChange={(e) => setEditingTask({ ...editingTask, notifyBefore: { ...editingTask.notifyBefore, unit: e.target.value as "hours" | "days" } })}
                      className={`flex-1 px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                          : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                      }`}
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>

                {/* Assign Job Seekers */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    Assigned Job Seekers
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {demoClients.map((client) => (
                      <label
                        key={client.id}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          editingTask.assignedJobSeekers.includes(client.id)
                            ? isDark ? "bg-[#4FD1C5]/10" : "bg-[#2B8A8A]/10"
                            : isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={editingTask.assignedJobSeekers.includes(client.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditingTask({ ...editingTask, assignedJobSeekers: [...editingTask.assignedJobSeekers, client.id] });
                            } else {
                              setEditingTask({ ...editingTask, assignedJobSeekers: editingTask.assignedJobSeekers.filter(id => id !== client.id) });
                            }
                          }}
                          className="rounded"
                        />
                        <img src={client.avatar} alt="" className="w-8 h-8 rounded-full" />
                        <span className={`text-sm ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                          {client.firstName} {client.lastName}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Recurring */}
                <div>
                  <label className={`flex items-center gap-3 cursor-pointer ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                    <input
                      type="checkbox"
                      checked={editingTask.isRecurring}
                      onChange={(e) => setEditingTask({ ...editingTask, isRecurring: e.target.checked })}
                      className="rounded"
                    />
                    <Repeat className="h-4 w-4" aria-hidden="true" />
                    <span className="text-sm font-medium">Make this a recurring task</span>
                  </label>

                  {editingTask.isRecurring && (
                    <div className="mt-3 ml-7 space-y-3">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          Frequency
                        </label>
                        <select
                          value={editingTask.recurringFrequency}
                          onChange={(e) => setEditingTask({ ...editingTask, recurringFrequency: e.target.value as "daily" | "weekly" | "biweekly" | "monthly" })}
                          className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                            isDark
                              ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                              : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                          }`}
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="biweekly">Bi-weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          End Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={editingTask.recurringEndDate}
                          onChange={(e) => setEditingTask({ ...editingTask, recurringEndDate: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
                            isDark
                              ? "bg-gray-800 border-gray-700 text-white focus:ring-[#4FD1C5]"
                              : "bg-white border-gray-200 text-gray-900 focus:ring-[#2B8A8A]"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Task Metadata */}
                <div className={`p-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
                  <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                    Created by {selectedTask.createdBy} on {new Date(selectedTask.createdAt).toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`px-6 py-4 border-t flex gap-3 ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                <Button
                  variant="outline"
                  className={`flex-1 ${isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : ""}`}
                  onClick={closeTaskDetails}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTask}
                  disabled={!editingTask.title.trim() || !editingTask.dueDate}
                  className={`flex-1 ${isDark ? "bg-[#4FD1C5] hover:bg-[#3DBDB0] text-gray-900" : "bg-[#2B8A8A] hover:bg-[#237070] text-white"}`}
                >
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
