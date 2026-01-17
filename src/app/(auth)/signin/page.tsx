"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Users,
  Target,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [loginType, setLoginType] = useState<"seeker" | "coach">(
    typeParam === "coach" ? "coach" : "seeker"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "An error occurred during sign in");
        return;
      }

      const userRole = data.user.role;
      if (userRole === "COACH" || userRole === "ADMIN") {
        router.push("/coach/dashboard");
      } else if (data.user.profileCompleted) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const accentColor = loginType === "seeker" ? "#2B8A8A" : "#2B8A8A";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAFBFC]">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 bg-[#2B8A8A]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 bg-[#2B8A8A]" />
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
          <p className="text-sm text-gray-500 hidden sm:block">Here to Move You Forward</p>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Side - Branding */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden lg:block"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg shadow-gray-200/50 border border-gray-100 mb-8">
                <Sparkles className="h-4 w-4 text-[#2B8A8A]" />
                <span className="text-sm font-medium text-gray-700">
                  {loginType === "seeker" ? "100% Free for Job Seekers" : "For Workforce Partners"}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-gray-900 mb-6">
                {loginType === "seeker" ? (
                  <>
                    Your career journey
                    <br />
                    <span className="text-[#2B8A8A]">continues here</span>
                  </>
                ) : (
                  <>
                    Empower your
                    <br />
                    <span className="text-[#2B8A8A]">team today</span>
                  </>
                )}
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-md">
                {loginType === "seeker"
                  ? "Access your personalized dashboard, track applications, and take the next step toward your dream job."
                  : "Monitor job seeker progress, track outcomes, and drive results with real-time insights."
                }
              </p>

              {/* Trust indicators */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-[#2B8A8A]" />
                  <span>AI-powered job matching</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-[#2B8A8A]" />
                  <span>Resume builder & interview prep</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2 className="h-5 w-5 text-[#2B8A8A]" />
                  <span>Progress tracking & analytics</span>
                </div>
              </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-md mx-auto lg:mx-0"
            >
              {/* Login Type Toggle */}
              <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6">
                <button
                  type="button"
                  onClick={() => setLoginType("seeker")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    loginType === "seeker"
                      ? "bg-[#2B8A8A] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Target className="h-4 w-4" />
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType("coach")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    loginType === "coach"
                      ? "bg-[#2B8A8A] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Coach
                </button>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-2xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                {/* Mobile Logo */}
                <div className="lg:hidden text-center mb-6">
                  <Link href="/">
                    <Image
                      src="/career-forward-logo.png"
                      alt="Career Forward"
                      width={180}
                      height={45}
                      className="mx-auto"
                      priority
                    />
                  </Link>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                  <p className="text-gray-500 mt-1">
                    {loginType === "seeker"
                      ? "Sign in to continue your journey"
                      : "Access your coach dashboard"
                    }
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      disabled={isLoading}
                      className="h-12 bg-gray-50 border-gray-200 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                        disabled={isLoading}
                        className="h-12 bg-gray-50 border-gray-200 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]/20 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, rememberMe: checked as boolean })
                        }
                        disabled={isLoading}
                      />
                      <Label
                        htmlFor="rememberMe"
                        className="text-sm font-normal text-gray-600 cursor-pointer"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-[#2B8A8A] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#2B8A8A] hover:bg-[#237070] text-white font-semibold shadow-lg shadow-[#2B8A8A]/25 hover:shadow-xl hover:shadow-[#2B8A8A]/30 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link
                      href={loginType === "seeker" ? "/register/seeker" : "/register/coach"}
                      className="text-[#2B8A8A] font-medium hover:underline"
                    >
                      Create one here
                    </Link>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <p className="text-center text-sm text-gray-400 mt-6">
                © 2026 Career Forward. All rights reserved.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <Loader2 className="h-8 w-8 animate-spin text-[#2B8A8A]" />
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}
