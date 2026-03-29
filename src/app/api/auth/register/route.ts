import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validations/auth";
import { sendVerificationEmail } from "@/lib/services/email-service";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: true,
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: true,
          code: "EMAIL_EXISTS",
          message: "An account with this email already exists",
        },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        profile: {
          create: {
            preferredLanguage: "en",
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry

    await prisma.verificationToken.create({
      data: {
        email: user.email,
        token: verificationToken,
        type: "EMAIL_VERIFICATION",
        expiresAt,
      },
    });

    // Send verification email (non-blocking - don't fail registration if email fails)
    let emailSent = false;
    try {
      const emailResult = await sendVerificationEmail(email, verificationToken);
      emailSent = emailResult.success;
      if (!emailResult.success) {
        console.error("Failed to send verification email:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Email service error:", emailError);
    }

    // Also log token in development for testing
    if (process.env.NODE_ENV === "development") {
      console.log(`Verification token for ${email}: ${verificationToken}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: emailSent
          ? "Account created! Please check your email to verify your account."
          : "Account created! Email verification is temporarily unavailable - you can request a new verification email later.",
        userId: user.id,
        emailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: true,
        code: "INTERNAL_ERROR",
        message: "An error occurred during registration",
      },
      { status: 500 }
    );
  }
}
