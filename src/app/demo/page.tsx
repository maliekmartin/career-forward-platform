"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  FileText,
  Target,
  MessageSquare,
  Briefcase,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI-Powered Resume Builder",
    description: "Create professional, ATS-optimized resumes in minutes with our intelligent builder.",
  },
  {
    icon: Briefcase,
    title: "Job Application Tracker",
    description: "Never lose track of an application. Organize and manage your entire job search.",
  },
  {
    icon: MessageSquare,
    title: "AI Career Coach",
    description: "Get personalized guidance 24/7 from Compass, your AI-powered career assistant.",
  },
  {
    icon: Target,
    title: "Interview Preparation",
    description: "Practice common questions and get tips to ace your next interview.",
  },
];

const demoSteps = [
  {
    step: "1",
    title: "Create Your Profile",
    description: "Sign up in seconds and tell us about your career goals.",
  },
  {
    step: "2",
    title: "Build Your Resume",
    description: "Use our AI-powered builder to create a standout resume.",
  },
  {
    step: "3",
    title: "Track Applications",
    description: "Apply to jobs and keep everything organized in one place.",
  },
  {
    step: "4",
    title: "Land Your Job",
    description: "Get interview tips, practice questions, and land your dream role.",
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/branding/logo.svg"
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
            <Button size="sm" asChild className="bg-[#7C5FF5] hover:bg-[#7C5FF5]/90 text-white">
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-padding px-6 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-[#7C5FF5]/10 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="h-4 w-4 text-[#7C5FF5]" />
              <span className="text-sm font-semibold text-[#7C5FF5]">Platform Demo</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-[#0F172A] mb-6"
            >
              See Career Forward
              <br />
              <span className="text-[#7C5FF5]">in Action</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-8"
            >
              Watch how Career Forward helps job seekers build resumes, track applications, and land their dream jobs — all for free.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button size="lg" asChild className="bg-[#7C5FF5] hover:bg-[#7C5FF5]/90 text-white rounded-full px-8 h-14">
                <Link href="/waitlist">
                  Join the Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full px-8 h-14">
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Demo Video Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white"
          >
            <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/hero-b2c.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A complete job search toolkit, completely free for job seekers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[#7C5FF5]/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-[#7C5FF5]" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
              Your Path to Employment
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four simple steps to go from job seeker to employed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {demoSteps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#7C5FF5] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding px-6 bg-[#7C5FF5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">100-Point</div>
              <div className="text-white/80">Career Forward Score</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">5-Stage</div>
              <div className="text-white/80">Career Pathway</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80">AI Career Coach</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands on the waitlist for exclusive early access when we launch in Q2 2027.
          </p>
          <Button size="lg" asChild className="bg-[#7C5FF5] hover:bg-[#D97706] text-white rounded-full px-10 h-16 text-lg">
            <Link href="/waitlist">
              Join the Waitlist
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
