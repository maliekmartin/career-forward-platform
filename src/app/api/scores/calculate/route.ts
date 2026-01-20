import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { calculateScores } from "@/lib/services/scoring-service";
import type { ParsedResume } from "@/lib/services/resume-parser";

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { parsedResume, rawText, targetRole, location, industry } = body as {
      parsedResume: ParsedResume;
      rawText?: string;
      targetRole?: string;
      location?: string;
      industry?: string;
    };

    if (!parsedResume) {
      return NextResponse.json(
        { error: "Parsed resume data is required" },
        { status: 400 }
      );
    }

    // Calculate scores
    const scores = await calculateScores(
      parsedResume,
      rawText,
      targetRole,
      location,
      industry
    );

    // Store scores in database
    const storedScore = await prisma.jobSeekerScore.create({
      data: {
        userId: session.userId,
        totalScore: scores.totalScore,
        resumeQualityTotal: scores.resumeQuality.total,
        jobSeekerTotal: scores.jobSeeker.total,
        formattingStructure: scores.resumeQuality.formattingStructure,
        spellingGrammar: scores.resumeQuality.spellingGrammar,
        lengthBrevity: scores.resumeQuality.lengthBrevity,
        relevanceClarity: scores.resumeQuality.relevanceClarity,
        educationScore: scores.jobSeeker.education,
        tenureScore: scores.jobSeeker.tenure,
        gapsScore: scores.jobSeeker.gaps,
        marketMatchScore: scores.jobSeeker.marketMatch,
        marketDemandLevel: scores.marketData?.demandLevel,
        localMarketScore: scores.marketData?.localScore,
        regionalMarketScore: scores.marketData?.regionalScore,
        remoteMarketScore: scores.marketData?.remoteScore,
        recommendations: scores.recommendations,
        calculatedAt: new Date(scores.calculatedAt),
      },
    });

    return NextResponse.json({
      success: true,
      scoreId: storedScore.id,
      scores,
    });
  } catch (error) {
    console.error("Score calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate scores" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's subscription status
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        subscriptionTier: true,
        subscriptionStatus: true,
      },
    });

    // Get latest score
    const latestScore = await prisma.jobSeekerScore.findFirst({
      where: { userId: session.userId },
      orderBy: { calculatedAt: "desc" },
    });

    if (!latestScore) {
      return NextResponse.json({
        success: true,
        hasScore: false,
        scores: null,
      });
    }

    const isPremium = user?.subscriptionTier === "PREMIUM" && user?.subscriptionStatus === "active";

    // Return scores - recommendations are blurred for free users
    return NextResponse.json({
      success: true,
      hasScore: true,
      isPremium,
      scores: {
        totalScore: latestScore.totalScore,
        resumeQuality: {
          formattingStructure: latestScore.formattingStructure,
          spellingGrammar: latestScore.spellingGrammar,
          lengthBrevity: latestScore.lengthBrevity,
          relevanceClarity: latestScore.relevanceClarity,
          total: latestScore.resumeQualityTotal,
        },
        jobSeeker: {
          education: latestScore.educationScore,
          tenure: latestScore.tenureScore,
          gaps: latestScore.gapsScore,
          marketMatch: latestScore.marketMatchScore,
          total: latestScore.jobSeekerTotal,
        },
        marketData: {
          demandLevel: latestScore.marketDemandLevel,
          localScore: latestScore.localMarketScore,
          regionalScore: latestScore.regionalMarketScore,
          remoteScore: latestScore.remoteMarketScore,
        },
        // Only return full recommendations for premium users
        recommendations: isPremium
          ? latestScore.recommendations
          : (latestScore.recommendations as Array<{ title: string; priority: string }>).map((r) => ({
              title: r.title,
              priority: r.priority,
              // Blur the description for free users
              description: "Subscribe to unlock this recommendation",
              isBlurred: true,
            })),
        calculatedAt: latestScore.calculatedAt,
      },
    });
  } catch (error) {
    console.error("Get scores error:", error);
    return NextResponse.json(
      { error: "Failed to get scores" },
      { status: 500 }
    );
  }
}
