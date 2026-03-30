import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";

// GET /api/resume/[id]/versions - Get version history for a resume
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

    // Get version history
    const versions = await prisma.resumeVersion.findMany({
      where: {
        resumeId: id,
      },
      orderBy: {
        versionNumber: "desc",
      },
    });

    return NextResponse.json({ versions });
  } catch (error) {
    console.error("Failed to fetch versions:", error);
    return NextResponse.json({ error: "Failed to fetch versions" }, { status: 500 });
  }
}

// POST /api/resume/[id]/versions - Create a new version snapshot
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
    const { versionLabel, changeDescription } = body;

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

    // Get the latest version number
    const latestVersion = await prisma.resumeVersion.findFirst({
      where: { resumeId: id },
      orderBy: { versionNumber: "desc" },
    });

    const newVersionNumber = (latestVersion?.versionNumber || 0) + 1;

    // Create new version
    const version = await prisma.resumeVersion.create({
      data: {
        resumeId: id,
        content: resume.content as object,
        templateId: resume.templateId,
        versionNumber: newVersionNumber,
        versionLabel: versionLabel || `Version ${newVersionNumber}`,
        changeDescription,
      },
    });

    return NextResponse.json({ version });
  } catch (error) {
    console.error("Failed to create version:", error);
    return NextResponse.json({ error: "Failed to create version" }, { status: 500 });
  }
}
