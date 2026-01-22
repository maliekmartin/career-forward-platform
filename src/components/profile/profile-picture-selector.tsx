"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Check, X, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { avatarPresets } from "@/lib/avatar-presets";

interface ProfilePictureSelectorProps {
  currentPhotoUrl?: string | null;
  onPhotoChange: (url: string) => void;
  size?: "sm" | "md" | "lg";
}

export function ProfilePictureSelector({
  currentPhotoUrl,
  onPhotoChange,
  size = "md",
}: ProfilePictureSelectorProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a JPEG, PNG, WebP, or GIF image.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/picture", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      onPhotoChange(data.profilePhotoUrl);
      setIsOpen(false);
      setPreviewUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handlePresetSelect = async (presetUrl: string) => {
    setSelectedPreset(presetUrl);
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("presetUrl", presetUrl);

      const res = await fetch("/api/profile/picture", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to set avatar");
      }

      const data = await res.json();
      onPhotoChange(data.profilePhotoUrl);
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set avatar");
    } finally {
      setUploading(false);
      setSelectedPreset(null);
    }
  };

  return (
    <div className="relative">
      {/* Current Photo Display */}
      <button
        onClick={() => setIsOpen(true)}
        className={`relative ${sizeClasses[size]} rounded-full overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B8A8A] focus-visible:ring-offset-2`}
      >
        {currentPhotoUrl ? (
          <img
            src={currentPhotoUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${
              isDark ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <User
              className={`w-1/2 h-1/2 ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-6 h-6 text-white" />
        </div>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl z-50 ${
                isDark ? "bg-gray-900" : "bg-white"
              }`}
            >
              {/* Header */}
              <div
                className={`sticky top-0 flex items-center justify-between p-4 border-b ${
                  isDark ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"
                }`}
              >
                <h2
                  className={`text-lg font-semibold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Choose Profile Picture
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-full transition-colors ${
                    isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                  }`}
                >
                  <X className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Upload Section */}
                <div>
                  <h3
                    className={`text-sm font-medium mb-3 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Upload Your Photo
                  </h3>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    variant="outline"
                    className={`w-full h-24 border-dashed border-2 ${
                      isDark
                        ? "border-gray-700 hover:border-gray-600 hover:bg-gray-800"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6" />
                        <span className="text-sm">Click to upload or drag and drop</span>
                        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          JPEG, PNG, WebP or GIF (max 5MB)
                        </span>
                      </div>
                    )}
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className={`absolute inset-0 flex items-center`}>
                    <div className={`w-full border-t ${isDark ? "border-gray-800" : "border-gray-200"}`} />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-2 ${isDark ? "bg-gray-900 text-gray-500" : "bg-white text-gray-400"}`}>
                      or choose an avatar
                    </span>
                  </div>
                </div>

                {/* Avatar Presets */}
                <div>
                  <h3
                    className={`text-sm font-medium mb-3 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Professional Avatars
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {avatarPresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset.url)}
                        disabled={uploading}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B8A8A] ${
                          currentPhotoUrl === preset.url
                            ? "border-[#2B8A8A] ring-2 ring-[#2B8A8A]/20"
                            : isDark
                            ? "border-gray-700 hover:border-gray-600"
                            : "border-gray-200 hover:border-gray-300"
                        } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover"
                        />
                        {selectedPreset === preset.url && (
                          <div className="absolute inset-0 bg-[#2B8A8A]/20 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-[#2B8A8A] animate-spin" />
                          </div>
                        )}
                        {currentPhotoUrl === preset.url && !selectedPreset && (
                          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#2B8A8A] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
