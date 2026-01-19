"use client";

import { useState, useEffect } from "react";
import { TermsConsentModal, ConsentRecord } from "@/components/terms-consent-modal";

interface ConsentGateProps {
  children: React.ReactNode;
  userEmail?: string;
}

/**
 * ConsentGate component that ensures users have accepted Terms & Privacy Policy
 * before accessing the app. This should wrap protected app routes.
 *
 * Usage in layout.tsx:
 * <ConsentGate userEmail={session?.user?.email}>
 *   {children}
 * </ConsentGate>
 */
export function ConsentGate({ children, userEmail }: ConsentGateProps) {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);

  useEffect(() => {
    // Check if user has consented
    if (userEmail) {
      const consentData = localStorage.getItem(`cf_consent_${userEmail}`);
      if (consentData) {
        try {
          const consent = JSON.parse(consentData) as ConsentRecord;
          // Verify all consents are present and accepted
          if (consent.termsAccepted && consent.privacyAccepted) {
            setHasConsented(true);
            return;
          }
        } catch {
          // Invalid consent data
        }
      }
      // No valid consent found - show modal
      setHasConsented(false);
      setShowConsentModal(true);
    } else {
      // No user email - check for general demo consent
      const demoConsent = localStorage.getItem("cf_demo_consent");
      if (demoConsent) {
        setHasConsented(true);
      } else {
        setHasConsented(false);
        setShowConsentModal(true);
      }
    }
  }, [userEmail]);

  const handleConsentComplete = (consents: ConsentRecord) => {
    // Store consent
    if (userEmail) {
      localStorage.setItem(`cf_consent_${userEmail}`, JSON.stringify(consents));
    } else {
      localStorage.setItem("cf_demo_consent", JSON.stringify(consents));
    }
    setHasConsented(true);
    setShowConsentModal(false);
  };

  // Still loading consent status
  if (hasConsented === null) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2B8A8A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // User has consented - show children
  if (hasConsented) {
    return <>{children}</>;
  }

  // User hasn't consented - show modal (blocking)
  return (
    <>
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Terms & Privacy Review Required</h2>
          <p className="text-gray-600 mb-4">Please review and accept our terms to continue.</p>
          <button
            onClick={() => setShowConsentModal(true)}
            className="px-6 py-3 bg-[#2B8A8A] text-white rounded-xl font-medium hover:bg-[#237070] transition-colors"
          >
            Review Terms
          </button>
        </div>
      </div>
      <TermsConsentModal
        isOpen={showConsentModal}
        onComplete={handleConsentComplete}
        onCancel={() => {
          // Can't cancel - they must accept to use the platform
          // Just close the modal but keep blocking
          setShowConsentModal(false);
        }}
      />
    </>
  );
}
