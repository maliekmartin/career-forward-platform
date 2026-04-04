"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  FileText,
  Target,
  MessageSquare,
  Briefcase,
  Copy,
  Check,
  Loader2,
  Users,
  AlertCircle,
  Award,
  Gift,
  ChevronDown,
  ChevronUp,
  MapPin,
  Star,
  Zap,
  TrendingUp,
  Shield,
  Play,
} from "lucide-react";
import { US_REGIONS } from "@/lib/validations/waitlist";

// Region display names
const REGION_NAMES: Record<string, string> = {
  northwest: "Northwest",
  southwest: "Southwest",
  midwest: "Midwest",
  northeast: "Northeast",
  southeast: "Southeast",
  south: "South",
  mountain: "Mountain",
};

// Time ago helper
function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Animated counter component
function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const incrementTime = (duration * 1000) / end;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration, isInView]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// Floating particles component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#2B8A8A]/20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: [null, Math.random() * 400 - 200],
            y: [null, Math.random() * 400 - 200],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

export default function WaitlistPage() {
  const searchParams = useSearchParams();
  const referredBy = searchParams.get("ref");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    region: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const [recentSignups, setRecentSignups] = useState<Array<{ name: string; region: string; joinedAt: string }>>([]);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch waitlist data on mount
  useEffect(() => {
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => {
        setWaitlistCount(data.count);
        setRecentSignups(data.recent || []);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          referredBy: referredBy || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReferralLink(data.referralLink);
        setIsSuccess(true);
        setAlreadyExists(data.alreadyExists || false);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const features = [
    {
      icon: Briefcase,
      title: "Job Tracker",
      description: "Track every application in one place",
      highlight: true,
    },
    {
      icon: FileText,
      title: "AI Resume Builder",
      description: "100-point scoring system",
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      description: "Personalized opportunities",
    },
    {
      icon: MessageSquare,
      title: "AI Career Coach",
      description: "24/7 guidance & support",
    },
  ];

  const foundingPerks = [
    {
      icon: Gift,
      title: "2 Months Free Premium",
      description: "Full access to all premium features",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Award,
      title: "Founding Member Badge",
      description: "Exclusive profile recognition",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Sparkles,
      title: "Shape the Product",
      description: "Direct feedback channel",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Gift,
      title: "6-Month Giveaway",
      description: "One lucky winner!",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const stats = [
    { label: "Success Rate", value: "94%", icon: TrendingUp },
    { label: "Avg. Time to Hire", value: "21 days", icon: Zap },
    { label: "User Rating", value: "4.9/5", icon: Star },
  ];

  const faqs = [
    {
      question: "What is Career Forward?",
      answer:
        "Career Forward is an AI-powered career development platform designed to help job seekers land their dream jobs faster. We combine intelligent resume building, personalized job matching, interview preparation, and an AI career coach to guide you through every step of your job search journey.",
    },
    {
      question: "What do founding members get?",
      answer:
        "As a founding member, you'll receive 2 months of free premium access (a $10 value), an exclusive Founding Member badge on your profile that shows you were here from the beginning, and direct access to our feedback channel where you can help shape the product. Plus, one lucky founding member will win 6 months of premium access in our random giveaway!",
    },
    {
      question: "Is it really free?",
      answer:
        "Yes! Career Forward offers a generous free tier that includes our resume builder, job board access, and application tracker. Premium features like unlimited AI coach conversations, advanced resume scoring, and priority job matching are available through our affordable subscription - but founding members get 2 months free to try everything out.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      {mounted && <FloatingParticles />}

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-[#2B8A8A]/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-purple-500/5 to-transparent rounded-full blur-3xl translate-x-1/4 translate-y-1/4" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2B8A8A] to-[#1d6b6b] flex items-center justify-center shadow-lg shadow-[#2B8A8A]/25"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-gray-900">Career Forward</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/50">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16 relative z-10">
        {/* Hero Section with Video */}
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Left Side - Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2B8A8A]/10 to-purple-500/10 rounded-full text-[#2B8A8A] font-medium text-sm mb-6 border border-[#2B8A8A]/20"
              >
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.span>
                Beta Coming Soon
              </motion.div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6">
                Land Your Dream Job{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-[#2B8A8A] to-teal-600 bg-clip-text text-transparent">
                    Faster
                  </span>
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    <motion.path
                      d="M2 8 Q 50 2 100 8 T 198 8"
                      fill="none"
                      stroke="#2B8A8A"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                Join thousands of job seekers using AI-powered tools to build winning resumes,
                find perfect matches, and ace interviews.
              </p>

              {/* Stats Row */}
              <div className="flex gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
                      <stat.icon className="w-5 h-5 text-[#2B8A8A]" />
                      {stat.value}
                    </div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Social Proof */}
              {waitlistCount !== null && waitlistCount > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50"
                >
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2B8A8A] to-teal-600 border-2 border-white flex items-center justify-center text-white font-semibold text-sm"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      <AnimatedCounter value={waitlistCount} /> people joined
                    </p>
                    <p className="text-sm text-gray-500">Be part of the founding community</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right Side - Video Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="relative perspective-1000">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#2B8A8A]/20 to-purple-500/20 rounded-3xl blur-2xl scale-105" />

                {/* Laptop Mockup */}
                <div
                  className="relative transform hover:scale-[1.02] transition-transform duration-500"
                  style={{ filter: "drop-shadow(0 25px 50px rgba(43, 138, 138, 0.25))" }}
                >
                  {/* Screen bezel */}
                  <div className="bg-gray-800 rounded-t-2xl p-3 pb-0">
                    {/* Camera and top bar */}
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-2 h-2 rounded-full bg-gray-600" />
                    </div>
                    {/* Screen */}
                    <div className="bg-white rounded-t-xl overflow-hidden">
                      {/* Browser chrome */}
                      <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-3 border-b border-gray-200">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 mx-2">
                          <div className="bg-white rounded-lg px-4 py-1.5 text-sm text-gray-400 border border-gray-200 flex items-center gap-2">
                            <Shield className="w-3 h-3 text-green-500" />
                            careerforward.io
                          </div>
                        </div>
                      </div>
                      {/* Video content */}
                      <div className="relative">
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-auto aspect-video object-cover"
                        >
                          <source src="/hero-b2c.mp4" type="video/mp4" />
                        </video>
                        {/* Play indicator overlay */}
                        <motion.div
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 0 }}
                          transition={{ delay: 1, duration: 0.5 }}
                          className="absolute inset-0 bg-black/20 flex items-center justify-center"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: 2 }}
                            className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl"
                          >
                            <Play className="w-6 h-6 text-[#2B8A8A] ml-1" />
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  {/* Laptop base */}
                  <div className="bg-gray-700 h-5 rounded-b-xl mx-auto relative" style={{ width: "110%", marginLeft: "-5%" }}>
                    <div className="bg-gray-600 h-1.5 w-20 mx-auto rounded-b absolute bottom-0 left-1/2 -translate-x-1/2" />
                  </div>
                </div>

                {/* Stats Cards Below Video */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex justify-center gap-3 mt-6"
                >
                  <div className="bg-white rounded-xl px-4 py-3 shadow-lg border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2B8A8A] to-teal-600 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Applications Tracked</p>
                      <p className="text-lg font-bold text-gray-900">2,847</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl px-4 py-3 shadow-lg border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Offers Received</p>
                      <p className="text-lg font-bold text-gray-900">312</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Founding Member Perks - Cards */}
        <section className="max-w-7xl mx-auto px-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Exclusive Founding Member Perks
            </h2>
            <p className="text-gray-600">Join now and unlock these special benefits</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {foundingPerks.map((perk, index) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${perk.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${perk.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <perk.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="font-bold text-gray-900 mb-2">{perk.title}</h3>
                <p className="text-sm text-gray-500">{perk.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Main Content - Form + Features */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - Features & Recent Signups */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-28"
            >
              {/* Features Grid */}
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What You'll Get Access To</h3>

              {/* Highlighted Job Tracker Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group relative p-6 rounded-2xl bg-gradient-to-br from-[#2B8A8A] to-teal-600 text-white mb-4 shadow-xl shadow-[#2B8A8A]/25 overflow-hidden"
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl" />
                </div>
                <div className="relative flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg">Job Tracker</h4>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Most Popular</span>
                    </div>
                    <p className="text-white/90 text-sm mb-3">
                      Track every job application in one powerful dashboard. See status at a glance with our stoplight system - green for active, yellow for pending, red for closed.
                    </p>
                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-white/80">Active</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <span className="text-white/80">Pending</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-white/80">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Other Features Grid */}
              <div className="grid grid-cols-3 gap-3 mb-8">
                {features.filter(f => !f.highlight).map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className="group flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#2B8A8A]/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2B8A8A]/10 to-[#2B8A8A]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-[#2B8A8A]" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Recent Signups Feed */}
              {recentSignups.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h4 className="font-semibold text-gray-900">Live: People Joining Now</h4>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {recentSignups.slice(0, 5).map((signup, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2B8A8A] to-teal-600 flex items-center justify-center text-white font-medium text-sm">
                            {signup.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">{signup.name}</span>
                            <span className="text-gray-400 text-sm flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {REGION_NAMES[signup.region] || signup.region}
                            </span>
                          </div>
                        </div>
                        <span className="text-gray-400 text-xs bg-gray-50 px-2 py-1 rounded-full">
                          {timeAgo(new Date(signup.joinedAt))}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right Side - Form or Success */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl border border-gray-200 shadow-2xl shadow-gray-200/50 p-8 lg:p-10 relative overflow-hidden"
                  >
                    {/* Decorative gradient */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#2B8A8A]/10 to-transparent rounded-full blur-2xl" />

                    <div className="relative">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Join the Waitlist
                      </h2>
                      <p className="text-gray-600 mb-6">
                        Be the first to know when we launch and get exclusive founding member benefits.
                      </p>

                      {referredBy && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-6 p-4 bg-gradient-to-r from-[#2B8A8A]/5 to-purple-500/5 border border-[#2B8A8A]/20 rounded-xl"
                        >
                          <p className="text-sm text-[#2B8A8A] font-medium flex items-center gap-2">
                            <Gift className="w-4 h-4" />
                            You were referred by a friend! You'll both get priority access.
                          </p>
                        </motion.div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
                              First Name
                            </label>
                            <Input
                              id="firstName"
                              type="text"
                              required
                              value={formData.firstName}
                              onChange={(e) =>
                                setFormData({ ...formData, firstName: e.target.value })
                              }
                              placeholder="John"
                              className="h-12 rounded-xl border-gray-200 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]/20"
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
                              Last Name
                            </label>
                            <Input
                              id="lastName"
                              type="text"
                              required
                              value={formData.lastName}
                              onChange={(e) =>
                                setFormData({ ...formData, lastName: e.target.value })
                              }
                              placeholder="Doe"
                              className="h-12 rounded-xl border-gray-200 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]/20"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email Address
                          </label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="john@example.com"
                            className="h-12 rounded-xl border-gray-200 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]/20"
                          />
                        </div>

                        <div>
                          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1.5">
                            Region
                          </label>
                          <select
                            id="region"
                            required
                            value={formData.region}
                            onChange={(e) =>
                              setFormData({ ...formData, region: e.target.value })
                            }
                            className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] transition-all"
                          >
                            <option value="">Select your region</option>
                            {US_REGIONS.map((region) => (
                              <option key={region.value} value={region.value}>
                                {region.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                          >
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                          </motion.div>
                        )}

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-14 bg-gradient-to-r from-[#2B8A8A] to-teal-600 hover:from-[#237070] hover:to-teal-700 text-white rounded-xl font-semibold text-base shadow-lg shadow-[#2B8A8A]/25 hover:shadow-xl hover:shadow-[#2B8A8A]/30 transition-all duration-300"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Joining...
                            </>
                          ) : (
                            <>
                              Join the Waitlist
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>

                        <p className="text-xs text-gray-500 text-center">
                          By joining, you agree to receive email updates about Career Forward.
                          <br />
                          We'll never share your information.
                        </p>
                      </form>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl border border-gray-200 shadow-2xl shadow-gray-200/50 p-8 lg:p-10 text-center relative overflow-hidden"
                  >
                    {/* Confetti-like decorations */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: ["#2B8A8A", "#10b981", "#8b5cf6", "#f59e0b"][i % 4],
                            left: `${Math.random() * 100}%`,
                            top: "-10px",
                          }}
                          animate={{
                            y: [0, 500],
                            x: [0, Math.random() * 100 - 50],
                            rotate: [0, 360],
                            opacity: [1, 0],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.1,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </div>

                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
                    >
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </motion.div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      {alreadyExists ? "Welcome back!" : "You're a Founding Member!"}
                    </h2>
                    <p className="text-gray-600 mb-8 text-lg">
                      {alreadyExists
                        ? "You're already on the waitlist. Here's your referral link again."
                        : "Check your email for confirmation. Share your link to invite friends!"}
                    </p>

                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
                      <p className="text-sm text-gray-500 mb-3 uppercase tracking-wide font-semibold">
                        Your Referral Link
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={referralLink}
                          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 font-mono focus:outline-none"
                        />
                        <Button
                          onClick={handleCopy}
                          className={`h-12 px-5 rounded-xl transition-all duration-300 ${
                            copied
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-[#2B8A8A] hover:bg-[#237070]"
                          }`}
                        >
                          {copied ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : (
                            <Copy className="w-5 h-5 text-white" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-6">
                      Share your link to help friends discover Career Forward!
                    </p>

                    <div className="flex justify-center gap-3">
                      <a
                        href={`https://twitter.com/intent/tweet?text=I%20just%20became%20a%20founding%20member%20of%20Career%20Forward!%20Join%20me%20for%202%20free%20months%20of%20premium%3A%20${encodeURIComponent(referralLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-[#1da1f2] text-white rounded-xl font-medium hover:bg-[#1a8cd8] transition-all duration-300 shadow-lg shadow-[#1da1f2]/25"
                      >
                        Share on Twitter
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-[#0077b5] text-white rounded-xl font-medium hover:bg-[#006699] transition-all duration-300 shadow-lg shadow-[#0077b5]/25"
                      >
                        Share on LinkedIn
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FAQ Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900">{faq.question}</span>
                        <motion.div
                          animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {expandedFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <p className="px-5 pb-5 text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white/80 backdrop-blur py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Career Forward. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
