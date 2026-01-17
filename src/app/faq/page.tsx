"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Rocket,
  Briefcase,
  Users,
  DollarSign,
  Wrench,
  Shield,
  HelpCircle,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import { faqData, searchFAQs, FAQCategory, FAQItem } from "@/data/faqData";

// Map category icons
const categoryIcons: Record<string, React.ElementType> = {
  "getting-started": Rocket,
  "job-seekers": Briefcase,
  "coaches-organizations": Users,
  "pricing-billing": DollarSign,
  "features-tools": Wrench,
  "privacy-security": Shield,
  "technical-support": HelpCircle,
};

// Featured FAQs (most commonly asked)
const featuredFAQIds = [
  "is-it-free",
  "how-much-cost",
  "what-is-career-forward",
  "launch-date",
  "data-security",
  "how-helps-find-job",
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Get search results or filtered by category
  const displayedItems = useMemo(() => {
    if (searchQuery.trim()) {
      return searchFAQs(searchQuery);
    }
    if (selectedCategory) {
      const category = faqData.find((c) => c.id === selectedCategory);
      return category?.items || [];
    }
    return null; // Show categories view
  }, [searchQuery, selectedCategory]);

  // Get featured FAQs
  const featuredFAQs = useMemo(() => {
    const allItems = faqData.flatMap((c) => c.items);
    return featuredFAQIds
      .map((id) => allItems.find((item) => item.id === id))
      .filter(Boolean) as FAQItem[];
  }, []);

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAFBFC]">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl opacity-20 bg-[#2B8A8A]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 bg-[#2B8A8A]" />
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
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-[#2B8A8A] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-gray-600 hover:text-[#2B8A8A] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/signin"
              className="px-4 py-2 bg-[#2B8A8A] text-white text-sm font-medium rounded-lg hover:bg-[#237070] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg shadow-gray-200/50 border border-gray-100 mb-6">
            <Sparkles className="h-4 w-4 text-[#2B8A8A]" />
            <span className="text-sm font-medium text-gray-700">
              Help Center
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked{" "}
            <span className="text-[#2B8A8A]">Questions</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Career Forward. Can&apos;t find
            what you&apos;re looking for?{" "}
            <Link href="/demo" className="text-[#2B8A8A] hover:underline">
              Contact us
            </Link>
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedCategory(null);
              }}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2B8A8A]/20 focus:border-[#2B8A8A] shadow-lg shadow-gray-200/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {searchQuery && displayedItems && (
            <p className="text-center text-gray-500 mt-3">
              {displayedItems.length} result{displayedItems.length !== 1 ? "s" : ""} for &quot;{searchQuery}&quot;
            </p>
          )}
        </motion.div>

        {/* Breadcrumb when in category or search */}
        {(selectedCategory || searchQuery) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <button
              onClick={clearSearch}
              className="inline-flex items-center gap-2 text-[#2B8A8A] hover:underline text-sm font-medium"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to all categories
            </button>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {!displayedItems ? (
            // Categories View
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Featured Questions */}
              <div className="mb-12">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Popular Questions
                </h2>
                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                  {featuredFAQs.map((item, index) => (
                    <FAQAccordionItem
                      key={item.id}
                      item={item}
                      isExpanded={expandedItems.has(item.id)}
                      onToggle={() => toggleItem(item.id)}
                      isLast={index === featuredFAQs.length - 1}
                    />
                  ))}
                </div>
              </div>

              {/* Category Grid */}
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Browse by Category
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {faqData.map((category, index) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    icon={categoryIcons[category.id] || HelpCircle}
                    onClick={() => setSelectedCategory(category.id)}
                    delay={index * 0.05}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            // Search Results or Category Items
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {selectedCategory && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {faqData.find((c) => c.id === selectedCategory)?.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {faqData.find((c) => c.id === selectedCategory)?.description}
                  </p>
                </div>
              )}

              {displayedItems.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden">
                  {displayedItems.map((item, index) => (
                    <FAQAccordionItem
                      key={item.id}
                      item={item}
                      isExpanded={expandedItems.has(item.id)}
                      onToggle={() => toggleItem(item.id)}
                      isLast={index === displayedItems.length - 1}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We couldn&apos;t find any questions matching your search.
                  </p>
                  <button
                    onClick={clearSearch}
                    className="text-[#2B8A8A] font-medium hover:underline"
                  >
                    Clear search and browse categories
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-[#2B8A8A]/5 to-[#2B8A8A]/10 rounded-2xl p-8 border border-[#2B8A8A]/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Our team is here to help. Reach out and we&apos;ll get back to you
              within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2B8A8A] text-white font-semibold rounded-xl shadow-lg shadow-[#2B8A8A]/25 hover:bg-[#237070] transition-all"
              >
                Contact Us
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="mailto:support@careerforward.io"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl border border-gray-200 hover:border-[#2B8A8A] hover:text-[#2B8A8A] transition-all"
              >
                Email Support
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-100 bg-white/80 backdrop-blur-xl mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-gray-500 hover:text-[#2B8A8A]">
                Home
              </Link>
              <Link href="/pricing" className="text-sm text-gray-500 hover:text-[#2B8A8A]">
                Pricing
              </Link>
              <Link href="/faq" className="text-sm text-[#2B8A8A] font-medium">
                FAQ
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-[#2B8A8A]">
                Privacy Policy
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              © 2026 Career Forward. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Category Card Component
function CategoryCard({
  category,
  icon: Icon,
  onClick,
  delay,
}: {
  category: FAQCategory;
  icon: React.ElementType;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className="text-left bg-white rounded-xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 hover:border-[#2B8A8A]/30 hover:shadow-xl transition-all group"
    >
      <div className="w-12 h-12 bg-[#2B8A8A]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#2B8A8A]/20 transition-colors">
        <Icon className="h-6 w-6 text-[#2B8A8A]" />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#2B8A8A] transition-colors">
        {category.title}
      </h3>
      <p className="text-sm text-gray-500 mb-3">{category.description}</p>
      <span className="text-xs text-[#2B8A8A] font-medium">
        {category.items.length} articles
      </span>
    </motion.button>
  );
}

// FAQ Accordion Item Component
function FAQAccordionItem({
  item,
  isExpanded,
  onToggle,
  isLast,
}: {
  item: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  return (
    <div className={!isLast ? "border-b border-gray-100" : ""}>
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{item.question}</span>
        <ChevronDown
          className={`h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-gray-600 leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
