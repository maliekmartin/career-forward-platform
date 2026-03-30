import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { checkRateLimit, createRateLimitKey, RATE_LIMITS } from "@/lib/rate-limit";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting for AI endpoints
    const rateLimitKey = createRateLimitKey("ai:generate", session.userId);
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.AI_GENERATE);
    if (!rateLimit.success) {
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many AI requests. Please try again later.",
          retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }

    // Check premium access
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { subscriptionTier: true },
    });

    if (user?.subscriptionTier === "FREE") {
      return NextResponse.json(
        { error: "Premium feature. Please upgrade to access AI features." },
        { status: 403 }
      );
    }

    const { jobTitle, company, existingBullets, responsibilities } = await request.json();

    if (!jobTitle) {
      return NextResponse.json(
        { error: "Job title is required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert resume writer. Generate 4-5 professional bullet points for a work experience entry.

Job Title: ${jobTitle}
Company: ${company || "Not specified"}
${responsibilities ? `Brief responsibilities: ${responsibilities}` : ""}
${existingBullets?.length ? `Existing bullets to improve/expand on: ${existingBullets.join("; ")}` : ""}

Requirements:
1. Start each bullet with a strong action verb (Led, Developed, Managed, Implemented, etc.)
2. Include quantifiable metrics where possible (%, $, numbers)
3. Focus on achievements and impact, not just duties
4. Keep each bullet to 1-2 lines
5. Make them ATS-friendly with industry keywords
6. Vary the action verbs - don't repeat

Format: Return as a JSON array of strings, e.g., ["Bullet 1", "Bullet 2", "Bullet 3"]
Return ONLY the JSON array, no explanations.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = (message.content[0] as { type: string; text: string }).text.trim();

    // Parse the JSON array
    let bullets: string[];
    try {
      bullets = JSON.parse(responseText);
    } catch {
      // If parsing fails, split by newlines and clean up
      bullets = responseText
        .split("\n")
        .map((line) => line.replace(/^[-•*]\s*/, "").trim())
        .filter((line) => line.length > 0);
    }

    return NextResponse.json({ bullets });
  } catch (error) {
    console.error("Error generating bullets:", error);
    return NextResponse.json(
      { error: "Failed to generate bullets" },
      { status: 500 }
    );
  }
}
