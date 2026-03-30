"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Linkedin, Globe, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResumeBuilder } from "../context/resume-builder-context";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export function ContactInfoStep() {
  const { state, updateContactInfo } = useResumeBuilder();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { contactInfo } = state.data;
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Pre-fill from user profile on first load
  useEffect(() => {
    if (!contactInfo.firstName && !contactInfo.email) {
      loadProfileData();
    }
  }, []);

  const loadProfileData = async () => {
    setIsLoadingProfile(true);
    try {
      const response = await fetch("/api/user");
      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        const profile = user?.profile;

        if (profile || user) {
          updateContactInfo({
            firstName: profile?.firstName || "",
            lastName: profile?.lastName || "",
            email: user?.email || "",
            phone: profile?.phone || "",
          });
        }
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const inputClass = cn(
    "h-11 rounded-xl transition-colors",
    isDark
      ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#4FD1C5] focus:ring-[#4FD1C5]/20"
      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#2B8A8A] focus:ring-[#2B8A8A]/20"
  );

  const labelClass = cn(
    "text-sm font-medium mb-1.5 block",
    isDark ? "text-gray-300" : "text-gray-700"
  );

  const iconClass = cn(
    "w-4 h-4",
    isDark ? "text-gray-500" : "text-gray-400"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2
          className={cn(
            "text-2xl font-bold mb-2",
            isDark ? "text-white" : "text-gray-900"
          )}
        >
          Contact Information
        </h2>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Let employers know how to reach you. This information appears at the top of your resume.
        </p>
      </div>

      {isLoadingProfile && (
        <div className={cn(
          "flex items-center gap-2 p-3 rounded-xl",
          isDark ? "bg-[#4FD1C5]/10 text-[#4FD1C5]" : "bg-[#2B8A8A]/10 text-[#2B8A8A]"
        )}>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading from your profile...</span>
        </div>
      )}

      {/* Name fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className={labelClass}>
            First Name *
          </Label>
          <div className="relative">
            <User className={cn(iconClass, "absolute left-3 top-1/2 -translate-y-1/2")} />
            <Input
              id="firstName"
              placeholder="John"
              value={contactInfo.firstName}
              onChange={(e) => updateContactInfo({ firstName: e.target.value })}
              className={cn(inputClass, "pl-10")}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="lastName" className={labelClass}>
            Last Name *
          </Label>
          <Input
            id="lastName"
            placeholder="Doe"
            value={contactInfo.lastName}
            onChange={(e) => updateContactInfo({ lastName: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Email and Phone */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email" className={labelClass}>
            Email Address *
          </Label>
          <div className="relative">
            <Mail className={cn(iconClass, "absolute left-3 top-1/2 -translate-y-1/2")} />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={contactInfo.email}
              onChange={(e) => updateContactInfo({ email: e.target.value })}
              className={cn(inputClass, "pl-10")}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="phone" className={labelClass}>
            Phone Number *
          </Label>
          <div className="relative">
            <Phone className={cn(iconClass, "absolute left-3 top-1/2 -translate-y-1/2")} />
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={contactInfo.phone}
              onChange={(e) => updateContactInfo({ phone: e.target.value })}
              className={cn(inputClass, "pl-10")}
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <Label className={labelClass}>
          <MapPin className="w-4 h-4 inline mr-1" />
          Location *
        </Label>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <Input
              placeholder="City"
              value={contactInfo.city}
              onChange={(e) => updateContactInfo({ city: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <select
              value={contactInfo.state}
              onChange={(e) => updateContactInfo({ state: e.target.value })}
              className={cn(
                inputClass,
                "w-full px-3",
                !contactInfo.state && (isDark ? "text-gray-500" : "text-gray-400")
              )}
            >
              <option value="">State</option>
              {US_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Input
              placeholder="ZIP Code"
              value={contactInfo.zipCode}
              onChange={(e) => updateContactInfo({ zipCode: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Optional: LinkedIn and Portfolio */}
      <div
        className={cn(
          "pt-4 border-t",
          isDark ? "border-gray-800" : "border-gray-200"
        )}
      >
        <p className={cn("text-sm mb-4", isDark ? "text-gray-500" : "text-gray-400")}>
          Optional: Add professional links to stand out
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin" className={labelClass}>
              LinkedIn URL
            </Label>
            <div className="relative">
              <Linkedin className={cn(iconClass, "absolute left-3 top-1/2 -translate-y-1/2")} />
              <Input
                id="linkedin"
                placeholder="linkedin.com/in/johndoe"
                value={contactInfo.linkedinUrl || ""}
                onChange={(e) =>
                  updateContactInfo({ linkedinUrl: e.target.value })
                }
                className={cn(inputClass, "pl-10")}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="portfolio" className={labelClass}>
              Portfolio/Website
            </Label>
            <div className="relative">
              <Globe className={cn(iconClass, "absolute left-3 top-1/2 -translate-y-1/2")} />
              <Input
                id="portfolio"
                placeholder="johndoe.com"
                value={contactInfo.portfolioUrl || ""}
                onChange={(e) =>
                  updateContactInfo({ portfolioUrl: e.target.value })
                }
                className={cn(inputClass, "pl-10")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div
        className={cn(
          "p-4 rounded-xl",
          isDark ? "bg-[#4FD1C5]/5 border border-[#4FD1C5]/20" : "bg-[#2B8A8A]/5 border border-[#2B8A8A]/20"
        )}
      >
        <h4
          className={cn(
            "font-medium mb-2 text-sm",
            isDark ? "text-[#4FD1C5]" : "text-[#2B8A8A]"
          )}
        >
          Tips for Contact Information
        </h4>
        <ul
          className={cn(
            "text-sm space-y-1 list-disc list-inside",
            isDark ? "text-gray-400" : "text-gray-600"
          )}
        >
          <li>Use a professional email address (firstname.lastname@email.com)</li>
          <li>Include city and state, but full street address is not needed</li>
          <li>Make sure your phone number is current and has a professional voicemail</li>
        </ul>
      </div>
    </div>
  );
}
