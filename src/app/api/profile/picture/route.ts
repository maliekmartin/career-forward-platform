import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";

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

      // Upload to Vercel Blob
      const blob = await put(`profile-pictures/${session.userId}/${file.name}`, file, {
        access: "public",
      });

      profilePhotoUrl = blob.url;
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

    // Remove profile photo URL
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
