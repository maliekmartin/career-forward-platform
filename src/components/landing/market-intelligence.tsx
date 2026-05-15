"use client";

import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Lock, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import marketData from "@/../public/data/market-data.json";

export function MarketIntelligence() {
  const region = marketData.regions.washington;
  const data = region.topGrowing; // Show fastest growing careers
  const previewCount = 5; // Show 5 careers

  return (
    <section id="market-data" className="relative py-24 overflow-hidden bg-white">
      <div className="max-w-4xl mx-auto px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C5FF5] to-[#A78BFA] text-white rounded-full px-5 py-2.5 mb-6 shadow-lg shadow-[#7C5FF5]/30"
          >
            <Sparkles className="w-4 h-4" />
            <a
              href="https://lightcast.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold hover:underline"
            >
              Powered by Lightcast
            </a>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
          >
            Real-Time Market{" "}
            <span className="text-[#7C5FF5]">Intelligence</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Get instant access to comprehensive labor market data and salary insights to make smarter career decisions.
          </motion.p>
        </div>

        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#F3E8FF] to-white border border-[#7C5FF5]/20 rounded-3xl p-8 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[#7C5FF5]" />
            <h3 className="text-xl font-bold text-gray-900">
              Fastest Growing Careers in Washington
            </h3>
          </div>

          {/* Free Preview Items */}
          <div className="space-y-3 mb-6">
            {data.slice(0, previewCount).map((occ, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-400">#{i + 1}</span>
                    <div className="text-sm font-semibold text-gray-900">
                      {occ.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>${occ.salary.median.toLocaleString()}/yr</span>
                    </div>
                    <span className="text-green-600 font-medium">
                      +{occ.employment.changePercent}% growth
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Locked Content Preview */}
          <div className="relative mb-6">
            {/* Blurred preview */}
            <div className="space-y-3 blur-[6px] pointer-events-none select-none opacity-40">
              {data.slice(previewCount, previewCount + 2).map((occ, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl border border-gray-100"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-gray-400">#{previewCount + i + 1}</span>
                      <div className="text-sm font-semibold text-gray-900">
                        {occ.title}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      ${occ.salary.median.toLocaleString()}/yr
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Overlay with CTA */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-white/95 via-white/80 to-transparent">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#7C5FF5] rounded-full shadow-lg shadow-[#7C5FF5]/30">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-br from-[#7C5FF5] to-[#A78BFA] rounded-2xl p-8 text-white">
            <h4 className="text-xl font-bold mb-2">
              Unlock Complete Market Insights
            </h4>
            <p className="mb-6 text-white/90 text-sm">
              Join early access to explore all {region.summary.totalOccupations} careers with detailed salary data, growth projections, and demand trends.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white hover:bg-white/90 text-[#7C5FF5] rounded-full px-10 h-12 text-base font-semibold shadow-lg hover:scale-105 transition-all"
            >
              <Link href="/waitlist">
                Join Waitlist for Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-xs text-white/70 mt-4">
              Limited early access spots available
            </p>
          </div>
        </motion.div>

        {/* Data Attribution - Lightcast Compliance */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold">
                Data Source:{" "}
                <a
                  href="https://lightcast.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7C5FF5] hover:underline"
                >
                  Lightcast
                </a>
              </span>{" "}
              • Last updated: {new Date(marketData.lastUpdated).toLocaleDateString()}
            </p>
          </div>
          <p className="text-xs text-gray-500 max-w-2xl mx-auto">
            © {new Date().getFullYear()} Lightcast. Labor market data provided by Lightcast.
            Career Forward does not claim ownership of this data and presents it for informational purposes only.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
