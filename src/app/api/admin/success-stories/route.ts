import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";
import { z } from "zod";

// Schema for updating a success story
const updateStorySchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  rejectionReason: z.string().optional(),
});

// GET - Fetch all success stories for admin review
export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "PENDING" | "APPROVED" | "REJECTED" | null;

    const stories = await prisma.successStory.findMany({
      where: status ? { status } : undefined,
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: [
        { status: "asc" }, // PENDING first
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      stories,
    });
  } catch (error) {
    console.error("Error fetching success stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch success stories" },
      { status: 500 }
    );
  }
}

// PATCH - Update a success story (approve/reject/feature)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const validation = updateStorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { id, status, featured, sortOrder, rejectionReason } = validation.data;

    const story = await prisma.successStory.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(featured !== undefined && { featured }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(rejectionReason && { rejectionReason }),
        ...(status && {
          reviewedAt: new Date(),
          reviewedBy: session.userId,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      story,
    });
  } catch (error) {
    console.error("Error updating success story:", error);
    return NextResponse.json(
      { error: "Failed to update success story" },
      { status: 500 }
    );
  }
}
