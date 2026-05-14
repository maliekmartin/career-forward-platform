"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const ADMIN_PASSWORD = "CFAdminPanel123!";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const adminAuth = sessionStorage.getItem("cf_admin_auth");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("cf_admin_auth", "true");
      setError("");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("cf_admin_auth");
    router.push("/");
  };

  // During SSR, show nothing
  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-[#0D9488]/10 rounded-2xl flex items-center justify-center">
                <Lock className="h-8 w-8 text-[#0D9488]" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-[#0F172A] text-center mb-2">
              Admin Access
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Enter password to access admin panel
            </p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-[#0F172A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 focus:border-[#0D9488] transition-all"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                className="w-full bg-[#0D9488] hover:bg-[#0D9488]/90 text-white rounded-xl h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Access Admin Panel
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/")}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to home
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#0F172A]">Admin Panel</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="text-gray-600 hover:text-[#0F172A]"
          >
            Logout
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
