import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

// GET /api/resume/[id]/tailored - Get tailored versions of a resume
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the resume belongs to the user
    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId: session.userId,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Get tailored versions
    const tailored = await prisma.tailoredResume.findMany({
      where: {
        masterResumeId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ tailored });
  } catch (error) {
    console.error("Failed to fetch tailored resumes:", error);
    return NextResponse.json({ error: "Failed to fetch tailored resumes" }, { status: 500 });
  }
}

// POST /api/resume/[id]/tailored - Create a tailored version for a job
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { targetJobTitle, targetCompany, jobDescription } = body;

    if (!targetJobTitle || !targetCompany) {
      return NextResponse.json(
        { error: "Job title and company are required" },
        { status: 400 }
      );
    }

    // Verify the resume belongs to the user
    const resume = await prisma.resume.findFirst({
      where: {
        id,
        userId: session.userId,
      },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // If job description provided, use AI to optimize content
    let optimizedContent = resume.content as object;
    let matchScore = null;

    if (jobDescription) {
      const prompt = `You are a professional resume optimization expert. Given the following resume content and job description, optimize the resume for this specific role.

RESUME CONTENT:
${JSON.stringify(resume.content, null, 2)}

JOB DESCRIPTION:
${jobDescription}

TARGET ROLE: ${targetJobTitle} at ${targetCompany}

Provide an optimized version of the resume that:
1. Tailors the summary to highlight relevant experience for this specific role
2. Reorders and emphasizes bullet points that match the job requirements
3. Adds or emphasizes relevant keywords from the job description
4. Keeps all facts accurate - only reword, don't fabricate

Return a JSON object with:
{
  "optimizedContent": { ...the complete resume data in same format as input... },
  "matchScore": number between 0-100,
  "optimizations": ["list of changes made"]
}

Return ONLY the JSON object, no other text.`;

      try {
        const message = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }],
        });

        const responseText =
          message.content[0].type === "text" ? message.content[0].text : "";
        const parsed = JSON.parse(responseText);
        optimizedContent = parsed.optimizedContent;
        matchScore = parsed.matchScore;
      } catch (e) {
        console.error("AI optimization failed:", e);
        // Continue with original content if AI fails
      }
    }

    // Create tailored resume
    const tailored = await prisma.tailoredResume.create({
      data: {
        masterResumeId: id,
        name: `${targetJobTitle} - ${targetCompany}`,
        targetJobTitle,
        targetCompany,
        jobDescription,
        matchScore,
        content: optimizedContent,
        templateId: resume.templateId,
      },
    });

    return NextResponse.json({ tailored });
  } catch (error) {
    console.error("Failed to create tailored resume:", error);
    return NextResponse.json({ error: "Failed to create tailored resume" }, { status: 500 });
  }
}
