import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/services/email-service";
import crypto from "crypto";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Simple in-memory rate limiting (consider Redis for production scale)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 3; // 3 requests per window

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const key = email.toLowerCase();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = forgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;
    const normalizedEmail = email.toLowerCase();

    // Check rate limit
    if (!checkRateLimit(normalizedEmail)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    // Always return success to prevent email enumeration
    // But only actually send email if user exists
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { profile: true },
    });

    if (user) {
      // Delete any existing password reset tokens for this user
      await prisma.verificationToken.deleteMany({
        where: {
          email: normalizedEmail,
          type: "PASSWORD_RESET",
        },
      });

      // Generate new token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

      await prisma.verificationToken.create({
        data: {
          email: normalizedEmail,
          token: resetToken,
          type: "PASSWORD_RESET",
          expiresAt,
        },
      });

      // Send reset email
      const firstName = user.profile?.firstName || undefined;
      await sendPasswordResetEmail(normalizedEmail, resetToken, firstName);

      // Log in development
      if (process.env.NODE_ENV === "development") {
        console.log(`Password reset token for ${normalizedEmail}: ${resetToken}`);
      }
    }

    // Always return success to prevent email enumeration attacks
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link shortly.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
