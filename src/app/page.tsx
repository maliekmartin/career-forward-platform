"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  FileText,
  Briefcase,
  MessageSquare,
  Search,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/branding/1.png"
              alt="Career Forward"
              width={200}
              height={50}
              priority
            />
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-[#7C5FF5] hover:bg-[#6B4FE4] text-white rounded-full px-6 shadow-lg shadow-[#7C5FF5]/30"
            >
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-[#F8F7FF] border border-[#7C5FF5]/20 rounded-full px-4 py-2 mb-8">
              <span className="text-sm font-medium text-[#7C5FF5]">
                Launching Q2 2027
              </span>
            </div>
            <h1 className="text-7xl md:text-8xl font-bold text-[#1E293B] mb-8 tracking-tight leading-[0.95]">
              Land your dream job,
              <br />
              <span className="text-[#7C5FF5]">faster</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Build resumes, track applications, and ace interviews—all in one place. Completely free for job seekers.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              size="lg"
              asChild
              className="bg-[#7C5FF5] hover:bg-[#6B4FE4] text-white rounded-full px-10 h-14 text-lg shadow-xl shadow-[#7C5FF5]/40 hover:shadow-2xl transition-all"
            >
              <Link href="/waitlist">
                Join the Waitlist
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full px-10 h-14 text-lg border-2"
            >
              <Link href="/demo">
                See Demo
              </Link>
            </Button>
          </motion.div>

          {/* Inline Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-12 text-center"
          >
            <div>
              <div className="text-4xl font-bold text-[#1E293B] mb-1">70%</div>
              <div className="text-sm text-gray-500">Avg Placement Rate</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div>
              <div className="text-4xl font-bold text-[#1E293B] mb-1">3 wks</div>
              <div className="text-sm text-gray-500">Avg Time to Hire</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div>
              <div className="text-4xl font-bold text-[#7C5FF5] mb-1">Free</div>
              <div className="text-sm text-gray-500">For Job Seekers</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-[#FAFBFC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-[#1E293B] mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A complete job search toolkit designed to help you land your next role.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: "Build Professional Resumes",
                description: "AI-powered resume builder with ATS optimization and 100-point scoring.",
              },
              {
                icon: Briefcase,
                title: "Track Job Applications",
                description: "Organize all applications with our stoplight status system. Never lose track.",
              },
              {
                icon: MessageSquare,
                title: "AI Career Coach",
                description: "Get 24/7 personalized guidance from Compass, your AI career assistant.",
              },
              {
                icon: Search,
                title: "Job Board Search",
                description: "Access thousands of jobs with AI-powered matching and one-click apply.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-[#7C5FF5]/50 hover:shadow-lg hover:shadow-[#7C5FF5]/10 transition-all"
              >
                <div className="w-12 h-12 bg-[#F8F7FF] rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-[#7C5FF5]" />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-[#1E293B] mb-6">
              Your path to employment
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four simple steps to go from job seeker to employed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                number: "01",
                title: "Create Your Profile",
                description: "Sign up in 30 seconds. Tell us about your goals and experience.",
              },
              {
                number: "02",
                title: "Build Your Resume",
                description: "Use our AI-powered builder to create a standout resume.",
              },
              {
                number: "03",
                title: "Track & Apply",
                description: "Find jobs, apply, and keep everything organized.",
              },
              {
                number: "04",
                title: "Land the Job",
                description: "Ace interviews and celebrate your success.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#7C5FF5] text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 mx-auto shadow-lg shadow-[#7C5FF5]/30">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#7C5FF5] to-[#6366F1]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands on the waitlist for exclusive early access when we launch in Q2 2027.
          </p>
          <Button
            size="lg"
            asChild
            className="bg-white hover:bg-gray-50 text-[#7C5FF5] rounded-full px-12 h-16 text-lg font-semibold shadow-2xl"
          >
            <Link href="/waitlist">
              Join the Waitlist
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <Image
                src="/branding/1.png"
                alt="Career Forward"
                width={160}
                height={40}
              />
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-[#7C5FF5] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-[#7C5FF5] transition-colors">
                Terms
              </Link>
              <Link href="/faq" className="hover:text-[#7C5FF5] transition-colors">
                FAQ
              </Link>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-gray-500">
            © 2027 Career Forward. Your path to employment.
          </div>
        </div>
      </footer>
    </div>
  );
}
