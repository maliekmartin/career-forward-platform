import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = loginSchema.safeParse(body);
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

    const { email, password, rememberMe } = validationResult.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: true,
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          error: true,
          code: "ACCOUNT_INACTIVE",
          message: "Your account has been deactivated. Please contact support.",
        },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        {
          error: true,
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Get device info from request
    const userAgent = request.headers.get("user-agent") || undefined;

    // Create session
    const sessionToken = await createSession(user.id, rememberMe, userAgent);

    // Set cookie
    await setSessionCookie(sessionToken, rememberMe);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profileCompleted: user.profile?.profileCompleted ?? false,
        emailVerified: !!user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: true,
        code: "INTERNAL_ERROR",
        message: "An error occurred during login",
      },
      { status: 500 }
    );
  }
}
