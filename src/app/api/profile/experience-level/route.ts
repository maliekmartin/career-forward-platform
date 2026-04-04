import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { z } from "zod";

// Validation schema
const experienceLevelSchema = z.object({
  resumeExperienceLevel: z.enum(["beginner", "expert"]),
});

// PUT - Update user's resume experience level preference
export async function PUT(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = experienceLevelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { resumeExperienceLevel } = validation.data;

    // Update profile
    const profile = await prisma.profile.upsert({
      where: { userId: session.userId },
      update: { resumeExperienceLevel },
      create: {
        userId: session.userId,
        resumeExperienceLevel,
      },
    });

    return NextResponse.json({
      success: true,
      resumeExperienceLevel: profile.resumeExperienceLevel,
    });
  } catch (error) {
    console.error("Error updating experience level:", error);
    return NextResponse.json(
      { error: "Failed to update experience level" },
      { status: 500 }
    );
  }
}
