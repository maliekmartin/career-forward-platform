import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { checkRateLimit, createRateLimitKey, RATE_LIMITS } from "@/lib/rate-limit";
import { z } from "zod";

// Schema for creating/updating a resume
const resumeSchema = z.object({
  name: z.string().min(1, "Resume name is required").max(100),
  templateId: z.string().min(1, "Template is required"),
  content: z.object({
    contactInfo: z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      phone: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
      linkedinUrl: z.string().optional(),
      portfolioUrl: z.string().optional(),
    }),
    summary: z.string(),
    experience: z.array(
      z.object({
        id: z.string(),
        jobTitle: z.string(),
        company: z.string(),
        city: z.string(),
        state: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        isCurrent: z.boolean(),
        bullets: z.array(z.string()),
      })
    ),
    education: z.array(
      z.object({
        id: z.string(),
        school: z.string(),
        degree: z.string(),
        fieldOfStudy: z.string(),
        city: z.string(),
        state: z.string(),
        graduationDate: z.string(),
        gpa: z.string().optional(),
        honors: z.string().optional(),
      })
    ),
    skills: z.array(z.string()),
    certifications: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        issuer: z.string(),
        dateObtained: z.string(),
        expirationDate: z.string().optional(),
        credentialId: z.string().optional(),
      })
    ),
  }),
});

// GET /api/resume - List user's resumes
export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: session.userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        templateId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

// POST /api/resume - Create a new resume
export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimitKey = createRateLimitKey("resume:create", session.userId);
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.RESUME_CREATE);
    if (!rateLimit.success) {
      const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many resume creation requests. Please try again later.",
          retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }

    // Check resume limit (max 3 for free users, unlimited for premium)
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { subscriptionTier: true },
    });

    const resumeCount = await prisma.resume.count({
      where: { userId: session.userId },
    });

    if (user?.subscriptionTier === "FREE" && resumeCount >= 3) {
      return NextResponse.json(
        {
          error: "Resume limit reached",
          message: "Free accounts can create up to 3 resumes. Upgrade to Premium for unlimited resumes.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validationResult = resumeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, templateId, content } = validationResult.data;

    const resume = await prisma.resume.create({
      data: {
        userId: session.userId,
        name,
        templateId,
        content: content as any,
      },
    });

    return NextResponse.json({
      id: resume.id,
      name: resume.name,
      templateId: resume.templateId,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    });
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    );
  }
}
