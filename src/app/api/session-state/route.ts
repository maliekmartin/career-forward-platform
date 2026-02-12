import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";

// GET - Retrieve user's session state for dashboard
export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionState = await prisma.userSessionState.findUnique({
      where: { userId: session.userId },
    });

    if (!sessionState) {
      return NextResponse.json({
        success: true,
        sessionState: null,
      });
    }

    return NextResponse.json({
      success: true,
      sessionState: {
        lastPath: sessionState.lastPath,
        lastPathName: sessionState.lastPathName,
        lastVisitedAt: sessionState.lastVisitedAt,
        draftData: sessionState.draftData,
      },
    });
  } catch (error) {
    console.error("Error fetching session state:", error);
    return NextResponse.json(
      { error: "Failed to fetch session state" },
      { status: 500 }
    );
  }
}

// POST - Update session state (last path and/or draft data)
export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { lastPath, lastPathName, draftData, clearDraft } = body;

    // Build update data based on what was provided
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    if (lastPath !== undefined) {
      updateData.lastPath = lastPath;
      updateData.lastVisitedAt = new Date();
    }

    if (lastPathName !== undefined) {
      updateData.lastPathName = lastPathName;
    }

    if (clearDraft) {
      updateData.draftData = null;
    } else if (draftData !== undefined) {
      updateData.draftData = draftData;
    }

    // Upsert the session state
    const sessionState = await prisma.userSessionState.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        lastPath: lastPath || "/dashboard",
        lastPathName: lastPathName || "Dashboard",
        draftData: clearDraft ? null : draftData,
      },
      update: updateData,
    });

    return NextResponse.json({
      success: true,
      sessionState: {
        lastPath: sessionState.lastPath,
        lastPathName: sessionState.lastPathName,
        lastVisitedAt: sessionState.lastVisitedAt,
        draftData: sessionState.draftData,
      },
    });
  } catch (error) {
    console.error("Error updating session state:", error);
    return NextResponse.json(
      { error: "Failed to update session state" },
      { status: 500 }
    );
  }
}
