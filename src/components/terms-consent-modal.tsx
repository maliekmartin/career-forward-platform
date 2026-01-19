"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check, FileText, Shield, AlertTriangle, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TermsConsentModalProps {
  isOpen: boolean;
  onComplete: (consents: ConsentRecord) => void;
  onCancel: () => void;
}

export interface ConsentRecord {
  termsAccepted: boolean;
  termsAcceptedAt: string;
  privacyAccepted: boolean;
  privacyAcceptedAt: string;
  acceptableUseAccepted: boolean;
  acceptableUseAcceptedAt: string;
}

type PolicyStep = "terms" | "privacy" | "complete";

// Condensed policy content for the modal
const termsContent = {
  title: "Terms of Service",
  icon: FileText,
  sections: [
    {
      title: "1. Acceptance of Terms",
      content: `By creating an account or using Career Forward, you agree to be bound by these Terms of Service, our Privacy Policy, and Acceptable Use Policy. If you do not agree, you may not use the Service.

You must be at least 18 years old to use Career Forward.`,
    },
    {
      title: "2. AI-Powered Features",
      highlight: true,
      content: `IMPORTANT: Career Forward uses artificial intelligence (AI) technology, including Claude (Anthropic) and similar systems.

• AI features provide suggestions only and may not always be accurate
• You should review all AI-generated content before using it
• Do not rely solely on AI recommendations for career decisions
• Your data may be processed by AI systems to provide personalized features`,
    },
    {
      title: "3. No Employment Guarantee",
      highlight: true,
      content: `IMPORTANT DISCLAIMER: Career Forward does NOT guarantee employment.

Our platform is designed to INCREASE YOUR CHANCES of career success by providing tools and resources. However, employment outcomes depend on many factors beyond our control including job market conditions, your qualifications, and employer decisions.`,
    },
    {
      title: "4. Your Responsibilities",
      content: `• Provide accurate and truthful information
• Keep your account credentials secure
• Use the Service only for legitimate career purposes
• Comply with all applicable laws
• Not misrepresent your qualifications or identity`,
    },
    {
      title: "5. Acceptable Use Policy",
      content: `You agree NOT to:
• Upload false, misleading, or fraudulent content
• Impersonate any person or entity
• Distribute spam, malware, or harmful code
• Attempt to gain unauthorized access
• Violate the rights of others
• Use automated systems without permission

We may suspend or terminate accounts that violate these terms.`,
    },
    {
      title: "6. Intellectual Property",
      content: `Career Forward and its content are owned by Martin Built Strategies LLC. You retain ownership of content you create (resumes, profiles) but grant us a license to store and process it to provide the Service.`,
    },
    {
      title: "7. Disclaimers & Liability",
      content: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES. To the maximum extent permitted by law, Martin Built Strategies LLC shall not be liable for indirect, incidental, or consequential damages.`,
    },
    {
      title: "8. Termination",
      content: `You may close your account at any time. We may suspend or terminate accounts for violations of these Terms. Upon termination, your data will be handled according to our Privacy Policy.`,
    },
    {
      title: "9. Contact",
      content: `Questions? Contact us at support@martinbuiltstrategies.com

By clicking "I Agree" below, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and the Acceptable Use Policy contained herein.`,
    },
  ],
};

const privacyContent = {
  title: "Privacy Policy",
  icon: Shield,
  sections: [
    {
      title: "1. Information We Collect",
      content: `We collect information you provide directly:
• Account info: name, email, phone, password
• Profile info: career goals, work experience, education, skills
• Resume content and job search activity
• Communications with coaches

We also collect automatically:
• Device and browser information
• Usage data and log data
• Cookies and similar technologies`,
    },
    {
      title: "2. How We Use Your Information",
      content: `We use your information to:
• Provide and improve the Service
• Enable career coaching and job tracking features
• Communicate with you about your account
• Analyze usage to improve user experience
• Detect and prevent fraud or abuse`,
    },
    {
      title: "3. AI Data Processing",
      highlight: true,
      content: `Your data may be processed by AI systems (including Claude/Anthropic) to:
• Parse and analyze resume content
• Generate personalized recommendations
• Power job matching and career suggestions

We do not use your personal data to train AI models. All AI processing is performed by trusted providers under strict data protection agreements.`,
    },
    {
      title: "4. How We Share Information",
      content: `We do NOT sell your personal information.

We share data only:
• With coaches you connect with (read-only access)
• With service providers (Affinda, Resend, Vercel)
• When required by law
• In aggregated, de-identified form`,
    },
    {
      title: "5. Data Security",
      content: `We protect your data with:
• HTTPS encryption for data in transit
• Encryption at rest for sensitive fields
• Secure password hashing (bcrypt)
• Role-based access controls
• Regular security assessments`,
    },
    {
      title: "6. Your Rights",
      content: `You have the right to:
• Access and download your data
• Correct inaccurate information
• Delete your account and data
• Opt out of marketing communications
• Request data portability`,
    },
    {
      title: "7. Data Retention",
      content: `We retain your data while your account is active. After deletion:
• Most data is removed within 30 days
• Backups are purged within 90 days
• Some data may be retained for legal compliance`,
    },
    {
      title: "8. Contact",
      content: `For privacy questions or to exercise your rights:
Email: support@martinbuiltstrategies.com

By clicking "I Agree" below, you acknowledge that you have read, understood, and consent to the collection and use of your information as described in this Privacy Policy.`,
    },
  ],
};

export function TermsConsentModal({ isOpen, onComplete, onCancel }: TermsConsentModalProps) {
  const [step, setStep] = useState<PolicyStep>("terms");
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [consents, setConsents] = useState<Partial<ConsentRecord>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("terms");
      setHasScrolledToBottom(false);
      setConsents({});
    }
  }, [isOpen]);

  // Reset scroll tracking when step changes
  useEffect(() => {
    setHasScrolledToBottom(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [step]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Consider "scrolled to bottom" when within 50px of the bottom
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const handleAgree = () => {
    const timestamp = new Date().toISOString();

    if (step === "terms") {
      setConsents(prev => ({
        ...prev,
        termsAccepted: true,
        termsAcceptedAt: timestamp,
        acceptableUseAccepted: true,
        acceptableUseAcceptedAt: timestamp,
      }));
      setStep("privacy");
    } else if (step === "privacy") {
      const finalConsents: ConsentRecord = {
        termsAccepted: true,
        termsAcceptedAt: consents.termsAcceptedAt || timestamp,
        privacyAccepted: true,
        privacyAcceptedAt: timestamp,
        acceptableUseAccepted: true,
        acceptableUseAcceptedAt: consents.acceptableUseAcceptedAt || timestamp,
      };
      onComplete(finalConsents);
    }
  };

  const currentContent = step === "terms" ? termsContent : privacyContent;
  const Icon = currentContent.icon;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onCancel()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2B8A8A]/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-[#2B8A8A]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{currentContent.title}</h2>
                <p className="text-sm text-gray-500">
                  Step {step === "terms" ? "1" : "2"} of 2 — Please read carefully
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <motion.div
              className="h-full bg-[#2B8A8A]"
              initial={{ width: "0%" }}
              animate={{ width: step === "terms" ? "50%" : "100%" }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Scrollable content */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-6 py-4"
          >
            <div className="space-y-6">
              {currentContent.sections.map((section, index) => (
                <div
                  key={index}
                  className={`rounded-xl p-4 ${
                    section.highlight
                      ? "bg-amber-50 border border-amber-200"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {section.highlight && (
                      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    <h3 className={`font-semibold ${section.highlight ? "text-amber-900" : "text-gray-900"}`}>
                      {section.title}
                    </h3>
                  </div>
                  <p className={`text-sm leading-relaxed whitespace-pre-line ${
                    section.highlight ? "text-amber-800" : "text-gray-600"
                  }`}>
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Scroll indicator */}
            {!hasScrolledToBottom && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="sticky bottom-0 left-0 right-0 flex justify-center py-4 pointer-events-none"
              >
                <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200">
                  <ChevronDown className="h-4 w-4 text-gray-500 animate-bounce" />
                  <span className="text-sm text-gray-600">Scroll down to continue</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {hasScrolledToBottom ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="h-4 w-4" />
                    You&apos;ve reviewed this document
                  </span>
                ) : (
                  "Please scroll to read the entire document"
                )}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAgree}
                  disabled={!hasScrolledToBottom}
                  className={`rounded-xl transition-all ${
                    hasScrolledToBottom
                      ? "bg-[#2B8A8A] hover:bg-[#237070] text-white shadow-lg shadow-[#2B8A8A]/25"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {step === "terms" ? "I Agree — Continue to Privacy Policy" : "I Agree — Complete Registration"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
