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

    const { jobTitles, bullets, existingSkills, targetRole } = await request.json();

    const prompt = `You are an expert resume writer. Analyze the work experience and suggest relevant skills.

Job Titles: ${jobTitles?.join(", ") || "Not provided"}
Target Role: ${targetRole || "Not specified"}
Work Experience Bullets:
${bullets?.slice(0, 15).join("\n") || "Not provided"}

Already Listed Skills: ${existingSkills?.join(", ") || "None"}

Requirements:
1. Suggest 8-12 skills that are:
   - Relevant to the experience shown
   - In-demand for the target role
   - ATS-friendly keywords
2. Include a mix of:
   - Technical/hard skills
   - Soft skills
   - Tools and software
3. DO NOT suggest skills already listed
4. Prioritize by relevance

Format: Return as a JSON array of strings, e.g., ["Skill 1", "Skill 2"]
Return ONLY the JSON array, no explanations.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = (message.content[0] as { type: string; text: string }).text.trim();

    let skills: string[];
    try {
      skills = JSON.parse(responseText);
    } catch {
      skills = responseText
        .split(/[,\n]/)
        .map((s) => s.replace(/^[-•*"\s]+|["'\s]+$/g, "").trim())
        .filter((s) => s.length > 0 && s.length < 50);
    }

    // Filter out existing skills
    const existingLower = (existingSkills || []).map((s: string) => s.toLowerCase());
    skills = skills.filter((s) => !existingLower.includes(s.toLowerCase()));

    return NextResponse.json({ skills: skills.slice(0, 12) });
  } catch (error) {
    console.error("Error suggesting skills:", error);
    return NextResponse.json(
      { error: "Failed to suggest skills" },
      { status: 500 }
    );
  }
}
