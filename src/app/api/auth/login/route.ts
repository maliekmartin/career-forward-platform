import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    console.log("[LOGIN] Starting login request");
    const body = await request.json();
    console.log("[LOGIN] Body parsed, email:", body.email);

    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      console.log("[LOGIN] Validation failed:", validationResult.error);
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
    console.log("[LOGIN] Validation passed for email:", email);

    // Find user
    console.log("[LOGIN] Looking up user in database");
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        profile: true,
      },
    });
    console.log("[LOGIN] User lookup complete, found:", !!user);

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
    console.log("[LOGIN] Verifying password");
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    console.log("[LOGIN] Password valid:", isValidPassword);
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
    console.log("[LOGIN] Creating session");
    const sessionToken = await createSession(user.id, rememberMe, userAgent);
    console.log("[LOGIN] Session created");

    // Update last login
    console.log("[LOGIN] Updating last login");
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    console.log("[LOGIN] Last login updated");

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profileCompleted: user.profile?.profileCompleted ?? false,
        emailVerified: !!user.emailVerified,
      },
    });

    // Set session cookie on the response
    response.cookies.set("career_quest_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return NextResponse.json(
      {
        error: true,
        code: "INTERNAL_ERROR",
        message: "An error occurred during login",
        debug: process.env.NODE_ENV === "development"
          ? (error instanceof Error ? error.message : String(error))
          : undefined,
      },
      { status: 500 }
    );
  }
}
