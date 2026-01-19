"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Sparkles } from "lucide-react";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: `Welcome to Career Forward, a workforce development platform operated by Martin Built Strategies LLC ("Company," "we," "us," or "our"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at careerforward.io and related services (collectively, the "Service").

We are committed to protecting your privacy and handling your data transparently. By accessing or using Career Forward, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with these terms, please do not access or use our Service.

Career Forward is intended for users who are 18 years of age or older. We do not knowingly collect personal information from individuals under 18.`,
  },
  {
    id: "information-collected",
    title: "Information We Collect",
    content: `We collect information that you provide directly to us, information collected automatically, and information from third-party sources.

**Information You Provide:**
• Account information: name, email address, phone number, password
• Profile information: career goals, industry preferences, work experience, education history, skills
• Resume content: work history, education, certifications, skills, achievements
• Job search activity: applications tracked, companies of interest, interview notes
• Communications: messages with coaches, support requests, feedback
• Payment information (organizations only): billing address, payment method details

**Information Collected Automatically:**
• Device information: browser type, operating system, device identifiers
• Usage data: pages visited, features used, time spent on platform
• Log data: IP address, access times, referring URLs
• Cookies and similar technologies: session data, preferences

**Information from Third Parties:**
• Resume parsing services (Affinda): extracted resume data from uploaded documents
• Job board integrations: job listing data from partner job boards
• Authentication providers: if you sign in using third-party services`,
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    content: `We use the information we collect to provide, maintain, and improve our services:

**Service Delivery:**
• Create and manage your account
• Provide career coaching tools and resources
• Enable resume building and job application tracking
• Facilitate communication between job seekers and coaches
• Process transactions and send related information

**Service Improvement:**
• Analyze usage patterns to improve user experience
• Develop new features and functionality
• Debug and fix technical issues
• Conduct research and analytics

**Communication:**
• Send service-related notifications
• Respond to your inquiries and support requests
• Provide updates about Career Forward features
• Send promotional communications (with your consent)

**Safety and Security:**
• Detect, prevent, and address fraud or abuse
• Enforce our terms of service
• Protect the rights and safety of our users
• Comply with legal obligations`,
  },
  {
    id: "ai-processing",
    title: "AI-Powered Features & Data Processing",
    content: `Career Forward uses artificial intelligence (AI) technology to enhance your experience. We want to be transparent about how AI is used with your data.

**AI Technologies Used:**
We integrate with AI systems, including Claude (Anthropic) and similar large language model (LLM) technologies, to power features such as:
• Resume parsing and content analysis
• Personalized career recommendations
• Cover letter generation assistance
• Job matching algorithms
• Interview preparation guidance
• Chatbot and support features

**How Your Data is Processed:**
• Your resume content and profile information may be processed by AI systems to provide personalized recommendations
• AI-generated content is created based on the information you provide
• We do not use your personal data to train AI models
• AI processing is performed by trusted third-party providers under strict data protection agreements

**Your Rights Regarding AI Processing:**
• You can review and edit any AI-generated content before using it
• You may request information about how AI features use your data
• You can opt out of certain AI-powered features through your account settings

**Limitations:**
AI-generated recommendations and content are provided as suggestions only. We encourage you to review all AI outputs for accuracy and appropriateness before use. See our Terms of Service for important disclaimers about AI features and employment outcomes.`,
  },
  {
    id: "data-sharing",
    title: "How We Share Your Information",
    content: `We do not sell your personal information. We share information only in the following circumstances:

**With Your Consent:**
• When you connect with a career coach, they can view your profile, resumes, and progress (read-only)
• When you explicitly authorize sharing with third parties

**Service Providers:**
We share information with trusted third-party service providers who assist in operating our platform:
• Affinda: Resume parsing and data extraction
• Resend: Email delivery services
• Vercel: Hosting and infrastructure
• Payment processors: Secure payment processing

These providers are contractually obligated to use your information only for the services they provide to us.

**Legal Requirements:**
We may disclose information if required by law or in response to valid legal requests, such as court orders or subpoenas.

**Business Transfers:**
In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change.

**Aggregated or De-identified Data:**
We may share aggregated or de-identified information that cannot reasonably be used to identify you.`,
  },
  {
    id: "data-security",
    title: "Data Security",
    content: `We implement industry-standard security measures to protect your personal information:

**Technical Safeguards:**
• HTTPS encryption for all data in transit
• Encryption at rest for sensitive PII fields
• Bcrypt password hashing with high security cost factor
• JWT-based authentication with secure session management
• Rate limiting to prevent brute-force attacks
• Input validation and sanitization

**Administrative Safeguards:**
• Role-based access controls
• Regular security audits and assessments
• Employee training on data protection
• Incident response procedures

**Physical Safeguards:**
• Secure, enterprise-grade hosting infrastructure (Vercel, Vercel Postgres)
• Continuous monitoring and logging
• Regular backups with secure storage

While we strive to protect your information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security.`,
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: `We retain your personal information for as long as necessary to provide our services and fulfill the purposes described in this policy:

**Active Accounts:**
Your data is retained indefinitely while your account remains active.

**Inactive Accounts:**
• 30 days of inactivity: Reminder email sent
• 5 months of inactivity: Final warning email
• 6 months of inactivity: Account archived, resumes emailed to you
• 18 months from archival: Data permanently deleted (except anonymized audit logs)

**Deleted Accounts:**
When you delete your account, your personal data is removed from active systems immediately. Certain records may be retained for up to 12 months for legal compliance purposes, after which they are permanently deleted.

**Organization Data:**
Organizations that cancel maintain access to data for 30 days to export information. After 30 days, accounts transition to read-only mode. Job seekers retain access to their individual accounts.`,
  },
  {
    id: "your-rights",
    title: "Your Rights and Choices",
    content: `You have several rights regarding your personal information:

**Access and Portability:**
• View and download your personal data through Account Settings
• Export resumes, job tracking data, and profile information
• Request a complete copy of your data

**Correction:**
• Update your profile information at any time
• Correct inaccuracies in your data through your dashboard

**Deletion:**
• Delete your account through Account Settings
• Request deletion of specific data elements
• All personal data removed from active systems upon deletion

**Communication Preferences:**
• Opt out of promotional emails
• Manage notification settings
• Control coach communication preferences

**Withdraw Consent:**
• Disconnect from coaches at any time
• Revoke third-party integrations
• Withdraw consent for non-essential data processing

To exercise these rights, access your Account Settings or contact us at support@martinbuiltstrategies.com.`,
  },
  {
    id: "gdpr-ccpa",
    title: "GDPR and CCPA Compliance",
    content: `**General Data Protection Regulation (GDPR) - EU Residents:**

If you are located in the European Economic Area (EEA), you have additional rights under GDPR:
• Right to access your personal data
• Right to rectification of inaccurate data
• Right to erasure ("right to be forgotten")
• Right to restrict processing
• Right to data portability
• Right to object to processing
• Right to withdraw consent
• Right to lodge a complaint with a supervisory authority

Our legal basis for processing includes: consent, contract performance, legitimate interests, and legal obligations.

**California Consumer Privacy Act (CCPA) - California Residents:**

If you are a California resident, you have the following rights:
• Right to know what personal information is collected
• Right to know if personal information is sold or disclosed
• Right to say no to the sale of personal information (we do not sell your data)
• Right to access your personal information
• Right to delete your personal information
• Right to equal service and price (non-discrimination)

To submit a CCPA request, contact us at support@martinbuiltstrategies.com. We will verify your identity before processing requests.`,
  },
  {
    id: "cookies",
    title: "Cookies and Tracking Technologies",
    content: `We use cookies and similar technologies to enhance your experience:

**Essential Cookies:**
Required for basic platform functionality, including authentication and session management. These cannot be disabled.

**Functional Cookies:**
Remember your preferences and settings to provide a personalized experience.

**Analytics Cookies:**
Help us understand how users interact with our platform to improve our services. These may be disabled.

**Managing Cookies:**
You can control cookies through your browser settings. Note that disabling certain cookies may affect platform functionality.

We do not use advertising cookies or engage in targeted advertising based on your activity on other websites.`,
  },
  {
    id: "third-party",
    title: "Third-Party Links and Services",
    content: `Our platform may contain links to third-party websites or integrate with third-party services:

**Job Board Integration:**
When you search for jobs, we display listings from external job boards. Clicking on a job listing may take you to an external site with its own privacy policy.

**Resume Parsing (Affinda):**
When you upload a resume, it is processed by Affinda to extract information. Affinda processes this data according to their privacy policy and our data processing agreement.

**Email Services (Resend):**
Transactional emails are delivered through Resend's secure infrastructure.

We are not responsible for the privacy practices of third-party websites or services. We encourage you to review their privacy policies before providing personal information.`,
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: `Career Forward is intended for users who are 18 years of age or older. We do not knowingly collect personal information from children under 18.

If we learn that we have collected personal information from a child under 18, we will take steps to delete that information as quickly as possible. If you believe we have inadvertently collected information from a child under 18, please contact us immediately at support@martinbuiltstrategies.com.`,
  },
  {
    id: "international",
    title: "International Data Transfers",
    content: `Career Forward is operated from the United States. If you access our Service from outside the United States, your information will be transferred to and processed in the United States.

For users in the EEA, UK, or other regions with data transfer restrictions, we implement appropriate safeguards for international transfers, including:
• Standard contractual clauses approved by the European Commission
• Data processing agreements with service providers
• Compliance with applicable data protection frameworks

By using our Service, you consent to the transfer of your information to the United States and other countries where we or our service providers operate.`,
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.

When we make material changes, we will:
• Post the updated policy on this page with a new "Last Updated" date
• Notify you via email or prominent notice on our platform
• Obtain your consent if required by applicable law

We encourage you to review this Privacy Policy periodically. Your continued use of Career Forward after changes are posted constitutes your acceptance of the updated policy.`,
  },
  {
    id: "contact",
    title: "Contact Us",
    content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

**Martin Built Strategies LLC**
Email: support@martinbuiltstrategies.com
Website: careerforward.io

For GDPR-related inquiries, you may also contact us at support@martinbuiltstrategies.com.

We will respond to your inquiry within 30 days. For California residents exercising CCPA rights, we will respond within 45 days as required by law.`,
  },
];

export default function PrivacyPage() {
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
              href="/faq"
              className="text-sm text-gray-600 hover:text-[#2B8A8A] transition-colors"
            >
              FAQ
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
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg shadow-gray-200/50 border border-gray-100 mb-6">
            <Shield className="h-4 w-4 text-[#2B8A8A]" />
            <span className="text-sm font-medium text-gray-700">
              Your Privacy Matters
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy <span className="text-[#2B8A8A]">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            How we collect, use, and protect your information
          </p>
          <p className="text-sm text-gray-500">
            Last Updated: January 13, 2026
          </p>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 mb-10"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Table of Contents
          </h2>
          <nav className="grid md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 text-gray-600 hover:text-[#2B8A8A] transition-colors py-1"
              >
                <span className="text-sm text-[#2B8A8A] font-medium w-6">
                  {index + 1}.
                </span>
                <span className="text-sm">{section.title}</span>
              </a>
            ))}
          </nav>
        </motion.div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.02 }}
              className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 md:p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 bg-[#2B8A8A]/10 rounded-lg text-[#2B8A8A] text-sm font-semibold">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              <div className="prose prose-gray max-w-none">
                {section.content.split("\n\n").map((paragraph, pIndex) => (
                  <div key={pIndex} className="mb-4 last:mb-0">
                    {paragraph.startsWith("**") ? (
                      <div>
                        {paragraph.split("\n").map((line, lIndex) => {
                          if (line.startsWith("**") && line.endsWith("**")) {
                            return (
                              <h3
                                key={lIndex}
                                className="font-semibold text-gray-900 mt-4 mb-2"
                              >
                                {line.replace(/\*\*/g, "")}
                              </h3>
                            );
                          }
                          if (line.startsWith("• ")) {
                            return (
                              <p
                                key={lIndex}
                                className="text-gray-600 leading-relaxed pl-4"
                              >
                                {line}
                              </p>
                            );
                          }
                          return (
                            <p
                              key={lIndex}
                              className="text-gray-600 leading-relaxed"
                            >
                              {line.replace(/\*\*/g, "")}
                            </p>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-600 leading-relaxed">
                        {paragraph}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-br from-[#2B8A8A]/5 to-[#2B8A8A]/10 rounded-2xl p-8 border border-[#2B8A8A]/20">
            <Sparkles className="h-8 w-8 text-[#2B8A8A] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Questions about your privacy?
            </h2>
            <p className="text-gray-600 mb-6">
              We&apos;re here to help. Contact our privacy team for any questions
              or concerns.
            </p>
            <a
              href="mailto:support@martinbuiltstrategies.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2B8A8A] text-white font-semibold rounded-xl shadow-lg shadow-[#2B8A8A]/25 hover:bg-[#237070] transition-all"
            >
              Contact Privacy Team
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-100 bg-white/80 backdrop-blur-xl mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-[#2B8A8A]"
              >
                Home
              </Link>
              <Link
                href="/pricing"
                className="text-sm text-gray-500 hover:text-[#2B8A8A]"
              >
                Pricing
              </Link>
              <Link
                href="/faq"
                className="text-sm text-gray-500 hover:text-[#2B8A8A]"
              >
                FAQ
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-[#2B8A8A] font-medium"
              >
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
