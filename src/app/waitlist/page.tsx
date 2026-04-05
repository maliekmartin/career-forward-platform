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
        setWaitlistCount(Math.max(data.count || 0, SEED_SIGNUPS.length) + (data.count || 0));
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
        setIsSuccess(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
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
              src="/career-forward-logo.png"
              alt="Career Forward"
              width={360}
              height={80}
              className="h-16 w-auto"
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#F59E0B]/10 rounded-full text-[#F59E0B] text-sm font-medium mb-8"
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
                    <span className="text-[#F59E0B]">faster.</span>
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
                          className="h-12 rounded-xl border-gray-200 focus:border-[#0D9488] focus:ring-[#0D9488]/20"
                        />
                        <Input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Last name"
                          className="h-12 rounded-xl border-gray-200 focus:border-[#0D9488] focus:ring-[#0D9488]/20"
                        />
                      </div>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="h-12 rounded-xl border-gray-200 focus:border-[#0D9488] focus:ring-[#0D9488]/20"
                      />
                      <select
                        required
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488]"
                      >
                        <option value="">Select your region</option>
                        {US_REGIONS.map((region) => (
                          <option key={region.value} value={region.value}>
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
                        className="w-full h-12 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl font-medium text-base transition-all duration-200 shadow-lg shadow-[#F59E0B]/25"
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
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0F172A] to-[#0D9488] border-2 border-white flex items-center justify-center text-white text-xs font-medium"
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
                      Thank you for joining the Career Forward waitlist. Please keep an eye on your email over the next one to two months, as you may be selected to participate in the Career Forward beta test.
                    </p>
                    <p>
                      We look forward to formally launching in early to mid-2027.
                    </p>
                    <p className="text-sm">
                      If you have any questions, please email{" "}
                      <a href="mailto:support@martinbuiltstrategies.com" className="text-[#0D9488] hover:underline">
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
                          copied ? "bg-green-500 hover:bg-green-600" : "bg-[#F59E0B] hover:bg-[#D97706]"
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
                    <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-5 h-5 text-[#F59E0B]" />
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
          <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-[#0F172A] mb-3">
                  Your job search, simplified
                </h2>
                <p className="text-gray-600">
                  One dashboard to track every application
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-[#0F172A] rounded-2xl p-2 shadow-2xl">
                  <div className="flex items-center gap-2 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-gray-400 text-sm">careerforward.io</span>
                    </div>
                  </div>
                  <div className="rounded-xl overflow-hidden">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full"
                    >
                      <source src="/hero-b2c.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>

                {/* Stats Below Video */}
                <div className="flex justify-center gap-4 mt-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl px-5 py-4 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0D9488] flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#0F172A]">2,847</p>
                        <p className="text-xs text-gray-500">Jobs Tracked</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl px-5 py-4 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-[#0F172A]">94%</p>
                        <p className="text-xs text-gray-500">Success Rate</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        {!isSuccess && (
          <section className="py-20 px-6 bg-[#020617]">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to transform your job search?
                </h2>
                <p className="text-white/70 mb-8">
                  Join the waitlist and be the first to know when we launch.
                </p>
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="bg-[#F59E0B] text-white hover:bg-[#D97706] h-12 px-8 rounded-xl font-medium shadow-lg shadow-[#F59E0B]/25"
                >
                  Join the Waitlist
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
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
              src="/career-forward-logo.png"
              alt="Career Forward"
              width={600}
              height={140}
              className="h-28 w-auto opacity-70 hover:opacity-100 transition-opacity"
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
