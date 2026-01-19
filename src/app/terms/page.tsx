"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FileText, ArrowRight, Sparkles, AlertTriangle, Bot, Shield, Users, CreditCard, Scale } from "lucide-react";

const sections = [
  {
    id: "introduction",
    title: "Introduction & Acceptance",
    icon: FileText,
    content: `Welcome to Career Forward, a workforce development platform operated by Martin Built Strategies LLC ("Company," "we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of the Career Forward platform at careerforward.io and related services (collectively, the "Service").

By creating an account, accessing, or using Career Forward, you agree to be bound by these Terms, our Privacy Policy, and any additional terms that may apply. If you do not agree to these Terms, you may not access or use the Service.

**Eligibility:**
You must be at least 18 years old to use Career Forward. By using the Service, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these Terms.

**Account Registration:**
To access certain features, you must create an account with accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.`,
  },
  {
    id: "ai-disclosure",
    title: "AI-Powered Features Disclosure",
    icon: Bot,
    highlight: true,
    content: `**IMPORTANT: Career Forward uses artificial intelligence (AI) technology to enhance your experience.**

Career Forward integrates AI-powered features, including but not limited to systems powered by Claude (Anthropic) and similar large language model (LLM) technologies. These AI features are used to:

• Parse and analyze resume content
• Generate personalized career suggestions
• Provide job matching recommendations
• Assist with cover letter creation
• Offer interview preparation guidance
• Power chatbot and support features

**By using Career Forward, you acknowledge and agree that:**

1. **AI Limitations:** AI-generated content and recommendations are provided as suggestions only and may not always be accurate, complete, or appropriate for your specific situation. You should always review and verify AI-generated content before using it.

2. **Data Processing:** Your data may be processed by AI systems to provide personalized features. We implement appropriate safeguards to protect your information in accordance with our Privacy Policy.

3. **No Reliance:** You should not rely solely on AI-generated recommendations for important career decisions. AI features are tools to assist you, not replace professional judgment or human career counseling.

4. **Continuous Improvement:** AI features may evolve and change over time as we improve our technology and services.`,
  },
  {
    id: "no-guarantee",
    title: "No Employment Guarantee",
    icon: AlertTriangle,
    highlight: true,
    content: `**IMPORTANT DISCLAIMER: CAREER FORWARD DOES NOT GUARANTEE EMPLOYMENT.**

While Career Forward provides tools, resources, and support designed to improve your job search outcomes, we make no promises, guarantees, or warranties regarding:

• Your ability to find employment
• The time it will take to secure a job
• The type, quality, or compensation of any job obtained
• Interview requests or job offers
• Career advancement or success

**Understanding the Service:**
Career Forward is designed to **increase your chances** of career success by providing:
• Professional resume building tools
• Job application tracking and organization
• Career coaching connections
• Interview preparation resources
• Job search strategy guidance

**Your success depends on many factors** beyond our control, including but not limited to:
• Current job market conditions
• Your qualifications and experience
• Geographic location and industry
• Your effort and engagement with the job search process
• Decisions made by potential employers

By using Career Forward, you acknowledge that employment outcomes are not guaranteed and that you use the Service at your own discretion and risk.`,
  },
  {
    id: "user-responsibilities",
    title: "User Responsibilities",
    icon: Users,
    content: `As a Career Forward user, you agree to:

**Provide Accurate Information:**
• Submit truthful and accurate information in your profile, resumes, and applications
• Keep your account information current and up-to-date
• Not misrepresent your qualifications, experience, or identity

**Use the Service Appropriately:**
• Use Career Forward only for legitimate career development purposes
• Respect the intellectual property rights of others
• Not use the Service to harass, spam, or harm other users
• Not attempt to gain unauthorized access to the Service or other user accounts

**Protect Your Account:**
• Maintain the security of your login credentials
• Notify us immediately of any unauthorized access to your account
• Not share your account with others or allow others to access it

**Comply with Laws:**
• Use the Service in compliance with all applicable laws and regulations
• Not use the Service for any illegal or unauthorized purpose`,
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use Policy",
    icon: Shield,
    content: `You agree not to use Career Forward to:

**Prohibited Activities:**
• Upload false, misleading, or fraudulent content
• Impersonate any person or entity
• Harvest or collect information about other users
• Distribute spam, malware, or harmful code
• Interfere with the proper functioning of the Service
• Attempt to reverse engineer or decompile the Service
• Use automated systems or bots without our permission
• Violate the rights of others, including intellectual property rights

**Content Standards:**
All content you submit must:
• Be accurate and truthful
• Not contain offensive, discriminatory, or inappropriate material
• Not infringe on any third-party rights
• Comply with all applicable laws

**Enforcement:**
We reserve the right to:
• Remove content that violates these Terms
• Suspend or terminate accounts for violations
• Report illegal activity to appropriate authorities
• Take any action we deem necessary to protect the Service and its users`,
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    icon: FileText,
    content: `**Our Intellectual Property:**
Career Forward, including its design, features, content, and technology, is owned by Martin Built Strategies LLC and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission.

**Your Content:**
You retain ownership of the content you create and upload to Career Forward (such as resumes and profile information). By uploading content, you grant us a limited license to:
• Store, display, and process your content to provide the Service
• Use anonymized, aggregated data for analytics and improvement purposes

This license ends when you delete your content or close your account, except for:
• Backup copies retained for a reasonable period
• Content shared with coaches (until they remove it)
• Aggregated or anonymized data that cannot identify you

**Feedback:**
Any feedback, suggestions, or ideas you provide about Career Forward may be used by us without compensation or attribution to you.`,
  },
  {
    id: "subscription-terms",
    title: "Subscription Terms (Organizations)",
    icon: CreditCard,
    content: `**For Coaches and Organizations:**
Certain features require a paid subscription. By subscribing, you agree to:

**Billing:**
• Provide accurate billing information
• Pay all fees associated with your subscription plan
• Authorize recurring charges based on your billing cycle

**Plan Changes:**
• You may upgrade or downgrade your plan at any time
• Changes take effect at the start of your next billing cycle
• Downgrades may result in loss of access to certain features

**Cancellation:**
• You may cancel your subscription at any time
• Access continues until the end of your current billing period
• No refunds for partial billing periods unless required by law

**Price Changes:**
• We may change subscription prices with 30 days' notice
• Continued use after price changes constitutes acceptance

**Free Tier for Job Seekers:**
Job seekers can use Career Forward at no cost. We reserve the right to modify free tier features with reasonable notice.`,
  },
  {
    id: "disclaimers",
    title: "Disclaimers & Limitations",
    icon: Scale,
    content: `**Disclaimer of Warranties:**
THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
• Merchantability and fitness for a particular purpose
• Accuracy, reliability, or completeness of content
• Uninterrupted or error-free operation
• Security or freedom from viruses or harmful components

**Limitation of Liability:**
TO THE MAXIMUM EXTENT PERMITTED BY LAW, MARTIN BUILT STRATEGIES LLC SHALL NOT BE LIABLE FOR:
• Any indirect, incidental, special, consequential, or punitive damages
• Loss of profits, data, or business opportunities
• Damages arising from your use or inability to use the Service
• Actions or content of third parties

Our total liability shall not exceed the greater of: (a) the amount you paid us in the past 12 months, or (b) $100.

**Indemnification:**
You agree to indemnify and hold harmless Martin Built Strategies LLC from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.`,
  },
  {
    id: "termination",
    title: "Termination",
    content: `**Your Right to Terminate:**
You may close your account and stop using Career Forward at any time through your account settings or by contacting us.

**Our Right to Terminate:**
We may suspend or terminate your account if you:
• Violate these Terms or our Acceptable Use Policy
• Engage in fraudulent or illegal activity
• Fail to pay subscription fees (for paid accounts)
• Pose a risk to other users or the Service

**Effect of Termination:**
Upon termination:
• Your access to the Service will be revoked
• Your data will be handled according to our Privacy Policy
• Provisions that should survive termination will remain in effect

**Data After Termination:**
We will retain your data for a reasonable period after termination as described in our Privacy Policy. You may request deletion of your data in accordance with applicable laws.`,
  },
  {
    id: "changes",
    title: "Changes to Terms",
    content: `We may update these Terms from time to time to reflect changes in our practices, technology, or legal requirements.

**Notification:**
• Material changes will be communicated via email or prominent notice on the Service
• We will provide at least 30 days' notice before significant changes take effect

**Acceptance:**
• Continued use of the Service after changes take effect constitutes acceptance
• If you do not agree to updated Terms, you should stop using the Service and close your account

**Review:**
We encourage you to periodically review these Terms to stay informed about your rights and obligations.`,
  },
  {
    id: "general",
    title: "General Provisions",
    content: `**Governing Law:**
These Terms are governed by the laws of the State of Washington, without regard to conflict of law principles.

**Dispute Resolution:**
Any disputes arising from these Terms or your use of the Service shall be resolved through binding arbitration in Spokane County, Washington, except where prohibited by law.

**Severability:**
If any provision of these Terms is found unenforceable, the remaining provisions will continue in effect.

**Entire Agreement:**
These Terms, together with our Privacy Policy, constitute the entire agreement between you and Martin Built Strategies LLC regarding the Service.

**No Waiver:**
Our failure to enforce any right or provision does not constitute a waiver of that right or provision.

**Assignment:**
You may not assign your rights under these Terms. We may assign our rights to any successor or affiliate.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have questions about these Terms of Service, please contact us:

**Martin Built Strategies LLC**
Email: legal@careerforward.io
Support: support@careerforward.io

For privacy-related inquiries, please see our Privacy Policy or contact privacy@careerforward.io.

**Effective Date:** January 2026
**Last Updated:** January 2026`,
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl opacity-20 bg-[#2B8A8A]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 bg-[#2B8A8A]" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
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
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2B8A8A]/10 to-[#2B8A8A]/5 rounded-full border border-[#2B8A8A]/20">
            <Sparkles className="h-4 w-4 text-[#2B8A8A]" />
            <span className="text-[#2B8A8A] text-sm font-semibold">Launching Q3 2026</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg shadow-gray-200/50 border border-gray-100 mb-6"
          >
            <FileText className="h-4 w-4 text-[#2B8A8A]" />
            <span className="text-sm font-medium text-gray-700">Legal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Terms of Service
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            Please read these terms carefully before using Career Forward. By accessing or using our platform, you agree to be bound by these terms.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 text-sm text-gray-500"
          >
            <span>Effective: January 2026</span>
            <span className="hidden sm:inline">•</span>
            <span>Last Updated: January 2026</span>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 px-6 border-y border-gray-100 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Navigation</h2>
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all hover:shadow-md ${
                  section.highlight
                    ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                    : "bg-white border-gray-200 text-gray-600 hover:border-[#2B8A8A] hover:text-[#2B8A8A]"
                }`}
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`rounded-2xl p-8 ${
                section.highlight
                  ? "bg-amber-50 border-2 border-amber-200"
                  : "bg-white border border-gray-100 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-4 mb-6">
                {section.icon && (
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    section.highlight ? "bg-amber-100" : "bg-[#2B8A8A]/10"
                  }`}>
                    <section.icon className={`h-6 w-6 ${section.highlight ? "text-amber-600" : "text-[#2B8A8A]"}`} />
                  </div>
                )}
                <h2 className={`text-2xl font-bold ${section.highlight ? "text-amber-900" : "text-gray-900"}`}>
                  {section.title}
                </h2>
              </div>
              <div className={`prose prose-gray max-w-none ${section.highlight ? "prose-amber" : ""}`}>
                {section.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 text-gray-600 leading-relaxed whitespace-pre-line">
                    {paragraph.split('**').map((part, j) =>
                      j % 2 === 1 ? <strong key={j} className={section.highlight ? "text-amber-900" : "text-gray-900"}>{part}</strong> : part
                    )}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Have Questions?</h2>
          <p className="text-gray-600 mb-8">
            If you have any questions about these Terms of Service, please don&apos;t hesitate to contact us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-700 font-medium hover:border-[#2B8A8A] hover:text-[#2B8A8A] transition-all"
            >
              View Privacy Policy
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#2B8A8A] rounded-full text-white font-medium hover:bg-[#237070] transition-all shadow-lg shadow-[#2B8A8A]/25"
            >
              View FAQ
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Career Forward. All Rights Reserved.</p>
          <p>A Martin Built Strategies Product</p>
        </div>
      </footer>
    </div>
  );
}
