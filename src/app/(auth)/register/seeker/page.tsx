"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  Mail,
  FileText,
  Target,
  Briefcase,
  Sparkles,
} from "lucide-react";

interface SeekerFormData {
  firstName: string;
  lastName: string;
  email: string;
  targetRole: string;
  biggestNeed: string;
  currentStatus: string;
  acceptTerms: boolean;
}

export default function SeekerRegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<SeekerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    targetRole: "",
    biggestNeed: "",
    currentStatus: "",
    acceptTerms: false,
  });

  const handleGoogleSignup = () => {
    // Placeholder for Google OAuth - will be implemented later
    console.log("Google signup clicked");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.acceptTerms) {
      setError("Please accept the terms to continue");
      setIsLoading(false);
      return;
    }

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Store in localStorage for demo purposes
    const registrations = JSON.parse(localStorage.getItem("cq_registrations") || "[]");
    registrations.push({
      type: "seeker",
      ...formData,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem("cq_registrations", JSON.stringify(registrations));

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
          className="w-full max-w-md text-center"
        >
          {/* Celebration animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-8 h-20 w-20 rounded-full bg-[#2B8A8A] flex items-center justify-center shadow-lg shadow-[#2B8A8A]/30"
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
              You're in, {formData.firstName}!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Your career journey starts now.
            </p>
          </motion.div>

          {/* What's next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
          >
            <h3 className="font-semibold text-gray-900 mb-4 text-left">What you can do now:</h3>
            <div className="space-y-4">
              {[
                { icon: FileText, text: "Build your first resume", color: "#2B8A8A" },
                { icon: Briefcase, text: "Start tracking applications", color: "#374151" },
                { icon: Target, text: "Set your career goals", color: "#2B8A8A" },
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
          >
            <Link href="/dashboard">
              <Button className="bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-full h-12 px-8 font-medium shadow-lg shadow-[#2B8A8A]/25">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <p className="text-sm text-gray-500 mt-6">
              Check your email for a welcome message from us.
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

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
                  className="h-12 rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]"
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
                  className="h-12 rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]"
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
                className="h-12 rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]"
              />
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
                className="h-12 rounded-xl border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="biggestNeed" className="text-gray-700">
                What's your biggest need right now? <span className="text-gray-400 font-normal">(optional)</span>
              </Label>
              <Select
                value={formData.biggestNeed}
                onValueChange={(value) => setFormData({ ...formData, biggestNeed: value })}
                disabled={isLoading}
              >
                <SelectTrigger id="biggestNeed" className="h-12 rounded-xl border-gray-200 bg-white text-gray-900">
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
                <SelectTrigger id="status" className="h-12 rounded-xl border-gray-200 bg-white text-gray-900">
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

            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, acceptTerms: checked as boolean })
                }
                disabled={isLoading}
                className="mt-0.5 rounded"
              />
              <Label
                htmlFor="acceptTerms"
                className="text-sm font-normal cursor-pointer leading-relaxed text-gray-600"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-[#2B8A8A] hover:underline" target="_blank">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#2B8A8A] hover:underline" target="_blank">
                  Privacy Policy
                </Link>
              </Label>
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
    </div>
  );
}
