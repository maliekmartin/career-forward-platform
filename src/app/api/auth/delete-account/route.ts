import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getCurrentSession, clearSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth";
import { z } from "zod";

const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
  confirmation: z.literal("DELETE MY ACCOUNT"),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const validationResult = deleteAccountSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          message: "Please provide your password and type 'DELETE MY ACCOUNT' to confirm.",
        },
        { status: 400 }
      );
    }

    const { password } = validationResult.data;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, passwordHash: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 400 }
      );
    }

    // Delete user and all related data (cascading deletes should handle most relations)
    // The Prisma schema has onDelete: Cascade for most relations
    await prisma.$transaction(async (tx) => {
      // Delete sessions first
      await tx.session.deleteMany({ where: { userId: user.id } });

      // Delete verification tokens
      await tx.verificationToken.deleteMany({ where: { email: user.email } });

      // Delete the user (cascade will handle related records)
      await tx.user.delete({ where: { id: user.id } });
    });

    // Clear current session cookie
    await clearSession();

    // Return success with redirect instruction
    const response = NextResponse.json({
      success: true,
      message: "Your account has been permanently deleted.",
      redirect: "/",
    });

    // Clear the session cookie
    response.cookies.delete("career_quest_session");

    return response;
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again or contact support." },
      { status: 500 }
    );
  }
}
