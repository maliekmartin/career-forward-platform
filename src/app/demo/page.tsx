"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Users,
  Sparkles,
  BarChart3,
  Target,
  Mail,
  Phone,
  User,
  Building2,
  Briefcase,
  Calendar,
  PlayCircle,
  MessageSquare,
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Caseload Management",
    description: "Track unlimited job seekers with real-time dashboards",
  },
  {
    icon: Target,
    title: "AI-Powered Matching",
    description: "Connect seekers with opportunities that fit their skills",
  },
  {
    icon: BarChart3,
    title: "Outcome Tracking",
    description: "Report placement data for grants and compliance",
  },
  {
    icon: MessageSquare,
    title: "Built-in Communication",
    description: "Keep everyone connected with in-app messaging",
  },
];

const teamSizeOptions = [
  { value: "1-5", label: "1-5 coaches" },
  { value: "6-15", label: "6-15 coaches" },
  { value: "16-30", label: "16-30 coaches" },
  { value: "31-50", label: "31-50 coaches" },
  { value: "51+", label: "51+ coaches" },
];

const orgTypeOptions = [
  { value: "workforce", label: "Workforce Development Board" },
  { value: "nonprofit", label: "Non-Profit Organization" },
  { value: "education", label: "Educational Institution" },
  { value: "government", label: "Government Agency" },
  { value: "staffing", label: "Staffing Agency" },
  { value: "other", label: "Other" },
];

export default function DemoPage() {
  const [formStep, setFormStep] = useState(1); // 1 = contact, 2 = org info, 3 = success
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
    teamSize: "",
    orgType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formStep === 1) {
      setFormStep(2);
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, you'd send this to your backend or email service
    console.log("Demo request submitted:", formData);

    setIsSubmitting(false);
    setFormStep(3);
  };

  const handleBack = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAFBFC]">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl opacity-20 bg-[#2B8A8A]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 bg-[#2B8A8A]" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/">
            <Image
              src="/career-forward-logo.png"
              alt="Career Forward"
              width={180}
              height={45}
              priority
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-gray-600 hover:text-[#2B8A8A] transition-colors hidden sm:block"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              className="text-sm text-gray-600 hover:text-[#2B8A8A] transition-colors hidden sm:block"
            >
              FAQ
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-64px)] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-24"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg shadow-gray-200/50 border border-gray-100 mb-6">
                <PlayCircle className="h-4 w-4 text-[#2B8A8A]" />
                <span className="text-sm font-medium text-gray-700">See Career Forward in Action</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-gray-900 mb-6">
                Transform how you
                <br />
                <span className="text-[#2B8A8A]">serve job seekers</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                Schedule a personalized demo to see how Career Forward can help your organization achieve better outcomes.
              </p>

              {/* Benefits */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                    className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="w-10 h-10 bg-[#2B8A8A]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-[#2B8A8A]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{benefit.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Trust line */}
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Here to Move You Forward</span> — Empowering workforce development organizations across the country.
              </p>
            </motion.div>

            {/* Right Side - Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Progress indicator */}
              {formStep < 3 && (
                <div className="flex items-center gap-2 mb-6">
                  <div className={`h-2 flex-1 rounded-full ${formStep >= 1 ? "bg-[#2B8A8A]" : "bg-gray-200"}`} />
                  <div className={`h-2 flex-1 rounded-full ${formStep >= 2 ? "bg-[#2B8A8A]" : "bg-gray-200"}`} />
                </div>
              )}

              <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                <AnimatePresence mode="wait">
                  {formStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Request a Demo</h2>
                        <p className="text-gray-500 mt-1">Tell us about yourself</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                id="firstName"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                                className="h-12 pl-10 bg-gray-50 border-gray-200"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                            <Input
                              id="lastName"
                              placeholder="Doe"
                              value={formData.lastName}
                              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                              required
                              className="h-12 bg-gray-50 border-gray-200"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700">Work Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@organization.org"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                              className="h-12 pl-10 bg-gray-50 border-gray-200"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="(555) 123-4567"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              required
                              className="h-12 pl-10 bg-gray-50 border-gray-200"
                            />
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-12 bg-[#2B8A8A] hover:bg-[#237070] text-white font-semibold shadow-lg shadow-[#2B8A8A]/25 mt-6"
                        >
                          Continue
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </form>
                    </motion.div>
                  )}

                  {formStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>

                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">About Your Organization</h2>
                        <p className="text-gray-500 mt-1">Help us prepare a tailored demo</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-gray-700">Organization Name</Label>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="company"
                              placeholder="Workforce Development Corp"
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              required
                              className="h-12 pl-10 bg-gray-50 border-gray-200"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="jobTitle" className="text-gray-700">Your Role</Label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="jobTitle"
                              placeholder="Program Director"
                              value={formData.jobTitle}
                              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                              required
                              className="h-12 pl-10 bg-gray-50 border-gray-200"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-700">Organization Type</Label>
                          <Select
                            value={formData.orgType}
                            onValueChange={(value) => setFormData({ ...formData, orgType: value })}
                          >
                            <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                              <SelectValue placeholder="Select organization type" />
                            </SelectTrigger>
                            <SelectContent>
                              {orgTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-gray-700">Team Size</Label>
                          <Select
                            value={formData.teamSize}
                            onValueChange={(value) => setFormData({ ...formData, teamSize: value })}
                          >
                            <SelectTrigger className="h-12 bg-gray-50 border-gray-200">
                              <SelectValue placeholder="How many coaches?" />
                            </SelectTrigger>
                            <SelectContent>
                              {teamSizeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="text-gray-700">
                            Anything else we should know? <span className="text-gray-400">(Optional)</span>
                          </Label>
                          <textarea
                            id="message"
                            placeholder="Tell us about your current challenges or goals..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full h-24 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] resize-none"
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-12 bg-[#2B8A8A] hover:bg-[#237070] text-white font-semibold shadow-lg shadow-[#2B8A8A]/25 mt-4"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              Request Demo
                              <Calendar className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                      </form>
                    </motion.div>
                  )}

                  {formStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 bg-[#2B8A8A]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-8 w-8 text-[#2B8A8A]" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h2>
                      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                        Thanks for your interest in Career Forward. A member of our team will reach out within one business day to schedule your personalized demo.
                      </p>
                      <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-500">
                          Submitted for <span className="font-medium text-gray-700">{formData.company}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          We'll contact you at <span className="font-medium text-gray-700">{formData.email}</span>
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/">
                          <Button variant="outline">
                            Back to Home
                          </Button>
                        </Link>
                        <Link href="/pricing">
                          <Button className="bg-[#2B8A8A] hover:bg-[#237070]">
                            View Pricing
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer note */}
              {formStep < 3 && (
                <p className="text-center text-sm text-gray-400 mt-6">
                  By submitting, you agree to our privacy policy. We never share your information.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 py-6 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-gray-500 hover:text-[#2B8A8A] transition-colors">
                Home
              </Link>
              <Link href="/faq" className="text-sm text-gray-500 hover:text-[#2B8A8A] transition-colors">
                FAQ
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-[#2B8A8A] transition-colors">
                Privacy Policy
              </Link>
            </div>
            <span className="text-sm text-gray-400">A Martin Built Strategies Product</span>
          </div>
          <div className="text-center md:text-left">
            <span className="text-sm text-gray-400">© 2026 Career Forward. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
