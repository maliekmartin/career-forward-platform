import { NextRequest, NextResponse } from "next/server";
import { pricingLeadSchema } from "@/lib/validations/pricing";
import { prisma } from "@/lib/db";
import { sendPricingLeadNotification } from "@/lib/services/email-service";

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = pricingLeadSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("[PRICING LEAD] Validation failed:", validationResult.error.issues);
      return NextResponse.json(
        {
          success: false,
          error: true,
          code: "VALIDATION_ERROR",
          message: "Please check your input and try again.",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const { firstName, lastName, email, leadType } = data;

    console.log(`[PRICING LEAD] 💰 New ${leadType} lead from: ${email}`);

    // Save to database with retry logic
    let lead;
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        lead = await prisma.pricingLead.create({
          data: {
            leadType,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            organization: data.organization?.trim() || null,
            phone: data.phone?.trim() || null,
            teamSize: data.teamSize || null,
            coachCount: data.coachCount || null,
            notes: data.notes?.trim() || null,
          },
        });
        console.log(`[PRICING LEAD] ✅ Successfully saved lead: ${lead.id} (${leadType})`);
        break;
      } catch (dbError: any) {
        retries++;
        console.error(`[PRICING LEAD] Database error on attempt ${retries}/${maxRetries}:`, dbError);

        if (retries >= maxRetries) {
          // Email admin about database failure but don't block user
          console.error("[PRICING LEAD] ❌ CRITICAL: Database save failed after 3 attempts");

          // Try to at least send the email notification
          try {
            await sendPricingLeadNotification(data);
            console.log("[PRICING LEAD] ⚠️ Fallback: Email sent despite database failure");
          } catch (emailError) {
            console.error("[PRICING LEAD] ❌ CRITICAL: Both database and email failed:", emailError);
          }

          return NextResponse.json(
            {
              success: false,
              error: true,
              code: "DATABASE_ERROR",
              message: "We're experiencing technical difficulties. Your information has been recorded, and we'll contact you within 24 hours. If urgent, please email support@martinbuiltstrategies.com directly.",
            },
            { status: 500 }
          );
        }

        // Exponential backoff: 100ms, 200ms, 400ms
        await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, retries - 1)));
      }
    }

    // Send email notification to sales team
    try {
      await sendPricingLeadNotification(data);
      console.log(`[PRICING LEAD] 📧 Email notification sent successfully`);
    } catch (emailError) {
      // Don't fail the request if email fails, just log it
      console.error("[PRICING LEAD] ⚠️ Email notification failed (non-critical):", emailError);
    }

    return NextResponse.json({
      success: true,
      message: leadType === "coach"
        ? "Thank you for your interest! We'll contact you within 24 hours to discuss coaching opportunities."
        : "Thank you for your interest! Our team will reach out within 24 hours to discuss how Career Forward can help your organization.",
    });
  } catch (error: any) {
    console.error("[PRICING LEAD] ❌ Unexpected error:", error);
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
