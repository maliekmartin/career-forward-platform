import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    console.log("[FULL-TEST] Step 1: Looking up user");
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("[FULL-TEST] Step 2: User found");

    console.log("[FULL-TEST] Step 3: Verifying password");
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    console.log("[FULL-TEST] Step 4: Password valid");

    const userAgent = request.headers.get("user-agent") || undefined;

    console.log("[FULL-TEST] Step 5: Creating session");
    const sessionToken = await createSession(user.id, rememberMe, userAgent);
    console.log("[FULL-TEST] Step 6: Session created");

    console.log("[FULL-TEST] Step 7: Updating last login");
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    console.log("[FULL-TEST] Step 8: Last login updated");

    console.log("[FULL-TEST] Step 9: Creating response");
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });

    console.log("[FULL-TEST] Step 10: Setting cookie");
    response.cookies.set("career_quest_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
    });

    console.log("[FULL-TEST] Step 11: Returning response");
    return response;
  } catch (error) {
    console.error("[FULL-TEST] Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
