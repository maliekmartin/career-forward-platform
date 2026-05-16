import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations/contact";
import { prisma } from "@/lib/db";
import { sendContactFormNotification } from "@/lib/services/email-service";

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("[CONTACT FORM] Validation failed:", validationResult.error.issues);
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

    const { name, email, message } = validationResult.data;

    console.log(`[CONTACT FORM] 📨 New submission from: ${email}`);

    // Save to database with retry logic
    let submission;
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        submission = await prisma.contactSubmission.create({
          data: {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            message: message.trim(),
          },
        });
        console.log(`[CONTACT FORM] ✅ Successfully saved submission: ${submission.id}`);
        break;
      } catch (dbError: any) {
        retries++;
        console.error(`[CONTACT FORM] Database error on attempt ${retries}/${maxRetries}:`, dbError);

        if (retries >= maxRetries) {
          // Email admin about database failure but don't block user
          console.error("[CONTACT FORM] ❌ CRITICAL: Database save failed after 3 attempts");

          // Try to at least send the email notification
          try {
            await sendContactFormNotification({ name, email, message });
            console.log("[CONTACT FORM] ⚠️ Fallback: Email sent despite database failure");
          } catch (emailError) {
            console.error("[CONTACT FORM] ❌ CRITICAL: Both database and email failed:", emailError);
          }

          return NextResponse.json(
            {
              success: false,
              error: true,
              code: "DATABASE_ERROR",
              message: "We're experiencing technical difficulties. Your message has been recorded, and we'll respond via email. If urgent, please contact support@martinbuiltstrategies.com directly.",
            },
            { status: 500 }
          );
        }

        // Exponential backoff: 100ms, 200ms, 400ms
        await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, retries - 1)));
      }
    }

    // Send email notification to support team
    try {
      await sendContactFormNotification({ name, email, message });
      console.log(`[CONTACT FORM] 📧 Email notification sent successfully`);
    } catch (emailError) {
      // Don't fail the request if email fails, just log it
      console.error("[CONTACT FORM] ⚠️ Email notification failed (non-critical):", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for contacting us! We'll get back to you within 24 hours.",
    });
  } catch (error: any) {
    console.error("[CONTACT FORM] ❌ Unexpected error:", error);
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
