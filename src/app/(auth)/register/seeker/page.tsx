"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Target,
  Briefcase,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";

interface SeekerFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  targetRole: string;
  biggestNeed: string;
  currentStatus: string;
  acceptTerms: boolean;
}

export default function SeekerRegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentRecord, setConsentRecord] = useState<ConsentRecord | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<SeekerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    targetRole: "",
    biggestNeed: "",
    currentStatus: "",
    acceptTerms: false,
  });

  const handleConsentComplete = (consents: ConsentRecord) => {
    setConsentRecord(consents);
    setFormData({ ...formData, acceptTerms: true });
    setShowConsentModal(false);
  };

  const handleGoogleSignup = () => {
    // Placeholder for Google OAuth - will be implemented later
    console.log("Google signup clicked");
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 12) return "Password must be at least 12 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate terms acceptance
    if (!formData.acceptTerms) {
      setError("Please accept the terms to continue");
      setIsLoading(false);
      return;
    }

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Register the user
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          acceptTerms: formData.acceptTerms,
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setError(registerData.message || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // Store consent record for the user
      if (consentRecord) {
        localStorage.setItem(`cf_consent_${formData.email}`, JSON.stringify(consentRecord));
      }

      // Step 2: Log the user in
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: false,
        }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        // Registration succeeded but login failed - redirect to signin
        router.push("/signin");
        return;
      }

      // Step 3: Redirect to onboarding
      router.push("/onboarding");
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Registration form
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
            Land your dream job, faster
          </h1>
          <p className="text-gray-600 mb-8">
            Create your free account in seconds.
          </p>

          {/* Google SSO Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignup}
            className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50 font-medium mb-6"
          >
            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#FAFBFC] text-gray-500">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700">First name</Label>
                <Input
                  id="firstName"
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
                className="h-12 rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                At least 12 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={isLoading}
                  className="h-12 rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetRole" className="text-gray-700">
                Target role or industry <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Input
                id="targetRole"
                placeholder="e.g. Software Engineer, Healthcare, Marketing"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                disabled={isLoading}
                className="h-12 rounded-xl border-gray-200 bg-white placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="biggestNeed" className="text-gray-700">
                What&apos;s your biggest need right now? <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Select
                value={formData.biggestNeed}
                onValueChange={(value) => setFormData({ ...formData, biggestNeed: value })}
                disabled={isLoading}
              >
                <SelectTrigger id="biggestNeed" className="h-12 rounded-xl border-gray-200 bg-white">
                  <SelectValue placeholder="Select your top priority" className="text-gray-400" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resume">Building or improving my resume</SelectItem>
                  <SelectItem value="job-search">Finding the right job opportunities</SelectItem>
                  <SelectItem value="applications">Organizing my job applications</SelectItem>
                  <SelectItem value="interview">Preparing for interviews</SelectItem>
                  <SelectItem value="career-direction">Figuring out my career direction</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-700">Where are you in your job search?</Label>
              <Select
                value={formData.currentStatus}
                onValueChange={(value) => setFormData({ ...formData, currentStatus: value })}
                disabled={isLoading}
              >
                <SelectTrigger id="status" className="h-12 rounded-xl border-gray-200 bg-white">
                  <SelectValue placeholder="Select your status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actively-searching">Actively searching</SelectItem>
                  <SelectItem value="employed-looking">Employed, exploring options</SelectItem>
                  <SelectItem value="student">Student or recent graduate</SelectItem>
                  <SelectItem value="career-change">Making a career change</SelectItem>
                  <SelectItem value="returning">Returning to work</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowConsentModal(true)}
                disabled={isLoading || formData.acceptTerms}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  formData.acceptTerms
                    ? "border-[#2B8A8A] bg-[#2B8A8A]/5"
                    : "border-gray-200 hover:border-[#2B8A8A]/50 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    formData.acceptTerms
                      ? "border-[#2B8A8A] bg-[#2B8A8A]"
                      : "border-gray-300"
                  }`}>
                    {formData.acceptTerms && (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    {formData.acceptTerms ? (
                      <span className="text-sm font-medium text-[#2B8A8A]">
                        Terms of Service and Privacy Policy accepted
                      </span>
                    ) : (
                      <span className="text-sm text-gray-600">
                        Click to review and accept the{" "}
                        <span className="text-[#2B8A8A] font-medium">Terms of Service</span>
                        {" "}and{" "}
                        <span className="text-[#2B8A8A] font-medium">Privacy Policy</span>
                      </span>
                    )}
                  </div>
                  {!formData.acceptTerms && (
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-xl h-12 font-semibold shadow-lg shadow-[#2B8A8A]/25 transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/signin" className="text-[#2B8A8A] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Value props (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#2B8A8A] to-[#1E6B6B] items-center justify-center p-12">
        <div className="max-w-md text-white">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-5 w-5" />
              <span className="text-white font-medium">100% Free Forever</span>
            </div>

            <h2 className="text-3xl font-bold mb-6">
              Everything you need to land your next role
            </h2>

            <div className="space-y-5">
              {[
                { icon: FileText, title: "Resume Builder", desc: "Create ATS-optimized resumes that get noticed" },
                { icon: Briefcase, title: "Job Tracker", desc: "Never lose track of an application again" },
                { icon: Target, title: "Interview Prep", desc: "Practice with real questions and get confident" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-white/90 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-white/30">
              <p className="text-white/80 text-sm">
                Join 2,500+ job seekers already using Career Forward
              </p>
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
