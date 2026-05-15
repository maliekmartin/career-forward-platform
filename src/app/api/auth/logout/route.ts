import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST() {
  try {
    // Get and delete session from database
    const session = await getCurrentSession();

    if (session) {
      await prisma.session.delete({
        where: { id: session.sessionId },
      }).catch(() => {
        // Session might already be deleted
      });
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear session cookie on the response
    response.cookies.delete("career_quest_session");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        error: true,
        code: "INTERNAL_ERROR",
        message: "An error occurred during logout",
      },
      { status: 500 }
    );
  }
}
