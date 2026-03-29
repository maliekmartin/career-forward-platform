import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/services/email-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: true, code: "MISSING_TOKEN", message: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        type: "EMAIL_VERIFICATION",
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: true, code: "INVALID_TOKEN", message: "Invalid or expired verification link" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      });

      return NextResponse.json(
        { error: true, code: "TOKEN_EXPIRED", message: "Verification link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Find and update the user
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.email },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: true, code: "USER_NOT_FOUND", message: "User not found" },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      // Delete the token since it's no longer needed
      await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      });

      return NextResponse.json({
        success: true,
        message: "Email already verified",
        alreadyVerified: true,
      });
    }

    // Mark email as verified and delete the token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({
        where: { id: verificationToken.id },
      }),
    ]);

    // Send welcome email (don't block on this)
    sendWelcomeEmail(user.email, user.profile?.firstName || undefined).catch((err) => {
      console.error("Failed to send welcome email:", err);
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: true, code: "INTERNAL_ERROR", message: "An error occurred during verification" },
      { status: 500 }
    );
  }
}

// POST endpoint for resending verification email
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: true, code: "MISSING_EMAIL", message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a verification link will be sent.",
      });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Email is already verified. You can log in.",
        alreadyVerified: true,
      });
    }

    // Delete any existing verification tokens for this email
    await prisma.verificationToken.deleteMany({
      where: {
        email: user.email,
        type: "EMAIL_VERIFICATION",
      },
    });

    // Generate new verification token
    const crypto = await import("crypto");
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.verificationToken.create({
      data: {
        email: user.email,
        token: verificationToken,
        type: "EMAIL_VERIFICATION",
        expiresAt,
      },
    });

    // Send verification email
    const { sendVerificationEmail } = await import("@/lib/services/email-service");
    const result = await sendVerificationEmail(
      user.email,
      verificationToken,
      user.profile?.firstName || undefined
    );

    if (!result.success) {
      console.error("Failed to send verification email:", result.error);
      return NextResponse.json(
        { error: true, code: "EMAIL_SEND_FAILED", message: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent! Please check your inbox.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: true, code: "INTERNAL_ERROR", message: "An error occurred" },
      { status: 500 }
    );
  }
}
