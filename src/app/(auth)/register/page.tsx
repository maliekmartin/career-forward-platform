"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Target, ArrowRight, Sparkles } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
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
          <h1 className="text-4xl font-bold text-[#0F172A] mb-3">Get Started</h1>
          <p className="text-gray-600 text-lg">Start your journey to career success</p>
        </div>

        {/* Job Seeker Option - Now the only option */}
        <Link href="/register/seeker">
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#0D9488] text-left transition-all shadow-sm hover:shadow-xl group cursor-pointer relative overflow-hidden"
          >
            {/* Free badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#0D9488]/10 text-[#0D9488] text-xs font-semibold px-3 py-1 rounded-full">
              <Sparkles className="h-3 w-3" />
              Free Forever
            </div>

            <div className="w-14 h-14 bg-[#0D9488]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0D9488] transition-colors">
              <Target className="h-7 w-7 text-[#0D9488] group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-2">Create Your Account</h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Build resumes, track applications, and land your dream job. All the tools you need, completely free.
            </p>
            <div className="flex items-center text-[#0D9488] font-semibold text-sm">
              Get started free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </Link>

        <p className="text-center text-sm text-gray-500 mt-10">
          Already have an account?{" "}
          <Link href="/signin" className="text-[#0D9488] hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
