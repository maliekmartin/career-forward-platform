import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        step: "user_lookup",
        message: "User not found",
      });
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    return NextResponse.json({
      success: true,
      step: "password_verified",
      passwordValid: isValidPassword,
      userId: user.id,
      email: user.email,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      step: "error",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
