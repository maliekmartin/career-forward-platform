"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Target,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/lib/theme-context";
import type {
  ParsedResume,
  WorkExperience,
  Education,
  Certification,
} from "@/lib/services/resume-parser";

type OnboardingStep =
  | "welcome"
  | "upload"
  | "personal"
  | "experience"
  | "education"
  | "skills"
  | "goals"
  | "complete";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  yearsInIndustry: number | null;
  currentIndustry: string;
  careerGoal: "SAME_INDUSTRY" | "NEW_INDUSTRY" | "CERTIFICATION" | null;
}

const initialProfileData: ProfileData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  linkedIn: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  yearsInIndustry: null,
  currentIndustry: "",
  careerGoal: null,
};

const steps: { id: OnboardingStep; label: string; icon: React.ElementType }[] = [
  { id: "welcome", label: "Welcome", icon: Sparkles },
  { id: "upload", label: "Resume", icon: Upload },
  { id: "personal", label: "Personal", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "goals", label: "Goals", icon: Target },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  // Get step index for progress
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  // Navigate to next step
  const nextStep = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  // Skip resume upload - go directly to manual entry
  const skipToManual = () => {
    setCurrentStep("personal");
  };

  // Handle file drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    setUploadError(null);

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Please upload a PDF or Word document.");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB.");
      return;
    }

    setUploadedFile(file);
    await uploadAndParseResume(file);
  };

  const uploadAndParseResume = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload and parse in one step - the upload endpoint now parses directly
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const error = await uploadRes.json();
        throw new Error(error.error || "Failed to upload file");
      }

      const uploadData = await uploadRes.json();
      setIsUploading(false);

      // Check if parsing was successful
      if (uploadData.parseError) {
        console.warn("Parse warning:", uploadData.parseError);
      }

      // Populate profile data from parsed resume (returned directly from upload)
      if (uploadData.parsed) {
        setIsParsing(true);
        // Small delay for UX feedback
        await new Promise(resolve => setTimeout(resolve, 500));
        populateFromParsedResume(uploadData.parsed);
        setIsParsing(false);
      }

      // Move to personal info step
      setCurrentStep("personal");
    } catch (error) {
      setIsUploading(false);
      setIsParsing(false);
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const populateFromParsedResume = (parsed: ParsedResume) => {
    setProfileData((prev) => ({
      ...prev,
      firstName: parsed.personalInfo.firstName || prev.firstName,
      lastName: parsed.personalInfo.lastName || prev.lastName,
      email: parsed.personalInfo.email || prev.email,
      phone: parsed.personalInfo.phone || prev.phone,
      location: parsed.personalInfo.location || prev.location,
      linkedIn: parsed.personalInfo.linkedIn || prev.linkedIn,
      summary: parsed.summary || prev.summary,
      experience: parsed.experience.length > 0 ? parsed.experience : prev.experience,
      education: parsed.education.length > 0 ? parsed.education : prev.education,
      skills: parsed.skills.length > 0 ? parsed.skills : prev.skills,
      certifications: parsed.certifications.length > 0 ? parsed.certifications : prev.certifications,
    }));
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    setUploadError(null);
  };

  // Add experience entry
  const addExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: "",
      title: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    setProfileData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: string | boolean) => {
    setProfileData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Add education entry
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      field: "",
      location: "",
      startDate: "",
      endDate: "",
    };
    setProfileData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (index: number) => {
    setProfileData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Add skill
  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // Save profile
  const saveProfile = async () => {
    setIsSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phone: profileData.phone,
            yearsInIndustry: profileData.yearsInIndustry,
            currentIndustry: profileData.currentIndustry,
            careerGoal: profileData.careerGoal,
            profileCompleted: true,
          },
          resumeContent: {
            summary: profileData.summary,
            experience: profileData.experience,
            education: profileData.education,
            skills: profileData.skills,
            certifications: profileData.certifications,
          },
          resumeName: "My Resume",
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save profile");
      }

      // Calculate initial scores
      try {
        await fetch("/api/scores/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            parsedResume: {
              personalInfo: {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                email: profileData.email,
                phone: profileData.phone,
                location: profileData.location,
                linkedIn: profileData.linkedIn,
              },
              summary: profileData.summary,
              experience: profileData.experience,
              education: profileData.education,
              skills: profileData.skills,
              certifications: profileData.certifications,
            },
            location: profileData.location,
            industry: profileData.currentIndustry,
          }),
        });
      } catch (scoreError) {
        console.warn("Failed to calculate initial scores:", scoreError);
        // Don't block onboarding if scoring fails
      }

      setCurrentStep("complete");
    } catch (error) {
      console.error("Save error:", error);
      alert(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  // Redirect after completion
  useEffect(() => {
    if (currentStep === "complete") {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, router]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-950" : "bg-[#FAFBFC]"}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        {currentStep !== "complete" && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = currentStepIndex > index;

                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-[#2B8A8A] text-white"
                          : isCompleted
                          ? "bg-[#2B8A8A]/20 text-[#2B8A8A]"
                          : isDark
                          ? "bg-gray-800 text-gray-500"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 h-1 mx-2 rounded transition-all duration-300 ${
                          isCompleted ? "bg-[#2B8A8A]" : isDark ? "bg-gray-800" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                Step {currentStepIndex + 1} of {steps.length}
              </p>
            </div>
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`rounded-2xl p-8 ${isDark ? "bg-gray-900" : "bg-white"} shadow-xl`}
          >
            {/* Welcome Step */}
            {currentStep === "welcome" && (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#2B8A8A]/10 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-[#2B8A8A]" />
                </div>
                <h1 className={`text-3xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Welcome to Career Forward!
                </h1>
                <p className={`text-lg mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  Let&apos;s set up your profile to get you started on your career journey.
                  You can upload your resume for quick setup, or fill in your information manually.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={nextStep}
                    className="bg-[#2B8A8A] hover:bg-[#237070] text-white px-8 py-6 text-lg rounded-xl"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Resume (Quick)
                  </Button>
                  <Button
                    onClick={skipToManual}
                    variant="outline"
                    className="px-8 py-6 text-lg rounded-xl"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Enter Manually
                  </Button>
                </div>
              </div>
            )}

            {/* Upload Step */}
            {currentStep === "upload" && (
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Upload Your Resume
                </h2>
                <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  We&apos;ll extract your information to pre-fill your profile. You can edit everything afterward.
                </p>

                {/* Upload Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
                    dragActive
                      ? "border-[#2B8A8A] bg-[#2B8A8A]/5"
                      : isDark
                      ? "border-gray-700 hover:border-gray-600"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {isUploading || isParsing ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-12 h-12 text-[#2B8A8A] animate-spin mb-4" />
                      <p className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        {isUploading ? "Uploading..." : "Analyzing your resume..."}
                      </p>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        This may take a moment
                      </p>
                    </div>
                  ) : uploadedFile ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-xl bg-[#2B8A8A]/10 flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-[#2B8A8A]" />
                      </div>
                      <p className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                        {uploadedFile.name}
                      </p>
                      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                      <Button
                        onClick={removeUploadedFile}
                        variant="ghost"
                        className="mt-4 text-red-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-xl bg-[#2B8A8A]/10 flex items-center justify-center mb-4">
                        <Upload className="w-8 h-8 text-[#2B8A8A]" />
                      </div>
                      <p className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                        Drag and drop your resume here
                      </p>
                      <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        or click to browse (PDF, DOC, DOCX - Max 5MB)
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {uploadError && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-red-600 dark:text-red-400">{uploadError}</p>
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <Button onClick={prevStep} variant="outline" className="rounded-xl">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button onClick={skipToManual} variant="ghost" className="rounded-xl">
                    Skip and enter manually
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Personal Info Step */}
            {currentStep === "personal" && (
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Personal Information
                </h2>
                <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Tell us about yourself. This information helps coaches understand who you are.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      placeholder="John"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      placeholder="Doe"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      placeholder="City, State"
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="linkedIn">LinkedIn URL</Label>
                    <Input
                      id="linkedIn"
                      value={profileData.linkedIn}
                      onChange={(e) => setProfileData({ ...profileData, linkedIn: e.target.value })}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      value={profileData.summary}
                      onChange={(e) => setProfileData({ ...profileData, summary: e.target.value })}
                      placeholder="Brief overview of your professional background and career objectives..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button onClick={prevStep} variant="outline" className="rounded-xl">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={!profileData.firstName || !profileData.lastName}
                    className="bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-xl"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Experience Step */}
            {currentStep === "experience" && (
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Work Experience
                </h2>
                <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Add your work history. You can always update this later.
                </p>

                <div className="space-y-6">
                  {profileData.experience.map((exp, index) => (
                    <div
                      key={exp.id}
                      className={`p-6 rounded-xl border ${isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                          Position {index + 1}
                        </h3>
                        <Button
                          onClick={() => removeExperience(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Job Title</Label>
                          <Input
                            value={exp.title}
                            onChange={(e) => updateExperience(index, "title", e.target.value)}
                            placeholder="Software Engineer"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(index, "company", e.target.value)}
                            placeholder="Acme Corp"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                            disabled={exp.current}
                            className="mt-1"
                          />
                          <label className="flex items-center mt-2 text-sm">
                            <input
                              type="checkbox"
                              checked={exp.current}
                              onChange={(e) => updateExperience(index, "current", e.target.checked)}
                              className="mr-2"
                            />
                            <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                              I currently work here
                            </span>
                          </label>
                        </div>
                        <div className="md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(index, "description", e.target.value)}
                            placeholder="Describe your responsibilities and achievements..."
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={addExperience}
                    variant="outline"
                    className="w-full py-6 border-dashed rounded-xl"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Work Experience
                  </Button>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button onClick={prevStep} variant="outline" className="rounded-xl">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-xl"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Education Step */}
            {currentStep === "education" && (
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Education
                </h2>
                <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Add your educational background.
                </p>

                <div className="space-y-6">
                  {profileData.education.map((edu, index) => (
                    <div
                      key={edu.id}
                      className={`p-6 rounded-xl border ${isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                          Education {index + 1}
                        </h3>
                        <Button
                          onClick={() => removeEducation(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label>Institution</Label>
                          <Input
                            value={edu.institution}
                            onChange={(e) => updateEducation(index, "institution", e.target.value)}
                            placeholder="University of Example"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Degree</Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(index, "degree", e.target.value)}
                            placeholder="Bachelor's, Master's, etc."
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Field of Study</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => updateEducation(index, "field", e.target.value)}
                            placeholder="Computer Science"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    onClick={addEducation}
                    variant="outline"
                    className="w-full py-6 border-dashed rounded-xl"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Education
                  </Button>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button onClick={prevStep} variant="outline" className="rounded-xl">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-xl"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Skills Step */}
            {currentStep === "skills" && (
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Skills
                </h2>
                <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Add your professional skills. These help match you with relevant opportunities.
                </p>

                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Type a skill and press Enter"
                      className="flex-1"
                    />
                    <Button onClick={addSkill} className="bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-xl">
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {profileData.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm ${
                        isDark
                          ? "bg-[#2B8A8A]/20 text-[#4ECDC4]"
                          : "bg-[#2B8A8A]/10 text-[#2B8A8A]"
                      }`}
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-2 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {profileData.skills.length === 0 && (
                    <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                      No skills added yet. Start typing to add your first skill.
                    </p>
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <Button onClick={prevStep} variant="outline" className="rounded-xl">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-xl"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Goals Step */}
            {currentStep === "goals" && (
              <div>
                <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Career Goals
                </h2>
                <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Tell us about your career aspirations so we can better support your journey.
                </p>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="yearsInIndustry">Years of Experience</Label>
                    <Select
                      value={profileData.yearsInIndustry?.toString() || ""}
                      onValueChange={(val) => setProfileData({
                        ...profileData,
                        yearsInIndustry: val ? parseInt(val) : null,
                      })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select years of experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Less than 1 year</SelectItem>
                        <SelectItem value="1">1-2 years</SelectItem>
                        <SelectItem value="3">3-5 years</SelectItem>
                        <SelectItem value="6">6-10 years</SelectItem>
                        <SelectItem value="11">11-15 years</SelectItem>
                        <SelectItem value="16">15+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currentIndustry">Current Industry</Label>
                    <Input
                      id="currentIndustry"
                      value={profileData.currentIndustry}
                      onChange={(e) => setProfileData({ ...profileData, currentIndustry: e.target.value })}
                      placeholder="e.g., Technology, Healthcare, Finance"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>What&apos;s your career goal?</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      {[
                        { value: "SAME_INDUSTRY", label: "Grow in my industry", desc: "Advance in my current field" },
                        { value: "NEW_INDUSTRY", label: "Change industries", desc: "Transition to a new career" },
                        { value: "CERTIFICATION", label: "Get certified", desc: "Earn professional credentials" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setProfileData({
                            ...profileData,
                            careerGoal: option.value as ProfileData["careerGoal"],
                          })}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            profileData.careerGoal === option.value
                              ? "border-[#2B8A8A] bg-[#2B8A8A]/5"
                              : isDark
                              ? "border-gray-700 hover:border-gray-600"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                            {option.label}
                          </p>
                          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            {option.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button onClick={prevStep} variant="outline" className="rounded-xl">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={saveProfile}
                    disabled={isSaving}
                    className="bg-[#2B8A8A] hover:bg-[#237070] text-white rounded-xl"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Complete Profile
                        <Check className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Complete Step */}
            {currentStep === "complete" && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center"
                >
                  <Check className="w-10 h-10 text-green-500" />
                </motion.div>
                <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Profile Complete!
                </h2>
                <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Great job! Your profile is all set up. Redirecting you to your dashboard...
                </p>
                <div className="flex justify-center">
                  <Loader2 className="w-6 h-6 text-[#2B8A8A] animate-spin" />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
