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
      icon: FileText,
      title: "AI-Powered Resume Builder",
      description: "Create job-winning resumes with intelligent suggestions",
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      description: "Get matched to opportunities that fit your skills",
    },
    {
      icon: MessageSquare,
      title: "AI Career Coach",
      description: "24/7 guidance from your personal career assistant",
    },
    {
      icon: Briefcase,
      title: "Application Tracker",
      description: "Stay organized throughout your job search journey",
    },
  ];

  const foundingPerks = [
    {
      icon: Gift,
      title: "2 Months Free Premium",
      description: "Full access to all premium features at no cost",
    },
    {
      icon: Award,
      title: "Founding Member Badge",
      description: "Exclusive badge displayed on your profile forever",
    },
    {
      icon: Sparkles,
      title: "Shape the Product",
      description: "Direct feedback channel to influence new features",
    },
    {
      icon: Gift,
      title: "6-Month Giveaway",
      description: "One lucky member wins 6 months of premium free",
    },
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#2B8A8A] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Career Forward</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Side - Value Proposition */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-28"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2B8A8A]/10 rounded-full text-[#2B8A8A] font-medium text-sm mb-6">
                <Sparkles className="w-4 h-4" />
                Beta Coming Soon
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Land Your Dream Job{" "}
                <span className="text-[#2B8A8A]">Faster</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Join the waitlist for Career Forward, the all-in-one platform designed
                to help job seekers succeed with AI-powered tools and personalized guidance.
              </p>

              {/* Founding Member Perks */}
              <div className="bg-gradient-to-br from-[#2B8A8A]/5 to-[#2B8A8A]/10 rounded-2xl p-6 mb-8 border border-[#2B8A8A]/20">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#2B8A8A]" />
                  Founding Member Perks
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {foundingPerks.map((perk, index) => (
                    <motion.div
                      key={perk.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <perk.icon className="w-4 h-4 text-[#2B8A8A]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{perk.title}</p>
                        <p className="text-gray-500 text-xs">{perk.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-[#2B8A8A]/30 hover:shadow-md transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#2B8A8A]/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-[#2B8A8A]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                      <p className="text-gray-500 text-xs mt-0.5">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Proof */}
              {waitlistCount !== null && waitlistCount > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3 text-gray-500 mb-6"
                >
                  <Users className="w-5 h-5" />
                  <span>
                    <strong className="text-gray-900">{waitlistCount.toLocaleString()}</strong>{" "}
                    {waitlistCount === 1 ? "person has" : "people have"} already joined
                  </span>
                </motion.div>
              )}

              {/* Recent Signups Feed */}
              {recentSignups.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white rounded-xl border border-gray-100 p-4"
                >
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Recently Joined</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {recentSignups.slice(0, 5).map((signup, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#2B8A8A]/10 flex items-center justify-center">
                            <span className="text-[#2B8A8A] font-medium text-xs">
                              {signup.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{signup.name}</span>
                          <span className="text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {REGION_NAMES[signup.region] || signup.region}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs">{timeAgo(new Date(signup.joinedAt))}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right Side - Form or Success */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 lg:p-10"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Join the Waitlist
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Be the first to know when we launch. Get early access and exclusive
                      founding member benefits.
                    </p>

                    {referredBy && (
                      <div className="mb-6 p-3 bg-[#2B8A8A]/5 border border-[#2B8A8A]/20 rounded-lg">
                        <p className="text-sm text-[#2B8A8A]">
                          You were referred by a friend! You'll both get priority access.
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            className="h-12 rounded-xl"
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
                            className="h-12 rounded-xl"
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
                          className="h-12 rounded-xl"
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
                          className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A]"
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
                          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {error}
                        </motion.div>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-xl font-semibold text-base"
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
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 lg:p-10 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </motion.div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {alreadyExists ? "Welcome back!" : "You're on the list!"}
                    </h2>
                    <p className="text-gray-600 mb-8">
                      {alreadyExists
                        ? "You're already on the waitlist. Here's your referral link again."
                        : "Thanks for joining! Check your email for confirmation and your unique referral link."}
                    </p>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                      <p className="text-sm text-gray-500 mb-3 uppercase tracking-wide font-medium">
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
                          variant="outline"
                          className="h-12 px-4 rounded-xl border-gray-200 hover:bg-gray-100"
                        >
                          {copied ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-6">
                      Share your link to help friends discover Career Forward!
                    </p>

                    <div className="flex justify-center gap-3">
                      <a
                        href={`https://twitter.com/intent/tweet?text=I%20just%20joined%20the%20Career%20Forward%20waitlist%20to%20land%20my%20dream%20job%20faster!%20Join%20me%3A%20${encodeURIComponent(referralLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#1da1f2] text-white rounded-xl font-medium hover:bg-[#1a8cd8] transition-colors"
                      >
                        Share on Twitter
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#0077b5] text-white rounded-xl font-medium hover:bg-[#006699] transition-colors"
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
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedFaq === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Career Forward. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
