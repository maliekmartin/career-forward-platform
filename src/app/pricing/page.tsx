"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Users,
  Building2,
  Sparkles,
  Shield,
  BarChart3,
  MessageSquare,
  Calendar,
  FileText,
  Target,
} from "lucide-react";

// Feature categories with expandable details
const featureCategories = [
  {
    name: "Caseload Management",
    icon: Users,
    features: [
      "Unlimited job seekers per coach",
      "Real-time progress dashboards",
      "Custom milestone tracking",
      "Bulk actions & filters",
    ],
  },
  {
    name: "Communication",
    icon: MessageSquare,
    features: [
      "In-app messaging",
      "Automated notifications",
      "Coach notes & history",
      "Activity timeline",
    ],
  },
  {
    name: "Job Search Tools",
    icon: Target,
    features: [
      "Resume builder & previews",
      "Application tracker",
      "Job board integration",
      "Interview prep resources",
    ],
  },
  {
    name: "Reporting & Analytics",
    icon: BarChart3,
    features: [
      "Outcome tracking",
      "Placement reporting",
      "Export to Excel/CSV",
      "Custom date ranges",
    ],
  },
  {
    name: "Scheduling",
    icon: Calendar,
    features: [
      "Appointment booking",
      "Calendar sync",
      "Reminder system",
      "Availability management",
    ],
  },
  {
    name: "Security & Admin",
    icon: Shield,
    features: [
      "Role-based permissions",
      "Secure data handling",
      "Audit logs",
      "SSO ready (Enterprise)",
    ],
  },
];

// FAQ items
const faqItems = [
  {
    q: "What counts as a coach seat?",
    a: "Each staff member who needs their own login to manage job seekers counts as one seat. Job seekers are always free and unlimited with no per-user fees for the people you serve.",
  },
  {
    q: "Can I change my team size later?",
    a: "Absolutely. Add coaches instantly as your program grows. When removing seats, changes take effect at your next billing cycle. No penalties, no hassle.",
  },
  {
    q: "How do we get started?",
    a: "Click 'Get Started' and tell us about your organization. A member of our team will reach out within one business day to set up your account and walk you through onboarding.",
  },
  {
    q: "Is there a contract?",
    a: "No long-term contracts required. Monthly billing with the flexibility to adjust as needed. Annual plans offer 17% savings for teams ready to commit.",
  },
  {
    q: "What reporting is available for funders?",
    a: "Career Forward tracks exit data including job titles, wages, hours, and placement dates. Export reports in Excel or CSV format with custom date ranges for grant reporting and WIOA compliance.",
  },
  {
    q: "How does data privacy work?",
    a: "Job seekers control what coaches can see through privacy settings. All data is encrypted, stored securely, and never sold. You own your data and can export it anytime.",
  },
  {
    q: "Can we white-label or customize the platform?",
    a: "Enterprise plans include custom branding options. Contact us to discuss your organization's specific needs and we'll work with you on a solution.",
  },
  {
    q: "What kind of support do you offer?",
    a: "All plans include email support and access to our help center. We also provide onboarding assistance and training sessions to get your team up to speed quickly.",
  },
];

export default function PricingPage() {
  const [coachCount, setCoachCount] = useState(5);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"features" | "faq">("features");

  // Pricing calculation
  const pricePerSeat = billingCycle === "monthly" ? 12 : 10;
  const monthlyTotal = coachCount * pricePerSeat;
  const annualTotal = monthlyTotal * 12;
  const savings = billingCycle === "annual" ? coachCount * 24 : 0;

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/career-forward-logo.png"
              alt="Career Forward"
              width={200}
              height={50}
              priority
            />
          </Link>
          <Link href="/register/coach">
            <Button className="bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full px-5 h-9 text-sm font-medium">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#0F172A] tracking-tight leading-[1.1] mb-6">
              Simple pricing,{" "}
              <span className="text-[#2B8A8A]">powerful results</span>
            </h1>
            <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed">
              One plan with everything included. No feature gates, no surprises.
              Pay only for coach seats. Job seekers are always free.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Calculator + Value Props */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Left: Pricing Calculator Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-3xl shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.05)] overflow-hidden"
            >
              {/* Billing Toggle Header */}
              <div className="px-6 py-5 bg-gradient-to-b from-[#F8FAFC] to-white border-b border-gray-100">
                <div className="flex items-center justify-center">
                  <div className="inline-flex items-center bg-[#F1F5F9] rounded-full p-1">
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        billingCycle === "monthly"
                          ? "bg-white text-[#0F172A] shadow-sm"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle("annual")}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        billingCycle === "annual"
                          ? "bg-white text-[#0F172A] shadow-sm"
                          : "text-[#64748B] hover:text-[#0F172A]"
                      }`}
                    >
                      Annual
                      <span className="bg-[#2B8A8A] text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        -17%
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Calculator Body */}
              <div className="p-6 md:p-8">
                {/* Team Size Selector */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-[#64748B] mb-4">
                    Team size
                  </label>

                  {/* Slider Track */}
                  <div className="relative mb-6">
                    <input
                      type="range"
                      min="1"
                      max="30"
                      value={coachCount}
                      onChange={(e) => setCoachCount(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#E2E8F0] rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #2B8A8A 0%, #2B8A8A ${((coachCount - 1) / 29) * 100}%, #E2E8F0 ${((coachCount - 1) / 29) * 100}%, #E2E8F0 100%)`
                      }}
                    />
                  </div>

                  {/* Count Display */}
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      key={coachCount}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl font-semibold text-[#0F172A]"
                    >
                      {coachCount}
                    </motion.span>
                    <span className="text-[#64748B]">
                      {coachCount === 1 ? "coach" : "coaches"}
                    </span>
                  </div>

                  {coachCount >= 25 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-[#2B8A8A] mt-3"
                    >
                      Need 30+?{" "}
                      <Link href="mailto:hello@careerforward.io" className="underline">
                        Contact us
                      </Link>{" "}
                      for volume pricing.
                    </motion.p>
                  )}
                </div>

                {/* Price Display */}
                <div className="text-center py-6 border-t border-gray-100">
                  <div className="text-sm font-medium text-[#64748B] mb-2">
                    {billingCycle === "monthly" ? "Monthly" : "Annual"} total
                  </div>

                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-sm text-[#64748B]">$</span>
                    <motion.span
                      key={`${monthlyTotal}-${billingCycle}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="text-5xl md:text-6xl font-semibold text-[#0F172A] tracking-tight"
                    >
                      {billingCycle === "monthly" ? monthlyTotal : annualTotal}
                    </motion.span>
                    <span className="text-[#64748B] text-lg">
                      /{billingCycle === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>

                  <p className="text-[#94A3B8] text-sm mt-2">
                    ${pricePerSeat}/coach/month
                  </p>

                  {billingCycle === "annual" && savings > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="inline-flex items-center gap-1.5 bg-[#2B8A8A]/10 text-[#2B8A8A] text-sm font-medium px-3 py-1.5 rounded-full mt-4"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Save ${savings}/year
                    </motion.div>
                  )}

                  <div className="mt-6">
                    <Link href="/register/coach">
                      <Button className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full h-12 text-base font-medium shadow-lg shadow-[#0F172A]/10 hover:shadow-xl hover:shadow-[#0F172A]/10 transition-all duration-200">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  {/* Value Props */}
                  <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                    {[
                      "Unlimited job seekers included",
                      "All features, no tiers",
                      "Cancel anytime",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-center gap-2 text-sm text-[#64748B]">
                        <Check className="h-4 w-4 text-[#2B8A8A]" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Built for Workforce Development */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-[#0F172A] rounded-3xl p-6 md:p-8 flex flex-col"
            >
              <div className="mb-6">
                <Shield className="h-10 w-10 text-[#2B8A8A] mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-3">
                  Built for Workforce Development
                </h3>
                <p className="text-[#94A3B8] leading-relaxed">
                  Every message. Every milestone. Fully documented. Career Forward keeps a complete record, protecting your coaches and proving your impact.
                </p>
              </div>

              <div className="space-y-4 flex-1">
                {/* Reporting */}
                <div className="bg-white/5 rounded-xl p-5">
                  <BarChart3 className="h-6 w-6 text-[#2B8A8A] mb-3" />
                  <h4 className="text-white font-semibold mb-1">Funder-Ready Reporting</h4>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">
                    Exit data, wages, job titles, hours. The outcomes your funders need.
                  </p>
                </div>

                {/* Protection */}
                <div className="bg-white/5 rounded-xl p-5">
                  <MessageSquare className="h-6 w-6 text-[#2B8A8A] mb-3" />
                  <h4 className="text-white font-semibold mb-1">Full Transparency</h4>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">
                    In-app messaging creates a complete audit trail. Every interaction documented.
                  </p>
                </div>

                {/* Efficiency */}
                <div className="bg-white/5 rounded-xl p-5">
                  <Sparkles className="h-6 w-6 text-[#2B8A8A] mb-3" />
                  <h4 className="text-white font-semibold mb-1">Less Admin, More Coaching</h4>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">
                    Automated tracking, reminders, and follow-ups. Give coaches back hours.
                  </p>
                </div>
              </div>

              {/* LMS Coming Soon + Feature Request */}
              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#2B8A8A]/20 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-[#2B8A8A]" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">LMS Coming Soon</p>
                    <p className="text-[#64748B] text-xs">Track skill gains from trainings</p>
                  </div>
                </div>
                <a
                  href="mailto:support@martinbuiltstrategies.com?subject=Feature%20Request"
                  className="bg-[#2B8A8A] hover:bg-[#237070] rounded-xl p-4 flex items-center gap-3 transition-colors group"
                >
                  <div className="w-10 h-10 bg-white/20 group-hover:bg-white/25 rounded-lg flex items-center justify-center shrink-0 transition-colors">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Need something else?</p>
                    <p className="text-white/70 text-xs group-hover:text-white/90 transition-colors">Tell us what you need</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Seekers Free Callout */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2B8A8A] to-[#1E6B6B] p-8 md:p-10"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Job seekers use Career Forward free
                  </h3>
                  <p className="text-white/80 mt-1">
                    Unlimited users. All features. No cost to them, ever.
                  </p>
                </div>
              </div>
              <Link href="/register/seeker">
                <Button className="bg-white text-[#2B8A8A] hover:bg-white/90 rounded-full px-6 font-medium shadow-lg">
                  I'm a Job Seeker
                </Button>
              </Link>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </motion.div>
        </div>
      </section>

      {/* Features & FAQ Section - Tabbed Design */}
      <section className="pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_4px_rgba(0,0,0,0.05),0_12px_24px_rgba(0,0,0,0.05)] overflow-hidden"
          >
            {/* Tab Header */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("features")}
                className={`flex-1 py-5 px-6 text-sm font-semibold transition-all duration-200 relative ${
                  activeTab === "features"
                    ? "text-[#2B8A8A]"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  All Features Included
                </span>
                {activeTab === "features" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2B8A8A]"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("faq")}
                className={`flex-1 py-5 px-6 text-sm font-semibold transition-all duration-200 relative ${
                  activeTab === "faq"
                    ? "text-[#2B8A8A]"
                    : "text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Common Questions
                </span>
                {activeTab === "faq" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2B8A8A]"
                  />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeTab === "features" ? (
                  <motion.div
                    key="features"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-[#64748B] text-center mb-6">
                      One plan. Every feature. No upgrades required.
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      {featureCategories.map((category, index) => (
                        <motion.button
                          key={category.name}
                          onClick={() =>
                            setExpandedCategory(
                              expandedCategory === category.name ? null : category.name
                            )
                          }
                          className={`w-full text-left rounded-xl p-4 transition-all duration-200 border ${
                            expandedCategory === category.name
                              ? "bg-[#2B8A8A]/5 border-[#2B8A8A]/20"
                              : "bg-[#F8FAFC] border-transparent hover:bg-[#F1F5F9]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                expandedCategory === category.name
                                  ? "bg-[#2B8A8A] text-white"
                                  : "bg-white text-[#2B8A8A] shadow-sm"
                              }`}>
                                <category.icon className="h-5 w-5" />
                              </div>
                              <span className="font-semibold text-[#0F172A]">
                                {category.name}
                              </span>
                            </div>
                            <ChevronDown
                              className={`h-5 w-5 text-[#94A3B8] transition-transform duration-200 ${
                                expandedCategory === category.name ? "rotate-180" : ""
                              }`}
                            />
                          </div>

                          <AnimatePresence>
                            {expandedCategory === category.name && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <ul className="mt-4 space-y-2.5 pl-[52px]">
                                  {category.features.map((feature, i) => (
                                    <li
                                      key={i}
                                      className="flex items-center gap-2.5 text-sm text-[#64748B]"
                                    >
                                      <Check className="h-4 w-4 text-[#2B8A8A] flex-shrink-0" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="faq"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-[#64748B] text-center mb-6">
                      Everything you need to know about Career Forward pricing.
                    </p>
                    <div className="space-y-3">
                      {faqItems.map((faq, index) => (
                        <button
                          key={index}
                          onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                          className={`w-full text-left rounded-xl p-5 transition-all duration-200 border ${
                            expandedFaq === index
                              ? "bg-[#2B8A8A]/5 border-[#2B8A8A]/20"
                              : "bg-[#F8FAFC] border-transparent hover:bg-[#F1F5F9]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                                expandedFaq === index
                                  ? "bg-[#2B8A8A] text-white"
                                  : "bg-white text-[#2B8A8A] shadow-sm"
                              }`}>
                                {index + 1}
                              </div>
                              <span className="font-semibold text-[#0F172A] pt-1">{faq.q}</span>
                            </div>
                            <ChevronDown
                              className={`h-5 w-5 text-[#94A3B8] flex-shrink-0 mt-1.5 transition-transform duration-200 ${
                                expandedFaq === index ? "rotate-180" : ""
                              }`}
                            />
                          </div>

                          <AnimatePresence>
                            {expandedFaq === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <p className="mt-4 pl-12 text-[#64748B] leading-relaxed">
                                  {faq.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-semibold text-[#0F172A] mb-4">
              Ready to transform your program?
            </h2>
            <p className="text-[#64748B] text-lg mb-8">
              Get started today. Our team will reach out within one business day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register/coach">
                <Button className="bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-full h-12 px-8 text-base font-medium">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="mailto:hello@careerforward.io?subject=Demo%20Request">
                <Button
                  variant="outline"
                  className="rounded-full h-12 px-8 text-base font-medium border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
                >
                  Request a Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#94A3B8] text-sm">
            © {new Date().getFullYear()} Career Forward. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2 text-[#94A3B8] text-sm">
            <Building2 className="h-4 w-4 text-[#2B8A8A]" />
            <span>A MartinBuiltStrategies Product</span>
          </div>
        </div>
      </footer>

      {/* Custom slider styles */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #0F172A;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.3);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.4);
        }
        input[type="range"]::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #0F172A;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.3);
        }
      `}</style>
    </div>
  );
}
