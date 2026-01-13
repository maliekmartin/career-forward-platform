"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/theme-context";
import {
  MapPin,
  Phone,
  ExternalLink,
  Building2,
  GraduationCap,
  Library,
  Landmark,
  Compass,
  Briefcase,
  Heart,
  Wrench,
  Truck,
  Warehouse,
  Search,
  Calendar,
  Clock,
  Filter,
  ChevronRight,
  Award,
  BookOpen,
  Monitor,
  Users,
} from "lucide-react";

// Resource categories
const categories = [
  { id: "all", label: "All", icon: Filter },
  { id: "job-centers", label: "Job Centers", icon: Building2 },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "community", label: "Community", icon: Users },
  { id: "government", label: "Government", icon: Landmark },
];

// Industry filters
const industries = [
  { id: "all", label: "All Industries" },
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "manufacturing", label: "Manufacturing", icon: Wrench },
  { id: "professional-services", label: "Professional Services", icon: Briefcase },
  { id: "warehousing", label: "Warehousing", icon: Warehouse },
  { id: "transportation", label: "Transportation", icon: Truck },
];

// Resource type
interface Resource {
  id: string;
  name: string;
  description: string;
  address?: string;
  phone?: string;
  website?: string;
  category: string;
  industries: string[];
  tags: string[];
  icon: string;
  featured?: boolean;
}

// Demo resources for Spokane
const resources: Resource[] = [
  // Job Centers
  {
    id: "res-1",
    name: "WorkSource Spokane",
    description: "One-stop career center offering job search assistance, training programs, and employment services for Spokane County residents.",
    address: "130 S Arthur St, Spokane, WA 99202",
    phone: "(509) 532-3000",
    website: "https://worksourcewa.com",
    category: "job-centers",
    industries: ["all"],
    tags: ["Job Search Assistance", "Resume Help", "Career Counseling", "Skills Training", "WIOA Programs"],
    icon: "building",
    featured: true,
  },
  {
    id: "res-2",
    name: "Goodwill Industries of the Inland Northwest",
    description: "Provides job training, employment placement services, and career development programs.",
    address: "130 E 3rd Ave, Spokane, WA 99202",
    phone: "(509) 838-4246",
    website: "https://discovergoodwill.org",
    category: "job-centers",
    industries: ["all"],
    tags: ["Job Training", "Employment Services", "Career Development", "Retail Jobs"],
    icon: "building",
  },
  {
    id: "res-3",
    name: "Washington State Employment Security",
    description: "State agency providing unemployment benefits, job matching services, and labor market information.",
    address: "620 N Division St, Spokane, WA 99202",
    phone: "(509) 482-4100",
    website: "https://esd.wa.gov",
    category: "government",
    industries: ["all"],
    tags: ["Unemployment Benefits", "Job Matching", "Labor Market Info", "Re-employment Services"],
    icon: "landmark",
  },

  // Education - Community College
  {
    id: "res-4",
    name: "Spokane Community College",
    description: "Offers associate degrees, certificates, and workforce training programs aligned with regional employer needs.",
    address: "1810 N Greene St, Spokane, WA 99217",
    phone: "(509) 533-7000",
    website: "https://scc.spokane.edu",
    category: "education",
    industries: ["healthcare", "manufacturing", "professional-services"],
    tags: ["Associate Degrees", "Certificates", "Workforce Training", "Financial Aid"],
    icon: "graduation",
    featured: true,
  },
  {
    id: "res-5",
    name: "Spokane Falls Community College",
    description: "Two-year college offering transfer degrees and professional-technical programs.",
    address: "3410 W Whistalks Way, Spokane, WA 99224",
    phone: "(509) 533-3500",
    website: "https://sfcc.spokane.edu",
    category: "education",
    industries: ["healthcare", "professional-services"],
    tags: ["Transfer Degrees", "Healthcare Programs", "Business Programs", "Online Classes"],
    icon: "graduation",
  },

  // Certifications - Healthcare
  {
    id: "res-6",
    name: "Providence Health Care Training",
    description: "Healthcare certification programs including CNA, Medical Assistant, and patient care technician training.",
    address: "101 W 8th Ave, Spokane, WA 99204",
    phone: "(509) 474-4700",
    website: "https://providence.org/careers",
    category: "certifications",
    industries: ["healthcare"],
    tags: ["CNA Certification", "Medical Assistant", "Patient Care", "Phlebotomy"],
    icon: "award",
    featured: true,
  },
  {
    id: "res-7",
    name: "MultiCare Workforce Development",
    description: "Healthcare career pathways and certification programs with tuition assistance for employees.",
    address: "Spokane Valley, WA",
    phone: "(509) 473-7000",
    website: "https://multicare.org/careers",
    category: "certifications",
    industries: ["healthcare"],
    tags: ["Nursing Programs", "Healthcare Careers", "Tuition Assistance", "Career Ladders"],
    icon: "award",
  },

  // Certifications - Manufacturing
  {
    id: "res-8",
    name: "Spokane STEM Network - Manufacturing",
    description: "Connects job seekers with manufacturing certifications and apprenticeships in the Spokane region.",
    address: "Spokane, WA",
    website: "https://spokanestem.org",
    category: "certifications",
    industries: ["manufacturing"],
    tags: ["Welding Certification", "CNC Machining", "Industrial Maintenance", "Apprenticeships"],
    icon: "award",
  },
  {
    id: "res-9",
    name: "IBEW Local 73 Apprenticeship",
    description: "Electrical apprenticeship program offering paid on-the-job training and classroom instruction.",
    address: "2825 N Market St, Spokane, WA 99207",
    phone: "(509) 489-8877",
    website: "https://ibewlu73.com",
    category: "certifications",
    industries: ["manufacturing"],
    tags: ["Electrical Apprenticeship", "Paid Training", "Union Benefits", "Journey-Level Certification"],
    icon: "award",
    featured: true,
  },

  // Certifications - Transportation & Warehousing
  {
    id: "res-10",
    name: "160 Driving Academy - Spokane",
    description: "CDL training programs for Class A and Class B commercial driver's licenses.",
    address: "Spokane, WA",
    phone: "(509) 321-3000",
    website: "https://160drivingacademy.com",
    category: "certifications",
    industries: ["transportation", "warehousing"],
    tags: ["CDL Training", "Class A License", "Class B License", "Job Placement"],
    icon: "award",
  },
  {
    id: "res-11",
    name: "Amazon Career Choice - Spokane",
    description: "Tuition-free training and certification programs for Amazon employees in logistics and beyond.",
    address: "Spokane Area Fulfillment Centers",
    website: "https://amazoncareerchoice.com",
    category: "certifications",
    industries: ["warehousing", "transportation"],
    tags: ["Forklift Certification", "Logistics Training", "IT Certifications", "Tuition-Free"],
    icon: "award",
  },

  // Certifications - Professional Services
  {
    id: "res-12",
    name: "CompTIA Certification Prep - SCC",
    description: "IT certification preparation courses including A+, Network+, and Security+ at Spokane Community College.",
    address: "1810 N Greene St, Spokane, WA 99217",
    phone: "(509) 533-7000",
    website: "https://scc.spokane.edu/it",
    category: "certifications",
    industries: ["professional-services"],
    tags: ["CompTIA A+", "Network+", "Security+", "IT Careers"],
    icon: "award",
  },
  {
    id: "res-13",
    name: "Google Career Certificates",
    description: "Online professional certificates in IT Support, Data Analytics, Project Management, and UX Design.",
    website: "https://grow.google/certificates",
    category: "certifications",
    industries: ["professional-services"],
    tags: ["IT Support", "Data Analytics", "Project Management", "UX Design", "Online Learning"],
    icon: "monitor",
    featured: true,
  },

  // Community Resources
  {
    id: "res-14",
    name: "Spokane Public Library - Downtown",
    description: "Free computer access, job search resources, resume printing, and career development workshops.",
    address: "906 W Main Ave, Spokane, WA 99201",
    phone: "(509) 444-5300",
    website: "https://spokanelibrary.org",
    category: "community",
    industries: ["all"],
    tags: ["Computer Access", "Job Resources", "Free WiFi", "Resume Printing", "Workshops"],
    icon: "library",
  },
  {
    id: "res-15",
    name: "Career Path Services",
    description: "Non-profit providing career coaching, job search assistance, and support services for job seekers.",
    address: "Spokane, WA",
    phone: "(509) 326-7870",
    website: "https://careerpathservices.org",
    category: "community",
    industries: ["all"],
    tags: ["Career Coaching", "Job Search Support", "Interview Prep", "Barrier Removal"],
    icon: "users",
  },
  {
    id: "res-16",
    name: "SNAP Employment & Training",
    description: "Employment and training services for SNAP (food stamp) recipients in Spokane County.",
    address: "Spokane, WA",
    phone: "(509) 477-3600",
    website: "https://spokanecounty.org",
    category: "government",
    industries: ["all"],
    tags: ["SNAP Benefits", "Job Training", "Support Services", "Transportation Help"],
    icon: "landmark",
  },

  // Online Learning
  {
    id: "res-17",
    name: "LinkedIn Learning (Free via Library)",
    description: "Access thousands of online courses free with your Spokane Public Library card.",
    website: "https://spokanelibrary.org/linkedin-learning",
    category: "education",
    industries: ["all"],
    tags: ["Online Courses", "Business Skills", "Tech Skills", "Free Access"],
    icon: "monitor",
  },
  {
    id: "res-18",
    name: "Coursera for Workforce",
    description: "Online learning platform offering courses and certificates from top universities and companies.",
    website: "https://coursera.org",
    category: "education",
    industries: ["professional-services", "healthcare"],
    tags: ["Online Degrees", "Professional Certificates", "Flexible Learning", "Industry Partners"],
    icon: "monitor",
  },
];

// Upcoming events
interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  type: string;
  description: string;
}

const upcomingEvents: Event[] = [
  {
    id: "event-1",
    title: "Healthcare Career Fair",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: "10:00 AM - 2:00 PM",
    location: "Spokane Convention Center",
    type: "Career Fair",
    description: "Meet employers from Providence, MultiCare, and other healthcare organizations.",
  },
  {
    id: "event-2",
    title: "Resume Writing Workshop",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: "6:00 PM - 7:30 PM",
    location: "WorkSource Spokane",
    type: "Workshop",
    description: "Learn how to craft a compelling resume that gets noticed by employers.",
  },
  {
    id: "event-3",
    title: "Manufacturing Job Fair",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    time: "9:00 AM - 1:00 PM",
    location: "Spokane Community College",
    type: "Career Fair",
    description: "Connect with local manufacturers including aerospace and advanced manufacturing companies.",
  },
  {
    id: "event-4",
    title: "CDL Information Session",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: "2:00 PM - 3:00 PM",
    location: "160 Driving Academy",
    type: "Info Session",
    description: "Learn about CDL training programs and career opportunities in transportation.",
  },
  {
    id: "event-5",
    title: "Tech Career Networking",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    time: "5:30 PM - 7:30 PM",
    location: "Spokane Create Coworking",
    type: "Networking",
    description: "Connect with tech professionals and learn about IT career paths in Spokane.",
  },
];

export default function ResourcesPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [activeTab, setActiveTab] = useState<"resources" | "events">("resources");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesIndustry = selectedIndustry === "all" || resource.industries.includes(selectedIndustry) || resource.industries.includes("all");
    const matchesSearch = searchQuery === "" ||
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesIndustry && matchesSearch;
  });

  const getResourceIcon = (iconType: string) => {
    switch (iconType) {
      case "building": return Building2;
      case "graduation": return GraduationCap;
      case "library": return Library;
      case "landmark": return Landmark;
      case "award": return Award;
      case "monitor": return Monitor;
      case "users": return Users;
      default: return Building2;
    }
  };

  const formatEventDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Local Resources</h1>
        <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Find job centers, training programs, and community resources in Spokane County
        </p>
      </div>

      {/* Tabs */}
      <div className={`flex gap-6 border-b mb-6 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
        <button
          onClick={() => setActiveTab("resources")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "resources"
              ? "border-[#2B8A8A] text-[#2B8A8A]"
              : isDark
                ? "border-transparent text-gray-500 hover:text-gray-300"
                : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Resources
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "events"
              ? "border-[#2B8A8A] text-[#2B8A8A]"
              : isDark
                ? "border-transparent text-gray-500 hover:text-gray-300"
                : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Upcoming Events
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "resources" ? (
          <motion.div
            key="resources"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources, certifications, training programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#2B8A8A] focus:border-transparent ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-[#2B8A8A] text-white"
                        : isDark
                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {category.label}
                  </button>
                );
              })}
            </div>

            {/* Industry Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`text-sm mr-2 self-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>Industry:</span>
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedIndustry === industry.id
                      ? "bg-[#2B8A8A]/10 text-[#2B8A8A] ring-1 ring-[#2B8A8A]"
                      : isDark
                        ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {industry.label}
                </button>
              ))}
            </div>

            {/* Featured Resources */}
            {selectedCategory === "all" && selectedIndustry === "all" && searchQuery === "" && (
              <div className="mb-8">
                <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  <Compass className="h-5 w-5 text-[#2B8A8A]" />
                  Featured Resources
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.filter(r => r.featured).map((resource) => {
                    const Icon = getResourceIcon(resource.icon);
                    return (
                      <motion.div
                        key={resource.id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-5 rounded-xl border-2 border-[#2B8A8A]/20 ${
                          isDark
                            ? "bg-gradient-to-br from-[#2B8A8A]/10 to-transparent"
                            : "bg-gradient-to-br from-[#2B8A8A]/5 to-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-[#2B8A8A]/10">
                            <Icon className="h-6 w-6 text-[#2B8A8A]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{resource.name}</h3>
                            <p className={`text-sm mt-1 line-clamp-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{resource.description}</p>
                            {resource.website && (
                              <a
                                href={resource.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-[#2B8A8A] hover:underline mt-2"
                              >
                                Visit Website
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Resource List */}
            <div className="space-y-4">
              <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                {selectedCategory === "all" ? "All Resources" : categories.find(c => c.id === selectedCategory)?.label}
                <span className={`text-sm font-normal ml-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>({filteredResources.length})</span>
              </h2>

              {filteredResources.length === 0 ? (
                <div className={`p-8 text-center rounded-xl ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-500"}`}>
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No resources found matching your criteria.</p>
                  <button
                    onClick={() => { setSelectedCategory("all"); setSelectedIndustry("all"); setSearchQuery(""); }}
                    className="mt-3 text-[#2B8A8A] hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredResources.map((resource) => {
                    const Icon = getResourceIcon(resource.icon);
                    return (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-5 rounded-xl border transition-all ${
                          isDark
                            ? "bg-gray-900 border-gray-800 hover:border-[#4FD1C5]/30"
                            : "bg-white border-gray-200 hover:border-[#2B8A8A]/30 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                            <Icon className={`h-6 w-6 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{resource.name}</h3>
                            {resource.address && (
                              <p className={`text-sm flex items-center gap-1 mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                                <MapPin className="h-3.5 w-3.5" />
                                {resource.address}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              {resource.phone && (
                                <a
                                  href={`tel:${resource.phone}`}
                                  className={`text-sm hover:underline flex items-center gap-1 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`}
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                  {resource.phone}
                                </a>
                              )}
                              {resource.website && (
                                <a
                                  href={resource.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`text-sm hover:underline flex items-center gap-1 ${isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"}`}
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  Website
                                </a>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {resource.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2.5 py-1 rounded-full text-xs ${
                                    isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <ChevronRight className={`h-5 w-5 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="events"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Upcoming Events */}
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-xl border transition-all ${
                    isDark
                      ? "bg-gray-900 border-gray-800 hover:border-[#4FD1C5]/30"
                      : "bg-white border-gray-200 hover:border-[#2B8A8A]/30 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#2B8A8A]/10 text-center min-w-[60px]">
                      <p className="text-xs text-[#2B8A8A] font-medium">
                        {event.date.toLocaleDateString([], { month: "short" })}
                      </p>
                      <p className="text-xl font-bold text-[#2B8A8A]">
                        {event.date.getDate()}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          event.type === "Career Fair"
                            ? isDark ? "bg-purple-900/30 text-purple-400" : "bg-purple-100 text-purple-600"
                            : event.type === "Workshop"
                              ? isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-600"
                              : event.type === "Info Session"
                                ? isDark ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-600"
                                : isDark ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-600"
                        }`}>
                          {event.type}
                        </span>
                        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{formatEventDate(event.date)}</span>
                      </div>
                      <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{event.title}</h3>
                      <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{event.description}</p>
                      <div className={`flex flex-wrap items-center gap-4 mt-3 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isDark
                        ? "bg-[#4FD1C5] text-gray-900 hover:bg-[#3DBDB0]"
                        : "bg-[#2B8A8A] text-white hover:bg-[#237070]"
                    }`}>
                      RSVP
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add to Calendar Tip */}
            <div className={`mt-6 p-4 rounded-xl border ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center gap-3">
                <Calendar className={`h-5 w-5 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  <span className="font-medium">Pro tip:</span> RSVP to events to add them to your calendar and receive reminders.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
