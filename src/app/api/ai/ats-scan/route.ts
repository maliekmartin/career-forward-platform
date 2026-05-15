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

    const { resumeData } = await request.json();

    if (!resumeData) {
      return NextResponse.json(
        { error: "Resume data is required" },
        { status: 400 }
      );
    }

    // Simulate ATS parsing - analyze what would be extracted
    const prompt = `You are simulating an Applicant Tracking System (ATS). Analyze this resume and show:
1. What the ATS would extract and how it would categorize the information
2. Potential parsing issues that could cause data loss
3. ATS compatibility score

RESUME DATA:
Contact: ${resumeData.contactInfo?.firstName} ${resumeData.contactInfo?.lastName}, ${resumeData.contactInfo?.email}, ${resumeData.contactInfo?.phone}
Location: ${resumeData.contactInfo?.city}, ${resumeData.contactInfo?.state}
Summary: ${resumeData.summary || "None"}
Skills: ${resumeData.skills?.join(", ") || "None"}
Experience:
${resumeData.experience?.map((e: any) => `${e.jobTitle} at ${e.company} (${e.startDate} - ${e.isCurrent ? "Present" : e.endDate})\n${e.bullets?.join("\n")}`).join("\n\n") || "None"}
Education:
${resumeData.education?.map((e: any) => `${e.degree} in ${e.fieldOfStudy} from ${e.school} (${e.graduationDate})`).join("\n") || "None"}
Certifications:
${resumeData.certifications?.map((c: any) => `${c.name} - ${c.issuer}`).join("\n") || "None"}

Return JSON:
{
  "atsScore": 85,
  "parsedData": {
    "name": "extracted name or null if issue",
    "email": "extracted email",
    "phone": "extracted phone",
    "location": "extracted location",
    "currentTitle": "most recent job title",
    "totalExperience": "X years",
    "skills": ["skill1", "skill2"],
    "education": "highest degree",
    "certifications": ["cert1"]
  },
  "issues": [
    {
      "severity": "high|medium|low",
      "section": "affected section",
      "issue": "description of the problem",
      "fix": "how to fix it"
    }
  ],
  "formatting": {
    "score": 90,
    "feedback": ["Good: uses standard sections", "Issue: ..."]
  },
  "keywords": {
    "detected": ["keyword1", "keyword2"],
    "density": "good|low|high"
  },
  "compatibilityByATS": {
    "workday": 90,
    "taleo": 85,
    "greenhouse": 92,
    "icims": 88
  }
}

Return ONLY valid JSON.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText = (message.content[0] as { type: string; text: string }).text.trim();

    let analysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch {
      return NextResponse.json(
        { error: "Failed to parse ATS analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error scanning ATS:", error);
    return NextResponse.json(
      { error: "Failed to scan resume" },
      { status: 500 }
    );
  }
}
