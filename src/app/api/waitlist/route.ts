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
      console.error("[WAITLIST] Validation error:", validationResult.error.flatten().fieldErrors);
      return NextResponse.json(
        {
          success: false,
          error: true,
          code: "VALIDATION_ERROR",
          message: "Invalid input. Please check your information and try again.",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, region, referredBy } = validationResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Log registration attempt
    console.log(`[WAITLIST] Registration attempt: ${normalizedEmail} (${firstName} ${lastName})`);

    // Check if email already exists
    let existingEntry;
    try {
      existingEntry = await prisma.waitlistEntry.findUnique({
        where: { email: normalizedEmail },
      });
    } catch (dbError) {
      console.error("[WAITLIST] Database error checking existing entry:", dbError);
      return NextResponse.json(
        {
          success: false,
          error: true,
          code: "DATABASE_ERROR",
          message: "Unable to process your request. Please try again in a moment.",
        },
        { status: 500 }
      );
    }

    if (existingEntry) {
      // Return the existing referral link instead of error
      const referralLink = `${APP_URL}/waitlist?ref=${existingEntry.referralCode}`;
      console.log(`[WAITLIST] Duplicate registration: ${normalizedEmail}`);
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

    if (attempts >= 5) {
      console.error("[WAITLIST] Failed to generate unique referral code after 5 attempts");
      return NextResponse.json(
        {
          success: false,
          error: true,
          code: "GENERATION_ERROR",
          message: "Unable to complete registration. Please try again.",
        },
        { status: 500 }
      );
    }

    // Create waitlist entry with retry logic
    let entry;
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        entry = await prisma.waitlistEntry.create({
          data: {
            email: normalizedEmail,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            region,
            referralCode,
            referredBy: referredBy || null,
          },
        });
        console.log(`[WAITLIST] ✅ Successfully created entry: ${normalizedEmail} (${referralCode})`);
        break;
      } catch (dbError: any) {
        retries++;
        console.error(`[WAITLIST] Database error on attempt ${retries}/${maxRetries}:`, dbError);

        // If this is a unique constraint violation, the email was just registered
        if (dbError.code === "P2002") {
          const existingEntry = await prisma.waitlistEntry.findUnique({
            where: { email: normalizedEmail },
          });
          if (existingEntry) {
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
        }

        if (retries >= maxRetries) {
          console.error(`[WAITLIST] ❌ Failed to create entry after ${maxRetries} attempts`);
          return NextResponse.json(
            {
              success: false,
              error: true,
              code: "DATABASE_ERROR",
              message: "We're experiencing technical difficulties. Please try again in a moment, or contact support@martinbuiltstrategies.com if the issue persists.",
            },
            { status: 500 }
          );
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, retries)));
      }
    }

    if (!entry) {
      console.error("[WAITLIST] ❌ Entry creation failed unexpectedly");
      return NextResponse.json(
        {
          success: false,
          error: true,
          code: "UNKNOWN_ERROR",
          message: "Registration failed. Please try again or contact support@martinbuiltstrategies.com",
        },
        { status: 500 }
      );
    }

    const referralLink = `${APP_URL}/waitlist?ref=${referralCode}`;

    // Send confirmation email (non-blocking - failure won't affect registration)
    let emailSent = false;
    try {
      const emailResult = await sendWaitlistConfirmationEmail(
        normalizedEmail,
        firstName,
        referralLink
      );
      emailSent = emailResult.success;
      if (!emailResult.success) {
        console.error("[WAITLIST] Email send failed:", emailResult.error);
      } else {
        console.log(`[WAITLIST] Email sent successfully to ${normalizedEmail}`);
      }
    } catch (emailError) {
      console.error("[WAITLIST] Email service error:", emailError);
    }

    // Log success
    console.log(`[WAITLIST] ✅ Registration complete: ${normalizedEmail} | Referral: ${referralCode} | Email sent: ${emailSent}`);

    return NextResponse.json(
      {
        success: true,
        message: "Welcome to the waitlist!",
        referralCode,
        referralLink,
        emailSent,
        entry: {
          firstName: entry.firstName,
          email: entry.email,
          region: entry.region,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[WAITLIST] ❌ Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error: true,
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred. Please try again or contact support@martinbuiltstrategies.com",
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
