"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Target, Users, ArrowRight, Sparkles } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/career-forward-logo.png"
              alt="Career Forward"
              width={220}
              height={55}
              priority
            />
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Get Started</h1>
          <p className="text-gray-600 text-lg">Choose how you'd like to use Career Forward</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Job Seeker Option */}
          <Link href="/register/seeker">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#2B8A8A] text-left transition-all shadow-sm hover:shadow-xl group cursor-pointer h-full relative overflow-hidden"
            >
              {/* Free badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#2B8A8A]/10 text-[#2B8A8A] text-xs font-semibold px-3 py-1 rounded-full">
                <Sparkles className="h-3 w-3" />
                Free Forever
              </div>

              <div className="w-14 h-14 bg-[#2B8A8A]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#2B8A8A] transition-colors">
                <Target className="h-7 w-7 text-[#2B8A8A] group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">I'm a Job Seeker</h2>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Build resumes, track applications, and land your dream job. All the tools you need, completely free.
              </p>
              <div className="flex items-center text-[#2B8A8A] font-semibold text-sm">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>

          {/* Organization Option */}
          <Link href="/register/coach">
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#374151] text-left transition-all shadow-sm hover:shadow-xl group cursor-pointer h-full"
            >
              <div className="w-14 h-14 bg-[#374151]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#374151] transition-colors">
                <Users className="h-7 w-7 text-[#374151] group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">I'm a Coach / Organization</h2>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Manage caseloads, track outcomes, and empower your job seekers with real-time visibility.
              </p>
              <div className="flex items-center text-[#374151] font-semibold text-sm">
                Get started
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </Link>
        </div>

        <p className="text-center text-sm text-gray-500 mt-10">
          Already have an account?{" "}
          <Link href="/signin" className="text-[#2B8A8A] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
