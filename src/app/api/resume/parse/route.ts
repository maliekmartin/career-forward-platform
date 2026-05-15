import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { parseResume } from "@/lib/services/resume-parser";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { documentId, fileUrl, mimeType } = body;

    if (!fileUrl || !mimeType) {
      return NextResponse.json(
        { error: "File URL and MIME type are required" },
        { status: 400 }
      );
    }

    // If documentId provided, verify ownership
    if (documentId) {
      const document = await prisma.document.findUnique({
        where: { id: documentId },
      });

      if (!document || document.userId !== session.userId) {
        return NextResponse.json(
          { error: "Document not found or access denied" },
          { status: 404 }
        );
      }
    }

    // Parse the resume
    const result = await parseResume(fileUrl, mimeType);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to parse resume" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      source: result.source,
    });
  } catch (error) {
    console.error("Resume parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse resume. Please try again." },
      { status: 500 }
    );
  }
}
