import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { waitlistSchema } from "@/lib/validations/waitlist";
import { sendWaitlistConfirmationEmail } from "@/lib/services/email-service";
import crypto from "crypto";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Generate a unique referral code
 * Format: firstname-abc123xy
 */
function generateReferralCode(firstName: string): string {
  const cleanName = firstName.toLowerCase().replace(/[^a-z]/g, "").slice(0, 10);
  const randomPart = crypto.randomBytes(4).toString("hex");
  return `${cleanName}-${randomPart}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = waitlistSchema.safeParse(body);
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

    const { firstName, lastName, email, region, referredBy } = validationResult.data;

    // Check if email already exists
    const existingEntry = await prisma.waitlistEntry.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEntry) {
      // Return the existing referral link instead of error
      const referralLink = `${APP_URL}/waitlist?ref=${existingEntry.referralCode}`;
      return NextResponse.json(
        {
          success: true,
          alreadyExists: true,
          message: "You're already on the waitlist! Here's your referral link.",
          referralCode: existingEntry.referralCode,
          referralLink,
        },
        { status: 200 }
      );
    }

    // Generate unique referral code
    let referralCode = generateReferralCode(firstName);

    // Ensure uniqueness (very unlikely to collide, but just in case)
    let attempts = 0;
    while (attempts < 5) {
      const existing = await prisma.waitlistEntry.findUnique({
        where: { referralCode },
      });
      if (!existing) break;
      referralCode = generateReferralCode(firstName);
      attempts++;
    }

    // Create waitlist entry
    const entry = await prisma.waitlistEntry.create({
      data: {
        email: email.toLowerCase(),
        firstName,
        lastName,
        region,
        referralCode,
        referredBy: referredBy || null,
      },
    });

    const referralLink = `${APP_URL}/waitlist?ref=${referralCode}`;

    // Send confirmation email (non-blocking)
    let emailSent = false;
    try {
      const emailResult = await sendWaitlistConfirmationEmail(
        email,
        firstName,
        referralLink
      );
      emailSent = emailResult.success;
      if (!emailResult.success) {
        console.error("Failed to send waitlist email:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Email service error:", emailError);
    }

    // Log in development
    if (process.env.NODE_ENV === "development") {
      console.log(`Waitlist signup: ${email}, referral code: ${referralCode}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Welcome to the waitlist!",
        referralCode,
        referralLink,
        emailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      {
        error: true,
        code: "INTERNAL_ERROR",
        message: "An error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to fetch waitlist count and recent signups (for social proof)
 */
export async function GET() {
  try {
    const [count, recentSignups] = await Promise.all([
      prisma.waitlistEntry.count(),
      prisma.waitlistEntry.findMany({
        select: {
          firstName: true,
          region: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    // Transform recent signups for privacy (show first name + region only)
    const recent = recentSignups.map((entry) => ({
      name: entry.firstName,
      region: entry.region,
      joinedAt: entry.createdAt,
    }));

    return NextResponse.json({ count, recent });
  } catch (error) {
    console.error("Waitlist count error:", error);
    return NextResponse.json({ count: 0, recent: [] });
  }
}
