import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const SESSION_COOKIE_NAME = "career_quest_session";

interface SessionPayload {
  userId: string;
  sessionId: string;
}

/**
 * Create a new session for a user
 */
export async function createSession(
  userId: string,
  rememberMe: boolean = false,
  deviceInfo?: string
): Promise<string> {
  // Session expires in 24 hours, or 30 days if "remember me"
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 1));

  // Generate a random token
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // Create session in database
  const session = await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
      rememberMe,
      deviceInfo,
    },
  });

  // Create JWT containing session info
  const jwtToken = jwt.sign(
    { userId, sessionId: session.id } as SessionPayload,
    JWT_SECRET,
    { expiresIn: rememberMe ? "30d" : "24h" }
  );

  return jwtToken;
}

/**
 * Verify and get session from JWT token
 */
export async function verifySession(token: string): Promise<{
  userId: string;
  sessionId: string;
} | null> {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as SessionPayload;

    // Verify session exists and is not expired
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return {
      userId: payload.userId,
      sessionId: payload.sessionId,
    };
  } catch {
    return null;
  }
}

/**
 * Get the current session from cookies
 */
export async function getCurrentSession(): Promise<{
  userId: string;
  sessionId: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySession(token);
}

/**
 * Set session cookie
 */
export async function setSessionCookie(
  token: string,
  rememberMe: boolean = false
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 1 day
  });
}

/**
 * Clear session cookie and delete session from database
 */
export async function clearSession(): Promise<void> {
  const session = await getCurrentSession();

  if (session) {
    await prisma.session.delete({
      where: { id: session.sessionId },
    }).catch(() => {
      // Session might already be deleted
    });
  }

  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Delete all sessions for a user (e.g., on password change)
 */
export async function deleteAllUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { userId },
  });
}
