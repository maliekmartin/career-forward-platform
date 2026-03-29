import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { uploadFile, deleteFile, trackFileUpload } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const presetUrl = formData.get("presetUrl") as string | null;

    let profilePhotoUrl: string;

    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image." },
          { status: 400 }
        );
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "File too large. Maximum size is 5MB." },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const extension = file.name.split('.').pop() || 'jpg';
      const filePath = `${session.userId}/${timestamp}.${extension}`;

      // Upload to Supabase Storage
      const uploadResult = await uploadFile('avatars', filePath, file, {
        contentType: file.type,
        upsert: true,
      });

      if ('error' in uploadResult) {
        console.error("Supabase upload error:", uploadResult.error);
        return NextResponse.json(
          { error: "Failed to upload image. Please try again." },
          { status: 500 }
        );
      }

      profilePhotoUrl = uploadResult.url;

      // Track the file upload
      await trackFileUpload(session.userId, {
        bucket: 'avatars',
        filePath: uploadResult.path,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        purpose: 'avatar',
      });
    } else if (presetUrl) {
      // Using a preset avatar
      profilePhotoUrl = presetUrl;
    } else {
      return NextResponse.json(
        { error: "No file or preset avatar provided" },
        { status: 400 }
      );
    }

    // Update profile with new photo URL
    const profile = await prisma.profile.update({
      where: { userId: session.userId },
      data: { profilePhotoUrl },
    });

    return NextResponse.json({
      success: true,
      profilePhotoUrl: profile.profilePhotoUrl,
    });
  } catch (error) {
    console.error("Profile picture upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload profile picture" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current profile to find the file path
    const profile = await prisma.profile.findUnique({
      where: { userId: session.userId },
      select: { profilePhotoUrl: true },
    });

    // If it's a Supabase URL, delete the file from storage
    if (profile?.profilePhotoUrl?.includes('supabase')) {
      // Extract path from URL
      const urlParts = profile.profilePhotoUrl.split('/avatars/');
      if (urlParts[1]) {
        await deleteFile('avatars', urlParts[1]);
      }
    }

    // Remove profile photo URL from database
    await prisma.profile.update({
      where: { userId: session.userId },
      data: { profilePhotoUrl: null },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile picture delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete profile picture" },
      { status: 500 }
    );
  }
}
