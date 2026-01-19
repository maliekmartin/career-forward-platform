"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TermsConsentModal, ConsentRecord } from "@/components/terms-consent-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Building2,
  User,
  Users,
  Calendar,
  Play,
} from "lucide-react";

interface CoachFormData {
  // Step 1: Organization
  organizationName: string;
  coachCount: string;
  // Step 2: Contact
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  // Step 3: Additional
  hearAbout: string;
  message: string;
  acceptTerms: boolean;
}

const steps = [
  { id: 1, name: "Organization", icon: Building2 },
  { id: 2, name: "Contact", icon: User },
  { id: 3, name: "Details", icon: Users },
];

export default function CoachRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentRecord, setConsentRecord] = useState<ConsentRecord | null>(null);

  const [formData, setFormData] = useState<CoachFormData>({
    organizationName: "",
    coachCount: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    hearAbout: "",
    message: "",
    acceptTerms: false,
  });

  const handleConsentComplete = (consents: ConsentRecord) => {
    setConsentRecord(consents);
    setFormData({ ...formData, acceptTerms: true });
    setShowConsentModal(false);
  };

  const validateStep = (step: number): boolean => {
    setError(null);
    switch (step) {
      case 1:
        if (!formData.organizationName.trim()) {
          setError("Please enter your organization name");
          return false;
        }
        if (!formData.coachCount) {
          setError("Please select your team size");
          return false;
        }
        return true;
      case 2:
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
          setError("Please enter your full name");
          return false;
        }
        if (!formData.email.trim()) {
          setError("Please enter your work email");
          return false;
        }
        return true;
      case 3:
        if (!formData.acceptTerms) {
          setError("Please accept the terms to continue");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    setIsLoading(true);
    setError(null);

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Store in localStorage for demo purposes
    const registrations = JSON.parse(localStorage.getItem("cq_registrations") || "[]");
    registrations.push({
      type: "coach",
      ...formData,
      consents: consentRecord,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem("cq_registrations", JSON.stringify(registrations));

    // Store consent separately for the user (for checking on login)
    if (consentRecord) {
      localStorage.setItem(`cf_consent_${formData.email}`, JSON.stringify(consentRecord));
    }

    setIsLoading(false);
    setSuccess(true);
  };

  // Success/Confirmation screen
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FAFBFC] to-white px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg text-center"
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-8 h-20 w-20 rounded-full bg-[#374151] flex items-center justify-center shadow-lg shadow-[#374151]/30"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
            >
              <CheckCircle2 className="h-10 w-10 text-white" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              You're all set!
            </h1>
            <p className="text-gray-600 text-lg mb-2">
              Thanks for your interest, {formData.firstName}.
            </p>
          </motion.div>

          {/* Next steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 mt-8"
          >
            <div className="bg-[#374151]/5 rounded-xl p-6 mb-6">
              <p className="text-gray-700 leading-relaxed">
                Career Forward looks forward to supporting your job seekers! A member of our team will be in contact with you in{" "}
                <span className="font-semibold text-[#374151]">one business day</span>.
              </p>
            </div>

            <h3 className="font-semibold text-gray-900 mb-4 text-left">While you wait:</h3>
            <div className="space-y-4">
              {[
                { icon: Play, text: "Watch a 2-minute platform demo", color: "#374151" },
                { icon: Calendar, text: "Check your calendar for our call", color: "#2B8A8A" },
                { icon: Users, text: "Think about which coaches to onboard first", color: "#374151" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3 text-left"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <item.icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <span className="text-gray-700">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="space-y-4"
          >
            <Link href="/">
              <Button
                variant="outline"
                className="rounded-full h-12 px-8 font-medium border-gray-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <div className="pt-4 border-t border-gray-100 mt-6">
              <p className="text-sm text-gray-500 mb-2">Need immediate assistance?</p>
              <a
                href="mailto:support@martinbuiltstrategies.com"
                className="inline-flex items-center gap-2 text-[#2B8A8A] font-medium hover:underline"
              >
                <Mail className="h-4 w-4" />
                support@martinbuiltstrategies.com
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Multi-step registration form
  return (
    <div className="min-h-screen flex bg-[#FAFBFC]">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Back link */}
          <Link
            href="/register"
            className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>

          {/* Logo */}
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/career-forward-logo.png"
              alt="Career Forward"
              width={220}
              height={55}
              priority
            />
          </Link>

          {/* Headline */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Get started with Career Forward
          </h1>
          <p className="text-gray-600 mb-8">
            Tell us about your organization.
          </p>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        currentStep >= step.id
                          ? "bg-[#374151] text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-2 mb-6 transition-all duration-300 ${
                        currentStep > step.id ? "bg-[#374151]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error display */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert variant="destructive" className="rounded-xl mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Steps */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Organization */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="orgName" className="text-gray-700">
                      Organization name
                    </Label>
                    <Input
                      id="orgName"
                      placeholder="Workforce Development Center"
                      value={formData.organizationName}
                      onChange={(e) =>
                        setFormData({ ...formData, organizationName: e.target.value })
                      }
                      className="h-12 rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#374151] focus:ring-[#374151]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coachCount" className="text-gray-700">
                      How many coaches will use the platform?
                    </Label>
                    <Select
                      value={formData.coachCount}
                      onValueChange={(value) =>
                        setFormData({ ...formData, coachCount: value })
                      }
                    >
                      <SelectTrigger id="coachCount" className="h-12 rounded-xl border-gray-200 bg-white text-gray-900">
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1-5 coaches</SelectItem>
                        <SelectItem value="6-10">6-10 coaches</SelectItem>
                        <SelectItem value="11-20">11-20 coaches</SelectItem>
                        <SelectItem value="21+">21+ coaches</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-[#374151] hover:bg-[#1F2937] text-white rounded-xl h-12 font-semibold mt-4"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Contact */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700">
                        First name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Jane"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                        className="h-12 rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#374151] focus:ring-[#374151]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700">
                        Last name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Smith"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="h-12 rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#374151] focus:ring-[#374151]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      Work email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jane@organization.org"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="h-12 rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#374151] focus:ring-[#374151]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700">
                        Phone <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="h-12 rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#374151] focus:ring-[#374151]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="text-gray-700">
                        Job title <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Input
                        id="jobTitle"
                        placeholder="Program Manager"
                        value={formData.jobTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, jobTitle: e.target.value })
                        }
                        className="h-12 rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#374151] focus:ring-[#374151]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 rounded-xl h-12 font-medium border-gray-200"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-[#374151] hover:bg-[#1F2937] text-white rounded-xl h-12 font-semibold"
                    >
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Additional Details */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label htmlFor="hearAbout" className="text-gray-700">
                      How did you hear about us?
                    </Label>
                    <Select
                      value={formData.hearAbout}
                      onValueChange={(value) =>
                        setFormData({ ...formData, hearAbout: value })
                      }
                    >
                      <SelectTrigger id="hearAbout" className="h-12 rounded-xl border-gray-200 bg-white text-gray-900">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="search">Search engine</SelectItem>
                        <SelectItem value="referral">Referral from colleague</SelectItem>
                        <SelectItem value="conference">Conference or event</SelectItem>
                        <SelectItem value="social">Social media</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700">
                      Anything else we should know?{" "}
                      <span className="text-gray-400">(optional)</span>
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your program, goals, or questions..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={3}
                      className="rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#374151] focus:ring-[#374151] resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowConsentModal(true)}
                      disabled={isLoading || formData.acceptTerms}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        formData.acceptTerms
                          ? "border-[#374151] bg-[#374151]/5"
                          : "border-gray-200 hover:border-[#374151]/50 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          formData.acceptTerms
                            ? "border-[#374151] bg-[#374151]"
                            : "border-gray-300"
                        }`}>
                          {formData.acceptTerms && (
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          {formData.acceptTerms ? (
                            <span className="text-sm font-medium text-[#374151]">
                              Terms of Service and Privacy Policy accepted
                            </span>
                          ) : (
                            <span className="text-sm text-gray-600">
                              Click to review and accept the{" "}
                              <span className="text-[#374151] font-medium">Terms of Service</span>
                              {" "}and{" "}
                              <span className="text-[#374151] font-medium">Privacy Policy</span>
                            </span>
                          )}
                        </div>
                        {!formData.acceptTerms && (
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </button>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="flex-1 rounded-xl h-12 font-medium border-gray-200"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-[#374151] hover:bg-[#1F2937] text-white rounded-xl h-12 font-semibold shadow-lg shadow-[#374151]/25"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link href="/signin" className="text-[#2B8A8A] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Value props (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#374151] to-[#1F2937] items-center justify-center p-12">
        <div className="max-w-md text-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-5 w-5" />
              <span className="text-white font-medium">For Workforce Programs</span>
            </div>

            <h2 className="text-3xl font-bold mb-6">
              Empower your coaches with better tools
            </h2>

            <div className="space-y-5">
              {[
                { title: "Real-time visibility", desc: "See job seeker progress across your entire caseload" },
                { title: "Funder-ready reporting", desc: "Exit data, placements, and outcomes in one click" },
                { title: "Full documentation", desc: "Every interaction tracked and protected" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-white/90 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/30">
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold text-[#2B8A8A]">$10</div>
                <div className="text-white/90 text-sm">
                  per coach/month<br />
                  Job seekers always free
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Terms Consent Modal */}
      <TermsConsentModal
        isOpen={showConsentModal}
        onComplete={handleConsentComplete}
        onCancel={() => setShowConsentModal(false)}
      />
    </div>
  );
}
