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

    // Check if user has premium access
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

    const { firstName, lastName, jobTitles, companies, currentSummary, targetRole } = await request.json();

    const prompt = `You are an expert resume writer. Generate a professional summary for a resume.

Context:
- Name: ${firstName} ${lastName}
- Previous job titles: ${jobTitles?.join(", ") || "Not provided"}
- Previous companies: ${companies?.join(", ") || "Not provided"}
- Target role: ${targetRole || "Not specified"}
${currentSummary ? `- Current summary to improve: ${currentSummary}` : ""}

Requirements:
1. Write in third person (no "I" or "my")
2. Keep it to 2-4 sentences (under 500 characters)
3. Lead with years of experience and primary expertise
4. Include 1-2 quantifiable achievements if context allows
5. Make it ATS-friendly with relevant keywords
6. Be specific and impactful, not generic

Return ONLY the summary text, no quotes or explanations.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const summary = (message.content[0] as { type: string; text: string }).text.trim();

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
