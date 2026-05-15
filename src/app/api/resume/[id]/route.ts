import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { z } from "zod";

// Schema for updating a resume
const updateResumeSchema = z.object({
  name: z.string().min(1, "Resume name is required").max(100).optional(),
  templateId: z.string().min(1, "Template is required").optional(),
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
  }).optional(),
});

// GET /api/resume/[id] - Get a single resume
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

    const resume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    // Verify ownership
    if (resume.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json({
      id: resume.id,
      name: resume.name,
      templateId: resume.templateId,
      content: resume.content,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

// PUT /api/resume/[id] - Update a resume
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existingResume = await prisma.resume.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (existingResume.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const validationResult = updateResumeSchema.safeParse(body);

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

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (templateId !== undefined) updateData.templateId = templateId;
    if (content !== undefined) updateData.content = content;

    const resume = await prisma.resume.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      id: resume.id,
      name: resume.name,
      templateId: resume.templateId,
      content: resume.content,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
    });
  } catch (error) {
    console.error("Error updating resume:", error);
    return NextResponse.json(
      { error: "Failed to update resume" },
      { status: 500 }
    );
  }
}

// DELETE /api/resume/[id] - Delete a resume
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const existingResume = await prisma.resume.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingResume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (existingResume.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.resume.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}
