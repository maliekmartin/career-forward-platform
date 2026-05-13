"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building2,
  Users,
  Calendar,
  Mail,
  Sparkles,
  Clock,
} from "lucide-react";

export default function CoachRegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFBFC] via-white to-[#FAFBFC] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Back link */}
        <Link
          href="/register"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to registration
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl hover-lift">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-8">
              <Image
                src="/career-forward-logo.png"
                alt="Career Forward"
                width={220}
                height={55}
                priority
              />
            </Link>
          </div>

          {/* Coming Soon Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F59E0B]/10 rounded-full border border-[#F59E0B]/20">
              <Clock className="h-4 w-4 text-[#F59E0B]" />
              <span className="text-sm font-semibold text-[#F59E0B] text-mono">
                LAUNCHING Q2 2027
              </span>
            </div>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-[#0D9488] to-[#1E6B6B] rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Building2 className="h-10 w-10 text-white" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-[#0F172A] text-center mb-4"
          >
            Coach Registration
            <br />
            <span className="text-[#0D9488]">Coming Soon</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 text-center text-lg mb-10 max-w-xl mx-auto leading-relaxed"
          >
            We're building something special for workforce development organizations.
            Career Forward for coaches will launch alongside our job seeker platform in Q2 2027.
          </motion.p>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 mb-10"
          >
            <div className="flex items-start gap-4 p-4 bg-[#0D9488]/5 rounded-xl border border-[#0D9488]/10">
              <div className="w-10 h-10 bg-[#0D9488]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-[#0D9488]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0F172A] mb-1">Manage Your Caseload</h3>
                <p className="text-sm text-gray-600">
                  Track unlimited job seekers with real-time progress dashboards
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#0D9488]/5 rounded-xl border border-[#0D9488]/10">
              <div className="w-10 h-10 bg-[#0D9488]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="h-5 w-5 text-[#0D9488]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0F172A] mb-1">Streamline Scheduling</h3>
                <p className="text-sm text-gray-600">
                  Appointment booking, calendar sync, and automated reminders
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-[#0D9488]/5 rounded-xl border border-[#0D9488]/10">
              <div className="w-10 h-10 bg-[#0D9488]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-5 w-5 text-[#0D9488]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0F172A] mb-1">Outcome Reporting</h3>
                <p className="text-sm text-gray-600">
                  Track placements, wages, and export data for grant reporting
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <div className="p-6 bg-gradient-to-br from-[#FAFBFC] to-white rounded-2xl border border-gray-100">
              <h3 className="font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#0D9488]" />
                Get Early Access
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Want to be notified when coach registration opens? Join our waitlist and we'll
                reach out when we're ready to onboard organizations.
              </p>
              <Link href="/waitlist">
                <Button className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl h-12 font-semibold btn-3d-amber">
                  Join Waitlist
                </Button>
              </Link>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Need pricing information?{" "}
                <Link href="/pricing" className="text-[#0D9488] hover:underline font-medium">
                  View pricing
                </Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Links */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Are you a job seeker?{" "}
          <Link href="/waitlist" className="text-[#0D9488] hover:underline font-medium">
            Join the waitlist
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
