import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check subscription
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        profile: true,
        scores: {
          orderBy: { calculatedAt: "desc" },
          take: 1,
        },
        resumes: {
          orderBy: { updatedAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPremium = user.subscriptionTier === "PREMIUM" && user.subscriptionStatus === "active";
    if (!isPremium) {
      return NextResponse.json(
        { error: "Compass is a premium feature. Subscribe to start chatting!" },
        { status: 403 }
      );
    }

    const { message, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    // Build context about the user
    const latestScore = user.scores[0];
    const latestResume = user.resumes[0];
    const recommendations = latestScore?.recommendations as Array<{
      title: string;
      description: string;
      priority: string;
      potentialGain: number;
    }> || [];

    const userContext = `
## User Profile
- Name: ${user.profile?.firstName || "Unknown"} ${user.profile?.lastName || ""}
- Industry: ${user.profile?.currentIndustry || "Not specified"}
- Years of Experience: ${user.profile?.yearsInIndustry || "Not specified"}
- Career Goal: ${user.profile?.careerGoal || "Not specified"}

## Current Scores
${latestScore ? `
- Total Score: ${latestScore.totalScore}/100
- Resume Quality Score: ${latestScore.resumeQualityTotal}/30
  - Formatting & Structure: ${latestScore.formattingStructure}/10.5
  - Spelling & Grammar: ${latestScore.spellingGrammar}/7.5
  - Length & Brevity: ${latestScore.lengthBrevity}/6
  - Relevance & Clarity: ${latestScore.relevanceClarity}/6
- Job Seeker Score: ${latestScore.jobSeekerTotal}/70
  - Education: ${latestScore.educationScore}/15
  - Job Tenure: ${latestScore.tenureScore}/20
  - Employment Gaps: ${latestScore.gapsScore}/15
  - Market Match: ${latestScore.marketMatchScore}/20
- Market Demand: ${latestScore.marketDemandLevel || "Unknown"}
` : "No scores calculated yet."}

## Active Recommendations
${recommendations.length > 0
  ? recommendations.map((r, i) => `${i + 1}. [${r.priority.toUpperCase()}] ${r.title}: ${r.description} (+${r.potentialGain} pts)`).join("\n")
  : "No recommendations available."
}

## Resume Summary
${latestResume?.content ? "Resume data available in system." : "No resume uploaded yet."}
`;

    // Build conversation messages
    const messages = [
      ...(conversationHistory || []).map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: `You are Compass, a friendly and experienced career coach at Career Forward. You've helped hundreds of job seekers land their dream roles. You're warm, encouraging, and speak like a supportive mentor - not a robot.

About you:
- Your name is Compass because you help people find their direction
- You're conversational and genuine, like texting with a trusted advisor
- You celebrate wins, no matter how small
- You give honest feedback with kindness
- You've been in their shoes and understand job searching is tough

Current user context:
${userContext}

How to communicate:
- Write in plain text only. Never use asterisks, bullet points, numbered lists, or any markdown formatting
- Keep it casual and warm, like you're chatting with a friend who happens to be a career expert
- Use short paragraphs. Break up your thoughts naturally
- Reference their name and specific situation to make it personal
- Share advice like you're giving tips over coffee, not delivering a corporate presentation
- If they seem stressed, acknowledge their feelings first before diving into advice
- Keep responses focused - 2-3 short paragraphs unless they ask for more detail

Topics you help with:
- Understanding and improving their Career Forward scores
- Resume improvements and job search strategies
- Interview prep and salary negotiation
- Career transitions and goal setting
- Implementing the specific recommendations from their score analysis`,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Claude API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get response from AI coach" },
        { status: 500 }
      );
    }

    const result = await response.json();
    const assistantMessage = result.content?.[0]?.text;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "No response from AI coach" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: assistantMessage,
    });
  } catch (error) {
    console.error("AI Coach error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
