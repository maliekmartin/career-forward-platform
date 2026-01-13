"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  FileText,
  Target,
  MessageSquare,
  Briefcase,
  Users,
  CheckCircle2,
  Sparkles,
  Star,
  Play,
  ChevronRight,
  Zap,
  Shield,
  TrendingUp,
  Award,
  Calendar,
  BarChart3,
  Clock,
  Building2,
  GraduationCap,
  LineChart,
  Bell,
  Layers,
  ClipboardCheck,
  PieChart,
} from "lucide-react";

// Stats for trust indicators
const seekerStats = [
  { value: "70%", label: "Avg Placement Rate" },
  { value: "3 wks", label: "Avg Time to Hire" },
  { value: "Free", label: "For Job Seekers" },
];

const orgStats = [
  { value: "25%", label: "Faster Placements" },
  { value: "60%", label: "Admin Time Saved" },
  { value: "85%", label: "Client Retention" },
];

// Social proof logos (placeholder names)
const partnerLogos = [
  "WorkSource",
  "Spokane Workforce",
  "Career Connect",
  "Employment Services",
  "Job Link",
];

// Animated section wrapper
function AnimatedSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Bento Feature Card - Large
function BentoCardLarge({ feature, index, audience }: { feature: typeof seekerFeatures[0]; index: number; audience: string }) {
  const accentColor = audience === "seekers" ? "#2B8A8A" : "#374151";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-gray-200 transition-all duration-300 cursor-pointer col-span-2 row-span-2"
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 h-full flex flex-col">
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-300"
          style={{ backgroundColor: `${accentColor}10` }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <feature.icon className="h-8 w-8" style={{ color: accentColor }} />
        </motion.div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#2B8A8A] transition-colors">
          {feature.title}
        </h3>

        <p className="text-gray-600 leading-relaxed text-lg flex-grow">
          {feature.description}
        </p>

        <div className="flex items-center text-sm font-semibold mt-8 opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ color: accentColor }}>
          <span>Learn more</span>
          <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

// Bento Feature Card - Small
function BentoCardSmall({ feature, index, audience }: { feature: typeof seekerFeatures[0]; index: number; audience: string }) {
  const accentColor = audience === "seekers" ? "#2B8A8A" : "#374151";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer"
    >
      <div className="relative z-10">
        <motion.div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300"
          style={{ backgroundColor: `${accentColor}10` }}
          whileHover={{ scale: 1.1 }}
        >
          <feature.icon className="h-6 w-6" style={{ color: accentColor }} />
        </motion.div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#2B8A8A] transition-colors">
          {feature.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

// Process step card
function ProcessStep({ step, index, isLast, audience }: { step: typeof seekerSteps[0]; index: number; isLast: boolean; audience: string }) {
  const accentColor = audience === "seekers" ? "#2B8A8A" : "#374151";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative"
    >
      {/* Connector line */}
      {!isLast && (
        <div
          className="hidden lg:block absolute top-8 left-[calc(100%)] w-full h-0.5 z-0"
          style={{ background: `linear-gradient(to right, ${accentColor}, ${accentColor}20)` }}
        />
      )}

      <div className="relative z-10 text-center">
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white font-bold text-xl mb-6 shadow-lg"
          style={{ backgroundColor: accentColor, boxShadow: `0 10px 30px ${accentColor}30` }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {step.number}
        </motion.div>

        <h3 className="text-xl font-bold text-gray-900 mb-3">
          {step.title}
        </h3>

        <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

// Testimonial card - Enhanced
function TestimonialCard({ testimonial, index, featured = false }: { testimonial: typeof seekerTestimonials[0]; index: number; featured?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className={`bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 ${
        featured ? "p-10" : "p-8"
      }`}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-6" role="img" aria-label="5 out of 5 stars">
        {[...Array(5)].map((_, i) => (
          <Star key={`star-${i}`} className="w-5 h-5 text-yellow-400 fill-yellow-400" aria-hidden="true" />
        ))}
      </div>

      <p className={`text-gray-700 leading-relaxed mb-8 ${featured ? "text-2xl font-medium" : "text-lg"}`}>
        "{testimonial.quote}"
      </p>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#2B8A8A] to-[#374151] flex items-center justify-center text-white font-bold text-lg">
          {testimonial.avatar}
        </div>
        <div>
          <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
          <div className="text-gray-500">{testimonial.role}</div>
        </div>
      </div>
    </motion.div>
  );
}

// Sticky CTA Component
function StickyCTA({ audience, isVisible }: { audience: string; isVisible: boolean }) {
  const accentColor = audience === "seekers" ? "#2B8A8A" : "#374151";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <Button
            size="lg"
            asChild
            className="rounded-full px-8 h-14 text-lg font-semibold shadow-2xl hover:scale-105 transition-all duration-300"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 20px 40px ${accentColor}40`
            }}
          >
            <Link href={audience === "seekers" ? "/register" : "/pricing"}>
              {audience === "seekers" ? "Get Started Free" : "View Pricing"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hero content for each audience
const heroContent = {
  seekers: {
    badge: "100% Free for Job Seekers",
    headline: "Land your dream job,",
    headlineAccent: "faster",
    subheadline: "Build resumes, track applications, and prep for interviews. All in one place. Completely free.",
    cta: "Start Your Journey",
    secondaryCta: "See Demo",
    ctaLink: "/register",
    secondaryCtaLink: "/dashboard",
  },
  organizations: {
    badge: "For Workforce Partners",
    headline: "Empower your team,",
    headlineAccent: "together",
    subheadline: "Give coaches real-time visibility into job seeker progress. Track outcomes, celebrate wins, and drive results.",
    cta: "Request a Demo",
    secondaryCta: "View Pricing",
    ctaLink: "mailto:hello@careerforward.io?subject=Demo%20Request",
    secondaryCtaLink: "/pricing",
  },
};

// B2C Features (Job Seekers)
const seekerFeatures = [
  {
    icon: FileText,
    title: "Resume Builder",
    description: "Create ATS-optimized resumes with our intuitive builder. Stand out with templates designed by HR professionals.",
    color: "#2B8A8A",
    highlight: "Most Popular",
  },
  {
    icon: Briefcase,
    title: "Job Tracker",
    description: "Never lose track of an application. Organize, follow up, and land more interviews with smart tracking.",
    color: "#374151",
  },
  {
    icon: MessageSquare,
    title: "Interview Prep",
    description: "Practice with industry-specific questions and video coaching. Walk into every interview confident.",
    color: "#2B8A8A",
  },
  {
    icon: Users,
    title: "Coach Connection",
    description: "Link with your career coach for real-time feedback, accountability, and personalized guidance.",
    color: "#374151",
  },
  {
    icon: Target,
    title: "Career Assessments",
    description: "Discover your strengths and find career paths that match your skills and interests.",
    color: "#2B8A8A",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Stay on track with automated follow-up reminders and application deadline alerts.",
    color: "#374151",
  },
];

// B2B Features (Organizations)
const orgFeatures = [
  {
    icon: Users,
    title: "Caseload Management",
    description: "Manage your entire caseload from one dashboard. See progress, engagement, and outcomes at a glance.",
    color: "#374151",
    highlight: "Core Feature",
  },
  {
    icon: TrendingUp,
    title: "Outcome Tracking",
    description: "Track job placements, interview rates, and success metrics. Generate reports for stakeholders and funders.",
    color: "#374151",
  },
  {
    icon: ClipboardCheck,
    title: "Exit Data & Reporting",
    description: "Capture exit wages, job titles, hours, and placement data. Generate comprehensive reports for funders.",
    color: "#374151",
  },
  {
    icon: Shield,
    title: "Privacy Controls",
    description: "Job seekers control what coaches can see. Build trust with transparent, consent-based data sharing.",
    color: "#374151",
  },
  {
    icon: MessageSquare,
    title: "In-App Messaging",
    description: "Communicate directly with job seekers. Full transparency protects coaches and documents interactions.",
    color: "#374151",
  },
  {
    icon: PieChart,
    title: "Measurable Skill Gains",
    description: "Track skill development and training completion. Document progress for WIOA reporting requirements.",
    color: "#374151",
  },
];

// B2C Process Steps
const seekerSteps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Sign up in 30 seconds. Tell us about your goals, skills, and experience.",
    icon: Target,
  },
  {
    number: "02",
    title: "Build Your Toolkit",
    description: "Create resumes, practice interviews, and explore career assessments.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Track & Apply",
    description: "Find opportunities, track applications, and stay organized.",
    icon: Briefcase,
  },
  {
    number: "04",
    title: "Land the Job",
    description: "Get coach feedback, ace interviews, and celebrate your success.",
    icon: Award,
  },
];

// B2B Process Steps
const orgSteps = [
  {
    number: "01",
    title: "Onboard Your Team",
    description: "Set up your organization and invite coaches to the platform.",
    icon: Users,
  },
  {
    number: "02",
    title: "Connect Job Seekers",
    description: "Job seekers link their accounts to share progress with their assigned coach.",
    icon: Target,
  },
  {
    number: "03",
    title: "Monitor Progress",
    description: "Track engagement, milestones, and identify job seekers who need support.",
    icon: TrendingUp,
  },
  {
    number: "04",
    title: "Celebrate Outcomes",
    description: "Track placements, generate reports, and showcase your impact.",
    icon: Award,
  },
];

// B2C Testimonials
const seekerTestimonials = [
  {
    quote: "Career Forward gave me the structure I needed. Within 6 weeks, I went from unemployed to starting my dream job.",
    name: "Marcus R.",
    role: "Project Coordinator",
    avatar: "M",
  },
  {
    quote: "The resume builder alone was worth it. My coach helped me highlight skills I didn't even know I had.",
    name: "Elena K.",
    role: "Registered Nurse",
    avatar: "E",
  },
  {
    quote: "As a recent graduate, I had no idea where to start. Career Forward made the whole process less overwhelming.",
    name: "David T.",
    role: "IT Specialist",
    avatar: "D",
  },
];

// B2B Testimonials
const orgTestimonials = [
  {
    quote: "We've seen a 40% increase in job placements since adopting Career Forward. The visibility into job seeker progress is a game changer.",
    name: "Sarah M.",
    role: "Workforce Development Director",
    avatar: "S",
  },
  {
    quote: "My coaches love it. They can finally see what job seekers are working on between sessions and provide better support.",
    name: "James L.",
    role: "Program Manager",
    avatar: "J",
  },
  {
    quote: "The reporting features make it easy to show funders our impact. Career Forward has become essential to our operations.",
    name: "Michelle T.",
    role: "Executive Director",
    avatar: "M",
  },
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [audience, setAudience] = useState<"seekers" | "organizations">("seekers");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const accentColor = audience === "seekers" ? "#2B8A8A" : "#374151";

  return (
    <div className="min-h-screen bg-[#FAFBFC] scroll-smooth">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/career-forward-logo.png"
              alt="Career Forward"
              width={200}
              height={50}
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-[#2B8A8A] transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-[#2B8A8A] transition-colors font-medium">
              How It Works
            </a>
            <a href="#testimonials" className="text-sm text-gray-600 hover:text-[#2B8A8A] transition-colors font-medium">
              Stories
            </a>
            {audience === "organizations" && (
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-[#2B8A8A] transition-colors font-medium">
                Pricing
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-[#2B8A8A] font-medium">
              <Link href={`/signin?type=${audience === "seekers" ? "seeker" : "coach"}`}>
                Sign In
              </Link>
            </Button>
            <Button size="sm" asChild className="bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-full px-6 font-medium shadow-lg shadow-[#2B8A8A]/25 hover:shadow-xl hover:shadow-[#2B8A8A]/30 transition-all">
              <Link href="/register">
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Enhanced */}
      <section ref={heroRef} className="relative pt-32 pb-32 px-6 overflow-hidden min-h-screen flex items-center bg-[#FAFBFC]">
        {/* Gradient Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: accentColor }}
          />
          <div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10"
            style={{ backgroundColor: accentColor }}
          />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="max-w-7xl mx-auto relative z-10 w-full"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Side - Content */}
            <div className="text-center lg:text-left">
              {/* Premium Audience Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex items-center justify-center lg:justify-start mb-8"
              >
              <div className="relative bg-white rounded-2xl p-1.5 shadow-xl shadow-gray-200/50 border border-gray-100">
                {/* Animated sliding background */}
                <motion.div
                  className="absolute top-1.5 bottom-1.5 rounded-xl"
                  initial={false}
                  animate={{
                    x: audience === "seekers" ? 0 : "100%",
                    backgroundColor: accentColor,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  style={{ width: "calc(50% - 3px)", left: "6px" }}
                />

                <div className="relative flex">
                  {/* Job Seeker Option */}
                  <button
                    onClick={() => setAudience("seekers")}
                    className="relative z-10 group"
                    role="tab"
                    aria-selected={audience === "seekers"}
                  >
                    <div className="flex items-center gap-3 px-6 py-4">
                      <Target className={`w-5 h-5 transition-colors duration-300 ${
                        audience === "seekers" ? "text-white" : "text-gray-400"
                      }`} />
                      <div className="text-left">
                        <p className={`font-bold transition-colors duration-300 ${
                          audience === "seekers" ? "text-white" : "text-gray-700"
                        }`}>
                          Job Seeker
                        </p>
                        <p className={`text-xs font-medium transition-colors duration-300 ${
                          audience === "seekers" ? "text-white/80" : "text-gray-400"
                        }`}>
                          Free Forever
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="w-px bg-gray-200 my-3" />

                  {/* Organization Option */}
                  <button
                    onClick={() => setAudience("organizations")}
                    className="relative z-10 group"
                    role="tab"
                    aria-selected={audience === "organizations"}
                  >
                    <div className="flex items-center gap-3 px-6 py-4">
                      <Building2 className={`w-5 h-5 transition-colors duration-300 ${
                        audience === "organizations" ? "text-white" : "text-gray-400"
                      }`} />
                      <div className="text-left">
                        <p className={`font-bold transition-colors duration-300 ${
                          audience === "organizations" ? "text-white" : "text-gray-700"
                        }`}>
                          Organization
                        </p>
                        <p className={`text-xs font-medium transition-colors duration-300 ${
                          audience === "organizations" ? "text-white/80" : "text-gray-400"
                        }`}>
                          Workforce Partner
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-gray-900">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={audience}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {heroContent[audience].headline}
                  </motion.span>
                </AnimatePresence>
                <br />
                <span className="relative inline-block" style={{ color: accentColor }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`accent-${audience}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {heroContent[audience].headlineAccent}
                    </motion.span>
                  </AnimatePresence>
                  <motion.svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <motion.path
                      d="M2 8 Q 100 2 198 8"
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              key={`subheadline-${audience}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl md:text-2xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 text-gray-600"
            >
              {heroContent[audience].subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              key={`ctas-${audience}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
            >
              {heroContent[audience].ctaLink.startsWith("mailto:") ? (
                <a href={heroContent[audience].ctaLink}>
                  <Button
                    size="lg"
                    className="rounded-full px-10 h-16 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    style={{
                      backgroundColor: accentColor,
                      boxShadow: `0 20px 40px ${accentColor}30`
                    }}
                  >
                    {heroContent[audience].cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              ) : (
                <Button
                  size="lg"
                  asChild
                  className="rounded-full px-10 h-16 text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 20px 40px ${accentColor}30`
                  }}
                >
                  <Link href={heroContent[audience].ctaLink}>
                    {heroContent[audience].cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-full px-10 h-16 text-lg font-medium border-2 hover:scale-105 transition-all duration-300"
                style={{
                  borderColor: accentColor,
                  color: accentColor
                }}
              >
                <Link href={heroContent[audience].secondaryCtaLink}>
                  <Play className="mr-2 h-5 w-5" />
                  {heroContent[audience].secondaryCta}
                </Link>
              </Button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              key={`stats-${audience}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex items-center justify-center lg:justify-start gap-8 md:gap-12"
            >
              {(audience === "seekers" ? seekerStats : orgStats).map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>

              {/* App Store Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center justify-center lg:justify-start gap-3 mt-8"
              >
                <span className="text-xs text-gray-400 uppercase tracking-wide">Coming Soon</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-black/60 text-white/80 px-4 py-2 rounded-lg cursor-not-allowed"
                    aria-label="App Store - Coming Soon"
                    disabled
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] leading-none opacity-80">Download on the</div>
                      <div className="text-sm font-semibold leading-tight">App Store</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-black/60 text-white/80 px-4 py-2 rounded-lg cursor-not-allowed"
                    aria-label="Google Play - Coming Soon"
                    disabled
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" role="img" aria-hidden="true">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-[10px] leading-none opacity-80">GET IT ON</div>
                      <div className="text-sm font-semibold leading-tight">Google Play</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Floating Video in Device Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="hidden lg:block lg:scale-105 xl:scale-110 origin-center"
            >
              <div className="relative">
                {/* Laptop Mockup */}
                <div
                  className="relative"
                  style={{ filter: `drop-shadow(0 25px 50px ${accentColor}25)` }}
                >
                  {/* Screen bezel */}
                  <div className="bg-gray-800 rounded-t-xl p-2 pb-0">
                    {/* Camera and top bar */}
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-2 h-2 rounded-full bg-gray-600" />
                    </div>
                    {/* Screen */}
                    <div className="bg-white rounded-t-lg overflow-hidden">
                      {/* Browser chrome */}
                      <div className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-b border-gray-200">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="flex-1 mx-2">
                          <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200 truncate">
                            careerforward.io
                          </div>
                        </div>
                      </div>
                      {/* Video content */}
                      <AnimatePresence mode="wait">
                        <motion.video
                          key={audience}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-auto aspect-video object-cover"
                        >
                          <source src={audience === "seekers" ? "/hero-b2c.mp4" : "/hero-b2b.mp4"} type="video/mp4" />
                        </motion.video>
                      </AnimatePresence>
                    </div>
                  </div>
                  {/* Laptop base */}
                  <div className="bg-gray-700 h-4 rounded-b-lg mx-auto" style={{ width: '110%', marginLeft: '-5%' }}>
                    <div className="bg-gray-600 h-1 w-16 mx-auto rounded-b" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Social Proof Section - NEW */}
      <section className="py-16 px-6 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-500 font-medium mb-1">
                {audience === "seekers" ? "Trusted by workforce programs" : "Powering workforce development"}
              </p>
              <p className="text-gray-400 text-sm">across Washington State</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {partnerLogos.map((logo, index) => (
                <motion.div
                  key={logo}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-gray-400 font-semibold text-sm hover:text-gray-600 transition-colors cursor-default"
                >
                  {logo}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="py-32 px-6 bg-[#FAFBFC]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 mb-8"
              style={{ backgroundColor: `${accentColor}10` }}
            >
              <Zap className="h-4 w-4" style={{ color: accentColor }} />
              <span className="text-sm font-semibold" style={{ color: accentColor }}>
                {audience === "seekers" ? "Powerful Features" : "Platform Capabilities"}
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {audience === "seekers"
                ? "Everything you need to succeed"
                : "Tools to drive outcomes"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {audience === "seekers"
                ? "A complete career toolkit designed with coaches and HR professionals to help you land your next role."
                : "Equip your team with the visibility and tools they need to support job seekers effectively."}
            </p>
          </AnimatedSection>

          {/* Bento Grid Layout - Reimagined */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
            {/* Row 1: Featured Card + Stats Card */}
            {/* Featured Card - Primary Feature */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer lg:col-span-7 lg:row-span-2"
            >
              {/* Highlight badge */}
              {(audience === "seekers" ? seekerFeatures : orgFeatures)[0].highlight && (
                <div
                  className="absolute top-6 right-6 text-xs font-bold px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {(audience === "seekers" ? seekerFeatures : orgFeatures)[0].highlight}
                </div>
              )}

              <div className="h-full flex flex-col">
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${accentColor}15` }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {(() => {
                    const Icon = (audience === "seekers" ? seekerFeatures : orgFeatures)[0].icon;
                    return <Icon className="h-8 w-8" style={{ color: accentColor }} />;
                  })()}
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#2B8A8A] transition-colors">
                  {(audience === "seekers" ? seekerFeatures : orgFeatures)[0].title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-lg mb-6 flex-grow">
                  {(audience === "seekers" ? seekerFeatures : orgFeatures)[0].description}
                </p>

                {/* Feature highlights */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  {audience === "seekers" ? (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-[#2B8A8A]" />
                        <span>ATS-Optimized</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-[#2B8A8A]" />
                        <span>Pro Templates</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-[#2B8A8A]" />
                        <span>Easy Export</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-[#2B8A8A]" />
                        <span>Multiple Versions</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-[#374151]" />
                        <span>Real-time Updates</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-[#374151]" />
                        <span>Bulk Actions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-[#374151]" />
                        <span>Smart Filters</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 text-[#374151]" />
                        <span>Quick Notes</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-3xl p-8 lg:col-span-5 overflow-hidden relative"
              style={{ backgroundColor: accentColor }}
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-6">
                  {audience === "seekers" ? "Built for Success" : "Proven Results"}
                </h3>
                <div className="space-y-5">
                  {audience === "seekers" ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Job seekers helped</span>
                        <span className="text-2xl font-bold text-white">2,500+</span>
                      </div>
                      <div className="h-px bg-white/20" />
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Average time to hire</span>
                        <span className="text-2xl font-bold text-white">6 weeks</span>
                      </div>
                      <div className="h-px bg-white/20" />
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Success rate</span>
                        <span className="text-2xl font-bold text-white">89%</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Placement increase</span>
                        <span className="text-2xl font-bold text-white">40%</span>
                      </div>
                      <div className="h-px bg-white/20" />
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Time saved per coach</span>
                        <span className="text-2xl font-bold text-white">8 hrs/wk</span>
                      </div>
                      <div className="h-px bg-white/20" />
                      <div className="flex items-center justify-between">
                        <span className="text-white/80">Coach satisfaction</span>
                        <span className="text-2xl font-bold text-white">96%</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {/* Decorative circles */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -right-5 top-0 w-20 h-20 rounded-full bg-white/5" />
            </motion.div>

            {/* Row 2: 3 Feature Cards */}
            {[1, 2, 3].map((index) => {
              const feature = (audience === "seekers" ? seekerFeatures : orgFeatures)[index];
              return (
                <motion.div
                  key={`feature-${audience}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer lg:col-span-4"
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${accentColor}10` }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <feature.icon className="h-6 w-6" style={{ color: accentColor }} />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#2B8A8A] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Row 3: 2 More Features + LMS Coming Soon */}
            {[4, 5].map((index) => {
              const feature = (audience === "seekers" ? seekerFeatures : orgFeatures)[index];
              return (
                <motion.div
                  key={`feature-${audience}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + (index - 4) * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer lg:col-span-4"
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${accentColor}10` }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <feature.icon className="h-6 w-6" style={{ color: accentColor }} />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#2B8A8A] transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* LMS Coming Soon Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative rounded-2xl p-6 lg:col-span-4 overflow-hidden border-2 border-dashed"
              style={{ borderColor: `${accentColor}40`, backgroundColor: `${accentColor}05` }}
            >
              {/* Coming Soon Badge - inline */}
              <div className="flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
                <Sparkles className="h-3 w-3" />
                Coming Soon
              </div>

              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${accentColor}15` }}
                >
                  <GraduationCap className="h-6 w-6" style={{ color: accentColor }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Learning Management System
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {audience === "seekers"
                      ? "Access training courses, certifications, and skill-building resources all in one place."
                      : "Assign training modules, track completion, and measure skill gains for WIOA compliance."}
                  </p>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: `${accentColor}20` }}>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500">Development Progress</span>
                  <span className="font-semibold" style={{ color: accentColor }}>75%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: accentColor }}
                    initial={{ width: 0 }}
                    whileInView={{ width: "75%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section className="py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 mb-8"
              style={{ backgroundColor: `${accentColor}10` }}
            >
              <BarChart3 className="h-4 w-4" style={{ color: accentColor }} />
              <span className="text-sm font-semibold" style={{ color: accentColor }}>
                See it in action
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {audience === "seekers"
                ? "Your personalized dashboard"
                : "Powerful coach dashboard"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {audience === "seekers"
                ? "Track your progress, manage applications, and stay organized with a dashboard built for job seekers."
                : "Get real-time visibility into your caseload with tools designed for workforce professionals."}
            </p>
          </AnimatedSection>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
              {/* Browser chrome */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white rounded-lg px-6 py-2 text-sm text-gray-400 border border-gray-200 flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5" />
                    careerforward.io/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="aspect-[16/9] bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {audience === "seekers" ? (
                    <motion.div
                      key="seeker-dashboard"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid md:grid-cols-3 gap-6 h-full"
                    >
                      {/* Progress Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-4">Your Progress</h4>
                        <div className="space-y-4">
                          {[
                            { label: "Profile", value: 100 },
                            { label: "Resume", value: 85 },
                            { label: "Applications", value: 60 },
                          ].map((item, i) => (
                            <div key={i}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">{item.label}</span>
                                <span className="font-medium" style={{ color: accentColor }}>{item.value}%</span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: accentColor }}
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${item.value}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 1, delay: i * 0.2 }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Applications Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-4">Recent Applications</h4>
                        <div className="space-y-3">
                          {[
                            { company: "Tech Co", status: "Interview" },
                            { company: "Design Inc", status: "Applied" },
                            { company: "StartupXYZ", status: "Review" },
                          ].map((app, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium text-gray-900">{app.company}</span>
                              <span className="text-xs px-2 py-1 rounded-full bg-[#2B8A8A]/10 text-[#2B8A8A] font-medium">
                                {app.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Actions Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
                        <div className="space-y-3">
                          {[
                            { icon: FileText, label: "Update Resume" },
                            { icon: Briefcase, label: "Track Application" },
                            { icon: MessageSquare, label: "Interview Prep" },
                          ].map((action, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                              <action.icon className="h-5 w-5" style={{ color: accentColor }} />
                              <span className="text-sm font-medium text-gray-700">{action.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="org-dashboard"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid md:grid-cols-3 gap-6 h-full"
                    >
                      {/* Stats Overview */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-4">Overview</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { value: "24", label: "Active" },
                            { value: "8", label: "Placed" },
                            { value: "89%", label: "Rate" },
                            { value: "12", label: "Interviews" },
                          ].map((stat, i) => (
                            <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold" style={{ color: accentColor }}>{stat.value}</div>
                              <div className="text-xs text-gray-500">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Caseload */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-4">Active Caseload</h4>
                        <div className="space-y-3">
                          {[
                            { name: "Marcus R.", milestone: "Interview" },
                            { name: "Aisha P.", milestone: "Resume" },
                            { name: "Diana O.", milestone: "Offer" },
                          ].map((person, i) => (
                            <div key={i} className="flex items-center gap-3 p-2">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#374151] to-[#1F2937] flex items-center justify-center text-white text-xs font-medium">
                                {person.name[0]}
                              </div>
                              <span className="text-sm font-medium text-gray-900 flex-1">{person.name}</span>
                              <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                                {person.milestone}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Today's Schedule */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          Today
                        </h4>
                        <div className="space-y-3">
                          {[
                            { time: "9:00 AM", type: "Check-in" },
                            { time: "11:00 AM", type: "Resume Review" },
                            { time: "2:00 PM", type: "Interview Prep" },
                          ].map((meeting, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <span className="text-xs text-gray-500 font-medium w-16">{meeting.time}</span>
                              <span className="text-sm text-gray-700">{meeting.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Floating notification cards */}
            <motion.div
              className="absolute -left-4 md:left-8 top-1/3 bg-white rounded-xl p-4 shadow-xl border border-gray-100 hidden md:block"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Task Complete</div>
                  <div className="text-xs text-gray-500">Just now</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-4 md:right-8 top-1/2 bg-white rounded-xl p-4 shadow-xl border border-gray-100 hidden md:block"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accentColor}10` }}>
                  <TrendingUp className="h-5 w-5" style={{ color: accentColor }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">+3 Applications</div>
                  <div className="text-xs text-gray-500">This week</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section - Enhanced */}
      <section id="how-it-works" className="py-32 px-6 bg-[#FAFBFC]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-20">
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 mb-8"
              style={{ backgroundColor: `${accentColor}10` }}
            >
              <Target className="h-4 w-4" style={{ color: accentColor }} />
              <span className="text-sm font-semibold" style={{ color: accentColor }}>
                {audience === "seekers" ? "Simple Process" : "Easy Setup"}
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {audience === "seekers"
                ? "Your path to employment"
                : "Get started in minutes"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {audience === "seekers"
                ? "Four simple steps to go from job seeker to employed. We guide you every step of the way."
                : "Onboard your organization quickly and start seeing results from day one."}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {(audience === "seekers" ? seekerSteps : orgSteps).map((step, index) => (
              <ProcessStep
                key={`${audience}-step-${index}`}
                step={step}
                index={index}
                isLast={index === (audience === "seekers" ? seekerSteps : orgSteps).length - 1}
                audience={audience}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced */}
      <section id="testimonials" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-yellow-100 rounded-full px-5 py-2.5 mb-8">
              <Star className="h-4 w-4 text-yellow-600 fill-yellow-600" />
              <span className="text-sm font-semibold text-yellow-700">
                {audience === "seekers" ? "Success Stories" : "Partner Testimonials"}
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {audience === "seekers"
                ? "Real people, real results"
                : "Trusted by leading organizations"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {audience === "seekers"
                ? "Join thousands who've transformed their careers with Career Forward."
                : "See how workforce development organizations are driving better outcomes."}
            </p>
          </AnimatedSection>

          {/* Featured testimonial + 2 smaller */}
          <div className="grid lg:grid-cols-2 gap-8">
            <TestimonialCard
              testimonial={(audience === "seekers" ? seekerTestimonials : orgTestimonials)[0]}
              index={0}
              featured
            />
            <div className="grid gap-8">
              {(audience === "seekers" ? seekerTestimonials : orgTestimonials).slice(1).map((testimonial, index) => (
                <TestimonialCard
                  key={`${audience}-testimonial-${index + 1}`}
                  testimonial={testimonial}
                  index={index + 1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audience-Specific Section */}
      <section id="partners" className="py-32 px-6 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <AnimatedSection>
              {audience === "seekers" ? (
                <>
                  <div className="inline-flex items-center gap-2 bg-[#2B8A8A]/10 rounded-full px-5 py-2.5 mb-8">
                    <Users className="h-4 w-4 text-[#2B8A8A]" />
                    <span className="text-sm font-semibold text-[#2B8A8A]">Expert Guidance</span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                    Connect with a career coach
                  </h2>
                  <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                    Working with a workforce organization? Link your account to share your progress with your coach. Get personalized feedback, stay accountable, and celebrate wins together.
                  </p>

                  <ul className="space-y-5 mb-10">
                    {[
                      "Share your progress with your assigned coach",
                      "Get real-time feedback on resumes and applications",
                      "Stay accountable with milestone tracking",
                      "You control what your coach can see",
                    ].map((item, index) => (
                      <motion.li
                        key={`seeker-feature-${index}`}
                        className="flex items-start gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle2 className="h-6 w-6 text-[#2B8A8A] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-lg">{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    asChild
                    className="bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-full px-10 h-14 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link href="/register">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 bg-[#374151]/10 rounded-full px-5 py-2.5 mb-8">
                    <Users className="h-4 w-4 text-[#374151]" />
                    <span className="text-sm font-semibold text-[#374151]">For Workforce Partners</span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                    Empower your coaches with better tools
                  </h2>
                  <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                    Give your team real-time visibility into job seeker progress. When job seekers opt in, coaches can track journeys, provide feedback, and celebrate wins together.
                  </p>

                  <ul className="space-y-5 mb-10">
                    {[
                      "Manage caseloads and track job seeker progress",
                      "Preview job seekers' saved resumes and cover letters",
                      "View achievements and milestones",
                      "Privacy-first: job seekers control visibility",
                    ].map((item, index) => (
                      <motion.li
                        key={`org-feature-${index}`}
                        className="flex items-start gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle2 className="h-6 w-6 text-[#374151] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-lg">{item}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    asChild
                    className="bg-[#374151] hover:bg-[#1F2937] text-white rounded-full px-10 h-14 font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link href="/pricing">
                      View Pricing
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </>
              )}
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="relative">
              <motion.div
                className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {audience === "seekers" ? (
                  <>
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                      <h3 className="font-bold text-gray-900 text-xl">Your Progress</h3>
                      <span className="text-sm bg-[#2B8A8A]/10 text-[#2B8A8A] px-4 py-1.5 rounded-full font-semibold">
                        Shared with Coach
                      </span>
                    </div>

                    <div className="p-8 space-y-6">
                      {[
                        { label: "Profile Complete", progress: 100, icon: CheckCircle2 },
                        { label: "Resume Built", progress: 85, icon: FileText },
                        { label: "Applications Sent", progress: 60, icon: Briefcase },
                        { label: "Interview Prep", progress: 40, icon: MessageSquare },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <item.icon className="h-5 w-5 text-[#2B8A8A]" />
                              <span className="font-medium text-gray-900">{item.label}</span>
                            </div>
                            <span className="text-sm text-[#2B8A8A] font-semibold">{item.progress}%</span>
                          </div>
                          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-[#2B8A8A] rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.progress}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                              viewport={{ once: true }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2B8A8A] to-[#374151] flex items-center justify-center text-white font-bold">
                          JD
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Jane Davis, Coach</p>
                          <p className="text-sm text-gray-500">Viewing your progress</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-100">
                      {[
                        { value: "12", label: "Job Seekers", color: "text-[#2B8A8A]" },
                        { value: "3", label: "Placements", color: "text-emerald-600" },
                        { value: "5", label: "Tasks Due", color: "text-purple-600" },
                      ].map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="text-center p-4 rounded-xl bg-gray-50"
                        >
                          <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                          <div className="text-sm text-gray-500">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Caseload Preview */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900">Active Caseload</h4>
                        <span className="text-sm text-[#2B8A8A] font-medium cursor-pointer hover:underline">View All</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          { name: "Marcus R.", milestone: "Interview Set", milestoneColor: "bg-orange-100 text-orange-700", avatar: "M", online: true },
                          { name: "Aisha P.", milestone: "Resume Ready", milestoneColor: "bg-purple-100 text-purple-700", avatar: "A", online: true },
                          { name: "Diana O.", milestone: "Offer Received", milestoneColor: "bg-emerald-100 text-emerald-700", avatar: "D", online: false },
                        ].map((person, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#374151] to-[#1F2937] flex items-center justify-center text-white font-medium">
                                {person.avatar}
                              </div>
                              {person.online && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-gray-900">{person.name}</span>
                            </div>
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${person.milestoneColor}`}>
                              {person.milestone}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#374151]" />
                          Today
                        </h4>
                        <span className="text-sm text-gray-500">3 meetings</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { time: "9:00 AM", name: "Marcus R.", type: "Check-in", color: "border-l-[#2B8A8A]" },
                          { time: "11:00 AM", name: "Aisha P.", type: "Resume Review", color: "border-l-purple-500" },
                          { time: "2:00 PM", name: "Diana O.", type: "Offer Discussion", color: "border-l-emerald-500" },
                        ].map((meeting, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            viewport={{ once: true }}
                            className={`flex items-center gap-4 p-3 bg-white rounded-lg border-l-4 ${meeting.color}`}
                          >
                            <span className="text-sm text-gray-500 font-medium w-20">{meeting.time}</span>
                            <span className="text-sm text-gray-900 font-medium">{meeting.name}</span>
                            <span className="text-sm text-gray-400 ml-auto">{meeting.type}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>

              {/* Decorative background */}
              <div
                className="absolute -z-10 top-6 -right-6 w-full h-full rounded-3xl"
                style={{ backgroundColor: `${accentColor}10` }}
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-32 px-6" style={{ backgroundColor: accentColor }}>
        <div className="max-w-5xl mx-auto text-center">
          <AnimatedSection>
            <motion.div
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
            >
              {audience === "seekers" ? (
                <>
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                    Ready to land your<br />dream job?
                  </h2>
                  <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Join thousands of job seekers who've transformed their careers with Career Forward. Start free today.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                      size="lg"
                      asChild
                      className="bg-white text-[#2B8A8A] hover:bg-gray-100 rounded-full px-12 h-16 text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <Link href="/register">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="rounded-full px-12 h-16 text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all bg-transparent"
                    >
                      <Link href="/dashboard">
                        Try Demo
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                    Ready to transform<br />your program?
                  </h2>
                  <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Join workforce organizations that are driving better outcomes with Career Forward.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                      size="lg"
                      asChild
                      className="bg-white text-[#374151] hover:bg-gray-100 rounded-full px-12 h-16 text-lg font-bold shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <a href="mailto:hello@careerforward.io?subject=Demo%20Request">
                        Request a Demo
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      asChild
                      className="rounded-full px-12 h-16 text-lg font-semibold border-2 border-white/30 text-white hover:bg-white/10 transition-all bg-transparent"
                    >
                      <Link href="/pricing">
                        View Pricing
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer - Cleaner */}
      <footer className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1">
              <Image
                src="/career-forward-logo.png"
                alt="Career Forward"
                width={180}
                height={45}
                className="mb-6"
              />
              <p className="text-gray-500 leading-relaxed">
                A workforce development initiative helping job seekers succeed.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-5">Product</h4>
              <ul className="space-y-4 text-gray-500">
                <li><Link href="/register" className="hover:text-[#2B8A8A] transition-colors">Get Started</Link></li>
                <li><Link href="/signin" className="hover:text-[#2B8A8A] transition-colors">Sign In</Link></li>
                <li><a href="#features" className="hover:text-[#2B8A8A] transition-colors">Features</a></li>
                <li><Link href="/pricing" className="hover:text-[#2B8A8A] transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-5">Resources</h4>
              <ul className="space-y-4 text-gray-500">
                <li><a href="https://worksourcewa.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#2B8A8A] transition-colors">WorkSource Washington</a></li>
                <li><a href="https://spokaneworkforce.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#2B8A8A] transition-colors">Spokane Workforce Council</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-5">Legal</h4>
              <ul className="space-y-4 text-gray-500">
                <li><Link href="/privacy" className="hover:text-[#2B8A8A] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#2B8A8A] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Career Forward. All Rights Reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-400">
              <CheckCircle2 className="h-4 w-4 text-[#2B8A8A]" />
              <span>A MartinBuiltStrategies Product</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky CTA */}
      <StickyCTA audience={audience} isVisible={showStickyCTA} />
    </div>
  );
}
