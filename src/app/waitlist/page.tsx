"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Briefcase,
  Mail,
  MessageCircle,
  Facebook,
  Linkedin,
} from "lucide-react";
import { US_REGIONS } from "@/lib/validations/waitlist";

// Seed names for social proof (will blend with real signups)
const SEED_SIGNUPS = [
  { name: "Jordan", region: "northwest", daysAgo: 0 },
  { name: "Taylor", region: "southwest", daysAgo: 0 },
  { name: "Morgan", region: "midwest", daysAgo: 1 },
  { name: "Casey", region: "northeast", daysAgo: 1 },
  { name: "Riley", region: "southeast", daysAgo: 2 },
  { name: "Alex", region: "south", daysAgo: 2 },
  { name: "Jamie", region: "mountain", daysAgo: 3 },
  { name: "Quinn", region: "northwest", daysAgo: 3 },
];

// Share link and text
const SHARE_URL = "https://careerforward.io/waitlist";
const SHARE_TEXT = "I've registered for Career Forward's beta waitlist. Learn about what Career Forward is doing today:";

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    region: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number>(SEED_SIGNUPS.length);
  const [displaySignups, setDisplaySignups] = useState<Array<{ name: string; region: string; timeAgo: string }>>([]);

  // Check if user is already registered (from localStorage)
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("careerforward_waitlist");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.registered && parsed.email) {
          // Check if registration was within last 30 days
          const registeredDate = new Date(parsed.timestamp);
          const daysSince = (Date.now() - registeredDate.getTime()) / (1000 * 60 * 60 * 24);

          if (daysSince < 30) {
            // User is already registered, populate form and show they're registered
            setFormData({
              firstName: parsed.firstName || "",
              lastName: "",
              email: parsed.email || "",
              region: "",
            });
            console.log("User already registered (from localStorage):", parsed.email);
          }
        }
      }
    } catch (err) {
      console.error("Error reading localStorage:", err);
    }

    // Dynamic visitor counter
    const storedCount = localStorage.getItem("waitlist_visitor_count");
    const initialCount = storedCount ? parseInt(storedCount, 10) : 11;
    const newCount = initialCount + 1;
    localStorage.setItem("waitlist_visitor_count", newCount.toString());
    setWaitlistCount(newCount);
  }, []);

  // Format time ago
  const formatTimeAgo = (daysAgo: number): string => {
    if (daysAgo === 0) return "today";
    if (daysAgo === 1) return "yesterday";
    return `${daysAgo}d ago`;
  };

  // Fetch waitlist count and merge with seed data
  useEffect(() => {
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => {
        // Merge real signups with seed data
        const realSignups = (data.recent || []).map((s: { name: string; region: string; joinedAt: string }) => ({
          name: s.name,
          region: s.region,
          timeAgo: getTimeAgo(new Date(s.joinedAt)),
        }));

        // Add seed signups if we need more
        const seedFormatted = SEED_SIGNUPS.map((s) => ({
          name: s.name,
          region: s.region,
          timeAgo: formatTimeAgo(s.daysAgo),
        }));

        // Combine: real first, then seed to fill
        const combined = [...realSignups];
        let seedIndex = 0;
        while (combined.length < 5 && seedIndex < seedFormatted.length) {
          // Only add seed if name doesn't already exist
          if (!combined.find((c) => c.name.toLowerCase() === seedFormatted[seedIndex].name.toLowerCase())) {
            combined.push(seedFormatted[seedIndex]);
          }
          seedIndex++;
        }

        setDisplaySignups(combined.slice(0, 5));
      })
      .catch(() => {
        // On error, show seed data
        setDisplaySignups(
          SEED_SIGNUPS.slice(0, 5).map((s) => ({
            name: s.name,
            region: s.region,
            timeAgo: formatTimeAgo(s.daysAgo),
          }))
        );
      });
  }, []);

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "yesterday";
    return `${days}d ago`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Save to localStorage as backup
        try {
          localStorage.setItem("careerforward_waitlist", JSON.stringify({
            registered: true,
            email: formData.email,
            firstName: formData.firstName,
            referralCode: data.referralCode,
            referralLink: data.referralLink,
            timestamp: new Date().toISOString(),
          }));
        } catch (storageError) {
          console.error("Failed to save to localStorage:", storageError);
        }
        setIsSuccess(true);
      } else {
        // Show specific error message from API
        const errorMessage = data.message || "Something went wrong. Please try again.";
        setError(errorMessage);
        console.error("Waitlist registration error:", data);
      }
    } catch (networkError) {
      console.error("Network error during waitlist registration:", networkError);
      setError("Network error. Please check your connection and try again. If this persists, contact support@martinbuiltstrategies.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = SHARE_URL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Share URLs for different platforms
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}&quote=${encodeURIComponent(SHARE_TEXT)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`,
    email: `mailto:?subject=${encodeURIComponent("Job hunting just got smarter")}&body=${encodeURIComponent(`${SHARE_TEXT}\n\n${SHARE_URL}`)}`,
    sms: `sms:?body=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`,
  };

  const benefits = [
    "2 months free premium access",
    "Exclusive founding member badge",
    "Shape the product roadmap",
    "Early access to new features",
  ];

  const regionNames: Record<string, string> = {
    northwest: "Northwest",
    southwest: "Southwest",
    midwest: "Midwest",
    northeast: "Northeast",
    southeast: "Southeast",
    south: "South",
    mountain: "Mountain",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/branding/logo.svg"
              alt="Career Forward"
              width={184}
              height={52}
              className="h-[46px] w-auto"
              priority
            />
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-600">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-28">
        {/* Hero Section */}
        <section className="min-h-[calc(100vh-112px)] flex items-center justify-center px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#7C5FF5]/10 rounded-full text-[#7C5FF5] text-sm font-medium mb-8"
                  >
                    <Sparkles className="w-4 h-4" />
                    Launching Soon
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#0F172A] tracking-tight mb-6"
                  >
                    Land your dream job
                    <br />
                    <span className="text-[#7C5FF5]">faster.</span>
                  </motion.h1>

                  {/* Subheadline */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
                  >
                    Track every application in one place. AI-powered resume scoring.
                    <br className="hidden md:block" />
                    Your complete job search command center.
                  </motion.p>

                  {/* Form */}
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="max-w-md mx-auto mb-8"
                  >
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="First name"
                          className="h-12 rounded-xl border-gray-200 focus:border-[#7C5FF5] focus:ring-[#7C5FF5]/20 text-gray-900 placeholder:text-gray-400"
                        />
                        <Input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Last name"
                          className="h-12 rounded-xl border-gray-200 focus:border-[#7C5FF5] focus:ring-[#7C5FF5]/20 text-gray-900 placeholder:text-gray-400"
                        />
                      </div>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="h-12 rounded-xl border-gray-200 focus:border-[#7C5FF5] focus:ring-[#7C5FF5]/20 text-gray-900 placeholder:text-gray-400"
                      />
                      <select
                        required
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7C5FF5]/20 focus:border-[#7C5FF5] [&>option]:text-gray-900"
                      >
                        <option value="" className="text-gray-400">Select your region</option>
                        {US_REGIONS.map((region) => (
                          <option key={region.value} value={region.value} className="text-gray-900">
                            {region.label}
                          </option>
                        ))}
                      </select>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {error}
                        </motion.div>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-[#7C5FF5] hover:bg-[#6B4FE4] text-white rounded-xl font-medium text-base shadow-lg shadow-[#7C5FF5]/30"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          <>
                            Get Early Access
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.form>

                  {/* Social Proof */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center gap-4"
                  >
                    {waitlistCount > 0 && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="flex -space-x-2">
                          {displaySignups.slice(0, 3).map((signup, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                            >
                              {signup.name.charAt(0).toUpperCase()}
                            </div>
                          ))}
                        </div>
                        <span className="text-sm">
                          <strong className="text-[#0F172A]">{waitlistCount.toLocaleString()}</strong> people already joined
                        </span>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ) : (
                /* Success State */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-lg mx-auto"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </motion.div>

                  <h2 className="text-3xl font-bold text-[#0F172A] mb-4">
                    You're officially registered!
                  </h2>

                  <div className="text-gray-600 mb-8 space-y-4">
                    <p>
                      Thank you for joining the Career Forward waitlist! We're working hard to build the ultimate job search platform.
                    </p>
                    <p>
                      <strong className="text-[#0F172A]">Our official launch is scheduled for Q2 2027</strong> (April-June). As we get closer to launch, we'll be selecting waitlist members for exclusive early access and beta testing opportunities.
                    </p>
                    <p>
                      Keep an eye on your inbox—you'll be among the first to know when Career Forward goes live.
                    </p>
                    <p className="text-sm">
                      Questions? Email us at{" "}
                      <a href="mailto:support@martinbuiltstrategies.com" className="text-[#7C5FF5] hover:underline">
                        support@martinbuiltstrategies.com
                      </a>
                    </p>
                  </div>

                  {/* Share Section */}
                  <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                    <p className="text-sm font-medium text-[#0F172A] mb-4">
                      Know someone who's job searching? Share the opportunity:
                    </p>

                    {/* Copy Link */}
                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="text"
                        readOnly
                        value={SHARE_URL}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700"
                      />
                      <Button
                        onClick={handleCopyLink}
                        className={`h-12 px-4 rounded-xl transition-colors ${
                          copied ? "bg-green-500 hover:bg-green-600" : "bg-[#7C5FF5] hover:bg-[#6B4FE4]"
                        }`}
                      >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </Button>
                    </div>

                    {/* Share Buttons Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {/* Twitter/X */}
                      <a
                        href={shareUrls.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        X
                      </a>

                      {/* LinkedIn */}
                      <a
                        href={shareUrls.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0077b5] text-white rounded-xl text-sm font-medium hover:bg-[#006699] transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>

                      {/* Facebook */}
                      <a
                        href={shareUrls.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1877f2] text-white rounded-xl text-sm font-medium hover:bg-[#166fe5] transition-colors"
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </a>

                      {/* WhatsApp */}
                      <a
                        href={shareUrls.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-xl text-sm font-medium hover:bg-[#20bd5a] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>

                      {/* Email */}
                      <a
                        href={shareUrls.email}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </a>

                      {/* SMS */}
                      <a
                        href={shareUrls.sms}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Text
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Benefits Section */}
        {!isSuccess && (
          <section className="py-20 px-6 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-[#0F172A] mb-3">
                  Founding member perks
                </h2>
                <p className="text-gray-600">
                  Join early and get exclusive benefits
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-gray-100"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#7C5FF5]/10 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-5 h-5 text-[#7C5FF5]" />
                    </div>
                    <p className="font-medium text-[#0F172A]">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Product Preview */}
        {!isSuccess && (
          <section className="py-20 px-6 bg-gradient-to-br from-[#F3E8FF] via-white to-[#E9D5FF]">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 bg-[#7C5FF5]/10 rounded-full px-4 py-2 mb-6">
                  <Sparkles className="w-4 h-4 text-[#7C5FF5]" />
                  <span className="text-sm font-semibold text-[#7C5FF5]">Everything You Need in One Place</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
                  Stop juggling spreadsheets.
                  <br />
                  <span className="text-[#7C5FF5]">Start landing offers.</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Career Forward brings everything together—resumes, applications, coaching, and insights—so you can focus on what matters: getting hired.
                </p>
              </motion.div>

              {/* Feature Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-[#7C5FF5]/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">100-Point Resume Scoring</h3>
                  <p className="text-gray-600">
                    Get instant feedback on your resume with our AI-powered scoring system. Know exactly what to improve before you apply.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-[#7C5FF5]/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">Smart Application Tracker</h3>
                  <p className="text-gray-600">
                    Never lose track of an application again. Stoplight status tracking (Green/Yellow/Red) keeps you organized and focused.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-[#7C5FF5]/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">AI Career Coach</h3>
                  <p className="text-gray-600">
                    Get personalized career guidance 24/7. From resume tips to interview prep, Compass has your back at every step.
                  </p>
                </motion.div>
              </div>

              {/* Platform Preview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] rounded-3xl p-1 shadow-2xl">
                  <div className="bg-white rounded-[22px] p-2">
                    <div className="bg-gradient-to-br from-[#0F172A] via-[#1F2937] to-[#0F172A] rounded-2xl overflow-hidden p-12">
                      <div className="text-center space-y-8">
                        {/* Browser Chrome */}
                        <div className="flex items-center justify-center gap-2 mb-8">
                          <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                          </div>
                          <div className="flex-1 text-center max-w-xs mx-auto bg-[#374151] rounded-lg px-4 py-2">
                            <span className="text-gray-400 text-sm font-medium">careerforward.io/dashboard</span>
                          </div>
                        </div>

                        {/* Dashboard Preview Content */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <div className="text-3xl mb-3">📊</div>
                            <div className="text-2xl font-bold text-white mb-1">47</div>
                            <div className="text-sm text-white/70">Applications</div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <div className="text-3xl mb-3">✅</div>
                            <div className="text-2xl font-bold text-green-400 mb-1">12</div>
                            <div className="text-sm text-white/70">Interviews</div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                            <div className="text-3xl mb-3">⭐</div>
                            <div className="text-2xl font-bold text-[#A78BFA] mb-1">89</div>
                            <div className="text-sm text-white/70">Resume Score</div>
                          </div>
                        </div>

                        {/* Feature Highlights */}
                        <div className="space-y-3">
                          <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="text-white text-left text-sm">ATS-optimized resume builder with real-time scoring</span>
                          </div>
                          <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="text-white text-left text-sm">AI career coach available 24/7 for guidance</span>
                          </div>
                          <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                            <span className="text-white text-left text-sm">Track every application with stoplight status system</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-[#7C5FF5] text-white rounded-full px-4 py-2 text-sm font-semibold shadow-lg">
                  Coming Q2 2027
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        {!isSuccess && (
          <section className="py-20 px-6 bg-gradient-to-br from-[#0F172A] via-[#1F2937] to-[#0F172A] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(124,95,245,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(167,139,250,0.15),transparent_50%)]" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-white">Launching Q2 2027</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Your dream job is waiting.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA]">
                    Don't miss early access.
                  </span>
                </h2>

                <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                  Join <strong className="text-white">{waitlistCount.toLocaleString()}+ founding members</strong> who are getting 2 months free premium, an exclusive badge, and first access to the platform that's changing how people find work.
                </p>

                {/* Benefits Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <div className="text-3xl mb-2">🎁</div>
                    <div className="text-sm font-medium text-white">2 Months Free</div>
                    <div className="text-xs text-white/60">Premium Access</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <div className="text-3xl mb-2">⭐</div>
                    <div className="text-sm font-medium text-white">Founding Member Badge</div>
                    <div className="text-xs text-white/60">Exclusive Recognition</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <div className="text-3xl mb-2">🚀</div>
                    <div className="text-sm font-medium text-white">Early Access</div>
                    <div className="text-xs text-white/60">Beta Testing Invite</div>
                  </div>
                </div>

                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  size="lg"
                  className="bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA] hover:from-[#6B4FE4] hover:to-[#9370ED] text-white h-14 px-10 rounded-full font-semibold text-lg shadow-2xl shadow-[#7C5FF5]/50 hover:scale-105 transition-all"
                >
                  Secure Your Spot Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <p className="text-sm text-white/50 mt-6">
                  No credit card required • Launch: April-June 2027
                </p>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
          <Link href="/">
            <Image
              src="/branding/logo.svg"
              alt="Career Forward"
              width={184}
              height={52}
              className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
            />
          </Link>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Career Forward. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
