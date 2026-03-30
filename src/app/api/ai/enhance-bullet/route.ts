import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const { bullet, jobTitle, context } = await request.json();

    if (!bullet) {
      return NextResponse.json(
        { error: "Bullet text is required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert resume writer. Enhance this resume bullet point to be more impactful.

Original bullet: "${bullet}"
Job Title: ${jobTitle || "Not specified"}
${context ? `Additional context: ${context}` : ""}

Enhancement guidelines:
1. Start with a strong action verb
2. Add quantifiable metrics (%, $, numbers) - estimate reasonable ones if not provided
3. Show impact and results, not just tasks
4. Keep it concise (1-2 lines max)
5. Use industry-relevant keywords
6. Make it ATS-friendly

Provide 3 enhanced versions, from conservative to aggressive improvement.

Format: Return as a JSON object:
{
  "conservative": "Slightly improved version",
  "moderate": "Moderately improved with metrics",
  "aggressive": "Significantly enhanced with strong metrics"
}

Return ONLY the JSON object, no explanations.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = (message.content[0] as { type: string; text: string }).text.trim();

    let enhancements;
    try {
      enhancements = JSON.parse(responseText);
    } catch {
      // Fallback if parsing fails
      enhancements = {
        conservative: bullet,
        moderate: bullet,
        aggressive: bullet,
      };
    }

    return NextResponse.json({ enhancements });
  } catch (error) {
    console.error("Error enhancing bullet:", error);
    return NextResponse.json(
      { error: "Failed to enhance bullet" },
      { status: 500 }
    );
  }
}
