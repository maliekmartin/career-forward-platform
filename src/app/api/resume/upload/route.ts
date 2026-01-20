import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { parseResumeFromBuffer } from "@/lib/services/resume-parser";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF or Word document." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Read file into buffer for parsing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const blobPath = `resumes/${session.userId}/${timestamp}-${sanitizedName}`;

    let fileUrl: string;

    // Check if Vercel Blob is configured
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Upload to Vercel Blob
      const blob = await put(blobPath, file, {
        access: "public",
        addRandomSuffix: false,
      });
      fileUrl = blob.url;
    } else {
      // Development fallback - use a placeholder URL
      console.warn("BLOB_READ_WRITE_TOKEN not set - using mock URL for development");
      fileUrl = `https://placeholder.dev/uploads/${blobPath}`;
    }

    // Create document record in database
    const document = await prisma.document.create({
      data: {
        userId: session.userId,
        type: "RESUME_UPLOAD",
        filename: file.name,
        fileUrl: fileUrl,
        fileSize: file.size,
        mimeType: file.type,
      },
    });

    // Parse the resume directly from buffer
    const parseResult = await parseResumeFromBuffer(buffer, file.type);

    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        filename: document.filename,
        fileUrl: document.fileUrl,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
      },
      parsed: parseResult.success ? parseResult.data : null,
      parseError: parseResult.success ? null : parseResult.error,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload resume. Please try again." },
      { status: 500 }
    );
  }
}
