"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  return (
    <div ref={containerRef} className="bg-[#0A0A0A] text-white overflow-hidden">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto flex h-20 items-center justify-between px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/branding/1.png"
              alt="Career Forward"
              width={180}
              height={45}
              priority
              className="brightness-0 invert"
            />
          </Link>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white/70 hover:text-white hover:bg-white/5"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-[#7C5FF5] hover:bg-[#6B4FE4] text-white rounded-full px-8 h-11 shadow-2xl shadow-[#7C5FF5]/40"
            >
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero - Massive Asymmetric Text */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C5FF5]/20 via-transparent to-[#6366F1]/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(124,95,245,0.15),transparent_50%)]" />

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 max-w-[1600px] mx-auto px-8 w-full"
        >
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left: Massive text */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-xl">
                  <div className="w-2 h-2 bg-[#7C5FF5] rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-white/80">Launching Q2 2027</span>
                </div>
                <h1 className="text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] mb-8">
                  Land your
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA]">
                    dream job
                  </span>
                  <br />
                  faster
                </h1>
                <p className="text-xl text-white/60 mb-12 max-w-lg leading-relaxed">
                  Build resumes, track applications, ace interviews. All in one place. Completely free.
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    asChild
                    className="bg-[#7C5FF5] hover:bg-[#6B4FE4] text-white rounded-full px-10 h-14 text-base shadow-2xl shadow-[#7C5FF5]/50 hover:shadow-[#7C5FF5]/70 transition-all hover:scale-105"
                  >
                    <Link href="/waitlist">
                      Join Waitlist
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="rounded-full px-10 h-14 text-base border-white/20 text-white hover:bg-white/5"
                  >
                    <Link href="/demo">Watch Demo</Link>
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Right: Floating stats */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-12 -left-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                  <div className="text-5xl font-bold text-white mb-2">70%</div>
                  <div className="text-sm text-white/60">Placement Rate</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-32 -right-8 bg-gradient-to-br from-[#7C5FF5]/20 to-[#6366F1]/20 backdrop-blur-xl border border-[#7C5FF5]/30 rounded-3xl p-8 shadow-2xl"
                >
                  <div className="text-5xl font-bold text-white mb-2">3 wks</div>
                  <div className="text-sm text-white/60">Time to Hire</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-64 left-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
                >
                  <div className="text-5xl font-bold text-[#7C5FF5] mb-2">Free</div>
                  <div className="text-sm text-white/60">For Job Seekers</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/40 text-sm flex flex-col items-center gap-2"
          >
            <span>Scroll to explore</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Feature 1: Resume Builder - Diagonal Split */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-bl from-[#7C5FF5]/10 to-transparent" />
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block bg-[#7C5FF5]/20 border border-[#7C5FF5]/30 rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-medium text-[#7C5FF5]">01 — Resume Builder</span>
              </div>
              <h2 className="text-6xl font-bold mb-6 leading-tight">
                Build resumes that
                <br />
                <span className="text-[#7C5FF5]">get noticed</span>
              </h2>
              <p className="text-xl text-white/60 mb-8 leading-relaxed">
                AI-powered resume builder with ATS optimization. 100-point scoring system tells you exactly what to improve.
              </p>
              <ul className="space-y-4">
                {["ATS-optimized templates", "Real-time scoring", "AI suggestions", "Multiple versions"].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-white/80"
                  >
                    <div className="w-1.5 h-1.5 bg-[#7C5FF5] rounded-full" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
              whileInView={{ opacity: 1, rotate: -3, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl transform rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[4/5] bg-white/5 rounded-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature 2: Job Tracker - Reverse Layout */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/10 to-transparent" />
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, rotate: 5, scale: 0.9 }}
              whileInView={{ opacity: 1, rotate: 3, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 shadow-2xl transform rotate-[3deg] hover:rotate-0 transition-transform duration-500">
                <div className="aspect-video bg-white/5 rounded-2xl" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="inline-block bg-[#6366F1]/20 border border-[#6366F1]/30 rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-medium text-[#6366F1]">02 — Job Tracker</span>
              </div>
              <h2 className="text-6xl font-bold mb-6 leading-tight">
                Never lose track
                <br />
                <span className="text-[#6366F1]">of an opportunity</span>
              </h2>
              <p className="text-xl text-white/60 mb-8 leading-relaxed">
                Organize applications with our stoplight status system. See everything at a glance.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm text-white/60">Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-sm text-white/60">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-sm text-white/60">Closed</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature 3: AI Coach - Center Spotlight */}
      <section className="relative py-60 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,95,245,0.2),transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-[#7C5FF5]/20 border border-[#7C5FF5]/30 rounded-full px-4 py-2 mb-8">
              <span className="text-sm font-medium text-[#7C5FF5]">03 — AI Career Coach</span>
            </div>
            <h2 className="text-7xl font-bold mb-8 leading-tight">
              Your personal
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA]">
                AI career coach
              </span>
            </h2>
            <p className="text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              Meet Compass. Get personalized guidance 24/7—resume feedback, interview tips, career strategies.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-12 h-14 text-base backdrop-blur-xl"
            >
              <Link href="/demo">See how it works</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Full bleed purple */}
      <section className="relative py-40 bg-gradient-to-br from-[#7C5FF5] to-[#6366F1]">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-7xl font-bold text-white mb-8 leading-tight">
              Ready to start?
            </h2>
            <p className="text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
              Join thousands on the waitlist for exclusive early access.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white hover:bg-white/90 text-[#7C5FF5] rounded-full px-16 h-16 text-lg font-semibold shadow-2xl hover:scale-105 transition-transform"
            >
              <Link href="/waitlist">
                Join the Waitlist
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <Image
              src="/branding/1.png"
              alt="Career Forward"
              width={160}
              height={40}
              className="brightness-0 invert opacity-60"
            />
            <div className="flex items-center gap-8 text-sm text-white/40">
              <Link href="/privacy" className="hover:text-white/80 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white/80 transition-colors">
                Terms
              </Link>
              <Link href="/faq" className="hover:text-white/80 transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
