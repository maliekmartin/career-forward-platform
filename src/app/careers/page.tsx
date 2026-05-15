"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Briefcase } from "lucide-react";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-[#7C5FF5]/10 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex h-20 items-center justify-between px-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/branding/1.png"
              alt="Career Forward"
              width={180}
              height={50}
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-[#7C5FF5] transition-colors">
              About Us
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-[#7C5FF5] transition-colors">
              Contact
            </Link>
            <Link href="/careers" className="text-sm font-medium text-[#7C5FF5] transition-colors">
              Careers
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="sm"
              asChild
              className="bg-[#7C5FF5] hover:bg-[#6B4FE4] text-white rounded-full px-8 h-11 shadow-lg shadow-[#7C5FF5]/30"
            >
              <Link href="/waitlist">Join Waitlist</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F3E8FF] via-white to-[#E9D5FF]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,95,245,0.08),transparent_60%)]" />

        <div className="max-w-4xl mx-auto px-8 relative z-10 text-center py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA] text-white rounded-full px-5 py-2.5 mb-8 shadow-lg shadow-[#7C5FF5]/30">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-semibold">Join Our Mission</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 leading-tight">
              Are you interested in changing the way job seekers{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA]">
                engage in the market?
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Career Forward is powered and built by Martin Built Strategies. We're building the future of workforce development, and we'd love to hear from you.
            </p>

            <Button
              size="lg"
              asChild
              className="bg-[#7C5FF5] hover:bg-[#6B4FE4] text-white rounded-full px-12 h-16 text-lg font-semibold shadow-2xl shadow-[#7C5FF5]/30 hover:scale-105 transition-all"
            >
              <a href="mailto:support@martinbuiltstrategies.com">
                <Mail className="mr-3 h-5 w-5" />
                Get in Touch
              </a>
            </Button>

            <p className="text-sm text-gray-500 mt-6">
              Email us at{" "}
              <a
                href="mailto:support@martinbuiltstrategies.com"
                className="text-[#7C5FF5] hover:underline font-medium"
              >
                support@martinbuiltstrategies.com
              </a>
            </p>
          </motion.div>

          {/* Martin Built Strategies Credit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 pt-12 border-t border-[#7C5FF5]/20"
          >
            <p className="text-sm text-gray-600 mb-4">
              Powered and Built by
            </p>
            <a
              href="https://martinbuiltstrategies.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA] hover:opacity-80 transition-opacity">
                Martin Built Strategies
              </p>
            </a>
            <p className="text-sm text-gray-500 mt-2">
              Consulting • Software Development • Business Strategy
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#F3E8FF] to-white border-t border-[#7C5FF5]/10 py-16">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div className="md:col-span-1">
              <Image
                src="/branding/1.png"
                alt="Career Forward"
                width={210}
                height={60}
                className="mb-4"
              />
              <p className="text-[#7C5FF5] font-semibold text-lg mb-3">
                Your Path to Employment
              </p>
              <p className="text-xs text-gray-500 mt-4">
                Powered by Martin Built Strategies
              </p>
            </div>

            <div>
              <h3 className="text-gray-900 font-bold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-gray-900 font-bold mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-600 hover:text-[#7C5FF5] transition-colors text-sm">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#7C5FF5]/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Career Forward. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-600">Launching Q2 2027</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
