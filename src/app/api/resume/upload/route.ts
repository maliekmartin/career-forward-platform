import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { parseResumeFromBuffer } from "@/lib/services/resume-parser";
import { uploadFile, getSignedUrl, trackFileUpload } from "@/lib/supabase";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
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
        { error: "Invalid file type. Please upload a PDF, Word document, or text file." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Read file into buffer for parsing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${session.userId}/${timestamp}-${sanitizedName}`;

    // Upload to Supabase Storage
    const uploadResult = await uploadFile('resumes', filePath, file, {
      contentType: file.type,
      upsert: false,
    });

    if ('error' in uploadResult) {
      console.error("Supabase upload error:", uploadResult.error);
      return NextResponse.json(
        { error: "Failed to upload resume. Please try again." },
        { status: 500 }
      );
    }

    // Create document record in database
    const document = await prisma.document.create({
      data: {
        userId: session.userId,
        type: "RESUME_UPLOAD",
        filename: file.name,
        fileUrl: uploadResult.url,
        fileSize: file.size,
        mimeType: file.type,
      },
    });

    // Track the file upload in Supabase
    await trackFileUpload(session.userId, {
      bucket: 'resumes',
      filePath: uploadResult.path,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      purpose: 'resume',
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

// GET endpoint to retrieve a signed URL for a resume
export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID required" },
        { status: 400 }
      );
    }

    // Get document from database
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId: session.userId,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // If it's a Supabase URL, generate a fresh signed URL
    if (document.fileUrl.includes('supabase')) {
      const urlParts = document.fileUrl.split('/resumes/');
      if (urlParts[1]) {
        // Remove any query params from the path
        const path = urlParts[1].split('?')[0];
        const signedUrlResult = await getSignedUrl('resumes', path, 3600);

        if ('error' in signedUrlResult) {
          return NextResponse.json(
            { error: "Failed to generate download URL" },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          url: signedUrlResult.url,
          filename: document.filename,
        });
      }
    }

    // Return the stored URL for non-Supabase files
    return NextResponse.json({
      success: true,
      url: document.fileUrl,
      filename: document.filename,
    });
  } catch (error) {
    console.error("Resume download error:", error);
    return NextResponse.json(
      { error: "Failed to get resume URL" },
      { status: 500 }
    );
  }
}
