import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";

// Rate limiting configuration
const rateLimitMap = new Map<string, { count: number; resetTime: number; lockedUntil?: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5; // 5 attempts per window
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minute lockout after max attempts

function checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts?: number; lockedUntil?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Clean up old records periodically
  if (rateLimitMap.size > 10000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime && (!value.lockedUntil || now > value.lockedUntil)) {
        rateLimitMap.delete(key);
      }
    }
  }

  // Check if locked out
  if (record?.lockedUntil && now < record.lockedUntil) {
    return { allowed: false, lockedUntil: record.lockedUntil };
  }

  // Reset if window expired
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  // Check if max attempts reached
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION;
    return { allowed: false, lockedUntil: record.lockedUntil };
  }

  // Increment counter
  record.count++;
  return { allowed: true, remainingAttempts: MAX_ATTEMPTS - record.count };
}

function resetRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get identifier for rate limiting (IP + email combination)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
               request.headers.get("x-real-ip") ||
               "unknown";
    const emailForRateLimit = body.email?.toLowerCase() || "";
    const rateLimitKey = `${ip}:${emailForRateLimit}`;

    // Check rate limit
    const rateCheck = checkRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      const retryAfter = rateCheck.lockedUntil
        ? Math.ceil((rateCheck.lockedUntil - Date.now()) / 1000)
        : 900; // 15 minutes default

      return NextResponse.json(
        {
          error: true,
          code: "RATE_LIMITED",
          message: `Too many login attempts. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`,
          retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) }
        }
      );
    }

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

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
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

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Fetch user's profile to check if onboarding is complete
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: { profileCompleted: true },
    });

    // Reset rate limit on successful login
    resetRateLimit(rateLimitKey);

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerified: !!user.emailVerified,
        profileCompleted: profile?.profileCompleted ?? false,
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
