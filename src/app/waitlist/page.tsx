"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
  Users,
  AlertCircle,
  Briefcase,
  ChevronDown,
  Star,
} from "lucide-react";
import { US_REGIONS } from "@/lib/validations/waitlist";

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
  const [alreadyExists, setAlreadyExists] = useState(false);

  // Fetch waitlist count on mount
  useEffect(() => {
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => setWaitlistCount(data.count))
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

  const benefits = [
    "2 months free premium access",
    "Exclusive founding member badge",
    "Shape the product roadmap",
    "Early access to new features",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[#2B8A8A] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">Career Forward</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-600">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section - Centered, Minimal */}
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-16">
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
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#2B8A8A]/10 rounded-full text-[#2B8A8A] text-sm font-medium mb-8"
                  >
                    <Sparkles className="w-4 h-4" />
                    Launching Soon
                  </motion.div>

                  {/* Headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-6"
                  >
                    Land your dream job
                    <br />
                    <span className="text-[#2B8A8A]">faster.</span>
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
                          className="h-12 rounded-xl border-gray-200 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]/20"
                        />
                        <Input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Last name"
                          className="h-12 rounded-xl border-gray-200 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]/20"
                        />
                      </div>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter your email"
                        className="h-12 rounded-xl border-gray-200 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]/20"
                      />
                      <select
                        required
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A]"
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
                        className="w-full h-12 bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-xl font-medium text-base transition-all duration-200"
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
                    {waitlistCount !== null && waitlistCount > 0 && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <div className="flex -space-x-2">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2B8A8A] to-teal-600 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                            >
                              {String.fromCharCode(65 + i)}
                            </div>
                          ))}
                        </div>
                        <span className="text-sm">
                          <strong className="text-gray-900">{waitlistCount.toLocaleString()}</strong> people already joined
                        </span>
                      </div>
                    )}

                    {referredBy && (
                      <div className="text-sm text-[#2B8A8A] bg-[#2B8A8A]/5 px-4 py-2 rounded-full">
                        You were referred by a friend!
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ) : (
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

                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    {alreadyExists ? "Welcome back!" : "You're on the list!"}
                  </h2>
                  <p className="text-gray-600 mb-8">
                    {alreadyExists
                      ? "You're already on the waitlist. Here's your referral link."
                      : "We'll notify you when it's your turn. Share your link to move up!"}
                  </p>

                  <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-3">
                      Your Referral Link
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={referralLink}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 font-mono"
                      />
                      <Button
                        onClick={handleCopy}
                        className={`h-12 px-5 rounded-xl ${
                          copied ? "bg-green-500" : "bg-[#2B8A8A]"
                        }`}
                      >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=I%20just%20joined%20Career%20Forward!%20Join%20me%3A%20${encodeURIComponent(referralLink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Share on X
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-[#0077b5] text-white rounded-xl text-sm font-medium hover:bg-[#006699] transition-colors"
                    >
                      Share on LinkedIn
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Benefits Section - Clean Cards */}
        {!isSuccess && (
          <section className="py-20 px-6 bg-gray-50">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
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
                    <div className="w-10 h-10 rounded-xl bg-[#2B8A8A]/10 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-5 h-5 text-[#2B8A8A]" />
                    </div>
                    <p className="font-medium text-gray-900">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Product Preview - Clean */}
        {!isSuccess && (
          <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Your job search, simplified
                </h2>
                <p className="text-gray-600">
                  One dashboard to track every application
                </p>
              </motion.div>

              {/* App Preview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gray-900 rounded-2xl p-2 shadow-2xl">
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

                {/* Floating Stats */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="absolute -left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white rounded-xl p-4 shadow-lg border border-gray-100 hidden lg:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#2B8A8A] flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">2,847</p>
                      <p className="text-xs text-gray-500">Jobs Tracked</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="absolute -right-4 md:right-8 top-1/3 bg-white rounded-xl p-4 shadow-lg border border-gray-100 hidden lg:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">94%</p>
                      <p className="text-xs text-gray-500">Success Rate</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        {!isSuccess && (
          <section className="py-20 px-6 bg-[#2B8A8A]">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to transform your job search?
                </h2>
                <p className="text-white/80 mb-8">
                  Join the waitlist and be the first to know when we launch.
                </p>
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="bg-white text-[#2B8A8A] hover:bg-gray-100 h-12 px-8 rounded-xl font-medium"
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
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Career Forward. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
