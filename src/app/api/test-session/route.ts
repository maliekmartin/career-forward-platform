import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

export async function GET() {
  try {
    // Try to create a session for the test user
    const sessionToken = await createSession("test_03e453bf66cb805ddd64", false, "test-user-agent");

    return NextResponse.json({
      success: true,
      message: "Session created successfully",
      hasToken: !!sessionToken,
      tokenLength: sessionToken.length,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Session creation failed",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
