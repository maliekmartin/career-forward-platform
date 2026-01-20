import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { z } from "zod";

// Validation schema for profile update
const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  phone: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "NON_BINARY", "PREFER_NOT_TO_SAY"]).optional().nullable(),
  yearsInIndustry: z.number().int().min(0).max(50).optional().nullable(),
  currentIndustry: z.string().max(100).optional().nullable(),
  careerGoal: z.enum(["SAME_INDUSTRY", "NEW_INDUSTRY", "CERTIFICATION"]).optional().nullable(),
  profileCompleted: z.boolean().optional(),
});

// Resume content schema (stored in Resume model)
const resumeContentSchema = z.object({
  summary: z.string().optional(),
  experience: z.array(z.object({
    id: z.string(),
    company: z.string(),
    title: z.string(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
    description: z.string().optional(),
    highlights: z.array(z.string()).optional(),
  })).optional(),
  education: z.array(z.object({
    id: z.string(),
    institution: z.string(),
    degree: z.string().optional(),
    field: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    gpa: z.string().optional(),
  })).optional(),
  skills: z.array(z.string()).optional(),
  certifications: z.array(z.object({
    id: z.string(),
    name: z.string(),
    issuer: z.string().optional(),
    dateObtained: z.string().optional(),
    expirationDate: z.string().optional(),
  })).optional(),
});

// Combined schema for the full onboarding update
const onboardingUpdateSchema = z.object({
  profile: profileUpdateSchema,
  resumeContent: resumeContentSchema.optional(),
  resumeName: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user with profile
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        profile: true,
        resumes: {
          orderBy: { updatedAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: user.profile,
      latestResume: user.resumes[0] || null,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = onboardingUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { profile: profileData, resumeContent, resumeName } = validationResult.data;

    // Get or create profile
    let profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
    });

    if (profile) {
      // Update existing profile
      profile = await prisma.profile.update({
        where: { userId: session.userId },
        data: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          gender: profileData.gender,
          yearsInIndustry: profileData.yearsInIndustry,
          currentIndustry: profileData.currentIndustry,
          careerGoal: profileData.careerGoal,
          profileCompleted: profileData.profileCompleted ?? true,
        },
      });
    } else {
      // Create new profile
      profile = await prisma.profile.create({
        data: {
          userId: session.userId,
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          gender: profileData.gender,
          yearsInIndustry: profileData.yearsInIndustry,
          currentIndustry: profileData.currentIndustry,
          careerGoal: profileData.careerGoal,
          profileCompleted: profileData.profileCompleted ?? true,
        },
      });
    }

    // If resume content provided, create/update resume
    let resume = null;
    if (resumeContent) {
      // Check for existing resume
      const existingResume = await prisma.resume.findFirst({
        where: { userId: session.userId },
        orderBy: { updatedAt: "desc" },
      });

      if (existingResume) {
        resume = await prisma.resume.update({
          where: { id: existingResume.id },
          data: {
            name: resumeName || "My Resume",
            content: resumeContent,
          },
        });
      } else {
        resume = await prisma.resume.create({
          data: {
            userId: session.userId,
            name: resumeName || "My Resume",
            templateId: "default",
            content: resumeContent,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      profile,
      resume,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
