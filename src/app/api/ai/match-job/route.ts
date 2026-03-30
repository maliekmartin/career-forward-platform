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

    const { jobDescription, resumeData } = await request.json();

    if (!jobDescription || !resumeData) {
      return NextResponse.json(
        { error: "Job description and resume data are required" },
        { status: 400 }
      );
    }

    const prompt = `You are an expert ATS specialist and career coach. Analyze how well this resume matches the job description.

JOB DESCRIPTION:
${jobDescription.slice(0, 3000)}

RESUME DATA:
Summary: ${resumeData.summary || "Not provided"}
Skills: ${resumeData.skills?.join(", ") || "None listed"}
Experience:
${resumeData.experience?.map((e: any) => `- ${e.jobTitle} at ${e.company}: ${e.bullets?.join("; ")}`).join("\n") || "None"}
Education: ${resumeData.education?.map((e: any) => `${e.degree} from ${e.school}`).join(", ") || "None"}

ANALYSIS REQUIRED:
1. Calculate a match score (0-100)
2. Extract required keywords from job description
3. Identify which keywords are present/missing in resume
4. Provide specific suggestions for each resume section
5. Identify the most critical gaps

Return as JSON:
{
  "matchScore": 75,
  "summary": "Brief overall assessment",
  "keywords": {
    "required": ["keyword1", "keyword2"],
    "found": ["keyword1"],
    "missing": ["keyword2"]
  },
  "sectionFeedback": {
    "summary": "Specific feedback for summary section",
    "experience": "Specific feedback for experience",
    "skills": "Specific feedback for skills",
    "education": "Specific feedback for education"
  },
  "criticalGaps": ["Gap 1", "Gap 2"],
  "quickWins": ["Easy improvement 1", "Easy improvement 2"],
  "suggestedSkillsToAdd": ["skill1", "skill2"],
  "suggestedBulletImprovements": [
    {
      "original": "original bullet if weak",
      "improved": "suggested improvement"
    }
  ]
}

Return ONLY valid JSON.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = (message.content[0] as { type: string; text: string }).text.trim();

    let analysis;
    try {
      // Try to extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch {
      return NextResponse.json(
        { error: "Failed to parse analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error matching job:", error);
    return NextResponse.json(
      { error: "Failed to analyze job match" },
      { status: 500 }
    );
  }
}
