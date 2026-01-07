"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, Eye, EyeOff, Check, X } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const password = formData.password;
    const checks = {
      length: password.length >= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    const percentage = (passedChecks / 5) * 100;

    let strength: "weak" | "fair" | "good" | "strong" = "weak";
    if (passedChecks === 5) strength = "strong";
    else if (passedChecks >= 4) strength = "good";
    else if (passedChecks >= 3) strength = "fair";

    return { checks, percentage, strength };
  }, [formData.password]);

  const strengthColors = {
    weak: "bg-destructive",
    fair: "bg-warning",
    good: "bg-chart-2",
    strong: "bg-success",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate terms accepted
    if (!formData.acceptTerms) {
      setError("You must accept the terms and conditions");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Format validation errors
          const errors = Object.values(data.details).flat().join(". ");
          setError(errors);
        } else {
          setError(data.message || "An error occurred during registration");
        }
        return;
      }

      setSuccess(true);
      // Redirect to sign in after a delay
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
              <Check className="h-6 w-6 text-success" />
            </div>
            <CardTitle className="text-2xl">Account Created!</CardTitle>
            <CardDescription>
              Please check your email to verify your account. You will be
              redirected to sign in shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/signin">
              <Button variant="outline">Go to Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-block mx-auto mb-4">
            <Image
              src="/career-quest-logo.png"
              alt="Career Quest"
              width={150}
              height={40}
              priority
            />
          </Link>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>
            Start your journey to career success
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((segment) => (
                      <div
                        key={segment}
                        className={`h-1 flex-1 rounded-full ${
                          passwordStrength.percentage >= segment * 25
                            ? strengthColors[passwordStrength.strength]
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password strength:{" "}
                    <span
                      className={`font-medium ${
                        passwordStrength.strength === "strong"
                          ? "text-success"
                          : passwordStrength.strength === "good"
                          ? "text-chart-2"
                          : passwordStrength.strength === "fair"
                          ? "text-warning"
                          : "text-destructive"
                      }`}
                    >
                      {passwordStrength.strength}
                    </span>
                  </p>
                  <ul className="text-xs space-y-1">
                    <PasswordCheck
                      passed={passwordStrength.checks.length}
                      text="At least 12 characters"
                    />
                    <PasswordCheck
                      passed={passwordStrength.checks.uppercase}
                      text="One uppercase letter"
                    />
                    <PasswordCheck
                      passed={passwordStrength.checks.lowercase}
                      text="One lowercase letter"
                    />
                    <PasswordCheck
                      passed={passwordStrength.checks.number}
                      text="One number"
                    />
                    <PasswordCheck
                      passed={passwordStrength.checks.special}
                      text="One special character"
                    />
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-destructive">
                    Passwords do not match
                  </p>
                )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, acceptTerms: checked as boolean })
                }
                disabled={isLoading}
                className="mt-0.5"
              />
              <Label
                htmlFor="acceptTerms"
                className="text-sm font-normal cursor-pointer leading-tight"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:underline"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || passwordStrength.strength === "weak"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PasswordCheck({ passed, text }: { passed: boolean; text: string }) {
  return (
    <li className={`flex items-center gap-2 ${passed ? "text-success" : "text-muted-foreground"}`}>
      {passed ? (
        <Check className="h-3 w-3" />
      ) : (
        <X className="h-3 w-3" />
      )}
      {text}
    </li>
  );
}
