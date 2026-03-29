"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Mail, RefreshCw } from "lucide-react";

type VerificationStatus = "loading" | "success" | "error" | "expired" | "already_verified";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided. Please check your email for the verification link.");
      return;
    }

    verifyEmail(token);
  }, [token]);

  async function verifyEmail(token: string) {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await response.json();

      if (data.success) {
        if (data.alreadyVerified) {
          setStatus("already_verified");
          setMessage("Your email is already verified. You can sign in to your account.");
        } else {
          setStatus("success");
          setMessage("Your email has been verified! You can now sign in to your account.");
        }
      } else {
        if (data.code === "TOKEN_EXPIRED") {
          setStatus("expired");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to verify email. Please try again.");
        }
      }
    } catch {
      setStatus("error");
      setMessage("An error occurred while verifying your email. Please try again.");
    }
  }

  async function handleResendVerification() {
    if (!email) return;

    setResending(true);
    setResendSuccess(false);

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (data.success) {
        setResendSuccess(true);
        setMessage("A new verification email has been sent! Please check your inbox.");
      } else {
        setMessage(data.message || "Failed to resend verification email.");
      }
    } catch {
      setMessage("Failed to resend verification email. Please try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/career-forward-logo.png"
              alt="Career Forward"
              width={200}
              height={50}
              priority
            />
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          {status === "loading" && (
            <div className="text-center">
              <Loader2 className="h-12 w-12 text-[#2B8A8A] mx-auto mb-4 animate-spin" />
              <h1 className="text-xl font-bold text-gray-900 mb-2">Verifying your email...</h1>
              <p className="text-gray-600">Please wait while we verify your email address.</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Email Verified!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                href="/signin"
                className="inline-flex items-center justify-center w-full bg-[#2B8A8A] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#247070] transition-colors"
              >
                Sign in to your account
              </Link>
            </div>
          )}

          {status === "already_verified" && (
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Already Verified</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <Link
                href="/signin"
                className="inline-flex items-center justify-center w-full bg-[#2B8A8A] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#247070] transition-colors"
              >
                Sign in to your account
              </Link>
            </div>
          )}

          {(status === "error" || status === "expired") && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {status === "expired" ? "Link Expired" : "Verification Failed"}
              </h1>
              <p className="text-gray-600 mb-6">{message}</p>

              {!resendSuccess && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Enter your email to receive a new verification link:
                  </p>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2B8A8A] focus:border-transparent"
                  />
                  <button
                    onClick={handleResendVerification}
                    disabled={!email || resending}
                    className="inline-flex items-center justify-center w-full bg-[#2B8A8A] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#247070] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Resend Verification Email
                      </>
                    )}
                  </button>
                </div>
              )}

              {resendSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <Mail className="h-5 w-5" />
                    <span className="font-medium">Check your inbox!</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    A new verification email has been sent.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{" "}
          <Link href="/contact" className="text-[#2B8A8A] hover:underline font-medium">
            Contact support
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-[#2B8A8A] mx-auto mb-4 animate-spin" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
